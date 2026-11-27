  /* Home "Achievements" numbers (10+, 15+, 30+, 8+, 3+): odometer roll (Joel 2026-11-26, option A of
     preview/achievement-counters.html). Each digit is a column that rolls up like a clock / odometer (units roll
     more turns than tens), fast then slow, and all stop on the real number; numbers start 0.15s apart, once, when
     they scroll into view. The digits keep Wix's font and size (column height = the measured digit height).
     Every platform; reduced motion = plain numbers. */
  ready(function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var nums = [];
    [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'), function (rt) {
      if (!/^\s*\d+\s*\+\s*$/.test(rt.textContent)) return;
      var w = document.createTreeWalker(rt, NodeFilter.SHOW_TEXT), tn, node = null;
      while ((tn = w.nextNode())) { if (/\d/.test(tn.nodeValue)) { node = tn; break; } }
      if (!node) return;
      var m = /^(\s*)(\d+)(.*)$/.exec(node.nodeValue); if (!m) return;
      var probe = document.createElement('span'); probe.textContent = m[2];
      node.parentNode.insertBefore(probe, node); node.nodeValue = m[1] + m[3];
      nums.push({ probe: probe, digits: m[2].split(''), cols: [] });
    });
    if (!nums.length) return;
    nums.forEach(function (n) {
      var wrap = document.createElement('span'); wrap.className = 'jcd-odo'; wrap.setAttribute('aria-label', n.digits.join(''));
      n.digits.forEach(function (d, k) {
        /* an invisible copy of the final digit gives the column its exact width + height in the real font (also after
           the web font arrives); the rolling strip sits on top and is clipped top/bottom only (2nd pass: digits were
           cut at the right when the width was measured) */
        var od = document.createElement('span'); od.className = 'jcd-odo-d';
        var sz = document.createElement('span'); sz.className = 'jcd-odo-s'; sz.textContent = d; od.appendChild(sz);
        var col = document.createElement('span'); col.className = 'jcd-odo-c'; col.setAttribute('aria-hidden', 'true');
        var total = (n.digits.length - k) * 10 + (+d);
        for (var j = 0; j <= total; j++) { var i = document.createElement('span'); i.textContent = j % 10; col.appendChild(i); }
        od.appendChild(col); wrap.appendChild(od); n.cols.push({ col: col, total: total });
      });
      var blk = n.probe.closest('h1,h2,h3,h4,h5,h6,p') || n.probe.parentNode; blk.style.whiteSpace = 'nowrap';
      n.probe.parentNode.replaceChild(wrap, n.probe);
    });
    function run() {
      nums.forEach(function (n, idx) {
        n.cols.forEach(function (c) {
          c.col.style.transitionDelay = (idx * 0.25) + 's';   /* 0.15 -> 0.25s apart, with the slower roll */
          c.col.style.transform = 'translateY(' + (-100 * c.total / (c.total + 1)).toFixed(4) + '%)';   /* % of the strip */
        });
      });
    }
    var target = nums[0].cols.length ? nums[0].cols[0].col.closest('section') : null;
    if (!('IntersectionObserver' in window) || !target) { run(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); setTimeout(run, 150); }
    }, { threshold: 0.25 });
    nums.forEach(function (n) { if (n.cols[0]) io.observe(n.cols[0].col.closest('.jcd-odo')); });
  });

