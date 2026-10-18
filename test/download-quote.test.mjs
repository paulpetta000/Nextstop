import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {validaQuote} from '../scripts/itinerari/ingressi.mjs';
const source=fs.readFileSync(new URL('../scripts/itinerari/scarica.mjs',import.meta.url),'utf8');
const da=source.indexOf('const demFile ='),a=source.indexOf('// ---------- Autobus',da);assert.ok(da>0&&a>da);
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const scarica=new AsyncFunction('fs','path','dir','BOX','UA','fromUrl','console','scriviFile','validaQuote',source.slice(da,a));
function ambiente({quote=[-1,0,2,3],nodata=null,risoluzione=[0.5,-0.5],origine=[0,1],w=2,h=2}={}) {
 const scritture=[],letture=[];
 const img={getOrigin:()=>origine,getResolution:()=>risoluzione,getWidth:()=>w,getHeight:()=>h,getGDALNoData:()=>nodata,readRasters:async op=>{letture.push(op);return [quote];}};
 const file={existsSync:()=>false,writeFileSync:(...x)=>scritture.push(x)};
 return {scritture,letture,lavoro:()=>scarica(file,path,'/fittizio',{w:0,e:1,n:1,s:0},'test',async()=>({getImage:async()=>img}),{log(){}},(...x)=>scritture.push(x),validaQuote)};
}
test('quote download: campioni mancanti o non finiti non diventano una cache JSON',async()=>{
 for(const quote of [[0,1,2],[0,1,2,NaN],[0,1,2,Infinity],[0,1,2,Number.MAX_VALUE]]) {
  const e=ambiente({quote});await assert.rejects(e.lavoro(),/Quote|Copernicus/i);assert.equal(e.scritture.length,0);
 }
});
test('quote download: il valore NoData dichiarato dal raster non è una quota del terreno',async()=>{
 const e=ambiente({quote:[0,1,-32767,3],nodata:-32767});await assert.rejects(e.lavoro(),/Quote|NoData/i);assert.equal(e.scritture.length,0);
});
test('quote download: metadati non validi vengono rifiutati prima di leggere una finestra',async()=>{
 for(const modifica of [{risoluzione:[0,-0.5]},{risoluzione:[0.5,0.5]},{w:0},{origine:[NaN,1]}]) {
  const e=ambiente(modifica);await assert.rejects(e.lavoro(),/Quote|Copernicus/i);assert.equal(e.letture.length,0);assert.equal(e.scritture.length,0);
 }
});
test('quote download: quota zero e valori negativi validi restano numeri nel JSON',async()=>{
 const e=ambiente();await e.lavoro();const d=JSON.parse(e.scritture[0][1]);assert.deepEqual(d.quote,[-1,0,2,3]);assert.equal(d.w*d.h,4);assert.doesNotThrow(()=>validaQuote(d,{raggio:0,percentile:0,media:0}));
});

test('quote download: null e stringhe non sono convertiti in quote numeriche',async()=>{
 for(const v of [null,'2',false]){const e=ambiente({quote:[0,1,2,v]});await assert.rejects(e.lavoro(),/Quote|Copernicus/i);assert.equal(e.scritture.length,0);}
});
test('quote download: un raster che copre solo una parte della città non viene usato fuori dai bordi',async()=>{
 const e=ambiente({origine:[-0.5,1]});await assert.rejects(e.lavoro(),/Quote|Copernicus/i);assert.equal(e.letture.length,0);
});
