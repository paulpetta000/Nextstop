# Revisione codice 14 · preparazione e scrittura dei dati generati

18 ottobre 2026, base e5b39ca. Proseguimento dell'area 3 del piano originale.

## Risultato

- Il generatore degli itinerari scriveva tempi, partenze e linee prima di preparare i disegni. Riprodotto l'errore leggendo una mappa non valida: tre file già aggiornati prima del fallimento. Ora prepara e serializza tutte le uscite, compreso l'eventuale PERCORSI, prima delle sostituzioni. Destinazioni duplicate rifiutate prima di scrivere.
- Modulo comune scripts/scrivi-file.mjs: temporanei esclusivi nella stessa cartella della destinazione, scrittura e sincronizzazione, chiusura, poi rename del file completo. Tutti i temporanei del gruppo vengono preparati prima del primo rename. Pulizia nei guasti ordinari; eventuali errori di pulizia vengono riportati insieme al guasto principale.
- Lo usano il generatore degli itinerari, le tre cache del relativo downloader e gli output mappa/strade. Prima, un disco pieno poteva lasciare osm.json o anm-gtfs.zip tronchi, poi scambiati per cache esistenti: entrambe le prove fallivano prima della correzione e ora riescono. Nessun download reale effettuato.
- I cinque file del generatore ricevono una marcatura deterministica comune, calcolata sul loro contenuto e sulla proiezione della mappa. La build verifica sia la marcatura comune sia l'impronta ricalcolata prima di assegnare il riferimento ai pacchi pubblici. Due calcoli dello stesso giorno con identiche posizioni non vengono più confusi.
- Proiezione con dimensioni o riquadro non validi rifiutata prima di codificare i percorsi. Nessuna modifica alle formule del modello o ai dati attuali.

## Prove

- **18 prove aggiunte**, per un totale di **356/356**, senza salti o cancellazioni. Primo giro: il processo del test invariato concorrenza-worker.test.mjs si è chiuso con il solo errore generico «test failed», senza una causa applicativa identificata. Prova isolata riuscita; successiva suite completa riuscita. Conservati entrambi i log, senza attribuire il primo errore alle modifiche o al runtime in assenza di prove.
- Prove filesystem reali in cartelle temporanee: UTF-8/Buffer/URL, disco pieno sul secondo file, errore di sincronizzazione, rename rifiutato, contenuti non validi, destinazioni duplicate, errori di pulizia e file prima assente.
- Dieci interruzioni simulate nei cinque punti di sostituzione, da base precedente e da base già marcata. Prima del primo rename resta il gruppo precedente; dopo una sostituzione il gruppo misto è rifiutato. Dieci recuperi completi riusciti, nessun temporaneo residuo nelle prove.
- Verifica solo in memoria dei cinque JSON reali, **8.800.477 byte**: dati originari conservati esattamente dopo marcatura e rilettura, escluso il nuovo campo. La base precedente accetta il gruppo misto costruito per la prova; il nuovo controllo lo rifiuta. Nessun JSON sorgente scritto.
- Build ordinaria di **12 pagine**; **13 documenti / 811 link interni validi**; **82 risorse offline**, versione worker invariata 8f1b1aab606e. Sintassi dei quattro comandi verificata senza eseguirne download o rigenerazioni. Nessun codice Node della marcatura nei JavaScript del browser.
- Log locali nella cartella della chat: nextstop-uscite-test-2026-10-18.log, nextstop-uscite-test-ripetuto-2026-10-18.log, nextstop-uscite-build-2026-10-18.log, nextstop-uscite-links-2026-10-18.log.

## Compatibilità e limiti

La sostituzione riguarda il singolo file, **non è una transazione atomica sull'intero gruppo**. Un errore durante i rename può lasciare file completi di generazioni diverse: vengono rifiutati dalla build, poi si rilancia l'intera generazione autorizzata. Non aggiunti rollback, lock tra processi, aggiornamenti automatici o garanzie di durata dopo perdita di alimentazione. Una terminazione forzata può lasciare temporanei .tmp; non vengono considerati cache complete. Le vecchie cache già corrotte non sono riparate automaticamente.

Il gruppo storico interamente privo di marcatura resta compatibile e mantiene i controlli precedenti. La nuova garanzia sul gruppo inizia dalla prossima rigenerazione con questo codice; non certifica retroattivamente tutti i dati storici e non prova la correttezza delle fonti. Nessun dato reale rigenerato, nessuna installazione, browser, pubblicazione, delega o nuova automazione.

Area 3 ancora aperta: seguito sui controlli delle matrici finali e dei riferimenti tra candidati bus, partenze e disegni; verifiche browser separate finché il browser resta escluso. L'idea multi-città e registro aggiornamenti resta rinviata, inclusa analisi e stesura.
