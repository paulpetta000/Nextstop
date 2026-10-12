# Fonti e controlli · specifica

_Bozza da approvare, 12/10/2026. Enrico ha autorizzato solo il Blocco 1: specifica e inventario. Ramo `codex/fonti-specifica`, da `main`._

## Obiettivo e problema

Chi legge un itinerario deve poter verificare un'informazione aprendo le fonti in fondo alla pagina e toccando il documento originale. Oggi gli elenchi restano interamente aperti, arrivano a 185 fonti negli itinerari e 84 in Dove mangiare; l'elenco generale comprende anche fonti dell'evento ereditato da Napoli a Vela. Non basta cambiare il testo introduttivo: servono criteri di pertinenza, collegamenti precisi e un componente comune compatto.

Due elementi coordinati: `/fonti/` spiega metodo e registro; il blocco «Fonti di questa pagina» permette la verifica dal contenuto letto. Un solo registro, senza liste mantenute a mano in più pagine.

[Inventario completo](../ricerca/2026-10-12-fonti-inventario.md), [catene e hash degli input](../ricerca/2026-10-12-fonti-inventario.json), [decisioni e limiti del Blocco 1](../ricerca/2026-10-12-fonti-blocco-1.md).

## Requisiti espressi da Enrico

- Fonti autonome per Nextstop, selezionate in base ai suoi contenuti; una fonte già usata dall'altro progetto può restare se pertinente.
- Dal contenuto al documento originale, senza obbligare a passare dalla pagina generale.
- Fonti in fondo alle pagine, in una sezione apribile chiusa all'inizio; evitare l'elenco lungo sempre visibile.
- Pagina generale curata e utile alla verifica, con design coerente con Nextstop.
- Lavoro per blocchi, con materiali, modello, effort e risultato dichiarati prima di ogni blocco.

## Perimetro e conservazione

Il Blocco 1 modifica solo documentazione e produce l'inventario. Restano invariati sito, registri eseguibili, date, stati, schede, firme, immagini e licenze. Nessuna verifica web nuova di orari o prezzi, nessuna installazione, push, merge o pubblicazione.

Dopo approvazione: registro delle fonti, pagina `/fonti/`, componente comune, fonti dirette/durate e conteggi derivati nelle pagine coinvolte. Le modifiche più ampie alle regole legate al 2027 richiedono una proposta con casi e test; non sostituire automaticamente anni o stati. Le pagine legali mantengono attribuzioni e contatti configurati; nessun cambio di casella email implicito.

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

Registro per luoghi e visite, locali e cucina, trasporti, mappe e dati, storia e cultura; eventi pertinenti solo dopo la decisione sul confine. Gruppi apribili indipendentemente con indice. Se una fonte è condivisa tra argomenti, un record canonico e collegamenti coerenti; conteggiare fonti uniche. Le categorie sono proposta editoriale, non classificazione verificata delle 204 voci. Ricerca/filtri solo se la prova dei bozzetti ne dimostra la necessità.

Spiegare il metodo reale: competenza, validità e aggiornamento, non «vince sempre la fonte più recente». Tipo della fonte e conferma del fatto restano distinti. Non promettere che tutte le schede hanno una scadenza: 46 non hanno `ricontrollare`. Le stime nostre sono dichiarate e collegate al metodo, non presentate come tempi reali garantiti. Rispettare le eccezioni approvate per `storico` e `comeFatto`.

Foto: rimandare ai crediti esistenti senza spostarli o impoverirli. OpenStreetMap resta attribuito vicino alla mappa. Non trasformare l'elenco fotografico o i file delle licenze in fonti di fatti, né attribuire gli scatti a Wikimedia al posto degli autori.

## Design e interazione

Seguire [DESIGN](../DESIGN.md), `design-sito`, `frontend-design` e `stile-testi`. Telefono per primo, chiaro/scuro, caratteri già disponibili, titoli e spazi coerenti, documenti distinguibili e focus evidente. Una gerarchia editoriale leggibile, con poca decorazione; niente loghi degli editori o nuove foto necessarie.

Quattro proposte per il blocco fonti, un pezzo alla volta; scelta e rifinitura, poi quattro proposte per la pagina generale. Contenuti realistici: 185 fonti negli itinerari, 84 nei locali, poche fonti, titoli lunghi, note e download. Mostrare aperto/chiuso a telefono e desktop. Le proposte non autorizzano l'integrazione.

## Decisioni da risolvere prima dell'implementazione

| Decisione | Evidenza e proposta |
|---|---|
| Fonti dell'evento | Nove fonti sostengono le 13 schede di calendario/orari/lungomare/trasporti. Proporre un'eccezione esplicita per link documentali agli organizzatori, oppure ridefinire l'evento con fonti adeguate. Il vincolo attuale «senza link alla Coppa» resta in vigore: non eliminarlo o derogarlo implicitamente. |
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
| 2 · Fonti e metodo | Inventario, documenti originali sul web, skill stile-testi quando si scrive; casi evento prima di rimozioni | GPT-6.1-sol / Medium | Verifiche prioritarie, decisioni di pertinenza, etichette e bozza dei testi; OK prima di cambiare dati |
| 3 · Blocco fonti | Specifica/testi, design-sito e frontend-design; strumenti web già presenti secondo le regole di revisione | GPT-6.1-sol / High per proposte, Medium per rifinitura | Quattro proposte, scelta e prove; OK sul pezzo |
| 4 · Pagina generale | Blocco scelto, registro, testi verificati; stesse skill di design | GPT-6.1-sol / High per proposte, Medium per rifinitura | Quattro proposte e direzione scelta; OK sul pezzo |
| 5 · Integrazione | Astro/componenti esistenti, test riproduttivi, nessuna nuova dipendenza implicita | GPT-6.1-sol / Medium | Codice/dati approvati, test/build/link e prove; OK sull'anteprima |
| 6 · Revisione e rilascio | Controlli automatici Low, revisione ragionata High; Vercel solo con autorizzazione | GPT-6.1-sol / Low e High secondo attività | Resoconto, anteprima e immagini; push/merge/pubblicazione richiedono autorizzazione |

GPT-6-luna / Low solo per formattazione o estrazione semplice su decisioni già fissate; non per valutare fonti contraddittorie. Astra, xhigh e max non necessari al piano attuale. Skill/plugin nuovi e automazioni non sono inclusi. Nel Blocco 1 bastano controlli documentali: non ripetere build o suite perché gli input del sito restano identici.

## Stato

- [x] Autorizzazione di Enrico al solo Blocco 1.
- [x] Inventario di fonti, schede, usi diretti, durate e calendario.
- [x] Bozza della specifica e registro delle decisioni aperte.
- [ ] Enrico approva o corregge la specifica; decide come trattare i link documentali dell'evento.
- [ ] Autorizzazione del Blocco 2; nessun blocco successivo avviato.
