# Calcoli e uso offline · secondo blocco

16 ottobre 2026 · Ramo `codex/calcoli-offline`, da `939e882` (primo blocco). Autorizzato da Enrico con «vai continua».

## Risultato

Corrette le voci D3–D6 dell'analisi: pause e margini con orari coerenti, preferenza a piedi indipendente dal caricamento successivo, precedenza della cache corrente e filtri dei locali funzionanti offline dalla sola prima visita alla home. Nessun push, merge o deploy.

### Calcoli

`conPause` riceve data e preferenza di spostamento dal compositore. Per ogni tratto richiama la stessa funzione di calcolo usata dal motore, all'ora effettiva dopo le pause: ricalcola corsa raggiungibile, scenario dei mezzi, durata, distanza e percorso alternativo. Aggiorna aperture dei locali, attese/ritardi degli eventi, superamento della fine scelta e totali; non modifica il risultato grezzo conservato in memoria.

Restano le decisioni approvate sul posto delle pause, il pranzo nei locali e le tappe già visitate. Non è stata introdotta una ricerca globale dell'itinerario ottimo né un modello nuovo degli orari dei musei.

### Dati a piedi

Il pacco iniziale contiene le differenze dei tempi a piedi rispetto al feriale. Non dipende più da `scenari.json` per rispettare «solo a piedi». Le differenze sono tolte dal download successivo per evitare duplicazioni. Gli altri scenari dei mezzi continuano ad arrivare dopo l'apertura; il loro ripiego feriale non è stato riprogettato.

La funzione pura che prepara il pacco è ora accanto a quella che lo riapre, con prove di andata/ritorno. Il formato interno del pacco richiede i dati a piedi; ID, archivio degli utenti e link condivisi mantengono i formati esistenti.

### Cache

- Script dei filtri e relative dipendenze sono precaricati insieme all'HTML di “Dove mangiare”.
- La precache corrente prevale sulle vecchie risposte in `risorse-v1`.
- I dati dinamici del compositore usano una cache con firma dei dati: cambia se cambiano JSON, pezzi di mappa, schede o pacco della città; resta uguale per un aggiornamento solo grafico. Pagine e dati superati vengono rimossi, foto e risorse immutabili già viste rimangono.
- Gli aggiornamenti in background sono legati a `event.waitUntil`, registrato durante il callback del fetch. Le scritture sono attese, ma un fallimento per cache piena non impedisce di usare una risposta valida della rete.
- Il nome della cache delle pagine considera anche template del worker e URL, oltre al contenuto dei file.

Riferimenti tecnici consultati: [MDN · waitUntil](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil), [MDN · strategie di cache](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching).

## Verifiche

I primi 17 nuovi test, prima delle correzioni, hanno prodotto **13 fallimenti e 4 casi già compatibili**. Aggiunti due controlli di compatibilità del pacco e una regressione sul caso cache piena, risultata inizialmente rossa e poi corretta. In totale **20 nuovi test** senza dipendenze aggiuntive.

| Controllo finale | Esito |
|---|---|
| `npm test` | **153/153**, nessun test saltato |
| Build Astro con Node 24.21.0 `--no-liftoff` | Riuscita, 12 pagine; ultima esecuzione circa 5,7 secondi con cache immagini già presente |
| `npm run check:links` | 13 documenti HTML, **809 link validi** |
| Calcolo nel compositore | Sabato, due tappe, pausa e margine: fine e minuti coincidono con il motore sui dati costruiti |
| Aggiornamento dal worker precedente | Dati nuovi serviti al posto della sentinella vecchia; archivio sintetico conservato integralmente |
| Aggiornamento solo grafico | Pezzo dinamico della mappa e immagine già vista ancora in cache |
| Server realmente spento dopo visita alla sola home | Filtri Pizza: 32 → 11 locali; itinerario a piedi aperto e salvato con le tappe corrette |
| Percorso a piedi provato | Borgo Marinari → Camaldoli: 167 minuti, senza usare i tempi dei mezzi |
| Console, accessibilità e larghezze | Nessuna eccezione nei tre scenari browser; axe senza violazioni in chiaro/scuro sul compositore offline; nessuno scorrimento orizzontale a 320/390 px |
| Diff | Nessuna modifica a dipendenze, lockfile, dati originali, ID, licenze, testi editoriali o design |

Chrome usa profili temporanei e dati fittizi. Su HTTP locale il service worker è registrato esplicitamente dal test. L'aggiornamento dal vecchio worker usa il template del commit precedente; la prova solo grafica varia la versione del worker mantenendo gli stessi dati. I test automatici verificano separatamente che la firma cambi davvero anche modificando un pezzo della mappa.

Lighthouse mobile locale, una misura dopo l'aggiunta dei dati a piedi: **94 prestazioni**, 100 accessibilità, 100 best practices, 100 SEO; FCP 2,3 s, LCP 2,6 s, TBT 60 ms, CLS 0. Il punteggio dell'audit iniziale era anch'esso 94, ma le condizioni non costituiscono un confronto controllato. **Il requisito interno di 95 per il rilascio non è certificato**. Nessuna anteprima Vercel è stata creata in questo blocco.

Il JSON a piedi spostato nell'HTML occupa circa 59 kB non compressi (17 kB gzip); la pagina finale misura 591.058 byte, circa 121 kB gzip. La precache complessiva passa da 80 file / 5.793 kB del primo blocco a **81 file / 5.799 kB**, perché il payload viene spostato invece di essere scaricato due volte. È un costo anticipato per garantire la correttezza della preferenza anche senza rete.

## File e limiti

Codice: `src/lib/itinerari/calcolo.ts`, `pause.ts`, `pacco.ts`, `napoli.ts`; `src/scripts/itinerari/compositore/stato.js`; `src/pages/napoli/itinerari/scenari.json.ts`; `integrations/service-worker.mjs`, `sw-template.js`.

Test portabili: `test/pause-orari.test.mjs`, `pacco-itinerari.test.mjs`, `offline.test.mjs`. I controlli del service worker usano un ambiente simulato Node e un piccolo sito generato temporaneamente, senza pacchetti aggiuntivi. Le prove reali nel browser e i risultati grezzi sono conservati localmente in `C:/Users/Windows11/Documents/nextstop/ricerca/2026-10-16-analisi-progetto/blocco-2-*`.

Con dati cambiati, i vecchi pezzi dinamici non vengono riutilizzati: quelli non inclusi nella precache devono essere scaricati di nuovo con rete disponibile. Le immagini immutabili rimangono. Non è un backup esterno e non sono stati provati tutti i browser, tutti i dispositivi o ogni combinazione di schede rimaste aperte durante un rilascio. Le prove degli aggiornamenti riguardano l'attivazione completata del nuovo worker; non certificano una transazione atomica per vecchie pagine già aperte.

Prossimo blocco dell'analisi: documentazione e garanzie di manutenzione (indici, CI/GitHub, dipendenze e piano del controllo tipi), con autorizzazione separata. Prima di pubblicare rimane da verificare l'anteprima e il requisito prestazioni. Per il seguito locale bastano Node, Chrome e gli strumenti già presenti; GitHub/Vercel servono nel rispettivo blocco autorizzato.
