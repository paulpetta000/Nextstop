// Enrico, 12/10/2026: le fonti delle regate non fanno parte degli elenchi pubblici
// di Nextstop. I record originali restano risolvibili per conservare le schede e
// il calendario esistenti; questa selezione non cambia il comportamento dell'evento.
const FONTI_REGATE = new Set([
  'ac-grazie-napoli', 'ac-formato-lvc', 'ac-youth-date', 'ac-38',
  'ac-host-venue', 'ac-programma-pr2', 'ac-protocollo',
  'etnz-formato', 'comune-citta-ospitante'
]);

/** @param {string} id */
export const fonteDiNextstop = id => !FONTI_REGATE.has(id);

/** @template {{ id: string }} T @param {Iterable<T>} fonti @returns {T[]} */
export const fontiDiNextstop = fonti => [...fonti].filter(f => fonteDiNextstop(f.id));

// Selezione comune per testi, schede e documenti aggiuntivi della pagina.
export function fontiPerPagina(fatti, extra = [], tappe = [], registro = new Map()) {
  const uniche = new Map();
  for (const fatto of fatti) for (const fonte of fatto.fontiRisolte) uniche.set(fonte.id, fonte);
  for (const fonte of extra) uniche.set(fonte.id, fonte);
  for (const tappa of tappe) {
    const id = tappa.data.durataFonte?.id;
    if (!id) continue;
    const fonte = registro.get(id);
    if (!fonte) throw new Error(`Fonte della durata non trovata: ${id}`);
    uniche.set(id, fonte);
  }
  return fontiDiNextstop(uniche.values());
}
