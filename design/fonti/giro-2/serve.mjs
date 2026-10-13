// Server locale di sola lettura: espone entrambi i giri per il confronto.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const demo = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(demo, '../../..');
const prefix = '/design/fonti/giro-2/';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    if (pathname === '/') { res.writeHead(302, { Location: prefix + 'index.html' }); res.end(); return; }
    const prototype = pathname.match(/^\/design\/fonti\/(giro-[12])\//);
    const [base, relative] = prototype ? [path.join(root, 'design/fonti', prototype[1]), pathname.slice(prototype[0].length)] : pathname.startsWith('/fonts/') || pathname === '/favicon.svg' ? [path.join(root, 'public'), pathname.slice(1)] : [path.join(root, 'dist'), pathname.slice(1)];
    let file = path.resolve(base, relative || 'index.html');
    if (file !== base && !file.startsWith(base + path.sep)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('Non trovato'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(400); res.end('Richiesta non valida'); }
});
server.listen(4344, '127.0.0.1', () => console.log('Secondo giro: http://127.0.0.1:4344/design/fonti/giro-2/index.html'));
