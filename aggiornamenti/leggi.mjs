// Selettore locale di documentazione. Nessuna rete, dipendenza o scrittura.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(dir, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const json = path => JSON.parse(read(path));
const print = value => process.stdout.write(typeof value === 'string' ? value.replace(/\n?$/, '\n') : JSON.stringify(value, null, 2) + '\n');
const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const fail = message => { throw new Error(message); };
const need = args => args.length || fail('Manca un ID o un argomento. Usa aiuto.');
const controls = () => {
  const files = readdirSync(resolve(dir, 'controlli')).filter(f => f.endsWith('.json')).sort();
  const order = json('aggiornamenti/ordine-controlli.json');
  if (order.length !== new Set(order).size || JSON.stringify(order.map(id => `${id}.json`).sort()) !== JSON.stringify(files)) fail('Indice ordine-controlli.json non allineato alle schede.');
  return order.map(id => `${id}.json`).map(f => {
  const c = json(`aggiornamenti/controlli/${f}`);
  if (c.id !== basename(f, '.json')) fail(`ID e nome file discordanti: ${f}`);
  return c;
  });
};
const pick = (items, ids) => ids.map(id => items.find(item => item.id === id) ?? fail(`ID non trovato: ${id}`));
const validDate = value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) fail(`Data non valida: ${value}`);
  return value;
};
const addDays = (date, n) => new Date(Date.parse(validDate(date)) + n * 86400000).toISOString().slice(0, 10);

// Seleziona un blocco dei file YAML applicativi esistenti, senza modificarli.
// Accetta solo la forma della lista usata dal repository; un cambio di formato fallisce esplicitamente.
function yamlBlocks(path, ids) {
  const text = read(path);
  const matches = [...text.matchAll(/^- id:\s*([^\r\n]+)$/gm)];
  if (!matches.length) fail(`Formato elenco non riconosciuto: ${path}`);
  const blocks = matches.map((m, i) => ({
    id: m[1].trim().replace(/^(?:"([^"]+)"|'([^']+)')$/, (_, a, b) => a ?? b),
    text: text.slice(m.index, matches[i + 1]?.index ?? text.length).trimEnd()
  }));
  return pick(blocks, ids).map(block => `# ${path}\n${block.text}`).join('\n\n');
}

function run(command = 'aiuto', args = []) {
  switch (command) {
    case 'aiuto':
      return print('Uso: node aggiornamenti/leggi.mjs <comando> [argomenti]\n' +
        'cerca <nome o categoria> | voce <id…> | canale <id…> | pubblicazione <id…>\n' +
        'fonte <id…> | fatto <id…> | aperte | caso <id> | scadenze [YYYY-MM-DD] [categoria]\n' +
        'guida <titolo o numero sezione> | metadati | pregressi\n' +
        'Sola lettura locale. Nessuna chiamata ai siti o modifica dei dati.');
    case 'cerca': {
      need(args);
      const q = normalize(args.join(' '));
      const found = controls().filter(c => normalize(`${c.id} ${c.nome} ${c.categoria}`).includes(q));
      return print(found.map(c => ({ id: c.id, nome: c.nome, categoria: c.categoria, file: `aggiornamenti/controlli/${c.id}.json` })));
    }
    case 'voce':
      need(args); return print(pick(controls(), args));
    case 'canale':
      need(args); return print(pick(json('aggiornamenti/canali.json'), args));
    case 'pubblicazione':
      need(args); return print(pick(json('aggiornamenti/pubblicazioni.json'), args));
    case 'fonte':
      need(args); return print(yamlBlocks('src/data/fonti.yaml', args));
    case 'fatto':
      need(args); return print(yamlBlocks('src/data/fatti.yaml', args));
    case 'metadati':
      return print(json('aggiornamenti/metadati.json'));
    case 'pregressi':
      return print(json('aggiornamenti/verifiche-pregresse-locali.json'));
    case 'aperte':
      return print(json('da-verificare/indice.json').filter(c => c.stato === 'da_verificare'));
    case 'caso': {
      if (args.length !== 1) fail('Usa caso <id> per leggere una sola scheda.');
      const [item] = pick(json('da-verificare/indice.json'), args);
      if (!/^da-verificare\/casi\/[VL]\d{2}\.md$/.test(item.file)) fail('Percorso del caso non valido.');
      return print(read(item.file));
    }
    case 'guida': {
      need(args);
      const text = read('aggiornamenti/riferimenti/procedura-completa.md');
      const sections = text.split(/(?=^## )/m).filter(s => s.startsWith('## '));
      const q = normalize(args.join(' '));
      const found = sections.filter(s => normalize(s.split('\n')[0]).includes(q));
      if (!found.length) fail('Sezione non trovata. Usa ad esempio guida "4." per i trasporti.');
      return print(found.join('\n'));
    }
    case 'scadenze': {
      if (args.length > 2) fail('Usa scadenze [YYYY-MM-DD] [categoria].');
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
      const date = validDate(args[0] ?? today);
      const category = args[1];
      if (category && !['citta', 'gita', 'locale', 'trasporto'].includes(category)) fail('Categoria non riconosciuta.');
      const pubs = json('aggiornamenti/pubblicazioni.json');
      const due = controls().filter(c => {
        if (category && c.categoria !== category) return false;
        if (c.ultimo_controllo_completo === null) return true;
        const deadlines = [addDays(c.ultimo_controllo_completo, c.frequenza_giorni)];
        if (c.prossimo_controllo) deadlines.push(validDate(c.prossimo_controllo));
        for (const p of pubs.filter(p => c.pubblicazioni_rilevate.includes(p.id))) {
          // Le decorrenze già coperte dall'ultimo confronto non scadono di nuovo ogni volta.
          if (p.valido_dal && p.valido_dal > c.ultimo_controllo_completo) deadlines.push(addDays(p.valido_dal, -c.anticipo_scadenza_giorni));
          if (p.valido_fino && p.valido_fino >= c.ultimo_controllo_completo) deadlines.push(addDays(p.valido_fino, -c.anticipo_scadenza_giorni));
        }
        return deadlines.sort()[0] <= date;
      });
      return print({ data: date, categoria: category ?? 'tutte', totale: due.length, id: due.map(c => c.id), nota: 'Candidati da controllare; leggere scheda, validità dei documenti e nuovi avvisi prima di concludere.' });
    }
    default: fail(`Comando non riconosciuto: ${command}. Usa aiuto.`);
  }
}

try { run(process.argv[2], process.argv.slice(3)); }
catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
