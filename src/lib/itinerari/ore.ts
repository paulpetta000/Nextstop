// Il selettore dell'ora «Tutte le ore» del compositore (specifiche/compositore-rifiniture-2.md, scelta di Enrico del 16/10/2026):
// i limiti e i passi di oggi, l'ora che si sposta con l'altra e lo stato di ogni quarto d'ora per la griglia. Senza pagina, così
// si prova con node:test. Minuti dalla mezzanotte.

export const INIZIO_MIN = 300, INIZIO_MAX = 1200, FINE_MIN = 360, FINE_MAX = 1425, PASSO = 15, STACCO = 60;
export type Ore = { inizio: number; fine: number };
export type Quale = 'inizio' | 'fine';

// cambia un'ora: a passi di 15 minuti, dentro i limiti; se inizio e fine si avvicinano meno di un'ora, l'altra si sposta con lei
export function imposta(o: Ore, k: Quale, v: number): Ore & { spinta: Quale | null } {
  const m = Math.round(v / PASSO) * PASSO;
  let { inizio, fine } = o;
  if (k === 'inizio') { inizio = Math.min(INIZIO_MAX, Math.max(INIZIO_MIN, m)); if (fine < inizio + STACCO) fine = inizio + STACCO; }
  else { fine = Math.min(FINE_MAX, Math.max(FINE_MIN, m)); if (inizio > fine - STACCO) inizio = fine - STACCO; }
  const spinta: Quale | null = k === 'inizio' ? (fine !== o.fine ? 'fine' : null) : (inizio !== o.inizio ? 'inizio' : null);
  return { inizio, fine, spinta };
}

// un tocco sulla griglia: con «Inizio» sceglie l'inizio e si passa alla fine; con «Fine», un'ora prima dell'inizio diventa il
// nuovo inizio (come quando si sceglie un intervallo)
export function tocco(o: Ore, modo: Quale, m: number) {
  const k: Quale = modo === 'fine' && m < o.inizio ? 'inizio' : modo;
  return { ...imposta(o, k, m), k, modo: 'fine' as Quale };
}

// ogni quarto d'ora da 5:00 a 23:45: dentro la giornata scelta (fascia), con tempo in più dopo l'ultima tappa (libero), oltre la
// fine scelta ma ancora con le tappe (oltre), quello in cui finisci (finisci), inizio e fine (capo). fineTappe: quando finisce
// l'ultima cosa del giorno, null per un giorno senza tappe
export function quarti(o: Ore, fineTappe: number | null) {
  const out = [];
  for (let m = INIZIO_MIN; m <= FINE_MAX; m += PASSO) {
    const dentro = m >= o.inizio && m <= o.fine;
    const st = fineTappe;
    out.push({
      m, dentro,
      libero: st != null && dentro && m >= st && m < o.fine,
      oltre: st != null && m > o.fine && m < st,
      finisci: st != null && st >= m && st < m + PASSO,
      capo: m === o.inizio ? 'inizio' as Quale : m === o.fine ? 'fine' as Quale : null
    });
  }
  return out;
}

// le parti del giorno della griglia, con i loro titoli; la fascia passa anche dietro un titolo quando l'ora prima e quella dopo
// sono dentro (così resta tutta di un pezzo)
export const PARTI: [string, number, number][] = [['Presto', 5, 7], ['Mattina', 8, 12], ['Pomeriggio', 13, 17], ['Sera', 18, 23]];
export function parti(o: Ore, fineTappe: number | null) {
  return PARTI.map(([nome, da, a]) => {
    const prima = da * 60 - PASSO, dopo = da * 60, st = fineTappe;
    const stato = prima >= o.inizio && dopo <= o.fine ? (st != null && prima >= st ? 'libero' : 'dentro')
      : st != null && prima >= o.fine && dopo < st ? 'oltre' : '';
    return { nome, da, a, stato };
  });
}

// «Finisci alle …»: la mezz'ora dopo la fine delle tappe, se c'è ancora posto nel giorno
export const allunga = (fineTappe: number) => { const m = Math.ceil(fineTappe / 30) * 30; return m <= FINE_MAX ? m : null; };

// la frase di quando finisci (la stessa nel foglio delle ore e in «Data e orari»): st è quando finiscono le tappe, fine l'ora scelta
const hm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
const parole = (m: number) => { const h = Math.floor(m / 60), r = m % 60, o = h === 1 ? "un'ora" : `${h} ore`, mi = `${r} ${r === 1 ? 'minuto' : 'minuti'}`; return h ? (r ? `${o} e ${mi}` : o) : mi; };
const elenca = (a: string[]) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a[a.length - 1]}`);
export const cortoFine = (st: number, fine: number) => (st > fine ? `${parole(st - fine)} dopo le ${hm(fine)}` : st === fine ? `proprio alle ${hm(fine)}` : `${parole(fine - st)} prima delle ${hm(fine)}`);
export const fuoriFine = (fuori: string[]) => `${elenca(fuori)} ${fuori.length > 1 ? 'restano' : 'resta'} fuori`;
export function fraseFine(st: number, fine: number, fuori: string[], ultima?: string) {
  return st > fine ? `Finisci alle ${hm(st)}, ${cortoFine(st, fine)}: ${fuoriFine(fuori)}.` : `Finisci alle ${hm(st)}, ${cortoFine(st, fine)}.${ultima ? ` Ultima tappa: ${ultima}.` : ''}`;
}
