/* Encrypt a private page for the site (Joel 2026-11-27). 加密受保護頁面的內容。

   Reads   private/<slug>/content.html   (plain content, git-ignored, never published)
   Writes  site/<slug>/protected.json    (AES-256-GCM, key = PBKDF2-SHA256(password, random salt, 600000 rounds))
   The password is read from the environment variable JCD_PAGE_PASSWORD and is never written anywhere.
   密碼從環境變數 JCD_PAGE_PASSWORD 讀取，不會寫進任何檔案。

   PowerShell:  $env:JCD_PAGE_PASSWORD = '<password>'; node tools/protect_page.js t-scope; Remove-Item Env:JCD_PAGE_PASSWORD
   Re-run after every change to content.html (or to change the password). 改內容或換密碼後重新執行。 */
const crypto = require('crypto'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), slug = process.argv[2], pw = process.env.JCD_PAGE_PASSWORD;
if (!slug || !pw) { console.error('usage: JCD_PAGE_PASSWORD=... node tools/protect_page.js <slug>'); process.exit(1); }
const html = fs.readFileSync(path.join(root, 'private', slug, 'content.html'), 'utf8');
const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12), iter = 600000;
const key = crypto.pbkdf2Sync(pw, salt, iter, 32, 'sha256');
const c = crypto.createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([c.update(html, 'utf8'), c.final(), c.getAuthTag()]);   /* WebCrypto expects the tag at the end */
const out = { v: 1, alg: 'AES-256-GCM', kdf: 'PBKDF2-SHA256', iter, salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') };
fs.writeFileSync(path.join(root, 'site', slug, 'protected.json'), JSON.stringify(out));
console.log('site/' + slug + '/protected.json written (' + ct.length + ' bytes encrypted)');
