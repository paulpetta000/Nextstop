// Fixture editoriali isolate: passaggi e limiti del Blocco 2, non nuovi record del sito.
// «controllo» indica la lettura documentata nella ricerca, oppure il controllo registrato.
export const esempi = [
  {
    id: 'tp-eav-l1-orario', gruppo: 'Napoli–Sorrento', area: 'Treni e autobus',
    titolo: 'Orario ferrovia L1 Napoli–Sorrento, valido dal 1° ottobre 2026', editore: 'EAV',
    url: 'https://www.eavsrl.it/download/orario-ferrovia-l1-napoli-sorrento-valido-dal-1-ottobre-2026/?filename=1790769827wpdm_ORARI-NAPOLI-SORRENTO_dal-1%C2%B0-ottobre-2026.pdf&ind=1790769879961&refresh=6accb37179cd81791800177&wpdmdl=58826',
    formato: 'PDF', documenta: 'Orari programmati Napoli–Sorrento dal 1° ottobre 2026',
    data: '2026-10-12', controllo: 'Lettura testuale del PDF',
    limite: 'Verifica incompleta: estrazione testuale letta, tabella non verificata visivamente. Stazione e corsa cambiano la durata; non è un servizio in tempo reale.',
    prova: 'E1', registro: '2026-10-03'
  },
  {
    id: 'tp-eav-campania-express-sospeso', gruppo: 'Napoli–Sorrento', area: 'Treni e autobus',
    titolo: 'Campania Express', editore: 'EAV', url: 'https://www.eavsrl.it/campania-express/',
    documenta: 'Sospensione dal 1° ottobre 2026: riscontro parziale da completare',
    data: '2026-10-12', controllo: 'Tentativo di consultazione',
    limite: 'Documento non consultato integralmente. L’apertura ha restituito 404; l’informazione è comparsa solo nel risultato di ricerca.',
    prova: 'E2', registro: '2026-10-02'
  },
  {
    id: 'tp-anm-gtfs', gruppo: 'Autobus ANM', area: 'Treni e autobus',
    titolo: 'Orari programmati degli autobus (feed GTFS)', editore: 'ANM',
    url: 'https://www.anm.it/google/google-transit.zip', formato: 'Download ZIP',
    documenta: 'Linee, fermate e orari programmati degli autobus ANM',
    data: '2026-10-03', controllo: 'Controllo registrato',
    nota: 'Dati ANM, licenza IODL 2.0. Validità registrata: dal 22 settembre al 31 dicembre 2026. Non include deviazioni o lavori.',
    prova: 'aggiornamenti/fonti-dati.yaml · anm-gtfs'
  },
  {
    id: 'bozza-D2', gruppo: 'Palazzo Donn’Anna', area: 'Luoghi e visite',
    titolo: 'Palazzo Donn’Anna e il Teatro', editore: 'Fondazione De Felice',
    url: 'https://www.fondazionedefelice.it/palazzo-donnanna-2/',
    documenta: 'Teatro di Palazzo Donn’Anna e accesso alla sede su appuntamento',
    data: '2026-10-12', controllo: 'Controllo del passaggio',
    nota: 'La pagina riguarda la sede della Fondazione. Non descrive l’accesso libero a tutto il palazzo.', prova: 'D2'
  },
  {
    id: 'tp-catacombe-sangennaro', gruppo: 'Catacombe di San Gennaro', area: 'Luoghi e visite',
    titolo: 'Catacombe di San Gennaro', editore: 'Catacombe di Napoli',
    url: 'https://catacombedinapoli.it/it/luoghi/catacombe-di-san-gennaro-napoli/',
    documenta: 'Durata della visita indicata dal gestore', data: '2026-10-02', controllo: 'Controllo registrato',
    nota: 'La durata della visita viene dal gestore; i tempi per organizzare la giornata restano stime.',
    prova: 'src/data/tappe.yaml · catacombe'
  },
  {
    id: 'bozza-S1', gruppo: 'Osteria La Chitarra', area: 'Locali e cucina',
    titolo: 'Tutte le Chiocciole di Osterie d’Italia 2025, regione per regione', editore: 'Slow Food',
    url: 'https://www.slowfood.it/tutte-le-chiocciole-di-osterie-ditalia-2025-regione-per-regione/',
    documenta: 'Chiocciola di La Chitarra nell’edizione 2025', data: '2026-10-12', controllo: 'Controllo del passaggio',
    nota: 'Edizione 2025; documento pubblicato il 14 ottobre 2024. Non è un riconoscimento dell’edizione attuale.', prova: 'S1'
  },
  {
    id: 'gri-pasta-patate-2024', gruppo: 'Locanda Gesù Vecchio e Nennella', area: 'Locali e cucina',
    titolo: 'Where to eat pasta, potatoes, and provola in Naples. The 8 best restaurants chosen by Gambero Rosso',
    editore: 'Gambero Rosso International',
    url: 'https://www.gamberorossointernational.com/news/where-to-eat-pasta-potatoes-and-provola-in-naples-the-8-best-restaurants-chosen-by-gambero-rosso/',
    documenta: 'Selezione gastronomica del 2024 per la pasta, patate e provola',
    data: '2026-10-12', controllo: 'Controllo del passaggio',
    nota: 'Giudizio della testata. Non documenta prezzi o orari attuali.', prova: 'G2', registro: '2026-10-04'
  },
  {
    id: 'bozza-G4', gruppo: 'Di Costanzo e Poppella', area: 'Locali e cucina',
    titolo: 'Le migliori pasticcerie di Napoli 2022: gli indirizzi da non perdere', editore: 'Gambero Rosso',
    url: 'https://www.gamberorosso.it/notizie/rubriche/classifiche/le-migliori-pasticcerie-di-napoli-2022-gli-indirizzi-da-non-perdere',
    documenta: 'Selezione di pasticcerie nell’edizione 2022', data: '2026-10-12', controllo: 'Controllo del passaggio',
    nota: 'Non è una classifica attuale e non prova la notorietà del fiocco di neve «all’estero».', prova: 'G4'
  },
  {
    id: 'sdg-pintauro-2026', gruppo: 'Pintauro', area: 'Locali e cucina',
    titolo: 'Pintauro, il tempio delle sfogliatelle riapre a Napoli', editore: 'Scatti di Gusto',
    url: 'https://www.scattidigusto.it/pintauro-tempio-di-sfogliatelle-riapre-a-napoli-nuova-storia',
    documenta: 'Annuncio di una riapertura prevista per fine marzo 2026', data: '2026-10-12', controllo: 'Controllo del passaggio',
    limite: 'Riapertura da verificare: l’articolo del 17 febbraio 2026 annuncia una data futura, non dimostra che la riapertura sia avvenuta.', prova: 'R1', registro: '2026-10-04'
  },
  {
    id: 'sdg-pignatelli-2026', gruppo: 'Ostaria Pignatelli', area: 'Locali e cucina',
    titolo: 'Ostaria Pignatelli a Napoli: menu, prezzi, recensione', editore: 'Scatti di Gusto',
    url: 'https://www.scattidigusto.it/ostaria-pignatelli-a-napoli-menu-prezzi-recensione',
    documenta: 'Recensione della genovese, gennaio 2026', data: '2026-10-12', controllo: 'Controllo del passaggio',
    nota: 'Opinione della testata; non è un giudizio di Nextstop.', prova: 'R2', registro: '2026-10-04'
  },
  {
    id: 'sdg-cono-graffa', gruppo: 'Chalet Ciro', area: 'Locali e cucina',
    titolo: 'Napoli: il cono graffa di Chalet Ciro a Mergellina', editore: 'Scatti di Gusto',
    url: 'https://www.scattidigusto.it/napoli-gelato-cono-graffa-chalet-ciro-mergellina',
    documenta: 'Descrizione del cono graffa nell’articolo del 2016', data: '2026-10-12', controllo: 'Controllo del passaggio',
    nota: 'Articolo del 2016, aggiornato nel 2019. Non verifica la disponibilità odierna.', prova: 'R3', registro: '2026-10-04'
  },
  {
    id: 'stripes-tufo-2022', gruppo: 'Tufò', area: 'Locali e cucina',
    titolo: 'Naples ragu and genovese: Tufò', editore: 'Stars and Stripes',
    url: 'https://www.stripes.com/living/europe_travel/after_hours/2022-12-29/naples-ragu-genovese-8416535.html',
    documenta: 'Recensione della pasta e patate e della genovese, 2022', data: '2026-10-12', controllo: 'Controllo del passaggio',
    nota: 'Esperienza dell’autrice del 29 dicembre 2022; non verifica del servizio attuale.', prova: 'R4', registro: '2026-10-04'
  }
];
