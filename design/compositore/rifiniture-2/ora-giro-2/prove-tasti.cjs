// Uso, con il server acceso (preview «proposte2», porta 4342): node design/compositore/rifiniture-2/ora-giro-2/prove-tasti.cjs [porta]
// Tocca davvero tutti i tasti della striscia in alto (nel giro del calendario T1/T2 e chiaro/scuro non cambiavano niente e se n'è
// accorto solo Enrico) e prova le tre proposte del giro 2 col dito, col mouse e con la tastiera, confrontando con le giornate vere.
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const U = `http://localhost:${process.argv[2] || '4342'}/rifiniture-2/ora-giro-2/proposte.html`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const p = await b.newPage(); let falliti = 0;
  const errori = [];
  p.on('pageerror', e => errori.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errori.push(m.text()); });
  p.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) errori.push(`${r.status()} ${r.url()}`); });
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  const ok = (n, c, info = '') => { if (!c) falliti++; console.log((c ? 'ok  ' : 'NO  ') + n + (c || !info ? '' : `  (${info})`)); };
  const apri = async h => { await p.goto(`${U}?x=${Date.now()}#${h}`); await attesa(350); };
  const v = (s, a = 'aria-valuenow') => p.$eval(s, (e, a) => +e.getAttribute(a), a);
  const testo = s => p.$eval(s, e => e.textContent);
  const ora = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const fineVera = (g, i) => p.evaluate((g, i) => DATI.giorni[g].per[i].fine, g, i).then(ora);
  const premuti = () => p.$$eval('.prova [aria-pressed="true"]', a => a.map(x => x.textContent.trim()));
  const aperto = () => p.$eval('#ore', e => e.open);
  const fuoco = () => p.evaluate(() => document.activeElement?.dataset?.m ?? document.activeElement?.dataset?.k ?? document.activeElement?.className);

  // ---------- la striscia in alto ----------
  await apri('p=2');
  for (const [n, sel] of [[4, '.qd-svg'], [5, '.rt-scorre'], [2, '.oz-gr']]) {
    await p.click(`.prova [aria-label^="Proposta ${n}"]`);
    const s = await p.evaluate(() => ({ cl: document.documentElement.className.split(' '), nome: document.querySelector('.prova__nome b').textContent }));
    await p.click('[data-a="ore"][data-k="inizio"]'); await attesa(500);
    const d = await p.evaluate((sel, n) => ({ open: document.querySelector('#ore').open, cl: document.querySelector('#ore').className, c: !!document.querySelector(`#ore ${sel}`) }), sel, n);
    ok(`Proposta ${n}: si sceglie e il campo apre la sua scelta dell'ora`, s.cl.includes(`p${n}`) && s.nome.startsWith(`${n} ·`) && (await premuti()).includes(String(n)) && d.open && d.cl.includes(`ore--p${n}`) && d.c, JSON.stringify({ s, d }));
    await p.click('#ore .oz-piede .f-bottone'); await attesa(450);
    ok(`Proposta ${n}: «Fatto» chiude e il fuoco torna sul campo`, !(await aperto()) && (await fuoco()) === 'inizio');
  }
  for (const pr of [2, 4, 5]) {
    await apri(`p=${pr}`);
    const prima = await p.$eval('.foglio', e => getComputedStyle(e).backgroundColor);
    await p.click('.prova [data-v="dark"]');
    let s = await p.evaluate(() => ({ t: document.documentElement.dataset.theme, bg: getComputedStyle(document.querySelector('.foglio')).backgroundColor }));
    ok(`Proposta ${pr}: Scuro scurisce il foglio`, s.t === 'dark' && s.bg !== prima && (await premuti()).includes('Scuro'), JSON.stringify(s));
    await p.click('[data-a="ore"][data-k="fine"]'); await attesa(500);
    const bgOre = await p.$eval('#ore', e => getComputedStyle(e).backgroundColor);
    ok(`Proposta ${pr}: in scuro anche il foglio delle ore è scuro`, bgOre === s.bg, `${bgOre} / ${s.bg}`);
    await p.keyboard.press('Escape'); await attesa(450);
    await p.click('.prova [data-v="light"]');
    s = await p.evaluate(() => ({ t: document.documentElement.dataset.theme, bg: getComputedStyle(document.querySelector('.foglio')).backgroundColor }));
    ok(`Proposta ${pr}: Chiaro torna chiaro`, s.t === 'light' && s.bg === prima && (await premuti()).includes('Chiaro'), JSON.stringify(s));
    await p.click('.prova [aria-label^="T2"]');
    s = await p.evaluate(() => ({ cl: document.documentElement.className.split(' '), f: getComputedStyle(document.querySelector('#foglio-titolo')).fontFamily }));
    ok(`Proposta ${pr}: T2 porta alla vista D (Bodoni)`, s.cl.includes('vd') && /Bodoni/.test(s.f) && (await premuti()).includes('T2'), JSON.stringify(s));
    await p.click('[data-a="ore"][data-k="inizio"]'); await attesa(500);
    const fOre = await p.$eval('#ore-titolo', e => getComputedStyle(e).fontFamily);
    ok(`Proposta ${pr}: in T2 anche il foglio delle ore è in Bodoni`, /Bodoni/.test(fOre), fOre);
    await p.keyboard.press('Escape'); await attesa(450);
    await p.click('.prova [aria-label^="T1"]');
    s = await p.evaluate(() => ({ cl: document.documentElement.className.split(' '), f: getComputedStyle(document.querySelector('#foglio-titolo')).fontFamily }));
    ok(`Proposta ${pr}: T1 torna alla vista C (Archivo)`, s.cl.includes('vc') && /Archivo/.test(s.f) && (await premuti()).includes('T1'), JSON.stringify(s));
    await p.click('.prova [aria-label^="Giorno 2"]');
    const f2 = await fineVera(1, 570), t2 = await testo('.f-corpo');
    ok(`Proposta ${pr}: Giorno 2 mostra il giorno 2 (finisci alle ${f2})`, t2.includes('giorno 2') && t2.includes(f2) && (await premuti()).includes('Giorno 2'));
    await p.click('.prova [aria-label^="Giorno 1"]');
    const f1 = await fineVera(0, 570), t1 = await testo('.f-corpo');
    ok(`Proposta ${pr}: Giorno 1 torna al giorno 1 (finisci alle ${f1})`, t1.includes('giorno 1') && t1.includes(f1) && (await premuti()).includes('Giorno 1'));
  }

  // ---------- proposta 2 · tutte le ore ----------
  await apri('p=2');
  await p.click('[data-a="ore"][data-k="inizio"]'); await attesa(500);
  ok('2: il foglio si apre sull\'inizio, 9:30', (await fuoco()) === '570');
  await p.keyboard.press('ArrowRight'); ok('2: freccia a destra, 9:45', (await fuoco()) === '585');
  await p.keyboard.press('ArrowDown'); ok('2: freccia in giù, 10:45', (await fuoco()) === '645');
  await p.click('#ore .q[data-m="660"]');
  let s = await p.evaluate(() => ({ modo: document.querySelector('.oz-modo__b[aria-pressed="true"]')?.dataset.k, in: document.querySelectorAll('#ore td.in .q').length, oltre: document.querySelectorAll('#ore td.oltre .q').length, ultimo: document.querySelector('#ore td.in-ultimo .q')?.dataset.m, primo: document.querySelector('#ore td.in-primo .q')?.dataset.m }));
  ok('2: tocco su 11:00, si passa alla fine; la fascia va da 11:00 a 19:00 tutta intera; righe gialle oltre', s.modo === 'fine' && s.in === 33 && s.primo === '660' && s.ultimo === '1140' && s.oltre > 0, JSON.stringify(s));
  ok('2: oltre la fine compare «Finisci alle 20:00»', await p.$eval('#ore [data-o="avviso"]', e => !e.hidden && e.textContent.includes('Finisci alle 20:00')));
  await p.click('#ore .q[data-m="1230"]');
  s = await p.evaluate(() => ({ in: document.querySelectorAll('#ore td.in .q').length, libero: document.querySelectorAll('#ore td.in--libero .q').length, oltre: document.querySelectorAll('#ore td.oltre .q').length, ultimo: document.querySelector('#ore td.in-ultimo .q')?.dataset.m, avviso: document.querySelector('#ore [data-o="avviso"]').hidden }));
  ok('2: fine alle 20:30: la fascia arriva alle 20:30, con il tempo in più più chiaro; niente righe gialle', s.ultimo === '1230' && s.in === 39 && s.libero > 0 && s.oltre === 0 && s.avviso, JSON.stringify(s));
  await p.click('#ore .q[data-m="540"]');
  s = await p.evaluate(() => ({ primo: document.querySelector('#ore td.in-primo .q')?.dataset.m, ultimo: document.querySelector('#ore td.in-ultimo .q')?.dataset.m }));
  ok('2: con «Fine», un tocco prima dell\'inizio (9:00) diventa il nuovo inizio', s.primo === '540' && s.ultimo === '1230', JSON.stringify(s));
  await p.keyboard.press('Escape'); await attesa(450);
  s = await p.evaluate(() => ({ open: document.querySelector('#ore').open, i: document.querySelector('#val-inizio').textContent, f: document.querySelector('#val-fine').textContent, fuoco: document.activeElement?.dataset?.k }));
  ok('2: Esc chiude; i campi dicono 9:00 e 20:30; il fuoco torna sul campo', !s.open && s.i === '9:00' && s.f === '20:30' && s.fuoco === 'fine', JSON.stringify(s));
  await p.click('[data-a="ore"][data-k="fine"]'); await attesa(500);
  await p.click('#ore [data-a="modo"][data-k="inizio"]');
  ok('2: «Inizio» in alto torna a scegliere l\'inizio', (await fuoco()) === '540');
  await p.keyboard.press('Escape'); await attesa(450);

  // ---------- proposta 4 · il quadrante ----------
  await apri('p=4');
  await p.click('[data-a="ore"][data-k="inizio"]'); await attesa(700);
  ok('4: il foglio si apre con il fuoco sul punto dell\'inizio', (await fuoco()) === 'inizio');
  await p.keyboard.press('ArrowRight');
  ok('4: freccia a destra, inizio 9:45 e la fine vera al centro', await v('.qd-m--inizio') === 585 && (await testo('[data-o="centro"]')).includes(await fineVera(0, 585)));
  await p.keyboard.press('PageUp'); ok('4: Pagina su, un\'ora dopo (10:45)', await v('.qd-m--inizio') === 645);
  // trascinare il punto della fine verso le 21, poi oltre la mezzanotte: resta alle 23:45, non salta alle 6
  const centro = await p.$eval('.qd-svg', e => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, k: r.width / 320 }; });
  const punto = m => { const a = (90 + m / 1440 * 360) * Math.PI / 180; return { x: centro.x + 112 * centro.k * Math.cos(a), y: centro.y + 112 * centro.k * Math.sin(a) }; };
  const da = await p.$eval('.qd-m--fine', e => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await p.mouse.move(da.x, da.y); await p.mouse.down();
  for (const m of [1180, 1220, 1260]) await p.mouse.move(punto(m).x, punto(m).y, { steps: 3 });
  const f21 = await v('.qd-m--fine');
  for (const m of [1320, 1380, 1430, 30, 60]) await p.mouse.move(punto(m).x, punto(m).y, { steps: 3 });
  const fNotte = await v('.qd-m--fine');
  await p.mouse.up();
  ok(`4: trascinata la fine verso le 21 (${ora(f21)}) e oltre la mezzanotte resta alle ${ora(fNotte)}`, Math.abs(f21 - 1260) <= 15 && fNotte === 1425);
  await apri('p=4&i=11:00');
  await p.click('[data-a="ore"][data-k="fine"]'); await attesa(700);
  ok('4: con l\'inizio alle 11 si va oltre: avviso e centro in giallo', !!(await p.$('.qd-centro--oltre')) && !(await p.$eval('#ore [data-o="avviso"]', e => e.hidden)));
  await p.click('#ore [data-a="allunga"]'); await attesa(200);
  ok('4: «Finisci alle 20:00» sposta il punto della fine e l\'avviso sparisce', await v('.qd-m--fine') === 1200 && (await p.$eval('#ore [data-o="avviso"]', e => e.hidden)));
  await p.click('#ore [data-a="fuoco"][data-k="inizio"]');
  ok('4: il riquadro «Inizio» porta il fuoco sul suo punto', (await fuoco()) === 'inizio');
  await p.keyboard.press('Escape'); await attesa(450);

  // ---------- proposta 5 · le ruote ----------
  await apri('p=5');
  await p.click('[data-a="ore"][data-k="inizio"]'); await attesa(600);
  ok('5: il foglio si apre con il fuoco sulla ruota dell\'inizio', (await fuoco()) === 'inizio');
  await p.keyboard.press('ArrowDown'); await attesa(700);
  const pos = k => p.$eval(`.rt-scorre[data-k="${k}"]`, e => Math.round(e.scrollTop / 48));
  ok('5: freccia in giù, inizio 9:45 e la ruota gira lì', await v('.rt-scorre[data-k="inizio"]') === 585 && await pos('inizio') === (585 - 300) / 15 && (await testo('[data-o="percorso"]')).includes(await fineVera(0, 585)));
  // far girare la ruota della fine col dito (scorrimento): si ferma e sceglie
  await p.$eval('.rt-scorre[data-k="fine"]', e => { e.scrollTo({ top: ((1230 - 360) / 15) * 48 }); });
  await attesa(800);
  ok('5: girata la ruota della fine, 20:30', await v('.rt-scorre[data-k="fine"]') === 1230);
  // la fine troppo vicina all'inizio spinge l'inizio, e la sua ruota gira da sola
  await p.$eval('.rt-scorre[data-k="fine"]', e => { e.scrollTo({ top: ((585 - 360) / 15) * 48 }); });
  await attesa(1300);
  ok('5: fine alle 9:45, l\'inizio va alle 8:45 e la sua ruota lo segue', await v('.rt-scorre[data-k="fine"]') === 585 && await v('.rt-scorre[data-k="inizio"]') === 525 && await pos('inizio') === (525 - 300) / 15);
  await p.click('.rt-scorre[data-k="inizio"] .rt-v[data-m="555"]'); await attesa(1100);
  ok('5: un tocco su 9:15 la porta al centro e la sceglie; la fine si sposta alle 10:15', await v('.rt-scorre[data-k="inizio"]') === 555 && await v('.rt-scorre[data-k="fine"]') === 615);
  await p.keyboard.press('Escape'); await attesa(450);
  s = await p.evaluate(() => ({ i: document.querySelector('#val-inizio').textContent, f: document.querySelector('#val-fine').textContent }));
  ok('5: chiuso, i campi dicono 9:15 e 10:15', s.i === '9:15' && s.f === '10:15', JSON.stringify(s));

  console.log(errori.length ? `errori nella pagina:\n  ${[...new Set(errori)].join('\n  ')}` : 'nessun errore nella pagina');
  console.log(falliti ? `${falliti} prove fallite` : 'tutte le prove riuscite');
  await b.close(); process.exit(falliti || errori.length ? 1 : 0);
})();
