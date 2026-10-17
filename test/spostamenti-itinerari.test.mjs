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

test('spostamento: il segno «visitata» segue la tappa nel giorno nuovo (specifica §5, casi limite)', () => {
  const x = viaggio([{ ...giorno(['duomo', 'museo']), fatte: ['museo', 'duomo'] }, giorno(['castello'])]);
  const r = preparaSpostamento(x, 0, 1, ['duomo']);
  assert.deepEqual(r.giorni[0].fatte, ['museo']);
  assert.deepEqual(r.giorni[1].fatte, ['duomo']);
  assert.deepEqual(r.giorni[1].tappe, ['castello', 'duomo']);
});

test('spostamento: una pausa messa dopo la tappa spostata torna al suo posto di base', () => {
  const x = viaggio([{ ...giorno(['duomo', 'museo', 'castello']), pause: [{ quale: 'pranzo', min: 60, dopo: 'museo' }] }]);
  const r = preparaSpostamento(x, 0, 1, ['museo']);
  assert.deepEqual(r.giorni[0].pause, [{ quale: 'pranzo', min: 60 }]);
});

for (const prima of [true, false]) test(`spostamento verso gita: origine conservata con inserimento prima dell'origine: ${prima}`, () => {
  const origine = { ...giorno(['duomo', 'museo']), fatte: ['duomo'], pause: [{ quale: 'pranzo', min: 45, dopo: 'duomo' }], noPasti: ['cena'] };
  const gita = { ...giorno([]), gita: 'pompei' };
  const x = viaggio(prima ? [gita, origine] : [origine, gita]);
  const originale = structuredClone(x);
  const r = preparaSpostamento(x, prima ? 1 : 0, prima ? 0 : 1, ['duomo']);
  assert.equal(typeof r, 'object');
  assert.equal(r.destinazione, prima ? 0 : 1);
  assert.deepEqual(r.giorni[r.destinazione], { ...giorno(['duomo']), fatte: ['duomo'] });
  assert.deepEqual(r.giorni[prima ? 2 : 0], { ...origine, tappe: ['museo'], fatte: [], pause: [{ quale: 'pranzo', min: 45 }] });
  assert.deepEqual(r.giorni[prima ? 1 : 2], gita);
  assert.deepEqual(x, originale);
});

test('spostamento verso gita: inserire un giorno non supera il limite di sette', () => {
  const x = viaggio([giorno(['duomo']), { ...giorno([]), gita: 'pompei' }, ...Array.from({ length: MAX_GIORNI - 2 }, () => giorno([]))]);
  const originale = structuredClone(x);
  assert.equal(preparaSpostamento(x, 0, 1, ['duomo']), 'limite-giorni');
  assert.deepEqual(x, originale);
});

test('spostamento: trasferire più visitate conserva il loro ordine di visita', () => {
  const x = viaggio([{ ...giorno(['duomo', 'museo', 'castello']), fatte: ['museo', 'duomo'] }, giorno([])]);
  const originale = structuredClone(x);
  const r = preparaSpostamento(x, 0, 1, ['duomo', 'museo']);
  assert.deepEqual(r.giorni[1].tappe, ['duomo', 'museo']);
  assert.deepEqual(r.giorni[1].fatte, ['museo', 'duomo']);
  assert.deepEqual(x, originale);
});

test('spostamento: le visite trasferite non diventano più recenti di una visita già nella destinazione', () => {
  const x = { ...viaggio([
    { ...giorno(['duomo', 'museo']), fatte: ['museo', 'duomo'] },
    { ...giorno(['castello']), fatte: ['castello'] }
  ]), timbri: { museo: 1760000000000, duomo: 1760000001000, castello: 1760000002000 } };
  const originale = structuredClone(x);
  const r = preparaSpostamento(x, 0, 1, ['duomo', 'museo']);
  assert.deepEqual(r.giorni[1].fatte, ['museo', 'duomo', 'castello']);
  assert.deepEqual(r.giorni[1].tappe, ['castello', 'duomo', 'museo']);
  assert.deepEqual(x, originale);
});
