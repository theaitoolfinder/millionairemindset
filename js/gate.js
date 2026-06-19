/**
 * SITE ACCESS GATE
 * Blocks public access during development.
 */
(function () {
  var GATE_PAGE  = 'gate.html';
  var GATE_KEY   = 'mm_dev_access';
  var _t = [109,109,100,101,118,50,48,50,54,58,58,109,109,50,48,50,54];
  var GATE_TOKEN = btoa(_t.map(function(c){return String.fromCharCode(c);}).join(''));

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
