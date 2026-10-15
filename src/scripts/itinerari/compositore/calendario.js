// Il calendario del compositore (specifiche/compositore-rifiniture-2.md, scelta di Enrico del 15/10/2026): un foglio intero con i
// mesi uno sotto l'altro, i giorni del viaggio su una fascia (il giorno che scegli pieno), un punto giallo sui giorni in cui,
// partendo lì, una tappa è chiusa, e «Fatto» in basso. Si apre dal foglio «Data e orari», sopra di lui. Un tocco su un giorno lo
// sceglie subito; il riepilogo di cosa è chiuso resta nel foglio «Data e orari».
import { $, ic, piano, oggi } from './base.js';
import { T, X, nG } from './stato.js';
import { aggiorna } from './viste.js';
import { settimaneDelMese, chiuseDa, mesiDaMostrare, meseDopo, DATA_MIN, DATA_MAX } from '../../../lib/itinerari/calendario';
import { piuGiorni, giornoSettimana, dataLunga, NOMI_GIORNI } from '../../../lib/itinerari/date';

const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const nomeMese = m => `${MESI[+m.slice(5, 7) - 1]} ${m.slice(0, 4)}`;
const SETT = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
const giorniDiTanti = n => `${n} ${n === 1 ? 'tappa chiusa' : 'tappe chiuse'}`;
const el = () => $('#calendario');

let g = 0, dopo = null;
// le tappe chiuse se il giorno «g» del viaggio cade in «data»
const chiuse = data => chiuseDa(X().giorni, piuGiorni(data, -g), id => T(id)?.chiuso);
const quante = data => chiuse(data).reduce((n, d) => n + d.chiuse.length, 0);
const primo = () => X().data;

function griglia(m, fuoco) {
  const N = nG(), p = primo(), ultimo = p ? piuGiorni(p, N - 1) : null, oggiS = oggi();
  const riga = r => `<tr>${r.map(x => {
    if (!x) return '<td></td>';
    const k = p && x >= p && x <= ultimo ? Math.round((Date.parse(x) - Date.parse(p)) / 864e5) : -1;
    const c = quante(x), ok = x >= DATA_MIN && x <= DATA_MAX;
    const td = k < 0 ? '' : ` class="cal-in${k === 0 ? ' cal-in--primo' : ''}${k === N - 1 ? ' cal-in--ultimo' : ''}"`;
    const cl = `cal-g${x === oggiS ? ' cal-g--oggi' : ''}${x < oggiS ? ' cal-g--prima' : ''}${k >= 0 ? ' cal-g--viaggio' : ''}${k === g ? ' cal-g--scelto' : ''}`;
    const dopoN = `${MESI[+x.slice(5, 7) - 1]}${x === oggiS ? ', oggi' : ''}${k >= 0 ? `, giorno ${k + 1} del viaggio` : ''}${c ? `, ${giorniDiTanti(c)}` : ''}`;
    return `<td${td}><button type="button" class="${cl}" data-d="${x}" aria-pressed="${k === g}" tabindex="${x === fuoco ? 0 : -1}"${ok ? '' : ' disabled'}><span class="vh">${NOMI_GIORNI[giornoSettimana(x)]} </span><span class="cal-n">${+x.slice(8)}</span><span class="vh"> ${dopoN}</span>${k >= 0 && N > 1 ? `<span class="cal-k" aria-hidden="true">${k + 1}</span>` : ''}${c ? '<span class="cal-punto" aria-hidden="true"></span>' : ''}</button></td>`;
  }).join('')}</tr>`;
  return `<table class="cal-mese__g"><thead><tr>${SETT.map(s => `<th scope="col" abbr="${NOMI_GIORNI[s]}">${s.slice(0, 2)}</th>`).join('')}</tr></thead><tbody>${settimaneDelMese(m).map(riga).join('')}</tbody></table>`;
}

// la riga in basso: i giorni scelti e, in breve, se qualcosa è chiuso (l'elenco è nel riepilogo di «Data e orari»)
function scelta() {
  const p = primo();
  if (!p) return '<b>Tocca un giorno</b><span>Il punto giallo: partendo quel giorno qualcosa è chiuso.</span>';
  const N = nG(), u = piuGiorni(p, N - 1), n = chiuseDa(X().giorni, p, id => T(id)?.chiuso).reduce((s, d) => s + d.chiuse.length, 0);
  return `<b>${N > 1 ? `Da ${dataLunga(p)} a ${dataLunga(u)}` : dataLunga(p)}</b><span>${n ? `${giorniDiTanti(n)}: le trovi nel riepilogo` : 'Tutto aperto'}</span>`;
}

function disegna() {
  const d = el(), x = X(), mia = x.data ? piuGiorni(x.data, g) : null, mesi = mesiDaMostrare(oggi(), mia ?? undefined);
  const fuoco = mia && mesi.includes(mia.slice(0, 7)) ? mia : oggi();
  d.innerHTML = `<div class="cal">
    <div class="cal-testa"><h2 id="cal-t">${g ? `Data del giorno ${g + 1}` : 'Quando parti?'}</h2><button type="button" class="f-chiudi" data-cal="chiudi" aria-label="Chiudi il calendario">${ic('x')}</button></div>
    <p class="cal-nota"><span class="cal-punto" aria-hidden="true"></span>Il punto giallo: ${g ? 'con quel giorno' : 'partendo quel giorno'} qualcosa è chiuso.</p>
    <div class="cal-scorre">${mesi.map(m => `<section class="cal-mese" data-m="${m}" aria-label="${nomeMese(m)}"><h3 aria-hidden="true">${nomeMese(m)}</h3>${griglia(m, fuoco.startsWith(m) ? fuoco : null)}</section>`).join('')}</div>
    <div class="cal-piede"><p class="cal-sel" aria-live="polite">${scelta()}</p><button type="button" class="f-bottone" data-cal="chiudi">Fatto</button></div>
  </div>`;
}

export function apriCalendario(giorno, fatto) {
  g = giorno; dopo = fatto;
  const d = el();
  disegna();
  d.showModal();
  const mia = X().data ? piuGiorni(X().data, g) : oggi(), sc = $('.cal-scorre', d), sez = $(`.cal-mese[data-m="${mia.slice(0, 7)}"]`, d);
  if (sez && sez.previousElementSibling) sc.scrollTop = sez.offsetTop - sc.offsetTop - 4;
  $('.cal-g[tabindex="0"]', d)?.focus({ preventScroll: true });
}

async function chiudi() {
  const d = el();
  if (!d.open) return;
  if (piano()) { d.classList.add('cal--esce'); await new Promise(r => setTimeout(r, 220)); d.classList.remove('cal--esce'); }
  d.close();
}

export function preparaCalendario() {
  const d = el();
  if (!d) return;
  d.addEventListener('close', () => { const f = dopo; dopo = null; f?.(); });
  d.addEventListener('cancel', e => { e.preventDefault(); chiudi(); });
  d.addEventListener('click', e => {
    if (e.target === d) { chiudi(); return; }
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.cal === 'chiudi') { chiudi(); return; }
    const x = b.dataset.d;
    if (!x) return;
    aggiorna(y => { y.data = piuGiorni(x, -g); });
    const sc = $('.cal-scorre', d), y = sc.scrollTop;
    disegna();
    $('.cal-scorre', d).scrollTop = y;
    $(`.cal-g[data-d="${x}"]`, d)?.focus({ preventScroll: true });
  });
  // frecce, pagina su e giù per i mesi, inizio e fine della settimana
  d.addEventListener('keydown', e => {
    const b = e.target.closest?.('.cal-g'); if (!b) return;
    const x = b.dataset.d, s = (SETT.indexOf(giornoSettimana(x)));
    const mese = n => { const m = meseDopo(x.slice(0, 7), n), ultimo = new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0)).getUTCDate(); return `${m}-${String(Math.min(+x.slice(8), ultimo)).padStart(2, '0')}`; };
    const y = { ArrowLeft: piuGiorni(x, -1), ArrowRight: piuGiorni(x, 1), ArrowUp: piuGiorni(x, -7), ArrowDown: piuGiorni(x, 7), Home: piuGiorni(x, -s), End: piuGiorni(x, 6 - s), PageUp: mese(-1), PageDown: mese(1) }[e.key];
    if (!y) return;
    e.preventDefault();
    const t = $(`.cal-g[data-d="${y}"]`, d);
    if (!t || t.disabled) return;
    b.tabIndex = -1; t.tabIndex = 0; t.focus({ preventScroll: true }); t.scrollIntoView({ block: 'nearest' });
  });
}
export const calendarioAperto = () => !!el()?.open;
