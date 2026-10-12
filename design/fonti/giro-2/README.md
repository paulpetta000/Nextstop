# Fonti · secondo giro

12/10/2026, ramo `codex/fonti-specifica`. Enrico autorizza tutti i miglioramenti della [revisione critica](../../../ricerca/2026-10-12-fonti-revisione-critica.md), dopo aver chiarito che questo giro non richiede una nuova verifica generale delle 195 fonti. Solo prototipi del pannello in fondo alle pagine. Primo giro conservato; nessuna integrazione o progettazione di `/fonti/`.

[Galleria locale](http://127.0.0.1:4344/design/fonti/giro-2/index.html) · [Confronto](confronto.html) · [Primo giro](../giro-1/README.md).

## Quattro alternative

| Proposta | Differenza | Uso più adatto |
|---|---|---|
| [A · Lista essenziale](a.html) | Lista per argomento; luogo nel margine sul desktop. | Chiusura sobria, soprattutto con poche fonti. |
| [B · Percorso per luoghi](b.html) | Lista per luogo e salti alfabetici, senza indice di 87 nomi. | Consultazione di molte tappe. |
| [C · Informazione e fonte](c.html) | Scopo e originale affiancati sul desktop, compatti sul telefono. | **Consigliata:** relazione chiara, contesto per luogo, ricerca. |
| [D · Fogli di viaggio](d.html) | Fogli per luogo, alleggeriti; una colonna nel caso lungo. | Racconti e pagine brevi. |

Tutte hanno un solo `details/summary`, chiuso all'arrivo ordinario. Nessun secondo pannello per documento. Titolo leggibile e collegamento diretto all'originale; PDF e ZIP riconoscibili; stessa gerarchia, avvisi, ricerca e date in ogni proposta. Il tema segue il sistema, con un comando di confronto locale. Nessun salvataggio o tracciamento.

## Gli interventi del giro

1. **Scopi concreti:** sintesi dei 12 esempi già documentati, con riferimento alla prova originale; nessuna conferma inventata.
2. **Voci essenziali:** scopo, documento cliccabile, editore e controllo, limite utile. Nessuna etichetta «Documenta» ripetuta o elenco tecnico delle relazioni.
3. **Raggruppamenti:** luoghi espliciti; OpenStreetMap sotto «Mappe e dati», usando la descrizione già registrata, senza promuoverla a prova degli orari.
4. **Fonti condivise:** documento unico; tutti i nomi collegati sono ricercabili. La ricerca mostra il luogo corrispondente accanto al risultato.
5. **Ricerca locale:** luogo, scopo verificato, titolo ed editore; accenti e apostrofi; conteggio annunciato, zero risultati con recupero, «Mostra tutte». Nessuna rete o modifica allo storage.
6. **Copertura e cautela:** tutte le fonti restano accessibili; documenti con scopo già descritto prima dei riferimenti incompleti nello stesso gruppo. Avvisi della pagina fuori dal pannello, limiti di consultazione accanto alla fonte.
7. **Prove di consultazione:** durata Catacombe, guida 2025 distinta dal controllo 2026, Pintauro, PDF EAV, documento condiviso da due luoghi; inoltre accenti, apostrofi, reset, frammenti, tastiera e ritorno dall'originale. Sono prove automatizzate e lettura del progettista, non uno studio con lettori indipendenti.
8. **Rifinitura delle quattro alternative:** spazi, temi, titoli lunghi, telefono/desktop, movimento ridotto, elenco completo senza JS; axe, Lighthouse e controlli del progetto prima della consegna.

## Contenuti e limiti

[contenuti.mjs](contenuti.mjs) importa il campione originale e conserva ID, URL e date. La sintesi cambia soltanto le parole mostrate nei prototipi; le prove del [Blocco 2](../../../ricerca/2026-10-12-fonti-verifiche-prioritarie.md) non vengono sostituite. «Passaggio letto», «Lettura parziale», «Consultazione tentata» e «Controllo registrato» mantengono significati diversi. Edizione, pubblicazione e validità restano esplicite quando incidono sull'interpretazione.

Il [caso lungo](fixture-lungo.json) riusa i 180 documenti del primo giro, con gli stessi URL e date. Nove scopi hanno una descrizione già disponibile nel campione o nel registro OSM; le altre 171 voci mostrano «Scopo da verificare». Questo è un limite editoriale del caso di volume, non una dichiarazione che i documenti siano tutti mai letti. I collegamenti a luoghi sono quelli dichiarati nei dati e permettono di trovare una fonte; non dimostrano da soli che essa sostenga un fatto. I nomi completi sono ricercabili senza ripetere lunghi elenchi nella voce.

La ricerca usa scopi specifici soltanto quando disponibili. Non deduce «orari», «prezzi» o altri fatti dal dominio o dalla collocazione della fonte. Nessuna fonte viene eliminata per accorciare l'elenco. Non viene aggiunto un filtro sulle sole tappe selezionate del viaggio.

Le nove fonti delle regate restano escluse, con 195 fonti pubbliche nel sito. Non sono cambiati dati, ID, URL, firme, regate, privacy, offline o licenze. La durata delle Catacombe è rappresentata nel campione; il difetto di copertura del footer resta nel futuro blocco di integrazione.

Il PDF EAV conserva il link preciso già ottenuto nel primo giro: il parametro di download dovrà essere rivalidato prima dell'integrazione. Non è stato eseguito un controllo nuovo di tutti gli URL esterni.

## Riproduzione

Strumenti già presenti: Node portatile, Chrome, puppeteer-core, axe, Lighthouse, sharp. Nessuna dipendenza installata, nessuna delega.

```powershell
$env:PATH = 'C:\Users\Windows11\tools\node-v24.21.0-win-x64;' + $env:PATH
node design/fonti/giro-2/genera.mjs
node design/fonti/giro-2/serve.mjs
```

In un altro terminale, con il medesimo PATH:

```powershell
node design/fonti/giro-2/verifica.mjs
node design/fonti/giro-2/verifica-breve.mjs
node design/fonti/giro-2/lighthouse.mjs
node design/fonti/giro-2/fotografa.mjs
node design/fonti/giro-2/conservazione.mjs
```

Il server di sola lettura usa `127.0.0.1:4344`; il primo giro sulla porta precedente resta disponibile. Espone solo i due giri, i caratteri e il sito costruito. Le prove usano profili temporanei e dati fittizi. Lighthouse ha segnalazioni di errore disattivate. Il ritorno dall'originale usa una risposta intercettata: non prova la raggiungibilità dell'editore né i dati personali di Enrico.

Riferimenti tecnici primari consultati: [details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details), [status per i risultati](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role), [hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden). Consultazione diretta al posto del comando `npx` di modern-web-guidance, per rispettare il divieto di scaricare/installare codice. Design e voce del progetto prevalgono sui valori generici delle skill.

Esiti della consegna nel [resoconto](../../../docs/storico/2026-10-12-fonti-giro-2.md) e nei rapporti di [verifica](verifiche/risultati.json), [Lighthouse](verifiche/lighthouse-riepilogo.json) e [conservazione](verifiche/conservazione.json).
