// QA dei soli bozzetti, con Chrome temporaneo: nessun profilo o dato di Enrico.
// Riusa puppeteer-core e axe già autorizzati in tools/controlli; nessuna installazione.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer = require('puppeteer-core');
const demo = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(demo, 'verifiche');
fs.mkdirSync(output, { recursive: true });
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const base = 'http://127.0.0.1:4343/design/fonti/giro-1/';
const rows = [], failures = [], behavior = [], requests = [];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
const page = await browser.newPage();
page.on('pageerror', e => failures.push(`Console: ${e.message}`));
page.on('console', msg => { if (msg.type() === 'error') failures.push(`Console: ${msg.text()}`); });
await page.setRequestInterception(true);
page.on('request', r => {
  if (new URL(r.url()).hostname === '127.0.0.1' || r.url().startsWith('data:')) r.continue();
  else { requests.push(r.url()); r.abort(); }
});
const check = (ok, context) => { if (!ok) failures.push(context); };
const measure = () => page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  sources: document.querySelectorAll('[data-source-id]').length,
  unique: new Set([...document.querySelectorAll('[data-source-id]')].map(e => e.dataset.sourceId)).size,
  duplicates: [...document.querySelectorAll('[id]')].map(e => e.id).filter((v, i, a) => a.indexOf(v) !== i),
  smallType: [...document.querySelectorAll('summary, .source-link, .claim, .meta, .publisher, .limit')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 12).length,
  primarySize: document.querySelector('.source-link') ? getComputedStyle(document.querySelector('.source-link')).fontSize : null,
  tapTargets: [...document.querySelectorAll('summary, .source-link, .toc a')].filter(e => e.getClientRects().length && e.getBoundingClientRect().height < 43.9).map(e => e.outerHTML.slice(0, 90)),
  excludedLinks: [...document.querySelectorAll('a[href]')].filter(a => /americascup\.com/.test(a.href)).length,
  warningsVisible: !!document.querySelector('#segno')?.getClientRects().length,
  theme: getComputedStyle(document.documentElement).getPropertyValue('--carta').trim()
}));
try {
  for (const key of ['a', 'b', 'c', 'd']) {
    for (const scenario of ['esempi', 'lungo', 'breve', 'vuoto']) {
      const file = `${key}${scenario === 'esempi' ? '' : '-' + scenario}.html`;
      for (const theme of ['light', 'dark']) {
        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'no-preference' }]);
        await page.goto(base + file, { waitUntil: 'networkidle0' });
        await page.evaluate(() => document.fonts.ready);
        const initiallyClosed = await page.evaluate(() => !document.querySelector('.disclosure')?.open);
        check(initiallyClosed, `${file}: inizialmente aperto`);
        check(await page.evaluate(() => !!document.querySelector('.essential')?.getClientRects().length), `${file}: avvertenze nascoste`);
        await page.addScriptTag({ content: axe });
        for (const width of [320, 375, 390, 768, 1280]) {
          await page.setViewport({ width, height: 844, deviceScaleFactor: 1 });
          for (const open of scenario === 'vuoto' ? [false] : [false, true]) {
            await page.evaluate(open => { const d = document.querySelector('.disclosure'); if (d) d.open = open; }, open);
            const m = await measure();
            check(!m.overflow, `${file} ${theme} ${width} ${open}: overflow`);
            check(!m.duplicates.length && m.sources === m.unique, `${file}: ID o fonti duplicati`);
            check(m.sources === ({ esempi: 12, lungo: 180, breve: 1, vuoto: 0 })[scenario], `${file}: conteggio errato`);
            check(!m.smallType && !m.excludedLinks && !m.tapTargets.length, `${file} ${theme} ${width}: testo/link/tocco non conforme`);
            if (scenario !== 'vuoto') check(m.warningsVisible, `${file}: avviso non visibile`);
            // axe su telefono e desktop, in entrambi gli stati e temi; gli altri viewport misurati sopra.
            let violations = [];
            if (width === 390 || width === 1280) {
              violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })));
              check(!violations.length, `${file} ${theme} ${width} ${open}: axe ${violations.map(v => v.id).join(', ')}`);
            }
            if (scenario === 'esempi' && [375, 390, 1280].includes(width)) {
              await page.evaluate(() => window.scrollTo(0, document.querySelector('.fonti').getBoundingClientRect().top + scrollY - 24));
              await page.screenshot({ path: path.join(output, `${key}-${width}-${theme}-${open ? 'aperto' : 'chiuso'}.png`) });
            }
            rows.push({ key, scenario, theme, width, open, ...m, axe: [390, 1280].includes(width) ? violations : null });
          }
        }
      }
    }
    // Apertura e chiusura reali via tastiera; ogni fonte resta un collegamento normale.
    await page.goto(base + key + '.html');
    await page.setViewport({ width: 390, height: 844 });
    await page.focus('summary');
    await page.keyboard.press('Enter');
    check(await page.$eval('.disclosure', e => e.open), `${key}: Enter non apre`);
    await page.keyboard.press('Space');
    check(!(await page.$eval('.disclosure', e => e.open)), `${key}: Space non chiude`);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => ({ tag: document.activeElement.tagName, outline: getComputedStyle(document.activeElement).outlineStyle }));
    check(focused.tag === 'A' && focused.outline !== 'none', `${key}: tab/focus non visibile`);
    await page.click('.toc a:last-child');
    check(await page.$eval('.disclosure', e => e.open), `${key}: indice chiude la sezione`);
    const lastAnchor = await page.$eval('.toc a:last-child', a => a.getAttribute('href'));
    await page.goto(base + key + '.html' + lastAnchor);
    check(await page.$eval('.disclosure', e => e.open), `${key}: frammento non rivela il contenuto chiuso`);
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(base + key + '.html');
    await page.keyboard.press('Tab');
    check(await page.evaluate(() => document.activeElement.matches('.skip')), `${key}: collegamento salta al contenuto assente con movimento ridotto`);
    await page.focus('summary');
    await page.keyboard.press('Enter');
    check(await page.$eval('.open-icon svg', e => getComputedStyle(e).transitionDuration === '0s'), `${key}: movimento ridotto ignorato`);
    const themeBefore = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--carta').trim());
    await page.click('[data-theme-button]');
    check(themeBefore !== await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--carta').trim()), `${key}: cambio tema non funziona`);
    await page.setJavaScriptEnabled(false);
    await page.goto(base + key + '.html');
    await page.focus('summary');
    await page.keyboard.press('Enter');
    check(await page.$eval('.disclosure', e => e.open), `${key}: dipende da JavaScript`);
    behavior.push({ key, enterSpace: true, tabFocus: focused, fragmentReveal: true, reducedMotion: true, themeSwitch: true, noJavaScript: true });
    await page.setJavaScriptEnabled(true);
    console.log(`${key.toUpperCase()}: viewport, axe, tastiera, temi, frammenti e senza JS completati`);
  }
  check(requests.length === 0, 'Richieste esterne prima del clic: ' + requests.join(', '));
  // Prova isolata di navigazione: intercetta il documento e non visita l’editore.
  page.removeAllListeners('request');
  let documentRequests = 0;
  page.on('request', r => {
    if (new URL(r.url()).hostname === '127.0.0.1') r.continue();
    else { documentRequests++; r.respond({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Documento di prova</title><p>Risposta isolata per il controllo del ritorno.</p>' }); }
  });
  await page.goto(base + 'b.html');
  await page.evaluate(() => { localStorage.setItem('nextstop-qa-isolato', 'itinerario-di-prova'); document.querySelector('.disclosure').open = true; });
  const original = await page.$eval('.source-link', a => ({ href: a.href, target: a.target }));
  await Promise.all([page.waitForNavigation(), page.click('.source-link')]);
  check(page.url() === original.href && documentRequests === 1 && original.target === '', 'Un clic non porta direttamente all’URL originale');
  await page.goBack({ waitUntil: 'networkidle0' });
  check(await page.evaluate(() => localStorage.getItem('nextstop-qa-isolato') === 'itinerario-di-prova'), 'Navigazione altera lo stato locale');
  await page.evaluate(() => localStorage.removeItem('nextstop-qa-isolato'));
  behavior.push({ directLinkAndBack: true, documentRequests, storagePreserved: true, externalResponse: 'intercettata, non verifica editoriale' });
  // Anche la galleria, dopo la creazione delle schermate.
  for (const theme of ['light', 'dark']) for (const width of [390, 1280]) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await page.setViewport({ width, height: 844 });
    await page.goto(base + 'index.html', { waitUntil: 'networkidle0' });
    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(async () => (await axe.run()).violations.map(v => v.id));
    check(!violations.length, `Galleria ${width} ${theme}: ${violations.join(', ')}`);
  }
} finally {
  fs.writeFileSync(path.join(output, 'risultati.json'), JSON.stringify({ rows, behavior, requestsBeforeClick: requests, failures }, null, 2) + '\n');
  await browser.close();
}
console.log(`${rows.length} combinazioni, ${rows.filter(r => r.axe !== null).length} scansioni axe; ${failures.length} problemi.`);
if (failures.length) { console.error([...new Set(failures)].join('\n')); process.exitCode = 1; }
