# Cache HTTP e sourcemap · 16/10/2026

Autorizzato da Enrico con «ok procedi», dopo il blocco Sharp. Ramo `codex/cache-sourcemap`, base `848f717`, con le correzioni precedenti già incluse. Nessun push, merge o deploy.

**Source-map-js è corretto; http-cache-semantics è aggiornato, ma il comportamento cache segnalato resta riproducibile.** L'audit npm e la correzione funzionale non sono la stessa verifica.

## Cambiamenti

- `source-map-js` **1.2.1 → 1.2.2**: correzione documentata dell'amplificazione di lavoro causata dagli offset delle sourcemap indicizzate. [Avviso e versione corretta](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), [rilascio](https://github.com/7rulnik/source-map-js/releases/tag/v1.2.2).
- `http-cache-semantics` **4.2.0 → 4.3.0**: aggiornamento compatibile disponibile sul registro ufficiale. Il codice migliora il confronto di Vary e aggiunge informazioni sullo stato della risposta, ma non corregge il caso max-stale descritto sotto. [Repository del manutentore](https://github.com/kornelski/http-cache-semantics), [avviso](https://github.com/advisories/GHSA-ch52-4w7c-c8xp).
- Nel lockfile cambiano **soltanto queste due voci**. Entrambe rientrano negli intervalli già richiesti dai consumatori (`^4.2.0`, `^1.2.1` e `^1.0.1`). Manifest, dipendenze dirette, Astro, Satori, Sharp, dati, sorgenti e file pubblici invariati. Nessun override o patch locale alle librerie.
- Cinque test aggiunti in `test/dipendenze-sicurezza.test.mjs`: offset enormi, valori non validi, somma di offset annidati, compatibilità delle mappe ordinarie e durata della cache immagini di Astro con un cookie sintetico.

## Revisione e installazione

Metadati npm e due archivi ufficiali letti prima dell'installazione, verificandone SHA-512: **22 file di testo**, senza ulteriori dipendenze runtime. Lettura automatizzata integrale, inventario con SHA-256 e ricerca delle operazioni sensibili; confronto delle modifiche e rilettura dei punti interessati.

Nessun hook automatico di installazione, download di codice, accesso a credenziali o invio di statistiche individuato. I riferimenti base64 sono la codifica VLQ delle sourcemap. `new Function` crea una funzione da un modello interno già presente nella 1.2.1; la 1.2.2 aggiunge una prova costante e un ripiego quando la generazione dinamica è vietata. Non usa il contenuto delle sourcemap come codice da eseguire. Gli script webpack/mocha sono di sviluppo e non sono stati eseguiti.

Installati soltanto i due pacchetti, con versioni esatte, nel progetto ignorato `node_modules/.cache-sourcemap-verifica/`, tramite `npm ci --ignore-scripts --no-audit --no-fund`. Tutti i 22 file installati coincidono con quelli revisionati. Nessuna nuova installazione completa del sito.

La worktree riusava pacchetti tramite junction. Perché anche i consumatori risolvessero le versioni nuove, materializzati localmente i percorsi di Astro, Vite, PostCSS, css-tree, csso, magicast e `.bin`, con hardlink ai singoli file già presenti, letti prima di creare i collegamenti. Nessun contenuto di questi pacchetti modificato e nessuna dipendenza aggiornata nella cartella primaria. La prima traccia aveva correttamente rivelato source-map-js 1.2.1 attraverso Vite condiviso: la prova finale è stata ripetuta dopo l'isolamento di Vite e mostra **solo 1.2.2 e 4.3.0** per i due moduli richiesti.

## Risultati

| Controllo | Esito |
|---|---|
| Cinque nuovi test, prima dell'aggiornamento | **3 falliti, 2 riusciti**, senza carichi enormi o rete |
| Cinque nuovi test, dopo l'aggiornamento | **5/5 riusciti** |
| Suite finale `npm test` | **164/164**, nessuno saltato, circa 8,13 s |
| Build finale | **12 pagine**, 5,45 s; Node 24.21.0 con `--no-liftoff`, telemetria Astro disabilitata |
| Traccia della build | cache 4.3.0 caricata da Astro; sourcemap 1.2.2 caricata da PostCSS |
| Link interni dopo la build finale | **13 HTML, 809 link, nessuno rotto** |
| Confronto dell'output | **705 file identici** all'output precedentemente verificato, service worker invariato `bc77dfc4be4e` |
| Risoluzione Linux del lockfile | `npm ci --dry-run` riuscito, senza installare pacchetti |
| Audit npm | Due voci moderate: **fflate e Satori**; nessuna voce high nel responso, con il limite cache qui documentato |

L'output identico evita una nuova prova browser/axe/Lighthouse per questo blocco; nessun nuovo punteggio o anteprima di rilascio dichiarati. Resta da eseguire la CI Linux reale, dopo un push autorizzato. Il dry-run non esegue i pacchetti.

## Problema cache mantenuto aperto

L'avviso consultato riporta nessuna versione corretta e un intervallo fino a 4.2.0. npm non segnala più 4.3.0, ma la prova del comportamento conserva il problema:

1. Risposta interamente fittizia con `Cache-Control: max-age=3600` e `Set-Cookie: sessione=fittizia; HttpOnly`, in modalità condivisa predefinita.
2. La libreria la considera memorizzabile ma azzera `maxAge()` per cautela sui cookie.
3. Una nuova richiesta con `max-stale=999999999` è comunque accettata senza riconvalida e il risultato include il cookie.
4. Il risultato è uguale nella **4.2.0 e nella 4.3.0**. Non dichiaro l'avviso corretto solo perché npm non lo elenca più.

È una prova locale della libreria, non un attacco effettuato contro Nextstop. Il progetto è statico; il percorso Astro esaminato usa `storable()` e `timeToLive()` per le immagini di build, non `evaluateRequest()`/`satisfiesWithoutRevalidation()` con direttive inviate dai visitatori. Non è stata individuata una cache condivisa multiutente che esponga il caso descritto. Il test dedicato conferma che la risposta con cookie sintetico non riceve una durata positiva e che la funzione non restituisce gli header remoti.

Questo delimita l'uso esaminato, senza certificare qualunque futuro uso della libreria. Se si introducono un proxy, un backend, immagini remote autenticate o cache HTTP condivise, riesaminare il caso prima di pubblicare. Nessun aggiramento dei controlli e nessuna modifica a codice di terzi introdotti per ottenere un audit verde.

## Prove conservate e seguito

[Sintesi strutturata](2026-10-16-cache-sourcemap-verifiche.json) versionata con questo resoconto: versioni, integrità, test, output, audit e riproduzione cache. I cinque test sono permanenti. Prove grezze e script locali nella cartella iniziale dell'audit `C:/Users/Windows11/Documents/nextstop/ricerca/2026-10-16-analisi-progetto/`, prefissi `cache-`, `sourcemap-` e `cache-sourcemap-`; nessun dato utente o segreto nei casi sintetici.

Seguito consigliato: blocco circoscritto Satori/fflate, previa revisione delle versioni e dei pacchetti, mantenendo visibile la limitazione cache. Integrazione GitHub, protezioni di main, anteprima Vercel e rilascio restano separati e richiedono la relativa autorizzazione.
