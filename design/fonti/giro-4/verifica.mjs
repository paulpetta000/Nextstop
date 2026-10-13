// Verifica funzionale della D rifinita con Chrome temporaneo e dati fittizi.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { esempi, lungo } from './contenuti.mjs';
import { esempi as oldEsempi, lungo as oldLungo } from '../giro-2/contenuti.mjs';
const require = createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer = require('puppeteer-core');
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const dir = path.dirname(fileURLToPath(import.meta.url));
const base = 'http://127.0.0.1:4346/design/fonti/giro-4/';
const rows = [], scans = [], tasks = [], measures = [], behavior = [], failures = [], requests = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const frozen = s => [s.id, s.url, s.data, s.titolo, s.dataLabel];
assert.deepEqual(esempi.map(frozen), oldEsempi.map(frozen));
assert.deepEqual(lungo.map(frozen), oldLungo.map(frozen));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
const page = await browser.newPage();
page.on('pageerror', e => failures.push('Console: ' + e.message));
page.on('console', m => { if (m.type() === 'error') failures.push('Console: ' + m.text()); });
await page.setRequestInterception(true);
page.on('request', r => {
  if (new URL(r.url()).hostname === '127.0.0.1') r.continue();
  else { requests.push(r.url()); r.abort(); }
});
const visibleIds = () => page.$$eval('.source:not([hidden])', items => items.map(s => s.dataset.sourceId));
const layout = () => page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  ids: [...document.querySelectorAll('.source')].map(s => s.dataset.sourceId),
  duplicateIds: [...document.querySelectorAll('[id]')].map(e => e.id).filter((v, i, a) => a.indexOf(v) !== i),
  warningsVisible: !!document.querySelector('#segno').getClientRects().length,
  targets: [...document.querySelectorAll('summary, .source-link, input, button, .back-top')].filter(e => !e.disabled && e.getClientRects().length && e.getBoundingClientRect().height < 43.9).map(e => e.outerHTML.slice(0, 80)),
  primarySize: document.querySelector('.source-link') ? getComputedStyle(document.querySelector('.source-link')).fontSize : null,
  pending: document.querySelector('.pending') !== null || document.querySelector('.fonti')?.textContent.includes('Scopo da verificare'),
  excludedLinks: [...document.querySelectorAll('a[href]')].filter(a => /americascup\.com/.test(a.href)).length
}));
async function axeScan(context) {
  // Ogni navigazione crea un contesto nuovo: garantire lo strumento prima della scansione.
  if (!(await page.evaluate(() => !!window.axe))) await page.addScriptTag({ content: axe });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
  check(!violations.length, context + ': axe ' + violations.map(v => v.id).join(', '));
  scans.push({ context, violations });
}
async function query(text) {
  await page.focus('#cerca-fonti');
  await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.type('#cerca-fonti', text);
  return visibleIds();
}
try {
  for (const [file, count] of [['d.html', 12], ['d-lungo.html', 180], ['d-breve.html', 1], ['d-vuoto.html', 0]]) for (const theme of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.goto(base + file, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    check(await page.evaluate(() => !document.querySelector('.disclosure')?.open), file + ': pannello inizialmente aperto');
    await page.addScriptTag({ content: axe });
    for (const width of [320, 375, 390, 768, 1280]) {
      await page.setViewport({ width, height: 844 });
      for (const open of count ? [false, true] : [false]) {
        await page.evaluate(open => { const d = document.querySelector('.disclosure'); if (d) d.open = open; }, open);
        const m = await layout();
        check(!m.overflow && !m.duplicateIds.length && !m.targets.length && m.warningsVisible && !m.pending && !m.excludedLinks, `${file} ${theme} ${width} ${open}: layout, target, avvisi o diciture`);
        check(m.ids.length === count && new Set(m.ids).size === count, file + ': fonti mancanti o duplicate');
        check(m.primarySize === null || m.primarySize === '17px', file + ': testo primario ridotto');
        rows.push({ file, theme, width, open, ...m });
        if ([375, 390, 1280].includes(width)) await axeScan(`${file} ${theme} ${width} ${open}`);
        if (open && count > 1 && [375, 390, 1280].includes(width)) {
          await page.$eval('.open-icon svg', async e => await Promise.all(e.getAnimations().map(a => a.finished)));
          await page.$eval('.disclosure', d => scrollTo(0, d.getBoundingClientRect().top + scrollY - 16));
          await page.screenshot({ path: path.join(dir, `verifiche/${file.replace('.html', '')}-${width}-${theme}.png`) });
        }
        if (open && count > 1 && theme === 'light' && [390, 1280].includes(width)) measures.push({ file, width, ...await page.evaluate(() => {
          const d = document.querySelector('.disclosure'), items = [...document.querySelectorAll('.source')];
          return { panelHeight: Math.round(d.getBoundingClientRect().height), firstSourceOffset: Math.round(items[0].getBoundingClientRect().top - d.getBoundingClientRect().top), words: items.map(s => s.innerText).join(' ').split(/\s+/).filter(Boolean).length };
        }) });
      }
    }
  }
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(base + 'd.html');
  await page.addScriptTag({ content: axe });
  await page.focus('summary'); await page.keyboard.press('Enter');
  check(await page.$eval('.disclosure', d => d.open), 'Enter non apre');
  await page.keyboard.press('Space');
  check(!(await page.$eval('.disclosure', d => d.open)), 'Space non chiude');
  await page.keyboard.press('Enter'); await page.keyboard.press('Tab');
  check(await page.evaluate(() => document.activeElement.id === 'cerca-fonti' && getComputedStyle(document.activeElement).outlineStyle !== 'none'), 'Focus ricerca non visibile');
  const activities = [['durata', 'tp-catacombe-sangennaro'], ['quanto dura', 'tp-catacombe-sangennaro'], ['slow food 2025', 'bozza-S1'], ['pintauro', 'sdg-pintauro-2026'], ['eav orari', 'tp-eav-l1-orario'], ['nennella', 'gri-pasta-patate-2024'], ['locanda gesu', 'gri-pasta-patate-2024'], ['donnanna', 'bozza-D2'], ['tufo', 'stripes-tufo-2022'], ['costo', 'sdg-pignatelli-2026']];
  for (const [text, id] of activities) {
    const ids = await query(text); check(ids.includes(id), 'Ricerca fallita: ' + text); tasks.push({ text, expected: id, ids });
  }
  await query('nennella');
  check(await page.$eval('.source:not([hidden]) .source-context', e => e.textContent === 'Trattoria da Nennella'), 'Luogo condiviso non in testa o ripetuto');
  const shared = await page.$eval('.source:not([hidden])', e => e.innerText);
  check(!shared.includes('La Locanda Gesù Vecchio') && !shared.includes('Collegata a'), 'Nomi condivisi ancora duplicati');
  const beforeTitle = page.url();
  await page.click('.source:not([hidden]) [data-full-title]');
  check(await page.$eval('.source:not([hidden]) .original-title', e => !e.hidden && e.textContent.includes('Where to eat pasta')), 'Titolo originale non consultabile');
  check(page.url() === beforeTitle, 'Il comando del titolo ha navigato a un’altra pagina');
  await axeScan('titolo completo aperto');
  await page.click('.source:not([hidden]) [data-full-title]');
  await query('napoli sorrento');
  const order = await visibleIds();
  check(order.indexOf('tp-eav-l1-orario') < order.indexOf('tp-eav-campania-express-sospeso'), 'Orario non precede riscontro parziale');
  check(await page.$eval('[data-source-id="tp-eav-l1-orario"]', e => e.querySelector('.limit').compareDocumentPosition(e.querySelector('.source-link')) & Node.DOCUMENT_POSITION_FOLLOWING), 'Cautela PDF dopo il collegamento');
  check(await page.$eval('[data-source-id="tp-eav-l1-orario"] .format', e => e.textContent === 'PDF'), 'Formato PDF non sul collegamento');
  check(await page.$eval('[data-source-id="tp-anm-gtfs"] .format', e => e.textContent === 'ZIP'), 'Download ZIP non riconoscibile');
  await query('pintauro');
  check(await page.$eval('.source:not([hidden]) .limit', e => e.textContent.includes('non conferma')), 'Annuncio Pintauro promosso a conferma');
  await query('slow food');
  check(await page.$eval('.source:not([hidden])', e => e.querySelector('.purpose').textContent.includes('2025') && e.querySelector('time').dateTime === '2026-10-12' && e.querySelector('.source-note').textContent.includes('2024')), 'Edizione/pubblicazione/controllo confusi');
  for (const theme of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    for (const text of ['nennella', 'zzzznessuna']) {
      await query(text); await axeScan('ricerca ' + text + ' ' + theme);
      check(!(await layout()).overflow, 'Filtro con overflow');
    }
  }
  check(await page.$eval('.no-results', e => !e.hidden), 'Zero risultati senza recupero');
  await page.click('[data-context-action]');
  check((await visibleIds()).length === 12 && await page.evaluate(() => document.activeElement.id === 'cerca-fonti'), 'Reset non ripristina elenco e focus');
  await page.goto(base + 'd-lungo.html'); await page.click('summary'); await page.addScriptTag({ content: axe });
  for (const text of ['nennella', 'locanda gesu']) check((await query(text)).filter(id => id === 'gri-pasta-patate-2024').length === 1, 'Fonte condivisa lunga non trovabile: ' + text);
  await query('marechiaro');
  check((await visibleIds()).includes('osm') && await page.$eval('[data-source-id="osm"] .source-context', e => e.textContent === 'Marechiaro'), 'OSM non trovato o contesto errato');
  await query('zzzznessuna'); await page.click('[data-context-action]');
  for (const width of [320, 390, 1280]) {
    await page.setViewport({ width, height: 844 });
    await page.evaluate(() => document.activeElement.blur());
    await page.$eval('.group:nth-child(12)', g => scrollTo(0, g.getBoundingClientRect().top + scrollY - 96));
    await page.waitForFunction(() => document.querySelector('[data-context-action]').dataset.mode === 'return');
    await axeScan('ritorno ricerca ' + width);
    const rect = await page.$eval('.access-rail', e => { const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, height: r.height }; });
    check(rect.top >= -1 && rect.height < 120 && rect.bottom < 150, 'Barra di ritorno invade la pagina');
    await page.click('[data-context-action]');
    check(await page.evaluate(() => document.activeElement.id === 'cerca-fonti'), 'Ritorno non porta il focus al campo');
    check(await page.$eval('#cerca-fonti', e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom < innerHeight; }), 'Campo non visibile al ritorno');
  }
  // Telefono con spazio verticale ridotto, come durante la digitazione.
  await page.setViewport({ width: 390, height: 360 });
  await page.focus('#cerca-fonti'); await page.type('#cerca-fonti', 'san gennaro');
  check(await page.$eval('.access-rail', e => getComputedStyle(e).position === 'static'), 'Comando fissato mentre si digita');
  check(!(await layout()).overflow, 'Viewport con tastiera: overflow');
  await page.goto(base + 'd.html#fonte-bozza-d2');
  check(await page.$eval('.disclosure', d => d.open), 'Frammento non apre la sezione');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  check(await page.$eval('.open-icon svg', e => getComputedStyle(e).transitionDuration === '0s'), 'Movimento ridotto ignorato');
  await page.setJavaScriptEnabled(false); await page.goto(base + 'd-lungo.html');
  await page.focus('summary'); await page.keyboard.press('Enter');
  check((await page.$$('.source')).length === 180, 'Senza JS elenco incompleto');
  check(await page.$eval('.search-tools', e => e.hidden), 'Senza JS ricerca inerte visibile');
  check(await page.$eval('[data-source-id="gri-pasta-patate-2024"] .link-title', e => e.textContent.includes('Where to eat pasta')), 'Senza JS titolo originale perso');
  await page.setJavaScriptEnabled(true);
  check(!requests.length, 'Richieste esterne prima del clic');
  // Uscita all'originale e ritorno con una risposta intercettata e uno stato fittizio.
  page.removeAllListeners('request');
  let external = 0;
  page.on('request', r => { if (new URL(r.url()).hostname === '127.0.0.1') r.continue(); else { external++; r.respond({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Documento di prova</title><p>Risposta isolata.</p>' }); } });
  await page.goto(base + 'd.html'); await page.click('summary'); await query('catacombe');
  await page.evaluate(() => localStorage.setItem('nextstop-qa-isolato', 'itinerario-fittizio'));
  const link = await page.$eval('.source:not([hidden]) .source-link', a => ({ href: a.href, target: a.target }));
  await Promise.all([page.waitForNavigation(), page.click('.source:not([hidden]) .source-link')]);
  check(page.url() === link.href && external === 1 && link.target === '', 'Un clic non porta all’originale');
  await page.goBack({ waitUntil: 'networkidle0' });
  check(await page.evaluate(() => localStorage.getItem('nextstop-qa-isolato') === 'itinerario-fittizio'), 'Stato di prova alterato');
  await page.evaluate(() => localStorage.removeItem('nextstop-qa-isolato'));
  behavior.push({ keyboard: true, sourcesPreserved: true, cautionBeforeLink: true, longTitle: true, sharedContext: true, contextualReturn: true, reducedViewport: true, noJS: true, reducedMotion: true, directOriginalAndBack: true, externalResponse: 'intercettata, non verifica di raggiungibilità' });
} catch (error) {
  failures.push('Verifica interrotta: ' + error.message);
  throw error;
} finally {
  fs.writeFileSync(path.join(dir, 'verifiche/risultati.json'), JSON.stringify({ rows, scans, tasks, measures, behavior, requestsBeforeClick: requests, failures }, null, 2) + '\n');
  await browser.close();
}
console.log(`${rows.length} combinazioni; ${scans.length} scansioni axe; ${tasks.length} attività; ${failures.length} problemi.`);
if (failures.length) { console.error([...new Set(failures)].join('\n')); process.exitCode = 1; }
