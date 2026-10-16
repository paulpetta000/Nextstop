# PROGRESS · stato attuale

_Aggiornato il 16/10/2026. Lavoro locale Codex nel ramo `codex/manutenzione-controlli`, dalla base main `75d25e6` con i primi due blocchi dell’audit già inclusi. Nessun push, merge o deploy dei tre blocchi._

## Blocco corrente

Terzo blocco autorizzato da Enrico: indici allineati al compositore attuale, struttura documentata, stato precedente conservato nello [snapshot integrale](docs/storico/2026-10-16-PROGRESS-prima-manutenzione.md). Workflow esteso a main e avvio manuale, con checkout del commit esatto dell’evento e prove su repository temporanei. [Resoconto, verifiche e limiti](docs/storico/2026-10-16-manutenzione-controlli.md). Piano dipendenze, tipi e regole GitHub in [Manutenzione](docs/MANUTENZIONE.md); nessun pacchetto installato né impostazione remota modificata.

## Correzioni già concluse localmente

- **Dati e salvataggi**, commit `939e882`: recupero dei record validi, copia protetta dell’archivio corrotto, esito reale di scrittura e filtri dei locali. 133 test e nove scenari browser. [Primo blocco](docs/storico/2026-10-16-conservazione-itinerari.md).
- **Calcoli e offline**, commit `3236b0d`: pause e margini ricalcolano trasporti/aperture; scenario a piedi iniziale; cache aggiornata e filtri offline. 153 test, build, 809 link e tre scenari browser riusciti. [Secondo blocco](docs/storico/2026-10-16-calcoli-offline.md).

## Base pubblicata e scelte pendenti

Lo stato ereditato riporta pubblicati: home O4 (11/10), pannello e registro Fonti, compositore C/D e mappa a pezzi (14/10), tranche 1 (15/10), calendario e ora «Tutte le ore» (16/10). È la base del lavoro, non una nuova verifica del deployment pubblico. Decisioni e prove complete nello snapshot; specifiche in [specifiche/README](specifiche/README.md), proposte in [design/compositore/README](design/compositore/README.md).

Resta pendente il pezzo 3 delle rifiniture grafiche (barra «Salvato» e menu); partenza/alloggio è in stand-by. Non fanno parte della manutenzione autorizzata. Altri lavori nella [ROADMAP](ROADMAP.md), verifiche orari in [da-verificare](da-verificare/orari-locali.md).

## Limiti e seguito

Prima dell’integrazione servono l’OK a push/PR e l’esecuzione del workflow aggiornato su GitHub; main risulta ancora senza protezione. Dipendenze: cinque pacchetti segnalati dall’audit, aggiornamenti soltanto dopo revisione e autorizzazione. Controllo completo dei tipi non ancora predisposto. Prestazioni: Lighthouse locale singolo 94, soglia 95 e anteprima di rilascio ancora da verificare.

Dopo l’OK al seguito, scegliere fra aggiornamenti di sicurezza e organizzazione mirata di verifiche/archivi. Per lavorare bastano ambiente locale e strumenti esistenti; GitHub e Vercel servono nel blocco di integrazione autorizzato. Stato e comandi in [docs/README](docs/README.md), [README](README.md) e [ambiente locale](docs/AMBIENTE-LOCALE.md).
