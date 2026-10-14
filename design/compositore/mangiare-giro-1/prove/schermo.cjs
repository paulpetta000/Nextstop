// Pezzo 7 (richiesta di Enrico, 14/10/2026): quanto si vede scattare un passaggio. Registra i fotogrammi dello schermo (come un
// video) con il processore 4 volte più lento e conta le pause visibili: fotogrammi che arrivano dopo più di 50 ms, nei primi 900 ms.
// Uso: node design/compositore/mangiare-giro-1/prove/schermo.cjs <pagina.html> <cifra dell'indirizzo> [porta]
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const [PAGINA, CIFRA, PORTA = '4333'] = process.argv.slice(2);
const URL = `http://localhost:${PORTA}/${PAGINA}`;
const attesa = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();
  await page.evaluateOnNewDocument(() => { try { localStorage.clear(); localStorage.setItem('prova-mangiare-idea-1', '1'); } catch {} });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const misura = async (nome, fai) => {
    const t = [];
    cdp.on('Page.screencastFrame', f => { t.push(f.metadata.timestamp * 1000); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 20, everyNthFrame: 1 });
    await attesa(300);
    const t0 = Date.now();
    await page.evaluate(fai);
    await attesa(1200);
    await cdp.send('Page.stopScreencast');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    cdp.removeAllListeners('Page.screencastFrame');
    const dopo = t.filter(x => x >= t0 - 20 && x <= t0 + 900);
    const pause = []; for (let i = 1; i < dopo.length; i++) { const g = dopo[i] - dopo[i - 1]; if (g > 50) pause.push(`${Math.round(dopo[i - 1] - t0)}+${Math.round(g)}`); }
    console.log(`${nome}: ${dopo.length} fotogrammi in 900 ms; pause visibili: ${pause.length ? pause.join(' ') : 'nessuna'}`);
  };
  const apri = async v => { await page.goto(`${URL}?v=${Date.now()}#${v}${CIFRA}`, { waitUntil: 'load' }); await attesa(2500); };
  await apri('c');
  await misura('C · giorno 1 → 2', () => document.querySelector('[role="tab"][data-g="1"]').click());
  await attesa(800);
  await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="tappa"]').click()); await attesa(1200);
  await misura('C · scheda tappa → dopo', () => document.querySelector('#scheda [data-azione="passo"][data-dir="1"]').click());
  await apri('c');
  await page.evaluate(() => document.querySelector('.giorno-attivo [data-azione="pasto-apri"]').click()); await attesa(700);
  await page.evaluate(() => document.querySelector('.mn-v summary').click()); await attesa(300);
  await page.evaluate(() => document.querySelector('#foglio [data-f="scheda"]').click()); await attesa(900);
  await misura('C · scheda locale → dopo', () => document.querySelector('.pl-sf--dopo').click());
  await apri('d');
  await misura('D · giorno 1 → 2', () => { const p = document.querySelector('#d-pagine'); p.scrollTo({ left: p.clientWidth, behavior: 'smooth' }); });
  await browser.close();
})();
