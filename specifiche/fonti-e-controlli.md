# Fonti e controlli · specifica

_Specifica approvata da Enrico il 12/10/2026. Blocco 2 autorizzato: verifiche prioritarie e bozza dei testi. Precisazione successiva dello stesso giorno: eliminare le fonti delle regate dagli elenchi pubblici di Nextstop, senza cambiare calendario o comportamento dell'evento. Ramo `codex/fonti-specifica`, da `main`._

_Seguito del 12/10/2026: Enrico approva la bozza dei testi e autorizza il solo Blocco 3. [Quattro proposte isolate](../design/fonti/giro-1/README.md) e [verifiche](../docs/storico/2026-10-12-fonti-blocco-3.md) preparate localmente; scelta ancora da ricevere. La pagina generale `/fonti/` resta successiva._

_Rifinitura successiva autorizzata il 12/10/2026: [secondo giro delle quattro alternative](../design/fonti/giro-2/README.md), con ricerca locale e sintesi del campione già documentato. [Esiti](../docs/storico/2026-10-12-fonti-giro-2.md). Nessuna nuova verifica generale delle 195 fonti o integrazione; primo giro conservato, scelta ancora da ricevere._

_Preferenza successiva di Enrico: D, per i gruppi in riquadri. Richiesti la rimozione della dicitura interna «Scopo da verificare» e un elenco ampliato delle rifiniture. [Copia aggiornata](../design/fonti/giro-3/README.md) e [piano unico](../ricerca/2026-10-12-fonti-d-rifiniture.md). La rimozione della dicitura non cancella limiti reali o completa automaticamente le descrizioni mancanti. Gli altri interventi restano proposte; nessuna autorizzazione implicita alla pagina generale o all'integrazione._

_Seguito: rifinitura completa della [D, giro 4](../design/fonti/giro-4/README.md), autorizzata e poi approvata da Enrico il 12/10/2026. Prova con un lettore esterno esclusa per sua scelta. Aspetto e movimento della ricerca già presente restano una [rifinitura da fare](../ricerca/2026-10-12-fonti-d-rifiniture.md#rifiniture-ancora-da-fare), senza una nuova cartella o voce nella roadmap. Blocco 4 prossimo da autorizzare; nessuna integrazione o pubblicazione implicita._

_Seguito del 12/10/2026: Enrico autorizza il solo Blocco 4. [Quattro proposte isolate della pagina generale](../design/fonti/pagina-generale/giro-1/README.md), coordinate con la D approvata e con movimento distinto; [controlli e limiti](../docs/storico/2026-10-12-fonti-blocco-4.md). Consigliata A Atlante, scelta ancora da ricevere. Nessuna modifica alla D, nuova verifica generale, integrazione o pubblicazione._

## Obiettivo e problema

Chi legge un itinerario deve poter verificare un'informazione aprendo le fonti in fondo alla pagina e toccando il documento originale. All'inizio del Blocco 1 gli elenchi interamente aperti arrivavano a 185 fonti negli itinerari e 84 in Dove mangiare; il registro generale comprendeva anche fonti dell'evento ereditato da Napoli a Vela. Nel Blocco 2 i documenti delle regate sono stati esclusi, ma resta da costruire il componente compatto. Non basta cambiare il testo introduttivo: servono criteri di pertinenza, collegamenti precisi e un componente comune.

Due elementi coordinati: `/fonti/` spiega metodo e registro; il blocco «Fonti di questa pagina» permette la verifica dal contenuto letto. Un solo registro, senza liste mantenute a mano in più pagine.

[Inventario completo](../ricerca/2026-10-12-fonti-inventario.md), [catene e hash degli input](../ricerca/2026-10-12-fonti-inventario.json), [decisioni e limiti del Blocco 1](../ricerca/2026-10-12-fonti-blocco-1.md).

Seguito: [verifiche prioritarie del Blocco 2](../ricerca/2026-10-12-fonti-verifiche-prioritarie.md) e [bozza editoriale](../ricerca/2026-10-12-fonti-testi-bozza.md). L'inventario del Blocco 1 resta uno snapshot storico; il registro pubblico ora contiene 195 fonti, le altre nove restano solo risolvibili internamente.

## Requisiti espressi da Enrico

- Fonti autonome per Nextstop, selezionate in base ai suoi contenuti; una fonte già usata dall'altro progetto può restare se pertinente.
- Dal contenuto al documento originale, senza obbligare a passare dalla pagina generale.
- Fonti in fondo alle pagine, in una sezione apribile chiusa all'inizio; evitare l'elenco lungo sempre visibile.
- Pagina generale curata e utile alla verifica, con design coerente con Nextstop.
- Lavoro per blocchi, con materiali, modello, effort e risultato dichiarati prima di ogni blocco.

## Perimetro e conservazione

Il Blocco 1 modifica solo documentazione e produce l'inventario. Restano invariati sito, registri eseguibili, date, stati, schede, firme, immagini e licenze. Nessuna verifica web nuova di orari o prezzi, nessuna installazione, push, merge o pubblicazione.

Dopo approvazione: registro delle fonti, pagina `/fonti/`, componente comune, fonti dirette/durate e conteggi derivati nelle pagine coinvolte. Le modifiche più ampie alle regole legate al 2027 richiedono una proposta con casi e test; non sostituire automaticamente anni o stati. Le pagine legali mantengono attribuzioni e contatti configurati; nessun cambio di casella email implicito.

**Precisazione di Enrico, 12/10/2026:** il lavoro riguarda Nextstop e le informazioni di viaggio. Nessuna ricerca, aggiornamento o revisione delle regate. Nove documenti delle regate sono esclusi da `/fonti/`, dai footer delle pagine e dal conteggio della home. I record interni sono conservati per non spezzare riferimenti e firme delle schede esistenti: non sono fonti pubbliche di Nextstop. Nessuna eccezione per link documentali alla Coppa. Questa rimozione è autorizzata direttamente e precede il futuro redesign, che resta da valutare.

Conservare URL pubblici, ID di tappe/locali/fonti, collegamenti condivisi, dati salvati, uso offline, privacy e controlli editoriali. Esclusione dal registro pubblico e cancellazione di dati sono decisioni diverse: archiviare prima di qualsiasi rimozione approvata. Fonte e fatto vanno valutati separatamente.

## Registro e verificabilità

- Ogni documento ha ID stabile, titolo riconoscibile, editore, URL originale, tipo e data di controllo effettivo. Note, pubblicazione e periodo di validità compaiono quando presenti e utili.
- «Documenta» deriva dalla relazione verificata con fatti o dati: per esempio orari, biglietti, prenotazione, durata o riconoscimento con anno. Non inventare associazioni sulla base del titolo o del dominio.
- Un documento può sostenere più argomenti; viene elencato una volta per pagina, con più indicazioni quando necessarie. Gli ID non si rinominano per rendere l'elenco più ordinato.
- La selezione include schede mostrate, testi, fonti dichiarate direttamente, `durataFonte`, dati di mappa/trasporti ed eventi consumati. Caricare una collezione o contare il registro non dimostra che ogni voce sia mostrata.
- Preferire l'URL preciso del documento; la home dell'editore vale solo se contiene realmente l'informazione. Indicare PDF o download: il feed ANM è uno ZIP, non una normale pagina da leggere.
- Un URL raggiungibile non prova che sostenga il fatto. Separare controlli tecnici e lettura editoriale; documenti non leggibili, scaduti o verificati solo attraverso riassunti restano riconoscibili.
- Conservare date registrate finché non si apre e controlla realmente il documento. La data di inventario non diventa una data di verifica delle fonti.

## Blocco in fondo alle pagine

1. Titolo «Fonti di questa pagina» e comando apribile con conteggio delle fonti pertinenti, generato dai dati.
2. Chiuso all'apertura ordinaria. Dentro, fonti cliccabili direttamente, raggruppate per luogo/locale o argomento quando il volume lo richiede. Nessun secondo pannello obbligatorio per ogni documento.
3. Ogni voce mostra documento, editore, cosa documenta e data effettiva; note solo quando chiariscono un limite. Il link al documento resta distinto dal link «Come scegliamo e controlliamo le fonti» verso `/fonti/`.
4. Avvisi importanti, significato degli asterischi e limiti delle stime restano visibili anche con l'elenco chiuso. Gli asterischi attuali sono segni, non link: non attribuire loro un comportamento inesistente. Conservare `#segno` se usato; verificare ogni nuovo collegamento interno verso contenuti chiusi.
5. Partire da `details/summary`, senza nuove dipendenze. L'apertura non richiede rete o JavaScript. I link originali sono normali collegamenti: non inserire anteprime esterne, tracker, iframe o richieste automatiche.
6. Link utilizzabili con tastiera e apertura in altra scheda tramite browser. Non forzare una nuova scheda senza indicarla. Verificare che il ritorno preservi lo stato degli itinerari; non riscrivere lo storage per questo lavoro.
7. Nessun pannello quando non ci sono fonti pertinenti. Per consigli o descrizioni del funzionamento, applicare le regole esistenti `senzaFonte`; non inventare fonti per riempire la sezione.

Negli itinerari il contenuto cambia sul telefono: l'elenco attuale riguarda tutte le tappe e i locali disponibili, non soltanto il viaggio composto. Per il primo rilascio dichiarare questo perimetro e permettere di individuare il luogo nel pannello. Filtrare dinamicamente solo sulle tappe selezionate sarebbe un'estensione successiva, da approvare con i casi di aggiunta/rimozione, annullamento e viaggio condiviso.

## Pagina `/fonti/`

Ordine proposto: apertura breve; criteri di scelta e controllo; date/validità/stime/cautele; registro per argomento; collegamenti a crediti di foto, mappe e dati; segnalazione di una correzione tramite contatto già configurato.

Registro per luoghi e visite, locali e cucina, trasporti, mappe e dati, storia e cultura. Le regate sono escluse dal registro pubblico. Gruppi apribili indipendentemente con indice. Se una fonte è condivisa tra argomenti, un record canonico e collegamenti coerenti; conteggiare fonti uniche. Le categorie sono proposta editoriale, non classificazione verificata delle 195 voci pubbliche. Ricerca/filtri solo se la prova dei bozzetti ne dimostra la necessità.

Spiegare il metodo reale: competenza, validità e aggiornamento, non «vince sempre la fonte più recente». Tipo della fonte e conferma del fatto restano distinti. Non promettere che tutte le schede hanno una scadenza: 46 non hanno `ricontrollare`. Le stime nostre sono dichiarate e collegate al metodo, non presentate come tempi reali garantiti. Rispettare le eccezioni approvate per `storico` e `comeFatto`.

Foto: rimandare ai crediti esistenti senza spostarli o impoverirli. OpenStreetMap resta attribuito vicino alla mappa. Non trasformare l'elenco fotografico o i file delle licenze in fonti di fatti, né attribuire gli scatti a Wikimedia al posto degli autori.

Chiarimento di Enrico durante l'audit del 12/10/2026: anche i percorsi verso crediti, foto e licenze devono restare autonomi da Napoli a Vela, senza rinvii al vecchio sito. Enrico mantiene temporaneamente la casella già configurata `napoliavela.guida@gmail.com` e creerà personalmente quella nuova: eccezione esplicita per il contatto, nessun indirizzo inventato. Le regate e l'esclusione dei nove documenti restano come approvato.

Enrico approva i quattro interventi dell'audit e conferma i tre comportamenti della ricerca generale: campo che si attiva al tocco/focus, transizione del conteggio e dei risultati durante la digitazione, ritorno accompagnato all'elenco quando si cancella. Applicazione in [copie isolate di A, C e D, giro 2](../design/fonti/pagina-generale/giro-2/README.md); B e giri precedenti conservati. Il campo resta stabile mentre si scrive, movimento ridotto con cambi immediati. I crediti sono mostrati in un'anteprima locale; pagina legale e sito non integrati. La D approvata del giro 4 è il pannello a fondo pagina: sua ricerca e rifinitura futura restano separate dalla D della pagina generale.

**Decisione successiva del 12/10/2026:** Enrico interrompe la nuova rifinitura della barra perché non gli piace; tentativo conservato separatamente e anteprime riportate a `be89e9f`. Nessun ulteriore lavoro sull'aspetto o sul movimento della ricerca nel Blocco 5. Enrico sceglie **A · Atlante, giro 2**, per la pagina generale, insieme alla D giro 4 per i pannelli. Integrare il registro completo da 195 fonti, non il campione di 14 esempi; i conteggi degli argomenti riguardano documenti, non numero di luoghi. Richiesto il prompt per avviare il Blocco 5 in una nuova sessione locale; questo blocco e il rilascio non sono eseguiti nella sessione della scelta.

## Design e interazione

Seguire [DESIGN](../DESIGN.md), `design-sito`, `frontend-design` e `stile-testi`. Telefono per primo, chiaro/scuro, caratteri già disponibili, titoli e spazi coerenti, documenti distinguibili e focus evidente. Una gerarchia editoriale leggibile, con poca decorazione; niente loghi degli editori o nuove foto necessarie.

Quattro proposte per il blocco fonti, un pezzo alla volta; scelta e rifinitura, poi quattro proposte per la pagina generale. Contenuti realistici: elenco molto lungo degli itinerari (180 fonti dopo l'esclusione), 84 nei locali, poche fonti, titoli lunghi, note e download. Mostrare aperto/chiuso a telefono e desktop. Le proposte non autorizzano l'integrazione.

## Decisioni da risolvere prima dell'implementazione

| Decisione | Evidenza e proposta |
|---|---|
| Fonti dell'evento · risolta | Enrico le esclude dagli elenchi pubblici di Nextstop. Nessuna eccezione per gli organizzatori; calendario e comportamento dell'evento conservati. La precedente proposta di deroga è ritirata. |
| Informazioni datate al 2027 | Separare contenuti ancora pertinenti e metodo generale. Ogni variazione del modello di cautela va approvata, con test e rilettura; niente cambio globale dell'anno predefinito in questo blocco. |
| Unità di consultazione | Nei pannelli lunghi raggruppare per luogo/locale; nell'archivio per argomento. Le etichette «Documenta» si completano dopo verifica dei documenti. |
| Verifiche pendenti | Fonte EAV con `letta: false`, 19 schede `comeFatto`, una confermata con sole fonti deboli: mantenere i limiti visibili e dare priorità alla lettura originale. |

## Casi e criteri di completamento

- Dal pannello aperto il documento originale si raggiunge con un solo tocco; niente passaggio obbligatorio dal registro generale. Il documento deve sostenere l'informazione dichiarata.
- Fonti uniche, riferimenti validi e copertura anche delle durate. Riprodurre con un test il caso `tp-catacombe-sangennaro` prima di correggere la mancata inclusione.
- Avviso leggibile a pannello chiuso, titoli lunghi senza overflow, controllo apribile con tastiera e nome/stato comprensibili alle tecnologie assistive. Nessun ID HTML duplicato se il componente è presente più volte.
- Dati locali consultabili offline; nessuna promessa di aprire documenti esterni senza connessione. Nessuna richiesta a editori prima del clic.
- Date e conteggi coerenti tra registro, pannelli e home O4; dichiarazioni sulle procedure corrispondenti a dati e codice.
- Durante l'implementazione: test pertinenti e test riproduttivi dei bug; a fine blocco codice/dati `npm test`, build e `check:links`. Il comando controlla link interni, non correttezza o raggiungibilità dei documenti esterni.
- Prima dell'anteprima: axe chiaro/scuro, Lighthouse mobile almeno 95, 320/390 px senza overflow, movimento ridotto, console pulita, prova dei link e ritorno all'itinerario. Anteprima Vercel e immagini da telefono prima del consenso al rilascio.

## Blocchi e strumenti

Le indicazioni modello/effort sono raccomandazioni operative, selezionate da Enrico nel client; nessuna previsione di crediti esatti. Preferire la stessa chat locale e documenti brevi; non delegare.

| Blocco | Materiali e strumenti | Modello / effort | Consegna e pausa |
|---|---|---|---|
| 1 · Specifica e inventario | Repository, Git, Node portatile e js-yaml già installato; analisi statica | GPT-6.1-sol / Medium | Questo documento, inventario completo e resoconto; Enrico rivede la bozza |
| 2 · Fonti e metodo | Inventario, documenti originali sul web, stile-testi; rimozione pubblica delle fonti delle regate autorizzata separatamente da Enrico | GPT-6.1-sol / Medium | Verifiche prioritarie, etichette e bozza; nessuna modifica di fatti, date e stati; OK sui testi prima del design |
| 3 · Blocco fonti | Specifica/testi, design-sito e frontend-design; strumenti web già presenti secondo le regole di revisione | GPT-6.1-sol / High per proposte, Medium per rifinitura | Quattro proposte, scelta e prove; OK sul pezzo |
| 4 · Pagina generale | Blocco scelto, registro, testi verificati; stesse skill di design | GPT-6.1-sol / High per proposte, Medium per rifinitura | Quattro proposte e direzione scelta; OK sul pezzo |
| 5 · Integrazione | Astro/componenti esistenti, test riproduttivi, nessuna nuova dipendenza implicita | GPT-6.1-sol / Medium | Codice/dati approvati, test/build/link e prove; OK sull'anteprima |
| 6 · Revisione e rilascio | Controlli automatici Low, revisione ragionata High; Vercel solo con autorizzazione | GPT-6.1-sol / Low e High secondo attività | Resoconto, anteprima e immagini; push/merge/pubblicazione richiedono autorizzazione |

GPT-6-luna / Low solo per formattazione o estrazione semplice su decisioni già fissate; non per valutare fonti contraddittorie. Astra, xhigh e max non necessari al piano attuale. Skill/plugin nuovi e automazioni non sono inclusi. Nel Blocco 1 bastano controlli documentali: non ripetere build o suite perché gli input del sito restano identici.

## Stato

- [x] Autorizzazione di Enrico al solo Blocco 1.
- [x] Inventario di fonti, schede, usi diretti, durate e calendario.
- [x] Bozza della specifica e registro delle decisioni aperte.
- [x] Enrico approva la specifica il 12/10/2026.
- [x] Enrico autorizza il Blocco 2 e chiarisce che le fonti delle regate vanno escluse, senza intervenire sull'evento.
- [x] Rimozione dei nove documenti dagli elenchi pubblici e dal conteggio della home, con test prima della correzione.
- [x] Verifiche prioritarie e bozza editoriale preparate; evidenze parziali e problemi registrati.
- [x] Enrico approva la bozza e autorizza le quattro proposte del blocco fonti, solo Blocco 3.
- [x] Quattro proposte isolate, esempi reali e verifiche locali del Blocco 3.
- [x] Enrico preferisce D e autorizza la rifinitura completa del piano; esclude la prova con un lettore esterno.
- [x] D rifinita in prototipi isolati, con controlli e resoconto del [giro 4](../design/fonti/giro-4/README.md).
- [x] Enrico approva la D rifinita del giro 4 il 12/10/2026; rifinitura visiva e movimento della ricerca annotati come lavoro futuro.
- [x] Enrico autorizza il solo Blocco 4, con quattro proposte isolate di `/fonti/`, senza installazioni, deleghe o integrazione.
- [x] Quattro proposte della pagina generale con campione reale e 195 fonti, controlli e immagini locali.
- [x] Audit critico di A, C e D richiesto da Enrico, con [quattro interventi proposti e prove](../ricerca/2026-10-12-fonti-pagina-revisione-critica.md); B esclusa dall'audit. Nessun intervento applicato o nuova direzione approvata.
- [x] Enrico approva i quattro interventi e i tre movimenti della ricerca generale; rifinitura isolata A/C/D nel giro 2, senza scelta definitiva o integrazione.
- [x] Enrico sceglie A · Atlante del giro 2 per la pagina generale; interrompe ulteriori rifiniture della ricerca. Registro completo da integrare con D giro 4 nel Blocco 5.
- [x] Enrico autorizza il solo Blocco 5: integrazione locale di A completa e D, metadati condivisi, descrizioni e durate. [Resoconto del 13 ottobre](../docs/storico/2026-10-13-fonti-blocco-5.md).
- [ ] Accettazione tecnica del Blocco 5: gli itinerari non raggiungono ancora Lighthouse mobile 95; risultati e variabilità documentati. Attendere la valutazione di Enrico prima di ampliare il lavoro.
- [ ] Blocco 6, revisione e rilascio: non avviato e non autorizzato; push, merge su main e deploy richiedono consenso esplicito.
