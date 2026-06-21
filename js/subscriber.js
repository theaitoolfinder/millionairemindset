/* subscriber.js — Millionaire Mindset
   SHA-256 email verification against /data/subscribers.json
   Same pattern as myaitoolsfinder.com                          */

var MM_SUB_KEY    = 'mm_sub_hashes';
var MM_SUB_EXPIRY = 'mm_sub_expiry';
var MM_SUB_TTL    = 365 * 24 * 60 * 60 * 1000; // 1 year

function mmSha256(str) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str.trim().toLowerCase()))
    .then(function(buf){
      return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    });
}

/* Returns Promise<true|false|null>
   true  = confirmed subscriber
   false = email not found in list
   null  = could not reach subscribers.json (network error)      */
function mmIsSubscriber(email) {
  return mmSha256(email).then(function(hash) {
    // 1. Check localStorage cache first (instant, same device)
    try {
      var expiry = parseInt(localStorage.getItem(MM_SUB_EXPIRY) || '0');
      if (expiry > Date.now()) {
        var local = JSON.parse(localStorage.getItem(MM_SUB_KEY) || '[]');
        if (Array.isArray(local) && local.includes(hash)) return true;
      }
    } catch(e) {}
    // 2. Fetch the gate file (works cross-device)
    return fetch('/data/subscribers.json?_=' + Date.now(), { cache: 'no-store' })
      .then(function(r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function(d) {
        if (!d) return null;
        var list = Array.isArray(d) ? d : (d.hashes || []);
        if (list.includes(hash)) {
          mmCacheSubscriber(hash);
          return true;
        }
        return false;
      })
      .catch(function() { return null; });
  });
}

/* Cache the hash locally so same-device verify is instant */
function mmCacheSubscriber(hash) {
  try {
    var existing = JSON.parse(localStorage.getItem(MM_SUB_KEY) || '[]');
    if (!existing.includes(hash)) existing.push(hash);
    localStorage.setItem(MM_SUB_KEY, JSON.stringify(existing));
    localStorage.setItem(MM_SUB_EXPIRY, String(Date.now() + MM_SUB_TTL));
  } catch(e) {}
}

/* Call after a successful subscribe form submission */
function mmOnSubscribe(email) {
  mmSha256(email).then(function(hash) { mmCacheSubscriber(hash); });
}
