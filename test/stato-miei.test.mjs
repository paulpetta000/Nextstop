import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { presentaSalvataggio } from '../src/scripts/itinerari/memoria.ts';
const fogli = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/fogli.js', import.meta.url), 'utf8');
const da = fogli.indexOf('const segno = '), a = fogli.indexOf('// i pronti', da);
assert.ok(da >= 0 && a > da);
const segno = new Function('salvato', 'ic', 'statoSalvataggio', 'esc', fogli.slice(da, a) + '; return segno;');
const comuni = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js', import.meta.url), 'utf8');
const daC = comuni.indexOf('export function rinfrescaSalvataggio('), aC = comuni.indexOf('export function avvisa(', daC);
assert.ok(daC >= 0 && aC > daC);
const rinfresca = new Function('A', '$$', 'statoSalvataggio', 'salvataggioInCorso', 'ic', 'esc', comuni.slice(daC, aC).replace('export ', '') + '; return rinfrescaSalvataggio;');
const x = { id: 'viaggio0', salvato: true };
const ic = () => '<svg></svg>', esc = s => s;

test('I miei itinerari: la riga iniziale distingue attesa, errore e salvataggio riuscito', () => {
  for (const esito of ['in-corso', 'conflitto', 'errore', 'salvato']) {
    const stato = it => presentaSalvataggio(it.salvato, esito);
    const html = segno(it => it.salvato, ic, stato, esc)(x);
    const atteso = esito === 'salvato' ? 'Salvato' : stato(x).testo;
    assert.ok(html.includes(atteso), esito + ': ' + html);
  }
});

test('I miei itinerari: le righe già aperte seguono il completamento asincrono e il recupero', () => {
  let esito = 'in-corso';
  const el = { dataset: { itinerarioStato: x.id }, innerHTML: '' };
  const aggiorna = rinfresca({ elenco: [x] }, s => s.includes('data-itinerario-stato') ? [el] : [], it => presentaSalvataggio((it ?? x).salvato, esito), () => esito === 'in-corso', ic, esc);
  for (const valore of ['in-corso', 'errore', 'salvato']) {
    esito = valore; aggiorna();
    assert.ok(el.innerHTML.includes(valore === 'salvato' ? 'Salvato' : presentaSalvataggio(true, valore).testo), valore + ': ' + el.innerHTML);
  }
});
