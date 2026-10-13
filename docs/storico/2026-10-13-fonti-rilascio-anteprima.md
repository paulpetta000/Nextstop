# Fonti · anteprima del rilascio, 13 ottobre 2026

Ripresa locale di `codex/fonti-specifica` esattamente da `4fb9bb9970e64b308061169d5ba78ee80e4e210f`, senza checkout di main. Enrico approva il Blocco 6 e autorizza push, PR e anteprima; merge e produzione restano esclusi. Nessuna installazione, delega o prova con lettori esterni.

## PR, build e commit

- [PR #3 in bozza](https://github.com/paulpetta000/Nextstop/pull/3), base `main`, ramo `codex/fonti-specifica`.
- Primo push approvato `4fb9bb9`: [CI riuscita](https://github.com/paulpetta000/Nextstop/actions/runs/38386043527), 70 test e 880 link. Commit di prova GitHub `04c92276b9f883e3d1439c1f3cb94b6b2b991b7f`, con testa `4fb9bb9` e base `3a68b40`; il commit di prova non è un merge pubblicato su main.
- Correzione del manifest in `b8e5e6f3d2be0c8897ecf3f9e9f57219caaad008`, identità Codex. [CI riuscita](https://github.com/paulpetta000/Nextstop/actions/runs/38387286878): Ubuntu 24.04, Node 22.23.3, **71/71 test**, build e **880 link validi**. In locale stessi esiti, senza installazioni.
- [Anteprima esaminata](https://nextstop-h4mcntu0b-enrico-2d20.vercel.app), deployment `dpl_4KeAM1YvgyQ6NHqWrDdAVD8X9iJT`, progetto `nextstop`, team `team_wknwOG10hRmTe0VLFJ5f9NOk`, Node 24. Metadati Git Vercel: ramo autorizzato, SHA completo `b8e5e6f3d2be0c8897ecf3f9e9f57219caaad008`, stato READY, ambiente preview. Link protetto da autenticazione Vercel: accesso temporaneo mostrato nella chat, senza salvare cookie o chiavi nel repository.
- Il commit successivo del resoconto modifica solo documenti e prove. La verifica della sua CI, del deployment e dell’identità degli input con `b8e5e6f` viene riportata nella descrizione della PR e nel resoconto consegnato in chat, senza attribuire al commit documentale nuove 18 misure.

## Difetto riprodotto e correzione minima

Nella prima anteprima il browser richiedeva `manifest.webmanifest` senza il cookie di accesso, con redirect a SSO e due errori di risorsa. [Prima matrice completa](fonti-rilascio-verifiche/ui-primo.json); il secondo tentativo di accesso tecnico non chiudeva il problema e resta conservato. Nessun errore `reading id` nel compositore.

Prima della correzione, il nuovo test `manifest-preview.test.mjs` fallisce: manca il contratto `crossorigin="use-credentials"` del manifest sullo stesso dominio. Aggiunto soltanto questo attributo in `src/layouts/Base.astro`. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/crossorigin) richiede le credenziali anche per un manifest sullo stesso dominio quando è protetto. Nessuna modifica alle protezioni Vercel, cookie del sito, tracking, dati o service worker. La verifica successiva usa il normale link temporaneo, senza aggiungere header alle richieste della matrice UI.

## UI, compositore e offline effettivi

- [80 combinazioni](fonti-rilascio-verifiche/ui.json), 320/375/390/768/1280 px, due temi, pannelli aperti/chiusi: nessun overflow o ID duplicato. **Otto scansioni axe pulite** su Fonti, itinerari, Dove mangiare e crediti. Console e richieste esterne vuote nella matrice finale.
- Ricerca e ritorno dai documenti sostituiti da una pagina fittizia; **51 itinerari fittizi**, `fittizio50` attivo, conservati integralmente. Titoli completi, Tab, movimento normale/ridotto e reset approvati provati. **195/181/84** fonti consultabili senza JavaScript; **54** crediti fotografici. Nessuna lettura di dati personali o dei siti degli editori.
- [Compositore](fonti-rilascio-verifiche/bug.json): dodici casi vuoto/tutto fatto/da fare, alle 10 e alle 20, a 390/1280 px, sei passaggi d’ora: nessun errore; avviso solo con visite ancora da fare. Prova sul primo deployment; codice del calcolo e compositore identico nel commit del manifest. Nella nuova anteprima confermati rendering, ritorno e dati fittizi con la matrice completa.
- [Offline HTTPS](fonti-rilascio-verifiche/offline.json): registrazione **automatica** del service worker dell’anteprima, senza registrazione forzata dal test. Dopo il caricamento online, rete disattivata: itinerario fittizio riaperto, pannello D e ricerca Catacombe funzionanti nei due temi, storage invariato. Nessuna promessa per documenti esterni o prima visita senza rete.
- Immagini dell’anteprima: [telefono chiaro](fonti-rilascio-verifiche/fonti-apertura-390-light.png), [telefono scuro](fonti-rilascio-verifiche/fonti-375-dark.png), [pannello scuro](fonti-rilascio-verifiche/napoli-itinerari-375-dark.png), [desktop chiaro](fonti-rilascio-verifiche/napoli-dove-mangiare-1280-light.png), [desktop scuro](fonti-rilascio-verifiche/fonti-1280-dark.png). Revisione visiva di A e D secondo le scelte già approvate, senza redesign.

## Lighthouse cloud: riserva aperta

[Serie completa](fonti-rilascio-verifiche/lighthouse.json), 18 misure sequenziali, tre per pagina e tema. Chrome 155, emulazione mobile Lighthouse (CPU ×4 e rete simulata). Ogni misura ha un profilo nuovo: acquisito soltanto il cookie temporaneo su `robots.txt`, svuotata la cache HTTP, nessuna pagina o font precaricati; `disableStorageReset` conserva l’autenticazione. Nessun invio di errori a Google. Rapporti completi e script della sessione conservati localmente; il riepilogo versionato contiene tutte le misure, metriche, ambiente e impostazioni.

| Pagina | Chiaro, tre prove | Scuro, tre prove |
|---|---|---|
| /napoli/itinerari/ | 85, 89, 90 | 72, 93, 69 |
| /fonti/ | 98, 98, 98 | 98, 98, 98 |
| /napoli/dove-mangiare/ | 93, 91, 97 | 85, 93, 92 |

**7/18 misure almeno 95.** Accessibilità e buone pratiche 100/100 in tutte. La soglia prestazionale del rilascio non è chiusa in anteprima: non si sostituiscono questi esiti con i 18/18 locali. Negli itinerari il blocco del thread varia da 78 a 1296 ms; layout stabile (CLS 0). Il browser temporaneo interrotto è stato controllato: nessun processo residuo delle prove precedenti individuato. Non attribuiamo l’intero rallentamento alla sola protezione Vercel o al pannello Fonti senza un confronto che lo dimostri. Presente una richiesta di feedback della piattaforma con risposta 204 nelle tracce cloud; non aggiunta dal sito.

## Conservazione e limiti

[154 file preesistenti identici](fonti-rilascio-verifiche/conservazione.json) rispetto alle impronte prese all’inizio di questa sessione; `design/compositore/` e `design/home-napoli/` conservati fuori dal commit. Fra `4fb9bb9` e il commit eseguibile successivo cambiano soltanto Base e il nuovo test. A, D, fonti, originali, ID/URL/date/cautele, crediti, contatto temporaneo, regate, dati degli itinerari, link condivisi, privacy e politica offline intatti. Grande inventario JSON non riletto.

Le prove locali del Blocco 6 sono state lette e riscontrate nei riepiloghi (70 test, 880 link, 80 combinazioni, otto axe e 18 Lighthouse almeno 95); mantengono condizioni, variabilità e limiti storici. Nessuna nuova lettura editoriale, nessuna data delle fonti aggiornata, nessun controllo su telefono fisico o con lettori esterni. I link interni validi non dimostrano il contenuto o la raggiungibilità odierna dei documenti esterni. Produzione non esaminata né pubblicata.

## Pausa al termine dell’anteprima

PR in bozza e anteprima disponibili; nessun merge o deploy di produzione. **Non raccomandato il rilascio finché la riserva Lighthouse cloud resta sotto 95.** Enrico valuta risultati e limiti prima dell’OK finale; un eventuale seguito resta locale, con gli strumenti esistenti e confronto controllato delle condizioni, senza nuove dipendenze, deleghe o rifiniture della ricerca.

## Autorizzazione successiva a main

Il 13/10/2026, dopo il resoconto e la comunicazione dei risultati sotto soglia, Enrico chiede esplicitamente di fare il commit e pubblicare su `main`. Richiede di procedere con l’integrazione della PR #3 e rimanda le riserve a una propria revisione con Claude. Questa decisione supera il precedente divieto di merge e consente la pubblicazione automatica dell’integrazione Git Vercel esistente. Nessuna delega a Claude eseguita da Codex.

La riserva Lighthouse cloud resta **7/18 misure almeno 95** nelle condizioni già documentate: l’autorizzazione non cambia i punteggi né equivale a una nuova verifica delle prestazioni. Il commit della decisione contiene solo documentazione; input applicativi invariati. Prima dell’integrazione verificare la CI della testa effettiva; usare il vincolo SHA nel merge. Stato dell’integrazione, commit su main e deployment nella [PR #3](https://github.com/paulpetta000/Nextstop/pull/3) e nel resoconto consegnato in chat.
