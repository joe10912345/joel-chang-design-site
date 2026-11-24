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
        var z = window.__jcdZoom || 1;   /* page zoom on wide screens: screen px -> CSS px */
        c.style.setProperty('--gx', (e.clientX - r.left) / z + 'px');
        c.style.setProperty('--gy', (e.clientY - r.top) / z + 'px');
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
        var z = window.__jcdZoom || 1;   /* rects are screen px; styles are CSS px */
        vid.style.setProperty('width', w / z + 'px', 'important');
        vid.style.transform = 'translate(' + (cx - w / 2 - vr.left) / z + 'px,' + (cy - h / 2 - vr.top) / z + 'px)';
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
        var z = window.__jcdZoom || 1;   /* page zoom on wide screens: screen px -> CSS px */
        rs.setProperty('--mx', (gx / z).toFixed(1) + 'px'); rs.setProperty('--my', (gy / z).toFixed(1) + 'px');
        /* keep the header band free of light: the light image starts below the header (--hb) and fades out
           as the cursor nears it, so no edge shows */
        var hb = hdrEl ? Math.max(0, Math.round(hdrEl.getBoundingClientRect().bottom)) : 0;
        var f = Math.min(1, Math.max(0, (gy - hb) / 200));
        rs.setProperty('--hb', (hb / z).toFixed(1) + 'px');
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

    /* Contact form (contact page, desktop + m/): send to Joel's Gmail through Web3Forms (no backend on GitHub
       Pages; the access key is public by design). Validates email + message, disables SUBMIT while sending, shows "sent" / error in the page style. */
    var form = document.getElementById('comp-jqc9copb');
    if (form && form.tagName === 'FORM') {
      var ENDPOINT = 'https://api.web3forms.com/submit', ACCESS_KEY = '391de8ae-38e4-43c0-9d77-393d65c69402', TIMEOUT = 5000;
      var q = function (sel) { return form.querySelector(sel); };
      var fFirst = q('[name="first-name"]'), fLast = q('[name="last-name"]'), fEmail = q('[name="email"]'),
          fPhone = q('[name="phone"]'), fMsg = q('textarea'), btn = q('button');
      var btnLabel = btn && btn.querySelector('span'), btnText = btnLabel ? btnLabel.textContent : 'SUBMIT';
      form.noValidate = true;
      if (getComputedStyle(form).position === 'static') form.style.position = 'relative';
      var honey = document.createElement('input');
      honey.type = 'checkbox'; honey.name = 'botcheck'; honey.tabIndex = -1; honey.autocomplete = 'off';
      honey.setAttribute('aria-hidden', 'true'); honey.className = 'jcd-honey'; form.appendChild(honey);
      var note = document.createElement('div'); note.className = 'jcd-form-note'; note.setAttribute('role', 'status');
      note.setAttribute('aria-live', 'polite'); form.appendChild(note);
      var done = document.createElement('div'); done.className = 'jcd-form-done'; done.setAttribute('role', 'status');
      done.innerHTML = '<div class="jcd-form-done-in"><div class="jcd-form-done-t">Thanks! Your message has been sent.</div>' +
        '<div class="jcd-form-done-s">I\'ll get back to you soon.</div><button type="button" class="jcd-form-again">Send another message</button></div>';
      form.appendChild(done);
      var say = function (msg, kind) { note.textContent = msg || ''; note.className = 'jcd-form-note' + (msg ? ' is-' + (kind || 'err') : ''); };
      var mark = function (el, bad) { if (el) { el.setAttribute('aria-invalid', bad ? 'true' : 'false'); el.classList.toggle('jcd-bad', !!bad); } };
      var busy = false;
      done.querySelector('.jcd-form-again').addEventListener('click', function () { form.classList.remove('jcd-sent'); say(''); if (fFirst) fFirst.focus(); });
      [fEmail, fMsg].forEach(function (el) { if (el) el.addEventListener('input', function () { mark(el, false); if (note.classList.contains('is-err')) say(''); }); });
      form.addEventListener('submit', function (e) {
        e.preventDefault(); if (busy) return;
        var email = (fEmail && fEmail.value || '').trim(), msg = (fMsg && fMsg.value || '').trim();
        var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        mark(fEmail, !okEmail); mark(fMsg, !msg);
        if (!email) { say('Please enter your email address.'); fEmail.focus(); return; }
        if (!okEmail) { say('Please enter a valid email address.'); fEmail.focus(); return; }
        if (!msg) { say('Please write a message.'); fMsg.focus(); return; }
        if (honey.checked) { form.classList.add('jcd-sent'); return; }          /* bot: pretend it worked */
        var name = [(fFirst && fFirst.value || '').trim(), (fLast && fLast.value || '').trim()].filter(Boolean).join(' ');
        var data = { access_key: ACCESS_KEY, subject: 'New message from joel-chang-design.com', from_name: 'Joel Chang Design website',
          name: name || '(no name)', email: email, phone: (fPhone && fPhone.value || '').trim(), message: msg, replyto: email, botcheck: false };
        var ctl = window.AbortController ? new AbortController() : null;
        var timer = ctl ? setTimeout(function () { ctl.abort(); }, TIMEOUT) : 0;   /* never hang on SENDING */
        busy = true; btn.disabled = true; btn.setAttribute('aria-disabled', 'true'); btn.classList.add('jcd-sending');
        if (btnLabel) btnLabel.textContent = 'SENDING...'; say('');
        fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data), signal: ctl ? ctl.signal : undefined })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
          .then(function (res) {
            var ok = res.ok && (res.j.success === true || res.j.success === 'true');
            if (!ok) throw new Error((res.j && res.j.message) || 'send failed');
            form.reset(); form.classList.add('jcd-sent');
          })
          .catch(function () {
            say('Sorry, your message could not be sent. Please try again, or email joe10912345@gmail.com directly.');
          })
          .then(function () {
            clearTimeout(timer); busy = false; btn.disabled = false; btn.setAttribute('aria-disabled', 'false'); btn.classList.remove('jcd-sending');
            if (btnLabel) btnLabel.textContent = btnText;
          });
      });
    }
    }
  });
  /* Phone menu: LinkedIn + Behance icons under the menu items (Joel 2026-11-24). The footer that held the only copy on
     m/ pages is hidden (custom.css), so its two icon links are cloned into the hamburger menu. */
  (function () {
    function addSocial() {
      var nav = document.getElementById('MENU_AS_CONTAINER_EXPANDABLE_MENU');
      if (!nav || nav.querySelector('.jcd-menu-social')) return;
      var links = document.querySelectorAll('#SITE_FOOTER a[href*="linkedin.com"], #SITE_FOOTER a[href*="behance.net"]');
      if (!links.length) return;
      var row = document.createElement('div'); row.className = 'jcd-menu-social';
      [].forEach.call(links, function (a) {
        var c = a.cloneNode(true); c.removeAttribute('id'); c.className = 'jcd-menu-social-a';
        var im = c.querySelector('img'); if (im) c.style.setProperty('--jcd-mask', 'url("' + im.src + '")');   /* blue pressed copy */
        [].forEach.call(c.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
        row.appendChild(c);
      });
      nav.appendChild(row);
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', addSocial) : addSocial();
  })();
  /* Phone: taller top image (Joel 2026-11-24). On m/ pages the first image (home slideshow, product-page hero) was only
     ~1/3 (home) or ~1/4 (products) of the screen. If the page starts with a full-width short image, every element of
     that block with the image's height is set to half the screen height (Joel: 50%) (svh = stable on iOS when the toolbar moves);
     the page below moves down with it. The HTML points these images at their largest file so they stay sharp.
     Catalog pages / About (no full-width image at the top) are left alone. */
  (function () {
    function tallHero() {
      if (!document.body.classList.contains('device-mobile-optimized')) return;
      var sec = document.querySelector('#PAGES_CONTAINER section');
      if (!sec || sec.classList.contains('jcd-mhero')) return;
      var img = [].filter.call(sec.querySelectorAll('img'), function (i) { return !/^data:/.test(i.getAttribute('src') || ''); })[0];
      if (!img) return;
      var r = img.getBoundingClientRect(), vw = document.documentElement.clientWidth;
      if (r.width < vw - 4 || r.height < 60 || r.height > 320 || r.top > 80) return;
      var h0 = r.height;
      [].forEach.call(sec.querySelectorAll('*'), function (e) {
        if (Math.abs(e.getBoundingClientRect().height - h0) <= 2) e.style.setProperty('height', '50svh', 'important');
      });
      sec.classList.add('jcd-mhero');
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', tallHero) : tallHero();
  })();
  /* Catalog title bars (Joel 2026-11-24): each card on the category pages is a white outline (vector) with a title bar
     above the photo: title on the left, a short description on the right. Wix placed the right text a few px too low
     (e.g. Lifestyle "Atmosphere & Daily Experience" nearly touches the photo). Every text inside a bar is moved so its
     vertical centre sits on the bar's centre (bar = outline top .. photo top). Desktop, iPad and phone. Uses `top`
     (the texts are position:relative), so tilt.js transforms are untouched. */
  (function () {
    function Z() { return window.__jcdZoom || 1; }
    function centreBars() {
      var photos = document.querySelectorAll('.gpDCD5');
      if (!photos.length) return;
      var texts = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'));
      var frames = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER .wixui-vector-image'));
      texts.forEach(function (t) { if (t.hasAttribute('data-jcd-bar')) { t.style.top = ''; } });
      [].forEach.call(photos, function (ph) {
        var pr = ph.getBoundingClientRect(); if (!pr.width) return;
        var fr = null;
        frames.forEach(function (v) {
          var r = v.getBoundingClientRect();
          if (r.top < pr.top - 8 && r.bottom >= pr.bottom - 4 && Math.abs(r.left - pr.left) < 8 && Math.abs(r.right - pr.right) < 8 && pr.top - r.top < 200 * Z()) fr = r;
        });
        if (!fr) return;
        var c = (fr.top + pr.top) / 2;
        texts.forEach(function (t) {
          var r = t.getBoundingClientRect(); if (!r.height) return;
          var tc = (r.top + r.bottom) / 2;
          if (tc <= fr.top || tc >= pr.top || r.left < fr.left - 4 || r.right > fr.right + 4) return;
          var d = (c - tc) / Z();
          if (Math.abs(d) < 0.5 || Math.abs(d) > 30) return;
          t.setAttribute('data-jcd-bar', ''); t.style.top = d.toFixed(2) + 'px';
        });
      });
    }
    function run() { centreBars(); }
    var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(run, 50); }); };
    document.readyState === 'complete' ? go() : window.addEventListener('load', go);
  })();
  /* Page background (Joel 2026-11-24): if every top-level section is covered by its own opaque colour or image, the
     page's white background layer can only show through seams (thin white lines) -> tag the page so CSS paints that
     layer black. Pages with a transparent section (the light pages) keep Wix's white. Desktop, iPad and phone. */
  (function () {
    function alpha(c) { var m = (c || '').match(/[\d.]+/g); return !m ? 0 : (m.length > 3 ? +m[3] : 1); }
    function classify() {
      var open = 0;
      [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER section'), function (s) {
        if (open || (s.parentElement && s.parentElement.closest('section'))) return;
        var sr = s.getBoundingClientRect(); if (sr.height < 2) return;
        var cands = [s].concat([].slice.call(s.querySelectorAll('section, div[id], [data-testid="colorUnderlay"], img, video, wow-image, wow-video, canvas')));
        for (var i = 0; i < cands.length; i++) {
          var e = cands[i], r = e.getBoundingClientRect();
          if (r.width < sr.width * 0.97 || r.height < sr.height * 0.95) continue;
          if (/^(IMG|VIDEO|CANVAS|WOW-IMAGE|WOW-VIDEO)$/.test(e.tagName)) return;
          var cs = getComputedStyle(e);
          if (alpha(cs.backgroundColor) >= 0.99 || cs.backgroundImage !== 'none') return;
        }
        open++;
      });
      document.documentElement.classList.toggle('jcd-dark-canvas', !open);
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', classify) : classify();
  })();

  /* Category pages, desktop layout (computer + iPad): the white card frames were drawn ~15px left of centre in Wix
     (titles are centred), so the left gap was smaller than the right. Every grid item that sits in a card row is
     moved by the same amount so the frames are centred: equal space left and right (Joel 2026-11-24). */
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
      [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER [data-mesh-id$="inlineContent-gridContainer"] > [id]'), function (e) {
        if (e.tagName === 'SECTION' || e.querySelector('section')) return;
        var r = e.getBoundingClientRect(); if (!r.width) return;
        var inRow = rows.some(function (f) { return r.top >= f.top - 2 && r.bottom <= f.bottom + 2 && r.left >= f.left - 4 && r.right <= f.right + 4; });
        if (!inRow) return;
        var cs = getComputedStyle(e); if (cs.position !== 'relative') return;
        e.style.left = ((parseFloat(cs.left) || 0) + d).toFixed(2) + 'px';
      });
      window.dispatchEvent(new Event('resize'));   /* tilt.js / glow re-measure */
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', centreCards) : centreCards();
  })();
  // iOS Safari only applies :active (pressed states) when a touchstart listener exists.
  document.addEventListener('touchstart', function () {}, { passive: true });
})();
