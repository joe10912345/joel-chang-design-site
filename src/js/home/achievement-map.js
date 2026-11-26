  /* Home "Achievement" world map (Joel 2026-11-26; design study preview/achievement-glow.html).
     All platforms: each map dot breathes and sends out a soft ring; a light that fades at head and tail runs along
     its line into the flag (one cycle 4.8s, the five countries in turn); when it arrives, the flag's round outline
     glows and a ring spreads out. Computer with a mouse only: hovering a country's line, dot, flag or one of its
     products enlarges that country's products + captions (cut from the same image into tiles), lights its line, keeps
     its dot and flag outline lit without motion and fades the other countries' effects. The overlay uses
     preserveAspectRatio "slice", i.e. the same cover-fit as the image, so it stays on the drawing at any crop.
     Coordinates are on the 1908x858 drawing (home-19-*-v2: Italy's dot moved up from north Africa). */
  ready(function () {
    var img = document.querySelector('#PAGES_CONTAINER img[src*="home-19-"][src*="-v2"]'); if (!img) return;
    var box = img.parentElement; box.classList.add('jcd-map');
    var IW = 1908, IH = 858, Y = 514, FLAG_Y = 570, R_FLAG = 19, DUR = 4.8, ARRIVE = 0.6;
    var LINKS = [
      { dot: [186, 331], flag: 366 },    /* USA    */
      { dot: [402, 271], flag: 834 },    /* Canada */
      { dot: [936, 300], flag: 1024 },   /* Italy  */
      { dot: [1632, 462], flag: 1446 },  /* Taiwan */
      { dot: [1756, 382], flag: 1794 }   /* Japan  */
    ];
    var NS = 'http://www.w3.org/2000/svg';
    function mk(parent, tag, attrs, style) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (style) e.setAttribute('style', style);
      parent.appendChild(e); return e;
    }
    var svg = mk(box, 'svg', { viewBox: '0 0 ' + IW + ' ' + IH, preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true', class: 'jcd-map-fx' });
    var defs = mk(svg, 'defs', {});
    defs.innerHTML =
      '<filter id="jcdMapGlow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="jcdMapBlur" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6"/></filter>' +
      '<radialGradient id="jcdMapSoft"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<mask id="jcdMapNoFlag" maskUnits="userSpaceOnUse" x="0" y="0" width="' + IW + '" height="' + IH + '"><rect width="' + IW + '" height="' + IH + '" fill="#fff"/>' +
      LINKS.map(function (l) { return '<circle cx="' + l.flag + '" cy="' + FLAG_Y + '" r="' + (R_FLAG + 2) + '" fill="#000"/>'; }).join('') + '</mask>';
    var groups = [];
    LINKS.forEach(function (l, i) {
      var x = l.dot[0], y = l.dot[1], fx = l.flag, begin = (i * 0.55).toFixed(2) + 's';
      var d = 'M' + x + ' ' + y + ' V' + Y + ' H' + fx + ' V' + (FLAG_Y - R_FLAG - 2);   /* stops at the flag's edge */
      var g = mk(svg, 'g', { class: 'jcd-map-c' }); groups.push(g);
      mk(g, 'circle', { cx: x, cy: y, r: 13, class: 'jcd-map-ring' }, 'animation-delay:' + begin);
      mk(g, 'circle', { cx: x, cy: y, r: 13, class: 'jcd-map-ring' }, 'animation-delay:calc(' + begin + ' + 1.6s)');
      mk(g, 'circle', { cx: x, cy: y, r: 11, class: 'jcd-map-core' }, 'animation-delay:' + begin);
      var mask = mk(g, 'mask', { id: 'jcdMapM' + i, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: IW, height: IH });
      var spot = mk(mask, 'circle', { r: 46, fill: 'url(#jcdMapSoft)', opacity: 0 });
      mk(spot, 'animateMotion', { path: d, dur: DUR + 's', begin: begin, repeatCount: 'indefinite', keyPoints: '0;1;1', keyTimes: '0;' + ARRIVE + ';1', calcMode: 'linear' });
      mk(spot, 'animate', { attributeName: 'opacity', dur: DUR + 's', begin: begin, repeatCount: 'indefinite', values: '0;1;1;0;0', keyTimes: '0;0.06;' + (ARRIVE - 0.04) + ';' + (ARRIVE + 0.03) + ';1' });
      var lit = mk(mk(g, 'g', { mask: 'url(#jcdMapNoFlag)', class: 'jcd-map-anim' }), 'g', { mask: 'url(#jcdMapM' + i + ')' });
      mk(lit, 'path', { d: d, class: 'jcd-map-soft' });
      mk(lit, 'path', { d: d, class: 'jcd-map-lit' });
      var a1 = ARRIVE - 0.02, a2 = ARRIVE + 0.06, a3 = ARRIVE + 0.3;
      var glow = mk(g, 'circle', { cx: fx, cy: FLAG_Y, r: R_FLAG + 1, class: 'jcd-map-fglow jcd-map-anim' });
      mk(glow, 'animate', { attributeName: 'opacity', dur: DUR + 's', begin: begin, repeatCount: 'indefinite', values: '0;0;1;.8;0;0', keyTimes: '0;' + a1 + ';' + a2 + ';' + (a2 + .1) + ';' + a3 + ';1' });
      mk(g, 'circle', { cx: fx, cy: FLAG_Y, r: R_FLAG + 1, class: 'jcd-map-fsteady' });
      var ring = mk(g, 'circle', { cx: fx, cy: FLAG_Y, r: R_FLAG + 1, class: 'jcd-map-fring jcd-map-anim' });
      mk(ring, 'animate', { attributeName: 'r', dur: DUR + 's', begin: begin, repeatCount: 'indefinite', values: (R_FLAG + 1) + ';' + (R_FLAG + 1) + ';' + (R_FLAG * 2.3) + ';' + (R_FLAG * 2.3), keyTimes: '0;' + a1 + ';' + (ARRIVE + 0.32) + ';1' });
      mk(ring, 'animate', { attributeName: 'opacity', dur: DUR + 's', begin: begin, repeatCount: 'indefinite', values: '0;0;.6;0;0', keyTimes: '0;' + a1 + ';' + (ARRIVE + 0.03) + ';' + (ARRIVE + 0.32) + ';1' });
    });
    /* run only while the map is on screen */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting;
        try { on ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) {}
        box.classList.toggle('jcd-map-paused', !on);
      }).observe(box);
    }

    /* computer with a mouse only (not the phone page, not iPads) */
    var mobilePage = document.body.classList.contains('device-mobile-optimized');
    if (mobilePage || window.__jcdTablet || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var ROW = [598, 842];
    var COLS = [[33,181],[220,363],[405,540],[580,726],[789,891],[990,1068],[1192,1318],[1338,1481],[1512,1667],[1718,1887]];
    var OF = [[0,1,2,3],[4],[5],[6,7,8],[9]];   /* USA: AT&T Gfiber Rigado Ciena | Canada: Cogeco | Italy: Adant | Taiwan: Gemtek Lionic NCSIST | Japan: Genix */
    box.classList.add('jcd-map-tiles');          /* CSS hides the product row of the image; the tiles show it */
    var tiles = COLS.map(function (c) {
      var x0 = c[0] - 12, x1 = c[1] + 12, w = x1 - x0, h = ROW[1] - ROW[0];
      var t = document.createElement('div'); t.className = 'jcd-map-tile';
      t.style.cssText = 'left:' + (x0 / IW * 100) + '%;top:' + (ROW[0] / IH * 100) + '%;width:' + (w / IW * 100) + '%;height:' + (h / IH * 100) + '%';
      var im = document.createElement('img'); im.src = img.getAttribute('src'); im.alt = ''; im.draggable = false;
      im.style.cssText = 'width:' + (IW / w * 100) + '%;left:' + (-x0 / w * 100) + '%;top:' + (-ROW[0] / h * 100) + '%';
      t.appendChild(im); box.insertBefore(t, svg); return t;
    });
    LINKS.forEach(function (l, i) {
      var x = l.dot[0], y = l.dot[1], fx = l.flag;
      var d = 'M' + x + ' ' + y + ' V' + Y + ' H' + fx + ' V' + (FLAG_Y - R_FLAG - 2);
      var line = mk(svg, 'path', { d: d, class: 'jcd-map-hline', mask: 'url(#jcdMapNoFlag)' });
      var parts = [mk(svg, 'path', { d: d, class: 'jcd-map-hit' }), mk(svg, 'circle', { cx: x, cy: y, r: 26, class: 'jcd-map-hitdot' }),
                   mk(svg, 'circle', { cx: fx, cy: FLAG_Y, r: 28, class: 'jcd-map-hitdot' })];
      OF[i].forEach(function (k) { parts.push(tiles[k]); });
      function set(on) {
        OF[i].forEach(function (k) { tiles[k].classList.toggle('on', on); });
        line.classList.toggle('on', on);
        groups.forEach(function (g, k) { g.classList.toggle('dim', on && k !== i); g.classList.toggle('sel', on && k === i); });
      }
      parts.forEach(function (p) {
        p.addEventListener('mouseenter', function () { set(true); });
        p.addEventListener('mouseleave', function () { set(false); });
      });
    });
  });

