  /* Scroll reveal like the original Wix site (Joel 2026-11-27: "原本 wix 網站我設計每個 section (除了最上方、最下方的圖片外)，
     其他都是滑鼠滾動時顯現" — 2nd pass: "滾動動畫其實是 fade in，滾到畫面中央逐漸顯現，往上滾消失").
     In every top-level section except the first (top image / page title) and a bottom image section, each piece of
     content (big wrappers split into their parts) fades with the scroll position: invisible while its top is at the
     bottom edge of the screen, fully visible once its top reaches the middle; scrolling back fades it out again.
     Opacity only (no movement), so scripts measuring positions are not disturbed. Phone, iPad, computer; everything
     visible under reduced motion and when printing. CSS: src/css/global/scroll-reveal.css */
  ready(function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var secs = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER section'), function (s) {
      return !(s.parentElement && s.parentElement.closest('section')) && s.getBoundingClientRect().height > 40; });
    if (secs.length < 2) return;
    var vh = window.innerHeight, items = [];
    function grid(el) { return el.querySelector(':scope > [data-testid="inline-content"] > [data-testid="mesh-container-content"], :scope > [data-mesh-id$="inlineContent"] > [data-mesh-id$="gridContainer"]'); }
    function collect(container, depth) {
      [].forEach.call(container.children, function (e) {
        if (!e.id || !/^comp-/.test(e.id) || e.closest('header, footer')) return;
        var r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
        var cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.position === 'sticky' || cs.visibility === 'hidden') return;
        var g = grid(e);   /* a big wrapper: reveal its parts instead of one block */
        if (g && depth < 2 && r.height > vh * 0.9 && g.children.length > 1) { collect(g, depth + 1); return; }
        items.push(e);
      });
    }
    /* the last section is skipped only when it is the bottom IMAGE (a photo background covering it, or photo only) */
    function imageSection(s) {
      var sr = s.getBoundingClientRect();
      var bg = [].some.call(s.querySelectorAll('[id^="bgMedia_"] img, [id^="bgMedia_"] video, wow-image img'), function (m) {
        var r = m.getBoundingClientRect(); return r.width >= sr.width * 0.9 && r.height >= sr.height * 0.6; });
      return bg || !s.querySelector('.wixui-rich-text') || s.classList.contains('jcd-reveal') || s.classList.contains('jcd-window');
    }
    var use = secs.slice(1); if (use.length && imageSection(use[use.length - 1])) use.pop();
    use.forEach(function (s) { var g = grid(s); if (g) collect(g, 0); });
    if (!items.length) return;
    items.forEach(function (e) { e.classList.add('jcd-rv'); });
    /* where the content really is: a piece whose parts were moved (phone layout, e.g. Lifestyle's Drone card moved up
       into its frame) keeps its own box where Wix put it — below the page end there, so it never faded in (Joel
       2026-11-28: "drone 圖片不見了"). Each piece fades by the top of its highest part; measured again after layout changes. */
    function measure() {
      items.forEach(function (e) {
        var t0 = e.getBoundingClientRect().top, m = t0;
        [].forEach.call(e.querySelectorAll('[id^="comp-"]'), function (c) { var r = c.getBoundingClientRect(); if (r.height > 0 && r.width > 0) m = Math.min(m, r.top); });
        e.__jcdDy = m - t0;
      });
    }
    measure();
    window.addEventListener('jcd:phone-layout', function () { measure(); soon(); });
    window.addEventListener('load', function () { setTimeout(function () { measure(); soon(); }, 2600); });
    var raf = 0;
    /* the element that really scrolls: body only when <html> clips (otherwise body's overflow moves to the window) */
    function scroller() { var b = document.body, h = document.documentElement;
      return getComputedStyle(h).overflowY !== 'visible' && /(auto|scroll)/.test(getComputedStyle(b).overflowY) && b.scrollHeight > b.clientHeight + 1
        ? b : document.scrollingElement || h; }
    /* timing from jcd-config.js scrollReveal (read on every update, so the mockup can change it live) */
    var curves = { linear: function (t) { return t; }, ease: function (t) { return t * t * (3 - 2 * t); },
                   easeOut: function (t) { return 1 - (1 - t) * (1 - t); } };
    function update() {
      raf = 0; vh = window.innerHeight;
      /* positions and innerHeight are both in window pixels (no __jcdZoom division needed: nothing is set in CSS px) */
      var C = (window.JCD_CONFIG && JCD_CONFIG.scrollReveal) || {};
      var a = vh * (C.start != null ? C.start : 1), b = vh * (C.end != null ? C.end : 0.5), f = curves[C.curve] || curves.linear;
      document.documentElement.style.setProperty('--jcd-rv-smooth', (C.smooth != null ? C.smooth : 0.12) + 's');
      var sc = scroller();
      var left = Math.max(0, sc.scrollHeight - sc.clientHeight - sc.scrollTop);   /* how far the page can still scroll down */
      items.forEach(function (e) {
        var top = e.getBoundingClientRect().top + (e.__jcdDy || 0);
        /* fully visible at `end` — or, near the page end, where it stops at the last scroll */
        var full = Math.min(Math.max(b, top - left), a - 1);
        var t = Math.max(0, Math.min(1, (a - top) / (a - full)));   /* top at `start` -> 0 */
        e.style.setProperty('opacity', f(t).toFixed(3));
      });
    }
    window.__jcdScrollReveal = function () { soon(); };   /* for preview/mockups/scroll-fade.html */
    function soon() { if (!raf) raf = requestAnimationFrame(update); }
    document.addEventListener('scroll', soon, { passive: true, capture: true });   /* capture: the phone page scrolls inside body */
    window.addEventListener('resize', soon); window.addEventListener('load', soon);
    update();
    window.addEventListener('beforeprint', function () { items.forEach(function (e) { e.style.removeProperty('opacity'); }); });
    window.addEventListener('afterprint', update);
  });

