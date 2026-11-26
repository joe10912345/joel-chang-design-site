  /* Header links/images are not draggable (no drag ghost when pressing the logo) — Joel 2026-11-24 */
  (function () {
    function nodrag() { [].forEach.call(document.querySelectorAll('#SITE_HEADER a, #SITE_HEADER img'), function (e) { e.setAttribute('draggable', 'false'); }); }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', nodrag) : nodrag();
  })();
