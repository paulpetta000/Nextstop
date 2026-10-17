// Non mostrare controlli del compositore finché il loro foglio di stile non è pronto.
export function attendiStile(link) {
  if (!link) return Promise.resolve();
  if (link.sheet) { link.media = 'all'; return Promise.resolve(); }
  if (link.dataset.errore === 'si') return Promise.reject(new Error('Stile del compositore non disponibile'));
  return new Promise((resolve, reject) => {
    const pulisci = () => { clearTimeout(timer); link.removeEventListener('load', pronto); link.removeEventListener('error', errore); };
    const pronto = () => { pulisci(); link.media = 'all'; resolve(); };
    const errore = () => { pulisci(); link.dataset.errore = 'si'; reject(new Error('Stile del compositore non disponibile')); };
    const timer = setTimeout(errore, 10000);
    link.addEventListener('load', pronto, { once: true });
    link.addEventListener('error', errore, { once: true });
  });
}

// Ritenta lo stesso indirizzo, utilizzabile anche dalla cache offline, senza avvii duplicati.
export function avviaConStile(link, avvia, mostraErrore) {
  let inCorso = false, partito = false;
  const prova = async () => {
    if (inCorso || partito) return;
    inCorso = true;
    try { await attendiStile(link); }
    catch { inCorso = false; mostraErrore(riprova); return; }
    inCorso = false; partito = true;
    avvia(); // Gli errori applicativi restano distinti dagli errori del foglio.
  };
  const riprova = () => {
    if (inCorso || partito) return Promise.resolve();
    const nuovo = link.cloneNode();
    delete nuovo.dataset.errore; nuovo.media = 'print';
    link.replaceWith(nuovo); link = nuovo;
    return prova();
  };
  return prova();
}

// Usa soltanto lo stile iniziale e il pulsante comune: non dipende dal foglio che manca.
export function mostraErroreStile(app, radice, riprova) {
  if (!app) return;
  radice.classList.remove('cmp-ha');
  app.innerHTML = '<div class="cmp-primo" role="status"><p class="cmp-primo__t">Il compositore non si è caricato</p><p class="cmp-primo__p">Riprova: gli itinerari già salvati restano sul telefono.</p><button type="button" class="btn" style="justify-self:start" data-riprova-stile>Riprova</button></div>';
  const bottone = app.querySelector('[data-riprova-stile]');
  bottone.onclick = async () => {
    const ripristinaFuoco = app.ownerDocument?.activeElement === bottone;
    bottone.disabled = true;
    try { await riprova(); } catch (errore) { console.error(errore); }
    if (ripristinaFuoco) app.querySelector('[data-riprova-stile]')?.focus({ preventScroll: true });
  };
}
