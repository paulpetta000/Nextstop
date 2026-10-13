// Pezzo 3, giro 2: immagini da telefono (390) dei 4 segni della parola trovata (riquadro 2) in C e D, in chiaro e scuro, con tre ricerche;
// controlla anche lo scorrimento di lato a 320 e 390 px e gli errori della pagina.
// Uso, con il server della copia acceso (porta 4333): node prove/foto.cjs <cartella> [light,dark]
const path = require('node:path'), fs = require('node:fs');
const sharp = require('C:/Users/Windows11/Documents/nextstop/node_modules/sharp');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const OUT = process.argv[2], TEMI = (process.argv[3] || 'light,dark').split(',');
const URL = 'http://localhost:4333/ricerca-giro-2/proposte-locale.html';
const RICERCHE = [['catacombe', 'catacombe'], ['napoli', 'Napoli'], ['sfoglia', 'sfogliatela']];
const attesa = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [], largo = [];
  page.on('pageerror', e => errori.push(e.message));
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-ricerca-idea-2', '1'); localStorage.removeItem('prova-ricerca-2'); } catch {} });
  const cerca = async q => { await page.evaluate(q => { const i = document.querySelector('#f-q'); i.value = q; i.dispatchEvent(new Event('input', { bubbles: true })); i.blur(); }, q); await attesa(900); };
  for (const tema of TEMI) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }]);
    for (const p of ['c', 'd']) for (const r of [1, 2, 3, 4]) {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await page.goto(`${URL}?v=${Date.now()}#${p}${r}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready); await attesa(600);
      await page.evaluate(() => document.querySelector('#p-cerca').click()); await attesa(700);
      for (const [nome, q] of RICERCHE) {
        await cerca(q);
        // il foglio scorre fino alla casella di ricerca: si vedono le parole e i risultati
        await page.evaluate(() => { const f = document.querySelector('#foglio'); f.scrollTop = document.querySelector('.f-cerca').offsetTop - 84; });
        await attesa(300);
        await page.screenshot({ path: path.join(OUT, `r${r}-${p}-${nome}-${tema}.png`) });
      }
      for (const w of [320, 390]) {
        await page.setViewport({ width: w, height: 760, deviceScaleFactor: 1, isMobile: true, hasTouch: true }); await attesa(250);
        const x = await page.evaluate(() => { const f = document.querySelector('#foglio'); return Math.max(document.documentElement.scrollWidth - innerWidth, f.scrollWidth - f.clientWidth); });
        if (x > 0) largo.push(`${p}${r} ${tema} ${w}px: ${x}px di troppo`);
      }
    }
  }
  await browser.close();
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore nella pagina');
  console.log(largo.length ? largo.join('\n') : 'nessuno scorrimento di lato a 320 e 390 px');
  // un foglio per ricerca e tema: quattro colonne (segno 1-4), due righe (C, D)
  for (const tema of TEMI) for (const [nome] of RICERCHE) {
    const W = 780, H = 1688, G = 30, img = [], C = 4;
    for (const p of ['c', 'd']) for (const r of [1, 2, 3, 4]) img.push(await sharp(fs.readFileSync(path.join(OUT, `r${r}-${p}-${nome}-${tema}.png`))).resize(W, H, { fit: 'cover', position: 'top' }).toBuffer());
    const buf = await sharp({ create: { width: C * (W + G) + G, height: 2 * (H + G) + G, channels: 3, background: '#30353c' } }).composite(img.map((b, i) => ({ input: b, left: G + (i % C) * (W + G), top: G + Math.floor(i / C) * (H + G) }))).png().toBuffer();
    await sharp(buf).resize({ width: 2200 }).jpeg({ quality: 80 }).toFile(path.join(OUT, `${nome}-${tema === 'light' ? 'chiaro' : 'scuro'}.jpg`));
  }
  console.log('Fatto');
})();
