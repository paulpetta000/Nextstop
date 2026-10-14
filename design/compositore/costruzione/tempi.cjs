// Il primo disegno del compositore su un telefono lento (processore 4 volte più lento): quando parte e finisce l'avvio,
// il primo disegno e il contenuto più grande, i compiti lunghi. Uso, con il sito acceso: node design/compositore/costruzione/tempi.cjs [porta]
const puppeteer = require('C:/Users/Windows11/tools/controlli/node_modules/puppeteer-core');
const PORTA = process.argv[2] || '4336';
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluateOnNewDocument(() => {
    window.__lcp = []; window.__lunghi = [];
    new PerformanceObserver(l => l.getEntries().forEach(e => window.__lcp.push([Math.round(e.startTime), e.element?.tagName + '.' + (e.element?.className || '')]))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => l.getEntries().forEach(e => window.__lunghi.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true });
  });
  for (let k = 0; k < 2; k++) {
    await page.goto(`http://localhost:${PORTA}/napoli/itinerari/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    const r = await page.evaluate(() => ({
      dcl: Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd),
      fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime),
      inizio: Math.round(performance.getEntriesByName('compositore-inizio')[0]?.startTime),
      fine: Math.round(performance.getEntriesByName('compositore-fine')[0]?.startTime),
      lcp: window.__lcp, lunghi: window.__lunghi
    }));
    console.log(JSON.stringify(r));
  }
  await browser.close();
})();
