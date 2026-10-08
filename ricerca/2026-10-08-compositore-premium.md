# Ricerca: il compositore «premium» (come lo fanno i migliori)

**Domanda**: come fanno app e siti di alta qualità a mostrare una giornata di viaggio (elenco, linea del tempo, mappa), a cambiare giorno, a mettere insieme elenco e mappa, ad aggiungere una tappa e a confermare il salvataggio; quali siti di viaggio premiati per il design usano quali tecniche di movimento e impaginazione; quali micro-interazioni fanno percepire qualità (e cosa dicono le fonti autorevoli su durate, curve, «riduci movimento» ed eccessi); come i siti editoriali di viaggio impaginano ore, tappe e spostamenti.
**Data**: 08/10/2026 (tutte le pagine lette o cercate in questa data).
**Fatta da**: agente ricercatore, Sonnet.
**Per**: il ridisegno del compositore di itinerari (telefono per primo, effetto «costato tantissimo»).

## Come leggere questo file
- WebFetch e WebSearch **riassumono** le pagine, non le riportano per intero. Ogni fatto porta una sigla:
  - **[L]** = pagina aperta con WebFetch (letta il 08/10/2026; il riassunto è dello strumento).
  - **[R]** = solo riassunto di una ricerca web: la pagina non l'ho aperta, fonte **più debole**.
  - **[D]** = deduzione mia, non scritta da nessuna fonte.
- Citazioni testuali: al massimo una riga, tra virgolette.
- Pagine **non** aperte, con il motivo: nytimes.com e cntraveler.com (lo strumento non può accedervi), help.wanderlog.com (403), tympanus.net/codrops (403), m3.material.io e developer.apple.com/design (pagine JavaScript: solo il titolo; per Apple ho letto il testo dal file JSON pubblico `developer.apple.com/tutorials/data/design/human-interface-guidelines/…`, per Material i documenti ufficiali su GitHub `material-components/material-components-android`), support.apple.com versione iOS 27 (solo indice), tomsguide.com (testo troncato). Un primo tentativo su Apple HIG «Motion» ha restituito solo il titolo e una risposta a memoria dello strumento: **scartata**; vale solo la lettura dal JSON qui sotto.

---

## A. App e servizi di viaggio: come mostrano la giornata

### A1. Wanderlog
- [L] https://wanderlog.com/plan-a-trip : l'itinerario si organizza «per giorno o per categoria» e si vede su una mappa a colori; un luogo aggiunto «compare sulla mappa»; la mappa mostra **distanza e tempo tra i luoghi**; c'è «ottimizza percorso»; esportazione in Google Maps; piano scaricabile offline. La pagina **non** dice come si cambia giorno né se i suggerimenti sono ordinati per distanza.
- [L] https://wanderlog.com/blog/faq (centro assistenza ufficiale):
  - aggiungere: «Add a place» in fondo all'elenco; orari di inizio e fine toccando il luogo; elementi di «Overview/Places to visit» spostati nell'itinerario con casella + «Move to»; **un giorno intero non si sposta ancora**, si selezionano tutti i luoghi e si usa «Move to»;
  - un solo giorno sulla mappa: pulsante «tre strati» in alto a destra sulla mappa, si spunta il giorno; sul sito, un indice a destra permette di saltare da un giorno all'altro (lo scorrimento automatico al giorno corrente è «previsto ma non ancora disponibile»);
  - **tempo di viaggio totale del giorno mostrato sotto il titolo del giorno**; linee sulla mappa e distanze/tempi tra i luoghi; il mezzo di trasporto tra due luoghi si cambia toccando quello predefinito; «Optimize route» fino a **15 luoghi nello stesso giorno**, scegliendo partenza e arrivo;
  - cancellare: pressione lunga (telefono) o passaggio del mouse (sito); salvataggio automatico: la FAQ non ne parla.
- [L] https://apps.apple.com/us/app/wanderlog/id1476732439 : luoghi con orario facoltativo di inizio/fine; pin su una mappa basata su Google Maps, con **linee che collegano i pin se i luoghi sono visitati in ordine**; riordino con trascinamento; ottimizzatore; «Import from anywhere» (incolli un link o condividi un reel e crea l'itinerario).
- [L] https://www.imore.com/apps/travel-apps/wanderlog-iphone-travel-app-trip-planning (recensione 18/03/2024): scheda Itinerario con i giorni; «Auto-fill day» propone le attività; icona mappa in basso a destra, **trascinando il pannello verso il basso si ha la mappa a tutto schermo**; menu in alto a destra per scegliere quali liste mostrare in mappa; «Explore» con guide di altri, tasto «Add» per metterle nelle proprie liste.
- [L] https://screensdesign.com/showcase/wanderlog-travel-planner (sito terzo di analisi delle schermate): la richiesta all'assistente «Top attractions» dà un elenco **e** mette i luoghi in mappa, con un tocco si salvano nell'itinerario; mappa a colori per categoria; l'onboarding ha 42 passi (indicato come attrito); la panoramica del viaggio è «densa».
- [L] https://origin.designli.co/blog/how-wanderlog-app-simplifies-trip-planning-using-behavioral-design (blog di un'agenzia, 2022, pubblicità per sé): ai nuovi utenti si mostra un viaggio di esempio; suggerimenti di luoghi in base alla posizione; livelli Basic/Proficient/All-star; bottoni primari arancioni accesi.
- [L] https://www.stippl.io/blog/stippl-vs-wanderlog (**scritto da un concorrente**, Stippl): su Wanderlog «le tappe si trascinano e il percorso si aggiorna», la mappa raggruppa i quartieri per ridurre i ritorni; l'ottimizzazione è Premium.

### A2. Mindtrip
- [L] https://apps.apple.com/app/mindtrip-ai-travel-companion/id6503107567 : un «hub» per destinazione (dettagli, chat, media, idee, itinerari, prenotazioni); idee provvisorie da riprendere; mappa interattiva con luoghi vicini, distanze e percorsi; note di versione 11.0: «interfaccia semplificata per cercare e aggiungere luoghi»; «Start Anywhere» (da articolo, video, foto o pin di Google Maps a un piano); offline dalla 18.1. **Segnalazione di un utente** (non documentazione): aggiungendo un elemento si vedono solo valutazione, foto e titolo, senza poterlo aprire per i dettagli; la ricerca si azzera ogni volta.
- [L] https://mindtrip.ai : solo frasi di presentazione («costruisci un viaggio», «tieni tutto in un posto»); niente su mappa o aggiunta di luoghi.
- [R] https://techcrunch.com/2024/07/31/travel-startup-mindtrips-new-feature-lets-you-build-an-itinerary-from-a-screenshot-youtube-or-tiktok-video : da un link si ottengono luoghi sulla mappa, da salvare nei preferiti o in una lista.
- NON TROVATO: come è fatta la vista del giorno e come si cambia giorno (vedi in fondo).

### A3. Airbnb (viaggi, esperienze, liste dei preferiti)
- [L] https://www.airbnb.com/help/article/338/how-do-i-save-a-favorite-experience-or-place-to-stay : tocchi il **cuore** → scegli una lista esistente o ne crei una; i salvataggi della stessa ricerca finiscono **nella stessa lista in automatico**; «Change» per spostarlo in un'altra; massimo 100 per lista; le date cercate restano salvate e si possono cambiare. L'articolo **non descrive nessun messaggio di conferma**.
- [R] https://www.airbnb.com/help/article/1236 : chi è invitato (con account) può aggiungere note, votare su/giù, cambiare le date; chiunque abbia il link può vedere la lista.
- [L] https://news.airbnb.com/product-releases/airbnb-2025-summer-release/ (13/05/2025): nuova app con «Explore», e una scheda **Trips** descritta come «An advanced travel itinerary» (programma, dettagli della casa, servizi ed esperienze prenotati).
- [L] https://www.itsnicethat.com/articles/airbnb-app-redesign-140525 (rivista di design, 14/05/2025): icone «utili, comprensibili in tutte le lingue, giocose»; interfaccia più morbida, forme più tonde e «movimento fluido ma contenuto»; Trips come «living itinerary», pensato per essere piacevole perché la gente lo riapre spesso per codici della porta e indicazioni; obiettivo «Fun, alive, and simple». Non parla di caratteri né di vibrazioni (haptics).
- [L] https://designcompass.org/en/2025/07/04/airbnb-new-design-system/ (04/07/2025): Chesky ha mostrato un nuovo sistema di design (carattere, navigazione, griglia, colori, schede, icone) dopo reazioni miste all'aggiornamento di maggio. Nessun dettaglio sul movimento.
- NON TROVATO: durata e curva dell'animazione del cuore (nessuna fonte la descrive).

### A4. Google Maps (liste) e Google Travel
- [L] https://support.google.com/maps/answer/7280933?hl=en (Android): scheda «Tu» → «Nuova lista» → nome e descrizione → **Privata / Condivisa** → Salva. Per salvare un luogo: tocchi nome o indirizzo in basso → **Salva** → scegli la lista o «Nuova lista»; compare **un pannello in basso** con nome, indirizzo, tasto Salva e selettore di lista. Condivisione: link in sola vista o modifica («Let others edit this list»); chi apre il link tocca «Save list»; si vedono nomi e foto di chi ha aggiunto o modificato luoghi e note.
- [R] https://searchengineland.com/google-maps-new-feature-lets-users-create-lists-saved-places-can-shared-accessed-offline-269310 : lista salvabile anche offline (articolo di lancio, datato).
- [L] https://blog.google/products/travel/see-more-plan-less-try-google-trips/ (**19/09/2016**, app Google Trips): «piani del giorno» per le 200 città principali; il tasto «+» apre una **mappa dei luoghi più visitati**; scegli mattina, pomeriggio o giornata intera, **fissi (pin) un luogo** e l'app riempie il resto del giorno; la «bacchetta magica» propone luoghi vicini e genera un nuovo itinerario a ogni tocco; viaggi offline con «Download». Il post non dice come si toglie una tappa.
- [R] https://www.androidcentral.com/google-trips-app-going-way-dodo-come-august : l'app è stata chiusa il 05/08/2019; le funzioni sono passate a Ricerca/google.com/travel.
- NON TROVATO: pagina di aiuto attuale di Google Travel «Viaggi».

### A5. Apple Maps (Guide)
- [L] https://support.apple.com/en-asia/guide/iphone/iph0a53d4d7f/15.0/ios (iOS 15): crea: scheda di ricerca → «Nuova guida» → nome → Crea; aggiungi: scheda del luogo → pulsante «Altro» a destra di «Indicazioni» → Guide → scegli; modifica dalla scheda della guida → «Modifica»; condividi col pulsante in basso sulla scheda. La pagina non parla dell'ordine.
- [R] https://www.tomsguide.com/phones/iphones/how-to-create-your-own-guides-in-apple-maps e https://iphonelife.com/content/how-to-create-collection-apple-maps : ordinamento per «Data di aggiunta, Nome, Distanza»; copertina; guide curate da aggiungere alle proprie (riassunto di ricerca, pagine non aperte).
- NON TROVATO: il testo dell'articolo iOS 27 «Organize places with custom guides» (la pagina caricata mostrava solo l'indice).

### A6. Polarsteps
- [L] https://apps.apple.com/app/id947925763 : viaggio in «passi» (step) con foto, video, storie; l'app **propone passi** in base a dove hai scattato foto; percorso tracciato in automatico; pianificatore con intelligenza artificiale; scelta di come ti sposti tra le tappe; nota di un recensore: sull'iPhone la mappa è piatta e non interattiva (sul Android un globo 3D). Le note di versione sono generiche.
- [R] https://www.polarsteps.com/news/apple-spotlights-polarsteps-as-one-of-its-most-loved-travel-apps-and-applauds-its-design-approach (la pagina aperta ha dato solo il titolo; riassunto da ricerca): Apple l'ha citata tra le app di viaggio preferite; il capo del design (Job Harmsen) ha parlato di Liquid Glass: componenti nativi, **non mettere l'effetto vetro su tutto**, regolare per la leggibilità.
- [R] https://screensdesign.com/apps/polarsteps/ : itinerario come **linea del tempo verticale con schede dei luoghi**, conto alla rovescia su una mappa scura (galleria in parte a pagamento).

### A7. Stippl
- [L] https://www.stippl.io/blog/stippl-vs-wanderlog (vendor, cioè Stippl su se stessa): piano giorno per giorno modificabile; «mappa per giorno con instradamento chiaro tra le tappe». Ammette che la sua mappa è meno curata di quella di Wanderlog.
- [R] https://apps.appfollow.io/ios/stippl-travel-planner/6443617088 : programma «ora per ora, un giorno alla volta»; vista d'insieme del giorno su una schermata. Dichiarazioni dell'azienda, nessuna recensione indipendente trovata.

### A8. Tripadvisor (Trips)
- [L] https://www.tripadvisor.com/AIAssistant : il piano giorno per giorno si salva in «Trips», dove si **riordinano i giorni**, si aggiungono/tolgono tappe, si condivide; per salvare serve l'accesso. La pagina non dice se l'itinerario si vede su mappa.
- [R] un blog personale senza data (fonte debole): i salvati compaiono sulla mappa in Trips, si assegnano ai giorni, quelli incerti restano in una sezione «non programmati», «remove from Trip» per toglierli.

### A9. Layla
- [L] https://screensdesign.com/showcase/layla-ai-trip-planner (sito terzo): inizio con una chat con risposte rapide, **anteprima del viaggio prima della registrazione**, poi paywall morbido; il piano ha schede **Itinerary / Route / Transport / Stays / Activities**; la mappa mostra il viaggio con i percorsi giornalieri; togliendo un'attrazione si torna alla chat invece che all'itinerario (attrito segnalato dal recensore).
- [R] Trustpilot (recensioni di utenti, fonte debole): alcuni dicono che itinerari salvati sono spariti o cambiati.

### A10. Citymapper
- [L] https://ixd.prattsi.org/2026/09/design-critique-citymapper/ (critica di una scuola di design, 09/2026): il viaggio è diviso in **fasi da scorrere con un gesto, si vede solo quella in corso**, il che riduce il carico mentale; punto debole: la fase «a piedi» restava evidenziata dopo essere saliti sul treno; proposta: scheda colorata per la fase attiva e stato «viaggio concluso»; la stazione era un punto unico e portava a un ingresso chiuso.
- [R] https://anthonyhobday.com/sideprojects/attentiontodetail/citymapper.html (il link diretto dà 404; riassunto da ricerca): gli ingrandimenti della mappa sono basati sulle distanze a piedi; i colori della mappa si attenuano quando pianifichi. Da verificare.

### A11. Atlas Obscura
- [R] https://apps.apple.com/app/id1563250221 : mappa dell'intero archivio, liste personalizzate, «Been There»; sul sito i profili hanno «Been» e «Want to Go». Una recensione dice che le liste non si sincronizzano tra sito e app. Nessuna analisi di design trovata.

### A12. Altre app (solo riassunti di ricerca)
- [R] app TRAVAA e Tripbook (App Store): giorni con colori diversi, **marcatori numerati** in ordine sulla mappa. Fonte debole.

### A13. Tabella di confronto (mia sintesi, solo con cose lette sopra; «n.t.» = non trovato)
| App | Come mostra il giorno | Cambio giorno | Elenco e mappa | Aggiungere una tappa | Conferma del salvataggio |
|---|---|---|---|---|---|
| Wanderlog | Elenco per giorno con orari facoltativi, tempo totale del giorno sotto il titolo, distanza/tempo tra le tappe | indice (sito); sulla mappa si spunta il giorno | Telefono: mappa a tutto schermo trascinando il pannello; sulla mappa linee tra i pin | «Add a place» in fondo all'elenco, «Auto-fill day», guide con «Add», assistente che mette i luoghi in mappa | n.t. (FAQ non ne parla) |
| Mindtrip | n.t. | n.t. | mappa interattiva con distanze | ricerca semplificata (11.0); critica d'utente: poche informazioni nell'elenco | n.t. |
| Airbnb | Trips = «itinerario vivo» | n.t. | n.t. | cuore → lista | n.t. (aiuto: nessun messaggio descritto) |
| Google Maps liste | liste, non giorni | n.t. | n.t. | Salva → pannello in basso con liste | pannello in basso con selettore (testo di conferma n.t.) |
| Google Trips (2016) | piano del giorno per mattina/pomeriggio/giorno intero | n.t. | «+» apre la mappa dei luoghi | fissi un luogo, l'app riempie il resto; bacchetta magica | n.t. |
| Apple Maps | guide (liste), non giorni | n.t. | n.t. | pulsante «Altro» sulla scheda → Guide | n.t. |
| Polarsteps | linea del tempo verticale di «passi» con schede | n.t. | mappa col percorso | passi proposti dalle foto | n.t. |
| Layla | schede Itinerary/Route/…; chat per modificare | schede | mappa con percorsi del giorno | via chat | n.t. |
| Tripadvisor | giorni in «Trips»; riordino giorni | n.t. | n.t. | n.t. | n.t. |

### A14. Cosa ne deduco [D]
- Quasi tutti separano due oggetti: la **lista** (idee, luoghi salvati) e il **programma** (giorni con orari). Wanderlog e Mindtrip tengono le idee «in sospeso» prima di metterle in un giorno; Tripadvisor ha la sezione «non programmati».
- Il dettaglio che distingue Wanderlog è **il tempo tra le tappe e il totale del giorno sotto il titolo del giorno** (letto nella sua FAQ): è proprio il nostro «tratto a piedi».
- Nessuna delle fonti lette descrive un messaggio di conferma del salvataggio: è un campo dove si può distinguersi (vedi sezione D).
- Il collegamento elenco-mappa che ricorre: tocco su tappa ↔ pin evidenziato, giorno con proprio colore, marcatori numerati (Wanderlog, TRAVAA, Tripbook) [R+D].

---

## B. Elenco e mappa su telefono: il foglio che sale

- [L] Apple HIG «Sheets» (letto dal JSON pubblico https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sheets.json , 08/10/2026):
  - due altezze («detents») del sistema: **large** (tutto) e **medium** (circa metà); con «medium» il foglio può stare in due altezze; per l'apertura progressiva si usa medium;
  - **grabber** (la barretta in alto): segnala che si può trascinare, un tocco passa da un'altezza all'altra, serve anche a VoiceOver; «includilo in ogni foglio ridimensionabile»;
  - su iPhone un foglio può essere **non modale** (lo sfondo resta usabile); un solo foglio alla volta;
  - chiusura: Annulla/Chiudi, Fine, Indietro; supportare lo scorrimento verso il basso; con modifiche non salvate chiedere conferma.
- [L] Material (documento ufficiale su GitHub, https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/BottomSheet.md): *bottom sheet standard* = resta accanto al contenuto principale, **senza velo scuro**, adatto a contenuto secondario che deve restare visibile; *modale* = con velo, chiude toccando fuori o trascinando giù. Stati: **collassato** (si vede solo la «peek height», di solito la posizione di riposo), **mezzo aperto**, **aperto**, nascosto. La maniglia ha area minima di tocco di 48dp e serve a chi usa lettori di schermo.
- [L] NN/g, articolo sui bottom sheet https://www.nngroup.com/articles/bottom-sheet/ : tipi modale / non modale / espandibile; i fogli sono per interruzioni o «bivi», **non per sostituire pagine del percorso principale**; serve un tasto di chiusura (X) **visibile**, non solo la maniglia; la sola chiusura con scorrimento non è accessibile; errori: fogli sovrapposti, sfondo importante coperto, chiusura accidentale durante lo scorrimento. L'articolo non parla di altezze o punti di aggancio.
- [L] Wanderlog (iMore, vedi A1): sul telefono la mappa si apre dal pannello trascinandolo verso il basso.
- [D] Per il compositore: il modello «foglio non modale con due-tre altezze sopra la mappa» è quello descritto dalle linee guida di Apple e Material; NN/g avverte di dare sempre un tasto di chiusura visibile e di non usarlo per il percorso principale.

---

## C. Siti di viaggio premiati per il design (Awwwards, CSSDA, FWA)

Nota di metodo: le pagine dei premi di Awwwards contengono **punteggi, etichette (tag), strumenti, colori e elenchi di elementi**, quasi mai una descrizione scritta del movimento. Dove ho trovato descrizioni vere sono di case study delle agenzie (indicato). I «voti» delle Menzioni d'onore sono della comunità, non di una giuria (lo dicono le pagine).

### C1. Elenco (8-12 esempi con indirizzo, anno e cosa si legge)
| # | Sito | Premio e data | Cosa ho letto [L] | Cosa deduco [D] |
|---|---|---|---|---|
| 1 | **Travel Next Level** (CHECK24) https://travelnextlvl.de/en , scheda https://www.awwwards.com/sites/travel-next-level | Sito del giorno + Developer Award, **27/12/2024**, Artemii Lebedev; voto 7,36 (animazioni/transizioni 7,20, accessibilità 6,20) | Communication Arts https://www.commarts.com/webpicks/travel-next-level : «minimalismo e tipografia grossa», griglia «leggermente irregolare», schermata d'apertura con **una porta che si apre su un paesaggio e un aereo che passa**; Webflow + **Lenis** (scorrimento morbido); After Effects, Cinema4D, Redshift; elementi 3D «ottimizzati per velocità con compressione»; JavaScript che carica contenuti tra le sezioni. Case study su Codrops (26/12/2024, https://tympanus.net/codrops/?p=83684 ) **non apribile (403)**. Testo della home letto: «Drag to navigate» sopra i caroselli, bottone «Explore Now». | La sequenza d'apertura è per la home, non per un'area di lavoro. Il carosello a trascinamento è l'unico gesto «da telefono» visibile. |
| 2 | **Niarra Travel** https://www.awwwards.com/sites/niarra-travel | Sito del giorno + Developer Award, **22/06/2021**, Superhero Cheesecake; Design 7,75; animazioni 7,80 | Tag: Microinteractions, WebGL, GSAP, header design. Elementi elencati: «Hover mask slideshow» (galleria), piè di pagina. Nessuna descrizione scritta del movimento. | «Hover» = solo mouse: sul telefono non esiste. |
| 3 | **Lewa House** (riserva in Kenya) https://lewahouse.com , case study https://unseen.co/projects/lewa-house/ | Sito del giorno su Awwwards, CSSDA (giorno e mese), FWA (giorno) e altri (anni non indicati nella pagina), case study primavera 2022, Unseen Studio | Mappa 3D in **WebGL** al centro dell'esperienza; terreno costruito con Gaea e Substance Painter, texture 4K; percorso non lineare con navigazione tradizionale per l'accesso rapido; scritte «Keep scrolling», «Drag to explore», «Click & Hold». L'agenzia dice: «particolare attenzione» alle prestazioni sui telefoni e mappa immersiva anche da telefono. | È l'esempio più vicino a «mappa come protagonista»; il costo in prestazioni è dichiarato dall'agenzia, non misurato. |
| 4 | **Hedwig: Curated Travel** https://hedwigtravel.com/ | Menzione d'onore, **19/04/2026** | Costruito con Readymag; «narrazione editoriale» con stile curato; solo tag, nessuna descrizione di movimento. | Editoriale, non strumento. |
| 5 | **Vita Travels** https://vita-travel.webflow.io/ | Menzione, **01/08/2026**, Phenomenon Studio | Webflow, Figma, Contentful; foto di sfondo grandi, elementi «video» (menu, servizi). | n.d. |
| 6 | **Spain Collection Travel** https://spaincollection.com/ | Menzione, **26/10/2025**, Dgrees | WordPress, **WebGL, GSAP**; tag «Transitions»; elemento «Hero animation» con 3 video; colori #BF1826 e #18191C. | Apertura a video e transizioni, niente altro scritto. |
| 7 | **Travel Sensations** http://www.travel-sensations.com | Menzione, **10/09/2025**, McArnolds | **PixiJS** (grafica 2D accelerata), Tailwind, Adobe XD; galleria e immagini grandi. | n.d. |
| 8 | **Snami Travel** https://www.snamitravel.com/ | Menzione, **13/11/2025**, Lime Creative | Contentful, CSS, **GSAP**, JavaScript; tag «Microinteractions»; elementi con video (Home, Concierge, Contatti). Testo home letto: titolo a lettere maiuscole «GRECIAN TRAVEL REDEFINED», molti bottoni «Discover». | Il tag microinteractions non è descritto. |
| 9 | **Lithuania Travel** (ente nazionale) https://lithuania.travel/en | Menzione, **20/06/2025** | Tag: Animation, Fullscreen, Minimal, Interaction Design. Nel testo della home ho letto: **«Favorites» (cuori «Patinka») che rimandano all'accesso**, un link alle impostazioni di accessibilità e, in fondo, **controlli per grandezza dei caratteri, immagini e sottolineatura dei link**. Nessun pianificatore visibile (solo un «AI guide» nel piè di pagina). | Esempio di sito premiato con controlli di accessibilità in vista. |
| 10 | **Le temps d'y vivre** (Périgord Noir) https://www.letempsdyvivre.fr/ | Menzione, **12/08/2025**, Jaeco | Webflow, **JavaScript puro (vanilla)**, Figma; tag Animation, Transitions; «cifre chiave» e ritratti come elementi. | n.d. |
| 11 | **When to Travel** https://www.awwwards.com/sites/when-to-travel | Sito del giorno, **10/05/2018**, Unseen Studio | GSAP, React, Laravel; tag «Horizontal Layout», «Unusual Navigation»; elementi **«Horizontal Slide Menu»** e **«Timeline Selection Menu»**; strumento interattivo per scegliere quando viaggiare (eventi e meteo). | Vecchio (2018), ma è un esempio di **linea del tempo come comando**. |
| 12 | **How to Time Travel** https://howtotimetravel.rights4time.com/ | Menzione, **19/12/2024**, Platform81 | Tag Animation, Transitions, Sound; elemento «Video Navigation». | Sperimentale, poco pertinente. |

Altri elementi di singoli siti elencati su Awwwards, **senza descrizione scritta** (solo i tag):
- [L] Travelshift (Immersive Garden): elemento «navigation transition» con tag **zoom** e **click and hold** (https://www.awwwards.com/inspiration/navigation-transitions-travelshift ); nessun premio indicato in quella pagina.
- [L] National Parks (Joe Lee, https://www.awwwards.com/inspiration/page-transition-national-parks ): tag page transition, preloader; elementi «Interactive Maps», «Gallery».
- [L] MOOSER Hotel St. Anton Arlberg (Studio Zmart): «Location Map» illustrata e interattiva, tag illustration/map/hotel (https://www.awwwards.com/inspiration/location-map-mooser-hotel-st-anton-arlberg ).
- [L] Dalla raccolta mappe di Awwwards (https://www.awwwards.com/awwwards/collections/maps-geolocation-streetview/ ): **Marseille** (La Phase 5, Sito del giorno + Developer Award, 13/03/2021) e **Local Guides** (Hook, Sito del giorno, 03/04/2021) sono i due «guide di città» con premio; nessuna descrizione.
- [L] Elenco dei siti di viaggio con Sito del giorno nelle pagine 1-2 di https://www.awwwards.com/websites/travel/ : Travel Next Level (2024), Niarra Travel (2021), Making Your Dreams Travel (2019), 66°Nord (2019), When to Travel (2018), Heart of Travel (2017). **Nell'elenco «travel» e «travel-tourism» (pagina 1) non ho trovato nessun Sito del giorno del 2025 o 2026**: le voci recenti sono Menzioni d'onore.

### C2. Cosa si descrive davvero sulle tecniche (con fonte e limiti)
- [L] https://www.hontran.dev/blog/travel-website-design-immersive-case-study (10/07/2026, sviluppatore singolo; **generico, non un cliente reale**, nessuna misura): pagina come «piccolo film»; zoom lento dello sfondo allo scorrimento; testo che compare riga per riga; linea del percorso che si disegna da sola; tutto legato allo scorrimento con **GSAP ScrollTrigger**; transizione tra destinazioni con **shader WebGL di spostamento** (increspatura per le isole, granulosa per i deserti); regola «le foto sono sacre»; per i telefoni medi: immagini AVIF/WebP delle misure giuste, foto principale con priorità e gallerie a caricamento pigro, texture compresse KTX2/Basis, **animare solo transform e opacity**. Non parla di tipografia né di «riduci movimento».
- [L] https://www.zoocha.com/news/exploring-design-innovation-tourism-website (recensione dell'agenzia Zoocha, **25/10/2017**, sito Love for Iceland): navigazione a sinistra con grandi foto a destra; scorrimento che cambia sezione al posto di un carosello; leggero effetto di particelle; carattere con grazie grande e coerente. **Critiche dello stesso recensore**: le animazioni lente a volte danno l'impressione di ritardo; accessibilità debole (manca l'evidenziazione del tasto Tab); il carattere con grazie rende un po' meno leggibile.
- [L] Lewa House (sopra): scritte «Keep scrolling» / «Drag to explore» / «Click & Hold» come suggerimenti di gesto.
- [R] https://digitalstrategyforce.com/journal/why-are-immersive-experiences-dominating-the-2026-awwwards/ : sostiene che i siti 3D immersivi siano il 61% dei «Siti del giorno» del primo trimestre 2026 (contro 23% nel 2024). Fonte commerciale, **dato non verificato su Awwwards**.

### C3. Cosa non ho potuto vedere
- Il **movimento** vero (curve, durate, comportamento al tocco) non si legge dal testo di una pagina. Per descriverlo bisognerebbe aprire i siti in un browser vero e registrare/ispezionare (non fatto: cose da scaricare e strumenti non previsti dalle regole dell'agente).
- CSS Design Awards e FWA: non ho trovato elenchi per categoria viaggi/turismo né vincitori 2025-2026 (vedi NON TROVATO).

### C4. Cosa ne deduco per il telefono [D]
- Cursore personalizzato, pulsanti «magnetici» e animazioni al passaggio del mouse **non esistono su schermo tattile**: MDN dice che `@media (hover: hover)` si usa per applicare effetti solo dove si può passare sopra; Rauno Freiberg (Web Interface Guidelines, https://interfaces.rauno.me/ ) consiglia gli stati hover solo per dispositivi con hover.
- Le tecniche viste nei siti premiati con fonte (GSAP/Lenis/WebGL/shader/video d'apertura) servono alla **vetrina** (home, pagine di città); le fonti di prestazione ricordano che i costi su un telefono medio sono reali (Hon Tran, Unseen Studio).

---

## D. Micro-interazioni che fanno sentire la qualità (fonti autorevoli)

### D1. Durate
- [L] NN/g, articolo sulla durata delle animazioni https://www.nngroup.com/articles/animation-duration/ : feedback semplice (casella, interruttore) **circa 100 ms**; cambi di schermata consistenti (es. finestra che entra) **200-300 ms**; in generale 100-400 ms, **400 solo per grandi spostamenti su schermi grandi**, vicino a 500 ms «pesa»; le animazioni di **entrata un po' più lunghe di quelle di uscita** (esempio: comparsa 300 ms, scomparsa 200-250 ms); citazione: «It is far more common for animations to be too long than too short.» L'articolo non dà valori separati per telefono e computer.
- [L] Material, token di durata (https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Motion.md ): short1-4 = **50, 100, 150, 200 ms**; medium1-4 = **250, 300, 350, 400**; long1-4 = 450, 500, 550, 600; extra-long1-4 = 700-1000. «La durata deve crescere con l'area o la distanza dell'animazione.»
- [L] stesso documento, durate predefinite delle transizioni: *container transform* 300 ms in entrata / 250 in uscita; *shared axis* 300; *fade through* 300; *fade* 150 in entrata / **75** in uscita (il documento segnala l'incoerenza con il token short1 da 50).
- [L] Emil Kowalski (progettista, https://emilkowal.ski/ui/7-practical-animation-tips ): animazioni dell'interfaccia **sotto i 300 ms** (180 ms «si sente più scattante» di 400); pulsante premuto `scale(0.97)`; **non partire da scale(0)** (partire da circa 0,9-0,93); `ease-out` in entrata e uscita; popover che scalano dall'origine del pulsante; «togli le animazioni per le interazioni che si vedono molte volte al giorno».
- [L] Rauno Freiberg (https://interfaces.rauno.me/ ): «non più di 200 ms perché l'interazione sembri immediata»; finestre di dialogo che entrano con dissolvenza e scala da circa 0,8; pressione dei bottoni scala 0,9-0,96; **nessuna animazione per azioni frequenti** (aggiungere/togliere elementi da una lista, menu con tasto destro); cambio tema senza animazioni; pausa delle animazioni a ciclo fuori schermo. Il documento non dà curve né regole per «riduci movimento».
- [L] NN/g «Response Times: The 3 Important Limits» https://www.nngroup.com/articles/response-times-3-important-limits/ (estratto di un libro del 1993, aggiornato 2014): **0,1 s** = sembra istantaneo; **1 s** = il flusso di pensiero non si interrompe; **10 s** = limite dell'attenzione, serve una barra di avanzamento (lo spinner è l'ultima scelta).

### D2. Curve di velocità
- [L] NN/g (animation-duration): in entrata **ease-out** (parte veloce, rallenta); in uscita **ease-in**; ease-in-out «si usa meno»; evitare il lineare.
- [L] Material (Motion.md): standard `cubic-bezier(0.2, 0, 0, 1)`; standard-decelerate `(0, 0, 0, 1)` per ciò che entra; standard-accelerate `(0.3, 0, 1, 1)` per ciò che esce; emphasized-decelerate `(0.05, 0.7, 0.1, 1)`; emphasized-accelerate `(0.3, 0, 0.8, 0.15)`; «emphasized» è un percorso a segmenti, non una curva sola.
- [L] Emil Kowalski: «l'easing è la parte più importante di ogni animazione»; le curve personalizzate sono di solito più forti di quelle predefinite del CSS.

### D3. Pulsante «Salva»/segnalibro e conferma
- [L] Airbnb (aiuto 338, vedi A3): cuore → scegli lista o creane una; l'articolo non descrive un messaggio di conferma.
- [L] Google Maps (A4): tocco su Salva apre un pannello in basso con le liste.
- [L] Material Snackbar (https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/Snackbar.md ): serve a **confermare un'azione** senza interrompere; **aggiungi un'azione «Annulla»** quando l'utente può tornare indietro; se ne mostra uno alla volta (il nuovo sostituisce il vecchio); va tenuto sopra la barra in basso; i testi sono letti dai lettori di schermo; meglio dello «Toast» perché sta nel contesto dell'azione.
- [L] Rauno (interfaces.rauno.me): interruttori che si applicano subito, senza conferma; **aggiornamento ottimistico** (si aggiorna subito, si torna indietro con avviso se fallisce); il messaggio sta **vicino al comando** (esempio: spunta temporanea sul posto dopo «copia»).
- [R] https://phabricator.wikimedia.org/T125379 (ticket di Wikimedia, fonte debole): utenti che salvavano un elemento in una lista non capivano dove fosse finito, soprattutto con la lista fuori schermo; proposta: conferma + evidenziare la nuova voce se la lista è visibile, avviso verso l'alto se è fuori schermo.
- [L] NN/g, articolo sullo scopo delle animazioni https://www.nngroup.com/articles/animation-purpose-ux/ : il movimento **conferma che il sistema ha registrato l'azione** e può «anticipare» un risultato (esempio: riordino di una lista).
- NON TROVATO: studio con numeri sull'effetto di un'animazione di salvataggio sulla fiducia o sull'uso.

### D4. «Aggiungi alla lista» (un elemento che entra in un elenco)
- [R] https://learn.microsoft.com/cs-cz/previous-versions/windows/apps/jj649430(v=win.10) (documentazione Microsoft di guida, vecchia): all'aggiunta gli elementi vicini **si spostano per fare spazio**, poi il nuovo elemento entra con dissolvenza e scala crescente.
- [R] Wago (linee guida aziendali di micro-animazioni): movimento **più** colore per mostrare dove è stato aggiunto un elemento.
- [R] consiglio tecnico (dev.to): un elemento inserito già nello stato finale non ha nulla da animare, serve un secondo passo (aggiungere la classe dopo l'inserimento).
- [L] Rauno: aggiungere/togliere voci di lista = «poca o nessuna animazione» (frequente).
- [D] Le fonti non sono d'accordo sul peso dell'animazione: la durata consigliata sta tra 150 e 300 ms (fonte Wikimedia/riassunto) ma per azioni ripetute Rauno ed Emil dicono di togliere l'animazione. Va deciso con una prova sul telefono.

### D5. Riordinare le tappe (trascinamento) e dimensione dei bersagli
- [L] WCAG 2.2, SC 2.5.7 **Dragging Movements (livello AA)** https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html : ogni funzione che richiede un trascinamento deve poter essere fatta **con un solo tocco/click, senza trascinare**; esempio proprio per liste: toccare una voce e far comparire controlli su/giù. Il trascinamento può restare, purché ci sia l'alternativa.
- [L] WCAG 2.2, SC 2.5.8 **Target Size (Minimum), AA** https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html : bersagli di almeno **24x24 pixel CSS** (o spaziati in modo equivalente).
- [R] https://api.flutter.dev/flutter/material/ReorderableListView-class.html : nel Material per Flutter, su telefono il riordino parte con **pressione lunga ovunque sulla riga** (nessuna maniglia), sul computer c'è una maniglia; [R] Scott Logic: iniziare al tocco in conflitto con lo scorrimento.
- [R] https://aurora.iterable.com/latest/patterns/drag-and-drop-3IQvRMP0 (sistema di design di Iterable): maniglia a sinistra per far capire che si può trascinare; le righe vicine scorrono per riempire lo spazio; rilasciata, la voce «si posa» e prende il fuoco; per liste lunghe, pulsanti «sposta in cima/in fondo».
- [R] https://www.saasui.design/blog/saas-drag-and-drop-reordering-ux-patterns : l'indicatore di rilascio deve essere preciso; aggiornamento ottimistico, percorso da tastiera e annulla.

### D6. Barra di ricerca che si apre da un'icona
- [L] Apple HIG «Search fields» (JSON https://developer.apple.com/tutorials/data/design/human-interface-guidelines/search-fields.json ): un pulsante di ricerca nella barra «**si anima fino a diventare un campo di ricerca**» al tocco; in basso il campo compare sopra la tastiera; su iPhone «metti la ricerca in basso se c'è spazio»; mostrare le ricerche recenti prima di scrivere e i suggerimenti mentre si scrive; segnaposto che dice cosa si cerca; ambiti (scope) da più largo a più stretto.
- [L] Material (https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/Search.md ): *SearchBar* persistente in alto, *SearchView* a tutto schermo; la barra **si espande nella vista a tutto schermo** e torna indietro in automatico; dentro: cronologia all'apertura, suggerimenti mentre scrivi, risultati all'invio; descrizioni per lettori di schermo.
- [R] Baymard (https://Baymard.com/blog/mobile-search-submit-button , riassunto): nel loro studio il **35%** dei siti mobili di e-commerce nasconde il campo dietro un'icona; senza tasto di invio i tester fraintendevano l'icona. Un dato di Moovweb (VentureBeat) dice che nascondere la barra riduce a metà l'uso: fornitore, **non verificato**.
- [R] NN/g non ha un articolo specifico che confronti icona e campo visibile (cercato; trovato solo quello sulla navigazione nascosta, scoperta -20% secondo Smart Insights: estrapolazione, non per la ricerca).

### D7. Numeri che cambiano (contatori)
- [L] MDN `font-variant-numeric` https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric : `tabular-nums` rende le cifre della stessa larghezza (cifre allineate nelle tabelle); l'effetto dipende dal carattere (se non ha le cifre tabulari non fa nulla). Che serva a non far «ballare» i numeri che cambiano è una pratica comune, **non scritta dalla pagina**.
- [R] Cruip, Framer, Tabler (fornitori di componenti): contatore solo per dati importanti, una volta sola alla comparsa, brevi; durata predefinita di Tabler **2 s**; con «riduci movimento» mostrare subito il valore finale. **Nessuna ricerca sui tempi di un conteggio** (vedi NON TROVATO).

### D8. Che il movimento serva a qualcosa; eccessi
- [L] NN/g (articolo sullo scopo delle animazioni, vedi D3): usi utili = attirare l'attenzione, dare feedback, aiutare a capire un cambio di stato, mostrare relazioni/gerarchie (zoom/scorrimento). Cautele: «Animation in UX must be unobtrusive, brief, and subtle.»; non decorazione né riempitivo dell'attesa; più animazioni insieme **si indeboliscono a vicenda**; usare il movimento per catturare l'attenzione o creare paura di perdere qualcosa è un modello ingannevole.
- [L] NN/g, articolo sulle microinterazioni https://www.nngroup.com/articles/microinteractions/ : coppia trigger-feedback; devono avere uno scopo chiaro e non essere decorative; brevi e sottili; in sintonia col tono del marchio; niente linee guida sui tempi.
- [L] Apple HIG «Motion» (JSON https://developer.apple.com/tutorials/data/design/human-interface-guidelines/motion.json ): «aggiungi movimento con uno scopo»; animazioni gratuite o eccessive possono distrarre o dare disagio fisico; **«rendi il movimento facoltativo»** (non è l'unico modo per dare informazioni importanti; aggiungi vibrazione/audio); il feedback deve essere breve e preciso; lascia annullare le animazioni invece di far aspettare. La pagina **non** ha una sezione esplicita «Reduce Motion».
- [R] Studio sul parallasse (riassunto da ricerca; le pagine non le ho aperte; il primo è un articolo del Journal of Usability Studies): in un test con 86 persone, 2 su 43 nel gruppo con parallasse hanno avuto nausea e problemi gravi; una tesi della Purdue ha trovato che il parallasse era giudicato «più divertente» ma **non migliorava l'esperienza**; uno studio con tracciamento oculare ha trovato un compito svolto in circa metà tempo su un negozio con parallasse. Evidenza mista. [R] https://uxpajournal.org/wp-content/uploads/sites/7/pdf/JUS_Frederick_Feb2015.pdf , https://docs.lib.purdue.edu/dissertations/AAI1544322
- [R] NN/g «What Parallax Lacks»: titolo e riassunto da elenco (pagina non aperta): parallasse = interesse visivo ma spesso problemi di caricamento lento e leggibilità.

### D9. «Riduci movimento» (prefers-reduced-motion)
- [L] MDN https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion : valori `no-preference` / `reduce`; i disturbi vestibolari possono essere scatenati da animazioni che muovono molto lo schermo (es. ingrandire o spostare grandi oggetti); esempio: tenere l'animazione di base e **sostituirla dentro `reduce` con una dissolvenza**; l'impostazione si attiva da sistema («Reduce motion» su macOS, «Remove animations» su Android 9+).
- [L] web.dev https://web.dev/articles/prefers-reduced-motion : preferisce l'**opt-in** (mettere il movimento dentro `no-preference`, così lo hanno solo gli utenti che non hanno chiesto altro e i browser che non conoscono la query); da togliere: parallasse, zoom, sfondi animati, video in automatico, animazioni di apparizione a sorpresa; obiettivo «tutto il movimento non essenziale»; cita il supporto (Chrome 74, Edge 79, Firefox 63, Safari 10.1); nessuna statistica.
- [L] Josh Comeau (https://www.joshwcomeau.com/react/prefers-reduced-motion/ ): scrivere il CSS **senza animazioni di base** e aggiungerle in `no-preference`; le dissolvenze sono sicure per tutti; diffida della regola globale «togli tutte le transizioni»; per le animazioni fatte in JavaScript serve l'ascolto del cambio; prova da Chrome DevTools («Emulate CSS prefers-reduced-motion»); cita una stima di fino al 35% degli adulti USA oltre i 40 anni con qualche disfunzione vestibolare (stima riportata da lui, non verificata).
- [L] Smashing Magazine https://www.smashingmagazine.com/2023/11/creating-accessible-ui-animations/ : tre gruppi: **colore/opacità/comparsa istantanea = restano**; **movimento non essenziale = si toglie** (oggetti grandi oltre un terzo dello schermo o che percorrono molto, autoplay/cicli, parallasse, lampeggi, zoom/scala/sfocature, illustrazioni animate); **movimento essenziale = si addolcisce** (rallentato, senza scala, durata limitata a 5 s per l'indicatore di caricamento).
- [L] WCAG 2.2 SC 2.3.3 **Animation from Interactions (livello AAA)** https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html : l'animazione di movimento attivata dall'interazione deve poter essere disattivata, salvo se essenziale; **colore, sfocatura e opacità non contano** se non cambiano dimensione/forma/posizione; muovere nuovo contenuto in vista è essenziale; tecniche C39 (CSS) e SCR40 (JavaScript) con `prefers-reduced-motion`; il parallasse è citato come caso tipico.
- [L] A List Apart «Designing Safer Web Animation for Motion Sensitivity» https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/ : più a rischio = grandi spostamenti rispetto allo schermo, **parallasse e scrolljacking**, movimento in direzione opposta allo scorrimento, zoom con grande distanza percepita, caroselli automatici senza controlli; più sicuro = opacità, colore, sfocatura, movimento piccolo e contenuto; raccomandazioni: scopo per ogni elemento, avviso prima di grandi movimenti, interruttore generale per ridurre il movimento. Dato: circa 8 milioni di adulti USA con problemi cronici di equilibrio (vestibular.org, riportato dall'articolo).

### D10. Cosa ne deduco [D]
- Un'interfaccia «da premio» non è fatta di tanto movimento: le fonti più forti (NN/g, HIG, Emil, Rauno) dicono **poco, breve, con scopo, e meno ancora per le azioni ripetute**.
- Un compositore ha azioni ripetute (aggiungere/spostare tappe): è il posto dove l'effetto «wow» va **sulle poche azioni rare** (salvataggio, apertura, condivisione, primo ingresso), non su ogni tocco.
- I numeri sicuri per partire (da provare sul telefono): feedback ~100 ms, fogli e cambi di schermata 200-300 ms, ease-out in entrata/ease-in in uscita; con «riduci movimento»: solo dissolvenze/colore.

---

## E. Itinerari giorno per giorno nei siti editoriali

### E1. Mr & Mrs Smith, «48 Hours in… Naples» (01/07/2026, Lucrezia Worthington)
- [L] https://www.mrandmrssmith.com/editorial/travel-guides/48-hours-in-naples : organizzato in **blocchi con nome** (Friday evening, Saturday morning/afternoon/evening, Sunday morning/afternoon/evening), ognuno con un elenco di tappe; quasi nessuna durata per tappa; **spostamenti scritti nel testo** («cammina 15 minuti a nord…», «prendi la funicolare da Via Toledo a Vomero»); taxi fisso dall'aeroporto circa 23 euro; consigli pratici nel punto giusto (prenotare alle 11 un locale che accetta solo prenotazioni del giorno stesso; Certosa di San Martino gratis la domenica). Interessante per noi: è su **Napoli**.

### E2. Time Out
- [L] https://www.timeout.com/newyork/things-to-do/how-to-spend-12-hours-in-new-york : «12 hours in New York», **un orario per ogni tappa** (10am, 12pm, 2pm, 4pm, 6pm, 8pm, 10pm), foto con credito, paragrafo, link «Read more»; **nessuna distanza né linea di metro**; un solo indirizzo nel testo; **nessuna mappa**.
- [L] https://www.timeout.com/paris/en/things-to-do/paris-in-48-hours : tre giorni con intestazioni per fascia («Saturday lunch», «Sunday afternoon»), non ore; locali in grassetto con link; tappe non numerate; spostamenti scritti nel testo; nessuna mappa; messaggi pubblicitari e iscrizione a newsletter in mezzo.
- [L] https://www.timeout.com/hong-kong/things-to-do/your-one-day-itinerary-to-hong-kong : voci con **fascia oraria nel titolo** («7am-10am», «6pm-7pm»), riga con categoria e quartiere, tag «Recommended», foto, paragrafo, link «Book online»; lo spostamento è a volte **una voce a sé con orario** («12.30pm-1pm: Take the Star Ferry to Kowloon»); nessun tempo di percorrenza; nessuna mappa; pubblicità in mezzo.

### E3. Lisbon Tourism, «One day in Lisbon»
- [L] https://www.lisbontourism.org/one-day-in-lisbon/ : **dalle 8:30 alle 21:30, 14 voci con orario**; per alcune tappe la **durata** («75-90 minuti», «60-75 minuti»); **tempi di cammino e tram scritti per ogni spostamento** («circa 8 minuti a piedi», «tram 15E 25-30 minuti», «12 minuti lungo il fiume»); alternative («Belém Tower *o* Monument to the Discoveries, scegline una»); consiglio pratico (carta giornaliera); la logica del giorno in una frase: «Start at the top, end at sunset.» Nessuna mappa. È il più simile a ciò che fa il nostro compositore, ma a mano.

### E4. Monocle
- [L] https://monocle.com/travel/one-day-in-paris-itinerary/ : **11 tappe numerate**, ciascuna con titolo-azione («Swim at Piscine Pontoise») e un paragrafo di circa 30-60 parole, illustrazione; **nessun orario, nessuna indicazione di spostamento, nessuna mappa**; l'ordine è «all'incirca» cronologico.
- [L] https://monocle.com/travel/how-monocle-writes-city-travel-guides/ : categorie (dormire, mangiare, comprare, vedere), autori che conoscono la città da tempo, scelte lontane dai luoghi pieni di turisti, **ogni guida ha una mappa scaricabile** e viene aggiornata spesso; nessuna regola dichiarata sulle distanze a piedi.
- [R] https://monocle.com/travel-guides/london/ e tokyo/ : consigli di organizzare i giorni per quartiere e andare a piedi («pensa a Londra come a un insieme di villaggi»).

### E5. Lonely Planet
- [R] https://www.lonelyplanet.com/articles/best-naples-amalfi-coast-itineraries : tre itinerari per durata (3, 7, 9, 10 giorni), con «due giorni a Napoli»; la pagina aperta direttamente mostrava solo il menù. Struttura interna **non letta**.

### E6. NYT «36 Hours» e Condé Nast Traveler
- NON TROVATO: nytimes.com e cntraveler.com non sono accessibili agli strumenti dell'agente (errore di dominio non consentito); non ho potuto leggere né la struttura delle «36 Hours» né un itinerario di Condé Nast Traveler. Provato: ricerca con filtro dominio, WebFetch diretto su nytimes.com/spotlight/36-hours, ricerca generica.
- [R] https://www.italiani.it/the-new-york-times-celebrates-naples/ e https://www.dissapore.com/ristoranti/napoli-pizzerie-trattorie-e-locali-da-provare-per-il-new-york-times/ : esistono le «36 Hours in Naples» del New York Times (Laura Rysman; una precedente è del 2013, secondo Dissapore); questi articoli parlano solo dei luoghi, non della struttura.

### E7. Cosa ne deduco [D]
- Gli editoriali scelgono **o** gli orari esatti (Time Out NY, Hong Kong, Lisbona) **o** le fasce (Smith, Time Out Parigi) **o** niente orari (Monocle). Tutti **tranne Lisbona** lasciano gli spostamenti ai paragrafi; **nessuno ha una mappa nella pagina** (Monocle ne offre una scaricabile a parte).
- Lisbona è l'unico che dà **durata per tappa + minuti di cammino per ogni passaggio + alternative + una frase di logica per il giorno**: sono le informazioni che il nostro compositore calcola da solo. Un compositore può quindi fare meglio degli editoriali con ciò che già ha (tempi, mappa), mantenendo il tono di una guida («Start at the top, end at sunset»).
- Nessun editoriale letto usa una linea del tempo grafica: l'impaginazione è sempre un elenco con intestazioni di tempo e foto. La linea del tempo vera si trova nelle app (Polarsteps, A6) e nel «Timeline Selection Menu» di un sito premiato (C1, n. 11).

---

## F. I punti che contano per il nostro compositore (10-15)
1. **Tempo e distanza tra le tappe, e totale del giorno sotto il titolo del giorno**, è il dettaglio di Wanderlog letto nella sua FAQ (https://wanderlog.com/blog/faq); con il modo di spostamento cambiabile tappa per tappa. È il nostro «tratto a piedi», va in primo piano.
2. **Elenco + mappa su telefono = foglio non modale con 2-3 altezze sopra la mappa**, con maniglia che cambia altezza al tocco (Apple HIG Sheets; Material BottomSheet «standard», senza velo, altezza di riposo = «peek»). NN/g avverte: tasto di chiusura visibile, non usarlo per il percorso principale. Wanderlog fa la mappa a tutto schermo trascinando il pannello (iMore).
3. **Un giorno alla volta sulla mappa, con colore proprio e marcatori numerati** (Wanderlog: si spunta il giorno; TRAVAA/Tripbook in modo debole, [R]).
4. **Aggiungere una tappa**: Wanderlog tiene «Add a place» **in fondo all'elenco del giorno** e un assistente che mette anche i luoghi in mappa con un tocco per salvarli (screensdesign); Google Trips (2016) faceva scegliere mattina/pomeriggio/giorno intero e riempiva il resto; **Mindtrip ha ricevuto la critica di un utente: nell'elenco solo valutazione, foto e titolo, senza poter aprire il dettaglio**. Per noi: suggerimenti con abbastanza informazioni (orario, tempo a piedi) e ordinati per vicinanza [D].
5. **Conferma del salvataggio**: nessuna delle app lette descrive un messaggio; le linee guida dicono come farlo bene: messaggio breve vicino al comando, con «Annulla» (Material Snackbar), aggiornamento subito e ritorno indietro solo se fallisce (Rauno). Il pannello di Google Maps con il selettore di lista è il modello più chiaro per «dove va a finire».
6. **Riordinare per trascinamento ma con alternativa a un tocco** (WCAG 2.5.7, livello AA: ad esempio pulsanti su/giù) e bersagli di almeno 24x24 px (WCAG 2.5.8); su telefono il trascinamento parte con pressione lunga (Material per Flutter, [R]).
7. **Durate**: feedback ~100 ms; fogli e cambi schermata 200-300 ms; mai oltre 400; ingresso un po' più lungo dell'uscita; ease-out in entrata, ease-in in uscita (NN/g animation-duration); token Material: 50/100/150/200/250-400 ms; curva standard `cubic-bezier(0.2, 0, 0, 1)`.
8. **Poco movimento sulle azioni che si ripetono** (aggiungere, spostare, togliere tappe): Emil Kowalski e Rauno dicono di togliere o ridurre quasi tutto; l'effetto «wow» va sulle azioni rare (salva, condividi, apertura). Emil Kowalski indica come dettaglio concreto il pulsante che si «schiaccia» a `scale(0.97)` mentre lo premi.
9. **«Riduci movimento»**: usare `no-preference` come regola (web.dev, Josh Comeau); con «riduci» restano dissolvenza e colore, si tolgono parallasse, zoom, spostamenti grandi, cicli (Smashing, A List Apart, WCAG 2.3.3 AAA). Apple HIG: «rendi il movimento facoltativo».
10. **Hover, cursore e pulsanti «magnetici» non servono sul telefono** (MDN `hover`; Rauno: stati hover solo con `(hover: hover)`); le tecniche dei siti premiati (GSAP/Lenis, WebGL, video d'apertura, transizioni zoom) vanno bene per la home, con il costo di prestazioni dichiarato da chi le fa (Unseen, Hon Tran: animare solo transform/opacity, texture compresse).
11. **I siti premiati recenti sono quasi tutti Menzioni d'onore, non «Sito del giorno»** (elenco Awwwards travel/travel-tourism al 08/10/2026): l'ultimo «Sito del giorno» di viaggio è Travel Next Level, 27/12/2024; punteggio di accessibilità 6,20 su 10 nella sua scheda. [D] L'accessibilità sembra lo spazio dove un sito piccolo può distinguersi (Lithuania Travel ha in vista i controlli di lettura; letto nel testo della sua home).
12. **L'itinerario si riapre durante il viaggio**: Airbnb lo descrive come «living itinerary» perché lo si controlla spesso per codici e indicazioni (It's Nice That); Mindtrip e Wanderlog puntano sull'uso offline. Per noi: la vista del giorno deve essere leggibile a colpo d'occhio e funzionare senza rete [D].
13. **Negli editoriali l'itinerario è un elenco con intestazioni di tempo**; solo Lisbona dà durata + minuti a piedi + alternativa + frase di logica del giorno; nessuno ha una mappa nella pagina. Il nostro compositore può superarli con ciò che già calcola; la frase «Start at the top, end at sunset» è un buon modello di riga-guida per il giorno [D].
14. **Ricerca di tappe**: Apple e Material fanno «animare l'icona in campo di ricerca» (HIG: pulsante che diventa campo; Material: SearchBar → SearchView a schermo intero con cronologia e suggerimenti). Baymard (debole): nascondere il campo dietro l'icona confonde se non c'è un tasto di invio.
15. **Tempi di risposta**: sotto 0,1 s sembra istantaneo, entro 1 s il flusso non si interrompe, oltre serve un indicatore (NN/g). Il calcolo dei tratti a piedi deve restare sotto questi limiti o mostrare l'avanzamento.

---

## NON TROVATO (cosa manca e cosa ho provato)
- **Mindtrip: vista del giorno, cambio giorno, aggiunta di una tappa nei dettagli.** Provato: ricerca web, App Store, mindtrip.ai/ios (redirect all'App Store), mindtrip.ai. Nessuna analisi di design trovata.
- **Pagina di aiuto attuale di Google Travel «Trips».** Provato: due ricerche; trovati solo il post del 2016 e articoli sulla chiusura del 2019.
- **Articolo Apple iOS 27 sulle guide** e conferma ufficiale dell'ordinamento per distanza. Provato: support.apple.com (pagina con solo indice), pagina iOS 15 (senza ordinamento), Tom's Guide (troncata).
- **Durata e curva dell'animazione del cuore di Airbnb**, e qualsiasi dato su come Airbnb conferma il salvataggio. Provato: aiuto Airbnb, newsroom, It's Nice That, ricerche su Lottie.
- **NYT «36 Hours» e Condé Nast Traveler**: domini non accessibili agli strumenti (vedi E6). Provato: ricerca con filtro di dominio, WebFetch, ricerca generica.
- **Kinfolk**: non cercato in modo mirato oltre la ricerca iniziale (nessun risultato utile per itinerari). Provato: nessuna pagina letta.
- **Lonely Planet: struttura interna di un itinerario**: la pagina letta mostrava solo il menù. Provato: WebFetch su best-naples-amalfi-coast-itineraries; ricerca con filtro dominio (elenco di titoli).
- **CSS Design Awards e FWA per categoria viaggio/turismo**: /websites/travel dà 404; nessun vincitore viaggio 2025-2026 trovato (una ricerca generica ha mostrato solo la storia dell'FWA e un premio 2023 di un'agenzia).
- **Case study scritti del movimento dei siti Awwwards di viaggio recenti** (2025-2026): Codrops 403; Niarra Travel: nessun case study scritto trovato (cercato); solo tag e punteggi.
- **Studio con numeri su contatori che cambiano o su animazioni di salvataggio**: cercato due volte, trovati solo fornitori di componenti e blog.
- **NN/g «Search: Visible and Simple»** e l'articolo «What Parallax Lacks» (testo): non aperti; trovati solo titoli/riassunti.
- **Cosa fa davvero il movimento dei siti premiati** (curve, durate, comportamento al tocco): non leggibile dal testo; serve un browser vero (vedi C3).

## Da verificare
- Il peso delle fonti [R]: Polarsteps (design e Liquid Glass), Stippl, Atlas Obscura, TRAVAA/Tripbook, Layla (Trustpilot), Tripadvisor (blog), Flutter/Iterable/SaaSUI, Wikimedia, Microsoft (documentazione vecchia), Baymard/Moovweb, Cruip/Framer/Tabler: tutte lette solo come riassunto di ricerca o fornitori di componenti.
- Il dato «61% dei Siti del giorno del Q1 2026 sono siti 3D» (digitalstrategyforce.com): non verificato su Awwwards.
- Il dato «35% degli adulti USA oltre i 40 anni con disfunzione vestibolare» (Josh Comeau) e «8 milioni di adulti con problemi di equilibrio» (A List Apart): riportati da loro, non controllati alla fonte.
- Le note di versione di Wanderlog 2.223 «Sep 30» (App Store): l'anno non era indicato nel riassunto; confermare che sia il 2026 prima di citarlo.
- Il «tempo totale del giorno» e l'«ottimizza percorso fino a 15 luoghi» di Wanderlog vengono dalla FAQ del sito ufficiale (letto il 08/10/2026): le versioni dell'app possono cambiare; l'ottimizzazione è a pagamento secondo iMore (Pro) e Stippl (Premium, fonte di parte).
- Citymapper: gli ingrandimenti della mappa basati sulle distanze a piedi e i colori attenuati vengono da un riassunto di ricerca di una pagina (anthonyhobday.com) che ora dà 404.
- Material 3: i token di durata/curva sono letti dal documento Android su GitHub (`Motion.md`), non dal sito m3.material.io (non leggibile dallo strumento). Le curve «emphasized» sono percorsi, non una cubic-bezier sola.
- Apple HIG: le linee guida sono state lette dal file JSON pubblico di developer.apple.com (stessa fonte della pagina); il testo non contiene un paragrafo «Reduce Motion» ma parla di movimento facoltativo.
- Awwwards: le date/menzioni sono quelle mostrate nelle pagine il 08/10/2026; le pagine degli elementi (inspiration) possono non riportare premi anche se il sito li ha.
