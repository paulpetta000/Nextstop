// Pezzi comuni del compositore: lo stato della pagina (giorno, vista), il foglio che sale (e si chiude tirandolo giù),
// l'avviso in basso con «Annulla», l'annuncio per i lettori di schermo, i numeri del giorno che scorrono, il tempo del giorno,
// le schede dei giorni con il segno che scorre, cambiare giorno senza scatti (anche col dito), le liste che scivolano.
import { $, $$, esc, ic, piano, computer, durata, durataLunga, ora, km, range } from './base.js';
import { G, nG, tappeDi, aPiedi } from './stato.js';

// Lo stato della pagina (non va nella memoria, tranne la vista)
export const S = { g: 0, p: 'c', attiva: null, nuova: null, tutte: false, cifre: {}, fini: {}, anima: true };
const CHIAVE_VISTA = 'compositore-vista';
export function vistaSalvata() { try { const v = localStorage.getItem(CHIAVE_VISTA); return v === 'c' || v === 'd' ? v : null; } catch { return null; } }
export function ricordaVista(v) { try { localStorage.setItem(CHIAVE_VISTA, v); } catch { /* senza memoria resta per questa visita */ } }

// ---------- il foglio che sale (finestra modale) ----------
export const foglioEl = () => $('#foglio');
let spegniF = null;
export const quandoChiudeFoglio = fn => { spegniF = fn; };
export function foglio(titolo, corpo, dopoAperto, cl = '') {
  const f = foglioEl();
  spegniF?.(); spegniF = null;
  f.className = cl;
  f.innerHTML = `<div class="f-testa"><span class="f-maniglia" aria-hidden="true"></span><h2 id="f-titolo">${esc(titolo)}</h2><button type="button" class="f-chiudi" aria-label="Chiudi">${ic('x')}</button></div><div class="f-corpo">${corpo}</div>`;
  $('.f-chiudi', f).onclick = () => chiudiFoglio();
  f.onclick = null; f.onchange = null; f.onkeydown = null; f.oninput = null;
  f.style.translate = '';
  if (!f.open) f.showModal();
  dopoAperto?.(f);
}
export async function chiudiFoglio() {
  const f = foglioEl();
  if (!f.open) return;
  if (piano()) { f.classList.add('f-esce'); await new Promise(r => setTimeout(r, 240)); f.classList.remove('f-esce'); }
  f.close();
  spegniF?.(); spegniF = null;
}
// ridisegna il contenuto vivo del foglio e rimette il fuoco sullo stesso comando
export function rinfresca(f, html, b) {
  const sel = b ? `[data-f="${b.dataset.f}"]${b.dataset.v != null ? `[data-v="${b.dataset.v}"]` : ''}` : null;
  const vivo = $('#f-vivo', f);
  if (!vivo) return;
  vivo.innerHTML = html;
  contaCifre();
  if (sel) ($(sel, f) || $('button', vivo))?.focus({ preventScroll: true });
}
export function preparaFoglio() {
  const f = foglioEl();
  f.addEventListener('click', e => { if (e.target === f) chiudiFoglio(); });
  f.addEventListener('cancel', e => { e.preventDefault(); chiudiFoglio(); });
  // tirando giù dalla testa
  let tiro = null;
  f.addEventListener('pointerdown', e => { if (!e.target.closest('.f-testa') || e.target.closest('button')) return; tiro = { y: e.clientY }; f.setPointerCapture(e.pointerId); });
  f.addEventListener('pointermove', e => { if (!tiro) return; f.style.translate = `0 ${Math.max(0, e.clientY - tiro.y)}px`; });
  f.addEventListener('pointerup', e => { if (!tiro) return; const dy = e.clientY - tiro.y; tiro = null; f.style.translate = ''; if (dy > 90) { f.close(); spegniF?.(); spegniF = null; } });
  tiraPerChiudere(f, { pronto: () => f.open, scorre: () => f, pannello: () => f, chiudi: () => chiudiFoglio() });
}

// ---------- avviso in basso (3,6 secondi con «Annulla», 2,3 senza; resta se ci passi sopra o ci vai con la tastiera) ----------
let tempoAvviso;
export function avvisa(testo, azione) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(testo)}</span>${azione ? `<button type="button">${esc(azione.testo)}</button>` : ''}`;
  if (azione) $('button', t).onclick = () => { t.classList.remove('su'); azione.fai(); };
  t.classList.remove('su');
  void t.offsetWidth;
  t.classList.add('su');
  clearTimeout(tempoAvviso);
  tempoAvviso = setTimeout(() => t.classList.remove('su'), azione ? 3600 : 2340);
}
export function preparaAvviso() {
  const t = $('#toast');
  const chiudi = ms => { clearTimeout(tempoAvviso); tempoAvviso = setTimeout(() => t.classList.remove('su'), ms); };
  t.addEventListener('pointerenter', () => clearTimeout(tempoAvviso));
  t.addEventListener('focusin', () => clearTimeout(tempoAvviso));
  t.addEventListener('pointerleave', () => chiudi(1800));
  t.addEventListener('focusout', () => chiudi(1800));
}
export const annuncia = testo => { const a = $('#annuncio'); a.textContent = ''; setTimeout(() => { a.textContent = testo; }, 30); };
// dentro un foglio (finestra modale) la voce per i lettori di schermo deve stare nel foglio
export const annunciaF = testo => { const a = $('#r-voce'); if (!a) { annuncia(testo); return; } a.textContent = ''; setTimeout(() => { a.textContent = testo; }, 30); };

// ---------- i numeri del giorno e il tempo del giorno; quando cambiano scorrono dal valore di prima al nuovo ----------
export const cifre = (Gx, cl = 'cifre', suf = '') => `<dl class="${cl}"><div><dt>tappe</dt><dd class="num" data-cifra="tappe${suf}" data-n="${tappeDi(Gx).length}">${tappeDi(Gx).length}</dd></div><div><dt>minuti ${aPiedi(Gx) ? 'a piedi' : 'di strada'}</dt><dd class="num" data-cifra="piedi${suf}" data-n="${Gx.spostamenti}">${Gx.spostamenti}</dd></div><div><dt>chilometri</dt><dd class="num" data-cifra="km${suf}" data-n="${Gx.metri}">${km(Gx.metri)}</dd></div><div><dt>fine stimata</dt><dd class="num" data-cifra="fine${suf}" data-n="${Gx.fine}">${ora(Gx.fine)}</dd></div></dl>`;
const nessuno = (m, parola = 'nessuno') => (Math.round(m) ? durata(Math.round(m)) : parola);
const FORMA = { tappe: n => String(Math.round(n)), piedi: n => String(Math.round(n)), km: n => km(n), fine: n => ora(Math.round(n)), visite: n => durata(Math.round(n)), cammino: n => durata(Math.round(n)), pause: n => nessuno(n, 'nessuna'), margine: n => nessuno(n), totale: n => durata(Math.round(n)), resta: n => durata(Math.abs(Math.round(n))) };
export function contaCifre() {
  const visti = {};
  for (const el of $$('.cmp [data-cifra], #foglio [data-cifra]')) {
    const k = el.dataset.cifra, n = +el.dataset.n, da = S.cifre[k];
    visti[k] ??= n;
    if (da == null || da === n || !piano()) continue;
    const forma = FORMA[k.split('@')[0]], t0 = performance.now(), dur = 820;
    if (!forma) continue;
    const passo = now => { const q = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - q, 3); el.textContent = forma(da + (n - da) * e); if (q < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  }
  S.cifre = { ...S.cifre, ...visti };
}
// D: cambiando giorno i numeri della pagina nuova scorrono da quelli del giorno di prima, come in C
export function contaDa(g0, g1) {
  if (!piano() || g0 === g1) return;
  for (const el of $$(`[data-cifra$="@${g1}"]`)) {
    const base = el.dataset.cifra.split('@')[0], vecchio = $(`[data-cifra="${base}@${g0}"]`), n = +el.dataset.n;
    if (!vecchio) continue;
    const da = +vecchio.dataset.n, forma = FORMA[base], t0 = performance.now(), dur = 820;
    if (da === n || !forma) continue;
    cancelAnimationFrame(el._conta);
    const passo = now => { const q = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - q, 3); el.textContent = forma(da + (n - da) * e); if (q < 1) el._conta = requestAnimationFrame(passo); };
    el._conta = requestAnimationFrame(passo);
  }
}
export function contaFine() {
  const Gx = G(S.g);
  if (!Gx) return;
  const prima = S.fini[S.g];
  S.fini[S.g] = Gx.fine;
  if (prima == null || prima === Gx.fine || !piano()) return;
  const els = $$('[data-conta="fine"]');
  const t0 = performance.now(), dur = 1100;
  const passo = now => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    const m = Math.round(prima + (Gx.fine - prima) * e);
    els.forEach(el => { el.textContent = ora(m); });
    if (k < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}
const NOMI_FASE = { visita: 'Visite', cammino: 'A piedi', pausa: 'Pause', margine: 'Margine' };
export function tempo(Gx, cl = '', { suf = '', bottone = true } = {}) {
  const fine = Math.max(Gx.fineScelta, Gx.fine), span = Math.max(1, fine - Gx.inizio);
  const pc = m => `${(m / span * 100).toFixed(2)}%`;
  const restaT = Gx.resta >= 0
    ? `<span class="tempo__resta">ti restano <b class="num" data-cifra="resta${suf}" data-n="${Gx.resta}">${durata(Gx.resta)}</b></span>`
    : `<span class="tempo__resta tempo__resta--oltre">sfori di <b class="num" data-cifra="resta${suf}" data-n="${Gx.resta}">${durata(-Gx.resta)}</b></span>`;
  const voce = (k, n, testo) => `<div><dt><i class="tempo__p tempo__p--${k}" aria-hidden="true"></i>${NOMI_FASE[k]}</dt><dd class="num" data-cifra="${k === 'visita' ? 'visite' : k === 'pausa' ? 'pause' : k}${suf}" data-n="${n}">${testo}</dd></div>`;
  const descr = `Dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}: visite ${durata(Gx.visite)}, a piedi ${durata(Gx.spostamenti)}, pause ${nessuno(Gx.pauseMin, 'nessuna')}, margine ${nessuno(Gx.margineMin)}. ${Gx.resta >= 0 ? `Ti restano ${durataLunga(Gx.resta)} prima delle ${ora(Gx.fineScelta)}.` : `Sfori di ${durataLunga(-Gx.resta)} oltre le ${ora(Gx.fineScelta)}.`}`;
  return `<div class="tempo ${cl}">
    <div class="tempo__testa"><p class="tempo__tit">In tutto <b class="num" data-cifra="totale${suf}" data-n="${Gx.totale}">${durata(Gx.totale)}</b>${restaT}</p>${bottone ? `<button type="button" class="tempo__cambia onda" data-azione="tempo">${ic('cursori', 18)}Pause e margini</button>` : ''}</div>
    <div class="tempo__barra" role="img" aria-label="${esc(descr)}"><span class="tempo__pista">${Gx.fasi.map(f => `<i class="tempo__s tempo__s--${f.tipo}" style="left:${pc(f.da - Gx.inizio)};width:${pc(f.a - f.da)}"></i>`).join('')}${Gx.fine > Gx.fineScelta ? `<i class="tempo__oltre" style="left:${pc(Gx.fineScelta - Gx.inizio)};width:${pc(Gx.fine - Gx.fineScelta)}"></i>` : ''}</span>${Gx.fine > Gx.fineScelta ? `<i class="tempo__limite" style="left:${pc(Gx.fineScelta - Gx.inizio)}"></i>` : ''}</div>
    <div class="tempo__ore" aria-hidden="true"><span class="num">${ora(Gx.inizio)}${Gx.vivo ? ' (adesso)' : ''}</span>${Gx.fine > Gx.fineScelta ? `<span class="num tempo__ora-fine tempo__ora-fine--oltre">fine ${ora(Gx.fine)}</span>` : `<span class="num tempo__ora-fine">${ora(Gx.fineScelta)}</span>`}</div>
    <dl class="tempo__voci">${voce('visita', Gx.visite, durata(Gx.visite))}${voce('cammino', Gx.spostamenti, durata(Gx.spostamenti))}${voce('pausa', Gx.pauseMin, nessuno(Gx.pauseMin, 'nessuna'))}${voce('margine', Gx.margineMin, nessuno(Gx.margineMin))}</dl>
  </div>`;
}

// ---------- cambiare giorno senza scatti: il giorno che lasci continua il gesto ed esce, il nuovo entra dall'altro lato ----------
export const occupato = { si: false };
export async function scorri(el, dir, daX, cambia, nuovo = () => el, poi = () => {}) {
  if (!el || !piano()) { cambia(); const n = nuovo(); if (n) { n.style.translate = ''; n.style.opacity = ''; } poi(); return; }
  occupato.si = true;
  try {
    const W = el.getBoundingClientRect().width || innerWidth;
    const op = parseFloat(el.style.opacity || '1');
    el.style.translate = ''; el.style.opacity = '';
    const restoX = 1 - Math.min(1, Math.abs(daX) / (W * .5));
    const fuori = el.animate([{ translate: `${daX}px 0`, opacity: op }, { translate: `${-dir * W * .3}px 0`, opacity: 0 }], { duration: 120 + 120 * restoX, easing: 'cubic-bezier(.4, 0, .9, .4)', fill: 'forwards' });
    try { await fuori.finished; } catch { /* annullata */ }
    try { cambia(); } finally {
      const n = nuovo() || el;
      const dentro = n.animate([{ translate: `${dir * W * .22}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.16, 1, .3, 1)' });
      fuori.cancel();
      try { await dentro.finished; } catch { /* annullata */ }
    }
  } finally { occupato.si = false; }
  poi();
}
export function allInizio(el, barra = null) {
  if (!el) return;
  const sopra = barra ? barra.offsetHeight + (parseFloat(getComputedStyle(barra).top) || 0) : parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const y = Math.round(el.getBoundingClientRect().top + scrollY - sopra);
  if (scrollY > y + 1) scrollTo({ top: y, behavior: 'instant' });
}
export function entra(el, dir = 1) {
  if (!el || !piano()) return;
  const W = el.getBoundingClientRect().width || innerWidth;
  el.animate([{ translate: `${dir * W * .22}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 430, easing: 'cubic-bezier(.16, 1, .3, 1)' });
}
// le schede dei giorni, con il segno che scorre dall'uno all'altro
export const schede = cl => `<div class="schede ${cl}-schede-box"><span class="segno-tab" aria-hidden="true"></span><div class="${cl}-schede" role="tablist" aria-label="Giorni dell'itinerario">${range(nG()).map(g => `<button type="button" role="tab" aria-selected="${g === S.g}" tabindex="${g === S.g ? 0 : -1}" data-azione="giorno" data-g="${g}">Giorno ${g + 1}</button>`).join('')}</div></div>`;
export const segnoOra = () => { const s = $('.cmp .segno-tab'); return s && s.dataset.x ? { x: +s.dataset.x, w: +s.dataset.w } : null; };
export function mettiSegno(box, { da = null, anima = true } = {}) {
  const s = box && $('.segno-tab', box), t = box && $('[aria-selected="true"]', box);
  if (!s || !t) return;
  const x = t.offsetLeft, w = t.offsetWidth;
  const metti = (X1, W1) => { s.style.transform = `translateX(${X1}px)`; s.style.width = `${W1}px`; };
  if (!anima || !piano() || (!da && !s.dataset.x)) { s.style.transition = 'none'; metti(x, w); void s.offsetWidth; s.style.transition = ''; }
  else { if (da) { s.style.transition = 'none'; metti(da.x, da.w); void s.offsetWidth; s.style.transition = ''; } metti(x, w); }
  s.dataset.x = x; s.dataset.w = w;
  s.classList.add('su');
}
export function segnaSchede(g) {
  for (const box of $$('.cmp .schede')) {
    $$('[role="tab"]', box).forEach(b => { const si = +b.dataset.g === g; b.setAttribute('aria-selected', String(si)); b.tabIndex = si ? 0 : -1; });
    mettiSegno(box);
  }
}
const larghezze = new WeakMap();
const roSchede = new ResizeObserver(es => es.forEach(e => { const w = Math.round(e.contentRect.width); if (larghezze.get(e.target) !== w) { const prima = larghezze.has(e.target); larghezze.set(e.target, w); if (prima) mettiSegno(e.target, { anima: false }); } }));
export const osservaSchede = () => $$('.cmp .schede').forEach(b => { roSchede.observe(b); });

// ---------- sfogliare i giorni: dito, mouse, due dita sul touchpad (non dalle mappe, dalle maniglie, dai campi) ----------
export const gesto = { trascinando: false };
export function sfoglia(area, mobile, vai) {
  if (!area) return;
  let p0 = null, dir = null, tolto = false, x = 0, el = null;
  area.addEventListener('pointerdown', e => {
    if ((e.pointerType === 'mouse' && e.button !== 0) || occupato.si || gesto.trascinando || e.target.closest('.m, input, .f-filtri, [role="tablist"], .c-giu, [data-maniglia], .tempo__barra')) return;
    p0 = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }; dir = null; x = 0; el = null;
  });
  area.addEventListener('pointermove', e => {
    if (!p0 || e.pointerId !== p0.id || gesto.trascinando) return;
    const dx = e.clientX - p0.x, dy = e.clientY - p0.y;
    if (!dir) {
      if (Math.hypot(dx, dy) < 10) return;
      dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v';
      if (dir === 'h') { try { area.setPointerCapture(e.pointerId); } catch { /* fuori */ } area.classList.add('sfoglio'); el = mobile(); }
    }
    if (dir !== 'h' || !el) return;
    const fermo = (dx > 0 && S.g === 0) || (dx < 0 && S.g === nG() - 1);
    x = fermo ? dx * .22 : dx;
    if (piano()) { el.style.translate = `${x.toFixed(1)}px 0`; el.style.opacity = String(Math.max(.4, 1 - Math.abs(x) / 620)); }
  });
  const fine = e => {
    if (!p0 || e.pointerId !== p0.id) return;
    const dx = e.clientX - p0.x, v = Math.abs(dx) / Math.max(1, performance.now() - p0.t);
    if (dir === 'h' && el) {
      tolto = true; setTimeout(() => { tolto = false; }, 60);
      area.classList.remove('sfoglio');
      const ok = (Math.abs(dx) > 70 || (v > .45 && Math.abs(dx) > 30)) && vai(S.g + (dx < 0 ? 1 : -1), piano() ? x : 0);
      if (!ok) {
        const da = { translate: el.style.translate || '0px 0', opacity: el.style.opacity || '1' };
        el.style.translate = ''; el.style.opacity = '';
        if (piano()) el.animate([da, { translate: '0px 0', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.16, 1, .3, 1)' });
      }
    }
    p0 = null; dir = null; el = null;
  };
  area.addEventListener('pointerup', fine);
  area.addEventListener('pointercancel', fine);
  area.addEventListener('click', e => { if (tolto) { e.stopPropagation(); e.preventDefault(); } }, true);
  let somma = 0, pausa = 0;
  area.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || e.target.closest('.m')) return;
    e.preventDefault();
    if (performance.now() < pausa) return;
    somma += e.deltaX;
    if (Math.abs(somma) > 80) { vai(S.g + (somma > 0 ? 1 : -1)); somma = 0; pausa = performance.now() + 800; }
  }, { passive: false });
}
// una lista che cambia (tappa spostata, tolta, aggiunta): ogni pezzo scivola dal posto di prima al nuovo (FLIP)
export function foto(lista) { const m = new Map(); $$(':scope > [data-chiave]', lista).forEach(el => m.set(el.dataset.chiave, el.getBoundingClientRect().top)); return m; }
export function scivola(lista, prima, salta = null) {
  if (!piano() || !prima || !lista) return;
  $$(':scope > [data-chiave]', lista).forEach(el => {
    if (el.dataset.chiave === salta) return;
    const t0 = prima.get(el.dataset.chiave);
    const dy = t0 == null ? null : t0 - el.getBoundingClientRect().top;
    if (dy == null) el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)', delay: 80 });
    else if (Math.abs(dy) > 1) el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
}

// ---------- da telefono, un foglio aperto del tutto si chiude tirando giù da qualsiasi punto (Enrico, 14/10/2026) ----------
// Solo se il testo era già in cima quando appoggi il dito, e solo con un gesto deciso (più di 200 px, o più di 110 px veloce).
export const gestoScheda = { tolto: false };
export function tiraPerChiudere(el, { pronto, scorre, pannello, chiudi }) {
  let t = null;
  el.addEventListener('touchstart', e => {
    t = null;
    if (!pronto() || computer.matches || e.touches.length !== 1 || e.target.closest('a, input, summary, .f-testa, .sch1__testa, .m, .f-chips, .r2-fila')) return;
    const sc = scorre();
    t = { y: e.touches[0].clientY, x: e.touches[0].clientX, t: performance.now(), dir: null, dy: 0, cima: !sc || sc.scrollTop <= 0 };
  }, { passive: true });
  el.addEventListener('touchmove', e => {
    if (!t) return;
    const dx = e.touches[0].clientX - t.x, dy = e.touches[0].clientY - t.y;
    if (!t.dir) {
      if (Math.hypot(dx, dy) < 8) return;
      t.dir = dy > 0 && dy > Math.abs(dx) * 1.2 && t.cima ? 'giu' : 'no';
      if (t.dir === 'giu') pannello().style.transition = 'none';
    }
    if (t.dir !== 'giu') return;
    e.preventDefault();
    t.dy = dy; pannello().style.translate = `0 ${(dy * .6).toFixed(1)}px`;
  }, { passive: false });
  const fine = () => {
    if (!t || t.dir !== 'giu') { t = null; return; }
    const ms = Math.max(1, performance.now() - t.t), p = pannello(), v = t.dy / ms;
    gestoScheda.tolto = true; setTimeout(() => { gestoScheda.tolto = false; }, 60);
    p.style.transition = '';
    if (t.dy > 200 || (t.dy > 110 && v > .9)) { chiudi(); setTimeout(() => { p.style.translate = ''; }, 420); }
    else { const da = p.style.translate; p.style.translate = ''; if (piano() && da) p.animate([{ translate: da }, { translate: '0 0' }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' }); }
    t = null;
  };
  el.addEventListener('touchend', fine); el.addEventListener('touchcancel', fine);
}
