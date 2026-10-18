import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { spacchettaVivo } from '../src/lib/itinerari/pacco.ts';
import {spacchetta,aggiungiScenari,impacchetta} from '../src/lib/itinerari/pacco.ts';
const pack=()=>({n:2,tappe:[],linee:{},zone:{},dizionario:['B1',''],feriale:{min:[0,15,15,0],metri:[0,30,30,0],mezzi:[1,0,0,1]},piedi:[1,45,150,1,1,50,160,1]});
test('pacco: i tempi a piedi sono corretti prima di caricare scenari.json',()=>{const C=spacchetta(pack());
  assert.deepEqual(C.tempi.min.piedi,[0,45,50,0]);
  assert.deepEqual(C.tempi.metri.piedi,[0,1500,1600,0]);
  assert.deepEqual(C.tempi.mezzi.piedi,['','','','']);
  assert.deepEqual(C.tempi.mezzi.feriale,['','B1','B1','']);});
test('pacco: gli scenari successivi mantengono i tempi a piedi',()=>{const C=spacchetta(pack());aggiungiScenari(C,{dizionario:[''],diff:{piedi:pack().piedi.map((v,i)=>i%4===3?0:v)}});
  assert.deepEqual(C.tempi.min.piedi,[0,45,50,0]);
  assert.deepEqual(C.tempi.mezzi.piedi,['','','','']);});

test('pacco: uno scenario parziale non sovrascrive i tempi a piedi già presenti',()=>{const C=spacchetta(pack());aggiungiScenari(C,{dizionario:[''],diff:{sabato:[]}});
  assert.deepEqual(C.tempi.min.piedi,[0,45,50,0]);});
test('pacco: feriale e piedi fanno andata/ritorno senza dipendere dalla città',()=>{const C=spacchetta(pack());
  const nuovo=impacchetta(C);
  const copia=spacchetta(nuovo);for(const s of ['feriale','piedi']){assert.deepEqual(copia.tempi.min[s],C.tempi.min[s]);
  assert.deepEqual(copia.tempi.metri[s],C.tempi.metri[s]);
  assert.deepEqual(copia.tempi.mezzi[s],C.tempi.mezzi[s]);}});

test('scenari: rifiuta un pacco incompleto senza cambiare i tempi già disponibili', () => {
  for (const diff of [
    { sabato: [1, 9, 2] },
    { sabato: [1, 9, 2, 0], domenica: [4, 8, 2, 0] },
    { sabato: [1, 9, 2, 7] },
    { sabato: [-1, 9, 2, 0] }
  ]) {
    const C = spacchetta(pack()), prima = structuredClone(C);
    assert.throws(() => aggiungiScenari(C, { dizionario: [''], diff }));
    assert.deepEqual(C, prima, 'Non applicare solo la prima parte del pacco');
  }
});

test('scenari: i giorni derivati ereditano gli aggiornamenti dello stesso pacco', () => {
  const C = spacchetta(pack());
  aggiungiScenari(C, { dizionario: [''], diff: { sabato: [1, 20, 40, 0], 'sabato-pomeriggio': [2, 30, 50, 0] } });
  assert.deepEqual(C.tempi.min.sabato, [0, 20, 15, 0]);
  assert.deepEqual(C.tempi.min['sabato-pomeriggio'], [0, 20, 30, 0]);
  assert.deepEqual(C.tempi.min.piedi, [0, 45, 50, 0]);
});

test('pacco iniziale: matrici delle distanze e mezzi incomplete vengono rifiutate', () => {
  for (const campo of ['metri', 'mezzi']) {
    const P = pack(); P.feriale[campo].pop();
    assert.throws(() => spacchetta(P));
  }
});

const vivo = () => ({ preferenza: 5, dal: '20261017', al: '20261017', giorni: { '20261017': 0 }, tipi: [{ salite: { 'B1|a': [600, 15] }, viaggi: { 'B1|a|b': 10 } }], fermate: { a: 'Fermata A' }, dizionario: ['B1'], candidati: [[[5, 'B1|a|b'], 20, 0]], senza: { feriale: [1, 30, 40, 0] }, bus: { feriale: [1, 1, 0] } });

test('bus: una lunghezza negativa viene rifiutata senza bloccare il processo', () => {
  const P = vivo(); P.bus.feriale = [1, -2];
  const code = 'import {spacchettaVivo} from ' + JSON.stringify(new URL('../src/lib/itinerari/pacco.ts', import.meta.url).href) + ';try{spacchettaVivo(' + JSON.stringify(P) + ');process.exit(2);}catch{process.exit(0);}';
  const child = spawnSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', code], { timeout: 2000, encoding: 'utf8' });
  assert.equal(child.status, 0, child.error?.message || child.stderr || 'Pacco bus malformato accettato');
});

test('bus: conteggi troncati e riferimenti fuori dai candidati vengono rifiutati', () => {
  for (const v of [[1, 2, 0], [1, 1, 9], [1, 0.5, 0]]) {
    const P = vivo(); P.bus.feriale = v;
    assert.throws(() => spacchettaVivo(P));
  }
});

test('bus: un pacco valido conserva corse, viaggi, distanze e candidati', () => {
  const V = spacchettaVivo(vivo());
  assert.deepEqual(V.salite[0].get('B1|a'), [600, 615]);
  assert.deepEqual(V.viaggi[0].get('B1|a|b'), { min: 10 });
  assert.deepEqual(V.bus.feriale.get(1), [0]);
  assert.deepEqual(V.senza.feriale.get(1), { min: 30, metri: 400, mezzi: 'B1' });
  assert.deepEqual(V.candidati[0], { seg: [5, 'B1|a|b'], metri: 200, mezzi: 'B1' });
});

// Pacchi JSON incompleti non devono entrare nel calcolo delle corse.
test('bus: rifiuta tempi, distanze e dizionari incompleti nel ripiego senza bus', () => {
  for (const v of [[1, 30, 40], [1, -1, 40, 0], [1, 30, -1, 0], [1, 30, 40, 9], [1, 30, '40', 0]]) {
    const P = vivo(); P.senza.feriale = v;
    assert.throws(() => spacchettaVivo(P), JSON.stringify(v));
  }
});
test('bus: rifiuta differenze negative e orari non numerici prima del calcolo', () => {
  for (const v of [[600, -15], [600, '15'], [NaN], [Infinity], null]) {
    const P = vivo(); P.tipi[0].salite['B1|a'] = v;
    assert.throws(() => spacchettaVivo(P), JSON.stringify(v));
  }
});
test('bus: rifiuta durate di viaggio errate e partenze parziali', () => {
  for (const v of [-10, '10', [], [-10, 600], [10, 600, -15], [NaN, 600]]) {
    const P = vivo(); P.tipi[0].viaggi['B1|a|b'] = v;
    assert.throws(() => spacchettaVivo(P), JSON.stringify(v));
  }
});
test('bus: rifiuta candidati con segmenti, distanze o mezzi non validi', () => {
  for (const v of [[[5, {}], 20, 0], [[-5, 'B1|a|b'], 20, 0], [[5, 'B1|a'], 20, 0], [[5, 'B1|a|b'], -20, 0], [[5, 'B1|a|b'], 20, 9], [[5], 20], [[], 20, 0]]) {
    const P = vivo(); P.candidati[0] = v;
    assert.throws(() => spacchettaVivo(P), JSON.stringify(v));
  }
});
test('bus: date e tipi di giorno non validi non attivano gli orari veri', () => {
  for (const modifica of [P => P.giorni['20261017'] = 9, P => P.giorni['20261017'] = '0', P => P.giorni['20260230'] = 0, P => P.al = '20261016', P => P.preferenza = -5, P => P.fermate.a = {}]) {
    const P = vivo(); modifica(P);
    assert.throws(() => spacchettaVivo(P));
  }
});
test('bus: partenze dopo mezzanotte, frazioni e giorni senza una corsa restano validi', () => {
  const P = vivo(); P.tipi[0].salite['B1|a'] = [1430, 20, 0];
  P.tipi[0].viaggi['B1|a|b'] = [10.5, 1450];
  P.tipi.push({ salite: {}, viaggi: {} }); P.giorni['20261018'] = 1; P.al = '20261018';
  const V = spacchettaVivo(P);
  assert.deepEqual(V.salite[0].get('B1|a'), [1430, 1450, 1450]);
  assert.deepEqual(V.viaggi[0].get('B1|a|b'), { min: 10.5, partenze: [1450] });
  assert.equal(V.giorni['20261018'], 1);
  assert.equal(V.viaggi[1].size, 0);
});
// Funzione reale del caricamento differito con rete e città fittizie.
const stato = fs.readFileSync(new URL('../src/scripts/itinerari/compositore/stato.js', import.meta.url), 'utf8');
const daCarica = stato.indexOf('export async function caricaDopo('), aCarica = stato.indexOf('// la mappa di oggi', daCarica);
assert.ok(daCarica >= 0 && aCarica > daCarica);
const preparaCarica = new Function('d', 'const { C, fetch, quandoLibero, aggiungiScenari, spacchettaVivo, memoOrdine, ricalcola } = d; ' + stato.slice(daCarica, aCarica).replace('export ', '') + '; return caricaDopo;');
test('bus: il caricamento reale rifiuta il pacco rotto prima di cambiare la città e si riprende con quello valido', async () => {
  const prima = { disponibile: true }, C = { vivo: prima }, P = vivo();
  let p = structuredClone(P), ricalcoli = 0, aggiornamenti = 0, svuotamenti = 0;
  p.tipi[0].viaggi['B1|a|b'] = -10;
  const carica = preparaCarica({ C, quandoLibero: async () => {}, spacchettaVivo, aggiungiScenari, memoOrdine: { clear() { svuotamenti++; } }, ricalcola() { ricalcoli++; },
    fetch: async url => Response.json(url.endsWith('partenze.json') ? p : null) });
  await carica(() => aggiornamenti++); await new Promise(r => setImmediate(r));
  assert.equal(C.vivo, prima); assert.equal(ricalcoli, 0); assert.equal(aggiornamenti, 0); assert.equal(svuotamenti, 0);
  p = P;
  await carica(() => aggiornamenti++); await new Promise(r => setImmediate(r));
  assert.deepEqual(C.vivo, spacchettaVivo(P)); assert.equal(ricalcoli, 1); assert.equal(aggiornamenti, 1); assert.equal(svuotamenti, 1);
});
