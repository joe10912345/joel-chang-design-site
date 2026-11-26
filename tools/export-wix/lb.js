const { chromium } = require('playwright-core');
const fs=require('fs');
const pages=fs.readFileSync('pages.txt','utf8').split('\n').filter(Boolean);
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const out={};
const work=async(url)=>{ const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage();
  try{
  await p.goto(url,{waitUntil:'load',timeout:60000}); await p.waitForTimeout(2500);
  const gals=await p.evaluate(()=>{const s=new Set();document.querySelectorAll('.pro-gallery, [data-testid="slide-show-gallery"], [data-testid*="gallery"], .wixui-gallery').forEach(g=>{const c=g.closest('[id^="comp-"]');if(c)s.add(c.id)});return [...s].map(id=>{const e=document.getElementById(id);return {id,n:e.querySelectorAll('.gallery-item-container, [data-testid="gallery-item-item"], [data-testid="gallery-item-ghost"]').length, cls:e.className.toString().slice(0,60)}})});
  const res=[];
  for(const g of gals){
    await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(2000);
    const item=p.locator(`#${g.id} .gallery-item-container, #${g.id} [data-testid="gallery-item-item"]`).first();
    if(!(await item.count())){res.push({...g,result:'no items'});continue;}
    try{ await item.scrollIntoViewIfNeeded({timeout:5000}); await item.hover({timeout:5000}); await item.click({timeout:5000}); }catch(e){res.push({...g,result:'click failed'});continue;}
    await p.waitForTimeout(2000);
    const st=await p.evaluate(()=>({url:location.href, fs:!!document.querySelector('[data-hook="fullscreen-view"], .pro-fullscreen-wrapper, [id^="pro-gallery-fullscreen"], [data-testid="fullscreen"], [data-testid="lightbox"], [role="dialog"]')}));
    res.push({...g,url:st.url,fs:st.fs, result: st.fs?'LIGHTBOX':(st.url.split('?')[0].replace(/\/$/,'')!==url.replace(/\/$/,'')?'NAV '+st.url:'nothing')});
  }
  out[url]=res; console.log(url, JSON.stringify(res));
  }catch(e){console.log(url,'ERR',e.message.slice(0,100));}
  await ctx.close(); };
const q=[...pages]; await Promise.all([0,1,2,3,4].map(async()=>{while(q.length) await work(q.shift());}));
fs.writeFileSync('out/lightbox-live.json',JSON.stringify(out,null,1));
await b.close();})();
