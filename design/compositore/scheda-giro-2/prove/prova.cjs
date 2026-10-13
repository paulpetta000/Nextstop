// Prove automatiche della pagina del pezzo 2 (puppeteer-core di tools/controlli)
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const URL = 'http://localhost:4332/scheda-giro-1/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push('ERR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errori.push(m.type() + ' ' + m.text()); });
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-scheda-idea', '1'); localStorage.setItem('prova-scheda-scorri', '1'); } catch {} });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const w of [390, 1440]) {
    await page.setViewport({ width: w, height: w > 900 ? 900 : 844, deviceScaleFactor: 1, isMobile: w < 900, hasTouch: w < 900 });
    for (const p of ['c', 'd']) for (const q of [1, 2, 3, 4]) {
      await page.goto(`${URL}?v=${Date.now()}#${p}${q}`, { waitUntil: 'load' });
      await attesa(300);
      const r = await page.evaluate(async () => {
        const out = {};
        out.largo = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        out.righe = document.querySelectorAll('.giorno-attivo [data-v-id][data-id]').length;
        const b = document.querySelector('.giorno-attivo [data-azione="tappa"]');
        out.prima = b?.dataset.id;
        b?.click();
        await new Promise(r => setTimeout(r, 500));
        const s = document.querySelector('#scheda');
        out.scheda = s.open ? s.className : (document.querySelector('.riga-aperta') ? 'riga-aperta' : 'nessuna');
        out.titolo = document.querySelector('#scheda[open] .sch-titolo, .riga-aperta .ra-nome')?.textContent;
        out.fonti = document.querySelectorAll('#scheda[open] .sch-fonti li, .riga-aperta .sch-fonti li').length;
        const v = document.querySelector('#scheda[open] [data-azione="visitata"], .riga-aperta [data-azione="visitata"]');
        v?.click();
        await new Promise(r => setTimeout(r, 300));
        out.visitata = v?.getAttribute('aria-pressed');
        out.rigaVisitata = !!document.querySelector(`.giorno-attivo [data-v-id="${out.prima}"][data-visitata]`);
        out.largoDopo = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        return out;
      });
      console.log(w, p + q, JSON.stringify(r));
    }
  }
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore');
  await browser.close();
})();
