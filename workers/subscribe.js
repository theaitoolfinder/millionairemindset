/**
 * subscribe — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Secure proxy between millionairemindset.ae and Brevo API.
 * After a successful subscribe it fires a GitHub Actions repository_dispatch
 * so data/subscribers.json is updated within seconds (not minutes).
 *
 * Worker secrets required (Settings → Variables → Secrets):
 *   BREVO_API_KEY  — Brevo v3 API key
 *   GITHUB_PAT     — GitHub fine-grained PAT with Actions: Read & Write
 *                    scoped to repo theaitoolfinder/millionairemindset
 *
 * To deploy:
 *   1. Cloudflare Workers → Create Worker → paste this file → Deploy
 *   2. Settings → Variables → add both secrets above
 *   3. Confirm the worker URL matches SUBSCRIBE_EP in js/main.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const ALLOWED_ORIGINS = [
  'https://www.millionairemindset.ae',
  'https://millionairemindset.ae',
  'https://theaitoolfinder.github.io',
  'http://localhost',
  'http://127.0.0.1',
];
const BREVO_LIST_ID = 4;
const BREVO_URL     = 'https://api.brevo.com/v3/contacts';
const GITHUB_REPO   = 'theaitoolfinder/millionairemindset';
const GITHUB_EVENT  = 'subscriber_added';

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

/* Fire-and-forget: trigger GitHub Actions to sync subscribers.json */
function triggerSync(pat) {
  if (!pat) return Promise.resolve();
  return fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${pat}`,
      'Accept':        'application/vnd.github.v3+json',
      'Content-Type':  'application/json',
      'User-Agent':    'mm-subscribe-worker',
    },
    body: JSON.stringify({ event_type: GITHUB_EVENT }),
  }).catch(() => {}); // never block the subscribe response
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    /* Preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    /* Parse body */
    let email, firstname, country, source, mobile;
    try {
      const body = await request.json();
      email     = (body.email     || '').trim().toLowerCase();
      firstname = (body.firstname || body.name || '').trim();
      country   = (body.country   || '').trim();
      source    = (body.source    || '').trim();
      mobile    = (body.mobile    || body.phone || '').trim();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    /* Normalise mobile to international format Brevo accepts (+XXXXXXXXXXX).
       "00" prefix becomes "+"; spaces, dashes and parens are stripped.       */
    if (mobile) {
      mobile = mobile.replace(/[\s\-().]/g, '');
      if (mobile.startsWith('00')) mobile = '+' + mobile.slice(2);
      if (!/^\+[0-9]{8,15}$/.test(mobile)) mobile = ''; // drop if not valid intl format
    }

    /* Add / update contact in Brevo list 4 */
    try {
      const attrs = {};
      if (firstname) attrs.FIRSTNAME = firstname;
      if (country)   attrs.COUNTRY   = country;
      if (source)    attrs.SOURCE     = source;
      if (mobile)    attrs.SMS        = mobile;

      const buildPayload = (a) => {
        const p = { email, listIds: [BREVO_LIST_ID], updateEnabled: true };
        if (Object.keys(a).length) p.attributes = a;
        return p;
      };
      const send = (a) => fetch(BREVO_URL, {
        method:  'POST',
        headers: {
          'api-key':      env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept':       'application/json',
        },
        body: JSON.stringify(buildPayload(a)),
      });

      let brevoRes = await send(attrs);

      /* If Brevo rejected the SMS value (format/duplicate), retry without it
         so the subscription itself never fails because of the phone number. */
      if (brevoRes.status !== 201 && brevoRes.status !== 204 && attrs.SMS) {
        delete attrs.SMS;
        brevoRes = await send(attrs);
      }

      /* 201 = created, 204 = already existed and was updated */
      if (brevoRes.status === 201 || brevoRes.status === 204) {
        /* Trigger immediate sync of subscribers.json — non-blocking */
        ctx.waitUntil(triggerSync(env.GITHUB_PAT));

        return new Response(JSON.stringify({ success: true }), {
          status: 200, headers: { 'Content-Type': 'application/json', ...cors(origin) },
        });
      }

      const err = await brevoRes.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err.message || 'Brevo error' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });

    } catch {
      return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }
  },
};
