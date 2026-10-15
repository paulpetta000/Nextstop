// Tranche 2 · selettore dell'ora (3 proposte), dentro il foglio «Data e orari». Una prova, non il sito: le giornate vere arrivano
// da genera.mjs (giornate.mjs: il calcolo del sito per ogni inizio da 5:00 a 20:00, giorno feriale, con il pranzo come lo mette il
// sito). Restano passi e limiti di oggi: 15 minuti, inizio 5:00–20:00, fine 6:00–23:45, almeno un'ora tra inizio e fine.
const DATI = /*DATI*/null;
const SFONDI = /*SFONDI*/null;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const piano = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- ore e parole ----------
const MIN_I = 300, MAX_I = 1200, MIN_F = 360, MAX_F = 1425, PASSO = 15, STACCO = 60, INIZIO_PISTA = 300, FINE_PISTA = 1440;
const pad = n => String(n).padStart(2, '0');
const h = m => m >= 1440 ? `${h(m - 1440)} di notte` : `${Math.floor(m / 60)}:${pad(m % 60)}`;
const durata = m => { const o = Math.floor(m / 60), r = m % 60; return [o ? `${o} ${o === 1 ? 'ora' : 'ore'}` : '', r ? `${r} ${r === 1 ? 'minuto' : 'minuti'}` : ''].filter(Boolean).join(' e ') || '0 minuti'; };
const elenca = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a.at(-1)}`;
const nome = id => DATI.nomi[id] ?? id;
const su = (m, a) => Math.ceil(m / a) * a;
const QUALE = { pranzo: 'Pranzo', cena: 'Cena', libero: 'Tempo libero', caffe: 'Caffè' };

// ---------- stato (anche nell'indirizzo, per le immagini) ----------
const S = { p: 1, v: 'c', t: document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), g: 0, modo: 'inizio' };
const ORE = DATI.giorni.map(G => ({ inizio: G.inizio, fine: G.fine }));
const H = new URLSearchParams(location.hash.slice(1));
for (const [k, v] of H) if (k in S) S[k] = k === 'p' || k === 'g' ? +v : v;
const daOra = v => /^\d{1,2}:\d{2}$/.test(v) ? +v.split(':')[0] * 60 + +v.split(':')[1] : +v;
if (H.get('i')) ORE[S.g].inizio = daOra(H.get('i'));
if (H.get('f')) ORE[S.g].fine = daOra(H.get('f'));
const scriviIndirizzo = () => { try { history.replaceState(null, '', '#' + new URLSearchParams({ p: S.p, v: S.v, t: S.t, g: S.g, i: h(O().inizio), f: h(O().fine) })); } catch { /* nella pagina pubblicata l'indirizzo non si cambia: non serve */ } };
const O = () => ORE[S.g];

// la giornata calcolata con l'inizio scelto: tappe [id, inizio, fine], pause [quale, inizio, fine], fine
const giornata = () => DATI.giorni[S.g].per[O().inizio];
// cosa cambia: quando finisci, l'ultima tappa, le tappe che restano oltre la fine scelta, il pranzo
function effetto() {
  const x = giornata(), { fine } = O(), st = x.fine, ultima = nome(x.tappe.at(-1)[0]);
  const fuori = x.tappe.filter(t => t[2] > fine).map(t => nome(t[0]));
  const pranzo = x.pause.find(q => q[0] === 'pranzo');
  const oltre = st > fine;
  const allunga = oltre && su(st, 30) <= MAX_F ? su(st, 30) : null;
  const corto = oltre ? `${durata(st - fine)} dopo le ${h(fine)}` : st === fine ? `proprio alle ${h(fine)}` : `${durata(fine - st)} prima delle ${h(fine)}`;
  const testo = oltre
    ? `Finisci alle ${h(st)}, ${durata(st - fine)} dopo le ${h(fine)}: ${elenca(fuori)} ${fuori.length > 1 ? 'restano' : 'resta'} fuori. ${allunga ? 'Comincia prima o finisci più tardi.' : 'Comincia prima o sposta una tappa in un altro giorno.'}`
    : `Finisci alle ${h(st)}, ${corto}. Ultima tappa: ${ultima}.`;
  return { x, st, ultima, fuori, pranzo, oltre, allunga, corto, testo };
}

// cambiare un'ora: dentro i limiti, a passi di 15 minuti; se inizio e fine si avvicinano meno di un'ora, l'altra si sposta con lei
function imposta(k, v) {
  const o = O(), prima = { ...o };
  v = Math.round(v / PASSO) * PASSO;
  if (k === 'inizio') { o.inizio = Math.min(MAX_I, Math.max(MIN_I, v)); if (o.fine < o.inizio + STACCO) o.fine = o.inizio + STACCO; }
  else { o.fine = Math.min(MAX_F, Math.max(MIN_F, v)); if (o.inizio > o.fine - STACCO) o.inizio = o.fine - STACCO; }
  const altra = k === 'inizio' ? 'fine' : 'inizio';
  return { cambiata: o[k] !== prima[k], spinta: o[altra] !== prima[altra] ? altra : null };
}

// ---------- annunci (più tardi, quando le dita o i tasti si fermano) ----------
let tAnnuncio = 0;
const annuncia = (t, subito = false) => {
  clearTimeout(tAnnuncio);
  const a = $('.annuncio');
  tAnnuncio = setTimeout(() => { a.textContent = ''; requestAnimationFrame(() => { a.textContent = t; }); }, subito ? 0 : 650);
};
const annunciaCambio = (k, r) => annuncia(`${k === 'inizio' ? 'Inizio' : 'Fine'} ${h(O()[k])}.${r.spinta ? ` ${r.spinta === 'fine' ? 'La fine' : "L'inizio"} si sposta alle ${h(O()[r.spinta])}.` : ''} ${effetto().testo}`);

// ---------- icone (tratto 1,8 come nel compositore) ----------
const IC = {
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  ora: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  giu: '<path d="m6 9 6 6 6-6"/>',
  sx: '<path d="m15 6-6 6 6 6"/>',
  dx: '<path d="m9 6 6 6-6 6"/>',
  meno: '<path d="M6 12h12"/>',
  piu: '<path d="M12 6v12M6 12h12"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  ok: '<path d="m5 12.5 4.2 4.2L19 7"/>'
};
const ic = (n, z = 20) => `<svg class="ic" width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

const PROPOSTE = [
  { n: 1, nome: 'La giornata', dice: 'una barra dalle 5 a mezzanotte con le maniglie di inizio e fine; sopra, le tappe e il pranzo si spostano mentre trascini' },
  { n: 2, nome: 'Tutte le ore', dice: 'la gemella del calendario: un foglio intero con le ore una sotto l\'altra, la fascia della tua giornata, il punto giallo dove vai oltre la fine' },
  { n: 3, nome: 'La frase', dice: '«cominci alle… e finisci entro le…» con − e +, le scelte veloci e quando finisci, grande; nel tema 2 è un timbro' }
];

// ---------- pezzi comuni del foglio «Data e orari» ----------
const NOTA = '<p class="f-nota">Con la data vedi quali tappe sono chiuse proprio quel giorno e i mezzi del sabato e della domenica. Senza data i giorni di chiusura restano nella scheda di ogni tappa.</p>';
// il campo della data com'è nel sito (calendario «Tutti i mesi»): qui non si apre
const DATA = () => `<div class="campo"><span class="campo__et" id="et-data">${S.g ? 'Data del giorno 2' : 'Primo giorno'}</span>
  <button type="button" class="campo__b campo__b--vuoto" data-a="data" aria-labelledby="et-data val-data">${ic('cal', 22)}<span id="val-data">Scegli il giorno</span>${ic('giu', 18)}</button></div>`;
const CODA = () => `<label class="f-spunta"><input type="checkbox"><span>Solo a piedi, senza metro, funicolari e autobus<small>Vale per tutti i giorni di questo itinerario.</small></span></label>
  <div class="f-conferma"><button type="button" class="f-bottone" data-a="chiudi">Fatto</button></div>`;
const ALLUNGA = e => e.allunga ? `<button type="button" class="f-bottone f-bottone--piccolo f-bottone--contorno" data-a="allunga" data-v="${e.allunga}">Finisci alle ${h(e.allunga)}</button>` : '';
// il riquadro di «cosa cambia»: verde se ci stai, giallo se vai oltre
const esito = (e, cl = '') => `<div class="esito${e.oltre ? ' esito--oltre' : ''} ${cl}" data-o="esito"><p>${e.testo}</p>${e.pranzo && !e.oltre ? `<p class="esito__poco">${QUALE.pranzo} verso le ${h(e.pranzo[1])}.</p>` : ''}${ALLUNGA(e)}</div>`;

// ---------- proposta 1 · la giornata (una barra con due maniglie) ----------
const pc = m => `${((Math.min(FINE_PISTA, Math.max(INIZIO_PISTA, m)) - INIZIO_PISTA) / (FINE_PISTA - INIZIO_PISTA) * 100).toFixed(3)}%`;
const larg = (a, b) => `${((Math.min(FINE_PISTA, b) - Math.min(FINE_PISTA, a)) / (FINE_PISTA - INIZIO_PISTA) * 100).toFixed(3)}%`;
// l'etichetta di «quando finisci» passa a sinistra del segno verso la fine della pista, così non esce
const aDestra = m => (m - INIZIO_PISTA) / (FINE_PISTA - INIZIO_PISTA) > .72;
// i pezzi della giornata sopra la barra: tappe, pause, e quello che va oltre la fine scelta
function pezzi1(e) {
  const { fine } = O(), out = [];
  const metti = (a, b, cl, t) => {
    if (a >= FINE_PISTA) return;
    if (b <= fine) out.push(`<i class="o1-b ${cl}" style="left:${pc(a)};width:${larg(a, b)}" title="${t}"></i>`);
    else if (a >= fine) out.push(`<i class="o1-b ${cl} o1-b--fuori" style="left:${pc(a)};width:${larg(a, b)}" title="${t}"></i>`);
    else { out.push(`<i class="o1-b ${cl}" style="left:${pc(a)};width:${larg(a, fine)}" title="${t}"></i>`, `<i class="o1-b ${cl} o1-b--fuori" style="left:${pc(fine)};width:${larg(fine, b)}" title="${t}"></i>`); }
  };
  for (const [id, a, b] of e.x.tappe) metti(a, b, 'o1-b--tappa', nome(id));
  for (const [q, a, b] of e.x.pause) metti(a, b, 'o1-b--pausa', QUALE[q] ?? q);
  return out.join('');
}
const pollice = k => {
  const o = O(), [mn, mx] = k === 'inizio' ? [MIN_I, MAX_I] : [MIN_F, MAX_F];
  return `<span class="o1-pollice o1-pollice--${k}" role="slider" tabindex="0" data-k="${k}" aria-label="${k === 'inizio' ? 'Inizio' : 'Fine'} del giorno ${S.g + 1}" aria-valuemin="${mn}" aria-valuemax="${mx}" aria-valuenow="${o[k]}" aria-valuetext="${h(o[k])}" style="left:${pc(o[k])}"><span class="o1-bolla" aria-hidden="true">${h(o[k])}</span></span>`;
};
const valore1 = k => `<div class="o1-val o1-val--${k}"><span class="o1-et">${k === 'inizio' ? 'Inizio' : 'Fine'}</span>
  <button type="button" class="tondino" data-pm="-15" data-k="${k}" aria-label="${k === 'inizio' ? 'Inizio' : 'Fine'} 15 minuti prima">${ic('sx')}</button>
  <b class="o1-num" data-o="v-${k}">${h(O()[k])}</b>
  <button type="button" class="tondino" data-pm="15" data-k="${k}" aria-label="${k === 'inizio' ? 'Inizio' : 'Fine'} 15 minuti dopo">${ic('dx')}</button></div>`;
const p1 = () => {
  const e = effetto(), o = O();
  return `<div class="o1" role="group" aria-labelledby="o1-t"><h2 class="campo__et" id="o1-t">Orari del giorno ${S.g + 1}</h2>
    <div class="o1-valori">${valore1('inizio')}${valore1('fine')}</div>
    <div class="o1-pista" data-o="pista">
      <div class="o1-giorno" aria-hidden="true" data-o="pezzi">${pezzi1(e)}</div>
      <div class="o1-binario" aria-hidden="true"><span class="o1-fascia" data-o="fascia" style="left:${pc(o.inizio)};width:${larg(o.inizio, o.fine)}"></span></div>
      <span class="o1-segno${e.oltre ? ' o1-segno--oltre' : ''}${aDestra(e.st) ? ' o1-segno--dx' : ''}" data-o="segno" aria-hidden="true" style="left:${pc(e.st)}"><span>${h(e.st)}</span></span>
      ${pollice('inizio')}${pollice('fine')}
      <div class="o1-scala" aria-hidden="true">${[6, 9, 12, 15, 18, 21].map(o => `<span style="left:${pc(o * 60)}">${o}</span>`).join('')}</div>
    </div>
    <p class="o1-leg" aria-hidden="true"><span><i class="o1-b--tappa"></i>tappe</span><span><i class="o1-b--pausa"></i>pranzo</span><span><i class="o1-b--fuori"></i>oltre la fine</span><span><i class="o1-segno-p"></i>quando finisci</span></p>
    ${esito(e)}</div>`;
};
// dopo un cambio: solo i pezzi che si muovono (il dito resta sulla maniglia)
function aggiorna1() {
  const e = effetto(), o = O(), r = $('.o1'); if (!r) return;
  for (const k of ['inizio', 'fine']) {
    const p = $(`.o1-pollice--${k}`, r), n = $(`[data-o="v-${k}"]`, r);
    p.style.left = pc(o[k]); p.setAttribute('aria-valuenow', o[k]); p.setAttribute('aria-valuetext', h(o[k])); $('.o1-bolla', p).textContent = h(o[k]);
    if (n.textContent !== h(o[k])) { n.textContent = h(o[k]); rotola(n); }
    $$(`[data-pm][data-k="${k}"]`, r).forEach(b => { b.disabled = +b.dataset.pm < 0 ? o[k] <= (k === 'inizio' ? MIN_I : MIN_F) : o[k] >= (k === 'inizio' ? MAX_I : MAX_F); });
  }
  const f = $('[data-o="fascia"]', r); f.style.left = pc(o.inizio); f.style.width = larg(o.inizio, o.fine);
  $('[data-o="pezzi"]', r).innerHTML = pezzi1(e);
  const s = $('[data-o="segno"]', r); s.style.left = pc(e.st); s.classList.toggle('o1-segno--oltre', e.oltre); s.classList.toggle('o1-segno--dx', aDestra(e.st)); $('span', s).textContent = h(e.st);
  $('[data-o="esito"]', r).outerHTML = esito(e);
}
const rotola = n => { if (!piano()) return; n.classList.remove('rotola'); void n.offsetWidth; n.classList.add('rotola'); };

// ---------- proposta 2 · tutte le ore (un foglio intero, come il calendario) ----------
const FASCE = [['Presto', 5, 7], ['Mattina', 8, 12], ['Pomeriggio', 13, 17], ['Sera', 18, 23]];
const campo2 = k => `<div class="campo"><span class="campo__et" id="et-${k}">${k === 'inizio' ? 'Inizio' : 'Fine'} del giorno ${S.g + 1}</span>
  <button type="button" class="campo__b" data-a="ore" data-k="${k}" aria-haspopup="dialog" aria-labelledby="et-${k} val-${k}">${ic('ora', 22)}<span id="val-${k}">${h(O()[k])}</span>${ic('giu', 18)}</button></div>`;
const p2 = () => `<div class="o2-campi">${campo2('inizio')}${campo2('fine')}</div>${esito(effetto())}`;
function griglia2(fuoco) {
  const e = effetto(), o = O(), st = e.st;
  const stato = m => {
    const dentro = m >= o.inizio && m < st, oltre = e.oltre && m >= o.fine && m < st;
    const no = S.modo === 'inizio' ? m > MAX_I : m < MIN_F;
    return { dentro, oltre, no, primo: m === o.inizio, ultimo: dentro && m + PASSO >= st, scelto: m === o[S.modo], altro: m === o[S.modo === 'inizio' ? 'fine' : 'inizio'], fine: st >= m && st < m + PASSO };
  };
  const cella = m => {
    if (m > MAX_F || m < MIN_I) return '<td></td>';
    const s = stato(m);
    const td = s.dentro ? ` class="in${s.primo ? ' in-primo' : ''}${s.ultimo ? ' in-ultimo' : ''}"` : '';
    const cl = ['q', s.scelto && 'q--scelto', s.altro && 'q--altro', s.dentro && 'q--dentro'].filter(Boolean).join(' ');
    const dopo = [s.scelto && (S.modo === 'inizio' ? 'inizio' : 'fine'), s.altro && (S.modo === 'inizio' ? 'fine' : 'inizio'), s.fine && `qui finisci, alle ${h(st)}`, s.dentro && !s.scelto && !s.altro && !s.fine && 'nella tua giornata', s.oltre && 'oltre la fine che hai scelto'].filter(Boolean).join(', ');
    return `<td${td}><button type="button" class="${cl}" data-m="${m}" aria-pressed="${s.scelto}" tabindex="${m === fuoco ? 0 : -1}"${s.no ? ' disabled' : ''}>${h(m)}${dopo ? `<span class="vh">, ${dopo}</span>` : ''}${s.fine ? '<span class="q-k" aria-hidden="true">fine</span>' : ''}${s.oltre ? '<span class="punto" aria-hidden="true"></span>' : ''}</button></td>`;
  };
  return FASCE.map(([t, a, b]) => `<section class="oz-fascia" aria-label="${t}"><h3 aria-hidden="true">${t}</h3><table class="oz-gr"><tbody>${Array.from({ length: b - a + 1 }, (_, i) => a + i).map(o => `<tr>${[0, 15, 30, 45].map(q => cella(o * 60 + q)).join('')}</tr>`).join('')}</tbody></table></section>`).join('');
}
const modo2 = k => `<button type="button" class="oz-modo__b" data-a="modo" data-k="${k}" aria-pressed="${S.modo === k}"><span>${k === 'inizio' ? 'Inizio' : 'Fine'}</span><b>${h(O()[k])}</b></button>`;
function dialogo2(fuoco = O()[S.modo]) {
  const e = effetto();
  return `<div class="oz">
    <div class="oz-testa"><h2 id="ore-titolo">Orari del giorno ${S.g + 1}</h2><button type="button" class="f-chiudi" data-a="oz-chiudi" aria-label="Chiudi">${ic('x')}</button></div>
    <div class="oz-modo" role="group" aria-label="Cosa scegli">${modo2('inizio')}${modo2('fine')}</div>
    <p class="oz-nota"><span class="oz-nota__fascia" aria-hidden="true"></span>La tua giornata, con le tappe di oggi.${e.oltre ? ' <span class="punto" aria-hidden="true"></span>Oltre la fine che hai scelto.' : ''}</p>
    <div class="oz-scorre">${griglia2(fuoco)}</div>
    <div class="oz-piede"><p class="oz-sel" aria-live="polite"><b>Dalle ${h(O().inizio)} alle ${h(O().fine)}</b><span>${e.oltre ? `Finisci alle ${h(e.st)}: ${elenca(e.fuori)} ${e.fuori.length > 1 ? 'restano' : 'resta'} fuori` : `Finisci alle ${h(e.st)}, ${e.corto}`}</span></p>
      <button type="button" class="f-bottone" data-a="oz-chiudi">Fatto</button></div>
  </div>`;
}
const dlg = $('#ore');
function apri2(k) {
  S.modo = k;
  dlg.innerHTML = dialogo2();
  dlg.showModal();
  centra2();
  $('.q[tabindex="0"]', dlg)?.focus({ preventScroll: true });
}
// come il calendario si apre sul mese: la fascia dell'ora scelta (Mattina, Sera…) con il titolo in alto; se l'ora non ci sta, al centro
function centra2() {
  const sc = $('.oz-scorre', dlg), b = $('.q[tabindex="0"]', dlg); if (!sc || !b) return;
  const top = sc.getBoundingClientRect().top - sc.scrollTop, sez = b.closest('.oz-fascia').getBoundingClientRect(), r = b.getBoundingClientRect();
  sc.scrollTop = r.bottom - sez.top < sc.clientHeight - 16 ? sez.top - top : Math.max(0, r.top - top - sc.clientHeight * .35);
}
function ridisegna2(fuoco) {
  const sc = $('.oz-scorre', dlg), y = sc?.scrollTop ?? 0;
  dlg.innerHTML = dialogo2(fuoco);
  $('.oz-scorre', dlg).scrollTop = y;
}
let chiudendo = false;
function chiudi2() {
  if (!dlg.open || chiudendo) return;
  if (piano()) { chiudendo = true; dlg.classList.add('esce'); setTimeout(() => { dlg.classList.remove('esce'); dlg.close(); chiudendo = false; }, 220); }
  else dlg.close();
}
dlg.addEventListener('close', () => { disegna({ fuoco: `[data-a="ore"][data-k="${S.modo}"]` }); });
dlg.addEventListener('cancel', e => { e.preventDefault(); chiudi2(); });
dlg.addEventListener('click', e => { if (e.target === dlg) chiudi2(); });

// ---------- proposta 3 · la frase ----------
const VELOCI = { inizio: [['Presto', 480], ['Con calma', 570], ['Tardi', 660]], fine: [['Prima di cena', 1140], ['Sera', 1260]] };
const spin = k => {
  const o = O(), [mn, mx] = k === 'inizio' ? [MIN_I, MAX_I] : [MIN_F, MAX_F];
  return `<span class="o3-spin"><button type="button" class="o3-pm" tabindex="-1" data-pm="-15" data-k="${k}" aria-label="${k === 'inizio' ? 'Inizio' : 'Fine'} 15 minuti prima"${o[k] <= mn ? ' disabled' : ''}>${ic('meno', 18)}</button>
    <span class="o3-v" role="spinbutton" tabindex="0" data-k="${k}" aria-labelledby="o3-et-${k}" aria-valuemin="${mn}" aria-valuemax="${mx}" aria-valuenow="${o[k]}" aria-valuetext="${h(o[k])}"><b data-o="v-${k}">${h(o[k])}</b></span>
    <button type="button" class="o3-pm" tabindex="-1" data-pm="15" data-k="${k}" aria-label="${k === 'inizio' ? 'Inizio' : 'Fine'} 15 minuti dopo"${o[k] >= mx ? ' disabled' : ''}>${ic('piu', 18)}</button></span>`;
};
const veloci3 = () => {
  const e = effetto(), o = O(), appena = Math.min(MAX_F, Math.max(o.inizio + STACCO, su(e.st, 15)));
  const chip = (k, t, m) => `<button type="button" class="f-chip" data-a="veloce" data-k="${k}" data-v="${m}" aria-pressed="${o[k] === m}"><span>${t}</span> <b>${h(m)}</b></button>`;
  return `<div class="o3-veloci" role="group" aria-label="Inizi veloci">${VELOCI.inizio.map(([t, m]) => chip('inizio', t, m)).join('')}</div>
    <div class="o3-veloci" role="group" aria-label="Fini veloci">${chip('fine', 'Appena finisci', appena)}${VELOCI.fine.filter(([, m]) => m !== appena).map(([t, m]) => chip('fine', t, m)).join('')}</div>`;
};
const timbro3 = e => `<div class="o3-esito${e.oltre ? ' o3-esito--oltre' : ''}" data-o="esito3">
  <div class="o3-timbro" aria-hidden="true"><span class="o3-timbro__su">Giorno ${S.g + 1}</span><b>${h(e.st)}</b><span class="o3-timbro__giu">${e.oltre ? 'oltre' : 'fine'}</span></div>
  <div class="o3-esito__testo"><span class="o3-esito__et">Con queste tappe finisci alle</span><b class="o3-esito__ora">${h(e.st)}</b>
    <span>${e.oltre ? `${e.corto}: ${elenca(e.fuori)} ${e.fuori.length > 1 ? 'restano' : 'resta'} fuori.` : `${e.corto[0].toUpperCase()}${e.corto.slice(1)}. Ultima tappa: ${e.ultima}.`}</span>
    ${e.pranzo && !e.oltre ? `<span class="o3-esito__poco">${QUALE.pranzo} verso le ${h(e.pranzo[1])}, prima tappa alle ${h(e.x.tappe[0][1])}.</span>` : ''}${ALLUNGA(e)}</div></div>`;
const p3 = () => `<div class="o3" role="group" aria-labelledby="o3-t"><h2 class="campo__et" id="o3-t">Orari del giorno ${S.g + 1}</h2>
  <p class="o3-frase"><span class="o3-riga"><span id="o3-et-inizio">Cominci alle</span>${spin('inizio')}</span><span class="o3-riga"><span id="o3-et-fine">Finisci entro le</span>${spin('fine')}</span></p>
  <div data-o="veloci">${veloci3()}</div>
  ${timbro3(effetto())}</div>`;
function aggiorna3() {
  const r = $('.o3'); if (!r) return;
  for (const k of ['inizio', 'fine']) {
    const o = O(), v = $(`.o3-v[data-k="${k}"]`, r), n = $(`[data-o="v-${k}"]`, r), [mn, mx] = k === 'inizio' ? [MIN_I, MAX_I] : [MIN_F, MAX_F];
    v.setAttribute('aria-valuenow', o[k]); v.setAttribute('aria-valuetext', h(o[k]));
    if (n.textContent !== h(o[k])) { n.textContent = h(o[k]); rotola(n); }
    $$(`.o3-pm[data-k="${k}"]`, r).forEach(b => { b.disabled = +b.dataset.pm < 0 ? o[k] <= mn : o[k] >= mx; });
  }
  const f = document.activeElement?.closest?.('[data-a="veloce"]');
  $('[data-o="veloci"]', r).innerHTML = veloci3();
  if (f) $(`[data-a="veloce"][data-k="${f.dataset.k}"][data-v="${O()[f.dataset.k]}"]`, r)?.focus({ preventScroll: true });
  const vecchio = $('[data-o="esito3"]', r), ora = $('.o3-esito__ora', vecchio)?.textContent, e = effetto();
  vecchio.outerHTML = timbro3(e);
  if (ora !== h(e.st)) { const n = $('.o3-esito__ora', r), t = $('.o3-timbro', r); rotola(n); if (t && piano()) { t.classList.remove('timbra'); void t.offsetWidth; t.classList.add('timbra'); } }
}

// ---------- disegno ----------
const corpo = $('.f-corpo');
function disegna({ fuoco } = {}) {
  const root = document.documentElement;
  root.className = `v${S.v} p${S.p}`;
  root.dataset.theme = S.t;
  $$('.prova [data-p]').forEach(b => b.setAttribute('aria-pressed', String(String(S[b.dataset.p]) === b.dataset.v)));
  const P = PROPOSTE[S.p - 1];
  $('.prova__nome').innerHTML = `<b>${P.n} · ${P.nome}</b>: ${P.dice}. <span>Giornate vere di «${DATI.nome}», giorno ${S.g + 1}; un giorno feriale, con il pranzo come lo mette il sito.</span>`;
  $('.scena__sfondo').src = SFONDI[`${S.v}-${S.t}-${innerWidth >= 960 ? 'pc' : 'tel'}`];
  corpo.innerHTML = `${NOTA}${DATA()}${S.p === 1 ? p1() : S.p === 2 ? p2() : p3()}${CODA()}`;
  if (S.p === 1) aggiorna1();
  if (fuoco) $(fuoco)?.focus({ preventScroll: true });
  scriviIndirizzo();
}
// dopo un cambio d'ora, nella proposta aperta
function dopoCambio(k, r, { annuncio = true } = {}) {
  if (S.p === 1) aggiorna1();
  if (S.p === 3) aggiorna3();
  if (S.p === 2) {
    const v = $(`#val-${k}`), w = r.spinta && $(`#val-${r.spinta}`);
    if (v) v.textContent = h(O()[k]); if (w) w.textContent = h(O()[r.spinta]);
    $('[data-o="esito"]', corpo).outerHTML = esito(effetto());
  }
  scriviIndirizzo();
  if (annuncio && (r.cambiata || r.spinta)) annunciaCambio(k, r);
}
addEventListener('resize', () => { $('.scena__sfondo').src = SFONDI[`${S.v}-${S.t}-${innerWidth >= 960 ? 'pc' : 'tel'}`]; });
new ResizeObserver(() => document.documentElement.style.setProperty('--prova', `${$('.prova').offsetHeight}px`)).observe($('.prova'));

// ---------- tocchi ----------
let ripeti = 0;
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  if (b.dataset.p) {
    const k = b.dataset.p, v = b.dataset.v;
    S[k] = k === 'p' || k === 'g' ? +v : v;
    if (dlg.open && k !== 't' && k !== 'v') dlg.close();
    disegna({ fuoco: `.prova [data-p="${k}"][data-v="${v}"]` });
    if (dlg.open) ridisegna2();
    if (k === 'p' || k === 'g') $('.f-scorre').scrollTop = 0;
    return;
  }
  if (b.dataset.pm && !b.dataset.tenuto) { const k = b.dataset.k; dopoCambio(k, imposta(k, O()[k] + +b.dataset.pm)); return; }
  const a = b.dataset.a;
  if (a === 'data') { annuncia('Nella prova il calendario non si apre: è quello già nel sito.', true); return; }
  if (a === 'chiudi') { annuncia('Nella prova il foglio resta aperto.', true); return; }
  if (a === 'allunga') { const r = imposta('fine', +b.dataset.v); dopoCambio('fine', r); if (dlg.open) ridisegna2(); $(['', '.o1-pollice--fine', '[data-a="ore"][data-k="fine"]', '.o3-v[data-k="fine"]'][S.p])?.focus({ preventScroll: true }); return; }
  if (a === 'veloce') { const k = b.dataset.k, r = imposta(k, +b.dataset.v); dopoCambio(k, r); return; }
  if (a === 'ore') { apri2(b.dataset.k); return; }
  if (a === 'modo') { S.modo = b.dataset.k; ridisegna2(O()[S.modo]); centra2(); $('.q[tabindex="0"]', dlg)?.focus({ preventScroll: true }); annuncia(`Scegli ${S.modo === 'inizio' ? "l'inizio" : 'la fine'}: ora ${h(O()[S.modo])}.`, true); return; }
  if (a === 'oz-chiudi') { chiudi2(); return; }
  const m = b.dataset.m;
  if (m && b.closest('.ore')) {
    const k = S.modo, r = imposta(k, +m);
    dopoCambio(k, r, { annuncio: false });
    // dopo l'inizio si passa alla fine, come nel calendario si passa dal primo giorno al viaggio
    S.modo = 'fine';
    ridisegna2(+m);
    $(`.q[data-m="${m}"]`, dlg)?.focus({ preventScroll: true });
    annuncia(`${k === 'inizio' ? 'Inizio' : 'Fine'} ${h(O()[k])}.${r.spinta ? ` ${r.spinta === 'fine' ? 'La fine' : "L'inizio"} si sposta alle ${h(O()[r.spinta])}.` : ''} ${effetto().testo}${k === 'inizio' ? ' Ora scegli la fine.' : ''}`, true);
  }
});
// − e + tenuti premuti: vanno avanti da soli (dopo 400 ms, ogni 110 ms)
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('[data-pm]'); if (!b || b.disabled) return;
  clearTimeout(ripeti);
  const passo = () => { if (b.disabled) return; b.dataset.tenuto = '1'; const k = b.dataset.k; dopoCambio(k, imposta(k, O()[k] + +b.dataset.pm)); ripeti = setTimeout(passo, 110); };
  ripeti = setTimeout(passo, 400);
  const via = () => { clearTimeout(ripeti); setTimeout(() => { delete b.dataset.tenuto; }, 0); removeEventListener('pointerup', via); removeEventListener('pointercancel', via); };
  addEventListener('pointerup', via); addEventListener('pointercancel', via);
});

// ---------- proposta 1: trascinare sulla barra (la maniglia più vicina segue il dito) ----------
let presa = null;
const minutiDi = (pista, x) => { const r = pista.getBoundingClientRect(); return INIZIO_PISTA + Math.min(1, Math.max(0, (x - r.left) / r.width)) * (FINE_PISTA - INIZIO_PISTA); };
document.addEventListener('pointerdown', e => {
  const pista = e.target.closest('.o1-pista'); if (!pista || e.button > 0) return;
  const m = minutiDi(pista, e.clientX), o = O();
  const tenuta = e.target.closest('.o1-pollice')?.dataset.k;
  const k = tenuta ?? (Math.abs(m - o.inizio) < Math.abs(m - o.fine) || (m < o.inizio) ? 'inizio' : 'fine');
  presa = { k, pista, id: e.pointerId, dx: tenuta ? m - o[k] : 0 };
  pista.setPointerCapture(e.pointerId);
  pista.classList.add('o1-pista--presa');
  $(`.o1-pollice--${k}`, pista).classList.add('attivo');
  $(`.o1-pollice--${k}`, pista).focus({ preventScroll: true });
  if (!tenuta) dopoCambio(k, imposta(k, m));
  e.preventDefault();
});
document.addEventListener('pointermove', e => {
  if (!presa || e.pointerId !== presa.id) return;
  const r = imposta(presa.k, minutiDi(presa.pista, e.clientX) - presa.dx);
  if (r.cambiata || r.spinta) dopoCambio(presa.k, r);
});
const lascia = e => {
  if (!presa || e.pointerId !== presa.id) return;
  presa.pista.classList.remove('o1-pista--presa');
  $$('.o1-pollice', presa.pista).forEach(p => p.classList.remove('attivo'));
  presa = null;
};
document.addEventListener('pointerup', lascia);
document.addEventListener('pointercancel', lascia);

// ---------- tastiera ----------
// maniglie (proposta 1) e numeri (proposta 3): frecce 15 minuti, Pagina su e giù un'ora, Inizio e Fine ai limiti
document.addEventListener('keydown', e => {
  const t = e.target.closest?.('.o1-pollice, .o3-v'); if (!t) return;
  const k = t.dataset.k, v = O()[k], [mn, mx] = k === 'inizio' ? [MIN_I, MAX_I] : [MIN_F, MAX_F];
  const nuovo = { ArrowLeft: v - 15, ArrowDown: v - 15, ArrowRight: v + 15, ArrowUp: v + 15, PageDown: v - 60, PageUp: v + 60, Home: mn, End: mx }[e.key];
  if (nuovo == null) return;
  e.preventDefault();
  dopoCambio(k, imposta(k, nuovo));
});
// la griglia delle ore (proposta 2): frecce di lato 15 minuti, su e giù un'ora, Pagina su e giù tre ore, Inizio e Fine della riga
document.addEventListener('keydown', e => {
  const b = e.target.closest?.('.q'); if (!b) return;
  const m = +b.dataset.m, q = m % 60;
  const y = { ArrowLeft: m - 15, ArrowRight: m + 15, ArrowUp: m - 60, ArrowDown: m + 60, PageUp: m - 180, PageDown: m + 180, Home: m - q, End: m - q + 45 }[e.key];
  if (y == null) return;
  e.preventDefault();
  const t = $(`.q[data-m="${Math.min(MAX_F, Math.max(MIN_I, y))}"]`, dlg); if (!t) return;
  b.tabIndex = -1; t.tabIndex = 0; t.focus({ preventScroll: true }); t.scrollIntoView({ block: 'nearest' });
});

disegna();
if (S.p === 2 && H.get('a') === '1') apri2(H.get('modo') === 'fine' ? 'fine' : 'inizio');
