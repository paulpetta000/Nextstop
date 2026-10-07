# Fase 2 · Il compositore nuovo

_Bozza dell'08/10/2026, **da approvare da Enrico**. Ramo di lavoro: `compositore` (nato da `racconto-due-giorni`, che ha la lista di Enrico del 07/10/2026).
Ricerche fatte per questa specifica: `ricerca/2026-10-08-filtri-locali.md`, `ricerca/2026-10-08-mappa.md`._

Il compositore è la pagina `/napoli/itinerari/`. Deve far dire «wow, ci hanno speso tanto» (Enrico, 07/10/2026).
**Restano** dati e calcoli: tappe, tempi tra le tappe, orari veri dei bus, avvisi, «riordina», link condivisi, `?pronto=` e `?aggiungi=`.
**Si rifà** tutto quello che si vede e si tocca.

## Il problema di chi visita, pezzo per pezzo
| Pezzo | Oggi | Il problema | Perché non basta ritoccare |
|---|---|---|---|
| **Pagina e barra di navigazione** | Intestazione con nome, «I miei itinerari», «Condividi»; schede dei giorni; elenco e mappa uno sotto l'altro | Sembra un modulo da compilare, non un sito di viaggio curato; con 3 giorni e la mappa non si capisce dove sei | Manca un'idea di pagina: va ripensata insieme, poi gli altri pezzi ci entrano dentro |
| **Scheda della tappa** | Tocchi la tappa, compare una fila «Su · Giù · Scheda · Togli» | Ogni azione costa due tocchi; i bottoni sembrano un pannello di controllo | Le azioni vanno ripensate (trascinare, scorrere, menu), non solo ridisegnate |
| **Barra di ricerca** | Dentro «Aggiungi una tappa», solo «In città»; cerca nel nome e nella zona | Chi scrive «Cristo velato», «pizza» o «panorama» non trova niente; i locali e le gite non si cercano | Serve cercare anche in parole che non sono nel nome (opere, piatti, generi) |
| **Salvare e rileggere** | L'itinerario si salva da solo sul telefono, senza dirlo; si vede un giorno alla volta | «È salvato? Dove lo ritrovo domani?»; la sera prima non c'è un modo per rileggerlo tutto | Salvare deve diventare un gesto visibile, con una vista «tutto l'itinerario» |
| **Visitato / da visitare** | «Fatto» solo se il giorno è oggi (calcolo dal vivo) | In giro non puoi spuntare una tappa se il giorno non ha data; la sera non vedi cosa hai visto | Va su ogni tappa degli itinerari salvati, pronti e tuoi |
| **Mappa** | Mappa nostra in SVG, solo strade grandi | Non si riconoscono i vicoli e le scale dove si cammina davvero | Servono molte più strade, e forse un altro modo di disegnarla (sotto) |
| **Mangiare dentro il compositore** | Scheda «Mangiare» nel pannello, minuti dall'**ultima** tappa | A mezzogiorno chi compone deve capire da solo dove sarà alle 13 e cosa c'è vicino | Serve una proposta all'ora giusta, nel punto giusto della giornata |
| **Filtri dei locali** | «Carne» mostra ogni posto con la carne nel menu | Chi cerca una braceria trova pizzerie | Cambia il significato del dato, non solo il filtro (sotto) |

## Le scelte

### 1. Pagina e barra di navigazione
- Telefono per primo: la giornata è il centro; giorni, «elenco o mappa», «Aggiungi», «I miei itinerari» e «Condividi» sempre a portata di pollice.
- La «barra di navigazione» è la barra **del compositore** (giorni, elenco/mappa, aggiungi, salva) (Enrico, 08/10/2026). Il menu del sito con le tre linee resta quello della Fase 1.
- Le 4 proposte coprono anche il computer: giornata a sinistra, mappa fissa a destra.

### 2. Scheda della tappa
- Un tocco apre la **scheda** (foto, orari, prezzo, storia, fonti). Spostare e togliere diventano gesti diretti: trascinare (c'è già, con la maniglia) e un'azione «Togli» sempre raggiungibile, con «Annulla».
- Le frecce da tastiera sulla maniglia restano (accessibilità). «Su» e «Giù» possono sparire dalla vista, non dalla tastiera e dai lettori di schermo.
- Il tratto tra due tappe (a piedi, metro, funicolare, bus, con i minuti) resta visibile: è la cosa che ci distingue.

### 3. Barra di ricerca
- Una ricerca sola per **tappe, locali e gite**, con i risultati divisi in gruppi («Da vedere», «Da mangiare», «Gite»).
- Cerca anche in **parole chiave** scritte da noi per ogni tappa e ogni locale (opere, piatti, soprannomi: «Cristo velato» → Cappella Sansevero; «sfogliatella» → le pasticcerie che la hanno nel menu). Senza accenti e con piccoli errori di battitura.
- Le parole chiave sono dati (`tappe.yaml`, `locali.yaml`): ognuna deve trovarsi nella scheda o nel menu del luogo (la build lo controlla, come per gli orari).
- Si apre con un'animazione breve; i risultati entrano uno dopo l'altro (Fase 1, «Movimento»).

### 4. Salvare e rileggere
- **«Salva»** diventa un pulsante visibile. Salvare vuol dire: l'itinerario ha un nome ed entra in «I miei itinerari».
- **Rete di sicurezza**: anche prima di «Salva» il lavoro non si perde (resta sul telefono come oggi), ma si vede scritto «Non ancora salvato».
- Dopo il salvataggio si apre la **vista «tutto l'itinerario»**: tutti i giorni uno sotto l'altro, da leggere come una pagina (orari, tratti, dove mangiare), con «Modifica» per tornare a comporre.
- Un itinerario pronto aperto dalla home è una bozza finché non lo salvi.
- Gli itinerari già sul telefono (salvati prima di oggi) diventano **salvati**: nessuno perde niente.
- «Salva» salva **subito**, con un **nome proposto** («Napoli, 12–14 ottobre» se c'è la data, altrimenti «Napoli in 2 giorni»); il nome si cambia con un tocco (Enrico, 08/10/2026).

### 5. Visitato / da visitare
- Su **ogni tappa** di un itinerario salvato (pronto o tuo): «Da visitare» → tocco → «Visitato», con una piccola animazione nello stile del marchio (la soglia che si chiude). Si torna indietro con un altro tocco.
- Se il giorno è **oggi** si ricalcolano gli orari da adesso (come fa oggi «Fatto»); negli altri casi la tappa si segna e basta, gli orari non cambiano.
- Nella vista «tutto l'itinerario»: «3 tappe visitate su 15».
- Resta solo sul telefono (non va nel link condiviso), come oggi. Nei dati il campo `fatte` resta con questo nome: cambia solo la parola sulla pagina.
- Con «riduci movimento» l'animazione diventa una dissolvenza.

### 6. Mappa
**In sospeso** (Enrico, 08/10/2026): decide più avanti. Vuole capire cosa cambia togliendo l'uso senza rete, e se così si può usare una mappa più completa di OpenStreetMap.

- **Senza la mappa offline** si perde solo la mappa: elenco, tempi e schede restano salvati sul telefono (service worker).
- **Mappe complete, solo con la rete e dopo un tocco** (l'indirizzo IP va al servizio, lo dice la pagina Privacy):
  - **OpenStreetMap** (riquadri immagine): gratis, senza chiave; aspetto e colori loro, niente tema scuro; servizio «senza garanzie», può bloccare i siti che lo usano troppo.
  - **CARTO** (riquadri immagine o vettoriali): stili chiaro (Positron) e scuro (Dark Matter); chiave obbligatoria; gratis fino a 1 milione di richieste al mese per uso commerciale.
  - **OpenFreeMap** (vettoriale): gratis, uso commerciale permesso, senza chiave e senza cookie; colori nostri, chiaro e scuro; ma serve MapLibre (pacchetto nuovo).
  - I riquadri immagine si possono mostrare senza pacchetti (da provare), ricalcolando tappe e percorsi nella proiezione delle mappe web.
- **Strada ibrida**: la mappa nostra sempre (anche senza rete) e, con la rete, «Mappa dettagliata» con un tocco. Non si perde niente; costa più lavoro.

Ricerca: `ricerca/2026-10-08-mappa.md`. Le tre strade, con l'uso senza rete:

| | **A · più strade nella mappa nostra** | B · mappa vettoriale nostra (PMTiles + MapLibre) | C · riquadri di un servizio esterno |
|---|---|---|---|
| Privacy | nessuna richiesta fuori dal sito | nessuna richiesta fuori dal sito | l'indirizzo IP va al servizio: solo dopo un tocco, con avviso |
| Senza rete | sì, come oggi | sì, se il file si salva | OpenStreetMap lo **vieta**; gli altri non lo dicono o solo a pagamento |
| Pacchetti nuovi | **no** | sì (MapLibre, da far approvare) | sì per i vettoriali |
| Peso | da misurare (oggi 123 KB) | da misurare (pochi MB o decine di MB) + la libreria | poco per noi |
| Lavoro | medio | alto (stili chiaro e scuro, caratteri, icone) | basso, ma avviso, attribuzione, chiave |

- **Se si tiene la mappa senza rete, consiglio A.** Aggiungiamo dalle stesse fonti di OpenStreetMap le vie residenziali, i vicoli, le pedonali, i passaggi pedonali e le **scale** (`residential`, `living_street`, `pedestrian`, `footway`, `steps`), con i nomi delle vie più grandi. Niente pacchetti, niente servizi esterni, funziona senza rete.
- Per non appesantire la prima apertura: le strade piccole si caricano **a pezzi**, solo nella zona che stai guardando e solo quando ingrandisci (pezzi di mappa nostri, serviti dal sito).
- **Prima cosa da fare**: misurare il peso delle strade nuove per Napoli. Se è troppo, o se nelle 4 proposte la mappa non fa «wow», si passa a **B** (con l'OK di Enrico per MapLibre e un controllo di un minuto: Vercel deve rispondere «206» alle richieste a pezzi).
- **C no**: i riquadri di OpenStreetMap non si possono salvare per l'uso senza rete; gli altri servizi gratuiti sono solo per uso non commerciale o chiedono una chiave. Se un giorno servisse, il più vicino alle nostre regole è OpenFreeMap (gratis, uso commerciale permesso, senza chiave e senza cookie; passa da Cloudflare).
- Gesti: un dito scorre la pagina, due dita spostano e ingrandiscono la mappa (o la mappa a schermo intero con un tocco); «Dove sono» con la posizione solo dopo un tocco, come oggi.
- **Sempre**: «© OpenStreetMap» visibile sulla mappa (licenza ODbL).

### 7. Mangiare dentro il compositore
- **Problema** (regola di `CLAUDE.md`): chi compone una giornata dalle 9:30 alle 19 a mezzogiorno è in mezzo alle tappe; oggi la scheda «Mangiare» calcola i minuti dall'**ultima** tappa della giornata, non da dove sarà all'ora di pranzo.
- **Cosa fa**: se la giornata attraversa l'ora di **pranzo** (12:30–14:30) o di **cena** (19:30–21:30) e non c'è già un locale in quell'ora, nella giornata compare una riga «Qui puoi fermarti a mangiare», nel punto giusto (dopo la tappa che finisce più vicino all'ora del pasto).
- Toccandola: i **locali vicini a dove sarai in quel momento** (minuti a piedi dalla tappa prima), **aperti a quell'ora** quel giorno, con i filtri. Scegli tu; niente si aggiunge da solo. «No, grazie» la nasconde per quel giorno.
- Luoghi e locali restano **separati** (Enrico, 07/10/2026): nel pannello «Aggiungi» restano le due schede, e la pagina «Dove mangiare» resta (per Google e per chi cerca solo un locale).
- Le ore di pranzo e cena sono una regola nostra, scritta nei testi della pagina («Da sapere»), non un fatto.

### 8. Filtri dei locali
Ricerca: `ricerca/2026-10-08-filtri-locali.md`. I siti seri tengono separati **tre livelli**: che locale è, che cucina fa, che piatti ha.
Google chiede una sola categoria principale e la regola «questa attività **È** un…, non **HA** un…»; TripAdvisor ha gruppi separati per categoria, cucina e piatti.
Il nostro campo `cucina` mescola tutto: oggi «Carne» mostra **11 locali** (anche pizzerie e trattorie), con il tipo di locale sarebbero **2** (Meatin, Macellegria).

- **Dato nuovo `tipo`** in `locali.yaml`: **uno solo** per locale (pizzeria, trattoria, ristorante di pesce, braceria, friggitoria, pasticceria e caffè). Più un `anche` facoltativo (al massimo uno), solo se il locale stesso lo dice (per esempio «pizzeria e trattoria»).
- **Fonte**: il tipo è quello con cui il locale si presenta (insegna, sito, scheda); la build controlla che ogni locale abbia il suo tipo. Con i dati di oggi i gruppi verrebbero circa: 10 pizzerie, 7 trattorie, 6 di pesce, 6 pasticcerie e caffè, 2 bracerie, 1 friggitoria: **da verificare locale per locale** prima di scriverli.
- I **piatti** restano il filtro «Cosa vuoi mangiare» (margherita, genovese, babà…): chi cerca la genovese la trova senza che il locale diventi «di carne». Il campo `cucina` resta come informazione nella scheda («nel menu anche pesce e carne»), non come filtro.
- **Come funzionano i filtri** (Baymard, Nielsen Norman Group): nello stesso gruppo le scelte si sommano («pizzeria **o** friggitoria»), tra gruppi diversi si restringono (pizzeria **e** €); accanto a ogni voce quanti locali ci sono; il totale sempre visibile; le voci a zero si vedono ma spente; i risultati cambiano subito, senza «Applica» (la pagina è veloce).
- Prezzo: le fasce in euro restano spiegate in una riga (€ fino a 15 euro, €€ da 15 a 35, €€€ oltre 35: regola nostra, nella pagina).
- Gli stessi filtri valgono nel compositore e nella pagina «Dove mangiare».
- **Diete** (vegetariano, senza glutine): non adesso. Se un giorno si fanno, solo «lo dichiara il locale», con la fonte; per il senza glutine l'unico controllo esterno trovato è il programma dell'AIC.
- Con 2 bracerie e 1 friggitoria il filtro è povero: **si cercano altri locali di questi tipi** (Enrico, 08/10/2026). Ricerche dell'08/10/2026: `ricerca/2026-10-08-locali-bracerie.md`, `ricerca/2026-10-08-locali-friggitorie.md`; i locali scelti entrano con le stesse regole dei 32 di oggi (orari scritti dal locale, fonti, tempi ricalcolati).

## Come si lavora: 4 proposte per pezzo
- Un pezzo alla volta, ognuno con **4 proposte molto diverse** (regola di Enrico, 07/10/2026), con i dati veri, in chiaro e in scuro, telefono (320 e 390 px) e computer.
  Pagine private su claude.ai da guardare sul telefono, con le animazioni vere. Enrico dice cosa va → 4 proposte nuove → fino alla scelta.
- **Ordine consigliato**: 1 pagina e barra → 2 scheda della tappa (con «visitato») → 3 ricerca → 4 salva e rileggi → 5 mappa → 6 mangiare nella giornata → 7 filtri dei locali (anche nella pagina «Dove mangiare»).
  Prima la pagina, perché gli altri pezzi ci vivono dentro.
- Le proposte partono da `DESIGN.md` (Rivista, marchio, portico) ma possono allontanarsene: all'inizio campo libero.
- Si costruisce un pezzo solo dopo la scelta di Enrico; ogni pezzo costruito ha i suoi test.

## Regole (oltre a quelle di `CLAUDE.md`)
- **Nessun dato perso**: gli itinerari già salvati sui telefoni (chiave `itinerari-v1`) e i link condivisi già mandati si aprono uguali.
- Nessun pacchetto nuovo senza l'OK di Enrico (vale anche per la mappa).
- Nessun servizio esterno e nessun cookie prima di un tocco; se la mappa ne usa uno, lo dice la pagina Privacy.
- Movimento: solo posizione e trasparenza, tra 150 e 400 ms; con «riduci movimento» fermo o in dissolvenza.
- Ogni parola chiave, tipo di locale e orario nasce da una fonte (regola «niente senza fonte»).
- I testi nuovi seguono `stile-testi`; si firmano con `npm run testi:firma`.

## Casi limite
- **Navigazione privata** o memoria piena: «Salva» non può salvare; lo diciamo e proponiamo «Condividi» (il link porta tutto).
- **Più di 50 itinerari** sul telefono: oggi si tengono i primi 50; «Salva» avvisa prima di arrivarci.
- **Due schede aperte** sullo stesso itinerario: vale l'ultima modifica (come oggi), senza perdere i «visitato».
- **Visitato su una tappa spostata** in un altro giorno: il segno la segue.
- **Pranzo dentro una visita lunga** (MANN, 2 ore e mezza): la proposta va dopo la visita, con l'ora vera.
- **Nessun locale aperto vicino** a quell'ora: lo diciamo e proponiamo i più vicini aperti, con i minuti.
- **Giorno di gita**, giorno «solo a piedi», giorno di regata (che ha già il suo tempo per il pranzo): niente proposta doppia.
- **Ricerca senza risultati**: proponiamo le tappe dello stesso genere e «Togli i filtri».
- **Tema scuro** e **320 px**: nessuno scorrimento di lato, mappa compresa.
- **Senza JavaScript**: il compositore non funziona (come oggi); la pagina lo dice e porta agli itinerari pronti e a «Dove mangiare».

## Controlli
- `npm test` verde (con test nuovi: salvataggio e vecchi itinerari, «visitato», ricerca con parole chiave, proposta del pranzo, filtri), build senza errori, `check:links` pulito.
- Prima dell'anteprima: axe in chiaro e scuro, Lighthouse su telefono 95 o più, 320 e 390 px, «riduci movimento», nessun errore in console.
- **consistent-ui almeno 35 su 40** (lista di Enrico, 07/10/2026) e ux-audit di VectorLab.
- Prova a mano su telefono: comporre 2 giorni, salvare, chiudere, riaprire, segnare «visitato», aprire un vecchio link condiviso.

## Compiti
- [ ] Enrico approva questa specifica (risposte alle domande date l'08/10/2026; mappa in sospeso).
- [ ] Ricerca di altre bracerie e friggitorie (08/10/2026), poi Enrico sceglie quali entrano.
- [ ] Pezzo 1 · pagina e barra: 4 proposte → scelta → costruzione.
- [ ] Pezzo 2 · scheda della tappa e «visitato»: 4 proposte → scelta → costruzione.
- [ ] Pezzo 3 · ricerca, con le parole chiave nei dati (ricerca con le fonti, agenti `ricercatore`).
- [ ] Pezzo 4 · «Salva» e vista «tutto l'itinerario».
- [ ] Pezzo 5 · mappa (dopo la decisione di Enrico: con o senza uso offline).
- [ ] Pezzo 6 · mangiare nella giornata.
- [ ] Pezzo 7 · filtri dei locali (dati nuovi con le fonti, poi compositore e «Dove mangiare»).
- [ ] Controlli, anteprima di Vercel, OK di Enrico, poi `main`.
