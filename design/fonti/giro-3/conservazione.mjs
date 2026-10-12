import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../..');
const all = p => fs.readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? all(path.join(p, e.name)) : [path.join(p, e.name)]);
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const tracked = execFileSync('git', ['ls-files', '-z', '--', 'src', 'public', 'integrations', 'scripts', 'test', 'astro.config.mjs', 'package.json', 'package-lock.json'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const previous = all(path.join(root, 'design')).filter(p => !p.startsWith(dir + path.sep)).map(p => path.relative(root, p).replaceAll('\\', '/'));
const baseline = path.join(dir, 'base-conservazione.json');
if (process.argv.includes('--registra')) {
  if (fs.existsSync(baseline)) throw new Error('La base esiste già: non sovrascriverla.');
  fs.writeFileSync(baseline, JSON.stringify(Object.fromEntries([...tracked, ...previous].map(p => [p, { hash: hash(path.join(root, p)), modifiedAt: fs.statSync(path.join(root, p)).mtime.toISOString() }])), null, 2) + '\n');
  console.log(`Base registrata: ${tracked.length} input del sito, ${previous.length} file dei design precedenti.`);
} else {
  const base = JSON.parse(fs.readFileSync(baseline));
  const differences = Object.entries(base).filter(([p, b]) => !fs.existsSync(path.join(root, p)) || hash(path.join(root, p)) !== b.hash).map(([p, b]) => ({ path: p, before: b, after: fs.existsSync(path.join(root, p)) ? { hash: hash(path.join(root, p)), modifiedAt: fs.statSync(path.join(root, p)).mtime.toISOString() } : null }));
  const report = { inputs: tracked.length, previousDesigns: previous.length, differences };
  fs.writeFileSync(path.join(dir, 'verifiche/conservazione.json'), JSON.stringify(report, null, 2) + '\n');
  if (differences.some(d => !d.path.startsWith('design/') || d.path.startsWith('design/fonti/giro-1/'))) throw new Error('Input del sito o primo giro cambiati.');
  console.log(`Conservazione verificata. ${differences.length} differenze negli altri artefatti registrate senza ripristini.`);
}
