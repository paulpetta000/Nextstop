// Lo stato del compositore: la città (pacco della build), gli itinerari sul telefono (memoria.ts, chiave «itinerari-v1»),
// l'itinerario aperto, i giorni calcolati (calcolo.ts, poi pause e margine con pause.ts) e i dati che arrivano dopo
// l'apertura (scenari, orari veri dei bus, mappa e percorsi). Niente DOM qui, tranne la lettura dei dati della pagina.
import { spacchetta, spacchettaVivo, aggiungiScenari, verificaRiferimento } from '../../../lib/itinerari/pacco';
import { calcolaGiorno, ordinePiuCorto, tappaDi, dataDelGiorno } from '../../../lib/itinerari/calcolo';
import { conPause } from '../../../lib/itinerari/pause';
import { nuovoItinerario, uguali, codifica } from '../../../lib/itinerari/link';
import { giornoSettimana, piuGiorni, dataLunga } from '../../../lib/itinerari/date';
import { leggiConRiferimento, creaSalvataggio, testoErroreSalvataggio, presentaSalvataggio, testoNotaMemoria } from '../memoria';
import { oggi, oraDiAdesso } from './base.js';
import { creaCaricaJson, applicaSchede } from '../caricamento.mjs';

/** @param {string} id @returns {unknown} */
const json = id => JSON.parse(document.getElementById(id)?.textContent || 'null');
export const C = spacchetta(/** @type {import('../../../lib/itinerari/pacco').Pacco} */ (json('it-dati')));
/** @type {import('./tipi').Pronto[]} */
export const PRONTI = /** @type {import('./tipi').Pronto[] | null} */ (json('it-pronti')) ?? [];
// per ogni tappa, locale e gita: foto, prima frase, frasi per la ricerca, fonti, credito; il marchio; le parole della città
/** @type {import('./tipi').InterfacciaCitta} */
export const UI = /** @type {import('./tipi').InterfacciaCitta} */ (json('it-ui')) ?? { tappe: {}, marchio: {chiaro:'',scuro:'',spillo:''}, citta: [] };
export const E = C.evento;

// Una tappa con quello che serve alla pagina. Le regate (l'evento) sono una tappa finta con l'ora fissa.
/** @type {Map<string,import('./tipi').TappaPagina>} */
const cache = new Map();
/** @param {string} id @returns {import('./tipi').TappaPagina | null} */
export function T(id) {
  if (cache.has(id)) return /** @type {import('./tipi').TappaPagina} */ (cache.get(id));
  /** @type {import("./tipi").TappaPagina} */
  let t;
  if (E && id === E.id) t = { id, nome: E.nome, breve: 'le regate', zona: 'Lungomare', durata: E.durata, chiuso: [], generi: [], tipo: 'citta', evento: true, xy: E.xy, ingresso: 'gratis', alChiuso: 'no', prenotazione: 'no' };
  else {
    const c = tappaDi(C, id);
    if (!c) return null;
    const u = UI.tappe[id] ?? {};
    // datiUI produce la coppia di miniature per ogni foto presente nel pacco.
    t = /** @type {import('./tipi').TappaPagina} */ ({ ...c, zona: C.zone[c.zona] ?? c.zona, zonaId: c.zona, generi: c.generi ?? [], chiuso: c.chiuso ?? [], ...u });
  }
  cache.set(id, t);
  return t;
}
/** @param {string} id */
export const esiste = id => !!T(id);

// ---------- gli itinerari sul telefono ----------
// un itinerario nuovo parte senza data (come nelle prove): con la data si vedono le chiusure di quel giorno e, il giorno stesso, gli orari dal vivo
/** @param {string} nome @param {import('../../../lib/itinerari/tipi').Giorno[]} [giorni] */
export const nuovo = (nome, giorni) => ({ ...nuovoItinerario(nome, giorni), salvato: false });
const iniziale = leggiConRiferimento(C);
export let A = iniziale.archivio ?? { attivo: '', elenco: [] };
export const X = () => A.elenco.find(i => i.id === A.attivo) ?? A.elenco[0];
export const salvato = (x = X()) => x?.salvato !== false;
export const nG = () => X().giorni.length;
/** @param {number} g */
export const lista = g => X().giorni[g]?.tappe ?? [];
/** @param {string} id */
export const giornoDi = id => X().giorni.findIndex(G => !G.gita && G.tappe.includes(id));
/** @param {string} id */
export const nelViaggio = id => giornoDi(id) >= 0;
/** @param {string} id */
export const visitata = id => X().giorni.some(G => G.fatte?.includes(id));
export const puoiSegnare = () => salvato();
export const vuotoTutto = (x = X()) => x.giorni.every(g => !g.gita && !g.tappe.length);
/** @param {import('../memoria').Archivio} nuovoA @param {Parameters<typeof creaSalvataggio>[0]} fonte */
export function sostituisciArchivio(nuovoA, fonte) { A = nuovoA; salvaArchivio = creaSalvataggio(fonte); memo.clear(); }

// le bozze aperte in questa visita, com'erano all'apertura: se le lasci così (o vuote) spariscono quando passi a un altro itinerario
/** @type {Map<string,string>} */
const bozze = new Map();
/** @param {import("../../../lib/itinerari/tipi").Itinerario} x */
export const ricordaBozza = x => bozze.set(x.id, codifica({ ...x, nome: '' }));
/** @param {string} id */
export function lasciaBozza(id) {
  const x = A.elenco.find(i => i.id === id);
  if (!x || salvato(x) || A.elenco.length < 2) return;
  if (vuotoTutto(x) || bozze.get(id) === codifica({ ...x, nome: '' })) A.elenco = A.elenco.filter(i => i.id !== id);
}
// apre un itinerario (e lascia la bozza di prima, se non è cambiata)
/** @param {string} id */
export function apri(id) {
  if (id === A.attivo) return;
  const prima = A.attivo;
  A.attivo = id;
  lasciaBozza(prima);
  memo.clear();
}
// un nome che nessun altro itinerario ha già («Due giorni a Napoli (2)»)
/** @param {string} base @param {string} [tranne] */
export function nomeLibero(base, tranne) {
  const nomi = new Set(A.elenco.filter(i => i.id !== tranne).map(i => i.nome));
  if (!nomi.has(base)) return base;
  for (let k = 2; ; k++) if (!nomi.has(`${base} (${k})`)) return `${base} (${k})`;
}
// lo stesso itinerario già sul telefono (le stesse giornate)
/** @param {import("../../../lib/itinerari/tipi").Itinerario} x */
export const gia = x => A.elenco.find(i => uguali(i, x));
export { nuovoItinerario };

// salvare: true se il browser lo permette (in navigazione privata o con la memoria piena no)
let salvaArchivio = creaSalvataggio(iniziale), ultimaScrittura = Promise.resolve(true);
/** @type {(()=>void) | undefined} */
let quandoSalvato;
/** @param {()=>void} fn */
export const quandoSalva = fn => { quandoSalvato = fn; };
export const salvataggioInCorso = () => salvaArchivio.stato() === 'in-corso';
export async function attendiSalvataggi() {
  let attesa, ok;
  do { attesa = ultimaScrittura; ok = await attesa; } while (attesa !== ultimaScrittura);
  return ok;
}
/** @param {(testo:string)=>void} [avvisa] */
export function scriviArchivio(avvisa) {
  const corrente = salvaArchivio;
  const lavoro = corrente(A, avvisa);
  quandoSalvato?.();
  ultimaScrittura = lavoro.then(ok => { if (corrente === salvaArchivio) quandoSalvato?.(); return ok; });
  return ultimaScrittura;
}
export const notaSalvataggio = () => testoNotaMemoria(salvaArchivio.stato());
export const erroreSalvataggio = () => testoErroreSalvataggio(salvaArchivio.stato());
export const statoSalvataggio = (x = X()) => presentaSalvataggio(salvato(x), salvaArchivio.stato());
// una modifica all'itinerario aperto: «visitata» vale solo per le tappe ancora nel giorno; i timbri per le tappe visitate
export function dopoModifica() {
  const x = X();
  for (const g of x.giorni) if (g.fatte) { g.fatte = g.fatte.filter(id => g.tappe.includes(id)); if (!g.fatte.length) delete g.fatte; }
  if (x.timbri) { for (const id of Object.keys(x.timbri)) if (!visitata(id)) delete x.timbri[id]; if (!Object.keys(x.timbri).length) delete x.timbri; }
  x.modificato = Date.now();
  memo.clear();
}
/** @param {import("../../../lib/itinerari/tipi").Itinerario} copia */
export function ripristina(copia) {
  A.elenco = A.elenco.map(i => (i.id === copia.id ? copia : i));
  memo.clear();
}

// ---------- la data ----------
/** @param {number} g */
export const dataDi = g => dataDelGiorno(X(), g);
/** @param {number} g */
export const giornoSett = g => (X().data ? giornoSettimana(/** @type {string} */ (dataDi(g))) : null);
/** @param {number} g */
export const dataLungaDi = g => dataLunga(/** @type {string} */ (dataDi(g)));
/** @param {string} id @param {number} g */
export const chiusaIl = (id, g) => !!X().data && !!T(id)?.chiuso?.includes(/** @type {import('../../../lib/itinerari/date').GiornoSettimana} */ (giornoSett(g)));
export { piuGiorni };

// ---------- dal vivo: il giorno di oggi, con l'ora del telefono e, se l'hai permesso, la posizione ----------
/** @type {{posizione:{ll:[number,number];precisione:number}|null;negata:boolean;permesso:PermissionState|null;toccato:boolean}} */
export const VIVO = { posizione: null, negata: false, permesso: null, toccato: false };
const VICINO = 200;
/** @param {[number,number]} a @param {[number,number]} b */
const metriTra = (a, b) => { const k = Math.cos(((a[0] + b[0]) / 2) * Math.PI / 180); return Math.hypot((a[0] - b[0]) * 111195, (a[1] - b[1]) * 111195 * k); };
/** @param {import("../../../lib/itinerari/tipi").Itinerario} x @param {number} g */
export const oggiNelGiorno = (x, g) => !!x.data && dataDelGiorno(x, g) === oggi() && !x.giorni[g]?.gita;
/** @param {import("../../../lib/itinerari/tipi").Itinerario} x */
export const posizioneAttiva = x => x.posizione === 'si' && !VIVO.negata && (VIVO.toccato || VIVO.permesso === 'granted');
/** @param {import("../../../lib/itinerari/tipi").Itinerario} x @param {number} g */
export function tappaQui(x, g) {
  const p = VIVO.posizione;
  if (!p || p.precisione > VICINO) return undefined;
  const G = x.giorni[g];
  let meglio, md = VICINO;
  for (const id of G.tappe) {
    if (G.fatte?.includes(id)) continue;
    const t = tappaDi(C, id);
    if (!t?.ll) continue;
    const d = metriTra(p.ll, t.ll);
    if (d <= md) { md = d; meglio = id; }
  }
  return meglio;
}
/** @param {import("../../../lib/itinerari/tipi").Itinerario} x @param {number} g */
export function adessoPer(x, g) {
  if (!oggiNelGiorno(x, g)) return undefined;
  const qui = posizioneAttiva(x) ? tappaQui(x, g) : undefined;
  return { data: oggi(), ora: oraDiAdesso(), ...(qui ? { qui } : {}) };
}
export const statoPosizione = () => (VIVO.posizione ? (VIVO.posizione.precisione > VICINO ? 'imprecisa' : 'ok') : 'nessuna');

// ---------- i giorni calcolati ----------
// grezzo: la giornata del calcolo del sito; G: con pause e margine (quella che si vede). null per un giorno vuoto o di gita.
/** @type {Map<string,ReturnType<typeof calcolaGiorno>>} */
const memo = new Map();
let versione = 0;   // cambia quando arrivano scenari o orari veri
export const ricalcola = () => { versione++; memo.clear(); };
/** @param {number} g @param {string[]} [tappe] */
export function grezzo(g, tappe) {
  const x = X(), Gg = x.giorni[g];
  if (!Gg || Gg.gita) return null;
  const l = tappe ?? Gg.tappe;
  if (!l.length) return null;
  const y = tappe ? { ...x, giorni: x.giorni.map((G, k) => (k === g ? { ...G, tappe: l } : G)) } : x;
  const a = adessoPer(x, g);
  const chiave = JSON.stringify([versione, g, y.giorni[g], y.data, y.piedi, a]);
  if (memo.has(chiave)) return /** @type {ReturnType<typeof calcolaGiorno>} */ (memo.get(chiave));
  const r = calcolaGiorno(C, y, g, a);
  if (memo.size > 600) memo.clear();
  memo.set(chiave, r);
  return r;
}
/** @param {number} g @param {string[]} [tappe] */
export function G(g, tappe) {
  const r = grezzo(g, tappe);
  if (!r) return null;
  const x = X(), Gg = tappe ? { ...x.giorni[g], tappe } : x.giorni[g];
  return conPause(C, Gg, r, x.margine, { data: dataDi(g), piedi: x.piedi });
}
/** @param {import("../../../lib/itinerari/tipi").Risultato} Gx */
export const tappeDi = Gx => Gx.voci.filter(v => v.tipo === 'tappa');
/** @param {import("../../../lib/itinerari/tipi").Risultato} Gx */
export const daFare = Gx => tappeDi(Gx).filter(v => !v.fatta);
/** @param {number} g */
export const ultimaDi = g => lista(g).slice(-1)[0];
/** @param {import("../../../lib/itinerari/tipi").Risultato} Gx */
export const titoloGiorno = Gx => [...new Set(tappeDi(Gx).map(v => T(v.id)?.zona).filter(Boolean))].join(', ');
/** @param {import("../../../lib/itinerari/tipi").Risultato} Gx */
export const aPiedi = Gx => Gx.voci.every(v => v.tipo !== 'tratto' || !v.mezzi.length);
// «Aggiungi»: la tappa in fondo al giorno, con il calcolo vero
/** @param {number} g @param {string} id */
export function aggiunta(g, id) {
  const X1 = G(g, [...lista(g), id]);
  if (!X1) return { tratto: null, X: null };
  const iT = X1.voci.findIndex(v => v.tipo === 'tappa' && v.id === id);
  const precedente = X1.voci[iT - 1];
  const tratto = precedente?.tipo === 'tratto' ? precedente : null;
  return { tratto, X: X1 };
}

// ---------- l'ordine più corto (calcolo.ts): almeno 3 tappe da fare e 5 minuti in meno; la prima resta ----------
/** @type {Map<string,ReturnType<typeof ordinePiuCorto>>} */
const memoOrdine = new Map();
/** @param {number} g */
export function ordineCorto(g) {
  const x = X(), Gg = x.giorni[g];
  if (!Gg || Gg.gita) return null;
  const vivo = oggiNelGiorno(x, g);
  const fatte = vivo ? (Gg.fatte ?? []).filter(id => Gg.tappe.includes(id)) : [];
  const resto = Gg.tappe.filter(id => !fatte.includes(id));
  if (resto.length < 3) return null;
  const chiave = JSON.stringify([versione, g, Gg, x.data, x.piedi, x.margine, adessoPer(x, g)]);
  if (!memoOrdine.has(chiave)) {
    const y = { ...x, giorni: x.giorni.map((G1, k) => (k === g ? { ...G1, tappe: resto } : G1)) };
    memoOrdine.set(chiave, ordinePiuCorto(C, y, g, ordine => /** @type {import("../../../lib/itinerari/pause").Giornata} */ (G(g, [...fatte, ...ordine])).spostamenti));
  }
  const o = memoOrdine.get(chiave);
  return o && Gg.lascia !== Gg.tappe.join('.') ? { ...o, fatte } : null;
}

// ---------- dati che arrivano dopo l'apertura (restano salvati per l'uso senza rete dal service worker) ----------
// Prima si disegna la pagina; i dati grandi (mappa, percorsi, scenari, orari dei bus) si scaricano a pagina caricata, quando il
// telefono è libero: così il primo disegno non aspetta mezzo megabyte di dati.
/** @type {Promise<void> | null} */
let libero = null;
export const quandoLibero = () => (libero ??= new Promise(ok => {
  const vai = () => (typeof window.requestIdleCallback === 'function' ? requestIdleCallback(() => ok(), { timeout: 1200 }) : setTimeout(ok, 200));
  if (document.readyState === 'complete') vai(); else addEventListener('load', vai, { once: true });
}));
/** @param {()=>void} quandoArriva */
export async function caricaDopo(quandoArriva) {
  await quandoLibero();
  fetch('/napoli/itinerari/scenari.json', { priority: 'low' }).then(r => (r.ok ? r.json() : null)).then(p => {
    if (!p) return;
    aggiungiScenari(C, p); memoOrdine.clear(); ricalcola(); quandoArriva();
  }).catch(() => { /* senza, valgono i tempi del feriale */ });
  fetch('/napoli/itinerari/partenze.json', { priority: 'low' }).then(r => (r.ok ? r.json() : null)).then(p => {
    if (!p) return;
    C.vivo = spacchettaVivo(p, C.riferimento, C.tempi?.n); memoOrdine.clear(); ricalcola(); quandoArriva();
  }).catch(() => { /* senza orari veri resta l'attesa media */ });
}
// la mappa di oggi e i percorsi tra le tappe: si caricano una volta
/** @type {Promise<import('./mappa-tipi').DatiMappa> | null} */
let mappaDati = null;
export const caricaMappa = () => (mappaDati ??= quandoLibero().then(() => Promise.all([
  fetch('/napoli/itinerari/mappa.json').then(r => { if (!r.ok) throw new Error('mappa'); return r.json(); }),
  fetch('/napoli/itinerari/percorsi.json').then(r => { if (!r.ok) throw new Error('percorsi'); return r.json(); }),
  // l'indice delle strade a pezzi: senza (vecchia copia, niente rete) la mappa resta quella di base
  fetch('/napoli/itinerari/strade/indice.json').then(r => (r.ok ? r.json() : null)).catch(() => null)
])).then(([mappa, percorsi, indice]) => {
  verificaRiferimento(C.riferimento, mappa); verificaRiferimento(C.riferimento, percorsi);
  try { if (indice) verificaRiferimento(C.riferimento, indice); } catch { indice = null; }
  return /** @type {import('./mappa-tipi').DatiMappa} */ ([mappa, percorsi, indice]);
}).catch(e => { mappaDati = null; throw e; }));
/** @type {()=>Promise<import('./mappa-tipi').AlternativiMappa|null>} */
export const caricaAlternativi = creaCaricaJson('/napoli/itinerari/percorsi-alternativi.json', undefined, p => verificaRiferimento(C.riferimento, p));
// le schede complete e i dati della ricerca (/napoli/itinerari/schede/, schede.astro): si scaricano a pagina caricata e
// servono quando apri una scheda o cerchi. MODELLI: id → contenuto del <template> della scheda.
/** @type {Map<string,DocumentFragment>} */
export const MODELLI = new Map();
/** @type {Promise<void> | null} */
let schede = null;
export const schedePronte = () => MODELLI.size > 0;
export const caricaSchede = () => (schede ??= fetch('/napoli/itinerari/schede/').then(r => { if (!r.ok) throw new Error('schede'); return r.text(); }).then(html => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  applicaSchede(doc, MODELLI, UI.tappe, content => document.importNode(content, true));
  cache.clear();
}).catch(e => { schede = null; throw e; }));
