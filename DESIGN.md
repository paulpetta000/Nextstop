# DESIGN · Nextstop

_Scritto il 07/10/2026 dopo le scelte di Enrico: grafica **A «Rivista»** (stile MUDD) e marchio **«la soglia astratta»**._
_Bozzetti di riferimento: `design/home/a.html` (home, racconto, compositore) e `design/logo/loghi-7.html` (marchio). Lo legge la skill `design-sito`._

## 1. L'idea
Una rivista di viaggio stampata su pietra chiara: **foto grandi**, **archi** (le foto ritagliate ad arco come i portali), **bande blu notte**,
titoli compatti e grandi, titoli dei racconti con le grazie, foglietti «da sapere» appoggiati un po' storti. Telefono per primo.
Una sola cosa forte per pagina; tutto il resto quieto.

## 2. Colori
| Nome | Chiaro | Scuro | Per cosa |
|---|---|---|---|
| `--carta` | `#F7F6F2` | `#0F1524` | fondo delle pagine |
| `--pietra` | `#ECEAE4` | `#19223A` | riquadri, foglietti, etichette |
| `--pietra-2` | `#E1DED6` | `#222D48` | foglietti alternati |
| `--riga` | `#D6D2C8` | `#2B3653` | linee sottili, bordi |
| `--inchiostro` | `#16181D` | `#EEF0F4` | testo |
| `--inchiostro-2` | `#575B65` | `#A8AFBD` | testo secondario |
| `--notte` / `--su-notte` | `#142039` / `#F3F1EC` | `#080C17` / `#EEF0F4` | bande scure, menu |
| `--tufo` | `#E0A51B` | `#F0BE3E` | accento: la linea a puntini, i punti delle tappe. **Mai per il testo** su carta |
| `--tufo-testo` | `#7A5600` | `#F0BE3E` | quando l'accento è testo |
| `--avviso` / `--su-avviso` | `#FBEFD0` / `#5E4300` | `#33290F` / `#F6DA8E` | avvisi (chiuso quel giorno) |
| `--chiuso` | `#A8231B` | `#FF8F86` | tappa chiusa |
- Il blu del marchio (pervinca `#4B5DBE`, notte `#10173A`) sta **solo nel marchio** e nel segnaposto.
  **Da decidere vedendo l'anteprima**: l'accento del sito resta il giallo tufo o passa al pervinca del marchio.
- Foto in tema scuro: un velo scuro leggero sopra (`--velo`), mai foto a piena luce su fondo nero.

## 3. Caratteri
Solo caratteri liberi (OFL), serviti dal sito (`public/fonts/`), mai da Google dal vivo.
| Ruolo | Carattere | Impostazioni |
|---|---|---|
| Titoli grandi, cifre, nome del marchio | **Archivo** (variabile, già in `public/fonts/archivo-var.woff2`: controllare che abbia l'asse `wdth`) | titoloni: peso 800, `wdth` 70, interlinea .92, spaziatura −0,015em; nome: peso 560, `wdth` 96, −0,035em |
| Titoli dei racconti e delle sezioni | **Bodoni Moda** (da scaricare in `public/fonts/`, con l'OK di Enrico) | peso 600, `font-optical-sizing: auto` |
| Testo | Archivo | peso 400, 17 px, interlinea 1,55, righe di 65–75 caratteri |
- Orari e numeri: `font-variant-numeric: tabular-nums`.
- Niente maiuscolo per le etichette, niente parole colorate dentro i titoli.

## 4. Spazi e forme
- Ritmo di 4 e 8 px. Margine laterale 20 px (mai sotto i 16). Contenuto al massimo 72rem.
- Sezioni: `clamp(3.5rem, 10vw, 6.5rem)` sopra e sotto.
- **Arco**: `border-radius: 999px 999px 14px 14px` per le foto delle schede e dei racconti (rapporto 3:4 o 4:5).
- **Rombo** (una volta per pagina al massimo): foto a cavallo tra una banda chiara e una scura.
- **Foglietti**: riquadri `--pietra` con angoli di 18 px, ruotati tra −2° e +2,2°.
- Pulsanti a pillola (raggio 999 px, altezza minima 48 px); riquadri con angoli di 14–18 px. Aree da toccare di almeno 44 px.

## 5. Componenti (come nei bozzetti)
- **Testata**: marchio a sinistra, menu tondo a destra. Sulla home sta **sopra la foto** (testo bianco, marchio nella versione «foto»); nelle altre pagine è chiara e resta in alto.
- **Menu**: pannello blu notte da destra (popover), voci grandi in Archivo stretto, la pagina in cui sei segnata con il punto; si chiude con ×, Esc o tocco fuori.
- **Apertura della home**: foto a tutto schermo con velo in basso, «Napoli, con i tempi veri.», le scelte «Quanto tempo hai?» (pillole chiare con il numero tondo).
- **Schede degli itinerari**: foto ad arco, nome con le grazie, tappe e minuti a piedi (dalla build). Sul telefono scorrono di lato.
- **Racconto**: apertura con foto ad arco, cifre (giorni, tappe, minuti a piedi), giorno per giorno su banda notte; ogni tappa con l'ora in un tondo, la linea a puntini color tufo, i tratti («3 min a piedi, 230 m»), i foglietti «Da sapere» e il locale per pranzo; fonti in fondo in un elenco che si apre.
- **Compositore**: nome, data, orari, giorni a pillola con l'indicatore che scorre, avviso, riassunto, tappe in riquadri `--pietra` con maniglia, tratti a puntini, «Aggiungi una tappa» con il foglio che sale dal basso e la ricerca, la mappa vera.

## 6. Movimento
- Interfaccia: 100 / 150 / 200 / 300 ms; entrata `cubic-bezier(.16,1,.3,1)`, uscita `cubic-bezier(.7,0,.84,0)`. Si muovono solo posizione e trasparenza.
- Al tocco: `scale(.97)` per 100 ms. Liste che entrano: una dopo l'altra, 30 ms di distanza (al massimo 10).
- Scorrimento: la linea a puntini che si disegna e i foglietti che si appoggiano, solo con `@supports (animation-timeline: view())`; senza, tutto è già al suo posto.
- Passaggio tra pagine: View Transitions (`@view-transition { navigation: auto; }`), la foto della scheda diventa la foto del racconto.
- Momenti del marchio (fino a ~2 s, eccezione scritta): la soglia astratta e il nome che si scrive (vedi sotto).
- «Riduci movimento»: tutto fermo, al massimo una dissolvenza. Nessuna animazione infinita.

## 7. Il marchio: la soglia astratta
- **Il segno**: sei porte ad arco una dentro l'altra, ognuna 0,8 volte la precedente verso il punto di fuga; in fondo, nella luce, il segnaposto.
  Geometria e colori in `design/logo/marchio.mjs`; file in `design/logo/scelto/` (`node design/logo/genera-marchio.mjs`).
- **Il nome**: «nextstop» in Archivo 560, con il **segnaposto al posto della «o»**. Sotto, «itinerari in città» in Bodoni corsivo (solo nelle versioni grandi).
- **Versioni**: `icona` (con il fondo `#0A0F27`: telefono, risultati di ricerca, scheda del browser), `chiaro` (intestazione delle pagine), `scuro` (bande e piè di pagina),
  `foto` (sopra le foto calde della home: archi color ambra, segnaposto blu). Per una foto fredda si sceglie di nuovo a occhio, guardando la foto.
- **Animazione**: le soglie compaiono una dopo l'altra (140 ms di distanza, 900 ms ciascuna), poi il segnaposto cade e si assesta.
  Il nome si scrive da sinistra: un percorso a puntini corre sotto le lettere, le lettere salgono mentre passa (120 ms l'una), il segnaposto cade al posto della «o» e manda un'onda; poi compare «itinerari in città».
  Si vede una volta all'apertura della home, non a ogni pagina.
- **Su Google e nella scheda del browser l'icona è ferma**: Google mostra solo un'immagine fissa. L'animazione vive sul sito.
- Spazio libero intorno: almeno un quarto della larghezza del segno. Sotto i 24 px si usa l'icona con il fondo.
- Il nome è provvisorio (dopo l'avvocato): il segno resta, cambia solo la parola.

## 8. Controlli di ogni pagina
Telefono a 320 e 390 px senza scorrimento di lato, chiaro e scuro, axe pulito, Lighthouse su telefono 95 o più, «riduci movimento», nessun errore in console.
Controllo di coerenza con consistent-ui (obiettivo: almeno 35 su 40) e ux-audit di VectorLab.
