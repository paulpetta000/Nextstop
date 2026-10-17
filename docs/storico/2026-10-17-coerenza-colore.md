# Coerenza del blu del compositore · 17 ottobre 2026

Richiesta di Enrico: controllare e correggere il blu percepito come più violaceo sul telefono rispetto al computer. Base del lavoro `5b259b1`, sopra la PR #5; questo blocco rimane locale, senza push, merge o deploy.

## Causa identificata nei file e correzione

Le viste C «Mappa» e D «Pagine» dichiaravano palette differenti: accento chiaro rispettivamente `#4B5DBE` e `#1F4FA0`, scuro `#8C9BEA` e `#8FB0F0`. La vista viene ricordata separatamente dal tema nella chiave `compositore-vista`; i valori della palette sono associati alla vista, non a una regola CSS che distingua telefono e computer. Non è stato verificato quale vista fosse aperta sui due dispositivi di Enrico: la differenza osservata nel codice spiega una possibile causa, non dimostra la configurazione dei suoi dispositivi.

Come riferimento si mantiene il blu già presente in D. Nei blocchi di C sono allineati accenti di azioni, selezione e focus, tracciato e segni della mappa, pannelli, salvataggio, cammino, calendario e selettore dell'ora. Sono 38 dichiarazioni in `src/styles/compositore.css` e tre in `src/styles/ore.css`. Restano i fondi, l'impaginazione, la distinzione tra le due viste e i colori del marchio. Nessun cambiamento a dati, calcoli, ID, URL, memoria locale, dipendenze o logica offline.

## Prove reali e limiti

- Prima della correzione, `test/colori-compositore.test.mjs` fallisce nei tre casi di coerenza della palette (chiaro, scuro esplicito, scuro automatico). Il contrasto principale passa già prima.
- Dopo la correzione passano tutti i quattro casi. Sono controlli sui ruoli CSS dichiarati e sul rapporto numerico del contrasto tra accento e relativo testo (almeno 4,5:1), non una simulazione completa della cascata CSS o una verifica di ogni stato visivo.
- Suite completa locale: **180/180 test superati**, zero falliti, 11,48 secondi.
- Build locale riuscita con Node 24.21.0, telemetria disabilitata e `node --no-liftoff node_modules/astro/bin/astro.mjs build`: **12 pagine, 23,43 secondi**. Worker: **82 risorse**, circa 5.800 kB, versione `b2ec13ad68fd`.
- **13 HTML, 811 link interni**, nessun link rotto. `git diff --check` senza errori.
- **Nessun browser usato per questo blocco dopo la richiesta di Enrico di escluderlo.** Non eseguiti nuove immagini delle pagine, axe o Lighthouse; non dichiarare verificata visivamente la correzione né attribuirle i punteggi Lighthouse del blocco prestazioni precedente. La CI remota della PR rimane riferita al codice precedente, con 176 test.

Prima di un'eventuale anteprima o rilascio resta la verifica visiva del risultato, in chiaro/scuro, sulle due viste e sulle larghezze previste; resta necessario il consenso di Enrico alla pubblicazione. Nessun nuovo pacchetto richiesto. Log e riproduzioni nella ricerca locale `ricerca/2026-10-16-analisi-progetto/colori-*`.

Riferimento per l'uso di colori per ruolo: [variabili CSS, MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties). Sono state usate le skill locali design-sito, frontend-design e modern-web-guidance; il relativo CLI non è stato installato, conservando il vincolo sulle nuove installazioni.
