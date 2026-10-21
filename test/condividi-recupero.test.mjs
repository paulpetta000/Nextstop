import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { creaSalvataggio } from '../src/scripts/itinerari/memoria.ts';
import { codifica, decodifica } from '../src/lib/itinerari/link.ts';
const source = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/fogli.js', import.meta.url), 'utf8');
const da = source.indexOf('const linkDi = '), a = source.indexOf('// ---------- «Altro»', da);
assert.ok(da >= 0 && a > da);
const crea = new Function('d', 'const { X, codifica, esc, ic, foglio, avvisa, $, contestoFoglio, chiudiFoglio } = d; ' + source.slice(da,a).replace('export async function', 'async function') + '; return apriCondividi;');
const CHIAVE = 'itinerari-v1', C = { tappe: [{ id: 'duomo', tipo: 'citta' }] };
const viste = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/viste.js', import.meta.url), 'utf8');
const comandoCondividi = /\bcondividi:\s*(.+?), altro:/.exec(viste)?.[1];
assert.ok(comandoCondividi, 'azione Condividi presente nella delega dei pulsanti');
function ambiente(t, { share, copiaFallita = false, scriviAppunti } = {}) {
  const x = { id: 'viaggio0', nome: 'Locale', salvato: true, creato: 1, modificato: 1, timbri: { duomo: 1234 }, giorni: [{ tappe: ['duomo'], fatte: ['duomo'], inizio: 570, fine: 1140 }] };
  const A = { attivo: x.id, elenco: [x] }, dati = new Map([[CHIAVE, JSON.stringify({ v: 1, ...A })]]);
  let linkCopiato, aperture = 0, selezionato = false, focalizzato = false, ciclo = 0, attivo = x, copie = 0;
  const f = {}, avvisi = [];
  for (const [nome, value] of Object.entries({
    localStorage: { getItem: k => dati.get(k) ?? null, setItem: (k, v) => dati.set(k, v) },
    navigator: { locks: { request: async (_nome, _options, fn) => fn() }, ...(share ? { share } : {}), clipboard: { writeText: async l => { copie++; if(scriviAppunti)await scriviAppunti(l); if (copiaFallita) throw Error('Accesso negato'); linkCopiato = l; } } },
    location: { origin: 'https://esempio.invalid', pathname: '/napoli/itinerari/' }, matchMedia: () => ({ matches: !!share })
  })) {
    const prima = Object.getOwnPropertyDescriptor(globalThis, nome);
    Object.defineProperty(globalThis, nome, { configurable: true, value });
    t.after(() => prima ? Object.defineProperty(globalThis, nome, prima) : delete globalThis[nome]);
  }
  const apri = crea({ X: () => attivo, contestoFoglio: () => {const mio=ciclo;return()=>ciclo===mio;}, chiudiFoglio: () => {ciclo++;}, codifica, esc: s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;'), ic: () => '',
    foglio: (_titolo, html, prepara) => { aperture++; ciclo++; f.html = html; prepara(f); }, avvisa: testo => avvisi.push(testo),
    $: () => ({ focus() { focalizzato = true; }, select() { selezionato = true; } }) });
  const salva = creaSalvataggio();
  return { x, A, dati, f, avvisi, apri, sostituisci: () => {ciclo++;f.html="Altro pannello";}, cambia: () => {attivo={...x,id:"altro"};}, copie: () => copie, salva: () => salva(A), stato: () => salva.stato(), link: () => linkCopiato, aperture: () => aperture, selezionato: () => selezionato, focalizzato: () => focalizzato,
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

test('Condividi dal pulsante del compositore usa il viaggio aperto', async t => {
  const e = ambiente(t);
  const azione = new Function('apriCondividi', 'return (' + comandoCondividi + ');')(e.apri);
  await azione({ dataset: { azione: 'condividi' } }, { type: 'click' });
  assert.equal(e.aperture(), 1);
  await e.copia();
  const ricevuto = decodifica(C, new URL(e.link()).hash).it;
  assert.equal(ricevuto.nome, e.x.nome);
  assert.deepEqual(ricevuto.giorni[0].tappe, ['duomo']);
  assert.equal(ricevuto.giorni[0].fatte, undefined);
  assert.equal(ricevuto.timbri, undefined);
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

test('Condividi: spiega che l’app scelta può leggere il percorso che le viene mandato', async t => {
  const e = ambiente(t); await e.apri();
  assert.doesNotMatch(e.f.html, /non passa da nessun server/);
  assert.match(e.f.html, /nostro server/);
  assert.match(e.f.html, /app.*leggerlo/);
  const wa = new URL(e.f.html.match(/href="(https:\/\/wa.me\/[^\"]+)"/)[1]);
  const ricevuto = wa.searchParams.get('text');
  assert.ok(ricevuto.includes('#' + codifica(e.x)));
  assert.doesNotMatch(ricevuto, /fatte|timbri|1234/);
});
const attesa=()=>{let risolvi,rifiuta;const promessa=new Promise((a,b)=>{risolvi=a;rifiuta=b;});return {promessa,risolvi,rifiuta};};
for(const cambio of ['sostituisci','cambia'])test('Condividi asincrono: errore nativo dopo '+cambio+' non apre un vecchio link',async t=>{const d=attesa(),e=ambiente(t,{share:()=>d.promessa});const p=e.apri();e[cambio]();d.rifiuta(Error('Negato'));await p;assert.equal(e.aperture(),0);});
test('Condividi asincrono: soltanto l’ultima richiesta nativa può aprire il ripiego',async t=>{const a=attesa(),b=attesa();let n=0;const e=ambiente(t,{share:()=>++n===1?a.promessa:b.promessa});const p=e.apri(),q=e.apri();a.rifiuta(Error('Vecchia'));await p;assert.equal(e.aperture(),0);b.rifiuta(Error('Nuova'));await q;assert.equal(e.aperture(),1);});
for(const errore of [false,true])test('Condividi asincrono: appunti '+(errore?'negati':'riusciti')+' dopo altro pannello non annunciano né focalizzano',async t=>{const d=attesa(),e=ambiente(t,{scriviAppunti:()=>d.promessa});await e.apri();const p=e.copia();e.sostituisci();if(errore)d.rifiuta(Error('Negato'));else d.risolvi();await p;assert.deepEqual(e.avvisi,[]);assert.equal(e.focalizzato(),false);assert.equal(e.selezionato(),false);});
test('Condividi asincrono: appunti dopo cambio di viaggio non annunciano il vecchio link',async t=>{const d=attesa(),e=ambiente(t,{scriviAppunti:()=>d.promessa});await e.apri();const p=e.copia();e.cambia();d.risolvi();await p;assert.deepEqual(e.avvisi,[]);});
test('Condividi asincrono: doppio tocco copia una volta e consente un nuovo tentativo alla fine',async t=>{const d=attesa(),e=ambiente(t,{scriviAppunti:()=>d.promessa});await e.apri();const p=e.copia(),q=e.copia();assert.equal(e.copie(),1);d.risolvi();await Promise.all([p,q]);assert.deepEqual(e.avvisi,['Link copiato.']);await e.copia();assert.equal(e.copie(),2);});

test('Condividi asincrono: la copia pendente permette di chiudere il pannello',async t=>{const d=attesa(),e=ambiente(t,{scriviAppunti:()=>d.promessa});await e.apri();const p=e.copia();await e.f.onclick({target:e.f});d.risolvi();await p;assert.deepEqual(e.avvisi,[]);});
