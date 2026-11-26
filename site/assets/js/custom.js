/* custom.js — Joel's own interaction tweaks (pairs with custom.css). */
(function () {
  function ready(fn) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn(); }

  /* Wix "fixed" section backgrounds -> photo pinned to its own section (Joel 2026-11-25: the last image of many pages
     was cut at the bottom, e.g. Wi-Fi 7 2022 "New Wi-Fi 7 Generation"). Wix made these photos sticky and screen-sized,
     so a section taller than the screen never showed the photo's bottom, and on the phone a 300px section showed less
     than half of a 693px photo. Every sticky/fixed section photo now covers exactly its section (object-fit: cover),
     and its media box no longer clips (iPad Safari). Runs first, before the top-image script measures heights.
     29 photos at the time (desktop + phone); About "What I Believe" / Gaming "Aerodynamic" were already pinned in CSS. */
  ready(function () {
    [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER wow-image[id^="img_"]'), function (wi) {
      var pos = getComputedStyle(wi).position; if (pos !== 'sticky' && pos !== 'fixed') return;
      var media = wi.parentElement;
      if (media && /^bgMedia_/.test(media.id || '')) {
        media.style.setProperty('top', '0', 'important'); media.style.setProperty('height', '100%', 'important');
        media.style.setProperty('overflow', 'visible', 'important');
      }
      ['position:absolute', 'top:0', 'left:0', 'width:100%', 'height:100%', 'transform:none'].forEach(function (d) {
        var kv = d.split(':'); wi.style.setProperty(kv[0], kv[1], 'important'); });
      var img = wi.querySelector('img');
      if (img) { img.style.setProperty('width', '100%', 'important'); img.style.setProperty('height', '100%', 'important'); img.style.setProperty('object-fit', 'cover', 'important'); }
      wi.setAttribute('data-jcd-pinned', '');
    });
  });

  /* Closing photo of product pages: Wix-style scroll reveal (Joel 2026-11-26: "邊滾動揭露", like the Wix site).
     The last section of a product page is a photo with no text. It is now exactly as tall as the photo (width / photo
     ratio, at most one screen), so the whole photo (products included) is visible at the end of the page. While the
     page scrolls in, the photo stays still at the bottom of the screen and the section's top edge slides up over it,
     the way Wix's "fixed" background did. Photo-only = no text in the section. Phone, iPad and computer alike. */
  ready(function () {
    var secs = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER section'), function (s) {
      return !s.parentElement.closest('section'); });
    var sec = secs[secs.length - 1]; if (!sec) return;
    /* the section's background photo (on the phone Wix did not make it sticky, so it may not be pinned above) */
    var wi = sec.querySelector('[id^="bgMedia_"] > wow-image[id^="img_"]'); if (!wi) return;
    if (sec.querySelector('[data-testid="richTextElement"]')) return;
    var img = wi.querySelector('img'); if (!img) return;
    /* never lazy: the section's height comes from the photo, and a lazy photo in a 0px section never loads (2026-11-26) */
    img.loading = 'eager'; img.removeAttribute('loading');
    var fm = /-(\d+)x(\d+)(?:-[a-z0-9]+)?\.(?:jpe?g|png|webp)/i.exec(img.getAttribute('src') || '');   /* size in the file name */
    var media = wi.parentElement;
    /* Done with CSS sticky, not a scroll script (Joel 2026-11-26: with the script, fast scrolling showed white gaps
       because the photo was moved a frame late). The media box reaches one photo-height above the section; the photo
       sits at its bottom (= the section) and is sticky at the screen bottom, so the browser itself keeps it still
       while the section's top edge (the section's background box clips it) slides up over it. */
    /* the section's background box clips the photo; 'clip', not 'hidden' (phone): 'hidden' would make it the sticky
       photo's scroll box and the photo would not stay still */
    if (media.parentElement) media.parentElement.style.setProperty('overflow', 'clip', 'important');
    media.style.setProperty('overflow', 'visible', 'important'); media.style.setProperty('margin', '0', 'important');   /* Wix: margin-top -1 screen */
    media.style.setProperty('transform', 'none', 'important');
    /* photo at the bottom of the box via flex (a margin above it would leave the sticky photo no room to move) */
    media.style.setProperty('display', 'flex', 'important'); media.style.setProperty('flex-direction', 'column', 'important');
    media.style.setProperty('justify-content', 'flex-end', 'important');
    media.style.setProperty('left', '0', 'important'); media.style.setProperty('width', '100%', 'important');
    ['position:sticky', 'top:auto', 'bottom:0', 'left:auto', 'width:100%', 'display:block', 'transform:none', 'flex:none', 'margin:0'].forEach(function (d) {
      var kv = d.split(':'); wi.style.setProperty(kv[0], kv[1], 'important'); });
    img.style.setProperty('width', '100%', 'important'); img.style.setProperty('height', '100%', 'important');
    img.style.setProperty('object-fit', 'cover', 'important');
    sec.classList.add('jcd-reveal');
    /* Wix gives the section's empty content box its old height (e.g. 1000px): it would leave a blank strip below */
    [].forEach.call(sec.querySelectorAll('[data-testid="inline-content"], [data-testid="mesh-container-content"]'), function (c) {
      c.style.setProperty('height', '100%', 'important'); c.style.setProperty('min-height', '0', 'important'); });
    function Z() { return window.__jcdZoom || 1; }
    var ratio = 0;
    function size() {
      if (img.naturalWidth) ratio = img.naturalWidth / img.naturalHeight;
      else if (fm) ratio = +fm[1] / +fm[2];
      if (!ratio) return;
      var w = sec.offsetWidth, vh = window.innerHeight / Z();
      var h = Math.round(Math.min(w / ratio, vh));
      sec.style.setProperty('height', h + 'px', 'important');
      sec.style.setProperty('min-height', h + 'px', 'important');
      media.style.setProperty('position', 'absolute', 'important');
      media.style.setProperty('top', -h + 'px', 'important');
      media.style.setProperty('height', 2 * h + 'px', 'important');
      wi.style.setProperty('height', h + 'px', 'important');
    }
    window.addEventListener('resize', size);
    window.addEventListener('orientationchange', function () { setTimeout(size, 300); });
    if (img.complete) size(); img.addEventListener('load', size);
    setTimeout(size, 600); setTimeout(size, 2000);
  });

  ready(function () {
    /* Design Approach cards (home). Joel 2026-11-24: no glow and nothing to press on the cards, EXCEPT the first one
       (01 DISCOVERY, the one with the ">>" arrow): it is pressable — the whole card follows the arrow's link and gets a
       press-in + brand-blue outline while pressed. (Was: hover glow following the cursor on all four; tap toggled it.) */
    var ids = ['comp-mnfjmw0p', 'comp-mnfjoibv', 'comp-mnfjomf4', 'comp-mnfjomey'];
    var cards = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    cards.forEach(function (c) { c.classList.add('jcd-da-card'); });
    var first = cards[0];
    if (first) {
      var fr = first.getBoundingClientRect();
      var arrow = [].filter.call(document.querySelectorAll('a[aria-label=">>"]'), function (a) {
        var r = a.getBoundingClientRect(); return r.left >= fr.left - 2 && r.right <= fr.right + 2 && r.top >= fr.top - 2 && r.bottom <= fr.bottom + 2; })[0];
      if (arrow) {
        first.classList.add('jcd-da-link');
        first.setAttribute('role', 'link'); first.setAttribute('tabindex', '0');
        var go = function (e) { if (e.target.closest && e.target.closest('a')) return; arrow.click(); };
        first.addEventListener('click', go);
        first.addEventListener('keydown', function (e) { if (e.key === 'Enter') arrow.click(); });
        arrow.addEventListener('pointerdown', function () { first.classList.add('is-pressed'); });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { arrow.addEventListener(ev, function () { first.classList.remove('is-pressed'); }); });
      }
    }

    /* Cross-Category grid (home, desktop + mobile): each of the two images holds 3x3 product tiles plus a
       category caption strip. We lay 9 tile hotspots over each image, sized to each tile's real picture area
       (measured from the image pixels, 1px inset so no black gutter shows). On hover a tile's own crop lifts
       slightly; a dim blue glow sits underneath it and only shows in the dark gutter around that tile, never
       over neighbouring products.
       Joel 2026-11-24: every tile with a product page links to it (one tap on touch: the lift/glow shows while the
       finger is down, then the page opens); tiles without a product page get no lift, no glow, no link.
       LINKS: 9 per image, row by row (top-left -> bottom-right); '' = no product page. Relative URLs work for both
       site/index.html and site/m/index.html (the phone page links to the phone versions). */
    var W = 1192, H = 1259;
    var GRID = {   /* [x0,x1) and [y0,y1) of each tile column / row, in image pixels */
      'comp-mv7qmnmm': { c: [[0, 390], [402, 795], [805, 1192]], r: [[0, 385], [394, 786], [800, 1190]] },
      'comp-mv7qmnmr': { c: [[0, 391], [401, 794], [804, 1192]], r: [[0, 385], [394, 785], [800, 1190]] }
    };
    var LINKS = {
      'comp-mv7qmnmm': [   /* Consumer Tech / Smart Home / Lifestyle & Wearable */
        ['interstellar05/index.html', 'Gaming PC Interstellar 05'], ['zenfone-9/index.html', 'Zenfone 9 Concept'], ['sagittarius-laptop/index.html', 'Laptop Sagittarius'],
        ['wi-fi7-gaming-home-gateway/index.html', 'Wi-Fi 7 Gaming Home Gateway'], ['wi-fi7-hgu-ap/index.html', 'Wi-Fi 7 Dual-Band AP'], ['wi-fi7-2022/index.html', 'Wi-Fi 7 2022 concept'],
        ['https://www.behance.net/gallery/124322077/Smoky-Tree', 'Humidifier Smoky Tree'], ['https://www.behance.net/gallery/91290285/AIRMP', 'Plant X Dehumidifier AIRMP'], ['speeder-pro-earbuds/index.html', 'Earbuds Speeder Pro']
      ],
      'comp-mv7qmnmr': [   /* Professional Equipment / Enterprise Solutions / Complex Systems */
        ['lionic-lionfilter-200/index.html', 'Lionic LionFilter 200'], ['nlg-mma200/index.html', 'NLG MMA 200'], ['', 'Advantech AIM 20 accessories'],
        ['', 'Gemtek X-Cell'], ['t-interceptormp/index.html', 'T. Interceptor MP'], ['t-blade/index.html', 'T. Blade'],
        ['moai-router/index.html', 'MoAI Router'], ['', 'Nichicon remote controller'], ['airgain-fwa-easy-installation-kit/index.html', 'Airgain FWA Easy Installation Kit']
      ]
    };
    var tiles = [];
    Object.keys(GRID).forEach(function (id) {
      var comp = document.getElementById(id), img = comp && comp.querySelector('img');
      if (!img) return;
      comp.classList.add('jcd-tilegrid');
      var setGutter = function () { comp.style.setProperty('--jcd-g', (9 * comp.clientWidth / W).toFixed(2) + 'px'); };
      setGutter(); window.addEventListener('resize', setGutter);
      var layer = document.createElement('div'); layer.className = 'jcd-tiles';
      var n = 0;
      GRID[id].r.forEach(function (r) { GRID[id].c.forEach(function (c) {
        var link = (LINKS[id] || [])[n++] || ['', ''];
        if (!link[0]) return;                                                /* no product page: no hotspot, no effect */
        var x0 = c[0] + 1, x1 = c[1] - 1, y0 = r[0] + 1, y1 = r[1] - 1;            /* 1px inset */
        var x = x0 / W, y = y0 / H, w = (x1 - x0) / W, h = (y1 - y0) / H;
        var t = document.createElement('a'); t.className = 'jcd-tile';
        t.href = link[0]; t.setAttribute('aria-label', link[1]);
        if (/^https?:/.test(link[0])) { t.target = '_blank'; t.rel = 'noopener'; }
        t.style.cssText = 'left:' + x * 100 + '%;top:' + y * 100 + '%;width:' + w * 100 + '%;height:' + h * 100 + '%';
        var halo = document.createElement('div'); halo.className = 'jcd-tile-halo';
        var crop = document.createElement('div'); crop.className = 'jcd-tile-img';
        crop.style.cssText = 'background-image:url("' + (img.currentSrc || img.src) + '");background-size:' + (100 / w) + '% ' + (100 / h) + '%;' +
          'background-position:' + (x / (1 - w) * 100) + '% ' + (y / (1 - h) * 100) + '%';
        t.appendChild(halo); t.appendChild(crop); layer.appendChild(t); tiles.push(t);
      }); });
      comp.appendChild(layer);
    });
    var touch = window.matchMedia && matchMedia('(hover: none)').matches;
    if (touch) tiles.forEach(function (t) {   /* finger down = lift + glow; moving the finger (scroll) cancels; tap opens the link */
      t.addEventListener('touchstart', function () { tiles.forEach(function (o) { o.classList.toggle('is-glow', o === t); }); }, { passive: true });
      ['touchmove', 'touchcancel'].forEach(function (ev) { t.addEventListener(ev, function () { t.classList.remove('is-glow'); }, { passive: true }); });
    });
    window.addEventListener('pageshow', function () { tiles.forEach(function (o) { o.classList.remove('is-glow'); }); });   /* back button */

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
  /* Top image height (Joel 2026-11-24).
     Phone (m/): the first image (home slideshow, product-page hero) was only ~1/3 (home) or ~1/4 (products) of the
       screen -> half the screen height (50svh). The HTML points these images at their largest file so they stay sharp.
     iPad in landscape (desktop page): the top image fills the whole screen (100svh minus where it starts); back to the
       Wix height in portrait. Re-checked when the iPad turns.
     Computer (desktop page, any monitor: laptop 1536, 1920x1080, 2560x1440, 3440x1440 ultra-wide, 3840x2160): the top
       image is exactly one screen high. The wide-screen zoom (site.js) already makes every width full; on a 21:9
       ultra-wide it made the top image 137% of the screen, on 16:9 ~100%. Under that CSS zoom 100svh is multiplied by
       the zoom too, so it is divided by window.__jcdZoom.
     How: if the page starts with a full-width image, every element of that block with the image's height gets the
     new height; the page below moves down with it. Catalog pages / About (no full-width image at the top) untouched. */
  (function () {
    var hero = null;   /* { els: [...], top: px } measured once at the Wix height */
    function find() {
      var sec = document.querySelector('#PAGES_CONTAINER section');
      if (!sec) return null;
      var img = [].filter.call(sec.querySelectorAll('img'), function (i) { return !/^data:/.test(i.getAttribute('src') || ''); })[0];
      if (!img) return null;
      var r = img.getBoundingClientRect(), vw = document.documentElement.clientWidth;
      if (r.width < vw - 4 || r.height < 60 || r.top + window.scrollY > 120) return null;
      var h0 = r.height, els = [];
      [].forEach.call(sec.querySelectorAll('*'), function (e) { if (Math.abs(e.getBoundingClientRect().height - h0) <= 2) els.push(e); });
      return { els: els, top: Math.max(0, Math.round(r.top + window.scrollY)), h0: h0 };
    }
    function apply() {
      var phone = document.body.classList.contains('device-mobile-optimized');
      var padLand = !phone && window.__jcdTablet && window.innerWidth > window.innerHeight;
      var pc = !phone && !window.__jcdTablet, Z = window.__jcdZoom || 1;
      if (hero === null) {
        hero = find(); if (!hero) { hero = false; return; }
        if (phone && hero.h0 > 320) { hero = false; return; }      /* phone heroes are short (Wix 136-231px) */
      }
      if (!hero) return;
      /* Joel 2026-11-24: any PORTRAIT screen on the desktop page (iPad upright — also when an iPad with a trackpad is
         detected as a computer — or a portrait monitor) = half the screen, never full screen; landscape = one screen. */
      var portrait = !phone && window.innerHeight > window.innerWidth;
      var h = phone ? '50svh'
        : portrait ? 'calc(50svh / ' + Z + ')'
        : padLand ? (hero.top ? 'calc(100svh - ' + hero.top + 'px)' : '100svh')
        : pc ? 'calc(100svh / ' + Z + ' - ' + (hero.top / Z).toFixed(1) + 'px)'
        : '';
      hero.els.forEach(function (e) { if (h) e.style.setProperty('height', h, 'important'); else e.style.removeProperty('height'); });
      var sec = document.querySelector('#PAGES_CONTAINER section'); if (sec) sec.classList.toggle('jcd-mhero', !!h);
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', apply) : apply();
    window.addEventListener('resize', function () { if (!document.body.classList.contains('device-mobile-optimized')) apply(); });   /* iPad turns, desktop window / zoom changes */
    window.addEventListener('orientationchange', function () { setTimeout(apply, 300); });
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
      /* Hidden light section colours (Joel 2026-11-24: a thin white line under "EXPERTISE" on the phone): a section whose
         own colour is light but is fully covered by a dark layer shows that light colour only through sub-pixel seams
         at its edges. Give it the covering layer's colour. (About work/awards section #comp-mujj9yx016 was rgb(246,246,246).) */
      function lum(c) { var m = (c || '').match(/[\d.]+/g); if (!m || (m.length > 3 && +m[3] < 0.99)) return -1; return (+m[0] + +m[1] + +m[2]) / 3; }
      [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER section'), function (s) {
        if (s.parentElement && s.parentElement.closest('section')) return;
        var u = s.querySelector(':scope > [data-hook="bgLayers"] [data-testid="colorUnderlay"]'); if (!u) return;
        if (lum(getComputedStyle(u).backgroundColor) < 200) return;
        var sr = s.getBoundingClientRect();
        var cover = [].filter.call(s.querySelectorAll('[data-testid="colorUnderlay"]'), function (e) {
          if (e === u) return false; var r = e.getBoundingClientRect(), l = lum(getComputedStyle(e).backgroundColor);
          return l >= 0 && l < 60 && r.width >= sr.width * 0.97 && r.height >= sr.height * 0.9; })[0];
        if (cover) u.style.setProperty('background-color', getComputedStyle(cover).backgroundColor, 'important');
      });
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', classify) : classify();
  })();

  /* About, desktop layout (computer + iPad): the intro (text + portrait) sat ~140px below the middle of the screen
     because Wix left a tall empty band above it. Move the whole first section's content up so the text + photo block
     is centred on the screen, but never closer than 56px to the header; the section gets shorter by the same amount
     so the rest of the page follows. Re-done on resize (window / zoom / iPad turning). (Joel 2026-11-24) */
  (function () {
    var applied = 0;
    function centreIntro() {
      if (document.body.classList.contains('device-mobile-optimized')) return;
      var sec = document.querySelector('#PAGES_CONTAINER section');
      if (!sec || !document.getElementById('comp-mujmtw8h') || !sec.contains(document.getElementById('comp-mujmtw8h'))) return;
      var inner = sec.querySelector('[data-mesh-id$="inlineContent"]'); if (!inner) return;
      var Z = window.__jcdZoom || 1;
      inner.style.transform = ''; sec.style.marginBottom = ''; applied = 0;
      var els = [].filter.call(sec.querySelectorAll('[data-testid="richTextElement"], .wixui-image'), function (e) {
        var r = e.getBoundingClientRect(); return r.height > 5 && r.width > 5 && r.width < window.innerWidth * 0.9; });
      if (!els.length) return;
      var sy = window.scrollY, rs = els.map(function (e) { return e.getBoundingClientRect(); });
      var top = Math.min.apply(null, rs.map(function (r) { return r.top + sy; })), bot = Math.max.apply(null, rs.map(function (r) { return r.bottom + sy; }));
      var hdr = document.getElementById('SITE_HEADER'), hb = hdr ? hdr.getBoundingClientRect().bottom + sy : 0;
      /* Joel 2026-11-26: centred in the space BELOW the menu (header bottom -> screen bottom), not on the whole
         screen: the menu takes the top band, so whole-screen centring left the block high with an empty band below */
      /* ...but on tall screens (iPad upright) not more than ~260px below the menu, or a huge empty band opens above
         (Joel 2026-11-26) */
      var vh = window.innerHeight, want = Math.max(hb + 56 * Z, hb + Math.min((vh - hb - (bot - top)) / 2, 260 * Z));
      var d = (top - want) / Z;                      /* CSS px to move up (negative: down) */
      if (Math.abs(d) < 2) return;
      applied = d;
      inner.style.transform = 'translateY(' + (-d).toFixed(1) + 'px)';
      sec.style.marginBottom = (-d).toFixed(1) + 'px';
    }
    var t; function later() { clearTimeout(t); t = setTimeout(centreIntro, 120); }
    var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(centreIntro, 20); }); };
    document.readyState === 'complete' ? go() : window.addEventListener('load', go);
    window.addEventListener('resize', function () { if (!window.__jcdIntroBusy) later(); });
  })();

  /* Category pages, desktop layout (computer + iPad): the white card frames AND the photo tiles below them were drawn
     ~15px left of centre in Wix (titles are centred), so the left gap was smaller than the right. Every top-level item
     of a section that holds frames (big framed cards, the unframed tile rows below them, their captions) moves by the
     same amount, so frames and tiles line up with each other and sit centred: equal space left and right.
     Items that are already centred (page titles) or full width are left alone. (Joel 2026-11-24; second pass: the
     first version only moved items inside a frame, so the unframed tiles no longer lined up with the frames.) */
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
      var secs = [];
      frames.forEach(function (v) { var s = v.closest('section'); while (s && s.parentElement && s.parentElement.closest('section')) s = s.parentElement.closest('section'); if (s && secs.indexOf(s) < 0) secs.push(s); });
      secs.forEach(function (sec) {
        var grid = sec.querySelector('[data-mesh-id$="inlineContent-gridContainer"]'); if (!grid) return;
        [].forEach.call(grid.children, function (e) {
          if (!e.id || e.tagName === 'SECTION') return;
          var r = e.getBoundingClientRect(); if (!r.width || r.width >= vw * 0.95) return;
          if (Math.abs((r.left + r.right) / 2 - vw / 2) < 4) return;            /* already centred (titles) */
          var cs = getComputedStyle(e); if (cs.position !== 'relative') return;
          e.style.left = ((parseFloat(cs.left) || 0) + d).toFixed(2) + 'px';
        });
      });
      window.dispatchEvent(new Event('resize'));   /* tilt.js / glow re-measure */
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', centreCards) : centreCards();
  })();
  /* iPhone: no zoom-in when a Contact field is tapped (Joel 2026-11-26 wants 11px field text on the phone). iOS
     zooms the page when a field's text is smaller than 16px on screen; capping the viewport's maximum-scale at the
     page's own fit-to-width scale stops that. iOS still lets people pinch-zoom by hand. Phone pages with a form only. */
  ready(function () {
    if (!/iPhone|iPod/.test(navigator.userAgent)) return;
    if (!document.querySelector('#PAGES_CONTAINER input, #PAGES_CONTAINER textarea')) return;
    var vp = document.querySelector('meta[name="viewport"]'); if (!vp) return;
    var m = /width=(\d+)/.exec(vp.getAttribute('content') || ''); if (!m) return;   /* phone page: width=320 */
    var W = +m[1];
    function cap() {
      var land = Math.abs(window.orientation || 0) === 90;
      var ideal = land ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
      vp.setAttribute('content', 'width=' + W + ', maximum-scale=' + (ideal / W + 0.001).toFixed(4));
    }
    cap(); window.addEventListener('orientationchange', function () { setTimeout(cap, 200); });
  });

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
          var s = slots.filter(function (x) { return Math.abs(x.top - c.top) < 6; })[0];
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
        if (shift < 0) sec.style.setProperty('margin-bottom', shift.toFixed(1) + 'px');
      });
    }
    if (document.readyState === 'complete') tighten(); else window.addEventListener('load', tighten);
  })();
  /* About "Trusted Collaboration": frosted-glass recommendation cards, style A1 (Joel 2026-11-24; design study in
     preview/testimonials-ui.html). The Wix quote / name / role pieces of section #comp-mujk8qkl stay in the HTML (for
     search engines) but are hidden; the heading stays. Desktop + iPad: featured card + 2 columns; phone: 1 column.
     LINKEDIN: each person's profile URL is `li` below; a card with a URL is a link (opens in a new tab). */
  (function () {
    var REC = [
      { n: 'Marcus Kung', r: 'Design Director, Tron Future', x: 'Former ID/PM, OPPO \u00b7 Royal College of Art',
        li: 'https://www.linkedin.com/in/marcus-kung-b15baa6a/',
        t: "Joel isn\u2019t just an executor. He\u2019s a designer with a clear point of view. He translates design intent into language engineering teams can act on immediately, and drives it through to mass production without losing the original vision. The kind of designer who brings a whole team together." },
      { n: 'Stanley Chai', r: 'Engineering Director, STR8 Industries', x: 'Former R&D Asst. Manager, Tron Future \u00b7 PhD, NYCU',
        li: 'https://www.linkedin.com/in/cychai1995/',
        t: "Joel moves seamlessly from requirements gathering to design execution: iterating quickly, adapting to feedback, and partnering closely with engineering to land on solutions that are both elegant and manufacturable. I\u2019d recommend him without hesitation." },
      { n: 'Rick Chen', r: 'CPO, Gemtek', x: 'Former Sr. R&D Director, Foxconn \u00b7 Former Sr. R&D Director, ASKEY',
        li: 'https://www.linkedin.com/in/rick-chen-1ba742/',
        t: "Having worked with Joel at Gemtek, I\u2019ve been consistently impressed by his fresh talent and innovative approach. He brings a mature skill set and collaborative spirit that makes him a fantastic team member." },
      { n: 'Kuo Kai Liao', r: 'Principal Designer, Tron Future', x: 'Former ID, Ubiquiti \u00b7 Sr. ID, ASUS',
        li: 'https://www.linkedin.com/in/kailiao929/',
        t: "Joel is a designer of great potential, whose technical competence is highly regarded by everyone on the team. He demonstrates a strong sense of ownership over his tasks, consistently ensuring top-tier deliverables." },
      { n: 'Ike Tsao', r: 'AVP, 5G Product Line, Gemtek', x: 'Former AVP 5G, Pegatron \u00b7 Former Sr. Director, Askey',
        li: 'https://www.linkedin.com/in/ike-tsao-78143814/',
        t: "Joel\u2019s ability to balance aesthetic appeal with practical functionality is truly exceptional. He always ensured the proposed solutions aligned not only with the visual identity of the product but also with technical requirements and production constraints." }
    ];
    var LI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11.2 22 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21h-4z"/></svg>';
    function esc(x) { return x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
    function build() {
      var sec = document.getElementById('comp-mujk8qkl');
      if (!sec || sec.querySelector('.jcd-rec')) return;
      var grid = sec.querySelector('[data-mesh-id="comp-mujk8qklinlineContent-gridContainer"]');
      if (!grid) return;
      sec.classList.add('jcd-rec-on');
      var html = REC.map(function (p, i) {
        var tag = p.li ? 'a' : 'div';
        var attrs = p.li ? ' href="' + esc(p.li) + '" target="_blank" rel="noopener" aria-label="' + esc(p.n) + ' on LinkedIn"' : '';
        var ini = p.n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
        return '<' + tag + ' class="jcd-rec-card' + (i ? '' : ' feat') + (p.li ? ' has-link' : '') + '"' + attrs + '>' +
          '<span class="jcd-rec-q">\u201C</span><p class="jcd-rec-txt">' + esc(p.t) + '</p>' +
          '<div class="jcd-rec-who"><div class="jcd-rec-ava">' + ini + '</div><div><div class="jcd-rec-nm">' + esc(p.n) + '</div>' +
          '<div class="jcd-rec-rl">' + esc(p.r) + ' \u00b7 <i>' + esc(p.x) + '</i></div></div>' +
          (p.li ? '<span class="jcd-rec-li" title="LinkedIn">' + LI + '</span>' : '') + '</div></' + tag + '>';
      }).join('');
      var box = document.createElement('div'); box.className = 'jcd-rec'; box.innerHTML = '<div class="jcd-rec-grid">' + html + '</div>';
      grid.parentNode.insertBefore(box, grid.nextSibling);
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', build) : build();
  })();
  /* About page: one spacing rule for every section heading (Joel 2026-11-24: "SELECTED AWARDS, EXPERTISE and TRUSTED
     COLLABORATION are not spaced the same"). Wix had fixed pixel row heights, so the gaps were 76-116px (desktop) and
     6-76px (phone). CSS makes the rows of these sections size to their content (.jcd-about-flow), then each heading
     gets, from the content above it (same column) and to the content below it:
       desktop / iPad: main headings 98px above, 41px below;  side headings (LANGUAGES) 60px above
       phone:          main headings 48px above, 12px below;  side headings (EDUCATION, LANGUAGES, PATENTS) 28px above
     Headings that sit side by side (WORK EXPERIENCE | EDUCATION, SELECTED AWARDS | PATENTS) move together. */
  (function () {
    var MAIN = /^(WORK EXPERIENCE|SELECTED AWARDS|EXPERTISE|TRUSTED COLLABORATION)$/, SIDE = /^(EDUCATION|LANGUAGES|PATENTS)$/;
    var SECS = ['comp-mujj9yx18', 'comp-mujj9yxj', 'comp-mujk8qkl'];
    function run() {
      var secs = SECS.map(function (id) { return document.getElementById(id); }).filter(Boolean);
      if (secs.length < 3) return;
      var phone = document.body.classList.contains('device-mobile-optimized'), Z = window.__jcdZoom || 1;
      var G = phone ? { main: 48, side: 28, below: 12 } : { main: 98, side: 60, below: 41 };
      document.documentElement.classList.add('jcd-about-flow');
      var root = document.getElementById('PAGES_CONTAINER');
      function box(e) { var r = e.getBoundingClientRect(); return { t: r.top / Z, b: r.bottom / Z, l: r.left / Z, r: r.right / Z, h: r.height }; }
      var texts = [].slice.call(root.querySelectorAll('[data-testid="richTextElement"]'));
      var heads = texts.filter(function (t) { var x = t.textContent.trim(); return MAIN.test(x) || SIDE.test(x); })
        .filter(function (t) { return secs.some(function (s) { return s.contains(t); }); });
      function content() {
        return [].slice.call(root.querySelectorAll('[data-testid="richTextElement"], .wixui-image, .wixui-vector-image, .jcd-rec'))
          .filter(function (e) { return heads.indexOf(e) < 0 && !e.closest('.jcd-rec, [style*="display: none"]') || e.classList.contains('jcd-rec'); })
          .filter(function (e) { var b = e.getBoundingClientRect(); return b.height > 2 && getComputedStyle(e).display !== 'none'; });
      }
      function col(h) {   /* the heading's column = its item in the section's outermost grid */
        var sec = h.closest('section'), top = sec.querySelector('[data-mesh-id$="inlineContent-gridContainer"]'), e = h;
        while (e.parentElement && e.parentElement !== top) e = e.parentElement;
        return e.parentElement === top ? e : h;
      }
      function gapAbove(h) {
        var hb = box(h), cb = box(col(h)), best = -1e9;
        content().forEach(function (e) { var b = box(e); if (b.b <= hb.t + 1 && b.r > cb.l + 2 && b.l < cb.r - 2 && b.b > best) best = b.b; });
        return best < -1e8 ? null : hb.t - best;
      }
      function gapBelow(h) {
        var hb = box(h), cb = box(col(h)), best = 1e9;
        content().forEach(function (e) { var b = box(e); if (b.t >= hb.b - 1 && b.r > cb.l + 2 && b.l < cb.r - 2 && b.t < best) best = b.t; });
        return best > 1e8 ? null : best - hb.b;
      }
      function px(e, prop) { return parseFloat(getComputedStyle(e)[prop]) || 0; }
      var done = [];
      heads.sort(function (a, b) { return box(a).t - box(b).t; });
      heads.forEach(function (h) {
        if (done.indexOf(h) >= 0) return;
        var main = MAIN.test(h.textContent.trim());
        var mates = heads.filter(function (o) { return o !== h && done.indexOf(o) < 0 && Math.abs(box(o).t - box(h).t) < 3; });
        var ga = gapAbove(h);
        if (ga !== null) {
          var d = (main ? G.main : G.side) - ga;
          [h].concat(mates).forEach(function (e) { e.style.setProperty('margin-top', (px(e, 'marginTop') + d) + 'px', 'important'); });
        }
        [h].concat(mates).forEach(function (e) {
          var gb = gapBelow(e); if (gb === null) return;
          e.style.setProperty('margin-bottom', (px(e, 'marginBottom') + G.below - gb) + 'px', 'important');
        });
        done.push.apply(done, [h].concat(mates));
      });
      /* One left edge for every heading and its content (Joel: spacing must match): the WORK EXPERIENCE content edge
         (desktop 156px at 1536 / phone 20px). Desktop: a section whose text starts a few px off (EXPERTISE -11,
         TRUSTED COLLABORATION heading -4) moves all its grid items; the recommendation cards line up too.
         Phone: any heading or text a few px off that edge (17px) moves onto it. */
      function textLeft(e) { var rg = document.createRange(); rg.selectNodeContents(e); return rg.getBoundingClientRect().left / Z; }
      var we = heads.filter(function (h) { return /^WORK EXPERIENCE$/.test(h.textContent.trim()); })[0];
      var weCol = we && col(we);
      var ref = null;
      if (weCol) {
        var firstTxt = [].filter.call(weCol.querySelectorAll('[data-testid="richTextElement"]'), function (e) { return e !== we; })[0];
        ref = textLeft(firstTxt || we);
      }
      function shift(e, d) { e.style.setProperty('left', ((parseFloat(getComputedStyle(e).left) || 0) + d).toFixed(2) + 'px', 'important'); }
      if (ref !== null) {
        if (!phone) {
          secs.forEach(function (sec) {
            var top = sec.querySelector('[data-mesh-id$="inlineContent-gridContainer"]');
            var ts = [].filter.call(sec.querySelectorAll('[data-testid="richTextElement"]'), function (t) { return t.getBoundingClientRect().height > 2; });
            if (!ts.length) return;
            var minL = Math.min.apply(null, ts.map(textLeft)), d = ref - minL;
            if (Math.abs(d) < 0.5 || Math.abs(d) > 20) return;
            if (sec.querySelector('.jcd-rec')) { ts.forEach(function (t) { if (Math.abs(textLeft(t) - minL) < 1) shift(t, d); }); }
            else [].forEach.call(top.children, function (it) { if (it.id) shift(it, d); });
          });
          var rec = document.querySelector('.jcd-rec');
          if (rec) { var dl = ref - rec.getBoundingClientRect().left / Z; if (Math.abs(dl) > 0.5 && Math.abs(dl) < 30) rec.style.setProperty('transform', 'translateX(' + dl.toFixed(2) + 'px)'); }
        } else {
          secs.forEach(function (sec) {
            [].forEach.call(sec.querySelectorAll('[data-testid="richTextElement"]'), function (t) {
              if (t.getBoundingClientRect().height <= 2 || t.closest('.jcd-rec')) return;
              var d = ref - textLeft(t); if (d > 0.5 && d < 6) shift(t, d);
            });
          });
        }
      }
      window.dispatchEvent(new Event('resize'));
    }
    var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(run, 30); }); };
    document.readyState === 'complete' ? go() : window.addEventListener('load', go);
  })();
  /* Header links/images are not draggable (no drag ghost when pressing the logo) — Joel 2026-11-24 */
  (function () {
    function nodrag() { [].forEach.call(document.querySelectorAll('#SITE_HEADER a, #SITE_HEADER img'), function (e) { e.setAttribute('draggable', 'false'); }); }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', nodrag) : nodrag();
  })();
  /* About "What I Believe": the title + text block sits on the vertical centre of its photo section, every platform
     (Joel 2026-11-24: on the phone it sat too low; was 27px low on the phone, 35px high on desktop/iPad). Moves the two
     text items with `top` (position: relative), so the section and photo keep their size. Re-done on resize. */
  (function () {
    function centreBelief() {
      var t = document.getElementById('comp-mujq4udg1'), b = document.getElementById('comp-mujq4ude6');
      if (!t || !b) return;
      var sec = t.closest('section'); while (sec && sec.parentElement && sec.parentElement.closest('section')) sec = sec.parentElement.closest('section');
      if (!sec) return;
      var Z = window.__jcdZoom || 1;
      t.style.removeProperty('top'); b.style.removeProperty('top');
      var rg = document.createRange(); rg.selectNodeContents(b);
      var top = t.getBoundingClientRect().top, bot = rg.getBoundingClientRect().bottom, sr = sec.getBoundingClientRect();
      var d = ((sr.top + sr.bottom) / 2 - (top + bot) / 2) / Z;
      if (Math.abs(d) < 1) return;
      [t, b].forEach(function (e) { e.style.setProperty('top', d.toFixed(1) + 'px', 'important'); });
    }
    var tm; function later() { clearTimeout(tm); tm = setTimeout(centreBelief, 150); }
    var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(centreBelief, 80); }); };
    document.readyState === 'complete' ? go() : window.addEventListener('load', go);
    window.addEventListener('resize', later);
  })();
  /* No context menu (right click / long press "save image"), no text selection, no image dragging — every platform
     (Joel 2026-11-25). Form fields keep their normal menu (paste) and selection. */
  (function () {
    function inField(t) { return t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]'); }
    document.addEventListener('contextmenu', function (e) { if (!inField(e.target)) e.preventDefault(); });
    document.addEventListener('selectstart', function (e) { if (!inField(e.target)) e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { if (!inField(e.target)) e.preventDefault(); });
  })();
  /* Home "Achievement" world map (Joel 2026-11-26; design study preview/achievement-glow.html).
     All platforms: each map dot breathes and sends out a soft ring; a light that fades at head and tail runs along
     its line into the flag (one cycle 4.8s, the five countries in turn); when it arrives, the flag's round outline
     glows and a ring spreads out. Computer with a mouse only: hovering a country's line, dot, flag or one of its
     products enlarges that country's products + captions (cut from the same image into tiles), lights its line, keeps
     its dot and flag outline lit without motion and fades the other countries' effects. The overlay uses
     preserveAspectRatio "slice", i.e. the same cover-fit as the image, so it stays on the drawing at any crop.
     Coordinates are on the 1908x858 drawing (home-19-*-v2: Italy's dot moved up from north Africa). */
  ready(function () {
    var img = document.querySelector('#PAGES_CONTAINER img[src*="home-19-"][src*="-v2"]'); if (!img) return;
    var box = img.parentElement; box.classList.add('jcd-map');
    var IW = 1908, IH = 858, Y = 514, FLAG_Y = 570, R_FLAG = 19, DUR = 4.8, ARRIVE = 0.6;
    var LINKS = [
      { dot: [186, 331], flag: 366 },    /* USA    */
      { dot: [402, 271], flag: 834 },    /* Canada */
      { dot: [936, 300], flag: 1024 },   /* Italy  */
      { dot: [1632, 462], flag: 1446 },  /* Taiwan */
      { dot: [1756, 382], flag: 1794 }   /* Japan  */
    ];
    var NS = 'http://www.w3.org/2000/svg';
    function mk(parent, tag, attrs, style) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (style) e.setAttribute('style', style);
      parent.appendChild(e); return e;
    }
    var svg = mk(box, 'svg', { viewBox: '0 0 ' + IW + ' ' + IH, preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true', class: 'jcd-map-fx' });
    var defs = mk(svg, 'defs', {});
    defs.innerHTML =
      '<filter id="jcdMapGlow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="jcdMapBlur" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6"/></filter>' +
      '<radialGradient id="jcdMapSoft"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<mask id="jcdMapNoFlag" maskUnits="userSpaceOnUse" x="0" y="0" width="' + IW + '" height="' + IH + '"><rect width="' + IW + '" height="' + IH + '" fill="#fff"/>' +
      LINKS.map(function (l) { return '<circle cx="' + l.flag + '" cy="' + FLAG_Y + '" r="' + (R_FLAG + 2) + '" fill="#000"/>'; }).join('') + '</mask>';
    var groups = [];
    LINKS.forEach(function (l, i) {
      var x = l.dot[0], y = l.dot[1], fx = l.flag, begin = (i * 0.55).toFixed(2) + 's';
      var d = 'M' + x + ' ' + y + ' V' + Y + ' H' + fx + ' V' + (FLAG_Y - R_FLAG - 2);   /* stops at the flag's edge */
      var g = mk(svg, 'g', { class: 'jcd-map-c' }); groups.push(g);
      mk(g, 'circle', { cx: x, cy: y, r: 13, class: 'jcd-map-ring' }, 'animation-delay:' + begin);
      mk(g, 'circle', { cx: x, cy: y, r: 13, class: 'jcd-map-ring' }, 'animation-delay:calc(' + begin + ' + 1.6s)');
      mk(g, 'circle', { cx: x, cy: y, r: 11, class: 'jcd-map-core' }, 'animation-delay:' + begin);
      var mask = mk(g, 'mask', { id: 'jcdMapM' + i, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: IW, height: IH });
      var spot = mk(mask, 'circle', { r: 46, fill: 'url(#jcdMapSoft)', opacity: 0 });
      mk(spot, 'animateMotion', { path: d, dur: DUR + 's', begin: begin, repeatCount: 'indefinite', keyPoints: '0;1;1', keyTimes: '0;' + ARRIVE + ';1', calcMode: 'linear' });
      mk(spot, 'animate', { attributeName: 'opacity', dur: DUR + 's', begin: begin, repeatCount: 'indefinite', values: '0;1;1;0;0', keyTimes: '0;0.06;' + (ARRIVE - 0.04) + ';' + (ARRIVE + 0.03) + ';1' });
      var lit = mk(mk(g, 'g', { mask: 'url(#jcdMapNoFlag)', class: 'jcd-map-anim' }), 'g', { mask: 'url(#jcdMapM' + i + ')' });
      mk(lit, 'path', { d: d, class: 'jcd-map-soft' });
      mk(lit, 'path', { d: d, class: 'jcd-map-lit' });
      var a1 = ARRIVE - 0.02, a2 = ARRIVE + 0.06, a3 = ARRIVE + 0.3;
      var glow = mk(g, 'circle', { cx: fx, cy: FLAG_Y, r: R_FLAG + 1, class: 'jcd-map-fglow jcd-map-anim' });
      mk(glow, 'animate', { attributeName: 'opacity', dur: DUR + 's', begin: begin, repeatCount: 'indefinite', values: '0;0;1;.8;0;0', keyTimes: '0;' + a1 + ';' + a2 + ';' + (a2 + .1) + ';' + a3 + ';1' });
      mk(g, 'circle', { cx: fx, cy: FLAG_Y, r: R_FLAG + 1, class: 'jcd-map-fsteady' });
      var ring = mk(g, 'circle', { cx: fx, cy: FLAG_Y, r: R_FLAG + 1, class: 'jcd-map-fring jcd-map-anim' });
      mk(ring, 'animate', { attributeName: 'r', dur: DUR + 's', begin: begin, repeatCount: 'indefinite', values: (R_FLAG + 1) + ';' + (R_FLAG + 1) + ';' + (R_FLAG * 2.3) + ';' + (R_FLAG * 2.3), keyTimes: '0;' + a1 + ';' + (ARRIVE + 0.32) + ';1' });
      mk(ring, 'animate', { attributeName: 'opacity', dur: DUR + 's', begin: begin, repeatCount: 'indefinite', values: '0;0;.6;0;0', keyTimes: '0;' + a1 + ';' + (ARRIVE + 0.03) + ';' + (ARRIVE + 0.32) + ';1' });
    });
    /* run only while the map is on screen */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting;
        try { on ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) {}
        box.classList.toggle('jcd-map-paused', !on);
      }).observe(box);
    }

    /* computer with a mouse only (not the phone page, not iPads) */
    var mobilePage = document.body.classList.contains('device-mobile-optimized');
    if (mobilePage || window.__jcdTablet || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var ROW = [598, 842];
    var COLS = [[33,181],[220,363],[405,540],[580,726],[789,891],[990,1068],[1192,1318],[1338,1481],[1512,1667],[1718,1887]];
    var OF = [[0,1,2,3],[4],[5],[6,7,8],[9]];   /* USA: AT&T Gfiber Rigado Ciena | Canada: Cogeco | Italy: Adant | Taiwan: Gemtek Lionic NCSIST | Japan: Genix */
    box.classList.add('jcd-map-tiles');          /* CSS hides the product row of the image; the tiles show it */
    var tiles = COLS.map(function (c) {
      var x0 = c[0] - 12, x1 = c[1] + 12, w = x1 - x0, h = ROW[1] - ROW[0];
      var t = document.createElement('div'); t.className = 'jcd-map-tile';
      t.style.cssText = 'left:' + (x0 / IW * 100) + '%;top:' + (ROW[0] / IH * 100) + '%;width:' + (w / IW * 100) + '%;height:' + (h / IH * 100) + '%';
      var im = document.createElement('img'); im.src = img.getAttribute('src'); im.alt = ''; im.draggable = false;
      im.style.cssText = 'width:' + (IW / w * 100) + '%;left:' + (-x0 / w * 100) + '%;top:' + (-ROW[0] / h * 100) + '%';
      t.appendChild(im); box.insertBefore(t, svg); return t;
    });
    LINKS.forEach(function (l, i) {
      var x = l.dot[0], y = l.dot[1], fx = l.flag;
      var d = 'M' + x + ' ' + y + ' V' + Y + ' H' + fx + ' V' + (FLAG_Y - R_FLAG - 2);
      var line = mk(svg, 'path', { d: d, class: 'jcd-map-hline', mask: 'url(#jcdMapNoFlag)' });
      var parts = [mk(svg, 'path', { d: d, class: 'jcd-map-hit' }), mk(svg, 'circle', { cx: x, cy: y, r: 26, class: 'jcd-map-hitdot' }),
                   mk(svg, 'circle', { cx: fx, cy: FLAG_Y, r: 28, class: 'jcd-map-hitdot' })];
      OF[i].forEach(function (k) { parts.push(tiles[k]); });
      function set(on) {
        OF[i].forEach(function (k) { tiles[k].classList.toggle('on', on); });
        line.classList.toggle('on', on);
        groups.forEach(function (g, k) { g.classList.toggle('dim', on && k !== i); g.classList.toggle('sel', on && k === i); });
      }
      parts.forEach(function (p) {
        p.addEventListener('mouseenter', function () { set(true); });
        p.addEventListener('mouseleave', function () { set(false); });
      });
    });
  });

  /* Category cards on touch screens (phone pages + iPads; Joel 2026-11-26, design study preview/category-links.html
     option 3a): there is no hover, so every card shows its product name at the bottom-left (soft wide shadow + a
     faint dark gradient) and a card that opens a product page has a round frosted ">>" on the right, on the same
     centre line; it turns --jcd-blue while pressed. Wix's centred captions and ">>" on the photo are hidden.
     Runs after the phone category spacing (same load event, registered later).
     Computers (Joel 2026-11-26, same day): Wix's text ">>" is replaced by the same round ">>", shown only while the
     mouse is on a linked card; names stay Wix's hover captions. */
  window.addEventListener('load', function () {
    var phone = document.body.classList.contains('device-mobile-optimized');
    var touch = phone || !!window.__jcdTablet;
    /* a card's photo is usually inside its hover box; on some phone cards (Airgain) Wix put it next to the box */
    var photos = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER .ih2JY1'));
    function photoOf(hb) {
      var p = hb.querySelector('.ih2JY1'); if (p) return p;
      var r = hb.getBoundingClientRect();
      return photos.filter(function (ph) { var q = ph.getBoundingClientRect();
        return Math.abs(q.left - r.left) < 4 && Math.abs(q.top - r.top) < 4 && Math.abs(q.width - r.width) < 6 && Math.abs(q.height - r.height) < 6; })[0];
    }
    var boxes = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER .gpDCD5'), function (hb) { return photoOf(hb); });
    if (!boxes.length) return;
    if (touch) document.documentElement.classList.add('jcd-cards-touch');
    function lines(el) {
      var t = document.createElement('textarea');
      t.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|h\d|div|li)>/gi, '\n').replace(/<[^>]+>/g, '');
      return t.value.split('\n').map(function (s) { return s.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
    }
    boxes.forEach(function (hb) {
      var photo = photoOf(hb), host = photo.querySelector('[data-testid="linkElement"]') || photo;
      /* big cards: Wix's link box inside the photo can be 0px tall; then hang the overlay on the photo itself */
      if (host !== photo && host.getBoundingClientRect().height < photo.getBoundingClientRect().height * 0.9) {
        host = photo; if (getComputedStyle(photo).position === 'static') photo.style.position = 'relative'; }
      photo.classList.add('jcd-card-photo');
      var pr = photo.getBoundingClientRect(), linked = !!hb.querySelector('a[href]'), name = null;
      var scope = hb.parentElement || hb;
      [].forEach.call(scope.querySelectorAll('[data-testid="richTextElement"]'), function (rt) {
        var comp = rt.closest('[id^="comp-"]'); if (!comp) return;
        var r = comp.getBoundingClientRect();
        if (!(r.width && r.left >= pr.left - 2 && r.right <= pr.right + 2 && r.top >= pr.top - 2 && r.bottom <= pr.bottom + 2)) return;
        var ls = lines(rt);
        if (ls.join('') === '>>' || ls.join('') === '>') { comp.classList.add('jcd-cap-hide', 'jcd-gg-hide'); return; }
        if (touch && ls.length && !name) { name = ls; comp.classList.add('jcd-cap-hide'); }
      });
      if (!touch) {                                  /* computer: round >> in the corner, on hover only */
        if (linked) { var g2 = document.createElement('span'); g2.className = 'jcd-go jcd-go-hover'; g2.textContent = '>>'; host.appendChild(g2); hb._jcdGo = g2; }
        return;
      }
      if (!name && !linked) return;
      var foot = document.createElement('div'); foot.className = 'jcd-foot';
      var nm = document.createElement('span'); nm.className = 'jcd-nm';
      if (name) {
        if (name.length > 1) { var sm = document.createElement('small'); sm.textContent = name[0]; nm.appendChild(sm); }
        nm.appendChild(document.createTextNode(name.length > 1 ? name.slice(1).join(' ') : name[0]));
      }
      foot.appendChild(nm);
      if (linked) { var go = document.createElement('span'); go.className = 'jcd-go'; go.textContent = '>>'; foot.appendChild(go); hb._jcdGo = go; }
      host.appendChild(foot);
    });
  });

  /* Home "Selected" grid (12 works), Joel 2026-11-26, option B "spotlight" (design study preview/works-grid.html).
     Computer with a mouse: the tile under the mouse stays bright, its photo eases in 6% inside the frame, a thin white
     line frames it and its category + name + a round ">>" rise in at the bottom; the other 11 dim. Touch (phone +
     iPad): category + name always at the bottom-left with the round ">>" (as on the category pages), blue while
     pressed. Wix's 27% / 45% darkening overlay is switched off for this grid (site.js 5b). */
  ready(function () {
    var g = document.getElementById('pro-gallery-container-comp-mnpgav5j'); if (!g) return;
    var NAMES = {
      't-interceptormp': ['Defense', 'T-Interceptor MP'], 'moai-router': ['Networking', 'Dr. AI MoAI Router'],
      'airgain-fwa-easy-installation-kit': ['Networking', 'Airgain FWA Installation Kit'], 'ocean-series': ['ID Family', 'Ocean Series'],
      'interstellar05': ['Electronics', 'Interstellar 05'], 'sagittarius-laptop': ['Electronics', 'Sagittarius Laptop'],
      'wi-fi7-hgu-ap': ['Networking', 'Wi-Fi 7 HGU / AP'], 'zenfone-9': ['Electronics', 'Zenfone 9 Concept'],
      'nlg-mma200': ['Industrial', 'NLG MMA200'], 'wi-fi7-gaming-home-gateway': ['Networking', 'Wi-Fi 7 Gaming Home Gateway'],
      'defense': ['Defense', 'T. Guardian'], 'ai-tool-kit': ['Experimental', 'AI Design Tool Kit']
    };
    var touch = document.body.classList.contains('device-mobile-optimized') || window.__jcdTablet ||
                (window.matchMedia && matchMedia('(hover: none)').matches);
    g.classList.add('jcd-spot'); if (touch) g.classList.add('jcd-spot-touch');
    [].forEach.call(g.querySelectorAll('a.item-link-wrapper[data-jcd-link]'), function (a) {
      var item = a.querySelector('.gallery-item-container'), n = NAMES[a.getAttribute('data-jcd-link')]; if (!item || !n) return;
      var fx = document.createElement('div'); fx.className = 'jcd-spot-fx';
      fx.innerHTML = '<div class="jcd-spot-grad"></div><div class="jcd-spot-ring"></div><div class="jcd-foot"><span class="jcd-nm"><small></small></span><span class="jcd-go">&gt;&gt;</span></div>';
      fx.querySelector('small').textContent = n[0];
      fx.querySelector('.jcd-nm').appendChild(document.createTextNode(n[1]));
      item.appendChild(fx);
      if (touch) return;
      /* the spotlight moves to the tile under the mouse; in the gaps between tiles it stays where it was
         (Joel 2026-11-26: going through a gap made everything flash bright), and only leaving the grid clears it */
      a.addEventListener('mouseenter', function () {
        [].forEach.call(g.querySelectorAll('a.jcd-hot-tile'), function (o) { if (o !== a) o.classList.remove('jcd-hot-tile'); });
        g.classList.add('jcd-hot'); a.classList.add('jcd-hot-tile');
      });
    });
    if (!touch) g.addEventListener('mouseleave', function () {
      g.classList.remove('jcd-hot');
      [].forEach.call(g.querySelectorAll('a.jcd-hot-tile'), function (o) { o.classList.remove('jcd-hot-tile'); });
    });
  });

  /* Round ">>": when a card or tile with one is clicked / tapped, the ">>" fills with --jcd-blue first and the
     page changes a moment later (Joel 2026-11-26: "it flashed blue and the page changed too fast"). Home Selected
     grid + category cards, every platform. Ctrl/Cmd/Shift/middle clicks (new tab) are left alone. */
  var GO_DELAY = 420;
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank') return;
    var go = null, tile = a.closest('#pro-gallery-container-comp-mnpgav5j a.item-link-wrapper') || (a.matches('#pro-gallery-container-comp-mnpgav5j a.item-link-wrapper') ? a : null);
    if (tile) go = tile.querySelector('.jcd-go');
    else { var hb = a.closest('.gpDCD5'); if (hb) go = hb._jcdGo || hb.querySelector('.jcd-go'); }
    if (!go) return;
    e.preventDefault();
    var href = a.href; go.classList.add('jcd-go-fill');
    setTimeout(function () { location.href = href; }, GO_DELAY);
  }, true);
  window.addEventListener('pageshow', function () {          /* back button: no blue left over */
    [].forEach.call(document.querySelectorAll('.jcd-go-fill'), function (g) { g.classList.remove('jcd-go-fill'); });
  });

  /* Home "Achievements" numbers (10+, 15+, 30+, 8+, 2+): odometer roll (Joel 2026-11-26, option A of
     preview/achievement-counters.html). Each digit is a column that rolls up like a clock / odometer (units roll
     more turns than tens), fast then slow, and all stop on the real number; numbers start 0.15s apart, once, when
     they scroll into view. The digits keep Wix's font and size (column height = the measured digit height).
     Every platform; reduced motion = plain numbers. */
  ready(function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var nums = [];
    [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'), function (rt) {
      if (!/^\s*\d+\s*\+\s*$/.test(rt.textContent)) return;
      var w = document.createTreeWalker(rt, NodeFilter.SHOW_TEXT), tn, node = null;
      while ((tn = w.nextNode())) { if (/\d/.test(tn.nodeValue)) { node = tn; break; } }
      if (!node) return;
      var m = /^(\s*)(\d+)(.*)$/.exec(node.nodeValue); if (!m) return;
      var probe = document.createElement('span'); probe.textContent = m[2];
      node.parentNode.insertBefore(probe, node); node.nodeValue = m[1] + m[3];
      nums.push({ probe: probe, digits: m[2].split(''), cols: [] });
    });
    if (!nums.length) return;
    nums.forEach(function (n) {
      var wrap = document.createElement('span'); wrap.className = 'jcd-odo'; wrap.setAttribute('aria-label', n.digits.join(''));
      n.digits.forEach(function (d, k) {
        /* an invisible copy of the final digit gives the column its exact width + height in the real font (also after
           the web font arrives); the rolling strip sits on top and is clipped top/bottom only (2nd pass: digits were
           cut at the right when the width was measured) */
        var od = document.createElement('span'); od.className = 'jcd-odo-d';
        var sz = document.createElement('span'); sz.className = 'jcd-odo-s'; sz.textContent = d; od.appendChild(sz);
        var col = document.createElement('span'); col.className = 'jcd-odo-c'; col.setAttribute('aria-hidden', 'true');
        var total = (n.digits.length - k) * 10 + (+d);
        for (var j = 0; j <= total; j++) { var i = document.createElement('span'); i.textContent = j % 10; col.appendChild(i); }
        od.appendChild(col); wrap.appendChild(od); n.cols.push({ col: col, total: total });
      });
      var blk = n.probe.closest('h1,h2,h3,h4,h5,h6,p') || n.probe.parentNode; blk.style.whiteSpace = 'nowrap';
      n.probe.parentNode.replaceChild(wrap, n.probe);
    });
    function run() {
      nums.forEach(function (n, idx) {
        n.cols.forEach(function (c) {
          c.col.style.transitionDelay = (idx * 0.15) + 's';
          c.col.style.transform = 'translateY(' + (-100 * c.total / (c.total + 1)).toFixed(4) + '%)';   /* % of the strip */
        });
      });
    }
    var target = nums[0].cols.length ? nums[0].cols[0].col.closest('section') : null;
    if (!('IntersectionObserver' in window) || !target) { run(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); setTimeout(run, 150); }
    }, { threshold: 0.25 });
    nums.forEach(function (n) { if (n.cols[0]) io.observe(n.cols[0].col.closest('.jcd-odo')); });
  });

  /* No hover tooltips (Joel 2026-11-26: resting the mouse on a photo showed its file name, e.g. "logo.png").
     Wix's title attributes were removed from the HTML; this also strips any that appear later (gallery hover
     overlays inserted by site.js, SVG <title>s) on every page. Form fields keep theirs. */
  (function () {
    function strip(root) {
      if (!root || !root.querySelectorAll) return;
      if (root.hasAttribute && root.hasAttribute('title') && !/^(INPUT|TEXTAREA|SELECT)$/.test(root.tagName)) root.removeAttribute('title');
      [].forEach.call(root.querySelectorAll('[title]'), function (e) { if (!/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)) e.removeAttribute('title'); });
      [].forEach.call(root.querySelectorAll('svg title'), function (t) { t.parentNode.removeChild(t); });
    }
    ready(function () {
      strip(document.body);
      if ('MutationObserver' in window) new MutationObserver(function (ms) {
        ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) strip(n); }); });
      }).observe(document.body, { childList: true, subtree: true });
    });
  })();

  // iOS Safari only applies :active (pressed states) when a touchstart listener exists.
  document.addEventListener('touchstart', function () {}, { passive: true });
})();
