// Giro 2: immagini da telefono (390) del timbro 1, 2, 3 in C e D: scheda aperta da visitare, poi visitata; la giornata
// con il consiglio dell'ordine più corto (dopo aver spostato la prima tappa in fondo) e la barra del tempo.
// Uso, con il server della copia acceso (porta 4333): node prove/foto2.cjs <cartella> [light,dark]
const path = require('node:path'), fs = require('node:fs');
const sharp = require('C:/Users/Windows11/Documents/nextstop/node_modules/sharp');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const OUT = process.argv[2], TEMI = (process.argv[3] || 'light,dark').split(',');
const URL = 'http://localhost:4333/scheda-giro-2/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-scheda-idea-2', '1'); localStorage.removeItem('prova-scheda-2'); } catch {} });
  for (const tema of TEMI) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    for (const p of ['c', 'd']) for (const t of [1, 2, 3]) {
      await page.goto(`${URL}?v=${Date.now()}#${p}${t}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready); await attesa(500);
      await page.evaluate(() => document.querySelectorAll('.giorno-attivo [data-azione="tappa"]')[3].click()); await attesa(900);
      await page.screenshot({ path: path.join(OUT, `t${t}-${p}-aperta-${tema}.png`) });
      await page.evaluate(() => document.querySelector('#scheda .timbro').click()); await attesa(700);
      await page.screenshot({ path: path.join(OUT, `t${t}-${p}-visitata-${tema}.png`) });
      if (t === 1) {
        // la giornata: il Duomo spostato al secondo posto (frecce sulla maniglia), poi il consiglio
        await page.keyboard.press('Escape'); await attesa(400);
        for (let k = 0; k < 5; k++) { await page.focus('.giorno-attivo [data-maniglia="duomo"]'); await page.keyboard.press('ArrowUp'); await attesa(150); }
        await page.evaluate(() => { const c = document.querySelector('.giorno-attivo .consiglio') || document.querySelector('.giorno-attivo .tempo'); const y = c.getBoundingClientRect().top + scrollY - 260; scrollTo(0, y); });
        await attesa(400);
        await page.screenshot({ path: path.join(OUT, `t1-${p}-consiglio-${tema}.png`) });
        console.log(p, tema, 'consiglio:', await page.evaluate(() => document.querySelector('.giorno-attivo .consiglio')?.textContent.replace(/\s+/g, ' ').trim() ?? 'NESSUNO'));
      }
    }
  }
  await browser.close();
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore');
  // fogli: per tema, una riga per vista con timbro 1-3 (aperta, visitata) e il consiglio
  for (const tema of TEMI) {
    const files = ['c', 'd'].flatMap(p => [1, 2, 3].flatMap(t => ['aperta', 'visitata'].map(s => path.join(OUT, `t${t}-${p}-${s}-${tema}.png`))));
    const W = 780, H = 1688, G = 30, img = [];
    for (const f of files) img.push(await sharp(fs.readFileSync(f)).resize(W, H, { fit: 'cover', position: 'top' }).toBuffer());
    const cols = 6;
    const buf = await sharp({ create: { width: cols * (W + G) + G, height: 2 * (H + G) + G, channels: 3, background: '#30353c' } }).composite(img.map((b, i) => ({ input: b, left: G + (i % cols) * (W + G), top: G + Math.floor(i / cols) * (H + G) }))).png().toBuffer();
    await sharp(buf).resize({ width: 2600 }).jpeg({ quality: 80 }).toFile(path.join(OUT, `timbri-${tema === 'light' ? 'chiaro' : 'scuro'}.jpg`));
    const cons = ['c', 'd'].map(p => path.join(OUT, `t1-${p}-consiglio-${tema}.png`)), ci = [];
    for (const f of cons) ci.push(await sharp(fs.readFileSync(f)).resize(780, 1688, { fit: 'cover', position: 'top' }).toBuffer());
    const b2 = await sharp({ create: { width: 2 * (780 + G) + G, height: 1688 + 2 * G, channels: 3, background: '#30353c' } }).composite(ci.map((b, i) => ({ input: b, left: G + i * (780 + G), top: G }))).png().toBuffer();
    await sharp(b2).resize({ width: 1400 }).jpeg({ quality: 80 }).toFile(path.join(OUT, `consiglio-${tema === 'light' ? 'chiaro' : 'scuro'}.jpg`));
  }
  console.log('Fatto');
})();
