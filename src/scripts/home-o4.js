// Interazioni della home. Tema e memoria restano gestiti dal sito; nessun accesso ai viaggi salvati.
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const menu=document.querySelector('.menu');
 menu?.addEventListener('toggle',()=>{const s=menu.querySelector('summary'),label=menu.open?'Chiudi il menu':'Apri il menu';s.setAttribute('aria-label',label);s.querySelector('.control-tip').textContent=label;});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary').focus();}});
 document.addEventListener('click',e=>{if(menu?.open&&!menu.contains(e.target))menu.open=false;});
 menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));
 const tabs=[...document.querySelectorAll('[data-plan]')],panels=[...document.querySelectorAll('[data-plan-panel]')];let choiceMotion,dayMotion;
 const select=(key,animate)=>{
  tabs.forEach(a=>a.setAttribute('aria-pressed',String(a.dataset.plan===key)));
  panels.forEach(p=>p.hidden=p.dataset.planPanel!==key);choiceMotion?.cancel();
  const active=panels.find(p=>!p.hidden);
  if(animate&&!reduce.matches)choiceMotion=active.querySelector('.plan-picture').animate([{opacity:.75,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'cubic-bezier(.16,1,.3,1)'});
 };
 if(tabs.length){
  tabs.forEach((a,i)=>{a.setAttribute('role','button');a.addEventListener('click',e=>{e.preventDefault();select(a.dataset.plan,true);});a.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();a.click();}if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].focus();select(tabs[n].dataset.plan,true);}});});select('1',false);
 }
 const toggle=document.querySelector('[data-include-museum]'),versions=[...document.querySelectorAll('[data-day-version]')];
 if(toggle){
  document.querySelector('.day-control').hidden=false;
  const render=animate=>{
   const expanded=versions.find(v=>!v.hidden)?.querySelector('.day-complete').open,key=toggle.checked?'base':'senza';
   versions.forEach(v=>v.hidden=v.dataset.dayVersion!==key);const active=versions.find(v=>!v.hidden);
   active.querySelector('.day-complete').open=!!expanded;
   document.querySelector('[data-day-hint]').textContent=toggle.checked?'Togli la visita per vedere come cambiano gli orari.':'Aggiungi di nuovo la visita per confrontare gli orari.';
   document.querySelector('[data-day-count]').textContent=active.dataset.count+' tappe';
   document.querySelector('[data-day-walk]').textContent=active.dataset.walk+' min a piedi';
   document.querySelector('[data-day-end]').textContent=active.dataset.end;
   dayMotion?.cancel();if(animate&&!reduce.matches)dayMotion=document.querySelector('.day-live-result').animate([{transform:'translateY(3px)'},{transform:'translateY(0)'}],{duration:150,easing:'cubic-bezier(.16,1,.3,1)'});
  };
  toggle.addEventListener('change',()=>render(true));render(false);
 }
 reduce.addEventListener('change',()=>{if(reduce.matches){choiceMotion?.cancel();dayMotion?.cancel();document.getAnimations().forEach(a=>{if(a.timeline?.constructor.name==='DocumentTimeline')a.cancel();});}});
 
})();
