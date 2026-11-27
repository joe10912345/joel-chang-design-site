  /* Phone layout set by Joel (2026-11-27: "把 wifi7 ap 跟摩艾的手機版頁面做出 mockup，我來調整 layout"), with
     preview/mockups/phone-layout.html. jcd-config.js phone.layout[<page>] = { '<comp id>': { x, y, w, gap }, '<section id>':
     { below } } in layout px:
     - x / y move one item (it does not push the items around it), w sets its width;
     - gap changes the space ABOVE an item: it and everything below it in its section move by gap, and the section grows or
       shrinks by the same amount, so the sections after it follow (Joel 2026-11-27: "是不是要有個功能可以讓我調整空間");
     - below changes the space under a section (added inside it, so its colour or photo grows with it; negative pulls the
       next section up).
     Runs last on load, after the text sizing and tidy-up, and again whenever the tool calls window.__jcdPhoneLayout().
     Phone pages only. */
  ready(function () {
    if (!document.body.classList.contains('device-mobile-optimized')) return;
    var slug = location.pathname.replace(/^.*\/m\//, '').replace(/\/(index\.html)?$/, '').split('/')[0];
    var touched = [], PROPS = ['translate', 'width', 'max-width', 'padding-bottom', 'margin-bottom'];
    function keep(e) {   /* remember an element's own inline values once, to restore them on the next run */
      for (var i = 0; i < touched.length; i++) if (touched[i].e === e) return touched[i];
      var t = { e: e, was: {} };
      PROPS.forEach(function (p) { var c = e.style.getPropertyValue(p); t.was[p] = c ? { v: c, pr: e.style.getPropertyPriority(p) } : null; });
      touched.push(t); return t;
    }
    function topSection(e) { var s = e.closest('section'); while (s && s.parentElement && s.parentElement.closest('section')) s = s.parentElement.closest('section'); return s; }
    /* the items of a section that can move: each text block and photo as its Wix component (innermost ones only) */
    function items(sec) {
      var list = [];
      [].forEach.call(sec.querySelectorAll('[data-testid="richTextElement"], img, video, .wixui-vector-image, .wixui-button'), function (x) {
        if (x.closest('[id^="bgMedia_"]')) return;
        var c = x.closest('[id^="comp-"]'); if (c && c !== sec && list.indexOf(c) < 0) list.push(c);
      });
      return list.filter(function (c) { return !list.some(function (o) { return o !== c && c.contains(o); }); });
    }
    function apply() {
      touched.forEach(function (t) { Object.keys(t.was).forEach(function (p) {
        if (t.was[p]) t.e.style.setProperty(p, t.was[p].v, t.was[p].pr); else t.e.style.removeProperty(p); }); });
      touched = [];
      var all = ((window.JCD_CONFIG && JCD_CONFIG.phone && JCD_CONFIG.phone.layout) || {})[slug] || {};
      var shift = [], secGrow = [];   /* [element, dx, dy], [section, px] */
      function add(list, e, a, b) { for (var i = 0; i < list.length; i++) if (list[i][0] === e) { list[i][1] += a; if (b != null) list[i][2] += b; return; } list.push(b != null ? [e, a, b] : [e, a]); }
      /* gaps first, measured on the page as it is (nothing moved yet) */
      Object.keys(all).forEach(function (id) {
        var e = document.getElementById(id), v = all[id]; if (!e || !v || !v.gap) return;
        var sec = topSection(e); if (!sec) return;
        var top = e.getBoundingClientRect().top - 1;
        items(sec).forEach(function (c) { if (c === e || c.getBoundingClientRect().top >= top) add(shift, c, 0, v.gap); });
        add(secGrow, sec, v.gap);
      });
      Object.keys(all).forEach(function (id) {
        var e = document.getElementById(id), v = all[id]; if (!e || !v) return;
        if (v.x || v.y) add(shift, e, v.x || 0, v.y || 0);
        if (v.w) { keep(e); e.style.setProperty('width', v.w + 'px', 'important'); e.style.setProperty('max-width', 'none', 'important'); }
        if (v.below) add(secGrow, e, v.below);
      });
      shift.forEach(function (s) {   /* on top of any shift the tidy-up already gave it */
        var t = keep(s[0]), b = ((t.was.translate && t.was.translate.v) || '0px 0px').split(' ').map(parseFloat);
        s[0].style.setProperty('translate', ((b[0] || 0) + s[1]) + 'px ' + ((b[1] || 0) + s[2]) + 'px');
      });
      secGrow.forEach(function (g) {
        var e = g[0], t = keep(e), pb0 = parseFloat(t.was['padding-bottom'] && t.was['padding-bottom'].v) || parseFloat(getComputedStyle(e).paddingBottom) || 0;
        e.style.setProperty('padding-bottom', Math.max(0, pb0 + g[1]) + 'px', 'important');
        if (pb0 + g[1] < 0) e.style.setProperty('margin-bottom', (pb0 + g[1]) + 'px', 'important');
      });
    }
    window.__jcdPhoneLayout = function () { apply(); window.dispatchEvent(new Event('resize')); };
    if (document.readyState === 'complete') setTimeout(window.__jcdPhoneLayout, 0);
    else window.addEventListener('load', function () { setTimeout(window.__jcdPhoneLayout, 0); });
  });
