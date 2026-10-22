import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const testo = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js', import.meta.url), 'utf8');
const codice = testo.slice(testo.indexOf('export function foglio('), testo.indexOf('export async function chiudiFoglio')).replace(/^export /gm, '');

function ambiente() {
  const corpo = {}, documento = { activeElement: corpo };
  let chiudi, aperture = 0, opzioni;
  const f = { open: false, style: {}, classList: { remove() {} },
    set innerHTML(_) {
      // Rimuovere il comando che aveva il fuoco lo restituisce al body.
      documento.activeElement = corpo;
      chiudi = { focus(o) { documento.activeElement = this; opzioni = o; } };
    },
    showModal() { this.open = true; aperture++; chiudi.focus(); } };
  const d = { foglioEl: () => f, ripulisciFoglio() {}, esc: String, ic: () => '',
    $: () => chiudi, chiudiFoglio() {} };
  const foglio = new Function(...Object.keys(d), 'let cicloF=0, chiusoF=true;'+codice+';return foglio;')(...Object.values(d));
  return { foglio, f, documento, get chiudi() { return chiudi; }, get aperture() { return aperture; }, get opzioni() { return opzioni; } };
}

test('foglio: cambiare contenuto di una finestra aperta porta il fuoco nel nuovo contenuto', () => {
  const e = ambiente(); e.foglio('Itinerario', ''); e.foglio('Data e orari', '');
  assert.equal(e.documento.activeElement, e.chiudi);
  assert.deepEqual(e.opzioni, { preventScroll: true });
  assert.equal(e.aperture, 1);
});

test('foglio: il gestore può scegliere un campo iniziale specifico dopo il cambio', () => {
  const e = ambiente(), campo = {};
  e.foglio('Prima', '');
  e.foglio('Cerca', '', () => { e.documento.activeElement = campo; });
  assert.equal(e.documento.activeElement, campo);
});

test('foglio: la prima apertura conserva il fuoco nativo di showModal', () => {
  const e = ambiente(); e.foglio('Prima', '');
  assert.equal(e.documento.activeElement, e.chiudi); assert.equal(e.aperture, 1);
});
