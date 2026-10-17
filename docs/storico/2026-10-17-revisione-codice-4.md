# Revisione del codice · gruppo 4 · salvataggi e recupero

17 ottobre 2026, base 35cfd6b, ramo codex/satori-fflate. Continuazione autorizzata: più parti collegate nella stessa sessione, tutto da computer. Nessun browser, dato personale, dipendenza nuova o pubblicazione.

## Copie obsolete in altre schede

Prima, due sessioni potevano leggere lo stesso archivio; B salvava la propria modifica, poi A riscriveva l'archivio vecchio. Entrambe dichiaravano successo, ma la modifica B spariva. Riprodotti prima della correzione anche perdita di un nuovo itinerario esterno e ripristino di un archivio eliminato.

Ora creaSalvataggio conserva il testo letto come riferimento e, prima di scrivere, confronta il contenuto corrente. Se è diverso, rifiuta la scrittura e distingue il conflitto da un errore della memoria. Scritture successive della stessa sessione restano possibili; dopo un aggiornamento esterno accettato si ricrea il riferimento. Non cambiano chiave, versione o formato degli itinerari.

La riproduzione isolata passa da B=true/A=true con B perso a B=true/A=false con B conservato. Usa una Map al posto della memoria del browser: nessun archivio personale coinvolto.

**Mitigazione parziale, non soluzione atomica.** Il confronto e la scrittura sono operazioni separate. Due processi possono ancora leggere lo stesso riferimento prima di scrivere; resta anche la finestra tra lettura dell'archivio e creazione del riferimento. Client vecchi non partecipano alla protezione. Non sono stati aggiunti Web Locks né cambiamenti asincroni a tutti i comandi. La [specifica HTML](https://html.spec.whatwg.org/multipage/webstorage.html#introduction) avverte di non assumere un blocco tra agent cluster; i [Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) sono una possibile direzione, da progettare con un ripiego esplicito. Questa area rimane aperta prima del rilascio.

## Esito visibile e recupero

- Un itinerario già presente non mantiene la spunta di successo se l'ultima modifica non è stata scritta: compare «Modifiche non salvate».
- Un avviso successivo, per esempio «Tappa spostata» con «Annulla», conserva anche l'avvertimento sul salvataggio. Il comando Annulla resta attivo.
- Con errori pendenti, l'evento storage non sostituisce automaticamente la copia locale con quella esterna. La copia esterna rimane nella memoria e il lavoro corrente resta nella pagina.
- «Salva» permette di riprovare anche su un itinerario già salvato, senza rinominarlo né farlo diventare una bozza se il tentativo fallisce. Il limite di 50 vale per nuove aggiunte; il riepilogo non conta due volte un itinerario esistente.
- Un errore nell'aggiornamento successivo impedisce una conferma ritardata falsa. «Condividi» viene proposto come recupero del percorso: conserva le regole esistenti del link, che non trasferisce visite e timbri personali. Non è un backup integrale dell'archivio.

Il messaggio temporaneo continua a scadere normalmente; l'etichetta di mancato salvataggio resta nei controlli. Nessuna fusione automatica delle due copie o sovrascrittura forzata introdotta. Chiusura o ricarica senza recupero può perdere il lavoro rimasto soltanto nella pagina.

## Prove, file e limiti

Modificati [memoria.ts](../../src/scripts/itinerari/memoria.ts) e i collegamenti [stato](../../src/scripts/itinerari/compositore/stato.js), [avvio](../../src/scripts/itinerari/compositore/avvio.js), [fogli](../../src/scripts/itinerari/compositore/fogli.js), [avvisi](../../src/scripts/itinerari/compositore/comuni.js). Prove in [conservazione](../../test/conservazione-itinerari.test.mjs) e [avvisi/salva](../../test/avvisi-salvataggio.test.mjs).

Dodici test aggiunti. I test dell'interfaccia eseguono le funzioni reali estratte dal sorgente con elementi e dipendenze finti: non sono controlli visivi o prove tra due schede reali. Durante la revisione hanno riprodotto anche due errori del nuovo collegamento, corretti prima del commit: selettore singolo usato come lista e conteggio 51 su 50. Nessun errore è stato pubblicato.

Verifica finale dopo l'ultima modifica: **225/225 test**, zero errori, circa 10,9 secondi; **build riuscita di 12 pagine** in 7,51 secondi dichiarati da Astro; **811 link su 13 HTML**, nessuno rotto. Worker: 82 risorse, versione 47c1f302972c. Node 24.21.0, build con --no-liftoff. Diff e riferimenti locali verificati. Ciclo finale ripetuto dopo le correzioni emerse dalla rilettura, non per i soli documenti.

Nessuna modifica a dati, ID, URL, colori, fonti, licenze o dipendenze. Nessun controllo completo dei tipi, prova visiva, axe/Lighthouse, CI remota, push, merge o deploy. Prova reale Claude ancora rinviata a dopo main/pubblicazione. Revisione complessiva non conclusa.

**Seguito prioritario:** rendere coerenti lettura e scrittura tra sessioni, proteggere anche la simultaneità e definire il recupero senza perdere le due copie; poi verifiche UI prima di proporre il rilascio, rispettando il browser escluso.
