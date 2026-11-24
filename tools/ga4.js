const { chromium, devices } = require('playwright-core');
const B=process.argv[2]||'http://localhost:8765/';
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for (const [path,dev] of [['',null],['t-blade/index.html',null],['m/about/index.html','iPhone 13']]){
  const ctx=await b.newContext(dev?{...devices[dev]}:{viewport:{width:1440,height:900}}); const p=await ctx.newPage();
  let lib=null, collect=[]; const errs=[];
  p.on('pageerror',e=>errs.push(e.message.slice(0,100)));
  p.on('response',r=>{ const u=r.url(); if(u.includes('googletagmanager.com/gtag/js?id=G-36L411LGT0')) lib=r.status(); });
  p.on('request',r=>{ const u=r.url(); if(/google-analytics\.com\/g\/collect/.test(u)&&u.includes('tid=G-36L411LGT0')) collect.push((u.match(/[?&]en=([^&]+)/)||[])[1]); });
  await p.goto(B+path,{waitUntil:'load'}); await p.waitForTimeout(4000);
  const dl=await p.evaluate(()=>Array.isArray(window.dataLayer)?window.dataLayer.length:'missing');
  console.log((path||'(home)').padEnd(20), dev||'desktop', '| gtag.js', lib, '| collect hits', collect.length, JSON.stringify(collect), '| dataLayer', dl, '| page errors', errs.length);
  await ctx.close();
}
await b.close();})();
