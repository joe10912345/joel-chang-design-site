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
      var imgH = upright ? Math.round(vh * 0.38) : vh, c = vh - imgH;   /* held at the screen bottom: this is the page's last section */
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
      img.style.setProperty('width', '100%', 'important'); img.style.setProperty('height', '100%', 'important');
      img.style.setProperty('object-fit', 'cover', 'important');
      /* phone + iPad (Joel 2026-11-26): a tall screen shows only a slice of this wide photo; keep its left side,
         where the speaker stands, but not pushed to the edge: he sits left of centre */
      if (document.body.classList.contains('device-mobile-optimized') || window.__jcdTablet)
        img.style.setProperty('object-position', (document.body.classList.contains('device-mobile-optimized') ? '17% 45%' : '15% 70%'), 'important');   /* speaker at ~35-40% of the screen */
    }
    lay();
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(lay, 120); });
    window.addEventListener('load', lay);
  });

