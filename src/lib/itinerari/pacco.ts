// Riapre nella pagina il pacco della città fatto durante la build (src/lib/itinerari/napoli.ts, impacchetta)
import { SCENARI, PRIMA, type Citta, type Evento, type Scenario, type Tappa, type Vivo } from './tipi.ts';

export interface Pacco {
  tappe: Tappa[];
  n: number;
  dizionario: string[];
  feriale: { min: number[]; metri: number[]; mezzi: number[] };
  piedi: number[]; // differenze dal feriale: disponibili anche se scenari.json non arriva
  evento?: Evento;
  linee: Record<string, string>;
  zone: Record<string, string>;
}

// Gli scenari dei mezzi (sabato, domenica, festivi) arrivano dopo, da /napoli/itinerari/scenari.json:
// finché non ci sono, valgono i tempi del feriale (aggiungiScenari li sostituisce).
export interface PaccoScenari { dizionario: string[]; diff: Record<string, number[]> }
export function aggiungiScenari(C: Citta, P: PaccoScenari) {
  for (const s of SCENARI) {
    const p = PRIMA[s];
    if (!p || !P.diff[s]) continue;
    const m = C.tempi.min[p].slice(), w = C.tempi.metri[p].slice(), z = C.tempi.mezzi[p].slice();
    const d = P.diff[s] ?? [];
    let ij = 0;
    for (let k = 0; k < d.length; k += 4) { ij += d[k]; m[ij] = d[k + 1]; w[ij] = d[k + 2] * 10; z[ij] = P.dizionario[d[k + 3]]; }
    C.tempi.min[s] = m; C.tempi.metri[s] = w; C.tempi.mezzi[s] = z;
  }
}

// Il pacco iniziale contiene il feriale e le differenze per andare solo a piedi.
// Il dizionario è condiviso; gli altri scenari restano nel caricamento successivo.
export function impacchetta(C: Citta): Pacco {
  const dizionario: string[] = [];
  const voce = (s: string) => { let i = dizionario.indexOf(s); if (i < 0) { i = dizionario.length; dizionario.push(s); } return i; };
  const F = C.tempi;
  const feriale = { min: F.min.feriale, metri: F.metri.feriale.map(m => Math.round(m / 10)), mezzi: F.mezzi.feriale.map(voce) };
  const piedi: number[] = [];
  let ultimo = 0;
  for (let ij = 0; ij < F.n * F.n; ij++) {
    const metri = Math.round(F.metri.piedi[ij] / 10), mezzo = voce(F.mezzi.piedi[ij]);
    if (F.min.piedi[ij] !== feriale.min[ij] || metri !== feriale.metri[ij] || mezzo !== feriale.mezzi[ij]) {
      piedi.push(ij - ultimo, F.min.piedi[ij], metri, mezzo); ultimo = ij;
    }
  }
  return { tappe: C.tappe, n: F.n, dizionario, feriale, piedi, evento: C.evento, linee: C.linee, zone: C.zone };
}
export function spacchetta(P: Pacco): Citta {
  if (!Array.isArray(P.piedi)) throw new Error('Tempi a piedi mancanti');
  const nn = P.n * P.n;
  const min = {} as Record<Scenario, number[]>, metri = {} as Record<Scenario, number[]>, mezzi = {} as Record<Scenario, string[]>;
  for (const s of SCENARI) {
    const m = P.feriale.min.slice(), w = P.feriale.metri.map(x => x * 10), z = P.feriale.mezzi.map(i => P.dizionario[i]);
    if (m.length !== nn) throw new Error('Tempi incompleti');
    min[s] = m; metri[s] = w; mezzi[s] = z;
  }
  const C = { tappe: P.tappe, tempi: { n: P.n, min, metri, mezzi }, evento: P.evento, linee: P.linee, zone: P.zone };
  aggiungiScenari(C, { dizionario: P.dizionario, diff: { piedi: P.piedi } });
  return C;
}

// Gli orari veri dei bus, come arrivano da /napoli/itinerari/partenze.json (src/pages/napoli/itinerari/partenze.json.ts)
export interface PaccoVivo {
  preferenza: number; dal: string; al: string; giorni: Record<string, number>;
  tipi: { salite: Record<string, number[]>; viaggi: Record<string, number | number[]> }[];
  fermate: Record<string, string>; dizionario: string[];
  candidati: [(number | string)[], number, number][];
  senza: Record<string, number[]>; bus: Record<string, number[]>;
}

// le partenze arrivano come differenze dalla partenza prima: qui tornano minuti dalla mezzanotte
const somme = (v: number[]) => { let c = 0; return v.map((x, i) => (c = i ? c + x : x)); };

export function spacchettaVivo(P: PaccoVivo): Vivo {
  const senza: Vivo['senza'] = {}, bus: Vivo['bus'] = {};
  for (const [s, v] of Object.entries(P.senza)) {
    const m = new Map<number, { min: number; metri: number; mezzi: string }>();
    for (let k = 0; k < v.length; k += 4) m.set(v[k], { min: v[k + 1], metri: v[k + 2] * 10, mezzi: P.dizionario[v[k + 3]] });
    senza[s as Scenario] = m;
  }
  for (const [s, v] of Object.entries(P.bus)) {
    const m = new Map<number, number[]>();
    for (let k = 0; k < v.length;) { const n = v[k + 1]; m.set(v[k], v.slice(k + 2, k + 2 + n)); k += 2 + n; }
    bus[s as Scenario] = m;
  }
  return {
    dal: P.dal, al: P.al, giorni: P.giorni, fermate: P.fermate, preferenza: P.preferenza,
    salite: P.tipi.map(t => new Map(Object.entries(t.salite).map(([k, v]) => [k, somme(v)]))),
    viaggi: P.tipi.map(t => new Map(Object.entries(t.viaggi).map(([k, v]) => [k, Array.isArray(v) ? { min: v[0], partenze: somme(v.slice(1)) } : { min: v }]))),
    candidati: P.candidati.map(([seg, m, z]) => ({ seg, metri: m * 10, mezzi: P.dizionario[z] })),
    senza, bus
  };
}
