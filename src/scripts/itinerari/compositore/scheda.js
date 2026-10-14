// La scheda della tappa (pezzo 2, scelta di Enrico: «il foglio», timbro 2). Sale a metà schermo: foto, nome, quando, il timbro
// postale «visitata» sul bordo della foto, in breve; si tira su per leggere tutto (testo, orari, biglietti, come arrivare, fonti,
// «Sposta nel giorno», «Togli»); di lato si passa alla tappa prima o dopo. In C la mappa resta sopra e vola sulla tappa.
// I contenuti sono le schede vere della build (src/components/itinerari/Scheda.astro, SchedaLocale.astro, nei <template>).
import { $, $$, esc, ic, soglia, piano, computer, range, ora, durata, dataScritta, GS, INGRESSO, DENTRO, SCALE, MOMENTO } from './base.js';
import { E, T, X, MODELLI, schedePronte, caricaSchede, nG, giornoDi, nelViaggio, visitata, puoiSegnare, G, tappeDi, aggiunta, ultimaDi, chiusaIl, dataLungaDi } from './stato.js';
import { S, assicuraSchede, foglio, chiudiFoglio, foglioEl, scorri, occupato, annuncia, tiraPerChiudere, gestoScheda } from './comuni.js';
import { segna, togliTappa, spostaGiorno, aggiungi, aggiungiGita, vaiAlGiorno, testoTratto, mappaC } from './viste.js';
import { salva } from './fogli.js';
import { apriAggiungi } from './aggiungi.js';

const schEl = () => $('#scheda');
let sch = null;      // la scheda aperta: { id, detent, cima }
let daDove = null;   // chi l'ha aperta: torna lì il fuoco
export const schedaAperta = () => (sch && schEl().open ? sch : null);

// ---------- i pezzi della scheda ----------
const modello = id => MODELLI.get(E && id === E.id ? 'regate' : id);
// le schede arrivano dopo il primo disegno: se non ci sono ancora si aspettano (senza rete e senza copia, la scheda è più corta)
const conSchede = () => assicuraSchede();
export function fotoGrande(id, cl = 'sch-foto') {
  const pic = modello(id)?.querySelector('picture');
  if (!pic) return `<span class="${cl} sch-senza" aria-hidden="true">${soglia()}</span>`;
  const p = pic.cloneNode(true), img = p.querySelector('img');
  img.className = cl; img.loading = 'eager'; img.decoding = 'async';
  p.querySelectorAll('source').forEach(s => s.setAttribute('sizes', '(min-width: 960px) 430px, 100vw'));
  img.setAttribute('sizes', '(min-width: 960px) 430px, 100vw');
  return p.outerHTML;
}
export const credito = id => { const c = modello(id)?.querySelector('.foto__cr'); return c ? `<p class="sch-credito">${c.innerHTML}</p>` : ''; };
export const testoScheda = id => {
  const m = modello(id);
  const t = m?.querySelector('.it-sch__testo') ?? (E && id === E.id ? m?.firstElementChild : null);
  if (!t) return '';
  const html = t.innerHTML;
  return html.replace('<p>', '<p class="sch-attacco">');
};
// orari, biglietti, come arrivare (tappe); per i locali la scheda com'è: orari giorno per giorno, prezzi, menu e sito
export function sezioni(id) {
  const m = modello(id)?.querySelector('.it-sch');
  if (!m) return '';
  if (m.classList.contains('it-sch--locale')) {
    const parti = [...m.children].filter(x => !x.matches('figure, .it-sch__testo, .it-sch__breve'));
    return `<div class="sch-sez sch-sez--locale">${parti.map(x => x.outerHTML).join('')}</div>`;
  }
  return $$('h3.it-sch__h', m).map(h => `<section class="sch-sez"><h3>${h.innerHTML}</h3>${h.nextElementSibling?.outerHTML ?? ''}</section>`).join('');
}
export function fontiScheda(id, aperte = false) {
  const t = T(id);
  if (!t?.fonti?.length) return '';
  return `<details class="sch-fonti"${aperte ? ' open' : ''}><summary><span>Fonti</span><span class="sch-fonti__n num">${t.fonti.length}</span>${ic('abbassa', 18)}</summary>
    <ol>${t.fonti.map(f => `<li><a href="${esc(f.url)}" rel="noopener" target="_blank">${esc(f.titolo)}${ic('esterno', 14)}</a><span>${esc(f.editore)}${f.tipo === 'ufficiale' ? ', sito ufficiale' : ''}</span></li>`).join('')}</ol>
    ${t.controllato ? `<p>Informazioni controllate il ${dataScritta(t.controllato)}. Il segno * vuol dire che l'informazione non è confermata (lo dice la frase stessa).</p>` : ''}</details>`;
}
function inBreve(id) {
  const t = T(id), g = Math.max(0, giornoDi(id)), out = [];
  if (t.evento) { out.push(['orologio', `Dalle ${ora(E.inizio)}, circa ${durata(E.durata)}`]); return out; }
  if (t.tipo === 'gita') out.push(['clessidra', t.durata > 240 ? 'Una giornata intera' : `Mezza giornata, circa ${durata(t.durata)}`]);
  else out.push(['clessidra', `${t.categoria ? 'Pasto' : 'Visita'} di ${durata(t.durata)}`]);
  if (t.chiuso?.length) out.push(['calendario', `Chiuso il ${t.chiuso.map(x => GS[x]).join(' e il ')}`]);
  if (chiusaIl(id, g)) out.push(['attenzione', `Chiuso ${dataLungaDi(g)}: è il giorno ${g + 1} del tuo itinerario`, true]);
  if (t.prenotazione === 'obbligatoria') out.push(['attenzione', t.categoria ? 'Si mangia solo prenotando' : 'Si entra solo prenotando', true]);
  else if (t.prenotazione === 'consigliata') out.push(['info', 'Meglio prenotare']);
  if (!t.categoria && t.ingresso) out.push(['biglietto', INGRESSO[t.ingresso] ?? '']);
  if (!t.categoria && t.alChiuso) out.push(['casa', `${DENTRO[t.alChiuso] ?? ''}${t.gradini ? `, ${SCALE[t.gradini]}` : ''}`]);
  if (MOMENTO[t.momento]) out.push(['sole', MOMENTO[t.momento]]);
  if (t.partenza) out.push(['bussola', `Si parte da ${t.partenza}`]);
  return out;
}
export const chips = (id, cl = 'sch-chip') => `<ul class="${cl}s">${inBreve(id).map(([i, x, w], k) => `<li class="${cl}${w ? ` ${cl}--attenzione` : ''}" style="--k:${k}">${ic(i, 17)}<span>${esc(x)}</span></li>`).join('')}</ul>`;

// ---------- dove sta la tappa nel viaggio ----------
const posizione = id => {
  const g = giornoDi(id);
  if (g < 0) return null;
  const Gx = G(g);
  if (!Gx) return null;
  const v = tappeDi(Gx).find(x => x.id === id), ordine = tappeDi(Gx).map(x => x.id);
  return { g, Gx, v, i: ordine.indexOf(id), n: ordine.length, ordine };
};
const trattoVerso = (Gx, id) => { const i = Gx.voci.findIndex(v => v.tipo === 'tappa' && v.id === id); const t = Gx.voci[i - 1]; return t?.tipo === 'tratto' ? t : null; };
const quandoTesto = id => {
  const p = posizione(id);
  if (!p?.v) return '';
  if (p.v.fatta) return `Giorno ${p.g + 1}, visitata`;
  return `Giorno ${p.g + 1}, dalle ${ora(p.v.inizio)} alle ${ora(p.v.fine)}`;
};
const ordineDi = id => { const p = posizione(id); return p ? p.ordine : [id]; };
const passo = (id, dir) => { const o = ordineDi(id), i = o.indexOf(id); return o[i + dir] ?? null; };

// ---------- «visitata»: il timbro postale sul bordo della foto, con il giorno della visita ----------
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const giornoSegnato = id => { const t = X().timbri?.[id]; const d = t ? new Date(t) : new Date(); return `${d.getDate()} ${MESI[d.getMonth()]}`; };
const quandoSegnata = id => { const t = X().timbri?.[id]; if (!t) return 'Visitata'; const d = new Date(t); return `Segnata ${d.toDateString() === new Date().toDateString() ? 'oggi' : d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} alle ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; };
function timbro(id) {
  if (!nelViaggio(id) || !puoiSegnare() || T(id)?.evento) return '';
  const vis = visitata(id), b = esc(T(id).breve);
  return `<button type="button" class="timbro timbro--2" data-azione="visitata" data-id="${id}" aria-pressed="${vis}"><svg class="timbro__giro" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs><path id="giro-${id}" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0"/></defs><circle class="timbro__anello" cx="50" cy="50" r="46"/><circle class="timbro__anello timbro__anello--2" cx="50" cy="50" r="28"/><text><textPath href="#giro-${id}">NAPOLI · NEXTSTOP · NAPOLI · NEXTSTOP ·</textPath></text></svg>${soglia()}<span class="vh">${b}: </span><span class="timbro__t">visitata</span><span class="timbro__data num" aria-hidden="true">${giornoSegnato(id)}</span></button>`;
}
// senza «Salva» il timbro non c'è: la scheda propone di salvare
const salvaPrima = id => (!nelViaggio(id) || puoiSegnare() || T(id)?.evento ? '' : `<div class="bv-salva">${soglia('bv__s')}<p>Salva l'itinerario per segnare le tappe visitate (restano su questo telefono).</p><button type="button" class="f-bottone" data-azione="salva">Salva</button></div>`);
export function animaSoglia(b, si) {
  if (si && b.classList.contains('timbro--2')) { b.classList.remove('timbro--stampa'); void b.offsetWidth; b.classList.add('timbro--stampa'); }
  const s = $('.soglia', b);
  if (!s) return;
  s.classList.remove('soglia--chiude', 'soglia--apre');
  void s.getBoundingClientRect();
  s.classList.add(si ? 'soglia--chiude' : 'soglia--apre');
}
// dopo un cambiamento: la scheda aperta si rifà; dopo «visitata» (senza ridisegno) solo il timbro e la riga sotto
export function rinfrescaScheda(id, si) {
  if (!schedaAperta()) return;
  if (id != null) {
    $$(`.timbro[data-id="${id}"] .timbro__data`, schEl()).forEach(x => { x.textContent = giornoSegnato(id); });
    $$(`[data-sotto="${id}"]`, schEl()).forEach(x => { x.textContent = si ? quandoSegnata(id) : 'Tocca il timbro sulla foto quando ci sei stato'; });
    return;
  }
  if (giornoDi(sch.id) !== S.g) { chiudi(true); return; }
  riempi();
}
// le azioni della scheda: spostare in un altro giorno, togliere (con «Annulla» dopo)
function azioniScheda(id) {
  const g = giornoDi(id);
  if (g < 0) {
    if (T(id).tipo === 'gita') return `<div class="sch-azioni"><button type="button" class="f-bottone" data-azione="gita-qui" data-id="${id}">${ic('piu', 20)}${X().giorni[S.g].tappe.length || X().giorni[S.g].gita ? `Aggiungi come giorno ${nG() + 1}` : `Mettila nel giorno ${S.g + 1}`}</button><p class="f-nota">Una gita prende un giorno intero.</p></div>`;
    const a = X().giorni[S.g].tappe.length && aggiunta(S.g, id);
    return `<div class="sch-azioni"><button type="button" class="f-bottone" data-azione="aggiungi-qui" data-id="${id}">${ic('piu', 20)}Aggiungi al giorno ${S.g + 1}</button>${a?.tratto ? `<p class="f-nota">${a.tratto.min} min da ${esc(T(ultimaDi(S.g)).breve)}, l'ultima tappa del giorno ${S.g + 1}.</p>` : ''}</div>`;
  }
  const altri = range(nG()).filter(k => k !== g && !X().giorni[k].gita);
  return `<div class="sch-azioni">${altri.map(k => `<button type="button" class="sch-azione" data-azione="sposta-giorno" data-id="${id}" data-g="${k}">${ic('calendario', 20)}<span>Sposta nel giorno ${k + 1}</span></button>`).join('')}<button type="button" class="sch-azione sch-azione--togli" data-azione="togli" data-id="${id}">${ic('cestino', 20)}<span>Togli dal giorno ${g + 1}</span></button></div>`;
}

// ---------- aprire ----------
export async function apriScheda(id, sorgente) {
  daDove = sorgente?.closest?.('button') || document.activeElement;
  await conSchede();
  const g = giornoDi(id);
  if (g !== S.g) { schedaFuori(id); return; }
  apri(id);
}
export async function chiudiSchede() { if (schedaAperta()) await chiudi(true); }
// le tappe che non sono in questo giorno (dalla mappa, dalla ricerca, le gite): la scheda nel foglio, con «Aggiungi»
export async function schedaFuori(id, indietro = null) {
  await conSchede();
  const g = giornoDi(id);
  const corpo = `${indietro ? `<button type="button" class="r-indietro" data-f="indietro">${ic('indietro', 18)}Torna ai risultati</button>` : ''}<div class="f-scheda-foto">${fotoGrande(id, 'f-scheda-img')}</div>${credito(id)}<p class="sch-quando">${g >= 0 ? quandoTesto(id) : X().giorni.some(D => D.gita === id) ? 'È una gita del tuo itinerario' : 'Non è nel tuo itinerario'}</p>${chips(id)}<div class="sch-testo">${testoScheda(id)}</div>${sezioni(id)}${fontiScheda(id)}${g >= 0 ? `<button type="button" class="f-bottone f-bottone--contorno" data-f="vai" data-g="${g}">Vai al giorno ${g + 1}</button>` : X().giorni.some(D => D.gita === id) ? '' : azioniScheda(id)}`;
  foglio(T(id).nome, corpo, f => {
    f.onclick = async e => {
      if (e.target === f) { chiudiFoglio(); return; }
      if (e.target.closest('[data-f="indietro"]')) { apriAggiungi(indietro); return; }
      const b = e.target.closest('[data-f="vai"], [data-azione="aggiungi-qui"], [data-azione="gita-qui"]');
      if (!b) return;
      await chiudiFoglio();
      if (b.dataset.f === 'vai') vaiAlGiorno(+b.dataset.g);
      else if (b.dataset.azione === 'gita-qui') aggiungiGita(id);
      else aggiungi(S.g, id);
    };
  }, 'f--scheda f--fuori');
}

// ---------- il foglio ----------
const H = () => $('.sch1__pannello', schEl())?.offsetHeight || innerHeight;
const meta = () => Math.round(Math.min(H(), Math.max(400, innerHeight * .6)));
let Y = 0;
function apri(id) {
  const el = schEl();
  if (schedaAperta()) { if (id !== sch.id) vai(ordineDi(sch.id).indexOf(id) > ordineDi(sch.id).indexOf(sch.id) ? 1 : -1, 0, id); return; }
  sch = { id, detent: 'meta' };
  el.className = 'sch sch1';
  el.innerHTML = `<div class="sch1__pannello"><div class="sch1__testa"><span class="sch1__presa" aria-hidden="true"></span><button type="button" class="sch1__alza" data-azione="detent" aria-label="Leggi tutta la scheda">${ic('alza', 22)}</button><button type="button" class="sch1__chiudi" data-azione="chiudi" aria-label="Chiudi la scheda">${ic('x', 22)}</button></div><div class="sch1__corpo"><div class="sch1__pagina"></div></div><nav class="sch1__passi" aria-label="Tappe del giorno"></nav></div>`;
  riempi();
  if (!computer.matches) document.documentElement.classList.add('sch1-su');
  el.show();
  metti('meta', false);
  if (piano()) $('.sch1__pannello', el).animate([{ transform: `translateY(${H()}px)` }, { transform: `translateY(${Y}px)` }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
  $('.sch-titolo', el)?.focus({ preventScroll: true });
  if (S.p === 'c') { if (!computer.matches && scrollY > 0) scrollTo({ top: 0, behavior: piano() ? 'smooth' : 'auto' }); setTimeout(() => mappaC()?.centra(id), piano() ? 160 : 0); }
}
function metti(d, anima = true) {
  sch.detent = d;
  const el = schEl(), p = $('.sch1__pannello', el);
  if (computer.matches) { Y = 0; p.style.transform = ''; el.dataset.d = 'tutto'; return; }
  Y = d === 'tutto' ? 0 : H() - meta();
  p.style.transition = anima && piano() ? 'transform 420ms cubic-bezier(.16,1,.3,1)' : 'none';
  p.style.transform = `translateY(${Y}px)`;
  el.dataset.d = d;
  sch.cima = innerHeight - H() + Y;
  $('.sch1__alza', el)?.setAttribute('aria-label', d === 'tutto' ? 'Riduci la scheda' : 'Leggi tutta la scheda');
  if (d === 'meta') $('.sch1__corpo', el).scrollTop = 0;
}
function pagina(id) {
  const p = posizione(id);
  const tr = p ? trattoVerso(p.Gx, id) : null;
  return `<div class="sch1__foto"><div class="sch1__cornice">${fotoGrande(id)}${timbro(id)}</div>${credito(id)}</div>
    <h2 class="sch-titolo" id="sch-t" tabindex="-1">${esc(T(id).nome)}</h2>
    <p class="sch-quando">${quandoTesto(id)}${p ? `<span>, tappa ${p.i + 1} di ${p.n}</span>` : ''}</p>
    ${puoiSegnare() && !T(id).evento ? `<p class="sch-segnata" data-sotto="${id}">${visitata(id) ? quandoSegnata(id) : 'Tocca il timbro sulla foto quando ci sei stato'}</p>` : salvaPrima(id)}
    ${chips(id)}
    <button type="button" class="sch1__leggi" data-azione="detent">Leggi tutto${ic('abbassa', 18)}</button>
    <div class="sch1__resto"><div class="sch-testo">${testoScheda(id)}</div>${sezioni(id)}${tr ? `<section class="sch-sez"><h3>Ci arrivi</h3><p>${testoTratto(tr, p.Gx)}, da ${esc(T(passo(id, -1)).breve)}.</p></section>` : ''}${fontiScheda(id)}${azioniScheda(id)}</div>`;
}
function riempi() {
  const el = schEl(), id = sch.id, p = posizione(id);
  $('.sch1__pagina', el).innerHTML = pagina(id);
  el.setAttribute('aria-labelledby', 'sch-t');
  const prima = passo(id, -1), dopoId = passo(id, 1), trDopo = dopoId && p ? trattoVerso(p.Gx, dopoId) : null;
  $('.sch1__passi', el).innerHTML = `<button type="button" class="sch1__passo" data-azione="passo" data-dir="-1"${prima ? '' : ' disabled'}>${ic('indietro', 20)}<span>${prima ? `<span class="vh">Tappa prima: </span>${esc(T(prima).breve)}` : 'Prima tappa'}</span></button><span class="sch1__dove num">${p ? `${p.i + 1} di ${p.n}` : ''}</span><button type="button" class="sch1__passo sch1__passo--dopo" data-azione="passo" data-dir="1"${dopoId ? '' : ' disabled'}><span>${dopoId ? `<span class="vh">Tappa dopo: </span>${esc(T(dopoId).breve)}` : 'Ultima tappa'}${trDopo ? `<small>${ic('piedi', 13)}${trDopo.min} min<span class="vh"> di strada</span></small>` : ''}</span>${ic('avanti', 20)}</button>`;
}
async function vai(dir, daX = 0, id = passo(sch.id, dir)) {
  if (!id || occupato.si) return;
  const el = schEl(), pag = $('.sch1__pagina', el);
  const fuoco = el.contains(document.activeElement);
  await scorri(pag, dir, daX, () => { sch.id = id; riempi(); $('.sch1__corpo', el).scrollTop = 0; });
  if (fuoco) $('.sch-titolo', el)?.focus({ preventScroll: true });
  S.attiva = id;
  if (S.p === 'c') mappaC()?.centra(id); else mappaC()?.evidenzia(id);
  $$('.giorno-attivo [data-azione="tappa"]').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
  annuncia(`${T(id).nome}, ${quandoTesto(id)}`);
}
async function chiudi(subito = false) {
  const el = schEl();
  if (!el.open || sch?.chiude) return;
  sch.chiude = true;
  const p = $('.sch1__pannello', el);
  document.documentElement.classList.remove('sch1-su');
  if (piano() && !subito && p) await p.animate([{ transform: `translateY(${Y}px)` }, { transform: `translateY(${H()}px)` }], { duration: 260, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }).finished.catch(() => {});
  el.close();
  const id = sch.id;
  sch = null;
  const torna = $(`.giorno-attivo [data-id="${id}"][data-azione="tappa"]`) || (daDove?.isConnected ? daDove : null);
  torna?.focus({ preventScroll: true });
  if (S.p === 'c') mappaC()?.tutto();
}

export function preparaScheda() {
  const el = schEl();
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-azione]');
    if (!b || b.disabled || gestoScheda.tolto) return;
    const k = b.dataset.azione;
    if (k === 'visitata') segna(b.dataset.id);
    else if (k === 'togli') togliTappa(b.dataset.id);
    else if (k === 'sposta-giorno') spostaGiorno([b.dataset.id], +b.dataset.g);
    else if (k === 'salva') salva(b);
    else if (k === 'chiudi') chiudi();
    else if (k === 'detent') metti(sch.detent === 'tutto' ? 'meta' : 'tutto');
    else if (k === 'passo') vai(+b.dataset.dir);
  });
  el.addEventListener('cancel', e => { e.preventDefault(); chiudi(); });
  // il foglio non è modale: Esc lo chiude anche se il fuoco è nella pagina sotto
  addEventListener('keydown', e => { if (e.key === 'Escape' && schedaAperta() && !foglioEl().open) { e.preventDefault(); chiudi(); } });
  // i gesti: di lato = tappa prima o dopo; in su e in giù = metà, tutto, chiuso
  el.addEventListener('pointerdown', e => {
    if (!sch || (e.pointerType === 'mouse' && e.button !== 0) || e.target.closest('a, input, summary, table')) return;
    const p = $('.sch1__pannello', el), corpo = $('.sch1__corpo', el), pag = $('.sch1__pagina', el);
    const x0 = e.clientX, y0 = e.clientY, t0 = performance.now(), yP = Y, dallaTesta = !!e.target.closest('.sch1__testa');
    let dir = null, dx = 0;
    const muovi = ev => {
      if (ev.pointerId !== e.pointerId) return;
      dx = ev.clientX - x0; const dy = ev.clientY - y0;
      if (!dir) {
        if (Math.hypot(dx, dy) < 8) return;
        dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v';
        if (dir === 'v' && !(dallaTesta || sch.detent === 'meta' || (e.pointerType !== 'touch' && corpo.scrollTop <= 0 && dy > 0 && !computer.matches))) { dir = 'x'; return; }
        if (dir === 'v' && computer.matches) { dir = 'x'; return; }
        try { el.setPointerCapture(e.pointerId); } catch { /* fuori */ }
        if (dir === 'v') p.style.transition = 'none';
      }
      if (dir === 'h') { const fermo = (dx > 0 && !passo(sch.id, -1)) || (dx < 0 && !passo(sch.id, 1)); const x = fermo ? dx * .25 : dx; if (piano()) { pag.style.translate = `${x.toFixed(1)}px 0`; pag.style.opacity = String(Math.max(.35, 1 - Math.abs(x) / 520)); } }
      if (dir === 'v') { Y = Math.max(0, yP + dy); p.style.transform = `translateY(${Y}px)`; }
    };
    const su = ev => {
      if (ev.pointerId !== e.pointerId) return;
      el.removeEventListener('pointermove', muovi); el.removeEventListener('pointerup', su); el.removeEventListener('pointercancel', su);
      if (dir === 'h' || dir === 'v') { gestoScheda.tolto = true; setTimeout(() => { gestoScheda.tolto = false; }, 60); }
      const v = (ev.clientY - y0) / Math.max(1, performance.now() - t0);
      if (dir === 'h') {
        const verso = dx < 0 ? 1 : -1, id = passo(sch.id, verso);
        if (id && (Math.abs(dx) > 70 || Math.abs(dx) / Math.max(1, performance.now() - t0) > .45)) vai(verso, piano() ? parseFloat(pag.style.translate) || 0 : 0);
        else { const da = { translate: pag.style.translate || '0px 0', opacity: pag.style.opacity || '1' }; pag.style.translate = ''; pag.style.opacity = ''; if (piano()) pag.animate([da, { translate: '0px 0', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' }); }
      }
      if (dir === 'v') {
        const mezzo = H() - meta();
        if (Y > mezzo + 110 || (v > .8 && Y > mezzo - 40)) chiudi();
        else if (v < -.5 || Y < mezzo / 2) metti('tutto'); else metti('meta');
      }
    };
    el.addEventListener('pointermove', muovi); el.addEventListener('pointerup', su); el.addEventListener('pointercancel', su);
  });
  el.addEventListener('click', e => { if (gestoScheda.tolto) { e.stopPropagation(); e.preventDefault(); } }, true);
  tiraPerChiudere(el, { pronto: () => !!sch && sch.detent === 'tutto', scorre: () => $('.sch1__corpo', el), pannello: () => $('.sch1__pannello', el), chiudi: () => chiudi() });
  addEventListener('resize', () => { if (schedaAperta()) metti(sch.detent, false); });
}
