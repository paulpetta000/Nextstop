// axe in chiaro e scuro, telefono e computer: il foglio «Aggiungi» con i risultati dei 3 riquadri, in C e D (e la ricerca senza risultati)
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const URL = 'http://localhost:4333/ricerca-giro-2/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, protocolTimeout: 600000 });
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-ricerca-idea-2', '1'); localStorage.removeItem('prova-ricerca-2'); } catch {} });
  let tot = 0, n = 0;
  const controlla = async dove => {
    await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(async () => { const s = document.createElement('style'); s.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; document.head.append(s); const x = await axe.run(document, { resultTypes: ['violations'] }); s.remove(); return x.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')} — ${v.nodes[0]?.failureSummary?.split('\n')[1] ?? ''}`); });
    n++; tot += r.length;
    if (r.length) console.log(dove, '\n  ' + r.join('\n  '));
  };
  const cerca = q => page.evaluate(q => { const i = document.querySelector('#f-q'); i.value = q; i.dispatchEvent(new Event('input', { bubbles: true })); }, q);
  for (const [w, h] of [[390, 844], [1440, 900]]) for (const tema of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setViewport({ width: w, height: h, isMobile: w < 900, hasTouch: w < 900 });
    for (const p of ['c', 'd']) for (const r of [1, 2, 3, 4]) {
      await page.goto(`${URL}?v=${Date.now()}#${p}${r}`, { waitUntil: 'load' }); await attesa(400);
      await page.evaluate(() => document.querySelector('#p-cerca').click()); await attesa(500);
      if (r === 1) await controlla(`${w} ${tema} ${p} senza parole`);
      for (const q of ['catacombe', 'Napoli', 'sfogliatela']) { await cerca(q); await attesa(300); await controlla(`${w} ${tema} ${p}${r} «${q}»`); }
      if (r === 1) { await cerca('xyzw'); await attesa(300); await controlla(`${w} ${tema} ${p} nessun risultato`); }
    }
  }
  console.log(`axe: ${n} controlli, ${tot} problemi`);
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore nella pagina');
  await browser.close();
})();
