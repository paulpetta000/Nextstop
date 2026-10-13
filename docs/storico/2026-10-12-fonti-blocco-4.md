# Fonti · Blocco 4, pagina generale

12/10/2026. Continuazione del ramo `codex/fonti-specifica` da `f9af5d4`, senza ripartire da main. Enrico autorizza soltanto quattro proposte isolate di `/fonti/`, coordinate con la D approvata del pannello a fondo pagina. Richiede movimento curato; rimanda la rifinitura della barra della D e conferma esclusione dei documenti delle regate e assenza di prove con lettori esterni.

## Consegna

[Quattro alternative e immagini](../../design/fonti/pagina-generale/giro-1/README.md): A Atlante, B Scaffale, C Percorso, D Quaderno aperto. Per ciascuna un campione di 14 documenti reali e un registro di 195 fonti, chiaro/scuro. **Consigliata A** per indice, leggibilità e continuità dei fogli con la D; B è la più scenografica, C mette in primo piano il metodo, D conserva il raggruppamento per luogo dentro gli argomenti.

Archivo e Bodoni Moda già presenti, palette e forme di DESIGN.md. Un momento forte per apertura: fogli a profondità diversa, dorsi che si assestano, linea del percorso, due pagine che si separano. Solo posizione e trasparenza; niente ripetizioni infinite. I browser senza animazioni con lo scorrimento mantengono le forme statiche; con movimento ridotto tutto resta fermo.

Metodo breve, approfondimento nativo facoltativo, cinque argomenti indipendenti, ricerca locale con label visibile, fonti canoniche non duplicate, contesto del luogo cercato, cautele prima del link, originali a un clic, PDF/ZIP riconoscibili, titoli completi facoltativi, date distinte. Fascia di ritorno disponibile negli elenchi lunghi e statica durante la digitazione. Cronologia della scheda usata soltanto per conservare la ricerca al ritorno dall'originale; nessuno storage degli itinerari toccato.

Il registro completo viene dal registro eseguibile esistente, filtrato con la decisione già applicata. Sono conservati 195 ID, URL, titoli originali e date registrate. I tre documenti alternativi della ricerca, con ID `bozza-*`, compaiono soltanto nel campione. Nessuna nuova verifica degli editori, stato o data aggiornati nel sito. Raggruppamenti proposti, senza inferire nuove prove dai titoli; 185 descrizioni del registro generale da completare in modo mirato nel Blocco 5, conteggio distinto dalle 171 del footer lungo già approvato.

## Controlli effettivi

- `npm test`: **58/58**. Prima esecuzione fermata da un errore WebAssembly del runtime Node durante il caricamento TypeScript; nuovo caricamento e riesecuzione ordinaria riusciti. Nessuna modifica a Node, PATH permanente, pacchetti o codice per superarlo.
- `npm run build`: riuscita, 11 pagine; `npm run check:links`: **874 link interni validi**. Sono controlli del sito esistente, non una verifica dei link esterni.
- Prototipi: [160 combinazioni](../../design/fonti/pagina-generale/giro-1/verifiche/risultati.json), 320/375/390/768/1280 px, argomenti aperti/chiusi, due temi, nessun overflow, ID duplicato, bersaglio sotto 44 px o errore di console. **64 scansioni axe pulite** su 375/1280 px nei due temi e stati.
- **64 ricerche** sui documenti del campione: Catacombe, Nennella/Gesù Vecchio, Poppella, EAV, ANM, Pintauro, Slow Food; zero risultati, reset e focus. Titoli originali e date verificati contro gli input; tutti i 195 originali presenti nei casi completi.
- Tastiera, tema, titoli completi, collegamento fra argomenti, ritorno alla ricerca, movimento ridotto e assenza di JS. Originale/ritorno con risposta fittizia intercettata e stato di itinerario fittizio isolato conservato; nessun dato personale e nessuna richiesta a editori prima del clic. Non è una nuova verifica web.
- [24 casi, 96 fotogrammi di movimento](../../design/fonti/pagina-generale/giro-1/verifiche/movimento.json), senza overflow anche a 320 px; profondità effettivamente diversa prima/dopo lo scorrimento e nessuna animazione con movimento ridotto. [Tab lineare al documento fuori vista](../../design/fonti/pagina-generale/giro-1/verifiche/tastiera-confine.json) riuscito nelle quattro proposte.
- [Lighthouse mobile finale](../../design/fonti/pagina-generale/giro-1/verifiche/lighthouse-riepilogo.json) sul registro da 195 fonti, otto misure nei due temi, obiettivo ≥95; accessibilità e buone pratiche 100. Le [prime misure 86–93](../../design/fonti/pagina-generale/giro-1/verifiche/lighthouse-primo-riepilogo.json) restano conservate: iniziavano mentre terminavano altre prove Chrome e mostravano anche un costo eccessivo di stile/impaginazione. Ridotti i testi duplicati, ricerca indicizzata solo quando serve, argomenti iniziali chiusi nel registro completo e disegno del registro rinviato sotto la prima schermata. Misure finali eseguite senza altri Chrome concorrenti.
- Immagini a 375/390/1280 px in chiaro/scuro, pagine complete e dettagli di date, cautele, condivisione, PDF/ZIP. Fallback della proprietà di rinvio simulato; prove su Chrome temporaneo, non una dichiarazione di verifica su tutti i browser o telefoni fisici.

Correzioni proporzionate dopo la riproduzione: primo Tab spostato al collegamento “Vai al contenuto”, regione semantica per la barra di confronto, ripristino stabile della ricerca nella cronologia. La fixture dell'originale usa una favicon inline per evitare richieste estranee alla prova. [Prima prova della tastiera](../../design/fonti/pagina-generale/giro-1/verifiche/tastiera-prima.json) e primi esiti funzionali conservati; nessuna correzione del sito reale inclusa.

## Conservazione e perimetro

[Base e risultato](../../design/fonti/pagina-generale/giro-1/verifiche/conservazione.json): 1115 file confrontati, 1113 identici, compresi **166 input di src/public e 373 file delle precedenti proposte delle fonti**. Nessuna modifica alla D del giro 4. Due hash diversi dalla base in `design/compositore/giro-2/proposte-locale.html` e `design/compositore/scheda-giro-1/immagini/q2-c-sotto-dark.png`, entrambi non tracciati e con date di modifica dell'8–9 ottobre. Nessun comando del blocco scrive in quei percorsi; causa non determinata, nessun ripristino né inclusione nel commit. Il controllo complessivo di conservazione resta quindi **con due discrepanze**, non interamente riuscito. Cartelle del compositore e della home conservate e fuori dal commit.

Niente integrazione di `/fonti/` o del pannello, cambi alle regate, inventario JSON riletto, dipendenze installate, deleghe, push, merge o deploy. Specifica e PROGRESS aggiornati; commit locale del solo blocco.

Lighthouse finale chiaro/scuro: **A 97/97, B 96/96, C 96/96, D 98/98**; accessibilità e buone pratiche 100 in tutte le otto misure. Nessuna animazione eliminata per raggiungere il punteggio.

Documentazione e prototipi: [279 riferimenti locali e ancore validi](../../design/fonti/pagina-generale/giro-1/verifiche/riferimenti.json), `git diff --check` senza errori; riferimenti esterni non ricontrollati.

**Adesso:** Enrico sceglie A, B, C o D. Eventuale rifinitura della pagina resta da autorizzare; Blocco 5 per integrare i due pezzi e completare le relazioni editoriali, poi Blocco 6 per revisione/rilascio con consenso. Basta continuare in locale con Node portatile e gli strumenti già presenti. Nessun lavoro di integrazione avviato.
