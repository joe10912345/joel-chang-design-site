  /* iPhone: no zoom-in when a Contact field is tapped (Joel 2026-11-26 wants 11px field text on the phone). iOS
     zooms the page when a field's text is smaller than 16px on screen; capping the viewport's maximum-scale at the
     page's own fit-to-width scale stops that. iOS still lets people pinch-zoom by hand. Phone pages with a form only. */
  ready(function () {
    if (!/iPhone|iPod/.test(navigator.userAgent)) return;
    if (!document.querySelector('#PAGES_CONTAINER input, #PAGES_CONTAINER textarea')) return;
    var vp = document.querySelector('meta[name="viewport"]'); if (!vp) return;
    var m = /width=(\d+)/.exec(vp.getAttribute('content') || ''); if (!m) return;   /* phone page: width=320 */
    var W = +m[1];
    function cap() {
      var land = Math.abs(window.orientation || 0) === 90;
      var ideal = land ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
      vp.setAttribute('content', 'width=' + W + ', maximum-scale=' + (ideal / W + 0.001).toFixed(4));
    }
    cap(); window.addEventListener('orientationchange', function () { setTimeout(cap, 200); });
  });

