  /* About, desktop layout (computer + iPad): the same empty space left and right of the content (Joel 2026-11-27: "ipad
     版的 about 左邊跟右邊空間沒有一樣，右邊比較窄。應該要相等，如果左邊空間是共用的數據，那內容應該要窄點讓右邊有一樣的
     空間"). The left edge stays (it is the page's shared text edge, e.g. "EXPERTISE"); content that reaches further right
     than the mirror of it is pulled in:
     - Trusted Collaboration cards: the card block ends at the mirrored edge;
     - Expertise: the Branding column moves left until its longest line ends there, and the divider before it sits
       halfway between the Engineering text and the Branding column.
     Measured again on resize (window, zoom, iPad turning). Not on the phone. */
  ready(function () {
    if (document.body.classList.contains('device-mobile-optimized') || !/\/about\//.test(location.pathname)) return;
    var z = function () { return window.__jcdZoom || 1; };
    function textBox(e) {   /* the text itself, not its Wix box */
      var r = { l: 1e9, r: -1e9 }, tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), t;
      while ((t = tw.nextNode())) { if (!t.textContent.trim()) continue;
        var rg = document.createRange(); rg.selectNodeContents(t);
        [].forEach.call(rg.getClientRects(), function (q) { if (q.width > 0) { r.l = Math.min(r.l, q.left); r.r = Math.max(r.r, q.right); } }); }
      return r.l < 1e9 ? r : null;
    }
    var $ = function (id) { return document.getElementById(id); };
    function even() {
      var head = $('comp-mujj9yxk'); if (!head) return;   /* "EXPERTISE": the page's left text edge */
      var brandParts = [$('comp-mujnhrtl'), $('comp-mujnglui')], divider = $('comp-mujnu0tu'), eng = $('comp-mujngiyo');
      var moved = brandParts.concat([divider]).filter(Boolean);
      moved.forEach(function (e) { e.style.removeProperty('translate'); });
      var rec = document.querySelector('.jcd-rec'); if (rec) { rec.style.width = ''; rec.style.marginLeft = ''; rec.style.marginRight = ''; rec.style.removeProperty('transform'); }   /* heading-spacing.js nudges it with a transform; the margin below places it exactly */
      var vw = document.documentElement.clientWidth, hb = textBox(head); if (!hb) return;
      var right = vw - hb.l;   /* the mirrored edge, window px */
      /* cards */
      if (rec) {
        var rr = rec.getBoundingClientRect(), pr = rec.parentElement.getBoundingClientRect();
        rec.style.marginLeft = ((hb.l - pr.left) / z()).toFixed(1) + 'px';
        rec.style.marginRight = '0';
        rec.style.width = ((right - hb.l) / z()).toFixed(1) + 'px';
      }
      /* Expertise: Branding column */
      var bt = brandParts[1] && textBox(brandParts[1]), et = eng && textBox(eng);
      if (bt && bt.r > right + 0.5) {
        var dx = bt.r - right;
        /* the CSS translate property, not transform: the divider is a Wix line turned upright with a transform, and
           replacing it laid the line flat across "Product Design Strategy" (Joel 2026-11-28: "about 技能的襯線出問題了") */
        brandParts.forEach(function (e) { if (e) e.style.setProperty('translate', (-dx / z()).toFixed(1) + 'px 0'); });
        if (divider && et) {
          var dr = divider.getBoundingClientRect(), mid = (et.r + bt.l - dx) / 2;
          divider.style.setProperty('translate', ((mid - (dr.left + dr.width / 2)) / z()).toFixed(1) + 'px 0');
        }
      }
    }
    var t; function soon() { clearTimeout(t); t = setTimeout(even, 150); }
    even(); window.addEventListener('load', even); window.addEventListener('resize', soon); setTimeout(even, 1500);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(even);
  });
