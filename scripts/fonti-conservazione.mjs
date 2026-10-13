import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base='c5a6fa7';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:20*1024*1024});
const hash=b=>createHash('sha256').update(b).digest('hex');
const files=git('ls-tree','-r','--name-only',base,'src/data','src/testi','src/lib/itinerari','src/scripts/itinerari','public','design','integrations','src/config','src/lib/tappe.ts','src/lib/locali.ts','src/scripts/sito.ts').trim().split('\n');
const changes=[],rows=[];
const batch=execFileSync('git',['cat-file','--batch'],{input:files.map(f=>`${base}:${f}\n`).join(''),maxBuffer:500*1024*1024});
let offset=0;
for(const file of files){
 const end=batch.indexOf(10,offset),size=Number(batch.subarray(offset,end).toString().split(' ').at(-1));
 const expected=batch.subarray(end+1,end+1+size);offset=end+size+2;
 const actual=fs.readFileSync(file);
 const exact=hash(actual)===hash(expected);
 const textEquivalent=!actual.includes(0)&&actual.toString('utf8').replaceAll('\r\n','\n')===expected.toString('utf8').replaceAll('\r\n','\n');
 rows.push({file,exact,textEquivalent});if(!exact&&!textEquivalent)changes.push(file);
}
const html=fs.readFileSync('dist/fonti/index.html','utf8');
const ids=[...html.matchAll(/data-source-id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,195);assert.equal(new Set(ids).size,195);
assert.ok(!html.includes('americascup.com'));
const panel=fs.readFileSync('dist/napoli/itinerari/index.html','utf8');
assert.ok(panel.includes('data-source-id="tp-catacombe-sangennaro"'));
const output={base,files:rows.length,changes,rows,archiveDocuments:ids.length,itinerariDocuments:[...panel.matchAll(/data-source-id="([^"]+)"/g)].length};
fs.writeFileSync('docs/storico/fonti-blocco-5-verifiche/conservazione.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({files:rows.length,changes,archiveDocuments:ids.length,itinerariDocuments:output.itinerariDocuments}));
assert.deepEqual(changes,[]);
