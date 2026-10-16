import { defineConfig } from 'astro/config';
import serviceWorker from './integrations/service-worker.mjs';
import preloadItinerari from './integrations/preload-itinerari.mjs';

export default defineConfig({
  site: 'https://nextstop-alpha.vercel.app', // come SITO.url in src/config/sito.ts
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS importati dentro ogni pagina. Il compositore completo usa ?url e viene precached.
    inlineStylesheets: 'always'
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  integrations: [preloadItinerari(), serviceWorker()]
});
