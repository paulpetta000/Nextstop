// Un pezzo delle strade della mappa (src/data/strade.json, fatto da scripts/mappa/strade.mjs): vicoli, scale, pedonali,
// strade medie e grandi e i nomi delle vie in un quadrato di 1,28 km. La mappa lo scarica solo quando guardi lì.
import type { APIRoute, GetStaticPaths } from 'astro';
import S from '../../../../data/strade.json';

export const getStaticPaths: GetStaticPaths = () => Object.keys(S.pezzi).map(pezzo => ({ params: { pezzo } }));

export const GET: APIRoute = ({ params }) => new Response(
  JSON.stringify(S.pezzi[params.pezzo as keyof typeof S.pezzi]),
  { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
);
