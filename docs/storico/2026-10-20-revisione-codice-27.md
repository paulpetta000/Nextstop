# Revisione codice 27 · trascinamento

20 ottobre 2026, base c36b0c7; seguito locale della revisione dell'area 3.

## Risultato

Il vecchio file citato nel registro non esiste più; la funzione attuale è in src/scripts/itinerari/compositore/viste.js. Riprodotto lo scorrimento fino al resto della pagina: usava soltanto i bordi della finestra e non si fermava alla prima/ultima tappa. Nel pannello desktop ignorava inoltre i bordi del pannello.

Ora ogni fotogramma considera la parte visibile del contenitore e limita lo spostamento all'inizio e alla fine delle tappe. Una lista già tutta visibile non causa scorrimenti inutili. Velocità limitata anche se il puntatore esce molto dalla zona visibile.

Perdita della cattura del puntatore, Escape, cambio di finestra e ridimensionamento annullano senza modificare l'ordine: cancellati fotogrammi, ascoltatori e trasformazioni, rilasciata la cattura. Un secondo puntatore non avvia due gesti concorrenti. Il rilascio ordinario conserva la conferma singola, l'annullamento conserva l'ordine.

## Prove

- Otto regressioni inizialmente fallite; una prova di compatibilità già riuscita. Nove casi totali nel nuovo test/trascinamento-itinerari.test.mjs.
- Il test esegue la funzione reale estratta dal modulo con geometrie, puntatori e fotogrammi controllati; nessun browser. Verificati limiti sopra/sotto, lista corta, pannello desktop, perdita di cattura, Escape/blur/resize, secondo puntatore, conferma e annullamento.
- **460/460 test**, zero fallimenti, salti o cancellazioni; build di **12 pagine**, **13 documenti / 811 link interni validi**, **82 risorse offline**; worker **c2861f48704c**.
- Log nella cartella della chat: nextstop-trascinamento-{test,build,links}-2026-10-20.log.

## Limiti e seguito

Riga storica sullo scorrimento aggiornata come corretta nel codice locale, con prova nativa ancora pendente. La compattazione iniziale è ancora presente nel CSS; il codice compensa già la posizione iniziale, ma il test con geometrie finte non dimostra fluidità o assenza di salti sul telefono. Quella segnalazione resta aperta e non viene chiusa per supposizione.

Nessun CSS, dato sorgente, ID, URL, dipendenza o file pubblico modificato. Accesso da tastiera già presente (frecce e ripristino del focus) conservato. Aspetto, gesti nativi e accessibilità interattiva restano non dimostrati senza browser. Nessuna pubblicazione, installazione, delega o automazione.

La chat del 18 ottobre è rimasta interrotta: non si conta il tempo di attesa come lavoro né si dichiara una sessione continuativa attraverso la pausa. Ripresa operativa il 20 ottobre alle 11:54:32 UTC; prosegue il mandato di almeno 45 minuti sui gruppi collegati, ora ricerca e filtri. Area 3 aperta, altre sette aree invariate. Nuova idea rinviata anche nell'analisi.
