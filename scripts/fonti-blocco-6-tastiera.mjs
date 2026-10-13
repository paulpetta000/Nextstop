import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const rows=[];
try{
 const page=await browser.newPage();
 for(const theme of ['light','dark'])for(const width of [375,1280]){
  await page.setViewport({width,height:844});
  await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.goto('http://127.0.0.1:4322/fonti/#registro',{waitUntil:'networkidle0'});
  await page.$eval('#argomento-visite',e=>e.open=true);
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.screenshot({path:`docs/storico/fonti-blocco-6-verifiche/registro-${width}-${theme}.png`});
  await page.focus('#cerca-fonti');
  for(let n=0;n<12;n++){
   if(n>=6)await page.keyboard.down('Shift');
   await page.keyboard.press('Tab');
   if(n>=6)await page.keyboard.up('Shift');
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const row=await page.evaluate(()=>{
    const e=document.activeElement,r=e.getBoundingClientRect();
    return{tag:e.tagName,top:r.top,bottom:r.bottom,outline:getComputedStyle(e).outlineStyle,hidden:!!e.closest('[hidden]')};
   });
   // Tolleranza di un pixel per lo scorrimento frazionario del browser.
   assert.equal(row.hidden,false);assert.ok(row.top>=63&&row.bottom<=845,JSON.stringify(row));
   assert.notEqual(row.outline,'none');
   rows.push({theme,width,direction:n<6?'Tab':'Shift+Tab',...row});
  }
 }
 fs.writeFileSync('docs/storico/fonti-blocco-6-verifiche/tastiera-ritorno.json',JSON.stringify(rows,null,2)+'\n');
 console.log(rows.length,'Tab e Shift+Tab visibili');
}finally{await browser.close();}
