  /* Guest Area dialog (Joel 2026-11-27: "取消單獨的 Guest Area tab，跳像 contact 寄出後的那種視窗，文字都要用我的
     design system"). Links to the password-protected T. Scope page (Defense) no longer open the separate Wix "Guest
     area" password page: they open this dialog instead (lock, title, one line, a short request form, close).
     Its content was never on this site, so there is no password field (yet). Every platform; Esc / outside / x close it.
     Request access (Joel 2026-11-27: "request the access 就直接寄信給我了，不要連到 contact"): name + email + organization
     are emailed to Joel through Web3Forms (settings: jcd-config.js forms), with the visitor's time zone and browser
     language (a rough region; no location service is called).
     window.__jcdGuest(anchor) is also called by one-tap-links.js on touch. CSS: src/css/product/guest-area-dialog.css */
  ready(function () {
    var links = [].slice.call(document.querySelectorAll('a[href*="scope/"]')).filter(function (a) { return /(^|\/)scope\/(index\.html)?$/.test(a.getAttribute('href')); });
    if (!links.length) return;
    links.forEach(function (a) { a.setAttribute('data-jcd-guest', ''); });
    var dlg = null, last = null;
    function build(href) {
      dlg = document.createElement('div'); dlg.className = 'jcd-guest'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
      dlg.setAttribute('aria-labelledby', 'jcd-guest-t');
      dlg.innerHTML = '<div class="jcd-guest-box"><button type="button" class="jcd-guest-x" aria-label="Close">&times;</button>' +
        '<div class="jcd-guest-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/></svg></div>' +
        '<div class="jcd-guest-t" id="jcd-guest-t">Guest Area</div>' +
        '<div class="jcd-guest-s">T. Scope is a confidential defense project, shared on request.</div>' +
        '<form class="jcd-guest-f" novalidate>' +
        '<input class="jcd-guest-in" name="name" type="text" placeholder="Name" autocomplete="name" aria-label="Name">' +
        '<input class="jcd-guest-in" name="email" type="email" placeholder="Email *" autocomplete="email" aria-label="Email" required>' +
        '<input class="jcd-guest-in" name="org" type="text" placeholder="Company / organization" autocomplete="organization" aria-label="Company or organization">' +
        '<input class="jcd-honey" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<button type="submit" class="jcd-guest-go">Request access</button>' +
        '<div class="jcd-guest-msg" role="status" aria-live="polite"></div></form>' +
        '<div class="jcd-guest-done" role="status"><div class="jcd-guest-t">Request sent</div>' +
        '<div class="jcd-guest-s">Thank you. I will get back to you soon.</div></div></div>';
      document.body.appendChild(dlg);
      var form = dlg.querySelector('.jcd-guest-f'), msg = dlg.querySelector('.jcd-guest-msg'), btn = form.querySelector('.jcd-guest-go');
      var F = (window.JCD_CONFIG && JCD_CONFIG.forms) || {}, busy = false;
      form.addEventListener('submit', function (e) {
        e.preventDefault(); if (busy) return;
        var v = function (n) { return (form.elements[n].value || '').trim(); }, email = v('email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = email ? 'Please enter a valid email address.' : 'Please enter your email address.'; form.elements.email.focus(); return; }
        if (form.elements.botcheck.checked) { dlg.classList.add('is-sent'); return; }   /* bot: pretend it worked */
        var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (er) {}
        var data = { access_key: F.accessKey, subject: 'T. Scope access request', from_name: 'Joel Chang Design website',
          name: v('name') || '(no name)', email: email, replyto: email, botcheck: false,
          message: ['Access request for T. Scope (Guest Area)', '', 'Organization: ' + (v('org') || '-'), 'Time zone: ' + (tz || '-'),
            'Browser language: ' + (navigator.language || '-'), 'Page: ' + location.href.split('?')[0]].join('\n') };
        var ctl = window.AbortController ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, F.timeoutMs || 5000) : 0;
        busy = true; btn.disabled = true; btn.textContent = 'Sending...'; msg.textContent = '';
        fetch(F.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data), signal: ctl ? ctl.signal : undefined })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!(r.ok && (j.success === true || j.success === 'true'))) throw 0; }); })
          .then(function () { form.reset(); dlg.classList.add('is-sent'); })
          .catch(function () { msg.textContent = 'Sorry, it could not be sent. Please email ' + (F.fallbackEmail || 'me') + ' directly.'; })
          .then(function () { clearTimeout(timer); busy = false; btn.disabled = false; btn.textContent = 'Request access'; });
      });
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.jcd-guest-x')) close(); });
    }
    function open(a) {
      if (!dlg) build(a.getAttribute('href'));
      last = document.activeElement; void dlg.offsetWidth; dlg.classList.add('is-open'); document.documentElement.classList.add('jcd-guest-lock');
      dlg.classList.remove('is-sent'); setTimeout(function () { var x = dlg.querySelector('.jcd-guest-in'); if (x) x.focus({ preventScroll: true }); }, 60);
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

