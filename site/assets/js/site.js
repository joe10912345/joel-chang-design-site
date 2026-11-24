/* Static replacement for the bits of the Wix runtime this site needs.
   Loaded in <head> of every page (no dependencies). */
(function () {
  var mode = window.__STATIC_MODE, alt = window.__ALT_URL;

  /* 1. Desktop <-> mobile layout. The Wix "classic" site has two separate layouts
        (desktop at /, mobile under /m/). Match what live Wix does:
        - phones (touch screen whose short side < 600px) get the mobile layout;
        - tablets (iPad etc.) get the desktop layout, laid out TABLET_W (1440) px wide and scaled to fit, portrait + landscape;
        - desktop browsers get the desktop layout (a window narrower than 600px gets mobile).
        Add ?layout=desktop or ?layout=mobile to a URL to force one for this tab. */
  var touch = false;
  try {
    /* "touch device" = the PRIMARY pointer is a finger. A Windows laptop with a touch screen reports
       maxTouchPoints 10 even when used with a mouse (and on an external monitor), so that alone must not count. */
    var mm = function (q) { return !!(window.matchMedia && matchMedia(q).matches); };
    touch = mm('(pointer: coarse)') || (navigator.maxTouchPoints > 1 && !mm('(pointer: fine)'));
    if (/[?&]tablet=1(&|$)/.test(location.search)) touch = true;   /* preview/devices.html: treat this frame as an iPad */
    var q = (location.search.match(/[?&]layout=(desktop|mobile)/) || [])[1];
    if (q) sessionStorage.setItem('layout', q);
    var pref = sessionStorage.getItem('layout');
    var shortSide = Math.min(screen.width || 9999, screen.height || 9999);
    var phone = touch && shortSide < 600;
    var narrowWindow = !touch && (window.innerWidth || 9999) < 600;
    var want = pref || ((phone || narrowWindow) ? 'mobile' : 'desktop');
    if (alt && want !== mode) { location.replace(alt + location.hash); return; }
  } catch (e) {}
  /* Tablets / touch devices on the desktop layout: lay the page out TABLET_W px wide and scale it to the screen.
     (Joel 2026-11-24) Wix used 980px, but most of this site's content spans ~1330-1430px around the centre (elements at
     left:-140px etc.), so at 980 an iPad cut both sides off. 1366 shows every page whole; the browser rescales the same
     layout when the iPad turns, so portrait AND landscape both fit. Keep preview/devices.html (TW) in step with this. */
  window.__jcdTablet = mode === 'desktop' && touch;   /* read by custom.js (iPad landscape full-screen top image) */
  var TABLET_W = 1440;   /* 1366 fitted the content but the category frames almost touched the edges; 1440 leaves ~50px each side */
  if (mode === 'desktop' && touch) {
    var vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.setAttribute('content', 'width=' + TABLET_W + ', user-scalable=yes');
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.remove('device-mobile-optimized');
      document.body.classList.add('device-mobile-non-optimized');
    });
  }

  /* Wide screens (Joel 2026-11-24): the Wix desktop layout is designed for a ~1300px stage, so on a 1920/2560px
     monitor at 100% it sat small in the middle with wide black bars. Like on his laptop (1920px @125% = 1536 CSS px),
     scale the whole page with CSS zoom so 1536 CSS px of layout always fill the window (never shrink below 1).
     Other scripts read window.__jcdZoom to convert screen px (clientX, getBoundingClientRect) into CSS px. */
  window.__jcdZoom = 1;
  if (mode === 'desktop' && !touch) {
    var ZOOM_REF = 1536, root = document.documentElement;
    var fitZoom = function () {
      var w = window.innerWidth || root.clientWidth || ZOOM_REF;
      var z = w > ZOOM_REF ? Math.round(w / ZOOM_REF * 1000) / 1000 : 1;
      if (z !== window.__jcdZoom) { window.__jcdZoom = z; root.style.zoom = z === 1 ? '' : String(z); }
    };
    fitZoom(); window.addEventListener('resize', fitZoom);
  }

  function ready(fn) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn(); }

  ready(function () {
    /* 2. (Entrance / looping Wix motion was removed at export time: all text is static by design.) */

    /* 3. Mobile hamburger menu */
    var tog = document.getElementById('MENU_AS_CONTAINER_TOGGLE'),
        box = document.getElementById('MENU_AS_CONTAINER');
    if (tog && box) {
      var ov = document.getElementById('overlay-MENU_AS_CONTAINER'),
          ct = document.getElementById('container-MENU_AS_CONTAINER');
      var setOpen = function (open) {
        tog.classList.toggle('d0L2ow', open);
        box.classList.toggle('I_VSKP', open);
        box.setAttribute('data-undisplayed', open ? 'false' : 'true');
        tog.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (ov) ov.style.cssText = open ? 'opacity:1;visibility:inherit' : '';
        if (ct) ct.style.cssText = open ? 'visibility:inherit' : '';
        document.body.classList.toggle('siteScrollingBlockedIOSFix', open);
      };
      var isOpen = function () { return box.classList.contains('I_VSKP'); };
      tog.addEventListener('click', function () { setOpen(!isOpen()); });
      if (ov) ov.addEventListener('click', function () { setOpen(false); });
      box.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setOpen(false); });
    }

    /* 4. Desktop menu (Wix horizontal menu): hover state on every top-level item, dropdown for "Works" */
    Array.prototype.forEach.call(document.querySelectorAll('li[data-item-depth="0"]'), function (li) {
      var a = li.querySelector('a'), sub = li.querySelector('[data-testid="positionBox"]');
      var on = function () { li.setAttribute('data-hovered', 'true'); if (sub) { li.setAttribute('data-shown', 'true'); a && a.setAttribute('aria-expanded', 'true'); } };
      var off = function () { li.removeAttribute('data-hovered'); li.removeAttribute('data-shown'); if (sub && a) a.setAttribute('aria-expanded', 'false'); };
      li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off);
      li.addEventListener('focusin', on); li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) off(); });
    });

    /* 5. Pro Gallery sliders: arrows scroll the strip one card at a time, prev arrow appears once scrolled
          (as on live); touch swipe / trackpad scroll work natively (overflow-x: auto + scroll-snap). */
    Array.prototype.forEach.call(document.querySelectorAll('.pro-gallery.slider, .pro-gallery .gallery-slider'), function (root) {
      var strip = root.querySelector('.gallery-horizontal-scroll'); if (!strip || strip.__static) return; strip.__static = 1;
            var next = root.querySelector('[data-hook="nav-arrow-next"], .nav-arrow-next');
      var prev = root.querySelector('[data-hook="nav-arrow-prev"], .nav-arrow-prev');
      if (next && !prev) {
        prev = next.cloneNode(true);
        prev.setAttribute('data-hook', 'nav-arrow-prev');
        prev.setAttribute('aria-label', 'Previous Item');
        prev.style.right = ''; prev.style.left = next.style.right || '-46px';
        prev.style.transform = 'scaleX(-1)';
        next.parentNode.insertBefore(prev, next);
      }
      var card = root.querySelector('.gallery-item-container');
      var step = function () { return card ? card.getBoundingClientRect().width + 21 : strip.clientWidth * 0.8; };
      var sync = function () {
        var max = strip.scrollWidth - strip.clientWidth - 2;
        if (prev) prev.style.display = strip.scrollLeft > 2 ? '' : 'none';
        if (next) next.style.display = strip.scrollLeft < max ? '' : 'none';
      };
      [[next, 1], [prev, -1]].forEach(function (p) {
        if (!p[0]) return;
        p[0].style.opacity = '1'; p[0].style.pointerEvents = 'auto'; p[0].style.cursor = 'pointer';
        p[0].addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); strip.scrollBy({ left: p[1] * step(), behavior: 'smooth' }); });
      });
      strip.addEventListener('scroll', sync, { passive: true }); sync();
    });

    /* 5b. Pro Gallery hover overlays (title + description). Wix renders the overlay only while hovered;
           the export stores the live overlay markup in <template data-pg-hover> and we insert it the same way. */
    var isTouch = (window.matchMedia && matchMedia('(hover: none)').matches);
    var openItem = null;
    Array.prototype.forEach.call(document.querySelectorAll('.gallery-item-container'), function (item) {
      var tpl = item.querySelector('template[data-pg-hover]'); if (!tpl) return;
      var wrapper = item.querySelector('.gallery-item-wrapper'), content = item.querySelector('.gallery-item-content');
      var baseItem = item.className, baseContent = content ? content.className : '';
      var shown = null, leaving = null;
      var show = function () {
        if (shown) return;
        item.className = tpl.getAttribute('data-container-class') || baseItem;
        if (content) content.className = tpl.getAttribute('data-content-class') || baseContent;
        if (leaving) { clearTimeout(leaving.t); leaving.el.remove(); leaving = null; }
        var d = document.createElement('div'); d.innerHTML = tpl.innerHTML; shown = d.firstElementChild;
        if (shown && wrapper) {
          shown.classList.add('jcd-ov'); wrapper.appendChild(shown);
          void shown.offsetWidth; shown.classList.add('jcd-ov-in');   /* soft fade-in, see custom.css */
        }
      };
      var hide = function () {
        if (!shown) return;
        var el = shown; shown = null; el.classList.remove('jcd-ov-in');   /* soft fade-out, then restore */
        leaving = { el: el, t: setTimeout(function () { el.remove(); leaving = null;
          if (!shown) { item.className = baseItem; if (content) content.className = baseContent; } }, 700) };
      };
      item.addEventListener('mouseenter', function () { if (!isTouch) show(); });
      item.addEventListener('mouseleave', function () { if (!isTouch) hide(); });
      item.addEventListener('focusin', show); item.addEventListener('focusout', hide);
      /* Touch: first tap shows the overlay (like Wix on touch devices), second tap follows the link if any. */
      item.addEventListener('click', function (e) {
        if (!isTouch) return;
        if (!shown) { e.preventDefault(); if (openItem && openItem !== hide) openItem(); show(); openItem = hide; }
      }, true);
    });
    if (isTouch) document.addEventListener('click', function (e) { if (openItem && !(e.target.closest && e.target.closest('.gallery-item-container'))) { openItem(); openItem = null; } });

    /* 6. Wix slideshow galleries (home hero): continuous slide to the left like live Wix
          (4s per slide incl. a 1s cubic-bezier(.87,0,.13,1) push), seamless loop via a cloned first slide,
          swipe on touch, arrows if present. Images are the preloaded "ghost" slides from the export. */
    Array.prototype.forEach.call(document.querySelectorAll('[data-testid="slide-show-gallery"]'), function (g) {
      var srcs = Array.prototype.map.call(g.querySelectorAll('[data-testid="gallery-item-ghost"] img'), function (i) { return i.getAttribute('src'); });
      var item = g.querySelector('[data-testid="gallery-item-item"]'), img = item && item.querySelector('img');
      var counter = g.querySelector('[data-testid="gallery-counter"]');
      if (!img || srcs.length < 2) return;
      var n = srcs.length, idx = Math.max(0, srcs.indexOf(img.getAttribute('src'))), DUR = 1000, EVERY = 4000;
      var pos = img.style.objectPosition || '50% 50%';
      var view = document.createElement('div');
      view.className = 'jcd-slides';
      view.style.cssText = 'position:absolute;inset:0;overflow:hidden;touch-action:pan-y;';
      var track = document.createElement('div');
      track.style.cssText = 'display:flex;height:100%;will-change:transform;';
      srcs.concat([srcs[0]]).forEach(function (src) {
        var im = document.createElement('img'); im.src = src; im.alt = ''; im.draggable = false;
        im.style.cssText = 'flex:0 0 100%;width:100%;height:100%;object-fit:cover;object-position:' + pos + ';display:block;';
        track.appendChild(im);
      });
      view.appendChild(track);
      item.parentNode.insertBefore(view, item.nextSibling);
      item.style.visibility = 'hidden';
      var setX = function (i, anim) {
        track.style.transition = anim ? 'transform ' + DUR + 'ms cubic-bezier(.87,0,.13,1)' : 'none';
        track.style.transform = 'translate3d(' + (-i * 100) + '%,0,0)';
      };
      var label = function () { if (counter) counter.textContent = ((idx % n) + 1) + '/' + n; };
      var busy = false;
      var go = function (d) {
        if (busy) return; busy = true;
        if (d < 0 && idx === 0) { idx = n; setX(idx, false); track.offsetWidth; }   /* wrap backwards via the clone */
        idx += d; setX(idx, true); label();
        setTimeout(function () {
          if (idx >= n) { idx = 0; setX(0, false); }                                  /* clone -> real first, no rewind */
          busy = false;
        }, DUR + 20);
      };
      setX(idx, false); label();
      var timer = setInterval(function () { go(1); }, EVERY);
      var restart = function () { clearInterval(timer); timer = setInterval(function () { go(1); }, EVERY); };
      /* swipe */
      var x0 = null;
      view.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      view.addEventListener('touchend', function (e) {
        if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restart(); }
      });
      Array.prototype.forEach.call(g.querySelectorAll('[data-testid="nav-arrow-next"],[data-testid="nav-arrow-prev"]'), function (bt) {
        bt.addEventListener('click', function (e) { e.preventDefault(); go(/prev/i.test(bt.getAttribute('data-testid')) ? -1 : 1); restart(); });
      });
      document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else restart(); });
    });

    /* 7. Header show/hide on scroll lives in custom.js (Joel's design). */
  });
})();
