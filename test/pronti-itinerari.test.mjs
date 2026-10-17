import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giornoVuoto, MAX_GIORNI, MAX_TAPPE } from '../src/lib/itinerari/link.ts';
import { prontoNelGiorno } from '../src/lib/itinerari/pronti.ts';

const viaggio = (giorni, extra = {}) => ({ id: 'viaggio0', nome: 'Prova', giorni, creato: 1, modificato: 1, ...extra });
const giorno = (tappe, inizio = 600, fine = 1080) => ({ ...giornoVuoto(inizio, fine), tappe });
// «Mezza giornata nel centro storico» e «Due giorni a Napoli» (src/data/itinerari-pronti.yaml)
const MEZZA = [giorno(['sansevero', 'santa-chiara', 'spaccanapoli', 'tribunali'], 570, 810)];
const DUE = [giorno(['mann', 'tribunali', 'sansevero'], 570, 1140), giorno(['sant-elmo', 'san-martino', 'toledo'], 570, 1140)];

// Bug della prova del 14/10/2026 (ROADMAP, Fase 2 bis, tranche 1): nel giorno 2 «Mezza giornata» apriva un itinerario
// nuovo e tornava al giorno 1.
test('pronto nel giorno 2: le tappe vanno nel giorno 2, nello stesso itinerario, e si resta lì', () => {
  const x = viaggio([giorno(['mann', 'duomo']), giorno([])]);
  const prima = structuredClone(x);
  const r = prontoNelGiorno(x, 1, MEZZA);
  assert.equal(typeof r, 'object');
  assert.ok(!r.nuovo, 'non apre un itinerario nuovo');
  assert.equal(r.giorno, 1, 'resta sul giorno 2');
  assert.deepEqual(r.giorni[0], prima.giorni[0], 'il giorno 1 non cambia');
  assert.deepEqual(r.giorni[1].tappe, MEZZA[0].tappe);
  assert.equal(r.giorni.length, 2);
  assert.deepEqual(x, prima, 'l’itinerario di partenza resta intatto (per «Annulla»)');
});

test('pronto nel giorno: il giorno tiene i suoi orari e le visitate degli altri giorni', () => {
  const x = viaggio([{ ...giorno(['mann', 'duomo']), fatte: ['mann'] }, giorno([], 660, 1020)], { salvato: true });
  const r = prontoNelGiorno(x, 1, MEZZA);
  assert.deepEqual(r.giorni[0], x.giorni[0]);
  assert.equal(r.giorni[1].inizio, 660);
  assert.equal(r.giorni[1].fine, 1020);
});

test('pronto di due giorni: il giorno dopo vuoto si riempie', () => {
  const x = viaggio([giorno(['duomo']), giorno([]), giorno([])]);
  const r = prontoNelGiorno(x, 1, DUE);
  assert.equal(r.giorni.length, 3);
  assert.deepEqual(r.giorni[1].tappe, DUE[0].tappe);
  assert.deepEqual(r.giorni[2].tappe, DUE[1].tappe);
  assert.equal(r.giorni[2].fine, 1080, 'un giorno già esistente tiene i suoi orari');
});

test('pronto di due giorni: se il giorno dopo ha tappe se ne inserisce uno nuovo, con gli orari del pronto', () => {
  const x = viaggio([giorno([]), giorno(['plebiscito']), giorno([], 600, 1080)]);
  const r = prontoNelGiorno(x, 0, DUE);
  assert.equal(r.giorno, 0);
  assert.equal(r.giorni.length, 4);
  assert.deepEqual(r.giorni[0].tappe, DUE[0].tappe);
  assert.deepEqual(r.giorni[1], { ...giorno(DUE[1].tappe, 570, 1140) });
  assert.deepEqual(r.giorni[2].tappe, ['plebiscito'], 'il giorno con tappe scorre avanti, intatto');
});

test('pronto: un giorno di gita dopo non si tocca', () => {
  const x = viaggio([giorno([]), { ...giorno([]), gita: 'pompei' }]);
  const r = prontoNelGiorno(x, 0, DUE);
  assert.equal(r.giorni.length, 3);
  assert.equal(r.giorni[2].gita, 'pompei');
  assert.deepEqual(r.giorni[1].tappe, DUE[1].tappe);
});

test('pronto: una tappa già nel viaggio resta dov’è e non si duplica', () => {
  const x = viaggio([giorno(['santa-chiara']), giorno([])]);
  const r = prontoNelGiorno(x, 1, MEZZA);
  assert.deepEqual(r.giorni[0].tappe, ['santa-chiara']);
  assert.deepEqual(r.giorni[1].tappe, ['sansevero', 'spaccanapoli', 'tribunali']);
  assert.deepEqual(r.gia, [{ id: 'santa-chiara', giorno: 0 }]);
  assert.deepEqual(r.aggiunte, ['sansevero', 'spaccanapoli', 'tribunali']);
});

test('pronto: se tutte le tappe sono già nel viaggio non cambia niente', () => {
  const x = viaggio([giorno(MEZZA[0].tappe), giorno([])]);
  assert.equal(prontoNelGiorno(x, 1, MEZZA), 'niente');
});

test('pronto: oltre i 7 giorni non cambia niente', () => {
  const x = viaggio(Array.from({ length: MAX_GIORNI }, (_, k) => giorno(k === MAX_GIORNI - 1 ? [] : [`t${k}`])));
  const prima = structuredClone(x);
  assert.equal(prontoNelGiorno(x, MAX_GIORNI - 1, DUE), 'limite-giorni');
  assert.deepEqual(x, prima);
});

test('pronto in un giorno con tappe: in coda, e oltre il massimo non cambia niente', () => {
  const x = viaggio([giorno(['plebiscito'])]);
  const r = prontoNelGiorno(x, 0, MEZZA);
  assert.deepEqual(r.giorni[0].tappe, ['plebiscito', ...MEZZA[0].tappe]);
  const pieno = viaggio([giorno(Array.from({ length: MAX_TAPPE - 2 }, (_, i) => `t${i}`))]);
  assert.equal(prontoNelGiorno(pieno, 0, MEZZA), 'limite-tappe');
});

test('pronto: il riepilogo delle tappe già presenti usa i giorni dopo gli inserimenti', () => {
  const x = viaggio([giorno([]), giorno(['plebiscito']), { ...giorno(['sant-elmo']), fatte: ['sant-elmo'], pause: [] }]);
  const originale = structuredClone(x);
  const r = prontoNelGiorno(x, 0, DUE);
  assert.equal(r.giorni.length, 4);
  assert.deepEqual(r.gia, [{ id: 'sant-elmo', giorno: 3 }]);
  assert.deepEqual(r.giorni[3], x.giorni[2]);
  assert.deepEqual(r.giorni[1].tappe, ['san-martino', 'toledo']);
  assert.deepEqual(x, originale);
});
