import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const file=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js',import.meta.url),'utf8');
const codice=file.slice(file.indexOf('export const foglioEl'),file.indexOf('// ridisegna il contenuto vivo')).replace(/^export /gm,'');
const prepara=file.slice(file.indexOf('export function preparaFoglio'),file.indexOf('// ---------- avviso in basso')).replace(/^export /gm,'');
function ambiente(movimento=true){
 const classi=new Set(),eventi=new Map(),timer=[],chiudiEventi=[];let chiusure=0;
 const f={open:false,style:{},className:'',innerHTML:'',classList:{add:k=>classi.add(k),remove:k=>classi.delete(k),contains:k=>classi.has(k)},
  showModal(){this.open=true;},close(){this.open=false;chiusure++;chiudiEventi.push(()=>eventi.get('close')?.({}));},addEventListener:(k,fn)=>eventi.set(k,fn)};
 const d={$:sel=>sel==='#foglio'?f:{},esc:String,ic:()=>'',piano:()=>movimento,setTimeout:fn=>{timer.push(fn);},tiraPerChiudere(){}};
 const api=new Function(...Object.keys(d),codice+prepara+';return {foglio,chiudiFoglio,quandoChiudeFoglio,preparaFoglio,contesto:typeof contestoFoglio===\'function\'?contestoFoglio:null};')(...Object.values(d));
 return {...api,f,timer,chiudiEventi,get chiusure(){return chiusure;},fotogramma:()=>timer.splice(0).forEach(fn=>fn()),eventi:()=>chiudiEventi.splice(0).forEach(fn=>fn())};
}
test('foglio: una chiusura in ritardo non chiude o ripulisce il nuovo contenuto',async()=>{
 const e=ambiente();let prima=0,seconda=0;e.foglio('Prima','',()=>e.quandoChiudeFoglio(()=>prima++));const p=e.chiudiFoglio();
 e.foglio('Seconda','',()=>e.quandoChiudeFoglio(()=>seconda++));e.fotogramma();assert.equal(await p,false);assert.equal(e.f.open,true);assert.equal(e.chiusure,0);assert.equal(prima,1);assert.equal(seconda,0);assert.equal(e.f.classList.contains('f-esce'),false);
});
test('foglio: due richieste di chiusura condividono un solo effetto e una sola pulizia',async()=>{
 const e=ambiente();let pulizie=0;e.foglio('Prima','',()=>e.quandoChiudeFoglio(()=>pulizie++));const a=e.chiudiFoglio(),b=e.chiudiFoglio();assert.equal(e.timer.length,1);
 e.fotogramma();assert.equal(await a,true);assert.equal(await b,true);assert.equal(e.chiusure,1);assert.equal(pulizie,1);
});
test('foglio: il contesto distingue apertura corrente, chiusura e riapertura dello stesso elemento',async()=>{
 const e=ambiente();assert.equal(typeof e.contesto,'function');e.foglio('Prima','');const a=e.contesto();assert.equal(a(),true);const p=e.chiudiFoglio();assert.equal(a(),false);
 e.foglio('Seconda','');assert.equal(a(),false);const b=e.contesto();assert.equal(b(),true);e.fotogramma();await p;assert.equal(b(),true);
});
test('foglio: anche la chiusura nativa ripulisce una volta',()=>{
 const e=ambiente();e.preparaFoglio();let n=0;e.foglio('Prima','',()=>e.quandoChiudeFoglio(()=>n++));e.f.close();e.eventi();e.eventi();assert.equal(n,1);
});
test('foglio: un evento close già in coda non ripulisce il foglio riaperto',async()=>{
 const e=ambiente(false);e.preparaFoglio();let n=0;e.foglio('Prima','');await e.chiudiFoglio();e.foglio('Seconda','',()=>e.quandoChiudeFoglio(()=>n++));e.eventi();assert.equal(e.f.open,true);assert.equal(n,0);
});
test('foglio: senza animazioni la chiusura riuscita conserva il comportamento ordinario',async()=>{
 const e=ambiente(false);let n=0;e.foglio('Prima','',()=>e.quandoChiudeFoglio(()=>n++));assert.equal(await e.chiudiFoglio(),true);assert.equal(e.f.open,false);assert.equal(n,1);assert.equal(await e.chiudiFoglio(),false);
});
