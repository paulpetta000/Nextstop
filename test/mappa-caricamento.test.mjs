import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sorgente = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/mappa.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?$/gm, '').replace(/^export /gm, '');

function ambiente({ pezzi = false } = {}) {
  let risolvi, rifiuta, risolviPezzo, scritture = 0, richieste = 0, numero = 0;
  const carica = new Promise((ok, no) => { risolvi = ok; rifiuta = no; }), tile = new Promise(ok => { risolviPezzo = ok; }), timer = new Map();
  const elementi = new Map();
  const classi = () => { const s = new Set(); return { add: k => s.add(k), remove: k => s.delete(k), contains: k => s.has(k), toggle: (k, si) => si ? s.add(k) : s.delete(k) }; };
  const nodo = () => {
    let html = '', testo = '';
    return { classList: classi(), style: { setProperty() {} }, isConnected: true, clientWidth: 400, clientHeight: 600, childElementCount: 0, dataset: {}, attributi: {},
      get innerHTML() { return html; }, set innerHTML(v) { html = v; scritture++; }, get textContent() { return testo; }, set textContent(v) { testo = v; scritture++; },
      addEventListener() {}, setAttribute(k, v) { this.attributi[k] = v; }, insertAdjacentHTML(k, v) { html += v; scritture++; } };
  };
  const $ = sel => { if (!elementi.has(sel)) elementi.set(sel, nodo()); return elementi.get(sel); };
  const bottoni = sel => [...$(sel).innerHTML.matchAll(/<button[^>]*data-id="([^"]+)"/g)].map(m => ({ ...nodo(), dataset: { id: m[1] } }));
  const $$ = sel => sel === '.m-punto' ? bottoni('.m-punti') : sel === '.m-segno' ? bottoni('.m-segni') : sel === '.m-segno, .m-punto' ? [...bottoni('.m-segni'), ...bottoni('.m-punti')] : sel === '.m-fine > g' ? Array.from({ length: 7 }, nodo) : [];
  const tappe = [{ id: 'a', nome: 'Prima', breve: 'Prima', tipo: 'citta', xy: [100, 100] }, { id: 'b', nome: 'Seconda', breve: 'Seconda', tipo: 'citta', xy: [1000, 1000] }];
  const d = { $, $$, C: { tappe }, T: id => tappe.find(t => t.id === id), A: { elenco: [] }, salvato: () => true, visitata: () => false, nelViaggio: () => false,
    esc: s => String(s), ic: () => '', piano: () => false, ora: String, verificaRiferimento() {}, rileggi: () => [[0, 0], [1, 1]], pezziDi: () => ['0_0'], nomiDelPercorso: () => [],
    caricaMappa: () => carica, caricaAlternativi: async () => null, tappeDi: g => g?.voci.filter(v => v.tipo === 'tappa') ?? [], daFare: () => [], decodifica: () => [],
    ResizeObserver: class { observe() {} disconnect() { this.spenta = true; } },
    fetch: () => { richieste++; return tile; }, setTimeout: fn => { const id = ++numero; timer.set(id, fn); return id; }, clearTimeout: id => timer.delete(id) };
  const Mappa = new Function(...Object.keys(d), sorgente + ';return Mappa;')(...Object.values(d));
  const base = Mappa.prototype.base; Mappa.prototype.base = function() { return this.caricamento = base.call(this); };
  const el = nodo(), m = new Mappa(el);
  const dati = [{ mare: '', isole: '', parchi: '', strade: ['', '', ''], moli: '' }, { scenari: { feriale: [] } }, pezzi ? { lato: 256, pezzi: ['0_0'], principali: [] } : null];
  return { m, el, $,
    carica: async () => { risolvi(dati); await m.caricamento; }, fallisci: async () => { rifiuta(Error('rete fittizia')); await m.caricamento; },
    completaPezzo: async () => { risolviPezzo({ ok: true, json: async () => ({ n: [['Via fittizia', 0, 0, '']] }) }); await new Promise(setImmediate); },
    timer: () => { const fn = [...timer.values()]; timer.clear(); fn.forEach(f => f()); },
    get richieste() { return richieste; }, get scritture() { return scritture; }, get timerRimasti() { return timer.size; } };
}

for (const ultimi of [['b'], []]) test('mappa: durante il caricamento conserva gli ultimi punti ' + JSON.stringify(ultimi), async () => {
  const e = ambiente(); e.m.disegna(null, { punti: ['a'], disegna: false }); e.m.punti(ultimi); await e.carica();
  assert.deepEqual(e.m.idsPunti, ultimi);
});

test('mappa: conserva l’inquadratura richiesta prima che arrivi la base', async () => {
  const e = ambiente(); e.m.disegna(null, { punti: ['b'], disegna: false }); e.m.inquadra(0, ['b']); await e.carica();
  assert.ok(Math.abs(e.m.vb.x + e.m.vb.w / 2 - 1000) < 0.001); assert.equal(e.m.mosso, true);
});

test('mappa: la chiusura durante il caricamento non ridisegna il contenitore ritirato', async () => {
  const e = ambiente(); e.m.disegna(null, { punti: ['a'] }); e.m.spegni(); const prima = e.scritture; await e.carica();
  assert.equal(e.scritture, prima); assert.equal(e.m.ro.spenta, true);
});

test('mappa: un errore arrivato dopo la chiusura non mostra un recupero nella vecchia mappa', async () => {
  const e = ambiente(); e.m.spegni(); const prima = e.scritture; await e.fallisci(); assert.equal(e.scritture, prima);
});

test('mappa: chiudere cancella i richiami che caricherebbero nuovi pezzi', async () => {
  const e = ambiente({ pezzi: true }); e.m.disegna(null, { punti: [] }); await e.carica(); assert.ok(e.timerRimasti > 0);
  e.m.spegni(); e.timer(); assert.equal(e.richieste, 0); assert.equal(e.timerRimasti, 0);
});

test('mappa: un pezzo già richiesto non si applica dopo la chiusura', async () => {
  const e = ambiente({ pezzi: true }); e.m.disegna(null, { punti: [] }); await e.carica(); e.timer(); assert.equal(e.richieste, 1);
  let aggiunti = 0; e.m.aggiungi = () => aggiunti++; e.m.spegni(); await e.completaPezzo(); assert.equal(aggiunti, 0);
});


test('mappa: una ricerca successiva aggiorna anche l’inquadratura in attesa', async () => {
  const e = ambiente(); e.m.disegna(null, { punti: ['a'] }); e.m.inquadra(0, ['a']); e.m.punti(['b']); await e.carica();
  assert.deepEqual(e.m.idsPunti, ['b']); assert.ok(Math.abs(e.m.vb.x + e.m.vb.w / 2 - 1000) < 0.001);
});

test('mappa: l’inquadratura senza elenco esplicito usa i punti del giorno arrivati dopo', async () => {
  const e = ambiente(); e.m.disegna(null, { punti: ['b'] }); e.m.inquadra(0); await e.carica();
  assert.deepEqual(e.m.idsPunti, ['b']); assert.ok(Math.abs(e.m.vb.x + e.m.vb.w / 2 - 1000) < 0.001);
});


test('mappa: chiudere rilascia anche i puntatori di un gesto ancora catturato', async () => {
  const e = ambiente(); await e.carica(); const catturati = new Set([1, 2]);
  e.el.hasPointerCapture = id => catturati.has(id); e.el.releasePointerCapture = id => catturati.delete(id);
  e.m.dita.set(1, [10, 10]); e.m.dita.set(2, [20, 20]); e.m.partenza = { dita: new Map(e.m.dita) }; e.m.spegni();
  assert.equal(catturati.size, 0); assert.equal(e.m.dita.size, 0); assert.equal(e.m.partenza, null);
});
