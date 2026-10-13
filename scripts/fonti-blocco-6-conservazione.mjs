// Confronti in lettura con Git: nessun checkout o ripristino di file.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:30*1024*1024});
const hash=b=>createHash('sha256').update(b).digest('hex');
const expected=new Set(['astro.config.mjs','src/components/FontiPagina.astro','src/data/fonti-metadati.json','src/lib/itinerari/calcolo.ts','src/pages/napoli/itinerari/index.astro','src/scripts/fonti/pannello.js','src/scripts/itinerari/app.ts']);
const roots=['src/data','src/testi','src/lib','src/scripts','src/components','src/pages','src/config','src/styles','public','integrations','design','astro.config.mjs','package.json','package-lock.json'];
const comparisons=[];
for(const base of ['c5a6fa7','5d02bd2']){
 const files=git('ls-tree','-r','--name-only',base,...roots).trim().split('\n');
 const batch=execFileSync('git',['cat-file','--batch'],{input:files.map(f=>`${base}:${f}\n`).join(''),maxBuffer:500*1024*1024});
 const rows=[];let offset=0;
 for(const file of files){
  const end=batch.indexOf(10,offset),size=Number(batch.subarray(offset,end).toString().split(' ').at(-1));
  const before=batch.subarray(end+1,end+1+size);offset=end+size+2;
  const after=fs.readFileSync(file),exact=hash(after)===hash(before);
  const textEquivalent=!after.includes(0)&&after.toString().replaceAll('\r\n','\n')===before.toString().replaceAll('\r\n','\n');
  rows.push({file,exact,textEquivalent});
 }
 const changes=rows.filter(r=>!r.exact&&!r.textEquivalent).map(r=>r.file);
 if(base==='5d02bd2')assert.deepEqual(changes.filter(f=>!expected.has(f)&&f!=='design/home/proposta-a.html'),[]);
 comparisons.push({base,files:rows.length,changes,rows});
}
// Queste due cartelle sono fuori dal commit. Impronta attuale, non inventata
// come fotografia iniziale della sessione.
const preexisting=git('ls-files','--others','--exclude-standard','design/compositore','design/home-napoli').trim().split('\n').filter(Boolean).map(file=>({file,sha256:hash(fs.readFileSync(file))}));
const html=fs.readFileSync('dist/fonti/index.html','utf8');
assert.equal([...html.matchAll(/data-source-id="/g)].length,195);
assert.ok(!html.includes('americascup.com'));
fs.writeFileSync('docs/storico/fonti-blocco-6-verifiche/conservazione.json',JSON.stringify({comparisons,preexisting,note:'Hash delle cartelle preesistenti acquisiti al controllo finale. Discrepanza storica proposta-a.html non corretta.'},null,2)+'\n');
console.log(JSON.stringify({comparisons:comparisons.map(({base,files,changes})=>({base,files,changes})),preexisting:preexisting.length},null,2));
