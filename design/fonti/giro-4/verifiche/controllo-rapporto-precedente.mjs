// Solo lettura dell'artefatto che ha mostrato un hash diverso; nessun ripristino.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root = new URL('../../../../', import.meta.url);
const filename = 'design/fonti/giro-1/verifiche/lighthouse-b-dark.json';
const head = execFileSync('git', ['cat-file', 'blob', 'HEAD:' + filename], { cwd: root, maxBuffer: 8 * 1024 * 1024 });
const current = fs.readFileSync(new URL(filename, root));
const hash = b => createHash('sha256').update(b).digest('hex');
const changes = [];
function compare(a, b, prefix = '') {
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) compare(a[key], b[key], prefix ? prefix + '.' + key : key);
  } else if (a !== b) changes.push({ path: prefix, before: a, after: b });
}
compare(JSON.parse(head), JSON.parse(current));
const report = { path: filename, headSha256: hash(head), currentSha256: hash(current), normalizedSha256: hash(Buffer.from(current.toString('utf8').replace(/\r\n/g, '\n'))), modifiedAt: fs.statSync(new URL(filename, root)).mtime.toISOString(), changedFields: changes };
fs.writeFileSync(new URL('controllo-rapporto-precedente.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
