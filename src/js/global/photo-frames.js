  /* Photo framing inside cards (Joel 2026-11-27): jcd-config.js `photoFrames` says, per photo, which point stays in
     view (x / y %) and how far it is zoomed in. Per platform when the entry has desktop / ipadLandscape / ipadPortrait / phone values; object-fit cover + object-position
     + scale around that point; the card clips the overflow. window.__jcdPhotoFrames() re-applies (used by
     preview/mockups/photo-align.html). First use: Defense "T. Xcalar" card. */
  ready(function () {
    function apply() {
      var P = (window.JCD_CONFIG && JCD_CONFIG.photoFrames) || {};
      Object.keys(P).forEach(function (k) {
        var img = document.querySelector(P[k].img); if (!img) return;
        var dk = document.body.classList.contains('device-mobile-optimized') ? 'phone' :
                 document.documentElement.classList.contains('jcd-tab-portrait') ? 'ipadPortrait' :
                 document.documentElement.classList.contains('jcd-tablet') ? 'ipadLandscape' : 'desktop';
        var f = P[k][dk] || P[k];   /* per-platform values when the entry has them */
        var x = (f.x != null ? f.x : 50) + '%', y = (f.y != null ? f.y : 50) + '%', z = Math.max(1, f.zoom || 1);
        img.style.setProperty('object-fit', 'cover', 'important');
        img.style.setProperty('object-position', x + ' ' + y, 'important');
        img.style.setProperty('transform-origin', x + ' ' + y, 'important');
        img.style.setProperty('transform', 'scale(' + z + ')', 'important');   /* beats static-overrides' "no transform in tiles" */
        var clip = img.closest('.ih2JY1, [data-testid="linkElement"]') || img.parentElement;
        if (clip) clip.style.setProperty('overflow', 'hidden', 'important');
      });
    }
    window.__jcdPhotoFrames = apply;
    apply();
  });

