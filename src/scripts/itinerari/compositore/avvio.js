// Il compositore nuovo (pagina /napoli/itinerari/): l'avvio. Legge gli itinerari dal telefono, apre quello giusto (un link
// ricevuto, un itinerario pronto dalla home o dal menu, un locale da «Dove mangiare»), disegna la vista scelta (C o D), poi
// carica i dati che arrivano dopo e, il giorno stesso, ricalcola dal vivo ogni mezzo minuto.
import { $, ascoltaFirme, maiuscola } from './base.js';
import { C, A, X, PRONTI, T, nuovo, apri, nomeLibero, ricordaBozza, gia, scriviArchivio, sostituisciArchivio, caricaDopo, VIVO, oggiNelGiorno, posizioneAttiva, adessoPer, statoPosizione, nG } from './stato.js';
import { decodifica } from '../../../lib/itinerari/link';
import { leggi, quandoCambia } from '../memoria';
import { S, vistaSalvata, preparaFoglio, preparaAvviso, avvisa, annuncia } from './comuni.js';
import { disegna, preparaViste, aggiorna, aggiungi } from './viste.js';
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
  scriviArchivio(avvisa);
  preparaFoglio(); preparaAvviso(); preparaViste(); preparaScheda();
  ascoltaFirme($('#app'));
  document.documentElement.classList.add('cmp-pronto');
  if (chiesto) usaPronto(chiesto); else disegna();

  // un locale (o una tappa) da aggiungere, dalla pagina «Dove mangiare» (?aggiungi=<id>&g=<giorno>)
  const richiesta = new URLSearchParams(W.daAggiungere ?? '');
  const da = richiesta.get('aggiungi');
  if (da && T(da)?.tipo === 'citta') {
    S.g = Math.min(Math.max(0, Number(richiesta.get('g')) || 0), nG() - 1);
    if (X().giorni[S.g].tappe.includes(da)) avvisaDopo(`${maiuscola(T(da).breve)} è già nel giorno ${S.g + 1}.`);
    else { disegna(); aggiungi(S.g, da); }
  }

  // ---------- un altro tab ha cambiato gli itinerari ----------
  quandoCambia(() => { const n = leggi(C); if (n && !schedaAperta() && !$('#foglio').open) { sostituisciArchivio({ ...n, attivo: A.attivo }); if (!A.elenco.some(i => i.id === A.attivo)) A.attivo = A.elenco[0].id; disegna(); } });

  // ---------- dopo l'apertura: scenari e orari veri dei bus (restano salvati per l'uso senza rete) ----------
  const ridisegna = () => { if (lista()) return; if (occupato()) setTimeout(ridisegna, 5000); else aggiorna(() => {}); };
  const lista = () => !X().giorni[S.g].tappe.length && !$('#foglio').open;
  Promise.all([document.fonts?.ready ?? Promise.resolve(), new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))]).then(() => caricaDopo(ridisegna));

  // ---------- dal vivo: ora del telefono e, se l'hai permesso, la posizione ----------
  navigator.permissions?.query({ name: 'geolocation' }).then(p => {
    VIVO.permesso = p.state;
    p.onchange = () => { VIVO.permesso = p.state; if (oggiNelGiorno(X(), S.g)) aggiorna(() => {}); };
    if (p.state === 'granted' && X().posizione === 'si' && oggiNelGiorno(X(), S.g)) aggiorna(() => {});
  }).catch(() => { /* il browser non lo dice: si chiede con il pannello */ });
  let guardia = null;
  const ferma = () => { if (guardia != null) navigator.geolocation.clearWatch(guardia); guardia = null; VIVO.posizione = null; };
  const cura = () => {
    const x = X();
    if (posizioneAttiva(x) && oggiNelGiorno(x, S.g) && document.visibilityState === 'visible') {
      if (guardia != null || VIVO.negata || !('geolocation' in navigator)) return;
      guardia = navigator.geolocation.watchPosition(p => { VIVO.posizione = { ll: [p.coords.latitude, p.coords.longitude], precisione: p.coords.accuracy }; dalVivo(); }, e => {
        if (e.code === e.PERMISSION_DENIED) { VIVO.negata = true; ferma(); avvisa('Il telefono non ha dato la posizione: calcolo dall\'ultima tappa visitata.'); aggiorna(() => {}); }
      }, { enableHighAccuracy: true, maximumAge: 60000, timeout: 30000 });
    } else ferma();
  };
  const occupato = () => !!document.querySelector('.in-trascina') || $('#foglio').open || !!document.activeElement?.closest('.posizione, .avviso-giorno');
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
  addEventListener('click', e => { if (e.target.closest?.('[data-azione="gps-si"]')) setTimeout(cura, 0); });
  cura();
  annuncia('');
}
// un avviso subito dopo il primo disegno
let primi = [];
function avvisaDopo(t) { primi.push(t); }
if (document.getElementById('app')) {
  avvia();
  if (primi.length) setTimeout(() => avvisa(primi.join(' ')), 600);
}
