// Un solo calcolo per la proposta del locale e per «Mangia qui»: nessuna modifica finché non si applica il giorno restituito.
import { calcolaGiorno, dataDelGiorno, tappaDi } from './calcolo.ts';
import { conPause, pauseDelGiorno } from './pause.ts';
import type { Adesso, Citta, Itinerario } from './tipi';

type Momento = { g: number; q: 'pranzo' | 'cena'; dove: string };

export function preparaPasto(C: Citta, it: Itinerario, m: Momento, id: string, adesso?: Adesso) {
  const originale = it.giorni[m.g];
  if (!originale || originale.gita || !originale.tappe.includes(m.dove) ||
      tappaDi(C, id)?.categoria !== 'mangiare' || it.giorni.some(g => g.tappe.includes(id))) return null;
  const giorno = structuredClone(originale);
  const prova = { ...it, giorni: it.giorni.map((g, k) => k === m.g ? giorno : g) };
  let pause = (giorno.pause ?? pauseDelGiorno(C, originale, calcolaGiorno(C, it, m.g, adesso))).filter(p => p.quale !== 'libero');
  giorno.tappe.splice(giorno.tappe.indexOf(m.dove) + 1, 0, id);
  giorno.pause = pause;
  const calcola = () => conPause(C, giorno, calcolaGiorno(C, prova, m.g, adesso), it.margine, { data: dataDelGiorno(prova, m.g), piedi: it.piedi });
  if (m.q === 'cena') {
    const v = calcola().voci.find(v => v.tipo === 'tappa' && v.id === id);
    const attesa = v?.tipo === 'tappa' ? 1170 - v.inizio : 0;
    if (attesa >= 10) pause = [...pause, { quale: 'libero', min: Math.round(attesa / 5) * 5, dopo: m.dove }];
    giorno.pause = pause;
    const fine = calcola().fine;
    if (fine > giorno.fine) giorno.fine = Math.min(23 * 60 + 30, Math.ceil(fine / 30) * 30);
  }
  return { giorno, calcolo: calcola() };
}
