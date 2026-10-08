// Prove dei gesti: trascinare (1, maniglia), scorrere la riga (2), tenere premuto (2), Modifica (3), menu (4), oggi, togli/annulla, sposta giorno
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const URL = 'http://localhost:4332/scheda-giro-1/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
const SOLO = (process.argv[2] || 'c,d').split(',');
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push('ERR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errori.push(m.text()); });
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-scheda-idea', '1'); localStorage.setItem('prova-scheda-scorri', '1'); } catch {} });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  const ordine = () => page.evaluate(() => [...document.querySelectorAll('.giorno-attivo [data-trascina]')].map(x => x.dataset.id).join(','));
  const fine = () => page.evaluate(() => document.querySelector('.giorno-attivo [data-cifra^="fine"]')?.textContent);
  const pulisci = () => page.evaluate(() => { localStorage.removeItem('prova-scheda-1'); });
  const vai = async h => { await page.goto(`${URL}?v=${Date.now()}#${h}`, { waitUntil: 'load' }); await attesa(500); };
  const centro = async sel => page.evaluate(s => { const el = document.querySelector(s); el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);
  const passo = async (fn) => { try { await fn(); } catch (e) { console.log('   ERRORE NELLA PROVA:', e.message); } };
  await vai('c1'); await pulisci();
  for (const p of SOLO) {
    await passo(async () => {
      await vai(p + '1');
      console.log(p, '1 prima', await ordine(), await fine());
      const [x, y] = await centro('.giorno-attivo [data-maniglia="mann"]');
      await page.mouse.move(x, y); await page.mouse.down(); await attesa(50);
      for (let k = 1; k <= 20; k++) { await page.mouse.move(x, y + k * 9); await attesa(16); }
      await page.mouse.up(); await attesa(500);
      console.log(p, '1 dopo trascina', await ordine(), await fine());
      await page.focus('.giorno-attivo [data-maniglia="tribunali"]'); await page.keyboard.press('ArrowDown'); await attesa(300);
      console.log(p, '1 freccia giù', await ordine(), 'fuoco:', await page.evaluate(() => document.activeElement?.dataset.maniglia));
      await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="tappa"][data-id="santa-chiara"]').click()); await attesa(700);
      const sc = await page.evaluate(() => { const r = document.querySelector('.sch1__pagina').getBoundingClientRect(); return [r.left + r.width / 2, r.top + 120]; });
      await page.mouse.move(sc[0], sc[1]); await page.mouse.down();
      for (let k = 1; k <= 12; k++) { await page.mouse.move(sc[0] - k * 12, sc[1]); await attesa(16); }
      await page.mouse.up(); await attesa(900);
      console.log(p, '1 foglio dopo lo scorrimento:', await page.evaluate(() => document.querySelector('#sch-t')?.textContent));
      await page.keyboard.press('Escape'); await attesa(400);
      console.log(p, '1 chiuso:', await page.evaluate(() => !document.querySelector('#scheda').open));
    });
    await pulisci();
    await passo(async () => {
      await vai(p + '2');
      let [a, b] = await centro('.giorno-attivo [data-scorre][data-id="sansevero"] .riga-pelle');
      await page.mouse.move(a - 60, b); await page.mouse.down();
      for (let k = 1; k <= 14; k++) { await page.mouse.move(a - 60 + k * 12, b); await attesa(16); }
      await page.mouse.up(); await attesa(700);
      console.log(p, '2 scorsa a destra, visitata:', await page.evaluate(() => !!document.querySelector('.giorno-attivo [data-v-id="sansevero"][data-visitata]')));
      [a, b] = await centro('.giorno-attivo [data-scorre][data-id="duomo"] .riga-pelle');
      await page.mouse.move(a + 60, b); await page.mouse.down();
      for (let k = 1; k <= 16; k++) { await page.mouse.move(a + 60 - k * 12, b); await attesa(16); }
      await page.mouse.up(); await attesa(900);
      console.log(p, '2 togli:', await ordine(), '|', await page.evaluate(() => document.querySelector('#toast span')?.textContent));
      await page.evaluate(() => document.querySelector('#toast button')?.click()); await attesa(500);
      console.log(p, '2 annulla:', await ordine());
      [a, b] = await centro('.giorno-attivo [data-scorre][data-id="tribunali"] .riga-pelle');
      await page.mouse.move(a, b); await page.mouse.down(); await attesa(600);
      for (let k = 1; k <= 20; k++) { await page.mouse.move(a, b + k * 10); await attesa(16); }
      await page.mouse.up(); await attesa(500);
      console.log(p, '2 tenuta premuta e trascinata:', await ordine());
      await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="tappa"][data-id="santa-chiara"]').click()); await attesa(700);
      console.log(p, '2 aperta:', await page.evaluate(() => document.querySelector('.riga-aperta .ra-nome')?.textContent));
      await page.evaluate(() => { document.querySelector('.riga-aperta [data-azione="sposta-apri"]').click(); });
      await page.evaluate(() => { document.querySelector('.riga-aperta [data-azione="sposta-giorno"]').click(); }); await attesa(600);
      console.log(p, '2 spostata nel giorno 2:', await ordine(), '|', await page.evaluate(() => document.querySelector('#toast span')?.textContent));
    });
    await pulisci();
    await passo(async () => {
      await vai(p + '3');
      await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="modifica"]').click()); await attesa(500);
      console.log(p, '3 modifica: meno', await page.evaluate(() => document.querySelectorAll('.giorno-attivo .meno').length), 'barra', await page.evaluate(() => !!document.querySelector('.modifica-barra')));
      await page.evaluate(() => document.querySelector('.giorno-attivo .meno[data-id="spaccanapoli"]').click()); await attesa(500);
      console.log(p, '3 tolta:', await ordine());
      await page.evaluate(() => document.querySelector('[data-azione="modifica-fine"]').click()); await attesa(500);
      console.log(p, '3 fatto: barra', await page.evaluate(() => !!document.querySelector('.modifica-barra')));
      await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="tappa"][data-id="mann"]').click()); await attesa(1800); console.log(p, '3 aperta:', await page.evaluate(() => document.querySelector('#sch-t')?.textContent));
      await page.evaluate(() => document.querySelector('.sch3__dopo').click()); await attesa(900);
      console.log(p, '3 prossima tappa:', await page.evaluate(() => document.querySelector('#sch-t')?.textContent));
      await page.evaluate(() => document.querySelector('.sigillo').click()); await attesa(300);
      console.log(p, '3 sigillo:', await page.evaluate(() => document.querySelector('.sigillo').getAttribute('aria-pressed')));
      await page.keyboard.press('Escape'); await attesa(500);
      console.log(p, '3 chiusa:', await page.evaluate(() => !document.querySelector('#scheda').open), 'fuoco:', await page.evaluate(() => document.activeElement?.dataset.id));
    });
    await pulisci();
    await passo(async () => {
      await vai(p + '4');
      await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="menu-tappa"][data-id="mann"]').click()); await attesa(300);
      console.log(p, '4 menu:', await page.evaluate(() => [...document.querySelectorAll('#menu-tappa button')].map(b => b.textContent.trim() + (b.disabled ? '(no)' : '')).join(' / ')));
      await page.evaluate(() => document.querySelector('#menu-tappa [data-m="giu"]').click()); await attesa(500);
      console.log(p, '4 sposta giù:', await ordine());
      await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="visitata"][data-id="tribunali"]').click()); await attesa(400);
      console.log(p, '4 cammino:', await page.evaluate(() => document.querySelector('.giorno-attivo [data-cammino] .cammino__t')?.textContent.trim()), 'tratti fatti', await page.evaluate(() => document.querySelectorAll('.giorno-attivo [data-verso][data-fatto]').length));
      await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="tappa"][data-id="sansevero"]').click()); await attesa(700);
      console.log(p, '4 schede in fila:', await page.evaluate(() => document.querySelectorAll('.sch4__carta').length), 'qui', await page.evaluate(() => document.querySelector('.sch4__carta--qui')?.dataset.id));
      await page.keyboard.press('ArrowRight'); await attesa(700);
      console.log(p, '4 freccia destra:', await page.evaluate(() => document.querySelector('.sch4__carta--qui')?.dataset.id));
      await page.keyboard.press('Escape'); await attesa(400);
      await page.evaluate(() => { document.querySelector('#idea').showPopover(); document.querySelector('[data-oggi]').click(); }); await attesa(800);
      console.log(p, 'oggi:', await page.evaluate(() => [...document.querySelectorAll('.giorno-attivo [data-v-id][data-id]')].slice(0, 4).map(x => x.dataset.id + (x.hasAttribute('data-visitata') ? '✓' : '')).join(',')), 'inizio', await page.evaluate(() => document.querySelector('.giorno-attivo .tempo__ore span')?.textContent));
      await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="visitata"][data-id="sansevero"]')?.click()); await attesa(800);
      console.log(p, 'oggi + Sansevero:', await page.evaluate(() => [...document.querySelectorAll('.giorno-attivo [data-v-id][data-id]')].slice(0, 5).map(x => x.dataset.id + (x.hasAttribute('data-visitata') ? '✓' : '')).join(',')), '|', await page.evaluate(() => document.querySelector('#toast span')?.textContent));
    });
    await pulisci();
  }
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore');
  await browser.close();
})();
