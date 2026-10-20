import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as ore from '../src/lib/itinerari/ore.ts';
import { ora } from '../src/lib/itinerari/date.ts';
const sorgente=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/ore.js',import.meta.url),'utf8').replace(/^import .*;\r?$/gm,'').replace(/^export /gm,'');
function ambiente({ gita=false, calcolo=null, inizio=570, fine=1140 }={}) {
 const x={nome:'Prova',giorni:[{inizio,fine,tappe:[],...(gita?{gita:'fittizia'}:{})}]}, nodi=new Map(), eventi=new Map();
 const nodo=sel=>({innerHTML:'',textContent:'',dataset:{m:/data-m="(\d+)"/.exec(sel)?.[1]},style:{setProperty(){}},classList:{add(){},remove(){},contains:()=>false},parentElement:{style:{setProperty(){}},className:''},tabIndex:-1,
  setAttribute(){},addEventListener:(k,fn)=>eventi.set(k,fn),focus(){if(!this.disabled)this.fuochi=(this.fuochi??0)+1;},scrollIntoView(){}});
 const $=sel=>{if(!nodi.has(sel))nodi.set(sel,nodo(sel));return nodi.get(sel);};
 const d={...ore,$,X:()=>x,fineDelGiorno:()=>calcolo,esc:String,ic:()=>'',piano:()=>false,ora,STILE:'',annuncia(){},aggiorna:fn=>fn(x),document:{createElement:()=>({dataset:{}}),head:{append(){}}}};
 const api=new Function(...Object.keys(d),sorgente+';return {disegna,prepara,modo:k=>{modo=k;}};')(...Object.values(d));
 return {...api,x,nodi,$,clic:m=>eventi.get('click')({target:{closest:()=>$(String.raw`.ore-q[data-m="${m}"]`)}}),tasto:(m,key)=>{const b=$(String.raw`.ore-q[data-m="${m}"]`);eventi.get('keydown')({target:{closest:()=>b},key,preventDefault(){}});}};
}
for(const gita of [false,true])test('ore: il giorno '+(gita?'di gita':'vuoto')+' si disegna e permette di scegliere l’inizio',()=>{
 const e=ambiente({gita});e.prepara();e.disegna();assert.match(e.$('#ore').innerHTML,/Nessuna tappa in questo giorno/);e.clic(600);assert.equal(e.x.giorni[0].inizio,600);
});
test('ore: ai confini le frecce mantengono un quarto abilitato nella sequenza da tastiera',()=>{
 for(const [modo,m,key,inizio,fine]of [['fine',ore.FINE_MIN,'ArrowLeft',ore.INIZIO_MIN,ore.FINE_MIN],['inizio',ore.INIZIO_MAX,'ArrowRight',ore.INIZIO_MAX,ore.FINE_MAX]]){
  const e=ambiente({inizio,fine,calcolo:{st:inizio+30,oltre:false,fuori:[],frase:''}});e.prepara();e.modo(modo);e.disegna();e.tasto(m,key);
  const abilitati=[...e.nodi.entries()].filter(([sel,n])=>sel.startsWith('.ore-q[data-m=')&&!n.disabled&&n.tabIndex===0);assert.equal(abilitati.length,1,modo);assert.equal(abilitati[0][1].dataset.m,String(m));
 }
});
test('ore: una giornata calcolata conserva l’orario di fine nel riepilogo',()=>{
 const e=ambiente({calcolo:{st:1050,oltre:false,fuori:[],frase:'Finisci alle 17:30'}});e.disegna();assert.match(e.$('#ore').innerHTML,/Finisci alle 17:30/);
});
