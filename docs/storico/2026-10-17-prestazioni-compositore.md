# Prestazioni del compositore · 17 ottobre 2026

Blocco autorizzato da Enrico dopo la verifica della PR #5: alleggerire il primo caricamento e raggiungere Lighthouse mobile almeno 95, conservando grafica, calcoli, mappa, link, memoria locale e offline. Codice nel commit `d84e429`, ramo `codex/satori-fflate`; nessun merge o rilascio in produzione.

## Modifiche

La schermata iniziale usa un piccolo CSS immediato, `src/styles/compositore-avvio.css`, con le stesse regole già presenti. Il foglio completo del compositore rimane identico, ma arriva come risorsa separata: `index.astro` lo collega anche in `noscript`. `src/scripts/itinerari/stile.mjs` ne attende il caricamento prima di mostrare i controlli; gestisce anche risorsa già pronta ed errore, senza attese irrisolte dopo un errore già noto.

L'avvio rende disponibili le sezioni inferiori dopo il primo disegno: la prima lettura delle dimensioni della giornata non richiede anche il loro layout. Il service worker salva il CSS fra le risorse iniziali, anche quando la prima visita è alla sola home. La cache passa da 81 a **82 risorse**; l'identità dei dati della mappa continua a dipendere dai dati, non da questa modifica grafica di caricamento.

L'HTML iniziale compresso passa da circa **121 a 98 KB**. Il CSS completo viene ancora scaricato: non è una riduzione del 20% dell'intero sito. Non sono eliminati stili dei pannelli, funzioni o dati sulla base della copertura del solo primo caricamento. Un esperimento sul precaricamento del modulo non dava vantaggi misurabili ed è stato scartato, con prove conservate nella ricerca locale.

## Verifiche

- **176 test superati**, zero falliti: cinque nuovi casi per lo stile e prova offline estesa al CSS. Prima della correzione, il fixture del service worker non trovava il foglio nella precache.
- Build locale di **12 pagine** riuscita con Node 24.21.0 e il flag locale già documentato `--no-liftoff`; **13 HTML e 811 link interni** senza errori. I due link in più sono i collegamenti al foglio di stile, con e senza JavaScript.
- [CI Linux riuscita](https://github.com/paulpetta000/Nextstop/actions/runs/38973495948): installazione pulita senza script automatici, Node 22.23.3, 176 test, build e 811 link. SHA dell'evento `db01d16365079796ed1d0412dbb684f0398a6c3c`, merge di prova di head `d84e429` con main `75d25e6`.
- Browser locale: CSS rallentato artificialmente (schermata iniziale visibile, controlli soltanto quando lo stile è pronto); entrambe le viste C/D, salvataggio e ricarica, cambio vista, pagina senza JavaScript con itinerari pronti e stile, server spento dopo la sola home con CSS e salvataggio disponibili.
- [Anteprima del codice verificato](https://nextstop-487y2t3e9-enrico-2d20.vercel.app/napoli/itinerari/), deployment `dpl_6i4nEyEuMsZNE1XGmvBf8uUr5hg1`, READY e Preview: viste C/D, salvataggio/ricarica e riapertura del link in un altro profilo riusciti. Nessun messaggio inviato a terzi. Offline con 82 risorse e CSS applicato riuscito.
- Axe in chiaro/scuro sulle due viste: nessuna violazione automatica; larghezze 320/390/1280 senza scorrimento orizzontale. Preferenza riduci movimento attiva; nessun errore JavaScript/console/HTTP osservato nei percorsi online. Immagini da telefono verificate visivamente. Axe mantiene alcuni controlli incompleti: non è una certificazione completa di accessibilità.
- Confronto degli output: **700 file identici** sui 705 iniziali; cambiano HTML del compositore e worker, tre moduli con nuovi nomi sostituiscono i precedenti, si aggiunge il CSS. Ora 706 file. Tutte le altre pagine e le **nove immagini Open Graph sono identiche**. Manifest, dipendenze, dati e CSS completo non modificati.

## Misure Lighthouse e variabilità

Lighthouse 13.5.0, configurazione mobile standard, Chrome con profilo temporaneo nuovo per ogni misura. Cache browser e dati del sito cancellati, solo cookie temporaneo di accesso conservato; nessun token nel repository, nessun invio di errori. Le ultime misure usano Node `--no-liftoff`, già adottato per i problemi locali del runtime; il codice pubblicato non dipende da questo flag.

| Misura finale dell'anteprima | Prestazioni | Accessibilità | Buone pratiche | FCP | LCP | Blocco totale | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Compositore, prova 1 | **98** | 100 | 100 | 1,7 s | 2,0 s | 108 ms | 0,00031 |
| Compositore, prova 2 | **98** | 100 | 100 | 1,7 s | 2,0 s | 73 ms | 0 |
| Home, controllo finale | **98** | 100 | 100 | 1,0 s | 2,3 s | 59 ms | 0 |

Le due misure locali con browser indipendenti erano 95/95. La soglia del progetto è dunque osservata anche nell'anteprima, ma i numeri non sono una garanzia per ogni visita.

**Gli esiti peggiori non sono stati cancellati.** La prima sequenza sull'anteprima dava 82/97 per il compositore e 89 per la home invariata. Nel confronto successivo la vecchia versione dava 72/69; una misura della nuova versione era stata invece reindirizzata alla pagina di accesso Vercel (40), quindi non misura Nextstop e va esclusa. Il confronto alternato è stato interrotto prima dell'ultimo esito. La ripetizione finale controlla anche l'origine dell'indirizzo effettivamente misurato. Il benchmark CPU registrato variava molto fra le sessioni; la causa precisa delle oscillazioni non è stata isolata. I dati grezzi restano disponibili: non si attribuisce tutto il cambiamento di punteggio alla sola modifica del sito.

La prova iniziale dello strumento axe perdeva la libreria perché il cambio dell'opzione mobile di Puppeteer provocava un ricaricamento. Sistemata soltanto la diagnostica mantenendo stabile l'emulazione; nessuna correzione del sito richiesta. I controlli funzionali sono riusciti anche sul deployment reale, separatamente dalle misure delle prestazioni.

SEO 66 sul compositore e 69 sulla home dell'anteprima è legato al `noindex` di Vercel, conservato. Rimane aperto il comportamento generico di cache HTTP max-stale/Set-Cookie descritto nel [rapporto dedicato](2026-10-16-cache-sourcemap.md); questo blocco non cambia dipendenze o configurazione della cache HTTP.

## Riferimenti e seguito

[Prove strutturate](2026-10-17-prestazioni-compositore-verifiche.json). Script, log e immagini sono conservati nella ricerca locale `ricerca/2026-10-16-analisi-progetto/prestazioni-*`; nessuna bozza dell'utente importata nella PR. Il CLI modern-web-guidance non è installato e non è stato installato un nuovo pacchetto: consultate le fonti ufficiali [caricamento e uso dei font](https://web.dev/learn/performance/optimize-web-fonts), [separazione del JavaScript](https://web.dev/learn/performance/code-split-javascript) e [ricalcoli forzati del layout](https://developer.chrome.com/docs/performance/insights/forced-reflow). La soluzione conserva il codice necessario alle interazioni e distingue primo disegno da interfaccia pronta.

La chiusura aggiorna soltanto stato, README e questo rapporto con le prove; la CI finale si riesegue sulla PR. Per il seguito basta rivedere l'anteprima e le immagini con Enrico: **merge e produzione richiedono ancora il suo consenso esplicito**. Restano separati controllo completo dei tipi, protezione di main e organizzazione mirata degli archivi. Nessuna installazione aggiuntiva necessaria; strumenti locali, GitHub e Vercel sono già disponibili.
