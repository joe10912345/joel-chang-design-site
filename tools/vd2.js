const { chromium, devices } = require('playwright-core');
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const O='/workspace/joel-chang-design-site/reference/upd4/';
const thumb='https://i.vimeocdn.com/video/2140817901-bc8a6eb7d6bffde2b3f320781ce3f65067f2cf9ffad2ca4d4f3451c6877dc03c-d_1280?region=us';
const cfgs=[['1920',{viewport:{width:1920,height:1080},deviceScaleFactor:2}],['1440',{viewport:{width:1440,height:900},deviceScaleFactor:2}],['390',{...devices['iPhone 13']}]];
for (const [name,o] of cfgs){
const p=await (await b.newContext(o)).newPage(); p.on('pageerror',e=>console.log('JSERR',e.message));
await p.goto('http://localhost:8765/',{waitUntil:'load'});
await p.evaluate(()=>document.getElementById('comp-moybizuw').scrollIntoView({block:'center'})); await p.waitForTimeout(1500);
// Vimeo is blocked from this box: stand the video's own poster frame in for the player to check the edges
await p.evaluate(t=>{const f=document.querySelector('#comp-moybizuw iframe');f.removeAttribute('src');f.srcdoc='<body style="margin:0;background:#000"><img src="'+t+'" style="width:100%;height:100%;object-fit:contain;display:block">';},thumb);
await p.waitForTimeout(1500);
const g=await p.evaluate(()=>{const v=document.getElementById('comp-moybizuw').getBoundingClientRect();const f=document.querySelector('#comp-moybizuw iframe').getBoundingClientRect();return {v:[v.x,v.y,v.width,v.height].map(n=>+n.toFixed(1)),ratio:(f.width/f.height).toFixed(4)}});
console.log(name, JSON.stringify(g));
const v=g.v, m=name==='390'?20:60;
await p.screenshot({path:O+`video-frame-${name}.png`,clip:{x:Math.max(0,v[0]-m),y:Math.max(0,v[1]-m),width:Math.min(v[2]+2*m,o.viewport.width),height:v[3]+2*m}});
await p.screenshot({path:O+`video-frame-corner-${name}.png`,clip:{x:Math.max(0,v[0]-40),y:Math.max(0,v[1]-40),width:160,height:120}});
}
await b.close();})();
