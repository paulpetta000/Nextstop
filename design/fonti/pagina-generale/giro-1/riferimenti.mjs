// Controlla i soli riferimenti locali nuovi: non contatta gli editori.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(dir,'../../../..');
const files=['PROGRESS.md','specifiche/fonti-e-controlli.md','docs/storico/2026-10-12-fonti-blocco-4.md',path.relative(root,path.join(dir,'README.md'))].map(p=>path.join(root,p)).concat(fs.readdirSync(dir).filter(f=>f.endsWith('.html')).map(f=>path.join(dir,f)));
const failures=[];let checked=0,external=0;
for(const file of files){
  const html=file.endsWith('.html');const text=fs.readFileSync(file,'utf8');
  const values=html?[...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...text.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
  for(const value of values){
    if(/^(?:https?:|mailto:)/.test(value)){external++;continue;}
    const [local,anchor]=value.split('#');const target=local?local.startsWith('/')?path.join(root,/^\/(?:fonts\/|favicon\.svg)/.test(local)?'public':'dist',local.slice(1)):path.resolve(path.dirname(file),local):file;
    let resolved=target;if(fs.existsSync(target)&&fs.statSync(target).isDirectory())resolved=path.join(target,'index.html');
    checked++;if(!fs.existsSync(resolved)){failures.push(`${path.relative(root,file)} -> ${value}`);continue;}
    if(html&&anchor&&resolved.endsWith('.html')&&!fs.readFileSync(resolved,'utf8').includes(`id="${anchor}"`))failures.push(`Ancora: ${path.relative(root,file)} -> ${value}`);
  }
}
const result={files:files.length,local:checked,externalNotChecked:external,failures};
fs.writeFileSync(path.join(dir,'verifiche/riferimenti.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(failures.length)process.exitCode=1;
