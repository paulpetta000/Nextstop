# Verifica di integrazione su GitHub e Vercel · 16 ottobre 2026

Enrico ha autorizzato push e apertura della PR con verifica su GitHub/Linux e preparazione dell'anteprima. Pubblicato il ramo `codex/satori-fflate`, sei commit da `75d25e6` a `156e1ae`: [PR #5, in bozza](https://github.com/paulpetta000/Nextstop/pull/5). Nessun merge e nessun rilascio in produzione. La conclusione di questo blocco aggiorna soltanto documentazione e prove.

## Installazione pulita e CI

[Esecuzione riuscita](https://github.com/paulpetta000/Nextstop/actions/runs/38968577527), Ubuntu 24.04.5, Node 22.23.3 e npm 10.9.9. Il workflow ha letto il commit dell'evento `17934c2097db9635b84485dfe3315362b0dd8039`: è il merge di prova GitHub della PR, con head `156e1ae1a0a235f31c9fe3e0cc99ff86eb4d7c54` e base `75d25e67bd413b724a5cfc4afb05612d1cfac165`. Il controllo del SHA coincide; non è un merge su main.

- `npm ci --ignore-scripts --no-audit --no-fund`: 233 pacchetti installati da zero, riuscito.
- `npm test`: **171 test superati, zero falliti**, circa 1,92 secondi.
- `npm run build`: **12 pagine**, riuscita in circa 70 secondi, comprese le immagini senza cache iniziale.
- `npm run check:links`: **13 HTML, 809 link interni**, nessun errore.

Questo completa l'installazione Linux reale che nei blocchi delle dipendenze era stata soltanto simulata. L'audit a zero segnalazioni è il risultato locale del blocco fflate; questo workflow non esegue npm audit.

## Anteprima e percorso completo

[Anteprima tecnica verificata](https://nextstop-1e1w0pv70-enrico-2d20.vercel.app/napoli/itinerari/), deployment `dpl_Cwzg7uBzzN7uRUri7yd44npQitje`, stato READY e commit `156e1ae`, progetto Nextstop. È una Preview, non Production; la protezione Vercel è conservata. Build di 12 pagine riuscita in 6,33 secondi, riusando la cache delle immagini. I collegamenti temporanei di accesso non sono nel rapporto o nel repository.

Chrome con profili effimeri e dati sintetici:

- **Dieci pagine**: home, Napoli, itinerari, locali, fonti, privacy, termini, note legali, accessibilità e offline. Nessun errore JavaScript, console o risposta HTTP di errore osservata.
- **20 controlli axe**, chiaro/scuro: nessuna violazione automatica. Verificati anche itinerario completo in entrambi i temi (altri due controlli), larghezze 320/390 px e pagina a 1280 px. Nessuno scorrimento orizzontale osservato. La preferenza riduci movimento è attiva e non risultano animazioni in esecuzione nei dieci stati controllati.
- Aggiunta di Duomo a un itinerario con Sansevero, salvataggio, ricarica con ID e tappe conservati, riapertura del link in un altro profilo: riusciti. Il payload Web Share è intercettato senza inviarlo; verificato anche il campo per copiare il link quando Web Share non è disponibile.
- Dopo una visita alla sola home: service worker attivo con **81 risorse** nella cache `pagine-c99ec9c25a6c`. Rete disabilitata nel browser: pagina dei locali, filtro pizza (11 risultati), compositore a piedi e salvataggio delle due tappe riusciti, senza errori osservati.
- Immagini da telefono chiaro/scuro conservate nella ricerca locale; verificate visivamente, compresi mappa, tappe e stato Salvato. Non sono caricate nel repository come nuovi contenuti del sito.

Axe mantiene alcuni controlli di contrasto incompleti: il risultato automatico non certifica l'intera accessibilità. La prova offline non equivale a una nuova verifica degli aggiornamenti fra due versioni del worker, già documentata nel blocco calcoli/offline.

## Prestazioni e limiti

Lighthouse mobile standard, una misura per pagina, cache browser e dati del sito svuotati prima di ogni misura, cookie temporaneo conservato per l'accesso. Segnalazione errori disabilitata.

| Pagina | Prestazioni | Accessibilità | Buone pratiche | LCP | Blocco totale | Spostamenti layout |
|---|---:|---:|---:|---:|---:|---:|
| Home | **98** | 100 | 100 | 1,9 s | 150 ms | 0 |
| Compositore | **94** | 100 | 100 | 2,6 s | 130 ms | 0 |

**La soglia 95 non è raggiunta sul compositore.** L'anteprima è tecnica e la PR rimane in bozza: questo blocco non dichiara il sito pronto al rilascio.

Il rapporto segnala circa 43 KiB di JavaScript e 26 KiB di CSS non usati nel caricamento iniziale del compositore, oltre a ricalcoli del layout e miniature sovradimensionate. Sono candidati da misurare per un blocco prestazioni separato: non dimostrano che il codice sia inutilizzato nelle interazioni, e non vanno cancellati automaticamente. La home supera la soglia; Lighthouse suggerisce comunque un possibile risparmio nelle immagini. Non sono stati modificati grafica o caricamenti per inseguire il punteggio in questo blocco.

SEO Lighthouse 69/66 perché Vercel serve `x-robots-tag: noindex` nell'anteprima protetta; non è stata rimossa la protezione per alzare il punteggio. Resta inoltre aperto il comportamento generico max-stale/Set-Cookie di cache 4.3.0, distinto dall'audit npm senza segnalazioni; dettagli nel [rapporto cache](2026-10-16-cache-sourcemap.md).

## Prove conservate e seguito

[Risultati strutturati](2026-10-16-integrazione-github-verifiche.json). Script, diagnostica e immagini restano nella cartella locale `ricerca/2026-10-16-analisi-progetto/`, senza includere bozze o ricerche preesistenti nella PR.

Lo script iniziale della condivisione attendeva erroneamente il fallback testuale mentre Chrome mobile espone Web Share; la prova è stata adattata per controllare entrambi i percorsi senza messaggi a terzi. Un errore CDP durante la pulizia della cache è stato risolto usando una sessione di pagina in uno script Lighthouse separato. Entrambi sono problemi dello strumento diagnostico, conservati nei log; non hanno richiesto correzioni al sito.

Il commit di chiusura cambia soltanto questo rapporto, il JSON delle prove e PROGRESS: controllare riferimenti e diff; la CI si riesegue automaticamente dopo il push. Il suo esito finale sarà riportato nella PR. Prima di merge/rilascio resta un blocco prestazioni mirato, nuova misura della pagina interessata e approvazione esplicita di Enrico. Nessuna dipendenza nuova necessaria per la diagnosi: bastano ambiente locale, Chrome, axe/Lighthouse già disponibili e strumenti GitHub/Vercel.
