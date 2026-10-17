import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { creaSalvataggio } from '../src/scripts/itinerari/memoria.ts';
import { codifica, decodifica } from '../src/lib/itinerari/link.ts';
const source = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/fogli.js', import.meta.url), 'utf8');
const da = source.indexOf('const linkDi = '), a = source.indexOf('// ---------- «Altro»', da);
assert.ok(da >= 0 && a > da);
const crea = new Function('d', 'const { X, codifica, esc, ic, foglio, avvisa, $ } = d; ' + source.slice(da,a).replace('export async function', 'async function') + '; return apriCondividi;');
const CHIAVE = 'itinerari-v1', C = { tappe: [{ id: 'duomo', tipo: 'citta' }] };
function ambiente(t, { share, copiaFallita = false } = {}) {
  const x = { id: 'viaggio0', nome: 'Locale', salvato: true, creato: 1, modificato: 1, timbri: { duomo: 1234 }, giorni: [{ tappe: ['duomo'], fatte: ['duomo'], inizio: 570, fine: 1140 }] };
  const A = { attivo: x.id, elenco: [x] }, dati = new Map([[CHIAVE, JSON.stringify({ v: 1, ...A })]]);
  let linkCopiato, aperture = 0, selezionato = false, focalizzato = false;
  const f = {}, avvisi = [];
  for (const [nome, value] of Object.entries({
    localStorage: { getItem: k => dati.get(k) ?? null, setItem: (k, v) => dati.set(k, v) },
    navigator: { locks: { request: async (_nome, _options, fn) => fn() }, ...(share ? { share } : {}), clipboard: { writeText: async l => { if (copiaFallita) throw Error('Accesso negato'); linkCopiato = l; } } },
    location: { origin: 'https://esempio.invalid', pathname: '/napoli/itinerari/' }, matchMedia: () => ({ matches: !!share })
  })) {
    const prima = Object.getOwnPropertyDescriptor(globalThis, nome);
    Object.defineProperty(globalThis, nome, { configurable: true, value });
    t.after(() => prima ? Object.defineProperty(globalThis, nome, prima) : delete globalThis[nome]);
  }
  const apri = crea({ X: () => x, codifica, esc: s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;'), ic: () => '',
    foglio: (_titolo, html, prepara) => { aperture++; f.html = html; prepara(f); }, avvisa: testo => avvisi.push(testo),
    $: () => ({ focus() { focalizzato = true; }, select() { selezionato = true; } }) });
  const salva = creaSalvataggio();
  return { x, A, dati, f, avvisi, apri, salva: () => salva(A), stato: () => salva.stato(), link: () => linkCopiato, aperture: () => aperture, selezionato: () => selezionato, focalizzato: () => focalizzato,
    copia: () => f.onclick({ target: { closest: () => true } }) };
}

test('recupero con Condividi: usa la copia locale dopo il conflitto e non tocca quella esterna', async t => {
  const e = ambiente(t), esterno = structuredClone(e.A); esterno.elenco[0].nome = 'Esterno';
  const raw = JSON.stringify({ v: 1, ...esterno }); e.dati.set(CHIAVE, raw);
  assert.equal(await e.salva(), false); assert.equal(e.stato(), 'conflitto');
  await e.apri(); await e.copia();
  const ricevuto = decodifica(C, new URL(e.link()).hash).it;
  assert.equal(ricevuto.nome, 'Locale'); assert.deepEqual(ricevuto.giorni[0].tappe, ['duomo']);
  assert.equal(ricevuto.giorni[0].fatte, undefined); assert.equal(ricevuto.timbri, undefined);
  assert.deepEqual(e.x.giorni[0].fatte, ['duomo']); assert.deepEqual(e.x.timbri, { duomo: 1234 });
  assert.equal(e.dati.get(CHIAVE), raw);
});

test('recupero con Condividi: un errore del servizio nativo apre il link copiabile', async t => {
  const e = ambiente(t, { share: async () => { throw Error('Non disponibile'); } });
  await e.apri(); assert.equal(e.aperture(), 1); await e.copia();
  assert.equal(decodifica(C, new URL(e.link()).hash).it.nome, 'Locale');
});

test('recupero con Condividi: annullare la finestra nativa conserva la copia senza aprire altri pannelli', async t => {
  const e = ambiente(t, { share: async () => { throw Object.assign(Error('Annullato'), { name: 'AbortError' }); } });
  const prima = structuredClone(e.x); await e.apri();
  assert.equal(e.aperture(), 0); assert.deepEqual(e.x, prima); assert.equal(e.avvisi.length, 0);
});

test('recupero con Condividi: se la copia negli appunti è negata, seleziona il link per copiarlo a mano', async t => {
  const e = ambiente(t, { copiaFallita: true }), prima = e.dati.get(CHIAVE);
  await e.apri(); await e.copia();
  assert.equal(e.selezionato(), true); assert.equal(e.focalizzato(), true);
  assert.match(e.avvisi[0], /premuto sul link/); assert.equal(e.dati.get(CHIAVE), prima);
});
