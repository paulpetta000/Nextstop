// Snapshot locale prima del lavoro; nessun ripristino automatico.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../../..');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const snapshot = () => Object.fromEntries(['src','public','design','.agents','.claude/skills'].flatMap(p => walk(path.join(root,p))).filter(p => !p.startsWith(dir + path.sep)).concat(['package.json','package-lock.json','astro.config.mjs','DESIGN.md'].map(p => path.join(root,p)).filter(fs.existsSync)).map(p => [path.relative(root,p).replaceAll('\\','/'),crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
const base = path.join(dir,'base-conservazione.json');
if (process.argv.includes('--base')) {
  if (fs.existsSync(base)) throw new Error('La base esiste già.');
  fs.writeFileSync(base,JSON.stringify(snapshot(),null,2)+'\n');
  console.log('Base conservazione registrata.');
} else {
  const before = JSON.parse(fs.readFileSync(base)); const after = snapshot();
  const changed = [...new Set([...Object.keys(before),...Object.keys(after)])].filter(p => before[p] !== after[p]);
  const result = { checked:Object.keys(before).length,changed,siteInputs:Object.keys(before).filter(p => /^(src|public)\//.test(p)).length,previousDesigns:Object.keys(before).filter(p => p.startsWith('design/')).length };
  fs.mkdirSync(path.join(dir,'verifiche'),{recursive:true});
  fs.writeFileSync(path.join(dir,'verifiche/conservazione.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result)); if(changed.length) process.exitCode=1;
}
