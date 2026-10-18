// Solo Node/build. Questi cinque file vengono prodotti dalla stessa esecuzione.
import { createHash } from 'node:crypto';
export const FILE_GENERATI = ['tempi-tappe.json', 'partenze-bus.json', 'linee-bus.json', 'percorsi-tappe.json', 'percorsi-alternativi.json'];
export function validaProiezione(p) {
  const b = p?.box;
  if (!Number.isSafeInteger(p?.w) || p.w < 1 || !Number.isSafeInteger(p?.h) || p.h < 1 || !b ||
      ![b.w,b.e,b.n,b.s].every(Number.isFinite) || b.e <= b.w || b.n <= b.s || b.w < -180 || b.e > 180 || b.s < -90 || b.n > 90) {
    throw new Error('Proiezione della mappa non valida: ricostruisci src/data/mappa.json');
  }
}
function impronta(dati, proiezione) {
  validaProiezione(proiezione);
  const hash = createHash('sha256').update(JSON.stringify(proiezione));
  for (const nome of FILE_GENERATI) {
    const { generazione, ...contenuto } = dati[nome];
    hash.update(nome).update(JSON.stringify(contenuto));
  }
  return hash.digest('hex');
}
export function marcaGenerazione(dati, proiezione) {
  const generazione = impronta(dati, proiezione);
  return Object.fromEntries(FILE_GENERATI.map(nome => [nome, { ...dati[nome], generazione }]));
}
export function verificaGenerazione(dati, proiezione) {
  const riferimenti = FILE_GENERATI.map(nome => dati[nome]?.generazione);
  // I dati già pubblicati, senza il nuovo campo, mantengono i controlli precedenti.
  if (riferimenti.every(x => x === undefined)) return;
  const atteso = riferimenti[0];
  if (typeof atteso !== 'string' || !/^[a-f0-9]{64}$/.test(atteso) || riferimenti.some(x => x !== atteso) || impronta(dati, proiezione) !== atteso) {
    throw new Error('File generati incompleti o di calcoli diversi: rifai tutto con node scripts/itinerari/costruisci.mjs <cartella>');
  }
}
