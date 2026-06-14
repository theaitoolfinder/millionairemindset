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
