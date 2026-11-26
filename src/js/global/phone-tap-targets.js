  /* Phone: every link and button can be pressed from at least 44 x 44 (Joel 2026-11-27, UI/UX review item 2: the menu
     button was 20 x 20, Contact's SUBMIT 26px high, the e-mail link 10px; Apple: 44 pt default, 28 pt minimum).
     The look does not change: an invisible hit area (custom.css .jcd-hit::after) reaches out around the control.
     Where two controls are close, each reaches at most halfway towards the other, so no tap lands on the wrong one.
     Measured once the page has settled (and again on resize); phone pages only. */
  (function () {
    var MIN = 44;
    function freeSlot(el) {
      return ['after', 'before'].filter(function (p) {
        var c = getComputedStyle(el, '::' + p).content; return !c || c === 'none' || el.classList.contains('jcd-hit-' + p[0]); })[0];
    }
    function grow() {
      if (!document.body.classList.contains('device-mobile-optimized')) return;
      var els = [].filter.call(document.querySelectorAll('a[href], button, [role="button"], input[type="submit"]'), function (e) {
        var r = e.getBoundingClientRect(), cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[aria-hidden="true"]');
      });
      var rects = els.map(function (e) { return e.getBoundingClientRect(); });
      els.forEach(function (e, i) {
        var r = rects[i], ex = Math.max(0, (MIN - r.width) / 2), ey = Math.max(0, (MIN - r.height) / 2);
        if (!ex && !ey) { e.classList.remove('jcd-hit'); return; }
        rects.forEach(function (o, j) {   /* stay out of neighbours: at most half the gap */
          if (j === i || els[j].contains(e) || e.contains(els[j])) return;
          var overlapX = o.left < r.right + ex && o.right > r.left - ex, overlapY = o.top < r.bottom + ey && o.bottom > r.top - ey;
          if (!(overlapX && overlapY)) return;
          var gx = Math.max(o.left - r.right, r.left - o.right), gy = Math.max(o.top - r.bottom, r.top - o.bottom);
          if (gy >= gx) ey = Math.max(0, Math.min(ey, gy / 2)); else ex = Math.max(0, Math.min(ex, gx / 2));
        });
        /* use whichever pseudo-element is free (Wix and our own CSS use some of them). None free (Wix buttons such as
           Contact's SUBMIT): the area goes on the wrapper around it, and a tap there is passed on to the button. */
        var host = e, free = freeSlot(e);
        if (!free && e.parentElement && e.parentElement.children.length === 1) { host = e.parentElement; free = freeSlot(host);
          if (free && !host.__jcdHitFwd) { host.__jcdHitFwd = true;
            host.addEventListener('click', function (ev) { if (ev.target === host) e.click(); }); } }
        if (!free) return;
        host.classList.add('jcd-hit', 'jcd-hit-' + free[0]);
        if (getComputedStyle(host).position === 'static') host.style.setProperty('position', 'relative');   /* anchor the area */
        host.style.setProperty('--jcd-hit-x', ex.toFixed(1) + 'px'); host.style.setProperty('--jcd-hit-y', ey.toFixed(1) + 'px');
      });
    }
    window.addEventListener('load', function () { setTimeout(grow, 400); });
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(grow, 300); });
  })();
