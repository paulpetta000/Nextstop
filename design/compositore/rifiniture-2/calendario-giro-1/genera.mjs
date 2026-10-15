// Tranche 2, pezzo 1 (calendario) e pezzo 5 (barre di scorrimento), giro 1: mette dati veri, caratteri e sfondi dentro
// modello.html (+ stile.css, app.js) e scrive proposte.html, la pagina da pubblicare. Solo Node e js-yaml del progetto.
// Uso: node design/compositore/rifiniture-2/calendario-giro-1/genera.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const RADICE = path.resolve(QUI, '../../../..');
const yaml = createRequire(import.meta.url)(path.join(RADICE, 'node_modules/js-yaml'));
const leggi = f => yaml.load(fs.readFileSync(path.join(RADICE, f), 'utf8'));

// le stesse zone di src/lib/tappe.ts
const ZONE = { 'centro-storico': 'Centro storico', 'toledo-plebiscito': 'Toledo e Plebiscito', lungomare: 'Lungomare e Santa Lucia', vomero: 'Vomero', 'sanita-capodimonte': 'Sanità e Capodimonte', 'posillipo-bagnoli': 'Posillipo e Bagnoli' };
const tappe = Object.fromEntries(leggi('src/data/tappe.yaml').map(t => [t.id, t]));
const nome = id => tappe[id].breve ?? tappe[id].nome;
const pronti = leggi('src/data/itinerari-pronti.yaml');

// per ogni giorno di un pronto: i giorni della settimana in cui una sua tappa è chiusa (campo «chiuso» di tappe.yaml)
const itinerari = {};
for (const id of ['due-giorni', 'tre-giorni']) {
  const p = pronti.find(x => x.id === id);
  itinerari[id] = {
    nome: p.nome,
    giorni: p.giorni.map(g => {
      const chiusi = {};
      for (const t of g.tappe) for (const s of tappe[t].chiuso ?? []) (chiusi[s] ??= []).push(nome(t));
      return { inizio: g.inizio, fine: g.fine, chiusi };
    })
  };
}
// per la prova delle barre: le tappe in città, come nel foglio «Aggiungi una tappa»
const elenco = Object.values(tappe).filter(t => t.tipo === 'citta').map(t => ({ n: t.nome, z: ZONE[t.zona] ?? '', d: t.durata }));
const DATI = { itinerari, elenco };

const b64 = f => fs.readFileSync(f).toString('base64');
const font = (fam, file, extra) => `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${b64(path.join(RADICE, 'public/fonts', file))}) format('woff2');font-display:swap;${extra}}`;
const caratteri = [
  font('Archivo', 'archivo-var.woff2', 'font-weight:400 900;font-stretch:62% 125%;'),
  font('Bodoni Moda', 'bodoni-moda-600.woff2', 'font-weight:600;'),
  font('Bodoni Moda', 'bodoni-moda-500-corsivo.woff2', 'font-weight:500;font-style:italic;')
].join('\n');
const sfondi = Object.fromEntries(fs.readdirSync(path.join(QUI, 'sfondi')).map(f => [f.replace('.jpg', ''), `data:image/jpeg;base64,${b64(path.join(QUI, 'sfondi', f))}`]));

let html = fs.readFileSync(path.join(QUI, 'modello.html'), 'utf8');
html = html
  .replace('/*CARATTERI*/', () => caratteri)
  .replace('/*STILE*/', () => fs.readFileSync(path.join(QUI, 'stile.css'), 'utf8'))
  .replace('/*APP*/', () => fs.readFileSync(path.join(QUI, 'app.js'), 'utf8')
    .replace('/*DATI*/null', () => JSON.stringify(DATI))
    .replace('/*SFONDI*/null', () => JSON.stringify(sfondi)));
fs.writeFileSync(path.join(QUI, 'proposte.html'), html);
console.log(`proposte.html: ${(html.length / 1024).toFixed(0)} KB, ${elenco.length} tappe, ${Object.keys(sfondi).length} sfondi`);
