import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as calendario from '../src/lib/itinerari/calendario.ts';
import * as date from '../src/lib/itinerari/date.ts';

// Esegue il disegno reale con un contenitore fittizio; nessun browser o DOM esterno.
const sorgente = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/calendario.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?$/gm, '').replace(/^export /gm, '');
function disegna(data, oggi = '2026-10-18') {
  const el = { innerHTML: '' }, viaggio = { data, giorni: [{ tappe: [] }] };
  const dipendenze = { ...calendario, ...date, $: () => el, ic: () => '', oggi: () => oggi, T: () => null,
    X: () => viaggio, nG: () => 1, aggiorna: () => assert.fail('Nessuna modifica durante il disegno'), STILE: '', piano: () => false };
  new Function(...Object.keys(dipendenze), sorgente + ';disegna();')(...Object.values(dipendenze));
  return { html: el.innerHTML, viaggio };
}

test('calendario: un link fuori periodo resta visibile e ha un solo giorno abilitato raggiungibile da Tab', () => {
  for (const data of ['2025-12-31', '2031-01-01']) {
    const { html, viaggio } = disegna(data);
    assert.ok(html.includes(`data-d="${data}"`));
    const fuochi = [...html.matchAll(/<button\b[^>]*class="cal-g[^>]*tabindex="0"[^>]*>/g)].map(x => x[0]);
    assert.equal(fuochi.length, 1);
    assert.ok(!fuochi[0].includes(' disabled'));
    assert.equal(viaggio.data, data, 'il disegno non cambia la data ricevuta');
  }
});

test('calendario: resta un ingresso da tastiera quando oggi è oltre il periodo ammesso', () => {
  const { html } = disegna(undefined, '2031-01-01');
  assert.match(html, /data-d="2030-12-31"[^>]*tabindex="0"/);
});
