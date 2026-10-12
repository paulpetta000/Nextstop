// Proposte isolate. Il registro conserva gli originali; il campione usa prove già raccolte.
import fs from 'node:fs';
import yaml from 'js-yaml';
import { fontiDiNextstop } from '../../../../src/lib/fonti-nextstop.mjs';
import { esempi, lungo, normalize } from '../../giro-4/contenuti.mjs';
export { normalize };
const raw = fontiDiNextstop(yaml.load(fs.readFileSync(new URL('../../../../src/data/fonti.yaml',import.meta.url),'utf8')));
const iso = d => new Date(d).toISOString().slice(0,10);
const prior = new Map(lungo.map(s => [s.id,s]));
const byUrl = new Map(esempi.map(s => [s.url,s]));
const topic = s => s.area === 'Mappe e dati' ? 'mappe' : /Spostamenti|Treni/.test(s.area) ? 'trasporti' : s.area === 'Locali e cucina' ? 'cucina' : 'visite';
export const argomenti = [
  {id:'visite',nome:'Luoghi e visite',breve:'Visite',intro:'Musei, chiese e luoghi da visitare. Cerca il documento per la domanda che hai: accesso, biglietti o durata.'},
  {id:'cucina',nome:'Locali e cucina',breve:'Cucina',intro:'Locali, recensioni e guide. Una selezione resta legata alla sua edizione: non documenta prezzi o orari attuali.'},
  {id:'trasporti',nome:'Trasporti',breve:'Trasporti',intro:'Orari programmati e documenti dei gestori. Attese, traffico e condizioni del servizio possono cambiare il viaggio.'},
  {id:'mappe',nome:'Mappe e dati',breve:'Mappe',intro:'I dati con cui prepariamo mappe e percorsi. Licenze e attribuzioni restano anche accanto alla mappa.'},
  {id:'cultura',nome:'Storia e cultura',breve:'Cultura',intro:'Riferimenti per storia, piatti e tradizioni. Il documento originale permette di leggere il contesto.'}
];
export const registro = raw.map(f => {
  const old = prior.get(f.id); const evidence = byUrl.get(f.url); const historical = /^wiki-/.test(f.id) && !old;
  return { id:f.id,titolo:f.titolo,titoloOriginale:f.titolo,url:f.url,editore:f.editore,
    data:iso(f.controllato),dataLabel:'Controllo registrato',
    pubblicato:f.pubblicato ? iso(f.pubblicato) : '',
    categoria:historical ? 'cultura' : f.id==='tp-catacombe-sangennaro' ? 'visite' : old ? topic(old) : 'cultura',
    luoghi:old?.luoghi?.length ? old.luoghi : f.id==='tp-catacombe-sangennaro' ? ['Catacombe di San Gennaro'] : [],
    descrizione:evidence?.descrizione || old?.descrizione || '',
    avviso:evidence?.avviso || old?.avviso || (f.letta===false ? 'Documento non consultato integralmente.' : ''),
    nota:evidence?.nota || old?.nota || f.nota || '',
    formato:old?.formato || (/\.pdf(?:[?#]|$)/i.test(f.url) ? 'PDF' : /\.zip(?:[?#]|$)/i.test(f.url) ? 'ZIP' : ''),
    parole:evidence?.parole || old?.parole || [], priorita:evidence?.priorita || old?.priorita || 5,
    lingua:evidence?.lingua || '',
    lettura:evidence && (evidence.data!==iso(f.controllato) || evidence.dataLabel!=='Controllo registrato') ? {data:evidence.data,label:evidence.dataLabel} : null
  };
});
const osm = registro.find(s=>s.id==='osm');
export const campione = [...esempi.map(s=>({...s,categoria:topic(s)})),osm,registro.find(s=>s.id==='wiki-genovese')];
if (registro.length!==195 || new Set(registro.map(s=>s.id)).size!==195 || new Set(registro.map(s=>s.url)).size!==195) throw new Error('Registro pubblico inatteso.');
export const ordina = list => [...list].sort((a,b)=>a.priorita-b.priorita || (a.luoghi[0]||a.titolo).localeCompare(b.luoghi[0]||b.titolo,'it'));
// Configurazione letta, non duplicata né modificata.
const config = fs.readFileSync(new URL('../../../../src/config/sito.ts',import.meta.url),'utf8');
export const email = config.match(/email:\s*'([^']+)'/)[1];
