import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../scripts/itinerari/costruisci.mjs', import.meta.url), 'utf8');
const lines = source.slice(source.indexOf('const ogni ='), source.indexOf('const BUS ='));
const search = source.slice(source.indexOf('class Heap'), source.indexOf('function percorso('));
assert.ok(lines.includes('const LINEE =')); assert.ok(search.includes('function dijkstra('));

function percorso(minutiAPiedi, scenario = 'feriale', da = 1, a = 2) {
  const makeData = line => ({
    MEZZI: new Map([['L6', line]]),
    fermate: [{ id: 'L6:a', linea: 'L6', accessi: [{ nodo: { id: 1 }, m: 0 }] },
      { id: 'L6:b', linea: 'L6', accessi: [{ nodo: { id: 2 }, m: 0 }] }],
    corse: [{ da: 'L6:a', a: 'L6:b', linea: 'L6', t: 15 }],
    ascensori: new Map(),
    adj: new Map([[1, [{ a: 2, t: minutiAPiedi, tipo: 'piedi' }]], [2, [{ a: 1, t: minutiAPiedi, tipo: 'piedi' }]]]),
    PIEDI: { metriAlMinuto: 75, ascensore: 1 }, BUS: { preferenza: 5 }
  });
  const api = new Function('makeData', lines + `
    const {MEZZI,fermate,corse,ascensori,adj,PIEDI,BUS}=makeData(LINEE.find(x=>x.id==='L6'));
    ${search};return {rete,dijkstra};`)(makeData);
  const r = api.dijkstra(da, api.rete({ nome: scenario, mezzi: true }));
  return { minuti: r.tempo.get(a), arrivo: r.prec.get(a).e.tipo };
}

test('L6: 28 minuti a piedi battono metro con attesa media del quadro ANM ogni 20 minuti', () => {
  const r = percorso(28);
  assert.equal(r.arrivo, 'piedi'); assert.equal(r.minuti, 28);
});

for (const [da,a] of [[1,2],[2,1]]) test(`L6: il tragitto in metro include una sola attesa in direzione ${da}-${a}`, () => {
  const r = percorso(40, 'feriale', da, a);
  // Quadro ANM letto 22/10/2026: frequenza 20 -> attesa 10; accesso 2,5, corsa 15, uscita 2.
  assert.equal(r.arrivo, 'scende'); assert.equal(r.minuti, 29.5);
});

test('L6: il sabato pomeriggio conserva la sola alternativa a piedi', () => {
  assert.deepEqual(percorso(40, 'sabato-pomeriggio'), { minuti: 40, arrivo: 'piedi' });
});
