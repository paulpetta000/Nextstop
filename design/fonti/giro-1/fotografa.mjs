// Immagini di confronto, sempre nel browser temporaneo dei bozzetti.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const toolRequire = createRequire('C:/Users/Windows11/tools/controlli/package.json');
const { default: sharp } = await import('sharp');
const puppeteer = toolRequire('puppeteer-core');
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'verifiche');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
const page = await browser.newPage();
const checks = [];
const axe = fs.readFileSync(toolRequire.resolve('axe-core/axe.min.js'), 'utf8');
try {
  // Ultima lettura dopo le sole rifiniture delle note: tutti i casi e i viewport minimi.
  for (const key of ['a','b','c','d']) for (const theme of ['light','dark']) {
    await page.emulateMediaFeatures([{ name:'prefers-color-scheme', value:theme }]);
    for (const scenario of ['','-lungo','-breve','-vuoto']) {
      await page.goto(`http://127.0.0.1:4343/design/fonti/giro-1/${key}${scenario}.html`, { waitUntil:'networkidle0' });
      await page.evaluate(() => { const d=document.querySelector('.disclosure'); if(d)d.open=true; return document.fonts.ready; });
      for (const width of [320,390,1280]) {
        await page.setViewport({ width, height:844, deviceScaleFactor:1 });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        assert.equal(overflow,false,`${key}${scenario} ${theme} ${width}`);
        checks.push({key,scenario,theme,width,overflow});
      }
      if (scenario === '') {
        await page.setViewport({width:390,height:844,deviceScaleFactor:1});
        await page.addScriptTag({ content:axe });
        const violations=await page.evaluate(async()=> (await axe.run()).violations.map(v=>v.id));
        assert.deepEqual(violations,[],`${key} ${theme}: axe delle note finali`);
        await page.evaluate(()=>window.scrollTo(0,document.querySelector('.disclosure').getBoundingClientRect().top+scrollY-16));
        await page.screenshot({path:path.join(dir,`${key}-390-${theme}-pannello.png`)});
      }
    }
  }
} finally { await browser.close(); }
for (const theme of ['light','dark']) {
  const bg = theme === 'light' ? '#F7F6F2' : '#0F1524';
  const fg = theme === 'light' ? '#16181D' : '#EEF0F4';
  const names = ['A · Margine di rivista','B · Indice dei luoghi','C · Informazione e prova','D · Quaderno di viaggio'];
  const titles = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1656" height="64"><rect width="1656" height="64" fill="${bg}"/>${names.map((n,i)=>`<text x="${20+i*412}" y="38" font-family="Arial,sans-serif" font-size="20" font-weight="600" fill="${fg}">${n}</text>`).join('')}</svg>`);
  await sharp({create:{width:1656,height:924,channels:4,background:bg}}).composite([{input:titles,left:0,top:0},...['a','b','c','d'].map((key,i)=>({input:path.join(dir,`${key}-390-${theme}-pannello.png`),left:20+i*412,top:64}))]).png().toFile(path.join(dir,`confronto-telefono-${theme}.png`));
}
fs.writeFileSync(path.join(dir,'note-finali.json'),JSON.stringify({checks,axeExtra:8,failures:[]},null,2)+'\n');
console.log('96 misure finali, 8 scansioni axe delle note, due immagini di confronto.');
