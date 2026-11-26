  /* Home "End-to-End Expertise" slider, computer + iPad (Joel 2026-11-26: squares too small, the text in them
     unreadable): every square is drawn 1.35x (356 -> 481px), the strip and the gallery box grow with them, the
     section grows by the same amount. Wix's inline px sizes are scaled (an unsized wrapper sits in between, so
     "100%" would collapse the photo to 0px). The arrows stay centred on the squares. */
  ready(function () {
    if (document.body.classList.contains('device-mobile-optimized')) return;
    var comp = document.getElementById('comp-mnfi6oqr'); if (!comp) return;
    var S = 1.35, items = [].slice.call(comp.querySelectorAll('.gallery-item-container')); if (items.length < 2) return;
    var sec = comp.closest('section'), H0 = comp.offsetHeight, secH0 = sec ? sec.offsetHeight : 0;
    function px(v) { var m = /^([\d.]+)px$/.exec(v || ''); return m ? +m[1] : null; }
    function scaleStyle(el, props) { props.forEach(function (p) { var v = px(el.style[p]); if (v !== null) el.style.setProperty(p, (v * S).toFixed(2) + 'px'); }); }
    items.forEach(function (it) {
      var ins = (it.style.inset || '').split(' ');
      if (ins.length === 4 && px(ins[3]) !== null) it.style.inset = ins.slice(0, 3).join(' ') + ' ' + (px(ins[3]) * S).toFixed(2) + 'px';
      else scaleStyle(it, ['left']);
      scaleStyle(it, ['width', 'height', 'margin']);
      [].forEach.call(it.querySelectorAll('[style]'), function (d) { scaleStyle(d, ['width', 'height']); });
    });
    [].forEach.call(comp.querySelectorAll('.gallery-horizontal-scroll, .pro-gallery, .pro-gallery-parent-container'), function (e) { scaleStyle(e, ['height']); });
    [].forEach.call(comp.querySelectorAll('[data-hook="nav-arrow-next"], [data-hook="nav-arrow-prev"], .nav-arrow-next, .nav-arrow-prev'), function (a) { scaleStyle(a, ['top']); });
    /* the hover caption layer (inserted later by site.js) carries the old px size too */
    if ('MutationObserver' in window) new MutationObserver(function (ms) {
      ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1 || n.__jcdScaled) return; n.__jcdScaled = 1;
        scaleStyle(n, ['width', 'height']); [].forEach.call(n.querySelectorAll('[style]'), function (d) { scaleStyle(d, ['width', 'height']); });
      }); });
    }).observe(comp, { childList: true, subtree: true });
    /* iPad (Joel 2026-11-27): the strip is wider than the iPad's 1320px layout, so its arrows (46px outside the strip)
       sat off the screen / were cut at the edge. Pull each arrow inside the screen, 14px from the edge. */
    if (window.__jcdTablet) {
      var fitArrows = function () {
        var W = document.documentElement.clientWidth;
        [].forEach.call(comp.querySelectorAll('.nav-arrows-container'), function (a) {
          var side = a.style.left ? 'left' : (a.style.right ? 'right' : null); if (!side) return;
          a.classList.add('jcd-e2e-arrow');
          /* measured from the arrow's positioned parent (always laid out), not the arrow (hidden at the strip's ends) */
          var op = a.offsetParent; if (!op) return; var pr = op.getBoundingClientRect();
          var v = Math.max(-46, side === 'left' ? 14 - pr.left : pr.right - (W - 14));   /* -46 = Wix's own place */
          a.style[side] = v.toFixed(1) + 'px';
        });
      };
      /* the layout can still shift after load (fonts, iPad viewport switch), so re-fit whenever the strip is used */
      var fq = 0, fitSoon = function () { if (!fq) fq = requestAnimationFrame(function () { fq = 0; fitArrows(); }); };
      var stripEl = comp.querySelector('.gallery-horizontal-scroll'); if (stripEl) stripEl.addEventListener('scroll', fitSoon, { passive: true });
      comp.addEventListener('touchstart', fitSoon, { passive: true });
      fitArrows(); window.addEventListener('load', fitArrows); setTimeout(fitArrows, 1500);
      window.addEventListener('resize', fitArrows); window.addEventListener('orientationchange', function () { setTimeout(fitArrows, 300); });
    }
    var grow = comp.scrollHeight - H0;
    comp.style.setProperty('height', (H0 * S).toFixed(1) + 'px', 'important');
    if (sec && grow > 0) sec.style.setProperty('min-height', (secH0 + H0 * (S - 1)).toFixed(1) + 'px', 'important');
  });

