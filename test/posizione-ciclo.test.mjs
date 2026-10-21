import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/avvio.js',import.meta.url),'utf8').replaceAll('\r\n','\n');
const a=source.indexOf('  let guardia ='),b=source.indexOf('  const occupato =',a),code=source.slice(a,b);
function ambiente(){
 let x={posizione:'si'},oggi=true,aggiornamenti=0,annunci=0;
 const VIVO={negata:false,posizione:null},document={visibilityState:'visible'},richieste=[],fermate=[];
 const navigator={geolocation:{watchPosition(ok,errore,opzioni){richieste.push({ok,errore,opzioni});return richieste.length;},clearWatch:id=>fermate.push(id)}};
 const d={X:()=>x,S:{g:0},VIVO,document,navigator,posizioneAttiva:y=>y.posizione==='si'&&!VIVO.negata,oggiNelGiorno:()=>oggi,dalVivo:()=>aggiornamenti++,aggiorna:()=>aggiornamenti++,avvisa:()=>annunci++};
 const api=new Function(...Object.keys(d),code+';return {cura,ferma};')(...Object.values(d));
 const posizione={coords:{latitude:1,longitude:2,accuracy:3}},errore={code:1,PERMISSION_DENIED:1};
 return {...api,VIVO,document,richieste,fermate,posizione,errore,get aggiornamenti(){return aggiornamenti;},get annunci(){return annunci;},disattiva(){x.posizione='no';},altroGiorno(){oggi=false;},nuovoViaggio(){x={posizione:'no'};}};
}
test('GPS: posizione corrente conserva coordinate e precisione e aggiorna',()=>{const e=ambiente();e.cura();e.richieste[0].ok(e.posizione);assert.deepEqual(e.VIVO.posizione,{ll:[1,2],precisione:3});assert.equal(e.aggiornamenti,1);assert.deepEqual(e.richieste[0].opzioni,{enableHighAccuracy:true,maximumAge:60000,timeout:30000});});
test('GPS: cura ripetuta mantiene una sola osservazione',()=>{const e=ambiente();e.cura();e.cura();assert.equal(e.richieste.length,1);});
test('GPS: posizione consegnata dopo arresto resta ignorata',()=>{const e=ambiente();e.cura();e.ferma();e.richieste[0].ok(e.posizione);assert.equal(e.VIVO.posizione,null);assert.equal(e.aggiornamenti,0);assert.deepEqual(e.fermate,[1]);});
test('GPS: vecchio rifiuto dopo riavvio non spegne la richiesta nuova',()=>{const e=ambiente();e.cura();e.ferma();e.cura();e.richieste[0].errore(e.errore);assert.equal(e.VIVO.negata,false);assert.deepEqual(e.fermate,[1]);assert.equal(e.annunci,0);e.richieste[1].ok(e.posizione);assert.deepEqual(e.VIVO.posizione,{ll:[1,2],precisione:3});});
for(const cambio of ['nascosta','disattiva','altroGiorno','nuovoViaggio'])for(const tipo of ['ok','errore'])test('GPS: risposta '+tipo+' ignorata con pagina '+cambio,()=>{const e=ambiente();e.cura();if(cambio==='nascosta')e.document.visibilityState='hidden';else e[cambio]();e.richieste[0][tipo](tipo==='ok'?e.posizione:e.errore);assert.equal(e.VIVO.posizione,null);assert.equal(e.VIVO.negata,false);assert.equal(e.aggiornamenti,0);assert.equal(e.annunci,0);});
test('GPS: rifiuto corrente ferma osservazione e avvisa una volta',()=>{const e=ambiente();e.cura();e.richieste[0].errore(e.errore);e.richieste[0].errore(e.errore);assert.equal(e.VIVO.negata,true);assert.deepEqual(e.fermate,[1]);assert.equal(e.aggiornamenti,1);assert.equal(e.annunci,1);});
test('GPS: errore transitorio non spegne la richiesta corrente',()=>{const e=ambiente();e.cura();e.richieste[0].errore({code:2,PERMISSION_DENIED:1});assert.equal(e.VIVO.negata,false);assert.deepEqual(e.fermate,[]);e.richieste[0].ok(e.posizione);assert.equal(e.aggiornamenti,1);});
