import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcolaGiorno } from '../src/lib/itinerari/calcolo.ts';
import { conPause, pauseDelGiorno } from '../src/lib/itinerari/pause.ts';
import { giornoVuoto } from '../src/lib/itinerari/link.ts';

// Quattro tappe di un'ora e dieci minuti tra l'una e l'altra, senza dati reali (specifiche/compositore.md §9, pause e margini).
const scenari = ['feriale', 'sabato', 'sabato-pomeriggio', 'domenica', 'festivo', 'piedi'];
const ids = ['a', 'b', 'c', 'd'];
function citta({ generi = {}, locali = [] } = {}) {
  const n = ids.length;
  const matrice = v => Object.fromEntries(scenari.map(s => [s, Array.from({ length: n * n }, (_, k) => (Math.floor(k / n) === k % n ? 0 : v))]));
  return {
    tappe: ids.map((id, p) => ({ id, p, tipo: 'citta', durata: 60, chiuso: [], reversibile: false, generi: generi[id] ?? [], ...(locali.includes(id) ? { categoria: 'mangiare' } : {}) })),
    tempi: { n, min: matrice(10), metri: matrice(500), mezzi: matrice('') }, linee: {}, zone: {}
  };
}
const viaggio = g => ({ id: 'viaggio0', nome: 'Prova', giorni: [{ ...giornoVuoto(570, 1140), tappe: ids, ...g }], creato: 1, modificato: 1 });
const giornata = (C, x, margine) => conPause(C, x.giorni[0], calcolaGiorno(C, x, 0), margine);

test('pause: la pausa pranzo c’è già, dopo la tappa che finisce più vicino alle 13', () => {
  const C = citta(), x = viaggio();
  // a 9:30–10:30, b 10:40–11:40, c 11:50–12:50, d 13:00–14:00: la pausa va dopo c
  const r = giornata(C, x);
  assert.deepEqual(r.pause.map(p => [p.quale, p.dove, p.inizio, p.fine]), [['pranzo', 'c', 770, 830]]);
  assert.deepEqual(r.voci.filter(v => v.tipo === 'tappa').map(v => [v.id, v.inizio, v.fine]), [['a', 570, 630], ['b', 640, 700], ['c', 710, 770], ['d', 840, 900]]);
  assert.equal(r.fine, 900);
  assert.equal(r.pauseMin, 60);
  assert.equal(r.totale, 330);
  assert.equal(r.resta, 240);
});

test('pause: si mangia dopo la tappa «cibo» dell’ora di pranzo, mai dopo l’ultima', () => {
  const C = citta({ generi: { b: ['cibo'] } });
  // con 10 minuti di margine b finisce alle 11:50, dentro l'ora in cui si mangia: vince su c, più vicina alle 13
  assert.equal(giornata(C, viaggio(), 10).pause[0].dove, 'b');
  assert.equal(giornata(C, viaggio(), 0).pause[0].dove, 'c', 'b finisce alle 11:40, troppo presto per pranzare');
  const solo = giornata(C, viaggio({ pause: [{ quale: 'caffe', min: 20, dopo: 'd' }] }));
  assert.equal(solo.pause[0].quale, 'caffe');
  assert.notEqual(solo.pause[0].dove, 'd');
});

test('pause: nessuna pausa scelta, durata cambiata e posto scelto', () => {
  const C = citta();
  assert.deepEqual(giornata(C, viaggio({ pause: [] })).pause, []);
  const r = giornata(C, viaggio({ pause: [{ quale: 'pranzo', min: 90, dopo: 'a' }] }));
  assert.deepEqual(r.pause.map(p => [p.dove, p.inizio, p.fine]), [['a', 630, 720]]);
  assert.equal(r.fine, 930);
});

test('pause: con un locale all’ora di pranzo la pausa resta da parte, e torna se lo togli', () => {
  const C = citta({ locali: ['c'] });
  assert.deepEqual(giornata(C, viaggio()).pause, []);
  assert.deepEqual(pauseDelGiorno(C, viaggio().giorni[0], calcolaGiorno(C, viaggio(), 0)), [], 'senza pausa di base');
  const scelta = viaggio({ pause: [{ quale: 'pranzo', min: 45, dopo: 'b' }] });
  assert.deepEqual(giornata(C, scelta).pause, [], 'la pausa scelta resta nei dati ma non si conta');
  const senzaLocale = { ...scelta, giorni: [{ ...scelta.giorni[0], tappe: ['a', 'b', 'd'] }] };
  assert.deepEqual(giornata(C, senzaLocale).pause.map(p => [p.dove, p.min]), [['b', 45]]);
});

test('pause: il margine si aggiunge dopo ogni tratto, i minuti a piedi restano veri', () => {
  const C = citta(), x = viaggio({ pause: [] });
  const r = giornata(C, x, 10);
  assert.equal(r.spostamenti, 30);
  assert.equal(r.margineMin, 30);
  assert.equal(r.fine, 570 + 240 + 30 + 30);
  assert.deepEqual(r.fasi.map(f => f.tipo), ['visita', 'cammino', 'margine', 'visita', 'cammino', 'margine', 'visita', 'cammino', 'margine', 'visita']);
});

test('pause: una pausa che fa sforare dà l’avviso «piena», con le tappe da spostare', () => {
  const C = citta(), x = viaggio({ fine: 900 });
  const base = calcolaGiorno(C, x, 0);
  assert.equal(base.avvisi.length, 0);
  const r = conPause(C, x.giorni[0], base, 0);
  assert.deepEqual(r.avvisi, [], 'finire proprio alle 15:00 non è sforare');
  const stretto = { ...x, giorni: [{ ...x.giorni[0], fine: 860 }] };
  const r2 = conPause(C, stretto.giorni[0], calcolaGiorno(C, stretto, 0), 0);
  assert.deepEqual(r2.avvisi, [{ tipo: 'piena', fine: 900, limite: 860, daSpostare: ['d'] }]);
  assert.equal(r2.resta, -40);
});

test('pause: un giorno con una tappa sola o vuoto non ha la pausa pranzo', () => {
  const C = citta();
  assert.deepEqual(giornata(C, viaggio({ tappe: ['a'] })).pause, []);
  const vuoto = viaggio({ tappe: [] });
  const r = giornata(C, vuoto);
  assert.equal(r.fine, 570);
  assert.deepEqual(r.pause, []);
});

test('pause: dal vivo le tappe fatte restano in cima e non spostano gli orari', () => {
  const C = citta(), x = { ...viaggio({ fatte: ['a'], pause: [] }), data: '2026-10-14' };
  const r = conPause(C, x.giorni[0], calcolaGiorno(C, x, 0, { data: '2026-10-14', ora: 660 }), 5);
  const t = r.voci.filter(v => v.tipo === 'tappa');
  assert.equal(t[0].id, 'a');
  assert.equal(t[0].fatta, true);
  assert.equal(r.inizio, 660, 'riparte da adesso, le 11:00, dall’ultima fatta');
  assert.deepEqual([t[1].id, t[1].inizio], ['b', 675], 'il tratto e il margine prima della tappa dopo');
});
