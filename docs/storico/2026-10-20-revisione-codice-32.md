# Revisione codice 32 · mappa in attesa e riepilogo della ripresa

20 ottobre 2026, base 2b57b36; sesto gruppo collegato.

## Risultato

Il test del foglio Aggiungi usava una mappa fittizia. Controllata quindi la classe reale: durante un caricamento lento conservava il primo disegno e poteva ripristinarne i punti dopo un cambio di ricerca. Ora le richieste in attesa mantengono gli ultimi punti, anche un insieme vuoto; l'inquadratura richiesta prima della base viene applicata al caricamento e segue i cambi successivi dei punti.

La mappa chiusa resta inattiva: timer cancellati, osservatore disconnesso, animazione fermata e catture dei puntatori rilasciate. Le risposte già richieste possono completare la memoria condivisa, ma non ridisegnano il vecchio contenitore o vi applicano pezzi. Il precaricamento per gli itinerari salvati resta riservato a una mappa attiva.

Se un aggiornamento sostituisce la lista trascinata, il fotogramma successivo annulla il gesto, libera ascoltatori e ferma lo scorrimento. La compattazione e la fluidità sul telefono restano da verificare.

## Prove del gruppo

- Sette regressioni iniziali sulla classe reale della mappa, poi cattura ancora attiva alla chiusura e lista rimossa durante il gesto; tutte fallite prima della propria correzione. Due verifiche aggiunte sulle varianti di inquadratura differita: **11 prove nuove** nel gruppo.
- Costruttore e metodi reali con documenti, geometrie e promesse controllati; nessun browser, rete o dato utente. Non dimostrano resa nativa dei gesti, animazioni, focus o lettori di schermo.
- **496/496 test**, zero fallimenti, salti o cancellazioni; build di **12 pagine**, **13 documenti / 811 link interni validi**, **82 risorse offline** tutte presenti, worker **df0536ce078c**. Sette file JavaScript destinati al browser senza import riservati a Node/hash/validazione della build.
- Dati sorgente, file pubblici, CSS, dipendenze, workflow e istruzioni Claude identici alla base c36b0c7; nessuna rigenerazione dei dati.
- Log nella cartella della chat: nextstop-mappa-attesa-{test,build,links}-2026-10-20.log e nextstop-controlli-finali-2026-10-20.log.

## Sei gruppi della ripresa

| Gruppo | Risultato | Test |
|---|---|---|
| [27](2026-10-20-revisione-codice-27.md) | Limiti dello scorrimento, pannello e annullamento del trascinamento | 460 |
| [28](2026-10-20-revisione-codice-28.md) | Testo/filtri condivisi fra elenco e mappa, minuti e richiami del foglio | 470 |
| [29](2026-10-20-revisione-codice-29.md) | Evidenziazione nel nome breve corretto; 947 ricerche confrontate | 472 |
| [30](2026-10-20-revisione-codice-30.md) | Risparmio effettivo del riordino; 540 combinazioni con dati pubblici | 482 |
| [31](2026-10-20-revisione-codice-31.md) | Recupero dell'indice incompleto e data degli eventi indipendente dal fuso | 485 |
| Questo | Ultime richieste della mappa, chiusura e gesti su contenuti sostituiti | 496 |

Da **451 a 496 prove: 45 aggiunte**, con controlli comuni alla fine di ciascun gruppo. I confronti pubblici avvengono solo in memoria e non certificano aperture o puntualità reali.

## Mandato, limiti e seguito

Ripresa operativa del 20 ottobre alle **11:54:32 UTC**, dopo l'interruzione della chat del 18 ottobre. Il tempo dell'interruzione e delle attese non viene contato come lavoro. Enrico ha ribadito alle **12:00:35 UTC** un minimo di **40 minuti da quella richiesta**, senza nuovi OK fra i gruppi. Il seguito sugli orari e la chiusura della ripresa sono nel [resoconto 33](2026-10-20-revisione-codice-33.md), con i controlli finali successivi.

Area 3 ancora aperta: seguito sui comandi dei fogli/orari, schede e altri moduli non ancora coperti; nessuna percentuale di audit completo dedotta dal numero di test. Interfaccia nativa e fluidità del trascinamento, focus, GPS sul telefono e controlli visivi restano pendenti finché il browser è escluso. La riga storica sullo scorrimento è corretta nel codice locale, con verifica nativa pendente; la riga sulla compattazione resta aperta.

Nessuna pubblicazione, installazione, delega, automazione o modifica alle protezioni. Tutti i gruppi sono locali, successivi alla base pubblicata 96e480d. Le altre sette aree del piano mantengono il proprio stato; Search Console richiede esportazioni scelte da Enrico, prove Claude separate dopo pubblicazione e mandato. La nuova idea su altre città e registro degli aggiornamenti resta rinviata anche nell'analisi.
