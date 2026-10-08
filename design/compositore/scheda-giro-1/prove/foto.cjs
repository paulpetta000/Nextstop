// Immagini del pezzo 2: per ogni proposta, in C e D, la giornata e la scheda aperta (telefono 390, chiaro e scuro)
const path = require('node:path');
const fs = require('node:fs');
const sharp = require('C:/Users/Windows11/Documents/nextstop/node_modules/sharp');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const OUT = process.argv[2];
const SOLO = (process.argv[3] || '1,2,3,4').split(',').map(Number);
const TEMI = (process.argv[4] || 'light,dark').split(',');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:4332/scheda-giro-1/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push('ERR ' + e.message));
  await page.evaluateOnNewDocument(() => { try {
    localStorage.setItem('prova-scheda-idea', '1'); localStorage.setItem('prova-scheda-scorri', '1');
    const t = Date.now();
    localStorage.setItem('prova-scheda-1', JSON.stringify({ nome: 'Due giorni a Napoli', salvato: true, giorni: [['mann', 'tribunali', 'sansevero', 'santa-chiara', 'spaccanapoli', 'san-lorenzo', 'duomo'], ['sant-elmo', 'san-martino', 'pedamentina', 'toledo', 'plebiscito', 'palazzo-reale', 'monte-echia', 'borgo-marinari']], fatte: { mann: t - 7200000, tribunali: t - 3000000 }, pause: {}, margine: 0, data: null, oggi: false }));
  } catch {} });
  for (const tema of TEMI) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    for (const q of SOLO) for (const p of ['c', 'd']) {
      await page.goto(`${URL}?v=${Date.now()}#${p}${q}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await attesa(400);
      // la giornata: le prime tappe
      await page.evaluate(p => { const el = document.querySelector('.giorno-attivo .c-elenco, .giorno-attivo .d-cartoline'); const y = el.getBoundingClientRect().top + scrollY - (p === 'c' ? 150 : 120); scrollTo(0, y); }, p);
      await attesa(300);
      await page.screenshot({ path: path.join(OUT, `q${q}-${p}-giorno-${tema}.png`) });
      // la scheda della terza tappa (Cappella Sansevero)
      await page.evaluate(() => { const b = document.querySelectorAll('.giorno-attivo [data-azione="tappa"]')[3]; b.click(); });
      await attesa(900);
      if (q === 2) await page.evaluate(() => { const a = document.querySelector('.riga-aperta'); scrollTo(0, a.getBoundingClientRect().top + scrollY - 150); });
      await attesa(300);
      await page.screenshot({ path: path.join(OUT, `q${q}-${p}-scheda-${tema}.png`) });
      // la scheda più in basso (1: tirata su; 3: dopo la foto; 4: la scheda dopo)
      if (q === 1) await page.evaluate(() => document.querySelector('.sch1__alza')?.click());
      if (q === 3) await page.evaluate(() => { document.querySelector('.sch3__scorre').scrollTop = 520; });
      if (q === 2) await page.evaluate(() => scrollBy(0, 560));
      if (q === 4) await page.evaluate(() => { const c = document.querySelector('.sch4__carta--qui'); c.scrollTop = 420; });
      await attesa(700);
      await page.screenshot({ path: path.join(OUT, `q${q}-${p}-sotto-${tema}.png`) });
    }
  }
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore');
  await browser.close();
  console.log('Fatto');
})();
