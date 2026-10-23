// Il compositore nuovo (pagina /napoli/itinerari/): l'avvio. Legge gli itinerari dal telefono, apre quello giusto (un link
// ricevuto, un itinerario pronto dalla home o dal menu, un locale da «Dove mangiare»), disegna la vista scelta (C o D), poi
// carica i dati che arrivano dopo e, il giorno stesso, ricalcola dal vivo ogni mezzo minuto.
import { $, ascoltaFirme, maiuscola } from './base.js';
import { avviaConStile, mostraErroreStile } from '../stile.mjs';
import { C, A, X, PRONTI, T, caricaSchede, quandoLibero, nuovo, apri, nomeLibero, ricordaBozza, gia, scriviArchivio, sostituisciArchivio, caricaDopo, VIVO, oggiNelGiorno, posizioneAttiva, adessoPer, statoPosizione, nG, erroreSalvataggio, salvataggioInCorso, quandoSalva } from './stato.js';
import { decodifica } from '../../../lib/itinerari/link';
import { leggiConRiferimento, quandoCambia, giornoSicuro, allineaArchivio, proteggiUscita } from '../memoria';
import { S, vistaSalvata, preparaFoglio, preparaAvviso, avvisa, annuncia, rinfrescaSalvataggio } from './comuni.js';
import { disegna, preparaViste, preparaMenu, aggiorna, aggiungi } from './viste.js';
import { preparaScheda, schedaAperta } from './scheda.js';
import { usaPronto } from './fogli.js';

function avvia() {
  // ---------- l'itinerario da aprire ----------
  if (!A.elenco.length) { const x = nuovo('Il mio itinerario'); A.elenco.push(x); A.attivo = x.id; ricordaBozza(x); }
  const W = window;
  // un itinerario ricevuto con un link: si apre come bozza (se c'è già sul telefono, si riapre quello)
  if (W.itinerarioRicevuto) {
    const d = decodifica(C, W.itinerarioRicevuto);
    if (d) {
      const uguale = gia(d.it);
      if (uguale) { apri(uguale.id); avvisaDopo(`Hai già questo itinerario: «${uguale.nome}».`); }
      else {
        d.it.nome = nomeLibero(d.it.nome); d.it.salvato = false;
        const solo = A.elenco.length === 1 && A.elenco[0].salvato === false && A.elenco[0].giorni.every(g => !g.gita && !g.tappe.length);
        if (solo) A.elenco = [d.it]; else A.elenco.push(d.it);
        ricordaBozza(d.it); apri(d.it.id);
        avvisaDopo(`Itinerario ricevuto: «${d.it.nome}». Tocca «Salva» per tenerlo tra i tuoi${d.scartate.length ? `. ${d.scartate.length === 1 ? 'Una tappa non esiste più ed è stata tolta' : `${d.scartate.length} tappe non esistono più e sono state tolte`}` : ''}.`);
      }
    }
  }
  S.p = vistaSalvata() ?? 'c';
  S.g = 0;
  // un itinerario pronto scelto dalla home o dal menu (?pronto=…)
  const chiesto = PRONTI.find(p => !p.evento && p.id === W.prontoRichiesto);
  const aggiornaUscita = proteggiUscita(() => salvataggioInCorso() || !!erroreSalvataggio());
  quandoSalva(() => { rinfrescaSalvataggio(); aggiornaUscita(); });
  scriviArchivio(avvisa);
  preparaFoglio(); preparaAvviso(); preparaViste(); preparaMenu(); preparaScheda();
  ascoltaFirme(/** @type {HTMLElement} */ ($('#app')));
  if (chiesto) usaPronto(chiesto); else disegna();
  // La parte bassa resta fuori dal primo ricalcolo del layout del compositore.
  document.documentElement.classList.add('cmp-pronto');
  // scorrendo sotto il compositore (itinerari pronti, gite, fonti) la mappa fissa e le barre si nascondono
  new IntersectionObserver(([e]) => document.documentElement.classList.toggle('cmp-fuori', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(/** @type {HTMLElement} */ ($('#compositore')));
  // appena la parte bassa entra nello schermo, le barre fisse del compositore (in basso o di lato) si tolgono: non la coprono
  const sotto = document.querySelector('.it-pagina > :not(.cmp)');
  if (sotto) new IntersectionObserver(([e]) => document.documentElement.classList.toggle('cmp-sotto', e.isIntersecting || e.boundingClientRect.top < 0)).observe(sotto);

  // un locale (o una tappa) da aggiungere, dalla pagina «Dove mangiare» (?aggiungi=<id>&g=<giorno>)
  const richiesta = new URLSearchParams(W.daAggiungere ?? '');
  const da = richiesta.get('aggiungi');
  if (da && T(da)?.tipo === 'citta') {
    S.g = giornoSicuro(richiesta.get('g'), nG());
    if (X().giorni[S.g].tappe.includes(da)) avvisaDopo(`${maiuscola(/** @type {import('./tipi').TappaPagina} */ (T(da)).breve)} è già nel giorno ${S.g + 1}.`);
    else { disegna(); aggiungi(S.g, da); }
  }

  // ---------- un altro tab ha cambiato gli itinerari ----------
  quandoCambia(() => {
    const fonte = leggiConRiferimento(C), n = fonte.archivio;
    if (n && !schedaAperta() && !/** @type {HTMLDialogElement} */ ($('#foglio')).open && !erroreSalvataggio() && !salvataggioInCorso()) {
      const cambio = allineaArchivio(A, n, S.g);
      sostituisciArchivio(cambio.archivio, fonte); S.g = cambio.giorno; disegna();
    }
  });

  // ---------- dopo l'apertura: scenari e orari veri dei bus (restano salvati per l'uso senza rete) ----------
  const ridisegna = () => { if (lista()) return; if (occupato()) setTimeout(ridisegna, 5000); else aggiorna(() => {}); };
  const lista = () => !X().giorni[S.g].tappe.length && !/** @type {HTMLDialogElement} */ ($('#foglio')).open;
  Promise.all([document.fonts?.ready ?? Promise.resolve(), new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))]).then(() => caricaDopo(ridisegna));
  // le schede complete e i dati della ricerca, a pagina caricata
  quandoLibero().then(() => caricaSchede()).catch(() => { /* si riprova quando servono */ });

  // ---------- dal vivo: ora del telefono e, se l'hai permesso, la posizione ----------
  navigator.permissions?.query({ name: 'geolocation' }).then(p => {
    VIVO.permesso = p.state;
    p.onchange = () => { VIVO.permesso = p.state; if (oggiNelGiorno(X(), S.g)) aggiorna(() => {}); };
    if (p.state === 'granted' && X().posizione === 'si' && oggiNelGiorno(X(), S.g)) aggiorna(() => {});
  }).catch(() => { /* il browser non lo dice: si chiede con il pannello */ });
  /** @type {number|null} */
  let guardia = null;
  let cicloPosizione = 0;
  const ferma = () => { cicloPosizione++; if (guardia != null) navigator.geolocation.clearWatch(guardia); guardia = null; VIVO.posizione = null; };
  const cura = () => {
    const x = X();
    if (posizioneAttiva(x) && oggiNelGiorno(x, S.g) && document.visibilityState === 'visible') {
      if (guardia != null || VIVO.negata || !('geolocation' in navigator)) return;
      const ciclo = ++cicloPosizione;
      const valido = () => ciclo === cicloPosizione && posizioneAttiva(X()) && oggiNelGiorno(X(), S.g) && document.visibilityState === 'visible';
      guardia = navigator.geolocation.watchPosition(p => { if (!valido()) return; VIVO.posizione = { ll: [p.coords.latitude, p.coords.longitude], precisione: p.coords.accuracy }; dalVivo(); }, e => {
        if (!valido()) return;
        if (e.code === e.PERMISSION_DENIED) { VIVO.negata = true; ferma(); avvisa('Il telefono non ha dato la posizione: calcolo dall\'ultima tappa visitata.'); aggiorna(() => {}); }
      }, { enableHighAccuracy: true, maximumAge: 60000, timeout: 30000 });
    } else ferma();
  };
  const occupato = () => !!document.querySelector('.in-trascina') || /** @type {HTMLDialogElement} */ ($('#foglio')).open || !!document.activeElement?.closest('.posizione, .avviso-giorno');
  let firma = '';
  const firmaDi = () => JSON.stringify([adessoPer(X(), S.g), statoPosizione(), X().posizione]);
  function dalVivo() {
    cura();
    if (!oggiNelGiorno(X(), S.g) || occupato()) return;
    const f = firmaDi();
    if (f === firma) return;
    firma = f;
    aggiorna(() => {});
  }
  firma = firmaDi();
  setInterval(dalVivo, 30000);
  document.addEventListener('visibilitychange', () => { cura(); if (document.visibilityState === 'visible') dalVivo(); });
  addEventListener('click', e => { if (/** @type {Element} */ (e.target).closest?.('[data-azione="gps-si"]')) setTimeout(cura, 0); });
  cura();
  annuncia('');
}
// un avviso subito dopo il primo disegno
/** @type {string[]} */
let primi = [];
/** @param {string} t */
function avvisaDopo(t) { primi.push(t); }
function parti() {
  // i segni di tempo dell'avvio (per misurare il primo disegno, anche da telefono)
  performance.mark('compositore-inizio');
  avvia();
  performance.mark('compositore-fine');
  if (primi.length) setTimeout(() => avvisa(primi.join(' ')), 600);
}
function preparaAvvio() {
  if (!document.getElementById('app')) return;
  // la prima schermata dell'HTML si disegna prima che il compositore la sostituisca (chi ha già itinerari parte subito)
  // si parte appena il browser ha mostrato il primo disegno (al massimo dopo 3 secondi; subito se la scheda non si vede)
  if (document.documentElement.classList.contains('cmp-ha') || document.visibilityState === 'hidden') parti();
  else {
    let partito = false;
    const via = () => { if (partito) return; partito = true; parti(); };
    try {
      new PerformanceObserver((l, o) => { if (l.getEntries().some(e => e.name === 'first-contentful-paint')) { o.disconnect(); requestAnimationFrame(() => setTimeout(via, 0)); } }).observe({ type: 'paint', buffered: true });
    } catch { requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(via, 0))); }
    setTimeout(via, 3000);
  }
}
avviaConStile(/** @type {HTMLLinkElement} */ (document.getElementById('stile-compositore')), preparaAvvio, riprova => mostraErroreStile(document.getElementById('app'), document.documentElement, riprova)).catch(error => console.error(error));
