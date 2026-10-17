import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { presentaSalvataggio, testoErroreSalvataggio } from '../src/scripts/itinerari/memoria.ts';

// Esegue la funzione reale con elementi finti; nessun browser o sessione personale.
const source = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js', import.meta.url), 'utf8');
const start = source.indexOf('export function avvisa('), end = source.indexOf('export function preparaAvviso', start);
assert.ok(start >= 0 && end > start);
const crea = new Function('$', '$$', 'esc', 'erroreSalvataggio', 'statoSalvataggio', 'setTimeout', 'clearTimeout', 'let tempoAvviso; ' + source.slice(start, end).replace('export ', '') + '; return avvisa;');
function ambiente(esito) {
  const classi = new Set(['salva--fatto']);
  const bottone = { classList: { toggle: (c, si) => si ? classi.add(c) : classi.delete(c) } };
  const etichetta = { textContent: 'Salvato' };
  const stato = { dataset: {}, querySelector: () => etichetta };
  const azione = {};
  const toast = { innerHTML: '', offsetWidth: 1, classList: { add() {}, remove() {} } };
  const singolo = s => s === '#toast' ? toast : s === 'button' ? azione : s.includes('[data-stato]') ? stato : bottone;
  const tutti = s => s.includes('[data-stato]') ? [stato] : [bottone];
  const avvisa = crea(singolo, tutti, x => x, () => testoErroreSalvataggio(esito), () => presentaSalvataggio(true, esito), () => 0, () => {});
  return { avvisa, classi, etichetta, stato, toast, azione };
}

test('avviso: il messaggio successivo conserva il mancato salvataggio e aggiorna tutti i controlli', () => {
  const a = ambiente('conflitto'); let annullato = false;
  a.avvisa('Tappa spostata.', { testo: 'Annulla', fai: () => { annullato = true; } });
  assert.match(a.toast.innerHTML, /Tappa spostata/);
  assert.match(a.toast.innerHTML, /altra scheda/);
  assert.match(a.toast.innerHTML, /Annulla/);
  assert.equal(a.etichetta.textContent, 'Modifiche non salvate');
  assert.equal(a.stato.dataset.stato, 'bozza');
  assert.equal(a.classi.has('salva--fatto'), false);
  a.azione.onclick(); assert.equal(annullato, true);
});

test('avviso: un salvataggio riuscito mantiene la conferma e non aggiunge falsi errori', () => {
  const a = ambiente('salvato'); a.avvisa('Salvato.');
  assert.equal(a.classi.has('salva--fatto'), true);
  assert.equal(a.etichetta.textContent, 'Salvato in «I miei itinerari»');
  assert.equal(a.toast.innerHTML, '<span>Salvato.</span>');
});

// Anche il comando Salva viene eseguito dal sorgente reale, con sole dipendenze finte.
const fogli = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/fogli.js', import.meta.url), 'utf8');
const da = fogli.indexOf('export function salva('), a = fogli.indexOf('// ---------- pause e margini', da);
assert.ok(da >= 0 && a > da);
const comando = new Function('d', 'const { X, salvato, erroreSalvataggio, apriMiei, A, nomeLibero, nomeProposto, dopoModifica, scriviArchivio, avvisa, apriCondividi, mettiNome, $$, setTimeout, aggiorna, piano } = d; const MAX_SALVATI = 50, GENERICI = /^(Il mio itinerario)$/; ' + fogli.slice(da, a).replace('export ', '') + '; return salva;');
function salvataggio({ gia = true, quanti = 1, riesce = true, dopo = false } = {}) {
  const x = { nome: 'Il mio itinerario', salvato: gia }, avvisi = [];
  let errore = 'Memoria piena', scritture = 0, aperti = 0;
  const d = {
    X: () => x, salvato: i => i.salvato, erroreSalvataggio: () => errore,
    apriMiei: () => { aperti++; }, A: { elenco: [x, ...Array.from({ length: quanti - 1 }, () => ({ salvato: true }))] },
    nomeLibero: nome => nome, nomeProposto: () => 'Napoli in un giorno', dopoModifica() {},
    scriviArchivio: () => { scritture++; if (riesce) errore = ''; return riesce; },
    avvisa: (testo, azione) => avvisi.push({ testo, azione }), apriCondividi() {}, mettiNome() {},
    $$: () => [], setTimeout: fn => fn(), aggiorna: () => { if (dopo) errore = 'Memoria piena'; }, piano: () => false
  };
  return { salva: comando(d), x, avvisi, scritture: () => scritture, aperti: () => aperti };
}

test('salva: riprovare un itinerario esistente al limite non lo conta una seconda volta', () => {
  const a = salvataggio({ quanti: 50 }); a.salva();
  assert.equal(a.scritture(), 1); assert.equal(a.aperti(), 0);
  assert.equal(a.x.nome, 'Il mio itinerario');
  assert.match(a.avvisi[0].testo, /Ne hai 50 su 50/);
});

test('salva: un nuovo tentativo fallito conserva il segno di appartenenza a un itinerario già salvato', () => {
  const a = salvataggio({ riesce: false }); a.salva();
  assert.equal(a.x.salvato, true); assert.equal(a.aperti(), 0);
  assert.equal(a.avvisi[0].azione.testo, 'Condividi');
});

test('salva: un primo salvataggio fallito resta una bozza', () => {
  const a = salvataggio({ gia: false, riesce: false }); a.salva();
  assert.equal(a.x.salvato, false); assert.equal(a.avvisi[0].azione.testo, 'Condividi');
});

test('salva: un errore nel successivo aggiornamento impedisce la conferma di successo', () => {
  const a = salvataggio({ dopo: true }); a.salva();
  assert.equal(a.avvisi.length, 1); assert.equal(a.avvisi[0].testo, 'Memoria piena');
  assert.equal(a.avvisi[0].azione.testo, 'Condividi');
});
