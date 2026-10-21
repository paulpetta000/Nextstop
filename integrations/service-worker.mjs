// Genera dist/sw.js dopo la build: salva le pagine degli itinerari (anche senza rete)
// e aggiorna la copia ogni volta che il sito cambia.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { verificaPercorsiPubblicati } from './verifica-percorsi.mjs';

// Pagine salvate subito alla prima visita: le informazioni pratiche
const CORE = [
  '/',
  '/napoli/',
  '/napoli/itinerari/',
  '/napoli/dove-mangiare/',
  '/offline/'
];
// Pagine che devono funzionare senza rete anche nelle parti interattive: con loro si salvano gli script
// (anche quelli caricati dopo, come la mappa), i dati e le miniature delle tappe (il campo "foto" dei dati
// della pagina). Le foto grandi no: si salvano quando le guardi.
const INTERATTIVE = {
  // le schede del compositore (/napoli/itinerari/schede/) arrivano dopo il primo disegno: si salvano con la pagina
  '/napoli/itinerari/': ['/napoli/itinerari/schede/', '/napoli/itinerari/strade/indice.json', '/napoli/itinerari/mappa.json', '/napoli/itinerari/scenari.json', '/napoli/itinerari/percorsi.json', '/napoli/itinerari/partenze.json'],
  '/napoli/dove-mangiare/': []
};

export default function serviceWorker() {
  return {
    name: 'service-worker',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        verificaPercorsiPubblicati(out);
        const files = [];
        for (const url of CORE) {
          const f = path.join(out, url, 'index.html');
          if (!fs.existsSync(f)) { logger.warn(`Pagina offline mancante: ${url}`); continue; }
          files.push([url, f]);
        }
        // script, dati e immagini piccole delle pagine interattive (anche gli script importati da altri script)
        const visti = new Set();
        const aggiungi = (u) => {
          if (visti.has(u)) return;
          const f = path.join(out, u, u.endsWith('/') ? 'index.html' : '');
          if (!fs.existsSync(f)) { logger.warn(`File offline mancante: ${u}`); return; }
          visti.add(u);
          files.push([u, f]);
          if (u.endsWith('.js')) {
            const js = fs.readFileSync(f, 'utf8');
            for (const m of js.matchAll(/["'`]\.\/([\w.-]+\.js)["'`]/g)) aggiungi(`/_astro/${m[1]}`);
            for (const m of js.matchAll(/["'`](\/_astro\/[\w.-]+\.js)["'`]/g)) aggiungi(m[1]);
          }
        };
        for (const [pagina, extra] of Object.entries(INTERATTIVE)) {
          const html = fs.readFileSync(path.join(out, pagina, 'index.html'), 'utf8');
          // Anche il CSS caricato separatamente deve funzionare dopo la visita alla sola home.
          for (const m of html.matchAll(/<link[^>]+href="(\/_astro\/[\w.-]+\.css)"/g)) aggiungi(m[1]);
          for (const m of html.matchAll(/<script[^>]+src="(\/_astro\/[\w.-]+\.js)"/g)) aggiungi(m[1]);
          for (const m of html.matchAll(/"foto":"(\/_astro\/[\w.-]+\.(?:webp|avif|jpe?g|png))"/g)) aggiungi(m[1]);
          for (const u of extra) aggiungi(u);
        }
        const fonts = fs.readdirSync(path.join(out, 'fonts')).filter(f => f.endsWith('.woff2')).map(f => [`/fonts/${f}`, path.join(out, 'fonts', f)]);
        const extra = ['/manifest.webmanifest', '/icons/icon-192.png'].map(u => [u, path.join(out, u)]).filter(([, f]) => fs.existsSync(f));
        const all = [...files, ...fonts, ...extra];
        const tpl = fs.readFileSync(new URL('./sw-template.js', import.meta.url), 'utf8');
        const hash = crypto.createHash('sha256').update(tpl);
        for (const [url, f] of all) hash.update(url).update(fs.readFileSync(f));
        const version = hash.digest('hex').slice(0, 12);
        // La cache dei dati cambia solo con i dati: i pezzi di mappa già visti
        // rimangono offline anche quando si pubblica una sola rifinitura grafica.
        const datiHash = crypto.createHash('sha256');
        const cartellaDati = path.join(out, 'napoli/itinerari');
        const leggiDati = cartella => {
          for (const f of fs.readdirSync(cartella, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
            const file = path.join(cartella, f.name);
            if (f.isDirectory()) leggiDati(file);
            else if (f.name.endsWith('.json') || file === path.join(cartellaDati, 'schede/index.html')) {
              datiHash.update(path.relative(cartellaDati, file).split(path.sep).join('/')).update(fs.readFileSync(file));
            }
          }
        };
        leggiDati(cartellaDati);
        const html = fs.readFileSync(path.join(cartellaDati, 'index.html'), 'utf8');
        datiHash.update(html.match(/<script\b[^>]*\bid="it-dati"[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '');
        const datiVersion = datiHash.digest('hex').slice(0, 12);
        const sw = tpl.replace('__VERSION__', version).replace('__DATA_VERSION__', datiVersion).replace('__PRECACHE__', JSON.stringify(all.map(([u]) => u)));
        fs.writeFileSync(path.join(out, 'sw.js'), sw);
        const kb = Math.round(all.reduce((s, [, f]) => s + fs.statSync(f).size, 0) / 1024);
        logger.info(`sw.js: ${all.length} file salvati per l'uso offline, ${kb} kB (versione ${version})`);
      }
    }
  };
}
