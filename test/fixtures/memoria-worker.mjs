// Prova locale con dati fittizi: nessun browser, file personale o richiesta di rete.
import * as wt from 'node:worker_threads';
import { creaSalvataggio, leggiConRiferimento } from '../../src/scripts/itinerari/memoria.ts';
const h=new Int32Array(wt.workerData.memoria,0,4), bytes=new Uint8Array(wt.workerData.memoria,16);
const leggi=fn=>{while(Atomics.compareExchange(h,0,0,1)!==0)Atomics.wait(h,0,1);try{return fn();}finally{Atomics.store(h,0,0);Atomics.notify(h,0);}};
const locale=new Map();
Object.defineProperty(globalThis,'localStorage',{value:{
 getItem:k=>k==='itinerari-v1'?leggi(()=>new TextDecoder().decode(bytes.slice(0,h[1]))):locale.get(k)??null,
 setItem:(k,v)=>{if(k!=='itinerari-v1'){locale.set(k,v);return;}leggi(()=>{const b=new TextEncoder().encode(v);bytes.set(b);h[1]=b.length;});}
}});
// Adattatore della semantica Web Locks per la prova: i worker sono reali, il mutex
// usa memoria atomica. Il LockManager sperimentale di Node non è quello del browser.
const locks={request:async (nome,opzioni,fn)=>{
 if(nome!=='itinerari-v1'||opzioni.mode!=='exclusive')throw Error('Lock inatteso');
 while(Atomics.compareExchange(h,2,0,1)!==0)Atomics.wait(h,2,1);
 try { if(opzioni.signal?.aborted)throw Error('Attesa annullata');return fn({name:nome,mode:'exclusive'}); }
 finally {Atomics.store(h,2,0);Atomics.notify(h,2);}
}};
Object.defineProperty(globalThis,'navigator',{value:{locks}});
const C={tappe:[{id:'duomo',tipo:'citta'}]}, fonte=leggiConRiferimento(C), salva=creaSalvataggio(fonte);
fonte.archivio.elenco[0].nome=wt.workerData.nome;
fonte.archivio.elenco[0].giorni[0].fatte=['duomo']; fonte.archivio.elenco[0].timbri={duomo:1234};
wt.parentPort.once('message',async()=>{
 const ok=await salva(fonte.archivio);
 wt.parentPort.postMessage({tipo:'esito',ok,stato:salva.stato(),locale:fonte.archivio.elenco[0]});
 wt.parentPort.close();
});
wt.parentPort.postMessage({tipo:'pronto'});
