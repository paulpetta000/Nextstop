// Ricerca e comandi locali. Nessuna rete, memoria persistente o statistica.
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// Equivalenze lessicali su parole già presenti: non sono nuove relazioni con i fatti.
const searchNormalize = text => normalize(text).split(' ').map(word => /^(costo|costi|prezzo|prezzi|tariffa|tariffe)$/.test(word) ? 'costo' : /^bigliett[oi]$/.test(word) ? 'biglietto' : word).join(' ');
for (const root of document.querySelectorAll('.fonti-pannello')) {
  // Gli stili sono già nell'HTML offline. Li attiviamo prima che il pannello
  // entri nello schermo, senza caricare il suo carattere durante l'apertura.
  const style = root.querySelector('[data-fonti-stile]');
  const activate = () => { if (style.media !== 'all') style.media = 'all'; observer?.disconnect(); };
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) activate();
    }, { rootMargin: '1500px' });
    observer.observe(root);
  } else activate();
  root.addEventListener('focusin', activate);
  const hashTarget = () => {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (target && root.contains(target)) activate();
  };
  addEventListener('hashchange', hashTarget); hashTarget();
  const disclosure=root.querySelector('.disclosure');
  let initialized=false;
  const start=()=>{
    if(initialized||!disclosure.open)return;
    activate();
    initialized=true;
    initPannello(root);
  };
  disclosure.addEventListener('toggle',start);start();
}
// L’indice viene preparato al primo uso; HTML e conteggi sono già disponibili.
function initPannello(root) {
root.classList.add('js');
const tools = root.querySelector('.search-tools');
if (tools) {
  const input = tools.querySelector('input');
  const disclosure = root.querySelector('.disclosure');
  const rail = root.querySelector('.access-rail');
  const action = rail.querySelector('[data-context-action]');
  const status = rail.querySelector('[role=status]');
  const sources = [...root.querySelectorAll('.source')].map(el => ({ el, words: searchNormalize(el.querySelector('.source-link').textContent+' '+el.querySelector('.purpose').textContent+' '+el.querySelector('.meta span').textContent+' '+(el.dataset.keywords||'')+' '+JSON.parse(el.dataset.places).join(' ')), places: JSON.parse(el.dataset.places), context: el.querySelector('.source-context') }));
  const groups = [...root.querySelectorAll('.group')];
  let outside = false, announce;
  const syncAction = () => {
    const returning = outside && disclosure.open && rail.hasAttribute('data-long-list') && document.activeElement !== input;
    action.dataset.mode = returning ? 'return' : 'reset';
    action.textContent = returning ? 'Torna alla ricerca' : 'Mostra tutte';
    action.hidden = !returning && !input.value.length;
    rail.dataset.editing = String(document.activeElement === input);
  };
  const focusSearch = () => { input.scrollIntoView({ block: 'center', behavior: 'instant' }); input.focus({ preventScroll: true }); syncAction(); };
  const filter = () => {
    const terms = searchNormalize(input.value).split(' ').filter(Boolean);
    let count = 0;
    for (const { el, words, places, context } of sources) {
      const found = terms.every(term => words.includes(term));
      el.hidden = !found; count += Number(found);
      if (context) {
        const matched = places.filter(place => terms.length && terms.every(term => searchNormalize(place).includes(term)));
        context.textContent = matched.length ? matched.join(' e ') : context.dataset.context;
      }
    }
    for (const group of groups) {
      const count = group.querySelectorAll('.source:not([hidden])').length;
      group.hidden = count === 0;
      const badge = group.querySelector('[data-group-count]');
      if (badge) badge.textContent = `${count} ${count === 1 ? 'fonte' : 'fonti'}`;
    }
    root.querySelector('.no-results').hidden = count !== 0;
    clearTimeout(announce);
    announce = setTimeout(() => { status.textContent = terms.length ? `${count} ${count === 1 ? 'fonte trovata' : 'fonti trovate'} su ${sources.length}` : `${sources.length} fonti`; }, 180);
    syncAction();
  };
  input.addEventListener('input', filter);
  input.addEventListener('focus', syncAction);
  input.addEventListener('blur', syncAction);
  action.addEventListener('click', () => {
    if (action.dataset.mode === 'reset') { input.value = ''; filter(); }
    focusSearch();
  });
  if ('IntersectionObserver' in window && rail.hasAttribute('data-long-list')) {
    const observer = new IntersectionObserver(entries => { outside = !entries[0].isIntersecting && entries[0].boundingClientRect.bottom < 0; syncAction(); });
    observer.observe(input);
    rail.dataset.sticky = 'true';
  }
  // Il collegamento in fondo rimane utilizzabile anche senza l'osservatore.
  const ritorno=root.querySelector('.back-top');
  ritorno.href='#'+input.id;ritorno.textContent='Torna alla ricerca';
  ritorno.addEventListener('click', event => { event.preventDefault(); focusSearch(); });
  addEventListener('pageshow', filter);
  addEventListener('hashchange', () => {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (target?.closest('[hidden]')) { input.value = ''; filter(); target.scrollIntoView(); }
    if (target === input) focusSearch();
  });
  disclosure.addEventListener('toggle', () => {
    if (!disclosure.open) { input.value = ''; filter(); }
    syncAction();
  });
  tools.hidden = false; rail.hidden = false; filter();
}

}
