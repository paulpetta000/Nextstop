// Stesso lettore per le uscite del generatore e i pacchi ricevuti dal browser.
const record=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const numero=x=>Number.isFinite(x)&&x>=0;
const chiave=(x,n)=>typeof x==='string'&&x.split('|').length===n&&x.split('|').every(Boolean);
const errore=d=>{throw new Error('Calendario bus: '+d);};
export function dataFeed(s) {
  if(typeof s!=='string'||!/^\d{8}$/.test(s))return false;
  const d=new Date(Date.UTC(+s.slice(0,4),+s.slice(4,6)-1,+s.slice(6)));
  return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10).replace(/-/g,'')===s;
}
function somme(v, nome) {
  if(!Array.isArray(v)||!v.length)errore('partenze mancanti per '+nome);
  let t=0;
  return Array.from(v,x=>{if(!numero(x)||!Number.isFinite(t+=x))errore('partenze non valide per '+nome);return t;});
}
export function leggiCalendarioBus(P) {
  if(!record(P)||!dataFeed(P.dal)||!dataFeed(P.al)||P.dal>P.al||!record(P.giorni)||!Array.isArray(P.tipi)||!record(P.fermate)||!Object.values(P.fermate).every(x=>typeof x==='string'))errore('date, tipi o fermate non validi');
  for(const [d,i] of Object.entries(P.giorni))if(!dataFeed(d)||d<P.dal||d>P.al||!Number.isSafeInteger(i)||i<0||i>=P.tipi.length)errore('giorno non valido: '+d);
  const salite=[],viaggi=[];
  for(let i=0;i<P.tipi.length;i++) {
    const tipo=P.tipi[i];
    if(!record(tipo)||!record(tipo.salite)||!record(tipo.viaggi))errore('tipo incompleto: '+i);
    const s=new Map();
    for(const [k,v] of Object.entries(tipo.salite)) {
      if(!chiave(k,2))errore('salita non valida: '+k);
      s.set(k,somme(v,k));
    }
    const insieme=new Map([...s].map(([k,v])=>[k,new Set(v)]));
    const vv=new Map();
    for(const [k,v] of Object.entries(tipo.viaggi)) {
      if(!chiave(k,3))errore('corsa non valida: '+k);
      const salita=k.split('|').slice(0,2).join('|'), partenzeSalita=s.get(salita);
      if(!partenzeSalita)errore('salita mancante per la corsa '+k);
      const min=Array.isArray(v)?v[0]:v;
      if(!numero(min))errore('durata non valida per '+k);
      const partenze=Array.isArray(v)?somme(v.slice(1),k):undefined;
      if(partenze&&!partenze.every(t=>insieme.get(salita).has(t)))errore('partenze della corsa assenti dalla salita: '+k);
      if(!Number.isFinite(min+(partenze??partenzeSalita).at(-1)))errore('arrivo non finito per '+k);
      vv.set(k,{min,...(partenze?{partenze}:{})});
    }
    salite.push(s);viaggi.push(vv);
  }
  return {salite,viaggi};
}
