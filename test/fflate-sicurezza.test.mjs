import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const f=require('fflate');
const cwd=fileURLToPath(new URL('..',import.meta.url));

// ZIP64 piccolo e fittizio: nessuna estrazione su disco. Senza extra field 0x0001
// la versione vulnerabile resta nel ciclo; ogni prova gira in un figlio con timeout.
function zip64(extraValido=false){
 const local=Buffer.alloc(31);local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(1,26);local[30]=120;
 const central=Buffer.alloc(47+(extraValido?28:0));central.writeUInt32LE(0x02014b50,0);
 central.writeUInt32LE(0xffffffff,20);central.writeUInt16LE(1,28);central.writeUInt16LE(extraValido?28:0,30);central[46]=120;
 if(extraValido){central.writeUInt16LE(1,47);central.writeUInt16LE(24,49);}
 const end64=Buffer.alloc(56);end64.writeUInt32LE(0x06064b50,0);end64.writeUInt32LE(44,4);
 end64.writeUInt32LE(1,32);end64.writeUInt32LE(central.length,40);end64.writeUInt32LE(local.length,48);
 const locator=Buffer.alloc(20);locator.writeUInt32LE(0x07064b50,0);locator.writeUInt32LE(local.length+central.length,8);locator.writeUInt32LE(1,16);
 const end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(1,8);end.writeUInt16LE(1,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(0xffffffff,16);
 return Buffer.concat([local,central,end64,locator,end]);
}

for(const [name,load] of [['CommonJS',"require('fflate')"],['ESM',"await import('fflate')"],['browser',"require('fflate/browser')"]]){
 test(`fflate ${name}: ZIP64 senza extra field rifiutato senza bloccarsi`,()=>{
  const code=`import {createRequire} from 'node:module';const require=createRequire(import.meta.url);const f=${load};try{f.unzipSync(Uint8Array.from(${JSON.stringify([...zip64()])}));process.exit(2);}catch(e){process.exit(e.code===13?0:3);}`;
  const child=spawnSync(process.execPath,['--input-type=module','-e',code],{cwd,encoding:'utf8',timeout:2000});
  assert.equal(child.status,0,child.error?.message||child.stderr||'ZIP64 malformato accettato');
 });
}

test('fflate: ZIP64 valido con file vuoto resta leggibile',()=>{
 const out=f.unzipSync(zip64(true));assert.deepEqual(Object.keys(out),['x']);assert.equal(out.x.length,0);
});

test('fflate: ZIP ordinario conserva testi UTF-8 e file vuoti',()=>{
 const text=f.strToU8('Napoli: vicoli, caffè e città.');
 const out=f.unzipSync(f.zipSync({'testi/napoli.txt':text,'vuoto.txt':new Uint8Array()}));
 assert.equal(f.strFromU8(out['testi/napoli.txt']),'Napoli: vicoli, caffè e città.');assert.equal(out['vuoto.txt'].length,0);
});

test('fflate: inflate con buffer destinazione conserva il contratto usato dai font',()=>{
 const bytes=f.strToU8('font di prova '.repeat(30));const out=new Uint8Array(bytes.length);
 assert.deepEqual(f.inflateSync(f.deflateSync(bytes),out),bytes);assert.deepEqual(out,bytes);
});

test('fflate: compressione asincrona nei worker e lettura sincrona compatibili',async()=>{
 const bytes=f.strToU8('anteprima di viaggio '.repeat(20));
 const compressed=await new Promise((resolve,reject)=>f.gzip(bytes,(error,data)=>error?reject(error):resolve(data)));
 assert.deepEqual(f.gunzipSync(compressed),bytes);
});
