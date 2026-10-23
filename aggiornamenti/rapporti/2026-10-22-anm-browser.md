# ANM · lettura nativa del 22 ottobre 2026

Riscontro parziale dei casi V04, V15 e V16, nel browser con JavaScript. Solo rapporto: nessun dato applicativo o calcolo aggiornato. Le pagine non mostrano tutte una data di revisione; la data qui indica la lettura. Non equivale a controllo completo dei 106 gruppi o a garanzia del servizio futuro.

## Ascensori · V04

La [pagina ANM attuale](https://www.anm.it/s/ascensori?language=it) è leggibile nel browser. Il lettore web restituisce invece un errore CSS; il risultato indicizzato riporta Sanità in manutenzione. **Nel documento nativo letto due volte Sanità risulta «Servizio Regolare»**, come Ventaglieri e Monte Echia; Acton e Chiaia risultano in manutenzione. È una differenza fra indicizzazione e documento consultato, senza data certa del cambio.

Per Sanità e Ventaglieri la pagina presenta 7–22 dal lunedì al sabato, 7–14:15 domenica/festivi e orario festivo il 24/31 dicembre. Per Monte Echia presenta 7–22 tutti i giorni e titolo digitale dedicato da €1,50 per una singola salita o discesa. Questa lettura non copre le singole scale mobili, tutti gli avvisi o le durate usate nelle stime. V04 rimane aperto su tali aspetti; il PDF 2024 resta storico.

## Linea 6 · V15

Dal menu ANM Metro e Funicolari → Linea 6 si raggiunge la [scheda L6 attuale](https://www.anm.it/s/linea-anm/a0YR200000FxeqbMAB/l6?language=it). Attendere il caricamento: inizialmente compaiono etichette vuote.

La scheda indica servizio attivo, entrambe le direzioni Municipio–Mostra, prime partenze 7:10, ultime 21:10 lunedì–venerdì e 14:50 sabato/domenica; partenze ai minuti 10/30/50, frequenza 20 minuti. Le ore di chiusura corrispondono a quelle già descritte dal compositore. Non è stato certificato come trattare tutti i festivi infrasettimanali.

**Confronto da risolvere prima di aggiornare le stime:** `scripts/itinerari/costruisci.mjs`, tabella LINEE, usa per L6 un'attesa media di 7 minuti. La frequenza ufficiale appena letta di 20 minuti implica invece 10 minuti secondo la regola dichiarata dal modello (metà frequenza). Non basta modificare i JSON generati a mano: occorre verificare l'efficacia del quadro, aggiornare il parametro e rigenerare/coordinare i pacchi dei percorsi con gli ingressi originali, misurando i cambi di itinerario. Nessuna modifica ai dati in questo rapporto. Anche la durata totale di corsa da 15 minuti rimane da confrontare.

La [notizia ANM del 14 ottobre](https://www.anm.it/s/notizia-home/a0gR200000ShgzzIAB/variazione-al-servizio-metro-l6?language=it), recuperata nella ricerca indicizzata, riguarda solo il 16–17 ottobre 2026 e la limitazione Augusto–Municipio. Non estenderla al 22 ottobre; lettura integrale nativa e confronto completo degli altri avvisi ancora da terminare. Il vecchio collegamento del Comune continua a restituire 403 nel lettore web. V15 resta aperto, con fonte ordinaria recuperata.

## Montesanto · V16

Nella [home ANM](https://www.anm.it/s/?language=it), Stato servizi → Funicolari → Funicolare Montesanto, il pannello attuale riporta chiusura dal 15 maggio 2026 per revisione ventennale e rinvia alla navetta Vanvitelli–Corso Vittorio Emanuele–Dante–Matteotti. Gli orari ordinari della funicolare restano mostrati sotto l'avviso: **non dimostrano una riapertura**.

La [scheda della navetta](https://www.anm.it/s/linea-anm/a0YR200000mViL6MAK/navetta-montesanto?language=it) indica servizio attivo e quadro dal 21 settembre 2026: prime/ultime partenze da Vanvitelli 6:30/21:40. Il pannello della funicolare indica invece 6:30/21:32. La scheda non esplicita nel quadro letto i diversi calendari né tutti gli orari del ritorno. Conservare la discordanza: niente ricostruzione di orari o inserimento nei calcoli. Chiusura recuperata da fonte attuale; V16 resta aperto sull'orario completo della navetta e sulle eventuali novità.

## Copertura e conservazione

Ricerche eseguite senza anno e con 2026: ascensori Sanità/Monte Echia, Linea 6/orari/ottobre, Montesanto/manutenzione/riapertura. Consultati home e menu ANM; ricerca limitata, non esaurita la paginazione dell'archivio avvisi. Nessuna data `ultimo_controllo_completo` rinnovata. Ritentare i punti parziali entro il 25 ottobre 2026; lo stato operativo va ricontrollato prima del viaggio.

Prove grezze nella cartella superiore del checkout: `nextstop-fonti69-ascensori-2026-10-22.json`, `nextstop-fonti69-linea6-2026-10-22.json`, `nextstop-fonti69-navetta-2026-10-22.json`, `nextstop-fonti69-montesanto-2026-10-22.json`. Nessun contatto, account o acquisto effettuato; cookie facoltativi rifiutati.
