# Fase 2 · Il compositore nuovo

_Specifica dell'08/10/2026. **Approvata da Enrico l'08/10/2026**, con la mappa in sospeso (sezione 6). Ramo di lavoro: `compositore` (nato da `racconto-due-giorni`, che ha la lista di Enrico del 07/10/2026).
Ricerche fatte per questa specifica: `ricerca/2026-10-08-filtri-locali.md`, `ricerca/2026-10-08-mappa.md`.
**Aggiornata il 13/10/2026, da approvare**: pezzo «Salva» ridotto (sezione 4), pezzo nuovo «Da dove parti?» (sezione 10), pezzi rinumerati
(ramo `compositore-pagina`). Ricerche: `ricerca/2026-10-13-stima-tempi-partenza.md`, `ricerca/2026-10-13-da-dove-parti.md`._

Il compositore è la pagina `/napoli/itinerari/`. Deve far dire «wow, ci hanno speso tanto» (Enrico, 07/10/2026).
**Restano** dati e calcoli: tappe, tempi tra le tappe, orari veri dei bus, avvisi, «riordina», link condivisi, `?pronto=` e `?aggiungi=`.
**Si rifà** tutto quello che si vede e si tocca.

## Il problema di chi visita, pezzo per pezzo
| Pezzo | Oggi | Il problema | Perché non basta ritoccare |
|---|---|---|---|
| **Pagina e barra di navigazione** | Intestazione con nome, «I miei itinerari», «Condividi»; schede dei giorni; elenco e mappa uno sotto l'altro | Sembra un modulo da compilare, non un sito di viaggio curato; con 3 giorni e la mappa non si capisce dove sei | Manca un'idea di pagina: va ripensata insieme, poi gli altri pezzi ci entrano dentro |
| **Scheda della tappa** | Tocchi la tappa, compare una fila «Su · Giù · Scheda · Togli» | Ogni azione costa due tocchi; i bottoni sembrano un pannello di controllo | Le azioni vanno ripensate (trascinare, scorrere, menu), non solo ridisegnate |
| **Barra di ricerca** | Dentro «Aggiungi una tappa», solo «In città»; cerca nel nome e nella zona | Chi scrive «Cristo velato», «pizza» o «panorama» non trova niente; i locali e le gite non si cercano | Serve cercare anche in parole che non sono nel nome (opere, piatti, generi) |
| **Salvare e rileggere** | L'itinerario si salva da solo sul telefono, senza dirlo; si vede un giorno alla volta | «È salvato? Dove lo ritrovo domani?»; la sera prima non c'è un modo per rileggerlo tutto | Salvare deve diventare un gesto visibile (fatto nelle prove); per rileggere basta, al massimo, «Tutti i giorni» nel compositore (13/10/2026) |
| **Da dove parti?** (13/10/2026) | La giornata comincia dalla prima tappa alle 9:30, come se ci dormissi dentro | Non sai quanto ci metti dall'hotel alla prima tappa; l'«ordine più corto» tiene ferma la prima tappa, che spesso è solo la prima aggiunta | Senza sapere da dove parti l'ordine più corto non può scegliere la prima tappa: serve un dato nuovo, il punto di partenza |
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

**Piano delle parole chiave (13/10/2026). Rimandato da Enrico (13/10/2026)**: le parole chiave si scrivono quando si riscrivono i testi di tutte le tappe
(Fase 3, racconti) e le pagine degli itinerari pronti (mezza giornata, uno, due, tre giorni: una spiegazione perfetta di cosa si farà).
Fino ad allora la ricerca usa nomi, parole del sito e i testi di oggi. Due tipi di parole:
- **Parole del sito** (regola nostra, come le fasce di prezzo): sinonimi dei generi, delle cucine e dei piatti che abbiamo già
  («belvedere, vista» → panorami; «pizzeria» → pizza; «sfogliatelle, riccia, frolla» → sfogliatella). Un file solo
  (`src/data/sinonimi.yaml`), uguale per ogni città; non dicono niente di un luogo, quindi non servono fonti.
- **Parole di un luogo** (`parole:` in `tappe.yaml` e `locali.yaml`, al massimo 8): opere, persone, soprannomi, cose da vedere
  («Cristo velato», «Caravaggio», «Gambrinus»). **Ogni parola deve comparire in un testo con la fonte**: il testo della tappa o del
  locale, le sue schede, oppure una scheda nuova `tp-<id>-parole` / `lc-<id>-parole` in `fatti.yaml` (testo, stato, fonti, data).
  I piatti dei locali sono già dati con la fonte (il menu): non si ripetono.
- **Controllo nella build** (`src/lib/tappe.ts`, `src/lib/locali.ts`, come per gli orari): la parola, senza accenti e maiuscole,
  deve trovarsi in quei testi; se no la build si ferma («sansevero: "Cristo velato" non compare in nessuna scheda della tappa»).
  Test nuovi: il controllo, e la ricerca («cristo velato» → Sansevero per primo; «sfogliatela» → le pasticcerie; «gesu» → Gesù Nuovo;
  «panorama» → i panorami; una parola che non c'è → nessun risultato e la proposta «Togli i filtri»).
- **Il nome della città** («Napoli», «napoletana») vale **solo nei nomi** (Napoli Sotterranea), non nei testi, nelle etichette o nelle zone:
  chi scrive «Napoli» non cerca la Reggia di Caserta o tutti i locali (Enrico, 13/10/2026). Le parole della città arrivano dai dati della città.
- **Errori di battitura**, solo se la parola scritta non c'è nei nostri testi («pizza» c'è, quindi non trova «piazza»): una lettera sbagliata, mancante, in più o scambiata con la vicina dalle 5 lettere in su, due dalle 9;
  scritto da noi in `src/lib/itinerari/` (niente pacchetti). Ordine: nome, poi parola del luogo, poi genere o piatto; a parità, il più vicino.
- Sulla pagina il risultato dice perché è uscito («per: Cristo velato»): anche per questo ogni parola deve avere la fonte.

| Passo | Chi | Cosa |
|---|---|---|
| 1 | agente **Haiku** | dai testi e dalle schede di oggi (già con le fonti) tira fuori le parole candidate di 60 tappe e 32 locali (37 con i 5 nuovi) → `ricerca/2026-10-13-parole-chiave/candidati.md` |
| 2 | 4 agenti **`ricercatore`** (Sonnet), insieme | centro storico · resto della città · gite · locali: le 3–8 cose che la gente cerca di ogni luogo, con fonte primaria (sito del luogo, ministero, museo) → `ricerca/2026-10-13-parole-chiave/<gruppo>.md`. Si riusa `ricerca/storia-luoghi/` (125 fatti) |
| 3 | **Opus** (io) | rileggo le fonti (tutte quelle delicate, un campione del resto), scrivo le schede `-parole` e le liste `parole:`; i «NON TROVATO» in `da-risolvere.md` |
| 4 | **Opus** | controllo nella build, sinonimi, ricerca e test; `npm run testi:firma` se cambia un testo |
| 5 | agente **Haiku** | `npm test`, build, `check:links`, e riferisce |

### 4. Salvare e rileggere (ridotto da Enrico il 13/10/2026)
- **«Salva»** diventa un pulsante visibile. Salvare vuol dire: l'itinerario ha un nome ed entra in «I miei itinerari».
  **Resta com'è nelle prove** (pezzo 1, giro 5: in C il segnaposto che cade, in D il timbro): niente altre proposte.
- **Rete di sicurezza**: anche prima di «Salva» il lavoro non si perde (resta sul telefono come oggi), ma si vede scritto «Non ancora salvato».
- **Niente vista separata** «tutto l'itinerario»: dopo «Salva» si resta nel compositore.
- **Al massimo «Tutti i giorni» dentro il compositore** (da decidere): nella barra dei giorni, dopo l'ultimo, «Tutti»: i giorni uno sotto
  l'altro, corti (ora, nome, tratto), con i numeri di ognuno e «3 tappe visitate su 15»; un tocco su una tappa apre la scheda, sul titolo
  di un giorno porta a quel giorno; si sposta e si toglie come negli altri giorni. *Problema*: la sera prima si vuole rileggere tutto il
  viaggio senza sfogliare i giorni.
- Un itinerario pronto aperto dalla home è una bozza finché non lo salvi.
- Gli itinerari già sul telefono (salvati prima di oggi) diventano **salvati**: nessuno perde niente.
- «Salva» salva **subito**, con un **nome proposto** («Napoli, 12–14 ottobre» se c'è la data, altrimenti «Napoli in 2 giorni»); il nome si cambia con un tocco (Enrico, 08/10/2026).

### 5. Visitato / da visitare
- Su **ogni tappa** di un itinerario salvato (pronto o tuo): «Da visitare» → tocco → «Visitato», con una piccola animazione nello stile del marchio (la soglia che si chiude). Si torna indietro con un altro tocco.
- Se il giorno è **oggi** si ricalcolano gli orari da adesso (come fa oggi «Fatto»); negli altri casi la tappa si segna e basta, gli orari non cambiano.
- In «Tutti i giorni» (se si fa) e in «I miei itinerari»: «3 tappe visitate su 15».
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
- Con 2 bracerie e 1 friggitoria il filtro è povero: **si cercano altri locali di questi tipi** (Enrico, 08/10/2026). Ricerche dell'08/10/2026: `ricerca/2026-10-08-locali-bracerie.md`, `ricerca/2026-10-08-locali-friggitorie.md`; i locali scelti entrano con le stesse regole dei 32 di oggi (orari, fonti, tempi ricalcolati).
- **Entrano** (Enrico, 08/10/2026): Barbeqool, Colantuono's Steak and Grill, Granfuoco Braceria, Friggitoria Vomero, Da Rosetta. Un premio **non** è obbligatorio («scelta nostra», la scheda lo dice). Gli orari che i siti non scrivono li verifica Enrico a mano: `da-verificare/orari-locali.md`.

### 9. Aggiunte di Enrico dal giro 5 delle proposte (08/10/2026; Enrico: «per il resto va bene»)
**Pezzo 1 scelto (08/10/2026): C «Mappa prima» e D «Le pagine»**, con la ricerca di A e il logo scuro ambra
(`design/compositore/README.md`, giro 5).
- **Pause e margini**. *Problema*: la giornata calcolata va da una tappa all'altra senza fermarsi: niente pranzo, niente caffè; l'ora di
  fine è troppo ottimista e chi la segue arriva tardi. *Perché non basta* la riga «Qui puoi fermarti a mangiare» (sezione 7): propone un
  locale ma non tiene il tempo. **Cosa fa**: la pausa pranzo c'è già (un'ora, dopo la tappa dove si mangia o quella che finisce più vicino
  alle 13); si cambiano durata e posto, si toglie, si aggiungono caffè e riposo; un **margine** di 0, 5, 10 o 15 minuti dopo ogni tratto
  (foto, code, passo lento). La pagina mostra la **fine stimata**, il tempo **a piedi** separato dal tempo **in tutto** e quello che
  **resta** (o di quanto sfori). Le pause entrano nel calcolo (`calcolo.ts`), nel link condiviso e nei test; i minuti a piedi restano veri.
  Caso limite: una pausa non va mai dopo l'ultima tappa; con la pausa che fa sforare l'ora di fine vale l'avviso «piena».
- **«Chiuso il martedì» solo con la data**: senza data è un'informazione del luogo (sta nella scheda), non un avviso nella giornata.
- **Salvato vuol dire salvato**: resta anche chiudendo la pagina; il nome si cambia con **Rinomina** nei tre puntini di «I miei itinerari»
  (non subito dopo «Salva»).
- **Tutte le tappe sulla mappa**: un tasto le mostra (nel giorno vuoto si vedono subito); un punto apre la scheda con «Aggiungi al giorno».
- **La vista la sceglie chi visita**: Enrico sceglie due proposte; nella pagina un interruttore fa passare dall'una all'altra
  (la scelta resta sul telefono). *Problema*: chi pianifica sul divano preferisce l'elenco, chi è per strada la mappa.

### 10. Da dove parti? (pezzo nuovo, Enrico 13/10/2026; da approvare)
*Problema*: oggi la giornata comincia dalla prima tappa alle 9:30, come se ci dormissi dentro. Chi dorme a Chiaia e mette per prima la
Sanità non sa quanto ci mette ad arrivarci, e «C'è un ordine più corto» tiene ferma la prima tappa, che spesso è solo la prima aggiunta.
*Perché non basta migliorare l'ordine più corto*: senza sapere da dove parti non può scegliere la prima tappa né dire quando ci arrivi.

**Cosa fa**
- In cima a ogni giorno la riga **«Da dove parti?»**, con tre modi:
  1. **Il mio alloggio** (hotel, B&B, casa): si mette una volta e vale per tutti i giorni; un giorno si può cambiare (chi cambia hotel).
  2. **Dove sono**: la posizione del telefono, solo dopo un tocco (come oggi sulla mappa). Vale per adesso e non si salva, a meno di
     «Usalo come alloggio».
  3. **Un punto dall'elenco**: una tappa o un locale della città («parto dal Duomo»): tempi veri. Se è una tappa del giorno, diventa la prima.
- **L'ordine migliore da lì**: scelto il punto, se un altro ordine fa risparmiare almeno 5 minuti si propone con la grafica del pezzo 2
  («C'è un ordine più corto da Hotel …: 18 minuti in meno» → «Usa questo ordine», con «Annulla», oppure «Lascia così»). Niente cambia da
  solo. Rispetto a oggi: anche la prima tappa può cambiare (resta fermo il punto di partenza); evento e locali restano dove sono; **un
  ordine che fa trovare chiuso un luogo non si propone** (si prende il più corto senza avvisi nuovi di chiusura).
- **Gli orari partono da lì**: l'ora d'inizio del giorno diventa l'ora in cui esci («Esci alle 9:30 da Hotel …, al Duomo alle 9:50»).
- **«Torno lì alla fine»** (spento di base): aggiunge il tratto di ritorno e l'ordine si calcola come un giro chiuso (chi torna in hotel
  prima di cena).

**Tempi veri e tempi stimati**
- Da un punto dell'elenco i tempi sono **veri** (gli stessi di oggi). Dall'alloggio e da «Dove sono» il primo tratto è **stimato**,
  agganciandosi alle tappe vicine: per ogni tappa entro 800 m, linea d'aria × 20 minuti al km fino a lì, più il tempo vero da lì (metro e
  funicolari comprese). Misurato sui nostri dati (`ricerca/2026-10-13-stima-tempi-partenza.md`): con una tappa entro 250 m metà delle stime
  sbaglia di circa 1 minuto e 9 su 10 entro 7; tra 250 e 500 m, 3 e 11 minuti.
- Il tratto stimato **si vede diverso**: «circa 15 min» (arrotondato a 5 minuti) con la parola «stima»; sulla mappa una linea a puntini
  dritta (non disegniamo una strada che non conosciamo); nella barra del tempo a righe. «Come calcoliamo i tempi» lo spiega in una riga.
- **Lontano dalle tappe**: tra 500 e 800 m dalla più vicina «stima incerta»; oltre 800 m niente minuti («Sei lontano dalle nostre tappe:
  il primo tratto non lo sappiamo stimare») e l'ordine parte dalla tappa più vicina al punto. Il ritorno di «Torno lì» è sempre stimato.

**Trovare l'alloggio** (da decidere; ricerca `ricerca/2026-10-13-da-dove-parti.md`). Su OpenStreetMap (13/10/2026) nel Comune ci sono
**441 alloggi** (188 hotel, 213 B&B e affittacamere, 17 ostelli, 23 case vacanza), 428 con il nome: l'elenco pesa circa 6 KB compressi.
Ma le strutture extralberghiere censite dal Comune sarebbero **6.168** (dato 2024 in una nota della Regione, da rileggere nel PDF): chi
dorme in un B&B **di solito non trova il suo nome**. Quindi la mappa e la via sono la strada normale, non un ripiego. Consiglio: **tutto dal
sito, nessun servizio esterno**:
- **sulla mappa**: tocchi il punto o sposti il segnaposto (anche con i tasti freccia), oppure scegli la **via** dall'elenco delle vie di
  OpenStreetMap e poi lo sposti;
- il **nome** dall'elenco degli alloggi di OpenStreetMap: file nostro con data e licenza ODbL, che si carica solo quando apri «Da dove parti?»;
- «Dove sono», se sei già lì.
- Alternativa: l'indirizzo con Nominatim (il servizio di OpenStreetMap), dopo un tocco. Più preciso, ma l'indirizzo dell'hotel va a un
  server esterno; le sue regole vietano la ricerca mentre scrivi (si cerca solo premendo «Cerca»), chiedono al massimo una richiesta al
  secondo, l'attribuzione e di non mandare dati personali. Servirebbero avviso, pagina Privacy e un interruttore per spegnerlo.
- Nessun link a siti di prenotazione e nessun giudizio sugli alloggi: l'elenco serve solo a trovare un punto.

**Privacy**
- L'alloggio è un dato personale: resta **solo sul telefono**, dentro l'itinerario, e **non va nel link condiviso**. Nel link va solo un
  punto dell'elenco (una tappa non dice niente di chi lo manda). Chi riceve il link trova «Da dove parti?» vuoto.
- «Dove sono» non lascia il telefono e non si salva (come oggi).

**Dati e calcolo**
- Nell'itinerario (`itinerari-v1`) un campo nuovo facoltativo: la partenza di base e, se diversa, quella di un giorno (`{ punto: id }` o
  `{ lat, lon, nome }`), più «torno lì». Senza partenza tutto va come oggi: vecchi itinerari e vecchi link si aprono uguali.
- Nel link un parametro nuovo solo per i punti dell'elenco.
- `calcolo.ts`: la giornata comincia con la voce «partenza» e il suo tratto (vero o stimato); l'ordine migliore riceve i minuti dal punto
  di partenza (e verso il punto, con «torno lì») invece di tenere ferma la prima tappa; la stima in un modulo suo
  (`src/lib/itinerari/stima.ts`), con i test. Niente pacchetti.
- **Stazioni e porti** (da decidere): Napoli Centrale, Molo Beverello, Stazione Marittima, Montesanto, Mergellina come punti di sola
  partenza, con posizione da OpenStreetMap e tempi veri (ricalcolo di `tempi-tappe.json` con `scripts/itinerari/`). Utili il giorno
  dell'arrivo e per chi dorme vicino alla stazione.

**Le 4 proposte** (dentro C e D, partendo da `design/compositore/ricerca-giro-2/`, con la stima vera): campo libero. Per esempio:
1 · la riga di partenza come un biglietto in cima al giorno; 2 · la casetta sulla mappa che si trascina; 3 · la domanda prima della
prima tappa, come primo passo; 4 · l'alloggio del viaggio nella barra dei giorni. In tutte: i tre modi, la proposta dell'ordine, tempi veri
e stimati diversi a colpo d'occhio, «Torno lì», tema scuro, «riduci movimento».

## Come si lavora: 4 proposte per pezzo
- Un pezzo alla volta, ognuno con **4 proposte molto diverse** (regola di Enrico, 07/10/2026), con i dati veri, in chiaro e in scuro, telefono (320 e 390 px) e computer.
  Pagine private su claude.ai da guardare sul telefono, con le animazioni vere. Enrico dice cosa va → 4 proposte nuove → fino alla scelta.
- **Ordine consigliato** (rinumerato il 13/10/2026: prima la mappa era il pezzo 5): 1 pagina e barra → 2 scheda della tappa (con «visitato») → 3 ricerca → 4 da dove parti? → 5 salva e «Tutti i giorni» → 6 mappa → 7 mangiare nella giornata → 8 filtri dei locali (anche nella pagina «Dove mangiare»).
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
- **Alloggio fuori città** (Pozzuoli, Sorrento) o lontano dalle tappe: niente minuti per il primo tratto, ordine dalla tappa più vicina.
- **Giorno di gita**: la gita ha la sua partenza; la riga mostra solo la stima dall'alloggio al punto da cui parte la gita, se è in città.
- **Giorno di oggi con «Dove sono»**: gli orari ripartono da adesso e da dove sei; le visitate restano in cima (come «oggi»).
- **Posizione negata o imprecisa** (più di 100 m): lo diciamo e proponiamo l'alloggio o un punto dall'elenco.
- **Due alloggi nel viaggio**: ogni giorno il suo; cambiare quello di base non cambia i giorni già cambiati a mano.
- **Primo tratto lungo**: conta nell'avviso «piena» come gli altri tratti.

## Controlli
- `npm test` verde (con test nuovi: salvataggio e vecchi itinerari, «visitato», ricerca con parole chiave, proposta del pranzo, filtri; e per «Da dove parti?»: la stima su casi fissi, l'ordine dal punto con e senza ritorno e con le chiusure, il link con un punto dell'elenco e senza l'alloggio, i vecchi link e itinerari senza partenza), build senza errori, `check:links` pulito.
- Prima dell'anteprima: axe in chiaro e scuro, Lighthouse su telefono 95 o più, 320 e 390 px, «riduci movimento», nessun errore in console.
- **consistent-ui almeno 35 su 40** (lista di Enrico, 07/10/2026) e ux-audit di VectorLab.
- Prova a mano su telefono: comporre 2 giorni, salvare, chiudere, riaprire, segnare «visitato», aprire un vecchio link condiviso.

## Compiti
- [x] Enrico approva questa specifica (08/10/2026; mappa in sospeso).
- [x] Ricerca di altre bracerie e friggitorie (08/10/2026): Enrico fa entrare tutti e 5 i candidati.
- [ ] Orari dei locali nuovi da Enrico (`da-verificare/orari-locali.md`), poi dati, schede e tempi tra le tappe.
- [ ] Pezzo 1 · pagina e barra: 4 proposte → scelta → costruzione.
- [ ] Pezzo 2 · scheda della tappa e «visitato»: 4 proposte → scelta → costruzione.
- [ ] Pezzo 3 · ricerca: grafica scelta il 13/10/2026 (file di cartoline, segno 4: `design/compositore/README.md`); le parole chiave nei dati vengono con la riscrittura dei testi delle tappe.
- [ ] Pezzo 4 · «Da dove parti?»: Enrico approva la sezione 10 → 4 proposte → scelta → costruzione.
- [ ] Pezzo 5 · «Salva» com'è nelle prove; «Tutti i giorni» se Enrico lo vuole (niente vista separata).
- [ ] Pezzo 6 · mappa (dopo la decisione di Enrico: con o senza uso offline).
- [ ] Pezzo 7 · mangiare nella giornata.
- [ ] Pezzo 8 · filtri dei locali (dati nuovi con le fonti, poi compositore e «Dove mangiare»).
- [ ] Controlli, anteprima di Vercel, OK di Enrico, poi `main`.
