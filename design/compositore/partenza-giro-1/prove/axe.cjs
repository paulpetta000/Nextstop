// Pezzo 4, giro 1: axe in chiaro e scuro, telefono e computer, nelle 4 proposte in C e D, con i fogli e le scelte aperte;
// e lo scorrimento di lato a 320 e 390 px negli stessi stati. Uso, con il server della copia acceso (porta 4333):
// node design/compositore/partenza-giro-1/prove/axe.cjs
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const URL = 'http://localhost:4333/partenza-giro-1/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
// gli stati da controllare per ogni proposta: [nome, gesti]
const STATI = {
  1: [['vuoto', []], ['foglio mappa', ['[data-azione="via-1"]']], ['foglio elenco', ['[data-azione="via-1"]', '[data-v1="elenco"]']], ['scelta', ['[data-azione="via-1"]', '[data-v1="qui"]', '[data-v1f="qui"]', '[data-v1f="ok"]']]],
  2: [['vuoto', []], ['segno sulla mappa', ['[data-azione="via-2"]']], ['scelta', ['[data-azione="via-2"]', '.posa-carta [data-ps="montesanto"]', '.posa-carta [data-pa="ok"]']]],
  3: [['domanda', []], ['stazioni', ['.giorno-attivo .dm [data-v="staz"]']], ['mappa', ['.giorno-attivo .dm [data-v="mappa"]']], ['risposta e ordine', ['.giorno-attivo .dm [data-v="qui"]']], ['saltata', ['.giorno-attivo [data-azione="dm-salta"]']]],
  4: [['vuoto', []], ['foglio', ['[data-azione="via-4"]']], ['scelta e ritorno', ['[data-azione="via-4"]', '#v4-ris [data-punto]', '[data-azione="via-4"]', '[data-int="torno"]']]]
};
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, protocolTimeout: 600000 });
  const page = await browser.newPage();
  const errori = [], largo = [];
  page.on('pageerror', e => errori.push(e.message));
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-partenza-idea-1', '1'); } catch {} });
  let tot = 0, n = 0;
  const controlla = async dove => {
    await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(async () => { const s = document.createElement('style'); s.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; document.head.append(s); const x = await axe.run(document, { resultTypes: ['violations'] }); s.remove(); return x.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')} — ${v.nodes[0]?.failureSummary?.split('\n')[1] ?? ''}`); });
    n++; tot += r.length;
    if (r.length) console.log(dove, '\n  ' + r.join('\n  '));
  };
  const fai = async gesti => { for (const sel of gesti) { await page.waitForSelector(sel, { timeout: 4000 }); await page.evaluate(sel => document.querySelector(sel).click(), sel); await attesa(500); } };
  for (const [w, h] of [[390, 844], [1440, 900]]) for (const tema of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const p of ['c', 'd']) for (const v of [1, 2, 3, 4]) for (const [nome, gesti] of STATI[v]) {
      await page.setViewport({ width: w, height: h, isMobile: w < 900, hasTouch: w < 900 });
      await page.evaluate(() => { try { localStorage.removeItem('prova-partenza-1'); } catch {} }).catch(() => {});
      await page.goto(`${URL}?v=${Date.now()}#${p}${v}`, { waitUntil: 'load' }); await attesa(400);
      await fai(gesti);
      process.stdout.write(`.${p}${v}`); await controlla(`${w} ${tema} ${p}${v} ${nome}`);
      if (w < 900 && tema === 'light') for (const x of [320, 390]) {
        await page.setViewport({ width: x, height: 760, isMobile: true, hasTouch: true }); await attesa(250);
        const troppo = await page.evaluate(() => { const f = document.querySelector('#foglio'), c = document.querySelector('.posa-carta'); return Math.max(document.documentElement.scrollWidth - innerWidth, f?.open ? f.scrollWidth - f.clientWidth : 0, c ? c.scrollWidth - c.clientWidth - (c.querySelector('.posa-carta__staz') ? 0 : 0) : 0); });
        if (troppo > 0) largo.push(`${p}${v} ${nome} ${x}px: ${troppo}px di troppo`);
      }
    }
  }
  console.log(`axe: ${n} controlli, ${tot} problemi`);
  console.log(largo.length ? largo.join('\n') : 'nessuno scorrimento di lato a 320 e 390 px');
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore nella pagina');
  await browser.close();
})();
