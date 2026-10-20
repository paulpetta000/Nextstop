# Revisione codice 33 · selettore delle ore e riepilogo finale

20 ottobre 2026, base 06d403b; settimo gruppo collegato della ripresa.

## Risultato

Tutte le ore tentava di leggere oltre da un giorno non calcolato: il giorno vuoto e quello di gita causavano un arresto prima dell'apertura. Ora il selettore usa uno stato senza tappe, già previsto dalle funzioni pure e dal testo del riepilogo, e permette di scegliere gli orari senza inventare una fine delle visite.

Le frecce usavano i limiti complessivi 5:00–23:45 anche se la modalità disabilitava le ore prima delle 6:00 o dopo le 20:00. Un'ora disabilitata poteva ricevere tabindex=0, lasciando la griglia senza ingresso abilitato. La navigazione ora rispetta i limiti della modalità Inizio/Fine, comprese frecce, Home/End e PageUp/PageDown.

## Prove e incidente del controllo

- Tre regressioni riprodotte prima della correzione: giorno vuoto, gita e limite da tastiera; una prova conserva il riepilogo del giorno calcolato. Quattro nuove prove, funzione di rendering e comandi reali con nodi fittizi; nessun browser.
- Primo controllo completo interrotto nel processo di condividi-recupero.test.mjs: errore interno di Node/Amaro WebAssembly, Invalid opcode 0xec. Il file non era modificato; controllo mirato riuscito, poi suite completa ripetuta riuscita. La causa dell'errore interno non è determinata e non si dichiara corretta da queste modifiche. Log conservato: nextstop-ore-test-primo-tentativo-2026-10-20.log.
- Controllo finale: **500/500 test**, zero fallimenti, salti o cancellazioni; build di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline** tutte presenti, worker **558376ce01ac**. Sette file JavaScript del browser senza import di Node/hash/validazione di build.
- Log nella cartella della chat: nextstop-ore-{test,build,links,offline}-2026-10-20.log. Nessuna modifica eseguibile dopo questi controlli; gli aggiornamenti successivi del riepilogo sono documentali.

## Sette gruppi e confronti

| Gruppo | Risultato | Test |
|---|---|---|
| [27](2026-10-20-revisione-codice-27.md) | Limiti dello scorrimento, pannello e annullamento del trascinamento | 460 |
| [28](2026-10-20-revisione-codice-28.md) | Ricerca e filtri condivisi fra elenco e mappa, minuti e richiami del foglio | 470 |
| [29](2026-10-20-revisione-codice-29.md) | Evidenziazione nel nome breve corretto | 472 |
| [30](2026-10-20-revisione-codice-30.md) | Risparmio effettivo del riordino con pause, margini e contesto dal vivo | 482 |
| [31](2026-10-20-revisione-codice-31.md) | Recupero dell'indice e data degli eventi indipendente dal fuso | 485 |
| [32](2026-10-20-revisione-codice-32.md) | Ultime richieste della mappa, chiusura e gesti su contenuti sostituiti | 496 |
| Questo | Selettore delle ore senza calcolo e navigazione ai limiti | 500 |

Da **451 a 500 prove: 49 aggiunte**. Confronto della ricerca su **947 query / 92 luoghi / 5.308 riscontri**, stesso ordine e stessi punteggi; sei riscontri nel nome breve. Confronto del riordino su **540 combinazioni** con dati pubblici, risparmi contestuali coerenti e comportamento di base invariato. Dati usati solo in memoria; nessuna rete nei test o nei confronti.

## Mandato e stato del piano

Ripresa operativa il **20 ottobre alle 11:54:32 UTC**. La pausa della chat dal 18 ottobre non conta come lavoro. Enrico ha ribadito alle **12:00:35 UTC** almeno **40 minuti da quella richiesta**, continuando fra gruppi collegati senza nuovi OK. Chiusura e durata da annotare dopo il riallineamento del piano.

Area 3 ancora aperta: seguito sui comandi asincroni dei fogli, schede e altri moduli non ancora coperti. Numero di test e build riuscita non equivalgono ad audit completo. Prove native di gesti, compattazione, focus, lettori di schermo e GPS sul telefono restano pendenti finché il browser è escluso. Righe storiche del trascinamento conservate: scorrimento corretto nel codice, prova nativa pendente; compattazione ancora aperta.

Le altre sette aree del piano originale conservano il loro stato: istruzioni/consumi solo audit statico; dati e fonti con verifiche editoriali pendenti; Search Console solo da esportazioni scelte da Enrico; interfaccia da verificare visivamente; manutenzione/CI della versione locale da eseguire al rilascio; organizzazione senza cancellazioni; valore del prodotto ancora da confrontare su casi validati.

Nessun dato sorgente, ID, URL, CSS, dipendenza, file pubblico, workflow, istruzione Claude o materiale privato modificato rispetto alla base della ripresa. Nessuna installazione, delega, automazione, modifica alle protezioni, pubblicazione o rigenerazione. Tutto locale dopo main pubblicata 96e480d. La nuova idea su procedura per altre città e registro degli aggiornamenti resta rinviata anche nell'analisi; prova empirica Claude separata e non avviata.
