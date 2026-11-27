  ready(function () {
    /* Design Approach cards (home). Joel 2026-11-24: no glow and nothing to press on the cards, EXCEPT the first one
       (01 DISCOVERY, the one with the ">>" arrow): it is pressable — the whole card follows the arrow's link and gets a
       press-in + brand-blue outline while pressed. (Was: hover glow following the cursor on all four; tap toggled it.) */
    var ids = ['comp-mnfjmw0p', 'comp-mnfjoibv', 'comp-mnfjomf4', 'comp-mnfjomey'];
    var cards = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    cards.forEach(function (c) { c.classList.add('jcd-da-card'); });
    /* a card that opens a page: the whole card is the link, blue outline on hover, the plain ">>" in its corner
       (round-go-fill.css), pressing it turns the >> blue and the page opens */
    function linkCard(card, href, wixArrow) {
      card.classList.add('jcd-da-link');
      card.setAttribute('role', 'link'); card.setAttribute('tabindex', '0');
      if (wixArrow) { var acomp = wixArrow.closest('[id^="comp-"]'); if (acomp) acomp.classList.add('jcd-gg-hide'); }
      var chip = document.createElement('span'); chip.className = 'jcd-go jcd-da-go'; chip.textContent = '>>'; card.appendChild(chip);
      card.addEventListener('pointerdown', function () { card.classList.add('is-pressed'); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { card.addEventListener(ev, function () { card.classList.remove('is-pressed'); }); });
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter') location.href = href; });
      card.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) { window.open(href, '_blank'); return; }
        location.href = href;
      });
    }
    /* 01 DISCOVERY: Wix's own ">>" link (Joel 2026-11-24 / 26) */
    var first = cards[0];
    if (first) {
      var fr = first.getBoundingClientRect();
      var arrow = [].filter.call(document.querySelectorAll('a[aria-label=">>"]'), function (a) {
        var r = a.getBoundingClientRect(); return r.left >= fr.left - 2 && r.right <= fr.right + 2 && r.top >= fr.top - 2 && r.bottom <= fr.bottom + 2; })[0];
      if (arrow) linkCard(first, arrow.href, arrow);
    }
    /* more cards with a link, from jcd-config.js links.designApproach: { '<words on the card>': '<page>#<anchor>' }
       (Joel 2026-11-27: "首頁的這張 buildable mindset 請連到 wifi7 ap 的這張 cutting cost"). The card is the one whose
       frame holds those words (Wix lays the texts over the cards, not inside them). */
    var more = (window.JCD_CONFIG && JCD_CONFIG.links && JCD_CONFIG.links.designApproach) || {};
    var texts = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'));
    Object.keys(more).forEach(function (words) {
      var t = texts.filter(function (x) { return x.textContent.replace(/\s+/g, ' ').toUpperCase().indexOf(words.toUpperCase()) >= 0; })[0]; if (!t) return;
      var r = t.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var card = cards.filter(function (c) { var q = c.getBoundingClientRect(); return cx >= q.left && cx <= q.right && cy >= q.top && cy <= q.bottom; })[0];
      if (card && !card.classList.contains('jcd-da-link')) linkCard(card, new URL(more[words], location.href).href, null);
    });
  });

