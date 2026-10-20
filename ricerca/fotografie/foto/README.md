# Foto archiviate · 20/10/2026

Questa cartella conserva **76 originali HD e 76 anteprime** delle proposte attuali, ordinati nelle schede di ricerca. Non include le immagini scartate o quelle dei siti dei gestori senza concessione verificata. Le gallerie restano incomplete: 19 schede hanno almeno tre foto, sette di queste quattro; tutti i 32 locali sono ancora sotto minimo.

- `originali/tappa-ID/`: file originali integri, senza ricompressione, ritaglio o scritte aggiunte. Circa 416 MiB complessivi.
- `anteprime/tappa-ID/`: JPEG più piccoli, gli stessi provini già osservati nel catalogo. Non scambiarli per gli originali HD.
- [indice.json](indice.json): percorsi, ordine, autore, licenza, fonte, dimensioni e SHA-256 per ciascun file.
- [CREDITI.md](CREDITI.md): attribuzioni fotografiche e condizioni per singolo file.
- [Catalogo locale](../catalogo.html): aprire dopo aver scaricato/clonato il repository, mantenendo questa struttura di cartelle.

## Ripresa con Claude Code o Codex

1. Aggiornare il checkout del repository dal ramo pubblicato, conservando prima il proprio lavoro locale. Non eseguire reset o sovrascrivere modifiche non salvate.
2. Partire dal [README della ricerca](../README.md), poi cercare il luogo nell’[indice](../indice.md) e aprire una sola scheda.
3. `galleriaProposta` indica le foto da considerare; `archivioLocale.originale` e `anteprima` sono percorsi relativi al file della scheda. Per dimensioni e riuso usare i metadati della fotografia, senza caricare tutte le immagini nella conversazione.
4. Conservare crediti e licenze e leggere `daCompletare`; i casi con diritti ulteriori aperti restano esclusi. Nessun acquisto, account o contatto autorizzato.

L’archivio è fuori da `src` e `public`: le foto non vengono aggiunte alle pagine del sito da questo salvataggio. L’inserimento nelle schede del sito è un lavoro distinto. Le immagini aumentano il download del repository, ma non richiedono di leggere tutto l’archivio nell’IA: bastano indice e singola scheda.
