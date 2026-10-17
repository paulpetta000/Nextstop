# Revisione del codice · gruppo 3 · dati, recupero e offline

17 ottobre 2026, base 53cebf3, ramo codex/satori-fflate. Continuazione autorizzata da Enrico: sessioni di revisione di almeno quindici minuti salvo richiesta di fermarsi, con più parti collegate insieme. La preferenza vale per questa revisione, non aggiunge lavoro automatico alle conversazioni normali. Nessuna pubblicazione, installazione, lettura di account o uso del browser. Prova reale Claude rinviata a dopo main/pubblicazione.

## Dati caricati dopo l'apertura

- Il pacco degli scenari viene preparato interamente prima di sostituire i tempi. Prima un record troncato o un riferimento fuori matrice poteva produrre valori mancanti o un aggiornamento parziale. Sono verificati gruppi di quattro valori, indici, dizionario, tempi e distanze numerici. I giorni derivati continuano a ereditare gli aggiornamenti dello stesso pacco.
- Il pacco iniziale verifica anche le dimensioni di distanze e mezzi, oltre ai minuti. Prima le due matrici potevano essere più corte senza venire rifiutate.
- Un conteggio negativo nel pacco bus poteva bloccare il lettore in un ciclo. La prova prima della correzione è stata terminata dal timeout di un processo figlio isolato. Ora conteggi, lunghezze e riferimenti ai candidati vengono verificati prima di avanzare nel pacco; la prova si conclude normalmente. Questo non costituisce una validazione completa di ogni campo del feed.

**Compatibilità su dati pubblici reali già generati:** confronto dei decoder nuovi con quelli di HEAD prima delle modifiche. Città di 87 punti, sei scenari, 8.793 candidati bus e sette tipi di orario: oggetti decodificati identici con assert.deepEqual. I dati e i loro generatori non sono stati modificati.

## Recupero dai caricamenti falliti

- Un errore HTTP nel caricamento dei percorsi alternativi restava memorizzato come risultato definitivo: i tentativi successivi non richiedevano più il file. Ora un errore consente il tentativo successivo; le richieste contemporanee e i successi continuano a condividere una sola promessa, senza introdurre tentativi automatici ripetitivi.
- Le schede potevano essere pubblicate in parte prima dell'errore sui metadati. Ora modelli e metadati sono preparati prima di modificare lo stato. Una pagina di errore con HTTP 200, dati mancanti o una risposta parziale rispetto alle schede previste non viene considerata pronta.
- La logica preesistente è stata prima estratta, uguale, in caricamento.mjs per riprodurre i difetti senza browser, poi corretta. Nessuna dipendenza aggiunta. Controllo del formato realmente prodotto: 93 modelli e 92 gruppi di metadati compatibili con il pacco iniziale; non è una prova di rendering.

## Offline e disponibilità della rete

- Un errore temporaneo 5xx del server ora usa la pagina già salvata, quando esiste. Il 404 rimane un 404; un 5xx senza copia rimane un errore del server.
- Errori nell'apertura o lettura della cache non bloccano più una risposta di rete valida. Restano controllati anche i fallimenti della scrittura per quota esaurita.
- Precache corrente, cache dei dati per versione, conservazione delle immagini, aggiornamento legato a waitUntil e regole di installazione/attivazione restano verificati. Non sono state introdotte nuove cache o modifiche alla memoria degli itinerari.

Le semantiche delle API sono state verificate nelle fonti primarie: [Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok), [Cache.match](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match), [Cache.put](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put), [waitUntil](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil). Il CLI della [guida web locale](../../.agents/skills/modern-web-guidance/SKILL.md) non era installato e non è stato installato; consultate direttamente le fonti delle API. Nessuna lettura della sessione personale del browser.

## Ulteriore area collegata: giorno selezionato e aggiornamenti esterni

Riprodotti e corretti indici decimali nel parametro g e indici fuori limite quando un archivio ricevuto da un'altra scheda ha meno giorni o non contiene più l'itinerario aperto. La scelta dell'itinerario attivo resta compatibile; il giorno viene ricondotto ai giorni disponibili. La logica è stata estratta fedelmente da avvio.js in funzioni di memoria.ts, provata prima della correzione e poi collegata all'avvio e all'evento storage.

## Rischio aperto: salvataggi concorrenti

**Non risolto e da affrontare prima di proporre il rilascio.** Una riproduzione con memoria finta esegue due letture dello stesso archivio, salva la modifica B e poi salva A usando la lettura precedente. Entrambe le scritture dichiarano successo, ma resta soltanto A: B viene sovrascritta. La correzione dell'indice del giorno non protegge i salvataggi concorrenti.

La riproduzione dimostra il comportamento del motore con due copie obsolete; non è una prova con due browser reali. Nell'interfaccia, l'aggiornamento esterno viene ignorato mentre una scheda o un foglio sono aperti: serve trattare insieme accettazione degli aggiornamenti, rifiuto delle scritture obsolete e recupero del lavoro locale. Una correzione parziale o un avviso subito coperto da un altro messaggio non basterebbero.

Script diagnostico e risultato conservati soltanto nella ricerca locale: concorrenza-riproduzione.mjs e concorrenza-riproduzione.json. Usano una Map al posto di localStorage; nessun itinerario personale letto o scritto. Non sono stati presentati come un test verde di assenza del conflitto.

## File, verifiche e limiti

Codice: [pacco.ts](../../src/lib/itinerari/pacco.ts), [caricamento.mjs](../../src/scripts/itinerari/caricamento.mjs), [stato.js](../../src/scripts/itinerari/compositore/stato.js), [avvio.js](../../src/scripts/itinerari/compositore/avvio.js), [memoria.ts](../../src/scripts/itinerari/memoria.ts), [sw-template.js](../../integrations/sw-template.js).

Test: [pacchetti](../../test/pacco-itinerari.test.mjs), [caricamenti](../../test/caricamento-itinerari.test.mjs), [offline](../../test/offline.test.mjs), [sincronizzazione](../../test/sincronizzazione-itinerari.test.mjs). Ventidue nuovi test; difetti riprodotti prima della correzione. Alla fine **213/213 test, zero errori**, suite circa 13,1 s; **build di 12 pagine riuscita** (8,09 s dichiarati da Astro), **811 link su 13 HTML, nessuno rotto**. Worker: 82 risorse, versione c62252573daa. Il ciclo finale è stato ripetuto una volta perché la revisione aveva individuato e corretto anche la risposta con schede parziali.

Node 24.21.0, build con --no-liftoff. Nessun controllo completo dei tipi: compilatore dedicato non presente e nessuna installazione aggiunta. Nessun browser, axe/Lighthouse, CI remoto, push, merge o deploy. Formato dello storage, ID, URL validi, temi, fonti e licenze conservati. Diff e riferimenti locali verificati. La revisione totale delle cartelle non è conclusa.

**Prossimo gruppo prioritario:** conflitti tra schede, visibilità dei fallimenti di salvataggio e recupero del lavoro locale. Le prove visive rimangono separate finché il browser è escluso.
