// Compositore, pezzo 1, giro 5: A, C e D con le richieste di Enrico dell'08/10/2026 (G tolta), con i dati veri di
// «Due giorni a Napoli» (design/compositore/genera.mjs). Orari, tempi e percorsi vengono dal calcolo del sito (giorno feriale).
// Novità del giro 5: cambio di giorno senza scatti (niente più passaggi tra viste: il giorno che lasci continua il gesto del
// dito ed esce, il nuovo entra dall'altro lato); pause e margini che si cambiano, con il tempo del giorno (visite, cammino,
// pause, margine, fine stimata, tempo che resta); «Chiuso il martedì» solo con la data; tutte le tappe sulla mappa;
// «Rinomina» in «I miei itinerari»; l'itinerario resta sul telefono anche chiudendo la pagina.
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
    const min = `${r} ${r === 1 ? 'minuto' : 'minuti'}`;
    return h ? (r ? `${ore} e ${min}` : ore) : min;
  };
  const resta = m => { const h = Math.floor(m / 60); return `Ti ${h >= 2 || (h === 0 && m !== 1) ? 'restano' : 'resta'} ${durataLunga(m)}`; };
  const metri = m => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`);
  const km = m => (m / 1000).toFixed(1).replace('.', ',');
  const GS = { lun: 'lunedì', mar: 'martedì', mer: 'mercoledì', gio: 'giovedì', ven: 'venerdì', sab: 'sabato', dom: 'domenica' };
  const SETTIMANA = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
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
    orologio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    clessidra: '<path d="M7 3.5h10M7 20.5h10M8 3.5c0 5 8 5 8 8.5s-8 3.5-8 8.5M16 3.5c0 5-8 5-8 8.5s8 3.5 8 8.5"/>',
    biglietto: '<path d="M4 7.5h16v3a1.8 1.8 0 0 0 0 3.6v3H4v-3a1.8 1.8 0 0 0 0-3.6z"/><path d="M14 7.5v10" stroke-dasharray="1.5 2"/>',
    casa: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V19h12V9.5"/>',
    posate: '<path d="M7 3v7.5M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3M7 10.5V21"/><path d="M17.5 21V3c-2.2 1.2-3.5 4-3.5 7.5V13h3.5"/>',
    tazza: '<path d="M4.5 9.5h12v4.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z"/><path d="M16.5 11h1.5a2.5 2.5 0 0 1 0 5h-1.6"/><path d="M8.5 3.5c-.8.9.8 1.6 0 2.6M12.5 3.5c-.8.9.8 1.6 0 2.6"/>',
    panchina: '<path d="M4 11h16M5.5 7h13M6 11v8M18 11v8M4 15h16"/>',
    spilli: '<path d="M9 20.5s-5-4.8-5-8.4a5 5 0 0 1 10 0c0 3.6-5 8.4-5 8.4z"/><circle cx="9" cy="12.1" r="1.6"/><path d="M14.6 3.7a4.6 4.6 0 0 1 5.4 4.5c0 2.6-2.4 5.5-3.6 6.8"/>',
    cursori: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    matita: '<path d="M15.5 4.5l4 4L8.5 19.5H4.5v-4z"/><path d="M13 7l4 4"/>'
  };
  const ic = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[n]}</svg>`;
  // il segnalibro di «Salva»: il contorno e il pieno che sale quando salvi
  const segnalibro = `<svg class="salva__ic" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="salva-clip"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></clipPath></defs><g clip-path="url(#salva-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path class="salva__spunta" d="M9 11.2l2.2 2.2 4-4.4" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ---------- il marchio, con l'animazione della home (DESIGN.md §7, src/components/Marchio.astro) ----------
  const LETTERE = [...'nextstop'];
  // Il segno in tema scuro: il blu notte del marchio sul fondo scuro non si legge. Giro 5: l'ambra di A anche in C e in D
  // (Enrico: in C «giallo come A»; quello avorio di D era sbagliato). Ordine: le sei soglie dalla più esterna, poi segnaposto e buco.
  const AMBRA = { strati: ['#C8702E', '#DE8E43', '#EDAE66', '#F5CB93', '#FBE4C2', '#FFF7EA'], spillo: '#10173A', buco: '#FFF7EA' };
  const SEGNI_SCURI = {
    a: AMBRA,
    c: AMBRA,
    d: AMBRA
  };
  const segnoColorato = c => { const colori = [...c.strati, c.spillo, c.buco]; let k = 0; return D.marchio.chiaro.replace(/fill="#[0-9A-Fa-f]{6}"/g, () => `fill="${colori[Math.min(k++, colori.length - 1)]}"`); };
  const firma = (cl = '') => `<a class="firma ${cl}" href="#${S.p}"><span class="vh">nextstop</span><svg class="firma__segno segno--chiaro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${D.marchio.chiaro}</svg><svg class="firma__segno segno--scuro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${segnoColorato(SEGNI_SCURI[S.p] ?? AMBRA)}</svg><span class="firma__parola" aria-hidden="true">${LETTERE.map((c, i) => (i === 6
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

  // =====================================================================================
  // Stato della prova. L'itinerario resta sul telefono (anche prima di «Salva», come dice la specifica: «Non ancora
  // salvato»); dopo «Salva» resta salvato anche se chiudi la pagina e la riapri (richiesta di Enrico, giro 5).
  // =====================================================================================
  const CHIAVE = 'prova-itinerario-5';
  function richiama() {
    try {
      const x = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
      if (x && typeof x === 'object') return { nome: typeof x.nome === 'string' && x.nome.trim() ? x.nome : D.nome, salvato: !!x.salvato, agg: Array.isArray(x.agg) ? x.agg : [null, null], extra: !!x.extra, pause: x.pause && typeof x.pause === 'object' ? x.pause : {}, margine: [0, 5, 10, 15].includes(x.margine) ? x.margine : 0, data: typeof x.data === 'string' ? x.data : null };
    } catch {}
    return {};
  }
  function ricorda() {
    if (S.eliminato) return;
    try { localStorage.setItem(CHIAVE, JSON.stringify({ nome: S.nome, salvato: S.salvato, agg: S.agg, extra: S.extra, pause: S.pause, margine: S.margine, data: S.data, quando: Date.now() })); } catch {}
  }
  const dimentica = () => { try { localStorage.removeItem(CHIAVE); } catch {} };
  const NUOVO = () => ({ g: 0, vista: 'elenco', nome: D.nome, salvato: false, eliminato: false, agg: [null, null], extra: false, pause: {}, margine: 0, data: null, tutte: false, attiva: null, nuova: null, anima: true, fini: {}, ...richiama() });
  const S = { p: 'a', ...NUOVO() };
  const nG = () => D.giorni.length + (S.extra ? 1 : 0);
  // la giornata calcolata dal sito (con la tappa aggiunta in fondo, se c'è), prima di pause e margini
  function grezzo(g, id = S.agg[g]) {
    const base = D.giorni[g];
    if (!base) return null;
    if (!id) return base;
    const a = D.aggiunte[g][id];
    return { ...base, voci: [...base.voci, a.tratto, a.tappa], linee: [...base.linee, ...a.linee], fine: a.fine, visite: a.visite, spostamenti: a.spostamenti, metri: a.metri, avvisi: a.avvisi };
  }
  const G = g => conTempo(grezzo(g), g);
  const tappe = Gx => Gx.voci.filter(v => v.tipo === 'tappa');
  const T = id => D.tappe[id];
  const ultimaDi = g => tappe(D.giorni[g]).slice(-1)[0].id;
  const titoloGiorno = Gx => [...new Set(tappe(Gx).map(v => T(v.id).zona))].join(', ');
  const aPiedi = Gx => Gx.voci.every(v => v.tipo !== 'tratto' || !v.mezzi.length);
  const riassunto = Gx => `Dalle ${ora(Gx.inizio)} alle <span data-conta="fine">${ora(Gx.fine)}</span>: ${tappe(Gx).length} tappe, ${Gx.spostamenti} minuti ${aPiedi(Gx) ? 'a piedi' : 'di spostamenti'} (${metri(Gx.metri)})${Gx.pauseMin ? `, ${durataLunga(Gx.pauseMin)} di pause` : ''}.`;
  const testoTratto = v => (v.mezzi.length ? `${v.min} min, a piedi e ${v.mezzi.join(' e ')}` : `${v.min} min a piedi, ${metri(v.metri)}`);

  // ---------- la data: senza data i giorni di chiusura restano solo nella scheda della tappa (Enrico, giro 5) ----------
  const dataDi = g => { const d = new Date(`${S.data}T12:00:00`); d.setDate(d.getDate() + g); return d; };
  const giornoSett = g => SETTIMANA[dataDi(g).getDay()];
  const dataLunga = g => dataDi(g).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  const testoQuando = () => (S.data ? `Da ${dataLunga(0)}, dalle 9:30 alle 19:00` : 'Senza data, dalle 9:30 alle 19:00');
  const chiuseDi = g => { const Gx = G(g); return S.data && Gx ? tappe(Gx).filter(v => T(v.id).chiuso.includes(giornoSett(g))).map(v => v.id) : []; };
  const etichette = (id, g = S.g) => {
    const t = T(id), out = [];
    if (S.data && t.chiuso.includes(giornoSett(g))) out.push(`Chiuso ${dataLunga(g)}`);
    if (t.prenotazione === 'obbligatoria') out.push('Si entra solo prenotando');
    return out;
  };
  const avvisiGiorno = Gx => Gx.avvisi.map(a => {
    if (a.tipo === 'piena') return `Finisci alle ${ora(a.fine)}, dopo le ${ora(a.limite)} che hai scelto. Togli una pausa, accorcia il margine o sposta una tappa.`;
    if (a.tipo === 'lontana') return `${T(a.id)?.breve ?? a.id} è lontana dalle altre tappe: circa ${a.extra} minuti in più.`;
    return '';
  }).filter(Boolean);
  const suggerite = (g, n = 3) => (g < D.giorni.length ? D.vicine[g].filter(id => id !== S.agg[g]).slice(0, n) : []);
  const crediti = () => `<details class="crediti"><summary>Crediti delle foto e della mappa</summary><p>Mappa: dati © i contributori di OpenStreetMap (ODbL). Foto: ${Object.entries(D.crediti).map(([id, c]) => `${esc(T(id)?.breve ?? id)}, ${esc(c.autore)} (${esc(c.licenza)})`).join('; ')}.</p></details>`;

  // =====================================================================================
  // Pause e margini (richiesta di Enrico, giro 5). La giornata del sito va da una tappa all'altra senza fermarsi: la pausa
  // pranzo c'è già (dopo la tappa che finisce più vicino alle 13, o dopo quella dove si mangia), e si cambia; il margine
  // si aggiunge dopo ogni tratto (foto, code, passo lento). Tutto sposta gli orari dopo; i tempi a piedi restano quelli veri.
  // =====================================================================================
  const TIPI_PAUSA = {
    pranzo: { nome: 'Pausa pranzo', ic: 'posate', min: 60, ora: 780, scelte: [30, 45, 60, 90] },
    caffe: { nome: 'Pausa caffè', ic: 'tazza', min: 20, ora: 990, scelte: [15, 20, 30] },
    riposo: { nome: 'Riposo', ic: 'panchina', min: 30, ora: 930, scelte: [15, 30, 45, 60] }
  };
  const MARGINI = [0, 5, 10, 15];
  const pranzoServe = Gx => tappe(Gx).length > 1 && Gx.inizio < 870 && Gx.fine > 750;
  const pauseDi = (g, Gx) => S.pause[g] ?? (Gx && pranzoServe(Gx) ? [{ quale: 'pranzo', min: TIPI_PAUSA.pranzo.min, dopo: null }] : []);
  // dove va una pausa senza posto scelto: mai dopo l'ultima tappa; il pranzo dopo la tappa dove si mangia (se finisce
  // tra le 11:45 e le 14:30), altrimenti dopo quella che finisce più vicino all'ora della pausa
  function postoPausa(quale, tp, fineA) {
    const candidati = tp.slice(0, -1);
    if (!candidati.length) return null;
    if (quale === 'pranzo') { const cibo = candidati.find(v => T(v.id).generi.includes('cibo') && fineA[v.id] >= 705 && fineA[v.id] <= 870); if (cibo) return cibo.id; }
    const o = TIPI_PAUSA[quale].ora;
    return candidati.reduce((a, b) => (Math.abs(fineA[b.id] - o) < Math.abs(fineA[a.id] - o) ? b : a)).id;
  }
  function conTempo(Gx, g) {
    if (!Gx) return null;
    const m = S.margine || 0, tp = tappe(Gx);
    // 1. orari con il margine, per mettere le pause senza posto scelto
    let t = Gx.inizio;
    const fineA = {};
    for (const v of Gx.voci) { if (v.tipo === 'tratto') t += v.min + m; else { t += v.fine - v.inizio; fineA[v.id] = t; } }
    const ultima = tp.slice(-1)[0]?.id;
    const lista = pauseDi(g, Gx).map(p => ({ ...p, dove: p.dopo && p.dopo !== ultima && fineA[p.dopo] != null ? p.dopo : postoPausa(p.quale, tp, fineA) })).filter(p => p.dove);
    // 2. orari finali: tappe, tratti, margini e pause in fila
    t = Gx.inizio;
    const voci = [], fasi = [], pause = [];
    let mar = 0, pau = 0, vis = 0;
    for (const v of Gx.voci) {
      if (v.tipo === 'tratto') {
        fasi.push({ tipo: 'cammino', da: t, a: t + v.min });
        voci.push({ ...v, inizio: t });
        t += v.min;
        if (m) { fasi.push({ tipo: 'margine', da: t, a: t + m }); t += m; mar += m; }
        continue;
      }
      const d = v.fine - v.inizio;
      voci.push({ ...v, inizio: t, fine: t + d });
      fasi.push({ tipo: 'visita', da: t, a: t + d });
      t += d; vis += d;
      for (const p of lista.filter(p => p.dove === v.id)) {
        pause.push({ ...p, inizio: t, fine: t + p.min });
        fasi.push({ tipo: 'pausa', da: t, a: t + p.min });
        t += p.min; pau += p.min;
      }
    }
    const avvisi = Gx.avvisi.filter(a => a.tipo !== 'piena');
    if (t > Gx.fineScelta) avvisi.unshift({ tipo: 'piena', fine: t, limite: Gx.fineScelta });
    return { ...Gx, voci, fine: t, pause, fasi, visite: vis, pauseMin: pau, margineMin: mar, totale: t - Gx.inizio, resta: Gx.fineScelta - t, avvisi };
  }
  // le voci della giornata con le pause al loro posto (le linee della mappa restano legate alle voci: le pause stanno a parte)
  const sequenza = Gx => Gx.voci.flatMap(v => (v.tipo === 'tappa' ? [v, ...Gx.pause.filter(p => p.dove === v.id).map(p => ({ ...p, tipo: 'pausa' }))] : [v]));
  function cambiaPause(g, fn) {
    const lista = (S.pause[g] ?? pauseDi(g, grezzo(g))).map(p => ({ ...p }));
    fn(lista);
    P[S.p].aggiorna(() => { S.pause = { ...S.pause, [g]: lista }; });
  }

  // ---------- i numeri del giorno e il tempo del giorno; quando cambiano scorrono dal valore di prima al nuovo ----------
  // (in D ogni pagina ha i suoi: la chiave ha il giorno dopo la «@»)
  const cifre = (Gx, cl = 'cifre', suf = '') => `<dl class="${cl}"><div><dt>tappe</dt><dd class="num" data-cifra="tappe${suf}" data-n="${tappe(Gx).length}">${tappe(Gx).length}</dd></div><div><dt>minuti ${aPiedi(Gx) ? 'a piedi' : 'di strada'}</dt><dd class="num" data-cifra="piedi${suf}" data-n="${Gx.spostamenti}">${Gx.spostamenti}</dd></div><div><dt>chilometri</dt><dd class="num" data-cifra="km${suf}" data-n="${Gx.metri}">${km(Gx.metri)}</dd></div><div><dt>fine stimata</dt><dd class="num" data-cifra="fine${suf}" data-n="${Gx.fine}">${ora(Gx.fine)}</dd></div></dl>`;
  const nessuno = (m, parola = 'nessuno') => (Math.round(m) ? durata(Math.round(m)) : parola);
  const FORMA_CIFRA = { tappe: n => String(Math.round(n)), piedi: n => String(Math.round(n)), km: n => km(n), fine: n => ora(Math.round(n)), visite: n => durata(Math.round(n)), cammino: n => durata(Math.round(n)), pause: n => nessuno(n, 'nessuna'), margine: n => nessuno(n), totale: n => durata(Math.round(n)), resta: n => durata(Math.abs(Math.round(n))) };
  function contaCifre() {
    const seen = {};
    for (const el of $$('[data-cifra]')) {
      const k = el.dataset.cifra, n = +el.dataset.n, da = S.cifre?.[k];
      seen[k] ??= n;
      if (da == null || da === n || !piano()) continue;
      const forma = FORMA_CIFRA[k.split('@')[0]], t0 = performance.now(), dur = 820;
      const passo = now => { const q = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - q, 3); el.textContent = forma(da + (n - da) * e); if (q < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }
    S.cifre = { ...(S.cifre || {}), ...seen };
  }
  const NOMI_FASE = { visita: 'Visite', cammino: 'A piedi', pausa: 'Pause', margine: 'Margine' };
  // Il tempo del giorno: una barra con la giornata in fila (visite, cammino, pause, margine) fino all'ora scelta,
  // e sotto quanto dura ogni cosa, il totale e quanto resta (o di quanto sfori)
  function tempo(Gx, cl = '', { suf = '', bottone = true } = {}) {
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
      <div class="tempo__ore" aria-hidden="true"><span class="num">${ora(Gx.inizio)}</span>${Gx.fine > Gx.fineScelta ? `<span class="num tempo__ora-fine tempo__ora-fine--oltre">fine ${ora(Gx.fine)}</span>` : `<span class="num tempo__ora-fine">${ora(Gx.fineScelta)}</span>`}</div>
      <dl class="tempo__voci">${voce('visita', Gx.visite, durata(Gx.visite))}${voce('cammino', Gx.spostamenti, durata(Gx.spostamenti))}${voce('pausa', Gx.pauseMin, nessuno(Gx.pauseMin, 'nessuna'))}${voce('margine', Gx.margineMin, nessuno(Gx.margineMin))}</dl>
    </div>`;
  }

  // =====================================================================================
  // La mappa: la mappa del sito (OpenStreetMap), più le strade piccole della zona (vicoli, pedonali, scale) e i nomi delle vie.
  // Si sposta con il dito o con il mouse e si ingrandisce (due dita, rotella, + e −). Il percorso si disegna in fila,
  // dalla tappa 1 all'ultima, sempre alla stessa velocità; ogni tappa compare quando il tratto ci arriva.
  // Giro 5: il tasto con i due segnaposto mostra tutte le tappe della città (punti piccoli, si toccano per la scheda).
  // =====================================================================================
  let nMappe = 0;
  const VELOCITA = 0.327;   // pixel al millisecondo: giro 4 più veloce del 10%, poi di un altro 10% (Enrico, giro 5)
  const numeri = d => (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const puntiDi = d => { const n = numeri(d), p = []; for (let i = 0; i + 1 < n.length; i += 2) p.push([n[i], n[i + 1]]); return p; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function riquadroXY(pts) {
    if (!pts.length) return { x1: 1850, x2: 2050, y1: 500, y2: 900 };
    let x1 = Math.min(...pts.map(p => p[0])), x2 = Math.max(...pts.map(p => p[0])), y1 = Math.min(...pts.map(p => p[1])), y2 = Math.max(...pts.map(p => p[1]));
    const minimo = 110;
    if (x2 - x1 < minimo) { const c = (x1 + x2) / 2; x1 = c - minimo / 2; x2 = c + minimo / 2; }
    if (y2 - y1 < minimo) { const c = (y1 + y2) / 2; y1 = c - minimo / 2; y2 = c + minimo / 2; }
    return { x1, x2, y1, y2 };
  }
  const riquadroDi = lista => riquadroXY(lista.flatMap(Gx => [...tappe(Gx).map(v => v.xy), ...Gx.linee.flatMap(l => puntiDi(l.d))]));
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
  // le tappe della città che non sono nel giorno: quelle degli altri giorni e quelle da aggiungere
  const puntiPer = Gx => Object.keys(D.tappe).filter(id => T(id).xy && !(Gx && tappe(Gx).some(v => v.id === id)));
  const nelViaggio = id => range(nG()).some(k => { const X = grezzo(k); return X && tappe(X).some(v => v.id === id); });
  class Mappa {
    constructor(el, opz = {}) {
      this.el = el; this.opz = opz; this.tappe = []; this.vb = null; this.fuoco = null; this.n = ++nMappe; this.dita = new Map(); this.tutte = false; this.idsPunti = [];
      el.classList.add('m');
      const nomi = ST.etichette.map((e, i) => `<path id="m${this.n}n${i}" d="${e.d}"/><text class="m-nome" data-l="${e.L}" data-c="${e.nome.length}"><textPath href="#m${this.n}n${i}" startOffset="50%" text-anchor="middle">${esc(e.nome)}</textPath></text>`).join('');
      const tasto = opz.tutte ? `<button type="button" data-z="tutte" aria-pressed="false" aria-label="Mostra tutte le tappe della città">${ic('spilli', 20)}</button>` : '';
      el.innerHTML = `<svg class="m-svg" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <rect class="m-terra" x="-6000" y="-6000" width="16000" height="16000"/><path class="m-mare" d="${M.mare}"/><path class="m-isole" d="${M.isole}"/><path class="m-parco" d="${M.parchi}"/>
        <path class="m-s0" d="${M.strade[0]}"/><path class="m-s1c" d="${M.strade[1]}"/><path class="m-s2c" d="${M.strade[2]}"/><path class="m-s1" d="${M.strade[1]}"/><path class="m-s2" d="${M.strade[2]}"/><path class="m-moli" d="${M.moli}"/>
        <g class="m-fine"><path class="m-vicoli" d="${ST.vicoli}"/><path class="m-pedonali" d="${ST.pedonali}"/><path class="m-medie-c" d="${ST.medie}"/><path class="m-grandi-c" d="${ST.grandi}"/><path class="m-medie" d="${ST.medie}"/><path class="m-grandi" d="${ST.grandi}"/><path class="m-scale" d="${ST.scale}"/></g>
        <g class="m-nomi">${nomi}</g>
        <g class="m-altre"></g><g class="m-rotta"></g><g class="m-fili"></g></svg><div class="m-punti"></div><div class="m-segni"></div>
        <div class="m-ctrl">${tasto}<button type="button" data-z="piu" aria-label="Ingrandisci la mappa">${ic('piu', 20)}</button><button type="button" data-z="meno" aria-label="Rimpicciolisci la mappa">${ic('meno', 20)}</button><button type="button" data-z="tutto" aria-label="Mostra tutto il giorno">${ic('centra', 20)}</button></div>
        <p class="m-osm">© OpenStreetMap</p>`;
      this.svg = $('svg', el);
      this.nomi = $$('.m-nome', el);
      this.ro = new ResizeObserver(() => { if (this.box && !this.mosso) this.adatta(false); else if (this.vb) this.metti(this.limita(this.vb)); });
      this.ro.observe(el);
      $('.m-ctrl', el).addEventListener('click', e => {
        const b = e.target.closest('[data-z]');
        if (!b) return;
        if (b.dataset.z === 'tutte') this.mostraTutte(!this.tutte);
        else if (b.dataset.z === 'tutto') this.tutto();
        else this.zoom(b.dataset.z === 'piu' ? 1.6 : 1 / 1.6);
      });
      // spostare con un dito o con il mouse, ingrandire con due dita o con la rotella
      el.addEventListener('pointerdown', e => this.giu(e));
      el.addEventListener('pointermove', e => this.muovi(e));
      el.addEventListener('pointerup', e => this.su(e));
      el.addEventListener('pointercancel', e => this.su(e));
      el.addEventListener('wheel', e => { e.preventDefault(); const r = el.getBoundingClientRect(); this.zoom(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top, false); }, { passive: false });
      el.addEventListener('dblclick', e => { if (e.target.closest('.m-segno, .m-punto, .m-ctrl')) return; const r = el.getBoundingClientRect(); this.zoom(1.8, e.clientX - r.left, e.clientY - r.top); });
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
      let w = Math.max(W / 9, Math.min(W / 0.25, vb.w)), h = w * H / W;
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
    disegna(Gx, { altre = [], vola = false, n = null, disegna = true, daLinea = null, punti = null } = {}) {
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
      this.punti(punti ?? (this.opz.tutte ? puntiPer(Gx) : []));
      if (this.opz.tutte) this.mostraTutte(this.opz.tutte(Gx), false);
      this.adatta(vola);
    }
    // i punti delle altre tappe: piccoli, sotto i segni del giorno; il nome compare quando ingrandisci
    punti(ids) {
      this.idsPunti = ids;
      $('.m-punti', this.el).innerHTML = ids.map(id => `<button type="button" class="m-punto${nelViaggio(id) ? ' m-punto--viaggio' : ''}" data-id="${id}" aria-label="${esc(T(id).nome)}: apri la scheda"><span class="m-punto__f" aria-hidden="true">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" decoding="async">` : `<i>${esc(T(id).breve.slice(0, 1))}</i>`}</span><span class="m-punto__n" aria-hidden="true">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" decoding="async">` : ''}<b>${esc(T(id).breve)}</b></span></button>`).join('');
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
    // inquadra i punti (e il giorno): per vedere dove sono tutte le tappe
    inquadra(dur = 700, ids = this.idsPunti) {
      this.fuoco = null; this.mosso = true;
      const fine = this.vbPer(riquadroXY([...ids.map(id => T(id).xy), ...this.tappe.map(v => v.xy)]));
      if (piano() && this.vb && dur > 0) this.vola(fine, dur); else { cancelAnimationFrame(this.raf); this.metti(fine); this.nomiVisibili(); }
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
      this.el.classList.toggle('m--vicino', s > 2.3);
      this.s = s;
      this.segni();
    }
    nomiVisibili() { for (const t of this.nomi) t.classList.toggle('m-nome--su', +t.dataset.l * this.s > +t.dataset.c * 6.4 + 36 && this.s > 1.4); }
    // il percorso in fila: un tratto comincia quando finisce quello prima, sempre alla stessa velocità;
    // una tappa compare quando il tratto ci arriva
    traccia(da) {
      const penne = $$(this.opz.traccia || '.m-l', this.svg), punti = $$('.m-l', this.svg), segni = $$('.m-segno', this.el);
      $$('.m-nuova', this.svg).forEach(p => p.classList.remove('m-nuova'));
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
        const l = this.linee[i], prossima = this.linee[i + 1];
        if (!l.dentro && (!prossima || prossima.v !== l.v)) { const k = tappaDi.get(l.tappaDopo); if (k != null && k >= 0) mostra(k, t - 60); }
      }
      segni.forEach((s, i) => mostra(i, t));
    }
    // segni senza sovrapposizioni: si allontanano quanto basta e un filo li lega al punto vero
    segni() {
      const s = this.s;
      const pos = this.tappe.map(v => { const x = (v.xy[0] - this.vb.x) * s, y = (v.xy[1] - this.vb.y) * s; return { x, y, x0: x, y0: y }; });
      // con «tutte le tappe» anche le foto delle altre tappe si fanno spazio (più piccole quelle già nel viaggio)
      const punti = this.tutte ? $$('.m-punto', this.el) : [];
      for (const b of punti) { const xy = T(b.dataset.id).xy, x = (xy[0] - this.vb.x) * s, y = (xy[1] - this.vb.y) * s; pos.push({ x, y, x0: x, y0: y, r: b.classList.contains('m-punto--viaggio') ? 12 : 16 }); }
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
      punti.forEach((b, i) => { const p = pos[nT + i]; b.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`; b.classList.toggle('m-punto--sotto', p.y < 150); });
    }
    centra(id) {
      const v = this.tappe.find(t => t.id === id);
      const xy = v ? v.xy : T(id)?.xy;
      if (!xy) return;
      const r = 50;
      this.fuoco = { x1: xy[0] - r, x2: xy[0] + r, y1: xy[1] - r, y2: xy[1] + r };
      this.vola(this.vbPer(this.fuoco), 780);
      this.evidenzia(id);
    }
    tutto() { this.fuoco = null; this.mosso = false; this.vola(this.vbPer(this.box), 700); this.evidenzia(null); }
    evidenzia(id) { $$('.m-segno, .m-punto', this.el).forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id))); }
    spegni() { this.ro.disconnect(); cancelAnimationFrame(this.raf); }
  }

  // =====================================================================================
  // Pezzi comuni: foglio che sale (si chiude anche tirandolo giù), avviso in basso
  // =====================================================================================
  const foglioEl = $('#foglio');
  let mappaF = null;   // la mappa dentro «Aggiungi»
  const spegniMappaF = () => { mappaF?.spegni(); mappaF = null; };
  function foglio(titolo, corpo, dopoAperto, cl = '') {
    spegniMappaF();
    foglioEl.className = cl;
    foglioEl.innerHTML = `<div class="f-testa"><span class="f-maniglia" aria-hidden="true"></span><h2 id="f-titolo">${esc(titolo)}</h2><button type="button" class="f-chiudi" aria-label="Chiudi">${ic('x')}</button></div><div class="f-corpo">${corpo}</div>`;
    $('.f-chiudi', foglioEl).onclick = () => chiudiFoglio();
    foglioEl.onclick = null; foglioEl.onchange = null; foglioEl.onkeydown = null;
    foglioEl.style.translate = '';
    if (!foglioEl.open) foglioEl.showModal();
    dopoAperto?.(foglioEl);
  }
  async function chiudiFoglio() {
    if (!foglioEl.open) return;
    if (piano()) { foglioEl.classList.add('f-esce'); await dopo(240); foglioEl.classList.remove('f-esce'); }
    foglioEl.close();
    spegniMappaF();
  }
  foglioEl.addEventListener('click', e => { if (e.target === foglioEl) chiudiFoglio(); });
  foglioEl.addEventListener('cancel', e => { e.preventDefault(); chiudiFoglio(); });
  let tiro = null;
  foglioEl.addEventListener('pointerdown', e => { if (!e.target.closest('.f-testa') || e.target.closest('button')) return; tiro = { y: e.clientY }; foglioEl.setPointerCapture(e.pointerId); });
  foglioEl.addEventListener('pointermove', e => { if (!tiro) return; foglioEl.style.translate = `0 ${Math.max(0, e.clientY - tiro.y)}px`; });
  foglioEl.addEventListener('pointerup', e => { if (!tiro) return; const dy = e.clientY - tiro.y; tiro = null; foglioEl.style.translate = ''; if (dy > 90) { foglioEl.close(); spegniMappaF(); } });
  // dentro un foglio che si aggiorna mentre lo usi: il pulsante toccato resta quello con il fuoco
  function rinfresca(f, html, b) {
    const sel = b ? `[data-f="${b.dataset.f}"]${b.dataset.v != null ? `[data-v="${b.dataset.v}"]` : ''}` : null;
    const vivo = $('#f-vivo', f);
    if (!vivo) return;
    vivo.innerHTML = html;
    contaCifre();
    if (sel) ($(sel, f) || $('button', vivo))?.focus({ preventScroll: true });
  }

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
  const mettiNome = () => $$('[data-nome]').forEach(x => { x.textContent = S.nome; });

  // =====================================================================================
  // La scheda della tappa: si apre subito al tocco; la foto «vola» da dove l'hai toccata alla scheda, poi le righe entrano
  // una dopo l'altra. Giro 5: «Chiuso il martedì» è un'informazione del luogo (sempre qui); con la data, se quel giorno è
  // chiuso, lo dice in rosso. Dalla mappa con tutte le tappe: la scheda ha «Aggiungi al giorno».
  // =====================================================================================
  function apriScheda(id, sorgente) {
    const t = T(id), g = S.g, Gx = G(g), v = Gx && tappe(Gx).find(x => x.id === id);
    const altrove = v ? null : range(nG()).filter(k => k !== g).map(k => [k, G(k)]).find(([, X]) => X && tappe(X).some(x => x.id === id));
    const va = altrove && tappe(altrove[1]).find(x => x.id === id);
    const nuova = !v && !altrove ? D.aggiunte[g]?.[id] : null;
    const gChiuso = v ? g : altrove ? altrove[0] : g;
    const fatti = [
      v ? ['orologio', `Nel giorno ${g + 1}, dalle ${ora(v.inizio)} alle ${ora(v.fine)}`] : va ? ['orologio', `Nel giorno ${altrove[0] + 1}, dalle ${ora(va.inizio)} alle ${ora(va.fine)}`] : nuova ? ['piedi', `${nuova.tratto.min} min a piedi da ${esc(T(ultimaDi(g)).breve)}, l'ultima tappa del giorno ${g + 1}`] : null,
      ['clessidra', `Visita di ${durata(t.durata)}`], ['biglietto', INGRESSO[t.ingresso] ?? ''], ['casa', DENTRO[t.alChiuso] ?? ''],
      t.chiuso.length ? ['calendario', `Chiuso il ${t.chiuso.map(x => GS[x]).join(' e il ')}`] : null,
      S.data && t.chiuso.includes(giornoSett(gChiuso)) ? ['attenzione', `Chiuso ${dataLunga(gChiuso)}: è il giorno ${gChiuso + 1} del tuo itinerario`] : null,
      t.prenotazione === 'obbligatoria' ? ['attenzione', 'Si entra solo prenotando'] : null
    ].filter(Boolean);
    const azione = S.agg[g] === id
      ? `<button type="button" class="f-bottone f-bottone--contorno" data-f="togli">Togli dal giorno ${g + 1}</button>`
      : nuova ? `<button type="button" class="f-bottone" data-f="aggiungi">${ic('piu', 20)}Aggiungi al giorno ${g + 1}</button>`
        : !v && !altrove ? `<p class="f-nota">Nella prova le tappe si aggiungono ai giorni 1 e 2.</p>` : '';
    const corpo = `${FOTO[id] ? `<div class="f-scheda-cornice"><img class="f-scheda-foto" src="${FOTO[id]}" alt=""></div>` : ''}
      <p class="f-scheda-frase">${esc(t.frase)}</p>
      <ul class="f-fatti">${fatti.map(([i, x], k) => `<li class="${i === 'attenzione' ? 'f-fatto--attenzione' : ''}" style="--k:${k}">${ic(i, 18)}<span>${x}</span></li>`).join('')}</ul>
      ${azione}
      <p class="f-nota">Prova: la scheda vera della tappa (foto, orari, prezzi, storia e fonti) è il pezzo 2.</p>`;
    const img = sorgente?.querySelector?.('img');
    const apri = vola => foglio(t.nome, corpo, f => {
      if (vola) $('.f-scheda-foto', f).style.viewTransitionName = 'foto-scheda';
      f.onclick = async e => {
        if (e.target === f) chiudiFoglio();
        if (e.target.closest('[data-f="togli"]')) { chiudiFoglio(); togli(g); }
        if (e.target.closest('[data-f="aggiungi"]')) { await chiudiFoglio(); aggiungi(g, id); }
      };
    }, `f--scheda${vola ? ' f--vola' : ''}`);
    if (img && FOTO[id] && document.startViewTransition && piano()) {
      img.style.viewTransitionName = 'foto-scheda';
      const vt = document.startViewTransition(() => { img.style.viewTransitionName = ''; apri(true); });
      vt.ready.catch(() => {});
      vt.finished.catch(() => {}).finally(() => { const f = $('.f-scheda-foto', foglioEl); if (f) f.style.viewTransitionName = ''; });
    } else apri(false);
  }

  // =====================================================================================
  // «Aggiungi»: tutte le tappe, dalla più vicina, in elenco o sulla mappa (giro 5). A e C hanno la stessa ricerca
  // (il campo si allarga e il testo d'esempio si scrive da solo: scelta di Enrico); D il foglietto.
  // =====================================================================================
  const FILTRI = [
    ['tutte', 'Tutte', () => true], ['musei', 'Musei', t => t.generi.some(g => g === 'museo' || g === 'archeologia')], ['chiese', 'Chiese', t => t.generi.includes('chiesa')],
    ['panorami', 'Panorami', t => t.generi.includes('panorama')], ['sotto', 'Sottoterra', t => t.generi.includes('sotterraneo')], ['verde', 'Parchi e mare', t => t.generi.some(g => g === 'parco' || g === 'mare')],
    ['passeggiate', 'Passeggiate', t => t.generi.includes('passeggiata')], ['gratis', 'Gratis', t => t.ingresso === 'gratis']
  ];
  function scriviSegnaposto(input, testo) {
    if (!piano()) { input.placeholder = testo; return; }
    let i = 0;
    input.placeholder = '';
    const t = setInterval(() => { if (!input.isConnected || input.value) { clearInterval(t); input.placeholder = testo; return; } input.placeholder = testo.slice(0, ++i); if (i >= testo.length) clearInterval(t); }, 34);
  }
  const prontiLista = () => `<div class="f-azioni">${D.altri.map(a => `<button type="button" class="f-azione" data-f="pronto"><span>${esc(a.nome)}<small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></span></button>`).join('')}</div>`;
  function apriAggiungi() {
    const g = S.g;
    if (g >= D.giorni.length) {
      foglio('Aggiungi una tappa', `<p class="f-nota">Nella prova le tappe si aggiungono ai giorni 1 e 2. Per il giorno ${g + 1} puoi partire da un itinerario pronto; sulla mappa, con il tasto dei due segnaposto, vedi tutte le tappe della città.</p>${prontiLista()}`, f => { f.onclick = e => { if (e.target === f) chiudiFoglio(); if (e.target.closest('[data-f="pronto"]')) { chiudiFoglio(); AZ.pronto(); } }; });
      return;
    }
    const ultima = T(ultimaDi(g)).breve;
    let filtro = 'tutte', q = '', vista = 'elenco', scelta = null;
    const ids = () => { const ok = FILTRI.find(f => f[0] === filtro)[2]; return D.vicine[g].filter(id => ok(T(id)) && (!q || norma(`${T(id).nome} ${T(id).breve} ${T(id).zona}`).includes(norma(q)))); };
    const avvisiDi = id => {
      const X = conTempo(grezzo(g, id), g), out = [];
      if (X.fine > X.fineScelta) out.push(`Finiresti alle ${ora(X.fine)}`);
      if (D.aggiunte[g][id].avvisi.some(x => x.tipo === 'lontana' && x.id === id)) out.push('Lontana dalle altre');
      return out;
    };
    const etich = id => [...avvisiDi(id).map(x => `<span class="f-et f-et--attenzione">${x}</span>`), ...etichette(id, g).map(x => `<span class="f-et">${x}</span>`)].join('');
    const bottone = id => { const dentro = S.agg[g] === id; return `<button type="button" class="f-piu${dentro ? ' f-piu--dentro' : ''}" data-f="agg" data-id="${id}" aria-label="${dentro ? 'Togli' : 'Aggiungi'} ${esc(T(id).breve)} ${dentro ? 'dal' : 'al'} giorno ${g + 1}">${dentro ? ic('spunta', 20) : ic('piu', 20)}</button>`; };
    const riga = (id, i) => {
      const t = T(id), a = D.aggiunte[g][id];
      return `<li class="f-tappa" style="--i:${Math.min(i, 12)}">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" loading="lazy" decoding="async">` : `<span class="f-senza" aria-hidden="true">${esc(t.breve.slice(0, 1))}</span>`}
        <div><b>${esc(t.nome)}</b><small><span class="num">${a.tratto.min} min</span> a piedi da ${esc(ultima)}, ${durata(t.durata)} di visita</small>${etich(id)}</div>${bottone(id)}</li>`;
    };
    const elenco = () => {
      const lista = ids();
      if (!lista.length) return `<p class="f-nota">Nessuna tappa con queste parole. Prova a togliere il filtro.</p>`;
      const gruppi = [['A meno di 10 minuti a piedi', lista.filter(id => D.aggiunte[g][id].tratto.min < 10)], ['Tra 10 e 25 minuti', lista.filter(id => { const m = D.aggiunte[g][id].tratto.min; return m >= 10 && m < 25; })], ['Più lontane', lista.filter(id => D.aggiunte[g][id].tratto.min >= 25)]];
      let i = 0;
      return gruppi.filter(x => x[1].length).map(([tit, l]) => `<section class="f-gruppo"><h3>${tit} <span class="num">${l.length}</span></h3><ul>${l.map(id => riga(id, i++)).join('')}</ul></section>`).join('');
    };
    // sulla mappa: tocchi una foto e sulla mappa, in basso, compare la sua scheda corta con «Aggiungi»: tutto nella stessa schermata
    const schedina = id => {
      if (!id) return `<p class="f-scelta__vuota">${ic('spilli', 18)}<span>Tocca una foto: vedi la tappa e la aggiungi. ${ids().length} tappe sulla mappa.</span></p>`;
      const t = T(id), a = D.aggiunte[g][id], dentro = S.agg[g] === id;
      return `<div class="f-scelta__c">${FOTO[id] ? `<img src="${FOTO[id]}" alt="">` : `<span class="f-senza" aria-hidden="true">${esc(t.breve.slice(0, 1))}</span>`}<div class="f-scelta__t"><b>${esc(t.nome)}</b><small><span class="num">${a.tratto.min} min</span> a piedi da ${esc(ultima)}, ${durata(t.durata)} di visita</small>${etich(id)}</div><button type="button" class="f-scelta__piu${dentro ? ' f-piu--dentro' : ''}" data-f="agg" data-id="${id}" aria-label="${dentro ? 'Togli' : 'Aggiungi'} ${esc(t.breve)} ${dentro ? 'dal' : 'al'} giorno ${g + 1}">${dentro ? `${ic('spunta', 18)}Aggiunta` : `${ic('piu', 18)}Aggiungi`}</button></div>`;
    };
    const stile = P[S.p].cerca;
    const testo = `Cerca tra ${D.vicine[g].length} tappe`;
    const corpo = `<div class="f-cerca f-cerca--${stile}"><label class="vh" for="f-q">Cerca una tappa</label>${ic('cerca', 20)}<input id="f-q" type="search" placeholder="${stile === 'a' ? 'Cerca' : testo}" autocomplete="off" enterkeyhint="search"></div>
      <div class="f-vista" role="group" aria-label="Come vedere le tappe"><button type="button" aria-pressed="true" data-fv="elenco">${ic('elenco', 18)}Elenco</button><button type="button" aria-pressed="false" data-fv="mappa">${ic('mappa', 18)}Mappa</button></div>
      <div class="f-filtri" role="group" aria-label="Che tipo di tappa">${FILTRI.map(([k, n]) => `<button type="button" aria-pressed="${k === filtro}" data-filtro="${k}">${n}</button>`).join('')}</div>
      <div id="f-elenco">${elenco()}</div>
      <div id="f-mappa-box" class="f-mappa-box" hidden><div id="f-mappa" class="f-mappa"></div><div id="f-scelta" class="f-scelta" aria-live="polite">${schedina(null)}</div></div>
      <p class="f-nota">Prova: le tappe vanno in fondo al giorno ${g + 1}, con i tempi veri; se ne aggiunge una per giorno. La ricerca vera (anche locali, gite e parole come «Cristo velato») è il pezzo 3.</p>`;
    const dopoAperto = f => {
      const input = $('#f-q', f);
      if (stile === 'a') input.addEventListener('focus', () => scriviSegnaposto(input, 'Una tappa, un museo, una chiesa…'), { once: true });
      const aggiorna = () => {
        $('#f-elenco', f).innerHTML = elenco();
        if (mappaF) { mappaF.punti(ids()); if (scelta && !ids().includes(scelta)) scelta = null; $('#f-scelta', f).innerHTML = schedina(scelta); mappaF.evidenzia(scelta); }
      };
      input.addEventListener('input', e => { q = e.target.value.trim(); aggiorna(); });
      const sceglie = id => { scelta = id; $('#f-scelta', f).innerHTML = schedina(id); mappaF?.evidenzia(id); };
      const mostra = v => {
        vista = v;
        $$('[data-fv]', f).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.fv === v)));
        $('#f-elenco', f).hidden = v !== 'elenco';
        $('#f-mappa-box', f).hidden = v !== 'mappa';
        if (v === 'mappa' && !mappaF) {
          mappaF = new Mappa($('#f-mappa', f), { punto: id => sceglie(id), tocca: id => apriScheda(id), margini: () => ({ t: 34, r: 30, b: 34, l: 30 }), distanza: 30 });
          mappaF.disegna(G(g), { disegna: false, punti: ids(), n: g + 1 });
          mappaF.mostraTutte(true, false);
          mappaF.inquadra(0, ids().slice(0, 12));
        }
        // la mappa intera sullo schermo (con la scheda corta sopra), senza dover scorrere
        if (v === 'mappa') requestAnimationFrame(() => $('#f-mappa-box', f).scrollIntoView({ block: 'nearest', behavior: piano() ? 'smooth' : 'auto' }));
      };
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const fv = e.target.closest('[data-fv]');
        if (fv) { mostra(fv.dataset.fv); return; }
        const fb = e.target.closest('[data-filtro]');
        if (fb) { filtro = fb.dataset.filtro; $$('[data-filtro]', f).forEach(x => x.setAttribute('aria-pressed', String(x === fb))); aggiorna(); return; }
        const bt = e.target.closest('[data-f="agg"]');
        if (!bt) return;
        const id = bt.dataset.id;
        if (S.agg[g] === id) { chiudiFoglio(); togli(g); return; }
        bt.classList.add('f-piu--dentro');
        bt.innerHTML = bt.classList.contains('f-scelta__piu') ? `${ic('spunta', 18)}Aggiunta` : ic('spunta', 20);
        await dopo(piano() ? 420 : 0);
        await chiudiFoglio();
        aggiungi(g, id);
      };
    };
    foglio('Aggiungi una tappa', corpo, dopoAperto, `f--${stile}`);
  }
  function aggiungi(g, id) {
    const prima = S.agg[g];
    P[S.p].aggiorna(() => { S.agg[g] = id; S.nuova = id; });
    const X = G(g);
    avvisa(`${T(id).breve} è in fondo al giorno ${g + 1}. ${X.fine > X.fineScelta ? `Fine stimata ${ora(X.fine)}, dopo le ${ora(X.fineScelta)}.` : `Fine stimata ${ora(X.fine)}.`}${prima ? ` (Nella prova una sola tappa in più: ho tolto ${T(prima).breve}.)` : ''}`, { testo: 'Annulla', fai: () => P[S.p].aggiorna(() => { S.agg[g] = prima; S.nuova = null; }) });
  }
  function togli(g) {
    const prima = S.agg[g];
    if (!prima) return;
    P[S.p].aggiorna(() => { S.agg[g] = null; S.nuova = null; });
    avvisa(`${T(prima).breve} non è più nel giorno ${g + 1}.`, { testo: 'Annulla', fai: () => P[S.p].aggiorna(() => { S.agg[g] = prima; }) });
  }

  // =====================================================================================
  // Pause e margini: il foglio di una pausa (quanto dura, dopo quale tappa, toglierla) e quello di tutto il giorno
  // =====================================================================================
  function apriPausa(quale) {
    const g = S.g, tipo = TIPI_PAUSA[quale];
    const corpo = () => {
      const Gx = G(g), p = Gx?.pause.find(x => x.quale === quale);
      if (!p) return `<p>Questa pausa non c'è più.</p><div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Chiudi</button></div>`;
      return `<p class="f-pausa-ora">${ic(tipo.ic, 22)}<span>Dalle <b class="num">${ora(p.inizio)}</b> alle <b class="num">${ora(p.fine)}</b>, dopo ${esc(T(p.dove).breve)}</span></p>
        <fieldset class="f-scelte"><legend>Quanto dura</legend><div>${tipo.scelte.map(m => `<button type="button" aria-pressed="${p.min === m}" data-f="durata" data-v="${m}">${durata(m)}</button>`).join('')}</div></fieldset>
        <fieldset class="f-scelte"><legend>Dopo quale tappa</legend><div>${tappe(Gx).slice(0, -1).map(v => `<button type="button" aria-pressed="${p.dove === v.id}" data-f="dopo" data-v="${v.id}">${esc(T(v.id).breve)}</button>`).join('')}</div></fieldset>
        ${tempo(Gx, 'tempo--f', { bottone: false })}
        <div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Fatto</button><button type="button" class="f-bottone f-bottone--contorno" data-f="togli-pausa">${ic('cestino', 18)}Togli la pausa</button></div>
        ${quale === 'pranzo' ? '<p class="f-nota">Prova: i locali aperti vicino a te a quell\'ora (mangiare dentro la giornata) sono il pezzo 6.</p>' : ''}`;
    };
    foglio(tipo.nome, `<div id="f-vivo">${corpo()}</div>`, f => {
      f.onclick = e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        const k = b.dataset.f;
        if (k === 'fatto') { chiudiFoglio(); return; }
        if (k === 'togli-pausa') {
          const prima = S.pause[g];
          cambiaPause(g, l => l.splice(0, l.length, ...l.filter(x => x.quale !== quale)));
          chiudiFoglio();
          avvisa(`${tipo.nome} tolta dal giorno ${g + 1}. Fine stimata ${ora(G(g).fine)}.`, { testo: 'Annulla', fai: () => P[S.p].aggiorna(() => { S.pause = { ...S.pause, [g]: prima }; if (prima === undefined) delete S.pause[g]; }) });
          return;
        }
        cambiaPause(g, l => { const x = l.find(y => y.quale === quale); if (!x) return; if (k === 'durata') x.min = +b.dataset.v; if (k === 'dopo') x.dopo = b.dataset.v; });
        rinfresca(f, corpo(), b);
      };
    }, 'f--pausa');
  }
  function apriTempo() {
    const g = S.g;
    const corpo = () => {
      const Gx = G(g);
      if (!Gx) return `<p>Il giorno ${g + 1} è vuoto: prima aggiungi le tappe, poi le pause.</p>`;
      const mancano = Object.keys(TIPI_PAUSA).filter(q => !Gx.pause.some(p => p.quale === q));
      return `${tempo(Gx, 'tempo--f', { bottone: false })}
        <section class="f-sezione"><h3>Pause del giorno ${g + 1}</h3>
          ${Gx.pause.length ? `<ul class="f-pause">${Gx.pause.map(p => `<li><button type="button" class="f-pausa onda" data-f="pausa" data-v="${p.quale}">${ic(TIPI_PAUSA[p.quale].ic, 22)}<span><b>${TIPI_PAUSA[p.quale].nome}, ${durata(p.min)}</b><small class="num">${ora(p.inizio)}–${ora(p.fine)}, dopo ${esc(T(p.dove).breve)}</small></span><span class="f-pausa__cambia">Cambia</span></button></li>`).join('')}</ul>` : '<p class="f-nota">Nessuna pausa: la giornata va da una tappa all\'altra.</p>'}
          ${mancano.length && tappe(Gx).length > 1 ? `<div class="f-chips">${mancano.map(q => `<button type="button" class="f-chip" data-f="nuova-pausa" data-v="${q}">${ic('piu', 16)}${TIPI_PAUSA[q].nome}</button>`).join('')}</div>` : ''}
        </section>
        <section class="f-sezione"><h3 id="f-margine-t">Margine a ogni spostamento</h3><p class="f-nota">Per le foto, le code e il passo più lento: si aggiunge dopo ogni tratto, i minuti a piedi restano quelli veri. Vale per tutti i giorni.</p>
          <div class="f-scelte__b" role="group" aria-labelledby="f-margine-t">${MARGINI.map(m => `<button type="button" aria-pressed="${S.margine === m}" data-f="margine" data-v="${m}">${m ? `${m} min` : 'Nessuno'}</button>`).join('')}</div></section>`;
    };
    foglio('Pause e margini', `<div id="f-vivo">${corpo()}</div>`, f => {
      f.onclick = e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        const k = b.dataset.f, v = b.dataset.v;
        if (k === 'pausa') { apriPausa(v); return; }
        if (k === 'nuova-pausa') cambiaPause(g, l => l.push({ quale: v, min: TIPI_PAUSA[v].min, dopo: null }));
        if (k === 'margine') P[S.p].aggiorna(() => { S.margine = +v; });
        rinfresca(f, corpo(), k === 'nuova-pausa' ? { dataset: { f: 'pausa', v } } : b);
      };
    }, 'f--tempo');
  }

  // ---------- «Data e orari»: con la data si vedono i giorni di chiusura (Enrico, giro 5) ----------
  function quando() {
    const vivo = () => `${S.data ? `<ul class="f-date">${range(nG()).map(g => { const ch = chiuseDi(g); return `<li><b>Giorno ${g + 1}</b><span>${dataLunga(g)}</span>${ch.length ? `<span class="f-et f-et--attenzione">Chiuso: ${ch.map(id => esc(T(id).breve)).join(', ')}</span>` : '<span class="f-et">Tutto aperto</span>'}</li>`; }).join('')}</ul>` : ''}
      <div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Fatto</button>${S.data ? '<button type="button" class="f-bottone f-bottone--contorno" data-f="senza">Torna senza data</button>' : ''}</div>`;
    foglio('Data e orari', `<p>Con la data vedi quali tappe sono chiuse proprio quel giorno. Senza data i giorni di chiusura restano nella scheda di ogni tappa.</p>
      <label class="f-campo" for="f-data"><span>Primo giorno</span><input id="f-data" type="date" min="2026-10-08" value="${S.data ?? ''}"></label>
      <div id="f-vivo">${vivo()}</div>
      <p class="f-nota">Prova: con martedì 13 ottobre il MANN e la Cappella Sansevero sono chiusi il giorno 1. Gli orari (dalle 9:30 alle 19:00) si cambiano nel pezzo 4; i tempi restano quelli di un giorno feriale.</p>`, f => {
      f.onchange = e => {
        if (e.target.id !== 'f-data') return;
        P[S.p].aggiorna(() => { S.data = e.target.value || null; });
        rinfresca(f, vivo());
        e.target.focus({ preventScroll: true });
      };
      f.onclick = e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        if (b.dataset.f === 'fatto') chiudiFoglio();
        if (b.dataset.f === 'senza') { P[S.p].aggiorna(() => { S.data = null; }); $('#f-data', f).value = ''; rinfresca(f, vivo()); $('#f-data', f).focus(); }
      };
    }, 'f--quando');
  }

  // =====================================================================================
  // «Salva»: tre movimenti diversi, uno per proposta (A il segnalibro, C il segnaposto con l'onda, D il timbro).
  // Giro 5: salvato vuol dire che resta anche se chiudi la pagina; il nome si cambia da «I miei itinerari» (Rinomina).
  // =====================================================================================
  const spilloSalva = `<svg class="salva__ic salva__ic--spillo" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="spillo-clip"><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z"/></clipPath></defs><g clip-path="url(#spillo-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle class="salva__buco" cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  const bottoneSalva = (cl = '') => {
    const v = P[S.p].salva || 'a';
    const icona = v === 'c' ? spilloSalva : segnalibro;
    return `<button type="button" class="salva salva--${v} ${cl}${S.salvato ? ' salva--fatto' : ''}" data-azione="salva">${icona}<span class="salva__t"><span class="salva__a">Salva</span><span class="salva__b">Salvato</span></span>${v === 'c' ? '<i class="salva__onda" aria-hidden="true"></i>' : ''}${v === 'd' ? '<i class="salva__inchiostro" aria-hidden="true"></i>' : ''}</button>`;
  };
  function salva(b) {
    if (S.salvato) { apriMiei(); return; }
    S.salvato = true;
    ricorda();
    $$('.salva').forEach(x => x.classList.add('salva--fatto'));
    if (b) { b.classList.remove('salva--ora'); void b.offsetWidth; b.classList.add('salva--ora'); }
    $$('[data-stato]').forEach(x => { x.dataset.stato = 'salvato'; x.querySelector('.stato__t').textContent = 'Salvato in «I miei itinerari»'; });
    setTimeout(() => avvisa('Salvato in «I miei itinerari». Resta su questo telefono anche se chiudi la pagina.', { testo: 'Vedi', fai: apriMiei }), piano() ? 700 : 0);
  }
  const stato = () => `<span class="stato" data-stato="${S.salvato ? 'salvato' : 'bozza'}"><i aria-hidden="true"></i><span class="stato__t">${S.salvato ? 'Salvato in «I miei itinerari»' : 'Non ancora salvato'}</span></span>`;

  // ---------- «Elimina»: si chiede conferma con il nome; poi «Annulla» per qualche secondo ----------
  function chiediElimina() {
    foglio('Eliminare l\'itinerario?', `<p>«${esc(S.nome)}» sparisce da questo telefono, ${S.salvato ? 'anche da «I miei itinerari»' : 'con le tappe che hai aggiunto'}. I link che hai già mandato continuano ad aprirsi: portano tutto con sé.</p>
      <div class="f-conferma"><button type="button" class="f-bottone f-bottone--pericolo" data-f="si">${ic('cestino', 20)}Elimina «${esc(S.nome)}»</button><button type="button" class="f-bottone f-bottone--contorno" data-f="no">Annulla</button></div>`, f => {
      f.onclick = async e => {
        if (e.target === f || e.target.closest('[data-f="no"]')) { chiudiFoglio(); return; }
        if (!e.target.closest('[data-f="si"]')) return;
        await chiudiFoglio();
        const prima = { ...S };
        aggiornaTutto(() => { S.eliminato = true; S.salvato = false; dimentica(); }, { pagina: true });
        avvisa('Itinerario eliminato.', { testo: 'Annulla', fai: () => aggiornaTutto(() => { Object.assign(S, { eliminato: false, salvato: prima.salvato, nome: prima.nome }); }, { pagina: true }) });
      };
    }, 'f--conferma');
  }
  // la pagina dopo «Elimina»: vuota, con le strade per ricominciare
  const paginaEliminata = cl => `<section class="eliminato ${cl}" aria-labelledby="el-t">${firma()}<h1 id="el-t">Itinerario eliminato</h1><p>«${esc(S.nome)}» non c'è più su questo telefono.</p>
    <div class="eliminato__azioni"><button type="button" class="f-bottone" data-azione="ripristina">Rimettilo com'era</button><button type="button" class="f-bottone f-bottone--contorno" data-azione="pronto">Componi un itinerario nuovo</button></div>
    <h2>Oppure parti da un itinerario pronto</h2><ul>${D.altri.map(a => `<li><button type="button" data-azione="pronto"><span>${esc(a.nome)}</span><small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></button></li>`).join('')}</ul></section>`;

  // ---------- «I miei itinerari»: i tre puntini con Rinomina, Condividi, Elimina (Enrico, giro 5) ----------
  function apriMiei() {
    let menu = false, rinomina = false;
    const vivo = () => `<div class="f-lista"><div class="f-riga f-riga--mio">${FOTO['monte-echia'] ? `<img src="${FOTO['monte-echia']}" alt="">` : ''}
        <div class="f-mio">${rinomina ? `<label class="f-campo f-campo--nome" for="f-nome"><span>Nome dell'itinerario</span><input id="f-nome" value="${esc(S.nome)}" maxlength="60" autocomplete="off" enterkeyhint="done"></label>` : `<b>${esc(S.nome)}</b>`}<small>${nG()} giorni, ${range(D.giorni.length).reduce((s, g) => s + tappe(G(g)).length, 0)} tappe</small><span class="f-segno">${S.salvato ? `${ic('spunta', 16)}Salvato` : 'Non ancora salvato'}</span></div>
        ${rinomina ? '' : `<button type="button" class="f-icona onda" data-f="menu" aria-expanded="${menu}" aria-controls="f-mio-azioni" aria-label="Altre azioni per «${esc(S.nome)}»">${ic('altro', 20)}</button>`}</div>
      ${rinomina
        ? '<div class="f-conferma f-conferma--due"><button type="button" class="f-bottone" data-f="nome-ok">Salva il nome</button><button type="button" class="f-bottone f-bottone--contorno" data-f="nome-no">Annulla</button></div>'
        : `<div class="f-mio-azioni" id="f-mio-azioni"${menu ? '' : ' hidden'}><button type="button" class="f-azione" data-f="rinomina">${ic('matita')}<span>Rinomina</span></button><button type="button" class="f-azione" data-f="condividi">${ic('condividi')}<span>Condividi</span></button><button type="button" class="f-azione f-azione--pericolo" data-f="elimina">${ic('cestino')}<span>Elimina</span></button></div>`}</div>
      ${S.salvato ? '' : `<button type="button" class="f-bottone" data-f="salva">Salva questo itinerario</button>`}
      <p class="f-nota">Gli itinerari restano su questo telefono, anche se chiudi la pagina: niente account, niente iscrizione.</p>`;
    const nuovoNome = f => {
      const v = $('#f-nome', f)?.value.trim();
      rinomina = false;
      if (v && v !== S.nome) { S.nome = v; ricorda(); mettiNome(); avvisa(`Nome cambiato: «${v}».`); }
      rinfresca(f, vivo(), { dataset: { f: 'menu' } });
    };
    foglio('I miei itinerari', `<div id="f-vivo">${vivo()}</div>`, f => {
      f.onkeydown = e => { if (e.target.id === 'f-nome' && e.key === 'Enter') { e.preventDefault(); nuovoNome(f); } };
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        const k = b.dataset.f;
        if (k === 'menu') { menu = !menu; rinfresca(f, vivo(), b); if (menu) $('[data-f="rinomina"]', f)?.focus(); return; }
        if (k === 'rinomina') { rinomina = true; menu = false; rinfresca(f, vivo()); const i = $('#f-nome', f); i?.focus(); i?.select(); return; }
        if (k === 'nome-ok') { nuovoNome(f); return; }
        if (k === 'nome-no') { rinomina = false; rinfresca(f, vivo(), { dataset: { f: 'menu' } }); return; }
        if (k === 'salva') { chiudiFoglio(); salva($('.salva')); return; }
        if (k === 'condividi') { await chiudiFoglio(); apriCondividi(); return; }
        if (k === 'elimina') { await chiudiFoglio(); chiediElimina(); }
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
    const Gx = G(S.g);
    foglio('Itinerario', `<div class="f-azioni">
      <button type="button" class="f-azione" data-f="miei">${ic('miei')}<span>I miei itinerari<small>Quelli salvati su questo telefono</small></span></button>
      <button type="button" class="f-azione" data-f="condividi">${ic('condividi')}<span>Condividi<small>Un link con tutto l'itinerario</small></span></button>
      <button type="button" class="f-azione" data-f="tempo">${ic('cursori')}<span>Pause e margini<small>${Gx ? `${Gx.pause.length ? Gx.pause.map(p => `${TIPI_PAUSA[p.quale].nome.toLowerCase()} ${durata(p.min)}`).join(', ') : 'nessuna pausa'}; margine ${S.margine ? `${S.margine} min` : 'nessuno'}` : 'Il giorno è vuoto'}</small></span></button>
      <button type="button" class="f-azione" data-f="quando">${ic('calendario')}<span>Data e orari<small>${testoQuando()}</small></span></button>
      <button type="button" class="f-azione" data-f="giorni">${ic('giorni')}<span>Tutti i giorni<small>${nG()} giorni</small></span></button>
      <button type="button" class="f-azione" data-f="giorno">${ic('piu')}<span>Aggiungi un giorno</span></button>
      <button type="button" class="f-azione f-azione--pericolo" data-f="elimina">${ic('cestino')}<span>Elimina itinerario<small>Lo togli da questo telefono</small></span></button>
    </div>`, f => {
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        if (b.dataset.f === 'tempo') { apriTempo(); return; }
        if (b.dataset.f === 'quando') { quando(); return; }
        await chiudiFoglio();
        ({ miei: apriMiei, condividi: apriCondividi, giorni: apriGiorni, giorno: nuovoGiorno, elimina: chiediElimina })[b.dataset.f]();
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
  function nuovoGiorno() {
    if (S.extra) { avvisa('Nella prova si arriva a 3 giorni (sul sito fino a 7).'); return; }
    P[S.p].aggiorna(() => { S.extra = true; S.g = nG() - 1; S.vista = 'elenco'; }, { giorno: true });
    avvisa('Aggiunto il giorno 3: sulla mappa vedi tutte le tappe della città.', { testo: 'Annulla', fai: () => P[S.p].aggiorna(() => { S.extra = false; S.g = Math.min(S.g, 1); }, { giorno: true }) });
  }

  // =====================================================================================
  // Cambiare giorno senza scatti (Enrico, giro 5: «appena cambia trema»). Nel giro 4 il passaggio tra viste fotografava la
  // pagina: il giorno restava fermo un attimo, poi il vecchio e il nuovo si sovrapponevano e la pagina saltava di 32 px.
  // Adesso il giorno che lasci continua il movimento del dito (o parte da fermo) ed esce di lato; mentre è invisibile
  // cambia il contenuto (e, se eri più in basso, la pagina torna all'inizio del giorno); poi il nuovo entra dall'altro lato.
  // Cambia solo quello che deve cambiare: schede dei giorni (il segno scorre), numeri, elenco, mappa.
  // =====================================================================================
  let occupato = false;
  async function scorri(el, dir, daX, cambia, nuovo = () => el, poi = () => {}) {
    if (!el || !piano()) { cambia(); const n = nuovo(); if (n) { n.style.translate = ''; n.style.opacity = ''; } poi(); return; }
    occupato = true;
    try {
      const W = el.getBoundingClientRect().width || innerWidth;
      const op = parseFloat(el.style.opacity || '1');
      el.style.translate = ''; el.style.opacity = '';
      const resto = 1 - Math.min(1, Math.abs(daX) / (W * .5));
      const fuori = el.animate([{ translate: `${daX}px 0`, opacity: op }, { translate: `${-dir * W * .3}px 0`, opacity: 0 }], { duration: 110 + 130 * resto, easing: 'cubic-bezier(.3, 0, .8, .15)', fill: 'forwards' });
      try { await fuori.finished; } catch {}
      try { cambia(); } finally {
        const n = nuovo() || el;
        const dentro = n.animate([{ translate: `${dir * W * .22}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 430, easing: 'cubic-bezier(.16, 1, .3, 1)' });
        fuori.cancel();
        try { await dentro.finished; } catch {}
      }
    } finally { occupato = false; }
    poi();
  }
  // il giorno nuovo comincia dall'alto: se eri più in basso la pagina ci torna (mentre il giorno è invisibile)
  function allInizio(el, barra = null) {
    if (!el) return;
    const sopra = barra ? barra.offsetHeight + (parseFloat(getComputedStyle(barra).top) || 0) : parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const y = Math.round(el.getBoundingClientRect().top + scrollY - sopra);
    if (scrollY > y + 1) scrollTo({ top: y, behavior: 'instant' });
  }
  function vaiAlGiorno(g, daX = 0) {
    if (g < 0 || g >= nG() || g === S.g || occupato) return false;
    S.nuova = null;
    P[S.p].giorno(g, daX);
    return true;
  }
  // le schede dei giorni: il segno scorre da un giorno all'altro (fuori dal tablist: dentro ci vanno solo le schede)
  const schede = cl => `<div class="schede ${cl}-schede-box"><span class="segno-tab" aria-hidden="true"></span><div class="${cl}-schede" role="tablist" aria-label="Giorni dell'itinerario">${range(nG()).map(g => `<button type="button" role="tab" aria-selected="${g === S.g}" tabindex="${g === S.g ? 0 : -1}" data-azione="giorno" data-g="${g}">Giorno ${g + 1}</button>`).join('')}</div></div>`;
  const segnoOra = () => { const s = $('.segno-tab'); return s && s.dataset.x ? { x: +s.dataset.x, w: +s.dataset.w } : null; };
  function mettiSegno(box, { da = null, anima = true } = {}) {
    const s = box && $('.segno-tab', box), t = box && $('[aria-selected="true"]', box);
    if (!s || !t) return;
    const x = t.offsetLeft, w = t.offsetWidth;
    const metti = (X, W) => { s.style.transform = `translateX(${X}px)`; s.style.width = `${W}px`; };
    if (!anima || !piano() || (!da && !s.dataset.x)) { s.style.transition = 'none'; metti(x, w); void s.offsetWidth; s.style.transition = ''; }
    else { if (da) { s.style.transition = 'none'; metti(da.x, da.w); void s.offsetWidth; s.style.transition = ''; } metti(x, w); }
    s.dataset.x = x; s.dataset.w = w;
    s.classList.add('su');
  }
  function segnaSchede(g) {
    for (const box of $$('.schede')) {
      $$('[role="tab"]', box).forEach(b => { const si = +b.dataset.g === g; b.setAttribute('aria-selected', String(si)); b.tabIndex = si ? 0 : -1; });
      mettiSegno(box);
    }
  }
  // se cambiano le misure (caratteri caricati, schermo ruotato) il segno si rimette al suo posto, senza animazione
  const larghezze = new WeakMap();
  const roSchede = new ResizeObserver(es => es.forEach(e => { const w = Math.round(e.contentRect.width); if (larghezze.get(e.target) !== w) { const prima = larghezze.has(e.target); larghezze.set(e.target, w); if (prima) mettiSegno(e.target, { anima: false }); } }));
  const osservaSchede = () => $$('.schede').forEach(b => { roSchede.observe(b); });
  // Sfogliare i giorni: sul telefono trascinando col dito a destra o a sinistra; sul computer trascinando col mouse o
  // scorrendo di lato con due dita sul touchpad. Il giorno segue il dito; lasciato, continua da dove l'hai lasciato.
  function sfoglia(area, mobile = () => area) {
    if (!area) return;
    let p0 = null, dir = null, tolto = false, x = 0, el = null;
    area.addEventListener('pointerdown', e => {
      if ((e.pointerType === 'mouse' && e.button !== 0) || occupato || e.target.closest('.m, input, .f-filtri, [role="tablist"], .c-giu')) return;
      p0 = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }; dir = null; x = 0; el = null;
    });
    area.addEventListener('pointermove', e => {
      if (!p0 || e.pointerId !== p0.id) return;
      const dx = e.clientX - p0.x, dy = e.clientY - p0.y;
      if (!dir) {
        if (Math.hypot(dx, dy) < 10) return;
        dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v';
        if (dir === 'h') { try { area.setPointerCapture(e.pointerId); } catch {} area.classList.add('sfoglio'); el = mobile(); }
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
        const vai = (Math.abs(dx) > 70 || (v > .45 && Math.abs(dx) > 30)) && vaiAlGiorno(S.g + (dx < 0 ? 1 : -1), piano() ? x : 0);
        if (!vai) {
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
    // il touchpad del computer: due dita di lato
    let somma = 0, pausa = 0;
    area.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || e.target.closest('.m')) return;
      e.preventDefault();
      if (performance.now() < pausa) return;
      somma += e.deltaX;
      if (Math.abs(somma) > 80) { vaiAlGiorno(S.g + (somma > 0 ? 1 : -1)); somma = 0; pausa = performance.now() + 800; }
    }, { passive: false });
  }
  // un giorno che entra dopo un ridisegno (giorno nuovo, Annulla)
  function entra(el, dir = 1) {
    if (!el || !piano()) return;
    const W = el.getBoundingClientRect().width || innerWidth;
    el.animate([{ translate: `${dir * W * .22}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 430, easing: 'cubic-bezier(.16, 1, .3, 1)' });
  }

  // =====================================================================================
  // Disegno della pagina
  // =====================================================================================
  let mappa = null;
  let rotta = true;   // il percorso si disegna in fila all'apertura e quando cambi giorno, non a ogni ritocco
  let ascolti = [];
  function ascolta(tipo, fn) { let raf = 0; const h = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); }; addEventListener(tipo, h, { passive: true }); ascolti.push([tipo, h]); }
  const smettiAscolti = () => { ascolti.forEach(([t, h]) => removeEventListener(t, h)); ascolti = []; };
  const daLinea = () => (S.nuova ? D.giorni[S.g].linee.length : rotta ? null : Infinity);
  function disegna() {
    const r = document.documentElement;
    r.classList.remove('pa', 'pc', 'pd', 'c-giu-su');
    r.classList.add('p' + S.p);
    r.dataset.g = String(S.g);
    if (mappa) { mappa.spegni(); mappa = null; }
    smettiAscolti();
    P.c.guarda = null;
    const app = $('#app');
    app.classList.toggle('apre', S.anima);
    app.innerHTML = S.eliminato ? paginaEliminata(`eliminato--${S.p}`) : P[S.p].html();
    if (!S.eliminato) P[S.p].dopo?.();
    rotta = false;
    $$('.schede').forEach(b => mettiSegno(b, { anima: false }));
    osservaSchede();
    if (S.anima) { const f = $('.firma', app); if (f) animaFirma(f); }
    S.anima = false;
    prova();
    contaFine();
    contaCifre();
    ricorda();
    if (S.nuova) { const n = S.nuova; setTimeout(() => { if (S.nuova === n) { S.nuova = null; $$('.nuova').forEach(x => x.classList.remove('nuova')); } }, 2800); }
  }
  // cambia lo stato e ridisegna; con «giorno» la pagina torna all'inizio del giorno e il giorno entra di lato
  function aggiornaTutto(fn, { giorno = false, pagina = false } = {}) {
    const segno = segnoOra(), primaG = S.g;
    const fai = () => {
      fn();
      if (giorno) rotta = true;
      disegna();
      if (segno) mettiSegno($('.schede'), { da: segno });
      if (giorno) { const corpo = $('[data-inizio-giorno]'); allInizio(corpo, S.p === 'a' ? $('.a-giorni') : S.p === 'd' ? $('.d-indice') : null); entra($('.giorno-corpo'), S.g >= primaG ? 1 : -1); }
      if (S.nuova) { const el = $('.nuova'); if (el && !computer.matches) { const r = el.getBoundingClientRect(); if (r.top > innerHeight - 140 || r.bottom < 120) el.scrollIntoView({ block: 'center', behavior: piano() ? 'smooth' : 'auto' }); } }
    };
    // solo per cambiare pagina (Elimina, Rimettilo): un passaggio tra viste morbido
    if (pagina && document.startViewTransition && piano()) { const vt = document.startViewTransition(fai); vt.ready.catch(() => {}); vt.finished.catch(() => {}); } else fai();
  }

  const AZ = {
    giorno: b => vaiAlGiorno(+b.dataset.g),
    'nuovo-giorno': nuovoGiorno,
    'togli-giorno': () => P[S.p].aggiorna(() => { S.extra = false; S.g = Math.min(S.g, 1); }, { giorno: true }),
    vista: b => P[S.p].aggiorna(() => { S.vista = b.dataset.v; rotta = true; }),
    aggiungi: () => apriAggiungi(),
    'aggiungi-subito': b => aggiungi(S.g, b.dataset.id),
    salva: b => salva(b),
    tempo: apriTempo,
    pausa: b => apriPausa(b.dataset.quale),
    miei: apriMiei, condividi: apriCondividi, altro: apriAltro, quando, giorni: apriGiorni, elimina: chiediElimina,
    ripristina: () => aggiornaTutto(() => { S.eliminato = false; }, { pagina: true }),
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
    if (!t || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const g = e.key === 'Home' ? 0 : e.key === 'End' ? nG() - 1 : Math.max(0, Math.min(nG() - 1, S.g + (e.key === 'ArrowRight' ? 1 : -1)));
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

  const vuoto = (cl, bott) => `<div class="${cl}"><p>Il giorno ${S.g + 1} è vuoto. Aggiungi la prima tappa, oppure parti da un itinerario pronto. Sulla mappa vedi tutte le tappe della città.</p><button type="button" class="${bott}" data-azione="aggiungi">${ic('piu', 20)}Aggiungi una tappa</button>
    <ul>${D.altri.map(a => `<li><button type="button" data-azione="pronto"><span>${esc(a.nome)}</span><small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></button></li>`).join('')}</ul>
    <button type="button" class="${bott} ${bott}--contorno" data-azione="togli-giorno">Togli il giorno ${S.g + 1}</button></div>`;
  // il tempo libero in fondo al giorno, con le tre tappe più vicine da aggiungere con un tocco
  const liberoBlocco = (Gx, cl, g = S.g) => {
    const l = Gx.resta, sug = suggerite(g);
    if (l <= 0) return avvisiGiorno(Gx).length ? `<div class="${cl} ${cl}--attenzione" role="status">${ic('attenzione', 20)}<p>${avvisiGiorno(Gx).join(' ')}</p></div>` : '';
    return `<div class="${cl}"><p class="${cl}__tit">${resta(l)} prima delle ${ora(Gx.fineScelta)}.</p>
      ${sug.length ? `<p class="${cl}__sotto">Le più vicine a ${esc(T(tappe(Gx).slice(-1)[0].id).breve)}:</p><ul class="${cl}__sug">${sug.map(id => `<li><button type="button" class="sug onda" data-azione="aggiungi-subito" data-id="${id}">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" loading="lazy" decoding="async">` : '<span class="sug__senza"></span>'}<span><b>${esc(T(id).breve)}</b><small><span class="num">${D.aggiunte[g][id].tratto.min} min</span> a piedi, ${durata(T(id).durata)}</small></span><span class="sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>` : ''}
      <button type="button" class="${cl}__tutte onda" data-azione="aggiungi">Vedi tutte le ${D.vicine[g]?.length ?? ''} tappe</button></div>`;
  };
  const altreLinee = () => range(D.giorni.length).map(g => ({ G: G(g), col: 'var(--ink2)' }));
  // la mappa del giorno, con il tasto per tutte le tappe; in un giorno vuoto le tappe della città si vedono subito
  const opzMappa = extra => ({ punto: id => apriScheda(id), tutte: Gx => S.tutte || !Gx, cambiaTutte: si => { S.tutte = si; }, ...extra });

  // =====================================================================================
  // A · LA RIVISTA
  // =====================================================================================
  const A = {
    nome: 'La rivista',
    cerca: 'a',
    salva: 'a',
    idea: ['Una rivista di viaggio: la foto in copertina, i titoli con le grazie, la linea a puntini color tufo che si disegna mentre scorri.',
      'Sotto «Giorno 1 / Giorno 2» i numeri del giorno scelto e il tempo del giorno: visite, cammino, pause e margine, con la fine stimata e quanto resta. La pausa pranzo è già dentro e si cambia con un tocco.',
      'Si cambia giorno trascinando di lato, senza scatti. Salva: il segnalibro scende e si riempie. Logo in tema scuro: archi color ambra. Ricerca: il campo si allarga e il testo si scrive da solo.'],
    html() {
      return `<header class="a-testata">${firma()}<button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></header>
      <div class="a-pagina"><div class="a-colonna">
        <section class="a-copertina" aria-labelledby="a-titolo">
          <div class="a-foto-c"><img src="${FOTO['monte-echia']}" alt=""></div>
          <div class="a-copertina__t"><h1 id="a-titolo" data-nome>${esc(S.nome)}</h1><div class="a-stato">${stato()}${bottoneSalva('a-salva onda')}</div></div>
        </section>
        <div class="a-quando">${ic('calendario', 20)}<span>${testoQuando()}</span><button type="button" data-azione="quando">Cambia</button></div>
        <div class="a-giorni">${schede('a')}<button type="button" class="a-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>
        <section class="a-giorno giorno-corpo" data-inizio-giorno aria-labelledby="a-g">${this.corpo()}</section>
        <div class="a-fine"></div>
        ${this.isola()}
      </div>
      ${computer.matches ? `<div class="a-destra"><div class="a-cornice"><div id="mappa"></div><p class="a-cornice__t" id="a-didascalia">${this.didascalia()}</p></div></div>` : ''}</div>${crediti()}`;
    },
    didascalia() { const Gx = G(S.g); return Gx ? `${ORDINALE[S.g]} giorno, ${esc(titoloGiorno(Gx))}` : `${ORDINALE[S.g]} giorno, ancora vuoto`; },
    corpo() {
      const Gx = G(S.g), mappaTel = !computer.matches && S.vista === 'mappa';
      return `${Gx ? `${cifre(Gx, 'cifre a-cifre')}${tempo(Gx, 'tempo--a')}<h2 id="a-g">${esc(titoloGiorno(Gx))}</h2><p class="a-riassunto">${riassunto(Gx)}</p>` : `<h2 id="a-g">Una pagina bianca</h2>`}
        ${mappaTel ? '<div class="a-mappa-tel"><div id="mappa"></div></div>' : Gx ? this.giornata(Gx) : vuoto('a-vuoto', 'a-bottone')}`;
    },
    giornata(Gx) {
      const voci = sequenza(Gx).map(v => {
        if (v.tipo === 'tratto') return `<li class="a-tratto"><span></span><span>${ic('piedi', 18)}${testoTratto(v)}</span></li>`;
        if (v.tipo === 'pausa') return `<li class="a-tappa a-pausa"><span class="a-ora num">${ora(v.inizio)}</span><button type="button" class="a-pausa__c onda" data-azione="pausa" data-quale="${v.quale}"><span class="a-pausa__ic">${ic(TIPI_PAUSA[v.quale].ic, 22)}</span><span class="a-pausa__t"><span class="a-nome">${TIPI_PAUSA[v.quale].nome}</span><span class="a-meta">${durataLunga(v.min)}, fino alle ${ora(v.fine)}</span></span><span class="a-pausa__cambia">Cambia</span></button></li>`;
        const t = T(v.id), nuova = v.id === S.nuova;
        return `<li class="a-tappa${nuova ? ' nuova' : ''}"><span class="a-ora num">${ora(v.inizio)}</span><button type="button" class="a-scheda${FOTO[v.id] ? '' : ' a-scheda--senza'}" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="a-scheda__t"><span class="a-nome">${esc(t.nome)}</span><span class="a-meta">${durata(t.durata)}, fino alle ${ora(v.fine)}</span>${etichette(v.id).map(e => `<span class="a-et">${e}</span>`).join(' ')}</span>${FOTO[v.id] ? `<img class="a-foto" src="${FOTO[v.id]}" alt="" loading="lazy" decoding="async">` : ''}</button></li>`;
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
        <button type="button" class="onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi, Pause e margini, Elimina">${ic('altro')}</button>
      </nav>`;
    },
    dopo() {
      let y0 = scrollY;
      ascolta('scroll', () => { const isola = $('.a-isola'); if (!isola) return; const y = scrollY; if (Math.abs(y - y0) > 8) { isola.classList.toggle('a-isola--piccola', y > y0 && y > 300); y0 = y; } });
      sfoglia($('.a-giorno'));
      this.mappaSu(false);
    },
    // la mappa: a destra sul computer, al posto dell'elenco sul telefono (tasto Mappa)
    mappaSu(vola) {
      const el = $('#mappa');
      if (!el) { if (mappa && !mappa.el.isConnected) { mappa.spegni(); mappa = null; } return; }
      if (!mappa || mappa.el !== el) { mappa?.spegni(); mappa = new Mappa(el, opzMappa({ traccia: '.m-c', tocca: id => A.tocca(id), margini: () => (computer.matches ? { t: 70, r: 60, b: 90, l: 60 } : { t: 50, r: 34, b: 60, l: 34 }) })); vola = false; }
      const Gx = G(S.g);
      mappa.disegna(Gx, { vola, daLinea: daLinea(), altre: Gx ? [] : altreLinee(), n: S.g + 1 });
      if (S.attiva) mappa.evidenzia(S.attiva);
    },
    giorno(g, daX = 0) {
      const dir = g > S.g ? 1 : -1;
      S.g = g; S.attiva = null;
      document.documentElement.dataset.g = String(g);
      segnaSchede(g);
      const isola = $('.a-isola');
      if (isola) { const piccola = isola.classList.contains('a-isola--piccola'); isola.outerHTML = this.isola(); if (piccola) $('.a-isola').classList.add('a-isola--piccola'); }
      const did = $('#a-didascalia');
      if (did) did.innerHTML = this.didascalia();
      const el = $('.a-giorno');
      scorri(el, dir, daX, () => {
        el.innerHTML = this.corpo();
        allInizio(el, $('.a-giorni'));
        rotta = true;
        if (!computer.matches) this.mappaSu(false);
        contaCifre();
        contaFine();
      }, undefined, () => { if (computer.matches) this.mappaSu(true); rotta = false; });
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
  // C · MAPPA PRIMA. Giro 5: la testata del foglio (numeri, tempo, Aggiungi) scorre via con la pagina, un poco alla
  // volta; restano in alto solo «Giorno 1 / Giorno 2» e il «+» (come in A, schede più strette del 15%). In basso, quando
  // la testata è sparita, la barra con «Aggiungi». La ricerca è quella di A.
  // =====================================================================================
  const C = {
    nome: 'Mappa prima',
    cerca: 'a',
    salva: 'c',
    idea: ['La mappa è la pagina. Scorrendo, il foglio sale e la sua testata scivola via insieme alla pagina, un poco alla volta: in alto restano solo «Giorno 1 / Giorno 2» e il «+» per un giorno in più.',
      'Quando la testata è sparita, in basso compare la barra con «Aggiungi». Sulla mappa il tasto con i due segnaposto mostra tutte le tappe della città: tocchi un punto e si apre la sua scheda.',
      'Ricerca come in A. Salva: il segnaposto cade e manda un\'onda. Logo in tema scuro: ambra, come in A.'],
    html() {
      return `<div class="c-mappa" id="c-mappa"><div id="mappa"></div></div>
      <header class="c-sopra"><button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button><div class="c-nome">${firma('firma--solo-segno')}<div><h1 data-nome>${esc(S.nome)}</h1>${stato()}</div></div>${bottoneSalva('c-salva onda')}</header>
      <div class="c-fumetto" id="fumetto" hidden></div>
      <div class="c-spazio" aria-hidden="true"><span class="c-sosta c-sosta--0"></span><span class="c-sosta c-sosta--1"></span></div>
      <section class="c-foglio" id="c-foglio" aria-label="Giornata"><span class="c-maniglia" aria-hidden="true"></span>
        <div class="c-giorni" id="c-giorni">${this.giorni()}</div>
        <div class="c-dentro giorno-corpo" id="c-dentro" data-inizio-giorno>${this.corpo(true)}</div>
        ${crediti()}
        <div class="c-giu" id="c-giu" data-nascosto="true"><nav class="c-giu__barra" aria-label="Comandi dell'itinerario">
          <button type="button" class="c-giu__mappa onda" data-azione="su-mappa">${ic('mappa', 20)}<span>Mappa</span></button>
          <button type="button" class="c-giu__piu onda" data-azione="aggiungi">${ic('piu', 20)}<span>Aggiungi</span></button>
          <button type="button" class="c-giu__altro onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi, Pause e margini, Elimina">${ic('altro')}</button></nav></div>
      </section>`;
    },
    giorni() { return `<div class="c-pista" style="--n:${nG()}">${schede('c')}<button type="button" class="c-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>`; },
    corpo(anima = false) {
      const Gx = G(S.g);
      let i = 0;
      const righe = Gx ? sequenza(Gx).map(v => {
        if (v.tipo === 'tratto') return `<li class="c-tratto" style="--i:${i++}"><i aria-hidden="true"></i><span>${ic('piedi', 15)}${testoTratto(v)}</span></li>`;
        if (v.tipo === 'pausa') return `<li class="c-riga c-pausa" style="--i:${i++}"><button type="button" data-azione="pausa" data-quale="${v.quale}"><span class="c-n c-n--pausa">${ic(TIPI_PAUSA[v.quale].ic, 17)}</span><span class="c-tit"><span class="c-ora num">${ora(v.inizio)} – ${ora(v.fine)}</span>${TIPI_PAUSA[v.quale].nome}<small class="c-pausa__d">${durataLunga(v.min)}: tocca per cambiarla</small></span><span></span></button></li>`;
        return `<li class="c-riga${v.id === S.nuova ? ' nuova' : ''}" style="--i:${i++}"><button type="button" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="c-n">${v.n}</span><span class="c-tit"><span class="c-ora num">${ora(v.inizio)} – ${ora(v.fine)}</span>${esc(T(v.id).nome)}${etichette(v.id).length ? `<small>${etichette(v.id).join(', ')}</small>` : ''}</span>${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy" decoding="async">` : '<span></span>'}</button></li>`;
      }).join('') : '';
      return `<div class="c-testa">${Gx ? cifre(Gx, 'cifre c-cifre') + tempo(Gx, 'tempo--c') : ''}
          <div class="c-riga-azioni"><p class="c-riassunto">${Gx ? `<b>${esc(titoloGiorno(Gx))}</b>dalle ${ora(Gx.inizio)} alle <span data-conta="fine">${ora(Gx.fine)}</span>` : '<b>Giorno vuoto</b>Aggiungi la prima tappa'}</p>
            <button type="button" class="c-azione c-azione--piena onda" data-azione="aggiungi">${ic('piu', 20)}Aggiungi</button>
            <button type="button" class="c-azione onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi, Pause e margini, Elimina">${ic('altro')}</button></div></div>
        <div class="c-corpo${anima ? ' c-entra' : ''}">${Gx ? `<ol class="c-elenco">${righe}</ol>${liberoBlocco(Gx, 'c-libero')}` : vuoto('c-vuoto', 'c-azione')}</div>`;
    },
    margini() {
      if (computer.matches) return { t: 90, r: 70, b: 70, l: 500 };
      const el = $('#mappa'), sp = $('.c-spazio');
      const visibile = sp ? sp.offsetHeight : 300;
      return { t: 112, r: 64, b: Math.max(60, (el?.clientHeight || 600) - visibile + 40), l: 36 };
    },
    dopo() {
      mappa = new Mappa($('#mappa'), opzMappa({ tocca: id => C.tocca(id), margini: () => C.margini(), distanza: 36 }));
      this.disegnaMappa(false, daLinea());
      const carta = $('#c-mappa');
      ascolta('scroll', () => {
        const sp = $('.c-spazio');
        if (!sp || computer.matches) return;
        const k = Math.max(0, Math.min(1, scrollY / Math.max(1, sp.offsetHeight)));
        carta.style.setProperty('--su', k.toFixed(3));
        // quando il foglio copre tutta la mappa, la mappa non si disegna (sul telefono il cambio di giorno resta leggero)
        carta.classList.toggle('c-mappa--coperta', k >= 1 && scrollY > sp.offsetHeight + 40);
      });
      this.osserva();
      sfoglia($('#c-foglio'), () => $('#c-dentro'));
    },
    // la barra in basso compare quando la riga con «Aggiungi» è passata sotto i giorni (o sotto la testata)
    osserva() {
      const giu = $('#c-giu');
      if (!giu) return;
      const guarda = () => {
        const r = $('.c-riga-azioni'), cg = $('#c-giorni');
        if (!r || !cg) { giu.dataset.nascosto = 'false'; return; }
        const alto = (computer.matches ? $('#c-foglio').getBoundingClientRect().top : parseFloat(getComputedStyle(cg).top) || 0) + cg.offsetHeight;
        const via = r.getBoundingClientRect().bottom < alto + 4;
        if (giu.dataset.nascosto !== String(!via)) giu.dataset.nascosto = String(!via);
        document.documentElement.classList.toggle('c-giu-su', via);
      };
      if (!this.guarda) { this.guarda = guarda; ascolta('scroll', () => this.guarda()); $('#c-foglio').addEventListener('scroll', () => requestAnimationFrame(() => this.guarda()), { passive: true }); }
      this.guarda = guarda;
      guarda();
    },
    disegnaMappa(vola, da = null) {
      const Gx = G(S.g);
      mappa.disegna(Gx, { vola, daLinea: da, altre: Gx ? [] : altreLinee(), n: S.g + 1 });
      if (S.attiva) mappa.evidenzia(S.attiva);
    },
    // il foglio torna all'inizio del giorno (sul computer scorre il pannello, sul telefono la pagina)
    allInizio() {
      const f = $('#c-foglio');
      if (!f) return;
      if (computer.matches) { if (f.scrollTop > 0) f.scrollTop = 0; } else allInizio($('#c-dentro'), $('#c-giorni'));
    },
    giorno(g, daX = 0) {
      const dir = g > S.g ? 1 : -1;
      S.g = g; S.attiva = null;
      document.documentElement.dataset.g = String(g);
      $('#fumetto').hidden = true;
      segnaSchede(g);
      const el = $('#c-dentro');
      scorri(el, dir, daX, () => { el.innerHTML = this.corpo(true); this.allInizio(); contaCifre(); contaFine(); this.osserva(); }, undefined, () => this.disegnaMappa(true));
    },
    aggiorna(fn, opz = {}) {
      const prima = S.g, segno = segnoOra();
      fn();
      if (!mappa || S.eliminato || !$('#c-foglio')) { aggiornaTutto(() => {}); return; }
      document.documentElement.dataset.g = String(S.g);
      const cambiato = prima !== S.g || !!opz.giorno;
      $('#c-giorni').innerHTML = this.giorni();
      mettiSegno($('#c-giorni .schede'), { da: segno });
      osservaSchede();
      $('#c-dentro').innerHTML = this.corpo(cambiato);
      contaCifre();
      this.osserva();
      this.disegnaMappa(cambiato || !!S.nuova, cambiato ? null : S.nuova ? D.giorni[S.g].linee.length : Infinity);
      if (cambiato) { this.allInizio(); entra($('#c-dentro'), S.g >= prima ? 1 : -1); }
      contaFine();
      prova();
      ricorda();
    },
    tocca(id, b) {
      S.attiva = id;
      $$('.c-riga button').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
      mappa?.centra(id);
      apriScheda(id, b && b.closest?.('.c-riga') ? b : null);
    }
  };
  AZ['su-mappa'] = () => { if (computer.matches) { mappa?.tutto(); return; } scrollTo({ top: 0, behavior: piano() ? 'smooth' : 'auto' }); };

  // =====================================================================================
  // D · LE PAGINE. Giro 5: sul telefono l'altezza segue il dito tra una pagina e l'altra (prima saltava a fine gesto) e
  // le cartoline della pagina accanto sono già appoggiate quando arrivi (prima si riappoggiavano tutte insieme: «trema»).
  // Sul computer la pagina nuova entra di lato come in A e C. Tra le cartoline, il biglietto della pausa.
  // =====================================================================================
  const PASSO = 64;
  // Le orme dei passi (giro 5, Enrico: «al contrario» e fatte meglio): si cammina verso la cartolina dopo, quindi la punta
  // guarda in basso. L'impronta è di una scarpa: tacco e suola separati, l'arco all'interno, le righe della suola;
  // il piede destro è lo specchio del sinistro, le punte un poco verso l'esterno, il passo lungo più di un piede.
  const IMPRONTA = '<path class="orma__tacco" d="M-3 -13.6C-2.6 -15.6 3.4 -15.6 3.6 -13.4L3.4 -8C3.2 -6.2 -2.6 -6.2 -2.9 -8Z"/><path class="orma__suola" d="M-1.2 -3C1 -4 3 -3.6 3.6 -2C4.6 .6 5 4 4.6 7.6C4.2 11 2.4 13.6 -.6 14.4C-3.4 15 -5 12.6 -4.9 8.6C-4.8 5 -3.6 1.2 -1.2 -3Z"/><path class="orma__righe" d="M-3.9 4.4L4.2 3.6M-4.2 9L4.3 8.3"/>';
  const orme = () => `<svg class="orme" viewBox="0 0 64 128" aria-hidden="true" focusable="false">${[0, 1, 2, 3, 4].map(k => { const destro = k % 2 === 0, x = destro ? 25 : 40, y = 16 + k * 24, r = destro ? 7 : -7; return `<g class="orma" style="--k:${k}" transform="translate(${x} ${y}) rotate(${r}) scale(${destro ? -1.08 : 1.08} 1)">${IMPRONTA}</g>`; }).join('')}</svg>`;
  const Dp = {
    nome: 'Le pagine',
    cerca: 'd',
    salva: 'd',
    idea: ['Un giorno è una pagina: si sfoglia con il dito (sul computer anche con il mouse o con due dita sul touchpad); la pagina nuova arriva già al suo posto, senza scatti.',
      'Le cartoline si appoggiano sul tavolo mentre scorri; tra una e l\'altra le orme dei passi e, all\'ora di pranzo, il biglietto della pausa. Sotto i francobolli, il tempo del giorno.',
      'Salva: un timbro si stampa sul pulsante. Logo in tema scuro: ambra, come A e C. Ricerca: un foglietto di carta scende dall\'alto e si appoggia.'],
    html() {
      const pc = computer.matches;
      return `<div class="d-tutto"><div class="d-sinistra">
        <header class="d-testata">${firma()}<button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button></header>
        <div class="d-titolo"><div><h1 data-nome>${esc(S.nome)}</h1>${stato()}</div>${bottoneSalva('d-salva onda')}</div>
        <nav class="d-indice" aria-label="Giorni"><div class="d-indice__voci" role="tablist" aria-label="Giorni dell'itinerario">${range(nG()).map(g => `<button type="button" role="tab" aria-selected="${g === S.g}" tabindex="${g === S.g ? 0 : -1}" data-azione="giorno" data-g="${g}" aria-label="Giorno ${g + 1}">${g + 1}</button>`).join('')}</div><span class="d-indice__segno" id="d-segno" aria-hidden="true" style="transform:translateX(${S.g * PASSO}px)"></span><button type="button" class="d-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 22)}</button><span class="d-indice__dove" id="d-dove" aria-live="polite">giorno ${S.g + 1} di ${nG()}</span></nav>
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
      const voci = Gx ? sequenza(Gx).map(v => {
        if (v.tipo === 'tratto') return `<div class="d-tratto">${v.mezzi.length ? ic('mappa', 22) : orme()}<span class="d-tratto__t">${testoTratto(v)}</span></div>`;
        if (v.tipo === 'pausa') return `<button type="button" class="d-pausa" data-azione="pausa" data-quale="${v.quale}"><span class="d-pausa__ic">${ic(TIPI_PAUSA[v.quale].ic, 24)}</span><span class="d-pausa__t"><b>${TIPI_PAUSA[v.quale].nome}</b><span class="num">${ora(v.inizio)} – ${ora(v.fine)}, ${durataLunga(v.min)}</span></span><span class="d-pausa__cambia">Cambia</span></button>`;
        const t = T(v.id);
        return `<button type="button" class="d-cartolina${v.id === S.nuova ? ' nuova' : ''}" style="--k:${k++}" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="d-foto">${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy" decoding="async">` : `<span class="d-senza" aria-hidden="true">${esc(t.breve)}</span>`}<span class="d-timbro-ora num" aria-hidden="true">${ora(v.inizio)}</span></span><span class="d-cartolina__testo"><span class="vh">Alle ${ora(v.inizio)}, ${durata(t.durata)}: </span><b>${esc(t.nome)}</b><span class="d-frase">${esc(t.frase)}</span><span class="d-meta">${durata(t.durata)}, fino alle ${ora(v.fine)}</span>${etichette(v.id, g).map(e => `<span class="d-et">${e}</span>`).join('')}</span></button>`;
      }).join('') : '';
      const sug = Gx ? suggerite(g) : [];
      const l = Gx ? Gx.resta : 0;
      return `<section class="d-pagina${qui ? ' attiva' : ''}${qui && computer.matches ? ' giorno-corpo' : ''}" data-pagina="${g}" aria-label="Giorno ${g + 1}"${qui ? ' data-inizio-giorno' : ' inert'}><h2>${ORDINALE[g]} giorno<small>${Gx ? esc(titoloGiorno(Gx)) : 'ancora vuoto'}</small></h2>
        ${Gx ? `${cifre(Gx, 'cifre d-francobolli', `@${g}`)}${tempo(Gx, 'tempo--d', { suf: `@${g}` })}<div class="d-cartoline">${voci}</div>
          ${l > 0 ? `<div class="d-libero"><p>${resta(l)} prima delle ${ora(Gx.fineScelta)}: c'è spazio per un'altra cartolina.</p>
            <ul class="d-sug">${sug.map(id => `<li><button type="button" class="d-sug__c onda" data-azione="aggiungi-subito" data-id="${id}">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" loading="lazy" decoding="async">` : '<span class="d-senza"></span>'}<b>${esc(T(id).breve)}</b><small class="num">${D.aggiunte[g][id].tratto.min} min a piedi</small><span class="d-sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>
            <button type="button" class="d-bottone d-bottone--contorno onda" data-azione="aggiungi">Vedi tutte le ${D.vicine[g].length} tappe</button></div>` : liberoBlocco(Gx, 'd-libero', g)}` : vuoto('d-vuoto', 'd-bottone')}
        <div class="d-dopo"></div></section>`;
    },
    dopo() {
      const pag = $('#d-pagine');
      const pc = computer.matches;
      let y0 = scrollY;
      ascolta('scroll', () => { const tab = $('.d-tab'); if (!tab || computer.matches) return; const y = scrollY; if (Math.abs(y - y0) > 8) { tab.classList.toggle('d-tab--via', y > y0 && y > 260); y0 = y; } });
      // le cartoline e le orme si animano quando arrivano sullo schermo; le pagine accanto contano come visibili
      // (margine di lato): così quando sfogli sono già appoggiate
      if (piano() && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vista'); io.unobserve(e.target); } }), { rootMargin: pc ? '0px 0px -8% 0px' : '0px 200% -8% 200%' });
        this.io = io;
        $$('.d-cartolina, .d-tratto, .d-francobolli, .d-pausa', pag).forEach(x => { x.classList.add('da-vedere'); io.observe(x); });
      }
      if (pc) {
        mappa = new Mappa($('#mappa'), opzMappa({ tocca: id => Dp.tocca(id), margini: () => ({ t: 60, r: 56, b: 80, l: 56 }) }));
        mappa.disegna(G(S.g), { daLinea: daLinea(), altre: G(S.g) ? [] : altreLinee(), n: S.g + 1 });
        sfoglia(pag, () => $('.d-pagina.attiva'));
        return;
      }
      pag.scrollLeft = S.g * pag.clientWidth;
      this.misura();
      this.profondita();
      let fermo;
      pag.addEventListener('scroll', () => {
        const x = pag.scrollLeft / pag.clientWidth;
        $('#d-segno').style.transform = `translateX(${(x * PASSO).toFixed(1)}px)`;
        this.profondita();
        // l'altezza passa piano da quella di una pagina a quella dell'altra, insieme al dito
        const i = Math.max(0, Math.min(nG() - 1, Math.floor(x))), f = x - i, h = this.alte || [];
        if (h[i] != null) pag.style.height = `${(h[i] + ((h[i + 1] ?? h[i]) - h[i]) * Math.max(0, Math.min(1, f))).toFixed(1)}px`;
        const g = Math.max(0, Math.min(nG() - 1, Math.round(x)));
        if (g !== S.g) {
          S.g = g; S.attiva = null; S.nuova = null;
          document.documentElement.dataset.g = String(g);
          $$('.d-indice [role="tab"]').forEach(b => { const si = +b.dataset.g === g; b.setAttribute('aria-selected', String(si)); b.tabIndex = si ? 0 : -1; });
          $('#d-dove').textContent = `giorno ${g + 1} di ${nG()}`;
          $$('.d-pagina').forEach(p => { const qui = +p.dataset.pagina === g; p.classList.toggle('attiva', qui); p.toggleAttribute('data-inizio-giorno', qui); p.inert = !qui; });
        }
        clearTimeout(fermo);
        fermo = setTimeout(() => {
          this.misura();
          contaFine();
          // se eri molto più in basso della pagina nuova, la pagina sale piano al suo inizio
          const p = pag.children[S.g], top = p ? p.getBoundingClientRect().top : 0;
          if (p && top < -innerHeight * .9) {
            // le cartoline che passano sullo schermo mentre la pagina sale sono già appoggiate: niente oscillazioni
            $$('.da-vedere:not(.vista)', p).forEach(x => { if (x.getBoundingClientRect().top < innerHeight) { x.classList.add('vista', 'subito'); this.io?.unobserve(x); } });
            scrollTo({ top: scrollY + top - 120, behavior: piano() ? 'smooth' : 'auto' });
            setTimeout(() => $$('.subito', p).forEach(x => x.classList.remove('subito')), 1000);
          }
        }, 140);
      }, { passive: true });
    },
    profondita() {
      const pag = $('#d-pagine');
      if (!pag || !piano()) return;
      const x = pag.scrollLeft / pag.clientWidth;
      $$('.d-pagina', pag).forEach(p => p.style.setProperty('--o', (+p.dataset.pagina - x).toFixed(3)));
    },
    // le altezze delle pagine (sul telefono il contenitore è alto quanto la pagina che guardi)
    misura() {
      const pag = $('#d-pagine');
      if (!pag || computer.matches) return;
      this.alte = [...pag.children].map(p => p.offsetHeight);
      const x = pag.scrollLeft / pag.clientWidth, i = Math.round(x);
      if (this.alte[i] != null) pag.style.height = `${this.alte[i]}px`;
    },
    giorno(g, daX = 0) {
      const pag = $('#d-pagine');
      if (computer.matches) {
        const dir = g > S.g ? 1 : -1, vecchia = $('.d-pagina.attiva');
        S.g = g; S.attiva = null;
        document.documentElement.dataset.g = String(g);
        $$('.d-indice [role="tab"]').forEach(b => { const si = +b.dataset.g === g; b.setAttribute('aria-selected', String(si)); b.tabIndex = si ? 0 : -1; });
        $('#d-segno').style.transform = `translateX(${g * PASSO}px)`;
        $('#d-dove').textContent = `giorno ${g + 1} di ${nG()}`;
        scorri(vecchia, dir, daX, () => {
          $$('.d-pagina', pag).forEach(p => { const qui = +p.dataset.pagina === g; p.classList.toggle('attiva', qui); p.classList.toggle('giorno-corpo', qui); p.toggleAttribute('data-inizio-giorno', qui); p.inert = !qui; });
          const nuova = $('.d-pagina.attiva');
          // le cartoline che si vedono sono già appoggiate: entra la pagina intera, non ogni cartolina
          $$('.da-vedere', nuova).forEach(x => { if (x.getBoundingClientRect().top < innerHeight) { x.classList.add('vista', 'subito'); this.io?.unobserve(x); } });
          requestAnimationFrame(() => requestAnimationFrame(() => $$('.subito', nuova).forEach(x => x.classList.remove('subito'))));
          allInizio(nuova, $('.d-indice'));
          contaFine();
        }, () => $('.d-pagina.attiva'), () => mappa?.disegna(G(g), { vola: true, altre: G(g) ? [] : altreLinee(), n: g + 1 }));
        return;
      }
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
    mappaD = new Mappa($('#mappa-d'), opzMappa({ tocca: id => apriScheda(id), margini: () => ({ t: 44, r: 36, b: 70, l: 36 }) }));
    const Gx = G(S.g);
    mappaD.disegna(Gx, { altre: Gx ? [] : altreLinee(), n: S.g + 1 });
    $('[data-azione="chiudi-mappa"]', s).focus();
  };
  AZ['chiudi-mappa'] = () => { const s = $('#d-strato'); if (s) s.hidden = true; mappaD?.spegni(); mappaD = null; $('.d-tab__mappa')?.setAttribute('aria-pressed', 'false'); $('.d-tab__mappa')?.focus(); };
  addEventListener('keydown', e => { if (e.key === 'Escape' && $('#d-strato') && !$('#d-strato').hidden) AZ['chiudi-mappa'](); });

  const P = { a: A, c: C, d: Dp };

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
    $('#idea').innerHTML = `<h2>${S.p.toUpperCase()} · ${P[S.p].nome}</h2>${P[S.p].idea.map(t => `<p>${esc(t)}</p>`).join('')}<p class="idea__nota">Giro 5. In tutte: il cambio di giorno senza scatti; pause e margini che si cambiano (la pausa pranzo c'è già) e il tempo del giorno con la fine stimata; «Chiuso il martedì» solo se scegli la data; tutte le tappe sulla mappa; «Rinomina» in «I miei itinerari»; l'itinerario resta salvato anche se chiudi la pagina.</p>`;
  }
  $$('#prova .p-scelte button').forEach(b => b.addEventListener('click', () => { if (b.dataset.p !== S.p) location.hash = b.dataset.p; }));
  function daHash(primo) {
    const p = location.hash.slice(1);
    const nuovo = P[p] ? p : 'a';
    if (!primo && nuovo === S.p) return;
    // ogni proposta riparte dal primo giorno, con l'itinerario che hai sul telefono; il marchio si anima di nuovo
    const fai = () => { Object.assign(S, { ...NUOVO(), p: nuovo }); rotta = true; disegna(); scrollTo(0, 0); };
    if (!primo && document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
  }
  addEventListener('hashchange', () => daHash(false));
  computer.addEventListener('change', () => { rotta = true; disegna(); });
  addEventListener('resize', () => { if (S.p === 'd') Dp.misura(); });

  mettiTema();
  daHash(true);
  try { if (!localStorage.getItem('prova-idea-vista-5')) { $('#idea').showPopover?.(); localStorage.setItem('prova-idea-vista-5', '1'); } } catch {}
})();
