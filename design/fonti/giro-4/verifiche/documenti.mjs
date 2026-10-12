// Riferimenti dei soli documenti e prototipi del blocco, senza leggere l'inventario storico.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esempi, lungo } from '../contenuti.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const docs = ['PROGRESS.md', 'specifiche/fonti-e-controlli.md', 'ricerca/2026-10-12-fonti-d-rifiniture.md', 'docs/storico/2026-10-12-fonti-giro-4.md', 'design/fonti/giro-4/README.md'];
const missing = [];
let references = 0;
for (const name of docs) {
  const filename = path.join(root, name);
  for (const [, href] of fs.readFileSync(filename, 'utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    if (/^(?:https?:|mailto:|#)/.test(href)) continue;
    const target = path.resolve(path.dirname(filename), decodeURIComponent(href.split('#')[0]));
    references++;
    if (!fs.existsSync(target)) missing.push({ name, href });
  }
}
for (const name of ['d', 'd-lungo', 'd-breve', 'd-vuoto']) {
  const filename = path.join(root, 'design/fonti/giro-4', name + '.html');
  const html = fs.readFileSync(filename, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:)/.test(href)) continue;
    references++;
    if (href.startsWith('#')) { if (!ids.has(href.slice(1))) missing.push({ name, href }); continue; }
    const target = href.startsWith('/') ? path.join(root, href.startsWith('/fonts/') || href === '/favicon.svg' ? 'public' : 'dist', href.slice(1)) : path.resolve(path.dirname(filename), href);
    if (!fs.existsSync(target)) missing.push({ name, href });
  }
}
const report = { references, missing, examples: esempi.length, long: lungo.length, descriptions: lungo.filter(s => s.descrizione).length, pendingDescriptions: lungo.filter(s => !s.descrizione).length };
fs.writeFileSync(new URL('documenti.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
if (missing.length) process.exitCode = 1;
