# Revisione codice 29 · nomi brevi

20 ottobre 2026, base 8cfd5b1; terzo gruppo collegato.

## Risultato

Il motore confronta nome completo e nome breve; il risultato conservava solo gli indici delle parole. Il rendering li applicava sempre al nome completo. Per MANN veniva marcato Museo; per Parco Ventaglieri poteva essere marcato dei.

Ora il riscontro specifica quando deriva dal nome breve e il rendering usa quel testo. Il nome completo rimane nei dati e nella scheda; nessuna modifica editoriale o agli identificatori. Ranking, soglie, filtri e confronto delle parole restano identici.

## Prove

- Due regressioni fallite prima della correzione: provenienza degli indici e rendering del risultato MANN. Moduli reali, contenitore fittizio e nessun browser.
- Confronto completo su un corpus di **947 ricerche**, composto da nomi, nomi brevi, zone, prime frasi, sinonimi, prefissi e scambi di lettere dei **92 luoghi pubblici**: **5.308 riscontri**, stessi risultati, punteggi, posizioni e gruppi. Sei riscontri provengono dal nome breve. Solo il nuovo campo esplicito differisce; nessun dato scritto. Confronto Node locale circa 3,8 secondi, non misura prestazioni sul telefono.
- **472/472 test**, zero fallimenti, salti o cancellazioni; build di **12 pagine**, **13 documenti / 811 link interni validi**, **82 risorse offline**, worker **fb314c4cab0d**.
- Log nella cartella della chat: nextstop-nomi-ricerca-{test,build,links}-2026-10-20.log e nextstop-nomi-ricerca-confronto-2026-10-20.log.

## Limiti e seguito

Aspetto e uso nativo dei risultati da verificare quando sarà autorizzato il browser. Nessun CSS, dato sorgente, URL, ID, dipendenza o file pubblico modificato. Nessuna pubblicazione, installazione, delega o automazione.

Continua il minimo di 40 minuti dalle 12:00:35 UTC richiesto da Enrico, ora sulla coerenza del risparmio dichiarato dal riordino con pause, margini e contesto dal vivo. Area 3 aperta; altre sette aree e nuova idea rinviata conservano lo stato precedente.
