import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giornoSicuro, allineaArchivio } from '../src/scripts/itinerari/memoria.ts';
const it = (id, n) => ({ id, nome: id, creato: 1, modificato: 1, giorni: Array.from({ length: n }, () => ({ tappe: [], inizio: 570, fine: 1140 })) });

test('giorno richiesto: un indice decimale o non numerico non accede a un giorno inesistente', () => {
  for (const valore of ['0.5', '1.5', 'abc', 'Infinity']) assert.equal(giornoSicuro(valore, 3), 0, valore);
});

test('giorno richiesto: gli indici interi validi e i limiti restano compatibili', () => {
  for (const [valore, atteso] of [[null, 0], ['2', 2], ['-1', 0], ['9', 2]]) assert.equal(giornoSicuro(valore, 3), atteso);
});

test('altra scheda: se i giorni diminuiscono quello mostrato rientra nei giorni rimasti', () => {
  const a = { attivo: 'viaggio0', elenco: [it('viaggio0', 7)] };
  const n = { attivo: 'altro000', elenco: [it('viaggio0', 2), it('altro000', 1)] };
  const prima = structuredClone([a, n]);
  const r = allineaArchivio(a, n, 6);
  assert.equal(r.archivio.attivo, 'viaggio0');
  assert.equal(r.giorno, 1);
  assert.deepEqual([a, n], prima);
});

test('altra scheda: se l’itinerario attivo è stato tolto si apre il primo senza indice fuori limite', () => {
  const a = { attivo: 'eliminato', elenco: [it('eliminato', 7)] };
  const n = { attivo: 'secondo0', elenco: [it('primo000', 1), it('secondo0', 4)] };
  const r = allineaArchivio(a, n, 5);
  assert.equal(r.archivio.attivo, 'primo000');
  assert.equal(r.giorno, 0);
});
