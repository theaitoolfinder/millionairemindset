/**
 * periodico-jobs — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Claude's web search tool to find current job openings/postings
 * published by DMW (Department of Migrant Workers), POEA-licensed
 * agencies, or Philippine embassy/consulate/MWO job boards, and lists
 * them as classified ads with source links.
 *
 * IMPORTANT LIMITATION: DMW/MWO/consulate sites are not RSS/API-friendly
 * and job postings change constantly — search coverage on any given day
 * may be sparse. This worker never invents a listing; if nothing
 * verifiable is found it returns an empty list rather than fabricating
 * job posts, since fake job ads could genuinely harm someone job-hunting.
 * Every listing must link back to its real source so a user can verify
 * and apply directly on the official site — never treat this list as
 * a substitute for checking dmw.gov.ph directly.
 *
 * Cached at Cloudflare's edge for 24h.
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

async function researchJobs(apiKey) {
  const prompt = `Search the web for current, real job openings or hiring announcements for Overseas Filipino Workers (OFWs) — specifically from official or credible sources such as dmw.gov.ph (Department of Migrant Workers), POEA-licensed recruitment agencies, Philippine embassy/consulate job boards, or MWO (Migrant Workers Office) postings. Look for actual named positions with an employer/country/agency, not generic advice pages.

List up to 8 real postings you find. For each, extract: job title, country, employer or hiring agency name if stated, and the source URL where someone could see the full posting.

Never invent a listing. If you find fewer than 8 real postings, list only what you actually found — do not pad the list with made-up entries. If you find none at all, return an empty array.

Respond with ONLY this JSON object, no markdown, no explanation:
{"listings": [{"title": "<job title>", "country": "<country>", "employer": "<employer/agency or empty string>", "source_name": "<site name>", "source_url": "<url>"}]}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1536,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
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
  if (!jsonMatch) throw new Error('no JSON object in response');
  return JSON.parse(jsonMatch[0]);
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const cache = caches.default;
    const cacheKey = new Request('https://periodico-jobs.internal/edition?day=' + todayKey());
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const data = await researchJobs(env.ANTHROPIC_API_KEY);
      const payload = JSON.stringify({ status: 'ok', day: todayKey(), listings: data.listings || [] });
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
