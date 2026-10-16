# PROGRESS · stato attuale

_Aggiornato il 16/10/2026. Lavoro locale Codex nel ramo `codex/satori-fflate`, dalla base main `75d25e6` con i cinque blocchi precedenti già inclusi. Nessun push, merge o deploy dei sei blocchi._

## Blocco corrente

Blocco Satori/fflate autorizzato da Enrico: renderer Satori **0.33.5 conservato**, fflate **0.7.3 → 0.7.5** tramite override npm, perché anche Satori latest mantiene la dipendenza vulnerabile esatta. Tre casi ZIP64 bloccati prima e corretti dopo; sette nuovi test. **171 test, build e 809 link validi**, 705 file del sito e nove anteprime identici. **Audit senza segnalazioni**, distinto dal rilievo cache ancora aperto. [Resoconto e limiti](docs/storico/2026-10-16-satori-fflate.md). Nessun push, merge o deploy; Linux reale e anteprima di rilascio ancora da verificare.

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

Prima dell’integrazione servono l’OK a push/PR e l’esecuzione del workflow aggiornato su GitHub; main risulta ancora senza protezione. Dipendenze: Sharp, sourcemap e fflate corretti localmente; audit a zero segnalazioni. Override fflate da riesaminare al prossimo aggiornamento dei consumatori. Cache 4.3.0 ancora da considerare per il caso generico max-stale/cookie, non individuato nel percorso pubblico del sito statico. Aggiornamenti successivi soltanto nel relativo blocco autorizzato. Controllo completo dei tipi non ancora predisposto. Prestazioni: Lighthouse locale singolo 94, soglia 95 e anteprima di rilascio ancora da verificare.

Seguito dopo nuovo OK: verifica d’integrazione su GitHub/Linux e preparazione dell’anteprima, conservando il rilievo cache aperto. Push e PR non sono ancora autorizzati. Organizzazione mirata di verifiche/archivi ancora da affrontare. Per lavorare bastano ambiente locale e strumenti esistenti; GitHub e Vercel servono nel blocco di integrazione autorizzato. Stato e comandi in [docs/README](docs/README.md), [README](README.md) e [ambiente locale](docs/AMBIENTE-LOCALE.md).
