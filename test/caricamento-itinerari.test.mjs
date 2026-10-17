import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creaCaricaJson, applicaSchede } from '../src/scripts/itinerari/caricamento.mjs';

test('caricamento: un HTTP 503 non impedisce di riprovare quando il server torna disponibile', async () => {
  let chiamate = 0;
  const carica = creaCaricaJson('/dati.json', async () => ++chiamate === 1 ? new Response('', { status: 503 }) : Response.json({ percorso: 'nuovo' }));
  assert.equal(await carica(), null);
  assert.deepEqual(await carica(), { percorso: 'nuovo' });
  assert.equal(chiamate, 2);
});

test('caricamento: richieste contemporanee e successive condividono il risultato riuscito', async () => {
  let chiamate = 0;
  const carica = creaCaricaJson('/dati.json', async () => { chiamate++; return Response.json({ percorso: 'valido' }); });
  const [a, b] = await Promise.all([carica(), carica()]);
  assert.deepEqual(a, { percorso: 'valido' }); assert.strictEqual(a, b);
  assert.strictEqual(await carica(), a); assert.equal(chiamate, 1);
});

for (const errore of ['rete', 'json']) test('caricamento: dopo errore ' + errore + ' si può riprovare', async () => {
  let chiamate = 0;
  const carica = creaCaricaJson('/dati.json', async () => {
    if (++chiamate > 1) return Response.json({ ok: true });
    if (errore === 'rete') throw Error('Offline');
    return new Response('{');
  });
  assert.equal(await carica(), null);
  assert.deepEqual(await carica(), { ok: true });
});

// Documento finto: nessun browser o dato della sessione personale.
const doc = (json, templates = [{ id: 'it-t-duomo', content: 'SCHEDA' }]) => ({ querySelectorAll: () => templates, getElementById: () => json === undefined ? null : { textContent: json } });

test('schede: un JSON malformato non pubblica modelli parziali', () => {
  const modelli = new Map([['esistente', 'PRIMA']]), ui = { esistente: { frase: 'Prima' } };
  assert.throws(() => applicaSchede(doc('{'), modelli, ui, x => x));
  assert.deepEqual([...modelli], [['esistente', 'PRIMA']]);
  assert.deepEqual(ui, { esistente: { frase: 'Prima' } });
});

test('schede: una pagina HTML priva dei dati richiesti non risulta caricata', () => {
  for (const d of [doc(undefined), doc('{}', []), doc('null'), doc('[]')]) assert.throws(() => applicaSchede(d, new Map(), {}, x => x));
});

test('schede: dopo un errore si applica il documento completo e si conserva la foto iniziale', () => {
  const modelli = new Map(), ui = { duomo: { foto: 'FOTO' } };
  try { applicaSchede(doc('{'), modelli, ui, x => x); } catch {}
  applicaSchede(doc('{"duomo":{"frasi":[{"t":"Una frase","da":"Fonte"}]}}'), modelli, ui, x => x);
  assert.deepEqual([...modelli], [['duomo', 'SCHEDA']]);
  assert.deepEqual(ui.duomo, { foto: 'FOTO', frasi: [{ t: 'Una frase', da: 'Fonte' }] });
});

test('schede: un documento parziale non esclude le schede già previste dal pacco iniziale', () => {
  const modelli = new Map(), ui = { duomo: { foto: 'D' }, museo: { foto: 'M' } };
  assert.throws(() => applicaSchede(doc('{"duomo":{}}'), modelli, ui, x => x));
  assert.equal(modelli.size, 0);
  assert.deepEqual(ui, { duomo: { foto: 'D' }, museo: { foto: 'M' } });
});
