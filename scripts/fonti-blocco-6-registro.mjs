// Revisione delle relazioni dichiarate, non nuova lettura degli editori.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import yaml from 'js-yaml';
import {registroFonti} from '../src/lib/fonti-registro.mjs';
import {fontiPerPagina, fonteDiNextstop} from '../src/lib/fonti-nextstop.mjs';
const read=f=>yaml.load(fs.readFileSync(f,'utf8'));
const raw=read('src/data/fonti.yaml'),registry=new Map(raw.map(s=>[s.id,s]));
const all=registroFonti(raw),facts=read('src/data/fatti.yaml'),tappe=read('src/data/tappe.yaml'),locali=read('src/data/locali.yaml');
const texts=Object.fromEntries(['itinerari','tappe','locali','dove-mangiare'].map(s=>[s,read(`src/testi/${s}.yaml`)]));
const relations=all.map(s=>{
 const schede=facts.filter(f=>f.fonti.includes(s.id)).map(f=>f.id);
 const durate=tappe.filter(t=>t.durataFonte===s.id).map(t=>t.id);
 const refs=Object.entries(texts).flatMap(([file,blocks])=>Object.entries(blocks).filter(([,b])=>(b.fonti||[]).includes(s.id)).map(([id])=>`${file}.yaml#${id}`));
 assert.deepEqual([...s.schede].sort(),schede.sort(),s.id+' schede');
 assert.deepEqual([...s.durate].sort(),durate.sort(),s.id+' durate');
 assert.deepEqual([...s.testi].sort(),refs.sort(),s.id+' testi');
 assert.ok(schede.length||durate.length||refs.length,s.id+' senza relazione');
 return {id:s.id,descrizione:s.descrizione,luoghi:s.luoghi,schede,durate,testi:refs,avviso:s.avviso,lettura:s.lettura};
});
const resolved=facts.map(f=>({...f,fontiRisolte:f.fonti.map(id=>registry.get(id))}));
const pages=[];
for(const [name,files,objects] of [['itinerari',['itinerari','tappe','locali'],[...tappe,...locali]],['dove-mangiare',['dove-mangiare','locali'],locali]]){
 const blocks=files.flatMap(f=>Object.values(texts[f]));
 const ids=new Set([...blocks.flatMap(b=>b.usa||[]),...objects.flatMap(t=>[t.orari,t.prezzi,t.viaggio,t.perche,t.rinomatoPer].filter(Boolean))]);
 const expected=fontiPerPagina(resolved.filter(f=>ids.has(f.id)),[...blocks.flatMap(b=>(b.fonti||[]).map(id=>registry.get(id))),...(name==='itinerari'?[registry.get('osm')]:[])],name==='itinerari'?tappe.map(t=>({data:{durataFonte:t.durataFonte?{id:t.durataFonte}:undefined}})):[],registry).map(s=>s.id).sort();
 const html=fs.readFileSync(`dist/napoli/${name}/index.html`,'utf8');
 const actual=[...html.matchAll(/data-source-id="([^"]+)"/g)].map(m=>m[1]).sort();
 assert.deepEqual(actual,expected,name+' selezione del pannello');assert.equal(new Set(actual).size,actual.length);assert.ok(actual.every(fonteDiNextstop));
 pages.push({name,count:actual.length,ids:actual});
}
const photos=read('src/data/foto.yaml');
const credits=fs.readFileSync('dist/note-legali/index.html','utf8');
for(const photo of photos){assert.ok(credits.includes(`data-photo-id="${photo.id}"`));assert.ok(credits.includes(photo.fonte.replaceAll('&','&amp;')));}
for(const name of ['Barlow','Archivo','IBM-Plex-Mono','Bodoni-Moda'])assert.ok(credits.includes(`/fonts/LICENSE-${name}.txt`));
assert.ok(credits.includes('napoliavela.guida@gmail.com'));assert.ok(!/href="https?:[^" ]*napoliavela/i.test(credits));
const direct=all.filter(s=>s.urlDocumento).map(s=>({id:s.id,urlDocumento:s.urlDocumento,urlRegistrato:s.url,formato:s.formato,lettura:s.lettura,avviso:s.avviso}));
const out={documents:all.length,pages,relations,direct,photos:photos.length,limits:'Relazioni e crediti verificati sui dati locali. Nessuna nuova lettura web o data di controllo.'};
fs.writeFileSync('docs/storico/fonti-blocco-6-verifiche/registro.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({documents:all.length,pages:pages.map(({name,count})=>({name,count})),durate:relations.filter(s=>s.durate.length).length,direct,photos:photos.length},null,2));
