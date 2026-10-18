// I percorsi veri tra le tappe (scripts/itinerari/costruisci.mjs) per la mappa della pagina degli itinerari
import type { APIRoute } from 'astro';
import { RIFERIMENTO } from '../../../lib/itinerari/riferimento-napoli';
import P from '../../../data/percorsi-tappe.json';

export const GET: APIRoute = () => new Response(
  JSON.stringify({ riferimento: RIFERIMENTO, punti: P.punti, scenari: P.scenari }),
  { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
);
