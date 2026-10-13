// Immagini del prototipo in un profilo Chrome temporaneo, senza richieste esterne.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer = require('puppeteer-core');
const sharp = createRequire(new URL('../../../package.json', import.meta.url))('sharp');
const dir = path.dirname(fileURLToPath(import.meta.url));
const images = path.join(dir, 'verifiche');
const base = 'http://127.0.0.1:4346/design/fonti/giro-4/';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
const page = await browser.newPage();
await page.setRequestInterception(true);
page.on('request', r => new URL(r.url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
async function prepare(file, theme, width = 390, open = true) {
  await page.setViewport({ width, height: 1000 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(base + file, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  if (open && await page.$('summary')) await page.click('summary');
  await page.$eval('.stage', e => e.scrollIntoView({ block: 'start' }));
}
async function picture(name) { await page.screenshot({ path: path.join(images, name + '.png') }); }
try {
  for (const theme of ['light', 'dark']) for (const width of [375, 390, 1280]) {
    await prepare('d.html', theme, width, false); await picture(`d-chiuso-${width}-${theme}`);
    for (const file of ['d-breve', 'd-vuoto']) {
      await prepare(file + '.html', theme, width); await picture(`${file}-${width}-${theme}`);
    }
  }
  for (const [name, term] of [['pintauro', 'pintauro'], ['slow-food', 'slow food'], ['eav', 'napoli sorrento'], ['anm', 'anm'], ['condivisa', 'nennella']]) {
    await prepare('d.html', 'light');
    await page.type('#cerca-fonti', term);
    await page.waitForFunction(() => /trovat[ae]/.test(document.querySelector('[role=status]').textContent));
    await page.evaluate(() => document.activeElement.blur());
    await picture(`d-${name}-390-light`);
    if (name === 'condivisa') {
      await page.click('.source:not([hidden]) [data-full-title]');
      await page.$eval('.stage', e => e.scrollIntoView({ block: 'start' }));
      await picture('d-titolo-completo-390-light');
    }
  }
  await prepare('d.html', 'dark', 1280);
  await page.type('#cerca-fonti', 'pintauro');
  await page.waitForFunction(() => document.querySelector('[role=status]').textContent.includes('trovata'));
  await page.evaluate(() => document.activeElement.blur());
  await picture('d-pintauro-1280-dark');
  await prepare('d-lungo.html', 'dark');
  await page.$eval('.group:nth-child(12)', g => scrollTo(0, g.getBoundingClientRect().top + scrollY - 96));
  await page.waitForFunction(() => document.querySelector('[data-context-action]').dataset.mode === 'return');
  await picture('d-ritorno-390-dark');
} finally { await browser.close(); }
// Affiancamento delle due immagini già ottenute: nessun contenuto del prototipo cambia.
const light = await sharp(path.join(images, 'd-390-light.png')).toBuffer();
const dark = await sharp(path.join(images, 'd-390-dark.png')).toBuffer();
await sharp({ create: { width: 796, height: 844, channels: 3, background: '#ECEAE4' } })
  .composite([{ input: light, left: 0, top: 0 }, { input: dark, left: 406, top: 0 }])
  .png().toFile(path.join(images, 'd-telefono-due-temi.png'));
console.log('Immagini finali: chiuso, 1/0 fonti, limiti, PDF/ZIP, luogo condiviso, titolo completo e ritorno alla ricerca.');
