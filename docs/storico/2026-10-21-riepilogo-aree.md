# Nextstop · risultati della continuazione del 20–21 ottobre

Aggiornamento successivo: [chiusura locale della ripresa dalle 12:29:23 UTC](2026-10-21-chiusura-locale.md), 756 test e undici fatti verificati. Il seguito conserva i risultati della ripresa precedente.

Ultima ripresa iniziata il **21/10 alle 11:42:53 UTC**, sei gruppi completati e salvati sul ramo locale codex/salvataggi-coordinati-2026-10-18. Codice **851c1da**, **723/723 test**, nessun fallimento, salto o cancellazione; **77 nuove prove da 646**. Build **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **b18e37e2e402**. Nessun push, merge o deploy. Le pause fra turni e giornate non contano come lavoro.

## Sei gruppi della ripresa attuale

| Gruppo | Risultato e prove | Commit |
|---|---|---|
| [47 · cambio vista/menu](2026-10-21-revisione-47.md) | Prevale la ultima richiesta; etichetta, preferenza e annuncio seguono il completamento. 13 prove | 9d15573 |
| [48 · ascoltatori/mappa](2026-10-21-revisione-48.md) | Pulizia di eventi e fotogrammi; risposte alternative legate alla mappa attuale. 16 prove | 43fdceb |
| [49 · vista a pagine](2026-10-21-revisione-49.md) | Timer, eventi e osservatori ritirati non aggiornano il nuovo pannello. 13 prove | 797f168 |
| [50 · posizione](2026-10-21-revisione-50.md) | Osservazioni ritirate e risposte fuori preferenza ignorate; solo coordinate fittizie nei test. 14 prove | f326c2d |
| [51 · avvisi](2026-10-21-revisione-51.md) | Chiusure animate obsolete e doppie non rimuovono né spostano il fuoco fuori contesto. 13 prove | 195155a |
| [52 · disposizione](2026-10-21-revisione-52.md) | Ultima richiesta e contenitore correnti; ridisegno sullo stato attuale, errore gestito. 8 prove | 851c1da |

Ogni gruppo ha una baseline prima della correzione, prove mirate, suite completa, build e collegamenti. Nel gruppo 47 il primo processo di test si è interrotto senza dettagli: file isolato e suite ripetuta riusciti senza modifiche o salti. Anche il primo bundle di quel gruppo era alterato; prove conservate, causa aperta. I cinque gruppi successivi hanno completato i controlli senza anomalie.

## Sei gruppi della continuazione precedente

Codice 7cf092c, 646 test e 95 nuove prove da 551. Insieme alla ripresa attuale sono **dodici gruppi e 172 prove aggiunte**; i numeri non indicano copertura totale del prodotto.

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
| 2 · Dati e fonti | Dalla ripresa precedente: quattro fatti storici verificati, 196 fonti pubbliche, 15 avvisi rimasti. Dati pubblici invariati nei dodici gruppi | Quindici verifiche editoriali, aperture future e bus oltre il feed registrato |
| 3 · Codice | Dodici gruppi conclusi, 723 test e build/link riusciti | Audit dei moduli e temporizzazioni residui; nessuna copertura totale dichiarata. Seguito da riprodurre: fuoco differito da tastiera e moduli residui |
| 4 · Google e traffico | Verifiche HTTP/sitemap della ripresa precedente conservate | Esportazioni Search Console scelte da Enrico; nessuna sessione Google letta o conclusione sul ranking |
| 5 · Interfaccia | Correzioni logiche a finestre, scelte, gesti e animazioni; nessun CSS cambiato | Browser escluso: resa, fuoco/tastiera/tocchi nativi, temi, GPS e uso offline restano pendenti |
| 6 · Manutenzione | Controlli ordinari finali riusciti; sonde del gruppo 47 non riproducono la alterazione. Ultimo riscontro remoto del 20/10: main b6d2a36 con CI riuscita | Diagnosticare l’alterazione di un artefatto, integrare/verificare il ramo e controllare i tipi prima di eventuale rilascio; nessuna impostazione remota cambiata |
| 7 · Organizzazione | Piano e indici riallineati; prove recuperabili con impronte e materiali conservati | Archiviazione durevole da scegliere senza cancellazioni; nuovi materiali remoti ancora da integrare |
| 8 · Valore del prodotto | Sette casi sui dati pubblici della ripresa precedente conservati | Usabilità e confronto con assistenti esterni non misurati; nessuna superiorità dichiarata |

Il [riepilogo del 20 ottobre](2026-10-20-riepilogo-aree.md) conserva fonti e sette casi del prodotto. La nuova idea per più città e registro degli aggiornamenti resta rinviata **anche nell’analisi e nella stesura**.

## Anomalie e limiti

La sonda precedente senza codice Nextstop ha rilevato sovrapposizioni nel LockManager sperimentale Node; la prova di concorrenza usa due worker reali con mutex Atomics. Nessuna modifica al salvataggio del prodotto e nessuna prova nativa del Web Locks del browser.

La alterazione intermittente della build resta aperta. Nel gruppo 46 era stata isolata **P diventata @ nel candidato 7898**; nel gruppo 47 **~ diventata n nel candidato 6898** del bundle. Sorgenti validi e invariati. Dieci compilazioni Vite ridotte e una build Astro strumentata non riproducono il problema: il bundle corretto in memoria è identico a quello scritto. Il comando ordinario successivo è riuscito. Nessuna causa attribuita a Vite, disco o RAM e nessuna dipendenza/configurazione cambiata. [Diagnosi e fonti tecniche](2026-10-21-revisione-47.md), [risultati delle sonde](2026-10-21-build-sonde-47.json). I due artefatti difettosi restano recuperabili.

Le precedenti scadenze del revisore e i sei EPERM del sandbox sono documentati nel gruppo 46. Dopo la conferma di Enrico i controlli ordinari passano, senza test indeboliti. Browser escluso: eventi, animazioni, fuoco, GPS, uso offline e transizioni nativi non sono dimostrati dai nodi fittizi. Nessun dato sorgente, ID, URL, CSS, dipendenza, protezione o materiale privato modificato in questi sei gruppi. Stash b0a35c1123918d9a1867c104a0ff793e5822dc80 conservato.

## Prove recuperabili

[Manifesto delle impronte](2026-10-21-prove-manifest.json), **125 file** nella cartella della chat; tutte le 82 prove precedenti ricontrollate prima della estensione. Comprende log di baseline, controlli iniziali e finali, sonde e bundle. Log finali correnti nextstop-disposizione-{test,build,links}-finale-2026-10-21.log. Le 82 risorse offline sono presenti: questo non prova la installazione nel browser.

Le copie e la patch preparate prima dello sblocco restano in nextstop-ripresa-2026-10-21 come snapshot storico riferito a 7fae8a3; non vanno riapplicate. Nessuna installazione, rigenerazione dei dati, cancellazione di cartelle, delega o automazione. **Istruzioni/consumo Claude esclusi fino a futura richiesta; nuova idea rinviata anche nella analisi e nella stesura.**

Verifica della durata della ripresa: **40 minuti e 34 secondi**, dalle 11:42:53 UTC alle 12:23:27 UTC del 21 ottobre; sei gruppi completati senza nuove conferme. Le pause precedenti non sono conteggiate.
