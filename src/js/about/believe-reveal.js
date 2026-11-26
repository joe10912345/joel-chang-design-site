  /* About "What I Believe": scroll reveal like the product pages (Joel 2026-11-26). The photo is one screen tall and
     stays still on the screen while the section passes over it like a window (CSS sticky, no scroll script). Its box
     reaches one screen above and below the section; the section's background box clips it ('clip', never 'hidden',
     or the sticky would stop). Photo always loads at once. Phone, iPad, computer. */
  ready(function () {
    var media = document.getElementById('bgMedia_comp-mujj9yyt'); if (!media) return;
    var sec = media.closest('section'), wi = media.querySelector('wow-image'), img = wi && wi.querySelector('img');
    if (!sec || !wi || !img) return;
    img.loading = 'eager'; img.removeAttribute('loading');
    sec.classList.add('jcd-window');
    function lay() {
      var Z = window.__jcdZoom || 1, vh = Math.round(window.innerHeight / Z);
      /* iPad upright (Joel 2026-11-26): text drawn 1.25x (the centring script below re-centres it) */
      var upright = document.documentElement.classList.contains('jcd-tab-portrait');
      sec.style.removeProperty('height'); sec.style.removeProperty('min-height');
      /* second pass (Joel): too much ceiling/floor at full screen height -> section and photo are 38% of the screen (wide crop), the
         photo held at the bottom of the screen like the product pages' closing photo */
      var F = framing();
      /* phone (Joel 2026-11-27: dragging the photo up hid it under the page above): the photo window is exactly the
         section, so all of the window is visible and the framing in jcd-config.js shows in full */
      var phone = document.body.classList.contains('device-mobile-optimized');
      var imgH = upright ? Math.round(vh * ((F && F.height) || 0.38)) : phone ? Math.min(vh, sec.offsetHeight) : vh, c = vh - imgH;   /* held at the screen bottom: this is the page's last section */
      if (upright) { sec.style.setProperty('height', imgH + 'px', 'important'); sec.style.setProperty('min-height', imgH + 'px', 'important'); }
      ['comp-mujq4udg1', 'comp-mujq4ude6'].forEach(function (id) {
        var e = document.getElementById(id); if (!e) return;
        if (upright) { e.style.setProperty('transform', 'scale(1.25)', 'important'); e.style.setProperty('transform-origin', '50% 50%', 'important'); }
        else { e.style.removeProperty('transform'); e.style.removeProperty('transform-origin'); }
      });
      var H = sec.offsetHeight;
      if (media.parentElement) media.parentElement.style.setProperty('overflow', 'clip', 'important');
      [['position', 'absolute'], ['top', (c - vh) + 'px'], ['left', '0'], ['width', '100%'], ['height', (H + imgH + vh) + 'px'],
       ['margin', '0'], ['overflow', 'visible'], ['transform', 'none']].forEach(function (p) { media.style.setProperty(p[0], p[1], 'important'); });
      [['position', 'sticky'], ['top', c + 'px'], ['bottom', 'auto'], ['left', 'auto'], ['width', '100%'], ['height', imgH + 'px'],
       ['display', 'block'], ['transform', 'none'], ['margin', '0']].forEach(function (p) { wi.style.setProperty(p[0], p[1], 'important'); });
      place();
    }
    /* Phone + iPad framing (Joel 2026-11-27, values in jcd-config.js "believe", aligned by hand in
       preview/mockups/believe-align.html): the photo's point (fx, fy) lands at (sx, sy) of the window, zoom x the
       size that just fills it, never an empty edge. Re-computed from the real window size every time. Computer: cover, centred. */
    function framing() {
      var B = window.JCD_CONFIG && window.JCD_CONFIG.believe; if (!B) return null;
      if (document.body.classList.contains('device-mobile-optimized')) return B.phone;
      if (window.__jcdTablet) return document.documentElement.classList.contains('jcd-tab-portrait') ? B.ipadPortrait : B.ipadLandscape;
      return null;
    }
    function place() {
      var F = framing(), iw = img.naturalWidth || 2151, ih = img.naturalHeight || 1344;
      if (!F) {
        ['position', 'left', 'top', 'max-width', 'max-height'].forEach(function (k) { img.style.removeProperty(k); });
        img.style.setProperty('width', '100%', 'important'); img.style.setProperty('height', '100%', 'important');
        img.style.setProperty('object-fit', 'cover', 'important'); return;
      }
      var bw = wi.clientWidth, bh = wi.clientHeight; if (!bw || !bh) return;
      /* zoom below 1 (Joel 2026-11-27: "let me zoom out"): the photo is smaller than the window on that side and may sit
         anywhere inside it (black around); above 1 it never leaves an empty edge */
      var k = Math.max(bw / iw, bh / ih) * Math.max(0.3, F.zoom || 1), dw = iw * k, dh = ih * k;
      var fit = function (want, box, size) { return size >= box ? Math.min(0, Math.max(box - size, want)) : Math.max(0, Math.min(box - size, want)); };
      var x = fit(F.sx * bw - F.fx * dw, bw, dw), y = fit(F.sy * bh - F.fy * dh, bh, dh);
      wi.style.setProperty('overflow', 'hidden', 'important');
      [['position', 'absolute'], ['left', x.toFixed(1) + 'px'], ['top', y.toFixed(1) + 'px'], ['width', dw.toFixed(1) + 'px'],
       ['height', dh.toFixed(1) + 'px'], ['max-width', 'none'], ['max-height', 'none'], ['object-fit', 'fill']].forEach(function (p) { img.style.setProperty(p[0], p[1], 'important'); });
    }
    window.__jcdBelieveLay = lay;   /* the alignment tool calls this after changing the values */
    if (!img.complete) img.addEventListener('load', place);
    lay();
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(lay, 120); });
    window.addEventListener('load', lay);
  });

