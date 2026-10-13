// Pezzo 6, prima prova: immagini da telefono (390) della mappa in C e D, chiaro e scuro, «Prima» (strade piccole solo nella zona dei
// due giorni) e «A pezzi» (tutta la città); controlla lo scorrimento di lato a 320 e 390 px, gli errori e i pezzi scaricati.
// Uso, con il server della copia acceso: node prove/foto.cjs <cartella> [light,dark] [porta]
const path = require('node:path'), fs = require('node:fs');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const OUT = process.argv[2], TEMI = (process.argv[3] || 'light,dark').split(','), PORTA = process.argv[4] || '4333';
const URL = `http://localhost:${PORTA}/mappa-giro-1/proposte-locale.html`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
// posti nelle unità della mappa (src/data/mappa.json: 1 unità = 5 m) e quanti px ogni unità
const VISTE = {
  centro: { c: null, s: 3.2, modi: [2], bordi: true },               // il centro del giorno 1 (Spaccanapoli e via dei Tribunali), con i bordi dei pezzi
  mergellina: { c: [1398, 1000], s: 2.4, modi: [1, 2], bordi: false } // fuori dalla zona dei due giorni: prima vuota, ora con i vicoli
};
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [], largo = [], pezzi = [];
  page.on('pageerror', e => errori.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });
  page.on('request', r => { if (r.url().includes('/pezzi-256/')) pezzi.push(path.basename(r.url())); });
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-mappa-idea-1', '1'); } catch {} });
  // in D sul telefono la mappa si apre con il pulsante «Mappa»
  const mappa = () => page.evaluate(async () => { if (!(window.PROVA_MAPPE || []).some(x => x.el.isConnected && x.el.clientWidth > 0)) { document.querySelector('[data-azione="mappa-d"]').click(); await new Promise(r => setTimeout(r, 900)); } const m = window.PROVA_MAPPE.filter(x => x.el.isConnected && x.el.clientWidth > 0).pop(); m.el.scrollIntoView({ block: 'center' }); return true; });
  for (const tema of TEMI) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const p of ['c', 'd']) for (const modo of [1, 2]) {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      pezzi.length = 0;
      await page.goto(`${URL}?v=${Date.now()}#${p}${modo}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready); await attesa(900);
      await mappa(); await attesa(500);
      await page.screenshot({ path: path.join(OUT, `${p}-${modo === 2 ? 'pezzi' : 'prima'}-giorno-${tema}.png`) });
      const giorno = pezzi.length;
      for (const [nome, v] of Object.entries(VISTE)) {
        if (!v.modi.includes(modo)) continue;
        await page.evaluate(({ c, s, bordi }) => {
          document.documentElement.classList.toggle('bordi-su', bordi);
          const m = window.PROVA_MAPPE.filter(x => x.el.isConnected && x.el.clientWidth > 0).pop();
          const W = m.el.clientWidth, H = m.el.clientHeight, w = W / s, h = H / s;
          c ??= [(m.box.x1 + m.box.x2) / 2, (m.box.y1 + m.box.y2) / 2];
          m.mosso = true; m.metti(m.limita({ x: c[0] - w / 2, y: c[1] - h / 2, w, h })); m.nomiVisibili();
        }, v);
        await attesa(1200);
        await page.screenshot({ path: path.join(OUT, `${p}-${modo === 2 ? 'pezzi' : 'prima'}-${nome}-${tema}.png`) });
      }
      if (modo === 2) console.log(`${p} ${tema}: pezzi scaricati con il giorno ${giorno}, in tutto ${pezzi.length}`);
      for (const w of [320, 390]) {
        await page.setViewport({ width: w, height: 760, deviceScaleFactor: 1, isMobile: true, hasTouch: true }); await attesa(250);
        const x = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        if (x > 0) largo.push(`${p}${modo} ${tema} ${w}px: ${x}px di troppo`);
      }
    }
  }
  await browser.close();
  console.log('errori:', errori.length ? [...new Set(errori)].join(' | ') : 'nessuno');
  console.log('scorrimento di lato:', largo.length ? largo.join('; ') : 'nessuno');
})();
