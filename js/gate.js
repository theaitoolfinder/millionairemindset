/**
 * SITE ACCESS GATE
 * Blocks public access during development.
 * Enter code 'mmdev2026' on gate.html to unlock.
 */
(function () {
  var GATE_PAGE   = 'gate.html';
  var GATE_KEY    = 'mm_dev_access';
  var GATE_TOKEN  = btoa('mmdev2026::mm2026');

  var path = window.location.pathname;
  if (path.indexOf(GATE_PAGE) !== -1) return;

  try {
    if (localStorage.getItem(GATE_KEY) !== GATE_TOKEN) {
      window.location.replace(GATE_PAGE);
    }
  } catch (e) {
    window.location.replace(GATE_PAGE);
  }
})();
