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
