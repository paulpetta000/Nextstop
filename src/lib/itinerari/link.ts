// Itinerari nel link e nella memoria del telefono. Il link porta tutto dopo il «#»: il browser non lo
// manda a nessun server. Esempio:
//   #n=Due+giorni&d=2027-07-15&g=0930-1900.duomo.sansevero.tribunali&g=0930-1900.@pompei
// n = nome, d = data del primo giorno, w = 1 solo a piedi, g = un giorno: orari, tappe (@ = gita).
// m = margine dopo ogni spostamento (minuti); p = le pause di ogni giorno, nello stesso ordine dei g, solo se almeno un giorno
// ha pause scelte: «pranzo.45.sansevero_caffe.20» (quale, minuti, dopo quale tappa), «-» la pausa pranzo di base, vuoto nessuna.
// Restano solo sul telefono: tappe visitate e loro timbri, «Salva», «Lascia così», la risposta sulla posizione.
import { dataValida } from './date.ts';
import { tappaDi } from './calcolo.ts';
import type { Citta, Giorno, Itinerario, Pausa, QualePausa } from './tipi';

export const INIZIO = 9 * 60 + 30;
export const FINE = 19 * 60;
export const MAX_GIORNI = 7;
export const MAX_TAPPE = 14;
export const MAX_NOME = 60;

export const nuovoId = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`).replace(/-/g, '').slice(0, 16);
export const giornoVuoto = (inizio = INIZIO, fine = FINE): Giorno => ({ tappe: [], inizio, fine });
export function nuovoItinerario(nome: string, giorni: Giorno[] = [giornoVuoto()]): Itinerario {
  const ora = Date.now();
  return { id: nuovoId(), nome, giorni, creato: ora, modificato: ora };
}

const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}${String(m % 60).padStart(2, '0')}`;
const minutiHhmm = (s: string) => (/^\d{4}$/.test(s) ? +s.slice(0, 2) * 60 + +s.slice(2) : NaN);

const QUALI: QualePausa[] = ['pranzo', 'caffe', 'riposo', 'libero'];
export const MARGINI_VALIDI = [5, 10, 15];
const testoPausa = (x: Pausa) => [x.quale, x.min, ...(x.dopo ? [x.dopo] : [])].join('.');

export function codifica(it: Itinerario): string {
  const p = new URLSearchParams();
  if (it.nome) p.set('n', it.nome);
  if (it.data) p.set('d', it.data);
  if (it.piedi) p.set('w', '1');
  if (it.margine && MARGINI_VALIDI.includes(it.margine)) p.set('m', String(it.margine));
  for (const g of it.giorni) p.append('g', [`${hhmm(g.inizio)}-${hhmm(g.fine)}`, ...(g.gita ? [`@${g.gita}`] : g.tappe)].join('.'));
  if (it.giorni.some(g => g.pause)) for (const g of it.giorni) p.append('p', g.pause ? g.pause.map(testoPausa).join('_') : '-');
  return p.toString();
}

// Pause valide: tipo conosciuto, una per tipo, da 5 minuti a 4 ore; «dopo» solo se la tappa è nel giorno
function sistemaPause(x: unknown, tappe: string[]): Pausa[] | undefined {
  if (!Array.isArray(x)) return undefined;
  const out: Pausa[] = [];
  for (const p of x) {
    if (!p || typeof p !== 'object' || !QUALI.includes(p.quale) || out.some(y => y.quale === p.quale)) continue;
    if (!Number.isFinite(p.min) || p.min < 5 || p.min > 240) continue;
    out.push({ quale: p.quale, min: Math.round(p.min), ...(typeof p.dopo === 'string' && tappe.includes(p.dopo) ? { dopo: p.dopo } : {}) });
  }
  return out;
}

// Giorno valido: orari plausibili, tappe che esistono, niente doppioni, gita da sola
function sistemaGiorno(C: Citta, g: Partial<Giorno> | undefined, scartate: string[]): Giorno {
  const inizio = Number.isFinite(g?.inizio) && g!.inizio! >= 5 * 60 && g!.inizio! <= 20 * 60 ? Math.round(g!.inizio!) : INIZIO;
  let fine = Number.isFinite(g?.fine) && g!.fine! <= 24 * 60 ? Math.round(g!.fine!) : FINE;
  if (fine < inizio + 60) fine = Math.min(24 * 60, inizio + 60);
  const gita = typeof g?.gita === 'string' && tappaDi(C, g.gita)?.tipo === 'gita' ? g.gita : undefined;
  if (typeof g?.gita === 'string' && !gita) scartate.push(g.gita);
  const viste = new Set<string>();
  const tappe = gita ? [] : (Array.isArray(g?.tappe) ? g!.tappe : []).filter(id => {
    const ok = typeof id === 'string' && !viste.has(id) && (tappaDi(C, id)?.tipo === 'citta' || id === C.evento?.id);
    if (typeof id === 'string' && !ok && !viste.has(id)) scartate.push(id);
    if (ok) viste.add(id);
    return ok;
  }).slice(0, MAX_TAPPE);
  const ok = Array.isArray(g?.ok) ? g!.ok.filter(id => tappe.includes(id)) : undefined;
  const fatte = Array.isArray(g?.fatte) ? g!.fatte.filter(id => tappe.includes(id)) : undefined;
  const pause = gita ? undefined : sistemaPause(g?.pause, tappe);
  const lascia = typeof g?.lascia === 'string' && g.lascia.length <= 800 ? g.lascia : undefined;
  return { tappe, inizio, fine, ...(gita ? { gita } : {}), ...(ok?.length ? { ok } : {}), ...(fatte?.length ? { fatte } : {}), ...(pause ? { pause } : {}), ...(lascia ? { lascia } : {}) };
}

// Un itinerario letto dalla memoria o da un link: tiene solo ciò che è valido e dice cosa ha scartato
export function sistema(C: Citta, x: Partial<Itinerario>): { it: Itinerario; scartate: string[] } {
  const scartate: string[] = [];
  const giorni = (Array.isArray(x.giorni) ? x.giorni : []).slice(0, MAX_GIORNI).map(g => sistemaGiorno(C, g, scartate));
  const ora = Date.now();
  const tutte = giorni.flatMap(g => g.tappe);
  const timbri = x.timbri && typeof x.timbri === 'object' ? Object.fromEntries(Object.entries(x.timbri).filter(([id, t]) => tutte.includes(id) && Number.isFinite(t) && (t as number) > 0)) : {};
  return {
    it: {
      id: typeof x.id === 'string' && /^[a-z0-9]{6,32}$/i.test(x.id) ? x.id : nuovoId(),
      nome: (typeof x.nome === 'string' && x.nome.trim() ? x.nome.trim() : 'Itinerario').slice(0, MAX_NOME),
      ...(dataValida(x.data) ? { data: x.data } : {}),
      ...(x.piedi ? { piedi: true } : {}),
      ...(x.posizione === 'si' || x.posizione === 'no' ? { posizione: x.posizione } : {}),
      ...(typeof x.margine === 'number' && MARGINI_VALIDI.includes(x.margine) ? { margine: x.margine } : {}),
      ...(typeof x.salvato === 'boolean' ? { salvato: x.salvato } : {}),
      ...(Object.keys(timbri).length ? { timbri } : {}),
      giorni: giorni.length ? giorni : [giornoVuoto()],
      creato: Number.isFinite(x.creato) ? x.creato! : ora,
      modificato: Number.isFinite(x.modificato) ? x.modificato! : ora
    },
    scartate
  };
}

export function decodifica(C: Citta, hash: string): { it: Itinerario; scartate: string[] } | null {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  const gg = p.getAll('g');
  if (!gg.length) return null;
  const pp = p.getAll('p');
  const giorni = gg.map((s, k) => {
    const [orari, ...resto] = s.split('.');
    const [a, b] = (orari || '').split('-');
    const gita = resto.length === 1 && resto[0].startsWith('@') ? resto[0].slice(1) : undefined;
    const q = pp[k];
    const pause = q == null || q === '-' ? undefined : q.split('_').filter(Boolean).map(x => { const [quale, min, dopo] = x.split('.'); return { quale, min: +min, ...(dopo ? { dopo } : {}) }; });
    return { inizio: minutiHhmm(a || ''), fine: minutiHhmm(b || ''), tappe: gita ? [] : resto, ...(gita ? { gita } : {}), ...(pause ? { pause } : {}) };
  });
  return sistema(C, { nome: p.get('n') || 'Itinerario ricevuto', data: p.get('d') || undefined, piedi: p.get('w') === '1', margine: +(p.get('m') ?? 0), giorni } as Partial<Itinerario>);
}

// Due itinerari con le stesse giornate (per non salvare due volte lo stesso link)
export const uguali = (a: Itinerario, b: Itinerario) => {
  const x = (it: Itinerario) => codifica({ ...it, nome: '' });
  return x(a) === x(b);
};
