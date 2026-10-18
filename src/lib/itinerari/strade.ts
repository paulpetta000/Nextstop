// Le strade piccole della mappa a pezzi (specifiche/compositore.md §6, scelta del 14/10/2026): vicoli, scale, pedonali e nomi
// delle vie di OpenStreetMap su tutta la mappa, in pezzi quadrati scritti da scripts/mappa/strade.mjs (src/data/strade.json).
// Qui solo i calcoli, senza pagina: quali pezzi servono, come si rileggono i path e quali vie fa il percorso.
// Unità della mappa: quelle di src/data/mappa.json (1 unità = 5 m).

export type Punto = [number, number];
export type Riquadro = { x: number; y: number; w: number; h: number };
// una via con il nome dentro un pezzo: [nome, classe (g grandi, m medie, p pedonali, v vicoli, s scale), lunghezza, path]
export type NomePezzo = [string, string, number, string];
export type Pezzo = { g?: string; m?: string; p?: string; v?: string; s?: string; n: NomePezzo[] };

// Un path dei pezzi: «Mx yl dx dy dx dy…» con numeri corti («.5», «-.5», separatore solo quando serve)
export function rileggi(d: string): Punto[] {
  const [a, b = ''] = d.slice(1).split('l');
  const n = (s: string) => (s.match(/-?(?:\d+\.?\d*|\.\d+)/g) || []).map(Number);
  const r = n(b), p: Punto[] = [n(a) as Punto];
  for (let i = 0; i + 1 < r.length; i += 2) { const q = p[p.length - 1]; p.push([Math.round((q[0] + r[i]) * 10) / 10, Math.round((q[1] + r[i + 1]) * 10) / 10]); }
  return p;
}

// I pezzi che toccano un riquadro (più un margine in unità), solo quelli che esistono (gli altri sono mare)
export function pezziDi(b: Riquadro, lato: number, esistono: Set<string>, margine = 0): string[] {
  if (!b || ![b.x, b.y, b.w, b.h, lato, margine].every(Number.isFinite) || lato <= 0 || b.w < 0 || b.h < 0) return [];
  const daX = Math.floor((b.x - margine) / lato), aX = Math.floor((b.x + b.w + margine) / lato);
  const daY = Math.floor((b.y - margine) / lato), aY = Math.floor((b.y + b.h + margine) / lato);
  if (![daX, aX, daY, aY].every(Number.isFinite) || aX < daX || aY < daY) return [];
  // Per una vista piccola resta il ciclo corto originale; il numero di passi è limitato dai pezzi esistenti.
  if ([daX, aX, daY, aY].every(Number.isSafeInteger) && (aX - daX + 1) * (aY - daY + 1) <= esistono.size) {
    const out: string[] = [];
    for (let i = daX; i <= aX; i++) for (let j = daY; j <= aY; j++) { const k = i + '_' + j; if (esistono.has(k)) out.push(k); }
    return out;
  }
  const out: [string, number, number][] = [];
  // Visita solo i pezzi esistenti: una vista enorme o lontanissima non avvia miliardi di iterazioni.
  for (const k of esistono) {
    if (typeof k !== 'string') continue;
    const [i, j] = k.split('_').map(Number);
    if (!Number.isSafeInteger(i) || !Number.isSafeInteger(j) || k !== i + '_' + j) continue;
    if (i >= daX && i <= aX && j >= daY && j <= aY) out.push([k, i, j]);
  }
  return out.sort((a, b) => a[1] - b[1] || a[2] - b[2]).map(([k]) => k);
}

// Il riquadro che contiene dei punti
export function riquadroDi(punti: Punto[]): Riquadro | null {
  if (!punti.length) return null;
  const xs = punti.map(p => p[0]), ys = punti.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

const dist = (a: Punto, b: Punto) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function distSeg(p: Punto, a: Punto, b: Punto) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)) : 0;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

export type Via = { nome: string; punti: Punto[] };
export type NomeSulPercorso = { nome: string; L: number; punti: Punto[] };

// Le vie dove passa il percorso: un punto ogni 2 unità (10 m) sulle linee; per ogni punto la via con il nome più vicina entro
// «vicino» unità (15 m); i tratti di almeno «minimo» unità (120 m) sulla stessa via danno il nome (un buco di due punti non li
// interrompe). Una volta per via, il tratto più lungo, scritto da sinistra a destra lungo il percorso stesso.
export function nomiDelPercorso(linee: Punto[][], vie: Via[], { vicino = 3, minimo = 24 } = {}): NomeSulPercorso[] {
  const C = 16, griglia = new Map<string, [number, Punto, Punto][]>();
  vie.forEach((v, q) => {
    for (let i = 1; i < v.punti.length; i++) {
      const a = v.punti[i - 1], b = v.punti[i];
      for (let x = Math.floor((Math.min(a[0], b[0]) - vicino) / C); x <= Math.floor((Math.max(a[0], b[0]) + vicino) / C); x++)
        for (let y = Math.floor((Math.min(a[1], b[1]) - vicino) / C); y <= Math.floor((Math.max(a[1], b[1]) + vicino) / C); y++) {
          const k = `${x},${y}`;
          if (!griglia.has(k)) griglia.set(k, []);
          griglia.get(k)!.push([q, a, b]);
        }
    }
  });
  const via = (p: Punto) => {
    let nome: string | null = null, migliore = vicino;
    for (const [q, a, b] of griglia.get(`${Math.floor(p[0] / C)},${Math.floor(p[1] / C)}`) || []) { const d = distSeg(p, a, b); if (d < migliore) { migliore = d; nome = vie[q].nome; } }
    return nome;
  };
  const migliori = new Map<string, { L: number; punti: Punto[] }>();
  for (const linea of linee) {
    const camp: { p: Punto; nome: string | null }[] = [];
    for (let i = 1; i < linea.length; i++) {
      const a = linea[i - 1], b = linea[i], n = Math.max(1, Math.ceil(dist(a, b) / 2));
      for (let k = i === 1 ? 0 : 1; k <= n; k++) { const p: Punto = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]; camp.push({ p, nome: via(p) }); }
    }
    for (let i = 0; i < camp.length;) {
      const nome = camp[i].nome;
      if (!nome) { i++; continue; }
      let j = i, buco = 0;
      for (let k = i + 1; k < camp.length; k++) { if (camp[k].nome === nome) { j = k; buco = 0; } else if (++buco > 2) break; }
      const tratto = camp.slice(i, j + 1).map(c => c.p);
      let L = 0;
      for (let k = 1; k < tratto.length; k++) L += dist(tratto[k - 1], tratto[k]);
      if (L >= minimo && L > (migliori.get(nome)?.L ?? 0)) migliori.set(nome, { L, punti: tratto });
      i = j + 1;
    }
  }
  return [...migliori].map(([nome, { L, punti }]) => {
    const p = punti[0][0] > punti[punti.length - 1][0] ? [...punti].reverse() : punti;
    return { nome, L, punti: p.filter((_, k) => k % 3 === 0 || k === p.length - 1) };
  });
}
