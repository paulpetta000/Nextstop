# Revisione codice 16 · calendario e partenze bus

18 ottobre 2026, base ba88f25. Secondo gruppo della sessione di almeno 45 minuti; il lavoro continua.

Un lettore condiviso, calendario-bus.mjs, ora controlla sia i file prima di generazione/build sia i pacchi ricevuti dal browser. Tre prove fallivano prima: partenza specifica estranea all'insieme della fermata, corsa senza salita/chiavi malformate e calendario o somme incoerenti prima della build. Ora vengono rifiutate prima di entrare nel calcolo.

Conservati gli orari dopo mezzanotte, i giorni senza corse, le durate frazionarie e i duplicati di partenze consentiti dal formato. Somme non finite e arrivi che traboccano vengono rifiutati. Non introdotto un limite arbitrario di 24 ore. Il lettore costruisce le mappe una volta sola; la build mantiene i propri controlli su linee e nomi delle fermate.

- **368/368 test**, quattro aggiunte; nessun fallimento, salto o cancellazione.
- Confronto profondo identico fra decoder precedente e nuovo sul pacco reale: **8.793 candidati, 101 date e sette tipi di giorno**. File sorgente invariati.
- Build ordinaria di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker 527bd56986ca.
- Log nella cartella della chat: nextstop-calendario-bus-test-2026-10-18.log, nextstop-calendario-bus-build-2026-10-18.log, nextstop-calendario-bus-links-2026-10-18.log.

Il controllo accerta coerenza interna, non puntualità o corrispondenza agli orari odierni del gestore. Nessuna fonte reale scaricata o rigenerata; nessun browser, installazione o pubblicazione. Si prosegue sulla lettura degli orari GTFS, distinguendo arrivo, partenza e fermate utilizzabili. Area 3 aperta; nuova idea rinviata anche nell'analisi.
