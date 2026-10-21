// Decoder condiviso da build e mappa: nessuna dipendenza dal browser o da Node.
const ALFA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
/** @param {unknown} s @returns {{modo: string; punti: [number, number][]}[]} */
export function decodificaPercorso(s) {
  if (typeof s !== 'string') return [];
  const out = [];
  for (const pezzo of s.split('~').filter(Boolean)) {
    const k = pezzo.indexOf('.');
    if (k < 1) return [];
    const nums = [];
    let z = 0, mul = 1;
    for (const c of pezzo.slice(k + 1)) {
      const v = ALFA.indexOf(c);
      if (v < 0) return [];
      z += (v & 31) * mul;
      if (!Number.isSafeInteger(z)) return [];
      if (v & 32) { mul *= 32; if (!Number.isSafeInteger(mul)) return []; continue; }
      nums.push(z % 2 ? -(z + 1) / 2 : z / 2);
      z = 0; mul = 1;
    }
    // Un numero troncato o una coppia incompleta non lascia disegnare metà del percorso.
    if (mul !== 1 || nums.length % 2) return [];
    /** @type {[number, number][]} */
    const punti = [];
    let x = 0, y = 0;
    for (let j = 0; j < nums.length; j += 2) {
      x += nums[j]; y += nums[j + 1];
      if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) return [];
      punti.push([x, y]);
    }
    out.push({ modo: pezzo.slice(0, k), punti });
  }
  return out;
}
