# Ricerca delle fotografie · 19 ottobre 2026

Ricerca svolta sulle **92 schede presenti nel progetto**: 60 tappe/gite e 32 locali. L’obiettivo è preparare più fotografie per la futura scheda aperta, comprendendo interni, collezioni e piatti. Nessuna fotografia o galleria è stata aggiunta al sito.

## Risultato verificato

| Misura | Tappe/gite | Locali | Totale |
|---|---:|---:|---:|
| Schede ricercate | 60 | 32 | 92 |
| Schede con almeno una foto già nel sito | 54 | 0 | 54 |
| Schede con nuove candidate a licenza fotografica libera | 58 | 5 | 63 |
| Nuovi file fotografici candidati | 146 | 8 | **154** |
| Schede senza nuove candidate libere in questo giro | 2 | 27 | **29** |

Nei 154 file ci sono **55 interni, 6 immagini di collezioni, 3 piatti, 27 esterni, 23 panorami, 20 percorsi e 20 dettagli**. Sono file distinti per pagina Commons, esclusi quelli già registrati nel progetto; non rappresentano 154 luoghi né gallerie tutte complete. I chiarimenti possono riguardare più fotografie della stessa scheda.

Sui siti dei locali sono state selezionate separatamente **49 risorse visive per 28 locali**, osservate ma senza licenza libera accertata. Non si sommano alle 154 come foto utilizzabili. Per tutti e 32 i locali è conservata una fonte del gestore o un limite preciso della ricerca. Le immagini ufficiali non sono incorporate nel catalogo consegnato né copiate nel repository.

## Esempi utili

- **MANN:** atrio, scalone e cortile; **Capodimonte:** vetrine della Sala 14, salottino di porcellana e Salone delle Feste; **Floridiana:** sala del Museo Duca di Martina e oggetto della collezione. Licenze fotografiche documentate; uso del bene da chiarire per la pubblicazione prevista.
- **Sansevero:** ingresso e due interni, ma risoluzioni modeste e condizioni da chiarire con autore/museo.
- **San Carlo, sotterranei, chiese e chiostri:** candidate di ambienti diversi dalla sola facciata. Le foto non confermano che ogni spazio sia visitabile oggi.
- **Da Michele:** esterno e pizza con CC BY; **La Chitarra:** due piatti e sala con CC BY-SA. **Port’Alba, Brandi e Poppella:** solo materiale parziale rispettivamente su ingresso, targa ed esterno della Sanità.
- **Gli altri locali:** spesso sono presenti fotografie dei piatti sui siti del gestore, ma non una licenza libera per Nextstop. La coda contiene fonte e richiesta specifica.

## Come è stata condotta

Inventario ricavato da `src/data/tappe.yaml`, `locali.yaml` e `foto.yaml` della base main `24364b7`. Ricerche per tutte le 92 schede su Commons, con metadati della singola immagine; approfondimenti per categorie, nomi alternativi, gallerie e pagine esatte. Sono stati controllati i siti dei 32 locali e ulteriori pagine di gallerie/prodotti; ricerca Flickr mirata senza considerare il generico «Creative Commons» un’autorizzazione.

Le richieste Commons hanno incontrato limiti temporanei 429: sospensione e rallentamento, poi recupero delle risposte per tutte le 92 interrogazioni principali. Openverse ha risposto 403 ed è rimasto un canale non utilizzabile; non è la prova che manchino immagini. 50 Kalò è stato letto tramite ricerca web, con galleria di più città; la richiesta diretta era 403. MUDD è stato letto attraverso la ricerca web per i tetti; accesso diretto 403. Nessun aggiramento di autenticazioni o controlli TLS.

Osservate le anteprime delle **154 candidate libere** e delle risorse dei locali selezionate; non esaminati tutti gli originali a piena risoluzione. Autore, versione della licenza, credito aggiuntivo quando presente, dimensioni, data dichiarata, soggetto e segnalazioni sono conservati per file. Le 54 foto preesistenti sono un inventario, non una nuova certificazione delle licenze o dell’attualità.

## Scarti e limiti che contano

| Risultato trovato | Decisione |
|---|---|
| Gaiola in Piemonte, San Domenico di Taranto, Orto Botanico di Portici | Esclusi come luoghi diversi. |
| «View of Naples» scattate dal tetto di Santa Maria dei Vergini | Escluse dalla scheda dei tetti del Duomo. |
| `Negozio Poppella.jpg` | Sede Santa Brigida: esclusa dalla sede selezionata in Sanità. |
| Foto delle sedi Starita fuori Napoli, Concettina a Capri, Bellavia omonima | Escluse o tenute fuori dall’attribuzione alla sede scelta. |
| Fotogramma storico della Pizzeria Gorizia | Non adatto alla rappresentazione attuale; nessun affidamento alla semplice etichetta pubblico dominio. |
| Vecchi allestimenti di Città della Scienza, immagini storiche e aree giochi abbandonate dei Camaldoli | Non selezionati come rappresentazione corrente della visita. |
| Foto Hosteria Toledo di alloggi pubblicizzati nel sito | Escluse; recuperate invece foto della sala del ristorante. |
| Loghi, collage, immagini decorative e ritratti al posto di piatti/sale | Non usati come sostituti della fotografia richiesta; Brandi conserva una composizione solo fra le risorse da autorizzare, richiedendo l’originale. |
| Immagine Flickr pertinente di Pintauro | Tutti i diritti riservati; esclusa dalle foto libere. |

Restano **due tappe senza nuova selezione libera**, tetti del Duomo e Parco Mascagna, e **27 locali senza alcuna candidata libera selezionata**. Anche le altre gallerie possono richiedere soggetti mancanti, immagini migliori o chiarimenti. Non è una ricerca di ogni fotografia esistente in rete, né un’autorizzazione cumulativa alla pubblicazione.

## Diritti e seguito

Le [condizioni](LICENZE.md) distinguono licenza del fotografo, eventuali concessioni del bene culturale, opere contemporanee e qualità delle immagini. Nessun account, servizio a pagamento, contatto con terzi o spesa è stato attivato.

Per completare le gallerie usare la [coda delle richieste](DA-CHIEDERE.md), risolvere i chiarimenti e scegliere un insieme vario, preferendo gli originali. L’eventuale inserimento deve registrare crediti e testi alternativi in `src/data/foto.yaml`; dimensioni, formati e caricamento della galleria saranno parte del successivo lavoro sul sito. Non servono le API delle recensioni per questa ricerca.

## Verifiche del blocco

Copertura dei 92 ID, conteggi, unicità delle fonti, esclusione delle foto preesistenti, completezza di autore/licenza/dimensioni, corrispondenza delle annotazioni alle anteprime, riferimenti documentali e conservazione del codice applicativo: controlli eseguiti con esito riportato nello stato del progetto. Nessuna dipendenza installata. Sono cambiati solo documenti e dati di ricerca fuori dalla build: suite applicativa, build e controllo link del sito non ripetuti per questo blocco. Il catalogo visivo separato è verificato localmente per ricerca, filtri, crediti, rete e larghezze da telefono.

Ramo locale `codex/ricerca-fotografie`, separato dal pilota sospeso delle valutazioni. Nessun push, merge o deploy effettuato.
