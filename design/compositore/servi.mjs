// Piccolo server per guardare le proposte nel browser dell'app (porta 4332). Solo Node, nessun pacchetto.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const TIPI = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
http.createServer((req, res) => {
  const nome = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
  const file = path.join(QUI, path.normalize(nome));
  if (!file.startsWith(QUI) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('Non trovato'); return; }
  res.writeHead(200, { 'content-type': TIPI[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  // Come fa claude.ai quando pubblica: la pagina riceve doctype, charset e viewport
  if (file.endsWith('.html')) { const t = fs.readFileSync(file, 'utf8'); res.end(/^<!doctype/i.test(t) ? t : `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>${t}</body></html>`); return; }
  fs.createReadStream(file).pipe(res);
}).listen(+(process.env.PORT || 4332), () => console.log(`Proposte su http://localhost:${process.env.PORT || 4332}/proposte.html`));
