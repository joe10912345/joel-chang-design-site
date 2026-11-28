  /* Category pages: the same black space under the last item on every page (Joel 2026-11-27, see jcd-config.js
     `categoryBottom`). Wix left anything from 9px to 277px. Measures the last visible content (photos, text, frames)
     and sets the last section so the page ends that far below it. Runs after the phone spacing script and again on
     load / resize, since cards can still move. Computer, iPad, phone. */
  (function () {
    if (!/\/(networking|defense|electronics|industrial|lifestyle|experimental)\//.test(location.pathname)) return;
    function fit() {
      var C = (window.JCD_CONFIG && JCD_CONFIG.categoryBottom) || {}, phone = document.body.classList.contains('device-mobile-optimized');
      var want = phone ? C.phone : C.desktop; if (want == null) return;
      var secs = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER section'), function (s) { return !s.parentElement.closest('section'); });
      var last = secs[secs.length - 1]; if (!last) return;
      var grid = last.querySelector('[data-mesh-id$="inlineContent-gridContainer"]') || last;
      var z = window.__jcdZoom || 1, sc = document.scrollingElement || document.documentElement;
      grid.style.setProperty('min-height', '0', 'important');   /* Wix's fixed height would keep extra space */
      for (var k = 0; k < 3; k++) {   /* measure, correct, measure again (the page end can shift with the change) */
        var bottom = -1e9;
        [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER img, #PAGES_CONTAINER .wixui-rich-text, #PAGES_CONTAINER .wixui-vector-image'), function (e) {
          if (e.closest('[id^="bgMedia_"], .jcd-gg-hide')) return;
          /* only what is seen: Wix's old card overlays are vector images whose drawing is see-through (static-overrides.css)
             and hung below the last card on Electronics (Joel 2026-11-28) */
          var sv = e.querySelector && e.querySelector('svg'); if (sv && getComputedStyle(sv).opacity === '0') return;
          if (getComputedStyle(e).opacity === '0') return;
          var r = e.getBoundingClientRect(); if (r.width > 20 && r.height > 5 && getComputedStyle(e).visibility !== 'hidden') bottom = Math.max(bottom, r.bottom);
        });
        if (bottom < -1e8) return;
        var end = sc.scrollHeight - sc.scrollTop;   /* page end, in window px from the top of the window */
        var diff = want - (end - bottom) / z;
        if (Math.abs(diff) < 1) break;
        /* the section's bottom margin takes the difference, up or down (the phone spacing script may already have set
           it, e.g. negative to shorten the section; Wix gave others a bottom margin) */
        var mb = parseFloat(getComputedStyle(last).marginBottom) || 0;
        last.style.setProperty('margin-bottom', (mb + diff).toFixed(1) + 'px', 'important');
      }
    }
    ready(function () { setTimeout(fit, 0); });
    window.addEventListener('load', function () { setTimeout(fit, 300); setTimeout(fit, 2600); });   /* again after the title bars' last layout (catalog-title-bars.js, 2.2s) */
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 200); });
  })();
