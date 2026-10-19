# Controllare orari, nuove pubblicazioni e avvisi

Procedura condivisa da Codex e Claude Code, autorizzata da Enrico il 19/10/2026. Il registro riguarda soltanto luoghi, locali e servizi già scelti per Nextstop. Si esegue su richiesta; non è un processo automatico.

## Come chiedere il controllo

- «Controlla le fonti in scadenza e fammi un rapporto»: lettura delle fonti e rapporto, senza modificare i dati del sito.
- «Controlla tutte le fonti dei trasporti»: seleziona i 14 gruppi, comprese le 13 linee bus ANM elencate nel registro.
- «Controlla gli orari di [luogo/locale/servizio]»: seleziona quella voce, le parti che la compongono e i servizi collegati.
- «Controlla le fonti in scadenza e aggiorna il progetto»: include l'applicazione delle variazioni confermate, i testi interessati e le verifiche. Le parti non verificabili restano dichiarate; non autorizza implicitamente merge o produzione.

Una richiesta generica di controllo produce il rapporto. Il mandato esplicito di aggiornare permette di applicare le correzioni senza richiedere conferma per ogni campo; chiarire solo decisioni sostanziali non risolvibili dalle fonti. Non inviare email, messaggi o richieste di prenotazione ai gestori.

## 1. Preparare il lavoro e scegliere le scadenze

1. Leggere le istruzioni del proprio assistente, `docs/REGOLE.md`, lo stato e questo documento. Verificare ramo e modifiche presenti; conservare il lavoro locale, compresa la revisione Web Locks sospesa. Per una nuova attività usare un ramo da main senza sovrascrivere worktree o bozze.
2. Aprire `controlli-periodici.yaml`. Gli ID di `fonti_esistenti` si risolvono in `src/data/fonti.yaml`, le schede in `src/data/fatti.yaml`; `entita` indica il record applicativo. Il registro non mantiene una seconda copia corrente di tutti gli URL o degli orari. I rapporti conservano invece ciò che è stato osservato in una certa data.
3. Usare la data effettiva del controllo. Gli orari di Napoli sono locali, fuso Europe/Rome; distinguere ora legale/solare, fasce che superano mezzanotte, festivi e prefestivi.
4. Selezionare le voci richieste o dovute. Un `ultimo_controllo_completo: null` è dovuto subito. Calcolare la prossima scadenza come il minimo fra controllo completo + frequenza (7 giorni trasporti, 14 luoghi/locali), scadenza del documento meno 3 giorni, decorrenza di un cambio noto meno 3 giorni e altre date da rivalutare. Non prendere il solo `prossimo_controllo` come prova che gli altri termini siano rispettati.
5. Un fallimento non rinnova la conferma: lasciare l'ultimo controllo riuscito, conservare il problema e programmare un nuovo tentativo entro 3 giorni, prima se il cambio è imminente. Un documento scaduto va segnalato subito, non riprogrammato tra due settimane.
6. Coordinare le voci con le stesse fonti: aprire una pagina una sola volta per esecuzione, poi registrare quali luoghi, sedi, linee e campi copre effettivamente. Un solo avviso del Comune non conferma tutti i parchi.

## 2. Trovare anche pagine e documenti nuovi

Questo passaggio è obbligatorio anche quando il vecchio collegamento risponde e sembra invariato.

1. Aprire il documento già citato e annotare URL richiesto, destinazione del rinvio, data di pubblicazione/aggiornamento se dichiarata e periodo di efficacia. Un HTTP 200 può contenere una schermata di accesso o un errore.
2. Aprire i `canali_scoperta`: ingresso attuale del gestore, indici degli orari, notizie, avvisi, comunicati e archivi dei documenti. Seguire i collegamenti attuali; gli indirizzi nel registro sono punti di partenza, non un elenco immutabile.
3. Scorrere gli elenchi e le loro pagine fino all'ultimo controllo riuscito; leggere anche avvisi più vecchi ancora efficaci, senza data finale o riferiti a chiusure in corso. Alla prima verifica coprire documenti attuali e cambi futuri pubblicati; descrivere eventuali limiti di copertura. Controllare le rettifiche e i successivi avvisi di ripristino.
4. Fare ricerche mirate sui domini ufficiali con soggetto, sede o linea e parole come orari, nuovo orario, chiusura, riapertura, avviso, rettifica. Eseguire prima senza anno, poi con anno attuale e successivo; allargare una query senza risultati togliendo il nome completo tra virgolette o termini troppo restrittivi. Una ricerca limitata alle ultime settimane può nascondere un documento più vecchio tuttora valido.
5. Se il gestore migra il sito, cercarne il nuovo indirizzo tramite collegamenti istituzionali, rinvii e identità dell'ente. Verificare chi gestisce il nuovo dominio e la sede: un nome simile, un dominio scaduto o un aggregatore non sono una fonte ufficiale. Per i siti comunali bloccati, usare ricerca sul dominio e altri canali dell'ente, lasciando incompleta la verifica se non si può aprire l'originale.
6. Il motore di ricerca serve a scoprire la pagina: aprire l'originale prima di confermare il contenuto. Non usare data di scansione del motore, anno nel percorso URL, copyright del footer o `Last-Modified` come data di efficacia. Un PDF al medesimo URL può essere sostituito: registrare dimensioni/hash quando disponibili e leggere comunque contenuto, intestazione, note e validità.
7. Salvare ogni nuova pubblicazione pertinente e il collegamento all'indice che l'ha resa trovabile. Distinguere trovata, aperta e letta/confrontata. I risultati non pertinenti non vanno promossi a nuove fonti.

## 3. Stabilire che cosa vale, per chi e quando

Per ogni pubblicazione registrare separatamente: data di pubblicazione, eventuale revisione, decorrenza, termine, tipo (ordinario, futuro, eccezione, rettifica), sede/impianto/linea, direzione, calendario di esercizio e parti interessate. Una data non dichiarata resta nulla; non inventarla.

- Conservare orario attuale e futuro insieme. Un nuovo orario da dicembre non sostituisce quello valido oggi prima della sua decorrenza. Rileggere la fonte vicino alla data di passaggio.
- Le eccezioni valgono solo per le date, sedi o tratte esplicite. Alla fine di una chiusura temporanea rivalutare il quadro ordinario; non far diventare permanente l'eccezione e non presumere un ripristino se l'avviso non lo stabilisce.
- In caso di sovrapposizione, verificare se il gestore dichiara la sostituzione o una rettifica e se il campo di applicazione coincide. «Più recente» o «ufficiale» da soli non risolvono documenti incompatibili. Registrare il contrasto, conservare le cautele e non scegliere arbitrariamente.
- Confrontare soltanto la sede scelta: civico, città, servizio e accesso. Gesù Vecchio 26 e 4/4A, 50 Kalò Sannazaro e Repubblica, Concettina Sanità e Capri, pizzeria e ristorante Palazzo Petrucci non sono intercambiabili.
- Separare chiesa e museo, bosco e museo, biblioteca visitabile e servizi bibliotecari, singoli ingressi del parco, calendario delle visite e degli spettacoli, orario del ristorante e della macelleria. «Oggi aperto» non descrive l'intera settimana.
- Per strade e panorami senza orario proprio monitorare accessi, cantieri, ZTL e ordinanze; non inventare un orario di biglietteria. Le chiese comprese in una passeggiata richiedono le loro fonti.
- Una scheda Google o un profilo social è utilizzabile solo se attribuito al gestore e leggibile, con piattaforma e data dichiarate; non è automaticamente equivalente al sito istituzionale. Se occorre una schermata scelta da Enrico, segnare il limite; niente accesso ai suoi account. Aggregatori e stampa possono indicare una pista ma non sostituiscono la conferma ufficiale degli orari.

## 4. Verifiche specifiche sui trasporti

- RFI/Trenitalia: cercare quadri per la stazione e il periodo del viaggio, andata e ritorno; incrociare il programma con lavori, bus sostitutivi, fermate saltate e avvisi ancora validi. Il quadro di una stazione non certifica l'intera rete e l'assenza di biglietti in vendita non dimostra una soppressione.
- EAV: aprire indici ferroviari/autobus, nuovo PDF, rettifiche e avvisi. Non ricavare minuti o ultime corse dal solo annuncio. Distinguere L1 EAV Napoli–Sorrento dalla Linea 1 ANM e Campania Express dagli ordinari.
- ANM: confrontare portale corrente e pagine storiche, controllare le 13 linee bus e tutti gli impianti elencati, compresa Montesanto quando chiusa. Un tabellone di partenze in tempo reale non dimostra la frequenza ordinaria.
- GTFS: partire dal catalogo `fonti-dati.yaml`; leggere date e calendari dei servizi nelle tabelle, eccezioni e linee realmente usate. Registrare data scarico e hash del file senza confonderli con la validità del servizio. Non ritenere immutato il contenuto perché l'URL ZIP non cambia. Se il feed non è leggibile, segnalarlo senza rinnovare la conferma.
- Caremar: verificare porto, rotta, tipo di nave, andata/ritorno, data e stagionalità, più avvisi di variazione. Le partenze di oggi non certificano l'estate successiva. Non aggiungere altri operatori al prodotto senza una decisione separata.

## 5. Rapportare e, se richiesto, aggiornare

1. Copiare `rapporti/MODELLO.yaml` in un rapporto con data e, se serve, suffisso della sessione. Conservare i precedenti. Non riempire una voce con «invariato» solo perché si è aperta la pagina.
2. Per ciascuna voce annotare campi confrontati e non confrontati, fonti aperte/lette, query, indici e paginazione coperti, documenti nuovi, efficacia e confronto prima/dopo. Usare esiti distinti: invariato, modifica confermata, futura, eccezione temporanea, nuova pubblicazione da leggere, non verificabile, contrasto, fonte ufficiale mancante o non applicabile.
3. Una conferma vale solo per i campi controllati. Aggiornare `ultimo_controllo_completo` solo se tutti i campi della voce, ricerca delle novità compresa, sono stati coperti. Per un controllo parziale conservare la precedente scadenza complessiva e registrare il progresso nel rapporto.
4. In modalità rapporto fermarsi alle evidenze e alle modifiche proposte. In modalità aggiornamento, applicare quelle confermate: schede, fonti, `apertura` dei locali, eventuali giorni di chiusura e testi dipendenti. Una nuova fonte diventa pubblica solo quando viene effettivamente usata e verificata secondo le regole del progetto; non rinominare gli ID esistenti.
5. Se cambia il modello dei trasporti, aggiornare i parametri pertinenti e rigenerare gli output con gli script documentati; non modificare a mano JSON generati. Una nuova linea, fermata o funzionalità non è implicita nell'aggiornamento degli orari.
6. Rileggere i testi che dipendono dai fatti cambiati prima di `npm run testi:firma`. Per modifiche applicative eseguire i test pertinenti e i controlli finali del progetto. Per sole modifiche del registro/rapporti controllare YAML, riferimenti e copertura: non dichiarare build o test del sito non eseguiti.
7. Aggiornare le scadenze e `PROGRESS.md`. Consegnare conteggio di controlli completi/parziali, variazioni attuali/future, problemi e seguito, con fonti dirette. La richiesta di controllo non attiva un cron, non garantisce aggiornamenti in tempo reale e non autorizza una pubblicazione non richiesta.

## Prima esecuzione e manutenzione del registro

Il [rapporto iniziale](rapporti/2026-10-19-impostazione.md) documenta ricerca, accessibilità e cinque prove limitate, non un controllo completo di tutti gli orari. Le date nei dati applicativi restano precedenti; tutte le voci sono dovute per il primo controllo completo.

Quando entrano nuove tappe, locali o linee autorizzate, aggiornare il registro nella stessa attività: coprire ogni ID attivo e dichiarare le lacune. Quando una fonte cambia indirizzo conservare il vecchio URL nel rapporto, aggiornare il riferimento corrente nel file appropriato e ricontrollare l'identità del gestore.

## Fonti ancora non leggibili e riscontro personale

Prima di rinviare una fonte a Enrico, riprovare l’apertura e cercare altri percorsi pubblici del gestore, nuove pagine e PDF ufficiali. Distinguere errori HTTP, timeout, JavaScript e problemi degli strumenti. Non aggirare controlli di sicurezza. Se il contenuto resta non verificabile o la validità non è chiara, aggiungere o aggiornare un caso in [da-verificare/fonti-orari.md](../da-verificare/fonti-orari.md) con URL, domanda precisa, prove e data; collegarlo al rapporto e al controllo nel registro. Non duplicare casi già aperti. Un’alternativa leggibile ma storica non chiude la verifica. Dopo il riscontro personale registrare fonte, data e validità, poi confrontare i dati e aggiornare lo stato; una semplice apertura della homepage non è un controllo completo.
