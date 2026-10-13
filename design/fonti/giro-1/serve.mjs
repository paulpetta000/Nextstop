// Server di sola lettura, locale. Espone solo i prototipi, i font già presenti e il sito costruito.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const demo = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(demo, '../../..');
const dist = path.join(root, 'dist');
const publicDir = path.join(root, 'public');
const prefix = '/design/fonti/giro-1/';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') { res.writeHead(302, { Location: prefix + 'index.html' }); res.end(); return; }
    const [base, relative] = pathname.startsWith(prefix) ? [demo, pathname.slice(prefix.length)] : pathname.startsWith('/fonts/') || pathname === '/favicon.svg' ? [publicDir, pathname.slice(1)] : [dist, pathname.slice(1)];
    let file = path.resolve(base, relative || 'index.html');
    if (file !== base && !file.startsWith(base + path.sep)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('Non trovato'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(400); res.end('Richiesta non valida'); }
});
server.listen(4343, '127.0.0.1', () => console.log('Prototipi: http://127.0.0.1:4343/design/fonti/giro-1/index.html'));
