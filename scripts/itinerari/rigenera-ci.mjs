// Solo workflow manuale: nessuna rete, credenziale o scrittura remota.
// Gli ingressi pubblici sono conservati con impronte e licenze; l'esportazione
// nel log evita Action e pacchetti aggiuntivi per recuperare i risultati.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {FILE_GENERATI,verificaGenerazione} from '../../src/lib/itinerari/generazione-dati.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Usare solo il workflow manuale GitHub: nessuna esecuzione locale implicita');
if(!/^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA||''))throw Error('Commit del controllo non valido');
if(process.argv[2]==='--esporta') {
 const files=Object.fromEntries(FILE_GENERATI.map(name=>[name,JSON.parse(fs.readFileSync(path.join(root,'src/data',name),'utf8'))]));
 const m=JSON.parse(fs.readFileSync(path.join(root,'src/data/mappa.json'),'utf8'));
 verificaGenerazione(files,{w:m.w,h:m.h,box:m.box});
 const bytes=gzipSync(Buffer.from(JSON.stringify({commit:process.env.GITHUB_SHA,files})),{level:9});
 const encoded=bytes.toString('base64'),chunk=30000,total=Math.ceil(encoded.length/chunk);
 console.log(`NEXTSTOP_DATI_BEGIN ${total} ${bytes.length} ${hash(bytes)}`);
 for(let i=0;i<total;i++)console.log(`NEXTSTOP_DATI_CHUNK ${i} ${encoded.slice(i*chunk,(i+1)*chunk)}`);
 console.log('NEXTSTOP_DATI_END');
} else {
 if(process.argv.length>2)throw Error('Argomento non previsto');
 const input=path.join(root,'ricerca/2026-10-23-verifica-ascensori');
 const manifest=JSON.parse(fs.readFileSync(path.join(input,'manifest.json'),'utf8'));
 const dir=path.join(input,'ingressi');
 for(const name of ['osm.json','quote.json','anm-gtfs.zip']) {
  const entry=manifest.files.find(x=>x.name===name),bytes=fs.readFileSync(path.join(dir,name));
  if(!entry||bytes.length!==entry.bytes||hash(bytes)!==entry.sha256)throw Error('Ingresso diverso: '+name);
 }
 const run=spawnSync(process.execPath,['--no-liftoff',path.join(root,'scripts/itinerari/costruisci.mjs'),dir],{stdio:'inherit',env:{...process.env,QUOTE_RAGGIO:'2',QUOTE_PERCENTILE:'0.25',QUOTE_MEDIA:'50',PERCORSI:''}});
 if(run.status!==0)throw Error('Generazione non riuscita: '+run.status);
}
