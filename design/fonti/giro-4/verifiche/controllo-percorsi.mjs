// Solo lettura: chiarisce una differenza di hash, senza ripristinare o riscrivere dati.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = new URL('../../../../', import.meta.url);
const filename = 'src/data/percorsi-alternativi.json';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const before = JSON.parse(fs.readFileSync(new URL('../base-conservazione.json', import.meta.url)))[filename];
const head = execFileSync('git', ['cat-file', 'blob', 'HEAD:' + filename], { cwd: root, maxBuffer: 8 * 1024 * 1024 });
const reads = Array.from({ length: 3 }, () => fs.readFileSync(new URL(filename, root)));
const report = { path: filename, before, headSha256: hash(head), reads: reads.map(bytes => ({ sha256: hash(bytes), equalsHead: bytes.equals(head), normalizedLF: hash(Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'))), normalizedCRLF: hash(Buffer.from(bytes.toString('utf8').replace(/\r?\n/g, '\r\n'))) })), modifiedAt: fs.statSync(new URL(filename, root)).mtime.toISOString(), gitDiff: execFileSync('git', ['diff', '--name-only', '--', filename], { cwd: root, encoding: 'utf8' }).trim() };
fs.writeFileSync(new URL('controllo-percorsi.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
