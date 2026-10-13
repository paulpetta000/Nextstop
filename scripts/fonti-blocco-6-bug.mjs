// Orologio e profilo Chrome isolati: nessun dato personale o richiesta esterna.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const rows=[];
try {
 for(const width of [390,1280])for(const hour of [10,20])for(const state of ['vuoto','fatto','da-fare']) {
  const context=await browser.createBrowserContext();
  const page=await context.newPage(),errors=[];
  await page.setViewport({width,height:844});
  await page.setRequestInterception(true);
  page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'||r.url().startsWith('data:')?r.continue():r.abort());
  page.on('pageerror',e=>errors.push(e.stack));
  await page.evaluateOnNewDocument(({ms,state})=>{
   const RealDate=Date;
   window.oraFittizia=ms;
   window.Date=class extends RealDate {constructor(...a){super(...(a.length?a:[window.oraFittizia]));}static now(){return window.oraFittizia;}};
   if(state!=='vuoto')localStorage.setItem('itinerari-v1',JSON.stringify({v:1,attivo:'fittizio0',elenco:[{id:'fittizio0',nome:'Prova fittizia',creato:1,modificato:1,data:'2026-10-13',giorni:[{inizio:570,fine:1140,tappe:['duomo'],...(state==='fatto'?{fatte:['duomo']}:{})}]}]}));
  },{ms:Date.parse(`2026-10-13T${String(hour-2).padStart(2,'0')}:00:00Z`),state});
  await page.goto('http://127.0.0.1:4322/napoli/itinerari/',{waitUntil:'networkidle0'});
  const warning=await page.$eval('#it-avvisi',e=>e.textContent.includes('è pieno'));
  assert.equal(warning,hour===20&&state==='da-fare');
  rows.push({width,hour,state,errors,warning,emptyVisible:await page.$eval('#it-vuoto',e=>!e.hidden),when:await page.$eval('#it-quando',e=>e.textContent)});
  if(hour===10){await page.evaluate(()=>{window.oraFittizia=Date.parse('2026-10-13T18:00:00Z');document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.$eval('#it-avvisi',e=>e.textContent.includes('è pieno')),state==='da-fare');}
  await context.close();
 }
 console.log(JSON.stringify(rows,null,2));
 fs.writeFileSync(`docs/storico/fonti-blocco-6-verifiche/bug-browser-${process.argv[2]||'dopo'}.json`,JSON.stringify(rows,null,2)+'\n');
 assert.ok(rows.every(r=>!r.errors.length),'Il compositore vuoto deve aprirsi anche dopo la fine della giornata');
}finally{await browser.close();}
