const { chromium, devices } = require('playwright-core');
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const O=process.argv[2]||'/tmp/seo-';
for (const [name,o] of [['1440',{viewport:{width:1440,height:900}}],['1920',{viewport:{width:1920,height:1080}}],['ipad',{...devices['iPad (gen 7)']}],['phone',{...devices['iPhone 13']}]]){
const p=await (await b.newContext(o)).newPage();
await p.goto('http://localhost:8765/',{waitUntil:'load'}); await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const s=document.getElementById('comp-m276lfoi');if(!s)return null;s.scrollIntoView();scrollBy(0,-250);const sr=s.getBoundingClientRect();
 const kids=[...s.querySelectorAll('[id^=comp-]')].map(e=>{const q=e.getBoundingClientRect();return e.id+' top+'+Math.round(q.top-sr.top)+' h'+Math.round(q.height)+' '+(e.innerText||'').slice(0,30).replace(/\n/g,' ')});
 return {sec:[Math.round(sr.top),Math.round(sr.height)],kids, h1:(()=>{const h=document.querySelector('h1');if(!h)return 'no h1';const cs=getComputedStyle(h.closest('[id^=comp-]'));return h.textContent+' | pos='+cs.position+' w='+cs.width+' clip='+cs.clip})()}});
console.log(name, JSON.stringify(r));
if(r){ await p.waitForTimeout(500); await p.screenshot({path:O+name+'.png'}); }
}
await b.close();})();
