// Nessuna rete, cookie o archivio locale. La ricerca si conserva solo nella cronologia di questa scheda.
(() => {
  const input=document.querySelector('#cerca-fonti');
  const theme=document.querySelector('[data-theme]');
  document.documentElement.classList.add('js');
  const dark=()=>document.documentElement.dataset.theme ? document.documentElement.dataset.theme==='dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  const themeLabel=()=>{if(theme) theme.textContent=dark()?'Usa tema chiaro':'Usa tema scuro';};
  if(theme){theme.disabled=false;themeLabel();theme.addEventListener('click',()=>{document.documentElement.dataset.theme=dark()?'light':'dark';themeLabel();});matchMedia('(prefers-color-scheme:dark)').addEventListener('change',themeLabel);}
  if(!input) return;
  input.disabled=false;
  const sources=[...document.querySelectorAll('.source')];
  const panels=[...document.querySelectorAll('.topic')];
  const status=document.querySelector('[data-status]');
  const reset=document.querySelector('[data-reset]');
  const empty=document.querySelector('.empty');
  const initial=new Map(panels.map(p=>[p,p.open]));
  const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const equivalent=term=>term.replace(/\bcosto\b/g,'prezzo').replace(/\bcosti\b/g,'prezzi').replace(/\bbiglietto\b/g,'biglietti');
  let searchIndex;
  const filter=()=>{
    const query=equivalent(normalize(input.value)); const words=query.split(' ').filter(Boolean);
    let count=0;
    searchIndex ||= new Map(sources.map(s=>[s,equivalent(normalize(s.textContent+' '+s.dataset.keywords+' '+JSON.parse(s.dataset.places).join(' ')))]));
    for(const source of sources){
      const match=words.every(w=>searchIndex.get(source).includes(w)); source.hidden=!match; if(match) count++;
      const places=JSON.parse(source.dataset.places); const context=source.querySelector('[data-context]');
      if(places.length&&context){const matched=query ? places.find(p=>words.some(w=>normalize(p).includes(w))) : null;context.textContent=matched?`${matched}${places.length>1?' / '+places.filter(p=>p!==matched).join(' / '):''}`:places.join(' / ');}
    }
    for(const panel of panels){
      const shown=[...panel.querySelectorAll('.source')].filter(s=>!s.hidden).length;
      panel.hidden=!shown;
      panel.querySelector('[data-count]').textContent=`${shown} ${shown===1?'documento':'documenti'}`;
      if(query)panel.open=shown>0;else panel.open=initial.get(panel);
      panel.querySelectorAll('.place-group').forEach(g=>g.hidden=![...g.querySelectorAll('.source')].some(s=>!s.hidden));
    }
    status.textContent=query?`${count} ${count===1?'documento trovato':'documenti trovati'} su ${sources.length}`:`${sources.length} documenti nell’elenco`;
    reset.hidden=!query;empty.hidden=count>0;
    history.replaceState({...history.state,fontiPrototipo:{query:input.value}},'');
    // Un rinvio condiviso non deve condurre a un risultato nascosto.
    document.querySelectorAll('.cross-reference').forEach(p=>p.hidden=!!query);
  };
  input.addEventListener('input',filter);
  const rail=document.querySelector('.results-rail');
  input.addEventListener('focus',()=>rail.dataset.editing='true');input.addEventListener('blur',()=>rail.dataset.editing='false');
  const restore=()=>{const saved=history.state?.fontiPrototipo?.query;if(typeof saved==='string')input.value=saved;if(input.value)filter();};
  addEventListener('pageshow',restore);restore();
  const resetAll=()=>{input.value='';filter();input.focus();};
  reset.addEventListener('click',resetAll);document.querySelector('[data-empty-reset]').addEventListener('click',resetAll);
  const reveal=target=>{if(!target)return;for(let p=target.parentElement;p;p=p.parentElement)if(p instanceof HTMLDetailsElement)p.open=true;if(target instanceof HTMLDetailsElement)target.open=true;};
  const navigate=()=>{const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));reveal(target);if(target)target.scrollIntoView({block:'start',behavior:'instant'});};
  document.querySelectorAll('[data-jump]').forEach(a=>a.addEventListener('click',()=>{if(input.value){input.value='';filter();}const target=document.getElementById(a.hash.slice(1));reveal(target);}));
  addEventListener('hashchange',navigate);if(location.hash)navigate();
  document.querySelector('[data-return]').addEventListener('click',()=>{input.focus({preventScroll:true});input.scrollIntoView({block:'center',behavior:'instant'});});
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){e.preventDefault();input.focus();input.scrollIntoView({block:'center',behavior:'instant'});}});
})();
