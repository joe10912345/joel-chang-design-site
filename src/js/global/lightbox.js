  ready(function () {
    /* Lightbox (click to enlarge): only on galleries that have Wix's fullscreen view on the live site
       (build.py marks them with data-jcd-lightbox and gives each item data-jcd-full). */
    var lbGals = document.querySelectorAll('[data-jcd-lightbox]');
    if (lbGals.length) {
      var lb = document.createElement('div'); lb.className = 'jcd-lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-hidden', 'true');
      lb.innerHTML = '<div class="jcd-lb-stage"><img class="jcd-lb-img" alt=""></div>' +
        '<button class="jcd-lb-btn jcd-lb-close" aria-label="Close">&#x2715;</button>' +
        '<button class="jcd-lb-btn jcd-lb-prev" aria-label="Previous image">&#x2039;</button>' +
        '<button class="jcd-lb-btn jcd-lb-next" aria-label="Next image">&#x203A;</button>' +
        '<div class="jcd-lb-count"></div>';
      document.body.appendChild(lb);
      var lbImg = lb.querySelector('.jcd-lb-img'), lbCount = lb.querySelector('.jcd-lb-count');
      var list = [], idx = 0, lastFocus = null;
      var showImg = function (i) {
        idx = (i + list.length) % list.length;
        lbImg.classList.remove('is-in');
        var src = list[idx], pre = new Image();
        pre.onload = pre.onerror = function () { if (list[idx] !== src) return; lbImg.src = src; requestAnimationFrame(function () { lbImg.classList.add('is-in'); }); };
        pre.src = src;
        lbCount.textContent = (idx + 1) + ' / ' + list.length;
        lb.classList.toggle('jcd-lb-single', list.length < 2);
      };
      var open = function (gal, item) {
        var items = Array.prototype.slice.call(gal.querySelectorAll('[data-jcd-full]'));
        list = items.map(function (it) { return it.getAttribute('data-jcd-full'); });
        lastFocus = document.activeElement;
        lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('jcd-lb-lock');
        showImg(Math.max(0, items.indexOf(item)));
        lb.querySelector('.jcd-lb-close').focus({ preventScroll: true });
      };
      var close = function () {
        lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('jcd-lb-lock');
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      };
      Array.prototype.forEach.call(lbGals, function (gal) {
        /* capture phase on the gallery, so it runs before the hover-overlay tap logic in site.js */
        gal.addEventListener('click', function (e) {
          var item = e.target.closest && e.target.closest('[data-jcd-full]');
          if (!item || e.target.closest('[data-hook="nav-arrow-next"],[data-hook="nav-arrow-prev"],.nav-arrows-container')) return;
          e.preventDefault(); e.stopPropagation(); open(gal, item);
        }, true);
        Array.prototype.forEach.call(gal.querySelectorAll('[data-jcd-full]'), function (it) { it.style.cursor = 'zoom-in'; });
      });
      lb.querySelector('.jcd-lb-close').addEventListener('click', close);
      lb.querySelector('.jcd-lb-prev').addEventListener('click', function (e) { e.stopPropagation(); showImg(idx - 1); });
      lb.querySelector('.jcd-lb-next').addEventListener('click', function (e) { e.stopPropagation(); showImg(idx + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('jcd-lb-stage')) close(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') showImg(idx - 1); else if (e.key === 'ArrowRight') showImg(idx + 1);
      });
      var sx = null, sy = 0;
      lb.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
      lb.addEventListener('touchend', function (e) {
        if (sx === null) return; var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showImg(idx + (dx < 0 ? 1 : -1));
        else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) close();
      });
    }
  });

