import type { APIRoute } from 'astro';
import { PAGINE } from '../data/pagine';
import { SITO } from '../config/sito';

export const GET: APIRoute = async () => {
  const paths = PAGINE.map(p => p.path);
  // Senza date attendibili per pagina omettiamo lastmod: la build non è una modifica del contenuto.
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(p => `  <url><loc>${SITO.url}${p}</loc><xhtml:link rel="alternate" hreflang="it" href="${SITO.url}${p}"/></url>`).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
