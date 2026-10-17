import {test} from 'node:test';
import assert from 'node:assert/strict';
import {attendiStile} from '../src/scripts/itinerari/stile.mjs';
class Link extends EventTarget {sheet=null;media='print';dataset={};}
test('stile: se già caricato attiva il foglio prima di avviare il compositore',async()=>{const l=new Link();l.sheet={};await attendiStile(l);assert.equal(l.media,'all');});
test('stile: un caricamento lento non avvia il compositore senza stile',async()=>{const l=new Link();let pronto=false;const p=attendiStile(l).then(()=>pronto=true);await Promise.resolve();assert.equal(pronto,false);l.sheet={};l.dispatchEvent(new Event('load'));await p;assert.equal(pronto,true);assert.equal(l.media,'all');});
test('stile: riconosce un errore già avvenuto senza restare in attesa',async()=>{const l=new Link();l.dataset.errore='si';await assert.rejects(attendiStile(l),/stile/i);});
test('stile: segnala un errore durante il caricamento',async()=>{const l=new Link();const p=attendiStile(l);l.dispatchEvent(new Event('error'));await assert.rejects(p,/stile/i);assert.equal(l.media,'print');});
test('stile: tollera una pagina senza collegamento dedicato',async()=>{await attendiStile(null);});
