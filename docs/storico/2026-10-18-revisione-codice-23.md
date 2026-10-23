# Revisione codice 23 · costi delle etichette delle strade

18 ottobre 2026, base c2dcdba. Primo gruppo della nuova sessione continuativa di almeno 45 minuti richiesta da Enrico, iniziata alle 10:53:07 UTC.

## Risultato e prove

Il caso rimasto aperto nel resoconto 22 è corretto. Tre processi isolati, interrotti dopo 1,5 secondi prima della modifica, riproducevano: indice con una via da zero a 1e12, campionamento di un percorso della stessa lunghezza e indici oltre la precisione intera. Una quarta prova rivelava risultati parziali con opzioni/geometrie non valide.

La ricerca delle etichette ora controlla i punti e i parametri e applica limiti complessivi: 100.000 campioni, 200.000 riferimenti nell'indice, 2.000.000 confronti. Se li supera, restituisce un elenco vuoto: il percorso può restare disegnato senza etichette parziali. Non sono limiti geografici né una semplificazione della linea. Restano ammessi punti ripetuti, nomi e coordinate ordinari. Le protezioni sommano anche molti segmenti piccoli.

- **420/420 test**, sei aggiunte; nessun fallimento, salto o cancellazione. Build di **12 pagine**, **13 documenti / 811 link interni validi**, **82 risorse offline**, worker 4bb20527c760.
- Confronto completo vecchio/nuovo, solo in memoria: **21.179 percorsi distinti non vuoti**, **152.379 etichette identiche**, massimo 2.336 campioni per percorso. È esclusa la stringa vuota, conteggiata invece nel confronto dei decoder del gruppo 22.
- Tutte le 59 parti delle strade insieme: 2.451 nomi, 9.530 segmenti e 38.531 riferimenti; massimo 36 candidati in una cella. I limiti non intervengono su nessuno dei percorsi del confronto. Non è una misura del browser o di un itinerario di sette giorni intero.
- Log nella cartella della chat: nextstop-nomi-{test,build,links}-2026-10-18.log e nextstop-confronto-nomi-2026-10-18.log. Il confronto ha richiesto circa 315 secondi locali: dato descrittivo, non benchmark prestazionale isolato.

## Seguito e limiti

La sessione prosegue su calendario e suggerimenti fra giorni. Browser escluso; nessuna installazione, delega, download reale, rigenerazione, pubblicazione o modifica ai dati/ID/URL. La nuova idea su altre città e aggiornamenti rimane rinviata anche nell'analisi. Area 3 ancora aperta; nessuna automazione implicita.
