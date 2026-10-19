# Laboratorio delle valutazioni

**Prototipo isolato, con luoghi e numeri inventati.** Non è una pagina Astro, non entra nella build pubblica e non è collegato al compositore. Nessuna API o chiave, nessun account, dipendenza, immagine esterna o logo aggiunto. La fascia sotto il segnaposto della foto segue il riferimento di Enrico; il testo delle piattaforme è provvisorio e non certifica la futura attribuzione.

## Aprire la prova

Dalla cartella del progetto, usare un server statico locale già disponibile. Per esempio, con Python presente:

```sh
python -m http.server 8766 --bind 127.0.0.1 --directory design/valutazioni
```

Aprire `http://127.0.0.1:8766/prototipo.html`. Aprire una scheda, poi “Mostra” per la singola piattaforma. Il laboratorio non fa richieste esterne neppure dopo il tocco; i collegamenti rimandano alla nota dimostrativa. Non aprire il file con `file://`: i moduli JavaScript richiedono il server locale.

I controlli della prova, sopra la scheda, non sono elementi proposti per il prodotto: permettono di scegliere tema e simulare campi mancanti, errori, quota, accesso negato, lentezza, scadenza e offline. Dodici operazioni simulate per caricamento della pagina, condivise fra riaperture; non sono un tetto di spesa reale.

## File e limiti

- `prototipo.html` / `prototipo.css`: fascia compatta e righe che vanno a capo, con scala e conteggio, tastiera e messaggi leggibili. Non viene copiata la foto dell’app mostrata dall’utente.
- `dimostrazione.mjs`: dati fittizi e collegamento fra pulsanti, risultati e messaggi. Nessuna chiamata `fetch`, SDK, archivio browser o telemetria.
- `modello.mjs`: valida entrambe le parti dell’aggregato, separa zero e dato assente, annulla richieste, ignora risposte vecchie, limita la simulazione e gestisce errori indipendenti. La memoria dei risultati inventati si azzera alla chiusura; non è una policy di caching per contenuti dei fornitori.
- Test nel file dedicato sotto `test/`: esercitano il modello. I controlli browser del blocco sono descritti nel rapporto di consegna; non sono una certificazione del widget Google o della licenza Terra.

## Passaggio ai dati reali

Prima leggere lo [stato dei fornitori](../../valutazioni/stato.md). Il modello di prova **non è un adattatore Google**: un’eventuale integrazione userà il componente UI Kit ufficiale, senza estrarne i numeri per ridisegnarli. Tripadvisor e TheFork restano subordinati ai diritti di utilizzo. Non sostituire i numeri fittizi con valori copiati dalle pagine web.
