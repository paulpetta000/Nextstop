import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { FILE_GENERATI, marcaGenerazione, verificaGenerazione } from '../src/lib/itinerari/generazione-dati.mjs';
import { riferimentoDati } from '../src/lib/itinerari/riferimento-dati.mjs';
const proiezione = { w: 100, h: 100, box: { w: 0, e: 1, n: 1, s: 0 } };
const vecchi = () => Object.fromEntries(FILE_GENERATI.map(nome => [nome, { firma: 'stesse-posizioni', generato: '2026-10-18', valore: nome }]));
const wrapper = fs.readFileSync(new URL('../src/lib/itinerari/riferimento-napoli.ts', import.meta.url), 'utf8');
const duranteBuild = new Function('T','M','P','L','D','A','verificaGenerazione','riferimentoDati', wrapper.replace(/^import .*;\r?$/gm, '').replace('export const RIFERIMENTO =', 'return'));
const build = (d, m = proiezione) => duranteBuild(d[FILE_GENERATI[0]], m, d[FILE_GENERATI[1]], d[FILE_GENERATI[2]], d[FILE_GENERATI[3]], d[FILE_GENERATI[4]], verificaGenerazione, riferimentoDati);

test('generazione: dati precedenti senza marcatura restano accettati dalla build', () => {
  const d = vecchi(), copia = structuredClone(d); assert.doesNotThrow(() => build(d)); assert.deepEqual(d,copia);
});
test('generazione: cinque file dello stesso calcolo sono coerenti anche dopo JSON', () => {
  const d = vecchi(), prima = structuredClone(d), marcati = marcaGenerazione(d,proiezione);
  const riletti = JSON.parse(JSON.stringify(marcati)); assert.doesNotThrow(() => build(riletti));
  assert.deepEqual(d,prima); assert.deepEqual(marcaGenerazione(marcati,proiezione),marcati);
});
test('generazione: stessa firma e stessa data non rendono compatibili due calcoli diversi', () => {
  const a = marcaGenerazione(vecchi(),proiezione), altro = vecchi(); altro['partenze-bus.json'].valore = 'orario diverso';
  const b = marcaGenerazione(altro,proiezione);
  for (const nome of FILE_GENERATI) assert.throws(() => build({...a,[nome]:b[nome]}), /File generati incompleti|calcoli diversi/);
});
test('generazione: primo aggiornamento interrotto rifiutato con qualsiasi file vecchio residuo', () => {
  const vecchio = vecchi(), nuovo = marcaGenerazione(vecchio,proiezione);
  for (const nome of FILE_GENERATI) {
    assert.throws(() => build({...nuovo,[nome]:vecchio[nome]}), /File generati/);
    assert.throws(() => build({...vecchio,[nome]:nuovo[nome]}), /File generati/);
  }
});
test('generazione: contenuto alterato o proiezione cambiata vengono rifiutati', () => {
  const a = marcaGenerazione(vecchi(),proiezione);
  for (const nome of FILE_GENERATI) {
    const b = structuredClone(a); b[nome].valore += ' modificato'; assert.throws(() => build(b), /File generati/);
  }
  assert.throws(() => build(a,{...proiezione,w:101}), /File generati/);
});
test('generazione: un riferimento vuoto o non valido non passa come vecchio formato', () => {
  for (const generazione of ['', null, 3, 'x']) {
    const d = vecchi(); d['partenze-bus.json'].generazione = generazione;
    assert.throws(() => build(d), /File generati/);
  }
});
