# Satori e fflate · correzione ZIP64 (16/10/2026)

Autorizzato da Enrico con «vai», dopo il blocco cache/sourcemap. Ramo `codex/satori-fflate`, base `cd92cbc`, con i blocchi precedenti già inclusi. Nessun push, merge o deploy.

**Corretta la causa degli ultimi due avvisi npm, mantenendo Satori 0.33.5 e passando fflate da 0.7.3 a 0.7.5.** La vulnerabilità è stata riprodotta prima della modifica e non si riproduce più nei tre ingressi provati. L'audit restituisce zero segnalazioni; resta comunque aperto il distinto [rilievo cache](2026-10-16-cache-sourcemap.md).

## Scelta e modifica minima

L'[avviso ZIP64](https://github.com/advisories/GHSA-px8p-9vwx-vf98) riguarda `unzipSync()` con un archivio malformato: la ricerca di un campo mancante può continuare senza limite. La correzione è disponibile nella serie 0.7 da **0.7.5**. Satori era segnalato per la dipendenza fflate, non per un secondo difetto autonomo dimostrato.

La versione diretta Satori 0.33.5 fissa fflate a 0.7.3; anche la versione latest consultata, 0.62.0, mantiene quella richiesta. Aggiornare il renderer a un'altra serie non risolverebbe quel vincolo. Per questo il blocco conserva il renderer e usa il meccanismo ufficiale [npm overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides):

```json
"overrides": {
  "fflate": "0.7.5"
}
```

Nel lockfile cambia soltanto la voce `node_modules/fflate`. Nessuna dipendenza diretta nuova; nessuna modifica a codice del sito, generatore delle anteprime, dati, ID, URL, font, immagini pubbliche o licenze. La compatibilità con Satori e con il suo uso dei font è stata provata, non presunta dal numero di versione. Satori importa `inflateSync` da fflate: la build tracciata conferma **0.7.5 caricata proprio da Satori**.

L'override è una scelta di manutenzione da riesaminare quando si aggiornano Satori o altri consumatori: non estenderlo automaticamente a una futura serie di fflate senza verifiche. Rimuoverlo quando la catena ordinaria può risolvere una versione corretta, conservando le prove di regressione. [Registro ufficiale fflate 0.7.5](https://registry.npmjs.org/fflate/0.7.5), [metadati Satori 0.62.0](https://registry.npmjs.org/satori/0.62.0).

## Revisione e ambiente

Letti prima dell'installazione i **13 file** dell'archivio ufficiale fflate 0.7.5: testi e sorgenti, 535.838 byte, senza dipendenze runtime. Lettura automatizzata integrale e inventario SHA-256; integrità SHA-512 dell'archivio verificata; riletti la correzione ZIP64, i punti sensibili e le differenze dalla 0.7.3.

La libreria usa worker con `eval: true` per creare il proprio codice di compressione asincrona: meccanismo già presente, non codice preso dai file compressi. I dati passano come messaggi al worker. Gli esempi fetch/readFile sono documentazione; non individuati telemetria, letture di credenziali, download automatici o hook di installazione. Gli script di sviluppo/prepack non sono stati eseguiti.

Installato il solo pacchetto revisionato in `node_modules/.fflate-verifica/`, con versione esatta e `npm ci --ignore-scripts --no-audit --no-fund`: tutti i 13 file installati coincidono con quelli letti. Satori già presente è stato materializzato nella worktree con hardlink ai file invariati, dopo averli letti, perché risolvesse fflate dalla worktree e non dalla cartella primaria. Non è stata installata una nuova versione di Satori né rifatta l'installazione completa del progetto. La cartella primaria mantiene fflate 0.7.3 e le sue bozze.

## Prove e risultati

Sette test permanenti in `test/fflate-sicurezza.test.mjs`, con fixture ZIP64 di poche centinaia di byte e nessuna estrazione su disco:

- Tre ingressi, CommonJS, ESM e browser: archivio ZIP64 senza extra field rifiutato senza blocco. Ogni prova gira in un processo figlio con timeout di due secondi, che interrompe il ciclo della versione vulnerabile.
- ZIP64 valido con file vuoto ancora leggibile.
- ZIP ordinario con testo UTF-8 e file vuoti conservato.
- Deflate/inflate con buffer destinazione, contratto usato dai font, conservato.
- Compressione asincrona nei worker e decompressione sincrona compatibili.

Prima: **3 prove fallite per timeout, 4 riuscite**. Dopo: **7/7 riuscite**, circa 0,31 secondi. Non sono test che controllano soltanto il numero della dipendenza.

| Verifica finale | Risultato |
|---|---|
| Suite completa `npm test` | **171/171**, nessuno saltato, circa 11,24 s |
| Build | **12 pagine**, 7,05 s; Node 24.21.0 con `--no-liftoff`, telemetria Astro disabilitata |
| Traccia moduli | Satori 0.33.5 importa fflate 0.7.5 |
| Link | **13 HTML, 809 link, nessun errore** |
| Output sito | **705 file identici** all'output già verificato; service worker `bc77dfc4be4e` invariato |
| Anteprime | **9 PNG 1200×630 identici**, sia nei file sia nei pixel |
| Audit del lockfile | **Zero segnalazioni** di ogni gravità |
| Lockfile e override, risoluzione Linux | `npm ci --dry-run` riuscito; nessuna installazione o esecuzione Linux dichiarata |

Non ripetute scansioni browser, axe o Lighthouse, perché tutto l'output è identico. Le foto elaborate da Astro riusano la cache della versione Sharp già verificata; non sono presentate come nuove rigenerazioni a freddo. Le nove anteprime vengono invece prodotte dalla build e confrontate esplicitamente.

## Prove conservate e limiti

[Sintesi strutturata versionata](2026-10-16-satori-fflate-verifiche.json): scelta dell'override, revisione, prove prima/dopo, suite, build, pixel delle anteprime, audit e perimetro del lockfile. I sette test sono riproducibili nella suite senza nuovi strumenti. Metadati, inventario, log, traccia e script diagnostici locali restano nella cartella dell'audit `C:/Users/Windows11/Documents/nextstop/ricerca/2026-10-16-analisi-progetto/`, prefissi `fflate-` e `satori-`.

Zero avvisi npm non equivale a una certificazione generale. Il comportamento max-stale/cookie di http-cache-semantics 4.3.0, dimostrato nel blocco precedente, rimane documentato e aperto anche se non compare nell'audit. Il percorso immagini statico di Astro è coperto dal test dedicato; non introdurre una cache multiutente dando per risolto quel caso.

Restano da verificare installazione/esecuzione completa su Linux in GitHub, anteprima Vercel e requisito mobile 95 del rilascio. Push, PR, merge, protezioni remote e pubblicazione richiedono la relativa autorizzazione. Il controllo completo dei tipi e l'organizzazione mirata di archivi/verifiche restano lavori separati; nessun refactoring ulteriore incluso in questo blocco.
