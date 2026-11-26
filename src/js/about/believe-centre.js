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
