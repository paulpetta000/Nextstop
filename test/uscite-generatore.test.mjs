import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { marcaGenerazione, verificaGenerazione, validaProiezione } from '../src/lib/itinerari/generazione-dati.mjs';

const source = fs.readFileSync(new URL('../scripts/itinerari/costruisci.mjs', import.meta.url), 'utf8');
const inizio = source.indexOf('uscita.candidati =');
assert.ok(inizio > 0);
const esegui = new Function('d', 'const {fs,path,RADICE,uscita,firma,candidati,punti,chiaviBus,PARTENZE,GTFS,BUS,disegni,disegniSenza,SCENARI,rapporto,process,console,scriviFilePreparati,marcaGenerazione,validaProiezione}=d;' + source.slice(inizio));

function ambiente(mappa = '{') {
  const scritture = [];
  const scenari = ['feriale','sabato','sabato-pomeriggio','domenica','festivo','piedi'];
  const sc = nome => ({ min:[[0]], piedi:[[0]], salita:[[0]], ...(nome==='piedi'?{}:{mezzi:[['']],senza:{min:[[0]],piedi:[[0]],mezzi:[['']]},bus:[[0]]}) });
  const dati = {
    fs: { readFileSync: () => mappa, writeFileSync: (...x) => scritture.push(x) }, path,
    RADICE: '/sito-fittizio', uscita: { generato: '2026-10-18', firma: 'stesse-posizioni', punti: ['a'], linee: [], scenari: Object.fromEntries(scenari.map(n=>[n,sc(n)])) },
    firma: 'stesse-posizioni', candidati: [], punti: ['a'], chiaviBus: new Set(), PARTENZE: { tipi: [], giorni: {}, fermate: {} },
    GTFS: { feed: {}, date: [], linee: [] }, BUS: { finestre: {} },
    disegni: Object.fromEntries(scenari.map(n=>[n,[[null]]])), disegniSenza: Object.fromEntries(scenari.filter(n=>n!=='piedi').map(n=>[n,[[null]]])), SCENARI: scenari.map(nome=>({nome})), rapporto: [],
    process: { env: {} }, console: { log() {} },
    scriviFilePreparati: files => scritture.push(...files.map(x => [x.file, x.contenuto])),
    marcaGenerazione, validaProiezione
  };
  return { dati, scritture };
}

test('generatore: un errore preparando la mappa non aggiorna prima tempi e partenze', () => {
  const e = ambiente();
  assert.throws(() => esegui(e.dati), SyntaxError);
  assert.equal(e.scritture.length, 0);
});

test('generatore: prepara insieme tutti e cinque i file senza cambiare i loro contenuti', () => {
  const e = ambiente(JSON.stringify({ w: 100, h: 100, box: { w: 0, e: 1, n: 1, s: 0 } }));
  esegui(e.dati);
  assert.deepEqual(e.scritture.map(([f]) => path.basename(f)), ['tempi-tappe.json', 'partenze-bus.json', 'linee-bus.json', 'percorsi-tappe.json', 'percorsi-alternativi.json']);
  const p = Object.fromEntries(e.scritture.map(([f, s]) => [path.basename(f), JSON.parse(s)]));
  assert.deepEqual(p['tempi-tappe.json'].candidati, []);
  assert.deepEqual(p['percorsi-tappe.json'].scenari.feriale, [['']]);
  assert.deepEqual(p['percorsi-alternativi.json'].candidati, []);
  assert.doesNotThrow(() => verificaGenerazione(p, { w: 100, h: 100, box: { w: 0, e: 1, n: 1, s: 0 } }));
  assert.match(p['tempi-tappe.json'].generazione, /^[a-f0-9]{64}$/);
});

test('generatore: proiezioni invalide vengono rifiutate prima di codificare o scrivere', () => {
  for (const m of [{ w: 0, h: 100, box: {w:0,e:1,n:1,s:0} }, { w: Infinity, h: 100 }, { w: 100, h: 100, box: {w:1,e:0,n:1,s:0} }]) {
    const e = ambiente(JSON.stringify(m));
    assert.throws(() => esegui(e.dati), /Proiezione/); assert.equal(e.scritture.length, 0);
  }
});
