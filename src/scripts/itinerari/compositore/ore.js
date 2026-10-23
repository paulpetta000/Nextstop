// Il selettore dell'ora «Tutte le ore» (specifiche/compositore-rifiniture-2.md, scelta di Enrico del 16/10/2026, proposta 2 del
// giro 2): un foglio intero come il calendario, con i quarti d'ora a griglia (Presto, Mattina, Pomeriggio, Sera). La fascia va
// dall'inizio alla fine scelti, tutta di un pezzo; dentro, più chiaro, il tempo che avanza dopo l'ultima tappa; a righe gialle
// dove la giornata va oltre la fine. «Inizio → Fine» in alto: dopo l'inizio si passa da soli alla fine. Si apre dai campi
// «Inizio» e «Fine» di «Data e orari», sopra di lui; si aggiorna senza ridisegnarsi, così la fascia scorre.
import { $, esc, ic, piano, ora } from './base.js';
import { X } from './stato.js';
import { fineDelGiorno } from './fogli.js';
import { aggiorna } from './viste.js';
import { S, annuncia, contestoFoglio } from './comuni.js';
import { imposta, tocco, quarti, parti, allunga, cortoFine, fuoriFine, INIZIO_MAX, FINE_MIN, FINE_MAX, INIZIO_MIN, PASSO } from '../../../lib/itinerari/ore';
// lo stile arriva dentro questo file (così il service worker lo tiene con lui per l'uso senza rete) e si mette nella pagina la prima volta
import STILE from '../../../styles/ore.css?inline';

const NOME = { inizio: 'Inizio', fine: 'Fine' };
const el = () => /** @type {HTMLDialogElement} */ ($('#ore'));
// l'ora con i minuti più leggeri: «9» e «:30»
/** @param {number} m */
const hh = m => `<span class="ore-h">${Math.floor(m / 60)}</span><span class="ore-m">:${String(m % 60).padStart(2, '0')}</span>`;

let g = 0;
/** @type {import("../../../lib/itinerari/ore").Quale} */ let modo = 'inizio';
/** @type {((k:import("../../../lib/itinerari/ore").Quale)=>void)|undefined|null} */ let dopo = null;
let ciclo = 0;
/** @type {number|null} */ let chiusura = null;
let contesto = () => false;
const valido = () => !!el()?.open && chiusura === null && contesto();
function termina() {
  const f = dopo, corrente = contesto(); dopo = null; ciclo++; chiusura = null;
  el()?.classList.remove('ore--esce');
  if (corrente) f?.(modo);
}
const O = () => ({ inizio: X().giorni[g].inizio, fine: X().giorni[g].fine });
// la giornata calcolata, con la frase di quando finisci: la stessa di «Data e orari» (fogli.js)
const giornata = () => fineDelGiorno(g) ?? { st: null, oltre: false, fuori: [], frase: '' };

const piede = () => {
  const e = giornata(), o = O();
  return `<b>Dalle ${ora(o.inizio)} alle ${ora(o.fine)}</b><span>${e.st == null ? 'Nessuna tappa in questo giorno' : `Finisci alle ${ora(e.st)}${e.oltre ? '' : `, ${cortoFine(e.st, o.fine)}`}`}</span>`;
};
const avviso = () => {
  const e = giornata(); if (!e.oltre || e.st == null) return '';
  const a = allunga(e.st);
  return `<span>${esc(fuoriFine(e.fuori))}.</span>${a ? `<button type="button" class="f-bottone f-bottone--piccolo" data-ore="allunga" data-v="${a}">Finisci alle ${ora(a)}</button>` : '<span>Comincia prima o sposta una tappa in un altro giorno.</span>'}`;
};
/** @param {number} m */
const cella = m => `<td><button type="button" class="ore-q" data-m="${m}" tabindex="-1">${hh(m)}<span class="vh" data-o="dopo"></span><span class="ore-k" aria-hidden="true">finisci</span><span class="ore-punto" aria-hidden="true"></span></button></td>`;
function disegna() {
  const x = X(), o = O();
  el().innerHTML = `<div class="ore">
    <div class="ore-testa"><div><p class="ore-occhio">${esc(x.nome)} · giorno ${g + 1}</p><h2 id="ore-t">Orari del giorno</h2></div><button type="button" class="f-chiudi" data-ore="chiudi" aria-label="Chiudi la scelta dell'ora">${ic('x')}</button></div>
    <div class="ore-modo" role="group" aria-label="Cosa scegli" data-modo="${modo}"><span class="ore-modo__ind" aria-hidden="true"></span>
      ${/** @type {const} */ (['inizio', 'fine']).map(k => `<button type="button" class="ore-modo__b" data-ore="modo" data-k="${k}" aria-pressed="${modo === k}"><span>${NOME[k]}</span><b data-o="m-${k}" data-v="${o[k]}">${hh(o[k])}</b></button>`).join(ic('avanti', 18))}</div>
    <p class="ore-leg" aria-hidden="true"><span><i class="ore-leg__fascia"></i>la tua giornata</span><span><i class="ore-leg__libero"></i>tempo in più</span><span><i class="ore-punto"></i>oltre la fine</span></p>
    <div class="ore-scorre"><table class="ore-gr"><tbody>${parti(o, null).map(p => `<tr class="ore-sez" data-da="${p.da}"><td colspan="4"><span>${p.nome}</span></td></tr>${Array.from({ length: p.a - p.da + 1 }, (_, i) => p.da + i).map(h => `<tr>${[0, 15, 30, 45].map(q => cella(h * 60 + q)).join('')}</tr>`).join('')}`).join('')}</tbody></table></div>
    <div class="ore-avviso" data-o="avviso" role="status"${giornata().oltre ? '' : ' hidden'}>${avviso()}</div>
    <div class="ore-piede"><p class="ore-sel" data-o="piede">${piede()}</p><button type="button" class="f-bottone" data-ore="chiudi">Fatto</button></div>
  </div>`;
  stato(null, true);
}

// lo stato di ogni quarto e dei titoli; «da»: il quarto toccato, da cui la fascia si accende verso fuori
/** @param {number|null} da @param {boolean} [primaVolta] */
function stato(da, primaVolta = false) {
  const d = el(), o = O(), e = giornata(), centro = da ?? o.inizio, ritardo = /** @param {number} m */ m => `${Math.min(220, Math.abs(m - centro) / PASSO * 9)}ms`;
  /** @type {HTMLElement} */ ($('.ore-modo', d)).dataset.modo = modo;
  for (const k of /** @type {const} */ (['inizio', 'fine'])) {
    /** @type {HTMLButtonElement} */ ($(`.ore-modo__b[data-k="${k}"]`, d)).setAttribute('aria-pressed', String(modo === k));
    const n = /** @type {HTMLElement} */ ($(`[data-o="m-${k}"]`, d));
    if (n.dataset.v !== String(o[k])) { n.dataset.v = String(o[k]); n.innerHTML = hh(o[k]); if (!primaVolta) rotola(n); }
  }
  for (const p of parti(o, e.st)) { const td = /** @type {HTMLTableCellElement} */ ($(`.ore-sez[data-da="${p.da}"] td`, d)); td.className = p.stato === 'dentro' ? 'in' : p.stato === 'libero' ? 'in in--libero' : p.stato; td.style.setProperty('--d', ritardo(p.da * 60)); }
  for (const q of quarti(o, e.st)) {
    const b = /** @type {HTMLButtonElement} */ ($(`.ore-q[data-m="${q.m}"]`, d)), td = /** @type {HTMLTableCellElement} */ (b.parentElement), prima = b.classList.contains('ore-q--capo');
    td.className = [q.dentro && 'in', q.libero && 'in--libero', q.capo === 'inizio' && 'in-primo', q.capo === 'fine' && 'in-ultimo', q.oltre && 'oltre'].filter(Boolean).join(' ');
    td.style.setProperty('--d', ritardo(q.m));
    b.className = ['ore-q', q.capo && 'ore-q--capo', q.capo && q.capo === modo && 'ore-q--attivo', q.finisci && 'ore-q--finisci', q.oltre && 'ore-q--oltre', !primaVolta && q.capo && !prima && piano() && 'ore-q--entra'].filter(Boolean).join(' ');
    b.setAttribute('aria-pressed', String(!!q.capo));
    b.disabled = modo === 'inizio' ? q.m > INIZIO_MAX : q.m < FINE_MIN;
    /** @type {HTMLElement} */ ($('[data-o="dopo"]', b)).textContent = [q.capo && `, ${q.capo}`, q.finisci && `, qui finisci, alle ${ora(/** @type {number} */ (e.st))}`, q.dentro && !q.capo && (q.libero ? ', tempo in più' : ', nella tua giornata'), q.oltre && ', oltre la fine che hai scelto'].filter(Boolean).join('');
    b.tabIndex = q.m === o[modo] ? 0 : -1;
  }
  /** @type {HTMLElement} */ ($('[data-o="piede"]', d)).innerHTML = piede();
  const av = /** @type {HTMLElement} */ ($('[data-o="avviso"]', d)); av.hidden = !e.oltre; av.innerHTML = avviso();
}
/** @param {HTMLElement} n */
const rotola = n => { if (!piano()) return; n.classList.remove('ore-rotola'); void n.offsetWidth; n.classList.add('ore-rotola'); };

// come il calendario si apre sul mese: la parte del giorno dell'ora scelta (Mattina, Sera…) con il suo titolo in alto
function centra() {
  const d = el(), sc = $('.ore-scorre', d), b = $('.ore-q[tabindex="0"]', d); if (!sc || !b) return;
  /** @type {Element|null} */ let tr = b.closest('tr'); while (tr && !tr.classList.contains('ore-sez')) tr = tr.previousElementSibling;
  if (!tr) return;
  const top = sc.getBoundingClientRect().top - sc.scrollTop, sez = tr.getBoundingClientRect(), r = b.getBoundingClientRect();
  sc.scrollTop = r.bottom - sez.top < sc.clientHeight - 16 ? sez.top - top : Math.max(0, r.top - top - sc.clientHeight * .35);
}
const fuoco = () => $(`.ore-q[data-m="${O()[modo]}"]`, el())?.focus({ preventScroll: true });

// cambia le ore del giorno nel compositore (si salva come ogni altra modifica)
/** @param {{inizio:number;fine:number}} o */
function cambia(o) { aggiorna(y => { y.giorni[g].inizio = o.inizio; y.giorni[g].fine = o.fine; }); }
/** @param {import("../../../lib/itinerari/ore").Quale} k @param {{spinta?:import("../../../lib/itinerari/ore").Quale|null}} r */
const frase = (k, r) => `${NOME[k]} ${ora(O()[k])}.${r.spinta ? ` ${r.spinta === 'fine' ? 'La fine' : "L'inizio"} si sposta alle ${ora(O()[r.spinta])}.` : ''} ${giornata().frase}`;

// questo file si scarica al primo tocco su un campo dell'ora (fogli.js): la prima volta prepara anche la finestra
let pronto = false;
/** @param {number} giorno @param {import("../../../lib/itinerari/ore").Quale} k @param {(k:import("../../../lib/itinerari/ore").Quale)=>void} [fatto] */
export function apriOre(giorno, k, fatto) {
  if (!pronto) { prepara(); pronto = true; }
  const x = X(), scelto = x.giorni[giorno];
  if (!scelto || !/** @type {const} */ (['inizio', 'fine']).includes(k)) return;
  const turno = ++ciclo, padre = contestoFoglio();
  contesto = () => turno === ciclo && padre() && X() === x && S.g === giorno && x.giorni[giorno] === scelto;
  chiusura = null;
  g = giorno; modo = k; dopo = fatto;
  el().classList.remove('ore--esce');
  disegna();
  if (!el().open) el().showModal();
  centra();
  fuoco();
}
async function chiudi() {
  const d = el(), turno = ciclo;
  if (!d.open || chiusura === turno) return;
  chiusura = turno;
  if (piano()) { d.classList.add('ore--esce'); await new Promise(r => setTimeout(r, 240)); }
  if (turno !== ciclo || !d.open) return;
  d.close(); termina();
}

function prepara() {
  const d = el();
  if (!d) return;
  const s = document.createElement('style');
  s.dataset.stile = 'ore'; s.textContent = STILE; document.head.append(s);
  d.addEventListener('close', () => { if (!d.open) termina(); });
  d.addEventListener('cancel', e => { e.preventDefault(); chiudi(); });
  d.addEventListener('click', e => {
    if (e.target === d) { chiudi(); return; }
    const b = /** @type {Element} */ (e.target).closest('button');
    if (!b || b.disabled) return;
    const a = b.dataset.ore;
    if (a === 'chiudi') { chiudi(); return; }
    if (!valido()) return;
    if (a === 'modo') { modo = /** @type {import("../../../lib/itinerari/ore").Quale} */ (b.dataset.k); stato(null, true); centra(); fuoco(); annuncia(`Scegli ${modo === 'inizio' ? "l'inizio" : 'la fine'}: ora ${ora(O()[modo])}.`); return; }
    if (a === 'allunga') { const r = imposta(O(), 'fine', +/** @type {string} */ (b.dataset.v)); cambia(r); modo = 'fine'; stato(r.fine); fuoco(); annuncia(`Fine alle ${ora(r.fine)}. ${giornata().frase}`); return; }
    const m = b.dataset.m;
    if (!m) return;
    const r = tocco(O(), modo, +m);
    cambia(r); modo = r.modo;
    stato(+m);
    $(`.ore-q[data-m="${m}"]`, d)?.focus({ preventScroll: true });
    annuncia(`${frase(r.k, r)}${r.k === 'inizio' ? ' Ora scegli la fine.' : ''}`);
  });
  // frecce di lato 15 minuti, su e giù un'ora, Pagina su e giù tre ore, Inizio e Fine della riga; Invio e spazio scelgono
  d.addEventListener('keydown', e => {
    if (!valido()) return;
    const b = /** @type {import('./tipi').ElementoDati<'m',HTMLButtonElement>|null} */ (/** @type {Element} */ (e.target).closest?.('.ore-q')); if (!b) return;
    const m = +b.dataset.m, q = m % 60;
    const y = /** @type {Partial<Record<string,number>>} */ ({ ArrowLeft: m - 15, ArrowRight: m + 15, ArrowUp: m - 60, ArrowDown: m + 60, PageUp: m - 180, PageDown: m + 180, Home: m - q, End: m - q + 45 })[e.key];
    if (y == null) return;
    e.preventDefault();
    const minimo = modo === 'inizio' ? INIZIO_MIN : FINE_MIN, massimo = modo === 'inizio' ? INIZIO_MAX : FINE_MAX;
    const t = $(`.ore-q[data-m="${Math.min(massimo, Math.max(minimo, y))}"]`, d); if (!t) return;
    b.tabIndex = -1; t.tabIndex = 0; t.focus({ preventScroll: true }); t.scrollIntoView({ block: 'nearest' });
  });
}
export const oreAperte = () => !!el()?.open;
