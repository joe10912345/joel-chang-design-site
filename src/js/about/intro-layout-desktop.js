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
      /* the header's bottom with the page at its top = its height (it starts the page). Not its on-screen place + scroll:
         the header is sticky, so after a reload that restores a scrolled position it sits at the top of the screen and
         that sum pushed the intro thousands of px down (Joel 2026-11-27: "重新整理到 about 時，第一個 section 上方會有
         超大的空間") */
      var hdr = document.getElementById('SITE_HEADER'), hb = hdr ? hdr.offsetHeight * Z : 0;
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

