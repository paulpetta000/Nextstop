// Immagini e controlli delle proposte dell'ora: axe, scorrimento di lato a 320 e 390 px, errori nella pagina; poi i confronti.
// Uso, con il server acceso (preview «proposte2», porta 4342):
//   node design/compositore/rifiniture-2/ora-giro-1/foto.cjs [porta] [cartella immagini]
const fs = require('node:fs'), path = require('node:path');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const PORTA = process.argv[2] || '4342', FOTO = process.argv[3];
const URL_ = `http://localhost:${PORTA}/rifiniture-2/ora-giro-1/proposte.html`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
if (FOTO) fs.mkdirSync(FOTO, { recursive: true });

// stato, indirizzo, dove scorrere il foglio (frazione), che cosa guardare
const STATI = [
  ['p1', 'p=1&g=0', .45],
  ['p1-oltre', 'p=1&g=0&i=11:00', .45],
  ['p2', 'p=2&g=0', .45],
  ['p2-ore', 'p=2&g=0&a=1', 0],
  ['p2-oltre', 'p=2&g=0&i=11:00&a=1&modo=fine', 0],
  ['p3', 'p=3&g=0', .55],
  ['p3-oltre', 'p=3&g=0&i=11:00', .7],
  ['p1-g2', 'p=1&g=1', .45]
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  const errori = [], largo = [];
  page.on('pageerror', e => errori.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errori.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) errori.push(`${r.status()} ${r.url()}`); });
  let tot = 0, n = 0;
  for (const v of ['c', 'd']) for (const t of ['light', 'dark']) for (const [nome, W, H] of [['320', 320, 700], ['390', 390, 844], ['pc', 1280, 820]]) {
    const tel = W < 900;
    await page.setViewport({ width: W, height: H, deviceScaleFactor: tel ? 2 : 1, isMobile: tel, hasTouch: tel });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const [stato, h, scorri] of STATI) {
      await page.goto(`${URL_}?x=${Date.now()}#${h}&v=${v}&t=${t}`, { waitUntil: 'load' });
      await attesa(300);
      await page.evaluate(f => { const s = document.querySelector('.f-scorre'); s.scrollTop = (s.scrollHeight - s.clientHeight) * f; }, scorri);
      await attesa(150);
      const dove = `${v} ${t} ${nome} ${stato}`;
      await page.addScriptTag({ path: AXE });
      const r = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(x => `${x.id}: ${x.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`));
      n++; tot += r.length; if (r.length) console.log(dove, '\n  ' + r.join('\n  '));
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, ...[...document.querySelectorAll('.foglio, .f-scorre, .ore[open], .oz-scorre, .o1, .o3')].map(e => e.scrollWidth - e.clientWidth)]);
      if (w[0] > w[1] + 1 || w.slice(2).some(x => x > 1)) largo.push(`${dove}: ${w.join(' ')}`);
      if (FOTO && (nome !== '320' || (v === 'c' && t === 'light') || (v === 'd' && t === 'dark'))) await page.screenshot({ path: path.join(FOTO, `${stato}-${v}-${t}-${nome}.jpg`), type: 'jpeg', quality: 74 });
    }
  }
  console.log(`axe: ${tot} problemi in ${n} controlli`);
  console.log(largo.length ? `scorrimento di lato:\n  ${largo.join('\n  ')}` : 'nessuno scorrimento di lato');
  console.log(errori.length ? `errori:\n  ${[...new Set(errori)].join('\n  ')}` : 'nessun errore nella pagina');

  // i confronti: una riga per proposta, colonne T1 chiaro, T1 scuro, T2 chiaro, T2 scuro
  if (FOTO) {
    const img = f => fs.existsSync(path.join(FOTO, f)) ? `data:image/jpeg;base64,${fs.readFileSync(path.join(FOTO, f)).toString('base64')}` : '';
    const tavola = async (file, righe, colonne, larghezza) => {
      const html = `<body style="margin:0;background:#1A1B1E;font:600 22px system-ui;color:#eee"><div style="display:grid;grid-template-columns:120px repeat(${colonne.length},${larghezza}px);gap:14px;padding:16px">
        <div></div>${colonne.map(([t]) => `<div>${t}</div>`).join('')}
        ${righe.map(([t, s]) => `<div>${t}</div>${colonne.map(([, c]) => `<img style="width:100%;display:block;border-radius:8px" src="${img(`${s}-${c}.jpg`)}">`).join('')}`).join('')}</div></body>`;
      await page.setViewport({ width: 136 + colonne.length * (larghezza + 14) + 16, height: 400, deviceScaleFactor: 1 });
      await page.setContent(html, { waitUntil: 'load' });
      await page.screenshot({ path: path.join(path.dirname(FOTO), file), type: 'jpeg', quality: 72, fullPage: true });
    };
    const righe = [['1 · La giornata', 'p1'], ['1 · oltre', 'p1-oltre'], ['2 · Tutte le ore', 'p2-ore'], ['2 · oltre', 'p2-oltre'], ['3 · La frase', 'p3'], ['3 · oltre', 'p3-oltre']];
    await tavola('confronto-ora-390.jpg', righe, [['T1 chiaro', 'c-light-390'], ['T1 scuro', 'c-dark-390'], ['T2 chiaro', 'd-light-390'], ['T2 scuro', 'd-dark-390']], 300);
    await tavola('confronto-ora-320.jpg', righe, [['T1 chiaro', 'c-light-320'], ['T2 scuro', 'd-dark-320']], 260);
    await tavola('confronto-ora-computer.jpg', righe, [['T1 chiaro', 'c-light-pc'], ['T2 scuro', 'd-dark-pc']], 560);
    console.log('confronti: confronto-ora-390.jpg, confronto-ora-320.jpg, confronto-ora-computer.jpg');
  }
  await browser.close();
})();
