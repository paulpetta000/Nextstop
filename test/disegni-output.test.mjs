import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verificaStruttura} from '../src/lib/itinerari/struttura-dati.mjs';
import {usciteItinerari} from './fixtures/uscite-itinerari.mjs';
test('disegni output: un tratto compresso troncato viene rifiutato prima della build',()=>{
 for(const s of ['p.A','p.A!','p.'+'_'.repeat(100)+'A','p.']){const d=usciteItinerari();d['percorsi-tappe.json'].scenari.feriale[0][1]=s;assert.throws(()=>verificaStruttura(d),/disegn|percors/i);}
});
test('disegni output: candidati senza disegno e modi di trasporto sconosciuti vengono rifiutati',()=>{
 for(const s of ['', 'Binesistente.AA', '~p.AA']){const d=usciteItinerari();d['percorsi-alternativi.json'].candidati[0]=s;assert.throws(()=>verificaStruttura(d),/disegn|percorso/i);}
});
test('disegni output: una matrice vuota fuori diagonale non viene pubblicata come percorso',()=>{
 const d=usciteItinerari();d['percorsi-tappe.json'].scenari.feriale[0][1]='';assert.throws(()=>verificaStruttura(d),/disegn|percors/i);
});
test('disegni output: differenze zero, diagonali vuote e coordinate con segno restano ammesse',()=>{
 const d=usciteItinerari();d['percorsi-alternativi.json'].candidati[0]='p.AAUEDB~B1.CC';assert.doesNotThrow(()=>verificaStruttura(d));
});
