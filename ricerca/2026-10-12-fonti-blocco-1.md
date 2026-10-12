# Fonti · Blocco 1: risultati e decisioni

_12/10/2026. Solo specifica e inventario autorizzati da Enrico. Ramo `codex/fonti-specifica`, da `main` al commit `3a68b40ea014e3a5423e6a28350b3db619696e0d`._

## Risultato

Preparata la [specifica](../specifiche/fonti-e-controlli.md), ancora da approvare. [Inventario leggibile](2026-10-12-fonti-inventario.md) di tutte le fonti e schede; [JSON documentale](2026-10-12-fonti-inventario.json) con consumatori, composizione degli elenchi e hash degli input. Nessun file del sito modificato; nessuna nuova verifica esterna di orari, prezzi o documenti, e nessuna data aggiornata nei registri.

## Inventario verificato sul repository

| Voce | Risultato | Interpretazione |
|---|---:|---|
| Fonti | 204 | Tutte hanno almeno un riferimento dichiarato nei dati, nei testi o nel calendario |
| Schede | 212 | Tutte hanno una radice individuata, incluse associazioni nominali del calendario |
| Tappe / locali | 60 / 32 | Catene di orari, prezzi, viaggi e motivi della scelta incluse |
| Fonti pertinenti ai dati/testi di viaggio | 195 | Proposta: mantenere e verificare i documenti; non certificazione dei fatti |
| Fonti da decidere al confine con l'evento | 9 | Nessuna è automaticamente da eliminare |
| Fonti senza riferimenti individuati | 0 | Non esiste una lista di cancellazioni sicure basata sugli usi attuali |
| Elenco in fondo agli itinerari | 185 | Include tutti i testi di tappe e locali, non soltanto il viaggio scelto |
| Elenco in fondo a Dove mangiare | 84 | Da rendere consultabile per locale/argomento |
| Fonti uniche nei due elenchi | 199 | Cinque presenti nel registro ma assenti dai due footer |
| Fonti con letta: false | 1 | tp-eav-l1-orario; conserva il limite finché non viene letta |
| Schede senza ricontrollare | 46 | Il testo attuale che dice «ogni scheda ha una data» non descrive tutti i dati |
| Schede comeFatto | 19 | Ricerca originale pendente, conservare la decisione editoriale e l'anno |
| Confermate con sole fonti deboli | 1 | tp-donnanna-orari; controllo prioritario, stato invariato |

Tipi: 171 ufficiali, 13 stampa, 14 enciclopedia, 3 dati, 2 blog, 1 altro. Nessun ID duplicato e nessun riferimento mancante nelle catene estratte. Nessun URL perfettamente identico tra le 204 fonti; non equivale a escludere duplicati editoriali.

## Cosa è cambiato rispetto alle ipotesi del piano

Le fonti del vecchio progetto non si possono separare con un filtro sui nomi. Il compositore continua a leggere EVENTI per date e titoli delle regate, mentre i testi citano orari, luogo e piano dei trasporti. Il calendario associa gli eventi a schede mediante `fatto`, ma `giorniRegate()` non risolve quelle schede e non aggiunge le fonti al pannello; salta la pausa. Questa associazione dichiarata non dimostra una verifica automatica del calendario.

La home O4 è già su main: legge direttamente la scheda di Sansevero e la prima fonte, con un esempio di metodo e link esterno. Il vecchio file `src/testi/home.yaml` non è caricato dalla home attuale. Non basare il lavoro futuro sui bozzetti o sull'uso precedente dei testi; il conteggio della home resta l'intera collezione delle fonti.

Gli asterischi generati dai testi sono elementi `sup`, non collegamenti. La specifica non promette un'apertura automatica già esistente. `#segno` è conservato come possibile destinazione pubblica e va verificato se si aggiungono nuovi richiami.

## Lacune da riprodurre prima delle correzioni

1. **Durata delle Catacombe:** `src/data/tappe.yaml` associa `catacombe.durataFonte` a `tp-catacombe-sangennaro`. Il campo non viene passato esplicitamente a FontiPagina e questo documento manca nell'elenco itinerari. Le altre sette fonti di durata compaiono tramite altre schede/testi; ciò non sostituisce la gestione del campo.
2. **Fonti del calendario fuori dai footer:** `ac-grazie-napoli`, `ac-youth-date`, `ac-protocollo`, `etnz-formato`. Restano nell'archivio generale; la copertura del calendario va decisa prima di implementare o eliminare.
3. **Conteggio «Schede» del registro:** considera solo le relazioni da `fatti.yaml`, non le fonti dirette dei testi, i dati o le durate. Una riga con «—» non dimostra che sia inutile. Proporre una dicitura utile al visitatore, distinguendo fonti uniche e usi.
4. **Date:** il pannello calcola una data aggregata attraverso `controlloMenoRecente(lista, altre)`. L'implementazione considera schede e fonti extra, non le `fontiRisolte` delle schede. Se queste hanno date più vecchie, la dichiarazione di controllo completo può essere impropria. Servono un caso riproduttivo e una scelta esplicita del significato della data; non aggiungere una data universale oggi.
5. **Metadati incompleti per il visitatore:** 19 locali hanno un link menu con data fuori dal registro delle fonti; 8 URL non coincidono con una voce registrata. Non implica assenza di fonte dei prezzi: verificare se siano link di consultazione, nuove fonti necessarie o URL equivalenti prima di aggiungere record.

Gli otto menu sono Brandi, Gobbetto, 50 Kalò, Pignatelli, Gorizia, Starita, Tufò e Fenestella. URL e date sono nel JSON. Nessun menu scaricato in questo blocco.

## Decisioni aperte, in ordine

| Priorità | Decisione | Proposta |
|---|---|---|
| Prima dell'implementazione | Fonti degli organizzatori dell'evento | Chiedere una scelta esplicita: eccezione per citazioni documentali o revisione del perimetro dell'evento. La regola «senza link alla Coppa» resta valida fino a nuova decisione. Non nascondere le fonti lasciando fatti non documentati. |
| Prima della bozza definitiva | Spiegazioni legate al 2027 | Distinguere metodo generale e casi dell'evento, evitando migrazione globale di anno/stato/firme. |
| Prima dei bozzetti | Elenchi molto lunghi | Raggruppare per luogo/locale, usare «Documenta» derivato dalla verifica, un solo pannello principale. Il primo rilascio riguarda tutte le risorse della pagina; filtro sul viaggio scelto fuori scope. |
| Durante la verifica dei documenti | Qualità e validità | EAV non letta, Palazzo Donn'Anna con fonte debole, fatti gastronomici da verificare sulle guide originali, periodi GTFS e menu. Date registrate conservate. |

## Riferimenti della pianificazione

I riferimenti sotto sono stati consultati nelle precedenti fasi di piano della chat, l'11–12/10/2026. Conservati qui come basi del metodo, non aggiunti al registro pubblico dei luoghi. Non ricontrollati sul web durante questo blocco.

- [Trust Project](https://thetrustproject.org/): rendere riconoscibili riferimenti, metodo e possibilità di segnalare errori; adattamento editoriale a una guida di viaggio, nessuna certificazione o affiliazione.
- [Creative Commons · attribuzione](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution): origine, autore, titolo quando disponibile, licenza e modifiche pertinenti; crediti attuali conservati.
- [OpenStreetMap Foundation · attribuzione](https://osmfoundation.org/wiki/Attribution_Guidelines): mantenere la citazione nel contesto della mappa, con approfondimento nel registro.
- [HTML · details](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element): apertura nativa di informazioni aggiuntive; proposta tecnica da verificare nell'implementazione.
- [OpenAI · scelta del modello](https://developers.openai.com/api/docs/guides/model-selection) e [effort](https://developers.openai.com/api/docs/guides/reasoning): raccomandazioni per lavoro circoscritto e complesso; nessuna previsione di consumo esatto o trasferimento dei prezzi API alle quote del client.

Skill pertinenti già lette nella pianificazione: design-sito, frontend-design, stile-testi, OpenAI Docs. Nessuna skill nuova installata; nessun agente delegato. Modern-web-guidance sarà valutata all'inizio dell'implementazione secondo le regole di revisione: questo blocco non contiene HTML/CSS o JavaScript del sito.

## Verifiche del blocco

Analisi statica con Node portatile e js-yaml già presenti, senza installazioni o richieste esterne. Confronto delle catene con il codice di tappe/locali/testi/eventi e i due consumatori di FontiPagina. Il JSON conserva hash SHA-256 di tutti i 26 input dell'inventario. Gli elenchi sono una proiezione del codice attuale: nessuna nuova build o navigazione eseguita.

Controlli finali riusciti: JSON integro, 204 fonti e 212 schede corrispondenti agli originali, 26 hash degli input invariati, 24 riferimenti locali validi nei documenti nuovi e nello stato, sintassi valida di 212 URL esterni (204 fonti e 8 riferimenti del resoconto, nessun controllo di raggiungibilità). `git diff --check` pulito; diff limitato ai documenti del blocco. Suite, build, axe e Lighthouse non eseguiti: nessun input del sito è stato modificato; gli esiti precedenti restano nello stato del progetto.

## Prossimo passo

Enrico legge la specifica, corregge o approva le regole e decide il confine dei link documentali dell'evento. Il prossimo blocco proposto è verifica prioritaria delle fonti e bozza del metodo, GPT-6.1-sol / Medium, in locale con web per i documenti originali. Nessun cambiamento a dati o interfaccia prima dell'autorizzazione pertinente.
