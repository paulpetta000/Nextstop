# Revisione codice 9 · corse circolari e coerenza GTFS

18 ottobre 2026, base 27704d4. Terzo checkpoint della stessa sessione continuativa, senza nuova richiesta di OK.

## Risultato

- Una corsa a → b → a perdeva la salita iniziale: la mappa degli indici conservava solo l'ultima visita di a. Ora conserva tutte le occorrenze e associa ogni salita alla prima discesa successiva. Provati ritorno al capolinea, passaggi ripetuti e entrambi i versi. Rimangono mediana dei tempi, arrotondamenti e ordinamento/deduplicazione delle partenze già previsti dal modello.
- Chiavi primarie duplicate e ID mancanti nelle tabelle non sovrascrivono più corse o fermate. Controllati anche riferimenti trip → route/servizio e stop_time → trip. Non è una validazione completa di tutte le relazioni GTFS o delle regole pickup/drop_off.
- La tabella dei nomi usa un oggetto senza prototipo: anche un ID __proto__ resta una proprietà serializzabile, senza confonderlo con il prototipo JavaScript.

Cinque nuove prove fallite prima e riuscite dopo. Una sesta prova attraversa il percorso feed ZIP → partenze → JSON → decoder → spostamento reale: prima del bus compare la corsa corretta; dopo l'ultima partenza torna il percorso senza bus. Dati fittizi e funzioni reali, nessun browser.

## Verifiche

- Gruppo GTFS **30/30**, suite **308/308**, nessun salto, fallimento o cancellazione.
- Build ordinaria di **12 pagine**, **13 documenti e 811 link validi**, worker con **82 risorse**; telemetria disabilitata.
- git diff --check e riferimenti/NUL dei documenti verificati.
- Uno script di modifica ha interrotto l'ultimo piccolo aggiornamento per riassegnazione di una costante; completato separatamente e verificato prima della suite. Nessuna modifica ai dati o perdita di file.

Fonte di formato: [GTFS Schedule Reference](https://gtfs.org/documentation/schedule/reference/#stop_timestxt), che ammette più passaggi dalla stessa fermata nella stessa corsa; chiavi primarie e riferimenti nelle sezioni delle singole tabelle.

Le correzioni del generatore varranno alla successiva rigenerazione autorizzata: i JSON pubblici esistenti non sono stati riscritti. Nessuna installazione, delega, browser, sessione Google, modifica di protezioni, push, merge o deploy. Il modello mantiene orari programmati e mediane: non promette tempi reali nel traffico.

## Seguito

Continua il controllo dei dati pedonali in ingresso, delle quote e del calcolo dei percorsi. La nuova idea su più città e registro degli aggiornamenti rimane rinviata, inclusa l'analisi.
