  ready(function () {
    /* Contact form (contact page, desktop + m/): send to Joel's Gmail through Web3Forms (no backend on GitHub
       Pages; the access key is public by design). Validates email + message, disables SUBMIT while sending, shows "sent" / error in the page style. */
    var form = document.getElementById('comp-jqc9copb');
    if (form && form.tagName === 'FORM') {
      var ENDPOINT = 'https://api.web3forms.com/submit', ACCESS_KEY = '391de8ae-38e4-43c0-9d77-393d65c69402', TIMEOUT = 5000;
      var q = function (sel) { return form.querySelector(sel); };
      var fFirst = q('[name="first-name"]'), fLast = q('[name="last-name"]'), fEmail = q('[name="email"]'),
          fPhone = q('[name="phone"]'), fMsg = q('textarea'), btn = q('button');
      var btnLabel = btn && btn.querySelector('span'), btnText = btnLabel ? btnLabel.textContent : 'SUBMIT';
      form.noValidate = true;
      if (getComputedStyle(form).position === 'static') form.style.position = 'relative';
      var honey = document.createElement('input');
      honey.type = 'checkbox'; honey.name = 'botcheck'; honey.tabIndex = -1; honey.autocomplete = 'off';
      honey.setAttribute('aria-hidden', 'true'); honey.className = 'jcd-honey'; form.appendChild(honey);
      var note = document.createElement('div'); note.className = 'jcd-form-note'; note.setAttribute('role', 'status');
      note.setAttribute('aria-live', 'polite'); form.appendChild(note);
      var done = document.createElement('div'); done.className = 'jcd-form-done'; done.setAttribute('role', 'status');
      done.innerHTML = '<div class="jcd-form-done-in"><div class="jcd-form-done-t">Thanks! Your message has been sent.</div>' +
        '<div class="jcd-form-done-s">I\'ll get back to you soon.</div><button type="button" class="jcd-form-again">Send another message</button></div>';
      form.appendChild(done);
      var say = function (msg, kind) { note.textContent = msg || ''; note.className = 'jcd-form-note' + (msg ? ' is-' + (kind || 'err') : ''); };
      var mark = function (el, bad) { if (el) { el.setAttribute('aria-invalid', bad ? 'true' : 'false'); el.classList.toggle('jcd-bad', !!bad); } };
      var busy = false;
      done.querySelector('.jcd-form-again').addEventListener('click', function () { form.classList.remove('jcd-sent'); say(''); if (fFirst) fFirst.focus(); });
      [fEmail, fMsg].forEach(function (el) { if (el) el.addEventListener('input', function () { mark(el, false); if (note.classList.contains('is-err')) say(''); }); });
      form.addEventListener('submit', function (e) {
        e.preventDefault(); if (busy) return;
        var email = (fEmail && fEmail.value || '').trim(), msg = (fMsg && fMsg.value || '').trim();
        var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        mark(fEmail, !okEmail); mark(fMsg, !msg);
        if (!email) { say('Please enter your email address.'); fEmail.focus(); return; }
        if (!okEmail) { say('Please enter a valid email address.'); fEmail.focus(); return; }
        if (!msg) { say('Please write a message.'); fMsg.focus(); return; }
        if (honey.checked) { form.classList.add('jcd-sent'); return; }          /* bot: pretend it worked */
        var name = [(fFirst && fFirst.value || '').trim(), (fLast && fLast.value || '').trim()].filter(Boolean).join(' ');
        var data = { access_key: ACCESS_KEY, subject: 'New message from joel-chang-design.com', from_name: 'Joel Chang Design website',
          name: name || '(no name)', email: email, phone: (fPhone && fPhone.value || '').trim(), message: msg, replyto: email, botcheck: false };
        var ctl = window.AbortController ? new AbortController() : null;
        var timer = ctl ? setTimeout(function () { ctl.abort(); }, TIMEOUT) : 0;   /* never hang on SENDING */
        busy = true; btn.disabled = true; btn.setAttribute('aria-disabled', 'true'); btn.classList.add('jcd-sending');
        if (btnLabel) btnLabel.textContent = 'SENDING...'; say('');
        fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data), signal: ctl ? ctl.signal : undefined })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
          .then(function (res) {
            var ok = res.ok && (res.j.success === true || res.j.success === 'true');
            if (!ok) throw new Error((res.j && res.j.message) || 'send failed');
            form.reset(); form.classList.add('jcd-sent');
          })
          .catch(function () {
            say('Sorry, your message could not be sent. Please try again, or email joe10912345@gmail.com directly.');
          })
          .then(function () {
            clearTimeout(timer); busy = false; btn.disabled = false; btn.setAttribute('aria-disabled', 'false'); btn.classList.remove('jcd-sending');
            if (btnLabel) btnLabel.textContent = btnText;
          });
      });
    }
  });

