import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
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
