// Tranche 2, pezzo 2 (selettore dell'ora), giro 1: mette le giornate vere di «Due giorni a Napoli» (giornate.mjs, il calcolo del
// sito sui tempi della build), caratteri e sfondi dentro modello.html (+ stile.css, app.js) e scrive proposte.html, la pagina da
// pubblicare. Solo Node e js-yaml del progetto. Prima serve una build (npm run build: legge dist/napoli/itinerari).
// Uso: node --no-liftoff design/compositore/rifiniture-2/ora-giro-1/genera.mjs (senza --no-liftoff Node 24, su questo computer, a volte
// non riusciva a togliere i tipi dai file .ts: errori di WebAssembly diversi a ogni avvio)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { giornate } from './giornate.mjs';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const RADICE = path.resolve(QUI, '../../../..');
const yaml = createRequire(import.meta.url)(path.join(RADICE, 'node_modules/js-yaml'));
const leggi = f => yaml.load(fs.readFileSync(path.join(RADICE, f), 'utf8'));

const pronti = leggi('src/data/itinerari-pronti.yaml');
const tappe = leggi('src/data/tappe.yaml');
const ID = 'due-giorni';
const p = pronti.find(x => x.id === ID);
const usate = new Set(p.giorni.flatMap(g => g.tappe));
const nomi = Object.fromEntries(tappe.filter(t => usate.has(t.id)).map(t => [t.id, t.breve ?? t.nome]));
const DATI = { nome: p.nome, giorni: giornate(pronti, [ID])[ID], nomi };

const b64 = f => fs.readFileSync(f).toString('base64');
const font = (fam, file, extra) => `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${b64(path.join(RADICE, 'public/fonts', file))}) format('woff2');font-display:swap;${extra}}`;
const caratteri = [
  font('Archivo', 'archivo-var.woff2', 'font-weight:400 900;font-stretch:62% 125%;'),
  font('Bodoni Moda', 'bodoni-moda-600.woff2', 'font-weight:600;'),
  font('Bodoni Moda', 'bodoni-moda-500-corsivo.woff2', 'font-weight:500;font-style:italic;')
].join('\n');
const sfondi = Object.fromEntries(fs.readdirSync(path.join(QUI, 'sfondi')).map(f => [f.replace('.jpg', ''), `data:image/jpeg;base64,${b64(path.join(QUI, 'sfondi', f))}`]));

let html = fs.readFileSync(path.join(QUI, 'modello.html'), 'utf8');
html = html
  .replace('/*CARATTERI*/', () => caratteri)
  .replace('/*STILE*/', () => fs.readFileSync(path.join(QUI, 'stile.css'), 'utf8'))
  .replace('/*APP*/', () => fs.readFileSync(path.join(QUI, 'app.js'), 'utf8')
    .replace('/*DATI*/null', () => JSON.stringify(DATI))
    .replace('/*SFONDI*/null', () => JSON.stringify(sfondi)));
fs.writeFileSync(path.join(QUI, 'proposte.html'), html);
const fine = DATI.giorni.map(g => g.per[g.inizio].fine).map(m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`);
console.log(`proposte.html: ${(html.length / 1024).toFixed(0)} KB; con l'inizio del pronto finisci alle ${fine.join(' e alle ')}`);
