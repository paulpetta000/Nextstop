# Controllo fonti · procedura breve per Codex e Claude

Leggere questo file, poi **solo le schede del compito**. Non aprire ricorsivamente rapporti, cataloghi o tutti i JSON. Comandi dalla radice del repository; Node già richiesto dal progetto, nessun pacchetto aggiuntivo. Lo strumento legge file locali, non accede a siti e non modifica dati.

```sh
node aggiornamenti/leggi.mjs cerca "Floridiana"
node aggiornamenti/leggi.mjs voce tappa-floridiana
node aggiornamenti/leggi.mjs canale accessi-estesi-floridiana
node aggiornamenti/leggi.mjs fonte tp-mic-floridiana
```

1. **Scegliere.** “Controlla” produce un rapporto; applicare dati solo se richiesto “aggiorna”. Ramo autorizzato, niente main/produzione impliciti. `scadenze 2026-10-19 trasporto` seleziona gli ID dovuti; la prima verifica è ancora completa da fare per tutte le 106 voci.
2. **Leggere.** `voce <id>` restituisce la scheda; `canale <id…>` e `pubblicazione <id…>` risolvono i rimandi. `fonte <id…>` e `fatto <id…>` leggono i blocchi correnti in `src/data`, senza duplicarli. `aperte`/`caso <id>` servono per le domande a Enrico. [Manifesto](controlli-periodici.yaml).
3. **Cercare novità.** Aprire fonte e indici del gestore; cercare anche nuove pagine, PDF, rettifiche, revoche e ripristini. Query prima senza anno, poi anno corrente/successivo e sede/linea corretta. Vecchio URL invariato e risultati di ricerca non bastano. Un'apertura non conferma validità o orari.
4. **Confrontare.** Distinguere pubblicazione/revisione, decorrenza/fine, sedi, componenti, feriali/festivi e attraversamento di mezzanotte (Europe/Rome). Conservare ordinario, futuro ed eccezioni separati; non anticipare un cambio o presumere una riapertura. Contrasti e date ignote restano espliciti.
5. **Documentare.** Usare [modello](rapporti/MODELLO.yaml), con sole prove pertinenti e link; distinguere accesso, lettura e confronto. I rapporti vecchi sono evidenze storiche, non lavoro corrente. Un tentativo fallito non rinnova date: annotare il limite e ritentare entro tre giorni, prima se necessario. Problemi personali: aggiornare scheda del caso e `da-verificare/indice.json`, senza duplicare la domanda.
6. **Concludere.** `ultimo_controllo_completo` cambia solo dopo tutti i campi e la ricerca delle novità; scadenza minima tra frequenza 7/14 giorni e anticipi di tre giorni di cambi/scadenze. Con sole modifiche documentali verificare riferimenti, JSON/YAML e conservazione; con dati/codice applicativi seguire i controlli del progetto. Aggiornare `PROGRESS.md`. Nessun automatismo attivato.

Per i dettagli leggere **solo la sezione utile** della guida conservata: `node aggiornamenti/leggi.mjs guida "4."` per i trasporti, `guida "2."` per la ricerca delle novità, `guida "3."` per validità e sedi, `guida "5."` per rapporto/aggiornamento. [Guida completa](riferimenti/procedura-completa.md) solo quando serve.

Lo stato corrente dei casi è in [da-verificare](../da-verificare/fonti-orari.md). I [metadati](metadati.json) indicano il rapporto corrente e quelli superati. Le valutazioni Google/Tripadvisor/TheFork hanno una [proposta separata](../specifiche/valutazioni-esterne.md), **non approvata per implementazione**: non appartengono al controllo ordinario degli orari.
