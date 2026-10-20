import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as wt from 'node:worker_threads';
const messaggio=(w,tipo)=>new Promise((resolve,reject)=>{const leggi=m=>{if(m.tipo===tipo){w.off('message',leggi);w.off('error',reject);resolve(m);}};w.on('message',leggi);w.once('error',reject);});

test('parallelismo reale con mutex atomico: due worker con lo stesso archivio non dichiarano due successi incompatibili', {timeout:10000}, async t=>{
 for(let giro=0;giro<4;giro++){
  const memoria=new SharedArrayBuffer(65536), h=new Int32Array(memoria,0,4), bytes=new Uint8Array(memoria,16);
  const raw=JSON.stringify({v:1,attivo:'viaggio0',elenco:[{id:'viaggio0',nome:'Base',creato:1,modificato:1,giorni:[{tappe:['duomo'],inizio:570,fine:1140}]}]});
  const b=new TextEncoder().encode(raw);bytes.set(b);h[1]=b.length;
  const workers=['A','B'].map(nome=>new wt.Worker(new URL('./fixtures/memoria-worker.mjs',import.meta.url),{workerData:{memoria,nome:nome+giro}}));
  t.after(()=>Promise.all(workers.map(w=>w.terminate())));
  await Promise.all(workers.map(w=>messaggio(w,'pronto')));
  const esiti=workers.map(w=>messaggio(w,'esito'));workers.forEach(w=>w.postMessage('via'));
  const ris=await Promise.all(esiti), vincitore=ris.find(r=>r.ok), altro=ris.find(r=>!r.ok);
  assert.equal(ris.filter(r=>r.ok).length,1);assert.equal(altro.stato,'conflitto');
  const letto=JSON.parse(new TextDecoder().decode(bytes.slice(0,h[1]))).elenco[0];
  assert.equal(letto.nome,vincitore.locale.nome);assert.notEqual(altro.locale.nome,letto.nome);
  assert.deepEqual(letto.giorni[0].fatte,['duomo']);assert.deepEqual(altro.locale.timbri,{duomo:1234});
 }
});
