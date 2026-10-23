# Revisione codice 36 · richieste delle schede e azioni sul giorno

20 ottobre 2026, base 47b016e. Terzo gruppo della ripresa iniziata alle 14:06:49 UTC. Enrico ha esteso il lavoro a più aree, escludendo del tutto istruzioni e consumo Claude; ha poi richiesto almeno altri **40 minuti dalle 14:19:21 UTC**. Il tempo precedente non conta nel nuovo minimo.

Le aperture delle schede condividono una sequenza di richieste: prevale l’ultima e chiudere tutte le schede annulla anche caricamenti ancora in attesa. Una risposta obsoleta non apre finestre dopo cambio di viaggio, giorno, oggetto del giorno, vista o foglio. La scheda esterna usa il caricamento già eseguito. Il ritorno del fuoco viene assegnato solo alla richiesta valida.

Le azioni Aggiungi, Gita e Vai al giorno controllano l’esito della chiusura e l’identità di viaggio e giorno; non agiscono su un giorno scelto durante l’animazione. Il doppio tocco produce una sola azione. Il contesto del foglio può ora controllare anche un caricamento iniziato senza finestra aperta, invalidandosi alla prima nuova apertura.

Undici prove sulle funzioni reali delle schede con promesse e DOM fittizi: nove fallivano prima della correzione e due percorsi ordinari passavano. Altre due prove verificano i contesti aperti/chiusi. **529/529 test**, zero fallimenti, salti o cancellazioni; build **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **a83deb62bf36**. Log della chat: nextstop-schede-{prima,caricamenti-test,caricamenti-build,caricamenti-links}-2026-10-20.log.

Nessun browser: interazioni native e resa visiva pendenti. Nessun dato sorgente, ID, URL, CSS, dipendenza o materiale privato cambiato; nessun push, merge o deploy. Le animazioni interne di cambio/chiusura della scheda e i gesti restano da completare nell’area 3. Seguito su dati/fonti, HTTP pubblico, manutenzione, organizzazione e casi di valore; area 1 esclusa su richiesta. La nuova idea resta rinviata anche nell’analisi.
