/**
 * periodico-usage — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Serves aggregated Claude API usage stats for the admin panel — how many
 * tokens (and estimated cost) each Periodico worker used, per day.
 *
 * Reads records written by the other Periodico workers (news, streaming,
 * consulate, success) into the shared USAGE_KV namespace every time they
 * actually call Claude (not on cache hits). Requires the same USAGE_KV
 * binding as those workers, plus its own ADMIN_STATS_KEY secret.
 *
 * Auth: request must carry header "X-Admin-Key" matching env.ADMIN_STATS_KEY.
 * This worker is read-only and only ever returns numbers, never secrets.
 *
 * Pricing reference (Claude Haiku 4.5, the model every Periodico worker
 * uses): $1.00 / MTok input, $5.00 / MTok output, cache write $1.25 / MTok
 * (5m TTL), cache read $0.10 / MTok, web_search tool $10 / 1,000 calls.
 * Update PRICING below if the model or its price ever changes.
 *
 * Worker secrets required:
 *   ADMIN_STATS_KEY — any long random string you choose; entered once in
 *                      the admin panel's "API Usage" tab, never committed.
 * Worker bindings required:
 *   USAGE_KV — KV namespace, shared with news/streaming/consulate/success.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const ALLOWED_ORIGINS = [
  'https://www.millionairemindset.ae',
  'https://millionairemindset.ae',
  'https://theaitoolfinder.github.io',
  'http://localhost',
  'http://127.0.0.1',
];

const PRICING = {
  inputPerMTok: 1.00,
  outputPerMTok: 5.00,
  cacheWritePerMTok: 1.25,
  cacheReadPerMTok: 0.10,
  webSearchPer1000: 10.00,
};

function cors(origin) {
  const o = ALLOWED_ORIGINS.find(a => origin && origin.startsWith(a)) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
  };
}

function costOf(u) {
  return (u.input_tokens / 1e6) * PRICING.inputPerMTok
    + (u.output_tokens / 1e6) * PRICING.outputPerMTok
    + (u.cache_creation_input_tokens / 1e6) * PRICING.cacheWritePerMTok
    + (u.cache_read_input_tokens / 1e6) * PRICING.cacheReadPerMTok
    + (u.web_search_calls / 1000) * PRICING.webSearchPer1000;
}

async function listAllUsageKeys(kv) {
  const keys = [];
  let cursor;
  do {
    const page = await kv.list({ prefix: 'usage:', cursor });
    keys.push(...page.keys.map(k => k.name));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return keys;
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const key = request.headers.get('X-Admin-Key') || '';
    if (!env.ADMIN_STATS_KEY || key !== env.ADMIN_STATS_KEY) {
      return new Response(JSON.stringify({ status: 'error', error: 'Unauthorized' }), {
        status: 401, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    try {
      const keys = await listAllUsageKeys(env.USAGE_KV);
      const records = await Promise.all(keys.map(async k => {
        const raw = await env.USAGE_KV.get(k);
        if (!raw) return null;
        // key shape: usage:<worker>:<YYYY-MM-DD>
        const parts = k.split(':');
        const worker = parts[1];
        const day = parts.slice(2).join(':');
        return { worker, day, ...JSON.parse(raw) };
      }));

      const today = new Date().toISOString().slice(0, 10);
      const cutoff30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      const byWorker = {};
      for (const r of records) {
        if (!r) continue;
        if (!byWorker[r.worker]) {
          byWorker[r.worker] = {
            today: { calls: 0, input_tokens: 0, output_tokens: 0, web_search_calls: 0, cost: 0 },
            last30: { calls: 0, input_tokens: 0, output_tokens: 0, web_search_calls: 0, cost: 0 },
            days: [],
          };
        }
        const cost = costOf(r);
        const entry = { day: r.day, calls: r.calls, input_tokens: r.input_tokens, output_tokens: r.output_tokens, web_search_calls: r.web_search_calls, cost };
        byWorker[r.worker].days.push(entry);

        if (r.day === today) {
          byWorker[r.worker].today.calls += r.calls;
          byWorker[r.worker].today.input_tokens += r.input_tokens;
          byWorker[r.worker].today.output_tokens += r.output_tokens;
          byWorker[r.worker].today.web_search_calls += r.web_search_calls;
          byWorker[r.worker].today.cost += cost;
        }
        if (r.day >= cutoff30) {
          byWorker[r.worker].last30.calls += r.calls;
          byWorker[r.worker].last30.input_tokens += r.input_tokens;
          byWorker[r.worker].last30.output_tokens += r.output_tokens;
          byWorker[r.worker].last30.web_search_calls += r.web_search_calls;
          byWorker[r.worker].last30.cost += cost;
        }
      }
      for (const w of Object.keys(byWorker)) {
        byWorker[w].days.sort((a, b) => b.day.localeCompare(a.day));
        byWorker[w].days = byWorker[w].days.slice(0, 30);
      }

      return new Response(JSON.stringify({ status: 'ok', pricing: PRICING, byWorker }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    } catch (err) {
      return new Response(JSON.stringify({ status: 'error', error: String(err && err.message || err) }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }
  },
};
