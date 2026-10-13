// Misura i fotogrammi durante lo scorrimento, anche a 320 px. Profilo Chrome temporaneo.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const page=await browser.newPage();await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():r.abort());
const rows=[];
try{
  for(const key of ['a','b','c','d'])for(const theme of ['light','dark'])for(const width of [320,390,1280]){
    await page.setViewport({width,height:844});await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'no-preference'}]);
    await page.goto(`http://127.0.0.1:4347/design/fonti/pagina-generale/giro-1/${key}.html`,{waitUntil:'networkidle0'});
    const frames=[];
    for(const position of [0,240,480,720]){
      await page.evaluate(async y=>{scrollTo(0,y);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},position);
      const frame=await page.evaluate(()=>({scroll:scrollY,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,transforms:[...document.querySelectorAll('.paper,.route-line,.spines span')].map(e=>getComputedStyle(e).transform)}));
      assert.equal(frame.overflow,false,`${key} ${theme} ${width} movimento`);frames.push(frame);
    }
    if(key==='a'||key==='d')assert.notDeepEqual(frames[0].transforms,frames[3].transforms,`${key}: profondità con lo scorrimento`);
    await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
    assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
    rows.push({key,theme,width,frames,reducedAnimations:0});
  }
}finally{await browser.close();}
fs.writeFileSync(new URL('verifiche/movimento.json',import.meta.url),JSON.stringify(rows,null,2)+'\n');console.log(`${rows.length} casi, 96 fotogrammi: nessun overflow; movimento ridotto fermo.`);
