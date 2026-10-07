// Genera favicon e icone dell'app dal marchio, la soglia astratta (src/lib/marchio.mjs): node scripts/icone.mjs
// Sotto i 24 px e sul telefono si usa l'icona con il fondo blu notte (DESIGN.md §7).
import sharp from 'sharp';
import fs from 'node:fs';
import { marchio, COLORI } from '../src/lib/marchio.mjs';

const tonda = marchio('icona', { tondo: 10 });      // scheda del browser: angoli arrotondati
const quadrata = marchio('icona', { tondo: 0 });    // telefono e Google: il sistema arrotonda o ritaglia da sé
// «maskable»: Android ritaglia l'icona in forme diverse; il segno sta nel cerchio centrale (80%), il fondo arriva ai bordi
const m = 9;
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-m} ${-m} ${48 + 2 * m} ${48 + 2 * m}"><rect x="${-m}" y="${-m}" width="${48 + 2 * m}" height="${48 + 2 * m}" fill="${COLORI.icona.fondo}"/>${quadrata.replace('<svg ', '<svg x="0" y="0" width="48" height="48" ')}</svg>`;

fs.writeFileSync('public/favicon.svg', tonda + '\n');
const png = (s, n) => sharp(Buffer.from(s), { density: 72 * n / 48 * 2 }).resize(n, n).png();
await png(quadrata, 192).toFile('public/icons/icon-192.png');
await png(quadrata, 512).toFile('public/icons/icon-512.png');
await png(maskable, 512).toFile('public/icons/icon-maskable-512.png');
await png(quadrata, 180).toFile('public/icons/apple-touch-icon.png');

// Google Search non usa le icone SVG: per i risultati di ricerca servono anche un PNG (multiplo di 48 px)
// e il classico favicon.ico, qui con dentro tre PNG da 16, 32 e 48 px
await png(quadrata, 96).toFile('public/icons/favicon-96.png');
const lati = [16, 32, 48];
const pngs = await Promise.all(lati.map(n => png(tonda, n).toBuffer()));
const testa = Buffer.alloc(6);
testa.writeUInt16LE(0, 0); testa.writeUInt16LE(1, 2); testa.writeUInt16LE(lati.length, 4);
let posizione = 6 + 16 * lati.length;
const elenco = lati.map((n, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(n, 0); e.writeUInt8(n, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(posizione, 12);
  posizione += pngs[i].length;
  return e;
});
fs.writeFileSync('public/favicon.ico', Buffer.concat([testa, ...elenco, ...pngs]));
console.log('icone ok');
