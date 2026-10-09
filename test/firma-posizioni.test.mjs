import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firmaPosizioni } from '../src/lib/itinerari/firma-posizioni.mjs';

const punti = [
  { id: 'b', lat: 40.85, lon: 14.27, fine: { lat: 40.86, lon: 14.28 } },
  { id: 'a', lat: 40.84, lon: 14.25 }
];

test('posizioni: conserva le firme precedenti e ignora l’ordine senza mutare i punti', () => {
  // Risultati acquisiti dalle due formule originali prima del refactoring.
  const fermi = Object.freeze(punti.map(p => Object.freeze({
    ...p, ...(p.fine ? { fine: Object.freeze({ ...p.fine }) } : {})
  })));
  assert.equal(firmaPosizioni([]), '97d170e1550e');
  assert.equal(firmaPosizioni(fermi), '5c536326810c');
  assert.equal(firmaPosizioni([...fermi].reverse()), '5c536326810c');
  assert.deepEqual(fermi, punti);
});

test('posizioni: rileva ingressi e arrivi cambiati, senza invalidare i tempi per altri campi', () => {
  const originale = firmaPosizioni(punti);
  for (const modifica of [
    { id: 'c' }, { lat: 40.87 }, { lon: 14.29 },
    { fine: { lat: 40.87, lon: 14.28 } },
    { fine: { lat: 40.86, lon: 14.29 } }, { fine: undefined }
  ]) {
    assert.notEqual(firmaPosizioni([{ ...punti[0], ...modifica }, punti[1]]), originale);
  }
  assert.equal(firmaPosizioni(punti.map(p => ({ ...p, nome: 'Nuovo nome', durata: 60 }))), originale);
});
