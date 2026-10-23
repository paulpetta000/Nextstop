# Revisione codice 7 · ingressi, privacy e dati del generatore

18 ottobre 2026. Seguito del punto 3 del piano unico, base locale 3f17c81. Enrico ha poi chiesto di continuare nella stessa sessione per almeno 35 minuti, anche attraversando più gruppi: questo è un checkpoint, non una richiesta di nuovo OK.

## Risultato

- Pacchetto autobus: rifiuta durate o differenze negative, valori non numerici, quartetti troncati, mezzi inesistenti, segmenti malformati e riferimenti di calendario non validi. La costruzione resta locale alla funzione: il caricatore reale mantiene la città precedente se la lettura fallisce; una successiva chiamata valida la aggiorna. Conservate partenze oltre mezzanotte, secondi/frazioni, intervalli senza una determinata corsa e formato pubblico.
- Generatore GTFS: controlla orari, sequenza delle fermate, date, intervalli, valori settimanali ed eccezioni; rifiuta coordinate mancanti o fuori intervallo nelle fermate utilizzate e nelle shape. Gli orari in discesa non diventano falsi tempi minimi. Le ore oltre 24 restano ammesse; le coordinate zero restano valide. Non è un validatore completo GTFS: nessuna interpolazione introdotta per orari mancanti.
- Privacy dei link: prove sul codice inline della pagina in una VM senza browser confermano cattura e pulizia dell'indirizzo prima degli script successivi. Parametri aggiunti al link non importano visite, timbri o risposta alla posizione; il nome ostile resta testo nel template reale della testata. Corretta la nota troppo assoluta di Condividi: il nostro server non riceve il percorso dal frammento, ma l'app scelta per inviarlo può leggerlo, come già spiega Privacy. Nessun nuovo servizio o cambiamento al contenuto del link.

## Prove

- Dieci prove dei controlli numerici/calendario fallite prima, più una sulla nota e una sulle shape; tutte riuscite dopo.
- 21 prove aggiunte: dieci GTFS, sette sul pacchetto/caricatore, tre sugli ingressi e una su Condividi. Gruppo mirato: 35/35.
- Pacchetto pubblico esistente: risultato completo identico al decoder di HEAD prima delle modifiche, con 8.793 candidati, 101 date e sette tipi di giorno. Primo tentativo di confronto VM fallito per tipi TypeScript e import senza estensione della copia vecchia; confronto riuscito sul sorgente Git corretto con stripTypeScriptTypes. Nessun dato rigenerato.
- npm test: **288/288**, nessun fallimento, salto o cancellazione.
- npm run build: **12 pagine**, Node 24.21.0, telemetria disabilitata, comando ordinario riuscito.
- npm run check:links: **13 documenti, 811 link interni validi**. Worker generato con **82 risorse offline**.
- git diff --check riuscito; nessuna dipendenza, CSS, ID, URL, dato editoriale o formato della memoria cambiato.

Prove con dati sintetici isolati, senza download del feed o rigenerazione delle matrici. [Riferimento GTFS](https://gtfs.org/documentation/schedule/reference/): tempi oltre mezzanotte, coordinate e significato delle eccezioni. L'archivio ZIP e il lettore CSV richiedono una revisione separata: non è stata certificata la resistenza a file arbitrari o enormi.

Nessun browser: non verificati resa della nota, fuoco, viewport, axe o Lighthouse. Il controllo del nome è sul template e sulla codifica, non una prova di sicurezza universale. Nessuna installazione, delega, sessione Google, modifica alle protezioni o pubblicazione.

## Seguito nella stessa sessione

Lettura ZIP/CSV e integrità dei dati in ingresso ai generatori, poi controlli pertinenti e checkpoint locali. La nuova idea su più città e registro degli aggiornamenti, inclusa analisi/stesura, resta rinviata.
