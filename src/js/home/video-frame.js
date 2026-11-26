  ready(function () {
    /* Home video: line the Vimeo player up exactly with the black window of its glow-frame image
       (comp-mp2fugu9; window measured from the image pixels: x 169-2576, y 137-1491 of 2734x1630),
       at exact 16:9 and 1px oversize, so the glow hugs the video with no dark ring. Desktop layout only. */
    /* Joel 2026-11-27: Interstellar 05's closing video gets the same glow frame treatment (breathing light + frame
       image dimming in step). One entry per video: player, glow-frame image, image size, black window in image px. */
    [{ vid: 'comp-moybizuw', frame: 'comp-mp2fugu9', W: 2734, H: 1630, x: 169, y: 137, w: 2407, h: 1354 },        /* home */
     { vid: 'comp-mp53344m2', frame: 'comp-mp53344l3', W: 2560, H: 1526, x: 157, y: 127, w: 2253, h: 1269 }       /* Interstellar 05 */
    ].forEach(function (V) {
      var vid = document.getElementById(V.vid), frame = document.getElementById(V.frame);
      var frameImg = frame && frame.querySelector('img');
      if (!vid || !frameImg) return;
      vid.classList.add('jcd-vbox'); frame.classList.add('jcd-vframe');
      var glow = null;
      var fit = function () {
        vid.style.transform = ''; vid.style.width = '';
        var fr = frameImg.getBoundingClientRect(), vr = vid.getBoundingClientRect();
        if (!fr.width) return;
        var s = Math.max(fr.width / V.W, fr.height / V.H);              /* object-fit: cover */
        var ox = fr.left + (fr.width - V.W * s) / 2, oy = fr.top + (fr.height - V.H * s) / 2;
        var bx = ox + V.x * s, by = oy + V.y * s, bw = V.w * s, bh = V.h * s;
        /* slight overscan (0.6% + 2px a side), then clipped back to the window: the player's own dark edge pixels never show
           (Joel 2026-11-26: black edges around the video) */
        var w = Math.max(bw, bh * 16 / 9) * 1.006 + 4, h = w * 9 / 16;
        var cx = bx + bw / 2, cy = by + bh / 2;
        var z = window.__jcdZoom || 1;   /* rects are screen px; styles are CSS px */
        vid.style.setProperty('width', w / z + 'px', 'important');
        vid.style.transform = 'translate(' + (cx - w / 2 - vr.left) / z + 'px,' + (cy - h / 2 - vr.top) / z + 'px)';
        vid.style.clipPath = 'inset(' + ((h - bh) / 2 / z).toFixed(2) + 'px ' + ((w - bw) / 2 / z).toFixed(2) + 'px)';
        /* breathing glow placed exactly on the window, under the video (CSS .jcd-vglow) */
        var host = vid.parentElement; if (!host) return;
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
        if (!glow) { glow = document.createElement('div'); glow.className = 'jcd-vglow'; host.insertBefore(glow, vid); }
        var hr = host.getBoundingClientRect();
        glow.style.left = ((bx - hr.left) / z).toFixed(1) + 'px'; glow.style.top = ((by - hr.top) / z).toFixed(1) + 'px';
        glow.style.width = (bw / z).toFixed(1) + 'px'; glow.style.height = (bh / z).toFixed(1) + 'px';
      };
      fit(); window.addEventListener('resize', fit); window.addEventListener('load', fit);
    });
  });

