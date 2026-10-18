// Il codice inline della pagina viene eseguito in una VM isolata, senza browser o rete.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { codifica, decodifica } from '../src/lib/itinerari/link.ts';
const pagina = fs.readFileSync(new URL('../src/pages/napoli/itinerari/index.astro', import.meta.url), 'utf8');
const inline = pagina.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const C = { tappe: [{ id: 'duomo', tipo: 'citta' }] };
function apri(indirizzo) {
  const location = new URL(indirizzo), window = {}, classi = new Set(), scritture = [];
  const document = { documentElement: { classList: { add: c => classi.add(c) } } };
  const history = { replaceState: (_stato, _titolo, url) => { location.href = new URL(url, location).href; } };
  const localStorage = { getItem: () => null, setItem: (...args) => scritture.push(args) };
  vm.runInNewContext(inline, { window, location, history, localStorage, document });
  return { window, location, classi, scritture };
}
test('ingresso link: cattura il percorso e pulisce l’indirizzo prima degli script successivi', () => {
  const hash = '#n=Un+nome+privato&d=2026-10-18&g=0930-1900.duomo';
  const e = apri('https://esempio.invalid/napoli/itinerari/' + hash);
  assert.equal(e.window.itinerarioRicevuto, hash);
  assert.equal(e.location.href, 'https://esempio.invalid/napoli/itinerari/');
  assert.equal(e.classi.has('cmp-ha'), true);
  assert.deepEqual(e.scritture, []);
  assert.equal(decodifica(C, e.window.itinerarioRicevuto).it.nome, 'Un nome privato');
});
test('ingresso link: parametri aggiuntivi non importano visite, timbri o consenso alla posizione', () => {
  const p = new URLSearchParams({ n: '"><img src=x onerror=alert(1)>', g: '0930-1900.duomo.__proto__', posizione: 'si', salvato: 'true', fatte: 'duomo', timbri: '{"duomo":1234}', lascia: 'duomo' });
  const r = decodifica(C, '#' + p).it;
  assert.equal(r.nome, '"><img src=x onerror=alert(1)>');
  assert.deepEqual(r.giorni[0].tappe, ['duomo']);
  for (const campo of ['posizione', 'salvato', 'timbri']) assert.equal(r[campo], undefined);
  for (const campo of ['fatte', 'lascia']) assert.equal(r.giorni[0][campo], undefined);
  const link = codifica(r);
  assert.doesNotMatch(link, /posizione|salvato|fatte|timbri|1234|lascia/);
  assert.ok(link.includes('n=%22%3E%3Cimg'));
  const base = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/base.js', import.meta.url), 'utf8');
  const esc = vm.runInNewContext(base.match(/^export const esc = .*$/m)[0].replace('export ', '') + ';esc');
  const viste = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/viste.js', import.meta.url), 'utf8');
  const nomeBottone = new Function('X', 'esc', 'ic', viste.match(/^const nomeBottone = .*$/m)[0] + ';return nomeBottone;')(() => r, esc, () => '');
  const html = nomeBottone();
  assert.doesNotMatch(html, /<img/); assert.ok(html.includes('&quot;&gt;&lt;img'));

});
test('ingresso link: richiesta da Dove mangiare e percorso ricevuto vengono entrambi ripuliti', () => {
  const e = apri('https://esempio.invalid/napoli/itinerari/?aggiungi=duomo&g=0#n=Ricevuto&g=0930-1900.duomo');
  assert.equal(e.window.daAggiungere, '?aggiungi=duomo&g=0');
  assert.equal(e.window.itinerarioRicevuto, '#n=Ricevuto&g=0930-1900.duomo');
  assert.equal(e.location.search, ''); assert.equal(e.location.hash, '');
});