import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const comune = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/comuni.js', import.meta.url), 'utf8');
const ciclo = comune.slice(comune.indexOf('export const foglioEl'), comune.indexOf('// ridisegna il contenuto vivo')).replace(/^export /gm, '');
const prepara = comune.slice(comune.indexOf('export function preparaFoglio'), comune.indexOf('// ---------- avviso in basso')).replace(/^export /gm, '');
const pasto = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/pasto.js', import.meta.url), 'utf8');
const contesto = pasto.slice(pasto.indexOf('function contestoPasto'), pasto.indexOf('function apriMenu'));
const clic = pasto.slice(pasto.indexOf('async function clic'), pasto.indexOf('// le azioni delle righe del pasto'));

function ambiente(movimento) {
  let x = { id: 'prova', giorni: [{ tappe: ['luogo'] }] };
  const eventi = new Map(), nativi = [], timer = [], attese = [], scelte = [], S = { g: 0, p: 'c' };
  const f = { open: false, style: {}, classList: { add() {}, remove() {} },
    showModal() { this.open = true; },
    close() { this.open = false; nativi.push(() => eventi.get('close')?.({})); },
    addEventListener: (k, fn) => eventi.set(k, fn) };
  const d = { $: sel => sel === '#foglio' ? f : {}, esc: String, ic: () => '', piano: () => movimento,
    setTimeout: fn => timer.push(fn), tiraPerChiudere() {}, addEventListener() {} };
  const api = new Function(...Object.keys(d), ciclo + prepara + ';return {foglio,preparaFoglio,contestoFoglio,dopoChiusuraFoglio,chiudiFoglio};')(...Object.values(d));
  const dip = { ...api, S, X: () => x,
    dopo: () => new Promise(ok => attese.push(ok)), mangiaQui: (m, id) => scelte.push([m.g, m.q, id]) };
  const collega = new Function(...Object.keys(dip), contesto + clic + ';return collegaPasto;')(...Object.values(dip));
  api.preparaFoglio();
  api.foglio('Il menù del pranzo', '', f => collega(f, { g: 0, q: 'pranzo' }));
  return { ...api, f, S, scelte,
    scegli: () => f.onclick({ target: { closest: () => ({ dataset: { f: 'scegli', v: 'locale' } }) } }),
    cambia: () => { x = structuredClone(x); },
    async completa() {
      timer.splice(0).forEach(fn => fn());
      // Prima le continuazioni di close(), poi il suo evento nativo accodato,
      // infine l'eventuale attesa aggiuntiva del gestore del pasto.
      for (let i = 0; i < 8; i++) await Promise.resolve();
      nativi.splice(0).forEach(fn => fn());
      attese.splice(0).forEach(fn => fn());
    } };
}

for (const movimento of [false, true]) {
  test(`pasto: Mangia qui applica la scelta anche con evento close accodato (animazione ${movimento})`, async () => {
    const e = ambiente(movimento), p = e.scegli();
    await e.completa(); await p;
    assert.equal(e.f.open, false);
    assert.deepEqual(e.scelte, [[0, 'pranzo', 'locale']]);
  });
}

test('pasto: un altro foglio durante la chiusura annulla la scelta', async () => {
  const e = ambiente(true), p = e.scegli();
  e.foglio('Altra finestra', 'nuovo contenuto');
  await e.completa(); await p;
  assert.equal(e.f.open, true); assert.deepEqual(e.scelte, []);
});

test('pasto: cambiare viaggio durante la chiusura annulla la scelta', async () => {
  const e = ambiente(true), p = e.scegli(); e.cambia();
  await e.completa(); await p;
  assert.deepEqual(e.scelte, []);
});

test('pasto: due tocchi su Mangia qui aggiungono il locale una volta', async () => {
  const e = ambiente(true), a = e.scegli(), b = e.scegli();
  await e.completa(); await Promise.all([a, b]);
  assert.deepEqual(e.scelte, [[0, 'pranzo', 'locale']]);
});
