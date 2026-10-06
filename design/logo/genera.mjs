// Mette la foto di prova (Spaccanapoli, CC BY-SA 3.0, autore in src/data/foto.yaml) dentro design/logo/${process.argv[2] || "loghi.html"}
// e scrive design/logo/loghi-pagina.html, la pagina da pubblicare. Uso: node design/logo/genera.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const QUI = path.dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)(path.join(QUI, '../../node_modules/sharp'));
const buf = await sharp(path.join(QUI, '../../src/assets/foto/tp-spaccanapoli.jpg')).resize({ width: 600 }).jpeg({ quality: 68, mozjpeg: true }).toBuffer();
const html = fs.readFileSync(path.join(QUI, process.argv[2] ?? 'loghi.html'), 'utf8').replace('<!--FOTO-->', `<script>window.FOTO_LOGO="data:image/jpeg;base64,${buf.toString('base64')}";</script>`);
const uscita = process.argv[3] ?? 'loghi-pagina.html';
fs.writeFileSync(path.join(QUI, uscita), html);
console.log(uscita, (html.length / 1024).toFixed(0), 'KB');
