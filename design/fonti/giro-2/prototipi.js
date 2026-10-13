// Miglioramento progressivo locale: senza JS restano elenco completo e dettagli nativi.
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const themeButton = document.querySelector('[data-theme-button]');
if (themeButton) {
  themeButton.disabled = false;
  const media = matchMedia('(prefers-color-scheme: dark)');
  const dark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : media.matches;
  const sync = () => { themeButton.querySelector('span').textContent = dark() ? 'Usa tema chiaro' : 'Usa tema scuro'; };
  themeButton.addEventListener('click', () => { document.documentElement.dataset.theme = dark() ? 'light' : 'dark'; sync(); });
  media.addEventListener('change', sync);
  sync();
}
const tools = document.querySelector('.search-tools');
if (tools) {
  const input = tools.querySelector('input');
  const reset = tools.querySelector('[data-reset]');
  const sources = [...document.querySelectorAll('.source')].map(el => ({ el, words: el.dataset.search, places: JSON.parse(el.dataset.places) }));
  const groups = [...document.querySelectorAll('.group')];
  const status = tools.querySelector('[role=status]');
  let announce;
  const filter = () => {
    const query = normalize(input.value);
    const terms = query.split(' ').filter(Boolean);
    let count = 0;
    for (const { el, words, places } of sources) {
      const found = terms.every(t => words.includes(t));
      el.hidden = !found;
      count += Number(found);
      const matched = places.filter(p => terms.length && terms.every(t => normalize(p).includes(t)));
      const context = el.querySelector('.matched-context');
      context.hidden = !found || matched.length === 0 || places.length < 2;
      context.textContent = matched.length ? `Collegata a ${matched.slice(0, 3).join(', ')}${matched.length > 3 ? ` e altri ${matched.length - 3} luoghi` : ''}.` : '';
    }
    for (const group of groups) group.hidden = !group.querySelector('.source:not([hidden])');
    // Ogni salto alfabetico punta al primo gruppo realmente visibile.
    for (const anchor of document.querySelectorAll('.alphabet a')) {
      const target = groups.find(g => !g.hidden && g.dataset.letter === anchor.dataset.letter);
      anchor.hidden = !target;
      if (target) anchor.setAttribute('href', '#' + target.id);
    }
    reset.disabled = input.value.length === 0;
    tools.querySelector('.no-results').hidden = count !== 0;
    clearTimeout(announce);
    announce = setTimeout(() => { status.textContent = query ? `${count} ${count === 1 ? 'fonte trovata' : 'fonti trovate'} su ${sources.length}` : `${sources.length} fonti`; }, 180);
  };
  input.addEventListener('input', filter);
  reset.addEventListener('click', () => { input.value = ''; filter(); input.focus(); });
  addEventListener('pageshow', filter);
  addEventListener('hashchange', () => {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (target?.closest('[hidden]')) { input.value = ''; filter(); target.scrollIntoView(); }
  });
  // Non sposta il focus durante la digitazione. Nessuna rete, storage o statistica.
  tools.hidden = false;
  document.querySelector('.disclosure').addEventListener('toggle', event => {
    if (!event.target.open) { input.value = ''; filter(); }
  });
}
