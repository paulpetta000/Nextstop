import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { nomiDelPercorso, pezziDi, rileggi, riquadroDi } from '../src/lib/itinerari/strade.ts';

// Le strade a pezzi della mappa (specifiche/compositore.md §6): calcoli senza pagina e controllo del file dei pezzi.

test('rileggi: numeri corti e differenze', () => {
  assert.deepEqual(rileggi('M10 20l1.5-2 .5.5-3 0'), [[10, 20], [11.5, 18], [12, 18.5], [9, 18.5]]);
  assert.deepEqual(rileggi('M.5-.5l-.5.5'), [[0.5, -0.5], [0, 0]]);
  assert.deepEqual(rileggi('M1 2l'), [[1, 2]]);
});

test('rileggi: un path incompleto o con testo estraneo non restituisce un pezzo plausibile',()=>{
 for(const d of ['M0 0l1','M0 0l1 2errore','X0 0l1 2','M0 0l1 2l3 4','M1','M'])assert.deepEqual(rileggi(d),[],d);
});
test('rileggi: numeri e somme non finiti non arrivano alla geometria della mappa',()=>{
 for(const d of ['M'+'9'.repeat(400)+' 0','M0 0l'+'9'.repeat(400)+' 0','M'+'9'.repeat(308)+' 0l'+'9'.repeat(308)+' 0'])assert.deepEqual(rileggi(d),[]);
});

test('pezziDi: solo i pezzi che toccano la vista, con il margine, e che esistono', () => {
  const esistono = new Set(['0_0', '1_0', '0_1', '1_1', '5_5']);
  assert.deepEqual(pezziDi({ x: 10, y: 10, w: 50, h: 50 }, 256, esistono), ['0_0']);
  assert.deepEqual(pezziDi({ x: 200, y: 10, w: 100, h: 50 }, 256, esistono), ['0_0', '1_0']);
  assert.deepEqual(pezziDi({ x: 10, y: 10, w: 50, h: 50 }, 256, esistono, 220), ['0_0', '0_1', '1_0', '1_1']);
  assert.deepEqual(pezziDi({ x: -600, y: -600, w: 50, h: 50 }, 256, esistono), []);
});

test('riquadroDi', () => {
  assert.equal(riquadroDi([]), null);
  assert.deepEqual(riquadroDi([[1, 5], [4, 2]]), { x: 1, y: 2, w: 3, h: 3 });
});

test('nomiDelPercorso: le vie lunghe almeno 120 m lungo il percorso, una volta sola, da sinistra a destra', () => {
  const vie = [
    { nome: 'Via Lunga', punti: [[0, 0], [100, 0]] },
    { nome: 'Vico Corto', punti: [[100, 0], [100, 15]] },     // 75 m: troppo corto per il nome
    { nome: 'Via Lontana', punti: [[0, 50], [100, 50]] }       // 250 m dal percorso
  ];
  // il percorso va da destra a sinistra sulla via lunga, poi gira nel vicolo
  const r = nomiDelPercorso([[[90, 1], [10, 1]], [[100, 0], [100, 15]]], vie);
  assert.deepEqual(r.map(x => x.nome), ['Via Lunga']);
  assert.ok(r[0].L >= 78 && r[0].L <= 80);
  const p = r[0].punti;
  assert.ok(p[0][0] < p[p.length - 1][0], 'scritto da sinistra a destra');
  // la stessa via percorsa due volte: un nome solo, il tratto più lungo
  assert.equal(nomiDelPercorso([[[0, 1], [40, 1]], [[50, 1], [100, 1]]], vie).filter(x => x.nome === 'Via Lunga').length, 1);
  // senza vie (pezzi non ancora arrivati) nessun nome
  assert.deepEqual(nomiDelPercorso([[[0, 0], [100, 0]]], []), []);
});

test('src/data/strade.json: pezzi nella griglia della mappa, path che si rileggono, nomi principali', () => {
  const S = JSON.parse(fs.readFileSync(new URL('../src/data/strade.json', import.meta.url), 'utf8'));
  const M = JSON.parse(fs.readFileSync(new URL('../src/data/mappa.json', import.meta.url), 'utf8'));
  assert.match(S.fonte, /^OpenStreetMap \(ODbL\), dati del \d{4}-\d{2}-\d{2}$/);
  const nx = Math.ceil(M.w / S.lato), ny = Math.ceil(M.h / S.lato);
  const chiavi = Object.keys(S.pezzi);
  assert.ok(chiavi.length > 20);
  for (const k of chiavi) {
    const [i, j] = k.split('_').map(Number);
    assert.ok(i >= 0 && j >= 0 && i < nx && j < ny, `pezzo fuori dalla mappa: ${k}`);
    const p = S.pezzi[k];
    for (const c of ['g', 'm', 'p', 'v', 's']) {
      if (!p[c]) continue;
      for (const d of p[c].split('M').filter(Boolean)) {
        const [a, b = ''] = d.split('l');
        assert.equal((a.match(/-?(?:\d+\.?\d*|\.\d+)/g) || []).length, 2, `${k}/${c}: inizio non valido`);
        assert.equal((b.match(/-?(?:\d+\.?\d*|\.\d+)/g) || []).length % 2, 0, `${k}/${c}: numeri dispari`);
      }
    }
    for (const [nome, classe, L, d] of p.n) {
      assert.ok(nome && 'gmpvs'.includes(classe) && L >= 12, `${k}: nome non valido`);
      assert.ok(rileggi(d).length >= 2);
    }
  }
  assert.ok(S.principali.length > 100);
  for (const [nome, L, d] of S.principali) assert.ok(nome && L > 30 && rileggi(d).length >= 2);
});

// Il processo separato protegge la suite dal ciclo bloccante riprodotto prima della correzione.
import { spawnSync } from 'node:child_process';
const provaPezzi = corpo => {
  const codice = 'import assert from "node:assert/strict";import {pezziDi} from ' + JSON.stringify(new URL('../src/lib/itinerari/strade.ts', import.meta.url).href) + ';' + corpo;
  const r = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings=ExperimentalWarning', '--input-type=module', '-e', codice], { encoding: 'utf8', timeout: 1500 });
  assert.equal(r.status, 0, r.error?.message || r.stderr || 'Selezione dei pezzi bloccata');
};

const provaNomi = corpo => {
  const codice = 'import assert from "node:assert/strict";import {nomiDelPercorso} from ' + JSON.stringify(new URL('../src/lib/itinerari/strade.ts', import.meta.url).href) + ';' + corpo;
  const r = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings=ExperimentalWarning', '--input-type=module', '-e', codice], { encoding: 'utf8', timeout: 1500 });
  assert.equal(r.status, 0, r.error?.message || r.stderr || 'Ricerca dei nomi bloccata');
};

test('nomiDelPercorso: una via enorme non avvia miliardi di celle', () => {
  provaNomi('assert.deepEqual(nomiDelPercorso([[[0,0],[40,0]]],[{nome:"Via fittizia",punti:[[0,0],[1e12,0]]}]),[]);');
});

test('nomiDelPercorso: anche il campionamento di una linea enorme ha un limite', () => {
  provaNomi('assert.deepEqual(nomiDelPercorso([[[0,0],[1e12,0]]],[{nome:"Via fittizia",punti:[[0,0],[40,0]]}]),[]);');
});

test('nomiDelPercorso: gli indici fuori dalla precisione intera non fermano il ciclo', () => {
  provaNomi('assert.deepEqual(nomiDelPercorso([[[1e20,0],[1e20,0]]],[{nome:"Via fittizia",punti:[[1e20,0],[1e20,0]]}]),[]);');
});

test('nomiDelPercorso: opzioni e geometrie non valide non producono nomi parziali', () => {
  const linee = [[[0, 0], [40, 0]]], vie = [{ nome: 'Via fittizia', punti: [[0, 0], [40, 0]] }];
  for (const opzioni of [{ vicino: -1 }, { vicino: NaN }, { minimo: NaN }, { minimo: -1 }]) {
    assert.deepEqual(nomiDelPercorso(linee, vie, opzioni), []);
  }
  for (const punto of [[NaN, 0], [0, Infinity], [0], null]) {
    assert.deepEqual(nomiDelPercorso([...linee, [[0, 0], punto]], vie), []);
    assert.deepEqual(nomiDelPercorso(linee, [...vie, { nome: 'Non valida', punti: [[0, 0], punto] }]), []);
  }
  provaNomi('assert.deepEqual(nomiDelPercorso([[[0,0],[40,0]]],[{nome:"Via fittizia",punti:[[0,0],[40,0]]}],{vicino:Infinity}),[]);');
});

test('nomiDelPercorso: uno stesso punto ripetuto resta valido senza inventare lunghezza', () => {
  const vie = [{ nome: 'Via fittizia', punti: [[0, 0], [40, 0]] }];
  assert.deepEqual(nomiDelPercorso([[[0, 0], [0, 0]]], vie), []);
  assert.equal(nomiDelPercorso([[[0, 0], [0, 0], [40, 0]]], vie)[0].L, 40);
});

test('nomiDelPercorso: anche molti segmenti piccoli rispettano i limiti complessivi', () => {
  const via = { nome: 'Via fittizia', punti: [[0, 0], [40, 0]] };
  assert.deepEqual(nomiDelPercorso([via.punti], Array(25_001).fill(via)), [], 'riferimenti complessivi');
  assert.deepEqual(nomiDelPercorso(Array(501).fill(via.punti), Array(2_001).fill(via)), [], 'confronti, senza tenere i primi nomi');
  assert.deepEqual(nomiDelPercorso(Array(5_001).fill(via.punti), [via]), [], 'campioni complessivi');
});
test('pezziDi: un lato zero non blocca la pagina', () => {
  provaPezzi('assert.deepEqual(pezziDi({x:10,y:10,w:50,h:50},0,new Set(["0_0"])),[]);');
});
test('pezziDi: una vista enorme visita solo i pezzi esistenti', () => {
  provaPezzi('assert.deepEqual(pezziDi({x:-1e12,y:-1e12,w:2e12,h:2e12},256,new Set(["5_5","0_1","1_0","0_0"])),["0_0","0_1","1_0","5_5"]);');
});
test('pezziDi: input non finiti o chiavi non canoniche non inventano pezzi', () => {
  const s = new Set(['0_0', '00_0', '1_0', '0_1']);
  assert.deepEqual(pezziDi({ x: 10, y: 10, w: 50, h: 50 }, Infinity, s), []);
  assert.deepEqual(pezziDi({ x: 10, y: 10, w: -1, h: 50 }, 256, s), []);
  assert.deepEqual(pezziDi({ x: 0, y: 0, w: 10, h: 10 }, 256, s), ['0_0']);
});
