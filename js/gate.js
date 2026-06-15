/**
 * SITE ACCESS GATE
 * Blocks public access during development.
 * Access token stored as SHA-256 hash in localStorage key: mm_dev_access
 * To grant access: enter the code on gate.html
 */
(function () {
  var GATE_PAGE   = 'gate.html';
  var GATE_KEY    = 'mm_dev_access';
  /* SHA-256 of the gate code — plaintext never stored here */
  var GATE_HASH   = '414330929f6e1c828476b8602111c0d012927513eed30243dcb097453fe89b22';

  var path = window.location.pathname;
  if (path.indexOf(GATE_PAGE) !== -1) return;

  try {
    if (localStorage.getItem(GATE_KEY) !== GATE_HASH) {
      window.location.replace(GATE_PAGE);
    }
  } catch (e) {
    window.location.replace(GATE_PAGE);
  }
})();
