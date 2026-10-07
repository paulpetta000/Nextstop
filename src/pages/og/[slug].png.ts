// Immagini di anteprima 1200×630 per ogni pagina, generate durante la build (satori + sharp).
// Grafica A «Rivista» (DESIGN.md): fondo blu notte, il marchio (la soglia astratta), la linea a puntini color tufo.
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { PAGINE, slugOg } from '../../data/pagine';
import { SITO } from '../../config/sito';
import { marchio } from '../../lib/marchio.mjs';
const LOGO = 'data:image/svg+xml;base64,' + Buffer.from(marchio('icona', { tondo: 14 })).toString('base64');

const font = (f: string) => fs.readFileSync(path.join(process.cwd(), 'node_modules', f));
const FONTS = [
  { name: 'Archivo', data: font('@fontsource/archivo/files/archivo-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
  { name: 'Archivo', data: font('@fontsource/archivo/files/archivo-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const }
];

export async function getStaticPaths() {
  return PAGINE.map(p => ({ params: { slug: slugOg(p.path) }, props: { slug: slugOg(p.path), titolo: p.titolo, kicker: p.kicker } }));
}

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });
const NOTTE = '#142039', SU_NOTTE = '#F3F1EC', SU_NOTTE_2 = '#B7BECC', TUFO = '#E0A51B';

export const GET: APIRoute = async ({ props }) => {
  const { titolo, kicker } = props as { titolo: string; kicker: string };
  const puntini = Array.from({ length: 34 }, () => h('div', { width: 10, height: 10, borderRadius: 5, background: TUFO, display: 'flex' }));
  const tree = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: NOTTE, color: SU_NOTTE, padding: '64px 72px', fontFamily: 'Archivo', position: 'relative' }, [
    h('div', { display: 'flex', alignItems: 'center', gap: 22 }, [
      { type: 'img', props: { src: LOGO, width: 76, height: 76 } },
      h('div', { display: 'flex', flexDirection: 'column', gap: 6 }, [
        h('div', { fontSize: 38, fontWeight: 500, letterSpacing: -1 }, SITO.nome.toLowerCase()),
        h('div', { fontSize: 22, fontWeight: 500, color: SU_NOTTE_2 }, SITO.sottotitolo.toLowerCase())
      ])
    ]),
    h('div', { display: 'flex', flexDirection: 'column', gap: 22 }, [
      h('div', { display: 'flex', fontSize: 28, fontWeight: 500, color: TUFO }, kicker),
      h('div', { fontSize: titolo.length > 30 ? 76 : 92, fontWeight: 800, lineHeight: 1, letterSpacing: -1.5, maxWidth: 1040 }, titolo),
      h('div', { display: 'flex', gap: 20, marginTop: 18 }, puntini)
    ])
  ]);
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts: FONTS });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
