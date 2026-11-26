  /* About page: one spacing rule for every section heading (Joel 2026-11-24: "SELECTED AWARDS, EXPERTISE and TRUSTED
     COLLABORATION are not spaced the same"). Wix had fixed pixel row heights, so the gaps were 76-116px (desktop) and
     6-76px (phone). CSS makes the rows of these sections size to their content (.jcd-about-flow), then each heading
     gets, from the content above it (same column) and to the content below it:
       desktop / iPad: main headings 98px above, 41px below;  side headings (LANGUAGES) 60px above
       phone:          main headings 48px above, 12px below;  side headings (EDUCATION, LANGUAGES, PATENTS) 28px above
     Headings that sit side by side (WORK EXPERIENCE | EDUCATION, SELECTED AWARDS | PATENTS) move together. */
  (function () {
    var MAIN = /^(WORK EXPERIENCE|SELECTED AWARDS|EXPERTISE|TRUSTED COLLABORATION)$/, SIDE = /^(EDUCATION|LANGUAGES|PATENTS)$/;
    var SECS = ['comp-mujj9yx18', 'comp-mujj9yxj', 'comp-mujk8qkl'];
    function run() {
      var secs = SECS.map(function (id) { return document.getElementById(id); }).filter(Boolean);
      if (secs.length < 3) return;
      var phone = document.body.classList.contains('device-mobile-optimized'), Z = window.__jcdZoom || 1;
      var G = phone ? { main: 48, side: 28, below: 12 } : { main: 98, side: 60, below: 41 };
      document.documentElement.classList.add('jcd-about-flow');
      var root = document.getElementById('PAGES_CONTAINER');
      function box(e) { var r = e.getBoundingClientRect(); return { t: r.top / Z, b: r.bottom / Z, l: r.left / Z, r: r.right / Z, h: r.height }; }
      var texts = [].slice.call(root.querySelectorAll('[data-testid="richTextElement"]'));
      var heads = texts.filter(function (t) { var x = t.textContent.trim(); return MAIN.test(x) || SIDE.test(x); })
        .filter(function (t) { return secs.some(function (s) { return s.contains(t); }); });
      function content() {
        return [].slice.call(root.querySelectorAll('[data-testid="richTextElement"], .wixui-image, .wixui-vector-image, .jcd-rec'))
          .filter(function (e) { return heads.indexOf(e) < 0 && !e.closest('.jcd-rec, [style*="display: none"]') || e.classList.contains('jcd-rec'); })
          .filter(function (e) { var b = e.getBoundingClientRect(); return b.height > 2 && getComputedStyle(e).display !== 'none'; });
      }
      function col(h) {   /* the heading's column = its item in the section's outermost grid */
        var sec = h.closest('section'), top = sec.querySelector('[data-mesh-id$="inlineContent-gridContainer"]'), e = h;
        while (e.parentElement && e.parentElement !== top) e = e.parentElement;
        return e.parentElement === top ? e : h;
      }
      function gapAbove(h) {
        var hb = box(h), cb = box(col(h)), best = -1e9;
        content().forEach(function (e) { var b = box(e); if (b.b <= hb.t + 1 && b.r > cb.l + 2 && b.l < cb.r - 2 && b.b > best) best = b.b; });
        return best < -1e8 ? null : hb.t - best;
      }
      function gapBelow(h) {
        var hb = box(h), cb = box(col(h)), best = 1e9;
        content().forEach(function (e) { var b = box(e); if (b.t >= hb.b - 1 && b.r > cb.l + 2 && b.l < cb.r - 2 && b.t < best) best = b.t; });
        return best > 1e8 ? null : best - hb.b;
      }
      function px(e, prop) { return parseFloat(getComputedStyle(e)[prop]) || 0; }
      var done = [];
      heads.sort(function (a, b) { return box(a).t - box(b).t; });
      heads.forEach(function (h) {
        if (done.indexOf(h) >= 0) return;
        var main = MAIN.test(h.textContent.trim());
        var mates = heads.filter(function (o) { return o !== h && done.indexOf(o) < 0 && Math.abs(box(o).t - box(h).t) < 3; });
        var ga = gapAbove(h);
        if (ga !== null) {
          var d = (main ? G.main : G.side) - ga;
          [h].concat(mates).forEach(function (e) { e.style.setProperty('margin-top', (px(e, 'marginTop') + d) + 'px', 'important'); });
        }
        [h].concat(mates).forEach(function (e) {
          var gb = gapBelow(e); if (gb === null) return;
          e.style.setProperty('margin-bottom', (px(e, 'marginBottom') + G.below - gb) + 'px', 'important');
        });
        done.push.apply(done, [h].concat(mates));
      });
      /* One left edge for every heading and its content (Joel: spacing must match): the WORK EXPERIENCE content edge
         (desktop 156px at 1536 / phone 20px). Desktop: a section whose text starts a few px off (EXPERTISE -11,
         TRUSTED COLLABORATION heading -4) moves all its grid items; the recommendation cards line up too.
         Phone: any heading or text a few px off that edge (17px) moves onto it. */
      function textLeft(e) { var rg = document.createRange(); rg.selectNodeContents(e); return rg.getBoundingClientRect().left / Z; }
      var we = heads.filter(function (h) { return /^WORK EXPERIENCE$/.test(h.textContent.trim()); })[0];
      var weCol = we && col(we);
      var ref = null;
      if (weCol) {
        var firstTxt = [].filter.call(weCol.querySelectorAll('[data-testid="richTextElement"]'), function (e) { return e !== we; })[0];
        ref = textLeft(firstTxt || we);
      }
      function shift(e, d) { e.style.setProperty('left', ((parseFloat(getComputedStyle(e).left) || 0) + d).toFixed(2) + 'px', 'important'); }
      if (ref !== null) {
        if (!phone) {
          secs.forEach(function (sec) {
            var top = sec.querySelector('[data-mesh-id$="inlineContent-gridContainer"]');
            var ts = [].filter.call(sec.querySelectorAll('[data-testid="richTextElement"]'), function (t) { return t.getBoundingClientRect().height > 2; });
            if (!ts.length) return;
            var minL = Math.min.apply(null, ts.map(textLeft)), d = ref - minL;
            if (Math.abs(d) < 0.5 || Math.abs(d) > 20) return;
            if (sec.querySelector('.jcd-rec')) { ts.forEach(function (t) { if (Math.abs(textLeft(t) - minL) < 1) shift(t, d); }); }
            else [].forEach.call(top.children, function (it) { if (it.id) shift(it, d); });
          });
          var rec = document.querySelector('.jcd-rec');
          if (rec) { var dl = ref - rec.getBoundingClientRect().left / Z; if (Math.abs(dl) > 0.5 && Math.abs(dl) < 30) rec.style.setProperty('transform', 'translateX(' + dl.toFixed(2) + 'px)'); }
        } else {
          secs.forEach(function (sec) {
            [].forEach.call(sec.querySelectorAll('[data-testid="richTextElement"]'), function (t) {
              if (t.getBoundingClientRect().height <= 2 || t.closest('.jcd-rec')) return;
              var d = ref - textLeft(t); if (d > 0.5 && d < 6) shift(t, d);
            });
          });
        }
      }
      window.dispatchEvent(new Event('resize'));
    }
    var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(run, 30); }); };
    document.readyState === 'complete' ? go() : window.addEventListener('load', go);
  })();
