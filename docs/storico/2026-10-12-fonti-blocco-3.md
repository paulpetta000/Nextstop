# Fonti · Blocco 3, quattro proposte locali

Enrico approva la bozza dei testi e autorizza il solo Blocco 3 il 12/10/2026. Ripreso `codex/fonti-specifica` da `997b240`, senza partire da `main`. Nessuna delega, dipendenza nuova, push, merge o deploy. Le cartelle non tracciate `design/compositore/` e `design/home-napoli/` restano fuori dal commit del blocco.

## Consegna

[Galleria e istruzioni](../../design/fonti/giro-1/README.md), quattro prototipi con casi da 12, 180, una e zero fonti, generatore e server di sola lettura. Le immagini mostrano aperto/chiuso, chiaro/scuro, telefono e desktop. Fonti direttamente cliccabili, informazioni documentate e limiti accanto al documento, avvisi fuori dal pannello, conteggi derivati dalle fixture, nessuna integrazione nel sito.

A propone un margine editoriale; B un indice per luogo; C affianca informazione e prova; D raccoglie i documenti in fogli per luogo. **Consiglio B** per gli itinerari con molte tappe: permette di individuare il luogo senza un secondo pannello obbligatorio per ogni fonte. La scelta e l’eventuale rifinitura restano a Enrico; il design della pagina generale sarà un blocco successivo.

Skill lette e applicate nel perimetro: `modern-web-guidance` (documentazione primaria come alternativa a `npx`, vietato scaricare codice), `design-sito`, `frontend-design`, `stile-testi`, `consistent-ui` e verifica UX con le sole regole pertinenti. Nessuna skill copiata o modificata. Il riferimento visivo del progetto prevale sui cataloghi generici; nessun agente esterno.

## Verifiche eseguite ora

- **`npm test`: 58/58.** Il primo tentativo nel sandbox non poteva avviare i sottoprocessi (`EPERM`); l’esecuzione locale con accesso necessario è riuscita. [Log](../../design/fonti/giro-1/verifiche/npm-test.log).
- **Build riuscita**, 11 pagine e service worker generati; **12 pagine, 874 link interni validi**. [Build](../../design/fonti/giro-1/verifiche/build.log) · [Link](../../design/fonti/giro-1/verifiche/check-links.log). Questi comandi non verificano i documenti degli editori.
- **280 combinazioni** delle quattro proposte: chiaro/scuro, aperto/chiuso, 320/375/390/768/1280 px, casi con 12/180/1/0 fonti. Nessun overflow, ID duplicato, fonte ripetuta, link escluso o bersaglio da toccare inferiore a 44 px; testo principale a 17 px. [Risultati](../../design/fonti/giro-1/verifiche/risultati.json).
- **124 scansioni axe senza violazioni**: 112 sugli stati/casi dei prototipi, quattro sulla galleria, otto aggiuntive dopo le note finali. Le misure aggiuntive coprono 96 combinazioni. [Ultime misure](../../design/fonti/giro-1/verifiche/note-finali.json).
- Tastiera Enter/Spazio/Tab, focus visibile, indice e frammenti diretti, movimento ridotto, cambio tema e apertura senza JavaScript provati in Chrome temporaneo. Nessuna richiesta agli editori prima del clic e nessun errore di console.
- Collegamento originale raggiunto con un solo clic e ritorno con stato locale fittizio preservato, usando una risposta esterna intercettata. Non è una prova degli itinerari personali di Enrico né della disponibilità dei server esterni.
- **Lighthouse mobile: 100 per tutte le proposte, in entrambi i temi**, anche accessibilità e buone pratiche a 100; spostamento durante il caricamento (CLS) pari a zero. [Otto rapporti](../../design/fonti/giro-1/verifiche/lighthouse-riepilogo.json). Invio dei rapporti di errore disattivato.

Le verifiche hanno riprodotto e poi risolto due problemi dei soli bozzetti: avvisi mancanti nel caso senza fonti e collegamento per saltare al contenuto nascosto con movimento ridotto. [Riproduzione](../../design/fonti/giro-1/verifiche/qa-riproduzione.log) · [QA finale](../../design/fonti/giro-1/verifiche/qa-finale.log). Il primo Lighthouse era 89–90 per uno spostamento causato dal comando di tema inserito dopo il caricamento e dai font: spazio riservato al comando, font precaricati e riserva metrica hanno eliminato lo spostamento. Nessuna correzione al codice del sito inclusa.

## Conservazione e differenze da non confondere con modifiche autorizzate

I **197 input preesistenti del sito** confrontati (sorgenti, dati, testi, script, test, configurazione, pacchetti, font e licenze) sono identici. Confrontati anche 213 file di design precedenti e 588 file della build. [Fotografia iniziale](../../design/fonti/giro-1/base-conservazione.json) · [Confronto finale](../../design/fonti/giro-1/verifiche/conservazione.json).

Il confronto ha segnalato hash differenti per due artefatti non tracciati preesistenti (`design/compositore/giro-5/immagini/d-tel-dark.png` e `design/home-napoli/rapporti/lighthouse-o3-dark.json`); nelle riletture il primo è tornato a coincidere. I timestamp dei file restano precedenti alla sessione e questi percorsi non sono stati scritti o ripristinati dal blocco. La causa della differenza non è stabilita: il rapporto conserva gli hash rilevati, senza attribuirli a un intervento certo di un altro assistente. Il materiale viene conservato com’è e non viene aggiunto al commit.

L’output ricostruito `dist/napoli/itinerari/percorsi-alternativi.json` differisce dalla fotografia precedente della build. L’output attuale coincide esattamente con l’esportazione della route esistente (firma, senza, candidati); `src/data/percorsi-alternativi.json` è identico. Nessun percorso rigenerato o dato riscritto. L’ultima rilettura segnala anche l’immagine in cache `dist/_astro/tp-ventaglieri.IhSdgtBR_ZbK40R.jpg`, con timestamp precedente alla sessione. Queste differenze di artefatti sono registrate senza tentare ripristini; gli altri output confrontati coincidono. `dist/` resta escluso dal commit.

## Lavoro rimasto

La selezione pubblica conserva 195 fonti, con i nove documenti delle regate esclusi; il calendario e il comportamento dell’evento sono invariati. Nessuna fonte viene promossa o datata di nuovo nei registri. Gli ID temporanei, gli URL proposti e le etichette dei bozzetti restano nelle fixture.

Il caso di volume distingue riferimenti dichiarati e prove editoriali ancora incomplete. Le etichette definitive e gli alias dell’indice per le fonti condivise richiedono il lavoro dati del Blocco 5. Il download PDF EAV va rivalidato prima dell’integrazione; nessuna promessa di validità indefinita del parametro restituito dalla pagina originale.

Prossimo passo: Enrico sceglie A/B/C/D o indica una combinazione da rifinire. Servono repository locale, browser e strumenti già presenti; GPT‑6.1‑sol / Medium per la rifinitura. Pagina generale, integrazione e rilascio richiedono autorizzazioni successive.
