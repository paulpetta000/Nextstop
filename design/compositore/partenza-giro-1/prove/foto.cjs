// Pezzo 4, giro 1: immagini da telefono (390) delle 4 proposte in C e D, chiaro e scuro: prima (la domanda, facoltativa)
// e dopo la scelta (il momento che conta di ogni proposta). Uso, con il server della copia acceso (porta 4333):
// node design/compositore/partenza-giro-1/prove/foto.cjs <cartella> [light,dark]
const path = require('node:path'), fs = require('node:fs');
const sharp = require('C:/Users/Windows11/Documents/nextstop/node_modules/sharp');
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const OUT = process.argv[2], TEMI = (process.argv[3] || 'light,dark').split(',');
const URL = 'http://localhost:4333/partenza-giro-1/proposte-locale.html';
const attesa = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
// per ogni proposta: i gesti per arrivare al momento «dopo» e dove guardare
const DOPO = {
  1: { gesti: ['[data-azione="via-1"]', '[data-v1="qui"]', '[data-v1f="qui"]', '[data-v1f="ok"]'], guarda: '.giorno-attivo .consiglio', su: { c: 250, d: 150 } },
  2: { gesti: ['[data-azione="via-2"]', '.posa-carta [data-ps="montesanto"]'], guarda: null },
  3: { gesti: ['.giorno-attivo .dm [data-v="qui"]'], guarda: '.giorno-attivo .dm', su: { c: 236, d: 130 } },
  4: { gesti: ['[data-azione="via-4"]', 'scrivi:#v4-q:toledo', '#v4-ris [data-punto]'], guarda: { c: '.v4-pill', d: '.d-titolo' }, su: { c: 236, d: 20 } }
};
const PRIMA = { 1: '.giorno-attivo .bg', 2: null, 3: '.giorno-attivo .dm', 4: { c: '.v4-pill', d: '.d-titolo' } };
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('prova-partenza-idea-1', '1'); } catch {} });
  const vedi = async (sel, su) => { if (!sel) return; await page.evaluate((sel, su) => { const el = document.querySelector(sel); if (el) scrollTo(0, Math.max(0, el.getBoundingClientRect().top + scrollY - su)); }, sel, su); await attesa(700); };
  for (const tema of TEMI) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }]);
    for (const p of ['c', 'd']) for (const v of [1, 2, 3, 4]) {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await page.evaluate(() => { try { localStorage.removeItem('prova-partenza-1'); } catch {} }).catch(() => {});
      await page.goto(`${URL}?v=${Date.now()}#${p}${v}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready); await attesa(1200);
      const pr = typeof PRIMA[v] === 'object' && PRIMA[v] ? PRIMA[v][p] : PRIMA[v];
      if (pr) await vedi(pr, p === 'c' ? 236 : (v === 4 ? 20 : 130));
      else if (p === 'c') { await attesa(1500); } else await vedi('.giorno-attivo .via-cerca', 130);
      await page.screenshot({ path: path.join(OUT, `prima-${p}${v}-${tema}.png`) });
      const d = DOPO[v];
      for (const g of d.gesti) {
        if (g.startsWith('scrivi:')) { const [, sel, val] = g.split(':'); await page.evaluate((sel, val) => { const i = document.querySelector(sel); i.value = val; i.dispatchEvent(new Event('input', { bubbles: true })); }, sel, val); await attesa(400); continue; }
        await page.waitForSelector(g, { timeout: 4000 });
        await page.evaluate(sel => { const b = document.querySelector(sel); b.scrollIntoView({ block: 'center' }); b.click(); }, g); await attesa(700);
      }
      await attesa(900);
      const gs = typeof d.guarda === 'object' && d.guarda ? d.guarda[p] : d.guarda;
      if (gs) await vedi(gs, d.su[p]);
      await page.evaluate(() => document.querySelector('#toast')?.classList.remove('su')); await attesa(400);
      await page.screenshot({ path: path.join(OUT, `dopo-${p}${v}-${tema}.png`) });
    }
  }
  await browser.close();
  console.log(errori.length ? [...new Set(errori)].join('\n') : 'nessun errore nella pagina');
  // fogli: quattro colonne (proposte 1-4), due righe (C, D)
  for (const tema of TEMI) for (const quando of ['prima', 'dopo']) {
    const W = 780, H = 1688, G = 30, img = [];
    for (const p of ['c', 'd']) for (const v of [1, 2, 3, 4]) img.push(await sharp(fs.readFileSync(path.join(OUT, `${quando}-${p}${v}-${tema}.png`))).resize(W, H, { fit: 'cover', position: 'top' }).toBuffer());
    const buf = await sharp({ create: { width: 4 * (W + G) + G, height: 2 * (H + G) + G, channels: 3, background: '#30353c' } }).composite(img.map((b, i) => ({ input: b, left: G + (i % 4) * (W + G), top: G + Math.floor(i / 4) * (H + G) }))).png().toBuffer();
    await sharp(buf).resize({ width: 2200 }).jpeg({ quality: 80 }).toFile(path.join(OUT, `${quando}-${tema === 'light' ? 'chiaro' : 'scuro'}.jpg`));
  }
  console.log('Fatto');
})();
