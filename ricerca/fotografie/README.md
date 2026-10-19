# Fotografie · ricerca per le schede

**19/10/2026 · ricerca, senza inserimento nel sito.** Perimetro: le 60 tappe/gite e i 32 locali presenti nei dati. Le valutazioni tramite API restano rinviate.

Risultato: **154 nuovi file candidati con licenza fotografica libera**, per 58 tappe e 5 locali. Altre **49 risorse visive dei gestori**, per 28 locali, richiedono autorizzazione e non sono conteggiate come foto libere. Le 54 foto già nel sito restano distinte e non sono state ricertificate da questo lavoro.

## Come trovare ciò che serve

1. Per Enrico: [rapporto](RAPPORTO.md), poi [indice delle 92 schede](indice.md).
2. Per Codex/Claude: cerca nell’indice l’ID o il nome e leggi **solo** `schede/tappa-ID.json` oppure `schede/locale-ID.json`. Non caricare tutte le schede.
3. Per interpretare una segnalazione: [condizioni di riuso](LICENZE.md), oppure il solo codice in [legenda.json](legenda.json). Le fonti comuni sono in [fonti-diritti.json](fonti-diritti.json).
4. Per chiedere ciò che manca: [coda e modello di richiesta](DA-CHIEDERE.md). Nessun messaggio è stato inviato.

[Esiti e conteggi](esiti.json) contiene solo l’indice per macchina, non un secondo catalogo completo. Le immagini binarie, le risposte grezze delle ricerche e i provini di analisi non sono nel repository: ogni scheda conserva collegamenti diretti, autore, licenza, dimensioni, soggetto e chiarimenti. Il catalogo visivo consegnato separatamente è una copia di consultazione; la fonte di lavoro resta questa cartella.

## Leggere una scheda

- `fotoEsistente`: riferimento al registro attuale, non una nuova candidata.
- `fotoCandidate`: file Commons selezionati; `pagina` documenta fonte e licenza, `originale` serve per un successivo download. Le anteprime sono state osservate; gli originali non sono stati tutti esaminati a piena risoluzione.
- `segnalazioni`: aspetti ancora da risolvere, anche qualità, contesto e condizioni del bene. Non cambiano la licenza dichiarata del fotografo.
- `fonteGestore.risorseDaAutorizzare`: immagini osservate sul sito del locale, **senza licenza libera accertata**. Non copiarle negli asset.
- `ricerche`: interrogazioni e numero di risultati esaminati; zero candidate non significa assenza assoluta di foto su Internet.
- `richiesta` e `azioneSuccessiva`: ciò che serve per completare una galleria, senza dichiararla già completa.

Prima dell’inserimento: risolvere i chiarimenti pertinenti, verificare l’originale e la sede, scegliere foto diverse fra loro, preparare testo alternativo e crediti e aggiornare [foto.yaml](../../src/data/foto.yaml). La regola comune ammette foto con licenza libera; un permesso limitato a un solo sito va conservato, ma richiede una decisione prima di diventare un’eccezione. La galleria scorrevole richiede un successivo lavoro sul prodotto.
