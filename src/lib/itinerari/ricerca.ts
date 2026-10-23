// La ricerca di «Aggiungi» (specifiche/compositore.md §3): una sola per tappe, locali e gite, in gruppi («Da vedere»,
// «Da mangiare», «Gite»). Cerca nel nome, nelle parole del sito (sinonimi di generi, cucine e piatti: regola nostra, uguale
// per ogni città) e nelle frasi dei nostri testi, che hanno già le fonti; senza accenti e con piccoli errori di battitura
// (una lettera dalle 5 lettere in su, due dalle 9), solo se la parola scritta non c'è nei nostri testi («pizza» c'è, quindi
// non trova «piazza»). Il nome della città vale solo nei nomi. Le parole chiave dei luoghi arrivano con la riscrittura dei
// testi delle tappe (piano nella specifica). Funzioni pure, senza DOM e senza pacchetti.

// Le parole del sito: il primo nome è quello che si vede («per: Panorama»)
export const SINONIMI: Record<'genere' | 'cucina' | 'piatto' | 'gruppo', Record<string, string[]>> = {
  genere: {
    panorama: ['Panorama', 'panorami', 'vista', 'veduta', 'belvedere', 'terrazza', 'tramonto'], museo: ['Museo', 'musei', 'mostra', 'arte', 'quadri', 'dipinti', 'statue'],
    chiesa: ['Chiesa', 'chiese', 'basilica', 'cattedrale', 'cappella'], sotterraneo: ['Sottoterra', 'sotterranea', 'sotterraneo', 'sotterranei', 'catacombe'],
    archeologia: ['Scavi', 'archeologia', 'archeologico', 'rovine', 'romani', 'greci'], parco: ['Parco', 'parchi', 'giardino', 'giardini', 'verde'],
    mare: ['Mare', 'spiaggia', 'spiagge', 'bagno', 'lungomare'], castello: ['Castello', 'castelli', 'fortezza'], passeggiata: ['Passeggiata', 'passeggiate', 'camminare'],
    teatro: ['Teatro', 'opera lirica', 'balletto']
  },
  cucina: {
    pizza: ['Pizzeria', 'pizza', 'pizze', 'pizzerie'], pesce: ['Pesce', 'frutti di mare', 'crudo'], dolci: ['Dolci e caffè', 'dolci', 'pasticceria', 'pasticcerie', 'colazione', 'bar'],
    strada: ['Cibo di strada', 'street food', 'fritti', 'friggitoria'], carne: ['Carne', 'braceria', 'bistecca', 'grigliata'], pasta: ['Pasta', 'primi'],
    napoletana: ['Cucina napoletana', 'trattoria', 'cucina tipica']
  },
  piatto: {
    margherita: ['Pizza margherita', 'margherita'], marinara: ['Pizza marinara', 'marinara'], 'pizza-fritta': ['Pizza fritta'], cuoppo: ['Cuoppo di fritti', 'cuoppo'],
    frittatina: ['Frittatina di pasta', 'frittatina'], montanara: ['Montanara'], genovese: ['Genovese'], ragu: ['Ragù'], 'pasta-patate': ['Pasta e patate', 'pasta patate e provola'],
    vongole: ['Spaghetti alle vongole', 'vongole'], frittura: ['Frittura di pesce', 'frittura'], polpette: ['Polpette al ragù', 'polpette'], parmigiana: ['Parmigiana di melanzane', 'parmigiana'],
    baccala: ['Baccalà'], sfogliatella: ['Sfogliatella', 'riccia', 'frolla'], baba: ['Babà'], pastiera: ['Pastiera'], caffe: ['Caffè', 'espresso']
  },
  gruppo: { gite: ['Gita di un giorno', 'gita', 'gite', 'escursione', 'fuori napoli', 'isola', 'isole'], mangiare: ['Da mangiare', 'mangiare', 'ristorante', 'ristoranti', 'pranzo', 'cena'] }
};
const VUOTE = new Set('a ad al alla alle ai agli allo e ed i il in la le lo l gli di da dal dalla dei del della delle dello degli d con per su un una uno o che'.split(' '));

export type Gruppo = 'vedere' | 'mangiare' | 'gite';
// Una voce da cercare (la pagina la prepara dai dati della città e dai testi)
export interface VoceRicerca {
  id: string; nome: string; breve: string; zona: string;
  tipo: 'citta' | 'gita'; categoria?: string; generi?: string[]; cucina?: string[]; piatti?: string[];
  frasi?: { t: string; da: string | null }[];
}
export type Pezzi = { s: string; seg: { i: number; n: number; w: string }[] };
export type Motivo = { tipo: 'nome'; campo?: 'breve' } | { tipo: 'zona' } | { tipo: 'frase'; k: number } | { tipo: 'genere' | 'cucina' | 'piatto' | 'gruppo'; nome: string };
export type Risultato = Motivo & { id: string; gruppo: Gruppo; s: number; dove: number[]; min?: number | null };
type Etichetta = { tipo: 'genere' | 'cucina' | 'piatto' | 'gruppo'; nome: string; p: Pezzi[] };
type Indicizzata = { id: string; gruppo: Gruppo; nome: Pezzi; breve: Pezzi; zona: Pezzi; frasi: (Pezzi & { da: string | null })[]; etichette: Etichetta[] };
export interface Indice { voci: Indicizzata[]; vocabolario: Set<string>; citta: string[] }

export const norma = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// una frase spezzata in parole, ricordando dove sono nel testo (per evidenziarle)
export const pezzi = (s: string): Pezzi => { const t = String(s ?? ''); return { s: t, seg: [...t.matchAll(/[\p{L}\p{N}]+/gu)].map(m => ({ i: m.index!, n: m[0].length, w: norma(m[0]) })) }; };

// errori di battitura: lettere sbagliate, mancanti, in più o scambiate con la vicina (Damerau), fermandosi oltre max
export function distanza(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: a.length + 1 }, (_, i) => { const r = new Array(b.length + 1).fill(0); r[0] = i; return r; });
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let min = Infinity;
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      min = Math.min(min, d[i][j]);
    }
    if (min > max) return max + 1;
  }
  return d[a.length][b.length];
}
const tolleranza = (q: string) => (q.length >= 9 ? 2 : q.length >= 5 ? 1 : 0);

export const gruppoDi = (t: Pick<VoceRicerca, 'tipo' | 'categoria'>): Gruppo => (t.tipo === 'gita' ? 'gite' : t.categoria ? 'mangiare' : 'vedere');
function etichetteDi(t: VoceRicerca): Etichetta[] {
  const out: Etichetta[] = [];
  const metti = (tipo: Etichetta['tipo'], chiave: string) => { const l = SINONIMI[tipo][chiave]; if (l) out.push({ tipo, nome: l[0], p: l.map(pezzi) }); };
  if (t.categoria) { (t.cucina ?? []).forEach(c => metti('cucina', c)); (t.piatti ?? []).forEach(c => metti('piatto', c)); metti('gruppo', 'mangiare'); }
  else (t.generi ?? []).forEach(g => metti('genere', g));
  if (t.tipo === 'gita') metti('gruppo', 'gite');
  return out;
}

// citta: il nome della città e le parole che ne derivano («napoli», «napoletana»): valgono solo nei nomi
export function creaIndice(voci: VoceRicerca[], citta: string[] = []): Indice {
  const lista = voci.map(t => ({ id: t.id, gruppo: gruppoDi(t), nome: pezzi(t.nome), breve: pezzi(t.breve), zona: pezzi(t.zona), frasi: (t.frasi ?? []).map(f => ({ ...pezzi(f.t), da: f.da })), etichette: etichetteDi(t) }));
  const vocabolario = new Set(lista.flatMap(x => [x.nome, x.breve, x.zona, ...x.frasi, ...x.etichette.flatMap(e => e.p)].flatMap(p => p.seg.map(y => y.w))));
  return { voci: lista, vocabolario, citta: citta.map(norma) };
}

// quanto una parola cercata somiglia a una del testo: 3 uguale, 2 l'inizio (mentre scrivi), 1.5 con un errore
function somiglia(q: string, w: string, ultima: boolean, esatte: Set<string>) {
  if (q === w) return 3;
  if (w.startsWith(q) && (q.length >= 5 || (ultima && q.length >= 2))) return 2;
  if (esatte.has(q)) return 0;
  const t = tolleranza(q);
  return t && distanza(q, w, t) <= t ? 1.5 : 0;
}
// tutte le parole cercate devono trovarsi nel testo; un punto in più se sono una dopo l'altra, come scritte
function confronta(qs: string[], p: Pezzi, esatte: Set<string>) {
  if (!p.seg.length) return null;
  let tot = 0;
  const dove: number[] = [];
  for (let k = 0; k < qs.length; k++) {
    let best = 0, bi = -1;
    p.seg.forEach((x, i) => { const s = somiglia(qs[k], x.w, k === qs.length - 1, esatte); if (s > best) { best = s; bi = i; } });
    if (!best) return null;
    tot += best; dove.push(bi);
  }
  const fila = qs.length > 1 && dove.every((x, i) => !i || x === dove[i - 1] + 1);
  return { s: tot / qs.length + (fila ? 1 : 0), dove };
}

// Cerca: per ogni voce il motivo migliore (nome, parola del sito, frase, zona), poi i gruppi dal più pertinente.
// ok: il filtro; minuti: i minuti a piedi per ordinare a parità (null se non conta: gite, tappe già nel viaggio).
export function cerca(I: Indice, testo: string, { ok = () => true, minuti = () => null }: { ok?: (id: string) => boolean; minuti?: (id: string) => number | null } = {}) {
  const qs = pezzi(testo).seg.map(x => x.w).filter(w => !VUOTE.has(w));
  if (!qs.length || norma(testo).replace(/[^a-z0-9]/g, '').length < 2) return null;
  const diCitta = (w: string) => I.citta.some(c => c === w || (w.length >= 4 && c.startsWith(w)) || (w.length >= 5 && distanza(w, c, 1) <= 1));
  const qa = qs.filter(w => !diCitta(w));
  const esatte = new Set(qs.filter(q => [...I.vocabolario].some(w => w === q || (q.length >= 4 && w.startsWith(q)))));
  const trovati: Risultato[] = [];
  for (const x of I.voci) {
    if (!ok(x.id)) continue;
    let migliore: (Motivo & { s: number; dove: number[] }) | null = null;
    const prova = (m: { s: number; dove: number[] } | null, peso: number, perche: Motivo) => { if (m && (!migliore || m.s + peso > migliore.s)) migliore = { ...perche, s: m.s + peso, dove: m.dove }; };
    prova(confronta(qs, x.nome, esatte), 3, { tipo: 'nome' });
    if (x.breve.s !== x.nome.s) prova(confronta(qs, x.breve, esatte), 3, { tipo: 'nome', campo: 'breve' });
    if (qa.length) {
      for (const e of x.etichette) for (const p of e.p) { const m = confronta(qa, p, esatte); if (m && m.dove.length >= Math.min(qa.length, p.seg.length)) prova(m, 1.2, { tipo: e.tipo, nome: e.nome }); }
      x.frasi.forEach((f, k) => prova(confronta(qa, f, esatte), 1.5, { tipo: 'frase', k }));
      prova(confronta(qa, x.zona, esatte), 0.5, { tipo: 'zona' });
    }
    if (migliore) trovati.push({ ...(migliore as Motivo & { s: number; dove: number[] }), id: x.id, gruppo: x.gruppo, min: minuti(x.id) });
  }
  trovati.sort((a, b) => b.s - a.s || (a.min ?? 99) - (b.min ?? 99) || a.id.localeCompare(b.id));
  const gruppi = (['vedere', 'mangiare', 'gite'] as Gruppo[]).map(g => ({ g, l: trovati.filter(r => r.gruppo === g) })).filter(x => x.l.length);
  gruppi.sort((a, b) => b.l[0].s - a.l[0].s);
  return { qs, tutti: trovati, gruppi };
}

// Il testo con le parole trovate segnate (<mark>), già con i caratteri speciali sostituiti
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
export function evidenzia(p: Pezzi, dove: number[], da = 0, a = p.seg.length) {
  const segni = new Set(dove);
  let out = '', pos = da ? p.seg[da].i : 0;
  const fine = a < p.seg.length ? p.seg[a - 1].i + p.seg[a - 1].n : p.s.length;
  for (let i = da; i < a; i++) {
    const x = p.seg[i];
    out += esc(p.s.slice(pos, x.i));
    out += segni.has(i) ? `<mark class="r-segno">${esc(p.s.slice(x.i, x.i + x.n))}</mark>` : esc(p.s.slice(x.i, x.i + x.n));
    pos = x.i + x.n;
  }
  return out + esc(p.s.slice(pos, fine));
}
// un pezzo corto della frase intorno alle parole trovate («…c'è il Cristo velato. Si entra…»)
export function pezzetto(p: Pezzi, dove: number[], lato = 5) {
  const a = Math.max(0, Math.min(...dove) - lato), b = Math.min(p.seg.length, Math.max(...dove) + lato + 1);
  return `${a > 0 ? '…' : ''}${evidenzia(p, dove, a, b)}${b < p.seg.length ? '…' : ''}`;
}
