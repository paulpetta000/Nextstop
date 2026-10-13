// Ricerca locale, cronologia della sola scheda. Nessuna rete o scrittura nello storage.
import {normalizza,equivalente,luogoCercato} from './ricerca.mjs';
const input=document.querySelector('#cerca-fonti');
document.documentElement.classList.add('js');
if(input)initRegistro();
function initRegistro(){
  input.disabled=false;
  const sources=[...document.querySelectorAll('.source')];
  const panels=[...document.querySelectorAll('.topic')];
  const status=document.querySelector('[data-status]');
  const statusText=status.querySelector('span');
  const reset=document.querySelector('[data-reset]');
  const empty=document.querySelector('.empty');
  const rail=document.querySelector('.results-rail');
  const topics=document.querySelector('.topics');
  const searchBox=document.querySelector('.search-box');
  const indexLinks=[...document.querySelectorAll('.topic-index a')];
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  // I token servono al primo gesto, non al disegno iniziale dell'apertura.
  let tokens;
  const animations=new Map();
  let beforeSearch=null,searchIndex,composing=false;
  const snapshot=()=>new Map(panels.map(p=>[p.id,p.open]));
  const animate=(element,keyframes,token,id)=>{
    animations.get(element)?.cancel();animations.delete(element);
    if(reduced.matches||typeof element.animate!=='function')return;
    tokens ||= getComputedStyle(document.documentElement);
    const animation=element.animate(keyframes,{duration:parseFloat(tokens.getPropertyValue(token)),easing:tokens.getPropertyValue('--entra').trim(),id});
    animations.set(element,animation);animation.finished.then(()=>{if(animations.get(element)===animation)animations.delete(element);},()=>{});
  };
  reduced.addEventListener('change',()=>{if(reduced.matches){for(const a of animations.values())a.cancel();animations.clear();}});
  const activeTopic=id=>indexLinks.forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  const store=()=>history.replaceState({...history.state,fontiRegistro:{query:input.value,panels:[...snapshot()],beforeSearch:beforeSearch?[...beforeSearch]:null}},'');
  const filter=({motion=true}={})=>{
    const query=equivalente(normalizza(input.value));const words=query.split(' ').filter(Boolean);
    if(query&&!beforeSearch)beforeSearch=snapshot();
    const restoring=!query&&beforeSearch;
    let count=0;
    searchIndex ||= new Map(sources.map(s=>[s,equivalente(normalizza(s.textContent+' '+(s.dataset.keywords||'')+' '+s.dataset.topic+' '+JSON.parse(s.dataset.places).join(' ')))]));
    for(const source of sources){
      const match=words.every(w=>searchIndex.get(source).includes(w));source.hidden=!match;if(match)count++;
      const places=JSON.parse(source.dataset.places);const context=source.querySelector('[data-context]');
      if(places.length&&context){const found=query?luogoCercato(places,query):null;context.textContent=found?[found,...places.filter(p=>p!==found)].join(' / '):places.join(' / ');}
    }
    for(const panel of panels){
      const shown=[...panel.querySelectorAll('.source')].filter(s=>!s.hidden).length;
      panel.hidden=!shown;panel.querySelector('[data-count]').textContent=`${shown} ${shown===1?'documento':'documenti'}`;
      if(query)panel.open=shown>0;else if(restoring)panel.open=beforeSearch.get(panel.id)??false;
      panel.querySelectorAll('.place-group').forEach(g=>g.hidden=![...g.querySelectorAll('.source')].some(s=>!s.hidden));
    }
    if(restoring)beforeSearch=null;
    statusText.textContent=query?`${count} ${count===1?'documento trovato':'documenti trovati'} su ${sources.length}`:`${sources.length} documenti nell’elenco`;
    reset.hidden=!query;empty.hidden=count>0;searchBox.dataset.query=String(!!query);
    if(query)activeTopic(null);
    document.querySelectorAll('.cross-reference').forEach(p=>p.hidden=!!query);
    store();
    if(motion){
      animate(statusText,[{transform:'translateY(6px)'},{transform:'translateY(0)'}],'--m150','fonti-conteggio');
      animate(count?topics:empty,[{opacity:.92,transform:`translateY(${query?8:-8}px)`},{opacity:1,transform:'translateY(0)'}],'--m200',query?'fonti-risultati':'fonti-ritorno');
    }
  };
  input.addEventListener('compositionstart',()=>{composing=true;});
  input.addEventListener('compositionend',()=>{composing=false;filter();});
  input.addEventListener('input',()=>{if(!composing)filter();});
  const measureRail=()=>document.documentElement.style.setProperty('--rail-clearance',`${Math.ceil(rail.getBoundingClientRect().height+document.querySelector(".testata").getBoundingClientRect().height+16)}px`);
  let measuring=false;
  const startMeasuring=()=>{
    if(measuring)return;measuring=true;measureRail();
    if(typeof ResizeObserver==='function')new ResizeObserver(measureRail).observe(rail);
    else addEventListener('resize',measureRail);
  };
  if(typeof IntersectionObserver==='function'){
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){startMeasuring();observer.disconnect();}});
    observer.observe(rail);
  }
  input.addEventListener('focus',()=>{startMeasuring();rail.dataset.editing='true';});
  input.addEventListener('blur',()=>{rail.dataset.editing='false';});
  // Corregge la copertura solo quando cambia il focus, senza intercettare lo scorrimento.
  document.addEventListener('focusin',e=>{
    if(!topics.contains(e.target))return;
    startMeasuring();
    requestAnimationFrame(()=>{
      const r=e.target.getBoundingClientRect(),bar=rail.getBoundingClientRect();
      if(getComputedStyle(rail).position==='sticky'&&bar.bottom>0&&r.top<bar.bottom+12)
        scrollBy({top:r.top-bar.bottom-12,behavior:'instant'});
    });
  });
  const restore=()=>{
    const saved=history.state?.fontiRegistro;if(!saved||typeof saved.query!=='string')return;
    input.value=saved.query;
    if(Array.isArray(saved.panels))for(const panel of panels)panel.open=new Map(saved.panels).get(panel.id)??panel.open;
    beforeSearch=Array.isArray(saved.beforeSearch)?new Map(saved.beforeSearch):null;
    filter({motion:false});
  };
  addEventListener('pageshow',restore);restore();
  for(const panel of panels)panel.addEventListener('toggle',()=>{
    if(document.activeElement===panel.querySelector(':scope>summary'))activeTopic(panel.open?panel.id:null);
    store();
  });
  const resetAll=()=>{input.value='';filter();input.focus({preventScroll:true});input.scrollIntoView({block:'center',behavior:'instant'});};
  reset.addEventListener('click',resetAll);document.querySelector('[data-empty-reset]').addEventListener('click',resetAll);
  const reveal=target=>{if(!target)return;for(let p=target.parentElement;p;p=p.parentElement)if(p instanceof HTMLDetailsElement)p.open=true;if(target instanceof HTMLDetailsElement)target.open=true;};
  const targetFromHash=hash=>{try{return document.getElementById(decodeURIComponent(hash.slice(1)));}catch{return null;}};
  const navigate=()=>{const target=targetFromHash(location.hash);reveal(target);if(target){activeTopic(target.closest('.topic')?.id);target.scrollIntoView({block:'start',behavior:'instant'});}};
  document.querySelectorAll('[data-jump]').forEach(a=>a.addEventListener('click',()=>{
    startMeasuring();
    if(input.value){input.value='';filter({motion:false});}
    const target=targetFromHash(a.hash);reveal(target);activeTopic(target?.closest('.topic')?.id);store();
  }));
  addEventListener('hashchange',navigate);if(location.hash)navigate();
  const returnToSearch=()=>{input.focus({preventScroll:true});input.scrollIntoView({block:'center',behavior:'instant'});};
  document.querySelector('[data-return]').addEventListener('click',e=>{e.preventDefault();returnToSearch();});
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)&&!e.target.isContentEditable){e.preventDefault();returnToSearch();}});
}
