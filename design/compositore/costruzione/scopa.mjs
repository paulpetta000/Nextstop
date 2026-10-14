// Porta il CSS del prototipo dentro il sito: ogni selettore sotto .cmp, le classi della radice (html.pc…) restano sulla radice,
// via le regole delle proposte non scelte. Uso: node scopa.mjs out.css in1.css in2.css …
import fs from 'node:fs';
const [out, ...ins] = process.argv.slice(2);
const SCARTA = /\.p[aefg]\b|\.q[234]\b|#prova|#idea|\.idea|\.r1-|\.r3-|\.r--[13]\b|\.sch[234]\b|\.sch[234]__|\.timbro--[13]\b|\.segno-[123]\b|\.cammino|\.riga-sotto|\.riga-pelle|\.riga-aperta|\.ra-|\.sigillo|\.m-bordi|\.bordi-su|\.m-pezzi|\.p-dentro|data-vv="[23]"|\.in-modifica|\.modifica-barra|\.c-modifica|\.d-modifica|\.meno\b|\.d-voce--stretta|\.d-stretta|\.d-maniglia-s|\.d-timbro-b|\.d-altro|\.c-altro|\.c-sigillo|\.d-sigillo|\.menu-t|#menu-tappa|\.scorre\b|\.armata|\.preme\b|\.alzata/;
// SCARTA_ANCHE: un'altra espressione per togliere altre proposte (per esempio quelle del pezzo 7 non scelte)
const ALTRE = process.env.SCARTA_ANCHE ? new RegExp(process.env.SCARTA_ANCHE) : null;
const RADICE = /^(:root|html)([.:[][^\s>+~]*)?|^\.(p[cd]|q1|sch1-su|c-giu-su)\b[^\s>+~]*/;
function selettore(s) {
  s = s.trim();
  if (!s) return null;
  if (SCARTA.test(s) || (ALTRE && ALTRE.test(s))) return null;
  if (s === 'body') return '.cmp';
  if (/^(\*|::selection|:focus-visible|::backdrop)/.test(s)) return `.cmp ${s}`;
  const m = RADICE.exec(s);
  if (m) {
    const testa = m[0], resto = s.slice(testa.length).trim();
    if (testa === ':root' && !resto) return '.cmp';
    if (testa === 'html' && !resto) return '.cmp';
    const r = /^\.(p[cd]|q1|sch1-su|c-giu-su)/.test(testa) ? `html${testa}` : testa;
    if (!resto) return `${r} .cmp`;
    if (/^body\b/.test(resto)) return `${r} .cmp${resto.slice(4)}`;
    return `${r} .cmp ${resto}`;
  }
  if (/^body\b/.test(s)) return `.cmp${s.slice(4)}`;
  return `.cmp ${s}`;
}
// spezza in blocchi di primo livello: { tipo: 'regola'|'at', testa, corpo }
function blocchi(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (css.startsWith('/*', i)) { const j = css.indexOf('*/', i); out.push({ commento: css.slice(i, j + 2) }); i = j + 2; continue; }
    if (i >= css.length) break;
    const a = css.indexOf('{', i), sc = css.indexOf(';', i);
    if (sc >= 0 && (a < 0 || sc < a)) { out.push({ riga: css.slice(i, sc + 1) }); i = sc + 1; continue; }
    let d = 1, j = a + 1;
    while (d && j < css.length) { if (css[j] === '{') d++; else if (css[j] === '}') d--; else if (css.startsWith('/*', j)) { j = css.indexOf('*/', j) + 1; } j++; }
    out.push({ testa: css.slice(i, a).trim(), corpo: css.slice(a + 1, j - 1) });
    i = j;
  }
  return out;
}
const spezzaVirgole = t => { const o = []; let d = 0, s = ''; for (const c of t) { if (c === '(' || c === '[') d++; if (c === ')' || c === ']') d--; if (c === ',' && !d) { o.push(s); s = ''; } else s += c; } o.push(s); return o; };
let tolte = 0, tenute = 0;
function trasforma(css) {
  return blocchi(css).map(b => {
    if (b.commento) return b.commento;
    if (b.riga) return b.riga;
    if (b.testa.startsWith('@keyframes') || b.testa.startsWith('@font-face')) return `${b.testa} {${b.corpo}}`;
    if (b.testa.startsWith('@')) { const dentro = trasforma(b.corpo).trim(); return dentro ? `${b.testa} {\n${dentro}\n}` : ''; }
    const sel = spezzaVirgole(b.testa).map(selettore).filter(Boolean);
    if (!sel.length) { tolte++; return ''; }
    tenute++;
    return `${sel.join(', ')} {${b.corpo}}`;
  }).filter(Boolean).join('\n');
}
const testo = ins.map(f => `/* ===== ${f.split(/[\\/]/).pop()} ===== */\n` + trasforma(fs.readFileSync(f, 'utf8'))).join('\n');
fs.writeFileSync(out, testo);
console.log(`regole tenute ${tenute}, tolte ${tolte}, ${(testo.length / 1024).toFixed(0)} KB`);
