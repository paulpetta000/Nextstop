const path = require('node:path'), fs = require('node:fs');
const sharp = require('C:/Users/Windows11/Documents/nextstop/node_modules/sharp');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const OUT = process.argv[2];
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { localStorage.setItem('prova-scheda-idea', '1'); localStorage.removeItem('prova-scheda-1'); });
  const righe = [];
  for (const [tema, hash, sel] of [['light', 'c1', '#scheda .bv'], ['dark', 'c1', '#scheda .bv'], ['light', 'd3', '#scheda .sigillo'], ['light', 'd4', '.giorno-attivo .d-timbro-b']]) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }]);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:4332/scheda-giro-1/proposte-locale.html?v=${Date.now()}#${hash}`, { waitUntil: 'load' }); await attesa(800);
    if (!sel.startsWith('.giorno')) { await page.evaluate(() => document.querySelectorAll('.giorno-attivo [data-azione="tappa"]')[3].click()); await attesa(1400); }
    else await page.evaluate(s => { document.querySelectorAll(s)[3].scrollIntoView({ block: 'center' }); }, sel);
    await attesa(400);
    const box = await page.evaluate(s => { const el = s.startsWith('.giorno') ? document.querySelectorAll(s)[3] : document.querySelector(s); const r = el.getBoundingClientRect(); return { x: r.left - 6, y: r.top - 6, width: Math.min(r.width, 200) + 12, height: r.height + 12 }; }, sel);
    await page.evaluate(s => { const el = s.startsWith('.giorno') ? document.querySelectorAll(s)[3] : document.querySelector(s); el.click(); document.getAnimations().forEach(a => a.pause()); }, sel);
    const fotogrammi = [];
    for (const t of [0, 100, 200, 300, 400, 500, 600, 700, 800, 950]) {
      await page.evaluate(t => document.getAnimations().forEach(a => { try { a.currentTime = t; } catch {} }), t);
      await attesa(60);
      fotogrammi.push(await page.screenshot({ clip: box }));
    }
    righe.push(fotogrammi);
  }
  await browser.close();
  const W = 260, H = 110, G = 10, img = [];
  const cols = 10;
  const comp = [];
  for (let r = 0; r < righe.length; r++) for (let c = 0; c < cols; c++) comp.push({ input: await sharp(righe[r][c]).resize(W, H, { fit: 'contain', background: '#30353c' }).toBuffer(), left: G + c * (W + G), top: G + r * (H + G) });
  await sharp({ create: { width: cols * (W + G) + G, height: righe.length * (H + G) + G, channels: 3, background: '#30353c' } }).composite(comp).jpeg({ quality: 85 }).toFile(path.join(OUT, 'visitata-fotogrammi.jpg'));
  console.log('ok');
})();
