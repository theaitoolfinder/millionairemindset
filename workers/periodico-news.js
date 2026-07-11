/**
 * periodico-news — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches today's headlines from Philstar's Business or Sports RSS feed
 * (?feed=business|sports, defaults to business), then uses Claude Haiku to
 * rewrite each headline + summary in original wording — factually faithful,
 * but not a copy of the source's phrasing. Source attribution and the
 * original article link are always kept and shown on the page.
 *
 * Business feed is used (not the general headlines feed) so Periodico's
 * front page naturally stays on economy/work/OFW-relevant news instead of
 * partisan political conflict.
 *
 * Runs once per calendar day per feed: cached at Cloudflare's edge for 24h.
 *
 * Worker secret required: ANTHROPIC_API_KEY (console.anthropic.com)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const ALLOWED_ORIGINS = [
  'https://www.millionairemindset.ae',
  'https://millionairemindset.ae',
  'https://theaitoolfinder.github.io',
  'http://localhost',
  'http://127.0.0.1',
];
const FEEDS = {
  business:      { url: 'https://www.philstar.com/rss/business',      source: 'Philstar.com Business' },
  sports:        { url: 'https://www.philstar.com/rss/sports',        source: 'Philstar.com Sports' },
  entertainment: { url: 'https://www.philstar.com/rss/entertainment', source: 'Philstar.com Entertainment' },
};

function decodeEntities(s) {
  return (s || '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');
}
function tag(block, name) {
  const m = block.match(new RegExp('<' + name + '[^>]*>([\\s\\S]*?)<\\/' + name + '>'));
  return m ? decodeEntities(m[1].replace(/^<!\[CDATA\[|\]\]>$/g, '').trim()) : '';
}
function parseRss(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const block of itemBlocks) {
    items.push({
      title: tag(block, 'title'),
      link: tag(block, 'link'),
      description: tag(block, 'description'),
      author: tag(block, 'author'),
      pubDate: tag(block, 'pubDate'),
    });
  }
  return items;
}
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
  const source = items.map((it, i) => ({ id: i, title: it.title, summary: stripHtml(it.description).slice(0, 500) }));
  const prompt = `You are a newspaper sub-editor rewriting wire headlines for "Periodico", an OFW-focused newspaper. For each item below, write a NEW headline and a NEW 2-sentence summary in your own original wording — do not copy phrases from the source. Stay strictly factually faithful; never add, remove, or change facts, names, numbers, or dates. Keep a neutral, professional newspaper tone.

Return ONLY a JSON array, same length and order as the input, each element: {"id": <number>, "title": "<rewritten headline>", "summary": "<rewritten 2-sentence summary>"}. No markdown, no explanation.

Source items:
${JSON.stringify(source, null, 2)}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 4096, messages: [{ role: 'user', content: prompt }] }),
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
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const url = new URL(request.url);
    const feedKey = FEEDS[url.searchParams.get('feed')] ? url.searchParams.get('feed') : 'business';
    const feed = FEEDS[feedKey];

    const cache = caches.default;
    const cacheKey = new Request('https://periodico-news.internal/edition?feed=' + feedKey + '&day=' + todayKey());
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const rssRes = await fetch(feed.url, {
        headers: { 'User-Agent': 'MillionaireMindsetPeriodico/1.0 (https://www.millionairemindset.ae; hello@millionairemindset.ae)' },
      });
      if (!rssRes.ok) throw new Error('Philstar RSS HTTP ' + rssRes.status);
      const xml = await rssRes.text();
      const allItems = parseRss(xml);
      if (!allItems.length) throw new Error('RSS parse returned 0 items');
      const items = allItems.slice(0, 10);

      const rewritten = await rewriteWithClaude(items, env.ANTHROPIC_API_KEY);

      const result = items.map((it, i) => {
        const r = rewritten.find(x => x.id === i) || {};
        return {
          title: r.title || it.title,
          summary: r.summary || stripHtml(it.description).slice(0, 200),
          link: it.link,
          author: it.author || '',
          pubDate: it.pubDate,
          source: feed.source,
        };
      });

      const payload = JSON.stringify({ status: 'ok', day: todayKey(), feed: feedKey, items: result });
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
