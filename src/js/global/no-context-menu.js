  /* No context menu (right click / long press "save image"), no text selection, no image dragging — every platform
     (Joel 2026-11-25). Form fields keep their normal menu (paste) and selection. */
  (function () {
    function inField(t) { return t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]'); }
    document.addEventListener('contextmenu', function (e) { if (!inField(e.target)) e.preventDefault(); });
    document.addEventListener('selectstart', function (e) { if (!inField(e.target)) e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { if (!inField(e.target)) e.preventDefault(); });
  })();
