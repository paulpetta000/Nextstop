import { test } from 'node:test';
import assert from 'node:assert/strict';
import { codifica, decodifica, sistema, uguali, giornoVuoto, MAX_GIORNI, MAX_TAPPE, MAX_NOME } from '../src/lib/itinerari/link.ts';

const tappe = Array.from({ length: MAX_TAPPE + 1 }, (_, i) => ({ id: `tappa${i}`, tipo: 'citta' }));
const C = { tappe: [...tappe, { id: 'gita', tipo: 'gita' }], evento: { id: 'evento' } };
const viaggio = giorni => ({ id: 'viaggio0', nome: 'Caffè, mare & città', data: '2026-10-09', piedi: true, giorni, creato: 1, modificato: 1 });

test('link itinerari: andata e ritorno conserva nome, data, cammino, ordine e gite', () => {
  const x = viaggio([{ ...giornoVuoto(615, 1125), tappe: ['tappa1', 'evento', 'tappa0'] }, { ...giornoVuoto(), tappe: [], gita: 'gita' }]);
  const hash = codifica(x);
  const ricevuto = decodifica(C, '#' + hash);
  assert.deepEqual(ricevuto.scartate, []);
  assert.equal(ricevuto.it.nome, x.nome);
  assert.equal(ricevuto.it.data, x.data);
  assert.equal(ricevuto.it.piedi, true);
  assert.deepEqual(ricevuto.it.giorni, x.giorni);
  assert.equal(codifica(ricevuto.it), hash);
});

test('link itinerari: tappe inesistenti e doppioni non impediscono di aprire un vecchio link', () => {
  const r = decodifica(C, '#n=Vecchio&g=0930-1900.tappa0.assente.tappa0.gita.evento');
  assert.deepEqual(r.it.giorni[0].tappe, ['tappa0', 'evento']);
  assert.deepEqual(r.scartate, ['assente', 'gita']);
  assert.equal(decodifica(C, '#n=Solo+un+nome'), null);
});

test('link itinerari: sanitizzazione conserva i limiti e ripara dati e orari non validi', () => {
  const g = { tappe: [...tappe.map(t => t.id), 'tappa0'], inizio: -20, fine: 10, ok: ['tappa0', 'assente'], fatte: ['tappa1', 'assente'] };
  const r = sistema(C, { id: 'non valido!', nome: 'x'.repeat(MAX_NOME + 1), data: '2026-02-30', giorni: Array.from({ length: MAX_GIORNI + 1 }, () => g) });
  assert.match(r.it.id, /^[a-z0-9]{6,32}$/i);
  assert.equal(r.it.nome.length, MAX_NOME);
  assert.equal(r.it.data, undefined);
  assert.equal(r.it.giorni.length, MAX_GIORNI);
  assert.deepEqual(r.it.giorni[0], { tappe: tappe.slice(0, MAX_TAPPE).map(t => t.id), inizio: 570, fine: 630, ok: ['tappa0'], fatte: ['tappa1'] });
  assert.deepEqual(sistema(C, {}).it.giorni, [giornoVuoto()]);
});

test('link itinerari: una gita occupa il giorno senza tappe in città', () => {
  const r = sistema(C, { giorni: [{ ...giornoVuoto(), gita: 'gita', tappe: ['tappa0'], ok: ['tappa0'], fatte: ['tappa0'] }] });
  assert.deepEqual(r.it.giorni, [{ ...giornoVuoto(), gita: 'gita' }]);
});

test('link itinerari: il confronto ignora solo il nome, senza confondere giorni diversi', () => {
  const x = viaggio([{ ...giornoVuoto(), tappe: ['tappa0', 'tappa1'] }]);
  assert.equal(uguali(x, { ...x, nome: 'Altro nome' }), true);
  assert.equal(uguali(x, { ...x, data: '2026-10-10' }), false);
  assert.equal(uguali(x, { ...x, piedi: false }), false);
  assert.equal(uguali(x, { ...x, giorni: [{ ...giornoVuoto(), tappe: ['tappa1', 'tappa0'] }] }), false);
});

// Compositore nuovo (specifiche/compositore.md §4, §5, §9): pause e margine vanno nel link; salvato, timbri e «Lascia così» restano sul telefono
test('link itinerari: pause e margine vanno e tornano nel link, senza cambiare i vecchi link', () => {
  const x = { ...viaggio([
    { ...giornoVuoto(), tappe: ['tappa0', 'tappa1', 'tappa2'], pause: [{ quale: 'pranzo', min: 45, dopo: 'tappa1' }, { quale: 'caffe', min: 20 }] },
    { ...giornoVuoto(), tappe: ['tappa3'] },
    { ...giornoVuoto(), tappe: ['tappa4', 'tappa5'], pause: [] }
  ]), margine: 10 };
  const hash = codifica(x);
  assert.match(hash, /(^|&)m=10(&|$)/);
  const r = decodifica(C, '#' + hash);
  assert.deepEqual(r.scartate, []);
  assert.equal(r.it.margine, 10);
  assert.deepEqual(r.it.giorni.map(g => g.pause), x.giorni.map(g => g.pause));
  assert.equal(codifica(r.it), hash);
  // senza pause scelte né margine il link è quello di prima
  const vecchio = viaggio([{ ...giornoVuoto(), tappe: ['tappa0', 'tappa1'] }]);
  assert.doesNotMatch(codifica(vecchio), /(^|&)(p|m)=/);
  assert.equal(decodifica(C, '#' + codifica(vecchio)).it.giorni[0].pause, undefined);
});

test('link itinerari: visitate, timbri, «Salva» e «Lascia così» non vanno nel link', () => {
  const x = { ...viaggio([{ ...giornoVuoto(), tappe: ['tappa0', 'tappa1'], fatte: ['tappa0'], lascia: 'tappa0.tappa1' }]), salvato: true, timbri: { tappa0: 1760000000000 } };
  const hash = codifica(x);
  assert.doesNotMatch(hash, /fatte|lascia|salvato|timbri|1760000000000/);
  const r = decodifica(C, '#' + hash).it;
  assert.equal(r.salvato, undefined);
  assert.equal(r.timbri, undefined);
  assert.equal(r.giorni[0].fatte, undefined);
});

test('link itinerari: la memoria conserva Salva, timbri, pause e margine validi, e scarta il resto', () => {
  const r = sistema(C, {
    salvato: false, margine: 7, timbri: { tappa0: 1760000000000, tappa9: 5, tappa1: 'ieri' },
    giorni: [{ ...giornoVuoto(), tappe: ['tappa0', 'tappa1'], lascia: 'tappa1.tappa0', pause: [{ quale: 'pranzo', min: 60, dopo: 'tappa1' }, { quale: 'cena', min: 60 }, { quale: 'caffe', min: -3 }, { quale: 'riposo', min: 30, dopo: 'assente' }] }]
  }).it;
  assert.equal(r.salvato, false);
  assert.equal(r.margine, undefined, 'solo 5, 10 o 15 minuti');
  assert.deepEqual(r.timbri, { tappa0: 1760000000000 });
  assert.deepEqual(r.giorni[0].pause, [{ quale: 'pranzo', min: 60, dopo: 'tappa1' }, { quale: 'riposo', min: 30 }]);
  assert.equal(r.giorni[0].lascia, 'tappa1.tappa0');
  const vecchio = sistema(C, { giorni: [{ ...giornoVuoto(), tappe: ['tappa0'] }] }).it;
  assert.equal(vecchio.salvato, undefined, 'gli itinerari di prima restano salvati');
  assert.equal(vecchio.giorni[0].pause, undefined);
});

test('link itinerari: il confronto tiene conto di pause e margine', () => {
  const x = viaggio([{ ...giornoVuoto(), tappe: ['tappa0', 'tappa1'] }]);
  assert.equal(uguali(x, { ...x, margine: 5 }), false);
  assert.equal(uguali(x, { ...x, giorni: [{ ...x.giorni[0], pause: [] }] }), false);
  assert.equal(uguali(x, { ...x, salvato: false, timbri: { tappa0: 1 } }), true);
});
