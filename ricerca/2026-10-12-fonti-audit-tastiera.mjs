// Prova aggiuntiva: Tab naturale dalla ricerca, senza posizionare i risultati.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const page=await browser.newPage();const result=[];
await page.setRequestInterception(true);
page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():r.abort());
try {
  for(const key of ['a','c','d'])for(const theme of ['light','dark']) {
    await page.setViewport({width:390,height:420});
    await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.goto(`http://127.0.0.1:4347/design/fonti/pagina-generale/giro-1/${key}.html?tab=${key}-${theme}`,{waitUntil:'networkidle0'});
    await page.evaluate(()=>document.fonts.ready);
    await page.focus('#cerca-fonti');await page.keyboard.type('nennella');
    const steps=[];
    for(let step=1;step<=8;step++) {
      await page.keyboard.press('Tab');
      await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      steps.push(await page.evaluate(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),rail=document.querySelector('.results-rail').getBoundingClientRect();return{text:e.textContent.trim(),className:e.className,top:r.top,bottom:r.bottom,railTop:rail.top,railBottom:rail.bottom,entirelyCovered:!e.closest('.results-rail')&&r.top>=rail.top&&r.bottom<=rail.bottom};}));
    }
    result.push({key,theme,width:390,height:420,steps});
  }
}finally{await browser.close();}
fs.writeFileSync(new URL('2026-10-12-fonti-audit-tastiera.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({cases:result.length,steps:result.reduce((n,r)=>n+r.steps.length,0),covered:result.flatMap(r=>r.steps.filter(s=>s.entirelyCovered).map(s=>({key:r.key,theme:r.theme,...s})))},null,2));
