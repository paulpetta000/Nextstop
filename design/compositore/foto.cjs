// Immagini delle 4 proposte (design/compositore/proposte-locale.html) da telefono e da computer, in chiaro e in scuro,
// e controllo dello scorrimento di lato a 320 e 390 px. Usa puppeteer-core di C:\Users\Windows11\tools\controlli
// (approvato da Enrico il 07/10/2026, fuori dal progetto) e sharp (già nel progetto).
// Uso: con il server «compositore» acceso (porta 4332): node design/compositore/foto.cjs <cartella> [a,b,c,d] [scene]
const path = require('node:path');
const fs = require('node:fs');
const sharp = require(path.join(__dirname, '../../node_modules/sharp'));
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');

const OUT = process.argv[2];
if (!OUT) throw new Error('Indica la cartella di uscita');
fs.mkdirSync(OUT, { recursive: true });
const PROPOSTE = (process.argv[3] || 'a,c,d,e,f').split(',');
const SCENE = (process.argv[4] || 'tel,giu,mappa,pc').split(',');
const URL = `http://localhost:4332/${process.argv[5] || 'giro-2'}/proposte-locale.html`;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const attesa = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-idea-vista', '1'); localStorage.setItem('prova-idea-vista-2', '1'); localStorage.setItem('prova-idea-vista-3', '1'); localStorage.setItem('prova-idea-vista-4', '1'); localStorage.setItem('prova-idea-vista-5', '1'); } catch {} });
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });

  for (const p of PROPOSTE) {
    for (const tema of ['light', 'dark']) {
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
      // telefono
      for (const w of [320, 390]) {
        await page.setViewport({ width: w, height: 844, deviceScaleFactor: w === 390 ? 2 : 1, isMobile: true, hasTouch: true });
        await page.goto(`${URL}?v=${Date.now()}#${p}`, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        await attesa(250);
        const largo = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (largo > 0) console.log(`ATTENZIONE ${p} ${tema} ${w}px: ${largo} px di troppo in larghezza`);
        if (w !== 390) continue;
        if (SCENE.includes('tel')) await page.screenshot({ path: path.join(OUT, `${p}-tel-${tema}.png`) });
        if (SCENE.includes('giu')) {
          await page.evaluate(q => scrollTo(0, q === 'c' ? 560 : 760), p);
          await attesa(200);
          await page.screenshot({ path: path.join(OUT, `${p}-giu-${tema}.png`) });
        }
        if (SCENE.includes('mappa')) {
          await page.evaluate(() => scrollTo(0, 0));
          const sel = p === 'd' ? '[data-azione="mappa-d"]' : p === 'c' ? '' : '[data-azione="vista"][data-v="mappa"]';
          if (sel) { await page.evaluate(s => document.querySelector(s)?.click(), sel); await attesa(450); }
          if (p !== 'c' && p !== 'd') await page.evaluate(() => { const m = document.querySelector('#mappa'); if (m) m.scrollIntoView({ block: 'end' }); });
          await attesa(200);
          await page.screenshot({ path: path.join(OUT, `${p}-mappa-${tema}.png`) });
        }
      }
      // computer
      if (SCENE.includes('pc')) {
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
        await page.goto(`${URL}?v=${Date.now()}#${p}`, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        await attesa(300);
        await page.screenshot({ path: path.join(OUT, `${p}-pc-${tema}.png`) });
      }
    }
  }
  if (errori.length) console.log('Errori nella pagina:', [...new Set(errori)].join('\n'));
  await browser.close();

  // fogli di confronto: per ogni proposta, telefono chiaro e scuro (prima schermata e più in basso o la mappa), poi il computer
  for (const p of PROPOSTE) {
    const tel = ['tel', 'giu', 'mappa'].filter(s => SCENE.includes(s)).flatMap(s => ['light', 'dark'].map(t => path.join(OUT, `${p}-${s}-${t}.png`))).filter(f => fs.existsSync(f));
    if (tel.length) {
      const H = 844 * 2, W = 390 * 2, G = 40;
      const img = await Promise.all(tel.map(f => sharp(f).resize(W, H, { fit: 'cover', position: 'top' }).toBuffer()));
      await sharp({ create: { width: img.length * (W + G) + G, height: H + 2 * G, channels: 3, background: '#30353c' } })
        .composite(img.map((b, i) => ({ input: b, left: G + i * (W + G), top: G }))).png().toBuffer()
        .then(b => sharp(b).resize({ width: Math.min(2400, img.length * (W + G) + G) }).jpeg({ quality: 82 }).toFile(path.join(OUT, `confronto-${p}-telefono.jpg`)));
    }
    const pc = ['light', 'dark'].map(t => path.join(OUT, `${p}-pc-${t}.png`)).filter(f => fs.existsSync(f));
    if (pc.length) {
      const img = await Promise.all(pc.map(f => sharp(f).toBuffer()));
      await sharp({ create: { width: 1440, height: 900 * img.length + 30 * (img.length - 1), channels: 3, background: '#30353c' } })
        .composite(img.map((b, i) => ({ input: b, left: 0, top: i * 930 }))).png().toBuffer()
        .then(b => sharp(b).resize({ width: 1400 }).jpeg({ quality: 80 }).toFile(path.join(OUT, `confronto-${p}-computer.jpg`)));
    }
  }
  console.log('Fatto:', OUT);
})();
