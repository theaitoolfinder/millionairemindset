/**
 * periodico-jobs — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Claude's web search tool to find real, current OFW job openings
 * AND upcoming DMW/POEA job fair events, surfaced through news coverage,
 * press releases, and public social posts — then lists them with source
 * links.
 *
 * IMPORTANT LIMITATION: dmw.gov.ph itself is a client-side rendered app
 * (Nuxt/Vue with SSR disabled) — its job fair and job-opening listings
 * only exist after JavaScript runs in a browser, so neither a server
 * fetch nor Claude's web search can read them directly from the site.
 * This worker instead searches for the same information as reported by
 * news outlets, DMW's own press releases/Facebook posts, and licensed
 * agencies — which is real, but naturally less complete than the site's
 * live listings. It never invents a listing; if nothing verifiable is
 * found it returns an empty list rather than fabricating job posts,
 * since fake job ads could genuinely harm someone job-hunting. Always
 * point users to dmw.gov.ph directly for the authoritative, current list.
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
  const prompt = `Search the web for two kinds of real, current opportunities for Overseas Filipino Workers (OFWs):

1. JOB OPENINGS: named positions with a stated employer/agency and country, from POEA-licensed recruitment agencies, Philippine embassy/consulate job boards, or news coverage of hiring drives.
2. JOB FAIR EVENTS: upcoming DMW/POEA/LGU job fairs — search news coverage, press releases (PNA, Manila Bulletin, Philstar, local government sites), and DMW's public Facebook page posts for the event name, date, and venue/location. dmw.gov.ph's own site cannot be searched directly (it's a JavaScript app with no readable static content), so rely on secondary sources reporting on DMW's job fairs and hiring events.

List up to 10 real items total, mixing both types as available. For each, give: type ("Job Opening" or "Job Fair"), title (job title, or the job fair's name/theme), country (destination country for a job opening, or "Philippines" for a domestic job fair), employer (agency/employer for a job opening, or organizer for a job fair — empty string if not stated), date (event date if it's a job fair, empty string otherwise), and the source URL.

Never invent an item. If you find fewer than 10 real ones, list only what you actually found — do not pad the list with made-up entries. If you find none at all, return an empty array.

Respond with ONLY this JSON object, no markdown, no explanation:
{"listings": [{"type": "<Job Opening or Job Fair>", "title": "<title>", "country": "<country>", "employer": "<employer/agency/organizer or empty string>", "date": "<event date or empty string>", "source_name": "<site name>", "source_url": "<url>"}]}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 8 }],
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
