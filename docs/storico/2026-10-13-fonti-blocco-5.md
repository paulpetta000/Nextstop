# Fonti · Blocco 5, integrazione locale

13 ottobre 2026. Ramo `codex/fonti-specifica`, proseguimento di `c5a6fa7`. Autorizzato il solo Blocco 5: A · Atlante del giro 2 per `/fonti/`, D del giro 4 per i pannelli. Nessuna delega, installazione, modifica delle regate, push, merge o pubblicazione.

## Risultato

- Registro completo di **195 documenti pubblici**, con metadati editoriali condivisi. Conteggi derivati: 94 Visite, 69 Cucina, 17 Trasporti, 1 Mappe, 14 Cultura. Titoli originali, URL registrati, editori, pubblicazioni e date di controllo provengono ancora da `src/data/fonti.yaml`.
- Descrizioni completate nei [metadati](../../src/data/fonti-metadati.json), sulla base di schede, riferimenti dei testi, durate e prove del Blocco 2. Ogni voce conserva una traccia interna di schede, testi e durate collegati. Non è una nuova verifica integrale dei 195 documenti.
- [Registro comune](../../src/lib/fonti-registro.mjs), [voce documento](../../src/components/fonti/Documento.astro) e [pannello D](../../src/components/FontiPagina.astro) usati dalle pagine reali. Una fonte condivisa compare una volta per pagina, con tutti i luoghi collegati. Gli originali sono normali collegamenti, senza richieste agli editori prima del clic.
- Fonti delle durate incluse nella selezione: il test reale delle Catacombe falliva prima della correzione e passa dopo. Il pannello degli itinerari ha **181 documenti**, contro i 180 precedenti. Il perimetro comprende tutte le tappe, i locali e gli spostamenti disponibili, senza filtrare sul viaggio composto.
- A conserva la ricerca approvata prima del tentativo archiviato. D conserva campo, ricerca, gruppi e ritorno approvati. Nessuna nuova rifinitura grafica o animazione della ricerca. L’indice di D viene preparato al primo uso del pannello; documenti e descrizioni rimangono nel normale HTML, anche senza JavaScript e senza rete.
- [Note legali](../../src/pages/note-legali.astro): 54 crediti fotografici con autore, origine, modifiche e licenze, collegamenti agli autori quando già disponibili, licenza Bodoni Moda. Percorso interno a Nextstop; contatto letto dalla configurazione, con `napoliavela.guida@gmail.com` conservato.

## Originali e limiti editoriali

Il PDF EAV e gli URL leggibili Gambero Rosso già individuati nella ricerca sono collegati direttamente, mantenendo anche la pagina registrata della fonte. Per EAV è stato eliminato dal collegamento aggiuntivo il parametro temporaneo `refresh`: controllo tecnico HEAD riuscito, **200, application/pdf**, nome del PDF restituito dal server. Il lettore web non ha recuperato il PDF; questo controllo tecnico non è una nuova lettura della tabella e non aggiorna la data editoriale. Il limite della lettura testuale precedente resta visibile.

Le letture parziali o dei passaggi salvate nel Blocco 2 restano distinte dal controllo registrato. Menu 2022/2023/2024, guide 2025, annuncio Pintauro, sedi della classifica, FAI/Donn’Anna, avvisi datati, divergenze di orari e prezzi conservano cautele concrete. Nessuna scheda promossa a confermata, nessuna firma o data originale aggiornata. Le correzioni editoriali delle schede Donn’Anna/Pintauro proposte nella ricerca precedente non sono applicate a fatti e testi in questo blocco.

## Verifiche e regressioni

- [Test](fonti-blocco-5-verifiche/test.log): **64/64**, compreso il caso delle Catacombe, originali/date/categorie del registro, PDF/ZIP, deduplicazione e ordine pratico dei documenti.
- [Build](fonti-blocco-5-verifiche/build.log) riuscita; **877 link interni su 12 pagine** [validi](fonti-blocco-5-verifiche/link.log). Il controllo dei link interni non dimostra la raggiungibilità dei documenti esterni.
- Regressione del trasferimento CSS riprodotta: padding interno 0 invece di 16 px e titolo dei gruppi in Barlow invece di Bodoni. [Prima](fonti-blocco-5-verifiche/stile-prima.log), [dopo](fonti-blocco-5-verifiche/stile-dopo.log). Correzioni circoscritte al pannello.
- Ritorno senza JavaScript riprodotto prima della correzione: il collegamento puntava al campo nascosto. [Prima](fonti-blocco-5-verifiche/ritorno-nojs-prima.log). Ora torna alla testata delle fonti; con JavaScript il comando porta al campo e gli assegna il focus.
- Rinvio ANM coperto dalla fascia di ricerca riprodotto e corretto con lo spazio di scorrimento misurato: [prima](fonti-blocco-5-verifiche/rinvio-prima.log), [dopo](fonti-blocco-5-verifiche/stile-dopo.log). Ordine della Cantinella riprodotto prima della correzione: [prima](fonti-blocco-5-verifiche/priorita-prima.log), [dopo](fonti-blocco-5-verifiche/priorita-dopo.log). Le priorità pratiche derivano dai riferimenti dichiarati a orari, prezzi, prenotazioni, viaggi, durate e metodo dei tempi; non dal dominio o dal titolo del documento. Gruppi D alfabetici, documenti pratici prima delle storie nello stesso gruppo.
- Ricerca «costo» al singolare per Sansevero riprodotta [prima](fonti-blocco-5-verifiche/costo-prima.log) e verificata [dopo](fonti-blocco-5-verifiche/costo-dopo.log): completati i termini nei metadati dei documenti con riferimenti a prezzi e descrizioni di biglietti/menu/tariffe, conservando la normalizzazione approvata. Il pannello indicizza titolo, editore, descrizione, luoghi e termini disponibili; le negazioni nelle cautele non diventano parole chiave di prezzi documentati.
- [UI](fonti-blocco-5-verifiche/ui.json): telefono/desktop, due temi, 320/375/390/768/1280 px, pannelli aperti/chiusi, ID, ricerca, tastiera, crediti e assenza di JavaScript. [Movimento](fonti-blocco-5-verifiche/movimento.json): campo stabile, filtro e reset, normale/ridotto nei due temi e a telefono/desktop.
- Il ritorno dall’originale usa una risposta HTML fittizia intercettata e un dato locale fittizio. Prova navigazione e conservazione dello stato della ricerca; non è una lettura dell’editore né una prova sui dati personali di Enrico. Nessuna richiesta agli editori nelle prove UI. Nessuna prova con lettori esterni o telefoni fisici dichiarata.

## Criteri non interamente superati

Le misure definitive sono nel [riepilogo Lighthouse](fonti-blocco-5-verifiche/lighthouse-riepilogo.json). Fonti e Dove mangiare raggiungono la soglia richiesta; **gli itinerari restano sotto 95**. L’integrazione non può essere dichiarata accettata con tutti i criteri superati.

| Pagina | Mobile chiaro | Mobile scuro | Accessibilità / buone pratiche |
|---|---:|---:|---:|
| Fonti | 98 | 99 | 100 / 100 |
| Itinerari | 92 | 92 | 100 / 100 |
| Dove mangiare | 95 | 95 | 100 / 100 |

La matrice finale comprende 80 combinazioni senza overflow e otto scansioni axe senza violazioni nei due temi. La revisione visiva delle immagini a telefono e desktop conferma la gerarchia e i caratteri delle proposte scelte. La riserva prestazionale rimane aperta nel Blocco 5; il commit salva il risultato locale e non equivale all’approvazione del blocco.

Nelle prove iniziali la console degli itinerari ha mostrato `Cannot read properties of undefined (reading 'id')`, già documentato in PROGRESS prima del blocco. La [prima misura del commit iniziale](fonti-blocco-5-verifiche/lighthouse-base-itinerari-light.json) riproduce lo stesso errore nello stesso script del compositore e ottiene performance 94, accessibilità 100, buone pratiche 96. Il [controllo successivo della stessa base](fonti-blocco-5-verifiche/lighthouse-base-itinerari-final-light.json) ottiene 84, buone pratiche 100 e nessun errore di console. Anche l’ultima matrice UI integrata ha console pulita. Il codice del compositore è invariato: non si dichiara corretto il problema, né si attribuisce con certezza la mancata riproduzione successiva al cambio di giorno o ad altre condizioni.

Le prime misure integrate degli itinerari sono 77–79, con un costo di rendering maggiore. Nelle prove successive si osserva variabilità, senza raggiungere stabilmente 95. Eliminati attributi di ricerca duplicati e rinviata l’indicizzazione al primo uso; conservate le prove intermedie, compresa l’anteprima compressa: la compressione da sola non risolve il problema. I tentativi con content-visibility e contenuto in noscript non hanno raggiunto la soglia e non sono mantenuti. Resta il pannello nativo completo; le cause della prestazione insufficiente e dell’eventuale regressione richiedono ancora isolamento. Non si dichiara risolta la prestazione degli itinerari.

## Conservazione

[Confronto con `c5a6fa7`](fonti-blocco-5-verifiche/conservazione.json): dati originali, testi/firme, itinerari, link condivisi, privacy, offline, configurazione, risorse e giri Fonti confrontati senza ripristini. È presente la discrepanza già documentata di `design/home/proposta-a.html`, modificato il 7 ottobre, senza diff Git rilevato: non attribuita al blocco, non corretta e non inclusa nel commit. Il controllo complessivo non è dichiarato interamente riuscito.

Le cartelle preesistenti non tracciate `design/compositore/` e `design/home-napoli/` sono conservate ed escluse dal commit. Nove documenti delle regate ancora esclusi; record interni, calendario e comportamento dell’evento intatti. Gli stili restano dentro le pagine costruite e il service worker continua a includere le risorse degli itinerari; nessuna modifica al suo codice o alla politica offline. Non si promette di aprire documenti esterni senza connessione.

## Anteprima e seguito

[Fonti](http://127.0.0.1:4322/fonti/) · [Pannello itinerari](http://127.0.0.1:4322/napoli/itinerari/#fonti-inizio) · [Dove mangiare](http://127.0.0.1:4322/napoli/dove-mangiare/#fonti-inizio) · [Crediti](http://127.0.0.1:4322/note-legali/#foto).

Commit locale del solo blocco, con riserve tecniche esplicite. Blocco 6 non avviato. Enrico valuta l’integrazione e decide il perimetro del seguito per prestazioni e problema del compositore. Bastano ambiente locale e strumenti già presenti; nessuna attività Vercel, push, merge o deploy autorizzata.
