# Revisione codice 30 · risparmio effettivo del riordino

20 ottobre 2026, base 301640e; quarto gruppo collegato.

## Risultato

Il suggerimento dichiarava il risparmio dal calcolo di base, mentre il giorno mostrato include pause, margini e contesto dal vivo. Riprodotto un caso che prometteva 35 minuti in meno e ne aggiungeva 150 dopo una pausa; un margine di 15 minuti poteva trasformare il medesimo suggerimento in 40 minuti in più.

Il generatore dell'ordine accetta una valutazione opzionale del candidato. La pagina usa il calcolo completo G, con le visitate ricongiunte all'ordine che verrà applicato. Solo un risparmio effettivo di almeno cinque minuti produce il suggerimento. La build, senza contesto aggiuntivo, conserva il controllo precedente degli itinerari pronti. Nessun import circolare tra motore e pause.

La memoria del suggerimento considera giorno completo, margine e contesto dal vivo, oltre a data, preferenza a piedi e versione dei dati. Cambiare una pausa o avanzare con l'ora non lascia una promessa obsoleta. Prima tappa, blocchi delimitati da locali/evento, visitate e scelta Lascia così conservano le regole esistenti.

## Prove

- Cinque regressioni fallite prima della correzione; cinque verifiche di compatibilità. Dieci nuove prove nel test/ordine-itinerari.test.mjs, con motore, pause e funzione reale di stato.
- Confronto su **540 giornate sintetiche** con dati pubblici già costruiti: cinque percorsi di 5–10 tappe, tre date, tre partenze, tre margini, pausa sì/no e contesto dal vivo sì/no. **540 controlli di base identici** alla versione precedente; tutti i 540 suggerimenti contestuali hanno risparmio uguale al calcolo completo. Nel corpus 234 vecchie quantità differivano dal calcolo completo, nessuna sotto soglia: il peggioramento è riprodotto separatamente nei test sintetici. Questi conteggi non stimano frequenze reali degli utenti.
- Nessun cambiamento dei dati: scenari e orari pubblici caricati solo in memoria; nessuna rete. Confronto Node locale circa 3,5 secondi, non benchmark del telefono.
- **482/482 test**, zero fallimenti, salti o cancellazioni; build di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **e74fc87e4f9f**.
- Log nella cartella della chat: nextstop-ordine-{test,build,links}-2026-10-20.log e nextstop-ordine-confronto-2026-10-20.log.

## Limiti e seguito

Si verifica il candidato trovato dall'algoritmo esistente: non si dimostra l'ottimo globale con vincoli d'orario, aperture o capienza della giornata. Il modello dei mezzi resta aggregato. Rendering, gesto e uso da tastiera nativo da provare quando sarà autorizzato il browser.

Nessun CSS, dato sorgente, ID, URL, dipendenza o file pubblico modificato; nessuna pubblicazione, installazione, delega o automazione. Prosegue il minimo di 40 minuti dalle 12:00:35 UTC, ora su recupero dei testi e date degli eventi. Area 3 aperta, altre sette aree e nuova idea rinviata conservano lo stato precedente.
