// Tranche 2, pezzo 2 (ora): le giornate vere di «Due giorni» e «Tre giorni» per ogni ora d'inizio, con il calcolo del sito
// (calcolo.ts e pause.ts) sui tempi della build (dist/napoli/itinerari: il pacco «it-dati» e scenari.json). Serve npm run build.
// Esporta giornate(); genera.mjs lo usa. Giorno feriale, senza data, margine 0, pause come le mette il sito (pranzo).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calcolaGiorno } from '../../../../src/lib/itinerari/calcolo.ts';
import { conPause } from '../../../../src/lib/itinerari/pause.ts';

const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const DIST = path.join(RADICE, 'dist/napoli/itinerari');
const SCENARI = ['feriale', 'sabato', 'sabato-pomeriggio', 'domenica', 'festivo', 'piedi'];
const PRIMA = { sabato: 'feriale', 'sabato-pomeriggio': 'sabato', domenica: 'feriale', festivo: 'domenica', piedi: 'feriale' };

// come spacchetta() e aggiungiScenari() di src/lib/itinerari/pacco.ts (qui senza i tipi, che Node non risolve)
function citta() {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  const P = JSON.parse(/<script[^>]*id="it-dati"[^>]*>([\s\S]*?)<\/script>/.exec(html)[1]);
  const min = {}, metri = {}, mezzi = {};
  for (const s of SCENARI) { min[s] = P.feriale.min.slice(); metri[s] = P.feriale.metri.map(x => x * 10); mezzi[s] = P.feriale.mezzi.map(i => P.dizionario[i]); }
  const C = { tappe: P.tappe, tempi: { n: P.n, min, metri, mezzi }, evento: P.evento, linee: P.linee, zone: P.zone };
  const Q = JSON.parse(fs.readFileSync(path.join(DIST, 'scenari.json'), 'utf8'));
  for (const s of SCENARI) {
    const p = PRIMA[s]; if (!p) continue;
    const m = C.tempi.min[p].slice(), w = C.tempi.metri[p].slice(), z = C.tempi.mezzi[p].slice(), d = Q.diff[s] ?? [];
    let ij = 0;
    for (let k = 0; k < d.length; k += 4) { ij += d[k]; m[ij] = d[k + 1]; w[ij] = d[k + 2] * 10; z[ij] = Q.dizionario[d[k + 3]]; }
    C.tempi.min[s] = m; C.tempi.metri[s] = w; C.tempi.mezzi[s] = z;
  }
  return C;
}

// per ogni giorno: la giornata a ogni inizio da 5:00 a 20:00 (passi di 15 minuti), con la fine scelta del pronto.
// tappe: [id, inizio, fine] (minuti dalla mezzanotte); pause: [quale, inizio, fine]; fine: quando finisce l'ultima cosa
export function giornate(pronti, ids) {
  const C = citta();
  const minutiDa = s => { const [h, m] = String(s).split(':'); return +h * 60 + +m; };
  const out = {};
  for (const id of ids) {
    const p = pronti.find(x => x.id === id);
    const giorni = p.giorni.map(g => ({ inizio: minutiDa(g.inizio), fine: minutiDa(g.fine), tappe: g.tappe }));
    out[id] = giorni.map((G, k) => {
      const per = {};
      for (let i = 300; i <= 1200; i += 15) {
        const it = { id, nome: p.nome, giorni: giorni.map((x, j) => (j === k ? { ...x, inizio: i, fine: 1425 } : x)), creato: 0, modificato: 0 };
        const r = calcolaGiorno(C, it, k), g = conPause(C, it.giorni[k], r, 0);
        per[i] = { fine: g.fine, tappe: g.voci.filter(v => v.tipo === 'tappa').map(v => [v.id, v.inizio, v.fine]), pause: g.pause.map(x => [x.quale, x.inizio, x.fine]), a: r.avvisi.filter(a => a.tipo === 'chiusa-ora').map(a => [a.id, a.apre ?? null, a.chiude ?? null]) };
      }
      return { inizio: G.inizio, fine: G.fine, per };
    });
  }
  return out;
}
