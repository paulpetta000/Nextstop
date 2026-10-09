import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcolaGiorno, orarioLocale, scenarioDi } from '../src/lib/itinerari/calcolo.ts';
import { giornoVuoto } from '../src/lib/itinerari/link.ts';

// Due tappe e una matrice 2×2, senza dati reali, rete o orologio del telefono.
const scenari = ['feriale', 'sabato', 'sabato-pomeriggio', 'domenica', 'festivo', 'piedi'];
function citta(min = 10, mezzi = '') {
  const matrice = v => Object.fromEntries(scenari.map(s => [s, [0, v, v, 0]]));
  return {
    tappe: ['a', 'b'].map((id, p) => ({ id, p, tipo: 'citta', durata: 30, chiuso: [], reversibile: false })),
    tempi: { n: 2, min: matrice(min), metri: matrice(500), mezzi: matrice(mezzi) }, linee: {}, zone: {}
  };
}
const viaggio = (g = {}, data = '2026-10-09') => ({ id: 'viaggio0', nome: 'Prova', data, giorni: [{ ...giornoVuoto(600, 1080), tappe: ['a', 'b'], ...g }], creato: 1, modificato: 1 });

test('calcolo: giornata vuota senza visite, spostamenti o avvisi', () => {
  const r = calcolaGiorno(citta(), viaggio({ tappe: [] }), 0);
  assert.equal(r.inizio, 600);
  assert.equal(r.fine, 600);
  assert.equal(r.visite, 0);
  assert.equal(r.spostamenti, 0);
  assert.equal(r.n, 0);
  assert.deepEqual(r.voci, []);
  assert.deepEqual(r.avvisi, []);
});

test('calcolo: visite e cammino determinano orari e tappe da spostare senza mutare il piano', () => {
  const x = viaggio({ fine: 660 });
  const prima = structuredClone(x);
  const r = calcolaGiorno(citta(), x, 0);
  assert.deepEqual(r.voci.filter(v => v.tipo === 'tappa').map(v => [v.id, v.inizio, v.fine]), [['a', 600, 630], ['b', 640, 670]]);
  assert.equal(r.visite, 60);
  assert.equal(r.spostamenti, 10);
  assert.equal(r.metri, 500);
  assert.equal(r.fine, 670);
  assert.deepEqual(r.avvisi, [{ tipo: 'piena', fine: 670, limite: 660, daSpostare: ['b'] }]);
  assert.deepEqual(x, prima);
});

test('calcolo: cambi di scenario al minuto previsto e opzione solo a piedi', () => {
  assert.equal(scenarioDi('2026-10-10', 889), 'sabato');
  assert.equal(scenarioDi('2026-10-10', 890), 'sabato-pomeriggio');
  assert.equal(scenarioDi('2026-10-11', 839), 'domenica');
  assert.equal(scenarioDi('2026-10-11', 840), 'festivo');
  assert.equal(scenarioDi(undefined, 900), 'feriale');
  assert.equal(scenarioDi('2026-10-10', 900, true), 'piedi');
});

test('locali: segnala apertura futura o chiusura durante il pasto, rispettando i confini', () => {
  const t = { orari: [[720, 840, 1140, -1], null, null, null, null, null, null] };
  assert.deepEqual(orarioLocale(t, '2026-10-12', 700, 60), { apre: 720 });
  assert.equal(orarioLocale(t, '2026-10-12', 780, 60), null);
  assert.deepEqual(orarioLocale(t, '2026-10-12', 781, 60), { chiude: 840 });
  assert.deepEqual(orarioLocale(t, '2026-10-12', 840, 60), { apre: 1140 });
  assert.equal(orarioLocale(t, '2026-10-12', 1200, 60), null);
});

test('locali: senza data non dichiara chiuso se una fascia nota va bene; orari assenti non generano avvisi', () => {
  const t = { orari: [[720, 840], [1080, 1200], null, null, null, null, null] };
  assert.equal(orarioLocale(t, undefined, 750, 30), null);
  assert.deepEqual(orarioLocale(t, undefined, 700, 30), { apre: 720 });
  assert.equal(orarioLocale({}, '2026-10-12', 750, 30), null);
});

function conBus(partenze = [640]) {
  const C = citta(15, 'B1');
  C.vivo = {
    dal: '20261009', al: '20261009', giorni: { '20261009': 0 },
    salite: [new Map()], viaggi: [new Map([['B1|salita|discesa', { min: 10, partenze }]])],
    fermate: { salita: 'Fermata A' }, preferenza: 5,
    candidati: [{ seg: [5, 'B1|salita|discesa', 5], metri: 300, mezzi: 'B1' }],
    senza: { feriale: new Map([[1, { min: 45, metri: 1500, mezzi: '' }]]) },
    bus: { feriale: new Map([[1, [0]]]) }
  };
  return C;
}

test('bus: usa la prima partenza raggiungibile, includendo cammino e attesa', () => {
  const r = calcolaGiorno(conBus([630, 640, 680]), viaggio(), 0);
  const tratto = r.voci.find(v => v.tipo === 'tratto');
  assert.equal(r.orariVeri, true);
  assert.equal(tratto.min, 25);
  assert.deepEqual(tratto.corse, [{ linea: 'B1', da: 'Fermata A', ora: 640 }]);
  assert.equal(r.fine, 685);
});

test('bus: dopo l’ultima corsa o senza dati per la corsa usa il percorso senza bus', () => {
  for (const mancanti of [false, true]) {
    const C = conBus([630]);
    if (mancanti) C.vivo.viaggi[0].clear();
    const r = calcolaGiorno(C, viaggio(), 0);
    const tratto = r.voci.find(v => v.tipo === 'tratto');
    assert.equal(tratto.variante, 'senza');
    assert.equal(tratto.min, 45);
    assert.equal(tratto.corse, undefined);
    assert.equal(tratto.scartato.ora, mancanti ? -2 : -1);
    assert.equal(r.fine, 705);
  }
});

test('bus: senza feed o con data fuori dal feed conserva i tempi medi', () => {
  const senzaFeed = citta(15, 'B1');
  for (const [C, data] of [[senzaFeed, '2026-10-09'], [conBus(), '2026-10-12']]) {
    const r = calcolaGiorno(C, viaggio({}, data), 0);
    assert.equal(r.orariVeri, undefined);
    assert.equal(r.spostamenti, 15);
    assert.equal(r.fine, 675);
  }
});

test('calcolo dal vivo: le tappe visitate restano senza orari e si riparte dall’ora indicata', () => {
  const x = viaggio({ fatte: ['a'] });
  const prima = structuredClone(x);
  const r = calcolaGiorno(citta(), x, 0, { data: '2026-10-09', ora: 720 });
  assert.equal(r.vivo, true);
  assert.deepEqual([r.voci[0].id, r.voci[0].inizio, r.voci[0].fine, r.voci[0].fatta], ['a', -1, -1, true]);
  assert.deepEqual(r.voci.filter(v => v.tipo === 'tappa' && !v.fatta).map(v => [v.id, v.inizio, v.fine]), [['b', 730, 760]]);
  assert.equal(r.visite, 30);
  assert.deepEqual(x, prima);
});
