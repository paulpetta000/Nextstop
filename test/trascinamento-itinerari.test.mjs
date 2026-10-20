import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const file = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/viste.js', import.meta.url), 'utf8');
const sorgente = file.slice(file.indexOf('const scorritore ='), file.indexOf('const maniglia ='));

// Esegue la funzione del prodotto con geometrie e fotogrammi controllati, senza un browser.
function ambiente({ pannello = false, cima = 100, numero = 16, scorrimento = 0, altezza = 800, pannelloCima = 200, pannelloFondo = 650 } = {}) {
  const eventi = () => {
    const m = new Map();
    return { addEventListener: (k, fn) => { if (!m.has(k)) m.set(k, new Set()); m.get(k).add(fn); },
      removeEventListener: (k, fn) => m.get(k)?.delete(fn),
      emetti: (k, e = {}) => { for (const fn of [...(m.get(k) ?? [])]) fn(e); },
      conta: () => [...m.values()].reduce((n, s) => n + s.size, 0) };
  };
  const classi = () => { const s = new Set(); return { add: k => s.add(k), remove: k => s.delete(k), contains: k => s.has(k) }; };
  const finestre = eventi(), documento = eventi(), presa = { ...eventi(), catturato: false,
    setPointerCapture() { this.catturato = true; }, hasPointerCapture() { return this.catturato; },
    releasePointerCapture() { this.catturato = false; } };
  const frame = new Map(), timer = [], mosse = [], richieste = [];
  let prossimo = 1;
  const sc = { scrollTop: scorrimento, clientTop: 0, clientHeight: pannelloFondo - pannelloCima,
    getBoundingClientRect: () => ({ top: pannelloCima, bottom: pannelloFondo }) };
  const ctx = { ...finestre, document: documento, computer: { matches: pannello }, S: { p: 'c', g: 0 }, gesto: { trascinando: false },
    innerHeight: altezza, scrollY: scorrimento, $: () => sc, $$: () => voci,
    requestAnimationFrame: fn => { const id = prossimo++; frame.set(id, fn); return id; }, cancelAnimationFrame: id => frame.delete(id),
    setTimeout: fn => { timer.push(fn); }, scrollBy: (x, y) => { ctx.scrollY = Math.max(0, Math.min(5000, ctx.scrollY + y)); richieste.push(y); },
    spostaA: (id, a) => mosse.push([id, a]), G: () => ({}), tappeDi: () => [] };
  const sy = () => pannello ? sc.scrollTop : ctx.scrollY;
  const lista = { classList: classi(), isConnected: true, getBoundingClientRect: () => ({ top: cima - sy(), bottom: cima + numero * 86 - 6 - sy() }) };
  const voci = Array.from({ length: numero }, (_, i) => ({ parentElement: lista, isConnected: true, classList: classi(), style: {}, dataset: { id: `t${i}` },
    getBoundingClientRect: () => ({ top: cima + i * 86 - sy(), bottom: cima + i * 86 + 80 - sy(), height: 80 }) }));
  const inizia = vm.runInNewContext(sorgente + ';iniziaTrascina', ctx);
  return { ctx, sc, presa, lista, voci, mosse, frame, richieste, finestre, documento,
    inizia: (i = 0, y = cima + i * 86 - sy() + 40, id = 1) => inizia(voci[i], { clientY: y, pointerId: id }, presa),
    muovi: y => presa.emetti('pointermove', { pointerId: 1, clientY: y }),
    fotogrammi: n => { for (let i = 0; i < n; i++) { const fs = [...frame.values()]; frame.clear(); fs.forEach(fn => fn()); } },
    finisci: (tipo = 'pointerup', id = 1) => presa.emetti(tipo, { pointerId: id }),
    timer: () => { timer.splice(0).forEach(fn => fn()); } };
}

test('trascinamento: lo scorrimento si ferma alla fine delle tappe, prima del resto della pagina', () => {
  const e = ambiente(); e.inizia(); e.muovi(790); e.fotogrammi(200);
  assert.equal(e.ctx.scrollY, 100 + 16 * 86 - 6 - 800);
  const fine = e.ctx.scrollY; e.fotogrammi(100); assert.equal(e.ctx.scrollY, fine);
});

test('trascinamento: lo scorrimento verso l’alto non precede l’inizio delle tappe', () => {
  const e = ambiente({ cima: 1000, scorrimento: 1000 }); e.inizia(); e.muovi(10); e.fotogrammi(200);
  assert.equal(e.ctx.scrollY, 940);
});

test('trascinamento: una lista già tutta visibile non fa scorrere la pagina', () => {
  const e = ambiente({ numero: 3 }); e.inizia(); e.muovi(790); e.fotogrammi(30);
  assert.equal(e.ctx.scrollY, 0); e.muovi(5); e.fotogrammi(30); assert.equal(e.ctx.scrollY, 0);
});

test('trascinamento: usa il bordo inferiore del pannello, anche lontano dal bordo della finestra', () => {
  const e = ambiente({ pannello: true, cima: 300, altezza: 1000 }); e.inizia(); e.muovi(640); e.fotogrammi(1);
  assert.ok(e.sc.scrollTop > 0); e.fotogrammi(200);
  assert.equal(e.sc.scrollTop, 300 + 16 * 86 - 6 - 650); assert.equal(e.ctx.scrollY, 0);
});

test('trascinamento: usa il bordo superiore del pannello e si ferma alla prima tappa', () => {
  const e = ambiente({ pannello: true, cima: 300, scorrimento: 400 }); e.inizia(4); e.muovi(210); e.fotogrammi(200);
  assert.equal(e.sc.scrollTop, 100);
});

test('trascinamento: la perdita della cattura annulla il gesto e toglie gli ascoltatori', () => {
  const e = ambiente(); e.inizia(); e.muovi(790); e.fotogrammi(1); e.finisci('lostpointercapture');
  assert.equal(e.frame.size, 0); assert.equal(e.presa.conta(), 0); assert.equal(e.finestre.conta(), 0); assert.equal(e.documento.conta(), 0);
  assert.equal(e.lista.classList.contains('in-trascina'), false); assert.deepEqual(e.mosse, []);
  assert.ok(e.voci.every(v => v.style.transform === '')); e.timer(); assert.equal(e.ctx.gesto.trascinando, false);
});

test('trascinamento: Escape e cambio di finestra annullano senza cambiare l’ordine', () => {
  for (const tipo of ['Escape', 'blur', 'resize']) {
    const e = ambiente(); e.inizia(); e.muovi(790);
    if (tipo === 'Escape') e.finestre.emetti('keydown', { key: tipo, preventDefault() {} }); else e.finestre.emetti(tipo);
    assert.equal(e.frame.size, 0, tipo); assert.deepEqual(e.mosse, [], tipo); assert.equal(e.presa.catturato, false, tipo);
  }
});

test('trascinamento: un secondo puntatore non avvia due scorrimenti concorrenti', () => {
  const e = ambiente(); assert.equal(e.inizia(), true); assert.equal(e.inizia(1, 220, 2), false); assert.equal(e.frame.size, 1);
  e.finisci('pointerup', 2); assert.equal(e.frame.size, 1); e.finisci(); assert.equal(e.frame.size, 0);
});

test('trascinamento: il rilascio conferma una volta e l’annullamento non sposta', () => {
  const e = ambiente({ numero: 4 }); e.inizia(); e.muovi(350); e.finisci(); e.finisci();
  assert.deepEqual(e.mosse, [['t0', 2]]); assert.equal(e.frame.size, 0); assert.equal(e.presa.conta(), 0);
  const a = ambiente({ numero: 4 }); a.inizia(); a.muovi(350); a.finisci('pointercancel'); assert.deepEqual(a.mosse, []);
});
