// Riferimenti locali e ancore: nessun contatto con gli editori.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../../../..');
const docs=['PROGRESS.md','specifiche/fonti-e-controlli.md','docs/storico/2026-10-12-fonti-pagina-giro-2.md','design/fonti/pagina-generale/giro-2/README.md'];
const files=docs.map(p=>path.join(root,p)).concat(fs.readdirSync(dir).filter(f=>f.endsWith('.html')).map(f=>path.join(dir,f)));
let checked=0,external=0;const failures=[];
for(const file of files){
  const html=file.endsWith('.html'),body=fs.readFileSync(file,'utf8');
  const refs=html?[...body.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...body.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
  for(const href of refs){
    if(/^(https?:|mailto:)/.test(href)){external++;continue;}
    const [local,anchor]=href.split('#');
    let target=local?(local.startsWith('/')?path.join(root,/^\/(fonts\/|favicon\.svg)/.test(local)?'public':'dist',local.slice(1)):path.resolve(path.dirname(file),decodeURIComponent(local))):file;
    if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');checked++;
    if(!fs.existsSync(target)){failures.push({file:path.relative(root,file),href});continue;}
    if(anchor){
      const text=fs.readFileSync(target,'utf8');
      const valid=target.endsWith('.html')?text.includes(`id="${anchor}"`):target.endsWith('.md')?[...text.matchAll(/^#+\s+(.+)$/gm)].some(m=>m[1].toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/\s/g,'-')===anchor):true;
      if(!valid)failures.push({file:path.relative(root,file),href,reason:'anchor'});
    }
  }
}
const result={files:files.length,checked,externalNotChecked:external,failures};
fs.writeFileSync(path.join(dir,'verifiche/riferimenti.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(failures.length)process.exitCode=1;
