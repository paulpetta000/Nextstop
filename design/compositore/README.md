# Compositore, pezzo 1: pagina e barra

Proposte con i dati veri di «Due giorni a Napoli»: orari, tempi a piedi e percorsi calcolati dal sito (giorno feriale), foto e
caratteri del sito. Regola di Enrico: 4 proposte molto diverse per pezzo, si itera su quello che va. Specifica: `specifiche/compositore.md` (sezione 1).

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
