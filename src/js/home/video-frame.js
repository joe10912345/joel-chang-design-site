  ready(function () {
    /* Home video: line the Vimeo player up exactly with the black window of its glow-frame image
       (comp-mp2fugu9; window measured from the image pixels: x 169-2576, y 137-1491 of 2734x1630),
       at exact 16:9 and 1px oversize, so the glow hugs the video with no dark ring. Desktop layout only. */
    var vid = document.getElementById('comp-moybizuw'), frame = document.getElementById('comp-mp2fugu9');
    var frameImg = frame && frame.querySelector('img');
    if (vid && frameImg) {
      var fit = function () {
        vid.style.transform = ''; vid.style.width = '';
        var fr = frameImg.getBoundingClientRect(), vr = vid.getBoundingClientRect();
        if (!fr.width) return;
        var s = Math.max(fr.width / 2734, fr.height / 1630);              /* object-fit: cover */
        var ox = fr.left + (fr.width - 2734 * s) / 2, oy = fr.top + (fr.height - 1630 * s) / 2;
        var bx = ox + 169 * s, by = oy + 137 * s, bw = 2407 * s, bh = 1354 * s;
        /* slight overscan (0.6% + 2px a side), then clipped back to the window: the player's own dark edge pixels never show
           (Joel 2026-11-26: black edges around the video) */
        var w = Math.max(bw, bh * 16 / 9) * 1.006 + 4, h = w * 9 / 16;
        var cx = bx + bw / 2, cy = by + bh / 2;
        var z = window.__jcdZoom || 1;   /* rects are screen px; styles are CSS px */
        vid.style.setProperty('width', w / z + 'px', 'important');
        vid.style.transform = 'translate(' + (cx - w / 2 - vr.left) / z + 'px,' + (cy - h / 2 - vr.top) / z + 'px)';
        vid.style.clipPath = 'inset(' + ((h - bh) / 2 / z).toFixed(2) + 'px ' + ((w - bw) / 2 / z).toFixed(2) + 'px)';
        /* moving glow: a blue ring that slowly turns around the window and breathes (custom.css .jcd-vglow) */
        var host = vid.parentElement; if (!host) return;
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
        if (!glow) { glow = document.createElement('div'); glow.className = 'jcd-vglow'; host.insertBefore(glow, vid); }
        var hr = host.getBoundingClientRect();
        glow.style.left = ((bx - hr.left) / z).toFixed(1) + 'px'; glow.style.top = ((by - hr.top) / z).toFixed(1) + 'px';
        glow.style.width = (bw / z).toFixed(1) + 'px'; glow.style.height = (bh / z).toFixed(1) + 'px';
      };
      var glow = null;
      fit(); window.addEventListener('resize', fit); window.addEventListener('load', fit);
    }
  });

