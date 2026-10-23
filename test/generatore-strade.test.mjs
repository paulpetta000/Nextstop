import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { BOX } from '../scripts/mappa/riquadro.mjs';
import { scriviFile } from '../scripts/scrivi-file.mjs';

const url = new URL('../scripts/mappa/strade.mjs', import.meta.url);
const sorgente = fs.readFileSync(url, 'utf8').replace(/^import .*;\r?$/gm, '').replaceAll('import.meta.url', JSON.stringify(url.href));
const esegui = new Function('fs', 'path', 'zlib', 'execFileSync', 'fileURLToPath', 'BOX', 'scriviFile', 'process', 'console', sorgente);
const via = (id = 1) => ({ type: 'way', id, tags: { highway: 'pedestrian', name: 'Via fittizia' }, geometry: [{ lat: 40.82, lon: 14.20 }, { lat: 40.83, lon: 14.21 }] });
const risposta = () => ({ version: 0.6, osm3s: { timestamp_osm_base: '2026-10-18T10:00:00Z' }, elements: [via()] });
const mappa = { box: BOX, w: 256, h: 256, mPerUnit: 5 };

function ambiente(t, { dati = risposta(), codice = '200', download = false, erroreRete = false, discoPieno = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nextstop-strade-'));
  t.after(() => { assert.equal(path.dirname(dir), path.resolve(os.tmpdir())); assert.ok(path.basename(dir).startsWith('nextstop-strade-')); fs.rmSync(dir, { recursive: true, force: true }); });
  const file = path.join(dir, 'strade-grezze.json'), precedente = 'copia precedente';
  fs.writeFileSync(file, precedente);
  const uscite = [], richieste = [];
  const letture = new Proxy(fs, { get: (o, k) => k === 'readFileSync' ? (f, ...a) => path.basename(f) === 'mappa.json' ? JSON.stringify(mappa) : download ? fs.readFileSync(f, ...a) : typeof dati === 'string' || Buffer.isBuffer(dati) ? dati : JSON.stringify(dati) : o[k] });
  const rete = (nome, args) => { assert.equal(nome, 'curl'); richieste.push(args); fs.writeFileSync(args[args.indexOf('-o') + 1], typeof dati === 'string' || Buffer.isBuffer(dati) ? dati : JSON.stringify(dati)); if (erroreRete) throw Error('rete interrotta fittizia'); return Buffer.from(codice); };
  const io = discoPieno ? new Proxy(fs, { get: (o, k) => k === 'writeFileSync' ? fd => { fs.writeFileSync(fd, 'frammento'); throw Error('disco pieno fittizio'); } : o[k] }) : fs;
  const termina = {};
  const avvia = () => { try { esegui(letture, path, zlib, rete, fileURLToPath, BOX, (f, b) => { if (download) scriviFile(f, b, io); else uscite.push({ file: f, contenuto: b }); }, { argv: ['node', 'script', ...(download ? ['scarica', file] : [file])], exit: () => { throw termina; } }, { log() {} }); } catch (e) { if (e !== termina) throw e; } };
  return { dir, file, precedente, uscite, richieste, avvia };
}

test('strade: un errore HTTP o di rete conserva il download precedente', t => {
  for (const opzioni of [{ codice: '503' }, { erroreRete: true }]) {
    const e = ambiente(t, { download: true, dati: '<html>errore</html>', ...opzioni });
    assert.throws(e.avvia, /503|rete interrotta/);
    assert.equal(fs.readFileSync(e.file, 'utf8'), e.precedente);
    assert.deepEqual(fs.readdirSync(e.dir), ['strade-grezze.json']);
  }
});

test('strade: HTTP 200 non basta se la risposta è tronca, parziale o senza vie', t => {
  for (const dati of ['{"elements":[', { ...risposta(), remark: 'runtime error: timeout' }, { ...risposta(), elements: [] }]) {
    const e = ambiente(t, { download: true, dati });
    assert.throws(e.avvia, /JSON|Overpass|Strade|OSM/i);
    assert.equal(fs.readFileSync(e.file, 'utf8'), e.precedente);
  }
});

test('strade: la costruzione rifiuta coordinate incomplete e tag non testuali prima della scrittura', t => {
  for (const modifica of [w => w.geometry[1].lat = null, w => w.geometry[1].lon = '14.21', w => w.geometry[1].lat = 91, w => w.geometry[1] = null, w => w.tags.name = 123]) {
    const dati = risposta(); modifica(dati.elements[0]);
    const e = ambiente(t, { dati });
    assert.throws(e.avvia, /Strade|OSM|Overpass/i);
    assert.deepEqual(e.uscite, []);
  }
});

test('strade: una risposta parziale o senza data non viene costruita come mappa completa', t => {
  for (const dati of [{ ...risposta(), remark: 'timeout' }, { ...risposta(), osm3s: {} }, { ...risposta(), osm3s: { timestamp_osm_base: '2026-02-30T00:00:00Z' } }]) {
    const e = ambiente(t, { dati }); assert.throws(e.avvia, /Strade|OSM|Overpass/i); assert.deepEqual(e.uscite, []);
  }
});

test('strade: un download valido conserva byte, fonte e licenza', t => {
  const dati = JSON.stringify(risposta(), null, 2), e = ambiente(t, { dati, download: true }); e.avvia();
  assert.equal(fs.readFileSync(e.file, 'utf8'), dati);
  assert.deepEqual(fs.readdirSync(e.dir), ['strade-grezze.json']);
  assert.equal(e.richieste.length, 1);
  const c = ambiente(t); c.avvia(); const out = JSON.parse(c.uscite[0].contenuto);
  assert.equal(out.fonte, 'OpenStreetMap (ODbL), dati del 2026-10-18'); assert.ok(Object.keys(out.pezzi).length);
});

test('strade: il disco pieno non sostituisce il download precedente con un frammento', t => {
  const e = ambiente(t, { download: true, discoPieno: true }); assert.throws(e.avvia, /disco pieno/);
  assert.equal(fs.readFileSync(e.file, 'utf8'), e.precedente);
  assert.deepEqual(fs.readdirSync(e.dir), ['strade-grezze.json']);
});

test('strade: la suddivisione visita solo le celle della mappa anche se la linea esce molto dal riquadro', () => {
  const da = sorgente.indexOf('function taglia('), a = sorgente.indexOf('for (const v of vie) for', da);
  assert.ok(da > 0 && a > da);
  const codice = 'import assert from "node:assert/strict";const LATO=256,NX=2,NY=2;' + sorgente.slice(da, a) +
    ';assert.deepEqual([...taglia([[0,0],[1e12,1e12]]).keys()],["0_0","0_1","1_0","1_1"]);';
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', codice], { encoding: 'utf8', timeout: 1500 });
  assert.equal(r.status, 0, r.error?.message || r.stderr);
});

test('strade: ID duplicati, geometrie mancanti e UTF-8 corrotto non arrivano all’uscita', t => {
  for (const dati of [{ ...risposta(), elements: [via(), via()] }, { ...risposta(), elements: [{ ...via(), geometry: [] }] }, Buffer.from([123, 34, 255, 34, 58, 48, 125])]) {
    const e = ambiente(t, { dati }); assert.throws(e.avvia, /Strade|OSM|Overpass/i); assert.deepEqual(e.uscite, []);
  }
});

test('strade: una catena dettagliata non esaurisce la pila durante la semplificazione', () => {
  const da = sorgente.indexOf('function semplifica('), a = sorgente.indexOf('const lunghezza', da);
  assert.ok(da > 0 && a > da);
  const semplifica = new Function('pts', 'tol', sorgente.slice(da, a) + ';return semplifica(pts,tol);');
  const punti = Array.from({ length: 6_000 }, (_, i) => [i, i % 2]);
  assert.deepEqual(semplifica(punti, 0.35), punti);
});
