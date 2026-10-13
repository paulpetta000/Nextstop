// Tre risposte al gesto: attivazione, risultati, ritorno. Nessun editore contattato.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const sharp=createRequire(new URL('../../../../package.json',import.meta.url))('sharp');
const out=path.join(path.dirname(fileURLToPath(import.meta.url)),'verifiche');
const base='http://127.0.0.1:4348/design/fonti/pagina-generale/giro-2/';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
const page=await browser.newPage(),rows=[],errors=[],external=[];let navigation=0;
await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():(external.push(r.url()),r.abort()));page.on('pageerror',e=>errors.push(e.message));
const frames=[];
const inspect=()=>page.evaluate(()=>{
  const active=[...document.querySelectorAll('.topics,.empty,[data-status] span,.search-symbol,.search-field')].flatMap(e=>e.getAnimations({subtree:true}).filter(a=>a.playState!=='finished').map(a=>({id:a.id,duration:a.effect.getTiming().duration,frames:a.effect.getKeyframes().map(f=>({opacity:f.opacity,transform:f.transform}))})));
  return{overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,field:document.querySelector('#cerca-fonti').getBoundingClientRect().toJSON(),active,query:document.querySelector('#cerca-fonti').value,status:document.querySelector('[data-status]').textContent,focus:document.activeElement.id};
});
const dispatch=async value=>page.$eval('#cerca-fonti',(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},value);
try{
  for(const key of ['a','c','d'])for(const long of [false,true])for(const theme of ['light','dark'])for(const width of [390,1280])for(const reduce of [false,true]){
    await page.setViewport({width,height:1000});await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:reduce?'reduce':'no-preference'}]);
    await page.goto(base+key+(long?'-lungo':'')+'.html?motion='+ ++navigation,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
    if(width===390&&!reduce&&!long)await page.screenshot({path:path.join(out,`${key}-390-${theme}.png`)});
    await page.$eval('#registro',e=>e.scrollIntoView({block:'start'}));
    await page.evaluate(()=>{document.querySelector('#argomento-cucina').open=true;});
    const before=await inspect();await page.focus('#cerca-fonti');const focused=await inspect();
    assert.equal(focused.field.width,before.field.width);assert.equal(focused.field.height,before.field.height);assert.equal(focused.overflow,false);
    const focusCue=await page.$eval('.search-field',e=>({line:getComputedStyle(e,'::after').transform,duration:getComputedStyle(e,'::after').transitionDuration,icon:getComputedStyle(e.querySelector('svg')).transform}));
    if(reduce)assert.equal(focusCue.duration,'0s');else assert.ok(parseFloat(focusCue.duration)>0);
    await dispatch('nennella');const filtered=await inspect();assert.ok(filtered.status.startsWith(long?'3 documenti trovati':'1 documento trovato'),JSON.stringify({key,long,theme,status:filtered.status}));assert.equal(filtered.focus,'cerca-fonti');
    if(reduce)assert.equal(filtered.active.length,0);else assert.ok(filtered.active.some(a=>a.id==='fonti-risultati'));
    assert.equal(filtered.overflow,false);
    if(width===390&&!reduce&&!long){
      await page.evaluate(()=>document.getAnimations().filter(a=>a.id?.startsWith('fonti-')).forEach(a=>{a.pause();a.currentTime=a.effect.getTiming().duration;}));
      await page.screenshot({path:path.join(out,`${key}-ricerca-${theme}.png`)});
    }
    // Il reset tiene il punto di lavoro e anima il ritorno, senza attese nella ricerca.
    await page.click('[data-reset]');const returned=await inspect();
    assert.equal(returned.query,'');assert.equal(returned.focus,'cerca-fonti');assert.equal(returned.overflow,false);
    if(reduce)assert.equal(returned.active.length,0);else assert.ok(returned.active.some(a=>a.id==='fonti-ritorno'));
    assert.equal(await page.$eval('#argomento-cucina',e=>e.open),true);
    rows.push({key,long,theme,width,reduce,before,focused,focusCue,filtered,returned});
    if(width===390&&!reduce&&!long&&key==='d'&&theme==='light'){
      // Fotogrammi del browser ai tempi reali delle animazioni, fermati per la cattura.
      await page.evaluate(()=>document.getAnimations().filter(a=>a.id?.startsWith('fonti-')).forEach(a=>a.cancel()));
      frames.push(await page.screenshot());
      await page.evaluate(()=>document.querySelector('#cerca-fonti').blur());
      await page.focus('#cerca-fonti');
      const capture=async selector=>{
        for(const time of [0,50,100,150,200]){
          await page.$eval(selector,(e,time)=>e.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=Math.min(time,Number(a.effect.getTiming().duration)||200);}),time);
          assert.equal((await inspect()).overflow,false);frames.push(await page.screenshot());
        }
        await page.$eval(selector,e=>e.getAnimations({subtree:true}).forEach(a=>a.cancel()));
      };
      await capture('.search-field');await dispatch('nennella');await capture('.register-content');
      await page.click('[data-reset]');await capture('.register-content');
    }
  }
  // Cambio della preferenza durante un'animazione e assenza della API facoltativa.
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);await dispatch('nennella');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  assert.equal((await inspect()).active.length,0);
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  await page.evaluate(()=>Element.prototype.animate=undefined);await dispatch('eav');assert.ok((await inspect()).status.includes('documenti'));assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  fs.writeFileSync(path.join(out,'movimento.json'),JSON.stringify({rows,livePreference:true,noAnimateFallback:true,errors,external,filmFrames:frames.length},null,2)+'\n');
}finally{await browser.close();}
// Montaggio delle schermate originali, senza alterare il disegno della pagina.
for(const mode of ['aperture','ricerca']){
  const buffers=await Promise.all(['a','c','d'].map(k=>sharp(path.join(out,mode==='aperture'?`${k}-390-light.png`:`${k}-ricerca-light.png`)).resize(312,800).toBuffer()));
  await sharp({create:{width:976,height:800,channels:3,background:'#ECEAE4'}}).composite(buffers.map((input,i)=>({input,left:i*332,top:0}))).png().toFile(path.join(out,`tre-${mode}.png`));
}
for(let i=0;i<frames.length;i++)fs.writeFileSync(path.join(out,`movimento-d-${String(i).padStart(2,'0')}.png`),frames[i]);
console.log(JSON.stringify({cases:rows.length,phases:rows.length*3,frames:frames.length,errors,external},null,2));
