import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giornoVuoto, MAX_GIORNI, MAX_TAPPE } from '../src/lib/itinerari/link.ts';
import { preparaSpostamento } from '../src/lib/itinerari/spostamenti.ts';

function sposta(x, ids, dest) {
  const risultato = preparaSpostamento(x, 0, dest, ids);
  if (typeof risultato !== 'string') x.giorni = risultato.giorni;
  return risultato;
}

const viaggio = giorni => ({ id: 'viaggio0', nome: 'Prova', giorni, creato: 1, modificato: 1 });
const giorno = tappe => ({ ...giornoVuoto(600, 1080), tappe });
const tappe = n => Array.from({ length: n }, (_, i) => `tappa${i}`);

test('spostamento: un giorno pieno non cancella la tappa di origine', () => {
  const x = viaggio([giorno(['duomo']), giorno(tappe(MAX_TAPPE))]);
  const prima = structuredClone(x);
  const risultato = sposta(x, ['duomo'], 1);
  assert.deepEqual(x, prima);
  assert.equal(risultato, 'limite-tappe');
});

test('spostamento: se manca spazio per il gruppo, tutte le tappe restano al loro posto', () => {
  const x = viaggio([giorno(['duomo', 'museo']), giorno(tappe(MAX_TAPPE - 1))]);
  const prima = structuredClone(x);
  assert.equal(sposta(x, ['duomo', 'museo'], 1), 'limite-tappe');
  assert.deepEqual(x, prima);
});

test('spostamento: riempire l’ultimo posto conserva ordine e tappe', () => {
  const destinazione = tappe(MAX_TAPPE - 1);
  const x = viaggio([giorno(['duomo', 'museo']), giorno(destinazione)]);
  sposta(x, ['duomo'], 1);
  assert.deepEqual(x.giorni[0].tappe, ['museo']);
  assert.deepEqual(x.giorni[1].tappe, [...destinazione, 'duomo']);
});

test('spostamento: una tappa già presente non occupa due posti', () => {
  const destinazione = [...tappe(MAX_TAPPE - 1), 'duomo'];
  const x = viaggio([giorno(['duomo']), giorno(destinazione)]);
  sposta(x, ['duomo'], 1);
  assert.deepEqual(x.giorni[0].tappe, []);
  assert.deepEqual(x.giorni[1].tappe, destinazione);
});

test('spostamento: il giorno nuovo mantiene gli orari e tutte le tappe trasferite', () => {
  const x = viaggio([giorno(['duomo', 'museo'])]);
  sposta(x, ['duomo', 'museo'], 1);
  assert.deepEqual(x.giorni[0].tappe, []);
  assert.deepEqual(x.giorni[1], giorno(['duomo', 'museo']));
});

test('spostamento: al limite dei giorni non cambia l’itinerario', () => {
  const x = viaggio([giorno(['duomo']), ...Array.from({ length: MAX_GIORNI - 1 }, () => giorno([]))]);
  const prima = structuredClone(x);
  const risultato = sposta(x, ['duomo'], MAX_GIORNI);
  assert.deepEqual(x, prima);
  assert.equal(risultato, 'limite-giorni');
});

test('spostamento: preparare una modifica valida non muta l’originale, che resta disponibile per Annulla', () => {
  const x = viaggio([giorno(['duomo', 'museo']), giorno([])]);
  const prima = structuredClone(x);
  const risultato = preparaSpostamento(x, 0, 1, ['duomo']);
  assert.notEqual(typeof risultato, 'string');
  assert.deepEqual(x, prima);
  risultato.giorni[1].tappe.push('castello');
  assert.deepEqual(x, prima);
});
