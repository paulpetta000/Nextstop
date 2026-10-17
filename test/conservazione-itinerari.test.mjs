import { test } from 'node:test';
import assert from 'node:assert/strict';
import { preparaSpostamento } from '../src/lib/itinerari/spostamenti.ts';
import { prontoNelGiorno } from '../src/lib/itinerari/pronti.ts';
import { codifica, decodifica } from '../src/lib/itinerari/link.ts';
import { creaSalvataggio, leggi, leggiRiepilogo, scrivi } from '../src/scripts/itinerari/memoria.ts';

const CHIAVE = 'itinerari-v1', COPIA = 'itinerari-v1-recupero';
const C = { tappe: [{ id: 'duomo', tipo: 'citta' }] };
const valido = (id = 'viaggio0') => ({ id, nome: 'Viaggio da conservare', data: '2026-10-17', giorni: [{ tappe: ['duomo'], inizio: 570, fine: 1140 }], creato: 1, modificato: 1 });
const archivio = () => ({ attivo: 'viaggio0', elenco: [valido()] });
function memoria(t, raw) {
  const precedente = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const dati = new Map(raw == null ? [] : [[CHIAVE, raw]]);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: k => dati.get(k) ?? null,
    setItem: (k, v) => dati.set(k, v)
  } });
  t.after(() => { if (precedente) Object.defineProperty(globalThis, 'localStorage', precedente); else delete globalThis.localStorage; });
  return dati;
}

test('conservazione: ogni scrittura fallita resta fallita anche dopo l’avviso', t => {
  memoria(t);
  t.mock.method(localStorage, 'setItem', () => { throw Error('Quota esaurita'); });
  const salva = creaSalvataggio(), avvisi = [];
  assert.equal(salva(archivio(), x => avvisi.push(x)), false);
  assert.equal(salva(archivio(), x => avvisi.push(x)), false);
  assert.equal(salva(archivio()), false);
  assert.equal(avvisi.length, 1);
});

test('conservazione: un fallimento senza callback non consuma l’avviso', t => {
  memoria(t);
  t.mock.method(localStorage, 'setItem', () => { throw Error('Quota esaurita'); });
  const salva = creaSalvataggio(), avvisi = [];
  assert.equal(salva(archivio()), false);
  assert.equal(salva(archivio(), x => avvisi.push(x)), false);
  assert.equal(avvisi.length, 1);
});

test('conservazione: dopo il recupero della memoria un nuovo errore viene segnalato', t => {
  const dati = memoria(t);
  let bloccato = true;
  t.mock.method(localStorage, 'setItem', (k, v) => { if (bloccato) throw Error('Quota'); dati.set(k, v); });
  const salva = creaSalvataggio(), avvisi = [], avvisa = x => avvisi.push(x);
  assert.equal(salva(archivio(), avvisa), false);
  bloccato = false;
  assert.equal(salva(archivio(), avvisa), true);
  bloccato = true;
  assert.equal(salva(archivio(), avvisa), false);
  assert.equal(avvisi.length, 2);
});

test('conservazione: recupera i record validi ai due lati di un elemento danneggiato', t => {
  const raw = JSON.stringify({ v: 1, attivo: 'viaggio1', elenco: [valido(), null, 7, [], valido('viaggio1')] });
  const dati = memoria(t, raw);
  const letto = leggi(C);
  assert.deepEqual(letto, { attivo: 'viaggio1', elenco: [valido(), valido('viaggio1')] });
  assert.equal(dati.get(CHIAVE), raw, 'La lettura non cambia il contenuto originale');
  assert.equal(scrivi(letto), true);
  assert.equal(dati.get(COPIA), raw, 'Copia integrale prima della riscrittura');
  assert.equal(JSON.parse(dati.get(CHIAVE)).elenco.length, 2);
});

test('conservazione: originale illeggibile o giorno malformato conservato prima di scrivere', t => {
  const dati = memoria(t);
  for (const raw of ['{', '{"elenco":{}}', JSON.stringify({ elenco: [valido(), { id: 'rotto00', giorni: null }] }), JSON.stringify({ elenco: [{ ...valido(), giorni: [null, { tappe: 'duomo' }] }] })]) {
    dati.clear(); dati.set(CHIAVE, raw);
    assert.equal(scrivi(archivio()), true);
    assert.equal(dati.get(COPIA), raw);
  }
});

test('conservazione: se manca spazio per la copia non sovrascrive l’originale', t => {
  const raw = JSON.stringify({ elenco: [valido(), null] });
  const dati = memoria(t, raw);
  t.mock.method(localStorage, 'setItem', (k, v) => { if (k === COPIA) throw Error('Quota'); dati.set(k, v); });
  assert.equal(scrivi(archivio()), false);
  assert.equal(dati.get(CHIAVE), raw);
});

test('conservazione: non sostituisce una copia di recupero diversa già presente', t => {
  const raw = '{'; const dati = memoria(t, raw); dati.set(COPIA, 'originale precedente');
  assert.equal(scrivi(archivio()), false);
  assert.equal(dati.get(CHIAVE), raw);
  assert.equal(dati.get(COPIA), 'originale precedente');
});

test('conservazione: riconosce la copia identica e non la riscrive', t => {
  const raw = '{'; const dati = memoria(t, raw); dati.set(COPIA, raw);
  t.mock.method(localStorage, 'setItem', (k, v) => { assert.notEqual(k, COPIA); dati.set(k, v); });
  assert.equal(scrivi(archivio()), true);
});

test('conservazione: archivi senza versione e v1 compatibili, versioni ignote mai riscritte', t => {
  const dati = memoria(t);
  for (const v of [undefined, 1]) {
    dati.set(CHIAVE, JSON.stringify({ ...archivio(), ...(v ? { v } : {}) }));
    assert.deepEqual(leggi(C), archivio());
    assert.equal(scrivi(archivio()), true);
    assert.equal(dati.has(COPIA), false);
  }
  for (const v of [2, '1', null]) {
    const raw = JSON.stringify({ v, ...archivio() }); dati.set(CHIAVE, raw);
    assert.equal(leggi(C), null);
    assert.equal(leggiRiepilogo(), null);
    assert.equal(scrivi(archivio()), false);
    assert.equal(dati.get(CHIAVE), raw);
  }
});

test('locali: l’archivio malformato non interrompe la lettura dei giorni', t => {
  const dati = memoria(t);
  for (const giorni of [null, {}, 'giorni']) {
    dati.set(CHIAVE, JSON.stringify({ attivo: 'viaggio0', elenco: [{ ...valido(), giorni }] }));
    assert.equal(leggiRiepilogo(), null);
  }
  dati.set(CHIAVE, JSON.stringify({ attivo: 'viaggio0', elenco: [{ ...valido(), data: 'data errata', giorni: [null, { tappe: 'duomo' }, { tappe: ['duomo', 7, null] }] }] }));
  const r = leggiRiepilogo();
  assert.equal(r.data, undefined);
  assert.deepEqual(r.giorni.map(g => g.tappe), [[], [], ['duomo']]);
});

test('locali: trova il record valido anche se quello attivo è danneggiato, senza scrivere', t => {
  const raw = JSON.stringify({ attivo: 'rotto00', elenco: [null, { id: 'rotto00', giorni: null }, valido()] });
  const dati = memoria(t, raw);
  assert.deepEqual(leggiRiepilogo(), { id: 'viaggio0', nome: valido().nome, data: valido().data, giorni: [{ tappe: ['duomo'] }] });
  assert.equal(dati.get(CHIAVE), raw);
  assert.equal(dati.has(COPIA), false);
});

test('conservazione: spostamento e pronto attraversano salvataggio e rilettura senza perdere preferenze e visite', t => {
  const dati = memoria(t);
  const giorno = tappe => ({ inizio: 600, fine: 1080, tappe });
  const Citta = { tappe: ['duomo', 'museo', 'palazzo', 'castello', 'parco', 'piazza'].map(id => ({ id, tipo: 'citta' })) };
  const x = {
    ...valido(), posizione: 'no', margine: 10, salvato: true,
    timbri: { museo: 1760000000000, duomo: 1760000001000 },
    giorni: [
      { ...giorno(['duomo', 'museo', 'palazzo']), fatte: ['museo', 'duomo'], noPasti: ['pranzo'], pause: [{ quale: 'pranzo', min: 45, dopo: 'duomo' }] },
      { ...giorno(['castello']), pause: [{ quale: 'riposo', min: 30, dopo: 'castello' }] },
      giorno([])
    ]
  };
  const originale = structuredClone(x), altro = valido('altro000');
  const spostato = preparaSpostamento(x, 0, 1, ['duomo', 'museo']);
  const pronto = prontoNelGiorno({ ...x, giorni: spostato.giorni }, 2, [giorno(['parco']), giorno(['piazza'])]);
  const aggiornato = { ...x, giorni: pronto.giorni };
  assert.equal(scrivi({ attivo: x.id, elenco: [aggiornato, altro] }), true);
  const letto = leggi(Citta);
  assert.equal(letto.attivo, x.id);
  const r = letto.elenco[0];
  assert.equal(r.id, x.id); assert.equal(r.nome, x.nome); assert.equal(r.data, x.data);
  assert.equal(r.posizione, 'no'); assert.equal(r.margine, 10); assert.equal(r.salvato, true);
  assert.deepEqual(r.timbri, x.timbri);
  assert.deepEqual(r.giorni.map(g => g.tappe), [['palazzo'], ['castello', 'duomo', 'museo'], ['parco'], ['piazza']]);
  assert.deepEqual(r.giorni.map(g => [g.inizio, g.fine]), Array(4).fill([600, 1080]));
  assert.deepEqual(r.giorni[0].pause, [{ quale: 'pranzo', min: 45 }]);
  assert.deepEqual(r.giorni[0].noPasti, ['pranzo']);
  assert.deepEqual(r.giorni[1].pause, [{ quale: 'riposo', min: 30, dopo: 'castello' }]);
  assert.deepEqual(r.giorni[1].fatte, ['museo', 'duomo']);
  assert.deepEqual(letto.elenco[1], altro);
  const condiviso = decodifica(Citta, '#' + codifica(r)).it;
  assert.deepEqual(condiviso.giorni.map(g => g.tappe), r.giorni.map(g => g.tappe));
  assert.deepEqual(condiviso.giorni.map(g => g.pause), r.giorni.map(g => g.pause));
  assert.equal(condiviso.timbri, undefined); assert.equal(condiviso.posizione, undefined);
  assert.ok(condiviso.giorni.every(g => !g.fatte && !g.noPasti));
  assert.deepEqual(x, originale);
  assert.equal(dati.has(COPIA), false);
});
