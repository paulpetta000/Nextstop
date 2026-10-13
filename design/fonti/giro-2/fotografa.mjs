// Compara i pannelli e conserva i casi editoriali importanti, con profilo temporaneo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const require = createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer = require('puppeteer-core');
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'verifiche');
// Aspetta la fine della rotazione del comando anche nei viewport non scansionati da axe.
const photoBrowser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
try {
  const photoPage = await photoBrowser.newPage();
  await photoPage.setRequestInterception(true);
  photoPage.on('request', r => new URL(r.url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
  for (const key of ['a', 'b', 'c', 'd']) for (const theme of ['light', 'dark']) {
    await photoPage.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await photoPage.goto(`http://127.0.0.1:4344/design/fonti/giro-2/${key}.html`, { waitUntil: 'networkidle0' });
    await photoPage.evaluate(() => document.fonts.ready);
    for (const width of [375, 390, 1280]) {
      await photoPage.setViewport({ width, height: 844 });
      for (const open of [false, true]) {
        await photoPage.$eval('.disclosure', (d, value) => { d.open = value; }, open);
        await photoPage.$eval('.open-icon svg', async e => { await Promise.all(e.getAnimations().map(a => a.finished)); });
        await photoPage.$eval('.disclosure', d => window.scrollTo(0, d.getBoundingClientRect().top + scrollY - 16));
        await photoPage.screenshot({ path: path.join(dir, `${key}-${width}-${theme}-${open ? 'pannello' : 'chiuso'}.png`) });
      }
    }
  }
} finally { await photoBrowser.close(); }
for (const theme of ['light', 'dark']) {
  const bg = theme === 'light' ? '#F7F6F2' : '#0F1524';
  const fg = theme === 'light' ? '#16181D' : '#EEF0F4';
  const titles = ['A · Lista essenziale', 'B · Percorso per luoghi', 'C · Informazione e fonte', 'D · Fogli di viaggio'];
  const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1656" height="64"><rect width="1656" height="64" fill="${bg}"/>${titles.map((n, i) => `<text x="${20 + i * 412}" y="38" font-family="Arial,sans-serif" font-size="20" font-weight="600" fill="${fg}">${n}</text>`).join('')}</svg>`);
  await sharp({ create: { width: 1656, height: 924, channels: 4, background: bg } }).composite([{ input: label, left: 0, top: 0 }, ...['a', 'b', 'c', 'd'].map((key, i) => ({ input: path.join(dir, `${key}-390-${theme}-pannello.png`), left: 20 + i * 412, top: 64 }))]).png().toFile(path.join(dir, `confronto-telefono-${theme}.png`));
  for (const key of ['a', 'b', 'c', 'd']) await sharp(path.join(dir, `${key}-1280-${theme}-pannello.png`)).resize(640, 422).png().toFile(path.join(dir, `${key}-desktop-${theme}.png`));
}
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
const page = await browser.newPage();
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const evidence = [];
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.setRequestInterception(true);
page.on('request', r => new URL(r.url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
try {
  for (const key of ['a', 'b', 'c', 'd']) for (const scenario of ['lungo', 'breve', 'vuoto']) for (const theme of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await page.goto(`http://127.0.0.1:4344/design/fonti/giro-2/${key}-${scenario}.html`, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => { const d = document.querySelector('.disclosure'); if (d) d.open = true; await document.fonts.ready; await Promise.all((document.querySelector('.open-icon svg')?.getAnimations() ?? []).map(a => a.finished)); });
    for (const width of [375, 1280]) {
      await page.setViewport({ width, height: 844 });
      await page.evaluate(() => { const d = document.querySelector('.disclosure') ?? document.querySelector('.essential'); window.scrollTo(0, d.getBoundingClientRect().top + scrollY - 16); });
      await page.screenshot({ path: path.join(dir, `${key}-${scenario}-${width}-${theme}.png`) });
    }
  }
  for (const theme of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://127.0.0.1:4344/design/fonti/giro-2/c.html', { waitUntil: 'networkidle0' });
    await page.click('summary');
    await page.addScriptTag({ content: axe });
    for (const query of ['pintauro', 'slow food', 'napoli sorrento', 'nennella', 'zzzznessuna']) {
      await page.$eval('#cerca-fonti', e => { e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true })); });
      await page.type('#cerca-fonti', query);
      await page.$eval('.disclosure', d => window.scrollTo(0, d.getBoundingClientRect().top + scrollY - 16));
      const violations = await page.evaluate(async () => (await axe.run()).violations.map(v => v.id));
      assert.deepEqual(violations, [], `${theme} ${query}`);
      const clip = await page.$eval('.disclosure', d => { const r = d.getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, width: r.width, height: r.height }; });
      const file = `c-${theme}-${query.replaceAll(' ', '-')}.png`;
      await page.screenshot({ path: path.join(dir, file), clip });
      evidence.push({ theme, query, file, axe: violations });
    }
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
fs.writeFileSync(path.join(dir, 'lettura-visiva.json'), JSON.stringify({ evidence, consoleErrors: errors }, null, 2) + '\n');
console.log('Confronti in due temi e dieci immagini dei casi editoriali; dieci scansioni axe aggiuntive.');
