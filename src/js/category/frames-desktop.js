  /* Category pages, desktop layout (computer + iPad): the white card frames AND the photo tiles below them were drawn
     ~15px left of centre in Wix (titles are centred), so the left gap was smaller than the right. Every top-level item
     of a section that holds frames (big framed cards, the unframed tile rows below them, their captions) moves by the
     same amount, so frames and tiles line up with each other and sit centred: equal space left and right.
     Items that are already centred (page titles) or full width are left alone. (Joel 2026-11-24; second pass: the
     first version only moved items inside a frame, so the unframed tiles no longer lined up with the frames.) */
  (function () {
    function centreCards() {
      if (document.body.classList.contains('device-mobile-optimized') || !document.querySelector('.gpDCD5 .ih2JY1')) return;
      var Z = window.__jcdZoom || 1, vw = document.documentElement.clientWidth;   /* both in screen px under the wide-screen zoom */
      var frames = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER .wixui-vector-image'), function (v) {
        var r = v.getBoundingClientRect(); return r.width > vw * 0.6 && r.height > 40; });
      if (!frames.length) return;
      var rows = frames.map(function (v) { return v.getBoundingClientRect(); });
      var mid = rows.reduce(function (a, r) { return a + (r.left + r.right) / 2; }, 0) / rows.length;
      var d = (vw / 2 - mid) / Z;
      if (Math.abs(d) < 2 || Math.abs(d) > 60) return;
      var secs = [];
      frames.forEach(function (v) { var s = v.closest('section'); while (s && s.parentElement && s.parentElement.closest('section')) s = s.parentElement.closest('section'); if (s && secs.indexOf(s) < 0) secs.push(s); });
      secs.forEach(function (sec) {
        var grid = sec.querySelector('[data-mesh-id$="inlineContent-gridContainer"]'); if (!grid) return;
        [].forEach.call(grid.children, function (e) {
          if (!e.id || e.tagName === 'SECTION') return;
          var r = e.getBoundingClientRect(); if (!r.width || r.width >= vw * 0.95) return;
          if (Math.abs((r.left + r.right) / 2 - vw / 2) < 4) return;            /* already centred (titles) */
          var cs = getComputedStyle(e); if (cs.position !== 'relative') return;
          e.style.left = ((parseFloat(cs.left) || 0) + d).toFixed(2) + 'px';
        });
      });
      window.dispatchEvent(new Event('resize'));   /* tilt.js / glow re-measure */
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', centreCards) : centreCards();
  })();
