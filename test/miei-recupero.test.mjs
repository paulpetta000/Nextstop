import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as memoria from '../src/scripts/itinerari/memoria.ts';

const source = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/fogli.js', import.meta.url), 'utf8');
const da = source.indexOf('export function apriMiei()'), a = source.indexOf('export function dopoCambioItinerario()', da);
assert.ok(da >= 0 && a > da);
const apri = new Function('d', 'const { A, X, salvato, MAX_NOME, descrivi, segno, esc, ic, prontiDaAprire, foglio, notaSalvataggio } = d; ' + source.slice(da,a).replace('export ', '') + '; return apriMiei;');
const comuni = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js', import.meta.url), 'utf8');
const daC = comuni.indexOf('export function rinfrescaSalvataggio('), aC = comuni.indexOf('export function avvisa(', daC);
const rinfresca = new Function('$$', 'statoSalvataggio', 'salvataggioInCorso', 'notaSalvataggio', comuni.slice(daC,aC).replace('export ', '') + '; return rinfrescaSalvataggio;');
function pannello(esito) {
  const x = { id: 'viaggio0', nome: 'Napoli', salvato: true, giorni: [{ tappe: ['duomo'] }] };
  let html;
  apri({ A: { attivo: x.id, elenco: [x] }, X: () => x, salvato: i => i.salvato, MAX_NOME: 80, descrivi: () => 'Un giorno', segno: () => '', esc: s => s, ic: () => '', prontiDaAprire: () => [], foglio: (_titolo, corpo) => { html = corpo; }, notaSalvataggio: () => memoria.testoNotaMemoria(esito) })();
  return html;
}

test('recupero nel pannello: dopo un errore non promette dati conservati chiudendo la pagina', () => {
  const html = pannello('errore');
  assert.doesNotMatch(html, /anche se chiudi la pagina/);
  assert.match(html, /non salvate/); assert.match(html, /Salva/); assert.match(html, /Condividi/);
  assert.match(html, /visite e timbri/);
});

test('recupero nel pannello: durante l’attesa chiede di aspettare la conferma', () => {
  const html = pannello('in-corso');
  assert.doesNotMatch(html, /anche se chiudi la pagina/);
  assert.match(html, /[Aa]spetta/); assert.match(html, /conferma/);
});

test('recupero nel pannello: il conflitto distingue la copia locale da quella dell’altra scheda', () => {
  const html = pannello('conflitto');
  assert.doesNotMatch(html, /anche se chiudi la pagina/);
  assert.match(html, /altra scheda/); assert.match(html, /Condividi/); assert.match(html, /ricaricare/);
});

test('recupero nel pannello: la nota già aperta segue attesa, errore e ripresa senza ridisegnare il pannello', () => {
  let esito = 'in-corso'; const nota = { textContent: '' };
  const aggiorna = rinfresca(s => s.includes('data-memoria-itinerari') ? [nota] : [], () => memoria.presentaSalvataggio(true, esito), () => esito === 'in-corso', () => memoria.testoNotaMemoria(esito));
  aggiorna(); assert.match(nota.textContent, /conferma/);
  esito = 'errore'; aggiorna(); assert.match(nota.textContent, /non salvate/);
  esito = 'salvato'; aggiorna(); assert.match(nota.textContent, /anche se chiudi la pagina/);
});
