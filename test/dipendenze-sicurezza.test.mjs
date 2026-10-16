import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {SourceMapConsumer,SourceMapGenerator,SourceNode}=require('source-map-js');
const flat={version:3,sources:['esempio.js'],names:[],mappings:'AAAA',sourcesContent:['x();']};
const indexed=(line,column=0,map=flat)=>({version:3,sections:[{offset:{line,column},map}]});

test('sourcemap: rifiuta offset di riga enormi prima di espandere i mapping',()=>{
 assert.throws(()=>new SourceMapConsumer(indexed(10000001)),/offset|line/i);
});

test('sourcemap: rifiuta offset frazionari, negativi o non numerici',()=>{
 for(const [line,column] of [[0.5,0],[-1,0],['10',0],[0,-1],[0,0.5],[0,Infinity]]){
  assert.throws(()=>new SourceMapConsumer(indexed(line,column)),/offset|integer/i);
 }
});

test('sourcemap: limita anche la somma degli offset annidati',()=>{
 assert.throws(()=>new SourceMapConsumer(indexed(6000000,0,indexed(6000000))),/offset|line/i);
});

test('sourcemap: mappe ordinarie conservano codice e posizioni',()=>{
 const g=new SourceMapGenerator({file:'uscita.js'});
 g.addMapping({generated:{line:1,column:0},original:{line:1,column:0},source:'esempio.js'});
 g.setSourceContent('esempio.js','x();');
 const c=new SourceMapConsumer(g.toJSON());
 assert.deepEqual(c.originalPositionFor({line:1,column:0}),{source:'esempio.js',line:1,column:0,name:null});
 const code=SourceNode.fromStringWithSourceMap('x();',c).toStringWithSourceMap({file:'uscita.js'});
 assert.equal(code.code,'x();');
 assert.deepEqual(code.map.toJSON().sources,['esempio.js']);
});

test('Astro: immagini con cookie non ottengono durata positiva nella cache di build',async()=>{
 const {loadRemoteImage}=await import('../node_modules/astro/dist/assets/build/remote.js');
 const fakeFetch=async()=>new Response(new Uint8Array([1,2,3]),{status:200,headers:{'cache-control':'max-age=3600','set-cookie':'sessione=fittizia; HttpOnly'}});
 const result=await loadRemoteImage('https://example.invalid/solo-prova.png',fakeFetch,{remotePatterns:[],domains:['example.invalid']});
 assert.deepEqual([...result.data],[1,2,3]);
 assert.ok(result.expires<=Date.now(),'La risposta con cookie resta senza durata utile');
 assert.equal('headers' in result,false,'Non restituisce gli header della risposta remota');
});
