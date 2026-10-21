# Nextstop · risultati della continuazione del 20–21 ottobre

Sei gruppi completati sul ramo locale codex/salvataggi-coordinati-2026-10-18. Codice **7cf092c**, **646/646 test**, zero fallimenti, salti o cancellazioni; **95 prove aggiunte** rispetto a 551. Build **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **c88f68fc5e24**. Nessun push, merge o deploy. L’intervallo fra le giornate è escluso dal tempo di lavoro e non costituisce una sessione continua.

## Sei gruppi conclusi

| Gruppo | Risultato e prove | Commit |
|---|---|---|
| [41 · azioni dei fogli](2026-10-20-revisione-41.md) | Comandi dopo la chiusura legati al pannello/viaggio; un solo effetto per doppio tocco. 16 prove | fe59e3c |
| [42 · condivisione](2026-10-20-revisione-42.md) | Richieste native e appunti tardivi non riaprono pannelli né spostano il fuoco. 8 prove | cf233b7 |
| [43 · calendario e ore](2026-10-20-revisione-43.md) | Chiusure, riaperture, scelte e ritorni rispettano il loro contesto. 24 prove | 1f6a315 |
| [44 · pasti](2026-10-20-revisione-44.md) | Caricamenti delle schede e Mangia qui rispettano l’ultima scelta e il viaggio. 17 prove | 0cd1635 |
| [45 · gesti residui](2026-10-21-revisione-45.md) | Puntatori della testata/locali e pulizie touch annullati correttamente. 13 prove | 7fae8a3 |
| [46 · scorrimenti e giorni](2026-10-21-revisione-46.md) | Animazioni obsolete fermate e cambi giorno nelle viste C/D protetti. 17 prove | 7cf092c |

## Stato degli otto punti

| Area | Stato corrente | Cosa resta |
|---|---|---|
| 1 · Istruzioni e consumo Claude | **Esclusa del tutto**, fino a futura richiesta esplicita | Nessun audit o pilot avviato |
| 2 · Dati e fonti | Dalla ripresa precedente: quattro fatti storici verificati, 196 fonti pubbliche, 15 avvisi rimasti. Dati pubblici invariati nei sei gruppi | Quindici verifiche editoriali, aperture future e bus oltre il feed registrato |
| 3 · Codice | Sei gruppi conclusi, 646 test e build/link riusciti | Audit dei moduli e temporizzazioni residui; nessuna copertura totale dichiarata. Prossima area da riprodurre: aggiornamenti differiti di viste/stato e ritorni dopo caricamenti |
| 4 · Google e traffico | Verifiche HTTP/sitemap della ripresa precedente conservate | Esportazioni Search Console scelte da Enrico; nessuna sessione Google letta o conclusione sul ranking |
| 5 · Interfaccia | Correzioni logiche a finestre, scelte, gesti e animazioni; nessun CSS cambiato | Browser escluso: resa, fuoco/tastiera/tocchi nativi, temi, GPS e uso offline restano pendenti |
| 6 · Manutenzione | Controlli ordinari riusciti dopo due scadenze del revisore. Ultimo riscontro remoto del 20/10: main b6d2a36 con CI riuscita | Diagnosticare l’alterazione di un artefatto, integrare/verificare il ramo e controllare i tipi prima di eventuale rilascio; nessuna impostazione remota cambiata |
| 7 · Organizzazione | Piano e indici riallineati; prove recuperabili con impronte e materiali conservati | Archiviazione durevole da scegliere senza cancellazioni; nuovi materiali remoti ancora da integrare |
| 8 · Valore del prodotto | Sette casi sui dati pubblici della ripresa precedente conservati | Usabilità e confronto con assistenti esterni non misurati; nessuna superiorità dichiarata |

Il [riepilogo del 20 ottobre](2026-10-20-riepilogo-aree.md) conserva fonti e sette casi del prodotto. La nuova idea per più città e registro degli aggiornamenti resta rinviata **anche nell’analisi e nella stesura**.

## Anomalie e limiti

Una sonda senza codice Nextstop ha rilevato sovrapposizioni nel LockManager sperimentale Node; la prova di concorrenza usa ora due worker reali con mutex Atomics. Nessuna modifica al salvataggio del prodotto e nessuna prova nativa del Web Locks del browser.

Tre build hanno dato errori intermittenti durante questa continuazione, riuscendo al tentativo successivo senza cambiare i dati. Nell’ultimo caso è stata isolata un’alterazione concreta: **P diventata @ nel candidato 7898 del bundle**. I cinque JSON originali passano la validazione; quello dei percorsi alternativi differisce nel bundle, rifiutato correttamente dai validatori sorgente e compilato. [Prove e diagnosi](2026-10-21-revisione-46.md). Causa non individuata: il passaggio finale riuscito non dimostra risolta l’intermittenza.

I sei fallimenti del tentativo nel sandbox erano divieti EPERM sulle rinomine dei temporanei. Dopo la conferma di Enrico, le stesse prove ordinarie passano tutte. Nessun test saltato o indebolito per aggirare il problema. Log originali e artefatto difettoso conservati.

## Prove recuperabili

[Manifesto delle impronte](2026-10-21-prove-manifest.json), **82 file** nella cartella della chat: test, build, link, baseline e sonde. Include i 32 riferimenti della ripresa precedente. I log definitivi sono nextstop-scorrimenti-test-finale-2026-10-21.log, nextstop-scorrimenti-build-verificato-2026-10-21.log e nextstop-scorrimenti-links-verificato-2026-10-21.log. Le 82 risorse offline sono tutte presenti; questo non prova l’installazione nel browser.

Le copie e la patch preparate prima dello sblocco restano in nextstop-ripresa-2026-10-21 nella cartella della chat, come snapshot storico riferito a 7fae8a3; il codice corrente è 7cf092c. Nessuna dipendenza installata, dato rigenerato, cartella cancellata, delega o automazione creata.
