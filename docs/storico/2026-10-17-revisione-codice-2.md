# Revisione del codice · gruppo 2 · tre parti insieme

17 ottobre 2026. Base e34f573, ramo codex/satori-fflate. Enrico ha chiesto di raggruppare due o tre parti prima di fermarsi; questo gruppo comprende trasferimenti, inserimento dei pronti e conservazione attraverso memoria/condivisione. Nessun browser, dato personale, dipendenza nuova, push, merge o deploy. Prova reale Claude ancora rinviata a dopo main/pubblicazione.

## 1. Trasferimenti tra giorni

Riprodotti prima delle correzioni:

- L'inserimento davanti a un giorno di gita cambiava l'indice dell'origine quando questa veniva dopo: il trasferimento leggeva/modificava il giorno sbagliato, con duplicazione della tappa e perdita del segno visitata. Ora si conserva il riferimento al giorno di origine nella copia di lavoro.
- Lo stesso ramo poteva creare un ottavo giorno, perché il limite copriva solo l'aggiunta in fondo. Il limite ora vale per entrambi gli inserimenti, senza cambiare l'originale.
- Trasferendo più visitate, il loro ordine veniva riscritto nell'ordine delle tappe selezionate. Ora si conserva l'ordine delle visite del giorno di origine.
- Una visita trasferita veniva accodata anche se precedente alle visite già nella destinazione. Con tutti i timbri disponibili si conserva l'ordine cronologico, affinché l'ultima visita non diventi semplicemente l'ultima spostata. Senza timbri completi si conserva l'ordine noto, senza inventare date.

Il normale menu della scheda esclude destinazioni di gita: i primi due sono difetti del ramo interno supportato dalla funzione, non un incidente osservato sull'interfaccia pubblica. Anche il trasferimento di gruppi di visitate è verificato a livello di funzione. La correzione della cronologia comprende il trasferimento singolo verso un giorno già visitato.

## 2. Inserimento degli itinerari pronti

Riprodotto un numero di giorno errato nel riepilogo delle tappe già presenti. Esempio sintetico basato sui pronti del progetto: l'inserimento di un nuovo giorno sposta Sant'Elmo dal terzo al quarto, ma il risultato continuava a indicare il terzo. La pagina usa direttamente quel numero nell'avviso. Ora il riepilogo segue ogni inserimento; tappe esistenti, visitate e pause restano nel loro giorno, che scorre avanti.

## 3. Conservazione dopo più operazioni

Nuova prova combinata con archivio finto isolato: trasferisce due tappe, inserisce un pronto di due giorni, salva, rilegge e genera/riapre il link. Controlla ID, nome, data, orari, pause (compresa la pausa che torna al posto di base), margine, scelta sulla posizione, segni visitata, timbri, preferenze dei pasti e l'altro itinerario intatto. Conferma che timbri, posizione, visitate e preferenze dei pasti non finiscano nel link.

La prova attraversa i moduli reali; non simula tocchi o il pulsante Annulla nel browser. L'originale resta identico e disponibile per il ripristino. Formato e chiavi della memoria non cambiano; memoria.ts non è stato modificato.

## File e verifiche

Codice: [spostamenti.ts](../../src/lib/itinerari/spostamenti.ts), [pronti.ts](../../src/lib/itinerari/pronti.ts).
Test: [spostamenti](../../test/spostamenti-itinerari.test.mjs), [pronti](../../test/pronti-itinerari.test.mjs), [conservazione](../../test/conservazione-itinerari.test.mjs).

Sette nuovi test. Nella prima esecuzione cinque nuove prove fallivano, una delle quali era la prova combinata; dopo la prima correzione è stato riprodotto e corretto anche il caso della cronologia nella destinazione. Le altre prove coprono la conservazione dei casi validi. Alla fine **36/36 test mirati e 191/191 test completi** (zero errori, suite circa 12,7 s). Un solo ciclo finale comune di suite/build/link per le tre parti: build locale di 12 pagine riuscita, durata dichiarata da Astro 10,39 s; **811 link interni su 13 HTML, nessuno rotto**. Node 24.21.0, build con --no-liftoff. Worker: 82 risorse, versione a8dd2388950e. Diff e riferimenti documentali verificati.

## Limiti e seguito

Nessun nuovo controllo browser, axe/Lighthouse, CI remoto o rilascio. Dati, ID, URL validi, licenze, temi e dipendenze conservati. Con timbri mancanti non si può ricostruire una cronologia completa: si mantiene il comportamento compatibile. La revisione di tutte le cartelle non è ancora conclusa.

Prossimo gruppo proposto: **caricamento dei dati differiti, recupero dagli errori, aggiornamenti offline**, usando gli strumenti locali esistenti e tenendo separate le prove che richiedono il browser escluso. Il confronto di consumo Claude resta separato, dopo l'eventuale pubblicazione.
