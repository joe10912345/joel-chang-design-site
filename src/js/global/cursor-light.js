  ready(function () {
    /* Cursor light: a blue glow that follows the mouse (desktop pointer only). Since Joel 2026-11-27 ("把滑鼠光暈放最前")
       it is one see-through layer IN FRONT of the page content (custom.css .jcd-cursor-light), clicks pass through.
       We only move the CSS vars --mx/--my (eased each frame) and fade --jcd-light in/out. */
    var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !calm) {
      var rs = document.documentElement.style, hdrEl = document.getElementById('SITE_HEADER');
      document.documentElement.classList.add('jcd-light-on');
      var layer = document.createElement('div'); layer.className = 'jcd-cursor-light'; layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
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
  });

