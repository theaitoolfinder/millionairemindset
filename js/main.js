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
   THEME PICKER
   =================================================== */
(function(){
  var STORAGE_KEY = 'mm_theme_v1';
  var _panelOpen = false;

  var dotColors = {
    brand:'#CC1010', ocean:'#0284c7', forest:'#059669', sunset:'#ea580c',
    lavender:'#7c3aed', rose:'#e11d48', sky:'#38bdf8', teal:'#0d9488',
    amber:'#d97706', pink:'#db2777', indigo:'#4338ca'
  };

  function syncDot(t) {
    var dot = document.getElementById('mm-theme-dot');
    if (!dot) return;
    dot.style.background = dotColors[t] || dotColors['brand'];
  }

  function syncSwatches(t) {
    document.querySelectorAll('.mm-swatch').forEach(function(el){
      el.classList.toggle('active', el.dataset.t === t);
    });
    syncDot(t);
  }

  window.mmApplyTheme = function(t) {
    var html = document.documentElement;
    if (!t || t === 'brand') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', t);
    }
    try { localStorage.setItem(STORAGE_KEY, t || 'brand'); } catch(e) {}
    syncSwatches(t || 'brand');
    // Close panel
    _panelOpen = false;
    var panel = document.getElementById('mm-theme-panel');
    if (panel) panel.classList.remove('open');
  };

  window.mmToggleThemePanel = function(e) {
    e && e.stopPropagation();
    var panel = document.getElementById('mm-theme-panel');
    if (!panel) return;
    _panelOpen = !_panelOpen;
    panel.classList.toggle('open', _panelOpen);
  };

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!_panelOpen) return;
    var btn = document.getElementById('mm-theme-btn');
    var panel = document.getElementById('mm-theme-panel');
    if (panel && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      _panelOpen = false;
      panel.classList.remove('open');
    }
  });

  // Init — sync to saved theme
  (function init() {
    var saved = '';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'brand'; } catch(e) { saved = 'brand'; }
    syncSwatches(saved);
  })();
})();
