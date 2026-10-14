// Un itinerario pronto scelto dentro un giorno del compositore (il giorno vuoto offre i pronti).
// Solo la decisione, senza pagina: la pagina applica il risultato con il consueto «Annulla» (compositore/fogli.js).
// Regole (specifiche/compositore-rifiniture-1.md, punto 1): le tappe vanno nel giorno aperto, nello stesso itinerario;
// i giorni dopo del pronto riempiono i giorni seguenti se sono vuoti, altrimenti se ne inserisce uno; una tappa già nel
// viaggio resta dov'è; se non c'è posto non cambia niente (come «Sposta nel giorno»).
import { giornoVuoto, MAX_GIORNI, MAX_TAPPE } from './link.ts';
import type { Giorno, Itinerario } from './tipi';

export type ProntoNelGiorno = {
  giorni: Giorno[];
  giorno: number;                              // il giorno da mostrare: quello dove sono andate le prime tappe
  aggiunte: string[];
  gia: { id: string; giorno: number }[];       // tappe del pronto già nel viaggio: restano dove sono
};
export type ProntoNo = 'limite-giorni' | 'limite-tappe' | 'niente';

export function prontoNelGiorno(x: Itinerario, g: number, pronto: Giorno[]): ProntoNelGiorno | ProntoNo {
  const presenti = new Map<string, number>();
  x.giorni.forEach((G, k) => { if (!G.gita) for (const id of G.tappe) presenti.set(id, k); });
  const gia: ProntoNelGiorno['gia'] = [];
  const blocchi = pronto.map(P => ({ P, tappe: P.tappe.filter(id => {
    const k = presenti.get(id);
    if (k === undefined) return true;
    gia.push({ id, giorno: k });
    return false;
  }) })).filter(b => b.tappe.length);
  if (!blocchi.length) return 'niente';

  const giorni = structuredClone(x.giorni);
  // il giorno aperto: se è una gita (dalla pagina non succede) le tappe vanno in un giorno nuovo subito dopo
  let pos = Math.min(Math.max(0, g), giorni.length - 1);
  let primo = -1;
  for (const [k, { P, tappe }] of blocchi.entries()) {
    let dove = k === 0 ? pos : pos + 1;
    const G = giorni[dove];
    const libero = k === 0 ? G && !G.gita : G && !G.gita && !G.tappe.length;
    if (!libero) { if (k === 0) dove = pos + 1; giorni.splice(dove, 0, giornoVuoto(P.inizio, P.fine)); }
    if (giorni[dove].tappe.length + tappe.length > MAX_TAPPE) return 'limite-tappe';
    giorni[dove].tappe = [...giorni[dove].tappe, ...tappe];
    if (primo < 0) primo = dove;
    pos = dove;
  }
  if (giorni.length > MAX_GIORNI) return 'limite-giorni';
  return { giorni, giorno: primo, aggiunte: blocchi.flatMap(b => b.tappe), gia };
}
