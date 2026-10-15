import { test } from 'node:test';
import assert from 'node:assert/strict';
import { imposta, tocco, quarti, parti, allunga, INIZIO_MIN, INIZIO_MAX, FINE_MIN, FINE_MAX } from '../src/lib/itinerari/ore.ts';

// Il selettore dell'ora «Tutte le ore» (specifiche/compositore-rifiniture-2.md, scelta di Enrico del 16/10/2026)

test('ore: passi di 15 minuti e limiti di oggi (inizio 5:00–20:00, fine 6:00–23:45)', () => {
  assert.deepEqual(imposta({ inizio: 570, fine: 1140 }, 'inizio', 583), { inizio: 585, fine: 1140, spinta: null });
  assert.equal(imposta({ inizio: 570, fine: 1140 }, 'inizio', 200).inizio, INIZIO_MIN);
  assert.equal(imposta({ inizio: 570, fine: 1440 }, 'fine', 1500).fine, FINE_MAX);
  assert.equal(imposta({ inizio: 300, fine: 1140 }, 'fine', 100).fine, FINE_MIN);
  assert.equal(imposta({ inizio: 570, fine: 1425 }, 'inizio', 1300).inizio, INIZIO_MAX);
});

test('ore: se inizio e fine si avvicinano meno di un\'ora, l\'altra si sposta con lei', () => {
  assert.deepEqual(imposta({ inizio: 570, fine: 1140 }, 'inizio', 1110), { inizio: 1110, fine: 1170, spinta: 'fine' });
  assert.deepEqual(imposta({ inizio: 570, fine: 1140 }, 'fine', 600), { inizio: 540, fine: 600, spinta: 'inizio' });
  assert.deepEqual(imposta({ inizio: 570, fine: 1140 }, 'fine', 630), { inizio: 570, fine: 630, spinta: null });
  // ai limiti l'ora d'inizio resta sempre almeno un'ora prima della fine
  assert.deepEqual(imposta({ inizio: 570, fine: 1140 }, 'inizio', 1200), { inizio: 1200, fine: 1260, spinta: 'fine' });
  assert.deepEqual(imposta({ inizio: 570, fine: 1140 }, 'fine', 360), { inizio: 300, fine: 360, spinta: 'inizio' });
});

test('ore: un tocco sceglie l\'inizio e passa alla fine; con «Fine», un\'ora prima dell\'inizio diventa il nuovo inizio', () => {
  assert.deepEqual(tocco({ inizio: 570, fine: 1140 }, 'inizio', 660), { inizio: 660, fine: 1140, spinta: null, k: 'inizio', modo: 'fine' });
  assert.deepEqual(tocco({ inizio: 660, fine: 1140 }, 'fine', 1230), { inizio: 660, fine: 1230, spinta: null, k: 'fine', modo: 'fine' });
  assert.deepEqual(tocco({ inizio: 660, fine: 1230 }, 'fine', 540), { inizio: 540, fine: 1230, spinta: null, k: 'inizio', modo: 'fine' });
});

// «Due giorni a Napoli», giorno 1, con l'inizio alle 11:00: le tappe finiscono alle 19:52 (calcolo del sito)
test('ore: la fascia va dall\'inizio alla fine scelti, tutta intera (non si ferma all\'ultima tappa)', () => {
  const q = quarti({ inizio: 570, fine: 1140 }, 1102);   // 9:30–19:00, finisci alle 18:22
  const dentro = q.filter(x => x.dentro).map(x => x.m);
  assert.equal(dentro[0], 570);
  assert.equal(dentro.at(-1), 1140);
  assert.equal(dentro.length, (1140 - 570) / 15 + 1);
  // dopo l'ultima tappa e fino alla fine scelta: tempo in più (più chiaro)
  assert.deepEqual(q.filter(x => x.libero).map(x => x.m), [1110, 1125]);
  assert.equal(q.find(x => x.finisci).m, 1095);
  assert.deepEqual(q.filter(x => x.capo).map(x => [x.m, x.capo]), [[570, 'inizio'], [1140, 'fine']]);
  assert.equal(q.filter(x => x.oltre).length, 0);
  assert.equal(q[0].m, 300);
  assert.equal(q.at(-1).m, 1425);
});

test('ore: oltre la fine scelta, righe gialle fino a quando finisci; «Finisci alle …» alla mezz\'ora dopo', () => {
  const q = quarti({ inizio: 660, fine: 1140 }, 1192);   // 11:00–19:00, finisci alle 19:52
  assert.deepEqual(q.filter(x => x.oltre).map(x => x.m), [1155, 1170, 1185]);
  assert.equal(q.find(x => x.finisci).m, 1185);
  assert.equal(q.filter(x => x.libero).length, 0);
  assert.equal(allunga(1192), 1200);
  assert.equal(allunga(1102), 1110);
  assert.equal(allunga(1430), null);
  // senza tappe (giorno vuoto) niente «finisci», niente righe gialle
  const v = quarti({ inizio: 570, fine: 1140 }, null);
  assert.equal(v.filter(x => x.finisci || x.oltre || x.libero).length, 0);
  assert.equal(v.filter(x => x.dentro).length, 39);
});

test('ore: le parti del giorno; la fascia passa anche dietro il titolo se l\'ora prima e quella dopo sono dentro', () => {
  const p = parti({ inizio: 660, fine: 1140 }, 1192);
  assert.deepEqual(p.map(x => [x.nome, x.da, x.a]), [['Presto', 5, 7], ['Mattina', 8, 12], ['Pomeriggio', 13, 17], ['Sera', 18, 23]]);
  assert.deepEqual(p.map(x => x.stato), ['', '', 'dentro', 'dentro']);
  assert.deepEqual(parti({ inizio: 570, fine: 1230 }, 1050).map(x => x.stato), ['', '', 'dentro', 'libero']);
  assert.deepEqual(parti({ inizio: 570, fine: 1020 }, 1100).map(x => x.stato), ['', '', 'dentro', 'oltre']);
});

test('ore: la frase di quando finisci, come nel foglio delle ore e in «Data e orari»', async () => {
  const { fraseFine, cortoFine } = await import('../src/lib/itinerari/ore.ts');
  assert.equal(fraseFine(1102, 1140, [], 'Duomo'), 'Finisci alle 18:22, 38 minuti prima delle 19:00. Ultima tappa: Duomo.');
  assert.equal(fraseFine(1192, 1140, ['Duomo']), 'Finisci alle 19:52, 52 minuti dopo le 19:00: Duomo resta fuori.');
  assert.equal(fraseFine(1230, 1140, ['Monte Echia', 'Borgo Marinari']), "Finisci alle 20:30, un'ora e 30 minuti dopo le 19:00: Monte Echia e Borgo Marinari restano fuori.");
  assert.equal(cortoFine(1140, 1140), 'proprio alle 19:00');
  assert.equal(cortoFine(1068, 1140), "un'ora e 12 minuti prima delle 19:00");
});
