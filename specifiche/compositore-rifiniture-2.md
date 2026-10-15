# Compositore · rifiniture, tranche 2: grafica nuova (con le proposte)

_Specifica del 15/10/2026, **approvata da Enrico lo stesso giorno**: ordine dei pezzi ok, schede a parte dopo il pezzo 4, barre di scorrimento insieme al calendario, il resto del sito prende la barra del tema 1. Ramo `rifiniture-tranche-2` (Claude, cartella `nextstop-tranche2`), nato da `main` (`14e6e74`).
Origine: [ROADMAP · Fase 2 bis, tranche 2](../ROADMAP.md). Specifiche madri: [compositore.md](compositore.md),
[tranche 1](compositore-rifiniture-1.md). «Tema 1» = vista C «Mappa prima», «tema 2» = vista D «Le pagine»._

## Obiettivo
Il compositore pubblicato funziona, ma alcuni pezzi hanno ancora l'aspetto di serie del telefono (calendario, ora, barre di
scorrimento) o costano fatica (i tre puntini lontani da «Salvato», un menu lungo). E sulla mappa un luogo non scelto si legge solo in
due righe: chi visita non capisce cosa va a vedere prima di aggiungerlo. Si rifanno questi pezzi con le proposte, uno alla volta,
dentro lo stile già scelto (C e D, timbro postale, cartoline). Dati, calcoli, ID, link e `itinerari-v1` non cambiano.

## I pezzi e l'ordine che propongo

| # | Pezzo | Proposte | Perché in questo punto |
|---|---|---|---|
| 1 | **Calendario** (giorno, mese, anno) | 3 | Fissa il linguaggio dei selettori; l'ora deve somigliargli |
| 2 | **Selettore dell'ora** (inizio e fine del giorno) | 3 | Subito dopo, coerente con il calendario scelto |
| 3 | **Barra «Salvato» e tre puntini, con il menu** | 4 | Cambia la testata di C e D: meglio deciderla prima della mappa |
| 4 | **Mappa con tutti i luoghi e la scheda intera** | 4 | Usa la testata nuova e la scheda di oggi (pezzo 2 del compositore) |
| 5 | **Barre di scorrimento** | 2 per il tema 1 + 2 per il tema 2 | Per ultime: si provano dentro i fogli e i menu già rifatti |

Dopo ogni scelta **si costruisce subito solo il pezzo scelto**, sul ramo, con i suoi test; le proposte del pezzo dopo si vedono
accanto ai pezzi già costruiti (così l'ora si prova vicino al calendario vero). Niente fermate tra scelta e costruzione: i controlli
li faccio io; ci si ferma solo per scegliere.

**Per fare meno fermate** (se vuoi): le barre di scorrimento non dipendono dagli altri pezzi; posso mandarle insieme al calendario
(una pagina sola, due scelte). Te lo chiedo sotto.

## Le schede di tappe e locali: blocco a parte (consiglio)
Sono **92 schede** (51 tappe in città, 9 gite, 32 locali): per ognuna ricerca delle fonti (agenti `ricercatore`, un gruppo alla volta, tutto in `ricerca/`),
testo nuovo di 2–3 minuti, rilettura dei testi che usano la scheda, `npm run testi:firma`. È un lavoro di testi e fonti, non di
grafica, e molto più lungo degli altri pezzi messi insieme.
**Consiglio di staccarlo** come «tranche 2 bis · schede riscritte», con la sua specifica corta (gruppi, lunghezze, modello di scheda,
come leggi i testi tu) e il suo ramo, **dopo** il pezzo 4: la mappa si progetta con i testi di oggi, che poi vengono sostituiti senza
toccare la grafica. Così la tranche 2 si chiude in pochi giorni e non resta ferma ad aspettare la ricerca.

## Cosa deve fare ogni pezzo

### 1. Calendario
- Oggi è il calendario del telefono (`input type="date"` nel foglio «Data e orari»): cambia da telefono a telefono e non ci somiglia.
- Diventa **il nostro**: si apre con un tocco ovunque sul campo (come dalla tranche 1), mostra il giorno scritto per intero
  («martedì 13 ottobre») e, con i dati veri, **i giorni dell'itinerario** (giorno 1, 2, 3 di fila) e **i giorni in cui una tappa è
  chiusa** (per esempio il martedì del MANN). «Oggi» sempre riconoscibile, «Togli la data» resta.
- Limiti di oggi: dal 2026 al 2030. Le proposte cambiano forma (foglio dal basso, riquadro sotto il campo, striscia di giorni…).

### 2. Selettore dell'ora
- Oggi: `input type="time"` a passi di 15 minuti, inizio 5:00–20:00, fine 6:00–23:45. Restano passi e limiti.
- Coerente col calendario scelto. Con i dati veri: la fine stimata del giorno e cosa cambia («finisci alle 18:40»).

### 3. Barra «Salvato» e tre puntini
- I tre puntini vanno **accanto a «Salvato»** in alto (in C e in D) e il menu cambia secondo il momento: bozza o salvato, giorno
  vuoto o con tappe, giorno di gita.
- Il menu «Itinerario» di oggi (I miei itinerari, Condividi, Pause e margini, Data e orari, Aggiungi un giorno) va rivisto: contenuto,
  ordine, misure. Niente «Tutti i giorni»; «Pause e margini» compatto come dalla tranche 1. Il nome resta il pulsante di «I miei
  itinerari» (tranche 1).

### 4. Mappa con tutti i luoghi e la scheda intera
- Sulla mappa del giorno e su quella di «Aggiungi» c'è già «Tutte le tappe», ma un luogo non scelto apre solo un riquadro piccolo
  («30 minuti da Borgo Marinari, 30 minuti di visita»).
- Da ora un tocco su **qualsiasi luogo** (anche non scelto: Pignasecca, Museo Filangieri) apre **la scheda intera**, come quella della
  tappa (foto, descrizione, orari, prezzi, come arrivare, fonti), con «Aggiungi al giorno N». Le proposte cambiano come si mostrano
  tutti i luoghi (anche i locali?) e come si passa dalla mappa alla scheda.

### 5. Barre di scorrimento
- Due per il tema 1 e due per il tema 2, in chiaro e in scuro. Scelte, valgono **per tutte le barre** del compositore (pagina, fogli,
  pannelli, elenchi, ricerca) e del sito. Le strisce che oggi scorrono di lato senza barra (filtri, cartoline, giorni di D) restano senza.
- Al computer e su Android il colore e lo spessore si possono cambiare; su iPhone la barra la disegna il browser e compare solo
  mentre scorri: verifico nel pezzo cosa si può fare e te lo scrivo sulla pagina delle proposte.

## Come ti mando le proposte
- Una pagina privata su claude.ai per pezzo, da aprire dal telefono: in alto scegli proposta, vista (C o D) e chiaro/scuro; dati
  veri di «Due giorni a Napoli» (orari, chiusure, tempi a piedi), animazioni vere.
- Con la pagina, immagini a **320 e 390 px e computer**, in chiaro e scuro. Bozzetti in `design/compositore/rifiniture-2/`, uno per pezzo.
- Prima di mandarle: nessuno scorrimento di lato a 320 e 390 px, axe pulito in chiaro e scuro, console pulita.

## Regole
- Nessun dato perso: `itinerari-v1`, link già mandati, `?pronto=`, `?aggiungi=`, ID e URL restano. Nessun pacchetto nuovo.
- Calendario e ora nostri devono restare **usabili senza vedere lo schermo e senza dito**: frecce, Pagina su/giù per i mesi, Invio,
  Esc; il lettore di schermo sente giorno, mese e se una tappa è chiusa. Fuoco visibile, tocchi da almeno 44 px.
- Movimento solo posizione e trasparenza, 150–400 ms; con «riduci movimento» fermo o dissolvenza.
- Testi nuovi brevi, nello stile del sito; nessuna informazione senza fonte (chiusure e orari vengono dai dati).

## Casi limite
- Data già scelta fuori dai limiti (vecchio link): il calendario si apre sul mese giusto e la tiene.
- Itinerario di 7 giorni a cavallo di due mesi; giorno di regata (data fissa: il calendario non la cambia).
- Ora di fine prima dell'inizio, o giorno che sfora: lo dice come oggi.
- Mappa con tutti i luoghi a 320 px: segni che non si coprono, scheda che si chiude tirando giù (come le altre).
- Luogo già nel giorno o in un altro giorno: la scheda lo dice invece di «Aggiungi».
- Tema scuro e 320 px: nessuno scorrimento di lato nei selettori, nel menu e nella scheda.

## Controlli
- Bug trovati: prima il test che li riproduce. Test nuovi con `node:test` dove c'è logica senza pagina (giorni del calendario,
  chiusure, voci del menu secondo lo stato).
- A fine tranche: `npm test`, `npm run build`, `npm run check:links`; prova nel browser a 320 e 390 px, chiaro e scuro, C e D,
  console pulita, «riduci movimento»; axe e Lighthouse da telefono 95 o più. `PROGRESS.md` e commit sul ramo.
- Anteprima di Vercel solo quando la chiedi; niente merge su `main` né pubblicazione senza il tuo sì.

## Domande per te
1. L'ordine dei pezzi va bene (calendario → ora → barra e menu → mappa → barre di scorrimento)?
2. Schede di tappe e locali in un blocco a parte, dopo il pezzo 4?
3. Barre di scorrimento insieme al calendario (meno fermate) o per ultime?
4. Il resto del sito (home, Fonti, Dove mangiare) non ha temi 1 e 2: prende la barra scelta per il **tema 1**? (Consiglio sì.)

## Compiti
- [x] Enrico approva questa specifica (15/10/2026).
- [x] Pezzo 1 calendario: 3 proposte (giro 1 con le barre) → scelta la 3 con la fascia della 1 (sotto) → costruzione.
- [ ] Pezzo 2 ora: 3 proposte ([giro 1](https://claude.ai/artifact/2CWqzAxgK1mdB9p9A9XKuK), 15/10/2026) → scelta → costruzione.
- [ ] Pezzo 3 barra «Salvato» e menu: 4 proposte → scelta → costruzione.
- [ ] Pezzo 4 mappa e scheda intera: 4 proposte → scelta → costruzione.
- [x] Pezzo 5 barre di scorrimento: scelte «Il filo» (tema 1 e sito) e «Il nastro» (tema 2) → costruzione su tutto il sito.
- [ ] Controlli, `PROGRESS.md`, commit sul ramo. Anteprima, `main` e pubblicazione solo con il sì di Enrico.

## Scelte di Enrico sul giro 1 (15/10/2026)
[Proposte](https://claude.ai/artifact/Qz5QeweMwhtptB93dJPSVM), in `design/compositore/rifiniture-2/calendario-giro-1/`. Valgono per il tema 1 e il tema 2.
- **Calendario: la 3 «Tutti i mesi»** (foglio intero, mesi uno sotto l'altro, «Fatto» in basso), con:
  - **i giorni del viaggio evidenziati come nella 1**: il giorno scelto pieno, gli altri su una fascia; la fascia **più visibile** di
    quella della prova (in chiaro era un bianco azzurrino che quasi non si vedeva), ma più chiara del giorno pieno e sempre leggibile;
  - **i puntini gialli** sui giorni in cui, partendo lì, qualcosa è chiuso;
  - **niente riquadro giallo in alto** con l'elenco delle chiusure: basta una riga che spiega il puntino («Il punto giallo: partendo
    quel giorno qualcosa è chiuso»). Dopo «Fatto», nel foglio «Data e orari», il riepilogo giorno per giorno dice cosa è chiuso
    («Giorno 2 · Chiusi: San Martino»), come oggi.
- **Barre di scorrimento**: tema 1 la 1 **«Il filo»**, tema 2 la 2 **«Il nastro»**; il resto del sito prende «Il filo».
- Enrico: «fai queste piccole modifiche e poi pubblica su `main`» (sì alla pubblicazione di calendario e barre, 15/10/2026).

## Calendario e barre costruiti (15/10/2026)
- **Calendario**: `src/lib/itinerari/calendario.ts` (settimane del mese dal lunedì, tappe chiuse partendo da un giorno, mesi da
  mostrare dentro 2026–2030) con 6 test in `test/calendario.test.mjs`, scritti prima; il foglio è `compositore/calendario.js`, una
  seconda finestra (`<dialog id="calendario">`) sopra «Data e orari». Un tocco su un giorno sceglie subito la data (come nella
  prova); «Fatto», Esc o un tocco fuori chiudono e il fuoco torna sul campo. Nel giorno 2 o 3 il giorno pieno è quello che stai
  cambiando e il punto vale «con quel giorno». Il campo è un pulsante con il giorno scritto per intero; via l'`input type="date"`.
- **Fascia** più visibile della prova: pervinca chiaro in C, celeste in D (scura nel tema scuro); punto giallo più scuro in chiaro
  (contrasto 3,8 sul bianco). Le regole generali delle tabelle del sito (intestazioni maiuscole, righe) non entrano nel calendario.
- **Barre**: «Il filo» in `global.css` per tutto il sito e per il tema 1 (pollice `#7A88D0`, contrasto almeno 3 sulle carte chiare;
  `#6573BE` in scuro); «Il nastro» in `compositore.css` per `html.pd`. Con «più contrasto» il pollice prende il colore del testo.
  Tolto dalla home O4 il `scrollbar-color` che avrebbe spento le barre nuove in Chrome. Firefox: solo colore e spessore.
- Prova nel sito: `design/compositore/costruzione/calendario.cjs` (C e D, chiaro e scuro, 320, 390 e computer: apertura, martedì
  con la fascia e i punti, «3 tappe chiuse», frecce e Pagina giù, Esc, riepilogo e fuoco; axe con il calendario aperto e dopo).
- **Velocità** (15/10/2026): con il calendario dentro la pagina Lighthouse da telefono scendeva di 2 punti (la pagina superava di poco
  una soglia di trasmissione); ora `calendario.js` e il suo stile (`src/styles/calendario.css`, messo nella pagina da quel file) si
  scaricano al primo tocco sul campo, e il service worker li tiene per l'uso senza rete. Tolte anche 56 regole di `compositore.css`
  delle proposte non scelte (mangiare 1, 3, 4; schede 3 e 4), che nessuna pagina usava. Sull'anteprima: mediana 97 contro 95 della
  versione di prima, misurate di seguito; pagina 104,4 KB come prima.
- **Su `main` e pubblicati** il 15/10/2026, col sì di Enrico.
