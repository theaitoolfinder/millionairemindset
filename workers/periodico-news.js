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

/* Philstar's RSS doesn't embed a thumbnail, but each article page has a
   proper og:image — fetch it directly so the newspaper actually looks
   like a newspaper. Runs in parallel across all items; a failure on any
   one article just leaves that item without an image, never blocks the
   rest of the response. */
async function fetchOgImage(articleUrl) {
  try {
    const res = await fetch(articleUrl, {
      headers: { 'User-Agent': 'MillionaireMindsetPeriodico/1.0 (https://www.millionairemindset.ae; hello@millionairemindset.ae)' },
    });
    if (!res.ok) return '';
    const html = await res.text();
    const m = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
      || html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
    return m ? m[1] : '';
  } catch {
    return '';
  }
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
  return { result: JSON.parse(jsonMatch[0]), usage: extractUsage(data) };
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
    const contentKey = 'content:news-' + feedKey + ':' + todayKey();

    const existing = await getCachedPayload(env, cache, cacheKey, contentKey);
    if (existing) {
      return new Response(existing, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    const lock = await acquireGenerationLock(env, cache, cacheKey, contentKey, 'news-' + feedKey + ':' + todayKey());
    if (!lock.shouldGenerate) {
      return new Response(lock.payload, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
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

      const [rewritten, images] = await Promise.all([
        rewriteWithClaude(items, env.ANTHROPIC_API_KEY),
        Promise.all(items.map(it => fetchOgImage(it.link))),
      ]);
      ctx.waitUntil(recordUsage(env, 'news-' + feedKey, rewritten.usage));

      const result = items.map((it, i) => {
        const r = rewritten.result.find(x => x.id === i) || {};
        return {
          title: r.title || it.title,
          summary: r.summary || stripHtml(it.description).slice(0, 200),
          link: it.link,
          author: it.author || '',
          pubDate: it.pubDate,
          source: feed.source,
          image: images[i] || '',
        };
      });

      const payload = JSON.stringify({ status: 'ok', day: todayKey(), feed: feedKey, items: result });
      storePayload(env, ctx, cache, cacheKey, contentKey, payload);
      return new Response(payload, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    } catch (err) {
      return new Response(JSON.stringify({ status: 'error', error: String(err && err.message || err) }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }
  },
};
