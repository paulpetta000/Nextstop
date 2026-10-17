import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../src/scripts/itinerari/memoria.ts';

const CHIAVE = 'itinerari-v1';
const C = { tappe: [{ id: 'duomo', tipo: 'citta' }] };
const archivio = () => ({ attivo: 'viaggio0', elenco: [{ id: 'viaggio0', nome: 'Originale', creato: 1, modificato: 1, giorni: [{ tappe: ['duomo'], inizio: 570, fine: 1140 }] }] });
function ambiente(t, request) {
  const dati = new Map([[CHIAVE, JSON.stringify({ v: 1, ...archivio() })]]);
  for (const [nome, value] of Object.entries({ localStorage: { getItem: k => dati.get(k) ?? null, setItem: (k, v) => dati.set(k, v) }, navigator: { locks: request ? { request } : undefined } })) {
    const prima = Object.getOwnPropertyDescriptor(globalThis, nome);
    Object.defineProperty(globalThis, nome, { configurable: true, value });
    t.after(() => prima ? Object.defineProperty(globalThis, nome, prima) : delete globalThis[nome]);
  }
  return dati;
}
function coda() {
  let coda = Promise.resolve(), richieste = 0;
  return {
    request(nome, opzioni, fn) {
      assert.equal(nome, CHIAVE); assert.equal(opzioni.mode, 'exclusive'); richieste++;
      const p = coda.then(() => fn({ name: nome, mode: 'exclusive' }));
      coda = p.catch(() => {}); return p;
    }, richieste: () => richieste
  };
}

test('lettura: archivio e riferimento provengono dallo stesso getItem', t => {
  const dati = ambiente(t), prima = dati.get(CHIAVE); let letture = 0;
  t.mock.method(localStorage, 'getItem', k => { letture++; const raw = dati.get(k); dati.set(k, JSON.stringify({ v: 1, ...archivio(), attivo: 'cambiato' })); return raw; });
  const l = m.leggiConRiferimento(C);
  assert.equal(letture, 1); assert.equal(l.riferimento, prima); assert.equal(l.archivio.attivo, 'viaggio0');
});

test('lettura: una modifica fra lettura e creazione del salvatore non diventa il riferimento nuovo', async t => {
  const lock = coda(), dati = ambiente(t, lock.request);
  const l = m.leggiConRiferimento(C), esterno = archivio(); esterno.elenco[0].nome = 'Esterno';
  dati.set(CHIAVE, JSON.stringify({ v: 1, ...esterno }));
  const salva = m.creaSalvataggio(l); l.archivio.elenco[0].nome = 'Locale';
  assert.equal(await salva(l.archivio), false); assert.equal(salva.stato(), 'conflitto');
  assert.equal(JSON.parse(dati.get(CHIAVE)).elenco[0].nome, 'Esterno');
});

test('scrittura: attende il turno senza dichiarare salvato e senza perdere visite o timbri locali', async t => {
  let libera, richiesta;
  const dati = ambiente(t, (nome, opzioni, fn) => new Promise(resolve => { richiesta = nome; libera = () => resolve(fn({ name: nome })); }));
  const prima = dati.get(CHIAVE), a = archivio(); a.elenco[0].fatte = undefined;
  a.elenco[0].giorni[0].fatte = ['duomo']; a.elenco[0].timbri = { duomo: 1234 };
  const salva = m.creaSalvataggio(), p = salva(a);
  assert.equal(dati.get(CHIAVE), prima); assert.equal(salva.stato(), 'in-corso');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(richiesta, CHIAVE); libera(); assert.equal(await p, true);
  const x = JSON.parse(dati.get(CHIAVE)).elenco[0];
  assert.deepEqual(x.giorni[0].fatte, ['duomo']); assert.deepEqual(x.timbri, { duomo: 1234 });
  assert.equal(salva.stato(), 'salvato');
});

test('scrittura: senza coordinamento disponibile non sovrascrive la memoria', async t => {
  const dati = ambiente(t), prima = dati.get(CHIAVE), salva = m.creaSalvataggio();
  const a = archivio(); a.elenco[0].nome = 'Locale';
  assert.equal(await salva(a), false); assert.equal(dati.get(CHIAVE), prima); assert.equal(salva.stato(), 'errore');
});

test('scrittura: un rifiuto del lock si risolve come errore senza rigetti non gestiti', async t => {
  const dati = ambiente(t, () => Promise.reject(new Error('Accesso negato'))), prima = dati.get(CHIAVE), salva = m.creaSalvataggio();
  assert.equal(await salva(archivio()), false); assert.equal(dati.get(CHIAVE), prima); assert.equal(salva.stato(), 'errore');
});

test('scrittura: due sessioni contemporanee usano lo stesso turno, una salva e l’altra conserva il lavoro locale', async t => {
  const lock = coda(), dati = ambiente(t, lock.request), a = archivio(), b = archivio();
  const salvaA = m.creaSalvataggio(), salvaB = m.creaSalvataggio();
  a.elenco[0].nome = 'Locale A'; b.elenco[0].nome = 'Locale B';
  assert.deepEqual(await Promise.all([salvaA(a), salvaB(b)]), [true, false]);
  assert.equal(lock.richieste(), 2); assert.equal(JSON.parse(dati.get(CHIAVE)).elenco[0].nome, 'Locale A');
  assert.equal(b.elenco[0].nome, 'Locale B'); assert.equal(salvaB.stato(), 'conflitto');
});

test('scrittura: una sequenza rapida mantiene ordine e fotografie dei dati al momento della richiesta', async t => {
  const lock = coda(), dati = ambiente(t, lock.request), a = archivio(), salva = m.creaSalvataggio();
  a.elenco[0].nome = 'Prima'; const p1 = salva(a);
  a.elenco[0].nome = 'Seconda'; const p2 = salva(a);
  a.elenco[0].nome = 'Non richiesta';
  assert.deepEqual(await Promise.all([p1, p2]), [true, true]);
  assert.equal(lock.richieste(), 2); assert.equal(JSON.parse(dati.get(CHIAVE)).elenco[0].nome, 'Seconda');
});

test('stato: in attesa non mostra una spunta salvata o un falso errore', () => {
  assert.deepEqual(m.presentaSalvataggio(true, 'in-corso'), { fatto: false, tipo: 'bozza', testo: 'Salvataggio in corso' });
  assert.equal(m.testoErroreSalvataggio('in-corso'), '');
});

test('interleaving: la seconda sessione avviata tra confronto e scrittura non dichiara un successo perso', async t => {
  const lock = coda(), dati = ambiente(t, lock.request), a = archivio(), b = archivio();
  a.elenco[0].nome = 'Locale A'; b.elenco[0].nome = 'Locale B';
  const salvaA = m.creaSalvataggio(), salvaB = m.creaSalvataggio(); let inserita = false, pB;
  t.mock.method(localStorage, 'getItem', k => {
    const raw = dati.get(k) ?? null;
    if (k === CHIAVE && !inserita) { inserita = true; pB = salvaB(b); }
    return raw;
  });
  assert.equal(await salvaA(a), true);
  assert.equal(await pB, false);
  assert.equal(JSON.parse(dati.get(CHIAVE)).elenco[0].nome, 'Locale A');
  assert.equal(b.elenco[0].nome, 'Locale B');
});

test('evento storage: considera clear e ignora sessionStorage e chiavi estranee', t => {
  ambiente(t); let callback, ricevuti=0;
  const prima=Object.getOwnPropertyDescriptor(globalThis,'addEventListener');
  Object.defineProperty(globalThis,'addEventListener',{configurable:true,value:(nome,fn)=>{assert.equal(nome,'storage');callback=fn;}});
  t.after(()=>prima?Object.defineProperty(globalThis,'addEventListener',prima):delete globalThis.addEventListener);
  m.quandoCambia(()=>ricevuti++);
  callback({key:CHIAVE,storageArea:{}}); callback({key:'altra',storageArea:localStorage});
  assert.equal(ricevuti,0);
  callback({key:CHIAVE,storageArea:localStorage}); callback({key:null,storageArea:localStorage});
  assert.equal(ricevuti,2);
});

test('lock: l’attesa scade senza scrivere, poi lo stesso salvatore può riprovare', async t => {
  const dati=ambiente(t, (_nome, {signal}) => new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('Timeout')),{once:true})));
  t.mock.timers.enable({apis:['setTimeout']});
  const prima=dati.get(CHIAVE), salva=m.creaSalvataggio(), p=salva(archivio());
  await new Promise(resolve=>setImmediate(resolve)); t.mock.timers.tick(3000);
  assert.equal(await p,false); assert.equal(salva.stato(),'errore'); assert.equal(dati.get(CHIAVE),prima);
  t.mock.method(navigator.locks,'request',async (_nome,_options,fn)=>fn());
  assert.equal(await salva(archivio()),true); assert.equal(salva.stato(),'salvato');
});

test('coda: dati non serializzabili non rompono il tentativo successivo', async t => {
  const lock=coda(), dati=ambiente(t,lock.request), prima=dati.get(CHIAVE), salva=m.creaSalvataggio(), a=archivio();
  a.ciclo=a;
  assert.equal(await salva(a),false); assert.equal(dati.get(CHIAVE),prima);
  assert.equal(await salva(archivio()),true);
});

test('coda: conserva originale corrotto e rifiuta versioni ignote anche col lock', async t => {
  const lock=coda(), dati=ambiente(t,lock.request);
  dati.set(CHIAVE,'{'); let salva=m.creaSalvataggio();
  assert.equal(await salva(archivio()),true); assert.equal(dati.get('itinerari-v1-recupero'),'{');
  const futuro=JSON.stringify({v:99,...archivio()}); dati.set(CHIAVE,futuro); salva=m.creaSalvataggio();
  assert.equal(await salva(archivio()),false); assert.equal(dati.get(CHIAVE),futuro);
});

test('uscita: protegge solo durante attesa o errore e rimuove il listener dopo il recupero', async t => {
  let libera;
  const dati = ambiente(t, (_nome, _options, fn) => new Promise(resolve => { libera = () => resolve(fn()); }));
  const eventi = new Map();
  for (const [nome, value] of Object.entries({ addEventListener: (tipo, fn) => eventi.set(tipo, fn), removeEventListener: (tipo, fn) => { if (eventi.get(tipo) === fn) eventi.delete(tipo); } })) {
    const prima = Object.getOwnPropertyDescriptor(globalThis, nome);
    Object.defineProperty(globalThis, nome, { configurable: true, value });
    t.after(() => prima ? Object.defineProperty(globalThis, nome, prima) : delete globalThis[nome]);
  }
  const salva = m.creaSalvataggio(), aggiorna = m.proteggiUscita(() => salva.stato() !== 'salvato');
  aggiorna(); assert.equal(eventi.size, 0);
  const p = salva(archivio()); aggiorna();
  const callback = eventi.get('beforeunload'); let impedita = false;
  const e = { preventDefault() { impedita = true; }, returnValue: undefined };
  callback(e); assert.equal(impedita, true); assert.equal(e.returnValue, '');
  await new Promise(resolve => setImmediate(resolve)); libera(); await p; aggiorna();
  assert.equal(eventi.size, 0);
  impedita = false; callback(e); assert.equal(impedita, false);
  dati.set(CHIAVE, 'modifica esterna');
  const conflitto = salva(archivio()); aggiorna();
  await new Promise(resolve => setImmediate(resolve)); libera(); await conflitto; aggiorna();
  assert.equal(salva.stato(), 'conflitto'); assert.equal(eventi.has('beforeunload'), true);
});
