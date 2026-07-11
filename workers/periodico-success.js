/**
 * periodico-success — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Claude's web search tool to find a real, recently published OFW
 * success story (business, property, savings, career) from Philippine
 * news coverage, then writes an original article about it — not a copy
 * of the source's wording — with the source credited and linked, and
 * (when the search result includes one) a representative image URL
 * with a photo credit line pointing back to where it came from.
 *
 * This never invents a story or a person. If Claude can't find a real,
 * verifiable recent story, it returns found:false and the page falls
 * back to the "share your story" placeholder instead of showing
 * anything fabricated.
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

async function researchStory(apiKey) {
  const prompt = `Search the web for a real, specific, recently-published news story (from a Philippine news outlet, DOLE/DMW feature, or similar credible source) about an OFW (Overseas Filipino Worker) success story — someone who built a business, invested in property, achieved financial independence, or had a notable career/entrepreneurship win after working abroad.

Write an ORIGINAL 3-paragraph article (roughly 150-200 words total) about this story in your own words — do not copy sentences from the source. Stay strictly factually accurate to what the source reports; do not invent names, numbers, or details not present in the source.

If the source page has a clear representative photo (e.g. an og:image), include its direct image URL. If you cannot find a suitable real image URL, leave image_url empty — never invent one.

If you cannot find any real, verifiable recent OFW success story, respond with {"found": false}.

Respond with ONLY this JSON object, no markdown, no explanation:
{"found": true, "headline": "<original headline>", "article": "<the 3-paragraph article, \\n\\n between paragraphs>", "source_name": "<publication name>", "source_url": "<article url>", "image_url": "<direct image url or empty string>", "image_credit": "<e.g. 'Photo courtesy of [Publication]' or empty string>"}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1536,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }],
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
    const cacheKey = new Request('https://periodico-success.internal/edition?day=' + todayKey());
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
    }

    try {
      const story = await researchStory(env.ANTHROPIC_API_KEY);
      const payload = JSON.stringify({ status: 'ok', day: todayKey(), ...story });
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
