# Revisione codice 5 · salvataggi coordinati

18 ottobre 2026. Ripresa della chat «Analizza tutte le cartelle Nextstop», interrotta da invalid_encrypted_content. Il codice incompleto era presente nella worktree; nessuna ripartenza dal codice vecchio della cartella iniziale.

## Stato e ambito

Worktree: C:/Users/Windows11/.codex/worktrees/analisi-nextstop-ottobre/nextstop. Ramo codex/salvataggi-coordinati-2026-10-18, base main 96e480d. Ripreso il lavoro Web Locks applicato nella chat precedente dallo stash b0a35c1123918d9a1867c104a0ff793e5822dc80; stash conservato. Nessun push, merge o deploy di questo blocco. Il rilascio precedente è distinto da queste modifiche locali.

## Comportamento

- Archivio e riferimento provengono dalla medesima lettura, anche all'avvio e dopo un aggiornamento esterno accettato.
- Ogni richiesta fotografa i dati e attende in coda; il confronto del riferimento e la scrittura sono eseguiti nello stesso Web Lock esclusivo. Due sessioni nuove sul medesimo archivio non dichiarano entrambe un successo incompatibile: la seconda conserva la modifica locale e segnala conflitto.
- Stato in corso separato da successo/errore; nessuna spunta anticipata. Salva e la conferma ritardata attendono anche le richieste aggiunte mentre stanno aspettando. Il cambio itinerario impedisce conferme relative al precedente. Anche le righe di «I miei itinerari», iniziali e già aperte, mostrano attesa/errore anziché una falsa etichetta «Salvato» e si aggiornano al completamento.
- Corretto durante questa ripresa: se un primo salvataggio fallisce dopo il cambio itinerario, l'itinerario precedente torna bozza anche se non è più quello aperto.
- Lock negato, non disponibile, attesa oltre tre secondi o errore di memoria: nessuna scrittura non coordinata; un successivo tentativo può recuperare dopo un errore transitorio. Originali danneggiati protetti e versioni ignote rifiutate.
- Gli eventi storage riguardano solo localStorage e la chiave degli itinerari, incluso clear. Durante attesa/errore o con pannelli aperti l'archivio locale non viene sostituito.
- Avviso nativo all'uscita predisposto solo durante scritture pendenti o fallite e rimosso dopo il recupero. Nessuna scrittura asincrona affidata alla chiusura della pagina.

## Prove eseguite ora

Node portatile 24.21.0, dipendenze già presenti; nessuna installazione.

1. 42 prove mirate ereditate riuscite, incluso parallelismo reale fra worker Node.
2. Due nuove prove prima delle correzioni: 17 riuscite e 2 fallite su 19. Il cambio itinerario lasciava salvato=true dopo il fallimento; mancava la protezione d'uscita.
3. Dopo le correzioni: 19/19 prove del gruppo riuscite.
4. Suite completa npm test: **251/251 test**, zero falliti, saltati o cancellati. Erano 225 nella base pubblicata. Dopo le prime 245 prove sono state aggiunte quattro prove d’integrazione del gestore reale degli aggiornamenti esterni (adozione con riferimento, scrittura pendente/conflitto, pannelli aperti, clear); suite completa riuscita a 249. Due ulteriori prove hanno poi riprodotto la falsa etichetta nel pannello (entrambe fallite prima), corrette le righe iniziali e il loro aggiornamento asincrono; gruppo mirato 13/13 e suite finale 251/251. Build e link ripetuti dopo questa ultima modifica applicativa, entrambi riusciti.
5. npm run build, telemetria disabilitata: **12 pagine**, completata; worker con **82 risorse offline**. Nessun rimedio --no-liftoff necessario.
6. npm run check:links: **13 documenti HTML, 811 link interni**, nessun link rotto. Il numero di HTML controllati comprende il documento aggiuntivo prodotto dalla build.
7. git diff --check riuscito; differenze applicative limitate a memoria.ts e quattro moduli del compositore. Nessun dato, ID, URL, formato v1, CSS o dipendenza cambiato.

Il test dei worker esegue quattro gare con due thread e memoria condivisa fittizia: un vincitore, un conflitto, visite e timbri conservati nelle copie. Viene saltato se worker_threads.locks non esiste, per conservare il requisito Node >=22.12; nell'ambiente verificato è stato eseguito. Queste sono prove Node, non prove tra schede browser reali.

## Limiti e seguito

- Nessuna prova visiva, tra schede reali, da telefono, axe o Lighthouse: il browser resta escluso per istruzione di Enrico. Non dichiarare il blocco pronto al rilascio senza distinguere questi controlli pendenti.
- Web Locks è cooperativo: le vecchie pagine già aperte e il metodo diretto scrivi usato nelle prove non partecipano al protocollo. Il compositore nuovo usa il salvatore coordinato; nessun altro chiamante applicativo del metodo diretto trovato in src.
- Senza Web Locks il salvataggio viene rifiutato con avviso; nessuna compatibilità universale dichiarata. Condividi conserva il percorso, non visite e timbri personali. Le due copie restano in pagina/memoria: nessuna fusione o nuova copia persistente di recupero.
- beforeunload richiede le condizioni consentite dal browser, compresa un'interazione precedente; non garantisce recupero dopo chiusura forzata, arresto o terminazione mobile. I test provano gestione e rimozione del listener, non la comparsa effettiva della finestra.
- Nessun accesso a sessioni Google, dati personali o servizi del sito. Nessuna delega o automazione. Non modificati i file di istruzioni di Claude o le skill.

Prossimo blocco tecnico: rivedere i percorsi di recupero dopo conflitto e aggiornamento esterno, mantenendo separate le prove UI pendenti; poi proseguire il piano unico. Prima del rilascio serve completare la verifica nel browser quando Enrico la autorizza. Gli strumenti locali esistenti bastano; GitHub/Vercel servono solo per un rilascio autorizzato.

## Fonti tecniche primarie consultate

- [Web Locks, specifica W3C](https://w3c.github.io/web-locks/): coordinamento cooperativo, lock esclusivi e rilascio legato alla promessa.
- [Node 24, worker_threads.locks](https://nodejs.org/docs/latest-v24.x/api/worker_threads.html#worker_threadslocks): API sperimentale disponibile da 24.5.0; prova condizionata alla disponibilità.
- [HTML, passi beforeunload](https://html.spec.whatwg.org/multipage/browsing-the-web.html#fire-beforeunload): attivazione precedente e decisione del browser; messaggio nativo non personalizzato.
