# Fonti in fondo alla pagina · quattro proposte

Blocco 3 autorizzato da Enrico il 12/10/2026, dopo l’approvazione della [bozza dei testi](../../../ricerca/2026-10-12-fonti-testi-bozza.md). Ramo `codex/fonti-specifica`, continuato da `997b240`. Prototipi autonomi in HTML/CSS; nessuna integrazione in Astro e nessuna progettazione della pagina generale `/fonti/`.

Apri la [galleria](index.html), il [confronto delle quattro aperture](confronto.html) oppure l’[anteprima locale](http://127.0.0.1:4343/design/fonti/giro-1/index.html). Le immagini sono in [verifiche](verifiche/).

## Le alternative

| Proposta | Struttura | Vantaggio e compromesso |
|---|---|---|
| [A · Margine di rivista](a.html) | Lista per argomento, luogo nel margine su desktop | Chiusura discreta e leggibile. Per trovare un singolo luogo in una lista lunga occorre più scorrimento. |
| [B · Indice dei luoghi](b.html) | Indice a sinistra e documenti per luogo; indice compatto sopra sul telefono | **Consigliata:** utile per le molte tappe degli itinerari. L’indice ha una propria area scorrevole quando non entra. |
| [C · Dall’informazione alla prova](c.html) | Informazione e documento in due colonne; lettura verticale sul telefono | Mette in primo piano cosa documenta la fonte. Richiede etichette editoriali precise; i titoli lunghi aumentano l’altezza delle righe. |
| [D · Quaderno di viaggio](d.html) | Un foglio per luogo, due colonne su desktop | Più spazio a luoghi, documenti e limiti. Nei casi lunghi è la proposta che occupa più pagina. |

La direzione viene da [DESIGN.md](../../../DESIGN.md): carta, pietra, notte e tufo; Archivo per testo e controlli, Bodoni Moda per i titoli; spazi su ritmo di 4/8 px. Una sola gerarchia editoriale, senza foto, loghi degli editori o decorazioni nuove. Il pezzo progettato è la chiusura di una pagina pubblica di itinerari; la galleria è solo lo strumento di confronto locale.

## Cosa puoi provare

Ogni proposta ha quattro casi, raggiungibili dai collegamenti sopra il bozzetto:

- **12 esempi reali:** PDF, ZIP, titoli lunghi, fonti condivise, anni storici, documento non letto integralmente e riapertura ancora da verificare.
- **180 fonti:** tutti i documenti del footer attuale degli itinerari, una volta ciascuno, con date originali. Le associazioni sono dichiarate dai file del progetto e restano da verificare editorialmente; il bozzetto non le promuove a prove lette.
- **Una fonte:** un solo documento, senza indice superfluo.
- **Nessuna fonte:** nessun pannello; gli avvisi della pagina restano visibili.

All’apertura ordinaria il pannello è chiuso. `details/summary` funziona anche senza JavaScript. Nel pannello aperto il titolo porta direttamente all’URL originale: niente secondo pannello per ogni documento, anteprima remota o nuova scheda forzata. L’indice porta a gruppi già visibili; i frammenti diretti sono stati provati in Chrome e rivelano il gruppo dentro il pannello. `#segno` è fuori dal pannello; gli asterischi non sono collegamenti.

I comandi di tema appartengono allo strumento di confronto. Senza JavaScript vale il tema del sistema; il blocco e i collegamenti continuano a funzionare. Il tema non viene salvato, non si registrano statistiche, non si modifica la memoria del compositore. Per consultare documenti esterni serve una connessione.

## Provenienza dei contenuti

- [esempi.mjs](esempi.mjs) cita le prove E1/E2, D2, S1, G2/G4, R1–R4 delle [verifiche prioritarie](../../../ricerca/2026-10-12-fonti-verifiche-prioritarie.md). Le date del 12 ottobre sono le letture documentate nel Blocco 2, distinte da lettura parziale e tentativi falliti. Le date del registro non vengono aggiornate.
- ANM usa il record `anm-gtfs` di [fonti-dati.yaml](../../../aggiornamenti/fonti-dati.yaml), con controllo registrato il 3 ottobre e licenza IODL 2.0. Le Catacombe usano la relazione `durataFonte` già dichiarata nella tappa, con controllo registrato il 2 ottobre; nessuna nuova lettura della durata.
- Il PDF EAV usa il collegamento di download realmente restituito dalla pagina originale durante questa sessione. Il parametro di download va rivalidato nell’integrazione: il bozzetto non cambia l’URL canonico nel registro del sito.
- Alcuni documenti/URL più precisi erano proposte del Blocco 2: esistono solo nella fixture. Gli ID `bozza-*` non sono nuovi ID di produzione.
- [fixture-lungo.json](fixture-lungo.json) è generato dai soli 180 URL dell’HTML costruito e dai riferimenti YAML pertinenti. Non è stato riletto il grande inventario storico JSON. Per una fonte condivisa, il gruppo canonico compare una volta; gli altri luoghi sono elencati nella nota. Gli alias dell’indice e le etichette definitive saranno lavoro dell’integrazione.
- Il selettore esistente mantiene esclusi i nove documenti delle regate. Il registro pubblico resta di 195 fonti; non sono stati cambiati evento, schede, firme, dati, URL del sito, privacy, offline o licenze.

## Riproduzione locale

Nessuna dipendenza nuova. Si riusano Node portatile, `js-yaml` e `sharp` del progetto; per i controlli, Chrome, `puppeteer-core`, axe e Lighthouse già autorizzati in `tools/controlli`.

```powershell
$env:PATH = 'C:\Users\Windows11\tools\node-v24.21.0-win-x64;' + $env:PATH
node design/fonti/giro-1/genera.mjs
node design/fonti/giro-1/serve.mjs
```

Il generatore richiede la build locale già presente, per estrarre il caso lungo. Scrive soltanto in questa cartella. Il server è di sola lettura su `127.0.0.1:4343`: prototipi, caratteri esistenti e `dist/`; non espone `.git`, `.env` o file personali. Il collegamento al metodo `/fonti/` apre la pagina attuale del sito costruito, senza un nuovo design della pagina generale.

In un secondo terminale:

```powershell
node design/fonti/giro-1/verifica.mjs
node design/fonti/giro-1/lighthouse.mjs
node design/fonti/giro-1/fotografa.mjs
node design/fonti/giro-1/genera.mjs --verifica-base
```

Chrome usa profili temporanei. Lighthouse ha sempre `--no-enable-error-reporting`. L’uscita al documento e il ritorno sono provati con una risposta esterna intercettata e uno stato locale fittizio: questa prova controlla la navigazione, non la raggiungibilità di tutti gli editori o i dati salvati da Enrico.

## Esiti e limiti

Esiti completi nel [resoconto del blocco](../../../docs/storico/2026-10-12-fonti-blocco-3.md), [QA](verifiche/risultati.json), [misure finali](verifiche/note-finali.json), [Lighthouse](verifiche/lighthouse-riepilogo.json) e [conservazione](verifiche/conservazione.json).

I controlli del sito non validano gli URL esterni. Le associazioni incomplete sono visibili, senza date o conferme inventate. La copertura della durata delle Catacombe è mostrata nel campione, ma il bug del footer del sito resta da riprodurre e correggere nel Blocco 5. Nessuna scelta fra le proposte costituisce consenso all’integrazione o al rilascio.

Riferimenti web consultati per il pattern nativo: [details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details), [summary](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary), [movimento ridotto](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion). `modern-web-guidance` non è stato eseguito con `npx`, per rispettare il divieto di scaricare/installare codice.
