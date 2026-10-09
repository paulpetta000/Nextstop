// Condivisa dalla build e da scripts/itinerari/costruisci.mjs. Solo Node, non il browser.
import { createHash } from 'node:crypto';

/**
 * Impronta delle posizioni, in ordine di id. Mantieni il formato: i dati generati lo usano già.
 * @param {{ id: string, lat: number, lon: number, fine?: { lat: number, lon: number } }[]} tappe
 */
export const firmaPosizioni = tappe =>
  createHash('sha1').update(JSON.stringify([...tappe]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(t => [t.id, t.lat, t.lon, t.fine ? [t.fine.lat, t.fine.lon] : null])))
    .digest('hex').slice(0, 12);
