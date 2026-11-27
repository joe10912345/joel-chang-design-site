  /* Phone product pages: the info table (Client / Year / Designer / Contribution) as 2 x 2 (Joel 2026-11-27: chose B of
     preview/mockups/info-table-phone.html, "但要注意下方文字與黑底要留有空間"). In Wix it is four text blocks side by side,
     20-63px wide, so its text could only be 6-9px. Here the four blocks move into one grid the page's width (20px
     margins): Client | Year, Designer | Contribution, each cell ~130px; label and content 9px (jcd-config.js phone.minLabel), the
     content grey (Joel: "產品資訊表文字可以字體縮小變灰色"). Each line keeps its own font, weight and colour (copied from the page, because
     Wix scopes them to the block's id). The black box below keeps at least the space it had under the table, never less
     than 28px. Runs before phone-text-size.js. */
  ready(function () {
    if (!document.body.classList.contains('device-mobile-optimized')) return;
    var P = (window.JCD_CONFIG && JCD_CONFIG.phone) || {}, fLab = P.minLabel || 9;
    var rich = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER .wixui-rich-text'));
    var lab = rich.filter(function (x) { return /^\s*Contribution\b/.test(x.textContent) && x.getBoundingClientRect().width > 0; })[0];
    if (!lab) return;
    var lt = lab.getBoundingClientRect().top;
    var cells = rich.filter(function (x) { return Math.abs(x.getBoundingClientRect().top - lt) < 4 && x.parentElement && x.getBoundingClientRect().width > 0; })
      .sort(function (a, b) { return a.getBoundingClientRect().left - b.getBoundingClientRect().left; })
      .map(function (x) { return x.closest('[id^="comp-"]') || x; });
    if (cells.length !== 4 || !/^\s*Client/.test(cells[0].textContent)) return;
    /* the box around the table (its grid) and the free space under the table's lowest text */
    var grid = cells[0].parentElement, box = grid.closest('[id^="comp-"]') || grid;
    function lowest() { return Math.max.apply(null, cells.map(function (c) { return c.getBoundingClientRect().bottom; })); }
    var free0 = box.getBoundingClientRect().bottom - lowest();
    var first = cells[0], cs = getComputedStyle(first), wrap = document.createElement('div');
    wrap.className = 'jcd-info2x2';
    ['gridArea', 'marginTop', 'marginLeft', 'alignSelf', 'justifySelf'].forEach(function (p) { wrap.style[p] = cs[p]; });
    first.parentElement.insertBefore(wrap, first);
    cells.forEach(function (c) {
      wrap.appendChild(c);
      c.style.setProperty('max-width', 'none', 'important');
      var reset = { 'grid-area': 'auto', margin: '0', width: 'auto', height: 'auto', 'min-height': '0', left: 'auto', top: 'auto', position: 'relative', transform: 'none' };
      Object.keys(reset).forEach(function (p) { c.style.setProperty(p, reset[p], 'important'); });
      var rt = c.matches('.wixui-rich-text') ? c : c.querySelector('.wixui-rich-text'); if (!rt) return;
      rt.style.setProperty('width', 'auto', 'important');
      /* every non-empty line with its own look; the first is the label */
      var tw = document.createTreeWalker(rt, NodeFilter.SHOW_TEXT), t, lines = [];
      while ((t = tw.nextNode())) {
        var s = t.textContent.replace(/[​\s]+/g, ' ').trim(); if (!s) continue;
        var q = getComputedStyle(t.parentElement);
        lines.push({ s: s, look: { 'font-family': q.fontFamily, 'font-weight': q.fontWeight, 'font-style': q.fontStyle, color: q.color, 'letter-spacing': q.letterSpacing } });
      }
      if (!lines.length) return;
      while (rt.firstChild) rt.removeChild(rt.firstChild);
      lines.forEach(function (l, i) {
        var d = document.createElement('div'); d.className = i ? 'jcd-info-val' : 'jcd-info-lab'; d.textContent = l.s;
        Object.keys(l.look).forEach(function (k) { d.style.setProperty(k, l.look[k]); });
        d.style.setProperty('font-size', fLab + 'px', 'important');
        if (i) d.style.setProperty('color', 'rgba(255, 255, 255, .6)', 'important');   /* content grey (7.4:1 on black) */
        rt.appendChild(d);
      });
    });
    /* the same 20px margins as the page text */
    var pw = document.documentElement.clientWidth, dx = 20 - wrap.getBoundingClientRect().left;
    wrap.style.marginLeft = ((parseFloat(getComputedStyle(wrap).marginLeft) || 0) + dx) + 'px';
    wrap.style.width = (pw - 40) + 'px';
    /* room under the table inside its black box */
    var want = Math.max(free0, 28), free1 = box.getBoundingClientRect().bottom - lowest();
    if (free1 < want - 0.5) {
      var g = box.querySelector('[data-mesh-id$="inlineContent-gridContainer"]') || grid;
      g.style.setProperty('padding-bottom', ((parseFloat(getComputedStyle(g).paddingBottom) || 0) + want - free1).toFixed(1) + 'px', 'important');
    }
    window.dispatchEvent(new Event('resize'));
  });
