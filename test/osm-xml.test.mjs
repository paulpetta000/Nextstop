import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {loadTiles} from '../scripts/mappa/osm.mjs';
const nodi='<node id="1" lat="40.8" lon="14.2"/><node id="2" lat="40.81" lon="14.21"/>';
const via='<way id="3"><nd ref="1"/><nd ref="2"/><tag k="highway" v="residential"/></way>';
function cartella(t,file) {
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'nextstop-xml-'));
 t.after(()=>{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});});
 file.forEach((s,i)=>fs.writeFileSync(path.join(dir,i+'.xml'),s));return dir;
}
const xml=s=>'<osm version="0.6">'+s+'</osm>';
test('OSM XML: un riquadro troncato o una risposta di errore non produce una mappa parziale',t=>{
 for(const s of [xml(nodi+via).slice(0,-6),'<html>Errore</html>',xml(nodi+'<way id="3"><nd ref="1"/>')])assert.throws(()=>loadTiles(cartella(t,[s])),/OSM|XML/i);
});
test('OSM XML: coordinate mancanti, vuote e fuori intervallo sono rifiutate',t=>{
 for(const attributi of ['lon="14.2"','lat="" lon="14.2"','lat="91" lon="14.2"','lat="NaN" lon="14.2"'])assert.throws(()=>loadTiles(cartella(t,[xml('<node id="1" '+attributi+'/>')])),/OSM|XML/i);
});
test('OSM XML: dati discordanti dello stesso nodo o della stessa via non dipendono dal primo file',t=>{
 for(const s of [xml('<node id="1" lat="40.9" lon="14.2"/>'),xml(nodi+'<way id="3"><nd ref="2"/><nd ref="1"/></way>')])assert.throws(()=>loadTiles(cartella(t,[xml(nodi+via),s])),/OSM|XML/i);
});
test('OSM XML: un nodo ripetuto coerente conserva i tag arrivati nel secondo riquadro',t=>{
 const d=loadTiles(cartella(t,[xml(nodi+via),xml('<node id="1" lat="40.8" lon="14.2"><tag k="name" v="Centro"/></node>')]));assert.equal(d.nodes.get('1').tags.name,'Centro');
});
test('OSM XML: ordine degli attributi, apici ed entità XML conservano nomi e riferimenti',t=>{
 const s="<node lon='14.2' id='1' lat='40.8'><tag v='Caff&#233; &amp; &lt;mare&gt;' k='name'/></node><node id='2' lat='40.81' lon='14.21'/><way id='3'><nd ref='1'/><nd ref='2'/></way>";
 const d=loadTiles(cartella(t,[xml(s)]));assert.equal(d.nodes.get('1').tags.name,'Caffé & <mare>');assert.deepEqual(d.ways.get('3').nds,['1','2']);
});
test('OSM XML: i nodi mancanti delle vie sono rifiutati dopo aver unito tutti i riquadri',t=>{
 assert.throws(()=>loadTiles(cartella(t,[xml(nodi+'<way id="3"><nd ref="1"/><nd ref="99"/></way>')])),/OSM|XML/i);
 const d=loadTiles(cartella(t,[xml('<node id="1" lat="0" lon="0"/>'+via),xml('<node id="2" lat="0" lon="1"/>')]));assert.equal(d.ways.size,1);
});
test('OSM XML: geometrie nei commenti non vengono lette come dati',t=>{
 const d=loadTiles(cartella(t,[xml(nodi+'<!-- <node id="99" lat="0" lon="0"/> -->'+via)]));assert.equal(d.nodes.size,2);
});
test('OSM XML: nessun file è un errore, un riquadro vuoto valido è ammesso',t=>{
 assert.throws(()=>loadTiles(cartella(t,[])),/OSM|XML/i);assert.equal(loadTiles(cartella(t,[xml('<bounds minlat="0" minlon="0" maxlat="1" maxlon="1"/>')])).nodes.size,0);
});
test('OSM XML: le relazioni possono riferire membri esterni al riquadro',t=>{
 const d=loadTiles(cartella(t,[xml(nodi+'<relation id="4"><member type="way" ref="999" role="outer"/><tag k="type" v="multipolygon"/></relation>')]));assert.equal(d.rels.get('4').members[0].ref,'999');
});

test('OSM XML: attributi senza separatore e byte UTF-8 corrotti vengono rifiutati',t=>{
 for(const s of [xml('<node id="1"lat="0" lon="0"/>'),Buffer.concat([Buffer.from('<osm><node id="1" lat="0" lon="0"><tag k="name" v="'),Buffer.from([0xff]),Buffer.from('"/></node></osm>')])])assert.throws(()=>loadTiles(cartella(t,[s])),/OSM|XML/i);
});
test('OSM XML: entità sono decodificate una volta e nomi speciali non cambiano il prototipo',t=>{
 const d=loadTiles(cartella(t,[xml('<node id="9007199254740993" lat="0" lon="0"><tag k="__proto__" v="test"/><tag k="name" v="&amp;lt; &#x1F30A;"/></node>')]));
 const tags=d.nodes.get('9007199254740993').tags;assert.equal(Object.hasOwn(tags,'__proto__'),true);assert.equal(tags.__proto__,'test');assert.equal(tags.name,'&lt; 🌊');assert.equal(Object.getPrototypeOf(tags),Object.prototype);
});

test('OSM XML: molti elementi aperti senza chiusura sono rifiutati senza ricerca quadratica',()=>{
 const codice='import {leggiXml} from '+JSON.stringify(new URL('../scripts/mappa/osm.mjs',import.meta.url).href)+';try{leggiXml(\'<osm>\'+\'<node id="1" lat="0" lon="0">\'.repeat(20000)+\'</osm>\');process.exit(2);}catch{process.exit(0);}';
 const child=spawnSync(process.execPath,['--input-type=module','-e',codice],{timeout:2000,encoding:'utf8'});assert.equal(child.status,0,child.error?.message||child.stderr);
});
