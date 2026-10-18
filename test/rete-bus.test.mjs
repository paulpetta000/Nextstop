import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../scripts/itinerari/costruisci.mjs',import.meta.url),'utf8');
const da=source.indexOf('function rete('), a=source.indexOf('function dijkstra(',da);
assert.ok(da>0&&a>da);
const crea=new Function('d','const {fermate,MEZZI,BUS,PIEDI,corse,ascensori,adj,strato1,base,inStrato1}=d;'+source.slice(da,a)+';return rete;');
function ambiente() {
 const fermate=[{id:'B1:0:a',linea:'B1',accessi:[{nodo:{id:1},m:0}],attesa:{feriale:5},discese:{feriale:false}},{id:'B1:0:b',linea:'B1',accessi:[{nodo:{id:2},m:0}],attesa:{feriale:null},discese:{feriale:true}}];
 const d={fermate,MEZZI:new Map([['B1',{bus:true,accesso:1,uscita:0.5}]]),BUS:{preferenza:5},PIEDI:{metriAlMinuto:75,ascensore:1},corse:[{linea:'B1',da:'B1:0:a',a:'B1:0:b',t:{feriale:10},unVerso:true}],ascensori:new Map(),adj:new Map(),strato1:x=>typeof x==='number'?-x:'^'+x,base:x=>typeof x==='number'?Math.abs(x):x.startsWith('^')?x.slice(1):x,inStrato1:x=>typeof x==='number'?x<0:x.startsWith('^')};
 return {d,rete:crea(d)};
}
const scenario={nome:'feriale',mezzi:true};
test('rete bus: al capolinea si può scendere anche senza altre partenze',()=>{
 const e=ambiente(),vicini=e.rete(scenario);assert.ok(vicini('B1:0:b').some(x=>x.tipo==='scende'&&x.a===2));
});
test('rete bus: una fermata di sola salita non permette di scendere',()=>{
 const e=ambiente(),vicini=e.rete(scenario);assert.ok(vicini(1).some(x=>x.tipo==='sale'));assert.equal(vicini('B1:0:a').some(x=>x.tipo==='scende'),false);
});
test('rete bus: il modo subito conserva la discesa e senza elimina entrambe',()=>{
 const e=ambiente(),subito=e.rete(scenario,'subito'),senza=e.rete(scenario,'senza');
 assert.ok(subito('^B1:0:b').some(x=>x.tipo==='scende'&&x.a===-2));
 assert.equal(senza(1).length,0);assert.equal(senza('B1:0:b').length,0);
});
