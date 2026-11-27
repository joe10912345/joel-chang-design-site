  /* Home "End-to-End Expertise": no arrows, the strip itself says "there is more, swipe" (Joel 2026-11-27: "end to end
     是不是不用箭頭? 只要畫面被切到或是左右動一下人家就知道是要左滑?" -> variant C of preview/mockups/end-to-end-hint.html,
     every platform). Runs after end-to-end-slider.js (square sizes). Arrows hidden in end-to-end-hint.css.
     (1) Phone: the strip runs to the screen's right edge, so the next square is cut by the screen, not in mid-air
         (computer: cut at the content margin, iPad: by the screen).
     (2) A soft fade to black at the right edge; at the left edge too while a square is cut there (Joel 2026-11-27:
         "輪播往右滑後，最左邊被切到的也要有漸層消失").
     (3) Once, when the strip comes into view, the row slides left a little and settles back (not with reduced motion,
         not after the visitor has moved it).
     (4) The row always comes to rest with a square at its start. Wix's own CSS snapping used the squares' places from
         before they were enlarged and stopped between them, so it is off; we settle after every swipe / drag / scroll.
     (5) Computer: drag with the mouse (trackpad / Shift + wheel scroll natively); arrow keys when focused. */
  ready(function () {
    var comp = document.getElementById('comp-mnfi6oqr'); if (!comp) return;
    var strip = comp.querySelector('.gallery-horizontal-scroll'); if (!strip) return;
    var phone = document.body.classList.contains('device-mobile-optimized');
    var z = function () { return window.__jcdZoom || 1; };
    function mk(side) { var f = document.createElement('div'); f.className = 'jcd-e2e-fade jcd-e2e-fade-' + side; f.setAttribute('aria-hidden', 'true'); comp.appendChild(f); return f; }
    var fadeR = mk('r'), fadeL = mk('l');
    /* (1) + (2) */
    var chain = [strip];
    for (var a = strip.parentElement; a && a !== comp.parentElement; a = a.parentElement) chain.push(a);
    var leftEdge = 0;   /* where the row is cut on the left (window px) */
    function layout() {
      var vw = document.documentElement.clientWidth, sr = strip.getBoundingClientRect(), right = sr.right, left = sr.left;
      chain.forEach(function (e) { if (e === strip || getComputedStyle(e).overflowX !== 'visible') {
        var q = e.getBoundingClientRect(); right = Math.min(right, q.right); left = Math.max(left, q.left); } });
      /* phone only: there the strip stopped 40px short of the edge. Computer / iPad keep their own edge: the computer's
         ends at the content margin and cuts the 3rd square (to the screen edge, the 3rd square would end just there and
         nothing would look cut); the iPad's already runs past the screen */
      var ext = phone ? (vw - right) / z() : 0;
      if (Math.abs(ext) > 0.5) {
        chain.forEach(function (e) { e.style.setProperty('width', (e.getBoundingClientRect().width / z() + ext).toFixed(1) + 'px', 'important'); });
        right = vw;
      }
      var cr = comp.getBoundingClientRect(), w = phone ? 36 : 120;
      right = Math.min(vw, right); left = Math.max(0, left); leftEdge = left;
      [[fadeR, (right - cr.left) / z() - w], [fadeL, (left - cr.left) / z()]].forEach(function (p) {
        p[0].style.left = p[1].toFixed(1) + 'px'; p[0].style.width = w + 'px';
        p[0].style.top = ((sr.top - cr.top) / z()).toFixed(1) + 'px'; p[0].style.height = (sr.height / z()).toFixed(1) + 'px';
      });
      edges();
    }
    layout(); window.addEventListener('load', layout); window.addEventListener('resize', layout); setTimeout(layout, 1500);
    /* the left fade only while a square is actually cut there (while moving; on the iPad also at rest) */
    function edges() {
      var cut = [].some.call(strip.querySelectorAll('.gallery-item-container'), function (c) {
        var q = c.getBoundingClientRect(); return q.left < leftEdge - 2 && q.right > leftEdge + 2; });
      fadeL.classList.toggle('jcd-on', cut);
    }
    strip.addEventListener('scroll', edges, { passive: true }); edges();
    /* (3) one nudge when the strip is first well in view */
    var used = false;
    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(function (t) { strip.addEventListener(t, function () { used = true; }, { passive: true }); });
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm && 'IntersectionObserver' in window && strip.firstElementChild && strip.firstElementChild.animate) {
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; io.disconnect();
        setTimeout(function () {
          if (used || strip.scrollLeft > 2) return;
          var card = strip.querySelector('.gallery-item-container'), d = (card ? card.offsetWidth : 300) * 0.22;
          strip.firstElementChild.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + -d + 'px)', offset: 0.38 },
            { transform: 'translateX(' + -d + 'px)', offset: 0.62 }, { transform: 'translateX(0)' }],
            { duration: 1300, easing: 'cubic-bezier(.45, 0, .2, 1)' });
        }, 450);
      }, { threshold: 0.6 });
      io.observe(strip);
    }
    /* (4) settle on the nearest square. A square's place in the row = its offset on screen + how far the row is
       scrolled; every square comes to rest where the first one starts. */
    strip.style.setProperty('scroll-snap-type', 'none', 'important');
    var c0 = strip.querySelector('.gallery-item-container'), held = false, settleT = 0;
    function settle() {
      if (held || !c0) return;
      var sl = strip.getBoundingClientRect().left, at = function (c) { return (c.getBoundingClientRect().left - sl) / z() + strip.scrollLeft; };
      var start = at(c0), best = null;
      [].forEach.call(strip.querySelectorAll('.gallery-item-container'), function (c) {
        var d = at(c) - start - strip.scrollLeft; if (best === null || Math.abs(d) < Math.abs(best)) best = d; });
      var max = strip.scrollWidth - strip.clientWidth;
      if (best !== null && Math.abs(best) > 1 && strip.scrollLeft + best <= max) strip.scrollBy({ left: best, behavior: 'smooth' });
    }
    function settleSoon(ms) { clearTimeout(settleT); settleT = setTimeout(settle, ms); }
    /* a finger on the screen holds the row; it settles once the swipe's own glide has ended */
    strip.addEventListener('touchstart', function () { held = true; clearTimeout(settleT); }, { passive: true });
    strip.addEventListener('touchend', function () { held = false; settleSoon(180); }, { passive: true });
    strip.addEventListener('scroll', function () { settleSoon(180); }, { passive: true });
    /* (5) computer: drag with the mouse; keyboard */
    strip.setAttribute('tabindex', '0'); strip.setAttribute('aria-label', 'End-to-End Expertise, scroll sideways');
    if (phone) return;
    var x0 = null, l0 = 0, moved = false;
    strip.addEventListener('dragstart', function (e) { e.preventDefault(); });
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      x0 = e.clientX; l0 = strip.scrollLeft; moved = false; held = true; strip.classList.add('jcd-e2e-drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (x0 === null) return; var dx = (e.clientX - x0) / z(); if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = l0 - dx;
    });
    window.addEventListener('pointerup', function () {
      if (x0 === null) return; x0 = null; held = false; strip.classList.remove('jcd-e2e-drag'); settleSoon(0);
    });
    strip.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  });
