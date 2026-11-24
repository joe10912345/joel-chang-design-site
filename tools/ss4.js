const { chromium } = require('playwright-core');
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const res={};
for (const [mode,o] of [['desktop',{viewport:{width:1440,height:900}}]]) {
const p=await (await b.newContext(o)).newPage();
await p.goto('https://www.joel-chang-design.com/',{waitUntil:'load'}); await p.waitForTimeout(3000);
const t0=Date.now();
while(Date.now()-t0<46000){ const r=await p.evaluate(()=>{const g=document.querySelector('[data-testid="slide-show-gallery"]'); const c=g.querySelector('[data-testid="gallery-counter"]').textContent; const ims=[...g.querySelectorAll('[data-testid="gallery-item-item"] wow-image')].map(w=>w.getAttribute('data-image-info')); return [c, ims];});
  if(r[1].length===1){ res[r[0]]=r[1][0]; } await p.waitForTimeout(700); }
}
console.log(JSON.stringify(Object.fromEntries(Object.entries(res).map(([k,v])=>[k,JSON.parse(v).imageData.uri])),null,1));
require('fs').writeFileSync('out/hero-slides.json',JSON.stringify(Object.fromEntries(Object.entries(res).map(([k,v])=>[k,JSON.parse(v).imageData])),null,1));
await b.close();})();
