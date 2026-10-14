// Pezzo 7 (richiesta di Enrico, 14/10/2026): quanto scattano i passaggi (giorno, tappa, locale), con il processore 4 volte più
// lento, come un telefono medio. Per ogni gesto: l'immagine più lunga (ms) e quante immagini superano i 34 ms (due fotogrammi).
// Uso: node design/compositore/mangiare-giro-1/prove/fluidita.cjs <pagina.html> <cifra dell'indirizzo> [porta]
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const [PAGINA, CIFRA, PORTA = '4333'] = process.argv.slice(2);
const URL = `http://localhost:${PORTA}/${PAGINA}`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();
  await page.evaluateOnNewDocument(() => { try { localStorage.clear(); localStorage.setItem('prova-mangiare-idea-1', '1'); } catch {} });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const misura = async (nome, fai, ms = 1600) => {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const r = await page.evaluate(async (fai, ms) => {
      const gap = [], quando = []; const t0 = performance.now(); let last = t0, on = true;
      const loop = t => { gap.push(t - last); quando.push(Math.round(last - t0)); last = t; if (on) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      (0, eval)(fai);
      await new Promise(r => setTimeout(r, ms)); on = false;
      return { max: Math.round(Math.max(...gap)), lenti: gap.filter(g => g > 34).length, dove: gap.map((g, i) => g > 34 ? `${quando[i]}+${Math.round(g)}` : '').filter(Boolean).join(' ') };
    }, fai, ms);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    console.log(`${nome}: immagine più lunga ${r.max} ms, ${r.lenti} sopra i 34 ms (da quando, ms: ${r.dove})`);
  };
  const apri = async v => { await page.goto(`${URL}?v=${Date.now()}#${v}${CIFRA}`, { waitUntil: 'load' }); await attesa(2500); };
  // C: cambio di giorno, poi la scheda della tappa (passo alla dopo), poi la scheda del locale (dopo)
  await apri('c');
  await misura('C · giorno 1 → 2', `document.querySelector('[role="tab"][data-g="1"]').click()`);
  await attesa(800);
  await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="tappa"]').click()); await attesa(1200);
  await misura('C · scheda tappa → dopo', `document.querySelector('#scheda [data-azione="passo"][data-dir="1"]').click()`);
  await apri('c');
  await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="pasto-apri"]').click()); await attesa(700);
  await page.evaluate(() => document.querySelector('.mn-v summary').click()); await attesa(300);
  await page.evaluate(() => document.querySelector('#foglio [data-f="scheda"]').click()); await attesa(900);
  await misura('C · scheda locale → dopo', `document.querySelector('.pl-sf--dopo').click()`);
  // D sul telefono: le pagine dei giorni scorrono di lato
  await apri('d');
  await misura('D · giorno 1 → 2 (scorrendo)', `const p = document.querySelector('#d-pagine'); p.scrollTo({ left: p.clientWidth, behavior: 'smooth' })`, 1800);
  await browser.close();
})();
