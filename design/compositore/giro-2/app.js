// Compositore, pezzo 1, giro 2: le proposte A, C, D (migliorate) ed E, F (nuove, più astratte), con i dati veri di
// «Due giorni a Napoli» (design/compositore/genera.mjs). Orari, tempi e percorsi vengono dal calcolo del sito (giorno feriale).
// «Aggiungi» propone tutte le tappe, dalla più vicina: la giornata con la tappa in più è già ricalcolata dal sito.
(() => {
  const D = window.DATI, FOTO = window.FOTO, M = window.MAPPA, ST = window.STRADE, PO = window.PORTICO;
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
    soglia: '<path d="M6 21V11a6 6 0 0 1 12 0v10"/><path d="M9.5 21v-8a2.5 2.5 0 0 1 5 0v8"/>',
    quadrante: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>'
  };
  const ic = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[n]}</svg>`;
  // il segnalibro di «Salva»: il contorno e il pieno che sale quando salvi
  const segnalibro = `<svg class="salva__ic" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="salva-clip"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></clipPath></defs><g clip-path="url(#salva-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path class="salva__spunta" d="M9 11.2l2.2 2.2 4-4.4" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ---------- il marchio, con l'animazione della home (DESIGN.md §7, src/components/Marchio.astro) ----------
  const LETTERE = [...'nextstop'];
  const firma = () => `<a class="firma${S.anima ? ' firma--anima' : ''}" href="#${S.p}"><span class="vh">nextstop</span><svg class="firma__segno segno--chiaro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${D.marchio.chiaro}</svg><svg class="firma__segno segno--scuro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${D.marchio.scuro}</svg><span class="firma__parola" aria-hidden="true">${LETTERE.map((c, i) => (i === 6
    ? `<span class="firma__pin" style="--i:${i}"><i class="firma__ombra"></i><svg viewBox="0 0 20 28" focusable="false">${D.marchio.spillo}</svg><i class="firma__onda"></i></span>`
    : `<span class="firma__l" style="--i:${i}">${c}</span>`)).join('')}<span class="firma__rotta"></span></span></a>`;

  // ---------- stato della prova ----------
  const S = { p: 'a', g: 0, vista: 'elenco', salvato: false, agg: [null, null], extra: false, attiva: null, nuova: null, anima: true, fini: {} };
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
  const totali = () => {
    const gg = range(D.giorni.length).map(G);
    return { giorni: nG(), tappe: gg.reduce((s, x) => s + tappe(x).length, 0), piedi: gg.reduce((s, x) => s + x.spostamenti, 0), metri: gg.reduce((s, x) => s + x.metri, 0) };
  };
  const suggerite = (g, n = 3) => (g < D.giorni.length ? D.vicine[g].filter(id => id !== S.agg[g]).slice(0, n) : []);
  const crediti = () => `<details class="crediti"><summary>Crediti delle foto e della mappa</summary><p>Mappa: dati © i contributori di OpenStreetMap (ODbL). Pietra del portico: disegnata con il codice. Foto: ${Object.entries(D.crediti).map(([id, c]) => `${esc(T(id)?.breve ?? id)}, ${esc(c.autore)} (${esc(c.licenza)})`).join('; ')}.</p></details>`;

  // =====================================================================================
  // La mappa: la mappa del sito (OpenStreetMap), più le strade piccole della zona (vicoli, pedonali, scale) e i nomi delle vie.
  // I segni e i tratti restano della stessa misura; il percorso si disegna tratto dopo tratto.
  // =====================================================================================
  let nMappe = 0;
  const numeri = d => (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  function riquadroDi(lista) {
    const pts = [];
    for (const Gx of lista) {
      for (const v of tappe(Gx)) pts.push(v.xy);
      for (const l of Gx.linee) { const n = numeri(l.d); for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]); }
    }
    if (!pts.length) return { x1: 1850, x2: 2050, y1: 500, y2: 900 };
    let x1 = Math.min(...pts.map(p => p[0])), x2 = Math.max(...pts.map(p => p[0])), y1 = Math.min(...pts.map(p => p[1])), y2 = Math.max(...pts.map(p => p[1]));
    const minimo = 110;
    if (x2 - x1 < minimo) { const c = (x1 + x2) / 2; x1 = c - minimo / 2; x2 = c + minimo / 2; }
    if (y2 - y1 < minimo) { const c = (y1 + y2) / 2; y1 = c - minimo / 2; y2 = c + minimo / 2; }
    return { x1, x2, y1, y2 };
  }
  class Mappa {
    constructor(el, opz = {}) {
      this.el = el; this.opz = opz; this.tappe = []; this.vb = null; this.fuoco = null; this.n = ++nMappe;
      el.classList.add('m');
      const nomi = ST.etichette.map((e, i) => `<path id="m${this.n}n${i}" d="${e.d}"/><text class="m-nome" data-l="${e.L}" data-c="${e.nome.length}"><textPath href="#m${this.n}n${i}" startOffset="50%" text-anchor="middle">${esc(e.nome)}</textPath></text>`).join('');
      el.innerHTML = `<svg class="m-svg" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <rect class="m-terra" x="-6000" y="-6000" width="16000" height="16000"/><path class="m-mare" d="${M.mare}"/><path class="m-isole" d="${M.isole}"/><path class="m-parco" d="${M.parchi}"/>
        <path class="m-s0" d="${M.strade[0]}"/><path class="m-s1c" d="${M.strade[1]}"/><path class="m-s2c" d="${M.strade[2]}"/><path class="m-s1" d="${M.strade[1]}"/><path class="m-s2" d="${M.strade[2]}"/><path class="m-moli" d="${M.moli}"/>
        <g class="m-fine"><path class="m-vicoli" d="${ST.vicoli}"/><path class="m-pedonali" d="${ST.pedonali}"/><path class="m-medie-c" d="${ST.medie}"/><path class="m-grandi-c" d="${ST.grandi}"/><path class="m-medie" d="${ST.medie}"/><path class="m-grandi" d="${ST.grandi}"/><path class="m-scale" d="${ST.scale}"/></g>
        <g class="m-nomi">${nomi}</g>
        <g class="m-altre"></g><g class="m-rotta"></g><g class="m-fili"></g></svg><div class="m-segni"></div><p class="m-osm">© OpenStreetMap</p>`;
      this.svg = $('svg', el);
      this.nomi = $$('.m-nome', el);
      this.ro = new ResizeObserver(() => { if (this.box) this.adatta(false); });
      this.ro.observe(el);
    }
    // daLinea: si disegnano solo i tratti da quello in poi (una tappa appena aggiunta); senza, tutto il percorso
    disegna(Gx, { altre = [], vola = false, n = null, disegna = true, daLinea = null } = {}) {
      this.nuoveDa = disegna && piano() ? (daLinea ?? 0) : Infinity;
      $('.m-altre', this.svg).innerHTML = altre.map(a => a.G.linee.map(l => `<path class="m-altra" style="--col:${a.col}" d="${l.d}"/>`).join('')).join('');
      $('.m-rotta', this.svg).innerHTML = Gx ? Gx.linee.map((l, i) => { const nu = i >= this.nuoveDa ? ' m-nuova' : ''; return `<path class="m-c${nu}" d="${l.d}"/><path class="m-l${nu}" d="${l.d}"/>`; }).join('') : '';
      this.tappe = Gx ? tappe(Gx) : [];
      this.box = riquadroDi(Gx ? [Gx] : altre.map(a => a.G));
      this.fuoco = null;
      this.el.setAttribute('role', 'group');
      this.el.setAttribute('aria-label', Gx ? `Mappa del giorno ${n ?? S.g + 1}: ${this.tappe.length} tappe collegate nell'ordine` : 'Mappa: il giorno è vuoto');
      $('.m-segni', this.el).innerHTML = this.tappe.map((v, i) => `<button type="button" class="m-segno${v.id === S.nuova ? ' m-segno--nuovo' : ''}" style="--i:${i}" data-id="${v.id}" aria-label="${v.n}. ${esc(T(v.id).nome)}, alle ${ora(v.inizio)}"><span>${v.n}</span></button>`).join('');
      $$('.m-segno', this.el).forEach(b => { b.onclick = () => this.opz.tocca?.(b.dataset.id); });
      this.daDisegnare = this.nuoveDa !== Infinity;
      this.adatta(vola);
    }
    vbPer(box) {
      const W = this.el.clientWidth || 1, H = this.el.clientHeight || 1;
      const p = this.opz.margini ? this.opz.margini() : { t: 44, r: 36, b: 44, l: 36 };
      let s = Math.min((W - p.l - p.r) / (box.x2 - box.x1), (H - p.t - p.b) / (box.y2 - box.y1));
      s = Math.max(Math.min(s, this.fuoco ? 7 : 3.6), 0.15);   // un giorno compatto non si ingrandisce troppo: si vede anche intorno
      const cx = (box.x1 + box.x2) / 2, cy = (box.y1 + box.y2) / 2;
      const px = p.l + (W - p.l - p.r) / 2, py = p.t + (H - p.t - p.b) / 2;
      return { x: cx - px / s, y: cy - py / s, w: W / s, h: H / s };
    }
    adatta(vola) {
      const fine = this.vbPer(this.fuoco || this.box);
      cancelAnimationFrame(this.raf);
      const finito = () => { this.nomiVisibili(); if (this.daDisegnare) { this.daDisegnare = false; this.traccia(); } };
      if (!vola || !this.vb || !piano()) { this.metti(fine); finito(); return; }
      const da = this.vb, t0 = performance.now(), dur = 700;
      const passo = now => {
        const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        this.metti({ x: da.x + (fine.x - da.x) * e, y: da.y + (fine.y - da.y) * e, w: da.w + (fine.w - da.w) * e, h: da.h + (fine.h - da.h) * e });
        if (k < 1) this.raf = requestAnimationFrame(passo); else finito();
      };
      this.raf = requestAnimationFrame(passo);
    }
    metti(vb) {
      this.vb = vb;
      const W = this.el.clientWidth || 1, s = W / vb.w;
      this.svg.setAttribute('viewBox', `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`);
      this.svg.style.setProperty('--u', (1 / s).toFixed(4));
      this.svg.classList.toggle('m--lontano', s < 1.4);
      this.s = s;
      this.segni();
    }
    // i nomi delle vie solo dove ci stanno
    nomiVisibili() { for (const t of this.nomi) t.classList.toggle('m-nome--su', +t.dataset.l * this.s > +t.dataset.c * 6.4 + 36 && this.s > 1.4); }
    // il percorso si disegna tratto dopo tratto (con «riduci movimento» è già tutto al suo posto)
    traccia() {
      const sel = this.opz.traccia || '.m-l';
      const linee = $$(`${sel}.m-nuova`, this.svg);
      if (this.opz.traccia) $$('.m-l.m-nuova', this.svg).forEach((p, i) => p.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 300 + i * 110, fill: 'backwards' }));
      $$('.m-nuova', this.svg).forEach(p => p.classList.remove('m-nuova'));
      linee.forEach((p, i) => {
        const L = p.getTotalLength() * this.s;
        p.style.setProperty('--len', `${L.toFixed(1)}px`);
        p.animate?.([{ strokeDasharray: `0 ${L + 40}px` }, { strokeDasharray: `${L + 40}px 0` }], { duration: Math.min(900, 200 + L * 2.2), delay: i * 110, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'backwards' });
      });
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
      this.adatta(true);
      this.evidenzia(id);
    }
    tutto() { this.fuoco = null; this.adatta(true); this.evidenzia(null); }
    evidenzia(id) { $$('.m-segno', this.el).forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id))); }
    spegni() { this.ro.disconnect(); cancelAnimationFrame(this.raf); }
  }

  // =====================================================================================
  // Il portico di piperno della home (src/lib/portico.mjs): un'arcata con la foto dietro
  // =====================================================================================
  const arcata = (k, foto, cl = '') => `<span class="arcata ${cl}" style="--pietra:url(${PO.pietra})">
      <span class="arcata__vano" style="left:${PO.VANO.left}%;top:${PO.VANO.top}%;width:${PO.VANO.width}%;height:${PO.VANO.height}%;border-radius:${PO.VANO.raggio}"><span class="arcata__fondo" style="border-radius:${PO.VANO.raggio}">${foto ? `<img class="arcata__foto" src="${foto}" alt="">` : ''}</span></span>
      <span class="arcata__muro${k % 2 ? ' arcata__muro--specchio' : ''}" style="-webkit-mask-image:${PO.MASCHERA.replace(/"/g, "&quot;")};mask-image:${PO.MASCHERA.replace(/"/g, "&quot;")}"></span>
      <svg class="arcata__pietra" viewBox="0 0 ${PO.W} ${PO.H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">${PO.arcate[k % PO.arcate.length]}</svg></span>`;

  // la sola cornice della porta (pilastri e arco), trasparente dentro e fuori: per le soglie di E, una dietro l'altra
  const portale = k => `<span class="arcata arcata--portale" style="--pietra:url(${PO.pietra})"><span class="arcata__muro${k % 2 ? ' arcata__muro--specchio' : ''}" style="-webkit-mask-image:${PO.ANELLO.replace(/"/g, "&quot;")};mask-image:${PO.ANELLO.replace(/"/g, "&quot;")}"></span><svg class="arcata__pietra" viewBox="0 0 ${PO.W} ${PO.H}" preserveAspectRatio="none" style="-webkit-mask-image:${PO.ANELLO.replace(/"/g, "&quot;")};mask-image:${PO.ANELLO.replace(/"/g, "&quot;")}" aria-hidden="true" focusable="false">${PO.arcate[k % PO.arcate.length]}</svg></span>`;

  // =====================================================================================
  // Pezzi comuni: foglio che sale (si chiude anche tirandolo giù), avviso in basso, numeri che scorrono
  // =====================================================================================
  const foglioEl = $('#foglio');
  function foglio(titolo, corpo, dopoAperto) {
    foglioEl.innerHTML = `<div class="f-testa"><span class="f-maniglia" aria-hidden="true"></span><h2 id="f-titolo">${esc(titolo)}</h2><button type="button" class="f-chiudi" aria-label="Chiudi">${ic('x')}</button></div><div class="f-corpo">${corpo}</div>`;
    $('.f-chiudi', foglioEl).onclick = () => chiudiFoglio();
    foglioEl.onclick = null;
    foglioEl.style.translate = '';
    if (!foglioEl.open) foglioEl.showModal();
    dopoAperto?.(foglioEl);
  }
  async function chiudiFoglio() {
    if (!foglioEl.open) return;
    if (piano()) { foglioEl.classList.add('f-esce'); await dopo(220); foglioEl.classList.remove('f-esce'); }
    foglioEl.close();
  }
  foglioEl.addEventListener('click', e => { if (e.target === foglioEl) chiudiFoglio(); });
  foglioEl.addEventListener('cancel', e => { e.preventDefault(); chiudiFoglio(); });
  // tirare giù dalla testa del foglio
  let tiro = null;
  foglioEl.addEventListener('pointerdown', e => { if (!e.target.closest('.f-testa') || e.target.closest('button')) return; tiro = { y: e.clientY, id: e.pointerId }; foglioEl.setPointerCapture(e.pointerId); });
  foglioEl.addEventListener('pointermove', e => { if (!tiro) return; const dy = Math.max(0, e.clientY - tiro.y); foglioEl.style.translate = `0 ${dy}px`; });
  foglioEl.addEventListener('pointerup', e => { if (!tiro) return; const dy = e.clientY - tiro.y; tiro = null; if (dy > 90) { foglioEl.style.translate = ''; foglioEl.close(); } else foglioEl.style.translate = ''; });

  let tempoAvviso;
  function avvisa(testo, azione) {
    const t = $('#toast');
    t.innerHTML = `<span>${esc(testo)}</span>${azione ? `<button type="button">${esc(azione.testo)}</button>` : ''}`;
    if (azione) $('button', t).onclick = () => { t.classList.remove('su'); azione.fai(); };
    t.classList.remove('su');
    void t.offsetWidth;
    t.classList.add('su');
    clearTimeout(tempoAvviso);
    tempoAvviso = setTimeout(() => t.classList.remove('su'), azione ? 6500 : 4000);
  }
  // l'ora di fine che scorre fino al valore nuovo (17:22 → 17:52) quando aggiungi o togli una tappa
  function contaFine() {
    const Gx = G(S.g);
    if (!Gx) return;
    const prima = S.fini[S.g];
    S.fini[S.g] = Gx.fine;
    if (prima == null || prima === Gx.fine || !piano()) return;
    const els = $$('[data-conta="fine"]');
    const t0 = performance.now(), dur = 900;
    const passo = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      const m = Math.round(prima + (Gx.fine - prima) * e);
      els.forEach(el => { el.textContent = ora(m); });
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  function apriScheda(id) {
    const t = T(id), Gx = G(S.g), v = Gx && tappe(Gx).find(x => x.id === id);
    foglio(t.nome, `${FOTO[id] ? `<img class="f-scheda-foto" src="${FOTO[id]}" alt="">` : ''}
      <p>${esc(t.frase)}</p>
      <ul class="f-fatti">
        ${v ? `<li>Nel giorno ${S.g + 1}: dalle ${ora(v.inizio)} alle ${ora(v.fine)}</li>` : ''}
        <li>Visita: ${durata(t.durata)}</li><li>${INGRESSO[t.ingresso] ?? ''}</li><li>${DENTRO[t.alChiuso] ?? ''}</li>
        ${etichette(id).map(e => `<li>${e}</li>`).join('')}
      </ul>
      ${S.agg[S.g] === id ? `<button type="button" class="f-bottone f-bottone--contorno" data-f="togli">Togli dal giorno ${S.g + 1}</button>` : ''}
      <p class="f-nota">Prova: la scheda vera della tappa (foto, orari, prezzi, storia e fonti) è il pezzo 2.</p>`, f => {
      f.onclick = e => { if (e.target === f) chiudiFoglio(); if (e.target.closest('[data-f="togli"]')) { chiudiFoglio(); togli(S.g); } };
    });
  }

  // ---------- «Aggiungi»: tutte le tappe, dalla più vicina ----------
  const FILTRI = [
    ['tutte', 'Tutte', () => true], ['musei', 'Musei', t => t.generi.some(g => g === 'museo' || g === 'archeologia')], ['chiese', 'Chiese', t => t.generi.includes('chiesa')],
    ['panorami', 'Panorami', t => t.generi.includes('panorama')], ['sotto', 'Sottoterra', t => t.generi.includes('sotterraneo')], ['verde', 'Parchi e mare', t => t.generi.some(g => g === 'parco' || g === 'mare')],
    ['passeggiate', 'Passeggiate', t => t.generi.includes('passeggiata')], ['gratis', 'Gratis', t => t.ingresso === 'gratis']
  ];
  function apriAggiungi() {
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
    foglio('Aggiungi una tappa', `<div class="f-cerca"><label class="vh" for="f-q">Cerca una tappa</label>${ic('cerca', 20)}<input id="f-q" type="search" placeholder="Cerca tra ${D.vicine[g].length} tappe" autocomplete="off" enterkeyhint="search"></div>
      <div class="f-filtri" role="group" aria-label="Che tipo di tappa">${FILTRI.map(([k, n]) => `<button type="button" aria-pressed="${k === filtro}" data-filtro="${k}">${n}</button>`).join('')}</div>
      <div id="f-elenco">${elenco()}</div>
      <p class="f-nota">Prova: le tappe vanno in fondo al giorno ${g + 1}, con i tempi veri; se ne aggiunge una per giorno. La ricerca vera (anche locali, gite e parole come «Cristo velato») è il pezzo 3.</p>`, f => {
      const aggiornaElenco = () => { $('#f-elenco', f).innerHTML = elenco(); };
      $('#f-q', f).addEventListener('input', e => { q = e.target.value.trim(); aggiornaElenco(); });
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const fb = e.target.closest('[data-filtro]');
        if (fb) { filtro = fb.dataset.filtro; $$('[data-filtro]', f).forEach(b => b.setAttribute('aria-pressed', String(b === fb))); aggiornaElenco(); return; }
        const b = e.target.closest('[data-f="agg"]');
        if (!b) return;
        const id = b.dataset.id;
        if (S.agg[g] === id) { chiudiFoglio(); togli(g); return; }
        b.classList.add('f-piu--dentro');
        b.innerHTML = ic('spunta', 20);
        await dopo(piano() ? 360 : 0);
        await chiudiFoglio();
        aggiungi(g, id);
      };
    });
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

  // ---------- «Salva»: il segnalibro si riempie, compare la spunta, la parola diventa «Salvato» ----------
  const bottoneSalva = (cl = '') => `<button type="button" class="salva ${cl}${S.salvato ? ' salva--fatto' : ''}" data-azione="salva">${segnalibro}<span class="salva__t"><span class="salva__a">Salva</span><span class="salva__b">Salvato</span></span></button>`;
  async function salva(b) {
    if (S.salvato) { apriMiei(); return; }
    S.salvato = true;
    const bottoni = $$('.salva');
    bottoni.forEach(x => x.classList.add('salva--fatto'));
    if (b) b.classList.add('salva--ora');
    $$('[data-stato]').forEach(x => { x.dataset.stato = 'salvato'; x.querySelector('.stato__t').textContent = 'Salvato in «I miei itinerari»'; });
    avvisa('Salvato in «I miei itinerari» come «Due giorni a Napoli».', { testo: 'Cambia nome', fai: () => avvisa('Prova: il nome si cambia con un tocco, è il pezzo 4.') });
  }
  const stato = () => `<span class="stato" data-stato="${S.salvato ? 'salvato' : 'bozza'}"><i aria-hidden="true"></i><span class="stato__t">${S.salvato ? 'Salvato in «I miei itinerari»' : 'Non ancora salvato'}</span></span>`;

  function apriMiei() {
    foglio('I miei itinerari', `<div class="f-lista"><div class="f-riga">${FOTO['monte-echia'] ? `<img src="${FOTO['monte-echia']}" alt="">` : ''}<div><b>Due giorni a Napoli</b><small>${nG()} giorni, ${totali().tappe} tappe</small></div><span class="f-segno">${S.salvato ? `${ic('spunta', 16)}Salvato` : 'Non ancora salvato'}</span></div></div>
      ${S.salvato ? '' : `<button type="button" class="f-bottone" data-f="salva">Salva questo itinerario</button>`}
      <p class="f-nota">Gli itinerari restano su questo telefono: niente account, niente iscrizione.</p>`, f => {
      f.onclick = e => { if (e.target === f) chiudiFoglio(); if (e.target.closest('[data-f="salva"]')) { chiudiFoglio(); salva(); } };
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
      <button type="button" class="f-azione" data-f="giorni">${ic('giorni')}<span>Tutti i giorni<small>${nG()} giorni, ${totali().tappe} tappe</small></span></button>
      <button type="button" class="f-azione" data-f="giorno">${ic('piu')}<span>Aggiungi un giorno</span></button>
      <button type="button" class="f-azione" data-f="quando">${ic('calendario')}<span>Data e orari<small>Senza data, dalle 9:30 alle 19:00</small></span></button>
    </div>`, f => {
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        await chiudiFoglio();
        ({ miei: apriMiei, condividi: apriCondividi, giorni: apriGiorni, giorno: nuovoGiorno, quando })[b.dataset.f]();
      };
    });
  }
  function apriGiorni() {
    foglio('I giorni', `<div class="f-azioni">${range(nG()).map(g => { const Gx = G(g); return `<button type="button" class="f-azione" data-f="g" data-g="${g}"><span class="f-num">${g + 1}</span><span>${Gx ? esc(titoloGiorno(Gx)) : 'Giorno vuoto'}${g === S.g ? ' (lo stai guardando)' : ''}<small>${Gx ? `Dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}, ${tappe(Gx).length} tappe` : 'Ancora nessuna tappa'}</small></span></button>`; }).join('')}
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
  function vaiAlGiorno(g) {
    if (g < 0 || g >= nG() || g === S.g) return;
    S.nuova = null;
    if (P[S.p].giorno) P[S.p].giorno(g); else P[S.p].aggiorna(() => { S.g = g; S.attiva = null; }, { giorno: true });
  }

  // =====================================================================================
  // Disegno della pagina e passaggi
  // =====================================================================================
  let mappa = null;
  function disegna() {
    const r = document.documentElement;
    r.classList.remove('pa', 'pc', 'pd', 'pe', 'pf');
    r.classList.add('p' + S.p);
    r.dataset.g = String(S.g);
    if (mappa) { mappa.spegni(); mappa = null; }
    smettiAscolti();   // gli ascolti della pagina di prima (scorrimento): dopo() rimette quelli giusti
    P[S.p].prima?.();
    $('#app').classList.toggle('apre', S.anima);
    $('#app').innerHTML = P[S.p].html();
    P[S.p].dopo?.();
    S.anima = false;
    prova();
    contaFine();
    // la tappa appena aggiunta: entra e si accende un momento, poi torna normale
    if (S.nuova) { const n = S.nuova; setTimeout(() => { if (S.nuova === n) { S.nuova = null; $$('.nuova').forEach(x => x.classList.remove('nuova')); } }, 2600); }
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
      if (S.nuova) { const el = $(`[data-id="${S.nuova}"].nuova, .nuova [data-id="${S.nuova}"]`) || $('.nuova'); if (el && !computer.matches) { const r = el.getBoundingClientRect(); if (r.top > innerHeight - 140 || r.bottom < 120) el.scrollIntoView({ block: 'center', behavior: piano() ? 'smooth' : 'auto' }); } }
    };
    if (document.startViewTransition && piano()) { const vt = document.startViewTransition(fai); vt.ready.catch(() => {}); vt.finished.catch(() => {}); } else fai();
  }

  const AZ = {
    giorno: b => vaiAlGiorno(+b.dataset.g),
    'nuovo-giorno': nuovoGiorno,
    'togli-giorno': () => P[S.p].aggiorna(() => { S.extra = false; S.g = Math.min(S.g, 1); }, { giorno: true }),
    vista: b => P[S.p].aggiorna(() => { S.vista = b.dataset.v; }),
    aggiungi: apriAggiungi,
    'aggiungi-subito': b => aggiungi(S.g, b.dataset.id),
    salva: b => salva(b),
    miei: apriMiei, condividi: apriCondividi, altro: apriAltro, quando, giorni: apriGiorni,
    menu: () => avvisa('Prova: qui si apre il menu del sito, quello di oggi.'),
    tappa: b => (P[S.p].tocca ? P[S.p].tocca(b.dataset.id) : apriScheda(b.dataset.id)),
    scheda: b => apriScheda(b.dataset.id),
    pronto: () => avvisa('Prova: gli altri itinerari pronti qui non si aprono.')
  };
  $('#app').addEventListener('click', e => {
    const b = e.target.closest('[data-azione]');
    if (b && !b.disabled) AZ[b.dataset.azione]?.(b, e);
  });
  $('#app').addEventListener('keydown', e => {
    const t = e.target.closest('[role="tab"]');
    if (!t || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const g = Math.max(0, Math.min(nG() - 1, S.g + (e.key === 'ArrowRight' ? 1 : -1)));
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
    setTimeout(() => o.remove(), 650);
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

  // =====================================================================================
  // A · LA RIVISTA
  // =====================================================================================
  const A = {
    nome: 'La rivista',
    idea: ['Come la home: il portico di piperno vero intorno alla foto, i titoli con le grazie, la linea a puntini color tufo che si disegna mentre scorri.',
      'In alto i numeri del viaggio (giorni, tappe, minuti a piedi). In fondo a ogni giorno il tempo libero che resta e le tre tappe più vicine, da aggiungere con un tocco.',
      'I comandi stanno in un\'«isola» blu notte sotto il pollice, che si fa piccola quando scorri giù. Sul computer la mappa sta a destra, dentro un arco di pietra.'],
    html() {
      const g = S.g, Gx = G(g), mappaTel = !computer.matches && S.vista === 'mappa', tot = totali();
      return `<header class="a-testata">${firma()}<button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></header>
      <div class="a-pagina"><div class="a-colonna">
        <section class="a-apertura" aria-labelledby="a-titolo">
          <div class="a-portale">${arcata(0, FOTO['monte-echia'], 'a-arcata')}</div>
          <h1 id="a-titolo">${esc(D.nome)}</h1>
          <div class="a-stato">${stato()}${bottoneSalva('a-salva onda')}</div>
          <dl class="a-cifre"><div><dt>giorni</dt><dd>${tot.giorni}</dd></div><div><dt>tappe</dt><dd>${tot.tappe}</dd></div><div><dt>minuti a piedi</dt><dd>${tot.piedi}</dd></div><div><dt>chilometri</dt><dd>${(tot.metri / 1000).toFixed(1).replace('.', ',')}</dd></div></dl>
          <div class="a-quando">${ic('calendario', 20)}<span>Senza data, dalle 9:30 alle 19:00</span><button type="button" data-azione="quando">Cambia</button></div>
        </section>
        <div class="a-giorni"><div class="a-schede" role="tablist" aria-label="Giorni dell'itinerario">${schedeGiorni()}</div><button type="button" class="a-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        <section class="a-giorno" data-inizio-giorno aria-labelledby="a-g">
          ${Gx ? `<h2 id="a-g">${esc(titoloGiorno(Gx))}</h2><p class="a-riassunto">${riassunto(Gx)}</p>` : `<h2 id="a-g">Una pagina bianca</h2>`}
          ${mappaTel ? '<div class="a-mappa-tel"><div id="mappa"></div></div>' : Gx ? this.giornata(Gx) : vuoto('a-vuoto', 'a-bottone')}
        </section>
        <div class="a-fine"></div>
        ${this.isola()}
      </div>
      ${computer.matches ? `<div class="a-destra"><div class="a-cornice">${arcata(3, '', 'a-arcata-mappa')}<div id="mappa" style="left:${PO.VANO.left}%;top:${PO.VANO.top}%;width:${PO.VANO.width}%;height:${PO.VANO.height}%;border-radius:${PO.VANO.raggio}"></div></div></div>` : ''}</div>${crediti()}`;
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
        <button type="button" class="onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi">${ic('altro')}</button>
      </nav>`;
    },
    dopo() {
      // l'isola si fa piccola quando scorri giù e torna grande quando risali
      let y0 = scrollY;
      ascolta('scroll', () => { const isola = $('.a-isola'); if (!isola) return; const y = scrollY; if (Math.abs(y - y0) > 8) { isola.classList.toggle('a-isola--piccola', y > y0 && y > 300); y0 = y; } });
      const el = $('#mappa');
      if (!el) return;
      mappa = new Mappa(el, { traccia: '.m-c', tocca: id => A.tocca(id), margini: () => (computer.matches ? { t: 190, r: 70, b: 80, l: 70 } : { t: 120, r: 34, b: 44, l: 34 }) });
      const Gx = G(S.g);
      mappa.disegna(Gx, { daLinea: S.nuova ? D.giorni[S.g].linee.length : null, altre: Gx ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
      if (S.attiva) mappa.evidenzia(S.attiva);
    },
    tocca(id) {
      S.attiva = id;
      $$('.a-scheda').forEach(b => b.toggleAttribute('aria-current', b.dataset.id === id));
      mappa?.evidenzia(id);
      apriScheda(id);
    },
    aggiorna: aggiornaTutto
  };

  // =====================================================================================
  // C · MAPPA PRIMA
  // =====================================================================================
  const C = {
    nome: 'Mappa prima',
    idea: ['La mappa è la pagina, ora con i vicoli, le scale e le strade pedonali di OpenStreetMap e i nomi delle vie: è la «strada A» della mappa (più strade nella mappa nostra), in prova.',
      'Il percorso si disegna tratto dopo tratto. L\'elenco è un foglio che sale con il dito e si ferma a metà o in alto; quando sale, la mappa si allontana un poco.',
      'Tocca una tappa: la mappa ci vola sopra. Cambi giorno: la mappa si sposta e ridisegna il percorso. Colori del marchio (pervinca).'],
    html() {
      return `<div class="c-mappa" id="c-mappa"><div id="mappa"></div></div>
      <header class="c-sopra"><button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button><div class="c-nome">${firma()}<h1>${esc(D.nome)}</h1>${stato()}</div>${bottoneSalva('c-salva onda')}</header>
      <div class="c-fumetto" id="fumetto" hidden></div>
      <div class="c-spazio" aria-hidden="true"></div>
      <section class="c-foglio" id="c-foglio" aria-label="Giornata">${this.foglio()}</section>
      <button type="button" class="c-torna onda" id="c-torna" data-azione="su-mappa" data-nascosto="true">${ic('mappa', 20)}Mappa</button>`;
    },
    foglio() {
      const Gx = G(S.g);
      return `<div class="c-barra" data-inizio-giorno><span class="c-maniglia" aria-hidden="true"></span>
        <div class="c-giorni"><div class="c-tabs" role="tablist" aria-label="Giorni dell'itinerario">${schedeGiorni()}</div><button type="button" class="c-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        <div class="c-riga-azioni"><p class="c-riassunto num">${Gx ? `<b>${ora(Gx.inizio)} – <span data-conta="fine">${ora(Gx.fine)}</span></b>${tappe(Gx).length} tappe, ${Gx.spostamenti} min a piedi, ${metri(Gx.metri)}` : '<b>Giorno vuoto</b>Aggiungi la prima tappa'}</p>
          <button type="button" class="c-azione c-azione--piena onda" data-azione="aggiungi">${ic('piu', 20)}Aggiungi</button>
          <button type="button" class="c-azione onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi">${ic('altro')}</button></div>
      </div>
      ${Gx ? `<ol class="c-elenco">${Gx.voci.map(v => v.tipo === 'tratto'
        ? `<li class="c-tratto"><i aria-hidden="true"></i><span>${ic('piedi', 15)}${testoTratto(v)}</span></li>`
        : `<li class="c-riga${v.id === S.nuova ? ' nuova' : ''}"><button type="button" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="c-n">${v.n}</span><span class="c-tit"><span class="c-ora num">${ora(v.inizio)} – ${ora(v.fine)}</span>${esc(T(v.id).nome)}${etichette(v.id).length ? `<small>${etichette(v.id).join(', ')}</small>` : ''}</span>${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : '<span></span>'}</button></li>`).join('')}</ol>
        ${liberoBlocco(Gx, 'c-libero')}` : vuoto('c-vuoto', 'c-azione')}
      ${crediti()}`;
    },
    margini() {
      if (computer.matches) return { t: 90, r: 70, b: 70, l: 500 };
      const el = $('#mappa'), sp = $('.c-spazio');
      const visibile = sp ? sp.offsetHeight : 300;
      return { t: 112, r: 36, b: Math.max(60, (el?.clientHeight || 600) - visibile + 40), l: 36 };
    },
    dopo() {
      mappa = new Mappa($('#mappa'), { tocca: id => C.tocca(id, { daMappa: true }), margini: () => C.margini(), distanza: 36 });
      this.disegnaMappa(false);
      const torna = $('#c-torna'), carta = $('#c-mappa');
      // quando il foglio sale la mappa si allontana un poco; il pulsante «Mappa» compare quando la mappa è coperta
      ascolta('scroll', () => {
        const sp = $('.c-spazio');
        if (!sp || computer.matches) return;
        const k = Math.max(0, Math.min(1, scrollY / Math.max(1, sp.offsetHeight)));
        carta.style.setProperty('--su', k.toFixed(3));
        torna.dataset.nascosto = String(k < .8);
      });
    },
    disegnaMappa(vola, daLinea = null) {
      const Gx = G(S.g);
      mappa.disegna(Gx, { vola, daLinea, altre: Gx ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
      if (S.attiva) mappa.evidenzia(S.attiva);
    },
    // il giorno cambia senza ridisegnare la mappa: la mappa vola sul giorno nuovo e ridisegna il percorso
    giorno(g) {
      S.g = g; S.attiva = null;
      document.documentElement.dataset.g = String(g);
      $('#fumetto').hidden = true;
      const fai = () => { $('#c-foglio').innerHTML = this.foglio(); };
      if (document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
      this.disegnaMappa(true);
      contaFine();
    },
    aggiorna(fn, opz = {}) {
      const prima = S.g;
      fn();
      if (!mappa) { disegna(); return; }
      document.documentElement.dataset.g = String(S.g);
      $('#c-foglio').innerHTML = this.foglio();
      const cambiato = prima !== S.g || !!opz.giorno;
      this.disegnaMappa(cambiato || !!S.nuova, cambiato ? null : S.nuova ? D.giorni[S.g].linee.length : Infinity);
      contaFine();
      prova();
    },
    tocca(id, { daMappa = false } = {}) {
      S.attiva = id;
      $$('.c-riga button').forEach(b => b.toggleAttribute('aria-current', b.dataset.id === id));
      const Gx = G(S.g), v = Gx && tappe(Gx).find(x => x.id === id);
      if (!v) return;
      const f = $('#fumetto');
      f.innerHTML = `${FOTO[id] ? `<img src="${FOTO[id]}" alt="">` : `<span class="c-n" aria-hidden="true">${v.n}</span>`}<div><b>${esc(T(id).nome)}</b><small class="num">${ora(v.inizio)} – ${ora(v.fine)}, ${durata(T(id).durata)}</small></div><button type="button" class="c-azione onda" data-azione="scheda" data-id="${id}">Scheda</button><button type="button" class="c-azione onda" data-azione="tutto-giorno" aria-label="Mostra tutto il giorno">${ic('x', 20)}</button>`;
      f.hidden = false;
      if (!computer.matches && !daMappa && scrollY > 0) scrollTo({ top: 0, behavior: piano() ? 'smooth' : 'auto' });
      mappa.centra(id);
    }
  };
  AZ['su-mappa'] = () => scrollTo({ top: 0, behavior: piano() ? 'smooth' : 'auto' });
  AZ['tutto-giorno'] = () => { S.attiva = null; $('#fumetto').hidden = true; $$('.c-riga button').forEach(b => b.removeAttribute('aria-current')); mappa?.tutto(); };

  // =====================================================================================
  // D · LE PAGINE
  // =====================================================================================
  const PASSO = 64;
  const filo = '<svg class="filo" viewBox="0 0 26 52" aria-hidden="true"><path d="M13 3c-9 7 9 13 0 23s9 16 0 23" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray=".5 5.5" stroke-linecap="round"/></svg>';
  const Dp = {
    nome: 'Le pagine',
    idea: ['Un giorno è una pagina: si sfoglia con il dito. Il numero grande del giorno scorre più piano della pagina, come se fosse più lontano.',
      'Le tappe sono cartoline con il timbro dell\'ora; i tratti a piedi scritti a mano. In fondo, le cartoline delle tappe più vicine da aggiungere con un tocco.',
      'La barra a icone in basso si nasconde quando scorri giù e torna quando risali. Sul computer diventa una colonna a sinistra, con la mappa incorniciata a destra.'],
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
        <button type="button" class="onda" data-azione="condividi">${ic('condividi')}Condividi</button>
      </nav>${crediti()}`;
    },
    pagina(g) {
      const Gx = G(g), qui = g === S.g;
      const voci = Gx ? Gx.voci.map(v => {
        if (v.tipo === 'tratto') return `<div class="d-tratto">${filo}<span>${testoTratto(v)}</span></div>`;
        const t = T(v.id);
        return `<button type="button" class="d-cartolina${v.id === S.nuova ? ' nuova' : ''}" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="d-foto">${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : `<span class="d-senza" aria-hidden="true">${esc(t.breve)}</span>`}<span class="d-timbro-ora num" aria-hidden="true">${ora(v.inizio)}</span></span><span class="d-cartolina__testo"><span class="d-cartolina__ora num"><span class="vh">Alle </span>${ora(v.inizio)}<small>${durata(t.durata)}</small></span><b>${esc(t.nome)}</b><span class="d-frase">${esc(t.frase)}</span>${etichette(v.id).map(e => `<span class="d-et">${e}</span>`).join('')}</span></button>`;
      }).join('') : '';
      const sug = Gx ? suggerite(g) : [];
      const l = Gx ? libero(Gx) : 0;
      return `<section class="d-pagina${qui ? ' attiva' : ''}" data-pagina="${g}" aria-label="Giorno ${g + 1}"${qui ? ' data-inizio-giorno' : ' inert'}><h2>${ORDINALE[g]} giorno<small>${Gx ? esc(titoloGiorno(Gx)) : 'ancora vuoto'}</small></h2>
        ${Gx ? `<p class="d-riassunto">${riassunto(Gx)}</p><div class="d-cartoline">${voci}</div>
          ${l > 0 ? `<div class="d-libero"><p>${resta(l)} prima delle ${ora(Gx.fineScelta)}: c'è spazio per un'altra cartolina.</p>
            <ul class="d-sug">${sug.map(id => `<li><button type="button" class="d-sug__c onda" data-azione="aggiungi-subito" data-id="${id}">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" loading="lazy">` : '<span class="d-senza"></span>'}<b>${esc(T(id).breve)}</b><small class="num">${D.aggiunte[g][id].tratto.min} min a piedi</small><span class="d-sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>
            <button type="button" class="d-bottone d-bottone--contorno onda" data-azione="aggiungi">Vedi tutte le ${D.vicine[g].length} tappe</button></div>` : liberoBlocco(Gx, 'd-libero')}` : vuoto('d-vuoto', 'd-bottone')}
        <div class="d-dopo"></div></section>`;
    },
    dopo() {
      const pag = $('#d-pagine');
      const pc = computer.matches;
      // la barra a icone si nasconde quando scorri giù
      let y0 = scrollY;
      ascolta('scroll', () => { const tab = $('.d-tab'); if (!tab || computer.matches) return; const y = scrollY; if (Math.abs(y - y0) > 8) { tab.classList.toggle('d-tab--via', y > y0 && y > 260); y0 = y; } });
      if (pc) {
        mappa = new Mappa($('#mappa'), { tocca: id => Dp.tocca(id), margini: () => ({ t: 60, r: 56, b: 56, l: 56 }) });
        mappa.disegna(G(S.g), { daLinea: S.nuova ? D.giorni[S.g].linee.length : null, altre: G(S.g) ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
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
    // il numero grande di ogni pagina scorre più piano della pagina
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
    tocca(id) {
      S.attiva = id;
      $$('.d-cartolina').forEach(b => b.toggleAttribute('aria-current', b.dataset.id === id));
      mappa?.evidenzia(id);
      apriScheda(id);
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
    mappaD = new Mappa($('#mappa-d'), { tocca: id => apriScheda(id), margini: () => ({ t: 44, r: 36, b: 44, l: 36 }) });
    const Gx = G(S.g);
    mappaD.disegna(Gx, { altre: Gx ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
    $('[data-azione="chiudi-mappa"]', s).focus();
  };
  AZ['chiudi-mappa'] = () => { const s = $('#d-strato'); if (s) s.hidden = true; mappaD?.spegni(); mappaD = null; $('.d-tab__mappa')?.setAttribute('aria-pressed', 'false'); $('.d-tab__mappa')?.focus(); };
  addEventListener('keydown', e => { if (e.key === 'Escape' && $('#d-strato') && !$('#d-strato').hidden) AZ['chiudi-mappa'](); });

  // =====================================================================================
  // E · LA SOGLIA (astratta): le tappe sono arcate di piperno una dietro l'altra; scorrendo le attraversi
  // =====================================================================================
  const E = {
    nome: 'La soglia',
    idea: ['Astratta: il segno del marchio, sei soglie una dentro l\'altra, diventa la pagina. Ogni tappa è un\'arcata di piperno con la sua foto; dietro, più piccole, quelle che vengono dopo.',
      'Scorrendo con il dito attraversi le arcate: passi la soglia e sei alla tappa dopo, e tra una e l\'altra leggi il tratto a piedi. Alla fine resta una soglia aperta: il tempo libero.',
      'Per comporre c\'è «Elenco» nella barra, con tutte le tappe una sotto l\'altra. Con «riduci movimento» le arcate restano ferme e si cambia tappa con le frecce.'],
    prima() { if (S.vista !== 'mappa' && S.vista !== 'lista') S.vista = 'soglie'; },
    html() {
      const Gx = G(S.g), pc = computer.matches, lista = S.vista === 'lista', mappaTel = !pc && S.vista === 'mappa';
      const voci = Gx ? tappe(Gx) : [];
      return `<div class="e-tutto"><div class="e-sinistra">
        <header class="e-testata">${firma()}<div class="e-nome"><h1>${esc(D.nome)}</h1>${stato()}</div>${bottoneSalva('e-salva onda')}</header>
        ${mappaTel ? '<div class="e-mappa-tel"><div id="mappa"></div></div>' : lista || !Gx ? this.lista(Gx) : `<section class="e-corsa" id="e-corsa" data-inizio-giorno aria-label="Le tappe del giorno ${S.g + 1}" style="--n:${voci.length}">
          <div class="e-palco" id="e-palco">
            <div class="e-foto" aria-hidden="true">${voci.map((v, i) => (FOTO[v.id] ? `<img data-i="${i}" src="${FOTO[v.id]}" alt="">` : `<span class="e-foto__senza" data-i="${i}">${esc(T(v.id).breve)}</span>`)).join('')}<span class="e-foto__fine" data-i="${voci.length}"></span></div>
            <div class="e-soglie" aria-hidden="true">${[...voci, null].map((v, i) => `<div class="e-soglia${v && v.id === S.nuova ? ' nuova' : ''}" data-i="${i}">${portale(i + S.g * 3)}</div>`).join('')}</div>
            <div class="e-didascalie">${voci.map((v, i) => `<div class="e-dida" data-i="${i}"><p class="e-ora num">${ora(v.inizio)}</p><h2><button type="button" data-azione="tappa" data-id="${v.id}">${esc(T(v.id).nome)}</button></h2><p class="e-meta">${durata(T(v.id).durata)}, fino alle ${ora(v.fine)}${etichette(v.id).length ? `. ${etichette(v.id).join('. ')}` : ''}</p></div>`).join('')}
              <div class="e-dida e-dida--fine" data-i="${voci.length}"><p class="e-ora num" data-conta="fine">${ora(Gx.fine)}</p><h2>${libero(Gx) > 0 ? `${resta(libero(Gx))}` : 'Fine del giorno'}</h2><p class="e-meta">${libero(Gx) > 0 ? `prima delle ${ora(Gx.fineScelta)}. ` : ''}<button type="button" class="e-link" data-azione="aggiungi">Aggiungi una tappa</button></p></div>
              ${Gx.voci.filter(v => v.tipo === 'tratto').map((v, i) => `<p class="e-tratto num" data-i="${i}">${ic('piedi', 16)}${testoTratto(v)}</p>`).join('')}</div>
            <ol class="e-rotaia" aria-label="Tappe del giorno">${voci.map((v, i) => `<li><button type="button" data-salta="${i}" aria-label="Vai alla tappa ${i + 1}: ${esc(T(v.id).breve)}"><span>${i + 1}</span></button></li>`).join('')}</ol>
            <div class="e-frecce"><button type="button" class="tondo onda" data-salta="-1" aria-label="Tappa prima">${ic('indietro')}</button><button type="button" class="tondo onda" data-salta="+1" aria-label="Tappa dopo">${ic('avanti')}</button></div>
          </div></section>`}
        ${this.barra()}
      </div>${pc ? '<div class="e-destra"><div id="mappa"></div></div>' : ''}</div>${crediti()}`;
    },
    lista(Gx) {
      if (!Gx) return `<section class="e-lista" data-inizio-giorno>${vuoto('e-vuoto', 'e-bottone')}</section>`;
      return `<section class="e-lista" data-inizio-giorno aria-labelledby="e-g"><h2 id="e-g">${ORDINALE[S.g]} giorno<small>${esc(titoloGiorno(Gx))}</small></h2><p class="e-riassunto">${riassunto(Gx)}</p>
        <ol>${Gx.voci.map(v => v.tipo === 'tratto' ? `<li class="e-l-tratto">${ic('piedi', 15)}${testoTratto(v)}</li>` : `<li class="e-l-tappa${v.id === S.nuova ? ' nuova' : ''}"><button type="button" data-azione="tappa" data-id="${v.id}"><span class="e-l-arco">${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : ''}</span><span><span class="e-ora num">${ora(v.inizio)}</span><b>${esc(T(v.id).nome)}</b><small>${durata(T(v.id).durata)}</small></span></button></li>`).join('')}</ol>
        ${liberoBlocco(Gx, 'e-libero')}</section>`;
    },
    barra() {
      const v = S.vista;
      return `<nav class="e-barra" aria-label="Comandi dell'itinerario"><div class="e-giorni"><div class="e-tabs" role="tablist" aria-label="Giorni">${range(nG()).map(g => `<button type="button" role="tab" class="onda" aria-selected="${g === S.g}" data-azione="giorno" data-g="${g}" aria-label="Giorno ${g + 1}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 22V11a8 8 0 0 1 16 0v11"/><path d="M8 22v-9a4 4 0 0 1 8 0v9"/></svg><span>${g + 1}</span></button>`).join('')}</div><button type="button" class="e-piu-g onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 18)}</button></div>
        <div class="e-azioni"><button type="button" class="onda" data-azione="vista" data-v="${v === 'lista' ? 'soglie' : 'lista'}" aria-label="${v === 'lista' ? 'Soglie' : 'Elenco'}">${ic(v === 'lista' ? 'soglia' : 'elenco')}</button>${computer.matches ? '' : `<button type="button" class="onda" data-azione="vista" data-v="${v === 'mappa' ? 'soglie' : 'mappa'}" aria-label="${v === 'mappa' ? 'Soglie' : 'Mappa'}">${ic(v === 'mappa' ? 'soglia' : 'mappa')}</button>`}<button type="button" class="e-aggiungi onda" data-azione="aggiungi" aria-label="Aggiungi una tappa">${ic('piu')}</button><button type="button" class="onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi">${ic('altro')}</button></div></nav>`;
    },
    dopo() {
      const el = $('#mappa');
      if (el) {
        mappa = new Mappa(el, { tocca: id => apriScheda(id), margini: () => ({ t: 50, r: 50, b: 50, l: 50 }) });
        const Gx = G(S.g);
        mappa.disegna(Gx, { daLinea: S.nuova ? D.giorni[S.g].linee.length : null, altre: Gx ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
      }
      const corsa = $('#e-corsa');
      if (!corsa) return;
      const n = tappe(G(S.g)).length;
      this.p = 0;
      const metti = p => {
        this.p = p;
        const muovi = piano();
        $$('.e-soglia', corsa).forEach(s => {
          const d = +s.dataset.i - p;
          let scala, op, buio;
          if (d >= 0) { scala = Math.pow(0.8, d); op = d > 5 ? 0 : 1; buio = Math.min(.72, d * .2); }
          else { scala = 1 + (-d) * 1.6; op = Math.max(0, 1 + d * 1.7); buio = 0; }
          if (!muovi) { scala = d === 0 ? 1 : d > 0 ? Math.pow(0.8, d) : 1; op = d < 0 ? 0 : d > 5 ? 0 : 1; }
          s.style.transform = `scale(${scala.toFixed(4)})`;
          s.style.opacity = op.toFixed(3);
          s.style.setProperty('--luce', (1 - buio).toFixed(3));
          s.style.zIndex = String(100 - Math.round(d * 10));
          s.style.visibility = op <= .01 ? 'hidden' : 'visible';
        });
        $$('.e-foto > *', corsa).forEach(f => { const d = +f.dataset.i - p; f.style.opacity = Math.max(0, Math.min(1, 1 - Math.abs(d) * 1.15)).toFixed(3); if (muovi) f.style.transform = `scale(${(1.06 + Math.max(-1, Math.min(1, -d)) * .06).toFixed(4)})`; });
        const vicino = Math.round(p);
        $$('.e-dida', corsa).forEach(x => { const d = Math.abs(+x.dataset.i - p); x.style.opacity = Math.max(0, 1 - d * 2.6).toFixed(3); x.style.transform = `translateY(${((+x.dataset.i - p) * 26).toFixed(1)}px)`; x.classList.toggle('su', +x.dataset.i === vicino); x.inert = +x.dataset.i !== vicino; });
        $$('.e-tratto', corsa).forEach(x => { const d = Math.abs(+x.dataset.i + .5 - p); x.style.opacity = Math.max(0, 1 - d * 3.2).toFixed(3); });
        $$('.e-rotaia button', corsa).forEach((b, i) => b.toggleAttribute('aria-current', i === vicino));
      };
      this.metti = metti;
      const daScorrere = () => {
        const r = corsa.getBoundingClientRect(), passo = innerHeight * .62, cima = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--prova')) || 48;
        const p = Math.max(0, Math.min(n, (cima - r.top) / passo));
        metti(piano() ? p : Math.round(p));
      };
      if (piano()) ascolta('scroll', daScorrere);
      daScorrere();
      corsa.addEventListener('click', e => {
        const b = e.target.closest('[data-salta]');
        if (!b) return;
        const v = b.dataset.salta, dove = v === '-1' ? Math.round(this.p) - 1 : v === '+1' ? Math.round(this.p) + 1 : +v;
        const i = Math.max(0, Math.min(n, dove));
        if (!piano()) { metti(i); return; }
        const top = corsa.getBoundingClientRect().top + scrollY + i * innerHeight * .62 + 1;
        scrollTo({ top, behavior: 'smooth' });
      });
      if (S.nuova) { const i = tappe(G(S.g)).findIndex(v => v.id === S.nuova); if (i >= 0) setTimeout(() => { const top = corsa.getBoundingClientRect().top + scrollY + i * innerHeight * .62 + 1; scrollTo({ top, behavior: piano() ? 'smooth' : 'auto' }); }, 350); }
    },
    aggiorna: aggiornaTutto
  };

  // =====================================================================================
  // F · IL QUADRANTE (astratta): la giornata su un orologio vero; la lancetta segue la tappa che leggi
  // =====================================================================================
  const CX = 160, CY = 160;
  const angolo = m => ((m / 60) % 12) * 30;                                  // minuti del giorno → gradi sul quadrante di 12 ore
  const punto = (r, a) => [CX + r * Math.sin(a * Math.PI / 180), CY - r * Math.cos(a * Math.PI / 180)];
  const arco = (r, m1, m2) => {
    const a1 = angolo(m1), a2 = a1 + (m2 - m1) / 2;   // 2 minuti = 1 grado
    const [x1, y1] = punto(r, a1), [x2, y2] = punto(r, a2);
    return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };
  const F = {
    nome: 'Il quadrante',
    idea: ['Astratta: la giornata disegnata su un orologio vero, dalle 9:30 alle 19. Ogni tappa è un arco, i tratti a piedi sono puntini, il tempo libero è l\'arco tratteggiato prima delle 19.',
      'La lancetta rossa segue la tappa che stai leggendo: scorri l\'elenco e la lancetta si muove; al centro c\'è la foto. Cambi giorno e gli archi si ridisegnano.',
      'Un orologio da polso, bianco smaltato (nero di sera): numeri sottili, tacche fini, un solo colore forte.'],
    html() {
      const Gx = G(S.g), pc = computer.matches, mappaTel = !pc && S.vista === 'mappa';
      return `<div class="f-tutto"><div class="f-sinistra">
        <header class="f-testata">${firma()}<button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></header>
        <div class="f-titolo"><h1>${esc(D.nome)}</h1><div class="f-stato">${stato()}${bottoneSalva('f-salva onda')}</div></div>
        <div class="f-giorni"><div class="f-tabs" role="tablist" aria-label="Giorni dell'itinerario">${schedeGiorni('onda')}</div><button type="button" class="f-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        <div class="f-quadro" id="f-quadro" data-inizio-giorno>${this.quadrante(Gx)}</div>
        ${mappaTel ? '<div class="f-mappa-tel"><div id="mappa"></div></div>' : Gx ? this.elenco(Gx) : vuoto('f-vuoto', 'f-bottone')}
        ${this.barra()}
      </div>${pc ? '<div class="f-destra"><div id="mappa"></div></div>' : ''}</div>${crediti()}`;
    },
    quadrante(Gx) {
      let tacche = '';
      for (let i = 0; i < 60; i++) { const a = i * 6, ora5 = i % 5 === 0, [x1, y1] = punto(ora5 ? 128 : 134, a), [x2, y2] = punto(141, a); tacche += `<line class="${ora5 ? 'q-tacca5' : 'q-tacca'}" x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`; }
      const numeriQ = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => { const [x, y] = punto(115, i * 30); return `<text class="q-num" x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle">${h}</text>`; }).join('');
      let archi = '', segni = '';
      if (Gx) {
        let i = 0;
        for (const v of Gx.voci) {
          if (v.tipo !== 'tappa') continue;
          archi += `<path class="q-tappa${v.id === S.nuova ? ' nuova' : ''}" style="--k:${i}" d="${arco(150, v.inizio, v.fine)}"/>`;
          const [x, y] = punto(150, angolo(v.inizio) + (v.fine - v.inizio) / 4);
          segni += `<g class="q-segno" style="--k:${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8.5"/><text x="${x.toFixed(1)}" y="${(y + 3.6).toFixed(1)}" text-anchor="middle">${v.n}</text></g>`;
          i++;
        }
        const t = Gx.voci;
        for (let k = 0; k < t.length; k++) if (t[k].tipo === 'tratto') archi += `<path class="q-piedi" d="${arco(150, t[k - 1].fine, t[k + 1].inizio)}"/>`;
        if (libero(Gx) > 0) archi += `<path class="q-libero" d="${arco(150, Gx.fine, Gx.fineScelta)}"/>`;
        const [ix, iy] = punto(150, angolo(Gx.inizio)), [fx, fy] = punto(150, angolo(Gx.fineScelta));
        segni += `<circle class="q-inizio" cx="${ix.toFixed(1)}" cy="${iy.toFixed(1)}" r="3.5"/><path class="q-fine" d="M${fx.toFixed(1)} ${fy.toFixed(1)}m0 -7l5 9h-10z" transform="rotate(${angolo(Gx.fineScelta)} ${fx.toFixed(1)} ${fy.toFixed(1)})"/>`;
      }
      const v0 = Gx ? tappe(Gx)[0] : null;
      return `<div class="q" role="img" aria-label="${Gx ? `Il giorno ${S.g + 1} sull'orologio: dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}` : 'Giorno vuoto'}">
        <svg class="q-svg" viewBox="0 0 320 320" aria-hidden="true" focusable="false"><circle class="q-cassa" cx="160" cy="160" r="158"/><circle class="q-smalto" cx="160" cy="160" r="144"/>${tacche}${numeriQ}<circle class="q-anello" cx="160" cy="160" r="150"/>${archi}${segni}
          <g class="q-lancetta" id="q-lancetta" style="--a:${v0 ? angolo(v0.inizio) : 0}deg"><path d="M160 172V40" /><circle cx="160" cy="58" r="4.5"/></g><circle class="q-perno" cx="160" cy="160" r="5"/></svg>
        <div class="q-centro" id="q-centro">${v0 ? this.centro(v0) : '<p class="q-c-t">Giorno vuoto</p>'}</div></div>`;
    },
    centro(v) {
      return `${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="">` : '<span class="q-c-senza"></span>'}<span class="q-c-ora num">${ora(v.inizio)}</span>`;
    },
    elenco(Gx) {
      return `<section class="f-giorno" aria-labelledby="f-g"><h2 id="f-g">${esc(titoloGiorno(Gx))}</h2><p class="f-riassunto">${riassunto(Gx)}</p>
        <ol class="f-elenco">${Gx.voci.map(v => v.tipo === 'tratto'
          ? `<li class="f-tratto num">${ic('piedi', 15)}${testoTratto(v)}</li>`
          : `<li class="fq-riga${v.id === S.nuova ? ' nuova' : ''}" data-tappa="${v.id}"><button type="button" data-azione="tappa" data-id="${v.id}"><span class="f-ora num">${ora(v.inizio)}<small>${ora(v.fine)}</small></span><span class="f-tit">${esc(T(v.id).nome)}<small>${durata(T(v.id).durata)}${etichette(v.id).length ? `, ${etichette(v.id).join(', ').toLowerCase()}` : ''}</small></span>${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : '<span></span>'}</button></li>`).join('')}</ol>
        ${liberoBlocco(Gx, 'f-libero')}</section>`;
    },
    barra() {
      const mappaTel = S.vista === 'mappa';
      return `<nav class="f-barra" aria-label="Comandi dell'itinerario"><div class="f-mini" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18"/><path id="f-mini-l" d="M20 21V6" style="--a:0deg"/></svg></div><span class="f-barra__t" id="f-barra-t">Giorno ${S.g + 1}</span>
        ${computer.matches ? '' : `<button type="button" class="onda" data-azione="vista" data-v="${mappaTel ? 'elenco' : 'mappa'}" aria-label="${mappaTel ? 'Elenco' : 'Mappa'}">${ic(mappaTel ? 'elenco' : 'mappa')}</button>`}
        <button type="button" class="f-aggiungi onda" data-azione="aggiungi">${ic('piu', 20)}<span>Aggiungi</span></button><button type="button" class="onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi">${ic('altro')}</button></nav>`;
    },
    dopo() {
      const el = $('#mappa');
      if (el) {
        mappa = new Mappa(el, { tocca: id => apriScheda(id), margini: () => ({ t: 50, r: 50, b: 50, l: 50 }) });
        const Gx = G(S.g);
        mappa.disegna(Gx, { daLinea: S.nuova ? D.giorni[S.g].linee.length : null, altre: Gx ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
      }
      const Gx = G(S.g);
      if (!Gx) return;
      // la lancetta segue la tappa che stai leggendo (quella più vicina al centro dello schermo)
      let ultima = null;
      const segui = () => {
        const righe = $$('.fq-riga');
        if (!righe.length) return;
        let migliore = righe[0], dist = Infinity;
        const mezzo = innerHeight * .55;
        for (const r of righe) { const b = r.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - mezzo); if (d < dist) { dist = d; migliore = r; } }
        const id = migliore.dataset.tappa;
        if (id === ultima) return;
        ultima = id;
        const v = tappe(Gx).find(x => x.id === id);
        const a = angolo(v.inizio) + (v.fine - v.inizio) / 4;
        $('#q-lancetta')?.style.setProperty('--a', `${a}deg`);
        $('#f-mini-l')?.style.setProperty('--a', `${a}deg`);
        $$('.fq-riga').forEach(r => r.classList.toggle('su', r === migliore));
        $$('.q-segno').forEach((s, i) => s.classList.toggle('su', tappe(Gx)[i]?.id === id));
        const c = $('#q-centro');
        if (c) { c.classList.remove('cambia'); void c.offsetWidth; c.innerHTML = F.centro(v); c.classList.add('cambia'); }
        const t = $('#f-barra-t'); if (t) t.innerHTML = `<b class="num">${ora(v.inizio)}</b><small>${esc(T(id).breve)}</small>`;
      };
      ascolta('scroll', segui);
      requestAnimationFrame(segui);
    },
    tocca(id) {
      const r = $(`.fq-riga[data-tappa="${id}"]`);
      apriScheda(id);
      if (r) r.classList.add('su');
    },
    aggiorna: aggiornaTutto
  };

  // ascolti della pagina che valgono solo per la proposta aperta
  let ascolti = [];
  function ascolta(tipo, fn) { let raf = 0; const h = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); }; addEventListener(tipo, h, { passive: true }); ascolti.push([tipo, h]); }
  const smettiAscolti = () => { ascolti.forEach(([t, h]) => removeEventListener(t, h)); ascolti = []; };

  const P = { a: A, c: C, d: Dp, e: E, f: F };
  const ridisegna = () => disegna();

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
    const fai = () => { mettiTema(); if (mappa) mappa.adatta(false); };
    if (document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
  });
  function prova() {
    $$('#prova .p-scelte button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === S.p)));
    $('#p-nome').textContent = `${S.p.toUpperCase()} · ${P[S.p].nome}`;
    $('#idea').innerHTML = `<h2>${S.p.toUpperCase()} · ${P[S.p].nome}</h2>${P[S.p].idea.map(t => `<p>${esc(t)}</p>`).join('')}<p class="idea__nota">Giro 2. Dati veri di «Due giorni a Napoli»: orari e tempi calcolati dal sito (giorno feriale). «Aggiungi» propone tutte le ${D.vicine[0].length} tappe, dalla più vicina. Pulsanti, «Salva» e ricerca: qui solo un primo assaggio, li rifiniamo dopo la scelta della pagina.</p>`;
  }
  $$('#prova .p-scelte button').forEach(b => b.addEventListener('click', () => { if (b.dataset.p !== S.p) location.hash = b.dataset.p; }));
  function daHash(primo) {
    const p = location.hash.slice(1);
    const nuovo = P[p] ? p : 'a';
    if (!primo && nuovo === S.p) return;
    // ogni proposta riparte pulita: primo giorno, non salvato, senza aggiunte; il marchio si anima di nuovo
    const fai = () => { Object.assign(S, { p: nuovo, g: 0, vista: 'elenco', salvato: false, agg: [null, null], extra: false, attiva: null, nuova: null, anima: true, fini: {} }); ridisegna(); scrollTo(0, 0); };
    if (!primo && document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
  }
  addEventListener('hashchange', () => daHash(false));
  computer.addEventListener('change', () => ridisegna());
  addEventListener('resize', () => { if (S.p === 'd') Dp.altezza(); });

  mettiTema();
  daHash(true);
  try { if (!localStorage.getItem('prova-idea-vista-2')) { $('#idea').showPopover?.(); localStorage.setItem('prova-idea-vista-2', '1'); } } catch {}
})();
