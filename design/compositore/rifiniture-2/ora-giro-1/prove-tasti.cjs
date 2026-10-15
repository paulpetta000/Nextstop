// Uso, con il server acceso (preview «proposte2», porta 4342): node design/compositore/rifiniture-2/ora-giro-1/prove-tasti.cjs [porta]
// Tocca davvero tutti i tasti della striscia in alto (nel giro del calendario T1/T2 e chiaro/scuro non cambiavano niente e se n'è
// accorto solo Enrico) e prova le tre proposte col dito, col mouse e con la tastiera, confrontando con le giornate vere (DATI).
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const U = `http://localhost:${process.argv[2] || '4342'}/rifiniture-2/ora-giro-1/proposte.html`;
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
  const apri = async h => { await p.goto(`${U}?x=${Date.now()}#${h}`); await attesa(300); };
  const v = (s, a = 'aria-valuenow') => p.$eval(s, (e, a) => +e.getAttribute(a), a);
  const testo = s => p.$eval(s, e => e.textContent);
  // quando finisci, secondo il calcolo del sito, per il giorno g e l'inizio i
  const fineVera = (g, i) => p.evaluate((g, i) => { const m = DATI.giorni[g].per[i].fine; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; }, g, i);
  const premuti = () => p.$$eval('.prova [aria-pressed="true"]', a => a.map(x => x.textContent.trim()));

  // ---------- la striscia in alto ----------
  await apri('p=1');
  for (const [n, cl, sel] of [[2, 'p2', '.o2-campi'], [3, 'p3', '.o3'], [1, 'p1', '.o1']]) {
    await p.click(`.prova [aria-label^="Proposta ${n}"]`);
    const s = await p.evaluate(sel => ({ cl: document.documentElement.className.split(' '), c: !!document.querySelector(sel), nome: document.querySelector('.prova__nome b').textContent }), sel);
    ok(`Proposta ${n}: cambia la proposta nel foglio`, s.cl.includes(cl) && s.c && s.nome.startsWith(`${n} ·`) && (await premuti()).includes(String(n)), JSON.stringify(s));
  }
  for (const pr of [1, 2, 3]) {
    await apri(`p=${pr}`);
    const prima = await p.$eval('.foglio', e => getComputedStyle(e).backgroundColor);
    await p.click('.prova [data-v="dark"]');
    let s = await p.evaluate(() => ({ t: document.documentElement.dataset.theme, bg: getComputedStyle(document.querySelector('.foglio')).backgroundColor }));
    ok(`Proposta ${pr}: Scuro scurisce il foglio`, s.t === 'dark' && s.bg !== prima && (await premuti()).includes('Scuro'), JSON.stringify(s));
    await p.click('.prova [data-v="light"]');
    s = await p.evaluate(() => ({ t: document.documentElement.dataset.theme, bg: getComputedStyle(document.querySelector('.foglio')).backgroundColor }));
    ok(`Proposta ${pr}: Chiaro torna chiaro`, s.t === 'light' && s.bg === prima && (await premuti()).includes('Chiaro'), JSON.stringify(s));
    await p.click('.prova [aria-label^="T2"]');
    s = await p.evaluate(() => ({ cl: document.documentElement.className.split(' '), f: getComputedStyle(document.querySelector('#foglio-titolo')).fontFamily }));
    ok(`Proposta ${pr}: T2 porta alla vista D (Bodoni)`, s.cl.includes('vd') && /Bodoni/.test(s.f) && (await premuti()).includes('T2'), JSON.stringify(s));
    await p.click('.prova [aria-label^="T1"]');
    s = await p.evaluate(() => ({ cl: document.documentElement.className.split(' '), f: getComputedStyle(document.querySelector('#foglio-titolo')).fontFamily }));
    ok(`Proposta ${pr}: T1 torna alla vista C (Archivo)`, s.cl.includes('vc') && /Archivo/.test(s.f) && (await premuti()).includes('T1'), JSON.stringify(s));
    await p.click('.prova [aria-label^="Giorno 2"]');
    const f2 = await fineVera(1, 570), t2 = await p.$eval('.f-corpo', e => e.textContent);
    ok(`Proposta ${pr}: Giorno 2 mostra il giorno 2 (finisci alle ${f2})`, t2.includes('giorno 2') && t2.includes(f2) && (await premuti()).includes('Giorno 2'));
    await p.click('.prova [aria-label^="Giorno 1"]');
    const f1 = await fineVera(0, 570), t1 = await p.$eval('.f-corpo', e => e.textContent);
    ok(`Proposta ${pr}: Giorno 1 torna al giorno 1 (finisci alle ${f1})`, t1.includes('giorno 1') && t1.includes(f1) && (await premuti()).includes('Giorno 1'));
  }

  // ---------- proposta 1 · la giornata ----------
  await apri('p=1');
  await p.focus('.o1-pollice--inizio');
  await p.keyboard.press('ArrowRight');
  ok('1: freccia a destra, inizio 9:45 e la fine vera cambia', await v('.o1-pollice--inizio') === 585 && (await testo('.esito')).includes(await fineVera(0, 585)));
  await p.keyboard.press('PageUp');
  ok('1: Pagina su, un\'ora dopo (10:45)', await v('.o1-pollice--inizio') === 645);
  await p.keyboard.press('End');
  ok('1: Fine (tasto), inizio alle 20:00 e la fine si sposta alle 21:00', await v('.o1-pollice--inizio') === 1200 && await v('.o1-pollice--fine') === 1260);
  await p.keyboard.press('Home');
  ok('1: Inizio (tasto), inizio alle 5:00', await v('.o1-pollice--inizio') === 300);
  await apri('p=1');
  await p.click('.o1-val--fine [data-pm="15"]');
  ok('1: + della fine, 19:15', await v('.o1-pollice--fine') === 1155 && (await testo('[data-o="v-fine"]')) === '19:15');
  await p.click('.o1-val--inizio [data-pm="-15"]');
  ok('1: − dell\'inizio, 9:15', await v('.o1-pollice--inizio') === 555);
  // trascinare la maniglia dell'inizio verso le 11 col dito (mouse)
  await apri('p=1');
  const q = await p.evaluate(() => { const r = document.querySelector('.o1-pista').getBoundingClientRect(), t = document.querySelector('.o1-pollice--inizio').getBoundingClientRect(); return { x0: t.x + t.width / 2, y: t.y + t.height / 2, x1: r.x + r.width * (660 - 300) / 1140 }; });
  await p.mouse.move(q.x0, q.y); await p.mouse.down(); await p.mouse.move((q.x0 + q.x1) / 2, q.y, { steps: 4 }); await p.mouse.move(q.x1, q.y, { steps: 4 }); await p.mouse.up();
  const ini = await v('.o1-pollice--inizio');
  ok(`1: trascinata l'inizio verso le 11 (${ini / 60 | 0}:${String(ini % 60).padStart(2, '0')}), oltre la fine`, Math.abs(ini - 660) <= 15 && !!(await p.$('.esito--oltre')) && !!(await p.$('.o1-b--fuori')));
  const al = await p.$eval('[data-a="allunga"]', e => +e.dataset.v);
  await p.click('[data-a="allunga"]');
  ok(`1: «Finisci alle …» sposta la fine e l'avviso sparisce`, await v('.o1-pollice--fine') === al && !(await p.$('.esito--oltre')));
  // un tocco sulla pista sposta la maniglia più vicina
  const q2 = await p.evaluate(() => { const r = document.querySelector('.o1-pista').getBoundingClientRect(); return { x: r.x + r.width * (1320 - 300) / 1140, y: r.y + 56 }; });
  await p.mouse.click(q2.x, q2.y);
  ok('1: un tocco sulla pista alle 22 sposta la fine', Math.abs(await v('.o1-pollice--fine') - 1320) <= 15);

  // ---------- proposta 2 · tutte le ore ----------
  await apri('p=2');
  await p.click('[data-a="ore"][data-k="inizio"]'); await attesa(450);
  let s = await p.evaluate(() => ({ open: document.querySelector('#ore').open, f: document.activeElement?.dataset?.m }));
  ok('2: il campo dell\'inizio apre il foglio sull\'ora scelta', s.open && s.f === '570', JSON.stringify(s));
  await p.keyboard.press('ArrowRight');
  ok('2: freccia a destra, fuoco su 9:45', await p.evaluate(() => document.activeElement?.dataset?.m) === '585');
  await p.keyboard.press('ArrowDown');
  ok('2: freccia in giù, fuoco su 10:45', await p.evaluate(() => document.activeElement?.dataset?.m) === '645');
  await p.click('#ore .q[data-m="660"]');
  s = await p.evaluate(() => ({ modo: document.querySelector('.oz-modo__b[aria-pressed="true"]')?.dataset.k, sel: document.querySelector('.oz-sel').textContent, punti: document.querySelectorAll('#ore .q .punto').length }));
  ok('2: tocco su 11:00, si passa alla fine; punti gialli oltre le 19:00', s.modo === 'fine' && s.sel.includes('Dalle 11:00') && s.punti > 0, JSON.stringify(s));
  await p.click('#ore .q[data-m="1230"]');
  s = await p.evaluate(() => ({ sel: document.querySelector('.oz-sel').textContent, punti: document.querySelectorAll('#ore .q .punto').length }));
  ok('2: fine alle 20:30, niente più punti', s.sel.includes('alle 20:30') && s.punti === 0, JSON.stringify(s));
  await p.keyboard.press('Escape'); await attesa(450);
  s = await p.evaluate(() => ({ open: document.querySelector('#ore').open, i: document.querySelector('#val-inizio').textContent, f: document.querySelector('#val-fine').textContent, fuoco: document.activeElement?.dataset?.k }));
  ok('2: Esc chiude, i campi dicono 11:00 e 20:30, il fuoco torna sul campo', !s.open && s.i === '11:00' && s.f === '20:30' && s.fuoco === 'fine', JSON.stringify(s));
  await p.click('[data-a="ore"][data-k="fine"]'); await attesa(450);
  await p.click('#ore [data-a="modo"][data-k="inizio"]');
  ok('2: «Inizio» in alto torna a scegliere l\'inizio', await p.evaluate(() => document.activeElement?.dataset?.m) === '660');
  await p.click('#ore .oz-piede .f-bottone'); await attesa(450);
  ok('2: «Fatto» chiude il foglio', !(await p.$eval('#ore', e => e.open)));

  // ---------- proposta 3 · la frase ----------
  await apri('p=3');
  await p.focus('.o3-v[data-k="inizio"]');
  await p.keyboard.press('ArrowUp');
  ok('3: freccia in su, inizio 9:45 e la fine vera cambia', await v('.o3-v[data-k="inizio"]') === 585 && (await testo('.o3-esito')).includes(await fineVera(0, 585)));
  await p.click('.o3 [data-a="veloce"][data-v="660"]');
  ok('3: «Tardi» porta l\'inizio alle 11:00 e il riquadro diventa giallo', await v('.o3-v[data-k="inizio"]') === 660 && !!(await p.$('.o3-esito--oltre')));
  await p.click('.o3 [data-a="allunga"]');
  ok('3: «Finisci alle …» e il riquadro torna normale', !(await p.$('.o3-esito--oltre')));
  const f0 = await v('.o3-v[data-k="fine"]');
  await p.click('.o3-pm[data-pm="-15"][data-k="fine"]');
  ok('3: − della fine, 15 minuti prima', await v('.o3-v[data-k="fine"]') === f0 - 15);
  await p.click('.o3 [data-a="veloce"][data-k="fine"]');
  const ap = await p.evaluate(() => { const m = DATI.giorni[0].per[660].fine; return Math.ceil(m / 15) * 15; });
  ok('3: «Appena finisci» mette la fine subito dopo l\'ultima tappa', await v('.o3-v[data-k="fine"]') === ap);

  console.log(errori.length ? `errori nella pagina:\n  ${[...new Set(errori)].join('\n  ')}` : 'nessun errore nella pagina');
  console.log(falliti ? `${falliti} prove fallite` : 'tutte le prove riuscite');
  await b.close(); process.exit(falliti || errori.length ? 1 : 0);
})();
