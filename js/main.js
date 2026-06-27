/* ── Mobile Bottom Navigation Bar ── */
(function(){
  var NAV_ITEMS = [
    { href:'index.html',      label:'Home',
      icon:'<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { href:'devotional.html', label:'Devotional',
      icon:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>' },
    { href:'shop.html',       label:'Shop',
      icon:'<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>' },
    { href:'checkup.html',    label:'Check-up',
      icon:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  ];

  var MORE_ITEMS = [
    { href:'blog.html',          label:'Blog',       icon:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>' },
    { href:'business.html',      label:'Business',   icon:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>' },
    { href:'about.html',         label:'About',      icon:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { href:'index.html#contact', label:'Contact',    icon:'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>' },
  ];

  function toggleMoreMenu() {
    var panel = document.getElementById('mmMorePanel');
    var overlay = document.getElementById('mmMoreOverlay');
    var isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
      overlay.style.display = 'none';
    } else {
      panel.classList.add('open');
      overlay.style.display = 'block';
    }
  }
  window.mmToggleMoreMenu = toggleMoreMenu;

  function injectBottomNav() {
    if (document.getElementById('mmBottomNav')) return;
    var cur = window.location.pathname.split('/').pop() || 'index.html';

    var moreActive = MORE_ITEMS.some(function(i){ return cur === i.href; }) ? ' active' : '';

    var ul = NAV_ITEMS.map(function(item){
      var active = cur === item.href || (cur === '' && item.href === 'index.html') ? ' active' : '';
      return '<li><a href="' + item.href + '" class="' + active + '">'
        + '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + item.icon + '</svg>'
        + item.label + '</a></li>';
    }).join('');

    ul += '<li><button class="mm-more-btn' + moreActive + '" onclick="mmToggleMoreMenu()" aria-label="More pages">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>'
      + 'More</button></li>';

    function moreIconItem(href, iconPath, label, isBtn) {
      var dot = '<span class="mm-mic-dot"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">' + iconPath + '</svg></span>';
      var lbl = '<span class="mm-mic-label">' + label + '</span>';
      if (isBtn) {
        return '<button class="mm-more-icon-item" onclick="' + href + '" type="button">' + dot + lbl + '</button>';
      }
      var active = cur === href ? ' mm-mic-active' : '';
      return '<a href="' + href + '" class="mm-more-icon-item' + active + '">' + dot + lbl + '</a>';
    }

    var moreLinks = MORE_ITEMS.map(function(item){
      return moreIconItem(item.href, item.icon, item.label, false);
    }).join('');

    /* Theme item — opens the full colour-wheel panel */
    moreLinks += moreIconItem(
      'mmToggleThemePanel();mmToggleMoreMenu();',
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
      'Theme',
      true
    );

    var nav = document.createElement('nav');
    nav.id = 'mmBottomNav';
    nav.className = 'mm-bottom-nav';
    nav.setAttribute('aria-label', 'Main navigation');
    nav.innerHTML = '<ul>' + ul + '</ul>'
      + '<div id="mmMoreOverlay" onclick="mmToggleMoreMenu()" style="display:none;position:fixed;inset:0;z-index:1099;"></div>'
      + '<div id="mmMorePanel" class="mm-more-panel">' + moreLinks + '</div>';
    document.body.appendChild(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBottomNav);
  } else {
    injectBottomNav();
  }
})();

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

var SUBSCRIBE_EP = 'https://mm-subscribe.info-myaitoolbox.workers.dev';

function handleSubscribe(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const email = (input.value || '').trim();
  if (!email) return;
  const msg = document.getElementById('nl-msg');
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Subscribing…'; }
  if (msg) { msg.textContent = ''; }
  fetch(SUBSCRIBE_EP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    if (d.success) {
      if (typeof mmOnSubscribe === 'function') mmOnSubscribe(email);
      input.value = '';
      if (msg) { msg.style.color = '#059669'; msg.textContent = currentLang === 'tl' ? 'Salamat! Maligayang pagdating sa aming komunidad.' : 'You\'re in! Welcome to the community.'; }
    } else {
      if (msg) { msg.style.color = '#cc1010'; msg.textContent = d.error || 'Something went wrong. Please try again.'; }
    }
    if (btn) { btn.disabled = false; btn.textContent = currentLang === 'tl' ? 'I-subscribe Libre' : 'Subscribe Free'; }
  })
  .catch(function() {
    if (msg) { msg.style.color = '#cc1010'; msg.textContent = 'Something went wrong. Please try again.'; }
    if (btn) { btn.disabled = false; btn.textContent = currentLang === 'tl' ? 'I-subscribe Libre' : 'Subscribe Free'; }
  });
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
    { h:228, s:62, l:74 }, { h:  0, s: 0, l:62 }, { h: 98, s:60, l:65 },
    { h:285, s:55, l:70 }, { h: 24, s:82, l:72 }, { h:208, s:68, l:76 },
    { h:322, s:68, l:68 }, { h:168, s:58, l:60 }, { h:278, s:55, l:76 },
    { h:342, s:55, l:74 }, { h: 52, s:88, l:70 }, { h: 36, s:75, l:72 },
  ];

  /* ── Apply a hue-based dynamic theme ── */
  /* sat = swatch saturation override (for grey etc); default 72 */
  function applyHueTheme(hue, swatchIdx, sat) {
    var root = document.documentElement;
    root.removeAttribute('data-theme');
    /* Clear any previous inline overrides first */
    var vars = ['--primary','--primary-2','--primary-light','--accent',
                '--bg','--text','--text-2','--text-dim',
                '--border','--border-soft','--hero-grad',
                '--shadow','--shadow-lg',
                '--glow-xs','--glow-sm','--glow-md','--glow-lg','--glow-xl',
                '--tint-bg'];
    vars.forEach(function(v){ root.style.removeProperty(v); });

    var h  = Math.round(hue);
    var s  = (sat !== undefined) ? Math.round(sat) : 72;  /* respect swatch saturation */
    var s2 = Math.min(s + 4, 100);
    var sLight = Math.max(s - 10, 8);  /* slightly less sat for light shades */

    root.style.setProperty('--primary',       'hsl('+h+','+s+'%,43%)');
    root.style.setProperty('--primary-2',     'hsl('+h+','+s2+'%,36%)');
    root.style.setProperty('--primary-light', 'hsl('+h+','+sLight+'%,95%)');
    root.style.setProperty('--accent',        'hsl('+((h+32)%360)+','+Math.max(s-10,20)+'%,42%)');
    root.style.setProperty('--bg',            'hsl('+h+','+Math.max(s-20,8)+'%,97%)');
    root.style.setProperty('--text',          'hsl('+h+','+Math.max(s-7,8)+'%,10%)');
    root.style.setProperty('--text-2',        'hsl('+h+','+Math.max(s-12,8)+'%,20%)');
    root.style.setProperty('--text-dim',      'hsl('+h+','+Math.max(s-40,8)+'%,48%)');
    root.style.setProperty('--border',        'hsl('+h+','+Math.max(s-30,8)+'%,86%)');
    root.style.setProperty('--border-soft',   'hsl('+h+','+Math.max(s-30,8)+'%,91%)');
    root.style.setProperty('--hero-grad',
      'linear-gradient(160deg,hsl('+h+','+Math.max(s-10,8)+'%,95%) 0%,hsl('+h+','+Math.max(s-20,4)+'%,98%) 45%,hsl('+((h+15)%360)+','+Math.max(s-20,4)+'%,97%) 100%)');

    /* Glow variables — update so box-shadows follow the theme */
    root.style.setProperty('--shadow',    '0 2px 12px hsla('+h+','+s+'%,43%,.07)');
    root.style.setProperty('--shadow-lg', '0 8px 28px hsla('+h+','+s+'%,43%,.13)');
    root.style.setProperty('--glow-xs',   'hsla('+h+','+s+'%,43%,.07)');
    root.style.setProperty('--glow-sm',   'hsla('+h+','+s+'%,43%,.12)');
    root.style.setProperty('--glow-md',   'hsla('+h+','+s+'%,43%,.18)');
    root.style.setProperty('--glow-lg',   'hsla('+h+','+s+'%,43%,.32)');
    root.style.setProperty('--glow-xl',   'hsla('+h+','+s+'%,43%,.48)');
    root.style.setProperty('--tint-bg',   'hsla('+h+','+Math.max(s-10,8)+'%,95%,.65)');

    var dotColor = 'hsl('+h+','+s+'%,43%)';
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
                '--border','--border-soft','--hero-grad',
                '--shadow','--shadow-lg',
                '--glow-xs','--glow-sm','--glow-md','--glow-lg','--glow-xl',
                '--tint-bg'];
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
    applyHueTheme(sw.h, idx, sw.s);  /* pass swatch saturation so grey stays grey */
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
          var restoreSat = (obj.idx >= 0 && SWATCHES[obj.idx]) ? SWATCHES[obj.idx].s : undefined;
          applyHueTheme(obj.hue, obj.idx, restoreSat);
        } else {
          applyBrand();
        }
        return;
      }
    } catch(e){}
    applyBrand();
  })();
})();

/* ── Page Transitions ── */
(function(){
  // Fade in on load
  document.addEventListener('DOMContentLoaded', function(){
    document.body.classList.add('mm-page-in');
  });

  // Fade out before navigating away
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('viber:') === 0) return;
    if (a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
    // Only internal links
    var isInternal = href.indexOf('http') !== 0 || href.indexOf(window.location.origin) === 0;
    if (!isInternal) return;
    e.preventDefault();
    document.body.classList.add('mm-fade-out');
    var nav = setTimeout(function(){ window.location.href = href; }, 200);
    // Safety: remove fade-out if navigation doesn't fire within 1s
    setTimeout(function(){ clearTimeout(nav); document.body.classList.remove('mm-fade-out'); }, 1000);
  });
})();
