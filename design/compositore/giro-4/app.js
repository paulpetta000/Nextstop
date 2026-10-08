// Compositore, pezzo 1, giro 3: A, C, D (migliorate) e G (nuova, un po' astratta), con i dati veri di «Due giorni a Napoli»
// (design/compositore/genera.mjs). Orari, tempi e percorsi vengono dal calcolo del sito (giorno feriale).
// Novità del giro 3 (richieste di Enrico, 08/10/2026): logo che si anima al passaggio del mouse, mappa che si sposta e si
// ingrandisce, percorso disegnato in fila dalla tappa 1 all'ultima, «Elimina», i numeri di ogni giorno, un'animazione di
// ricerca diversa per proposta, «Salva» più lento.
(() => {
  const D = window.DATI, FOTO = window.FOTO, M = window.MAPPA, ST = window.STRADE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const piano = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const computer = matchMedia('(min-width: 960px)');
  const range = n => Array.from({ length: n }, (_, i) => i);
  const dopo = ms => new Promise(r => setTimeout(r, ms));

  // ---------- formati ----------
  const ora = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const durata = m => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ' ' + String(m % 60).padStart(2, '0') : ''}`);
  const durataLunga = m => {
    const h = Math.floor(m / 60), r = m % 60, ore = h === 1 ? "un'ora" : `${h} ore`;
    return h ? (r ? `${ore} e ${r} minuti` : ore) : `${r} minuti`;
  };
  const resta = m => `Ti ${m >= 120 ? 'restano' : 'resta'} ${durataLunga(m)}`;
  const metri = m => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`);
  const km = m => (m / 1000).toFixed(1).replace('.', ',');
  const GS = { lun: 'lunedì', mar: 'martedì', mer: 'mercoledì', gio: 'giovedì', ven: 'venerdì', sab: 'sabato', dom: 'domenica' };
  const INGRESSO = { pagamento: 'Ingresso a pagamento', gratis: 'Ingresso gratis', 'in-parte': 'In parte a pagamento' };
  const DENTRO = { si: 'Al chiuso', no: "All'aperto", 'in-parte': 'In parte al chiuso' };
  const ORDINALE = ['Primo', 'Secondo', 'Terzo', 'Quarto', 'Quinto', 'Sesto', 'Settimo'];
  const norma = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

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
    giorni: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    sole: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    luna: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    auto: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor"/>',
    copia: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
    cerca: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    attenzione: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
    cestino: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/><path d="M10 11v5.5M14 11v5.5"/>',
    centra: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    cammino: '<path d="M6 21c0-5 12-4 12-9S6 7 6 3"/><circle cx="6" cy="3" r="1.4" fill="currentColor"/><circle cx="6" cy="21" r="1.4" fill="currentColor"/>',
    orologio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    biglietto: '<path d="M4 7.5h16v3a1.8 1.8 0 0 0 0 3.6v3H4v-3a1.8 1.8 0 0 0 0-3.6z"/><path d="M14 7.5v10" stroke-dasharray="1.5 2"/>',
    casa: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V19h12V9.5"/>',
    spillo: '<path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z"/><circle cx="12" cy="10" r="2.4"/>'
  };
  const ic = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[n]}</svg>`;
  // il segnalibro di «Salva»: il contorno e il pieno che sale quando salvi
  const segnalibro = `<svg class="salva__ic" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="salva-clip"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></clipPath></defs><g clip-path="url(#salva-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path class="salva__spunta" d="M9 11.2l2.2 2.2 4-4.4" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ---------- il marchio, con l'animazione della home (DESIGN.md §7, src/components/Marchio.astro) ----------
  const LETTERE = [...'nextstop'];
  // Il segno in tema scuro (richiesta di Enrico, giro 4): il blu notte del marchio sul fondo scuro non si legge.
  // Ogni proposta ne prova uno diverso; G resta com'era. Ordine: le sei soglie dalla più esterna, poi segnaposto e buco.
  const SEGNI_SCURI = {
    a: { strati: ['#C8702E', '#DE8E43', '#EDAE66', '#F5CB93', '#FBE4C2', '#FFF7EA'], spillo: '#10173A', buco: '#FFF7EA' },
    c: { strati: ['#4B5DBE', '#6677D0', '#8C9BEA', '#B3BEF3', '#DCE2FB', '#FFFFFF'], spillo: '#0A0F27', buco: '#FFFFFF' },
    d: { strati: ['#6F6656', '#8D8473', '#ADA592', '#CCC5B3', '#E8E2D4', '#FFFDF7'], spillo: '#1F4FA0', buco: '#FFFDF7' }
  };
  const segnoColorato = c => { const colori = [...c.strati, c.spillo, c.buco]; let k = 0; return D.marchio.chiaro.replace(/fill="#[0-9A-Fa-f]{6}"/g, () => `fill="${colori[Math.min(k++, colori.length - 1)]}"`); };
  const firma = (cl = '') => `<a class="firma ${cl}" href="#${S.p}"><span class="vh">nextstop</span><svg class="firma__segno segno--chiaro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${D.marchio.chiaro}</svg><svg class="firma__segno segno--scuro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${SEGNI_SCURI[S.p] ? segnoColorato(SEGNI_SCURI[S.p]) : D.marchio.scuro}</svg><span class="firma__parola" aria-hidden="true">${LETTERE.map((c, i) => (i === 6
    ? `<span class="firma__pin" style="--i:${i}"><i class="firma__ombra"></i><svg viewBox="0 0 20 28" focusable="false">${D.marchio.spillo}</svg><i class="firma__onda"></i></span>`
    : `<span class="firma__l" style="--i:${i}">${c}</span>`)).join('')}<span class="firma__rotta"></span></span></a>`;
  // L'animazione dura circa 2,7 secondi. Se ci ripassi sopra mentre gira, non riparte da capo: finisce e poi ne fa un'altra.
  const GIRO_FIRMA = 2700;
  function animaFirma(el) {
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
  document.addEventListener('pointerover', e => {
    const f = e.target.closest?.('.firma');
    if (!f || (e.relatedTarget && f.contains(e.relatedTarget))) return;
    animaFirma(f);
  });
  document.addEventListener('focusin', e => { const f = e.target.closest?.('.firma'); if (f) animaFirma(f); });
  document.addEventListener('click', e => { const f = e.target.closest?.('.firma'); if (f) { e.preventDefault(); animaFirma(f); } });

  // ---------- stato della prova ----------
  const NUOVO = () => ({ g: 0, vista: 'elenco', salvato: false, eliminato: false, agg: [null, null], extra: false, attiva: null, nuova: null, anima: true, fini: {} });
  const S = { p: 'a', ...NUOVO() };
  const nG = () => D.giorni.length + (S.extra ? 1 : 0);
  function G(g) {
    const base = D.giorni[g];
    if (!base) return null;
    const id = S.agg[g];
    if (!id) return base;
    const a = D.aggiunte[g][id];
    return { ...base, voci: [...base.voci, a.tratto, a.tappa], linee: [...base.linee, ...a.linee], fine: a.fine, visite: a.visite, spostamenti: a.spostamenti, metri: a.metri, avvisi: a.avvisi };
  }
  const tappe = Gx => Gx.voci.filter(v => v.tipo === 'tappa');
  const T = id => D.tappe[id];
  const titoloGiorno = Gx => [...new Set(tappe(Gx).map(v => T(v.id).zona))].join(', ');
  const aPiedi = Gx => Gx.voci.every(v => v.tipo !== 'tratto' || !v.mezzi.length);
  const riassunto = Gx => `Dalle ${ora(Gx.inizio)} alle <span data-conta="fine">${ora(Gx.fine)}</span>, ${tappe(Gx).length} tappe, ${Gx.spostamenti} minuti ${aPiedi(Gx) ? 'a piedi' : 'di spostamenti'} (${metri(Gx.metri)}).`;
  const libero = Gx => Gx.fineScelta - Gx.fine;
  const testoTratto = v => (v.mezzi.length ? `${v.min} min, a piedi e ${v.mezzi.join(' e ')}` : `${v.min} min a piedi, ${metri(v.metri)}`);
  const etichette = id => {
    const t = T(id), out = [];
    if (t.chiuso.length) out.push(`Chiuso il ${t.chiuso.map(g => GS[g]).join(' e il ')}`);
    if (t.prenotazione === 'obbligatoria') out.push('Si entra solo prenotando');
    return out;
  };
  const avvisiGiorno = Gx => Gx.avvisi.map(a => {
    if (a.tipo === 'piena') return `Finisci alle ${ora(a.fine)}, dopo le ${ora(a.limite)} che hai scelto.`;
    if (a.tipo === 'lontana') return `${T(a.id)?.breve ?? a.id} è lontana dalle altre tappe: circa ${a.extra} minuti in più.`;
    return '';
  }).filter(Boolean);
  const suggerite = (g, n = 3) => (g < D.giorni.length ? D.vicine[g].filter(id => id !== S.agg[g]).slice(0, n) : []);
  const crediti = () => `<details class="crediti"><summary>Crediti delle foto e della mappa</summary><p>Mappa: dati © i contributori di OpenStreetMap (ODbL). Foto: ${Object.entries(D.crediti).map(([id, c]) => `${esc(T(id)?.breve ?? id)}, ${esc(c.autore)} (${esc(c.licenza)})`).join('; ')}.</p></details>`;
  // i numeri di un giorno (richiesta di Enrico: per ogni giorno, separati): tappe, minuti a piedi, chilometri, ora di fine
  // data-cifra: quando cambi giorno (o aggiungi una tappa) i numeri scorrono dal valore di prima a quello nuovo
  const cifre = (Gx, cl = 'cifre') => `<dl class="${cl}"><div><dt>tappe</dt><dd class="num" data-cifra="tappe" data-n="${tappe(Gx).length}">${tappe(Gx).length}</dd></div><div><dt>minuti ${aPiedi(Gx) ? 'a piedi' : 'di strada'}</dt><dd class="num" data-cifra="piedi" data-n="${Gx.spostamenti}">${Gx.spostamenti}</dd></div><div><dt>chilometri</dt><dd class="num" data-cifra="km" data-n="${Gx.metri}">${km(Gx.metri)}</dd></div><div><dt>finisci alle</dt><dd class="num" data-cifra="fine" data-n="${Gx.fine}">${ora(Gx.fine)}</dd></div></dl>`;
  const FORMA_CIFRA = { tappe: n => String(Math.round(n)), piedi: n => String(Math.round(n)), km: n => km(n), fine: n => ora(Math.round(n)) };
  function contaCifre() {
    const els = $$('[data-cifra]');
    const seen = {};
    for (const el of els) {
      const k = el.dataset.cifra, n = +el.dataset.n, da = S.cifre?.[k];
      seen[k] ??= n;
      if (da == null || da === n || !piano()) continue;
      const t0 = performance.now(), dur = 820;
      const passo = now => { const q = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - q, 3); el.textContent = FORMA_CIFRA[k](da + (n - da) * e); if (q < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }
    S.cifre = { ...(S.cifre || {}), ...seen };
  }

  // =====================================================================================
  // La mappa: la mappa del sito (OpenStreetMap), più le strade piccole della zona (vicoli, pedonali, scale) e i nomi delle vie.
  // Si sposta con il dito o con il mouse e si ingrandisce (due dita, rotella, + e −). Il percorso si disegna in fila,
  // dalla tappa 1 all'ultima, sempre alla stessa velocità; ogni tappa compare quando il tratto ci arriva.
  // =====================================================================================
  let nMappe = 0;
  const VELOCITA = 0.27;   // pixel al millisecondo (giro 2 meno il 20%, richiesta di Enrico)
  const numeri = d => (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const puntiDi = d => { const n = numeri(d), p = []; for (let i = 0; i + 1 < n.length; i += 2) p.push([n[i], n[i + 1]]); return p; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function riquadroDi(lista) {
    const pts = [];
    for (const Gx of lista) {
      for (const v of tappe(Gx)) pts.push(v.xy);
      for (const l of Gx.linee) pts.push(...puntiDi(l.d));
    }
    if (!pts.length) return { x1: 1850, x2: 2050, y1: 500, y2: 900 };
    let x1 = Math.min(...pts.map(p => p[0])), x2 = Math.max(...pts.map(p => p[0])), y1 = Math.min(...pts.map(p => p[1])), y2 = Math.max(...pts.map(p => p[1]));
    const minimo = 110;
    if (x2 - x1 < minimo) { const c = (x1 + x2) / 2; x1 = c - minimo / 2; x2 = c + minimo / 2; }
    if (y2 - y1 < minimo) { const c = (y1 + y2) / 2; y1 = c - minimo / 2; y2 = c + minimo / 2; }
    return { x1, x2, y1, y2 };
  }
  // le linee nel verso del cammino: ogni pezzo parte da dove è finito quello prima
  function inFila(Gx) {
    const voci = Gx.voci;
    let qui = tappe(Gx)[0]?.xy ?? [0, 0];
    return Gx.linee.map(l => {
      let p = puntiDi(l.d);
      if (dist(qui, p[p.length - 1]) < dist(qui, p[0])) p = p.reverse();
      qui = p[p.length - 1];
      return { ...l, d: 'M' + p.map(x => x.join(' ')).join('L'), v: l.v ?? 0, tappaDopo: voci.findIndex((x, k) => k > (l.v ?? 0) && x.tipo === 'tappa') };
    });
  }
  class Mappa {
    constructor(el, opz = {}) {
      this.el = el; this.opz = opz; this.tappe = []; this.vb = null; this.fuoco = null; this.n = ++nMappe; this.dita = new Map();
      el.classList.add('m');
      const nomi = ST.etichette.map((e, i) => `<path id="m${this.n}n${i}" d="${e.d}"/><text class="m-nome" data-l="${e.L}" data-c="${e.nome.length}"><textPath href="#m${this.n}n${i}" startOffset="50%" text-anchor="middle">${esc(e.nome)}</textPath></text>`).join('');
      el.innerHTML = `<svg class="m-svg" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <rect class="m-terra" x="-6000" y="-6000" width="16000" height="16000"/><path class="m-mare" d="${M.mare}"/><path class="m-isole" d="${M.isole}"/><path class="m-parco" d="${M.parchi}"/>
        <path class="m-s0" d="${M.strade[0]}"/><path class="m-s1c" d="${M.strade[1]}"/><path class="m-s2c" d="${M.strade[2]}"/><path class="m-s1" d="${M.strade[1]}"/><path class="m-s2" d="${M.strade[2]}"/><path class="m-moli" d="${M.moli}"/>
        <g class="m-fine"><path class="m-vicoli" d="${ST.vicoli}"/><path class="m-pedonali" d="${ST.pedonali}"/><path class="m-medie-c" d="${ST.medie}"/><path class="m-grandi-c" d="${ST.grandi}"/><path class="m-medie" d="${ST.medie}"/><path class="m-grandi" d="${ST.grandi}"/><path class="m-scale" d="${ST.scale}"/></g>
        <g class="m-nomi">${nomi}</g>
        <g class="m-altre"></g><g class="m-rotta"></g><g class="m-fili"></g></svg><div class="m-segni"></div>
        <div class="m-ctrl"><button type="button" data-z="piu" aria-label="Ingrandisci la mappa">${ic('piu', 20)}</button><button type="button" data-z="meno" aria-label="Rimpicciolisci la mappa">${ic('meno', 20)}</button><button type="button" data-z="tutto" aria-label="Mostra tutto il giorno">${ic('centra', 20)}</button></div>
        <p class="m-osm">© OpenStreetMap</p>`;
      this.svg = $('svg', el);
      this.nomi = $$('.m-nome', el);
      this.ro = new ResizeObserver(() => { if (this.box && !this.mosso) this.adatta(false); else if (this.vb) this.metti(this.limita(this.vb)); });
      this.ro.observe(el);
      $('.m-ctrl', el).addEventListener('click', e => { const b = e.target.closest('[data-z]'); if (!b) return; if (b.dataset.z === 'tutto') this.tutto(); else this.zoom(b.dataset.z === 'piu' ? 1.6 : 1 / 1.6); });
      // spostare con un dito o con il mouse, ingrandire con due dita o con la rotella
      el.addEventListener('pointerdown', e => this.giu(e));
      el.addEventListener('pointermove', e => this.muovi(e));
      el.addEventListener('pointerup', e => this.su(e));
      el.addEventListener('pointercancel', e => this.su(e));
      el.addEventListener('wheel', e => { e.preventDefault(); const r = el.getBoundingClientRect(); this.zoom(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top, false); }, { passive: false });
      el.addEventListener('dblclick', e => { if (e.target.closest('.m-segno, .m-ctrl')) return; const r = el.getBoundingClientRect(); this.zoom(1.8, e.clientX - r.left, e.clientY - r.top); });
    }
    // si può trascinare anche partendo da un segno: un tocco fermo lo apre, un tocco che si muove sposta la mappa
    giu(e) {
      if (e.target.closest('.m-ctrl') || (e.pointerType === 'mouse' && e.button !== 0)) return;
      this.dita.set(e.pointerId, [e.clientX, e.clientY]);
      this.preso = false;
      this.partenza = { vb: { ...this.vb }, dita: new Map(this.dita) };
      cancelAnimationFrame(this.raf);
      this.el.classList.add('m--muovo');
    }
    muovi(e) {
      if (!this.dita.has(e.pointerId) || !this.partenza) return;
      this.dita.set(e.pointerId, [e.clientX, e.clientY]);
      if (!this.preso) {
        const [x0, y0] = this.partenza.dita.get(e.pointerId) || [e.clientX, e.clientY];
        if (this.dita.size < 2 && Math.hypot(e.clientX - x0, e.clientY - y0) < 6) return;
        this.preso = true;
        for (const id of this.dita.keys()) try { this.el.setPointerCapture(id); } catch {}
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
    // non troppo vicino, non troppo lontano, e non fuori dalla città
    limita(vb) {
      const W = this.el.clientWidth || 1, H = this.el.clientHeight || 1;
      let w = Math.max(W / 9, Math.min(W / 0.35, vb.w)), h = w * H / W;
      const cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2;
      let x = cx - w / 2, y = cy - h / 2;
      x = Math.max(-200, Math.min(M.w + 200 - w, x));
      y = Math.max(-200, Math.min(M.h + 200 - h, y));
      return { x, y, w, h };
    }
    zoom(k, px, py, anima = true) {
      const W = this.el.clientWidth || 1, H = this.el.clientHeight || 1, v = this.vb;
      px ??= W / 2; py ??= H / 2;
      const s = W / v.w, ux = v.x + px / s, uy = v.y + py / s, w = v.w / k, h = w * H / W, s1 = W / w;
      this.mosso = true;
      const fine = this.limita({ x: ux - px / s1, y: uy - py / s1, w, h });
      if (anima && piano()) this.vola(fine, 320); else { this.metti(fine); this.nomiVisibili(); }
    }
    disegna(Gx, { altre = [], vola = false, n = null, disegna = true, daLinea = null } = {}) {
      this.mosso = false;
      $('.m-altre', this.svg).innerHTML = altre.map(a => a.G.linee.map(l => `<path class="m-altra" style="--col:${a.col}" d="${l.d}"/>`).join('')).join('');
      this.linee = Gx ? inFila(Gx) : [];
      this.daLinea = disegna && piano() ? (daLinea ?? 0) : Infinity;
      $('.m-rotta', this.svg).innerHTML = this.linee.map((l, i) => { const nu = i >= this.daLinea ? ' m-nuova' : ''; return `<path class="m-c${nu}" d="${l.d}"/><path class="m-l${nu}" d="${l.d}"/>`; }).join('');
      this.voci = Gx ? Gx.voci : [];
      this.tappe = Gx ? tappe(Gx) : [];
      this.box = riquadroDi(Gx ? [Gx] : altre.map(a => a.G));
      this.fuoco = null;
      this.el.setAttribute('role', 'group');
      this.el.setAttribute('aria-label', Gx ? `Mappa del giorno ${n ?? S.g + 1}: ${this.tappe.length} tappe collegate nell'ordine. Si sposta con il dito e si ingrandisce con due dita.` : 'Mappa: il giorno è vuoto');
      // le tappe che il tratto non ha ancora raggiunto restano nascoste finché il disegno non ci arriva
      const primaNascosta = this.daLinea === Infinity ? Infinity : this.daLinea === 0 ? 1 : this.tappe.length - 1;
      $('.m-segni', this.el).innerHTML = this.tappe.map((v, i) => `<button type="button" class="m-segno${i >= primaNascosta ? ' m-attesa' : ''}" data-id="${v.id}" aria-label="${v.n}. ${esc(T(v.id).nome)}, alle ${ora(v.inizio)}"><span>${v.n}</span></button>`).join('');
      $$('.m-segno', this.el).forEach(b => { b.onclick = () => this.opz.tocca?.(b.dataset.id); });
      this.adatta(vola);
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
      const fine = this.vbPer(this.fuoco || this.box);
      if (!vola || !this.vb || !piano()) { cancelAnimationFrame(this.raf); this.metti(fine); this.finito(); return; }
      this.vola(fine, 780, () => this.finito());
    }
    vola(fine, dur, poi) {
      cancelAnimationFrame(this.raf);
      const da = this.vb, t0 = performance.now();
      const passo = now => {
        const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        this.metti({ x: da.x + (fine.x - da.x) * e, y: da.y + (fine.y - da.y) * e, w: da.w + (fine.w - da.w) * e, h: da.h + (fine.h - da.h) * e });
        if (k < 1) this.raf = requestAnimationFrame(passo); else { this.nomiVisibili(); poi?.(); }
      };
      this.raf = requestAnimationFrame(passo);
    }
    finito() { this.nomiVisibili(); if (this.daLinea !== Infinity) { const da = this.daLinea; this.daLinea = Infinity; this.traccia(da); } }
    metti(vb) {
      this.vb = vb;
      const W = this.el.clientWidth || 1, s = W / vb.w;
      this.svg.setAttribute('viewBox', `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`);
      this.svg.style.setProperty('--u', (1 / s).toFixed(4));
      this.svg.classList.toggle('m--lontano', s < 1.4);
      this.s = s;
      this.segni();
    }
    nomiVisibili() { for (const t of this.nomi) t.classList.toggle('m-nome--su', +t.dataset.l * this.s > +t.dataset.c * 6.4 + 36 && this.s > 1.4); }
    // il percorso in fila: un tratto comincia quando finisce quello prima, sempre alla stessa velocità;
    // una tappa compare quando il tratto ci arriva
    traccia(da) {
      const penne = $$(this.opz.traccia || '.m-l', this.svg), punti = $$('.m-l', this.svg), segni = $$('.m-segno', this.el);
      $$('.m-nuova', this.svg).forEach(p => p.classList.remove('m-nuova'));
      // da voce della giornata a numero della tappa
      const tappaDi = new Map();
      this.voci.forEach((x, iv) => { if (x.tipo === 'tappa') tappaDi.set(iv, this.tappe.findIndex(v => v.id === x.id)); });
      const mostra = (i, t) => { const s = segni[i]; if (!s || !s.classList.contains('m-attesa')) return; s.classList.remove('m-attesa'); s.animate?.([{ opacity: 0, transform: `${s.style.transform} translateY(-12px) scale(.6)` }, { opacity: 1, transform: s.style.transform }], { duration: 480, delay: t, easing: 'cubic-bezier(.34,1.4,.64,1)', fill: 'backwards' }); };
      let t = 0;
      if (da === 0) { mostra(0, 0); t = 260; }
      for (let i = da; i < this.linee.length; i++) {
        const L = punti[i].getTotalLength() * this.s, dur = Math.max(240, L / VELOCITA);
        penne[i].animate?.([{ strokeDasharray: `0 ${L + 60}px` }, { strokeDasharray: `${L + 60}px 0` }], { duration: dur, delay: t, easing: i === da ? 'cubic-bezier(.45,0,1,1)' : 'linear', fill: 'backwards' });
        if (this.opz.traccia) punti[i].animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: dur * .6, delay: t + dur * .4, fill: 'backwards' });
        t += dur;
        // finito l'ultimo pezzo di un tratto, compare la tappa dove arriva (i pezzi dentro una tappa non portano a niente)
        const l = this.linee[i], prossima = this.linee[i + 1];
        if (!l.dentro && (!prossima || prossima.v !== l.v)) { const k = tappaDi.get(l.tappaDopo); if (k != null && k >= 0) mostra(k, t - 60); }
      }
      segni.forEach((s, i) => mostra(i, t));
    }
    // segni senza sovrapposizioni: si allontanano quanto basta e un filo li lega al punto vero
    segni() {
      const s = this.s;
      const pos = this.tappe.map(v => { const x = (v.xy[0] - this.vb.x) * s, y = (v.xy[1] - this.vb.y) * s; return { x, y, x0: x, y0: y }; });
      const MIN = this.opz.distanza ?? 32;
      for (let giro = 0; giro < 80; giro++) {
        let mosso = false;
        for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) {
          const a = pos[i], b = pos[j];
          let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
          if (d >= MIN) continue;
          if (d < 0.01) { dx = 1; dy = 0.4; d = Math.hypot(dx, dy); }
          const k = (MIN - d) / 2 / d;
          a.x -= dx * k; a.y -= dy * k; b.x += dx * k; b.y += dy * k; mosso = true;
        }
        if (!mosso) break;
      }
      const bottoni = $$('.m-segno', this.el);
      pos.forEach((p, i) => { if (bottoni[i]) bottoni[i].style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`; });
      $('.m-fili', this.svg).innerHTML = pos.map(p => (Math.hypot(p.x - p.x0, p.y - p.y0) > 6
        ? `<line class="m-filo" x1="${(this.vb.x + p.x0 / s).toFixed(2)}" y1="${(this.vb.y + p.y0 / s).toFixed(2)}" x2="${(this.vb.x + p.x / s).toFixed(2)}" y2="${(this.vb.y + p.y / s).toFixed(2)}"/>` : '')).join('');
    }
    centra(id) {
      const v = this.tappe.find(t => t.id === id);
      if (!v) return;
      const r = 50;
      this.fuoco = { x1: v.xy[0] - r, x2: v.xy[0] + r, y1: v.xy[1] - r, y2: v.xy[1] + r };
      this.vola(this.vbPer(this.fuoco), 780);
      this.evidenzia(id);
    }
    tutto() { this.fuoco = null; this.mosso = false; this.vola(this.vbPer(this.box), 700); this.evidenzia(null); }
    evidenzia(id) { $$('.m-segno', this.el).forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id))); }
    spegni() { this.ro.disconnect(); cancelAnimationFrame(this.raf); }
  }

  // =====================================================================================
  // Pezzi comuni: foglio che sale (si chiude anche tirandolo giù), avviso in basso, numeri che scorrono
  // =====================================================================================
  const foglioEl = $('#foglio');
  function foglio(titolo, corpo, dopoAperto, cl = '') {
    foglioEl.className = cl;
    foglioEl.innerHTML = `<div class="f-testa"><span class="f-maniglia" aria-hidden="true"></span><h2 id="f-titolo">${esc(titolo)}</h2><button type="button" class="f-chiudi" aria-label="Chiudi">${ic('x')}</button></div><div class="f-corpo">${corpo}</div>`;
    $('.f-chiudi', foglioEl).onclick = () => chiudiFoglio();
    foglioEl.onclick = null;
    foglioEl.style.translate = '';
    if (!foglioEl.open) foglioEl.showModal();
    dopoAperto?.(foglioEl);
  }
  async function chiudiFoglio() {
    if (!foglioEl.open) return;
    if (piano()) { foglioEl.classList.add('f-esce'); await dopo(240); foglioEl.classList.remove('f-esce'); }
    foglioEl.close();
  }
  foglioEl.addEventListener('click', e => { if (e.target === foglioEl) chiudiFoglio(); });
  foglioEl.addEventListener('cancel', e => { e.preventDefault(); chiudiFoglio(); });
  let tiro = null;
  foglioEl.addEventListener('pointerdown', e => { if (!e.target.closest('.f-testa') || e.target.closest('button')) return; tiro = { y: e.clientY }; foglioEl.setPointerCapture(e.pointerId); });
  foglioEl.addEventListener('pointermove', e => { if (!tiro) return; foglioEl.style.translate = `0 ${Math.max(0, e.clientY - tiro.y)}px`; });
  foglioEl.addEventListener('pointerup', e => { if (!tiro) return; const dy = e.clientY - tiro.y; tiro = null; foglioEl.style.translate = ''; if (dy > 90) foglioEl.close(); });

  let tempoAvviso;
  function avvisa(testo, azione) {
    const t = $('#toast');
    t.innerHTML = `<span>${esc(testo)}</span>${azione ? `<button type="button">${esc(azione.testo)}</button>` : ''}`;
    if (azione) $('button', t).onclick = () => { t.classList.remove('su'); azione.fai(); };
    t.classList.remove('su');
    void t.offsetWidth;
    t.classList.add('su');
    clearTimeout(tempoAvviso);
    tempoAvviso = setTimeout(() => t.classList.remove('su'), azione ? 7000 : 4000);
  }
  // l'ora di fine che scorre fino al valore nuovo (17:22 → 17:52) quando aggiungi o togli una tappa
  function contaFine() {
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

  // La scheda si apre subito al tocco sulla tappa; la foto «vola» da dove l'hai toccata alla scheda (passaggio tra viste),
  // poi le righe entrano una dopo l'altra (richiesta di Enrico, giro 4: più interattiva)
  function apriScheda(id, sorgente) {
    const t = T(id), Gx = G(S.g), v = Gx && tappe(Gx).find(x => x.id === id);
    const fatti = [
      v ? ['orologio', `Nel giorno ${S.g + 1} dalle ${ora(v.inizio)} alle ${ora(v.fine)}`] : null,
      ['piedi', `Visita di ${durata(t.durata)}`], ['biglietto', INGRESSO[t.ingresso] ?? ''], ['casa', DENTRO[t.alChiuso] ?? ''],
      ...etichette(id).map(e => ['attenzione', e])
    ].filter(Boolean);
    const corpo = `${FOTO[id] ? `<div class="f-scheda-cornice"><img class="f-scheda-foto" src="${FOTO[id]}" alt=""></div>` : ''}
      <p class="f-scheda-frase">${esc(t.frase)}</p>
      <ul class="f-fatti">${fatti.map(([i, x], k) => `<li style="--k:${k}">${ic(i, 18)}<span>${x}</span></li>`).join('')}</ul>
      ${S.agg[S.g] === id ? `<button type="button" class="f-bottone f-bottone--contorno" data-f="togli">Togli dal giorno ${S.g + 1}</button>` : ''}
      <p class="f-nota">Prova: la scheda vera della tappa (foto, orari, prezzi, storia e fonti) è il pezzo 2.</p>`;
    const img = sorgente?.querySelector?.('img');
    const apri = vola => foglio(t.nome, corpo, f => {
      if (vola) $('.f-scheda-foto', f).style.viewTransitionName = 'foto-scheda';
      f.onclick = e => { if (e.target === f) chiudiFoglio(); if (e.target.closest('[data-f="togli"]')) { chiudiFoglio(); togli(S.g); } };
    }, `f--scheda${vola ? ' f--vola' : ''}`);
    if (img && FOTO[id] && document.startViewTransition && piano()) {
      img.style.viewTransitionName = 'foto-scheda';
      const vt = document.startViewTransition(() => { img.style.viewTransitionName = ''; apri(true); });
      vt.ready.catch(() => {});
      vt.finished.catch(() => {}).finally(() => { const f = $('.f-scheda-foto', foglioEl); if (f) f.style.viewTransitionName = ''; });
    } else apri(false);
  }

  // ---------- «Aggiungi»: tutte le tappe, dalla più vicina. Ogni proposta apre la ricerca con un'animazione diversa ----------
  const FILTRI = [
    ['tutte', 'Tutte', () => true], ['musei', 'Musei', t => t.generi.some(g => g === 'museo' || g === 'archeologia')], ['chiese', 'Chiese', t => t.generi.includes('chiesa')],
    ['panorami', 'Panorami', t => t.generi.includes('panorama')], ['sotto', 'Sottoterra', t => t.generi.includes('sotterraneo')], ['verde', 'Parchi e mare', t => t.generi.some(g => g === 'parco' || g === 'mare')],
    ['passeggiate', 'Passeggiate', t => t.generi.includes('passeggiata')], ['gratis', 'Gratis', t => t.ingresso === 'gratis']
  ];
  // il testo d'esempio della ricerca si scrive da solo, lettera per lettera (proposte A e G)
  function scriviSegnaposto(input, testo) {
    if (!piano()) { input.placeholder = testo; return; }
    let i = 0;
    input.placeholder = '';
    const t = setInterval(() => { if (!input.isConnected || input.value) { clearInterval(t); input.placeholder = testo; return; } input.placeholder = testo.slice(0, ++i); if (i >= testo.length) clearInterval(t); }, 34);
  }
  function apriAggiungi(b) {
    const g = S.g;
    if (g >= D.giorni.length) {
      foglio('Aggiungi una tappa', `<p class="f-nota">Nella prova le tappe si aggiungono ai giorni 1 e 2. Per il giorno ${g + 1} puoi partire da un itinerario pronto.</p>${prontiLista()}`, f => { f.onclick = e => { if (e.target === f) chiudiFoglio(); if (e.target.closest('[data-f="pronto"]')) { chiudiFoglio(); AZ.pronto(); } }; });
      return;
    }
    const ultima = T(tappe(D.giorni[g]).slice(-1)[0].id).breve;
    let filtro = 'tutte', q = '';
    const riga = (id, i) => {
      const t = T(id), a = D.aggiunte[g][id], dentro = S.agg[g] === id;
      const av = a.avvisi.map(x => (x.tipo === 'piena' ? `Finiresti alle ${ora(x.fine)}` : x.tipo === 'lontana' ? 'Lontana dalle altre' : '')).filter(Boolean);
      return `<li class="f-tappa" style="--i:${Math.min(i, 12)}">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" loading="lazy">` : `<span class="f-senza" aria-hidden="true">${esc(t.breve.slice(0, 1))}</span>`}
        <div><b>${esc(t.nome)}</b><small><span class="num">${a.tratto.min} min</span> a piedi da ${esc(ultima)}, ${durata(t.durata)} di visita</small>
        ${[...av.map(x => `<span class="f-et f-et--attenzione">${x}</span>`), ...etichette(id).map(x => `<span class="f-et">${x}</span>`)].join('')}</div>
        <button type="button" class="f-piu${dentro ? ' f-piu--dentro' : ''}" data-f="agg" data-id="${id}" aria-label="${dentro ? 'Togli' : 'Aggiungi'} ${esc(t.breve)} ${dentro ? 'dal' : 'al'} giorno ${g + 1}">${dentro ? ic('spunta', 20) : ic('piu', 20)}</button></li>`;
    };
    const elenco = () => {
      const ok = FILTRI.find(f => f[0] === filtro)[2];
      const ids = D.vicine[g].filter(id => ok(T(id)) && (!q || norma(`${T(id).nome} ${T(id).breve} ${T(id).zona}`).includes(norma(q))));
      if (!ids.length) return `<p class="f-nota">Nessuna tappa con queste parole. Prova a togliere il filtro.</p>`;
      const gruppi = [['A meno di 10 minuti a piedi', ids.filter(id => D.aggiunte[g][id].tratto.min < 10)], ['Tra 10 e 25 minuti', ids.filter(id => { const m = D.aggiunte[g][id].tratto.min; return m >= 10 && m < 25; })], ['Più lontane', ids.filter(id => D.aggiunte[g][id].tratto.min >= 25)]];
      let i = 0;
      return gruppi.filter(x => x[1].length).map(([tit, lista]) => `<section class="f-gruppo"><h3>${tit} <span class="num">${lista.length}</span></h3><ul>${lista.map(id => riga(id, i++)).join('')}</ul></section>`).join('');
    };
    const stile = P[S.p].cerca;   // a: si allarga, c: dal bottone al foglio, d: il foglietto, g: la lente
    const testo = `Cerca tra ${D.vicine[g].length} tappe`;
    const corpo = `<div class="f-cerca f-cerca--${stile}"><label class="vh" for="f-q">Cerca una tappa</label>${ic('cerca', 20)}<input id="f-q" type="search" placeholder="${stile === 'a' || stile === 'g' ? '' : testo}" autocomplete="off" enterkeyhint="search"></div>
      <div class="f-filtri" role="group" aria-label="Che tipo di tappa">${FILTRI.map(([k, n]) => `<button type="button" aria-pressed="${k === filtro}" data-filtro="${k}">${n}</button>`).join('')}</div>
      <div id="f-elenco">${elenco()}</div>
      <p class="f-nota">Prova: le tappe vanno in fondo al giorno ${g + 1}, con i tempi veri; se ne aggiunge una per giorno. La ricerca vera (anche locali, gite e parole come «Cristo velato») è il pezzo 3.</p>`;
    const dopoAperto = f => {
      const input = $('#f-q', f);
      if (stile === 'a') { input.addEventListener('focus', () => scriviSegnaposto(input, 'Una tappa, un museo, una chiesa…'), { once: true }); input.placeholder = 'Cerca'; }
      if (stile === 'g') setTimeout(() => scriviSegnaposto(input, testo), 380);
      const aggiornaElenco = () => { $('#f-elenco', f).innerHTML = elenco(); };
      input.addEventListener('input', e => { q = e.target.value.trim(); aggiornaElenco(); });
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const fb = e.target.closest('[data-filtro]');
        if (fb) { filtro = fb.dataset.filtro; $$('[data-filtro]', f).forEach(x => x.setAttribute('aria-pressed', String(x === fb))); aggiornaElenco(); return; }
        const bt = e.target.closest('[data-f="agg"]');
        if (!bt) return;
        const id = bt.dataset.id;
        if (S.agg[g] === id) { chiudiFoglio(); togli(g); return; }
        bt.classList.add('f-piu--dentro');
        bt.innerHTML = ic('spunta', 20);
        await dopo(piano() ? 420 : 0);
        await chiudiFoglio();
        aggiungi(g, id);
      };
    };
    // G: la lente si allarga in un cerchio a partire dal pulsante che hai toccato
    if (stile === 'g' && b) { const r = b.getBoundingClientRect(); foglioEl.style.setProperty('--ox', `${r.left + r.width / 2}px`); foglioEl.style.setProperty('--oy', `${r.top + r.height / 2}px`); }
    // C: il pulsante «Aggiungi» diventa la barra di ricerca (passaggio tra viste)
    if (stile === 'c' && b && document.startViewTransition && piano()) {
      b.style.viewTransitionName = 'cerca-c';
      const vt = document.startViewTransition(() => { b.style.viewTransitionName = ''; foglio('Aggiungi una tappa', corpo, dopoAperto, `f--${stile}`); });
      vt.ready.catch(() => {}); vt.finished.catch(() => {});
      return;
    }
    foglio('Aggiungi una tappa', corpo, dopoAperto, `f--${stile}`);
  }
  function aggiungi(g, id) {
    const prima = S.agg[g];
    P[S.p].aggiorna(() => { S.agg[g] = id; S.nuova = id; });
    const a = D.aggiunte[g][id];
    const nota = a.avvisi.some(x => x.tipo === 'piena') ? ` Finisci alle ${ora(a.fine)}, dopo le 19:00.` : ` Finisci alle ${ora(a.fine)}.`;
    avvisa(`${T(id).breve} è in fondo al giorno ${g + 1}.${nota}${prima ? ` (Nella prova una sola tappa in più: ho tolto ${T(prima).breve}.)` : ''}`, { testo: 'Annulla', fai: () => P[S.p].aggiorna(() => { S.agg[g] = prima; S.nuova = null; }) });
  }
  function togli(g) {
    const prima = S.agg[g];
    if (!prima) return;
    P[S.p].aggiorna(() => { S.agg[g] = null; S.nuova = null; });
    avvisa(`${T(prima).breve} non è più nel giorno ${g + 1}.`, { testo: 'Annulla', fai: () => P[S.p].aggiorna(() => { S.agg[g] = prima; }) });
  }
  const prontiLista = () => `<div class="f-azioni">${D.altri.map(a => `<button type="button" class="f-azione" data-f="pronto"><span>${esc(a.nome)}<small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></span></button>`).join('')}</div>`;

  // ---------- «Salva»: il segnalibro scende, si riempie piano, compare la spunta, la parola diventa «Salvato» ----------
  // Tre movimenti diversi per «Salva», uno per proposta (Enrico sceglie): A il segnalibro che si riempie,
  // C il segnaposto che cade e manda un'onda (come nel marchio), D il timbro che si stampa sul pulsante. G resta com'era.
  const spilloSalva = `<svg class="salva__ic salva__ic--spillo" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="spillo-clip"><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z"/></clipPath></defs><g clip-path="url(#spillo-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle class="salva__buco" cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  const bottoneSalva = (cl = '') => {
    const v = P[S.p].salva || 'a';
    const icona = v === 'c' ? spilloSalva : segnalibro;
    return `<button type="button" class="salva salva--${v} ${cl}${S.salvato ? ' salva--fatto' : ''}" data-azione="salva">${icona}<span class="salva__t"><span class="salva__a">Salva</span><span class="salva__b">Salvato</span></span>${v === 'c' ? '<i class="salva__onda" aria-hidden="true"></i>' : ''}${v === 'd' ? '<i class="salva__inchiostro" aria-hidden="true"></i>' : ''}</button>`;
  };
  function salva(b) {
    if (S.salvato) { apriMiei(); return; }
    S.salvato = true;
    $$('.salva').forEach(x => x.classList.add('salva--fatto'));
    if (b) { b.classList.remove('salva--ora'); void b.offsetWidth; b.classList.add('salva--ora'); }
    $$('[data-stato]').forEach(x => { x.dataset.stato = 'salvato'; x.querySelector('.stato__t').textContent = 'Salvato in «I miei itinerari»'; });
    setTimeout(() => avvisa('Salvato in «I miei itinerari» come «Due giorni a Napoli».', { testo: 'Cambia nome', fai: () => avvisa('Prova: il nome si cambia con un tocco, è il pezzo 4.') }), piano() ? 700 : 0);
  }
  const stato = () => `<span class="stato" data-stato="${S.salvato ? 'salvato' : 'bozza'}"><i aria-hidden="true"></i><span class="stato__t">${S.salvato ? 'Salvato in «I miei itinerari»' : 'Non ancora salvato'}</span></span>`;

  // ---------- «Elimina»: si chiede conferma con il nome; poi «Annulla» per qualche secondo ----------
  function chiediElimina() {
    foglio('Eliminare l\'itinerario?', `<p>«Due giorni a Napoli» sparisce da questo telefono, ${S.salvato ? 'anche da «I miei itinerari»' : 'con le tappe che hai aggiunto'}. I link che hai già mandato continuano ad aprirsi: portano tutto con sé.</p>
      <div class="f-conferma"><button type="button" class="f-bottone f-bottone--pericolo" data-f="si">${ic('cestino', 20)}Elimina «Due giorni a Napoli»</button><button type="button" class="f-bottone f-bottone--contorno" data-f="no">Annulla</button></div>`, f => {
      f.onclick = async e => {
        if (e.target === f || e.target.closest('[data-f="no"]')) { chiudiFoglio(); return; }
        if (!e.target.closest('[data-f="si"]')) return;
        await chiudiFoglio();
        const prima = { ...S };
        aggiornaTutto(() => { S.eliminato = true; S.salvato = false; });
        avvisa('Itinerario eliminato.', { testo: 'Annulla', fai: () => aggiornaTutto(() => { Object.assign(S, { eliminato: false, salvato: prima.salvato }); }) });
      };
    }, 'f--conferma');
  }
  // la pagina dopo «Elimina»: vuota, con le strade per ricominciare
  const paginaEliminata = cl => `<section class="eliminato ${cl}" aria-labelledby="el-t">${firma()}<h1 id="el-t">Itinerario eliminato</h1><p>«Due giorni a Napoli» non c'è più su questo telefono.</p>
    <div class="eliminato__azioni"><button type="button" class="f-bottone" data-azione="ripristina">Rimettilo com'era</button><button type="button" class="f-bottone f-bottone--contorno" data-azione="pronto">Componi un itinerario nuovo</button></div>
    <h2>Oppure parti da un itinerario pronto</h2><ul>${D.altri.map(a => `<li><button type="button" data-azione="pronto"><span>${esc(a.nome)}</span><small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></button></li>`).join('')}</ul></section>`;

  function apriMiei() {
    foglio('I miei itinerari', `<div class="f-lista"><div class="f-riga">${FOTO['monte-echia'] ? `<img src="${FOTO['monte-echia']}" alt="">` : ''}<div><b>Due giorni a Napoli</b><small>${nG()} giorni, ${range(D.giorni.length).reduce((s, g) => s + tappe(G(g)).length, 0)} tappe</small><span class="f-segno">${S.salvato ? `${ic('spunta', 16)}Salvato` : 'Non ancora salvato'}</span></div><button type="button" class="f-icona f-icona--pericolo" data-f="elimina" aria-label="Elimina «Due giorni a Napoli»">${ic('cestino', 20)}</button></div></div>
      ${S.salvato ? '' : `<button type="button" class="f-bottone" data-f="salva">Salva questo itinerario</button>`}
      <p class="f-nota">Gli itinerari restano su questo telefono: niente account, niente iscrizione.</p>`, f => {
      f.onclick = async e => {
        if (e.target === f) chiudiFoglio();
        if (e.target.closest('[data-f="salva"]')) { chiudiFoglio(); salva(); }
        if (e.target.closest('[data-f="elimina"]')) { await chiudiFoglio(); chiediElimina(); }
      };
    });
  }
  function apriCondividi() {
    foglio('Condividi', `<p>Chi apre il link vede lo stesso itinerario: gli stessi giorni, le stesse tappe, gli stessi orari.</p>
      <div class="f-link"><label class="vh" for="f-link">Link dell'itinerario</label><input id="f-link" readonly value="${esc(D.link)}"><button type="button" class="f-bottone" data-f="copia">${ic('copia', 20)}Copia</button></div>
      <p class="f-nota">Il link porta tutto dopo il «#»: non passa da nessun server.</p>`, f => {
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        if (!e.target.closest('[data-f="copia"]')) return;
        try { await navigator.clipboard.writeText(D.link); avvisa('Link copiato.'); } catch { const i = $('#f-link', f); i.focus(); i.select(); avvisa('Tieni premuto sul link e scegli «Copia».'); }
      };
    });
  }
  function apriAltro() {
    foglio('Itinerario', `<div class="f-azioni">
      <button type="button" class="f-azione" data-f="miei">${ic('miei')}<span>I miei itinerari<small>Quelli salvati su questo telefono</small></span></button>
      <button type="button" class="f-azione" data-f="condividi">${ic('condividi')}<span>Condividi<small>Un link con tutto l'itinerario</small></span></button>
      <button type="button" class="f-azione" data-f="giorni">${ic('giorni')}<span>Tutti i giorni<small>${nG()} giorni</small></span></button>
      <button type="button" class="f-azione" data-f="giorno">${ic('piu')}<span>Aggiungi un giorno</span></button>
      <button type="button" class="f-azione" data-f="quando">${ic('calendario')}<span>Data e orari<small>Senza data, dalle 9:30 alle 19:00</small></span></button>
      <button type="button" class="f-azione f-azione--pericolo" data-f="elimina">${ic('cestino')}<span>Elimina itinerario<small>Lo togli da questo telefono</small></span></button>
    </div>`, f => {
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        await chiudiFoglio();
        ({ miei: apriMiei, condividi: apriCondividi, giorni: apriGiorni, giorno: nuovoGiorno, quando, elimina: chiediElimina })[b.dataset.f]();
      };
    });
  }
  function apriGiorni() {
    foglio('I giorni', `<div class="f-azioni">${range(nG()).map(g => { const Gx = G(g); return `<button type="button" class="f-azione" data-f="g" data-g="${g}"><span class="f-num">${g + 1}</span><span>${Gx ? esc(titoloGiorno(Gx)) : 'Giorno vuoto'}${g === S.g ? ' (lo stai guardando)' : ''}<small>${Gx ? `Dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}, ${tappe(Gx).length} tappe, ${Gx.spostamenti} minuti a piedi` : 'Ancora nessuna tappa'}</small></span></button>`; }).join('')}
      <button type="button" class="f-azione" data-f="nuovo">${ic('piu')}<span>Aggiungi un giorno</span></button></div>`, f => {
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        await chiudiFoglio();
        if (b.dataset.f === 'nuovo') nuovoGiorno(); else vaiAlGiorno(+b.dataset.g);
      };
    });
  }
  const quando = () => avvisa('Prova: qui si sceglie la data e si cambiano gli orari. Restano senza data, dalle 9:30 alle 19:00.');
  function nuovoGiorno() {
    if (S.extra) { avvisa('Nella prova si arriva a 3 giorni (sul sito fino a 7).'); return; }
    P[S.p].aggiorna(() => { S.extra = true; S.g = nG() - 1; S.vista = 'elenco'; }, { giorno: true });
    avvisa('Aggiunto il giorno 3.', { testo: 'Annulla', fai: () => P[S.p].aggiorna(() => { S.extra = false; S.g = Math.min(S.g, 1); }, { giorno: true }) });
  }
  // il giorno nuovo entra dal lato giusto: da destra se vai avanti, da sinistra se torni indietro
  function vaiAlGiorno(g) {
    if (g < 0 || g >= nG() || g === S.g) return false;
    S.nuova = null;
    const r = document.documentElement;
    r.dataset.dir = g > S.g ? 'avanti' : 'indietro';
    clearTimeout(vaiAlGiorno.t);
    vaiAlGiorno.t = setTimeout(() => { delete r.dataset.dir; }, 700);
    if (P[S.p].giorno) P[S.p].giorno(g); else P[S.p].aggiorna(() => { S.g = g; S.attiva = null; }, { giorno: true });
    return true;
  }
  // Sfogliare i giorni (richiesta di Enrico, giro 4): sul telefono trascinando col dito a destra o a sinistra;
  // sul computer trascinando col mouse o scorrendo di lato con due dita sul touchpad. La pagina segue il dito.
  function sfoglia(el) {
    if (!el) return;
    let p0 = null, dir = null, tolto = false;
    el.addEventListener('pointerdown', e => {
      if ((e.pointerType === 'mouse' && e.button !== 0) || e.target.closest('.m, input, .f-filtri, [role="tablist"]')) return;
      p0 = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }; dir = null;
    });
    el.addEventListener('pointermove', e => {
      if (!p0 || e.pointerId !== p0.id) return;
      const dx = e.clientX - p0.x, dy = e.clientY - p0.y;
      if (!dir) { if (Math.hypot(dx, dy) < 10) return; dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v'; if (dir === 'h') { try { el.setPointerCapture(e.pointerId); } catch {} el.classList.add('sfoglio'); } }
      if (dir !== 'h') return;
      const fermo = (dx > 0 && S.g === 0) || (dx < 0 && S.g === nG() - 1);
      const x = fermo ? dx * .25 : dx;
      if (piano()) { el.style.translate = `${x.toFixed(1)}px 0`; el.style.opacity = String(Math.max(.45, 1 - Math.abs(x) / 700)); }
    });
    const fine = e => {
      if (!p0 || e.pointerId !== p0.id) return;
      const dx = e.clientX - p0.x, v = Math.abs(dx) / Math.max(1, performance.now() - p0.t);
      if (dir === 'h') {
        tolto = true; setTimeout(() => { tolto = false; }, 50);
        el.classList.remove('sfoglio');
        const vai = (Math.abs(dx) > 70 || (v > .45 && Math.abs(dx) > 30)) && vaiAlGiorno(S.g + (dx < 0 ? 1 : -1));
        if (!vai) { el.style.transition = 'translate 360ms var(--entra), opacity 300ms'; el.style.translate = ''; el.style.opacity = ''; setTimeout(() => { el.style.transition = ''; }, 380); }
      }
      p0 = null; dir = null;
    };
    el.addEventListener('pointerup', fine);
    el.addEventListener('pointercancel', fine);
    el.addEventListener('click', e => { if (tolto) { e.stopPropagation(); e.preventDefault(); } }, true);
    // il touchpad del computer: due dita di lato
    let somma = 0, pausa = 0;
    el.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || e.target.closest('.m')) return;
      e.preventDefault();
      if (performance.now() < pausa) return;
      somma += e.deltaX;
      if (Math.abs(somma) > 80) { vaiAlGiorno(S.g + (somma > 0 ? 1 : -1)); somma = 0; pausa = performance.now() + 750; }
    }, { passive: false });
  }

  // =====================================================================================
  // Disegno della pagina e passaggi
  // =====================================================================================
  let mappa = null;
  let ascolti = [];
  function ascolta(tipo, fn) { let raf = 0; const h = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); }; addEventListener(tipo, h, { passive: true }); ascolti.push([tipo, h]); }
  const smettiAscolti = () => { ascolti.forEach(([t, h]) => removeEventListener(t, h)); ascolti = []; };
  function disegna() {
    const r = document.documentElement;
    r.classList.remove('pa', 'pc', 'pd', 'pg');
    r.classList.add('p' + S.p);
    r.dataset.g = String(S.g);
    if (mappa) { mappa.spegni(); mappa = null; }
    smettiAscolti();
    const app = $('#app');
    app.classList.toggle('apre', S.anima);
    app.innerHTML = S.eliminato ? paginaEliminata(`eliminato--${S.p}`) : P[S.p].html();
    if (!S.eliminato) P[S.p].dopo?.();
    if (S.anima) { const f = $('.firma', app); if (f) animaFirma(f); }
    S.anima = false;
    prova();
    contaFine();
    contaCifre();
    if (S.nuova) { const n = S.nuova; setTimeout(() => { if (S.nuova === n) { S.nuova = null; $$('.nuova').forEach(x => x.classList.remove('nuova')); } }, 2800); }
  }
  // cambia lo stato e ridisegna; con «giorno» riporta la pagina all'inizio del giorno se eri più in basso
  function aggiornaTutto(fn, { giorno = false } = {}) {
    const fai = () => {
      fn();
      disegna();
      if (giorno) {
        const testa = $('[data-inizio-giorno]');
        if (testa) { const y = testa.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(testa).scrollMarginTop) || 0); if (scrollY > y) scrollTo({ top: y }); }
      }
      if (S.nuova) { const el = $('.nuova'); if (el && !computer.matches) { const r = el.getBoundingClientRect(); if (r.top > innerHeight - 140 || r.bottom < 120) el.scrollIntoView({ block: 'center', behavior: piano() ? 'smooth' : 'auto' }); } }
    };
    if (document.startViewTransition && piano()) { const vt = document.startViewTransition(fai); vt.ready.catch(() => {}); vt.finished.catch(() => {}); } else fai();
  }

  const AZ = {
    giorno: b => vaiAlGiorno(+b.dataset.g),
    'nuovo-giorno': nuovoGiorno,
    'togli-giorno': () => P[S.p].aggiorna(() => { S.extra = false; S.g = Math.min(S.g, 1); }, { giorno: true }),
    vista: b => P[S.p].aggiorna(() => { S.vista = b.dataset.v; }),
    aggiungi: b => apriAggiungi(b),
    'aggiungi-subito': b => aggiungi(S.g, b.dataset.id),
    salva: b => salva(b),
    miei: apriMiei, condividi: apriCondividi, altro: apriAltro, quando, giorni: apriGiorni, elimina: chiediElimina,
    ripristina: () => aggiornaTutto(() => { S.eliminato = false; }),
    menu: () => avvisa('Prova: qui si apre il menu del sito, quello di oggi.'),
    tappa: b => (P[S.p].tocca ? P[S.p].tocca(b.dataset.id, b) : apriScheda(b.dataset.id, b)),
    scheda: b => apriScheda(b.dataset.id, b),
    pronto: () => avvisa('Prova: qui si aprirebbe un altro itinerario.')
  };
  $('#app').addEventListener('click', e => {
    const b = e.target.closest('[data-azione]');
    if (b && !b.disabled) AZ[b.dataset.azione]?.(b, e);
  });
  $('#app').addEventListener('keydown', e => {
    const t = e.target.closest('[role="tab"]');
    if (!t || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const g = Math.max(0, Math.min(nG() - 1, S.g + (['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : -1)));
    vaiAlGiorno(g);
    requestAnimationFrame(() => $(`[role="tab"][data-g="${g}"]`)?.focus());
  });
  // pulsanti che rispondono al tocco: un'onda leggera parte da dove tocchi
  $('#app').addEventListener('pointerdown', e => {
    const b = e.target.closest('.onda');
    if (!b || !piano()) return;
    const r = b.getBoundingClientRect(), o = document.createElement('i');
    o.className = 'onda__i';
    o.style.left = `${e.clientX - r.left}px`; o.style.top = `${e.clientY - r.top}px`;
    b.append(o);
    setTimeout(() => o.remove(), 700);
  });

  const schedeGiorni = (cl = '') => range(nG()).map(g => `<button type="button" role="tab" class="${cl}" aria-selected="${g === S.g}" data-azione="giorno" data-g="${g}">Giorno ${g + 1}</button>`).join('');
  const vuoto = (cl, bott) => `<div class="${cl}"><p>Il giorno ${S.g + 1} è vuoto. Aggiungi la prima tappa, oppure parti da un itinerario pronto.</p><button type="button" class="${bott}" data-azione="aggiungi">${ic('piu', 20)}Aggiungi una tappa</button>
    <ul>${D.altri.map(a => `<li><button type="button" data-azione="pronto"><span>${esc(a.nome)}</span><small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></button></li>`).join('')}</ul>
    <button type="button" class="${bott} ${bott}--contorno" data-azione="togli-giorno">Togli il giorno ${S.g + 1}</button></div>`;
  // il tempo libero in fondo al giorno, con le tre tappe più vicine da aggiungere con un tocco
  const liberoBlocco = (Gx, cl) => {
    const l = libero(Gx), sug = suggerite(S.g);
    if (l <= 0) return avvisiGiorno(Gx).length ? `<div class="${cl} ${cl}--attenzione" role="status">${ic('attenzione', 20)}<p>${avvisiGiorno(Gx).join(' ')}</p></div>` : '';
    return `<div class="${cl}"><p class="${cl}__tit">${resta(l)} prima delle ${ora(Gx.fineScelta)}.</p>
      ${sug.length ? `<p class="${cl}__sotto">Le più vicine a ${esc(T(tappe(Gx).slice(-1)[0].id).breve)}:</p><ul class="${cl}__sug">${sug.map(id => `<li><button type="button" class="sug onda" data-azione="aggiungi-subito" data-id="${id}">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" loading="lazy">` : '<span class="sug__senza"></span>'}<span><b>${esc(T(id).breve)}</b><small><span class="num">${D.aggiunte[S.g][id].tratto.min} min</span> a piedi, ${durata(T(id).durata)}</small></span><span class="sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>` : ''}
      <button type="button" class="${cl}__tutte onda" data-azione="aggiungi">Vedi tutte le ${D.vicine[S.g]?.length ?? ''} tappe</button></div>`;
  };
  const altreLinee = () => range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' }));

  // =====================================================================================
  // A · LA RIVISTA
  // =====================================================================================
  const A = {
    nome: 'La rivista',
    cerca: 'a',
    salva: 'a',
    idea: ['Una rivista di viaggio: la foto in copertina, i titoli con le grazie, la linea a puntini color tufo che si disegna mentre scorri.',
      'Sotto «Giorno 1 / Giorno 2» i numeri del giorno scelto (tappe, minuti a piedi, chilometri, ora di fine): quando cambi giorno scorrono ai valori nuovi. Si cambia giorno anche trascinando di lato.',
      'Salva: il segnalibro scende, si riempie piano e compare la spunta. Logo in tema scuro: archi color ambra. Ricerca: il campo «Cerca» si allarga e il testo d\'esempio si scrive da solo.'],
    html() {
      const g = S.g, Gx = G(g), mappaTel = !computer.matches && S.vista === 'mappa';
      return `<header class="a-testata">${firma()}<button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></header>
      <div class="a-pagina"><div class="a-colonna">
        <section class="a-copertina" aria-labelledby="a-titolo">
          <div class="a-foto-c"><img src="${FOTO['monte-echia']}" alt=""></div>
          <div class="a-copertina__t"><h1 id="a-titolo">${esc(D.nome)}</h1><div class="a-stato">${stato()}${bottoneSalva('a-salva onda')}</div></div>
        </section>
        <div class="a-quando">${ic('calendario', 20)}<span>Senza data, dalle 9:30 alle 19:00</span><button type="button" data-azione="quando">Cambia</button></div>
        <div class="a-giorni"><div class="a-schede" role="tablist" aria-label="Giorni dell'itinerario">${schedeGiorni('onda')}</div><button type="button" class="a-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        <section class="a-giorno giorno-corpo" data-inizio-giorno aria-labelledby="a-g">
          ${Gx ? `${cifre(Gx, 'cifre a-cifre')}<h2 id="a-g">${esc(titoloGiorno(Gx))}</h2><p class="a-riassunto">${riassunto(Gx)}</p>` : `<h2 id="a-g">Una pagina bianca</h2>`}
          ${mappaTel ? '<div class="a-mappa-tel"><div id="mappa"></div></div>' : Gx ? this.giornata(Gx) : vuoto('a-vuoto', 'a-bottone')}
        </section>
        <div class="a-fine"></div>
        ${this.isola()}
      </div>
      ${computer.matches ? `<div class="a-destra"><div class="a-cornice"><div id="mappa"></div><p class="a-cornice__t">${Gx ? `${ORDINALE[g]} giorno, ${esc(titoloGiorno(Gx))}` : ''}</p></div></div>` : ''}</div>${crediti()}`;
    },
    giornata(Gx) {
      const voci = Gx.voci.map(v => {
        if (v.tipo === 'tratto') return `<li class="a-tratto"><span></span><span>${ic('piedi', 18)}${testoTratto(v)}</span></li>`;
        const t = T(v.id), nuova = v.id === S.nuova;
        return `<li class="a-tappa${nuova ? ' nuova' : ''}"><span class="a-ora num">${ora(v.inizio)}</span><button type="button" class="a-scheda${FOTO[v.id] ? '' : ' a-scheda--senza'}" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="a-scheda__t"><span class="a-nome">${esc(t.nome)}</span><span class="a-meta">${durata(t.durata)}, fino alle ${ora(v.fine)}</span>${etichette(v.id).map(e => `<span class="a-et">${e}</span>`).join(' ')}</span>${FOTO[v.id] ? `<img class="a-foto" src="${FOTO[v.id]}" alt="" loading="lazy">` : ''}</button></li>`;
      }).join('');
      return `<ol class="a-linea">${voci}</ol>${liberoBlocco(Gx, 'a-libero')}`;
    },
    isola() {
      const g = S.g, mappaTel = S.vista === 'mappa';
      return `<nav class="a-isola" aria-label="Comandi dell'itinerario">
        <div class="a-passi"><button type="button" data-azione="giorno" data-g="${g - 1}" aria-label="Giorno prima"${g === 0 ? ' disabled' : ''}>${ic('indietro')}</button><span class="a-passi__giorno"><span class="a-punti" aria-hidden="true">${range(nG()).map(k => `<i${k === g ? ' class="su"' : ''}></i>`).join('')}</span><span aria-live="polite">Giorno ${g + 1} di ${nG()}</span></span><button type="button" data-azione="giorno" data-g="${g + 1}" aria-label="Giorno dopo"${g === nG() - 1 ? ' disabled' : ''}>${ic('avanti')}</button></div>
        <span class="a-sep" aria-hidden="true"></span>
        <button type="button" class="a-vista onda" data-azione="vista" data-v="${mappaTel ? 'elenco' : 'mappa'}" aria-label="${mappaTel ? 'Elenco' : 'Mappa'}">${ic(mappaTel ? 'elenco' : 'mappa')}</button>
        <button type="button" class="a-piu-grande onda" data-azione="aggiungi" aria-label="Aggiungi una tappa">${ic('piu')}<span class="a-etic" aria-hidden="true">Aggiungi</span></button>
        <button type="button" class="onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi, Elimina">${ic('altro')}</button>
      </nav>`;
    },
    dopo() {
      let y0 = scrollY;
      ascolta('scroll', () => { const isola = $('.a-isola'); if (!isola) return; const y = scrollY; if (Math.abs(y - y0) > 8) { isola.classList.toggle('a-isola--piccola', y > y0 && y > 300); y0 = y; } });
      sfoglia($('.a-giorno'));
      const el = $('#mappa');
      if (!el) return;
      mappa = new Mappa(el, { traccia: '.m-c', tocca: id => A.tocca(id), margini: () => (computer.matches ? { t: 70, r: 60, b: 90, l: 60 } : { t: 50, r: 34, b: 60, l: 34 }) });
      const Gx = G(S.g);
      mappa.disegna(Gx, { daLinea: S.nuova ? D.giorni[S.g].linee.length : null, altre: Gx ? [] : altreLinee() });
      if (S.attiva) mappa.evidenzia(S.attiva);
    },
    tocca(id, b) {
      S.attiva = id;
      $$('.a-scheda').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
      mappa?.evidenzia(id);
      apriScheda(id, b);
    },
    aggiorna: aggiornaTutto
  };

  // =====================================================================================
  // C · MAPPA PRIMA
  // =====================================================================================
  const C = {
    nome: 'Mappa prima',
    cerca: 'c',
    salva: 'c',
    idea: ['La mappa è la pagina, con i vicoli, le scale e i nomi delle vie; si sposta con il dito e si ingrandisce. Il percorso si disegna in fila, dalla tappa 1 all\'ultima.',
      'In cima al foglio i giorni e i numeri del giorno: quando scorri giù salgono e spariscono, così vedi tutto l\'itinerario; tornano quando risali. Si cambia giorno anche trascinando l\'elenco di lato.',
      'Tocca una tappa: si apre subito la scheda e la foto vola dalla riga alla scheda; dietro, la mappa va sulla tappa. Salva: il segnaposto cade e manda un\'onda, come nel marchio. Logo in tema scuro: archi pervinca chiari.'],
    html() {
      return `<div class="c-mappa" id="c-mappa"><div id="mappa"></div></div>
      <header class="c-sopra"><button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button><div class="c-nome">${firma('firma--solo-segno')}<div><h1>${esc(D.nome)}</h1>${stato()}</div></div>${bottoneSalva('c-salva onda')}</header>
      <div class="c-fumetto" id="fumetto" hidden></div>
      <div class="c-spazio" aria-hidden="true"><span class="c-sosta c-sosta--0"></span><span class="c-sosta c-sosta--1"></span></div>
      <section class="c-foglio" id="c-foglio" aria-label="Giornata">${this.foglio(true)}</section>
      <button type="button" class="c-torna onda" id="c-torna" data-azione="su-mappa" data-nascosto="true">${ic('mappa', 20)}Mappa</button>`;
    },
    foglio(anima = false) {
      const Gx = G(S.g);
      let i = 0;
      return `<div class="c-barra" data-inizio-giorno><span class="c-maniglia" aria-hidden="true"></span>
        <div class="c-giorni"><div class="c-tabs" role="tablist" aria-label="Giorni dell'itinerario">${schedeGiorni()}</div><button type="button" class="c-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        ${Gx ? `<div class="c-riga-azioni">${cifre(Gx, 'cifre c-cifre')}</div>` : ''}
        <div class="c-riga-azioni"><p class="c-riassunto">${Gx ? `<b>${esc(titoloGiorno(Gx))}</b>dalle ${ora(Gx.inizio)}` : '<b>Giorno vuoto</b>Aggiungi la prima tappa'}</p>
          <button type="button" class="c-azione c-azione--piena onda" data-azione="aggiungi">${ic('piu', 20)}Aggiungi</button>
          <button type="button" class="c-azione onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi, Elimina">${ic('altro')}</button></div>
      </div>
      <div class="c-corpo giorno-corpo${anima ? ' c-entra' : ''}">${Gx ? `<ol class="c-elenco">${Gx.voci.map(v => v.tipo === 'tratto'
        ? `<li class="c-tratto" style="--i:${i++}"><i aria-hidden="true"></i><span>${ic('piedi', 15)}${testoTratto(v)}</span></li>`
        : `<li class="c-riga${v.id === S.nuova ? ' nuova' : ''}" style="--i:${i++}"><button type="button" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="c-n">${v.n}</span><span class="c-tit"><span class="c-ora num">${ora(v.inizio)} – ${ora(v.fine)}</span>${esc(T(v.id).nome)}${etichette(v.id).length ? `<small>${etichette(v.id).join(', ')}</small>` : ''}</span>${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : '<span></span>'}</button></li>`).join('')}</ol>
        ${liberoBlocco(Gx, 'c-libero')}` : vuoto('c-vuoto', 'c-azione')}</div>
      ${crediti()}`;
    },
    margini() {
      if (computer.matches) return { t: 90, r: 70, b: 70, l: 500 };
      const el = $('#mappa'), sp = $('.c-spazio');
      const visibile = sp ? sp.offsetHeight : 300;
      return { t: 112, r: 36, b: Math.max(60, (el?.clientHeight || 600) - visibile + 40), l: 36 };
    },
    dopo() {
      mappa = new Mappa($('#mappa'), { tocca: id => C.tocca(id), margini: () => C.margini(), distanza: 36 });
      this.disegnaMappa(false, S.nuova ? D.giorni[S.g].linee.length : null);
      const torna = $('#c-torna'), carta = $('#c-mappa');
      let y0 = scrollY;
      ascolta('scroll', () => {
        const sp = $('.c-spazio');
        if (!sp || computer.matches) return;
        const k = Math.max(0, Math.min(1, scrollY / Math.max(1, sp.offsetHeight)));
        carta.style.setProperty('--su', k.toFixed(3));
        torna.dataset.nascosto = String(k < .8);
        const y = scrollY, barra = $('.c-barra');
        if (barra && Math.abs(y - y0) > 6) { barra.classList.toggle('c-barra--via', y > y0 && y > sp.offsetHeight + 60); y0 = y; }
      });
      sfoglia($('#c-foglio'));
    },
    disegnaMappa(vola, daLinea = null) {
      const Gx = G(S.g);
      mappa.disegna(Gx, { vola, daLinea, altre: Gx ? [] : altreLinee() });
      if (S.attiva) mappa.evidenzia(S.attiva);
    },
    giorno(g) {
      S.g = g; S.attiva = null;
      document.documentElement.dataset.g = String(g);
      $('#fumetto').hidden = true;
      const foglio = $('#c-foglio');
      const fai = () => { foglio.style.translate = ''; foglio.style.opacity = ''; foglio.innerHTML = this.foglio(true); contaCifre(); };
      if (document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
      this.disegnaMappa(true);
      contaFine();
    },
    aggiorna(fn, opz = {}) {
      const prima = S.g;
      fn();
      if (!mappa || S.eliminato || !$('#c-foglio')) { aggiornaTutto(() => {}); return; }
      document.documentElement.dataset.g = String(S.g);
      $('#c-foglio').innerHTML = this.foglio(prima !== S.g || !!opz.giorno);
      contaCifre();
      const cambiato = prima !== S.g || !!opz.giorno;
      this.disegnaMappa(cambiato || !!S.nuova, cambiato ? null : S.nuova ? D.giorni[S.g].linee.length : Infinity);
      contaFine();
      prova();
    },
    tocca(id, b) {
      S.attiva = id;
      $$('.c-riga button').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
      mappa?.centra(id);
      apriScheda(id, b && b.closest?.('.c-riga') ? b : null);
    }
  };
  AZ['su-mappa'] = () => scrollTo({ top: 0, behavior: piano() ? 'smooth' : 'auto' });
  AZ['tutto-giorno'] = () => { S.attiva = null; $('#fumetto').hidden = true; $$('.c-riga button').forEach(b => b.removeAttribute('aria-current')); mappa?.tutto(); };

  // =====================================================================================
  // D · LE PAGINE
  // =====================================================================================
  const PASSO = 64;
  // le orme tra una cartolina e l'altra: compaiono una dopo l'altra quando arrivano sullo schermo
  const orme = () => `<svg class="orme" viewBox="0 0 60 120" aria-hidden="true" focusable="false">${[0, 1, 2, 3, 4].map(k => { const sx = k % 2 ? 38 : 22, y = 8 + k * 22, r = k % 2 ? 12 : -12; return `<g class="orma" style="--k:${k}" transform="translate(${sx} ${y}) rotate(${r})"><path d="M0 -7c3 0 4.2 2.6 4 5.6-.2 3.4-1.4 5.4-4 5.4s-3.8-2-4-5.4C-4.2 -4.4 -3 -7 0 -7z"/><ellipse cx="0" cy="7" rx="2.6" ry="2.4"/></g>`; }).join('')}</svg>`;
  const Dp = {
    nome: 'Le pagine',
    cerca: 'd',
    salva: 'd',
    idea: ['Un giorno è una pagina: si sfoglia con il dito (sul computer anche con il mouse o con due dita sul touchpad); il titolo scorre più piano della pagina.',
      'Le cartoline si appoggiano sul tavolo una dopo l\'altra mentre scorri; tra una e l\'altra le orme dei passi. Tocca una cartolina: la foto vola nella scheda.',
      'Salva: un timbro si stampa sul pulsante. Logo in tema scuro: archi color avorio. Ricerca: un foglietto di carta scende dall\'alto e si appoggia.'],
    html() {
      const pc = computer.matches;
      return `<div class="d-tutto"><div class="d-sinistra">
        <header class="d-testata">${firma()}<button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></header>
        <div class="d-titolo"><div><h1>${esc(D.nome)}</h1>${stato()}</div>${bottoneSalva('d-salva onda')}</div>
        <nav class="d-indice" aria-label="Giorni"><div class="d-indice__voci" role="tablist" aria-label="Giorni dell'itinerario">${range(nG()).map(g => `<button type="button" role="tab" aria-selected="${g === S.g}" data-azione="giorno" data-g="${g}" aria-label="Giorno ${g + 1}">${g + 1}</button>`).join('')}<span class="d-indice__segno" id="d-segno" style="transform:translateX(${S.g * PASSO}px)"></span></div><button type="button" class="d-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 22)}</button><span class="d-indice__dove" id="d-dove" aria-live="polite">giorno ${S.g + 1} di ${nG()}</span></nav>
        <div class="d-pagine" id="d-pagine">${range(nG()).map(g => this.pagina(g)).join('')}</div>
      </div>${pc ? '<div class="d-destra"><div id="mappa"></div></div>' : ''}</div>
      ${pc ? '' : `<div class="d-strato" id="d-strato" hidden role="dialog" aria-label="Mappa del giorno"><div class="d-strato__testa"><h2 id="d-strato-t">${ORDINALE[S.g]} giorno</h2><button type="button" class="tondo onda" data-azione="chiudi-mappa" aria-label="Chiudi la mappa">${ic('x')}</button></div><div id="mappa-d"></div></div>`}
      <nav class="d-tab" aria-label="Comandi dell'itinerario">
        <button type="button" class="onda" data-azione="giorni">${ic('giorni')}Giorni</button>
        <button type="button" class="d-tab__mappa onda" data-azione="mappa-d" aria-pressed="false">${ic('mappa')}Mappa</button>
        <button type="button" class="d-tab__piu" data-azione="aggiungi"><span class="cerchio onda">${ic('piu')}</span>Aggiungi</button>
        <button type="button" class="onda" data-azione="miei">${ic('miei')}I miei</button>
        <button type="button" class="onda" data-azione="altro">${ic('altro')}Altro</button>
      </nav>${crediti()}`;
    },
    pagina(g) {
      const Gx = G(g), qui = g === S.g;
      let k = 0;
      const voci = Gx ? Gx.voci.map(v => {
        if (v.tipo === 'tratto') return `<div class="d-tratto">${v.mezzi.length ? ic('mappa', 22) : orme()}<span class="d-tratto__t">${testoTratto(v)}</span></div>`;
        const t = T(v.id);
        return `<button type="button" class="d-cartolina${v.id === S.nuova ? ' nuova' : ''}" style="--k:${k++}" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="d-foto">${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : `<span class="d-senza" aria-hidden="true">${esc(t.breve)}</span>`}<span class="d-timbro-ora num" aria-hidden="true">${ora(v.inizio)}</span></span><span class="d-cartolina__testo"><span class="vh">Alle ${ora(v.inizio)}, ${durata(t.durata)}: </span><b>${esc(t.nome)}</b><span class="d-frase">${esc(t.frase)}</span><span class="d-meta">${durata(t.durata)}, fino alle ${ora(v.fine)}</span>${etichette(v.id).map(e => `<span class="d-et">${e}</span>`).join('')}</span></button>`;
      }).join('') : '';
      const sug = Gx ? suggerite(g) : [];
      const l = Gx ? libero(Gx) : 0;
      return `<section class="d-pagina${qui ? ' attiva' : ''}${qui && computer.matches ? ' giorno-corpo' : ''}" data-pagina="${g}" aria-label="Giorno ${g + 1}"${qui ? ' data-inizio-giorno' : ' inert'}><h2>${ORDINALE[g]} giorno<small>${Gx ? esc(titoloGiorno(Gx)) : 'ancora vuoto'}</small></h2>
        ${Gx ? `${cifre(Gx, 'cifre d-francobolli')}<div class="d-cartoline">${voci}</div>
          ${l > 0 ? `<div class="d-libero"><p>${resta(l)} prima delle ${ora(Gx.fineScelta)}: c'è spazio per un'altra cartolina.</p>
            <ul class="d-sug">${sug.map(id => `<li><button type="button" class="d-sug__c onda" data-azione="aggiungi-subito" data-id="${id}">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" loading="lazy">` : '<span class="d-senza"></span>'}<b>${esc(T(id).breve)}</b><small class="num">${D.aggiunte[g][id].tratto.min} min a piedi</small><span class="d-sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>
            <button type="button" class="d-bottone d-bottone--contorno onda" data-azione="aggiungi">Vedi tutte le ${D.vicine[g].length} tappe</button></div>` : liberoBlocco(Gx, 'd-libero')}` : vuoto('d-vuoto', 'd-bottone')}
        <div class="d-dopo"></div></section>`;
    },
    dopo() {
      const pag = $('#d-pagine');
      const pc = computer.matches;
      let y0 = scrollY;
      ascolta('scroll', () => { const tab = $('.d-tab'); if (!tab || computer.matches) return; const y = scrollY; if (Math.abs(y - y0) > 8) { tab.classList.toggle('d-tab--via', y > y0 && y > 260); y0 = y; } });
      // le cartoline e le orme si animano quando arrivano sullo schermo
      if (piano() && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vista'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
        $$('.d-cartolina, .d-tratto, .d-francobolli').forEach(x => { x.classList.add('da-vedere'); io.observe(x); });
      }
      if (pc) {
        mappa = new Mappa($('#mappa'), { tocca: id => Dp.tocca(id), margini: () => ({ t: 60, r: 56, b: 80, l: 56 }) });
        mappa.disegna(G(S.g), { daLinea: S.nuova ? D.giorni[S.g].linee.length : null, altre: G(S.g) ? [] : altreLinee() });
        sfoglia($('.d-pagina.attiva'));
        return;
      }
      pag.scrollLeft = S.g * pag.clientWidth;
      this.altezza();
      this.profondita();
      let fermo;
      pag.addEventListener('scroll', () => {
        const x = pag.scrollLeft / pag.clientWidth;
        $('#d-segno').style.transform = `translateX(${(x * PASSO).toFixed(1)}px)`;
        this.profondita();
        const g = Math.max(0, Math.min(nG() - 1, Math.round(x)));
        if (g !== S.g) {
          S.g = g; S.attiva = null; S.nuova = null;
          document.documentElement.dataset.g = String(g);
          $$('.d-indice [role="tab"]').forEach(b => b.setAttribute('aria-selected', String(+b.dataset.g === g)));
          $('#d-dove').textContent = `giorno ${g + 1} di ${nG()}`;
          $$('.d-pagina').forEach(p => { const qui = +p.dataset.pagina === g; p.classList.toggle('attiva', qui); p.toggleAttribute('data-inizio-giorno', qui); p.inert = !qui; });
        }
        clearTimeout(fermo);
        fermo = setTimeout(() => { this.altezza(); contaFine(); }, 140);
      }, { passive: true });
    },
    profondita() {
      const pag = $('#d-pagine');
      if (!pag || !piano()) return;
      const x = pag.scrollLeft / pag.clientWidth;
      $$('.d-pagina', pag).forEach(p => p.style.setProperty('--o', (+p.dataset.pagina - x).toFixed(3)));
    },
    altezza() {
      const pag = $('#d-pagine');
      if (!pag || computer.matches) return;
      const p = pag.children[S.g];
      if (p) pag.style.height = `${p.offsetHeight}px`;
    },
    giorno(g) {
      if (computer.matches) { aggiornaTutto(() => { S.g = g; S.attiva = null; }, { giorno: true }); return; }
      const pag = $('#d-pagine');
      pag.style.height = `${Math.max(pag.children[S.g].offsetHeight, pag.children[g].offsetHeight)}px`;
      pag.scrollTo({ left: g * pag.clientWidth, behavior: piano() ? 'smooth' : 'auto' });
    },
    aggiorna(fn, opz = {}) { aggiornaTutto(fn, opz); },
    tocca(id, b) {
      S.attiva = id;
      $$('.d-cartolina').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
      mappa?.evidenzia(id);
      apriScheda(id, b);
    }
  };
  let mappaD = null;
  AZ['mappa-d'] = () => {
    const s = $('#d-strato');
    if (!s) return;
    s.hidden = false;
    $('#d-strato-t').textContent = `${ORDINALE[S.g]} giorno`;
    $('.d-tab__mappa')?.setAttribute('aria-pressed', 'true');
    mappaD?.spegni();
    mappaD = new Mappa($('#mappa-d'), { tocca: id => apriScheda(id), margini: () => ({ t: 44, r: 36, b: 70, l: 36 }) });
    const Gx = G(S.g);
    mappaD.disegna(Gx, { altre: Gx ? [] : altreLinee() });
    $('[data-azione="chiudi-mappa"]', s).focus();
  };
  AZ['chiudi-mappa'] = () => { const s = $('#d-strato'); if (s) s.hidden = true; mappaD?.spegni(); mappaD = null; $('.d-tab__mappa')?.setAttribute('aria-pressed', 'false'); $('.d-tab__mappa')?.focus(); };
  addEventListener('keydown', e => { if (e.key === 'Escape' && $('#d-strato') && !$('#d-strato').hidden) AZ['chiudi-mappa'](); });

  // =====================================================================================
  // G · IL CAMMINO (un po' astratta, ma chiara): la giornata è una strada che scende la pagina a curve;
  // le tappe stanno lungo la strada e un puntino cammina mentre scorri
  // =====================================================================================
  const PASSO_G = 230;
  const Gp = {
    nome: 'Il cammino',
    cerca: 'g',
    idea: ['La giornata come una strada che scende la pagina a curve: le tappe stanno lungo la strada, a destra e a sinistra, con la foto in un tondo; sulla strada i minuti a piedi.',
      'Mentre scorri, un puntino cammina sulla strada e la strada si colora fino a dove sei arrivato. In basso la barra dice a che tappa sei.',
      'Ricerca: la lente si allarga in un cerchio dal pulsante «Aggiungi» fino a riempire lo schermo, poi il testo d\'esempio si scrive da solo. Colori: verde rame e sabbia.'],
    html() {
      const Gx = G(S.g), pc = computer.matches, mappaTel = !pc && S.vista === 'mappa';
      return `<div class="g-tutto"><div class="g-sinistra">
        <header class="g-testata">${firma()}<button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></header>
        <div class="g-titolo"><h1>${esc(D.nome)}</h1><div class="g-stato">${stato()}${bottoneSalva('g-salva onda')}</div></div>
        <div class="g-giorni"><div class="g-tabs" role="tablist" aria-label="Giorni dell'itinerario">${schedeGiorni('onda')}</div><button type="button" class="g-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        <section class="g-giorno" data-inizio-giorno aria-labelledby="g-g">
          ${Gx ? `<h2 id="g-g">${esc(titoloGiorno(Gx))}</h2>${cifre(Gx, 'cifre g-cifre')}` : `<h2 id="g-g">Giorno ${S.g + 1}</h2>`}
          ${mappaTel ? '<div class="g-mappa-tel"><div id="mappa"></div></div>' : Gx ? this.cammino(Gx) : vuoto('g-vuoto', 'g-bottone')}
        </section>
        ${this.barra(Gx)}
      </div>${pc ? '<div class="g-destra"><div id="mappa"></div></div>' : ''}</div>${crediti()}`;
    },
    cammino(Gx) {
      const voci = tappe(Gx), tratti = Gx.voci.filter(v => v.tipo === 'tratto');
      const n = voci.length, H = 70 + (n - 1) * PASSO_G + 90;
      return `<div class="g-strada" id="g-strada" style="--h:${H}px" data-n="${n}"><svg class="g-svg" id="g-svg" aria-hidden="true" focusable="false"><path class="g-fondo" id="g-fondo"/><path class="g-fatto" id="g-fatto"/><circle class="g-passo" id="g-passo" r="7"/></svg>
        <ol class="g-tappe">${voci.map((v, i) => { const t = T(v.id); return `<li class="g-tappa g-tappa--${i % 2 ? 'd' : 's'}${v.id === S.nuova ? ' nuova' : ''}" style="--y:${70 + i * PASSO_G}px"><button type="button" class="g-medaglia" data-azione="tappa" data-id="${v.id}" aria-label="${v.n}. ${esc(t.nome)}">${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : `<span class="g-senza" aria-hidden="true"></span>`}<span class="g-n" aria-hidden="true">${v.n}</span></button><div class="g-testo"><p class="g-ora num">${ora(v.inizio)} – ${ora(v.fine)}</p><h3>${esc(t.nome)}</h3><p class="g-meta">${durata(t.durata)}${etichette(v.id).length ? `. ${etichette(v.id).join('. ')}` : ''}</p></div></li>`; }).join('')}</ol>
        ${tratti.map((v, i) => `<p class="g-tratto g-tratto--${i % 2 ? 'd' : 's'} num" style="--y:${70 + i * PASSO_G + PASSO_G / 2}px">${ic('piedi', 15)}${testoTratto(v)}</p>`).join('')}</div>
        ${liberoBlocco(Gx, 'g-libero')}`;
    },
    barra(Gx) {
      const mappaTel = S.vista === 'mappa';
      return `<nav class="g-barra" aria-label="Comandi dell'itinerario"><div class="g-dove" aria-hidden="true"><span class="g-dove__linea"><i id="g-dove-i"></i></span><span class="g-dove__t" id="g-dove-t">${Gx ? `Tappa 1 di ${tappe(Gx).length}` : 'Giorno vuoto'}</span></div>
        ${computer.matches ? '' : `<button type="button" class="onda" data-azione="vista" data-v="${mappaTel ? 'elenco' : 'mappa'}" aria-label="${mappaTel ? 'Cammino' : 'Mappa'}">${ic(mappaTel ? 'cammino' : 'mappa')}</button>`}
        <button type="button" class="g-aggiungi onda" data-azione="aggiungi">${ic('piu', 20)}<span>Aggiungi</span></button><button type="button" class="onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi, Elimina">${ic('altro')}</button></nav>`;
    },
    // la strada: curve morbide che passano da una tappa all'altra, una a sinistra e una a destra
    strada() {
      const box = $('#g-strada');
      if (!box) return;
      const W = box.clientWidth, n = +box.dataset.n, H = box.clientHeight;
      const x = i => (i % 2 ? W - 62 : 62), y = i => 70 + i * PASSO_G;
      let d = `M${x(0)} ${y(0) - 50}L${x(0)} ${y(0)}`;
      for (let i = 1; i < n; i++) d += `C${x(i - 1)} ${y(i - 1) + PASSO_G * .55} ${x(i)} ${y(i) - PASSO_G * .55} ${x(i)} ${y(i)}`;
      d += `L${x(n - 1)} ${y(n - 1) + 70}`;
      const svg = $('#g-svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      $('#g-fondo').setAttribute('d', d);
      $('#g-fatto').setAttribute('d', d);
      this.lunghezza = $('#g-fatto').getTotalLength();
      $('#g-fatto').style.strokeDasharray = `${this.lunghezza} ${this.lunghezza}`;
      // dove sta ogni tappa lungo la strada (per sapere a che tappa sei)
      this.lungo = range(n).map(i => { let lo = 0, hi = this.lunghezza; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if ($('#g-fatto').getPointAtLength(m).y < y(i)) lo = m; else hi = m; } return lo; });
      this.cammina();
    },
    cammina() {
      const box = $('#g-strada');
      if (!box || !this.lunghezza) return;
      const r = box.getBoundingClientRect(), mezzo = innerHeight * .55;
      const k = piano() ? Math.max(0, Math.min(1, (mezzo - r.top) / r.height)) : 1;
      const L = this.lunghezza * k, p = $('#g-fatto').getPointAtLength(L);
      $('#g-fatto').style.strokeDashoffset = String(this.lunghezza - L);
      $('#g-passo').setAttribute('cx', p.x.toFixed(1)); $('#g-passo').setAttribute('cy', p.y.toFixed(1));
      $('#g-passo').style.opacity = piano() && k > 0 && k < 1 ? '1' : '0';
      const n = this.lungo.filter(x => x <= L + 30).length || 1;
      const Gx = G(S.g), tot = Gx ? tappe(Gx).length : 0;
      const t = $('#g-dove-t'); if (t && tot) t.textContent = piano() ? `Tappa ${Math.min(n, tot)} di ${tot}` : `${tot} tappe, ${Gx.spostamenti} minuti a piedi`;
      const i = $('#g-dove-i'); if (i) i.style.transform = `scaleX(${tot ? Math.min(n, tot) / tot : 0})`;
      $$('.g-tappa').forEach((li, j) => li.classList.toggle('su', j < n));
    },
    dopo() {
      const el = $('#mappa');
      if (el) {
        mappa = new Mappa(el, { tocca: id => apriScheda(id), margini: () => (computer.matches ? { t: 60, r: 60, b: 80, l: 60 } : { t: 50, r: 34, b: 60, l: 34 }) });
        const Gx = G(S.g);
        mappa.disegna(Gx, { daLinea: S.nuova ? D.giorni[S.g].linee.length : null, altre: Gx ? [] : altreLinee() });
      }
      if (!$('#g-strada')) return;
      this.strada();
      ascolta('scroll', () => this.cammina());
      ascolta('resize', () => this.strada());
    },
    aggiorna: aggiornaTutto
  };

  const P = { a: A, c: C, d: Dp, g: Gp };

  // =====================================================================================
  // La striscia della prova: proposta, tema, idea
  // =====================================================================================
  const TEMI = ['auto', 'chiaro', 'scuro'];
  let tema = 'auto';
  try { tema = localStorage.getItem('prova-tema') || 'auto'; } catch {}
  function mettiTema() {
    const r = document.documentElement;
    if (tema === 'auto') delete r.dataset.theme; else r.dataset.theme = tema === 'scuro' ? 'dark' : 'light';
    $('#p-tema').innerHTML = `${ic(tema === 'auto' ? 'auto' : tema === 'chiaro' ? 'sole' : 'luna', 20)}<span class="vh">Tema </span><span>${tema === 'auto' ? 'Auto' : tema === 'chiaro' ? 'Chiaro' : 'Scuro'}</span>`;
  }
  $('#p-tema').addEventListener('click', () => {
    tema = TEMI[(TEMI.indexOf(tema) + 1) % 3];
    try { localStorage.setItem('prova-tema', tema); } catch {}
    const fai = () => { mettiTema(); if (mappa) mappa.metti(mappa.vb); };
    if (document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
  });
  function prova() {
    $$('#prova .p-scelte button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === S.p)));
    $('#p-nome').textContent = `${S.p.toUpperCase()} · ${P[S.p].nome}`;
    $('#idea').innerHTML = `<h2>${S.p.toUpperCase()} · ${P[S.p].nome}</h2>${P[S.p].idea.map(t => `<p>${esc(t)}</p>`).join('')}<p class="idea__nota">Giro 4. In tutte (G resta com'era): un tocco sulla tappa apre subito la scheda; si cambia giorno anche trascinando di lato; ogni proposta ha il suo «Salva», la sua ricerca e il suo logo per il tema scuro: scegli quelli che ti piacciono di più.</p>`;
  }
  $$('#prova .p-scelte button').forEach(b => b.addEventListener('click', () => { if (b.dataset.p !== S.p) location.hash = b.dataset.p; }));
  function daHash(primo) {
    const p = location.hash.slice(1);
    const nuovo = P[p] ? p : 'a';
    if (!primo && nuovo === S.p) return;
    // ogni proposta riparte pulita: primo giorno, non salvato, senza aggiunte; il marchio si anima di nuovo
    const fai = () => { Object.assign(S, { p: nuovo, ...NUOVO() }); disegna(); scrollTo(0, 0); };
    if (!primo && document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
  }
  addEventListener('hashchange', () => daHash(false));
  computer.addEventListener('change', () => disegna());
  addEventListener('resize', () => { if (S.p === 'd') Dp.altezza(); });

  mettiTema();
  daHash(true);
  try { if (!localStorage.getItem('prova-idea-vista-4')) { $('#idea').showPopover?.(); localStorage.setItem('prova-idea-vista-4', '1'); } } catch {}
})();
