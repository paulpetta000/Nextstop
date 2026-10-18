import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {leggiXml} from '../scripts/mappa/osm.mjs';
import {scriviFile} from '../scripts/scrivi-file.mjs';
const source=fs.readFileSync(new URL('../scripts/mappa/scarica.mjs',import.meta.url),'utf8');
const da=source.indexOf('const dir ='),a=source.indexOf('for (let s = BOX.s;',da);assert.ok(da>0&&a>da);
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const prepara=new AsyncFunction('fs','path','process','BOX','execFileSync','leggiXml','scriviFile','pausa','console',source.slice(da,a)+';return scarica;');
const valido='<osm version="0.6"><node id="1" lat="0" lon="0"/></osm>';
async function ambiente(t,risposte,{guastoScrittura=false,pausaFinta}={}) {
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'nextstop-download-mappa-'));
 t.after(()=>{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});});
 const richieste=[],comandi=[],pause=[];
 const exec=(nome,args)=>{
  comandi.push(nome);if(nome==='sleep')return Buffer.from('');assert.equal(nome,'curl');richieste.push(args);
  const r=risposte[Math.min(richieste.length-1,risposte.length-1)];assert.ok(r);
  fs.writeFileSync(args[args.indexOf('-o')+1],r.corpo??'errore');return Buffer.from(r.codice);
 };
 const io=guastoScrittura?new Proxy(fs,{get:(o,k)=>k==='writeFileSync'?(fd)=>{fs.writeFileSync(fd,'frammento');throw new Error('disco pieno fittizio');}:o[k]}):fs;
 const scarica=await prepara(fs,path,{argv:['node','script',dir]},null,exec,leggiXml,(f,b)=>scriviFile(f,b,io),async ms=>{pause.push(ms);if(pausaFinta)await pausaFinta(ms);},{log(){}});
 return {dir,richieste,comandi,pause,scarica,file:path.join(dir,'t_0_0_1_1.xml')};
}
test('download mappa: HTTP 200 con XML troncato viene scartato prima della cache',async t=>{
 const e=await ambiente(t,[{codice:'200',corpo:'<osm><node id="1"'},{codice:'200',corpo:valido}]);await e.scarica(0,0,1,1);
 assert.equal(e.richieste.length,2);assert.doesNotThrow(()=>leggiXml(fs.readFileSync(e.file)));assert.equal(fs.readdirSync(e.dir).length,1);
});
test('download mappa: cache non valida viene segnalata senza sovrascriverla',async t=>{
 const e=await ambiente(t,[]);fs.writeFileSync(e.file,'frammento');await assert.rejects(async()=>e.scarica(0,0,1,1),/OSM|XML|cache/i);
 assert.equal(fs.readFileSync(e.file,'utf8'),'frammento');assert.equal(e.richieste.length,0);
});
test('download mappa: errore del disco non lascia una cache tronca',async t=>{
 const e=await ambiente(t,[{codice:'200',corpo:valido}],{guastoScrittura:true});await assert.rejects(async()=>e.scarica(0,0,1,1),/disco pieno/);assert.deepEqual(fs.readdirSync(e.dir),[]);
});
test('download mappa: cache valida non viene scaricata di nuovo e le pause non richiedono programmi esterni',async t=>{
 const e=await ambiente(t,[{codice:'200',corpo:valido}]);await e.scarica(0,0,1,1);await e.scarica(0,0,1,1);assert.equal(e.richieste.length,1);assert.deepEqual(e.comandi,['curl']);
});
test('download mappa: errore HTTP ripetuto non lascia file o cartelle temporanee',async t=>{
 const e=await ambiente(t,[{codice:'503'}]);await assert.rejects(async()=>e.scarica(0,0,1,1),/Riquadro/);assert.equal(e.richieste.length,3);assert.deepEqual(fs.readdirSync(e.dir),[]);
});
test('download mappa: HTTP 400 conserva la suddivisione in quattro riquadri',async t=>{
 const e=await ambiente(t,[{codice:'400'},{codice:'200',corpo:valido}]);await e.scarica(0,0,1,1);assert.equal(e.richieste.length,5);assert.equal(fs.readdirSync(e.dir).filter(x=>x.endsWith('.xml')).length,4);assert.equal(fs.existsSync(e.file),false);
});

test('download mappa: la suddivisione attende ogni figlio prima di dichiararsi finita',async t=>{
 let riprendi,finito=false;
 const e=await ambiente(t,[{codice:'400'},{codice:'200',corpo:valido}],{pausaFinta:()=>new Promise(ok=>riprendi=ok)});
 const lavoro=e.scarica(0,0,1,1).then(()=>finito=true);await new Promise(r=>setImmediate(r));
 assert.equal(finito,false);assert.equal(e.richieste.length,2);
 for(let i=0;i<4;i++){assert.equal(finito,false);riprendi();await new Promise(r=>setImmediate(r));}
 await lavoro;assert.equal(finito,true);assert.equal(e.richieste.length,5);
});
