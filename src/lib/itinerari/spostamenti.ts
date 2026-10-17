import { giornoVuoto, MAX_GIORNI, MAX_TAPPE } from './link.ts';
import type { Giorno, Itinerario } from './tipi';

type Spostamento = { giorni: Giorno[]; destinazione: number } | 'limite-giorni' | 'limite-tappe';

// Prepara l'intero spostamento prima di salvare: se non c'è posto, nessuna tappa viene tolta.
// L'itinerario originale resta intatto; la pagina applica il risultato con il consueto «Annulla».
export function preparaSpostamento(x: Itinerario, da: number, dest: number, ids: string[]): Spostamento {
  const arrivo = x.giorni[dest];
  if ((dest >= x.giorni.length || arrivo?.gita) && x.giorni.length >= MAX_GIORNI) return 'limite-giorni';
  const presenti = arrivo && !arrivo.gita ? arrivo.tappe.filter(t => !ids.includes(t)).length : 0;
  if (presenti + ids.length > MAX_TAPPE) return 'limite-tappe';

  const giorni = structuredClone(x.giorni);
  const origine = giorni[da]; // resta lo stesso giorno anche se un inserimento ne cambia l’indice
  if (dest >= giorni.length) { giorni.push(giornoVuoto(origine.inizio, origine.fine)); dest = giorni.length - 1; }
  if (giorni[dest].gita) { giorni.splice(dest, 0, giornoVuoto(origine.inizio, origine.fine)); }
  // il segno «visitata» segue la tappa (specifiche/compositore.md, casi limite); una pausa messa dopo una tappa che va via
  // torna al suo posto di base
  const visitate = (origine.fatte ?? []).filter(t => ids.includes(t));
  origine.tappe = origine.tappe.filter(t => !ids.includes(t));
  if (origine.fatte) origine.fatte = origine.fatte.filter(t => !ids.includes(t));
  if (origine.pause) origine.pause = origine.pause.map(p => (p.dopo && ids.includes(p.dopo) ? { quale: p.quale, min: p.min } : p));
  giorni[dest].tappe = [...giorni[dest].tappe.filter(t => !ids.includes(t)), ...ids];
  if (visitate.length) {
    const fatte = [...(giorni[dest].fatte ?? []).filter(t => !ids.includes(t)), ...visitate];
    // Se tutti i timbri esistono, l'ultima visitata resta quella più recente, non l'ultima spostata.
    // Senza timbri (archivi precedenti) conserviamo l'ordine noto, senza inventare date.
    if (x.timbri && fatte.every(t => Number.isFinite(x.timbri![t]) && x.timbri![t] > 0)) fatte.sort((a, b) => x.timbri![a] - x.timbri![b]);
    giorni[dest].fatte = fatte;
  }
  return { giorni, destinazione: dest };
}
