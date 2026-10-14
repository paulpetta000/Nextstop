// Compositore, pezzo 2, giro 2 (scelta di Enrico, 13/10/2026): la proposta 1 del giro 1 (il foglio, la porta con il numero, la maniglia),
// con «visitata» nella scheda come timbro tondo sulla foto (tre stili: S.t), il consiglio dell'ordine più corto e la barra del tempo più chiara.
// Il codice delle proposte 2-4 resta ma non si usa (S.q è sempre 1).
// Giro 1: la scheda della tappa e «visitato», quattro proposte dentro C «Mappa prima» e D «Le pagine»
// (le due viste scelte nel pezzo 1: chi visita passa dall'una all'altra). Dati veri di «Due giorni a Napoli».
// Novità: il calcolo dei giorni è quello del sito (window.CALCOLO, da src/lib/itinerari/: lo mette genera.mjs), quindi
// spostando, togliendo o aggiungendo una tappa gli orari e i percorsi cambiano davvero; con «oggi» (prova nel pannello Idea)
// le tappe visitate vanno in cima e gli orari si ricalcolano da adesso, come fa il sito. Giorno feriale.
// Le quattro proposte cambiano tre cose: come si apre la scheda, come si segna «visitato», come si sposta e si toglie.
//   1 Il foglio: sale a metà (in C la mappa resta sopra e segue la tappa), si tira su; di lato passi alla tappa dopo
//   2 La riga si apre: la tappa si allarga sul posto; si scorre la riga a destra (visitata) o a sinistra (togli)
//   3 A tutta pagina: la scheda è una pagina di rivista; il sigillo sulla foto; «Modifica il giorno» per spostare e togliere
//   4 In cammino: le schede del giorno una accanto all'altra; la strada fatta si colora; il menu «⋯» su ogni tappa
(() => {
  const RICERCA = true; // pezzo 3: locali e gite nei dati (genera.mjs)
  const D = window.DATI, FOTO = window.FOTO, M = window.MAPPA, ST = window.STRADE, K = window.CALCOLO;
  const CITTA = K.spacchetta(D.pacco);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const piano = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const computer = matchMedia('(min-width: 960px)');
  const range = n => Array.from({ length: n }, (_, i) => i);
  const dopo = ms => new Promise(r => setTimeout(r, ms));
  const due = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

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
  const SCALE = { no: 'senza scale', pochi: 'qualche gradino', molti: 'molte scale' };
  const MOMENTO = { mattina: 'Meglio la mattina', pomeriggio: 'Meglio il pomeriggio', sera: 'Meglio verso sera' };
  const ORDINALE = ['Primo', 'Secondo', 'Terzo', 'Quarto', 'Quinto', 'Sesto', 'Settimo'];
  const norma = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const maiuscola = s => s.charAt(0).toUpperCase() + s.slice(1);
  const dataScritta = s => new Date(`${s}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

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
    su: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    giu: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    alza: '<path d="M6 15l6-6 6 6"/>',
    abbassa: '<path d="M6 9l6 6 6-6"/>',
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
    matita: '<path d="M15.5 4.5l4 4L8.5 19.5H4.5v-4z"/><path d="M13 7l4 4"/>',
    maniglia: '<path d="M9 5.5h.01M15 5.5h.01M9 12h.01M15 12h.01M9 18.5h.01M15 18.5h.01" stroke-width="3.4"/>',
    sposta: '<path d="M7 4v16M3.5 7.5L7 4l3.5 3.5M17 20V4M13.5 16.5L17 20l3.5-3.5"/>',
    esterno: '<path d="M14 4.5h5.5V10M19.5 4.5l-8.5 8.5M17.5 14v4.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1H10"/>',
    gradini: '<path d="M4 19.5h5v-5h5v-5h5v-5"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.01"/>',
    bussola: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    occhio: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    porta: '<path d="M6 21V11.5C6 7.4 8.7 4 12 4s6 3.4 6 7.5V21"/><path d="M3.5 21h17"/>'
  };
  const ic = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[n]}</svg>`;
  const segnalibro = `<svg class="salva__ic" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="salva-clip"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></clipPath></defs><g clip-path="url(#salva-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path class="salva__spunta" d="M9 11.2l2.2 2.2 4-4.4" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // =====================================================================================
  // «Visitata»: la soglia del marchio che si chiude (specifica §5). Da visitare: la porta vuota, con il numero della tappa.
  // Toccandola le sei soglie del marchio entrano una dentro l'altra (come nell'animazione del marchio, più veloce) e
  // compare la spunta. Si torna indietro con un altro tocco. Con «riduci movimento»: solo una dissolvenza.
  // =====================================================================================
  const STRATI = [
    'M12 41V24.6C12 14.31 18.98 6 24 6S36 14.31 36 24.6V41Z', 'M14.4 39V25.88C14.4 17.65 19.99 11 24 11S33.6 17.65 33.6 25.88V39Z',
    'M16.32 37.4V26.9C16.32 20.32 20.79 15 24 15S31.68 20.32 31.68 26.9V37.4Z', 'M17.86 36.12V27.72C17.86 22.46 21.43 18.2 24 18.2S30.14 22.46 30.14 27.72V36.12Z',
    'M19.08 35.1V28.38C19.08 24.17 21.95 20.76 24 20.76S28.92 24.17 28.92 28.38V35.1Z', 'M20.07 34.28V28.9C20.07 25.53 22.36 22.81 24 22.81S27.93 25.53 27.93 28.9V34.28Z'
  ];
  const SPUNTA = 'M17.2 27.6l4.6 4.5 8.6-9.6';
  const soglia = (cl = '') => `<svg class="soglia ${cl}" viewBox="10 4.5 28 37.5" aria-hidden="true" focusable="false"><path class="soglia__porta" d="${STRATI[0]}"/>${STRATI.map((d, k) => `<path class="soglia__s" style="--k:${k}" d="${d}"/>`).join('')}<path class="soglia__sotto" d="${SPUNTA}" pathLength="1"/><path class="soglia__spunta" d="${SPUNTA}" pathLength="1"/></svg>`;

  // ---------- il marchio, con l'animazione della home (DESIGN.md §7) ----------
  const LETTERE = [...'nextstop'];
  const AMBRA = { strati: ['#C8702E', '#DE8E43', '#EDAE66', '#F5CB93', '#FBE4C2', '#FFF7EA'], spillo: '#10173A', buco: '#FFF7EA' };
  const segnoColorato = c => { const colori = [...c.strati, c.spillo, c.buco]; let k = 0; return D.marchio.chiaro.replace(/fill="#[0-9A-Fa-f]{6}"/g, () => `fill="${colori[Math.min(k++, colori.length - 1)]}"`); };
  const firma = (cl = '') => `<a class="firma ${cl}" href="#${S.p}${S.t}"><span class="vh">nextstop</span><svg class="firma__segno segno--chiaro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${D.marchio.chiaro}</svg><svg class="firma__segno segno--scuro" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${segnoColorato(AMBRA)}</svg><span class="firma__parola" aria-hidden="true">${LETTERE.map((c, i) => (i === 6
    ? `<span class="firma__pin" style="--i:${i}"><i class="firma__ombra"></i><svg viewBox="0 0 20 28" focusable="false">${D.marchio.spillo}</svg><i class="firma__onda"></i></span>`
    : `<span class="firma__l" style="--i:${i}">${c}</span>`)).join('')}<span class="firma__rotta"></span></span></a>`;
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
  // Stato della prova. L'itinerario resta sul telefono; parte salvato (così «visitato» si vede subito: la specifica lo vuole
  // sugli itinerari salvati). Le tappe visitate sono un segno per tappa: se sposti la tappa in un altro giorno, il segno la segue.
  // =====================================================================================
  const CHIAVE = 'prova-mangiare-1';
  const OGGI = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
  const ORA_FINTA = 12 * 60 + 10;   // la prova «oggi»: sono le 12:10 del giorno 1
  const INIZIO = 570, MAX_TAPPE = 14;
  let FINE = 1140; // pezzo 7: «Sera» nella striscia la porta alle 22:00, per vedere la cena
  const PRONTO = () => D.pronto.map(g => [...g.tappe]);
  const esiste = id => !!D.tappe[id];
  function richiama() {
    try {
      const x = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
      if (x && typeof x === 'object') {
        const giorni = Array.isArray(x.giorni) && x.giorni.length >= 1 && x.giorni.length <= 3 ? x.giorni.map(l => (Array.isArray(l) ? [...new Set(l.filter(esiste))].slice(0, MAX_TAPPE) : [])) : PRONTO();
        const fatte = {};
        if (x.fatte && typeof x.fatte === 'object') for (const [id, t] of Object.entries(x.fatte)) if (giorni.some(l => l.includes(id)) && Number.isFinite(t)) fatte[id] = t;
        return { nome: typeof x.nome === 'string' && x.nome.trim() ? x.nome : D.nome, salvato: x.salvato !== false, giorni, fatte, pause: x.pause && typeof x.pause === 'object' ? x.pause : {}, margine: [0, 5, 10, 15].includes(x.margine) ? x.margine : 0, data: typeof x.data === 'string' ? x.data : null, oggi: !!x.oggi, ordineOk: x.ordineOk && typeof x.ordineOk === 'object' ? x.ordineOk : {} };
      }
    } catch {}
    return {};
  }
  function ricorda() {
    if (S.eliminato) return;
    try { localStorage.setItem(CHIAVE, JSON.stringify({ nome: S.nome, salvato: S.salvato, giorni: S.giorni, fatte: S.fatte, pause: S.pause, margine: S.margine, data: S.data, oggi: S.oggi, ordineOk: S.ordineOk, quando: Date.now() })); } catch {}
  }
  const dimentica = () => { try { localStorage.removeItem(CHIAVE); } catch {} };
  const NUOVO = () => ({ g: 0, nome: D.nome, salvato: true, eliminato: false, giorni: PRONTO(), fatte: {}, pause: {}, margine: 0, data: null, oggi: false, tutte: false, attiva: null, nuova: null, aperta: null, modifica: false, anima: true, fini: {}, ordineOk: {}, noGrazie: {}, ...richiama() });
  let vistaSalvata = null;
  try { vistaSalvata = localStorage.getItem('prova-scheda-vista'); } catch {}
  const S = { p: 'c', q: 1, t: 2, r: 1, ...NUOVO() };
  const nG = () => S.giorni.length;
  const T = id => D.tappe[id];
  const visitata = id => !!S.fatte[id];
  const puoiSegnare = () => S.salvato && !S.eliminato;
  const giornoDi = id => S.giorni.findIndex(l => l.includes(id));
  const nelViaggio = id => giornoDi(id) >= 0;

  // =====================================================================================
  // I giorni, con il calcolo del sito. Con «oggi» il giorno di oggi è calcolato dal vivo: le visitate in cima, senza orari,
  // e si riparte dalle 12:10 dall'ultima tappa segnata (come il sito: src/lib/itinerari/calcolo.ts).
  // =====================================================================================
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
  const percorso = (s, a, b) => D.percorsi[s]?.[a]?.[b] ?? D.percorsi.feriale[a]?.[b] ?? '';
  const traccia = punti => 'M' + punti.map(p => p.join(' ')).join('L');
  const tappaC = id => CITTA.tappe.find(t => t.id === id);
  const fatteDi = l => l.filter(id => S.fatte[id]).sort((a, b) => S.fatte[a] - S.fatte[b]);
  const itin = (giorni = S.giorni) => ({ id: 'prova', nome: S.nome, data: S.data || undefined, giorni: giorni.map(l => ({ tappe: l, inizio: INIZIO, fine: FINE, fatte: fatteDi(l) })), creato: 0, modificato: 0 });
  const adesso = () => (S.oggi && S.data === OGGI ? { data: OGGI, ora: ORA_FINTA } : undefined);
  const vivoOggi = g => !!adesso() && g === 0;
  const memo = new Map();
  function grezzo(g, lista = S.giorni[g]) {
    if (!lista || !lista.length) return null;
    const giorni = S.giorni.map((l, k) => (k === g ? lista : l));
    const a = adesso();
    const chiave = JSON.stringify([g, giorni, lista.map(id => S.fatte[id] || 0), S.data, a, FINE]);
    if (memo.has(chiave)) return memo.get(chiave);
    const r = K.calcolaGiorno(CITTA, itin(giorni), g, a);
    const linee = [];
    const voci = r.voci.map((v, iv) => {
      if (v.tipo === 'tratto') {
        linee.push(...decodifica(percorso(v.scenario, v.da, v.a)).filter(p => p.punti.length > 1).map(p => ({ modo: p.modo === 'p' ? 'piedi' : p.modo, d: traccia(p.punti), v: iv })));
        return { tipo: 'tratto', min: v.min, metri: v.metri, mezzi: v.mezzi.map(m => CITTA.linee?.[m] ?? m) };
      }
      const t = tappaC(v.id);
      if (!v.fatta && t.pf != null && t.pf >= 0) { const [x, y] = v.indietro ? [t.pf, t.p] : [t.p, t.pf]; for (const p of decodifica(percorso('piedi', x, y))) if (p.punti.length > 1) linee.push({ modo: 'piedi', d: traccia(p.punti), dentro: true, v: iv }); }
      return { tipo: 'tappa', id: v.id, n: v.n, inizio: v.inizio, fine: v.fine, fatta: !!v.fatta, inCorso: !!v.inCorso, indietro: !!v.indietro, xy: v.indietro && t.xyFine ? t.xyFine : t.xy };
    });
    const out = { inizio: r.inizio, partenza: r.vivo && ORA_FINTA > INIZIO ? ORA_FINTA : r.inizio, fine: r.fine, fineScelta: FINE, visite: r.visite, spostamenti: r.spostamenti, metri: r.metri, avvisi: r.avvisi, voci, linee, vivo: !!r.vivo };
    if (memo.size > 400) memo.clear();
    memo.set(chiave, out);
    return out;
  }
  const G = g => conTempo(grezzo(g), g);
  const tappe = Gx => Gx.voci.filter(v => v.tipo === 'tappa');
  const daFare = Gx => tappe(Gx).filter(v => !v.fatta);
  const ultimaDi = g => S.giorni[g]?.slice(-1)[0];
  const titoloGiorno = Gx => [...new Set(tappe(Gx).map(v => T(v.id).zona))].join(', ');
  const aPiedi = Gx => Gx.voci.every(v => v.tipo !== 'tratto' || !v.mezzi.length);
  const testoTratto = v => (v.mezzi.length ? `${v.min} min, a piedi e ${v.mezzi.join(' e ')}` : `${v.min} min a piedi, ${metri(v.metri)}`);
  // «Aggiungi»: la tappa in fondo al giorno, con il calcolo vero; le più vicine prima
  function aggiunta(g, id) {
    const X = grezzo(g, [...S.giorni[g], id]);
    const iT = X.voci.findIndex(v => v.tipo === 'tappa' && v.id === id);
    const tratto = X.voci[iT - 1]?.tipo === 'tratto' ? X.voci[iT - 1] : null;
    return { tratto, X };
  }
  const daVedere = id => T(id).tipo === 'citta' && !T(id).categoria;
  const candidate = g => Object.keys(D.tappe).filter(id => daVedere(id) && !nelViaggio(id)).map(id => ({ id, ...aggiunta(g, id) })).sort((a, b) => (a.tratto?.min ?? 0) - (b.tratto?.min ?? 0) || a.id.localeCompare(b.id));

  // ---------- la data: senza data i giorni di chiusura restano solo nella scheda della tappa ----------
  const dataDi = g => { const d = new Date(`${S.data}T12:00:00`); d.setDate(d.getDate() + g); return d; };
  const giornoSett = g => SETTIMANA[dataDi(g).getDay()];
  const dataLunga = g => dataDi(g).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  const testoQuando = () => (S.data ? `Da ${dataLunga(0)}${adesso() ? ' (oggi)' : ''}, dalle 9:30 alle 19:00` : 'Senza data, dalle 9:30 alle 19:00');
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
  const suggerite = (g, n = 3) => (S.giorni[g]?.length ? candidate(g).slice(0, n) : []);
  const crediti = () => `<details class="crediti"><summary>Crediti delle foto e della mappa</summary><p>Mappa: dati © i contributori di OpenStreetMap (ODbL). Foto: ${Object.entries(D.crediti).map(([id, c]) => `${esc(T(id)?.breve ?? id)}, ${esc(c.autore)} (${esc(c.licenza)})`).join('; ')}.</p></details>`;

  // =====================================================================================
  // Pause e margini (pezzo 1, giro 5): sopra il calcolo del sito, spostano gli orari dopo; i tempi a piedi restano veri.
  // Le tappe visitate di oggi (dal vivo) restano in cima, senza orari.
  // =====================================================================================
  const TIPI_PAUSA = {
    pranzo: { nome: 'Pausa pranzo', ic: 'posate', min: 60, ora: 780, scelte: [30, 45, 60, 90] },
    caffe: { nome: 'Pausa caffè', ic: 'tazza', min: 20, ora: 990, scelte: [15, 20, 30] },
    riposo: { nome: 'Riposo', ic: 'panchina', min: 30, ora: 930, scelte: [15, 30, 45, 60] },
    // pezzo 7: prima di una cena scelta, se arrivi prima delle 19:30 (non si aggiunge dal foglio delle pause)
    libero: { nome: 'Tempo libero', ic: 'panchina', min: 30, ora: 1140, scelte: [15, 30, 45, 60, 90, 120], solo: true }
  };
  const MARGINI = [0, 5, 10, 15];
  // pezzo 7: con un locale già nel giorno all'ora di pranzo la pausa non serve (il pranzo è lì)
  const pranzoServe = Gx => daFare(Gx).length > 1 && Gx.partenza < 870 && Gx.fine > 750 && !tappe(Gx).some(v => T(v.id).categoria && !v.fatta && v.inizio < 870 && v.fine > 750);
  const pauseDi = (g, Gx) => S.pause[g] ?? (Gx && pranzoServe(Gx) ? [{ quale: 'pranzo', min: TIPI_PAUSA.pranzo.min, dopo: null }] : []);
  function postoPausa(quale, tp, fineA) {
    const candidati = tp.slice(0, -1);
    if (!candidati.length) return null;
    if (quale === 'pranzo') { const cibo = candidati.find(v => T(v.id).generi.includes('cibo') && fineA[v.id] >= 705 && fineA[v.id] <= 870); if (cibo) return cibo.id; }
    const o = TIPI_PAUSA[quale].ora;
    return candidati.reduce((a, b) => (Math.abs(fineA[b.id] - o) < Math.abs(fineA[a.id] - o) ? b : a)).id;
  }
  function conTempo(Gx, g) {
    if (!Gx) return null;
    const m = S.margine || 0, tp = daFare(Gx);
    let t = Gx.partenza;
    const fineA = {};
    for (const v of Gx.voci) { if (v.tipo === 'tratto') t += v.min + m; else if (!v.fatta) { t += v.fine - v.inizio; fineA[v.id] = t; } }
    const ultima = tp.slice(-1)[0]?.id;
    // pezzo 7 (Enrico, 14/10/2026): la pausa pranzo non si cancella quando scegli un locale; finché c'è un locale all'ora di
    // pranzo resta da parte, e se lo togli torna com'era (durata e posto). Il «Tempo libero» prima di una cena vale solo se
    // dopo quella tappa c'è ancora un locale.
    const tutte = tappe(Gx), conLocale = tutte.some(v => T(v.id).categoria && !v.fatta && v.inizio < 870 && v.fine > 750);
    const liberoServe = p => { const i = tutte.findIndex(v => v.id === p.dopo); return i >= 0 && !!T(tutte[i + 1]?.id ?? '')?.categoria; };
    const lista = pauseDi(g, Gx).filter(p => !(p.quale === 'pranzo' && conLocale) && !(p.quale === 'libero' && !liberoServe(p))).map(p => ({ ...p, dove: p.dopo && p.dopo !== ultima && fineA[p.dopo] != null ? p.dopo : postoPausa(p.quale, tp, fineA) })).filter(p => p.dove);
    t = Gx.partenza;
    const voci = [], fasi = [], pause = [];
    let mar = 0, pau = 0, vis = 0;
    for (const v of Gx.voci) {
      if (v.tipo === 'tappa' && v.fatta) { voci.push(v); continue; }
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
    return { ...Gx, inizio: Gx.partenza, voci, fine: t, pause, fasi, visite: vis, pauseMin: pau, margineMin: mar, totale: t - Gx.partenza, resta: Gx.fineScelta - t, avvisi };
  }
  const sequenza = Gx => Gx.voci.flatMap(v => (v.tipo === 'tappa' && !v.fatta ? [v, ...Gx.pause.filter(p => p.dove === v.id).map(p => ({ ...p, tipo: 'pausa' }))] : [v]));
  function cambiaPause(g, fn) {
    const lista = (S.pause[g] ?? pauseDi(g, grezzo(g))).map(p => ({ ...p }));
    fn(lista);
    aggiorna(() => { S.pause = { ...S.pause, [g]: lista }; });
  }

  // =====================================================================================
  // Pezzo 7 · Mangiare nella giornata (specifica §7). Se la giornata attraversa il pranzo (12:30–14:30) o la cena (19:30–21:30)
  // e non c'è già un locale a quell'ora, nel punto giusto compare «Qui puoi fermarti a mangiare»: i locali vicini a dove sarai
  // (minuti veri dalla tappa prima, tempi-tappe del sito), aperti a quell'ora (orari veri, orarioLocale del sito). Scegli tu:
  // «Mangia qui» mette il locale nel giorno al posto della pausa pranzo; «No, grazie» nasconde la proposta per quel giorno.
  // Pranzo: è la pausa pranzo del pezzo 1 (dopo la tappa dove si mangia o quella che finisce più vicino alle 13).
  // Cena: dopo l'ultima tappa (o quella che finisce più vicino alle 20), se il giorno arriva almeno alle 20:30 («Sera»).
  // Quattro proposte (PM): 1 la sosta (i più vicini nella riga), 2 il menù (un foglio come la carta di un ristorante),
  // 3 sulla mappa (cerchi di 5 e 10 minuti e i locali intorno), 4 lungo la strada (ordinati per i minuti in più verso la tappa dopo).
  // =====================================================================================
  const PM = 2; // Enrico, 14/10/2026: si tiene «Il menù»
  let VV = 1;   // lo stile di «visitata» nella riga: 1 com'è oggi, 2 si riempie, 3 il segnaposto
  const NOMI_VV = { 1: 'com\'è oggi', 2: 'la porta si riempie', 3: 'il segnaposto' };
  const PASTI = {
    pranzo: { nome: 'Pranzo', da: 750, a: 870, ora: 780, pasti: ['pranzo', 'spuntino'] },
    cena: { nome: 'Cena', da: 1170, a: 1290, ora: 1200, pasti: ['cena'] }
  };
  const NOMI_PM = { 1: 'La sosta', 2: 'Il menù', 3: 'Sulla mappa', 4: 'Lungo la strada' };
  const IDEA_M = {
    1: 'La pausa pranzo diventa «Qui puoi fermarti a mangiare»: nella riga stessa i tre locali aperti più vicini a dove sarai, con i minuti e il tipo. Un tocco apre la scheda con «Mangia qui»; «Tutti» apre l\'elenco con i filtri e, in fondo, i chiusi a quell\'ora.',
    2: 'Nella giornata una riga piccola, «Il menù del pranzo». Si apre un foglio come la carta di un ristorante: i locali per tipo (pizzerie, cucina napoletana, pesce…), i puntini fino ai minuti, fino a che ora sono aperti. In cima «Quanto cammini?»: 5, 10 o 20 minuti. Un tocco su un locale lo apre sul posto.',
    3: 'La riga ha una piccola mappa disegnata. Toccandola si apre la mappa intorno a dove sarai: due cerchi (5 e 10 minuti a piedi) e i locali, pieni se aperti e vuoti se chiusi. Un tocco su un locale e sotto compare la sua carta, con «Mangia qui».',
    4: 'I locali in fila come cartoline, ordinati per quanto allungano la strada verso la tappa dopo: «di passaggio» se costano al massimo 2 minuti, altrimenti «+6 min». Così il pranzo non ti porta fuori strada. Dopo l\'ultima tappa (la cena) contano i minuti da lì.'
  };
  const LOCALI = Object.keys(D.tappe).filter(id => T(id).categoria);
  const GIORNI_ORARI = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
  const uscitaDi = v => { const t = tappaC(v.id); return t.pf != null && t.pf >= 0 && !v.indietro ? t.pf : t.p; };
  // dove sei quando esci dalla tappa (nei percorsi a piedi, la fine): il centro dei cerchi della proposta 3
  const qui = m => { const v = tappe(G(m.g)).find(x => x.id === m.dove), t = tappaC(m.dove); return v && !v.indietro && t.xyFine ? t.xyFine : t.xy; };
  const chiaveM = m => `${m.g}-${m.q}`;
  // i momenti del pasto di un giorno: { g, q, dove (la tappa prima), ora (quando sei lì), min (quanto dura), dopo (la tappa dopo) }
  function momenti(g, Gx = G(g)) {
    if (!Gx) return [];
    const tp = daFare(Gx), out = [];
    if (!tp.length) return out;
    const dopoDi = id => { const i = tp.findIndex(v => v.id === id); return tp[i + 1]?.id ?? null; };
    const conLocale = q => tp.some(v => T(v.id).categoria && v.inizio < PASTI[q].a && v.fine > PASTI[q].da);
    const p = Gx.pause.find(x => x.quale === 'pranzo');
    if (p && !conLocale('pranzo')) out.push({ g, q: 'pranzo', dove: p.dove, ora: p.inizio, min: p.min, pausa: true, dopo: dopoDi(p.dove), nascosto: !!S.noGrazie[`${g}-pranzo`] });
    const Ce = PASTI.cena, ultima = tp[tp.length - 1];
    if (Gx.fineScelta >= Ce.a - 60 && Gx.inizio < Ce.a && !conLocale('cena') && !T(ultima.id).categoria) {
      const nascosto = !!S.noGrazie[`${g}-cena`];
      const fineU = ultima.fine + Gx.pause.filter(x => x.dove === ultima.id).reduce((s, x) => s + x.min, 0);
      if (fineU <= Ce.a) out.push({ g, q: 'cena', dove: ultima.id, ora: Math.max(fineU, Ce.da), min: 60, dopo: null, attesa: Math.max(0, Ce.da - fineU), nascosto });
      else {
        const v = tp.slice(0, -1).reduce((a, b) => (Math.abs(b.fine - Ce.ora) < Math.abs(a.fine - Ce.ora) ? b : a), tp[0]);
        if (v.fine >= Ce.da - 30 && v.fine <= Ce.a) out.push({ g, q: 'cena', dove: v.id, ora: v.fine, min: 60, dopo: dopoDi(v.id), nascosto });
      }
    }
    return out;
  }
  const trovaM = k => { const [g, q] = k.split('-'); return momenti(+g).find(m => m.q === q) ?? null; };
  // fino a che ora è aperto (la fascia che contiene t; senza data, la più corta tra i giorni con quella fascia)
  function finoA(L, g, t) {
    const giorni = S.data ? [L.orari?.[GIORNI_ORARI.indexOf(giornoSett(g))]] : L.orari ?? [];
    const fini = [];
    for (const f of giorni) if (f) for (let k = 0; k < f.length; k += 2) if (t >= f[k] && f[k + 1] !== -1 && t < f[k + 1]) fini.push(f[k + 1]);
    return fini.length ? Math.min(...fini) % 1440 : null;
  }
  // i locali per quel momento: minuti a piedi (o con i mezzi) dalla tappa prima, aperto o no all'arrivo, minuti in più verso la tappa dopo
  const memoV = new Map();
  function vicini(m) {
    const chiave = JSON.stringify([m, S.giorni[m.g], S.data, FINE]);
    if (memoV.has(chiave)) return memoV.get(chiave);
    const v = tappe(G(m.g)).find(x => x.id === m.dove), da = uscitaDi(v);
    const s0 = K.scenarioDi(S.data || undefined, m.ora), scen = CITTA.tempi.min[s0] ? s0 : 'feriale';
    const pDopo = m.dopo ? tappaC(m.dopo).p : null;
    const diretto = pDopo != null ? K.minuti(CITTA, scen, da, pDopo) : 0;
    const sett = S.data ? giornoSett(m.g) : null;
    const lista = LOCALI.filter(id => !nelViaggio(id) && T(id).pasto.some(p => PASTI[m.q].pasti.includes(p)) && !(m.q === 'pranzo' && T(id).cucina.includes('dolci') && !T(id).pasto.includes('pranzo'))).map(id => {
      const L = tappaC(id), min = K.minuti(CITTA, scen, da, L.p), arrivo = m.ora + min;
      let stato = 'aperto', nota = '';
      if (sett && L.chiuso.includes(sett)) { stato = 'chiuso'; nota = `chiuso di ${GS[sett]}`; }
      else {
        const o = K.orarioLocale(L, S.data || undefined, arrivo, L.durata);
        if (o?.chiude != null) { stato = 'stretto'; nota = `chiude alle ${ora(o.chiude % 1440)}`; }
        else if (o?.apre != null) { stato = 'chiuso'; nota = `apre alle ${ora(o.apre)}`; }
        else if (o) { stato = 'chiuso'; nota = 'a quell\'ora è chiuso'; }
      }
      const fino = stato === 'aperto' ? finoA(L, m.g, arrivo) : null;
      if (stato === 'aperto') nota = fino != null ? `aperto fino alle ${ora(fino)}` : 'aperto';
      const dev = pDopo != null ? Math.max(0, min + K.minuti(CITTA, scen, L.p, pDopo) - diretto) : min;
      return { id, min, arrivo, stato, nota, dev, mezzi: (CITTA.tempi.mezzi?.[scen]?.[da * CITTA.tempi.n + L.p] ?? '') !== '' };
    }).sort((a, b) => (a.stato === 'chiuso') - (b.stato === 'chiuso') || a.min - b.min || a.id.localeCompare(b.id));
    if (memoV.size > 200) memoV.clear();
    memoV.set(chiave, lista);
    return lista;
  }
  const aperti = (m, max = 10) => vicini(m).filter(x => x.stato !== 'chiuso' && x.min <= max);
  const tipoL = id => CUCINA_NOME[T(id).cucina?.[0]] ?? 'Locale';
  const euro = id => (T(id).fascia ? '€'.repeat(T(id).fascia) : '');
  const minTesto = x => (x.min < 2 ? 'accanto' : `${x.min} min${x.mezzi ? '' : ' a piedi'}`);
  const titoloM = m => (m.q === 'pranzo' ? 'A pranzo' : 'A cena');
  const quandoM = m => `${m.q === 'pranzo' ? 'Pranzo' : 'Cena'} dalle ${ora(m.ora)}, ${m.dopo || m.q === 'pranzo' ? 'dopo' : 'finito'} ${T(m.dove).breve}`;
  // quanti aperti a 10 minuti, oppure (nessuno vicino) il più vicino aperto
  function riassuntoM(m) {
    const n = aperti(m).length;
    if (n) return `${n === 1 ? 'un locale aperto' : `${n} locali aperti`} a 10 minuti da ${T(m.dove).breve}`;
    const p = vicini(m).find(x => x.stato !== 'chiuso');
    return p ? `qui vicino a quell'ora è tutto chiuso: il più vicino aperto è ${T(p.id).breve}, a ${p.min} minuti` : 'a quell\'ora non c\'è niente di aperto';
  }

  // scegliere: il locale entra nel giorno dopo la tappa prima, al posto della pausa pranzo; per la cena, se arrivi prima
  // delle 19:30, un «Tempo libero» fino all'apertura della cena. «Annulla» rimette tutto com'era.
  function mangiaQui(m, id) {
    const g = m.g, primaL = [...S.giorni[g]], primaP = S.pause[g];
    if (S.giorni[g].length >= MAX_TAPPE) { avvisa(`Al massimo ${MAX_TAPPE} tappe per giorno.`); return; }
    aggiorna(() => {
      const l = [...S.giorni[g]];
      l.splice(l.indexOf(m.dove) + 1, 0, id);
      S.giorni[g] = l; S.nuova = id;
      let pause = (primaP ?? pauseDi(g, grezzo(g, primaL))).filter(p => p.quale !== 'libero');
      if (m.q === 'cena') {
        const v = tappe(grezzo(g)).find(x => x.id === id), prima = pause.filter(p => l.indexOf(p.dove) < l.indexOf(id)).reduce((s, p) => s + p.min, 0);
        const arrivo = v.inizio + prima, attesa = PASTI.cena.da - arrivo;
        if (attesa >= 10) pause = [...pause, { quale: 'libero', min: Math.round(attesa / 5) * 5, dopo: m.dove }];
      }
      S.pause = { ...S.pause, [g]: pause };
    });
    const v = tappe(G(g)).find(x => x.id === id);
    avvisa(`${T(id).breve}: ${m.q} dalle ${ora(v.inizio)} alle ${ora(v.fine)}. Fine stimata ${ora(G(g).fine)}.`, { testo: 'Annulla', fai: () => aggiorna(() => { S.giorni[g] = primaL; const p = { ...S.pause }; if (primaP === undefined) delete p[g]; else p[g] = primaP; S.pause = p; }) });
  }
  function noGrazie(m) {
    const k = chiaveM(m);
    aggiorna(() => { S.noGrazie = { ...S.noGrazie, [k]: true }; });
    avvisa(m.q === 'pranzo' ? `Niente proposte per il pranzo del giorno ${m.g + 1}: resta la pausa.` : `Niente proposte per la cena del giorno ${m.g + 1}.`, { testo: 'Annulla', fai: () => aggiorna(() => { const x = { ...S.noGrazie }; delete x[k]; S.noGrazie = x; }) });
  }
  // la sequenza del giorno con il pasto: la pausa pranzo diventa la riga del pasto; la cena va dopo la sua tappa (e le sue pause)
  function sequenzaM(Gx, g) {
    const voci = sequenza(Gx), ms = momenti(g, Gx);
    for (const m of ms) {
      if (m.pausa) { const i = voci.findIndex(v => v.tipo === 'pausa' && v.quale === 'pranzo'); if (i >= 0) { if (m.nascosto) voci.splice(i + 1, 0, { tipo: 'pasto', m }); else voci[i] = { tipo: 'pasto', m }; } continue; }
      let i = voci.findIndex(v => v.tipo === 'tappa' && v.id === m.dove);
      while (voci[i + 1]?.tipo === 'pausa') i++;
      voci.splice(i + 1, 0, { tipo: 'pasto', m });
    }
    return voci;
  }

  // ---------- le righe del pasto nelle quattro proposte (vista c o d) ----------
  const datiM = m => `data-k="${chiaveM(m)}"`;
  const bottoneNo = (m, cl) => `<button type="button" class="${cl}" data-azione="pasto-no" ${datiM(m)}>No, grazie</button>`;
  const pausaInfo = (m, cl) => (m.pausa ? `<button type="button" class="${cl}" data-azione="pausa" data-quale="pranzo">Pausa di ${durataLunga(m.min)}: cambia</button>` : '');
  function rigaPasto(m, vista) {
    const tag = vista === 'c' ? 'li' : 'div', base = `${vista}-pasto pasto-${PM}`, chiave = `data-chiave="pasto-${m.q}"`;
    if (m.nascosto) return `<${tag} class="${vista}-pasto pasto-nascosto" ${chiave}><p class="pm-rimetti">${ic('posate', 16)}<span>${m.q === 'pranzo' ? 'Niente proposte per il pranzo' : 'Niente proposte per la cena'}</span><button type="button" class="pm-link" data-azione="pasto-si" ${datiM(m)}>Rimettile</button></p></${tag}>`;
    const lista = vicini(m), ap = aperti(m), oraT = `<span class="num">${ora(m.ora)}</span>`;
    const icona = `<span class="pm-ic" aria-hidden="true">${ic('posate', vista === 'c' ? 17 : 22)}</span>`;
    if (PM === 1) {
      const primi = (ap.length ? ap : lista.filter(x => x.stato !== 'chiuso')).slice(0, 3);
      return `<${tag} class="${base}" ${chiave}><div class="pm1">
        <p class="pm1__testa">${icona}<span><span class="pm-ora">${oraT}${m.pausa ? ` – <span class="num">${ora(m.ora + m.min)}</span>` : ''}</span><b class="pm1__tit">Qui puoi fermarti a mangiare</b><small>${esc(riassuntoM(m))}</small></span></p>
        <ul class="pm1__scelte" aria-label="${titoloM(m)}: i più vicini aperti">${primi.map(x => `<li><button type="button" class="pm1__l" data-azione="pasto-scheda" data-id="${x.id}" ${datiM(m)}><b>${esc(T(x.id).breve)}</b><small>${minTesto(x)} · ${esc(tipoL(x.id))}${euro(x.id) ? ` · ${euro(x.id)}` : ''}</small></button></li>`).join('')}
          <li><button type="button" class="pm1__tutti" data-azione="pasto-apri" ${datiM(m)}>${ic('elenco', 18)}<span>Tutti e ${lista.filter(x => x.stato !== 'chiuso').length}</span></button></li></ul>
        <p class="pm-piede">${pausaInfo(m, 'pm-link')}${bottoneNo(m, 'pm-link pm-link--no')}</p></div></${tag}>`;
    }
    if (PM === 2) {
      const tipi = [...new Set(ap.map(x => tipoL(x.id)))];
      return `<${tag} class="${base}" ${chiave}><button type="button" class="pm2" data-azione="pasto-apri" ${datiM(m)}>
        <span class="pm2__carta" aria-hidden="true"><i>${m.q === 'pranzo' ? 'Pranzo' : 'Cena'}</i></span>
        <span class="pm2__t"><span class="pm-ora">${oraT}${m.pausa ? ` – <span class="num">${ora(m.ora + m.min)}</span>` : ''}</span><b>Il menù ${m.q === 'pranzo' ? 'del pranzo' : 'della cena'}</b><small>${ap.length ? `${ap.length} aperti intorno a ${esc(T(m.dove).breve)}${tipi.length ? `: ${tipi.slice(0, 3).map(x => x.toLowerCase()).join(', ')}` : ''}` : esc(riassuntoM(m))}. Dentro anche tutti gli altri, con i minuti.</small></span>
        <span class="pm2__apri">Apri${ic('avanti', 16)}</span></button>
        <p class="pm-piede">${pausaInfo(m, 'pm-link')}${bottoneNo(m, 'pm-link pm-link--no')}</p></${tag}>`;
    }
    if (PM === 3) {
      return `<${tag} class="${base}" ${chiave}><div class="pm3">
        <button type="button" class="pm3__mappa" data-azione="pasto-apri" ${datiM(m)} aria-label="${titoloM(m)} dalle ${ora(m.ora)}: guarda sulla mappa i locali aperti intorno a ${esc(T(m.dove).breve)}">${miniMappa(m)}</button>
        <div class="pm3__t"><span class="pm-ora">${oraT}${m.pausa ? ` – <span class="num">${ora(m.ora + m.min)}</span>` : ''}</span><b>${titoloM(m)}, qui intorno</b><small>${esc(riassuntoM(m))}</small>
          <button type="button" class="pm3__vai" data-azione="pasto-apri" ${datiM(m)} tabindex="-1" aria-hidden="true">${ic('mappa', 18)}Guarda sulla mappa</button></div>
        <p class="pm-piede">${pausaInfo(m, 'pm-link')}${bottoneNo(m, 'pm-link pm-link--no')}</p></div></${tag}>`;
    }
    // 4: lungo la strada verso la tappa dopo (o, dopo l'ultima, i più vicini)
    const strada = vicini(m).filter(x => x.stato !== 'chiuso').sort((a, b) => a.dev - b.dev || a.min - b.min).slice(0, 6);
    const verso = m.dopo ? `sulla strada per ${esc(T(m.dopo).breve)}` : `vicino a ${esc(T(m.dove).breve)}`;
    return `<${tag} class="${base}" ${chiave}><div class="pm4">
      <p class="pm4__testa">${icona}<span><span class="pm-ora">${oraT}${m.pausa ? ` – <span class="num">${ora(m.ora + m.min)}</span>` : ''}</span><b>${titoloM(m)}, ${verso}</b></span></p>
      <div class="pm4__filo"><ul class="pm4__carte" aria-label="Locali aperti ${m.dopo ? `sulla strada per ${esc(T(m.dopo).breve)}` : `vicino a ${esc(T(m.dove).breve)}`}, dal meno lontano">${strada.map((x, k) => `<li style="--k:${k}"><button type="button" class="pm4__c" data-azione="pasto-scheda" data-id="${x.id}" ${datiM(m)}>
        <span class="pm4__dev${m.dopo && x.dev <= 2 ? ' pm4__dev--si' : ''}">${m.dopo ? (x.dev <= 2 ? 'di passaggio' : `+${x.dev} min`) : `${x.min} min`}</span><b>${esc(T(x.id).breve)}</b><small>${esc(tipoL(x.id))}${euro(x.id) ? ` · ${euro(x.id)}` : ''}</small><small class="pm4__fino">${esc(x.nota)}</small></button></li>`).join('')}
        <li><button type="button" class="pm4__c pm4__c--tutti" data-azione="pasto-apri" ${datiM(m)}>${ic('elenco', 20)}<b>Tutti</b><small>${m.dopo ? 'dal meno lontano' : 'dal più vicino'}</small></button></li></ul></div>
      <p class="pm-piede">${pausaInfo(m, 'pm-link')}${bottoneNo(m, 'pm-link pm-link--no')}</p></div></${tag}>`;
  }
  // proposta 3: una piccola mappa disegnata (le strade della mappa nostra intorno alla tappa, i locali come puntini)
  function miniMappa(m) {
    const c = qui(m), r = 150, vb = `${(c[0] - r).toFixed(0)} ${(c[1] - r * .6).toFixed(0)} ${2 * r} ${(1.2 * r).toFixed(0)}`;
    const punti = vicini(m).filter(x => Math.abs(T(x.id).xy[0] - c[0]) < r && Math.abs(T(x.id).xy[1] - c[1]) < r * .6);
    return `<svg class="pm3__svg" viewBox="${vb}" aria-hidden="true" focusable="false"><path class="mm-s1" d="${M.strade[1]}"/><path class="mm-s2" d="${M.strade[2]}"/><path class="mm-s0" d="${M.strade[0]}"/>
      <circle class="mm-giro" cx="${c[0]}" cy="${c[1]}" r="140"/><circle class="mm-giro mm-giro--5" cx="${c[0]}" cy="${c[1]}" r="70"/>
      ${punti.map(x => `<circle class="mm-l${x.stato === 'chiuso' ? ' mm-l--chiuso' : ''}" cx="${T(x.id).xy[0]}" cy="${T(x.id).xy[1]}" r="9"/>`).join('')}<circle class="mm-qui" cx="${c[0]}" cy="${c[1]}" r="13"/></svg>`;
  }

  // ---------- i fogli: l'elenco (1 e 4), il menù (2), la mappa (3); la scheda del locale con «Mangia qui» ----------
  const FILTRI_M = [['tutti', 'Tutti'], ['5', 'Fino a 5 min'], ['pizza', 'Pizza'], ['napoletana', 'Napoletana'], ['pesce', 'Pesce'], ['strada', 'Di strada']];
  const filtra = (l, f) => l.filter(x => f === 'tutti' || (f === '5' ? x.min <= 5 : T(x.id).cucina.includes(f)));
  function rigaElenco(x, m, perStrada = false) {
    const mezzi = x.mezzi ? ' con i mezzi' : '';
    return `<li class="pl${x.stato === 'chiuso' ? ' pl--chiuso' : ''}"><button type="button" class="pl__apri" data-f="scheda" data-v="${x.id}"><span class="pl__min num">${perStrada && m.dopo ? (x.dev <= 2 ? '+0' : `+${x.dev}`) : x.min < 2 ? '1' : x.min}<small>min${perStrada && m.dopo ? ' in più' : ''}</small></span>
      <span class="pl__t"><b>${esc(T(x.id).nome)}</b><small>${esc(tipoL(x.id))}${euro(x.id) ? ` · ${euro(x.id)}` : ''}${mezzi} · <span class="pl__stato pl__stato--${x.stato}">${esc(x.nota)}</span></small></span></button>
      ${x.stato === 'chiuso' ? '' : `<button type="button" class="pl__si" data-f="scegli" data-v="${x.id}" aria-label="Mangia qui: ${esc(T(x.id).breve)}">${ic('piu', 20)}</button>`}</li>`;
  }
  function apriElenco(m, filtro = 'tutti') {
    const perStrada = PM === 4;
    let f0 = filtro;
    const corpo = () => {
      const tutti = vicini(m), ord = perStrada ? [...tutti].sort((a, b) => (a.stato === 'chiuso') - (b.stato === 'chiuso') || a.dev - b.dev || a.min - b.min) : tutti;
      const l = filtra(ord, f0), si = l.filter(x => x.stato !== 'chiuso'), no = l.filter(x => x.stato === 'chiuso');
      ordineLocali = [...si, ...no].map(x => x.id);
      const conta = f => filtra(tutti, f).filter(x => x.stato !== 'chiuso').length;
      return `<p class="pl-quando">${ic('posate', 18)}<span>${esc(quandoM(m))}. ${perStrada && m.dopo ? `In cima quelli che allungano meno la strada per ${esc(T(m.dopo).breve)}.` : 'Minuti dalla tappa prima.'}</span></p>
        <div class="f-chips pl-filtri" role="group" aria-label="Filtri">${FILTRI_M.map(([k, n]) => `<button type="button" class="f-chip" data-f="filtro" data-v="${k}" aria-pressed="${k === f0}"${conta(k) || k === f0 ? '' : ' disabled'}>${n} <span class="num">${conta(k)}</span></button>`).join('')}</div>
        ${si.length ? `<ul class="pl-lista">${si.map(x => rigaElenco(x, m, perStrada)).join('')}</ul>` : `<p class="pl-vuoto">Con questo filtro a quell'ora non c'è niente di aperto. <button type="button" class="pm-link" data-f="filtro" data-v="tutti">Togli il filtro</button></p>`}
        ${no.length ? `<details class="pl-chiusi"><summary>Chiusi a quell'ora (${no.length})</summary><ul class="pl-lista">${no.map(x => rigaElenco(x, m, perStrada)).join('')}</ul></details>` : ''}
        <p class="f-nota">Gli orari sono quelli scritti dai locali${S.data ? `, per ${dataLunga(m.g)}` : '; senza data valgono per i giorni in cui sono aperti'}. Niente si aggiunge da solo: scegli tu.</p>`;
    };
    foglio(m.q === 'pranzo' ? 'Dove pranzare' : 'Dove cenare', `<div id="f-vivo">${corpo()}</div>`, f => { f.onclick = e => clickFoglioM(e, f, m, k => { f0 = k; rinfresca(f, corpo(), { dataset: { f: 'filtro', v: k } }); }, () => apriElenco(m, f0)); }, 'f--pasto');
  }
  // 2 · il menù: per tipo di locale, con i puntini fino ai minuti; quanto vuoi camminare in cima
  function apriMenu(m, max = aperti(m).length ? 10 : 0) {
    let mx = max;
    const corpo = () => {
      const entro = x => !mx || x.min <= mx, tutti = vicini(m), si = tutti.filter(x => x.stato !== 'chiuso' && entro(x)), no = tutti.filter(x => x.stato === 'chiuso' && entro(x));
      const gruppi = [...new Set(si.map(x => tipoL(x.id)))].map(t => [t, si.filter(x => tipoL(x.id) === t)]);
      ordineLocali = [...gruppi.flatMap(([, l]) => l), ...no].map(x => x.id);
      const voce = x => `<li class="mn-v${x.stato === 'chiuso' ? ' mn-v--chiuso' : ''}"><details><summary><span class="mn-nome">${esc(T(x.id).nome)}</span><span class="mn-punti" aria-hidden="true"></span><span class="mn-min num">${x.min < 2 ? 'accanto' : `${x.min} min`}</span><small class="mn-sotto">${esc(x.nota)}${euro(x.id) ? ` · ${euro(x.id)}` : ''}${x.mezzi ? ' · con i mezzi' : ''}</small></summary>
        <div class="mn-dentro"><p>${esc(T(x.id).frase || '')}</p><div class="mn-az">${x.stato === 'chiuso' ? '' : `<button type="button" class="f-bottone" data-f="scegli" data-v="${x.id}">${ic('posate', 18)}Mangia qui, dalle ${ora(x.arrivo)}</button>`}<button type="button" class="f-bottone f-bottone--contorno" data-f="scheda" data-v="${x.id}">La scheda</button></div></div></details></li>`;
      return `<div class="mn"><p class="mn-testa"><i>${m.q === 'pranzo' ? 'Pranzo' : 'Cena'}</i><span>dalle <span class="num">${ora(m.ora)}</span>, intorno a ${esc(T(m.dove).breve)}</span></p>
        <div class="mn-quanto" role="group" aria-label="Quanto vuoi camminare"><span>A piedi:</span>${[5, 10, 20, 0].map(k => `<button type="button" data-f="quanto" data-v="${k}" aria-pressed="${k === mx}">${k ? `${k} min` : 'Tutti'}</button>`).join('')}</div>
        ${gruppi.length ? gruppi.map(([t, l]) => `<section class="mn-gruppo"><h3>${esc(t)}</h3><ul>${l.map(voce).join('')}</ul></section>`).join('') : `<div class="mn-vuoto"><p>A ${mx} minuti, a quell'ora, è tutto chiuso. ${(() => { const p = tutti.find(x => x.stato !== 'chiuso'); return p ? `Il più vicino aperto è ${esc(T(p.id).breve)}, a ${p.min} minuti.` : ''; })()}</p><button type="button" class="f-bottone" data-f="quanto" data-v="0">Vedi tutti i locali, con i minuti</button></div>`}
        ${no.length ? `<section class="mn-gruppo mn-gruppo--chiusi"><h3>Chiusi a quell'ora</h3><ul>${no.map(voce).join('')}</ul></section>` : ''}
        <p class="mn-piede">Orari scritti dai locali${S.data ? `, ${dataLunga(m.g)}` : ''}. Scegli tu: niente si aggiunge da solo.</p></div>`;
    };
    foglio(m.q === 'pranzo' ? 'Il menù del pranzo' : 'Il menù della cena', `<div id="f-vivo">${corpo()}</div>`, f => { f.onclick = e => clickFoglioM(e, f, m, null, () => apriMenu(m, mx), k => { mx = k; rinfresca(f, corpo(), { dataset: { f: 'quanto', v: String(k) } }); }); }, 'f--pasto f--menu');
  }
  // 3 · la mappa: i cerchi di 5 e 10 minuti intorno a dove sarai, i locali (pieni se aperti); toccandone uno, la sua carta sotto
  function apriMappaPasto(m, scelto = null) {
    const corpo = `<p class="pl-quando">${ic('posate', 18)}<span>${esc(quandoM(m))}</span></p><div class="pm3-mappa"><div id="mappa-pasto"></div><div class="pm3-carta" id="pm3-carta" aria-live="polite"></div></div>
      <button type="button" class="f-bottone f-bottone--contorno pm3-elenco" data-f="elenco">${ic('elenco', 18)}Vedi come elenco</button>`;
    foglio(m.q === 'pranzo' ? 'Dove pranzare, sulla mappa' : 'Dove cenare, sulla mappa', corpo, f => {
      mappaF = new Mappa($('#mappa-pasto', f), opzMappa({ tocca: () => {}, margini: () => ({ t: 30, r: 30, b: 150, l: 30 }) }));
      mappaF.disegna(G(m.g), { n: m.g + 1, disegna: false });
      mappaF.cibo(m, vicini(m), id => carta(id));
      const carta = id => {
        const x = vicini(m).find(y => y.id === id), c = $('#pm3-carta', f);
        mappaF.evidenzia(id);
        c.innerHTML = x ? `<p class="pm3-carta__t"><b>${esc(T(id).nome)}</b><small>${esc(tipoL(id))}${euro(id) ? ` · ${euro(id)}` : ''} · ${minTesto(x)} · <span class="pl__stato pl__stato--${x.stato}">${esc(x.nota)}</span></small></p>
          <div class="pm3-carta__az">${x.stato === 'chiuso' ? '' : `<button type="button" class="f-bottone" data-f="scegli" data-v="${id}">${ic('posate', 18)}Mangia qui</button>`}<button type="button" class="f-bottone f-bottone--contorno" data-f="scheda" data-v="${id}">Scheda</button></div>`
          : `<p class="pm3-carta__t"><b>${esc(riassuntoM(m).replace(/^./, s => s.toUpperCase()))}</b><small>Tocca un locale sulla mappa. Pieni gli aperti, vuoti i chiusi; i cerchi sono 5 e 10 minuti a piedi in linea d'aria.</small></p>`;
      };
      carta(scelto);
      ordineLocali = vicini(m).filter(x => x.min <= 15).map(x => x.id);
      f.onclick = e => clickFoglioM(e, f, m, null, () => apriMappaPasto(m, scelto));
    }, 'f--pasto f--mappa-pasto');
  }
  // la scheda del locale, dal pasto: la scheda vera e «Mangia qui» con l'ora. In fondo «prima» e «dopo» con il nome del locale,
  // nell'ordine dell'elenco da cui l'hai aperta (nel menù: per tipo); col dito si gira di lato, come le schede delle tappe.
  let ordineLocali = [];
  // la pagina di un locale (dentro il foglio): si costruisce da sola, così si può preparare mentre la pagina prima esce
  function paginaPasto(id, m, indietro, lista) {
    const x = vicini(m).find(y => y.id === id), i = lista.indexOf(id), prima = lista[i - 1], dopo = lista[i + 1];
    const vai = (v, dir) => (v ? `<button type="button" class="pl-sf pl-sf--${dir < 0 ? 'prima' : 'dopo'}" data-f="sfoglia" data-v="${v}" data-dir="${dir}">${ic(dir < 0 ? 'indietro' : 'avanti', 20)}<span><small>${dir < 0 ? 'Prima' : 'Dopo'}</small><b>${esc(T(v).breve)}</b></span></button>` : '<span></span>');
    const sfoglia = lista.length > 1 ? `<nav class="pl-sfoglia" aria-label="Altri locali">${vai(prima, -1)}<span class="pl-sf__n num">${i + 1} di ${lista.length}</span>${vai(dopo, 1)}</nav>` : '';
    return `${indietro ? `<button type="button" class="r-indietro" data-f="indietro">${ic('indietro', 18)}Torna ai locali</button>` : ''}
      <p class="sch-quando">${esc(tipoL(id))}${euro(id) ? ` · ${euro(id)}` : ''} · ${x ? `${minTesto(x)} da ${esc(T(m.dove).breve)}` : ''}</p>
      ${x ? `<p class="pl-stato-grande pl__stato--${x.stato}">${ic(x.stato === 'chiuso' ? 'attenzione' : 'orologio', 18)}<span>Arrivi alle ${ora(x.arrivo)}: ${esc(x.nota)}</span></p>` : ''}
      ${x && x.stato !== 'chiuso' ? `<button type="button" class="f-bottone pl-scegli" data-f="scegli" data-v="${id}">${ic('posate', 20)}Mangia qui, ${m.q === 'pranzo' ? 'a pranzo' : 'a cena'} dalle ${ora(x.arrivo)}</button>` : ''}
      <div class="sch-testo">${testoScheda(id)}</div>${sezioni(id)}${fontiScheda(id)}${sfoglia}`;
  }
  function schedaPasto(id, m, indietro) {
    const lista = ordineLocali.includes(id) ? [...ordineLocali] : vicini(m).map(y => y.id);
    let cur = id;
    foglio(T(id).nome, `<div class="pl-pagina">${paginaPasto(id, m, indietro, lista)}</div>`, f => {
      f.onclick = e => clickFoglioM(e, f, m, null, indietro);
      f.puoi = dir => !!lista[lista.indexOf(cur) + dir];
      // girare pagina: la pagina dopo si prepara e si impagina mentre questa esce (come i giorni e le tappe)
      f.sfoglia = (dir, daX = 0) => {
        const v = lista[lista.indexOf(cur) + dir];
        if (!v || occupato) return !!v;
        cur = v;
        scorri($('.pl-pagina', f), dir, daX, pre => {
          if (pre !== true) $('.pl-pagina', f).innerHTML = pre ?? paginaPasto(v, m, indietro, lista);
          $('#f-titolo', f).textContent = T(v).nome;
          f.scrollTop = 0;
          annuncia(`${T(v).nome}, ${lista.indexOf(v) + 1} di ${lista.length}`);
        }, () => $('.pl-pagina', f), () => {}, () => paginaPasto(v, m, indietro, lista));
        return true;
      };
    }, 'f--scheda f--fuori f--pasto');
  }
  async function clickFoglioM(e, f, m, filtro, torna, quanto) {
    if (e.target === f) { chiudiFoglio(); return; }
    const b = e.target.closest('[data-f]');
    if (!b) return;
    const k = b.dataset.f, v = b.dataset.v;
    if (k === 'filtro' && filtro) filtro(v);
    else if (k === 'quanto' && quanto) quanto(+v);
    else if (k === 'scheda') schedaPasto(v, m, torna);
    else if (k === 'sfoglia') { const dir = +b.dataset.dir; f.sfoglia?.(dir); requestAnimationFrame(() => $(`.pl-sf--${dir < 0 ? 'prima' : 'dopo'}`, f)?.focus({ preventScroll: true })); }
    else if (k === 'indietro') torna?.();
    else if (k === 'elenco') apriElenco(m);
    else if (k === 'scegli') { await chiudiFoglio(); mangiaQui(m, v); }
  }
  function apriPasto(m) {
    if (PM === 2) apriMenu(m);
    else if (PM === 3) apriMappaPasto(m);
    else apriElenco(m);
  }

  // ---------- i numeri del giorno e il tempo del giorno; quando cambiano scorrono dal valore di prima al nuovo ----------
  const cifre = (Gx, cl = 'cifre', suf = '') => `<dl class="${cl}"><div><dt>tappe</dt><dd class="num" data-cifra="tappe${suf}" data-n="${tappe(Gx).length}">${tappe(Gx).length}</dd></div><div><dt>minuti ${aPiedi(Gx) ? 'a piedi' : 'di strada'}</dt><dd class="num" data-cifra="piedi${suf}" data-n="${Gx.spostamenti}">${Gx.spostamenti}</dd></div><div><dt>chilometri</dt><dd class="num" data-cifra="km${suf}" data-n="${Gx.metri}">${km(Gx.metri)}</dd></div><div><dt>fine stimata</dt><dd class="num" data-cifra="fine${suf}" data-n="${Gx.fine}">${ora(Gx.fine)}</dd></div></dl>`;
  const nessuno = (m, parola = 'nessuno') => (Math.round(m) ? durata(Math.round(m)) : parola);
  const FORMA_CIFRA = { tappe: n => String(Math.round(n)), piedi: n => String(Math.round(n)), km: n => km(n), fine: n => ora(Math.round(n)), visite: n => durata(Math.round(n)), cammino: n => durata(Math.round(n)), pause: n => nessuno(n, 'nessuna'), margine: n => nessuno(n), totale: n => durata(Math.round(n)), resta: n => durata(Math.abs(Math.round(n))), fatte: n => String(Math.round(n)) };
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
      <div class="tempo__ore" aria-hidden="true"><span class="num">${ora(Gx.inizio)}${Gx.vivo ? ' (adesso)' : ''}</span>${Gx.fine > Gx.fineScelta ? `<span class="num tempo__ora-fine tempo__ora-fine--oltre">fine ${ora(Gx.fine)}</span>` : `<span class="num tempo__ora-fine">${ora(Gx.fineScelta)}</span>`}</div>
      <dl class="tempo__voci">${voce('visita', Gx.visite, durata(Gx.visite))}${voce('cammino', Gx.spostamenti, durata(Gx.spostamenti))}${voce('pausa', Gx.pauseMin, nessuno(Gx.pauseMin, 'nessuna'))}${voce('margine', Gx.margineMin, nessuno(Gx.margineMin))}</dl>
    </div>`;
  }

  // =====================================================================================
  // La mappa (pezzo 1, giro 5): OpenStreetMap con vicoli, pedonali e scale; si sposta e si ingrandisce; il percorso si disegna
  // in fila. Pezzo 2: le tappe visitate hanno la spunta; nella proposta 4 la strada fatta è piena, quella da fare più chiara.
  // =====================================================================================
  let nMappe = 0;
  const VELOCITA = 0.327;
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
  function inFila(Gx) {
    const voci = Gx.voci;
    let qui = daFare(Gx)[0]?.xy ?? tappe(Gx)[0]?.xy ?? [0, 0];
    return Gx.linee.map(l => {
      let p = puntiDi(l.d);
      if (dist(qui, p[p.length - 1]) < dist(qui, p[0])) p = p.reverse();
      qui = p[p.length - 1];
      return { ...l, d: 'M' + p.map(x => x.join(' ')).join('L'), v: l.v ?? 0, tappaDopo: voci.findIndex((x, k) => k > (l.v ?? 0) && x.tipo === 'tappa') };
    });
  }
  const puntiPer = Gx => Object.keys(D.tappe).filter(id => daVedere(id) && T(id).xy && !(Gx && tappe(Gx).some(v => v.id === id)));
  // Pezzo 6 (prova, mappa-giro-1/pezzi.mjs): le strade di tutta la città a pezzi da 1,28 km, caricati solo dove guardi.
  // MODO 1 = «Prima» (solo la zona dei due giorni, strade.json); MODO 2 = «A pezzi».
  let MODO = 2, mostraBordi = false;
  const PZ = window.PEZZI; // { lato, nx, ny, pezzi: [chiave], pesi: { chiave: byte compressi }, principali: [[nome, lunghezza, d]] }
  const ESISTE = new Set(PZ.pezzi), CARICATI = new Map();
  const SOGLIA_PEZZI = 0.45; // px per unità (1 unità = 5 m): da qui in su si caricano i pezzi
  const STRATI_P = [['v', 'm-vicoli'], ['p', 'm-pedonali'], ['m', 'm-medie-c'], ['g', 'm-grandi-c'], ['m', 'm-medie'], ['g', 'm-grandi'], ['s', 'm-scale']];
  // i path dei pezzi sono «Mx yl dx dy…» con numeri corti (.5, -.5)
  const puntiRel = d => { const [a, b = ''] = d.slice(1).split('l'), n = s => (s.match(/-?(?:\d+\.?\d*|\.\d+)/g) || []).map(Number), r = n(b), p = [n(a)]; for (let i = 0; i + 1 < r.length; i += 2) { const q = p[p.length - 1]; p.push([q[0] + r[i], q[1] + r[i + 1]]); } return p; };
  const prendi = k => { if (!CARICATI.has(k)) CARICATI.set(k, fetch(`pezzi-256/${k}.json`).then(r => r.json()).catch(() => { CARICATI.delete(k); return null; })); return CARICATI.get(k); };
  const distSeg = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy, t = l ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)) : 0; return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
  class Mappa {
    constructor(el, opz = {}) {
      this.el = el; this.opz = opz; this.tappe = []; this.vb = null; this.fuoco = null; this.n = ++nMappe; this.dita = new Map(); this.tutte = false; this.idsPunti = [];
      el.classList.add('m');
      const nomi = (MODO === 2 ? PZ.principali.map(([nome, L, d]) => ({ nome, L, d })) : ST.etichette).map((e, i) => `<path id="m${this.n}n${i}" d="${e.d}"/><text class="m-nome" data-l="${e.L}" data-c="${e.nome.length}" data-nome="${esc(e.nome)}"><textPath href="#m${this.n}n${i}" startOffset="50%" text-anchor="middle">${esc(e.nome)}</textPath></text>`).join('');
      const tasto = opz.tutte ? `<button type="button" data-z="tutte" aria-pressed="false" aria-label="Mostra tutte le tappe della città">${ic('spilli', 20)}</button>` : '';
      el.innerHTML = `<svg class="m-svg" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <rect class="m-terra" x="-6000" y="-6000" width="16000" height="16000"/><path class="m-mare" d="${M.mare}"/><path class="m-isole" d="${M.isole}"/><path class="m-parco" d="${M.parchi}"/>
        <path class="m-s0" d="${M.strade[0]}"/><path class="m-s1c" d="${M.strade[1]}"/><path class="m-s2c" d="${M.strade[2]}"/><path class="m-s1" d="${M.strade[1]}"/><path class="m-s2" d="${M.strade[2]}"/><path class="m-moli" d="${M.moli}"/>
        <g class="m-fine">${MODO === 2 ? STRATI_P.map(([, c]) => `<g class="${c}"></g>`).join('') : `<path class="m-vicoli" d="${ST.vicoli}"/><path class="m-pedonali" d="${ST.pedonali}"/><path class="m-medie-c" d="${ST.medie}"/><path class="m-grandi-c" d="${ST.grandi}"/><path class="m-medie" d="${ST.medie}"/><path class="m-grandi" d="${ST.grandi}"/><path class="m-scale" d="${ST.scale}"/>`}</g><g class="m-bordi"></g>
        <g class="m-nomi">${nomi}</g>
        <g class="m-cerchi"></g><g class="m-altre"></g><g class="m-rotta"></g><g class="m-nomi-rotta"></g><g class="m-fili"></g></svg><p class="m-pezzi" aria-hidden="true"></p><div class="m-punti"></div><div class="m-cibi"></div><div class="m-segni"></div>
        <div class="m-ctrl">${tasto}<button type="button" data-z="piu" aria-label="Ingrandisci la mappa">${ic('piu', 20)}</button><button type="button" data-z="meno" aria-label="Rimpicciolisci la mappa">${ic('meno', 20)}</button><button type="button" data-z="tutto" aria-label="Mostra tutto il giorno">${ic('centra', 20)}</button></div>
        <p class="m-osm">© OpenStreetMap</p>`;
      this.svg = $('svg', el);
      this.nomi = $$('.m-nome', el);
      this.messi = new Set(); this.nomiPezzi = []; this.peso = 0; this.inRotta = new Set();
      (window.PROVA_MAPPE ??= []).push(this); // solo per le immagini della prova (prove/foto.cjs)
      this.ro = new ResizeObserver(() => { if (this.box && !this.mosso) this.adatta(false); else if (this.vb) this.metti(this.limita(this.vb)); });
      this.ro.observe(el);
      $('.m-ctrl', el).addEventListener('click', e => {
        const b = e.target.closest('[data-z]');
        if (!b) return;
        if (b.dataset.z === 'tutte') this.mostraTutte(!this.tutte);
        else if (b.dataset.z === 'tutto') this.tutto();
        else this.zoom(b.dataset.z === 'piu' ? 1.6 : 1 / 1.6);
      });
      el.addEventListener('pointerdown', e => this.giu(e));
      el.addEventListener('pointermove', e => this.muovi(e));
      el.addEventListener('pointerup', e => this.su(e));
      el.addEventListener('pointercancel', e => this.su(e));
      el.addEventListener('wheel', e => { e.preventDefault(); const r = el.getBoundingClientRect(); this.zoom(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top, false); }, { passive: false });
      el.addEventListener('dblclick', e => { if (e.target.closest('.m-segno, .m-punto, .m-ctrl')) return; const r = el.getBoundingClientRect(); this.zoom(1.8, e.clientX - r.left, e.clientY - r.top); });
    }
    giu(e) {
      if (e.target.closest('.m-ctrl') || (e.pointerType === 'mouse' && e.button !== 0)) return;
      this.dita.set(e.pointerId, [e.clientX, e.clientY]);
      this.preso = false;
      this.partenza = { vb: { ...this.vb }, dita: new Map(this.dita) };
      cancelAnimationFrame(this.raf); this.fermaVolo?.();
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
      if (MODO === 2) this.nomiRotta();
      this.daLinea = disegna && piano() ? (daLinea ?? 0) : Infinity;
      this.voci = Gx ? Gx.voci : [];
      $('.m-rotta', this.svg).innerHTML = this.linee.map((l, i) => { const nu = i >= this.daLinea ? ' m-nuova' : ''; return `<path class="m-c${nu}" d="${l.d}"/><path class="m-l${nu}" d="${l.d}"/>`; }).join('');
      this.tappe = Gx ? tappe(Gx) : [];
      this.box = riquadroDi(Gx ? [Gx] : altre.map(a => a.G));
      this.fuoco = null;
      this.el.setAttribute('role', 'group');
      this.el.setAttribute('aria-label', Gx ? `Mappa del giorno ${n ?? S.g + 1}: ${this.tappe.length} tappe collegate nell'ordine. Si sposta con il dito e si ingrandisce con due dita.` : 'Mappa: il giorno è vuoto');
      const primaNascosta = this.daLinea === Infinity ? Infinity : this.daLinea === 0 ? 1 : this.tappe.length - 1;
      $('.m-segni', this.el).innerHTML = this.tappe.map((v, i) => `<button type="button" class="m-segno${i >= primaNascosta ? ' m-attesa' : ''}${visitata(v.id) ? ' m-segno--v' : ''}" data-id="${v.id}" aria-label="${v.n}. ${esc(T(v.id).nome)}${visitata(v.id) ? ', visitata' : v.fatta ? '' : `, alle ${ora(v.inizio)}`}"><span>${v.n}</span><i class="m-segno__v" aria-hidden="true">${ic('spunta', 14)}</i></button>`).join('');
      $$('.m-segno', this.el).forEach(b => { b.onclick = () => this.opz.tocca?.(b.dataset.id); });
      this.fatte();
      this.punti(punti ?? (this.opz.tutte ? puntiPer(Gx) : []));
      if (this.opz.tutte) this.mostraTutte(this.opz.tutte(Gx), false);
      this.adatta(vola);
    }
    // la strada fatta (proposta 4): i tratti che portano a una tappa visitata sono pieni; i segni delle visitate hanno la spunta
    fatte() {
      $$('.m-segno', this.el).forEach(b => b.classList.toggle('m-segno--v', visitata(b.dataset.id)));
      const fatto = $$('.m-rotta path', this.svg);
      (this.linee || []).forEach((l, i) => { const v = this.voci[l.tappaDopo]; const si = !!v && visitata(v.id); fatto[2 * i]?.classList.toggle('m-fatta', si); fatto[2 * i + 1]?.classList.toggle('m-fatta', si); });
    }
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
    inquadra(dur = 700, ids = this.idsPunti) {
      this.fuoco = null; this.mosso = true;
      const fine = this.vbPer(riquadroXY([...ids.map(id => T(id).xy), ...this.tappe.map(v => v.xy)]));
      if (piano() && this.vb && dur > 0) this.vola(fine, dur); else { cancelAnimationFrame(this.raf); this.fermaVolo?.(); this.metti(fine); this.nomiVisibili(); }
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
      if (!vola || !this.vb || !piano()) { cancelAnimationFrame(this.raf); this.fermaVolo?.(); this.metti(fine); this.finito(); return; }
      this.vola(fine, 780, () => this.finito());
    }
    // Il volo della mappa (Enrico, 14/10/2026: più fluido): la mappa si sposta e si ingrandisce come un'immagine sola, mossa
    // dal telefono senza ridisegnarla a ogni passo, insieme ai segni delle tappe; all'arrivo si ridisegna nitida. Prima si
    // ricalcolava tutto il disegno (strade, nomi) a ogni immagine: su un telefono medio 6-7 immagini al secondo.
    vola(fine, dur, poi) {
      cancelAnimationFrame(this.raf); this.fermaVolo?.();
      const da = this.vb;
      if (!da) { this.metti(fine); poi?.(); return; }
      const W = this.el.clientWidth || 1, s0 = W / da.w, s1 = W / fine.w, k = s1 / s0, tx = (da.x - fine.x) * s1, ty = (da.y - fine.y) * s1;
      const ease = 'cubic-bezier(.65, 0, .35, 1)';
      this.svg.style.transformOrigin = '0 0';
      const anims = [this.svg.animate([{ transform: 'none' }, { transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${k.toFixed(4)})` }], { duration: dur, easing: ease })];
      $$('.m-segno, .m-cibo, .m-punto', this.el).forEach(el => {
        const m = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(el.style.transform);
        if (!m) return;
        const x = +m[1], y = +m[2];
        anims.push(el.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: `translate(${(x * k + tx).toFixed(1)}px, ${(y * k + ty).toFixed(1)}px)` }], { duration: dur, easing: ease }));
      });
      let fatto = false;
      this.fermaVolo = () => { if (fatto) return; fatto = true; this.fermaVolo = null; anims.forEach(x => x.cancel()); };
      anims[0].finished.then(() => { if (fatto) return; fatto = true; this.fermaVolo = null; this.metti(fine); anims.forEach(x => x.cancel()); this.nomiVisibili(); poi?.(); }, () => {});
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
      if (MODO === 2) { clearTimeout(this.tP); this.tP = setTimeout(() => this.pezzi(), 40); }
    }
    nomiVisibili() {
      for (const t of this.nomi) {
        const rotta = t.classList.contains('m-nome--rotta');
        // i nomi del percorso compaiono prima (da 0,9 px ogni 5 m) e stanno appena sopra la linea; le vie principali sempre, se il nome ci sta
        t.classList.toggle('m-nome--su', rotta ? +t.dataset.l * this.s > +t.dataset.c * 7 + 24 && this.s > 0.9 : +t.dataset.l * this.s > +t.dataset.c * 6.4 + 36 && this.s > 1.4 && !this.inRotta.has(t.dataset.nome));
        if (rotta) t.setAttribute('dy', (-7.5 / this.s).toFixed(2));
      }
    }
    // i pezzi nella vista (più un quarto di pezzo intorno), solo da vicino; ognuno si scarica una volta per tutta la pagina
    pezzi() {
      const v = this.vb;
      if (v && this.s >= SOGLIA_PEZZI) {
        const L = PZ.lato, m = L / 4;
        for (let i = Math.floor((v.x - m) / L); i <= Math.floor((v.x + v.w + m) / L); i++) for (let j = Math.floor((v.y - m) / L); j <= Math.floor((v.y + v.h + m) / L); j++) {
          const k = `${i}_${j}`;
          if (!ESISTE.has(k) || this.messi.has(k)) continue;
          this.messi.add(k);
          prendi(k).then(d => { if (d) this.aggiungi(k, d); else this.messi.delete(k); });
        }
      }
      this.conta();
    }
    aggiungi(k, d) {
      const strati = $$('.m-fine > g', this.svg);
      STRATI_P.forEach(([c], i) => { if (d[c]) strati[i].insertAdjacentHTML('beforeend', `<path d="${d[c]}"/>`); });
      const [i, j] = k.split('_').map(Number), L = PZ.lato;
      $('.m-bordi', this.svg).insertAdjacentHTML('beforeend', `<rect x="${i * L}" y="${j * L}" width="${L}" height="${L}"/><text x="${i * L + L / 2}" y="${j * L + L / 2}">${(PZ.pesi[k] / 1024).toFixed(1)} KB</text>`);
      this.nomiPezzi.push(...d.n.map(([nome, c, Lu, dd]) => ({ nome, c, pts: puntiRel(dd) })));
      this.peso += PZ.pesi[k] || 0;
      this.conta();
      clearTimeout(this.tNomi); this.tNomi = setTimeout(() => this.nomiRotta(), 80);
    }
    conta() {
      const p = $('.m-pezzi', this.el);
      if (p) p.textContent = this.s < SOGLIA_PEZZI ? 'Da lontano: solo le strade della mappa di oggi' : `${this.messi.size} pezzi caricati · ${(this.peso / 1024).toFixed(0)} KB compressi`;
    }
    // i nomi delle vie dove passa il percorso: punti ogni 10 m sulla linea, la via con il nome più vicina (entro 15 m);
    // un tratto di almeno 120 m sulla stessa via prende il nome, scritto sul percorso stesso (una volta per via, il tratto più lungo)
    nomiRotta() {
      const g = $('.m-nomi-rotta', this.svg);
      if (!g) return;
      const C = 16, griglia = new Map();
      this.nomiPezzi.forEach((n, q) => {
        for (let i = 1; i < n.pts.length; i++) {
          const a = n.pts[i - 1], b = n.pts[i];
          for (let x = Math.floor((Math.min(a[0], b[0]) - 3) / C); x <= Math.floor((Math.max(a[0], b[0]) + 3) / C); x++) for (let y = Math.floor((Math.min(a[1], b[1]) - 3) / C); y <= Math.floor((Math.max(a[1], b[1]) + 3) / C); y++) {
            const k = x + ',' + y; if (!griglia.has(k)) griglia.set(k, []); griglia.get(k).push([q, a, b]);
          }
        }
      });
      const via = p => { let nome = null, bd = 3; for (const [q, a, b] of griglia.get(Math.floor(p[0] / C) + ',' + Math.floor(p[1] / C)) || []) { const d = distSeg(p, a, b); if (d < bd) { bd = d; nome = this.nomiPezzi[q].nome; } } return nome; };
      const migliori = new Map();
      for (const l of this.linee || []) {
        if (l.modo === 'stima') continue;
        const pts = puntiDi(l.d), camp = [];
        for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(dist(a, b) / 2)); for (let k = i === 1 ? 0 : 1; k <= n; k++) { const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]; camp.push({ p, nome: via(p) }); } }
        // tratti con lo stesso nome: un buco di due punti non li interrompe
        for (let i = 0; i < camp.length;) {
          const nome = camp[i].nome;
          if (!nome) { i++; continue; }
          let j = i, buco = 0;
          for (let k = i + 1; k < camp.length; k++) { if (camp[k].nome === nome) { j = k; buco = 0; } else if (++buco > 2) break; }
          const tratto = camp.slice(i, j + 1).map(c => c.p);
          let Lt = 0; for (let k = 1; k < tratto.length; k++) Lt += dist(tratto[k - 1], tratto[k]);
          if (Lt >= 24 && Lt > (migliori.get(nome)?.L ?? 0)) migliori.set(nome, { L: Lt, pts: tratto });
          i = j + 1;
        }
      }
      const lista = [...migliori].map(([nome, { L, pts }]) => { const p = pts[0][0] > pts[pts.length - 1][0] ? [...pts].reverse() : pts; return { nome, L, d: 'M' + p.filter((x, k) => k % 3 === 0 || k === p.length - 1).map(x => x[0].toFixed(1) + ' ' + x[1].toFixed(1)).join('L') }; });
      this.inRotta = new Set(lista.map(x => x.nome));
      g.innerHTML = lista.map((e, i) => `<path id="m${this.n}r${i}" d="${e.d}"/><text class="m-nome m-nome--rotta" data-l="${Math.round(e.L)}" data-c="${e.nome.length}" data-nome="${esc(e.nome)}"><textPath href="#m${this.n}r${i}" startOffset="50%" text-anchor="middle">${esc(e.nome)}</textPath></text>`).join('');
      this.nomi = $$('.m-nome', this.el);
      if (this.s) this.nomiVisibili();
    }
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
    segni() {
      const s = this.s;
      const pos = this.tappe.map(v => { const x = (v.xy[0] - this.vb.x) * s, y = (v.xy[1] - this.vb.y) * s; return { x, y, x0: x, y0: y }; });
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
      // pezzo 7: i locali intorno al pasto, allontanati appena tra loro (e dai segni delle tappe) per poterli toccare
      const cibi = $$('.m-cibo', this.el);
      if (cibi.length) {
        const cp = cibi.map(b => { const xy = T(b.dataset.id).xy, x = (xy[0] - this.vb.x) * s, y = (xy[1] - this.vb.y) * s; return { x, y }; });
        for (let giro = 0; giro < 40; giro++) {
          let mosso = false;
          for (let i = 0; i < cp.length; i++) {
            for (let j = i + 1; j < cp.length; j++) { const a = cp[i], b = cp[j]; let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy); if (d >= 26) continue; if (d < .01) { dx = 1; dy = .3; d = 1.04; } const k = (26 - d) / 2 / d; a.x -= dx * k; a.y -= dy * k; b.x += dx * k; b.y += dy * k; mosso = true; }
          }
          if (!mosso) break;
        }
        cibi.forEach((b, i) => { b.style.transform = `translate(${cp[i].x.toFixed(1)}px, ${cp[i].y.toFixed(1)}px)`; });
      }
    }
    cibo(m, lista, tocca) {
      const c = qui(m);
      $('.m-cerchi', this.svg).innerHTML = `<circle class="m-giro" cx="${c[0]}" cy="${c[1]}" r="140"/><circle class="m-giro m-giro--5" cx="${c[0]}" cy="${c[1]}" r="70"/><text class="m-giro__t" x="${c[0]}" y="${c[1] - 144}" text-anchor="middle">10 min</text><text class="m-giro__t" x="${c[0]}" y="${c[1] - 74}" text-anchor="middle">5 min</text>`;
      const vicinoQui = lista.filter(x => x.min <= 15);
      $('.m-cibi', this.el).innerHTML = vicinoQui.map(x => `<button type="button" class="m-cibo${x.stato === 'chiuso' ? ' m-cibo--chiuso' : ''}" data-id="${x.id}" aria-label="${esc(T(x.id).nome)}, ${minTesto(x)}, ${esc(x.nota)}">${ic('posate', 15)}</button>`).join('');
      $$('.m-cibo', this.el).forEach(b => { b.onclick = () => tocca(b.dataset.id); });
      this.fuoco = { x1: c[0] - 150, x2: c[0] + 150, y1: c[1] - 160, y2: c[1] + 150 };
      this.adatta(false);
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
    evidenzia(id) { $$('.m-segno, .m-punto, .m-cibo', this.el).forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id))); }
    spegni() { this.ro.disconnect(); cancelAnimationFrame(this.raf); this.fermaVolo?.(); }
  }

  // =====================================================================================
  // Pezzi comuni: foglio che sale (si chiude anche tirandolo giù), avviso in basso, annuncio per i lettori di schermo
  // =====================================================================================
  const foglioEl = $('#foglio');
  let mappaF = null;
  const spegniMappaF = () => { mappaF?.spegni(); mappaF = null; };
  function foglio(titolo, corpo, dopoAperto, cl = '') {
    spegniMappaF();
    foglioEl.className = cl;
    foglioEl.innerHTML = `<div class="f-testa"><span class="f-maniglia" aria-hidden="true"></span><h2 id="f-titolo">${esc(titolo)}</h2><button type="button" class="f-chiudi" aria-label="Chiudi">${ic('x')}</button></div><div class="f-corpo">${corpo}</div>`;
    $('.f-chiudi', foglioEl).onclick = () => chiudiFoglio();
    foglioEl.onclick = null; foglioEl.onchange = null; foglioEl.onkeydown = null; foglioEl.sfoglia = null; foglioEl.puoi = null;
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
    tempoAvviso = setTimeout(() => t.classList.remove('su'), azione ? 3600 : 2340);
  }
  const chiudiAvviso = ms => { clearTimeout(tempoAvviso); tempoAvviso = setTimeout(() => $('#toast').classList.remove('su'), ms); };
  $('#toast').addEventListener('pointerenter', () => clearTimeout(tempoAvviso));
  $('#toast').addEventListener('focusin', () => clearTimeout(tempoAvviso));
  $('#toast').addEventListener('pointerleave', () => chiudiAvviso(1800));
  $('#toast').addEventListener('focusout', () => chiudiAvviso(1800));
  const annuncia = testo => { const a = $('#annuncio'); a.textContent = ''; setTimeout(() => { a.textContent = testo; }, 30); };
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
  // La scheda: i pezzi veri (src/components/itinerari/Scheda.astro, dalla build) che ogni proposta mette in pagina a suo modo:
  // foto con il credito, quando (nel giorno), «visitata», in breve, testo, orari, biglietti, come arrivare, fonti, azioni.
  // =====================================================================================
  const posizione = id => {
    const g = giornoDi(id);
    if (g < 0) return null;
    const Gx = G(g), v = tappe(Gx).find(x => x.id === id), ordine = tappe(Gx).map(x => x.id);
    return { g, Gx, v, i: ordine.indexOf(id), n: ordine.length, ordine };
  };
  const trattoVerso = (Gx, id) => { const i = Gx.voci.findIndex(v => v.tipo === 'tappa' && v.id === id); const t = Gx.voci[i - 1]; return t?.tipo === 'tratto' ? t : null; };
  const quandoTesto = id => {
    const p = posizione(id);
    if (!p) return '';
    if (p.v.fatta) return `Giorno ${p.g + 1}, visitata`;
    return `Giorno ${p.g + 1}, dalle ${ora(p.v.inizio)} alle ${ora(p.v.fine)}`;
  };
  function inBreve(id) {
    const t = T(id), g = Math.max(0, giornoDi(id)), out = [];
    out.push(['clessidra', `Visita di ${durata(t.durata)}`]);
    if (t.chiuso.length) out.push(['calendario', `Chiuso il ${t.chiuso.map(x => GS[x]).join(' e il ')}`]);
    if (S.data && t.chiuso.includes(giornoSett(g))) out.push(['attenzione', `Chiuso ${dataLunga(g)}: è il giorno ${g + 1} del tuo itinerario`, true]);
    if (t.prenotazione === 'obbligatoria') out.push(['attenzione', 'Si entra solo prenotando', true]);
    else if (t.prenotazione === 'consigliata') out.push(['info', 'Meglio prenotare']);
    out.push(['biglietto', INGRESSO[t.ingresso] ?? '']);
    out.push(['casa', `${DENTRO[t.alChiuso] ?? ''}${t.gradini ? `, ${SCALE[t.gradini]}` : ''}`]);
    if (MOMENTO[t.momento]) out.push(['sole', MOMENTO[t.momento]]);
    return out;
  }
  const chips = (id, cl = 'sch-chip') => `<ul class="${cl}s">${inBreve(id).map(([i, x, w], k) => `<li class="${cl}${w ? ` ${cl}--attenzione` : ''}" style="--k:${k}">${ic(i, 17)}<span>${x}</span></li>`).join('')}</ul>`;
  const testoScheda = id => (T(id).scheda?.testo ?? []).map((p, k) => `<p${k === 0 ? ' class="sch-attacco"' : ''}>${esc(p)}</p>`).join('');
  const sezioni = (id, h = 'h3') => (T(id).scheda?.sezioni ?? []).map(s => `<section class="sch-sez"><${h}>${esc(s.titolo)}</${h}><p>${esc(s.testo)}${s.segno ? '<sup class="sch-segno" aria-hidden="true">*</sup>' : ''}</p></section>`).join('');
  function fontiScheda(id, aperte = false) {
    const s = T(id).scheda;
    if (!s?.fonti?.length) return '';
    const segno = s.sezioni.some(x => x.segno);
    return `<details class="sch-fonti"${aperte ? ' open' : ''}><summary><span>Fonti</span><span class="sch-fonti__n num">${s.fonti.length}</span>${ic('abbassa', 18)}</summary>
      <ol>${s.fonti.map(f => `<li><a href="${esc(f.url)}" rel="noopener" target="_blank">${esc(f.titolo)}${ic('esterno', 14)}</a><span>${esc(f.editore)}${f.tipo === 'ufficiale' ? ', sito ufficiale' : ''}</span></li>`).join('')}</ol>
      ${s.controllato ? `<p>Informazioni controllate il ${dataScritta(s.controllato)}.${segno ? ' Il segno * vuol dire che l\'informazione non è ufficiale per il 2027 (lo dice la frase stessa).' : ''}</p>` : ''}</details>`;
  }
  const credito = id => (T(id).scheda?.credito ? `<p class="sch-credito">${esc(T(id).scheda.credito)}</p>` : '');
  // senza una foto con licenza libera: un riquadro con la soglia del marchio (niente foto inventate)
  const fotoScheda = (id, cl = 'sch-foto') => (FOTO[id] ? `<img class="${cl}" src="${FOTO[id]}" decoding="async" alt="${esc(T(id).scheda?.alt ?? '')}">` : `<span class="${cl} sch-senza" aria-hidden="true">${soglia()}</span>`);
  const quandoSegnata = id => { if (!S.fatte[id]) return ''; const d = new Date(S.fatte[id]); return `Segnata ${d.toDateString() === new Date().toDateString() ? 'oggi' : d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} alle ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; };
  // il pulsante grande di «visitata» (nelle schede): la soglia, il testo, sotto quando l'hai segnata
  const bottoneV = (id, cl = '') => (!nelViaggio(id) ? '' : puoiSegnare()
    ? `<button type="button" class="bv ${cl}" data-azione="visitata" data-id="${id}" aria-pressed="${visitata(id)}">${soglia('bv__s')}<span class="bv__t"><span class="bv__no">Da visitare</span><span class="bv__si">Visitata</span><small class="bv__sotto" data-sotto="${id}">${visitata(id) ? quandoSegnata(id) : 'Tocca quando ci sei stato'}</small></span></button>`
    : `<div class="bv-salva">${soglia('bv__s')}<p>Salva l'itinerario per segnare le tappe che hai visitato: il segno resta su questo telefono.</p><button type="button" class="f-bottone" data-azione="salva">Salva</button></div>`);
  // «Visitata» nella scheda (giro 2, Enrico): un timbro tondo sul bordo della foto, come il sigillo della proposta 3 del giro 1.
  // Tre stili da scegliere (S.t): 1 il sigillo a trattini che diventa pieno; 2 il timbro postale con il giro di parole e la data;
  // 3 la medaglia del marchio, che si riempie di colore e chiude le soglie al centro.
  const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  const giornoSegnato = id => { const d = S.fatte[id] ? new Date(S.fatte[id]) : new Date(); return `${d.getDate()} ${MESI[d.getMonth()]}`; };
  function timbro(id) {
    if (!nelViaggio(id) || !puoiSegnare()) return '';
    const vis = visitata(id), b = esc(T(id).breve);
    if (S.t === 2) return `<button type="button" class="timbro timbro--2" data-azione="visitata" data-id="${id}" aria-pressed="${vis}"><svg class="timbro__giro" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs><path id="giro-${id}" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0"/></defs><circle class="timbro__anello" cx="50" cy="50" r="46"/><circle class="timbro__anello timbro__anello--2" cx="50" cy="50" r="28"/><text><textPath href="#giro-${id}">NAPOLI · NEXTSTOP · NAPOLI · NEXTSTOP ·</textPath></text></svg>${soglia()}<span class="vh">${b}: </span><span class="timbro__t">visitata</span><span class="timbro__data num" aria-hidden="true">${giornoSegnato(id)}</span></button>`;
    if (S.t === 3) return `<button type="button" class="timbro timbro--3" data-azione="visitata" data-id="${id}" aria-pressed="${vis}"><i class="timbro__fondo" aria-hidden="true"></i>${soglia()}<span class="vh">${b}: </span><span class="timbro__t">visitata</span></button>`;
    return `<button type="button" class="timbro timbro--1" data-azione="visitata" data-id="${id}" aria-pressed="${vis}">${soglia()}<span class="vh">${b}: </span><span class="timbro__t">visitata</span></button>`;
  }
  // le azioni della scheda: spostare in un altro giorno, togliere (con «Annulla» dopo)
  function azioniScheda(id) {
    const g = giornoDi(id);
    if (g < 0) {
      const a = S.giorni[S.g] && aggiunta(S.g, id);
      return `<div class="sch-azioni"><button type="button" class="f-bottone" data-azione="aggiungi-qui" data-id="${id}">${ic('piu', 20)}Aggiungi al giorno ${S.g + 1}</button>${a?.tratto ? `<p class="f-nota">${a.tratto.min} min a piedi da ${esc(T(ultimaDi(S.g)).breve)}, l'ultima tappa del giorno ${S.g + 1}.</p>` : ''}</div>`;
    }
    const altri = range(nG()).filter(k => k !== g);
    return `<div class="sch-azioni">${altri.map(k => `<button type="button" class="sch-azione" data-azione="sposta-giorno" data-id="${id}" data-g="${k}">${ic('calendario', 20)}<span>Sposta nel giorno ${k + 1}</span></button>`).join('')}<button type="button" class="sch-azione sch-azione--togli" data-azione="togli" data-id="${id}">${ic('cestino', 20)}<span>Togli dal giorno ${g + 1}</span></button></div>`;
  }

  // ---------- azioni sulle tappe (uguali per le quattro proposte) ----------
  function segna(id, el) {
    if (!puoiSegnare() || !nelViaggio(id)) return;
    const si = !visitata(id), g = giornoDi(id);
    if (si) S.fatte = { ...S.fatte, [id]: Date.now() }; else { const f = { ...S.fatte }; delete f[id]; S.fatte = f; }
    ricorda();
    annuncia(`${T(id).breve}: ${si ? 'visitata' : 'da visitare'}`);
    // oggi, dal vivo: gli orari si ricalcolano da adesso (le visitate vanno in cima)
    if (vivoOggi(g)) {
      aggiorna(() => {}, { ridisegnaScheda: true });
      requestAnimationFrame(() => $$(`[data-azione="visitata"][data-id="${id}"]`).forEach(b => animaSoglia(b, si)));
      avvisa(si ? `${T(id).breve} visitata: orari ricalcolati da adesso, ${ora(ORA_FINTA)}.` : `${T(id).breve} di nuovo da visitare: orari ricalcolati.`);
      return;
    }
    // gli altri giorni: la tappa si segna e basta, gli orari restano
    $$(`[data-azione="visitata"][data-id="${id}"]`).forEach(b => { b.setAttribute('aria-pressed', String(si)); animaSoglia(b, si); });
    $$(`[data-v-id="${id}"]`).forEach(x => x.toggleAttribute('data-visitata', si));
    $$(`[data-sotto="${id}"]`).forEach(x => { x.textContent = si ? quandoSegnata(id) : x.classList.contains('sch-segnata') ? 'Tocca il timbro sulla foto quando ci sei stato' : 'Tocca quando ci sei stato'; });
    $$(`.timbro[data-id="${id}"] .timbro__data`).forEach(x => { x.textContent = giornoSegnato(id); });
    mappa?.fatte(); mappaD?.fatte();
    Q[S.q].dopoSegno?.(id, si);
    aggiornaCammino();
  }
  function animaSoglia(b, si) {
    if (si && b.classList.contains('timbro--2')) { b.classList.remove('timbro--stampa'); void b.offsetWidth; b.classList.add('timbro--stampa'); }
    const s = $('.soglia', b);
    if (!s) return;
    s.classList.remove('soglia--chiude', 'soglia--apre');
    void s.getBoundingClientRect();
    s.classList.add(si ? 'soglia--chiude' : 'soglia--apre');
  }
  function togliTappa(id, { annulla = true } = {}) {
    const g = giornoDi(id);
    if (g < 0) return;
    const i = S.giorni[g].indexOf(id), segno = S.fatte[id];
    chiudiSchede();
    aggiorna(() => { S.giorni[g] = S.giorni[g].filter(x => x !== id); if (S.aperta === id) S.aperta = null; const f = { ...S.fatte }; delete f[id]; S.fatte = f; });
    if (annulla) avvisa(`${T(id).breve} non è più nel giorno ${g + 1}.`, { testo: 'Annulla', fai: () => aggiorna(() => { S.giorni[g].splice(Math.min(i, S.giorni[g].length), 0, id); if (segno) S.fatte = { ...S.fatte, [id]: segno }; S.nuova = id; }) });
  }
  function spostaA(id, a) {
    const g = giornoDi(id);
    if (g < 0) return;
    const l = S.giorni[g], da = l.indexOf(id);
    if (a === da || a < 0 || a >= l.length) return;
    aggiorna(() => { const x = [...l]; x.splice(da, 1); x.splice(a, 0, id); S.giorni[g] = x; S.nuova = id; });
    annuncia(`${T(id).breve}: tappa ${a + 1} di ${l.length}`);
  }
  function spostaGiorno(id, g2) {
    const g = giornoDi(id);
    if (g < 0 || g === g2) return;
    if (S.giorni[g2].length >= MAX_TAPPE) { avvisa(`Il giorno ${g2 + 1} è pieno: al massimo ${MAX_TAPPE} tappe.`); return; }
    const i = S.giorni[g].indexOf(id);
    chiudiSchede();
    aggiorna(() => { S.giorni[g] = S.giorni[g].filter(x => x !== id); S.giorni[g2] = [...S.giorni[g2], id]; if (S.aperta === id) S.aperta = null; });
    const X = G(g2);
    avvisa(`${T(id).breve} è in fondo al giorno ${g2 + 1}${visitata(id) ? ', con il suo segno di visitata' : ''}. Fine stimata del giorno ${g2 + 1}: ${ora(X.fine)}.`, { testo: 'Annulla', fai: () => aggiorna(() => { S.giorni[g2] = S.giorni[g2].filter(x => x !== id); S.giorni[g].splice(i, 0, id); S.nuova = id; }) });
  }
  function aggiungi(g, id) {
    if (S.giorni[g].length >= MAX_TAPPE) { avvisa(`Al massimo ${MAX_TAPPE} tappe per giorno.`); return; }
    aggiorna(() => { S.giorni[g] = [...S.giorni[g], id]; S.nuova = id; });
    const X = G(g);
    avvisa(`${T(id).breve} è in fondo al giorno ${g + 1}. ${X.fine > X.fineScelta ? `Fine stimata ${ora(X.fine)}, dopo le ${ora(X.fineScelta)}.` : `Fine stimata ${ora(X.fine)}.`}`, { testo: 'Annulla', fai: () => aggiorna(() => { S.giorni[g] = S.giorni[g].filter(x => x !== id); S.nuova = null; }) });
  }

  // =====================================================================================
  // Trascinare per cambiare l'ordine (come il sito: src/scripts/itinerari/trascina.ts). Mentre trascini la giornata mostra solo
  // le tappe (in D le cartoline si fanno strette); al rilascio si ricalcola. Con la tastiera: frecce su e giù sulla maniglia.
  // Proposta 1: dalla maniglia. Proposte 2 e 4: tieni premuta la tappa. Proposta 3: dalla maniglia, in «Modifica il giorno».
  // =====================================================================================
  let trascinando = false;
  const scorritore = el => (computer.matches && S.p === 'c' ? $('#c-foglio') : null);
  function iniziaTrascina(voce, e, presa) {
    const lista = voce.parentElement;
    const r0 = voce.getBoundingClientRect();
    lista.classList.add('in-trascina');
    const voci = $$(':scope > [data-trascina]', lista);
    const da = voci.indexOf(voce);
    if (da < 0 || voci.length < 2) { lista.classList.remove('in-trascina'); return false; }
    trascinando = true;
    const sc = scorritore(), sy = () => (sc ? sc.scrollTop : scrollY);
    const r1 = voce.getBoundingClientRect();
    // la tappa resta sotto il dito anche se si stringe
    const off = Math.max(8, Math.min(r1.height - 8, (e.clientY - r0.top) * (r1.height / Math.max(1, r0.height))));
    if (Math.abs(r1.top + off - e.clientY) > 4) { if (sc) sc.scrollTop += r1.top + off - e.clientY; else scrollBy(0, r1.top + off - e.clientY); }
    voce.classList.add('presa');
    try { presa.setPointerCapture(e.pointerId); } catch {}
    const s0 = sy();
    const r = voci.map(v => { const b = v.getBoundingClientRect(); return { top: b.top + s0, h: b.height }; });
    const spazio = r.length > 1 ? Math.max(0, r[1].top - (r[0].top + r[0].h)) : 0;
    const posto = r[da].h + spazio;
    let y = e.clientY, a = da, attivo = true, giro = 0;
    const posiziona = () => {
      const alto = y - off + sy();
      voce.style.transform = `translateY(${(alto - r[da].top).toFixed(1)}px)`;
      const centro = alto + r[da].h / 2;
      let nuovo = da;
      for (let k = 0; k < voci.length; k++) {
        const mezzo = r[k].top + r[k].h / 2;
        if (k < da && centro < mezzo) nuovo = Math.min(nuovo, k);
        if (k > da && centro > mezzo) nuovo = Math.max(nuovo, k);
      }
      a = nuovo;
      voci.forEach((v, k) => {
        if (k === da) return;
        const sposta = a > da && k > da && k <= a ? -posto : a < da && k < da && k >= a ? posto : 0;
        v.style.transform = sposta ? `translateY(${sposta}px)` : '';
      });
    };
    const scorri = () => {
      if (!attivo) return;
      const margine = 80, h = innerHeight;
      const v = y < margine + 60 ? -Math.ceil((margine + 60 - y) / 7) : y > h - margine ? Math.ceil((y - (h - margine)) / 7) : 0;
      if (v) { if (sc) sc.scrollTop += v; else scrollBy(0, v); posiziona(); }
      giro = requestAnimationFrame(scorri);
    };
    const ferma = ev => { if (ev.cancelable) ev.preventDefault(); };
    const muovi = ev => { if (ev.pointerId !== e.pointerId) return; y = ev.clientY; posiziona(); };
    const chiudi = annulla => {
      if (!attivo) return;
      attivo = false;
      cancelAnimationFrame(giro);
      presa.removeEventListener('pointermove', muovi);
      presa.removeEventListener('pointerup', su);
      presa.removeEventListener('pointercancel', via);
      removeEventListener('keydown', tasto, true);
      document.removeEventListener('touchmove', ferma);
      voci.forEach(v => { v.style.transform = ''; });
      voce.classList.remove('presa');
      lista.classList.remove('in-trascina');
      setTimeout(() => { trascinando = false; }, 80);
      if (!annulla && a !== da) spostaA(voce.dataset.id, a);
    };
    const su = ev => { if (ev.pointerId === e.pointerId) chiudi(false); };
    const via = ev => { if (ev.pointerId === e.pointerId) chiudi(true); };
    const tasto = ev => { if (ev.key === 'Escape') { ev.preventDefault(); chiudi(true); } };
    presa.addEventListener('pointermove', muovi);
    presa.addEventListener('pointerup', su);
    presa.addEventListener('pointercancel', via);
    addEventListener('keydown', tasto, true);
    document.addEventListener('touchmove', ferma, { passive: false });
    posiziona();
    giro = requestAnimationFrame(scorri);
    return true;
  }
  // la maniglia: si trascina, oppure frecce su e giù
  const maniglia = (id, cl = 'maniglia') => `<button type="button" class="${cl}" data-maniglia="${id}" aria-label="Sposta ${esc(T(id).breve)}" aria-describedby="aiuto-maniglia">${ic('maniglia', 22)}</button>`;
  $('#app').addEventListener('pointerdown', e => {
    const m = e.target.closest('[data-maniglia]');
    if (!m || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const voce = m.closest('[data-trascina]');
    if (!voce) return;
    e.preventDefault();
    iniziaTrascina(voce, e, m);
  });
  $('#app').addEventListener('keydown', e => {
    const m = e.target.closest('[data-maniglia]');
    if (!m || !['ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const id = m.dataset.maniglia, g = giornoDi(id), i = S.giorni[g].indexOf(id), a = i + (e.key === 'ArrowUp' ? -1 : 1);
    if (a < 0 || a >= S.giorni[g].length) return;
    spostaA(id, a);
    requestAnimationFrame(() => $(`[data-maniglia="${id}"]`)?.focus());
  });
  // tenere premuta una tappa (proposte 2 e 4): dopo 420 ms si alza e si trascina; se il dito si muove prima, è uno scorrimento
  function tieniPremuto(voce, e, presa, poi) {
    const x0 = e.clientX, y0 = e.clientY;
    let finito = false;
    const pulisci = () => { finito = true; clearTimeout(t); presa.removeEventListener('pointermove', muovi); presa.removeEventListener('pointerup', pulisci); presa.removeEventListener('pointercancel', pulisci); voce.classList.remove('preme'); };
    const muovi = ev => { if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 8) pulisci(); };
    voce.classList.add('preme');
    const t = setTimeout(() => {
      if (finito) return;
      pulisci();
      if (iniziaTrascina(voce, e, presa)) { voce.classList.add('alzata'); setTimeout(() => voce.classList.remove('alzata'), 260); poi?.(); }
    }, 420);
    presa.addEventListener('pointermove', muovi);
    presa.addEventListener('pointerup', pulisci);
    presa.addEventListener('pointercancel', pulisci);
    return pulisci;
  }

  // =====================================================================================
  // Proposta 2: scorrere la riga. A destra: «Visitata» (la soglia si chiude mentre trascini); a sinistra: «Togli».
  // =====================================================================================
  let scorsa = false;
  function scorriRiga(voce, e) {
    const pelle = $('.riga-pelle', voce) || voce;
    const x0 = e.clientX, y0 = e.clientY, W = voce.getBoundingClientRect().width, SOGLIA = Math.min(110, W * .3);
    let dir = null, x = 0, armato = null;
    const fermaPremuto = tieniPremuto(voce, e, pelle);
    const muovi = ev => {
      if (ev.pointerId !== e.pointerId) return;
      if (trascinando) { pulisci(); return; }
      const dx = ev.clientX - x0, dy = ev.clientY - y0;
      if (!dir) {
        if (Math.hypot(dx, dy) < 10) return;
        dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v';
        if (dir === 'v') { pulisci(); return; }
        fermaPremuto();
        try { pelle.setPointerCapture(e.pointerId); } catch {}
        voce.classList.add('scorre');
      }
      if (dir !== 'h') return;
      const destra = dx > 0;
      if (destra && (!puoiSegnare())) { x = Math.min(dx, 40) * .5; } else x = Math.abs(dx) > SOGLIA * 1.4 ? Math.sign(dx) * (SOGLIA * 1.4 + (Math.abs(dx) - SOGLIA * 1.4) * .25) : dx;
      pelle.style.transform = `translateX(${x.toFixed(1)}px)`;
      voce.dataset.lato = x > 0 ? 'destra' : 'sinistra';
      const ora = Math.abs(x) >= SOGLIA && (x < 0 || puoiSegnare()) ? (x > 0 ? 'v' : 't') : null;
      if (ora !== armato) {
        armato = ora;
        voce.classList.toggle('armata', !!armato);
        if (armato === 'v') { const b = $('.riga-sotto__v .soglia', voce); if (b) { b.classList.remove('soglia--chiude', 'soglia--apre'); void b.getBoundingClientRect(); b.classList.add(visitata(voce.dataset.id) ? 'soglia--apre' : 'soglia--chiude'); } }
      }
    };
    const pulisci = () => { pelle.removeEventListener('pointermove', muovi); pelle.removeEventListener('pointerup', su); pelle.removeEventListener('pointercancel', via); };
    const torna = () => {
      voce.classList.remove('armata');
      const da = pelle.style.transform || 'translateX(0px)';
      pelle.style.transform = '';
      if (piano()) pelle.animate([{ transform: da }, { transform: 'translateX(0px)' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' }).finished.then(() => voce.classList.remove('scorre')).catch(() => {});
      else voce.classList.remove('scorre');
    };
    const su = async ev => {
      if (ev.pointerId !== e.pointerId) return;
      pulisci();
      if (dir !== 'h') return;
      scorsa = true; setTimeout(() => { scorsa = false; }, 80);
      const id = voce.dataset.id;
      if (armato === 't') {
        if (piano()) { await pelle.animate([{ transform: pelle.style.transform }, { transform: `translateX(${-W - 20}px)` }], { duration: 220, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }).finished.catch(() => {}); const h = voce.offsetHeight; await voce.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 220, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }).finished.catch(() => {}); }
        togliTappa(id);
        return;
      }
      torna();
      if (armato === 'v') segna(id);
    };
    const via = ev => { if (ev.pointerId !== e.pointerId) return; pulisci(); if (dir === 'h') torna(); };
    pelle.addEventListener('pointermove', muovi);
    pelle.addEventListener('pointerup', su);
    pelle.addEventListener('pointercancel', via);
  }
  // la prima volta, in 2, la prima tappa si sposta un poco a destra e torna: per far capire che si scorre
  function suggerisciScorrimento() {
    let visto = false;
    try { visto = !!localStorage.getItem('prova-scheda-scorri'); localStorage.setItem('prova-scheda-scorri', '1'); } catch {}
    if (visto || !piano()) return;
    const p = $('.giorno-attivo [data-scorre] .riga-pelle');
    if (!p) return;
    const v = p.closest('[data-scorre]');
    setTimeout(() => {
      v.classList.add('scorre'); v.dataset.lato = 'destra';
      p.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(92px)', offset: .35 }, { transform: 'translateX(92px)', offset: .6 }, { transform: 'translateX(0)' }], { duration: 1500, easing: 'cubic-bezier(.45,0,.2,1)' }).finished.then(() => v.classList.remove('scorre')).catch(() => {});
    }, 900);
  }

  // =====================================================================================
  // Pezzo 3 · la ricerca (specifiche/compositore.md §3): una sola per tappe, locali e gite. Cerca nel nome, nelle parole del
  // sito (sinonimi di generi, cucine e piatti: regola nostra) e nelle frasi dei testi, che hanno già la fonte; senza accenti
  // e con piccoli errori di battitura. Nel sito vero le frasi diventano le «parole» dei dati, controllate dalla build.
  // Giro 1: tre riquadri (1 l'indice, 2 le file di cartoline, 3 la frase trovata); Enrico sceglie la 2 (13/10/2026).
  // Giro 2: il riquadro 2 con quattro modi di segnare la parola trovata (S.r = segno 1-4) e il nome della città solo nei nomi.
  // =====================================================================================
  const FILTRI = [
    ['tutte', 'Tutte', () => true], ['musei', 'Musei', t => t.generi.some(g => g === 'museo' || g === 'archeologia')], ['chiese', 'Chiese', t => t.generi.includes('chiesa')],
    ['panorami', 'Panorami', t => t.generi.includes('panorama')], ['sotto', 'Sottoterra', t => t.generi.includes('sotterraneo')], ['verde', 'Parchi e mare', t => t.generi.some(g => g === 'parco' || g === 'mare')],
    ['passeggiate', 'Passeggiate', t => t.generi.includes('passeggiata')], ['gratis', 'Gratis', t => t.ingresso === 'gratis']
  ];
  // le parole del sito: il primo nome è quello che si vede («per: Panorama»)
  const SIN = {
    genere: {
      panorama: ['Panorama', 'panorami', 'vista', 'veduta', 'belvedere', 'terrazza', 'tramonto'], museo: ['Museo', 'musei', 'mostra', 'arte', 'quadri', 'dipinti', 'statue'],
      chiesa: ['Chiesa', 'chiese', 'basilica', 'cattedrale', 'cappella'], sotterraneo: ['Sottoterra', 'sotterranea', 'sotterraneo', 'sotterranei', 'catacombe'],
      archeologia: ['Scavi', 'archeologia', 'archeologico', 'rovine', 'romani', 'greci'], parco: ['Parco', 'parchi', 'giardino', 'giardini', 'verde'],
      mare: ['Mare', 'spiaggia', 'spiagge', 'bagno', 'lungomare'], castello: ['Castello', 'castelli', 'fortezza'], passeggiata: ['Passeggiata', 'passeggiate', 'camminare'],
      teatro: ['Teatro', 'opera lirica', 'balletto']
    },
    cucina: {
      pizza: ['Pizzeria', 'pizza', 'pizze', 'pizzerie'], pesce: ['Pesce', 'frutti di mare', 'crudo'], dolci: ['Dolci e caffè', 'dolci', 'pasticceria', 'pasticcerie', 'colazione', 'bar'],
      strada: ['Cibo di strada', 'street food', 'fritti', 'friggitoria'], carne: ['Carne', 'braceria', 'bistecca', 'grigliata'], pasta: ['Pasta', 'primi'],
      napoletana: ['Cucina napoletana', 'trattoria', 'cucina tipica']
    },
    piatto: {
      margherita: ['Pizza margherita', 'margherita'], marinara: ['Pizza marinara', 'marinara'], 'pizza-fritta': ['Pizza fritta'], cuoppo: ['Cuoppo di fritti', 'cuoppo'],
      frittatina: ['Frittatina di pasta', 'frittatina'], montanara: ['Montanara'], genovese: ['Genovese'], ragu: ['Ragù'], 'pasta-patate': ['Pasta e patate', 'pasta patate e provola'],
      vongole: ['Spaghetti alle vongole', 'vongole'], frittura: ['Frittura di pesce', 'frittura'], polpette: ['Polpette al ragù', 'polpette'], parmigiana: ['Parmigiana di melanzane', 'parmigiana'],
      baccala: ['Baccalà'], sfogliatella: ['Sfogliatella', 'riccia', 'frolla'], baba: ['Babà'], pastiera: ['Pastiera'], caffe: ['Caffè', 'espresso']
    },
    gruppo: { gite: ['Gita di un giorno', 'gita', 'gite', 'escursione', 'fuori napoli', 'isola', 'isole'], mangiare: ['Da mangiare', 'mangiare', 'ristorante', 'ristoranti', 'pranzo', 'cena'] }
  };
  const CUCINA_NOME = { pizza: 'Pizzeria', pesce: 'Pesce', dolci: 'Pasticceria e caffè', strada: 'Cibo di strada', carne: 'Carne', pasta: 'Pasta', napoletana: 'Cucina napoletana' };
  const GRUPPI = { vedere: { nome: 'Da vedere', ic: 'occhio' }, mangiare: { nome: 'Da mangiare', ic: 'posate' }, gite: { nome: 'Gite', ic: 'bussola' } };
  const PROVA_CERCA = ['Cristo velato', 'Caravaggio', 'sfogliatela', 'panorama', 'pizza fritta', 'gesu', 'Pompei', 'catacombe'];
  // il nome della città (nel sito arriva dai dati della città): chi scrive «Napoli» cerca Napoli Sotterranea, non tutti i posti di Napoli
  const CITTA_NOMI = ['napoli', 'napoletano', 'napoletana', 'napoletani', 'napoletane'];
  const diCitta = w => CITTA_NOMI.some(c => c === w || (w.length >= 4 && c.startsWith(w)) || (w.length >= 5 && distanza(w, c, 1) <= 1));
  const VUOTE = new Set('a ad al alla alle ai agli allo e ed i il in la le lo l gli di da dal dalla dei del della delle dello degli d con per su un una uno o che'.split(' '));

  // una frase spezzata in parole, ricordando dove sono nel testo (per evidenziarle)
  const pezzi = s => { const seg = [...String(s ?? '').matchAll(/[\p{L}\p{N}]+/gu)].map(m => ({ i: m.index, n: m[0].length, w: norma(m[0]) })); return { s: String(s ?? ''), seg }; };
  // errori di battitura: lettere sbagliate, mancanti, in più o scambiate con la vicina (Damerau), fermandosi oltre max
  function distanza(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const d = Array.from({ length: a.length + 1 }, (_, i) => { const r = new Array(b.length + 1).fill(0); r[0] = i; return r; });
    for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      let min = Infinity;
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        min = Math.min(min, d[i][j]);
      }
      if (min > max) return max + 1;
    }
    return d[a.length][b.length];
  }
  const tolleranza = q => (q.length >= 9 ? 2 : q.length >= 5 ? 1 : 0);
  // quanto una parola cercata somiglia a una parola del testo: 3 uguale, 2 l'inizio (mentre scrivi), 1.5 con un errore
  // gli errori si tollerano solo se la parola scritta non c'è nei nostri testi: «pizza» c'è, quindi non trova «piazza»
  let esatte = new Set();
  function somiglia(q, w, ultima) {
    if (q === w) return 3;
    if (w.startsWith(q) && (q.length >= 5 || (ultima && q.length >= 2))) return 2;
    if (esatte.has(q)) return 0;
    const t = tolleranza(q);
    return t && distanza(q, w, t) <= t ? 1.5 : 0;
  }
  // tutte le parole cercate devono trovarsi nel testo; un punto in più se sono una dopo l'altra, come scritte
  function confronta(qs, p) {
    if (!p.seg.length) return null;
    let tot = 0;
    const dove = [];
    for (let k = 0; k < qs.length; k++) {
      let best = 0, bi = -1;
      p.seg.forEach((x, i) => { const s = somiglia(qs[k], x.w, k === qs.length - 1); if (s > best) { best = s; bi = i; } });
      if (!best) return null;
      tot += best; dove.push(bi);
    }
    const fila = qs.length > 1 && dove.every((x, i) => !i || x === dove[i - 1] + 1);
    return { s: tot / qs.length + (fila ? 1 : 0), dove };
  }
  const gruppoDi = t => (t.tipo === 'gita' ? 'gite' : t.categoria ? 'mangiare' : 'vedere');
  // le etichette di ogni tappa (generi, cucine, piatti, gruppo), dalle parole del sito
  const etichetteDi = t => {
    const out = [], metti = (tipo, chiave) => { const l = SIN[tipo][chiave]; if (l) out.push({ tipo, nome: l[0], p: l.map(pezzi) }); };
    if (t.categoria) { (t.cucina ?? []).forEach(c => metti('cucina', c)); (t.piatti ?? []).forEach(c => metti('piatto', c)); metti('gruppo', 'mangiare'); }
    else (t.generi ?? []).forEach(g => metti('genere', g));
    if (t.tipo === 'gita') metti('gruppo', 'gite');
    return out;
  };
  let VOC = null;
  const vocabolario = () => (VOC ??= [...new Set(indice().flatMap(x => [x.nome, x.breve, x.zona, ...x.frasi, ...x.etichette.flatMap(e => e.p)].flatMap(p => p.seg.map(y => y.w))))]);
  let INDICE = null;
  const indice = () => (INDICE ??= Object.values(D.tappe).filter(t => t.id !== 'regate').map(t => ({
    id: t.id, gruppo: gruppoDi(t), nome: pezzi(t.nome), breve: pezzi(t.breve), zona: pezzi(t.zona),
    frasi: (t.frasi ?? []).map(f => ({ ...pezzi(f.t), da: f.da })), etichette: etichetteDi(t)
  })));
  // cerca: per ogni tappa il motivo migliore (nome, etichetta, frase, zona); poi in gruppi, dal gruppo più pertinente
  function cerca(testo, filtro = 'tutte') {
    const qs = pezzi(testo).seg.map(x => x.w).filter(w => !VUOTE.has(w));
    if (!qs.length || norma(testo).replace(/[^a-z0-9]/g, '').length < 2) return null;
    const ok = FILTRI.find(f => f[0] === filtro)[2];
    const qa = qs.filter(w => !diCitta(w)); // fuori dai nomi, senza il nome della città
    const voc = vocabolario();
    esatte = new Set(qs.filter(q => voc.some(w => w === q || (q.length >= 4 && w.startsWith(q)))));
    const trovati = [];
    for (const x of indice()) {
      if (!ok(T(x.id))) continue;
      let migliore = null;
      const prova = (m, peso, perche) => { if (m && (!migliore || m.s + peso > migliore.s)) migliore = { s: m.s + peso, ...perche, dove: m.dove }; };
      prova(confronta(qs, x.nome), 3, { tipo: 'nome' });
      if (x.breve.s !== x.nome.s) prova(confronta(qs, x.breve), 3, { tipo: 'nome' });
      if (!qa.length) { if (migliore) trovati.push({ id: x.id, gruppo: x.gruppo, ...migliore }); continue; }
      for (const e of x.etichette) for (const p of e.p) { const m = confronta(qa, p); if (m && m.dove.length >= Math.min(qa.length, p.seg.length)) prova(m, 1.2, { tipo: e.tipo, nome: e.nome }); }
      x.frasi.forEach((f, k) => prova(confronta(qa, f), 1.5, { tipo: 'frase', k }));
      prova(confronta(qa, x.zona), 0.5, { tipo: 'zona' });
      if (migliore) trovati.push({ id: x.id, gruppo: x.gruppo, ...migliore });
    }
    const min = id => (gruppoDi(T(id)) === 'gite' || nelViaggio(id) || !S.giorni[S.g]?.length ? null : aggiunta(S.g, id).tratto?.min ?? 0);
    for (const r of trovati) r.min = min(r.id);
    trovati.sort((a, b) => b.s - a.s || (a.min ?? 99) - (b.min ?? 99) || a.id.localeCompare(b.id));
    const gruppi = ['vedere', 'mangiare', 'gite'].map(g => ({ g, l: trovati.filter(r => r.gruppo === g) })).filter(x => x.l.length);
    gruppi.sort((a, b) => b.l[0].s - a.l[0].s);
    return { qs, tutti: trovati, gruppi };
  }
  // le parole trovate dentro il testo, evidenziate
  function evidenzia(p, dove, da = 0, a = p.seg.length) {
    const segni = new Set(dove);
    let out = '', pos = da ? p.seg[da].i : 0;
    const fine = a < p.seg.length ? p.seg[a - 1].i + p.seg[a - 1].n : p.s.length;
    for (let i = da; i < a; i++) {
      const x = p.seg[i];
      out += esc(p.s.slice(pos, x.i));
      out += segni.has(i) ? `<mark class="r-segno">${esc(p.s.slice(x.i, x.i + x.n))}</mark>` : esc(p.s.slice(x.i, x.i + x.n));
      pos = x.i + x.n;
    }
    return out + esc(p.s.slice(pos, fine));
  }
  // un pezzo corto della frase intorno alle parole trovate («…c'è il Cristo velato. Si entra…»)
  function pezzetto(p, dove, lato = 5) {
    const a = Math.max(0, Math.min(...dove) - lato), b = Math.min(p.seg.length, Math.max(...dove) + lato + 1);
    return `${a > 0 ? '…' : ''}${evidenzia(p, dove, a, b)}${b < p.seg.length ? '…' : ''}`;
  }
  const xDi = id => indice().find(x => x.id === id);
  // perché è uscita: la frase, l'etichetta o la zona
  function motivo(r, corto = true) {
    const x = xDi(r.id);
    if (r.tipo === 'frase') return corto ? pezzetto(x.frasi[r.k], r.dove) : evidenzia(x.frasi[r.k], r.dove);
    if (r.tipo === 'piatto') return `Nel menu: ${esc(r.nome)}`;
    if (r.tipo === 'cucina' || r.tipo === 'genere' || r.tipo === 'gruppo') return esc(r.nome);
    if (r.tipo === 'zona') return `Zona: ${esc(T(r.id).zona)}`;
    return '';
  }
  // la parola trovata, come è scritta nel testo («sfogliatelle», «Cristo velato»): va in grande dove manca la foto
  function parolaTrovata(r) {
    if (r.tipo === 'frase') { const p = xDi(r.id).frasi[r.k]; const w = [...new Set(r.dove)].sort((a, b) => a - b).map(i => p.s.slice(p.seg[i].i, p.seg[i].i + p.seg[i].n)).join(' '); return w.charAt(0).toUpperCase() + w.slice(1); }
    if (r.tipo === 'nome') return T(r.id).breve;
    if (r.tipo === 'zona') return T(r.id).zona;
    return r.nome;
  }
  const nomeTrovato = r => (r.tipo === 'nome' ? evidenzia(xDi(r.id).nome, r.dove) : esc(T(r.id).nome));
  const fonteFrase = r => (r.tipo === 'frase' ? xDi(r.id).frasi[r.k].da : null);
  // la riga dei dettagli: minuti a piedi, durata, cucina e prezzo, partenza della gita
  function dettagli(r) {
    const t = T(r.id), out = [];
    if (r.gruppo === 'gite') { out.push('un giorno intero'); if (t.partenza) out.push(`da ${esc(t.partenza)}`); return out; }
    if (r.min != null) out.push(`<span class="num">${r.min} min</span> a piedi`);
    if (r.gruppo === 'mangiare') { out.push(esc(CUCINA_NOME[t.cucina?.[0]] ?? 'Locale')); if (t.fascia) out.push('€'.repeat(t.fascia)); }
    else out.push(`${durata(t.durata)} di visita`);
    return out;
  }
  // il tasto a destra: «+», oppure il giorno in cui la tappa c'è già, oppure (gite) un giorno a parte
  function tastoRisultato(r, cl = 'r-piu') {
    const g = giornoDi(r.id), b = esc(T(r.id).breve);
    if (g >= 0) return `<span class="r-gia"><span class="vh">${b}: </span>Giorno ${g + 1}</span>`;
    if (r.gruppo === 'gite') return `<button type="button" class="${cl} r-piu--gita" data-f="gita" data-id="${r.id}" aria-label="${b}: aggiungi come giorno ${nG() + 1}">${ic('piu', 20)}</button>`;
    return `<button type="button" class="${cl}" data-f="agg" data-id="${r.id}" aria-label="Aggiungi ${b} al giorno ${S.g + 1}">${ic('piu', 20)}</button>`;
  }
  const minia = (id, cl) => (FOTO[id] ? `<img class="${cl}" src="${FOTO[id]}" alt="" loading="lazy" decoding="async">` : `<span class="${cl} ${cl}--senza" aria-hidden="true">${ic(GRUPPI[gruppoDi(T(id))].ic, 22)}</span>`);

  // ---------- 1 · L'indice: solo parole, come l'indice di una guida; le parole trovate sottolineate ----------
  function riquadro1(R, nuovi) {
    return R.gruppi.map(({ g, l }) => `<section class="r1-gruppo" aria-labelledby="r1-${g}"><h3 id="r1-${g}">${ic(GRUPPI[g].ic, 18)}<span>${GRUPPI[g].nome}</span><span class="num r1-n">${l.length}</span></h3>
      <ul>${l.map((r, i) => `<li class="r1-riga${nuovi.has(r.id) ? ' r-entra' : ''}" style="--i:${Math.min(i, 10)}"><button type="button" class="r1-apri" data-f="apri" data-id="${r.id}"><b>${nomeTrovato(r)}</b>${r.tipo !== 'nome' ? `<span class="r1-perche">${motivo(r)}</span>` : ''}<small>${dettagli(r).join(' · ')}</small></button>${tastoRisultato(r)}</li>`).join('')}</ul></section>`).join('');
  }
  // ---------- 2 · Le file di cartoline: un gruppo per fila, da scorrere col dito; il motivo come un cartellino ----------
  function riquadro2(R, nuovi) {
        const carta = (r, i) => {
      const t = T(r.id), senza = !FOTO[r.id];
      return `<li class="r2-carta${nuovi.has(r.id) ? ' r-entra' : ''}${senza ? ' r2-carta--senza' : ''}" style="--i:${Math.min(i, 8)}">
        <button type="button" class="r2-apri" data-f="apri" data-id="${r.id}">${senza ? `<span class="r2-tipo" aria-hidden="true"><span>${esc(parolaTrovata(r))}</span></span>` : `<img src="${FOTO[r.id]}" alt="" loading="lazy" decoding="async">`}
          <span class="r2-t"><b>${nomeTrovato(r)}</b><small>${dettagli(r).join(' · ')}</small></span></button>
        ${!senza && r.tipo !== 'nome' && r.tipo !== 'zona' ? `<span class="r2-cartellino">${r.tipo === 'frase' ? pezzetto(xDi(r.id).frasi[r.k], r.dove, 3) : motivo(r)}</span>` : ''}
        ${tastoRisultato(r, 'r-piu r2-piu')}</li>`;
    };
    return R.gruppi.map(({ g, l }) => `<section class="r2-gruppo" aria-labelledby="r2-${g}"><h3 id="r2-${g}"><span>${GRUPPI[g].nome}</span><span class="num r2-n">${l.length}</span></h3>
      <ul class="r2-fila" tabindex="0" aria-label="${GRUPPI[g].nome}: scorri di lato">${l.map(carta).join('')}</ul></section>`).join('');
  }
  // ---------- 3 · La frase trovata: il risultato migliore con la frase del nostro testo; sopra le schede dei gruppi ----------
  function riquadro3(R, nuovi, scheda) {
    const elenco = scheda === 'tutto' ? R.tutti : R.tutti.filter(r => r.gruppo === scheda);
    const [primo, ...altri] = elenco;
    const schede = [['tutto', 'Tutto', R.tutti.length], ...R.gruppi.map(({ g, l }) => [g, GRUPPI[g].nome, l.length])];
    const tab = `<div class="r3-schede" role="group" aria-label="Quali risultati">${schede.map(([k, n, c]) => `<button type="button" data-f="r3" data-v="${k}" aria-pressed="${k === scheda}">${n} <span class="num">${c}</span></button>`).join('')}</div>`;
    if (!primo) return tab;
    const fonte = fonteFrase(primo);
    const citazione = primo.tipo === 'frase'
      ? `<blockquote class="r3-frase"><p>«${motivo(primo, false)}»</p>${fonte ? `<footer>Dal nostro testo, fonte: ${esc(fonte)}</footer>` : ''}</blockquote>`
      : primo.tipo !== 'nome' ? (FOTO[primo.id] ? `<p class="r3-perche">${motivo(primo)}</p>` : '') : `<p class="r3-perche">${esc(T(primo.id).frase ?? '')}</p>`;
    const g = giornoDi(primo.id);
    const azione = g >= 0 ? `<span class="r3-gia">${ic('spunta', 18)}Già nel giorno ${g + 1}</span>`
      : primo.gruppo === 'gite' ? `<button type="button" class="f-bottone r3-agg" data-f="gita" data-id="${primo.id}">${ic('piu', 20)}Aggiungi come giorno ${nG() + 1}</button>`
      : `<button type="button" class="f-bottone r3-agg" data-f="agg" data-id="${primo.id}">${ic('piu', 20)}Aggiungi al giorno ${S.g + 1}</button>`;
    return `${tab}<article class="r3-primo${nuovi.has(primo.id) ? ' r-entra' : ''}" aria-labelledby="r3-t">
        <div class="r3-foto" data-f="apri" data-id="${primo.id}">${FOTO[primo.id] ? minia(primo.id, 'r3-img') : `<span class="r3-img r3-img--senza" aria-hidden="true"><span>${esc(parolaTrovata(primo))}</span></span>`}</div>
        <div class="r3-corpo"><h3 id="r3-t"><button type="button" data-f="apri" data-id="${primo.id}">${nomeTrovato(primo)}</button></h3><p class="r3-det">${dettagli(primo).join(' · ')}</p>${citazione}${azione}</div>
      </article>
      ${altri.length ? `<ul class="r3-altri">${altri.map((r, i) => `<li class="r3-riga${nuovi.has(r.id) ? ' r-entra' : ''}" style="--i:${Math.min(i, 10)}">${minia(r.id, 'r3-mini')}<button type="button" class="r3-apri" data-f="apri" data-id="${r.id}"><b>${nomeTrovato(r)}</b><small>${r.tipo !== 'nome' ? motivo(r) : dettagli(r).join(' · ')}</small></button>${tastoRisultato(r)}</li>`).join('')}</ul>` : ''}`;
  }

  let ricercaAperta = null;
  function scriviSegnaposto(input, testo) {
    if (!piano()) { input.placeholder = testo; return; }
    let i = 0;
    input.placeholder = '';
    const t = setInterval(() => { if (!input.isConnected || input.value) { clearInterval(t); input.placeholder = testo; return; } input.placeholder = testo.slice(0, ++i); if (i >= testo.length) clearInterval(t); }, 34);
  }
  function apriAggiungi(prima = null) {
    const g = S.g;
    const tutte = candidate(g), per = Object.fromEntries(tutte.map(c => [c.id, c]));
    const ultima = ultimaDi(g) ? T(ultimaDi(g)).breve : null;
    let filtro = prima?.filtro ?? 'tutte', q = prima?.q ?? '', scelta = null, scheda3 = 'tutto', visti = new Set();
    const ids = () => { const ok = FILTRI.find(f => f[0] === filtro)[2]; return tutte.map(c => c.id).filter(id => ok(T(id))); };
    const avvisiDi = id => {
      const X = conTempo(per[id].X, g), out = [];
      if (X.fine > X.fineScelta) out.push(`Finiresti alle ${ora(X.fine)}`);
      if (per[id].X.avvisi.some(x => x.tipo === 'lontana' && x.id === id)) out.push('Lontana dalle altre');
      return out;
    };
    const etich = id => [...avvisiDi(id).map(x => `<span class="f-et f-et--attenzione">${x}</span>`), ...etichette(id, g).map(x => `<span class="f-et">${x}</span>`)].join('');
    const daDove = id => (per[id].tratto ? `<span class="num">${per[id].tratto.min} min</span> a piedi da ${esc(ultima)}, ` : '');
    const riga = (id, i) => {
      const t = T(id);
      return `<li class="f-tappa" style="--i:${Math.min(i, 12)}">${FOTO[id] ? `<img src="${FOTO[id]}" alt="" loading="lazy" decoding="async">` : `<span class="f-senza" aria-hidden="true">${esc(t.breve.slice(0, 1))}</span>`}
        <div><b>${esc(t.nome)}</b><small>${daDove(id)}${durata(t.durata)} di visita</small>${etich(id)}</div><button type="button" class="f-piu" data-f="agg" data-id="${id}" aria-label="Aggiungi ${esc(t.breve)} al giorno ${g + 1}">${ic('piu', 20)}</button></li>`;
    };
    // senza parole: le tappe dalla più vicina (pezzo 1) e qualche ricerca da provare
    const vicine = () => {
      const lista = ids();
      const m = id => per[id].tratto?.min ?? 0;
      const gruppi = ultima ? [['A meno di 10 minuti a piedi', lista.filter(id => m(id) < 10)], ['Tra 10 e 25 minuti', lista.filter(id => m(id) >= 10 && m(id) < 25)], ['Più lontane', lista.filter(id => m(id) >= 25)]] : [['Tutte le tappe', lista]];
      let i = 0;
      return `<div class="r-prova"><p id="r-prova-t">Prova a cercare</p><div class="r-prova__l" role="group" aria-labelledby="r-prova-t">${PROVA_CERCA.map(x => `<button type="button" data-f="prova" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`
        + gruppi.filter(x => x[1].length).map(([tit, l]) => `<section class="f-gruppo"><h3>${tit} <span class="num">${l.length}</span></h3><ul>${l.map(id => riga(id, i++)).join('')}</ul></section>`).join('');
    };
    const nessuno = () => `<div class="r-vuoto"><p><b>Niente per «${esc(q)}»</b>${filtro !== 'tutte' ? ' con il filtro di adesso.' : '.'}</p>
      ${filtro !== 'tutte' ? `<button type="button" class="f-bottone f-bottone--contorno" data-f="togli-filtri">Togli i filtri</button>` : `<p class="f-nota">Prova con il nome di un'opera, di un piatto o di una zona:</p><div class="r-prova__l">${PROVA_CERCA.slice(0, 5).map(x => `<button type="button" data-f="prova" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>`}</div>`;
    const risultati = () => {
      const R = cerca(q, filtro);
      if (!R) { visti = new Set(); return { html: vicine(), n: null }; }
      if (!R.tutti.length) { visti = new Set(); return { html: nessuno(), n: 0 }; }
      const nuovi = new Set(R.tutti.map(r => r.id).filter(id => !visti.has(id)));
      visti = new Set(R.tutti.map(r => r.id));
      if (scheda3 !== 'tutto' && !R.gruppi.some(x => x.g === scheda3)) scheda3 = 'tutto';
      const conta = `<p class="r-conta" id="r-conta"><span class="num">${R.tutti.length}</span> ${R.tutti.length === 1 ? 'risultato' : 'risultati'} per «${esc(q)}»</p>`;
      return { html: `<div class="r r--2 segno-${S.r}">${conta}${riquadro2(R, nuovi)}</div>`, n: R.tutti.length };
    };
    const schedina = id => {
      if (!id) return `<p class="f-scelta__vuota">${ic('spilli', 18)}<span>Tocca una foto: vedi la tappa e la aggiungi. ${ids().length} tappe sulla mappa.</span></p>`;
      const t = T(id);
      return `<div class="f-scelta__c">${FOTO[id] ? `<img src="${FOTO[id]}" alt="">` : `<span class="f-senza" aria-hidden="true">${esc(t.breve.slice(0, 1))}</span>`}<div class="f-scelta__t"><b>${esc(t.nome)}</b><small>${daDove(id)}${durata(t.durata)} di visita</small>${etich(id)}</div><button type="button" class="f-scelta__piu" data-f="agg" data-id="${id}" aria-label="Aggiungi ${esc(t.breve)} al giorno ${g + 1}">${ic('piu', 18)}Aggiungi</button></div>`;
    };
    const quante = Object.values(D.tappe).filter(t => t.id !== 'regate');
    const testo = `Cerca tra ${quante.filter(t => gruppoDi(t) === 'vedere').length} tappe, ${quante.filter(t => gruppoDi(t) === 'mangiare').length} locali e ${quante.filter(t => gruppoDi(t) === 'gite').length} gite: nomi, opere, piatti, zone`;
    const scelte = `<div class="p-dentro" role="group" aria-label="Prova: scegli il segno della parola trovata"><span aria-hidden="true">Segno</span>${[1, 2, 3, 4].map(k => `<button type="button" data-f="riquadro" data-v="${k}" aria-pressed="${k === S.r}"><span class="vh">Segno </span>${k}</button>`).join('')}</div>`;
    const corpo = `${scelte}<div class="f-cerca f-cerca--a"><label class="vh" for="f-q">Cerca tappe, locali e gite</label>${ic('cerca', 20)}<input id="f-q" type="search" placeholder="Cerca" autocomplete="off" enterkeyhint="search" aria-describedby="f-q-aiuto" aria-controls="f-elenco" value="${esc(q)}"><span class="vh" id="f-q-aiuto">${testo}</span></div>
      <div class="f-vista" role="group" aria-label="Come vedere le tappe"><button type="button" aria-pressed="true" data-fv="elenco">${ic('elenco', 18)}Elenco</button><button type="button" aria-pressed="false" data-fv="mappa">${ic('mappa', 18)}Mappa</button></div>
      <div class="f-filtri" role="group" aria-label="Che tipo di tappa">${FILTRI.map(([k, n]) => `<button type="button" aria-pressed="${k === filtro}" data-filtro="${k}">${n}</button>`).join('')}</div>
      <p class="vh" id="r-voce" aria-live="polite"></p><div id="f-elenco">${risultati().html}</div>
      <div id="f-mappa-box" class="f-mappa-box" hidden><div id="f-mappa" class="f-mappa"></div><div id="f-scelta" class="f-scelta" aria-live="polite">${schedina(null)}</div></div>
      <p class="f-nota">Prova: la ricerca guarda nei nomi, in parole del sito come «panorama» o «pizzeria» e nelle frasi dei nostri testi, che hanno già le fonti. Le parole chiave vere (piano nella specifica, §3) arriveranno con le loro schede.</p>`;
    foglio('Aggiungi una tappa', corpo, f => {
      const input = $('#f-q', f);
      if (!q) input.addEventListener('focus', () => scriviSegnaposto(input, 'Un museo, un\'opera, un piatto…'), { once: true });
      let annuncioT;
      const rifai = (annuncia = true) => {
        const r = risultati();
        $('#f-elenco', f).innerHTML = r.html;
        $$('.r2-fila', f).forEach(x => { x.scrollLeft = 0; });
        ricercaAperta = { q, filtro };
        clearTimeout(annuncioT);
        if (annuncia && r.n != null) annuncioT = setTimeout(() => annunciaR(r.n ? `${r.n} ${r.n === 1 ? 'risultato' : 'risultati'}` : `Niente per ${q}`), 500);
        if (mappaF) { mappaF.punti(ids()); if (scelta && !ids().includes(scelta)) scelta = null; $('#f-scelta', f).innerHTML = schedina(scelta); mappaF.evidenzia(scelta); }
      };
      input.addEventListener('input', e => { q = e.target.value.trim(); rifai(); });
      if (prima) { ricercaAperta = { q, filtro }; requestAnimationFrame(() => { input.focus({ preventScroll: true }); input.setSelectionRange(q.length, q.length); }); }
      const sceglie = id => { scelta = id; $('#f-scelta', f).innerHTML = schedina(id); mappaF?.evidenzia(id); };
      const mostra = v => {
        $$('[data-fv]', f).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.fv === v)));
        $('#f-elenco', f).hidden = v !== 'elenco';
        $('#f-mappa-box', f).hidden = v !== 'mappa';
        if (v === 'mappa' && !mappaF) {
          mappaF = new Mappa($('#f-mappa', f), { punto: id => sceglie(id), tocca: id => apriScheda(id), margini: () => ({ t: 34, r: 30, b: 34, l: 30 }), distanza: 30 });
          mappaF.disegna(G(g), { disegna: false, punti: ids(), n: g + 1 });
          mappaF.mostraTutte(true, false);
          mappaF.inquadra(0, ids().slice(0, 12));
        }
        if (v === 'mappa') requestAnimationFrame(() => $('#f-mappa-box', f).scrollIntoView({ block: 'nearest', behavior: piano() ? 'smooth' : 'auto' }));
      };
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const fv = e.target.closest('[data-fv]');
        if (fv) { mostra(fv.dataset.fv); return; }
        const fb = e.target.closest('[data-filtro]');
        if (fb) { filtro = fb.dataset.filtro; $$('[data-filtro]', f).forEach(x => x.setAttribute('aria-pressed', String(x === fb))); rifai(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        const k = b.dataset.f;
        if (k === 'prova') { q = b.dataset.v; input.value = q; visti = new Set(); rifai(); input.focus({ preventScroll: true }); return; }
        if (k === 'togli-filtri') { filtro = 'tutte'; $$('[data-filtro]', f).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.filtro === 'tutte'))); rifai(); return; }
        if (k === 'riquadro') {
          S.r = +b.dataset.v; history.replaceState(null, '', `#${S.p}${MODO}`); prova();
          $$('[data-f="riquadro"]', f).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
          visti = new Set(); rifai(false); return;
        }
        if (k === 'r3') { scheda3 = b.dataset.v; rifai(false); $(`[data-f="r3"][data-v="${scheda3}"]`, f)?.focus({ preventScroll: true }); return; }
        if (k === 'apri') { schedaFuori(b.dataset.id, { q, filtro }); return; }
        if (k === 'gita') {
          b.closest('li, article')?.querySelector('.r-nota')?.remove();
          b.closest('li, article')?.insertAdjacentHTML('beforeend', `<p class="r-nota" role="status">Le gite prendono un giorno intero: nel sito ${esc(T(b.dataset.id).breve)} diventa il giorno ${nG() + 1}. In questa prova non si aggiunge.</p>`);
          return;
        }
        if (k !== 'agg') return;
        b.classList.add('f-piu--dentro');
        b.innerHTML = b.classList.contains('f-scelta__piu') || b.classList.contains('r3-agg') ? `${ic('spunta', 18)}Aggiunta` : ic('spunta', 20);
        ricercaAperta = null;
        await dopo(piano() ? 420 : 0);
        await chiudiFoglio();
        aggiungi(g, b.dataset.id);
      };
    }, 'f--a');
  }
  // dentro il foglio (finestra modale) la voce per i lettori di schermo deve stare nel foglio
  const annunciaR = testo => { const a = $('#r-voce'); if (!a) return; a.textContent = ''; setTimeout(() => { a.textContent = testo; }, 30); };
  const NOMI_R = { 1: 'l\'inchiostro', 2: 'la pastiglia', 3: 'il tratto di penna', 4: 'il corsivo' };
  const IDEA_R = {
    1: 'La parola trovata nel colore del sito e più marcata, senza niente sotto: il segno più pulito.',
    2: 'La parola trovata dentro una pastiglia di colore tenue, con i bordi tondi, come un\'etichetta: si vede subito anche nel nome.',
    3: 'Sotto la parola trovata un tratto di penna fatto a mano, che si disegna da sinistra quando arrivano i risultati.',
    4: 'La parola trovata in corsivo Bodoni, un po\' più grande, nel colore del sito: come una parola citata in una rivista.'
  };

  // ---------- pause, margini, data (pezzo 1) ----------
  function apriPausa(quale) {
    const g = S.g, tipo = TIPI_PAUSA[quale];
    const corpo = () => {
      const Gx = G(g), p = Gx?.pause.find(x => x.quale === quale);
      if (!p) return `<p>Questa pausa non c'è più.</p><div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Chiudi</button></div>`;
      return `<p class="f-pausa-ora">${ic(tipo.ic, 22)}<span>Dalle <b class="num">${ora(p.inizio)}</b> alle <b class="num">${ora(p.fine)}</b>, dopo ${esc(T(p.dove).breve)}</span></p>
        <fieldset class="f-scelte"><legend>Quanto dura</legend><div>${tipo.scelte.map(m => `<button type="button" aria-pressed="${p.min === m}" data-f="durata" data-v="${m}">${durata(m)}</button>`).join('')}</div></fieldset>
        <fieldset class="f-scelte"><legend>Dopo quale tappa</legend><div>${daFare(Gx).slice(0, -1).map(v => `<button type="button" aria-pressed="${p.dove === v.id}" data-f="dopo" data-v="${v.id}">${esc(T(v.id).breve)}</button>`).join('')}</div></fieldset>
        ${tempo(Gx, 'tempo--f', { bottone: false })}
        <div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Fatto</button><button type="button" class="f-bottone f-bottone--contorno" data-f="togli-pausa">${ic('cestino', 18)}Togli la pausa</button></div>`;
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
          avvisa(`${tipo.nome} tolta dal giorno ${g + 1}. Fine stimata ${ora(G(g).fine)}.`, { testo: 'Annulla', fai: () => aggiorna(() => { S.pause = { ...S.pause, [g]: prima }; if (prima === undefined) delete S.pause[g]; }) });
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
      const mancano = Object.keys(TIPI_PAUSA).filter(q => !TIPI_PAUSA[q].solo && !Gx.pause.some(p => p.quale === q));
      return `${tempo(Gx, 'tempo--f', { bottone: false })}
        <section class="f-sezione"><h3>Pause del giorno ${g + 1}</h3>
          ${Gx.pause.length ? `<ul class="f-pause">${Gx.pause.map(p => `<li><button type="button" class="f-pausa onda" data-f="pausa" data-v="${p.quale}">${ic(TIPI_PAUSA[p.quale].ic, 22)}<span><b>${TIPI_PAUSA[p.quale].nome}, ${durata(p.min)}</b><small class="num">${ora(p.inizio)}–${ora(p.fine)}, dopo ${esc(T(p.dove).breve)}</small></span><span class="f-pausa__cambia">Cambia</span></button></li>`).join('')}</ul>` : '<p class="f-nota">Nessuna pausa: la giornata va da una tappa all\'altra.</p>'}
          ${mancano.length && daFare(Gx).length > 1 ? `<div class="f-chips">${mancano.map(q => `<button type="button" class="f-chip" data-f="nuova-pausa" data-v="${q}">${ic('piu', 16)}${TIPI_PAUSA[q].nome}</button>`).join('')}</div>` : ''}
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
        if (k === 'margine') aggiorna(() => { S.margine = +v; });
        rinfresca(f, corpo(), k === 'nuova-pausa' ? { dataset: { f: 'pausa', v } } : b);
      };
    }, 'f--tempo');
  }
  function quando() {
    const vivo = () => `${S.data ? `<ul class="f-date">${range(nG()).map(g => { const ch = chiuseDi(g); return `<li><b>Giorno ${g + 1}</b><span>${dataLunga(g)}</span>${ch.length ? `<span class="f-et f-et--attenzione">Chiuso: ${ch.map(id => esc(T(id).breve)).join(', ')}</span>` : '<span class="f-et">Tutto aperto</span>'}</li>`; }).join('')}</ul>` : ''}
      <div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Fatto</button>${S.data ? '<button type="button" class="f-bottone f-bottone--contorno" data-f="senza">Torna senza data</button>' : ''}</div>`;
    foglio('Data e orari', `<p>Con la data vedi quali tappe sono chiuse proprio quel giorno. Senza data i giorni di chiusura restano nella scheda di ogni tappa.</p>
      <label class="f-campo" for="f-data"><span>Primo giorno</span><input id="f-data" type="date" min="${OGGI}" value="${S.data ?? ''}"></label>
      <div id="f-vivo">${vivo()}</div>
      <p class="f-nota">Prova: se il primo giorno è oggi e accendi «oggi» (pannello Idea), gli orari del giorno 1 si ricalcolano dalle 12:10 ogni volta che segni una tappa visitata.</p>`, f => {
      f.onchange = e => {
        if (e.target.id !== 'f-data') return;
        aggiorna(() => { S.data = e.target.value || null; if (S.data !== OGGI) S.oggi = false; });
        rinfresca(f, vivo());
        e.target.focus({ preventScroll: true });
      };
      f.onclick = e => {
        if (e.target === f) { chiudiFoglio(); return; }
        const b = e.target.closest('[data-f]');
        if (!b) return;
        if (b.dataset.f === 'fatto') chiudiFoglio();
        if (b.dataset.f === 'senza') { aggiorna(() => { S.data = null; S.oggi = false; }); $('#f-data', f).value = ''; rinfresca(f, vivo()); $('#f-data', f).focus(); }
      };
    }, 'f--quando');
  }

  // ---------- «Salva» (C il segnaposto con l'onda, D il timbro), «Elimina», «I miei itinerari», «Condividi», «Altro» ----------
  const spilloSalva = `<svg class="salva__ic salva__ic--spillo" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="spillo-clip"><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z"/></clipPath></defs><g clip-path="url(#spillo-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle class="salva__buco" cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  const bottoneSalva = (cl = '') => {
    const v = S.p;
    return `<button type="button" class="salva salva--${v} ${cl}${S.salvato ? ' salva--fatto' : ''}" data-azione="salva">${v === 'c' ? spilloSalva : segnalibro}<span class="salva__t"><span class="salva__a">Salva</span><span class="salva__b">Salvato</span></span>${v === 'c' ? '<i class="salva__onda" aria-hidden="true"></i>' : '<i class="salva__inchiostro" aria-hidden="true"></i>'}</button>`;
  };
  function salva(b) {
    if (S.salvato) { apriMiei(); return; }
    S.salvato = true;
    ricorda();
    $$('.salva').forEach(x => x.classList.add('salva--fatto'));
    if (b?.classList.contains('salva')) { b.classList.remove('salva--ora'); void b.offsetWidth; b.classList.add('salva--ora'); }
    $$('[data-stato]').forEach(x => { x.dataset.stato = 'salvato'; x.querySelector('.stato__t').textContent = 'Salvato in «I miei itinerari»'; });
    setTimeout(() => { aggiorna(() => {}, { ridisegnaScheda: true }); avvisa('Salvato. Adesso puoi segnare le tappe visitate.', { testo: 'Vedi', fai: apriMiei }); }, piano() ? 700 : 0);
  }
  const stato = () => `<span class="stato" data-stato="${S.salvato ? 'salvato' : 'bozza'}"><i aria-hidden="true"></i><span class="stato__t">${S.salvato ? 'Salvato in «I miei itinerari»' : 'Non ancora salvato'}</span></span>`;
  function chiediElimina() {
    foglio('Eliminare l\'itinerario?', `<p>«${esc(S.nome)}» sparisce da questo telefono, ${S.salvato ? 'anche da «I miei itinerari», con le tappe visitate' : 'con le tappe che hai aggiunto'}. I link che hai già mandato continuano ad aprirsi: portano tutto con sé.</p>
      <div class="f-conferma"><button type="button" class="f-bottone f-bottone--pericolo" data-f="si">${ic('cestino', 20)}Elimina «${esc(S.nome)}»</button><button type="button" class="f-bottone f-bottone--contorno" data-f="no">Annulla</button></div>`, f => {
      f.onclick = async e => {
        if (e.target === f || e.target.closest('[data-f="no"]')) { chiudiFoglio(); return; }
        if (!e.target.closest('[data-f="si"]')) return;
        await chiudiFoglio();
        const prima = { salvato: S.salvato, nome: S.nome };
        aggiornaTutto(() => { S.eliminato = true; S.salvato = false; dimentica(); }, { pagina: true });
        avvisa('Itinerario eliminato.', { testo: 'Annulla', fai: () => aggiornaTutto(() => { Object.assign(S, { eliminato: false, ...prima }); }, { pagina: true }) });
      };
    }, 'f--conferma');
  }
  const paginaEliminata = cl => `<section class="eliminato ${cl}" aria-labelledby="el-t">${firma()}<h1 id="el-t">Itinerario eliminato</h1><p>«${esc(S.nome)}» non c'è più su questo telefono.</p>
    <div class="eliminato__azioni"><button type="button" class="f-bottone" data-azione="ripristina">Rimettilo com'era</button><button type="button" class="f-bottone f-bottone--contorno" data-azione="ricomincia">Ricomincia da «Due giorni a Napoli»</button></div></section>`;
  const contaVisitate = () => { const tutte = S.giorni.flat(); return { si: tutte.filter(visitata).length, n: tutte.length }; };
  function apriMiei() {
    let menu = false, rinomina = false;
    const vivo = () => { const cv = contaVisitate(); return `<div class="f-lista"><div class="f-riga f-riga--mio">${FOTO['monte-echia'] ? `<img src="${FOTO['monte-echia']}" alt="">` : ''}
        <div class="f-mio">${rinomina ? `<label class="f-campo f-campo--nome" for="f-nome"><span>Nome dell'itinerario</span><input id="f-nome" value="${esc(S.nome)}" maxlength="60" autocomplete="off" enterkeyhint="done"></label>` : `<b>${esc(S.nome)}</b>`}<small>${nG()} giorni, ${cv.n} tappe${S.salvato ? `, ${cv.si} visitate su ${cv.n}` : ''}</small><span class="f-segno">${S.salvato ? `${ic('spunta', 16)}Salvato` : 'Non ancora salvato'}</span></div>
        ${rinomina ? '' : `<button type="button" class="f-icona onda" data-f="menu" aria-expanded="${menu}" aria-controls="f-mio-azioni" aria-label="Altre azioni per «${esc(S.nome)}»">${ic('altro', 20)}</button>`}</div>
      ${rinomina
        ? '<div class="f-conferma f-conferma--due"><button type="button" class="f-bottone" data-f="nome-ok">Salva il nome</button><button type="button" class="f-bottone f-bottone--contorno" data-f="nome-no">Annulla</button></div>'
        : `<div class="f-mio-azioni" id="f-mio-azioni"${menu ? '' : ' hidden'}><button type="button" class="f-azione" data-f="rinomina">${ic('matita')}<span>Rinomina</span></button><button type="button" class="f-azione" data-f="condividi">${ic('condividi')}<span>Condividi</span></button><button type="button" class="f-azione f-azione--pericolo" data-f="elimina">${ic('cestino')}<span>Elimina</span></button></div>`}</div>
      ${S.salvato ? '' : `<button type="button" class="f-bottone" data-f="salva">Salva questo itinerario</button>`}
      <p class="f-nota">Gli itinerari restano su questo telefono, anche se chiudi la pagina: niente account, niente iscrizione. Le tappe visitate non vanno nel link condiviso.</p>`; };
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
  const link = () => `https://nextstop-alpha.vercel.app/napoli/itinerari/#${K.codifica({ ...itin(), nome: S.nome })}`;
  function apriCondividi() {
    const l = link();
    foglio('Condividi', `<p>Chi apre il link vede lo stesso itinerario: gli stessi giorni, le stesse tappe, gli stessi orari. Le tappe che hai visitato restano solo su questo telefono.</p>
      <div class="f-link"><label class="vh" for="f-link">Link dell'itinerario</label><input id="f-link" readonly value="${esc(l)}"><button type="button" class="f-bottone" data-f="copia">${ic('copia', 20)}Copia</button></div>
      <p class="f-nota">Il link porta tutto dopo il «#»: non passa da nessun server.</p>`, f => {
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        if (!e.target.closest('[data-f="copia"]')) return;
        try { await navigator.clipboard.writeText(l); avvisa('Link copiato.'); } catch { const i = $('#f-link', f); i.focus(); i.select(); avvisa('Tieni premuto sul link e scegli «Copia».'); }
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
    if (nG() >= 3) { avvisa('Nella prova si arriva a 3 giorni (sul sito fino a 7).'); return; }
    aggiorna(() => { S.giorni = [...S.giorni, []]; S.g = nG() - 1; }, { giorno: true });
    avvisa(`Aggiunto il giorno ${nG()}: sulla mappa vedi tutte le tappe della città.`, { testo: 'Annulla', fai: () => aggiorna(() => { if (!S.giorni[nG() - 1].length) S.giorni = S.giorni.slice(0, -1); S.g = Math.min(S.g, nG() - 1); }, { giorno: true }) });
  }

  // =====================================================================================
  // Cambiare giorno senza scatti (pezzo 1, giro 5): il giorno che lasci continua il gesto ed esce, il nuovo entra dall'altro lato.
  // =====================================================================================
  let occupato = false;
  async function scorri(el, dir, daX, cambia, nuovo = () => el, poi = () => {}, prepara = null) {
    if (!el || !piano()) { cambia(prepara?.()); const n = nuovo(); if (n) { n.style.translate = ''; n.style.opacity = ''; } poi(); return; }
    occupato = true;
    try {
      const W = el.getBoundingClientRect().width || innerWidth;
      const op = parseFloat(el.style.opacity || '1');
      el.style.translate = ''; el.style.opacity = '';
      const restoX = 1 - Math.min(1, Math.abs(daX) / (W * .5));
      const fuori = el.animate([{ translate: `${daX}px 0`, opacity: op }, { translate: `${-dir * W * .3}px 0`, opacity: 0 }], { duration: 120 + 120 * restoX, easing: 'cubic-bezier(.4, 0, .9, .4)', fill: 'forwards' });
      // la pagina nuova (HTML) si costruisce mentre la vecchia esce: l'uscita è un'animazione di posizione e trasparenza
      // che il telefono muove da solo; alla fine si cambia solo l'HTML
      let pronto;
      try { pronto = prepara?.(); } catch {}
      try { await fuori.finished; } catch {}
      try { cambia(pronto); } finally {
        const n = nuovo() || el;
        const dentro = n.animate([{ translate: `${dir * W * .22}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.16, 1, .3, 1)' });
        fuori.cancel();
        try { await dentro.finished; } catch {}
      }
    } finally { occupato = false; }
    poi();
  }
  function allInizio(el, barra = null) {
    if (!el) return;
    const sopra = barra ? barra.offsetHeight + (parseFloat(getComputedStyle(barra).top) || 0) : parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const y = Math.round(el.getBoundingClientRect().top + scrollY - sopra);
    if (scrollY > y + 1) scrollTo({ top: y, behavior: 'instant' });
  }
  function vaiAlGiorno(g, daX = 0) {
    if (g < 0 || g >= nG() || g === S.g || occupato) return false;
    S.nuova = null; S.aperta = null;
    chiudiSchede();
    P[S.p].giorno(g, daX);
    return true;
  }
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
  const larghezze = new WeakMap();
  const roSchede = new ResizeObserver(es => es.forEach(e => { const w = Math.round(e.contentRect.width); if (larghezze.get(e.target) !== w) { const prima = larghezze.has(e.target); larghezze.set(e.target, w); if (prima) mettiSegno(e.target, { anima: false }); } }));
  const osservaSchede = () => $$('.schede').forEach(b => { roSchede.observe(b); });
  // sfogliare i giorni: dito, mouse, due dita sul touchpad. Non parte dalle tappe che si scorrono (2) né dalle maniglie.
  function sfoglia(area, mobile = () => area) {
    if (!area) return;
    let p0 = null, dir = null, tolto = false, x = 0, el = null;
    area.addEventListener('pointerdown', e => {
      if ((e.pointerType === 'mouse' && e.button !== 0) || occupato || trascinando || e.target.closest('.m, input, .f-filtri, [role="tablist"], .c-giu, [data-maniglia], [data-scorre], [data-preme], .riga-aperta')) return;
      p0 = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }; dir = null; x = 0; el = null;
    });
    area.addEventListener('pointermove', e => {
      if (!p0 || e.pointerId !== p0.id || trascinando) return;
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
    let somma = 0, pausa = 0;
    area.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || e.target.closest('.m')) return;
      e.preventDefault();
      if (performance.now() < pausa) return;
      somma += e.deltaX;
      if (Math.abs(somma) > 80) { vaiAlGiorno(S.g + (somma > 0 ? 1 : -1)); somma = 0; pausa = performance.now() + 800; }
    }, { passive: false });
  }
  function entra(el, dir = 1) {
    if (!el || !piano()) return;
    const W = el.getBoundingClientRect().width || innerWidth;
    el.animate([{ translate: `${dir * W * .22}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 430, easing: 'cubic-bezier(.16, 1, .3, 1)' });
  }
  // una lista che cambia (riga aperta, tappa spostata o tolta): ogni pezzo scivola dal posto di prima al nuovo (FLIP)
  function foto(lista) { const m = new Map(); $$(':scope > [data-chiave]', lista).forEach(el => m.set(el.dataset.chiave, el.getBoundingClientRect().top)); return m; }
  function scivola(lista, prima, salta = null) {
    if (!piano() || !prima) return;
    $$(':scope > [data-chiave]', lista).forEach(el => {
      if (el.dataset.chiave === salta) return;
      const t0 = prima.get(el.dataset.chiave);
      const dy = t0 == null ? null : t0 - el.getBoundingClientRect().top;
      if (dy == null) el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)', delay: 80 });
      else if (Math.abs(dy) > 1) el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
  }

  // =====================================================================================
  // Disegno della pagina
  // =====================================================================================
  let mappa = null, mappaD = null;
  let rotta = true;
  let ascolti = [];
  function ascolta(tipo, fn) { let raf = 0; const h = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); }; addEventListener(tipo, h, { passive: true }); ascolti.push([tipo, h]); }
  const smettiAscolti = () => { ascolti.forEach(([t, h]) => removeEventListener(t, h)); ascolti = []; };
  function disegna() {
    const r = document.documentElement;
    r.classList.remove('pc', 'pd', 'q1', 'q2', 'q3', 'q4', 'c-giu-su', 'in-modifica');
    r.classList.add('p' + S.p, 'q' + S.q);
    r.classList.toggle('in-modifica', S.modifica);
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
    if (S.q === 2) suggerisciScorrimento();
  }
  function aggiornaTutto(fn, { giorno = false, pagina = false } = {}) {
    const segno = segnoOra(), primaG = S.g;
    const fai = () => {
      fn();
      if (giorno) rotta = true;
      disegna();
      if (segno) mettiSegno($('.schede'), { da: segno });
      if (giorno) { const corpo = $('[data-inizio-giorno]'); allInizio(corpo, S.p === 'd' ? $('.d-indice') : null); entra($('.giorno-corpo'), S.g >= primaG ? 1 : -1); }
      if (S.nuova) { const el = $(`.giorno-attivo [data-v-id="${S.nuova}"]`); if (el && !computer.matches) { const r = el.getBoundingClientRect(); if (r.top > innerHeight - 140 || r.bottom < 120) el.scrollIntoView({ block: 'center', behavior: piano() ? 'smooth' : 'auto' }); } }
    };
    if (pagina && document.startViewTransition && piano()) { const vt = document.startViewTransition(fai); vt.ready.catch(() => {}); vt.finished.catch(() => {}); } else fai();
  }
  // cambia lo stato e ridisegna il giorno (lo fa la vista: C solo il foglio, D la pagina); la scheda aperta si aggiorna
  function aggiorna(fn, opz = {}) {
    P[S.p].aggiorna(fn, opz);
    aggiornaCammino();
    if (sch && schEl.open) Q[sch.q].rinfresca?.();
  }

  const AZ = {
    giorno: b => vaiAlGiorno(+b.dataset.g),
    'nuovo-giorno': nuovoGiorno,
    'togli-giorno': () => aggiorna(() => { S.giorni = S.giorni.filter((_, k) => k !== S.g); S.g = Math.max(0, S.g - 1); }, { giorno: true }),
    aggiungi: () => apriAggiungi(),
    'aggiungi-subito': b => aggiungi(S.g, b.dataset.id),
    'aggiungi-qui': async b => { await chiudiSchede(); await chiudiFoglio(); aggiungi(S.g, b.dataset.id); },
    salva: b => salva(b),
    tempo: apriTempo,
    pausa: b => apriPausa(b.dataset.quale),
    miei: apriMiei, condividi: apriCondividi, altro: apriAltro, quando, giorni: apriGiorni, elimina: chiediElimina,
    ripristina: () => aggiornaTutto(() => { S.eliminato = false; }, { pagina: true }),
    ricomincia: () => aggiornaTutto(() => { Object.assign(S, { ...NUOVO(), giorni: PRONTO(), fatte: {}, eliminato: false, salvato: true, nome: D.nome, p: S.p, q: S.q }); }, { pagina: true }),
    menu: () => avvisa('Prova: qui si apre il menu del sito, quello di oggi.'),
    tappa: b => { if (trascinando || scorsa) return; P[S.p].tocca(b.dataset.id, b); },
    visitata: b => segna(b.dataset.id, b),
    togli: b => togliTappa(b.dataset.id),
    'sposta-giorno': b => spostaGiorno(b.dataset.id, +b.dataset.g),
    modifica: () => modifica(true),
    'modifica-fine': () => modifica(false),
    'menu-tappa': b => apriMenuTappa(b),
    'chiudi-riga': () => apriRiga(null),
    'sposta-su': b => { const id = b.dataset.id; spostaA(id, S.giorni[giornoDi(id)].indexOf(id) - 1); requestAnimationFrame(() => $(`[data-azione="sposta-su"][data-id="${id}"]`)?.focus()); },
    'sposta-giu': b => { const id = b.dataset.id; spostaA(id, S.giorni[giornoDi(id)].indexOf(id) + 1); requestAnimationFrame(() => $(`[data-azione="sposta-giu"][data-id="${id}"]`)?.focus()); },
    'sposta-apri': b => { const box = b.closest('.riga-aperta').querySelector('.ra-sposta'); const si = box.hidden; box.hidden = !si; b.setAttribute('aria-expanded', String(si)); if (si) $('button', box)?.focus(); },
    pronto: () => avvisa('Prova: qui si aprirebbe un altro itinerario.'),
    'pasto-apri': b => { const m = trovaM(b.dataset.k); if (m) apriPasto(m); },
    'pasto-scheda': b => { const m = trovaM(b.dataset.k); if (!m) return; const l = vicini(m).filter(x => x.stato !== 'chiuso'); ordineLocali = (PM === 4 ? [...l].sort((a, c) => a.dev - c.dev || a.min - c.min) : l).map(x => x.id); schedaPasto(b.dataset.id, m, null); },
    'pasto-no': b => { const m = trovaM(b.dataset.k); if (m) noGrazie(m); },
    'pasto-si': b => { const k = b.dataset.k; aggiorna(() => { const x = { ...S.noGrazie }; delete x[k]; S.noGrazie = x; }); annuncia('Proposte rimesse'); }
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
  $('#app').addEventListener('pointerdown', e => {
    const b = e.target.closest('.onda');
    if (b && piano()) {
      const r = b.getBoundingClientRect(), o = document.createElement('i');
      o.className = 'onda__i';
      o.style.left = `${e.clientX - r.left}px`; o.style.top = `${e.clientY - r.top}px`;
      b.append(o);
      setTimeout(() => o.remove(), 700);
    }
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // proposta 2: scorrere la riga (o tenerla premuta per spostarla); proposta 4: tenere premuta per spostarla
    const v = e.target.closest('[data-scorre]');
    if (v && !e.target.closest('[data-maniglia]') && !trascinando) { scorriRiga(v, e); return; }
    const p = e.target.closest('[data-preme]');
    if (p && !e.target.closest('[data-maniglia], [data-azione="visitata"], [data-azione="menu-tappa"]') && !trascinando) tieniPremuto(p, e, p);
  });
  // dopo un trascinamento non si apre la scheda
  $('#app').addEventListener('click', e => { if ((trascinando || scorsa) && e.target.closest('[data-azione="tappa"]')) { e.stopPropagation(); e.preventDefault(); } }, true);
  $('#app').addEventListener('contextmenu', e => { if (e.target.closest('[data-scorre], [data-preme]')) e.preventDefault(); });
  // con il mouse, trascinare sopra una foto avviava il trascinamento dell'immagine del browser e interrompeva il gesto
  document.addEventListener('dragstart', e => { if (e.target.closest?.('#app, #scheda, #foglio')) e.preventDefault(); });

  const vuoto = (cl, bott) => `<div class="${cl}"><p>Il giorno ${S.g + 1} è vuoto. Aggiungi la prima tappa, oppure parti da un itinerario pronto. Sulla mappa vedi tutte le tappe della città.</p><button type="button" class="${bott}" data-azione="aggiungi">${ic('piu', 20)}Aggiungi una tappa</button>
    <ul>${D.altri.map(a => `<li><button type="button" data-azione="pronto"><span>${esc(a.nome)}</span><small>${a.giorni === 1 ? '1 giorno' : `${a.giorni} giorni`}, ${a.tappe} tappe</small></button></li>`).join('')}</ul>
    <button type="button" class="${bott} ${bott}--contorno" data-azione="togli-giorno">Togli il giorno ${S.g + 1}</button></div>`;
  // gli avvisi chiusi con la X: tornano solo se la giornata cambia (un'altra ora di fine, un'altra tappa lontana)
  const viaAvvisi = new Set();
  const liberoBlocco = (Gx, cl, g = S.g) => {
    const l = Gx.resta, sug = suggerite(g);
    if (l <= 0) { const av = avvisiGiorno(Gx), k = `${g}|${av.join('|')}`; return av.length && !viaAvvisi.has(k) ? `<div class="${cl} ${cl}--attenzione avviso-giorno" role="status">${ic('attenzione', 20)}<p>${av.join(' ')}</p><button type="button" class="avviso-via" data-azione="via-avviso" data-chiave="${esc(k)}" aria-label="Chiudi l'avviso">${ic('x', 18)}</button></div>` : ''; }
    return `<div class="${cl}"><p class="${cl}__tit">${resta(l)} prima delle ${ora(Gx.fineScelta)}.</p>
      ${sug.length ? `<p class="${cl}__sotto">Le più vicine a ${esc(T(daFare(Gx).slice(-1)[0]?.id ?? ultimaDi(g)).breve)}:</p><ul class="${cl}__sug">${sug.map(c => `<li><button type="button" class="sug onda" data-azione="aggiungi-subito" data-id="${c.id}">${FOTO[c.id] ? `<img src="${FOTO[c.id]}" alt="" loading="lazy" decoding="async">` : '<span class="sug__senza"></span>'}<span><b>${esc(T(c.id).breve)}</b><small><span class="num">${c.tratto?.min ?? 0} min</span> a piedi, ${durata(T(c.id).durata)}</small></span><span class="sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>` : ''}
      <button type="button" class="${cl}__tutte onda" data-azione="aggiungi">Vedi tutte le tappe</button></div>`;
  };
  const altreLinee = () => range(nG()).map(g => G(g)).filter(Boolean).map(X => ({ G: X, col: 'var(--ink2)' }));
  const opzMappa = extra => ({ punto: id => apriScheda(id), tutte: Gx => S.tutte || !Gx, cambiaTutte: si => { S.tutte = si; }, ...extra });

  // ---------- il consiglio dell'ordine più corto: compare se le tappe da fare (almeno 3) si possono mettere in un ordine con
  // almeno 5 minuti di spostamenti in meno (ordinePiuCorto del sito, la prima tappa resta la stessa). «Lascia così» lo toglie per
  // quell'ordine; se l'ordine cambia di nuovo, il consiglio torna. ----------
  const memoOrdine = new Map();
  function ordineCorto(g) {
    const l = S.giorni[g] || [], fatte = vivoOggi(g) ? fatteDi(l) : [], resto = l.filter(id => !fatte.includes(id));
    if (resto.length < 3) return null;
    const chiave = JSON.stringify([g, resto, S.data]);
    if (!memoOrdine.has(chiave)) {
      const giorni = S.giorni.map((x, k) => (k === g ? resto : x));
      memoOrdine.set(chiave, K.ordinePiuCorto(CITTA, itin(giorni), g));
    }
    const o = memoOrdine.get(chiave);
    return o && S.ordineOk[g] !== JSON.stringify(l) ? { ...o, fatte } : null;
  }
  const consiglio = (g = S.g, cl = '') => {
    const o = ordineCorto(g);
    if (!o) return '';
    return `<div class="consiglio ${cl}" role="status"><p class="consiglio__t">${ic('sposta', 20)}<span>C'è un ordine più corto</span></p><p class="consiglio__p">Cambiando l'ordine risparmi <b>${durataLunga(o.risparmio)}</b> a piedi. La prima tappa resta la stessa.</p><div class="consiglio__az"><button type="button" class="consiglio__si onda" data-azione="ordina">Usa questo ordine</button><button type="button" class="consiglio__no onda" data-azione="ordine-ok">Lascia così</button></div></div>`;
  };
  AZ.ordina = () => {
    const g = S.g, o = ordineCorto(g);
    if (!o) return;
    const prima = [...S.giorni[g]];
    aggiorna(() => { S.giorni[g] = [...o.fatte, ...o.ordine]; });
    avvisa(`Ordine cambiato: ${durataLunga(o.risparmio)} a piedi in meno.`, { testo: 'Annulla', fai: () => aggiorna(() => { S.giorni[g] = prima; S.ordineOk = { ...S.ordineOk, [g]: JSON.stringify(prima) }; }) });
  };
  // la X dell'avviso: il triangolo si richiude, il riquadro scivola via a destra, poi lo spazio si chiude
  AZ['via-avviso'] = async b => {
    const el = b.closest('.avviso-giorno');
    viaAvvisi.add(b.dataset.chiave);
    if (piano()) {
      el.classList.add('avviso-giorno--via');
      await el.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(40px)', opacity: 0 }], { duration: 260, delay: 140, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }).finished.catch(() => {});
      const h = el.offsetHeight, cs = getComputedStyle(el);
      await el.animate([{ height: h + 'px', marginTop: cs.marginTop, marginBottom: cs.marginBottom, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom }, { height: '0px', marginTop: '0px', marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px' }], { duration: 240, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }).finished.catch(() => {});
    }
    const dopoEl = el.closest('#app')?.querySelector('[data-azione="aggiungi"]');
    el.remove();
    annuncia('Avviso chiuso');
    dopoEl?.focus({ preventScroll: true });
  };
  AZ['ordine-ok'] = () => { const g = S.g; aggiorna(() => { S.ordineOk = { ...S.ordineOk, [g]: JSON.stringify(S.giorni[g]) }; }); annuncia('Ordine lasciato così'); };

  // ---------- la strada fatta (proposta 4): «Visitate 2 di 7», con un pezzo per tappa ----------
  const cammino = (Gx, cl = '') => {
    if (S.q !== 4 || !Gx || !puoiSegnare()) return '';
    const t = tappe(Gx), si = t.filter(v => visitata(v.id)).length;
    return `<div class="cammino ${cl}" data-cammino><p class="cammino__t"><b class="num" data-cifra="fatte" data-n="${si}">${si}</b> <span>di ${t.length} visitate</span>${Gx.vivo ? `<small>orari da adesso, ${ora(ORA_FINTA)}</small>` : ''}</p><div class="cammino__pezzi" role="img" aria-label="${si} tappe visitate su ${t.length}">${t.map(v => `<i data-v-id="${v.id}"${visitata(v.id) ? ' data-visitata' : ''}></i>`).join('')}</div></div>`;
  };
  function aggiornaCammino() {
    const box = $('.giorno-attivo [data-cammino]') || $('[data-cammino]');
    if (!box) return;
    const Gx = G(S.g);
    if (!Gx) return;
    const t = tappe(Gx), si = t.filter(v => visitata(v.id)).length, n = $('[data-cifra="fatte"]', box);
    if (n) { n.dataset.n = si; contaCifre(); }
    $('.cammino__pezzi', box)?.setAttribute('aria-label', `${si} tappe visitate su ${t.length}`);
    $$('.cammino__t span', box).forEach(x => { x.textContent = `di ${t.length} visitate`; });
    // le orme e i tratti prima di una tappa visitata: «fatti»
    $$('.giorno-attivo [data-verso]').forEach(x => x.toggleAttribute('data-fatto', visitata(x.dataset.verso)));
  }

  // =====================================================================================
  // C · MAPPA PRIMA (pezzo 1): la mappa è la pagina; il foglio con i giorni sale. Pezzo 2: le righe delle tappe cambiano
  // con la proposta (soglia, maniglia, scorrere, «⋯»).
  // =====================================================================================
  const nVoce = (v, cl) => `<span class="${cl}" aria-hidden="true"><b>${v.n}</b><i class="sg-si">${soglia()}</i></span>`;
  // il segno «visitata» piccolo, nelle righe (proposte 1 e 4): la porta con il numero; toccandola si chiude
  const segnoV = (v, cl = 'sv') => `<button type="button" class="${cl}" data-azione="visitata" data-id="${v.id}" aria-pressed="${visitata(v.id)}">${soglia()}<svg class="sv__pin" viewBox="0 0 20 29" aria-hidden="true" focusable="false">${D.marchio.spillo}</svg><span class="vh">Visitata: ${esc(T(v.id).breve)}, tappa </span><span class="sv__n">${v.n}</span></button>`;
  function rigaC(v, k) {
    const t = T(v.id), q = S.q, ed = S.modifica && q === 3, vis = visitata(v.id);
    const quando = v.fatta ? '<span class="c-ora c-ora--v">Visitata</span>' : `<span class="c-ora num">${ora(v.inizio)} – ${ora(v.fine)}</span>`;
    const et = !ed && etichette(v.id).length ? `<small class="c-et">${etichette(v.id).join(', ')}</small>` : '';
    const foto = FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy" decoding="async">` : T(v.id).categoria ? `<span class="c-voce__senza c-voce__cibo">${ic("posate", 26)}</span>` : `<span class="c-voce__senza">${soglia()}</span>`;
    const sigillo = q === 2 || q === 3 ? `<i class="c-sigillo sg-si" aria-hidden="true">${soglia()}</i>` : '';
    const sr = vis ? '<span class="vh">, visitata</span>' : '';
    const apri = `<button type="button" class="c-voce__apri" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="c-tit">${quando}<span class="c-voce__nome">${esc(t.nome)}${sr}</span>${et}</span><span class="c-voce__foto">${foto}${sigillo}</span></button>`;
    let sinistra, destra = '';
    if (ed) { sinistra = `<button type="button" class="meno" data-azione="togli" data-id="${v.id}" aria-label="Togli ${esc(t.breve)}">${ic('meno', 20)}</button>`; destra = maniglia(v.id); }
    else if ((q === 1 || q === 4) && puoiSegnare()) sinistra = segnoV(v);
    else sinistra = nVoce(v, 'c-n2');
    if (!ed && q === 1) destra = maniglia(v.id);
    if (!ed && q === 4) destra = `<button type="button" class="c-altro onda" data-azione="menu-tappa" data-id="${v.id}" aria-haspopup="true" aria-expanded="false" aria-label="Azioni per ${esc(t.breve)}">${ic('altro', 20)}</button>`;
    const attr = `data-chiave="${v.id}" data-v-id="${v.id}"${vis ? ' data-visitata' : ''}${v.fatta ? '' : ' data-trascina'} data-id="${v.id}"${q === 2 && !v.fatta ? ' data-scorre' : ''}${q === 4 && !v.fatta ? ' data-preme' : ''}`;
    if (q === 2) return `<li class="c-voce${v.id === S.nuova ? ' nuova' : ''}" style="--i:${k}" ${attr}>${sottoRiga(v.id)}<div class="riga-pelle">${sinistra}${apri}</div></li>`;
    return `<li class="c-voce${v.id === S.nuova ? ' nuova' : ''}${ed ? ' c-voce--modifica' : ''}" style="--i:${k}" ${attr}>${sinistra}${apri}${destra}</li>`;
  }
  // sotto la riga che scorre (2): a sinistra «Visitata», a destra «Togli»
  const sottoRiga = id => `<div class="riga-sotto" aria-hidden="true"><span class="riga-sotto__v">${soglia()}<b class="rs-no">Visitata</b><b class="rs-si">Da visitare</b></span><span class="riga-sotto__t">${ic('cestino', 22)}<b>Togli</b></span></div>`;
  const C = {
    nome: 'Mappa prima',
    html() {
      return `<div class="c-mappa" id="c-mappa"><div id="mappa"></div></div>
      <header class="c-sopra"><button type="button" class="tondo onda" data-azione="menu" aria-label="Apri il menu">${ic('menu')}</button><div class="c-nome">${firma('firma--solo-segno')}<div><h1 data-nome>${esc(S.nome)}</h1>${stato()}</div></div>${bottoneSalva('c-salva onda')}</header>
      <div class="c-spazio" aria-hidden="true"></div>
      <section class="c-foglio" id="c-foglio" aria-label="Giornata"><span class="c-maniglia" aria-hidden="true"></span>
        <div class="c-giorni" id="c-giorni">${this.giorni()}</div>
        <div class="c-dentro giorno-corpo giorno-attivo" id="c-dentro" data-inizio-giorno>${this.corpo(true)}</div>
        ${crediti()}
        <div class="c-giu" id="c-giu" data-nascosto="true"><nav class="c-giu__barra" aria-label="Comandi dell'itinerario">
          <button type="button" class="c-giu__mappa onda" data-azione="su-mappa">${ic('mappa', 20)}<span>Mappa</span></button>
          <button type="button" class="c-giu__piu onda" data-azione="aggiungi">${ic('piu', 20)}<span>Aggiungi</span></button>
          <button type="button" class="c-giu__altro onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi, Pause e margini, Elimina">${ic('altro')}</button></nav></div>
      </section>${S.modifica ? barraModifica() : ''}`;
    },
    giorni() { return `<div class="c-pista" style="--n:${nG()}">${schede('c')}<button type="button" class="c-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button></div>`; },
    elenco(Gx) {
      let i = 0;
      const voci = sequenzaM(Gx, S.g);
      const prima = Gx.vivo && tappe(Gx).some(v => v.fatta) ? `<li class="c-adesso" data-chiave="adesso"><span>${ic('orologio', 16)}Da adesso, ${ora(ORA_FINTA)}: orari ricalcolati</span></li>` : '';
      const righe = voci.map((v, k) => {
        if (v.tipo === 'tratto') { const dopo = voci.slice(k + 1).find(x => x.tipo === 'tappa'); return `<li class="c-tratto" data-chiave="t-${dopo?.id}" data-verso="${dopo?.id ?? ''}"${dopo && visitata(dopo.id) ? ' data-fatto' : ''} style="--i:${i++}"><i aria-hidden="true"></i><span>${ic('piedi', 15)}${testoTratto(v)}</span></li>`; }
        if (v.tipo === 'pasto') return rigaPasto(v.m, 'c').replace('class="c-pasto', `style="--i:${i++}" class="c-pasto`);
        if (v.tipo === 'pausa') return `<li class="c-riga c-pausa" data-chiave="p-${v.quale}" style="--i:${i++}"><button type="button" data-azione="pausa" data-quale="${v.quale}"><span class="c-n c-n--pausa">${ic(TIPI_PAUSA[v.quale].ic, 17)}</span><span class="c-tit"><span class="c-ora num">${ora(v.inizio)} – ${ora(v.fine)}</span>${TIPI_PAUSA[v.quale].nome}<small class="c-pausa__d">${durataLunga(v.min)}: tocca per cambiarla</small></span><span></span></button></li>`;
        if (S.q === 2 && S.aperta === v.id) return rigaAperta(v, i++);
        const html = rigaC(v, i++);
        return v.fatta && voci[k + 1] && !(voci[k + 1].tipo === 'tappa' && voci[k + 1].fatta) ? html + prima : html;
      }).join('');
      return `<ol class="c-elenco${S.modifica && S.q === 3 ? ' in-modifica-lista' : ''}">${righe}</ol>`;
    },
    corpo(anima = false) {
      const Gx = G(S.g);
      const modificaB = Gx && S.q === 3 && !S.modifica ? `<button type="button" class="c-modifica onda" data-azione="modifica">${ic('matita', 18)}Modifica il giorno</button>` : '';
      return `<div class="c-testa">${Gx ? cifre(Gx, 'cifre c-cifre') + tempo(Gx, 'tempo--c') : ''}
          <div class="c-riga-azioni"><p class="c-riassunto">${Gx ? `<b>${esc(titoloGiorno(Gx))}</b>dalle ${ora(Gx.inizio)} alle <span data-conta="fine">${ora(Gx.fine)}</span>` : '<b>Giorno vuoto</b>Aggiungi la prima tappa'}</p>
            <button type="button" class="c-azione c-azione--piena onda" data-azione="aggiungi">${ic('piu', 20)}Aggiungi</button>
            <button type="button" class="c-azione onda" data-azione="altro" aria-label="Altro: I miei itinerari, Condividi, Pause e margini, Elimina">${ic('altro')}</button></div>${Gx ? cammino(Gx, 'cammino--c') : ''}${modificaB}${Gx && !S.modifica ? consiglio(S.g, 'consiglio--c') : ''}</div>
        <div class="c-corpo${anima ? ' c-entra' : ''}">${Gx ? `${this.elenco(Gx)}${S.modifica ? '' : liberoBlocco(Gx, 'c-libero')}` : vuoto('c-vuoto', 'c-azione')}</div>`;
    },
    margini() {
      if (computer.matches) return { t: 90, r: sch && schEl.open && sch.q === 1 ? 480 : 70, b: 70, l: 500 };
      if (sch && schEl.open && sch.q === 1) return { t: 112, r: 44, b: Math.max(60, innerHeight - (sch.cima ?? innerHeight * .4) + 24), l: 44 };
      const el = $('#mappa'), sp = $('.c-spazio');
      const visibile = sp ? sp.offsetHeight : 300;
      return { t: 112, r: 64, b: Math.max(60, (el?.clientHeight || 600) - visibile + 40), l: 36 };
    },
    dopo() {
      mappa = new Mappa($('#mappa'), opzMappa({ tocca: id => C.tocca(id), margini: () => C.margini(), distanza: 36 }));
      this.disegnaMappa(false, rotta ? null : Infinity);
      const carta = $('#c-mappa');
      ascolta('scroll', () => {
        const sp = $('.c-spazio');
        if (!sp || computer.matches) return;
        const k = Math.max(0, Math.min(1, scrollY / Math.max(1, sp.offsetHeight)));
        carta.style.setProperty('--su', k.toFixed(3));
        carta.classList.toggle('c-mappa--coperta', k >= 1 && scrollY > sp.offsetHeight + 40);
      });
      this.osserva();
      sfoglia($('#c-foglio'), () => $('#c-dentro'));
    },
    osserva() {
      const giu = $('#c-giu');
      if (!giu) return;
      const guarda = () => {
        const r = $('.c-riga-azioni'), cg = $('#c-giorni');
        if (!r || !cg) { giu.dataset.nascosto = 'false'; return; }
        const alto = (computer.matches ? $('#c-foglio').getBoundingClientRect().top : parseFloat(getComputedStyle(cg).top) || 0) + cg.offsetHeight;
        const via = r.getBoundingClientRect().bottom < alto + 4 && !S.modifica;
        if (giu.dataset.nascosto !== String(!via)) giu.dataset.nascosto = String(!via);
        document.documentElement.classList.toggle('c-giu-su', via);
      };
      if (!this.guarda) { this.guarda = guarda; ascolta('scroll', () => this.guarda?.()); $('#c-foglio').addEventListener('scroll', () => requestAnimationFrame(() => this.guarda?.()), { passive: true }); }
      this.guarda = guarda;
      guarda();
    },
    disegnaMappa(vola, da = null) {
      const Gx = G(S.g);
      mappa?.disegna(Gx, { vola, daLinea: da, altre: Gx ? [] : altreLinee(), n: S.g + 1 });
      if (S.attiva) mappa?.evidenzia(S.attiva);
    },
    allInizio() {
      const f = $('#c-foglio');
      if (!f) return;
      if (computer.matches) { if (f.scrollTop > 0) f.scrollTop = 0; } else allInizio($('#c-dentro'), $('#c-giorni'));
    },
    giorno(g, daX = 0) {
      const dir = g > S.g ? 1 : -1;
      S.g = g; S.attiva = null;
      document.documentElement.dataset.g = String(g);
      segnaSchede(g);
      const el = $('#c-dentro');
      scorri(el, dir, daX, () => { el.innerHTML = this.corpo(true); this.allInizio(); contaCifre(); contaFine(); this.osserva(); }, undefined, () => requestAnimationFrame(() => this.disegnaMappa(true)));
    },
    aggiorna(fn, opz = {}) {
      const prima = S.g, segno = segnoOra();
      const lista = $('#c-dentro .c-elenco'), foto0 = lista ? foto(lista) : null;
      fn();
      memo.clear();
      if (!mappa || S.eliminato || !$('#c-foglio')) { aggiornaTutto(() => {}); return; }
      document.documentElement.dataset.g = String(S.g);
      document.documentElement.classList.toggle('in-modifica', S.modifica);
      const cambiato = prima !== S.g || !!opz.giorno;
      $('#c-giorni').innerHTML = this.giorni();
      mettiSegno($('#c-giorni .schede'), { da: segno });
      osservaSchede();
      $('#c-dentro').innerHTML = this.corpo(cambiato);
      const barra = $('.modifica-barra');
      if (S.modifica && !barra) $('#app').insertAdjacentHTML('beforeend', barraModifica()); else if (!S.modifica) barra?.remove();
      if (!cambiato) scivola($('#c-dentro .c-elenco'), foto0, opz.salta);
      contaCifre();
      this.osserva();
      this.disegnaMappa(cambiato || !!S.nuova, cambiato ? null : Infinity);
      if (cambiato) { this.allInizio(); entra($('#c-dentro'), S.g >= prima ? 1 : -1); }
      contaFine();
      prova();
      ricorda();
      if (S.nuova) { const n = S.nuova; setTimeout(() => { if (S.nuova === n) { S.nuova = null; $$('.nuova').forEach(x => x.classList.remove('nuova')); } }, 2800); }
    },
    tocca(id, b) {
      S.attiva = id;
      $$('.c-voce__apri').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
      if (!(S.q === 1 && !computer.matches)) mappa?.centra(id);
      apriScheda(id, b);
    }
  };
  AZ['su-mappa'] = () => { if (computer.matches) { mappa?.tutto(); return; } scrollTo({ top: 0, behavior: piano() ? 'smooth' : 'auto' }); };

  // =====================================================================================
  // D · LE PAGINE (pezzo 1): un giorno è una pagina; cartoline, orme, francobolli. Pezzo 2: le cartoline cambiano con la proposta.
  // =====================================================================================
  const PASSO = 64;
  const IMPRONTA = '<path class="orma__tacco" d="M-3 -13.6C-2.6 -15.6 3.4 -15.6 3.6 -13.4L3.4 -8C3.2 -6.2 -2.6 -6.2 -2.9 -8Z"/><path class="orma__suola" d="M-1.2 -3C1 -4 3 -3.6 3.6 -2C4.6 .6 5 4 4.6 7.6C4.2 11 2.4 13.6 -.6 14.4C-3.4 15 -5 12.6 -4.9 8.6C-4.8 5 -3.6 1.2 -1.2 -3Z"/><path class="orma__righe" d="M-3.9 4.4L4.2 3.6M-4.2 9L4.3 8.3"/>';
  const orme = () => `<svg class="orme" viewBox="0 0 64 128" aria-hidden="true" focusable="false">${[0, 1, 2, 3, 4].map(k => { const destro = k % 2 === 0, x = destro ? 25 : 40, y = 16 + k * 24, r = destro ? 7 : -7; return `<g class="orma" style="--k:${k}" transform="translate(${x} ${y}) rotate(${r}) scale(${destro ? -1.08 : 1.08} 1)">${IMPRONTA}</g>`; }).join('')}</svg>`;
  const ROT = k => (k % 4 === 0 ? -.8 : k % 4 === 2 ? .7 : 0);
  function cartolinaD(v, k, g) {
    const t = T(v.id), q = S.q, vis = visitata(v.id), ed = S.modifica && q === 3;
    const attr = `data-chiave="${v.id}" data-v-id="${v.id}" data-id="${v.id}"${vis ? ' data-visitata' : ''}${v.fatta ? '' : ' data-trascina'}${q === 2 && !v.fatta ? ' data-scorre' : ''}${q === 4 && !v.fatta ? ' data-preme' : ''}`;
    const quando = v.fatta ? 'visitata' : ora(v.inizio);
    if (ed) return `<div class="d-voce d-voce--stretta" ${attr} style="--k:${k}"><button type="button" class="meno" data-azione="togli" data-id="${v.id}" aria-label="Togli ${esc(t.breve)}">${ic('meno', 20)}</button>${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy" decoding="async">` : '<span class="d-senza"></span>'}<span class="d-stretta__t"><b>${esc(t.nome)}</b><small class="num">${v.fatta ? 'Visitata' : `${ora(v.inizio)} – ${ora(v.fine)}`}</small></span>${maniglia(v.id, 'maniglia d-maniglia-s')}</div>`;
    const cartolina = `<button type="button" class="d-cartolina${v.id === S.nuova ? ' nuova' : ''}" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="d-foto">${FOTO[v.id] ? `<img src="${FOTO[v.id]}" alt="" loading="lazy" decoding="async">` : `<span class="d-senza" aria-hidden="true">${esc(t.breve)}</span>`}${q === 4 && puoiSegnare() ? '' : `<span class="d-timbro-ora num${v.fatta ? ' d-timbro-ora--v' : ''}" aria-hidden="true">${quando}</span>`}${q === 2 || q === 3 ? `<i class="d-sigillo sg-si" aria-hidden="true">${soglia()}<em>visitata</em></i>` : ''}</span><span class="d-cartolina__testo"><span class="vh">${v.fatta ? 'Visitata: ' : `Alle ${ora(v.inizio)}, ${durata(t.durata)}${vis ? ', visitata' : ''}: `}</span><b>${esc(t.nome)}</b><span class="d-frase">${esc(t.frase)}</span><span class="d-meta">${v.fatta ? 'Visitata' : `${durata(t.durata)}, fino alle ${ora(v.fine)}`}</span>${etichette(v.id, g).map(e => `<span class="d-et">${e}</span>`).join('')}</span></button>`;
    let sopra = '';
    if (q === 1) sopra = `${puoiSegnare() ? segnoV(v, 'sv d-sv') : ''}${v.fatta ? '' : maniglia(v.id, 'maniglia d-maniglia')}`;
    if (q === 4 && puoiSegnare()) sopra = `<button type="button" class="d-timbro-b" data-azione="visitata" data-id="${v.id}" aria-pressed="${vis}"><span class="vh">Visitata: ${esc(t.breve)}, </span><span class="d-timbro-b__ora num">${quando}</span>${soglia()}</button><button type="button" class="d-altro onda" data-azione="menu-tappa" data-id="${v.id}" aria-haspopup="true" aria-expanded="false" aria-label="Azioni per ${esc(t.breve)}">${ic('altro', 20)}</button>`;
    if (q === 2) return `<div class="d-voce${vis ? ' d-voce--v' : ''}" ${attr} style="--k:${k};--r:${ROT(k)}deg">${sottoRiga(v.id)}<div class="riga-pelle">${cartolina}</div></div>`;
    return `<div class="d-voce${vis ? ' d-voce--v' : ''}" ${attr} style="--k:${k};--r:${ROT(k)}deg">${cartolina}${sopra}</div>`;
  }
  const Dp = {
    nome: 'Le pagine',
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
      </nav>${crediti()}${S.modifica ? barraModifica() : ''}`;
    },
    cartoline(Gx, g) {
      let k = 0;
      const voci = sequenzaM(Gx, g);
      return voci.map((v, j) => {
        if (v.tipo === 'tratto') { const dopo = voci.slice(j + 1).find(x => x.tipo === 'tappa'); return `<div class="d-tratto" data-chiave="t-${dopo?.id}" data-verso="${dopo?.id ?? ''}"${dopo && visitata(dopo.id) ? ' data-fatto' : ''}>${v.mezzi.length ? ic('mappa', 22) : orme()}<span class="d-tratto__t">${testoTratto(v)}</span></div>`; }
        if (v.tipo === 'pasto') return rigaPasto(v.m, 'd');
        if (v.tipo === 'pausa') return `<button type="button" class="d-pausa" data-chiave="p-${v.quale}" data-azione="pausa" data-quale="${v.quale}"><span class="d-pausa__ic">${ic(TIPI_PAUSA[v.quale].ic, 24)}</span><span class="d-pausa__t"><b>${TIPI_PAUSA[v.quale].nome}</b><span class="num">${ora(v.inizio)} – ${ora(v.fine)}, ${durataLunga(v.min)}</span></span><span class="d-pausa__cambia">Cambia</span></button>`;
        const html = S.q === 2 && S.aperta === v.id ? rigaAperta(v, k++) : cartolinaD(v, k++, g);
        return v.fatta && voci[j + 1] && !(voci[j + 1].tipo === 'tappa' && voci[j + 1].fatta) ? `${html}<p class="d-adesso" data-chiave="adesso">${ic('orologio', 16)}Da adesso, ${ora(ORA_FINTA)}: orari ricalcolati</p>` : html;
      }).join('');
    },
    pagina(g) {
      const Gx = G(g), qui = g === S.g;
      const sug = Gx ? suggerite(g) : [];
      const l = Gx ? Gx.resta : 0;
      const modificaB = Gx && S.q === 3 && !S.modifica ? `<button type="button" class="d-modifica onda" data-azione="modifica">${ic('matita', 18)}Modifica il giorno</button>` : '';
      return `<section class="d-pagina${qui ? ' attiva giorno-attivo' : ''}${qui && computer.matches ? ' giorno-corpo' : ''}" data-pagina="${g}" aria-label="Giorno ${g + 1}"${qui ? ' data-inizio-giorno' : ' inert'}><h2>${ORDINALE[g]} giorno<small>${Gx ? esc(titoloGiorno(Gx)) : 'ancora vuoto'}</small></h2>
        ${Gx ? `${cifre(Gx, 'cifre d-francobolli', `@${g}`)}${tempo(Gx, 'tempo--d', { suf: `@${g}` })}${qui ? cammino(Gx, 'cammino--d') : ''}${modificaB}${!S.modifica ? consiglio(g, 'consiglio--d') : ''}<div class="d-cartoline${S.modifica && S.q === 3 ? ' in-modifica-lista' : ''}">${this.cartoline(Gx, g)}</div>
          ${S.modifica ? '' : l > 0 && sug.length ? `<div class="d-libero"><p>${resta(l)} prima delle ${ora(Gx.fineScelta)}: c'è spazio per un'altra cartolina.</p>
            <ul class="d-sug">${sug.map(c => `<li><button type="button" class="d-sug__c onda" data-azione="aggiungi-subito" data-id="${c.id}">${FOTO[c.id] ? `<img src="${FOTO[c.id]}" alt="" loading="lazy" decoding="async">` : '<span class="d-senza"></span>'}<b>${esc(T(c.id).breve)}</b><small class="num">${c.tratto?.min ?? 0} min a piedi</small><span class="d-sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>
            <button type="button" class="d-bottone d-bottone--contorno onda" data-azione="aggiungi">Vedi tutte le tappe</button></div>` : liberoBlocco(Gx, 'd-libero', g)}` : vuoto('d-vuoto', 'd-bottone')}
        <div class="d-dopo"></div></section>`;
    },
    dopo() {
      const pag = $('#d-pagine');
      const pc = computer.matches;
      let y0 = scrollY;
      ascolta('scroll', () => { const tab = $('.d-tab'); if (!tab || computer.matches) return; const y = scrollY; if (Math.abs(y - y0) > 8) { tab.classList.toggle('d-tab--via', y > y0 && y > 260); y0 = y; } });
      this.osservaCartoline();
      if (pc) {
        mappa = new Mappa($('#mappa'), opzMappa({ tocca: id => Dp.tocca(id), margini: () => ({ t: 60, r: 56, b: 80, l: 56 }) }));
        mappa.disegna(G(S.g), { daLinea: rotta ? null : Infinity, altre: G(S.g) ? [] : altreLinee(), n: S.g + 1 });
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
        // l'altezza cambia una volta sola, quando passi tra due pagine (la più alta delle due), e si aggiusta a fine scorrimento
        const i = Math.max(0, Math.min(nG() - 1, Math.floor(x))), h = this.alte || [];
        if (h[i] != null && this.coppia !== i) { this.coppia = i; pag.style.height = `${Math.max(h[i], h[i + 1] ?? 0)}px`; }
        const g = Math.max(0, Math.min(nG() - 1, Math.round(x)));
        if (g !== S.g) {
          S.g = g; S.attiva = null; S.nuova = null; S.aperta = null;
          document.documentElement.dataset.g = String(g);
          $$('.d-indice [role="tab"]').forEach(b => { const si = +b.dataset.g === g; b.setAttribute('aria-selected', String(si)); b.tabIndex = si ? 0 : -1; });
          $('#d-dove').textContent = `giorno ${g + 1} di ${nG()}`;
          $$('.d-pagina').forEach(p => { const qui = +p.dataset.pagina === g; p.classList.toggle('attiva', qui); p.classList.toggle('giorno-attivo', qui); p.toggleAttribute('data-inizio-giorno', qui); p.inert = !qui; });
        }
        clearTimeout(fermo);
        fermo = setTimeout(() => {
          this.coppia = null;
          this.misura();
          contaFine();
          const p = pag.children[S.g], top = p ? p.getBoundingClientRect().top : 0;
          if (p && top < -innerHeight * .9) {
            $$('.da-vedere:not(.vista)', p).forEach(x => { if (x.getBoundingClientRect().top < innerHeight) { x.classList.add('vista', 'subito'); this.io?.unobserve(x); } });
            scrollTo({ top: scrollY + top - 120, behavior: piano() ? 'smooth' : 'auto' });
            setTimeout(() => $$('.subito', p).forEach(x => x.classList.remove('subito')), 1000);
          }
        }, 140);
      }, { passive: true });
    },
    // le cartoline e le orme si appoggiano quando arrivano sullo schermo (le pagine accanto contano come visibili)
    osservaCartoline(dove = $('#d-pagine')) {
      if (!dove || !piano() || !('IntersectionObserver' in window)) return;
      this.io?.disconnect();
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vista'); io.unobserve(e.target); } }), { rootMargin: computer.matches ? '0px 0px -8% 0px' : '0px 200% -8% 200%' });
      this.io = io;
      $$('.d-voce, .d-tratto, .d-francobolli, .d-pausa', dove).forEach(x => { if (!x.classList.contains('vista')) { x.classList.add('da-vedere'); io.observe(x); } });
    },
    profondita() {
      const pag = $('#d-pagine');
      if (!pag || !piano()) return;
      const x = pag.scrollLeft / pag.clientWidth;
      // la testata di ogni pagina scorre un po' più piano (parallasse): si sposta solo lei, non tutta la pagina
      (this.teste ??= new Map());
      $$('.d-pagina', pag).forEach(p => { const o = +p.dataset.pagina - x; if (Math.abs(o) > 1.2) return; let t = this.teste.get(p); if (!t || !t[0]?.isConnected) { t = $$(':scope > h2, .d-riassunto', p); this.teste.set(p, t); } t.forEach(e => { e.style.translate = `${(o * 38).toFixed(1)}% 0`; }); });
    },
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
          $$('.d-pagina', pag).forEach(p => { const qui = +p.dataset.pagina === g; p.classList.toggle('attiva', qui); p.classList.toggle('giorno-attivo', qui); p.classList.toggle('giorno-corpo', qui); p.toggleAttribute('data-inizio-giorno', qui); p.inert = !qui; });
          const nuova = $('.d-pagina.attiva');
          $$('.da-vedere', nuova).forEach(x => { if (x.getBoundingClientRect().top < innerHeight) { x.classList.add('vista', 'subito'); this.io?.unobserve(x); } });
          requestAnimationFrame(() => requestAnimationFrame(() => $$('.subito', nuova).forEach(x => x.classList.remove('subito'))));
          allInizio(nuova, $('.d-indice'));
          contaFine();
        }, () => $('.d-pagina.attiva'), () => mappa?.disegna(G(g), { vola: true, altre: G(g) ? [] : altreLinee(), n: g + 1 }));
        return;
      }
      pag.scrollTo({ left: g * pag.clientWidth, behavior: piano() ? 'smooth' : 'auto' });
    },
    // un cambiamento nel giorno: si ridisegna solo la pagina del giorno (le cartoline restano appoggiate) e la mappa
    aggiorna(fn, opz = {}) {
      const prima = S.g, nPrima = nG();
      const box = $('.d-pagina.attiva .d-cartoline'), foto0 = box ? foto(box) : null;
      fn();
      memo.clear();
      if (S.eliminato || !$('#d-pagine') || prima !== S.g || nPrima !== nG() || opz.giorno) { aggiornaTutto(() => {}, opz); return; }
      document.documentElement.classList.toggle('in-modifica', S.modifica);
      let nuova = null;
      for (const vecchia of $$('.d-pagina')) {
        const g = +vecchia.dataset.pagina, tmp = document.createElement('div');
        tmp.innerHTML = this.pagina(g);
        const p = tmp.firstElementChild;
        if (!computer.matches) p.style.setProperty('--o', String(g - S.g));
        $$('.d-voce, .d-tratto, .d-francobolli, .d-pausa', p).forEach(x => x.classList.add('vista'));
        vecchia.replaceWith(p);
        if (g === S.g) nuova = p;
      }
      const barra = $('.modifica-barra');
      if (S.modifica && !barra) $('#app').insertAdjacentHTML('beforeend', barraModifica()); else if (!S.modifica) barra?.remove();
      scivola($('.d-cartoline', nuova), foto0, opz.salta);
      this.misura();
      contaCifre();
      contaFine();
      mappa?.disegna(G(S.g), { vola: false, daLinea: S.nuova ? null : Infinity, altre: G(S.g) ? [] : altreLinee(), n: S.g + 1 });
      if (mappaD) mappaD.disegna(G(S.g), { altre: G(S.g) ? [] : altreLinee(), n: S.g + 1, disegna: false });
      prova();
      ricorda();
      if (S.nuova) { const n = S.nuova; setTimeout(() => { if (S.nuova === n) { S.nuova = null; $$('.nuova').forEach(x => x.classList.remove('nuova')); } }, 2800); }
    },
    tocca(id, b) {
      S.attiva = id;
      $$('.d-cartolina').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
      mappa?.evidenzia(id);
      apriScheda(id, b);
    }
  };
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
  const P = { c: C, d: Dp };

  // =====================================================================================
  // LE QUATTRO PROPOSTE DELLA SCHEDA
  // =====================================================================================
  const schEl = $('#scheda');
  let sch = null;   // la scheda aperta: { q, id, … }
  let daDove = null;   // chi l'ha aperta: torna lì il fuoco
  function apriScheda(id, sorgente) {
    daDove = sorgente?.closest?.('button') || document.activeElement;
    // le tappe che non sono in questo giorno (dalla mappa con tutte le tappe): la scheda corta, con «Aggiungi»
    const g = giornoDi(id);
    if (g !== S.g) { schedaFuori(id); return; }
    Q[S.q].apri(id, sorgente);
  }
  async function chiudiSchede() {
    if (sch && schEl.open) await Q[sch.q].chiudi?.(true);
  }
  function schedaFuori(id, indietro = null) {
    const g = giornoDi(id);
    const gita = T(id).tipo === 'gita';
    const corpo = `${indietro ? `<button type="button" class="r-indietro" data-f="indietro">${ic('indietro', 18)}Torna ai risultati</button>` : ''}${fotoScheda(id, 'f-scheda-foto')}${credito(id)}<p class="sch-quando">${g >= 0 ? `${quandoTesto(id)}` : 'Non è nel tuo itinerario'}</p>${chips(id)}<div class="sch-testo">${testoScheda(id)}</div>${sezioni(id)}${fontiScheda(id)}${g >= 0 ? `<button type="button" class="f-bottone f-bottone--contorno" data-f="vai" data-g="${g}">Vai al giorno ${g + 1}</button>` : gita ? `<p class="f-nota">Le gite prendono un giorno intero: nel sito ${esc(T(id).breve)} diventa il giorno ${nG() + 1}. In questa prova non si aggiunge.</p>` : azioniScheda(id)}`;
    foglio(T(id).nome, corpo, f => {
      f.onclick = async e => {
        if (e.target === f) { chiudiFoglio(); return; }
        if (e.target.closest('[data-f="indietro"]')) { apriAggiungi(indietro); return; }
        const b = e.target.closest('[data-f="vai"], [data-azione="aggiungi-qui"]');
        if (!b) return;
        await chiudiFoglio();
        if (b.dataset.f === 'vai') vaiAlGiorno(+b.dataset.g); else aggiungi(S.g, id);
      };
    }, 'f--scheda f--fuori');
  }
  // le azioni dentro le schede (fuori da #app)
  schEl.addEventListener('click', e => {
    const b = e.target.closest('[data-azione]');
    if (!b || b.disabled || schTolto) return;
    const k = b.dataset.azione;
    if (k === 'visitata') { segna(b.dataset.id, b); return; }
    if (k === 'togli') { togliTappa(b.dataset.id); return; }
    if (k === 'sposta-giorno') { spostaGiorno(b.dataset.id, +b.dataset.g); return; }
    if (k === 'salva') { salva(b); return; }
    if (k === 'aggiungi-qui') { AZ['aggiungi-qui'](b); return; }
    Q[sch?.q]?.azione?.(k, b, e);
  });
  schEl.addEventListener('cancel', e => { e.preventDefault(); Q[sch?.q]?.chiudi(); });
  // il foglio (1) non è modale: Esc lo chiude anche se il fuoco è nella pagina sotto
  addEventListener('keydown', e => { if (e.key === 'Escape' && sch?.q === 1 && schEl.open && !foglioEl.open) { e.preventDefault(); Q[1].chiudi(); } });
  let schTolto = false;   // dopo un gesto (sfogliare, tirare) il tocco non conta
  const ordineDi = id => { const p = posizione(id); return p ? p.ordine : [id]; };
  const passo = (id, dir) => { const o = ordineDi(id), i = o.indexOf(id); return o[i + dir] ?? null; };
  const tornaFuoco = () => { const id = sch?.id; const el = (id && $(`.giorno-attivo [data-id="${id}"][data-azione="tappa"]`)) || (daDove?.isConnected ? daDove : null); el?.focus({ preventScroll: true }); };

  // ---------- 1 · IL FOGLIO ----------
  // Sale a metà schermo: foto, nome, quando, «visitata», in breve. Si tira su per leggere tutto (testo, orari, biglietti,
  // come arrivare, fonti). Di lato passi alla tappa prima o dopo; in C la mappa resta sopra e vola sulla tappa.
  const Q1 = {
    nome: 'Il foglio',
    idea: ['Tocchi una tappa e sale un foglio fino a metà schermo: foto, nome, l\'ora nel giorno, il pulsante «Da visitare» e le cose da sapere. In C la mappa resta visibile sopra e vola sulla tappa; tocchi un altro segno sulla mappa e il foglio cambia.',
      'Tiri su il foglio (o tocchi «Leggi tutto») e leggi il resto: testo, orari, biglietti, come arrivare, fonti; in fondo «Sposta nel giorno 2» e «Togli». Scorri di lato sul foglio per passare alla tappa dopo: in basso il tratto a piedi.',
      'Nella giornata: il numero della tappa è una piccola porta; toccandola le soglie del marchio si chiudono e compare la spunta (visitata). A destra la maniglia: trascini per cambiare l\'ordine.',
      'Nella scheda «visitata» è un timbro tondo sul bordo della foto: in alto scegli tra tre stili (Timbro 1, 2, 3). Se cambi l\'ordine e c\'è un ordine più corto, sopra le tappe compare il consiglio: «Usa questo ordine» o «Lascia così».'],
    apri(id) {
      const giaAperto = sch?.q === 1 && schEl.open;
      if (giaAperto) { if (id !== sch.id) this.vai(ordineDi(sch.id).indexOf(id) > ordineDi(sch.id).indexOf(sch.id) ? 1 : -1, 0, id); return; }
      sch = { q: 1, id, detent: 'meta' };
      schEl.className = 'sch sch1';
      schEl.innerHTML = `<div class="sch1__pannello"><div class="sch1__testa"><span class="sch1__presa" aria-hidden="true"></span><button type="button" class="sch1__alza" data-azione="detent" aria-label="Leggi tutta la scheda">${ic('alza', 22)}</button><button type="button" class="sch1__chiudi" data-azione="chiudi" aria-label="Chiudi la scheda">${ic('x', 22)}</button></div><div class="sch1__corpo"><div class="sch1__pagina"></div></div><nav class="sch1__passi" aria-label="Tappe del giorno"></nav></div>`;
      this.riempi();
      if (!computer.matches && !schEl.open) document.documentElement.classList.add('sch1-su');
      schEl.show();
      this.metti('meta', false);
      if (piano()) $('.sch1__pannello', schEl).animate([{ transform: `translateY(${this.H()}px)` }, { transform: `translateY(${this.y}px)` }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
      $('.sch-titolo', schEl)?.focus({ preventScroll: true });
      // in C: la mappa si vede sopra il foglio e vola sulla tappa
      if (S.p === 'c') { if (!computer.matches && scrollY > 0) scrollTo({ top: 0, behavior: piano() ? 'smooth' : 'auto' }); setTimeout(() => mappa?.centra(id), piano() ? 160 : 0); }
    },
    H() { return $('.sch1__pannello', schEl)?.offsetHeight || innerHeight; },
    meta() { return Math.round(Math.min(this.H(), Math.max(400, innerHeight * .6))); },
    metti(d, anima = true) {
      sch.detent = d;
      const p = $('.sch1__pannello', schEl);
      if (computer.matches) { this.y = 0; p.style.transform = ''; schEl.dataset.d = 'tutto'; return; }
      this.y = d === 'tutto' ? 0 : this.H() - this.meta();
      p.style.transition = anima && piano() ? 'transform 420ms cubic-bezier(.16,1,.3,1)' : 'none';
      p.style.transform = `translateY(${this.y}px)`;
      schEl.dataset.d = d;
      sch.cima = innerHeight - this.H() + this.y;
      $('.sch1__alza', schEl)?.setAttribute('aria-label', d === 'tutto' ? 'Riduci la scheda' : 'Leggi tutta la scheda');
      if (d === 'meta') $('.sch1__corpo', schEl).scrollTop = 0;
    },
    pagina(id) {
      const p = posizione(id);
      const tr = p ? trattoVerso(p.Gx, id) : null;
      return `<div class="sch1__foto"><div class="sch1__cornice">${fotoScheda(id)}${timbro(id)}</div>${credito(id)}</div>
        <h2 class="sch-titolo" id="sch-t" tabindex="-1">${esc(T(id).nome)}</h2>
        <p class="sch-quando">${quandoTesto(id)}${p ? `<span>, tappa ${p.i + 1} di ${p.n}</span>` : ''}</p>
        ${puoiSegnare() ? `<p class="sch-segnata" data-sotto="${id}">${visitata(id) ? quandoSegnata(id) : 'Tocca il timbro sulla foto quando ci sei stato'}</p>` : bottoneV(id)}
        ${chips(id)}
        <button type="button" class="sch1__leggi" data-azione="detent">Leggi tutto${ic('abbassa', 18)}</button>
        <div class="sch1__resto"><div class="sch-testo">${testoScheda(id)}</div>${sezioni(id)}${tr ? `<section class="sch-sez"><h3>Ci arrivi</h3><p>${testoTratto(tr)}, da ${esc(T(passo(id, -1)).breve)}.</p></section>` : ''}${fontiScheda(id)}${azioniScheda(id)}</div>`;
    },
    riempi(pre) {
      const id = sch.id, p = posizione(id);
      if (pre !== true) $('.sch1__pagina', schEl).innerHTML = pre ?? this.pagina(id);
      schEl.setAttribute('aria-labelledby', 'sch-t');
      const prima = passo(id, -1), dopoId = passo(id, 1), trDopo = dopoId ? trattoVerso(p.Gx, dopoId) : null;
      $('.sch1__passi', schEl).innerHTML = `<button type="button" class="sch1__passo" data-azione="passo" data-dir="-1"${prima ? '' : ' disabled'}>${ic('indietro', 20)}<span>${prima ? `<span class="vh">Tappa prima: </span>${esc(T(prima).breve)}` : 'Prima tappa'}</span></button><span class="sch1__dove num">${p ? `${p.i + 1} di ${p.n}` : ''}</span><button type="button" class="sch1__passo sch1__passo--dopo" data-azione="passo" data-dir="1"${dopoId ? '' : ' disabled'}><span>${dopoId ? `<span class="vh">Tappa dopo: </span>${esc(T(dopoId).breve)}` : 'Ultima tappa'}${trDopo ? `<small>${ic('piedi', 13)}${trDopo.min} min<span class="vh"> a piedi</span></small>` : ''}</span>${ic('avanti', 20)}</button>`;
    },
    rinfresca() { if (giornoDi(sch.id) !== S.g) { this.chiudi(); return; } this.riempi(); },
    async vai(dir, daX = 0, id = passo(sch.id, dir)) {
      if (!id || occupato) return;
      const pag = $('.sch1__pagina', schEl);
      const fuoco = schEl.contains(document.activeElement);
      if (FOTO[id]) { const im = new Image(); im.src = FOTO[id]; im.decode?.().catch(() => {}); }
      await scorri(pag, dir, daX, () => { sch.id = id; this.riempi(); $('.sch1__corpo', schEl).scrollTop = 0; });
      if (fuoco) $('.sch-titolo', schEl)?.focus({ preventScroll: true });
      S.attiva = id;
      if (S.p === 'c') mappa?.centra(id); else mappa?.evidenzia(id);
      $$('.giorno-attivo [data-azione="tappa"]').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
      annuncia(`${T(id).nome}, ${quandoTesto(id)}`);
    },
    async chiudi(subito = false) {
      if (!schEl.open || sch?.chiude) return;
      sch.chiude = true;
      const p = $('.sch1__pannello', schEl);
      document.documentElement.classList.remove('sch1-su');
      if (piano() && !subito && p) await p.animate([{ transform: `translateY(${this.y}px)` }, { transform: `translateY(${this.H()}px)` }], { duration: 260, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }).finished.catch(() => {});
      schEl.close();
      tornaFuoco();
      sch = null;
      if (S.p === 'c') mappa?.tutto();
    },
    azione(k, b) {
      if (k === 'chiudi') this.chiudi();
      if (k === 'detent') this.metti(sch.detent === 'tutto' ? 'meta' : 'tutto');
      if (k === 'passo') this.vai(+b.dataset.dir);
    }
  };
  // i gesti sul foglio: di lato = tappa prima o dopo; in su e in giù = metà, tutto, chiuso
  schEl.addEventListener('pointerdown', e => {
    if (sch?.q !== 1 || (e.pointerType === 'mouse' && e.button !== 0) || e.target.closest('a, input, summary')) return;
    const p = $('.sch1__pannello', schEl), corpo = $('.sch1__corpo', schEl), pag = $('.sch1__pagina', schEl);
    const x0 = e.clientX, y0 = e.clientY, t0 = performance.now(), yP = Q1.y, dallaTesta = !!e.target.closest('.sch1__testa');
    let dir = null, dx = 0;
    const muovi = ev => {
      if (ev.pointerId !== e.pointerId) return;
      dx = ev.clientX - x0; const dy = ev.clientY - y0;
      if (!dir) {
        if (Math.hypot(dx, dy) < 8) return;
        dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v';
        if (dir === 'v' && !(dallaTesta || sch.detent === 'meta' || (e.pointerType !== 'touch' && corpo.scrollTop <= 0 && dy > 0 && !computer.matches))) { dir = 'x'; return; }
        if (dir === 'v' && computer.matches) { dir = 'x'; return; }
        try { schEl.setPointerCapture(e.pointerId); } catch {}
        if (dir === 'v') p.style.transition = 'none';
      }
      if (dir === 'h') { const fermo = (dx > 0 && !passo(sch.id, -1)) || (dx < 0 && !passo(sch.id, 1)); const x = fermo ? dx * .25 : dx; if (piano()) { pag.style.translate = `${x.toFixed(1)}px 0`; pag.style.opacity = String(Math.max(.35, 1 - Math.abs(x) / 520)); } }
      if (dir === 'v') { const y = Math.max(0, yP + dy); Q1.y = y; p.style.transform = `translateY(${y}px)`; }
    };
    const su = ev => {
      if (ev.pointerId !== e.pointerId) return;
      schEl.removeEventListener('pointermove', muovi); schEl.removeEventListener('pointerup', su); schEl.removeEventListener('pointercancel', su);
      if (dir === 'h' || dir === 'v') { schTolto = true; setTimeout(() => { schTolto = false; }, 60); }
      const v = (ev.clientY - y0) / Math.max(1, performance.now() - t0);
      if (dir === 'h') {
        const verso = dx < 0 ? 1 : -1, id = passo(sch.id, verso);
        if (id && (Math.abs(dx) > 70 || Math.abs(dx) / Math.max(1, performance.now() - t0) > .45)) Q1.vai(verso, piano() ? parseFloat(pag.style.translate) || 0 : 0);
        else { const da = { translate: pag.style.translate || '0px 0', opacity: pag.style.opacity || '1' }; pag.style.translate = ''; pag.style.opacity = ''; if (piano()) pag.animate([da, { translate: '0px 0', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' }); }
      }
      if (dir === 'v') {
        const H = Q1.H(), meta = H - Q1.meta(), y = Q1.y;
        if (y > meta + 110 || (v > .8 && y > meta - 40)) Q1.chiudi();
        else if (v < -.5 || y < meta / 2) Q1.metti('tutto'); else Q1.metti('meta');
      }
    };
    schEl.addEventListener('pointermove', muovi); schEl.addEventListener('pointerup', su); schEl.addEventListener('pointercancel', su);
  });
  schEl.addEventListener('click', e => { if (schTolto) { e.stopPropagation(); e.preventDefault(); } }, true);
  // Da telefono, un foglio aperto del tutto si chiude tirando giù da qualsiasi punto (Enrico, 14/10/2026), ma solo se il testo
  // era già in cima quando hai appoggiato il dito (chi risale leggendo e arriva in cima non lo chiude nello stesso gesto) e solo
  // con un gesto deciso: più di 200 px, o più di 110 px veloce. Altrimenti torna su. Se il foglio sa sfogliare, di lato gira pagina.
  function tiraPerChiudere(el, { pronto, scorre, pannello, chiudi }) {
    let t = null;
    el.addEventListener('touchstart', e => {
      t = null;
      if (!pronto() || computer.matches || e.touches.length !== 1 || e.target.closest('a, input, summary, .f-testa, .sch1__testa, .m, .f-chips, .mn-quanto')) return;
      const sc = scorre();
      t = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: performance.now(), dir: null, dy: 0, dx: 0, cima: !sc || sc.scrollTop <= 0 };
    }, { passive: true });
    el.addEventListener('touchmove', e => {
      if (!t) return;
      const dx = e.touches[0].clientX - t.x, dy = e.touches[0].clientY - t.y;
      if (!t.dir) {
        if (Math.hypot(dx, dy) < 8) return;
        t.dir = dy > 0 && dy > Math.abs(dx) * 1.2 && t.cima ? 'giu' : Math.abs(dx) > Math.abs(dy) * 1.2 && el.sfoglia ? 'lato' : 'no';
        if (t.dir === 'giu') pannello().style.transition = 'none';
      }
      if (t.dir === 'no') return;
      e.preventDefault();
      if (t.dir === 'giu') { t.dy = dy; pannello().style.translate = `0 ${(dy * .6).toFixed(1)}px`; }
      else { t.dx = dx; const p = $('.pl-pagina', el), x = el.puoi?.(dx < 0 ? 1 : -1) ? dx : dx * .25; if (p && piano()) { p.style.translate = `${x.toFixed(1)}px 0`; p.style.opacity = String(Math.max(.35, 1 - Math.abs(x) / 520)); } }
    }, { passive: false });
    const fine = () => {
      if (!t || t.dir === 'no' || !t.dir) { t = null; return; }
      const ms = Math.max(1, performance.now() - t.t);
      schTolto = true; setTimeout(() => { schTolto = false; }, 60);
      if (t.dir === 'giu') {
        const p = pannello(), v = t.dy / ms;
        p.style.transition = '';
        if (t.dy > 200 || (t.dy > 110 && v > .9)) { chiudi(); setTimeout(() => { p.style.translate = ''; }, 420); }
        else { const da = p.style.translate; p.style.translate = ''; if (piano() && da) p.animate([{ translate: da }, { translate: '0 0' }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' }); }
      } else {
        const p = $('.pl-pagina', el), dir = t.dx < 0 ? 1 : -1;
        if (!((Math.abs(t.dx) > 70 || Math.abs(t.dx) / ms > .45) && el.puoi?.(dir) && el.sfoglia(dir, p ? parseFloat(p.style.translate) || 0 : 0)) && p) { const da = { translate: p.style.translate || '0px 0', opacity: p.style.opacity || '1' }; p.style.translate = ''; p.style.opacity = ''; if (piano()) p.animate([da, { translate: '0px 0', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' }); }
      }
      t = null;
    };
    el.addEventListener('touchend', fine); el.addEventListener('touchcancel', fine);
  }
  tiraPerChiudere(schEl, { pronto: () => sch?.q === 1 && sch.detent === 'tutto', scorre: () => $('.sch1__corpo', schEl), pannello: () => $('.sch1__pannello', schEl), chiudi: () => Q1.chiudi() });
  tiraPerChiudere(foglioEl, { pronto: () => foglioEl.open, scorre: () => foglioEl, pannello: () => foglioEl, chiudi: () => chiudiFoglio() });

  // ---------- 2 · LA RIGA SI APRE ----------
  // La tappa si allarga sul posto: la foto cresce dalla miniatura, i tratti prima e dopo restano dove sono. Dentro: quando,
  // «visitata», in breve, testo; orari, biglietti, come arrivare e fonti si aprono con un tocco. Sposta: prima, dopo, altro giorno.
  function rigaAperta(v, k) {
    const id = v.id, t = T(id), p = posizione(id), vis = visitata(id), d = S.p === 'd';
    const sez = (T(id).scheda?.sezioni ?? []).map(s => `<details class="ra-det"><summary>${esc(s.titolo)}${ic('abbassa', 18)}</summary><p>${esc(s.testo)}${s.segno ? '<sup class="sch-segno" aria-hidden="true">*</sup>' : ''}</p></details>`).join('');
    const i = S.giorni[p.g].indexOf(id), n = S.giorni[p.g].length;
    const tag = d ? 'div' : 'li';
    return `<${tag} class="riga-aperta ${d ? 'd-voce d-voce--aperta' : 'c-voce c-voce--aperta'}" data-chiave="${id}" data-v-id="${id}" data-id="${id}"${vis ? ' data-visitata' : ''} style="--k:${k};--r:0deg">
      <div class="ra-carta">
        <button type="button" class="ra-testa" data-azione="chiudi-riga" aria-expanded="true" aria-controls="ra-${id}"><span class="ra-foto">${fotoScheda(id, 'ra-img')}</span><span class="ra-tit"><span class="ra-quando num">${v.fatta ? 'Visitata' : `${ora(v.inizio)} – ${ora(v.fine)}`}</span><span class="ra-nome" id="ra-n-${id}">${esc(t.nome)}</span></span><span class="ra-chiudi" aria-hidden="true">${ic('alza', 20)}</span><span class="vh">: chiudi la scheda</span></button>
        <div class="ra-dentro" id="ra-${id}" role="region" aria-labelledby="ra-n-${id}">
          ${credito(id)}
          ${bottoneV(id, 'bv--riga')}
          ${chips(id)}
          <div class="sch-testo">${testoScheda(id)}</div>
          <div class="ra-dets">${sez}</div>
          ${fontiScheda(id)}
          <div class="ra-azioni">
            <button type="button" class="ra-az" data-azione="sposta-apri" aria-expanded="false">${ic('sposta', 20)}<span>Sposta</span></button>
            <button type="button" class="ra-az ra-az--togli" data-azione="togli" data-id="${id}">${ic('cestino', 20)}<span>Togli</span></button>
          </div>
          <div class="ra-sposta" hidden><button type="button" class="ra-sp" data-azione="sposta-su" data-id="${id}"${i === 0 ? ' disabled' : ''}>${ic('su', 18)}Prima</button><button type="button" class="ra-sp" data-azione="sposta-giu" data-id="${id}"${i === n - 1 ? ' disabled' : ''}>${ic('giu', 18)}Dopo</button>${range(nG()).filter(x => x !== p.g).map(x => `<button type="button" class="ra-sp" data-azione="sposta-giorno" data-id="${id}" data-g="${x}">${ic('calendario', 18)}Giorno ${x + 1}</button>`).join('')}</div>
        </div>
      </div></${tag}>`;
  }
  // aprire e chiudere una riga: la foto cresce dalla miniatura (o torna miniatura), le righe sotto scivolano
  function apriRiga(id) {
    const lista = S.p === 'c' ? $('#c-dentro .c-elenco') : $('.d-pagina.attiva .d-cartoline');
    if (!lista) return;
    const prima = foto(lista);
    const vecchia = S.aperta;
    const mini = id ? $(`[data-chiave="${id}"] img`, lista) : null, r0 = mini?.getBoundingClientRect();
    S.aperta = id;
    if (S.p === 'c') lista.outerHTML = C.elenco(G(S.g)); else lista.innerHTML = Dp.cartoline(G(S.g), S.g);
    const nuova = S.p === 'c' ? $('#c-dentro .c-elenco') : $('.d-pagina.attiva .d-cartoline');
    $$('.d-voce, .d-tratto, .d-pausa', nuova).forEach(x => x.classList.add('vista'));
    scivola(nuova, prima, id);
    const aperta = id && $(`.riga-aperta[data-chiave="${id}"]`, nuova);
    if (aperta && piano()) {
      const img = $('.ra-img', aperta), r1 = img?.getBoundingClientRect();
      if (img && r0 && r1) img.animate([{ transform: `translate(${r0.left - r1.left}px, ${r0.top - r1.top}px) scale(${r0.width / r1.width}, ${r0.height / r1.height})`, borderRadius: '14px' }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
      else aperta.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      $$('.ra-dentro > *', aperta).forEach((x, k) => x.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 140 + k * 40, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
    }
    if (aperta) {
      $('.ra-testa', aperta).focus({ preventScroll: true });
      const r = aperta.getBoundingClientRect();
      if (r.top < 120 || r.top > innerHeight * .5) setTimeout(() => aperta.scrollIntoView({ block: 'start', behavior: piano() ? 'smooth' : 'auto' }), piano() ? 120 : 0);
      if (S.p === 'c') mappa?.centra(id); else mappa?.evidenzia(id);
    } else if (vecchia) $(`.giorno-attivo [data-id="${vecchia}"][data-azione="tappa"]`)?.focus({ preventScroll: true });
    if (S.p === 'd') Dp.misura();
  }
  const Q2 = {
    nome: 'La riga si apre',
    idea: ['Tocchi una tappa e si apre lì dove sta: la foto cresce dalla miniatura, il tratto a piedi prima e dopo resta al suo posto. Dentro: l\'ora, «Da visitare», le cose da sapere, il testo; orari, biglietti, come arrivare e fonti si aprono con un tocco. Ritocchi la testa e si richiude.',
      'Scorri una tappa verso destra: sotto compare «Visitata» e la soglia si chiude mentre trascini; lasci e la tappa è segnata. Verso sinistra: «Togli», con «Annulla». La prima volta la prima tappa si sposta da sola per fartelo vedere.',
      'Tieni premuta una tappa mezzo secondo: si alza e la trascini dove vuoi (i tratti si nascondono mentre la sposti). Nella tappa aperta «Sposta»: prima, dopo, nell\'altro giorno. In D, partendo da una cartolina il dito la scorre: per cambiare giorno scorri dal titolo o tocca 1 e 2.'],
    apri(id) { apriRiga(S.aperta === id ? null : id); sch = null; },
    chiudi() { if (S.aperta) apriRiga(null); },
    rinfresca() {}
  };

  // ---------- 3 · A TUTTA PAGINA ----------
  // La scheda è una pagina di rivista: la foto vola dalla riga in alto, il nome grande sopra la foto, il sigillo «visitata» sul
  // bordo della foto. In fondo «Prossima tappa» con il tratto a piedi: tocchi e la pagina gira. «Modifica il giorno» nella giornata.
  const Q3 = {
    nome: 'A tutta pagina',
    idea: ['Tocchi una tappa e la foto vola dalla riga in cima a una pagina intera, come una rivista: il nome grande sopra la foto, l\'ora nel giorno, il testo con l\'attacco più grande, «Da sapere» in un foglietto, poi orari, biglietti, come arrivare e le fonti.',
      'Sul bordo della foto c\'è il sigillo: lo tocchi e le soglie del marchio si chiudono dentro il cerchio, con la spunta (visitata). Nella giornata la tappa visitata ha il sigillo piccolo sulla foto.',
      'In fondo alla pagina «Prossima tappa», con i minuti a piedi: tocchi (o scorri di lato) e la pagina gira. Per spostare e togliere: «Modifica il giorno»; compaiono «−» e le maniglie, poi «Fatto».'],
    apri(id, sorgente) {
      const img = sorgente?.querySelector?.('img');
      const fai = () => {
        sch = { q: 3, id };
        schEl.className = 'sch sch3';
        schEl.innerHTML = `<div class="sch3__scorre"><div class="sch3__barra" aria-hidden="true"><span></span></div><div class="sch3__pagina"></div></div><button type="button" class="sch3__chiudi" data-azione="chiudi" aria-label="Chiudi la scheda">${ic('indietro', 22)}</button>`;
        this.riempi();
        if (!schEl.open) schEl.showModal();
        $('.sch-titolo', schEl)?.focus({ preventScroll: true });
        const sc = $('.sch3__scorre', schEl);
        sc.addEventListener('scroll', () => { const h = $('.sch3__eroe', schEl)?.offsetHeight ?? 400; schEl.classList.toggle('sch3--su', sc.scrollTop > h - 80); }, { passive: true });
      };
      if (img && FOTO[id] && document.startViewTransition && piano()) {
        img.style.viewTransitionName = 'foto-tappa';
        const vt = document.startViewTransition(() => { img.style.viewTransitionName = ''; fai(); const f = $('.sch3__foto', schEl); if (f) f.style.viewTransitionName = 'foto-tappa'; });
        vt.ready.catch(() => {});
        vt.finished.catch(() => {}).finally(() => { const f = $('.sch3__foto', schEl); if (f) f.style.viewTransitionName = ''; });
      } else { fai(); if (piano()) schEl.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' }); }
    },
    riempi() {
      const id = sch.id, p = posizione(id), t = T(id), dopoId = passo(id, 1), primaId = passo(id, -1);
      const trDopo = dopoId ? trattoVerso(p.Gx, dopoId) : null;
      const vis = visitata(id);
      $('.sch3__pagina', schEl).innerHTML = `<header class="sch3__eroe">${fotoScheda(id, 'sch3__foto')}<div class="sch3__velo"></div>
          <div class="sch3__sopra"><p class="sch3__num">${p ? `Giorno ${p.g + 1} · tappa ${p.i + 1} di ${p.n}` : ''}</p><h2 class="sch-titolo sch3__titolo" id="sch-t" tabindex="-1">${esc(t.nome)}</h2></div>
          ${puoiSegnare() ? `<button type="button" class="sigillo" data-azione="visitata" data-id="${id}" aria-pressed="${vis}">${soglia()}<span class="vh">${esc(t.breve)}: </span><span class="sigillo__t">visitata</span></button>` : ''}
        </header>
        ${credito(id)}
        <div class="sch3__corpo">
          <p class="sch3__quando">${p?.v.fatta ? 'Visitata' : p ? `<span class="num">${ora(p.v.inizio)} – ${ora(p.v.fine)}</span>` : ''}<small data-sotto="${id}">${vis ? quandoSegnata(id) : puoiSegnare() ? 'Tocca il sigillo quando ci sei stato' : ''}</small></p>
          ${puoiSegnare() ? '' : bottoneV(id)}
          <div class="sch-testo sch3__testo">${testoScheda(id)}</div>
          <aside class="sch3__sapere" aria-label="Da sapere"><h3>Da sapere</h3>${chips(id)}</aside>
          <div class="sch3__sez">${sezioni(id)}</div>
          ${fontiScheda(id, true)}
          ${azioniScheda(id)}
          ${dopoId ? `<button type="button" class="sch3__dopo" data-azione="passo" data-dir="1"><span class="sch3__dopo-t"><small>Prossima tappa${trDopo ? `, ${trDopo.min} min a piedi` : ''}</small><b>${esc(T(dopoId).nome)}</b></span>${FOTO[dopoId] ? `<img src="${FOTO[dopoId]}" alt="">` : ''}${ic('avanti', 22)}</button>` : '<p class="sch3__fine">È l\'ultima tappa del giorno.</p>'}
          ${primaId ? `<button type="button" class="sch3__prima" data-azione="passo" data-dir="-1">${ic('indietro', 18)}Tappa prima: ${esc(T(primaId).breve)}</button>` : ''}
        </div>`;
      schEl.setAttribute('aria-labelledby', 'sch-t');
      const barra = $('.sch3__barra span', schEl);
      if (barra) barra.textContent = t.nome;
    },
    rinfresca() { if (giornoDi(sch.id) !== S.g) { this.chiudi(); return; } this.riempi(); },
    async vai(dir, daX = 0) {
      const id = passo(sch.id, dir);
      if (!id || occupato) return;
      const pag = $('.sch3__pagina', schEl);
      await scorri(pag, dir, daX, () => { sch.id = id; this.riempi(); $('.sch3__scorre', schEl).scrollTop = 0; });
      S.attiva = id;
      $('.sch-titolo', schEl)?.focus({ preventScroll: true });
    },
    async chiudi() {
      if (!schEl.open || sch?.chiude) return;
      sch.chiude = true;
      if (piano()) await schEl.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(28px)' }], { duration: 220, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }).finished.catch(() => {});
      schEl.close();
      schEl.getAnimations().forEach(a => a.cancel());
      tornaFuoco();
      sch = null;
    },
    azione(k, b) { if (k === 'chiudi') this.chiudi(); if (k === 'passo') this.vai(+b.dataset.dir); },
    dopoSegno(id, si) { const t = $(`.sch3__quando [data-sotto="${id}"]`, schEl); if (t) t.textContent = si ? quandoSegnata(id) : 'Tocca il sigillo quando ci sei stato'; }
  };
  // scorrere di lato sulla pagina (3): tappa prima o dopo
  function sfogliaScheda(q, area, quale) {
    let p0 = null, dir = null;
    schEl.addEventListener('pointerdown', e => { if (sch?.q !== q || (e.pointerType === 'mouse' && e.button !== 0) || e.target.closest('a, summary, input')) return; p0 = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }; dir = null; });
    schEl.addEventListener('pointermove', e => {
      if (!p0 || e.pointerId !== p0.id || sch?.q !== q) return;
      const dx = e.clientX - p0.x, dy = e.clientY - p0.y;
      if (!dir) { if (Math.hypot(dx, dy) < 10) return; dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v'; if (dir === 'h') try { schEl.setPointerCapture(e.pointerId); } catch {} }
      if (dir !== 'h') return;
      const el = $(area, schEl); const fermo = (dx > 0 && !passo(sch.id, -1)) || (dx < 0 && !passo(sch.id, 1)); const x = fermo ? dx * .25 : dx;
      if (piano() && el) { el.style.translate = `${x.toFixed(1)}px 0`; el.style.opacity = String(Math.max(.35, 1 - Math.abs(x) / 520)); }
    });
    const fine = e => {
      if (!p0 || e.pointerId !== p0.id) return;
      const dx = e.clientX - p0.x, v = Math.abs(dx) / Math.max(1, performance.now() - p0.t), el = $(area, schEl);
      if (dir === 'h' && el) {
        schTolto = true; setTimeout(() => { schTolto = false; }, 60);
        const verso = dx < 0 ? 1 : -1;
        if (passo(sch.id, verso) && (Math.abs(dx) > 70 || v > .45)) quale.vai(verso, piano() ? parseFloat(el.style.translate) || 0 : 0);
        else { const da = { translate: el.style.translate || '0px 0', opacity: el.style.opacity || '1' }; el.style.translate = ''; el.style.opacity = ''; if (piano()) el.animate([da, { translate: '0px 0', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' }); }
      }
      p0 = null; dir = null;
    };
    schEl.addEventListener('pointerup', fine);
    schEl.addEventListener('pointercancel', fine);
  }
  sfogliaScheda(3, '.sch3__pagina', Q3);
  // «Modifica il giorno» (3): «−» per togliere, maniglia per spostare, i tratti si nascondono; «Fatto» in basso
  const barraModifica = () => `<div class="modifica-barra" role="region" aria-label="Modifica il giorno"><p>${ic('maniglia', 18)}Trascina dalla maniglia per cambiare l'ordine. «−» toglie la tappa.</p><button type="button" class="f-bottone" data-azione="modifica-fine">Fatto</button></div>`;
  function modifica(si) {
    S.modifica = si;
    P[S.p].aggiorna(() => {});
    if (si) requestAnimationFrame(() => $('.giorno-attivo [data-maniglia]')?.focus({ preventScroll: true }));
    else requestAnimationFrame(() => $('.giorno-attivo [data-azione="modifica"]')?.focus({ preventScroll: true }));
    annuncia(si ? 'Modifica del giorno: togli o sposta le tappe, poi Fatto' : 'Fine della modifica');
  }

  // ---------- 4 · IN CAMMINO ----------
  // Le schede di tutte le tappe del giorno una accanto all'altra: scorri di lato come cammini; tra una e l'altra il tratto a
  // piedi. In cima i puntini delle tappe (le visitate con la soglia chiusa). Nella giornata la strada fatta si colora, anche sulla mappa.
  const Q4 = {
    nome: 'In cammino',
    idea: ['Tocchi una tappa e si aprono le schede di tutto il giorno, una accanto all\'altra: scorri di lato come se camminassi, tra una scheda e l\'altra c\'è il tratto a piedi. In cima i puntini delle tappe: quelle visitate hanno la soglia chiusa.',
      'Nella giornata, sopra le tappe, «2 di 7 visitate». Il pallino della tappa (in D il timbro con l\'ora) si tocca: le soglie si chiudono e la strada fatta fin lì si colora, anche le orme di D e il percorso sulla mappa di C.',
      'Su ogni tappa i tre puntini: segna visitata, sposta su o giù, sposta nell\'altro giorno, togli. Oppure tieni premuta la tappa e trascinala.'],
    apri(id) {
      const p = posizione(id);
      sch = { q: 4, id, ordine: p.ordine };
      schEl.className = 'sch sch4';
      schEl.innerHTML = `<div class="sch4__testa"><button type="button" class="sch4__chiudi" data-azione="chiudi" aria-label="Chiudi le schede">${ic('x', 22)}</button><div class="sch4__punti" role="group" aria-label="Tappe del giorno"></div><span class="sch4__dove num" aria-live="polite"></span></div><div class="sch4__binario" tabindex="-1"></div>`;
      this.riempi();
      if (!schEl.open) schEl.showModal();
      const bin = $('.sch4__binario', schEl);
      const carta = $(`.sch4__carta[data-id="${id}"]`, schEl);
      bin.scrollLeft = carta.offsetLeft - (bin.clientWidth - carta.offsetWidth) / 2;
      this.qui(id);
      if (piano()) { schEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 }); $$('.sch4__carta', schEl).forEach(c => c.animate([{ transform: `translateX(${c.dataset.id === id ? 0 : (c.offsetLeft < carta.offsetLeft ? -60 : 60)}px) translateY(36px) scale(.96)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)', delay: c.dataset.id === id ? 0 : 90 })); }
      $(`.sch4__carta[data-id="${id}"] .sch-titolo`, schEl)?.focus({ preventScroll: true });
      let raf = 0;
      bin.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const c = this.centro(); if (c && c !== sch?.id) this.qui(c); }); }, { passive: true });
    },
    centro() {
      const bin = $('.sch4__binario', schEl);
      if (!bin) return null;
      const m = bin.scrollLeft + bin.clientWidth / 2;
      let best = null, d = Infinity;
      $$('.sch4__carta', bin).forEach(c => { const x = Math.abs(c.offsetLeft + c.offsetWidth / 2 - m); if (x < d) { d = x; best = c.dataset.id; } });
      return best;
    },
    qui(id) {
      sch.id = id;
      const o = sch.ordine, i = o.indexOf(id);
      $$('.sch4__punto', schEl).forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id)));
      $('.sch4__dove', schEl).textContent = `${i + 1} di ${o.length}`;
      $$('.sch4__carta', schEl).forEach(c => { const qui = c.dataset.id === id; c.inert = !qui; c.classList.toggle('sch4__carta--qui', qui); });
      S.attiva = id;
      mappa?.evidenzia(id);
    },
    riempi() {
      const p = posizione(sch.id);
      sch.ordine = p.ordine;
      $('.sch4__punti', schEl).innerHTML = p.ordine.map((id, k) => `<button type="button" class="sch4__punto" data-azione="vai-a" data-id="${id}" data-v-id="${id}"${visitata(id) ? ' data-visitata' : ''} aria-label="${k + 1}. ${esc(T(id).breve)}${visitata(id) ? ', visitata' : ''}">${soglia()}</button>`).join('');
      $('.sch4__binario', schEl).innerHTML = p.ordine.map((id, k) => {
        const tr = k ? trattoVerso(p.Gx, id) : null;
        const v = tappe(p.Gx).find(x => x.id === id);
        return `${tr ? `<div class="sch4__tratto" aria-hidden="true">${ic('piedi', 18)}<b class="num">${tr.min}</b><small>min</small></div>` : ''}<article class="sch4__carta" data-id="${id}" aria-labelledby="sch4-t-${id}">
          <div class="sch4__foto">${fotoScheda(id)}<span class="sch4__num" aria-hidden="true">${k + 1}</span></div>${credito(id)}
          <h2 class="sch-titolo" id="sch4-t-${id}" tabindex="-1">${esc(T(id).nome)}</h2>
          <p class="sch-quando">${v.fatta ? 'Visitata' : `Dalle ${ora(v.inizio)} alle ${ora(v.fine)}`}${tr ? `<span>, ${tr.min} min a piedi da ${esc(T(p.ordine[k - 1]).breve)}</span>` : ''}</p>
          ${bottoneV(id)}${chips(id)}<div class="sch-testo">${testoScheda(id)}</div>${sezioni(id)}${fontiScheda(id)}${azioniScheda(id)}</article>`;
      }).join('');
      $$('.sch4__carta', schEl).forEach(c => { c.inert = c.dataset.id !== sch.id; });
    },
    rinfresca() {
      if (!nelViaggio(sch.id) || giornoDi(sch.id) !== S.g) { this.chiudi(); return; }
      const bin = $('.sch4__binario', schEl), x = bin.scrollLeft, id = sch.id;
      this.riempi();
      const c = $(`.sch4__carta[data-id="${id}"]`, schEl);
      bin.scrollLeft = c ? c.offsetLeft - (bin.clientWidth - c.offsetWidth) / 2 : x;
      this.qui(id);
    },
    vaiA(id) {
      const bin = $('.sch4__binario', schEl), c = $(`.sch4__carta[data-id="${id}"]`, schEl);
      if (!c) return;
      bin.scrollTo({ left: c.offsetLeft - (bin.clientWidth - c.offsetWidth) / 2, behavior: piano() ? 'smooth' : 'auto' });
      this.qui(id);
      $('.sch-titolo', c)?.focus({ preventScroll: true });
    },
    async chiudi() {
      if (!schEl.open || sch?.chiude) return;
      sch.chiude = true;
      if (piano()) await schEl.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.97)' }], { duration: 200, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }).finished.catch(() => {});
      schEl.close();
      schEl.getAnimations().forEach(a => a.cancel());
      tornaFuoco();
      sch = null;
    },
    azione(k, b) { if (k === 'chiudi') this.chiudi(); if (k === 'vai-a') this.vaiA(b.dataset.id); },
    dopoSegno(id, si) { $$(`.sch4__punto[data-id="${id}"]`, schEl).forEach(b => { b.toggleAttribute('data-visitata', si); if (si) animaSoglia(b, true); }); }
  };
  schEl.addEventListener('keydown', e => {
    if (sch?.q !== 4 || !['ArrowLeft', 'ArrowRight'].includes(e.key) || e.target.closest('input')) return;
    const o = sch.ordine, i = o.indexOf(sch.id) + (e.key === 'ArrowRight' ? 1 : -1);
    if (i < 0 || i >= o.length) return;
    e.preventDefault();
    Q4.vaiA(o[i]);
  });
  // il menu «⋯» di una tappa (4): segna, su, giù, altro giorno, togli
  const menuEl = $('#menu-tappa');
  let menuDa = null;
  function apriMenuTappa(b) {
    const id = b.dataset.id, g = giornoDi(id), i = S.giorni[g].indexOf(id), n = S.giorni[g].length, vis = visitata(id);
    menuDa = b;
    menuEl.innerHTML = `<p class="menu-t">${esc(T(id).breve)}</p>
      ${puoiSegnare() ? `<button type="button" data-m="visitata">${soglia(vis ? 'soglia--si' : '')}${vis ? 'Segna da visitare' : 'Segna visitata'}</button>` : ''}
      <button type="button" data-m="su"${i === 0 ? ' disabled' : ''}>${ic('su', 20)}Sposta su</button>
      <button type="button" data-m="giu"${i === n - 1 ? ' disabled' : ''}>${ic('giu', 20)}Sposta giù</button>
      ${range(nG()).filter(k => k !== g).map(k => `<button type="button" data-m="giorno" data-g="${k}">${ic('calendario', 20)}Sposta nel giorno ${k + 1}</button>`).join('')}
      <button type="button" data-m="scheda">${ic('info', 20)}Apri la scheda</button>
      <button type="button" data-m="togli" class="menu-togli">${ic('cestino', 20)}Togli dal giorno ${g + 1}</button>`;
    menuEl.dataset.id = id;
    menuEl.showPopover?.();
    b.setAttribute('aria-expanded', 'true');
    const r = b.getBoundingClientRect(), w = menuEl.offsetWidth, h = menuEl.offsetHeight;
    menuEl.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, r.right - w))}px`;
    menuEl.style.top = `${r.bottom + 6 + h > innerHeight - 8 ? Math.max(8, r.top - h - 6) : r.bottom + 6}px`;
    $('button:not([disabled])', menuEl)?.focus();
  }
  menuEl.addEventListener('toggle', e => { if (e.newState === 'closed') { menuDa?.setAttribute('aria-expanded', 'false'); } });
  menuEl.addEventListener('keydown', e => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const bb = $$('button:not([disabled])', menuEl), i = bb.indexOf(document.activeElement);
    bb[(i + (e.key === 'ArrowDown' ? 1 : -1) + bb.length) % bb.length]?.focus();
  });
  menuEl.addEventListener('click', e => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    const id = menuEl.dataset.id, g = giornoDi(id), i = S.giorni[g].indexOf(id), k = b.dataset.m;
    menuEl.hidePopover?.();
    if (k === 'visitata') segna(id);
    if (k === 'su') spostaA(id, i - 1);
    if (k === 'giu') spostaA(id, i + 1);
    if (k === 'giorno') spostaGiorno(id, +b.dataset.g);
    if (k === 'togli') togliTappa(id);
    if (k === 'scheda') { apriScheda(id, $(`.giorno-attivo [data-azione="tappa"][data-id="${id}"]`)); return; }
    if (k !== 'togli' && k !== 'giorno') requestAnimationFrame(() => $(`.giorno-attivo [data-azione="menu-tappa"][data-id="${id}"]`)?.focus({ preventScroll: true }));
  });

  const Q = { 1: Q1, 2: Q2, 3: Q3, 4: Q4 };

  // =====================================================================================
  // La striscia della prova: proposta (1-4), vista (C o D: la sceglie chi visita), idea, tema
  // =====================================================================================
  const TEMI = ['auto', 'chiaro', 'scuro'];
  let tema = 'auto';
  try { tema = localStorage.getItem('prova-tema') || 'auto'; } catch {}
  function mettiTema() {
    const r = document.documentElement;
    if (tema === 'auto') delete r.dataset.theme; else r.dataset.theme = tema === 'scuro' ? 'dark' : 'light';
    $('#p-tema').innerHTML = `${ic(tema === 'auto' ? 'auto' : tema === 'chiaro' ? 'sole' : 'luna', 20)}<span class="vh">Tema </span><span class="p-tema__t">${tema === 'auto' ? 'Auto' : tema === 'chiaro' ? 'Chiaro' : 'Scuro'}</span>`;
  }
  $('#p-tema').addEventListener('click', () => {
    tema = TEMI[(TEMI.indexOf(tema) + 1) % 3];
    try { localStorage.setItem('prova-tema', tema); } catch {}
    const fai = () => { mettiTema(); if (mappa) mappa.metti(mappa.vb); };
    if (document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
  });
  function prova() {
    $$('#prova [data-q]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.q === VV)));
    $('#p-sera').setAttribute('aria-pressed', String(FINE > 1140));
    $('#p-bordi').setAttribute('aria-pressed', String(mostraBordi));
    $$('#prova [data-p]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === S.p)));
    $('#p-nome').textContent = `Visitata ${VV}: ${NOMI_VV[VV]}`;
    $('#idea').innerHTML = `<h2>Il menù (scelto) e «visitata»</h2><p>${esc(IDEA_M[PM])} In cima «A piedi»: 5, 10, 20 minuti o Tutti, con i minuti di ogni locale anche se vicino non c'è niente di aperto.</p>
      <p class="idea__nota">«Visitata 1 2 3» qui in alto: tocca la porta a sinistra di una tappa (vista C). 1 com'è oggi (le soglie e la spunta); 2 la porta si riempie dal basso e il numero resta, senza spunta; 3 nella porta cade il segnaposto del marchio, «sei passato di qui».</p>
      <p class="idea__nota">In tutte: la riga compare dove sarai all'ora di pranzo (al posto della pausa pranzo) o di cena; i minuti sono quelli veri dalla tappa prima, gli orari quelli scritti dai locali. «Mangia qui» mette il locale nel giorno (con «Annulla»); «No, grazie» toglie la proposta per quel giorno. Niente si aggiunge da solo.</p>
      <p class="idea__nota">Tocca «Sera» qui in alto: i giorni arrivano alle 22:00 e compare anche la cena, dopo l'ultima tappa (se arrivi prima delle 19:30, scegliendo un locale si aggiunge un «Tempo libero» fino alla cena). Con una data (Altro → Data e orari) i locali chiusi quel giorno vanno in fondo.</p>
      <button type="button" class="idea__oggi" data-oggi aria-pressed="${!!adesso()}">${ic('orologio', 18)}<span>${adesso() ? 'Prova «oggi» accesa: il giorno 1 è oggi, sono le 12:10' : 'Prova «oggi»: il giorno 1 è oggi, sono le 12:10'}</span></button>
      <p class="idea__nota">Con «oggi» segni MANN e Tribunali visitati: vanno in cima e gli orari delle altre tappe ripartono dalle 12:10, come fa il sito il giorno stesso. Negli altri giorni la tappa si segna e basta.</p>
      <button type="button" class="idea__da-capo" data-da-capo>Ricomincia la prova da capo</button>`;
  }
  $('#idea').addEventListener('click', e => {
    if (e.target.closest('[data-oggi]')) {
      const si = !adesso();
      $('#idea').hidePopover?.();
      chiudiSchede();
      aggiornaTutto(() => {
        if (si) { S.oggi = true; S.data = OGGI; S.g = 0; S.salvato = true; const l = S.giorni[0] || []; if (!l.some(visitata)) { const t = Date.now(); S.fatte = { ...S.fatte, ...(l[0] ? { [l[0]]: t - 7200000 } : {}), ...(l[1] ? { [l[1]]: t - 3600000 } : {}) }; } }
        else { S.oggi = false; if (S.data === OGGI) S.data = null; }
      });
      const gia = (S.giorni[0] || []).filter(visitata).map(id => T(id).breve);
      avvisa(si ? `Prova «oggi»: il giorno 1 è oggi, sono le ${ora(ORA_FINTA)}.${gia.length ? ` Già visitate: ${gia.join(', ')}.` : ''}` : 'Prova «oggi» spenta: niente data, gli orari sono quelli del piano.');
    }
    if (e.target.closest('[data-da-capo]')) {
      $('#idea').hidePopover?.();
      chiudiSchede();
      try { localStorage.removeItem(CHIAVE); localStorage.removeItem('prova-scheda-scorri'); } catch {}
      aggiornaTutto(() => { Object.assign(S, { ...NUOVO(), p: S.p, q: S.q, t: S.t, r: S.r }); });
      avvisa('Prova ricominciata da «Due giorni a Napoli».');
    }
  });
  $$('#prova [data-q]').forEach(b => b.addEventListener('click', () => { if (+b.dataset.q !== VV) location.hash = `${S.p}${b.dataset.q}`; }));
  $('#p-sera').addEventListener('click', () => { FINE = FINE > 1140 ? 1140 : 1320; memo.clear(); aggiornaTutto(() => {}); avvisa(FINE > 1140 ? 'Sera: i giorni arrivano alle 22:00, compare anche la cena.' : 'I giorni finiscono di nuovo alle 19:00.'); });
  $('#p-bordi').addEventListener('click', () => { mostraBordi = !mostraBordi; document.documentElement.classList.toggle('bordi-su', mostraBordi); prova(); });
  $('#p-cerca').addEventListener('click', () => apriAggiungi(ricercaAperta));
  $$('#prova [data-p]').forEach(b => b.addEventListener('click', () => { if (b.dataset.p !== S.p) location.hash = `${b.dataset.p}${VV}`; }));
  function daHash(primo) {
    const h = location.hash.slice(1), m = /^([cd])?([1-4])?$/.exec(h) || [];
    const p = m[1] || (primo && /^[cd]$/.test(vistaSalvata || '') ? vistaSalvata : null) || S.p || 'c', q = 1, t = 2, r = 4, vv = Math.min(3, +(m[2] || VV));
    if (!primo && p === S.p && vv === VV) return;
    VV = vv; document.documentElement.dataset.vv = String(vv);
    try { localStorage.setItem('prova-scheda-vista', p); } catch {}
    const fai = async () => { await chiudiSchede(); if (menuEl.matches?.(':popover-open')) menuEl.hidePopover(); Object.assign(S, { ...NUOVO(), p, q, t, r, anima: primo || p !== S.p }); rotta = true; disegna(); scrollTo(0, 0); };
    if (!primo && document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else fai();
  }
  addEventListener('hashchange', () => daHash(false));
  computer.addEventListener('change', async () => { await chiudiSchede(); rotta = true; disegna(); });
  addEventListener('resize', () => { if (S.p === 'd') Dp.misura(); if (sch?.q === 1 && schEl.open) Q1.metti(sch.detent, false); });

  $('#p-cerca').innerHTML = `${ic('cerca', 20)}<span>Cerca</span>`;
  mettiTema();
  daHash(true);
  try { if (!localStorage.getItem('prova-mangiare-idea-1')) { $('#idea').showPopover?.(); localStorage.setItem('prova-mangiare-idea-1', '1'); } } catch {}
})();
