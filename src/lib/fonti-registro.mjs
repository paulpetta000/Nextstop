import metadati from '../data/fonti-metadati.json' with { type: 'json' };
import { fontiDiNextstop } from './fonti-nextstop.mjs';
export { argomenti } from './fonti-argomenti.mjs';
const iso = data => new Date(data).toISOString().slice(0,10);
// Titoli, URL, editori e date hanno una sola sorgente: fonti.yaml.
export function registroFonti(fonti) {
  return fontiDiNextstop(fonti).map(f => {
    const d = f.data ?? f;
    const m = metadati[f.id];
    if (!m?.descrizione) throw new Error(`Metadati fonte mancanti: ${f.id}`);
    return { ...m, id:f.id, titolo:d.titolo, titoloOriginale:d.titolo, url:d.url, editore:d.editore,
      tipo:d.tipo, data:iso(d.controllato), dataLabel:'Controllo registrato', pubblicato:d.pubblicato?iso(d.pubblicato):'',
      avviso:m.avviso || (d.letta===false?'Documento non consultato integralmente.':''),
      nota:[m.nota,d.nota].filter((v,i,a)=>v&&a.indexOf(v)===i).join(' '),
      formato:m.formato || (/\.pdf(?:[?#]|$)/i.test(d.url)?'PDF':/\.zip(?:[?#]|$)/i.test(d.url)?'ZIP':'') };
  });
}
export const ordinaFonti = fonti => [...fonti].sort((a,b)=>a.priorita-b.priorita || (a.luoghi[0]||a.titolo).localeCompare(b.luoghi[0]||b.titolo,'it'));
export const slugFonte = id => id.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
