# Nextstop

Sito di itinerari in città, in italiano. Nome provvisorio (Enrico, 06/10/2026): quello definitivo dopo l'avvocato (marchi).
Prima città: Napoli; poi altre (decisione del 06/10/2026). Nato il 06/10/2026 separando gli itinerari da **Napoli a Vela**
(la guida alla Coppa America 2027, repository `paulpetta000/pol`): specifica in `specifiche/sito-itinerari-separazione.md`.
Sito statico in Astro 7, pubblicato su Vercel dal ramo `main`. Nessun database e nessun contatore: le visite si vedono in Vercel Analytics.
Rispondi in italiano semplice e spiega i termini tecnici.

## Comandi
- `npm run dev` · sito in locale (porta 4321)
- `npm run build` · costruisce il sito; **si ferma da sola** se mancano fonti o testi da rileggere
- `npm run check:links` · dopo la build, controlla i link interni
- `npm run testi:firma` · dopo aver riletto un testo cambiato, lo firma di nuovo
- `npm test` · i test con `node:test` (regole dei testi, firme, date, link): pochi secondi, non fermano Vercel
- Node 22.12 o più recente.

## Dove sono le cose
- Dati: `src/data/` (schede in `fatti.yaml`, fonti in `fonti.yaml`, foto in `foto.yaml`, tappe in `tappe.yaml`, locali in `locali.yaml`)
- Testi delle pagine: `src/testi/*.yaml` · pagine: `src/pages/` · componenti: `src/components/`
- Itinerari: `src/pages/napoli/itinerari/`, codice in `src/lib/itinerari/` e `src/scripts/itinerari/`; tempi in `src/data/tempi-tappe.json` (non si modifica a mano, lo calcola `scripts/itinerari/`)
- Il compositore è scritto per più città: i dati della città (e, se c'è, un evento come le regate di Napoli 2027) gli arrivano come dati (`src/lib/itinerari/tipi.ts`, `napoli.ts`).
- Da dove vengono i dati e quando si rinnovano: `aggiornamenti/`. Tabella dei file e spiegazione dei testi: `README.md`

## Regole che non si rompono
- **Skill, plugin e programmi di altri: prima si legge il codice, regola numero uno di Enrico (04/10/2026).** Prima di copiare o installare qualsiasi skill, plugin, script o pacchetto, leggi **tutti** i suoi file e cerca malware e cose pericolose: comandi che scaricano o eseguono altro (`curl`, `wget`, `eval`, `exec`, `base64`), accesso a file personali, chiavi o password, invii di dati a server esterni (anche statistiche), hook che partono da soli, modifiche a impostazioni o permessi, installazioni nascoste. Se trovi **qualcosa di dubbio, avvisa Enrico prima di fare qualsiasi altra cosa** e aspetta il suo OK: non installare, non copiare, non eseguire. Dì sempre a Enrico, in parole semplici, cosa hai controllato e cosa hai trovato. Una skill che sembra pulita ma che non hai letto per intero non si usa.
- **Niente pacchetti nuovi quando se ne può fare a meno** (Enrico, 06/10/2026): prima si usa ciò che c'è già (Node, Astro, gli strumenti nel cloud). Se un pacchetto serve davvero, dì a Enrico perché e aspetta il suo OK, poi controllane autore, licenza e script di installazione.
- **Nessuna informazione senza fonte.** Ogni dato ha fonte, stato (`confermato`, `stampa`, `segnalato`, `atteso`) e data di controllo.
- Un'informazione non confermata va segnata con `{?id}` e detta a parole («non è ancora uscito», «lo diranno gli organizzatori»; per le notizie di stampa basta il condizionale: «dovrebbe»). I fatti del passato letti sui giornali (premi delle guide, classifiche, recensioni) si scrivono come fatti con `comeFatto: true` e restano da verificare (Enrico, 06/10/2026). Come si scrive: `specifiche/stile-testi.md`.
- Se una scheda cambia, i testi che la usano vanno riletti e poi firmati con `npm run testi:firma`.
- Foto solo con licenza libera, con autore e licenza in `foto.yaml`.
- Nessun cookie e nessun servizio esterno prima di un tocco dell'utente (vedi la pagina Privacy). I caratteri si servono dal sito (`public/fonts/`).
- **Collegamento a senso unico** (03/10/2026): Napoli a Vela porta a questo sito, questo sito **non** porta a Napoli a Vela. Il blocco «Regate dal lungomare» compare solo nei giorni di regata del 2027, senza link alla Coppa.
- Niente «ufficiale», niente link di affiliazione, niente loghi di luoghi, musei, eventi o aziende.

## Come si lavora
- Stato e prossimi passi: `PROGRESS.md` (corto).
- Lavora su un ramo nuovo creato da `main`. Niente pubblicazione su `main` senza l'OK di Enrico: ogni rilascio parte solo dopo il suo OK, dopo l'anteprima di Vercel (link e immagini su telefono, tema chiaro e scuro).
- **Una funzione nuova parte dal problema di chi visita il sito**: scrivi quale problema risolve e perché non basta migliorare una funzione che c'è già. Se non lo sai dire, non si costruisce.
- **Design: sempre 4 proposte** (Enrico, 07/10/2026). Ogni pezzo di grafica da fare o rifare (una sezione della home, la scheda della tappa, la barra di ricerca, il compositore…) si propone in **4 versioni molto diverse tra loro**, all'inizio con campo libero, curate e professionali. Enrico dice cosa va e cosa no; da quello che va si fanno altre 4 proposte, fino alla scelta. Un pezzo alla volta.
- **Ricerche: si salva tutto** (Enrico, 07/10/2026). Tutti i fatti e le fonti trovati dagli agenti restano nel progetto (`ricerca/`), anche quelli che non si usano subito.
- Per una funzione nuova e grande (per esempio una città nuova) scrivi prima una **specifica** corta in `specifiche/` (obiettivo, regole, casi limite, controlli da fare, compiti da spuntare)
  e fala approvare, poi costruisci. Per le piccole modifiche non serve.
- Alla fine di un blocco fermati, mostra cosa c'è da rivedere e aspetta l'OK.
- Prima di dire «fatto»: `npm test` verde, build senza errori e `check:links` pulito. Prima di un'anteprima anche: axe in chiaro e scuro, Lighthouse su telefono (almeno 95), nessuno scorrimento orizzontale a 320 e 390 px, «riduci movimento», nessun errore in console.
- Aggiorna `PROGRESS.md` a fine lavoro, in poche righe.
- I commit si firmano come quelli di prima (autore `Claude <noreply@anthropic.com>`): sul computer di Enrico git non ha un nome impostato, quindi si passa con `git -c user.name=… -c user.email=…`, senza cambiare le impostazioni.

## Guidare Enrico passo passo (regola di Enrico, 03/10/2026)
Enrico costruisce il sito **con te**, e vuole che sia tu a dirgli cosa fare a ogni passaggio, in italiano semplice e **con il telefono in mano**:
risposte corte, immagini e tabelle invece di testi lunghi.
- **All'inizio di una sessione** (appena letti `CLAUDE.md` e `PROGRESS.md`) digli in 3 righe: cosa faremo, **quale modello e quale effort impostare**, e se la sessione è quella giusta o se conviene aprirne un'altra.
- **Prima di un lavoro più difficile o più leggero** del precedente, avvisalo: «adesso alza (o abbassa) l'effort a X», e aspetta il suo «fatto».
  Una sessione non può cambiare da sola il proprio modello o effort (l'app lo vieta, provato il 06/10/2026): lo cambia Enrico dal menu. Il modello degli agenti lo scegli tu.
- **Nei lavori lunghi** manda una riga di avanzamento quando sei a circa il 30%, 50%, 70% e 90% (cosa è fatto, cosa viene dopo) (Enrico, 03/10/2026).
- **A fine lavoro** dagli sempre la lista «cosa fai adesso»: numerata, un'azione per riga, con il testo esatto da incollare, quando serve. Esempi: aprire una sessione nuova (su quale repository e da quale ramo), che modello ed effort impostare, che testo incollare, cosa guardare sul telefono, quando dire OK alla pubblicazione.
- **Prima di ogni pubblicazione su `main`** dì cosa cambia per chi visita il sito e chiedi il suo OK.
- **Skill e plugin, all'inizio e alla fine di ogni sessione** (richiesta di Enrico, 03/10/2026):
  - all'inizio confronta le skill e i plugin disponibili in quella sessione con quelli che servono al lavoro (tabella «Skill» in `PROGRESS.md`) e dì a Enrico cosa manca;
  - a fine sessione dì quali skill e plugin servono al lavoro dopo, se sono già disponibili o se deve installarli (e dove), e se conviene lavorare **nel cloud o in locale sul suo computer**, con il motivo.
- Non dare mai per scontato che sappia cosa fare dopo: scrivilo.

## Cosa non leggere di default
`design/` (bozzetti da oltre 1 MB), `ricerca/` (note lunghe), `package-lock.json`, `src/data/*.json` grandi
(`percorsi-tappe.json`, `mappa.json`, `tempi-tappe.json`, `linee-bus.json`), `da-risolvere.md` (si apre solo per aggiungere una riga o per risolvere un gruppo). Aprili solo se il compito li riguarda, e solo la parte che serve.

## Modelli, effort e agenti
Obiettivo di Enrico: **efficienza**. Il risultato deve essere ottimo, ma senza spendere più del necessario. Regola: si parte dal livello più basso che può bastare
e si sale solo se il risultato non è buono. Effort, dal più leggero: medio · alto · extra · max. **L'effort basso non si usa mai.** Costo, dal più leggero: Haiku 4.5 · Sonnet · Opus.

| Compito | Modello | Effort |
|---|---|---|
| Domande, un testo da correggere, modifiche di poche righe, commit e push, aggiornare `PROGRESS.md` | principale o Sonnet, fai da solo | medio |
| Ricerche ripetitive (orari, prezzi, fonti di un gruppo di luoghi o locali) | agenti Sonnet in parallelo, uno per gruppo; il principale rilegge le fonti | medio–alto |
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

## Sul computer di Enrico
- Node.js è una cartella portatile, fuori dal PATH: `C:\Users\Windows11\tools\node-v24.21.0-win-x64`. In Bash: `export PATH="/c/Users/Windows11/tools/node-v24.21.0-win-x64:$PATH"` prima di `npm` e `node`.
- Python non c'è. Chrome ed Edge ci sono: le immagini da telefono si fanno con Chrome senza finestra, senza installare niente.
- `gh` (GitHub da riga di comando) non c'è: repository e progetti Vercel li crea Enrico, con le istruzioni passo passo.
- **axe e Lighthouse** (OK di Enrico, 07/10/2026) sono in `C:\Users\Windows11\tools\controlli` (fuori dal progetto: `package.json` non cambia). Controllati il 07/10/2026: nessuno script di installazione; Lighthouse manda errori a Google solo se glielo permetti, quindi sempre `--no-enable-error-reporting`. Lighthouse, con il sito in locale (`preview_start nextstop`): `CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node /c/Users/Windows11/tools/controlli/node_modules/lighthouse/cli/index.js http://localhost:4322/ --no-enable-error-reporting --quiet --chrome-flags="--headless=new" --output=json --output-path=<file>`. axe: copia `node_modules/axe-core/axe.min.js` in `dist/_axe.js`, caricalo nella pagina dal browser e lancia `axe.run()` in chiaro e scuro (con `*{transition:none}`: nel pannello le transizioni vanno lente e falsano i contrasti); poi cancella `dist/_axe.js`. In locale il server non comprime: su Vercel la velocità è un po' più alta.
