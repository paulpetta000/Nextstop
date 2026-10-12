# D · piano unico delle rifiniture

12/10/2026, ramo `codex/fonti-specifica`. Enrico esprime preferenza per D, per la separazione dei gruppi in riquadri, e richiede ulteriori miglioramenti da aggiungere ai cinque già proposti. Richiede espressamente di non mostrare «Scopo da verificare». Ambito: pannello in fondo alle pagine; `/fonti/` resta un progetto successivo.

## Decisione sulla dicitura

«Scopo da verificare» indicava che mancava la descrizione editoriale della relazione tra fonte e informazione. È una nota di lavorazione, non un'informazione utile al visitatore e non una dichiarazione che il documento fosse necessariamente falso o mai letto.

**Dicitura eliminata dalla copia aggiornata di D:** [giro 3](../design/fonti/giro-3/README.md). Quando manca una descrizione, non viene inventata o sostituita da un altro segnaposto. Restano titolo originale, editore, data e limiti pertinenti. Le descrizioni mancanti sono tracciate qui e nel resoconto del giro precedente. Prima dell'integrazione vanno completate con le prove disponibili e controlli mirati dove manca un passaggio; non si riapre una revisione indiscriminata delle 195 fonti.

Le cautele sul contenuto restano: un annuncio non conferma la riapertura, un PDF letto parzialmente non diventa una tabella verificata, una selezione del 2025 non diventa un premio attuale. Niente etichette generiche di lavorazione nel pannello; limiti concreti scritti in linguaggio naturale.

## Interventi già proposti, aggiornati

1. **Descrizioni concrete e brevi.** Quando disponibili, «Durata della visita», «Orari e biglietti», «Chiocciola Slow Food · edizione 2025». Non ripetere «Scopo» o «Documenta» a ogni voce. Le descrizioni mancanti restano un compito editoriale interno; non dedurle soltanto dal titolo o dal dominio.
2. **Cautela prima del collegamento quando cambia l'interpretazione.** Per Pintauro, «L'annuncio non conferma che la riapertura sia avvenuta». Per EAV, indicare la lettura parziale prima del PDF. Separare questo limite dalle note secondarie. Nessun obbligo di aprire un secondo pannello per scoprirlo.
3. **Ricerca più comoda sul telefono.** Campo ampio, label sempre visibile, reset che non sottrae troppo spazio alla digitazione. Ridurre testo e distanza prima del primo gruppo. La ricerca deve restare accessibile con tastiera e ripristinare tutte le fonti; nessuno storage o richiesta esterna.
4. **Luogo cercato subito visibile nelle fonti condivise.** Cercando Nennella, mostrare quel nome nel contesto principale del risultato, con gli altri luoghi come informazione secondaria. Evitare di ripetere i nomi prima e dopo il documento. Un unico record e collegamento per fonte; ricerca valida anche dagli altri luoghi collegati.
5. **Prova breve con lettori indipendenti.** Trovare la durata Catacombe, distinguere premio 2025 e controllo 2026, capire il limite Pintauro, aprire il PDF EAV e trovare il documento condiviso da due luoghi. Misurare il risultato senza spiegare prima il funzionamento. Da organizzare: test automatici e revisione del progettista non sostituiscono questa prova.

## Ulteriori miglioramenti individuati

6. **Ordine delle fonti dentro ogni riquadro.** Prima il documento pertinente alla domanda pratica, poi riferimenti storici o recensioni che sostengono altre informazioni. L'ordine dipende dalla relazione documentata, non da una graduatoria universale degli editori. Nel campione Napoli–Sorrento il PDF dell'orario non dovrebbe essere preceduto dal riscontro parziale sul Campania Express quando si cercano gli orari. Nessun limite arbitrario al numero di fonti e nessuna cancellazione delle altre.
7. **Titoli riconoscibili, senza ripetere lo scopo.** Una riga per ciò che documenta e un titolo collegato che permetta di riconoscere l'originale. Valutare forme brevi fedeli per i titoli molto lunghi, mantenendo il titolo completo accessibile a telefono e tastiera. Niente troncamento ambiguo, tooltip solo al passaggio del mouse o titolo inventato. Mai un passaggio aggiuntivo obbligatorio per aprire l'originale.
8. **PDF e download riconoscibili sul collegamento.** Il formato deve essere evidente prima del tocco, non soltanto nei metadati successivi. Per ANM distinguere l'archivio di dati da una pagina da leggere; spiegare il formato attraverso ciò che si scarica. Conservare i termini tecnici nel titolo originale quando necessari, senza farne la prima informazione per il visitatore.
9. **Date con un significato immediato.** Uniformare impaginazione e lingua, preservando la distinzione tra controllo registrato, lettura parziale e consultazione tentata. Anno della guida e periodo di validità vicini all'informazione; data del controllo secondaria. Niente data unica, semaforo verde «tutto verificato» o aggiornamento automatico alla data odierna.
10. **Riquadri compatti e conteggi comprensibili.** Conservare confini e titoli dei gruppi; togliere separazioni duplicate, spazi che non aiutano e note ripetute. Valutare un conteggio discreto nei gruppi con più documenti; il conteggio generale indica fonti uniche e non cambia significato durante la ricerca. Testo primario a 17 px, aree da toccare almeno 44 px, contrasto nei due temi.
11. **Risultati di ricerca comprensibili.** Mostrare chiaramente quante fonti sono trovate e il contesto del luogo. Provare nomi alternativi documentati e le parole che un visitatore userebbe, come «costo», «biglietto» e «durata», soltanto nelle relazioni che le sostengono. Nessun sinonimo che promuova una fonte non letta a prova. Lo zero risultati offre subito il ritorno all'elenco.
12. **Ritorno alla ricerca durante gli elenchi molto lunghi.** Valutare un unico comando discreto disponibile dopo che la ricerca è uscita dalla vista, invece di ripeterlo in tutti gli 87 gruppi. Deve portare al campo, non soltanto alla testata, mantenere il focus corretto e non coprire fonti o tastiera del telefono. È una proposta da provare, non una nuova barra fissa già decisa.

## Ordine di lavoro e vincoli

Prima descrizioni e cautele (1–2, 9), poi accesso e orientamento (3–4, 6, 8, 11), infine rifinitura dei riquadri e prova del ritorno (7, 10, 12). La prova con lettori (5) verifica se le decisioni aiutano davvero; i controlli tecnici restano obbligatori.

**Stato effettivo:** applicata soltanto la rimozione della dicitura richiesta. Gli interventi restanti sono raccolti e proposti, non dichiarati già realizzati. Il giro 3 conserva struttura, stili e comportamento della D del giro 2. Una successiva rifinitura non autorizza integrazione, pagina generale o pubblicazione.

Conservare tutte le fonti, ID, URL, date e prove; 195 fonti pubbliche e nove documenti delle regate esclusi. Nessuna modifica alle funzionalità dell'evento, ai dati degli itinerari, a privacy, offline o licenze. Nessuna installazione o delega. Modello consigliato GPT-6.1-sol / High per decidere le rifiniture, Medium per applicarle; repository e strumenti locali già presenti.
