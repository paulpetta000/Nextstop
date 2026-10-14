// Il compositore nuovo (specifiche/compositore.md, «Costruzione»): pezzi comuni senza stato. Formati, icone, la soglia del
// marchio («visitata»), la firma con l'animazione della home. Nato dal prototipo scelto da Enrico (design/compositore/,
// mangiare-giro-1/app.js): le proposte non scelte non ci sono.
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// «piano»: il movimento è permesso (niente «riduci movimento»)
export const piano = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
export const computer = matchMedia('(min-width: 960px)');
export const range = n => Array.from({ length: n }, (_, i) => i);
export const dopo = ms => new Promise(r => setTimeout(r, ms));

// ---------- formati ----------
export const ora = m => { const x = Math.round(m); return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`; };
export const durata = m => { const x = Math.round(m); return x < 60 ? `${x} min` : `${Math.floor(x / 60)} h${x % 60 ? ' ' + String(x % 60).padStart(2, '0') : ''}`; };
export const durataLunga = m => {
  const x = Math.round(m), h = Math.floor(x / 60), r = x % 60, ore = h === 1 ? "un'ora" : `${h} ore`;
  const min = `${r} ${r === 1 ? 'minuto' : 'minuti'}`;
  return h ? (r ? `${ore} e ${min}` : ore) : min;
};
export const resta = m => { const h = Math.floor(m / 60); return `Ti ${h >= 2 || (h === 0 && m !== 1) ? 'restano' : 'resta'} ${durataLunga(m)}`; };
export const metri = m => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`);
export const km = m => (m / 1000).toFixed(1).replace('.', ',');
export const GS = { lun: 'lunedì', mar: 'martedì', mer: 'mercoledì', gio: 'giovedì', ven: 'venerdì', sab: 'sabato', dom: 'domenica' };
export const INGRESSO = { pagamento: 'Ingresso a pagamento', gratis: 'Ingresso gratis', 'in-parte': 'In parte a pagamento' };
export const DENTRO = { si: 'Al chiuso', no: "All'aperto", 'in-parte': 'In parte al chiuso' };
export const SCALE = { no: 'senza scale', pochi: 'qualche gradino', molti: 'molte scale' };
export const MOMENTO = { mattina: 'Meglio la mattina', pomeriggio: 'Meglio il pomeriggio', sera: 'Meglio verso sera' };
export const ORDINALE = ['Primo', 'Secondo', 'Terzo', 'Quarto', 'Quinto', 'Sesto', 'Settimo'];
export const maiuscola = s => s.charAt(0).toUpperCase() + s.slice(1);
export const dataScritta = s => new Date(`${s}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
// la data e l'ora di adesso a Napoli
export const oggi = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
export const oraDiAdesso = () => { const [h, m] = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date()).split(':').map(Number); return h * 60 + m; };

// ---------- icone (tratto 2, griglia 24) ----------
const I = {
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  piu: '<path d="M12 5v14M5 12h14"/>',
  meno: '<path d="M5 12h14"/>',
  mappa: '<path d="M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  elenco: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="3"/>',
  piedi: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6 3 3v3M12 15l-1-5 4 1 2 3M11 10l-3 2-1 3"/>',
  spunta: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  condividi: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.3 10.8l7.4-4M8.3 13.2l7.4 4"/>',
  miei: '<path d="M4 8.5h16v11H4z"/><path d="M6.5 5.5h11M9 2.5h6"/>',
  altro: '<path d="M5.5 12h.01M12 12h.01M18.5 12h.01" stroke-width="3.2"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  indietro: '<path d="M15 6l-6 6 6 6"/>',
  avanti: '<path d="M9 6l6 6-6 6"/>',
  su: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  giu: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  scendi: '<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>',
  alza: '<path d="M6 15l6-6 6 6"/>',
  abbassa: '<path d="M6 9l6 6 6-6"/>',
  giorni: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  sole: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
  copia: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
  cerca: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  attenzione: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
  cestino: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/><path d="M10 11v5.5M14 11v5.5"/>',
  centra: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
  orologio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  clessidra: '<path d="M7 3.5h10M7 20.5h10M8 3.5c0 5 8 5 8 8.5s-8 3.5-8 8.5M16 3.5c0 5-8 5-8 8.5s8 3.5 8 8.5"/>',
  biglietto: '<path d="M4 7.5h16v3a1.8 1.8 0 0 0 0 3.6v3H4v-3a1.8 1.8 0 0 0 0-3.6z"/><path d="M14 7.5v10" stroke-dasharray="1.5 2"/>',
  casa: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V19h12V9.5"/>',
  posate: '<path d="M7 3v7.5M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3M7 10.5V21"/><path d="M17.5 21V3c-2.2 1.2-3.5 4-3.5 7.5V13h3.5"/>',
  tazza: '<path d="M4.5 9.5h12v4.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z"/><path d="M16.5 11h1.5a2.5 2.5 0 0 1 0 5h-1.6"/><path d="M8.5 3.5c-.8.9.8 1.6 0 2.6M12.5 3.5c-.8.9.8 1.6 0 2.6"/>',
  panchina: '<path d="M4 11h16M5.5 7h13M6 11v8M18 11v8M4 15h16"/>',
  spilli: '<path d="M9 20.5s-5-4.8-5-8.4a5 5 0 0 1 10 0c0 3.6-5 8.4-5 8.4z"/><circle cx="9" cy="12.1" r="1.6"/><path d="M14.6 3.7a4.6 4.6 0 0 1 5.4 4.5c0 2.6-2.4 5.5-3.6 6.8"/>',
  cursori: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  matita: '<path d="M15.5 4.5l4 4L8.5 19.5H4.5v-4z"/><path d="M13 7l4 4"/>',
  maniglia: '<path d="M9 5.5h.01M15 5.5h.01M9 12h.01M15 12h.01M9 18.5h.01M15 18.5h.01" stroke-width="3.4"/>',
  sposta: '<path d="M7 4v16M3.5 7.5L7 4l3.5 3.5M17 20V4M13.5 16.5L17 20l3.5-3.5"/>',
  esterno: '<path d="M14 4.5h5.5V10M19.5 4.5l-8.5 8.5M17.5 14v4.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1H10"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.01"/>',
  bussola: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  occhio: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  vela: '<path d="M12 3.5v14M12 4.5L5 16h7M12 7l6 9h-6"/><path d="M4 19.5c2.7 1.3 5.3 1.3 8 0s5.3-1.3 8 0"/>',
  treno: '<rect x="6" y="3.5" width="12" height="13" rx="2.5"/><path d="M6 10h12M8.5 20.5l2-3.5M15.5 20.5l-2-3.5"/>',
  nave: '<path d="M3 15.5l2 4.5h14l2-4.5z"/><path d="M6 15.5V10h12v5.5M9.5 10V6.5h5V10"/>',
  bus: '<rect x="4.5" y="3.5" width="15" height="14" rx="2.5"/><path d="M4.5 11h15M4.5 7h15M7.5 17.5V20M16.5 17.5V20"/>',
  ricomincia: '<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4"/>',
  posizione: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/><circle cx="12" cy="12" r="7"/>'
};
export const ic = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[n] ?? ''}</svg>`;

// ---------- «visitata»: la soglia del marchio che si chiude (specifica §5) ----------
const STRATI = [
  'M12 41V24.6C12 14.31 18.98 6 24 6S36 14.31 36 24.6V41Z', 'M14.4 39V25.88C14.4 17.65 19.99 11 24 11S33.6 17.65 33.6 25.88V39Z',
  'M16.32 37.4V26.9C16.32 20.32 20.79 15 24 15S31.68 20.32 31.68 26.9V37.4Z', 'M17.86 36.12V27.72C17.86 22.46 21.43 18.2 24 18.2S30.14 22.46 30.14 27.72V36.12Z',
  'M19.08 35.1V28.38C19.08 24.17 21.95 20.76 24 20.76S28.92 24.17 28.92 28.38V35.1Z', 'M20.07 34.28V28.9C20.07 25.53 22.36 22.81 24 22.81S27.93 25.53 27.93 28.9V34.28Z'
];
const SPUNTA = 'M17.2 27.6l4.6 4.5 8.6-9.6';
export const soglia = (cl = '') => `<svg class="soglia ${cl}" viewBox="10 4.5 28 37.5" aria-hidden="true" focusable="false"><path class="soglia__porta" d="${STRATI[0]}"/>${STRATI.map((d, k) => `<path class="soglia__s" style="--k:${k}" d="${d}"/>`).join('')}<path class="soglia__sotto" d="${SPUNTA}" pathLength="1"/><path class="soglia__spunta" d="${SPUNTA}" pathLength="1"/></svg>`;

// ---------- il marchio, con l'animazione della home (DESIGN.md §7) ----------
// M: { chiaro, scuro, spillo } dalla pagina (src/lib/marchio.mjs): il segno chiaro, quello ambra del tema scuro, il segnaposto
const LETTERE = [...'nextstop'];
export const firma = (M, cl = '') => `<a class="firma ${cl}" href="/"><span class="vh">nextstop, la home</span><svg class="firma__segno segno--chiaro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${M.chiaro}</svg><svg class="firma__segno segno--scuro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${M.scuro}</svg><span class="firma__parola" aria-hidden="true">${LETTERE.map((c, i) => (i === 6
  ? `<span class="firma__pin" style="--i:${i}"><i class="firma__ombra"></i><svg viewBox="0 0 20 28" focusable="false">${M.spillo}</svg><i class="firma__onda"></i></span>`
  : `<span class="firma__l" style="--i:${i}">${c}</span>`)).join('')}<span class="firma__rotta"></span></span></a>`;
export const GIRO_FIRMA = 2700;
export function animaFirma(el) {
  if (!el || !piano()) return;
  if (el.dataset.gira === '1') { el.dataset.ancora = '1'; return; }
  el.dataset.gira = '1';
  el.classList.remove('firma--anima');
  void el.offsetWidth;
  el.classList.add('firma--anima');
  setTimeout(() => {
    el.dataset.gira = '';
    el.classList.remove('firma--anima');
    if (el.dataset.ancora === '1') { el.dataset.ancora = ''; requestAnimationFrame(() => animaFirma(el)); }
  }, GIRO_FIRMA);
}
// passando sopra il marchio, o con il fuoco, l'animazione riparte (se ci ripassi a metà, finisce e poi riparte)
export function ascoltaFirme(radice) {
  radice.addEventListener('pointerover', e => { const f = e.target.closest?.('.firma'); if (f && !(e.relatedTarget && f.contains(e.relatedTarget))) animaFirma(f); });
  radice.addEventListener('focusin', e => { const f = e.target.closest?.('.firma'); if (f) animaFirma(f); });
}
