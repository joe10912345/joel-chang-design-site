const { chromium, devices } = require('playwright-core');
const B=process.argv[2]||'http://localhost:8765/', O=process.argv[3]||'/workspace/joel-chang-design-site/reference/lightbox/';
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); require('fs').mkdirSync(O,{recursive:true});
const st=p=>p.evaluate(()=>{const l=document.querySelector('.jcd-lb');return l?{open:l.classList.contains('is-open'),count:l.querySelector('.jcd-lb-count').textContent,img:(l.querySelector('.jcd-lb-img').getAttribute('src')||'').split('/').pop(),nat:l.querySelector('.jcd-lb-img').naturalWidth}:'no lightbox'});
let p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); p.on('pageerror',e=>console.log('JSERR',e.message));
for (const pg of ['', 'interstellar05/index.html','moai-router/index.html']){ await p.goto(B+pg,{waitUntil:'load'}); console.log('other page',pg||'home', JSON.stringify(await st(p))); }
await p.goto(B+'ai-tool-kit/index.html',{waitUntil:'load'}); await p.waitForTimeout(800);
for (const g of ['comp-mv69lnww','comp-mvfawpus']){
  const it=p.locator(`#${g} .gallery-item-container`).nth(1); await it.scrollIntoViewIfNeeded(); await it.hover(); await p.waitForTimeout(300); await it.click(); await p.waitForTimeout(250);
  if(g==='comp-mv69lnww') await p.screenshot({path:O+'lightbox-fading-in-1440.png'});
  await p.waitForTimeout(700); console.log('desktop open',g, JSON.stringify(await st(p)));
  if(g==='comp-mv69lnww') await p.screenshot({path:O+'lightbox-open-1440.png'});
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(700); console.log(' right', JSON.stringify(await st(p)));
  await p.click('.jcd-lb-prev'); await p.waitForTimeout(700); console.log(' prev', JSON.stringify(await st(p)));
  if(g==='comp-mv69lnww'){ await p.keyboard.press('Escape'); } else { await p.mouse.click(20,450); }
  await p.waitForTimeout(600); console.log(' closed', JSON.stringify(await st(p)));
}
const ctx=await b.newContext({...devices['iPhone 13']}); const q=await ctx.newPage(); q.on('pageerror',e=>console.log('JSERR',e.message));
await q.goto(B+'ai-tool-kit/index.html',{waitUntil:'load'}); await q.waitForTimeout(800); console.log('phone url',q.url());
const it=q.locator('#comp-mv69lnww .gallery-item-container').first(); await it.scrollIntoViewIfNeeded(); await it.tap(); await q.waitForTimeout(900);
console.log('phone open', JSON.stringify(await st(q))); await q.screenshot({path:O+'lightbox-open-390.png'});
const cdp=await ctx.newCDPSession(q);
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:300,y:400}]});
for(let x=280;x>=80;x-=25) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:400}]});
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await q.waitForTimeout(800);
console.log('phone swipe', JSON.stringify(await st(q)));
await q.tap('.jcd-lb-close'); await q.waitForTimeout(600); console.log('phone close', JSON.stringify(await st(q)));
await b.close();})();
