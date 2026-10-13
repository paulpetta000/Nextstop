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
  // Controllare anche il contenuto Git, che normalizza i fine riga del checkout Windows.
  const index = execFileSync('git', ['ls-files', '--stage', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const expected = new Map(index.map(line => { const [metadata, filename] = line.split('\t'); return [filename, metadata.split(' ')[1]]; }));
  const trackedDesigns = previous.filter(p => expected.has(p));
  const watched = [...tracked, ...trackedDesigns];
  const current = execFileSync('git', ['hash-object', '--stdin-paths'], { cwd: root, encoding: 'utf8', input: watched.join('\n') + '\n' }).trim().split('\n');
  const gitContentDifferences = watched.filter((p, i) => current[i].trim() !== expected.get(p));
  const untrackedDifferences = differences.filter(d => !expected.has(d.path));
  const report = { inputs: tracked.length, previousDesigns: previous.length, trackedDesigns: trackedDesigns.length, differences, gitContentDifferences, untrackedDifferences };
  fs.writeFileSync(path.join(dir, 'verifiche/conservazione.json'), JSON.stringify(report, null, 2) + '\n');
  if (gitContentDifferences.length || untrackedDifferences.length) throw new Error('Contenuto Git o design non tracciati diversi. Non ripristinare automaticamente.');
  console.log(`Conservazione: ${tracked.length} input Git e ${trackedDesigns.length} design tracciati identici all’indice; ${previous.length} design confrontati con la base. ${differences.length} differenze di hash registrate senza ripristini.`);
}
