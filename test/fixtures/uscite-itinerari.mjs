const scenari = ['feriale', 'sabato', 'sabato-pomeriggio', 'domenica', 'festivo', 'piedi'];
const matrice = (diagonale, altro) => [[diagonale, altro], [altro, diagonale]];
export const proiezione = { w: 100, h: 100, box: { w: 0, e: 1, n: 1, s: 0 } };
export function usciteItinerari() {
  const firma = 'posizioni-fittizie', generato = '2026-10-18';
  const T = {
    firma, generato, punti: ['a', 'b'], linee: [{ id: 'B1', nome: 'Bus 1' }],
    dati: { bus: { dal: '20261018', al: '20261018', preferenza: 5 } },
    candidati: [{ seg: [2, 'B1|salita|discesa', 3], m: 200, mezzi: 'B1' }],
    scenari: Object.fromEntries(scenari.map(nome => [nome, {
      min: matrice(0, 20), piedi: matrice(0, 100), salita: matrice(0, 0),
      ...(nome === 'piedi' ? {} : { mezzi: matrice('', 'B1'), senza: { min: matrice(0, 30), piedi: matrice(0, 1500), mezzi: matrice('', '') }, bus: matrice(0, [0]) })
    }]))
  };
  const P = { firma, generato, dal: '20261018', al: '20261018', giorni: { '20261018': 0 }, tipi: [{ salite: {'B1|salita':[600,30]}, viaggi: {'B1|salita|discesa':10} }], fermate: {salita:'Salita',discesa:'Discesa'} };
  const D = { firma, generato, punti: ['a', 'b'], scenari: Object.fromEntries(scenari.map(nome => [nome, matrice('', nome === 'feriale' ? 'p.AACC' : 0)])) };
  const A = { firma, generato, senza: Object.fromEntries(scenari.filter(n => n !== 'piedi').map(nome => [nome, matrice('',0)])), candidati: ['p.AACC'] };
  const L = { generato, dal: P.dal, al: P.al, linee: [] };
  return {'tempi-tappe.json':T,'partenze-bus.json':P,'linee-bus.json':L,'percorsi-tappe.json':D,'percorsi-alternativi.json':A};
}
