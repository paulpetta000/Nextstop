import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');const puppeteer=require('puppeteer-core');const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const out=path.join(path.dirname(fileURLToPath(import.meta.url)),'verifiche');const rows=[],external=[],errors=[];
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});const page=await browser.newPage();
await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():(external.push(r.url()),r.abort()));page.on('pageerror',e=>errors.push(e.message));
try{
  for(const width of [375,1280])for(const theme of ['light','dark']){
    await page.setViewport({width,height:1000});await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.goto('http://127.0.0.1:4348/design/fonti/pagina-generale/giro-2/crediti.html',{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
    const info=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,headerLink:getComputedStyle(document.querySelector('.header-actions>a')).display,photos:document.querySelectorAll('.crediti li').length}));
    assert.equal(info.overflow,false);assert.equal(info.photos,54);if(width===375)assert.equal(info.headerLink,'none');
    await page.addScriptTag({content:axe});const violations=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>v.id);});assert.deepEqual(violations,[]);
    await page.screenshot({path:path.join(out,`crediti-${width}-${theme}.png`)});rows.push({width,theme,...info,violations});
  }
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'crediti-finali.json'),JSON.stringify({rows,external,errors},null,2)+'\n');console.log(JSON.stringify({cases:rows.length,external,errors}));
}finally{await browser.close();}
