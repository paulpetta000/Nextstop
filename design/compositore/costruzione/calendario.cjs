// Prova del calendario e delle barre nel sito (tranche 2, specifiche/compositore-rifiniture-2.md): apre «Data e orari», tocca il
// campo, sceglie un martedì, controlla fascia, punti, riepilogo, tastiera ed Esc; axe con il calendario aperto; immagini.
// Uso, con il sito acceso: node design/compositore/costruzione/calendario.cjs [porta] [cartella immagini]
// Sull'anteprima di Vercel: al posto della porta l'indirizzo della pagina, poi la cartella, poi il link di accesso (_vercel_share)
const fs = require('node:fs'), path = require('node:path');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const PORTA = process.argv[2] || '4341', FOTO = process.argv[3];
const BASE = PORTA.startsWith('http') ? PORTA : `http://localhost:${PORTA}/napoli/itinerari/`, ACCESSO = process.argv[4];
const attesa = ms => new Promise(r => setTimeout(r, ms));
if (FOTO) fs.mkdirSync(FOTO, { recursive: true });
const MARTEDI = '2026-10-27';

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, protocolTimeout: 600000, ignoreDefaultArgs: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [], no = [], largo = [];
  let axeTot = 0, axeN = 0;
  if (ACCESSO) await page.goto(ACCESSO, { waitUntil: 'networkidle0', timeout: 120000 });
  page.on('pageerror', e => errori.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|Transition was skipped/.test(m.text())) errori.push(m.text()); });
  const ok = (dove, n, c) => { if (!c) no.push(`${dove}: ${n}`); };
  for (const vista of ['c', 'd']) for (const tema of ['light', 'dark']) for (const [nome, W, H] of [['320', 320, 700], ['390', 390, 844], ['pc', 1280, 820]]) {
    const dove = `${vista} ${tema} ${nome}`;
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: W < 900, hasTouch: W < 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
    await page.evaluate(v => { localStorage.clear(); localStorage.setItem('compositore-vista', v); }, vista);
    await page.goto(`${BASE}?pronto=due-giorni&v=${Date.now()}`, { waitUntil: 'networkidle0', timeout: 120000 });
    await attesa(900);
    await page.evaluate(() => { document.querySelector('#app [data-azione="altro"]').click(); });
    await attesa(300);
    await page.evaluate(() => document.querySelector('#foglio [data-f="quando"]').click());
    await attesa(400);
    ok(dove, 'il campo è il pulsante del calendario', await page.$eval('#f-data', b => b.tagName === 'BUTTON' && /Scegli il giorno/.test(b.textContent)));
    await page.click('#f-data'); await attesa(400);
    ok(dove, 'il calendario si apre', await page.$eval('#calendario', d => d.open));
    ok(dove, 'il fuoco è su un giorno', await page.evaluate(() => document.activeElement?.classList.contains('cal-g')));
    await page.evaluate(d => document.querySelector(`#calendario [data-d="${d}"]`).scrollIntoView({ block: 'center' }), MARTEDI);
    await page.click(`#calendario [data-d="${MARTEDI}"]`); await attesa(300);
    const s = await page.evaluate(() => ({
      scelto: document.querySelector('.cal-g--scelto')?.dataset.d,
      fascia: [...document.querySelectorAll('#calendario td.cal-in button')].map(b => b.dataset.d),
      punti: document.querySelectorAll('#calendario .cal-g .cal-punto').length,
      piede: document.querySelector('.cal-sel').textContent
    }));
    ok(dove, 'il martedì è scelto', s.scelto === MARTEDI);
    ok(dove, 'la fascia copre martedì e mercoledì', s.fascia.join() === '2026-10-27,2026-10-28');
    ok(dove, 'i punti gialli ci sono', s.punti > 20);
    ok(dove, `il piede dice le chiusure (${s.piede})`, /3 tappe chiuse/.test(s.piede));
    // la tastiera: freccia a destra e Pagina giù
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('PageDown');
    ok(dove, 'frecce e Pagina giù', await page.evaluate(() => document.activeElement?.dataset.d === '2026-11-28'));
    if (FOTO && nome !== '320') await page.screenshot({ path: path.join(FOTO, `cal-${vista}-${tema}-${nome}.jpg`), type: 'jpeg', quality: 72 });
    await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v => `${v.id}: ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`));
    axeN++; axeTot += r.length; if (r.length) console.log(dove, 'calendario\n  ' + r.join('\n  '));
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.querySelector('#calendario').scrollWidth - document.querySelector('#calendario').clientWidth]);
    if (w[0] > w[1] + 1 || w[2] > 1) largo.push(`${dove}: ${w.join(' ')}`);
    await page.keyboard.press('Escape'); await attesa(400);
    const f = await page.evaluate(() => ({ chiuso: !document.querySelector('#calendario').open, foglio: document.querySelector('#foglio').open, campo: document.querySelector('#f-data-v')?.textContent, riep: document.querySelector('.f-date')?.textContent ?? '', fuoco: document.activeElement?.id }));
    ok(dove, 'Esc chiude solo il calendario', f.chiuso && f.foglio);
    ok(dove, `il campo dice la data (${f.campo})`, /martedì 27 ottobre/.test(f.campo));
    ok(dove, 'il riepilogo dice cosa è chiuso', /MANN/.test(f.riep) && /Palazzo Reale/.test(f.riep));
    ok(dove, 'il fuoco torna sul campo', f.fuoco === 'f-data');
    if (FOTO && nome !== '320') await page.screenshot({ path: path.join(FOTO, `riepilogo-${vista}-${tema}-${nome}.jpg`), type: 'jpeg', quality: 72 });
    await page.addScriptTag({ path: AXE });
    const r2 = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v => `${v.id}: ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`));
    axeN++; axeTot += r2.length; if (r2.length) console.log(dove, 'data e orari\n  ' + r2.join('\n  '));
    // le barre: al computer, il foglio «Aggiungi una tappa» lungo
    if (FOTO && nome === 'pc') {
      await page.evaluate(() => document.querySelector('#foglio').close());
      await page.evaluate(() => document.querySelector('#app [data-azione="aggiungi"]').click()); await attesa(700);
      await page.evaluate(() => { const f = document.querySelector('#foglio'); f.scrollTop = f.scrollHeight * .3; }); await attesa(200);
      await page.screenshot({ path: path.join(FOTO, `barre-${vista}-${tema}-pc.jpg`), type: 'jpeg', quality: 72 });
    }
  }
  console.log(`axe: ${axeTot} problemi in ${axeN} controlli`);
  console.log(largo.length ? `scorrimento di lato:\n  ${largo.join('\n  ')}` : 'nessuno scorrimento di lato');
  console.log(no.length ? `prove fallite:\n  ${no.join('\n  ')}` : 'tutte le prove riuscite');
  console.log(errori.length ? `errori:\n  ${[...new Set(errori)].join('\n  ')}` : 'nessun errore nella pagina');
  await browser.close();
})();
