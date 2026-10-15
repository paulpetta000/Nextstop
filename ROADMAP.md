# Roadmap di Nextstop (scritta il 06/10/2026, da rivedere con Enrico a ogni fase)

Ogni fase comincia con una **specifica corta** da approvare (regola di `CLAUDE.md`) e finisce con l'anteprima di Vercel e l'OK di Enrico.
Lo stato giorno per giorno è in `PROGRESS.md`; qui solo l'ordine delle cose.

## Fase 0 · Messa a punto (adesso, 10 minuti)
- [x] Repository `paulpetta000/Nextstop` e progetto Vercel, indirizzo `nextstop-alpha.vercel.app` (06/10/2026).
- [x] Su GitHub il ramo principale è `main` (Enrico, 06/10/2026).
- [x] Su Vercel il ramo del sito pubblico è `main` (verificato il 07/10/2026: le pubblicazioni da `main` vanno in produzione).
- [ ] L'email del sito (oggi è quella di Napoli a Vela).
- [ ] Google Search Console: proprietà nuova e invio di `/sitemap.xml`.

## Fase 1 · Identità e home «wow» (in corso: home, marchio, menu e piè di pagina online dal 07/10/2026)
L'obiettivo di Enrico: un sito che sembri da 5.000 euro.
1. **Specifica della home**: chi arriva (turista, anche italiano nella sua città), cosa deve capire e trovare nei primi 5 secondi, cosa c'è sotto.
   Fatta e approvata il 06/10/2026: `specifiche/home-e-identita.md`, con i **racconti** degli itinerari pronti (idea di Enrico: pagine da leggere, stile MUDD, che Google trova) e il compositore da rifare.
2. **Due proposte di direzione grafica**: home e pagina «Itinerari a Napoli», con i dati veri e le nostre foto, in chiaro e in scuro, viste da telefono.
   Ispirazioni: `design/ispirazioni/` (MUDD) e `.claude/skills/design-sito/references/ispirazioni.md`. Lo stile «Orario» di oggi si può cambiare.
3. **Logo**: 3 o 4 direzioni (SVG, chiaro e scuro, anche piccolo come icona del telefono).
4. **Figma**: è collegato, ma con il piano gratuito e un posto «View» si può usare al massimo circa **20 volte al mese**. Quindi le proposte si fanno in HTML con i dati veri (come nel Blocco 1 di Napoli a Vela), e in Figma va solo la proposta scelta, come file da guardare e da tenere. Per usare Figma di più serve un piano a pagamento con un posto pieno: decide Enrico.
5. Il nostro `DESIGN.md`: caratteri, colori, spazi, pulsanti, riquadri. Lo legge la skill `design-sito`. Fatto (07/10/2026), con il portico di piperno e la regola «profondità e movimento».
6. **Resta della Fase 1**: Figma con la grafica scelta. Il primo racconto è passato alla Fase 3 (Enrico, 07/10/2026: prima il compositore).

## Regola per tutto il design: sempre 4 proposte (Enrico, 07/10/2026)
Ogni pezzo da rifare si propone in **4 versioni molto diverse tra loro** (all'inizio campo libero, anche lontane da quello che c'è), come per il logo.
Enrico dice cosa va e cosa no → 4 proposte nuove da quello che va → avanti così fino alla scelta. Si lavora un pezzo alla volta.

## Fase 2 · Il compositore e la grafica (lista di Enrico del 07/10/2026)
Prima una **specifica corta** del compositore nuovo (da approvare), poi i pezzi uno alla volta, ognuno con le 4 proposte.
Approvata l'08/10/2026: `specifiche/compositore.md` (mappa in sospeso), con le ricerche su filtri dei locali e mappa in `ricerca/`.

**Compositore** (`/napoli/itinerari/`): deve far dire «wow, ci hanno speso tanto».
- [ ] Grafica nuova di tutta la pagina, da sito «da 10.000 euro»; barra di navigazione.
- [ ] La **scheda della tappa**: oggi «su, giù, scheda, togli» è rozzo; va rifatta facile e bella.
- [ ] La **barra di ricerca** delle tappe.
- [ ] **Salvare** il proprio itinerario e rileggerlo intero.
- [ ] **«Visitato» / «da visitare»** su ogni tappa (non «fatto»), sia negli itinerari pronti sia in quelli fatti da chi visita (oggi c'è solo nei pronti): appare quando l'itinerario è salvato. Toccando «visitato» parte una piccola animazione, come quella del marchio.
- [ ] **Mappa con più strade** e facile da usare. Oggi è la nostra mappa fatta con i dati di OpenStreetMap (`src/data/mappa.json`), con poche strade: si possono aggiungere strade dagli stessi dati, oppure usare le mappe a riquadri di un servizio esterno, che però si potrebbero caricare solo dopo un tocco (regola della privacy). Da decidere nella specifica.
- [ ] **«Dove mangiare» dentro il compositore?** Da valutare: luoghi e locali separati nella stessa pagina. All'ora di pranzo (o di cena) il compositore dice «qui puoi fermarti a mangiare» e propone i locali vicini a **dove sarai in quel momento**; scegli tu.
- [ ] **Filtri dei locali** fatti bene: «carne» vuol dire un posto di carne (una braceria), non un posto che ha anche la carne nel menu. Prima si studia come fanno TheFork, TripAdvisor e altri siti di cucina.

**Home e tutte le pagine**
- [ ] Testi della home più invitanti («Napoli con tempi veri» non incuriosisce): si studia come scriverli.
- [ ] Più movimento (motion graphic) dove rende il sito più curato.
- [ ] **Portico**: prima di tutto foto scelte meglio dentro gli archi; poi il portico stesso, che sembra finto (campo libero: può diventare anche un'altra cosa). L'effetto «finestra» quando scorri di lato piace: da migliorare con più dettagli.
- [ ] **«Come funziona»** (1, 2, 3 con le due linee): da completare e rendere più bello.
- [ ] **«Perché fidarti»**: le schede inclinate restano; inclinazione più curata, si muovono quando scorri; testo da riscrivere.
- [ ] **Fonti in fondo alla pagina a scomparsa**: oggi occupano metà pagina; si vede «Fonti di questa pagina» con la freccia e si apre toccando.
- [ ] **Crediti delle foto** (autore, licenza) in fondo alla pagina insieme alle fonti, non sotto ogni foto.
- [ ] «Dove mangiare», Napoli, fonti e pagine legali con la grafica nuova.
- [ ] **Rifare le schede di tutte le tappe e di tutti i locali** (Enrico, 14/10/2026): testi, orari leggibili (oggi nei locali escono tutti attaccati), prezzi, come arrivare. Prima o poi, con la riscrittura dei testi.

**Controlli**: consistent-ui **almeno 35 su 40**; Lighthouse su telefono 95 o più, axe in chiaro e scuro, 320 e 390 px.

## Fase 2 bis · Rifiniture dopo la prova del compositore nuovo (Enrico, 14/10/2026)
Elenco di Enrico dopo aver provato il compositore pubblicato e la home. **Parole da oggi**: «**tema 1**» = vista C «Mappa prima»; «**tema 2**» = vista D «Le pagine» (da non confondere con chiaro/scuro).
Tre tranche, una alla volta, ognuna con la sua **specifica corta** da approvare prima di costruire (regola di `CLAUDE.md`) e con l'OK di Enrico a fine tranche. Nessuna è autorizzata finché Enrico non dice «parti con la tranche N».
Ordine consigliato: 1 → 2 → 3 (la 1 è quasi tutta correzione e pulizia, senza proposte grafiche; la 2 e la 3 hanno le proposte).

### Tranche 1 · Comportamento e pulizia del compositore (nessuna proposta grafica): costruita il 15/10/2026, ramo `rifiniture-tranche-1`, in attesa del sì di Enrico ([specifica](specifiche/compositore-rifiniture-1.md))
- [x] **Bug: «Itinerario pronto» aggiunto in un giorno diverso dal primo.** Se sono nel giorno 2 e aggiungo un itinerario pronto (per esempio «Mezza giornata»), le tappe vanno **solo nel giorno 2**: non si torna al giorno 1 e non si cancella nulla di ciò che c'era già (né nel giorno 2 né negli altri). Prima il test che riproduce il difetto (regola dei bug), poi la correzione. Da decidere nella specifica: cosa succede se nel giorno 2 ci sono già tappe (si aggiunge in coda? si chiede?) e se non c'è posto (come «Sposta nel giorno»).
- [x] **Cambio vista tema 1 / tema 2 come l'interruttore chiaro/scuro**: stesso gesto, stesso posto e stessa cura del cambio di tema, **non in fondo alla pagina** (oggi sono «Mappa» e «Pagine» in basso). Si ricorda l'ultima scelta.
- [x] **Togliere dal compositore ogni traccia dello stile vecchio.** In fondo alla pagina c'è ancora la sezione «Itinerari pronti» con le schede del vecchio sito (`#pronti` in `src/pages/napoli/itinerari/index.astro` e gli stili `it-pronto-*`): è brutta e non serve più, **va eliminata**. Cercare e togliere anche gli altri richiami alle vecchie tipologie di itinerario nel compositore (testi, stili, pulsanti, script). **Cautela**: prima di cancellare codice si verificano usi dinamici e script (regola comune); gli ID di tappe, locali e itinerari e gli URL restano. Gli itinerari pronti restano raggiungibili dalla nuova interfaccia (pulsante «Itinerario pronto» o simile) e la home/menu non perdono i link.
- [x] **Data e orari: si apre toccando ovunque.** Nel campo data, un tocco su «GG», «MM» o «AAAA» (non solo sull'icona del calendario) apre il calendario. Stesso per gli orari: un tocco su tutto il rettangolo (per esempio «9:30») apre la scelta dell'ora. Con la tastiera e il lettore di schermo resta come adesso (etichette, focus visibile).
- [x] **Logo nel menu a destra (le tre linee)**: oggi è ancora **blu** e fermo. Deve essere il logo **scuro ambra** scelto (pezzo 1) e **animato**, come quello della testata (con «riduci movimento» resta fermo).
- [x] **Riepilogo del giorno** («In tutto 8 ore e 52, ti restano 38 minuti»): il testo «8 ore e 52» ha troppo spazio tra le parole e i numeri; la tabella è troppo grande. Stringere i numeri e il riquadro, usando meglio lo spazio. Mantiene i numeri che scorrono (decisione 14/10).
- [x] **«Pause e margini» più compatto**: occupa troppo spazio; ridurlo (righe più basse, controlli più piccoli, stessa funzione). Oggi sta nel foglio delle impostazioni (`fogli.js`).
- [x] **Togliere «Tutti i giorni»** dal menu delle impostazioni (già deciso nella specifica, pezzo 5, ma il pulsante c'è ancora in `fogli.js`). Le impostazioni che valgono per tutti i giorni (margine, «solo a piedi») restano, con la loro nota.
- [x] **Salvare e cancellare un itinerario**: 
  - la barra «Salva l'itinerario per segnare le tappe che hai visitato» resta (serve a far salvare) ma è **meno ingombrante**: più piccola, più curata, il tasto «Salva» meno grande;
  - **cancellare un itinerario salvato è troppo lungo** (oggi: tre puntini → «Elimina» → tasto enorme): più diretto, con conferma con il nome (regola del progetto per le azioni che distruggono) e il tasto di conferma di misura normale, non a tutta larghezza.
- [x] **Passare da un itinerario all'altro e crearne uno nuovo**: Enrico ha fatto fatica a ritrovarsi tra «I miei itinerari», l'itinerario aperto e «Nuovo itinerario» (esempio: aveva salvato un itinerario, ne ha aperto un altro, poi doveva andare in «I miei itinerari», sul «2 giorni» e infine «Nuovo itinerario»). Rivedere il percorso: meno passaggi, sempre chiaro quale itinerario è aperto e se è salvato. Enrico (14/10/2026) non vuole dare altri dettagli: lo decide Claude nella specifica della tranche 1, senza fare altre domande.

### Tranche 2 · Grafica nuova del compositore (con proposte): [specifica](specifiche/compositore-rifiniture-2.md) approvata il 15/10/2026, ramo `rifiniture-tranche-2`
Regola: quattro proposte per pezzo (come sempre); **dove Enrico ha chiesto tre, tre**. Un pezzo alla volta, tema 1 e tema 2, chiaro e scuro.
- [x] **Calendario (giorno, mese, anno)** (scelto e costruito il 15/10/2026: la 3 «Tutti i mesi» con la fascia della 1): stile del selettore da rifare, **3 proposte** (Enrico: «non mi piace proprio»).
- [ ] **Selettore dell'ora**: stile da rifare, **3 proposte**, coerenti col calendario.
- [x] **Barre di scorrimento** (scelte e costruite il 15/10/2026: «Il filo» tema 1 e sito, «Il nastro» tema 2) (le barre grigio chiaro e grigio scuro sul lato; confermato da Enrico il 14/10/2026 che è la barra di scorrimento verticale): **2 proposte per il tema 1 e 2 proposte per il tema 2** (Enrico, 14/10/2026: qui bastano due), ognuna vista in chiaro e in scuro. Una volta scelte, **si applicano a tutte le barre di scorrimento** del sito (fogli, pannelli, elenchi, mappa, ricerca), non solo a quella della pagina.
- [ ] **Barra «Salvato» e tre puntini**: i tre puntini (le impostazioni dell'itinerario) vanno **accanto a «Salvato»**, nella barra in alto, e cambiano secondo cosa si sta facendo (itinerario salvato o no, giorno aperto). Il menu che si apre da lì va ripensato e compattato (Enrico: «ho la sensazione che non mi piaccia»): contenuto, ordine e dimensioni; niente «Tutti i giorni»; «Pause e margini» compatto (vedi tranche 1). Quattro proposte della barra e del menu.
- [ ] **Mappa con tutte le tappe e le schede complete.** Oltre alle tappe dell'itinerario, un'opzione per **vedere tutta la mappa con tutti i luoghi**, e toccando un luogo (anche uno non scelto, per esempio Pignasecca o il Museo Filangieri) si apre **la scheda intera**, con descrizione, orari, prezzi e come arrivare, come la scheda della tappa: oggi si apre solo un riquadro piccolo con «30 minuti da Borgo Marinari, 30 minuti di visita». Da turista voglio poter leggere di cosa si tratta prima di aggiungerlo. Vale anche per la mappa che si apre da «Aggiungi una tappa». Dalla scheda si può aggiungere al giorno.
- [ ] **Rifare le schede di tutte le tappe e di tutti i locali** (già in elenco il 14/10/2026, sopra, in «Home e tutte le pagine»; qui è il momento di farlo, perché la mappa le apre). Decisioni di Enrico (14/10/2026): **solo i testi**, riscritti da capo.
  - **Prima la ricerca**: per ogni tappa e locale si cercano e si rileggono le fonti (agenti `ricercatore`, uno per gruppo, tutto salvato in `ricerca/` con fonte e data; si riparte da `ricerca/storia-luoghi/`, da rileggere). Regola «niente senza fonte» sempre valida: ciò che non è confermato resta con le parole di cautela.
  - **Tono**: deve **invogliare a vederlo**, ma dicendo in modo **oggettivo cosa si va a vedere**. Niente «dicono che è bello», niente voci di altre persone riferite in terza persona, niente prima persona (è la guida di `stile-testi`: caldo, 75% guida di viaggio, 25% amico del posto).
  - **Un po' di storia** dietro ogni luogo, senza esagerare: la scheda si legge in **circa 2 minuti, al massimo 3** (decide Claude la lunghezza di ogni scheda, in base al luogo).
  - Orari leggibili, prezzi e come arrivare restano nella scheda, con le fonti in fondo. Dopo la riscrittura: rilettura dei testi che usano la scheda e `npm run testi:firma`.

### Tranche 3 · Home e piè di pagina (con proposte)
Sono rifiniture della home O4 (Codex, 11/10/2026): si parte dalla specifica `specifiche/home-e-identita.md` e dal `DESIGN.md`; lo stile con le immagini **piace e resta**, cambiano le cose sotto.
- [ ] **Immagine iniziale (hero)**: oggi è tagliata e **il Vesuvio non si vede**. Ridurre lo zoom e riquadrare in modo che si vedano il golfo **e** il Vesuvio, su telefono e computer (da provare a 320, 390 e a schermo largo).
- [ ] **Ristrutturare la prima pagina**:
  - **la tridimensionalità è fatta male**: le cornici delle immagini con le linee bianche sottili danno un effetto sbagliato. Rifare i quadri delle immagini perché abbiano **una profondità vera** (ombre, strati, prospettiva, movimento allo scorrimento), in chiaro e in scuro; 4 proposte;
  - **tutte le scritte** della prima pagina vanno riviste e, dove non funzionano, **riscritte** (con Enrico, una per una; sezione dei testi della home già in elenco sopra);
  - **il rosso** attuale non piace: da rivedere nella palette (si propone un'alternativa, coerente con l'ambra del logo).
- [ ] **«Il viaggio continua, anche a tavola.»**: la sezione ha un'immagine brutta. Deve avere **una bella foto di piatti napoletani, fatta bene**. **Vincolo**: solo foto con licenza libera, autore e licenza in `src/data/foto.yaml` (regola comune); se non si trova abbastanza buona, si decide con Enrico (altra foto libera, illustrazione, o foto fatta da lui). Testo da riscrivere insieme.
- [ ] **Piè di pagina**:
  - i link «**Fonti e controlli · Privacy · Termini e note legali · Accessibilità del sito · Fotografie e licenze**» vanno **messi bene** (ordine, spaziatura, dimensioni, tocco su telefono, gruppi), in modo da sembrare curati e non un elenco buttato giù; resta tutto raggiungibile;
  - la scritta di chiusura «**Il prossimo posto. Il tuo modo di arrivarci.**», poco sopra le note legali, è scritta male anche se **il concept piace**: stesso concetto, **testo riscritto** e impaginazione migliore (Enrico vuole vedere il risultato per capire «come lo voglio»).
- [ ] **Controlli della tranche**: Lighthouse telefono almeno 95, axe in chiaro e scuro, 320 e 390 px, «riduci movimento»; la home non deve peggiorare di peso (foto ottimizzate, `loading` corretto).

## Fase 3 · I racconti degli itinerari e Napoli curata meglio
- **Una pagina per ogni itinerario pronto**, per Google: `/napoli/itinerari/mezza-giornata/`, `un-giorno/`, `due-giorni/`, `tre-giorni/`, con la storia dei luoghi (100–150 parole per luogo), «Cambia questo itinerario» e «Componi il tuo». Attenzione: «3 giorni» non deve ripetere il testo di «2 giorni».
- La **ricerca sulla storia** delle 15 tappe dei due giorni è fatta (07/10/2026): `ricerca/storia-luoghi/`, da rileggere prima di usarla. **Si salvano sempre tutti i fatti trovati**, anche quelli che non si usano.
- Più itinerari pronti, ognuno con un nome e un'idea (per esempio «Napoli sotterranea», «Il mare in un giorno», «Napoli con i bambini»), sempre ricalcolati dalla build.
- Le correzioni del trascinamento delle tappe e le 28 righe aperte di `da-risolvere.md` (orari dei locali, premi da verificare, luoghi), in una sessione di gruppo.

## Fase 4 · Esperienze a Napoli (il vecchio «blocco D»)
- Corsi di cucina, laboratori, degustazioni: una tappa con ora d'inizio e durata fisse, e un elenco `/napoli/esperienze/` con i filtri.
- Regole e dati già pensati in `specifiche/itinerari-napoli-ampliamento.md`, sezione 5. Prima Enrico approva l'elenco e i numeri.

## Fase 4 bis · Le gite di un giorno (o due), alla fine (Enrico, 07/10/2026)
- Capri, Ercolano, Pompei, Sorrento, Ischia, Caserta: come arrivare, cosa fare, quanto tempo. Ogni gita ha la sua misura: Ischia anche in 2 giorni (un giorno l'isola, l'altro terme o mare), Caserta la Reggia più qualcos'altro in città.

## Fase 5 · La seconda città
- Specifica: quale città (Roma, Milano, Torino, Venezia…), quante tappe, da dove vengono i tempi a piedi e i mezzi (OpenStreetMap, orari aperti dell'azienda dei trasporti).
- Il compositore è già scritto per più città: la città arriva come dati.
- Consiglio: Napoli perfetta più 1 o 2 città, poi si allarga. Per ogni città va deciso chi è l'«amico del posto» della guida di stile.

## Fase 6 · SEO e crescita
- claude-seo (solo i comandi di analisi, letto prima tutto il codice), Search Console, pagine fisse per tappe e locali se hanno senso.
- Parole chiave con Semrush solo con l'OK di Enrico (consuma unità del suo piano).
- Nome e dominio definitivi dopo l'avvocato.

## Fase 7 · Lingue
- Inglese per primo, con la guida di stile (niente giochi di parole che non si traducono).

## Intanto, su Napoli a Vela (repository `pol`, sessione a parte)
- Pagina ponte su `/napoli/itinerari/` e `/napoli/dove-mangiare/`, link verso Nextstop, pulizia: l'elenco è nel `PROGRESS.md` di Napoli a Vela.
- Fino ad allora tappe, locali e orari si aggiornano **solo qui**.
