  /* One tap = open the page, on every touch device (Joel 2026-11-27: on the iPad the first tap on a category card only
     played the blue >> fill, a second tap opened the page). iOS Safari treats a tap as "hover" and swallows the click
     whenever the card's :hover styles reveal something (dark layer fading out, >> appearing). So a short tap that did
     not scroll opens the link at touchend. Covers every link and the role="link" card (Design Approach) on phone (m/)
     and iPad; the top menu keeps its own tap behaviour (Works opens its list on the first tap). */
  /* The link of a whole card: Wix put the link on the card's white frame / title bar / >>, NOT on the photo, so a click
     or tap on the photo itself opened nothing (Joel 2026-11-27). Any click inside a category card that has a link now
     opens that link, on every platform. */
  function cardLink(el) {
    if (!el || !el.closest) return null;
    var a = el.closest('a[href], [role="link"]'); if (a) return a;
    var hb = el.closest('#PAGES_CONTAINER .gpDCD5'); return hb ? hb.querySelector('a[href]') : null;
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button) return;
    var t = e.target; if (!t.closest || t.closest('a[href], [role="link"]')) return;
    var hb = t.closest('#PAGES_CONTAINER .gpDCD5'), a = hb && hb.querySelector('a[href]'); if (!a) return;
    e.preventDefault();
    if (e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') window.open(a.href, '_blank', 'noopener'); else location.href = a.href;
  });
  ready(function () {
    var isTouch = document.body.classList.contains('device-mobile-optimized') || window.__jcdTablet ||
      (window.matchMedia && matchMedia('(hover: none)').matches);
    if (!isTouch) return;
    var sx = 0, sy = 0, st = 0, moved = false, tgt = null;
    document.addEventListener('touchstart', function (e) {
      tgt = null; if (e.touches.length !== 1) return;
      var t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); moved = false;
      tgt = cardLink(e.target);
    }, { passive: true, capture: true });
    document.addEventListener('touchmove', function (e) {
      var t = e.touches[0]; if (t && (Math.abs(t.clientX - sx) > 10 || Math.abs(t.clientY - sy) > 10)) moved = true;
    }, { passive: true, capture: true });
    document.addEventListener('touchcancel', function () { tgt = null; }, { passive: true, capture: true });
    document.addEventListener('touchend', function (e) {
      var el = tgt; tgt = null;
      if (!el || moved || Date.now() - st > 700 || e.defaultPrevented) return;
      if (el.closest('header, #SITE_HEADER, #MENU_AS_CONTAINER, .jcd-lb, [data-jcd-full], form')) return;
      if (el.tagName !== 'A') { e.preventDefault(); el.click(); return; }   /* role="link" card: its own click handler */
      var href = el.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(href)) return;
      e.preventDefault();   /* no hover-first tap, no second (late) click */
      if (el.target === '_blank') window.open(el.href, '_blank', 'noopener'); else location.href = el.href;
    }, { passive: false, capture: true });
  });

