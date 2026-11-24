// Screenshot live vs local at many sizes/devices; record layout chosen + horizontal overflow.
// usage: node responsive.js <pages comma> <configs comma|all> [local base url]
const { chromium, devices } = require('playwright-core');
const fs = require('fs');
const CONFIGS = {
  'iphone-se-375x667': {...devices['iPhone SE'], viewport:{width:375,height:667}, screen:{width:375,height:667}},
  'iphone-13-390x844': {...devices['iPhone 13'], viewport:{width:390,height:844}, screen:{width:390,height:844}},
  'iphone-14promax-430x932': {...devices['iPhone 14 Pro Max'], viewport:{width:430,height:932}, screen:{width:430,height:932}},
  'ipad-mini-768x1024': devices['iPad Mini'],
  'ipad-mini-landscape-1024x768': devices['iPad Mini landscape'],
  'ipad-air-820x1180': {...devices['iPad (gen 7)'], viewport:{width:820,height:1180}, screen:{width:820,height:1180}},
  'ipad-air-landscape-1180x820': {...devices['iPad (gen 7) landscape'], viewport:{width:1180,height:820}, screen:{width:1180,height:820}},
  'ipad-pro-1024x1366': {...devices['iPad (gen 7)'], viewport:{width:1024,height:1366}, screen:{width:1024,height:1366}},
  'ipad-pro-landscape-1366x1024': {...devices['iPad (gen 7) landscape'], viewport:{width:1366,height:1024}, screen:{width:1366,height:1024}},
  'laptop-1280x800': {viewport:{width:1280,height:800}},
  'laptop-1366x768': {viewport:{width:1366,height:768}},
  'laptop-1440x900': {viewport:{width:1440,height:900}},
  'laptop-1536x864': {viewport:{width:1536,height:864}},
  'desktop-1920x1080': {viewport:{width:1920,height:1080}},
  'desktop-2560x1440': {viewport:{width:2560,height:1440}},
};
const [pagesArg, cfgArg, localBase='http://localhost:8765/'] = process.argv.slice(2);
const pages = pagesArg.split(','); const cfgs = cfgArg==='all'?Object.keys(CONFIGS):cfgArg.split(',');
const OUT='/workspace/wixcopy-tools/resp'; const tag = localBase.startsWith('file')?'file':'local';
const pagePath = s => s==='home'?'':s+'/';
async function shoot(b, cfgName, url, out, live){
  const ctx = await b.newContext({...CONFIGS[cfgName]}); const p = await ctx.newPage();
  await p.goto(url,{waitUntil:'load',timeout:90000}).catch(()=>{});
  if (live) await p.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{});
  await p.waitForTimeout(live?2500:1200);
  await p.evaluate(async(live)=>{ await new Promise(r=>{ let y=0; const st=()=>{ window.scrollTo(0,y); y+=400; if(y<document.documentElement.scrollHeight+400) setTimeout(st,live?220:80); else r(); }; st(); }); window.scrollTo(0,0); }, !!live).catch(()=>{});
  await p.waitForTimeout(live?2500:800);
  const m = await p.evaluate(()=>{ for (let i=1;i<5000;i++) clearInterval(i);
    document.querySelectorAll('[id]').forEach(e=>e.setAttribute('data-motion-enter','done'));
    document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}});
    document.querySelectorAll('[data-testid="gallery-item-item"] img').forEach(i=>i.style.opacity='1');
    return {url:location.href, innerWidth, scrollWidth:document.documentElement.scrollWidth, bodyScrollWidth:document.body.scrollWidth,
            viewport:(document.querySelector('meta[name=viewport]')||{}).content, height:document.documentElement.scrollHeight}; }).catch(e=>({err:e.message}));
  await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'}).catch(()=>{});
  await p.waitForTimeout(500);
  await p.screenshot({path:out, fullPage:true}).catch(e=>m.shotErr=e.message);
  await ctx.close(); return m;
}
(async()=>{
  const b = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox','--allow-file-access-from-files'] });
  const jobs=[]; for (const c of cfgs) for (const s of pages) { jobs.push([c,s,'live']); jobs.push([c,s,tag]); }
  const res={}; const doLive = !process.env.NOLIVE;
  const worker=async()=>{ while(jobs.length){ const [c,s,kind]=jobs.shift(); if(kind==='live'&&!doLive) continue; if(process.env.LIVEONLY&&kind!=='live') continue;
    fs.mkdirSync(`${OUT}/${c}`,{recursive:true});
    const url = kind==='live' ? 'https://www.joel-chang-design.com/'+(s==='home'?'':s) : localBase+pagePath(s)+(localBase.startsWith('file')?'index.html':'');
    const m = await shoot(b,c,url,`${OUT}/${c}/${s}-${kind}.png`,kind==='live'); res[`${c}/${s}/${kind}`]=m; console.log(c,s,kind,JSON.stringify(m)); } };
  await Promise.all([worker(),worker(),worker(),worker()]);
  const f=`${OUT}/metrics-${tag}.json`; const old=fs.existsSync(f)?JSON.parse(fs.readFileSync(f)):{}; Object.assign(old,res); fs.writeFileSync(f,JSON.stringify(old,null,1));
  await b.close();
})();
