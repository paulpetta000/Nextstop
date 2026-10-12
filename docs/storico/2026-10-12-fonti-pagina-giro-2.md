# Fonti · secondo giro della pagina generale

12 ottobre 2026, ramo `codex/fonti-specifica`, da `e0e249b`. Enrico approva le quattro proposte dell'audit e conferma attivazione del campo, transizione dei risultati e ritorno all'elenco. A/C/D rifinite in copie isolate; B esclusa dall'audit e conservata. **Non è una modifica della D del pannello a fondo pagina, giro 4, già approvata.** Nessuna direzione generale ancora scelta per l'integrazione.

## Risultato e perimetro

- [Giro 2 e confronto](../../design/fonti/pagina-generale/giro-2/README.md), tre campioni di 14 esempi e tre registri completi da 195 documenti. Aperture e identità di A/C/D conservate, ricerca con tre risposte al gesto e alternativa istantanea in riduci movimento.
- Categorie esplicite dei documenti separate dai luoghi: sette fonti EAV/Caremar ricollocate in Trasporti; rinvii ai record canonici dai luoghi, senza duplicare fonti. Tipo disponibile conservato, nessuna equivalenza fra tipo e conferma del fatto.
- Ricerca degli argomenti funzionante, contesto condiviso coerente anche con «pasta e patate Nennella», parità fra luoghi senza scelta arbitraria. Pannelli manuali ripristinati dopo la cancellazione; indice coerente e hash malformati gestiti.
- Focus controllato sotto la fascia dei risultati, anche con Shift+Tab nel viewport basso. Dimensioni del campo stabili; conteggio 150 ms, risultati/ritorno 200 ms, senza attese artificiali. Animazioni precedenti cancellate durante digitazione veloce; composizione del testo gestita.
- [Anteprima dei crediti](../../design/fonti/pagina-generale/giro-2/crediti.html#foto): 54 fotografie con autori, licenze e originali, link delle licenze dove disponibili, Bodoni e licenza locale. Il sito continua a usare la propria pagina legale originale; nuova versione mostrata soltanto nel laboratorio. Casella attuale mantenuta per decisione esplicita di Enrico.

195 ID/titoli originali/URL/date conservati. 185 descrizioni del generale restano nel Blocco 5, separatamente dalle 171 del pannello lungo; tre `bozza-*` rimangono solo nel campione documentato. Nessuna fonte esterna nuovamente aperta, data aggiornata, conferma inventata o modifica a calendario/regate. Nessuna installazione, delega, integrazione, push, merge o deploy.

## Test prima e dopo

[Test riproduttivi](../../design/fonti/pagina-generale/giro-2/regressioni.test.mjs) eseguiti **prima di correggere** sui prototipi del giro 1: 21 fallimenti coerenti con l'audit, un caso senza richieste esterne passa. [Log prima](../../design/fonti/pagina-generale/giro-2/verifiche/regressioni-prima.log). [Dopo](../../design/fonti/pagina-generale/giro-2/verifiche/regressioni-dopo.log): **22/22**.

La nuova prova di due luoghi ugualmente nominati ha rilevato una preferenza arbitraria per il nome più lungo; [5/6 prima](../../design/fonti/pagina-generale/giro-2/verifiche/ricerca-prima.log), [6/6 dopo](../../design/fonti/pagina-generale/giro-2/verifiche/ricerca-dopo.log). Cambiata soltanto la priorità della corrispondenza completa. Il controllo del numero di voci ha inoltre individuato una fixture del campione senza categoria: aggiunto un metadato esplicito e un controllo che impedisce una nuova omissione. Tutti i 14 esempi conservati.

Il controllo visivo dei crediti ha individuato un selettore dei link troppo ampio, che riapriva «Esplora Napoli» nell'intestazione mobile. [Test scritto prima della correzione](../../design/fonti/pagina-generale/giro-2/verifiche/crediti-prima.log), poi selettore limitato al contenuto principale. [Test finali 29/29](../../design/fonti/pagina-generale/giro-2/verifiche/test-finali.log), [crediti controllati nuovamente a 375/1280 nei due temi](../../design/fonti/pagina-generale/giro-2/verifiche/crediti-finali.json), senza violazioni axe o overflow.

Verifiche richieste del progetto: [58/58 test](../../design/fonti/pagina-generale/giro-2/verifiche/test-sito.log), [build riuscita](../../design/fonti/pagina-generale/giro-2/verifiche/build.log), [874 link interni validi](../../design/fonti/pagina-generale/giro-2/verifiche/link-sito.log). Avvisi editoriali preesistenti del sito conservati; nessuna firma o scheda riscritta.

## Telefono, desktop, tastiera e movimento

[Verifiche UI](../../design/fonti/pagina-generale/giro-2/verifiche/risultati.json): 120 combinazioni A/C/D, campione/completo, chiaro/scuro, aperto/chiuso a 320/375/390/768/1280 px; nessun overflow, ID duplicato o bersaglio del prototipo inferiore a 44 px. Testo primario 17 px. 20 scansioni axe senza violazioni, comprese anteprime dei crediti/confronto, 72 ricerche, 60 Tab naturali, 12 prove di originale/ritorno, tre prove senza JS. 54 attribuzioni fotografiche presenti. Nessun errore JS o richiesta agli editori.

La risposta dell'originale e la sua favicon sono **fittizie/intercettate**, lo storage contiene una sola chiave di prova isolata in un profilo Chrome temporaneo e viene rimosso dopo il controllo. Nessun dato degli itinerari della persona viene letto o scritto. Il primo log del controllo registra tentativi di favicon della pagina fittizia, bloccati; corretto il documento di prova per usare favicon locale, poi controllo pulito. Non è una verifica della raggiungibilità odierna degli originali.

[Movimento](../../design/fonti/pagina-generale/giro-2/verifiche/movimento.json): 48 casi, 144 fasi, campione di 14 e registro di 195 fonti, 390/1280 px, due temi, movimento normale/ridotto; campo senza variazioni di larghezza/altezza, focus/query corretti, movimento disabilitato e cambio di preferenza mentre la pagina è aperta. Fallback della API animazioni provato. Sedici fotogrammi del browser fermati ai tempi dell'animazione, non video o prova con lettori esterni. [Aperture](../../design/fonti/pagina-generale/giro-2/verifiche/tre-aperture.png) e [ricerca](../../design/fonti/pagina-generale/giro-2/verifiche/tre-ricerca.png).

## Prestazioni e conservazione

Le [prime misure Lighthouse](../../design/fonti/pagina-generale/giro-2/verifiche/lighthouse-primo-riepilogo.json), conservate, danno A 92/93, C 94/96, D 95/96: alcuni risultati sotto la soglia 95. Lighthouse attribuisce ricalcoli sincroni allo stile dei token letto all'avvio e alla misura immediata della fascia. Correzione: token letti al primo gesto e misure attivate quando la fascia entra nella vista o quando si usa la ricerca/navigazione. Nessuna eliminazione dei documenti, riduzione del contenuto o cambio di tempi per ottenere il punteggio. [Risultati finali](../../design/fonti/pagina-generale/giro-2/verifiche/lighthouse-riepilogo.json): **A 97/96, C 97/97, D 97/97**, chiaro/scuro, accessibilità e buone pratiche 100, CLS 0. Prove funzionali e di movimento ripetute dopo questa modifica dell'inizializzazione.

Controlli finali e conservazione confrontano la [base di 1286 file presa prima del giro](../../design/fonti/pagina-generale/giro-2/verifiche/base-conservazione.json), includendo le cartelle non tracciate preesistenti. I risultati si riferiscono a questa base, distinta dalle discrepanze di hash già documentate nel Blocco 4. Nessun ripristino di quelle discrepanze.

[Conservazione finale](../../design/fonti/pagina-generale/giro-2/verifiche/conservazione.json): 166 input di `src/`/`public/` e 544 file dei precedenti giri Fonti uguali alla base; **1284/1286 complessivi identici**. Due discrepanze: `design/home/proposta-a.html` e `design/home-napoli/rapporti/lighthouse-o2-dark.json`, con date di modifica del 7 e 10 ottobre, precedenti al giro. Nessuna differenza Git rilevata per il primo file tracciato; secondo file in una cartella non tracciata preesistente. Nessun comando del giro scrive in questi percorsi. Cause non attribuite, file non ripristinati e non inclusi nel commit; il controllo complessivo **non è dichiarato interamente riuscito**.

[Riferimenti locali e ancore](../../design/fonti/pagina-generale/giro-2/verifiche/riferimenti.json) verificati in quattro documenti e otto HTML del giro. Link esterni non ricontrollati sul web; diff pulito. Il commit comprende soltanto il nuovo giro, specifica, PROGRESS e questo resoconto; gli artefatti precedenti restano fuori.

Limiti: Chrome con viewport simulati, non prova su telefono fisico/Safari/lettori esterni; Lighthouse e axe non certificano la correttezza editoriale dei documenti. La verifica dei link del sito riguarda quelli interni. I documenti esterni richiedono connessione; nessuna nuova promessa di uso offline degli originali.

## Seguito

**Decisione finale della sessione:** Enrico interrompe il nuovo tentativo della ricerca e sceglie **A · Atlante** per la pagina generale. Il tentativo non approvato è conservato come patch e immagini nel [README del giro](../../design/fonti/pagina-generale/giro-2/README.md#ricerca-intervento-interrotto); codice, HTML e immagini delle anteprime ripristinati alla versione `be89e9f`. I rapporti del tentativo sono distinti in `risultati-rifinitura.json` e `movimento-rifinitura.json`, senza sostituire quelli del giro approvato per la scelta. Blocco 5 da avviare in nuova sessione locale con il registro completo da 195 fonti e D giro 4, senza ulteriori rifiniture della ricerca; nessuna integrazione, push, merge o pubblicazione in questa sessione.

Enrico valuta il giro 2 e sceglie A, C o D per la pagina generale; A resta consigliata. Integrazione, completamento mirato delle descrizioni e aggiornamento reale dei crediti nel Blocco 5, da autorizzare separatamente. Rifinitura della ricerca del pannello D conservata nel suo piano successivo. Strumenti locali attuali sufficienti; GPT-6.1-sol / High per scelta e rifinitura, Medium per applicare decisioni fissate. Si termina con commit locale e pausa per la scelta.
