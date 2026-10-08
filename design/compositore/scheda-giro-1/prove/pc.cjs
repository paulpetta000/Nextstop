const path = require('node:path'), fs = require('node:fs');
const sharp = require('C:/Users/Windows11/Documents/nextstop/node_modules/sharp');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const OUT = process.argv[2];
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { localStorage.setItem('prova-scheda-idea', '1'); localStorage.setItem('prova-scheda-scorri', '1'); const t = Date.now(); localStorage.setItem('prova-scheda-1', JSON.stringify({ salvato: true, giorni: [['mann', 'tribunali', 'sansevero', 'santa-chiara', 'spaccanapoli', 'san-lorenzo', 'duomo'], ['sant-elmo', 'san-martino', 'pedamentina', 'toledo', 'plebiscito', 'palazzo-reale', 'monte-echia', 'borgo-marinari']], fatte: { mann: t, tribunali: t } })); });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: 1440, height: 900 });
  const files = [];
  for (const q of [1, 2, 3, 4]) for (const p of ['c', 'd']) {
    await page.goto(`http://localhost:4332/scheda-giro-1/proposte-locale.html?v=${Date.now()}#${p}${q}`, { waitUntil: 'load' }); await attesa(600);
    await page.evaluate(() => document.querySelectorAll('.giorno-attivo [data-azione="tappa"]')[3].click()); await attesa(1000);
    const f = path.join(OUT, `pc-q${q}-${p}.png`); await page.screenshot({ path: f }); files.push(f);
  }
  await browser.close();
  const W = 1440, H = 900, G = 24, img = [];
  for (const f of files) img.push(await sharp(fs.readFileSync(f)).toBuffer());
  const buf = await sharp({ create: { width: 2 * W + 3 * G, height: 4 * H + 5 * G, channels: 3, background: '#30353c' } }).composite(img.map((b, i) => ({ input: b, left: G + (i % 2) * (W + G), top: G + Math.floor(i / 2) * (H + G) }))).png().toBuffer();
  await sharp(buf).resize({ width: 2000 }).jpeg({ quality: 78 }).toFile(path.join(OUT, 'computer-tutte.jpg'));
  console.log('ok');
})();
