  /* Phone layout set by Joel (2026-11-27: "把 wifi7 ap 跟摩艾的手機版頁面做出 mockup，我來調整 layout"), with
     preview/mockups/phone-layout.html. jcd-config.js phone.layout[<page>] = { '<comp id>': { x, y, w, gap }, '<section id>':
     { below } } in layout px:
     - fs sets a text block's size in px, line height in step (Joel 2026-11-27: "首頁下的標題字體讓我調整");
     - x / y move one item (it does not push the items around it), w sets its width, s scales it from its top-left
       corner (photos, the tool's corner handles; Joel 2026-11-27: "選取後的方塊縮放拖曳，跟 illustrator 作法一樣");
     - gap changes the space ABOVE an item: it and everything below it in its section move by gap, and the section grows or
       shrinks by the same amount, so the sections after it follow (Joel 2026-11-27: "是不是要有個功能可以讓我調整空間");
     - 'bg:<comp id>': { px, py } frames that component's background photo (the top image of a work page), as object-position
       % (Joel 2026-11-27: "也要支援子頁最上方首圖的左右移動功能");
     - h sets a box's height (a card, a coloured panel); the items below it in its section's grid move with it (Joel
       2026-11-28: "design approach 的方塊我沒辦法縮矮…也把此功能加出來" -> the tool's bottom handle on a box);
     - below changes the space under a section (added inside it, so its colour or photo grows with it; negative pulls the
       next section up).
     Runs last on load, after the text sizing and tidy-up, and again whenever the tool calls window.__jcdPhoneLayout().
     Phone pages only. */
  ready(function () {
    if (!document.body.classList.contains('device-mobile-optimized')) return;
    var slug = location.pathname.replace(/^.*\/m\//, '').replace(/(^|\/)index\.html$/, '').replace(/\/$/, '').split('/')[0];   /* "/m/index.html" is the home page too (Joel 2026-11-28: it was read as a page called "index.html", so the phone layout and sizes were skipped) */
    var touched = [], PROPS = ['translate', 'width', 'max-width', 'height', 'min-height', 'padding-bottom', 'margin-bottom', 'scale', 'transform-origin', 'object-position', 'clip-path'];
    function keep(e) {   /* remember an element's own inline values once, to restore them on the next run */
      for (var i = 0; i < touched.length; i++) if (touched[i].e === e) return touched[i];
      var t = { e: e, was: {} };
      PROPS.forEach(function (p) { var c = e.style.getPropertyValue(p); t.was[p] = c ? { v: c, pr: e.style.getPropertyPriority(p) } : null; });
      touched.push(t); return t;
    }
    /* text size: every element with text in the block; their own inline size / line height are kept to restore later */
    var fsWas = [];
    function setFs(c, px) {
      var els = [c].concat([].slice.call(c.querySelectorAll('*'))).filter(function (e) {
        return [].some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }); });
      els.forEach(function (e) {
        var cs = getComputedStyle(e), f0 = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight);
        fsWas.push([e, e.style.getPropertyValue('font-size'), e.style.getPropertyPriority('font-size'), e.style.getPropertyValue('line-height'), e.style.getPropertyPriority('line-height')]);
        e.style.setProperty('font-size', px + 'px', 'important');
        if (lh && f0) e.style.setProperty('line-height', (lh * px / f0).toFixed(2) + 'px', 'important');
      });
    }
    function topSection(e) { var s = e.closest('section'); while (s && s.parentElement && s.parentElement.closest('section')) s = s.parentElement.closest('section'); return s; }
    /* the components directly inside a container (a section or a box), not the ones inside those */
    function kids(container) {
      return [].filter.call(container.querySelectorAll('[id^="comp-"]'), function (c) {
        return c !== container && c.parentElement && c.parentElement.closest('[id^="comp-"]') === container && c.getBoundingClientRect().height > 0;
      });
    }
    function apply() {
      touched.forEach(function (t) { Object.keys(t.was).forEach(function (p) {
        if (t.was[p]) t.e.style.setProperty(p, t.was[p].v, t.was[p].pr); else t.e.style.removeProperty(p); }); });
      touched = [];
      for (var k = fsWas.length - 1; k >= 0; k--) { var w = fsWas[k];
        if (w[1]) w[0].style.setProperty('font-size', w[1], w[2]); else w[0].style.removeProperty('font-size');
        if (w[3]) w[0].style.setProperty('line-height', w[3], w[4]); else w[0].style.removeProperty('line-height'); }
      fsWas = [];
      var all = ((window.JCD_CONFIG && JCD_CONFIG.phone && JCD_CONFIG.phone.layout) || {})[slug] || {};
      var shift = [], secGrow = [];   /* [element, dx, dy], [section, px] */
      function add(list, e, a, b) { for (var i = 0; i < list.length; i++) if (list[i][0] === e) { list[i][1] += a; if (b != null) list[i][2] += b; return; } list.push(b != null ? [e, a, b] : [e, a]); }
      /* gaps first, measured on the page as it is (nothing moved yet) */
      Object.keys(all).forEach(function (id) {
        var e = document.getElementById(id), v = all[id]; if (!e || !v || !v.gap) return;
        var sec = topSection(e); if (!sec) return;
        var top = e.getBoundingClientRect().top - 1;
        /* what moves: the items that sit beside it in its own container (a box moves with everything inside it), and,
           when it is inside a box, the section's items below that box */
        var box = e.parentElement && e.parentElement.closest('[id^="comp-"]');
        kids(box || sec).forEach(function (c) { if (c === e || c.getBoundingClientRect().top >= top) add(shift, c, 0, v.gap); });
        if (box && box !== sec) { var bb = box.getBoundingClientRect().bottom - 1;
          kids(sec).forEach(function (c) { if (c !== box && !c.contains(box) && c.getBoundingClientRect().top >= bb) add(shift, c, 0, v.gap); }); }
        add(secGrow, sec, v.gap);
      });
      Object.keys(all).forEach(function (id) {
        if (id.indexOf('bg:') === 0) {   /* background photo framing */
          var bm = document.getElementById('bgMedia_' + id.slice(3)), bv = all[id];   /* the component's own background photo */
          var im = bm && bm.querySelector('img'); if (!im || !bv) return;
          keep(im); im.style.setProperty('object-position', (bv.px != null ? bv.px : 50) + '% ' + (bv.py != null ? bv.py : 50) + '%', 'important');
          return;
        }
        var e = document.getElementById(id), v = all[id]; if (!e || !v) return;
        if (v.x || v.y) add(shift, e, v.x || 0, v.y || 0);
        if (v.w) { keep(e); e.style.setProperty('width', v.w + 'px', 'important'); e.style.setProperty('max-width', 'none', 'important'); }
        if (v.fs) setFs(e, v.fs);
        if (v.h) { keep(e); e.style.setProperty('height', v.h + 'px', 'important'); e.style.setProperty('min-height', v.h + 'px', 'important'); }
        if (v.s && v.s !== 1) { keep(e); e.style.setProperty('transform-origin', '0 0'); e.style.setProperty('scale', String(v.s)); }
        if (v.below) add(secGrow, e, v.below);
      });
      shift.forEach(function (s) {   /* on top of any shift the tidy-up already gave it */
        var t = keep(s[0]), b = ((t.was.translate && t.was.translate.v) || '0px 0px').split(' ').map(parseFloat);
        s[0].style.setProperty('translate', ((b[0] || 0) + s[1]) + 'px ' + ((b[1] || 0) + s[2]) + 'px');
      });
      secGrow.forEach(function (g) {
        var e = g[0], t = keep(e), pb0 = parseFloat(t.was['padding-bottom'] && t.was['padding-bottom'].v) || parseFloat(getComputedStyle(e).paddingBottom) || 0;
        e.style.setProperty('padding-bottom', Math.max(0, pb0 + g[1]) + 'px', 'important');
        /* shorter than it was: the next section moves up and the section's own bottom (its colour) is cut off, so it
           really gets shorter instead of showing under the next one (Joel 2026-11-27: grey box height) */
        if (pb0 + g[1] < 0) { e.style.setProperty('margin-bottom', (pb0 + g[1]) + 'px', 'important');
          e.style.setProperty('clip-path', 'inset(0 0 ' + (-(pb0 + g[1])) + 'px 0)'); }
      });
    }
    window.__jcdPhoneLayout = function () { apply(); window.dispatchEvent(new Event('resize')); };
    if (document.readyState === 'complete') setTimeout(window.__jcdPhoneLayout, 0);
    else window.addEventListener('load', function () { setTimeout(window.__jcdPhoneLayout, 0); });
  });
