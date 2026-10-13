// Anteprima di dist con compressione HTTP, come l’hosting statico. Solo loopback.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const root=path.resolve(process.argv[2]||'dist');
const port=Number(process.argv[3]||4324);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.avif':'image/avif'};
const cache=new Map();
http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  let file=path.resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  const stat=fs.statSync(file);const compress=/\.(html|js|json|css|svg|txt|webmanifest)$/.test(file)&&/\bgzip\b/.test(req.headers['accept-encoding']||'');
  const key=file+':'+compress;let item=cache.get(key);
  if(!item||item.mtime!==stat.mtimeMs){const bytes=fs.readFileSync(file);item={mtime:stat.mtimeMs,body:compress?gzipSync(bytes):bytes};cache.set(key,item);}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':item.body.length,'Vary':'Accept-Encoding',...(compress?{'Content-Encoding':'gzip'}:{})});
  res.end(req.method==='HEAD'?undefined:item.body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Pagina non trovata');}
}).listen(port,'127.0.0.1',()=>console.log(`Anteprima locale con compressione: http://127.0.0.1:${port}/fonti/`));
