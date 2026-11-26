  ready(function () {
    /* Cross-Category grid (home, desktop + mobile): each of the two images holds 3x3 product tiles plus a
       category caption strip. We lay 9 tile hotspots over each image, sized to each tile's real picture area
       (measured from the image pixels, 1px inset so no black gutter shows). On hover a tile's own crop lifts
       slightly; a dim blue glow sits underneath it and only shows in the dark gutter around that tile, never
       over neighbouring products.
       Joel 2026-11-24: every tile with a product page links to it (one tap on touch: the lift/glow shows while the
       finger is down, then the page opens); tiles without a product page get no lift, no glow, no link.
       LINKS: 9 per image, row by row (top-left -> bottom-right); '' = no product page. Relative URLs work for both
       site/index.html and site/m/index.html (the phone page links to the phone versions). */
    var W = 1192, H = 1259;
    var GRID = {   /* [x0,x1) and [y0,y1) of each tile column / row, in image pixels */
      /* re-measured 2026-11-26 (Joel: black edges showed): exact photo areas between the black gutters */
      'comp-mv7qmnmm': { c: [[1, 384], [405, 789], [809, 1192]], r: [[0, 380], [398, 781], [801, 1185]] },
      'comp-mv7qmnmr': { c: [[3, 385], [405, 789], [808, 1191]], r: [[0, 380], [398, 782], [801, 1185]] }
    };
    var LINKS = {
      'comp-mv7qmnmm': [   /* Consumer Tech / Smart Home / Lifestyle & Wearable */
        ['interstellar05/index.html', 'Gaming PC Interstellar 05'], ['zenfone-9/index.html', 'Zenfone 9 Concept'], ['sagittarius-laptop/index.html', 'Laptop Sagittarius'],
        ['wi-fi7-gaming-home-gateway/index.html', 'Wi-Fi 7 Gaming Home Gateway'], ['wi-fi7-hgu-ap/index.html', 'Wi-Fi 7 Dual-Band AP'], ['wi-fi7-2022/index.html', 'Wi-Fi 7 2022 concept'],
        ['https://www.behance.net/gallery/124322077/Smoky-Tree', 'Humidifier Smoky Tree'], ['https://www.behance.net/gallery/91290285/AIRMP', 'Plant X Dehumidifier AIRMP'], ['speeder-pro-earbuds/index.html', 'Earbuds Speeder Pro']
      ],
      'comp-mv7qmnmr': [   /* Professional Equipment / Enterprise Solutions / Complex Systems */
        ['lionic-lionfilter-200/index.html', 'Lionic LionFilter 200'], ['nlg-mma200/index.html', 'NLG MMA 200'], ['', 'Advantech AIM 20 accessories'],
        ['', 'Gemtek X-Cell'], ['t-interceptormp/index.html', 'T. Interceptor MP'], ['t-blade/index.html', 'T. Blade'],
        ['moai-router/index.html', 'MoAI Router'], ['', 'Nichicon remote controller'], ['airgain-fwa-easy-installation-kit/index.html', 'Airgain FWA Easy Installation Kit']
      ]
    };
    var tiles = [];
    Object.keys(GRID).forEach(function (id) {
      var comp = document.getElementById(id), img = comp && comp.querySelector('img');
      if (!img) return;
      comp.classList.add('jcd-tilegrid');
      var setGutter = function () { comp.style.setProperty('--jcd-g', (9 * comp.clientWidth / W).toFixed(2) + 'px'); };
      setGutter(); window.addEventListener('resize', setGutter);
      var layer = document.createElement('div'); layer.className = 'jcd-tiles';
      var n = 0;
      GRID[id].r.forEach(function (r) { GRID[id].c.forEach(function (c) {
        var link = (LINKS[id] || [])[n++] || ['', ''];
        if (!link[0]) return;                                                /* no product page: no hotspot, no effect */
        var x0 = c[0] + 2, x1 = c[1] - 2, y0 = r[0] + 2, y1 = r[1] - 2;            /* 2px inset: never a black gutter in the lifted crop */
        var x = x0 / W, y = y0 / H, w = (x1 - x0) / W, h = (y1 - y0) / H;
        var t = document.createElement('a'); t.className = 'jcd-tile';
        t.href = link[0]; t.setAttribute('aria-label', link[1]);
        if (/^https?:/.test(link[0])) { t.target = '_blank'; t.rel = 'noopener'; }
        t.style.cssText = 'left:' + x * 100 + '%;top:' + y * 100 + '%;width:' + w * 100 + '%;height:' + h * 100 + '%';
        var halo = document.createElement('div'); halo.className = 'jcd-tile-halo';
        var crop = document.createElement('div'); crop.className = 'jcd-tile-img';
        crop.style.cssText = 'background-image:url("' + (img.currentSrc || img.src) + '");background-size:' + (100 / w) + '% ' + (100 / h) + '%;' +
          'background-position:' + (x / (1 - w) * 100) + '% ' + (y / (1 - h) * 100) + '%';
        t.appendChild(halo); t.appendChild(crop); layer.appendChild(t); tiles.push(t);
      }); });
      comp.appendChild(layer);
    });
    var touch = window.matchMedia && matchMedia('(hover: none)').matches;
    if (touch) tiles.forEach(function (t) {   /* finger down = lift + glow; moving the finger (scroll) cancels; tap opens the link */
      t.addEventListener('touchstart', function () { tiles.forEach(function (o) { o.classList.toggle('is-glow', o === t); }); }, { passive: true });
      ['touchmove', 'touchcancel'].forEach(function (ev) { t.addEventListener(ev, function () { t.classList.remove('is-glow'); }, { passive: true }); });
    });
    window.addEventListener('pageshow', function () { tiles.forEach(function (o) { o.classList.remove('is-glow'); }); });   /* back button */
  });

