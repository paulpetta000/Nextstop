import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { fontiPerPagina } from '../src/lib/fonti-nextstop.mjs';
const leggi = nome => yaml.load(readFileSync(new URL(`../src/data/${nome}.yaml`, import.meta.url), 'utf8'));
const fonti = new Map(leggi('fonti').map(f => [f.id, { id: f.id, data: f }]));
const tappe = leggi('tappe').map(t => ({ id: t.id, data: { ...t, durataFonte: t.durataFonte ? { id: t.durataFonte } : undefined } }));
const fatti = leggi('fatti').map(f => ({ id: f.id, fontiRisolte: f.fonti.map(id => fonti.get(id)) }));
test('Catacombe: il documento della durata è incluso anche se non citato dalle schede', () => {
  const tappa = tappe.find(t => t.data.durataFonte?.id === 'tp-catacombe-sangennaro');
  assert.ok(tappa, 'Caso reale presente nei dati');
  const schede = fatti.filter(f => [tappa.data.orari, tappa.data.prezzi].includes(f.id));
  assert.ok(!schede.flatMap(f => f.fontiRisolte).some(f => f.id === 'tp-catacombe-sangennaro'));
  const selezione = fontiPerPagina(schede, [], [tappa], fonti);
  assert.ok(selezione.some(f => f.id === 'tp-catacombe-sangennaro'));
});
