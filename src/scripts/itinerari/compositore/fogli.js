// I fogli del compositore: «Salva» (in C il segnaposto che cade con l'onda, in D il timbro), «I miei itinerari» (apri, Rinomina,
// Condividi, Elimina con «Annulla»), «Condividi», «Pause e margini», una pausa, «Data e orari», «Altro», «I giorni», gli
// itinerari pronti (anche la giornata di regata, che vuole un giorno di regata).
import { $, $$, esc, ic, piano, range, ora, durata, maiuscola, oggi } from './base.js';
import { E, T, X, A, PRONTI, nG, G, daFare, tappeDi, titoloGiorno, salvato, visitata, apri, nuovo, nomeLibero, ricordaBozza, gia, dopoModifica, scriviArchivio, ripristina, piuGiorni, dataLungaDi, chiusaIl, nuovoItinerario, vuotoTutto } from './stato.js';
import { codifica, MAX_NOME, MAX_GIORNI } from '../../../lib/itinerari/link';
import { dataValida, dataBreve, dataLunga } from '../../../lib/itinerari/date';
import { TIPI_PAUSA, MARGINI, pauseDelGiorno } from '../../../lib/itinerari/pause';
import { grezzo } from './stato.js';
import { C } from './stato.js';
import { S, foglio, chiudiFoglio, rinfresca, avvisa, annuncia, contaCifre, tempo } from './comuni.js';
import { aggiorna, aggiornaTutto, conAnnulla, mettiNome, NOMI_PAUSA, IC_PAUSA, nuovoGiorno, vaiAlGiorno, togliGiorno } from './viste.js';
import { chiudiSchede } from './scheda.js';

const MAX_SALVATI = 50;

// ---------- «Salva» ----------
const spilloSalva = `<svg class="salva__ic salva__ic--spillo" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="spillo-clip"><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z"/></clipPath></defs><g clip-path="url(#spillo-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle class="salva__buco" cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const segnalibro = `<svg class="salva__ic" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="salva-clip"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></clipPath></defs><g clip-path="url(#salva-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path class="salva__spunta" d="M9 11.2l2.2 2.2 4-4.4" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const bottoneSalva = (cl = '') => `<button type="button" class="salva salva--${S.p} ${cl}${salvato() ? ' salva--fatto' : ''}" data-azione="salva">${S.p === 'c' ? spilloSalva : segnalibro}<span class="salva__t"><span class="salva__a">Salva</span><span class="salva__b">Salvato</span></span>${S.p === 'c' ? '<i class="salva__onda" aria-hidden="true"></i>' : '<i class="salva__inchiostro" aria-hidden="true"></i>'}</button>`;
export const stato = () => `<span class="stato" data-stato="${salvato() ? 'salvato' : 'bozza'}"><i aria-hidden="true"></i><span class="stato__t">${salvato() ? 'Salvato in «I miei itinerari»' : 'Non ancora salvato'}</span></span>`;
const GENERICI = /^(Il mio itinerario|Nuovo itinerario|Itinerario ricevuto|Itinerario)( \(\d+\))?$/;
// il nome proposto: «Napoli, 12–14 ottobre» con la data, altrimenti «Napoli in 2 giorni»
function nomeProposto(x) {
  if (x.data) {
    const fine = piuGiorni(x.data, x.giorni.length - 1), [a, b] = [dataBreve(x.data), dataBreve(fine)];
    return x.giorni.length === 1 ? `Napoli, ${a}` : a.split(' ')[1] === b.split(' ')[1] ? `Napoli, ${a.split(' ')[0]}–${b}` : `Napoli, ${a} – ${b}`;
  }
  return x.giorni.length === 1 ? 'Napoli in un giorno' : `Napoli in ${x.giorni.length} giorni`;
}
export function salva(b) {
  const x = X();
  if (salvato(x)) { apriMiei(); return; }
  const salvati = A.elenco.filter(i => salvato(i)).length;
  if (salvati >= MAX_SALVATI) { avvisa(`Sul telefono ci sono già ${MAX_SALVATI} itinerari salvati: elimina quelli che non ti servono, oppure mandalo con «Condividi».`); return; }
  x.salvato = true;
  if (GENERICI.test(x.nome)) x.nome = nomeLibero(nomeProposto(x), x.id);
  dopoModifica();
  const ok = scriviArchivio();
  if (!ok) { x.salvato = false; avvisa('Questo browser non può salvare (navigazione privata o memoria piena): manda l\'itinerario con «Condividi», il link porta tutto.', { testo: 'Condividi', fai: apriCondividi }); return; }
  mettiNome();
  $$('.cmp .salva').forEach(s => s.classList.add('salva--fatto'));
  if (b?.classList.contains('salva')) { b.classList.remove('salva--ora'); void b.offsetWidth; b.classList.add('salva--ora'); }
  $$('.cmp [data-stato]').forEach(s => { s.dataset.stato = 'salvato'; s.querySelector('.stato__t').textContent = 'Salvato in «I miei itinerari»'; });
  setTimeout(() => {
    aggiorna(() => {});
    avvisa(`Salvato: «${X().nome}». Adesso puoi segnare le tappe che hai visitato.${salvati + 1 >= MAX_SALVATI - 5 ? ` Ne hai ${salvati + 1} su ${MAX_SALVATI}.` : ''}`, { testo: 'Vedi', fai: apriMiei });
  }, piano() ? 700 : 0);
}

// ---------- pause e margini ----------
export function apriPausa(quale) {
  const g = S.g, tipo = TIPI_PAUSA[quale], nome = NOMI_PAUSA[quale];
  const cambiaPause = fn => aggiorna(y => { const D = y.giorni[g]; const l = (D.pause ?? pauseDelGiorno(C, D, grezzo(g))).map(p => ({ ...p })); fn(l); D.pause = l; });
  const corpo = () => {
    const Gx = G(g), p = Gx?.pause.find(x => x.quale === quale);
    if (!p) return `<p>Questa pausa non c'è più.</p><div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Chiudi</button></div>`;
    return `<p class="f-pausa-ora">${ic(IC_PAUSA[quale], 22)}<span>Dalle <b class="num">${ora(p.inizio)}</b> alle <b class="num">${ora(p.fine)}</b>, dopo ${esc(T(p.dove).breve)}</span></p>
      <fieldset class="f-scelte"><legend>Quanto dura</legend><div>${tipo.scelte.map(m => `<button type="button" aria-pressed="${p.min === m}" data-f="durata" data-v="${m}">${durata(m)}</button>`).join('')}</div></fieldset>
      <fieldset class="f-scelte"><legend>Dopo quale tappa</legend><div>${daFare(Gx).slice(0, -1).map(v => `<button type="button" aria-pressed="${p.dove === v.id}" data-f="dopo" data-v="${v.id}">${esc(T(v.id).breve)}</button>`).join('')}</div></fieldset>
      ${tempo(Gx, 'tempo--f', { bottone: false })}
      <div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Fatto</button><button type="button" class="f-bottone f-bottone--contorno" data-f="togli-pausa">${ic('cestino', 18)}Togli la pausa</button></div>`;
  };
  foglio(nome, `<div id="f-vivo">${corpo()}</div>`, f => {
    f.onclick = e => {
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      const k = b.dataset.f;
      if (k === 'fatto') { chiudiFoglio(); return; }
      if (k === 'togli-pausa') {
        chiudiFoglio();
        conAnnulla(`${nome} tolta dal giorno ${g + 1}.`, y => { const D = y.giorni[g]; D.pause = (D.pause ?? pauseDelGiorno(C, D, grezzo(g))).filter(x => x.quale !== quale); });
        return;
      }
      cambiaPause(l => { const x = l.find(y => y.quale === quale); if (!x) return; if (k === 'durata') x.min = +b.dataset.v; if (k === 'dopo') x.dopo = b.dataset.v; });
      rinfresca(f, corpo(), b);
    };
  }, 'f--pausa');
}
export function apriTempo() {
  const g = S.g;
  const corpo = () => {
    const Gx = G(g);
    if (!Gx) return `<p>Il giorno ${g + 1} ${X().giorni[g].gita ? 'è una gita: la giornata la decide la gita' : 'è vuoto: prima aggiungi le tappe, poi le pause'}.</p>`;
    const mancano = Object.keys(TIPI_PAUSA).filter(q => !TIPI_PAUSA[q].solo && !Gx.pause.some(p => p.quale === q));
    return `${tempo(Gx, 'tempo--f', { bottone: false })}
      <section class="f-sezione"><h3>Pause del giorno ${g + 1}</h3>
        ${Gx.pause.length ? `<ul class="f-pause">${Gx.pause.map(p => `<li><button type="button" class="f-pausa onda" data-f="pausa" data-v="${p.quale}">${ic(IC_PAUSA[p.quale], 22)}<span><b>${NOMI_PAUSA[p.quale]}, ${durata(p.min)}</b><small class="num">${ora(p.inizio)}–${ora(p.fine)}, dopo ${esc(T(p.dove).breve)}</small></span><span class="f-pausa__cambia">Cambia</span></button></li>`).join('')}</ul>` : '<p class="f-nota">Nessuna pausa: la giornata va da una tappa all\'altra.</p>'}
        ${mancano.length && daFare(Gx).length > 1 ? `<div class="f-chips">${mancano.map(q => `<button type="button" class="f-chip" data-f="nuova-pausa" data-v="${q}">${ic('piu', 16)}${NOMI_PAUSA[q]}</button>`).join('')}</div>` : ''}
      </section>
      <section class="f-sezione"><h3 id="f-margine-t">Margine a ogni spostamento</h3><p class="f-nota">Per le foto, le code e il passo più lento: si aggiunge dopo ogni tratto, i minuti di strada restano quelli veri. Vale per tutti i giorni.</p>
        <div class="f-scelte__b" role="group" aria-labelledby="f-margine-t">${MARGINI.map(m => `<button type="button" aria-pressed="${(X().margine ?? 0) === m}" data-f="margine" data-v="${m}">${m ? `${m} min` : 'Nessuno'}</button>`).join('')}</div></section>
      <p class="f-nota">L'ora di pranzo (dalle 12:30 alle 14:30) è una regola nostra: la pausa pranzo c'è già, un'ora, dopo la tappa dove si mangia o quella che finisce più vicino alle 13.</p>`;
  };
  foglio('Pause e margini', `<div id="f-vivo">${corpo()}</div>`, f => {
    f.onclick = e => {
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      const k = b.dataset.f, v = b.dataset.v;
      if (k === 'pausa') { apriPausa(v); return; }
      if (k === 'nuova-pausa') aggiorna(y => { const D = y.giorni[g]; D.pause = [...(D.pause ?? pauseDelGiorno(C, D, grezzo(g))), { quale: v, min: TIPI_PAUSA[v].min }]; });
      if (k === 'margine') aggiorna(y => { if (+v) y.margine = +v; else delete y.margine; });
      rinfresca(f, corpo(), k === 'nuova-pausa' ? { dataset: { f: 'pausa', v } } : b);
    };
  }, 'f--tempo');
}

// ---------- data e orari ----------
const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const minutiDa = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s); return m ? +m[1] * 60 + +m[2] : NaN; };
export function apriQuando() {
  const g = S.g;
  const vivo = () => {
    const x = X(), D = x.giorni[g];
    return `${x.data ? `<ul class="f-date">${range(nG()).map(k => { const ch = (x.giorni[k].tappe ?? []).filter(id => chiusaIl(id, k)); return `<li><b>Giorno ${k + 1}</b><span>${dataLungaDi(k)}${x.giorni[k].gita ? `, gita: ${esc(T(x.giorni[k].gita).breve)}` : ''}</span>${ch.length ? `<span class="f-et f-et--attenzione">Chiuso: ${ch.map(id => esc(T(id).breve)).join(', ')}</span>` : '<span class="f-et">Tutto aperto</span>'}</li>`; }).join('')}</ul>` : ''}
      <div class="f-campi-due"><label class="f-campo" for="f-inizio"><span>Inizio del giorno ${g + 1}</span><input id="f-inizio" type="time" step="900" min="05:00" max="20:00" value="${hhmm(D.inizio)}"></label>
      <label class="f-campo" for="f-fine"><span>Fine del giorno ${g + 1}</span><input id="f-fine" type="time" step="900" min="06:00" max="23:45" value="${hhmm(D.fine)}"></label></div>
      <label class="f-si" for="f-piedi"><input id="f-piedi" type="checkbox"${x.piedi ? ' checked' : ''}><span>Solo a piedi, senza metro, funicolari e autobus<small>Vale per tutti i giorni di questo itinerario.</small></span></label>
      <div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Fatto</button>${x.data ? '<button type="button" class="f-bottone f-bottone--contorno" data-f="senza">Togli la data</button>' : ''}</div>
      ${nG() > 1 ? `<button type="button" class="f-bottone f-bottone--pericolo f-togli-giorno" data-f="togli-giorno">${ic('cestino', 18)}Elimina il giorno ${g + 1}</button>` : ''}`;
  };
  foglio('Data e orari', `<p>Con la data vedi quali tappe sono chiuse proprio quel giorno e i mezzi del sabato e della domenica. Senza data i giorni di chiusura restano nella scheda di ogni tappa.</p>
    <label class="f-campo" for="f-data"><span>${g ? `Data del giorno ${g + 1}` : 'Primo giorno'}</span><input id="f-data" type="date" min="2026-01-01" max="2030-12-31" value="${X().data ? piuGiorni(X().data, g) : ''}"></label>
    <div id="f-vivo">${vivo()}</div>`, f => {
    f.onchange = e => {
      const t = e.target;
      if (t.id === 'f-data') {
        const v = t.value;
        if (v && !dataValida(v)) return;
        aggiorna(y => { if (v) y.data = piuGiorni(v, -g); else delete y.data; });
        rinfresca(f, vivo()); t.focus({ preventScroll: true });
        annuncia(v ? `Data: ${dataLunga(v)}` : 'Data tolta');
      }
      if (t.id === 'f-inizio' || t.id === 'f-fine') {
        const D = X().giorni[g], v = minutiDa(t.value);
        if (t.id === 'f-inizio' && (!Number.isFinite(v) || v < 300 || v > D.fine - 60)) { t.value = hhmm(D.inizio); avvisa('L\'inizio deve essere almeno un\'ora prima della fine.'); return; }
        if (t.id === 'f-fine' && (!Number.isFinite(v) || v < D.inizio + 60)) { t.value = hhmm(D.fine); avvisa('La fine deve essere almeno un\'ora dopo l\'inizio.'); return; }
        aggiorna(y => { y.giorni[g][t.id === 'f-inizio' ? 'inizio' : 'fine'] = v; });
      }
      if (t.id === 'f-piedi') { aggiorna(y => { if (t.checked) y.piedi = true; else delete y.piedi; }); annuncia(t.checked ? 'Solo a piedi' : 'A piedi e con i mezzi'); }
    };
    f.onclick = async e => {
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      if (b.dataset.f === 'fatto') chiudiFoglio();
      if (b.dataset.f === 'senza') { aggiorna(y => { delete y.data; }); $('#f-data', f).value = ''; rinfresca(f, vivo()); $('#f-data', f).focus(); }
      if (b.dataset.f === 'togli-giorno') { await chiudiFoglio(); togliGiorno(g); }
    };
  }, 'f--quando');
}

// ---------- i miei itinerari ----------
const contaTappe = x => x.giorni.reduce((s, D) => s + (D.gita ? 1 : D.tappe.filter(t => !E || t !== E.id).length), 0);
const contaVisitate = x => x.giorni.reduce((s, D) => s + (D.fatte?.length ?? 0), 0);
const descrivi = x => { const n = contaTappe(x), g = x.giorni.length; return `${g} ${g === 1 ? 'giorno' : 'giorni'}, ${n} ${n === 1 ? 'tappa' : 'tappe'}${x.data ? `, dal ${dataBreve(x.data)}` : ''}${salvato(x) && n ? `, ${contaVisitate(x)} visitate su ${n}` : ''}`; };
export function apriMiei() {
  let menu = null, rinomina = null, elimina = null;
  const riga = x => {
    const qui = x.id === A.attivo;
    const testa = rinomina === x.id
      ? `<label class="f-campo f-campo--nome" for="f-nome"><span>Nome dell'itinerario</span><input id="f-nome" value="${esc(x.nome)}" maxlength="${MAX_NOME}" autocomplete="off" enterkeyhint="done"></label>`
      : `<button type="button" class="f-mio__apri" data-f="apri" data-v="${x.id}"${qui ? ' aria-current="true"' : ''}><b>${esc(x.nome)}</b><small>${descrivi(x)}</small><span class="f-segno">${qui ? 'Aperto ora · ' : ''}${salvato(x) ? `${ic('spunta', 16)}Salvato` : 'Non ancora salvato'}</span></button>`;
    const azioni = elimina === x.id
      ? `<div class="f-conferma f-conferma--due"><p>«${esc(x.nome)}» sparisce da questo telefono${salvato(x) ? ', con le tappe visitate' : ''}. I link che hai già mandato continuano ad aprirsi: portano tutto con sé.</p><button type="button" class="f-bottone f-bottone--pericolo" data-f="elimina-si" data-v="${x.id}">${ic('cestino', 18)}Elimina</button><button type="button" class="f-bottone f-bottone--contorno" data-f="elimina-no">Annulla</button></div>`
      : rinomina === x.id
        ? '<div class="f-conferma f-conferma--due"><button type="button" class="f-bottone" data-f="nome-ok">Salva il nome</button><button type="button" class="f-bottone f-bottone--contorno" data-f="nome-no">Annulla</button></div>'
        : `<div class="f-mio-azioni" id="f-az-${x.id}"${menu === x.id ? '' : ' hidden'}><button type="button" class="f-azione" data-f="rinomina" data-v="${x.id}">${ic('matita')}<span>Rinomina</span></button><button type="button" class="f-azione" data-f="condividi" data-v="${x.id}">${ic('condividi')}<span>Condividi</span></button><button type="button" class="f-azione f-azione--pericolo" data-f="elimina" data-v="${x.id}">${ic('cestino')}<span>Elimina</span></button></div>`;
    return `<li class="f-lista"><div class="f-riga f-riga--mio"><div class="f-mio">${testa}</div>${rinomina === x.id || elimina === x.id ? '' : `<button type="button" class="f-icona onda" data-f="menu" data-v="${x.id}" aria-expanded="${menu === x.id}" aria-controls="f-az-${x.id}" aria-label="Altre azioni per «${esc(x.nome)}»">${ic('altro', 20)}</button>`}</div>${azioni}</li>`;
  };
  const vivo = () => {
    const ordine = [...A.elenco].sort((a, b) => (b.id === A.attivo) - (a.id === A.attivo) || b.modificato - a.modificato);
    return `<button type="button" class="f-bottone f-bottone--contorno f-nuovo" data-f="nuovo">${ic('piu', 20)}Nuovo itinerario</button>
      <ul class="f-miei">${ordine.map(riga).join('')}</ul>
      ${salvato() ? '' : '<button type="button" class="f-bottone" data-f="salva">Salva quello aperto</button>'}
      <p class="f-nota">Gli itinerari restano su questo telefono, anche se chiudi la pagina: niente account, niente iscrizione. Per averli su un altro telefono, mandali con «Condividi». Le tappe visitate non vanno nel link.</p>`;
  };
  const nuovoNome = f => {
    const x = A.elenco.find(i => i.id === rinomina), v = $('#f-nome', f)?.value.trim().slice(0, MAX_NOME);
    rinomina = null;
    if (x && v && v !== x.nome) { x.nome = v; x.modificato = Date.now(); scriviArchivio(avvisa); mettiNome(); avvisa(`Nome cambiato: «${v}».`); }
    rinfresca(f, vivo());
  };
  foglio('I miei itinerari', `<div id="f-vivo">${vivo()}</div>`, f => {
    f.onkeydown = e => { if (e.target.id === 'f-nome' && e.key === 'Enter') { e.preventDefault(); nuovoNome(f); } if (e.target.id === 'f-nome' && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); rinomina = null; rinfresca(f, vivo()); } };
    f.onclick = async e => {
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      const k = b.dataset.f, id = b.dataset.v;
      if (k === 'menu') { menu = menu === id ? null : id; rinfresca(f, vivo(), b); if (menu) $(`#f-az-${id} button`, f)?.focus(); return; }
      if (k === 'rinomina') { rinomina = id; menu = null; rinfresca(f, vivo()); const i = $('#f-nome', f); i?.focus(); i?.select(); return; }
      if (k === 'nome-ok') { nuovoNome(f); return; }
      if (k === 'nome-no') { rinomina = null; rinfresca(f, vivo()); return; }
      if (k === 'elimina') { elimina = id; menu = null; rinfresca(f, vivo()); $('[data-f="elimina-no"]', f)?.focus(); return; }
      if (k === 'elimina-no') { elimina = null; rinfresca(f, vivo()); return; }
      if (k === 'elimina-si') {
        const prima = structuredClone(A), x = A.elenco.find(i => i.id === id);
        A.elenco = A.elenco.filter(i => i.id !== id);
        if (!A.elenco.length) { const y = nuovo('Il mio itinerario'); A.elenco = [y]; }
        if (!A.elenco.some(i => i.id === A.attivo)) { A.attivo = [...A.elenco].sort((a, b2) => b2.modificato - a.modificato)[0].id; S.g = 0; }
        elimina = null;
        scriviArchivio(avvisa); dopoCambioItinerario();
        rinfresca(f, vivo());
        avvisa(`Hai eliminato «${x.nome}».`, { testo: 'Annulla', fai: () => { A.elenco = prima.elenco; A.attivo = prima.attivo; scriviArchivio(); dopoCambioItinerario(); } });
        return;
      }
      if (k === 'salva') { await chiudiFoglio(); salva($('.cmp .salva')); return; }
      if (k === 'condividi') { await chiudiFoglio(); apriCondividi(A.elenco.find(i => i.id === id)); return; }
      if (k === 'nuovo') {
        const y = nuovo(nomeLibero('Nuovo itinerario'));
        A.elenco.push(y); ricordaBozza(y); apri(y.id); S.g = 0;
        scriviArchivio(avvisa); await chiudiFoglio(); dopoCambioItinerario();
        annuncia(`Nuovo itinerario: ${y.nome}`);
        return;
      }
      if (k === 'apri' && id !== A.attivo) { apri(id); S.g = 0; scriviArchivio(avvisa); await chiudiFoglio(); dopoCambioItinerario(); annuncia(`Aperto: ${X().nome}`); return; }
      if (k === 'apri') chiudiFoglio();
    };
  });
}
export function dopoCambioItinerario() { chiudiSchede(); S.attiva = null; S.nuova = null; S.fini = {}; S.cifre = {}; S.anima = true; aggiornaTutto(() => {}, { giorno: true }); }

// ---------- condividere ----------
const linkDi = x => `${location.origin}${location.pathname}#${codifica(x)}`;
export async function apriCondividi(x = X()) {
  const l = linkDi(x);
  if (navigator.share && matchMedia('(pointer: coarse)').matches) {
    try { await navigator.share({ title: x.nome, text: `${x.nome}: il mio itinerario a Napoli`, url: l }); return; }
    catch (err) { if (err?.name === 'AbortError') return; }
  }
  foglio('Condividi', `<p>Chi apre il link vede lo stesso itinerario: gli stessi giorni, le stesse tappe, le pause e gli orari. Le tappe che hai visitato restano solo su questo telefono.</p>
    <div class="f-link"><label class="vh" for="f-link">Link dell'itinerario</label><input id="f-link" readonly value="${esc(l)}"><button type="button" class="f-bottone" data-f="copia">${ic('copia', 20)}Copia</button></div>
    <a class="f-bottone f-bottone--contorno" href="https://wa.me/?text=${encodeURIComponent(`${x.nome}: ${l}`)}" rel="noopener" target="_blank">Manda su WhatsApp</a>
    <p class="f-nota">Il link porta tutto dopo il «#»: non passa da nessun server.</p>`, f => {
    f.onclick = async e => {
      if (e.target === f) { chiudiFoglio(); return; }
      if (!e.target.closest('[data-f="copia"]')) return;
      try { await navigator.clipboard.writeText(l); avvisa('Link copiato.'); } catch { const i = $('#f-link', f); i.focus(); i.select(); avvisa('Tieni premuto sul link e scegli «Copia».'); }
    };
  });
}

// ---------- «Altro» e «I giorni» ----------
export function apriAltro() {
  const Gx = G(S.g), x = X();
  const testoQuando = `${x.data ? `Da ${dataLunga(x.data)}` : 'Senza data'}, dalle ${ora(x.giorni[S.g].inizio)} alle ${ora(x.giorni[S.g].fine)}${x.piedi ? ', solo a piedi' : ''}`;
  foglio('Itinerario', `<div class="f-azioni">
    <button type="button" class="f-azione" data-f="miei">${ic('miei')}<span>I miei itinerari<small>${A.elenco.length === 1 ? 'Quello aperto' : `${A.elenco.length} su questo telefono`}</small></span></button>
    <button type="button" class="f-azione" data-f="condividi">${ic('condividi')}<span>Condividi<small>Un link con tutto l'itinerario</small></span></button>
    <button type="button" class="f-azione" data-f="tempo">${ic('cursori')}<span>Pause e margini<small>${Gx ? `${Gx.pause.length ? Gx.pause.map(p => `${NOMI_PAUSA[p.quale].toLowerCase()} ${durata(p.min)}`).join(', ') : 'nessuna pausa'}; margine ${x.margine ? `${x.margine} min` : 'nessuno'}` : 'Il giorno è vuoto'}</small></span></button>
    <button type="button" class="f-azione" data-f="quando">${ic('calendario')}<span>Data e orari<small>${esc(testoQuando)}</small></span></button>
    <button type="button" class="f-azione" data-f="giorni">${ic('giorni')}<span>Tutti i giorni<small>${nG()} ${nG() === 1 ? 'giorno' : 'giorni'}</small></span></button>
    ${nG() < MAX_GIORNI ? `<button type="button" class="f-azione" data-f="giorno">${ic('piu')}<span>Aggiungi un giorno</span></button>` : ''}
  </div>`, f => {
    f.onclick = async e => {
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      if (b.dataset.f === 'tempo') { apriTempo(); return; }
      if (b.dataset.f === 'quando') { apriQuando(); return; }
      await chiudiFoglio();
      ({ miei: apriMiei, condividi: () => apriCondividi(), giorni: apriGiorni, giorno: nuovoGiorno })[b.dataset.f]();
    };
  });
}
export function apriGiorni() {
  foglio('I giorni', `<div class="f-azioni">${range(nG()).map(g => { const Gx = G(g), D = X().giorni[g]; return `<button type="button" class="f-azione" data-f="g" data-g="${g}"><span class="f-num">${g + 1}</span><span>${D.gita ? `Gita: ${esc(T(D.gita).breve)}` : Gx ? esc(titoloGiorno(Gx)) : 'Giorno vuoto'}${g === S.g ? ' (lo stai guardando)' : ''}<small>${D.gita ? 'Un giorno intero' : Gx ? `Dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}, ${tappeDi(Gx).length} tappe, ${Gx.spostamenti} minuti di strada` : 'Ancora nessuna tappa'}</small></span></button>`; }).join('')}
    ${nG() < MAX_GIORNI ? `<button type="button" class="f-azione" data-f="nuovo">${ic('piu')}<span>Aggiungi un giorno</span></button>` : ''}</div>`, f => {
    f.onclick = async e => {
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      await chiudiFoglio();
      if (b.dataset.f === 'nuovo') nuovoGiorno(); else vaiAlGiorno(+b.dataset.g);
    };
  });
}

// ---------- itinerari pronti ----------
// Un pronto si apre come bozza: nell'itinerario aperto se è vuoto, altrimenti in uno nuovo (quello di prima resta).
// Se sul telefono c'è già, con le stesse giornate, si riapre quello.
export function usaPronto(p, data) {
  const giorni = structuredClone(p.giorni);
  const prova = { ...nuovoItinerario('', giorni), ...(data ? { data } : {}) };
  const uguale = !p.evento && gia(prova);
  if (uguale) { apri(uguale.id); S.g = 0; scriviArchivio(avvisa); dopoCambioItinerario(); avvisa(`Hai già questo itinerario: «${uguale.nome}».`); return; }
  const x = X();
  if (vuotoTutto(x) && !salvato(x)) {
    x.nome = nomeLibero(p.nome, x.id); x.giorni = giorni;
    if (data) x.data = data; else if (p.evento) delete x.data;
    dopoModifica(); ricordaBozza(x);
  } else {
    const y = nuovo(nomeLibero(p.nome), giorni);
    if (data) y.data = data; else if (p.evento) delete y.data;
    A.elenco.push(y); ricordaBozza(y); apri(y.id);
    if (!vuotoTutto(x)) avvisa(`Aperto «${y.nome}»: quello di prima resta in «I miei itinerari».`);
  }
  S.g = 0;
  scriviArchivio(avvisa);
  dopoCambioItinerario();
  annuncia(`Itinerario ${X().nome}: ${X().giorni.length} ${X().giorni.length === 1 ? 'giorno' : 'giorni'}`);
}
// la giornata di regata vuole un giorno di regata in calendario
export function chiediGiornoRegata() {
  if (!E) return;
  const p = PRONTI.find(x => x.evento);
  if (!p) return;
  const giorni = Object.keys(E.giorni).sort();
  const primo = giorni.find(d => d >= oggi()) ?? giorni[0];
  foglio('Quale giorno di regata?', `<label class="f-campo" for="f-regata"><span>Giorno</span><select id="f-regata">${giorni.map(d => `<option value="${d}"${d === primo ? ' selected' : ''}>${maiuscola(dataLunga(d))}, ${esc(E.giorni[d].titolo)}${E.giorni[d].possibile ? ' (se la sfida non è già finita)' : ''}${E.giorni[d].riserva ? ' (riserva)' : ''}</option>`).join('')}</select></label>
    <p class="f-nota">Dal ${dataBreve(E.primo)} al ${dataBreve(E.ultimo)} le regate non si corrono tutti i giorni: qui ci sono solo quelli in calendario.</p>
    <div class="f-conferma"><button type="button" class="f-bottone" data-f="crea">Crea la giornata di regata</button></div>`, f => {
    f.onclick = async e => {
      if (e.target === f) { chiudiFoglio(); return; }
      if (!e.target.closest('[data-f="crea"]')) return;
      const d = $('#f-regata', f).value;
      await chiudiFoglio();
      usaPronto(p, d);
    };
  });
}
void contaCifre; void visitata; void ripristina;
