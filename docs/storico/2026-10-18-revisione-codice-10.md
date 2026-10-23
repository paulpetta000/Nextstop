# Revisione codice 10 · ingressi dei percorsi pedonali

18 ottobre 2026, base 9c79328. Quarto checkpoint della sessione continuativa richiesta da Enrico.

## Risultato

Il generatore ora controlla i dati OSM prima di costruire i nodi e i campioni delle quote prima del filtro. Un campione null non diventa più uno zero; dati non numerici, griglie incoerenti, passi nulli, origine fuori intervallo e parametri del filtro errati vengono rifiutati. Una via con un nodo mancante non viene più accorciata saltando quel nodo. Risposte OSM parziali, coordinate non valide, ID/tag malformati o nodi ripetuti con coordinate discordanti vengono diagnosticati prima del calcolo.

I nodi ripetuti coerenti con/senza tag rimangono ammessi, come previsto dal download esistente. Quote zero e negative, passi con segno, filtro con raggio zero e interpolazione bilineare restano compatibili. Formule, parametri predefiniti, pesi e ID non cambiano. Tre punti di inserimento nel generatore; validatori puri nel modulo ingressi.mjs, senza rete o scritture.

## Prove e limiti

- Sei prove di gruppo fallite prima dell'inserimento dei controlli, più una sul JSON nullo prima di spostare la validazione davanti all'accesso alla griglia. Tutte riuscite dopo.
- **9/9 prove mirate**, sul codice reale delle sezioni di caricamento/filtro, con file e ambiente fittizi. Nessun download o scrittura dei dati generati.
- **317/317 test**, senza fallimenti, salti o cancellazioni; build ordinaria di **12 pagine**, **13 documenti e 811 link validi**, worker con **82 risorse**. Telemetria disabilitata.
- git diff --check e riferimenti/NUL documentali verificati. Nessuna dipendenza nuova.

Questi controlli verificano struttura e valori usati dal modello: non certificano la percorribilità fisica, l'apertura di una strada o la correttezza topografica delle quote. Nessun nuovo trattamento dei valori NoData del modello di origine e nessun cambiamento alla gestione già presente dei ponti/gallerie o all'aggancio dei punti.

Riferimenti di formato: [OSM JSON](https://wiki.openstreetmap.org/wiki/OSM_JSON), [elementi OSM](https://wiki.openstreetmap.org/wiki/Elements). I controlli sono per la risposta completa out body usata dal download di questo progetto; non pretendono di accettare ogni possibile formato di esportazione OSM.

Le modifiche al generatore avranno effetto sulla prossima rigenerazione autorizzata: i dati del sito esistenti non sono cambiati. Nessun browser, installazione, delega, sessione Google, modifica alle protezioni, push, merge o deploy. Il seguito della stessa sessione riguarda decoder dei percorsi e selezione dei pezzi di mappa. La nuova idea rimane rinviata anche nell'analisi.
