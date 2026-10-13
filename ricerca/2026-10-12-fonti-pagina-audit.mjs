// Audit in sola lettura di A, C e D. Chrome temporaneo; nessuna richiesta esterna.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { registro } from '../design/fonti/pagina-generale/giro-1/contenuti.mjs';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const base='http://127.0.0.1:4347/design/fonti/pagina-generale/giro-1/';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const page=await browser.newPage();const rows=[],scenarios=[],external=[],errors=[],credits=[];
page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():(external.push(r.url()),r.abort()));
const frame=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const query=async value=>{await page.$eval('#cerca-fonti',(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},value);await frame();return page.$$eval('.source:not([hidden])',ss=>ss.map(s=>({id:s.dataset.sourceId,context:s.querySelector('[data-context]')?.textContent||'',topic:s.closest('.topic').id})));};
let navigation=0;
const load=async(key,long,width=390,height=844,theme='light')=>{await page.setViewport({width,height});await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(base+key+(long?'-lungo':'')+'.html?audit='+ ++navigation,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);};
try{
  for(const key of ['a','c','d'])for(const long of [false,true])for(const width of [390,1280])for(const theme of ['light','dark']){
    await load(key,long,width,844,theme);
    const measure=await page.evaluate(()=>({
      searchTop:Math.round(document.querySelector('#cerca-fonti').getBoundingClientRect().top+scrollY),
      registerTop:Math.round(document.querySelector('#registro').getBoundingClientRect().top+scrollY),
      firstSourceTop:document.querySelector('.source').closest('.topic').open?Math.round(document.querySelector('.source').getBoundingClientRect().top+scrollY):null,
      nav: [...document.querySelectorAll('.topic-index a')].map(a=>({name:a.textContent.trim(),background:getComputedStyle(a).backgroundColor,current:a.getAttribute('aria-current')})),
      noteLink:document.querySelector('.tail a').href,
      mail:document.querySelector('a[href^="mailto:"]').getAttribute('href'),
      overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
    }));
    await page.$eval('#argomento-visite',e=>e.open=false);
    await page.focus('#argomento-visite>summary');await frame();
    const before=await page.evaluate(()=>performance.now());
    await page.keyboard.press('Space');await frame();
    const expansion=await page.evaluate(start=>({milliseconds:Math.round(performance.now()-start),open:document.querySelector('#argomento-visite').open,topicHeight:Math.round(document.querySelector('#argomento-visite').getBoundingClientRect().height),groups:[...document.querySelectorAll('#argomento-visite .place-group')].map(g=>({title:g.querySelector('h4').textContent,count:g.querySelectorAll('.source').length,height:Math.round(g.getBoundingClientRect().height)}))}),before);
    rows.push({key,long,width,theme,...measure,expansion});
    for(const term of ['trasporti','storia e cultura','mappe e dati','nennella','pasta e patate nennella']){
      const result=await query(term);scenarios.push({key,long,width,theme,kind:'query',term,result});
    }
    await query('');
    await page.evaluate(()=>{document.querySelector('#argomento-cucina').open=true;document.querySelector('#argomento-trasporti').open=true;});
    const opened=await page.$$eval('.topic[open]',ss=>ss.map(s=>s.id));
    await query('nennella');await page.click('[data-reset]');
    const afterReset=await page.$$eval('.topic[open]',ss=>ss.map(s=>s.id));
    const rendered=await page.$$eval('.source:not([hidden])',ss=>ss.filter(s=>s.closest('.topic').open&&s.getClientRects().length).length);
    scenarios.push({key,long,width,theme,kind:'reset',opened,afterReset,visibleDocuments:rendered});
    await page.click('a[href="#argomento-mappe"]');await frame();
    scenarios.push({key,long,width,theme,kind:'index',hash:await page.evaluate(()=>location.hash),nav:await page.$$eval('.topic-index a',as=>as.map(a=>({name:a.textContent.trim(),background:getComputedStyle(a).backgroundColor,current:a.getAttribute('aria-current')})))});
    if(width===390&&!long){
      await load(key,false,390,420,theme);await query('nennella');
      await page.$eval('[data-source-id="gri-pasta-patate-2024"] .source-link',e=>e.scrollIntoView({block:'start'}));await frame();
      const geometry=await page.evaluate(()=>{const link=document.querySelector('[data-source-id="gri-pasta-patate-2024"] .source-link').getBoundingClientRect();const rail=document.querySelector('.results-rail').getBoundingClientRect();return {railHeight:rail.height,railTop:rail.top,linkTop:link.top,linkBottom:link.bottom,viewport:innerHeight};});
      await page.focus('[data-source-id="gri-pasta-patate-2024"] .full-title summary');
      await page.keyboard.down('Shift');await page.keyboard.press('Tab');await page.keyboard.up('Shift');await frame();
      const focus=await page.evaluate(()=>{const e=document.activeElement;const r=e.getBoundingClientRect();const rail=document.querySelector('.results-rail').getBoundingClientRect();return{className:e.className,top:r.top,bottom:r.bottom,railBottom:rail.bottom,entirelyCovered:r.top>=rail.top&&r.bottom<=rail.bottom};});
      scenarios.push({key,theme,kind:'short-viewport',...geometry,focus});
      await page.screenshot({path:new URL(`2026-10-12-fonti-audit-${key}-focus-${theme}.png`,import.meta.url).pathname.slice(1)});
    }
  }
  await page.goto('http://127.0.0.1:4347/note-legali/',{waitUntil:'networkidle0'});
  credits.push(await page.evaluate(()=>({url:location.href,title:document.title,oldProjectVisible:/napoli.?a.?vela|napoliavela/i.test(document.body.innerText),oldOccurrences:document.body.innerText.match(/.{0,35}napoliavela.{0,35}/gi),photoHeading: [...document.querySelectorAll('h2')].find(h=>h.textContent==='Foto')?.id,photoCount:document.querySelectorAll('.crediti li').length,photoHosts:[...new Set([...document.querySelectorAll('.crediti a')].map(a=>new URL(a.href).hostname))],bodoniMention:document.body.innerText.includes('Bodoni'),oldProjectLinks:[...document.querySelectorAll('a[href]')].filter(a=>/napoli.?a.?vela|napoliavela/i.test(a.href)).map(a=>a.getAttribute('href'))})));
  // Frammento non valido: registra la gestione attuale senza correggerla.
  await load('a',false);const oldErrorCount=errors.length;
  await page.evaluate(()=>location.hash='%');await frame();scenarios.push({key:'a',kind:'malformed-fragment',errors:errors.slice(oldErrorCount)});
}finally{await browser.close();}
const result={scope:['a','c','d'],rows,scenarios,credits,external,errors,registry:{count:registro.length,withDescription:registro.filter(s=>s.descrizione).length,withoutPlaces:registro.filter(s=>!s.luoghi.length).length,groups:registro.reduce((r,s)=>(r[s.categoria]=(r[s.categoria]||0)+1,r),{}),transportExamples:registro.filter(s=>/^tp-(caremar|eav)/.test(s.id)).map(s=>({id:s.id,title:s.titolo,category:s.categoria,places:s.luoghi}))}};
fs.writeFileSync(new URL('2026-10-12-fonti-pagina-audit-misure.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({layouts:rows.length,scenarios:scenarios.length,external:external.length,errors,credits},null,2));
