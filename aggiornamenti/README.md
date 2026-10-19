# Aggiornamenti · ingresso per l’AI

Per orari/accessi partire dalla [procedura breve](PROCEDURA.md). Non leggere tutti i rimandi: cercare il soggetto, poi aprire una sola scheda e le sue fonti.

| Cerchi | Dove / comando |
|---|---|
| Un luogo, locale o trasporto | `node aggiornamenti/leggi.mjs cerca "nome"`, poi `voce <id>` |
| Voci in scadenza | `node aggiornamenti/leggi.mjs scadenze YYYY-MM-DD [categoria]` |
| Un canale / documento | `canale <id…>` / `pubblicazione <id…>` |
| Fonte o fatto del sito | `fonte <id…>` / `fatto <id…>` |
| Domande rimaste a Enrico | `aperte`, poi `caso V01`; [indice](../da-verificare/fonti-orari.md) |
| Regole dei casi particolari | `guida "4."` per trasporti; [guida conservata](riferimenti/procedura-completa.md) |
| Struttura e rapporto corrente | [manifesto](controlli-periodici.yaml), [metadati](metadati.json) |
| Evidenze di una ricerca precedente | [rapporti](rapporti/README.md), solo se necessari |
| Proposta per le recensioni | [piano](../specifiche/valutazioni-esterne.md), non ancora da implementare |

Ogni comando è preceduto da `node aggiornamenti/leggi.mjs`. `aiuto` elenca le opzioni. Lo strumento è locale, senza dipendenze, rete o scritture. I contenuti operativi sono in JSON per poterli selezionare senza caricare l’intero registro nel contesto dell’AI; i documenti applicativi originali restano YAML.

La versione 2 mantiene 106 schede, 137 canali, sei pubblicazioni e tutti i riscontri. Una pagina aperta, una fonte con orari ordinari e un controllo completo sono stati diversi. Il riesame ha 54 URL di partenza (13 originali leggibili, 31 con alternative anche parziali/storiche, 10 senza alternativa utile), più due locali senza fonte ufficiale verificabile. **Nessun orario applicativo aggiornato e nessun controllo completo concluso.**

## Cosa c'è qui
- `fonti-dati.yaml`: l'elenco dei **dati che arrivano da un file o da un servizio** (bus ANM, strade OpenStreetMap, quote del terreno, risultati). Per ognuno: da dove viene, che licenza ha, come si riscarica (il comando), quali file del sito cambiano, fino a quando vale, quando va ricontrollato.
- Le **pagine web** (orari e prezzi di musei, parchi, trasporti, notizie della Coppa) **non sono qui**: stanno già in `src/data/fonti.yaml` (indirizzo, data di controllo) e nelle schede di `src/data/fatti.yaml` (campo `ricontrollare`). La build avvisa da sola quando una scheda è scaduta. In fondo a `fonti-dati.yaml` c'è il riepilogo delle scadenze.

## Come si aggiorna un dato (in breve)
1. Apri `fonti-dati.yaml` e trova la riga del dato.
2. Esegui il comando di «aggiorna» (di solito: scarica, poi costruisci).
3. `npm run build` e `npm run check:links`. Se la build dice che un testo è da rileggere, rileggilo e firma con `npm run testi:firma`.
4. Cambia in `fonti-dati.yaml` le date `controllato` e `valido-fino`, e `PROGRESS.md` in poche righe.

## Regole
- **Ogni dato scaricato da un file o da un servizio ha una riga qui.** Se ne aggiungi uno nuovo (per esempio i ristoranti o le esperienze), aggiungi anche la sua riga.
- Si cita la fonte sul sito, con la licenza quando la licenza lo chiede.
- Gli orari programmati non sono tempi reali: lo dice il testo del sito.

## Controllo automatico (idea, non ancora fatta)
Un controllo settimanale che riscarica i file con indirizzo fisso (ANM, Overpass) e ci avvisa se sono cambiati. Da decidere con una specifica (vedi `PROGRESS.md`). L'aggiornamento resta a mano: prima si avvisa, poi si decide.

Il registro e la procedura aggiunti il 19/10 organizzano i controlli **su richiesta**: non attivano questa eventuale automazione e non considerano sufficiente verificare che il vecchio URL sia invariato.
