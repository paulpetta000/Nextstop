// Prova della scelta dell'ora «Tutte le ore» nel sito (tranche 2, pezzo 2, scelta di Enrico del 16/10/2026): apre «Data e orari»
// di «Due giorni», tocca «Inizio», sceglie le 11:00 (si va oltre le 19:00), controlla fascia, righe gialle, «Finisci alle 20:00»,
// tastiera ed Esc; axe con il foglio delle ore aperto e dopo; scorrimento di lato; immagini.
// Uso, con il sito acceso: node design/compositore/costruzione/ore.cjs [porta] [cartella immagini]
// Sull'anteprima di Vercel: al posto della porta l'indirizzo della pagina, poi la cartella, poi il link di accesso (_vercel_share)
const fs = require('node:fs'), path = require('node:path');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const PORTA = process.argv[2] || '4343', FOTO = process.argv[3];
const BASE = PORTA.startsWith('http') ? PORTA : `http://localhost:${PORTA}/napoli/itinerari/`, ACCESSO = process.argv[4];
const attesa = ms => new Promise(r => setTimeout(r, ms));
if (FOTO) fs.mkdirSync(FOTO, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, protocolTimeout: 600000, ignoreDefaultArgs: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [], no = [], largo = [];
  let axeTot = 0, axeN = 0, prove = 0;
  if (ACCESSO) await page.goto(ACCESSO, { waitUntil: 'networkidle0', timeout: 120000 });
  page.on('pageerror', e => errori.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|Transition was skipped/.test(m.text())) errori.push(m.text()); });
  const ok = (dove, n, c) => { prove++; if (!c) no.push(`${dove}: ${n}`); };
  // su questo computer, a volte, un file si legge male (axe che non parte): si riprova
  const axe = async (dove, cosa) => {
    for (let n = 0; n < 3 && !(await page.evaluate(() => typeof window.axe?.run === 'function')); n++) await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v => `${v.id}: ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`));
    axeN++; axeTot += r.length; if (r.length) console.log(dove, cosa, '\n  ' + r.join('\n  '));
  };
  const apriFoglio = async () => {
    await page.evaluate(() => { document.querySelector('#app [data-azione="altro"]').click(); });
    await attesa(300);
    await page.evaluate(() => document.querySelector('#foglio [data-f="quando"]').click());
    await attesa(400);
  };
  for (const vista of ['c', 'd']) for (const tema of ['light', 'dark']) for (const [nome, W, H] of [['320', 320, 700], ['390', 390, 844], ['pc', 1280, 820]]) {
    const dove = `${vista} ${tema} ${nome}`;
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: W < 900, hasTouch: W < 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
    await page.evaluate(v => { localStorage.clear(); localStorage.setItem('compositore-vista', v); }, vista);
    await page.goto(`${BASE}?pronto=due-giorni&v=${Date.now()}`, { waitUntil: 'networkidle0', timeout: 120000 });
    await attesa(900);
    await apriFoglio();
    let s = await page.evaluate(() => ({ i: document.querySelector('#f-inizio')?.tagName, iv: document.querySelector('#f-inizio-v')?.textContent, fv: document.querySelector('#f-fine-v')?.textContent, esito: document.querySelector('.f-ore-esito')?.textContent ?? '', time: document.querySelectorAll('#foglio input[type="time"]').length }));
    ok(dove, `i campi sono pulsanti con 9:30 e 19:00, niente ora del telefono (${JSON.stringify(s)})`, s.i === 'BUTTON' && s.iv === '9:30' && s.fv === '19:00' && s.time === 0);
    ok(dove, `sotto i campi: quando finisci (${s.esito})`, /Finisci alle 18:22, 38 minuti prima delle 19:00\. Ultima tappa: Duomo\./.test(s.esito));
    await page.click('#f-inizio'); await attesa(500);
    s = await page.evaluate(() => ({ open: document.querySelector('#ore').open, fuoco: document.activeElement?.dataset?.m, occhio: document.querySelector('.ore-occhio')?.textContent }));
    ok(dove, `«Inizio» apre il foglio delle ore sulle 9:30 (${JSON.stringify(s)})`, s.open && s.fuoco === '570' && /giorno 1/.test(s.occhio));
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowDown');
    ok(dove, 'frecce: 9:45, poi 10:45', await page.evaluate(() => document.activeElement?.dataset?.m) === '645');
    await page.evaluate(() => document.querySelector('#ore .ore-q[data-m="660"]').scrollIntoView({ block: 'center' }));
    await page.click('#ore .ore-q[data-m="660"]'); await attesa(300);
    s = await page.evaluate(() => ({ modo: document.querySelector('.ore-modo__b[aria-pressed="true"]')?.dataset.k, in: document.querySelectorAll('#ore td.in .ore-q').length, primo: document.querySelector('#ore td.in-primo .ore-q')?.dataset.m, ultimo: document.querySelector('#ore td.in-ultimo .ore-q')?.dataset.m, oltre: document.querySelectorAll('#ore td.oltre .ore-q').length, finisci: document.querySelector('.ore-q--finisci')?.dataset.m, avviso: document.querySelector('#ore .ore-avviso:not([hidden])')?.textContent ?? '', sez: document.querySelectorAll('#ore .ore-sez td.in').length }));
    ok(dove, `11:00: si passa alla fine; fascia intera 11:00–19:00, anche dietro i titoli; righe gialle fino alle 19:52 (${JSON.stringify(s)})`, s.modo === 'fine' && s.in === 33 && s.primo === '660' && s.ultimo === '1140' && s.oltre === 3 && s.finisci === '1185' && s.sez === 2);
    ok(dove, `oltre la fine: chi resta fuori e «Finisci alle 20:00» (${s.avviso})`, /Duomo resta fuori/.test(s.avviso) && /Finisci alle 20:00/.test(s.avviso));
    if (FOTO && (nome !== '320' || vista + tema === 'clight' || vista + tema === 'ddark')) await page.screenshot({ path: path.join(FOTO, `ore-oltre-${vista}-${tema}-${nome}.jpg`), type: 'jpeg', quality: 72 });
    await axe(dove, 'foglio delle ore');
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, ...['#ore', '#ore .ore-scorre'].map(q => { const e = document.querySelector(q); return e.scrollWidth - e.clientWidth; })]);
    if (w[0] > w[1] + 1 || w.slice(2).some(x => x > 1)) largo.push(`${dove} ore: ${w.join(' ')}`);
    await page.click('#ore [data-ore="allunga"]'); await attesa(300);
    s = await page.evaluate(() => ({ avviso: document.querySelector('#ore .ore-avviso').hidden, ultimo: document.querySelector('#ore td.in-ultimo .ore-q')?.dataset.m, libero: document.querySelectorAll('#ore td.in--libero .ore-q').length, piede: document.querySelector('.ore-sel').textContent }));
    ok(dove, `«Finisci alle 20:00»: fine alle 20:00, l avviso sparisce (${JSON.stringify(s)})`, s.avviso && s.ultimo === '1200' && s.libero === 0 && /Dalle 11:00 alle 20:00/.test(s.piede));
    if (FOTO && nome === '390') await page.screenshot({ path: path.join(FOTO, `ore-${vista}-${tema}-390.jpg`), type: 'jpeg', quality: 72 });
    await page.keyboard.press('Escape'); await attesa(450);
    s = await page.evaluate(() => ({ chiuso: !document.querySelector('#ore').open, foglio: document.querySelector('#foglio').open, iv: document.querySelector('#f-inizio-v')?.textContent, fv: document.querySelector('#f-fine-v')?.textContent, fuoco: document.activeElement?.id, esito: document.querySelector('.f-ore-esito')?.textContent ?? '', oltre: !!document.querySelector('.f-ore-esito--oltre') }));
    ok(dove, `Esc chiude solo le ore; i campi dicono 11:00 e 20:00; il fuoco torna su «Fine» (${JSON.stringify(s)})`, s.chiuso && s.foglio && s.iv === '11:00' && s.fv === '20:00' && s.fuoco === 'f-fine');
    ok(dove, `sotto i campi: finisci alle 19:52, 8 minuti prima delle 20:00 (${s.esito})`, /Finisci alle 19:52, 8 minuti prima delle 20:00/.test(s.esito) && !s.oltre);
    if (FOTO && nome !== '320') await page.screenshot({ path: path.join(FOTO, `data-orari-${vista}-${tema}-${nome}.jpg`), type: 'jpeg', quality: 72 });
    await axe(dove, 'data e orari');
    // le ore restano dopo aver ricaricato la pagina (si salvano come ogni altra modifica)
    if (nome === '390') {
      await page.goto(`${BASE}?v=${Date.now()}`, { waitUntil: 'networkidle0', timeout: 120000 }); await attesa(900);
      await apriFoglio();
      s = await page.evaluate(() => [document.querySelector('#f-inizio-v')?.textContent, document.querySelector('#f-fine-v')?.textContent]);
      ok(dove, `dopo aver ricaricato: 11:00 e 20:00 (${s})`, s[0] === '11:00' && s[1] === '20:00');
    }
  }
  console.log(`prove: ${prove - no.length} riuscite su ${prove}`);
  console.log(`axe: ${axeTot} problemi in ${axeN} controlli`);
  console.log(largo.length ? `scorrimento di lato:\n  ${largo.join('\n  ')}` : 'nessuno scorrimento di lato');
  console.log(no.length ? `prove fallite:\n  ${no.join('\n  ')}` : 'tutte le prove riuscite');
  console.log(errori.length ? `errori:\n  ${[...new Set(errori)].join('\n  ')}` : 'nessun errore nella pagina');
  await browser.close();
  process.exit(no.length || errori.length ? 1 : 0);
})();
