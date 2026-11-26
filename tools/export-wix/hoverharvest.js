// Live-site hover audit: hover every interactive candidate, record which ones change the DOM (JS-driven hover),
// and harvest the hover overlay markup Pro Gallery renders only on hover.
const { chromium } = require('playwright-core');
const fs = require('fs');
const pages = fs.readFileSync('pages.txt','utf8').trim().split('\n');
const slug = u => new URL(u).pathname.replace(/^\/|\/$/g,'') || 'home';
(async()=>{
  const b = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  const only = process.argv[2] ? process.argv[2].split(',') : null;
  const queue = pages.filter(u=>!only||only.includes(slug(u)));
  const out = {};
  const worker = async()=>{
    while(queue.length){
      const url = queue.shift(); const s = slug(url);
      const ctx = await b.newContext({viewport:{width:1440,height:900}}); const p = await ctx.newPage();
      try {
        await p.goto(url,{waitUntil:'load',timeout:90000}); await p.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});
        await p.evaluate(async()=>{ await new Promise(r=>{ let y=0; const st=()=>{ window.scrollTo(0,y); y+=500; if(y<document.documentElement.scrollHeight+500) setTimeout(st,150); else r(); }; st(); }); });
        await p.waitForTimeout(1500);
        // tag candidates
        const n = await p.evaluate(()=>{
          const c = new Set();
          document.querySelectorAll('.gallery-item-container, a, button, [role=button], .wixui-image, [data-testid="richTextElement"] a, [id^="comp-"][class*="wixui-box"], [id^="comp-"][class*="hover"], [data-testid*="hover"]').forEach(e=>{ const r=e.getBoundingClientRect(); if(r.width>4&&r.height>4&&!e.closest('#SITE_HEADER')||e.closest('nav')) c.add(e); });
          let i=0; c.forEach(e=>e.setAttribute('data-hh', String(i++))); return i;
        });
        const res = { gallery:{}, mutating:[] };
        for (let i=0;i<n;i++){
          const h = await p.$(`[data-hh="${i}"]`); if(!h) continue;
          const info = await h.evaluate(e=>{ window.__mut=[]; window.__mo && window.__mo.disconnect();
            window.__mo=new MutationObserver(ms=>ms.forEach(m=>window.__mut.push(m.type+':'+(m.attributeName||'')+':'+(m.target.className&&m.target.className.toString?m.target.className.toString().slice(0,40):m.target.nodeName))));
            window.__mo.observe(e.closest('[id^="comp-"]')||e,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-hovered','data-shown','aria-expanded']});
            return {tag:e.tagName, id:e.id, cls:e.className.toString().slice(0,60), comp:(e.closest('[id^="comp-"]')||{}).id, gal:e.classList.contains('gallery-item-container')}; });
          try { await h.hover({timeout:2000, force:true}); } catch(e){ continue; }
          await p.waitForTimeout(info.gal?450:250);
          const after = await h.evaluate((e,gal)=>{ const r={mut:[...new Set(window.__mut)].slice(0,8)};
            if(gal){ const f=e.querySelector('.item-hover-flex-container'); r.hoverHTML=f?f.outerHTML:null; r.containerCls=e.className; const c=e.querySelector('.gallery-item-content'); r.contentCls=c?c.className:''; }
            return r; }, info.gal);
          if (info.gal) res.gallery[info.id] = after;
          else if (after.mut.length) res.mutating.push({...info, mut:after.mut});
          await p.mouse.move(2,2); await p.waitForTimeout(80);
        }
        out[s]=res; console.log(s, 'candidates', n, 'gallery', Object.keys(res.gallery).length, 'withHover', Object.values(res.gallery).filter(g=>g.hoverHTML).length, 'jsHover', res.mutating.length);
      } catch(e){ console.log(s,'ERR',e.message); }
      await ctx.close();
    }
  };
  await Promise.all([worker(),worker(),worker(),worker(),worker()]);
  fs.writeFileSync('out/hover-harvest'+(only?'-partial':'')+'.json', JSON.stringify(out,null,1));
  await b.close();
})();
