import metadati from '../data/fonti-metadati.json' with { type: 'json' };
import { fontiDiNextstop } from './fonti-nextstop.mjs';
export { argomenti } from './fonti-argomenti.mjs';
/** @type {Record<string, import('./fonti-registro-tipi').MetadatiFonte>} */
const meta = metadati;
/** @param {string | Date} data */
const iso = data => new Date(typeof data === 'string' ? data : data.getTime()).toISOString().slice(0,10);
// Titoli, URL, editori e date hanno una sola sorgente: fonti.yaml.
/** @param {Iterable<import('./fonti-registro-tipi').FonteInput>} fonti @returns {import('./fonti-registro-tipi').FonteRegistro[]} */
export function registroFonti(fonti) {
  return fontiDiNextstop(fonti).map(f => {
    const d = f.data ?? f;
    const m = meta[f.id];
    if (!m?.descrizione) throw new Error(`Metadati fonte mancanti: ${f.id}`);
    return { ...m, id:f.id, titolo:d.titolo, titoloOriginale:d.titolo, url:d.url, editore:d.editore,
      tipo:d.tipo, data:iso(d.controllato), dataLabel:'Controllo registrato', pubblicato:d.pubblicato?iso(d.pubblicato):'',
      avviso:m.avviso || (d.letta===false?'Documento non consultato integralmente.':''),
      nota:[m.nota,d.nota].filter((v,i,a)=>v&&a.indexOf(v)===i).join(' '),
      formato:m.formato || (/\.pdf(?:[?#]|$)/i.test(d.url)?'PDF':/\.zip(?:[?#]|$)/i.test(d.url)?'ZIP':'') };
  });
}
/** @param {Iterable<import('./fonti-registro-tipi').FonteRegistro>} fonti */
export const ordinaFonti = fonti => [...fonti].sort((a,b)=>a.priorita-b.priorita || (a.luoghi[0]||a.titolo).localeCompare(b.luoghi[0]||b.titolo,'it'));
/** @param {string} id */
export const slugFonte = id => id.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
