const { chromium } = require('playwright-core');
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const O='/workspace/joel-chang-design-site/reference/upd9/'; require('fs').mkdirSync(O,{recursive:true});
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); p.on('pageerror',e=>console.log('JSERR',e.message));
await p.addInitScript(()=>{ /* freeze the hero slideshow so on/off shots are comparable */ window.__freeze=1; });
const out=[];
for (const [name,path] of [['home',''],['t-blade','t-blade/index.html'],['jcg-tough-welding','jcg-tough-welding/index.html'],['about','about/index.html']]){
  await p.goto('http://localhost:8765/'+path,{waitUntil:'load'}); await p.waitForTimeout(1000);
  for (const [tag,y,x,my] of [['header',0,700,70],['below-header',0,500,260],['mid',1200,500,450]]){
    await p.evaluate(y=>scrollTo(0,y),y); await p.waitForTimeout(400); if(y) {await p.mouse.wheel(0,-100); await p.waitForTimeout(700);}
    await p.evaluate(()=>{document.querySelectorAll('.jcd-slides > div').forEach(t=>t.style.transition='none');});
    await p.evaluate(()=>document.documentElement.classList.add('jcd-light-on'));
    for(let i=0;i<10;i++){await p.mouse.move(x-50+i*5,my);await p.waitForTimeout(30);} await p.waitForTimeout(1300);
    const hb=await p.evaluate(()=>Math.round(document.getElementById('SITE_HEADER').getBoundingClientRect().bottom));
    await p.screenshot({path:O+`cursor-light-${name}-${tag}-1440.png`});
    await p.evaluate(()=>document.documentElement.classList.remove('jcd-light-on')); await p.waitForTimeout(200);
    await p.screenshot({path:`/tmp/off-${name}-${tag}.png`});
    out.push({name,tag,hb});
  }
}
require('fs').writeFileSync('/tmp/cl5.json',JSON.stringify(out)); await b.close();})();
