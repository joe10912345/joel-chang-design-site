  /* Home "End-to-End Expertise" slider, computer + iPad (Joel 2026-11-26: squares too small, the text in them
     unreadable): every square is drawn 1.35x (356 -> 481px), the strip and the gallery box grow with them, the
     section grows by the same amount. Wix's inline px sizes are scaled (an unsized wrapper sits in between, so
     "100%" would collapse the photo to 0px). The arrows are gone (end-to-end-hint.js). */
  ready(function () {
    /* phone too (Joel 2026-11-27, no arrows, "畫面被切到就知道要左滑"): squares 150 -> 218px, so about a third of the
       next square shows at the screen edge, as in preview/mockups/end-to-end-hint.html (variant C) */
    var phone = document.body.classList.contains('device-mobile-optimized');
    var comp = document.getElementById('comp-mnfi6oqr'); if (!comp) return;
    var S = phone ? 1.45 : 1.35, items = [].slice.call(comp.querySelectorAll('.gallery-item-container')); if (items.length < 2) return;
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
    var grow = comp.scrollHeight - H0;
    comp.style.setProperty('height', (H0 * S).toFixed(1) + 'px', 'important');
    if (sec && grow > 0) sec.style.setProperty('min-height', (secH0 + H0 * (S - 1)).toFixed(1) + 'px', 'important');
  });

