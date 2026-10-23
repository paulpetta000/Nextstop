# Revisione codice 20 · cache dei riquadri cartografici

18 ottobre 2026, base 440de30. Sesto gruppo della sessione di almeno 45 minuti; si continua.

Il downloader scriveva direttamente il nome definitivo e accettava HTTP 200 senza leggere il documento. Ora curl usa un file provvisorio, il lettore XML verifica il contenuto e solo dopo il modulo comune scrive la cache completa. Retry e suddivisione in quattro su HTTP 400 conservati; ogni figlio e la sua pausa devono finire prima di dichiarare conclusa la suddivisione.

Una cache già presente viene verificata prima di riusarla; se non valida, è segnalata e conservata. Non viene cancellata o sostituita automaticamente. Le pause usano Node e non richiedono il programma Unix sleep; curl resta necessario come prima. Eliminata soltanto la pausa inutile dopo l'ultimo tentativo fallito.

- Quattro riproduzioni fallite prima delle correzioni; **sette nuove prove**, rete/pausa fittizie e filesystem temporaneo. Nessuna chiamata reale a curl o a server cartografici.
- Provati risposta 200 troncata, cache esistente invalida/valida, disco pieno senza cache parziale, errore HTTP ripetuto, suddivisione e attesa sequenziale dei figli tramite promesse controllate.
- **402/402 test**, zero fallimenti, salti o cancellazioni; build ordinaria di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker 38fb7f64d13c.
- Log nella cartella della chat: nextstop-download-mappa-test-2026-10-18.log, nextstop-download-mappa-build-2026-10-18.log, nextstop-download-mappa-links-2026-10-18.log.

Non aggiunta una transazione su tutti i riquadri: se un figlio fallisce, le cache valide già finite restano riutilizzabili. Una terminazione forzata può lasciare una cartella provvisoria, che non ha estensione .xml e non è riusata come cache. Nessuna cancellazione di cartelle esistenti, installazione, mappa reale rigenerata, browser o pubblicazione. Seguito su quote e disegni prima della build; area 3 aperta, nuova idea rinviata anche nell'analisi.
