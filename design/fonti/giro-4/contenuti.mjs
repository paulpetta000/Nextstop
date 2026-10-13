// Rifiniture editoriali dei soli esempi già documentati. ID, URL e date restano quelli originali.
import { esempi as baseEsempi, lungo as baseLungo, normalize } from '../giro-2/contenuti.mjs';
export { normalize };
const testi = {
  'tp-eav-l1-orario': {
    descrizione: 'Orari programmati · dal 1° ottobre 2026',
    avviso: 'PDF letto in forma testuale: la tabella non è stata controllata visivamente.',
    nota: 'La durata cambia con stazione e corsa; gli orari non sono in tempo reale.',
    priorita: 1, parole: ['treno', 'treni', 'circumvesuviana', 'ferrovia']
  },
  'tp-eav-campania-express-sospeso': {
    descrizione: 'Sospensione dal 1° ottobre 2026 · riscontro parziale',
    avviso: 'Pagina non consultata integralmente: il riscontro viene dal solo risultato di ricerca.',
    priorita: 4, parole: ['treno', 'treni']
  },
  'tp-anm-gtfs': {
    descrizione: 'Linee, fermate e orari programmati',
    avviso: 'Validità registrata: 22 settembre–31 dicembre 2026. Non include deviazioni o lavori.',
    nota: 'Archivio di dati degli autobus, licenza IODL 2.0.',
    titoloBreve: 'Scarica i dati degli autobus ANM', priorita: 1, parole: ['bus', 'autobus', 'fermata', 'fermate']
  },
  'bozza-D2': {
    descrizione: 'Teatro e accesso su appuntamento',
    avviso: 'L’appuntamento riguarda la sede della Fondazione, non l’accesso libero all’intero palazzo.',
    priorita: 1, parole: ['prenotazione', 'prenotare', 'appuntamento']
  },
  'tp-catacombe-sangennaro': {
    descrizione: 'Durata della visita', priorita: 1, parole: ['durata', 'tempo', 'tempi', 'quanto dura']
  },
  'bozza-S1': {
    descrizione: 'Chiocciola Slow Food · edizione 2025',
    avviso: 'Il riconoscimento riguarda l’edizione 2025, non quella attuale.',
    nota: 'Documento pubblicato il 14 ottobre 2024.',
    priorita: 2, parole: ['premio', 'riconoscimento', 'guida', 'osterie']
  },
  'gri-pasta-patate-2024': {
    descrizione: 'Pasta, patate e provola · selezione del 2024',
    avviso: 'Giudizio della testata; non documenta prezzi o orari attuali.',
    titoloBreve: 'Gli 8 ristoranti scelti da Gambero Rosso',
    lingua: 'In inglese', priorita: 3, parole: ['recensione', 'cucina', 'pasta e patate']
  },
  'bozza-G4': {
    descrizione: 'Pasticcerie · selezione del 2022',
    avviso: 'La selezione è del 2022. Non prova la notorietà del fiocco di neve «all’estero».',
    priorita: 3, parole: ['recensione', 'pasticceria', 'pasticcerie']
  },
  'sdg-pintauro-2026': {
    descrizione: 'Riapertura annunciata per marzo 2026',
    avviso: 'L’annuncio del 17 febbraio 2026 non conferma che la riapertura sia avvenuta.',
    priorita: 3, parole: ['apertura', 'riapertura', 'annuncio']
  },
  'sdg-pignatelli-2026': {
    descrizione: 'Genovese · recensione di gennaio 2026',
    avviso: 'Opinione della testata, non di Nextstop.',
    priorita: 3, parole: ['recensione', 'cucina', 'genovese']
  },
  'sdg-cono-graffa': {
    descrizione: 'Cono graffa · articolo del 2016',
    avviso: 'Aggiornato nel 2019; non verifica la disponibilità odierna.',
    priorita: 3, parole: ['recensione', 'gelato', 'graffa']
  },
  'stripes-tufo-2022': {
    descrizione: 'Pasta e patate e genovese · recensione del 2022',
    avviso: 'Esperienza dell’autrice del 29 dicembre 2022; non verifica il servizio attuale.',
    lingua: 'In inglese', priorita: 3, parole: ['recensione', 'cucina', 'pasta e patate']
  },
  'osm': {
    descrizione: 'Costa, strade, stazioni e punti panoramici della mappa',
    avviso: 'Dati cartografici, non orari di apertura.',
    nota: 'Licenza ODbL.', priorita: 1, parole: ['mappa', 'mappe', 'cartografia']
  }
};
const refine = s => ({ ...s,
  descrizione: s.scopo || '', avviso: s.avvertenza || '', nota: '',
  priorita: s.scopoDisponibile ? 2 : 5, parole: [], ...testi[s.id],
  // La forma breve è editoriale; il titolo originale è sempre conservato e consultabile.
  titoloOriginale: s.titolo, formato: s.formato === 'Download ZIP' ? 'ZIP' : s.formato
});
export const esempi = baseEsempi.map(refine);
export const lungo = baseLungo.map(refine);
export const ordina = list => [...list].sort((a, b) => a.gruppo.localeCompare(b.gruppo, 'it') || a.priorita - b.priorita || a.titolo.localeCompare(b.titolo, 'it'));
