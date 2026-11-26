  /* Home "Selected" grid (12 works), Joel 2026-11-26, option B "spotlight" (design study preview/works-grid.html).
     Computer with a mouse: the tile under the mouse stays bright, its photo eases in 6% inside the frame, a thin white
     line frames it and its category + name + a round ">>" rise in at the bottom; the other 11 dim. Touch (phone +
     iPad): category + name always at the bottom-left with the round ">>" (as on the category pages), blue while
     pressed. Wix's 27% / 45% darkening overlay is switched off for this grid (site.js 5b). */
  ready(function () {
    var g = document.getElementById('pro-gallery-container-comp-mnpgav5j'); if (!g) return;
    var NAMES = {
      't-interceptormp': ['Defense', 'T-Interceptor MP'], 'moai-router': ['Networking', 'Dr. AI MoAI Router'],
      'airgain-fwa-easy-installation-kit': ['Networking', 'Airgain FWA Installation Kit'], 'ocean-series': ['ID Family', 'Ocean Series'],
      'interstellar05': ['Electronics', 'Interstellar 05'], 'sagittarius-laptop': ['Electronics', 'Sagittarius Laptop'],
      'wi-fi7-hgu-ap': ['Networking', 'Wi-Fi 7 HGU / AP'], 'zenfone-9': ['Electronics', 'Zenfone 9 Concept'],
      'nlg-mma200': ['Industrial', 'NLG MMA200'], 'wi-fi7-gaming-home-gateway': ['Networking', 'Wi-Fi 7 Gaming Home Gateway'],
      'defense': ['Defense', 'T. Guardian'], 'ai-tool-kit': ['Experimental', 'AI Design Tool Kit']
    };
    var touch = document.body.classList.contains('device-mobile-optimized') || window.__jcdTablet ||
                (window.matchMedia && matchMedia('(hover: none)').matches);
    g.classList.add('jcd-spot'); if (touch) g.classList.add('jcd-spot-touch');
    [].forEach.call(g.querySelectorAll('a.item-link-wrapper[data-jcd-link]'), function (a) {
      var item = a.querySelector('.gallery-item-container'), n = NAMES[a.getAttribute('data-jcd-link')]; if (!item || !n) return;
      var fx = document.createElement('div'); fx.className = 'jcd-spot-fx';
      fx.innerHTML = '<div class="jcd-spot-grad"></div><div class="jcd-spot-ring"></div><div class="jcd-foot"><span class="jcd-nm"><small></small></span><span class="jcd-go">&gt;&gt;</span></div>';
      fx.querySelector('small').textContent = n[0];
      fx.querySelector('.jcd-nm').appendChild(document.createTextNode(n[1]));
      item.appendChild(fx);
      if (touch) return;
      /* the spotlight moves to the tile under the mouse; in the gaps between tiles it stays where it was
         (Joel 2026-11-26: going through a gap made everything flash bright), and only leaving the grid clears it */
      a.addEventListener('mouseenter', function () {
        [].forEach.call(g.querySelectorAll('a.jcd-hot-tile'), function (o) { if (o !== a) o.classList.remove('jcd-hot-tile'); });
        g.classList.add('jcd-hot'); a.classList.add('jcd-hot-tile');
      });
    });
    if (!touch) g.addEventListener('mouseleave', function () {
      g.classList.remove('jcd-hot');
      [].forEach.call(g.querySelectorAll('a.jcd-hot-tile'), function (o) { o.classList.remove('jcd-hot-tile'); });
    });
  });

  /* Round ">>" (Joel 2026-11-26, 2nd pass): it fills blue gradually while the mouse is on its card (CSS); a click
     opens the page at once (the earlier "fill, then open 0.42s later" was dropped). */

