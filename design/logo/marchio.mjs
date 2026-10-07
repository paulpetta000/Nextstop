// Il marchio scelto da Enrico il 07/10/2026: «la soglia astratta». Sei porte una dentro l'altra, in prospettiva verso
// un punto di fuga al centro, e in fondo, nella luce, il segnaposto. Griglia di 48 unità.
// Da qui nascono i file in design/logo/scelto/ (node design/logo/genera-marchio.mjs) e, nella costruzione, il componente del sito.

// Un arco a curvatura continua: la curva nasce dolcemente dai piedritti (non è un mezzo cerchio)
export function arco(cx, top, bottom, hw) {
  const spring = Math.min(bottom, top + 1.55 * hw), x0 = cx - hw, x1 = cx + hw, c1 = top + 0.447 * (spring - top);
  const f = v => +v.toFixed(2);
  return `M${f(x0)} ${f(bottom)}V${f(spring)}C${f(x0)} ${f(c1)} ${f(cx - 0.418 * hw)} ${f(top)} ${f(cx)} ${f(top)}S${f(x1)} ${f(c1)} ${f(x1)} ${f(spring)}V${f(bottom)}Z`;
}

// Le sei soglie: ognuna è 0,8 volte la precedente, verso il punto di fuga (24, 31)
export const STRATI = Array.from({ length: 6 }, (_, i) => { const s = 0.8 ** i; return [24, 31 - 25 * s, 31 + 10 * s, 12 * s]; });

// Colori per ogni posto (dalla soglia esterna a quella in fondo)
export const COLORI = {
  // icona del telefono, dei risultati di ricerca e della scheda del browser (con il fondo)
  icona: { fondo: '#0A0F27', strati: ['#10173A', '#1E2766', '#2F3D93', '#4B5DBE', '#7D8DDC', '#FFF4E0'], spillo: '#10173A', buco: '#FFF4E0' },
  // intestazione chiara delle pagine
  chiaro: { strati: ['#10173A', '#1E2766', '#2F3D93', '#4B5DBE', '#7D8DDC', '#FFF4E0'], spillo: '#10173A', buco: '#FFF4E0' },
  // bande scure e piè di pagina (blu notte #142039)
  scuro: { strati: ['#1B2450', '#26317A', '#3646A3', '#5266C8', '#8796E4', '#FFF4E0'], spillo: '#10173A', buco: '#FFF4E0' },
  // sopra le foto calde (la home): archi caldi, il segnaposto resta blu. Per una foto fredda si sceglie di nuovo, a occhio.
  foto: { strati: ['#C8702E', '#DE8E43', '#EDAE66', '#F5CB93', '#FBE4C2', '#FFF7EA'], spillo: '#10173A', buco: '#FFF7EA' }
};
// Il segnaposto al posto della «o» nel nome, per ogni posto
export const SPILLO_NOME = { chiaro: '#3F51B5', scuro: '#8C9BEA', foto: '#F2B56B' };

// Il segnaposto in fondo alla soglia più piccola (punta in basso)
function spillo(x, y, s, colore, buco) {
  const f = v => +v.toFixed(2);
  return `<g class="meta"><path transform="translate(${f(x)} ${f(y)}) scale(${s})" d="M0 0C0 0-3.2-3.4-3.2-5.6A3.2 3.2 0 0 1 3.2-5.6C3.2-3.4 0 0 0 0Z" fill="${colore}"/><circle cx="${f(x)}" cy="${f(y - 5.6 * s)}" r="${f(1.15 * s)}" fill="${buco}"/></g>`;
}

// SVG del marchio. dove: icona | chiaro | scuro | foto. tondo: raggio degli angoli del fondo (solo per l'icona; 0 = quadrato)
export function marchio(dove = 'chiaro', { tondo = 12, attributi = '' } = {}) {
  const c = COLORI[dove];
  const [cx, , bottom] = STRATI[5];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" ${attributi}>`
    + (c.fondo ? `<rect width="48" height="48" rx="${tondo}" fill="${c.fondo}"/>` : '')
    + STRATI.map(([x, t, b, hw], i) => `<path class="strato" style="--k:${i}" d="${arco(x, t, b, hw)}" fill="${c.strati[i]}"/>`).join('')
    + spillo(cx, bottom - 1.1, 0.95, c.spillo, c.buco)
    + '</svg>';
}
