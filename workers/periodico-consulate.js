/**
 * periodico-consulate — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Claude's built-in web search tool to research current embassy/
 * consulate advisories, events, and reminders for the top OFW destination
 * countries, and writes short original bulletins with source links —
 * instead of just static "visit this site" links.
 *
 * This is genuinely researched each day (web search is real, live), but
 * treat it as a starting point, not a guarantee: government sites change
 * without notice and search coverage varies. Always confirm anything
 * urgent (visa deadlines, amnesty programs) directly with the official
 * source link included in each bulletin.
 *
 * Cached at Cloudflare's edge for 24h — Claude + web search runs once per
 * day total, not per visitor.
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

const COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Hong Kong',
  'Singapore', 'Italy', 'Japan', 'Canada', 'United Kingdom', 'United States', 'Bahrain',
];

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

async function researchCountry(country, apiKey) {
  const prompt = `Search the web for the most recent, currently-relevant news from the Philippine Embassy or Consulate General in ${country} — announcements, events, service schedules, visa/amnesty reminders, or advisories for Overseas Filipino Workers. Prioritize official Philippine government sources (dfa.gov.ph, dmw.gov.ph, or the specific embassy/consulate site for ${country}) and recent OFW-relevant news coverage.

Write 2-3 short original bullet points (max 25 words each) summarizing what you found, in your own words — do not copy sentences from sources. Be factually accurate; if you find nothing recent, say so plainly rather than inventing anything.

Respond with ONLY this JSON object, no markdown, no explanation:
{"bullets": ["<bullet 1>", "<bullet 2>"], "sources": [{"title": "<source page title>", "url": "<source url>"}]}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error('Claude API ' + res.status + ': ' + errText.slice(0, 200));
  }
  const data = await res.json();
  const textBlocks = (data.content || []).filter(b => b.type === 'text').map(b => b.text);
  const combined = textBlocks.join('\n');
  const jsonMatch = combined.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('no JSON object in response for ' + country);
  return JSON.parse(jsonMatch[0]);
}

export default {
  /* One country per request, always. Researching all 12 countries
     sequentially in a single invocation risks Cloudflare's subrequest
     and duration limits — the client fires 12 parallel requests instead,
     each independently cached per country per day. */
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const url = new URL(request.url);
    const country = url.searchParams.get('country');
    if (!country || COUNTRIES.indexOf(country) === -1) {
      return new Response(JSON.stringify({ status: 'error', error: 'Unknown or missing ?country= param', valid: COUNTRIES }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    const cache = caches.default;
    const cacheKey = new Request('https://periodico-consulate.internal/edition?day=' + todayKey() + '&country=' + encodeURIComponent(country));
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const data = await researchCountry(country, env.ANTHROPIC_API_KEY);
      const payload = JSON.stringify({ status: 'ok', day: todayKey(), country, bullets: data.bullets || [], sources: data.sources || [] });
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
