import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const sharp=createRequire(new URL('../../../../package.json',import.meta.url))('sharp');
const out=path.join(path.dirname(fileURLToPath(import.meta.url)),'verifiche');fs.mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:4347/design/fonti/pagina-generale/giro-1/';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const page=await browser.newPage();await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():r.abort());
try{
  const boundary=[];
  for(const key of ['a','b','c','d']){
    await page.setViewport({width:375,height:844});await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.goto(base+key+'-lungo.html',{waitUntil:'networkidle0'});
    await page.focus('[data-return]');await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.parentElement.id),'argomento-visite');
    await page.keyboard.press('Space');await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('source-link')),true);
    const focused=await page.evaluate(()=>({id:document.activeElement.closest('.source').dataset.sourceId,rect:document.activeElement.getBoundingClientRect().toJSON(),focus:getComputedStyle(document.activeElement).outlineWidth}));
    assert.ok(focused.rect.height>=44&&focused.rect.top>=64&&focused.rect.bottom<=844&&parseFloat(focused.focus)>=3);
    boundary.push({key,width:375,sequentialTab:true,focused});
    // Simula soltanto l'assenza della proprietà facoltativa, non un browser diverso.
    await page.addStyleTag({content:'.topics{content-visibility:visible;contain-intrinsic-size:none}'});
    assert.equal(await page.evaluate(()=>document.querySelectorAll('.source').length),195);
  }
  fs.writeFileSync(path.join(out,'tastiera-confine.json'),JSON.stringify(boundary,null,2)+'\n');
  for(const key of ['a','b','c','d'])for(const theme of ['light','dark'])for(const width of [375,390,1280]){
    await page.setViewport({width,height:1000});await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.goto(base+key+'.html',{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:path.join(out,`${key}-${width}-${theme}.png`)});
    await page.screenshot({path:path.join(out,`${key}-pagina-${width}-${theme}.png`),fullPage:true});
    await page.$eval('#registro',e=>e.scrollIntoView({block:'start'}));await page.screenshot({path:path.join(out,`${key}-registro-${width}-${theme}.png`)});
    if(width===390){
      for(const term of ['nennella','pintauro','eav','slow food','anm']){
        await page.$eval('#cerca-fonti',(e,term)=>{e.value=term;e.dispatchEvent(new Event('input',{bubbles:true}));},term);
        await page.$eval('#registro',e=>e.scrollIntoView({block:'start'}));
        await page.screenshot({path:path.join(out,`${key}-${term}-${width}-${theme}.png`)});
      }
      await page.goto(base+key+'-lungo.html',{waitUntil:'networkidle0'});await page.evaluate(()=>document.querySelectorAll('.topic').forEach(t=>t.open=true));await page.$eval('#registro',e=>e.scrollIntoView({block:'start'}));await page.screenshot({path:path.join(out,`${key}-195-${width}-${theme}.png`)});
    }
  }
}finally{await browser.close();}
// Affiancamento di sole schermate: nessuna modifica ai prototipi.
for(const mode of ['','-registro']){
  const buffers=await Promise.all(['a','b','c','d'].map(key=>sharp(path.join(out,`${key}${mode}-390-light.png`)).resize(312,800).toBuffer()));
  await sharp({create:{width:1296,height:800,channels:3,background:'#ECEAE4'}}).composite(buffers.map((input,i)=>({input,left:i*328,top:0}))).png().toFile(path.join(out,`quattro${mode}-telefono.png`));
}
console.log('Immagini 375/390/1280, due temi; registro, limiti, condivisione, PDF/ZIP e 195 fonti.');
