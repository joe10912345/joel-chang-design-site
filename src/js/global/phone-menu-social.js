  /* Phone menu: LinkedIn + Behance icons under the menu items (Joel 2026-11-24). The footer that held the only copy on
     m/ pages is hidden (custom.css), so its two icon links are cloned into the hamburger menu. */
  (function () {
    function addSocial() {
      var nav = document.getElementById('MENU_AS_CONTAINER_EXPANDABLE_MENU');
      if (!nav || nav.querySelector('.jcd-menu-social')) return;
      var links = document.querySelectorAll('#SITE_FOOTER a[href*="linkedin.com"], #SITE_FOOTER a[href*="behance.net"]');
      if (!links.length) return;
      var row = document.createElement('div'); row.className = 'jcd-menu-social';
      [].forEach.call(links, function (a) {
        var c = a.cloneNode(true); c.removeAttribute('id'); c.className = 'jcd-menu-social-a';
        var im = c.querySelector('img'); if (im) c.style.setProperty('--jcd-mask', 'url("' + im.src + '")');   /* blue pressed copy */
        [].forEach.call(c.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
        row.appendChild(c);
      });
      nav.appendChild(row);
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', addSocial) : addSocial();
  })();
