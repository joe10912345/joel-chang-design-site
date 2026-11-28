  /* Phone About "Expertise": a thin rule above "Engineering" and above "Branding", like the dividers between the three
     columns on the computer (Joel 2026-11-28: "手機版的 engineering 上、Branding 上也要加入襯線"). The rule sits halfway
     between the group above and the heading, across the content width; drawn by expertise-rules-phone.css. Phone only. */
  ready(function () {
    if (!document.body.classList.contains('device-mobile-optimized') || !/\/about\//.test(location.pathname)) return;
    var heads = ['comp-mujnicqn', 'comp-mujnhrtl'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
    function glyphs(e) {
      var g = document.createRange(); g.selectNodeContents(e);
      return [].filter.call(g.getClientRects(), function (q) { return q.width > 1 && q.height > 1; });
    }
    function place() {
      heads.forEach(function (h) {
        var hr = glyphs(h); if (!hr.length) return;
        var top = Math.min.apply(null, hr.map(function (q) { return q.top; }));
        var sec = h.closest('section') || document.body, above = -1e9;
        /* the lowest text of the group above (its last line) */
        [].forEach.call(sec.querySelectorAll('[data-testid="richTextElement"]'), function (t) {
          if (h.contains(t) || t.contains(h)) return;
          glyphs(t).forEach(function (q) { if (q.bottom <= top + 1 && q.bottom > above) above = q.bottom; });
        });
        if (above < -1e8) return;
        h.classList.add('jcd-rule-above');
        h.style.setProperty('--jcd-rule-top', ((above + top) / 2 - h.getBoundingClientRect().top).toFixed(1) + 'px');
      });
    }
    place(); window.addEventListener('load', function () { setTimeout(place, 300); setTimeout(place, 2600); });
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(place, 200); });
  });
