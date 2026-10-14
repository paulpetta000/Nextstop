import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creaIndice, cerca, distanza, evidenzia, pezzi } from '../src/lib/itinerari/ricerca.ts';

// Poche voci finte, con i casi della specifica (§3): accenti, errori, parole del sito, il nome della città solo nei nomi
const voci = [
  { id: 'gesu-nuovo', nome: 'Chiesa del Gesù Nuovo', breve: 'Gesù Nuovo', zona: 'Centro storico', tipo: 'citta', generi: ['chiesa'], frasi: [{ t: 'La facciata a punte di diamante.', da: 'Ministero' }] },
  { id: 'sotterranea', nome: 'Napoli Sotterranea', breve: 'Napoli Sotterranea', zona: 'Centro storico', tipo: 'citta', generi: ['sotterraneo'], frasi: [] },
  { id: 'plebiscito', nome: 'Piazza del Plebiscito', breve: 'Plebiscito', zona: 'San Ferdinando', tipo: 'citta', generi: ['piazza'], frasi: [{ t: 'La piazza più grande della città.', da: 'Comune' }] },
  { id: 'sant-elmo', nome: 'Castel Sant\'Elmo', breve: 'Sant\'Elmo', zona: 'Vomero', tipo: 'citta', generi: ['panorama', 'castello'], frasi: [] },
  { id: 'pasticceria', nome: 'Pasticceria Esempio', breve: 'Esempio', zona: 'Toledo', tipo: 'citta', categoria: 'mangiare', cucina: ['dolci'], piatti: ['sfogliatella', 'baba'], frasi: [] },
  { id: 'pizzeria', nome: 'Pizzeria Prova', breve: 'Prova', zona: 'Tribunali', tipo: 'citta', categoria: 'mangiare', cucina: ['pizza'], piatti: ['margherita'], frasi: [] },
  { id: 'pompei', nome: 'Pompei', breve: 'Pompei', zona: 'Gite', tipo: 'gita', generi: ['archeologia'], frasi: [{ t: 'Si parte da Napoli Centrale con la Circumvesuviana.', da: 'EAV' }] }
];
const I = creaIndice(voci, ['napoli', 'napoletano', 'napoletana']);
const ids = r => r.tutti.map(x => x.id);

test('ricerca: senza accenti trova il Gesù Nuovo per primo', () => {
  assert.equal(cerca(I, 'gesu').tutti[0].id, 'gesu-nuovo');
});

test('ricerca: con una lettera sbagliata trova la sfogliatella nel menu', () => {
  const r = cerca(I, 'sfogliatela');
  assert.deepEqual(ids(r), ['pasticceria']);
  assert.equal(r.tutti[0].tipo, 'piatto');
  assert.equal(r.gruppi[0].g, 'mangiare');
});

test('ricerca: le parole del sito trovano i generi', () => {
  assert.deepEqual(ids(cerca(I, 'panorama')), ['sant-elmo']);
  assert.deepEqual(ids(cerca(I, 'belvedere')), ['sant-elmo']);
});

test('ricerca: «Napoli» vale solo nei nomi, non nelle frasi', () => {
  assert.deepEqual(ids(cerca(I, 'Napoli')), ['sotterranea']);
});

test('ricerca: una parola che c’è nei nostri testi non cerca le parole simili', () => {
  // «pizza» c'è (Pizzeria), quindi non trova «piazza»
  assert.ok(!ids(cerca(I, 'pizza')).includes('plebiscito'));
  assert.ok(ids(cerca(I, 'pizza')).includes('pizzeria'));
});

test('ricerca: niente risultati, troppo corto, filtri e minuti', () => {
  assert.deepEqual(cerca(I, 'astronave').tutti, []);
  assert.equal(cerca(I, 'a'), null);
  assert.deepEqual(ids(cerca(I, 'chiesa', { ok: id => id !== 'gesu-nuovo' })), []);
  const r = cerca(I, 'centro', { minuti: id => (id === 'sotterranea' ? 3 : 20) });
  assert.deepEqual(ids(r), ['sotterranea', 'gesu-nuovo'], 'a parità, il più vicino');
});

test('ricerca: gite in un gruppo a parte, e la parola trovata segnata nel testo', () => {
  const r = cerca(I, 'circumvesuviana');
  assert.deepEqual(r.gruppi.map(x => x.g), ['gite']);
  const p = pezzi('Si parte da Napoli Centrale con la Circumvesuviana.');
  assert.equal(evidenzia(p, r.tutti[0].dove), 'Si parte da Napoli Centrale con la <mark class="r-segno">Circumvesuviana</mark>.');
  assert.equal(distanza('caravagio', 'caravaggio', 2), 1);
});
