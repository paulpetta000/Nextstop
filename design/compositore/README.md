# Compositore: le proposte grafiche

Proposte con i dati veri di «Due giorni a Napoli»: orari, tempi a piedi e percorsi calcolati dal sito (giorno feriale), foto e
caratteri del sito. Regola di Enrico: 4 proposte molto diverse per pezzo, si itera su quello che va. Specifica: `specifiche/compositore.md`.

# Pezzo 7: mangiare nella giornata

Specifica §7. Quattro proposte dentro C e D: nella striscia in alto si sceglie la proposta (1-4) e la vista; **Sera** porta i giorni
alle 22:00 e fa comparire anche la cena. Cartella `mangiare-giro-1/` (nata da `mappa-giro-1/`, con la mappa a pezzi scelta, più `mangiare.css`).

## Giro 1 (14/10/2026) · https://claude.ai/artifact/Ka4wHT2GqRZkCqo3p6apXZ
| | Nella giornata | Toccando |
|---|---|---|
| **1 · La sosta** | la pausa pranzo diventa «Qui puoi fermarti a mangiare», con i tre locali aperti più vicini nella riga | un locale apre la sua scheda con «Mangia qui»; «Tutti» apre l'elenco con i filtri e, in fondo, i chiusi a quell'ora |
| **2 · Il menù** | una riga piccola, «Il menù del pranzo» | un foglio come la carta di un ristorante: i locali per tipo, i puntini fino ai minuti, fino a che ora sono aperti; in cima «A piedi: 5, 10, 20 min» |
| **3 · Sulla mappa** | una piccola mappa disegnata con i cerchi e i locali | la mappa intorno a dove sarai: cerchi di 5 e 10 minuti, locali pieni se aperti e vuoti se chiusi; toccandone uno, la sua carta sotto |
| **4 · Lungo la strada** | cartoline in fila (in D appese a un filo), dal locale che allunga meno la strada verso la tappa dopo: «di passaggio» (fino a 2 min) o «+8 min» | la scheda con «Mangia qui»; «Tutti» apre l'elenco in quell'ordine |

In tutte: la riga compare dove sarai all'ora del pasto. **Pranzo** (12:30–14:30) = la pausa pranzo del pezzo 1 (dopo la tappa dove si
mangia o quella che finisce più vicino alle 13); **cena** (19:30–21:30) dopo l'ultima tappa, se il giorno arriva almeno alle 20:30.
Niente riga se a quell'ora c'è già un locale nel giorno. I minuti sono quelli veri dalla tappa prima (`tempi-tappe` del sito); aperto o
chiuso all'arrivo con gli orari scritti dai locali (`orarioLocale` del sito; senza data, i giorni in cui hanno l'orario). Per il pranzo:
locali da pranzo e di cibo di strada, non le pasticcerie. **Mangia qui** mette il locale nel giorno al posto della pausa pranzo (con
«Annulla»); per la cena, se arrivi prima delle 19:30, si aggiunge un «Tempo libero» fino alla cena. **No, grazie** toglie la proposta
per quel giorno (la pausa pranzo resta). Niente si aggiunge da solo. Se vicino è tutto chiuso, lo dice e indica il più vicino aperto.
Con i dati di oggi (32 locali) dopo via dei Tribunali, alle 12:25, gli aperti a 10 minuti sono tre (Di Matteo, Port'Alba, Gesù Vecchio):
i locali nuovi del pezzo 8 ne aggiungeranno.
Da decidere con Enrico: la cena dopo l'ultima tappa (la specifica dice «se la giornata attraversa la cena»); quanti minuti al massimo.
Controlli (14/10/2026): axe pulito in 112 controlli (4 proposte, C e D, telefono e computer, chiaro e scuro, riga, fogli, mappa, sera);
nessuno scorrimento di lato a 320 e 390 px; nessun errore nella pagina (solo l'icona del server di prova); prove dei gesti: Mangia qui,
Annulla, No, grazie, cena con il tempo libero. Immagini: `mangiare-giro-1/immagini/*.jpg`.
Rifare: `npm run build`, `node design/compositore/genera.mjs mangiare-giro-1`; con il server della copia acceso (porta 4333)
`node design/compositore/mangiare-giro-1/prove/axe.cjs 4333 <cartella immagini>`.

# Pezzo 6: la mappa (strada A, anche senza rete)

Specifica §6 (deciso il 14/10/2026). Cartella `mappa-giro-1/` (nata da `ricerca-giro-2/`, segno 4 fisso). Numeri: `ricerca/2026-10-14-mappa-peso.md`.

## Prima prova (14/10/2026) · https://claude.ai/artifact/DoCdKadtBTAMXDHaYZhZoT
Nella striscia in alto: **Prima** (strade piccole solo nella zona dei due giorni, `strade.json`) o **A pezzi** (tutta la città), la
vista C o D, e **Pezzi** (bordi dei pezzi, peso di ognuno e quanti ne ha scaricati la mappa). Le strade di tutta la mappa sono in
59 pezzi da 1,28 km (`pezzi-256/`, pubblicati accanto alla pagina): la mappa scarica solo quelli dove guardi (da 0,45 px ogni 5 m in su),
una volta sola. Nomi: sempre le 332 vie principali (`pezzi-256/nomi-principali.json`, dentro la pagina) e, nel colore del percorso e appena
sopra la linea, le vie dove passa il percorso del giorno (trovate con i nomi dei pezzi: tratti di almeno 120 m). Aspetta l'OK di Enrico.
Controlli: nessun errore della pagina (solo l'icona del server di prova), nessuno scorrimento di lato a 320 e 390 px, C e D in chiaro e scuro.
Immagini: `mappa-giro-1/immagini/*.jpg` (giorno, centro con i bordi, Mergellina prima e dopo).
Rifare: con il JSON di Overpass (query nella ricerca) `node design/compositore/mappa-giro-1/pezzi.mjs <file> 256`, poi
`node design/compositore/genera.mjs mappa-giro-1`; con il server acceso `node design/compositore/mappa-giro-1/prove/foto.cjs <cartella> light,dark <porta>`.

# Pezzo 4: «Da dove parti?»

Specifica §10 (approvata il 13/10/2026: facoltativo; la domanda è «Da dove parti?», mai «Dove dormi?»; un punto tuo tutto dal sito;
stazioni e porti sì). Quattro proposte dentro C e D: nella striscia in alto si sceglie la proposta (1-4) e la vista. Cartella
`partenza-giro-1/` (nata da `ricerca-giro-2/`, più `partenza.css` e `alloggi.json`).

## Giro 1 (14/10/2026) · https://claude.ai/artifact/VsuPUwPwehrh6jC3UnMhCi
**Scelta di Enrico (14/10/2026): la 2, «Sulla mappa», ma il pezzo va in stand-by.** Non lo convince ancora: si riprende più avanti con
le fermate di autobus, metro e treni e le linee vicine al punto (percorso vero con i mezzi), e quando esce avrà la scritta «beta» (specifica §10).
| | Dove si chiede | Come si sceglie il punto |
|---|---|---|
| **1 · Il biglietto** | in cima al giorno un biglietto vuoto «Da dove parti?»; scelto il punto si «stampa»: l'ora in cui esci e da dove (in D di carta, in Bodoni) | un foglio con tre schede: Sulla mappa (la mappa si sposta sotto il segno fermo al centro; si cerca una via o un hotel), Dove sono, Stazioni e tappe |
| **2 · Sulla mappa** | in C un pulsante sulla mappa; nella giornata una riga «Mettilo sulla mappa»; un tocco sul segno della partenza lo riapre | il segno della partenza (la porta del marchio) si trascina sulla mappa grande, o si tocca la mappa; i minuti cambiano mentre lo sposti; vicino a una stazione o a una tappa ci si attacca. In D sul telefono si apre la mappa a tutto schermo |
| **3 · La prima domanda** | il giorno comincia con una domanda e quattro risposte (Dove sono, Sulla mappa, Stazione o porto, Una tappa), più «Salta» (resta solo «Punto di partenza», piccolo) | la risposta si apre sul posto: le stazioni, le tappe con la ricerca, una piccola mappa con il mirino; risposto, l'ordine migliore si mostra subito, con le tappe nel nuovo ordine |
| **4 · Il viaggio** | la partenza di tutto il viaggio: in C una pillola sopra la giornata, in D un'etichetta da bagaglio appesa al titolo (dondola quando cambia) | una ricerca sola per vie, hotel e B&B, tappe e stazioni, più Dove sono e Sulla mappa; «Giorno per giorno»: un giorno da un altro posto o da nessuno |

In tutte: **facoltativo** (senza partenza tutto va come prima); da una tappa i tempi sono veri, da un punto tuo il primo tratto è
**stimato** come nella specifica (tappe entro 800 m, 20 minuti al km, poi il tempo vero, metro e funicolari comprese): «circa 15 min»
con la parola «stima» (o «stima incerta»), linea dritta a puntini sulla mappa, a righe nella barra del tempo; oltre 800 m niente minuti.
**L'ordine migliore da lì** (tutti gli ordini fino a 8 tappe, senza chiusure in più, almeno 5 minuti in meno) si propone con il
consiglio del pezzo 2, con «Annulla»; **«Torno lì alla fine»** aggiunge il ritorno (stimato) e l'arrivo. Il punto resta sul telefono;
«Dove sono» non si salva. Quando conviene: con «Dove sono» (in questa prova finto, in piazza del Gesù) si comincia da Santa Chiara,
7 minuti in meno (con il ritorno 8, da Spaccanapoli); dalle stazioni e da Chiaia l'ordine dei due giorni è già il migliore.
Limiti della prova: da stazioni e porti i minuti sono stimati (nel sito veri, ricalcolando `tempi-tappe.json`); stazioni e porti da
`src/data/luoghi.yaml` (Napoli Centrale, Molo Beverello, Montesanto, Mergellina: **la Stazione Marittima non c'è ancora**, la
posizione va presa da OpenStreetMap); le vie sono le 110 della zona dei due giorni (`strade.json`); hotel e B&B: i 428 con il nome
di OpenStreetMap (`alloggi.json`, dati del 13/10/2026, ODbL), solo per trovare un punto.
Controlli (14/10/2026): axe pulito in 120 controlli (4 proposte, C e D, telefono e computer, chiaro e scuro, fogli e scelte aperte,
«riduci movimento»); nessuno scorrimento di lato a 320 e 390 px; nessun errore nella pagina; prove dei gesti: trascinare il segno,
stazioni, «Usa questo ordine», «Torno lì», giorno per giorno. Immagini: `partenza-giro-1/immagini/prima-*.jpg` (la domanda) e `dopo-*.jpg`.
Rifare: `npm run build`, `node design/compositore/genera.mjs partenza-giro-1`; con il server della copia acceso (porta 4333)
`node design/compositore/partenza-giro-1/prove/foto.cjs <cartella> light,dark` e `prove/axe.cjs`.

# Pezzo 3: la ricerca (il riquadro dei risultati)

Specifica §3 (con il piano delle parole chiave). Tre proposte piccole, solo per il riquadro dei risultati, dentro C e D: nella striscia
in alto si sceglie il riquadro (1-3) e la vista; «Cerca» apre il foglio «Aggiungi». Dentro il foglio la striscia grigia «Riquadro 1 2 3»
cambia proposta senza perdere le parole. Il resto è quello scelto nei pezzi 1 e 2 (il foglio, timbro 2). Cartella `ricerca-giro-1/`
(nata da `scheda-giro-2/`, più `ricerca.css`).

## Giro 2 (13/10/2026) · https://claude.ai/artifact/5kY2dyNQPGiTsT2TcF4GGF
**Pezzo 3 scelto (13/10/2026): il riquadro 2 (le file di cartoline) con il segno 4 (il corsivo).** Avviso in basso ancora −10% (3,6 secondi con «Annulla», 2,3 senza); il resto va bene.
**Scelta di Enrico sul giro 1: il riquadro 2, le file di cartoline.** Cosa ha chiesto: l'avviso dopo «Aggiungi» dura troppo; l'avviso giallo
nella giornata («Finisci alle 19:15…», col triangolo) deve avere una X, con un'animazione quando sparisce; cercando «Napoli» uscivano la Reggia
di Caserta, Ercolano e tutti i locali (le frasi dicono «da Napoli Centrale»…); la sottolineatura della parola trovata non lo convince.
Le parole chiave si fanno più avanti, con la riscrittura dei testi delle tappe e le pagine degli itinerari pronti (specifica §3).
Cartella `ricerca-giro-2/`: in alto si sceglie il **segno** (1-4) e la vista; dentro il foglio la striscia grigia «Segno 1 2 3 4».
- **Segno 1 · l'inchiostro**: la parola nel colore del sito (in D terracotta) e più marcata, niente sotto.
- **Segno 2 · la pastiglia**: un'etichetta tenue con i bordi tondi intorno alla parola.
- **Segno 3 · il tratto di penna**: una linea fatta a mano sotto la parola, che si disegna da sinistra.
- **Segno 4 · il corsivo**: la parola in Bodoni corsivo, un po' più grande, colorata (in D, dove il cartellino è già corsivo, si raddrizza).

In tutti: **«Napoli» solo nei nomi** (esce Napoli Sotterranea e basta); **errori di battitura solo se la parola scritta non c'è nei nostri
testi** (prima «pizza» trovava anche «piazza»: Palazzo Reale, il Plebiscito…; «caravagio» e «sfogliatela» si trovano ancora); **l'avviso
in basso** dura 3,6 secondi con «Annulla» (prima 7) e 2,3 senza (prima 4), e resta fermo se ci passi sopra o ci vai con la tastiera; **la X
sull'avviso giallo**: il triangolo si richiude, il riquadro scivola a destra e lo spazio si chiude; l'avviso torna solo se la giornata cambia.
Controlli: axe pulito in 112 controlli (4 segni, C e D, telefono e computer, chiaro e scuro); nessuno scorrimento di lato a 320 e 390 px;
nessun errore nella pagina; immagini `ricerca-giro-2/immagini/*.jpg` (catacombe, Napoli, sfogliatela).

## Giro 1 (13/10/2026) · https://claude.ai/artifact/Nzhni2i2SQLrYomVB8C3M2
| | Il riquadro | Il movimento |
|---|---|---|
| **1 · L'indice** | solo parole, come l'indice di una guida: gruppi con il conto, il nome, sotto il pezzo di frase dove compare la parola (sottolineata come con l'evidenziatore), minuti a piedi, «+» | le righe salgono, poi l'evidenziatore si disegna sotto la parola |
| **2 · Le file di cartoline** | un gruppo per fila, da scorrere di lato: foto grande con il cartellino della parola trovata; senza foto (Cappella Sansevero, i locali) la parola trovata scritta in grande | le cartoline entrano da destra, una dopo l'altra |
| **3 · La frase trovata** | in alto le schede Tutto, Da vedere, Da mangiare, Gite; il risultato migliore in grande con la frase del nostro testo tra virgolette e la fonte («Dal nostro testo, fonte: Museo Cappella Sansevero»); sotto gli altri, piccoli | il riquadro sale, l'evidenziatore passa sulla frase |

In tutte: **una ricerca sola** per 51 tappe, 32 locali e 9 gite, in gruppi (Da vedere, Da mangiare, Gite) ordinati dal gruppo più pertinente;
nel gruppo prima il più pertinente, poi il più vicino (minuti a piedi veri, calcolati nella pagina). Cerca nei **nomi**, nelle **parole del
sito** (sinonimi di generi, cucine e piatti: «belvedere», «pizzeria», «riccia») e nelle **frasi dei nostri testi**, che hanno già le fonti
(nel sito vero diventano le `parole:` dei dati, controllate dalla build: piano nella specifica). Senza accenti («gesu»), con piccoli errori
(«sfogliatela»: una lettera dalle 5 lettere in su, due dalle 9), e con l'inizio della parola mentre scrivi. Le tappe già nel viaggio dicono
«Giorno 1»; le gite «un giorno intero» (in questa prova non si aggiungono: lo dice la pagina). Un tocco sul risultato apre la scheda, con
«Torna ai risultati». Senza parole: «Prova a cercare» (Cristo velato, Caravaggio, sfogliatela, panorama, pizza fritta, gesu, Pompei,
catacombe) e le tappe dalla più vicina come prima. Senza risultati: «Niente per …» e «Togli i filtri» o qualche ricerca da provare.
Controlli (13/10/2026): axe pulito in 88 controlli (3 riquadri, C e D, telefono e computer, chiaro e scuro, tre ricerche, senza parole,
nessun risultato); nessuno scorrimento di lato a 320 e 390 px; nessun errore nella pagina; prove a mano: gita, scheda e «Torna ai
risultati», filtro e «Togli i filtri», «+» su un locale (entra nel giorno con i tempi veri). Trovato e corretto: la fila di cartoline si
agganciava alla posizione spostata dall'animazione (ora si muove il contenuto della cartolina). Immagini: `ricerca-giro-1/immagini/*.jpg`.
Rifare: `npm run build`, `node design/compositore/genera.mjs ricerca-giro-1`; con il server della copia acceso (porta 4333)
`node design/compositore/ricerca-giro-1/prove/foto.cjs <cartella> light,dark` e `prove/axe.cjs`.

# Pezzo 2: la scheda della tappa e «visitato»

Specifica §2 e §5. Le 4 proposte vivono dentro le due viste scelte nel pezzo 1 (C «Mappa prima» e D «Le pagine»): nella striscia
in alto si sceglie la proposta (1-4) e la vista (C o D). Cartella `scheda-giro-1/` (`app.js`, `stile.css` del pezzo 1, `pezzo2.css`).

## Giro 2 (13/10/2026) · https://claude.ai/artifact/Sdp8yvNnR36Di763TcZdR6
**Pezzo 2 scelto (13/10/2026): timbro 2, il timbro postale con il giorno della visita.** Il resto del giro 2 va bene così (consiglio dell'ordine più corto, barra del tempo).
**Scelta di Enrico sul giro 1**: la scheda si apre come nella 1 (il foglio); «visitata» nella giornata come nella 1 (la porta con il
numero, senza aprire la scheda); spostare e togliere come nella 1 (maniglia; nella scheda «Sposta nel giorno 2» e «Togli»). Dentro la
scheda niente rettangolo «Da visitare»: un **timbro tondo sul bordo della foto**, come il sigillo della 3, con la foto a tutta larghezza.
Una pagina sola (cartella `scheda-giro-2/`, nata da `prove/ritocca-giro2.cjs`); in alto si sceglie il timbro (1-3) e la vista:
- **Timbro 1 · il sigillo**: cerchio con il bordo a trattini, che diventa pieno; dentro la soglia che si chiude e «visitata».
- **Timbro 2 · il timbro postale**: giro di parole «Napoli · Nextstop», appena accennato da visitare; visitata si stampa con il giorno («13 ott»).
- **Timbro 3 · la medaglia del marchio**: si riempie di blu notte (ambra scuro in tema scuro) dal centro e le soglie si chiudono.

Altre richieste: **«C'è un ordine più corto»** come nel prototipo di oggi (`ordinePiuCorto` del sito: almeno 3 tappe e 5 minuti in meno,
la prima tappa resta) ma nello stile nuovo: in C un riquadro bordato sopra le tappe, in D un foglietto come le cartoline; «Usa questo
ordine» (con «Annulla») o «Lascia così» (resta nascosto finché l'ordine non cambia). **Barra del tempo in tema chiaro** senza blu notte
né nero: visite in pervinca chiaro (D celeste maiolica), cammino blu, pause verde (D terracotta).
Controlli: axe pulito (48 controlli: 3 timbri, C e D, telefono e computer, chiaro e scuro, scheda aperta); nessuno scorrimento di lato a
320 e 390 px; gesti della 1 e «oggi» rifatti (`prove/*-2.cjs`, porta 4333); immagini `immagini/timbri-*.jpg`, `consiglio-*.jpg`.
Lavoro fatto nella copia `C:\Users\Windows11\Documents\nextstop-compositore` (worktree del ramo `compositore-pagina`), perché nella
cartella `nextstop` c'era un lavoro di Codex non salvato.

## Giro 1 (09/10/2026) · https://claude.ai/artifact/38QAViDs5yfqnqyehLvMdP
| | La scheda | «Visitata» | Spostare e togliere |
|---|---|---|---|
| **1 · Il foglio** | sale a metà schermo (in C la mappa resta sopra e vola sulla tappa; un altro segno sulla mappa cambia la scheda); si tira su per leggere tutto; di lato la tappa prima o dopo, con il tratto a piedi in basso | il numero della tappa è una piccola porta: un tocco e le soglie si chiudono | maniglia a destra (trascini o frecce); nella scheda «Sposta nel giorno 2» e «Togli» |
| **2 · La riga si apre** | si allarga sul posto: la foto cresce dalla miniatura, i tratti prima e dopo restano; orari, biglietti, come arrivare e fonti si aprono con un tocco | scorri la riga a destra: sotto «Visitata», la soglia si chiude mentre trascini | scorri a sinistra: «Togli»; tieni premuta e trascini; nella riga aperta «Sposta»: prima, dopo, altro giorno |
| **3 · A tutta pagina** | pagina intera come una rivista: la foto vola dalla riga, nome grande sulla foto, capolettera, «Da sapere» in un foglietto, fonti aperte; in fondo «Prossima tappa» con i minuti a piedi (la pagina gira) | il sigillo sul bordo della foto | «Modifica il giorno»: «−» e maniglie su tutte le tappe, poi «Fatto» |
| **4 · In cammino** | le schede di tutto il giorno una accanto all'altra, tra una e l'altra il tratto a piedi; in cima i puntini delle tappe | il pallino (in D il timbro con l'ora); «2 di 7 visitate»; la strada fatta si colora: la linea in C, le orme in D, il percorso sulla mappa | i tre puntini su ogni tappa: segna, su, giù, altro giorno, apri, togli; oppure tieni premuta e trascini |

In tutte: **«visitata» è la soglia del marchio che si chiude** (le sei porte entrano una dentro l'altra, poi la spunta; in tema scuro
color ambra; con «riduci movimento» solo una dissolvenza: `immagini/visitata-fotogrammi.jpg`); si toglie con un altro tocco; sulla mappa
le visitate hanno la spunta. Vale sugli itinerari salvati (la prova parte salvata; senza «Salva» la scheda propone di salvare).
**Calcolo vero**: la pagina usa le funzioni del sito (`src/lib/itinerari/`, messe dentro da `genera.mjs`) con i percorsi tra tutte le tappe
in città: spostando, togliendo o aggiungendo una tappa orari e percorsi si ricalcolano davvero (prima i giri avevano solo i giorni già calcolati).
**«Oggi»** (pannello Idea): il giorno 1 è oggi alle 12:10; le tappe visitate vanno in cima e gli orari ripartono da adesso, come fa il sito.
**La scheda**: foto con il credito, quando, «Da visitare», in breve (visita, chiusura, prenotazione, ingresso, al chiuso, momento), il testo
della tappa, orari, biglietti, come arrivare (le schede vere della build) e le **fonti** di quella tappa con la data del controllo.
Senza foto con licenza libera (Cappella Sansevero) un riquadro con la soglia. «Annulla» dopo ogni «Togli» e «Sposta nel giorno».
Tastiera e lettori di schermo: frecce su e giù sulla maniglia, «Sposta» nella riga aperta, Su e Giù nel menu, frecce tra le schede in fila (4).
Le storie dei luoghi non ci sono ancora (arrivano con i racconti, Fase 3): la scheda usa il testo di oggi.

Controlli del giro 1 (09/10/2026): axe pulito in 80 controlli (C e D, 4 proposte, telefono e computer, chiaro e scuro, schede aperte, menu,
«Modifica»); nessuno scorrimento di lato a 320 e 390 px (anche a scheda aperta); nessun errore nella pagina; prove dei gesti col mouse
(`prove/gesti.cjs`) e col dito simulato (`prove/dito.cjs`): trascinare, scorrere la riga, tenere premuto, tirare su e giù il foglio, sfogliare le
schede, menu, «Modifica», «oggi», «Annulla». Trovato e corretto: col mouse, trascinare sopra una foto avviava il trascinamento dell'immagine.
Limite noto: in D, proposta 2, partendo da una cartolina il dito la scorre (visitata o togli) e non cambia giorno: si cambia giorno dal titolo,
dalle orme o con «1 / 2».

Rifare: `npm run build`, poi `node design/compositore/genera.mjs scheda-giro-1`; con il server «compositore» acceso, gli script in
`scheda-giro-1/prove/` (immagini: `foto.cjs <cartella immagini> 1,2,3,4 light,dark`, poi `fogli.cjs <cartella> 1,2,3,4 light,dark`).

# Pezzo 1: pagina e barra

## Giro 5 (08/10/2026) · https://claude.ai/artifact/UgWbAVT1hHeR7GCUQnVHxu
Cosa ha detto Enrico del giro 4: via G; cambiando giorno col dito la pagina «trema» (deve essere fluida); in C la testata
deve scorrere via con la pagina, un poco alla volta, e restare in alto solo «Giorno 1 / Giorno 2» e il «+» (come in A, schede
più strette del 15%); il «+» in alto aggiunge un terzo giorno; in C anche il tasto «Aggiungi» in basso, come in A; in C la
ricerca di A e il logo scuro giallo come A; pause (anche per mangiare) e margini da cambiare, con la fine stimata e il tempo
a piedi separato dal totale e da quello che resta; «Chiuso il martedì» solo se l'itinerario ha una data (sempre nella scheda);
«Salva» deve restare anche chiudendo la pagina, senza «Cambia nome» subito: «Rinomina» nei tre puntini di «I miei itinerari»;
tutte le tappe sulla mappa; il percorso sulla mappa un 10% più veloce. Dopo la scelta di due proposte: chi visita sceglie la vista.

**Seconda versione (08/10/2026, stesso link)**, dopo l'ultimo giro di Enrico: «quasi tutto perfetto». **Scelte: C e D** (poi chi visita
passa dall'una all'altra), ricerca di A, logo scuro **ambra** ovunque (in D quello avorio era sbagliato). Corretto: in «Aggiungi» il
foglio era più largo dello schermo di 349 px (i filtri dentro un contenitore in più, errore del giro 5): il «+» finiva fuori a destra.
Sulla mappa di «Aggiungi» le tappe sono piccole foto; sul computer, passandoci sopra, foto grande e titolo; tocchi una foto e sopra la
mappa compare la scheda corta con **«Aggiungi»**, tutto nella stessa schermata (`aggiungi-mappa-e-orme.jpg`, `c-pc-passaggio-del-mouse.jpg`).
La mappa si apre sul giorno e sulle 12 tappe più vicine. Percorso ancora +10% veloce (`VELOCITA` 0,327). In D le orme vanno verso la
cartolina dopo (punta in basso), con tacco e suola separati, piede destro e sinistro speculari.

**Il tremolio, misurato** (`immagini/cambio-giorno-prima-giro4.jpg`, un fotogramma ogni 60 ms): nel giro 4 il passaggio tra viste
fotografava la pagina; il giorno restava fermo un attimo, poi il vecchio e il nuovo si sovrapponevano, la pagina saltava di 32 px e il
segno del giorno restava vuoto per mezzo secondo. Adesso (`cambio-giorno-adesso-A.jpg`, `-C.jpg`) il giorno continua il gesto del dito
ed esce, cambia mentre è invisibile, il nuovo entra dall'altro lato; il segno scorre; la barra dei giorni non si sposta (0 px);
la mappa vola dopo, quando il giorno è entrato. In D le cartoline della pagina accanto sono già appoggiate e l'altezza segue il dito.

| | Cosa cambia |
|---|---|
| **A · La rivista** | il tempo del giorno sotto i numeri; la pausa pranzo nella giornata (si tocca per cambiarla); barra dei giorni piena |
| **C · Mappa prima** | testata che scorre via, giorni e «+» fissi in alto (schede −15%); barra in basso con Mappa, Aggiungi, ⋯ quando la testata è sparita; ricerca di A; logo scuro ambra |
| **D · Le pagine** | il tempo del giorno come un biglietto sotto i francobolli; il biglietto della pausa tra le cartoline |

In tutte: **pause e margini** (pranzo già dentro: dopo la tappa dove si mangia, o quella che finisce più vicino alle 13; durata, posto,
caffè e riposo; margine 0, 5, 10 o 15 minuti dopo ogni tratto); **il tempo del giorno** (barra della giornata in fila fino alle 19,
visite, a piedi, pause, margine, in tutto, quanto resta o di quanto sfori); **«fine stimata»** nei numeri; **data** («Data e orari»:
con martedì 13 ottobre il MANN e la Cappella Sansevero risultano chiusi; senza data il giorno di chiusura sta solo nella scheda);
**tutte le tappe sulla mappa** (tasto con i due segnaposto; nel giorno vuoto si vedono subito; un punto apre la scheda con
«Aggiungi al giorno»); **Aggiungi** con «Elenco / Mappa»; **salvataggio** sul telefono anche prima di «Salva» («Non ancora salvato»,
come nella specifica) e dopo la riapertura; **Rinomina** nei tre puntini; percorso sulla mappa più veloce del 10% (`VELOCITA` 0,297).
Le pause si calcolano sopra il calcolo del sito (spostano gli orari dopo; i tempi a piedi restano quelli veri): nel sito vero andranno
nel calcolo (`src/lib/itinerari/calcolo.ts`), con i test.

## Giro 4 (08/10/2026) · https://claude.ai/artifact/8Kx3ZmzRGZVk3RKmS3zVZ3
Cosa ha detto Enrico del giro 3: in A i numeri non tutti insieme ma come in C (sotto «Giorno 1 / Giorno 2» quelli del giorno scelto);
cambiare giorno anche trascinando di lato (telefono e computer); in C la barra con giorni e numeri deve salire e sparire quando scorri giù;
gli piace la mappa come sfondo di C sul computer; logo da rifare per il tema scuro (una proposta diversa per ognuna); un tocco sulla tappa
apre subito la scheda, e la scheda si apre in modo più vivo; un «Salva» diverso per ognuna; G non gli piace ma resta, senza toccarla.
«Premium» vuol dire un sito che sembra costato centinaia di migliaia di dollari (non lettere maiuscole: le aveva scritte in maiuscolo per dire quanto).

| | Logo in tema scuro | «Salva» | Ricerca (da giro 3) |
|---|---|---|---|
| **A · La rivista** | archi color ambra | il segnalibro scende, si riempie, compare la spunta | il campo si allarga, il testo si scrive da solo |
| **C · Mappa prima** | archi pervinca chiari | il segnaposto cade e manda un'onda, come nel marchio | il pulsante «Aggiungi» diventa la barra |
| **D · Le pagine** | archi color avorio | un timbro si stampa: il pulsante diventa un timbro inclinato | un foglietto di carta scende |
| **G · Il cammino** | come prima | come A | la lente in un cerchio |

In tutte (G compresa, senza lavoro in più): un tocco sulla tappa apre subito la scheda e la foto vola dalla riga alla scheda; si cambia giorno
trascinando di lato (dito, mouse, due dita sul touchpad) e il giorno nuovo entra dal lato giusto; i numeri del giorno scorrono ai valori nuovi.
Solo C: la barra in cima al foglio sparisce scorrendo giù e torna risalendo; le tappe entrano una dopo l'altra.

## Giro 3 (08/10/2026) · https://claude.ai/artifact/TakbK2ZMUwn2mZFYuQmo3w
Cosa ha detto Enrico del giro 2: E ed F no (troppo astratte); l'arco di pietra non gli piace (nemmeno nella home);
i numeri per ogni giorno, separati; logo animato al passaggio del mouse (se ci ripassi a metà, finisce e poi riparte);
mappa da spostare e ingrandire; percorso disegnato in fila e più lento (−20%); serve «Elimina»; «Salva» più lento;
cambio di giorno più lento (−10%); un'animazione di ricerca diversa per proposta, per scegliere; D da rifinire (cartoline e linea tra i posti); una proposta nuova un po' astratta.

| | Cosa c'è |
|---|---|
| **A · La rivista** | copertina con la foto (senza arco), indice dei giorni con i numeri di ciascuno, che serve anche per cambiare giorno; ricerca: il campo «Cerca» si allarga e il testo d'esempio si scrive da solo |
| **C · Mappa prima** | mappa che si sposta e si ingrandisce, foglio con tre fermate, numeri del giorno in cima al foglio; ricerca: il pulsante «Aggiungi» diventa la barra |
| **D · Le pagine** | cartoline che si appoggiano mentre scorri, le orme dei passi al posto della linea tratteggiata, i numeri come francobolli; ricerca: un foglietto di carta che scende |
| **G · Il cammino** (nuova) | la giornata come una strada a curve, tappe ai lati, un puntino che cammina mentre scorri; ricerca: la lente che si allarga in un cerchio |

In tutte: «Elimina» (nei tre puntini e in «I miei itinerari», con conferma e «Annulla»); «Salva» più lento (il segnalibro scende, si riempie, compare la spunta).

## Giro 2 (08/10/2026) · https://claude.ai/artifact/DM5hwnNeoTEfxcXQBR7KVp
Cosa ha detto Enrico del giro 1: B no; A sì, C e D da migliorare molto («premium», «costato tantissimo»); altre due più astratte;
«Aggiungi» deve proporre **tutte** le tappe, dalla più vicina; più movimento (pulsanti, Salva, ricerca), ma prima si sceglie la pagina.

| | Idea della pagina | Barra del compositore |
|---|---|---|
| **A · La rivista** | il portico di piperno vero intorno alla foto; i numeri del viaggio in Bodoni; linea a puntini che si disegna; tempo libero e tre tappe vicine in fondo al giorno; sul computer la mappa dentro l'arco di pietra | «isola» blu notte che si fa piccola scorrendo |
| **C · Mappa prima** | mappa con vicoli, scale, pedonali e nomi delle vie (prova della «strada A»); percorso che si disegna; la mappa si allontana quando sale il foglio | in cima al foglio; la mappa vola tra giorni e tappe |
| **D · Le pagine** | un giorno = una pagina da sfogliare, il titolo scorre più piano; cartoline con il timbro dell'ora | barra a icone che si nasconde scorrendo; sul computer colonna a sinistra |
| **E · La soglia** (nuova, astratta) | le soglie del marchio fatte di piperno, una dentro l'altra; scorrendo le attraversi e cambi tappa | in basso, i giorni come piccole soglie; «Elenco» per comporre |
| **F · Il quadrante** (nuova, astratta) | la giornata su un orologio da polso; la lancetta segue la tappa che leggi | in basso, con un quadrante piccolo e la tappa del momento |

Comune a tutte: il marchio animato all'apertura; «Aggiungi» con tutte le 36 tappe, divise per distanza (meno di 10 minuti,
tra 10 e 25, più lontane), con ricerca, filtri e avvisi veri («Finiresti alle 19:40», «Lontana dalle altre»); la tappa aggiunta entra e si accende,
l'ora di fine scorre al valore nuovo; «Salva» che si riempie e diventa «Salvato». Ricerca: `ricerca/2026-10-08-compositore-premium.md`.

Strade piccole della mappa (`strade.json`, da `strade.mjs`): OpenStreetMap del 08/10/2026 per la zona dei due giorni,
**213 KB (79 KB compressi)** con vicoli, pedonali, scale e 110 nomi di vie. Misura utile per la decisione sulla mappa (pezzo 5).

## Giro 1 (08/10/2026) · https://claude.ai/artifact/RZjEC51fAQRN2hF3oGekdg
A la rivista, B il nastro, C mappa prima, D le pagine. File in `giro-1/` (fermi: i dati sono del formato di allora).

## File
- `genera.mjs <giro>`: mette dati, foto, caratteri, marchio, pietra del portico e strade dentro `giro-N/modello.html` (+ `stile.css`, `app.js`) e scrive `giro-N/proposte.html` (quella pubblicata).
- `foto.cjs <cartella> [proposte] [scene] [giro]`: immagini da telefono e computer, chiaro e scuro, e controllo a 320 e 390 px.
- `strade.mjs <file Overpass>`: le strade piccole (scaricate da Overpass con `way[highway]` e `out tags geom` nel riquadro lat 40.8171–40.8644, lon 14.2246–14.2737).
- `servi.mjs`: server locale (preview «compositore», porta 4332).

Nel repository: codice dei giri, pagina del giro 1 (ferma), immagini JPG. Le PNG e le pagine dei giri 2–5 non ci sono (`.gitignore`):
si rifanno con i comandi qui sotto; quelle pubblicate restano ai link di ogni giro.

## Rifare tutto
1. `npm run build` (serve `dist/napoli/itinerari/`)
2. `node design/compositore/genera.mjs giro-5` (ogni giro ha la sua cartella `giro-N/` con `modello.html`, `stile.css`, `app.js`; un giro nuovo parte copiando quello prima)
3. con il server acceso: `node design/compositore/foto.cjs design/compositore/giro-5/immagini a,c,d tel,giu,pc giro-5`

Controlli del giro 5 (08/10/2026): nessun errore nella pagina, nessuno scorrimento di lato a 320 e 390 px, axe pulito in 32 controlli
(A, C, D, telefono e computer, chiaro e scuro, più i fogli nuovi aperti: Pause e margini, Pausa pranzo, Aggiungi sulla mappa, Data e orari,
I miei con i tre puntini); 37 prove automatiche con il movimento acceso (pause, margine, data, salvataggio dopo la riapertura, Rinomina,
mappa con tutte le tappe, barra in basso di C, giorno 3, D trascinato col mouse); pellicole del cambio di giorno in A, C e D.

Controlli del giro 4 (08/10/2026): nessun errore in console, nessuno scorrimento di lato a 320 e 390 px, axe pulito (telefono e computer,
chiaro e scuro); prove: trascinare di lato in A e C (dito) e in D sul computer (mouse), scheda che si apre subito in A e C, barra di C che sparisce
e torna, i tre «Salva», i tre loghi scuri.

Controlli del giro 3 (08/10/2026): nessun errore in console, nessuno scorrimento di lato a 320 e 390 px (chiaro e scuro), axe pulito
(telefono e computer, chiaro e scuro); prove con il movimento acceso: logo che finisce il giro e poi ne fa un altro, mappa trascinata
con il mouse e con il dito, percorso in fila, le 4 ricerche, Elimina con «Rimettilo com'era», Salva.

Controlli del giro 2 (08/10/2026): nessun errore in console, nessuno scorrimento di lato a 320 e 390 px, axe pulito in chiaro e scuro
(telefono e computer), prove dei tasti con il movimento acceso (giorni, Aggiungi con filtri, Salva, tocco sulla mappa).
