  /* "JOEL CHANG" logo: its blue hover / pressed copy uses the page's own logo image as a mask (header-icons-hover.css; Joel 2026-11-27:
     "joel chang logo 點下去要有點擊感，跟隔壁菜單作法一樣"). Every page and platform. */
  ready(function () {
    [].forEach.call(document.querySelectorAll('#SITE_HEADER img[src*="shared-01-"]'), function (im) {
      var a = im.closest('a'); if (a) a.style.setProperty('--jcd-mask', 'url("' + im.src + '")');
    });
  });
