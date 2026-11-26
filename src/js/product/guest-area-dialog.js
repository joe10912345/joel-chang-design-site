  /* Guest Area dialog (Joel 2026-11-27: "取消單獨的 Guest Area tab，跳像 contact 寄出後的那種視窗，文字都要用我的
     design system"). Links to the password-protected T. Scope page (Defense) no longer open the separate Wix "Guest
     area" password page: they open this dialog instead (lock, title, one line, "Request access" -> Contact, close).
     Its content was never on this site, so there is no password field. Every platform; Esc / outside / x close it.
     window.__jcdGuest(anchor) is also called by one-tap-links.js on touch. CSS: src/css/product/guest-area-dialog.css */
  ready(function () {
    var links = [].slice.call(document.querySelectorAll('a[href*="scope/"]')).filter(function (a) { return /(^|\/)scope\/(index\.html)?$/.test(a.getAttribute('href')); });
    if (!links.length) return;
    links.forEach(function (a) { a.setAttribute('data-jcd-guest', ''); });
    var dlg = null, last = null;
    function build(href) {
      dlg = document.createElement('div'); dlg.className = 'jcd-guest'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
      dlg.setAttribute('aria-labelledby', 'jcd-guest-t');
      var contact = href.replace(/scope\/(index\.html)?$/, 'contact/index.html');
      dlg.innerHTML = '<div class="jcd-guest-box"><button type="button" class="jcd-guest-x" aria-label="Close">&times;</button>' +
        '<div class="jcd-guest-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/></svg></div>' +
        '<div class="jcd-guest-t" id="jcd-guest-t">Guest Area</div>' +
        '<div class="jcd-guest-s">T. Scope is a confidential defense project, shared on request.</div>' +
        '<a class="jcd-guest-go" href="' + contact + '">Request access</a></div>';
      document.body.appendChild(dlg);
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.jcd-guest-x')) close(); });
    }
    function open(a) {
      if (!dlg) build(a.getAttribute('href'));
      last = document.activeElement; void dlg.offsetWidth; dlg.classList.add('is-open'); document.documentElement.classList.add('jcd-guest-lock');
      setTimeout(function () { var x = dlg.querySelector('.jcd-guest-x'); if (x) x.focus({ preventScroll: true }); }, 50);
    }
    function close() {
      if (!dlg) return; dlg.classList.remove('is-open'); document.documentElement.classList.remove('jcd-guest-lock');
      if (last && last.focus) last.focus({ preventScroll: true });
    }
    window.__jcdGuest = open;
    /* /scope (old links, bookmarks, search results) now lands here with ?guest=1: show the dialog at once */
    if (/[?&]guest=1(&|$)/.test(location.search)) {
      var card = links[0].closest('.gpDCD5') || links[0];
      setTimeout(function () { card.scrollIntoView({ block: 'center' }); open(links[0]); }, 400);
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.hash);
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dlg && dlg.classList.contains('is-open')) close(); });
    /* capture phase: runs before the whole-card click handler, so the card never navigates to the old page */
    document.addEventListener('click', function (e) {
      var t = e.target; if (!t.closest || (dlg && dlg.contains(t))) return;
      var a = t.closest('a[data-jcd-guest]'), hb = !a && t.closest('#PAGES_CONTAINER .gpDCD5');
      if (!a && hb) a = hb.querySelector('a[data-jcd-guest]');
      if (!a) return;
      e.preventDefault(); e.stopPropagation(); open(a);
    }, true);
  });

