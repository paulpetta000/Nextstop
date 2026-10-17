import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { leggiConRiferimento, allineaArchivio, creaSalvataggio } from '../src/scripts/itinerari/memoria.ts';

// Esegue il gestore reale dell'avvio con memoria fittizia e un dialogo finto.
const source = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/avvio.js', import.meta.url), 'utf8');
const da = source.indexOf('  quandoCambia(() => {'), a = source.indexOf('\n  });', da);
assert.ok(da >= 0 && a > da);
const crea = new Function('d', 'const { C, A, S, leggiConRiferimento, allineaArchivio, schedaAperta, $, erroreSalvataggio, salvataggioInCorso, sostituisciArchivio, disegna } = d; const quandoCambia = fn => fn; return ' + source.slice(da, a + 6).trim());
const CHIAVE = 'itinerari-v1', C = { tappe: [{ id: 'duomo', tipo: 'citta' }] };
const base = () => ({ v: 1, attivo: 'viaggio0', elenco: [{ id: 'viaggio0', nome: 'Base', salvato: true, creato: 1, modificato: 1, giorni: [{ tappe: ['duomo'], inizio: 570, fine: 1140 }] }] });
const tick = () => new Promise(resolve => setImmediate(resolve));
function ambiente(t) {
  const dati = new Map([[CHIAVE, JSON.stringify(base())]]), turni = [];
  for (const [nome, value] of Object.entries({ localStorage: { getItem: k => dati.get(k) ?? null, setItem: (k, v) => dati.set(k, v) }, navigator: { locks: { request: (_nome, _options, fn) => new Promise(resolve => turni.push(() => resolve(fn()))) } } })) {
    const prima = Object.getOwnPropertyDescriptor(globalThis, nome);
    Object.defineProperty(globalThis, nome, { configurable: true, value });
    t.after(() => prima ? Object.defineProperty(globalThis, nome, prima) : delete globalThis[nome]);
  }
  const fonte = leggiConRiferimento(C);
  let archivio = fonte.archivio, salva = creaSalvataggio(fonte), disegni = 0, foglio = false, scheda = false;
  const S = { g: 2 };
  const d = { C, S, leggiConRiferimento, allineaArchivio, schedaAperta: () => scheda, $: () => ({ open: foglio }),
    erroreSalvataggio: () => ['errore', 'conflitto'].includes(salva.stato()) ? 'Non salvato' : '', salvataggioInCorso: () => salva.stato() === 'in-corso',
    sostituisciArchivio: (nuovo, f) => { archivio = nuovo; salva = creaSalvataggio(f); }, disegna: () => disegni++ };
  return { dati, turni, S, archivio: () => archivio, stato: () => salva.stato(), disegni: () => disegni,
    aggiorna: () => crea({ ...d, A: archivio })(), scrivi: () => salva(archivio), foglio: v => { foglio = v; }, scheda: v => { scheda = v; } };
}

test('aggiornamento esterno: adotta la copia corrente e limita il giorno, poi salva con il suo riferimento', async t => {
  const e = ambiente(t), esterno = base(); esterno.elenco[0].nome = 'Esterno';
  e.dati.set(CHIAVE, JSON.stringify(esterno)); e.aggiorna();
  assert.equal(e.archivio().elenco[0].nome, 'Esterno'); assert.equal(e.S.g, 0); assert.equal(e.disegni(), 1);
  e.archivio().elenco[0].nome = 'Da esterno a locale'; const p = e.scrivi(); await tick(); e.turni.shift()();
  assert.equal(await p, true); assert.equal(JSON.parse(e.dati.get(CHIAVE)).elenco[0].nome, 'Da esterno a locale');
});

test('aggiornamento esterno: durante un salvataggio non sostituisce la copia locale e conserva il conflitto', async t => {
  const e = ambiente(t); e.archivio().elenco[0].nome = 'Locale in attesa'; const p = e.scrivi(); await tick();
  const esterno = base(); esterno.elenco[0].nome = 'Esterno'; e.dati.set(CHIAVE, JSON.stringify(esterno));
  e.aggiorna(); assert.equal(e.archivio().elenco[0].nome, 'Locale in attesa'); assert.equal(e.disegni(), 0);
  e.turni.shift()(); assert.equal(await p, false); e.aggiorna();
  assert.equal(e.stato(), 'conflitto'); assert.equal(e.archivio().elenco[0].nome, 'Locale in attesa');
  assert.equal(JSON.parse(e.dati.get(CHIAVE)).elenco[0].nome, 'Esterno'); assert.equal(e.disegni(), 0);
});

test('aggiornamento esterno: con un pannello aperto conserva la copia in uso', t => {
  const e = ambiente(t), esterno = base(); esterno.elenco[0].nome = 'Esterno'; e.dati.set(CHIAVE, JSON.stringify(esterno));
  e.foglio(true); e.aggiorna(); assert.equal(e.disegni(), 0);
  e.foglio(false); e.scheda(true); e.aggiorna(); assert.equal(e.disegni(), 0);
  assert.equal(e.archivio().elenco[0].nome, 'Base');
  e.scheda(false); e.aggiorna(); assert.equal(e.archivio().elenco[0].nome, 'Esterno');
});

test('aggiornamento esterno: clear non cancella la copia locale e una scrittura successiva è rifiutata', async t => {
  const e = ambiente(t); e.dati.delete(CHIAVE); e.aggiorna();
  assert.equal(e.archivio().elenco[0].nome, 'Base'); assert.equal(e.disegni(), 0);
  const p = e.scrivi(); await tick(); e.turni.shift()();
  assert.equal(await p, false); assert.equal(e.dati.has(CHIAVE), false); assert.equal(e.stato(), 'conflitto');
});
