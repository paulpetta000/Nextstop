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
