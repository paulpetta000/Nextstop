// Disegna la pietra di piperno (la pietra grigia dei portali e dei portici di Napoli): src/assets/pietra/piperno.webp,
// grande quanto un'arcata dei portici (src/components/Campata.astro), così non si ripete e non ha giunzioni.
// È fatta solo con il codice (rumore e luce dei filtri SVG): nessuna foto e nessuna immagine fatta con l'intelligenza artificiale.
// Uso: node scripts/pietra.mjs [cartella]   (senza cartella scrive in src/assets/pietra/)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

export const L = 600, A = 840;   // come l'arcata: 300 × 420 unità, a due pixel per unità
const filtro = (id, rumore, resto) => `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence ${rumore} result="t"/>
    ${resto}
  </filter>`;
const nero = '<feFuncR type="linear" slope="0"/><feFuncG type="linear" slope="0"/><feFuncB type="linear" slope="0"/>';
const STRATI = [
  // macchie scure e chiare: il colore della pietra non è mai uniforme
  filtro('macchie', 'type="fractalNoise" baseFrequency="0.0055" numOctaves="4" seed="7"',
    '<feColorMatrix in="t" type="matrix" values="0 0 0 0 0.17  0 0 0 0 0.16  0 0 0 0 0.155  1.3 0 0 0 -0.45"/>'),
  filtro('chiare', 'type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed="19"',
    '<feColorMatrix in="t" type="matrix" values="0 0 0 0 0.68  0 0 0 0 0.66  0 0 0 0 0.62  0 0 0 1.5 -0.84"/>'),
  // fiamme: le striature scure e allungate, tipiche del piperno
  filtro('fiamme', 'type="fractalNoise" baseFrequency="0.0042 0.03" numOctaves="3" seed="21"',
    `<feComponentTransfer in="t">${nero}<feFuncA type="table" tableValues="0 0 0 0 0 0 0.2 0.6 0.9 0.95"/></feComponentTransfer>
    <feColorMatrix type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.14  0 0 0 0 0.14  0 0 0 0.75 0"/>`),
  // rilievo: la superficie scabra e bucherellata, luce da sinistra in alto
  filtro('rilievo', 'type="fractalNoise" baseFrequency="0.022" numOctaves="6" seed="5"',
    `<feDiffuseLighting in="t" surfaceScale="2.4" diffuseConstant="1" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="58"/></feDiffuseLighting>
    <feColorMatrix in="l" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.08  0 0 0 0 0.08  -1.1 0 0 0 0.9"/>`),
  // grana: puntini scuri e chiari fitti, come la sabbia vulcanica
  filtro('grana', 'type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="3"',
    '<feColorMatrix in="t" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.115  0 0 0 0 0.11  2 0 0 0 -1.12"/>'),
  filtro('granachiara', 'type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="9"',
    '<feColorMatrix in="t" type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.78  0 0 0 0 0.74  -1.8 0 0 0 0.66"/>'),
  // pori scuri e granelli chiari (i cristalli della lava)
  filtro('pori', 'type="fractalNoise" baseFrequency="0.16" numOctaves="2" seed="11"',
    `<feComponentTransfer in="t">${nero}<feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0 0 0.7"/></feComponentTransfer>
    <feColorMatrix type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.085  0 0 0 0 0.08  0 0 0 1 0"/>`),
  filtro('cristalli', 'type="fractalNoise" baseFrequency="0.3" numOctaves="2" seed="45"',
    `<feComponentTransfer in="t">${nero}<feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5"/></feComponentTransfer>
    <feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.84  0 0 0 0 0.8  0 0 0 1 0"/>`)
];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
<defs>${STRATI.join('\n')}</defs>
<rect width="${L}" height="${A}" fill="#6C675F"/>
${['macchie', 'chiare', 'fiamme', 'rilievo', 'grana', 'granachiara', 'pori', 'cristalli'].map(f => `<rect width="${L}" height="${A}" filter="url(#${f})"/>`).join('\n')}
</svg>`;

const cartella = process.argv[2] ?? 'src/assets/pietra';
fs.mkdirSync(cartella, { recursive: true });
const file = path.join(cartella, 'piperno.webp');
await sharp(Buffer.from(svg)).webp({ quality: 70 }).toFile(file);
console.log(`Scritto ${file}: ${(fs.statSync(file).size / 1024).toFixed(0)} kB`);
