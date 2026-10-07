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

**Controlli**: consistent-ui **almeno 35 su 40**; Lighthouse su telefono 95 o più, axe in chiaro e scuro, 320 e 390 px.

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
