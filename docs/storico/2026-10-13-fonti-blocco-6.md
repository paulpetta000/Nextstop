# Fonti · Blocco 6, revisione e verifiche locali

13 ottobre 2026. Ramo `codex/fonti-specifica`, da `5d02bd2`, senza ripartire da `main`. Enrico approva l'integrazione visiva del Blocco 5 e autorizza questo blocco soltanto per revisione, correzioni e verifiche locali. Nessuna delega, installazione, prova con lettori esterni, push, merge o deploy.

## Correzioni

- **Compositore, errore `reading 'id'`:** una giornata vuota, aperta dopo l'ora di fine, produceva un avviso «giorno pieno» senza avere un'ultima tappa. [Test dei calcoli fallito prima](fonti-blocco-6-verifiche/bug-test-prima.log) e [riproduzione esatta in Chrome](fonti-blocco-6-verifiche/bug-browser-prima.json): alle 10 nessun errore, alle 20 lo stesso errore a 390 e 1280 px. `calcolaGiorno` genera ora l'avviso soltanto se restano tappe. Le visite ancora da fare continuano a generare l'avviso corretto; nessuna modifica a calendario o regate.
- **Durate:** il documento di Palazzo Reale era selezionato, ma la sua descrizione non nominava la durata. [Test prima](fonti-blocco-6-verifiche/durate-prima.log), poi completamento della sola descrizione usando la relazione già dichiarata in tappa e testo. Le otto durate attribuite a documenti sono riconoscibili; nessuna data o informazione originale aggiornata.
- **Fonti sotto lo schermo:** gli stili della D sono nell'HTML e funzionano anche senza JavaScript. Con JavaScript si attivano prima dell'arrivo al pannello, all'apertura, al focus o a un frammento interno. Così il Bodoni del pannello non viene richiesto durante l'apertura degli itinerari. Nessun caricamento remoto, contenuto eliminato o modifica della ricerca. `content-visibility` limita il rendering fuori schermo; senza supporto resta il comportamento ordinario, in stampa il contenuto è visibile.
- **Apertura degli itinerari:** anticipati i due caratteri già visibili di pulsanti/testata. Scenari e partenze vengono richiesti con priorità bassa dopo caratteri e primo disegno, senza ritardo fisso; dati e ricalcoli restano gli stessi. Una giornata vuota non viene ridisegnata due volte all'arrivo dei dati. [Riproduzione prima](fonti-blocco-6-verifiche/caricamento-prima.json) e [dopo](fonti-blocco-6-verifiche/caricamento-dopo.json): il nodo della giornata vuota resta identico, quello della giornata con tappe viene ancora aggiornato.
- **Modulo iniziale:** la build aggiunge il preload delle sole dipendenze statiche dei moduli già caricati dagli itinerari. Il piccolo modulo delle date era scoperto dopo quello del compositore: [prova prima](fonti-blocco-6-verifiche/modulo-prima.log). Nessuna anticipazione della mappa o di import dinamici, nessuna risorsa esterna. Il passaggio precede la generazione del service worker, che conserva la politica precedente e include l'HTML definitivo.

File principali: [FontiPagina](../../src/components/FontiPagina.astro), [attivazione degli stili](../../src/scripts/fonti/pannello.js), [calcoli](../../src/lib/itinerari/calcolo.ts), [avvio del compositore](../../src/scripts/itinerari/app.ts), [preload della build](../../integrations/preload-itinerari.mjs), [metadati](../../src/data/fonti-metadati.json). Test e strumenti locali sono nel commit del blocco.

## Costo di Fonti e condizioni delle misure

La base `c5a6fa7` è stata estratta e costruita in una cartella isolata sotto `.astro/fonti-blocco-6/`, con le dipendenze già presenti. L'output di `5d02bd2` è stato copiato separatamente prima delle correzioni. Nessun checkout o ripristino dei file del ramo. La terza copia toglie soltanto il pannello dall'HTML servito, conservando il resto dell'integrazione: separa il costo del contenuto Fonti dal resto della pagina.

Misure sequenziali, profili Chrome nuovi, server loopback identici, telefono Lighthouse predefinito (412 × 823, CPU ×4 e rete simulata), nessun archivio personale o cache calda. Node 24.21.0, Chrome 155; il Blocco 5 aveva Chrome 154. Gzip esplicitamente dichiarato per il confronto e l'accettazione; **l'anteprima Astro effettiva comprime l'HTML**, contrariamente alla nota generale precedente sull'anteprima locale. Le condizioni e il benchmark del computer sono salvati per ogni misura. Non si confrontano i punteggi dei due blocchi come se ambiente e browser fossero identici.

L'integrazione aggiunge circa **149 mila caratteri di HTML e 14 mila di CSS** alla pagina degli itinerari; il pacco dei suoi dati rimane identico (113.766 caratteri). La differenza è misurata sull'output, non attribuita a una modifica dei dati. Con gzip, togliere il pannello riduce stabilmente il primo disegno da circa 2,18 a 1,80 secondi; i punteggi sono più variabili perché intervengono caricamento dei caratteri, rendering e dati secondari.

| Copia, tre prove per tema | Chiaro: punteggi | Scuro: punteggi |
|---|---|---|
| Base `c5a6fa7` | 81, 93, 84 | 92, 84, 83 |
| Integrazione `5d02bd2` | 81, 79, 92 | 94, 80, 92 |
| Integrazione senza pannello | 85, 94, 96 | 94, 85, 94 |

[Serie comparabile completa](fonti-blocco-6-verifiche/prestazioni-confronto-gzip.json). Fonti ha un costo, ma non spiega da sola tutti i punteggi bassi della base. Le correzioni comprendono anche le cause già presenti nell'apertura del compositore.

La [serie HTTP senza compressione](fonti-blocco-6-verifiche/prestazioni-confronto.json) documenta la forte penalizzazione del trasferimento grezzo; **le sue righe «senza pannello» non sono valide per l'isolamento**, perché il primo script non riconosceva il separatore dei percorsi Windows. Il confronto gzip corregge il problema. Queste prove non vengono nascoste né usate per l'accettazione.

Sono conservate anche le serie intermedie `prestazioni-prove*` e `prestazioni-finale-*`. Nessun intervento isolato è stato accettato scegliendo soltanto la sua misura migliore. L'ultimo tentativo di rinvio delle schede statiche non dava margine ed è stato rimosso. Nei primi giri i rapporti completi delle varianti «finale» condividevano il nome del file e venivano sovrascritti; i riepiloghi completi di ciascuna serie rimangono. La serie definitiva usa nomi distinti e conserva tutti i rapporti.

Riferimenti tecnici consultati, senza installare il comando `npx` della skill: [Modern Web Guidance, performance](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/performance.md), [variabilità Lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md), [caricamento dei font](https://web.dev/articles/font-best-practices), [content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility), [priorità di fetch](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#priority).

## Registro, documenti e crediti

[Revisione delle relazioni locali](fonti-blocco-6-verifiche/registro.json): tutte le **195 fonti pubbliche**, riferimenti a schede, testi e durate coerenti con gli originali; **181** documenti negli itinerari, **84** in Dove mangiare, senza duplicati. Le fonti condivise restano uniche e trovabili dai luoghi collegati. Il perimetro degli itinerari continua a comprendere tutte le tappe/locali/spostamenti disponibili, senza filtrare sul viaggio composto.

Riviste le descrizioni e le cautele locali; cambiata soltanto la descrizione della durata di Palazzo Reale. Restano distinzione tra selezioni storiche e servizio attuale, annuncio Pintauro, limite FAI/Donn'Anna, sedi delle classifiche, menu datati, divergenze dei prezzi/orari e periodi dei trasporti. Le etichette «Passaggio letto» e «Lettura parziale» del Blocco 2 conservano le loro date: nessuna nuova lettura degli editori in questo blocco.

Originali diretti EAV PDF e Gambero Rosso conservati insieme agli URL registrati; ZIP ANM riconoscibile. Verificate destinazioni nell'HTML e ritorno tramite documento fittizio, non raggiungibilità o contenuto odierno degli editori. La tabella EAV non viene dichiarata controllata visivamente. **54 crediti fotografici**, originali, autori e licenze conservati; quattro licenze dei font presenti, percorso interno a Nextstop. `napoliavela.guida@gmail.com` invariata.

## Verifiche finali

- [Suite](fonti-blocco-6-verifiche/test.log): **70/70**. [Build](fonti-blocco-6-verifiche/build.log) riuscita e [880 link interni su 12 pagine](fonti-blocco-6-verifiche/link.log) validi. Restano gli avvisi editoriali già documentati; nessuna firma rigenerata.
- [Matrice UI](fonti-blocco-6-verifiche/ui.json): **80 combinazioni** a 320/375/390/768/1280 px, due temi, pannelli aperti/chiusi; nessun overflow o ID duplicato. **Otto scansioni axe pulite**, su Fonti, itinerari, Dove mangiare e crediti, nei due temi. Chrome emulato, nessun telefono fisico o lettore esterno.
- Ricerca, 48 Tab registrati, titoli completi e collegamenti diretti; [altre 48 sequenze Tab/Shift+Tab](fonti-blocco-6-verifiche/tastiera-ritorno.json) a 375/1280 px nei due temi, focus visibile senza copertura (tolleranza di un pixel per lo scorrimento frazionario del browser). [Movimento](fonti-blocco-6-verifiche/movimento.json): otto combinazioni telefono/desktop, chiaro/scuro, normale/ridotto; campo stabile, filtro/reset approvati. Console pulita, nessuna richiesta agli editori nelle prove UI.
- Senza JavaScript sono consultabili **195/181/84** documenti nei due temi. Il compositore mantiene il messaggio e gli itinerari statici previsti per questa condizione.
- Ritorno dal documento fittizio: ricerca conservata e archivio fittizio di **51 itinerari** con `fittizio50` attivo, senza cambiare il contenuto salvato. Nessun dato personale letto o usato.
- [Compositore dopo la correzione](fonti-blocco-6-verifiche/bug-browser-dopo.json): 12 combinazioni vuoto/tutto fatto/da fare, alle 10 e alle 20, a 390/1280 px, più sei passaggi dalle 10 alle 20. Nessun errore; l'avviso rimane soltanto con visite ancora da fare. Il primo giro esteso aveva contaminazione tra stati fittizi del test: corretto il suo isolamento, non il codice del sito per mascherarla.
- [Offline](fonti-blocco-6-verifiche/offline.json): stesso service worker della build, registrato esplicitamente su HTTP locale in Chrome temporaneo; due temi, riapertura dell'itinerario fittizio, pannello e ricerca Catacombe senza rete, stato conservato. Non è una prova dell'installazione automatica su HTTPS o di apertura dei documenti esterni offline. Nella prima prova il clic automatico precedeva l'assestamento degli stili: la prova finale porta il pannello sullo schermo prima di toccarlo.

[Lighthouse definitivo](fonti-blocco-6-verifiche/prestazioni-finale.json): **18/18 misure mobile almeno 95**, tre prove per pagina e tema. Accessibilità e buone pratiche **100** in tutte; nessun errore di console o avviso Lighthouse. Si riportano tutti i punteggi, non soltanto il migliore.

| Pagina | Chiaro, tre prove | Scuro, tre prove | Mediana chiaro/scuro |
|---|---|---|---|
| Itinerari | 95, 95, 95 | 95, 95, 95 | 95 / 95 |
| Fonti | 99, 99, 99 | 99, 99, 99 | 99 / 99 |
| Dove mangiare | 96, 96, 96 | 96, 95, 96 | 96 / 96 |

Il benchmark del computer varia da 1506,5 a 2658,5 nella serie. Negli itinerari il primo disegno è 1,73–1,75 s, LCP 2,71–2,72 s, blocco del thread 47–68 ms, spostamento del layout 0. La soglia è superata nelle condizioni dichiarate: è una verifica locale ripetuta, non una garanzia di punteggio su ogni dispositivo o un test della produzione. Anche le serie intermedie sotto soglia restano nel resoconto.

Revisione visiva di A e D a telefono/desktop nei due temi: caratteri, gerarchia, riquadri, ricerca e cautele approvati conservati. [Pannello telefono scuro](fonti-blocco-6-verifiche/napoli-itinerari-375-dark.png), [pannello desktop chiaro](fonti-blocco-6-verifiche/napoli-dove-mangiare-1280-light.png), [A telefono](fonti-blocco-6-verifiche/fonti-375-light.png), [A desktop](fonti-blocco-6-verifiche/fonti-1280-dark.png). Nessun nuovo movimento o redesign; i controlli UX e di coerenza sono limitati alle superfici del blocco, secondo `DESIGN.md` e le scelte di Enrico.

## Conservazione

[Confronto con Git](fonti-blocco-6-verifiche/conservazione.json): **865 file** della base `c5a6fa7` e **874 file** di `5d02bd2` esaminati senza ripristini. Rispetto al Blocco 5 risultano soltanto le sette modifiche eseguibili intenzionali elencate nel rapporto; nessuna variazione ai dati originali, testi/firme, ID/URL/date, registri delle regate, link condivisi, privacy, service worker, font/licenze o design precedenti. Nuovi test, strumenti e integrazione di build sono aggiunte autorizzate del blocco; package e lockfile invariati.

Nel confronto odierno con Git non emerge una differenza ulteriore per `design/home/proposta-a.html`; la discrepanza con l'impronta storica già documentata nel Blocco 5 non viene reinterpretata, corretta o attribuita a questo blocco. L'inventario JSON storico non è stato riletto.

**154 file preesistenti non tracciati** in `design/compositore/` e `design/home-napoli/` conservati ed esclusi dal commit. Il rapporto acquisisce la loro impronta al controllo finale, senza chiamarla una fotografia iniziale della sessione. Nessun comando del blocco ha modificato quelle cartelle.

Le riserve tecniche del Blocco 5 sul caso riprodotto del compositore e sulla soglia Lighthouse locale sono chiuse con le prove qui indicate. Restano limiti editoriali reali, browser/dispositivo fisico non provati e consenso al rilascio da ricevere.

## Anteprima e seguito

[Fonti](http://127.0.0.1:4322/fonti/) · [Itinerari e pannello](http://127.0.0.1:4322/napoli/itinerari/#fonti-inizio) · [Dove mangiare](http://127.0.0.1:4322/napoli/dove-mangiare/#fonti-inizio) · [Crediti](http://127.0.0.1:4322/note-legali/#foto).

Commit locale con identità Codex. Nell'ultimo chiarimento Enrico conferma di terminare il lavoro locale e rimanda il seguito e il relativo OK a una sessione successiva. Qualsiasi push, anteprima Vercel, merge o pubblicazione richiede quell'autorizzazione successiva. Bastano repository e strumenti locali già presenti.
