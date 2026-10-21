// Solo build/Node: controlla i file scritti dopo le trasformazioni del compilatore.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { FILE_GENERATI, verificaGenerazione } from '../src/lib/itinerari/generazione-dati.mjs';
import { riferimentoDati } from '../src/lib/itinerari/riferimento-dati.mjs';

const sorgenti = fileURLToPath(new URL('../src/data/', import.meta.url));

/** @param {string} out */
export function verificaPercorsiPubblicati(out) {
  let dati, mappa;
  try {
    dati = /** @type {import('../src/lib/itinerari/dati-generati-tipi').DatiGenerati} */ (Object.fromEntries(FILE_GENERATI.map(nome => [
      nome, JSON.parse(fs.readFileSync(path.join(sorgenti, nome), 'utf8'))
    ])));
    mappa = JSON.parse(fs.readFileSync(path.join(sorgenti, 'mappa.json'), 'utf8'));
    verificaGenerazione(dati, { w: mappa.w, h: mappa.h, box: mappa.box });
  } catch (cause) {
    throw new Error('Percorsi pubblicati: sorgenti non leggibili o non coerenti', { cause });
  }

  const tempi = dati['tempi-tappe.json'];
  const principali = dati['percorsi-tappe.json'];
  const alternativi = dati['percorsi-alternativi.json'];
  const riferimento = riferimentoDati(tempi, { w: mappa.w, h: mappa.h, box: mappa.box });
  /** @type {Record<string, Record<string, unknown>>} */
  const attesi = {
    'percorsi.json': { riferimento, punti: principali.punti, scenari: principali.scenari },
    'percorsi-alternativi.json': {
      riferimento, firma: alternativi.firma, senza: alternativi.senza, candidati: alternativi.candidati
    }
  };

  for (const [nome, atteso] of Object.entries(attesi)) {
    let letto;
    try {
      letto = JSON.parse(fs.readFileSync(path.join(out, 'napoli/itinerari', nome), 'utf8'));
    } catch (cause) {
      throw new Error('Percorsi pubblicati: ' + nome + ' assente o non leggibile', { cause });
    }
    if (!isDeepStrictEqual(letto, atteso)) {
      const campi = [...new Set([...Object.keys(atteso), ...Object.keys(letto ?? {})])]
        .filter(k => !isDeepStrictEqual(letto?.[k], atteso[k]));
      throw new Error('Percorsi pubblicati: ' + nome + ' differisce dai sorgenti nei campi '
        + campi.join(', ') + '; build interrotta prima della cache');
    }
  }
  return { file: 2, riferimento };
}
