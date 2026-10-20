// I fogli del compositore: «Salva» (in C il segnaposto che cade con l'onda, in D il timbro), «I miei itinerari» (apri, Rinomina,
// Condividi, Elimina con «Annulla»), «Condividi», «Pause e margini», una pausa, «Data e orari», «Altro», «I giorni», gli
// itinerari pronti (anche la giornata di regata, che vuole un giorno di regata).
import { $, $$, esc, ic, piano, range, ora, durata, maiuscola, oggi } from './base.js';
import { E, T, X, A, PRONTI, nG, G, daFare, tappeDi, titoloGiorno, salvato, apri, nuovo, nomeLibero, ricordaBozza, gia, dopoModifica, scriviArchivio, piuGiorni, dataLungaDi, chiusaIl, nuovoItinerario, vuotoTutto, erroreSalvataggio, statoSalvataggio, salvataggioInCorso, attendiSalvataggi, notaSalvataggio } from './stato.js';
import { codifica, MAX_NOME, MAX_GIORNI, MAX_TAPPE } from '../../../lib/itinerari/link';
import { prontoNelGiorno } from '../../../lib/itinerari/pronti';
import { dataBreve, dataLunga } from '../../../lib/itinerari/date';
import { TIPI_PAUSA, MARGINI, pauseDelGiorno } from '../../../lib/itinerari/pause';
import { fraseFine } from '../../../lib/itinerari/ore';
import { grezzo } from './stato.js';
import { C } from './stato.js';
import { S, foglio, chiudiFoglio, contestoFoglio, dopoChiusuraFoglio, rinfresca, avvisa, annuncia, tempo } from './comuni.js';
import { aggiorna, aggiornaTutto, conAnnulla, mettiNome, NOMI_PAUSA, IC_PAUSA, nuovoGiorno, vaiAlGiorno, togliGiorno } from './viste.js';
import { chiudiSchede } from './scheda.js';

const MAX_SALVATI = 50;

// ---------- «Salva» ----------
const spilloSalva = `<svg class="salva__ic salva__ic--spillo" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="spillo-clip"><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z"/></clipPath></defs><g clip-path="url(#spillo-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.6 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle class="salva__buco" cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const segnalibro = `<svg class="salva__ic" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="salva-clip"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></clipPath></defs><g clip-path="url(#salva-clip)"><rect class="salva__pieno" x="0" y="0" width="24" height="24" fill="currentColor"/></g><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path class="salva__spunta" d="M9 11.2l2.2 2.2 4-4.4" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const bottoneSalva = (cl = '') => `<button type="button" class="salva salva--${S.p} ${cl}${statoSalvataggio().fatto ? ' salva--fatto' : ''}" data-azione="salva"${salvataggioInCorso() ? ' disabled' : ''}>${S.p === 'c' ? spilloSalva : segnalibro}<span class="salva__t"><span class="salva__a">Salva</span><span class="salva__b">Salvato</span></span>${S.p === 'c' ? '<i class="salva__onda" aria-hidden="true"></i>' : '<i class="salva__inchiostro" aria-hidden="true"></i>'}</button>`;
export const stato = () => { const s = statoSalvataggio(); return `<span class="stato" data-stato="${s.tipo}"><i aria-hidden="true"></i><span class="stato__t">${s.testo}</span></span>`; };
const GENERICI = /^(Il mio itinerario|Nuovo itinerario|Itinerario ricevuto|Itinerario)( \(\d+\))?$/;
// il nome proposto: «Napoli, 12–14 ottobre» con la data, altrimenti «Napoli in 2 giorni»
function nomeProposto(x) {
  if (x.data) {
    const fine = piuGiorni(x.data, x.giorni.length - 1), [a, b] = [dataBreve(x.data), dataBreve(fine)];
    return x.giorni.length === 1 ? `Napoli, ${a}` : a.split(' ')[1] === b.split(' ')[1] ? `Napoli, ${a.split(' ')[0]}–${b}` : `Napoli, ${a} – ${b}`;
  }
  return x.giorni.length === 1 ? 'Napoli in un giorno' : `Napoli in ${x.giorni.length} giorni`;
}
export async function salva(b) {
  const x = X();
  if (salvataggioInCorso()) {
    await attendiSalvataggi();
    if (X() !== x || salvataggioInCorso()) return;
  }
  const eraSalvato = salvato(x);
  if (eraSalvato && !erroreSalvataggio()) { apriMiei(); return; }
  const salvati = A.elenco.filter(i => salvato(i)).length;
  if (!eraSalvato && salvati >= MAX_SALVATI) { avvisa(`Sul telefono ci sono già ${MAX_SALVATI} itinerari salvati: elimina quelli che non ti servono, oppure mandalo con «Condividi».`); return; }
  x.salvato = true;
  if (!eraSalvato && GENERICI.test(x.nome)) x.nome = nomeLibero(nomeProposto(x), x.id);
  dopoModifica();
  scriviArchivio();
  const ok = await attendiSalvataggi();
  const fallito = !ok || !!erroreSalvataggio();
  if (fallito && !eraSalvato) x.salvato = false;
  if (X() !== x) return;
  if (fallito) { avvisa(erroreSalvataggio(), { testo: 'Condividi', fai: apriCondividi }); return; }
  mettiNome();
  $$('.cmp .salva').forEach(s => s.classList.add('salva--fatto'));
  if (b?.classList.contains('salva')) { b.classList.remove('salva--ora'); void b.offsetWidth; b.classList.add('salva--ora'); }
  $$('.cmp [data-stato]').forEach(s => { s.dataset.stato = 'salvato'; s.querySelector('.stato__t').textContent = 'Salvato in «I miei itinerari»'; });
  setTimeout(async () => {
    if (X() !== x) return;
    aggiorna(() => {});
    const confermato = await attendiSalvataggi();
    if (X() !== x) return;
    if (!confermato || erroreSalvataggio()) { avvisa(erroreSalvataggio(), { testo: 'Condividi', fai: apriCondividi }); return; }
    if (salvataggioInCorso()) return;
    const totale = A.elenco.filter(i => salvato(i)).length;
    avvisa(`Salvato: «${X().nome}». Adesso puoi segnare le tappe che hai visitato.${totale >= MAX_SALVATI - 5 ? ` Ne hai ${totale} su ${MAX_SALVATI}.` : ''}`, { testo: 'Vedi', fai: apriMiei });
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
      <section class="f-sezione"><h3 id="f-margine-t">Margine a ogni spostamento</h3><p class="f-nota">Dopo ogni tratto, per foto, code e passo lento; i minuti di strada restano veri. Vale per tutti i giorni.</p>
        <div class="f-scelte__b" role="group" aria-labelledby="f-margine-t">${MARGINI.map(m => `<button type="button" aria-pressed="${(X().margine ?? 0) === m}" data-f="margine" data-v="${m}">${m ? `${m} min` : 'Nessuno'}</button>`).join('')}</div></section>
      <p class="f-nota">Pranzo: un'ora, dopo la tappa dove si mangia o quella che finisce più vicino alle 13 (regola nostra, fra le 12:30 e le 14:30).</p>`;
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
// quando finisce il giorno g con le sue tappe (la giornata che si vede, con pause e margine), quali restano oltre la fine scelta e
// la frase che lo dice; null per un giorno senza tappe o di gita. La usa anche ore.js
export function fineDelGiorno(g) {
  const Gx = G(g), D = X().giorni[g];
  if (!Gx) return null;
  const nome = id => T(id)?.breve ?? T(id)?.nome ?? id, tp = daFare(Gx), fuori = tp.filter(v => v.fine > D.fine).map(v => nome(v.id));
  return { st: Gx.fine, oltre: Gx.fine > D.fine, fuori, frase: fraseFine(Gx.fine, D.fine, fuori, tp.length ? nome(tp[tp.length - 1].id) : undefined) };
}
// il campo della data: il giorno scritto per intero; un tocco apre il nostro calendario (calendario.js)
const campoData = g => {
  const d = X().data ? piuGiorni(X().data, g) : null;
  return `${ic('calendario')}<span id="f-data-v"${d ? '' : ' class="f-data__vuoto"'}>${d ? dataLunga(d, d.slice(0, 4) !== oggi().slice(0, 4)) : 'Scegli il giorno'}</span>${ic('abbassa', 18)}`;
};
export function apriQuando() {
  const g = S.g, itinerario = X(), giorno = itinerario.giorni[g];
  const vivo = () => {
    const x = X(), D = x.giorni[g];
    return `${x.data ? `<ul class="f-date">${range(nG()).map(k => { const ch = (x.giorni[k].tappe ?? []).filter(id => chiusaIl(id, k)); return `<li><b>Giorno ${k + 1}</b><span>${dataLungaDi(k)}${x.giorni[k].gita ? `, gita: ${esc(T(x.giorni[k].gita).breve)}` : ''}</span>${ch.length ? `<span class="f-et f-et--attenzione">Chiuso: ${ch.map(id => esc(T(id).breve)).join(', ')}</span>` : '<span class="f-et">Tutto aperto</span>'}</li>`; }).join('')}</ul>` : ''}
      <div class="f-campi-due">${['inizio', 'fine'].map(k => `<div class="f-campo"><span id="f-${k}-et">${k === 'inizio' ? 'Inizio' : 'Fine'} del giorno ${g + 1}</span><button type="button" id="f-${k}" class="f-data f-data--ora" data-f="ore" data-v="${k}" aria-haspopup="dialog" aria-labelledby="f-${k}-et f-${k}-v">${ic('orologio')}<span id="f-${k}-v">${ora(D[k])}</span>${ic('abbassa', 18)}</button></div>`).join('')}</div>
      ${(fd => (fd ? `<p class="f-ore-esito${fd.oltre ? ' f-ore-esito--oltre' : ''}">${esc(fd.frase)}</p>` : ''))(fineDelGiorno(g))}
      <label class="f-si" for="f-piedi"><input id="f-piedi" type="checkbox"${x.piedi ? ' checked' : ''}><span>Solo a piedi, senza metro, funicolari e autobus<small>Vale per tutti i giorni di questo itinerario.</small></span></label>
      <div class="f-conferma"><button type="button" class="f-bottone" data-f="fatto">Fatto</button>${x.data ? '<button type="button" class="f-bottone f-bottone--contorno" data-f="senza">Togli la data</button>' : ''}</div>
      ${nG() > 1 ? `<button type="button" class="f-bottone f-bottone--pericolo f-togli-giorno" data-f="togli-giorno">${ic('cestino', 18)}Elimina il giorno ${g + 1}</button>` : ''}`;
  };
  foglio('Data e orari', `<p>Con la data vedi quali tappe sono chiuse proprio quel giorno e i mezzi del sabato e della domenica. Senza data i giorni di chiusura restano nella scheda di ogni tappa.</p>
    <div class="f-campo"><span id="f-data-et">${g ? `Data del giorno ${g + 1}` : 'Primo giorno'}</span><button type="button" id="f-data" class="f-data" data-f="calendario" aria-haspopup="dialog" aria-labelledby="f-data-et f-data-v">${campoData(g)}</button></div>
    <div id="f-vivo">${vivo()}</div>`, f => {
    const aperto = contestoFoglio();
    const stessoGiorno = () => X() === itinerario && S.g === g && itinerario.giorni[g] === giorno;
    const valido = () => aperto() && stessoGiorno();
    const esegui = dopoChiusuraFoglio(stessoGiorno);
    let richiesta = 0;
    f.onchange = e => {
      if (!valido()) return;
      richiesta++;
      const t = e.target;
      if (t.id === 'f-piedi') { aggiorna(y => { if (t.checked) y.piedi = true; else delete y.piedi; }); annuncia(t.checked ? 'Solo a piedi' : 'A piedi e con i mezzi'); }
    };
    f.onclick = async e => {
      if (!valido()) return;
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      const turno = ++richiesta;
      if (b.dataset.f === 'fatto') chiudiFoglio();
      if (b.dataset.f === 'calendario') {
        const prima = X().data;
        // il calendario si scarica solo quando serve (la prima schermata resta leggera); il service worker lo tiene anche senza rete
        let modulo;
        try { modulo = await import('./calendario.js'); }
        catch { if (valido() && turno === richiesta) avvisa('Il calendario non si è caricato. Riprova dal campo della data.'); return; }
        if (!valido() || turno !== richiesta) return;
        modulo.apriCalendario(g, () => {
          if (!valido() || turno !== richiesta) return;
          const c = $('#f-data', f);
          if (!c) return;
          c.innerHTML = campoData(g); rinfresca(f, vivo()); c.focus({ preventScroll: true });
          if (X().data && X().data !== prima) annuncia(`Data: ${dataLunga(piuGiorni(X().data, g))}`);
        });
      }
      if (b.dataset.f === 'ore') {
        // la scelta dell'ora «Tutte le ore» si scarica solo quando serve, come il calendario
        const k = b.dataset.v, prima = { ...giorno };
        let modulo;
        try { modulo = await import('./ore.js'); }
        catch { if (valido() && turno === richiesta) avvisa('La scelta dell’ora non si è caricata. Riprova da Inizio o Fine.'); return; }
        if (!valido() || turno !== richiesta) return;
        modulo.apriOre(g, k, modo => {
          if (!valido() || turno !== richiesta) return;
          rinfresca(f, vivo());
          $(`#f-${modo}`, f)?.focus({ preventScroll: true });
          const D = X().giorni[g];
          if (D.inizio !== prima.inizio || D.fine !== prima.fine) annuncia(`Dalle ${ora(D.inizio)} alle ${ora(D.fine)}`);
        });
      }
      if (b.dataset.f === 'senza') { aggiorna(y => { delete y.data; }); $('#f-data', f).innerHTML = campoData(g); rinfresca(f, vivo()); $('#f-data', f).focus(); annuncia('Data tolta'); }
      if (b.dataset.f === 'togli-giorno') return esegui(() => togliGiorno(g));
    };
  }, 'f--quando');
}

// ---------- i miei itinerari ----------
// Tre parti (specifiche/compositore-rifiniture-1.md, punto 9): quello aperto ora (Salva, Rinomina, Condividi, Elimina), un
// itinerario nuovo (vuoto o da un pronto) e gli altri, che si aprono con un tocco. Eliminare: cestino, poi la domanda con il nome.
const contaTappe = x => x.giorni.reduce((s, D) => s + (D.gita ? 1 : D.tappe.filter(t => !E || t !== E.id).length), 0);
const contaVisitate = x => x.giorni.reduce((s, D) => s + (D.fatte?.length ?? 0), 0);
const descrivi = x => { const n = contaTappe(x), g = x.giorni.length; return `${g} ${g === 1 ? 'giorno' : 'giorni'}, ${n} ${n === 1 ? 'tappa' : 'tappe'}${x.data ? `, dal ${dataBreve(x.data)}` : ''}${salvato(x) && n ? `, ${contaVisitate(x)} ${contaVisitate(x) === 1 ? "visitata" : "visitate"} su ${n}` : ''}`; };
const segno = x => {
  const s = statoSalvataggio(x);
  return `<span class="f-segno" data-itinerario-stato="${esc(x.id)}">${s.fatto ? ic('spunta', 16) : ''}${esc(s.fatto ? 'Salvato' : s.testo)}</span>`;
};
// i pronti che si possono aprire adesso (la regata solo fino all'ultimo giorno di regata)
const prontiDaAprire = () => PRONTI.filter(p => !p.evento || (E && !(oggi() > E.ultimo)));
// dopo aver aperto o creato un altro itinerario: l'avviso dice dov'è quello di prima e offre «Torna». prima: l'itinerario
// aperto prima del cambio. Se era una bozza lasciata com'era è sparito (stato.js, lasciaBozza): «Torna» lo rimette
export function avvisaCambio(prima) {
  if (!prima || prima.id === A.attivo) return;
  const resta = A.elenco.some(i => i.id === prima.id), copia = structuredClone(prima);
  avvisa(resta ? `Aperto «${X().nome}». «${prima.nome}» è in «I miei itinerari».` : `Aperto «${X().nome}».`, { testo: 'Torna', fai: () => {
    if (!A.elenco.some(i => i.id === copia.id)) { A.elenco.push(copia); ricordaBozza(copia); }
    apri(copia.id); S.g = 0; scriviArchivio(avvisa); dopoCambioItinerario(); annuncia(`Aperto: ${X().nome}`);
  } });
}
export function apriMiei() {
  // tolto: l'ultimo eliminato, con l'archivio di prima. «Annulla» sta dentro il foglio: l'avviso in basso resterebbe sotto il
  // foglio aperto, senza poterlo toccare
  let rinomina = false, elimina = null, tolto = null;
  const domanda = x => `<div class="f-chiedi" role="group" aria-labelledby="f-chiedi-t"><p id="f-chiedi-t">Eliminare «${esc(x.nome)}»?${salvato(x) && contaVisitate(x) ? ' Anche le tappe visitate.' : ''}</p>
    <div class="f-mio-az"><button type="button" class="f-bottone f-bottone--piccolo f-bottone--pericolo" data-f="elimina-si" data-v="${x.id}">${ic('cestino', 18)}Elimina</button><button type="button" class="f-bottone f-bottone--piccolo f-bottone--contorno" data-f="elimina-no">Annulla</button></div></div>`;
  const aperto = () => {
    const x = X();
    const corpo = rinomina
      ? `<label class="f-campo f-campo--nome" for="f-nome"><span>Nome dell'itinerario</span><input id="f-nome" value="${esc(x.nome)}" maxlength="${MAX_NOME}" autocomplete="off" enterkeyhint="done"></label>
        <div class="f-mio-az"><button type="button" class="f-bottone f-bottone--piccolo" data-f="nome-ok">Salva il nome</button><button type="button" class="f-bottone f-bottone--piccolo f-bottone--contorno" data-f="nome-no">Annulla</button></div>`
      : `<p class="f-aperto__nome"><b>${esc(x.nome)}</b><small>${descrivi(x)}</small>${segno(x)}</p>
        ${elimina === x.id ? domanda(x) : `<div class="f-mio-az">${salvato(x) ? '' : `<button type="button" class="f-bottone f-bottone--piccolo" data-f="salva">${ic('spunta', 18)}Salva</button>`}
          <button type="button" class="f-bottone f-bottone--piccolo f-bottone--contorno" data-f="rinomina">${ic('matita', 18)}Rinomina</button>
          <button type="button" class="f-bottone f-bottone--piccolo f-bottone--contorno" data-f="condividi" data-v="${x.id}">${ic('condividi', 18)}Condividi</button>
          <button type="button" class="f-bottone f-bottone--piccolo f-bottone--contorno f-bottone--rosso" data-f="elimina" data-v="${x.id}">${ic('cestino', 18)}Elimina</button></div>`}`;
    return `<section class="f-aperto" aria-labelledby="f-aperto-t"><h3 id="f-aperto-t" class="f-sotto">Aperto ora</h3>${corpo}</section>`;
  };
  const nuovi = () => `<section class="f-nuovi" aria-labelledby="f-nuovi-t"><h3 id="f-nuovi-t" class="f-sotto">Nuovo itinerario</h3>
    <div class="f-chips"><button type="button" class="f-chip" data-f="nuovo">${ic('piu', 16)}Vuoto</button>${prontiDaAprire().map(p => `<button type="button" class="f-chip f-chip--pronto" data-f="nuovo-pronto" data-v="${p.id}">${esc(p.evento ? 'Giornata di regata' : p.durata ?? p.nome)}</button>`).join('')}</div></section>`;
  const riga = x => `<li class="f-lista">${elimina === x.id ? domanda(x) : `<div class="f-riga f-riga--mio"><div class="f-mio"><button type="button" class="f-mio__apri" data-f="apri" data-v="${x.id}"><b>${esc(x.nome)}</b><small>${descrivi(x)}</small>${segno(x)}</button></div>
    <button type="button" class="f-icona onda" data-f="elimina" data-v="${x.id}" aria-label="Elimina «${esc(x.nome)}»">${ic('cestino', 20)}</button></div>`}</li>`;
  const vivo = () => {
    const altri = A.elenco.filter(i => i.id !== A.attivo).sort((a, b) => b.modificato - a.modificato);
    return `${tolto ? `<p class="f-tolto" role="status">Hai eliminato «${esc(tolto.nome)}».<button type="button" class="f-bottone f-bottone--piccolo f-bottone--contorno" data-f="annulla">Annulla</button></p>` : ''}${aperto()}${nuovi()}
      ${altri.length ? `<section aria-labelledby="f-altri-t"><h3 id="f-altri-t" class="f-sotto">Gli altri sul telefono</h3><ul class="f-miei">${altri.map(riga).join('')}</ul></section>` : ''}
      <p class="f-nota" data-memoria-itinerari>${esc(notaSalvataggio())}</p>`;
  };
  const nuovoNome = f => {
    const x = X(), v = $('#f-nome', f)?.value.trim().slice(0, MAX_NOME);
    rinomina = false;
    if (v && v !== x.nome) { x.nome = v; x.modificato = Date.now(); scriviArchivio(avvisa); mettiNome(); avvisa(`Nome cambiato: «${v}».`); }
    rinfresca(f, vivo());
    $('[data-f="rinomina"]', f)?.focus();
  };
  foglio('I miei itinerari', `<div id="f-vivo">${vivo()}</div>`, f => {
    let atteso = X();
    const aperto = contestoFoglio(), valido = () => X() === atteso;
    const esegui = dopoChiusuraFoglio(valido);
    f.onkeydown = e => { if (!aperto() || !valido()) return; if (e.target.id === 'f-nome' && e.key === 'Enter') { e.preventDefault(); nuovoNome(f); } if (e.target.id === 'f-nome' && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); rinomina = false; rinfresca(f, vivo()); } };
    f.onclick = async e => {
      if (!aperto() || !valido()) return;
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      const k = b.dataset.f, id = b.dataset.v;
      if (k === 'rinomina') { rinomina = true; elimina = null; rinfresca(f, vivo()); const i = $('#f-nome', f); i?.focus(); i?.select(); return; }
      if (k === 'nome-ok') { nuovoNome(f); return; }
      if (k === 'nome-no') { rinomina = false; rinfresca(f, vivo()); $('[data-f="rinomina"]', f)?.focus(); return; }
      if (k === 'annulla' && tolto) {
        A.elenco = tolto.prima.elenco; A.attivo = tolto.prima.attivo; atteso = X(); const nome = tolto.nome; tolto = null;
        scriviArchivio(avvisa); dopoCambioItinerario(); rinfresca(f, vivo()); $('[data-f="nuovo"]', f)?.focus(); annuncia(`«${nome}» è tornato.`);
        return;
      }
      if (k === 'elimina') { elimina = id; rinomina = false; rinfresca(f, vivo()); $('[data-f="elimina-no"]', f)?.focus(); return; }
      if (k === 'elimina-no') { const era = elimina; elimina = null; rinfresca(f, vivo()); $(`[data-f="elimina"][data-v="${era}"]`, f)?.focus(); return; }
      if (k === 'elimina-si') {
        const prima = structuredClone(A), x = A.elenco.find(i => i.id === id);
        if (!x) return;
        A.elenco = A.elenco.filter(i => i.id !== id);
        if (!A.elenco.length) { const y = nuovo('Il mio itinerario'); A.elenco = [y]; }
        if (!A.elenco.some(i => i.id === A.attivo)) { A.attivo = [...A.elenco].sort((a, b2) => b2.modificato - a.modificato)[0].id; S.g = 0; }
        atteso = X();
        elimina = null; tolto = { nome: x.nome, prima };
        scriviArchivio(avvisa); dopoCambioItinerario();
        rinfresca(f, vivo());
        $('[data-f="annulla"]', f)?.focus();
        return;
      }
      if (k === 'salva') return esegui(() => salva($('.cmp .salva')));
      if (k === 'condividi') {
        const itinerario = A.elenco.find(i => i.id === id);
        if (itinerario) return esegui(() => { if (A.elenco.includes(itinerario)) return apriCondividi(itinerario); });
        return;
      }
      if (k === 'nuovo') return esegui(() => {
        const prima = X(), y = nuovo(nomeLibero('Nuovo itinerario'));
        A.elenco.push(y); ricordaBozza(y); apri(y.id); S.g = 0;
        scriviArchivio(avvisa); dopoCambioItinerario();
        annuncia(`Nuovo itinerario: ${y.nome}`); avvisaCambio(prima);
      });
      if (k === 'nuovo-pronto') {
        const p = PRONTI.find(x => x.id === id);
        if (p) return esegui(() => { if (p.evento) chiediGiornoRegata(); else usaPronto(p); });
        return;
      }
      if (k === 'apri' && id !== A.attivo) return esegui(() => {
        if (!A.elenco.some(i => i.id === id)) return;
        const prima = X(); apri(id); S.g = 0; scriviArchivio(avvisa); dopoCambioItinerario(); annuncia(`Aperto: ${X().nome}`); avvisaCambio(prima);
      });
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
    <p class="f-nota">Il percorso nel link non viene inviato al nostro server. Se lo mandi con un’app, anche quell’app può leggerlo.</p>`, f => {
    f.onclick = async e => {
      if (e.target === f) { chiudiFoglio(); return; }
      if (!e.target.closest('[data-f="copia"]')) return;
      try { await navigator.clipboard.writeText(l); avvisa('Link copiato.'); } catch { const i = $('#f-link', f); i.focus(); i.select(); avvisa('Tieni premuto sul link e scegli «Copia».'); }
    };
  });
}

// ---------- «Altro» e «I giorni» ----------
export function apriAltro() {
  const g = S.g, Gx = G(g), x = X(), giorno = x.giorni[g];
  const testoQuando = `${x.data ? `Da ${dataLunga(x.data)}` : 'Senza data'}, dalle ${ora(x.giorni[S.g].inizio)} alle ${ora(x.giorni[S.g].fine)}${x.piedi ? ', solo a piedi' : ''}`;
  foglio('Itinerario', `<div class="f-azioni">
    <button type="button" class="f-azione" data-f="miei">${ic('miei')}<span>I miei itinerari<small>${A.elenco.length === 1 ? 'Quello aperto' : `${A.elenco.length} su questo telefono`}</small></span></button>
    <button type="button" class="f-azione" data-f="condividi">${ic('condividi')}<span>Condividi<small>Un link con tutto l'itinerario</small></span></button>
    <button type="button" class="f-azione" data-f="tempo">${ic('cursori')}<span>Pause e margini<small>${Gx ? `${Gx.pause.length ? Gx.pause.map(p => `${NOMI_PAUSA[p.quale].toLowerCase()} ${durata(p.min)}`).join(', ') : 'nessuna pausa'}; margine ${x.margine ? `${x.margine} min` : 'nessuno'}` : 'Il giorno è vuoto'}</small></span></button>
    <button type="button" class="f-azione" data-f="quando">${ic('calendario')}<span>Data e orari<small>${esc(testoQuando)}</small></span></button>
    ${nG() < MAX_GIORNI ? `<button type="button" class="f-azione" data-f="giorno">${ic('piu')}<span>Aggiungi un giorno</span></button>` : ''}
  </div>`, f => {
    const aperto = contestoFoglio(), valido = () => X() === x && S.g === g && x.giorni[g] === giorno;
    const esegui = dopoChiusuraFoglio(valido);
    f.onclick = async e => {
      if (!aperto() || !valido()) return;
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      if (b.dataset.f === 'tempo') { apriTempo(); return; }
      if (b.dataset.f === 'quando') { apriQuando(); return; }
      const azione = ({ miei: apriMiei, condividi: () => apriCondividi(x), giorno: nuovoGiorno })[b.dataset.f];
      if (azione) return esegui(azione);
    };
  });
}
export function apriGiorni() {
  const x = X(), g = S.g, giorno = x.giorni[g];
  foglio('I giorni', `<div class="f-azioni">${range(nG()).map(g => { const Gx = G(g), D = X().giorni[g]; return `<button type="button" class="f-azione" data-f="g" data-g="${g}"><span class="f-num">${g + 1}</span><span>${D.gita ? `Gita: ${esc(T(D.gita).breve)}` : Gx ? esc(titoloGiorno(Gx)) : 'Giorno vuoto'}${g === S.g ? ' (lo stai guardando)' : ''}<small>${D.gita ? 'Un giorno intero' : Gx ? `Dalle ${ora(Gx.inizio)} alle ${ora(Gx.fine)}, ${tappeDi(Gx).length} tappe, ${Gx.spostamenti} minuti di strada` : 'Ancora nessuna tappa'}</small></span></button>`; }).join('')}
    ${nG() < MAX_GIORNI ? `<button type="button" class="f-azione" data-f="nuovo">${ic('piu')}<span>Aggiungi un giorno</span></button>` : ''}</div>`, f => {
    const aperto = contestoFoglio(), valido = () => X() === x && S.g === g && x.giorni[g] === giorno;
    const esegui = dopoChiusuraFoglio(valido);
    f.onclick = async e => {
      if (!aperto() || !valido()) return;
      if (e.target === f) { chiudiFoglio(); return; }
      const b = e.target.closest('[data-f]');
      if (!b) return;
      const destinazione = +b.dataset.g, scelto = x.giorni[destinazione];
      return esegui(() => { if (b.dataset.f === 'nuovo') nuovoGiorno(); else if (scelto && x.giorni[destinazione] === scelto) vaiAlGiorno(destinazione); });
    };
  });
}

// ---------- itinerari pronti ----------
// Un pronto scelto dentro un giorno (dal giorno vuoto): le tappe vanno in quel giorno, nello stesso itinerario, e si resta lì
// (src/lib/itinerari/pronti.ts). Se non c'è posto non cambia niente; dopo, «Annulla».
export function mettiPronto(p) {
  const g = S.g, x = X();
  const r = prontoNelGiorno(x, g, p.giorni);
  if (r === 'niente') { avvisa(`Le tappe di «${p.nome}» sono già nel tuo itinerario.`); return; }
  if (r === 'limite-giorni') { avvisa(`Non c'è posto: un itinerario ha al massimo ${MAX_GIORNI} giorni.`); return; }
  if (r === 'limite-tappe') { avvisa(`Non c'è posto: un giorno ha al massimo ${MAX_TAPPE} tappe.`); return; }
  const rinomina = vuotoTutto(x) && !salvato(x) && GENERICI.test(x.nome);
  const usati = new Set(r.giorni.flatMap((D, k) => (D.tappe.some(id => r.aggiunte.includes(id)) ? [k] : []))).size;
  const n = r.aggiunte.length;
  const gia = r.gia.length === 1 ? ` ${T(r.gia[0].id).breve} è già nel giorno ${r.gia[0].giorno + 1}: resta lì.`
    : r.gia.length ? ` ${r.gia.length} tappe erano già nel viaggio: restano dove sono.` : '';
  conAnnulla(`«${p.nome}» ${usati > 1 ? 'dal' : 'nel'} giorno ${r.giorno + 1}: ${n} ${n === 1 ? 'tappa' : 'tappe'}${usati > 1 ? ` in ${usati} giorni` : ''}.${gia}`, y => {
    y.giorni = r.giorni;
    if (rinomina) y.nome = nomeLibero(p.nome, y.id);
    S.g = r.giorno;
  }, { giorno: true });
  if (rinomina) mettiNome();
}
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
  }
  S.g = 0;
  scriviArchivio(avvisa);
  dopoCambioItinerario();
  avvisaCambio(x);
  annuncia(`Itinerario ${X().nome}: ${X().giorni.length} ${X().giorni.length === 1 ? 'giorno' : 'giorni'}`);
}
// la giornata di regata vuole un giorno di regata in calendario
export function chiediGiornoRegata() {
  if (!E) return;
  const p = PRONTI.find(x => x.evento);
  if (!p) return;
  const x = X(), g = S.g, giorno = x.giorni[g];
  const giorni = Object.keys(E.giorni).sort();
  const primo = giorni.find(d => d >= oggi()) ?? giorni[0];
  foglio('Quale giorno di regata?', `<label class="f-campo" for="f-regata"><span>Giorno</span><select id="f-regata">${giorni.map(d => `<option value="${d}"${d === primo ? ' selected' : ''}>${maiuscola(dataLunga(d))}, ${esc(E.giorni[d].titolo)}${E.giorni[d].possibile ? ' (se la sfida non è già finita)' : ''}${E.giorni[d].riserva ? ' (riserva)' : ''}</option>`).join('')}</select></label>
    <p class="f-nota">Dal ${dataBreve(E.primo)} al ${dataBreve(E.ultimo)} le regate non si corrono tutti i giorni: qui ci sono solo quelli in calendario.</p>
    <div class="f-conferma"><button type="button" class="f-bottone" data-f="crea">Crea la giornata di regata</button></div>`, f => {
    const aperto = contestoFoglio(), valido = () => X() === x && S.g === g && x.giorni[g] === giorno;
    const esegui = dopoChiusuraFoglio(valido);
    f.onclick = async e => {
      if (!aperto() || !valido()) return;
      if (e.target === f) { chiudiFoglio(); return; }
      if (!e.target.closest('[data-f="crea"]')) return;
      const d = $('#f-regata', f).value;
      if (E.giorni[d]) return esegui(() => usaPronto(p, d));
    };
  });
}
