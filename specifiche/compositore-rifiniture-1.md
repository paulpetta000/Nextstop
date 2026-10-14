# Compositore · rifiniture, tranche 1: comportamento e pulizia

_Specifica del 15/10/2026, **approvata da Enrico lo stesso giorno** («costruisci la tranche 1»); costruita lo stesso giorno. Ramo `rifiniture-tranche-1`, nato da `main` (`10308a3`).
Origine: [ROADMAP · Fase 2 bis, tranche 1](../ROADMAP.md). Specifica madre: [compositore.md](compositore.md). Nessuna proposta grafica:
si sistema quello che c'è, con lo stile già scelto. «Tema 1» = vista C «Mappa prima», «tema 2» = vista D «Le pagine»._

## Obiettivo
Dopo la prova del 14/10 il compositore funziona, ma in alcuni punti fa cose inattese (il pronto nel giorno 2), costa troppi tocchi
(cambiare o creare un itinerario, eliminarlo) o occupa spazio inutile (riepilogo, «Pause e margini», barra «Salva», vecchia sezione
in fondo). Si correggono comportamento e ingombri senza cambiare l'aspetto scelto, i dati, gli ID e i link.

## Le scelte

### 1. Bug: itinerario pronto aggiunto nel giorno 2
**Oggi**: dal giorno vuoto (per esempio il 2) tocchi «Mezza giornata»; il compositore apre un **itinerario nuovo** e torna al
giorno 1. Sembra che le tue tappe siano sparite (sono nell'altro itinerario, in «I miei itinerari»).
**Da ora**, scegliendo un pronto dentro un giorno:
- le tappe del pronto vanno **nel giorno che stai guardando**; resti su quel giorno e nello stesso itinerario (nome, data, «salvato»
  o bozza non cambiano). Il giorno tiene il suo orario di inizio e fine: non si tocca niente di ciò che c'era;
- un pronto di **più giorni** (2 o 3 giorni) riempie il giorno aperto e i giorni dopo **se sono vuoti**; se il giorno dopo ha già
  tappe o una gita, se ne aggiunge uno nuovo subito dopo (gli altri scorrono avanti). I giorni nuovi prendono gli orari del pronto;
- una tappa del pronto che è **già in un altro giorno** non si duplica: resta dov'è e l'avviso lo dice («Santa Chiara è già nel giorno 1»);
- **se non c'è posto** si fa come «Sposta nel giorno»: niente cambia e l'avviso spiega perché (al massimo 7 giorni, al massimo le
  tappe di un giorno);
- dopo, l'avviso «Mezza giornata nel giorno 2: 4 tappe» con **Annulla**, come per le altre modifiche;
- **se nel giorno ci sono già tappe**: l'elenco dei pronti si vede solo nel giorno vuoto, quindi non succede dalla pagina. Se capitasse
  (per esempio con due schede aperte), le tappe vanno **in coda**, con le stesse regole: niente domanda in più;
- la **giornata di regata** resta com'è: chiede il giorno di regata e si apre come itinerario a parte, perché vuole una data precisa;
- se tutto l'itinerario è vuoto e non salvato, il risultato è lo stesso pronto di prima, ma nel giorno dove sei; prende anche il nome
  del pronto se quello di adesso è generico («Il mio itinerario»).
- Da home e menu (`?pronto=`) non cambia niente: il pronto si apre come bozza a sé.

**Test prima**: la decisione di oggi si sposta, uguale, in una funzione senza pagina (`src/lib/itinerari/pronti.ts`); il test
«giorno 2 + Mezza giornata» deve fallire su quella, poi si corregge. Altri test: più giorni con giorni pieni e vuoti, tappe doppie,
7 giorni, giorno con tappe, Annulla (l'itinerario di prima intatto).

### 2. Cambio vista tema 1 / tema 2 accanto al tema chiaro/scuro
Si toglie l'interruttore «Mappa prima / Le pagine» in fondo alle due viste. Nel menu del sito (le tre linee), **sotto il pulsante del
tema**, compare un pulsante gemello: stessa forma, stesso gesto (un tocco cambia), icona e scritta «Vista: Mappa prima» o «Vista: Le
pagine». C'è solo nella pagina del compositore e solo con JavaScript. La scelta resta sul telefono (come oggi). Il menu si chiude e
la vista cambia con il passaggio di oggi; il lettore di schermo sente «Vista Le pagine».

### 3. Via la vecchia sezione in fondo e i resti dello stile vecchio
- Si tolgono dalla pagina le sezioni **«Itinerari pronti»** (`#pronti`) e **«Gite di un giorno»** (`#gite`, i suoi «Aggiungi» oggi
  non fanno niente: lo script del vecchio compositore non c'è più) e i loro stili (`it-pronto-*`, `it-gite`, `it-gita-riga`).
  Restano «Da sapere» e le fonti in fondo.
- **Senza JavaScript** la pagina continua a portare agli itinerari pronti (regola dei casi limite): dentro il riquadro «serve
  JavaScript» c'è un elenco semplice dei pronti (tappe e orari) e delle gite, con gli stessi indirizzi `#pronto-…` usati da home e
  menu. Con JavaScript acceso non si vede e non pesa sul disegno della pagina.
- Si cercano gli altri resti del vecchio compositore (classi, testi, pulsanti, script) e si tolgono **solo dopo aver controllato** che
  nessuna pagina, script o costruzione li usi, anche per nome composto. ID di tappe, locali e pronti, URL, `?pronto=`, `?aggiungi=`
  e link condivisi restano. Home e menu tengono i loro link ai pronti.
- I pronti restano raggiungibili dentro il compositore: dal giorno vuoto (punto 1) e da «Nuovo itinerario» (punto 9).

### 4. Data e orari: si apre toccando ovunque
Nel foglio «Data e orari» un tocco in qualsiasi punto del campo data («GG», «MM», «AAAA») apre il calendario; lo stesso per inizio e
fine del giorno (tutto il rettangolo «9:30»). È il selettore del telefono, quello di oggi: la grafica nuova è della tranche 2. Con la
tastiera e con il lettore di schermo resta come adesso (si scrive, etichette, fuoco visibile). Dove il browser non può aprirlo da
programma, resta il comportamento di oggi.

### 5. Logo nel menu: ambra e animato
Nel menu aperto dalla pagina del compositore il logo usa il **segno ambra** già scelto per il compositore (pezzo 1) e si anima
**ogni volta che il menu si apre** (e passandoci sopra), con lo stesso movimento della testata. Con «riduci movimento» resta fermo.
Le altre pagine del sito (home, piè di pagina) non cambiano qui: se servono, sono della tranche 3.

### 6. Riepilogo del giorno più stretto
«In tutto 8 ore e 52, ti restano 38 minuti»: numeri e parole senza spazi larghi, riquadro più basso, le quattro voci (visite, a
piedi, pause, margine) più fitte. Restano i numeri che scorrono, la barra del tempo e il testo per il lettore di schermo.

### 7. «Pause e margini» più compatto
Stesso contenuto e stessa funzione, meno spazio: righe delle pause più basse, scelte del margine più piccole in una fila, note più
corte (sempre con le stesse informazioni). Tocchi da almeno 44 px.

### 8. Via «Tutti i giorni» dal menu «Itinerario»
Si toglie la voce (già decisa nella specifica madre, pezzo 5). Il tasto «Giorni» della vista D resta: serve a scegliere il giorno.
«Margine» e «Solo a piedi» restano, con la nota «vale per tutti i giorni».

### 9. Salvare, cambiare, creare ed eliminare un itinerario
- **Il nome in alto diventa il pulsante degli itinerari** (in C e in D, con una piccola freccia): un tocco apre «I miei itinerari».
  Sotto il nome resta lo stato «Salvato» o «Non ancora salvato»: si vede sempre quale è aperto e se è salvato.
- **«I miei itinerari», nuovo ordine**:
  1. **Aperto ora**: nome, giorni e tappe, stato; pulsanti piccoli «Salva» (se è una bozza), «Rinomina», «Condividi», «Elimina».
  2. **Nuovo itinerario**: «Vuoto» e i pronti («½ giornata», «1 giorno», «2 giorni», «3 giorni», la regata nel suo periodo). Un
     tocco crea la bozza e la apre.
  3. **Gli altri**: un tocco su una riga lo apre; accanto, un cestino.
  Al posto dei tre puntini: Rinomina e Condividi valgono per quello aperto (per un altro, prima lo apri: un tocco).
- **Eliminare**: cestino → la riga chiede «Eliminare “Due giorni a Napoli”?» con **Elimina** e **Annulla** di misura normale, non a
  tutta larghezza. Dopo, l'avviso con **Annulla** (come oggi). Due tocchi invece di tre.
- **Tornare indietro**: quando apri o crei un altro itinerario, l'avviso dice «Aperto “X”. “Y” è in I miei itinerari» con **Torna**.
  Una bozza lasciata com'era sparisce come oggi (allora niente «Torna»).
- **Barra «Salva l'itinerario per segnare le tappe…»** nella scheda della tappa: resta, ma in una riga più bassa, testo più piccolo e
  «Salva» di misura normale.

## Regole
- Nessun dato perso: `itinerari-v1`, link già mandati, `?pronto=`, `?aggiungi=`, ID e URL restano; nessun pacchetto nuovo.
- Movimento solo posizione e trasparenza, 150–400 ms; con «riduci movimento» fermo o dissolvenza.
- Testi nuovi brevi, nello stile del sito; nessuna informazione nuova senza fonte.

## Casi limite
- Pronto di 3 giorni dal giorno 6 di 7: non c'è posto, niente cambia, avviso.
- Tutte le tappe del pronto già nell'itinerario: niente cambia, l'avviso lo dice.
- Pronto in un itinerario salvato con tappe «visitate»: le visitate restano dove sono, segnate.
- Elimini quello aperto: si apre il più recente (come oggi); se era l'ultimo, ne nasce uno vuoto.
- Menu senza `showPicker` (browser vecchi): data e ora si aprono come oggi.
- 320 px e tema scuro: nessuno scorrimento di lato nel menu, nei fogli e nei riquadri più stretti.

## Controlli
- Test nuovi con `node:test` (punto 1 prima, poi il resto dove c'è logica senza pagina); `npm test`, `npm run build`, `npm run check:links`.
- Prova nel browser a 320 e 390 px, chiaro e scuro, vista C e D: i nove punti, console pulita, «riduci movimento».
- Axe e Lighthouse da telefono (95 o più) prima dell'anteprima di Vercel, che si fa solo con il sì di Enrico.

## Compiti
- [x] Enrico approva questa specifica (15/10/2026).
- [x] Punto 1 con il test prima (fallito sul comportamento di prima, poi verde); punti 2–9.
- [x] Controlli, `PROGRESS.md`, commit su `rifiniture-tranche-1`. Niente merge su `main` e niente pubblicazione senza il sì di Enrico.
- [ ] Prima dell'anteprima di Vercel (solo con il sì di Enrico): axe chiaro e scuro, Lighthouse da telefono, prova da telefono vero.

## Costruita (15/10/2026): decisioni prese costruendo
- **Punto 1**: `src/lib/itinerari/pronti.ts` (`prontoNelGiorno`) con 9 test in `test/pronti-itinerari.test.mjs`; la pagina usa
  `mettiPronto` (fogli.js) dal giorno vuoto, `usaPronto` resta per home, menu, regata e «Nuovo itinerario».
- **Punto 3**: via le sezioni e 324 righe di `itinerari.css` del compositore vecchio (selettori controllati uno per uno: nessuna
  pagina, script o dato li usa); via anche import e variabili rimasti in `index.astro`. Le classi delle proposte non scelte in
  `compositore.css` (circa 90, una ventina con nomi composti nel codice) restano: non sono stile vecchio, si possono pulire a parte.
- **Punto 6**: lo spazio largo era il carattere a spaziatura fissa dei numeri: nel riepilogo ora c'è quello del testo, con cifre
  della stessa larghezza (i numeri scorrono senza far ballare la riga).
- **Punto 9**, in più: «Torna» rimette anche una bozza lasciata com'era (prima spariva senza dirlo); «Annulla» dopo l'eliminazione
  sta dentro il foglio, perché l'avviso in basso restava sotto il foglio aperto e non si poteva toccare (difetto di prima).
- **Difetto trovato in passando**: dopo «Salva» o «Rinomina» il nome dell'itinerario veniva scritto anche sui nomi delle vie della
  mappa (stesso attributo `data-nome`); ora cambia solo il nome in alto.
- Senza l'interruttore in fondo, in C e in D c'è spazio sotto l'ultima riga, così la barra in basso non la copre.
