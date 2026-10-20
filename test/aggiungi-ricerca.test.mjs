import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as ricerca from '../src/lib/itinerari/ricerca.ts';
import { ora, durata } from '../src/lib/itinerari/date.ts';

const sorgente = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/aggiungi.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?$/gm, '').replace(/^export /gm, '');

function ambiente() {
  const tappa = (id, nome, altro = {}) => ({ id, nome, breve: nome, zona: 'Centro', tipo: 'citta', generi: [], durata: 30, frasi: [], ...altro });
  const tappe = [tappa('inizio', 'Partenza'), tappa('museo', 'Museo di prova', { generi: ['museo'] }),
    tappa('panorama', 'Belvedere di prova', { generi: ['panorama'] }), tappa('pizza', 'Pizzeria di prova', { categoria: 'mangiare', cucina: ['pizza'] }),
    tappa('gita', 'Gita di prova', { tipo: 'gita', generi: ['archeologia'] })];
  const x = { id: 'prova', giorni: [{ tappe: ['inizio'], inizio: 570, fine: 1140 }] }, C = { tappe, tempi: {} }, S = { g: 0 };
  const nodi = new Map(), timer = new Map(), frame = [], mappe = [], annunci = [];
  let numero = 0, chiusura = null, f, html = '', minuti = 7;
  const nodo = () => ({ innerHTML: '', hidden: false, value: '', listeners: new Map(), attributi: {}, isConnected: true, focus() { this.fuochi = (this.fuochi ?? 0) + 1; }, setSelectionRange() {},
    scrollIntoView() { this.scorrimenti = (this.scorrimenti ?? 0) + 1; }, setAttribute(k, v) { this.attributi[k] = v; }, addEventListener(k, fn) { this.listeners.set(k, fn); } });
  const filtri = ['tutte', 'musei', 'chiese', 'panorami', 'sotto', 'verde', 'passeggiate', 'gratis', 'mangiare', 'gite'].map(k => ({ ...nodo(), dataset: { filtro: k } }));
  const viste = ['elenco', 'mappa'].map(k => ({ ...nodo(), dataset: { fv: k } }));
  const T = id => tappe.find(t => t.id === id);
  const chiudi = () => { chiusura?.(); chiusura = null; };
  const d = { ...ricerca, C, E: null, T, X: () => x, UI: { citta: [] }, S, ora, durata,
    $: sel => nodi.get(sel), $$: sel => sel === '[data-filtro]' ? filtri : sel === '[data-fv]' ? viste : [],
    esc: s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]), ic: () => '', piano: () => false,
    schedePronte: () => true, caricaSchede: async () => {}, assicuraSchede: async () => true,
    giornoDi: id => x.giorni.findIndex(g => g.tappe.includes(id)), nelViaggio: id => x.giorni.some(g => g.tappe.includes(id)),
    lista: g => x.giorni[g].tappe, ultimaDi: g => x.giorni[g].tappe.at(-1), G: () => ({}), chiusaIl: () => false, dataLungaDi: () => '',
    aggiunta: () => ({ tratto: { min: minuti }, X: { fine: 900, fineScelta: 1140, avvisi: [], voci: [] } }),
    foglio: (titolo, corpo, fn) => { chiudi(); html = corpo; f = {}; nodi.clear();
      for (const sel of ['#f-q', '#f-elenco', '#f-mappa-box', '#f-mappa', '#f-scelta']) nodi.set(sel, nodo()); fn(f); },
    quandoChiudeFoglio: fn => { chiusura = fn; }, chiudiFoglio: async () => chiudi(), annunciaF: t => annunci.push(t),
    dopo: async () => {}, aggiungi() {}, aggiungiGita() {}, schedaFuori() {}, apriScheda() {},
    setTimeout: (fn, ms) => { const id = ++numero; timer.set(id, { fn, ms }); return id; }, clearTimeout: id => timer.delete(id),
    requestAnimationFrame: fn => frame.push(fn),
    Mappa: class {
      constructor(el, opzioni) { this.opzioni = opzioni; this.ids = []; this.inquadrature = []; mappe.push(this); }
      disegna(g, opzioni) { this.ids = opzioni.punti; } punti(ids) { this.ids = ids; } evidenzia(id) { this.scelta = id; }
      mostraTutte() {} inquadra(n, ids) { this.inquadrature.push(ids); } spegni() { this.spenta = true; }
    } };
  const api = new Function(...Object.keys(d), sorgente + ';return { apriAggiungi };')(...Object.values(d));
  const clic = async dataset => {
    const b = { dataset, classList: { add() {}, contains: () => false } };
    await f.onclick({ target: { closest: sel => sel === '[data-fv]' && dataset.fv || sel === '[data-filtro]' && dataset.filtro || sel === '[data-f]' && dataset.f ? b : null } });
  };
  return { ...api, C, x, S, nodi, mappe, annunci, chiudi, clic,
    get html() { return html; }, get elenco() { return nodi.get('#f-elenco').innerHTML || html; }, set minuti(v) { minuti = v; },
    scrivi(q) { const input = nodi.get('#f-q'); input.value = q; input.listeners.get('input')({ target: input }); },
    timer() { const eseguiti = [...timer.values()]; timer.clear(); eseguiti.forEach(t => t.fn()); },
    fotogrammi() { frame.splice(0).forEach(fn => fn()); } };
}

test('aggiungi: la mappa conserva la ricerca dei locali quando il filtro è Tutte', async () => {
  const e = ambiente(); await e.apriAggiungi({ q: 'pizza', filtro: 'tutte' }); await e.clic({ fv: 'mappa' });
  assert.deepEqual(e.mappe[0].ids, ['pizza']);
});

test('aggiungi: cambiare testo aggiorna i punti e toglie una selezione non più trovata', async () => {
  const e = ambiente(); await e.apriAggiungi({ q: 'museo', filtro: 'tutte' }); await e.clic({ fv: 'mappa' });
  e.mappe[0].opzioni.punto('museo'); e.scrivi('panorama');
  assert.deepEqual(e.mappe[0].ids, ['panorama']); assert.equal(e.mappe[0].scelta, null);
  assert.ok(!e.nodi.get('#f-scelta').innerHTML.includes('Museo di prova'));
});

test('aggiungi: una ricerca senza risultati lascia anche la mappa senza candidati', async () => {
  const e = ambiente(); await e.apriAggiungi(); await e.clic({ fv: 'mappa' }); e.scrivi('astronave');
  assert.deepEqual(e.mappe[0].ids, []); assert.match(e.elenco, /Niente per/);
});

test('aggiungi: filtro e query si applicano insieme e non ripropongono tappe già inserite', async () => {
  const e = ambiente(); await e.apriAggiungi({ q: 'prova', filtro: 'musei' }); await e.clic({ fv: 'mappa' });
  assert.deepEqual(e.mappe[0].ids, ['museo']); await e.clic({ filtro: 'mangiare' }); assert.deepEqual(e.mappe[0].ids, ['pizza']);
  e.x.giorni.push({ tappe: ['pizza'] }); e.scrivi('pizza'); assert.deepEqual(e.mappe[0].ids, []);
});

test('aggiungi: senza query conserva vicine, categorie e gite fuori dalla mappa cittadina', async () => {
  const e = ambiente(); await e.apriAggiungi(); await e.clic({ fv: 'mappa' }); assert.deepEqual(e.mappe[0].ids, ['museo', 'panorama']);
  await e.clic({ filtro: 'mangiare' }); assert.deepEqual(e.mappe[0].ids, ['pizza']);
  await e.clic({ filtro: 'gite' }); assert.deepEqual(e.mappe[0].ids, []);
});

test('aggiungi: una nuova ricerca aggiorna i minuti dopo il caricamento degli orari', async () => {
  const e = ambiente(); await e.apriAggiungi(); e.minuti = 42; e.scrivi('museo');
  assert.match(e.elenco, />42 min</); assert.doesNotMatch(e.elenco, />7 min</);
});

test('aggiungi: chiudere il foglio cancella gli annunci differiti della vecchia ricerca', async () => {
  const e = ambiente(); await e.apriAggiungi(); e.scrivi('museo'); e.chiudi(); e.timer(); assert.deepEqual(e.annunci, []);
});

test('aggiungi: la vecchia inquadratura non cambia una nuova mappa dopo la riapertura', async () => {
  const e = ambiente(); await e.apriAggiungi({ q: 'museo' }); await e.clic({ fv: 'mappa' }); const prima = e.mappe[0];
  e.chiudi(); await e.apriAggiungi({ q: 'pizza' }); await e.clic({ fv: 'mappa' }); e.timer();
  assert.equal(prima.spenta, true); assert.equal(e.mappe[1].inquadrature.length, 1);
  assert.deepEqual(e.mappe[1].inquadrature[0], ['pizza']);
});


test('aggiungi: i fotogrammi del foglio chiuso non spostano il focus o fanno scorrere la riapertura', async () => {
  const e = ambiente(); await e.apriAggiungi({ q: 'museo' }); const input = e.nodi.get('#f-q'); await e.clic({ fv: 'mappa' });
  e.chiudi(); await e.apriAggiungi(); const nuova = e.nodi.get('#f-mappa-box'); e.fotogrammi();
  assert.equal(input.fuochi ?? 0, 0); assert.equal(nuova.scorrimenti ?? 0, 0);
});

test('aggiungi: selezionare una foto ricalcola la scheda con gli orari più recenti', async () => {
  const e = ambiente(); await e.apriAggiungi({ q: 'museo' }); await e.clic({ fv: 'mappa' }); e.minuti = 42;
  e.mappe[0].opzioni.punto('museo'); assert.match(e.nodi.get('#f-scelta').innerHTML, />42 min</);
});
