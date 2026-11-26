
  /* Wix "fixed" section backgrounds -> photo pinned to its own section (Joel 2026-11-25: the last image of many pages
     was cut at the bottom, e.g. Wi-Fi 7 2022 "New Wi-Fi 7 Generation"). Wix made these photos sticky and screen-sized,
     so a section taller than the screen never showed the photo's bottom, and on the phone a 300px section showed less
     than half of a 693px photo. Every sticky/fixed section photo now covers exactly its section (object-fit: cover),
     and its media box no longer clips (iPad Safari). Runs first, before the top-image script measures heights.
     29 photos at the time (desktop + phone); About "What I Believe" / Gaming "Aerodynamic" were already pinned in CSS. */
  ready(function () {
    [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER wow-image[id^="img_"]'), function (wi) {
      var pos = getComputedStyle(wi).position; if (pos !== 'sticky' && pos !== 'fixed') return;
      var media = wi.parentElement;
      if (media && /^bgMedia_/.test(media.id || '')) {
        media.style.setProperty('top', '0', 'important'); media.style.setProperty('height', '100%', 'important');
        media.style.setProperty('overflow', 'visible', 'important');
      }
      ['position:absolute', 'top:0', 'left:0', 'width:100%', 'height:100%', 'transform:none'].forEach(function (d) {
        var kv = d.split(':'); wi.style.setProperty(kv[0], kv[1], 'important'); });
      var img = wi.querySelector('img');
      if (img) { img.style.setProperty('width', '100%', 'important'); img.style.setProperty('height', '100%', 'important'); img.style.setProperty('object-fit', 'cover', 'important'); }
      wi.setAttribute('data-jcd-pinned', '');
    });
  });

