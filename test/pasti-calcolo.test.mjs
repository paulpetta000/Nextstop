import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as calcolo from '../src/lib/itinerari/calcolo.ts';
import * as pause from '../src/lib/itinerari/pause.ts';
import { SCENARI } from '../src/lib/itinerari/tipi.ts';
import { MAX_TAPPE, codifica, decodifica, sistema } from '../src/lib/itinerari/link.ts';
import { giornoSettimana, ora } from '../src/lib/itinerari/date.ts';
import { preparaPasto } from '../src/lib/itinerari/pasti.ts';

const sorgente = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/pasto.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?$/gm, '').replace(/^export /gm, '');

function ambiente({ bus = true, cena = false, margine = 0 } = {}) {
  const matrice = v => Object.fromEntries(SCENARI.map(s => [s, Array.from({ length: 9 }, (_, i) => Math.floor(i / 3) === i % 3 ? 0 : v)]));
  const C = { tappe: ['a', 'b', 'locale'].map((id, p) => ({ id, p, tipo: 'citta', durata: 30, chiuso: [], nome: id, breve: id, reversibile: false })),
    tempi: { n: 3, min: matrice(15), metri: matrice(100), mezzi: matrice('') }, linee: {}, zone: {} };
  C.tempi.min.piedi = [0, 45, 45, 45, 0, 45, 45, 45, 0];
  Object.assign(C.tappe[2], { categoria: 'mangiare', pasto: ['pranzo', 'cena'], cucina: ['pizza'], orari: Array.from({ length: 7 }, () => [720, 1400]) });
  const x = { id: 'viaggio0', nome: 'Prova', data: '2026-10-09', margine, giorni: [{ inizio: cena ? 1050 : 720, fine: 1260, tappe: cena ? ['a'] : ['a', 'b'], pause: cena ? [] : [{ quale: 'pranzo', min: 60, dopo: 'a' }] }] };
  if (bus) {
    C.tempi.mezzi.feriale[2] = 'B1';
    C.vivo = { giorni: { '20261009': 0 }, salite: [new Map()], viaggi: [new Map([['B1|s|d', { min: 10, partenze: [800, 1200] }]])],
      fermate: { s: 'Fermata fittizia' }, preferenza: 5, candidati: [{ seg: [5, 'B1|s|d', 5], metri: 100, mezzi: 'B1' }],
      senza: { feriale: new Map([[2, { min: 120, metri: 5000, mezzi: '' }]]) }, bus: { feriale: new Map([[2, [0]]]) } };
  }
  const G = g => pause.conPause(C, x.giorni[g], calcolo.calcolaGiorno(C, x, g), x.margine, { data: calcolo.dataDelGiorno(x, g), piedi: x.piedi });
  const avvisi = [], menu = { html: '' };
  const d = { ...calcolo, ...pause, preparaPasto, adessoPer: () => undefined, MAX_TAPPE, C, X: () => x, G, grezzo: g => calcolo.calcolaGiorno(C, x, g),
    T: id => calcolo.tappaDi(C, id), tappeDi: r => r.voci.filter(v => v.tipo === 'tappa'), daFare: r => r.voci.filter(v => v.tipo === 'tappa' && !v.fatta),
    nelViaggio: id => x.giorni.some(g => g.tappe.includes(id)), dataDi: g => calcolo.dataDelGiorno(x, g), giornoSett: g => giornoSettimana(calcolo.dataDelGiorno(x, g)), ora,
    conAnnulla: (testo, fn) => fn(x), aggiorna: fn => fn(x), S: {}, avvisa: testo => avvisi.push(testo), annuncia() {},
    esc: s => String(s ?? ''), ic: () => '', dataLungaDi: () => 'data fittizia', foglio: (titolo, html) => { menu.html = html; } };
  const api = new Function(...Object.keys(d), sorgente + ';return { vicini, mangiaQui, momenti, apriMenu, rigaPasto };')(...Object.values(d));
  return { C, x, G, avvisi, menu, ...api, m: { g: 0, q: cena ? 'cena' : 'pranzo', dove: 'a', ora: cena ? 1170 : 750, min: 60, dopo: cena ? null : 'b' } };
}

test('pasti: la proposta usa la partenza bus disponibile e controlla l’apertura all’arrivo', () => {
  const e = ambiente(); e.C.tappe[2].orari = Array.from({ length: 7 }, () => [720, 800]);
  const prima = structuredClone(e.x), r = e.vicini(e.m)[0];
  assert.equal(r.arrivo, 815); assert.equal(r.min, 65); assert.equal(r.stato, 'chiuso');
  assert.deepEqual(e.x, prima, 'la proposta non inserisce il locale');
});

test('pasti: dopo l’ultima corsa la proposta usa il percorso senza bus', () => {
  const e = ambiente(); e.m.ora = 1250; e.m.q = 'cena'; e.x.giorni[0].inizio = 1220; e.x.giorni[0].pause = [];
  const r = e.vicini(e.m)[0]; assert.equal(r.min, 120); assert.equal(r.arrivo, 1370); assert.equal(r.mezzi, false);
});

test('pasti: margine e orario proposto coincidono con il locale inserito', () => {
  const e = ambiente({ margine: 10 }), r = e.vicini(e.m)[0]; e.mangiaQui(e.m, 'locale');
  assert.equal(r.arrivo, e.G(0).voci.find(v => v.id === 'locale').inizio);
});

test('pasti: la cena proposta e quella inserita hanno lo stesso orario con l’attesa iniziale', () => {
  const e = ambiente({ bus: false, cena: true }), r = e.vicini(e.m)[0]; e.mangiaQui(e.m, 'locale');
  assert.equal(r.arrivo, e.G(0).voci.find(v => v.id === 'locale').inizio);
});

test('pasti: l’arrivo di nuovi scenari invalida i risultati già calcolati', () => {
  const e = ambiente({ bus: false }); const prima = e.vicini(e.m)[0];
  e.C.tempi = structuredClone(e.C.tempi); e.C.tempi.min.feriale[2] = 50;
  const dopo = e.vicini(e.m)[0]; assert.equal(prima.min, 15); assert.equal(dopo.min, 50);
});

test('pasti: la preferenza solo a piedi resta rispettata', () => {
  const e = ambiente(); e.x.piedi = true; const r = e.vicini(e.m)[0];
  assert.equal(r.min, 45); assert.equal(r.mezzi, false);
});

test('pasti: nuovi orari bus e modifiche agli altri giorni non lasciano proposte obsolete', () => {
  const e = ambiente(); assert.equal(e.vicini(e.m)[0].arrivo, 815);
  e.C.vivo = structuredClone(e.C.vivo); e.C.vivo.viaggi[0].get('B1|s|d').partenze = [850];
  assert.equal(e.vicini(e.m)[0].arrivo, 865);
  e.x.giorni.push({ inizio: 570, fine: 1140, tappe: ['locale'] });
  assert.deepEqual(e.vicini(e.m), [], 'un locale già inserito in un altro giorno non viene riproposto');
});

test('pasti: un menù superato non duplica una tappa o la inserisce dopo una tappa rimossa', () => {
  for (const cambia of [e => e.x.giorni[0].tappe.push('locale'), e => e.x.giorni[0].tappe.shift()]) {
    const e = ambiente(); cambia(e); const prima = structuredClone(e.x); e.mangiaQui(e.m, 'locale');
    assert.deepEqual(e.x, prima); assert.equal(e.avvisi.length, 1); assert.match(e.avvisi[0], /non è stato aggiunto.*Riapri il menù/);
  }
});

test('pasti: le visitate, i timbri e le pause restano intatti durante la proposta dal vivo', () => {
  const e = ambiente(); e.x.giorni[0].fatte = ['a']; e.x.timbri = { a: 1760000000000 };
  const prima = structuredClone(e.x);
  const r = preparaPasto(e.C, e.x, e.m, 'locale', { data: e.x.data, ora: 750 });
  assert.equal(r.calcolo.voci.find(v => v.id === 'a').fatta, true);
  assert.deepEqual(r.giorno.fatte, ['a']); assert.deepEqual(e.x, prima);
});

test('pasti: anche un’attesa di cena oltre quattro ore si conserva nel link e in memoria', () => {
  const e = ambiente({ bus: false, cena: true }); e.x.giorni[0].inizio = 570;
  e.mangiaQui(e.m, 'locale');
  assert.ok(e.x.giorni[0].pause.find(p => p.quale === 'libero').min > 240);
  assert.deepEqual(decodifica(e.C, codifica(e.x)).it.giorni[0].pause, e.x.giorni[0].pause);
  assert.deepEqual(sistema(e.C, e.x).it.giorni[0].pause, e.x.giorni[0].pause);
});

test('pasti: il limite esteso vale solo per il tempo libero e resta finito', () => {
  const e = ambiente();
  for (const [quale, min, ammessa] of [['libero', 870, true], ['libero', 871, false], ['libero', Infinity, false], ['libero', 4, false], ['pranzo', 241, false], ['caffe', 241, false], ['riposo', 241, false], ['pranzo', 240, true]]) {
    e.x.giorni[0].pause = [{ quale, min, dopo: 'a' }];
    const r = sistema(e.C, e.x).it.giorni[0].pause;
    assert.equal(r.length, ammessa ? 1 : 0, `${quale}/${min}`);
  }
});

test('pasti: il filtro non dichiara a piedi i minuti di un percorso con il bus', () => {
  const e = ambiente(); e.apriMenu(e.m, 0);
  assert.match(e.menu.html, /aria-label="Tempo per arrivare al locale"/);
  assert.ok(!e.menu.html.includes('<span>A piedi:</span>'));
  assert.ok(e.menu.html.includes('con i mezzi'));
});

test('pasti: gli orari non pubblicati non diventano un locale sicuramente aperto', () => {
  for (const senzaData of [false, true]) {
    const e = ambiente({ bus: false }); e.C.tappe[2].orari = Array(7).fill(null); if (senzaData) delete e.x.data;
    const r = e.vicini(e.m)[0]; assert.equal(r.stato, 'ignoto'); assert.match(r.nota, /orario non pubblicato/);
    assert.doesNotMatch(e.rigaPasto(e.m, 'c'), /locale aperto|aperti intorno|più vicino aperto/);
    e.apriMenu(e.m, 0); assert.ok(e.menu.html.includes('orario non pubblicato')); assert.ok(e.menu.html.includes('Mangia qui'));
  }
});

test('pasti: oltre mezzanotte non usa gli orari del giorno prima per dichiarare aperto', () => {
  const e = ambiente({ bus: false }); e.x.giorni[0].inizio = 1200; e.x.giorni[0].pause = [];
  e.C.tempi.min.feriale[2] = 300;
  const r = e.vicini(e.m)[0]; assert.ok(r.arrivo >= 1440); assert.equal(r.stato, 'ignoto'); assert.match(r.nota, /mezzanotte|non verificato/);
  assert.match(e.rigaPasto(e.m, 'c'), /apertura non è verificata/);
});
