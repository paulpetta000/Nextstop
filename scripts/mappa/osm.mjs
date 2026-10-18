// Lettura dei riquadri XML scaricati dall'API di OpenStreetMap (api/0.6/map).
// Parser minimale: l'XML dell'API ha una struttura fissa (node, way, relation con tag, nd, member).
import fs from 'node:fs';
import path from 'node:path';

// Sottoinsieme dell'XML API 0.6: niente DTD o espansione di entità esterne.
const ATR = String.raw`(?:[^<>"']|"[^"]*"|'[^']*')*?`;
const errore = (file, dettaglio) => { throw new Error(`OSM XML ${file}: ${dettaglio}`); };
function decodifica(s, file) {
  const re = /&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-fA-F]+);/g;
  if (s.replace(re,'').includes('&')) errore(file,'entità XML non valida');
  const nomi = {amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'};
  return s.replace(re,x=>{
    const e=x.slice(1,-1); if(Object.hasOwn(nomi,e))return nomi[e];
    const n=e.startsWith('#x')?parseInt(e.slice(2),16):+e.slice(1);
    if(!Number.isSafeInteger(n)||n>0x10ffff||(n<32&&![9,10,13].includes(n))||(n>=0xd800&&n<=0xdfff))errore(file,'carattere XML non valido');
    return String.fromCodePoint(n);
  });
}
function attributi(s, file) {
  const out = Object.create(null), re=/([A-Za-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let prima=0;
  for(const m of s.matchAll(re)) {
    if(!s.slice(prima,m.index).length||s.slice(prima,m.index).trim()||Object.hasOwn(out,m[1])||(m[2]??m[3]).includes('<'))errore(file,'attributi malformati o ripetuti');
    out[m[1]]=decodifica(m[2]??m[3],file);prima=m.index+m[0].length;
  }
  if(s.slice(prima).trim())errore(file,'attributi incompleti');
  return out;
}
function idValido(id, file) {
  if(typeof id!=='string'||!/^\d+$/.test(id)||!/[1-9]/.test(id))errore(file,'identificativo mancante o non valido');
  return id;
}
function coordinata(s, limite, file) {
  if(typeof s!=='string'||!s.trim()||!Number.isFinite(+s)||Math.abs(+s)>limite)errore(file,'coordinata mancante o non valida');
  return +s;
}
function unisciTag(a,b,file) {
  for(const [k,v] of Object.entries(b))if(Object.hasOwn(a,k)&&a[k]!==v)errore(file,'tag discordante: '+k);
  return {...a,...b};
}
function senzaCommenti(xml,file) {
  const pezzi=[];let prima=0,tag=false,virgolette=null;
  for(let i=0;i<xml.length;i++) {
    const c=xml[i];
    if(virgolette) { if(c===virgolette)virgolette=null;continue; }
    if(xml.startsWith('<!--',i)) {
      const fine=xml.indexOf('-->',i+4);if(fine<0)errore(file,'commento XML incompleto');
      pezzi.push(xml.slice(prima,i));i=fine+2;prima=i+1;continue;
    }
    if(c==='<')tag=true;else if(c==='>')tag=false;else if(tag&&(c==='"'||c==="'"))virgolette=c;
  }
  pezzi.push(xml.slice(prima));return pezzi.join('');
}
export function leggiXml(xml, file='riquadro') {
  if(Buffer.isBuffer(xml)) {
    try { xml=new TextDecoder('utf-8',{fatal:true}).decode(xml); }
    catch { errore(file,'byte UTF-8 non validi'); }
  }
  if(typeof xml!=='string'||/<!DOCTYPE|<!ENTITY|<!\[CDATA\[/i.test(xml))errore(file,'formato XML non supportato');
  const pulito=senzaCommenti(xml.replace(/^\uFEFF/,''),file).replace(/^\s*<\?xml[\s\S]*?\?>\s*/, '');
  const root=new RegExp(`^\\s*<osm\\b(${ATR})(?:/\\s*>|>([\\s\\S]*)</osm\\s*>)\\s*$`).exec(pulito);
  if(!root)errore(file,'documento incompleto o radice diversa da osm');
  attributi(root[1],file);
  const nodes=new Map(),ways=new Map(),rels=new Map();
  const elemento=(kind,head,body='')=>{
    const a=attributi(head,file),id=idValido(a.id,file),tags={},nds=[],members=[];
    if(a.visible==='false')errore(file,'elemento cancellato nel riquadro');
    const child=new RegExp(`<(tag|nd|member)\\b(${ATR})/\\s*>`,'g');
    const r=body.replace(child,(_,tipo,head)=>{
      const v=attributi(head,file);
      if(tipo==='tag') {
        if(typeof v.k!=='string'||!v.k||typeof v.v!=='string')errore(file,'tag incompleto');
        if(Object.hasOwn(tags,v.k)&&tags[v.k]!==v.v)errore(file,'tag ripetuto discordante');
        Object.defineProperty(tags,v.k,{value:v.v,enumerable:true,configurable:true});
      } else if(tipo==='nd'&&kind==='way')nds.push(idValido(v.ref,file));
      else if(tipo==='member'&&kind==='relation') {
        if(!['node','way','relation'].includes(v.type))errore(file,'tipo di membro non valido');
        members.push({type:v.type,ref:idValido(v.ref,file),role:v.role??''});
      } else errore(file,'elemento figlio non previsto in '+kind);
      return '';
    });
    if(r.trim())errore(file,'contenuto incompleto o non supportato in '+kind+' '+id);
    const m=kind==='node'?nodes:kind==='way'?ways:rels;
    if(m.has(id))errore(file,'identificativo ripetuto nel riquadro: '+kind+' '+id);
    if(kind==='node')m.set(id,{id,lat:coordinata(a.lat,90,file),lon:coordinata(a.lon,180,file),tags});
    else if(kind==='way') {
      if(nds.length<2)errore(file,'via con meno di due nodi: '+id);
      m.set(id,{id,nds,tags});
    } else m.set(id,{id,members,tags});
  };
  const interno=root[2]??'',re=new RegExp(`<(node|way|relation)\\b(${ATR})(/\\s*>|>)`,'g'),resti=[];
  let prima=0;
  for(let m;(m=re.exec(interno));) {
    resti.push(interno.slice(prima,m.index));let body='';
    if(m[3]==='>') {
      const chiusura=new RegExp(`</${m[1]}\\s*>`,'g');chiusura.lastIndex=re.lastIndex;
      const fine=chiusura.exec(interno);if(!fine)errore(file,'elemento non chiuso: '+m[1]);
      body=interno.slice(re.lastIndex,fine.index);re.lastIndex=chiusura.lastIndex;
    }
    elemento(m[1],m[2],body);prima=re.lastIndex;
  }
  resti.push(interno.slice(prima));
  const resto=resti.join('').replace(new RegExp(`<(?:bounds|meta)\\b${ATR}/\\s*>`,'g'),'').replace(/<note\b[^>]*>[^<]*<\/note\s*>/g,'');
  if(resto.trim())errore(file,'elementi incompleti o non supportati');
  return {nodes,ways,rels};
}
export function loadTiles(dir) {
  const nodes=new Map(),ways=new Map(),rels=new Map();
  const file=fs.readdirSync(dir).filter(f=>f.endsWith('.xml')).sort();
  if(!file.length)errore(dir,'nessun riquadro XML');
  for(const f of file) {
    const dati=leggiXml(fs.readFileSync(path.join(dir,f)),f);
    for(const [kind,dest] of [['nodes',nodes],['ways',ways],['rels',rels]])for(const [id,x] of dati[kind]) {
      const prima=dest.get(id);
      if(prima) {
        if(kind==='nodes'?(prima.lat!==x.lat||prima.lon!==x.lon):JSON.stringify(prima[kind==='ways'?'nds':'members'])!==JSON.stringify(x[kind==='ways'?'nds':'members']))errore(f,'geometria discordante: '+kind+' '+id);
        prima.tags=unisciTag(prima.tags,x.tags,f);
      } else dest.set(id,x);
    }
  }
  for(const [id,w] of ways)for(const ref of w.nds)if(!nodes.has(ref))errore(dir,`nodo ${ref} assente dalla via ${id}`);
  return {nodes,ways,rels};
}
