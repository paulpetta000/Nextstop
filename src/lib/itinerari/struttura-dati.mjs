// Contratto delle uscite di scripts/itinerari/costruisci.mjs, prima della
// scrittura e della build. Non certifica fonti, traffico o condizioni sul posto.
import { leggiCalendarioBus } from './calendario-bus.mjs';
import { decodificaPercorso } from './percorsi-compressi.mjs';
const SCENARI = ['feriale', 'sabato', 'sabato-pomeriggio', 'domenica', 'festivo', 'piedi'];
const record = x => !!x && typeof x === 'object' && !Array.isArray(x);
const testo = x => typeof x === 'string' && x.length > 0;
const numero = x => Number.isFinite(x) && x >= 0;
const indice = (x, n) => Number.isSafeInteger(x) && x >= 0 && x < n;
const lista = (a,valida) => Array.isArray(a) && Array.from(a).every(valida);
const uguali = (a,b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && lista(a,(x,i) => x === b[i]);
const proprio = (o,k) => Object.hasOwn(o,k);
function errore(file, dettaglio) { throw new Error(`Dati generati: ${file}: ${dettaglio}; rifai tutto con node scripts/itinerari/costruisci.mjs <cartella>`); }
function matrice(m, n, valida, file, campo) {
  if (!Array.isArray(m) || m.length !== n) errore(file, `${campo}: righe incomplete`);
  for (let i=0;i<n;i++) {
    if (!Array.isArray(m[i]) || m[i].length !== n) errore(file, `${campo}[${i}]: colonne incomplete`);
    for (let j=0;j<n;j++) if (!valida(m[i][j],i,j)) errore(file, `${campo}[${i}][${j}]: valore non valido`);
  }
}
export function verificaStruttura(dati) {
  const T=dati['tempi-tappe.json'], P=dati['partenze-bus.json'], D=dati['percorsi-tappe.json'], A=dati['percorsi-alternativi.json'];
  for (const [nome,d] of Object.entries({ 'tempi-tappe.json':T, 'partenze-bus.json':P, 'percorsi-tappe.json':D, 'percorsi-alternativi.json':A })) {
    if (!record(d)) errore(nome,'file mancante o non valido');
    if (!testo(d.firma) || d.firma !== T.firma) errore(nome,'firma delle posizioni diversa dai tempi');
  }
  if (!record(dati['linee-bus.json'])) errore('linee-bus.json','file mancante o non valido');
  if (!lista(T.punti,testo) || !T.punti.length || new Set(T.punti).size !== T.punti.length) errore('tempi-tappe.json','punti mancanti o ripetuti');
  const n=T.punti.length;
  if (!uguali(T.punti,D.punti)) errore('percorsi-tappe.json','punti diversi dai tempi o in altro ordine');
  if (!Array.isArray(T.candidati) || !lista(A.candidati,x=>typeof x==='string') || A.candidati.length !== T.candidati.length) errore('percorsi-alternativi.json','disegni dei candidati incompleti');
  if (!lista(T.linee,x=>record(x)&&testo(x.id)&&testo(x.nome)) || new Set(T.linee.map(x=>x.id)).size!==T.linee.length) errore('tempi-tappe.json','linee mancanti o ripetute');
  const linee=new Set(T.linee.map(x=>x.id));
  const disegniValidi=new Set();
  const disegno=(s,vuoto=false)=>{
    if(s===''&&vuoto)return true;
    if(typeof s!=='string'||!s||s.split('~').some(p=>!p))return false;
    if(disegniValidi.has(s))return true;
    const pezzi=decodificaPercorso(s);
    if(!pezzi.length||pezzi.some(p=>!p.punti.length||(p.modo!=='p'&&!linee.has(p.modo))))return false;
    disegniValidi.add(s);return true;
  };
  for(let k=0;k<A.candidati.length;k++)if(!disegno(A.candidati[k]))errore('percorsi-alternativi.json',`disegno del candidato ${k} non valido`);
  const corsa=x=>typeof x==='string' && /^[^|]+\|[^|]+\|[^|]+$/.test(x) && linee.has(x.split('|')[0]);
  for (let k=0;k<T.candidati.length;k++) {
    const c=T.candidati[k];
    if (!record(c) || !lista(c.seg,x=>numero(x)||corsa(x)) || !c.seg.some(corsa) || !numero(c.m) || typeof c.mezzi!=='string') errore('tempi-tappe.json',`candidato ${k} non valido`);
  }
  if (!record(T.scenari) || !record(D.scenari) || !record(A.senza)) errore('tempi-tappe.json','scenari mancanti');
  const usati=new Set();
  const quantitativo=(x,i,j)=>numero(x) && (i!==j||x===0);
  for (const nome of SCENARI) {
    const s=T.scenari[nome];
    if (!record(s)) errore('tempi-tappe.json',`scenario ${nome} mancante`);
    for (const campo of ['min','piedi','salita']) matrice(s[campo],n,quantitativo,'tempi-tappe.json',`${nome}.${campo}`);
    if (nome!=='piedi' || s.mezzi!==undefined) matrice(s.mezzi,n,x=>typeof x==='string','tempi-tappe.json',`${nome}.mezzi`);
    matrice(D.scenari[nome],n,(x,i,j)=>(nome!=='feriale'&&x===0)||disegno(x,i===j),'percorsi-tappe.json',nome);
    if (nome==='piedi') continue;
    if (!record(s.senza)) errore('tempi-tappe.json',`${nome}.senza mancante`);
    for (const campo of ['min','piedi']) matrice(s.senza[campo],n,quantitativo,'tempi-tappe.json',`${nome}.senza.${campo}`);
    matrice(s.senza.mezzi,n,x=>typeof x==='string','tempi-tappe.json',`${nome}.senza.mezzi`);
    matrice(s.bus,n,x=>{
      if (x===0) return true;
      if (!Array.isArray(x)||!x.length) return false;
      for (const k of x) { if (!indice(k,T.candidati.length)) return false; usati.add(k); }
      return true;
    },'tempi-tappe.json',`${nome}.bus`);
    matrice(A.senza[nome],n,(x,i,j)=>x===0||disegno(x,i===j),'percorsi-alternativi.json',nome);
  }
  try { leggiCalendarioBus(P); }
  catch(e) { errore('partenze-bus.json',e.message); }
  const servite=new Set();
  for (let i=0;i<P.tipi.length;i++) {
    const tipo=P.tipi[i];
    for (const k of Object.keys(tipo.viaggi)) {
      if (!corsa(k)) errore('partenze-bus.json',`corsa ${k} non valida`);
      const [,da,a]=k.split('|');
      if (!proprio(P.fermate,da)||!testo(P.fermate[da])||!proprio(P.fermate,a)||!testo(P.fermate[a])) errore('partenze-bus.json',`fermate mancanti per ${k}`);
      servite.add(k);
    }
  }
  for (const k of usati) for (const s of T.candidati[k].seg) if (typeof s==='string'&&!servite.has(s)) errore('partenze-bus.json',`nessuna corsa serve ${s} del candidato ${k}`);
}
