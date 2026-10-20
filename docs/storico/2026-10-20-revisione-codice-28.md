# Revisione codice 28 · ricerca e mappa

20 ottobre 2026, base c35eb3a; secondo gruppo collegato della ripresa.

## Risultato

La mappa di Aggiungi usava i candidati del filtro senza guardare il testo: pizza trovava le pizzerie nell'elenco e mostrava invece i monumenti sulla mappa. Ora i punti derivano dalla stessa ricerca, con lo stesso filtro; dalla mappa restano escluse le gite e le tappe già inserite, come prima. Senza testo restano le tappe vicine e le categorie previste.

Una selezione esclusa dalla nuova ricerca viene rimossa. Il calcolo locale delle proposte viene svuotato quando si rifanno i risultati, si cambia vista o si seleziona una foto: i nuovi orari non restano nascosti dietro valori memorizzati all'apertura. Durante un foglio aperto non si forza un ricalcolo automatico della pagina: resta la gestione esistente del caricamento differito.

Alla chiusura si cancellano annuncio e inquadratura ritardati; i fotogrammi già richiesti diventano inerti. Una vecchia ricerca non annuncia risultati dopo la chiusura, non sposta il focus e non inquadra la mappa riaperta successivamente.

## Prove

- Sei regressioni riprodotte prima della correzione, due casi di compatibilità già riusciti; aggiunte due verifiche mirate su focus e minuti della scheda selezionata. **10 nuove prove** nel test/aggiungi-ricerca.test.mjs.
- Eseguito il modulo reale con ricerca pura reale, contenitori, timer e mappa fittizi. Nessun browser: non dimostra resa visiva o funzionamento nativo dei lettori di schermo.
- **470/470 test**, nessun fallimento, salto o cancellazione; build di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **79dd2903d890**.
- Log nella cartella della chat: nextstop-ricerca-mappa-{test,build,links}-2026-10-20.log.

## Limiti e seguito

Nessun CSS, dato sorgente, ID, URL, dipendenza o file pubblico modificato. Filtro e vista restano gli stessi; nessuna funzione nuova di roadmap. Resta da provare il comportamento nativo su telefono, incluso focus e annunci. La chiusura delle segnalazioni visive non si deduce da questi test.

Prosegue il mandato ribadito da Enrico alle 12:00:35 UTC: almeno 40 minuti da quella richiesta sui gruppi collegati, senza nuovi OK. Seguito sulla provenienza dei riscontri nei nomi brevi e sulla coerenza dei suggerimenti di riordino con pause e margini. Area 3 ancora aperta, altre sette aree conservate. Nessuna pubblicazione, installazione, delega o automazione; nuova idea rinviata anche nell'analisi.
