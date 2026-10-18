import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/mappa.js', import.meta.url), 'utf8');
const da = source.indexOf('const ALFA = '), a = source.indexOf('const traccia = ', da);
assert.ok(da >= 0 && a > da);
const decodifica = new Function(source.slice(da, a) + ';return decodifica;')();

test('percorsi mappa: non disegna una parte di un percorso con numeri o separatori incompleti', () => {
  for (const s of ['p.AA~B1.A', 'p.A!', 'p.Ag', 'pAA', 'p.' + '_'.repeat(100) + 'A', '.AA']) {
    assert.deepEqual(decodifica(s), [], s);
  }
});
test('percorsi mappa: conserva modi, coordinate e differenze con segno', () => {
  // AA = origine (0,0), UE = (+10,+2), DB = (-2,-1).
  assert.deepEqual(decodifica('p.AAUEDB~B1.CC'), [
    { modo: 'p', punti: [[0,0],[10,2],[8,1]] }, { modo: 'B1', punti: [[1,1]] }
  ]);
  assert.deepEqual(decodifica(''), []);
});