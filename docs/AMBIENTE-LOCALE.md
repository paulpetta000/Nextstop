# Ambiente locale · computer di Enrico

Aprire solo per eseguire comandi o verificare anteprime su questo computer. Questi percorsi non si applicano automaticamente al cloud o ai runner GitHub.

## Sul computer di Enrico
- Node.js è una cartella portatile, fuori dal PATH: `C:\Users\Windows11\tools\node-v24.21.0-win-x64`. In Bash: `export PATH="/c/Users/Windows11/tools/node-v24.21.0-win-x64:$PATH"` prima di `npm` e `node`.
- Python non c'è. Chrome ed Edge ci sono: le immagini da telefono si fanno con Chrome senza finestra, senza installare niente.
- `gh` (GitHub da riga di comando) non c'è: repository e progetti Vercel li crea Enrico, con le istruzioni passo passo.
- **axe e Lighthouse** (OK di Enrico, 07/10/2026) sono in `C:\Users\Windows11\tools\controlli` (fuori dal progetto: `package.json` non cambia). Controllati il 07/10/2026: nessuno script di installazione; Lighthouse manda errori a Google solo se glielo permetti, quindi sempre `--no-enable-error-reporting`. Lighthouse, con il sito in locale (`preview_start nextstop`): `CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node /c/Users/Windows11/tools/controlli/node_modules/lighthouse/cli/index.js http://localhost:4322/ --no-enable-error-reporting --quiet --chrome-flags="--headless=new" --output=json --output-path=<file>`. axe: copia `node_modules/axe-core/axe.min.js` in `dist/_axe.js`, caricalo nella pagina dal browser e lancia `axe.run()` in chiaro e scuro (con `*{transition:none}`: nel pannello le transizioni vanno lente e falsano i contrasti); poi cancella `dist/_axe.js`. In locale il server non comprime: su Vercel la velocità è un po' più alta.

## PowerShell e verifiche

Node non è nel PATH predefinito. Per il solo processo corrente:

```powershell
$env:PATH = 'C:\Users\Windows11\tools\node-v24.21.0-win-x64;' + $env:PATH
npm.cmd test
npm.cmd run build
npm.cmd run check:links
```

I tre comandi sono per blocchi che cambiano codice/dati; per sola documentazione valgono i controlli proporzionati delle [regole comuni](REGOLE.md#verifiche-e-letture). Non reinstallare dipendenze già disponibili e non cambiare il PATH permanente.

`preview_start` è uno strumento dell'ambiente Claude, quando disponibile. In un ambiente diverso usa un server locale già previsto dal progetto (`npm run dev` o `npm run preview`) e la porta realmente indicata. Gli script per fotografare i bozzetti si consultano nel loro ramo, senza copiare proposte nella manutenzione.

## Limiti riproducibili osservati il 16/10/2026

Node 24.21.0 è l’ambiente locale verificato; resta valido il requisito Node >=22.12, ma non è una matrice di versioni tutte provate. Se la build si blocca o termina con errori WebAssembly senza una diagnosi applicativa, il rimedio già usato è `node --no-liftoff node_modules/astro/bin/astro.mjs build`, una volta, con telemetria disabilitata. Riportare quale comando è riuscito: non attribuire il crash automaticamente al sito.

Fino al terzo blocco la worktree dell’audit riusava `node_modules` della cartella iniziale tramite una sola junction: non era una nuova installazione. Nel blocco Sharp la worktree ha una cartella `node_modules` propria con collegamenti ai pacchetti già presenti e una catena Sharp 0.35.5 installata e verificata separatamente in `node_modules/.sharp-verifica/`. La cartella iniziale mantiene Sharp 0.33.5; non sincronizzarla o ripulirla automaticamente. Non è stata rifatta l’installazione completa del sito. `npm ls --all` in questa disposizione ha segnalato pacchetti estranei/mancanti anche fra le dipendenze di sviluppo dei pacchetti; per inventariare le versioni fissate è stato usato `npm ls --package-lock-only --all --json`. Questo non sostituisce una futura installazione pulita autorizzata.

Le prove `test/ci.test.mjs` usano Git e Bash già forniti da Git for Windows (`C:/Program Files/Git/bin/bash.exe`); non richiedono token o rete. Sul runner Ubuntu usano `bash` dal PATH.

Nel blocco cache/sourcemap, due pacchetti senza dipendenze runtime sono installati in `node_modules/.cache-sourcemap-verifica/`. Per risolverli davvero dalla worktree, i percorsi di Astro, Vite, PostCSS, css-tree, csso, magicast e `.bin` sono materializzati con hardlink ai file esistenti; il contenuto è invariato. La traccia della build conferma cache 4.3.0 e sourcemap 1.2.2. Le copie primarie restano 4.2.0 e 1.2.1; non aggiornare o ripulire automaticamente la cartella iniziale. Non è un’installazione completa nuova del progetto.
