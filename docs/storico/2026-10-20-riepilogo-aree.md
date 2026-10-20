# Revisione del 20 ottobre · risultati e attività rimaste

Seconda ripresa iniziata alle **14:06:49 UTC**. Enrico ha esteso il lavoro a più aree e richiesto altri **40 minuti dalle 14:19:21 UTC**. Il lavoro continua fino alla chiusura temporale registrata in PROGRESS; la pausa fra sessioni non conta. Ramo locale codex/salvataggi-coordinati-2026-10-18, codice **7011ac0**, nessun push, merge o deploy di questa sessione.

## Gli otto punti, oggi

| Area | Lavoro svolto | Cosa resta |
|---|---|---|
| **1 · Istruzioni e consumo Claude** | **Esclusa del tutto**, su richiesta di Enrico. Nessuna modifica o prova. | Riprendere solo su una futura richiesta esplicita. |
| **2 · Dati, fonti, aperture** | Quattro fatti storici verificati sulle pubblicazioni originali, testi riletti e firme aggiornate. Registro pubblico a 196 documenti. Riconteggio effettivo: avvisi **19 → 15**; il vecchio piano riportava 20. | Quindici affermazioni editoriali, aperture future e dati bus oltre il feed registrato. Nessun GTFS o dato cartografico rigenerato. [Prove e fonti](2026-10-20-revisione-38.md). |
| **3 · Codice e casi limite** | Ciclo dei fogli, calendario/ore, caricamenti e azioni delle schede, animazioni e gesti annullati. **551 test riusciti**, 51 aggiunte rispetto ai 500 iniziali. | Altri comandi asincroni e timer di fogli/selettori, revisione residua dei moduli e prove native; nessuna dichiarazione di copertura completa. |
| **4 · Google e traffico** | Sitemap senza data di build inventata. Nove URL pubbliche 200 con canonical coerenti; verifica Google presente, indirizzo inesistente 404/noindex. | Search Console da esportazioni scelte da Enrico: query, pagine, indicizzazione e sitemap. Nessun nuovo dato di traffico acquisito; nessun posizionamento dedotto dall’HTTP. [Prove](2026-10-20-revisione-37.md). |
| **5 · Interfaccia** | Correzioni logiche a chiusure, fuoco/annunci tardivi e cancellazione dei gesti. Header HTTP del compositore consente geolocation=(self), ricontrollato il 20/10. | Browser escluso: resa chiaro/scuro, tastiera/fuoco nativi, tocchi su telefono, GPS, axe e Lighthouse restano da verificare. Nessun CSS cambiato. |
| **6 · Manutenzione** | Audit del lockfile: zero segnalazioni note, senza installazioni. CI main riuscita sul commit remoto b6d2a36; documenti aggiornati. | Nuovo ramo ancora da integrare e verificare su Linux; controllo completo dei tipi assente. Main non protetto e ruleset vuoti; nessuna attivazione. [Stato remoto](2026-10-20-manutenzione-remota.json), [audit](2026-10-20-audit-dipendenze.json). |
| **7 · Cartelle e materiali** | Indice unico delle prove, inventario dei file tracciati e 32 risultati grezzi improntati; guida di manutenzione e indice aggiornati. Nessuna cancellazione o rinomina. | Scelte di archiviazione durevole e separazioni ulteriori dei moduli solo quando risolvono un problema concreto. I nuovi materiali remoti restano da integrare. [Inventario](2026-10-20-inventario.json), [impronte](2026-10-20-prove-manifest.json). |
| **8 · Valore rispetto all’IA** | Sette casi del motore e dei dati pubblici eseguiti, riportati sotto. | Facilità d’uso e vantaggio rispetto a un assistente esterno non misurati. Nessun altro modello, quota Claude, partecipante o contatto coinvolto. |

## Sette casi del prodotto

Eseguiti senza rete su **Due giorni a Napoli**, con pacco pubblico di 92 luoghi e dati già costruiti. [Risultati completi](2026-10-20-casi-prodotto.json), [script riproducibile](../../ricerca/2026-10-20-casi-prodotto.mjs). Richiede una build esistente e Node compatibile; comando dalla radice: node --experimental-strip-types ricerca/2026-10-20-casi-prodotto.mjs.

| Caso | Risultato osservato e significato |
|---|---|
| Pause e margini, solo a piedi | Fine **18:07 → 19:37** aggiungendo sei margini da 15 minuti; i minuti di strada restano identici. Utile per mostrare che una giornata apparentemente comoda può sforare. |
| Martedì del primo giorno | Il motore segnala MANN e Sansevero chiusi secondo i dati correnti. Non ha verificato eccezioni o disponibilità del giorno sul posto. |
| Ripartenza alle 15 | La tappa segnata resta fatta e le successive ripartono dall’ora di prova. Il caso usa progressi fittizi, non visite reali. |
| Data fuori dal feed bus | Nel 2026 il motore riconosce il feed; il 22 maggio 2027 non dichiara partenze programmate verificate. Restano stime e limiti dei dati. |
| Condivisione | Due giorni e tappe conservati; timbri e visite personali non trasferiti nel link. |
| ID sconosciuto | Segnalato e scartato solo l’ID fittizio, conservando le altre tappe. |
| Risorse offline | Tutte le **82 risorse** del precache esistono nella build. Non è una prova di installazione/uso offline nel browser. |

Questi casi sostengono il valore del calcolo delle conseguenze e della conservazione del piano. Il pronto scelto, il martedì, contiene anche luoghi chiusi: l’avviso funziona ma non rende da solo il percorso utilizzabile. Priorità pratica: informazioni attendibili e conseguenze comprensibili, poi prove dell’esperienza nativa. Nessun confronto esterno eseguito e nessuna superiorità dichiarata.

## Indice dei sette gruppi

- [34 · ciclo del foglio](2026-10-20-revisione-codice-34.md), 0078be3, 506 test.
- [35 · calendario e ore](2026-10-20-revisione-codice-35.md), 47b016e, 516 test.
- [36 · caricamento e azioni delle schede](2026-10-20-revisione-codice-36.md), 6095421, 529 test.
- [37 · sitemap e HTTP pubblico](2026-10-20-revisione-37.md), b6b08b2, 531 test.
- [38 · fonti originali](2026-10-20-revisione-38.md), 7354467; conteggio rettificato in 7b2f2d0, 531 test.
- [39 · animazioni](2026-10-20-revisione-39.md), 6b350c2, 539 test.
- [40 · gesti annullati](2026-10-20-revisione-40.md), 7011ac0, 551 test.

Controlli finali: **551/551**, zero fallimenti/salti/cancellazioni; build **12 pagine**, **13 documenti / 811 link validi**, worker **bd6edd46e12e**, **82 risorse offline** presenti. L’audit del lockfile è distinto dalle prove funzionali. Il confronto remoto restituisce 300 file e va trattato come parziale; non certifica l’integrazione con gli 11 commit nuovi di main.

Conservati ID, URL, licenze, materiali privati e dati generati; cambiate soltanto quattro schede storiche e relative fonti/metadati/firme. Nessuna dipendenza installata, protezione attivata, automazione, delega o pubblicazione. La nuova idea su più città e sul registro degli aggiornamenti resta rinviata anche nell’analisi e nella stesura in questa chat.
