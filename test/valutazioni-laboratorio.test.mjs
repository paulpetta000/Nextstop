import test from 'node:test';
import assert from 'node:assert/strict';
import { creaSessione, creaLimite, leggiDimostrazione, testoDimostrazione } from '../design/valutazioni/modello.mjs';

const scheda = { id:'inventato', profili:{ google:'verificato', tripadvisor:'verificato', thefork:'verificato' } };
const dato = { media:4.6, conteggio:1234 };
const pausa = ms => new Promise(resolve => setTimeout(resolve,ms));

test('media e conteggio sono entrambi necessari; zero è distinto da assente',() => {
  assert.deepEqual(leggiDimostrazione('google',dato),{stato:'disponibile',...dato});
  assert.deepEqual(leggiDimostrazione('google',{conteggio:0}),{stato:'nessuna_valutazione'});
  for (const errato of [null,{}, {media:4.6}, {conteggio:1}, {media:0,conteggio:5}, {media:6,conteggio:5}, {media:4.6,conteggio:-1}, {media:4.6,conteggio:1.2}, {media:4.6,conteggio:Number.MAX_SAFE_INTEGER+1}, {media:4.6,conteggio:0}, {media:'4.6',conteggio:5}, {media:NaN,conteggio:5}]) {
    assert.equal(leggiDimostrazione('google',errato).stato,'non_disponibile');
  }
  assert.equal(leggiDimostrazione('thefork',{media:9.1,conteggio:210}).stato,'disponibile');
  assert.equal(leggiDimostrazione('tripadvisor',{media:9.1,conteggio:210}).stato,'non_disponibile');
  assert.throws(() => leggiDimostrazione('sconosciuto',dato),RangeError);
});

test('scale separate e formattazione italiana, senza media unica',() => {
  assert.equal(testoDimostrazione('google',dato),'4,6 su 5 · 1.234 valutazioni');
  assert.equal(testoDimostrazione('thefork',{media:9.1,conteggio:210}),'9,1 su 10 · 210 recensioni');
});

test('nessuna chiamata aprendo la scheda o con identità incerta, offline o servizio disattivato',async () => {
  let chiamate = 0;
  const limite = creaLimite();
  const sessione = creaSessione({carica:() => { chiamate++; return dato; },aggiorna:() => {},limite});
  sessione.apri({profili:{google:'incerto'}});
  assert.equal(chiamate,0);
  assert.equal((await sessione.richiedi('google')).stato,'identita_incerta');
  for (const opzioni of [{online:() => false},{attivo:() => false}]) {
    const s = creaSessione({carica:() => { chiamate++; return dato; },aggiorna:() => {},limite,...opzioni});
    s.apri(scheda);await s.richiedi('google');s.chiudi();
  }
  assert.equal(chiamate,0);assert.equal(limite.usati,0);
  sessione.chiudi();
  assert.equal((await sessione.richiedi('google')).stato,'chiuso');
});

test('clic duplicati condividono la richiesta; riaprire non mantiene i numeri',async () => {
  let chiamate = 0;
  const sessione = creaSessione({carica:async () => { chiamate++; await pausa(10); return dato; },aggiorna:() => {}});
  sessione.apri(scheda);
  const uno = sessione.richiedi('google'); const due = sessione.richiedi('google');
  assert.equal(uno,due);await uno;
  await sessione.richiedi('google');assert.equal(chiamate,1);
  sessione.apri(scheda);await sessione.richiedi('google');assert.equal(chiamate,2);
  sessione.chiudi();
});

test('il limite è condiviso anche dopo chiusura o cambio scheda',async () => {
  let chiamate=0;const limite=creaLimite(1);
  const s=creaSessione({limite,carica:() => { chiamate++;return dato; },aggiorna:() => {}});
  s.apri(scheda);await s.richiedi('google');
  s.apri(scheda);assert.equal((await s.richiedi('tripadvisor')).stato,'limite');
  assert.equal(chiamate,1);assert.equal(limite.usati,1);s.chiudi();
  assert.throws(() => creaLimite(-1),RangeError);
});

test('un errore non blocca un’altra piattaforma, non ritenta e non elimina l’identità',async () => {
  let chiamate=0;const stati=[];
  const s=creaSessione({carica:piattaforma => { chiamate++;if(piattaforma==='tripadvisor')throw Object.assign(new Error('negato'),{status:404});return dato; },aggiorna:(p,v) => stati.push([p,v.stato])});
  s.apri(scheda);await Promise.all([s.richiedi('google'),s.richiedi('tripadvisor')]);
  assert.ok(stati.some(([p,v])=>p==='google'&&v==='disponibile'));
  assert.ok(stati.some(([p,v])=>p==='tripadvisor'&&v==='accesso_non_confermato'));
  assert.equal(scheda.profili.tripadvisor,'verificato');assert.equal(chiamate,2);s.chiudi();
});

test('risposta vecchia e richiesta ignorante l’annullamento non aggiornano un altro pannello',async () => {
  const stati=[];let termina;
  const s=creaSessione({carica:() => new Promise(resolve => {termina=resolve;}),aggiorna:(p,v)=>stati.push(v.stato)});
  s.apri(scheda);const richiesta=s.richiedi('google');await pausa(0);
  s.apri({...scheda,id:'altra'});termina(dato);
  assert.equal((await richiesta).stato,'annullato');
  assert.deepEqual(stati,['caricamento']);s.chiudi();
});

test('chiusura immediata prima della partenza non avvia il caricatore',async () => {
  let chiamate=0;
  const s=creaSessione({carica:() => {chiamate++;return dato;},aggiorna:() => {}});
  s.apri(scheda);const richiesta=s.richiedi('google');s.chiudi();await richiesta;
  assert.equal(chiamate,0);
});

test('scadenza controllata anche se il caricatore non gestisce abort',async () => {
  const stati=[];
  const s=creaSessione({attesaMs:20,carica:() => new Promise(() => {}),aggiorna:(p,v)=>stati.push(v.stato)});
  s.apri(scheda);assert.equal((await s.richiedi('google')).stato,'scaduto');
  assert.deepEqual(stati,['caricamento','scaduto']);s.chiudi();
});

test('quota e accessi negati sono stati distinti e nessun ritentativo è automatico',async () => {
  for (const [status,atteso] of [[401,'accesso_non_confermato'],[403,'accesso_non_confermato'],[404,'accesso_non_confermato'],[429,'quota'],[500,'errore']]) {
    let chiamate=0;
    const s=creaSessione({carica:() => {chiamate++;throw Object.assign(new Error('prova'),{status});},aggiorna:() => {}});
    s.apri(scheda);assert.equal((await s.richiedi('google')).stato,atteso);assert.equal(chiamate,1);s.chiudi();
  }
});
