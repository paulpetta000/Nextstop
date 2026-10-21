# Chiusura della revisione locale · perimetro finale

Ripresa del 21 ottobre 2026 dalle 12:29:23 UTC, su richiesta di oltre una ora di lavoro attivo. Base 4164ef9, codice 851c1da, 723 test. Questo elenco delimita il lavoro residuo: non aggiunge funzionalità o scelte grafiche.

| Blocco | Criterio di chiusura | Esito aggiornato |
|---|---|---|
| C1 · Tastiera differita | Riprodurre e correggere ritorni che spostano il fuoco dopo cambi di contesto; preservare tasti e grafica approvati | Concluso localmente: [revisione 53](2026-10-21-revisione-53.md), 744 test |
| C2 · Caricamenti e mappa | Rilettura mirata dei ritorni in stato/avvio/mappa, con prove dei soli difetti dimostrati; annotare i percorsi già protetti | Concluso localmente: [revisione 55](2026-10-21-revisione-55.md), 756 test |
| D1 · Quindici riscontri editoriali | Esaminare tutti i quindici fatti segnalati, consultare originali disponibili; confermare solo quanto provato e registrare gli irrisolti senza nasconderli | Esaminati 15/15: undici verificati, quattro aperti; [revisione 54](2026-10-21-revisione-54.md) |
| M1 · Alterazione della build | Confrontare prove conservate e catena di trasformazione con una sonda mirata; risolvere solo con causa riprodotta, altrimenti dichiarare il limite | Diagnosi eseguita, causa aperta; [revisione 56](2026-10-21-revisione-56.md) |
| M2 · Integrazione e tipi | Misurare differenze con il riferimento remoto già acquisito e verificare strumenti disponibili senza installazioni o cambi di ramo; separare integrazione e controllo tipi non eseguibili | Confronto eseguito: input remoti identici alla base, integrazione/tipi non eseguiti; [revisione 56](2026-10-21-revisione-56.md) |
| F1 · Chiusura comune | Test/build/link dopo ogni gruppo eseguibile; casi del prodotto, integrità dei dati, indice/prove/piano e lista finale degli impedimenti coerenti | Eseguito: 756 test, build e link riusciti; 7 casi reali, 5 JSON/18 matrici coerenti, 12 documenti e 170 rimandi controllati. Una impronta diversa su 170 conservata e dichiarata nel [resoconto finale](2026-10-21-chiusura-locale.md) |

Restano separati: prove native nel browser (escluso), Search Console da esportazioni scelte da Enrico, verifiche future di aperture e feed non ancora pubblicati, usabilità con altre persone e confronto con servizi IA. Nessuna installazione, pubblicazione, merge, modifica a protezioni, delega o automazione implicita. Istruzioni/consumo Claude esclusi fino a richiesta futura. Nuova idea rinviata anche nella analisi e nella stesura. Colori, CSS, icone e posizionamenti approvati conservati.

La chiusura della revisione locale richiede un esito per ogni riga; un limite documentato non equivale a una verifica riuscita o a un prodotto pronto al rilascio. Non si usa il numero di test come percentuale del totale.

Durata minima verificabile: **60 minuti e 10 secondi di lavoro complessivo**, nelle finestre 12:29:23–13:28:41 UTC e 17:59:16–18:00:08 UTC. L’intervallo fra le due finestre è escluso dal conteggio; non si dichiara lavoro ininterrotto durante la pausa.
