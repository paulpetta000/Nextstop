# Verifiche · ampliamento fotografie del 20/10/2026

Solo ricerca e documenti: nessun input applicativo modificato, nessuna dipendenza installata. Build e suite del sito non ripetute. Le [verifiche precedenti](VERIFICHE-2026-10-19.md) restano conservate come storico.

## Conservazione, originali e conteggi

- 92 schede e ID invariati: 60 tappe/gite, 32 locali.
- Tutte le 171 candidate e le 54 foto esistenti della revisione precedente conservate; confrontati 3.386 campi fotografici, ammettendo soltanto le tre decisioni editoriali sostituite e conservate esplicitamente come precedenti.
- 52 nuove fotografie di scheda: 48 proposte, quattro scarti dopo l’esame dell’originale. Tre proposte precedenti sostituite; totale 76 proposte e 201 escluse fra le 277 fotografie in scheda.
- Tutte le 76 proposte hanno originale scaricato, dimensioni native con orientamento EXIF corretto e SHA-256 ricontrollato; nessuna sotto 2.000 px sul lato lungo, senza duplicati della fonte nella selezione e senza diritti ulteriori aperti registrati.
- 73 attribuzioni dovute, tre immagini senza credito visibile obbligatorio per CC0/pubblico dominio. Due foto Flickr selezionate.
- Copertura e mancanti ricalcolati per ogni scheda: 19 con almeno tre foto, sette con quattro, 73 sotto tre. Mancano 207 immagini per portare ognuna a tre, 292 per quattro.
- 230 ricerche registrate su tutte le 92 entità; 658 provini osservati, compresi scarti, omonimi e ripetizioni. 88 nuove pagine individuali Flickr verificate, cento con il giro precedente. Le ricerche non provano l’inesistenza di alternative.
- 49 risorse dei gestori fuori proposta conservate integralmente; rapporto iniziale, precedente revisione, verifiche e legenda storiche conservati. Nessun contatto, permesso richiesto, acquisto o account attivato.
- 149 riferimenti locali Markdown verificati, oltre ai percorsi dei nuovi registri nelle 92 schede. `git diff --check` pulito; codice, dati, foto e dipendenze del sito invariati.

Il controllo dei provini e delle impronte non certifica perfezione, professione dell’autore o ogni diritto di terzi. L’esame completo al 100% rimane da concludere prima dell’inserimento.

## Catalogo separato dal sito

Verificato ora in Chromium e Playwright attraverso un server locale temporaneo; il catalogo è un singolo HTML con immagini incorporate, senza servizi esterni automatici.

- 92 schede presenti, filtro iniziale sulle 26 con proposte; ricerca e categorie funzionanti.
- Filtri almeno tre (19 schede), quattro (7), sotto minimo (73), senza proposte (66) e senza credito obbligatorio (3 schede) riscontrati.
- 76 immagini incorporate decodificate; 73 fasce di attribuzione, tre immagini senza fascia obbligatoria.
- Scorrimento avanti/indietro verificato con movimento ridotto; nessuno scorrimento orizzontale della pagina a 320, 390 e 1.280 px.
- Nessun errore JavaScript e nessuna richiesta esterna automatica osservati. I link alla fonte e all’originale richiedono rete solo quando aperti.

Il file HTML è un catalogo di ricerca: non è la galleria del sito e non approva la pubblicazione delle proposte. Il pacchetto separato conserva anche dati estesi compressi, ricevute dei controlli e documenti di fonte; questi file non vengono caricati dagli input della build o dalla lettura breve dell’IA.

## Salvataggio portabile richiesto nello stesso giorno

Archiviati nel repository 76 originali integri (436.348.255 byte) e 76 anteprime, con indice delle licenze, crediti, percorsi nelle schede e catalogo HTML a percorsi relativi. Verificati SHA-256 e decodifica di ciascun originale, collegamenti locali, corrispondenza con la sequenza proposta, assenza di immagini escluse nell’archivio e documento del Castello Aragonese identico alla fonte scaricata. Nessun file sopra 100 MiB. Le prove estese e le ricevute precedenti sono conservate in `ricerche/`; le verifiche di conservazione del giro precedente restano riferite al loro commit. [Ricevuta dell’archivio](ricerche/verifica-archivio-2026-10-20.json). Gli input del sito rimangono invariati; l’integrazione su main è stata richiesta espressamente da Enrico.

Il catalogo archiviato con immagini relative è stato ricontrollato in Chromium: 76 anteprime caricate, 73 crediti visibili, filtri e scorrimento funzionanti a 320/390/1.280 px, nessun errore JavaScript o richiesta esterna automatica. [Ricevuta del catalogo archiviato](ricerche/verifica-catalogo-archiviato-2026-10-20.json).
