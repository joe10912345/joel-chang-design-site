  /* Catalog title bars (Joel 2026-11-24): each card on the category pages is a white outline (vector) with a title bar
     above the photo: title on the left, a short description on the right. Wix placed the right text a few px too low
     (e.g. Lifestyle "Atmosphere & Daily Experience" nearly touches the photo). Every text inside a bar is moved so its
     vertical centre sits on the bar's centre (bar = outline top .. photo top). Desktop, iPad and phone. Uses `top`
     (the texts are position:relative), so tilt.js transforms are untouched. */
  (function () {
    function Z() { return window.__jcdZoom || 1; }
    function centreBars() {
      var photos = document.querySelectorAll('.gpDCD5');
      if (!photos.length) return;
      var texts = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'));
      var frames = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER .wixui-vector-image'));
      texts.forEach(function (t) { if (t.hasAttribute('data-jcd-bar')) { t.style.top = ''; } });
      [].forEach.call(photos, function (ph) {
        var pr = ph.getBoundingClientRect(); if (!pr.width) return;
        var fr = null;
        frames.forEach(function (v) {
          var r = v.getBoundingClientRect();
          if (r.top < pr.top - 8 && r.bottom >= pr.bottom - 4 && Math.abs(r.left - pr.left) < 8 && Math.abs(r.right - pr.right) < 8 && pr.top - r.top < 200 * Z()) fr = r;
        });
        if (!fr) return;
        var c = (fr.top + pr.top) / 2;
        texts.forEach(function (t) {
          var r = t.getBoundingClientRect(); if (!r.height) return;
          var tc = (r.top + r.bottom) / 2;
          if (tc <= fr.top || tc >= pr.top || r.left < fr.left - 4 || r.right > fr.right + 4) return;
          var d = (c - tc) / Z();
          if (Math.abs(d) < 0.5 || Math.abs(d) > 30) return;
          t.setAttribute('data-jcd-bar', ''); t.style.top = d.toFixed(2) + 'px';
        });
      });
    }
    function run() { centreBars(); }
    var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(run, 50); }); };
    document.readyState === 'complete' ? go() : window.addEventListener('load', go);
  })();
