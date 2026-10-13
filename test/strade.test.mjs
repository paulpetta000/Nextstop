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
