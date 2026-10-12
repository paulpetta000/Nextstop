# D · rifinitura completa del pannello a fondo pagina

12/10/2026, ramo `codex/fonti-specifica`, seguito di `6eaa013`. Enrico preferisce D e autorizza tutti gli interventi del [piano](../../../ricerca/2026-10-12-fonti-d-rifiniture.md), escludendo espressamente la prova con un lettore esterno. Le prove automatiche non sono presentate come uno studio con utenti.

**Questo è il prototipo della sezione da inserire in fondo alle pagine del sito.** La pagina autonoma serve a valutarlo; non è il progetto della pagina generale `/fonti/`. Nessuna integrazione, nuova dipendenza, delega, push, merge o pubblicazione. I tre giri precedenti e le altre proposte restano conservati.

[12 esempi](d.html) · [180 fonti](d-lungo.html) · [Una fonte](d-breve.html) · [Nessuna fonte](d-vuoto.html).

Anteprima locale: [D rifinita](http://127.0.0.1:4346/design/fonti/giro-4/d.html) e [elenco lungo](http://127.0.0.1:4346/design/fonti/giro-4/d-lungo.html). Il server di sola lettura ascolta su `127.0.0.1:4346`, permette il confronto dei quattro giri e usa i caratteri già presenti.

## Cosa cambia

- La struttura resta un **elenco di documenti per luogo**, contenuto in un pannello nativo chiuso all'apertura. Avvertenze essenziali sempre visibili, originali a un clic, nessun pannello obbligatorio per ogni fonte.
- Nei 12 esempi, descrizioni brevi delle informazioni documentate. Limiti concreti prima del collegamento quando cambiano l'interpretazione. Nessuna dicitura di lavorazione o relazione inventata.
- Ricerca a tutta larghezza, etichetta visibile, conteggio dei risultati annunciato senza spostare il focus. Il reset è sotto il campo; zero risultati offre il recupero. Equivalenze lessicali «costo/prezzo» e «biglietto/biglietti» applicate al contenuto già disponibile.
- Cercando un luogo collegato a una fonte condivisa, quel luogo diventa il contesto del risultato. Un record e un collegamento per fonte; nessuna ripetizione dei nomi prima e dopo il documento.
- Nel gruppo Napoli–Sorrento l'orario precede il riscontro parziale sul Campania Express. L'ordine segue la relazione documentata, non una graduatoria degli editori.
- Due titoli particolarmente lunghi hanno una forma breve fedele; il titolo completo si legge con un comando facoltativo da telefono o tastiera. Il documento si apre subito. Senza JavaScript il collegamento mostra il titolo originale completo.
- PDF e ZIP compaiono sul collegamento. ANM è presentato come archivio di dati da scaricare, con formato e licenza conservati.
- Edizione, validità e pubblicazione restano vicine all'informazione pertinente; la data registrata mantiene la sua dicitura e posizione secondaria. Nessuna nuova verifica o data unica.
- Riquadri più compatti, fonti pratiche prima nello stesso gruppo, conteggi discreti dove ci sono più documenti. Testo primario 17 px, bersagli almeno 44 px, stessa palette nei due temi.
- Nel caso lungo, un solo comando «Torna alla ricerca» rimane disponibile dopo che il campo è uscito dalla vista. Porta al campo con il focus; la fascia torna statica durante la digitazione. Il collegamento finale funziona anche senza IntersectionObserver.

## Riproduzione e verifiche

```powershell
$env:PATH = 'C:\Users\Windows11\tools\node-v24.21.0-win-x64;' + $env:PATH
node design/fonti/giro-4/genera.mjs
node design/fonti/giro-4/serve.mjs
```

In un secondo terminale, con lo stesso PATH:

```powershell
node design/fonti/giro-4/verifica.mjs
node design/fonti/giro-4/lighthouse.mjs
node design/fonti/giro-4/fotografa.mjs
node design/fonti/giro-4/conservazione.mjs
```

Eseguire Lighthouse senza altri controlli Chrome concorrenti. Gli script usano i programmi già autorizzati in `tools/controlli`, profili temporanei e nessun profilo personale; segnalazioni di errore Lighthouse disattivate. Gli script di verifica e fotografia impediscono le richieste esterne prima del clic di prova.

**Esiti:** 58/58 test del sito, build riuscita (11 pagine), 874 link interni validi. [70 combinazioni, 50 scansioni axe e 10 attività di ricerca](verifiche/risultati.json) senza problemi; nessun overflow a 320/375/390/768/1280 px, nessun errore in console. Tastiera, focus, titoli completi, PDF/ZIP, limiti, fonti condivise, movimento ridotto, assenza di JS, viewport verticale ridotto e navigazione originale/ritorno provati. [Lighthouse mobile](verifiche/lighthouse-riepilogo.json): campione **97** nei due temi, elenco lungo **95/96**; accessibilità e buone pratiche **100**. La prima misura lunga in scuro era 90 mentre si acquisivano immagini; ripetuta da sola ha ottenuto 96. [Prima misura conservata](verifiche/lighthouse-primo-riepilogo.json).

La prova del documento esterno usa una risposta intercettata e un dato locale fittizio: non è una nuova verifica degli editori o un controllo dei dati personali di Enrico. [Conservazione](verifiche/conservazione.json): **197 input del sito corrispondenti al contenuto Git; 512 dei 513 file dei design precedenti identici alla base**. Una differenza di hash nel file dei percorsi e una nel vecchio rapporto Lighthouse sono registrate senza ripristini: il file dei percorsi, normalizzati i fine riga Windows, coincide con HEAD; il rapporto differisce in una parola della descrizione di un controllo, senza variazioni dei risultati. Lo script di conservazione segnala questa discrepanza e non la considera un controllo interamente riuscito. [Diagnosi percorsi](verifiche/controllo-percorsi.json), [diagnosi rapporto](verifiche/controllo-rapporto-precedente.json), log e immagini in `verifiche/`; [resoconto](../../../docs/storico/2026-10-12-fonti-giro-4.md).

## Limiti e seguito

Le descrizioni del campione derivano dalle prove già raccolte. Nell'elenco lungo, **171 relazioni editoriale fonte–informazione restano da completare nell'integrazione**, senza segnaposti pubblici. Titoli, editori, date e limiti presenti rimangono consultabili. Nessun ricontrollo indiscriminato delle 195 fonti, nessuna modifica delle regate o della loro esclusione. Il caso della durata Catacombe nel footer reale resta al Blocco 5.

Enrico valuta la D rifinita. Dopo il suo OK e l'autorizzazione al seguito: Blocco 4, quattro proposte della pagina generale; Blocco 5, integrazione; Blocco 6, revisione e rilascio con consenso esplicito. Per il prossimo design bastano ambiente locale e strumenti presenti, GPT-6.1-sol / High per le proposte e Medium per applicare la direzione scelta.

Riferimenti tecnici consultati direttamente, come alternativa al download previsto da modern-web-guidance: [MDN · IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver), [MDN · status](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role), [MDN · VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport). Nessun codice esterno aggiunto; la prova della tastiera usa un viewport ridotto, non una simulazione completa del sistema operativo.
