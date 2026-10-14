// L'indice delle strade a pezzi (src/data/strade.json): il lato dei pezzi, quali esistono (gli altri sono mare) e i nomi delle
// vie principali, sempre sulla mappa. La mappa del compositore lo scarica con la mappa di base; i pezzi solo dove guardi.
import type { APIRoute } from 'astro';
import S from '../../../../data/strade.json';

export const GET: APIRoute = () => new Response(
  JSON.stringify({ fonte: S.fonte, lato: S.lato, pezzi: Object.keys(S.pezzi), principali: S.principali }),
  { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
);
