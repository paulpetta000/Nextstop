// Pezzo 6, primo passo (specifiche/compositore.md §6, strada A): le strade piccole e i nomi delle vie di OpenStreetMap (ODbL)
// su TUTTA la mappa del sito, divise in pezzi quadrati da caricare solo dove si guarda; misura i pesi (grezzo, gzip, brotli).
// Non tocca il sito: scrive in design/compositore/mappa-giro-1/pezzi-<lato>/ e misure.json.
// Dati: Overpass, `[out:json];way[highway](40.786,14.135,40.874,14.29);out tags geom;` (il riquadro di src/data/mappa.json).
// Uso: node design/compositore/mappa-giro-1/pezzi.mjs <file json di Overpass> [lato in unità, 256]
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(fs.readFileSync(path.join(QUI, '../../../src/data/mappa.json'), 'utf8'));
const KX = M.w / (M.box.e - M.box.w), KY = M.h / (M.box.n - M.box.s);
const P = (lat, lon) => [(lon - M.box.w) * KX, (M.box.n - lat) * KY];
const osm = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const LATO = +(process.argv[3] || 256);

const gz = s => zlib.gzipSync(s, { level: 9 }).length;
const br = s => zlib.brotliCompressSync(s, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
const kb = n => +(n / 1024).toFixed(1);

// Douglas-Peucker (come design/compositore/strade.mjs): 1 unità = 5 m
function semplifica(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let max = 0, k = 0;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1e-9;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / L;
    if (d > max) { max = d; k = i; }
  }
  return max > tol ? [...semplifica(pts.slice(0, k + 1), tol).slice(0, -1), ...semplifica(pts.slice(k), tol)] : [a, b];
}
const lunghezza = pts => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// numeri corti per i path SVG: «.5» al posto di «0.5», separatore solo quando serve
const num = v => { const s = String(+v.toFixed(1)); return s.replace(/^(-?)0\./, '$1.'); };
function compatta(nums) {
  let out = '', prec = '';
  for (const s of nums) {
    // serve uno spazio se il numero comincia con una cifra, o con «.» dopo un numero che non ha ancora il punto
    if (out && !s.startsWith('-') && (/^\d/.test(s) || (s.startsWith('.') && !prec.includes('.')))) out += ' ';
    out += s; prec = s;
  }
  return out;
}
// assoluto, come la prova di oggi (strade.json): M x yL x y...
const dAss = pts => 'M' + pts.map(p => `${+p[0].toFixed(1)} ${+p[1].toFixed(1)}`).join('L');
// relativo e compatto: M x y l dx dy ... (le differenze fra i punti già arrotondati: nessun errore che si somma)
function dRel(pts) {
  const r = pts.map(p => [Math.round(p[0] * 10), Math.round(p[1] * 10)]);
  let s = 'M' + compatta([num(r[0][0] / 10), num(r[0][1] / 10)]) + 'l';
  const d = [];
  for (let i = 1; i < r.length; i++) d.push(num((r[i][0] - r[i - 1][0]) / 10), num((r[i][1] - r[i - 1][1]) / 10));
  return s + compatta(d);
}

// rilettura come nella pagina (app.js, puntiRel): serve a controllare che ogni path si rilegga uguale
function rileggi(d) {
  const [a, b = ''] = d.slice(1).split('l'), n = s => (s.match(/-?(?:\d+\.?\d*|\.\d+)/g) || []).map(Number), r = n(b), p = [n(a)];
  if (p[0].length !== 2 || r.length % 2) throw new Error('path non valido: ' + d.slice(0, 60));
  for (let i = 0; i < r.length; i += 2) { const q = p[p.length - 1]; p.push([q[0] + r[i], q[1] + r[i + 1]]); }
  return p;
}

const CLASSI = { // lettera della classe nel pezzo
  g: /^(primary|secondary|trunk|tertiary)(_link)?$/,          // grandi
  m: /^(unclassified|residential|living_street)$/,           // medie
  p: /^pedestrian$/,                                         // pedonali
  v: /^(footway|path|track|cycleway|service)$/,              // vicoli e passaggi
  s: /^steps$/                                               // scale
};
const NOMI_CLASSI = { g: 'grandi', m: 'medie', p: 'pedonali', v: 'vicoli', s: 'scale' };

// ---------- lettura ----------
const vie = []; // { c, nome, pts }
let scartate = 0;
const dentro = ([x, y]) => x >= -20 && y >= -20 && x <= M.w + 20 && y <= M.h + 20;
for (const w of osm.elements) {
  const t = w.tags || {};
  if (w.type !== 'way' || !w.geometry || w.geometry.length < 2) continue;
  if ((t.tunnel && t.tunnel !== 'no') || t.indoor === 'yes' || +(t.layer || 0) < 0) { scartate++; continue; }
  if (t.footway === 'sidewalk' || t.footway === 'crossing' || t.service === 'parking_aisle' || t.service === 'driveway') { scartate++; continue; }
  const c = Object.keys(CLASSI).find(k => CLASSI[k].test(t.highway));
  if (!c) continue;
  const pts = w.geometry.map(g => P(g.lat, g.lon));
  if (!pts.some(dentro)) continue;
  vie.push({ c, nome: c === 'v' && !t.name ? '' : (t.name || ''), pts: semplifica(pts, 0.35), grezzi: pts.length });
}

for (const v of vie) {
  const p = rileggi(dRel(v.pts));
  if (p.length !== v.pts.length || p.some((q, i) => Math.abs(q[0] - v.pts[i][0]) > 0.06 || Math.abs(q[1] - v.pts[i][1]) > 0.06)) throw new Error('rilettura diversa');
}

// ---------- tutta la mappa in un file solo (per capire il totale) ----------
const perClasse = {};
for (const c of Object.keys(CLASSI)) {
  const L = vie.filter(v => v.c === c);
  const ass = L.map(v => dAss(v.pts)).join(''), rel = L.map(v => dRel(v.pts)).join('');
  perClasse[NOMI_CLASSI[c]] = { vie: L.length, km: +(L.reduce((s, v) => s + lunghezza(v.pts), 0) * M.mPerUnit / 1000).toFixed(0), assoluto: kb(ass.length), relativo: kb(rel.length), relativo_gzip: kb(gz(rel)), relativo_brotli: kb(br(rel)) };
}
const tuttoAss = JSON.stringify(Object.fromEntries(Object.keys(CLASSI).map(c => [c, vie.filter(v => v.c === c).map(v => dAss(v.pts)).join('')])));
const tuttoRel = JSON.stringify(Object.fromEntries(Object.keys(CLASSI).map(c => [c, vie.filter(v => v.c === c).map(v => dRel(v.pts)).join('')])));

// ---------- i nomi ----------
// le vie con il nome, unite quando i pezzi si toccano agli estremi (come strade.mjs); per l'etichetta conta il tratto più lungo
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
  return cat.map(p => semplifica(p, 0.6));
}
const perNome = new Map();
for (const v of vie) if (v.nome) { if (!perNome.has(v.nome)) perNome.set(v.nome, []); perNome.get(v.nome).push(v); }
const nomi = []; // { nome, c (classe più importante), catene, L }
const ORDINE = 'gpmsv';
for (const [nome, L] of perNome) {
  const c = [...new Set(L.map(v => v.c))].sort((a, b) => ORDINE.indexOf(a) - ORDINE.indexOf(b))[0];
  const cc = catene(L.map(v => v.pts)).map(p => (p[0][0] > p[p.length - 1][0] ? [...p].reverse() : p)); // da sinistra a destra
  nomi.push({ nome, c, catene: cc, L: Math.max(...cc.map(lunghezza)) });
}
// «vie principali»: le grandi (primary, secondary, tertiary) e le pedonali con il nome, sempre caricate con la mappa
const principali = nomi.filter(n => (n.c === 'g' || n.c === 'p') && n.L > 30);
const fileNomiPrincipali = JSON.stringify(principali.map(n => { const p = n.catene.sort((a, b) => lunghezza(b) - lunghezza(a))[0]; return [n.nome, Math.round(lunghezza(p)), dRel(p)]; }));

// ---------- i pezzi ----------
const NX = Math.ceil(M.w / LATO), NY = Math.ceil(M.h / LATO);
const pezzi = new Map(); // "x_y" -> { c: {g:[],m:[],...}, n: [] }
const pezzo = (i, j) => { const k = `${i}_${j}`; if (!pezzi.has(k)) pezzi.set(k, { c: Object.fromEntries(Object.keys(CLASSI).map(c => [c, []])), n: [] }); return pezzi.get(k); };
// una linea va in ogni pezzo che tocca: i tratti consecutivi nello stesso pezzo restano uniti, quelli sul bordo vanno in tutti e due
function taglia(pts) {
  const per = new Map();
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const i1 = Math.floor(Math.min(a[0], b[0]) / LATO), i2 = Math.floor(Math.max(a[0], b[0]) / LATO);
    const j1 = Math.floor(Math.min(a[1], b[1]) / LATO), j2 = Math.floor(Math.max(a[1], b[1]) / LATO);
    for (let x = i1; x <= i2; x++) for (let y = j1; y <= j2; y++) {
      if (x < 0 || y < 0 || x >= NX || y >= NY) continue;
      const k = `${x}_${y}`;
      if (!per.has(k)) per.set(k, []);
      const L = per.get(k), ult = L[L.length - 1];
      if (ult && ult.fine === i - 1) { ult.pts.push(b); ult.fine = i; } else L.push({ pts: [a, b], fine: i });
    }
  }
  return per;
}
for (const v of vie) {
  for (const [k, L] of taglia(v.pts)) {
    const [i, j] = k.split('_').map(Number), p = pezzo(i, j);
    for (const t of L) p.c[v.c].push(t.pts);
  }
}
// l'etichetta di una via: la catena più lunga va nel pezzo dove cade la sua metà (intera, anche se esce dal pezzo)
const meta = pts => { let r = lunghezza(pts) / 2; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (r <= l) { const k = r / (l || 1); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]; } r -= l; } return pts[0]; };
let nomiNeiPezzi = 0;
for (const n of nomi) {
  for (const cat of n.catene) {
    const L = lunghezza(cat);
    if (L < 12) continue; // meno di 60 m: il nome non ci sta
    const [x, y] = meta(cat), i = Math.floor(x / LATO), j = Math.floor(y / LATO);
    if (i < 0 || j < 0 || i >= NX || j >= NY) continue;
    pezzo(i, j).n.push([n.nome, n.c, Math.round(L), dRel(cat)]);
    nomiNeiPezzi++;
  }
}
const OUT = path.join(QUI, `pezzi-${LATO}`);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const righe = [];
for (const [k, p] of pezzi) {
  const dati = { ...Object.fromEntries(Object.entries(p.c).filter(([, L]) => L.length).map(([c, L]) => [c, L.map(dRel).join('')])), n: p.n };
  const testo = JSON.stringify(dati);
  fs.writeFileSync(path.join(OUT, `${k}.json`), testo);
  const senzaNomi = JSON.stringify({ ...dati, n: [] });
  righe.push({ k, grezzo: testo.length, gzip: gz(testo), brotli: br(testo), soloStrade_brotli: br(senzaNomi), nomi: p.n.length });
}
const indice = { lato: LATO, nx: NX, ny: NY, pezzi: righe.map(r => r.k).sort(), fonte: `OpenStreetMap (ODbL), dati del ${osm.osm3s?.timestamp_osm_base}` };
fs.writeFileSync(path.join(OUT, 'indice.json'), JSON.stringify(indice));
fs.writeFileSync(path.join(OUT, 'nomi-principali.json'), fileNomiPrincipali);

// ---------- quanto si carica guardando ----------
const ll = (lat, lon) => P(lat, lon);
const POSTI = { 'Centro storico (Duomo)': ll(40.8526, 14.2601), 'Plebiscito': ll(40.8359, 14.2486), 'Chiaia': ll(40.8350, 14.2380), 'Vomero (Sant\'Elmo)': ll(40.8437, 14.2386), 'Posillipo': ll(40.8150, 14.2050) };
const peso = new Map(righe.map(r => [r.k, r]));
function vista([cx, cy], wPx, hPx, s) {
  const w = wPx / s, h = hPx / s;
  const i1 = Math.floor((cx - w / 2) / LATO), i2 = Math.floor((cx + w / 2) / LATO), j1 = Math.floor((cy - h / 2) / LATO), j2 = Math.floor((cy + h / 2) / LATO);
  let n = 0, b = 0, g = 0;
  for (let i = i1; i <= i2; i++) for (let j = j1; j <= j2; j++) { const r = peso.get(`${i}_${j}`); if (r) { n++; b += r.brotli; g += r.gzip; } }
  return { pezzi: n, brotli_KB: kb(b), gzip_KB: kb(g), larghezza_m: Math.round(w * M.mPerUnit) };
}
const viste = Object.fromEntries(Object.entries(POSTI).map(([nome, c]) => [nome, { 'telefono, quando compaiono i vicoli (1,4 px ogni 5 m)': vista(c, 390, 420, 1.4), 'telefono, più vicino (3 px ogni 5 m)': vista(c, 390, 420, 3), 'computer (800 × 600 px, 1,4)': vista(c, 800, 600, 1.4) }]));

const ord = righe.map(r => r.brotli).sort((a, b) => a - b);
const totale = k => righe.reduce((s, r) => s + r[k], 0);
const mappaOggi = fs.readFileSync(path.join(QUI, '../../../src/data/mappa.json'), 'utf8');
const misure = {
  fonte: indice.fonte, riquadro: M.box, lato_pezzo_m: LATO * M.mPerUnit,
  vie_lette: vie.length, scartate_tunnel_marciapiedi_parcheggi: scartate, punti_osm: vie.reduce((s, v) => s + v.grezzi, 0), punti_dopo_semplificazione: vie.reduce((s, v) => s + v.pts.length, 0),
  mappa_di_oggi: { grezzo_KB: kb(mappaOggi.length), gzip_KB: kb(gz(mappaOggi)), brotli_KB: kb(br(mappaOggi)) },
  tutta_la_mappa_in_un_file: {
    come_la_prova_di_oggi: { grezzo_KB: kb(tuttoAss.length), gzip_KB: kb(gz(tuttoAss)), brotli_KB: kb(br(tuttoAss)) },
    numeri_corti_relativi: { grezzo_KB: kb(tuttoRel.length), gzip_KB: kb(gz(tuttoRel)), brotli_KB: kb(br(tuttoRel)) }
  },
  per_classe: perClasse,
  nomi: { vie_con_nome: nomi.length, etichette_nei_pezzi: nomiNeiPezzi, principali: principali.length, file_principali: { grezzo_KB: kb(fileNomiPrincipali.length), gzip_KB: kb(gz(fileNomiPrincipali)), brotli_KB: kb(br(fileNomiPrincipali)) } },
  pezzi: {
    griglia: `${NX} × ${NY}`, con_strade: righe.length, totale_grezzo_KB: kb(totale('grezzo')), totale_gzip_KB: kb(totale('gzip')), totale_brotli_KB: kb(totale('brotli')), totale_brotli_senza_nomi_KB: kb(totale('soloStrade_brotli')),
    brotli_KB: { min: kb(ord[0]), mediana: kb(ord[Math.floor(ord.length / 2)]), max: kb(ord[ord.length - 1]) },
    piu_pesanti: righe.sort((a, b) => b.brotli - a.brotli).slice(0, 5).map(r => ({ pezzo: r.k, brotli_KB: kb(r.brotli), grezzo_KB: kb(r.grezzo), nomi: r.nomi }))
  },
  viste
};
// ---------- divisione consigliata: due livelli ----------
// livello 1 (un file, con la mappa): strade grandi, medie e pedonali di tutta la città e i nomi delle loro vie
// livello 2 (a pezzi, solo da vicino): vicoli, passaggi e scale, con i nomi delle vie piccole
const GMP = new Set(['g', 'm', 'p']);
const etichetta = n => n.catene.filter(c => lunghezza(c) >= 12).map(c => [n.nome, n.c, Math.round(lunghezza(c)), dRel(c)]);
const livello1 = JSON.stringify({ ...Object.fromEntries(['g', 'm', 'p'].map(c => [c, vie.filter(v => v.c === c).map(v => dRel(v.pts)).join('')])), n: nomi.filter(n => GMP.has(n.c)).flatMap(etichetta) });
const OUT2 = path.join(QUI, `vicini-${LATO}`);
fs.rmSync(OUT2, { recursive: true, force: true });
fs.mkdirSync(OUT2, { recursive: true });
const righe2 = [];
for (const [k, p] of pezzi) {
  const dati = { ...Object.fromEntries(['v', 's'].filter(c => p.c[c].length).map(c => [c, p.c[c].map(dRel).join('')])), n: p.n.filter(x => !GMP.has(x[1])) };
  if (!dati.v && !dati.s && !dati.n.length) continue;
  const testo = JSON.stringify(dati);
  fs.writeFileSync(path.join(OUT2, `${k}.json`), testo);
  righe2.push({ k, grezzo: testo.length, gzip: gz(testo), brotli: br(testo) });
}
fs.writeFileSync(path.join(OUT2, 'indice.json'), JSON.stringify({ ...indice, pezzi: righe2.map(r => r.k).sort() }));
fs.writeFileSync(path.join(QUI, 'livello1.json'), livello1);
const peso2 = new Map(righe2.map(r => [r.k, r]));
const ord2 = righe2.map(r => r.brotli).sort((a, b) => a - b);
function vista2([cx, cy], wPx, hPx, s) {
  const w = wPx / s, h = hPx / s;
  let n = 0, b = 0;
  for (let i = Math.floor((cx - w / 2) / LATO); i <= Math.floor((cx + w / 2) / LATO); i++) for (let j = Math.floor((cy - h / 2) / LATO); j <= Math.floor((cy + h / 2) / LATO); j++) { const r = peso2.get(`${i}_${j}`); if (r) { n++; b += r.brotli; } }
  return `${n} pezzi, ${kb(b)} KB`;
}
misure.due_livelli = {
  livello1: { grezzo_KB: kb(livello1.length), gzip_KB: kb(gz(livello1)), brotli_KB: kb(br(livello1)) },
  livello2: { pezzi: righe2.length, totale_grezzo_KB: kb(righe2.reduce((s, r) => s + r.grezzo, 0)), totale_brotli_KB: kb(righe2.reduce((s, r) => s + r.brotli, 0)), brotli_KB: { mediana: kb(ord2[Math.floor(ord2.length / 2)]), max: kb(ord2[ord2.length - 1]) } },
  viste_telefono_1_4: Object.fromEntries(Object.entries(POSTI).map(([nome, c]) => [nome, vista2(c, 390, 420, 1.4)]))
};
fs.writeFileSync(path.join(QUI, `misure-${LATO}.json`), JSON.stringify(misure, null, 2));
console.log(JSON.stringify(misure, null, 2));
