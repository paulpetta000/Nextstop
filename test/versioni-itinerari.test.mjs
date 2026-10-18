import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spacchetta, impacchetta, aggiungiScenari, spacchettaVivo } from '../src/lib/itinerari/pacco.ts';
import { creaCaricaJson } from '../src/scripts/itinerari/caricamento.mjs';
const pacco = () => ({ riferimento: 'base-a', n: 2, tappe: [], linee: {}, zone: {}, dizionario: [''], feriale: { min: [0,15,15,0], metri: [0,10,10,0], mezzi: [0,0,0,0] }, piedi: [] });
const vivo = () => ({ riferimento: 'base-a', preferenza: 5, dal: '20261018', al: '20261018', giorni: {'20261018':0}, tipi:[{salite:{},viaggi:{}}], fermate:{}, dizionario:[''], candidati:[], senza:{},bus:{} });
test('versioni: il riferimento della città passa nel pacco e torna senza cambiare gli itinerari', () => {
  const C = spacchetta(pacco());
  assert.equal(C.riferimento, 'base-a');
  assert.equal(impacchetta(C).riferimento, 'base-a');
});
test('versioni: differenze di un’altra base non creano una matrice ibrida', () => {
  for (const riferimento of ['base-b', undefined]) {
    const C = spacchetta(pacco()); C.riferimento = 'base-a';
    const prima = structuredClone(C);
    assert.throws(() => aggiungiScenari(C, { riferimento, dizionario:[''],diff:{sabato:[1,20,30,0]} }), /versione|riferimento/i);
    assert.deepEqual(C, prima);
  }
});
test('versioni: partenze di un’altra base o prive di riferimento vengono rifiutate', () => {
  for (const riferimento of ['base-b', undefined]) assert.throws(() => spacchettaVivo({...vivo(),riferimento}, 'base-a'), /versione|riferimento/i);
  assert.equal(spacchettaVivo(vivo(), 'base-a').giorni['20261018'], 0);
});
test('versioni: la validazione dei dati differiti avviene prima di memorizzare un successo', async () => {
  let richieste = 0;
  const carica = creaCaricaJson('/fittizio.json', async () => Response.json({riferimento: ++richieste === 1 ? 'base-b' : 'base-a'}), p => { if (p.riferimento !== 'base-a') throw Error('Altra versione'); });
  assert.equal(await carica(), null);
  assert.deepEqual(await carica(), {riferimento:'base-a'});
  assert.equal(richieste, 2);
});
test('versioni: le città senza riferimento mantengono compatibilità coi pacchi precedenti', () => {
  const p = pacco(); delete p.riferimento; const C = spacchetta(p);
  aggiungiScenari(C,{dizionario:[''],diff:{sabato:[1,20,30,0]}});
  assert.equal(C.tempi.min.sabato[1],20);
  assert.equal(spacchettaVivo(vivo()).giorni['20261018'],0);
});
// Hash solo durante la build: numeri, ordine dei punti e proiezione fanno parte della base.
import fs from 'node:fs';
import { riferimentoDati } from '../src/lib/itinerari/riferimento-dati.mjs';
import { verificaRiferimento } from '../src/lib/itinerari/pacco.ts';
test('versioni: l’identità cambia con tempi, ordine dei punti e proiezione, senza mutare i dati', () => {
  const t = { punti:['a','b'], min:[0,15,15,0] }, m = {w:100,h:100,box:{e:2,w:1,n:2,s:1}}, copia = structuredClone([t,m]);
  const r = riferimentoDati(t,m); assert.match(r,/^[a-f0-9]{20}$/);
  assert.equal(r,riferimentoDati(structuredClone(t),structuredClone(m)));
  for(const [x,y] of [[{...t,min:[0,20,15,0]},m],[{...t,punti:['b','a']},m],[t,{...m,w:200}]])assert.notEqual(riferimentoDati(x,y),r);
  assert.deepEqual([t,m],copia);
});
const stato = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/stato.js',import.meta.url),'utf8');
const daM = stato.indexOf('let mappaDati = null'), aM = stato.indexOf('export const caricaAlternativi',daM);
assert.ok(daM>=0&&aM>daM);
const preparaMappa = new Function('d','const {C,fetch,quandoLibero,verificaRiferimento}=d;'+stato.slice(daM,aM).replace('export ','')+';return caricaMappa;');
test('versioni: la mappa rifiuta copie miste e può caricare il pacco coerente al tentativo dopo', async () => {
  let nuovo = false, richieste = 0;
  const carica = preparaMappa({C:{riferimento:'base-a'},quandoLibero:async()=>{},verificaRiferimento,fetch:async url=>{
    richieste++;return Response.json({riferimento: !nuovo && url.endsWith('percorsi.json')?'base-b':'base-a'});
  }});
  await assert.rejects(carica(),/versione/i);
  nuovo=true;const v=await carica();assert.equal(v[0].riferimento,'base-a');assert.equal(v[1].riferimento,'base-a');
  assert.equal(await carica(),v);assert.equal(richieste,6);
});
test('versioni: un indice opzionale vecchio non impedisce la mappa di base coerente', async()=>{
  const carica=preparaMappa({C:{riferimento:'base-a'},quandoLibero:async()=>{},verificaRiferimento,fetch:async url=>Response.json({riferimento:url.endsWith('indice.json')?'base-b':'base-a'})});
  const [m,p,i]=await carica();assert.equal(m.riferimento,'base-a');assert.equal(p.riferimento,'base-a');assert.equal(i,null);
});
const mappa=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/mappa.js',import.meta.url),'utf8');
const daP=mappa.indexOf('const CARICATI ='), aP=mappa.indexOf('// senza rete',daP);
assert.ok(daP>=0&&aP>daP);
const preparaPezzo=new Function('d','const {C,fetch,verificaRiferimento}=d;'+mappa.slice(daP,aP).replace('export ','')+';return prendiPezzo;');
test('versioni: un pezzo vecchio non rimane memorizzato come successo',async()=>{
  let n=0;const carica=preparaPezzo({C:{riferimento:'base-a'},verificaRiferimento,fetch:async()=>Response.json({riferimento:++n===1?'base-b':'base-a',n:[]})});
  assert.equal(await carica('0_0'),null);const p=await carica('0_0');assert.equal(p.riferimento,'base-a');assert.equal(await carica('0_0'),p);assert.equal(n,2);
});