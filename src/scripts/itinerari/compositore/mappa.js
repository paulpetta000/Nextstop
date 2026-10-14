// La mappa del compositore (pezzo 1 e 2 del prototipo): la nostra mappa di OpenStreetMap (mappa.json) con i percorsi veri tra
// le tappe (percorsi.json); si sposta con un dito, si ingrandisce con due (o con la rotella), il percorso si disegna in fila,
// le tappe visitate hanno la spunta, «Tutte le tappe» mostra le altre come piccole foto. Le strade piccole (vicoli, scale, pedonali)
// e i nomi delle vie sono in pezzi da 1,28 km (specifica §6, src/lib/itinerari/strade.ts): si scaricano solo dove guardi, da vicino;
// sempre i nomi delle vie principali e, nel colore del percorso, quelli delle vie dove passa il giorno.
import { $, $$, esc, ic, piano, ora } from './base.js';
import { rileggi, pezziDi, nomiDelPercorso } from '../../../lib/itinerari/strade';
import { C, T, A, salvato, visitata, nelViaggio, caricaMappa, caricaAlternativi, tappeDi, daFare } from './stato.js';

const ALFA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function decodifica(s) {
  return s.split('~').filter(Boolean).map(pezzo => {
    const k = pezzo.indexOf('.');
    const nums = [];
    let z = 0, mul = 1;
    for (const c of pezzo.slice(k + 1)) {
      const v = ALFA.indexOf(c);
      z += (v & 31) * mul;
      if (v & 32) { mul *= 32; continue; }
      nums.push(z % 2 ? -(z + 1) / 2 : z / 2);
      z = 0; mul = 1;
    }
    const punti = [];
    let x = 0, y = 0;
    for (let j = 0; j + 1 < nums.length; j += 2) { x += nums[j]; y += nums[j + 1]; punti.push([x, y]); }
    return { modo: pezzo.slice(0, k), punti };
  });
}
const traccia = punti => 'M' + punti.map(p => p.join(' ')).join('L');
const VELOCITA = 0.327;
const numeri = d => (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
const puntiDi = d => { const n = numeri(d), p = []; for (let i = 0; i + 1 < n.length; i += 2) p.push([n[i], n[i + 1]]); return p; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const xyDi = v => { const t = T(v.id); return v.indietro && t?.xyFine ? t.xyFine : t?.xy ?? [0, 0]; };
const modoDi = m => (m === 'p' ? 'piedi' : m.startsWith('F') ? 'funi' : m.startsWith('B') ? 'bus' : 'metro');

let P = null, ALT = null, BASE = null, STRADE = null, ESISTE = new Set();
// i pezzi delle strade: scaricati una volta per tutta la pagina (e salvati dal service worker per l'uso senza rete)
const SOGLIA_PEZZI = 0.45; // px per unità (1 unità = 5 m): da qui in su si caricano i pezzi
const STRATI_P = [['v', 'm-vicoli'], ['p', 'm-pedonali'], ['m', 'm-medie-c'], ['g', 'm-grandi-c'], ['m', 'm-medie'], ['g', 'm-grandi'], ['s', 'm-scale']];
const CARICATI = new Map();
export const prendiPezzo = k => { if (!CARICATI.has(k)) CARICATI.set(k, fetch(`/napoli/itinerari/strade/${k}.json`).then(r => (r.ok ? r.json() : null)).catch(() => null).then(d => { if (!d) CARICATI.delete(k); return d; })); return CARICATI.get(k); };
// senza rete restano anche i pezzi delle tappe degli itinerari salvati: si scaricano in anticipo (li salva il service worker)
export function pezziDelleTappe(punti) { if (!STRADE) return; const L = STRADE.lato; for (const k of new Set(punti.map(([x, y]) => `${Math.floor(x / L)}_${Math.floor(y / L)}`))) if (ESISTE.has(k)) prendiPezzo(k); }
// i percorsi del giorno, una linea per tratto (e quelle dentro le tappe lunghe: Spaccanapoli, Toledo…), in fila
export function lineeDi(Gx) {
  if (!Gx || !P) return [];
  const percorso = (s, a, b) => { const x = P.scenari[s]?.[a]?.[b]; return typeof x === 'string' ? x : (P.scenari.feriale[a]?.[b] || ''); };
  const linee = [];
  Gx.voci.forEach((v, iv) => {
    if (v.tipo === 'tratto') {
      let s;
      if (v.variante == null) s = percorso(v.scenario, v.da, v.a);
      else if (v.variante === 'senza') { const x = ALT?.senza[v.scenario]?.[v.da]?.[v.a]; s = x === 0 ? percorso(v.scenario, v.da, v.a) : x ?? ''; }
      else s = ALT?.candidati[v.variante] ?? '';
      for (const p of decodifica(s)) if (p.punti.length > 1) linee.push({ modo: modoDi(p.modo), d: traccia(p.punti), v: iv });
      return;
    }
    if (v.tipo !== 'tappa' || v.fatta) return;
    const t = C.tappe.find(x => x.id === v.id);
    if (t?.pf != null && t.pf >= 0) { const [a, b] = v.indietro ? [t.pf, t.p] : [t.p, t.pf]; for (const p of decodifica(percorso('piedi', a, b))) if (p.punti.length > 1) linee.push({ modo: 'piedi', d: traccia(p.punti), dentro: true, v: iv }); }
  });
  return linee;
}
function riquadroXY(pts) {
  if (!pts.length) return { x1: 1850, x2: 2050, y1: 500, y2: 900 };
  let x1 = Math.min(...pts.map(p => p[0])), x2 = Math.max(...pts.map(p => p[0])), y1 = Math.min(...pts.map(p => p[1])), y2 = Math.max(...pts.map(p => p[1]));
  const minimo = 110;
  if (x2 - x1 < minimo) { const c = (x1 + x2) / 2; x1 = c - minimo / 2; x2 = c + minimo / 2; }
  if (y2 - y1 < minimo) { const c = (y1 + y2) / 2; y1 = c - minimo / 2; y2 = c + minimo / 2; }
  return { x1, x2, y1, y2 };
}
function inFila(Gx, linee) {
  const voci = Gx.voci;
  let qui = daFare(Gx)[0] ? xyDi(daFare(Gx)[0]) : tappeDi(Gx)[0] ? xyDi(tappeDi(Gx)[0]) : [0, 0];
  return linee.map(l => {
    let p = puntiDi(l.d);
    if (dist(qui, p[p.length - 1]) < dist(qui, p[0])) p = p.reverse();
    qui = p[p.length - 1];
    return { ...l, d: 'M' + p.map(x => x.join(' ')).join('L'), tappaDopo: voci.findIndex((x, k) => k > l.v && x.tipo === 'tappa') };
  });
}
// le tappe in città da vedere che non sono nel giorno (per «Tutte le tappe»)
export const daVedere = id => { const t = T(id); return !!t && t.tipo === 'citta' && !t.categoria && !t.evento; };
export const puntiPer = Gx => C.tappe.map(t => t.id).filter(id => daVedere(id) && !(Gx && tappeDi(Gx).some(v => v.id === id)));

let nMappe = 0;
const tutte = new Set();
export class Mappa {
  constructor(el, opz = {}) {
    this.el = el; this.opz = opz; this.tappe = []; this.vb = null; this.fuoco = null; this.n = ++nMappe; this.dita = new Map(); this.tutte = false; this.idsPunti = [];
    this.messi = new Set(); this.vie = []; this.inRotta = new Set(); this.nomi = [];
    el.classList.add('m');
    const tasto = opz.tutte ? `<button type="button" data-z="tutte" aria-pressed="false" aria-label="Mostra tutte le tappe della città">${ic('spilli', 20)}</button>` : '';
    el.innerHTML = `<svg class="m-svg" preserveAspectRatio="none" aria-hidden="true" focusable="false"><g class="m-base"></g><g class="m-fine">${STRATI_P.map(([, c]) => `<g class="${c}"></g>`).join('')}</g><g class="m-nomi"></g><g class="m-altre"></g><g class="m-rotta"></g><g class="m-nomi-rotta"></g><g class="m-fili"></g></svg><div class="m-punti"></div><div class="m-segni"></div>
      <div class="m-ctrl">${tasto}<button type="button" data-z="piu" aria-label="Ingrandisci la mappa">${ic('piu', 20)}</button><button type="button" data-z="meno" aria-label="Rimpicciolisci la mappa">${ic('meno', 20)}</button><button type="button" data-z="tutto" aria-label="Mostra tutto il giorno">${ic('centra', 20)}</button></div>
      <p class="m-osm">© <a href="https://www.openstreetmap.org/copyright" rel="noopener">OpenStreetMap</a></p><p class="m-carico" role="status"></p>`;
    this.svg = $('svg', el);
    tutte.add(this);
    this.ro = new ResizeObserver(() => { if (!this.vb) return; if (this.box && !this.mosso) this.adatta(false); else this.metti(this.limita(this.vb)); });
    this.ro.observe(el);
    $('.m-ctrl', el).addEventListener('click', e => {
      const b = e.target.closest('[data-z]');
      if (!b || !this.vb) return;
      if (b.dataset.z === 'tutte') this.mostraTutte(!this.tutte);
      else if (b.dataset.z === 'tutto') this.tutto();
      else this.zoom(b.dataset.z === 'piu' ? 1.6 : 1 / 1.6);
    });
    el.addEventListener('pointerdown', e => this.giu(e));
    el.addEventListener('pointermove', e => this.muovi(e));
    el.addEventListener('pointerup', e => this.su(e));
    el.addEventListener('pointercancel', e => this.su(e));
    el.addEventListener('wheel', e => { if (!this.vb) return; e.preventDefault(); const r = el.getBoundingClientRect(); this.zoom(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top, false); }, { passive: false });
    el.addEventListener('dblclick', e => { if (!this.vb || e.target.closest('.m-segno, .m-punto, .m-ctrl')) return; const r = el.getBoundingClientRect(); this.zoom(1.8, e.clientX - r.left, e.clientY - r.top); });
    this.base();
  }
  // la mappa di base e i percorsi arrivano dalla rete la prima volta (poi dalla memoria del service worker)
  async base() {
    if (!BASE) $('.m-carico', this.el).textContent = 'Carico la mappa…';
    try {
      const [M, Pp, I] = await caricaMappa();
      BASE = M; P = Pp;
      if (I && !STRADE) {
        STRADE = I; ESISTE = new Set(I.pezzi);
        pezziDelleTappe(A.elenco.filter(x => salvato(x)).flatMap(x => x.giorni.flatMap(g => g.tappe)).map(id => T(id)?.xy).filter(Boolean));
      }
    } catch {
      const c = $('.m-carico', this.el);
      c.innerHTML = 'La mappa non si è caricata: la prima volta serve la rete. <button type="button" class="m-riprova">Riprova</button>';
      c.style.pointerEvents = 'auto';
      $('.m-riprova', c).onclick = () => { c.style.pointerEvents = ''; this.base(); };
      return;
    }
    $('.m-carico', this.el).textContent = '';
    const M = BASE;
    $('.m-base', this.svg).innerHTML = `<rect class="m-terra" x="-6000" y="-6000" width="16000" height="16000"/><path class="m-mare" d="${M.mare}"/><path class="m-isole" d="${M.isole}"/><path class="m-parco" d="${M.parchi}"/>
      <path class="m-s0" d="${M.strade[0]}"/><path class="m-s1c" d="${M.strade[1]}"/><path class="m-s2c" d="${M.strade[2]}"/><path class="m-s1" d="${M.strade[1]}"/><path class="m-s2" d="${M.strade[2]}"/><path class="m-moli" d="${M.moli}"/>`;
    if (STRADE && !$('.m-nomi', this.svg).childElementCount) $('.m-nomi', this.svg).innerHTML = STRADE.principali.map(([nome, L, d], i) => `<path id="m${this.n}n${i}" d="${d}"/><text class="m-nome" data-l="${L}" data-c="${nome.length}" data-nome="${esc(nome)}"><textPath href="#m${this.n}n${i}" startOffset="50%" text-anchor="middle">${esc(nome)}</textPath></text>`).join('');
    this.nomi = $$('.m-nome', this.el);
    this.pezzi();
    if (this.attesa) { const a = this.attesa; this.attesa = null; this.disegna(...a); }
  }
  // i pezzi nella vista (più un quarto di pezzo intorno), solo da vicino
  pezzi() {
    if (!STRADE || !this.vb || this.s < SOGLIA_PEZZI) return;
    for (const k of pezziDi(this.vb, STRADE.lato, ESISTE, STRADE.lato / 4)) {
      if (this.messi.has(k)) continue;
      this.messi.add(k);
      prendiPezzo(k).then(d => { if (d && this.el.isConnected) this.aggiungi(d); else this.messi.delete(k); });
    }
  }
  aggiungi(d) {
    const strati = $$('.m-fine > g', this.svg);
    STRATI_P.forEach(([c], i) => { if (d[c]) strati[i].insertAdjacentHTML('beforeend', `<path d="${d[c]}"/>`); });
    this.vie.push(...d.n.map(([nome, , , dd]) => ({ nome, punti: rileggi(dd) })));
    clearTimeout(this.tNomi); this.tNomi = setTimeout(() => this.nomiRotta(), 80);
  }
  // i nomi delle vie dove passa il percorso, scritti sul percorso stesso (strade.ts, nomiDelPercorso)
  nomiRotta() {
    const g = $('.m-nomi-rotta', this.svg);
    if (!g) return;
    const lista = nomiDelPercorso((this.linee || []).map(l => puntiDi(l.d)), this.vie);
    this.inRotta = new Set(lista.map(x => x.nome));
    g.innerHTML = lista.map((e, i) => `<path id="m${this.n}r${i}" d="M${e.punti.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L')}"/><text class="m-nome m-nome--rotta" data-l="${Math.round(e.L)}" data-c="${e.nome.length}" data-nome="${esc(e.nome)}"><textPath href="#m${this.n}r${i}" startOffset="50%" text-anchor="middle">${esc(e.nome)}</textPath></text>`).join('');
    this.nomi = $$('.m-nome', this.el);
    if (this.s) this.nomiVisibili();
  }
  // i nomi si vedono solo se ci stanno; quelli del percorso prima (da 0,9 px ogni 5 m), appena sopra la linea
  nomiVisibili() {
    for (const t of this.nomi || []) {
      const rotta = t.classList.contains('m-nome--rotta');
      t.classList.toggle('m-nome--su', rotta ? +t.dataset.l * this.s > +t.dataset.c * 7 + 24 && this.s > 0.9 : +t.dataset.l * this.s > +t.dataset.c * 6.4 + 36 && this.s > 1.4 && !this.inRotta.has(t.dataset.nome));
      if (rotta) t.setAttribute('dy', (-7.5 / this.s).toFixed(2));
    }
  }
  giu(e) {
    if (!this.vb || e.target.closest('.m-ctrl, .m-osm') || (e.pointerType === 'mouse' && e.button !== 0)) return;
    this.dita.set(e.pointerId, [e.clientX, e.clientY]);
    this.preso = false;
    this.partenza = { vb: { ...this.vb }, dita: new Map(this.dita) };
    this.fermaVolo?.();
    this.el.classList.add('m--muovo');
  }
  muovi(e) {
    if (!this.dita.has(e.pointerId) || !this.partenza) return;
    this.dita.set(e.pointerId, [e.clientX, e.clientY]);
    if (!this.preso) {
      const [x0, y0] = this.partenza.dita.get(e.pointerId) || [e.clientX, e.clientY];
      if (this.dita.size < 2 && Math.hypot(e.clientX - x0, e.clientY - y0) < 6) return;
      this.preso = true;
      for (const id of this.dita.keys()) try { this.el.setPointerCapture(id); } catch { /* il dito è già uscito */ }
    }
    const r = this.el.getBoundingClientRect(), W = r.width, H = r.height, v0 = this.partenza.vb, s0 = W / v0.w;
    const ids = [...this.dita.keys()].filter(id => this.partenza.dita.has(id));
    if (ids.length === 1) {
      const [x, y] = this.dita.get(ids[0]), [x0, y0] = this.partenza.dita.get(ids[0]);
      this.mosso = true;
      this.metti(this.limita({ ...v0, x: v0.x - (x - x0) / s0, y: v0.y - (y - y0) / s0 }));
    } else if (ids.length >= 2) {
      const [a, b] = ids, A1 = this.dita.get(a), B1 = this.dita.get(b), A0 = this.partenza.dita.get(a), B0 = this.partenza.dita.get(b);
      const k = Math.max(.2, Math.min(5, dist(A1, B1) / Math.max(1, dist(A0, B0))));
      const c0 = [(A0[0] + B0[0]) / 2 - r.left, (A0[1] + B0[1]) / 2 - r.top], c1 = [(A1[0] + B1[0]) / 2 - r.left, (A1[1] + B1[1]) / 2 - r.top];
      const ux = v0.x + c0[0] / s0, uy = v0.y + c0[1] / s0, w = v0.w / k, h = w * H / W, s1 = W / w;
      this.mosso = true;
      this.metti(this.limita({ x: ux - c1[0] / s1, y: uy - c1[1] / s1, w, h }));
    }
  }
  su(e) {
    if (!this.dita.has(e.pointerId)) return;
    this.dita.delete(e.pointerId);
    this.partenza = this.dita.size ? { vb: { ...this.vb }, dita: new Map(this.dita) } : null;
    if (!this.dita.size) { this.el.classList.remove('m--muovo'); this.nomiVisibili(); }
  }
  limita(vb) {
    const W = this.el.clientWidth || 1, H = this.el.clientHeight || 1, Mw = BASE?.w ?? 2611, Mh = BASE?.h ?? 1953;
    const w = Math.max(W / 9, Math.min(W / 0.25, vb.w)), h = w * H / W;
    const cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2;
    let x = cx - w / 2, y = cy - h / 2;
    x = Math.max(-200, Math.min(Mw + 200 - w, x));
    y = Math.max(-200, Math.min(Mh + 200 - h, y));
    return { x, y, w, h };
  }
  zoom(k, px, py, anima = true) {
    const W = this.el.clientWidth || 1, H = this.el.clientHeight || 1, v = this.vb;
    px ??= W / 2; py ??= H / 2;
    const s = W / v.w, ux = v.x + px / s, uy = v.y + py / s, w = v.w / k, h = w * H / W, s1 = W / w;
    this.mosso = true;
    const fine = this.limita({ x: ux - px / s1, y: uy - py / s1, w, h });
    if (anima && piano()) this.vola(fine, 320); else this.metti(fine);
  }
  // Gx: la giornata (o null); altre: le linee degli altri giorni (giorno vuoto); n: il numero del giorno
  disegna(Gx, { altre = [], vola = false, n = 1, disegna = true, daLinea = null, punti = null } = {}) {
    if (!BASE) { this.attesa = [Gx, { altre, vola, n, disegna, daLinea, punti }]; this.gx = Gx; return; }
    this.mosso = false;
    $('.m-altre', this.svg).innerHTML = altre.map(a => lineeDi(a).map(l => `<path class="m-altra" d="${l.d}"/>`).join('')).join('');
    this.linee = Gx ? inFila(Gx, lineeDi(Gx)) : [];
    this.daLinea = disegna && piano() ? (daLinea ?? 0) : Infinity;
    this.voci = Gx ? Gx.voci : [];
    $('.m-rotta', this.svg).innerHTML = this.linee.map((l, i) => { const nu = i >= this.daLinea ? ' m-nuova' : ''; return `<path class="m-c${nu}" d="${l.d}"/><path class="m-l m-l--${l.modo}${nu}" d="${l.d}"/>`; }).join('');
    this.tappe = Gx ? tappeDi(Gx) : [];
    this.box = riquadroXY(Gx ? [...this.tappe.map(xyDi), ...this.linee.flatMap(l => puntiDi(l.d))] : altre.flatMap(a => tappeDi(a).map(xyDi)));
    this.fuoco = null;
    this.el.setAttribute('role', 'group');
    this.el.setAttribute('aria-label', Gx ? `Mappa del giorno ${n}: ${this.tappe.length} tappe collegate nell'ordine. Si sposta con il dito e si ingrandisce con due dita.` : 'Mappa: il giorno è vuoto');
    const primaNascosta = this.daLinea === Infinity ? Infinity : this.daLinea === 0 ? 1 : this.tappe.length - 1;
    $('.m-segni', this.el).innerHTML = this.tappe.map((v, i) => `<button type="button" class="m-segno${i >= primaNascosta ? ' m-attesa' : ''}${visitata(v.id) ? ' m-segno--v' : ''}" data-id="${v.id}" aria-label="${v.n}. ${esc(T(v.id).nome)}${visitata(v.id) ? ', visitata' : v.fatta ? '' : `, alle ${ora(v.inizio)}`}"><span>${v.n}</span><i class="m-segno__v" aria-hidden="true">${ic('spunta', 14)}</i></button>`).join('');
    $$('.m-segno', this.el).forEach(b => { b.onclick = () => this.opz.tocca?.(b.dataset.id); });
    this.fatte();
    this.nomiRotta();
    this.punti(punti ?? (this.opz.tutte ? puntiPer(Gx) : []));
    if (this.opz.tutte) this.mostraTutte(this.opz.tutte(Gx), false);
    this.adatta(vola);
  }
  fatte() {
    $$('.m-segno', this.el).forEach(b => b.classList.toggle('m-segno--v', visitata(b.dataset.id)));
    const fatto = $$('.m-rotta path', this.svg);
    (this.linee || []).forEach((l, i) => { const v = this.voci[l.tappaDopo]; const si = !!v && visitata(v.id); fatto[2 * i]?.classList.toggle('m-fatta', si); fatto[2 * i + 1]?.classList.toggle('m-fatta', si); });
  }
  punti(ids) {
    this.idsPunti = ids;
    const f = id => T(id)?.foto?.m;
    $('.m-punti', this.el).innerHTML = ids.map(id => `<button type="button" class="m-punto${nelViaggio(id) ? ' m-punto--viaggio' : ''}" data-id="${id}" aria-label="${esc(T(id).nome)}: apri la scheda"><span class="m-punto__f" aria-hidden="true">${f(id) ? `<img src="${f(id)}" alt="" decoding="async" loading="lazy">` : `<i>${esc(T(id).breve.slice(0, 1))}</i>`}</span><span class="m-punto__n" aria-hidden="true">${f(id) ? `<img src="${f(id)}" alt="" decoding="async" loading="lazy">` : ''}<b>${esc(T(id).breve)}</b></span></button>`).join('');
    $$('.m-punto', this.el).forEach(b => { b.onclick = () => this.opz.punto?.(b.dataset.id, b); });
    if (this.vb) this.segni();
  }
  mostraTutte(si, vola = true) {
    this.tutte = !!si;
    this.el.classList.toggle('m--tutte', this.tutte);
    $('[data-z="tutte"]', this.el)?.setAttribute('aria-pressed', String(this.tutte));
    if (!vola) return;
    this.opz.cambiaTutte?.(this.tutte);
    if (this.tutte) this.inquadra(); else this.tutto();
  }
  inquadra(dur = 700, ids = this.idsPunti) {
    if (!BASE) return;
    this.fuoco = null; this.mosso = true;
    const fine = this.vbPer(riquadroXY([...ids.map(id => T(id).xy), ...this.tappe.map(xyDi)]));
    if (piano() && this.vb && dur > 0) this.vola(fine, dur); else { this.fermaVolo?.(); this.metti(fine); }
  }
  vbPer(box) {
    const W = this.el.clientWidth || 1, H = this.el.clientHeight || 1;
    const p = this.opz.margini ? this.opz.margini() : { t: 44, r: 36, b: 44, l: 36 };
    let s = Math.min((W - p.l - p.r) / (box.x2 - box.x1), (H - p.t - p.b) / (box.y2 - box.y1));
    s = Math.max(Math.min(s, this.fuoco ? 7 : 3.6), 0.15);
    const cx = (box.x1 + box.x2) / 2, cy = (box.y1 + box.y2) / 2;
    const px = p.l + (W - p.l - p.r) / 2, py = p.t + (H - p.t - p.b) / 2;
    return { x: cx - px / s, y: cy - py / s, w: W / s, h: H / s };
  }
  adatta(vola) {
    if (!BASE || !this.box) return;
    const fine = this.vbPer(this.fuoco || this.box);
    if (!vola || !this.vb || !piano()) { this.fermaVolo?.(); this.metti(fine); this.finito(); return; }
    this.vola(fine, 780, () => this.finito());
  }
  // il volo: la mappa si sposta come un'immagine sola (insieme ai segni), all'arrivo si ridisegna nitida
  vola(fine, dur, poi) {
    this.fermaVolo?.();
    const da = this.vb;
    if (!da) { this.metti(fine); poi?.(); return; }
    const W = this.el.clientWidth || 1, s0 = W / da.w, s1 = W / fine.w, k = s1 / s0, tx = (da.x - fine.x) * s1, ty = (da.y - fine.y) * s1;
    const ease = 'cubic-bezier(.65, 0, .35, 1)';
    this.svg.style.transformOrigin = '0 0';
    const anims = [this.svg.animate([{ transform: 'none' }, { transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${k.toFixed(4)})` }], { duration: dur, easing: ease })];
    $$('.m-segno, .m-punto', this.el).forEach(el => {
      const m = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(el.style.transform);
      if (!m) return;
      const x = +m[1], y = +m[2];
      anims.push(el.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: `translate(${(x * k + tx).toFixed(1)}px, ${(y * k + ty).toFixed(1)}px)` }], { duration: dur, easing: ease }));
    });
    let fatto = false;
    this.fermaVolo = () => { if (fatto) return; fatto = true; this.fermaVolo = null; anims.forEach(x => x.cancel()); };
    anims[0].finished.then(() => { if (fatto) return; fatto = true; this.fermaVolo = null; this.metti(fine); anims.forEach(x => x.cancel()); poi?.(); }, () => {});
  }
  finito() { if (this.daLinea !== Infinity) { const da = this.daLinea; this.daLinea = Infinity; this.traccia(da); } }
  metti(vb) {
    this.vb = vb;
    const W = this.el.clientWidth || 1, s = W / vb.w;
    this.svg.setAttribute('viewBox', `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`);
    this.svg.style.setProperty('--u', (1 / s).toFixed(4));
    this.svg.classList.toggle('m--lontano', s < 1.4);
    this.el.classList.toggle('m--vicino', s > 2.3);
    this.s = s;
    this.segni();
    // i pezzi delle strade e i nomi: poco dopo, e i nomi solo a dito fermo
    clearTimeout(this.tP); this.tP = setTimeout(() => { this.pezzi(); if (!this.dita.size) this.nomiVisibili(); }, 40);
  }
  traccia(da) {
    const penne = $$('.m-l', this.svg), segni = $$('.m-segno', this.el);
    $$('.m-nuova', this.svg).forEach(p => p.classList.remove('m-nuova'));
    const indice = new Map();
    this.voci.forEach((x, iv) => { if (x.tipo === 'tappa') indice.set(iv, this.tappe.findIndex(v => v.id === x.id)); });
    const mostra = (i, t) => { const s = segni[i]; if (!s || !s.classList.contains('m-attesa')) return; s.classList.remove('m-attesa'); s.animate?.([{ opacity: 0, transform: `${s.style.transform} translateY(-12px) scale(.6)` }, { opacity: 1, transform: s.style.transform }], { duration: 480, delay: t, easing: 'cubic-bezier(.34,1.4,.64,1)', fill: 'backwards' }); };
    let t = 0;
    if (da === 0) { mostra(0, 0); t = 260; }
    for (let i = da; i < this.linee.length; i++) {
      if (!penne[i]) break;
      const L = penne[i].getTotalLength() * this.s, dur = Math.max(240, L / VELOCITA);
      penne[i].animate?.([{ strokeDasharray: `0 ${L + 60}px` }, { strokeDasharray: `${L + 60}px 0` }], { duration: dur, delay: t, easing: i === da ? 'cubic-bezier(.45,0,1,1)' : 'linear', fill: 'backwards' });
      t += dur;
      const l = this.linee[i], prossima = this.linee[i + 1];
      if (!l.dentro && (!prossima || prossima.v !== l.v)) { const k = indice.get(l.tappaDopo); if (k != null && k >= 0) mostra(k, t - 60); }
    }
    segni.forEach((s, i) => mostra(i, t));
  }
  // i segni delle tappe (e le foto di «Tutte le tappe») restano della stessa misura e non si coprono
  segni() {
    if (!this.vb) return;
    const s = this.s;
    const pos = this.tappe.map(v => { const xy = xyDi(v), x = (xy[0] - this.vb.x) * s, y = (xy[1] - this.vb.y) * s; return { x, y, x0: x, y0: y }; });
    const punti = this.tutte ? $$('.m-punto', this.el) : [];
    for (const b of punti) { const xy = T(b.dataset.id).xy, x = (xy[0] - this.vb.x) * s, y = (xy[1] - this.vb.y) * s; pos.push({ x, y, x0: x, y0: y, r: 18 }); }   // r 18: i pulsanti sono di 36 px, così non si sovrappongono (WCAG 2.5.8)
    const MIN = this.opz.distanza ?? 32;
    const minimo = (a, b) => (a.r && b.r ? a.r + b.r + 2 : a.r || b.r ? MIN / 2 + (a.r || b.r) + 2 : MIN);
    for (let giro = 0; giro < (punti.length ? 60 : 80); giro++) {
      let mosso = false;
      for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i], b = pos[j];
        let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        const m = minimo(a, b);
        if (d >= m) continue;
        if (d < 0.01) { dx = 1; dy = 0.4; d = Math.hypot(dx, dy); }
        const k = (m - d) / 2 / d;
        a.x -= dx * k; a.y -= dy * k; b.x += dx * k; b.y += dy * k; mosso = true;
      }
      if (!mosso) break;
    }
    const bottoni = $$('.m-segno', this.el);
    pos.forEach((p, i) => { if (bottoni[i]) bottoni[i].style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`; });
    $('.m-fili', this.svg).innerHTML = pos.map(p => (Math.hypot(p.x - p.x0, p.y - p.y0) > 6
      ? `<line class="m-filo" x1="${(this.vb.x + p.x0 / s).toFixed(2)}" y1="${(this.vb.y + p.y0 / s).toFixed(2)}" x2="${(this.vb.x + p.x / s).toFixed(2)}" y2="${(this.vb.y + p.y / s).toFixed(2)}"/>` : '')).join('');
    const nT = this.tappe.length;
    // le foto che cadono sotto la testata, i pulsanti della mappa o il foglio si nascondono: coperte a metà non si toccano bene
    const W = this.el.clientWidth, H = this.el.clientHeight, m = this.opz.margini ? this.opz.margini() : { t: 0, r: 0, b: 0, l: 0 };
    const coperto = p => p.y < Math.max(20, m.t) || p.y > H - Math.max(20, m.b - 30) || p.x < Math.max(20, m.l - 40) || p.x > W - Math.max(20, m.r + 10);
    punti.forEach((b, i) => { const p = pos[nT + i]; b.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`; b.classList.toggle('m-punto--sotto', p.y < 150); b.classList.toggle('m-punto--coperto', coperto(p)); });
  }
  centra(id) {
    if (!BASE) return;
    const v = this.tappe.find(t => t.id === id);
    const xy = v ? xyDi(v) : T(id)?.xy;
    if (!xy) return;
    const r = 50;
    this.fuoco = { x1: xy[0] - r, x2: xy[0] + r, y1: xy[1] - r, y2: xy[1] + r };
    this.vola(this.vbPer(this.fuoco), 780);
    this.evidenzia(id);
  }
  tutto() { if (!BASE || !this.box) return; this.fuoco = null; this.mosso = false; this.vola(this.vbPer(this.box), 700); this.evidenzia(null); }
  evidenzia(id) { $$('.m-segno, .m-punto', this.el).forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id))); }
  spegni() { this.ro.disconnect(); this.fermaVolo?.(); tutte.delete(this); }
}
// le strade alternative degli orari veri (senza bus o con un altro bus): solo se un tratto le usa
export async function preparaAlternativi(Gx) {
  if (ALT || !Gx?.voci.some(v => v.tipo === 'tratto' && v.variante != null)) return false;
  ALT = await caricaAlternativi();
  return !!ALT;
}
