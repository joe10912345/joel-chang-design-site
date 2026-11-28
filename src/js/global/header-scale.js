  /* Top header size (Joel 2026-11-28: "三個平台的頂部菜單與 logo 再縮小"): jcd-config.js headerScale for this platform becomes
     --jcd-header-scale on <html>; header-scale.css scales the logo group and the menu group (phone: the logo and the menu
     button) from their own edges, so they never meet. */
  (function () {
    var S = window.JCD_CONFIG && window.JCD_CONFIG.headerScale; if (!S) return;
    function set() {
      var h = document.documentElement, phone = document.body && document.body.classList.contains('device-mobile-optimized');
      var v = phone ? S.phone : h.classList.contains('jcd-tab-portrait') ? S.ipadPortrait : window.__jcdTablet ? S.ipadLandscape : S.desktop;
      if (v) h.style.setProperty('--jcd-header-scale', String(v));
      /* upward lift, same platform pick (Joel 2026-11-28: "能再靠上一點嗎") */
      var L = window.JCD_CONFIG.headerLift || {};
      var l = phone ? L.phone : h.classList.contains('jcd-tab-portrait') ? L.ipadPortrait : window.__jcdTablet ? L.ipadLandscape : L.desktop;
      h.style.setProperty('--jcd-header-lift', (l || 0) + 'px');
    }
    ready(set); window.addEventListener('orientationchange', function () { setTimeout(set, 120); }); window.addEventListener('resize', set);
  })();
