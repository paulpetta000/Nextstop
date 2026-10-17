import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Controllo dei ruoli della palette dichiarati nei CSS; non sostituisce la prova visiva.
const css = ['compositore.css', 'ore.css'].map(f => readFileSync(new URL('../src/styles/' + f, import.meta.url), 'utf8')).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
function dichiarazioni(selettore) {
  const valori = {};
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (m[1].trim().replace(/\s+/g, ' ') !== selettore) continue;
    for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) valori[d[1]] = d[2].trim().toUpperCase();
  }
  return valori;
}
function palette(vista, tema) {
  return {...dichiarazioni(`html.p${vista} .cmp`), ...(tema === 'light' ? {} : dichiarazioni(`:root.p${vista}${tema === 'dark' ? '[data-theme="dark"]' : ':not([data-theme="light"])'} .cmp`))};
}
const ruoli = ['--acc', '--acc-chiaro', '--fuoco', '--sel', '--m-rotta', '--m-segno', '--f-acc', '--salva-fondo', '--nuova', '--t-cammino', '--t-acc', '--cal-fascia', '--ore-libero'];
for (const tema of ['light', 'dark', 'auto-dark']) test(`colori: accenti blu coerenti fra Mappa e Pagine (${tema})`, () => {
  const c = palette('c', tema), d = palette('d', tema);
  for (const ruolo of ruoli) { assert.ok(d[ruolo], `Riferimento mancante: ${ruolo}`); assert.equal(c[ruolo], d[ruolo], ruolo); }
});
const luminanza = hex => hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((tot, x, i) => tot + x * [.2126, .7152, .0722][i], 0);
test('colori: testo dei comandi principali con contrasto AA nei due temi', () => {
  for (const vista of ['c', 'd']) for (const tema of ['light', 'dark', 'auto-dark']) {
    const p = palette(vista, tema), a = luminanza(p['--acc']), b = luminanza(p['--su-acc']);
    assert.ok((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5, `${vista}/${tema}`);
  }
});
