  ready(function () {
    /* Design Approach cards (home). Joel 2026-11-24: no glow and nothing to press on the cards, EXCEPT the first one
       (01 DISCOVERY, the one with the ">>" arrow): it is pressable — the whole card follows the arrow's link and gets a
       press-in + brand-blue outline while pressed. (Was: hover glow following the cursor on all four; tap toggled it.) */
    var ids = ['comp-mnfjmw0p', 'comp-mnfjoibv', 'comp-mnfjomf4', 'comp-mnfjomey'];
    var cards = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    cards.forEach(function (c) { c.classList.add('jcd-da-card'); });
    var first = cards[0];
    if (first) {
      var fr = first.getBoundingClientRect();
      var arrow = [].filter.call(document.querySelectorAll('a[aria-label=">>"]'), function (a) {
        var r = a.getBoundingClientRect(); return r.left >= fr.left - 2 && r.right <= fr.right + 2 && r.top >= fr.top - 2 && r.bottom <= fr.bottom + 2; })[0];
      if (arrow) {
        first.classList.add('jcd-da-link');
        first.setAttribute('role', 'link'); first.setAttribute('tabindex', '0');
        var go = function (e) { if (e.target.closest && e.target.closest('a')) return; arrow.click(); };
        first.addEventListener('click', go);
        first.addEventListener('keydown', function (e) { if (e.key === 'Enter') arrow.click(); });
        arrow.addEventListener('pointerdown', function () { first.classList.add('is-pressed'); });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { arrow.addEventListener(ev, function () { first.classList.remove('is-pressed'); }); });
        /* Joel 2026-11-26: the round ">>" (same as the category cards) replaces Wix's text arrow; pressing the card
           fills it blue and the page opens a moment later */
        var acomp = arrow.closest('[id^="comp-"]'); if (acomp) acomp.classList.add('jcd-gg-hide');
        var chip = document.createElement('span'); chip.className = 'jcd-go jcd-da-go'; chip.textContent = '>>'; first.appendChild(chip);
        var href = arrow.href;
        first.removeEventListener('click', go);
        first.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey) { window.open(href, '_blank'); return; }
          location.href = href;
        });
      }
    }
  });

