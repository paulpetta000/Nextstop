// Chrome isolato, richieste esterne bloccate; prove automatiche, non prove con persone.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { registro,campione } from './contenuti.mjs';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const dir=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(dir,'verifiche');fs.mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:4347/design/fonti/pagina-generale/giro-1/';
const rows=[],scans=[],tasks=[],behavior=[],failures=[],external=[];
const check=(condition,message)=>{if(!condition)failures.push(message);};
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const page=await browser.newPage();
page.on('pageerror',e=>failures.push('Console: '+e.message));
page.on('console',m=>{if(m.type()==='error')failures.push('Console: '+m.text());});
await page.setRequestInterception(true);
let interceptOriginal=false;
page.on('request',r=>{
  if(new URL(r.url()).hostname==='127.0.0.1'||new URL(r.url()).protocol==='data:')r.continue();
  else if(interceptOriginal&&r.isNavigationRequest())r.respond({status:200,contentType:'text/html',body:'<!doctype html><html lang="it"><title>Documento fittizio di prova</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"><h1>Documento fittizio</h1><p>Solo prova di navigazione e ritorno.</p></html>'});
  else{external.push(r.url());r.abort();}
});
const ids=()=>page.$$eval('.source:not([hidden])',ss=>ss.map(s=>s.dataset.sourceId));
const query=async term=>{await page.focus('#cerca-fonti');await page.keyboard.down('Control');await page.keyboard.press('A');await page.keyboard.up('Control');await page.keyboard.press('Backspace');await page.type('#cerca-fonti',term);return ids();};
const measure=()=>page.evaluate(()=>{
  const idList=[...document.querySelectorAll('[id]')].map(e=>e.id);
  const visible=e=>!!e.getClientRects().length&&!e.closest('[hidden]');
  const targets=[...document.querySelectorAll('a,button,input,summary')].filter(e=>!e.disabled&&visible(e)&&e.getBoundingClientRect().height<43.9).map(e=>e.outerHTML.slice(0,120));
  return{overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,duplicates:idList.filter((v,i,a)=>a.indexOf(v)!==i),targets,primarySize:getComputedStyle(document.querySelector('.source-link')).fontSize,count:document.querySelectorAll('.source').length,excluded:[...document.querySelectorAll('a')].filter(a=>/americascup\.com/.test(a.href)).length,searchTop:Math.round(document.querySelector('#cerca-fonti').getBoundingClientRect().top+scrollY)};
});
const scan=async context=>{
  if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({content:axe});
  const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
  check(!violations.length,context+': axe '+JSON.stringify(violations));scans.push({context,violations});
};
try{
  if(!process.argv.includes('--tastiera')){
  for(const key of ['a','b','c','d'])for(const long of [false,true])for(const theme of ['light','dark']){
    const file=key+(long?'-lungo':'')+'.html';
    await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.goto(base+file,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
    // DOM del registro lungo: nessun ID, URL, titolo originale o data registrata sostituiti.
    const present=await page.$$eval('.source',ss=>ss.map(s=>({id:s.dataset.sourceId,url:s.querySelector('.source-link').href,date:s.querySelector('time').dateTime,title:s.querySelector('.full-title p')?.textContent||s.querySelector('.source-link>span').textContent})));
    const expected=long?registro:campione;
    assert.deepEqual(present.map(s=>s.id).sort(),expected.map(s=>s.id).sort());
    for(const s of present){const original=expected.find(e=>e.id===s.id);check(s.url===new URL(original.url).href&&s.date===original.data&&s.title.trim()===(original.titoloOriginale||original.titolo),file+': originale modificato '+s.id);}
    for(const width of [320,375,390,768,1280]){
      await page.setViewport({width,height:1000});
      for(const state of ['chiuso','aperto']){
        await page.evaluate(open=>document.querySelectorAll('.topic').forEach(d=>d.open=open),state==='aperto');
        const m=await measure();check(!m.overflow&&!m.duplicates.length&&!m.targets.length&&!m.excluded&&m.primarySize==='17px',`${file} ${theme} ${width} ${state}: `+JSON.stringify(m));rows.push({file,theme,width,state,...m});
        if([375,1280].includes(width))await scan(`${file} ${theme} ${width} ${state}`);
      }
    }
    // Sorgenti condivise, query pratiche, date e limiti del campione documentato.
    if(!long){
      for(const [term,wanted] of [['durata catacombe',['tp-catacombe-sangennaro']],['nennella',['gri-pasta-patate-2024']],['gesu vecchio',['gri-pasta-patate-2024']],['poppella',['bozza-G4']],['eav',['tp-eav-l1-orario','tp-eav-campania-express-sospeso']],['anm',['tp-anm-gtfs']],['pintauro',['sdg-pintauro-2026']],['slow food',['bozza-S1']]]){
        const actual=await query(term);check(wanted.every(id=>actual.includes(id)),`${key} ${theme}: ricerca ${term}`);tasks.push({key,theme,term,actual});
        if(term==='nennella')check(await page.$eval('[data-source-id="gri-pasta-patate-2024"] [data-context]',e=>e.textContent.startsWith('Trattoria da Nennella')),key+': contesto condiviso');
      }
      await query('nessun documento 123456');check((await ids()).length===0&&await page.$eval('.empty',e=>!e.hidden),key+': zero risultati');
      await page.click('[data-empty-reset]');check((await ids()).length===14&&await page.$eval('#cerca-fonti',e=>e===document.activeElement),key+': reset e focus');
      // Titolo completo facoltativo; originale raggiungibile senza aprire il titolo.
      await query('nennella');await page.focus('[data-source-id="gri-pasta-patate-2024"] .full-title summary');await page.keyboard.press('Enter');
      check(await page.$eval('[data-source-id="gri-pasta-patate-2024"] .full-title',e=>e.open),key+': titolo da tastiera');
      const before=await page.$eval('#cerca-fonti',e=>e.value);
      await page.evaluate(()=>localStorage.setItem('nextstop-prova-isolata',JSON.stringify({giorni:[['tappa-finta']]})));
      interceptOriginal=true;
      await Promise.all([page.waitForNavigation(),page.click('[data-source-id="gri-pasta-patate-2024"] .source-link')]);
      await page.goBack({waitUntil:'domcontentloaded'});interceptOriginal=false;
      await page.waitForFunction(expected=>document.querySelector('#cerca-fonti')?.value===expected,{timeout:3000},before);
      check(await page.$eval('#cerca-fonti',e=>e.value)===before,key+': query conservata al ritorno');
      check(await page.evaluate(()=>localStorage.getItem('nextstop-prova-isolata')==='{"giorni":[["tappa-finta"]]}'),key+': stato fittizio conservato');
      behavior.push({key,theme,originalReturn:true});
    }
  }
  }
  for(const key of ['a','b','c','d']){
    await page.setViewport({width:390,height:844});
    await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:'light'},{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.goto(base+key+'.html',{waitUntil:'networkidle0'});
    // Ordine di tabulazione, skip, disclosure nativo, indice da tastiera, rinvio fra argomenti.
    await page.keyboard.press('Tab');const skipFirst=await page.evaluate(()=>document.activeElement.classList.contains('skip'));check(skipFirst,key+': skip primo');
    if(skipFirst){await page.keyboard.press('Enter');await page.waitForFunction(()=>location.hash==='#contenuto');check(await page.evaluate(()=>document.activeElement.id==='contenuto'),key+': skip al main');}
    await page.focus('#argomento-trasporti>summary');await page.keyboard.press('Space');check(await page.$eval('#argomento-trasporti',e=>e.open),key+': disclosure spazio');
    await page.focus('a[href="#argomento-mappe"]');await page.keyboard.press('Enter');await page.waitForFunction(()=>location.hash==='#argomento-mappe');check(await page.$eval('#argomento-mappe',e=>e.open),key+': indice apre il capitolo');
    await page.focus('.cross-reference a');await page.keyboard.press('Enter');await page.waitForFunction(()=>location.hash.startsWith('#fonte-'));check(await page.$eval('#argomento-trasporti',e=>e.open),key+': rinvio condiviso apre trasporti');
    await page.$eval('#fonte-tp-anm-gtfs',e=>e.scrollIntoView({block:'start'}));
    check(await page.$eval('.results-rail',e=>Math.abs(e.getBoundingClientRect().top)<2),key+': ritorno disponibile durante lo scorrimento');
    await page.focus('[data-return]');await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement.id==='cerca-fonti');
    check(await page.$eval('.results-rail',e=>getComputedStyle(e).position==='static'),key+': fascia statica durante la digitazione');
    await page.keyboard.press('/');check(await page.$eval('#cerca-fonti',e=>e===document.activeElement),key+': scorciatoia ricerca');
    const ring=await page.$eval('#cerca-fonti',e=>getComputedStyle(e).outlineWidth);check(parseFloat(ring)>=3,key+': focus visibile');
    await page.focus('[data-theme]');await page.keyboard.press('Enter');check(await page.evaluate(()=>!!document.documentElement.dataset.theme),key+': tema da tastiera');
    const allMotion=await page.evaluate(()=>document.getAnimations().map(a=>({duration:a.effect.getTiming().duration,name:a.animationName})));check(allMotion.length===0,key+': movimento ridotto');
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
    await page.goto(base+key+'.html',{waitUntil:'domcontentloaded'});
    const motion=await page.evaluate(()=>document.getAnimations().map(a=>({name:a.animationName,iterations:a.effect.getTiming().iterations})));check(motion.length>0&&motion.every(a=>a.iterations===1),key+': motion finita');
    behavior.push({key,keyboard:true,reducedMotion:allMotion,normalMotion:motion});
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    // Nessun JS: tutti i documenti e titoli originali restano accessibili.
    await page.setJavaScriptEnabled(false);await page.goto(base+key+'-lungo.html',{waitUntil:'networkidle0'});
    for(const selector of ['#argomento-visite>summary','#argomento-cucina>summary','#argomento-trasporti>summary','#argomento-mappe>summary','#argomento-cultura>summary'])if(!await page.$eval(selector,e=>e.parentElement.open))await page.click(selector);
    const nojs=await page.$$eval('.source-link',as=>({count:as.length,visible:as.filter(a=>a.getClientRects().length).length}));
    check(nojs.count===195&&nojs.visible===195,key+': senza JS');behavior.push({key,nojs});await page.setJavaScriptEnabled(true);
  }
  check(external.length===0,'Richieste esterne prima del clic: '+external.join(','));
}catch(e){failures.push(e.stack);}finally{await browser.close();}
fs.writeFileSync(path.join(out,process.argv.includes('--tastiera')?'tastiera.json':'risultati.json'),JSON.stringify({rows,scans,tasks,behavior,external,failures},null,2)+'\n');
console.log(JSON.stringify({combinazioni:rows.length,axe:scans.length,ricerche:tasks.length,behavior:behavior.length,external:external.length,failures},null,2));
if(failures.length)process.exitCode=1;
