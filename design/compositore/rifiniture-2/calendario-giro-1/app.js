// Tranche 2 · calendario (3 proposte) e barre di scorrimento (2 per tema). Una prova, non il sito: i dati veri arrivano da
// genera.mjs (pronti «Due giorni» e «Tre giorni», giorni di chiusura delle tappe da tappe.yaml, le tappe in città).
const DATI = /*DATI*/null;
const SFONDI = /*SFONDI*/null;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------- date (in UTC, come il sito: niente sorprese con l'ora legale) ----------
const SETT = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const NOMI_SETT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const IL_SETT = ['La domenica', 'Il lunedì', 'Il martedì', 'Il mercoledì', 'Il giovedì', 'Il venerdì', 'Il sabato'];
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const MIN = '2026-01-01', MAX = '2030-12-31';
const pad = n => String(n).padStart(2, '0');
const utc = s => new Date(s + 'T00:00:00Z');
const isoDi = d => d.toISOString().slice(0, 10);
const piu = (s, n) => { const d = utc(s); d.setUTCDate(d.getUTCDate() + n); return isoDi(d); };
const OGGI = (() => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; })();
const sett = s => utc(s).getUTCDay();
const lunga = s => `${NOMI_SETT[sett(s)]} ${+s.slice(8)} ${MESI[+s.slice(5, 7) - 1]}`;
const conAnno = s => `${lunga(s)}${s.slice(0, 4) === OGGI.slice(0, 4) ? '' : ` ${s.slice(0, 4)}`}`;
const nomeMese = m => `${MESI[+m.slice(5, 7) - 1]} ${m.slice(0, 4)}`;
const meseDopo = (m, n) => { const d = utc(m + '-01'); d.setUTCMonth(d.getUTCMonth() + n); return isoDi(d).slice(0, 7); };
const giorniDelMese = m => { const d = utc(m + '-01'); d.setUTCMonth(d.getUTCMonth() + 1); d.setUTCDate(0); return d.getUTCDate(); };
const dentro = s => s >= MIN && s <= MAX;
const elenca = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a.at(-1)}`;

// ---------- stato (anche nell'indirizzo, per le immagini) ----------
const S = { pezzo: 'cal', p: 1, v: 'c', t: document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), it: 'due-giorni', d: null, a: false, m: OGGI.slice(0, 7) };
for (const [k, v] of new URLSearchParams(location.hash.slice(1))) if (k in S) S[k] = k === 'p' ? +v : k === 'a' ? v === '1' : v;
if (S.d) S.m = S.d.slice(0, 7);
const scriviIndirizzo = () => { try { history.replaceState(null, '', '#' + new URLSearchParams({ pezzo: S.pezzo, p: S.p, v: S.v, t: S.t, it: S.it, ...(S.d ? { d: S.d } : {}) })); } catch { /* nella pagina pubblicata l'indirizzo non si cambia: non serve */ } };

const GIORNI = () => DATI.itinerari[S.it].giorni;
// per una data di partenza: ogni giorno del viaggio con le tappe chiuse quel giorno della settimana
const chiusiDa = s => GIORNI().map((g, k) => { const x = piu(s, k); return { k, x, nomi: g.chiusi[SETT[sett(x)]] ?? [] }; });
const quantiChiusi = s => chiusiDa(s).reduce((n, g) => n + g.nomi.length, 0);
const nelViaggio = x => { if (!S.d) return -1; const n = GIORNI().length; for (let k = 0; k < n; k++) if (piu(S.d, k) === x) return k; return -1; };
const annuncia = t => { const a = $('.annuncio'); a.textContent = ''; requestAnimationFrame(() => { a.textContent = t; }); };
const fraseChiusi = s => { const c = chiusiDa(s).filter(g => g.nomi.length); return c.length ? `chiusi ${c.map(g => `${elenca(g.nomi)} (giorno ${g.k + 1})`).join(', ')}` : 'tutto aperto'; };

// ---------- icone (tratto 1,8 come nel compositore) ----------
const IC = {
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  giu: '<path d="m6 9 6 6 6-6"/>',
  sx: '<path d="m15 6-6 6 6 6"/>',
  dx: '<path d="m9 6 6 6-6 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  ok: '<path d="m5 12.5 4.2 4.2L19 7"/>',
  cerca: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  piu: '<path d="M12 5v14M5 12h14"/>'
};
const ic = (n, z = 20) => `<svg class="ic" width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

// ---------- le proposte ----------
const PROPOSTE = {
  cal: [
    { n: 1, nome: 'Il mese', dice: 'il mese si apre sotto il campo; scorri di lato per gli altri mesi' },
    { n: 2, nome: 'La striscia', dice: 'i giorni in fila, già con le tappe chiuse; un tocco e il viaggio è segnato' },
    { n: 3, nome: 'Tutti i mesi', dice: 'un foglio intero con i mesi uno sotto l\'altro; i giorni a rischio hanno un punto' }
  ],
  barre: {
    c: [{ n: 1, nome: 'Il filo', dice: 'sottile, color pervinca, quasi invisibile finché non serve' }, { n: 2, nome: 'Il percorso', dice: 'la linea a puntini delle tappe, con il segno che scorre' }],
    d: [{ n: 1, nome: 'La matita', dice: 'un tratto di grafite sul margine della carta' }, { n: 2, nome: 'Il nastro', dice: 'un nastro d\'inchiostro blu, cucito come i francobolli' }]
  }
};
const proposte = () => S.pezzo === 'cal' ? PROPOSTE.cal : PROPOSTE.barre[S.v];

// ---------- pezzi comuni del foglio «Data e orari» ----------
const riepilogo = () => S.d ? `<ul class="riep" aria-label="I giorni del viaggio">${chiusiDa(S.d).map(g => `<li><b>Giorno ${g.k + 1}</b><span>${conAnno(g.x)}</span>${g.nomi.length ? `<span class="f-et f-et--attenzione">Chiusi: ${esc(elenca(g.nomi))}</span>` : `<span class="f-et">${ic('ok', 14)}Tutto aperto</span>`}</li>`).join('')}</ul>` : '';
const campo = (controlla, aperto) => `<div class="campo">
  <span class="campo__et" id="et-data">Primo giorno</span>
  <button type="button" class="campo__b${S.d ? '' : ' campo__b--vuoto'}" data-a="campo" aria-expanded="${aperto}" aria-controls="${controlla}" aria-labelledby="et-data val-data">
    ${ic('cal', 22)}<span id="val-data">${S.d ? conAnno(S.d) : 'Scegli il giorno'}</span>${ic('giu', 18)}
  </button></div>`;
const orari = () => `<div class="f-campi-due">
  <label class="f-campo"><span>Inizio del giorno 1</span><input type="time" step="900" value="${pad(GIORNI()[0].inizio.split(':')[0])}:${GIORNI()[0].inizio.split(':')[1]}"></label>
  <label class="f-campo"><span>Fine del giorno 1</span><input type="time" step="900" value="${GIORNI()[0].fine}"></label></div>
  <label class="f-spunta"><input type="checkbox"><span>Solo a piedi, senza metro, funicolari e autobus<small>Vale per tutti i giorni di questo itinerario.</small></span></label>
  <div class="f-conferma"><button type="button" class="f-bottone" data-a="chiudi">Fatto</button>${S.d ? '<button type="button" class="f-bottone f-bottone--contorno" data-a="senza">Togli la data</button>' : ''}</div>`;
const NOTA = '<p class="f-nota">Con la data vedi quali tappe sono chiuse proprio quel giorno e i mezzi del sabato e della domenica. Senza data i giorni di chiusura restano nella scheda di ogni tappa.</p>';

// una griglia di un mese (proposte 1 e 3). «punti»: segna i giorni di partenza con tappe chiuse
const griglia = (m, { punti = false, fuoco = null, etichetta } = {}) => {
  const primo = (sett(m + '-01') + 6) % 7, n = giorniDelMese(m);
  const celle = [...Array(primo).fill(null), ...Array.from({ length: n }, (_, i) => `${m}-${pad(i + 1)}`)];
  while (celle.length % 7) celle.push(null);
  const righe = [];
  for (let i = 0; i < celle.length; i += 7) righe.push(celle.slice(i, i + 7));
  const N = GIORNI().length;
  return `<table class="gr" aria-label="${etichetta ?? nomeMese(m)}"><thead><tr>${['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'].map((w, i) => `<th scope="col" abbr="${NOMI_SETT[(i + 1) % 7]}">${w.slice(0, 2)}</th>`).join('')}</tr></thead><tbody>${righe.map(r => `<tr>${r.map(x => {
    if (!x) return '<td></td>';
    const k = nelViaggio(x), c = punti ? quantiChiusi(x) : 0, ok = dentro(x);
    const cl = ['g', x === OGGI && 'g--oggi', x < OGGI && 'g--prima', k >= 0 && 'g--viaggio', k === 0 && 'g--inizio', k === N - 1 && 'g--fine'].filter(Boolean).join(' ');
    const td = ['', k >= 0 && 'in', k === 0 && 'in-primo', k === N - 1 && 'in-ultimo'].filter(Boolean).join(' ');
    const dopo = `${MESI[+x.slice(5, 7) - 1]}${x === OGGI ? ', oggi' : ''}${k >= 0 ? `, giorno ${k + 1} del viaggio` : ''}${punti && c ? `, partendo qui ${c === 1 ? 'una tappa è chiusa' : `${c} tappe sono chiuse`}` : ''}`;
    return `<td class="${td.trim()}"><button type="button" class="${cl}" data-d="${x}" aria-pressed="${k === 0}" tabindex="${x === fuoco ? 0 : -1}"${ok ? '' : ' disabled'}><span class="vh">${NOMI_SETT[sett(x)]} </span><span class="g__n">${+x.slice(8)}</span><span class="vh"> ${dopo}</span>${k >= 0 ? `<span class="g__k" aria-hidden="true">${k + 1}</span>` : ''}${punti && c ? '<span class="g__punto" aria-hidden="true"></span>' : ''}</button></td>`;
  }).join('')}</tr>`).join('')}</tbody></table>`;
};
const fuocoDi = m => S.d?.startsWith(m) ? S.d : OGGI.startsWith(m) ? OGGI : `${m}-01`;

// ---------- proposta 1 · il mese ----------
let verso = 0;
const p1 = () => `${campo('m1', S.a)}
  <div class="m1" id="m1"${S.a ? '' : ' hidden'}>
    <div class="m1__testa">
      <button type="button" class="tondino" data-a="mese" data-v="-1" aria-label="Mese prima"${S.m <= MIN.slice(0, 7) ? ' disabled' : ''}>${ic('sx')}</button>
      <h2 class="m1__titolo" aria-live="polite">${nomeMese(S.m)}</h2>
      <button type="button" class="tondino" data-a="mese" data-v="1" aria-label="Mese dopo"${S.m >= MAX.slice(0, 7) ? ' disabled' : ''}>${ic('dx')}</button>
    </div>
    <div class="m1__corpo${verso ? ` m1__corpo--${verso > 0 ? 'dx' : 'sx'}` : ''}">${griglia(S.m, { fuoco: fuocoDi(S.m) })}</div>
    <div class="m1__piede">${S.m === OGGI.slice(0, 7) ? '<span class="m1__aiuto">Il cerchio è oggi.</span>' : '<button type="button" class="f-link-b" data-a="oggi">Torna a oggi</button>'}${S.d ? `<span class="m1__scelta">${GIORNI().length} giorni: ${chiusiDa(S.d).some(g => g.nomi.length) ? 'qualcosa è chiuso' : 'tutto aperto'}</span>` : ''}</div>
  </div>
  ${riepilogo()}`;

// ---------- proposta 2 · la striscia ----------
const DA = () => (S.d && S.d < OGGI ? S.d : OGGI);
const p2 = () => {
  const da = DA(), n = 200;
  const giorni = Array.from({ length: n }, (_, i) => piu(da, i)).filter(dentro);
  const mesi = Array.from({ length: 18 }, (_, i) => meseDopo(OGGI.slice(0, 7), i)).filter(m => m <= MAX.slice(0, 7));
  const N = GIORNI().length, fuoco = S.d && giorni.includes(S.d) ? S.d : giorni[0];
  return `<div class="st">
    <div class="st__testa"><span class="campo__et" id="st-et">Primo giorno</span><span class="st__mese" aria-hidden="true">${nomeMese((S.d ?? da).slice(0, 7))}</span>
      <button type="button" class="f-link-b" data-a="altre" aria-expanded="false" aria-controls="st-mesi">Altri mesi</button></div>
    <div class="st__mesi" id="st-mesi" hidden>${mesi.map(m => `<button type="button" class="f-chip" data-a="vai" data-v="${m}">${MESI[+m.slice(5) - 1].slice(0, 3)}${m.slice(0, 4) === OGGI.slice(0, 4) ? '' : ` ${m.slice(2, 4)}`}</button>`).join('')}</div>
    <div class="st__fila" role="radiogroup" aria-labelledby="st-et">${giorni.map(x => {
      const k = nelViaggio(x), c = quantiChiusi(x), primo = x.endsWith('-01') || x === da;
      return `<button type="button" role="radio" class="t${k >= 0 ? ` t--viaggio${k === 0 ? ' t--inizio' : ''}${k === N - 1 ? ' t--fine' : ''}` : ''}${x === OGGI ? ' t--oggi' : ''}" data-d="${x}" aria-checked="${k === 0}" tabindex="${x === fuoco ? 0 : -1}" aria-label="${lunga(x)}${x === OGGI ? ', oggi' : ''}: ${c ? `partendo qui ${c === 1 ? 'una tappa è chiusa' : `${c} tappe sono chiuse`}` : 'tutto aperto'}${k > 0 ? `, giorno ${k + 1} del viaggio` : ''}">
        ${primo ? `<span class="t__m" aria-hidden="true">${MESI[+x.slice(5, 7) - 1].slice(0, 3)}</span>` : ''}<span class="t__s">${x === OGGI ? 'oggi' : NOMI_SETT[sett(x)].slice(0, 3)}</span><span class="t__n">${+x.slice(8)}</span>
        <span class="t__stato${c ? ' t__stato--chiuso' : ''}">${c ? `${c} chius${c === 1 ? 'a' : 'e'}` : ic('ok', 15)}</span>${k > 0 ? `<span class="t__k">giorno ${k + 1}</span>` : ''}</button>`;
    }).join('')}</div>
    <p class="st__aiuto">${S.d ? `Dal ${lunga(S.d)}: ${fraseChiusi(S.d)}.` : 'Sotto ogni giorno: quante tappe trovi chiuse partendo da lì.'}</p>
  </div>${riepilogo()}`;
};

// ---------- proposta 3 · tutti i mesi (foglio intero) ----------
const legenda = () => {
  const per = {};
  GIORNI().forEach((g, k) => { for (const [s, nomi] of Object.entries(g.chiusi)) (per[s] ??= []).push(`${elenca(nomi)} (giorno ${k + 1})`); });
  const righe = Object.entries(per).sort((a, b) => ((SETT.indexOf(a[0]) + 6) % 7) - ((SETT.indexOf(b[0]) + 6) % 7));
  return righe.length ? `<ul class="mz-leg">${righe.map(([s, t]) => `<li><span class="g__punto" aria-hidden="true"></span>${IL_SETT[SETT.indexOf(s)]}: ${esc(t.join('; '))}</li>`).join('')}</ul>` : '<p class="mz-leg">Nessuna tappa ha un giorno di chiusura.</p>';
};
const mesi3 = () => Array.from({ length: 15 }, (_, i) => meseDopo((S.d && S.d < OGGI ? S.d : OGGI).slice(0, 7), i)).filter(m => m <= MAX.slice(0, 7));
const p3dialogo = () => {
  const ms = mesi3(), f = S.d && ms.includes(S.d.slice(0, 7)) ? S.d : OGGI;
  return `<div class="mz">
    <div class="mz-testa"><h2 id="mesi-titolo">Quando parti?</h2><button type="button" class="f-chiudi" data-a="mz-chiudi" aria-label="Chiudi">${ic('x')}</button></div>
    <div class="mz-scorre">${legenda()}${ms.map(m => `<section class="mz-mese" data-m="${m}"><h3>${nomeMese(m)}</h3>${griglia(m, { punti: true, fuoco: f.startsWith(m) ? f : null })}</section>`).join('')}</div>
    <div class="mz-piede"><p class="mz-sel" aria-live="polite">${S.d ? `<b>${GIORNI().length > 1 ? `Da ${lunga(S.d)} a ${lunga(piu(S.d, GIORNI().length - 1))}` : lunga(S.d)}</b><span>${fraseChiusi(S.d)}</span>` : '<b>Tocca il primo giorno</b><span>Il punto: partendo lì qualcosa è chiuso.</span>'}</p>
      <button type="button" class="f-bottone" data-a="mz-chiudi">Fatto</button></div>
  </div>`;
};
const p3 = () => `${campo('mesi', false)}${riepilogo()}`;

// ---------- barre di scorrimento: il foglio «Aggiungi una tappa», lungo ----------
const durata = m => m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60}` : ''}` : `${m} min`;
const barre = () => `<div class="f-cerca">${ic('cerca')}<input type="search" aria-label="Cerca una tappa" placeholder="Un luogo, un'opera, un piatto"></div>
  <div class="f-filtri" role="group" aria-label="Cosa cerchi"><button type="button" aria-pressed="true">Da vedere</button><button type="button" aria-pressed="false">Da mangiare</button><button type="button" aria-pressed="false">Gite</button></div>
  <h2 class="f-gruppo-t">Da vedere in città <span>${DATI.elenco.length}</span></h2>
  <ul class="f-lista">${DATI.elenco.map(t => `<li class="f-tappa"><span class="f-senza" aria-hidden="true">${esc(t.n.replace(/^(Il|La|Lo|I|Gli|Le|L')\s*/, '').slice(0, 1).toUpperCase())}</span><span><b>${esc(t.n)}</b><small>${esc(t.z)} · ${durata(t.d)} di visita</small></span><button type="button" class="f-piu" aria-label="Aggiungi ${esc(t.n)} al giorno 1">${ic('piu')}</button></li>`).join('')}</ul>`;

// ---------- disegno ----------
const corpo = $('.f-corpo'), dlg = $('.mesi'), scorre = $('.f-scorre');
function disegna({ fuoco } = {}) {
  const root = document.documentElement;
  root.className = `v${S.v} pezzo-${S.pezzo} p${S.p}${S.pezzo === 'barre' ? ` sb sb-${S.v}${S.p}` : ''}`;
  root.dataset.theme = S.t;
  $$('.prova [data-p]').forEach(b => b.setAttribute('aria-pressed', String(String(S[b.dataset.p]) === b.dataset.v)));
  $('.prova__proposte').innerHTML = proposte().map(p => `<button type="button" data-p="p" data-v="${p.n}" aria-pressed="${p.n === S.p}" aria-label="Proposta ${p.n}, ${p.nome}">${p.n}</button>`).join('');
  const P = proposte().find(p => p.n === S.p) ?? proposte()[0];
  $('.prova__nome').innerHTML = `<b>${P.n} · ${P.nome}</b>: ${P.dice}.${S.pezzo === 'barre' ? ' <span class="campione" aria-hidden="true"><i></i></span><span>Sul telefono la barra vera la disegna il sistema: qui è ridisegnata uguale. Al computer è quella vera.</span>' : ''}`;
  $('.prova__giorni').hidden = S.pezzo !== 'cal';
  $('.scena__sfondo').src = SFONDI[`${S.v}-${S.t}-${innerWidth >= 960 ? 'pc' : 'tel'}`];
  $('#foglio-titolo').textContent = S.pezzo === 'cal' ? 'Data e orari' : 'Aggiungi una tappa';
  corpo.innerHTML = S.pezzo === 'barre' ? barre() : `${NOTA}${S.p === 1 ? p1() : S.p === 2 ? p2() : p3()}${orari()}`;
  verso = 0;
  if (S.pezzo === 'cal' && S.p === 2) mettiStriscia();
  if (S.pezzo === 'cal' && S.p === 3 && dlg.open) { const y = $('.mz-scorre', dlg)?.scrollTop; dlg.innerHTML = p3dialogo(); $('.mz-scorre', dlg).scrollTop = y; }
  if (fuoco) $(fuoco)?.focus({ preventScroll: true });
  scriviIndirizzo();
  requestAnimationFrame(finta);
}

// dove sta un giorno dentro la fila, misurato dal suo inizio
const sinistra = (fila, t) => t.getBoundingClientRect().left - fila.getBoundingClientRect().left + fila.scrollLeft;
// la striscia: il giorno scelto (o oggi) in vista, il mese in alto segue lo scorrimento
function mettiStriscia(liscio = false) {
  const fila = $('.st__fila'); if (!fila) return;
  const b = $(`.t[data-d="${S.d}"]`, fila) ?? $('.t', fila);
  fila.scrollTo({ left: Math.max(0, sinistra(fila, b) - 20), behavior: liscio && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' });
  fila.onscroll = () => {
    const t = $$('.t', fila).find(t => sinistra(fila, t) + t.offsetWidth > fila.scrollLeft + 24);
    if (t) $('.st__mese').textContent = nomeMese(t.dataset.d.slice(0, 7));
  };
}

// ---------- la barra disegnata (solo sul telefono, nella prova delle barre) ----------
function finta() {
  const f = $('.finta'), p = $('.finta__pollice');
  if (S.pezzo !== 'barre') return;
  const { scrollTop: y, scrollHeight: h, clientHeight: c } = scorre;
  f.style.setProperty('--alto', `${scorre.offsetTop}px`);
  f.style.height = `${c}px`;
  const th = Math.max(36, (c * c) / h);
  p.style.height = `${th}px`;
  p.style.transform = `translateY(${h > c ? (y / (h - c)) * (c - th) : 0}px)`;
}
scorre.addEventListener('scroll', () => requestAnimationFrame(finta), { passive: true });
addEventListener('resize', () => { $('.scena__sfondo').src = SFONDI[`${S.v}-${S.t}-${innerWidth >= 960 ? 'pc' : 'tel'}`]; finta(); });
new ResizeObserver(() => document.documentElement.style.setProperty('--prova', `${$('.prova').offsetHeight}px`)).observe($('.prova'));

// ---------- scelta di un giorno ----------
function scegli(x, dove) {
  S.d = x; S.m = x.slice(0, 7);
  annuncia(`Primo giorno ${lunga(x)}: ${fraseChiusi(x)}.`);
  if (dove === 'p3') { disegna(); $(`.mesi [data-d="${x}"]`)?.focus({ preventScroll: true }); return; }
  disegna({ fuoco: dove === 'p2' ? `.t[data-d="${x}"]` : `.m1 [data-d="${x}"]` });
}

// ---------- tocchi ----------
document.addEventListener('click', e => {
  if (inghiotti) { inghiotti = false; return; }
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  if (b.dataset.p) {
    const k = b.dataset.p, v = b.dataset.v;
    S[k] = k === 'p' ? +v : v;
    if (k === 'pezzo') S.p = 1;
    if (k === 'v' && S.pezzo === 'barre') S.p = Math.min(S.p, 2);
    if (k !== 't' && dlg.open) dlg.close();
    disegna({ fuoco: `.prova [data-p="${k}"][data-v="${v}"]` });
    if (k === 'pezzo' || k === 'p') scorre.scrollTop = 0;
    return;
  }
  const a = b.dataset.a, d = b.dataset.d;
  if (d && b.closest('.m1')) return scegli(d, 'p1');
  if (d && b.closest('.st')) { scegli(d, 'p2'); return; }
  if (d && b.closest('.mesi')) return scegli(d, 'p3');
  if (a === 'campo') {
    if (S.p === 1) { S.a = !S.a; if (S.a && S.d) S.m = S.d.slice(0, 7); disegna({ fuoco: S.a ? `.m1 [tabindex="0"]` : '.campo__b' }); return; }
    if (S.p === 3) { apriMesi(); return; }
  }
  if (a === 'mese') { verso = +b.dataset.v; S.m = meseDopo(S.m, verso); disegna({ fuoco: `.m1 [data-a="mese"][data-v="${b.dataset.v}"]` }); return; }
  if (a === 'oggi') { S.m = OGGI.slice(0, 7); disegna({ fuoco: `.m1 [data-d="${OGGI}"]` }); return; }
  if (a === 'senza') { S.d = null; S.a = false; disegna({ fuoco: '.campo__b, .t[tabindex="0"]' }); annuncia('Data tolta.'); return; }
  if (a === 'altre') { const m = $('#st-mesi'); m.hidden = !m.hidden; b.setAttribute('aria-expanded', String(!m.hidden)); return; }
  if (a === 'vai') {
    const fila = $('.st__fila'), t = $(`.t[data-d^="${b.dataset.v}"]`, fila);
    if (t) { fila.scrollTo({ left: sinistra(fila, t) - 20, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); t.focus({ preventScroll: true }); }
    return;
  }
  if (a === 'mz-chiudi') { chiudiMesi(); return; }
  if (a === 'chiudi') { S.a = false; disegna(); annuncia('Nella prova il foglio resta aperto.'); }
});

function apriMesi() {
  dlg.innerHTML = p3dialogo();
  dlg.showModal();
  const m = (S.d ?? OGGI).slice(0, 7), sez = $(`.mz-mese[data-m="${m}"]`, dlg), sc = $('.mz-scorre', dlg);
  if (sez && sez.previousElementSibling?.classList.contains('mz-mese')) sc.scrollTop = sez.offsetTop - sc.offsetTop - 8;
  $('.mesi [tabindex="0"]')?.focus({ preventScroll: true });
}
function chiudiMesi() {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dlg.classList.add('esce');
    setTimeout(() => { dlg.classList.remove('esce'); dlg.close(); }, 220);
  } else dlg.close();
}
dlg.addEventListener('close', () => { disegna({ fuoco: '.campo__b' }); });
dlg.addEventListener('click', e => { if (e.target === dlg) chiudiMesi(); });

// ---------- tastiera nelle griglie (frecce, pagina su e giù per i mesi, inizio e fine della settimana) ----------
document.addEventListener('keydown', e => {
  const b = e.target.closest?.('.g'); if (!b) return;
  const x = b.dataset.d; let y = null;
  if (e.key === 'ArrowLeft') y = piu(x, -1);
  else if (e.key === 'ArrowRight') y = piu(x, 1);
  else if (e.key === 'ArrowUp') y = piu(x, -7);
  else if (e.key === 'ArrowDown') y = piu(x, 7);
  else if (e.key === 'Home') y = piu(x, -((sett(x) + 6) % 7));
  else if (e.key === 'End') y = piu(x, 6 - ((sett(x) + 6) % 7));
  else if (e.key === 'PageUp' || e.key === 'PageDown') { const m = meseDopo(x.slice(0, 7), e.key === 'PageUp' ? -1 : 1); y = `${m}-${pad(Math.min(+x.slice(8), giorniDelMese(m)))}`; }
  if (!y || !dentro(y)) return;
  e.preventDefault();
  let t = $(`[data-d="${y}"]`, b.closest('.m1, .mesi'));
  if (!t && b.closest('.m1')) { verso = y > x ? 1 : -1; S.m = y.slice(0, 7); disegna(); t = $(`.m1 [data-d="${y}"]`); }
  if (!t) return;
  b.tabIndex = -1; t.tabIndex = 0; t.focus({ preventScroll: !b.closest('.mesi') });
  if (b.closest('.mesi')) t.scrollIntoView({ block: 'nearest' });
});
// la striscia: frecce come un gruppo di scelte
document.addEventListener('keydown', e => {
  const b = e.target.closest?.('.t'); if (!b || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
  e.preventDefault();
  const t = /Left|Up/.test(e.key) ? b.previousElementSibling : b.nextElementSibling;
  if (t) scegli(t.dataset.d, 'p2');
});
// il mese della proposta 1 si cambia anche col dito, di lato
let tocco = null, inghiotti = false;
document.addEventListener('pointerdown', e => { if (e.target.closest('.m1__corpo')) tocco = { x: e.clientX, y: e.clientY }; });
document.addEventListener('pointerup', e => {
  if (!tocco) return;
  const dx = e.clientX - tocco.x, dy = e.clientY - tocco.y; tocco = null;
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    const v = dx < 0 ? 1 : -1, m = meseDopo(S.m, v);
    if (m < MIN.slice(0, 7) || m > MAX.slice(0, 7)) return;
    verso = v; S.m = m; inghiotti = true; setTimeout(() => { inghiotti = false; }, 400); disegna();
  }
});

disegna();
if (S.pezzo === 'cal' && S.p === 3 && new URLSearchParams(location.hash.slice(1)).get('a') === '1') apriMesi();
