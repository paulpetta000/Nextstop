// Dati veri per le proposte grafiche della Fase 1 (specifiche/home-e-identita.md).
// Legge il pacco della città dalla build (dist/napoli/itinerari/index.html), rifà il calcolo degli itinerari pronti
// con le stesse funzioni del sito (src/lib/itinerari/calcolo.ts) e scrive design/home/dati.json.
// Uso, dopo `npm run build`: node design/home/dati.mjs
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const RADICE = path.join(QUI, '../..');
const tmp = path.join(QUI, '.calcolo.mjs');

await build({
  stdin: {
    contents: `export { spacchetta } from './src/lib/itinerari/pacco';
               export { calcolaGiorno } from './src/lib/itinerari/calcolo';
               export { nuovoItinerario } from './src/lib/itinerari/link';`,
    resolveDir: RADICE, loader: 'ts'
  },
  bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error'
});
const { spacchetta, calcolaGiorno, nuovoItinerario } = await import(pathToFileURL(tmp).href);
fs.rmSync(tmp);

const html = fs.readFileSync(path.join(RADICE, 'dist/napoli/itinerari/index.html'), 'utf8');
const json = id => JSON.parse(new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`).exec(html)[1]);
const pacco = json('it-dati');
const pronti = json('it-pronti');
const C = spacchetta(pacco);
const tappa = id => C.tappe.find(t => t.id === id);

const itinerari = pronti.filter(p => !p.evento).map(p => {
  const it = nuovoItinerario(p.nome, p.giorni);
  const giorni = p.giorni.map((_, g) => {
    const r = calcolaGiorno(C, it, g);
    return {
      inizio: r.inizio, fine: r.fine, visite: r.visite, spostamenti: r.spostamenti, metri: r.metri,
      avvisi: r.avvisi,
      voci: r.voci.map(v => v.tipo === 'tappa'
        ? { tipo: 'tappa', id: v.id, nome: tappa(v.id)?.nome, inizio: v.inizio, fine: v.fine }
        : { tipo: 'tratto', min: v.min, metri: v.metri, mezzi: v.mezzi.map(m => pacco.linee[m] ?? m), scenario: v.scenario })
    };
  });
  return { id: p.id, nome: p.nome, giorni };
});

// La stessa giornata con una data di martedì: serve a mostrare gli avvisi nel bozzetto del compositore
const p2 = pronti.find(p => p.id === "due-giorni");
const it2 = { ...nuovoItinerario(p2.nome, p2.giorni), data: "2026-10-13" };
const r2 = calcolaGiorno(C, it2, 0);
const martedi = { data: it2.data, avvisi: r2.avvisi, voci: r2.voci.filter(v => v.tipo === "tappa").map(v => ({ id: v.id, chiusa: v.chiusa })) };

const citta = C.tappe.filter(t => !t.categoria);
const locali = C.tappe.filter(t => t.categoria === 'mangiare');
const cucine = {};
for (const l of locali) for (const c of l.cucina ?? []) cucine[c] = (cucine[c] ?? 0) + 1;

const uscita = {
  conteggi: { tappeCitta: citta.filter(t => t.tipo === 'citta').length, gite: citta.filter(t => t.tipo === 'gita').length, locali: locali.length, cucine },
  zone: pacco.zone,
  tappe: citta.map(({ id, nome, breve, tipo, zona, durata, chiuso, ingresso, prenotazione, momento, generi, xy, xyFine, foto }) => ({ id, nome, breve, tipo, zona, durata, chiuso, ingresso, prenotazione, momento, generi, xy, xyFine, foto: foto?.split("/").pop().split(".")[0] })),
  locali: locali.map(({ id, nome, breve, zona, cucina, fascia, piatti, xy }) => ({ id, nome, breve, zona, cucina, fascia, piatti, xy })),
  martedi,
  itinerari
};
fs.writeFileSync(path.join(QUI, 'dati.json'), JSON.stringify(uscita, null, 1));
console.log('Scritto design/home/dati.json:', JSON.stringify(uscita.conteggi), itinerari.map(i => `${i.id} ${i.giorni.length}g`).join(', '));
