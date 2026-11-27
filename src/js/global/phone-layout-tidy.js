  /* Phone: tidy text next to photos (Joel 2026-11-27: "排版要調整，圖與字與間距怪怪的" — MoAI materials, HGU/AP).
     Runs before phone-text-size.js, so text is sized inside the corrected boxes.
     (1) A short title right above its paragraph, starting at the same left edge but narrower (MoAI "Pebble Gray": 54px
         box over a 163px paragraph, so it broke onto two lines), gets the paragraph's width.
     (2) A text block beside a photo keeps at least GAP px from it: Wix let some text boxes run into the photo next to them
         (HGU/AP "Minimal UI" 30px into the router photo, the "Form follows flow" quote touching the sea anemone). The box is
         narrowed on that side. Text meant to lie ON a photo (inside it, or more than a third over it) is left alone; left-aligned text only. Phone pages only. */
  ready(function () {
    if (!document.body.classList.contains('device-mobile-optimized')) return;
    var GAP = 12;
    var texts = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'), function (t) {
      if (t.closest('.jcd-info2x2, .jcd-tc, [id^="bgMedia_"]')) return false;
      /* left-aligned text only: a centred or right-aligned block would move if its box changed */
      var al = getComputedStyle(t.querySelector('p, h1, h2, h3, h4, h5, h6') || t).textAlign;
      if (!/^(left|start|justify)$/.test(al)) return false;
      var r = t.getBoundingClientRect(); return r.width > 20 && r.height > 4;
    });
    function host(t) { return t.closest('[id^="comp-"]') || t; }
    function setW(el, w) { el.style.setProperty('width', w.toFixed(1) + 'px', 'important'); el.style.setProperty('max-width', 'none', 'important'); }
    /* (1) titles as wide as their paragraph */
    texts.forEach(function (t) {
      var tr = t.getBoundingClientRect(); if (t.textContent.trim().length > 40) return;
      var below = texts.filter(function (b) { if (b === t) return false; var r = b.getBoundingClientRect();
        return Math.abs(r.left - tr.left) < 3 && r.top >= tr.bottom - 4 && r.top - tr.bottom < 24 && r.width > tr.width + 8 && b.textContent.trim().length > 40; })[0];
      if (below) { setW(host(t), below.getBoundingClientRect().width); host(t).setAttribute('data-jcd-tidy', 'title'); }
    });
    /* (2) keep clear of the photo beside it */
    var pics = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER img, #PAGES_CONTAINER video'), function (p) {
      if (p.closest('[id^="bgMedia_"], .jcd-info2x2')) return false;
      var r = p.getBoundingClientRect(); return r.width > 40 && r.height > 40;
    }).map(function (p) { return (p.closest('[id^="comp-"]') || p).getBoundingClientRect(); });
    texts.forEach(function (t) {
      var h = host(t), r = h.getBoundingClientRect();
      pics.forEach(function (q) {
        if (q.top >= r.bottom - 2 || q.bottom <= r.top + 2) return;          /* not beside it */
        if (r.left >= q.left - 1 && r.right <= q.right + 1) return;          /* text on the photo: meant so */
        /* mostly over the photo (MoAI "Speckled Effect Texture" over the fading stone photo): a deliberate overlap, keep */
        var over = Math.min(r.right, q.right) - Math.max(r.left, q.left);
        if (over > r.width * 0.35) return;
        if (r.left < q.left && r.right > q.left - GAP) {                     /* text left of the photo */
          var w = q.left - GAP - r.left; if (w >= 70) { setW(h, w); h.setAttribute('data-jcd-tidy', 'gap'); r = h.getBoundingClientRect(); }
        } else if (r.right > q.right && r.left < q.right + GAP) {            /* text right of the photo */
          var d = q.right + GAP - r.left, w2 = r.width - d;
          if (w2 >= 70) { h.style.setProperty('translate', d.toFixed(1) + 'px 0'); setW(h, w2); h.setAttribute('data-jcd-tidy', 'gap'); r = h.getBoundingClientRect(); }
        }
      });
    });
  });
