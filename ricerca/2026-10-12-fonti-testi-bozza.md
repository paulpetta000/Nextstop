# Fonti e controlli · bozza dei testi

_12/10/2026, Blocco 2. Testi da rivedere prima dei bozzetti e dell'integrazione. Solo informazioni di viaggio di Nextstop: nessun testo sulle regate. [Specifica approvata](../specifiche/fonti-e-controlli.md) · [Verifiche e limiti](2026-10-12-fonti-verifiche-prioritarie.md)._

La parte «Testo proposto» è la bozza destinata al visitatore; le note successive sono istruzioni editoriali interne, non contenuti da mostrare sul sito. Le procedure proposte e le diciture dei pannelli diventeranno effettive con l'implementazione approvata. Questa bozza non dichiara che tutte le fonti siano state ricontrollate oggi.

## Testo proposto per `/fonti/`

# Fonti e controlli

Un orario, un biglietto, una prenotazione: qui trovi i documenti che usiamo per costruire gli itinerari di Napoli. Puoi consultare le fonti per luogo o argomento e aprire il documento originale.

### Da dove partiamo

Per orari, prezzi e prenotazioni cerchiamo prima le informazioni pubblicate dal luogo o dal locale. Per gli spostamenti usiamo i documenti delle aziende di trasporto e i dati aperti su cui calcoliamo i percorsi.

Storia, cucina e riconoscimenti richiedono fonti diverse. Un menu documenta un prezzo; una guida gastronomica documenta una sua selezione. Quando parliamo di un premio, indichiamo la guida e l'edizione a cui si riferisce.

### Cosa significa la data

La data del controllo indica quando abbiamo verificato l'informazione riportata. La data di pubblicazione, quando disponibile, dice invece quando è uscito il documento. Il periodo di validità può essere ancora diverso: per esempio un orario dei trasporti può valere soltanto per una stagione.

Se leggiamo solo un riassunto o non riusciamo a consultare il documento completo, lo segnaliamo. Un dato del passato resta legato al suo anno: non diventa attuale perché abbiamo riaperto la pagina oggi.

### Quando serve cautela

Un asterisco segnala un'informazione che richiede cautela. Il motivo è spiegato nella frase: può venire da una fonte non confermata, riferirsi a un periodo diverso o essere ancora da definire.

Anche una notizia già pubblicata può richiedere un controllo ulteriore. Un annuncio di apertura, per esempio, non dimostra che il luogo abbia poi aperto.

### I tempi sono stime

Le durate che proponiamo per organizzare la giornata sono stime, salvo quando il gestore indica quanto dura un'attività. I tempi di spostamento vengono dai percorsi e dagli orari programmati: attese, traffico e condizioni del servizio possono cambiare il viaggio.

Trovi il metodo e le fonti dei calcoli in fondo alla pagina [Itinerari a Napoli](/napoli/itinerari/). Prima di prenotare o partire, controlla il documento del gestore per il giorno che hai scelto.

### Consulta le fonti

Scegli un argomento, poi cerca il luogo o il servizio che ti interessa. Ogni voce indica cosa documenta, chi l'ha pubblicata e la data del controllo.

Le fonti della pagina che stai leggendo sono raccolte in fondo, nella sezione «Fonti di questa pagina»: aprila e tocca il titolo del documento per consultare l'originale.

### Foto, mappe e dati

I crediti delle fotografie e le licenze dei materiali sono nelle [note legali](/note-legali/). L'attribuzione dei dati della mappa resta anche accanto alla mappa.

### Segnala una correzione

Hai trovato un orario diverso o un collegamento che non si apre? [Scrivici](mailto:napoliavela.guida@gmail.com) indicando il luogo, la pagina di Nextstop e, se disponibile, il documento aggiornato. Ci aiuti a individuare l'informazione da ricontrollare.

## Testi proposti per il blocco apribile

| Posizione | Testo |
|---|---|
| Titolo | Fonti di questa pagina |
| Invito breve | Apri le fonti e consulta i documenti originali. |
| Conteggio nel comando | Numero delle fonti uniche, generato dai dati; niente numero fisso nella bozza |
| Precisazione per il compositore | Qui trovi le fonti delle tappe, dei locali e degli spostamenti disponibili in questa pagina. |
| Avviso fuori dal pannello, solo se necessario | Un asterisco segnala un'informazione da leggere con cautela. Il motivo è spiegato nella frase. |
| Titolo del link esterno | Titolo preciso del documento, eventualmente con «PDF» o «download ZIP» |
| Metadati | Editore · Documenta: argomenti verificati · Controllata il [data effettiva] |
| Limite, se presente | Documento non consultato integralmente. |
| Collegamento al metodo | Come scegliamo e controlliamo le fonti |

Nessuna frase generica «Tutto controllato oggi» o «Fonti ufficiali, quindi informazioni garantite». La data aggregata va definita nell'implementazione; non inserire una data unica finché non viene corretto e verificato il suo significato.

## Etichette «Documenta» basate su queste verifiche

| Documento | Etichetta proposta | Limite da conservare |
|---|---|---|
| EAV L1 | Orari programmati Napoli–Sorrento dal 1° ottobre 2026 | Stazione di partenza e corsa cambiano la durata; PDF, non servizio in tempo reale |
| Fondazione De Felice | Teatro di Palazzo Donn'Anna e accesso alla sede su appuntamento | Non descrive l'accesso libero a tutto il palazzo |
| Slow Food 2025 | Chiocciola di La Chitarra nell'edizione 2025 | Anno della guida distinto dal controllo del documento |
| Gambero Rosso 2022 | Selezione di pasticcerie nell'edizione 2022 | Non classifica attuale e non prova del dettaglio «all'estero» |
| Gambero Rosso · pasta e patate | Selezione gastronomica del 2024 | Non fonte di prezzi o orari attuali |
| Gambero Rosso · pizza fritta | Selezione gastronomica del 2023 | Giudizio della testata |
| Scatti di Gusto · Pignatelli | Recensione della genovese, gennaio 2026 | Opinione della testata |
| Scatti di Gusto · cono graffa | Descrizione del prodotto, articolo del 2016 | Non verifica della disponibilità odierna |
| Stars and Stripes · Tufò | Recensione della pasta e patate e della genovese, 2022 | Esperienza datata dell'autrice |

## Note interne prima dell'integrazione

1. Conservare il contatto configurato in `src/config/sito.ts`: la casella ha ancora il nome dell'altro progetto, ma cambiarla non è autorizzato e non impedisce il lavoro sulle fonti. In codice leggere il valore dalla configurazione, non duplicarlo.
2. Le pagine e i pannelli futuri devono fare ciò che la bozza descrive. Le frasi su raggruppamenti e metadati non vanno pubblicate prima che questi funzionino.
3. «Prima le informazioni dei gestori» è il criterio di lavoro approvato, non una dichiarazione che ogni prezzo o orario abbia già una fonte forte. Conservare i limiti della fonte debole e dei documenti non letti.
4. Il segno di cautela segue le regole esistenti; i fatti storici e alcune recensioni `comeFatto` hanno eccezioni. Non aggiungere asterischi a tutte le fonti di stampa per rendere il testo più uniforme.
5. Fonti nuove e sostituzioni di URL sono proposte della ricerca, non aggiornamenti già applicati ai dati. Rileggere i testi interessati prima di aggiornare le firme.
6. Foto e mappe conservano i crediti nel loro contesto. Il pannello chiuso non deve nascondere le attribuzioni necessarie.
7. Categorie del registro: luoghi e visite, locali e cucina, trasporti, mappe e dati, storia e cultura. Le regate sono fuori dal perimetro e dal registro pubblico.
8. Contenuti riproducibili per i bozzetti: una fonte breve, un titolo lungo, un documento PDF, il download ANM e una nota di consultazione incompleta. Le etichette dei documenti non ancora letti vanno marcate come esempi da verificare, non come fatti nuovi.

## Stato

Bozza pronta per la revisione di Enrico; non integrata in `src/testi/` o nelle pagine. Il design del blocco fonti e della pagina generale è il lavoro successivo, con quattro proposte per pezzo e nuova autorizzazione.
