const { chromium } = require('playwright-core');
const fs=require('fs');
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const O='/workspace/joel-chang-design-site/reference/upd7/'; fs.mkdirSync(O,{recursive:true});
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); p.on('pageerror',e=>console.log('JSERR',e.message));
const cases=[['home-works-gallery','',1900,1180,250],['home-design-approach','',2900,300,500],['home-works-grid','',5750,720,420],['about','about/index.html',0,1000,450],['ocean-series','ocean-series/index.html',900,1150,400]];
const meta=[];
for(const [name,path,y,mx,my] of cases){
  await p.goto('http://localhost:8765/'+path,{waitUntil:'load'}); await p.waitForTimeout(800);
  await p.evaluate(y=>scrollTo(0,y),y); await p.waitForTimeout(700);
  for(let i=0;i<10;i++){await p.mouse.move(mx-100+i*10,my);await p.waitForTimeout(30);} await p.waitForTimeout(1500);
  await p.screenshot({path:O+`cursor-light-${name}-1440.png`});
  const rects=await p.evaluate(()=>[...document.querySelectorAll('img, video, iframe')].map(e=>e.getBoundingClientRect()).filter(r=>r.width>20&&r.height>20&&r.bottom>0&&r.top<innerHeight).map(r=>[r.left,r.top,r.right,r.bottom].map(Math.round)));
  await p.evaluate(()=>document.documentElement.classList.remove('jcd-light-on')); await p.waitForTimeout(300);
  await p.screenshot({path:`/tmp/off-${name}.png`});
  meta.push({name,rects});
}
fs.writeFileSync('/tmp/cl2meta.json',JSON.stringify(meta)); await b.close();})();
