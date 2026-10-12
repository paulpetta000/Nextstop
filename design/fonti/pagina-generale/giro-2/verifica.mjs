import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {registro} from './contenuti.mjs';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const out=path.join(path.dirname(fileURLToPath(import.meta.url)),'verifiche');
const base='http://127.0.0.1:4348/design/fonti/pagina-generale/giro-2/';
const rows=[],scans=[],behavior=[],external=[],errors=[];let navigation=0;
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const page=await browser.newPage();await page.setRequestInterception(true);
let originalUrl=null;
page.on('request',r=>{if(new URL(r.url()).hostname==='127.0.0.1')r.continue();else if(r.url()===originalUrl)r.respond({status:200,contentType:'text/html',body:'<!doctype html><html lang="it"><head><title>Documento fittizio della prova</title><link rel="icon" href="http://127.0.0.1:4348/favicon.svg"></head><body><p>Risposta intercettata: nessun editore contattato.</p></body></html>'});else{external.push(r.url());r.abort();}});
page.on('pageerror',e=>errors.push(e.message));
const frame=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const load=async(key,long,theme,width=390,height=844)=>{await page.setViewport({width,height});await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(`${base}${key}${long?'-lungo':''}.html?qa=${++navigation}`,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);};
const query=async value=>{await page.$eval('#cerca-fonti',(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},value);await frame();return page.$$eval('.source:not([hidden])',ss=>ss.map(s=>s.dataset.sourceId));};
const measure=()=>page.evaluate(()=>{
  const visible=e=>{if(!e.getClientRects().length||e.closest('[hidden]'))return false;for(let p=e.parentElement;p;p=p.parentElement)if(p instanceof HTMLDetailsElement&&!p.open&&e.closest('summary')!==p.querySelector(':scope>summary'))return false;return true;};
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
  return{overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,duplicates:ids.filter((v,i)=>ids.indexOf(v)!==i),smallTargets:[...document.querySelectorAll('a,button,input,summary')].filter(e=>!e.disabled&&visible(e)&&e.getBoundingClientRect().height<43.9).map(e=>e.outerHTML.slice(0,110)),primarySize:getComputedStyle(document.querySelector('.source-link')).fontSize,count:document.querySelectorAll('.source').length};
});
try{
  for(const key of ['a','c','d'])for(const long of [false,true])for(const theme of ['light','dark']){
    await load(key,long,theme);
    if(long){
      const actual=await page.$$eval('.source',ss=>ss.map(s=>({id:s.dataset.sourceId,url:s.querySelector('.source-link').href,date:s.querySelector('time').dateTime})));
      assert.deepEqual(actual.sort((a,b)=>a.id.localeCompare(b.id)),registro.map(s=>({id:s.id,url:s.url,date:s.data})).sort((a,b)=>a.id.localeCompare(b.id)));
    }
    for(const width of [320,375,390,768,1280])for(const open of [false,true]){
      await page.setViewport({width,height:844});await page.evaluate(open=>document.querySelectorAll('.topic').forEach(p=>p.open=open),open);await frame();
      const row={key,long,theme,width,open,...await measure()};assert.equal(row.overflow,false,JSON.stringify(row));assert.deepEqual(row.duplicates,[]);assert.deepEqual(row.smallTargets,[]);assert.equal(row.primarySize,'17px');assert.equal(row.count,long?195:14);rows.push(row);
      if(open&&[375,1280].includes(width)){
        await page.$eval('#registro',e=>e.scrollIntoView({block:'start'}));await frame();
        await page.screenshot({path:path.join(out,`${key}-${long?195:14}-${width}-${theme}-registro.png`)});
      }
    }
    await page.setViewport({width:390,height:844});
    await page.addScriptTag({content:axe});
    const scan=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
    scans.push({key,long,theme,violations:scan});assert.deepEqual(scan,[]);
    const tasks=[];
    for(const [term,id] of [['nennella','gri-pasta-patate-2024'],['gesu vecchio','gri-pasta-patate-2024'],['catacombe','tp-catacombe-sangennaro'],['eav','tp-eav-l1-orario'],['anm','tp-anm-gtfs'],['mappe e dati','osm']]){const ids=await query(term);assert.ok(ids.includes(id),`${key} ${long} ${term}`);tasks.push({term,ids});}
    assert.deepEqual(await query('nessun documento 123456'),[]);assert.equal(await page.$eval('.empty',e=>e.hidden),false);
    await page.click('[data-empty-reset]');assert.equal(await page.$eval('#cerca-fonti',e=>e.value),'');
    await query('nennella');
    const saved=await page.evaluate(()=>{localStorage.setItem('nextstop-audit-fittizio','itinerario di prova');return localStorage.getItem('nextstop-audit-fittizio');});
    originalUrl=await page.$eval('[data-source-id="gri-pasta-patate-2024"] .source-link',e=>e.href);
    await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}),page.click('[data-source-id="gri-pasta-patate-2024"] .source-link')]);
    await page.goBack({waitUntil:'networkidle0'});await page.waitForFunction(()=>document.querySelector('#cerca-fonti')?.value==='nennella');
    assert.equal(await page.evaluate(()=>localStorage.getItem('nextstop-audit-fittizio')),saved);
    await page.evaluate(()=>localStorage.removeItem('nextstop-audit-fittizio'));originalUrl=null;
    // Tab naturale dalla ricerca, incluso il primo originale del risultato.
    await page.focus('#cerca-fonti');const keyboard=[];
    for(let step=0;step<5;step++){await page.keyboard.press('Tab');await frame();keyboard.push(await page.evaluate(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),bar=document.querySelector('.results-rail').getBoundingClientRect();return{name:e.textContent.trim().slice(0,60),top:r.top,bottom:r.bottom,covered:!e.closest('.results-rail')&&r.top>=bar.top&&r.bottom<=bar.bottom};}));}
    assert.ok(keyboard.every(s=>!s.covered));behavior.push({key,long,theme,tasks,returnQuery:'nennella',storagePreserved:true,keyboard});
  }
  for(const key of ['a','c','d']){
    await page.setJavaScriptEnabled(false);await load(key,true,'light');await page.evaluate(()=>document.querySelectorAll('.topic').forEach(p=>p.open=true));
    assert.equal(await page.$$eval('.source-link',as=>as.filter(a=>a.getClientRects().length).length),195);
    assert.equal(await page.$eval('#cerca-fonti',e=>e.disabled),true);await page.setJavaScriptEnabled(true);
  }
  await load('a',false,'light');await page.click('.tail a');
  const photo=await page.$$eval('.crediti li',ss=>ss.map(s=>({id:s.dataset.photoId,text:s.textContent,hrefs:[...s.querySelectorAll('a')].map(a=>a.href)})));
  assert.equal(photo.length,54);assert.ok(page.url().endsWith('#foto'));
  const auxiliary=[];
  for(const file of ['crediti.html','index.html'])for(const theme of ['light','dark'])for(const width of [375,1280]){
    await page.setViewport({width,height:1000});await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.goto(base+file,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);assert.equal(overflow,false);
    await page.screenshot({path:path.join(out,`${file.replace('.html','')}-${width}-${theme}.png`)});
    await page.addScriptTag({content:axe});const scan=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
    scans.push({file,theme,width,violations:scan});assert.deepEqual(scan,[]);auxiliary.push({file,theme,width,overflow});
  }
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'risultati.json'),JSON.stringify({rows,scans,behavior,nojs:195,photo,auxiliary,external,errors},null,2)+'\n');
  console.log(JSON.stringify({layouts:rows.length,axe:scans.length,tasks:behavior.reduce((n,r)=>n+r.tasks.length,0),keyboard:behavior.length*5,returnOriginal:behavior.length,nojs:3,photos:photo.length,external:external.length,errors},null,2));
}finally{await browser.close();}
