/**
 * SITE ACCESS GATE
 * Blocks public access during development.
 * Access code stored in localStorage key: mm_dev_access
 * To grant access: enter the code on gate.html
 */
(function () {
  var GATE_KEY = 'mm_dev_access';
  var GATE_CODE = 'mmdev2026';
  var GATE_PAGE = 'gate.html';

  // Don't gate the gate page itself
  var path = window.location.pathname;
  if (path.indexOf(GATE_PAGE) !== -1) return;

  try {
    if (localStorage.getItem(GATE_KEY) !== GATE_CODE) {
      window.location.replace(GATE_PAGE);
    }
  } catch (e) {
    window.location.replace(GATE_PAGE);
  }
})();
