// Monta le proposte del compositore (pezzo 1, pagina e barra: specifiche/compositore.md) con i dati veri.
// Legge il pacco della città dalla build (dist/napoli/itinerari/), rifà il calcolo di «Due giorni a Napoli» con le
// stesse funzioni del sito (src/lib/itinerari/), calcola per ogni giorno la giornata con ciascuna tappa in più (in fondo,
// come fa il compositore), decodifica i percorsi veri per la mappa, mette dentro foto, caratteri, marchio, pietra del portico
// e le strade piccole (strade.json) come data: URI e scrive, nella cartella del giro:
//   proposte.html         la pagina da pubblicare su claude.ai (senza doctype: lo aggiunge claude.ai)
//   proposte-locale.html  la stessa con doctype, per le immagini da telefono
// Uso, dopo `npm run build`: node design/compositore/genera.mjs giro-2
// (il giro 1 è fermo: la sua pagina pubblicata è in giro-1/, con i dati del formato di allora)
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { arcata, VANO, MASCHERA, W as PW, H as PH, CX, YS, R, SOGLIA } from '../../src/lib/portico.mjs';
import { fonteDiNextstop } from '../../src/lib/fonti-nextstop.mjs';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const RADICE = path.join(QUI, '../..');
const GIRO = path.join(QUI, process.argv[2] || 'giro-2');
const require = createRequire(import.meta.url);
const yaml = require(path.join(RADICE, 'node_modules/js-yaml'));
const sharp = require(path.join(RADICE, 'node_modules/sharp'));
const leggiYaml = f => yaml.load(fs.readFileSync(path.join(RADICE, f), 'utf8'));

// ---------- il calcolo del sito ----------
const tmp = path.join(QUI, '.calcolo.mjs');
await build({
  stdin: {
    contents: `export { spacchetta } from './src/lib/itinerari/pacco';
               export { calcolaGiorno } from './src/lib/itinerari/calcolo';
               export { nuovoItinerario, codifica } from './src/lib/itinerari/link';`,
    resolveDir: RADICE, loader: 'ts'
  },
  bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error'
});
const { spacchetta, calcolaGiorno, nuovoItinerario, codifica } = await import(pathToFileURL(tmp).href);
fs.rmSync(tmp);

const DIST = path.join(RADICE, 'dist/napoli/itinerari');
const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const json = id => JSON.parse(new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`).exec(html)[1]);
const pacco = json('it-dati');
const pronti = json('it-pronti');
const C = spacchetta(pacco);
const tappaDi = id => C.tappe.find(t => t.id === id);

// Percorso codificato (stessa regola di src/scripts/itinerari/mappa.ts)
const ALFA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function decodifica(s) {
  return s.split('~').filter(Boolean).map(pezzo => {
    const k = pezzo.indexOf('.');
    const nums = [];
    let z = 0, mul = 1;
    for (const c of pezzo.slice(k + 1)) {
      const v = ALFA.indexOf(c);
      z += (v & 31) * mul;
      if (v & 32) { mul *= 32; continue; }
      nums.push(z % 2 ? -(z + 1) / 2 : z / 2);
      z = 0; mul = 1;
    }
    const punti = [];
    let x = 0, y = 0;
    for (let j = 0; j + 1 < nums.length; j += 2) { x += nums[j]; y += nums[j + 1]; punti.push([x, y]); }
    return { modo: pezzo.slice(0, k), punti };
  });
}
const PERCORSI = JSON.parse(fs.readFileSync(path.join(DIST, 'percorsi.json'), 'utf8'));
const percorso = (s, a, b) => { const x = PERCORSI.scenari[s]?.[a]?.[b]; return typeof x === 'string' ? x : PERCORSI.scenari.feriale[a]?.[b] || ''; };
const d = punti => 'M' + punti.map(p => p.join(' ')).join('L');

// ---------- «Due giorni a Napoli» ----------
const P = pronti.find(p => p.id === 'due-giorni');
const it = nuovoItinerario(P.nome, P.giorni);
const testiTappe = leggiYaml('src/testi/tappe.yaml');
const testiIt = leggiYaml('src/testi/itinerari.yaml');
const pulisci = s => (s ?? '').trim().replace(/\{\?[^}]*\}/g, '').replace(/\*([^*]+)\*/g, '$1').replace(/\s+/g, ' ');
const primaFrase = s => { const t = pulisci(s); const m = /^(.+?[.!?])(\s|$)/.exec(t); return m ? m[1] : t; };

// Una giornata calcolata dal sito, con i percorsi della mappa (una linea per tratto, più quelle dentro le tappe lunghe)
function giornata(x, g) {
  const r = calcolaGiorno(C, x, g);
  const linee = [];
  // ogni linea sa a quale voce della giornata appartiene (v): la mappa le disegna in fila, dalla tappa 1 alla 2, alla 3…
  const voci = r.voci.map((v, iv) => {
    if (v.tipo === 'tratto') {
      const ls = decodifica(percorso(v.scenario, v.da, v.a)).filter(p => p.punti.length > 1).map(p => ({ modo: p.modo === 'p' ? 'piedi' : p.modo, d: d(p.punti), v: iv }));
      linee.push(...ls);
      return { tipo: 'tratto', min: v.min, metri: v.metri, mezzi: v.mezzi.map(m => C.linee?.[m] ?? m) };
    }
    const t = tappaDi(v.id);
    // dentro la tappa (Pedamentina, Spaccanapoli, Toledo): il percorso a piedi da un capo all'altro
    if (t.pf != null && t.pf >= 0) { const [a, b] = v.indietro ? [t.pf, t.p] : [t.p, t.pf]; for (const p of decodifica(percorso('piedi', a, b))) if (p.punti.length > 1) linee.push({ modo: 'piedi', d: d(p.punti), dentro: true, v: iv }); }
    return { tipo: 'tappa', id: v.id, n: v.n, inizio: v.inizio, fine: v.fine, xy: v.indietro && t.xyFine ? t.xyFine : t.xy };
  });
  return { inizio: r.inizio, fine: r.fine, fineScelta: x.giorni[g].fine, visite: r.visite, spostamenti: r.spostamenti, metri: r.metri, avvisi: r.avvisi, voci, linee };
}
const giorni = P.giorni.map((_, g) => giornata(it, g));
const nelViaggio = new Set(P.giorni.flatMap(g => g.tappe));

// «Aggiungi»: tutte le tappe in città che non sono già nel viaggio, per ogni giorno messe in fondo e ricalcolate dal sito.
// Si salva solo la differenza (il tratto, la tappa, le linee nuove e i totali): la parte prima resta uguale, lo controllo qui.
const CITTA = C.tappe.filter(t => t.tipo === 'citta' && !t.categoria && !nelViaggio.has(t.id) && t.id !== C.evento?.id);
const aggiunte = giorni.map((base, g) => {
  const out = {};
  for (const t of CITTA) {
    const x = { ...it, giorni: it.giorni.map((G, k) => (k === g ? { ...G, tappe: [...G.tappe, t.id] } : G)) };
    const r = giornata(x, g);
    const prima = JSON.stringify(r.voci.slice(0, base.voci.length));
    if (prima !== JSON.stringify(base.voci) || JSON.stringify(r.linee.slice(0, base.linee.length)) !== JSON.stringify(base.linee)) throw new Error(`Giorno ${g + 1} + ${t.id}: cambia anche la parte prima, va salvata intera`);
    const [tratto, tappa] = r.voci.slice(base.voci.length);
    out[t.id] = { tratto, tappa, linee: r.linee.slice(base.linee.length), fine: r.fine, visite: r.visite, spostamenti: r.spostamenti, metri: r.metri, avvisi: r.avvisi };
  }
  return out;
});
// le più vicine prima: minuti dall'ultima tappa del giorno
const vicine = aggiunte.map(a => Object.keys(a).sort((x, y) => a[x].tratto.min - a[y].tratto.min || x.localeCompare(y)));
const link = `https://nextstop-alpha.vercel.app/napoli/itinerari/#${codifica(it)}`;

const idTappe = [...nelViaggio, ...CITTA.map(t => t.id)];
const tappe = Object.fromEntries(idTappe.map(id => {
  const t = tappaDi(id);
  return [id, {
    id, nome: t.nome, breve: t.breve, zona: C.zone[t.zona] ?? t.zona, durata: t.durata, chiuso: t.chiuso ?? [], ingresso: t.ingresso,
    prenotazione: t.prenotazione, alChiuso: t.alChiuso, gradini: t.gradini ?? null, generi: t.generi ?? [], frase: primaFrase(testiTappe[id]?.testo), xy: t.xy
  }];
}));

// ---------- foto (src/data/foto.yaml): grandi quelle del viaggio, più piccole quelle da aggiungere ----------
const fotoYaml = leggiYaml('src/data/foto.yaml');
const tappeYaml = leggiYaml('src/data/tappe.yaml');
const FOTO_TAPPA = Object.fromEntries(tappeYaml.filter(t => idTappe.includes(t.id) && t.foto).map(t => [t.id, t.foto]));
FOTO_TAPPA['monte-echia'] ??= 'vista-monte-echia';
FOTO_TAPPA['lungomare'] ??= 'via-partenope';
const FOTO = {}, crediti = {};
for (const [id, fid] of Object.entries(FOTO_TAPPA)) {
  const f = fotoYaml.find(x => x.id === fid);
  if (!f) throw new Error(`Foto ${fid} non in foto.yaml`);
  const larghezza = id === 'monte-echia' ? 1600 : nelViaggio.has(id) ? 960 : 560;
  const buf = await sharp(path.join(RADICE, 'src/data', f.src)).resize({ width: larghezza, withoutEnlargement: true }).jpeg({ quality: nelViaggio.has(id) ? 66 : 60, mozjpeg: true }).toBuffer();
  FOTO[id] = `data:image/jpeg;base64,${buf.toString('base64')}`;
  crediti[id] = { autore: f.autore, licenza: f.licenza };
}

// ---------- caratteri del sito (public/fonts, licenza OFL) ----------
const font = f => `data:font/woff2;base64,${fs.readFileSync(path.join(RADICE, 'public/fonts', f)).toString('base64')}`;
const FONT = { archivo: font('archivo-var.woff2'), bodoni: font('bodoni-moda-600.woff2'), bodoniCorsivo: font('bodoni-moda-500-corsivo.woff2') };

// ---------- mappa di base (OpenStreetMap, ODbL) e strade piccole della zona (strade.json) ----------
const MAPPA = JSON.parse(fs.readFileSync(path.join(DIST, 'mappa.json'), 'utf8'));
const STRADE = JSON.parse(fs.readFileSync(path.join(QUI, 'strade.json'), 'utf8'));

// ---------- il portico di piperno della home (src/lib/portico.mjs, src/assets/pietra/piperno.webp) ----------
const PORTICO = {
  W: PW, H: PH, VANO, MASCHERA,
  // solo la cornice della porta (pilastri e arco a conci, fino alla cornice dell'arco: R + 29, come in portico.mjs), per la proposta E
  ANELLO: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${PW} ${PH}' preserveAspectRatio='none'><path d='M${CX - R - 29} ${PH}V${YS}A${R + 29} ${R + 29} 0 0 1 ${CX + R + 29} ${YS}V${PH}H${CX + R}V${YS}A${R} ${R} 0 0 0 ${CX - R} ${YS}V${PH}Z'/></svg>`)}")`,
  pietra: `data:image/webp;base64,${fs.readFileSync(path.join(RADICE, 'src/assets/pietra/piperno.webp')).toString('base64')}`,
  arcate: Array.from({ length: 10 }, (_, i) => arcata({ id: `p${i}`, seme: i + 1 }))
};

const DATI = {
  nome: P.nome,
  presentazione: pulisci(testiIt['pronto-due-giorni']?.testo),
  altri: pronti.filter(p => !p.evento && p.id !== 'due-giorni').map(p => ({ nome: p.nome, giorni: p.giorni.length, tappe: p.giorni.reduce((s, g) => s + g.tappe.length, 0) })),
  giorni, tappe, crediti, aggiunte, vicine, link,
  // il marchio (design/logo/scelto, src/lib/marchio.mjs): il segno chiaro e scuro, il segnaposto al posto della «o»
  marchio: {
    chiaro: fs.readFileSync(path.join(RADICE, 'design/logo/scelto/segno-chiaro.svg'), 'utf8').replace(/<svg[^>]*>/, '').replace('</svg>', ''),
    scuro: fs.readFileSync(path.join(RADICE, 'design/logo/scelto/segno-scuro.svg'), 'utf8').replace(/<svg[^>]*>/, '').replace('</svg>', ''),
    spillo: '<path d="M10 27.5C10 27.5 1.5 18.2 1.5 10.6A8.5 8.5 0 0 1 18.5 10.6C18.5 18.2 10 27.5 10 27.5Z" style="fill:var(--pin)"/><circle cx="10" cy="10.6" r="3.3" style="fill:var(--pin-buco)"/>'
  }
};

const leggi = f => fs.readFileSync(path.join(GIRO, f), 'utf8');

// ---------- pezzo 3 (la ricerca): anche locali e gite, con i testi in cui cercare ----------
// Se app.js usa RICERCA: tutte le tappe del pacco (in città, gite, locali) entrano in DATI.tappe; ognuna porta le sue
// «frasi»: il testo della tappa o del locale e le schede che usa (con le fonti), dove la prova cerca le parole.
const RICERCA = leggi('app.js').includes('RICERCA');
const localiYaml = leggiYaml('src/data/locali.yaml');
const testiLocali = leggiYaml('src/testi/locali.yaml');
if (RICERCA) {
  for (const t of C.tappe) {
    if (DATI.tappe[t.id] || t.id === C.evento?.id) continue;
    const testi = t.categoria ? testiLocali : testiTappe;
    DATI.tappe[t.id] = {
      id: t.id, nome: t.nome, breve: t.breve, zona: C.zone[t.zona] ?? t.zona, durata: t.durata, chiuso: t.chiuso ?? [], ingresso: t.ingresso,
      prenotazione: t.prenotazione, alChiuso: t.alChiuso, gradini: t.gradini ?? null, generi: t.generi ?? [], frase: primaFrase(testi[t.id]?.testo), xy: t.xy
    };
    const fy = tappeYaml.find(x => x.id === t.id)?.foto;
    if (t.tipo === 'gita' && fy) {
      const f = fotoYaml.find(x => x.id === fy);
      const buf = await sharp(path.join(RADICE, 'src/data', f.src)).resize({ width: 560, withoutEnlargement: true }).jpeg({ quality: 60, mozjpeg: true }).toBuffer();
      FOTO[t.id] = `data:image/jpeg;base64,${buf.toString('base64')}`;
      crediti[t.id] = { autore: f.autore, licenza: f.licenza };
    }
  }
  for (const t of C.tappe) {
    const x = DATI.tappe[t.id];
    if (!x) continue;
    Object.assign(x, { tipo: t.tipo, categoria: t.categoria ?? null, cucina: t.cucina ?? [], piatti: t.piatti ?? [], fascia: t.fascia ?? 0, pasto: t.pasto ?? [], partenza: t.partenza ?? null });
  }
}

// ---------- pezzo 2 (la scheda della tappa): il calcolo vero dentro la pagina, le schede e le fonti ----------
// Se app.js usa CALCOLO, la pagina rifà da sola i giorni (spostare, togliere, «visitato», oggi): le stesse funzioni
// del sito (src/lib/itinerari/), il pacco della città della build e i percorsi tra le tappe in città (giorno feriale).
let CALCOLO_JS = '';
if (leggi('app.js').includes('CALCOLO')) {
  const r = await build({
    stdin: {
      contents: `export { spacchetta } from './src/lib/itinerari/pacco';
                 export { calcolaGiorno, ordinePiuCorto, minuti, orarioLocale, scenarioDi } from './src/lib/itinerari/calcolo';
                 export { nuovoItinerario, codifica } from './src/lib/itinerari/link';`,
      resolveDir: RADICE, loader: 'ts'
    },
    bundle: true, format: 'iife', globalName: 'CALCOLO', platform: 'browser', minify: true, write: false, logLevel: 'error'
  });
  CALCOLO_JS = r.outputFiles[0].text;
  const citta = C.tappe.filter(t => t.tipo === 'citta' && (RICERCA || !t.categoria));
  DATI.pacco = { ...pacco, tappe: pacco.tappe.filter(t => t.tipo === 'citta' && (RICERCA || !t.categoria)).map(t => ({ ...t, foto: undefined })) };
  DATI.pronto = P.giorni;
  // percorsi della mappa tra tutte le tappe in città (feriale) e, a piedi, dentro le tappe lunghe (Spaccanapoli, Toledo…)
  const punti = [...new Set(citta.flatMap(t => [t.p, t.pf].filter(x => x != null && x >= 0)))];
  const perc = { feriale: {}, piedi: {} };
  for (const a of punti) for (const b of punti) { const x = PERCORSI.scenari.feriale[a]?.[b]; if (typeof x === 'string' && x) (perc.feriale[a] ??= {})[b] = x; }
  for (const t of citta) if (t.pf != null && t.pf >= 0) for (const [a, b] of [[t.p, t.pf], [t.pf, t.p]]) { const x = PERCORSI.scenari.piedi[a]?.[b]; if (typeof x === 'string' && x) (perc.piedi[a] ??= {})[b] = x; }
  DATI.percorsi = perc;
  // la scheda vera (src/components/itinerari/Scheda.astro, dalla build): testo, in breve, orari, biglietti, come arrivare;
  // dalla foto della build solo il testo alternativo e il credito
  const fatti = leggiYaml('src/data/fatti.yaml'), fonti = leggiYaml('src/data/fonti.yaml');
  const testo = s => s.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  for (const t of RICERCA ? C.tappe : citta) {
    if (!DATI.tappe[t.id]) continue;
    const a = html.indexOf(`<template id="it-t-${t.id}">`), b = html.indexOf('</template>', a);
    if (a < 0) throw new Error(`Scheda di ${t.id} non trovata nella build`);
    const s = html.slice(a, b);
    const alt = /<img [^>]*alt="([^"]*)"/.exec(s)?.[1];
    const credito = /<span class="foto__cr"[^>]*>([\s\S]*?)<\/span><\/figcaption>/.exec(s)?.[1];
    const corpo = s.replace(/<figure[\s\S]*?<\/figure>/, '');
    const sezioni = [...corpo.matchAll(/<h3 class="it-sch__h">([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p>/g)].map(m => ({ titolo: testo(m[1]), testo: testo(m[2].replace(/<sup[\s\S]*?<\/sup>/g, '')), segno: /cautela/.test(m[2]) }));
    // le fonti: quelle delle schede usate (orari, prezzi, viaggio, testo) e quelle del testo
    const lY = localiYaml.find(x => x.id === t.id);
    const tY = tappeYaml.find(x => x.id === t.id) ?? lY, tT = (lY ? testiLocali : testiTappe)[t.id] ?? {};
    const idFatti = [tY.orari, tY.prezzi, tY.viaggio, tY.perche, tY.rinomatoPer?.scheda, ...(tT.usa ?? [])].filter(Boolean);
    const usati = idFatti.map(id => fatti.find(f => f.id === id)).filter(Boolean);
    // come nel sito (src/lib/fonti-nextstop.mjs): le fonti delle regate non entrano negli elenchi pubblici
    const idFonti = [...new Set([...usati.flatMap(f => f.fonti ?? []), ...(tT.fonti ?? []), tY.durataFonte].filter(Boolean))].filter(fonteDiNextstop);
    DATI.tappe[t.id].scheda = {
      alt: alt ? testo(alt) : '', credito: credito ? testo(credito) : '',
      testo: [...corpo.matchAll(/<div class="testo it-sch__testo">([\s\S]*?)<\/div>/g)].map(m => [...m[1].matchAll(/<p>([\s\S]*?)<\/p>/g)].map(p => testo(p[1]))).flat(),
      breve: testo(/<p class="it-sch__breve">([\s\S]*?)<\/p>/.exec(corpo)?.[1] ?? ''),
      sezioni,
      fonti: idFonti.map(id => fonti.find(f => f.id === id)).filter(Boolean).map(f => ({ titolo: f.titolo, editore: f.editore, url: f.url, tipo: f.tipo })),
      controllato: usati.map(f => f.controllato).filter(Boolean).map(String).sort()[0] ?? null
    };
    // pezzo 3: le frasi dove cercare (il testo e le schede che usa, tranne gli orari), ognuna con chi l'ha scritta (la fonte)
    if (RICERCA) {
      const frasiDi = s => pulisci(s).split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú«"])/).filter(x => x.length > 3);
      const fonteDi = ids => ids.map(id => fonti.find(f => f.id === id)).filter(Boolean).map(f => f.editore)[0] ?? null;
      DATI.tappe[t.id].frasi = [
        ...frasiDi(tT.testo).map(x => ({ t: x, da: fonteDi(tT.fonti ?? []) ?? fonteDi(usati.flatMap(f => f.fonti ?? [])) })),
        ...usati.filter(f => f.id !== tY.orari).flatMap(f => frasiDi(f.testo).map(x => ({ t: x, da: fonteDi(f.fonti ?? []) })))
      ];
    }
    Object.assign(DATI.tappe[t.id], { momento: t.momento, bambini: t.bambini, gradini: t.gradini ?? null, reversibile: t.reversibile, fine: t.fine ?? null });
  }
}

// ---------- pezzo 4 («Da dove parti?»): i punti da cui si parte ----------
// Se app.js usa PARTENZA: stazioni e porti (src/data/luoghi.yaml, coordinate OpenStreetMap), gli alloggi di OpenStreetMap
// (alloggi.json del giro, solo per trovare un punto) e i nomi delle vie della zona (strade.json), tutti nelle unità della mappa.
if (leggi('app.js').includes('PARTENZA')) {
  // la stessa proiezione del sito (src/lib/itinerari/napoli.ts): il riquadro è in src/data/mappa.json
  const BOX = JSON.parse(fs.readFileSync(path.join(RADICE, 'src/data/mappa.json'), 'utf8')).box;
  const KX = MAPPA.w / (BOX.e - BOX.w), KY = MAPPA.h / (BOX.n - BOX.s);
  const XY = (lat, lon) => [+((lon - BOX.w) * KX).toFixed(1), +((BOX.n - lat) * KY).toFixed(1)];
  const dentro = ([x, y]) => x >= 0 && y >= 0 && x <= MAPPA.w && y <= MAPPA.h;
  const luoghi = leggiYaml('src/data/luoghi.yaml');
  const SCELTE = [['napoli-centrale', 'Napoli Centrale', 'piazza Garibaldi'], ['molo-beverello', 'Molo Beverello', 'aliscafi e traghetti'], ['montesanto', 'Montesanto', 'Cumana, Circumflegrea, Linea 2'], ['mergellina-l2', 'Mergellina', 'stazione dei treni']];
  const stazioni = SCELTE.map(([id, nome, sotto]) => { const l = luoghi.find(x => x.id === id); if (!l) throw new Error(`${id} non in luoghi.yaml`); return { id, nome, sotto, tipo: l.tipo, xy: XY(l.lat, l.lon) }; });
  const A = JSON.parse(leggi('alloggi.json'));
  const alloggi = A.voci.map(([nome, tipo, lat, lon, via]) => ({ nome, tipo, via, xy: XY(lat, lon) })).filter(a => dentro(a.xy));
  // una via: il punto a metà della linea del nome (strade.json, solo la zona dei due giorni in questa prova)
  const meta = d => { const p = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number), q = []; for (let i = 0; i + 1 < p.length; i += 2) q.push([p[i], p[i + 1]]); let L = 0; const s = q.slice(1).map((b, i) => { const l = Math.hypot(b[0] - q[i][0], b[1] - q[i][1]); L += l; return l; }); let r = L / 2; for (let i = 0; i < s.length; i++) { if (r <= s[i]) { const k = r / (s[i] || 1); return [+(q[i][0] + (q[i + 1][0] - q[i][0]) * k).toFixed(1), +(q[i][1] + (q[i + 1][1] - q[i][1]) * k).toFixed(1)]; } r -= s[i]; } return q[0]; };
  const vie = [...new Map(STRADE.etichette.map(e => [e.nome, { nome: e.nome, xy: meta(e.d) }])).values()];
  DATI.partenza = { stazioni, alloggi, vie, fonteAlloggi: A.fonte, metriUnita: +((BOX.e - BOX.w) * 111320 * Math.cos((BOX.n + BOX.s) / 2 * Math.PI / 180) / MAPPA.w).toFixed(3) };
}

// ---------- pezzo 6 (prova, mappa-giro-1): l'indice dei pezzi della mappa, il loro peso compresso e i nomi delle vie principali ----------
// I pezzi restano file a parte (pezzi-256/*.json, pubblicati accanto alla pagina): la pagina li scarica solo dove si guarda.
let PEZZI = null;
if (fs.existsSync(path.join(GIRO, 'pezzi-256/indice.json'))) {
  const zlib = await import('node:zlib');
  const I = JSON.parse(leggi('pezzi-256/indice.json'));
  const pesi = Object.fromEntries(I.pezzi.map(k => [k, zlib.brotliCompressSync(leggi(`pezzi-256/${k}.json`)).length]));
  PEZZI = { ...I, pesi, principali: JSON.parse(leggi('pezzi-256/nomi-principali.json')) };
}

const sicuro = o => JSON.stringify(o).replace(/</g, '\\u003c');
// sostituzioni con una funzione: nel codice ci sono «$» che replace() altrimenti interpreta
const pagina = leggi('modello.html')
  .replace('/*FONT*/', () => `@font-face{font-family:"Archivo";src:url(${FONT.archivo}) format("woff2");font-weight:100 900;font-stretch:62% 125%;font-display:swap}
@font-face{font-family:"Bodoni Moda";src:url(${FONT.bodoni}) format("woff2");font-weight:600;font-display:swap}
@font-face{font-family:"Bodoni Moda";src:url(${FONT.bodoniCorsivo}) format("woff2");font-weight:500;font-style:italic;font-display:swap}`)
  .replace('/*STILE*/', () => leggi('stile.css') + (fs.existsSync(path.join(GIRO, 'pezzo2.css')) ? `\n${leggi('pezzo2.css')}` : '') + (fs.existsSync(path.join(GIRO, 'ricerca.css')) ? `\n${leggi('ricerca.css')}` : '') + (fs.existsSync(path.join(GIRO, 'partenza.css')) ? `\n${leggi('partenza.css')}` : '') + (fs.existsSync(path.join(GIRO, 'mangiare.css')) ? `\n${leggi('mangiare.css')}` : ''))
  .replace('/*APP*/', () => leggi('app.js'))
  .replace('<!--DATI-->', () => `<script>window.DATI=${sicuro(DATI)};window.FOTO=${sicuro(FOTO)};window.MAPPA=${sicuro(MAPPA)};window.STRADE=${sicuro(STRADE)};${PEZZI ? `window.PEZZI=${sicuro(PEZZI)};` : ''}${leggi('app.js').includes('PORTICO') ? `window.PORTICO=${sicuro(PORTICO)};` : ''}</script>${CALCOLO_JS ? `<script>${CALCOLO_JS.replace(/<\/script/gi, '<\\/script')}</script>` : ''}`);
fs.writeFileSync(path.join(GIRO, 'proposte.html'), pagina);
fs.writeFileSync(path.join(GIRO, 'proposte-locale.html'), `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>${pagina}</body></html>`);
console.log(`${path.basename(GIRO)}/proposte.html: ${(pagina.length / 1024 / 1024).toFixed(2)} MB · tappe da aggiungere ${CITTA.length} · foto ${Object.keys(FOTO).length} · dati ${(sicuro(DATI).length / 1024).toFixed(0)} KB`);
