  /* Category cards on touch screens (phone pages + iPads; Joel 2026-11-26, design study preview/category-links.html
     option 3a): there is no hover, so every card shows its product name at the bottom-left (soft wide shadow + a
     faint dark gradient) and a card that opens a product page has a round frosted ">>" on the right, on the same
     centre line; it turns --jcd-blue while pressed. Wix's centred captions and ">>" on the photo are hidden.
     Runs after the phone category spacing (same load event, registered later).
     Computers (Joel 2026-11-26, same day): Wix's text ">>" is replaced by the same round ">>", shown only while the
     mouse is on a linked card; names stay Wix's hover captions. */
  window.addEventListener('load', function () {
    var phone = document.body.classList.contains('device-mobile-optimized');
    var touch = phone || !!window.__jcdTablet;
    /* a card's photo is usually inside its hover box; on some phone cards (Airgain) Wix put it next to the box */
    var photos = [].slice.call(document.querySelectorAll('#PAGES_CONTAINER .ih2JY1'));
    function photoOf(hb) {
      var p = hb.querySelector('.ih2JY1'); if (p) return p;
      var r = hb.getBoundingClientRect();
      return photos.filter(function (ph) { var q = ph.getBoundingClientRect();
        return Math.abs(q.left - r.left) < 4 && Math.abs(q.top - r.top) < 4 && Math.abs(q.width - r.width) < 6 && Math.abs(q.height - r.height) < 6; })[0];
    }
    var boxes = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER .gpDCD5'), function (hb) { return photoOf(hb); });
    if (!boxes.length) return;
    if (touch) document.documentElement.classList.add('jcd-cards-touch');
    function lines(el) {
      var t = document.createElement('textarea');
      t.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|h\d|div|li)>/gi, '\n').replace(/<[^>]+>/g, '');
      return t.value.split('\n').map(function (s) { return s.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
    }
    boxes.forEach(function (hb) {
      var photo = photoOf(hb), host = photo.querySelector('[data-testid="linkElement"]') || photo;
      /* big cards: Wix's link box inside the photo can be 0px tall; then hang the overlay on the photo itself */
      if (host !== photo && host.getBoundingClientRect().height < photo.getBoundingClientRect().height * 0.9) {
        host = photo; if (getComputedStyle(photo).position === 'static') photo.style.position = 'relative'; }
      photo.classList.add('jcd-card-photo');
      var pr = photo.getBoundingClientRect(), linked = !!hb.querySelector('a[href]'), name = null;
      var scope = hb.parentElement || hb;
      [].forEach.call(scope.querySelectorAll('[data-testid="richTextElement"]'), function (rt) {
        var comp = rt.closest('[id^="comp-"]'); if (!comp) return;
        var r = comp.getBoundingClientRect();
        if (!(r.width && r.left >= pr.left - 2 && r.right <= pr.right + 2 && r.top >= pr.top - 2 && r.bottom <= pr.bottom + 2)) return;
        var ls = lines(rt);
        if (ls.join('') === '>>' || ls.join('') === '>') { comp.classList.add('jcd-cap-hide', 'jcd-gg-hide'); return; }
        if (touch && ls.length && !name) { name = ls; comp.classList.add('jcd-cap-hide'); }
      });
      if (!touch) {                                  /* computer: round >> in the corner, on hover only */
        if (linked) { var g2 = document.createElement('span'); g2.className = 'jcd-go jcd-go-hover'; g2.textContent = '>>'; host.appendChild(g2); hb._jcdGo = g2; }
        return;
      }
      if (!name && !linked) return;
      var foot = document.createElement('div'); foot.className = 'jcd-foot';
      var nm = document.createElement('span'); nm.className = 'jcd-nm';
      if (name) {
        if (name.length > 1) { var sm = document.createElement('small'); sm.textContent = name[0]; nm.appendChild(sm); }
        nm.appendChild(document.createTextNode(name.length > 1 ? name.slice(1).join(' ') : name[0]));
      }
      foot.appendChild(nm);
      if (linked) { var go = document.createElement('span'); go.className = 'jcd-go'; go.textContent = '>>'; foot.appendChild(go); hb._jcdGo = go; }
      host.appendChild(foot);
    });
  });

