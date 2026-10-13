import { defineConfig } from 'astro/config';
import serviceWorker from './integrations/service-worker.mjs';
import preloadItinerari from './integrations/preload-itinerari.mjs';

export default defineConfig({
  site: 'https://nextstop-alpha.vercel.app', // come SITO.url in src/config/sito.ts
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS dentro ogni pagina: meno richieste e pagine che funzionano anche offline
    inlineStylesheets: 'always'
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  integrations: [preloadItinerari(), serviceWorker()]
});
