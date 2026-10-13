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
