// Scrive i file del marchio scelto in design/logo/scelto/: SVG per ogni posto e PNG per le icone.
// Uso: node design/logo/genera-marchio.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { marchio } from './marchio.mjs';
const QUI = path.dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)(path.join(QUI, '../../node_modules/sharp'));
const OUT = path.join(QUI, 'scelto');
fs.mkdirSync(OUT, { recursive: true });
const file = {
  'icona.svg': marchio('icona', { tondo: 12 }),
  'icona-quadrata.svg': marchio('icona', { tondo: 0 }),
  'segno-chiaro.svg': marchio('chiaro'),
  'segno-scuro.svg': marchio('scuro'),
  'segno-foto.svg': marchio('foto')
};
for (const [nome, svg] of Object.entries(file)) fs.writeFileSync(path.join(OUT, nome), svg + '\n');
for (const px of [16, 32, 48, 180, 192, 512]) await sharp(Buffer.from(file['icona-quadrata.svg']), { density: 72 * px / 48 * 2 }).resize(px, px).png().toFile(path.join(OUT, `icona-${px}.png`));
console.log('Scritti in design/logo/scelto/:', fs.readdirSync(OUT).join(', '));
