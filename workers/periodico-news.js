/**
 * periodico-news — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches today's Philippine headlines from Philstar's RSS feed, then uses
 * Claude Haiku to rewrite each headline + summary in original wording —
 * factually faithful, but not a copy of the source's phrasing. Source
 * attribution and the original article link are always kept and shown
 * on the page; this rewrite step exists so Periodico isn't just
 * republishing another outlet's sentences verbatim.
 *
 * Runs once per calendar day: the result is cached at Cloudflare's edge
 * for 24h, so the LLM is called once per day total (not per visitor) and
 * every visitor that day sees the same rewritten edition.
 *
 * Worker secret required (Settings → Variables → Secrets):
 *   ANTHROPIC_API_KEY — Claude API key (console.anthropic.com)
 *
 * To deploy:
 *   1. Cloudflare Workers → Create Worker → paste this file → Deploy
 *   2. Settings → Variables → add ANTHROPIC_API_KEY as a secret
 *   3. Confirm the worker URL matches NEWS_EP in periodico.html
 * ─────────────────────────────────────────────────────────────────────────────
 */

const ALLOWED_ORIGINS = [
  'https://www.millionairemindset.ae',
  'https://millionairemindset.ae',
  'https://theaitoolfinder.github.io',
  'http://localhost',
  'http://127.0.0.1',
];
const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.philstar.com/rss/headlines');
const SOURCE_NAME = 'Philstar.com';

function cors(origin) {
  const o = ALLOWED_ORIGINS.find(a => origin && origin.startsWith(a)) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function todayKey() {
  const d = new Date();
  return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
}

function stripHtml(s) {
  return (s || '').replace(/<[^>]+>/g, '').trim();
}

async function rewriteWithClaude(items, apiKey) {
  const source = items.map((it, i) => ({
    id: i,
    title: it.title,
    summary: stripHtml(it.description).slice(0, 500),
  }));

  const prompt = `You are a newspaper sub-editor rewriting wire headlines for "Periodico", an OFW-focused newspaper. For each item below, write a NEW headline and a NEW 2-sentence summary in your own original wording — do not copy phrases from the source. Stay strictly factually faithful to the source; never add, remove, or change facts, names, numbers, or dates. Keep a neutral, professional newspaper tone.

Return ONLY a JSON array, same length and order as the input, each element: {"id": <number>, "title": "<rewritten headline>", "summary": "<rewritten 2-sentence summary>"}. No markdown, no explanation, just the JSON array.

Source items:
${JSON.stringify(source, null, 2)}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error('Claude API error ' + res.status);
  const data = await res.json();
  const text = data.content && data.content[0] && data.content[0].text;
  if (!text) throw new Error('empty Claude response');

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('no JSON array in Claude response');
  return JSON.parse(jsonMatch[0]);
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    const cache = caches.default;
    const cacheKey = new Request('https://periodico-news.internal/edition?day=' + todayKey());
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const rssRes = await fetch(RSS_URL, {
        headers: { 'User-Agent': 'MillionaireMindsetPeriodico/1.0 (https://www.millionairemindset.ae; hello@millionairemindset.ae)' },
      });
      if (!rssRes.ok) throw new Error('rss2json HTTP ' + rssRes.status);
      const rssData = await rssRes.json();
      if (rssData.status !== 'ok' || !rssData.items || !rssData.items.length) {
        throw new Error('rss2json returned: ' + JSON.stringify(rssData).slice(0, 200));
      }
      const items = rssData.items.slice(0, 10);

      const rewritten = await rewriteWithClaude(items, env.ANTHROPIC_API_KEY);

      const result = items.map((it, i) => {
        const r = rewritten.find(x => x.id === i) || {};
        return {
          title: r.title || it.title,
          summary: r.summary || stripHtml(it.description).slice(0, 200),
          link: it.link,
          author: it.author || '',
          pubDate: it.pubDate,
          source: SOURCE_NAME,
        };
      });

      const payload = JSON.stringify({ status: 'ok', day: todayKey(), items: result });

      const toCache = new Response(payload, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' } });
      ctx.waitUntil(cache.put(cacheKey, toCache));

      return new Response(payload, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    } catch (err) {
      return new Response(JSON.stringify({ status: 'error', error: String(err && err.message || err) }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }
  },
};
