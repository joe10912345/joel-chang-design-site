  /* Home client logo wall as a slow marquee (Joel 2026-11-28: chose option A of preview/mockups/home-marquee.html —
     "A可以，但手機板要變三排，然後我發現有些接縫空間很大"). The wall image (home-18, a 6 x 3 grid of logo tiles) is hidden and
     rebuilt as 3 rows of 6 tiles on every device, in the same box: rows run in alternate directions, ends fade out,
     the speed rises while the page scrolls, a row pauses under the mouse (computer), fingers / mouse can drag and
     fling a row (vertical swipes still scroll the page). Each tile is cropped to its exact box in the image — the
     tiles are not evenly placed there (left margin 7px, right 15px; rows start at 12 / 183 / 354), which made big
     seams — and every gap is the same, so the loop is seamless. Uses the 1908px image on the phone too (the 580px copy
     is blurry at tile size), loaded only when the wall comes near. Reduced motion: the original still image stays.
     The hidden image stays in the page; the marquee is aria-hidden. CSS: src/css/home/logo-marquee.css */
  ready(function () {
    var comp = document.getElementById('comp-mv6mx9mx'), img = document.getElementById('img_comp-mv6mx9mx');
    if (!comp || !img) return;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var phone = /\/m\//.test(location.pathname);
    var src = (img.currentSrc || img.src).replace(/home-18-[^\/?#]+/, 'home-18-1908x528.webp');
    /* tile boxes in home-18-1908x528.webp (measured from the image's transparency) */
    var IW = 1908, IH = 528, TX = [7, 324, 641, 958, 1274, 1590], TY = [12, 183, 354], TW = 303, TH = 158, GAP = 13.5 / 158;
    var SPEED = phone ? 14 : 20;   /* layout px per second */
    var box, rows = [], boost = 0, lastY = window.scrollY, t0 = 0, running = false, visible = false;

    function tile(c, r, h) {
      var e = document.createElement('div'); e.className = 'jcd-mq-t';
      e.style.width = (h * TW / TH) + 'px'; e.style.marginRight = (h * GAP) + 'px';
      e.style.backgroundImage = 'url("' + src + '")';
      e.style.backgroundSize = (IW / TW * 100) + '% ' + (IH / TH * 100) + '%';
      e.style.backgroundPosition = (TX[c] / (IW - TW) * 100) + '% ' + (TY[r] / (IH - TH) * 100) + '%';
      return e;
    }
    function layout() {
      var H = comp.offsetHeight, W = comp.offsetWidth; if (!H || !W) return;
      var old = rows; rows = []; box.innerHTML = '';
      var h = H / (3 + 2 * GAP), z = window.__jcdZoom || 1;
      for (var r = 0; r < 3; r++) {
        var row = document.createElement('div'); row.className = 'jcd-mq-row'; row.style.height = h + 'px';
        var tr = document.createElement('div'); tr.className = 'jcd-mq-track';
        var len = 6 * h * (TW / TH + GAP), copies = Math.ceil(W / len) + 2;
        for (var k = 0; k < copies; k++) for (var c = 0; c < 6; c++) tr.appendChild(tile(c, r, h));
        row.appendChild(tr); box.appendChild(row);
        rows.push(hook({ el: row, tr: tr, len: len, dir: r % 2 ? 1 : -1, off: old[r] ? old[r].off / old[r].len * len : -len * (r % 2 ? .5 : 0), v: 0 }, z));
      }
    }
    /* mouse over a row = pause; press + drag (mouse or finger) moves it, release flings it */
    function hook(R, z) {
      var row = R.el;
      row.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') R.hold = true; });
      row.addEventListener('pointerleave', function () { if (!R.drag) R.hold = false; });
      row.addEventListener('pointerdown', function (e) {
        R.drag = true; R.hold = true; R.px = e.clientX; R.v = 0; row.classList.add('jcd-mq-drag');
        try { row.setPointerCapture(e.pointerId); } catch (x) {}
      });
      row.addEventListener('pointermove', function (e) {
        if (!R.drag) return; var dx = (e.clientX - R.px) / (window.__jcdZoom || z || 1); R.px = e.clientX; R.off += dx; R.v = dx * 60;
      });
      function up(e) { if (!R.drag) return; R.drag = false; R.hold = e.pointerType === 'mouse' && row.matches(':hover'); row.classList.remove('jcd-mq-drag'); }
      row.addEventListener('pointerup', up); row.addEventListener('pointercancel', up);
      return R;
    }
    function tick(now) {
      if (!visible) { running = false; return; }
      var dt = Math.min(.05, (now - t0) / 1000); t0 = now; boost *= Math.pow(.05, dt);
      var base = SPEED + boost;
      rows.forEach(function (R) {
        if (!R.drag) { R.v *= Math.pow(.02, dt); R.off += (R.hold ? 0 : base * R.dir) * dt + R.v * dt; }
        R.off = ((R.off % R.len) - R.len) % R.len;   /* stay within one set: seamless loop */
        R.tr.style.transform = 'translate3d(' + R.off + 'px,0,0)';
      });
      requestAnimationFrame(tick);
    }
    function start() { if (running || !visible) return; running = true; t0 = performance.now(); requestAnimationFrame(tick); }
    function build() {
      box = document.createElement('div'); box.className = 'jcd-mq'; box.setAttribute('aria-hidden', 'true');
      comp.appendChild(box); comp.classList.add('jcd-mq-on'); layout();
    }
    /* scrolling the page speeds the rows up for a moment */
    window.addEventListener('scroll', function () { var y = window.scrollY; boost = Math.min(160, boost + Math.abs(y - lastY) * .6); lastY = y; }, { passive: true });
    var rz; function relayout() { clearTimeout(rz); rz = setTimeout(function () { if (box) layout(); }, 150); }
    window.addEventListener('resize', relayout); window.addEventListener('jcd:phone-layout', relayout);
    /* built when the wall comes near (the large image loads then); runs only while on screen */
    if (!('IntersectionObserver' in window)) { visible = true; build(); start(); return; }
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !box) build();
      start();
    }, { rootMargin: '600px 0px' }).observe(comp);
  });
