import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spacchetta,aggiungiScenari,spacchettaVivo} from '../src/lib/itinerari/pacco.ts';
const pacco=()=>({n:2,tappe:[],linee:{},zone:{},dizionario:[''],feriale:{min:[0,10,10,0],metri:[0,10,10,0],mezzi:[0,0,0,0]},piedi:[]});
const bus=()=>({preferenza:5,dal:'20261018',al:'20261018',giorni:{'20261018':0},tipi:[{salite:{'B1|a':[600]},viaggi:{'B1|a|b':10}}],fermate:{a:'A',b:'B'},dizionario:['B1'],candidati:[[[2,'B1|a|b',3],10,0]],senza:{feriale:[1,20,20,0]},bus:{feriale:[1,1,0]}});
test('numeri pacco: distanza finita che diventa infinita in metri viene rifiutata',()=>{
 const p=pacco();p.feriale.metri[1]=Number.MAX_VALUE;assert.throws(()=>spacchetta(p));
});
test('numeri pacco: uno scenario con distanza traboccante conserva la città precedente',()=>{
 const C=spacchetta(pacco()),prima=structuredClone(C);
 assert.throws(()=>aggiungiScenari(C,{dizionario:[''],diff:{sabato:[1,20,Number.MAX_VALUE,0]}}));assert.deepEqual(C,prima);
});
test('numeri pacco: indici fuori città e coppie duplicate non vengono memorizzati',()=>{
 for(const modifica of [p=>p.bus.feriale[0]=4,p=>p.senza.feriale[0]=4,p=>p.bus.feriale.push(1,1,0),p=>p.senza.feriale.push(1,25,30,0)]) {
  const p=bus();modifica(p);assert.throws(()=>spacchettaVivo(p,undefined,2));
 }
});
test('numeri pacco: la somma dei tratti fissi non può traboccare',()=>{
 const p=bus();p.candidati[0][0]=[Number.MAX_VALUE,'B1|a|b',Number.MAX_VALUE];assert.throws(()=>spacchettaVivo(p));
});
test('numeri pacco: distanze grandi ma rappresentabili e vecchi chiamanti rimangono validi',()=>{
 const p=pacco();p.feriale.metri[1]=1e100;assert.equal(spacchetta(p).tempi.metri.feriale[1],1e101);
 assert.doesNotThrow(()=>spacchettaVivo(bus()));assert.doesNotThrow(()=>spacchettaVivo(bus(),undefined,2));
});
