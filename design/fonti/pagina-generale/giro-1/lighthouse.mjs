// Controllo già autorizzato in tools/controlli. Nessuna installazione o segnalazione errori.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const dir=path.dirname(fileURLToPath(import.meta.url));const summary=[];let failed=false;
const keys=process.argv[2]?[process.argv[2]]:['a','b','c','d'];
const themes=process.argv[3]?[process.argv[3]]:['light','dark'];
if(keys.some(k=>!['a','b','c','d'].includes(k))||themes.some(t=>!['light','dark'].includes(t)))throw new Error('Caso non previsto.');
fs.mkdirSync(path.join(dir,'verifiche'),{recursive:true});
for(const key of keys)for(const theme of themes){
  const output=path.join(dir,`verifiche/lighthouse-${key}-${theme}.json`);
  const result=spawnSync(process.execPath,['C:/Users/Windows11/tools/controlli/node_modules/lighthouse/cli/index.js',`http://127.0.0.1:4347/design/fonti/pagina-generale/giro-1/${key}-lungo.html`,'--no-enable-error-reporting','--quiet','--only-categories=performance,accessibility,best-practices','--form-factor=mobile',`--chrome-flags=--headless=new --disable-background-networking --disable-component-update --no-first-run${theme==='dark'?' --force-dark-mode':''}`,'--output=json',`--output-path=${output}`],{encoding:'utf8',env:{...process.env,CHROME_PATH:'C:/Program Files/Google/Chrome/Application/chrome.exe'}});
  if(result.status!==0){console.error(JSON.stringify({status:result.status,error:result.error?.message,signal:result.signal,stderr:result.stderr.slice(0,1000),stdout:result.stdout.slice(0,1000)}));failed=true;continue;}
  const r=JSON.parse(fs.readFileSync(output));const row={key,theme,scenario:195,performance:r.categories.performance.score*100,accessibility:r.categories.accessibility.score*100,bestPractices:r.categories['best-practices'].score*100,lcp:r.audits['largest-contentful-paint'].numericValue,cls:r.audits['cumulative-layout-shift'].numericValue,warnings:r.runWarnings};summary.push(row);
  if(row.performance<95||row.accessibility<100||row.bestPractices<100)failed=true;console.log(JSON.stringify(row));
}
const output=path.join(dir,'verifiche/lighthouse-riepilogo.json');const old=process.argv[2]&&fs.existsSync(output)?JSON.parse(fs.readFileSync(output)).filter(r=>!summary.some(s=>s.key===r.key&&s.theme===r.theme)):[];
fs.writeFileSync(output,JSON.stringify([...old,...summary],null,2)+'\n');if(failed)process.exitCode=1;
