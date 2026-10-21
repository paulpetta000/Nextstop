// Pause e margini della giornata (specifiche/compositore.md §9). Sopra il calcolo del sito (calcolo.ts), come nelle prove
// scelte da Enrico: la giornata calcolata va da una tappa all'altra; qui si aggiungono le pause (dopo una tappa) e il margine
// (dopo ogni spostamento), e gli orari dopo slittano. I minuti a piedi e con i mezzi restano quelli veri.
// La pausa pranzo c'è già: un'ora, dopo la tappa dove si mangia o quella che finisce più vicino alle 13. Se all'ora di pranzo
// c'è il locale del pranzo (anche spostato più avanti, fino alla cena) la pausa resta da parte (nei dati) e torna se lo togli.
// Una pausa non va mai dopo l'ultima tappa.
// Funzioni pure, senza DOM: le usa la pagina (src/scripts/itinerari/) e i test.
import { tappaDi, spostamento, scenarioDi, orarioLocale } from './calcolo.ts';
import type { Avviso, Citta, Giorno, Pausa, QualePausa, Risultato, Voce } from './tipi';

export const TIPI_PAUSA: Record<QualePausa, { min: number; ora: number; scelte: number[]; solo?: boolean }> = {
  pranzo: { min: 60, ora: 780, scelte: [30, 45, 60, 90] },
  caffe: { min: 20, ora: 990, scelte: [15, 20, 30] },
  riposo: { min: 30, ora: 930, scelte: [15, 30, 45, 60] },
  libero: { min: 30, ora: 1140, scelte: [15, 30, 45, 60, 90, 120], solo: true }
};
export const MARGINI = [0, 5, 10, 15];
// l'ora di pranzo (regola nostra, scritta nella pagina): 12:30–14:30
export const PRANZO = { da: 750, a: 870 };

type VoceTappa = Extract<Voce, { tipo: 'tappa' }>;
export type Fase = { tipo: 'visita' | 'cammino' | 'pausa' | 'margine'; da: number; a: number };
export type PausaMessa = Pausa & { dove: string; inizio: number; fine: number };
export interface Giornata extends Risultato {
  pause: PausaMessa[];
  fasi: Fase[];
  pauseMin: number;
  margineMin: number;
  totale: number;          // dall'uscita all'ultima tappa, pause e margine compresi
  resta: number;           // fino all'ora di fine scelta (negativo: di quanto sfori)
  fineScelta: number;
}

const tappeDi = (r: Risultato) => r.voci.filter((v): v is VoceTappa => v.tipo === 'tappa');
const daFare = (r: Risultato) => tappeDi(r).filter(v => !v.fatta);
const locale = (C: Citta, id: string) => tappaDi(C, id)?.categoria === 'mangiare';
// da quest'ora un locale è la cena (regola nostra, 19:30)
const CENA_DA = 1170;
// Il locale del pranzo: un locale all'ora di pranzo, oppure uno che serve il pranzo, dopo la mattina e prima della cena.
// Il secondo caso c'è perché il locale scelto con «Mangia qui» si può spostare più avanti nel giorno: anche dopo le 14:30 il pranzo
// resta quello e non tornano la pausa e «Il menù del pranzo» (prova di Enrico, 15/10/2026).
export const localeDelPranzo = (C: Citta, v: { id: string; inizio: number; fine: number }) => {
  const t = tappaDi(C, v.id);
  if (t?.categoria !== 'mangiare' || v.fine <= PRANZO.da) return false;
  return v.inizio < PRANZO.a || ((!t.pasto || t.pasto.includes('pranzo')) && v.inizio < CENA_DA);
};
const conLocaleAPranzo = (C: Citta, r: Risultato) => daFare(r).some(v => localeDelPranzo(C, v));

// L'ora da cui parte la giornata: l'ora scelta o, dal vivo, adesso (l'inizio della prima tappa meno il tratto per arrivarci)
function partenza(r: Risultato) {
  if (!r.vivo) return r.inizio;
  const k = r.voci.findIndex(v => !(v.tipo === 'tappa' && v.fatta));
  const v = r.voci[k];
  if (!v) return r.fine;
  if (v.tipo === 'tappa') return v.inizio;
  const dopo = r.voci.slice(k + 1).find((x): x is VoceTappa => x.tipo === 'tappa');
  return dopo ? dopo.inizio - v.min : r.fine;
}

// La pausa pranzo di base serve se ci sono almeno due tappe da fare e la giornata attraversa l'ora di pranzo senza un locale
export const pranzoServe = (C: Citta, r: Risultato) => daFare(r).length > 1 && partenza(r) < PRANZO.a && r.fine > PRANZO.da && !conLocaleAPranzo(C, r);

// Le pause del giorno: quelle scelte, oppure la pausa pranzo di base
export const pauseDelGiorno = (C: Citta, G: Giorno, r: Risultato): Pausa[] => G.pause ?? (pranzoServe(C, r) ? [{ quale: 'pranzo', min: TIPI_PAUSA.pranzo.min }] : []);

// Dopo quale tappa va una pausa senza posto scelto: a pranzo quella dove si mangia (genere «cibo») se finisce tra le 11:45 e
// le 14:30, altrimenti quella che finisce più vicino all'ora della pausa; mai l'ultima
function posto(C: Citta, quale: QualePausa, tp: VoceTappa[], fineA: Record<string, number>) {
  const candidati = tp.slice(0, -1);
  if (!candidati.length) return null;
  if (quale === 'pranzo') {
    const cibo = candidati.find(v => tappaDi(C, v.id)?.generi?.includes('cibo') && fineA[v.id] >= 705 && fineA[v.id] <= 870);
    if (cibo) return cibo.id;
  }
  const o = TIPI_PAUSA[quale].ora;
  return candidati.reduce((a, b) => (Math.abs(fineA[b.id] - o) < Math.abs(fineA[a.id] - o) ? b : a)).id;
}

// La data e la preferenza a piedi servono per scegliere di nuovo gli spostamenti all'ora effettiva.
export function conPause(C: Citta, G: Giorno, r: Risultato, margine = 0, contesto: { data?: string; piedi?: boolean } = {}): Giornata {
  const m = margine || 0, tp = daFare(r), t0 = partenza(r), ev = C.evento;
  const tratto = (v: Extract<Voce, { tipo: 'tratto' }>, t: number) =>
    spostamento(C, scenarioDi(contesto.data, t, contesto.piedi ?? v.scenario === 'piedi'), v.da, v.a, t, contesto.data);
  // Primo passaggio senza pause: conserva la scelta del posto delle pause, con i margini e i mezzi aggiornati.
  const fineA: Record<string, number> = {};
  let t = t0;
  for (const v of r.voci) {
    if (v.tipo === 'tratto') t += tratto(v, t).min + m;
    else if (!v.fatta) { if (ev && v.id === ev.id) t = Math.max(t, ev.inizio); t += v.fine - v.inizio; fineA[v.id] = t; }
  }
  const ultima = tp[tp.length - 1]?.id;
  const tutte = tappeDi(r), aPranzo = conLocaleAPranzo(C, r);
  const liberoServe = (p: Pausa) => { const i = tutte.findIndex(v => v.id === p.dopo); return i >= 0 && !!tutte[i + 1] && locale(C, tutte[i + 1].id); };
  const lista = pauseDelGiorno(C, G, r)
    .filter(p => !(p.quale === 'pranzo' && aPranzo) && !(p.quale === 'libero' && !liberoServe(p)))
    .map(p => ({ ...p, dove: p.dopo && p.dopo !== ultima && fineA[p.dopo] != null ? p.dopo : posto(C, p.quale, tp, fineA) }))
    .filter((p): p is Pausa & { dove: string } => !!p.dove);

  t = t0;
  const voci: Voce[] = [], fasi: Fase[] = [], pause: PausaMessa[] = [];
  const avvisi: Avviso[] = r.avvisi.filter(a => !['piena', 'chiusa-ora', 'evento-tardi'].includes(a.tipo));
  let mar = 0, pau = 0, vis = 0, spostamenti = 0, metri = 0;
  for (const v of r.voci) {
    if (v.tipo === 'tappa' && v.fatta) { voci.push(v); continue; }
    if (v.tipo === 'tratto') {
      const tr = tratto(v, t);
      fasi.push({ tipo: 'cammino', da: t, a: t + tr.min });
      voci.push(tr);
      t += tr.min; spostamenti += tr.min; metri += tr.metri;
      if (m) { fasi.push({ tipo: 'margine', da: t, a: t + m }); t += m; mar += m; }
      continue;
    }
    // I campi dipendenti dall'ora vanno ricostruiti, senza alterare il risultato grezzo in memoria.
    const { attesa, ritardo, oltre, chiusaOra, ...base } = v;
    const d = v.fine - v.inizio;
    const voce: VoceTappa = { ...base, inizio: t, fine: t + d };
    if (ev && v.id === ev.id) {
      if (t < ev.inizio) { voce.attesa = ev.inizio - t; t = ev.inizio; voce.inizio = t; }
      else if (t > ev.inizio) { voce.ritardo = t - ev.inizio; avvisi.push({ tipo: 'evento-tardi', ritardo: voce.ritardo }); }
      voce.fine = t + d;
    }
    const tappa = tappaDi(C, v.id);
    if (!voce.chiusa && !voce.inCorso && tappa?.orari) {
      const o = orarioLocale(tappa, contesto.data, voce.inizio, d);
      if (o) { voce.chiusaOra = o; avvisi.push({ tipo: 'chiusa-ora', id: v.id, ...o }); }
    }
    if (voce.fine > G.fine) voce.oltre = voce.fine - Math.max(voce.inizio, G.fine);
    voci.push(voce);
    fasi.push({ tipo: 'visita', da: voce.inizio, a: voce.fine });
    t = voce.fine; vis += d;
    for (const p of lista.filter(x => x.dove === v.id)) {
      pause.push({ ...p, inizio: t, fine: t + p.min });
      fasi.push({ tipo: 'pausa', da: t, a: t + p.min });
      t += p.min; pau += p.min;
    }
  }
  if (tp.length && t > G.fine) {
    const daSpostare = voci.filter((v): v is VoceTappa => v.tipo === 'tappa' && !v.fatta && !v.inCorso && v.fine > G.fine && v.id !== ev?.id).map(v => v.id);
    avvisi.unshift({ tipo: 'piena', fine: t, limite: G.fine, daSpostare });
  }
  return { ...r, inizio: t0, voci, fine: t, pause, fasi, visite: vis, spostamenti, metri, pauseMin: pau, margineMin: mar, totale: t - t0, resta: G.fine - t, fineScelta: G.fine, avvisi };
}
// Le voci della giornata con le pause al loro posto (dopo la tappa), per disegnarla
export type VoceGiornata = Voce | (PausaMessa & { tipo: 'pausa' });
export const sequenza = (g: Giornata): VoceGiornata[] => g.voci.flatMap<VoceGiornata>(v => (v.tipo === 'tappa' && !v.fatta ? [v, ...g.pause.filter(p => p.dove === v.id).map(p => ({ ...p, tipo: 'pausa' as const }))] : [v]));
