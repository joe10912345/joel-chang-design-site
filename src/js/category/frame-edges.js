  /* Category pages: the white frames of one group share their left and right edges (Joel 2026-11-28: "手機板 industrial 跟
     lifestyle 的圖片有掉出白框…有些類別頁面的圖片左右有超出白框…筆電那張有凸出"). The Wix export placed a group's title frame,
     its product cards and the small 2-up photos 1-4px apart, so a card stuck out past the title frame above it (or a photo
     past the frame around it). Frames that touch or sit close above / below each other form a group; their left edges that
     lie within 8px of each other are moved onto one line (the one most of them already use; a tie goes to the widest
     frame), the same for the right edges. Each frame's component is shifted / resized by the difference. Phone, iPad,
     computer; again after a resize. */
  ready(function () {
    if (!/\/(networking|defense|electronics|industrial|lifestyle|experimental)\//.test(location.pathname)) return;
    /* Joel's own placements win (Joel 2026-11-28: "我親自調整"): not in his phone layout tool (?tool=), and on the phone
       a component he moved or sized there (jcd-config.js phone.layout) is left alone */
    if (/[?&]tool=/.test(location.search)) return;
    var phone = document.body.classList.contains('device-mobile-optimized');
    var slug = location.pathname.replace(/^.*\/m\//, '').replace(/(^|\/)index\.html$/, '').replace(/\/$/, '').split('/')[0];
    var own = phone ? (((window.JCD_CONFIG || {}).phone || {}).layout || {})[slug] || {} : {};
    var done = [];   /* [component, its own inline left, width] to restore before measuring again */
    function z() { return window.__jcdZoom || 1; }
    function frames() {
      return [].filter.call(document.querySelectorAll('#PAGES_CONTAINER *'), function (e) {
        var cs = getComputedStyle(e), r; if (!(parseFloat(cs.borderTopWidth) > 0)) return false;
        var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/.exec(cs.borderTopColor); if (!m || +m[1] < 200 || +m[2] < 200 || +m[3] < 200) return false;
        r = e.getBoundingClientRect(); return r.width > 60 && r.height > 20 && e.closest('[id^="comp-"]');
      });
    }
    function align() {
      done.forEach(function (d) {
        if (d[1]) d[0].style.setProperty('left', d[1]); else d[0].style.removeProperty('left');
        if (d[2]) d[0].style.setProperty('width', d[2]); else d[0].style.removeProperty('width');
      });
      done = [];
      var fs = frames().map(function (e) { var r = e.getBoundingClientRect(); return { e: e, c: e.closest('[id^="comp-"]'), l: r.left, r: r.right, t: r.top, b: r.bottom }; });
      /* groups: frames that overlap sideways and are less than 40px apart vertically (or one inside the other) */
      var g = fs.map(function (_, i) { return i; });
      function root(i) { while (g[i] !== i) i = g[i] = g[g[i]]; return i; }
      fs.forEach(function (a, i) { fs.forEach(function (b, j) {
        if (j <= i) return;
        var ox = Math.min(a.r, b.r) - Math.max(a.l, b.l), gap = Math.max(a.t, b.t) - Math.min(a.b, b.b);
        if (ox > 40 * z() && gap < 40 * z()) g[root(i)] = root(j);
      }); });
      var moves = new Map();   /* component -> { dl, dr } */
      var groups = {};
      fs.forEach(function (f, i) { (groups[root(i)] = groups[root(i)] || []).push(f); });
      Object.keys(groups).forEach(function (k) {
        var grp = groups[k]; if (grp.length < 2) return;
        ['l', 'r'].forEach(function (side) {
          var used = [];
          grp.forEach(function (f) {
            if (used.indexOf(f) >= 0) return;
            var near = grp.filter(function (o) { return used.indexOf(o) < 0 && Math.abs(o[side] - f[side]) < 8 * z(); });
            near.forEach(function (o) { used.push(o); });
            if (near.length < 2) return;
            /* the line most of them use (to 0.5px); a tie: the widest frame's */
            var votes = {}; near.forEach(function (o) { var v = Math.round(o[side] * 2) / 2; votes[v] = (votes[v] || 0) + 1; });
            var best = null; Object.keys(votes).forEach(function (v) { if (best === null || votes[v] > votes[best]) best = v; });
            var tied = Object.keys(votes).filter(function (v) { return votes[v] === votes[best]; });
            var line = tied.length > 1 ? near.slice().sort(function (a, b) { return (b.r - b.l) - (a.r - a.l); })[0][side] : +best;
            near.forEach(function (o) {
              var d = line - o[side]; if (Math.abs(d) < 0.3) return;
              var m = moves.get(o.c) || { dl: 0, dr: 0 }; m[side === 'l' ? 'dl' : 'dr'] = d; moves.set(o.c, m);
            });
          });
        });
      });
      moves.forEach(function (m, c) {
        var o = own[c.id]; if (o && (o.x || o.w)) return;
        var cs = getComputedStyle(c);
        done.push([c, c.style.getPropertyValue('left'), c.style.getPropertyValue('width')]);
        if (cs.position === 'static') c.style.position = 'relative';
        c.style.setProperty('left', ((parseFloat(cs.left) || 0) + m.dl / z()).toFixed(2) + 'px');
        c.style.setProperty('width', (c.getBoundingClientRect().width / z() + (m.dr - m.dl) / z()).toFixed(2) + 'px', 'important');
      });
    }
    function later() { setTimeout(align, 60); }
    if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
    setTimeout(align, 1600);
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(align, 250); });
  });
