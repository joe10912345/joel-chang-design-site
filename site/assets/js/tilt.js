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

  var MAX = 3, LIFT = 1, PERSP = 1100, EASE = 0.12;
  /* Size-aware: a corner of a wide card moves further than a small card's at the same angle, so each axis is scaled
     so its corner displacement (which grows with size squared under perspective) never exceeds a small card's (reference 412x310, the 3-across networking tiles) at MAX. */
  var REF_W = 412, REF_H = 310;
  /* Stand-alone photos that tilt too, always at the full MAX angle (About: portrait with its white frame). */
  var EXTRA = ['comp-mujmtw8h'];
  var cards = [], mx = -1e6, my = -1e6, raf = 0;

  function strokeW(el) { return parseFloat(getComputedStyle(el).getPropertyValue('--stroke-width')) || 0; }
  function ownTranslate(el) {            /* CSS `translate` (used to snap a few outlines) is not part of the box */
    var t = getComputedStyle(el).translate; if (!t || t === 'none') return [0, 0];
    var p = t.split(' ').map(parseFloat); return [p[0] || 0, p[1] || 0];
  }
  function build() {
    var vecs = [].slice.call(document.querySelectorAll('.wixui-vector-image')).filter(function (v) { return strokeW(v) > 0; });
    var cand = [], all = [].slice.call(document.querySelectorAll('[id^="comp-"]'));
    /* header / anything fixed or sticky never belongs to a card even when it happens to overlap one */
    var pinned = [].slice.call(document.querySelectorAll('header, #SITE_HEADER, [id^="comp-"]')).filter(function (e) {
      var ps = getComputedStyle(e).position; return e.tagName === 'HEADER' || e.id === 'SITE_HEADER' || ps === 'fixed' || ps === 'sticky'; });
    all = all.filter(function (e) { return !pinned.some(function (f) { return f.contains(e); }); });
    [].slice.call(document.querySelectorAll('.gpDCD5')).forEach(function (hb) {
      var ph = hb.querySelector('.ih2JY1'); if (!ph) return;
      var im = ph.getBoundingClientRect();
      var frames = vecs.filter(function (v) {
        if (hb.contains(v)) return false; var f = v.getBoundingClientRect();
        return f.top <= im.top + 3 && f.bottom >= im.bottom - 3 && Math.abs(f.left - im.left) < 6 && Math.abs(f.right - im.right) < 6;
      });
      /* The card = the area of its white outline(s) (or just the photo tile when it has none). EVERY element whose
         box lies inside that area belongs to the card - title text, title bar, secondary photos, captions, >> -
         found geometrically, keeping only the outermost ones (a container inside the card carries its children). */
      var L = im.left, T = im.top, R = im.right, B = im.bottom;
      frames.forEach(function (f) { var q = f.getBoundingClientRect();
        L = Math.min(L, q.left); T = Math.min(T, q.top); R = Math.max(R, q.right); B = Math.max(B, q.bottom); });
      var hbr = hb.getBoundingClientRect();
      L = Math.min(L, hbr.left) - 2; T = Math.min(T, hbr.top) - 2; R = Math.max(R, hbr.right) + 2; B = Math.max(B, hbr.bottom) + 2;
      var inBox = all.filter(function (e) {
        var q = e.getBoundingClientRect();
        return q.width > 0 && q.height > 0 && q.left >= L && q.right <= R && q.top >= T && q.bottom <= B;
      });
      var mem = inBox.filter(function (e) { return !inBox.some(function (o) { return o !== e && o.contains(e); }); });
      if (!mem.some(function (m) { return m.contains(hb); })) return;
      cand.push({ area: (R - L) * (B - T), hb: hb, mem: mem });
      return;
    });
    /* biggest card first: a photo tile nested inside a bigger card's outline tilts with that card, not alone */
    EXTRA.forEach(function (id) { var el = document.getElementById(id);
      if (el && !pinned.some(function (f) { return f.contains(el); })) cards.push({ hb: el, mem: [el], full: true, rx: 0, ry: 0, s: 1, tx: 0, ty: 0, ts: 1, sx: 50, sy: 50, on: false, live: false, box: null }); });
    cand.sort(function (x, y) { return y.area - x.area; }).forEach(function (c) {
      var hb = c.hb, mem = c.mem;
      if (cards.some(function (o) { return o.mem.some(function (m) { return mem.some(function (n) { return m === n || m.contains(n) || n.contains(m); }); }); })) return;
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
    if (c.full) { c.maxX = c.maxY = MAX; return; }
    c.maxY = MAX * Math.pow(Math.min(1, REF_W / Math.max(1, R - L)), 2); c.maxX = MAX * Math.pow(Math.min(1, REF_H / Math.max(1, B - T)), 2);
  }
  function remeasureFlat() { cards.forEach(function (c) { if (!c.live) measure(c); }); }

  function step() {
    raf = 0; var px = mx + window.scrollX, py = my + window.scrollY, busy = false;
    cards.forEach(function (c) {
      if (!c.box) measure(c);
      var b = c.box, inside = px >= b.l && px <= b.r && py >= b.t && py <= b.b;
      if (inside) {
        var nx = (px - b.l) / (b.r - b.l) * 2 - 1, ny = (py - b.t) / (b.b - b.t) * 2 - 1;
        c.ty = nx * c.maxY; c.tx = -ny * c.maxX; c.ts = LIFT; c.sx = (nx + 1) * 50; c.sy = (ny + 1) * 50;
      } else { c.tx = 0; c.ty = 0; c.ts = 1; }
      if (inside && !c.live) {                 /* starting from flat: fix the shared origin = card centre */
        measure(c); c.live = true;
        var ox = (c.box.l + c.box.r) / 2, oy = (c.box.t + c.box.b) / 2;
        c.mem.forEach(function (m, i) {
          m.style.transformOrigin = (ox - c.pos[i][0]).toFixed(2) + 'px ' + (oy - c.pos[i][1]).toFixed(2) + 'px';
        });
        c.hb.classList.add('jcd-tilting');
      }
      if (!c.live) return;
      c.rx += (c.tx - c.rx) * EASE; c.ry += (c.ty - c.ry) * EASE; c.s += (c.ts - c.s) * EASE;
      var flat = !inside && Math.abs(c.rx) < 0.003 && Math.abs(c.ry) < 0.003 && Math.abs(c.s - 1) < 0.0005;
      if (flat) {                               /* fully back: drop the transform so the rest state is untouched */
        c.rx = c.ry = 0; c.s = 1; c.live = false;
        c.mem.forEach(function (m) { m.style.transform = ''; m.style.transformOrigin = ''; });
        c.hb.classList.remove('jcd-tilting'); c.hb.style.removeProperty('--jcd-sx'); c.hb.style.removeProperty('--jcd-sy');
        return;
      }
      busy = true;
      /* Perspective makes a tilted card's projected outline drift: tipping the top away moves BOTH the top edge
         (shrinks toward the centre) and the bottom edge (grows) downward, so the card looked like it slid down.
         Project the 4 corners exactly as CSS does and move the result back so the outline stays centred in place. */
      var hw = (c.box.r - c.box.l) / 2 * c.s, hh = (c.box.b - c.box.t) / 2 * c.s, ax = c.rx * Math.PI / 180, ay = c.ry * Math.PI / 180;
      var X0 = 1e9, X1 = -1e9, Y0 = 1e9, Y1 = -1e9;
      [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].forEach(function (q) {
        var x1 = q[0] * Math.cos(ay), z1 = -q[0] * Math.sin(ay);                       /* rotateY */
        var y2 = q[1] * Math.cos(ax) - z1 * Math.sin(ax), z2 = q[1] * Math.sin(ax) + z1 * Math.cos(ax);   /* rotateX */
        var w = 1 - z2 / PERSP, X = x1 / w, Y = y2 / w;                               /* perspective */
        X0 = Math.min(X0, X); X1 = Math.max(X1, X); Y0 = Math.min(Y0, Y); Y1 = Math.max(Y1, Y);
      });
      var cx = -(X0 + X1) / 2, cy = -(Y0 + Y1) / 2;
      var tf = ') perspective(' + PERSP + 'px) rotateX(' + c.rx.toFixed(3) + 'deg) rotateY(' + c.ry.toFixed(3) + 'deg) scale(' + c.s.toFixed(4) + ')';
      c.mem.forEach(function (m) { m.style.transform = 'translate(' + cx.toFixed(3) + 'px, ' + cy.toFixed(3) + 'px' + tf; });
      c.hb.style.setProperty('--jcd-sx', c.sx.toFixed(1) + '%'); c.hb.style.setProperty('--jcd-sy', c.sy.toFixed(1) + '%');
      c.hb.style.setProperty('--jcd-sheen', inside ? '1' : '0');
    });
    if (busy) kick();
  }
  function kick() { if (!raf) raf = requestAnimationFrame(step); }

  function init() {
    build(); window.__jcdTilt = cards; if (!cards.length) return;
    /* Every card part is its own compositor layer for the whole visit (never toggled): a layer paints sub-pixel
       positions differently from normal painting (esp. at Windows 125%/150% scaling), so promoting it on hover and
       dropping it after the ease-out made the card visibly jump (down) on leave. */
    cards.forEach(function (c) { c.mem.forEach(function (m) { m.style.willChange = 'transform'; }); });
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
