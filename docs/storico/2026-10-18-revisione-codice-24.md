# Revisione codice 24 · calendario e suggerimenti fra giorni

18 ottobre 2026, base 5e7c51b. La sessione continuativa di almeno 45 minuti prosegue.

## Risultato

Il calendario conservava una data ricevuta fuori dal periodo 2026–2030, ma non ne mostrava il mese, contrariamente al caso limite già approvato nella specifica delle rifiniture 2. Ora aggiunge quel solo mese storico alla finestra ordinaria, senza consentire nuove scelte fuori periodo o cambiare il viaggio. Anche con l'orologio oltre il 2030 resta visibile dicembre 2030. Parametri non validi non svuotano o allungano arbitrariamente la lista. Massimo 60 mesi ammessi più l'eventuale mese storico.

Il giorno con tabindex zero viene scelto fra quelli abilitati, anche con un vecchio link fuori periodo. Due prove eseguono la funzione di disegno reale con contenitore fittizio e controllano HTML, singolo ingresso da tastiera e conservazione della data; non simulano il comportamento nativo del dialogo.

Il suggerimento delle tappe lontane valutava gli altri giorni usando lo scenario dei mezzi del giorno di origine. Ora usa data e ora iniziale del giorno candidato; restano la stessa euristica di inserimento, i tempi medi e la preferenza solo a piedi. Non è un controllo completo delle aperture o della capienza della giornata.

## Verifiche

- Cinque riproduzioni del calendario e due dei suggerimenti fallivano prima delle modifiche; **otto test aggiunti** fra casi negativi e compatibilità.
- **428/428 test**, zero fallimenti, salti o cancellazioni; build di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker fbeb2e43a994.
- Log nella cartella della chat: nextstop-calendario-giorni-{test,build,links}-2026-10-18.log.
- Nessun CSS, ID, URL, JSON sorgente o formato di memoria cambiato. Nessun browser: resa visiva, scorrimento e fuoco nativo restano da verificare; non sono certificati dai test HTML.

## Seguito

Revisione del generatore/download delle strade, ancora senza rete reale o rigenerazione. Nessuna pubblicazione o installazione. Area 3 aperta e nuova idea rinviata anche nell'analisi, come richiesto.
