// Controlli del compositore nel sito (costruzione, specifiche/compositore.md): axe in chiaro e scuro, telefono (320 e 390 px) e
// computer, nelle viste C e D e nei fogli; nessuno scorrimento di lato; nessun errore in console. Con una cartella, le immagini.
// Uso, con il sito acceso (npm run build, poi «astro preview --port 4336»):
//   node design/compositore/costruzione/controlli.cjs [porta] [cartella immagini]
const fs = require('node:fs'), path = require('node:path');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const PORTA = process.argv[2] || '4336', FOTO = process.argv[3];
const BASE = `http://localhost:${PORTA}/napoli/itinerari/`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
if (FOTO) fs.mkdirSync(FOTO, { recursive: true });

// gli stati: [nome, funzione nella pagina che ci porta]
const clic = sel => `(() => { const b = document.querySelector(${JSON.stringify(sel)}); if (!b) throw new Error('manca ' + ${JSON.stringify(sel)}); b.click(); })()`;
const STATI = [
  ['vuoto', null],
  ['pronto', `location.href = '${BASE}?pronto=due-giorni'`],
  ['scheda', clic('.giorno-attivo [data-azione="tappa"]')],
  ['scheda tutta', clic('#scheda [data-azione="detent"]')],
  ['salvato', `(() => { document.querySelector('#scheda .sch1__chiudi')?.click(); document.querySelector('.cmp .salva').click(); })()`],
  ['visitata', clic('.giorno-attivo [data-azione="visitata"]')],
  ['aggiungi', clic('#app [data-azione="aggiungi"]')],
  ['ricerca', `(() => { const i = document.querySelector('#f-q'); i.value = 'sfogliatela'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`],
  ['ricerca mappa', clic('#foglio [data-fv="mappa"]')],
  ['pause', `(() => { document.querySelector('#foglio').close(); document.querySelector('#app [data-azione="tempo"]').click(); })()`],
  ['data', `(() => { document.querySelector('#foglio').close(); document.querySelector('#app [data-azione="altro"]').click(); document.querySelector('#foglio [data-f="quando"]').click(); })()`],
  ['miei', `(() => { document.querySelector('#foglio').close(); document.querySelector('#app [data-azione="altro"]').click(); setTimeout(() => {}, 0); })()`],
  ['giorno 2', `(() => { document.querySelector('#foglio').close(); document.querySelector('#app [data-azione="giorno"][data-g="1"]').click(); })()`],
  ['giorno vuoto', `(() => { document.querySelector('#app [data-azione="nuovo-giorno"]').click(); })()`]
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, protocolTimeout: 600000, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [], largo = [];
  page.on('pageerror', e => errori.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|Transition was skipped/.test(m.text())) errori.push(m.text()); });
  let tot = 0, n = 0;
  const controlla = async dove => {
    await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(async () => {
      const s = document.createElement('style'); s.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; document.head.append(s);
      const x = await axe.run(document, { resultTypes: ['violations'] }); s.remove();
      return x.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')} — ${v.nodes[0]?.failureSummary?.split('\n')[1] ?? ''}`);
    });
    n++; tot += r.length;
    if (r.length) console.log('\n' + dove, '\n  ' + r.join('\n  '));
  };
  const lato = async dove => {
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, [...document.querySelectorAll('#foglio[open], #scheda[open]')].map(d => d.scrollWidth - d.clientWidth)]);
    if (w[0] > w[1] + 1 || w[2].some(x => x > 1)) largo.push(`${dove}: ${w[0]} > ${w[1]} ${w[2].join(',')}`);
  };
  for (const vista of ['c', 'd']) for (const tema of ['light', 'dark']) for (const [nome, W, H] of [['320', 320, 700], ['390', 390, 844], ['pc', 1280, 820]]) {
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: W < 900, hasTouch: W < 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await page.evaluate(v => { localStorage.clear(); localStorage.setItem('compositore-vista', v); }, vista);
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    for (const [stato, js] of STATI) {
      if (js) {
        try { await page.evaluate(js); } catch (e) { errori.push(`${vista} ${tema} ${nome} ${stato}: ${e.message.split('\n')[0]}`); continue; }
        if (stato === 'pronto') await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
        if (stato === 'miei') { await attesa(200); await page.evaluate(() => document.querySelector('#foglio [data-f="miei"]')?.click()); }
        await attesa(stato === 'pronto' ? 1200 : 500);
      } else await attesa(800);
      const dove = `${vista} ${tema} ${nome} ${stato}`;
      if (nome !== 'pc' || ['vuoto', 'pronto', 'scheda', 'aggiungi', 'miei'].includes(stato)) await controlla(dove);
      if (nome !== 'pc') await lato(dove);
      if (FOTO && (nome === '390' || nome === 'pc')) await page.screenshot({ path: path.join(FOTO, `${vista}-${tema}-${nome}-${stato.replace(/ /g, '-')}.jpg`), type: 'jpeg', quality: 70 });
    }
  }
  console.log(`\naxe: ${tot} problemi in ${n} controlli`);
  console.log(largo.length ? `scorrimento di lato:\n  ${largo.join('\n  ')}` : 'nessuno scorrimento di lato');
  console.log(errori.length ? `errori:\n  ${[...new Set(errori)].join('\n  ')}` : 'nessun errore nella pagina');
  await browser.close();
})();
