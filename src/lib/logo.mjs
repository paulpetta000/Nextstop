// Marchio provvisorio di Nextstop (06/10/2026): una piastrella gialla come quelle delle tappe, con il segno di una fermata.
// Quello vero arriva con la grafica del sito. Usato da intestazione e piè di pagina (Logo.astro),
// favicon e icone (scripts/icone.mjs), immagini di anteprima.
export const COLORI = { piastrella: '#F3C431', segno: '#000000' };

// Disegno interno, in un quadrato 64×64. uid resta per compatibilità con Logo.astro.
export function disegno(uid = 'lg') {
  const c = COLORI;
  return `<rect id="${uid}" x="2" y="2" width="60" height="60" rx="14" fill="${c.piastrella}"/>` +
    `<circle cx="32" cy="32" r="15" fill="none" stroke="${c.segno}" stroke-width="6"/>` +
    `<circle cx="32" cy="32" r="5" fill="${c.segno}"/>`;
}

// SVG completo. sfondo: colore di un quadrato dietro (icone dell'app); margine in unità.
export function svg({ sfondo = null, margine = 0, uid = 'lg' } = {}) {
  const m = margine, s = 64 + m * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-m} ${-m} ${s} ${s}">` +
    (sfondo ? `<rect x="${-m}" y="${-m}" width="${s}" height="${s}" fill="${sfondo}"/>` : '') +
    disegno(uid) + `</svg>`;
}
