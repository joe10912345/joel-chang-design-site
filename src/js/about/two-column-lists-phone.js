  /* About, phone: the five two-column lists (Work Experience, Education, Languages, Selected Awards, Patents) as real
     rows (Joel 2026-11-27, UI/UX review item 1). In Wix each list is two separate text blocks, dates on the left, text
     on the right, and the rows only lined up because both used the same tiny line spacing; with readable text sizes
     (phone-text-size.js) the columns wrap differently and drift apart. Here each list becomes one grid: one row per
     entry, date cell + text cell, so a row is as tall as its taller cell and the two always line up. The entries are
     copied with their own markup (fonts, colours, the "Present" glow). Same look as before: dates left, text right.
     Runs before phone-text-size.js. A list whose two sides don't split into the same number of entries is left as is. */
  ready(function () {
    if (!document.body.classList.contains('device-mobile-optimized') || !/\/about\//.test(location.pathname)) return;
    var ZW = /^[\s​ ]*$/;
    /* split a rich-text block into entries (separated by blank lines) and return each entry's content as a fragment */
    function entries(rich) {
      var block = rich.querySelector('h1, h2, h3, h4, h5, h6, p') || rich, lines = [[]], cur = lines[0];
      var w = document.createTreeWalker(block, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n;
      while ((n = w.nextNode())) {
        if (n.nodeType === 1 && n.tagName === 'BR') { cur = []; lines.push(cur); }
        else if (n.nodeType === 3) cur.push(n);
      }
      var out = [], group = null;
      lines.forEach(function (ln) {
        var txt = ln.map(function (t) { return t.textContent; }).join('');
        if (ZW.test(txt)) { group = null; return; }
        if (!group) { group = { first: ln[0], nodes: [] }; out.push(group); }
        group.last = ln[ln.length - 1]; group.nodes = group.nodes.concat(ln);
      });
      return out.map(function (g) {
        /* Wix scopes text colours and fonts to each block's own id, so they would be lost once moved: every piece of
           text in the copy carries its original computed look inline */
        var looks = g.nodes.map(function (t) { var cs = getComputedStyle(t.parentElement);
          return { color: cs.color, 'font-family': cs.fontFamily, 'font-weight': cs.fontWeight, 'font-style': cs.fontStyle,
                   'font-size': cs.fontSize, 'letter-spacing': cs.letterSpacing, 'text-transform': cs.textTransform }; });
        var r = document.createRange(); r.setStart(g.first, 0); r.setEnd(g.last, g.last.textContent.length);
        var shell = block.cloneNode(false); shell.removeAttribute('id'); shell.appendChild(r.cloneContents());
        var tw = document.createTreeWalker(shell, NodeFilter.SHOW_TEXT), copies = [], t;
        while ((t = tw.nextNode())) copies.push(t);
        copies.forEach(function (c, i) {
          var look = looks[i]; if (!look) return;
          var s = document.createElement('span'); s.className = 'wixui-rich-text__text';
          Object.keys(look).forEach(function (k) { s.style.setProperty(k, look[k]); });
          c.parentNode.insertBefore(s, c); s.appendChild(c);
        });
        return shell;
      });
    }
    var rich = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER .wixui-rich-text'), function (t) { return t.getBoundingClientRect().width > 0; });
    rich.forEach(function (L) {
      var lr = L.getBoundingClientRect();
      /* its partner: the text block starting on the same line, further right, in the same grid */
      var R = rich.filter(function (t) { var r = t.getBoundingClientRect();
        return t !== L && t.parentElement === L.parentElement && Math.abs(r.top - lr.top) < 3 && r.left > lr.left + 30; })[0];
      if (!R || L.__jcdDone || R.__jcdDone) return;
      var a = entries(L), b = entries(R);
      if (a.length < 2 || a.length !== b.length) return;
      var rr = R.getBoundingClientRect(), z = window.__jcdZoom || 1;
      var grid = document.createElement('div'); grid.className = 'jcd-tc';
      grid.style.gridTemplateColumns = ((rr.left - lr.left) / z - 8).toFixed(1) + 'px 1fr';
      a.forEach(function (x, i) {
        var c1 = document.createElement('div'); c1.className = 'jcd-tc-cell'; c1.appendChild(x);
        var c2 = document.createElement('div'); c2.className = 'jcd-tc-cell'; c2.appendChild(b[i]);
        grid.appendChild(c1); grid.appendChild(c2);
      });
      var host = L.closest('[id^="comp-"]') || L;
      host.style.setProperty('width', ((rr.right - lr.left) / z).toFixed(1) + 'px', 'important');   /* now spans both columns */
      while (L.firstChild) L.removeChild(L.firstChild);
      L.appendChild(grid);
      (R.closest('[id^="comp-"]') || R).style.setProperty('display', 'none', 'important');
      L.__jcdDone = R.__jcdDone = true;
    });
  });
