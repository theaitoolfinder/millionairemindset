/* Millionaire Mindset — Theme Loader
   Runs BEFORE first paint to prevent flash of wrong color.
   Reads mm_theme_v1 from localStorage and applies data-theme to <html>. */
(function(){
  try {
    var t = localStorage.getItem('mm_theme_v1');
    if (!t || t === 'brand') return; // default brand theme — no attribute needed
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
})();
