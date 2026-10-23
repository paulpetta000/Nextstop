# Revisione codice 34 · ciclo della finestra condivisa

20 ottobre 2026, base 7943bb2. Primo gruppo della seconda ripresa, iniziata alle 14:06:49 UTC con mandato di almeno 40 minuti.

La fine di una chiusura animata poteva chiudere il contenuto riaperto nel medesimo dialog. Ogni apertura ora ha una generazione: una vecchia chiusura non tocca la nuova. Due richieste concorrenti producono una sola chiusura/pulizia; il comando restituisce un esito booleano utilizzabile dai chiamanti. La chiusura nativa ripulisce risorse senza colpire un foglio già riaperto. La chiusura trascinando la testa usa lo stesso percorso comune.

Il nuovo contestoFoglio restituisce un controllo dell'apertura corrente: distingue lo stesso elemento riutilizzato e diventa invalido quando parte la chiusura. Verrà usato nel gruppo successivo per i caricamenti tardivi. Nessun campo di viaggio o memoria aggiunto.

Sei prove nuove sulla funzione reale, con dialog, eventi e timer fittizi. Riprodotti riapertura durante l'animazione, doppia chiusura, contesto mancante e pulizia nativa; verificati anche evento close già in coda e chiusura senza animazione. **506/506 test**, zero fallimenti, salti o cancellazioni; build **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **7040a9aa45bd**. Log nella cartella della chat: nextstop-foglio-ciclo-{test,build,links}-2026-10-20.log.

Nessun browser: focus, animazioni e comportamento nativo non dimostrati dai nodi fittizi. Dati, ID, URL, CSS, dipendenze e materiali privati invariati. Nessuna installazione, pubblicazione, delega o automazione. Area 3 aperta; altre sette aree conservate e nuova idea rinviata anche nell'analisi. Il mandato temporale prosegue sui caricamenti dei selettori e delle schede.
