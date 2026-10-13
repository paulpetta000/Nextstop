// Riferimenti locali dei documenti pertinenti; nessuna scansione dell'inventario storico.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const files = ['PROGRESS.md', 'specifiche/fonti-e-controlli.md', 'design/fonti/giro-2/README.md', 'docs/storico/2026-10-12-fonti-giro-2.md'];
const missing = [];
let count = 0;
for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const href = match[1];
    if (/^[a-z][a-z0-9+.-]*:|^#|^\//i.test(href)) continue;
    const destination = path.resolve(path.dirname(path.join(root, file)), decodeURIComponent(href.split('#')[0]));
    count++;
    if (!fs.existsSync(destination)) missing.push({ file, href });
  }
}
const report = { documents: files, references: count, missing };
fs.writeFileSync(new URL('verifiche/documenti.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(`${count} riferimenti locali controllati; ${missing.length} mancanti.`);
if (missing.length) process.exitCode = 1;
