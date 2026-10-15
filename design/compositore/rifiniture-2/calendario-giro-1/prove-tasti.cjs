// Uso, con il server acceso: node design/compositore/rifiniture-2/calendario-giro-1/prove-tasti.cjs
// Prova del difetto di Enrico (15/10/2026): T1/T2 e Chiaro/Scuro nella striscia in alto non cambiano niente.
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const U = 'http://localhost:4342/rifiniture-2/calendario-giro-1/proposte.html';
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const p = await b.newPage(); let falliti = 0;
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  const ok = (n, c) => { if (!c) falliti++; console.log((c ? 'ok  ' : 'NO  ') + n); };
  const stato = () => p.evaluate(() => ({ cl: document.documentElement.className, t: document.documentElement.dataset.theme, premuti: [...document.querySelectorAll('.prova [aria-pressed="true"]')].map(x => x.textContent.trim()) }));
  for (const pezzo of ['Calendario', 'Barre']) {
    await p.goto(U + '?x=' + Date.now()); await new Promise(r => setTimeout(r, 300));
    if (pezzo === 'Barre') await p.click('.prova [data-v="barre"]');
    await p.click('.prova [aria-label^="T2"]'); let s = await stato();
    ok(`${pezzo}: T2 porta alla vista D`, /\bvd\b/.test(s.cl) && s.premuti.includes('T2'));
    await p.click('.prova button[aria-pressed]:not([aria-pressed="true"])[data-v="dark"]'); s = await stato();
    ok(`${pezzo}: Scuro porta al tema scuro`, s.t === 'dark' && s.premuti.includes('Scuro'));
    await p.click('.prova [aria-label^="T1"]'); await p.click('.prova [data-v="light"]'); s = await stato();
    ok(`${pezzo}: T1 e Chiaro tornano indietro`, /\bvc\b/.test(s.cl) && s.t === 'light' && s.premuti.includes('T1') && s.premuti.includes('Chiaro'));
  }
  // gli altri tasti della striscia
  await p.goto(U + '?x=' + Date.now()); await new Promise(r => setTimeout(r, 300));
  await p.click('.prova [aria-label^="Proposta 3"]'); const s3 = await p.evaluate(() => [document.documentElement.className, document.querySelector('.campo__b')?.getAttribute('aria-controls')]); ok('Proposta 3 si sceglie', s3[0].split(' ').includes('p3') && s3[1] === 'mesi');
  await p.click('.prova [aria-label^="3 g"]'); ok('3 giorni si sceglie', await p.evaluate(() => document.querySelector('.prova [aria-label^="3 g"]').getAttribute('aria-pressed') === 'true' && document.querySelector('.f-campo span') !== null));
  await p.click('.prova [data-v="barre"]'); await p.click('.prova [aria-label^="Proposta 2"]'); ok('Barre, proposta 2', await p.evaluate(() => /sb-c2/.test(document.documentElement.className)));
  await p.click('.prova [aria-label^="T2"]'); ok('Barre in T2: la matita o il nastro', await p.evaluate(() => /sb-d2/.test(document.documentElement.className)));
  await p.click('.prova [data-v="cal"]'); ok('Di nuovo il calendario, proposta 1', await p.evaluate(() => /pezzo-cal p1/.test(document.documentElement.className)));
  await b.close(); process.exit(falliti ? 1 : 0);
})();
