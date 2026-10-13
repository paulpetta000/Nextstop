// Chrome temporaneo, dati fittizi isolati e nessuna richiesta agli editori.
import fs from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const dir=process.env.FONTI_VERIFY_DIR||'docs/storico/fonti-blocco-5-verifiche';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const errors=[],external=[],rows=[],scans=[],behavior=[];
const page=await browser.newPage();
await page.setRequestInterception(true);
let original=null;
page.on('request',r=>{
 if(r.url().startsWith('data:')||new URL(r.url()).hostname==='127.0.0.1')r.continue();
 else if(r.url()===original)r.respond({status:200,contentType:'text/html',body:'<!doctype html><html lang="it"><head><title>Documento fittizio</title><link rel="icon" href="data:,"></head><body><p>Documento fittizio per provare il ritorno.</p></body></html>'});
 else{external.push(r.url());r.abort();}
});
page.on('pageerror',e=>errors.push({url:page.url(),message:e.message}));
page.on('console',m=>{if(m.type()==='error')errors.push({url:page.url(),message:m.text()});});
const frame=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const load=async(path,theme,width=390)=>{
 await page.setViewport({width,height:844});
 await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.goto('http://127.0.0.1:4322'+path,{waitUntil:'networkidle0'});
 await page.evaluate(()=>document.fonts.ready);
};
try{
 for(const path of ['/fonti/','/napoli/itinerari/','/napoli/dove-mangiare/','/note-legali/'])for(const theme of ['light','dark']){
  await load(path,theme);
  let saved;
  if(path==='/napoli/itinerari/'){
   const elenco=Array.from({length:51},(_,n)=>({id:`fittizio${n}`,nome:`Itinerario fittizio ${n}`,giorni:[{inizio:570,fine:1140,tappe:['duomo']}],creato:1,modificato:1,data:'2030-10-13'}));
   saved=JSON.stringify({v:1,attivo:elenco[50].id,elenco});
   await page.evaluate(value=>localStorage.setItem('itinerari-v1',value),saved);
   await page.reload({waitUntil:'networkidle0'});
   assert.equal(await page.$eval('#it-nome-testo',e=>e.textContent),'Itinerario fittizio 50');
  }
  const area=path==='/fonti/'?'.fonti-atlante':'.fonti-pannello';
  if(path.startsWith('/napoli/')){
   const deferred=await page.$eval('[data-fonti-stile]',e=>e.media);
   assert.equal(deferred,'print','Gli stili Fonti restano rinviati durante l’apertura');
   behavior.push({path,theme,deferred});
  }
  for(const width of [320,375,390,768,1280])for(const open of [false,true]){
   await page.setViewport({width,height:844});
   await page.evaluate(({area,open})=>document.querySelectorAll(area+' .topic, '+area+' .disclosure').forEach(d=>d.open=open),{area,open});await frame();
   const row=await page.evaluate(()=>{
    const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
    return {overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,duplicates:ids.filter((v,i)=>ids.indexOf(v)!==i),documents:document.querySelectorAll('.source').length};
   });rows.push({path,theme,width,open,...row});assert.equal(row.overflow,false,JSON.stringify(rows.at(-1)));assert.deepEqual(row.duplicates,[]);
   if(open&&[375,1280].includes(width)){
    await page.evaluate(area=>document.querySelector(area)?.scrollIntoView({block:'start'}),area);await frame();
    await page.screenshot({path:`${dir}/${path.split('/').filter(Boolean).join('-')}-${width}-${theme}.png`});
   }
  }
  await page.setViewport({width:390,height:844});
  if(path.startsWith('/napoli/'))assert.equal(await page.$eval('[data-fonti-stile]',e=>e.media),'all','Gli stili sono attivi nel pannello aperto');
  await page.addStyleTag({content:'*{transition:none!important}'});await page.addScriptTag({content:axe});
  const violations=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
  scans.push({path,theme,violations});
  if(path==='/note-legali/')continue;
  const input=area+' input[type=search]';
  const query=async value=>{await page.$eval(input,(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},value);await frame();return page.$$eval(area+' .source:not([hidden])',ss=>ss.map(s=>s.dataset.sourceId));};
  const tasks=[];
  for(const term of ['nennella','gesu vecchio','pintauro','2025','nessun documento 123456'])tasks.push({term,ids:await query(term)});
  if(path!=='/napoli/dove-mangiare/')assert.ok((await query('catacombe')).includes('tp-catacombe-sangennaro'));
  await query('nennella');
  const doc=area+' [data-source-id="gri-pasta-patate-2024"] .source-link';
  original=await page.$eval(doc,e=>e.href);
  await page.evaluate(()=>localStorage.setItem('nextstop-fonti-prova','itinerario fittizio, senza dati personali'));
  await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}),page.click(doc)]);
  await page.goBack({waitUntil:'networkidle0'});await frame();
  const returned=await page.$eval(input,e=>e.value);assert.equal(returned,'nennella');
  assert.equal(await page.evaluate(()=>localStorage.getItem('nextstop-fonti-prova')),'itinerario fittizio, senza dati personali');
  if(saved){assert.equal(await page.evaluate(()=>localStorage.getItem('itinerari-v1')),saved);assert.equal(await page.$eval('#it-nome-testo',e=>e.textContent),'Itinerario fittizio 50');}
  await page.evaluate(()=>localStorage.removeItem('nextstop-fonti-prova'));original=null;
  await page.focus(input);const keyboard=[];
  for(let n=0;n<8;n++){await page.keyboard.press('Tab');await frame();keyboard.push(await page.evaluate(()=>{const e=document.activeElement,r=e.getBoundingClientRect();return {tag:e.tagName,text:e.textContent.slice(0,75),top:r.top,bottom:r.bottom};}));}
  behavior.push({path,theme,tasks,returned,storagePreserved:true,keyboard});
 }
 for(const path of ['/fonti/','/napoli/itinerari/','/napoli/dove-mangiare/'])for(const theme of ['light','dark']){
  await page.setJavaScriptEnabled(false);await load(path,theme);
  await page.evaluate(()=>document.querySelectorAll('.topic,.disclosure').forEach(d=>d.open=true));
  const count=await page.$$eval('.source-link',as=>as.filter(a=>a.getClientRects().length).length);assert.ok(count>0);behavior.push({path,theme,nojs:count});
  await page.setJavaScriptEnabled(true);
 }
 await load('/fonti/','light');await page.click('.tail a');assert.ok(page.url().endsWith('/note-legali/#foto'));
 assert.equal(await page.$$eval('.crediti li',ss=>ss.length),54);
 await load('/fonti/','light');await page.screenshot({path:`${dir}/fonti-apertura-390-light.png`});
 await load('/fonti/','dark',1280);await page.screenshot({path:`${dir}/fonti-apertura-1280-dark.png`});
 const movement=[];
 for(const theme of ['light','dark'])for(const width of [390,1280])for(const reduced of ['reduce','no-preference']){
  await load('/fonti/',theme,width);
  await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:reduced}]);
  await page.focus('#cerca-fonti');
  const result=await page.evaluate(()=>{
   const input=document.querySelector('#cerca-fonti'),before=input.getBoundingClientRect();input.value='nennella';input.dispatchEvent(new Event('input',{bubbles:true}));const after=input.getBoundingClientRect();
   return {stable:before.width===after.width&&before.height===after.height,animations:document.getAnimations().filter(a=>a.id.startsWith('fonti-')).map(a=>a.id),visible:[...document.querySelectorAll('.source:not([hidden])')].map(s=>s.dataset.sourceId)};
  });assert.ok(result.stable);assert.ok(result.visible.includes('gri-pasta-patate-2024'));if(reduced==='reduce')assert.deepEqual(result.animations,[]);else assert.equal(result.animations.length,2);
  await page.click('[data-reset]');assert.equal(await page.$eval('#cerca-fonti',e=>e.value),'');movement.push({theme,width,reduced,...result});
 }
 fs.writeFileSync(`${dir}/movimento.json`,JSON.stringify(movement,null,2)+'\n');
 console.log(JSON.stringify({layouts:rows.length,axe:scans,errors,external,behavior:behavior.length},null,2));
 fs.writeFileSync(`${dir}/ui.json`,JSON.stringify({rows,scans,behavior,errors,external},null,2)+'\n');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.ok(scans.every(s=>!s.violations.length));
}finally{await browser.close();}
