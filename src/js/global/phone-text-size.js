  /* Phone: no text below a readable size (Joel 2026-11-27, UI/UX review item 1: "Fix 1-3 first"). The Wix phone
     layout set descriptions at 6-7px, shown about ×1.22 = 7-8.5pt; Apple's minimum is 11pt. Every text smaller than
     jcd-config.js phone.minText (paragraphs) / phone.minLabel (short labels) is raised to it, line height in step;
     Wix's grid rows grow with the text, so nothing below is covered. A word is never broken: in a narrow column the
     text grows only as far as its longest word still fits, and short labels of the same size in the same block stay
     the same size as each other (table headers, captions). Larger text is left alone. Phone pages only. */
  ready(function () {
    if (!document.body.classList.contains('device-mobile-optimized')) return;
    var P = (window.JCD_CONFIG && JCD_CONFIG.phone) || {}, minText = P.minText || 11, minLabel = P.minLabel || 9.5;
    var cv = document.createElement('canvas').getContext('2d'), plan = [], groups = {};
    [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER .wixui-rich-text, #PAGES_CONTAINER .wixui-rich-text *'), function (e) {
      var own = [].filter.call(e.childNodes, function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent; }).join(' ').trim();
      if (!own) return;
      var cs = getComputedStyle(e), fs = parseFloat(cs.fontSize);
      var cell = e.closest('.jcd-tc-cell'), blk = cell || e.closest('.wixui-rich-text');   /* a list cell (About) counts on its own */
      var para = cell ? [].indexOf.call(cell.parentElement.children, cell) % 2 === 1   /* lists: text column = text size, dates = label */
                      : blk.textContent.trim().length > 60;
      var want = para ? minText : minLabel;
      if (!(fs < want)) return;
      var bw = blk.getBoundingClientRect().width; if (!bw) return;
      cv.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily;
      var ls = parseFloat(cs.letterSpacing) || 0;
      var longest = own.split(/\s+/).reduce(function (a, t) { return Math.max(a, cv.measureText(t).width + ls * t.length); }, 0);
      var fit = longest > 0 ? fs * bw / longest * 0.98 : want;   /* largest size at which the longest word still fits */
      var nf = Math.min(want, Math.max(fs, fit));
      if (nf - fs < 0.2) return;
      var item = { e: e, fs: fs, nf: nf, lh: cs.lineHeight };
      plan.push(item);
      if (!para || bw < 130) {   /* short labels, and narrow columns (info tables: Client / Year / Designer / Contribution),
                                    of one size in one block: one common size, so a table stays uniform */
        var grid = blk.closest('[data-mesh-id$="gridContainer"], [data-testid="mesh-container-content"]');
        var key = fs + '|' + (grid ? (grid.getAttribute('data-mesh-id') || grid.parentElement.id) : '');
        (groups[key] = groups[key] || []).push(item); item.key = key;
      }
    });
    Object.keys(groups).forEach(function (k) {
      var m = Math.min.apply(null, groups[k].map(function (i) { return i.nf; }));
      groups[k].forEach(function (i) { i.nf = m; });
    });
    plan = plan.filter(function (i) { return i.nf - i.fs >= 0.2; });
    function size(i, f) {   /* f = 0: original, 1: planned size */
      var s = i.fs + (i.nf - i.fs) * f;
      if (!f) { i.e.style.removeProperty('font-size'); i.e.style.removeProperty('line-height'); return; }
      i.e.style.setProperty('font-size', s.toFixed(2) + 'px', 'important');
      if (/px$/.test(i.lh)) i.e.style.setProperty('line-height', (parseFloat(i.lh) * s / i.fs).toFixed(2) + 'px', 'important');
    }
    /* never run into something new (Joel 2026-11-27: "海洋系列文字好像有跟其他物件壓到了"): photos, videos, frames,
       buttons and other text the block did not touch before. Text meant to lie on a photo touched it before too. */
    var blocks = [];
    plan.forEach(function (i) { var b = i.e.closest('.jcd-tc-cell') || i.e.closest('.wixui-rich-text'); if (blocks.indexOf(b) < 0) blocks.push(b); i.b = b; });
    var others = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER img, #PAGES_CONTAINER video, #PAGES_CONTAINER .wixui-vector-image, #PAGES_CONTAINER .wixui-rich-text, #PAGES_CONTAINER button, #PAGES_CONTAINER .jcd-tc-cell'),
      function (o) { var r = o.getBoundingClientRect(); return r.width > 4 && r.height > 4; });
    function box(b) {   /* the text itself (its lines), not the Wix box around it */
      var r = { l: 1e9, t: 1e9, r: -1e9, b: -1e9 };
      [].forEach.call(b.querySelectorAll('*'), function (e) { if (![].some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })) return;
        [].forEach.call(e.getClientRects(), function (q) { if (!q.width) return; r.l = Math.min(r.l, q.left); r.t = Math.min(r.t, q.top); r.r = Math.max(r.r, q.right); r.b = Math.max(r.b, q.bottom); }); });
      return r.l < 1e9 ? r : null;
    }
    function hits(b) {
      var a = box(b); if (!a) return [];
      return others.filter(function (o) {
        if (o === b || o.contains(b) || b.contains(o)) return false;
        var q = o.getBoundingClientRect(); if (q.width < 4 || q.height < 4) return false;
        return q.left < a.r - 1 && q.right > a.l + 1 && q.top < a.b - 1 && q.bottom > a.t + 1;
      });
    }
    var before = blocks.map(hits);
    /* each section keeps the free space under its last item (Wix's grid gives the extra height to the text but takes it
       from that space: Ocean Series' "Designed by" ended up against the wave below) */
    var secs = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER section'), function (s) { return !s.parentElement.closest('section'); });
    function freeBelow(s) {
      var low = -1e9;
      [].forEach.call(s.querySelectorAll('.wixui-rich-text, img, video, .wixui-vector-image, button'), function (e) {
        if (e.closest('[id^="bgMedia_"]')) return;
        var r = e.getBoundingClientRect(); if (r.width > 4 && r.height > 4) low = Math.max(low, r.bottom);
        if (e.classList.contains('wixui-rich-text')) { var b = box(e); if (b) low = Math.max(low, b.b); }
      });
      return low > -1e9 ? s.getBoundingClientRect().bottom - low : null;
    }
    var free0 = secs.map(freeBelow);
    plan.forEach(function (i) { size(i, 1); });
    /* a block that runs into something steps back (halfway, then its original size); labels that belong together
       (one size, one block, e.g. a Client / Year / Designer table) step back together so they stay one size */
    plan.forEach(function (i) { if (!i.key) i.key = 'b' + blocks.indexOf(i.b); });
    var keyF = {};
    for (var pass = 0; pass < 3; pass++) {
      var bad = blocks.filter(function (b, k) { return hits(b).some(function (o) { return before[k].indexOf(o) < 0; }); });
      var keys = [];
      plan.forEach(function (i) { if (bad.indexOf(i.b) >= 0 && keyF[i.key] !== 0 && keys.indexOf(i.key) < 0) keys.push(i.key); });
      if (!keys.length) break;
      keys.forEach(function (k) { keyF[k] = keyF[k] == null ? 0.5 : 0; });
      plan.forEach(function (i) { if (keys.indexOf(i.key) >= 0) size(i, keyF[i.key]); });
    }
    secs.forEach(function (s, k) {
      var f1 = freeBelow(s); if (free0[k] == null || f1 == null || f1 >= free0[k] - 1) return;
      var g = s.querySelector('[data-mesh-id$="inlineContent-gridContainer"]') || s;
      g.style.setProperty('padding-bottom', ((parseFloat(getComputedStyle(g).paddingBottom) || 0) + free0[k] - f1).toFixed(1) + 'px', 'important');
    });
    window.dispatchEvent(new Event('resize'));   /* scripts that measure (spacing, bottom space, reveal) measure again */
  });
