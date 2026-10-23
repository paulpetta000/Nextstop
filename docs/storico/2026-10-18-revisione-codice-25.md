# Revisione codice 25 · preparazione delle strade

18 ottobre 2026, base f8bd964. Terzo gruppo della sessione continuativa iniziata alle 10:53:07 UTC.

## Risultato

Il download Overpass scriveva direttamente sul file grezzo richiesto, perdendo la copia precedente anche con HTTP 503 o rete interrotta. Ora scarica in un temporaneo nella stessa cartella, verifica contenuto e metadati e sostituisce il file con la scrittura già condivisa. La pulizia rimuove solo i propri temporanei; disco pieno e risposte errate conservano la vecchia copia.

Lo stesso controllo opera prima della costruzione: JSON e UTF-8 completi, versione del formato, data reale della fonte, assenza di remark, vie con ID univoci, tag testuali e geometrie complete con coordinate geografiche valide. Il controllo è per la query specifica way[highway] / out tags geom, non un lettore OSM generale. Un risultato senza vie nel riquadro della città è un errore esplicito.

La suddivisione visita da subito solo le celle interne, che erano le sole conservate anche prima. La semplificazione mantiene gli stessi tagli di Douglas-Peucker usando una pila esplicita, senza esaurire quella delle chiamate su catene dettagliate. Non cambia la tolleranza, la proiezione, i nomi o la licenza.

## Prove

- Cinque regressioni iniziali fallivano prima della correzione del download/lettore. Un processo isolato per la suddivisione veniva interrotto dopo 1,5 secondi; una catena di 6.000 punti causava RangeError. Tutti i casi ora passano, inclusi duplicati, dati mancanti e compatibilità.
- **437/437 test**, nove aggiunte; zero fallimenti, salti o cancellazioni. Build di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker fbeb2e43a994.
- Confronti vecchio/nuovo: 10.000 linee per suddivisione e ordine dei tratti; 10.000 linee/anelli per punti semplificati. Risultati identici.
- Esecuzione completa del generatore in memoria su otto dataset: **4.000 vie / 85.953 punti**, JSON identico byte per byte. Download sempre fittizi; nessun nuovo dato reale o JSON sorgente scritto.
- Log nella cartella della chat: nextstop-generatore-strade-{test,build,links,confronto}-2026-10-18.log.

## Fonti tecniche e limiti

[Formato Overpass](https://dev.overpass-api.de/output_formats.html), [out geom](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL#out) e [segnalazione nel progetto OSM sugli errori con HTTP 200](https://github.com/openstreetmap/openstreetmap-website/issues/1178), consultati il 18/10/2026. Lettura di documentazione, senza interrogazioni ai servizi cartografici.

Non è una rigenerazione o certificazione della cartografia reale; le modifiche al generatore avranno effetto al prossimo aggiornamento autorizzato. La complessità peggiore di Douglas-Peucker resta quadratica, ma senza il limite di profondità ricorsiva. Prosegue la revisione del calcolo dei pasti; nessuna pubblicazione o installazione. Nuova idea rinviata anche nell'analisi.
