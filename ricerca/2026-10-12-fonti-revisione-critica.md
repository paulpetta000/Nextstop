# Revisione critica delle quattro proposte fonti

12/10/2026. Richiesta di Enrico: valutare criticamente tutti e quattro i prototipi, con attenzione all'accesso alle informazioni, alla sintesi e alla consultazione degli originali; confrontare esempi autorevoli sul web. Nessuna proposta selezionata o modificata. Ramo `codex/fonti-specifica`, prototipi del commit `4d171bd`.

La revisione riguarda il blocco in fondo alle pagine. Il progetto della pagina generale `/fonti/` resta successivo. Nessuna nuova verifica dei fatti di viaggio, delle regate o delle date dei registri; nessuna delega o installazione.

**Giudizio editoriale:** primo giro grafico valido, organizzazione delle informazioni ancora da rivedere. Valutazione soggettiva: 6/10 per l'utilità attuale del caso lungo; grafica circa 7,5/10, base tecnica circa 8,5/10, chiarezza delle etichette nel caso lungo circa 3/10. I voti non provengono da utenti o confronti sperimentali. Lighthouse e axe del Blocco 3 restano prove tecniche, non misure della facilità di trovare una fonte.

Ho esaminato HTML/generatore, immagini in chiaro/scuro e il contenuto renderizzato di A/B/C/D nei casi con 12 e 180 fonti, a 390 e 1280 px. [Misure](2026-10-12-fonti-revisione-misure.json). Il browser ha avuto un'interruzione, poi la lettura è stata completata; la scheda temporanea è stata chiusa e il viewport ripristinato. La scheda di Enrico non è stata navigata.

| Proposta | Primo documento, 12 esempi sul telefono | Altezza del pannello con 180 fonti sul telefono | Gruppi del caso lungo |
|---|---:|---:|---:|
| A | 401 px dall'inizio del pannello | 71.451 px | 3 |
| B | 526 px | 73.063 px | 87 |
| C | 478 px | 71.070 px | 3 |
| D | 743 px | 78.658 px | 87 |

Queste altezze descrivono l'ingombro quando tutto è aperto. Non dimostrano che una persona debba leggere tutto, né il tempo necessario a trovare una fonte. Tuttavia mostrano il costo del contenuto ripetuto: oltre 8.000 parole nelle voci e la stessa etichetta generica in tutti i 180 documenti. Nel campione con 12 esempi le etichette sono invece specifiche; la differenza è editoriale, oltre che grafica.

**Il problema principale è l'unità di lettura.** Il visitatore cerca la prova di un orario, una prenotazione, una durata o un riconoscimento. Oggi vede prima molti titoli di documenti, poi editore, descrizione, data, note e relazioni tecniche. La voce dovrebbe fare capire il suo scopo in una frase e permettere subito di aprire l'originale.

**A: conservare la sobrietà, cambiare l'orientamento.** È la chiusura più discreta. Il margine con il luogo aiuta su desktop; sul telefono diventa una riga aggiuntiva ripetuta. I tre argomenti del caso lungo sono troppo ampi per trovare un singolo luogo, e dentro «Luoghi e visite» ci sono 101 documenti. Ridurrei i metadati ripetuti, darei maggiore evidenza allo scopo della fonte e proverei una ricerca locale nel caso lungo. A rimane una buona base per pagine con poche fonti.

**B: conservare la navigazione per luogo, ridurre il costo dell'indice.** L'idea di cercare il luogo è utile. Con 180 fonti, però, 87 gruppi e un indice con scorrimento proprio aggiungono un secondo elenco da consultare. Sul telefono l'indice compatto risparmia spazio ma nasconde gran parte dei nomi. Inoltre un documento condiviso viene collocato sotto un solo luogo: senza alias, chi cerca un altro luogo può non trovarlo nel gruppo atteso. Proverei ricerca visibile per luogo o informazione, indice alfabetico leggero e rimandi alle fonti condivise. La mia raccomandazione iniziale di B da sola era incompleta: orientamento e chiarezza della prova sono due esigenze separate.

**C: conservare il rapporto fra informazione e documento, semplificare la forma.** È la proposta semanticamente più vicina al compito del lettore. Sul desktop le colonne rendono confrontabili informazione e prova. Sul telefono la stessa struttura si impila e la voce media del campione arriva a 354 px. L'intestazione «Informazione da verificare» può suggerire dubbio anche quando il passaggio è stato letto; è più corretto usare uno scopo concreto, per esempio «Durata della visita». Nel caso lungo la colonna principale ripete la frase generica per tutte le fonti, annullando il vantaggio di C. Proverei righe più compatte, organizzazione per luogo e pochi metadati. Le due colonne restano utili solo dove aiutano davvero a confrontare.

**D: conservare il raggruppamento, alleggerire contenitori e indice.** Un foglio per luogo può essere piacevole e chiaro in un racconto con poche tappe. Nel campione sul telefono il primo documento arriva dopo 743 px di pannello. Con 87 gruppi, bordi, titoli, separazioni e «Torna all'indice» si ripetono molto. Le due colonne riducono l'altezza sul desktop, ma possono far cercare il prossimo luogo in più direzioni. Per il compositore ampio preferirei una colonna continua; D resterebbe una variante da provare nelle pagine più brevi.

**Un errore concreto del caso lungo è l'assegnazione delle fonti condivise.** OpenStreetMap compare sotto «Città della Scienza» perché il generatore sceglie il primo luogo alfabetico collegato. La nota ha 184 parole e ripete molti luoghi per «orari» e «contenuto della pagina». Il documento OSM dovrebbe essere trattato nel contesto di mappe e dati; la relazione editoriale va verificata, non ricavata dal primo nome o dal dominio. Una fonte citata in una scheda degli orari non prova automaticamente gli orari: è proprio ciò che manca nella relazione verificata fonte–informazione.

**La voce da progettare ha quattro elementi essenziali:** scopo concreto, titolo riconoscibile collegato all'originale, editore con data del controllo pertinente, limite specifico se cambia l'interpretazione. PDF e ZIP vanno segnalati perché cambiano l'azione. L'anno di una guida deve stare nello scopo del riferimento storico. La data del controllo non sostituisce pubblicazione, edizione o periodo di validità.

Esempio basato sulla fixture, con la data già registrata e senza una nuova verifica:

> **Catacombe di San Gennaro**
>
> **Durata della visita**
>
> [Catacombe di San Gennaro](https://catacombedinapoli.it/it/luoghi/catacombe-di-san-gennaro-napoli/)
>
> Catacombe di Napoli · Controllo registrato: 2 ottobre 2026.

L'indicazione «Durata della visita» descrive la relazione dichiarata nella fixture e nel campo durataFonte; non inventa minuti o conferme nuove. Le etichette definitive del sito richiedono la verifica del passaggio originale.

Per Pintauro, un limite leggibile sarebbe: «Annuncio: riapertura successiva da verificare». Per l'orario EAV occorre mantenere la verifica parziale e il fatto che durata e corsa dipendono dalla stazione. I dettagli sul tentativo tecnico, per esempio l'errore 404 dello strumento o l'estrazione testuale, possono stare nella ricerca interna; al lettore serve il limite concreto. Una nota essenziale non deve scomparire nella sintesi.

**I dettagli da ridurre sono soprattutto ripetizioni e note interne.** Eviterei un'etichetta «Documenta» identica a ogni riga quando la struttura rende già evidente la funzione. Toglierei dalla vista del visitatore frasi sul completamento della classificazione. Riunirei i collegamenti generali al metodo in un solo punto. I titoli lunghi rimarrebbero leggibili e riconoscibili, senza tagli che rendono incomprensibile il documento. Non ridurrei i caratteri per guadagnare densità.

**Per le liste lunghe proporrei ricerca locale e scopi chiari.** Campo visibile «Cerca luogo o informazione», con esempio «Sansevero, orari, biglietti». La ricerca dovrebbe riconoscere nomi e alias, accenti e apostrofi, titolo del documento e scopi verificati; azzerarla deve ripristinare tutte le fonti. I risultati devono conservare il luogo come contesto e dare accesso immediato al documento. Senza JavaScript rimane la lista completa. È una proposta di rifinitura da provare, non una funzione già autorizzata o integrata.

Il perimetro resta quello approvato: tutte le tappe, i locali e gli spostamenti disponibili nella pagina. Un filtro sulle sole tappe del viaggio composto sarebbe un'estensione distinta, con casi di aggiunta/rimozione, annullamento e viaggio condiviso. Il registro pubblico continua a contenere 195 fonti; le nove fonti escluse restano escluse.

**La selezione delle fonti essenziali va fatta per copertura dell'informazione.** Per ogni argomento, prima il documento pertinente che permette di controllare il dato pratico, poi documenti aggiuntivi quando sostengono fatti diversi o chiariscono un limite. Nessun numero arbitrario di fonti per luogo; una fonte debole non viene promossa per rendere l'elenco corto. Le altre prove restano accessibili senza cancellare dati, ID o relazioni. Il contenitore generale di queste informazioni sarà progettato soltanto nel blocco dedicato a `/fonti/`.

**Gli esempi esterni consultati aiutano a definire la funzione, non impongono uno stile unico.**

| Fonte primaria consultata | Osservazione | Applicazione proposta a Nextstop |
|---|---|---|
| [Microsoft · fonti di Copilot Chat](https://support.microsoft.com/en-us/microsoft-365-copilot/control-review-sources-copilot-chat) | Citazioni collegate all'informazione e lista completa delle fonti tramite comando dedicato. | Relazione precisa fonte–informazione e accesso all'originale. Fonti sempre in fondo alla pagina secondo la decisione di Nextstop. |
| [Google · collegamenti nelle esperienze di ricerca AI](https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/) | Il sito e il titolo della pagina aiutano a capire dove porta il collegamento. | Editore e titolo leggibili prima del clic; sul telefono l'informazione deve essere visibile senza hover. Nessuna anteprima remota automatica. |
| [Our World in Data · Life expectancy](https://ourworldindata.org/grapher/life-expectancy) | Separa fonti originali, date di recupero, trattamento dei dati e forme di citazione brevi/complete. È un progetto di ricerca, non un'impresa miliardaria. | Sintesi leggibile, dettaglio tracciabile; distinzione tra fonti esterne e stime/calcoli nostri. |
| [GOV.UK · struttura dei contenuti](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-structure/) | Informazione importante prima, titoli descrittivi, riduzione delle ripetizioni. | Scopo breve in testa alla voce, metadati subordinati. |
| [GOV.UK · accordion](https://design-system.service.gov.uk/components/accordion/) | Richiede prove dell'utilità, sconsiglia contenuti indispensabili nascosti e pannelli annidati. | Un solo blocco esterno chiuso, avvisi essenziali visibili, nessun pannello obbligatorio per ogni documento. |
| [Reuters · principi e standard](https://reutersagency.com/about/our-trust-principles/) | Dichiara accuratezza, indipendenza, integrità e libertà da distorsioni come criteri editoriali. | Metodo verificabile e corretta gestione dell'incertezza. La pagina consultata non dimostra uno specifico modello grafico per il footer. |

Queste applicazioni sono mie inferenze di progetto. La presenza di citazioni in prodotti AI non dimostra la correttezza delle risposte o una migliore usabilità di Nextstop. Non è stata cercata una graduatoria universale delle «migliori aziende»: il confronto riguarda meccanismi pertinenti.

**Ordine del miglioramento:** completare le relazioni editoriali del campione; sintetizzare voce e limiti; correggere raggruppamenti e fonti condivise; provare ricerca e orientamento nelle liste lunghe; verificare con lettori; infine rifinire spazi e colori. La direzione che propongo prende la chiarezza di C, la sobrietà di A e l'orientamento di B. D conserva valore nelle pagine brevi.

Prima di integrare, chiederei a lettori reali di trovare il documento sulla durata delle Catacombe, distinguere il riconoscimento Slow Food 2025 dalla data del controllo, riconoscere il limite dell'annuncio di Pintauro, aprire il PDF EAV e ritrovare una fonte condivisa cercando un altro luogo. Obiettivi proposti: trovare il riferimento entro circa 20 secondi nei compiti principali, un solo clic dal risultato all'originale, distinguere controllo e validità. Sono obiettivi da testare, non risultati raggiunti.

Per questa sola revisione sono state controllate misure, riferimenti locali e conservazione dei prototipi. Suite/build/axe/Lighthouse del Blocco 3 non sono state ripetute perché il codice e gli input eseguibili sono invariati. Nessuna modifica applicata a prototipi, pagine o registri. Prossimo: Enrico valuta la direzione della rifinitura; repository e browser locali con strumenti già presenti, GPT-6.1-sol / High per decidere la struttura, Medium per applicarla.
