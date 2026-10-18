// Riapre nella pagina il pacco della città fatto durante la build (src/lib/itinerari/napoli.ts, impacchetta)
import { leggiCalendarioBus } from './calendario-bus.mjs';
import { SCENARI, PRIMA, type Citta, type Evento, type Scenario, type Tappa, type Vivo } from './tipi.ts';

export interface Pacco {
  riferimento?: string;
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
export interface PaccoScenari { riferimento?: string; dizionario: string[]; diff: Record<string, number[]> }
const numeroValido = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x) && x >= 0;
const indiceValido = (x: number, n: number) => Number.isSafeInteger(x) && x >= 0 && x < n;
function validaDizionario(d: string[]) {
  if (!Array.isArray(d) || d.some(x => typeof x !== 'string')) throw new Error('Dizionario dei mezzi incompleto');
}
export function verificaRiferimento(atteso: string | undefined, P: { riferimento?: unknown } | null | undefined) {
  if (atteso !== undefined && P?.riferimento !== atteso) throw new Error('Dati di una versione diversa dalla città aperta');
}
export function aggiungiScenari(C: Citta, P: PaccoScenari) {
  verificaRiferimento(C.riferimento, P);
  validaDizionario(P.dizionario);
  if (!P.diff || typeof P.diff !== 'object' || Array.isArray(P.diff)) throw new Error('Scenari incompleti');
  // Le matrici diventano disponibili insieme: un pacco rotto non lascia mezza città aggiornata.
  const tempi = { ...C.tempi, min: { ...C.tempi.min }, metri: { ...C.tempi.metri }, mezzi: { ...C.tempi.mezzi } };
  for (const s of SCENARI) {
    const p = PRIMA[s];
    if (!p || P.diff[s] === undefined) continue;
    const d = P.diff[s];
    if (!Array.isArray(d) || d.length % 4) throw new Error('Scenario incompleto');
    const m = tempi.min[p].slice(), w = tempi.metri[p].slice(), z = tempi.mezzi[p].slice();
    let ij = 0;
    for (let k = 0; k < d.length; k += 4) {
      if (!Number.isSafeInteger(d[k]) || d[k] < 0) throw new Error('Indice dello scenario non valido');
      ij += d[k];
      if (!indiceValido(ij, C.tempi.n * C.tempi.n) || !numeroValido(d[k + 1]) || !numeroValido(d[k + 2]) || !indiceValido(d[k + 3], P.dizionario.length)) throw new Error('Dati dello scenario non validi');
      m[ij] = d[k + 1]; w[ij] = d[k + 2] * 10; z[ij] = P.dizionario[d[k + 3]];
    }
    tempi.min[s] = m; tempi.metri[s] = w; tempi.mezzi[s] = z;
  }
  C.tempi = tempi;
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
  return { riferimento: C.riferimento, tappe: C.tappe, n: F.n, dizionario, feriale, piedi, evento: C.evento, linee: C.linee, zone: C.zone };
}
export function spacchetta(P: Pacco): Citta {
  if (P.riferimento !== undefined && (typeof P.riferimento !== 'string' || !P.riferimento)) throw new Error('Riferimento dei dati non valido');
  if (!Array.isArray(P.piedi)) throw new Error('Tempi a piedi mancanti');
  validaDizionario(P.dizionario);
  const nn = P.n * P.n;
  if (!Number.isSafeInteger(P.n) || P.n < 1 || !Number.isSafeInteger(nn)) throw new Error('Dimensione dei tempi non valida');
  if (!P.feriale || !(['min', 'metri', 'mezzi'] as const).every(k => Array.isArray(P.feriale[k]) && P.feriale[k].length === nn)) throw new Error('Tempi incompleti');
  if (!P.feriale.min.every(numeroValido) || !P.feriale.metri.every(numeroValido) || !P.feriale.mezzi.every(i => indiceValido(i, P.dizionario.length))) throw new Error('Tempi non validi');
  const min = {} as Record<Scenario, number[]>, metri = {} as Record<Scenario, number[]>, mezzi = {} as Record<Scenario, string[]>;
  for (const s of SCENARI) {
    const m = P.feriale.min.slice(), w = P.feriale.metri.map(x => x * 10), z = P.feriale.mezzi.map(i => P.dizionario[i]);
    if (m.length !== nn) throw new Error('Tempi incompleti');
    min[s] = m; metri[s] = w; mezzi[s] = z;
  }
  const C = { riferimento: P.riferimento, tappe: P.tappe, tempi: { n: P.n, min, metri, mezzi }, evento: P.evento, linee: P.linee, zone: P.zone };
  aggiungiScenari(C, { riferimento: P.riferimento, dizionario: P.dizionario, diff: { piedi: P.piedi } });
  return C;
}

// Gli orari veri dei bus, come arrivano da /napoli/itinerari/partenze.json (src/pages/napoli/itinerari/partenze.json.ts)
export interface PaccoVivo {
  riferimento?: string;
  preferenza: number; dal: string; al: string; giorni: Record<string, number>;
  tipi: { salite: Record<string, number[]>; viaggi: Record<string, number | number[]> }[];
  fermate: Record<string, string>; dizionario: string[];
  candidati: [(number | string)[], number, number][];
  senza: Record<string, number[]>; bus: Record<string, number[]>;
}

// Le partenze arrivano come differenze: una differenza negativa romperebbe la ricerca della prima corsa.
const record = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const distanzaValida = (x: unknown): x is number => numeroValido(x) && Number.isFinite(x * 10);
const corsaValida = (x: unknown): x is string => typeof x === 'string' && /^[^|]+\|[^|]+\|[^|]+$/.test(x);

export function spacchettaVivo(P: PaccoVivo, riferimento?: string): Vivo {
  verificaRiferimento(riferimento, P);
  validaDizionario(P.dizionario);
  if (!numeroValido(P.preferenza)) throw new Error('Calendario bus non valido');
  const { salite, viaggi } = leggiCalendarioBus(P);
  if (!Array.isArray(P.candidati) || !record(P.senza) || !record(P.bus)) throw new Error('Percorsi bus incompleti');
  const candidati = P.candidati.map(c => {
    if (!Array.isArray(c) || c.length !== 3) throw new Error('Percorso bus incompleto');
    const [seg, m, z] = c;
    if (!Array.isArray(seg) || !seg.length || !seg.every(x => numeroValido(x) || corsaValida(x)) || !distanzaValida(m) || !indiceValido(z, P.dizionario.length)) throw new Error('Percorso bus non valido');
    return { seg, metri: m * 10, mezzi: P.dizionario[z] };
  });
  const senza: Vivo['senza'] = {}, bus: Vivo['bus'] = {};
  for (const [s, v] of Object.entries(P.senza)) {
    if (!SCENARI.includes(s as Scenario) || !Array.isArray(v) || v.length % 4) throw new Error('Percorso senza bus incompleto');
    const m = new Map<number, { min: number; metri: number; mezzi: string }>();
    for (let k = 0; k < v.length; k += 4) {
      if (!Number.isSafeInteger(v[k]) || v[k] < 0 || !numeroValido(v[k + 1]) || !distanzaValida(v[k + 2]) || !indiceValido(v[k + 3], P.dizionario.length)) throw new Error('Percorso senza bus non valido');
      m.set(v[k], { min: v[k + 1], metri: v[k + 2] * 10, mezzi: P.dizionario[v[k + 3]] });
    }
    senza[s as Scenario] = m;
  }
  for (const [s, v] of Object.entries(P.bus)) {
    const m = new Map<number, number[]>();
    if (!SCENARI.includes(s as Scenario) || !Array.isArray(v)) throw new Error('Indice bus incompleto');
    for (let k = 0; k < v.length;) {
      const n = v[k + 1];
      if (!Number.isSafeInteger(v[k]) || v[k] < 0 || !Number.isSafeInteger(n) || n < 0 || k + 2 + n > v.length) throw new Error('Indice bus non valido');
      const lista = v.slice(k + 2, k + 2 + n);
      if (!lista.every(i => indiceValido(i, candidati.length))) throw new Error('Candidato bus non valido');
      m.set(v[k], lista); k += 2 + n;
    }
    bus[s as Scenario] = m;
  }
  return { dal: P.dal, al: P.al, giorni: P.giorni, fermate: P.fermate, preferenza: P.preferenza, salite, viaggi, candidati, senza, bus };
}
