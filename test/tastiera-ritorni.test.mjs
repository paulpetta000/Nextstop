import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/viste.js',import.meta.url),'utf8').replaceAll('\r\n','\n');
const code=source.slice(source.indexOf('export function preparaViste()')).replace(/^export /gm,'');
function ambiente(){
 let x={giorni:[{}, {}, {}]},app={isConnected:true,addEventListener(k,f){eventi.set(k,f);}},bloccato=false;
 const eventi=new Map(),S={g:1,p:'c'},frame=[],fuochi=[],spostamenti=[],nodi=new Map(),body={},document={body,activeElement:body,addEventListener(){}};
 const $=(sel)=>{if(sel==='#app')return app;if(!nodi.has(sel))nodi.set(sel,{isConnected:true,focus(){fuochi.push(sel);document.activeElement=this;}});return nodi.get(sel);};
 const deps={$ ,X:()=>x,S,document,computer:{addEventListener(){}},addEventListener(){},nG:()=>3,vaiAlGiorno:g=>{if(bloccato)return false;S.g=g;return true;},requestAnimationFrame:fn=>frame.push(fn),G:()=>({}),giornoDi:()=>S.g,tappeDi:()=>[{id:'a'},{id:'b'}],spostaA:(id,a)=>spostamenti.push([id,a])};
 new Function(...Object.keys(deps),'let rotta=false;'+code+';preparaViste();')(...Object.values(deps));
 function tasto(tipo='tab',key='ArrowRight',id='a'){const origine={dataset:{maniglia:id},closest:sel=>sel===(tipo==='tab'?'[role="tab"]':'[data-maniglia]')?origine:null};document.activeElement=origine;eventi.get('keydown')({target:origine,key,preventDefault(){}});return origine;}
 return {S,document,fuochi,spostamenti,frame,$,tasto,get nodi(){return nodi;},cambia(){x={giorni:[{}, {}, {}]};},sostituisci(){app={isConnected:true};},ritira(){app.isConnected=false;},blocca(){bloccato=true;},esegui(){for(const f of frame.splice(0))f();}};
}
for(const tipo of ['tab','maniglia'])for(const cambio of ['cambia','sostituisci','ritira','giorno','vista','fuoco'])test('tastiera '+tipo+': ritorno dopo '+cambio+' non sposta il fuoco',()=>{const e=ambiente();e.tasto(tipo,tipo==='tab'?'ArrowRight':'ArrowDown');if(cambio==='giorno')e.S.g=0;else if(cambio==='vista')e.S.p='d';else if(cambio==='fuoco')e.document.activeElement={};else e[cambio]();e.esegui();assert.deepEqual(e.fuochi,[]);});
test('tastiera: richieste ravvicinate danno fuoco soltanto alla ultima scelta',()=>{const e=ambiente();e.tasto('tab','Home');e.tasto('tab','End');e.esegui();assert.deepEqual(e.fuochi,['[role="tab"][data-g="2"]']);});
test('tastiera: cambio giorno bloccato non sposta il fuoco su un altro giorno',()=>{const e=ambiente();e.blocca();e.tasto();e.esegui();assert.deepEqual(e.fuochi,[]);});
test('tastiera: bersaglio ritirato non riceve fuoco',()=>{const e=ambiente();e.tasto();e.$('[role="tab"][data-g="2"]').isConnected=false;e.esegui();assert.deepEqual(e.fuochi,[]);});
for(const [key,g]of [['Home',0],['End',2],['ArrowLeft',0],['ArrowRight',2]])test('tastiera: '+key+' mantiene giorno e fuoco ordinari',()=>{const e=ambiente();e.tasto('tab',key);e.esegui();assert.equal(e.S.g,g);assert.deepEqual(e.fuochi,['[role="tab"][data-g="'+g+'"]']);});
test('tastiera: riordino conserva la maniglia dopo aggiornamento ordinario',()=>{const e=ambiente();e.tasto('maniglia','ArrowDown');e.esegui();assert.deepEqual(e.spostamenti,[['a',1]]);assert.deepEqual(e.fuochi,['[data-maniglia="a"]']);});
test('tastiera: una lettera non avvia cambio giorno o fuoco',()=>{const e=ambiente();e.tasto('tab','x');e.esegui();assert.equal(e.S.g,1);assert.deepEqual(e.fuochi,[]);});
