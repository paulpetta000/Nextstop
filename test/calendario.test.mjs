import { test } from 'node:test';
import assert from 'node:assert/strict';
import { settimaneDelMese, chiuseDa, mesiDaMostrare, DATA_MIN, DATA_MAX } from '../src/lib/itinerari/calendario.ts';

// Il calendario «Tutti i mesi» del compositore (specifiche/compositore-rifiniture-2.md, scelte del 15/10/2026)

test('le settimane di un mese partono dal lunedì, con i vuoti prima e dopo', () => {
  const s = settimaneDelMese('2026-10'); // il 1° ottobre 2026 è un giovedì
  assert.deepEqual(s[0], [null, null, null, '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']);
  assert.deepEqual(s.at(-1), ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', null]);
  assert.ok(s.every(r => r.length === 7));
  assert.equal(s.flat().filter(Boolean).length, 31);
  assert.equal(settimaneDelMese('2027-02').flat().filter(Boolean).length, 28);
  assert.equal(settimaneDelMese('2028-02').flat().filter(Boolean).length, 29);
});

// «Due giorni a Napoli»: MANN e Cappella Sansevero chiudono il martedì; San Martino il martedì, Palazzo Reale il mercoledì
const CHIUSO = { mann: ['mar'], sansevero: ['mar'], 'san-martino': ['mar'], 'palazzo-reale': ['mer'] };
const chiusoDi = id => CHIUSO[id];
const DUE = [{ tappe: ['mann', 'tribunali', 'sansevero'] }, { tappe: ['sant-elmo', 'san-martino', 'palazzo-reale'] }];

test('partendo di martedì: chiusi MANN e Sansevero il giorno 1, Palazzo Reale il giorno 2', () => {
  assert.deepEqual(chiuseDa(DUE, '2026-10-20', chiusoDi), [
    { giorno: 0, data: '2026-10-20', chiuse: ['mann', 'sansevero'] },
    { giorno: 1, data: '2026-10-21', chiuse: ['palazzo-reale'] }
  ]);
});

test('partendo di lunedì chiude San Martino il giorno 2; di giovedì è tutto aperto', () => {
  assert.deepEqual(chiuseDa(DUE, '2026-10-19', chiusoDi).map(g => g.chiuse), [[], ['san-martino']]);
  assert.deepEqual(chiuseDa(DUE, '2026-10-22', chiusoDi).map(g => g.chiuse), [[], []]);
});

test('un giorno di gita non ha chiusure; il viaggio passa da un mese all\'altro', () => {
  const r = chiuseDa([{ tappe: ['mann'] }, { tappe: [], gita: 'pompei' }], '2026-10-31', chiusoDi);
  assert.deepEqual(r.map(g => g.data), ['2026-10-31', '2026-11-01']);
  assert.deepEqual(r[1].chiuse, []);
});

test('i mesi da mostrare: da questo mese per 15 mesi, e anche quello della data scelta se è prima', () => {
  const m = mesiDaMostrare('2026-10-15');
  assert.equal(m.length, 15);
  assert.equal(m[0], '2026-10');
  assert.equal(m.at(-1), '2027-12');
  assert.equal(mesiDaMostrare('2026-10-15', '2026-08-03')[0], '2026-08');
  assert.ok(mesiDaMostrare('2026-10-15', '2028-05-01').includes('2028-05'), 'una data lontana resta visibile');
});

test('i mesi non escono dai limiti del compositore (2026–2030)', () => {
  assert.equal(DATA_MIN, '2026-01-01');
  assert.equal(DATA_MAX, '2030-12-31');
  assert.equal(mesiDaMostrare('2030-06-10').at(-1), '2030-12');
  assert.equal(mesiDaMostrare('2025-12-31')[0], '2026-01');
});
