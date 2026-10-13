// axe in chiaro e scuro, telefono e computer: giornata e scheda aperta di ogni proposta, in C e D
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const AXE = 'C:/Users/Windows11/tools/controlli/node_modules/axe-core/axe.min.js';
const URL = 'http://localhost:4333/scheda-giro-2/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-scheda-idea-2', '1'); localStorage.setItem('prova-scheda-scorri', '1'); const t = Date.now(); localStorage.setItem('prova-scheda-2', JSON.stringify({ salvato: true, giorni: [['mann', 'tribunali', 'sansevero', 'santa-chiara', 'spaccanapoli', 'san-lorenzo', 'duomo'], ['sant-elmo', 'san-martino', 'pedamentina', 'toledo', 'plebiscito', 'palazzo-reale', 'monte-echia', 'borgo-marinari']], fatte: { mann: t, tribunali: t } })); } catch {} });
  let tot = 0, n = 0;
  const controlla = async (dove) => {
    await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(async () => { const s = document.createElement('style'); s.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; document.head.append(s); const x = await axe.run(document, { resultTypes: ['violations'] }); return x.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')} — ${v.nodes[0]?.failureSummary?.split('\n')[1] ?? ''}`); });
    n++; tot += r.length;
    if (r.length) console.log(dove, '\n  ' + r.join('\n  '));
  };
  for (const [w, h] of [[390, 844], [1440, 900]]) for (const tema of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setViewport({ width: w, height: h, isMobile: w < 900, hasTouch: w < 900 });
    for (const p of ['c', 'd']) for (const q of [1, 2, 3]) {
      await page.goto(`${URL}?v=${Date.now()}#${p}${q}`, { waitUntil: 'load' }); await attesa(400);
      await controlla(`${w} ${tema} ${p}${q} giornata`);
      await page.evaluate(() => document.querySelectorAll('.giorno-attivo [data-azione="tappa"]')[3].click()); await attesa(700);
      await controlla(`${w} ${tema} ${p}${q} scheda`);
    }
  }
  console.log(`axe: ${n} controlli, ${tot} problemi`);
  await browser.close();
})();
