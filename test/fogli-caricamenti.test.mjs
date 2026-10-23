import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {piuGiorni,dataLunga,ora} from '../src/lib/itinerari/date.ts';
const comune=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js',import.meta.url),'utf8');
const ciclo=comune.slice(comune.indexOf('export const foglioEl'),comune.indexOf('// ridisegna il contenuto vivo')).replace(/^export /gm,'');
const file=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/fogli.js',import.meta.url),'utf8');
const codice=file.slice(file.indexOf('export function fineDelGiorno'),file.indexOf('// ---------- i miei itinerari')).replace(/^export /gm,'')
 .replace("import('./calendario.js')",'caricaCalendario()').replace("import('./ore.js')",'caricaOre()');
function ambiente(){
 let x={id:'primo',nome:'Primo',giorni:[{tappe:[],inizio:570,fine:1140}]},rifatti=0,fuochi=0;const S={g:0},nodi=new Map(),attese={calendario:[],ore:[]},aperture=[],avvisi=[];
 const f={open:false,style:{},classList:{add(){},remove(){}},showModal(){this.open=true;},close(){this.open=false;}};
 const $=sel=>{if(sel==='#foglio')return f;if(!nodi.has(sel))nodi.set(sel,{innerHTML:'',focus(){fuochi++;}});return nodi.get(sel);};
 const base={$ ,esc:String,ic:()=>'',piano:()=>false};
 const api=new Function(...Object.keys(base),ciclo+';return {foglio,chiudiFoglio,contestoFoglio,dopoChiusuraFoglio};')(...Object.values(base));
 const carica=tipo=>()=>new Promise((ok,no)=>attese[tipo].push({ok,no}));
 const d={...base,...api,S,X:()=>x,nG:()=>x.giorni.length,G:()=>null,T:()=>null,daFare:()=>[],ora,piuGiorni,dataLunga,oggi:()=> '2026-10-20',range:n=>Array.from({length:n},(_,k)=>k),dataLungaDi:()=>'',chiusaIl:()=>false,
  rinfresca(){rifatti++;},annuncia(){},avvisa:t=>avvisi.push(t),aggiorna:fn=>fn(x),togliGiorno(){},caricaCalendario:carica('calendario'),caricaOre:carica('ore')};
 const apri=new Function(...Object.keys(d),codice+';return apriQuando;')(...Object.values(d));
 return {...api,S,f,attese,aperture,avvisi,apri,get x(){return x;},get rifatti(){return rifatti;},get fuochi(){return fuochi;},
  clic:(k,v)=>f.onclick({target:{closest:()=>({dataset:{f:k,v}})}}),
  risolvi(tipo,i=0){attese[tipo][i].ok(tipo==='calendario'?{apriCalendario:(g,fatto)=>aperture.push({tipo,g,fatto})}:{apriOre:(g,k,fatto)=>aperture.push({tipo,g,k,fatto})});},
  cambia(){x={...structuredClone(x),id:'secondo'};}};
}
test('selettori: la data si apre e il ritorno aggiorna il foglio corrente',async()=>{
 const e=ambiente();e.apri();const p=e.clic('calendario');e.risolvi('calendario');await p;assert.equal(e.aperture.length,1);e.x.data='2026-11-01';e.aperture[0].fatto();assert.equal(e.rifatti,1);assert.equal(e.fuochi,1);
});
for(const tipo of ['calendario','ore'])test('selettori: '+tipo+' non si apre dopo la chiusura del foglio',async()=>{
 const e=ambiente();e.apri();const p=e.clic(tipo,'inizio');await e.chiudiFoglio();e.risolvi(tipo);await p;assert.equal(e.aperture.length,0);
});
test('selettori: riusare lo stesso dialog per un altro foglio invalida il caricamento',async()=>{
 const e=ambiente();e.apri();const p=e.clic('calendario');e.foglio('Altro','');e.risolvi('calendario');await p;assert.equal(e.aperture.length,0);
});
test('selettori: cambiare itinerario o giorno invalida la richiesta',async()=>{
 for(const cambia of [e=>e.cambia(),e=>{e.x.giorni.push({...e.x.giorni[0]});e.S.g=1;},e=>{e.x.giorni[0]={...e.x.giorni[0]};}]){
  const e=ambiente();e.apri();const p=e.clic('ore','fine');cambia(e);e.risolvi('ore');await p;assert.equal(e.aperture.length,0);
 }
});
test('selettori: fra due caricamenti si apre soltanto l’ultima scelta',async()=>{
 const e=ambiente();e.apri();const a=e.clic('calendario'),b=e.clic('ore','fine');e.risolvi('ore');await b;e.risolvi('calendario');await a;assert.equal(e.aperture.length,1);assert.equal(e.aperture[0].tipo,'ore');assert.equal(e.aperture[0].k,'fine');
});
test('selettori: due tocchi rapidi sullo stesso campo non aprono due finestre',async()=>{
 const e=ambiente();e.apri();const a=e.clic('calendario'),b=e.clic('calendario');e.risolvi('calendario',0);e.risolvi('calendario',1);await Promise.all([a,b]);assert.equal(e.aperture.length,1);
});
test('selettori: il ritorno di una vecchia finestra non ridisegna o focalizza il nuovo foglio',async()=>{
 const e=ambiente();e.apri();const p=e.clic('ore','fine');e.risolvi('ore');await p;e.foglio('Altro','');const fuochiPrima=e.fuochi;e.aperture[0].fatto('fine');assert.equal(e.rifatti,0);assert.equal(e.fuochi,fuochiPrima);
});
for(const tipo of ['calendario','ore'])test('selettori: errore '+tipo+' gestito e nuovo tentativo possibile senza cambiare i dati',async()=>{
 const e=ambiente();e.apri();const prima=structuredClone(e.x),p=e.clic(tipo,'inizio');e.attese[tipo][0].no(Error('Rete fittizia'));await assert.doesNotReject(p);assert.deepEqual(e.x,prima);assert.equal(e.avvisi.length,1);assert.match(e.avvisi[0],/Riprova/);
 const q=e.clic(tipo,'inizio');e.risolvi(tipo,1);await q;assert.equal(e.aperture.length,1);
});
