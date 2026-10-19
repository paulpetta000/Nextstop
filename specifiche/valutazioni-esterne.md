# Valutazioni esterne nelle schede · proposta

**Stato: idea e piano, non approvati per implementazione.** Richiesta di Enrico del 19/10/2026. Nessun voto reale raccolto, componente, API, account, fatturazione o logo aggiunto al sito. Fonti e limiti della ricerca nella [nota ufficiale](../ricerca/2026-10-19-valutazioni-esterne.md). Ricontrollare tariffe e condizioni prima dello sviluppo.

## Risultato desiderato

Nelle schede di luoghi e ristoranti mostrare **piattaforma, voto medio, scala, numero di valutazioni/recensioni e collegamento alla pagina corretta**. Nessun testo delle recensioni. Dati separati per Google Maps, Tripadvisor ed eventualmente TheFork: niente media unica o conversione nascosta tra scale diverse.

Esempio solo illustrativo, con numeri inventati: “Google Maps · 4,6/5 · 1.234 valutazioni · Apri”; “Tripadvisor · 4,5/5 · 876 recensioni · Apri”; “TheFork · 9,1/10 · 210 recensioni · Apri”. La resa effettiva dovrà rispettare componenti e marchi concessi dalle piattaforme. Google conta valutazioni anche senza testo: chiamarle tutte “recensioni” può essere inesatto.

## Fattibilità e scelta consigliata

| Piattaforma | Percorso da valutare | Limite che decide l’implementazione |
|---|---|---|
| Google Maps | **Places UI Kit, componente Place Details**, con blocco del voto e attribuzione ufficiale | Per fatturazione SEE, le normali Places API hanno restrizioni sull’associazione a qualsiasi mappa; le stesse restrizioni non si applicano al UI Kit. Verificare copertura di media/conteggio, resa e costo nel componente web scelto |
| Tripadvisor | **Terra**, API attuale, per ristoranti e luoghi coperti | Accesso e diritti dipendono dal pacchetto; conservazione dei contenuti vietata salvo contratto. Confermare campi aggregati, link e branding nel piano ottenuto |
| TheFork | Collegamento alla scheda corretta; dati numerici soltanto con accesso/licenza adeguati | La documentazione pubblica riguarda partner e gestione ristoranti, non una libera API di voti per tutti i locali. Non dare per acquisita questa copertura |

**Raccomandazione:** progettare prima Google Maps + Tripadvisor come moduli distinti, caricati soltanto quando la persona apre le valutazioni. TheFork rimane un’aggiunta facoltativa per i soli ristoranti presenti e autorizzati. I link possono funzionare anche se i numeri non sono disponibili, ma da soli non realizzano l’obiettivo completo richiesto.

Assunzione da confermare prima dello sviluppo: titolare e account di fatturazione in Italia/SEE. Non è stato verificato un account Google/Tripadvisor dell’utente. Non cambiare la mappa attuale di Nextstop per aggirare un vincolo: scegliere un’integrazione compatibile o lasciare il solo collegamento.

## Quattro idee per la presentazione

1. **Righe nella scheda aperta:** una per piattaforma, con media, conteggio e link. Vicine ai dettagli del luogo; spazio da riservare alle attribuzioni obbligatorie. I componenti Google non si smontano per ricopiare i numeri in una grafica propria.
2. **Sezione espandibile “Valutazioni online” — preferita:** la scheda rimane leggera; un’azione esplicita carica le piattaforme selezionate e rende chiara la provenienza. Buona per privacy, costo e componenti ufficiali più ingombranti.
3. **Due riquadri affiancati:** Google e Tripadvisor, impilati sul telefono. Confronto immediato, ma maggiore altezza e attenzione ai loghi, al contrasto e al numero di richieste.
4. **Collegamenti sempre disponibili, numeri su richiesta:** utile come avvio o ripiego quando una piattaforma manca. La semplice lista non deve fare partire script, immagini remote o richieste di valutazioni.

Sono descrizioni da discutere, non bozzetti costruiti. Prima di una futura implementazione grafica rispettare il processo di confronto delle proposte del repository. La preferenza 2 non sostituisce l’OK di Enrico.

## Associare la scheda giusta

Il progetto ha 60 tappe/gite e 32 locali: **92 entità non significano 92 pagine per piattaforma**. Alcune passeggiate non hanno una scheda autonoma; Duomo/Tesoro, bosco/museo e gite composte possono averne più di una. Google, Tripadvisor e TheFork possono coprire insiemi diversi.

Preparare, solo dopo l’OK, un’associazione per ID interno, piattaforma, ID esterno, URL, nome/sede e parte recensita, con data e stato della verifica. Controllare civico, coordinate e identità: 50 Kalò Sannazaro/Repubblica, Gesù Vecchio 26/4, Concettina Sanità/Capri e Palazzo Petrucci pizzeria/ristorante non sono intercambiabili. Il voto di una componente va indicato come tale, non attribuito a tutta la gita. Associazione incerta: niente voto e niente collegamento presentato come verificato.

Non inventare un punteggio per un luogo senza profilo e non usare zero per indicare dato assente. Distinguere: profilo non trovato, profilo non ancora verificato, conteggio zero, dati non disponibili, servizio temporaneamente irraggiungibile e accesso non autorizzato.

## Integrazione coerente con Nextstop

Le schede esistenti sono `src/components/itinerari/Scheda.astro` e `SchedaLocale.astro`; vengono anche copiate da `<template>` nei pannelli del compositore. Lo schema è in `src/content.config.ts`; la mappa usa dati OpenStreetMap e l’informativa è `src/pages/privacy.astro`.

Proposta tecnica per una fase approvata:

- Conservare gli **abbinamenti di identità**, non un archivio indiscriminato di voti, in una raccolta dedicata da definire nello schema. Dati Google/Tripadvisor non entrano automaticamente nei fatti confermati o nel registro degli orari.
- Un modulo condiviso per luoghi e locali, con nomi accessibili, scala esplicita, numeri in formato italiano e un link verificato per ciascuna piattaforma. Nessun componente visibile implementato ora.
- **Google:** caricare la libreria/UI Kit dopo l’azione prevista, solo per la scheda realmente visualizzata; evitare richieste nei `<template>` nascosti e nella lista completa. Verificare con il componente web che media e conteggio siano entrambi disponibili e che si possano omettere testi, foto e riepiloghi non richiesti senza rimuovere attribuzioni obbligatorie.
- **Tripadvisor:** eventuale funzione lato server con chiave privata e lista degli ID autorizzati, senza un proxy aperto a URL arbitrari. Presentazione conforme al contratto Terra e ai collegamenti obbligatori. Il piano non presume che i vecchi campi `num_reviews` o i vecchi termini Content API siano il contratto Terra.
- Chiave Google destinata al browser limitata a sito/API e quote; chiavi private Tripadvisor/TheFork soltanto sul server. Nessuna chiave inserita nei file pubblici, log o proposte.
- Richieste attivate dalla scelta della persona; nessun caricamento esterno anticipato. Aggiornare l’informativa per componenti e immagini remote effettivamente usati. Cache CDN, browser, service worker, localStorage e copie offline dei voti devono rispettare i diritti concessi: **nessuna TTL di sette giorni o trenta giorni inventata**.
- Per le valutazioni indisponibili lasciare un messaggio semplice e il collegamento; offline non mostrare copie persistenti non autorizzate. Evitare richieste duplicate create dall’apertura ripetuta dei pannelli, nei limiti di quanto il contratto consente; non aggirare i divieti di caching con un archivio “temporaneo” proprio.

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

## Piano di attuazione dopo un futuro OK

| Passo | Lavoro e consegna | Criterio per proseguire |
|---|---|---|
| 1. Scelta | Confermare presentazione, piattaforme, account/SEE, budget mensile e caricamento su richiesta | Specifica approvata; nessuna attivazione a pagamento implicita |
| 2. Diritti e accessi | Verificare UI Kit web e condizioni Google; disponibilità Terra, campi aggregati, cache, branding/link; TheFork soltanto se autorizzato | Contratti/accessi compatibili; se una piattaforma non lo è, documentare il limite e lasciare il link |
| 3. Identità pilota | Abbinare pochi casi rappresentativi: ristorante con più sedi, museo con parco, luogo composto e luogo senza profilo | Nessun abbinamento automatico ambiguo; URL e parte recensita validati |
| 4. Prova isolata | Prototipo non pubblicato sulle schede reali: voto+conteggio, loghi/attribuzioni, errori, caricamento e costo misurato | Componenti compatibili con mappe, template, privacy e telefono; nessun testo recensione richiesto |
| 5. Integrazione | Modulo comune, associazioni estese alle sole entità verificabili, informativa e fallback | Nessuna richiesta dalle schede nascoste, nessuna chiave privata esposta o cache non autorizzata |
| 6. Verifica e proposta di rilascio | Controlli pertinenti, test/build/link del progetto, tastiera/lettore schermo, chiaro/scuro e mobile, rete lenta/offline, quote e 429 | Anteprima e riscontro di Enrico prima di main/produzione, secondo le regole del progetto |

Prima di un eventuale sviluppo restano da decidere: una delle quattro presentazioni, Google+Tripadvisor o un avvio più limitato, budget, account disponibili e TheFork opzionale. **Questo documento chiude il lavoro di ideazione richiesto; non avvia nessuno dei passi di implementazione.**
