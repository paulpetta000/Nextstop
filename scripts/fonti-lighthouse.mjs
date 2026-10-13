import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const rows=[];
const dir='docs/storico/fonti-blocco-5-verifiche';
const port=process.env.FONTI_PREVIEW_PORT||'4322';
const suffix=port==='4324'?'-gzip':'';
for(const path of ['/fonti/','/napoli/itinerari/','/napoli/dove-mangiare/'])for(const theme of ['light','dark']){
 const output=`${dir}/lighthouse-${path.split('/').filter(Boolean).join('-')}-${theme}${suffix}.json`;
 const result=spawnSync(process.execPath,['C:/Users/Windows11/tools/controlli/node_modules/lighthouse/cli/index.js',`http://127.0.0.1:${port}${path}`,'--no-enable-error-reporting','--quiet','--only-categories=performance,accessibility,best-practices','--form-factor=mobile',`--chrome-flags=--headless=new --disable-background-networking --disable-component-update --no-first-run${theme==='dark'?' --force-dark-mode':''}`,'--output=json',`--output-path=${output}`],{encoding:'utf8',env:{...process.env,CHROME_PATH:'C:/Program Files/Google/Chrome/Application/chrome.exe'}});
 if(result.status!==0)throw new Error(result.stderr);
 const r=JSON.parse(fs.readFileSync(output));
 const row={path,theme,performance:r.categories.performance.score*100,accessibility:r.categories.accessibility.score*100,bestPractices:r.categories['best-practices'].score*100,lcp:r.audits['largest-contentful-paint'].numericValue,cls:r.audits['cumulative-layout-shift'].numericValue,warnings:r.runWarnings};
 rows.push(row);console.log(JSON.stringify(row));fs.writeFileSync(`${dir}/lighthouse-riepilogo${suffix}.json`,JSON.stringify(rows,null,2)+'\n');
}
