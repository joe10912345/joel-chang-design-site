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

