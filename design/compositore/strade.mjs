// Strade piccole per la mappa dei bozzetti (prova della «strada A» di specifiche/compositore.md, sezione 6):
// legge le strade di OpenStreetMap (ODbL) scaricate con Overpass per il riquadro dei due giorni
// (way[highway] con «out tags geom», lat 40.8171–40.8644, lon 14.2246–14.2737) e scrive design/compositore/strade.json:
// percorsi SVG nelle unità della mappa del sito (src/data/mappa.json), divisi per tipo, e i nomi delle vie più lunghe.
// Uso: node design/compositore/strade.mjs <file json di Overpass>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(fs.readFileSync(path.join(QUI, '../../src/data/mappa.json'), 'utf8'));
const KX = M.w / (M.box.e - M.box.w), KY = M.h / (M.box.n - M.box.s);
const P = (lat, lon) => [(lon - M.box.w) * KX, (M.box.n - lat) * KY];
const osm = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// Douglas-Peucker: toglie i punti che non cambiano la forma più di «tol» unità (1 unità = 5 m)
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
const d = pts => 'M' + pts.map(p => `${+p[0].toFixed(1)} ${+p[1].toFixed(1)}`).join('L');
const lunghezza = pts => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

const CLASSI = {
  grandi: /^(primary|secondary|trunk|tertiary)(_link)?$/,
  medie: /^(unclassified|residential|living_street)$/,
  pedonali: /^pedestrian$/,
  vicoli: /^(footway|path|track|cycleway|service)$/,
  scale: /^steps$/
};
const uscita = Object.fromEntries(Object.keys(CLASSI).map(k => [k, []]));
const nomi = new Map();
let scartate = 0;
for (const w of osm.elements) {
  const t = w.tags || {};
  if (w.type !== 'way' || !w.geometry || w.geometry.length < 2) continue;
  if ((t.tunnel && t.tunnel !== 'no') || t.indoor === 'yes' || +(t.layer || 0) < 0) { scartate++; continue; }
  if (t.footway === 'sidewalk' || t.footway === 'crossing' || t.service === 'parking_aisle' || t.service === 'driveway') { scartate++; continue; }
  const classe = Object.keys(CLASSI).find(k => CLASSI[k].test(t.highway));
  if (!classe) continue;
  const pts = semplifica(w.geometry.map(g => P(g.lat, g.lon)), 0.35);
  uscita[classe].push(d(pts));
  if (t.name && classe !== 'vicoli') { if (!nomi.has(t.name)) nomi.set(t.name, []); nomi.get(t.name).push(pts); }
}
// i pezzi di una stessa via si uniscono quando si toccano agli estremi; per l'etichetta conta il tratto unito più lungo
const vicini = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.8;
function unisci(pezzi) {
  const catene = pezzi.map(p => [...p]);
  for (let fatto = true; fatto;) {
    fatto = false;
    for (let i = 0; i < catene.length && !fatto; i++) for (let j = 0; j < catene.length && !fatto; j++) {
      if (i === j) continue;
      const a = catene[i], b = catene[j];
      let nuova = null;
      if (vicini(a[a.length - 1], b[0])) nuova = [...a, ...b.slice(1)];
      else if (vicini(a[a.length - 1], b[b.length - 1])) nuova = [...a, ...[...b].reverse().slice(1)];
      else if (vicini(a[0], b[b.length - 1])) nuova = [...b, ...a.slice(1)];
      else if (vicini(a[0], b[0])) nuova = [...[...b].reverse(), ...a.slice(1)];
      if (nuova) { catene.splice(Math.max(i, j), 1); catene.splice(Math.min(i, j), 1, nuova); fatto = true; }
    }
  }
  return catene.map(p => ({ pts: semplifica(p, 0.6), L: lunghezza(p) })).sort((x, y) => y.L - x.L)[0];
}
for (const [n, pezzi] of [...nomi]) nomi.set(n, unisci(pezzi));
// i nomi delle vie più lunghe, scritti da sinistra a destra
const etichette = [...nomi.entries()].filter(([, v]) => v.L > 30).sort((a, b) => b[1].L - a[1].L).slice(0, 110).map(([nome, v]) => {
  const pts = v.pts[0][0] > v.pts[v.pts.length - 1][0] ? [...v.pts].reverse() : v.pts;
  return { nome, d: d(pts), L: Math.round(v.L) };
});
const dati = { fonte: `OpenStreetMap (ODbL), dati del ${osm.osm3s?.timestamp_osm_base}`, ...Object.fromEntries(Object.entries(uscita).map(([k, v]) => [k, v.join('')])), etichette };
const testo = JSON.stringify(dati);
fs.writeFileSync(path.join(QUI, 'strade.json'), testo);
console.log(`strade.json: ${(testo.length / 1024).toFixed(0)} KB (${Object.entries(uscita).map(([k, v]) => `${k} ${v.length}`).join(', ')}; scartate ${scartate}; nomi ${etichette.length})`);
