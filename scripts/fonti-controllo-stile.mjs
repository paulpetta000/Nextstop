import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Windows11/tools/controlli/package.json');
const browser=await require('puppeteer-core').launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const page=await browser.newPage();await page.setViewport({width:390,height:844});
 await page.goto('http://127.0.0.1:4322/napoli/itinerari/',{waitUntil:'networkidle0'});
 await page.click('.disclosure > summary');
 const style=await page.evaluate(()=>({padding:getComputedStyle(document.querySelector('.fonti-pannello .body')).paddingLeft,font:getComputedStyle(document.querySelector('.fonti-pannello .group-head h3')).fontFamily}));
 console.log(style);assert.equal(style.padding,'16px');assert.match(style.font,/Bodoni/);
 await page.setJavaScriptEnabled(false);await page.reload({waitUntil:'networkidle0'});
 await page.$eval('.disclosure',e=>e.open=true);
 const target=await page.$eval('.back-top',a=>document.getElementById(a.hash.slice(1))?.getClientRects().length>0);
 assert.equal(target,true,'Il ritorno senza JavaScript deve raggiungere un elemento visibile');
 await page.setJavaScriptEnabled(true);await page.goto('http://127.0.0.1:4322/fonti/',{waitUntil:'networkidle0'});
 await page.click('#argomento-mappe > summary');
 await page.click('a[href="#fonte-tp-anm-gtfs"]');
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const jump=await page.evaluate(()=>({sourceTop:document.querySelector('#fonte-tp-anm-gtfs').getBoundingClientRect().top,railBottom:document.querySelector('.results-rail').getBoundingClientRect().bottom}));
 console.log(jump);assert.ok(jump.sourceTop>=jump.railBottom,'Il rinvio ANM deve mostrare la fonte sotto la fascia della ricerca');
}finally{await browser.close();}
