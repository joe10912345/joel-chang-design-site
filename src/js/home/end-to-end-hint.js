  /* Home "End-to-End Expertise": no arrows, the strip itself says "there is more, swipe" (Joel 2026-11-27: "end to end
     是不是不用箭頭? 只要畫面被切到或是左右動一下人家就知道是要左滑?" -> variant C of preview/mockups/end-to-end-hint.html,
     every platform). Runs after end-to-end-slider.js (square sizes). Arrows hidden in end-to-end-hint.css.
     (1) Phone: the strip runs to the screen's right edge, so the next square is cut by the screen, not in mid-air
         (computer: cut at the content margin, iPad: by the screen).
     (2) A soft fade to black at the right edge; at the left edge too while a square is cut there (Joel 2026-11-27:
         "輪播往右滑後，最左邊被切到的也要有漸層消失").
     (3) (removed 2026-11-28: the nudge, Joel "取消左滑來回的示意動態效果")
     (4) The row always comes to rest with a square at its start. Wix's own CSS snapping used the squares' places from
         before they were enlarged and stopped between them, so it is off; we settle after every swipe / drag / scroll.
     (5) Computer: drag with the mouse (trackpad / Shift + wheel scroll natively); arrow keys when focused.
     (6) Mouse wheel: scrolling down moves the row right, up moves it left (Joel 2026-11-28: "方塊要支援滑鼠往下滾=往右滑").
         The row has an end (no loop): it stops with the last squares in view, and at either end the wheel scrolls the
         page again ("滾到底…到底後頁面可下滑"), so the visitor is never stuck in the strip. Side thumb wheels: see below.
     (7) Clicking / tapping a square brings it to the middle of the view and keeps it dark with its text shown (Joel
         2026-11-28: "如果我點擊任何方塊圖，圖片要自動拉到中間與壓黑顯示字"), until another square is clicked or the
         visitor clicks elsewhere. Every platform. */
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
    var leftEdge = 0, rightEdge = 0;   /* where the row is cut on the left / right (window px) */
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
      right = Math.min(vw, right); left = Math.max(0, left); leftEdge = left; rightEdge = right;
      [[fadeR, (right - cr.left) / z() - w], [fadeL, (left - cr.left) / z()]].forEach(function (p) {
        p[0].style.left = p[1].toFixed(1) + 'px'; p[0].style.width = w + 'px';
        p[0].style.top = ((sr.top - cr.top) / z()).toFixed(1) + 'px'; p[0].style.height = (sr.height / z()).toFixed(1) + 'px';
      });
      ending();
      edges();
    }
    /* (8) the end of the row (Joel 2026-11-28: "滑到底時要剩 1 個半"): the row can go on until the last square stands
       half a square in from the left edge, so one and a half squares are left in view; the inner box gets that width */
    var inner = strip.querySelector('.gallery-horizontal-scroll-inner');
    function ending() {
      var cs = [].slice.call(strip.querySelectorAll('.gallery-item-container')); if (!inner || cs.length < 2) return;
      var first = cs[0], last = cs[cs.length - 1], step = cs[1].offsetLeft - first.offsetLeft;
      var natural = last.offsetLeft + last.offsetWidth + first.offsetLeft;
      var want = last.offsetLeft - first.offsetLeft - step / 2 + strip.clientWidth;
      inner.style.setProperty('width', Math.max(natural, want).toFixed(1) + 'px', 'important');
    }
    layout(); window.addEventListener('load', layout); window.addEventListener('resize', layout); setTimeout(layout, 1500);
    /* the left fade only while a square is actually cut there (while moving; on the iPad also at rest) */
    function edges() {
      var cut = [].some.call(strip.querySelectorAll('.gallery-item-container'), function (c) {
        var q = c.getBoundingClientRect(); return q.left < leftEdge - 2 && q.right > leftEdge + 2; });
      fadeL.classList.toggle('jcd-on', cut);
    }
    strip.addEventListener('scroll', edges, { passive: true }); edges();
    /* (3) the one-time nudge is gone (Joel 2026-11-28: "取消左滑來回的示意動態效果"); the cut square and the fade say "swipe" */
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* (4) settle on the nearest square. A square's place in the row = its offset on screen + how far the row is
       scrolled; every square comes to rest where the first one starts. */
    strip.style.setProperty('scroll-snap-type', 'none', 'important');
    var c0 = strip.querySelector('.gallery-item-container'), held = false, settleT = 0, pinned = null;
    function settle() {
      if (held || pinned || !c0) return;   /* a clicked square stays in the middle (7) */
      var sl = strip.getBoundingClientRect().left, at = function (c) { return (c.getBoundingClientRect().left - sl) / z() + strip.scrollLeft; };
      var start = at(c0), best = null;
      [].forEach.call(strip.querySelectorAll('.gallery-item-container'), function (c) {
        var d = at(c) - start - strip.scrollLeft; if (best === null || Math.abs(d) < Math.abs(best)) best = d; });
      var max = strip.scrollWidth - strip.clientWidth;
      /* the row has an end now (no loop, Joel 2026-11-28): resting at the very end is allowed too, so the last square
         is shown whole */
      if (best === null || strip.scrollLeft + best > max || Math.abs(max - strip.scrollLeft) < Math.abs(best)) best = max - strip.scrollLeft;
      if (Math.abs(best) > 1) strip.scrollBy({ left: best, behavior: 'smooth' });
    }
    function settleSoon(ms) { clearTimeout(settleT); settleT = setTimeout(settle, ms); }
    /* a finger on the screen holds the row; it settles once the swipe's own glide has ended */
    strip.addEventListener('touchstart', function () { held = true; clearTimeout(settleT); }, { passive: true });
    strip.addEventListener('touchend', function () { held = false; settleSoon(180); }, { passive: true });
    /* only a finger swipe settles on a square; the wheel, trackpad and thumb wheel glide freely and stop where they
       stop (Joel 2026-11-28: "滑動不太順，感覺一格格的很明顯") */
    var lastInput = '';
    strip.addEventListener('touchstart', function () { lastInput = 'touch'; }, { passive: true });
    strip.addEventListener('wheel', function () { lastInput = 'wheel'; }, { passive: true });
    strip.addEventListener('scroll', function () { if (lastInput === 'touch') settleSoon(180); }, { passive: true });
    /* (7) click / tap a square: to the middle of the visible row, dark with its text. site.js 5b shows the overlay on
       mouse-enter (computer) / tap (touch) and hides it on mouse-leave; the pinned square's mouse-leave is held back
       here, and sent once it lets go (unless the mouse is still on it). */
    var touch = window.matchMedia && matchMedia('(hover: none)').matches;
    function centre(c) {
      var q = c.getBoundingClientRect(), mid = (leftEdge + rightEdge) / 2, max = strip.scrollWidth - strip.clientWidth;
      var to = Math.max(0, Math.min(max, strip.scrollLeft + (q.left + q.width / 2 - mid) / z()));
      strip.scrollTo({ left: to, behavior: calm ? 'auto' : 'smooth' });
    }
    function unpin() { if (!pinned) return; var p = pinned; pinned = null; if (!touch && !p.matches(':hover')) p.dispatchEvent(new MouseEvent('mouseleave')); }
    strip.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('.gallery-item-container'); if (!c || !strip.contains(c)) return;
      if (pinned && pinned !== c) unpin();
      pinned = c; clearTimeout(settleT); if (!touch) c.dispatchEvent(new MouseEvent('mouseenter')); centre(c);
    });
    strip.addEventListener('mouseleave', function (e) { if (pinned && e.target === pinned) e.stopPropagation(); }, true);
    document.addEventListener('pointerdown', function (e) { if (pinned && !(e.target.closest && e.target.closest('.gallery-item-container'))) unpin(); });
    /* the visitor moves the row again: the square lets go (its text stays until the mouse leaves it) */
    strip.addEventListener('pointerdown', function (e) { if (pinned && !pinned.contains(e.target)) unpin(); });
    strip.addEventListener('touchmove', function () { pinned = null; }, { passive: true });   /* a swipe lets it go (site.js hides it on the next tap) */
    /* (6) the mouse wheel moves the row sideways; not on the phone */
    if (!phone) strip.addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;
      var unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? strip.clientWidth : 1, d;
      /* a side (thumb) wheel, e.g. Logitech MX: whole steps on the x axis only. Its direction felt reversed (Joel
         2026-11-28: "羅技的拇指輪目前滾動時方向是相反，改過來"), so it is turned round here. Trackpads (small, uneven
         steps) and Shift + wheel keep the browser's own direction. */
      if (!e.shiftKey && e.deltaY === 0 && Math.abs(e.deltaX) >= 40 && e.deltaX === Math.round(e.deltaX)) d = -e.deltaX * unit;
      else if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) d = e.deltaY * unit;
      else return;
      var max = strip.scrollWidth - strip.clientWidth;
      if ((d > 0 && strip.scrollLeft >= max - 1) || (d < 0 && strip.scrollLeft <= 1)) return;   /* at the end: the page scrolls */
      e.preventDefault(); unpin(); clearTimeout(settleT);
      glideTo((gliding ? goal : strip.scrollLeft) + d / z());
    }, { passive: false });
    /* each wheel step adds to a goal the row eases towards, frame by frame, so steps run into one smooth movement */
    var goal = 0, gliding = false;
    function glideTo(x) {
      goal = Math.max(0, Math.min(strip.scrollWidth - strip.clientWidth, x));
      if (calm) { strip.scrollLeft = goal; return; }
      if (gliding) return; gliding = true; strip.style.scrollBehavior = 'auto';
      (function tick() {
        var d = goal - strip.scrollLeft;
        if (Math.abs(d) < 0.6) { strip.scrollLeft = goal; gliding = false; strip.style.scrollBehavior = ''; return; }
        var before = strip.scrollLeft; strip.scrollLeft += Math.sign(d) * Math.max(Math.abs(d) * 0.16, 1);
        if (strip.scrollLeft === before) { strip.scrollLeft = goal; gliding = false; strip.style.scrollBehavior = ''; return; }   /* rounded away: finish */
        requestAnimationFrame(tick);
      })();
    }
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
      if (x0 === null) return; var dx = (e.clientX - x0) / z(); if (Math.abs(dx) > 4) { moved = true; unpin(); }
      strip.scrollLeft = l0 - dx;
    });
    window.addEventListener('pointerup', function () {
      if (x0 === null) return; x0 = null; held = false; strip.classList.remove('jcd-e2e-drag'); settleSoon(0);
    });
    strip.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  });
