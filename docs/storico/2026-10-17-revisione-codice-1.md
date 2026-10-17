# Revisione del codice · blocco 1 · calcolo dal vivo e link

17 ottobre 2026. Continuazione autorizzata da Enrico sul ramo codex/satori-fflate, a partire da 1e14dae. Tutto da computer, senza browser, credenziali o dati personali. La prova con uso reale di Claude è rinviata a dopo l'eventuale integrazione in main/pubblicazione e richiederà un mandato separato; non è un requisito tecnico del sito.

## Difetti riprodotti prima della correzione

1. **Verso della passeggiata dopo una visita.** Nel calcolo dal vivo, se si riparte dall'ultima tappa segnata visitata, la scelta del verso della prima passeggiata rimasta ignorava il tragitto per raggiungerla. Due prove con quattro punti inventati fallivano: senza tappa successiva sceglieva un avvicinamento di 50 minuti invece di 1; con tappa successiva sceglieva 51 minuti totali di spostamento invece di 11. Sono numeri del caso sintetico, non una misura dei percorsi reali di Napoli. La scelta ora comprende quel primo tratto; la giornata originaria non viene modificata.
2. **Minuti impossibili nei link.** Il lettore trasformava 0960 in 10:00 e accettava altre combinazioni con minuti oltre 59. Il test falliva prima della modifica. Ora un valore impossibile passa alla normale riparazione degli orari già presente, conservando le tappe. Link validi al minuto e fine alle 24:00 restano compatibili.

## File e verifiche

- [calcolo.ts](../../src/lib/itinerari/calcolo.ts): costo iniziale della scelta dei versi comprensivo del punto di ripartenza, quando disponibile.
- [link.ts](../../src/lib/itinerari/link.ts): verifica ore/minuti prima della conversione del campo HHMM.
- [Test del calcolo](../../test/calcolo-itinerari.test.mjs): due regressioni sul verso con e senza una visita successiva, orari e immutabilità.
- [Test dei link](../../test/link-itinerari.test.mjs): regressione sui minuti impossibili e conservazione dei valori validi.

Prima: due test del calcolo e uno dei link falliti; controllo di compatibilità dei link già riuscito. Dopo: **68/68 test mirati**, poi **184/184 test della suite completa** (zero errori, circa 16,6 s). Build locale con Node 24.21.0 e opzione --no-liftoff riuscita: 12 pagine, durata dichiarata da Astro 23,81 s; **811 link interni su 13 HTML, nessuno rotto**. Worker generato: 82 risorse, versione 01a6b59e2d23. Nessuna dipendenza nuova.

La lettura mirata ha seguito calcolo/link e i loro contratti con memoria, pause, spostamenti e inserimento dei pronti; non certifica una revisione conclusa di tutte le cartelle. Le prove usano soltanto archivi fittizi isolati. Formato dello storage, ID, URL validi, fonti, dati generati, temi e licenze non modificati.

## Limiti e prossimo blocco

- Correzioni locali; nessun push, merge, deploy o nuovo controllo CI remoto.
- Nessun controllo visuale, axe/Lighthouse o prova browser eseguito in questo blocco. Il codice dell'interfaccia non è stato modificato.
- La scelta dei versi continua a usare le matrici dello scenario di base; non promette ottimizzazione globale con attese bus dipendenti dall'ora. Non deduce la posizione reale del visitatore né il verso effettivamente percorso in passato.
- Prossimo blocco consigliato: trasferimenti tra giorni, inserimento dei pronti e conservazione di visitate/pause/orari. In particolare, approfondire il ramo che inserisce un giorno accanto a una gita: verificare limite giorni e origine quando gli indici cambiano. La normale scheda esclude destinazioni di gita; l'osservazione sul ramo interno non è ancora un difetto di interfaccia riprodotto.

Il piano unico della ricerca locale resta l'indice delle altre aree: dati/fonti, SEO da esportazioni, interfaccia, manutenzione e cartelle. Nessuna attività sul campo o con altre persone.
