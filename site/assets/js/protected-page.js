/* protected-page.js — password-protected pages (Joel 2026-11-27, first use: T. Scope).
   受密碼保護的頁面（第一個：T. Scope）。

   The page content is stored ENCRYPTED in <page>/protected.json (AES-256-GCM, key from the password with
   PBKDF2-SHA256), made by tools/protect_page.js from private/<page>/content.html (never committed). The password is
   not in this file or anywhere on the site: only the right password can decrypt the content.
   內容以密碼加密後存在 protected.json；網站上沒有密碼本身，只有輸入正確密碼才解得開。

   window.JCDProtected.unlock(jsonUrl, password) -> Promise<html | null>   (also used by the Guest Area dialog)
   A page using it: <main id="jcd-protected" data-src="protected.json" data-key="t-scope"> + a .jcd-gate form. */
(function () {
  function b64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function unlock(url, password) {
    if (!(window.crypto && crypto.subtle)) return Promise.resolve(null);
    return fetch(url, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (p) {
      return crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']).then(function (base) {
        return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(p.salt), iterations: p.iter }, base,
          { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      }).then(function (key) {
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(p.iv) }, key, b64(p.ct));
      }).then(function (buf) { return new TextDecoder().decode(buf); }, function () { return null; });   /* wrong password */
    });
  }
  window.JCDProtected = { unlock: unlock, storeKey: function (k) { return 'jcd-unlock:' + k; } };

  /* on a protected page: try the password from this session (Guest Area dialog), else show the gate */
  function page() {
    var main = document.getElementById('jcd-protected'); if (!main) return;
    var url = main.getAttribute('data-src'), sk = window.JCDProtected.storeKey(main.getAttribute('data-key'));
    var gate = document.querySelector('.jcd-gate'), form = gate && gate.querySelector('form'), msg = gate && gate.querySelector('.jcd-gate-msg');
    function open(html) {
      main.innerHTML = html; document.documentElement.classList.add('jcd-unlocked');
      if (gate) gate.hidden = true; window.scrollTo(0, 0);
    }
    function ask() { document.documentElement.classList.add('jcd-locked'); if (gate) { gate.hidden = false; var i = gate.querySelector('input'); if (i) i.focus(); } }
    var saved = null; try { saved = sessionStorage.getItem(sk); } catch (e) {}
    if (saved) unlock(url, saved).then(function (html) { html ? open(html) : ask(); }); else ask();
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault(); var pw = form.elements.password.value; if (!pw) return;
      var btn = form.querySelector('button'); btn.disabled = true; msg.textContent = 'Unlocking...'; msg.className = 'jcd-gate-msg';
      unlock(url, pw).then(function (html) {
        btn.disabled = false;
        if (!html) { msg.textContent = 'Incorrect password.'; msg.className = 'jcd-gate-msg is-bad'; form.elements.password.select(); return; }
        try { sessionStorage.setItem(sk, pw); } catch (er) {}
        msg.textContent = ''; open(html);
      });
    });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', page) : page();
})();
