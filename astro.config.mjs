import { defineConfig } from 'astro/config';
import serviceWorker from './integrations/service-worker.mjs';

export default defineConfig({
  site: 'https://nextstop.vercel.app', // da aggiornare con l'indirizzo vero di Vercel, come SITO.url
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS dentro ogni pagina: meno richieste e pagine che funzionano anche offline
    inlineStylesheets: 'always'
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  integrations: [serviceWorker()]
});
