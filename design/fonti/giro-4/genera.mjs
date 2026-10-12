import fs from 'node:fs';
import { esempi, lungo, normalize, ordina } from './contenuti.mjs';
const write = (name, value) => fs.writeFileSync(new URL(name, import.meta.url), value + '\n');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const slug = s => normalize(s).replaceAll(' ', '-');
const date = s => new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(s));
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const chevron = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const head = title => `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} · Nextstop</title><link rel="icon" href="/favicon.svg"><link rel="preload" href="/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/bodoni-moda-600.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="prototipi.css"><script src="prototipi.js" defer></script></head>`;
const header = '<a class="skip" href="#contenuto">Vai al contenuto</a><header class="lab-header"><div class="wrap"><a class="brand" href="d.html"><img src="/favicon.svg" alt="" width="40" height="40">nextstop<span class="sr"> · Proposta D</span></a><div class="lab-tools"><a class="lab-home" href="../giro-3/d-lungo.html">Vedi il giro precedente</a><button class="theme-button" data-theme-button disabled><span>Usa tema scuro</span></button></div></div></header>';
const essential = '<div class="essential"><p id="segno"><strong>*</strong> Un asterisco segnala un’informazione da leggere con cautela. Il motivo è nella frase.</p><p>I tempi sono stime. Prima di prenotare o partire, controlla le informazioni del gestore per il giorno scelto.</p></div>';
const foot = '<footer class="lab-footer"><div class="wrap"><p>D rifinita · Prototipo locale, in attesa della valutazione.</p></div></footer>';
const scenarios = [['esempi', '12 esempi reali', esempi], ['lungo', '180 fonti', lungo], ['breve', '1 fonte', [esempi.find(s => s.id === 'tp-catacombe-sangennaro')]], ['vuoto', 'Nessuna fonte', []]];
const filename = scenario => `d${scenario === 'esempi' ? '' : '-' + scenario}.html`;
function source(s) {
  const id = slug(s.id);
  const context = s.luoghi.length > 1 ? `${s.luoghi.slice(0, 2).join(' e ')}${s.luoghi.length > 2 ? ` e altri ${s.luoghi.length - 2} luoghi` : ''}` : '';
  const words = normalize([s.titolo, s.editore, s.gruppo, s.descrizione, ...s.luoghi, ...s.parole].join(' '));
  return `<li class="source" id="fonte-${id}" data-source-id="${esc(s.id)}" data-search="${esc(words)}" data-places="${esc(JSON.stringify(s.luoghi))}">
${context ? `<p class="source-context" data-context="${esc(context)}">${esc(context)}</p>` : ''}
${s.descrizione ? `<p class="purpose">${esc(s.descrizione)}</p>` : ''}
${s.avviso ? `<p class="limit" id="limite-${id}">${esc(s.avviso)}</p>` : ''}
<a class="source-link" href="${esc(s.url)}"${s.avviso ? ` aria-describedby="limite-${id}"` : ''}${s.titoloBreve ? ` data-short-title="${esc(s.titoloBreve)}"` : ''}><span class="link-title">${esc(s.titolo)}</span>${s.formato ? `<span class="format">${esc(s.formato)}</span>` : ''}${arrow}</a>
${s.titoloBreve ? `<button type="button" class="title-button" data-full-title hidden aria-expanded="false" aria-controls="titolo-${id}">Leggi il titolo completo</button><p class="original-title" id="titolo-${id}" hidden>${esc(s.titoloOriginale)}</p>` : ''}
<p class="meta"><span class="publisher">${esc(s.editore)}</span>${s.lingua ? `<span class="language">${esc(s.lingua)}</span>` : ''}<span class="check-date">${esc(s.dataLabel)}: <time datetime="${s.data}">${date(s.data)}</time></span></p>
${s.nota ? `<p class="source-note">${esc(s.nota)}</p>` : ''}</li>`;
}
function panel(list, scenario) {
  if (!list.length) return essential + '<p class="empty-note">Nessuna fonte pertinente in questo caso.</p>';
  const grouped = [...Map.groupBy(ordina(list), s => s.gruppo)];
  const searchable = list.length > 5;
  const tools = searchable ? `<div class="search-tools" hidden><label for="cerca-fonti">Cerca nelle fonti</label><input id="cerca-fonti" type="search" placeholder="Luogo, informazione o editore" autocomplete="off" spellcheck="false" aria-describedby="search-status"></div><div class="access-rail"${scenario === 'lungo' ? ' data-long-list' : ''} hidden><p id="search-status" class="search-status" role="status" aria-atomic="true">${list.length} fonti</p><button type="button" class="context-action" data-context-action hidden>Mostra tutte</button></div><p class="no-results" hidden>Nessuna fonte trovata. Prova un altro nome o usa «Mostra tutte».</p>` : '';
  const groups = grouped.map(([name, items]) => `<section class="group" id="gruppo-${slug(name)}" aria-labelledby="h-${slug(name)}"><div class="group-head"><h3 id="h-${slug(name)}">${esc(name)}</h3>${items.length > 1 ? `<span class="group-count" data-group-count>${items.length} fonti</span>` : ''}</div><ul class="source-list">${items.map(source).join('')}</ul></section>`).join('');
  return `<section class="fonti variant-d" aria-labelledby="fonti-title"><h2 class="sr" id="fonti-title">Fonti di questa pagina</h2>${essential}<details class="disclosure" id="fonti-inizio"><summary><span class="summary-title">Fonti di questa pagina</span><span class="count">${list.length} ${list.length === 1 ? 'fonte' : 'fonti'}</span><span class="open-icon">${chevron}</span></summary><div class="body">${tools}<p class="scope">Tappe, locali e spostamenti disponibili nella pagina.</p><div class="notebook">${groups}</div><div class="method"><a href="/fonti/">Come scegliamo e controlliamo le fonti ${arrow}</a><p>Il controllo non indica la validità odierna. Per aprire i documenti esterni serve una connessione.</p><a class="back-top" href="${searchable ? '#cerca-fonti' : '#fonti-inizio'}">${searchable ? 'Torna alla ricerca' : 'Torna all’inizio delle fonti'}</a></div></div></details></section>`;
}
for (const [scenario, name, list] of scenarios) {
  const intro = `<section class="lab-intro"><h1>D · Fogli di viaggio, rifiniti.</h1><p>Un riquadro per ogni luogo. L’informazione essenziale prima, il documento a un clic.</p><nav class="scenario-bar" aria-label="Caso di prova">${scenarios.map(([key, title]) => `<a href="${filename(key)}"${scenario === key ? ' aria-current="page"' : ''}>${title}</a>`).join('')}</nav><p class="lab-note">${scenario === 'lungo' ? 'Caso di volume: tutti i 180 documenti del giro precedente, con le date conservate. Le descrizioni mancanti restano nel resoconto interno.' : 'Esempi reali già documentati. Nessuna nuova data di verifica o aggiornamento delle schede del sito.'}</p></section>`;
  write(filename(scenario), `${head(`D rifinita · ${name}`)}<body class="scenario-${scenario}">${header}<main class="wrap" id="contenuto">${intro}<div class="stage">${panel(list, scenario)}</div></main>${foot}</body></html>`);
}
write('fixture-lungo.json', JSON.stringify(lungo, null, 2));
console.log('D rifinita: quattro casi, contenuti documentati, ID/URL/date conservati.');
