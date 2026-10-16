// Gli itinerari restano nel browser. La lettura recupera i record validi; prima di
// riscrivere un archivio danneggiato conserva l'originale, senza sostituire copie precedenti.
import { sistema } from '../../lib/itinerari/link.ts';
import { dataValida } from '../../lib/itinerari/date.ts';
import type { Citta, Itinerario } from '../../lib/itinerari/tipi';

const CHIAVE = 'itinerari-v1';
const COPIA = 'itinerari-v1-recupero';
export type Archivio = { attivo: string; elenco: Itinerario[] };
export type Riepilogo = { id: string; nome: string; data?: string; giorni: { tappe: string[]; gita?: string }[] };
type Lettura = { stato: 'assente' | 'valido' | 'danneggiato' | 'versione-ignota'; attivo: string; elenco: Partial<Itinerario>[] };
const oggetto = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

function decifra(raw: string | null): Lettura {
  const vuoto = { attivo: '', elenco: [] };
  if (raw === null) return { ...vuoto, stato: 'assente' };
  try {
    const x = JSON.parse(raw);
    if (!oggetto(x)) return { ...vuoto, stato: 'danneggiato' };
    // La memoria senza «v» precede la versione 1. Una versione sconosciuta non va reinterpretata.
    if (x.v !== undefined && x.v !== 1) return { ...vuoto, stato: 'versione-ignota' };
    if (!Array.isArray(x.elenco)) return { ...vuoto, stato: 'danneggiato' };
    const elenco = x.elenco.filter((i: unknown) => oggetto(i) && Array.isArray(i.giorni)) as Partial<Itinerario>[];
    const danneggiato = elenco.length !== x.elenco.length || elenco.some(i => i.giorni!.some(g =>
      !oggetto(g) || !Array.isArray(g.tappe) || g.tappe.some(id => typeof id !== 'string')
    ));
    return { stato: danneggiato ? 'danneggiato' : 'valido', attivo: typeof x.attivo === 'string' ? x.attivo : '', elenco };
  } catch { return { ...vuoto, stato: 'danneggiato' }; }
}

export function leggi(C: Citta): Archivio | null {
  try {
    const x = decifra(localStorage.getItem(CHIAVE));
    const elenco: Itinerario[] = [];
    for (const i of x.elenco) {
      try { elenco.push(sistema(C, i).it); } catch { /* un record non deve impedire di recuperare gli altri */ }
    }
    if (!elenco.length) return null;
    return { attivo: elenco.some(i => i.id === x.attivo) ? x.attivo : elenco[0].id, elenco };
  } catch { return null; }
}

// I filtri dei locali non hanno la città del motore: ricevono solo i campi che usano,
// validati con la stessa lettura. Nessuna scrittura; gli indici dei giorni restano gli stessi.
export function leggiRiepilogo(): Riepilogo | null {
  try {
    const x = decifra(localStorage.getItem(CHIAVE));
    const i = x.elenco.find(i => i.id === x.attivo) ?? x.elenco[0];
    if (!i) return null;
    return {
      id: typeof i.id === 'string' ? i.id : '',
      nome: typeof i.nome === 'string' ? i.nome : 'Itinerario',
      ...(dataValida(i.data) ? { data: i.data } : {}),
      giorni: i.giorni!.map(g => ({
        tappe: Array.isArray(g?.tappe) ? g.tappe.filter(id => typeof id === 'string') : [],
        ...(typeof g?.gita === 'string' ? { gita: g.gita } : {})
      }))
    };
  } catch { return null; }
}

// True soltanto dopo una scrittura riuscita. Senza spazio per la copia, l'originale resta intatto.
export function scrivi(a: Archivio): boolean {
  try {
    const raw = localStorage.getItem(CHIAVE), x = decifra(raw);
    if (x.stato === 'versione-ignota') return false;
    if (x.stato === 'danneggiato' && raw !== null) {
      const copia = localStorage.getItem(COPIA);
      if (copia === null) localStorage.setItem(COPIA, raw);
      else if (copia !== raw) return false;
    }
    localStorage.setItem(CHIAVE, JSON.stringify({ v: 1, ...a }));
    return true;
  } catch { return false; }
}

// Limitare gli avvisi ripetuti non cambia mai l'esito reale del salvataggio.
export function creaSalvataggio() {
  let avvisato = false;
  return (a: Archivio, avvisa?: (testo: string) => void): boolean => {
    const ok = scrivi(a);
    if (ok) avvisato = false;
    else if (avvisa && !avvisato) {
      avvisato = true;
      avvisa('Questo browser non salva i dati: l\'itinerario resta finché la pagina è aperta. Per tenerlo, mandalo con «Condividi».');
    }
    return ok;
  };
}

// Un altro tab ha cambiato gli itinerari.
export const quandoCambia = (fn: () => void) => addEventListener('storage', e => { if (e.key === CHIAVE) fn(); });
