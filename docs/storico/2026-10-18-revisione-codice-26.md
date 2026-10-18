# Revisione codice 26 · pasti e riepilogo della sessione

18 ottobre 2026, base 134f86f. Quarto gruppo della sessione richiesta di almeno 45 minuti.

## Risultato

Il menù stimava l'arrivo con i tempi medi, mentre il giorno inserito usava partenze bus, pause e margini. Le due operazioni ora condividono `src/lib/itinerari/pasti.ts`: prepara una copia del giorno e la calcola con lo stesso motore, senza inserire nulla durante la proposta. Il risultato applicato conserva l'inserimento dopo la tappa scelta, le pause e la regola della cena. Il contesto dal vivo è passato esplicitamente.

La memoria del menù si invalida quando cambiano scenari/orari bus e considera gli altri giorni, il margine e il contesto attuale. Un menù superato non duplica il locale o lo inserisce dopo una tappa scomparsa; il messaggio spiega che nulla è stato aggiunto e invita a riaprire il menù. Il filtro dice «Entro», perché può comprendere anche percorsi con mezzi.

Il tempo libero automatico prima di cena poteva superare quattro ore, ma la lettura del viaggio lo scartava: ora viene conservato fino al massimo di 14 ore e mezza, fra l'inizio minimo delle 5:00 e la cena delle 19:30. Pranzo, caffè e riposo restano limitati a quattro ore. Nessun nuovo campo, versione di memoria o sintassi del link. I vecchi client con il limite precedente possono ancora scartare un'attesa lunga: la correzione vale per il nuovo codice.

Un locale senza orari pubblicati o con arrivo oltre mezzanotte non viene più contato come aperto: resta consultabile e selezionabile con un avviso esplicito di apertura non verificata. Il calcolo non inventa gli orari del giorno successivo.

## Prove

- Cinque regressioni iniziali fallivano prima della correzione; riprodotte poi perdita dell'attesa lunga, dicitura del filtro, apertura sconosciuta e arrivo oltre mezzanotte. **14 prove aggiunte** fra regressioni e compatibilità.
- **451/451 test**, zero fallimenti, salti o cancellazioni; build di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **8fca285ef01f**. Verifiche rieseguite dopo la ripresa e l'ultima precisazione del riepilogo delle aperture.
- Confronto su **496 inserimenti** con bus/senza bus, pranzo/cena, quattro margini e orari variabili: stessi giorni, pause, orari e ordine del precedente comando. La proposta ora riflette quel risultato.
- Profilo esplorativo con dati pubblici già costruiti, 32 locali e 30 menù sintetici: mediana circa 42 ms, massimo 96 ms in Node locale. Include prove con sette giorni e fino a 14 tappe; non misura il browser o il telefono. Nessuna rete.
- Il log iniziale del profilo riproduce l'attesa di 565 minuti scartata dal vecchio lettore; la regressione finale conserva un'attesa di 555 minuti sia nel link sia nella lettura della memoria. Non confondere il log prima della correzione con l'esito finale.
- Log nella cartella della chat: nextstop-pasti-finale-{test,build,links}-2026-10-18.log, nextstop-pasti-confronto-2026-10-18.log e nextstop-pasti-profilo-2026-10-18.log.

## Sessione e gruppi

| Gruppo | Risultato | Test |
|---|---|---|
| [23](2026-10-18-revisione-codice-23.md) | Costi delle etichette delle strade, confronto su tutti i percorsi reali non vuoti | 420 |
| [24](2026-10-18-revisione-codice-24.md) | Mesi storici, ingresso da tastiera e scenario del giorno suggerito | 428 |
| [25](2026-10-18-revisione-codice-25.md) | Download delle strade, geometrie, suddivisione e semplificazione | 437 |
| Questo | Proposta e inserimento dei pasti, memoria, attesa e aperture sconosciute | 451 |

Da **414 a 451 prove: 37 aggiunte**. Inizio alle **10:53:07 UTC**; interruzione forzata intorno alle **11:32 UTC**, dopo circa 39 minuti, perché il controllo automatico delle autorizzazioni non poteva completarsi per quota. Non è stato un rifiuto per rischio. Ripresa su «continua» di Enrico alle **17:52:34 UTC**: il tempo dell'interruzione non conta come lavoro e non permette di dichiarare 45 minuti ininterrotti. Chiusura documentale della ripresa: **2026-10-18 17:58:46 UTC**. I controlli finali sono quelli del codice 1cfb6fa; dopo di essi cambia soltanto documentazione.

## Limiti e seguito

Area 3 ancora aperta. Prossima ricognizione: scorrimento durante il trascinamento nella versione attuale (`compositore/viste.js`), ricerca/filtri e riallineamento delle voci storiche. Il vecchio percorso `itinerari/trascina.ts` non esiste nel codice attuale: non dichiarare quelle segnalazioni risolte o ancora presenti senza ricontrollarle.

Nessun browser: rendering nativo, gesti, focus dei dialoghi e prestazioni sul telefono restano da verificare. I test di rendering usano contenitori fittizi, non un browser. Nessuna nuova CI Linux eseguita, pubblicazione, installazione, delega o automazione. Nessun JSON sorgente, ID, URL, CSS, dipendenza, file pubblico, istruzione Claude o materiale privato modificato. Il modello dei bus rimane aggregato; queste prove non certificano puntualità o aperture reali.

La nuova idea su altre città e registro degli aggiornamenti resta rinviata, compresa analisi e stesura. Le altre sette aree del piano originale mantengono il proprio stato.
