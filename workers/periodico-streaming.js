/**
 * periodico-streaming — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Claude's web search tool to find what's currently new or trending
 * on Netflix and other major streaming platforms (Prime Video, Disney+,
 * HBO/Max, iWantTFC, Viu) — movies and shows an OFW could realistically
 * watch after a shift, including Filipino titles when available.
 *
 * Never invents a title. If nothing verifiable is found, returns an
 * empty list rather than making something up.
 *
 * Poster art comes from TMDB (themoviedb.org) — matched by title after
 * Claude finds each pick, since Claude's web search doesn't reliably
 * return clean, valid poster image URLs. A pick without a TMDB match
 * still shows (title/platform/blurb), just without a poster.
 *
 * Cached at Cloudflare's edge for 24h — Claude + web search runs once
 * per day total, not per visitor.
 *
 * Worker secrets required:
 *   ANTHROPIC_API_KEY — Claude API key (console.anthropic.com)
 *   TMDB_API_KEY       — TMDB API Read Access Token (themoviedb.org/settings/api)
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

async function researchStreaming(apiKey) {
  const prompt = `Search the web for what is currently new or trending this week on Netflix, Prime Video, Disney+, HBO/Max, iWantTFC, or Viu — movies or shows worth watching, including any new Filipino/Pinoy titles if available. Aim for a mix that would appeal to Overseas Filipino Workers relaxing after a shift.

List up to 8 real titles you find. For each, give: title, platform (Netflix/Prime Video/Disney+/HBO Max/iWantTFC/Viu/etc), a one-sentence description in your own original words (do not copy from source), and the type (Movie/Series).

Never invent a title. If you find fewer than 8 real ones, list only what you actually found.

Respond with ONLY this JSON object, no markdown, no explanation:
{"picks": [{"title": "<title>", "platform": "<platform>", "type": "<Movie or Series>", "blurb": "<one sentence>", "source_url": "<url>"}]}`;

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

/* Look up a title on TMDB. Movies and series live in separate TMDB
   endpoints, so /search/multi covers both without needing to trust
   Claude's "Movie"/"Series" label. Returns the poster AND a link to
   that exact title's TMDB page — Claude's own source_url is often a
   generic "what's new this month" roundup article, not a page for the
   specific title, so the TMDB page is used as the "More info" link
   whenever there's a match. Returns nulls on any miss — never blocks
   the pick from showing without them. */
async function findTmdbMatch(title, readAccessToken) {
  try {
    const url = 'https://api.themoviedb.org/3/search/multi?query=' + encodeURIComponent(title) + '&include_adult=false';
    const res = await fetch(url, {
      headers: { Authorization: 'Bearer ' + readAccessToken, Accept: 'application/json' },
    });
    if (!res.ok) return { poster: '', url: '' };
    const data = await res.json();
    const hit = (data.results || []).find(r => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path);
    if (!hit) return { poster: '', url: '' };
    return {
      poster: 'https://image.tmdb.org/t/p/w342' + hit.poster_path,
      url: 'https://www.themoviedb.org/' + hit.media_type + '/' + hit.id,
    };
  } catch {
    return { poster: '', url: '' };
  }
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const cache = caches.default;
    const cacheKey = new Request('https://periodico-streaming.internal/edition?v=4&day=' + todayKey());
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const data = await researchStreaming(env.ANTHROPIC_API_KEY);
      const rawPicks = data.picks || [];

      const picks = env.TMDB_API_KEY
        ? await Promise.all(rawPicks.map(async p => {
            const m = await findTmdbMatch(p.title, env.TMDB_API_KEY);
            return { ...p, poster: m.poster, source_url: m.url || p.source_url };
          }))
        : rawPicks;

      const payload = JSON.stringify({ status: 'ok', day: todayKey(), picks });
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
