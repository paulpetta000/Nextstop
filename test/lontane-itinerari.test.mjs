import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lontane } from '../src/lib/itinerari/calcolo.ts';
import { giornoVuoto } from '../src/lib/itinerari/link.ts';
import { SCENARI } from '../src/lib/itinerari/tipi.ts';

function caso(scenarioDestinazione, costo) {
  const tappe = ['a', 'lontana', 'b', 'altra'].map((id, p) => ({ id, p, tipo: 'citta', chiuso: [], durata: 30 }));
  const min = Object.fromEntries(SCENARI.map(s => [s, Array.from({ length: 16 }, (_, i) => Math.floor(i / 4) === i % 4 ? 0 : 40)]));
  for (const s of SCENARI) { min[s][2] = min[s][8] = 1; min[s][7] = min[s][13] = 1; }
  min[scenarioDestinazione][7] = min[scenarioDestinazione][13] = costo;
  const C = { tappe, tempi: { n: 4, min }, linee: {}, zone: {} };
  const giorno = tappe => ({ ...giornoVuoto(), tappe });
  const x = { id: 'viaggio0', nome: 'Prova', data: '2026-10-09', giorni: [giorno(['a', 'lontana', 'b']), { ...giorno([]), gita: 'gita' }, giorno(['altra'])] };
  return { C, x };
}

test('tappe lontane: il giorno suggerito usa i mezzi della propria data', () => {
  const { C, x } = caso('domenica', 50), prima = structuredClone(x);
  const r = lontane(C, x, 0).find(a => a.id === 'lontana');
  assert.equal(r.giorno, 3, 'la domenica costa più del giorno di partenza: propone un giorno nuovo');
  assert.deepEqual(x, prima);
});

test('tappe lontane: considera anche l’ora iniziale del giorno di destinazione', () => {
  const { C, x } = caso('sabato-pomeriggio', 50);
  x.giorni.splice(1, 1);
  x.giorni[1].inizio = 900; // sabato dopo il cambio di servizio
  assert.equal(lontane(C, x, 0).find(a => a.id === 'lontana').giorno, 2);
});

test('tappe lontane: il giorno davvero più vicino resta suggerito, senza mezzi se si cammina', () => {
  const { C, x } = caso('domenica', 50);
  x.piedi = true;
  assert.equal(lontane(C, x, 0).find(a => a.id === 'lontana').giorno, 2);
  x.piedi = false; C.tempi.min.domenica[7] = C.tempi.min.domenica[13] = 1;
  assert.equal(lontane(C, x, 0).find(a => a.id === 'lontana').giorno, 2);
});
