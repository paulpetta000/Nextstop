# PROGRESS · stato attuale

_Aggiornato il 18/10/2026 dopo la ripresa della chat interrotta. Ramo locale codex/salvataggi-coordinati-2026-10-18 dalla main pubblicata 96e480d; nessun nuovo push, merge o deploy._

## Revisione corrente · sessione continuativa del 18 ottobre

Sette gruppi conclusi nella sessione richiesta da Enrico: ingressi/privacy, ZIP/CSV, corse circolari, quote/OSM, decoder mappa, coerenza dei pacchetti e download incompleti. **338/338 test**, **71 prove aggiunte** rispetto a 267; build di **12 pagine**, **811 link validi**, **82 risorse offline**. [Riepilogo, prove e seguito](docs/storico/2026-10-18-revisione-codice-13.md). Tutto locale; dati generati sorgente, ID, URL, memoria v1, CSS e dipendenze conservati.

Sessione unica di almeno 35 minuti richiesta il 18/10, senza fermarsi fra i gruppi: nessuna automazione creata. Revisione del codice (area 3) ancora in corso; prossimo gruppo su preparazione/scrittura dei file generati e coerenza degli output. Vecchi client e verifiche browser restano limiti; nessuna pubblicazione. Nuova idea rinviata anche nell'analisi.

## Revisione precedente · coerenza dei dati differiti

Pagina e dati differiti ora condividono un riferimento della base dei tempi/proiezione: copie incompatibili vengono rifiutate prima di applicarle; tentativi falliti non restano successi memorizzati. **331/331 test**, build di **12 pagine**, **811 link validi**, **82 risorse**. Verificati sei pacchi e **59 pezzi** coerenti con il pacco iniziale. [Prove e limiti](docs/storico/2026-10-18-revisione-codice-12.md). Vecchi client senza controllo esclusi dalla garanzia; URL, memoria v1 e link condivisi conservati.

La sessione continuativa prosegue sui download incompleti. Nessun browser, installazione o pubblicazione; dati generati sorgente invariati; nuova idea rinviata anche nell'analisi.

## Revisione precedente · decoder e pezzi della mappa

Corretti blocchi con lato zero/viste enormi e rifiuto dei tratti compressi incompleti. Confronto identico su **21.180 percorsi e 1.332.817 punti**, più **2.000 viste** con stesso ordine dei pezzi. **322/322 test**, build di **12 pagine**, **811 link validi**, **82 risorse**. [Prove, profilo Node e limiti](docs/storico/2026-10-18-revisione-codice-11.md). Nessun CSS o dato generato cambiato.

La sessione continua sulla coerenza fra città iniziale, dati differiti e copie di versioni diverse. Browser, installazioni e pubblicazione esclusi; nuova idea rinviata anche nell'analisi.

## Revisione precedente · dati pedonali e quote

Controlli prima del grafo e del filtro: quote mancanti/non numeriche, griglie e parametri errati, risposte OSM parziali, coordinate incoerenti e nodi mancanti nelle vie vengono rifiutati. Formule e impostazioni predefinite conservate; provati quote zero/negative e nodi ripetuti coerenti. **317/317 test**, build di **12 pagine**, **811 link validi**, **82 risorse**. [Prove e limiti](docs/storico/2026-10-18-revisione-codice-10.md).

La sessione continua su decoder dei percorsi e selezione dei pezzi della mappa. Dati generati invariati; niente browser, installazioni o pubblicazione. Nuova idea rinviata anche nell'analisi.

## Revisione precedente · corse circolari e coerenza GTFS

Il generatore conserva ogni passaggio utile dalla stessa fermata, rifiuta chiavi duplicate e riferimenti mancanti, e mantiene serializzabili anche ID che coincidono con proprietà JavaScript. Prova completa fino allo spostamento del compositore, con ripiego dopo l'ultima corsa. **308/308 test**, build di **12 pagine**, **811 link validi**, **82 risorse**. [Prove e limiti](docs/storico/2026-10-18-revisione-codice-9.md). I dati generati restano invariati: la correzione del generatore richiederà la prossima rigenerazione autorizzata.

La sessione continuativa prosegue con dati pedonali e quote. Browser, installazioni e pubblicazione esclusi; nuova idea rinviata anche nell'analisi.

## Revisione precedente · lettori ZIP e CSV

Conclusi i controlli del lettore GTFS su integrità, offset, decompressione e CSV: rifiuti espliciti per file corrotti o formati non supportati. Compatibilità verificata con stored/deflate, commenti, descrittori con/senza firma, UTF-8/BOM/CRLF; 120 mutazioni deterministiche controllate. **302/302 test**, build di **12 pagine**, **811 link validi**, **82 risorse offline**. [Prove, limiti e riferimenti](docs/storico/2026-10-18-revisione-codice-8.md). Nessun dato generato o dipendenza cambiato.

La sessione di almeno 35 minuti continua: prossimo gruppo su coerenza delle tabelle e corse che ripassano dalla stessa fermata. Browser, installazioni e pubblicazione esclusi; nuova idea rinviata anche nell'analisi.

## Revisione precedente · ingressi e dati del generatore

Concluso il gruppo su pacchetto bus, generatore GTFS e privacy dei link. Valori non validi rifiutati prima del calcolo, città precedente conservata in caso di errore e nota Condividi allineata a Privacy. Risultato del decoder identico sui dati pubblici reali: 8.793 candidati e 101 date. **288/288 test**, build di **12 pagine**, **811 link validi**, **82 risorse offline**. [Prove e limiti](docs/storico/2026-10-18-revisione-codice-7.md). Nessun dato generato, formato, CSS o dipendenza cambiato.

Enrico ha chiesto una sessione unica di almeno 35 minuti: si prosegue con ZIP/CSV e ingressi dei generatori, senza pausa per un nuovo OK tra i gruppi. Browser, installazioni e pubblicazione restano esclusi. Idea multi-città e registro fonti rinviata anche nell'analisi.

## Revisione precedente · recupero dagli errori

Conclusi insieme nota di conservazione nel pannello, prove di Condividi dopo un conflitto e recupero dell'avvio senza stile completo. Corretta la promessa di persistenza durante attesa/errore; nuova nota aggiornata anche a pannello aperto. Avvio con Riprova, attesa massima dieci secondi e nessun avvio doppio, mantenendo lo stesso URL del foglio per la cache offline. **267/267 test**, build di **12 pagine**, **811 link validi**, **82 risorse offline**. [Prove e limiti](docs/storico/2026-10-18-revisione-codice-6.md). Nessun browser o pubblicazione; nessuna dipendenza o CSS modificati.

Ordine originale recuperato anche dalla chat precedente: siamo nel punto 3, revisione del codice, da cui Enrico aveva chiesto di partire. Prossimo gruppo: sicurezza/privacy degli ingressi e controlli dei generatori. Prova reale Claude separata dopo la pubblicazione. La nuova idea su città e registro aggiornamenti, compresa la sua analisi, è rinviata su istruzione di Enrico: non svilupparla adesso.

## Revisione precedente · salvataggi coordinati

Completato il blocco tecnico ripreso: lettura/riferimento coerenti, coda e Web Locks, attesa dell'ultima modifica prima di confermare, gestione errori/eventi storage e avviso d'uscita durante scritture pendenti o fallite. Corretti anche il primo salvataggio fallito dopo il cambio itinerario e la falsa etichetta «Salvato» nelle righe di «I miei itinerari», ora aggiornate anche dopo il completamento asincrono. Salva durante un autosalvataggio attende senza perdere il comando e senza applicarlo a un itinerario diverso. **253/253 test**, build di **12 pagine**, **811 link validi**, **82 risorse offline**. Prove con due worker Node realmente paralleli riuscite; nessun browser utilizzato. [Resoconto, prove e limiti](docs/storico/2026-10-18-revisione-codice-5.md).

Formato v1, dati, ID, URL, temi e dipendenze conservati. Stash originale b0a35c1123918d9a1867c104a0ff793e5822dc80 conservato. La protezione coordina solo client nuovi: vecchie schede aperte non partecipano; senza Web Locks la scrittura è rifiutata. Condividi non salva visite/timbri. Avviso nativo d'uscita non garantito in ogni chiusura. Verifiche UI e tra schede reali pendenti per il vincolo sul browser; nessuna nuova misura di prestazioni o compatibilità universale.

Prossimo blocco: percorsi di recupero dopo conflitto/aggiornamento esterno, poi piano unico da computer. Nessuna pubblicazione implicita; strumenti locali già presenti sufficienti. Le sezioni seguenti conservano i risultati precedenti; la simultaneità descritta come aperta nel gruppo 4 è affrontata dal blocco corrente entro i limiti sopra.

## Pubblicazione precedente · 17 ottobre 2026

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
