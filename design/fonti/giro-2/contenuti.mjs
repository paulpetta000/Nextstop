// Sintesi delle prove già raccolte nel Blocco 2; nessuna verifica o data nuova.
import fs from 'node:fs';
import { esempi as originali } from '../giro-1/esempi.mjs';

const sintesi = {
  'tp-eav-l1-orario': ['Orari Napoli–Sorrento · dal 1° ottobre 2026', 'Verifica parziale del PDF: tabella da controllare. La durata cambia con stazione e corsa; non è in tempo reale.'],
  'tp-eav-campania-express-sospeso': ['Sospensione del Campania Express · riscontro parziale', 'Pagina non consultata integralmente. Il riscontro viene dal solo risultato di ricerca.'],
  'tp-anm-gtfs': ['Linee, fermate e orari degli autobus ANM', 'Validità registrata: 22 settembre–31 dicembre 2026. Orari programmati, senza deviazioni o lavori. Licenza IODL 2.0.'],
  'bozza-D2': ['Teatro e accesso su appuntamento', 'Riguarda la sede della Fondazione, non l’accesso libero all’intero palazzo.'],
  'tp-catacombe-sangennaro': ['Durata della visita', ''],
  'bozza-S1': ['Chiocciola Slow Food · edizione 2025', 'Premio dell’edizione 2025, non di quella attuale. Documento pubblicato il 14 ottobre 2024.'],
  'gri-pasta-patate-2024': ['Pasta, patate e provola · selezione del 2024', 'Giudizio della testata; non documenta prezzi o orari attuali.'],
  'bozza-G4': ['Pasticcerie · selezione del 2022', 'Non è una classifica attuale e non prova la notorietà del fiocco di neve «all’estero».'],
  'sdg-pintauro-2026': ['Riapertura annunciata per marzo 2026', 'Riapertura successiva da verificare: l’annuncio del 17 febbraio 2026 non prova che sia avvenuta.'],
  'sdg-pignatelli-2026': ['Genovese · recensione di gennaio 2026', 'Opinione della testata, non di Nextstop.'],
  'sdg-cono-graffa': ['Cono graffa · articolo del 2016', 'Aggiornato nel 2019; non verifica la disponibilità odierna.'],
  'stripes-tufo-2022': ['Pasta e patate e genovese · recensione del 2022', 'Esperienza dell’autrice del 29 dicembre 2022; non verifica il servizio attuale.']
};
const condivise = {
  'gri-pasta-patate-2024': ['La Locanda Gesù Vecchio', 'Trattoria da Nennella'],
  'bozza-G4': ['Di Costanzo', 'Poppella']
};
const breviDate = {
  'Lettura testuale del PDF': 'Lettura parziale',
  'Tentativo di consultazione': 'Consultazione tentata',
  'Controllo del passaggio': 'Passaggio letto',
  'Controllo registrato': 'Controllo registrato'
};
export const esempi = originali.map(s => ({
  ...s, scopo: sintesi[s.id][0], avvertenza: sintesi[s.id][1],
  cautela: !!s.limite || ['bozza-D2', 'bozza-G4'].includes(s.id),
  dataLabel: breviDate[s.controllo],
  luoghi: condivise[s.id] ?? [s.gruppo],
  gruppo: condivise[s.id] ? 'Fonti condivise' : s.gruppo,
  scopoDisponibile: true
}));

// Snapshot del primo giro: 180 documenti reali, non il grande inventario storico.
const precedenti = JSON.parse(fs.readFileSync(new URL('../giro-1/fixture-lungo.json', import.meta.url)));
const perId = new Map(esempi.map(s => [s.id, s]));
export const lungo = precedenti.map(s => {
  // Questi sono nomi collegati nei dati, non prove ricavate dal titolo o dal dominio.
  const luoghi = [...new Set((s.nota.startsWith('Collegata alle informazioni su: ')
    ? s.nota.slice('Collegata alle informazioni su: '.length).split('. Associazione da verificare')[0].split('; ').map(v => v.replace(/ \([^)]*\)$/, '')) : []))];
  const letta = perId.get(s.id);
  const gruppo = s.id === 'osm' ? 'Mappe e dati' : luoghi.length > 1 ? 'Fonti condivise' : luoghi[0] ?? 'Trasporti e dati';
  return {
    id: s.id, titolo: s.titolo, editore: s.editore, url: s.url, formato: s.formato,
    data: s.data, dataLabel: 'Controllo registrato', gruppo, luoghi,
    area: s.id === 'osm' ? 'Mappe e dati' : s.area,
    scopo: s.id === 'osm' ? 'Costa, strade, stazioni e punti panoramici della mappa' : letta?.scopo ?? '',
    scopoDisponibile: s.id === 'osm' || !!letta,
    // La fonte OSM non diventa una prova degli orari dei luoghi collegati.
    avvertenza: s.id === 'osm' ? 'Dati cartografici, licenza ODbL; non documenta gli orari di apertura.' : letta?.avvertenza ?? (s.letta === false ? 'Documento non consultato integralmente.' : ''),
    cautela: letta?.cautela ?? s.letta === false,
    prova: s.id === 'osm' ? 'src/data/fonti.yaml · osm' : letta?.prova ?? 'Collegamenti dichiarati nella fixture del giro 1'
  };
});
if (lungo.length !== 180 || new Set(lungo.map(s => s.url)).size !== 180) throw new Error('Copertura del caso lungo cambiata.');

export const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
export const ordina = list => [...list].sort((a, b) => a.gruppo.localeCompare(b.gruppo, 'it') || Number(b.scopoDisponibile) - Number(a.scopoDisponibile) || a.titolo.localeCompare(b.titolo, 'it'));
