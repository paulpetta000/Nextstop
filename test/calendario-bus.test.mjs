import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spacchettaVivo} from '../src/lib/itinerari/pacco.ts';
import {verificaStruttura} from '../src/lib/itinerari/struttura-dati.mjs';
import {usciteItinerari} from './fixtures/uscite-itinerari.mjs';
const pacco=()=>({preferenza:5,dal:'20261018',al:'20261018',giorni:{'20261018':0},fermate:{a:'A',b:'B'},tipi:[{salite:{'B1|a':[600,15]},viaggi:{'B1|a|b':10}}],dizionario:['B1'],candidati:[[[2,'B1|a|b',3],20,0]],senza:{},bus:{}});

test('calendario bus: partenze specifiche assenti dall’insieme della salita vengono rifiutate',()=>{
 const p=pacco();p.tipi[0].viaggi['B1|a|b']=[10,700];assert.throws(()=>spacchettaVivo(p),/partenz|corsa/i);
});
test('calendario bus: corsa senza gruppo di salita e chiavi malformate non entrano nel calcolo',()=>{
 for(const modifica of [p=>p.tipi[0].salite={},p=>p.tipi[0].salite['chiave-sbagliata']=[600],p=>p.tipi[0].viaggi['B1|a']=10]) {
  const p=pacco();modifica(p);assert.throws(()=>spacchettaVivo(p),/bus|salit|corsa/i);
 }
});
test('calendario bus: date impossibili e somme non finite sono rifiutate anche prima della build',()=>{
 for(const modifica of [p=>p.giorni={'20260230':0},p=>p.al='20261017',p=>p.tipi[0].salite['B1|salita']=[Number.MAX_VALUE,Number.MAX_VALUE]]) {
  const d=usciteItinerari();modifica(d['partenze-bus.json']);assert.throws(()=>verificaStruttura(d),/bus|partenz|Calendario/i);
 }
});
test('calendario bus: sottoinsiemi validi, orari dopo mezzanotte e durate frazionarie restano utilizzabili',()=>{
 const p=pacco();p.tipi[0].salite['B1|a']=[1430,20,0,30];p.tipi[0].viaggi['B1|a|b']=[10.5,1450,30];
 const V=spacchettaVivo(p);assert.deepEqual(V.viaggi[0].get('B1|a|b'),{min:10.5,partenze:[1450,1480]});
 assert.deepEqual(V.salite[0].get('B1|a'),[1430,1450,1450,1480]);
});
