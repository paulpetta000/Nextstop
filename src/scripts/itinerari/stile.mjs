// Non mostrare controlli del compositore finché il loro foglio di stile non è pronto.
export function attendiStile(link) {
  if (!link) return Promise.resolve();
  if (link.sheet) { link.media = 'all'; return Promise.resolve(); }
  if (link.dataset.errore === 'si') return Promise.reject(new Error('Stile del compositore non disponibile'));
  return new Promise((resolve, reject) => {
    const pulisci = () => { link.removeEventListener('load', pronto); link.removeEventListener('error', errore); };
    const pronto = () => { pulisci(); link.media = 'all'; resolve(); };
    const errore = () => { pulisci(); reject(new Error('Stile del compositore non disponibile')); };
    link.addEventListener('load', pronto, { once: true });
    link.addEventListener('error', errore, { once: true });
  });
}
