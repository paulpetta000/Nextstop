import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import serviceWorker from '../integrations/service-worker.mjs';
import { riferimentoDati } from '../src/lib/itinerari/riferimento-dati.mjs';
const rawOffline=n=>JSON.parse(fs.readFileSync(new URL('../src/data/'+n,import.meta.url),'utf8'));
const TO=rawOffline('tempi-tappe.json'),MO=rawOffline('mappa.json'),DO=rawOffline('percorsi-tappe.json'),AO=rawOffline('percorsi-alternativi.json');
const RO=riferimentoDati(TO,{w:MO.w,h:MO.h,box:MO.box});
const pubblicatiOffline={percorsi:{riferimento:RO,punti:DO.punti,scenari:DO.scenari},alternativi:{riferimento:RO,firma:AO.firma,senza:AO.senza,candidati:AO.candidati}};
const origin='https://nextstop.test';
function ambiente(fetcher=async()=>{throw Error('offline');}){
  const stores=new Map(),handlers={};
  const key=x=>new URL(typeof x==='string'?x:x.url,origin).href;
  const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());
  const s=stores.get(name);return {async match(req){return s.get(key(req))?.clone();},async put(req,res){s.set(key(req),res.clone());},async addAll(){}};},async match(req){for(const s of stores.values())if(s.has(key(req)))return s.get(key(req)).clone();},async keys(){return [...stores.keys()];},async delete(name){return stores.delete(name);}};
  const self={addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}};
  const code=fs.readFileSync(new URL('../integrations/sw-template.js',import.meta.url),'utf8').replace('__VERSION__','prova').replace('__DATA_VERSION__','prova').replace('__PRECACHE__',JSON.stringify(['/napoli/itinerari/scenari.json']));
  vm.runInNewContext(code,{self,caches,fetch:fetcher,URL,Response,location:{origin},setTimeout,clearTimeout});
  return {caches,handlers,async put(cache,url,text){await(await caches.open(cache)).put(url,new Response(text));},async request(url,mode='cors'){let response;
  const waits=[];handlers.fetch({request:{url:new URL(url,origin).href,method:'GET',mode},respondWith:p=>response=p,waitUntil:p=>waits.push(p)});return {response:await response,waits};}};
}

test('offline: la precache nuova prevale sui dati della vecchia risorse-v1',async()=>{const a=ambiente();
  await a.put('pagine-prova','/napoli/itinerari/scenari.json','NUOVO');
  await a.put('risorse-v1','/napoli/itinerari/scenari.json','VECCHIO');
  const r=await a.request('/napoli/itinerari/scenari.json');
  assert.equal(await r.response.text(),'NUOVO');
  await Promise.all(r.waits);});
test('offline: i dati dinamici di una vecchia versione non vengono usati per la nuova',async()=>{const a=ambiente();
  await a.put('risorse-v1','/napoli/itinerari/strade/0_0.json','VECCHIO');
  const r=await a.request('/napoli/itinerari/strade/0_0.json');
  assert.equal(r.response?.status,0);
  await Promise.all(r.waits);});
test('offline: mantiene i dati dinamici della versione corrente',async()=>{const a=ambiente();
  await a.put('dati-prova','/napoli/itinerari/strade/0_0.json','CORRENTE');
  const r=await a.request('/napoli/itinerari/strade/0_0.json');
  assert.equal(await r.response.text(),'CORRENTE');
  await Promise.all(r.waits);});
test('cache: waitUntil tiene attivo l’aggiornamento dei dati anche dopo la risposta salvata',async()=>{let release;
  const gate=new Promise(r=>release=r);
  const a=ambiente(()=>gate);
  await a.put('dati-prova','/napoli/itinerari/strade/0_0.json','SALVATO');
  await a.put('risorse-v1','/napoli/itinerari/strade/0_0.json','SALVATO');try{const r=await a.request('/napoli/itinerari/strade/0_0.json');
  assert.equal(await r.response.text(),'SALVATO');
  assert.ok(r.waits.length>0,'L’aggiornamento deve essere legato alla durata del fetch event');release(new Response('AGGIORNATO'));
  await Promise.all(r.waits);
  assert.equal(await(await(await a.caches.open('dati-prova')).match('/napoli/itinerari/strade/0_0.json')).text(),'AGGIORNATO');}finally{release(new Response('fine'));}});
test('cache: attivazione elimina soltanto pagine/dati superati, conserva foto e risorse immutabili',async()=>{const a=ambiente();for(const c of ['pagine-vecchia','pagine-prova','dati-vecchia','dati-prova','risorse-v1'])await a.caches.open(c);
  const waits=[];a.handlers.activate({waitUntil:p=>waits.push(p)});
  await Promise.all(waits);
  assert.deepEqual(await a.caches.keys(),['pagine-prova','dati-prova','risorse-v1']);});
test('offline: le immagini già viste rimangono disponibili senza rete',async()=>{const a=ambiente();
  await a.put('risorse-v1','/_astro/foto.hash.webp','FOTO');
  const r=await a.request('/_astro/foto.hash.webp');
  assert.equal(await r.response.text(),'FOTO');});

test('build offline: da sola home precarica anche script e dipendenze dei filtri dei locali',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'nextstop-sw-'));
  try{
    const files={
      'index.html':'<html>home</html>', 'napoli/index.html':'napoli', 'offline/index.html':'offline',
      'napoli/itinerari/index.html':'<link rel="stylesheet" href="/_astro/compositore.hash.css" media="print"><noscript><link rel="stylesheet" href="/_astro/compositore.hash.css"></noscript><script type="module" src="/_astro/it.js"></script>',
      'napoli/dove-mangiare/index.html':'<script type="module" src="/_astro/dm.js"></script>',
      '_astro/compositore.hash.css':'.cmp{color:navy}', '_astro/it.js':'export const a=1;', '_astro/dm.js':'import "./filtro.js";', '_astro/filtro.js':'export const filtro=1;',
      'fonts/prova.woff2':'font', 'napoli/itinerari/schede/index.html':'schede',
      'napoli/itinerari/strade/indice.json':'{}', 'napoli/itinerari/mappa.json':'{}', 'napoli/itinerari/scenari.json':'{}', 'napoli/itinerari/percorsi.json':JSON.stringify(pubblicatiOffline.percorsi), 'napoli/itinerari/percorsi-alternativi.json':JSON.stringify(pubblicatiOffline.alternativi), 'napoli/itinerari/partenze.json':'{}'
    };
    for(const [file,data] of Object.entries(files)){const f=path.join(root,file);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,data);}
    serviceWorker().hooks['astro:build:done']({dir:pathToFileURL(root+path.sep),logger:{warn:()=>{},info:()=>{}}});
    const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  const core=JSON.parse(sw.match(/const CORE = (.*);/)[1]);
    assert.equal(core.filter(u=>u==='/_astro/compositore.hash.css').length,1,'Il foglio stile completo deve esserci anche dopo la sola home, una sola volta');
    assert.ok(core.includes('/_astro/dm.js'));
  assert.ok(core.includes('/_astro/filtro.js'));
    const versione=sw.match(/const DATA_VERSION = '(.*?)'/)[1];
    const build=()=>{serviceWorker().hooks['astro:build:done']({dir:pathToFileURL(root+path.sep),logger:{warn:()=>{},info:()=>{}}});return fs.readFileSync(path.join(root,'sw.js'),'utf8');};
    fs.writeFileSync(path.join(root,'index.html'),'home nuova, stessi dati');
    const grafica=build();
    assert.equal(grafica.match(/const DATA_VERSION = '(.*?)'/)[1],versione,'La sola grafica conserva la cache dei dati');
    assert.notEqual(grafica.match(/const VERSION = '(.*?)'/)[1],sw.match(/const VERSION = '(.*?)'/)[1]);
    fs.writeFileSync(path.join(root,'napoli/itinerari/strade/0_0.json'),'{"strade":"nuove"}');
    assert.notEqual(build().match(/const DATA_VERSION = '(.*?)'/)[1],versione,'Anche un cambiamento a un pezzo dinamico rinnova la cache');
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('cache piena: una risposta valida della rete resta disponibile anche se non si può salvarla',async()=>{
  for(const [url,mode] of [['/_astro/nuovo.js','cors'],['/napoli/itinerari/strade/0_0.json','cors'],['/napoli/','navigate']]){
    const a=ambiente(async()=>new Response('RETE'));
    const open=a.caches.open;
    a.caches.open=async name=>{const c=await open(name);c.put=async()=>{throw Error('Quota esaurita');};return c;};
    const r=await a.request(url,mode);
    assert.equal(await r.response?.text(),'RETE');
    await Promise.all(r.waits);
  }
});

test('navigazione: un errore temporaneo del server usa la pagina già salvata', async () => {
  const a = ambiente(async () => new Response('Server non disponibile', { status: 503 }));
  await a.put('pagine-prova', '/napoli/', 'PAGINA SALVATA');
  const r = await a.request('/napoli/', 'navigate');
  assert.equal(r.response.status, 200);
  assert.equal(await r.response.text(), 'PAGINA SALVATA');
  assert.equal(await (await (await a.caches.open('pagine-prova')).match('/napoli/')).text(), 'PAGINA SALVATA');
});

test('navigazione: un vero 404 resta 404 e un 503 senza copia resta un errore del server', async () => {
  for (const status of [404, 503]) {
    const a = ambiente(async () => new Response('ERRORE', { status }));
    if (status === 404) await a.put('pagine-prova', '/napoli/', 'VECCHIA PAGINA');
    const r = await a.request('/napoli/', 'navigate');
    assert.equal(r.response.status, status);
    assert.equal(await r.response.text(), 'ERRORE');
  }
});

test('cache indisponibile: la rete continua a funzionare per pagine, script e dati', async () => {
  for (const [url, mode] of [['/napoli/', 'navigate'], ['/_astro/nuovo.js', 'cors'], ['/napoli/itinerari/strade/0_0.json', 'cors']]) {
    const a = ambiente(async () => new Response('RETE'));
    a.caches.open = async () => { throw Error('Memoria non disponibile'); };
    const r = await a.request(url, mode);
    assert.equal(await r.response.text(), 'RETE');
    await Promise.all(r.waits);
  }
});

test('lettura cache fallita: una copia illeggibile non blocca una risposta valida della rete', async () => {
  const a = ambiente(async () => new Response('RETE'));
  const open = a.caches.open;
  a.caches.open = async name => { const c = await open(name); c.match = async () => { throw Error('Lettura fallita'); }; return c; };
  const r = await a.request('/_astro/nuovo.js');
  assert.equal(await r.response.text(), 'RETE');
});
