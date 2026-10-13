# D · correzione della dicitura e piano di rifinitura

12/10/2026, `codex/fonti-specifica`. Enrico preferisce D e chiede di eliminare «Scopo da verificare», cercare altri miglioramenti e aggiungerli all'elenco precedente. Il piano è in [ricerca](../../../ricerca/2026-10-12-fonti-d-rifiniture.md).

**Applicato in questo giro:** soltanto la rimozione della dicitura interna e del contenitore vuoto dalle voci di D, nei quattro casi. Dove esiste una descrizione documentata, rimane; dove manca, sono mostrati titolo originale, editore, data e limiti reali. Nessuna nuova associazione fonte–informazione, verifica o data. Le lacune restano tracciate nei documenti interni. Nessuna fonte esclusa o resa più certa.

**Ancora proposti:** gli altri interventi del piano, da applicare in una rifinitura successiva. Nessuna prova con lettori indipendenti svolta. Nessuna integrazione o redesign della pagina generale.

[12 esempi](d.html) · [180 fonti](d-lungo.html) · [Una fonte](d-breve.html) · [Nessuna fonte](d-vuoto.html). Layout, caratteri, ricerca e script sono riusati dal [secondo giro](../giro-2/README.md), che rimane identico. Il primo giro e le altre cartelle di design sono conservati.

Anteprima: [D aggiornata](http://127.0.0.1:4345/design/fonti/giro-3/d-lungo.html). Il server usa strumenti già presenti, sola lettura e `127.0.0.1:4345`; espone soltanto i tre giri, i caratteri locali e il sito costruito.

```powershell
$env:PATH = 'C:\Users\Windows11\tools\node-v24.21.0-win-x64;' + $env:PATH
node design/fonti/giro-3/genera.mjs
node design/fonti/giro-3/serve.mjs
```

In un altro terminale, con lo stesso PATH:

```powershell
node design/fonti/giro-3/verifica.mjs
node design/fonti/giro-3/lighthouse.mjs
node design/fonti/giro-3/conservazione.mjs
```

La [verifica](verifiche/risultati.json) confronta tutti gli ID, titoli, URL, date, descrizioni esistenti e note con D del giro precedente. Axe, viewport, avvisi visibili, tastiera, ricerca, assenza di JS, console e richieste esterne controllati nei casi pertinenti. [Lighthouse](verifiche/lighthouse-riepilogo.json), [conservazione](verifiche/conservazione.json) e log del sito in `verifiche/`.

Esiti di questo blocco: **58/58 test**, build riuscita (11 pagine), **874 link interni validi**; **42 combinazioni e scansioni axe senza violazioni**, ricerca/tastiera/movimento ridotto/senza JS provati, nessun overflow a 320/390/1280 px, console pulita e nessuna richiesta esterna. Lighthouse mobile **99** in entrambi i temi, accessibilità e buone pratiche **100**, CLS **0**. La prima esecuzione in chiaro non aveva prodotto un rapporto valido; ripetuta dopo i controlli concorrenti, ha superato la soglia. **197 input del sito e 484 file dei design precedenti identici** alla base di questo giro. Nessuna prova con utenti o nuova lettura degli originali dichiarata.

Riferimento tecnico: [MDN · details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details). Consultazione diretta come alternativa al comando di download di modern-web-guidance, nel rispetto del divieto di installazioni. Nessuna delega, push, merge o deploy.
