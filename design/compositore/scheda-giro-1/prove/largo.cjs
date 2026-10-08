const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await page.evaluateOnNewDocument(() => { localStorage.setItem('prova-scheda-idea', '1'); localStorage.setItem('prova-scheda-scorri', '1'); });
  const fuori = [];
  for (const w of [320, 390]) for (const tema of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }]);
    await page.setViewport({ width: w, height: 700, isMobile: true, hasTouch: true });
    for (const p of ['c', 'd']) for (const q of [1, 2, 3, 4]) {
      await page.goto(`http://localhost:4332/scheda-giro-1/proposte-locale.html?v=${Date.now()}#${p}${q}`, { waitUntil: 'load' }); await attesa(400);
      const l1 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.evaluate(() => document.querySelectorAll('.giorno-attivo [data-azione="tappa"]')[3].click()); await attesa(800);
      const l2 = await page.evaluate(() => { const d = document.documentElement.scrollWidth - document.documentElement.clientWidth; const s = document.querySelector('#scheda[open]'); const larghi = s ? [...s.querySelectorAll('*')].filter(x => { const r = x.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !x.closest('.sch4__binario') && !x.closest('.sch1__pannello') ; }).length : 0; return d + larghi; });
      if (l1 || l2) fuori.push(`${w} ${tema} ${p}${q}: giornata ${l1}, scheda ${l2}`);
    }
  }
  console.log(fuori.length ? fuori.join('\n') : 'nessuno scorrimento di lato a 320 e 390 px', errori.length ? '\n' + [...new Set(errori)].join('\n') : '');
  await browser.close();
})();
