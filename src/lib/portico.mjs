// Il portico di piperno della grafica (richiesta di Enrico, 07/10/2026: «arcate vere, in pietra, una accanto all'altra,
// con profondità e movimento, realistiche»). Disegno di un'arcata, come nei portici di via dei Tribunali:
// pilastri a blocchi con il capitello, l'arco a conci con la chiave in alto, una cornice sopra e il gradino (la soglia) sotto.
// Unità: 300 × 420. La pietra è l'immagine di scripts/pietra.mjs (src/assets/pietra/piperno.webp), grande come l'arcata:
// un'arcata sì e una no la gira a specchio, così due arcate vicine si toccano senza giunzione (l'immagine sborda di due
// unità per lato: i bordi sfumati che il browser fa a ogni immagine restano fuori).
// Il vuoto dell'arco resta trasparente: dietro ci sono lo spessore dell'arco e la foto, nella pagina (src/components/Campata.astro).

export const W = 300, H = 420;
export const CX = 150, YS = 196, R = 104;            // centro dell'arco, linea d'imposta, raggio della luce
const RA = R + 22, RM = RA + 7, RK = R + 32;          // conci, cornice dell'arco, chiave
export const SOGLIA = 404;                            // sopra il gradino
const CORNICE = 16;                                   // fine della cornice in alto
const IMPOSTA = [184, 200];                           // capitello dei pilastri
const SPORTO = 4;                                     // quanto il capitello sporge sulla luce
const N_CONCI = 13;

// Dove sta il vuoto dell'arco, in percentuale dell'arcata (per lo spessore e la foto, in HTML). Un'unità in più per lato,
// così la pietra copre il bordo e non resta un filo chiaro.
export const VANO = (() => {
  const x = CX - R - 1, y = YS - R - 1, w = 2 * R + 2, h = SOGLIA - y;
  const p = v => +(v * 100).toFixed(3);
  return { left: p(x / W), top: p(y / H), width: p(w / W), height: p(h / H), raggio: `50% 50% 0 0 / ${p((R + 1) / h)}% ${p((R + 1) / h)}% 0 0` };
})();

const f = v => +v.toFixed(1);
// numeri «a caso» ma sempre uguali: la stessa arcata si disegna sempre allo stesso modo
const caso = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const punto = (r, gradi) => [f(CX + r * Math.cos(gradi * Math.PI / 180)), f(YS - r * Math.sin(gradi * Math.PI / 180))];
const luce = `M${CX - R} ${SOGLIA}V${YS}A${R} ${R} 0 0 1 ${CX + R} ${YS}V${SOGLIA}Z`;
// l'arco con la sua cornice, più il vuoto: qui i blocchi del muro non ci vanno
const arcoPieno = `M${CX - RM - 1} ${YS}A${RM + 1} ${RM + 1} 0 0 1 ${CX + RM + 1} ${YS}Z${luce}`;

// i corsi dei blocchi: [inizio, fine, giunti verticali]. I giunti a 0 e 300 cadono a metà dei pilastri, tra due arcate.
const CORSI = [
  [CORNICE, 52, [64, 158, 246]],
  [52, 96, [0, 108, 196, 300]],
  [96, 140, [22, 278]],
  [140, IMPOSTA[0], [0, 300]],
  [IMPOSTA[1], 251, [24, 276]],
  [251, 302, [0, 300]],
  [302, 353, [24, 276]],
  [353, SOGLIA, [0, 300]]
];

// La forma della pietra: tutto tranne il vuoto dell'arco (più lo sporto dei capitelli). È la maschera dello sfondo di pietra
// (Campata.astro): la pietra è uno sfondo CSS, non un'immagine dentro l'SVG, che Chrome scambiava per il contenuto principale.
export const MASCHERA = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'><path fill-rule='evenodd' d='M-2 -2H${W + 2}V${H + 2}H-2Z${luce}'/><path d='M${CX - R - 1} ${IMPOSTA[0]}H${CX - R + SPORTO}V${IMPOSTA[1]}H${CX - R - 1}ZM${CX + R - SPORTO} ${IMPOSTA[0]}H${CX + R + 1}V${IMPOSTA[1]}H${CX + R - SPORTO}Z'/></svg>`)}")`;

// L'interno dell'SVG di un'arcata (giunti, conci, ombre: la pietra è sotto). id: unico nella pagina;
// seme: cambia i toni dei blocchi, perché due arcate non siano uguali
export function arcata({ id, seme = 1 }) {
  const u = `pc-${id}`;
  const tono = (a, b) => {
    const v = caso(a + seme * 7.3, b + seme * 3.1);
    return v < .5 ? `fill="#000" fill-opacity="${((.5 - v) * .28).toFixed(3)}"` : `fill="#fff" fill-opacity="${((v - .5) * .16).toFixed(3)}"`;
  };
  const giuntoO = (x0, x1, y) => `<path d="M${f(x0)} ${f(y)}H${f(x1)}" class="pc-g"/><path d="M${f(x0)} ${f(y + 1.3)}H${f(x1)}" class="pc-l"/>`;
  const giuntoV = (x, y0, y1) => `<path d="M${f(x)} ${f(y0)}V${f(y1)}" class="pc-g"/>${x < W ? `<path d="M${f(x + 1.3)} ${f(y0)}V${f(y1)}" class="pc-l"/>` : ''}`;

  // il muro: blocchi con toni un po' diversi e i loro giunti
  let blocchi = '', giunti = '';
  CORSI.forEach(([y0, y1, xs], i) => {
    const bordi = [0, ...xs.filter(x => x > 0 && x < W), W];
    for (let k = 0; k < bordi.length - 1; k++) blocchi += `<rect x="${bordi[k]}" y="${y0}" width="${bordi[k + 1] - bordi[k]}" height="${y1 - y0}" ${tono(i, k)}/>`;
    if (i > 0 && y0 !== IMPOSTA[1]) giunti += giuntoO(0, W, y0);
    for (const x of xs) giunti += giuntoV(x, y0, y1);
  });

  // i conci dell'arco a raggiera; la chiave in alto è più alta e un po' più larga verso fuori
  const passo = 180 / N_CONCI, kChiave = (N_CONCI - 1) / 2;
  let conci = '', giuntiArco = '', chiave = '';
  for (let k = 0; k < N_CONCI; k++) {
    const a0 = 180 - k * passo, a1 = a0 - passo;
    const [p0, q0] = [punto(R, a0), punto(R, a1)];
    if (k === kChiave) {
      const [s0, s1] = [punto(RK, a0 + 1.6), punto(RK, a1 - 1.6)];
      chiave = `<path d="M${p0[0]} ${p0[1]}L${s0[0]} ${s0[1]}A${RK} ${RK} 0 0 1 ${s1[0]} ${s1[1]}L${q0[0]} ${q0[1]}A${R} ${R} 0 0 0 ${p0[0]} ${p0[1]}Z" fill="#fff" fill-opacity=".04"/>`
        + `<path d="M${p0[0]} ${p0[1]}L${s0[0]} ${s0[1]}A${RK} ${RK} 0 0 1 ${s1[0]} ${s1[1]}L${q0[0]} ${q0[1]}A${R} ${R} 0 0 0 ${p0[0]} ${p0[1]}Z" ${tono(40, seme)}/>`
        + `<path d="M${s0[0]} ${s0[1]}A${RK} ${RK} 0 0 1 ${s1[0]} ${s1[1]}" class="pc-sp"/>`
        + `<path d="M${p0[0]} ${p0[1]}L${s0[0]} ${s0[1]}M${q0[0]} ${q0[1]}L${s1[0]} ${s1[1]}" class="pc-g"/>`
        + `<path d="M${s1[0]} ${s1[1]}L${q0[0]} ${q0[1]}" stroke="#000" stroke-opacity=".3" stroke-width="3" transform="translate(1.6 0)"/>`;
      continue;
    }
    const [p1, q1] = [punto(RA, a0), punto(RA, a1)];
    conci += `<path d="M${p0[0]} ${p0[1]}L${p1[0]} ${p1[1]}A${RA} ${RA} 0 0 1 ${q1[0]} ${q1[1]}L${q0[0]} ${q0[1]}A${R} ${R} 0 0 0 ${p0[0]} ${p0[1]}Z" ${tono(20 + k, 5)}/>`;
    if (k > 0 && k !== kChiave + 1) giuntiArco += `<path d="M${p0[0]} ${p0[1]}L${p1[0]} ${p1[1]}" class="pc-g"/>`;
  }
  // il bordo dei conci verso il muro e la cornice dell'arco: un listello chiaro dove prende la luce, l'ombra che fa sul muro
  const anello = `<path d="M${CX - RM} ${YS}A${RM} ${RM} 0 0 1 ${CX + RM} ${YS}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3.2" transform="translate(1.6 2.2)"/>`
    + `<path d="M${CX - RA} ${YS}A${RA} ${RA} 0 0 1 ${CX + RA} ${YS}" class="pc-g"/>`
    + `<path d="M${CX - RA - 1.6} ${YS}A${RA + 1.6} ${RA + 1.6} 0 0 1 ${CX + RA + 1.6} ${YS}" fill="none" stroke="url(#${u}-sx)" stroke-width="1.8"/>`
    + `<path d="M${CX - RM} ${YS}A${RM} ${RM} 0 0 1 ${CX + RM} ${YS}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.2"/>`;
  // lo spigolo della luce: chiaro a destra (prende la luce), scuro a sinistra
  const spigolo = `<path d="${luce}" fill="none" stroke="url(#${u}-spigolo)" stroke-width="2.4"/>`;

  // capitelli, cornice in alto e gradino: pietra che sporge, con la faccia di sopra chiara e l'ombra sotto
  const capitelli = [[0, CX - R + SPORTO], [CX + R - SPORTO, W]].map(([x0, x1]) =>
    `<rect x="${x0}" y="${IMPOSTA[0]}" width="${x1 - x0}" height="3.2" fill="#fff" fill-opacity=".2"/>`
    + `<rect x="${x0}" y="${IMPOSTA[1] - 4}" width="${x1 - x0}" height="4" fill="#000" fill-opacity=".16"/>`
    + `<rect x="${x0}" y="${IMPOSTA[1]}" width="${x1 - x0}" height="16" fill="url(#${u}-sotto)"/>`
    + `<path d="M${x0} ${IMPOSTA[0]}H${x1}M${x0} ${IMPOSTA[1] + .4}H${x1}" class="pc-g"/>`).join('');
  const cornice = `<rect x="0" y="0" width="${W}" height="3.4" fill="#fff" fill-opacity=".18"/>`
    + `<rect x="0" y="${CORNICE - 3}" width="${W}" height="3" fill="#000" fill-opacity=".18"/><rect x="0" y="${CORNICE}" width="${W}" height="18" fill="url(#${u}-sotto)"/><path d="M0 ${CORNICE + .4}H${W}" class="pc-g"/>`;
  const gradino = `<rect x="0" y="${SOGLIA}" width="${W}" height="4" fill="#fff" fill-opacity=".22"/>`
    + `<rect x="0" y="${SOGLIA + 4}" width="${W}" height="${H - SOGLIA - 4}" fill="#000" fill-opacity=".12"/><path d="M0 ${SOGLIA}H${W}" class="pc-g"/>`;

  // patine: più chiaro in alto, più scuro in basso (uguale in ogni arcata, così tra due arcate non c'è uno scalino); qualche macchia di sporco, morbida, in punti diversi per ogni arcata
  const patine = `<rect width="${W}" height="${H}" fill="url(#${u}-luce)" mask="url(#${u}-m)"/>`
    + `<rect x="0" y="300" width="${W}" height="${SOGLIA - 300}" fill="url(#${u}-basso)" mask="url(#${u}-m)"/>`
    + [0, 1, 2].map(i => { const r = 26 + caso(seme + i, 9) * 30, x = r * 1.4 + caso(seme, i) * (W - r * 2.8), y = 40 + caso(i, seme) * 330; return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.4)}" ry="${f(r)}" fill="url(#${u}-macchia)" mask="url(#${u}-m)"/>`; }).join('');

  return `<defs>
    <mask id="${u}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><path d="${luce}" fill="#000"/></mask>
    <mask id="${u}-mm" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><path d="${arcoPieno}" fill="#000"/></mask>
    <linearGradient id="${u}-luce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>
    <linearGradient id="${u}-basso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1714" stop-opacity="0"/><stop offset="1" stop-color="#1a1714" stop-opacity=".32"/></linearGradient>
    <linearGradient id="${u}-sotto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".36"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <radialGradient id="${u}-macchia"><stop offset="0" stop-color="#14110e" stop-opacity=".2"/><stop offset="1" stop-color="#14110e" stop-opacity="0"/></radialGradient>
    <linearGradient id="${u}-spigolo" gradientUnits="userSpaceOnUse" x1="${CX - R}" y1="0" x2="${CX + R}" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".34"/></linearGradient>
    <linearGradient id="${u}-sx" gradientUnits="userSpaceOnUse" x1="${CX - RA}" y1="0" x2="${CX + RA}" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".6" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <style>.pc-g{fill:none;stroke:#161310;stroke-opacity:.55;stroke-width:1.5}.pc-l{fill:none;stroke:#fff;stroke-opacity:.13;stroke-width:1}.pc-sp{fill:none;stroke:#fff;stroke-opacity:.26;stroke-width:1.4}</style>
  <g mask="url(#${u}-mm)">${blocchi}${giunti}</g>
  ${conci}${giuntiArco}${anello}${chiave}${spigolo}${capitelli}${cornice}${gradino}${patine}
  <rect class="pc-velo" width="${W}" height="${H}" mask="url(#${u}-m)"/>`;
}
