# Conservazione degli itinerari · primo blocco

16 ottobre 2026 · Ramo `codex/conservazione-itinerari` · Base `75d25e67bd413b724a5cfc4afb05612d1cfac165`.

Blocco autorizzato da Enrico dopo l'analisi del progetto. Corregge D1, D2 e D7: falso salvataggio, perdita dei record validi in un archivio parzialmente danneggiato e interruzione dei filtri dei locali con dati malformati.

## Comportamento dopo la correzione

- Il risultato di ogni scrittura rimane `false` se la memoria la rifiuta, anche dopo il primo avviso. Un fallimento senza callback non consuma l'avviso; una scrittura riuscita consente di segnalare un eventuale errore successivo.
- La lettura scarta singolarmente i record illeggibili e mantiene quelli validi e l'itinerario attivo, se recuperabile. Restano la sanitizzazione già esistente di tappe/giorni e la compatibilità con archivi senza versione o in versione 1.
- Prima di sostituire un archivio strutturalmente danneggiato o un JSON illeggibile, viene conservata la stringa integrale nella chiave locale `itinerari-v1-recupero`. La lettura non scrive nulla.
- Se la copia non può essere salvata, l'originale non viene sovrascritto e la scrittura restituisce `false`. Una copia precedente diversa viene conservata e impedisce la sostituzione di un secondo originale danneggiato. Una copia identica permette di riprovare senza scriverla nuovamente.
- Una versione di archivio sconosciuta non viene interpretata né riscritta. Il sito può lavorare in memoria e condividere il nuovo itinerario, ma non dichiara di averlo salvato.
- “Dove mangiare” legge un riepilogo validato dallo stesso modulo della memoria: giorni e tappe malformati non interrompono i filtri; date invalide non arrivano alla formattazione. I suggerimenti dell'itinerario valido continuano a funzionare.

## File

- `src/scripts/itinerari/memoria.ts`: lettura condivisa, recupero per record, copia prima della riscrittura, versione ed esito delle scritture.
- `src/scripts/itinerari/compositore/stato.js`: usa il salvataggio verificabile del modulo memoria; stato del compositore e funzioni di calcolo invariati.
- `src/scripts/dove-mangiare.ts`: usa il riepilogo validato al posto della lettura diretta dello storage.
- `test/conservazione-itinerari.test.mjs`: 11 regressioni con memoria finta, senza accesso ai dati reali.
- `PROGRESS.md` e questo resoconto: stato e limiti del blocco.

## Verifiche

Prima delle correzioni, le due letture/scritture esistenti sono state rese testabili senza modificarne il comportamento: i nuovi test hanno prodotto **10 fallimenti e un caso già compatibile**. Dopo le correzioni, 16/16 test mirati (11 nuovi più 5 esistenti) superati.

Verifiche finali con Node 24.21.0 e dipendenze già installate, senza installazioni:

| Controllo | Esito |
|---|---|
| `npm test` | **133/133**, nessun test saltato |
| Build Astro con `node --no-liftoff node_modules/astro/bin/astro.mjs build` | Riuscita, 12 pagine, circa 21,5 s |
| `npm run check:links` | 13 documenti HTML, **809 link**, nessun link rotto |
| Percorso normale | Duomo + Sansevero, Salva, ricarica, condividi e apri in un secondo profilo: tappe e ID persistenti conservati |
| Memoria bloccata | Tre tentativi Salva: nessuna falsa conferma, stato bozza e avviso con Condividi |
| Archivio parziale | Record valido ancora aperto, copia integrale presente e invariata dopo ricaricamento |
| Copia bloccata | Originale identico alla stringa iniziale, record valido consultabile |
| Versione futura | Originale non sovrascritto anche dopo aggiunta e Salva |
| Locali con tre archivi malformati | Filtri funzionanti: 32 locali → 11 con Pizza; nessuna scrittura allo storage |
| Locali con archivio valido | Suggerimento “Vicino alle tappe del giorno 1” e nome dell'itinerario presenti |
| Console | Nessuna eccezione JavaScript nei nove scenari browser |
| axe e immagini | Stato di salvataggio rifiutato: nessuna violazione in chiaro/scuro a 390 px; immagini locali conservate con le prove dell'audit |
| Diff | Controllo spazi riuscito; nessuna modifica a package, lockfile, dati, ID, URL, design, licenze o service worker |

Prove Chrome con puppeteer-core e axe già disponibili negli strumenti locali approvati, profili temporanei e dati sintetici. Gli output locali sono in `C:/Users/Windows11/Documents/nextstop/ricerca/2026-10-16-analisi-progetto/blocco-1-*`; il test automatico portabile è nel repository. Non è stata creata un'anteprima Vercel: Lighthouse e l'intero audit grafico non sono stati ripetuti per questa correzione circoscritta.

## Limiti e seguito

La copia di recupero resta nello stesso browser e non è una sincronizzazione o un backup esterno. È una sola copia, protetta dalle sostituzioni; non è stata aggiunta un'interfaccia per ripristinarla. In caso di assistenza si può leggerla con `localStorage.getItem('itinerari-v1-recupero')`, senza cancellare o sostituire l'originale. Se una seconda corruzione diversa incontra già una copia, la scrittura viene rifiutata per conservare entrambe: occorre esaminare i dati prima di un intervento manuale.

Dati già sovrascritti prima di questa correzione non sono ricostruibili dalla modifica. Concorrenza fra più schede, calcoli con pause/bus, scenari a piedi, aggiornamento cache e filtri offline restano fuori dal blocco, come i problemi D3–D6 dell'analisi. Il requisito non è un recupero perfetto di ogni formato arbitrario: la copia integrale conserva il materiale che il lettore non riesce a interpretare.

Prossimo passo consigliato: verifica del blocco e successiva autorizzazione al percorso di pubblicazione, oppure avvio separato del blocco 2. Nessun push, merge o deploy eseguito.
