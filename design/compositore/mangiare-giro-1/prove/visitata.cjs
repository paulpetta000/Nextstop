// Pezzo 7 (richiesta di Enrico, 14/10/2026): le tre «visitata» della riga in C, chiaro e scuro, a metà animazione e alla fine.
// Uso, con il server della copia acceso: node design/compositore/mangiare-giro-1/prove/visitata.cjs <cartella> [porta]
const path = require('node:path'), fs = require('node:fs');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const OUT = process.argv[2], PORTA = process.argv[3] || '4333';
const URL = `http://localhost:${PORTA}/mangiare-giro-1/proposte-locale.html`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-mangiare-idea-1', '1'); localStorage.removeItem('prova-mangiare-1'); } catch {} });
  for (const tema of ['light', 'dark']) for (const vv of [1, 2, 3]) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }]);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await page.goto(`${URL}?v=${Date.now()}#c${vv}`, { waitUntil: 'load' }); await attesa(2200);
    const box = await page.evaluate(() => { const b = document.querySelectorAll('.giorno-attivo .sv'); const r = b[0].getBoundingClientRect(); scrollBy(0, r.top - 300); const r2 = b[0].getBoundingClientRect(); return { x: 0, y: r2.top + scrollY - 14, width: 220, height: 200 }; });
    await attesa(300);
    await page.evaluate(() => { const b = document.querySelectorAll('.giorno-attivo .sv'); b[0].click(); setTimeout(() => b[1].click(), 60); });
    await attesa(130);
    await page.screenshot({ path: path.join(OUT, `visitata-${vv}-meta-${tema}.png`), clip: box });
    await attesa(900);
    await page.screenshot({ path: path.join(OUT, `visitata-${vv}-${tema}.png`), clip: box });
  }
  await browser.close();
  console.log('fatto');
})();
