  ready(function () {
    /* Header: slide up out of view when scrolling down, slide back when scrolling up; always shown at top.
       (Joel's design; live Wix only fades it out.) Not hidden while the Works dropdown or mobile menu is open. */
    var hdr = document.getElementById('SITE_HEADER');
    if (hdr) {
      hdr.classList.add('jcd-autohide');
      var lastY = window.scrollY, acc = 0, THRESH = 8;
      var menuOpen = function () {
        return !!(hdr.querySelector('li[data-shown]') || document.querySelector('#MENU_AS_CONTAINER.I_VSKP'));
      };
      var tick = false;
      var update = function () {
        tick = false;
        var y = window.scrollY, dy = y - lastY; lastY = y;
        if (y <= Math.max(10, hdr.offsetHeight * 0.5)) { hdr.classList.remove('jcd-hidden'); acc = 0; return; }
        if ((dy > 0) !== (acc > 0)) acc = 0;
        acc += dy;
        if (acc > THRESH && !menuOpen()) hdr.classList.add('jcd-hidden');
        else if (acc < -THRESH) hdr.classList.remove('jcd-hidden');
      };
      window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    }
  });

