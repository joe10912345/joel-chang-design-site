  /* Category pages, PHONE: spacing that shows the groups (Joel 2026-11-26: "same-category frames closer, they are too
     spread out and look like the gaps between categories"). A group starts with a frame that has a title bar (Smart
     Healthcare | ..., 25px taller); the plain frames after it belong to it. Frames of one group now sit 8px apart,
     a new group starts 48px below (Wix: 15px / 40px). Small items lying on a frame (captions, overlay layers) move
     with it; the section is shortened by what was saved. */
  (function () {
    var IN = 8, BETWEEN = 48;
    function tighten() {
      if (!document.body.classList.contains('device-mobile-optimized')) return;
      if (!/\/(networking|defense|electronics|industrial|lifestyle|experimental)\//.test(location.pathname)) return;
      var secs = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER section'), function (s) { return !s.parentElement.closest('section'); });
      secs.forEach(function (sec) {
        var grid = sec.querySelector('[data-mesh-id$="inlineContent-gridContainer"]'); if (!grid) return;
        var st = window.scrollY;
        var items = [].filter.call(grid.children, function (e) { return e.id && getComputedStyle(e).position === 'relative'; })
          .map(function (e) { var r = e.getBoundingClientRect(); return { e: e, top: r.top + st, h: r.height, w: r.width }; });
        var cards = items.filter(function (o) { return o.w >= 250 && o.h >= 150; }).sort(function (a, b) { return a.top - b.top; });
        if (cards.length < 3) return;
        /* one card per vertical slot (Wix sometimes stacks two layers at the same place) */
        var slots = [];
        cards.forEach(function (c) {
          /* also a card lying INSIDE an earlier frame (the photo card of a frame with a title bar) rides with that frame
             (Joel 2026-11-27: on the phone the laptop card had been pushed out below the "Computer" frame) */
          var s = slots.filter(function (x) { return Math.abs(x.top - c.top) < 6 || (c.top > x.top && c.top + c.h <= x.top + x.h + 4); })[0];
          if (s) { s.members.push(c); s.h = Math.max(s.h, c.h); } else slots.push({ top: c.top, h: c.h, members: [c] });
        });
        var hs = slots.map(function (s) { return s.h; }).sort(function (a, b) { return a - b; });
        var plain = hs[Math.floor(hs.length / 3)];
        items.forEach(function (o) {                       /* captions / small layers ride with the slot they lie on */
          if (cards.indexOf(o) >= 0) return;
          var s = slots.filter(function (x) { return o.top >= x.top - 2 && o.top < x.top + x.h; })[0];
          if (s) s.members.push(o);
        });
        var shift = 0, prevBottom = null;
        slots.forEach(function (s) {
          if (prevBottom !== null) {
            var gap = s.top - prevBottom, want = s.h > plain + 15 ? BETWEEN : IN;
            shift += want - gap;
          }
          prevBottom = s.top + s.h;
          if (shift) s.members.forEach(function (o) {
            o.e.style.setProperty('top', ((parseFloat(getComputedStyle(o.e).top) || 0) + shift).toFixed(1) + 'px');
          });
        });
        /* the section follows the moved frames both ways (a positive shift used to cut off the last cards) */
        if (shift) sec.style.setProperty('margin-bottom', shift.toFixed(1) + 'px');
      });
    }
    if (document.readyState === 'complete') tighten(); else window.addEventListener('load', tighten);
  })();
