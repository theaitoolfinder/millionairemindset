/**
 * subscribe — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Secure proxy between millionairemindset.com and Brevo API.
 * Receives name + email from the site, adds contact to Brevo list 4,
 * and returns a real success/fail JSON response.
 *
 * BREVO_API_KEY lives here as a Worker secret — never exposed to the browser.
 *
 * To deploy:
 *   1. Go to Cloudflare Workers → Create Worker → name it "mm-subscribe"
 *   2. Paste this file → Deploy
 *   3. Settings → Variables → Add secret: BREVO_API_KEY = your Brevo v3 API key
 *   4. Copy the Worker URL (e.g. https://mm-subscribe.YOUR_NAME.workers.dev)
 *   5. Paste that URL into js/main.js as SUBSCRIBE_EP
 *
 * Free tier: 100,000 Worker requests/day — more than enough
 * ─────────────────────────────────────────────────────────────────────────────
 */

const ALLOWED_ORIGINS = [
  'https://www.millionairemindset.ae',
  'https://millionairemindset.ae',
  'https://theaitoolfinder.github.io',
  'http://localhost',
  'http://127.0.0.1',
];
const BREVO_LIST_ID  = 4;
const BREVO_URL      = 'https://api.brevo.com/v3/contacts';

function cors(origin) {
  const o = ALLOWED_ORIGINS.find(a => origin && origin.startsWith(a))
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    /* Preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405, headers: { 'Content-Type': 'application/json', ...cors(origin) }
      });
    }

    /* Parse body */
    let email, firstname;
    try {
      const body = await request.json();
      email     = (body.email     || '').trim().toLowerCase();
      firstname = (body.firstname || '').trim();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...cors(origin) }
      });
    }

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...cors(origin) }
      });
    }

    /* Add contact to Brevo list 4 */
    try {
      const payload = {
        email,
        listIds:        [BREVO_LIST_ID],
        updateEnabled:  true,          // update if contact already exists
      };
      if (firstname) payload.attributes = { FIRSTNAME: firstname };

      const brevoRes = await fetch(BREVO_URL, {
        method:  'POST',
        headers: {
          'api-key':      env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept':       'application/json',
        },
        body: JSON.stringify(payload),
      });

      /* 201 = created, 204 = already exists (updated) — both are success */
      if (brevoRes.status === 201 || brevoRes.status === 204) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) }
        });
      }

      const err = await brevoRes.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err.message || 'Brevo error' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors(origin) }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors(origin) }
      });
    }
  }
};
