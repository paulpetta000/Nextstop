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

// Riferimento e archivio devono provenire dalla stessa lettura, anche se un'altra scheda scrive subito dopo.
export function leggiConRiferimento(C: Citta): { archivio: Archivio | null; riferimento: string | null | undefined } {
  let riferimento: string | null | undefined;
  try {
    riferimento = localStorage.getItem(CHIAVE);
    const x = decifra(riferimento), elenco: Itinerario[] = [];
    for (const i of x.elenco) {
      try { elenco.push(sistema(C, i).it); } catch { /* recupera gli altri record */ }
    }
    return { riferimento, archivio: elenco.length ? { attivo: elenco.some(i => i.id === x.attivo) ? x.attivo : elenco[0].id, elenco } : null };
  } catch { return { riferimento, archivio: null }; }
}
export const leggi = (C: Citta): Archivio | null => leggiConRiferimento(C).archivio;

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
export type EsitoSalvataggio = 'salvato' | 'errore' | 'conflitto' | 'in-corso';
function scriviControllato(serializzato: string, atteso?: string | null): EsitoSalvataggio {
  try {
    const raw = localStorage.getItem(CHIAVE);
    if (atteso !== undefined && raw !== atteso) return 'conflitto';
    const x = decifra(raw);
    if (x.stato === 'versione-ignota') return 'errore';
    if (x.stato === 'danneggiato' && raw !== null) {
      const copia = localStorage.getItem(COPIA);
      if (copia === null) localStorage.setItem(COPIA, raw);
      else if (copia !== raw) return 'errore';
    }
    localStorage.setItem(CHIAVE, serializzato);
    return 'salvato';
  } catch { return 'errore'; }
}
// Scrittura diretta per compatibilità e prove; il compositore usa sempre il salvatore coordinato.
export function scrivi(a: Archivio): boolean {
  try { return scriviControllato(JSON.stringify({ v: 1, ...a })) === 'salvato'; } catch { return false; }
}

export function testoErroreSalvataggio(esito: EsitoSalvataggio): string {
  if (esito === 'salvato' || esito === 'in-corso') return '';
  if (esito === 'conflitto') return 'Gli itinerari sono cambiati in un’altra scheda. Questa modifica resta qui: usa «Condividi» prima di ricaricare la pagina.';
  return 'Questo browser non salva i dati: l’itinerario resta finché la pagina è aperta. Per tenerlo, mandalo con «Condividi».';
}
export function presentaSalvataggio(salvato: boolean, esito: EsitoSalvataggio) {
  const errore = esito !== 'salvato', fatto = salvato && !errore;
  return { fatto, tipo: fatto ? 'salvato' : 'bozza', testo: esito === 'in-corso' ? 'Salvataggio in corso' : errore ? 'Modifiche non salvate' : fatto ? 'Salvato in «I miei itinerari»' : 'Non ancora salvato' };
}

// Le fotografie delle modifiche attendono il turno nella stessa scheda e nello stesso origin.
// Senza Web Locks non si ripiega su una scrittura non coordinata.
export function creaSalvataggio(fonte?: { riferimento: string | null | undefined }) {
  let riferimento: string | null | undefined, avvisato = false, pendenti = 0;
  let esito: EsitoSalvataggio = 'salvato', coda = Promise.resolve();
  if (fonte) riferimento = fonte.riferimento;
  else try { riferimento = localStorage.getItem(CHIAVE); } catch { /* accesso non disponibile */ }
  const salva = (a: Archivio, avvisa?: (testo: string) => void): Promise<boolean> => {
    let serializzato: string | undefined;
    try { serializzato = JSON.stringify({ v: 1, ...a }); } catch { /* non scrivere dati non serializzabili */ }
    pendenti++;
    const lavoro = coda.then(async () => {
      let risultato: EsitoSalvataggio = 'errore';
      try {
        if (riferimento !== undefined && serializzato !== undefined && globalThis.navigator?.locks?.request) {
          const stop = new AbortController(), timer = setTimeout(() => stop.abort(), 3000);
          try {
            risultato = await navigator.locks.request(CHIAVE, { mode: 'exclusive', signal: stop.signal }, () => {
              const r = scriviControllato(serializzato!, riferimento);
              if (r === 'salvato') riferimento = serializzato;
              return r;
            });
          } finally { clearTimeout(timer); }
        }
      } catch { /* lock negato o attesa scaduta: la copia locale resta disponibile */ }
      esito = risultato; pendenti--;
      const ok = risultato === 'salvato';
      if (ok) avvisato = false;
      else if (avvisa && !avvisato) { avvisato = true; avvisa(testoErroreSalvataggio(risultato)); }
      return ok;
    });
    coda = lavoro.then(() => {}, () => {});
    return lavoro;
  };
  return Object.assign(salva, { stato: (): EsitoSalvataggio => pendenti ? 'in-corso' : esito });
}

// Il browser può chiedere conferma all'uscita solo se restano scritture pendenti o fallite.
// Il listener viene tolto dopo il recupero; non tenta scritture asincrone durante la chiusura.
export function proteggiUscita(daSalvare: () => boolean) {
  let attiva = false;
  const avvisa = (e: BeforeUnloadEvent) => {
    if (!daSalvare()) return;
    e.preventDefault(); e.returnValue = '';
  };
  return () => {
    const serve = daSalvare();
    if (serve === attiva) return;
    attiva = serve;
    if (serve) addEventListener('beforeunload', avvisa);
    else removeEventListener('beforeunload', avvisa);
  };
}

// Un altro tab ha cambiato gli itinerari.
export const quandoCambia = (fn: () => void) => addEventListener('storage', e => {
  try { if (e.storageArea !== localStorage) return; } catch { return; }
  if (e.key === CHIAVE || e.key === null) fn();
});

// Normalizzazione e scelta del giorno dopo aver ricevuto un archivio da un'altra scheda.
export function giornoSicuro(valore: unknown, quanti: number) {
  const n = typeof valore === 'number' || typeof valore === 'string' ? Number(valore) : 0;
  return Number.isInteger(n) ? Math.max(0, Math.min(n, quanti - 1)) : 0;
}
export function allineaArchivio(attuale: Archivio, nuovo: Archivio, giorno: number) {
  const attivo = nuovo.elenco.find(i => i.id === attuale.attivo) ?? nuovo.elenco[0];
  return { archivio: { ...nuovo, attivo: attivo.id }, giorno: giornoSicuro(giorno, attivo.giorni.length) };
}
