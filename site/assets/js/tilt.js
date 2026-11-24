/* tilt.js - catalog cards follow the mouse with a gentle 3D tilt (Joel 2026-11-24).
   Category pages only, desktop pointer only; off on m/ pages, touch and prefers-reduced-motion.
   A "card" is the photo tile (Wix hover box) plus, when it has one, its white outline + title bar. Those are
   separate sibling elements in Wix's grid, so every part gets the SAME transform with the SAME transform-origin
   (the card centre, converted into each part's own coordinates) and the same perspective() - mathematically one
   rigid plane, so nothing can drift apart. At rest the inline transform is removed entirely (no layer, no
   half-pixel snapping). */
(function () {
  if (document.body && document.body.classList.contains('device-mobile-optimized')) return;
  var mq = window.matchMedia;
  if (!mq || !mq('(hover: hover) and (pointer: fine)').matches || mq('(prefers-reduced-motion: reduce)').matches) return;

  var MAX = 7, LIFT = 1.02, PERSP = 1100, EASE = 0.12;
  var cards = [], mx = -1e6, my = -1e6, raf = 0;

  function strokeW(el) { return parseFloat(getComputedStyle(el).getPropertyValue('--stroke-width')) || 0; }
  function ownTranslate(el) {            /* CSS `translate` (used to snap a few outlines) is not part of the box */
    var t = getComputedStyle(el).translate; if (!t || t === 'none') return [0, 0];
    var p = t.split(' ').map(parseFloat); return [p[0] || 0, p[1] || 0];
  }
  function build() {
    var vecs = [].slice.call(document.querySelectorAll('.wixui-vector-image')).filter(function (v) { return strokeW(v) > 0; });
    [].slice.call(document.querySelectorAll('.gpDCD5')).forEach(function (hb) {
      var ph = hb.querySelector('.ih2JY1'); if (!ph) return;
      var im = ph.getBoundingClientRect();
      var frames = vecs.filter(function (v) {
        if (hb.contains(v)) return false; var f = v.getBoundingClientRect();
        return f.top <= im.top + 3 && f.bottom >= im.bottom - 3 && Math.abs(f.left - im.left) < 6 && Math.abs(f.right - im.right) < 6;
      });
      var a = hb.parentElement;
      while (a && !frames.every(function (f) { return a.contains(f); })) a = a.parentElement;
      if (!a) return;
      var mem = [];
      [].slice.call(a.children).forEach(function (k) { if (k.contains(hb)) mem.push(k); });
      if (frames.length) {
        var fr = frames.map(function (f) { return f.getBoundingClientRect(); });
        var L = Math.min.apply(0, fr.map(function (r) { return r.left; })), T = Math.min.apply(0, fr.map(function (r) { return r.top; })),
            R = Math.max.apply(0, fr.map(function (r) { return r.right; })), B = Math.max.apply(0, fr.map(function (r) { return r.bottom; }));
        [].slice.call(a.children).forEach(function (k) {
          if (mem.indexOf(k) >= 0) return; var q = k.getBoundingClientRect();
          if (q.width > 0 && q.left >= L - 2 && q.right <= R + 2 && q.top >= T - 2 && q.bottom <= B + 2) mem.push(k);
        });
      }
      cards.push({ hb: hb, mem: mem, rx: 0, ry: 0, s: 1, tx: 0, ty: 0, ts: 1, sx: 50, sy: 50, on: false, live: false, box: null });
    });
  }
  function measure(c) {                   /* rest geometry in page coords (only called while the card is flat) */
    var sx = window.scrollX, sy = window.scrollY, L = 1e9, T = 1e9, R = -1e9, B = -1e9;
    c.pos = c.mem.map(function (m) {
      var r = m.getBoundingClientRect(), t = ownTranslate(m);
      L = Math.min(L, r.left); T = Math.min(T, r.top); R = Math.max(R, r.right); B = Math.max(B, r.bottom);
      return [r.left + sx - t[0], r.top + sy - t[1]];
    });
    c.box = { l: L + sx, t: T + sy, r: R + sx, b: B + sy };
  }
  function remeasureFlat() { cards.forEach(function (c) { if (!c.live) measure(c); }); }

  function step() {
    raf = 0; var px = mx + window.scrollX, py = my + window.scrollY, busy = false;
    cards.forEach(function (c) {
      if (!c.box) measure(c);
      var b = c.box, inside = px >= b.l && px <= b.r && py >= b.t && py <= b.b;
      if (inside) {
        var nx = (px - b.l) / (b.r - b.l) * 2 - 1, ny = (py - b.t) / (b.b - b.t) * 2 - 1;
        c.ty = nx * MAX; c.tx = -ny * MAX; c.ts = LIFT; c.sx = (nx + 1) * 50; c.sy = (ny + 1) * 50;
      } else { c.tx = 0; c.ty = 0; c.ts = 1; }
      if (inside && !c.live) {                 /* starting from flat: fix the shared origin = card centre */
        measure(c); c.live = true;
        var ox = (c.box.l + c.box.r) / 2, oy = (c.box.t + c.box.b) / 2;
        c.mem.forEach(function (m, i) {
          m.style.transformOrigin = (ox - c.pos[i][0]).toFixed(2) + 'px ' + (oy - c.pos[i][1]).toFixed(2) + 'px';
          m.style.willChange = 'transform';
        });
        c.hb.classList.add('jcd-tilting');
      }
      if (!c.live) return;
      c.rx += (c.tx - c.rx) * EASE; c.ry += (c.ty - c.ry) * EASE; c.s += (c.ts - c.s) * EASE;
      var flat = !inside && Math.abs(c.rx) < 0.02 && Math.abs(c.ry) < 0.02 && Math.abs(c.s - 1) < 0.0005;
      if (flat) {                               /* fully back: drop the transform so the rest state is untouched */
        c.rx = c.ry = 0; c.s = 1; c.live = false;
        c.mem.forEach(function (m) { m.style.transform = ''; m.style.transformOrigin = ''; m.style.willChange = ''; });
        c.hb.classList.remove('jcd-tilting'); c.hb.style.removeProperty('--jcd-sx'); c.hb.style.removeProperty('--jcd-sy');
        return;
      }
      busy = true;
      var tf = 'perspective(' + PERSP + 'px) rotateX(' + c.rx.toFixed(3) + 'deg) rotateY(' + c.ry.toFixed(3) + 'deg) scale(' + c.s.toFixed(4) + ')';
      c.mem.forEach(function (m) { m.style.transform = tf; });
      c.hb.style.setProperty('--jcd-sx', c.sx.toFixed(1) + '%'); c.hb.style.setProperty('--jcd-sy', c.sy.toFixed(1) + '%');
      c.hb.style.setProperty('--jcd-sheen', inside ? '1' : '0');
    });
    if (busy) kick();
  }
  function kick() { if (!raf) raf = requestAnimationFrame(step); }

  function init() {
    build(); if (!cards.length) return;
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      mx = e.clientX; my = e.clientY; kick();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { mx = my = -1e6; kick(); });
    window.addEventListener('blur', function () { mx = my = -1e6; kick(); });
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', function () { remeasureFlat(); kick(); });
    window.addEventListener('load', remeasureFlat);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
