// «Aggiungi» (pezzo 3, scelta di Enrico: le file di cartoline con il segno 4, il corsivo). Una ricerca sola per tappe, locali e
// gite (src/lib/itinerari/ricerca.ts), in gruppi da scorrere di lato; senza parole le tappe dalla più vicina e qualche ricerca
// da provare; elenco o mappa; i filtri. Un tocco sul risultato apre la scheda, con «Torna ai risultati».
import { $, $$, esc, ic, piano, ora, durata, dopo } from './base.js';
import { C, E, T, X, UI, schedePronte, caricaSchede, giornoDi, nelViaggio, lista, ultimaDi, aggiunta, G, chiusaIl, dataLungaDi } from './stato.js';
import { creaIndice, cerca, evidenzia, pezzetto, gruppoDi } from '../../../lib/itinerari/ricerca';
import { S, assicuraSchede, foglio, chiudiFoglio, annunciaF, quandoChiudeFoglio } from './comuni.js';
import { aggiungi, aggiungiGita } from './viste.js';
import { schedaFuori, apriScheda } from './scheda.js';
import { Mappa } from './mappa.js';

const FILTRI = [
  ['tutte', 'Tutte', () => true], ['musei', 'Musei', t => t.generi.some(g => g === 'museo' || g === 'archeologia')], ['chiese', 'Chiese', t => t.generi.includes('chiesa')],
  ['panorami', 'Panorami', t => t.generi.includes('panorama')], ['sotto', 'Sottoterra', t => t.generi.includes('sotterraneo')], ['verde', 'Parchi e mare', t => t.generi.some(g => g === 'parco' || g === 'mare')],
  ['passeggiate', 'Passeggiate', t => t.generi.includes('passeggiata')], ['gratis', 'Gratis', t => t.ingresso === 'gratis' && !t.categoria],
  ['mangiare', 'Da mangiare', t => !!t.categoria], ['gite', 'Gite', t => t.tipo === 'gita']
];
const GRUPPI = { vedere: { nome: 'Da vedere', ic: 'occhio' }, mangiare: { nome: 'Da mangiare', ic: 'posate' }, gite: { nome: 'Gite', ic: 'bussola' } };
const CUCINA_NOME = { pizza: 'Pizzeria', pesce: 'Pesce', dolci: 'Pasticceria e caffè', strada: 'Cibo di strada', carne: 'Carne', pasta: 'Pasta', napoletana: 'Cucina napoletana' };
const PROVA_CERCA = ['Cristo velato', 'Caravaggio', 'sfogliatella', 'panorama', 'pizza fritta', 'gesu', 'Pompei', 'catacombe'];

let INDICE = null;
const indice = () => (INDICE ??= creaIndice(C.tappe.map(t => ({ ...T(t.id), zona: T(t.id).zona, frasi: T(t.id).frasi ?? [] })), UI.citta ?? []));
const xDi = id => indice().voci.find(x => x.id === id);
const fotoDi = id => T(id)?.foto?.c;
// perché è uscita: la frase, l'etichetta o la zona
function motivo(r) {
  const x = xDi(r.id);
  if (r.tipo === 'frase') return pezzetto(x.frasi[r.k], r.dove, 3);
  if (r.tipo === 'piatto') return `Nel menu: ${esc(r.nome)}`;
  if (r.tipo === 'cucina' || r.tipo === 'genere' || r.tipo === 'gruppo') return esc(r.nome);
  if (r.tipo === 'zona') return `Zona: ${esc(T(r.id).zona)}`;
  return '';
}
// la parola trovata, come è scritta nel testo: va in grande dove manca la foto
function parolaTrovata(r) {
  if (r.tipo === 'frase') { const p = xDi(r.id).frasi[r.k]; const w = [...new Set(r.dove)].sort((a, b) => a - b).map(i => p.s.slice(p.seg[i].i, p.seg[i].i + p.seg[i].n)).join(' '); return w.charAt(0).toUpperCase() + w.slice(1); }
  if (r.tipo === 'nome') return T(r.id).breve;
  if (r.tipo === 'zona') return T(r.id).zona;
  return r.nome;
}
const nomeTrovato = r => (r.tipo === 'nome' ? evidenzia(xDi(r.id).nome, r.dove) : esc(T(r.id).nome));
function dettagli(r) {
  const t = T(r.id), out = [];
  if (r.gruppo === 'gite') { out.push(t.durata > 240 ? 'un giorno intero' : 'mezza giornata'); if (t.partenza) out.push(`da ${esc(t.partenza)}`); return out; }
  if (r.min != null) out.push(`<span class="num">${r.min} min</span> di strada`);
  if (r.gruppo === 'mangiare') { out.push(esc(CUCINA_NOME[t.cucina?.[0]] ?? 'Locale')); if (t.fascia) out.push('€'.repeat(t.fascia)); }
  else out.push(`${durata(t.durata)} di visita`);
  return out;
}
// il tasto a destra: «+», oppure il giorno in cui la tappa c'è già; le gite prendono un giorno a parte
function tastoRisultato(r, cl = 'r-piu') {
  const g = giornoDi(r.id), b = esc(T(r.id).breve);
  if (g >= 0) return `<span class="r-gia"><span class="vh">${b}: </span>Giorno ${g + 1}</span>`;
  if (X().giorni.some(D => D.gita === r.id)) return `<span class="r-gia"><span class="vh">${b}: </span>Giorno ${X().giorni.findIndex(D => D.gita === r.id) + 1}</span>`;
  if (r.gruppo === 'gite') return `<button type="button" class="${cl} r-piu--gita" data-f="gita" data-id="${r.id}" aria-label="${b}: aggiungi la gita">${ic('piu', 20)}</button>`;
  return `<button type="button" class="${cl}" data-f="agg" data-id="${r.id}" aria-label="Aggiungi ${b} al giorno ${S.g + 1}">${ic('piu', 20)}</button>`;
}
// le file di cartoline: un gruppo per fila, da scorrere col dito; il motivo come un cartellino
function riquadro(R, nuovi) {
  const carta = (r, i) => {
    const f = fotoDi(r.id), senza = !f;
    return `<li class="r2-carta${nuovi.has(r.id) ? ' r-entra' : ''}${senza ? ' r2-carta--senza' : ''}" style="--i:${Math.min(i, 8)}">
      <button type="button" class="r2-apri" data-f="apri" data-id="${r.id}">${senza ? `<span class="r2-tipo" aria-hidden="true"><span>${esc(parolaTrovata(r))}</span></span>` : `<img src="${f}" alt="" loading="lazy" decoding="async">`}
        <span class="r2-t"><b>${nomeTrovato(r)}</b><small>${dettagli(r).join(' · ')}</small></span></button>
      ${!senza && r.tipo !== 'nome' && r.tipo !== 'zona' ? `<span class="r2-cartellino">${motivo(r)}</span>` : ''}
      ${tastoRisultato(r, 'r-piu r2-piu')}</li>`;
  };
  return R.gruppi.map(({ g, l }) => `<section class="r2-gruppo" aria-labelledby="r2-${g}"><h3 id="r2-${g}"><span>${GRUPPI[g].nome}</span><span class="num r2-n">${l.length}</span></h3>
    <ul class="r2-fila" tabindex="0" aria-label="${GRUPPI[g].nome}: scorri di lato">${l.map(carta).join('')}</ul></section>`).join('');
}
function scriviSegnaposto(input, testo) {
  if (!piano()) { input.placeholder = testo; return; }
  let i = 0;
  input.placeholder = '';
  const t = setInterval(() => { if (!input.isConnected || input.value) { clearInterval(t); input.placeholder = testo; return; } input.placeholder = testo.slice(0, ++i); if (i >= testo.length) clearInterval(t); }, 34);
}

let mappaF = null;
quandoChiudeFoglio(null);
export async function apriAggiungi(prima = null, tipo = null) {
  // la ricerca guarda anche nelle frasi dei testi, che arrivano con le schede
  await assicuraSchede();
  const g = S.g, D = X().giorni[g];
  const ultima = !D.gita && ultimaDi(g) ? T(ultimaDi(g)).breve : null;
  let filtro = prima?.filtro ?? (tipo === 'gite' ? 'gite' : 'tutte'), q = prima?.q ?? '', scelta = null, visti = new Set();
  const memoA = new Map();
  const per = id => { if (!memoA.has(id)) memoA.set(id, D.gita || !lista(g).length ? { tratto: null, X: null } : aggiunta(g, id)); return memoA.get(id); };
  const okF = id => FILTRI.find(f => f[0] === filtro)[2](T(id));
  const candidati = () => C.tappe.map(t => t.id).filter(id => !nelViaggio(id) && !X().giorni.some(D2 => D2.gita === id) && okF(id) && (filtro === 'gite' || filtro === 'mangiare' ? true : gruppoDi(T(id)) === 'vedere'));
  const minDi = id => per(id).tratto?.min ?? 0;
  const avvisiDi = id => {
    const out = [], X1 = per(id).X;
    if (X1 && X1.fine > X1.fineScelta) out.push(`Finiresti alle ${ora(X1.fine)}`);
    if (X1?.avvisi.some(x => x.tipo === 'lontana' && x.id === id)) out.push('Lontana dalle altre');
    const v = X1?.voci.find(x => x.tipo === 'tappa' && x.id === id);
    if (v?.chiusaOra) out.push(v.chiusaOra.apre != null ? `Arrivi alle ${ora(v.inizio)}: apre alle ${ora(v.chiusaOra.apre)}` : v.chiusaOra.chiude != null ? `Chiude alle ${ora(v.chiusaOra.chiude % 1440)}` : `Alle ${ora(v.inizio)} è chiuso`);
    return out;
  };
  const etich = id => [...avvisiDi(id).map(x => `<span class="f-et f-et--attenzione">${esc(x)}</span>`), ...(chiusaIl(id, g) ? [`<span class="f-et">Chiuso ${dataLungaDi(g)}</span>`] : []), ...(T(id).prenotazione === 'obbligatoria' ? ['<span class="f-et">Solo prenotando</span>'] : [])].join('');
  const daDove = id => (per(id).tratto ? `<span class="num">${per(id).tratto.min} min</span> da ${esc(ultima)}, ` : '');
  const riga = (id, i) => {
    const t = T(id), f = T(id).foto?.m, gita = t.tipo === 'gita';
    return `<li class="f-tappa" style="--i:${Math.min(i, 12)}">${f ? `<img src="${f}" alt="" loading="lazy" decoding="async">` : `<span class="f-senza" aria-hidden="true">${esc(t.breve.slice(0, 1))}</span>`}
      <button type="button" class="f-tappa__apri" data-f="apri" data-id="${id}"><b>${esc(t.nome)}</b><small>${gita ? `${t.durata > 240 ? 'Un giorno intero' : 'Mezza giornata'}${t.partenza ? `, da ${esc(t.partenza)}` : ''}` : `${daDove(id)}${durata(t.durata)} ${t.categoria ? 'per mangiare' : 'di visita'}`}</small>${gita ? '' : etich(id)}</button>${gita ? `<button type="button" class="f-piu" data-f="gita" data-id="${id}" aria-label="Aggiungi la gita a ${esc(t.breve)}">${ic('piu', 20)}</button>` : `<button type="button" class="f-piu" data-f="agg" data-id="${id}" aria-label="Aggiungi ${esc(t.breve)} al giorno ${g + 1}">${ic('piu', 20)}</button>`}</li>`;
  };
  // le regate, solo nei giorni di regata in calendario
  const regate = () => {
    const d = X().data ? new Date(`${X().data}T12:00:00`) : null;
    if (!E || !d || D.gita || lista(g).includes(E.id)) return '';
    const data = new Date(d.getTime() + g * 864e5).toISOString().slice(0, 10), gr = E.giorni[data];
    if (!gr) return '';
    return `<section class="f-gruppo"><h3>Oggi in calendario</h3><ul><li class="f-tappa"><span class="f-senza" aria-hidden="true">${ic('vela', 20)}</span><button type="button" class="f-tappa__apri" data-f="apri" data-id="${E.id}"><b>${esc(E.nome)}</b><small>${esc(gr.titolo)}, dalle ${ora(E.inizio)}${gr.possibile ? ', se la sfida non è già finita' : ''}</small></button><button type="button" class="f-piu" data-f="agg" data-id="${E.id}" aria-label="Aggiungi ${esc(E.nome)}">${ic('piu', 20)}</button></li></ul></section>`;
  };
  // senza parole: le tappe dalla più vicina (e qualche ricerca da provare)
  const vicine = () => {
    const l = candidati().sort((a, b) => minDi(a) - minDi(b) || a.localeCompare(b));
    const gruppi = ultima && filtro !== 'gite' ? [['A meno di 10 minuti', l.filter(id => minDi(id) < 10)], ['Tra 10 e 25 minuti', l.filter(id => minDi(id) >= 10 && minDi(id) < 25)], ['Più lontane', l.filter(id => minDi(id) >= 25)]] : [[filtro === 'gite' ? 'Gite di un giorno' : filtro === 'mangiare' ? 'Tutti i locali' : 'Tutte le tappe', l]];
    let i = 0;
    return `<div class="r-prova"><p id="r-prova-t">Prova a cercare</p><div class="r-prova__l" role="group" aria-labelledby="r-prova-t">${PROVA_CERCA.map(x => `<button type="button" data-f="prova" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>${regate()}`
      + (D.gita && filtro !== 'gite' ? `<p class="f-nota">Il giorno ${g + 1} è una gita: le tappe in città vanno in un giorno nuovo, subito dopo.</p>` : '')
      + gruppi.filter(x => x[1].length).map(([tit, l2]) => `<section class="f-gruppo"><h3>${tit} <span class="num">${l2.length}</span></h3><ul>${l2.map(id => riga(id, i++)).join('')}</ul></section>`).join('');
  };
  const nessuno = () => `<div class="r-vuoto"><p><b>Niente per «${esc(q)}»</b>${filtro !== 'tutte' ? ' con il filtro di adesso.' : '.'}</p>
    ${filtro !== 'tutte' ? '<button type="button" class="f-bottone f-bottone--contorno" data-f="togli-filtri">Togli i filtri</button>' : `<p class="f-nota">Prova con il nome di un'opera, di un piatto o di una zona:</p><div class="r-prova__l">${PROVA_CERCA.slice(0, 5).map(x => `<button type="button" data-f="prova" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>`}</div>`;
  const risultati = () => {
    const R = cerca(indice(), q, { ok: okF, minuti: id => (gruppoDi(T(id)) === 'gite' || nelViaggio(id) || !lista(g).length || D.gita ? null : minDi(id)) });
    if (!R) { visti = new Set(); return { html: vicine(), n: null }; }
    if (!R.tutti.length) { visti = new Set(); return { html: nessuno(), n: 0 }; }
    const nuovi = new Set(R.tutti.map(r => r.id).filter(id => !visti.has(id)));
    visti = new Set(R.tutti.map(r => r.id));
    const conta = `<p class="r-conta" id="r-conta"><span class="num">${R.tutti.length}</span> ${R.tutti.length === 1 ? 'risultato' : 'risultati'} per «${esc(q)}»</p>`;
    return { html: `<div class="r r--2 segno-4">${conta}${riquadro(R, nuovi)}</div>`, n: R.tutti.length };
  };
  const ids = () => candidati().filter(id => T(id).tipo === 'citta');
  const schedina = id => {
    if (!id) return `<p class="f-scelta__vuota">${ic('spilli', 18)}<span>Tocca una foto: vedi la tappa e la aggiungi. ${ids().length} sulla mappa.</span></p>`;
    const t = T(id);
    return `<div class="f-scelta__c">${t.foto?.m ? `<img src="${t.foto.m}" alt="">` : `<span class="f-senza" aria-hidden="true">${esc(t.breve.slice(0, 1))}</span>`}<div class="f-scelta__t"><b>${esc(t.nome)}</b><small>${daDove(id)}${durata(t.durata)} di visita</small>${etich(id)}</div><button type="button" class="f-scelta__piu" data-f="agg" data-id="${id}" aria-label="Aggiungi ${esc(t.breve)} al giorno ${g + 1}">${ic('piu', 18)}Aggiungi</button></div>`;
  };
  const tutte = C.tappe;
  const testo = `Cerca tra ${tutte.filter(t => gruppoDi(t) === 'vedere').length} tappe, ${tutte.filter(t => gruppoDi(t) === 'mangiare').length} locali e ${tutte.filter(t => gruppoDi(t) === 'gite').length} gite: nomi, opere, piatti, zone`;
  const corpo = `<div class="f-cerca f-cerca--a"><label class="vh" for="f-q">Cerca tappe, locali e gite</label>${ic('cerca', 20)}<input id="f-q" type="search" placeholder="Cerca" autocomplete="off" enterkeyhint="search" aria-describedby="f-q-aiuto" aria-controls="f-elenco" value="${esc(q)}"><span class="vh" id="f-q-aiuto">${testo}</span></div>
    <div class="f-vista" role="group" aria-label="Come vedere le tappe"><button type="button" aria-pressed="true" data-fv="elenco">${ic('elenco', 18)}Elenco</button><button type="button" aria-pressed="false" data-fv="mappa">${ic('mappa', 18)}Mappa</button></div>
    <div class="f-filtri" role="group" aria-label="Che tipo di tappa">${FILTRI.map(([k, n]) => `<button type="button" aria-pressed="${k === filtro}" data-filtro="${k}">${n}</button>`).join('')}</div>
    <p class="vh" id="r-voce" aria-live="polite"></p><div id="f-elenco">${risultati().html}</div>
    <div id="f-mappa-box" class="f-mappa-box" hidden><div id="f-mappa" class="f-mappa"></div><div id="f-scelta" class="f-scelta" aria-live="polite">${schedina(null)}</div></div>
    <p class="f-nota">La ricerca guarda nei nomi, in parole come «panorama» o «pizzeria» e nelle frasi dei nostri testi, che hanno le fonti in fondo alla pagina. I minuti sono quelli di strada dall'ultima tappa del giorno.</p>`;
  foglio('Aggiungi una tappa', corpo, f => {
    quandoChiudeFoglio(() => { mappaF?.spegni(); mappaF = null; });
    const input = $('#f-q', f);
    if (!q) input.addEventListener('focus', () => scriviSegnaposto(input, 'Un museo, un\'opera, un piatto…'), { once: true });
    let annuncioT;
    const rifai = (annuncia = true) => {
      const r = risultati();
      $('#f-elenco', f).innerHTML = r.html;
      $$('.r2-fila', f).forEach(x => { x.scrollLeft = 0; });
      clearTimeout(annuncioT);
      if (annuncia && r.n != null) annuncioT = setTimeout(() => annunciaF(r.n ? `${r.n} ${r.n === 1 ? 'risultato' : 'risultati'}` : `Niente per ${q}`), 500);
      if (mappaF) { mappaF.punti(ids()); if (scelta && !ids().includes(scelta)) scelta = null; $('#f-scelta', f).innerHTML = schedina(scelta); mappaF.evidenzia(scelta); }
    };
    input.addEventListener('input', e => { q = e.target.value.trim(); rifai(); });
    if (prima) requestAnimationFrame(() => { input.focus({ preventScroll: true }); input.setSelectionRange(q.length, q.length); });
    const sceglie = id => { scelta = id; $('#f-scelta', f).innerHTML = schedina(id); mappaF?.evidenzia(id); };
    const mostra = v => {
      $$('[data-fv]', f).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.fv === v)));
      $('#f-elenco', f).hidden = v !== 'elenco';
      $('#f-mappa-box', f).hidden = v !== 'mappa';
      if (v === 'mappa' && !mappaF) {
        mappaF = new Mappa($('#f-mappa', f), { punto: id => sceglie(id), tocca: id => apriScheda(id), margini: () => ({ t: 34, r: 30, b: 34, l: 30 }), distanza: 30 });
        mappaF.disegna(G(g), { disegna: false, punti: ids(), n: g + 1 });
        mappaF.mostraTutte(true, false);
        setTimeout(() => mappaF?.inquadra(0, ids().sort((a, b) => minDi(a) - minDi(b)).slice(0, 12)), 60);
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
      if (k === 'apri') { schedaFuori(b.dataset.id, { q, filtro }); return; }
      if (k !== 'agg' && k !== 'gita') return;
      b.classList.add('f-piu--dentro');
      b.innerHTML = b.classList.contains('f-scelta__piu') ? `${ic('spunta', 18)}Aggiunta` : ic('spunta', 20);
      await dopo(piano() ? 420 : 0);
      await chiudiFoglio();
      if (k === 'gita') aggiungiGita(b.dataset.id); else aggiungi(g, b.dataset.id);
    };
  }, 'f--a');
}
