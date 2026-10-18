# Revisione codice 22 · disegni prima della build e riepilogo

18 ottobre 2026, base 3e413bf. Ottavo gruppo della sessione continuativa di almeno 45 minuti richiesta da Enrico.

## Risultato

La build controllava le dimensioni delle matrici dei disegni, ma accettava stringhe compresse illeggibili. Ora usa lo stesso decoder puro della mappa: niente logica duplicata e nessuna dipendenza Node nel browser. Disegni troncati, vuoti fuori diagonale, candidati senza disegno e modi estranei alle linee della città vengono rifiutati prima della scrittura/build. Conservati diagonali vuote, differenze zero e coordinate con segno. Il decoder client mantiene il comportamento precedente.

Il lettore dei path brevi dei nomi delle strade poteva scartare l'ultimo numero isolato o leggere numeri fra testo estraneo, e propagare Infinity. Ora rifiuta l'intero path non valido. Non introduce un limite geografico inventato o cambia le coordinate dei dati validi.

- Cinque riproduzioni fallite prima delle correzioni; **sei prove aggiunte**, totale **414/414**, zero fallimenti, salti o cancellazioni.
- Confronto profondo identico su **21.180 disegni distinti, 1.332.817 punti**. Il conteggio comprende la stringa vuota delle diagonali. Controllo strutturale completo sui dati reali in circa 182 ms locali; non è una misura del browser.
- Lettura identica su **16.363 path distinti** delle strade reali, solo in memoria. Nessun JSON sorgente riscritto.
- Build ordinaria di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker 448965ff0e9a. Nessun modulo Node dei controlli di build nei JavaScript del browser.
- Log nella cartella della chat: nextstop-geometrie-finale-test-2026-10-18.log, nextstop-geometrie-finale-build-2026-10-18.log, nextstop-geometrie-finale-links-2026-10-18.log.

## Blocchi della sessione

Da **356 a 414 prove**, **58 aggiunte**, con otto gruppi collegati:

| Gruppo | Risultato | Prove |
|---|---|---|
| [15](2026-10-18-revisione-codice-15.md) | Matrici e riferimenti degli output | 364 |
| [16](2026-10-18-revisione-codice-16.md) | Calendario e partenze condivisi | 368 |
| [17](2026-10-18-revisione-codice-17.md) | Arrivi, partenze e accessi ai bus | 377 |
| [18](2026-10-18-revisione-codice-18.md) | Conversioni e indici dei pacchi | 383 |
| [19](2026-10-18-revisione-codice-19.md) | Riquadri XML completi e coerenti | 395 |
| [20](2026-10-18-revisione-codice-20.md) | Download/cache cartografici | 402 |
| [21](2026-10-18-revisione-codice-21.md) | Quote e NoData prima della cache | 408 |
| Questo | Disegni compressi e path delle strade | 414 |

Le prove di rete usano risposte fittizie; nessun feed, raster o riquadro reale scaricato. Nessuna rigenerazione dei JSON sorgente, installazione, delega, automazione, sessione Google, modifica di protezioni, browser, push, merge o deploy. Conservati ID, URL, memoria locale, CSS e dipendenze. Strumenti locali già disponibili sufficienti; nessun passaggio al cloud necessario.

## Parti ancora aperte

L'area 3 del piano originale resta aperta. Questi controlli provano leggibilità e coerenza interna; non certificano puntualità, precisione sul posto o qualità visiva. Il modello bus resta mediano e aggregato per fascia; le correzioni dei generatori richiedono una successiva rigenerazione autorizzata. Restano verifiche nel browser e tra schede reali finché il browser è escluso.

Seguito da computer: controllo dei costi della ricerca dei nomi delle vie con geometrie estreme e degli altri moduli non ancora coperti, poi parti aperte delle altre aree del piano. Nessuna dichiarazione di revisione completa o rilascio. La nuova idea multi-città e registro aggiornamenti resta rinviata, compresa analisi e stesura.
