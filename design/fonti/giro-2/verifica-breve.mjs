// Regressione del caso con una fonte: il foglio unico deve usare lo spazio disponibile.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Windows11/tools/controlli/package.json');
const puppeteer = require('puppeteer-core');
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
const rows = [];
try {
  const page = await browser.newPage();
  for (const theme of ['light', 'dark']) for (const width of [320, 390, 768, 1280]) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await page.setViewport({ width, height: 844 });
    await page.goto('http://127.0.0.1:4344/design/fonti/giro-2/d-breve.html', { waitUntil: 'networkidle0' });
    await page.click('summary');
    await page.addScriptTag({ content: axe });
    const ratio = await page.evaluate(() => document.querySelector('.group').getBoundingClientRect().width / document.querySelector('.notebook').getBoundingClientRect().width);
    const violations = await page.evaluate(async () => (await axe.run()).violations.map(v => v.id));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    rows.push({ theme, width, ratio, overflow, axe: violations, pass: ratio >= .95 && !overflow && !violations.length });
  }
} finally { await browser.close(); }
const name = process.argv.includes('--prima') ? 'breve-prima.json' : 'breve-dopo.json';
fs.writeFileSync(new URL('verifiche/' + name, import.meta.url), JSON.stringify(rows, null, 2) + '\n');
console.log(`Fonte unica: ${rows.filter(r => r.pass).length}/${rows.length} casi conformi. Rapporto minimo ${Math.min(...rows.map(r => r.ratio)).toFixed(2)}.`);
if (rows.some(r => !r.pass)) process.exitCode = 1;
