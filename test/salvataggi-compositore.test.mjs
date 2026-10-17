import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { creaSalvataggio, presentaSalvataggio, testoErroreSalvataggio } from '../src/scripts/itinerari/memoria.ts';

const leggi = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const stato = leggi('../src/scripts/itinerari/compositore/stato.js');
const da = stato.indexOf('let salvaArchivio ='), a = stato.indexOf('// una modifica', da);
assert.ok(da >= 0 && a > da);
const gestione = new Function('d', 'const { creaSalvataggio, presentaSalvataggio, testoErroreSalvataggio } = d; const iniziale = d.fonte, A = d.archivio, X = () => A.elenco.find(i => i.id === A.attivo), salvato = (x = X()) => x.salvato; ' + stato.slice(da,a).replaceAll('export ','') + ';return { scriviArchivio, attendiSalvataggi, quandoSalva, salvataggioInCorso, erroreSalvataggio, statoSalvataggio };');
const comuni = leggi('../src/scripts/itinerari/compositore/comuni.js');
const daC = comuni.indexOf('export function rinfrescaSalvataggio('), aC = comuni.indexOf('export function avvisa(', daC);
assert.ok(daC >= 0 && aC > daC);
const controlli = new Function('$$', 'statoSalvataggio', 'salvataggioInCorso', comuni.slice(daC,aC).replace('export ','') + ';return rinfrescaSalvataggio;');
const fogli = leggi('../src/scripts/itinerari/compositore/fogli.js');
const daF = fogli.indexOf('export async function salva('), aF = fogli.indexOf('// ---------- pause e margini', daF);
assert.ok(daF >= 0 && aF > daF);
const comando = new Function('d', 'const { X, salvato, erroreSalvataggio, apriMiei, A, nomeLibero, nomeProposto, dopoModifica, scriviArchivio, avvisa, apriCondividi, mettiNome, $$, setTimeout, aggiorna, piano, salvataggioInCorso, attendiSalvataggi } = d; const MAX_SALVATI = 50, GENERICI = /^(Il mio itinerario)$/; ' + fogli.slice(daF,aF).replace('export ','') + ';return salva;');
const tick = () => new Promise(r => setImmediate(r));
function ambiente(t) {
  const x = { id: 'viaggio0', nome: 'Napoli', salvato: false, creato: 1, modificato: 1, giorni: [{ tappe: ['duomo'], inizio: 570, fine: 1140 }] };
  const archivio = { attivo: x.id, elenco: [x] }, raw = JSON.stringify({ v: 1, ...archivio });
  const dati = new Map([['itinerari-v1', raw]]), turni = [], timer = [], avvisi = [];
  let piena = false;
  for (const [nome, value] of Object.entries({ localStorage: { getItem: k => dati.get(k) ?? null, setItem: (k,v) => { if (piena) throw Error('Quota'); dati.set(k,v); } }, navigator: { locks: { request: (nome, options, fn) => new Promise((resolve,reject) => { const chiudi = () => { options.signal.removeEventListener('abort', abort); resolve(fn({name:nome})); }; const abort = () => reject(Error('Timeout')); options.signal.addEventListener('abort', abort, {once:true}); turni.push(chiudi); }) } } })) {
    const prima = Object.getOwnPropertyDescriptor(globalThis,nome);
    Object.defineProperty(globalThis,nome,{configurable:true,value});
    t.after(() => prima ? Object.defineProperty(globalThis,nome,prima) : delete globalThis[nome]);
  }
  const g = gestione({creaSalvataggio,presentaSalvataggio,testoErroreSalvataggio,fonte:{riferimento:raw},archivio});
  const classi = new Set(), testo = {textContent:''}, stato = {dataset:{},querySelector:()=>testo};
  const bottone = {disabled:false,classList:{toggle:(c,on)=>on?classi.add(c):classi.delete(c),add:c=>classi.add(c)}};
  const tutti = s => s.includes('data-itinerario-stato') ? [] : s.includes('[data-stato]') ? [stato] : [bottone];
  g.quandoSalva(controlli(tutti,g.statoSalvataggio,g.salvataggioInCorso));
  const d = {...g,A:archivio,X:()=>archivio.elenco.find(i=>i.id===archivio.attivo),salvato:i=>i.salvato,
    apriMiei(){},nomeLibero:n=>n,nomeProposto:()=> 'Napoli',dopoModifica(){},avvisa:(testo,azione)=>avvisi.push({testo,azione}),
    apriCondividi(){},mettiNome(){},$$:tutti,setTimeout:fn=>timer.push(fn),aggiorna:()=>g.scriviArchivio(),piano:()=>false};
  return {g,x,archivio,turni,timer,avvisi,bottone,classi,testo,dati,salva:comando(d),quota:on=>{piena=on;}};
}

test('salva reale: una seconda modifica in attesa impedisce la spunta prima dell’ultima scrittura', async t => {
  const e=ambiente(t), op=e.salva(); await tick();
  assert.equal(e.bottone.disabled,true); assert.equal(e.testo.textContent,'Salvataggio in corso');
  e.x.nome='Seconda modifica'; const p2=e.g.scriviArchivio();
  e.turni.shift()(); await tick();
  const prematuro=e.classi.has('salva--fatto'), timerPrima=e.timer.length;
  e.turni.shift()(); await Promise.all([op,p2]);
  assert.equal(prematuro,false); assert.equal(timerPrima,0);
  assert.equal(e.classi.has('salva--fatto'),true); assert.equal(e.bottone.disabled,false);
  assert.equal(JSON.parse(e.dati.get('itinerari-v1')).elenco[0].nome,'Seconda modifica');
});

test('attesa reale: include le scritture aggiunte durante l’attesa', async t => {
  const e=ambiente(t); const p1=e.g.scriviArchivio(); let finito=false;
  const attesa=e.g.attendiSalvataggi().then(()=>{finito=true;});
  e.x.nome='Aggiunta'; const p2=e.g.scriviArchivio(); await tick();
  e.turni.shift()(); await tick(); const prima=finito;
  e.turni.shift()(); await Promise.all([p1,p2,attesa]);
  assert.equal(prima,false); assert.equal(finito,true);
});

test('salva reale: un errore nell’ultima modifica mantiene errore e copia locale', async t => {
  const e=ambiente(t), op=e.salva(); await tick();
  e.x.nome='Da recuperare'; const p2=e.g.scriviArchivio();
  e.turni.shift()(); await tick(); e.quota(true); e.turni.shift()();
  await Promise.all([op,p2]);
  assert.equal(e.classi.has('salva--fatto'),false); assert.equal(e.testo.textContent,'Modifiche non salvate');
  assert.equal(e.x.nome,'Da recuperare'); assert.equal(e.bottone.disabled,false);
  assert.equal(e.timer.length,0);
});

test('salva reale: cambiare itinerario durante l’attesa non avvia conferme per quello nuovo', async t => {
  const e=ambiente(t), op=e.salva(); await tick();
  e.archivio.elenco.push({...structuredClone(e.x),id:'viaggio1',nome:'Altro'}); e.archivio.attivo='viaggio1';
  e.turni.shift()(); await op;
  assert.equal(e.timer.length,0); assert.equal(e.avvisi.length,0);
});

test('salva reale: un fallimento dopo il cambio itinerario lascia la prima bozza da salvare', async t => {
  const e = ambiente(t), op = e.salva(); await tick();
  e.archivio.elenco.push({ ...structuredClone(e.x), id: 'viaggio1', nome: 'Altro', salvato: false });
  e.archivio.attivo = 'viaggio1'; e.quota(true);
  e.turni.shift()(); await op;
  assert.equal(e.x.salvato, false);
  assert.equal(e.archivio.elenco[1].salvato, false);
  assert.equal(e.timer.length, 0);
  assert.equal(e.avvisi.length, 0);
});
