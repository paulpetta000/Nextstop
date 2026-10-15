// Immagini e controlli delle proposte (calendario e barre): axe, scorrimento di lato a 320 e 390 px, errori nella pagina.
// Uso, con il server acceso (preview «proposte2», porta 4342):
//   node design/compositore/rifiniture-2/calendario-giro-1/foto.cjs [porta] [cartella immagini]
const fs = require('node:fs'), path = require('node:path');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const PORTA = process.argv[2] || '4342', FOTO = process.argv[3];
const URL_ = `http://localhost:${PORTA}/rifiniture-2/calendario-giro-1/proposte.html`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
if (FOTO) fs.mkdirSync(FOTO, { recursive: true });

const D = '2026-10-20'; // un martedì: con «Due giorni» MANN e Cappella Sansevero chiusi il giorno 1, Palazzo Reale il giorno 2
const STATI = [
  ['cal1-chiuso', 'pezzo=cal&p=1', null],
  ['cal1', `pezzo=cal&p=1&d=${D}`, '.campo__b'],
  ['cal2', `pezzo=cal&p=2&d=${D}`, null],
  ['cal3', `pezzo=cal&p=3&d=${D}`, '.campo__b'],
  ['barre1', 'pezzo=barre&p=1', null],
  ['barre2', 'pezzo=barre&p=2', null]
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [], largo = [];
  page.on('pageerror', e => errori.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errori.push(m.text()); });
  let tot = 0, n = 0;
  for (const v of ['c', 'd']) for (const t of ['light', 'dark']) for (const [nome, W, H] of [['320', 320, 700], ['390', 390, 844], ['pc', 1280, 820]]) {
    const tel = W < 900;
    await page.setViewport({ width: W, height: H, deviceScaleFactor: tel ? 2 : 1, isMobile: tel, hasTouch: tel });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const [stato, h, clic] of STATI) {
      await page.goto(`${URL_}?v=${Date.now()}#${h}&v=${v}&t=${t}`, { waitUntil: 'load' });
      await attesa(250);
      if (clic) { await page.click(clic); await attesa(350); }
      if (stato.startsWith('barre')) await page.evaluate(() => { const s = document.querySelector('.f-scorre'); s.scrollTop = s.scrollHeight * .35; });
      await attesa(150);
      const dove = `${v} ${t} ${nome} ${stato}`;
      await page.addScriptTag({ path: AXE });
      const r = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(x => `${x.id}: ${x.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`));
      n++; tot += r.length; if (r.length) console.log(dove, '\n  ' + r.join('\n  '));
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, ...[...document.querySelectorAll('.foglio, .f-scorre, .mesi[open], .mz-scorre, .m1')].map(e => e.scrollWidth - e.clientWidth)]);
      if (w[0] > w[1] + 1 || w.slice(2).some(x => x > 1)) largo.push(`${dove}: ${w.join(' ')}`);
      if (FOTO && nome !== '320') await page.screenshot({ path: path.join(FOTO, `${stato}-${v}-${t}-${nome}.jpg`), type: 'jpeg', quality: 72 });
      if (FOTO && nome === '320' && v === 'c' && t === 'light') await page.screenshot({ path: path.join(FOTO, `${stato}-${v}-${t}-320.jpg`), type: 'jpeg', quality: 72 });
    }
  }
  console.log(`axe: ${tot} problemi in ${n} controlli`);
  console.log(largo.length ? `scorrimento di lato:\n  ${largo.join('\n  ')}` : 'nessuno scorrimento di lato');
  console.log(errori.length ? `errori:\n  ${[...new Set(errori)].join('\n  ')}` : 'nessun errore nella pagina');
  await browser.close();
})();
