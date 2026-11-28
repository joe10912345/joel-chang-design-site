  /* Catalog title bars (Joel 2026-11-24): each card on the category pages is a white outline (vector) with a title bar
     above the photo: title on the left, a short description on the right. Wix placed the right text a few px too low
     (e.g. Lifestyle "Atmosphere & Daily Experience" nearly touches the photo). Every text inside a bar is moved so its
     vertical centre sits on the bar's centre (bar = outline top .. photo top). Desktop, iPad and phone. Uses `top`
     (the texts are position:relative), so tilt.js transforms are untouched. */
  (function () {
    function Z() { return window.__jcdZoom || 1; }
    var inTool = /[?&]tool=/.test(location.search);
    var B = null;   /* jcd-config.js catalogBars for this platform, read when the bars are laid out */
    var undo = [];  /* [element, property, its own inline value, priority]: put back before every new layout */
    function setp(el, prop, val, imp) {
      undo.push([el, prop, el.style.getPropertyValue(prop), el.style.getPropertyPriority(prop)]);
      el.style.setProperty(prop, val, imp ? 'important' : '');
    }
    function centreBars() {
      /* the photo box where it is seen (.ih2JY1 moves with the card when the phone layout moves it, e.g. Industrial,
         Joel 2026-11-28); the card's own box stays where Wix put it */
      for (var u = undo.length - 1; u >= 0; u--) { var w = undo[u]; if (w[2]) w[0].style.setProperty(w[1], w[2], w[3]); else w[0].style.removeProperty(w[1]); }
      undo = [];
      var CB = window.JCD_CONFIG && window.JCD_CONFIG.catalogBars;
      B = CB ? (document.body.classList.contains('device-mobile-optimized') ? CB.phone : CB.desktop) : null;
      var photos = [].map.call(document.querySelectorAll('.gpDCD5'), function (g) { return g.querySelector('.ih2JY1') || g; });
      if (!photos.length) return;
      /* top to bottom, and each frame once, with the first (topmost) photo in it: a frame holding several photos was
         laid out again for each of them (Joel 2026-11-28) */
      photos.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      var seen = [];
      var texts = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'));
      var frames = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER .wixui-vector-image'));
      texts.forEach(function (t) { if (t.hasAttribute('data-jcd-bar')) { t.style.top = t.getAttribute('data-jcd-bar'); } });
      [].forEach.call(photos, function (ph) {
        var pr = ph.getBoundingClientRect(); if (!pr.width) return;
        var fr = null, frEl = null;
        frames.forEach(function (v) {
          var r = v.getBoundingClientRect();
          if (r.top < pr.top - 8 && r.bottom > pr.top + pr.height / 2 &&   /* frame starts above the photo and holds most of it */ Math.abs(r.left - pr.left) < 8 && Math.abs(r.right - pr.right) < 8 && pr.top - r.top < 200 * Z()) { fr = r; frEl = v; }
        });
        if (!fr || seen.indexOf(frEl) >= 0) return;
        seen.push(frEl);
        /* one size for every bar (Joel 2026-11-27: "premium… 跟 material & CMF… 的字體不統一 … 要成為統一規則"): the
           left text is the title, the others the description, sized by tokens.css --jcd-bar-title / --jcd-bar-sub; the
           description stays on one line (it grew the bar when it wrapped), growing leftwards so its right edge stays */
        var inBar = texts.filter(function (t) {
          var r = t.getBoundingClientRect(), tc = (r.top + r.bottom) / 2;
          return r.height && t.textContent.replace(/[\s​]/g, '') && tc > fr.top && tc < pr.top && r.left >= fr.left - 4 && r.right <= fr.right + 4;   /* empty blocks are not bar texts */
        }).sort(function (a, b) { return a.getBoundingClientRect().left - b.getBoundingClientRect().left; });
        inBar.forEach(function (t, i) {
          if (t.hasAttribute('data-jcd-bar-size')) return;
          t.setAttribute('data-jcd-bar-size', i ? 'sub' : 'title');
          [].forEach.call(t.querySelectorAll('[style]'), function (e) { e.style.removeProperty('font-size'); e.style.removeProperty('line-height'); });
          if (!i) return;
          var host = t.closest('[id^="comp-"]') || t, hr = host.getBoundingClientRect();
          var probe = document.createRange(); probe.selectNodeContents(t);
          var need = 0; [].forEach.call(t.querySelectorAll('p, h1, h2, h3, h4, h5, h6'), function (b) { b.style.setProperty('white-space', 'nowrap', 'important'); });
          [].forEach.call(probe.getClientRects(), function (q) { need = Math.max(need, q.width); });
          if (need > hr.width + 0.5) {
            var grow = need - hr.width + 2;
            host.style.setProperty('width', ((hr.width + grow) / Z()).toFixed(1) + 'px', 'important');
            host.style.setProperty('max-width', 'none', 'important');
            /* added to any offset the phone layout already gave it (it was replaced, which undid Joel's placement) */
            var tr = (getComputedStyle(host).translate || '').split(' ').map(parseFloat);
            host.style.setProperty('translate', (((tr[0] || 0) - grow / Z())).toFixed(1) + 'px ' + (tr[1] || 0) + 'px');
          }
        });
        /* (after the texts of the bar are known) one bar height for every bar (jcd-config.js catalogBars, Joel 2026-11-28: "文字框高度…都要一致"): the frame's top
           edge moves so the bar (frame top .. photo top) has the set height; its bottom stays. Not inside Joel's phone
           layout tool, where he sees the real positions. */
        if (B && !inTool) {
          var dlt = (pr.top - fr.top) - B.bar * Z();
          if (Math.abs(dlt) > 0.3 && Math.abs(dlt) < 20 * Z()) {
            if (getComputedStyle(frEl).position === 'static') setp(frEl, 'position', 'relative');
            setp(frEl, 'top', ((parseFloat(getComputedStyle(frEl).top) || 0) + dlt / Z()).toFixed(2) + 'px');
            setp(frEl, 'height', ((fr.height - dlt) / Z()).toFixed(2) + 'px', true);
            fr = frEl.getBoundingClientRect();
          }
        }
        /* the same distance from the frame's edges for every bar: title from the left, description from the right */
        if (B && !inTool && inBar.length) {
          var glyphs = function (t) { var g = document.createRange(); g.selectNodeContents(t);
            var rs = [].filter.call(g.getClientRects(), function (q) { return q.width > 0.5; }); return rs.length ? { l: Math.min.apply(null, rs.map(function (q) { return q.left; })), r: Math.max.apply(null, rs.map(function (q) { return q.right; })) } : null; };
          var nudge = function (t, dx) { if (Math.abs(dx) < 0.3) return; if (getComputedStyle(t).position === 'static') setp(t, 'position', 'relative');
            setp(t, 'left', ((parseFloat(getComputedStyle(t).left) || 0) + dx / Z()).toFixed(2) + 'px'); };
          /* the tagged title and description (an empty text block in the bar is not one of them) */
          var tT = inBar.filter(function (t) { return t.getAttribute('data-jcd-bar-size') === 'title'; })[0];
          var tS = inBar.filter(function (t) { return t.getAttribute('data-jcd-bar-size') === 'sub'; }).pop();
          var g0 = tT && glyphs(tT); if (g0) nudge(tT, fr.left + B.left * Z() - g0.l);
          var gl = tS && glyphs(tS); if (gl) nudge(tS, fr.right - B.right * Z() - gl.r);
        }
        pr = ph.getBoundingClientRect();
        var c = (fr.top + pr.top) / 2;
        texts.forEach(function (t) {
          var r = t.getBoundingClientRect(); if (!r.height) return;
          var tc = (r.top + r.bottom) / 2;
          /* the bar's own texts (found before its frame was resized), or any other text inside the bar */
          if (inBar.indexOf(t) < 0 && (tc <= fr.top || tc >= pr.top || r.left < fr.left - 4 || r.right > fr.right + 4)) return;
          var d = (c - tc) / Z();
          if (Math.abs(d) < 0.5 || Math.abs(d) > 30) return;
          /* added to the top it already has (spacing-phone.js moves whole groups with top; replacing it put Industrial's
             "Business Hardware Solutions" 178px above its bar, Joel 2026-11-28) */
          if (!t.hasAttribute('data-jcd-bar')) t.setAttribute('data-jcd-bar', t.style.top || '');
          t.style.top = ((parseFloat(t.getAttribute('data-jcd-bar')) || 0) + d).toFixed(2) + 'px';
        });
      });
    }
    function run() { centreBars(); }
    /* laid out again once the other phone layout scripts have finished moving things (Defense's photos move after load) */
    var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(run, 50); setTimeout(run, 900); setTimeout(run, 2200); }); };
    document.readyState === 'complete' ? go() : window.addEventListener('load', go);
  })();
