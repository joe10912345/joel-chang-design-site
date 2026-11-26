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
    /* Black gradient under each arrow (Joel 2026-11-27: "左右邊箭頭下可以壓整長方形塊黑漸層嗎? 高度跟圖方塊一樣高"): a strip as
       tall as the squares, dark at the screen edge and fading toward the middle, shown only while its arrow is shown
       (site.js fades the left arrow in once the strip has been scrolled). Computer + iPad. CSS: .jcd-e2e-shade */
    var shades = [];
    var fitShades = function () {
      var arrows = [].slice.call(comp.querySelectorAll('.nav-arrows-container')), tile = { height: 0 };
      [].some.call(comp.querySelectorAll('.gallery-item-container'), function (it) { var r = it.getBoundingClientRect(); if (r.height) { tile = r; return true; } });   /* live: the slider rebuilds its squares */
      arrows.forEach(function (a, i) {
        var host = a.offsetParent; if (!host || !tile.height) return;
        var sh = shades[i]; if (!sh) { sh = shades[i] = document.createElement('div'); sh.__jcdScaled = 1; sh.className = 'jcd-e2e-shade';   /* __jcdScaled: the 1.35x observer above must skip it */ sh.setAttribute('aria-hidden', 'true'); host.insertBefore(sh, a); }
        var left = !!a.style.left || /prev/.test(a.getAttribute('data-hook') || a.className), Z = window.__jcdZoom || 1;
        var hr = host.getBoundingClientRect(), ar = a.getBoundingClientRect();
        var W = Math.min(tile.width * 0.45, Math.max(ar.width * 3.2, 150 * Z));
        sh.classList.toggle('is-right', !left);
        sh.style.top = ((tile.top - hr.top) / Z).toFixed(1) + 'px'; sh.style.height = (tile.height / Z).toFixed(1) + 'px'; sh.style.width = (W / Z).toFixed(1) + 'px';
        var edge = left ? Math.min(ar.left, Math.max(hr.left, 0)) : Math.max(ar.right, Math.min(hr.right, document.documentElement.clientWidth));
        sh.style.left = (((left ? edge : edge - W) - hr.left) / Z).toFixed(1) + 'px';
        sh.style.opacity = getComputedStyle(a).opacity;
      });
    };
    var sq = 0, shadeSoon = function () { if (!sq) sq = requestAnimationFrame(function () { sq = 0; fitShades(); }); };
    var stripE = comp.querySelector('.gallery-horizontal-scroll'); if (stripE) stripE.addEventListener('scroll', shadeSoon, { passive: true });
    window.addEventListener('resize', shadeSoon); window.addEventListener('load', fitShades); setTimeout(fitShades, 1600);
    if ('MutationObserver' in window) [].forEach.call(comp.querySelectorAll('.nav-arrows-container'), function (a) {
      new MutationObserver(shadeSoon).observe(a, { attributes: true, attributeFilter: ['style'] }); });
    var grow = comp.scrollHeight - H0;
    comp.style.setProperty('height', (H0 * S).toFixed(1) + 'px', 'important');
    if (sec && grow > 0) sec.style.setProperty('min-height', (secH0 + H0 * (S - 1)).toFixed(1) + 'px', 'important');
  });

