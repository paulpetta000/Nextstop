// Le strade di tutta la mappa a pezzi (specifiche/compositore.md §6, proposta 1 scelta da Enrico il 14/10/2026):
// vicoli, scale, pedonali, strade medie e grandi e i nomi delle vie di OpenStreetMap (ODbL), in pezzi quadrati da 1,28 km
// che la pagina scarica solo dove si guarda (src/lib/itinerari/strade.ts, src/scripts/itinerari/compositore/mappa.js, blocco D della costruzione).
// Scrive src/data/strade.json: { fonte, lato, pezzi: { "i_j": { g, m, p, v, s, n } }, principali }.
// Uso: node scripts/mappa/strade.mjs scarica <file.json>   (Overpass: tutte le «way[highway]» del riquadro, circa 14 MB)
//      node scripts/mappa/strade.mjs <file.json>
// Prove e misure da cui nasce: design/compositore/mappa-giro-1/pezzi.mjs, ricerca/2026-10-14-mappa-peso.md.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { BOX } from './riquadro.mjs';
import { scriviFile } from '../scrivi-file.mjs';

// Solo il risultato della query «way[highway]; out tags geom»: non un JSON parziale o un'altra esportazione OSM.
function leggiStrade(contenuto) {
  const errore = messaggio => { throw new Error('Strade OSM: ' + messaggio); };
  let osm;
  try { osm = JSON.parse(typeof contenuto === 'string' ? contenuto : new TextDecoder('utf-8', { fatal: true }).decode(contenuto)); }
  catch { errore('JSON non valido o UTF-8 incompleto'); }
  if (!osm || typeof osm !== 'object' || Array.isArray(osm) || osm.version !== 0.6 || !Array.isArray(osm.elements)) errore('risposta Overpass non valida');
  if (Object.hasOwn(osm, 'remark')) errore('risposta Overpass parziale: ' + String(osm.remark).slice(0, 160));
  const data = osm.osm3s?.timestamp_osm_base;
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(data) ||
      !Number.isFinite(Date.parse(data)) || new Date(data).toISOString() !== data.replace('Z', '.000Z')) errore('data della fonte assente o non valida');
  if (!osm.elements.length) errore('nessuna via nel riquadro della città');
  const ids = new Set();
  for (const w of osm.elements) {
    if (!w || w.type !== 'way' || !Number.isSafeInteger(w.id) || w.id <= 0) errore('via o ID non valido');
    if (ids.has(w.id)) errore('ID di via ripetuto: ' + w.id);
    ids.add(w.id);
    if (!w.tags || typeof w.tags !== 'object' || Array.isArray(w.tags) || typeof w.tags.highway !== 'string' ||
        Object.values(w.tags).some(v => typeof v !== 'string')) errore('tag non testuali nella via ' + w.id);
    if (!Array.isArray(w.geometry) || w.geometry.length < 2) errore('geometria incompleta nella via ' + w.id);
    for (const p of w.geometry) if (!p || !Number.isFinite(p.lat) || !Number.isFinite(p.lon) ||
        Math.abs(p.lat) > 90 || Math.abs(p.lon) > 180) errore('coordinate non valide nella via ' + w.id);
  }
  return osm;
}

const QUI = path.dirname(fileURLToPath(import.meta.url));
const RADICE = path.join(QUI, '../..');
const LATO = 256; // unità: 1,28 km

if (process.argv[2] === 'scarica') {
  const f = process.argv[3];
  if (!f) throw new Error('Manca il file: node scripts/mappa/strade.mjs scarica <file.json>');
  const q = `[out:json][timeout:240];way[highway](${BOX.s},${BOX.w},${BOX.n},${BOX.e});out tags geom;`;
  const temporanea = fs.mkdtempSync(path.join(path.dirname(path.resolve(f)), '.nextstop-strade-'));
  const provvisorio = path.join(temporanea, 'risposta.json');
  try {
    const codice = execFileSync('curl', ['-sS', '--compressed', '--max-time', '300', '-A', 'nextstop-itinerari/1.0 (map build)', '-o', provvisorio, '-w', '%{http_code}',
      '--data-urlencode', `data=${q}`, 'https://overpass-api.de/api/interpreter']).toString();
    if (codice !== '200') throw new Error(`Overpass ha risposto ${codice}`);
    const dati = fs.readFileSync(provvisorio);
    leggiStrade(dati);
    scriviFile(f, dati);
  } finally { fs.rmSync(provvisorio, { force: true }); fs.rmdirSync(temporanea); }
  console.log(`${f}: ${(fs.statSync(f).size / 1e6).toFixed(1)} MB. Ora: node scripts/mappa/strade.mjs ${f}`);
  process.exit(0);
}

const M = JSON.parse(fs.readFileSync(path.join(RADICE, 'src/data/mappa.json'), 'utf8'));
if (JSON.stringify(M.box) !== JSON.stringify(BOX)) throw new Error('Il riquadro di src/data/mappa.json non è quello di riquadro.mjs: rifai prima la mappa');
const KX = M.w / (M.box.e - M.box.w), KY = M.h / (M.box.n - M.box.s);
const P = (lat, lon) => [(lon - M.box.w) * KX, (M.box.n - lat) * KY];
const osm = leggiStrade(fs.readFileSync(process.argv[2]));

// Douglas-Peucker: toglie i punti che non cambiano la forma più di «tol» unità (0,35 = 1,75 m)
function semplifica(pts, tol) {
  if (pts.length < 3) return pts;
  // Stessi tagli di Douglas-Peucker, ma senza una chiamata annidata per ogni punto della catena.
  const tieni = new Uint8Array(pts.length), pila = [[0, pts.length - 1]];
  tieni[0] = tieni[pts.length - 1] = 1;
  while (pila.length) {
    const [da, a] = pila.pop();
    const p = pts[da], q = pts[a];
    let max = 0, k = da;
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1e-9;
    for (let i = da + 1; i < a; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + q[0] * p[1] - q[1] * p[0]) / L;
      if (d > max) { max = d; k = i; }
    }
    if (max > tol) { tieni[k] = 1; pila.push([da, k], [k, a]); }
  }
  return pts.filter((_, i) => tieni[i]);
}
const lunghezza = pts => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// path corti: «Mx yl dx dy…», differenze fra i punti già arrotondati a 0,1 (nessun errore che si somma), «.5» al posto di «0.5»
const num = v => String(+v.toFixed(1)).replace(/^(-?)0\./, '$1.');
function compatta(nums) {
  let out = '', prec = '';
  for (const s of nums) {
    // serve uno spazio se il numero comincia con una cifra, o con «.» dopo un numero che non ha ancora il punto
    if (out && !s.startsWith('-') && (/^\d/.test(s) || (s.startsWith('.') && !prec.includes('.')))) out += ' ';
    out += s; prec = s;
  }
  return out;
}
function dRel(pts) {
  const r = pts.map(p => [Math.round(p[0] * 10), Math.round(p[1] * 10)]);
  const d = [];
  for (let i = 1; i < r.length; i++) d.push(num((r[i][0] - r[i - 1][0]) / 10), num((r[i][1] - r[i - 1][1]) / 10));
  return 'M' + compatta([num(r[0][0] / 10), num(r[0][1] / 10)]) + 'l' + compatta(d);
}

const CLASSI = {
  g: /^(primary|secondary|trunk|tertiary)(_link)?$/,   // grandi
  m: /^(unclassified|residential|living_street)$/,    // medie
  p: /^pedestrian$/,                                  // pedonali
  v: /^(footway|path|track|cycleway|service)$/,       // vicoli e passaggi
  s: /^steps$/                                        // scale
};

// ---------- le vie ----------
const vie = [];
let scartate = 0;
const dentro = ([x, y]) => x >= -20 && y >= -20 && x <= M.w + 20 && y <= M.h + 20;
for (const w of osm.elements) {
  const t = w.tags || {};
  if (w.type !== 'way' || !w.geometry || w.geometry.length < 2) continue;
  // niente gallerie, sotterranei e interni; niente marciapiedi, attraversamenti, parcheggi e passi carrabili
  if ((t.tunnel && t.tunnel !== 'no') || t.indoor === 'yes' || +(t.layer || 0) < 0) { scartate++; continue; }
  if (t.footway === 'sidewalk' || t.footway === 'crossing' || t.service === 'parking_aisle' || t.service === 'driveway') { scartate++; continue; }
  const c = Object.keys(CLASSI).find(k => CLASSI[k].test(t.highway));
  if (!c) continue;
  const pts = w.geometry.map(g => P(g.lat, g.lon));
  if (!pts.some(dentro)) continue;
  vie.push({ c, nome: t.name || '', pts: semplifica(pts, 0.35) });
}

// ---------- i nomi: i pezzi di una stessa via si uniscono quando si toccano agli estremi ----------
const vicini = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.8;
function catene(pezzi) {
  const cat = pezzi.map(p => [...p]);
  for (let fatto = true; fatto;) {
    fatto = false;
    for (let i = 0; i < cat.length && !fatto; i++) for (let j = 0; j < cat.length && !fatto; j++) {
      if (i === j) continue;
      const a = cat[i], b = cat[j];
      let nuova = null;
      if (vicini(a[a.length - 1], b[0])) nuova = [...a, ...b.slice(1)];
      else if (vicini(a[a.length - 1], b[b.length - 1])) nuova = [...a, ...[...b].reverse().slice(1)];
      else if (vicini(a[0], b[b.length - 1])) nuova = [...b, ...a.slice(1)];
      else if (vicini(a[0], b[0])) nuova = [...[...b].reverse(), ...a.slice(1)];
      if (nuova) { cat.splice(Math.max(i, j), 1); cat.splice(Math.min(i, j), 1, nuova); fatto = true; }
    }
  }
  // da sinistra a destra, per leggere il nome
  return cat.map(p => semplifica(p, 0.6)).map(p => (p[0][0] > p[p.length - 1][0] ? [...p].reverse() : p));
}
const perNome = new Map();
for (const v of vie) if (v.nome) { if (!perNome.has(v.nome)) perNome.set(v.nome, []); perNome.get(v.nome).push(v); }
const ORDINE = 'gpmsv';
const nomi = [...perNome].sort(([a], [b]) => a.localeCompare(b)).map(([nome, L]) => {
  const c = [...new Set(L.map(v => v.c))].sort((a, b) => ORDINE.indexOf(a) - ORDINE.indexOf(b))[0];
  return { nome, c, catene: catene(L.map(v => v.pts)) };
});
// vie principali (grandi e pedonali con il nome): il nome sempre, sul loro tratto più lungo; vanno con la mappa di base
const principali = nomi.filter(n => n.c === 'g' || n.c === 'p')
  .map(n => { const p = [...n.catene].sort((a, b) => lunghezza(b) - lunghezza(a))[0]; return [n.nome, Math.round(lunghezza(p)), dRel(p)]; })
  .filter(([, L]) => L > 30);

// ---------- i pezzi ----------
const NX = Math.ceil(M.w / LATO), NY = Math.ceil(M.h / LATO);
const pezzi = new Map();
const pezzo = k => { if (!pezzi.has(k)) pezzi.set(k, { c: Object.fromEntries(Object.keys(CLASSI).map(c => [c, []])), n: [] }); return pezzi.get(k); };
// una linea va in ogni pezzo che tocca: i tratti consecutivi nello stesso pezzo restano uniti, quelli sul bordo vanno in tutti e due
function taglia(pts) {
  const per = new Map();
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    // Le celle esterne erano già scartate: limita il ciclo prima di visitarle.
    for (let x = Math.max(0, Math.floor(Math.min(a[0], b[0]) / LATO)); x <= Math.min(NX - 1, Math.floor(Math.max(a[0], b[0]) / LATO)); x++)
      for (let y = Math.max(0, Math.floor(Math.min(a[1], b[1]) / LATO)); y <= Math.min(NY - 1, Math.floor(Math.max(a[1], b[1]) / LATO)); y++) {
        const k = `${x}_${y}`;
        if (!per.has(k)) per.set(k, []);
        const L = per.get(k), ult = L[L.length - 1];
        if (ult && ult.fine === i - 1) { ult.pts.push(b); ult.fine = i; } else L.push({ pts: [a, b], fine: i });
      }
  }
  return per;
}
for (const v of vie) for (const [k, L] of taglia(v.pts)) for (const t of L) pezzo(k).c[v.c].push(t.pts);
// il nome di una via: ogni suo tratto unito di almeno 60 m va nel pezzo dove cade la sua metà (intero, anche se esce dal pezzo)
const meta = pts => { let r = lunghezza(pts) / 2; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (r <= l) { const k = r / (l || 1); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]; } r -= l; } return pts[0]; };
for (const n of nomi) for (const cat of n.catene) {
  const L = lunghezza(cat);
  if (L < 12) continue;
  const [x, y] = meta(cat), i = Math.floor(x / LATO), j = Math.floor(y / LATO);
  if (i < 0 || j < 0 || i >= NX || j >= NY) continue;
  pezzo(`${i}_${j}`).n.push([n.nome, n.c, Math.round(L), dRel(cat)]);
}
const ordineChiavi = (a, b) => { const [ai, aj] = a.split('_').map(Number), [bi, bj] = b.split('_').map(Number); return ai - bi || aj - bj; };
const uscita = {
  fonte: `OpenStreetMap (ODbL), dati del ${(osm.osm3s?.timestamp_osm_base || '').slice(0, 10)}`,
  lato: LATO,
  pezzi: Object.fromEntries([...pezzi.keys()].sort(ordineChiavi).map(k => {
    const p = pezzi.get(k);
    return [k, { ...Object.fromEntries(Object.entries(p.c).filter(([, L]) => L.length).map(([c, L]) => [c, L.map(dRel).join('')])), n: p.n }];
  })),
  principali
};
const file = path.join(RADICE, 'src/data/strade.json');
scriviFile(file, JSON.stringify(uscita));
const br = s => zlib.brotliCompressSync(s).length;
const pesi = Object.values(uscita.pezzi).map(p => br(JSON.stringify(p))).sort((a, b) => a - b);
console.log(`src/data/strade.json: ${vie.length} vie (scartate ${scartate}), ${pesi.length} pezzi da ${LATO * M.mPerUnit} m, ` +
  `${(pesi.reduce((s, x) => s + x, 0) / 1024).toFixed(0)} KB compressi in tutto (un pezzo: mediana ${(pesi[pesi.length >> 1] / 1024).toFixed(1)} KB, ` +
  `massimo ${(pesi[pesi.length - 1] / 1024).toFixed(1)} KB); ${principali.length} vie principali, ${(br(JSON.stringify(principali)) / 1024).toFixed(1)} KB compressi`);
