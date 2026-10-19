# PROGRESS · stato attuale

## Accessi estesi e vecchia lista · 19/10/2026

Su richiesta di Enrico ricontrollati tutti i 31 URL residui e tutti i sei locali della vecchia lista (quattro siti, due senza fonte del gestore verificabile). Bilancio cumulativo su 54 indirizzi: 13 originali leggibili, 31 con alternativa ufficiale leggibile anche parziale/storica, 10 senza alternativa utile; non sono conteggi di siti distinti. Recuperati MiC Floridiana, atto parchi del 22/07/2025, ordinanza Marechiaro 2026, Artecard, PDF San Carlo e schede ulteriori. Segnalati accessi intermittenti e documenti storici. [Rapporto attuale](aggiornamenti/rapporti/2026-10-19-accessi-estesi.md), [21 verifiche personali residue su 26 gruppi](da-verificare/fonti-orari.md). Cinque gruppi con fonte e orario ordinario recuperati; tutti i sei locali della vecchia lista inclusi, Da Rosetta risolta per la domenica. Registro e lista aggiornati, rapporti precedenti conservati, dati applicativi invariati e controlli completi ancora zero. Verificati YAML, copertura, conteggi, riferimenti e conservazione; nessuna build applicativa eseguita. Branch `codex/controlli-periodici-fonti`, main invariato.

## Ritentativo fonti e verifiche personali · 19/10/2026

Ritentati 50 URL precedentemente non leggibili: 9 recuperati allo stesso indirizzo, 10 con alternativa ufficiale, 7 parziali e 24 ancora non verificabili. [Rapporto](aggiornamenti/rapporti/2026-10-19-ritentativo-fonti.md) e [20 verifiche personali per Enrico](da-verificare/fonti-orari.md), con collegamenti e richieste precise. Aggiunti canali alternativi e riscontri di accesso al registro; rapporto iniziale e vecchia lista locali conservati. Nessun dato applicativo aggiornato, nessun controllo completo concluso o scadenza rinviata. Verificati YAML, riferimenti, copertura e conservazione dei file. Lavoro sul branch `codex/controlli-periodici-fonti`; main non modificato.

## Registro dei controlli periodici · 19/10/2026

Su richiesta di Enrico, preparati [registro](aggiornamenti/controlli-periodici.yaml), [procedura condivisa Codex/Claude](aggiornamenti/PROCEDURA.md) e [rapporto iniziale](aggiornamenti/rapporti/2026-10-19-impostazione.md), secondo il piano approvato in questa chat. Copertura: 60 tappe/gite, 32 locali e 14 gruppi di trasporto, con ricerca obbligatoria di nuove pagine/PDF oltre ai vecchi URL, distinzione fra date di pubblicazione e validità, eccezioni e sedi. Prove iniziali: nuovo documento EAV dal 17 ottobre, cambio Girolamini dal 25, calendario futuro Sansevero e distinzione delle sedi Gesù Vecchio/50 Kalò. Alcuni siti non leggibili dal cloud; nessuna conferma degli orari basata sui soli risultati di ricerca. Dati applicativi e date precedenti conservati; nessuna pianificazione automatica né pubblicazione su main.

**Seguito di questo blocco:** primo controllo completo su richiesta, prioritari EAV e fonti non leggibili, seguendo la procedura. Le frequenze 7/14 giorni decorrono da controlli completati; la preparazione non rinvia le scadenze. La revisione Web Locks sospesa sul computer rimane un lavoro distinto. Dettagli e verifiche nel rapporto; gli appunti seguenti descrivono il lavoro precedente del 17 ottobre.

_Aggiornato il 17/10/2026. Enrico ha autorizzato push e integrazione in main di tutti i blocchi completati della PR #5, inclusi i sei commit locali successivi. La nuova revisione dei salvataggi è sospesa e conservata separatamente; non fa parte di questo rilascio._

## Pubblicazione su main · mandato corrente

La [PR #5](https://github.com/paulpetta000/Nextstop/pull/5) raccoglie salvataggi, calcoli, offline, dipendenze, prestazioni, blu del solo tema scuro e quattro gruppi di revisione. Versione applicativa verificata fino a 6ad8671: **225 test, build di 12 pagine e 811 link validi**. Verificare CI e deployment associati al commit prima di dichiarare il rilascio riuscito.

La richiesta di pubblicare precede il completamento della protezione atomica tra schede: il limite del gruppo 4 rimane dichiarato. Il lavoro Web Locks in corso è conservato localmente per riprenderlo dopo, senza essere incluso. Browser sempre escluso: nessuna nuova verifica visiva, axe o Lighthouse; i risultati precedenti non certificano le modifiche successive. Nessuna bozza di design o ricerca privata inclusa.

## Revisione del codice · salvataggi e recupero

Conclusi insieme rifiuto delle copie obsolete, avvisi coerenti e recupero tramite il comando Salva. Una modifica esterna già presente non viene più sovrascritta dal riferimento vecchio; errori visibili anche su itinerari già salvati e dopo altri avvisi. Copia locale conservata in pagina e percorso condivisibile; nessuna fusione automatica. **225/225 test, build di 12 pagine e 811 link validi**. Dodici prove aggiunte, anche sulle funzioni reali dell'interfaccia con elementi finti. [Prove e limiti](docs/storico/2026-10-17-revisione-codice-4.md).

**Resta aperta la simultaneità:** confronto e scrittura non sono atomici; finestra anche tra lettura e creazione del riferimento, client vecchi esclusi. Il gruppo mitiga il caso obsoleto riprodotto, non certifica l'assenza di tutti i conflitti. Nessun browser, dipendenza nuova, push, merge o deploy. Priorità successiva: protocollo coerente tra sessioni e recupero delle due copie; controlli UI prima del rilascio. Prova reale Claude sempre dopo main/pubblicazione, separata.

## Revisione precedente · dati, recupero e offline

Enrico chiede sessioni di revisione di almeno quindici minuti, salvo stop, con più parti collegate. Corretti pacchi incompleti e ciclo bloccante nei bus; scenari applicati insieme; nuovi tentativi dopo errori HTTP e schede preparate integralmente; ripiego su copia salvata per 5xx e rete disponibile anche con errori della cache. Estesa la revisione a indici del giorno nei link e archivi ricevuti da altre schede. **213/213 test, build di 12 pagine e 811 link validi**; decoder compatibili sui dati pubblici reali (87 punti, sei scenari, 8.793 candidati bus). [Prove e limiti](docs/storico/2026-10-17-revisione-codice-3.md). Nessun browser, dipendenza nuova, push, merge o deploy.

Il conflitto individuato in questo gruppo è stato affrontato nel gruppo 4 sopra; resta la limitazione delle operazioni simultanee. Prove isolate e vincoli di privacy conservati.

## Revisione precedente · trasferimenti, pronti e conservazione

Su richiesta di Enrico, si lavora per gruppi di due o tre parti collegate. Conclusi insieme **trasferimenti tra giorni, inserimento dei pronti e conservazione tramite salvataggio/rilettura/condivisione**. Corretti origine e limite giorni nel ramo interno delle gite, ordine e cronologia delle visite trasferite, numero del giorno nel riepilogo dei pronti. Difetti riprodotti prima; sette nuovi test, **191/191 test, build di 12 pagine e 811 link validi**, un solo ciclo finale comune. [Prove, raggiungibilità e limiti](docs/storico/2026-10-17-revisione-codice-2.md). Due moduli puri modificati; nessuna modifica a formato memoria, dati, temi o dipendenze. Nessun browser, push, merge o deploy.

Prossimo gruppo proposto: caricamento dei dati differiti, recupero dagli errori e aggiornamenti offline. Revisione complessiva in corso. Prova reale Claude dopo main/pubblicazione, separata; nessuna attività sul campo o con altre persone.

## Revisione del codice · primo blocco precedente

Enrico ha autorizzato l'avvio della revisione, tutta da computer. **Prova con uso reale di Claude rinviata a dopo main/pubblicazione, separata e non necessaria al rilascio.** Corretti due difetti con prove fallite prima: verso della passeggiata dal vivo calcolato senza il tratto dall'ultima visitata e minuti impossibili nei link convertiti in altri orari. Quattro test aggiunti; **184/184 test, build di 12 pagine e 811 link validi**. Solo calcolo.ts, link.ts e test pertinenti, oltre ai documenti. [Prove e limiti](docs/storico/2026-10-17-revisione-codice-1.md). Nessun browser, dato personale, dipendenza nuova, push, merge o deploy.

Prossimo blocco proposto: trasferimenti tra giorni e inserimento dei pronti, con conservazione di visitate/pause/orari. Revisione totale ancora in corso; non ripetere i blocchi già verificati senza motivo. Restano esclusi sopralluoghi, prove con altre persone e contatti locali; Search Console solo da esportazioni scelte da Enrico.

## Colore · blocco precedente locale

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

**Cosa fare dopo il rilascio richiesto:** 1. Riprendere la revisione locale sospesa e completare la protezione tra sessioni: lettura/scrittura coerenti, simultaneità e recupero delle due copie. La mitigazione del gruppo 4 non rende atomico localStorage. 2. Continuare il piano unico da computer, raggruppando più parti; minimo quindici minuti per queste sessioni di revisione salvo stop. 3. Completare i controlli UI prima di proporre il rilascio, rispettando il browser escluso. Prova reale Claude soltanto dopo il rilascio e con mandato separato. Strumenti locali presenti; GitHub/Vercel per un rilascio autorizzato. Nessuna nuova installazione.
