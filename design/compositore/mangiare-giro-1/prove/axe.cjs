// Pezzo 7, giro 1: axe in chiaro e scuro, telefono e computer, nelle 4 proposte in C e D, con la riga, i fogli e la cena («Sera»);
// lo scorrimento di lato a 320 e 390 px negli stessi stati; con un terzo argomento salva le immagini da telefono (390).
// Uso, con il server della copia acceso: node design/compositore/mangiare-giro-1/prove/axe.cjs [porta] [cartella immagini]
const path = require('node:path'), fs = require('node:fs');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const PORTA = process.argv[2] || '4333', FOTO = process.argv[3];
const URL = `http://localhost:${PORTA}/mangiare-giro-1/proposte-locale.html`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
const QUI = '.giorno-attivo';
// gli stati per ogni proposta: [nome, gesti]
const STATI = {
  1: [['riga', []], ['elenco', [`${QUI} [data-azione="pasto-apri"]`]], ['scheda', [`${QUI} [data-azione="pasto-scheda"]`]], ['sera', ['#p-sera']]],
  2: [['riga', []], ['menu', [`${QUI} [data-azione="pasto-apri"]`, '.mn-v summary']], ['scheda', [`${QUI} [data-azione="pasto-apri"]`, '.mn-v summary', '#foglio [data-f="scheda"]', '.pl-sf--dopo']], ['no grazie', [`${QUI} [data-azione="pasto-no"]`]], ['sera', ['#p-sera']]],
  3: [['riga', []], ['mappa', [`${QUI} [data-azione="pasto-apri"]`, '.m-cibo']], ['sera', ['#p-sera']]],
  4: [['riga', []], ['elenco', [`${QUI} .pm4__c--tutti`]], ['scheda', [`${QUI} .pm4__c`]], ['sera', ['#p-sera']]]
};
if (FOTO) fs.mkdirSync(FOTO, { recursive: true });
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, protocolTimeout: 600000, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [], largo = [];
  page.on('pageerror', e => errori.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errori.push(m.text()); });
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-mangiare-idea-1', '1'); localStorage.removeItem('prova-mangiare-1'); } catch {} });
  let tot = 0, n = 0;
  const controlla = async (dove, prova = 0) => {
    await page.addScriptTag({ path: AXE });
    // se intanto la pagina si è ricaricata (cambio di vista), axe non c'è più: si riprova una volta
    if (!(await page.evaluate(() => typeof axe !== 'undefined'))) { if (prova < 1) { await attesa(800); return controlla(dove, prova + 1); } errori.push(dove + ': axe non caricato'); return; }
    const r = await page.evaluate(async () => { const s = document.createElement('style'); s.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; document.head.append(s); const x = await axe.run(document, { resultTypes: ['violations'] }); s.remove(); return x.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')} — ${v.nodes[0]?.failureSummary?.split('\n')[1] ?? ''}`); });
    n++; tot += r.length;
    if (r.length) console.log('\n' + dove, '\n  ' + r.join('\n  '));
  };
  const fai = async gesti => { for (const sel of gesti) { await page.waitForSelector(sel, { timeout: 4000 }); await page.evaluate(sel => document.querySelector(sel).click(), sel); await attesa(700); } };
  // la riga del pasto al centro dello schermo (senza spostare le pagine di D di lato)
  const allaRiga = () => page.evaluate(() => { const f = document.querySelector('#foglio'); if (f?.open) return; const p = [...document.querySelectorAll('.giorno-attivo .c-pasto, .giorno-attivo .d-pasto')].pop(); if (p) scrollTo(0, p.getBoundingClientRect().top + scrollY - innerHeight / 2 + p.offsetHeight / 2); document.querySelectorAll('.da-vedere').forEach(x => x.classList.add('vista')); });
  for (const [w, h] of [[390, 844], [1440, 900]]) for (const tema of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const p of ['c', 'd']) for (const v of [1, 2, 3, 4]) for (const [nome, gesti] of STATI[v]) {
      await page.setViewport({ width: w, height: h, deviceScaleFactor: w < 900 && FOTO ? 2 : 1, isMobile: w < 900, hasTouch: w < 900 });
      await page.goto(`${URL}?v=${Date.now()}#${p}${v}`, { waitUntil: 'load' }); await attesa(500);
      try { await fai(gesti); } catch (e) { errori.push(`${p}${v} ${nome}: ${e.message}`); continue; }
      await allaRiga(); await attesa(300);
      process.stdout.write(`.${p}${v}`); await controlla(`${w} ${tema} ${p}${v} ${nome}`);
      if (FOTO && w < 900) await page.screenshot({ path: path.join(FOTO, `${p}${v}-${nome}-${tema}.png`) });
      if (w < 900 && tema === 'light') for (const x of [320, 390]) {
        await page.setViewport({ width: x, height: 760, isMobile: true, hasTouch: true }); await attesa(250);
        const troppo = await page.evaluate(() => { const f = document.querySelector('#foglio'); return Math.max(document.documentElement.scrollWidth - innerWidth, f?.open ? f.scrollWidth - f.clientWidth : 0); });
        if (troppo > 0) largo.push(`${p}${v} ${nome} ${x}px: ${troppo}px di troppo`);
      }
    }
  }
  console.log(`\naxe: ${n} controlli, ${tot} problemi`);
  console.log(largo.length ? largo.join('\n') : 'nessuno scorrimento di lato a 320 e 390 px');
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore nella pagina');
  await browser.close();
})();
