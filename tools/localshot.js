// Screenshot the local static copy with the same settings as the live capture; log external/failed requests
const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const OUT = '/workspace/wixcopy-tools/local';
const pages = fs.readFileSync('pages.txt','utf8').trim().split('\n');
const slug = u => { const p = new URL(u).pathname.replace(/^\/|\/$/g,''); return p || 'home'; };
const modes = {
  desktop: { viewport:{width:1440,height:900}, deviceScaleFactor:1 },
  mobile: { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true,
    userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
};
(async()=>{
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  const onlyModes = (process.argv[2]||'desktop,mobile').split(',');
  const only = process.argv[3] ? process.argv[3].split(',') : null;
  const report = {};
  for (const mode of onlyModes) {
    const opts = modes[mode];
    const queue = pages.map(slug).filter(s=>!only||only.includes(s));
    const worker = async()=>{
      while(queue.length){
        const s = queue.shift();
        const p = (mode==='mobile'?'m/':'') + (s==='home'?'':s+'/');
        const url = 'http://localhost:8765/'+p;
        fs.mkdirSync(path.join(OUT,mode),{recursive:true});
        const ctx = await browser.newContext(opts); const page = await ctx.newPage();
        const ext=[], bad=[];
        page.on('request', r=>{ if(!r.url().startsWith('http://localhost:8765')) ext.push(r.url().slice(0,150)); });
        page.on('response', r=>{ if(r.status()>=400) bad.push(r.status()+' '+r.url()); });
        page.on('pageerror', e=>bad.push('JS '+e.message));
        await page.goto(url,{waitUntil:'load',timeout:60000}).catch(e=>bad.push('GOTO '+e.message));
        await page.waitForTimeout(1000);
        const finalUrl = page.url();
        await page.evaluate(async()=>{ await new Promise(r=>{ let y=0; const st=()=>{ const h=document.documentElement.scrollHeight; window.scrollTo(0,y); y+=500; if(y<h+500) setTimeout(st,120); else r(); }; st(); }); window.scrollTo(0,0); });
        await page.waitForTimeout(800);
        await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
        await page.waitForTimeout(300);
        await page.screenshot({path:path.join(OUT,mode,s+'.png'),fullPage:true});
        report[mode+'/'+s] = {finalUrl, external:[...new Set(ext)], errors:bad};
        await ctx.close();
      }
    };
    await Promise.all([worker(),worker(),worker(),worker()]);
  }
  fs.writeFileSync(path.join(OUT,'report-'+onlyModes.join('_')+(only?'-partial':'')+'.json'),JSON.stringify(report,null,1));
  await browser.close();
})();
