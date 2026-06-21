/* theme.js — DO NOT move this file.
   Pages load this via <script src> AFTER the inline theme-init block.
   This file handles the interactive panel: swatches, apply, persist. */

var MM_THEMES = {
  brand:    {p:'#CC1010',p2:'#A80D0D',pl:'#fdecea',bg:'#fdf8f5',s2:'#fdf8f5',b:'#f5cece',bs:'#fdecea',grad:'linear-gradient(160deg,#fdecea 0%,#fdf8f5 45%,#fef9f7 100%)'},
  ocean:    {p:'#0284c7',p2:'#0369a1',pl:'#e0f2fe',bg:'#f0f9ff',s2:'#f0f9ff',b:'#bae6fd',bs:'#e0f2fe',grad:'linear-gradient(160deg,#e0f2fe 0%,#f0f9ff 45%,#ecfeff 100%)'},
  forest:   {p:'#059669',p2:'#047857',pl:'#d1fae5',bg:'#ecfdf5',s2:'#ecfdf5',b:'#a7f3d0',bs:'#d1fae5',grad:'linear-gradient(160deg,#d1fae5 0%,#ecfdf5 45%,#f0fdf4 100%)'},
  sunset:   {p:'#ea580c',p2:'#c2410c',pl:'#ffedd5',bg:'#fff7ed',s2:'#fff7ed',b:'#fed7aa',bs:'#ffedd5',grad:'linear-gradient(160deg,#ffedd5 0%,#fff7ed 45%,#fffbeb 100%)'},
  lavender: {p:'#7c3aed',p2:'#6d28d9',pl:'#ede9fe',bg:'#f5f3ff',s2:'#f5f3ff',b:'#ddd6fe',bs:'#ede9fe',grad:'linear-gradient(160deg,#ede9fe 0%,#f5f3ff 45%,#fdf4ff 100%)'},
  rose:     {p:'#e11d48',p2:'#be123c',pl:'#ffe4e6',bg:'#fff1f2',s2:'#fff1f2',b:'#fecdd3',bs:'#ffe4e6',grad:'linear-gradient(160deg,#ffe4e6 0%,#fff1f2 45%,#fff0f3 100%)'},
  sky:      {p:'#0284c7',p2:'#0369a1',pl:'#e0f2fe',bg:'#f0f9ff',s2:'#f0f9ff',b:'#bae6fd',bs:'#e0f2fe',grad:'linear-gradient(160deg,#e0f2fe 0%,#f0f9ff 45%,#ecfeff 100%)'},
  teal:     {p:'#0d9488',p2:'#0f766e',pl:'#ccfbf1',bg:'#f0fdfa',s2:'#f0fdfa',b:'#99f6e4',bs:'#ccfbf1',grad:'linear-gradient(160deg,#ccfbf1 0%,#f0fdfa 45%,#ecfeff 100%)'},
  amber:    {p:'#d97706',p2:'#b45309',pl:'#fef3c7',bg:'#fffbeb',s2:'#fffbeb',b:'#fde68a',bs:'#fef3c7',grad:'linear-gradient(160deg,#fef3c7 0%,#fffbeb 45%,#fff7ed 100%)'},
  pink:     {p:'#db2777',p2:'#be185d',pl:'#fce7f3',bg:'#fdf2f8',s2:'#fdf2f8',b:'#fbcfe8',bs:'#fce7f3',grad:'linear-gradient(160deg,#fce7f3 0%,#fdf2f8 45%,#fff1f2 100%)'},
  indigo:   {p:'#4338ca',p2:'#3730a3',pl:'#e0e7ff',bg:'#eef2ff',s2:'#eef2ff',b:'#c7d2fe',bs:'#e0e7ff',grad:'linear-gradient(160deg,#e0e7ff 0%,#eef2ff 45%,#ede9fe 100%)'},
};

/* ── Subscriber gate for theme changes ── */
function mmThemeIsUnlocked() {
  try {
    var expiry = parseInt(localStorage.getItem('mm_sub_expiry') || '0');
    if (expiry > Date.now()) {
      var hashes = JSON.parse(localStorage.getItem('mm_sub_hashes') || '[]');
      return Array.isArray(hashes) && hashes.length > 0;
    }
  } catch(e) {}
  return false;
}

function mmShowThemeGate() {
  var existing = document.getElementById('mm-theme-gate-overlay');
  if (existing) { existing.style.display = 'flex'; return; }
  var el = document.createElement('div');
  el.id = 'mm-theme-gate-overlay';
  el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;';
  el.innerHTML = '<div style="background:#fff;border-radius:20px;padding:32px 28px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.2);font-family:Poppins,sans-serif;">'
    + '<h3 style="margin:0 0 6px;font-size:1.1rem;color:#1a1a1a;">Subscriber Perk</h3>'
    + '<p style="margin:0 0 18px;font-size:.85rem;color:#555;line-height:1.5;">Custom color themes are free for subscribers. Enter your email to verify your access.</p>'
    + '<input id="mm-tg-email" type="email" placeholder="your@email.com" autocomplete="email" style="width:100%;box-sizing:border-box;border:1.5px solid #e0e0e0;border-radius:10px;padding:10px 14px;font-size:.9rem;font-family:Poppins,sans-serif;margin-bottom:10px;outline:none;">'
    + '<div id="mm-tg-msg" style="font-size:.78rem;min-height:18px;margin-bottom:10px;color:#cc1010;"></div>'
    + '<button onclick="mmThemeGateVerify()" style="width:100%;background:#CC1010;color:#fff;border:none;border-radius:10px;padding:11px;font-size:.9rem;font-weight:600;cursor:pointer;font-family:Poppins,sans-serif;margin-bottom:8px;">Verify Access</button>'
    + '<p style="text-align:center;margin:0;font-size:.75rem;color:#888;">Not subscribed yet? <a href="https://bb0b0867.sibforms.com/serve/MUIFAOGDJeXWoD51BjwMfv68XSaz0v90tEtIP4j7fWleHs6hcXvvW59DvRO_ULI5cVeWpFz--du9WCjUPi-wuhIhngKkkv4OkRXymONeiAKq6NUmSsZaxZEjzXzPwOQPwIAYEnFwUugNyHeTgKFv4i9Kv4nuKKNy3zM4zlwgk6coRZy63tOLzVnlVoVBq5AN2uiZDuQW-rU1Kgz9GQ==" target="_blank" rel="noopener" style="color:#CC1010;text-decoration:none;font-weight:600;">Subscribe free</a></p>'
    + '<button onclick="document.getElementById(\'mm-theme-gate-overlay\').style.display=\'none\'" style="position:absolute;top:12px;right:14px;background:none;border:none;font-size:1.2rem;cursor:pointer;color:#999;">×</button>'
    + '</div>';
  el.querySelector('div').style.position = 'relative';
  document.body.appendChild(el);
  setTimeout(function(){ el.querySelector('#mm-tg-email').focus(); }, 80);
}

window.mmThemeGateVerify = function() {
  var email = (document.getElementById('mm-tg-email').value || '').trim().toLowerCase();
  var msg   = document.getElementById('mm-tg-msg');
  if (!email || !email.includes('@')) { msg.textContent = 'Please enter a valid email.'; return; }
  msg.textContent = 'Verifying…'; msg.style.color = '#888';
  if (typeof mmIsSubscriber !== 'function') { msg.textContent = 'Verification unavailable. Try again later.'; return; }
  mmIsSubscriber(email).then(function(result) {
    if (result === true) {
      msg.textContent = 'Access granted!'; msg.style.color = '#059669';
      setTimeout(function(){
        document.getElementById('mm-theme-gate-overlay').style.display = 'none';
        var panel = document.getElementById('mm-theme-panel');
        if (panel) panel.classList.add('open');
      }, 700);
    } else if (result === false) {
      msg.textContent = 'Email not found. Subscribe free to unlock themes.'; msg.style.color = '#cc1010';
    } else {
      msg.textContent = 'Could not verify. Please try again.'; msg.style.color = '#cc1010';
    }
  });
};

function mmApplyTheme(name) {
  var t = MM_THEMES[name] || MM_THEMES.brand;
  // Update/create the inline theme style block
  var el = document.getElementById('mm-theme-vars');
  if (!el) { el = document.createElement('style'); el.id = 'mm-theme-vars'; document.head.appendChild(el); }
  if (name === 'brand') {
    el.textContent = '';
    document.documentElement.removeAttribute('data-theme');
  } else {
    el.textContent = ':root{--primary:'+t.p+';--primary-2:'+t.p2+';--primary-light:'+t.pl+';--bg:'+t.bg+';--surface-2:'+t.s2+';--border:'+t.b+';--border-soft:'+t.bs+';--hero-grad:'+t.grad+';--glow-xs:'+t.p+'18;--glow-sm:'+t.p+'28;--glow-lg:'+t.p+'40;--tint-bg:'+t.pl+'cc;}';
    document.documentElement.setAttribute('data-theme', name);
  }
  // Persist
  try { localStorage.setItem('mm_theme_v1', name); } catch(e){}
  // Dot color follows --primary via CSS automatically — no inline style needed
  // Update swatch active state
  document.querySelectorAll('.mm-swatch').forEach(function(s){
    s.classList.toggle('active', s.dataset.t === name);
  });
  // Close panel
  var panel = document.getElementById('mm-theme-panel');
  if (panel) panel.classList.remove('open');
}

function mmToggleThemePanel(e) {
  if (e) e.stopPropagation();
  if (!mmThemeIsUnlocked()) { mmShowThemeGate(); return; }
  var panel = document.getElementById('mm-theme-panel');
  if (!panel) return;
  panel.classList.toggle('open');
}

// Close panel on outside click
document.addEventListener('click', function(e) {
  var panel = document.getElementById('mm-theme-panel');
  var btn   = document.getElementById('mm-theme-btn');
  if (panel && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// Init swatches active state on load (dot color handled by CSS var(--primary))
document.addEventListener('DOMContentLoaded', function(){
  try {
    var saved = localStorage.getItem('mm_theme_v1') || 'brand';
    document.querySelectorAll('.mm-swatch').forEach(function(s){
      s.classList.toggle('active', s.dataset.t === saved);
    });
  } catch(e){}
});
