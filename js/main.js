/* ── Inject theme + lang footer into mobile menu ── */
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var menu = document.getElementById('mobileMenu');
    if (!menu || menu.querySelector('.nav-mobile-footer')) return;
    var li = document.createElement('li');
    li.innerHTML =
      '<div class="nav-mobile-footer">'
        + '<div class="lang-switcher">'
          + '<button class="lang-btn" data-lang="en" onclick="setLang(\'en\')">EN</button>'
          + '<button class="lang-btn" data-lang="tl" onclick="setLang(\'tl\')">TL</button>'
        + '</div>'
        + '<button onclick="mmToggleThemePanel(event)" style="display:inline-flex;align-items:center;gap:8px;'
            + 'background:rgba(0,0,0,.06);border:none;padding:8px 14px;border-radius:10px;'
            + 'font:600 12.5px \'Poppins\',sans-serif;cursor:pointer;color:var(--text);">'
          + '<span id="mm-theme-dot-mob" style="width:13px;height:13px;border-radius:50%;display:inline-block;background:var(--primary);flex-shrink:0;"></span>'
          + 'Change Theme'
        + '</button>'
      + '</div>';
    menu.appendChild(li);
    /* Sync the mobile dot when theme changes */
    var origApply = window.mmApplyTheme;
    if (origApply) {
      window.mmApplyTheme = function(t){
        origApply(t);
        var dot = document.getElementById('mm-theme-dot-mob');
        if (dot) {
          var colors = {brand:'#CC1010',ocean:'#0284c7',forest:'#059669',sunset:'#ea580c',lavender:'#7c3aed',rose:'#e11d48',sky:'#38bdf8',teal:'#0d9488',amber:'#d97706',pink:'#db2777',indigo:'#4338ca'};
          dot.style.background = colors[t] || colors.brand;
        }
      };
    }
  });
})();

function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  var btn  = document.querySelector('.hamburger');
  if (!menu) return;
  var isOpen = menu.classList.toggle('open');
  if (btn) btn.classList.toggle('open', isOpen);
}

function handleSubscribe(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  alert(currentLang === 'tl'
    ? 'Salamat sa pag-subscribe! Maligayang pagdating sa aming komunidad.'
    : 'Thank you for subscribing! Welcome to the community.');
  input.value = '';
}

function handleContact(e) {
  e.preventDefault();
  alert(currentLang === 'tl'
    ? 'Natanggap ang iyong mensahe! Makikipag-ugnayan ako sa iyo sa lalong madaling panahon.'
    : 'Message received! I\'ll get back to you as soon as possible.');
  e.target.reset();
}

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
});

/* ===================================================
   COLOUR WHEEL THEME PICKER
   =================================================== */
(function(){
  var STORAGE_KEY = 'mm_theme_v2';
  var _panelOpen  = false;
  var _dragging   = false;
  var _activeIdx  = -1; /* -1 = original/brand, 0+ = swatch index */

  /* ── Preset swatches — hue, sat, light for the circle dot ── */
  var SWATCHES = [
    { h:200, s:72, l:70 }, { h:270, s:65, l:72 }, { h:145, s:60, l:68 },
    { h: 46, s:85, l:68 }, { h:348, s:72, l:72 }, { h:178, s:65, l:64 },
    { h:228, s:62, l:74 }, { h:220, s: 8, l:65 }, { h: 98, s:60, l:65 },
    { h:285, s:55, l:70 }, { h: 24, s:82, l:72 }, { h:208, s:68, l:76 },
    { h:322, s:68, l:68 }, { h:168, s:58, l:60 }, { h:278, s:55, l:76 },
    { h:342, s:55, l:74 }, { h: 52, s:88, l:70 }, { h: 36, s:75, l:72 },
  ];

  /* ── Apply a hue-based dynamic theme ── */
  function applyHueTheme(hue, swatchIdx) {
    var root = document.documentElement;
    root.removeAttribute('data-theme');
    /* Clear any previous inline overrides first */
    var vars = ['--primary','--primary-2','--primary-light','--accent',
                '--bg','--text','--text-2','--text-dim',
                '--border','--border-soft','--hero-grad'];
    vars.forEach(function(v){ root.style.removeProperty(v); });

    var h = Math.round(hue);
    root.style.setProperty('--primary',       'hsl('+h+',72%,43%)');
    root.style.setProperty('--primary-2',     'hsl('+h+',76%,36%)');
    root.style.setProperty('--primary-light', 'hsl('+h+',78%,95%)');
    root.style.setProperty('--accent',        'hsl('+((h+32)%360)+',62%,42%)');
    root.style.setProperty('--bg',            'hsl('+h+',52%,97%)');
    root.style.setProperty('--text',          'hsl('+h+',65%,10%)');
    root.style.setProperty('--text-2',        'hsl('+h+',60%,20%)');
    root.style.setProperty('--text-dim',      'hsl('+h+',32%,48%)');
    root.style.setProperty('--border',        'hsl('+h+',42%,86%)');
    root.style.setProperty('--border-soft',   'hsl('+h+',42%,91%)');
    root.style.setProperty('--hero-grad',
      'linear-gradient(160deg,hsl('+h+',82%,95%) 0%,hsl('+h+',60%,98%) 45%,hsl('+((h+15)%360)+',70%,97%) 100%)');

    var dotColor = 'hsl('+h+',72%,43%)';
    syncNavDot(dotColor);
    _activeIdx = (swatchIdx !== undefined) ? swatchIdx : -2; /* -2 = wheel custom */
    syncSwatchActive();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ type:'hue', hue:h, idx:_activeIdx })); } catch(e){}
    updateWheelHandle(h);
  }

  /* ── Apply original brand (red/gold) ── */
  function applyBrand() {
    var root = document.documentElement;
    var vars = ['--primary','--primary-2','--primary-light','--accent',
                '--bg','--text','--text-2','--text-dim',
                '--border','--border-soft','--hero-grad'];
    vars.forEach(function(v){ root.style.removeProperty(v); });
    root.removeAttribute('data-theme');
    syncNavDot('#CC1010');
    _activeIdx = -1;
    syncSwatchActive();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ type:'brand' })); } catch(e){}
    updateWheelHandle(0);
  }

  /* ── Sync nav dot colour ── */
  function syncNavDot(color) {
    ['mm-theme-dot','mm-theme-dot-mob'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.style.background = color;
    });
  }

  /* ── Sync swatch active ring ── */
  function syncSwatchActive() {
    var orig = document.getElementById('mmOriginalPreset');
    if (orig) orig.classList.toggle('active', _activeIdx === -1);
    document.querySelectorAll('.mm-sw').forEach(function(el, i){
      el.classList.toggle('active', i === _activeIdx);
    });
  }

  /* ── Wheel handle position ── */
  function updateWheelHandle(hue) {
    var handle = document.getElementById('mmWheelHandle');
    if (!handle) return;
    var wheel  = document.getElementById('mmColorWheel');
    if (!wheel) return;
    var r = wheel.offsetWidth / 2;
    var ring = r * 0.81; /* radius of midpoint of ring */
    var rad  = (hue - 90) * Math.PI / 180;
    handle.style.left = (r + ring * Math.cos(rad)) + 'px';
    handle.style.top  = (r + ring * Math.sin(rad)) + 'px';
  }

  /* ── Build panel HTML ── */
  function buildPanel() {
    var panel = document.getElementById('mm-theme-panel');
    if (!panel) return;
    var swatchHTML = SWATCHES.map(function(sw, i){
      var bg = 'hsl('+sw.h+','+sw.s+'%,'+sw.l+'%)';
      return '<div class="mm-sw" data-idx="'+i+'" style="background:'+bg+'" '
        + 'onclick="mmApplySwatchIdx('+i+')" title="Colour '+i+'"></div>';
    }).join('');

    panel.innerHTML =
      '<h5>Your Colour Theme</h5>'
      + '<div class="mm-wheel-wrap">'
        + '<div class="mm-wheel" id="mmColorWheel">'
          + '<div class="mm-wheel-handle" id="mmWheelHandle" style="left:96px;top:18px;"></div>'
          + '<div class="mm-wheel-inner">'
            + '<span class="mm-wheel-star">✦</span>'
          + '</div>'
        + '</div>'
      + '</div>'
      + '<p class="mm-wheel-caption">Drag the ring for any colour</p>'
      + '<button id="mmOriginalPreset" class="mm-preset-original" onclick="mmApplyTheme(\'brand\')">'
        + '<span class="mm-preset-dot" style="background:#CC1010"></span>'
        + 'Original'
      + '</button>'
      + '<div class="mm-swatches-new">' + swatchHTML + '</div>'
      + '<p class="mm-saves-note">Saves automatically ✓</p>';

    /* Set up wheel drag */
    var wheel = document.getElementById('mmColorWheel');
    if (!wheel) return;

    function getHueFromEvent(e) {
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      var rect = wheel.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var angle = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI + 90;
      return ((angle % 360) + 360) % 360;
    }

    function isOnRing(e) {
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      var rect = wheel.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dist = Math.sqrt(Math.pow(clientX - cx, 2) + Math.pow(clientY - cy, 2));
      var r = rect.width / 2;
      return dist > r * 0.38 && dist < r * 1.04;
    }

    wheel.addEventListener('mousedown', function(e){
      if (isOnRing(e)) { _dragging = true; applyHueTheme(getHueFromEvent(e)); e.preventDefault(); }
    });
    wheel.addEventListener('touchstart', function(e){
      if (isOnRing(e)) { _dragging = true; applyHueTheme(getHueFromEvent(e)); }
    }, { passive: true });
    document.addEventListener('mousemove', function(e){
      if (_dragging) applyHueTheme(getHueFromEvent(e));
    });
    document.addEventListener('touchmove', function(e){
      if (_dragging) applyHueTheme(getHueFromEvent(e));
    }, { passive: true });
    document.addEventListener('mouseup',  function(){ _dragging = false; });
    document.addEventListener('touchend', function(){ _dragging = false; });
  }

  /* ── Public API ── */
  window.mmApplyTheme = function(t) {
    if (!t || t === 'brand') { applyBrand(); }
    else { applyHueTheme(0); } /* fallback */
    _panelOpen = false;
    var panel = document.getElementById('mm-theme-panel');
    if (panel) panel.classList.remove('open');
  };

  window.mmApplySwatchIdx = function(idx) {
    var sw = SWATCHES[idx];
    if (!sw) return;
    applyHueTheme(sw.h, idx);
    _panelOpen = false;
    var panel = document.getElementById('mm-theme-panel');
    if (panel) panel.classList.remove('open');
  };

  window.mmToggleThemePanel = function(e) {
    e && e.stopPropagation();
    var panel = document.getElementById('mm-theme-panel');
    if (!panel) return;
    if (!_panelOpen) buildPanel(); /* rebuild panel content on open */
    _panelOpen = !_panelOpen;
    panel.classList.toggle('open', _panelOpen);
    if (_panelOpen) setTimeout(function(){ syncSwatchActive(); updateWheelHandle(0); }, 20);
  };

  /* Close on outside click */
  document.addEventListener('click', function(e) {
    if (!_panelOpen) return;
    var btn   = document.getElementById('mm-theme-btn');
    var panel = document.getElementById('mm-theme-panel');
    if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
      _panelOpen = false;
      panel.classList.remove('open');
    }
  });

  /* Init — restore saved theme */
  (function init() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var obj = JSON.parse(saved);
        if (obj.type === 'hue') {
          applyHueTheme(obj.hue, obj.idx);
        } else {
          applyBrand();
        }
        return;
      }
    } catch(e){}
    applyBrand();
  })();
})();
