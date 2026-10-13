// Catture della ricerca prima/dopo, in un profilo di prova senza richieste esterne.
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer=require('puppeteer-core');
const sharp=createRequire(new URL('../../../../package.json',import.meta.url))('sharp');
const before=process.argv.includes('--prima');
const out=new URL('verifiche/',import.meta.url);
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--no-first-run']});
try{
  const page=await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():r.abort());
  for(const theme of ['light','dark'])for(const width of [390,1280]){
    await page.setViewport({width,height:880});
    await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'no-preference'}]);
    await page.goto('http://127.0.0.1:4348/design/fonti/pagina-generale/giro-2/d-lungo.html',{waitUntil:'networkidle0'});
    await page.evaluate(()=>document.fonts.ready);
    await page.$eval('#registro',e=>e.scrollIntoView({block:'start'}));
    for(const active of [false,true]){
      if(active)await page.focus('#cerca-fonti');
      await page.evaluate(()=>new Promise(r=>setTimeout(r,350)));
      await page.screenshot({path:new URL(`ricerca-${before?'prima':'dopo'}-${width}-${theme}-${active?'attiva':'riposo'}.png`,out).pathname.replace(/^\//,'')});
    }
  }
}finally{await browser.close();}
if(!before){
  const left=await sharp(fs.readFileSync(new URL('ricerca-prima-390-light-attiva.png',out))).resize(312,704).toBuffer();
  const right=await sharp(fs.readFileSync(new URL('ricerca-dopo-390-light-attiva.png',out))).resize(312,704).toBuffer();
  await sharp({create:{width:640,height:704,channels:3,background:'#ECEAE4'}}).composite([{input:left,left:0,top:0},{input:right,left:328,top:0}]).png().toFile(new URL('ricerca-prima-dopo.png',out).pathname.replace(/^\//,''));
}
console.log(before?'Otto schermate prima della rifinitura.':'Otto schermate aggiornate e confronto alla stessa scala.');
