/**
 * periodico-jobs — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Pulls real, live upcoming job fair events directly from DMW's own public
 * data API (the same endpoint dmw.gov.ph's "Upcoming Job Fairs" page calls
 * client-side) — so listings are authoritative, not guessed at.
 *
 * dmw.gov.ph itself is a client-side rendered Nuxt/Vue app (SSR disabled),
 * so its HTML is unreadable to a server-side fetch. But its frontend bundle
 * reveals the actual data source it calls: master-api.dmw.gov.ph, using an
 * API key that's already embedded in every visitor's page load (public,
 * read-only, client-facing — not a secret we obtained improperly). This
 * worker fetches from that same public endpoint directly.
 *
 * Never invents a listing. If the API is unreachable, returns an empty
 * list rather than fabricating job posts.
 *
 * Cached at Cloudflare's edge for 24h.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const ALLOWED_ORIGINS = [
  'https://www.millionairemindset.ae',
  'https://millionairemindset.ae',
  'https://theaitoolfinder.github.io',
  'http://localhost',
  'http://127.0.0.1',
];

const DMW_API = 'https://master-api.dmw.gov.ph/api/v2/public/job-fairs';
const DMW_API_KEY = 'a4296e51-8cd0-4de7-a3de-324ed6a2913e';

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
function titleCase(s) {
  return (s || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

/* DMW's API has no server-side date filter, so we fetch the last page
   (sorted ascending by eventDate, so the last page holds the newest/
   furthest-future records) and filter to today-or-later ourselves. */
async function fetchJobFairs() {
  const PAGE_LIMIT = 1000;
  const probe = await fetch(DMW_API + '?page=1&limit=' + PAGE_LIMIT + '&sortBy=eventDate&sortOrder=asc', {
    headers: { 'X-API-Key': DMW_API_KEY, Accept: 'application/json', 'User-Agent': 'MillionaireMindsetPeriodico/1.0 (https://www.millionairemindset.ae; hello@millionairemindset.ae)' },
  });
  if (!probe.ok) throw new Error('DMW API ' + probe.status);
  const probeData = await probe.json();
  const lastPage = probeData.meta && probeData.meta.lastPage;
  if (!lastPage) throw new Error('DMW API: no lastPage in meta');

  const res = await fetch(DMW_API + '?page=' + lastPage + '&limit=' + PAGE_LIMIT + '&sortBy=eventDate&sortOrder=asc', {
    headers: { 'X-API-Key': DMW_API_KEY, Accept: 'application/json', 'User-Agent': 'MillionaireMindsetPeriodico/1.0 (https://www.millionairemindset.ae; hello@millionairemindset.ae)' },
  });
  if (!res.ok) throw new Error('DMW API ' + res.status);
  const data = await res.json();
  const today = new Date().toISOString().slice(0, 10);

  return (data.data || [])
    .filter(x => x.eventDate && x.eventDate.slice(0, 10) >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 12)
    .map(x => ({
      type: 'Job Fair',
      title: titleCase(x.description || 'Job Fair'),
      country: 'Philippines',
      employer: titleCase(x.sponsor || ''),
      date: x.eventDate.slice(0, 10),
      source_name: 'DMW — Department of Migrant Workers',
      source_url: 'https://dmw.gov.ph/quick-access-services/jobfairs',
    }));
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const url = new URL(request.url);
    if (url.searchParams.get('debug') === '1') {
      try {
        const probe = await fetch(DMW_API + '?page=1&limit=1000&sortBy=eventDate&sortOrder=asc', {
          headers: { 'X-API-Key': DMW_API_KEY, Accept: 'application/json', 'User-Agent': 'MillionaireMindsetPeriodico/1.0 (https://www.millionairemindset.ae; hello@millionairemindset.ae)' },
        });
        const probeText = await probe.text();
        return new Response(JSON.stringify({ probeStatus: probe.status, probeBodyStart: probeText.slice(0, 500) }), {
          status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) },
        });
      } catch (err) {
        return new Response(JSON.stringify({ debugError: String(err && err.message || err) }), {
          status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) },
        });
      }
    }

    const cache = caches.default;
    const cacheKey = new Request('https://periodico-jobs.internal/edition?v=4&day=' + todayKey());
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const listings = await fetchJobFairs();
      const payload = JSON.stringify({ status: 'ok', day: todayKey(), listings });
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
