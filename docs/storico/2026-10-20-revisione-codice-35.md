# Revisione codice 35 · caricamenti di calendario e ore

20 ottobre 2026, base 0078be3. Secondo gruppo della ripresa iniziata alle 14:06:49 UTC, con mandato di almeno 40 minuti.

Il foglio Data e orari conserva il contesto della propria apertura, dell’itinerario e del giorno. Un caricamento di calendario o ore non apre più finestre dopo chiusura, riuso dello stesso dialog o cambio di viaggio/giorno. Tra richieste concorrenti prevale l’ultima; i ritorni di finestre precedenti non ridisegnano né spostano il fuoco sul nuovo foglio. Gli errori d’importazione mostrano un messaggio con nuovo tentativo e conservano i dati.

Dieci prove nuove sulla funzione reale: solo il confine dell’importazione dinamica è sostituito con promesse controllate. Nove casi fallivano prima della correzione, il percorso ordinario passava. **516/516 test**, zero fallimenti, salti o cancellazioni; build **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **c20d0dd4e94d**. Log della chat: nextstop-fogli-caricamenti-{test,build,links}-2026-10-20.log.

Nessun browser: interazioni native e resa visiva pendenti. Dati, ID, URL, CSS, dipendenze e materiali privati invariati. Tutto locale, nessun push, merge o deploy. Area 3 ancora aperta; prosegue il controllo delle schede delle tappe. Le altre sette aree restano conservate e la nuova idea è rinviata anche nell’analisi.
