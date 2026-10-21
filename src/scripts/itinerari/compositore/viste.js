// Le due viste scelte da Enrico (pezzo 1): C «Mappa prima» (la mappa è la pagina, il foglio con i giorni sale) e D «Le pagine»
// (un giorno è una pagina da sfogliare, con le cartoline e le orme). Chi visita passa dall'una all'altra; la scelta resta sul
// telefono. Qui anche le azioni sulle tappe (visitata, togli, sposta, aggiungi), uguali nelle due viste, e gli avvisi del giorno.
import { $, $$, esc, ic, soglia, firma, animaFirma, GIRO_FIRMA, piano, computer, range, ora, durata, durataLunga, resta, metri, maiuscola, ORDINALE } from './base.js';
import {
  C, E, T, X, UI, PRONTI, A, nG, lista, giornoDi, nelViaggio, visitata, puoiSegnare, salvato, G, tappeDi, daFare, ultimaDi, titoloGiorno,
  aggiunta, ordineCorto, dopoModifica, ripristina, scriviArchivio, chiusaIl, dataLungaDi, giornoSett, oggiNelGiorno, VIVO, posizioneAttiva, tappaQui, statoPosizione
} from './stato.js';
import { MAX_GIORNI, MAX_TAPPE, giornoVuoto } from '../../../lib/itinerari/link';
import { preparaSpostamento } from '../../../lib/itinerari/spostamenti';
import { TIPI_PAUSA } from '../../../lib/itinerari/pause';
import { sequenzaM, rigaPasto, AZ_PASTO } from './pasto.js';
import { Mappa, daVedere, preparaAlternativi } from './mappa.js';
import {
  S, ricordaVista, avvisa, annuncia, cifre, contaCifre, contaDa, contaFine, tempo, scorri, allInizio, entra, schede, segnoOra, mettiSegno,
  segnaSchede, osservaSchede, sfoglia, foto, scivola, occupato, gesto
} from './comuni.js';
import { apriScheda, chiudiSchede, rinfrescaScheda, animaSoglia, schedaAperta } from './scheda.js';
import { apriAggiungi } from './aggiungi.js';
import { apriTempo, apriPausa, apriQuando, apriMiei, apriCondividi, apriAltro, apriGiorni, salva, stato, bottoneSalva, mettiPronto, chiediGiornoRegata } from './fogli.js';

const M = () => UI.marchio;
export const NOMI_PAUSA = { pranzo: 'Pausa pranzo', caffe: 'Pausa caffè', riposo: 'Riposo', libero: 'Tempo libero' };
export const IC_PAUSA = { pranzo: 'posate', caffe: 'tazza', riposo: 'panchina', libero: 'panchina' };
const fotoDi = (id, taglia = 'c') => T(id)?.foto?.[taglia];

// ---------- etichette, tratti, avvisi ----------
// le note di una tappa nella giornata: chiusa quel giorno (solo con la data), locale chiuso a quell'ora, prenotazione, percorso
export function etichette(id, g = S.g, v = null) {
  const t = T(id), out = [];
  if (!t) return out;
  if (chiusaIl(id, g)) out.push(`Chiuso ${dataLungaDi(g)}`);
  if (v?.chiusaOra) out.push(v.chiusaOra.chiude != null ? `Chiude alle ${ora(v.chiusaOra.chiude % 1440)}` : v.chiusaOra.apre != null ? `A quest'ora è chiuso: apre alle ${ora(v.chiusaOra.apre)}` : 'A quest\'ora è chiuso');
  if (t.prenotazione === 'obbligatoria') out.push(t.categoria ? 'Solo prenotando' : 'Si entra solo prenotando');
  if (t.avviso === 'chiuso-in-parte') out.push('In parte chiuso per lavori');
  if (v && t.fine && !v.fatta) out.push(v.indietro ? `Al contrario: parti da ${t.fine}` : `Fino a ${t.fine}`);
  if (t.evento && X().data && E.giorni[X().data]) out.push(E.giorni[X().data].titolo);
  return out;
}
export function testoTratto(v, Gx) {
  const linee = v.mezzi.map(m => C.linee[m] ?? m);
  const asc = v.ascensori?.length ? ` (${v.ascensori.map(esc).join(', ')})` : '';
  const corse = v.corse?.length ? `: ${v.corse.map(c => `${esc(C.linee[c.linea] ?? c.linea)} da ${esc(c.da)} alle ${ora(c.ora)}`).join(', poi ')}` : '';
  const nota = v.mezzi.some(m => m.startsWith('B')) ? `, ${Gx?.orariVeri ? 'orario ANM, può tardare' : 'attesa media, può tardare'}` : '';
  const scartato = v.scartato ? `; ${esc(C.linee[v.scartato.linea] ?? v.scartato.linea)} ${v.scartato.ora >= 0 ? `passa alle ${ora(v.scartato.ora)}: conviene andare così` : v.scartato.ora === -2 ? 'oggi non passa' : 'a quest\'ora non passa più'}` : '';
  return (linee.length ? `${v.min} min, a piedi e ${linee.map(esc).join(' e ')}${asc}${nota}` : `${v.min} min a piedi, ${metri(v.metri)}${asc}`) + corse + scartato;
}
const tipoTratto = v => (v.mezzi.some(m => m.startsWith('B')) ? 'bus' : v.mezzi[0]?.startsWith('F') ? 'funicolare' : v.mezzi.length ? 'treno' : 'piedi');

// gli avvisi chiusi con la X: tornano solo se la giornata cambia
const viaAvvisi = new Set();
// Gli avvisi del giorno, con le azioni: giornata piena (sposta le ultime, finisci più tardi), tappe lontane, regate
function avvisiDi(Gx, g) {
  const x = X(), out = [];
  const prossimo = g + 1 < x.giorni.length && !x.giorni[g + 1].gita ? `nel giorno ${g + 2}` : 'in un giorno nuovo';
  for (const a of Gx.avvisi) {
    if (a.tipo === 'piena') {
      const az = [];
      if (a.daSpostare.length && (x.giorni.length < MAX_GIORNI || prossimo !== 'in un giorno nuovo')) az.push(`<button type="button" class="avviso-az" data-azione="sposta-oltre">Sposta ${a.daSpostare.length === 1 ? esc(T(a.daSpostare[0]).breve) : `le ultime ${a.daSpostare.length} tappe`} ${prossimo}</button>`);
      if (a.fine <= 23 * 60 + 30) az.push(`<button type="button" class="avviso-az avviso-az--contorno" data-azione="allunga">Finisci alle ${ora(Math.ceil(a.fine / 30) * 30)}</button>`);
      out.push({ k: `piena-${a.fine}-${a.limite}`, t: `Finisci alle ${ora(a.fine)}, dopo le ${ora(a.limite)} che hai scelto. Togli una pausa, accorcia il margine o sposta una tappa.`, az });
    }
    if (a.tipo === 'lontana') {
      const dove = a.giorno < x.giorni.length ? `nel giorno ${a.giorno + 1}` : 'in un giorno nuovo';
      out.push({ k: `lontana-${a.id}`, t: `${maiuscola(T(a.id)?.breve ?? a.id)} è lontana dalle altre tappe: circa ${a.extra} minuti in più.`, az: [...(a.giorno < MAX_GIORNI ? [`<button type="button" class="avviso-az" data-azione="sposta-lontana" data-id="${a.id}" data-g="${a.giorno}">Sposta ${dove}</button>`] : []), `<button type="button" class="avviso-az avviso-az--contorno" data-azione="lascia" data-id="${a.id}">Lascia qui</button>`] });
    }
    if (a.tipo === 'evento-assente' && E) out.push({ k: 'ev-assente', t: a.data ? `Il ${dataLungaDi(g)} non ci sono regate in calendario: si corrono solo in alcuni giorni, dal ${E.primo.slice(8)}/${E.primo.slice(5, 7)} al ${E.ultimo.slice(8)}/${E.ultimo.slice(5, 7)}.` : 'Le regate si corrono solo in alcuni giorni: scegli la data di questo giorno.', az: [`<button type="button" class="avviso-az" data-azione="quando">${a.data ? 'Cambia la data' : 'Scegli la data'}</button>`, `<button type="button" class="avviso-az avviso-az--contorno" data-azione="togli" data-id="${E.id}">Togli le regate</button>`] });
    if (a.tipo === 'evento-tardi' && E) {
      const nuovo = Math.max(5 * 60, Math.floor((x.giorni[g].inizio - a.ritardo) / 15) * 15);
      out.push({ k: `ev-tardi-${a.ritardo}`, t: `Con queste tappe arrivi sul lungomare ${durataLunga(a.ritardo)} dopo le ${ora(E.inizio)}, quando cominciano le regate.`, az: nuovo < x.giorni[g].inizio ? [`<button type="button" class="avviso-az" data-azione="anticipa" data-ora="${nuovo}">Comincia alle ${ora(nuovo)}</button>`] : [] });
    }
    if (a.tipo === 'vicino') {
      const nomi = a.prima.map(id => esc(T(id).breve));
      const elenco = nomi.length > 1 ? `${nomi.slice(0, -1).join(', ')} e ${nomi[nomi.length - 1]}` : nomi[0];
      out.push({ k: `vicino-${a.id}`, t: `Sei a ${esc(T(a.id).breve)}: calcolo gli orari da qui. ${maiuscola(elenco)} ${a.prima.length > 1 ? 'non sono segnate visitate, quindi le metto' : 'non è segnata visitata, quindi la metto'} dopo.`, az: [] });
    }
  }
  return out.filter(a => !viaAvvisi.has(`${g}|${a.k}`));
}
const bloccoAvvisi = (Gx, g, cl) => {
  const av = avvisiDi(Gx, g);
  if (!av.length) return '';
  const k = `${g}|${av.map(a => a.k).join('|')}`;
  return `<div class="${cl} ${cl}--attenzione avviso-giorno" role="status">${ic('attenzione', 20)}<div class="avviso-giorno__t">${av.map(a => `<p>${a.t}</p>${a.az.length ? `<div class="avviso-giorno__az">${a.az.join('')}</div>` : ''}`).join('')}</div><button type="button" class="avviso-via" data-azione="via-avviso" data-chiave="${esc(k)}" aria-label="Chiudi l'avviso">${ic('x', 18)}</button></div>`;
};
// il giorno di oggi, dal vivo: il pannello della posizione (una volta per itinerario) o una riga piccola
function posizioneBlocco(Gx, g) {
  const x = X();
  if (!Gx?.vivo || !('geolocation' in navigator) || !lista(g).length) return '';
  const da = tappeDi(Gx).some(v => v.fatta) ? 'dall\'ultima tappa visitata' : 'dall\'ora di adesso';
  if (!x.posizione || (x.posizione === 'si' && !posizioneAttiva(x) && !VIVO.negata)) return `<div class="posizione" role="region" aria-labelledby="pos-t">
    <p class="posizione__t" id="pos-t">${ic('posizione', 20)}<span>Oggi ti seguo passo passo</span></p>
    <p>Se mi lasci usare la posizione del telefono, capisco vicino a quale tappa sei e ricalcolo gli orari da lì. La posizione <b>resta sul tuo telefono</b>: questa pagina non la manda a noi né a nessun altro, e <b>non la salviamo</b>. Più dettagli nella pagina <a href="/privacy/">privacy</a>.</p>
    <div class="avviso-giorno__az"><button type="button" class="avviso-az" data-azione="gps-si">Usa la mia posizione</button><button type="button" class="avviso-az avviso-az--contorno" data-azione="gps-no">No, grazie</button></div></div>`;
  const riga = t => `<p class="posizione-riga">${ic('posizione', 16)}<span>${t}</span></p>`;
  if (x.posizione === 'no' || VIVO.negata) return riga(`Posizione non usata: calcolo ${da}. <button type="button" class="link" data-azione="gps-si">Usa la mia posizione</button>`);
  if (statoPosizione() === 'nessuna') return riga('Cerco la posizione del telefono…');
  if (statoPosizione() === 'imprecisa') return riga(`La posizione del telefono è poco precisa: calcolo ${da}.`);
  if (!tappaQui(x, g)) return riga(`Non sei vicino a nessuna tappa che manca: calcolo ${da}.`);
  return '';
}

// ---------- azioni sulle tappe ----------
// Ogni modifica: copia per «Annulla», cambia, salva, ridisegna
export function aggiorna(fn, opz = {}) {
  P[S.p].aggiorna(() => { fn(X()); dopoModifica(); scriviArchivio(avvisa); }, opz);
  rinfrescaScheda();
}
export function conAnnulla(testo, fn, opz = {}) {
  const prima = structuredClone(X()), g0 = S.g;
  aggiorna(fn, opz);
  avvisa(testo, { testo: 'Annulla', fai: () => { ripristina(prima); S.g = Math.min(g0, nG() - 1); scriviArchivio(); aggiornaTutto(() => {}); annuncia('Modifica annullata'); } });
}
// «visitata»: sugli itinerari salvati. Oggi, dal vivo, gli orari ripartono da adesso; negli altri giorni la tappa si segna e basta.
export function segna(id) {
  if (!puoiSegnare() || !nelViaggio(id)) return;
  const si = !visitata(id), g = giornoDi(id), x = X();
  const cambia = y => {
    const D = y.giorni[g];
    D.fatte = si ? [...(D.fatte ?? []), id] : (D.fatte ?? []).filter(t => t !== id);
    if (!D.fatte.length) delete D.fatte;
    if (si) y.timbri = { ...(y.timbri ?? {}), [id]: Date.now() };
  };
  annuncia(`${T(id).breve}: ${si ? 'visitata' : 'da visitare'}`);
  if (oggiNelGiorno(x, g) && g === S.g) {
    aggiorna(cambia);
    requestAnimationFrame(() => $$(`[data-azione="visitata"][data-id="${id}"]`).forEach(b => animaSoglia(b, si)));
    avvisa(si ? `${T(id).breve} visitata: orari ricalcolati da adesso.` : `${T(id).breve} di nuovo da visitare: orari ricalcolati.`);
    return;
  }
  // gli altri giorni: la tappa si segna e basta, gli orari restano (niente ridisegno, solo i segni)
  cambia(x); dopoModifica(); scriviArchivio(avvisa);
  $$(`[data-azione="visitata"][data-id="${id}"]`).forEach(b => { b.setAttribute('aria-pressed', String(si)); animaSoglia(b, si); });
  $$(`[data-v-id="${id}"]`).forEach(el => el.toggleAttribute('data-visitata', si));
  rinfrescaScheda(id, si);
  mappe().forEach(m => m.fatte());
}
export function togliTappa(id) {
  const g = giornoDi(id);
  if (g < 0) return;
  chiudiSchede();
  conAnnulla(`${maiuscola(T(id).breve)} non è più nel giorno ${g + 1}.`, y => { const D = y.giorni[g]; D.tappe = D.tappe.filter(t => t !== id); D.ok = D.ok?.filter(o => o !== id); if (!D.ok?.length) delete D.ok; if (D.pause) D.pause = D.pause.map(p => (p.dopo === id ? { quale: p.quale, min: p.min } : p)); if (S.attiva === id) S.attiva = null; });
}
export function spostaA(id, a) {
  const g = giornoDi(id);
  if (g < 0) return;
  const Gx = G(g), ordine = tappeDi(Gx).map(v => v.id), nf = tappeDi(Gx).filter(v => v.fatta).length;
  const da = ordine.indexOf(id);
  a = Math.max(nf, a);
  if (da < nf || a === da || a < 0 || a >= ordine.length) return;
  const nuovo = [...ordine]; nuovo.splice(da, 1); nuovo.splice(a, 0, id);
  aggiorna(y => { y.giorni[g].tappe = nuovo; S.nuova = id; });
  annuncia(`${T(id).breve}: tappa ${a + 1} di ${ordine.length}`);
}
export function spostaGiorno(ids, dest, testo) {
  const g = giornoDi(ids[0]);
  if (g < 0) return;
  const r = preparaSpostamento(X(), g, dest, ids);
  if (r === 'limite-giorni') { avvisa(`Al massimo ${MAX_GIORNI} giorni.`); return; }
  if (r === 'limite-tappe') { avvisa(`Il giorno ${dest + 1} è pieno: al massimo ${MAX_TAPPE} tappe.`); return; }
  chiudiSchede();
  const nuovoGiorno = dest >= nG();
  conAnnulla(testo ?? `${ids.length === 1 ? `${maiuscola(T(ids[0]).breve)} è in fondo al` : 'Le tappe sono nel'} giorno ${r.destinazione + 1}${ids.length === 1 && visitata(ids[0]) ? ', con il suo segno di visitata' : ''}.`, y => { y.giorni = r.giorni; }, { giorno: nuovoGiorno });
}
export function aggiungi(g, id) {
  const x = X(), D = x.giorni[g];
  if (D.gita) {
    // un giorno di gita non si mescola con le tappe in città: va in un giorno nuovo, subito dopo
    if (x.giorni.length >= MAX_GIORNI) { avvisa(`Al massimo ${MAX_GIORNI} giorni.`); return; }
    conAnnulla(`${maiuscola(T(id).breve)} è nel giorno ${g + 2}: il giorno ${g + 1} è una gita.`, y => { y.giorni.splice(g + 1, 0, { ...giornoVuoto(D.inizio, D.fine), tappe: [id] }); S.g = g + 1; S.nuova = id; }, { giorno: true });
    return;
  }
  if (D.tappe.includes(id)) { avvisa(`${maiuscola(T(id).breve)} è già nel giorno ${g + 1}.`); return; }
  if (D.tappe.length >= MAX_TAPPE) { avvisa(`Al massimo ${MAX_TAPPE} tappe per giorno.`); return; }
  const prima = structuredClone(x);
  aggiorna(y => { y.giorni[g].tappe = [...y.giorni[g].tappe, id]; S.nuova = id; });
  const X1 = G(g);
  avvisa(`${maiuscola(T(id).breve)} è in fondo al giorno ${g + 1}. ${X1.fine > X1.fineScelta ? `Fine stimata ${ora(X1.fine)}, dopo le ${ora(X1.fineScelta)}.` : `Fine stimata ${ora(X1.fine)}.`}`, { testo: 'Annulla', fai: () => { ripristina(prima); scriviArchivio(); aggiornaTutto(() => {}); } });
}
// una gita prende un giorno intero: nel giorno vuoto, altrimenti in un giorno nuovo in fondo
export function aggiungiGita(id) {
  const x = X(), D = x.giorni[S.g];
  if (D.gita === id) { avvisa(`${maiuscola(T(id).breve)} è già nel giorno ${S.g + 1}.`); return; }
  if (!D.gita && !D.tappe.length) { conAnnulla(`Gita a ${T(id).breve} nel giorno ${S.g + 1}.`, y => { y.giorni[S.g].gita = id; y.giorni[S.g].tappe = []; delete y.giorni[S.g].pause; }, { giorno: true }); return; }
  if (x.giorni.length >= MAX_GIORNI) { avvisa(`Al massimo ${MAX_GIORNI} giorni.`); return; }
  conAnnulla(`${maiuscola(T(id).breve)} è nel giorno ${x.giorni.length + 1}: una gita occupa un giorno a parte.`, y => { y.giorni.push({ ...giornoVuoto(D.inizio, D.fine), gita: id }); S.g = y.giorni.length - 1; }, { giorno: true });
}
export function nuovoGiorno() {
  if (nG() >= MAX_GIORNI) { avvisa(`Al massimo ${MAX_GIORNI} giorni.`); return; }
  const D = X().giorni[S.g];
  conAnnulla(`Aggiunto il giorno ${nG() + 1}: sulla mappa vedi tutte le tappe della città.`, y => { y.giorni.push(giornoVuoto(D.inizio, D.fine)); S.g = y.giorni.length - 1; }, { giorno: true });
}
export function togliGiorno(g = S.g) {
  if (nG() < 2) return;
  conAnnulla(`Hai tolto il giorno ${g + 1}.`, y => { y.giorni.splice(g, 1); S.g = Math.max(0, Math.min(g, y.giorni.length - 1) - (g > 0 ? 1 : 0)); }, { giorno: true });
}

// ---------- trascinare per cambiare l'ordine (dalla maniglia; con la tastiera: frecce su e giù) ----------
const scorritore = () => (computer.matches && S.p === 'c' ? $('#c-foglio') : null);
function iniziaTrascina(voce, e, presa) {
  if (gesto.trascinando) return false;
  const lista = voce.parentElement;
  const r0 = voce.getBoundingClientRect();
  lista.classList.add('in-trascina');
  const voci = $$(':scope > [data-trascina]', lista);
  const da = voci.indexOf(voce);
  if (da < 0 || voci.length < 2) { lista.classList.remove('in-trascina'); return false; }
  gesto.trascinando = true;
  const sc = scorritore(), sy = () => (sc ? sc.scrollTop : scrollY);
  const r1 = voce.getBoundingClientRect();
  const off = Math.max(8, Math.min(r1.height - 8, (e.clientY - r0.top) * (r1.height / Math.max(1, r0.height))));
  if (Math.abs(r1.top + off - e.clientY) > 4) { if (sc) sc.scrollTop += r1.top + off - e.clientY; else scrollBy(0, r1.top + off - e.clientY); }
  voce.classList.add('presa');
  try { presa.setPointerCapture(e.pointerId); } catch { /* fuori */ }
  const s0 = sy();
  const r = voci.map(v => { const b = v.getBoundingClientRect(); return { top: b.top + s0, h: b.height }; });
  const spazio = r.length > 1 ? Math.max(0, r[1].top - (r[0].top + r[0].h)) : 0;
  const posto = r[da].h + spazio;
  let y = e.clientY, a = da, attivo = true, giro = 0;
  const posiziona = () => {
    const alto = y - off + sy();
    voce.style.transform = `translateY(${(alto - r[da].top).toFixed(1)}px)`;
    const centro = alto + r[da].h / 2;
    let n = da;
    for (let k = 0; k < voci.length; k++) {
      const mezzo = r[k].top + r[k].h / 2;
      if (k < da && centro < mezzo) n = Math.min(n, k);
      if (k > da && centro > mezzo) n = Math.max(n, k);
    }
    a = n;
    voci.forEach((v, k) => {
      if (k === da) return;
      const sp = a > da && k > da && k <= a ? -posto : a < da && k < da && k >= a ? posto : 0;
      v.style.transform = sp ? `translateY(${sp}px)` : '';
    });
  };
  const scorriLista = () => {
    if (!attivo) return;
    if (!lista.isConnected || !voce.isConnected) { chiudi(true); return; }
    // Il pannello desktop ha bordi propri; la pagina non deve superare le tappe.
    const b = sc?.getBoundingClientRect();
    const cima = b ? Math.max(0, b.top + sc.clientTop) : 60;
    const fondo = b ? Math.min(innerHeight, b.top + sc.clientTop + sc.clientHeight) : innerHeight;
    const margine = Math.min(80, Math.max(0, (fondo - cima) / 2));
    const dito = Math.max(cima, Math.min(fondo, y));
    let v = dito < cima + margine ? -Math.ceil((cima + margine - dito) / 7) : dito > fondo - margine ? Math.ceil((dito - (fondo - margine)) / 7) : 0;
    if (fondo <= cima) v = 0;
    const s = sy(), ultima = r[r.length - 1];
    v = v < 0 ? Math.max(v, Math.min(0, r[0].top - cima - s)) : Math.min(v, Math.max(0, ultima.top + ultima.h - fondo - s));
    if (v) { if (sc) sc.scrollTop += v; else scrollBy(0, v); posiziona(); }
    giro = requestAnimationFrame(scorriLista);
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
    presa.removeEventListener('lostpointercapture', via);
    removeEventListener('blur', interrompi);
    removeEventListener('resize', interrompi);
    try { if (presa.hasPointerCapture(e.pointerId)) presa.releasePointerCapture(e.pointerId); } catch { /* già rilasciato */ }
    removeEventListener('keydown', tasto, true);
    document.removeEventListener('touchmove', ferma);
    voci.forEach(v => { v.style.transform = ''; });
    voce.classList.remove('presa');
    lista.classList.remove('in-trascina');
    setTimeout(() => { gesto.trascinando = false; }, 80);
    if (!annulla && a !== da) spostaA(voce.dataset.id, a + (tappeDi(G(S.g)).filter(v => v.fatta).length));
  };
  const su = ev => { if (ev.pointerId === e.pointerId) chiudi(false); };
  const via = ev => { if (ev.pointerId === e.pointerId) chiudi(true); };
  const interrompi = () => chiudi(true);
  const tasto = ev => { if (ev.key === 'Escape') { ev.preventDefault(); chiudi(true); } };
  presa.addEventListener('pointermove', muovi);
  presa.addEventListener('pointerup', su);
  presa.addEventListener('pointercancel', via);
  presa.addEventListener('lostpointercapture', via);
  addEventListener('blur', interrompi);
  addEventListener('resize', interrompi);
  addEventListener('keydown', tasto, true);
  document.addEventListener('touchmove', ferma, { passive: false });
  posiziona();
  giro = requestAnimationFrame(scorriLista);
  return true;
}
const maniglia = (id, cl = 'maniglia') => `<button type="button" class="${cl}" data-maniglia="${id}" aria-label="Sposta ${esc(T(id).breve)}" aria-describedby="aiuto-maniglia">${ic('maniglia', 22)}</button>`;

// ---------- pezzi della giornata ----------
const nVoce = (v, cl) => `<span class="${cl}" aria-hidden="true"><b>${v.n}</b><i class="sg-si">${soglia()}</i></span>`;
// «visitata» nella riga: la porta con il numero della tappa; toccandola le soglie si chiudono
const segnoV = (v, cl = 'sv') => `<button type="button" class="${cl}" data-azione="visitata" data-id="${v.id}" aria-pressed="${visitata(v.id)}">${soglia()}<svg class="sv__pin" viewBox="0 0 20 29" aria-hidden="true" focusable="false">${M().spillo}</svg><span class="vh">Visitata: ${esc(T(v.id).breve)}, tappa </span><span class="sv__n">${v.n}</span></button>`;
const fotoRiga = (id, cl = '') => {
  const t = T(id), f = fotoDi(id);
  if (f) return `<img src="${f}" alt="" loading="lazy" decoding="async"${cl ? ` class="${cl}"` : ''}>`;
  if (t.evento) return `<span class="c-voce__senza c-voce__cibo">${ic('vela', 26)}</span>`;
  return t.categoria ? `<span class="c-voce__senza c-voce__cibo">${ic('posate', 26)}</span>` : `<span class="c-voce__senza">${soglia()}</span>`;
};
const rigaAdesso = (Gx, tag = 'li', cl = 'c-adesso') => `<${tag} class="${cl}" data-chiave="adesso"><span>${ic('orologio', 16)}Da adesso, ${ora(Gx.inizio)}: orari ricalcolati</span></${tag}>`;
function suggerite(g, n = 3) {
  if (!lista(g).length) return [];
  return C.tappe.filter(t => daVedere(t.id) && !nelViaggio(t.id)).map(t => ({ id: t.id, ...aggiunta(g, t.id) })).sort((a, b) => (a.tratto?.min ?? 0) - (b.tratto?.min ?? 0) || a.id.localeCompare(b.id)).slice(0, n);
}
const liberoBlocco = (Gx, cl, g = S.g) => {
  const l = Gx.resta, avv = bloccoAvvisi(Gx, g, cl);
  if (l <= 0 || Gx.avvisi.some(a => a.tipo !== 'piena' && a.tipo !== 'chiusa' && a.tipo !== 'chiusa-ora')) return avv || '';
  const sug = suggerite(g);
  return `<div class="${cl}"><p class="${cl}__tit">${resta(l)} prima delle ${ora(Gx.fineScelta)}.</p>
    ${sug.length ? `<p class="${cl}__sotto">Le più vicine a ${esc(T(daFare(Gx).slice(-1)[0]?.id ?? ultimaDi(g)).breve)}:</p><ul class="${cl}__sug">${sug.map(c => `<li><button type="button" class="sug onda" data-azione="aggiungi-subito" data-id="${c.id}">${fotoDi(c.id, 'm') ? `<img src="${fotoDi(c.id, 'm')}" alt="" loading="lazy" decoding="async">` : '<span class="sug__senza"></span>'}<span><b>${esc(T(c.id).breve)}</b><small><span class="num">${c.tratto?.min ?? 0} min</span> a piedi, ${durata(T(c.id).durata)}</small></span><span class="sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>` : ''}
    <button type="button" class="${cl}__tutte onda" data-azione="aggiungi">Vedi tutte le tappe</button></div>`;
};
const consiglio = (g = S.g, cl = '') => {
  const o = ordineCorto(g);
  if (!o) return '';
  return `<div class="consiglio ${cl}" role="status"><p class="consiglio__t">${ic('sposta', 20)}<span>C'è un ordine più corto</span></p><p class="consiglio__p">Cambiando l'ordine risparmi <b>${durataLunga(o.risparmio)}</b> di strada. La prima tappa resta la stessa.</p><div class="consiglio__az"><button type="button" class="consiglio__si onda" data-azione="ordina">Usa questo ordine</button><button type="button" class="consiglio__no onda" data-azione="ordine-ok">Lascia così</button></div></div>`;
};
// il giorno vuoto: aggiungi la prima tappa, oppure un itinerario pronto o una gita
const vuoto = (cl, bott) => `<div class="${cl}"><p>Il giorno ${S.g + 1} è vuoto. Aggiungi la prima tappa, oppure metti qui un itinerario pronto. Sulla mappa vedi tutte le tappe della città.</p><button type="button" class="${bott}" data-azione="aggiungi">${ic('piu', 20)}Aggiungi una tappa</button>
  <ul>${PRONTI.filter(p => !p.evento || (E && !(new Date().toISOString().slice(0, 10) > E.ultimo))).map(p => `<li><button type="button" data-azione="pronto" data-pronto="${p.id}"><span>${esc(p.nome)}</span><small>${p.evento ? 'Solo nei giorni di regata' : `${p.giorni.length === 1 ? '1 giorno' : `${p.giorni.length} giorni`}, ${p.giorni.reduce((s, g) => s + g.tappe.length, 0)} tappe`}</small></button></li>`).join('')}
  <li><button type="button" data-azione="aggiungi" data-tipo="gite"><span>Oppure una gita di un giorno</span><small>Pompei, Capri, la Reggia di Caserta…</small></button></li></ul>
  ${nG() > 1 ? `<button type="button" class="${bott} ${bott}--contorno" data-azione="togli-giorno">Togli il giorno ${S.g + 1}</button>` : ''}</div>`;
// un giorno di gita: la gita prende il giorno intero
const giornoGita = (g, cl) => {
  const id = X().giorni[g].gita, t = T(id);
  return `<div class="gita ${cl}"><button type="button" class="gita__carta" data-azione="tappa" data-id="${id}">${fotoDi(id) ? `<img src="${fotoDi(id)}" alt="" loading="lazy" decoding="async">` : ''}<span class="gita__t"><small>Gita di un giorno</small><b>${esc(t.nome)}</b><span>${t.durata > 240 ? 'Giornata intera' : 'Mezza giornata'}${t.partenza ? `, si parte da ${esc(t.partenza)}` : ''}</span></span></button>
    <p class="gita__nota">Orari, biglietti e come arrivare sono nella scheda della gita.</p><button type="button" class="${cl}__togli" data-azione="togli-gita">${ic('cestino', 18)}Togli la gita</button></div>`;
};
// gli altri giorni (giorno vuoto: la mappa li mostra in grigio)
const altreLinee = () => range(nG()).map(g => G(g)).filter(Boolean);
const mappe = () => [mappa, mappaD].filter(Boolean);

// =====================================================================================
// C · MAPPA PRIMA
// =====================================================================================
let mappa = null, mappaD = null, rotta = true;
let ascolti = new Set();
function ascolta(tipo, fn, bersaglio = window) {
  if (!bersaglio) return () => {};
  let raf = 0, attivo = true;
  const h = () => {
    if (!attivo) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { raf = 0; if (attivo) fn(); });
  };
  const ferma = () => {
    if (!attivo) return;
    attivo = false; cancelAnimationFrame(raf); bersaglio.removeEventListener(tipo, h); ascolti.delete(ferma);
  };
  bersaglio.addEventListener(tipo, h, { passive: true }); ascolti.add(ferma);
  return ferma;
}
const smettiAscolti = () => { [...ascolti].forEach(ferma => ferma()); };
const opzMappa = extra => ({ punto: id => apriScheda(id), tutte: Gx => S.tutte || !Gx, cambiaTutte: si => { S.tutte = si; }, ...extra });

function rigaC(v, k) {
  const t = T(v.id), vis = visitata(v.id);
  const quando = v.fatta ? '<span class="c-ora c-ora--v">Visitata</span>' : `<span class="c-ora num">${ora(v.inizio)} – ${ora(v.fine)}</span>`;
  const et = etichette(v.id, S.g, v);
  const sr = vis ? '<span class="vh">, visitata</span>' : '';
  const apri = `<button type="button" class="c-voce__apri" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="c-tit">${quando}<span class="c-voce__nome">${esc(t.nome)}${sr}</span>${et.length ? `<small class="c-et">${et.map(esc).join(', ')}</small>` : ''}</span><span class="c-voce__foto">${fotoRiga(v.id)}</span></button>`;
  const sinistra = puoiSegnare() && !t.evento ? segnoV(v) : nVoce(v, 'c-n2');
  const destra = v.fatta || v.inCorso ? '' : maniglia(v.id);
  return `<li class="c-voce${v.id === S.nuova ? ' nuova' : ''}" style="--i:${k}" data-chiave="${v.id}" data-v-id="${v.id}"${vis ? ' data-visitata' : ''}${v.fatta ? '' : ' data-trascina'} data-id="${v.id}">${sinistra}${apri}${destra}</li>`;
}
const C1 = {
  html() {
    return `<div class="c-mappa" id="c-mappa"><div id="mappa"></div></div>
      <header class="c-sopra"><button type="button" class="tondo onda" popovertarget="menu" aria-label="Apri il menu del sito">${ic('menu')}</button><div class="c-nome">${firma(M(), 'firma--solo-segno')}<div>${nomeBottone()}${stato()}</div></div>${bottoneSalva('c-salva onda')}</header>
      <div class="c-spazio" aria-hidden="true"></div>
      <section class="c-foglio" id="c-foglio" aria-label="Giornata"><span class="c-maniglia" aria-hidden="true"></span>
        <div class="c-giorni" id="c-giorni">${this.giorni()}</div>
        <div class="c-dentro giorno-corpo giorno-attivo" id="c-dentro" data-inizio-giorno>${this.corpo(true)}</div>
        <div class="c-giu" id="c-giu" data-nascosto="true"><nav class="c-giu__barra" aria-label="Comandi dell'itinerario">
          <button type="button" class="c-giu__mappa onda" data-azione="su-mappa">${ic('mappa', 20)}<span>Mappa</span></button>
          <button type="button" class="c-giu__piu onda" data-azione="aggiungi">${ic('piu', 20)}<span>Aggiungi</span></button>
          <button type="button" class="c-giu__altro onda" data-azione="altro" aria-label="Altro">${ic('altro')}</button></nav></div>
      </section>`;
  },
  giorni() { return `<div class="c-pista" style="--n:${nG()}">${schede('c')}${nG() < MAX_GIORNI ? `<button type="button" class="c-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 20)}</button>` : ''}</div>`; },
  elenco(Gx) {
    let i = 0;
    const voci = sequenzaM(Gx, S.g);
    const righe = voci.map((v, k) => {
      if (v.tipo === 'tratto') { const dopoT = voci.slice(k + 1).find(x => x.tipo === 'tappa'); return `<li class="c-tratto" data-chiave="t-${dopoT?.id}" data-verso="${dopoT?.id ?? ''}"${dopoT && visitata(dopoT.id) ? ' data-fatto' : ''} style="--i:${i++}"><i aria-hidden="true"></i><span>${ic(tipoTratto(v) === 'piedi' ? 'piedi' : tipoTratto(v), 15)}${testoTratto(v, Gx)}</span></li>`; }
      if (v.tipo === 'pasto') return rigaPasto(v.m, 'c', ` style="--i:${i++}"`);
      if (v.tipo === 'pausa') return `<li class="c-riga c-pausa" data-chiave="p-${v.quale}" style="--i:${i++}"><button type="button" data-azione="pausa" data-quale="${v.quale}"><span class="c-n c-n--pausa">${ic(IC_PAUSA[v.quale], 17)}</span><span class="c-tit"><span class="c-ora num">${ora(v.inizio)} – ${ora(v.fine)}</span>${NOMI_PAUSA[v.quale]}<small class="c-pausa__d">${durataLunga(v.min)}: tocca per cambiarla</small></span><span></span></button></li>`;
      const html = rigaC(v, i++);
      return v.fatta && Gx.vivo && voci[k + 1] && !(voci[k + 1].tipo === 'tappa' && voci[k + 1].fatta) ? html + rigaAdesso(Gx) : html;
    }).join('');
    return `<ol class="c-elenco">${righe}</ol>`;
  },
  corpo(anima = false) {
    const g = S.g, D = X().giorni[g], Gx = G(g);
    if (D.gita) return `<div class="c-testa"><div class="c-riga-azioni"><p class="c-riassunto"><b>Gita di un giorno</b>${esc(T(D.gita).breve)}</p>${azioniTesta()}</div></div><div class="c-corpo${anima ? ' c-entra' : ''}">${giornoGita(g, 'c-gita')}</div>`;
    return `<div class="c-testa">${Gx ? cifre(Gx, 'cifre c-cifre') + tempo(Gx, 'tempo--c') : ''}
        <div class="c-riga-azioni"><p class="c-riassunto">${Gx ? `<b>${esc(titoloGiorno(Gx))}</b>${Gx.vivo ? 'da adesso, ' : ''}dalle ${ora(Gx.inizio)} alle <span data-conta="fine">${ora(Gx.fine)}</span>` : '<b>Giorno vuoto</b>Aggiungi la prima tappa'}</p>${azioniTesta()}</div>
        ${Gx ? posizioneBlocco(Gx, g) + consiglio(g, 'consiglio--c') : ''}</div>
      <div class="c-corpo${anima ? ' c-entra' : ''}">${Gx ? `${this.elenco(Gx)}${liberoBlocco(Gx, 'c-libero')}` : vuoto('c-vuoto', 'c-azione')}</div>`;
  },
  margini() {
    const aperta = schedaAperta();
    if (computer.matches) return { t: 90, r: aperta ? 480 : 70, b: 70, l: 500 };
    if (aperta) return { t: 112, r: 44, b: Math.max(60, innerHeight - (aperta.cima ?? innerHeight * .4) + 24), l: 44 };
    const el = $('#mappa'), sp = $('.c-spazio');
    const visibile = sp ? sp.offsetHeight : 300;
    return { t: 112, r: 64, b: Math.max(60, (el?.clientHeight || 600) - visibile + 40), l: 36 };
  },
  dopo() {
    mappa = new Mappa($('#mappa'), opzMappa({ tocca: id => C1.tocca(id), margini: () => C1.margini(), distanza: 36 }));
    this.disegnaMappa(false, rotta ? null : Infinity);
    const carta = $('#c-mappa');
    ascolta('scroll', () => {
      const sp = $('.c-spazio');
      if (!sp || computer.matches) return;
      const k = Math.max(0, Math.min(1, scrollY / Math.max(1, sp.offsetHeight)));
      carta.style.setProperty('--su', k.toFixed(3));
    });
    this.osserva();
    sfoglia($('#c-foglio'), () => $('#c-dentro'), vaiAlGiorno);
  },
  osserva() {
    this.fermaGuarda?.();
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
    const fermaPagina = ascolta('scroll', guarda), fermaFoglio = ascolta('scroll', guarda, $('#c-foglio'));
    this.fermaGuarda = () => { fermaPagina(); fermaFoglio(); };
    this.guarda = guarda;
    guarda();
  },
  disegnaMappa(vola, da = null) {
    const corrente = mappa; if (!corrente) return;
    const x = X(), g = S.g, giorno = x.giorni[g], Gx = G(g), turno = this.richiestaMappa = (this.richiestaMappa ?? 0) + 1;
    const valido = () => this.richiestaMappa === turno && mappa === corrente && !corrente.spenta && S.p === 'c' && X() === x && S.g === g && x.giorni[g] === giorno;
    preparaAlternativi(Gx).then(si => { if (si && valido()) this.disegnaMappa(false, Infinity); }).catch(() => { /* resta il disegno già disponibile */ });
    corrente.disegna(Gx, { vola, daLinea: da, altre: Gx ? [] : altreLinee(), n: g + 1 });
    if (S.attiva) corrente.evidenzia(S.attiva);
  },
  allInizio() {
    const f = $('#c-foglio');
    if (!f) return;
    if (computer.matches) { if (f.scrollTop > 0) f.scrollTop = 0; } else allInizio($('#c-dentro'), $('#c-giorni'));
  },
  giorno(g, daX = 0) {
    const dir = g > S.g ? 1 : -1;
    S.g = g; S.attiva = null;
    segnaSchede(g);
    const el = $('#c-dentro'), x = X(), giorno = x.giorni[g], vista = S.p;
    const valido = () => !!giorno && X() === x && x.giorni[g] === giorno && S.g === g && S.p === vista && $('#c-dentro') === el;
    scorri(el, dir, daX, () => { el.innerHTML = this.corpo(true); this.allInizio(); contaCifre(); contaFine(); this.osserva(); }, undefined, () => requestAnimationFrame(() => { if (valido()) this.disegnaMappa(true); }), valido);
  },
  aggiorna(fn, opz = {}) {
    const prima = S.g, segno = segnoOra(), n0 = nG();
    const lst = $('#c-dentro .c-elenco'), foto0 = lst ? foto(lst) : null;
    fn();
    if (!mappa || !$('#c-foglio')) { aggiornaTutto(() => {}); return; }
    const cambiato = prima !== S.g || !!opz.giorno || n0 !== nG();
    document.documentElement.dataset.g = String(S.g);
    $('#c-giorni').innerHTML = this.giorni();
    mettiSegno($('#c-giorni .schede'), { da: segno });
    osservaSchede();
    $('#c-dentro').innerHTML = this.corpo(cambiato);
    if (!cambiato) scivola($('#c-dentro .c-elenco'), foto0, opz.salta);
    contaCifre();
    this.osserva();
    this.disegnaMappa(cambiato || !!S.nuova, cambiato ? null : Infinity);
    if (cambiato) { this.allInizio(); entra($('#c-dentro'), S.g >= prima ? 1 : -1); }
    contaFine();
    finisciNuova();
  },
  tocca(id, b) {
    S.attiva = id;
    $$('.c-voce__apri').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
    if (computer.matches) mappa?.centra(id);
    apriScheda(id, b);
  }
};
const azioniTesta = () => `<button type="button" class="c-azione c-azione--piena onda" data-azione="aggiungi">${ic('piu', 20)}Aggiungi</button>
  <button type="button" class="c-azione onda" data-azione="altro" aria-label="Altro">${ic('altro')}</button>`;

// =====================================================================================
// D · LE PAGINE
// =====================================================================================
const PASSO = 64;
const IMPRONTA = '<path class="orma__tacco" d="M-3 -13.6C-2.6 -15.6 3.4 -15.6 3.6 -13.4L3.4 -8C3.2 -6.2 -2.6 -6.2 -2.9 -8Z"/><path class="orma__suola" d="M-1.2 -3C1 -4 3 -3.6 3.6 -2C4.6 .6 5 4 4.6 7.6C4.2 11 2.4 13.6 -.6 14.4C-3.4 15 -5 12.6 -4.9 8.6C-4.8 5 -3.6 1.2 -1.2 -3Z"/><path class="orma__righe" d="M-3.9 4.4L4.2 3.6M-4.2 9L4.3 8.3"/>';
const orme = () => `<svg class="orme" viewBox="0 0 64 128" aria-hidden="true" focusable="false">${[0, 1, 2, 3, 4].map(k => { const destro = k % 2 === 0, x = destro ? 25 : 40, y = 16 + k * 24, r = destro ? 7 : -7; return `<g class="orma" style="--k:${k}" transform="translate(${x} ${y}) rotate(${r}) scale(${destro ? -1.08 : 1.08} 1)">${IMPRONTA}</g>`; }).join('')}</svg>`;
const ROT = k => (k % 4 === 0 ? -.8 : k % 4 === 2 ? .7 : 0);
function cartolinaD(v, k, g) {
  const t = T(v.id), vis = visitata(v.id);
  const attr = `data-chiave="${v.id}" data-v-id="${v.id}" data-id="${v.id}"${vis ? ' data-visitata' : ''}${v.fatta ? '' : ' data-trascina'}`;
  const quando = v.fatta ? 'visitata' : ora(v.inizio);
  const f = fotoDi(v.id);
  const cartolina = `<button type="button" class="d-cartolina${v.id === S.nuova ? ' nuova' : ''}" data-azione="tappa" data-id="${v.id}"${S.attiva === v.id ? ' aria-current="true"' : ''}><span class="d-foto">${f ? `<img src="${f}" alt="" loading="lazy" decoding="async">` : `<span class="d-senza" aria-hidden="true">${esc(t.breve)}</span>`}<span class="d-timbro-ora num${v.fatta ? ' d-timbro-ora--v' : ''}" aria-hidden="true">${quando}</span></span><span class="d-cartolina__testo"><span class="vh">${v.fatta ? 'Visitata: ' : `Alle ${ora(v.inizio)}, ${durata(v.fine - v.inizio)}${vis ? ', visitata' : ''}: `}</span><b>${esc(t.nome)}</b>${t.frase ? `<span class="d-frase">${esc(t.frase)}</span>` : ''}<span class="d-meta">${v.fatta ? 'Visitata' : `${durata(v.fine - v.inizio)}, fino alle ${ora(v.fine)}`}</span>${etichette(v.id, g, v).map(e => `<span class="d-et">${esc(e)}</span>`).join('')}</span></button>`;
  const sopra = `${puoiSegnare() && !t.evento ? segnoV(v, 'sv d-sv') : ''}${v.fatta || v.inCorso ? '' : maniglia(v.id, 'maniglia d-maniglia')}`;
  return `<div class="d-voce${vis ? ' d-voce--v' : ''}" ${attr} style="--k:${k};--r:${ROT(k)}deg">${cartolina}${sopra}</div>`;
}
const Dp = {
  html() {
    const pc = computer.matches;
    return `<div class="d-tutto"><div class="d-sinistra">
      <header class="d-testata">${firma(M())}<button type="button" class="tondo onda" popovertarget="menu" aria-label="Apri il menu del sito">${ic('menu')}</button></header>
      <div class="d-titolo"><div>${nomeBottone()}${stato()}</div>${bottoneSalva('d-salva onda')}</div>
      <nav class="d-indice" aria-label="Giorni"><div class="d-indice__voci" role="tablist" aria-label="Giorni dell'itinerario">${range(nG()).map(g => `<button type="button" role="tab" aria-selected="${g === S.g}" tabindex="${g === S.g ? 0 : -1}" data-azione="giorno" data-g="${g}" aria-label="Giorno ${g + 1}">${g + 1}</button>`).join('')}</div><span class="d-indice__segno" id="d-segno" aria-hidden="true" style="transform:translateX(${S.g * PASSO}px)"></span>${nG() < MAX_GIORNI ? `<button type="button" class="d-piu onda" data-azione="nuovo-giorno" aria-label="Aggiungi un giorno">${ic('piu', 22)}</button>` : ''}<span class="d-indice__dove" id="d-dove" aria-live="polite">giorno ${S.g + 1} di ${nG()}</span></nav>
      <div class="d-pagine" id="d-pagine">${range(nG()).map(g => this.pagina(g)).join('')}</div>
    </div>${pc ? '<div class="d-destra"><div id="mappa"></div></div>' : ''}</div>
    ${pc ? '' : `<div class="d-strato" id="d-strato" hidden role="dialog" aria-label="Mappa del giorno"><div class="d-strato__testa"><h2 id="d-strato-t">${ORDINALE[S.g]} giorno</h2><button type="button" class="tondo onda" data-azione="chiudi-mappa" aria-label="Chiudi la mappa">${ic('x')}</button></div><div id="mappa-d"></div></div>`}
    <nav class="d-tab" aria-label="Comandi dell'itinerario">
      <button type="button" class="onda" data-azione="giorni">${ic('giorni')}Giorni</button>
      <button type="button" class="d-tab__mappa onda" data-azione="mappa-d" aria-pressed="false">${ic('mappa')}Mappa</button>
      <button type="button" class="d-tab__piu" data-azione="aggiungi"><span class="cerchio onda">${ic('piu')}</span>Aggiungi</button>
      <button type="button" class="onda" data-azione="miei">${ic('miei')}I miei</button>
      <button type="button" class="onda" data-azione="altro">${ic('altro')}Altro</button>
    </nav>`;
  },
  cartoline(Gx, g) {
    let k = 0;
    const voci = sequenzaM(Gx, g);
    return voci.map((v, j) => {
      if (v.tipo === 'tratto') { const dopoT = voci.slice(j + 1).find(x => x.tipo === 'tappa'); return `<div class="d-tratto" data-chiave="t-${dopoT?.id}" data-verso="${dopoT?.id ?? ''}"${dopoT && visitata(dopoT.id) ? ' data-fatto' : ''}>${v.mezzi.length ? ic(tipoTratto(v), 22) : orme()}<span class="d-tratto__t">${testoTratto(v, Gx)}</span></div>`; }
      if (v.tipo === 'pasto') return rigaPasto(v.m, 'd');
      if (v.tipo === 'pausa') return `<button type="button" class="d-pausa" data-chiave="p-${v.quale}" data-azione="pausa" data-quale="${v.quale}"><span class="d-pausa__ic">${ic(IC_PAUSA[v.quale], 24)}</span><span class="d-pausa__t"><b>${NOMI_PAUSA[v.quale]}</b><span class="num">${ora(v.inizio)} – ${ora(v.fine)}, ${durataLunga(v.min)}</span></span><span class="d-pausa__cambia">Cambia</span></button>`;
      const html = cartolinaD(v, k++, g);
      return v.fatta && Gx.vivo && voci[j + 1] && !(voci[j + 1].tipo === 'tappa' && voci[j + 1].fatta) ? `${html}<p class="d-adesso" data-chiave="adesso">${ic('orologio', 16)}Da adesso, ${ora(Gx.inizio)}: orari ricalcolati</p>` : html;
    }).join('');
  },
  pagina(g) {
    const Gx = G(g), qui = g === S.g, D = X().giorni[g];
    const sug = Gx ? suggerite(g) : [];
    const l = Gx ? Gx.resta : 0;
    const libero = !Gx ? '' : l > 0 && sug.length && !Gx.avvisi.some(a => a.tipo === 'lontana' || a.tipo.startsWith('evento') || a.tipo === 'vicino') ? `<div class="d-libero"><p>${resta(l)} prima delle ${ora(Gx.fineScelta)}: c'è spazio per un'altra cartolina.</p>
        <ul class="d-sug">${sug.map(c => `<li><button type="button" class="d-sug__c onda" data-azione="aggiungi-subito" data-id="${c.id}">${fotoDi(c.id, 'm') ? `<img src="${fotoDi(c.id, 'm')}" alt="" loading="lazy" decoding="async">` : '<span class="d-senza"></span>'}<b>${esc(T(c.id).breve)}</b><small class="num">${c.tratto?.min ?? 0} min a piedi</small><span class="d-sug__piu" aria-hidden="true">${ic('piu', 18)}</span></button></li>`).join('')}</ul>
        <button type="button" class="d-bottone d-bottone--contorno onda" data-azione="aggiungi">Vedi tutte le tappe</button></div>` : liberoBlocco(Gx, 'd-libero', g);
    const corpo = D.gita ? giornoGita(g, 'd-gita') : Gx ? `${cifre(Gx, 'cifre d-francobolli', `@${g}`)}${tempo(Gx, 'tempo--d', { suf: `@${g}` })}${qui ? posizioneBlocco(Gx, g) : ''}${consiglio(g, 'consiglio--d')}<div class="d-cartoline">${this.cartoline(Gx, g)}</div>${libero}` : vuoto('d-vuoto', 'd-bottone');
    return `<section class="d-pagina${qui ? ' attiva giorno-attivo' : ''}${qui && computer.matches ? ' giorno-corpo' : ''}" data-pagina="${g}" aria-label="Giorno ${g + 1}"${qui ? ' data-inizio-giorno' : ' inert'}><h2>${ORDINALE[g]} giorno<small>${D.gita ? `gita: ${esc(T(D.gita).breve)}` : Gx ? esc(titoloGiorno(Gx)) : 'ancora vuoto'}</small></h2>${corpo}<div class="d-dopo"></div></section>`;
  },
  dopo() {
    const pag = $('#d-pagine'); if (!pag) return;
    const pc = computer.matches, itinerario = X(), ritardi = new Set();
    let attivo = true;
    const valido = () => attivo && S.p === 'd' && X() === itinerario && $('#d-pagine') === pag && pag.isConnected !== false && computer.matches === pc;
    let y0 = scrollY;
    ascolta('scroll', () => { if (!valido()) return; const tab = $('.d-tab'); if (!tab || computer.matches) return; const y = scrollY; if (Math.abs(y - y0) > 8) { tab.classList.toggle('d-tab--via', y > y0 && y > 260); y0 = y; } });
    this.osservaCartoline();
    if (pc) {
      mappa = new Mappa($('#mappa'), opzMappa({ tocca: id => Dp.tocca(id), margini: () => ({ t: 60, r: 56, b: 80, l: 56 }) }));
      mappa.disegna(G(S.g), { daLinea: rotta ? null : Infinity, altre: G(S.g) ? [] : altreLinee(), n: S.g + 1 });
      sfoglia(pag, () => $('.d-pagina.attiva'), vaiAlGiorno);
      return;
    }
    pag.scrollLeft = S.g * pag.clientWidth;
    this.misura();
    this.profondita();
    let fermo;
    const scorriPagine = () => {
      if (!valido()) return;
      const x = pag.scrollLeft / pag.clientWidth;
      $('#d-segno').style.transform = `translateX(${(x * PASSO).toFixed(1)}px)`;
      this.profondita();
      const i = Math.max(0, Math.min(nG() - 1, Math.floor(x))), h = this.alte || [];
      if (h[i] != null && this.coppia !== i) { this.coppia = i; pag.style.height = `${Math.max(h[i], h[i + 1] ?? 0)}px`; }
      const g = Math.max(0, Math.min(nG() - 1, Math.round(x)));
      if (g !== S.g) {
        contaDa(S.g, g);
        S.g = g; S.attiva = null; S.nuova = null;
        $$('.d-indice [role="tab"]').forEach(b => { const si = +b.dataset.g === g; b.setAttribute('aria-selected', String(si)); b.tabIndex = si ? 0 : -1; });
        $('#d-dove').textContent = `giorno ${g + 1} di ${nG()}`;
        $$('.d-pagina').forEach(p => { const q = +p.dataset.pagina === g; p.classList.toggle('attiva', q); p.classList.toggle('giorno-attivo', q); p.toggleAttribute('data-inizio-giorno', q); p.inert = !q; });
      }
      clearTimeout(fermo);
      fermo = setTimeout(() => {
        fermo = null; if (!valido()) return;
        this.coppia = null;
        this.misura();
        contaFine();
        const p = pag.children[S.g], top = p ? p.getBoundingClientRect().top : 0;
        if (p && top < -innerHeight * .9) {
          $$('.da-vedere:not(.vista)', p).forEach(x1 => { if (x1.getBoundingClientRect().top < innerHeight) { x1.classList.add('vista', 'subito'); this.io?.unobserve(x1); } });
          scrollTo({ top: scrollY + top - 120, behavior: piano() ? 'smooth' : 'auto' });
          const ritardo = setTimeout(() => { ritardi.delete(ritardo); if (valido()) $$('.subito', p).forEach(x1 => x1.classList.remove('subito')); }, 1000);
          ritardi.add(ritardo);
        }
      }, 140);
    };
    pag.addEventListener('scroll', scorriPagine, { passive: true });
    const ferma = () => {
      attivo = false; clearTimeout(fermo); ritardi.forEach(id => clearTimeout(id)); ritardi.clear();
      pag.removeEventListener('scroll', scorriPagine); ascolti.delete(ferma);
    };
    ascolti.add(ferma);
  },
  // le cartoline e le orme si appoggiano quando arrivano sullo schermo
  osservaCartoline(dove = $('#d-pagine')) {
    this.io?.disconnect(); this.io = null;
    if (!dove || !piano() || !('IntersectionObserver' in window)) return;
    const itinerario = X();
    const io = new IntersectionObserver(es => {
      if (this.io !== io || S.p !== 'd' || X() !== itinerario || dove.isConnected === false) return;
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vista'); io.unobserve(e.target); } });
    }, { rootMargin: computer.matches ? '0px 0px -8% 0px' : '0px 200% -8% 200%' });
    this.io = io;
    $$('.d-voce, .d-tratto, .d-francobolli, .d-pausa', dove).forEach(x => { if (!x.classList.contains('vista')) { x.classList.add('da-vedere'); io.observe(x); } });
  },
  profondita() {
    const pag = $('#d-pagine');
    if (!pag || !piano()) return;
    const x = pag.scrollLeft / pag.clientWidth;
    this.teste ??= new Map();
    $$('.d-pagina', pag).forEach(p => { const o = +p.dataset.pagina - x; if (Math.abs(o) > 1.2) return; let t = this.teste.get(p); if (!t || !t[0]?.isConnected) { t = $$(':scope > h2', p); this.teste.set(p, t); } t.forEach(e => { e.style.translate = `${(o * 38).toFixed(1)}% 0`; }); });
  },
  misura() {
    const pag = $('#d-pagine');
    if (!pag || computer.matches) return;
    this.alte = [...pag.children].map(p => p.offsetHeight);
    const i = Math.round(pag.scrollLeft / pag.clientWidth);
    if (this.alte[i] != null) pag.style.height = `${this.alte[i]}px`;
  },
  giorno(g, daX = 0) {
    const pag = $('#d-pagine');
    if (computer.matches) {
      const dir = g > S.g ? 1 : -1, vecchia = $('.d-pagina.attiva'), g0 = S.g;
      const x = X(), giorno = x.giorni[g], vista = S.p;
      const valido = () => !!giorno && X() === x && x.giorni[g] === giorno && S.g === g && S.p === vista && $('#d-pagine') === pag;
      S.g = g; S.attiva = null;
      $$('.d-indice [role="tab"]').forEach(b => { const si = +b.dataset.g === g; b.setAttribute('aria-selected', String(si)); b.tabIndex = si ? 0 : -1; });
      $('#d-segno').style.transform = `translateX(${g * PASSO}px)`;
      $('#d-dove').textContent = `giorno ${g + 1} di ${nG()}`;
      scorri(vecchia, dir, daX, () => {
        $$('.d-pagina', pag).forEach(p => { const q = +p.dataset.pagina === g; p.classList.toggle('attiva', q); p.classList.toggle('giorno-attivo', q); p.classList.toggle('giorno-corpo', q); p.toggleAttribute('data-inizio-giorno', q); p.inert = !q; });
        const nuova = $('.d-pagina.attiva');
        $$('.da-vedere', nuova).forEach(x => { if (x.getBoundingClientRect().top < innerHeight) { x.classList.add('vista', 'subito'); this.io?.unobserve(x); } });
        requestAnimationFrame(() => requestAnimationFrame(() => { if (valido()) $$('.subito', nuova).forEach(x => x.classList.remove('subito')); }));
        allInizio(nuova, $('.d-indice'));
        contaDa(g0, g);
        contaFine();
      }, () => $('.d-pagina.attiva'), () => mappa?.disegna(G(g), { vola: true, altre: G(g) ? [] : altreLinee(), n: g + 1 }), valido);
      return;
    }
    pag.scrollTo({ left: g * pag.clientWidth, behavior: piano() ? 'smooth' : 'auto' });
  },
  // un cambiamento nel giorno: si ridisegnano le pagine (le cartoline restano appoggiate) e la mappa
  aggiorna(fn, opz = {}) {
    const prima = S.g, n0 = nG();
    const box = $('.d-pagina.attiva .d-cartoline'), foto0 = box ? foto(box) : null;
    fn();
    if (!$('#d-pagine') || prima !== S.g || n0 !== nG() || opz.giorno) { aggiornaTutto(() => {}, opz); return; }
    let nuova = null;
    for (const vecchia of $$('.d-pagina')) {
      const g = +vecchia.dataset.pagina, tmp = document.createElement('div');
      tmp.innerHTML = this.pagina(g);
      const p = tmp.firstElementChild;
      $$('.d-voce, .d-tratto, .d-francobolli, .d-pausa', p).forEach(x => x.classList.add('vista'));
      vecchia.replaceWith(p);
      if (g === S.g) nuova = p;
    }
    scivola($('.d-cartoline', nuova), foto0, opz.salta);
    this.misura();
    contaCifre();
    contaFine();
    mappa?.disegna(G(S.g), { vola: false, daLinea: S.nuova ? null : Infinity, altre: G(S.g) ? [] : altreLinee(), n: S.g + 1 });
    if (mappaD) mappaD.disegna(G(S.g), { altre: G(S.g) ? [] : altreLinee(), n: S.g + 1, disegna: false });
    finisciNuova();
  },
  tocca(id, b) {
    S.attiva = id;
    $$('.d-cartolina').forEach(x => x.toggleAttribute('aria-current', x.dataset.id === id));
    mappa?.evidenzia(id);
    apriScheda(id, b);
  }
};
export const P = { c: C1, d: Dp };
export const mappaC = () => mappa;


// ---------- disegno della pagina ----------
function finisciNuova() {
  if (!S.nuova) return;
  const n = S.nuova;
  setTimeout(() => { if (S.nuova === n) { S.nuova = null; $$('.cmp .nuova').forEach(x => x.classList.remove('nuova')); } }, 2800);
}
export function disegna() {
  const r = document.documentElement;
  r.classList.remove('pc', 'pd', 'c-giu-su');
  r.classList.add('p' + S.p, 'q1');
  if (S.g >= nG()) S.g = nG() - 1;
  r.dataset.g = String(S.g);
  mappa?.spegni(); mappa = null;
  mappaD?.spegni(); mappaD = null;
  smettiAscolti();
  C1.guarda = null; C1.fermaGuarda = null;
  Dp.io?.disconnect(); Dp.io = null; Dp.teste?.clear();
  const app = $('#app');
  app.classList.toggle('apre', S.anima);
  app.innerHTML = P[S.p].html();
  P[S.p].dopo?.();
  rotta = false;
  $$('.cmp .schede').forEach(b => mettiSegno(b, { anima: false }));
  osservaSchede();
  if (S.anima) { const f = $('.firma', app); if (f) animaFirma(f); }
  S.anima = false;
  contaFine();
  contaCifre();
  finisciNuova();
}
export function aggiornaTutto(fn, { giorno = false } = {}) {
  const segno = segnoOra(), primaG = S.g;
  fn();
  if (giorno) rotta = true;
  disegna();
  if (segno) mettiSegno($('.cmp .schede'), { da: segno });
  if (giorno) { allInizio($('[data-inizio-giorno]'), S.p === 'd' ? $('.d-indice') : null); entra($('.giorno-corpo'), S.g >= primaG ? 1 : -1); }
  if (S.nuova) { const el = $(`.giorno-attivo [data-v-id="${S.nuova}"]`); if (el && !computer.matches) { const r = el.getBoundingClientRect(); if (r.top > innerHeight - 140 || r.bottom < 120) el.scrollIntoView({ block: 'center', behavior: piano() ? 'smooth' : 'auto' }); } }
}
export function vaiAlGiorno(g, daX = 0) {
  if (g < 0 || g >= nG() || g === S.g || occupato.si) return false;
  S.nuova = null; S.attiva = null;
  chiudiSchede();
  P[S.p].giorno(g, daX);
  return true;
}
// il nome in alto è il pulsante degli itinerari: un tocco apre «I miei itinerari» (cambiare, crearne uno, eliminare)
const nomeBottone = () => `<h2 class="nome-it"><button type="button" class="nome-it__b" data-azione="miei" aria-haspopup="dialog"><span class="nome-it__t">${esc(X().nome)}</span><span class="vh">, i miei itinerari</span>${ic('scendi', 18)}</button></h2>`;
// il nome dell'itinerario in alto (dopo Rinomina o Salva). Solo quello: i nomi delle vie sulla mappa hanno un attributo
// «data-nome» e prima venivano sovrascritti con il nome dell'itinerario
export const mettiNome = () => $$('.nome-it__t').forEach(x => { x.textContent = X().nome; });

// ---------- le azioni dei pulsanti (delega) ----------
const avvisiInChiusura = new WeakSet();
export const AZ = {
  ...AZ_PASTO,
  giorno: b => vaiAlGiorno(+b.dataset.g),
  'nuovo-giorno': nuovoGiorno,
  'togli-giorno': () => togliGiorno(),
  aggiungi: b => apriAggiungi(null, b?.dataset.tipo === 'gite' ? 'gite' : null),
  'aggiungi-subito': b => aggiungi(S.g, b.dataset.id),
  salva: b => salva(b),
  tempo: apriTempo,
  pausa: b => apriPausa(b.dataset.quale),
  miei: apriMiei, condividi: apriCondividi, altro: apriAltro, quando: apriQuando, giorni: apriGiorni,
  tappa: b => { if (gesto.trascinando) return; P[S.p].tocca(b.dataset.id, b); },
  visitata: b => segna(b.dataset.id),
  togli: b => togliTappa(b.dataset.id),
  'togli-gita': () => conAnnulla('Hai tolto la gita.', y => { delete y.giorni[S.g].gita; }, { giorno: true }),
  pronto: b => { const p = PRONTI.find(x => x.id === b.dataset.pronto); if (!p) return; if (p.evento) chiediGiornoRegata(); else mettiPronto(p); },
  'su-mappa': () => { if (computer.matches) { mappa?.tutto(); return; } scrollTo({ top: 0, behavior: piano() ? 'smooth' : 'auto' }); },
  ordina: () => {
    const g = S.g, o = ordineCorto(g);
    if (!o) return;
    conAnnulla(`Ordine cambiato: ${durataLunga(o.risparmio)} di strada in meno.`, y => { y.giorni[g].tappe = [...o.fatte, ...o.ordine]; });
  },
  'ordine-ok': () => { const g = S.g; aggiorna(y => { y.giorni[g].lascia = y.giorni[g].tappe.join('.'); }); annuncia('Ordine lasciato così'); },
  'sposta-oltre': () => { const a = G(S.g)?.avvisi.find(v => v.tipo === 'piena'); const x = X(); if (a?.daSpostare.length) spostaGiorno(a.daSpostare, S.g + 1 < x.giorni.length && !x.giorni[S.g + 1].gita ? S.g + 1 : x.giorni.length); },
  allunga: () => { const Gx = G(S.g); if (!Gx) return; const fine = Math.min(24 * 60 - 15, Math.ceil(Gx.fine / 30) * 30); conAnnulla(`Il giorno ${S.g + 1} ora finisce alle ${ora(fine)}.`, y => { y.giorni[S.g].fine = fine; }); },
  'sposta-lontana': b => spostaGiorno([b.dataset.id], +b.dataset.g),
  lascia: b => { const id = b.dataset.id; aggiorna(y => { const D = y.giorni[S.g]; D.ok = [...(D.ok ?? []), id]; }); annuncia(`${maiuscola(T(id).breve)} resta nel giorno ${S.g + 1}`); },
  anticipa: b => { const v = +b.dataset.ora; conAnnulla(`Il giorno ${S.g + 1} ora comincia alle ${ora(v)}.`, y => { y.giorni[S.g].inizio = v; }); },
  'gps-si': () => { VIVO.negata = false; VIVO.toccato = true; aggiorna(y => { y.posizione = 'si'; }); annuncia('Uso la posizione del telefono, solo su questa pagina'); },
  'gps-no': () => { aggiorna(y => { y.posizione = 'no'; }); annuncia('Non uso la posizione'); },
  // la X dell'avviso: il triangolo si richiude, il riquadro scivola via a destra, poi lo spazio si chiude
  'via-avviso': async b => {
    const el = b.closest('.avviso-giorno');
    if (!el || avvisiInChiusura.has(el)) return;
    const x = X(), g = S.g, giorno = x.giorni[g], vista = S.p, app = $('#app');
    const valido = () => X() === x && S.g === g && x.giorni[g] === giorno && S.p === vista && $('#app') === app && el.closest('#app') === app && el.isConnected !== false;
    if (!valido()) return;
    avvisiInChiusura.add(el);
    try {
      for (const k of b.dataset.chiave.split('|').slice(1)) viaAvvisi.add(`${b.dataset.chiave.split('|')[0]}|${k}`);
      if (piano()) {
        el.classList.add('avviso-giorno--via');
        await el.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(40px)', opacity: 0 }], { duration: 260, delay: 140, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }).finished.catch(() => {});
        if (!valido()) return;
        const h = el.offsetHeight, cs = getComputedStyle(el);
        await el.animate([{ height: h + 'px', marginTop: cs.marginTop, marginBottom: cs.marginBottom, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom }, { height: '0px', marginTop: '0px', marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px' }], { duration: 240, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }).finished.catch(() => {});
      }
      if (!valido()) return;
      const dopoEl = app?.querySelector('[data-azione="aggiungi"]');
      el.remove();
      annuncia('Avviso chiuso');
      dopoEl?.focus({ preventScroll: true });
      if (S.p === 'd') Dp.misura();
    } finally { avvisiInChiusura.delete(el); }
  },
  'mappa-d': () => {
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
  },
  'chiudi-mappa': () => { const s = $('#d-strato'); if (s) s.hidden = true; mappaD?.spegni(); mappaD = null; $('.d-tab__mappa')?.setAttribute('aria-pressed', 'false'); $('.d-tab__mappa')?.focus(); }
};
// ---------- cambio di vista coordinato ----------
let richiestaVista = 0, vistaRichiesta = null;
function aggiornaMenuVista() {
  const b = document.getElementById('vista-btn'); if (!b) return;
  $('.vista-ico', b).innerHTML = ic(S.p === 'c' ? 'mappa' : 'elenco', 20);
  $('#vista-nome', b).textContent = 'Vista: ' + NOMI_VISTA[S.p];
  b.setAttribute('aria-label', 'Vista: ' + NOMI_VISTA[S.p] + '. Cambia vista');
}
export function cambiaVista(v) {
  if (v !== 'c' && v !== 'd') return;
  if (v === S.p) {
    if (vistaRichiesta !== null) { richiestaVista++; vistaRichiesta = null; aggiornaMenuVista(); }
    return;
  }
  if (v === vistaRichiesta) return;
  const turno = ++richiestaVista, x = X(), app = $('#app');
  vistaRichiesta = v;
  const valido = () => turno === richiestaVista && X() === x && $('#app') === app && !!app && app.isConnected !== false;
  const annulla = () => { if (turno === richiestaVista) vistaRichiesta = null; };
  const fai = async () => {
    if (!valido()) { annulla(); return false; }
    try { await chiudiSchede(); }
    catch { if (valido()) avvisa('La vista non si è aggiornata. Riprova dal menu.'); annulla(); return false; }
    if (!valido()) { annulla(); return false; }
    vistaRichiesta = null; S.p = v; ricordaVista(v); S.anima = true; rotta = true; disegna(); scrollTo(0, 0);
    aggiornaMenuVista();
    // Il pulsante che aveva aperto il menu è stato ridisegnato.
    if (!document.activeElement || document.activeElement === document.body) $('.cmp [popovertarget="menu"]')?.focus({ preventScroll: true });
    annuncia(v === 'c' ? 'Vista Mappa prima' : 'Vista Le pagine');
    return true;
  };
  if (document.startViewTransition && piano()) document.startViewTransition(fai).ready.catch(() => {}); else return fai();
}
// Il logo del menu (quello ambra della pagina) si anima a ogni apertura e passandoci sopra; con «riduci movimento» resta
// fermo (Marchio.astro). Dura quanto quello della pagina.
function animaLogoMenu(m) {
  let t = 0;
  const vai = () => {
    if (m.classList.contains('menu--anima')) return;
    m.classList.add('menu--anima');
    t = setTimeout(() => m.classList.remove('menu--anima'), GIRO_FIRMA);
  };
  m.addEventListener('toggle', e => {
    clearTimeout(t); m.classList.remove('menu--anima');
    if (e.newState === 'open') { void m.offsetWidth; vai(); }
  });
  $('.firma', m)?.addEventListener('pointerenter', vai);
}
// il cambio di vista sta nel menu del sito, sotto il tema chiaro/scuro e con lo stesso gesto (Header.astro, solo in questa pagina)
const NOMI_VISTA = { c: 'Mappa prima', d: 'Le pagine' };
export function preparaMenu() {
  const m = document.getElementById('menu');
  if (m) animaLogoMenu(m);
  const b = document.getElementById('vista-btn');
  if (!b) return;
  aggiornaMenuVista();
  b.hidden = false;
  b.addEventListener('click', () => {
    const m = document.getElementById('menu');
    try { m?.hidePopover?.(); } catch { /* già chiuso */ }
    m?.classList.remove('aperto');
    cambiaVista((vistaRichiesta ?? S.p) === 'c' ? 'd' : 'c');
  });
}

// i comandi della pagina: tocchi, tastiera sui giorni e sulle maniglie, trascinare
export function preparaViste() {
  const app = $('#app');
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-azione]');
    if (b && !b.disabled) AZ[b.dataset.azione]?.(b, e);
  });
  app.addEventListener('keydown', e => {
    const t = e.target.closest('[role="tab"]');
    if (t && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const g = e.key === 'Home' ? 0 : e.key === 'End' ? nG() - 1 : Math.max(0, Math.min(nG() - 1, S.g + (e.key === 'ArrowRight' ? 1 : -1)));
      vaiAlGiorno(g);
      requestAnimationFrame(() => $(`[role="tab"][data-g="${g}"]`)?.focus());
      return;
    }
    const m = e.target.closest('[data-maniglia]');
    if (!m || !['ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const id = m.dataset.maniglia, ordine = tappeDi(G(giornoDi(id))).map(v => v.id), i = ordine.indexOf(id);
    spostaA(id, i + (e.key === 'ArrowUp' ? -1 : 1));
    requestAnimationFrame(() => $(`[data-maniglia="${id}"]`)?.focus());
  });
  app.addEventListener('pointerdown', e => {
    const b = e.target.closest('.onda');
    if (b && piano()) {
      const r = b.getBoundingClientRect(), o = document.createElement('i');
      o.className = 'onda__i';
      o.style.left = `${e.clientX - r.left}px`; o.style.top = `${e.clientY - r.top}px`;
      b.append(o);
      setTimeout(() => o.remove(), 700);
    }
    const m = e.target.closest('[data-maniglia]');
    if (!m || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const voce = m.closest('[data-trascina]');
    if (!voce) return;
    e.preventDefault();
    iniziaTrascina(voce, e, m);
  });
  // dopo un trascinamento non si apre la scheda
  app.addEventListener('click', e => { if (gesto.trascinando && e.target.closest('[data-azione="tappa"]')) { e.stopPropagation(); e.preventDefault(); } }, true);
  document.addEventListener('dragstart', e => { if (e.target.closest?.('#app, #scheda, #foglio')) e.preventDefault(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && $('#d-strato') && !$('#d-strato').hidden) AZ['chiudi-mappa'](); });
  computer.addEventListener('change', async () => { await chiudiSchede(); rotta = true; disegna(); });
  addEventListener('resize', () => { if (S.p === 'd') Dp.misura(); });
}
