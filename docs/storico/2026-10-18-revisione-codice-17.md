# Revisione codice 17 · arrivi, partenze e accessi ai bus

18 ottobre 2026, base 9e3f743. Terzo gruppo della sessione continuativa di almeno 45 minuti; si prosegue.

## Correzioni

Il lettore considerava solo la partenza di ogni fermata: una sosta alla destinazione veniva aggiunta al viaggio anche quando il passeggero era già arrivato. Ora gli orari veri usano la partenza dalla salita e l'arrivo alla discesa. Verificato un caso da dieci minuti che prima ne produceva venti. Gli arrivi prima della partenza precedente e le partenze prima del proprio arrivo sono rifiutati.

I campi pickup_type e drop_off_type vengono letti separatamente. Nei percorsi ordinari si usano gli accessi regolari; quelli vietati o subordinati a prenotazione/accordi non vengono presentati come accessi ordinari. Restare a bordo attraverso una fermata non utilizzabile resta possibile. Le corse circolari cercano ogni salita consentita e la prima successiva discesa consentita.

Fonte tecnica consultata il 18/10/2026: [specifica GTFS, stop_times.txt](https://gtfs.org/documentation/schedule/reference/#stop_timestxt). Distingue arrival_time/departure_time e i metodi di salita/discesa; i valori 2 e 3 richiedono accordi. L'esclusione dagli accessi ordinari deriva dal fatto che il prodotto non gestisce questi accordi. Nessuna nuova informazione su orari reali ANM ricavata dalla specifica.

Nel grafo, una discesa non dipende più dalla presenza di altre partenze: il capolinea resta raggiungibile a piedi dal bus. Fermate di sola salita non permettono di scendere; conservati i modi senza bus e bus subito. Il lettore espone le discese utili per fascia e il generatore le collega agli accessi separatamente dalle attese.

## Prove e limiti

- Sette riproduzioni fallite prima delle rispettive correzioni; nove prove nuove totali, comprese GTFS → fermate del generatore e grafo reale.
- **377/377 test**, zero fallimenti, salti o cancellazioni; build ordinaria di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker 527bd56986ca.
- Log nella cartella della chat: nextstop-fermate-bus-test-2026-10-18.log, nextstop-fermate-bus-build-2026-10-18.log, nextstop-fermate-bus-links-2026-10-18.log.
- Solo feed sintetici. Nessuna rigenerazione dei JSON attuali: questi cambiamenti entrano nei dati alla prossima generazione autorizzata. Nessun download del feed reale, browser o pubblicazione.

La stima media resta un grafo aggregato sulle corse della fascia, con tempi mediani; non è un calcolo completo per singola corsa e non è traffico in tempo reale. Il formato conserva una durata mediana anche per le partenze vere della stessa coppia: non promette precisione per ciascun viaggio. Nessuna prenotazione o servizio a chiamata implementato. Area 3 aperta; segue integrità e conversione dei pacchi numerici. Nuova idea rinviata anche nell'analisi.
