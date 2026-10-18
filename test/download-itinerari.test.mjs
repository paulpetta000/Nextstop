import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { validaOsm } from '../scripts/itinerari/ingressi.mjs';
const s = fs.readFileSync(new URL('../scripts/itinerari/scarica.mjs',import.meta.url),'utf8');
const da=s.indexOf('const osmFile ='), a=s.indexOf('// ---------- Quote',da), daB=s.indexOf('const busFile =');
assert.ok(da>=0&&a>da&&daB>a);
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const scaricaOsm=new AsyncFunction('fs','path','dir','BOX','UA','fetch','console','setTimeout','validaOsm',s.slice(da,a));
const scaricaBus=new AsyncFunction('fs','path','dir','UA','fetch','console',s.slice(daB));
const valido={elements:[{type:'node',id:1,lat:1,lon:1},{type:'node',id:2,lat:1,lon:2},{type:'way',id:3,nodes:[1,2],tags:{highway:'footway'}}]};
function ambiente(risposte,{esiste=false}={}){
  const scritture=[],richieste=[];
  const file={existsSync:()=>esiste,writeFileSync:(...args)=>scritture.push(args)};
  const fetch=async url=>{richieste.push(url);const i=Math.min(richieste.length-1,risposte.length-1);return new Response(risposte[i]);};
  return {scritture,richieste,osm:()=>scaricaOsm(file,path,'/fittizio',{s:0,w:0,n:2,e:2},'test',fetch,{log(){}},fn=>fn(),validaOsm),bus:()=>scaricaBus(file,path,'/fittizio','test',fetch,{log(){}})};
}
test('download OSM: JSON non valido non viene scritto come cache',async()=>{
  const e=ambiente(['{']);await assert.rejects(e.osm());assert.equal(e.scritture.length,0);
});
test('download OSM: una risposta parziale viene scartata e si prova il server successivo',async()=>{
  const e=ambiente([JSON.stringify({...valido,remark:'runtime error: timeout'}),JSON.stringify(valido)]);
  await e.osm();assert.equal(e.richieste.length,2);assert.equal(e.scritture.length,1);assert.deepEqual(JSON.parse(e.scritture[0][1]),valido);
});
test('download OSM: il recupero dopo JSON malformato conserva soltanto la risposta valida',async()=>{
  const e=ambiente(['{',JSON.stringify(valido)]);await e.osm();assert.equal(e.richieste.length,2);assert.equal(e.scritture.length,1);assert.deepEqual(JSON.parse(e.scritture[0][1]),valido);
});
test('download: una cache esistente non viene sovrascritta o scaricata di nuovo',async()=>{
  const e=ambiente([],{esiste:true});await e.osm();await e.bus();assert.equal(e.richieste.length,0);assert.equal(e.scritture.length,0);
});
test('download bus: risposta più corta della firma ZIP viene rifiutata senza scrivere',async()=>{
  for(const b of [new Uint8Array(),new Uint8Array([1,2,3])]){const e=ambiente([b]);await assert.rejects(e.bus(),/ANM GTFS:.*zip/i);assert.equal(e.scritture.length,0);}
});
test('download OSM: la data non dipende dall’ordine dei campi o dai primi duemila caratteri',async()=>{
  const vecchio={nota:'x'.repeat(2500),...valido,osm3s:{timestamp_osm_base:new Date(Date.now()-30*864e5).toISOString()}};
  const nuovo={...valido,osm3s:{timestamp_osm_base:new Date().toISOString()}};
  const e=ambiente([JSON.stringify(vecchio),JSON.stringify(nuovo)]);await e.osm();
  assert.equal(e.richieste.length,2);assert.deepEqual(JSON.parse(e.scritture[0][1]),nuovo);
});
test('download OSM: una data dichiarata ma illeggibile non viene trattata come recente',async()=>{
  const e=ambiente([JSON.stringify({...valido,osm3s:{timestamp_osm_base:'data non valida'}})]);
  await assert.rejects(e.osm());assert.equal(e.scritture.length,0);
});