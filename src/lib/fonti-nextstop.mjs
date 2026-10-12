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
