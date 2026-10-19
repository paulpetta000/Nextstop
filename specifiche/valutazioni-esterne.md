# Valutazioni esterne nelle schede · proposta

**Stato: avvio del piano autorizzato da Enrico il 19/10/2026; primo blocco pilota in corso.** Presentazione scelta: righe nella scheda aperta, precisate dal riferimento visivo come fascia compatta sotto la foto, con media, scala, conteggio tra parentesi e piattaforma riconoscibile. Nessun account API attivo, come dichiarato dall’utente; nessuna spesa autorizzata. Stato operativo in [valutazioni](../valutazioni/README.md), nuove evidenze nella [ricerca del pilota](../ricerca/2026-10-19-valutazioni-pilota.md). Il sito pubblico rimane invariato; il laboratorio usa soltanto dati inventati. Questa autorizzazione avvia il lavoro, non approva il futuro rilascio in produzione.

**Aggiornamento decisivo del primo blocco:** recuperati direttamente termini Terra Discover e Linking Policy. La combinazione con altre piattaforme e link di prenotazione non può essere considerata compatibile con i termini standard senza risolvere i vincoli riportati nella nuova ricerca. La lettura diretta dello schema Terra è ora riuscita. Le note precedenti sotto conservano il ragionamento iniziale, corretto da questo aggiornamento: non sono condizioni già superate per l’implementazione.

## Esito della revisione

L’obiettivo è plausibile, ma **non è ancora dimostrato che tutte le piattaforme possano fornire a Nextstop tutti i numeri richiesti nella grafica desiderata**. Il primo passo proposto è verificare diritti, accessi e un piccolo campione; l’estensione al catalogo viene dopo. Il solo link è un ripiego dichiarato, non il completamento della richiesta di media e conteggio.

Correzioni rispetto alla prima proposta:

- Separata la disponibilità documentata di un prodotto dalla sua effettiva utilizzabilità nel sito: Google richiede una prova del componente; Tripadvisor richiede anche condizioni Terra attuali; TheFork non ha un accesso universale dimostrato.
- Recuperati tramite l’indice di ricerca ufficiale indizi più precisi sullo schema Terra attuale: aggregati in `traveler_ratings.overall`, con media e conteggio nell’esempio di versione. La lettura diretta resta intermittente; questo non sostituisce prova autenticata e verifica del contratto.
- Resi espliciti cambi di sede, profili uniti/chiusi, valori mancanti e risposte di accesso negato: non devono diventare voti di un altro luogo o falsi zeri.
- Aggiunti criteri misurabili per richieste, quota, errori, privacy e copertura. Costi e rinnovi non dipendono da una generica frequenza settimanale.

Per una futura lettura AI: partire da questo piano; aprire la ricerca soltanto per la piattaforma interessata. Il registro degli orari resta in [aggiornamenti](../aggiornamenti/README.md), la coda personale in [da-verificare](../da-verificare/fonti-orari.md). Non leggere i rapporti storici per implementare questa proposta, salvo necessità specifica.

## Risultato desiderato

Nelle schede di luoghi e ristoranti mostrare **piattaforma, voto medio, scala, numero di valutazioni/recensioni e collegamento alla pagina corretta**. Nessun testo delle recensioni. Dati separati per Google Maps, Tripadvisor ed eventualmente TheFork: niente media unica o conversione nascosta tra scale diverse.

Esempio solo illustrativo, con numeri inventati: “Google Maps · 4,6/5 · 1.234 valutazioni · Apri”; “Tripadvisor · 4,5/5 · 876 recensioni · Apri”; “TheFork · 9,1/10 · 210 recensioni · Apri”. La resa effettiva dovrà rispettare componenti e marchi concessi dalle piattaforme. Google conta valutazioni anche senza testo: chiamarle tutte “recensioni” può essere inesatto.

## Fattibilità e scelta consigliata

| Piattaforma | Percorso documentato | Verifica necessaria prima dell’integrazione |
|---|---|---|
| Google Maps | **Places UI Kit, componente Place Details**, con blocco del voto e attribuzione ufficiale | Per fatturazione SEE, le normali Places API hanno restrizioni sull’associazione a qualsiasi mappa; le stesse restrizioni non si applicano al UI Kit. Verificare copertura di media/conteggio, resa e costo nel componente web scelto |
| Tripadvisor | **Terra**, API attuale; aggregati documentati in `traveler_ratings.overall` | Accesso e diritti dipendono dal pacchetto; conservazione dei contenuti vietata salvo contratto. Validare media/conteggio nella versione e nel pacchetto ottenuti; leggere Linking Policy e branding correnti |
| TheFork | Collegamento alla scheda corretta; dati numerici soltanto con accesso/licenza adeguati | La documentazione pubblica riguarda partner e gestione ristoranti, non una libera API di voti per tutti i locali. Non dare per acquisita questa copertura |

**Percorso dopo le nuove verifiche:** primo candidato tecnico Google UI Kit; confronto con Tripadvisor subordinato a condizioni compatibili, oltre all’accesso API. TheFork rimane facoltativo per i ristoranti presenti e autorizzati. Moduli distinti e righe separate non risolvono da soli un vincolo contrattuale. Prima di estendere un’integrazione, mostrare a Enrico quali piattaforme superano davvero le verifiche. Se un vincolo impedisce media e conteggio, dichiarare il limite e proporre la scelta successiva senza sostituire silenziosamente l’obiettivo con soli link.

Assunzione da confermare prima dello sviluppo: titolare e account di fatturazione in Italia/SEE. Non è stato verificato un account Google/Tripadvisor dell’utente. Non cambiare la mappa attuale di Nextstop per aggirare un vincolo: scegliere un’integrazione compatibile o lasciare il solo collegamento.

## Quattro idee per la presentazione

1. **Righe nella scheda aperta:** una per piattaforma, con media, conteggio e link. Vicine ai dettagli del luogo; spazio da riservare alle attribuzioni obbligatorie. I componenti Google non si smontano per ricopiare i numeri in una grafica propria.
2. **Sezione espandibile “Valutazioni online” — preferita:** la scheda rimane leggera; un’azione esplicita carica le piattaforme selezionate e rende chiara la provenienza. Buona per privacy, costo e componenti ufficiali più ingombranti.
3. **Due riquadri affiancati:** Google e Tripadvisor, impilati sul telefono. Confronto immediato, ma maggiore altezza e attenzione ai loghi, al contrasto e al numero di richieste.
4. **Collegamenti sempre disponibili, numeri su richiesta:** utile come avvio o ripiego quando una piattaforma manca. La semplice lista non deve fare partire script, immagini remote o richieste di valutazioni.

Le quattro descrizioni conservano le alternative discusse. **Enrico ha scelto la 1**, poi precisata con immagine di riferimento: fascia compatta sotto la foto. La preferenza iniziale per la 2 è superata. Il [laboratorio](../design/valutazioni/README.md) prova tale disposizione senza dati o marchi reali; il risultato del componente ufficiale resta da verificare. Il solo tocco che apre una scheda non autorizza implicitamente tutti i servizi esterni: mantenere una scelta esplicita e comprensibile.

## Associare la scheda giusta

Il progetto ha 60 tappe/gite e 32 locali: **92 entità non significano 92 pagine per piattaforma**. Alcune passeggiate non hanno una scheda autonoma; Duomo/Tesoro, bosco/museo e gite composte possono averne più di una. Google, Tripadvisor e TheFork possono coprire insiemi diversi.

Preparare, solo dopo l’OK, un’associazione per ID interno, piattaforma, ID esterno, URL, nome/sede e parte recensita, con data e stato della verifica. Controllare civico, coordinate e identità: 50 Kalò Sannazaro/Repubblica, Gesù Vecchio 26/4, Concettina Sanità/Capri e Palazzo Petrucci pizzeria/ristorante non sono intercambiabili. Il voto di una componente va indicato come tale, non attribuito a tutta la gita. Associazione incerta: niente voto e niente collegamento presentato come verificato.

Separare i metadati editoriali di Nextstop dai contenuti ottenuti dal fornitore: il permesso di conservare un ID non autorizza a copiare indefinitamente nomi, indirizzi, coordinate o URL ricevuti dall’API. Registrare per ogni campo origine e conservazione consentita. Nei controlli futuri rivedere abbinamenti dopo trasferimenti, chiusure, fusioni o reindirizzamenti; conservare l’ID interno e sospendere il voto finché la nuova associazione non è verificata. Una segnalazione di chiusura del provider non aggiorna automaticamente gli orari ufficiali del sito.

Non inventare un punteggio per un luogo senza profilo e non usare zero per indicare dato assente. Distinguere: profilo non trovato, profilo non ancora verificato, conteggio zero, dati non disponibili, servizio temporaneamente irraggiungibile e accesso non autorizzato.

Media e conteggio devono appartenere allo stesso profilo e alla stessa risposta/componente; non unire una media nuova a un conteggio precedente. Non ricostruire il totale sommando un campione di recensioni o una sola lingua. Campo omesso o risposta non valida: dato indisponibile, non zero. Arrotondamenti soltanto come consentiti dal provider; nessuna promessa di sincronizzazione istantanea con la sua pagina pubblica. Un’eventuale data indica la lettura effettuata, non la data di aggiornamento del voto da parte della piattaforma.

## Integrazione coerente con Nextstop

Le schede esistenti sono `src/components/itinerari/Scheda.astro` e `SchedaLocale.astro`; vengono anche copiate da `<template>` nei pannelli del compositore. Lo schema è in `src/content.config.ts`; la mappa usa dati OpenStreetMap e l’informativa è `src/pages/privacy.astro`.

Proposta tecnica per una fase approvata:

- Conservare gli **abbinamenti di identità**, non un archivio indiscriminato di voti, in una raccolta dedicata da definire nello schema. Dati Google/Tripadvisor non entrano automaticamente nei fatti confermati o nel registro degli orari.
- Un modulo condiviso per luoghi e locali, con nomi accessibili, scala esplicita, numeri in formato italiano e un link verificato per ciascuna piattaforma. Nessun componente visibile implementato ora.
- **Google:** caricare la libreria/UI Kit dopo l’azione prevista, solo per la scheda realmente visualizzata; evitare richieste nei `<template>` nascosti e nella lista completa. Verificare con il componente web che media e conteggio siano entrambi disponibili e che si possano omettere testi, foto e riepiloghi non richiesti senza rimuovere attribuzioni obbligatorie.
- Nel pilota Google annotare versione/canale del componente, eventuale stato preview, configurazione supportata e richieste effettive. L’esempio della guida con mappa Google non va copiato integralmente: verificare il componente accanto alla mappa attuale senza caricare una seconda mappa o chiamare `fetchFields()` come ripiego non valutato. Niente estrazione dei numeri dal DOM del widget per ridisegnarli altrove.
- **Tripadvisor:** eventuale funzione lato server con chiave privata e lista degli ID autorizzati, senza un proxy aperto a URL arbitrari. Presentazione conforme al contratto Terra e ai collegamenti obbligatori. Il piano non presume che i vecchi campi `num_reviews` o i vecchi termini Content API siano il contratto Terra.
- Chiave Google destinata al browser limitata a sito/API e quote; chiavi private Tripadvisor/TheFork soltanto sul server. Nessuna chiave inserita nei file pubblici, log o proposte.
- Richieste attivate dalla scelta della persona; nessun caricamento esterno anticipato. Aggiornare l’informativa per componenti e immagini remote effettivamente usati. Cache CDN, browser, service worker, localStorage e copie offline dei voti devono rispettare i diritti concessi: **nessuna TTL di sette giorni o trenta giorni inventata**.
- Progettare il comando in modo che dica quali piattaforme contatterà; aprire una scheda del luogo non equivale automaticamente a scegliere tutti i servizi esterni. Verificare nella rete del browser anche SDK, immagini dei marchi e connessioni anticipate. Il comando da solo non dimostra l’adempimento di ogni obbligo privacy: informativa e gestione dell’eventuale consenso dipendono dai servizi effettivi.
- Per le valutazioni indisponibili lasciare un messaggio semplice e il collegamento; offline non mostrare copie persistenti non autorizzate. Evitare richieste duplicate create dall’apertura ripetuta dei pannelli, nei limiti di quanto il contratto consente; non aggirare i divieti di caching con un archivio “temporaneo” proprio.
- Un errore di una piattaforma non deve bloccare l’altra, le schede o il salvataggio degli itinerari. Prevedere tempo massimo di attesa e pochi ritentativi, rispettando `Retry-After` quando presente; niente ciclo automatico su `401`/`403` o profilo non autorizzato. In Terra anche `404` può indicare assenza di licenza: non cancellare per questo l’associazione e non dichiarare che il luogo non esiste.
- La funzione server proposta richiede hosting e protezioni propri, non soltanto una chiave nascosta: validazione degli ID, limiti di richieste, disattivazione per piattaforma e divieto di registrare contenuti delle risposte nei log. Per Terra nessuna cache condivisa o risposta conservata se il contratto non la consente. Definire intestazioni e comportamento CDN/service worker nel pilota, prima del rilascio.

La procedura settimanale degli **orari ufficiali** resta distinta: non autorizza scraping o memorizzazione periodica dei voti. Non installare un widget generico di terzi soltanto perché promette “recensioni gratis”. Un widget di un ristorante non è automaticamente utilizzabile da Nextstop per tutti i luoghi.

## Marchi e collegamenti

L’icona generica “G” non sostituisce automaticamente l’attribuzione richiesta da Google Maps. Il UI Kit gestisce le proprie attribuzioni; non nasconderle o ricolorare liberamente i marchi. Per Tripadvisor verificare nel contratto Terra le immagini/bolle e i link obbligatori: la documentazione legacy richiedeva bolle ufficiali con il marchio, non stelle inventate, ed è solo un precedente da riconfermare. Per TheFork verificare l’uso del marchio prima di aggiungere un’icona.

Le regole del repository oggi escludono loghi aziendali nel prodotto: l’eventuale eccezione per attribuzioni di servizi dovrà essere esplicita nella specifica approvata. Non è stata modificata questa regola. Collegamenti e presentazione non devono suggerire affiliazione o recensioni raccolte da Nextstop. Nessun dato `aggregateRating` per risultati strutturati SEO viene aggiunto da questo piano.

## Costi orientativi da verificare all’avvio

Prezzi pubblici letti il **19/10/2026**, in USD, senza imposte, hosting o eventuali altri servizi. La quantità è il numero di richieste/entità fatturabili, non il numero di visitatori o di schede registrate nel progetto.

| Soluzione | Indicazione pubblica | Esempio di scala |
|---|---|---|
| Google Places UI Kit Query, elementi standard | 10.000 eventi gratuiti al mese per SKU/account; poi $1/1.000 nella prima fascia | Con 20.000 richieste mensili, circa $10 per questo solo SKU, se la franchigia è disponibile e non si usano altri elementi fatturati |
| Google Place Details Enterprise, via API tradizionale | `rating` e `userRatingCount` appartengono a Enterprise: 1.000 gratuiti/mese, poi $20/1.000 nella prima fascia | Alternativa di costo e contratto diversa dal UI Kit; non la scelta consigliata accanto alla mappa SEE |
| Tripadvisor Terra Discover | Prime 1.000 entità gratuite **una sola volta nella vita dell’account**; prima fascia successiva $0,015/entità, con sconti fino a $0,009 | A franchigia esaurita, 1.000 entità nella prima fascia costano $15; un multi-GET con dieci luoghi conta dieci entità, non una |
| TheFork | Accesso/costo e diritto di esposizione da concordare | Nessun preventivo pubblico verificato applicabile a Nextstop |

I limiti gratuiti non sono una promessa di costo zero permanente. I 92 soggetti del catalogo non bastano a stimare il traffico: se una visita apre cinque luoghi, può generare cinque richieste per piattaforma. Niente caricamento di tutti i voti nella lista. Stabilire quote e limiti reali, avvisi e ripiego al solo link; un avviso di budget Google non costituisce da solo un blocco della spesa.

Il preventivo futuro deve indicare periodo di fatturazione, uso gratuito ancora disponibile, ricerche iniziali degli ID, riaperture, ritentativi, SKU aggiuntivi e costo della funzione server. Misurare le unità fatturabili nel pilota, non dedurle dal numero di clic. Definire un limite operativo conservativo e il modo effettivo di fermare le chiamate; se il provider non offre un tetto monetario certo, dichiarare il margine di incertezza prima di attivarlo. Nessun nuovo tracciamento dei visitatori: eventuali contatori tecnici di utilizzo devono essere aggregati e compatibili con le regole di privacy del progetto.

## Piano di attuazione · avvio autorizzato

| Passo | Lavoro e consegna | Criterio per proseguire |
|---|---|---|
| 1. Scelta | Confermare presentazione, piattaforme, account/SEE, budget mensile e caricamento su richiesta | Specifica approvata; nessuna attivazione a pagamento implicita |
| 2. Diritti e accessi | Verificare UI Kit web e condizioni Google; disponibilità Terra, campi aggregati, cache, branding/link; TheFork soltanto se autorizzato. Consegna: tabella per piattaforma con documenti, versione, diritti e lacune | Nessuna integrazione dei numeri finché le condizioni non sono compatibili. Se non lo sono, decisione esplicita su riduzione dello scopo o soli link |
| 3. Identità pilota | Abbinare pochi casi rappresentativi: ristorante con più sedi, museo con parco, luogo composto e luogo senza profilo | Nessun abbinamento automatico ambiguo; URL e parte recensita validati |
| 4. Prova isolata | Prototipo non pubblicato sulle schede reali: voto+conteggio, loghi/attribuzioni, errori, caricamento e costo misurato. Prima casi fittizi; chiamate reali soltanto con accessi e spesa autorizzati | Consegna: confronto richiesta/risultato per ogni requisito e traccia delle richieste. Media e conteggio realmente visibili; componenti compatibili con mappe, template, privacy e telefono |
| 5. Integrazione | Modulo comune, associazioni estese alle sole entità verificabili, informativa e ripiego. Rendiconto distinto per piattaforma: profili confermati, incerti, assenti, non autorizzati | Zero richieste dai template e prima dell’azione prevista; nessuna chiave privata o cache non autorizzata. Riattivazioni misurate; limite di traffico e disattivazione provati |
| 6. Verifica e proposta di rilascio | Controlli pertinenti, test/build/link del progetto, tastiera/lettore schermo, chiaro/scuro e mobile, rete lenta/offline, quote e 429 | Anteprima e riscontro di Enrico prima di main/produzione, secondo le regole del progetto |

Presentazione decisa e avvio autorizzato. Restano da risolvere accessi, budget, condizioni compatibili per Tripadvisor e TheFork opzionale. I blocchi operativi e le prove effettivamente concluse sono nello [stato corrente](../valutazioni/stato.md); non considerare una simulazione come una piattaforma già integrata.

## Criteri di accettazione del futuro rilascio

- Per ogni piattaforma attiva: nome riconoscibile/attribuzione consentita, media, scala, conteggio corretto e link alla sede o componente indicata. I profili non verificati non mostrano numeri.
- Nessun testo, foto o riassunto di recensioni selezionato dalla configurazione. Se un componente impone contenuti ulteriori, riportarlo a Enrico prima di considerarlo conforme.
- Prove su nessun voto, campo mancante, identità ambigua, trasferimento, risposta tardiva dopo cambio scheda, errore di un solo servizio, limite raggiunto, `429` e offline. Nessuna interferenza con composizione, salvataggio o condivisione.
- Pannelli clonati inizializzati una sola volta, risposte associate alla scheda corretta e comportamento delle riaperture documentato. Nessun aumento incontrollato di richieste o recupero automatico di tutti i 92 soggetti.
- Privacy, tastiera, lettore schermo, contrasto chiaro/scuro e larghezze 320/390 px verificati; nessun affidamento solo su colore, icona o stelle per comunicare il voto.
- Rapporto con copertura per piattaforma, condizioni rimaste aperte, misure del pilota e istruzioni per disattivare l’integrazione mantenendo il sito utilizzabile. Nessuna percentuale di copertura promessa prima dell’associazione reale.

## Manutenzione successiva

Separare due attività: i numeri arrivano al momento consentito dal servizio; abbinamenti e condizioni si riesaminano quando cambiano schede, sorgono errori persistenti o il provider comunica nuove regole/versioni. All’avvio di una manutenzione richiesta aprire questo piano, le sole associazioni coinvolte e le pagine correnti del prodotto, cercando anche eventuali avvisi di migrazione. Frequenza, responsabile e limite di spesa andranno decisi nel blocco approvato; nessuna attività automatica settimanale viene attivata da questo documento.
