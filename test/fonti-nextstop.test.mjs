import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { fonteDiNextstop, fontiDiNextstop } from '../src/lib/fonti-nextstop.mjs';

const fonti = yaml.load(readFileSync(new URL('../src/data/fonti.yaml', import.meta.url), 'utf8'));
const fatti = yaml.load(readFileSync(new URL('../src/data/fatti.yaml', import.meta.url), 'utf8'));

test('le fonti pubbliche di Nextstop escludono i documenti della Coppa, anche quello del Comune', () => {
  const regate = fonti.filter(f => /america.?s.?cup/i.test(`${f.titolo} ${f.url}`));
  assert.equal(regate.length, 9, 'Il caso reale comprende nove documenti delle regate');
  const pubbliche = fontiDiNextstop(fonti);
  assert.equal(pubbliche.length, 210);
  assert.deepEqual(pubbliche.filter(f => regate.some(r => r.id === f.id)), []);
});

test('fonti di viaggio e dati aperti restano disponibili senza alterare ordine o oggetti', () => {
  const elenco = [{ id: 'tp-anm-gtfs' }, { id: 'osm' }, { id: 'lc-da-michele-menu' }];
  const risultato = fontiDiNextstop(elenco);
  assert.deepEqual(risultato, elenco);
  assert.equal(risultato[0], elenco[0]);
  assert.equal(risultato[1], elenco[1]);
});

test('i conteggi pubblici non includono le schede sostenute solo dalle fonti delle regate', () => {
  const pubbliche = fatti.filter(f => f.fonti.some(fonteDiNextstop));
  assert.equal(pubbliche.length, 200);
  assert.deepEqual(pubbliche.filter(f => /^(cal-|vil-caracciolo$|trasporti-2027-atteso$)/.test(f.id)), []);
});
