// Chrome temporaneo. In HTTP locale registriamo esplicitamente lo stesso SW
// che il sito registra automaticamente su HTTPS; nessun profilo dell'utente.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const rows=[],errors=[],external=[];
try{
 const page=await browser.newPage();await page.setViewport({width:390,height:844});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('data:')&&new URL(r.url()).hostname!=='127.0.0.1')external.push(r.url());});
 await page.goto('http://127.0.0.1:4322/napoli/itinerari/',{waitUntil:'networkidle0'});
 await page.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;});
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 const saved=JSON.stringify({v:1,attivo:'offline0',elenco:[{id:'offline0',nome:'Viaggio offline fittizio',creato:1,modificato:1,data:'2030-10-13',giorni:[{inizio:570,fine:1140,tappe:['duomo']}]}]});
 await page.evaluate(value=>localStorage.setItem('itinerari-v1',value),saved);
 await page.setOfflineMode(true);
 for(const theme of ['light','dark']){
  await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.reload({waitUntil:'networkidle0'});
  assert.equal(await page.$eval('#it-nome-testo',e=>e.textContent),'Viaggio offline fittizio');
  await page.$eval('.fonti-pannello',e=>e.scrollIntoView());
  await page.waitForFunction(()=>document.querySelector('[data-fonti-stile]').media==='all');
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.click('.disclosure>summary');
  console.log(JSON.stringify(await page.evaluate(()=>({theme:matchMedia('(prefers-color-scheme:dark)').matches,open:document.querySelector('.disclosure').open,style:document.querySelector('[data-fonti-stile]').media,tools:document.querySelector('.search-tools').hidden}))));
  await page.waitForSelector('.fonti-pannello .search-tools:not([hidden])');
  await page.$eval('.fonti-pannello input',e=>{e.value='catacombe';e.dispatchEvent(new Event('input',{bubbles:true}));});
  const ids=await page.$$eval('.fonti-pannello .source:not([hidden])',ss=>ss.map(s=>s.dataset.sourceId));
  assert.ok(ids.includes('tp-catacombe-sangennaro'));
  assert.equal(await page.evaluate(()=>localStorage.getItem('itinerari-v1')),saved);
  rows.push({theme,saved:true,ids,style:await page.$eval('[data-fonti-stile]',e=>e.media)});
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 fs.writeFileSync('docs/storico/fonti-blocco-6-verifiche/offline.json',JSON.stringify({rows,errors,external,registration:'Esplicita su HTTP locale, stesso SW della build'},null,2)+'\n');
 console.log(JSON.stringify({rows,errors,external},null,2));
}finally{await browser.close();}
