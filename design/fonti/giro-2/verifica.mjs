// Browser temporaneo, nessun dato personale. Verifica l'intero percorso di consultazione.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { esempi, lungo } from './contenuti.mjs';
const require = createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer = require('puppeteer-core');
const dir = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(dir, 'verifiche');
fs.mkdirSync(output, { recursive: true });
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const base = 'http://127.0.0.1:4344/design/fonti/giro-2/';
const rows = [], behavior = [], failures = [], requests = [], tasks = [], measures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
// Copertura e date: controlli che non dipendono dalla nuova impaginazione.
const originali = JSON.parse(fs.readFileSync(new URL('../giro-1/fixture-lungo.json', import.meta.url)));
assert.deepEqual(lungo.map(s => [s.id, s.url, s.data]), originali.map(s => [s.id, s.url, s.data]));
assert.equal(esempi.length, 12);
assert.equal(lungo.find(s => s.id === 'osm').gruppo, 'Mappe e dati');
assert.equal(lungo.find(s => s.id === 'gri-pasta-patate-2024').luoghi.includes('Trattoria da Nennella'), true);
assert.equal(esempi.find(s => s.id === 'bozza-S1').data, '2026-10-12');
assert.match(esempi.find(s => s.id === 'bozza-S1').scopo, /2025/);
assert.match(esempi.find(s => s.id === 'sdg-pintauro-2026').avvertenza, /non prova/);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
const page = await browser.newPage();
page.on('pageerror', e => failures.push(`Console: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') failures.push(`Console: ${m.text()}`); });
await page.setRequestInterception(true);
page.on('request', r => {
  if (new URL(r.url()).hostname === '127.0.0.1' || r.url().startsWith('data:')) r.continue();
  else { requests.push(r.url()); r.abort(); }
});
const measure = () => page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  sources: document.querySelectorAll('[data-source-id]').length,
  unique: new Set([...document.querySelectorAll('[data-source-id]')].map(e => e.dataset.sourceId)).size,
  duplicateIds: [...document.querySelectorAll('[id]')].map(e => e.id).filter((v, i, a) => a.indexOf(v) !== i),
  tapTargets: [...document.querySelectorAll('summary, .source-link, .alphabet a, input, button, .back-top')].filter(e => !e.disabled && e.getClientRects().length && e.getBoundingClientRect().height < 43.9).map(e => e.outerHTML.slice(0, 80)),
  warningsVisible: !!document.querySelector('#segno')?.getClientRects().length,
  primarySize: document.querySelector('.source-link') ? getComputedStyle(document.querySelector('.source-link')).fontSize : null,
  excluded: [...document.querySelectorAll('a[href]')].filter(a => /americascup\.com/.test(a.href)).length
}));
const visibleIds = () => page.$$eval('.source:not([hidden])', items => items.map(s => s.dataset.sourceId));
async function search(query) {
  await page.focus('#cerca-fonti');
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.type('#cerca-fonti', query);
  await page.waitForFunction(() => document.querySelector('[data-reset]').disabled === (document.querySelector('#cerca-fonti').value.length === 0));
  return visibleIds();
}
try {
  for (const key of ['a', 'b', 'c', 'd']) {
    for (const scenario of ['esempi', 'lungo', 'breve', 'vuoto']) {
      const file = `${key}${scenario === 'esempi' ? '' : '-' + scenario}.html`;
      for (const theme of ['light', 'dark']) {
        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'no-preference' }]);
        await page.goto(base + file, { waitUntil: 'networkidle0' });
        await page.evaluate(() => document.fonts.ready);
        check(await page.evaluate(() => !document.querySelector('.disclosure')?.open), `${file}: pannello inizialmente aperto`);
        await page.addScriptTag({ content: axe });
        for (const width of [320, 375, 390, 768, 1280]) {
          await page.setViewport({ width, height: 844, deviceScaleFactor: 1 });
          for (const open of scenario === 'vuoto' ? [false] : [false, true]) {
            await page.evaluate(open => { const d = document.querySelector('.disclosure'); if (d) d.open = open; }, open);
            const m = await measure();
            check(!m.overflow && !m.duplicateIds.length && !m.tapTargets.length && !m.excluded && m.warningsVisible, `${file} ${theme} ${width} ${open}: layout, ID, tocco, esclusioni o avvisi`);
            check(m.sources === m.unique && m.sources === ({ esempi: 12, lungo: 180, breve: 1, vuoto: 0 })[scenario], `${file}: numero o unicità fonti`);
            check(m.primarySize === null || m.primarySize === '17px', `${file}: testo primario ridotto`);
            let violations = null;
            if ([390, 1280].includes(width)) {
              violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
              check(!violations.length, `${file} ${theme} ${width} ${open}: axe ${violations.map(v => v.id).join(', ')}`);
            }
            if (scenario === 'esempi' && [375, 390, 1280].includes(width)) {
              await page.$eval('.open-icon svg', async e => { await Promise.all(e.getAnimations().map(a => a.finished)); });
              await page.$eval('.disclosure', d => window.scrollTo(0, d.getBoundingClientRect().top + scrollY - 16));
              await page.screenshot({ path: path.join(output, `${key}-${width}-${theme}-${open ? 'pannello' : 'chiuso'}.png`) });
            }
            if (['esempi', 'lungo'].includes(scenario) && open && theme === 'light' && [390, 1280].includes(width)) {
              measures.push({ key, scenario, width, ...await page.evaluate(() => {
                const d = document.querySelector('.disclosure'), sources = [...document.querySelectorAll('.source')];
                return { panelHeight: Math.round(d.getBoundingClientRect().height), firstSourceOffset: Math.round(sources[0].getBoundingClientRect().top - d.getBoundingClientRect().top), words: sources.map(s => s.innerText).join(' ').split(/\s+/).filter(Boolean).length, averageRow: Math.round(sources.reduce((n, s) => n + s.getBoundingClientRect().height, 0) / sources.length) };
              }) });
            }
            rows.push({ key, scenario, theme, width, open, ...m, axe: violations });
          }
        }
      }
    }
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(base + key + '.html');
    await page.focus('summary');
    await page.keyboard.press('Enter');
    check(await page.$eval('.disclosure', d => d.open), `${key}: Enter non apre`);
    await page.keyboard.press('Space');
    check(!(await page.$eval('.disclosure', d => d.open)), `${key}: Space non chiude`);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    check(await page.evaluate(() => document.activeElement.tagName === 'INPUT' && getComputedStyle(document.activeElement).outlineStyle !== 'none'), `${key}: focus ricerca non visibile`);
    const cases = [['catacombe durata', 'tp-catacombe-sangennaro'], ['slow food 2025', 'bozza-S1'], ['pintauro', 'sdg-pintauro-2026'], ['eav orari', 'tp-eav-l1-orario'], ['nennella', 'gri-pasta-patate-2024'], ['locanda gesu', 'gri-pasta-patate-2024'], ['donnanna', 'bozza-D2'], ['tufo', 'stripes-tufo-2022']];
    for (const [query, id] of cases) {
      const found = await search(query);
      check(found.includes(id) && found.filter(v => v === id).length === 1, `${key}: compito ${query} fallito`);
      tasks.push({ key, query, expected: id, results: found });
    }
    await search('zzzz-nessun-risultato');
    await page.waitForFunction(() => document.querySelector('[role=status]').textContent.startsWith('0 fonti'));
    check(await page.$eval('.no-results', e => !e.hidden), `${key}: nessun risultato senza recupero`);
    check(await page.evaluate(() => document.activeElement.id === 'cerca-fonti'), `${key}: ricerca sposta il focus`);
    await page.click('[data-reset]');
    check((await visibleIds()).length === 12 && await page.evaluate(() => document.activeElement.id === 'cerca-fonti'), `${key}: reset non ripristina l'elenco o focus`);
    await search('nennella');
    // Frammento diretto a una fonte che il filtro nascondeva: reset e visibilità.
    await page.evaluate(() => { location.hash = 'fonte-tp-catacombe-sangennaro'; });
    await page.waitForFunction(() => document.querySelector('#cerca-fonti').value === '');
    check(await page.$eval('#fonte-tp-catacombe-sangennaro', e => !e.hidden && !!e.getClientRects().length), `${key}: fonte nascosta al cambio frammento`);
    await page.goto(base + key + '.html#fonte-bozza-d2');
    check(await page.$eval('.disclosure', d => d.open), `${key}: frammento non apre il pannello`);
    await page.goto(base + key + '-lungo.html');
    await page.click('summary');
    for (const query of ['nennella', 'locanda gesu']) {
      const found = await search(query);
      check(found.filter(id => id === 'gri-pasta-patate-2024').length === 1, `${key}: fonte condivisa non trovabile nel caso lungo`);
    }
    await search('marechiaro');
    check((await visibleIds()).includes('osm'), `${key}: OSM non trovabile da altro luogo`);
    check(await page.$eval('[data-source-id="osm"] .matched-context', e => !e.hidden && e.textContent.includes('Marechiaro')), `${key}: contesto della fonte condivisa assente`);
    // Accessibilità nello stato filtrato e senza risultati, tema chiaro/scuro.
    for (const theme of ['light', 'dark']) {
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
      await page.addScriptTag({ content: axe });
      for (const query of ['marechiaro', 'zzzznessuna']) {
        await search(query);
        const violations = await page.evaluate(async () => (await axe.run()).violations.map(v => v.id));
        check(!violations.length, `${key} ${theme} ricerca: axe ${violations.join(', ')}`);
        check(!(await measure()).overflow, `${key} ricerca: overflow`);
      }
    }
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(base + key + '.html');
    await page.keyboard.press('Tab');
    check(await page.evaluate(() => document.activeElement.matches('.skip')), `${key}: salta al contenuto assente`);
    await page.focus('summary');
    await page.keyboard.press('Enter');
    check(await page.$eval('.open-icon svg', e => getComputedStyle(e).transitionDuration === '0s'), `${key}: movimento ridotto ignorato`);
    await page.setJavaScriptEnabled(false);
    await page.goto(base + key + '-lungo.html');
    await page.focus('summary');
    await page.keyboard.press('Enter');
    check(await page.$eval('.disclosure', d => d.open) && (await visibleIds()).length === 180, `${key}: senza JS elenco incompleto`);
    check(await page.$eval('.search-tools', t => t.hidden), `${key}: senza JS ricerca inerte visibile`);
    await page.setJavaScriptEnabled(true);
    behavior.push({ key, keyboard: true, searchTasks: cases.length, sharedSources: true, accentsApostrophes: true, noResultsReset: true, fragmentReveal: true, reducedMotion: true, noJSCompleteList: true });
    console.log(`${key.toUpperCase()}: layout, axe e compiti di consultazione completati`);
  }
  // B: salti alfabetici funzionanti anche dopo filtro, nessuna area scorrevole annidata.
  await page.goto(base + 'b-lungo.html');
  await page.click('summary');
  await search('san gennaro');
  const anchor = await page.$eval('.alphabet a:not([hidden])', a => a.getAttribute('href'));
  await page.click('.alphabet a:not([hidden])');
  check(await page.$eval(anchor, e => !e.hidden), 'B: salto alfabetico verso gruppo nascosto');
  check(requests.length === 0, 'Richieste esterne prima del clic');
  // Un solo clic all'originale e ritorno: risposta intercettata, stato fittizio.
  page.removeAllListeners('request');
  let external = 0;
  page.on('request', r => {
    if (new URL(r.url()).hostname === '127.0.0.1') r.continue();
    else { external++; r.respond({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Documento di prova</title><p>Risposta isolata</p>' }); }
  });
  for (const key of ['a', 'b', 'c', 'd']) {
    await page.goto(base + key + '.html');
    await page.click('summary');
    await search('catacombe');
    await page.evaluate(() => localStorage.setItem('nextstop-qa-isolato', 'itinerario-fittizio'));
    const original = await page.$eval('.source:not([hidden]) .source-link', a => ({ href: a.href, target: a.target }));
    const before = external;
    await Promise.all([page.waitForNavigation(), page.click('.source:not([hidden]) .source-link')]);
    check(page.url() === original.href && original.target === '' && external === before + 1, `${key}: accesso non diretto all'originale`);
    await page.goBack({ waitUntil: 'networkidle0' });
    check(await page.evaluate(() => localStorage.getItem('nextstop-qa-isolato') === 'itinerario-fittizio'), `${key}: stato locale alterato`);
    await page.evaluate(() => localStorage.removeItem('nextstop-qa-isolato'));
    behavior.push({ key, directOriginalAndBack: true, fictitiousStoragePreserved: true, externalResponse: 'intercettata, non verifica raggiungibilità' });
  }
  for (const file of ['index.html', 'confronto.html']) for (const theme of ['light', 'dark']) for (const width of [320, 390, 1280]) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await page.setViewport({ width, height: 844 });
    await page.goto(base + file, { waitUntil: 'networkidle0' });
    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(async () => (await axe.run()).violations.map(v => v.id));
    check(!violations.length && !(await measure()).overflow, `${file} ${theme} ${width}: galleria`);
  }
} finally {
  fs.writeFileSync(path.join(output, 'risultati.json'), JSON.stringify({ rows, behavior, tasks, measures, requestsBeforeClick: requests, failures }, null, 2) + '\n');
  await browser.close();
}
console.log(`${rows.length} combinazioni; ${rows.filter(r => r.axe !== null).length + 16 + 12} scansioni axe; ${tasks.length} compiti automatizzati; ${failures.length} problemi.`);
if (failures.length) { console.error([...new Set(failures)].join('\n')); process.exitCode = 1; }
