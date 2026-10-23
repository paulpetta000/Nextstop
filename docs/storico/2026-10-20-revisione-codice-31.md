# Revisione codice 31 · recupero della ricerca e date degli eventi

20 ottobre 2026, base 3c9af0b; quinto gruppo collegato.

## Risultato

Dopo un errore iniziale nel caricamento delle schede, la ricerca costruiva un indice senza testi e lo conservava anche dopo il recupero. Ora registra se le schede sono complete e ricostruisce l'indice quando quella condizione cambia. I nomi restano ricercabili durante l'attesa; alla successiva interazione si trovano anche i testi recuperati. Nessun riavvio della pagina necessario, nessun nuovo caricamento o ciclo automatico.

Il calendario degli eventi convertiva la data scelta attraverso mezzogiorno nel fuso locale: oltre UTC+12 diventava il giorno prima. Ora usa dataDi(g), già condivisa con il motore per sommare i giorni in UTC. Nessuna data o fonte editoriale modificata.

## Prove

- Tre regressioni inizialmente fallite: recupero nella stessa apertura, recupero con riapertura e data dell'evento in UTC, Europe/Rome e Pacific/Kiritimati con giorno 0 e giorno 3. Il fuso del processo di prova viene ripristinato; nessuna impostazione del computer modificata.
- Modulo reale con contenitori fittizi, ricerca e funzioni di data reali; nessun browser o rete.
- **485/485 test**, zero fallimenti, salti o cancellazioni; build di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **cab25a2a58db**.
- Log nella cartella della chat: nextstop-ricerca-recupero-{test,build,links}-2026-10-20.log.

## Limiti e seguito

Il contenuto si aggiorna alla successiva interazione; non si introduce un ridisegno automatico del foglio mentre viene usato. Recupero visivo e annunci nativi restano da verificare senza browser. Nessun CSS, dato sorgente, ID, URL, dipendenza o file pubblico modificato. Nessuna pubblicazione, installazione, delega o automazione.

Prosegue il minimo di 40 minuti dalle 12:00:35 UTC: seguito sul caricamento ritardato della mappa reale e sulla chiusura dei gesti. Area 3 aperta; altre sette aree e nuova idea rinviata conservano lo stato precedente.
