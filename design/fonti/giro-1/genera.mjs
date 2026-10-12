// Generatore autonomo dei bozzetti. Non scrive in src/, public/ o dist/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import yaml from 'js-yaml';
import { fontiDiNextstop } from '../../../src/lib/fonti-nextstop.mjs';
import { esempi } from './esempi.mjs';

const cartella = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(cartella, '../../..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const load = p => yaml.load(read(p));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const date = s => new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(s));
const iso = d => new Date(d).toISOString().slice(0, 10);
const write = (file, content) => fs.writeFileSync(path.join(cartella, file), content + '\n');
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const chevron = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const groups = (items, field) => [...Map.groupBy(items, s => s[field])];
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const sources = fontiDiNextstop(load('src/data/fonti.yaml'));
if (sources.length !== 195) throw new Error('Il registro pubblico non ha più le 195 fonti del blocco autorizzato.');

// Il caso lungo riproduce esattamente gli URL del footer attuale costruito.
// Non corregge la copertura delle durate, che è un lavoro del Blocco 5.
const footer = read('dist/napoli/itinerari/index.html').match(/<section class="section fonti-pagina"[\s\S]*?<\/section>/)?.[0];
if (!footer) throw new Error('Esegui prima npm run build: manca il footer costruito degli itinerari.');
const urls = new Set([...footer.matchAll(/href="(https?:[^\"]+)"/g)].map(m => m[1].replaceAll('&amp;', '&')));
const facts = new Map(load('src/data/fatti.yaml').map(f => [f.id, f]));
const contexts = new Map();
const roles = { orari: 'orari', prezzi: 'biglietti o prezzi', viaggio: 'spostamenti', perche: 'storia e riconoscimenti', rinomatoPer: 'giudizi gastronomici', testo: 'contenuto della pagina' };
const add = (id, name, role) => {
  if (!contexts.has(id)) contexts.set(id, new Set());
  contexts.get(id).add(`${name} (${roles[role]})`);
};
for (const [file, texts, fields] of [
  ['src/data/tappe.yaml', 'src/testi/tappe.yaml', ['orari', 'prezzi', 'viaggio']],
  ['src/data/locali.yaml', 'src/testi/locali.yaml', ['orari', 'prezzi', 'perche', 'rinomatoPer']]
]) {
  const blocks = load(texts);
  for (const place of load(file)) {
    for (const field of fields) for (const source of facts.get(place[field])?.fonti ?? []) add(source, place.nome, field);
    for (const id of blocks[place.id]?.usa ?? []) for (const source of facts.get(id)?.fonti ?? []) add(source, place.nome, 'testo');
    for (const id of blocks[place.id]?.fonti ?? []) add(id, place.nome, 'testo');
  }
}
const long = sources.filter(s => urls.has(s.url)).map(s => {
  const declared = [...(contexts.get(s.id) ?? [])].sort((a, b) => a.localeCompare(b, 'it'));
  const place = declared[0]?.replace(/ \([^)]*\)$/, '') ?? 'Spostamenti e dati';
  return {
    ...s, gruppo: place,
    area: s.id.startsWith('lc-') || /sdg-|gri-|napolitan-|stripes-/.test(s.id) ? 'Locali e cucina' : declared.length ? 'Luoghi e visite' : 'Spostamenti e dati',
    data: iso(s.controllato), controllo: 'Controllo registrato',
    formato: /\.zip(?:$|\?)/i.test(s.url) ? 'Download ZIP' : /\.pdf(?:$|\?)|\(PDF\)/i.test(s.url + s.titolo) ? 'PDF' : '',
    documenta: 'Relazione con le informazioni da verificare sul documento originale.',
    nota: declared.length ? `Collegata alle informazioni su: ${declared.join('; ')}. Associazione da verificare sul documento originale.` : 'Informazioni generali degli itinerari: relazione con il documento da completare.',
    limite: s.letta === false ? 'Documento non consultato integralmente secondo il registro. Nessuna nuova conferma in questo caso di prova.' : '',
    prova: s.id
  };
});
if (long.length !== 180) throw new Error(`Attese 180 fonti degli itinerari, trovate ${long.length}.`);
for (const list of [esempi, long]) {
  if (new Set(list.map(s => s.id)).size !== list.length) throw new Error('Fonte ripetuta nella fixture.');
  if (list.some(s => /americascup\.com/.test(s.url))) throw new Error('Documento escluso dal registro pubblico.');
}

const alternatives = {
  a: { nome: 'Margine di rivista', descrizione: 'Una lista editoriale con il luogo a margine. Leggera in chiusura, leggibile anche con pochi documenti.', differenza: 'Il titolo del documento guida la lettura; gli argomenti dividono l’elenco.' },
  b: { nome: 'Indice dei luoghi', descrizione: 'Un indice porta subito al luogo cercato. Su desktop affianca l’elenco; sul telefono si raccoglie sopra.', differenza: 'La scelta più pratica per gli itinerari, con molte tappe e fonti condivise.' },
  c: { nome: 'Dall’informazione alla prova', descrizione: 'Prima ciò che vuoi verificare, accanto il documento che lo sostiene. Sul telefono le colonne si impilano.', differenza: 'La relazione «Documenta» è protagonista; i limiti restano accanto alla prova.' },
  d: { nome: 'Quaderno di viaggio', descrizione: 'Un foglio per ogni luogo, con i documenti già visibili. Due colonne su desktop, una sul telefono.', differenza: 'Più spazio e carattere editoriale; gli elenchi lunghi occupano più pagina.' }
};
const pageName = (key, scenario) => `${key}${scenario === 'esempi' ? '' : `-${scenario}`}.html`;
const head = title => `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)} · Nextstop</title><link rel="icon" href="/favicon.svg"><link rel="preload" href="/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/bodoni-moda-600.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="prototipi.css"><script src="prototipi.js" defer></script></head>`;
const header = () => `<a class="skip" href="#contenuto">Vai al contenuto</a><header class="lab-header"><div class="wrap"><a class="brand" href="index.html"><img src="/favicon.svg" alt="" width="40" height="40">nextstop<span class="sr"> · Proposte delle fonti</span></a><div class="lab-tools"><a class="lab-home" href="index.html">Confronta le proposte</a><button class="theme-button" data-theme-button disabled><span>Usa tema scuro</span></button></div></div></header>`;
const foot = () => '<footer class="lab-footer"><div class="wrap"><p>Prototipi locali del blocco fonti · 12 ottobre 2026 · Nessuna integrazione nelle pagine del sito.</p></div></footer>';
const link = s => `<a class="source-link" href="${esc(s.url)}" rel="noopener"><span>${esc(s.titolo)}${s.formato ? ` <span class="format">${esc(s.formato)}</span>` : ''}</span>${arrow}</a>`;
const publisher = s => `<p class="publisher">${esc(s.editore)}</p>`;
const claim = s => `<p class="claim"><b>Documenta: </b>${esc(s.documenta)}</p>`;
const metadata = s => `<p class="meta">${esc(s.controllo)}: <time datetime="${s.data}">${date(s.data)}</time></p>${s.limite ? `<p class="limit">${esc(s.limite)}</p>` : ''}${s.nota ? `<p class="source-note">${esc(s.nota)}</p>` : ''}`;
const source = (s, key) => `<li class="source" data-source-id="${esc(s.id)}">${key === 'a' ? `<div class="source-place">${esc(s.gruppo)}</div>` : ''}${key === 'c' ? `<div><p class="source-place">${esc(s.gruppo)}</p>${claim(s)}</div><div>${link(s)}${publisher(s)}${metadata(s)}</div>` : `<div>${link(s)}${publisher(s)}${claim(s)}${metadata(s)}</div>`}</li>`;
function panel(key, list, scenario) {
  const essential = '<div class="essential"><p id="segno"><strong>*</strong> Un asterisco segnala un’informazione da leggere con cautela. Il motivo è spiegato nella frase.</p><p>I tempi sono stime. Prima di prenotare o partire, controlla il documento del gestore per il giorno che hai scelto.</p></div>';
  if (!list.length) return essential + '<p class="empty-note">In questo caso non ci sono fonti pertinenti: nessun pannello.</p>';
  const field = key === 'b' || key === 'd' ? 'gruppo' : 'area';
  const grouped = groups(list, field);
  const toc = grouped.length > 1 ? `<nav class="toc" aria-label="Indice delle fonti${field === 'gruppo' ? ' per luogo' : ' per argomento'}"${scenario === 'lungo' ? ' tabindex="0"' : ''}>${grouped.map(([name]) => `<a href="#gruppo-${slug(name)}">${esc(name)}</a>`).join('')}</nav>` : '';
  const body = grouped.map(([name, items]) => `<${key === 'd' ? 'article' : 'section'} class="group" id="gruppo-${slug(name)}" aria-labelledby="h-${slug(name)}"><div class="group-head"><h3 id="h-${slug(name)}">${esc(name)}</h3><span>${items.length} ${items.length === 1 ? 'fonte' : 'fonti'}</span></div><ul class="source-list">${items.map(s => source(s, key)).join('')}</ul><a class="back-top" href="#fonti-inizio">Torna all’indice delle fonti</a></${key === 'd' ? 'article' : 'section'}>`).join('');
  return `<section class="fonti variant-${key}" aria-labelledby="fonti-title"><h2 class="sr" id="fonti-title">Fonti di questa pagina</h2>${essential}<details class="disclosure" id="fonti-inizio"><summary><span class="summary-copy"><span class="summary-title">Fonti di questa pagina</span><span class="summary-hint">Apri le fonti e consulta i documenti originali.</span></span><span class="count">${list.length} ${list.length === 1 ? 'fonte' : 'fonti'}</span><span class="open-icon">${chevron}</span></summary><div class="body"><p class="scope">Qui trovi le fonti delle tappe, dei locali e degli spostamenti disponibili in questa pagina.</p>${key === 'b' ? `<div class="index-layout">${toc}<div>${body}</div></div>` : `${toc}${key === 'c' ? '<div class="table-labels" aria-hidden="true"><span>Informazione da verificare</span><span>Documento, editore e controllo</span></div>' : ''}<div class="${key === 'd' ? 'notebook' : 'groups'}">${body}</div>`}<div class="method"><a href="/fonti/">Come scegliamo e controlliamo le fonti ${arrow}</a><p>Per aprire i documenti esterni serve una connessione. La data riguarda il controllo indicato, non la validità odierna dell’informazione.</p></div></div></details></section>`;
}
for (const [key, alternative] of Object.entries(alternatives)) {
  for (const [scenario, list] of [['esempi', esempi], ['lungo', long], ['breve', [esempi[3]]], ['vuoto', []]]) {
    const intro = `<section class="lab-intro"><h1>${key.toUpperCase()} · ${alternative.nome}</h1><p>${alternative.descrizione}</p><nav class="variants" aria-label="Alternative grafiche">${Object.entries(alternatives).map(([k]) => `<a href="${pageName(k, scenario)}"${k === key ? ' aria-current="page"' : ''}>${k.toUpperCase()}</a>`).join('')}</nav><nav class="scenario-bar" aria-label="Caso di prova">${[['esempi', '12 esempi reali'], ['lungo', '180 fonti degli itinerari'], ['breve', '1 fonte'], ['vuoto', 'Nessuna fonte']].map(([s, title]) => `<a href="${pageName(key, s)}"${s === scenario ? ' aria-current="page"' : ''}>${title}</a>`).join('')}</nav><p class="lab-note">${scenario === 'lungo' ? 'Caso di volume: i 180 documenti del footer attuale. Date conservate; relazioni dichiarate e verifiche editoriali ancora da completare.' : 'Esempi tratti dalla ricerca approvata e dai registri. I controlli del 12 ottobre sono quelli documentati nel Blocco 2; nessuna scheda è aggiornata da questo prototipo.'}</p></section>`;
    write(pageName(key, scenario), `${head(`${key.toUpperCase()} · ${alternative.nome}`)}<body class="scenario-${scenario}">${header()}<main id="contenuto" class="wrap">${intro}<div class="stage"><div class="context"><p>Fine della pagina degli itinerari. Qui sotto puoi controllare i documenti prima di organizzare la giornata.</p></div>${panel(key, list, scenario)}</div></main>${foot()}</body></html>`);
  }
}
write('index.html', `${head('Quattro proposte per le fonti')}<body>${header()}<main id="contenuto" class="gallery wrap"><h1>Le fonti, a fine viaggio.</h1><p>Quattro modi di chiudere la pagina. Apri una proposta per provare il pannello, cambiare tema e confrontare gli elenchi lunghi.</p><div class="gallery-grid">${Object.entries(alternatives).map(([key, a]) => `<a class="alternative" href="${key}.html"><img src="verifiche/${key}-390-light-aperto.png" alt="Anteprima da telefono di ${esc(a.nome)}" width="390" height="844"><div class="alternative-copy"><h2>${key.toUpperCase()} · ${a.nome}</h2><p>${a.descrizione}</p><small>Apri e prova la proposta</small></div></a>`).join('')}</div><aside class="recommendation"><h2>Consiglio B · Indice dei luoghi</h2><p>Negli itinerari cerchi spesso una tappa o un locale. L’indice riduce lo scorrimento senza nascondere ogni documento in un secondo pannello. A è più discreta; C rende più evidente la prova; D dà più spazio a ogni luogo.</p></aside><p class="lab-note">Solo il blocco in fondo alla pagina. La pagina generale /fonti/ sarà progettata nel blocco successivo.</p></main>${foot()}</body></html>`);
write('confronto.html', `${head('Confronto da telefono')}<body>${header()}<main id="contenuto" class="gallery wrap"><h1>Quattro aperture, gli stessi documenti.</h1><div class="board-grid">${Object.entries(alternatives).map(([key, a]) => `<section><h2>${key.toUpperCase()} · ${a.nome}</h2><a href="${key}.html"><img src="verifiche/${key}-390-light-aperto.png" alt="Apri ${esc(a.nome)}" width="390" height="844"></a></section>`).join('')}</div></main>${foot()}</body></html>`);
write('fixture-lungo.json', JSON.stringify(long, null, 2));

const filesIn = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? filesIn(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const hash = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if (process.argv.includes('--registra-base')) {
  const tracked = execFileSync('git', ['ls-files', '-z', '--', 'src', 'public', 'integrations', 'scripts', 'test', 'astro.config.mjs', 'package.json', 'package-lock.json'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const designs = filesIn(path.join(root, 'design')).filter(p => !p.startsWith(path.join(root, 'design/fonti'))).map(p => path.relative(root, p).replaceAll('\\', '/'));
  const output = filesIn(path.join(root, 'dist')).map(p => path.relative(root, p).replaceAll('\\', '/'));
  write('base-conservazione.json', JSON.stringify(Object.fromEntries([...tracked, ...designs, ...output].map(p => [p, hash(path.join(root, p))])), null, 2));
}
if (process.argv.includes('--verifica-base')) {
  const baseline = JSON.parse(fs.readFileSync(path.join(cartella, 'base-conservazione.json')));
  const changed = Object.entries(baseline).filter(([p, h]) => !fs.existsSync(path.join(root, p)) || hash(path.join(root, p)) !== h).map(([p]) => p);
  const counts = Object.keys(baseline).reduce((out, p) => { const type = p.startsWith('design/') ? 'design' : p.startsWith('dist/') ? 'build' : 'input'; out[type] = (out[type] ?? 0) + 1; return out; }, {});
  const report = { counts, identical: Object.keys(baseline).length - changed.length, differences: changed.map(p => ({ path: p, before: baseline[p], after: fs.existsSync(path.join(root, p)) ? hash(path.join(root, p)) : null, modifiedAt: fs.existsSync(path.join(root, p)) ? fs.statSync(path.join(root, p)).mtime.toISOString() : null })) };
  // La route esistente esporta solo questi tre campi; «generato» non viene pubblicato.
  const input = JSON.parse(read('src/data/percorsi-alternativi.json'));
  report.outputMatchesExistingRoute = read('dist/napoli/itinerari/percorsi-alternativi.json') === JSON.stringify({ firma: input.firma, senza: input.senza, candidati: input.candidati });
  write('verifiche/conservazione.json', JSON.stringify(report, null, 2));
  const changedInputs = changed.filter(p => !p.startsWith('design/') && !p.startsWith('dist/'));
  if (changedInputs.length) throw new Error(`Input del sito cambiati: ${changedInputs.join(', ')}`);
  console.log(`Conservazione: ${counts.input} input del sito identici; ${counts.design} file di design precedenti e ${counts.build} output confrontati. ${changed.length} differenze registrate nel resoconto, senza ripristini.`);
}
console.log('Generati A/B/C/D: 12 esempi, 180 documenti, una fonte, zero fonti. Nessun input del sito modificato.');
