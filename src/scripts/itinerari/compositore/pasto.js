// Mangiare dentro la giornata (specifica §7, pezzo 7: Enrico sceglie «Il menù», 14/10/2026). Se la giornata attraversa il pranzo
// (12:30–14:30) e non c'è già un locale a quell'ora, la pausa pranzo diventa «Il menù del pranzo»; la cena (19:30–21:30) è sempre
// facoltativa: dopo l'ultima tappa, grande se il giorno arriva almeno alle 20:30, altrimenti solo «Cena?», piccola. Toccando: un
// foglio come la carta di un ristorante, i locali per tipo con i minuti veri dalla tappa prima e fino a che ora sono aperti (orari
// scritti dai locali), «Entro: 5, 10, 20 min, Tutti». «Mangia qui» mette il locale nel giorno (la pausa pranzo resta da parte e
// torna se lo togli; per la cena un «Tempo libero» fino alle 19:30 e il giorno si allunga); «No, grazie» toglie la proposta per quel
// giorno, «Rimettile» la rimette. Niente si aggiunge da solo. Le ore di pranzo e cena sono una regola nostra (pagina, «Da sapere»).
import { $, esc, ic, ora, durataLunga, dopo, piano, computer } from './base.js';
import { C, T, X, G, daFare, tappeDi, nelViaggio, dataDi, giornoSett, dataLungaDi, adessoPer, caricaSchede, schedePronte } from './stato.js';
import { orarioLocale, tappaDi } from '../../../lib/itinerari/calcolo';
import { preparaPasto } from '../../../lib/itinerari/pasti';
import { sequenza, localeDelPranzo } from '../../../lib/itinerari/pause';
import { MAX_TAPPE } from '../../../lib/itinerari/link';
import { S, foglio, chiudiFoglio, contestoFoglio, dopoChiusuraFoglio, rinfresca, avvisa, annuncia, scorri, occupato } from './comuni.js';
import { aggiorna, conAnnulla } from './viste.js';
import { testoScheda, sezioni, fontiScheda } from './scheda.js';

export const PASTI = {
  pranzo: { da: 750, a: 870, ora: 780, pasti: ['pranzo', 'spuntino'] },
  cena: { da: 1170, a: 1290, ora: 1200, pasti: ['cena'] }
};
const CUCINA_NOME = { pizza: 'Pizzerie', napoletana: 'Cucina napoletana', pesce: 'Pesce', carne: 'Carne', strada: 'Cibo di strada', pasta: 'Pasta', dolci: 'Dolci e caffè' };
const GIORNI_ORARI = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
const tipoL = id => CUCINA_NOME[T(id).cucina?.[0]] ?? 'Locali';
const euro = id => (T(id).fascia ? '€'.repeat(T(id).fascia) : '');
const chiaveM = m => `${m.g}-${m.q}`;
const nascosto = (g, q) => !!X().giorni[g]?.noPasti?.includes(q);
const locale = id => !!tappaDi(C, id)?.categoria;

// i momenti del pasto di un giorno: { g, q, dove (la tappa prima), ora (quando sei lì), min, dopo (la tappa dopo), pausa, piccola, nascosto }
export function momenti(g, Gx = G(g)) {
  if (!Gx || X().giorni[g]?.gita) return [];
  const tp = daFare(Gx), out = [];
  if (!tp.length || (C.evento && tp.some(v => v.id === C.evento.id))) return out;   // il giorno di regata ha già il suo tempo per mangiare
  const dopoDi = id => { const i = tp.findIndex(v => v.id === id); return tp[i + 1]?.id ?? null; };
  // il pranzo c'è se c'è il suo locale, anche spostato dopo le 14:30 (pause.ts); la cena se un locale cade nell'ora di cena
  const conLocale = q => tp.some(v => (q === 'pranzo' ? localeDelPranzo(C, v) : locale(v.id) && v.inizio < PASTI[q].a && v.fine > PASTI[q].da));
  const p = Gx.pause.find(x => x.quale === 'pranzo');
  if (p && !conLocale('pranzo')) out.push({ g, q: 'pranzo', dove: p.dove, ora: p.inizio, min: p.min, pausa: true, dopo: dopoDi(p.dove), nascosto: nascosto(g, 'pranzo') });
  const Ce = PASTI.cena, ultima = tp[tp.length - 1];
  if (!conLocale('cena') && !locale(ultima.id) && Gx.inizio < Ce.a) {
    const fineU = ultima.fine + Gx.pause.filter(x => x.dove === ultima.id).reduce((s, x) => s + x.min, 0);
    if (Gx.fineScelta >= Ce.a - 60) {
      if (fineU <= Ce.a) out.push({ g, q: 'cena', dove: ultima.id, ora: Math.max(fineU, Ce.da), min: 60, dopo: null, attesa: Math.max(0, Ce.da - fineU), nascosto: nascosto(g, 'cena') });
      else {
        const v = tp.slice(0, -1).reduce((a, b) => (Math.abs(b.fine - Ce.ora) < Math.abs(a.fine - Ce.ora) ? b : a), tp[0]);
        if (v.fine >= Ce.da - 30 && v.fine <= Ce.a) out.push({ g, q: 'cena', dove: v.id, ora: v.fine, min: 60, dopo: dopoDi(v.id), nascosto: nascosto(g, 'cena') });
      }
    } else if (fineU <= Ce.a && !nascosto(g, 'cena')) out.push({ g, q: 'cena', dove: ultima.id, ora: Math.max(fineU, Ce.da), min: 60, dopo: null, attesa: Math.max(0, Ce.da - fineU), piccola: true });
  }
  return out;
}
const trovaM = k => { const [g, q] = k.split('-'); return momenti(+g).find(m => m.q === q) ?? null; };

// fino a che ora è aperto (la fascia che contiene t; senza data, la più corta tra i giorni con quella fascia)
function finoA(L, g, t) {
  const giorni = X().data ? [L.orari?.[GIORNI_ORARI.indexOf(giornoSett(g))]] : L.orari ?? [];
  const fini = [];
  for (const f of giorni) if (f) for (let k = 0; k < f.length; k += 2) if (t >= f[k] && f[k + 1] !== -1 && t < f[k + 1]) fini.push(f[k + 1]);
  return fini.length ? Math.min(...fini) % 1440 : null;
}
// i locali per quel momento: minuti dalla tappa prima, aperto o no all'arrivo
const memoV = new Map();
let tempiMemo = null, vivoMemo = null;
function vicini(m) {
  if (tempiMemo !== C.tempi || vivoMemo !== C.vivo) { memoV.clear(); tempiMemo = C.tempi; vivoMemo = C.vivo; }
  const x = X(), adesso = adessoPer(x, m.g), chiave = JSON.stringify([x.id, m, x.giorni, x.data, x.piedi, x.margine, adesso]);
  if (memoV.has(chiave)) return memoV.get(chiave);
  const data = dataDi(m.g), sett = data ? giornoSett(m.g) : null;
  const lista = C.tappe.filter(L => L.categoria && !nelViaggio(L.id) && (L.pasto ?? []).some(p => PASTI[m.q].pasti.includes(p)) && !(m.q === 'pranzo' && L.cucina?.includes('dolci') && !L.pasto.includes('pranzo'))).map(L => {
    const prova = preparaPasto(C, x, m, L.id, adesso);
    if (!prova) return null;
    const k = prova.calcolo.voci.findIndex(v => v.tipo === 'tappa' && v.id === L.id), voce = prova.calcolo.voci[k];
    const tratto = prova.calcolo.voci[k - 1], min = tratto?.tipo === 'tratto' ? tratto.min : 0, arrivo = voce.inizio;
    let stato = 'aperto', nota = '';
    if (arrivo >= 1440) { stato = 'ignoto'; nota = 'arrivo dopo mezzanotte: orario non verificato'; }
    else if (sett && L.chiuso.includes(sett)) { stato = 'chiuso'; nota = 'chiuso quel giorno'; }
    else if (!(sett ? Array.isArray(L.orari?.[GIORNI_ORARI.indexOf(sett)]) : L.orari?.some(f => Array.isArray(f)))) {
      stato = 'ignoto'; nota = 'orario non pubblicato: controlla la scheda';
    }
    else {
      const o = orarioLocale(L, data, arrivo, L.durata);
      if (o?.chiude != null) { stato = 'stretto'; nota = `chiude alle ${ora(o.chiude % 1440)}`; }
      else if (o?.apre != null) { stato = 'chiuso'; nota = `apre alle ${ora(o.apre)}`; }
      else if (o) { stato = 'chiuso'; nota = 'a quell\'ora è chiuso'; }
    }
    const fino = stato === 'aperto' ? finoA(L, m.g, arrivo) : null;
    if (stato === 'aperto') nota = fino != null ? `aperto fino alle ${ora(fino)}` : 'aperto';
    return { id: L.id, min, arrivo, stato, nota, mezzi: tratto?.tipo === 'tratto' && tratto.mezzi.length > 0 };
  }).filter(Boolean).sort((a, b) => (a.stato === 'chiuso') - (b.stato === 'chiuso') || a.min - b.min || a.id.localeCompare(b.id));
  if (memoV.size > 200) memoV.clear();
  memoV.set(chiave, lista);
  return lista;
}
const conOrarioAperto = x => x.stato === 'aperto' || x.stato === 'stretto';
const aperti = (m, max = 10) => vicini(m).filter(x => conOrarioAperto(x) && x.min <= max);
function riassuntoM(m) {
  const n = aperti(m).length;
  if (n) return `${n === 1 ? 'un locale aperto' : `${n} locali aperti`} a 10 minuti da ${T(m.dove).breve}`;
  if (vicini(m).some(x => x.stato === 'ignoto')) return 'per alcuni locali l’apertura non è verificata: controlla le schede nel menù';
  const p = vicini(m).find(conOrarioAperto);
  return p ? `qui vicino a quell'ora è tutto chiuso: il più vicino aperto è ${T(p.id).breve}, a ${p.min} minuti` : 'a quell\'ora non c\'è niente di aperto';
}

// «Mangia qui»: il locale entra nel giorno dopo la tappa prima. La pausa pranzo resta nei dati (torna se togli il locale);
// per la cena, se arrivi prima delle 19:30, un «Tempo libero» fino alla cena, e il giorno si allunga fino a dopo cena.
function mangiaQui(m, id) {
  const g = m.g, D = X().giorni[g];
  if (!D) return;
  if (D.tappe.length >= MAX_TAPPE) { avvisa(`Al massimo ${MAX_TAPPE} tappe per giorno.`); return; }
  const proposta = preparaPasto(C, X(), m, id, adessoPer(X(), g));
  if (!proposta) { avvisa('La giornata è cambiata e il locale non è stato aggiunto. Riapri il menù per scegliere dove mangiare.'); return; }
  conAnnulla(`${T(id).breve}: ${m.q === 'pranzo' ? 'pranzo' : 'cena'} nel giorno ${g + 1}.`, y => {
    y.giorni[g] = proposta.giorno;
    S.nuova = id;
  });
}
function noGrazie(m) {
  aggiorna(y => { const D = y.giorni[m.g]; D.noPasti = [...new Set([...(D.noPasti ?? []), m.q])]; });
  annuncia(m.q === 'pranzo' ? `Niente proposte per il pranzo del giorno ${m.g + 1}: resta la pausa` : `Niente proposte per la cena del giorno ${m.g + 1}`);
}
function rimetti(k) {
  const [g, q] = k.split('-');
  aggiorna(y => { const D = y.giorni[+g]; D.noPasti = (D.noPasti ?? []).filter(x => x !== q); if (!D.noPasti.length) delete D.noPasti; });
  annuncia('Proposte rimesse');
}

// la sequenza del giorno con il pasto: la pausa pranzo diventa la riga del menù; la cena va dopo la sua tappa (e le sue pause)
export function sequenzaM(Gx, g) {
  const voci = sequenza(Gx);
  for (const m of momenti(g, Gx)) {
    if (m.pausa) { const i = voci.findIndex(v => v.tipo === 'pausa' && v.quale === 'pranzo'); if (i >= 0) { if (m.nascosto) voci.splice(i + 1, 0, { tipo: 'pasto', m }); else voci[i] = { tipo: 'pasto', m }; } continue; }
    let i = voci.findIndex(v => v.tipo === 'tappa' && v.id === m.dove);
    while (voci[i + 1]?.tipo === 'pausa') i++;
    voci.splice(i + 1, 0, { tipo: 'pasto', m });
  }
  return voci;
}

// ---------- la riga nella giornata (vista c o d) ----------
const datiM = m => `data-k="${chiaveM(m)}"`;
export function rigaPasto(m, vista, stile = '') {
  const tag = vista === 'c' ? 'li' : 'div', chiave = `data-chiave="pasto-${m.q}"${stile}`;
  if (m.piccola) return `<${tag} class="${vista}-pasto pasto-piccola" ${chiave}><button type="button" class="pm-cena" data-azione="pasto-apri" ${datiM(m)}><span class="pm-ic" aria-hidden="true">${ic('posate', 16)}</span><span><b>Cena?</b><small>Facoltativa: i locali aperti dalle 19:30 vicino a ${esc(T(m.dove).breve)}</small></span>${ic('piu', 18)}</button></${tag}>`;
  if (m.nascosto) return `<${tag} class="${vista}-pasto pasto-nascosto" ${chiave}><p class="pm-rimetti">${ic('posate', 16)}<span>${m.q === 'pranzo' ? 'Niente proposte per il pranzo' : 'Niente proposte per la cena'}</span><button type="button" class="pm-link" data-azione="pasto-si" ${datiM(m)}>Rimettile</button></p></${tag}>`;
  const ap = aperti(m), tipi = [...new Set(ap.map(x => tipoL(x.id)))];
  const pausa = m.pausa ? `<button type="button" class="pm-link" data-azione="pausa" data-quale="pranzo">Pausa di ${durataLunga(m.min)}: cambia</button>` : '';
  return `<${tag} class="${vista}-pasto pasto-2" ${chiave}><button type="button" class="pm2" data-azione="pasto-apri" ${datiM(m)}>
    <span class="pm2__carta" aria-hidden="true"><i>${m.q === 'pranzo' ? 'Pranzo' : 'Cena'}</i></span>
    <span class="pm2__t"><span class="pm-ora"><span class="num">${ora(m.ora)}</span>${m.pausa ? ` – <span class="num">${ora(m.ora + m.min)}</span>` : ''}</span><b>Il menù ${m.q === 'pranzo' ? 'del pranzo' : 'della cena'}</b><small>${ap.length ? `${ap.length} aperti intorno a ${esc(T(m.dove).breve)}${tipi.length ? `: ${tipi.slice(0, 3).map(x => x.toLowerCase()).join(', ')}` : ''}` : esc(riassuntoM(m))}. Dentro anche tutti gli altri, con i minuti.</small></span>
    <span class="pm2__apri">Apri${ic('avanti', 16)}</span></button>
    <p class="pm-piede">${pausa}<button type="button" class="pm-link pm-link--no" data-azione="pasto-no" ${datiM(m)}>No, grazie</button></p></${tag}>`;
}

// ---------- il menù: i locali per tipo, con i puntini fino ai minuti; quanto vuoi camminare in cima ----------
let ordineLocali = [];
let richiestaSchedaPasto = 0;
function contestoPasto(m) {
  const x = X(), giorno = x.giorni[m.g], g = S.g, p = S.p;
  return () => !!giorno && X() === x && x.giorni[m.g] === giorno && S.g === g && S.p === p;
}
function collegaPasto(f, m, torna, quanto, sfoglia) {
  const dati = contestoPasto(m), aperto = contestoFoglio(), esegui = dopoChiusuraFoglio(dati);
  const visibile = () => aperto() && dati();
  f.onclick = e => { if (visibile()) return clic(e, f, m, torna, quanto, sfoglia, esegui, dati, visibile); };
  return visibile;
}

function apriMenu(m, max = aperti(m).length ? 10 : 0) {
  let mx = max;
  const corpo = () => {
    const entro = x => !mx || x.min <= mx, tutti = vicini(m), si = tutti.filter(x => x.stato !== 'chiuso' && entro(x)), no = tutti.filter(x => x.stato === 'chiuso' && entro(x));
    const gruppi = [...new Set(si.map(x => tipoL(x.id)))].map(t => [t, si.filter(x => tipoL(x.id) === t)]);
    ordineLocali = [...gruppi.flatMap(([, l]) => l), ...no].map(x => x.id);
    const voce = x => `<li class="mn-v${x.stato === 'chiuso' ? ' mn-v--chiuso' : ''}"><details><summary><span class="mn-nome">${esc(T(x.id).nome)}</span><span class="mn-punti" aria-hidden="true"></span><span class="mn-min num">${x.min < 2 ? 'accanto' : `${x.min} min`}</span><small class="mn-sotto">${esc(x.nota)}${euro(x.id) ? ` · ${euro(x.id)}` : ''}${x.mezzi ? ' · con i mezzi' : ''}</small></summary>
      <div class="mn-dentro"><p>${esc(T(x.id).frase || '')}</p><div class="mn-az">${x.stato === 'chiuso' ? '' : `<button type="button" class="f-bottone" data-f="scegli" data-v="${x.id}">${ic('posate', 18)}Mangia qui, dalle ${ora(x.arrivo)}</button>`}<button type="button" class="f-bottone f-bottone--contorno" data-f="scheda" data-v="${x.id}">La scheda</button></div></div></details></li>`;
    const primo = tutti.find(conOrarioAperto);
    return `<div class="mn"><p class="mn-testa"><i>${m.q === 'pranzo' ? 'Pranzo' : 'Cena'}</i><span>dalle <span class="num">${ora(m.ora)}</span>, intorno a ${esc(T(m.dove).breve)}</span></p>
      <div class="mn-quanto" role="group" aria-label="Tempo per arrivare al locale"><span>Entro:</span>${[5, 10, 20, 0].map(k => `<button type="button" data-f="quanto" data-v="${k}" aria-pressed="${k === mx}">${k ? `${k} min` : 'Tutti'}</button>`).join('')}</div>
      ${gruppi.length ? gruppi.map(([t, l]) => `<section class="mn-gruppo"><h3>${esc(t)}</h3><ul>${l.map(voce).join('')}</ul></section>`).join('') : `<div class="mn-vuoto"><p>A ${mx} minuti, a quell'ora, è tutto chiuso. ${primo ? `Il più vicino aperto è ${esc(T(primo.id).breve)}, a ${primo.min} minuti.` : ''}</p><button type="button" class="f-bottone" data-f="quanto" data-v="0">Vedi tutti i locali, con i minuti</button></div>`}
      ${no.length ? `<section class="mn-gruppo mn-gruppo--chiusi"><h3>Chiusi a quell'ora</h3><ul>${no.map(voce).join('')}</ul></section>` : ''}
      <p class="mn-piede">Orari scritti dai locali${X().data ? `, ${dataLungaDi(m.g)}` : '; senza data valgono per i giorni in cui sono aperti'}. Le ore di pranzo (12:30–14:30) e cena (19:30–21:30) sono una regola nostra. Scegli tu: niente si aggiunge da solo.</p></div>`;
  };
  foglio(m.q === 'pranzo' ? 'Il menù del pranzo' : 'Il menù della cena', `<div id="f-vivo">${corpo()}</div>`, f => {
    collegaPasto(f, m, () => apriMenu(m, mx), k => { mx = k; rinfresca(f, corpo(), { dataset: { f: 'quanto', v: String(k) } }); });
  }, 'f--pasto f--menu');
}
// la scheda del locale: la scheda vera e «Mangia qui» con l'ora; in fondo «Prima» e «Dopo» (nell'ordine del menù), col dito di lato
function paginaPasto(id, m, indietro, lista) {
  const x = vicini(m).find(y => y.id === id), i = lista.indexOf(id), prima = lista[i - 1], dopoId = lista[i + 1];
  const vai = (v, dir) => (v ? `<button type="button" class="pl-sf pl-sf--${dir < 0 ? 'prima' : 'dopo'}" data-f="sfoglia" data-dir="${dir}">${ic(dir < 0 ? 'indietro' : 'avanti', 20)}<span><small>${dir < 0 ? 'Prima' : 'Dopo'}</small><b>${esc(T(v).breve)}</b></span></button>` : '<span></span>');
  const minT = x ? (x.min < 2 ? 'accanto' : `${x.min} min${x.mezzi ? '' : ' a piedi'}`) : '';
  return `${indietro ? `<button type="button" class="r-indietro" data-f="indietro">${ic('indietro', 18)}Torna al menù</button>` : ''}
    <p class="sch-quando">${esc(tipoL(id))}${euro(id) ? ` · ${euro(id)}` : ''}${x ? ` · ${minT} da ${esc(T(m.dove).breve)}` : ''}</p>
    ${x ? `<p class="pl-stato-grande pl__stato--${x.stato}">${ic(x.stato === 'chiuso' ? 'attenzione' : 'orologio', 18)}<span>Arrivi alle ${ora(x.arrivo)}: ${esc(x.nota)}</span></p>` : ''}
    ${x && x.stato !== 'chiuso' ? `<button type="button" class="f-bottone pl-scegli" data-f="scegli" data-v="${id}">${ic('posate', 20)}Mangia qui, ${m.q === 'pranzo' ? 'a pranzo' : 'a cena'} dalle ${ora(x.arrivo)}</button>` : ''}
    <div class="sch-testo">${testoScheda(id)}</div>${sezioni(id)}${fontiScheda(id)}
    ${lista.length > 1 ? `<nav class="pl-sfoglia" aria-label="Altri locali">${vai(prima, -1)}<span class="pl-sf__n num">${i + 1} di ${lista.length}</span>${vai(dopoId, 1)}</nav>` : ''}`;
}
async function schedaPasto(id, m, indietro) {
  const richiesta = ++richiestaSchedaPasto, dati = contestoPasto(m), aperto = contestoFoglio({ ancheChiuso: true });
  const attuale = () => richiesta === richiestaSchedaPasto && dati() && aperto();
  try { if (!schedePronte()) await caricaSchede(); }
  catch { if (attuale()) avvisa('La scheda del locale non si è caricata. Riprova dal menù.'); return; }
  if (!attuale()) return;
  const lista = ordineLocali.includes(id) ? [...ordineLocali] : vicini(m).map(y => y.id);
  let cur = id, visibile = () => false;
  const sfoglia = (dir, daX = 0) => {
    const v = lista[lista.indexOf(cur) + dir], f = $('#foglio');
    if (!v || occupato.si || !visibile()) return false;
    cur = v;
    scorri($('.pl-pagina', f), dir, daX, () => {
      if (!visibile()) return;
      $('.pl-pagina', f).innerHTML = paginaPasto(v, m, indietro, lista);
      $('#f-titolo', f).textContent = T(v).nome;
      f.scrollTop = 0;
      annuncia(`${T(v).nome}, ${lista.indexOf(v) + 1} di ${lista.length}`);
    }, () => visibile() ? $('.pl-pagina', f) : null);
    return true;
  };
  foglio(T(id).nome, `<div class="pl-pagina">${paginaPasto(id, m, indietro, lista)}</div>`, f => {
    visibile = collegaPasto(f, m, indietro, null, sfoglia);
    // col dito di lato si gira pagina (come le schede delle tappe)
    let p0 = null;
    f.onpointerdown = e => {
      if (p0 || !visibile() || computer.matches || e.pointerType === 'mouse' || e.target.closest('a, summary, button, table')) return;
      p0 = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const annullaGesto = e => { if (p0?.id === e.pointerId) p0 = null; };
    f.onpointercancel = annullaGesto; f.onlostpointercapture = annullaGesto;
    f.onpointerup = e => {
      if (!p0 || e.pointerId !== p0.id) return;
      const partenza = p0; p0 = null;
      if (!visibile()) return;
      const dx = e.clientX - partenza.x, dy = e.clientY - partenza.y, v = Math.abs(dx) / Math.max(1, performance.now() - partenza.t);
      if (Math.abs(dx) > Math.abs(dy) * 1.4 && (Math.abs(dx) > 70 || (v > .45 && Math.abs(dx) > 30))) sfoglia(dx < 0 ? 1 : -1, piano() ? dx * .3 : 0);
    };
  }, 'f--scheda f--fuori f--pasto');
}
async function clic(e, f, m, torna, quanto, sfoglia, esegui, dati, visibile) {
  if (e.target === f) { chiudiFoglio(); return; }
  const b = e.target.closest('[data-f]');
  if (!b) return;
  const k = b.dataset.f, v = b.dataset.v;
  if (k === 'quanto' && quanto) quanto(+v);
  else if (k === 'scheda') schedaPasto(v, m, torna);
  else if (k === 'sfoglia' && sfoglia) { const dir = +b.dataset.dir; if (sfoglia(dir)) requestAnimationFrame(() => { if (visibile()) $(`.pl-sf--${dir < 0 ? 'prima' : 'dopo'}`, f)?.focus({ preventScroll: true }); }); }
  else if (k === 'indietro') torna?.();
  else if (k === 'scegli') return esegui(async () => {
    const chiuso = contestoFoglio({ ancheChiuso: true });
    await dopo(0);
    if (chiuso() && dati()) mangiaQui(m, v);
  });
}

// le azioni delle righe del pasto (in viste.js, AZ)
export const AZ_PASTO = {
  'pasto-apri': b => { const m = trovaM(b.dataset.k); if (m) apriMenu(m); },
  'pasto-no': b => { const m = trovaM(b.dataset.k); if (m) noGrazie(m); },
  'pasto-si': b => rimetti(b.dataset.k)
};

