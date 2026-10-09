import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leggi, scrivi } from '../src/scripts/itinerari/memoria.ts';
import { giornoVuoto } from '../src/lib/itinerari/link.ts';

// Memoria finta e isolata: nessun dato del browser dell'utente viene letto o scritto.
function archivioFinto(t) {
  const precedente = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const dati = new Map();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: chiave => dati.get(chiave) ?? null,
    setItem: (chiave, valore) => dati.set(chiave, valore)
  } });
  t.after(() => {
    if (precedente) Object.defineProperty(globalThis, 'localStorage', precedente);
    else delete globalThis.localStorage;
  });
  return dati;
}

const C = { tappe: [] };
const itinerario = n => ({ id: `viaggio${n}`, nome: `Viaggio ${n}`, giorni: [giornoVuoto()], creato: 1, modificato: 1 });

test('memoria: riaprire e salvare conserva più di 50 itinerari e quello attivo', t => {
  const dati = archivioFinto(t);
  const elenco = Array.from({ length: 51 }, (_, n) => itinerario(n));
  const originale = { attivo: elenco[50].id, elenco };
  assert.equal(scrivi(originale), true);
  const riletto = leggi(C);
  assert.deepEqual(riletto, originale);
  assert.equal(scrivi(riletto), true);
  assert.equal(JSON.parse(dati.get('itinerari-v1')).elenco.length, 51);
});

test('memoria: gli archivi piccoli e il ripiego su un id attivo inesistente restano compatibili', t => {
  archivioFinto(t);
  const elenco = [itinerario(0), itinerario(1)];
  assert.equal(scrivi({ attivo: elenco[1].id, elenco }), true);
  assert.deepEqual(leggi(C), { attivo: elenco[1].id, elenco });
  scrivi({ attivo: 'assente', elenco });
  assert.deepEqual(leggi(C), { attivo: elenco[0].id, elenco });
});
