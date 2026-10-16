# PROGRESS · stato attuale

_Aggiornato il 16/10/2026. Ramo `codex/satori-fflate` pubblicato nella PR #5 in bozza; sei blocchi inclusi dalla base main `75d25e6`. Verifica GitHub/Linux e anteprima tecnica completate. Nessun merge o rilascio in produzione._

## Blocco corrente

**Integrazione GitHub autorizzata e verificata**: [PR #5 in bozza](https://github.com/paulpetta000/Nextstop/pull/5), sei commit pubblicati fino a `156e1ae`. [CI Linux riuscita](https://github.com/paulpetta000/Nextstop/actions/runs/38968577527): installazione pulita, **171 test, build e 809 link validi** su Node 22.23.3. Anteprima Vercel READY dello stesso codice: dieci pagine, axe in chiaro/scuro, larghezze, riduci movimento e console senza problemi automatici osservati; salvataggio, ricarica, condivisione e offline riusciti. **Lighthouse home 98, compositore 94**: resta sotto la soglia 95, quindi anteprima tecnica e nessun via libera al rilascio. [Resoconto, limiti e prove](docs/storico/2026-10-16-integrazione-github.md). La chiusura modifica soltanto documentazione; la CI finale si controlla sulla PR.

Il blocco Satori/fflate è concluso: Satori 0.33.5 conservato, fflate 0.7.5 tramite override. 171 test; 705 file del sito e nove anteprime identici nel confronto locale delle dipendenze; audit senza segnalazioni, distinto dal rilievo cache aperto. [Resoconto](docs/storico/2026-10-16-satori-fflate.md).

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

Push e apertura della PR sono autorizzati e completati. Main non è stato modificato; nessuna modifica alle protezioni GitHub/Vercel. Main risultava senza protezione nel controllo precedente, come già registrato. Dipendenze aggiornate e installazione Linux verificata. Override fflate da riesaminare al prossimo aggiornamento dei consumatori. Cache 4.3.0 ancora da considerare per il caso generico max-stale/cookie, non individuato nel percorso pubblico del sito statico. Controllo completo dei tipi non ancora predisposto.

**Prossimo blocco consigliato, dopo OK:** prestazioni del compositore per raggiungere Lighthouse mobile almeno 95, misurando caricamento iniziale di script/stili e ricalcoli del layout; preservare mappa, offline e comportamento. Nessuna nuova grafica o funzione inclusa. Prima di merge/rilascio servono risultato conforme e consenso esplicito di Enrico sull'anteprima. Organizzazione mirata di verifiche/archivi ancora da affrontare. Per il seguito bastano ambiente locale e controlli già installati, con GitHub e Vercel per CI e anteprima. Stato e comandi in [docs/README](docs/README.md), [README](README.md) e [ambiente locale](docs/AMBIENTE-LOCALE.md).
