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

test('memoria: storage disabilitato viene segnalato senza propagare l’errore', t => {
  archivioFinto(t);
  t.mock.method(localStorage, 'getItem', () => { throw new Error('Storage disabilitato'); });
  t.mock.method(localStorage, 'setItem', () => { throw new Error('Quota esaurita'); });
  assert.equal(leggi(C), null);
  assert.equal(scrivi({ attivo: 'viaggio0', elenco: [itinerario(0)] }), false);
});

test('memoria: una scrittura rifiutata non sostituisce l’archivio salvato', t => {
  const dati = archivioFinto(t);
  const originale = { attivo: 'viaggio0', elenco: [itinerario(0)] };
  assert.equal(scrivi(originale), true);
  const salvato = dati.get('itinerari-v1');
  t.mock.method(localStorage, 'setItem', () => { throw new Error('Quota esaurita'); });
  assert.equal(scrivi({ attivo: 'viaggio1', elenco: [itinerario(1)] }), false);
  assert.equal(dati.get('itinerari-v1'), salvato);
  assert.deepEqual(leggi(C), originale);
});

test('memoria: archivio vuoto o JSON corrotto restituisce null', t => {
  const dati = archivioFinto(t);
  assert.equal(leggi(C), null);
  for (const json of ['{', '{"elenco":{}}', '{"elenco":[]}']) {
    dati.set('itinerari-v1', json);
    assert.equal(leggi(C), null);
  }
});
