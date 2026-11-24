// Render every page live (desktop + mobile), save rendered DOM, screenshots, network log
const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const OUT = '/workspace/wixcopy-tools/liveshots';
const pages = fs.readFileSync('pages.txt','utf8').trim().split('\n');
const slug = u => { const p = new URL(u).pathname.replace(/^\/|\/$/g,''); return p || 'home'; };
const modes = {
  desktop: { viewport:{width:1440,height:900}, deviceScaleFactor:1 },
  mobile: { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true,
    userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
};
async function autoScroll(page){
  await page.evaluate(async()=>{
    await new Promise(r=>{ let y=0; const step=()=>{ const h=document.documentElement.scrollHeight; window.scrollTo(0,y); y+=400; if(y<h+800) setTimeout(step,250); else r(); }; step(); });
  });
  await page.waitForTimeout(1500);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(1000);
}
(async()=>{
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  const only = process.argv[2] ? process.argv[2].split(',') : null;
  for (const [mode,opts] of Object.entries(modes)) {
    const queue = pages.filter(u=>!only||only.includes(slug(u)));
    const worker = async()=>{
      while(queue.length){
        const url = queue.shift(); const s = slug(url);
        const dir = path.join(OUT,mode); fs.mkdirSync(dir,{recursive:true});
        const ctx = await browser.newContext(opts); const page = await ctx.newPage();
        const net = [];
        page.on('response', r=>{ try{ net.push({url:r.url(), status:r.status(), type:r.request().resourceType(), ct:r.headers()['content-type']||''}); }catch(e){} });
        try{
          await page.goto(url,{waitUntil:'load',timeout:90000}).catch(()=>{});
          await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{});
          await page.waitForTimeout(1500);
          await autoScroll(page);
          await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{});
          
          await page.evaluate(()=>{ document.querySelectorAll('[id]').forEach(e=>e.setAttribute('data-motion-enter','done')); document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}}); });
          await page.waitForTimeout(300);
          const html='';
          await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
          await page.waitForTimeout(500);
                              await page.screenshot({path:path.join(dir,s+'.png'),fullPage:true});
          console.log(mode,s,'ok',html.length);
        }catch(e){ console.log(mode,s,'ERR',e.message); }
        await ctx.close();
      }
    };
    await Promise.all([worker(),worker(),worker(),worker(),worker()]);
  }
  await browser.close();
})();
