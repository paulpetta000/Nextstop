import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as stile from '../src/scripts/itinerari/stile.mjs';
class Link extends EventTarget {
  sheet = null; media = 'print'; dataset = {}; href = '/_astro/compositore.css';
  cloneNode() { const nuovo = new Link(); nuovo.dataset = { ...this.dataset }; nuovo.href = this.href; return nuovo; }
  replaceWith(nuovo) { this.sostituito = nuovo; }
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('avvio senza stile: l’errore già avvenuto offre un nuovo tentativo senza avviare il compositore', async () => {
  const l = new Link(); l.dataset.errore = 'si'; let avvii = 0, riprova;
  await stile.avviaConStile(l, () => avvii++, fn => { riprova = fn; });
  assert.equal(avvii, 0); assert.equal(typeof riprova, 'function');
});

test('avvio senza stile: Riprova carica lo stesso URL, aspetta il foglio e avvia una sola volta', async () => {
  const l = new Link(); l.dataset.errore = 'si'; let avvii = 0, riprova;
  await stile.avviaConStile(l, () => avvii++, fn => { riprova = fn; });
  const p = riprova(), nuovo = l.sostituito;
  assert.equal(nuovo.href, l.href); assert.equal(nuovo.dataset.errore, undefined); assert.equal(avvii, 0);
  await riprova(); assert.equal(nuovo.sostituito, undefined);
  nuovo.sheet = {}; nuovo.dispatchEvent(new Event('load')); await p;
  assert.equal(avvii, 1); assert.equal(nuovo.media, 'all');
  await riprova(); assert.equal(avvii, 1);
});

test('avvio senza stile: un secondo errore lascia riprovare di nuovo', async () => {
  const l = new Link(); let avvii = 0, errori = 0, riprova;
  const iniziale = stile.avviaConStile(l, () => avvii++, fn => { errori++; riprova = fn; });
  l.dispatchEvent(new Event('error')); await iniziale;
  const secondo = riprova(); l.sostituito.dispatchEvent(new Event('error')); await secondo;
  assert.equal(errori, 2); assert.equal(avvii, 0);
  const terzo = riprova(), ultimo = l.sostituito.sostituito;
  ultimo.sheet = {}; ultimo.dispatchEvent(new Event('load')); await terzo;
  assert.equal(avvii, 1);
});

test('avvio senza stile: l’attesa senza eventi termina e permette il recupero', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const l = new Link(); let fallito = false;
  const p = stile.attendiStile(l).catch(() => { fallito = true; });
  t.mock.timers.tick(10000); await Promise.resolve();
  assert.equal(fallito, true); await p;
});

test('avvio senza stile: la schermata di recupero è visibile anche per chi ha itinerari salvati', async () => {
  const classi = new Set(['cmp-ha']), bottone = { disabled: false }, app = { innerHTML: '', querySelector: () => bottone };
  let tentativi = 0;
  stile.mostraErroreStile(app, { classList: { remove: c => classi.delete(c) } }, async () => { tentativi++; });
  assert.equal(classi.has('cmp-ha'), false); assert.match(app.innerHTML, /Riprova/); assert.match(app.innerHTML, /restano sul telefono/);
  await bottone.onclick(); assert.equal(tentativi, 1); assert.equal(bottone.disabled, true);
});

test('avvio senza stile: un errore applicativo non viene scambiato per errore del foglio né ritentato', async () => {
  const l = new Link(); l.sheet = {}; let avvii = 0, erroriStile = 0;
  await assert.rejects(stile.avviaConStile(l, () => { avvii++; throw Error('Applicazione'); }, () => erroriStile++), /Applicazione/);
  assert.equal(avvii, 1); assert.equal(erroriStile, 0);
});
