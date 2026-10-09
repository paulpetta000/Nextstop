# Nextstop · Claude Code

Sito statico Astro 7, Node >=22.12, in italiano. Enrico lavora anche con Codex.

- Leggi [regole comuni](docs/REGOLE.md) e [stato attuale](PROGRESS.md), poi solo i file del compito indicati nell'[indice](docs/README.md). Non caricare interi archivi, bozzetti, ricerche, skill o JSON grandi.
- Commit: `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit …`, senza cambiare la configurazione Git. Un solo assistente per ramo; commit prima del passaggio a Codex.
- Skill sorgenti in `.claude/skills/`, agenti in `.claude/agents/`; consulta solo quelli pertinenti. Le copie Codex in `.agents/skills/` restano identiche, con le licenze.
- Le regole condivise si aggiornano in `docs/REGOLE.md`; le particolarità di Claude Code restano qui. Codex usa `AGENTS.md`: non deve leggere o tradurre questa tabella di modelli.
- Comandi e struttura nel [README](README.md). Per Node portatile e controlli da telefono apri l'[ambiente locale](docs/AMBIENTE-LOCALE.md) solo quando serve; non presumere che strumenti dell'app o del cloud siano disponibili in Claude Code.

## Modelli, effort e agenti
Obiettivo di Enrico: **efficienza**. Il risultato deve essere ottimo, ma senza spendere più del necessario. Regola: si parte dal livello più basso che può bastare
e si sale solo se il risultato non è buono. Effort, dal più leggero: medio · alto · extra · max. **L'effort basso non si usa mai.** Costo, dal più leggero: Haiku 4.5 · Sonnet · Opus.

| Compito | Modello | Effort |
|---|---|---|
| Domande, un testo da correggere, modifiche di poche righe, commit e push, aggiornare `PROGRESS.md` | principale o Sonnet, fai da solo | medio |
| Ricerche ripetitive (orari, prezzi, fonti di un gruppo di luoghi o locali) e di confronto (come fanno altri siti) | agente `ricercatore` (Sonnet, effort medio, salva tutto in `ricerca/`), in parallelo, uno per gruppo; il principale rilegge le fonti | medio–alto |
| Lavori meccanici (cercare, contare, estrarre, rinominare) | Haiku 4.5 (Enrico per ora preferisce non usarlo: usa Sonnet) | medio |
| Revisione del codice, controlli su molte pagine, controlli finali, anteprima e pubblicazione | agente `revisore` o agente Sonnet (Enrico, 03/10/2026: i controlli si fanno con Sonnet) | alto |
| Costruire una funzione nuova nel codice esistente (filtri, nuovo tipo di tappa, pagina, città nuova) | modello principale (Opus) | alto |
| Grafica, struttura dei dati, specifiche, scelte difficili da cambiare dopo | Opus | extra |
| Bug difficile da trovare, sicurezza, fallimenti ripetuti | Opus | max |

- **Controlli e pubblicazione con Sonnet** (Enrico, 03/10/2026): la coda di un blocco (test, `check:links`, push, anteprima di Vercel, immagini) si affida a un agente con modello Sonnet e istruzioni complete; il modello principale rilegge il risultato.
- **Scala di salita sui fallimenti** (deciso da Enrico il 03/10/2026). Il modello leggero **finisce tutto il suo lavoro**: non si interrompe al primo problema.
  I casi falliti si raccolgono e si ritentano **in blocco** con un livello più forte, che parte sapendo cosa è già stato provato: Sonnet → Opus alto. Un tentativo per livello.
  - Al lancio di un agente si sceglie il **modello**, non l'effort; l'effort per agente si può fissare solo nel file dell'agente (`.claude/agents/*.md`, riga `effort:`).
  - Gli agenti devono scrivere «NON TROVATO» con cosa hanno provato. **Mai inventare**: vale la regola «niente senza fonte».
  - Prima di salire, capisci perché ha fallito. Se la cosa non esiste, il sito è bloccato o manca la fonte, **non salire**: scarta il caso o segnalalo a Enrico. Sali solo se ha cercato male o ragionato male.
  - Se anche Opus alto fallisce, **non salire da solo a extra o max**: scrivi il caso in `da-risolvere.md` (cosa manca, cosa è stato provato e da chi, perché, se si può ritentare) e vai avanti. Quando le righe aperte sono almeno 10, o a fine blocco, avvisa Enrico: li risolviamo insieme in un gruppo.
  - **Effort alzato a mano da Enrico**: conviene solo quando i casi falliti sono tanti o richiedono più ragionamento nella stessa conversazione. Fermati **una volta sola, a fine lavoro**, con l'elenco, e chiedi: «alza l'effort a X, poi scrivimi fatto». Risolvi i casi, poi ricorda a Enrico di **riabbassarlo**.
  - **Cosa conta come fallimento**: build, link o controlli rossi, «NON TROVATO», o un dato sbagliato trovato rileggendo. Se l'errore è preciso e meccanico (la build dice file e riga) un secondo tentativo allo stesso livello va bene.
  - Il modello principale controlla sempre tutti i dati delicati (orari, prezzi, fonti) e un campione del resto.
  Per le decisioni di struttura conta più il modello dell'effort: un Opus a effort medio vale più di un Sonnet a max.
- **Max** solo quando alto ed extra non bastano o quando la scelta è costosa da correggere: non è il livello normale.
- **Fai da solo** quando il lavoro è di poche righe: un agente parte da zero e deve rileggere il contesto, quindi per poco costa di più.
- Più agenti insieme solo se i lavori sono davvero indipendenti. Chiedi sempre risposte corte (elenchi con le fonti, non spiegazioni).
- Il modello principale rilegge sempre il lavoro di un agente prima di darlo per buono.
