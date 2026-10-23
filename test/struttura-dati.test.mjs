import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { usciteItinerari, proiezione } from './fixtures/uscite-itinerari.mjs';
import { verificaGenerazione, marcaGenerazione } from '../src/lib/itinerari/generazione-dati.mjs';
import { riferimentoDati } from '../src/lib/itinerari/riferimento-dati.mjs';
const source = fs.readFileSync(new URL('../src/lib/itinerari/riferimento-napoli.ts',import.meta.url),'utf8');
const duranteBuild = new Function('T','M','P','L','D','A','verificaGenerazione','riferimentoDati',source.replace(/^import .*;\r?$/gm,'').replace('export const RIFERIMENTO =','return'));
const build = d => duranteBuild(d['tempi-tappe.json'],proiezione,d['partenze-bus.json'],d['linee-bus.json'],d['percorsi-tappe.json'],d['percorsi-alternativi.json'],verificaGenerazione,riferimentoDati);

test('struttura: un gruppo completo resta accettato senza cambiare gli ingressi', () => {
  const d=usciteItinerari(), prima=structuredClone(d); assert.doesNotThrow(()=>build(d)); assert.deepEqual(d,prima);
});
test('struttura: righe corte, mancanti e valori non numerici fermano la build', () => {
  for(const modifica of [s=>s.min.pop(),s=>s.piedi[0].pop(),s=>s.salita[0][1]=null,s=>s.min[0][1]=NaN,s=>s.min[0][1]=-1,s=>s.mezzi[0][1]=7]) {
    const d=usciteItinerari();modifica(d['tempi-tappe.json'].scenari.feriale);assert.throws(()=>build(d),/Dati generati/);
  }
});
test('struttura: firma valida non nasconde punti duplicati o in ordine diverso', () => {
  for(const modifica of [d=>d['tempi-tappe.json'].punti[1]='a',d=>d['percorsi-tappe.json'].punti.reverse()]) {
    const d=usciteItinerari();modifica(d);assert.throws(()=>build(d),/Dati generati/);
  }
});
test('struttura: riferimento a un candidato inesistente e disegno mancante fermano la build', () => {
  for(const modifica of [d=>d['tempi-tappe.json'].scenari.feriale.bus[0][1]=[9],d=>d['percorsi-alternativi.json'].candidati.pop(),d=>d['percorsi-tappe.json'].scenari.feriale[0].pop()]) {
    const d=usciteItinerari();modifica(d);assert.throws(()=>build(d),/Dati generati/);
  }
});
test('struttura: una corsa usata senza partenze o nomi delle fermate non viene pubblicata', () => {
  for(const modifica of [p=>p.tipi[0].viaggi={},p=>p.tipi[0].salite={},p=>delete p.fermate.salita,p=>p.giorni['20261018']=3]) {
    const d=usciteItinerari();modifica(d['partenze-bus.json']);assert.throws(()=>build(d),/Dati generati/);
  }
});
test('struttura: anche un gruppo marcato coerentemente può contenere una matrice incompleta', () => {
  const d=usciteItinerari();d['tempi-tappe.json'].scenari.sabato.senza.min[0].pop();
  assert.throws(()=>marcaGenerazione(d,proiezione),/Dati generati/);
});

test('struttura: un file delle linee assente e array con buchi non passano come completi', () => {
  for(const modifica of [d=>delete d['linee-bus.json'],d=>delete d['tempi-tappe.json'].punti[1],d=>delete d['percorsi-alternativi.json'].candidati[0]]) {
    const d=usciteItinerari();modifica(d);assert.throws(()=>build(d),/Dati generati/);
  }
});

test('struttura: giorno senza corse e candidato inutilizzato restano validi', () => {
  const d=usciteItinerari(), T=d['tempi-tappe.json'], P=d['partenze-bus.json'];
  T.candidati.push({seg:[2,'B1|salita|non-servita',3],m:100,mezzi:'B1'});
  d['percorsi-alternativi.json'].candidati.push('p.AACC');
  P.tipi.push({salite:{},viaggi:{}});P.giorni['20261019']=1;P.al='20261019';
  assert.doesNotThrow(()=>build(d));
});
