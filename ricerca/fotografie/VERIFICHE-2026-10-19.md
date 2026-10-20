# Verifiche della revisione fotografica

Ricerca del 19/10/2026, verifiche concluse il 20/10/2026 UTC. Solo ricerca e documentazione: nessun input applicativo modificato, nessuna dipendenza installata. Build e suite del sito non ripetute.

## Dati e conservazione

- 92 schede, con gli stessi ID: 60 tappe/gite e 32 locali.
- Conservati tutti i campi delle 154 candidate precedenti e tutte le 49 risorse dei gestori; i vecchi stati sostituiti sono conservati esplicitamente come precedenti.
- 17 candidate aggiunte, 54 foto esistenti revisionate; riferimenti della sequenza risolti senza duplicati.
- 31 proposte con originale scaricato, decodifica riuscita, dimensioni conformi e impronta SHA-256 registrata; nessuna sotto 2.000 px sul lato lungo o con chiarimenti sui diritti aperti registrati.
- Credito fotografico richiesto per 28 proposte; non imposto per le altre 3. Nessuna foto Flickr o risorsa non autorizzata del gestore nella proposta.
- Rapporto iniziale conservato integralmente. Nuovi stati e criteri prevalgono sulla vecchia coda di richieste, sospesa esplicitamente.

L’osservazione dei provini non equivale a un’ispezione completa di ogni originale al 100%. Le verifiche automatiche non certificano bellezza, qualifica professionale dell’autore o assenza di qualsiasi diritto di terzi.

## Catalogo di consultazione

Verifica effettiva con Chromium e Playwright sul catalogo separato dal sito:

- 92 schede presenti; filtro iniziale sulle 24 con proposte. Ricerca, categorie, 68 schede senza proposte e filtro per foto senza credito obbligatorio verificati.
- 31 immagini incorporate decodificate senza errori; 28 fasce di credito e 3 immagini senza fascia obbligatoria.
- Scorrimento avanti/indietro verificato anche con movimento ridotto.
- Nessuno scorrimento orizzontale della pagina a 320, 390 e 1.280 px; lo scorrimento resta interno alla sequenza fotografica.
- Nessun errore JavaScript e nessuna richiesta esterna automatica. Gli originali e le fonti si aprono solo attraverso link scelti dall’utente.
- 140 riferimenti locali Markdown esistenti; `git diff --check` pulito. Codice e dati del sito invariati.

Questi controlli riguardano il catalogo di ricerca, non un nuovo componente della galleria nell’applicazione. L’ultimo riscontro FEC su San Lorenzo Maggiore ha ridotto le proposte da 32/25 schede a 31/24; documenti e catalogo sono stati riallineati e ricontrollati.
