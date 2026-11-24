/* custom.js — Joel's own interaction tweaks (pairs with custom.css). */
(function () {
  function ready(fn) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn(); }
  ready(function () {
    /* Design Approach cards: hover glow (follows the cursor); on touch, tap toggles it. */
    var ids = ['comp-mnfjmw0p', 'comp-mnfjoibv', 'comp-mnfjomf4', 'comp-mnfjomey'];
    var cards = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var touch = window.matchMedia && matchMedia('(hover: none)').matches;
    cards.forEach(function (c) {
      c.classList.add('jcd-glow-card');
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--gx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      });
      if (touch) c.addEventListener('click', function () {
        var on = !c.classList.contains('is-glow');
        cards.forEach(function (o) { o.classList.remove('is-glow'); });
        if (on) c.classList.add('is-glow');
      });
    });
    if (touch) document.addEventListener('click', function (e) {
      if (!(e.target.closest && e.target.closest('.jcd-glow-card'))) cards.forEach(function (o) { o.classList.remove('is-glow'); });
    });

    /* Cross-Category grid (home, desktop + mobile): each of the two images holds 3x3 product tiles plus a
       category caption strip. We lay 9 tile hotspots over each image, sized to each tile's real picture area
       (measured from the image pixels, 1px inset so no black gutter shows). On hover a tile's own crop lifts
       slightly; a dim blue glow sits underneath it and only shows in the dark gutter around that tile, never
       over neighbouring products. Touch: tap toggles it. */
    var W = 1192, H = 1259;
    var GRID = {   /* [x0,x1) and [y0,y1) of each tile column / row, in image pixels */
      'comp-mv7qmnmm': { c: [[0, 390], [402, 795], [805, 1192]], r: [[0, 385], [394, 786], [800, 1190]] },
      'comp-mv7qmnmr': { c: [[0, 391], [401, 794], [804, 1192]], r: [[0, 385], [394, 785], [800, 1190]] }
    };
    var tiles = [];
    Object.keys(GRID).forEach(function (id) {
      var comp = document.getElementById(id), img = comp && comp.querySelector('img');
      if (!img) return;
      comp.classList.add('jcd-tilegrid');
      var setGutter = function () { comp.style.setProperty('--jcd-g', (9 * comp.clientWidth / W).toFixed(2) + 'px'); };
      setGutter(); window.addEventListener('resize', setGutter);
      var layer = document.createElement('div'); layer.className = 'jcd-tiles'; layer.setAttribute('aria-hidden', 'true');
      GRID[id].r.forEach(function (r) { GRID[id].c.forEach(function (c) {
        var x0 = c[0] + 1, x1 = c[1] - 1, y0 = r[0] + 1, y1 = r[1] - 1;            /* 1px inset */
        var x = x0 / W, y = y0 / H, w = (x1 - x0) / W, h = (y1 - y0) / H;
        var t = document.createElement('div'); t.className = 'jcd-tile';
        t.style.cssText = 'left:' + x * 100 + '%;top:' + y * 100 + '%;width:' + w * 100 + '%;height:' + h * 100 + '%';
        var halo = document.createElement('div'); halo.className = 'jcd-tile-halo';
        var crop = document.createElement('div'); crop.className = 'jcd-tile-img';
        crop.style.cssText = 'background-image:url("' + (img.currentSrc || img.src) + '");background-size:' + (100 / w) + '% ' + (100 / h) + '%;' +
          'background-position:' + (x / (1 - w) * 100) + '% ' + (y / (1 - h) * 100) + '%';
        t.appendChild(halo); t.appendChild(crop); layer.appendChild(t); tiles.push(t);
      }); });
      comp.appendChild(layer);
    });
    if (touch) document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('.jcd-tile');
      tiles.forEach(function (o) { if (o !== t) o.classList.remove('is-glow'); });
      if (t) t.classList.toggle('is-glow');
    });

    /* Home video: line the Vimeo player up exactly with the black window of its glow-frame image
       (comp-mp2fugu9; window measured from the image pixels: x 169-2576, y 137-1491 of 2734x1630),
       at exact 16:9 and 1px oversize, so the glow hugs the video with no dark ring. Desktop layout only. */
    var vid = document.getElementById('comp-moybizuw'), frame = document.getElementById('comp-mp2fugu9');
    var frameImg = frame && frame.querySelector('img');
    if (vid && frameImg) {
      var fit = function () {
        vid.style.transform = ''; vid.style.width = '';
        var fr = frameImg.getBoundingClientRect(), vr = vid.getBoundingClientRect();
        if (!fr.width) return;
        var s = Math.max(fr.width / 2734, fr.height / 1630);              /* object-fit: cover */
        var ox = fr.left + (fr.width - 2734 * s) / 2, oy = fr.top + (fr.height - 1630 * s) / 2;
        var bx = ox + 169 * s, by = oy + 137 * s, bw = 2407 * s, bh = 1354 * s;
        var w = Math.max(bw, bh * 16 / 9) + 2, h = w * 9 / 16;            /* cover the window, 1px each side */
        var cx = bx + bw / 2, cy = by + bh / 2;
        vid.style.setProperty('width', w + 'px', 'important');
        vid.style.transform = 'translate(' + (cx - w / 2 - vr.left) + 'px,' + (cy - h / 2 - vr.top) + 'px)';
      };
      fit(); window.addEventListener('resize', fit); window.addEventListener('load', fit);
    }

    /* Lightbox (click to enlarge): only on galleries that have Wix's fullscreen view on the live site
       (build.py marks them with data-jcd-lightbox and gives each item data-jcd-full). */
    var lbGals = document.querySelectorAll('[data-jcd-lightbox]');
    if (lbGals.length) {
      var lb = document.createElement('div'); lb.className = 'jcd-lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-hidden', 'true');
      lb.innerHTML = '<div class="jcd-lb-stage"><img class="jcd-lb-img" alt=""></div>' +
        '<button class="jcd-lb-btn jcd-lb-close" aria-label="Close">&#x2715;</button>' +
        '<button class="jcd-lb-btn jcd-lb-prev" aria-label="Previous image">&#x2039;</button>' +
        '<button class="jcd-lb-btn jcd-lb-next" aria-label="Next image">&#x203A;</button>' +
        '<div class="jcd-lb-count"></div>';
      document.body.appendChild(lb);
      var lbImg = lb.querySelector('.jcd-lb-img'), lbCount = lb.querySelector('.jcd-lb-count');
      var list = [], idx = 0, lastFocus = null;
      var showImg = function (i) {
        idx = (i + list.length) % list.length;
        lbImg.classList.remove('is-in');
        var src = list[idx], pre = new Image();
        pre.onload = pre.onerror = function () { if (list[idx] !== src) return; lbImg.src = src; requestAnimationFrame(function () { lbImg.classList.add('is-in'); }); };
        pre.src = src;
        lbCount.textContent = (idx + 1) + ' / ' + list.length;
        lb.classList.toggle('jcd-lb-single', list.length < 2);
      };
      var open = function (gal, item) {
        var items = Array.prototype.slice.call(gal.querySelectorAll('[data-jcd-full]'));
        list = items.map(function (it) { return it.getAttribute('data-jcd-full'); });
        lastFocus = document.activeElement;
        lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('jcd-lb-lock');
        showImg(Math.max(0, items.indexOf(item)));
        lb.querySelector('.jcd-lb-close').focus({ preventScroll: true });
      };
      var close = function () {
        lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('jcd-lb-lock');
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      };
      Array.prototype.forEach.call(lbGals, function (gal) {
        /* capture phase on the gallery, so it runs before the hover-overlay tap logic in site.js */
        gal.addEventListener('click', function (e) {
          var item = e.target.closest && e.target.closest('[data-jcd-full]');
          if (!item || e.target.closest('[data-hook="nav-arrow-next"],[data-hook="nav-arrow-prev"],.nav-arrows-container')) return;
          e.preventDefault(); e.stopPropagation(); open(gal, item);
        }, true);
        Array.prototype.forEach.call(gal.querySelectorAll('[data-jcd-full]'), function (it) { it.style.cursor = 'zoom-in'; });
      });
      lb.querySelector('.jcd-lb-close').addEventListener('click', close);
      lb.querySelector('.jcd-lb-prev').addEventListener('click', function (e) { e.stopPropagation(); showImg(idx - 1); });
      lb.querySelector('.jcd-lb-next').addEventListener('click', function (e) { e.stopPropagation(); showImg(idx + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('jcd-lb-stage')) close(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') showImg(idx - 1); else if (e.key === 'ArrowRight') showImg(idx + 1);
      });
      var sx = null, sy = 0;
      lb.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
      lb.addEventListener('touchend', function (e) {
        if (sx === null) return; var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showImg(idx + (dx < 0 ? 1 : -1));
        else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) close();
      });
    }

    /* Cursor light: a blue glow that follows the mouse and lights only the page BACKGROUND (desktop pointer only).
       custom.css paints it on Wix's background fill layers ([data-testid="colorUnderlay"]), which sit below every
       image, video and text, so content is never covered. We only move the CSS vars --mx/--my (eased each frame)
       and fade --jcd-light in/out. */
    var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !calm) {
      var rs = document.documentElement.style, hdrEl = document.getElementById('SITE_HEADER');
      document.documentElement.classList.add('jcd-light-on');
      /* light only opaque background fills (and the page background), so stacked transparent layers don't double it */
      Array.prototype.forEach.call(document.querySelectorAll('[data-testid="colorUnderlay"]'), function (u) {
        var m = getComputedStyle(u).backgroundColor.match(/rgba?\(([^)]+)\)/), a = 1;
        if (m) { var parts = m[1].split(','); a = parts.length > 3 ? parseFloat(parts[3]) : 1; }
        if (u.closest('#SITE_HEADER')) return;   /* the header never gets the light (Joel) */
        if (a >= 0.99 || u.closest('#BACKGROUND_GROUP, [id^="pageBackground"]')) u.classList.add('jcd-lit');
      });
      var tx = 0, ty = 0, gx = 0, gy = 0, li = 0, lt = 0, raf = 0, seen = false;
      var step = function () {
        gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14; li += (lt - li) * 0.08;
        rs.setProperty('--mx', gx.toFixed(1) + 'px'); rs.setProperty('--my', gy.toFixed(1) + 'px');
        /* keep the header band free of light: the light image starts below the header (--hb) and fades out
           as the cursor nears it, so no edge shows */
        var hb = hdrEl ? Math.max(0, Math.round(hdrEl.getBoundingClientRect().bottom)) : 0;
        var f = Math.min(1, Math.max(0, (gy - hb) / 200));
        rs.setProperty('--hb', hb + 'px');
        rs.setProperty('--jcd-light', (li * f).toFixed(3));
        raf = (Math.abs(tx - gx) + Math.abs(ty - gy) > 0.3 || Math.abs(lt - li) > 0.004) ? requestAnimationFrame(step) : 0;
      };
      var kick = function () { if (!raf) raf = requestAnimationFrame(step); };
      document.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        tx = e.clientX; ty = e.clientY;
        if (!seen) { seen = true; gx = tx; gy = ty; }
        lt = 1; kick();
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', function () { lt = 0; kick(); });
      window.addEventListener('scroll', kick, { passive: true });
      if (hdrEl) hdrEl.addEventListener('transitionend', kick);
      window.addEventListener('blur', function () { lt = 0; kick(); });
    }

    /* Header: slide up out of view when scrolling down, slide back when scrolling up; always shown at top.
       (Joel's design; live Wix only fades it out.) Not hidden while the Works dropdown or mobile menu is open. */
    var hdr = document.getElementById('SITE_HEADER');
    if (hdr) {
      hdr.classList.add('jcd-autohide');
      var lastY = window.scrollY, acc = 0, THRESH = 8;
      var menuOpen = function () {
        return !!(hdr.querySelector('li[data-shown]') || document.querySelector('#MENU_AS_CONTAINER.I_VSKP'));
      };
      var tick = false;
      var update = function () {
        tick = false;
        var y = window.scrollY, dy = y - lastY; lastY = y;
        if (y <= Math.max(10, hdr.offsetHeight * 0.5)) { hdr.classList.remove('jcd-hidden'); acc = 0; return; }
        if ((dy > 0) !== (acc > 0)) acc = 0;
        acc += dy;
        if (acc > THRESH && !menuOpen()) hdr.classList.add('jcd-hidden');
        else if (acc < -THRESH) hdr.classList.remove('jcd-hidden');
      };
      window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    }
  });
})();
