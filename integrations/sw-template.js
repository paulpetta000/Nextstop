/* Service worker della guida: pagine pratiche disponibili anche senza rete. */
const VERSION = '__VERSION__';
const CORE = __PRECACHE__;
const PAGES = `pagine-${VERSION}`;
const ASSETS = 'risorse-v1'; // immagini e risorse immutabili già viste: restano fra i rilasci
const DATA_VERSION = '__DATA_VERSION__';
const DATA = `dati-${DATA_VERSION}`;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(PAGES).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => (k.startsWith('pagine-') && k !== PAGES) || (k.startsWith('dati-') && k !== DATA)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const timeout = (ms, p) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('timeout')), ms); p.then(v => { clearTimeout(t); res(v); }, e => { clearTimeout(t); rej(e); }); });

// Un problema della memoria locale non deve impedire di usare la rete.
const apri = async nome => { try { return await caches.open(nome); } catch { return null; } };
const leggi = async (cache, req, opzioni) => { try { return await (await cache)?.match(req, opzioni); } catch { return undefined; } };

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Pagine: prima la rete (dati freschi), poi la copia salvata, infine la pagina "offline"
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await apri(PAGES);
      try {
        const res = await timeout(4000, fetch(req));
        if (res.status >= 500) return (await leggi(cache, req, { ignoreSearch: true })) || res;
        if (res.ok && cache) await cache.put(req, res.clone()).catch(() => {});
        return res;
      } catch {
        return (await leggi(cache, req, { ignoreSearch: true })) || (await leggi(cache, '/offline/')) || Response.error();
      }
    })());
    return;
  }

  // File con nome che cambia a ogni versione: prima la copia salvata (anche quella fatta all'installazione)
  if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith((async () => {
      const hit = (await leggi(apri(PAGES), req)) || (await leggi(apri(ASSETS), req));
      if (hit) return hit;
      const res = await fetch(req);
      const cache = await apri(ASSETS);
      if (res.ok && cache) await cache.put(req, res.clone()).catch(() => {});
      return res;
    })());
    return;
  }

  // I dati della città devono appartenere al rilascio corrente. La precache corrente
  // prevale sempre; le foto immutabili restano invece nella memoria condivisa ASSETS.
  const archivio = apri(url.pathname.startsWith('/napoli/itinerari/') ? DATA : ASSETS);
  const precache = leggi(apri(PAGES), req);
  const aggiornamento = precache.then(async hit => {
    if (hit) return hit;
    try {
      const res = await fetch(req);
      const cache = await archivio;
      if (res.ok && cache) await cache.put(req, res.clone()).catch(() => {});
      return res;
    } catch { return undefined; }
  });
  // Registrato durante il callback: il worker non termina mentre salva l'aggiornamento.
  event.waitUntil(aggiornamento.then(() => {}));
  event.respondWith((async () => {
    const hit = (await precache) || (await leggi(archivio, req));
    return hit || (await aggiornamento) || Response.error();
  })());
});
