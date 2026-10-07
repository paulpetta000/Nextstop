// Il marchio di Nextstop, scelto da Enrico il 07/10/2026: «la soglia astratta». Sei porte una dentro l'altra, in prospettiva
// verso un punto di fuga al centro, e in fondo, nella luce, il segnaposto. Griglia di 48 unità.
// Unica copia della geometria e dei colori: la usano il sito (src/components/Marchio.astro), le icone (scripts/icone.mjs),
// le immagini di anteprima (src/pages/og/) e i bozzetti (design/logo/marchio.mjs rimanda qui).

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
  // bande scure e piè di pagina (blu notte #142039), e l'intestazione in tema scuro
  scuro: { strati: ['#1B2450', '#26317A', '#3646A3', '#5266C8', '#8796E4', '#FFF4E0'], spillo: '#10173A', buco: '#FFF4E0' },
  // sopra le foto calde (la home): archi caldi, il segnaposto resta blu. Per una foto fredda si sceglie di nuovo, a occhio.
  foto: { strati: ['#C8702E', '#DE8E43', '#EDAE66', '#F5CB93', '#FBE4C2', '#FFF7EA'], spillo: '#10173A', buco: '#FFF7EA' }
};
// Il segnaposto al posto della «o» nel nome, per ogni posto
export const SPILLO_NOME = { chiaro: '#3F51B5', scuro: '#8C9BEA', foto: '#F2B56B' };

const SPILLO = 'M0 0C0 0-3.2-3.4-3.2-5.6A3.2 3.2 0 0 1 3.2-5.6C3.2-3.4 0 0 0 0Z';
// Il segnaposto in fondo alla soglia più piccola (punta in basso)
function spillo(x, y, s, colore, buco) {
  const f = v => +v.toFixed(2);
  return `<g class="meta"><path transform="translate(${f(x)} ${f(y)}) scale(${s})" d="${SPILLO}" ${colore}/><circle cx="${f(x)}" cy="${f(y - 5.6 * s)}" r="${f(1.15 * s)}" ${buco}/></g>`;
}
// Gli strati e il segnaposto. colore(i) dà l'attributo di riempimento dello strato i (i = 'spillo' o 'buco' per il segnaposto)
function interno(colore) {
  const [cx, , bottom] = STRATI[5];
  return STRATI.map(([x, t, b, hw], i) => `<path class="strato" style="--k:${i}" d="${arco(x, t, b, hw)}" ${colore(i)}/>`).join('')
    + spillo(cx, bottom - 1.1, 0.95, colore('spillo'), colore('buco'));
}

// SVG del marchio con i colori scritti dentro (file, icone, immagini). dove: icona | chiaro | scuro | foto.
// tondo: raggio degli angoli del fondo (solo per l'icona; 0 = quadrato)
export function marchio(dove = 'chiaro', { tondo = 12, attributi = '' } = {}) {
  const c = COLORI[dove];
  const colore = i => `fill="${i === 'spillo' ? c.spillo : i === 'buco' ? c.buco : c.strati[i]}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" ${attributi}>`
    + (c.fondo ? `<rect width="48" height="48" rx="${tondo}" fill="${c.fondo}"/>` : '')
    + interno(colore)
    + '</svg>';
}

// L'interno del segno per le pagine: i colori vengono dalle variabili CSS --s0…--s5, --spillo e --buco
// (Marchio.astro le cambia per posto e per tema chiaro o scuro)
export const segnoVivo = () => interno(i => `style="fill:var(--${typeof i === 'number' ? `s${i}` : i})"`);

// Le variabili CSS di un posto (per Marchio.astro)
export const variabili = dove => {
  const c = COLORI[dove];
  return [...c.strati.map((x, i) => `--s${i}:${x}`), `--spillo:${c.spillo}`, `--buco:${c.buco}`, `--pin:${SPILLO_NOME[dove]}`].join(';');
};

// Il segnaposto della «o» del nome: 20 × 28 unità, punta in basso. I colori: --pin e --pin-buco
export const SPILLO_O = '<path d="M10 27.5C10 27.5 1.5 18.2 1.5 10.6A8.5 8.5 0 0 1 18.5 10.6C18.5 18.2 10 27.5 10 27.5Z" style="fill:var(--pin)"/><circle cx="10" cy="10.6" r="3.3" style="fill:var(--pin-buco)"/>';

// Le variabili CSS dei tre posti delle pagine (classi .firma--chiaro, --scuro, --foto di Marchio.astro).
// In tema scuro l'intestazione «chiara» prende i colori della versione scura. Va nel <head> (src/layouts/Base.astro).
export function cssFirma() {
  const scuroSuChiaro = `.firma--chiaro{${variabili('scuro')}}`;
  return ['chiaro', 'scuro', 'foto'].map(d => `.firma--${d}{${variabili(d)}}`).join('')
    + `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) ${scuroSuChiaro}}`
    + `:root[data-theme="dark"] ${scuroSuChiaro}`;
}
