import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/mappa.js',import.meta.url),'utf8').replace(/^import .*;\r?$/gm,'').replace(/^export /gm,'');
function ambiente(){
 let timerId=0;const timer=new Map(),consegnati=[],osservatori=[];
 function nodo(){const ev=new Map(),figli=new Map(),classi=new Set();return {ev,figli,isConnected:true,clientWidth:400,clientHeight:600,style:{setProperty(){}},classList:{add:k=>classi.add(k),remove:k=>classi.delete(k),contains:k=>classi.has(k),toggle(k,v){if(v)classi.add(k);else classi.delete(k);}},set innerHTML(v){this.html=v;figli.clear();},get innerHTML(){return this.html??'';},addEventListener(k,f){if(!ev.has(k))ev.set(k,new Set());ev.get(k).add(f);},removeEventListener(k,f){ev.get(k)?.delete(f);},setAttribute(){},getBoundingClientRect:()=>({left:0,top:0,width:400,height:600}),emetti(k,e){for(const f of [...ev.get(k)??[]])f(e);},quanti:()=>[...ev.values()].reduce((n,s)=>n+s.size,0)};}
 const el=nodo(),$=(s,p=el)=>{if(!p.figli.has(s))p.figli.set(s,nodo());return p.figli.get(s);},deps={$,$$:()=>[],ic:()=>'',ResizeObserver:class{constructor(f){this.fn=f;osservatori.push(this);}observe(){}disconnect(){this.spenta=true;}},setTimeout:f=>{const n=++timerId;timer.set(n,f);consegnati.push(f);return n;},clearTimeout:n=>timer.delete(n),nomiDelPercorso:()=>[],piano:()=>false};
 const Mappa=new Function(...Object.keys(deps),source+';return Mappa;')(...Object.values(deps));Mappa.prototype.base=function(){};
 const crea=()=>{const m=new Mappa(el);m.vb={x:0,y:0,w:400,h:600};return m;},m=crea();
 const evento={pointerId:1,pointerType:'mouse',button:0,clientX:10,clientY:20,deltaY:1,target:{closest:()=>null},preventDefault(){}};
 return {m,el,$,crea,osservatori,timer,consegnati,evento};
}
test('mappa: spegnere rimuove i sei ascoltatori dal contenitore riutilizzato',()=>{const e=ambiente();assert.equal(e.el.quanti(),6);e.m.spegni();assert.equal(e.el.quanti(),0);});
test('mappa: riaprire quattro volte mantiene soltanto i sei ascoltatori correnti',()=>{const e=ambiente();let m=e.m;for(let i=0;i<4;i++){m.spegni();m=e.crea();}assert.equal(e.el.quanti(),6);});
test('mappa: chiudere rimuove anche ascoltatore dei vecchi comandi',()=>{const e=ambiente(),c=e.$('.m-ctrl');e.m.spegni();assert.equal(c.quanti(),0);});
test('mappa: callback puntatore già consegnato non riattiva una mappa spenta',()=>{const e=ambiente(),fn=[...e.el.ev.get('pointerdown')][0];let n=0;e.m.giu=()=>n++;e.m.spegni();fn(e.evento);assert.equal(n,0);});
test('mappa: vecchia rotella non muove la mappa dopo la chiusura',()=>{const e=ambiente(),fn=[...e.el.ev.get('wheel')][0];let n=0;e.m.zoom=()=>n++;e.m.spegni();fn(e.evento);assert.equal(n,0);});
for(const causa of ['chiusa','ritirata'])test('mappa: osservatore già consegnato dopo '+causa+' non adatta',()=>{const e=ambiente();let n=0;e.m.box={};e.m.adatta=()=>n++;if(causa==='chiusa')e.m.spegni();else e.el.isConnected=false;e.osservatori[0].fn();assert.equal(n,0);});
test('mappa: timer consegnato dopo la chiusura non aggiorna pezzi o nomi',()=>{const e=ambiente();let n=0;e.m.segni=()=>{};e.m.pezzi=()=>n++;e.m.nomiVisibili=()=>n++;e.m.metti(e.m.vb);const fn=e.consegnati.at(-1);e.m.spegni();fn();assert.equal(n,0);assert.equal(e.timer.size,0);});
test('mappa: timer dei nomi ritirato non riscrive i vecchi nodi',()=>{const e=ambiente(),prima=e.$('.m-nomi-rotta',e.m.svg);e.m.spegni();prima.innerHTML='preservato';e.m.nomiRotta();assert.equal(prima.innerHTML,'preservato');});
test('mappa: pulizia conserva gli ascoltatori esterni della pagina',()=>{const e=ambiente();let n=0;e.el.addEventListener('wheel',()=>n++);e.m.spegni();e.el.emetti('wheel',e.evento);assert.equal(e.el.quanti(),1);assert.equal(n,1);});
test('mappa: rotella corrente mantiene una sola richiesta di zoom',()=>{const e=ambiente();let n=0;e.m.zoom=()=>n++;e.el.emetti('wheel',e.evento);assert.equal(n,1);});
test('mappa: osservatore corrente mantiene adattamento ordinario',()=>{const e=ambiente();let n=0;e.m.box={};e.m.adatta=()=>n++;e.osservatori[0].fn();assert.equal(n,1);});
