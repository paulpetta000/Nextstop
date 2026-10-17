# PROGRESS · stato attuale

_Aggiornato il 17/10/2026. Ramo `codex/satori-fflate`: blocchi precedenti nella PR #5 in bozza; nuovo allineamento del blu soltanto locale, sopra `5b259b1`. Nessun merge o rilascio in produzione._

## Blocco corrente · coerenza del blu

Precisazione di Enrico: **correzione soltanto nel tema scuro**, con accenti di C Mappa allineati al blu di D Pagine; tema chiaro ripristinato dalla base `5b259b1`. Cambiano solo `compositore.css`, `ore.css` e i test pertinenti, oltre ai documenti. Prova di conservazione del chiaro fallita prima e riuscita dopo; quattro controlli su palette e contrasto passano. **180 test, build di 12 pagine e 811 link validi in locale**; worker con 82 risorse. Confronto con la base: solo dieci blocchi CSS scuri diversi, altri 1.421 identici. [Resoconto](docs/storico/2026-10-17-coerenza-colore.md). **Non verificato visivamente e non pubblicato**: browser escluso, nessun nuovo axe/Lighthouse, push o deploy. Dati, ID, URL, calcoli, memoria e dipendenze conservati.

Riepilogo completo, inventario cartelle, controllo HTTP delle nove pagine pubbliche e statistiche aggregate Vercel conservati nella ricerca locale della cartella iniziale; nessun rapporto privato aggiunto alla PR. Search Console da completare solo con esportazioni scelte da Enrico. Nessuna cartella eliminata o spostata. Ricerca mirata su efficienza di Claude e valore del prodotto conservata localmente con fonti primarie e una bozza di istruzioni: nessuna modifica a `CLAUDE.md`, regole condivise, skill o impostazioni; nessun agente, plugin o automatismo aggiunto.

## Prestazioni · blocco precedente nella PR

**Prestazioni del compositore**, blocco autorizzato da Enrico e verificato: CSS iniziale piccolo, foglio completo separato e atteso prima dei controlli, CSS incluso nella precache (82 risorse), sezioni inferiori rese disponibili dopo il primo disegno. HTML compresso circa 121 → 98 KB. **176 test, build e 811 link validi** in locale e su [GitHub/Linux](https://github.com/paulpetta000/Nextstop/actions/runs/38973495948). Viste C/D, salvataggio/ricarica/condivisione, CSS lento, senza JS e offline riusciti; axe chiaro/scuro e larghezze senza problemi automatici osservati. [Anteprima verificata](https://nextstop-487y2t3e9-enrico-2d20.vercel.app/napoli/itinerari/): **Lighthouse mobile 98/98 sul compositore, home 98**, accessibilità e buone pratiche 100; variabilità precedente e limiti conservati nel [rapporto](docs/storico/2026-10-17-prestazioni-compositore.md). Nove Open Graph e altre pagine identici. Chiusura soltanto documentale; esito della CI finale nella [PR #5](https://github.com/paulpetta000/Nextstop/pull/5).

I sei blocchi precedenti restano inclusi: dati, calcoli/offline, documentazione/CI e aggiornamenti Sharp/cache/sourcemap/fflate. L'integrazione precedente aveva già verificato installazione Linux e percorso completo: [rapporto](docs/storico/2026-10-16-integrazione-github.md). L'audit senza segnalazioni del blocco fflate resta distinto dal rilievo cache aperto.

## Correzioni già concluse localmente

- **Cache/sourcemap**, commit `cd92cbc`: sourcemap 1.2.2 corretta, cache 4.3.0 con comportamento generico max-stale/cookie ancora riproducibile. 164 test, build e 809 link; contratto Astro verificato. [Resoconto](docs/storico/2026-10-16-cache-sourcemap.md).
- **Sharp**, commit `848f717`: 0.35.5, avvisi relativi rimossi; 159 test, build/link e 18 confronti di immagini senza pixel diversi. [Resoconto](docs/storico/2026-10-16-sharp.md).
- **Documentazione e CI**, commit `81664eb`: indici correnti, stato precedente conservato, workflow sul commit esatto con controlli PR/main/manuali. 159 test e 101 riferimenti validi. [Terzo blocco](docs/storico/2026-10-16-manutenzione-controlli.md).
- **Dati e salvataggi**, commit `939e882`: recupero dei record validi, copia protetta dell’archivio corrotto, esito reale di scrittura e filtri dei locali. 133 test e nove scenari browser. [Primo blocco](docs/storico/2026-10-16-conservazione-itinerari.md).
- **Calcoli e offline**, commit `3236b0d`: pause e margini ricalcolano trasporti/aperture; scenario a piedi iniziale; cache aggiornata e filtri offline. 153 test, build, 809 link e tre scenari browser riusciti. [Secondo blocco](docs/storico/2026-10-16-calcoli-offline.md).

## Base pubblicata e scelte pendenti

Lo stato ereditato riporta pubblicati: home O4 (11/10), pannello e registro Fonti, compositore C/D e mappa a pezzi (14/10), tranche 1 (15/10), calendario e ora «Tutte le ore» (16/10). È la base del lavoro, non una nuova verifica del deployment pubblico. Decisioni e prove complete nello snapshot; specifiche in [specifiche/README](specifiche/README.md), proposte in [design/compositore/README](design/compositore/README.md).

Resta pendente il pezzo 3 delle rifiniture grafiche (barra «Salvato» e menu); partenza/alloggio è in stand-by. Non fanno parte della manutenzione autorizzata. Altri lavori nella [ROADMAP](ROADMAP.md), verifiche orari in [da-verificare](da-verificare/orari-locali.md).

## Limiti e seguito

I blocchi precedenti sono stati pubblicati nella PR con autorizzazione. Il nuovo allineamento del blu resta locale; questo blocco non comprende un nuovo push o deploy. Main e produzione non sono stati modificati; nessuna modifica alle protezioni GitHub/Vercel. Main risultava senza protezione nel controllo precedente. L'override fflate va riesaminato al prossimo aggiornamento dei consumatori; il caso generico cache max-stale/cookie resta aperto, senza esposizione individuata nel percorso statico di Nextstop. Controllo completo dei tipi e organizzazione mirata degli archivi restano lavori separati.

**Cosa fare adesso:** 1. Rivedere visivamente il colore in chiaro/scuro e sulle due viste, rispettando il browser escluso. 2. Completare Search Console dai rapporti esportati da Enrico. 3. Concordare il blocco successivo: dati/orari, protezioni GitHub o organizzazione conservativa delle cartelle; nessuna cancellazione implicita. Per una nuova anteprima restano i controlli UI previsti; merge e produzione richiedono ancora OK esplicito. Bastano gli strumenti locali già presenti e GitHub/Vercel; nessuna nuova installazione.
