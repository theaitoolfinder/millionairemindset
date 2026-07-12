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

/* Cloudflare's caches.default is LOCAL TO EACH EDGE LOCATION — it is not a
   global cache. A visitor hitting a different Cloudflare PoP than the one
   that generated today's result sees a cold cache and triggers its own
   real, billable Claude call, all day long, not just in a brief startup
   race. USAGE_KV is globally consistent, so it — not caches.default — is
   the source of truth for "has this already been generated today?". The
   edge cache is kept only as a same-PoP speed boost on top of it. */
async function getCachedPayload(env, cache, cacheKey, contentKey) {
  const edgeCached = await cache.match(cacheKey);
  if (edgeCached) return await edgeCached.text();
  if (env.USAGE_KV) {
    const kvCached = await env.USAGE_KV.get(contentKey);
    if (kvCached) return kvCached;
  }
  return null;
}
function storePayload(env, ctx, cache, cacheKey, contentKey, payload) {
  ctx.waitUntil(cache.put(cacheKey, new Response(payload, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' } })));
  if (env.USAGE_KV) {
    ctx.waitUntil(env.USAGE_KV.put(contentKey, payload, { expirationTtl: 60 * 60 * 26 }));
  }
}
/* Soft lock (KV isn't atomic, so this narrows the race rather than
   eliminating it) so concurrent requests wait for an in-flight generation
   instead of starting their own. */
async function acquireGenerationLock(env, cache, cacheKey, contentKey, lockName) {
  if (!env.USAGE_KV) return { shouldGenerate: true };
  const lockKey = 'lock:' + lockName;
  const existingLock = await env.USAGE_KV.get(lockKey);
  if (existingLock) {
    for (let i = 0; i < 6; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const payload = await getCachedPayload(env, cache, cacheKey, contentKey);
      if (payload) return { shouldGenerate: false, payload };
    }
    return { shouldGenerate: true }; // gave up waiting — generate anyway rather than fail
  }
  await env.USAGE_KV.put(lockKey, '1', { expirationTtl: 90 });
  return { shouldGenerate: true };
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
  return { result: JSON.parse(jsonMatch[0]), usage: extractUsage(data) };
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
    const contentKey = 'content:consulate-' + country + ':' + todayKey();

    const existing = await getCachedPayload(env, cache, cacheKey, contentKey);
    if (existing) {
      return new Response(existing, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    const lock = await acquireGenerationLock(env, cache, cacheKey, contentKey, 'consulate-' + country + ':' + todayKey());
    if (!lock.shouldGenerate) {
      return new Response(lock.payload, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const research = await researchCountry(country, env.ANTHROPIC_API_KEY);
      ctx.waitUntil(recordUsage(env, 'consulate', research.usage));
      const data = research.result;
      const payload = JSON.stringify({ status: 'ok', day: todayKey(), country, bullets: data.bullets || [], sources: data.sources || [] });
      storePayload(env, ctx, cache, cacheKey, contentKey, payload);
      return new Response(payload, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    } catch (err) {
      return new Response(JSON.stringify({ status: 'error', error: String(err && err.message || err) }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }
  },
};
