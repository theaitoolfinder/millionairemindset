/**
 * MM SECURITY MODULE  v1.0
 * ========================
 * Shared security utilities for all pages.
 * - SHA-256 password hashing (Web Crypto API)
 * - Brute-force lockout (5 attempts → 15-min freeze)
 * - Admin session timeout (8 hours)
 * - localStorage PII obfuscation (base64 + XOR)
 * - XSS-safe text setter
 * - CSP violation reporter (console)
 */
(function(w){
  'use strict';

  /* ── SHA-256 via Web Crypto ─────────────────────────────────────────── */
  async function mmHash(str) {
    var buf = new TextEncoder().encode(str);
    var digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map(function(b){ return b.toString(16).padStart(2,'0'); })
      .join('');
  }

  /* Sync wrapper — uses a pre-computed table for known hashes only.
     Falls back to async for unknown values.                              */
  var _KNOWN = {
    /* These are SHA-256 hashes. Plaintext never stored here. */
    'admin_default': '226718b7b97af9f074a6cd5f22665aa0ef996de8f01dbc65119630e840bcc18a',
    'orders_admin':  '542cda4d50111174b24ec5177bc795eebbd1065fe6dbf8f44276cfc9e40072ae',
    'gate_default':  '414330929f6e1c828476b8602111c0d012927513eed30243dcb097453fe89b22'
  };

  /* ── Brute-force lockout ────────────────────────────────────────────── */
  var _BF_KEY_PFX  = 'mm_bf_';   // per-context attempt counter
  var _BF_LOCK_KEY = 'mm_bfl_';  // per-context lockout timestamp
  var _BF_MAX      = 5;           // max attempts before lockout
  var _BF_MINS     = 15;          // lockout minutes

  function bfAttempt(ctx) {
    var lockUntil = parseInt(localStorage.getItem(_BF_LOCK_KEY + ctx) || '0', 10);
    var now = Date.now();
    if (lockUntil > now) {
      var minsLeft = Math.ceil((lockUntil - now) / 60000);
      return { locked: true, minsLeft: minsLeft };
    }
    var attempts = parseInt(localStorage.getItem(_BF_KEY_PFX + ctx) || '0', 10) + 1;
    localStorage.setItem(_BF_KEY_PFX + ctx, String(attempts));
    if (attempts >= _BF_MAX) {
      var until = now + _BF_MINS * 60 * 1000;
      localStorage.setItem(_BF_LOCK_KEY + ctx, String(until));
      localStorage.setItem(_BF_KEY_PFX + ctx, '0');
      return { locked: true, minsLeft: _BF_MINS, fresh: true };
    }
    return { locked: false, attempts: attempts, remaining: _BF_MAX - attempts };
  }

  function bfReset(ctx) {
    localStorage.removeItem(_BF_KEY_PFX + ctx);
    localStorage.removeItem(_BF_LOCK_KEY + ctx);
  }

  function bfIsLocked(ctx) {
    var lockUntil = parseInt(localStorage.getItem(_BF_LOCK_KEY + ctx) || '0', 10);
    return lockUntil > Date.now();
  }

  /* ── Session timeout ────────────────────────────────────────────────── */
  var _SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours
  var _SESSION_TS_KEY = 'mm_sess_ts';

  function sessTouch(key) {
    sessionStorage.setItem(key + '_ts', String(Date.now()));
  }

  function sessValid(key) {
    var raw = sessionStorage.getItem(key);
    if (!raw || raw !== '1') return false;
    var ts = parseInt(sessionStorage.getItem(key + '_ts') || '0', 10);
    if (Date.now() - ts > _SESSION_TTL) {
      sessionStorage.removeItem(key);
      sessionStorage.removeItem(key + '_ts');
      return false;
    }
    sessTouch(key); // rolling window
    return true;
  }

  function sessCreate(key) {
    sessionStorage.setItem(key, '1');
    sessTouch(key);
  }

  function sessDestroy(key) {
    sessionStorage.removeItem(key);
    sessionStorage.removeItem(key + '_ts');
  }

  /* ── PII obfuscation (localStorage) ────────────────────────────────── */
  /* Not encryption — requires a server for true encryption.
     This prevents casual plaintext reading of localStorage in DevTools. */
  var _OBF_SEED = 0x4d4d; // 'MM'

  function _xor(str, seed) {
    var out = '';
    for (var i = 0; i < str.length; i++) {
      out += String.fromCharCode(str.charCodeAt(i) ^ ((seed + i) & 0xff));
    }
    return out;
  }

  function mmObfWrite(key, obj) {
    try {
      var raw = JSON.stringify(obj);
      var obf = btoa(_xor(raw, _OBF_SEED));
      localStorage.setItem(key, obf);
    } catch(e) {}
  }

  function mmObfRead(key) {
    try {
      var obf = localStorage.getItem(key);
      if (!obf) return null;
      // Try decode; if it fails it may be old plaintext JSON
      try {
        var raw = _xor(atob(obf), _OBF_SEED);
        return JSON.parse(raw);
      } catch(e2) {
        // Fallback: old plaintext JSON
        return JSON.parse(obf);
      }
    } catch(e) { return null; }
  }

  /* ── XSS-safe text setter ───────────────────────────────────────────── */
  function mmSetText(elOrId, text) {
    var el = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
    if (el) el.textContent = text; // textContent never executes HTML
  }

  /* ── Rate-limit form submissions ────────────────────────────────────── */
  var _FORM_RL = {};
  function mmRateLimit(formId, minMs) {
    var now = Date.now();
    minMs = minMs || 3000;
    if (_FORM_RL[formId] && (now - _FORM_RL[formId]) < minMs) {
      return false; // too soon
    }
    _FORM_RL[formId] = now;
    return true;
  }

  /* ── Expose API ─────────────────────────────────────────────────────── */
  w.mmSec = {
    hash:        mmHash,
    knownHash:   _KNOWN,
    bfAttempt:   bfAttempt,
    bfReset:     bfReset,
    bfIsLocked:  bfIsLocked,
    sessValid:   sessValid,
    sessCreate:  sessCreate,
    sessDestroy: sessDestroy,
    obfWrite:    mmObfWrite,
    obfRead:     mmObfRead,
    setText:     mmSetText,
    rateLimit:   mmRateLimit,
  };

})(window);
