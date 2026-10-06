// Monta le proposte grafiche della Fase 1: prende un modello (design/home/a.html, b.html), ci mette dentro
// i dati veri (design/home/dati.json, testi, schede, fonti, foto con i crediti) e scrive proposta-a.html e proposta-b.html.
// Le foto entrano nella pagina come data: URI, ridimensionate con sharp (già nel progetto).
// Uso: node design/home/dati.mjs (dopo la build), poi node design/home/genera.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const RADICE = path.join(QUI, '../..');
const require = createRequire(import.meta.url);
const yaml = require(path.join(RADICE, 'node_modules/js-yaml'));
const sharp = require(path.join(RADICE, 'node_modules/sharp'));
const leggi = f => yaml.load(fs.readFileSync(path.join(RADICE, f), 'utf8'));

const D = JSON.parse(fs.readFileSync(path.join(QUI, 'dati.json'), 'utf8'));
const testiTappe = leggi('src/testi/tappe.yaml');
const testiIt = leggi('src/testi/itinerari.yaml');
const testiHome = leggi('src/testi/home.yaml');
const testiLocali = leggi('src/testi/locali.yaml');
const fatti = leggi('src/data/fatti.yaml');
const fonti = leggi('src/data/fonti.yaml');
const foto = leggi('src/data/foto.yaml');

// Testo del sito → HTML semplice: *corsivo*, segni {?id} delle informazioni non confermate tolti (la frase lo dice già)
const html = s => (s ?? '').trim().replace(/\{\?[^}]*\}/g, '').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n+/g, ' ');

const fattoDi = Object.fromEntries(fatti.map(f => [f.id, f]));
const fonteDi = Object.fromEntries(fonti.map(f => [f.id, f]));
const fontiDelTesto = t => [...new Set([...(t?.usa ?? []).flatMap(u => fattoDi[u]?.fonti ?? []), ...(t?.fonti ?? [])])];

const tappe = Object.fromEntries(D.tappe.map(t => [t.id, {
  ...t, zonaNome: D.zone[t.zona], testo: html(testiTappe[t.id]?.testo), fonti: fontiDelTesto(testiTappe[t.id])
}]));
const locali = D.locali.map(l => ({ ...l, zonaNome: D.zone[l.zona], testo: html(testiLocali[l.id]?.testo), fonti: fontiDelTesto(testiLocali[l.id]) }));

const pronti = D.itinerari.map(p => {
  const voci = p.giorni.flatMap(g => g.voci);
  const piedi = voci.filter(v => v.tipo === 'tratto' && !v.mezzi.length);
  return {
    id: p.id, nome: p.nome, testo: html(testiIt[`pronto-${p.id}`]?.testo), fonti: fontiDelTesto(testiIt[`pronto-${p.id}`]),
    giorni: p.giorni, nTappe: voci.filter(v => v.tipo === 'tappa').length,
    minPiedi: piedi.reduce((s, v) => s + v.min, 0), metri: p.giorni.reduce((s, g) => s + g.metri, 0)
  };
});

// Schede «da sapere» per il racconto: frasi già controllate, con la loro fonte
const DA_SAPERE = ['tp-sansevero-prenota', 'tp-duomo-prezzi', 'tp-mann-prezzi', 'tp-borgo-orari', 'tp-echia-orari', 'tp-pedamentina-orari', 'tp-tesoro-durata'];
const schede = Object.fromEntries(DA_SAPERE.map(id => [id, { testo: fattoDi[id].testo, stato: fattoDi[id].stato, fonti: fattoDi[id].fonti }]));

// Solo le fonti di quello che il racconto «Due giorni» mostra: tappe, il locale per pranzo, la presentazione, le schede «da sapere»
const idDue = D.itinerari.find(p => p.id === 'due-giorni').giorni.flatMap(g => g.voci.filter(v => v.tipo === 'tappa').map(v => v.id));
const usate = new Set([...idDue.flatMap(id => tappe[id].fonti), ...locali.filter(l => l.id === 'di-matteo').flatMap(l => l.fonti), ...pronti.find(p => p.id === 'due-giorni').fonti, ...Object.values(schede).flatMap(s => s.fonti)]);
const fontiUsate = Object.fromEntries([...usate].filter(id => fonteDi[id]).map(id => [id, { titolo: fonteDi[id].titolo, editore: fonteDi[id].editore, url: fonteDi[id].url }]));

// Foto: le tappe dei due giorni più qualche foto per l'apertura e le schede
const dueGiorni = D.itinerari.find(p => p.id === 'due-giorni');
const idTappe = dueGiorni.giorni.flatMap(g => g.voci.filter(v => v.tipo === 'tappa').map(v => v.id));
const FOTO_EXTRA = ['tp-vesuvio', 'via-partenope', 'tp-capodimonte', 'tp-pignasecca', 'tp-gaiola', 'tp-san-martino', 'tp-spaccanapoli', 'vista-monte-echia', 'tp-catacombe'];
const idFoto = [...new Set([...idTappe.map(id => tappe[id].foto).filter(Boolean), ...FOTO_EXTRA])];
const GRANDI = new Set(['tp-vesuvio', 'tp-spaccanapoli', 'via-partenope', 'vista-monte-echia']);

const FOTO = {}, crediti = {};
for (const id of idFoto) {
  const f = foto.find(x => x.id === id);
  if (!f) throw new Error(`Foto ${id} non in foto.yaml`);
  const file = path.join(RADICE, 'src/data', f.src);
  const buf = await sharp(file).resize({ width: GRANDI.has(id) ? 1280 : 820, withoutEnlargement: true }).jpeg({ quality: GRANDI.has(id) ? 70 : 66, mozjpeg: true }).toBuffer();
  FOTO[id] = `data:image/jpeg;base64,${buf.toString('base64')}`;
  crediti[id] = { alt: f.alt, didascalia: f.didascalia, autore: f.autore, licenza: f.licenza, fonte: f.fonte };
}

const DATI = {
  aggiornato: '4 ottobre 2026',
  conteggi: { ...D.conteggi, fonti: fonti.length, schede: fatti.length },
  home: { intro: html(testiHome.intro.testo) },
  zone: D.zone, tappe, locali, pronti, schede, fonti: fontiUsate, crediti, martedi: D.martedi
};

const mappa = JSON.parse(fs.readFileSync(path.join(RADICE, 'dist/napoli/itinerari/mappa.json'), 'utf8'));
const sicuro = o => JSON.stringify(o).replace(/</g, '\\u003c');

for (const [modello, uscita] of [['a.html', 'proposta-a.html'], ['b.html', 'proposta-b.html']]) {
  const src = path.join(QUI, modello);
  if (!fs.existsSync(src)) continue;
  const pagina = fs.readFileSync(src, 'utf8').replace('<!--DATI-->',
    `<script>window.DATI=${sicuro(DATI)};window.FOTO=${sicuro(FOTO)};window.MAPPA=${sicuro(mappa)};</script>`);
  fs.writeFileSync(path.join(QUI, uscita), pagina);
  console.log(`${uscita}: ${(pagina.length / 1024 / 1024).toFixed(2)} MB`);
}
