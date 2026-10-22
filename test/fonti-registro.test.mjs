import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import yaml from 'js-yaml';
import { registroFonti, argomenti, ordinaFonti } from '../src/lib/fonti-registro.mjs';
import { fontiPerPagina } from '../src/lib/fonti-nextstop.mjs';
import { normalizza, equivalente } from '../src/scripts/fonti/ricerca.mjs';
const raw=yaml.load(fs.readFileSync(new URL('../src/data/fonti.yaml',import.meta.url),'utf8'));
const registro=registroFonti(raw);
test('registro completo: 208 documenti, metadati presenti, originali e date conservati',()=>{
 assert.equal(registro.length,208);
 assert.equal(new Set(registro.map(s=>s.id)).size,208);
 assert.equal(new Set(registro.map(s=>s.url)).size,208);
 for(const s of registro){
  const f=raw.find(f=>f.id===s.id);
  assert.equal(s.titolo,f.titolo);assert.equal(s.url,f.url);
  assert.equal(s.data,new Date(f.controllato).toISOString().slice(0,10));
  assert.ok(s.descrizione);assert.ok(argomenti.some(t=>t.id===s.categoria));
 }
 assert.deepEqual(argomenti.map(t=>registro.filter(s=>s.categoria===t.id).length),[96,78,19,1,14]);
});
test('originali diretti: PDF EAV e download ANM conservano formato e limiti di lettura',()=>{
 const eav=registro.find(s=>s.id==='tp-eav-l1-orario');
 assert.equal(eav.formato,'PDF');assert.match(eav.urlDocumento,/filename=.*pdf/);
 assert.equal(eav.lettura.label,'Lettura parziale');
 assert.match(eav.avviso,/tabella/);
 const anm=registro.find(s=>s.id==='tp-anm-gtfs');
 assert.equal(anm.formato,'ZIP');assert.match(anm.url,/\.zip$/);
});
test('una fonte condivisa resta unica anche con schede e durata della stessa pagina',()=>{
 const s={id:'tp-catacombe-sangennaro'};
 const fonti=fontiPerPagina([{fontiRisolte:[s,s]}],[s],[{data:{durataFonte:{id:s.id}}}],new Map([[s.id,s]]));
 assert.deepEqual(fonti,[s]);
 assert.throws(()=>fontiPerPagina([],[],[{data:{durataFonte:{id:'inesistente'}}}],new Map()),/non trovata/);
 const condivisa=registro.find(s=>s.id==='gri-pasta-patate-2024');
 assert.ok(condivisa.luoghi.some(l=>/Nennella/.test(l)));
 assert.ok(condivisa.luoghi.some(l=>/Gesù/.test(l)));
});
test('nel gruppo del locale le informazioni pratiche precedono la storia',()=>{
 const ids=ordinaFonti(registro.filter(s=>s.id.startsWith('lc-cantinella'))).map(s=>s.id);
 assert.ok(ids.indexOf('lc-cantinella-menu')<ids.indexOf('lc-cantinella-home'));
 assert.ok(ids.indexOf('lc-cantinella')<ids.indexOf('lc-cantinella-home'));
});
test('la ricerca approvata trova i biglietti di Sansevero anche con costo al singolare',()=>{
 const s=registro.find(s=>s.id==='tp-sansevero-orari');
 const corpus=equivalente(normalizza([s.titolo,s.descrizione,...s.parole].join(' ')));
 assert.ok(corpus.includes(equivalente(normalizza('costo'))));
});

test('ogni durata attribuita al gestore è riconoscibile nella descrizione del documento',()=>{
 const tappe=yaml.load(fs.readFileSync(new URL('../src/data/tappe.yaml',import.meta.url),'utf8'));
 for(const t of tappe.filter(t=>t.durataFonte)){
  const s=registro.find(s=>s.id===t.durataFonte);
  assert.ok(s.durate.includes(t.id),t.id);
  assert.match(s.descrizione,/durata|tempo/i,`${t.id}: la durata deve essere trovabile dal testo visibile`);
 }
});
