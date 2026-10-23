# Revisione codice 21 · quote prima della cache

18 ottobre 2026, base 23450b5. Settimo gruppo della sessione continuativa di almeno 45 minuti; si prosegue.

Il downloader poteva scrivere griglie incomplete, trasformare campioni non numerici in quote oppure serializzare NaN/Infinity come null. Il codice ora verifica dimensioni, origine, orientamento atteso del raster Copernicus e copertura del riquadro prima di leggere i campioni; verifica numero e tipo dei campioni, il NoData dichiarato dall'immagine, l'arrotondamento e il risultato finale con validaQuote prima di scrivere.

Non viene indovinato un valore NoData: si usa getGDALNoData della libreria GeoTIFF già installata, verificata nel relativo sorgente locale. Zero e quote negative numeriche restano ammesse. Il download specifico richiede il raster orientato come previsto dal suo URL; il generatore continua ad accettare i passi con segno già supportati nelle griglie locali.

- Cinque riproduzioni fallite prima delle rispettive correzioni; **sei prove nuove** con raster/letture fittizi. Provati valori mancanti, non finiti, null/stringhe, NoData, metadati errati, copertura parziale e valori negativi validi.
- **408/408 test**, zero fallimenti, salti o cancellazioni; build ordinaria di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker 38fb7f64d13c.
- Log nella cartella della chat: nextstop-quote-cache-test-2026-10-18.log, nextstop-quote-cache-build-2026-10-18.log, nextstop-quote-cache-links-2026-10-18.log.

Nessun TIFF o altro dato scaricato, cache reale modificata o dato generato riscritto. Non introdotti riempimento dei vuoti o correzioni delle quote; l'input mancante viene rifiutato. Nessuna nuova dipendenza, browser o pubblicazione. Area 3 aperta: seguito sui disegni compressi prima della build. Nuova idea rinviata anche nell'analisi.
