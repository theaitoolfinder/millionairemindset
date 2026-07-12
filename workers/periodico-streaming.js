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
 * "More info" links go to a search results page on the pick's own
 * platform (e.g. netflix.com/search?q=...) so a click actually leads
 * toward watching it, not to an info-only page or unrelated article.
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

/* Usage tracking for the admin "API Usage" dashboard — records tokens
   actually spent on Claude calls (never on cache hits) into a shared KV
   namespace. No-ops silently if USAGE_KV isn't bound, so this never
   breaks the worker's real job. */
function extractUsage(data) {
  const u = data.usage || {};
  const webSearchCalls = (data.content || []).filter(b => b.type === 'server_tool_use' && b.name === 'web_search').length;
  return {
    input_tokens: u.input_tokens || 0,
    output_tokens: u.output_tokens || 0,
    cache_creation_input_tokens: u.cache_creation_input_tokens || 0,
    cache_read_input_tokens: u.cache_read_input_tokens || 0,
    web_search_calls: webSearchCalls,
  };
}
async function recordUsage(env, worker, usage) {
  if (!env.USAGE_KV) return;
  try {
    const day = new Date().toISOString().slice(0, 10);
    const key = 'usage:' + worker + ':' + day;
    const existingRaw = await env.USAGE_KV.get(key);
    const u = existingRaw ? JSON.parse(existingRaw) : { calls: 0, input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, web_search_calls: 0 };
    u.calls += 1;
    u.input_tokens += usage.input_tokens;
    u.output_tokens += usage.output_tokens;
    u.cache_creation_input_tokens += usage.cache_creation_input_tokens;
    u.cache_read_input_tokens += usage.cache_read_input_tokens;
    u.web_search_calls += usage.web_search_calls;
    await env.USAGE_KV.put(key, JSON.stringify(u), { expirationTtl: 60 * 60 * 24 * 400 });
  } catch {}
}

/* Cloudflare's caches.default is only written AFTER a Claude call finishes
   (research takes several seconds due to sequential web searches), and that
   write is async. Any request landing in that window is a cache miss and
   triggers its own real, billable Claude call — on a busy first-hit-of-the-
   day this can multiply cost several times over with zero benefit. This is
   a soft lock (KV isn't atomic, so it narrows the race rather than
   eliminating it entirely) that makes concurrent requests wait for the
   in-flight generation instead of starting their own. */
async function acquireGenerationLock(env, cache, cacheKey, lockName) {
  if (!env.USAGE_KV) return { shouldGenerate: true };
  const lockKey = 'lock:' + lockName;
  const existingLock = await env.USAGE_KV.get(lockKey);
  if (existingLock) {
    for (let i = 0; i < 6; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const maybeCached = await cache.match(cacheKey);
      if (maybeCached) return { shouldGenerate: false, cached: maybeCached };
    }
    return { shouldGenerate: true }; // gave up waiting — generate anyway rather than fail
  }
  await env.USAGE_KV.put(lockKey, '1', { expirationTtl: 90 });
  return { shouldGenerate: true };
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
  if (!jsonMatch) throw new Error('no JSON object in response');
  return { result: JSON.parse(jsonMatch[0]), usage: extractUsage(data) };
}

/* Look up a poster on TMDB by title. Movies and series live in separate
   TMDB endpoints, so /search/multi covers both without needing to trust
   Claude's "Movie"/"Series" label. Returns '' (no poster) on any miss —
   never blocks the pick from showing without one. */
async function findPoster(title, readAccessToken) {
  try {
    const url = 'https://api.themoviedb.org/3/search/multi?query=' + encodeURIComponent(title) + '&include_adult=false';
    const res = await fetch(url, {
      headers: { Authorization: 'Bearer ' + readAccessToken, Accept: 'application/json' },
    });
    if (!res.ok) return '';
    const data = await res.json();
    const hit = (data.results || []).find(r => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path);
    return hit ? 'https://image.tmdb.org/t/p/w342' + hit.poster_path : '';
  } catch {
    return '';
  }
}

/* Send the click straight to the streaming platform itself — a search
   results page for the title — rather than an info-only page like TMDB
   or a random news article. Not every platform's search URL format is
   public/stable, so anything not explicitly matched falls back to a
   Google search scoped to that platform's site, which still lands the
   user one click from actually watching it. */
function watchUrl(platform, title) {
  const q = encodeURIComponent(title);
  const p = (platform || '').toLowerCase();
  if (p.includes('netflix')) return 'https://www.netflix.com/search?q=' + q;
  if (p.includes('prime')) return 'https://www.amazon.com/s?k=' + q + '&i=instant-video';
  if (p.includes('disney')) return 'https://www.disneyplus.com/search?q=' + q;
  if (p.includes('hbo') || p.includes('max')) return 'https://play.max.com/search?q=' + q;
  if (p.includes('apple')) return 'https://tv.apple.com/search?term=' + q;
  if (p.includes('peacock')) return 'https://www.peacocktv.com/search?q=' + q;
  return 'https://www.google.com/search?q=' + q + '+watch+on+' + encodeURIComponent(platform || '');
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const cache = caches.default;
    const cacheKey = new Request('https://periodico-streaming.internal/edition?v=6&day=' + todayKey());
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    const lock = await acquireGenerationLock(env, cache, cacheKey, 'streaming:' + todayKey());
    if (!lock.shouldGenerate) {
      const body = await lock.cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const research = await researchStreaming(env.ANTHROPIC_API_KEY);
      ctx.waitUntil(recordUsage(env, 'streaming', research.usage));
      const rawPicks = research.result.picks || [];

      const picks = await Promise.all(rawPicks.map(async p => ({
        ...p,
        poster: env.TMDB_API_KEY ? await findPoster(p.title, env.TMDB_API_KEY) : '',
        source_url: watchUrl(p.platform, p.title),
      })));

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
