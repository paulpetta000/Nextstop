import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calcolaGiorno, ordinePiuCorto, dataDelGiorno } from '../src/lib/itinerari/calcolo.ts';
import { conPause } from '../src/lib/itinerari/pause.ts';
import { SCENARI } from '../src/lib/itinerari/tipi.ts';

const file = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/stato.js', import.meta.url), 'utf8');
const sorgente = file.slice(file.indexOf('const memoOrdine ='), file.indexOf('// ---------- dati che arrivano dopo'))
  .replace(/^export /gm, '');

function ambiente({ inizio = 800, pause = [], margine = 0 } = {}) {
  const n = 4, matrice = v => Object.fromEntries(SCENARI.map(s => [s, Array.from({ length: n * n }, (_, i) => Math.floor(i / n) === i % n ? 0 : v)]));
  const C = { tappe: ['a', 'b', 'c', 'd'].map((id, p) => ({ id, p, tipo: 'citta', durata: 30, chiuso: [], nome: id, breve: id, reversibile: false })),
    tempi: { n, min: matrice(40), metri: matrice(100), mezzi: matrice('') }, linee: {}, zone: {} };
  const base = [[0, 40, 5], [40, 0, 40], [40, 5, 0]], dopo = [[0, 5, 80], [80, 0, 5], [80, 80, 0]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { C.tempi.min.sabato[i * n + j] = base[i][j]; C.tempi.min['sabato-pomeriggio'][i * n + j] = dopo[i][j]; }
  for (const scenario of SCENARI) C.tempi.min[scenario][3 * n] = 0;
  const x = { id: 'prova', data: '2026-10-10', margine, giorni: [{ tappe: ['a', 'b', 'c'], inizio, fine: 1400, pause }] };
  let adesso;
  const G = (g, ordine) => {
    const y = ordine ? { ...x, giorni: x.giorni.map((d, k) => k === g ? { ...d, tappe: ordine } : d) } : x;
    return conPause(C, y.giorni[g], calcolaGiorno(C, y, g, adesso), y.margine, { data: dataDelGiorno(y, g), piedi: y.piedi });
  };
  const d = { C, X: () => x, G, versione: 0, oggiNelGiorno: () => !!adesso, adessoPer: () => adesso, ordinePiuCorto };
  const ordineCorto = new Function(...Object.keys(d), sorgente + ';return ordineCorto;')(...Object.values(d));
  return { C, x, G, ordineCorto, set adesso(v) { adesso = v; } };
}

test('ordine: la pausa non permette di promettere un risparmio che diventa 150 minuti in più', () => {
  const e = ambiente({ pause: [{ quale: 'riposo', min: 60, dopo: 'a' }] });
  assert.equal(e.ordineCorto(0), null);
});

test('ordine: il margine non permette di proporre un percorso diventato più lento', () => {
  const e = ambiente({ inizio: 810, margine: 15 }); assert.equal(e.ordineCorto(0), null);
});

test('ordine: cambiare una pausa invalida il suggerimento memorizzato', () => {
  const e = ambiente(); assert.equal(e.ordineCorto(0).risparmio, 35);
  e.x.giorni[0].pause.push({ quale: 'riposo', min: 60, dopo: 'a' }); assert.equal(e.ordineCorto(0), null);
});

test('ordine: cambiare il margine invalida il suggerimento memorizzato', () => {
  const e = ambiente({ inizio: 810 }); assert.equal(e.ordineCorto(0).risparmio, 35);
  e.x.margine = 15; assert.equal(e.ordineCorto(0), null);
});

test('ordine: il suggerimento segue l’ora effettiva del contesto dal vivo', () => {
  const e = ambiente(); e.adesso = { data: e.x.data, ora: 810 }; assert.equal(e.ordineCorto(0).risparmio, 35);
  e.adesso = { data: e.x.data, ora: 900 }; assert.equal(e.ordineCorto(0), null);
});

test('ordine: un suggerimento valido dichiara i minuti effettivi e non modifica il viaggio', () => {
  const e = ambiente(); const prima = structuredClone(e.x), o = e.ordineCorto(0);
  assert.deepEqual(o.ordine, ['a', 'c', 'b']); assert.equal(o.ordine[0], prima.giorni[0].tappe[0]);
  assert.equal(o.risparmio, e.G(0).spostamenti - e.G(0, o.ordine).spostamenti); assert.deepEqual(e.x, prima);
});

test('ordine: la scelta Lascia così resta rispettata finché l’ordine non cambia', () => {
  const e = ambiente(); e.x.giorni[0].lascia = 'a.b.c'; assert.equal(e.ordineCorto(0), null);
  delete e.x.giorni[0].lascia; assert.equal(e.ordineCorto(0).risparmio, 35);
});

test('ordine: la valutazione di base senza contesto conserva il controllo degli itinerari pronti', () => {
  const e = ambiente(); assert.deepEqual(ordinePiuCorto(e.C, e.x, 0), { ordine: ['a', 'c', 'b'], risparmio: 35 });
});


test('ordine: il contesto dal vivo conserva le visitate e verifica lo stesso ordine che sarà applicato', () => {
  const e = ambiente(); e.x.giorni[0].tappe = ['d', 'a', 'b', 'c']; e.x.giorni[0].fatte = ['d'];
  e.adesso = { data: e.x.data, ora: 800 }; const prima = structuredClone(e.x), o = e.ordineCorto(0);
  assert.deepEqual(o.fatte, ['d']); assert.deepEqual(o.ordine, ['a', 'c', 'b']);
  const applicato = [...o.fatte, ...o.ordine]; assert.equal(o.risparmio, e.G(0).spostamenti - e.G(0, applicato).spostamenti);
  assert.equal(e.G(0, applicato).voci.find(v => v.id === 'd').fatta, true); assert.deepEqual(e.x, prima);
});

test('ordine: locali fissi e preferenza a piedi mantengono le regole esistenti', () => {
  const e = ambiente(); e.C.tappe[1].categoria = 'mangiare'; assert.equal(e.ordineCorto(0), null);
  const a = ambiente(); assert.ok(a.ordineCorto(0)); a.x.piedi = true; assert.equal(a.ordineCorto(0), null);
});
