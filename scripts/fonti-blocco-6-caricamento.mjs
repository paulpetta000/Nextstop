// Risposte locali trattenute per distinguere il primo disegno dai ricalcoli.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const rows=[];
try {
 for(const state of ['vuoto','con-tappa']){
  const page=await browser.newPage(),held=[],errors=[];
  await page.setViewport({width:390,height:844});await page.setRequestInterception(true);
  page.on('request',r=>{
   if(/\/(scenari|partenze)\.json$/.test(r.url()))held.push(r);
   else if(new URL(r.url()).hostname==='127.0.0.1'||r.url().startsWith('data:'))r.continue();else r.abort();
  });
  page.on('pageerror',e=>errors.push(e.message));
  await page.evaluateOnNewDocument(state=>localStorage.setItem('itinerari-v1',JSON.stringify({v:1,attivo:'fittizio0',elenco:[{id:'fittizio0',nome:'Prova caricamento',creato:1,modificato:1,data:'2030-10-13',giorni:[{inizio:570,fine:1140,tappe:state==='vuoto'?[]:['duomo']}]}]})),state);
  await page.goto('http://127.0.0.1:4322/napoli/itinerari/',{waitUntil:'domcontentloaded'});
  while(held.length<2)await new Promise(r=>setTimeout(r,25));
  const before=await page.evaluate(()=>{window.schedaFittizia=document.querySelector('#it-tab-0');return{fonts:document.fonts.status,fonti:document.querySelector('[data-fonti-stile]').media};});
  for(const r of held)await r.continue();
  await page.waitForNetworkIdle({idleTime:500});
  const same=await page.evaluate(()=>window.schedaFittizia===document.querySelector('#it-tab-0'));
  rows.push({state,before,requests:held.map(r=>new URL(r.url()).pathname),same,errors});await page.close();
 }
 console.log(JSON.stringify(rows,null,2));
 fs.writeFileSync(`docs/storico/fonti-blocco-6-verifiche/caricamento-${process.argv[2]||'dopo'}.json`,JSON.stringify(rows,null,2)+'\n');
 assert.equal(rows[0].same,true,'I dati secondari non devono ridisegnare la giornata vuota');
 assert.equal(rows[1].same,false,'La giornata con tappe riceve ancora il ricalcolo');
 assert.ok(rows.every(r=>r.before.fonts==='loaded'&&!r.errors.length));
}finally{await browser.close();}
