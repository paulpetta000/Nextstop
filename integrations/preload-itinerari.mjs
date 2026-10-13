// Precarica solo le dipendenze statiche dei moduli già presenti negli itinerari.
// Nessun import dinamico (mappa), servizio esterno o cambiamento alla cache offline.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function precaricaDipendenze(html, leggiModulo) {
  const iniziali=new Set([...html.matchAll(/<script\b[^>]*\bsrc="(\/_astro\/[\w.-]+\.js)"/g)].map(m=>m[1]));
  const visitati=new Set(),dipendenze=new Set();
  const visita=url=>{
    if(visitati.has(url))return;
    visitati.add(url);
    const js=leggiModulo(url);
    for(const m of js.matchAll(/\bimport\s*(?:[^;"']*?\bfrom\s*)?["'](\.\/[\w.-]+\.js)["']/g)){
      const dep='/_astro/'+m[1].slice(2);
      if(!iniziali.has(dep))dipendenze.add(dep);
      visita(dep);
    }
  };
  iniziali.forEach(visita);
  const links=[...dipendenze].filter(url=>!html.includes(`rel="modulepreload" href="${url}"`)).map(url=>`<link rel="modulepreload" href="${url}">`).join('');
  return links?html.replace('</head>',links+'</head>'):html;
}

export default function preloadItinerari(){
  return {name:'preload-itinerari',hooks:{'astro:build:done':({dir,logger})=>{
    const root=fileURLToPath(dir),file=path.join(root,'napoli/itinerari/index.html');
    const html=fs.readFileSync(file,'utf8');
    const aggiornato=precaricaDipendenze(html,url=>fs.readFileSync(path.join(root,url),'utf8'));
    if(aggiornato!==html){fs.writeFileSync(file,aggiornato);logger.info('Dipendenze statiche degli itinerari precaricate');}
  }}};
}
