import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { validaQuote, validaOsm } from '../scripts/itinerari/ingressi.mjs';
const source = fs.readFileSync(new URL('../scripts/itinerari/costruisci.mjs', import.meta.url), 'utf8');
const daQ = source.indexOf('// ---------- Quote ----------'), aQ = source.indexOf('// ---------- Grafo pedonale', daQ);
const daD = source.indexOf('// ---------- Dati ----------'), aD = daQ;
assert.ok(daQ >= 0 && aQ > daQ && daD >= 0 && aD > daD);
const quoteReali = new Function('dem', 'process', 'validaQuote', source.slice(daQ, aQ) + '; return { quota, filtrata };');
const datiReali = new Function('fs', 'path', 'dir', 'RADICE', 'yaml', 'validaOsm', source.slice(daD, aD) + '; return { nodi, vie };');
const dem = () => ({ w: 2, h: 2, lon0: 1, lat0: 1, dlon: 1, dlat: -1, quote: [0, 20, 40, 60] });
const nodo = (id, lat = 1, lon = 1) => ({ type: 'node', id, lat, lon });
const osm = () => ({ elements: [nodo(1), nodo(2, 1, 2), { type: 'way', id: 3, nodes: [1, 2], tags: { highway: 'footway' } }] });
const preparaQuote = (d, env = {}) => quoteReali(d, { env }, validaQuote);
const preparaDati = o => datiReali({ readFileSync: file => path.basename(file) === 'osm.json' ? JSON.stringify(o) : path.basename(file) === 'quote.json' ? JSON.stringify(dem()) : '[]' }, path, '/dati-fittizi', '/sito-fittizio', { load: () => [] }, validaOsm);

test('generatore quote: dati mancanti, null e stringhe vengono rifiutati prima del filtro', () => {
  for (const q of [[0, 20, 40], [0, 20, null, 60], [0, 20, '40', 60], [0, 20, Infinity, 60]]) {
    assert.throws(() => preparaQuote({ ...dem(), quote: q }), /^Error: Quote:/);
  }
});
test('generatore quote: griglia e passo errati non producono valori NaN o quote inventate', () => {
  for (const modifica of [{ w: 0 }, { h: 1.5 }, { dlon: 0 }, { dlat: '1' }, { lon0: null }, { lat0: 91 }]) {
    assert.throws(() => preparaQuote({ ...dem(), ...modifica }), /^Error: Quote:/);
  }
});
test('generatore quote: parametri del filtro non validi non entrano nei cicli', () => {
  for (const env of [{ QUOTE_RAGGIO: '-1' }, { QUOTE_RAGGIO: '0.5' }, { QUOTE_PERCENTILE: '2' }, { QUOTE_PERCENTILE: 'NaN' }, { QUOTE_MEDIA: '-1' }]) {
    assert.throws(() => preparaQuote(dem(), env), /^Error: Quote:/);
  }
});
test('generatore quote: conserva zero, quote negative, passi con segno e interpolazione bilineare', () => {
  const q = preparaQuote(dem(), { QUOTE_RAGGIO: '0', QUOTE_MEDIA: '0' });
  assert.deepEqual([...q.filtrata], [0, 20, 40, 60]);
  assert.equal(q.quota(0.5, 1.5), 30);
  const negativa = preparaQuote({ ...dem(), quote: [-3, -2, -1, 0] }, { QUOTE_RAGGIO: '0' });
  assert.equal(negativa.quota(0.5, 1.5), -1.5);
});
test('generatore OSM: coordinate e tag incompleti non diventano nodi utilizzabili', () => {
  for (const modifica of [{ lat: null }, { lon: '1' }, { lat: 91 }, { tags: { highway: 3 } }, { id: 1.5 }]) {
    const o = osm(); Object.assign(o.elements[0], modifica);
    assert.throws(() => preparaDati(o), /^Error: OSM:/);
  }
});
test('generatore OSM: una via con un nodo mancante non salta il vuoto', () => {
  const o = osm(); o.elements[2].nodes = [1, 999, 2];
  assert.throws(() => preparaDati(o), /OSM:.*999.*assente/);
});
test('generatore OSM: risposte parziali e nodi con coordinate discordanti vengono rifiutati', () => {
  for (const o of [{ ...osm(), remark: 'runtime error: timeout' }, { elements: [] }, { elements: [...osm().elements, nodo(1, 0, 0)] }]) {
    assert.throws(() => preparaDati(o), /^Error: OSM:/);
  }
});
test('generatore OSM: conserva nodi ripetuti coerenti, tag e ordine indipendente degli elementi', () => {
  const o = osm(); o.elements[0].tags = { highway: 'elevator' }; o.elements.push(nodo(1)); o.elements.reverse();
  const prima = structuredClone(o), d = preparaDati(o);
  assert.equal(d.nodi.size, 2); assert.equal(d.vie.length, 1);
  assert.equal(d.nodi.get(1).tags.highway, 'elevator'); assert.deepEqual(o, prima);
});
test('generatore quote: un file JSON nullo o privo di griglia dà un errore delle quote', () => {
  for (const d of [null, [], {}]) assert.throws(() => preparaQuote(d), /^Error: Quote:/);
});