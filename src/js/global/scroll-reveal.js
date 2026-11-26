  /* Scroll reveal like the original Wix site (Joel 2026-11-27: "原本 wix 網站我設計每個 section (除了最上方、最下方的圖片外)，
     其他都是滑鼠滾動時顯現"). The Wix export had the elements' "Float In" (most) / "Fade In" entrances; they were stripped
     on export. Now: in every top-level section except the first (top image) and the last (closing image), each piece of
     content fades in and floats up 40px when it scrolls into view, pieces of one section a little after each other.
     Only content below the screen at load is hidden (nothing visible ever blinks). The movement is a keyframe animation
     that exists only while it runs, so scripts measuring positions are not disturbed. Phone, iPad, computer; off under
     reduced motion. CSS: src/css/global/scroll-reveal.css */
  ready(function () {
    if (!('IntersectionObserver' in window)) return;
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
    items = items.filter(function (e) { return e.getBoundingClientRect().top > vh * 0.92; });   /* already on screen: leave alone */
    if (!items.length) return;
    items.forEach(function (e) { e.classList.add('jcd-rv'); });
    var io = new IntersectionObserver(function (entries) {
      var shown = entries.filter(function (en) { return en.isIntersecting; }).map(function (en) { return en.target; })
        .sort(function (a, b) { var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
      shown.forEach(function (e, i) {
        io.unobserve(e);
        e.style.animationDelay = Math.min(i * 0.09, 0.45).toFixed(2) + 's';
        e.classList.add('jcd-rv-in');
        e.addEventListener('animationend', function done(ev) { if (ev.target !== e) return;
          e.removeEventListener('animationend', done); e.classList.remove('jcd-rv', 'jcd-rv-in'); e.style.animationDelay = ''; });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (e) { io.observe(e); });
    /* printing shows everything */
    window.addEventListener('beforeprint', function () { items.forEach(function (e) { e.classList.remove('jcd-rv', 'jcd-rv-in'); }); });
  });

