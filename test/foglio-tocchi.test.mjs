import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const file=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js',import.meta.url),'utf8');const codice=file.slice(file.indexOf('export const gestoScheda')).replace(/^export /gm,'');
function ambiente(){const eventi=new Map(),timer=[],p={style:{}};let valido=true,chiusure=0,tempo=0;const el={addEventListener:(k,fn)=>eventi.set(k,fn)};
 const d={computer:{matches:false},performance:{now:()=>tempo},setTimeout:fn=>timer.push(fn),piano:()=>false,contestoFoglio:()=>()=>valido};const prepara=new Function(...Object.keys(d),codice+';return tiraPerChiudere;')(...Object.values(d));prepara(el,{pronto:()=>true,scorre:()=>({scrollTop:0}),pannello:()=>p,chiudi:()=>chiusure++});
 const ev=(x,y,n=1)=>({touches:Array.from({length:n},()=>({clientX:x,clientY:y})),target:{closest:()=>null},preventDefault(){}});
 return {p,timer,get chiusure(){return chiusure;},giu:()=>eventi.get('touchstart')(ev(0,0)),muovi:(y,n=1)=>{tempo=200;eventi.get('touchmove')(ev(0,y,n));},su:()=>{tempo=400;eventi.get('touchend')({});},annulla:()=>eventi.get('touchcancel')({}),invalida:()=>{valido=false;}};
}
test('tiro touch: un annullamento lungo non chiude il foglio',()=>{const e=ambiente();e.giu();e.muovi(250);e.annulla();assert.equal(e.chiusure,0);assert.equal(e.p.style.translate,'');});
test('tiro touch: fine ordinaria conserva la chiusura decisa',()=>{const e=ambiente();e.giu();e.muovi(250);e.su();assert.equal(e.chiusure,1);});
test('tiro touch: un secondo dito o una lista vuota di tocchi annulla senza errore',()=>{for(const n of [0,2]){const e=ambiente();e.giu();e.muovi(250);assert.doesNotThrow(()=>e.muovi(260,n));e.su();assert.equal(e.chiusure,0);assert.equal(e.p.style.translate,'');}});
test('tiro touch: un’apertura sostituita non viene chiusa dal vecchio gesto',()=>{const e=ambiente();e.giu();e.muovi(250);e.invalida();e.su();assert.equal(e.chiusure,0);assert.equal(e.p.style.translate,'');});

test('tiro touch: pulizia vecchia non cancella il nuovo gesto',()=>{const e=ambiente();e.giu();e.muovi(250);e.su();e.giu();e.muovi(100);const prima=e.p.style.translate;e.timer.forEach(fn=>fn());assert.equal(e.p.style.translate,prima);});
test('tiro touch: pulizia vecchia non tocca un altro contesto',()=>{const e=ambiente();e.giu();e.muovi(250);e.su();e.invalida();e.p.style.translate='0 50px';e.timer.forEach(fn=>fn());assert.equal(e.p.style.translate,'0 50px');});
