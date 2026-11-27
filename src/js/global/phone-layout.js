  /* Phone layout set by Joel (2026-11-27: "把 wifi7 ap 跟摩艾的手機版頁面做出 mockup，我來調整 layout"), with
     preview/mockups/phone-layout.html. jcd-config.js phone.layout[<page>] = { '<comp id>': { x, y, w }, ... } moves an item
     x / y layout px (it does not push the items around it) and sets its width w; { below } on a section changes the
     space under it (px, may be negative). Runs last on load, after the text sizing and tidy-up, and again whenever the
     tool calls window.__jcdPhoneLayout(). Phone pages only. */
  ready(function () {
    if (!document.body.classList.contains('device-mobile-optimized')) return;
    var slug = location.pathname.replace(/^.*\/m\//, '').replace(/\/(index\.html)?$/, '').split('/')[0];
    var touched = [];
    function apply() {
      touched.forEach(function (t) { Object.keys(t.was).forEach(function (p) {
        if (t.was[p]) t.e.style.setProperty(p, t.was[p].v, t.was[p].pr); else t.e.style.removeProperty(p); }); });
      touched = [];
      var all = ((window.JCD_CONFIG && JCD_CONFIG.phone && JCD_CONFIG.phone.layout) || {})[slug] || {};
      Object.keys(all).forEach(function (id) {
        var e = document.getElementById(id), v = all[id]; if (!e || !v) return;
        var t = { e: e, was: {} };
        ['translate', 'width', 'max-width', 'margin-bottom'].forEach(function (p) {
          var cur = e.style.getPropertyValue(p); t.was[p] = cur ? { v: cur, pr: e.style.getPropertyPriority(p) } : null; });
        touched.push(t);
        if (v.x || v.y) {   /* on top of any shift the tidy-up already gave it */
          var b = ((t.was.translate && t.was.translate.v) || '0px 0px').split(' ').map(parseFloat);
          e.style.setProperty('translate', ((b[0] || 0) + (v.x || 0)) + 'px ' + ((b[1] || 0) + (v.y || 0)) + 'px');
        }
        if (v.w) { e.style.setProperty('width', v.w + 'px', 'important'); e.style.setProperty('max-width', 'none', 'important'); }
        if (v.below) e.style.setProperty('margin-bottom', ((parseFloat(t.was['margin-bottom'] && t.was['margin-bottom'].v) || 0) + v.below) + 'px', 'important');
      });
    }
    window.__jcdPhoneLayout = function () { apply(); window.dispatchEvent(new Event('resize')); };
    if (document.readyState === 'complete') setTimeout(window.__jcdPhoneLayout, 0);
    else window.addEventListener('load', function () { setTimeout(window.__jcdPhoneLayout, 0); });
  });
