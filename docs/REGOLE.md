# Nextstop · regole comuni

Fonte operativa per Codex e Claude Code. Stato in [PROGRESS](../PROGRESS.md), percorsi nell'[indice](README.md), comandi nel [README del progetto](../README.md). Le istruzioni dell'utente definiscono il lavoro autorizzato.

## Ambito e repository

- Astro 7 su Vercel, Node >=22.12, senza database. Nome provvisorio dal 06/10/2026, da decidere dopo la verifica dei marchi; prima città Napoli. Origine nella [specifica della separazione](../specifiche/sito-itinerari-separazione.md).
- Parti da `git status` e verifica il ramo. Per un lavoro nuovo crea un ramo dedicato da `main`; per continuare usa il ramo autorizzato. Non mescolare lavori di altri rami o modifiche dell'utente.
- Non modificare `main`, fare merge o pubblicare senza l'OK di Enrico. Un rilascio richiede anteprima Vercel, link e immagini da telefono in chiaro e scuro, poi consenso. Push e deploy devono rientrare nell'autorizzazione ricevuta.
- Un solo assistente alla volta per ramo, commit prima del passaggio all'altro; identità del commit nelle rispettive istruzioni, senza cambiare la configurazione Git.
- Un blocco approvato alla volta, poi fermati per l'OK. SEO, grafica, nuove città e funzionalità in roadmap non sono automaticamente autorizzate dalla manutenzione.
- Conserva specifiche, decisioni, ricerche, proposte e licenze. Una proposta, anche selezionata per un giro successivo, non è un rilascio approvato. Non cancellare codice perché sembra vecchio: verifica anche usi dinamici e script.

## Programmi, skill e dipendenze

- Usa gli strumenti già presenti. Una dipendenza nuova richiede motivazione e OK di Enrico prima dell'installazione.
- Regola di Enrico del 04/10/2026: prima di copiare o installare programmi, pacchetti, script, skill o plugin di altri, leggi **tutti** i file. Cerca download/esecuzione di codice (`curl`, `wget`, `eval`, `exec`, `base64`), accesso a dati personali/credenziali, invii a server anche per statistiche, hook automatici, modifiche a impostazioni/permessi e installazioni nascoste.
- Se trovi qualcosa di dubbio, avvisa Enrico e aspetta il suo OK prima di copiare, installare o eseguire. Dì cosa hai controllato e trovato. Una skill non letta per intero non si usa; carica solo quelle pertinenti, non l'intero inventario.
- Sorgenti skill in `.claude/skills/`, copie identiche in `.agents/skills/`: se modifichi una skill approvata, aggiorna entrambe e conserva le licenze. Non esporre credenziali nei file o nei log.

## Dati e comportamento

- Conserva comportamento intenzionale, ID di tappe/locali/schede, URL e link condivisi: gli ID vivono nei telefoni. Nelle prove usa casi fittizi isolati, senza modificare dati utente o produzione.
- Nessuna informazione senza fonte, stato (`confermato`, `stampa`, `segnalato`, `atteso`) e data. Informazioni non confermate: `{?id}` e parole di cautela; per la stampa basta il condizionale. I fatti passati letti sui giornali con `comeFatto: true` restano da verificare. Dettagli nel [README](../README.md#testi-discorsivi-delle-pagine) e nella [guida dei testi](../specifiche/stile-testi.md), solo per compiti editoriali.
- Se una scheda cambia, rileggi i testi che la usano prima di `npm run testi:firma`. Foto solo con licenza libera, autore e licenza in `src/data/foto.yaml`; font serviti dal sito con le licenze.
- Conserva memoria locale, offline e privacy: nessun cookie né servizio esterno prima del tocco previsto dalla pagina Privacy. Statistiche Vercel Analytics, senza contatori propri; non aggiungere tracciamenti.
- Napoli a Vela porta qui; questo sito non porta a Napoli a Vela. «Regate dal lungomare» solo per Napoli nei giorni di regata 2027, senza link alla Coppa. Niente «ufficiale», affiliazioni o loghi di luoghi, musei, eventi o aziende.
- Non modificare a mano JSON generati di tempi/percorsi: usa gli script documentati solo per aggiornamenti autorizzati. Conserva `public/googlee54aa324270bde6d.html`.

## Lavori di prodotto, quando autorizzati

- Una funzione nuova parte dal problema di chi visita e spiega perché non basta migliorare quella esistente. Per una funzione grande, specifica corta in `specifiche/` (obiettivo, regole, casi limite, controlli e compiti), approvata prima di costruire.
- Design: quattro proposte diverse per pezzo, un pezzo alla volta; Enrico valuta, poi si itera sulle scelte. Leggi solo `DESIGN.md`, la specifica e il README dei bozzetti pertinenti.
- Ricerca: salva tutti i fatti e le fonti in `ricerca/`, anche quelli non usati subito. Non anticipare attività della roadmap durante la manutenzione.

## Verifiche e letture

- Bug: prima il test che lo riproduce, poi la correzione. Riusa `node:test`, senza controlli pesanti o test che riscrivono l'implementazione.
- Durante le modifiche esegui test pertinenti. A fine blocco che cambia codice, dati o input della build: `npm test`, `npm run build`, poi `npm run check:links`. Riporta gli errori utili, non i log completi.
- Per sole modifiche documentali verifica riferimenti, conservazione delle decisioni e coerenza. Se gli input eseguibili sono invariati, non ripetere build e suite già verificate; distingui i controlli eseguiti ora dai risultati precedenti.
- Prima di un'anteprima del sito: axe in chiaro/scuro, Lighthouse da telefono almeno 95, niente scorrimento orizzontale a 320/390 px, «riduci movimento» e console pulita. Non sono controlli da ripetere a ogni commit documentale o piccola modifica locale.
- Leggi solo moduli e specifiche del compito. Non aprire di default tutto `design/`, `ricerca/`, le skill, `package-lock.json`, grossi `src/data/*.json`, lo storico o `da-risolvere.md` (solo la voce pertinente). `ROADMAP.md` serve per pianificare lavori futuri.

## Lavorare con Enrico

- Italiano semplice, risposte corte, spiega i termini tecnici. Enrico lavora anche dal telefono: immagini e tabelle quando aiutano.
- All'inizio dì cosa faremo, modello/ragionamento consigliato per l'ambiente e se la chat è adatta. Impostazioni manuali: non fingere di cambiarle; per un cambio necessario spiegalo e aspetta «fatto». Le scelte specifiche di Claude restano in `CLAUDE.md`.
- Nei lavori lunghi aggiorna all'incirca al 30/50/70/90% con risultato e prossimo passo. Confronta skill/plugin disponibili con quelli pertinenti e segnala ciò che manca per il compito.
- A fine blocco aggiorna `PROGRESS.md` in poche righe. Riassumi cambiamenti, file, test con esiti reali, rischi e lavoro rimasto; indica «cosa fai adesso» con azioni numerate e testo esatto se utile. Dì quali strumenti servono al seguito e se conviene locale o cloud, poi attendi l'OK.
