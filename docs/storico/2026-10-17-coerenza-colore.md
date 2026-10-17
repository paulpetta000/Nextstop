# Coerenza del blu scuro · 17 ottobre 2026

Enrico ha precisato che la differenza da correggere riguarda il **tema scuro**. La prima versione locale `180f0ae` aveva esteso l'allineamento anche al chiaro; questa revisione ne ripristina tutti i blocchi dalla base precedente `5b259b1`. Nessun push, merge o deploy.

## Modifica finale

Solo gli accenti scuri di C Mappa sono allineati al blu già presente in D Pagine (`#8FB0F0`), comprese selezioni, focus, percorso e segni della mappa, pannelli, salvataggio, cammino, calendario e ora. La marcatura di tappa nuova ha una dichiarazione scura esplicita, così non eredita il pervinca chiaro. Il chiaro conserva la palette precedente: C pervinca e D blu. Non sono state verificate le viste aperte sui dispositivi di Enrico e non si attribuisce con certezza la sua osservazione a quelle impostazioni.

File: `src/styles/compositore.css`, `src/styles/ore.css`, `test/colori-compositore.test.mjs`, DESIGN e PROGRESS. Nessuna modifica a dati, calcoli, ID, URL, memoria, logica offline o dipendenze. Fondi, geometrie e marchio conservati.

## Verifiche della revisione

- Prima del ripristino il nuovo test di conservazione del chiaro falliva sull'accento `#1F4FA0` invece del precedente `#4B5DBE`.
- Dopo la modifica passano i quattro controlli: coerenza scura esplicita/automatica, conservazione della palette chiara e contrasto dei comandi principali almeno 4,5:1. Sono controlli sui valori dichiarati, non una simulazione completa della cascata o una verifica di ogni stato.
- Confronto di tutte le regole CSS con la base: **dieci blocchi scuri diversi, altri 1.421 blocchi identici**. Ogni differenza di dichiarazione riguarda il selettore di C scuro esplicito o automatico; chiaro e altri selettori invariati.
- **180/180 test locali**, zero falliti; build di **12 pagine in 12,17 s** con Node 24.21.0, telemetria disabilitata e `node --no-liftoff node_modules/astro/bin/astro.mjs build`; **13 HTML e 811 link validi**. Worker: 82 risorse, circa 5.800 kB, versione `32735b9bd490`.
- Nessun browser usato: mancano revisione visiva, nuove immagini, axe e Lighthouse. Non attribuire a questa correzione i punteggi del blocco prestazioni precedente. Anche il primo confronto di campioni in ricerca descrive la proposta iniziale, ora superata dalla precisazione.

Log `solo-scuro-prima.log`, `solo-scuro-test-finale.log`, `solo-scuro-build-finale.log` e `solo-scuro-link-finale.log` conservati nella ricerca locale. La prova precedente sui due temi resta nella storia del commit `180f0ae`. Prima di un'anteprima restano i controlli UI previsti; produzione richiede il consenso di Enrico.

Riferimento: [variabili CSS, MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties). Skill locali design-sito, frontend-design e modern-web-guidance; CLI non installato, fonti ufficiali consultate e nessuna dipendenza aggiunta.
