import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js',import.meta.url),'utf8');
const state=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/stato.js',import.meta.url),'utf8');
const definition=state.match(/^export const aPiedi = (.+);$/m);
assert.ok(definition);
const aPiedi=new Function('return ('+definition[1]+');')();
const start=source.indexOf('const NOMI_FASE ='),end=source.indexOf('// ---------- cambiare giorno',start);
assert.ok(start>=0&&end>start);
const tempo=new Function('aPiedi','durata','durataLunga','ora','esc','ic','nessuno',
  source.slice(start,end).replace('export function tempo','function tempo')+';return tempo;')(
  aPiedi,m=>`${m} min`,m=>`${m} minuti`,m=>String(m),s=>s,()=>'',(m,p='nessuno')=>m?`${m} min`:p);
function giornata(mezzi) {
 return {inizio:600,fine:690,fineScelta:1140,visite:30,spostamenti:60,pauseMin:0,margineMin:0,resta:450,totale:90,
  fasi:[{tipo:'cammino',da:600,a:660},{tipo:'visita',da:660,a:690}],voci:[{tipo:'tratto',mezzi},{tipo:'visita'}]};
}
for(const mezzo of ['L6','B151'])test(`riepilogo ${mezzo}: include i mezzi fra gli spostamenti anche nel testo accessibile`,()=>{
 const g=giornata([mezzo]),prima=structuredClone(g),html=tempo(g);
 assert.match(html,/>Spostamenti<\/dt>/);
 assert.match(html,/aria-label="[^"]*spostamenti 60 min/);
 assert.doesNotMatch(html,/>A piedi<\/dt>/);
 assert.deepEqual(g,prima,'il cambio di etichetta non cambia tempi o dati');
});
test('riepilogo solo pedonale: mantiene A piedi nel testo visibile e accessibile',()=>{
 const html=tempo(giornata([]));
 assert.match(html,/>A piedi<\/dt>/);
 assert.match(html,/aria-label="[^"]*a piedi 60 min/);
 assert.doesNotMatch(html,/>Spostamenti<\/dt>/);
});
