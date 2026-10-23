# Revisione codice 13 · download incompleti e cache

18 ottobre 2026, base 0bfc17b. Settimo checkpoint della sessione continuativa richiesta da Enrico.

## Risultato

- OSM veniva scritto sul disco prima di verificarne il JSON; una risposta parziale poteva essere conservata come cache e far saltare i download successivi. Ora parsing e validazione avvengono prima della scelta della risposta e della scrittura. Risposte malformate/parziali fanno provare il server successivo, riusando numero di tentativi e pause già previsti. I dati vengono analizzati una sola volta.
- La data OSM veniva cercata solo nei primi 2.000 caratteri del testo: una diversa disposizione dei campi poteva eludere il controllo dei dati vecchi. Ora si legge il campo del JSON già analizzato e si rifiuta una data dichiarata ma illeggibile. Conservata la regola già esistente dei 14 giorni e dell'ultimo tentativo con avviso.
- Una risposta bus più corta di quattro byte ora dà un errore GTFS chiaro, senza lettura oltre il buffer né scrittura. Il controllo completo dello ZIP resta nel lettore del generatore.

Le cache esistenti non sono sovrascritte o cancellate. Non è stata aggiunta una sostituzione atomica dei file: errori del disco o una rigenerazione interrotta richiedono ancora un controllo separato. Non introdotte nuove politiche di aggiornamento, nuovi download o nuovi automatismi.

## Prove

- Sei prove fallite prima delle rispettive correzioni e riuscite dopo; sette nuove prove totali.
- Rete, timer e filesystem fittizi: nessun server contattato, nessuna attesa reale e nessun dato scaricato. Provati mancata scrittura, cambio server, recupero con risposta valida, cache esistente e data oltre il prefisso di testo.
- **338/338 test**, senza fallimenti, salti o cancellazioni.
- Build ordinaria di **12 pagine**; **13 documenti e 811 link validi**; worker con **82 risorse**, versione 8f1b1aab606e. Telemetria disabilitata.
- Verifica finale rilevata una differenza spuria per ritorni a capo misti nel solo downloader: uniformato il file al testo Git e ripetuti test/build/link sul contenuto finale. git diff --check riuscito.
- Nessuna dipendenza, dato editoriale o JSON sorgente generato cambiato. Nessun browser, installazione, delega, sessione Google, modifica di protezioni, push, merge o deploy.

## Riepilogo della sessione

Sette gruppi, da 267 a **338 prove**: **71 aggiunte**. Rapporti [7](2026-10-18-revisione-codice-7.md), [8](2026-10-18-revisione-codice-8.md), [9](2026-10-18-revisione-codice-9.md), [10](2026-10-18-revisione-codice-10.md), [11](2026-10-18-revisione-codice-11.md), [12](2026-10-18-revisione-codice-12.md) e questo rapporto.

Coperti ingressi bus/privacy, ZIP/CSV, corse circolari/coerenza delle tabelle, quote/OSM, blocchi e decoder della mappa, compatibilità delle versioni e download incompleti. Le correzioni dei generatori avranno effetto alla prossima rigenerazione autorizzata; la nota di Condividi e le protezioni client restano locali fino a un eventuale rilascio. Vecchi client senza i nuovi controlli esclusi dalla garanzia.

La revisione completa del codice, area 3 del piano, resta aperta. Seguito: preparazione/scrittura coordinata dei file del generatore e controlli di coerenza sugli output, poi altre aree del piano originale. La nuova idea multi-città e registro aggiornamenti resta rinviata, inclusa analisi e stesura. Nessun cambio delle istruzioni di Claude o prova empirica sul suo consumo.
