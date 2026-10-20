import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const comune=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js',import.meta.url),'utf8');
const ciclo=comune.slice(comune.indexOf('export const foglioEl'),comune.indexOf('// ridisegna il contenuto vivo')).replace(/^export /gm,'');
const file=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/scheda.js',import.meta.url),'utf8');
const codice=file.slice(file.indexOf('// ---------- aprire ----------'),file.indexOf('// ---------- il foglio ----------')).replace(/^export /gm,'');
function ambiente(){
 let x={id:'primo',giorni:[{tappe:['a','b']},{tappe:[]}]};const S={g:0,p:'c'},attese=[],aperture=[],azioni=[],timer=[],focus={isConnected:true};
 const f={open:false,style:{},classList:{add(){},remove(){}},showModal(){this.open=true;},close(){this.open=false;}};
 const base={$:sel=>sel==='#foglio'?f:{},esc:String,ic:()=>'',piano:()=>true,setTimeout:fn=>timer.push(fn)};
 const api=new Function(...Object.keys(base),ciclo+';return {foglio,chiudiFoglio,contestoFoglio};')(...Object.values(base));
 const d={...base,...api,S,X:()=>x,document:{activeElement:focus},conSchede:()=>new Promise(ok=>attese.push(ok)),giornoDi:id=>x.giorni.findIndex(g=>g.tappe.includes(id)),
  apri:id=>aperture.push(id),schedaAperta:()=>null,chiudi:async()=>{},fotoGrande:()=>'',credito:()=>'',quandoTesto:()=>'',chips:()=>'',testoScheda:()=>'',sezioni:()=>'',fontiScheda:()=>'',azioniScheda:()=>'',T:id=>({nome:id}),
  vaiAlGiorno:g=>azioni.push(['vai',g]),aggiungiGita:id=>azioni.push(['gita',id]),aggiungi:(g,id)=>azioni.push(['aggiungi',g,id]),apriAggiungi:val=>azioni.push(['indietro',val])};
 const apiScheda=new Function(...Object.keys(d),'let daDove=null, richiestaScheda=0;'+codice+';return {apriScheda,schedaFuori,chiudiSchede};')(...Object.values(d));
 return {...api,...apiScheda,S,f,attese,aperture,azioni,timer,get x(){return x;},cambia(){x={...structuredClone(x),id:'secondo'};},finisci:()=>timer.splice(0).forEach(fn=>fn()),clic:k=>f.onclick({target:{closest:sel=>sel.includes('indietro')?null:{dataset:k}}})};
}
test('schede: apertura normale del giorno corrente dopo il caricamento',async()=>{
 const e=ambiente(),p=e.apriScheda('a');e.attese[0]();await p;assert.deepEqual(e.aperture,['a']);
});
test('schede: fra richieste concorrenti prevale l’ultima scelta',async()=>{
 for(const ordine of [[0,1],[1,0]]){const e=ambiente(),a=e.apriScheda('a'),b=e.apriScheda('b');e.attese[ordine[0]]();e.attese[ordine[1]]();await Promise.all([a,b]);assert.deepEqual(e.aperture,['b']);}
});
test('schede: cambiare viaggio, giorno, oggetto del giorno, vista o foglio invalida il caricamento',async()=>{
 for(const cambia of [e=>e.cambia(),e=>{e.S.g=1;},e=>{e.x.giorni[0]={...e.x.giorni[0]};},e=>{e.S.p='d';},e=>e.foglio('Altro','')]){
  const e=ambiente(),p=e.apriScheda('a');cambia(e);e.attese[0]();await p;assert.deepEqual(e.aperture,[]);
 }
});
test('schede: chiudere tutte le schede annulla anche un’apertura ancora in attesa',async()=>{
 const e=ambiente(),p=e.apriScheda('a');await e.chiudiSchede();e.attese[0]();await p;assert.deepEqual(e.aperture,[]);
});
test('schede: la scheda esterna e quella del giorno condividono l’ultima richiesta',async()=>{
 const e=ambiente(),a=e.schedaFuori('fuori'),b=e.apriScheda('b');e.attese[1]();await b;e.attese[0]();await a;assert.deepEqual(e.aperture,['b']);assert.equal(e.f.open,false);
});
test('schede: passare alla scheda esterna non avvia un secondo caricamento',async()=>{
 const e=ambiente(),p=e.apriScheda('fuori');e.attese[0]();await p;assert.equal(e.attese.length,1);assert.equal(e.f.open,true);
});
test('schede: aggiunta normale dopo la chiusura al giorno mostrato',async()=>{
 const e=ambiente(),p=e.schedaFuori('fuori');e.attese[0]();await p;const q=e.clic({azione:'aggiungi-qui'});e.finisci();await q;assert.deepEqual(e.azioni,[['aggiungi',0,'fuori']]);
});
test('schede: cambiare giorno durante la chiusura non aggiunge al nuovo giorno',async()=>{
 const e=ambiente(),p=e.schedaFuori('fuori');e.attese[0]();await p;const q=e.clic({azione:'aggiungi-qui'});e.S.g=1;e.finisci();await q;assert.deepEqual(e.azioni,[]);
});
test('schede: sostituire il foglio durante la chiusura annulla l’azione precedente',async()=>{
 const e=ambiente(),p=e.schedaFuori('fuori');e.attese[0]();await p;const q=e.clic({azione:'gita-qui'});e.foglio('Altro','');e.finisci();await q;assert.deepEqual(e.azioni,[]);assert.equal(e.f.open,true);
});
test('schede: doppio tocco produce una sola aggiunta',async()=>{
 const e=ambiente(),p=e.schedaFuori('fuori');e.attese[0]();await p;const a=e.clic({azione:'aggiungi-qui'}),b=e.clic({azione:'aggiungi-qui'});e.finisci();await Promise.all([a,b]);assert.deepEqual(e.azioni,[['aggiungi',0,'fuori']]);
});
test('schede: viaggio sostituito durante la chiusura annulla anche Vai al giorno',async()=>{
 const e=ambiente(),p=e.schedaFuori('fuori');e.attese[0]();await p;const q=e.clic({f:'vai',g:'1'});e.cambia();e.finisci();await q;assert.deepEqual(e.azioni,[]);
});
