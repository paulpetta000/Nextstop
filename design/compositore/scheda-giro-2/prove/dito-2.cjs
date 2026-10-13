// Gesti con il dito (touch simulato, come su un telefono): scorrere la riga (2), maniglia (1), foglio in su e di lato (1),
// tenere premuto e trascinare (4), sfogliare i giorni in D partendo fuori dalle cartoline
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const URL = 'http://localhost:4333/scheda-giro-2/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await page.evaluateOnNewDocument(() => { localStorage.setItem('prova-scheda-idea-2', '1'); localStorage.setItem('prova-scheda-scorri', '1'); });
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const T = page.touchscreen;
  const vai = async h => { await page.evaluate(() => localStorage.removeItem('prova-scheda-2')).catch(() => {}); await page.goto(`${URL}?v=${Date.now()}#${h}`, { waitUntil: 'load' }); await page.evaluate(() => localStorage.removeItem('prova-scheda-2')); await page.goto(`${URL}?v=${Date.now()}#${h}`, { waitUntil: 'load' }); await attesa(600); };
  const centro = sel => page.evaluate(s => { const el = document.querySelector(s); el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);
  const ordine = () => page.evaluate(() => [...document.querySelectorAll('.giorno-attivo [data-trascina]')].map(x => x.dataset.id).join(','));
  const striscia = async (x0, y0, dx, dy, passi = 14, pausa = 0) => { await T.touchStart(x0, y0); if (pausa) await attesa(pausa); for (let k = 1; k <= passi; k++) { await T.touchMove(x0 + dx * k / passi, y0 + dy * k / passi); await attesa(16); } await T.touchEnd(); };
  for (const p of ['c', 'd']) {
    await vai(p + '2');
    let [x, y] = await centro('.giorno-attivo [data-scorre][data-id="sansevero"] .riga-pelle');
    await striscia(x - 80, y, 170, 4);
    await attesa(700);
    console.log(p, 'dito, 2 scorsa a destra → visitata:', await page.evaluate(() => !!document.querySelector('.giorno-attivo [data-v-id="sansevero"][data-visitata]')));
    [x, y] = await centro('.giorno-attivo [data-scorre][data-id="duomo"] .riga-pelle');
    await striscia(x + 80, y, -190, 3);
    await attesa(900);
    console.log(p, 'dito, 2 scorsa a sinistra → togli:', await ordine());
    [x, y] = await centro('.giorno-attivo [data-scorre][data-id="tribunali"] .riga-pelle');
    await striscia(x, y, 0, 200, 20, 650);
    await attesa(600);
    console.log(p, 'dito, 2 tenuta premuta e trascinata:', await ordine());
    const y0 = await page.evaluate(() => scrollY);
    [x, y] = await centro('.giorno-attivo [data-scorre][data-id="san-lorenzo"] .riga-pelle');
    const y1 = await page.evaluate(() => scrollY);
    await striscia(x, y, 0, -300, 10);
    await attesa(600);
    console.log(p, 'dito, 2 scorrere la pagina in su e giù dalla riga funziona ancora:', (await page.evaluate(() => scrollY)) !== y1, '| ordine uguale:', await ordine());

    await vai(p + '1');
    [x, y] = await centro('.giorno-attivo [data-maniglia="mann"]');
    await striscia(x, y, 0, 210, 20);
    await attesa(600);
    console.log(p, 'dito, 1 maniglia:', await ordine());
    await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="tappa"][data-id="santa-chiara"]').click()); await attesa(900);
    const [sx, sy] = await page.evaluate(() => { const r = document.querySelector('.sch1__pagina').getBoundingClientRect(); return [r.left + r.width / 2, r.top + 140]; });
    await striscia(sx, sy, 0, -260, 12);
    await attesa(700);
    console.log(p, 'dito, 1 foglio tirato su:', await page.evaluate(() => document.querySelector('#scheda').dataset.d));
    await striscia(sx + 60, 500, -170, 0, 12);
    await attesa(900);
    console.log(p, 'dito, 1 foglio di lato:', await page.evaluate(() => document.querySelector('#sch-t')?.textContent));
    const [hx, hy] = await page.evaluate(() => { const r = document.querySelector('.sch1__testa').getBoundingClientRect(); return [r.left + 60, r.top + 20]; });
    await striscia(hx, hy, 0, 700, 14);
    await attesa(800);
    console.log(p, 'dito, 1 foglio tirato giù:', await page.evaluate(() => document.querySelector('#scheda').open ? 'aperto (' + document.querySelector('#scheda').dataset.d + ')' : 'chiuso'));

    await vai(p + '4');
    [x, y] = await centro('.giorno-attivo [data-preme][data-id="mann"]');
    await striscia(x - 40, y, 0, 220, 20, 650);
    await attesa(600);
    console.log(p, 'dito, 4 tenuta premuta e trascinata:', await ordine());
  }
  // D: sfogliare i giorni partendo dal titolo del giorno (le cartoline in 2 non sfogliano)
  await vai('d2');
  const [tx, ty] = await page.evaluate(() => { const h = document.querySelector('.d-pagina.attiva h2'); h.scrollIntoView({ block: 'center' }); const r = h.getBoundingClientRect(); return [r.left + 150, r.top + 20]; });
  await striscia(tx + 100, ty, -260, 0, 14);
  await attesa(1200);
  console.log('d dito, sfogliare i giorni dal titolo:', await page.evaluate(() => document.querySelector('#d-dove')?.textContent));
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore');
  await browser.close();
})();
