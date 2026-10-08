// Compositore, pezzo 1: le 4 proposte di pagina e barra con i dati veri di «Due giorni a Napoli» (design/compositore/genera.mjs).
// Orari, tempi e percorsi vengono dal calcolo del sito (giorno feriale). «Aggiungi» usa 4 tappe vicine per giorno, già ricalcolate.
(() => {
  const D = window.DATI, FOTO = window.FOTO, M = window.MAPPA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const piano = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const computer = matchMedia('(min-width: 960px)');
  const range = n => Array.from({ length: n }, (_, i) => i);

  // ---------- formati ----------
  const ora = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const durata = m => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ' ' + String(m % 60).padStart(2, '0') : ''}`);
  const durataLunga = m => {
    const h = Math.floor(m / 60), r = m % 60;
    const ore = h === 1 ? "un'ora" : `${h} ore`;
    return h ? (r ? `${ore} e ${r} minuti` : ore) : `${r} minuti`;
  };
  const metri = m => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`);
  const GS = { lun: 'lunedì', mar: 'martedì', mer: 'mercoledì', gio: 'giovedì', ven: 'venerdì', sab: 'sabato', dom: 'domenica' };
  const INGRESSO = { pagamento: 'Ingresso a pagamento', gratis: 'Ingresso gratis', 'in-parte': 'In parte a pagamento' };
  const DENTRO = { si: 'Al chiuso', no: "All'aperto", 'in-parte': 'In parte al chiuso' };
  const norma = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  // ---------- icone (tratto 2, griglia 24) ----------
  const I = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    piu: '<path d="M12 5v14M5 12h14"/>',
    mappa: '<path d="M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    elenco: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="3"/>',
    piedi: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6 3 3v3M12 15l-1-5 4 1 2 3M11 10l-3 2-1 3"/>',
    salva: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
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
    vista: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>'
  };
  const ic = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[n]}</svg>`;

  // il marchio: il segno chiaro o scuro (lo sceglie il CSS dal tema) e il nome con il segnaposto al posto della «o»
  const firma = () => `<a class="firma" href="#${S.p}"><span class="vh">nextstop</span><svg class="segno segno--chiaro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${D.marchio.chiaro}</svg><svg class="segno segno--scuro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${D.marchio.scuro}</svg><span class="parola" aria-hidden="true">nextst<span class="pin"><svg viewBox="0 0 20 28" focusable="false">${D.marchio.spillo}</svg></span>p</span></a>`;

  // ---------- stato della prova ----------
  const S = { p: 'a', g: 0, vista: 'elenco', salvato: false, agg: [null, null], extra: false, attiva: null };
  const nG = () => D.giorni.length + (S.extra ? 1 : 0);
  const G = g => (g < D.giorni.length ? (S.agg[g] ? D.conAggiunta[g][S.agg[g]] : D.giorni[g]) : null);
  const tappe = Gx => Gx.voci.filter(v => v.tipo === 'tappa');
  const T = id => D.tappe[id];
  const titoloGiorno = Gx => [...new Set(tappe(Gx).map(v => T(v.id).zona))].join(', ');
  const aPiedi = Gx => Gx.voci.every(v => v.tipo !== 'tratto' || !v.mezzi.length);
  const riassunto = Gx => `Dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}, ${tappe(Gx).length} tappe, ${Gx.spostamenti} minuti ${aPiedi(Gx) ? 'a piedi' : 'di spostamenti'} (${metri(Gx.metri)}).`;
  const libero = Gx => Gx.fineScelta - Gx.fine;
  const testoTratto = v => (v.mezzi.length ? `${v.min} min, a piedi e ${v.mezzi.join(' e ')}` : `${v.min} min a piedi, ${metri(v.metri)}`);
  const etichette = id => {
    const t = T(id), out = [];
    if (t.chiuso.length) out.push(`Chiuso il ${t.chiuso.map(g => GS[g]).join(' e il ')}`);
    if (t.prenotazione === 'obbligatoria') out.push('Si entra solo prenotando');
    return out;
  };
  const contaTappe = () => range(D.giorni.length).reduce((s, g) => s + tappe(G(g)).length, 0);
  const crediti = () => `<details class="crediti"><summary>Crediti delle foto e della mappa</summary><p>Mappa: dati © i contributori di OpenStreetMap (ODbL). Foto: ${Object.entries(D.crediti).map(([id, c]) => `${esc(T(id)?.breve ?? id)}, ${esc(c.autore)} (${esc(c.licenza)})`).join('; ')}.</p></details>`;

  // =====================================================================================
  // La mappa: la mappa del sito (OpenStreetMap) con i percorsi veri; i segni restano della stessa misura
  // =====================================================================================
  const BASE = `<rect class="m-terra" x="-6000" y="-6000" width="16000" height="16000"/><path class="m-mare" d="${M.mare}"/><path class="m-isole" d="${M.isole}"/><path class="m-parco" d="${M.parchi}"/><path class="m-s0" d="${M.strade[0]}"/><path class="m-s1c" d="${M.strade[1]}"/><path class="m-s2c" d="${M.strade[2]}"/><path class="m-s1" d="${M.strade[1]}"/><path class="m-s2" d="${M.strade[2]}"/><path class="m-moli" d="${M.moli}"/>`;
  const numeri = d => (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  function riquadroDi(lista) {
    const pts = [];
    for (const Gx of lista) {
      for (const v of tappe(Gx)) pts.push(v.xy);
      for (const l of Gx.linee) { const n = numeri(l.d); for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]); }
    }
    if (!pts.length) return { x1: 1850, x2: 2050, y1: 500, y2: 900 };
    let x1 = Math.min(...pts.map(p => p[0])), x2 = Math.max(...pts.map(p => p[0])), y1 = Math.min(...pts.map(p => p[1])), y2 = Math.max(...pts.map(p => p[1]));
    const minimo = 120;
    if (x2 - x1 < minimo) { const c = (x1 + x2) / 2; x1 = c - minimo / 2; x2 = c + minimo / 2; }
    if (y2 - y1 < minimo) { const c = (y1 + y2) / 2; y1 = c - minimo / 2; y2 = c + minimo / 2; }
    return { x1, x2, y1, y2 };
  }
  class Mappa {
    constructor(el, opz = {}) {
      this.el = el; this.opz = opz; this.tappe = []; this.vb = null; this.fuoco = null;
      el.classList.add('m');
      el.innerHTML = `<svg class="m-svg" preserveAspectRatio="none" aria-hidden="true" focusable="false">${BASE}<g class="m-altre"></g><g class="m-rotta"></g><g class="m-fili"></g></svg><div class="m-segni"></div><p class="m-osm">© OpenStreetMap</p>`;
      this.svg = $('svg', el);
      this.ro = new ResizeObserver(() => { if (this.box) this.adatta(false); });
      this.ro.observe(el);
    }
    disegna(Gx, { altre = [], vola = false, n = null } = {}) {
      $('.m-altre', this.svg).innerHTML = altre.map(a => a.G.linee.map(l => `<path class="m-altra" style="--col:${a.col}" d="${l.d}"/>`).join('')).join('');
      $('.m-rotta', this.svg).innerHTML = Gx ? Gx.linee.map(l => `<path class="m-c" d="${l.d}"/><path class="m-l" d="${l.d}"/>`).join('') : '';
      this.tappe = Gx ? tappe(Gx) : [];
      this.box = riquadroDi(Gx ? [Gx] : altre.map(a => a.G));
      this.fuoco = null;
      this.el.setAttribute('role', 'group');
      this.el.setAttribute('aria-label', Gx ? `Mappa del giorno ${n ?? S.g + 1}: ${this.tappe.length} tappe collegate nell'ordine` : 'Mappa: il giorno è vuoto');
      $('.m-segni', this.el).innerHTML = this.tappe.map((v, i) => `<button type="button" class="m-segno" style="--i:${i}" data-id="${v.id}" aria-label="${v.n}. ${esc(T(v.id).nome)}, alle ${ora(v.inizio)}"><span>${v.n}</span></button>`).join('');
      $$('.m-segno', this.el).forEach(b => { b.onclick = () => this.opz.tocca?.(b.dataset.id); });
      this.adatta(vola);
    }
    vbPer(box) {
      const W = this.el.clientWidth || 1, H = this.el.clientHeight || 1;
      const p = this.opz.margini ? this.opz.margini() : { t: 44, r: 36, b: 44, l: 36 };
      let s = Math.min((W - p.l - p.r) / (box.x2 - box.x1), (H - p.t - p.b) / (box.y2 - box.y1));
      s = Math.max(Math.min(s, this.fuoco ? 6 : 3.4), 0.15);   // un giorno compatto non si ingrandisce troppo: si vede anche intorno
      const cx = (box.x1 + box.x2) / 2, cy = (box.y1 + box.y2) / 2;
      const px = p.l + (W - p.l - p.r) / 2, py = p.t + (H - p.t - p.b) / 2;
      return { x: cx - px / s, y: cy - py / s, w: W / s, h: H / s };
    }
    adatta(vola) {
      const fine = this.vbPer(this.fuoco || this.box);
      cancelAnimationFrame(this.raf);
      if (!vola || !this.vb || !piano()) { this.metti(fine); return; }
      const da = this.vb, t0 = performance.now(), durata = 560;
      const passo = now => {
        const k = Math.min(1, (now - t0) / durata), e = 1 - Math.pow(1 - k, 4);
        this.metti({ x: da.x + (fine.x - da.x) * e, y: da.y + (fine.y - da.y) * e, w: da.w + (fine.w - da.w) * e, h: da.h + (fine.h - da.h) * e });
        if (k < 1) this.raf = requestAnimationFrame(passo);
      };
      this.raf = requestAnimationFrame(passo);
    }
    metti(vb) {
      this.vb = vb;
      this.svg.setAttribute('viewBox', `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`);
      this.segni();
    }
    // segni senza sovrapposizioni: si allontanano quanto basta e un filo li lega al punto vero
    segni() {
      const s = (this.el.clientWidth || 1) / this.vb.w;
      const pos = this.tappe.map(v => { const x = (v.xy[0] - this.vb.x) * s, y = (v.xy[1] - this.vb.y) * s; return { x, y, x0: x, y0: y }; });
      const MIN = 32;
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
      const r = 60;
      this.fuoco = { x1: v.xy[0] - r, x2: v.xy[0] + r, y1: v.xy[1] - r, y2: v.xy[1] + r };
      this.adatta(true);
      this.evidenzia(id);
    }
    tutto() { this.fuoco = null; this.adatta(true); this.evidenzia(null); }
    evidenzia(id) { $$('.m-segno', this.el).forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id))); }
    spegni() { this.ro.disconnect(); cancelAnimationFrame(this.raf); }
  }

  // =====================================================================================
  // Pezzi comuni: foglio che sale, avviso in basso, schede
  // =====================================================================================
  const foglioEl = $('#foglio');
  function foglio(titolo, corpo, dopo) {
    foglioEl.innerHTML = `<div class="f-testa"><h2 id="f-titolo">${esc(titolo)}</h2><button type="button" class="f-chiudi" aria-label="Chiudi">${ic('x')}</button></div><div class="f-corpo">${corpo}</div>`;
    $('.f-chiudi', foglioEl).onclick = () => foglioEl.close();
    foglioEl.onclick = null;
    if (!foglioEl.open) foglioEl.showModal();
    dopo?.(foglioEl);
  }
  foglioEl.addEventListener('click', e => { if (e.target === foglioEl) foglioEl.close(); });

  let tempoAvviso;
  function avvisa(testo, azione) {
    const t = $('#toast');
    t.innerHTML = `<span>${esc(testo)}</span>${azione ? `<button type="button">${esc(azione.testo)}</button>` : ''}`;
    if (azione) $('button', t).onclick = () => { t.classList.remove('su'); azione.fai(); };
    t.classList.add('su');
    clearTimeout(tempoAvviso);
    tempoAvviso = setTimeout(() => t.classList.remove('su'), azione ? 6500 : 4000);
  }

  function apriScheda(id) {
    const t = T(id), Gx = G(S.g), v = Gx && tappe(Gx).find(x => x.id === id);
    foglio(t.nome, `${FOTO[id] ? `<img class="f-scheda-foto" src="${FOTO[id]}" alt="">` : ''}
      <p>${esc(t.frase)}</p>
      <ul class="f-fatti">
        ${v ? `<li>Nel giorno ${S.g + 1}: dalle ${ora(v.inizio)} alle ${ora(v.fine)}</li>` : ''}
        <li>Visita: ${durata(t.durata)}</li>
        <li>${INGRESSO[t.ingresso] ?? ''}</li>
        <li>${DENTRO[t.alChiuso] ?? ''}</li>
        ${etichette(id).map(e => `<li>${e}</li>`).join('')}
      </ul>
      <p class="f-nota">Prova: la scheda vera della tappa (foto, orari, prezzi, storia e fonti) è il pezzo 2.</p>`);
  }

  function apriAggiungi() {
    const g = S.g;
    if (g >= D.giorni.length) {
      foglio('Aggiungi una tappa', `<p class="f-nota">Nella prova le tappe si aggiungono ai giorni 1 e 2. Per il giorno ${g + 1} puoi partire da un itinerario pronto.</p>${prontiLista('f-azioni', 'f-azione')}`, f => { f.onclick = e => { if (e.target.closest('[data-f="pronto"]')) { f.close(); AZ.pronto(); } }; });
      return;
    }
    const righe = q => D.candidati[g].filter(id => !q || norma(`${T(id).nome} ${T(id).zona}`).includes(norma(q))).map(id => {
      const dentro = S.agg[g] === id;
      return `<div class="f-riga">${FOTO[id] ? `<img src="${FOTO[id]}" alt="">` : '<span class="f-senza"></span>'}<div><b>${esc(T(id).nome)}</b><small>${durata(T(id).durata)}, ${esc(T(id).zona)}</small></div><button type="button" class="f-bottone${dentro ? ' f-bottone--contorno' : ''}" data-f="agg" data-id="${id}" aria-label="${dentro ? 'Togli' : 'Aggiungi'} ${esc(T(id).breve)} ${dentro ? 'dal' : 'al'} giorno ${g + 1}">${dentro ? 'Togli' : `${ic('piu', 18)}Aggiungi`}</button></div>`;
    }).join('') || '<p class="f-nota">Nessuna tappa con questo nome tra le 4 della prova.</p>';
    foglio('Aggiungi una tappa', `<div class="f-cerca"><label for="f-q">Cerca</label><input id="f-q" type="search" placeholder="Una tappa, un quartiere" autocomplete="off" enterkeyhint="search"></div>
      <div class="f-lista"><h3>Vicino al giorno ${g + 1}</h3><div id="f-risultati">${righe('')}</div></div>
      <p class="f-nota">Prova: 4 tappe vicine per giorno, con i tempi veri; la tappa va in fondo al giorno. La ricerca vera (tappe, locali, gite e parole come «Cristo velato») è il pezzo 3.</p>`, f => {
      $('#f-q', f).addEventListener('input', e => { $('#f-risultati', f).innerHTML = righe(e.target.value.trim()); });
      f.onclick = e => {
        if (e.target === f) { f.close(); return; }
        const b = e.target.closest('[data-f="agg"]');
        if (!b) return;
        const id = b.dataset.id, prima = S.agg[g];
        f.close();
        P[S.p].aggiorna(() => { S.agg[g] = prima === id ? null : id; });
        if (prima === id) avvisa(`${T(id).breve} non è più nel giorno ${g + 1}.`);
        else avvisa(`${T(id).breve} è in fondo al giorno ${g + 1}: finisci alle ${ora(D.conAggiunta[g][id].fine)}.`, { testo: 'Annulla', fai: () => P[S.p].aggiorna(() => { S.agg[g] = prima; }) });
      };
    });
  }
  function prontiLista(cl, voce) {
    return `<ul class="${cl}">${D.altri.map(a => `<li><button type="button" class="${voce}" data-f="pronto"><span>${esc(a.nome)}<small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></span></button></li>`).join('')}</ul>`;
  }

  function salva() {
    if (S.salvato) { apriMiei(); return; }
    P[S.p].aggiorna(() => { S.salvato = true; });
    avvisa('Salvato in «I miei itinerari» come «Due giorni a Napoli».', { testo: 'Cambia nome', fai: () => avvisa('Prova: il nome si cambia con un tocco, è il pezzo 4.') });
  }
  function apriMiei() {
    foglio('I miei itinerari', `<div class="f-lista"><div class="f-riga">${FOTO['monte-echia'] ? `<img src="${FOTO['monte-echia']}" alt="">` : ''}<div><b>Due giorni a Napoli</b><small>${nG()} giorni, ${contaTappe()} tappe</small></div><span class="f-segno">${S.salvato ? `${ic('spunta', 16)}Salvato` : 'Non ancora salvato'}</span></div></div>
      ${S.salvato ? '' : `<button type="button" class="f-bottone" data-f="salva">${ic('salva', 20)}Salva questo itinerario</button>`}
      <p class="f-nota">Gli itinerari restano su questo telefono: niente account, niente iscrizione.</p>`, f => {
      f.onclick = e => { if (e.target === f) f.close(); if (e.target.closest('[data-f="salva"]')) { f.close(); salva(); } };
    });
  }
  function apriCondividi() {
    foglio('Condividi', `<p>Chi apre il link vede lo stesso itinerario: gli stessi giorni, le stesse tappe, gli stessi orari.</p>
      <div class="f-link"><label class="vh" for="f-link">Link dell'itinerario</label><input id="f-link" readonly value="${esc(D.link)}"><button type="button" class="f-bottone" data-f="copia">${ic('copia', 20)}Copia</button></div>
      <p class="f-nota">Il link porta tutto dopo il «#»: non passa da nessun server.</p>`, f => {
      f.onclick = async e => {
        if (e.target === f) { f.close(); return; }
        if (!e.target.closest('[data-f="copia"]')) return;
        try { await navigator.clipboard.writeText(D.link); avvisa('Link copiato.'); } catch { const i = $('#f-link', f); i.focus(); i.select(); avvisa('Tieni premuto sul link e scegli «Copia».'); }
      };
    });
  }
  function apriAltro() {
    foglio('Itinerario', `<div class="f-azioni">
      <button type="button" class="f-azione" data-f="miei">${ic('miei')}<span>I miei itinerari<small>Quelli salvati su questo telefono</small></span></button>
      <button type="button" class="f-azione" data-f="condividi">${ic('condividi')}<span>Condividi<small>Un link con tutto l'itinerario</small></span></button>
      <button type="button" class="f-azione" data-f="giorno">${ic('piu')}<span>Aggiungi un giorno</span></button>
      <button type="button" class="f-azione" data-f="quando">${ic('calendario')}<span>Data e orari<small>Senza data, dalle 9:30 alle 19:00</small></span></button>
    </div>`, f => {
      f.onclick = e => {
        if (e.target === f) { f.close(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        f.close();
        ({ miei: apriMiei, condividi: apriCondividi, giorno: nuovoGiorno, quando: quando })[b.dataset.f]();
      };
    });
  }
  function apriGiorni() {
    foglio('I giorni', `<div class="f-azioni">${range(nG()).map(g => { const Gx = G(g); return `<button type="button" class="f-azione" data-f="g" data-g="${g}"><span>Giorno ${g + 1}${g === S.g ? ' (lo stai guardando)' : ''}<small>${Gx ? `${esc(titoloGiorno(Gx))}. Dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}, ${tappe(Gx).length} tappe` : 'Ancora vuoto'}</small></span></button>`; }).join('')}
      <button type="button" class="f-azione" data-f="nuovo">${ic('piu')}<span>Aggiungi un giorno</span></button></div>`, f => {
      f.onclick = e => {
        if (e.target === f) { f.close(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        f.close();
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
    if (P[S.p].giorno) P[S.p].giorno(g); else P[S.p].aggiorna(() => { S.g = g; S.attiva = null; }, { giorno: true });
  }

  // =====================================================================================
  // Disegno della pagina e passaggi
  // =====================================================================================
  let mappa = null;
  function disegna() {
    const r = document.documentElement;
    r.classList.remove('pa', 'pb', 'pc', 'pd');
    r.classList.add('p' + S.p);
    r.dataset.g = String(S.g);
    if (mappa) { mappa.spegni(); mappa = null; }
    $('#app').innerHTML = P[S.p].html();
    P[S.p].dopo?.();
    prova();
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
    };
    if (document.startViewTransition && piano()) { const vt = document.startViewTransition(fai); vt.ready.catch(() => {}); vt.finished.catch(() => {}); } else fai();
  }

  const AZ = {
    giorno: b => vaiAlGiorno(+b.dataset.g),
    'nuovo-giorno': nuovoGiorno,
    'togli-giorno': () => P[S.p].aggiorna(() => { S.extra = false; S.g = Math.min(S.g, 1); }, { giorno: true }),
    vista: b => P[S.p].aggiorna(() => { S.vista = b.dataset.v; }),
    aggiungi: apriAggiungi,
    salva, miei: apriMiei, condividi: apriCondividi, altro: apriAltro, quando, giorni: apriGiorni,
    menu: () => avvisa('Prova: qui si apre il menu del sito, quello di oggi.'),
    tappa: b => (P[S.p].tocca ? P[S.p].tocca(b.dataset.id) : apriScheda(b.dataset.id)),
    scheda: b => apriScheda(b.dataset.id),
    pronto: () => avvisa('Prova: gli altri itinerari pronti qui non si aprono.')
  };
  $('#app').addEventListener('click', e => {
    const b = e.target.closest('[data-azione]');
    if (b && !b.disabled) AZ[b.dataset.azione]?.(b, e);
  });
  // frecce sinistra e destra tra le schede dei giorni
  $('#app').addEventListener('keydown', e => {
    const t = e.target.closest('[role="tab"]');
    if (!t || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const g = Math.max(0, Math.min(nG() - 1, S.g + (e.key === 'ArrowRight' ? 1 : -1)));
    vaiAlGiorno(g);
    requestAnimationFrame(() => $(`[role="tab"][data-g="${g}"]`)?.focus());
  });

  const schedeGiorni = (cl = '') => range(nG()).map(g => `<button type="button" role="tab" class="${cl}" aria-selected="${g === S.g}" data-azione="giorno" data-g="${g}">Giorno ${g + 1}</button>`).join('');
  const vuoto = (cl, bott) => `<div class="${cl}"><p>Il giorno ${S.g + 1} è vuoto. Aggiungi la prima tappa, oppure parti da un itinerario pronto.</p><button type="button" class="${bott}" data-azione="aggiungi">${ic('piu', 20)}Aggiungi una tappa</button>
    <ul>${D.altri.map(a => `<li><button type="button" data-azione="pronto"><span>${esc(a.nome)}</span><small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></button></li>`).join('')}</ul>
    <button type="button" class="${bott} ${bott}--contorno" data-azione="togli-giorno">Togli il giorno ${S.g + 1}</button></div>`;

  // =====================================================================================
  // A · LA RIVISTA
  // =====================================================================================
  const A = {
    nome: 'La rivista',
    idea: ['La pagina come una rivista di viaggio, come la home: foto ad arco, titoli con le grazie, la linea a puntini color tufo.',
      'I comandi stanno in un\'«isola» blu notte in basso, sotto il pollice: cambi giorno con le frecce, apri la mappa, aggiungi (+); nei tre puntini «I miei itinerari» e «Condividi». «Salva» sta sulla foto, accanto al nome.',
      'Sul computer: la giornata a sinistra, la mappa fissa a destra dentro un arco di pietra.'],
    html() {
      const g = S.g, Gx = G(g), mappaTel = !computer.matches && S.vista === 'mappa';
      return `<div class="a-testata">${firma()}<button type="button" class="tondo" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></div>
      <div class="a-pagina"><div class="a-colonna">
        <section class="a-apertura" aria-labelledby="a-titolo"><img src="${FOTO['monte-echia']}" alt="">
          <div class="a-apertura__testo"><h1 id="a-titolo">${esc(D.nome)}</h1>
            <div class="a-stato${S.salvato ? ' a-stato--salvato' : ''}"><span class="a-stato__testo">${S.salvato ? 'Salvato in «I miei itinerari»' : 'Non ancora salvato'}</span>${S.salvato ? '' : `<button type="button" class="a-salva" data-azione="salva">${ic('salva', 20)}Salva</button>`}</div></div></section>
        <div class="a-quando">${ic('calendario', 20)}<span>Senza data, dalle 9:30 alle 19:00</span><button type="button" data-azione="quando">Cambia</button></div>
        <div class="a-giorni"><div class="a-schede" role="tablist" aria-label="Giorni dell'itinerario">${schedeGiorni()}</div><button type="button" class="a-piu" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        <section class="a-giorno" data-inizio-giorno aria-labelledby="a-g">
          ${Gx ? `<h2 id="a-g">${esc(titoloGiorno(Gx))}</h2><p class="a-riassunto">${riassunto(Gx)}</p>` : `<h2 id="a-g">Giorno ${g + 1}</h2>`}
          ${mappaTel ? '<div id="mappa" class="a-mappa-tel"></div>' : Gx ? this.giornata(Gx) : vuoto('a-vuoto', 'a-bottone')}
        </section>
        <div class="a-fine"></div>
        ${this.isola()}
      </div>
      ${computer.matches ? '<div class="a-destra"><div id="mappa"></div></div>' : ''}</div>${crediti()}`;
    },
    giornata(Gx) {
      const voci = Gx.voci.map(v => {
        if (v.tipo === 'tratto') return `<li class="a-tratto"><span></span><span>${ic('piedi', 18)}${testoTratto(v)}</span></li>`;
        const t = T(v.id);
        return `<li class="a-tappa"><span class="a-ora">${ora(v.inizio)}</span><button type="button" class="a-scheda" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}${FOTO[v.id] ? '' : ' style="grid-template-columns:1fr"'}><span><span class="a-nome">${esc(t.nome)}</span><span class="a-meta">${durata(t.durata)}, fino alle ${ora(v.fine)}</span>${etichette(v.id).map(e => `<span class="a-et">${e}</span>`).join(' ')}</span>${FOTO[v.id] ? `<img class="a-foto" src="${FOTO[v.id]}" alt="" loading="lazy">` : ''}</button></li>`;
      }).join('');
      const l = libero(Gx);
      return `<ol class="a-linea">${voci}</ol>${l > 0 ? `<div class="a-libero"><p>Ti ${l >= 120 ? 'restano' : 'resta'} ${durataLunga(l)} prima delle ${ora(Gx.fineScelta)}.</p><button type="button" class="a-bottone a-bottone--contorno" data-azione="aggiungi">${ic('piu', 20)}Aggiungi una tappa</button></div>` : ''}`;
    },
    isola() {
      const g = S.g, mappaTel = S.vista === 'mappa';
      return `<nav class="a-isola" aria-label="Comandi dell'itinerario">
        <div class="a-passi"><button type="button" data-azione="giorno" data-g="${g - 1}" aria-label="Giorno prima"${g === 0 ? ' disabled' : ''}>${ic('indietro')}</button><span class="a-passi__giorno" aria-live="polite">Giorno ${g + 1}<small>di ${nG()}</small></span><button type="button" data-azione="giorno" data-g="${g + 1}" aria-label="Giorno dopo"${g === nG() - 1 ? ' disabled' : ''}>${ic('avanti')}</button></div>
        <span class="a-sep" aria-hidden="true"></span>
        <button type="button" class="a-vista" data-azione="vista" data-v="${mappaTel ? 'elenco' : 'mappa'}" aria-label="${mappaTel ? 'Elenco' : 'Mappa'}">${ic(mappaTel ? 'elenco' : 'mappa')}<span class="a-etic" aria-hidden="true">${mappaTel ? 'Elenco' : 'Mappa'}</span></button>
        <button type="button" class="a-piu-grande" data-azione="aggiungi" aria-label="Aggiungi una tappa">${ic('piu')}</button>
        <button type="button" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi">${ic('altro')}</button>
      </nav>`;
    },
    dopo() {
      const el = $('#mappa');
      if (!el) return;
      mappa = new Mappa(el, {
        tocca: id => A.tocca(id),
        margini: () => (computer.matches ? { t: 150, r: 50, b: 50, l: 50 } : { t: 110, r: 32, b: 44, l: 32 })
      });
      const Gx = G(S.g);
      mappa.disegna(Gx, { altre: Gx ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
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
  // B · IL NASTRO
  // =====================================================================================
  const K = 1.9, INIZIO_NASTRO = 9 * 60, FINE_NASTRO = 19 * 60 + 30;
  const B = {
    nome: 'Il nastro',
    idea: ['La giornata disegnata in scala di tempo: una visita lunga è un blocco lungo, e in fondo vedi quanto tempo libero ti resta prima delle 19.',
      'In basso i giorni in miniatura: tutto il viaggio sempre sotto il pollice. Ogni giorno ha il suo colore, anche sulla mappa (giallo tufo, blu del mare, rosso pompeiano).',
      'Sul computer la barra dei giorni sale in alto e la mappa, a destra, mostra tutti i giorni insieme.'],
    html() {
      const Gx = G(S.g), pc = computer.matches, mappaTel = !pc && S.vista === 'mappa';
      return `<div class="b-pagina"><div class="b-sinistra">
        <div class="b-testata">${firma()}<button type="button" class="tondo" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></div>
        <div class="b-titolo"><h1>${esc(D.nome)}</h1>
          <div class="b-stato"><p>${S.salvato ? '<b>Salvato</b> in «I miei itinerari»' : '<b>Non ancora salvato</b>'}</p>${S.salvato ? '' : `<button type="button" class="b-bottone b-bottone--contorno" data-azione="salva">${ic('salva', 20)}Salva</button>`}</div>
          <div class="b-quando">${ic('calendario', 20)}<span>Senza data, dalle 9:30 alle 19:00</span><button type="button" data-azione="quando">Cambia</button></div></div>
        ${pc ? this.barra() : ''}
        <section class="b-giorno-testa" data-inizio-giorno aria-labelledby="b-g">
          <h2 id="b-g"><span class="b-num" aria-hidden="true">${S.g + 1}</span><span><span class="vh">Giorno ${S.g + 1}: </span>${Gx ? esc(titoloGiorno(Gx)) : 'Giorno vuoto'}<small>${Gx ? `Dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}, ${tappe(Gx).length} tappe` : 'Aggiungi la prima tappa'}</small></span></h2>
          ${Gx ? this.composizione(Gx) : ''}
        </section>
        ${mappaTel ? `${this.legenda()}<div id="mappa" class="b-mappa-tel"></div>` : Gx ? this.scala(Gx) : vuoto('b-vuoto', 'b-bottone')}
        <div class="b-spazio"></div>
        ${pc ? '' : this.barra()}
      </div>${pc ? `<div class="b-destra">${this.legenda()}<div id="mappa"></div></div>` : ''}</div>${crediti()}`;
    },
    composizione(Gx) {
      const tot = Gx.fineScelta - Gx.inizio, l = Math.max(0, libero(Gx));
      const pct = m => `${(100 * m / Math.max(tot, Gx.fine - Gx.inizio)).toFixed(2)}%`;
      return `<div class="b-composizione"><div class="b-barra-giorno" role="img" aria-label="Visite ${durata(Gx.visite)}, a piedi ${durata(Gx.spostamenti)}, libero ${durata(l)}"><i class="v" style="width:${pct(Gx.visite)}"></i><i class="s" style="width:${pct(Gx.spostamenti)}"></i>${l ? '<i class="l"></i>' : ''}</div>
        <div class="b-legenda"><span><i style="background:var(--gc)"></i>Visite <b>${durata(Gx.visite)}</b></span><span><i style="background:color-mix(in srgb, var(--gc) 40%, var(--sup2))"></i>A piedi <b>${durata(Gx.spostamenti)}</b></span>${l ? `<span><i style="background:repeating-linear-gradient(135deg, var(--riga) 0 2px, transparent 2px 4px)"></i>Libero <b>${durata(l)}</b></span>` : ''}</div></div>`;
    },
    scala(Gx) {
      let y = 0, i = 0;
      const pezzi = [], tempi = [[Gx.inizio, 0]];
      for (const v of Gx.voci) {
        if (v.tipo === 'tappa') {
          const h = Math.max((v.fine - v.inizio) * K, 56);
          tempi.push([v.inizio, y]);
          const t = T(v.id), corto = h < 84;
          pezzi.push(`<button type="button" class="b-blocco b-entra${corto ? ' b-blocco--corto' : ''}" style="top:${y}px;height:${h - 3}px;--i:${i++}" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="b-n">${v.n}</span><span><b>${esc(t.nome)}</b><small>${ora(v.inizio)}–${ora(v.fine)}${etichette(v.id).length ? `, ${etichette(v.id).join(', ').toLowerCase()}` : ''}</small></span>${FOTO[v.id] && !corto ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : '<span></span>'}</button>`);
          y += h;
          tempi.push([v.fine, y]);
        } else {
          const h = Math.max(v.min * K, 28);
          pezzi.push(`<div class="b-tratto" style="top:${y}px;height:${h}px"><span>${ic('piedi', 15)}${testoTratto(v)}</span></div>`);
          y += h;
        }
      }
      const l = libero(Gx);
      if (l > 0) {
        const h = Math.max(l * K, 132);
        pezzi.push(`<div class="b-libero b-entra" style="top:${y + 4}px;height:${h - 4}px;--i:${i}"><p>Libero fino alle ${ora(Gx.fineScelta)}<small>Ti ${l >= 120 ? 'restano' : 'resta'} ${durataLunga(l)}</small></p><button type="button" class="b-bottone" data-azione="aggiungi">${ic('piu', 20)}Aggiungi qui</button></div>`);
        y += h;
        tempi.push([Gx.fineScelta, y]);
      }
      const yDi = m => {
        for (let k = 1; k < tempi.length; k++) {
          const [a, ya] = tempi[k - 1], [b, yb] = tempi[k];
          if (m >= a && m <= b) return b === a ? ya : ya + (yb - ya) * (m - a) / (b - a);
        }
        return null;
      };
      const fine = Math.max(Gx.fine, Gx.fineScelta), ore = [];
      for (let m = Math.ceil(Gx.inizio / 60) * 60; m <= fine; m += 60) if (m - Gx.inizio >= 20) ore.push(m);
      const etic = [[Gx.inizio, true], ...ore.map(m => [m, false])];
      if (Gx.fineScelta % 60) etic.push([Gx.fineScelta, true]);
      return `<div class="b-scala" style="height:${y}px" role="group" aria-label="La giornata in scala di tempo"><div class="b-righello" aria-hidden="true">${etic.map(([m, forte]) => { const yy = yDi(m); return yy == null ? '' : `<span class="b-ora num${forte ? ' b-ora--forte' : ''}" style="top:${yy.toFixed(1)}px">${ora(m)}</span>`; }).join('')}</div><div class="b-voci" style="height:${y}px">${pezzi.join('')}</div></div>`;
    },
    barra() {
      const mappaTel = S.vista === 'mappa';
      const mini = g => {
        const Gx = G(g), pct = m => (100 * (m - INIZIO_NASTRO) / (FINE_NASTRO - INIZIO_NASTRO)).toFixed(1);
        return `<button type="button" role="tab" class="b-mini b-g${g}" aria-selected="${g === S.g}" data-azione="giorno" data-g="${g}" aria-label="Giorno ${g + 1}${Gx ? `, dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}` : ', vuoto'}"><span class="b-mini__barra">${Gx ? tappe(Gx).map(v => `<i style="top:${pct(v.inizio)}%;height:${(pct(v.fine) - pct(v.inizio)).toFixed(1)}%"></i>`).join('') : ''}</span><span class="b-mini__n">${g + 1}</span></button>`;
      };
      return `<nav class="b-barra" aria-label="Giorni e comandi"><div class="b-settimana"><div class="b-tabs" role="tablist" aria-label="Giorni">${range(nG()).map(mini).join('')}</div><button type="button" class="b-mini b-mini--piu" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno"><span class="b-mini__barra">${ic('piu', 18)}</span><span class="b-mini__n" aria-hidden="true">&nbsp;</span></button></div>
        <div class="b-azioni"><button type="button" class="b-vista" data-azione="vista" data-v="${mappaTel ? 'elenco' : 'mappa'}" aria-label="${mappaTel ? 'Giornata' : 'Mappa'}">${ic(mappaTel ? 'elenco' : 'mappa')}</button><button type="button" class="b-aggiungi" data-azione="aggiungi" aria-label="Aggiungi una tappa">${ic('piu')}<span class="b-etic" aria-hidden="true">Aggiungi</span></button><button type="button" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi">${ic('altro')}</button></div></nav>`;
    },
    legenda() {
      return `<div class="b-legenda-mappa">${range(D.giorni.length).map(g => `<span class="b-g${g}"><i class="${g === S.g ? '' : 'f'}"></i>Giorno ${g + 1}</span>`).join('')}</div>`;
    },
    dopo() {
      const el = $('#mappa');
      if (!el) return;
      mappa = new Mappa(el, { tocca: id => B.tocca(id), margini: () => ({ t: 44, r: 40, b: 44, l: 40 }) });
      const altre = range(D.giorni.length).filter(g => g !== S.g).map(g => ({ G: G(g), col: `var(--g${g + 1})` }));
      mappa.disegna(G(S.g), { altre });
      if (S.attiva) mappa.evidenzia(S.attiva);
    },
    tocca(id) {
      S.attiva = id;
      $$('.b-blocco').forEach(b => b.toggleAttribute('aria-current', b.dataset.id === id));
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
    idea: ['La mappa è la pagina: l\'elenco è un foglio che sale con il dito, e la barra del compositore sta in cima al foglio, sempre visibile.',
      'Tocca una tappa: la mappa ci vola sopra. Cambi giorno: la mappa si sposta sul giorno nuovo.',
      'Colori del marchio (pervinca) al posto del giallo tufo, per vedere come starebbe il sito con quell\'accento. Sul computer l\'elenco è un pannello a sinistra sopra la mappa.'],
    html() {
      return `<div class="c-mappa"><div id="mappa"></div></div>
      <header class="c-sopra"><button type="button" class="tondo" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button><div class="c-nome${S.salvato ? ' c-nome--salvato' : ''}"><h1>${esc(D.nome)}</h1><p>${S.salvato ? 'Salvato in «I miei itinerari»' : 'Non ancora salvato'}</p></div>${S.salvato ? `<button type="button" class="c-azione" data-azione="miei" aria-label="I miei itinerari">${ic('miei')}</button>` : `<button type="button" class="c-salva" data-azione="salva" aria-label="Salva">${ic('salva', 20)}<span class="c-etic" aria-hidden="true">Salva</span></button>`}</header>
      <div class="c-fumetto" id="fumetto" hidden></div>
      <div class="c-spazio" aria-hidden="true"></div>
      <section class="c-foglio" id="c-foglio" aria-label="Giornata">${this.foglio()}</section>
      <button type="button" class="c-torna" id="c-torna" data-azione="su-mappa" data-nascosto="true">${ic('mappa', 20)}Mappa</button>`;
    },
    foglio() {
      const Gx = G(S.g);
      return `<div class="c-barra" data-inizio-giorno><span class="c-maniglia" aria-hidden="true"></span>
        <div class="c-giorni"><div class="c-tabs" role="tablist" aria-label="Giorni dell'itinerario">${schedeGiorni()}</div><button type="button" class="c-piu" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        <div class="c-riga-azioni"><p class="c-riassunto">${Gx ? `<b>${ora(Gx.inizio)}–${ora(Gx.fine)}</b>${tappe(Gx).length} tappe, ${Gx.spostamenti} min a piedi` : '<b>Giorno vuoto</b>Aggiungi la prima tappa'}</p>
          <button type="button" class="c-azione c-azione--piena" data-azione="aggiungi">${ic('piu', 20)}Aggiungi</button>
          <button type="button" class="c-azione" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi">${ic('altro')}</button></div>
      </div>
      ${Gx ? `<ol class="c-elenco">${Gx.voci.map(v => v.tipo === 'tratto'
        ? `<li class="c-tratto"><i aria-hidden="true"></i><span>${testoTratto(v)}</span></li>`
        : `<li class="c-riga"><button type="button" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="c-n">${v.n}</span><span class="c-ora num">${ora(v.inizio)}</span><span class="c-tit">${esc(T(v.id).nome)}<small>${durata(T(v.id).durata)}${etichette(v.id).length ? `, ${etichette(v.id).join(', ').toLowerCase()}` : ''}</small></span>${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : '<span></span>'}</button></li>`).join('')}</ol>
        ${libero(Gx) > 0 ? `<div class="c-libero"><p>Libero dalle ${ora(Gx.fine)} alle ${ora(Gx.fineScelta)}<small>Ti ${libero(Gx) >= 120 ? 'restano' : 'resta'} ${durataLunga(libero(Gx))}</small></p><button type="button" class="c-azione c-azione--piena" data-azione="aggiungi">${ic('piu', 20)}Aggiungi</button></div>` : ''}`
        : vuoto('c-vuoto', 'c-azione')}
      ${crediti()}`;
    },
    margini() {
      if (computer.matches) return { t: 70, r: 60, b: 60, l: 470 };
      const el = $('#mappa'), sp = $('.c-spazio');
      const visibile = sp ? sp.offsetHeight : 300;
      return { t: 96, r: 34, b: Math.max(60, (el?.clientHeight || 600) - visibile + 36), l: 34 };
    },
    dopo() {
      mappa = new Mappa($('#mappa'), { tocca: id => C.tocca(id, { daMappa: true }), margini: () => C.margini() });
      this.disegnaMappa(false);
      const torna = $('#c-torna');
      const segui = () => { const sp = $('.c-spazio'); if (sp && torna) torna.dataset.nascosto = String(scrollY < sp.offsetHeight - 80); };
      removeEventListener('scroll', C.segui);
      C.segui = segui;
      addEventListener('scroll', segui, { passive: true });
      segui();
    },
    disegnaMappa(vola) {
      const Gx = G(S.g);
      mappa.disegna(Gx, { vola, altre: Gx ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
      if (S.attiva) mappa.evidenzia(S.attiva);
    },
    // il giorno cambia senza ridisegnare la mappa: la mappa vola sul giorno nuovo
    giorno(g) {
      S.g = g; S.attiva = null;
      document.documentElement.dataset.g = String(g);
      $('#fumetto').hidden = true;
      const fai = () => { $('#c-foglio').innerHTML = this.foglio(); };
      if (document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
      this.disegnaMappa(true);
    },
    aggiorna(fn, opz = {}) {
      const prima = S.g;
      fn();
      if (!mappa) { disegna(); return; }
      document.documentElement.dataset.g = String(S.g);
      $('#c-foglio').innerHTML = this.foglio();
      $('.c-sopra').outerHTML = new DOMParser().parseFromString(`<div>${this.html()}</div>`, 'text/html').querySelector('.c-sopra').outerHTML;
      this.disegnaMappa(prima !== S.g || opz.giorno);
      prova();
    },
    tocca(id, { daMappa = false } = {}) {
      S.attiva = id;
      $$('.c-riga button').forEach(b => b.toggleAttribute('aria-current', b.dataset.id === id));
      const Gx = G(S.g), v = Gx && tappe(Gx).find(x => x.id === id);
      if (!v) return;
      const f = $('#fumetto');
      f.innerHTML = `<span class="c-n" aria-hidden="true">${v.n}</span><div><b>${esc(T(id).nome)}</b><small>${ora(v.inizio)}–${ora(v.fine)}, ${durata(T(id).durata)}</small></div><button type="button" class="c-azione" data-azione="scheda" data-id="${id}">Scheda</button><button type="button" class="c-azione" data-azione="tutto-giorno" aria-label="Mostra tutto il giorno">${ic('x', 20)}</button>`;
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
  const ORDINALE = ['Primo', 'Secondo', 'Terzo', 'Quarto', 'Quinto', 'Sesto', 'Settimo'];
  const filo = '<svg class="filo" viewBox="0 0 26 52" aria-hidden="true"><path d="M13 3c-9 7 9 13 0 23s9 16 0 23" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray=".5 5.5" stroke-linecap="round"/></svg>';
  const Dp = {
    nome: 'Le pagine',
    idea: ['Un giorno è una pagina: si sfoglia con il dito, da destra a sinistra, e il segno sotto i numeri segue il dito.',
      'Le tappe sono cartoline con la foto; i tratti a piedi sono scritti a mano. Una barra a icone in basso, come in un\'app: Giorni, Mappa, Aggiungi, I miei, Condividi.',
      'Sul computer la barra diventa una colonna a sinistra, le cartoline si girano di lato e la mappa sta a destra.'],
    html() {
      const pc = computer.matches;
      return `<div class="d-tutto"><div class="d-sinistra">
        <div class="d-testata">${firma()}<button type="button" class="tondo" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></div>
        <div class="d-titolo"><div><h1>${esc(D.nome)}</h1><p>${S.salvato ? `<span class="d-timbro">${ic('spunta', 18)}Salvato in «I miei itinerari»</span>` : 'Non ancora salvato, senza data'}</p></div>${S.salvato ? '' : `<button type="button" class="d-salva" data-azione="salva">${ic('salva', 20)}Salva</button>`}</div>
        <nav class="d-indice" aria-label="Giorni"><div class="d-indice__voci" role="tablist" aria-label="Giorni dell'itinerario">${range(nG()).map(g => `<button type="button" role="tab" aria-selected="${g === S.g}" data-azione="giorno" data-g="${g}" aria-label="Giorno ${g + 1}">${g + 1}</button>`).join('')}<span class="d-indice__segno" id="d-segno" style="transform:translateX(${S.g * PASSO}px)"></span></div><button type="button" class="d-piu" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 22)}</button><span class="d-indice__dove" id="d-dove" aria-live="polite">giorno ${S.g + 1} di ${nG()}</span></nav>
        <div class="d-pagine" id="d-pagine">${range(nG()).map(g => this.pagina(g)).join('')}</div>
      </div>${pc ? '<div class="d-destra"><div id="mappa"></div></div>' : ''}</div>
      ${pc ? '' : `<div class="d-strato" id="d-strato" hidden role="dialog" aria-label="Mappa del giorno"><div class="d-strato__testa"><h2 id="d-strato-t">${ORDINALE[S.g]} giorno</h2><button type="button" class="tondo" data-azione="chiudi-mappa" aria-label="Chiudi la mappa">${ic('x')}</button></div><div id="mappa-d"></div></div>`}
      <nav class="d-tab" aria-label="Comandi dell'itinerario">
        <button type="button" data-azione="giorni">${ic('giorni')}Giorni</button>
        <button type="button" class="d-tab__mappa" data-azione="mappa-d" aria-pressed="false">${ic('mappa')}Mappa</button>
        <button type="button" class="d-tab__piu" data-azione="aggiungi"><span class="cerchio">${ic('piu')}</span>Aggiungi</button>
        <button type="button" data-azione="miei">${ic('miei')}I miei</button>
        <button type="button" data-azione="condividi">${ic('condividi')}Condividi</button>
      </nav>${crediti()}`;
    },
    pagina(g) {
      const Gx = G(g);
      const voci = Gx ? Gx.voci.map(v => {
        if (v.tipo === 'tratto') return `<div class="d-tratto">${filo}<span>${testoTratto(v)}</span></div>`;
        const t = T(v.id);
        return `<button type="button" class="d-cartolina" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}>${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy">` : `<span class="d-senza" aria-hidden="true">${esc(t.breve)}</span>`}<span class="d-cartolina__testo"><span class="d-cartolina__ora num">${ora(v.inizio)}<small>${durata(t.durata)}</small></span><b>${esc(t.nome)}</b><span class="d-frase">${esc(t.frase)}</span>${etichette(v.id).map(e => `<span class="d-et">${e}</span>`).join('')}</span></button>`;
      }).join('') : '';
      const l = Gx ? libero(Gx) : 0;
      return `<section class="d-pagina${g === S.g ? ' attiva' : ''}" data-pagina="${g}" aria-label="Giorno ${g + 1}"${g === S.g ? ' data-inizio-giorno' : ' inert'}><h2>${ORDINALE[g]} giorno<small>${Gx ? esc(titoloGiorno(Gx)) : 'ancora vuoto'}</small></h2>
        ${Gx ? `<p class="d-riassunto">${riassunto(Gx)}</p><div class="d-cartoline">${voci}</div>${l > 0 ? `<div class="d-libero"><p>Ti ${l >= 120 ? 'restano' : 'resta'} ${durataLunga(l)} prima delle ${ora(Gx.fineScelta)}.</p><button type="button" class="d-bottone d-bottone--contorno" data-azione="aggiungi">${ic('piu', 20)}Aggiungi una tappa</button></div>` : ''}` : vuoto('d-vuoto', 'd-bottone')}
        <div class="d-dopo"></div></section>`;
    },
    dopo() {
      const pag = $('#d-pagine');
      const pc = computer.matches;
      if (pc) {
        mappa = new Mappa($('#mappa'), { tocca: id => Dp.tocca(id), margini: () => ({ t: 50, r: 46, b: 46, l: 46 }) });
        mappa.disegna(G(S.g), { altre: G(S.g) ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
        return;
      }
      pag.scrollLeft = S.g * pag.clientWidth;
      this.altezza();
      let fermo;
      pag.addEventListener('scroll', () => {
        const x = pag.scrollLeft / pag.clientWidth;
        $('#d-segno').style.transform = `translateX(${(x * PASSO).toFixed(1)}px)`;
        const g = Math.max(0, Math.min(nG() - 1, Math.round(x)));
        if (g !== S.g) {
          S.g = g; S.attiva = null;
          document.documentElement.dataset.g = String(g);
          $$('.d-indice [role="tab"]').forEach(b => b.setAttribute('aria-selected', String(+b.dataset.g === g)));
          $('#d-dove').textContent = `giorno ${g + 1} di ${nG()}`;
          $$('.d-pagina').forEach(p => { const qui = +p.dataset.pagina === g; p.classList.toggle('attiva', qui); p.toggleAttribute('data-inizio-giorno', qui); p.inert = !qui; });
        }
        clearTimeout(fermo);
        fermo = setTimeout(() => this.altezza(), 140);
      }, { passive: true });
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
    aggiorna(fn, opz = {}) {
      aggiornaTutto(fn, opz);
    },
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
    mappaD = new Mappa($('#mappa-d'), { tocca: id => apriScheda(id), margini: () => ({ t: 40, r: 34, b: 40, l: 34 }) });
    const Gx = G(S.g);
    mappaD.disegna(Gx, { altre: Gx ? [] : range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' })) });
    $('[data-azione="chiudi-mappa"]', s).focus();
  };
  AZ['chiudi-mappa'] = () => { const s = $('#d-strato'); if (s) s.hidden = true; mappaD?.spegni(); mappaD = null; $('.d-tab__mappa')?.setAttribute('aria-pressed', 'false'); $('.d-tab__mappa')?.focus(); };
  addEventListener('keydown', e => { if (e.key === 'Escape' && $('#d-strato') && !$('#d-strato').hidden) AZ['chiudi-mappa'](); });

  const P = { a: A, b: B, c: C, d: Dp };

  // =====================================================================================
  // La striscia della prova: proposta, tema, idea
  // =====================================================================================
  const TEMI = ['auto', 'chiaro', 'scuro'];
  let tema = 'auto';
  try { tema = localStorage.getItem('prova-tema') || 'auto'; } catch {}
  function mettiTema() {
    const r = document.documentElement;
    if (tema === 'auto') delete r.dataset.theme; else r.dataset.theme = tema === 'scuro' ? 'dark' : 'light';
    const b = $('#p-tema');
    b.innerHTML = `${ic(tema === 'auto' ? 'auto' : tema === 'chiaro' ? 'sole' : 'luna', 20)}<span class="vh">Tema </span><span>${tema === 'auto' ? 'Auto' : tema === 'chiaro' ? 'Chiaro' : 'Scuro'}</span>`;
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
    $('#idea').innerHTML = `<h2>${S.p.toUpperCase()} · ${P[S.p].nome}</h2>${P[S.p].idea.map(t => `<p>${esc(t)}</p>`).join('')}<p>Dati veri di «Due giorni a Napoli»: orari e tempi calcolati dal sito (giorno feriale). «Aggiungi» funziona con 4 tappe vicine per giorno.</p>`;
  }
  $$('#prova .p-scelte button').forEach(b => b.addEventListener('click', () => { if (b.dataset.p !== S.p) location.hash = b.dataset.p; }));
  function daHash(primo) {
    const p = location.hash.slice(1);
    const nuovo = P[p] ? p : 'a';
    if (!primo && nuovo === S.p) return;
    removeEventListener('scroll', C.segui || (() => {}));
    // ogni proposta riparte pulita: primo giorno, non salvato, senza aggiunte
    const fai = () => { Object.assign(S, { p: nuovo, g: 0, vista: 'elenco', salvato: false, agg: [null, null], extra: false, attiva: null }); disegna(); scrollTo(0, 0); };
    if (!primo && document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
  }
  addEventListener('hashchange', () => daHash(false));
  computer.addEventListener('change', () => disegna());
  addEventListener('resize', () => { if (S.p === 'd') Dp.altezza(); });

  mettiTema();
  daHash(true);
  // la prima volta si apre la spiegazione della proposta
  try { if (!localStorage.getItem('prova-idea-vista')) { $('#idea').showPopover?.(); localStorage.setItem('prova-idea-vista', '1'); } } catch {}
})();
