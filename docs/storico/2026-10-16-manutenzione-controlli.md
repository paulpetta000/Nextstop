# Terzo blocco · documentazione e controlli (16/10/2026)

Autorizzato da Enrico con «ok vai», dopo i primi due blocchi dell'audit. Ramo `codex/manutenzione-controlli`, dalla base locale `3236b0d` (che include `939e882` e main `75d25e6`). Lavoro nella worktree aggiornata; la cartella iniziale e le sue bozze restano separate. Nessun push, merge, deploy, installazione o cambiamento di impostazioni remote.

## Cosa cambia

- `AGENTS.md`, `README.md`, `docs/README.md`: punto d'ingresso reale del compositore, moduli della mappa e del riordino, mappa delle cartelle, distinzione fra funzionalità costruite e proposte. Installazione riproducibile dal lockfile, test correnti e limiti del workflow documentati.
- `PROGRESS.md`: stato corrente breve. Il testo precedente è conservato nello [snapshot](2026-10-16-PROGRESS-prima-manutenzione.md), adattando soltanto i riferimenti relativi e aggiungendo una nota storica; nessuna decisione o resoconto eliminati.
- `.github/workflows/ci.yml`: PR verso main, push su main e avvio manuale; checkout per identificativo esatto dell'evento, con confronto di HEAD, errore esplicito se non disponibile e nessun ripiego. Permessi di sola lettura, token non persistito, nessuna Action esterna, stessa sequenza installazione/test/build/link.
- `test/ci.test.mjs`: sei prove con Git e Bash su repository temporanei, senza rete. Riproducono lo spostamento del riferimento dopo l'evento e verificano anche riferimento eliminato, commit mancante e identificativo malformato.
- `docs/MANUTENZIONE.md`: procedura concreta per verificare il commit integrabile, regola GitHub proposta, analisi dei punti d'ingresso delle cinque dipendenze segnalate, piano del controllo dei tipi e criteri per ordinare gli archivi senza perdite.
- `docs/AMBIENTE-LOCALE.md`: rimedio WebAssembly già osservato, limiti della junction e prerequisiti Git/Bash dei nuovi test.
- `aggiornamenti/fonti-dati.yaml`: documentati anche il generatore già esistente delle strade a pezzi e il suo output. Date di controllo, scadenze, licenze e dati generati invariati; nessun download effettuato.

## Verifiche

Node locale 24.21.0, npm 11.19.0, Git/Bash di Git for Windows già disponibili; nessun pacchetto aggiunto.

1. Prima della correzione, **6/6 prove della CI fallivano**: il vecchio workflow leggeva la ref corrente senza confrontarla con il commit dell'evento. La prova su ref eliminata riproduce anche la classe di errore del [run storico](https://github.com/paulpetta000/Nextstop/actions/runs/38646200888); non dimostra che quella specifica esecuzione avrebbe potuto recuperare l'oggetto su GitHub.
2. Dopo la correzione, **6/6 prove passano**. Un commit precedente resta quello verificato quando il ramo avanza; un identificativo indisponibile o malformato causa errore. Token sintetico assente dalla configurazione Git.
3. `npm test`: **159/159**, nessuno saltato, circa 8,1 secondi. I sei nuovi casi richiedono circa sette secondi su questo computer; non installano o scaricano nulla.
4. **101 riferimenti locali** validi, compresi gli ancoraggi dei documenti; YAML del workflow e del registro leggibili; sintassi Bash valida per tutti i sei passi. Snapshot precedente verificato integralmente, con i soli collegamenti relativi adattati. Date e licenze del registro conservate; input del sito, package/lockfile, configurazione Astro e tsconfig identici a `3236b0d`. `git diff --check` senza errori.

Il codice del sito e gli input della build sono identici al secondo blocco: build e controllo degli 809 link già riusciti su `3236b0d` non ripetuti, secondo le regole per i controlli proporzionati. Nessuna nuova scansione del browser o misurazione Lighthouse dichiarata per questo blocco.

## Risultato e limiti

Il rischio di un verde sul commit sbagliato è corretto nel workflow locale. Il nuovo workflow non è ancora eseguito su GitHub: servirà il push/PR autorizzato. L'API ricontrollata il 16/10 restituisce main ancora `75d25e6`, non protetto, ruleset vuoti. La regola proposta è documentata ma **non attivata**; i controlli non costituiscono ancora una barriera obbligatoria al merge. Il fetch locale di oggetti senza ref non garantisce la disponibilità degli stessi sul server GitHub.

L'audit dipendenze resta aperto: versioni fissate e punti d'uso analizzati, nessun aggiornamento testato o applicato. TypeScript e `@astrojs/check` assenti: non è stato eseguito né aggiunto un controllo completo dei tipi. Per queste attività servono revisione dei pacchetti e autorizzazione all'installazione, come richiesto dalle regole comuni.

L'inventario delle dipendenze usa il lockfile: `npm ls --all` con la junction ha prodotto segnalazioni estese su pacchetti estranei/mancanti, comprese dipendenze di sviluppo interne. `npm ls --package-lock-only --all --json` è riuscito; le sei versioni principali esaminate corrispondono ai manifest locali. Nessuna pulizia automatica di node_modules eseguita e nessuna installazione nuova certificata.

Non sono state cancellate immagini, proposte o ricerche. I risultati grezzi del blocco sono nella cartella locale dell'audit `C:/Users/Windows11/Documents/nextstop/ricerca/2026-10-16-analisi-progetto/`, prefisso `blocco-3-`; questo documento e le prove riproducibili della CI sono invece versionati. Il rapporto generale iniziale è ancora conservato nella cartella primaria, non è stato trasformato in un collegamento relativo inesistente della worktree.

## Seguito consigliato

Prima di una semplificazione estesa, consiglio un blocco circoscritto agli aggiornamenti di sicurezza, iniziando da sharp e dalle transitive compatibili. L'installazione richiede l'OK dopo la scelta e revisione dei pacchetti; la guida specifica criteri e controlli. Per ordinare QA e archivi si può lavorare localmente senza installazioni; nessuna riscrittura del compositore o della storia Git è autorizzata da questo resoconto.

Per l'integrazione dei tre blocchi: autorizzazione a push/PR, controlli GitHub sul merge attuale, anteprima Vercel con prestazioni mobile almeno 95, quindi consenso al rilascio. Sono fasi ancora da svolgere, non risultati di questo blocco.
