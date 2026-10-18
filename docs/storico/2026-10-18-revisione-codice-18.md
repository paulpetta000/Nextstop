# Revisione codice 18 · conversioni e indici dei pacchi

18 ottobre 2026, base 41f4d8e. Quarto gruppo della sessione di almeno 45 minuti; il lavoro prosegue.

Riprodotti quattro difetti prima della correzione: distanze finite che diventano infinite nella conversione in metri, scenario che applica una distanza traboccante, coppie duplicate/fuori città nel pacco bus e somma non finita dei minuti fissi di un candidato.

Ora le distanze vengono controllate anche dopo la conversione, la somma dei segmenti resta finita e le coppie non possono essere duplicate. Il caricamento passa al decoder il numero di punti della città per rifiutare indici esterni. Chi usa il decoder precedente senza questo argomento mantiene compatibilità; il formato trasmesso non cambia. Una prova sulla funzione reale di caricamento verifica copia precedente conservata dopo il rifiuto e successivo recupero con il pacco valido.

- **383/383 test**, sei aggiunte; zero fallimenti, salti o cancellazioni.
- Build ordinaria di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker 38fb7f64d13c.
- Log finali nella cartella della chat: nextstop-numeri-pacco-test-finale-2026-10-18.log, nextstop-numeri-pacco-build-2026-10-18.log, nextstop-numeri-pacco-links-2026-10-18.log.

Non introdotti limiti geografici o distanze massime inventate: numeri grandi ma rappresentabili restano accettati. Nessun JSON, ID, URL, memoria locale, CSS o dipendenza cambiati. Nessun browser o pubblicazione. Area 3 ancora aperta; segue lettura dei riquadri XML cartografici. Nuova idea rinviata anche nell'analisi.
