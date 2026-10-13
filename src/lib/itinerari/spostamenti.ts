import { giornoVuoto, MAX_GIORNI, MAX_TAPPE } from './link.ts';
import type { Giorno, Itinerario } from './tipi';

type Spostamento = { giorni: Giorno[]; destinazione: number } | 'limite-giorni' | 'limite-tappe';

// Prepara l'intero spostamento prima di salvare: se non c'è posto, nessuna tappa viene tolta.
// L'itinerario originale resta intatto; la pagina applica il risultato con il consueto «Annulla».
export function preparaSpostamento(x: Itinerario, da: number, dest: number, ids: string[]): Spostamento {
  if (dest >= x.giorni.length && x.giorni.length >= MAX_GIORNI) return 'limite-giorni';
  const arrivo = x.giorni[dest];
  const presenti = arrivo && !arrivo.gita ? arrivo.tappe.filter(t => !ids.includes(t)).length : 0;
  if (presenti + ids.length > MAX_TAPPE) return 'limite-tappe';

  const giorni = structuredClone(x.giorni);
  if (dest >= giorni.length) { giorni.push(giornoVuoto(giorni[da].inizio, giorni[da].fine)); dest = giorni.length - 1; }
  if (giorni[dest].gita) { giorni.splice(dest, 0, giornoVuoto(giorni[da].inizio, giorni[da].fine)); }
  giorni[da].tappe = giorni[da].tappe.filter(t => !ids.includes(t));
  giorni[dest].tappe = [...giorni[dest].tappe.filter(t => !ids.includes(t)), ...ids];
  return { giorni, destinazione: dest };
}
