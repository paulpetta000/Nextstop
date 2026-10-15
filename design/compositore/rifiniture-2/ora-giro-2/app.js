// Tranche 2 · selettore dell'ora, giro 2 (Enrico, 15/10/2026: via la 1 e la 3; la 2 migliorata, con la fascia giusta; due
// proposte nuove). Tutte e tre si aprono dai campi «Inizio» e «Fine» del foglio «Data e orari», in un foglio intero come il
// calendario «Tutti i mesi»: 2 la griglia delle ore, 4 il quadrante, 5 le ruote. Le giornate vere arrivano da genera.mjs
// (giornate.mjs: il calcolo del sito per ogni inizio da 5:00 a 20:00, giorno feriale, pranzo come lo mette il sito).
// Restano passi e limiti di oggi: 15 minuti, inizio 5:00–20:00, fine 6:00–23:45, almeno un'ora tra inizio e fine.
const DATI = /*DATI*/null;
const SFONDI = /*SFONDI*/null;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const piano = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- ore e parole ----------
const MIN_I = 300, MAX_I = 1200, MIN_F = 360, MAX_F = 1425, PASSO = 15, STACCO = 60;
const pad = n => String(n).padStart(2, '0');
const h = m => m >= 1440 ? `${h(m - 1440)} di notte` : `${Math.floor(m / 60)}:${pad(m % 60)}`;
// l'ora scritta con i minuti più leggeri: «9» e «:30»
const hh = m => `<span class="o-h">${Math.floor(m / 60)}</span><span class="o-m">:${pad(m % 60)}</span>`;
const durata = m => { const o = Math.floor(m / 60), r = m % 60; return [o ? `${o} ${o === 1 ? 'ora' : 'ore'}` : '', r ? `${r} ${r === 1 ? 'minuto' : 'minuti'}` : ''].filter(Boolean).join(' e ') || '0 minuti'; };
const elenca = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a.at(-1)}`;
const nome = id => DATI.nomi[id] ?? id;
const su = (m, a) => Math.ceil(m / a) * a;
const LIMITI = { inizio: [MIN_I, MAX_I], fine: [MIN_F, MAX_F] };
const NOME = { inizio: 'Inizio', fine: 'Fine' };

// ---------- stato (anche nell'indirizzo, per le immagini) ----------
const S = { p: 2, v: 'c', t: document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), g: 0, modo: 'inizio' };
const ORE = DATI.giorni.map(G => ({ inizio: G.inizio, fine: G.fine }));
const H = new URLSearchParams(location.hash.slice(1));
for (const [k, v] of H) if (k in S) S[k] = k === 'p' || k === 'g' ? +v : v;
if (![2, 4, 5].includes(S.p)) S.p = 2;
const daOra = v => /^\d{1,2}:\d{2}$/.test(v) ? +v.split(':')[0] * 60 + +v.split(':')[1] : +v;
if (H.get('i')) ORE[S.g].inizio = daOra(H.get('i'));
if (H.get('f')) ORE[S.g].fine = daOra(H.get('f'));
const O = () => ORE[S.g];
const scriviIndirizzo = () => { try { history.replaceState(null, '', '#' + new URLSearchParams({ p: S.p, v: S.v, t: S.t, g: S.g, i: h(O().inizio), f: h(O().fine) })); } catch { /* nella pagina pubblicata l'indirizzo non si cambia: non serve */ } };

// la giornata calcolata con l'inizio scelto: tappe [id, inizio, fine], pause [quale, inizio, fine], fine
const giornata = () => DATI.giorni[S.g].per[O().inizio];
// cosa cambia: quando finisci, l'ultima tappa, quelle che restano oltre la fine scelta, il pranzo
function effetto() {
  const x = giornata(), { fine } = O(), st = x.fine;
  const fuori = x.tappe.filter(t => t[2] > fine).map(t => nome(t[0]));
  const oltre = st > fine;
  const allunga = oltre && su(st, 30) <= MAX_F ? su(st, 30) : null;
  const corto = oltre ? `${durata(st - fine)} dopo le ${h(fine)}` : st === fine ? `proprio alle ${h(fine)}` : `${durata(fine - st)} prima delle ${h(fine)}`;
  const resta = `${elenca(fuori)} ${fuori.length > 1 ? 'restano' : 'resta'} fuori`;
  return { x, st, ultima: nome(x.tappe.at(-1)[0]), prima: [nome(x.tappe[0][0]), x.tappe[0][1]], fuori, resta, pranzo: x.pause.find(q => q[0] === 'pranzo'), oltre, allunga, corto,
    testo: oltre ? `Finisci alle ${h(st)}, ${corto}: ${resta}.` : `Finisci alle ${h(st)}, ${corto}. Ultima tappa: ${nome(x.tappe.at(-1)[0])}.` };
}

// cambiare un'ora: dentro i limiti, a passi di 15 minuti; se inizio e fine si avvicinano meno di un'ora, l'altra si sposta con lei
function imposta(k, v) {
  const o = O(), prima = { ...o };
  v = Math.round(v / PASSO) * PASSO;
  if (k === 'inizio') { o.inizio = Math.min(MAX_I, Math.max(MIN_I, v)); if (o.fine < o.inizio + STACCO) o.fine = o.inizio + STACCO; }
  else { o.fine = Math.min(MAX_F, Math.max(MIN_F, v)); if (o.inizio > o.fine - STACCO) o.inizio = o.fine - STACCO; }
  const altra = k === 'inizio' ? 'fine' : 'inizio';
  return { k, cambiata: o[k] !== prima[k], spinta: o[altra] !== prima[altra] ? altra : null };
}

// ---------- annunci (quando le dita o i tasti si fermano) ----------
let tAnnuncio = 0;
const annuncia = (t, subito = false) => {
  clearTimeout(tAnnuncio);
  const a = $('.annuncio');
  tAnnuncio = setTimeout(() => { a.textContent = ''; requestAnimationFrame(() => { a.textContent = t; }); }, subito ? 0 : 650);
};
const fraseCambio = r => `${NOME[r.k]} ${h(O()[r.k])}.${r.spinta ? ` ${r.spinta === 'fine' ? 'La fine' : "L'inizio"} si sposta alle ${h(O()[r.spinta])}.` : ''} ${effetto().testo}`;

// ---------- icone (tratto 1,8 come nel compositore) ----------
const IC = {
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  ora: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  giu: '<path d="m6 9 6 6 6-6"/>',
  freccia: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>'
};
const ic = (n, z = 20) => `<svg class="ic" width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

const PROPOSTE = {
  2: { nome: 'Tutte le ore', dice: 'la gemella del calendario, rifatta: la fascia va dall\'inizio alla fine che scegli, tutta di un pezzo; dentro, più chiaro, il tempo che ti avanza; il punto giallo dove la giornata va oltre' },
  4: { nome: 'Il quadrante', dice: 'un orologio di 24 ore con il mezzogiorno in alto: trascini i due punti sul cerchio, l\'arco è la tua giornata e dentro girano tappe e pranzo' },
  5: { nome: 'Le ruote', dice: 'due ruote che scorrono, una per l\'inizio e una per la fine; sotto, il percorso del giorno con la prima tappa, il pranzo e quando finisci' }
};

// ---------- il foglio «Data e orari» ----------
const NOTA = '<p class="f-nota">Con la data vedi quali tappe sono chiuse proprio quel giorno e i mezzi del sabato e della domenica. Senza data i giorni di chiusura restano nella scheda di ogni tappa.</p>';
// il campo della data com'è nel sito (calendario «Tutti i mesi»): qui non si apre
const DATA = () => `<div class="campo"><span class="campo__et" id="et-data">${S.g ? 'Data del giorno 2' : 'Primo giorno'}</span>
  <button type="button" class="campo__b campo__b--vuoto" data-a="data" aria-labelledby="et-data val-data">${ic('cal', 22)}<span id="val-data">Scegli il giorno</span>${ic('giu', 18)}</button></div>`;
const CAMPO = k => `<div class="campo"><span class="campo__et" id="et-${k}">${NOME[k]} del giorno ${S.g + 1}</span>
  <button type="button" class="campo__b campo__b--ora" data-a="ore" data-k="${k}" aria-haspopup="dialog" aria-labelledby="et-${k} val-${k}">${ic('ora', 22)}<span id="val-${k}">${h(O()[k])}</span>${ic('giu', 18)}</button></div>`;
const ESITO = e => `<p class="esito${e.oltre ? ' esito--oltre' : ''}" data-o="esito"><span class="esito__punto" aria-hidden="true"></span><span>${e.testo}</span></p>`;
const CODA = `<label class="f-spunta"><input type="checkbox" id="f-piedi"><span>Solo a piedi, senza metro, funicolari e autobus<small>Vale per tutti i giorni di questo itinerario.</small></span></label>
  <div class="f-conferma"><button type="button" class="f-bottone" data-a="chiudi">Fatto</button></div>`;

// ---------- il foglio delle ore: testa, la proposta, l'avviso se vai oltre, il piede con «Fatto» ----------
const dlg = $('#ore');
const piede = e => `<p class="oz-sel"><b>Dalle ${h(O().inizio)} alle ${h(O().fine)}</b><span>${e.oltre ? `Finisci alle ${h(e.st)}` : `Finisci alle ${h(e.st)}, ${e.corto}`}</span></p>`;
const avviso = e => e.oltre ? `<span>${e.resta}.</span>${e.allunga ? `<button type="button" class="f-bottone f-bottone--piccolo" data-a="allunga" data-v="${e.allunga}">Finisci alle ${h(e.allunga)}</button>` : '<span>Comincia prima o sposta una tappa in un altro giorno.</span>'}` : '';
const guscio = corpo => `<div class="oz">
  <div class="oz-testa"><div><p class="oz-occhio">${DATI.nome} · giorno ${S.g + 1}</p><h2 id="ore-titolo">Orari del giorno</h2></div><button type="button" class="f-chiudi" data-a="oz-chiudi" aria-label="Chiudi">${ic('x')}</button></div>
  <div class="oz-corpo">${corpo}</div>
  <div class="oz-avviso" data-o="avviso" role="status"${effetto().oltre ? '' : ' hidden'}>${avviso(effetto())}</div>
  <div class="oz-piede"><div data-o="piede">${piede(effetto())}</div><button type="button" class="f-bottone" data-a="oz-chiudi">Fatto</button></div>
</div>`;
// dopo un cambio: il piede, l'avviso e, dietro, i campi del foglio «Data e orari»
function aggiornaComuni() {
  const e = effetto(), av = $('[data-o="avviso"]', dlg);
  $('[data-o="piede"]', dlg).innerHTML = piede(e);
  if (av) { av.hidden = !e.oltre; av.innerHTML = avviso(e); }
  for (const k of ['inizio', 'fine']) { const v = $(`#val-${k}`); if (v) v.textContent = h(O()[k]); }
  const es = $('[data-o="esito"]', corpo); if (es) es.outerHTML = ESITO(e);
  scriviIndirizzo();
}
const PROP = {};
function apri(k) {
  S.modo = k;
  const P = PROP[S.p];
  dlg.innerHTML = guscio(P.corpo());
  dlg.className = `ore ore--p${S.p}`;
  dlg.showModal();
  P.monta?.();
  P.fuoco();
}
let chiudendo = false;
function chiudi() {
  if (!dlg.open || chiudendo) return;
  if (piano()) { chiudendo = true; dlg.classList.add('esce'); setTimeout(() => { dlg.classList.remove('esce'); dlg.close(); chiudendo = false; }, 240); }
  else dlg.close();
}
dlg.addEventListener('close', () => { PROP[S.p].smonta?.(); disegna({ fuoco: `[data-a="ore"][data-k="${S.modo}"]` }); });
dlg.addEventListener('cancel', e => { e.preventDefault(); chiudi(); });
dlg.addEventListener('click', e => { if (e.target === dlg) chiudi(); });
// un cambio dentro il foglio delle ore
function cambia(k, v, { annuncio = true } = {}) {
  const r = imposta(k, v);
  if (!r.cambiata && !r.spinta) return r;
  PROP[S.p].aggiorna(r);
  aggiornaComuni();
  if (annuncio) annuncia(fraseCambio(r));
  return r;
}

// ================= proposta 2 · tutte le ore =================
// Una selezione unica dall'inizio alla fine scelti (come si seleziona un testo): dentro, più chiaro, il tempo che avanza dopo
// l'ultima tappa; il punto giallo sui quarti in cui la giornata va oltre la fine. Si aggiorna senza ridisegnare: la fascia scorre.
const FASCE = [['Presto', 5, 7], ['Mattina', 8, 12], ['Pomeriggio', 13, 17], ['Sera', 18, 23]];
PROP[2] = {
  corpo: () => `<div class="oz-modo" role="group" aria-label="Cosa scegli" data-modo="${S.modo}"><span class="oz-modo__ind" aria-hidden="true"></span>
      ${['inizio', 'fine'].map(k => `<button type="button" class="oz-modo__b" data-a="modo" data-k="${k}" aria-pressed="${S.modo === k}"><span>${NOME[k]}</span><b data-o="m-${k}">${hh(O()[k])}</b></button>`).join(ic('freccia', 18))}</div>
    <p class="oz-leg" aria-hidden="true"><span><i class="leg-fascia"></i>la tua giornata</span><span><i class="leg-libero"></i>tempo in più</span><span><i class="punto"></i>oltre la fine</span></p>
    <div class="oz-scorre"><table class="oz-gr"><tbody>${FASCE.map(([t, a, b]) => `<tr class="oz-sez" data-da="${a * 60 - 15}" data-a="${a * 60}"><td colspan="4"><span>${t}</span></td></tr>${Array.from({ length: b - a + 1 }, (_, i) => a + i).map(o => `<tr>${[0, 15, 30, 45].map(q => { const m = o * 60 + q; return m < MIN_I || m > MAX_F ? '<td></td>' : `<td><button type="button" class="q" data-m="${m}" tabindex="-1">${hh(m)}<span class="vh" data-o="dopo"></span><span class="q-k" aria-hidden="true">finisci</span><span class="punto" aria-hidden="true"></span></button></td>`; }).join('')}</tr>`).join('')}`).join('')}</tbody></table></div>`,
  monta() { this.aggiorna(null, true); this.centra(); },
  fuoco() { $(`.q[data-m="${O()[S.modo]}"]`, dlg)?.focus({ preventScroll: true }); },
  // lo stato di ogni quarto d'ora; «da»: il quarto toccato, da cui la fascia si allarga (per il ritardo)
  aggiorna(r, primaVolta = false) {
    const o = O(), e = effetto(), st = e.st, da = r ? o[r.k] : o.inizio;
    $('.oz-modo', dlg).dataset.modo = S.modo;
    for (const k of ['inizio', 'fine']) { const b = $(`.oz-modo__b[data-k="${k}"]`, dlg); b.setAttribute('aria-pressed', String(S.modo === k)); const n = $(`[data-o="m-${k}"]`, dlg); if (n.dataset.v !== String(o[k])) { n.dataset.v = o[k]; n.innerHTML = hh(o[k]); if (!primaVolta) rotola(n); } }
    for (const tr of $$('.oz-sez', dlg)) { const a = +tr.dataset.da, b = +tr.dataset.a; tr.firstElementChild.className = a >= o.inizio && b <= o.fine ? (a >= st ? 'in in--libero' : 'in') : a >= o.fine && b < st ? 'oltre' : ''; tr.firstElementChild.style.setProperty('--d', `${Math.min(220, Math.abs(b - da) / PASSO * 9)}ms`); }
    for (const b of $$('.q', dlg)) {
      const m = +b.dataset.m, td = b.parentElement;
      const dentro = m >= o.inizio && m <= o.fine, libero = dentro && m >= st && m < o.fine, oltre = m > o.fine && m < st, fine = st >= m && st < m + PASSO;
      const capo = m === o.inizio ? 'inizio' : m === o.fine ? 'fine' : '';
      td.className = [dentro && 'in', libero && 'in--libero', m === o.inizio && 'in-primo', m === o.fine && 'in-ultimo', oltre && 'oltre'].filter(Boolean).join(' ');
      td.style.setProperty('--d', `${Math.min(220, Math.abs(m - da) / PASSO * 9)}ms`);
      const prima = b.className;
      b.className = ['q', capo && 'q--capo', capo && capo === S.modo && 'q--attivo', fine && 'q--finisci', oltre && 'q--oltre'].filter(Boolean).join(' ');
      if (!primaVolta && capo && !prima.includes('q--capo') && piano()) { b.classList.add('q--entra'); }
      b.setAttribute('aria-pressed', String(!!capo));
      b.disabled = S.modo === 'inizio' ? m > MAX_I : m < MIN_F;
      $('[data-o="dopo"]', b).textContent = [capo === 'inizio' && ', inizio', capo === 'fine' && ', fine', fine && `, qui finisci, alle ${h(st)}`, dentro && !capo && (libero ? ', tempo in più' : ', nella tua giornata'), oltre && ', oltre la fine che hai scelto'].filter(Boolean).join('');
      b.tabIndex = m === o[S.modo] ? 0 : -1;
    }
  },
  // come il calendario si apre sul mese: la parte del giorno dell'ora scelta (Mattina, Sera…) con il suo titolo in alto
  centra() {
    const sc = $('.oz-scorre', dlg), b = $('.q[tabindex="0"]', dlg); if (!sc || !b) return;
    let tr = b.closest('tr'); while (tr && !tr.classList.contains('oz-sez')) tr = tr.previousElementSibling;
    const top = sc.getBoundingClientRect().top - sc.scrollTop, sez = tr.getBoundingClientRect(), r = b.getBoundingClientRect();
    sc.scrollTop = r.bottom - sez.top < sc.clientHeight - 16 ? sez.top - top : Math.max(0, r.top - top - sc.clientHeight * .35);
  },
  // un tocco: con «Inizio» sceglie l'inizio e passa alla fine; con «Fine», un'ora prima dell'inizio diventa il nuovo inizio
  tocca(m) {
    let k = S.modo;
    if (k === 'fine' && m < O().inizio) k = 'inizio';
    const r = imposta(k, m);
    if (S.modo === 'inizio') S.modo = 'fine';
    this.aggiorna(r); aggiornaComuni();
    $(`.q[data-m="${m}"]`, dlg)?.focus({ preventScroll: true });
    annuncia(`${fraseCambio(r)}${k === 'inizio' ? ' Ora scegli la fine.' : ''}`, true);
  }
};
const rotola = n => { if (!piano()) return; n.classList.remove('rotola'); void n.offsetWidth; n.classList.add('rotola'); };

// ================= proposta 4 · il quadrante =================
// 24 ore sul cerchio, mezzogiorno in alto e mezzanotte in basso (il sole sale a sinistra e scende a destra). L'arco tra i due
// punti è la giornata scelta; dentro, un anello sottile con tappe e pranzo; a righe quello che va oltre la fine.
const C0 = 160, R = 112;
const ang = m => (90 + m / 1440 * 360) * Math.PI / 180;
const pt = (m, r = R) => [C0 + r * Math.cos(ang(m)), C0 + r * Math.sin(ang(m))];
const arco = (a, b, r = R) => { if (b <= a) return ''; const [x1, y1] = pt(a, r), [x2, y2] = pt(Math.min(b, a + 1439.9), r); return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${b - a > 720 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`; };
function pezzi4(e) {
  const { fine } = O(), out = [];
  const metti = (a, b, cl) => {
    const x = Math.min(b, fine);
    if (x > a) out.push(`<path class="qd-p ${cl}" d="${arco(a, x, R - 21)}"/>`);
    if (b > fine) out.push(`<path class="qd-p qd-p--fuori" d="${arco(Math.max(a, fine), Math.min(b, 1440), R - 21)}"/>`);
  };
  for (const [, a, b] of e.x.tappe) metti(a + 1, b - 1, 'qd-p--tappa');
  for (const [, a, b] of e.x.pause) metti(a + 1, b - 1, 'qd-p--pausa');
  return out.join('');
}
const NUMERI = [0, 3, 6, 9, 12, 15, 18, 21];
PROP[4] = {
  corpo() {
    const tacche = Array.from({ length: 96 }, (_, i) => { const m = i * 15, o = m % 60 === 0, [x1, y1] = pt(m, R + 15), [x2, y2] = pt(m, R + (o ? 23 : 19)); return `<line class="qd-t${o ? ' qd-t--ora' : ''}${m < MIN_I ? ' qd-t--notte' : ''}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; }).join('');
    const numeri = NUMERI.map(o => { const [x, y] = pt(o * 60, R + 36); return `<text class="qd-n" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${o}</text>`; }).join('');
    const maniglia = k => { const [mn, mx] = LIMITI[k]; return `<g class="qd-m qd-m--${k}" role="slider" tabindex="0" data-k="${k}" aria-label="${NOME[k]} del giorno ${S.g + 1}" aria-valuemin="${mn}" aria-valuemax="${mx}" aria-valuenow="" aria-valuetext=""><circle class="qd-m__presa" r="24"/><circle class="qd-m__anello" r="19"/><circle class="qd-m__punto" r="12"/></g>`; };
    return `<div class="qd">
      <div class="qd-orologio">
        <svg class="qd-svg" viewBox="0 0 320 320" aria-hidden="false" role="group" aria-label="Quadrante delle 24 ore, mezzogiorno in alto">
          <g aria-hidden="true"><circle class="qd-pista" cx="${C0}" cy="${C0}" r="${R}"/>
          <path class="qd-notte" d="${arco(0, MIN_I)}"/>
          <path class="qd-arco" data-o="arco" d=""/></g>
          <g data-o="pezzi" aria-hidden="true"></g>
          <circle class="qd-dentro" cx="${C0}" cy="${C0}" r="${R - 30}" aria-hidden="true"/>
          <g aria-hidden="true">${tacche}${numeri}</g>
          <g class="qd-st" data-o="st" aria-hidden="true"><circle r="4.5"/></g>
          ${maniglia('fine')}${maniglia('inizio')}
        </svg>
        <div class="qd-centro" aria-hidden="true" data-o="centro"></div>
      </div>
      <div class="qd-valori">${['inizio', 'fine'].map(k => `<button type="button" class="qd-v qd-v--${k}" data-a="fuoco" data-k="${k}"><i aria-hidden="true"></i><span>${NOME[k]}</span><b data-o="v-${k}">${hh(O()[k])}</b></button>`).join('')}</div>
      <p class="qd-aiuto">Trascina i due punti sul cerchio. Il mezzogiorno è in alto.</p></div>`;
  },
  monta() { this.aggiorna(null, true); },
  fuoco() { $(`.qd-m--${S.modo}`, dlg)?.focus({ preventScroll: true }); },
  aggiorna(r, primaVolta = false) {
    const o = O(), e = effetto();
    $('[data-o="arco"]', dlg).setAttribute('d', arco(o.inizio, o.fine));
    $('[data-o="pezzi"]', dlg).innerHTML = pezzi4(e);
    const [sx, sy] = pt(Math.min(e.st, 1439), R - 21);
    const st = $('[data-o="st"]', dlg); st.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)})`); st.classList.toggle('qd-st--oltre', e.oltre);
    for (const k of ['inizio', 'fine']) {
      const [x, y] = pt(o[k]), g = $(`.qd-m--${k}`, dlg);
      g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      g.setAttribute('aria-valuenow', o[k]); g.setAttribute('aria-valuetext', `${h(o[k])}. ${k === 'fine' ? e.testo : ''}`.trim());
      const n = $(`[data-o="v-${k}"]`, dlg); if (n.dataset.v !== String(o[k])) { n.dataset.v = o[k]; n.innerHTML = hh(o[k]); if (!primaVolta) rotola(n); }
    }
    const c = $('[data-o="centro"]', dlg), prima = c.dataset.st;
    c.className = `qd-centro${e.oltre ? ' qd-centro--oltre' : ''}`;
    c.innerHTML = `<span>${e.oltre ? 'Finisci alle' : 'Finisci alle'}</span><b class="qd-ora">${hh(e.st)}</b><span>${e.oltre ? `${durata(e.st - o.fine)} dopo le ${h(o.fine)}` : `con ${e.ultima}`}</span>`;
    c.dataset.st = e.st;
    if (!primaVolta && prima !== String(e.st)) rotola($('.qd-ora', c));
  },
  smonta() { presa = null; }
};
// trascinare sul quadrante: la maniglia più vicina segue il dito; la notte (0–5) non si sceglie
let presa = null;
const minutiQd = (svg, x, y) => { const r = svg.getBoundingClientRect(), dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2), a = Math.atan2(dy, dx) * 180 / Math.PI; return { m: ((a - 90 + 720) % 360) / 360 * 1440, d: Math.hypot(dx, dy) / (r.width / 320) }; };
const giro = (k, m) => {
  const v = O()[k];
  if (m >= MIN_I) return Math.abs(m - v) > 720 ? (m > v ? LIMITI[k][0] : LIMITI[k][1]) : m;   // non salta dall'altra parte della notte
  return v > 720 ? LIMITI[k][1] : LIMITI[k][0];
};
document.addEventListener('pointerdown', e => {
  const svg = e.target.closest?.('.qd-svg'); if (!svg || e.button > 0) return;
  const { m, d } = minutiQd(svg, e.clientX, e.clientY), tenuta = e.target.closest('.qd-m')?.dataset.k;
  if (!tenuta && (d < 60 || d > 175)) return;
  const o = O(), dist = k => Math.min(Math.abs(m - o[k]), 1440 - Math.abs(m - o[k]));
  const k = tenuta ?? (dist('inizio') <= dist('fine') ? 'inizio' : 'fine');
  presa = { k, svg, id: e.pointerId };
  svg.setPointerCapture(e.pointerId);
  S.modo = k;
  $(`.qd-m--${k}`, dlg).classList.add('qd-m--presa');
  $(`.qd-m--${k}`, dlg).focus({ preventScroll: true });
  dlg.classList.add('qd--trascina');
  if (!tenuta) cambia(k, giro(k, m));
  e.preventDefault();
});
document.addEventListener('pointermove', e => {
  if (!presa || e.pointerId !== presa.id) return;
  const { m } = minutiQd(presa.svg, e.clientX, e.clientY);
  cambia(presa.k, giro(presa.k, m));
});
const lascia = e => {
  if (!presa || e.pointerId !== presa.id) return;
  $$('.qd-m', dlg).forEach(g => g.classList.remove('qd-m--presa'));
  dlg.classList.remove('qd--trascina');
  presa = null;
};
document.addEventListener('pointerup', lascia);
document.addEventListener('pointercancel', lascia);

// ================= proposta 5 · le ruote =================
// Due ruote che scorrono e si fermano sul quarto d'ora; quello al centro è la scelta. Sotto, il percorso del giorno.
const ALTO = 48;
const valori = k => { const [a, b] = LIMITI[k], out = []; for (let m = a; m <= b; m += PASSO) out.push(m); return out; };
const percorso = e => {
  const o = O();
  const riga = (ora, t, cl = '') => `<li class="pc-r ${cl}"><b>${h(ora)}</b><span>${t}</span></li>`;
  return `<ol class="pc" data-o="percorso">${riga(e.prima[1], `${e.prima[0]}, prima tappa`)}${e.pranzo ? riga(e.pranzo[1], 'pranzo') : ''}${e.oltre
    ? riga(o.fine, 'la fine che hai scelto', 'pc-r--fine') + riga(e.st, `${e.ultima}, finisci`, 'pc-r--oltre')
    : riga(e.st, `${e.ultima}, finisci`, 'pc-r--st') + (o.fine > e.st ? riga(o.fine, `la fine che hai scelto: ${durata(o.fine - e.st)} in più`, 'pc-r--fine') : '')}</ol>`;
};
PROP[5] = {
  corpo: () => `<div class="rt">
    <div class="rt-ruote"><span class="rt-linea" aria-hidden="true"></span>
      ${['inizio', 'fine'].map(k => `<div class="rt-r"><span class="rt-et" id="rt-et-${k}">${NOME[k]}</span>
        <div class="rt-scorre" data-k="${k}" role="spinbutton" tabindex="0" aria-labelledby="rt-et-${k}" aria-valuemin="${LIMITI[k][0]}" aria-valuemax="${LIMITI[k][1]}" aria-valuenow="${O()[k]}" aria-valuetext="${h(O()[k])}">
          ${valori(k).map(m => `<div class="rt-v" data-m="${m}" aria-hidden="true">${hh(m)}</div>`).join('')}</div></div>`).join('<span class="rt-tra" aria-hidden="true">–</span>')}
    </div>
    <h3 class="rt-t">Il giorno ${S.g + 1}, con queste ore</h3>
    ${percorso(effetto())}</div>`,
  monta() {
    for (const sc of $$('.rt-scorre', dlg)) { sc.scrollTop = valori(sc.dataset.k).indexOf(O()[sc.dataset.k]) * ALTO; ruota(sc); sc.addEventListener('scroll', suScorri, { passive: true }); sc.addEventListener('scrollend', fermo); }
  },
  fuoco() { $(`.rt-scorre[data-k="${S.modo}"]`, dlg)?.focus({ preventScroll: true }); },
  aggiorna(r) {
    for (const sc of $$('.rt-scorre', dlg)) {
      const k = sc.dataset.k, v = O()[k], i = valori(k).indexOf(v);
      sc.setAttribute('aria-valuenow', v); sc.setAttribute('aria-valuetext', h(v));
      $$('.rt-v', sc).forEach(x => x.classList.toggle('rt-v--su', +x.dataset.m === v));
      // la ruota che non tocchi si sposta da sola se l'altra la spinge
      if (Math.round(sc.scrollTop / ALTO) !== i) { muovo.add(sc); sc.scrollTo({ top: i * ALTO, behavior: piano() ? 'smooth' : 'instant' }); }
    }
    const p = $('[data-o="percorso"]', dlg); if (p) p.outerHTML = percorso(effetto());
  }
};
const muovo = new Set();
// mentre scorre: le ore lontane dal centro girano, rimpiccioliscono e sbiadiscono (solo posizione e trasparenza)
function ruota(sc) {
  const c = sc.scrollTop + sc.clientHeight / 2;
  for (const x of sc.children) {
    const d = (x.offsetTop + ALTO / 2 - c) / ALTO, a = Math.min(Math.abs(d), 3);
    if (a > 3) continue;
    x.style.transform = `perspective(400px) rotateX(${(-d * 18).toFixed(1)}deg) scale(${(1 - a * .07).toFixed(3)})`;
    x.style.opacity = (1 - Math.min(a, 2) * .17 - Math.max(0, a - 2) * .3).toFixed(2);
  }
}
let tFermo = 0;
function suScorri(e) {
  const sc = e.currentTarget;
  requestAnimationFrame(() => ruota(sc));
  clearTimeout(tFermo); tFermo = setTimeout(() => fermo({ currentTarget: sc }), 160);
}
// quando la ruota si ferma: il quarto al centro è la scelta
function fermo(e) {
  const sc = e.currentTarget, k = sc.dataset.k, vs = valori(k), v = vs[Math.max(0, Math.min(vs.length - 1, Math.round(sc.scrollTop / ALTO)))];
  if (muovo.has(sc)) { if (v === O()[k]) muovo.delete(sc); return; }
  if (v !== O()[k]) { S.modo = k; cambia(k, v); }
}
// tastiera sulle ruote: frecce 15 minuti, Pagina su e giù un'ora, Inizio e Fine ai limiti
document.addEventListener('keydown', e => {
  const sc = e.target.closest?.('.rt-scorre'); if (!sc) return;
  const k = sc.dataset.k, v = O()[k], [mn, mx] = LIMITI[k];
  const y = { ArrowUp: v - 15, ArrowDown: v + 15, PageUp: v - 60, PageDown: v + 60, Home: mn, End: mx }[e.key];
  if (y == null) return;
  e.preventDefault(); S.modo = k; cambia(k, y);
});

// ---------- il foglio «Data e orari», ridisegnato ----------
const corpo = $('.f-corpo');
function disegna({ fuoco } = {}) {
  const root = document.documentElement;
  root.className = `v${S.v} p${S.p}`;
  root.dataset.theme = S.t;
  $$('.prova [data-p]').forEach(b => b.setAttribute('aria-pressed', String(String(S[b.dataset.p]) === b.dataset.v)));
  const P = PROPOSTE[S.p];
  $('.prova__nome').innerHTML = `<b>${S.p} · ${P.nome}</b>: ${P.dice}. <span>Tocca «Inizio» o «Fine» qui sotto. Giornate vere di «${DATI.nome}», giorno ${S.g + 1}; un giorno feriale, con il pranzo come lo mette il sito.</span>`;
  $('.scena__sfondo').src = SFONDI[`${S.v}-${S.t}-${innerWidth >= 960 ? 'pc' : 'tel'}`];
  corpo.innerHTML = `${NOTA}${DATA()}<div class="o-campi">${CAMPO('inizio')}${CAMPO('fine')}</div>${ESITO(effetto())}${CODA}`;
  if (fuoco) $(fuoco)?.focus({ preventScroll: true });
  scriviIndirizzo();
}
addEventListener('resize', () => { $('.scena__sfondo').src = SFONDI[`${S.v}-${S.t}-${innerWidth >= 960 ? 'pc' : 'tel'}`]; });
new ResizeObserver(() => document.documentElement.style.setProperty('--prova', `${$('.prova').offsetHeight}px`)).observe($('.prova'));

// ---------- tocchi ----------
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  if (b.dataset.p) {
    const k = b.dataset.p, v = b.dataset.v;
    S[k] = k === 'p' || k === 'g' ? +v : v;
    disegna({ fuoco: `.prova [data-p="${k}"][data-v="${v}"]` });
    if (k === 'p' || k === 'g') $('.f-scorre').scrollTop = 0;
    return;
  }
  const a = b.dataset.a;
  if (a === 'data') { annuncia('Nella prova il calendario non si apre: è quello già nel sito.', true); return; }
  if (a === 'chiudi') { annuncia('Nella prova il foglio resta aperto.', true); return; }
  if (a === 'ore') { apri(b.dataset.k); return; }
  if (a === 'oz-chiudi') { chiudi(); return; }
  if (a === 'allunga') { S.modo = 'fine'; cambia('fine', +b.dataset.v, { annuncio: false }); annuncia(`Fine alle ${h(O().fine)}. ${effetto().testo}`, true); PROP[S.p].fuoco(); return; }
  if (a === 'modo') { S.modo = b.dataset.k; PROP[2].aggiorna(null, true); PROP[2].centra(); PROP[2].fuoco(); annuncia(`Scegli ${S.modo === 'inizio' ? "l'inizio" : 'la fine'}: ora ${h(O()[S.modo])}.`, true); return; }
  if (a === 'fuoco') { S.modo = b.dataset.k; PROP[4].fuoco(); return; }
  if (b.classList.contains('q')) { PROP[2].tocca(+b.dataset.m); return; }
});
// un tocco su un'ora delle ruote la porta al centro
document.addEventListener('click', e => {
  const x = e.target.closest?.('.rt-v'); if (!x) return;
  const sc = x.parentElement;
  sc.scrollTo({ top: x.offsetTop - (sc.clientHeight - ALTO) / 2, behavior: piano() ? 'smooth' : 'instant' });
  sc.focus({ preventScroll: true });
});

// ---------- tastiera ----------
// le maniglie del quadrante: frecce 15 minuti, Pagina su e giù un'ora, Inizio e Fine ai limiti
document.addEventListener('keydown', e => {
  const g = e.target.closest?.('.qd-m'); if (!g) return;
  const k = g.dataset.k, v = O()[k], [mn, mx] = LIMITI[k];
  const y = { ArrowLeft: v - 15, ArrowDown: v - 15, ArrowRight: v + 15, ArrowUp: v + 15, PageDown: v - 60, PageUp: v + 60, Home: mn, End: mx }[e.key];
  if (y == null) return;
  e.preventDefault(); S.modo = k; cambia(k, y);
});
// la griglia delle ore: frecce di lato 15 minuti, su e giù un'ora, Pagina su e giù tre ore, Inizio e Fine della riga
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
if (H.get('a') === '1') apri(H.get('modo') === 'fine' ? 'fine' : 'inizio');
