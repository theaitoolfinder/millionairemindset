/**
 * og-devotional — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Rewrites the Open Graph / Twitter Card meta tags on devotional.html
 * per-day so link previews in Facebook, WhatsApp, Telegram, etc. show
 * that day's actual devotion title and its matching Wikimedia photo,
 * instead of the generic devotional.html defaults baked into the file.
 *
 * Requires the domain's DNS to be proxied through Cloudflare (orange
 * cloud) and a Worker Route bound to:
 *   www.millionairemindset.ae/devotional.html*
 *
 * This Worker sits in front of the existing GitHub Pages origin — it
 * does not replace hosting, it only intercepts and rewrites the HTML
 * response for requests carrying ?date=&edition= params. Everything
 * else (no params, or any other page) passes through untouched.
 *
 * To deploy:
 *   1. Cloudflare dashboard → Workers & Pages → Create → paste this file
 *   2. Settings → Triggers → Routes → add
 *      www.millionairemindset.ae/devotional.html*  (zone: millionairemindset.ae)
 *   3. Confirm DNS for www is proxied (orange cloud ON) through Cloudflare
 * ─────────────────────────────────────────────────────────────────────────────
 */

const SITE_ORIGIN = 'https://www.millionairemindset.ae';
const EDITIONS = ['kids', 'yuppies', 'primes'];
const EDITION_LABEL = { kids: 'Kids', yuppies: 'Yuppies', primes: 'Primes' };
const IMG_BAD = /book|cover|map|flag|seal|coat|logo|stamp|icon|portrait|drawing|illustration|diagram|chart|poster|text/i;

function getDayOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);
  return Math.min(day - 1, 364);
}

function parseDateParam(d) {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  const [y, m, day] = d.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, day));
  return isNaN(dt.getTime()) ? null : dt;
}

async function fetchDevotionsData() {
  const cache = caches.default;
  const cacheKey = new Request(SITE_ORIGIN + '/data/devotions-og.json');
  let res = await cache.match(cacheKey);
  if (!res) {
    res = await fetch(cacheKey);
    if (res.ok) {
      const cached = new Response(res.body, res);
      cached.headers.set('Cache-Control', 'public, max-age=86400');
      await cache.put(cacheKey, cached.clone());
      return cached.json();
    }
    return null;
  }
  return res.json();
}

/* Wikimedia requires a descriptive User-Agent identifying the app and a
   contact point (https://meta.wikimedia.org/wiki/User-Agent_policy).
   Without it, requests from Cloudflare Workers' shared IP ranges get
   silently rejected/rate-limited. */
const WM_HEADERS = { 'User-Agent': 'MillionaireMindsetOG/1.0 (https://www.millionairemindset.ae; hello@millionairemindset.ae)' };

async function resolveWikiImage(query) {
  const cache = caches.default;
  const cacheKey = new Request('https://og-cache.internal/wiki-image?q=' + encodeURIComponent(query));
  const cached = await cache.match(cacheKey);
  if (cached) return cached.json();

  try {
    async function searchCommons(q) {
      const searchUrl = 'https://commons.wikimedia.org/w/api.php?action=query&list=search'
        + '&srnamespace=6&srlimit=20&srsearch=' + encodeURIComponent(q)
        + '&format=json&origin=*';
      const searchRes = await fetch(searchUrl, { headers: WM_HEADERS });
      if (!searchRes.ok) return [];
      const searchData = await searchRes.json();
      return ((searchData.query && searchData.query.search) || []).filter(h => {
        const t = h.title.toLowerCase();
        return !IMG_BAD.test(t) && /\.(jpe?g|png)$/i.test(t);
      });
    }

    // Some devotion-specific queries are too narrow and return zero real
    // photos on Commons — fall back to a broad, reliable query so the
    // preview image always resolves, matching the client's behavior.
    let hits = await searchCommons(query);
    if (!hits.length) hits = await searchCommons('Philippines landscape nature scenery');
    if (!hits.length) return null;
    const pick = hits[0]; // deterministic — same query, same top hit as the client

    const infoUrl = 'https://commons.wikimedia.org/w/api.php?action=query'
      + '&titles=' + encodeURIComponent(pick.title)
      + '&prop=imageinfo&iiprop=url|size&iiurlwidth=1200&format=json&origin=*';
    const infoRes = await fetch(infoUrl, { headers: WM_HEADERS });
    if (!infoRes.ok) return null;
    const infoData = await infoRes.json();
    const pages = infoData.query && infoData.query.pages;
    if (!pages) return null;
    const key = Object.keys(pages)[0];
    const ii = pages[key].imageinfo && pages[key].imageinfo[0];
    if (!ii || (ii.width || 0) < 400) return null;
    const src = ii.thumburl || ii.url;
    if (!src) return null;

    const result = { url: src, width: Math.min(ii.width, 1200), height: Math.round((Math.min(ii.width, 1200) / ii.width) * ii.height) };
    const toCache = new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' } });
    await cache.put(cacheKey, toCache);
    return result;
  } catch {
    return null;
  }
}

class MetaRewriter {
  constructor(replacements) {
    this.replacements = replacements;
  }
  element(element) {
    const prop = element.getAttribute('property') || element.getAttribute('name');
    if (prop && this.replacements[prop] !== undefined) {
      element.setAttribute('content', this.replacements[prop]);
    }
  }
}

class TitleRewriter {
  constructor(newTitle) {
    this.newTitle = newTitle;
  }
  element(element) {
    element.setInnerContent(this.newTitle);
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const edition = url.searchParams.get('edition');
    const dateParam = url.searchParams.get('date');

    // No day/edition specified — nothing to personalize, pass through untouched.
    if (!edition || EDITIONS.indexOf(edition) === -1) {
      return fetch(request);
    }

    const date = parseDateParam(dateParam) || new Date();
    const doy = getDayOfYear(date);

    const originResponse = await fetch(request);
    const contentType = originResponse.headers.get('Content-Type') || '';
    if (!contentType.includes('text/html')) return originResponse;

    try {
      const data = await fetchDevotionsData();
      const entry = data && data[edition] && data[edition][doy];
      if (!entry) return originResponse;

      const image = await resolveWikiImage(entry.imgQuery);
      const pageTitle = entry.title + ' — ' + EDITION_LABEL[edition] + ' Devotional | Millionaire Mindset';
      const ogDescription = 'A daily word for OFWs and their families — "' + entry.title + '" from the ' + EDITION_LABEL[edition] + ' devotional series.';

      const replacements = {
        'og:title': pageTitle,
        'og:description': ogDescription,
        'og:url': url.toString(),
        'twitter:title': pageTitle,
        'twitter:description': ogDescription,
      };
      if (image) {
        replacements['og:image'] = image.url;
        replacements['og:image:width'] = String(image.width);
        replacements['og:image:height'] = String(image.height);
        replacements['twitter:image'] = image.url;
      }

      return new HTMLRewriter()
        .on('meta[property], meta[name]', new MetaRewriter(replacements))
        .on('title', new TitleRewriter(pageTitle))
        .transform(originResponse);
    } catch {
      // Any failure in the personalization path — serve the normal page.
      return originResponse;
    }
  },
};
