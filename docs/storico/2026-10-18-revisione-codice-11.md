# Revisione codice 11 · selezione e decoder della mappa

18 ottobre 2026, base 1eab065. Quinto checkpoint nella stessa sessione continuativa.

## Risultato

- pezziDi poteva bloccarsi con lato zero oppure scandire un numero enorme di celle per viste molto grandi. I casi sono stati riprodotti in processi separati con timeout. Ora rifiuta dimensioni non valide e limita il lavoro ai pezzi esistenti; per viste piccole conserva il ciclo corto solo quando gli indici sono interi sicuri e il numero di celle non supera quello dei pezzi esistenti. Ordinamento e chiavi canoniche conservati.
- Il decoder delle linee rifiuta caratteri sconosciuti, separatore mancante, numeri troncati, coppie incomplete e accumuli oltre gli interi sicuri. Un tratto codificato danneggiato viene scartato integralmente, senza disegnarne soltanto una parte. Formato, modalità e coordinate dei percorsi validi conservati.

## Prove

- Quattro prove fallite prima e riuscite dopo; cinque nuove prove totali. **10/10** nel gruppo strade/decoder, **322/322** nella suite, nessun salto o cancellazione.
- Confronto completo dei file pubblici già prodotti: **21.180 percorsi distinti, 1.332.817 punti**, risultato identico al decoder precedente.
- **2.000 viste deterministiche**: stessi pezzi e stesso ordine. 59 pezzi esistenti nella mappa attuale.
- Profilo Node, 10.000 chiamate: prima 14,3 ms, dopo 22 ms, circa 0,0022 ms per chiamata nuova. La prima versione che scorreva sempre i pezzi aveva impiegato 167,1 ms contro 12,9 ms: aggiunto il ciclo breve limitato prima della verifica finale. Non è una misura delle prestazioni nel browser.
- Build ordinaria: **12 pagine**; **13 documenti, 811 link validi**; worker con **82 risorse**. Telemetria disabilitata.
- git diff --check e riferimenti/NUL documentali verificati. Nessun CSS, ID, URL, formato degli itinerari o dipendenza cambiato.

Nessuna prova visiva, di gesto/fuoco o di prestazioni sul telefono; nessun nuovo axe/Lighthouse. Le prove non certificano ogni tipo di geometria arbitraria o la correttezza cartografica. Dati generati e percorsi esistenti non riscritti. Nessun browser, installazione, delega, sessione Google, modifica delle protezioni o pubblicazione.

## Seguito

Controllare che i dati differiti corrispondano alla città già aperta quando cambia una pubblicazione o la cache: le differenze numeriche possono essere formalmente valide ma provenire da un'altra base. Nuova idea multi-città/registro sempre rinviata, inclusa l'analisi.
