// Controlli proporzionati della correzione: conserva i documenti e le cautele di D.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer = require('puppeteer-core');
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
const page = await browser.newPage();
const rows = [], errors = [], requests = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.setRequestInterception(true);
page.on('request', r => {
  if (new URL(r.url()).hostname === '127.0.0.1') r.continue();
  else { requests.push(r.url()); r.abort(); }
});
const base = 'http://127.0.0.1:4345/design/fonti/';
const sources = () => page.$$eval('.source', items => items.map(s => ({
  id: s.dataset.sourceId, title: s.querySelector('.source-link').textContent.trim(), href: s.querySelector('.source-link').href,
  meta: s.querySelector('.meta').textContent, date: s.querySelector('time').dateTime,
  purpose: s.querySelector('.purpose')?.textContent ?? '', note: s.querySelector('.note, .limit')?.textContent ?? ''
})));
try {
  for (const [name, count] of [['d.html', 12], ['d-lungo.html', 180], ['d-breve.html', 1], ['d-vuoto.html', 0]]) {
    await page.goto(base + 'giro-2/' + name, { waitUntil: 'networkidle0' });
    const previous = await sources();
    await page.goto(base + 'giro-3/' + name, { waitUntil: 'networkidle0' });
    assert.deepEqual(await sources(), previous, name + ': documento, scopo esistente, controllo o cautela cambiati');
    assert.equal((await sources()).length, count);
    assert.equal(await page.$$('.pending').then(a => a.length), 0, name + ': dicitura interna ancora presente');
    for (const theme of ['light', 'dark']) {
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
      await page.goto(base + 'giro-3/' + name, { waitUntil: 'networkidle0' });
      await page.addScriptTag({ content: axe });
      assert.equal(await page.evaluate(() => !document.querySelector('.disclosure')?.open), true);
      for (const width of [320, 390, 1280]) {
        await page.setViewport({ width, height: 844 });
        for (const open of count ? [false, true] : [false]) {
          await page.evaluate(open => { const d = document.querySelector('.disclosure'); if (d) d.open = open; }, open);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, name + ': overflow');
          assert.equal(await page.$eval('#segno', e => !!e.getClientRects().length), true, name + ': avvertenza nascosta');
          const violations = await page.evaluate(async () => (await axe.run()).violations.map(v => v.id));
          assert.deepEqual(violations, [], name + ': axe');
          rows.push({ name, theme, width, open, axe: violations });
          if ([390, 1280].includes(width) && open && count > 1) {
            await page.$eval('.disclosure', d => scrollTo(0, d.getBoundingClientRect().top + scrollY - 16));
            await page.screenshot({ path: new URL(`verifiche/${name.replace('.html', '')}-${width}-${theme}.png`, import.meta.url).pathname.slice(1) });
          }
        }
      }
    }
  }
  await page.goto(base + 'giro-3/d.html');
  await page.focus('summary');
  await page.keyboard.press('Enter');
  assert.equal(await page.$eval('.disclosure', d => d.open), true);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'cerca-fonti');
  await page.type('#cerca-fonti', 'nennella');
  assert.equal(await page.$$('.source:not([hidden])').then(a => a.length), 1);
  assert.equal(await page.$eval('.source:not([hidden])', s => s.dataset.sourceId), 'gri-pasta-patate-2024');
  await page.click('[data-reset]');
  assert.equal(await page.$$('.source:not([hidden])').then(a => a.length), 12);
  await page.setJavaScriptEnabled(false);
  await page.goto(base + 'giro-3/d-lungo.html');
  await page.focus('summary');
  await page.keyboard.press('Enter');
  assert.equal(await page.$$('.source').then(a => a.length), 180);
  assert.equal(await page.$$('.pending').then(a => a.length), 0);
  assert.deepEqual(requests, []);
  assert.deepEqual(errors, []);
} finally {
  fs.writeFileSync(new URL('verifiche/risultati.json', import.meta.url), JSON.stringify({ rows, documentsPreserved: true, sourceCounts: [12, 180, 1, 0], keyboardSearchAndNoJS: true, errors, requests }, null, 2) + '\n');
  await browser.close();
}
console.log(`${rows.length} combinazioni e scansioni axe pulite; documenti, cautele e comportamento conservati.`);
