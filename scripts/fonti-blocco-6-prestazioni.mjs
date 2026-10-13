// Misure sequenziali, profili nuovi e server loopback identici.
// "confronto" usa HTTP grezzo; le altre serie usano gzip dichiarato.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {gzipSync} from 'node:zlib';
const dir='docs/storico/fonti-blocco-6-verifiche';
const mode=process.argv[2]||'confronto';
const variants=mode.startsWith('confronto')?['base','integrato','senza-pannello']:mode==='prove'?['chiuso','precarica','rendering']:mode==='prove-2'?['combinata','completa']:mode==='prove-3'?['pannello','pannello-chiuso']:mode==='prove-4'?['fonti-completa']:mode==='prove-5'?['modulo']:['finale'];
const gzip=mode!=='confronto';
function senzaPannello(html) {
 const start=html.indexOf('<section class="fonti-pannello');
 if(start<0)throw Error('Pannello non trovato');
 let depth=0;
 for(const m of html.slice(start).matchAll(/<\/?section\b[^>]*>/g)){
  depth+=m[0].startsWith('</')?-1:1;
  if(!depth)return html.slice(0,start)+html.slice(start+m.index+m[0].length);
 }
 throw Error('Confine pannello non trovato');
}
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.ico':'image/x-icon','.webmanifest':'application/manifest+json'};
const servers=variants.map((variant,i)=>{
 const root=path.resolve(variant==='base'?'.astro/fonti-blocco-6/base/dist':['finale','modulo'].includes(variant)?'dist':`.astro/fonti-blocco-6/${['chiuso','precarica','rendering','combinata','completa','pannello','pannello-chiuso','fonti-completa'].includes(variant)?'integrato':variant}`);
 return http.createServer((req,res)=>{
  try{let file=path.resolve(root,'.'+new URL(req.url,'http://127.0.0.1').pathname);if(!file.startsWith(root+path.sep))throw Error();if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
   let data=fs.readFileSync(file);if(variant==='senza-pannello'&&file.endsWith(path.join('itinerari','index.html')))data=Buffer.from(senzaPannello(data.toString()));
   if(['precarica','rendering','combinata','completa','fonti-completa'].includes(variant)&&file.endsWith(path.join('itinerari','index.html')))data=Buffer.from(data.toString().replace('</head>',`<link rel="preload" href="/fonts/barlow-600.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/bodoni-moda-500-corsivo.woff2" as="font" type="font/woff2" crossorigin>${['rendering','completa'].includes(variant)?'<style>.it-sezione{content-visibility:auto;contain-intrinsic-size:auto 1500px}</style>':''}</head>`));
   if(['chiuso','combinata','completa'].includes(variant)&&file.endsWith(path.join('itinerari','index.html')))data=Buffer.from(data.toString().replace('</head>','<style>.fonti-pannello .disclosure:not([open])>.body{display:none}</style></head>'));
   if((variant.startsWith('pannello')||variant==='fonti-completa')&&file.endsWith(path.join('itinerari','index.html')))data=Buffer.from(data.toString().replace('</head>',`<style>.fonti-pannello{content-visibility:auto;contain-intrinsic-size:auto 300px}${['pannello-chiuso','fonti-completa'].includes(variant)?'.fonti-pannello .disclosure:not([open])>.body{display:none}':''}</style></head>`));
   if(variant==='modulo'&&file.endsWith(path.join('itinerari','index.html')))data=Buffer.from(data.toString().replace('</head>','<link rel="modulepreload" href="/_astro/date.B51c-ayX.js"></head>'));
   const compress=gzip&&/\.(html|js|json|css|svg|webmanifest)$/.test(file)&&/gzip/.test(req.headers['accept-encoding']||'');
   if(compress)data=gzipSync(data);
   res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':data.length,...(compress?{'Content-Encoding':'gzip'}:{})});res.end(data);
  }catch{res.writeHead(404).end();}
 }).listen(4326+i,'127.0.0.1');
});
const rows=[];
try{
 const paths=process.env.FONTI_PATH?[process.env.FONTI_PATH]:mode.startsWith('confronto')||mode.startsWith('prove')?['/napoli/itinerari/']:['/napoli/itinerari/','/fonti/','/napoli/dove-mangiare/'];
 for(const pathname of paths)for(let run=1;run<=Number(process.env.FONTI_RUNS||3);run++)for(const theme of ['light','dark'])for(const [i,variant] of variants.entries()) {
  const output=`${dir}/lh-${mode}-${variant}-${pathname.split('/').filter(Boolean).join('-')}-${theme}-${run}.json`;
  const args=['C:/Users/Windows11/tools/controlli/node_modules/lighthouse/cli/index.js',`http://127.0.0.1:${4326+i}${pathname}`,'--no-enable-error-reporting','--quiet','--only-categories=performance,accessibility,best-practices','--form-factor=mobile',`--chrome-flags=--headless=new --disable-background-networking --disable-component-update --no-first-run${theme==='dark'?' --force-dark-mode':''}`,'--output=json',`--output-path=${output}`];
  await new Promise((resolve,reject)=>{const p=spawn(process.execPath,args,{env:{...process.env,CHROME_PATH:'C:/Program Files/Google/Chrome/Application/chrome.exe'},stdio:['ignore','ignore','pipe']});let err='';p.stderr.on('data',b=>err+=b);p.on('exit',code=>code===0?resolve():reject(Error(err)));p.on('error',reject);});
  const r=JSON.parse(fs.readFileSync(output));
  const audits=['first-contentful-paint','largest-contentful-paint','total-blocking-time','speed-index','cumulative-layout-shift'];
  const row={variant,pathname,theme,run,gzip,report:output,performance:r.categories.performance.score*100,accessibility:r.categories.accessibility.score*100,bestPractices:r.categories['best-practices'].score*100,metrics:Object.fromEntries(audits.map(k=>[k,r.audits[k].numericValue])),mainthread:r.audits['mainthread-work-breakdown'].details.items,errors:r.audits['errors-in-console'].details?.items||[],warnings:r.runWarnings,version:r.lighthouseVersion,settings:r.configSettings,environment:r.environment};
  rows.push(row);fs.writeFileSync(`${dir}/prestazioni-${mode}.json`,JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify({variant,pathname,theme,run,performance:row.performance,metrics:row.metrics}));
 }
}finally{servers.forEach(s=>s.close());}
