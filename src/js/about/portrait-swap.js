  /* About intro photo (Joel 2026-11-26): Joel at the material wall; with the mouse on it, it cross-fades to the
     second portrait (about-06; new photo from Joel 2026-11-27, was the Golden Pin 2025 photo). Touch (phone, iPad): a tap switches to the second photo, another tap back. The frame
     takes the photos' ratio (2000x1425) in custom.css. */
  ready(function () {
    var img = document.getElementById('img_comp-mujmtw8h'); if (!img || !img.getAttribute('data-jcd-alt')) return;
    var comp = document.getElementById('comp-mujmtw8h');
    img.loading = 'eager'; img.removeAttribute('loading');
    var b = img.cloneNode(false); b.removeAttribute('id'); b.className = 'jcd-swap-b'; b.src = img.getAttribute('data-jcd-alt'); b.alt = '';
    b.removeAttribute('data-jcd-alt'); b.removeAttribute('srcset');
    var host = img.parentElement; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(b); comp.classList.add('jcd-swap');
    var touch = document.body.classList.contains('device-mobile-optimized') || window.__jcdTablet || (window.matchMedia && matchMedia('(hover: none)').matches);
    /* Joel 2026-11-27: touch = press and hold shows the colour photo, letting go returns to black-and-white
       (replaces the tap toggle). Long-press menu / image callout suppressed so holding works on iOS. */
    if (touch) { comp.classList.add('jcd-swap-touch');
      var on = function () { comp.classList.add('jcd-on'); }, off = function () { comp.classList.remove('jcd-on'); };
      comp.addEventListener('touchstart', on, { passive: true });
      ['touchend', 'touchcancel'].forEach(function (n) { comp.addEventListener(n, off, { passive: true }); });
      comp.addEventListener('pointerdown', on);
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { comp.addEventListener(n, off); });
      comp.addEventListener('contextmenu', function (e) { e.preventDefault(); }); }
  });

