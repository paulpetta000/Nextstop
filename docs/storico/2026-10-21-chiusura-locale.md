# Nextstop · chiusura della revisione locale del 21 ottobre

Ripresa dalle **12:29:23 UTC**, su richiesta di oltre una ora di lavoro attivo. Codice verificato **e8d10f8**, ramo locale codex/salvataggi-coordinati-2026-10-18. **756/756 test**, nessun fallimento, salto o cancellazione; **33 prove aggiunte da 723**. Build ordinaria **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker **301533107c94**. Sette casi sui dati reali riusciti; cinque JSON generati e 18 matrici di sei scenari corrispondono ai sorgenti. Nessun push, merge o deploy.

## Perimetro finale: esiti

| Blocco | Esito |
|---|---|
| C1 · Tastiera differita | Concluso localmente: ritorni legati al comando e al contesto attuali, 21 prove nuove. [Revisione 53](2026-10-21-revisione-53.md), bdca60a |
| C2 · Caricamenti e mappa | Concluso localmente: rimozione degli eventi della mappa chiusa e richiami ritirati inerti; riletti i caricamenti già protetti, 12 prove nuove. [Revisione 55](2026-10-21-revisione-55.md), e8d10f8 |
| D1 · Quindici riscontri | Esaminati tutti: 11 fatti storici verificati e 4 parziali conservati; avvisi 15 → 4, fonti 196 → 203. [Revisione 54](2026-10-21-revisione-54.md), c3b7210 |
| M1 · Alterazione della build | Diagnosi eseguita: sei sonde grandi e verifica degli stadi Astro riuscite; discrepanza fra due riscontri di un artefatto isolata. Causa ancora aperta. [Revisione 56](2026-10-21-revisione-56.md) |
| M2 · Integrazione e tipi | Confronto eseguito: input applicativi del main remoto identici alla base locale; integrazione non effettuata, strumenti del controllo tipi assenti. [Prove](2026-10-21-remoto-chiusura-56.json) |
| F1 · Controlli conclusivi | Suite e build ordinarie riuscite; casi reali, dati pubblicabili, HTTP, integrità Git e prove archiviate controllati. 12 documenti senza byte NUL e 170 rimandi locali esistenti; 169 delle 170 impronte concordi, una discrepanza conservata e dichiarata |

[Elenco finale e criteri](2026-10-21-chiusura-revisione.md). Due gruppi di correzioni al codice, un gruppo editoriale e una diagnosi; non si usa il numero di test come percentuale del prodotto. Non sono state aggiunte funzionalità o nuove scelte grafiche. Nel perimetro C1/C2 non restano gruppi rinviati genericamente come moduli residui: restano le verifiche separate elencate sotto.

## Gli otto punti del piano

| Area | Risultato corrente | Cosa resta aperto |
|---|---|---|
| 1 · Istruzioni e consumo Claude | Esclusa interamente | Riprendere solo su futura richiesta esplicita |
| 2 · Dati e fonti | Undici nuovi fatti storici verificati; 203 fonti pubbliche, testi dei locali invariati, dieci firme dipendenti aggiornate | Quattro riscontri editoriali parziali; precedente avviso di fonte debole per tp-donnanna-orari; aperture future e feed ANM oltre il 31/12/2026 |
| 3 · Codice | C1/C2 conclusi localmente, 756 test e controlli comuni riusciti | Nessuna assenza universale di difetti dichiarata; verifica della versione integrata e dei comportamenti nativi |
| 4 · Google e traffico | Nove pagine pubbliche 200 con canonical coerenti, file Google 200, 404 con noindex e robots/sitemap raggiungibili | Search Console da esportazioni scelte da Enrico. Nessun ranking o traffico dedotto da HTTP. La sitemap pubblica conserva nove lastmod precedenti; rimozione locale ancora da pubblicare |
| 5 · Interfaccia | Corrette logiche del fuoco e del ciclo della mappa; CSS, colori, icone, posizionamenti, pagine e specifiche invariati | Browser escluso: resa, tastiera/fuoco/tocchi nativi, GPS, temi e uso offline non provati |
| 6 · Manutenzione | Main b6d2a36 ricontrollato oggi, CI riuscita su quel main; undici alberi/blob applicativi identici alla base 96e480d; git fsck riuscito | Causa della anomalia di integrità ancora aperta, controllo tipi completo assente, integrazione e CI sul risultato integrato non eseguite |
| 7 · Organizzazione | Piano, indici e risultati riallineati; 170 prove inventariate: 169 impronte concordi, una discrepanza conservata; stash intatto | Materiali remoti non integrati; inventario dei file del confronto GitHub limitato a 300. Nessuna cancellazione o archiviazione irreversibile |
| 8 · Valore del prodotto | Sette casi sui dati pubblici attuali ripetuti con esito positivo | Nessuna prova di usabilità con altre persone o confronto con assistenti esterni; il pronto con data può contenere chiusure e gli avvisi non rendono da soli utilizzabile il percorso |

La nuova idea per più città e il registro degli aggiornamenti restano rinviati **anche nella analisi e nella stesura**.

## Quattro riscontri editoriali conservati

Da Michele: originale Michelin 2025 ancora da reperire. 50 Kalo: quinto posto Italia 2026 verificato, citazione Michelin 2025 ancora aperta. Poppella rinomato: originale 2022 trovato, ma senza il passaggio sulla notorietà estera. Petrucci Posillipo: terzo posto verificato, data della presentazione e sede del riconoscimento non risolte dal solo testo ufficiale attuale. [Esiti puntuali](2026-10-21-fonti-esiti-54.json). Una lettura parziale resta dichiarata tale; nessun dato futuro confermato per far scendere un conteggio.

## Prove e limiti della diagnosi

[Manifesto della chiusura](2026-10-21-prove-chiusura-manifest.json): **170 file**, 73.148.642 byte nella cartella della chat; il manifesto precedente di 125 file resta intatto. Al riscontro finale 169 impronte su 170 concordano; una differenza è dichiarata sotto. [Sette casi reali](2026-10-21-casi-prodotto-chiusura.json), [confronto dei dati generati](2026-10-21-dati-pubblicati-chiusura.json), [HTTP pubblici](2026-10-21-http-chiusura.json), [diagnosi degli stadi e degli artefatti](2026-10-21-diagnosi-chiusura-56.json).

La build finale ordinaria è successiva alle sonde; i dati generati corrispondono ai sorgenti. Ciò non dimostra risolta la intermittenza. Nel controllo precedente le 125 prove erano risultate coerenti; al controllo finale una differisce, come precisato sotto. La differenza già isolata del bundle riguarda il primo rilievo diagnostico 1902d14f… rispetto al riscontro c313ef28… già registrato nel manifesto. Copia attuale e ricostruzione distinta conservate, nessun file sostituito. Ulteriori attribuzioni a Vite, disco o RAM richiedono una causa riprodotta.

Log finali: nextstop-mappa-ascolti-test-2026-10-21.log (756 test), nextstop-chiusura-build-2026-10-21.log e nextstop-chiusura-links-2026-10-21.log. La presenza di tutte le 82 risorse non prova la installazione offline nel browser. CI remota su b6d2a36 non equivale a CI sul ramo locale. Nessuna installazione, rigenerazione cartografica/GTFS, modifica a protezioni, delega, automazione o contatto. Stash b0a35c1123918d9a1867c104a0ff793e5822dc80 conservato.

Controllo finale degli input: **257 file testuali**, 11.682.352 byte, corrispondono agli oggetti Git dopo la normalizzazione CRLF/LF; nessun byte NUL. CSS, componenti, pagine, asset pubblici, specifiche e design non hanno differenze nella ripresa. Il controllo misura il riscontro attuale, non la stabilità futura della macchina.

## Riscontro finale delle prove

Il controllo finale ha trovato una ulteriore differenza in sonda-astro-2026-10-21/memoria.mjs: 9.914.962 byte invariati, impronta archiviata ae03336e… e attuale d465a227…. Tre riletture Node e Get-FileHash concordano sul valore attuale; una copia distinta è conservata. Il valore coincide con quello della sonda Astro riuscita, ma non prova quando o perché sia variato il file. Manifesti e file originario non sono stati sostituiti per ottenere un esito verde. [Riscontro puntuale](2026-10-21-prove-discrepanza-finale.json). Rimangono 169 prove concordi su 170; fra le 125 precedenti, 124 concordi e una differente. La causa dell’anomalia resta aperta.

Durata minima verificabile: **60 minuti e 10 secondi di lavoro complessivo**, nelle finestre 12:29:23–13:28:41 UTC e 17:59:16–18:00:08 UTC. L’intervallo fra le due finestre è escluso dal conteggio; non si dichiara lavoro ininterrotto durante la pausa.
