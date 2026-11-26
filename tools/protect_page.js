/* Encrypt a private page for the site (Joel 2026-11-27). 加密受保護頁面的內容。

   node tools/protect_page.js <slug> [source file in private/<slug>/] [output folder under site/]
   default: private/<slug>/content.html -> site/<slug>/protected.json
   T. Scope (a whole Wix page, computer + phone):
     node tools/protect_page.js t-scope page.html t-scope        node tools/protect_page.js t-scope page-m.html m/t-scope
   A source that is a whole HTML document is marked {doc: true}: after the right password the page is replaced by it
   (document.write), so all the site's scripts run as on any page.
   AES-256-GCM, key = PBKDF2-SHA256(password, random salt, 600000 rounds).
   The password is read from the environment variable JCD_PAGE_PASSWORD and is never written anywhere.
   密碼從環境變數 JCD_PAGE_PASSWORD 讀取，不會寫進任何檔案。

   PowerShell:  $env:JCD_PAGE_PASSWORD = '<password>'; node tools/protect_page.js t-scope; Remove-Item Env:JCD_PAGE_PASSWORD
   Re-run after every change to content.html (or to change the password). 改內容或換密碼後重新執行。 */
const crypto = require('crypto'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), slug = process.argv[2], file = process.argv[3] || 'content.html', outDir = process.argv[4] || slug, pw = process.env.JCD_PAGE_PASSWORD;
if (!slug || !pw) { console.error('usage: JCD_PAGE_PASSWORD=... node tools/protect_page.js <slug>'); process.exit(1); }
const html = fs.readFileSync(path.join(root, 'private', slug, file), 'utf8');
const doc = /^\s*(<!doctype|<html)/i.test(html);
const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12), iter = 600000;
const key = crypto.pbkdf2Sync(pw, salt, iter, 32, 'sha256');
const c = crypto.createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([c.update(html, 'utf8'), c.final(), c.getAuthTag()]);   /* WebCrypto expects the tag at the end */
const out = { v: 1, doc, alg: 'AES-256-GCM', kdf: 'PBKDF2-SHA256', iter, salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') };
fs.mkdirSync(path.join(root, 'site', outDir), { recursive: true });
fs.writeFileSync(path.join(root, 'site', outDir, 'protected.json'), JSON.stringify(out));
console.log('site/' + outDir + '/protected.json written (' + ct.length + ' bytes encrypted' + (doc ? ', whole page' : '') + ')');
