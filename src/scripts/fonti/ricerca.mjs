// Filtro del documento e orientamento dei luoghi hanno criteri distinti.
/** @param {string} text */
export const normalizza=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
/** @param {string} term */
export const equivalente=term=>term.replace(/\bcosto\b/g,'prezzo').replace(/\bcosti\b/g,'prezzi').replace(/\bbiglietto\b/g,'biglietti');
const connettivi=new Set(['a','al','alla','alle','con','da','dal','dalla','di','e','il','in','la','le','lo','per','su','un','una']);
/** @param {string[]} luoghi @param {string} query */
export function luogoCercato(luoghi,query){
  const normal=normalizza(query);
  const words=normal.split(' ').filter(w=>w.length>1&&!connettivi.has(w));
  if(!words.length)return null;
  const ranked=luoghi.map((luogo,index)=>{
    const name=normalizza(luogo);const terms=name.split(' ');
    const full=name&&normal.includes(name);
    const score=full?100:words.reduce((n,w)=>n+(terms.some(t=>t.startsWith(w))?w.length:0),0);
    return {luogo,index,score};
  }).sort((a,b)=>b.score-a.score||a.index-b.index);
  // In caso di parità nessun luogo è dichiarato il più pertinente.
  return ranked[0]?.score>0&&ranked[0].score!==ranked[1]?.score?ranked[0].luogo:null;
}
