// Casi dell'audit: prima FONTI_GIRO=1 riproduce gli errori, poi il giro 2 deve superarli.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const old=process.env.FONTI_GIRO==='1';
const base=`http://127.0.0.1:${old?4347:4348}/design/fonti/pagina-generale/giro-${old?1:2}/`;
const {registro,campione}=await import(old?'../giro-1/contenuti.mjs':'./contenuti.mjs');
const transportIds=['tp-eav-campania-express','tp-eav-campania-express-sospeso','tp-eav-808','tp-caremar-tariffe','tp-caremar-partenze','tp-caremar-orari','tp-eav-l1-orario'];
const errors=[],external=[];let browser,page,navigation=0;
const frame=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const load=async(key,long=true,width=390,height=844)=>{errors.length=0;await page.setViewport({width,height});await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(`${base}${key}${long?'-lungo':''}.html?regressione=${++navigation}`,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);};
const query=async value=>{await page.$eval('#cerca-fonti',(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},value);await frame();return page.$$eval('.source:not([hidden])',ss=>ss.map(s=>s.dataset.sourceId));};
test.before(async()=>{browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});page=await browser.newPage();await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():(external.push(r.url()),r.abort()));page.on('pageerror',e=>errors.push(e.message));});
test.after(async()=>{await browser?.close();});
test('categorie: sette documenti di trasporto, campione e registro coerenti',()=>{
  for(const id of transportIds)assert.equal(registro.find(s=>s.id===id).categoria,'trasporti',id);
  for(const s of campione){const full=registro.find(f=>f.id===s.id);if(full)assert.equal(s.categoria,full.categoria,s.id);}
});
test('registro: 195 fonti uniche con tipo conservato',()=>{
  assert.equal(registro.length,195);assert.equal(new Set(registro.map(s=>s.id)).size,195);assert.equal(new Set(registro.map(s=>s.url)).size,195);
  assert.equal(registro.find(s=>s.id==='tp-eav-l1-orario').tipo,'ufficiale');
});
for(const key of ['a','c','d']){
  test(`${key}: ricerca per argomento sul registro completo`,async()=>{
    await load(key);const actual=await query('trasporti');const expected=registro.filter(s=>s.categoria==='trasporti').map(s=>s.id);
    assert.deepEqual(actual.sort(),expected.sort());
    assert.deepEqual((await query('storia e cultura')).sort(),registro.filter(s=>s.categoria==='cultura').map(s=>s.id).sort());
  });
  test(`${key}: frase con congiunzione orienta alla fonte condivisa di Nennella`,async()=>{
    await load(key);assert.deepEqual(await query('pasta e patate nennella'),['gri-pasta-patate-2024']);
    assert.ok((await page.$eval('[data-source-id="gri-pasta-patate-2024"] [data-context]',e=>e.textContent)).startsWith('Trattoria da Nennella'));
    await query('gesù vecchio');assert.ok((await page.$eval('[data-source-id="gri-pasta-patate-2024"] [data-context]',e=>e.textContent)).startsWith('La Locanda Gesù Vecchio'));
  });
  test(`${key}: cancellare la ricerca ripristina i due pannelli manuali`,async()=>{
    await load(key);await page.evaluate(()=>{document.querySelector('#argomento-cucina').open=true;document.querySelector('#argomento-trasporti').open=true;});
    await query('nennella');await page.click('[data-reset]');
    assert.deepEqual((await page.$$eval('.topic[open]',ps=>ps.map(p=>p.id))).sort(),['argomento-cucina','argomento-trasporti']);
    assert.equal(await page.$eval('#cerca-fonti',e=>e.value),'');
    assert.equal(await page.$eval('[data-reset]',e=>e.textContent),'Cancella la ricerca');
  });
  test(`${key}: indice indica Mappe dopo il salto`,async()=>{
    await load(key);await page.click('a[href="#argomento-mappe"]');await frame();
    assert.equal(await page.$eval('a[href="#argomento-mappe"]',a=>a.getAttribute('aria-current')),'location');
    assert.equal(await page.$eval('.topic-index a:first-child',a=>a.getAttribute('aria-current')),null);
  });
  test(`${key}: focus visibile nel ritorno con Shift+Tab a viewport basso`,async()=>{
    await load(key,false,390,420);await query('nennella');
    await page.$eval('[data-source-id="gri-pasta-patate-2024"] .source-link',e=>e.scrollIntoView({block:'start'}));
    await page.focus('[data-source-id="gri-pasta-patate-2024"] .full-title summary');
    await page.keyboard.down('Shift');await page.keyboard.press('Tab');await page.keyboard.up('Shift');await frame();
    const r=await page.evaluate(()=>{const e=document.activeElement,a=e.getBoundingClientRect(),rail=document.querySelector('.results-rail').getBoundingClientRect();return{link:e.classList.contains('source-link'),top:a.top,bottom:a.bottom,railBottom:rail.bottom,height:innerHeight};});
    assert.equal(r.link,true);assert.ok(r.top>=Math.max(0,r.railBottom)+8&&r.bottom<=r.height,JSON.stringify(r));
  });
  test(`${key}: frammento malformato non interrompe la navigazione`,async()=>{
    await load(key);await page.evaluate(()=>location.hash='%');await frame();assert.deepEqual(errors,[]);
  });
}
test('crediti: 54 foto, licenze e Bodoni raggiungibili dentro Nextstop',async()=>{
  await load('a');await page.click('.tail a');
  assert.ok(page.url().includes('#foto'));assert.equal(await page.$$eval('.crediti li',ss=>ss.length),54);
  assert.equal(await page.$eval('#foto',e=>e.textContent),'Foto');
  assert.ok(await page.$eval('body',e=>e.textContent.includes('Bodoni Moda')));
  assert.ok(await page.$('a[href="/fonts/LICENSE-Bodoni-Moda.txt"]'));
  assert.ok((await page.$$eval('.crediti a',as=>as.filter(a=>a.href.includes('creativecommons.org')).length))>0);
  assert.ok((await page.$$eval('.crediti a',as=>as.filter(a=>a.textContent==='Pagina di origine').map(a=>new URL(a.href).hostname))).every(h=>h==='commons.wikimedia.org'));
});
test('navigazione locale senza richieste agli editori',()=>assert.deepEqual(external,[]));
test('crediti: navigazione compatta a 375px',async()=>{
  await page.setViewport({width:375,height:844});await page.goto(base+'crediti.html',{waitUntil:'networkidle0'});
  assert.equal(await page.$eval('.header-actions>a',e=>getComputedStyle(e).display),'none');
});
