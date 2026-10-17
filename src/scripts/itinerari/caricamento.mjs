// Caricamenti del compositore: funzioni provabili senza avviare una pagina o leggere dati personali.
export function creaCaricaJson(url, richiedi = globalThis.fetch) {
  let promessa = null;
  return () => (promessa ??= richiedi(url).then(r => {
    if (!r.ok) throw new Error('Dati non disponibili');
    return r.json();
  }).catch(() => { promessa = null; return null; }));
}

export function applicaSchede(doc, modelli, ui, importa) {
  const dati = doc.getElementById('it-cerca');
  const templates = [...doc.querySelectorAll('template[id^="it-t-"]')];
  if (!dati || !templates.length) throw new Error('Schede incomplete');
  const cerca = JSON.parse(dati.textContent);
  if (!cerca || typeof cerca !== 'object' || Array.isArray(cerca)) throw new Error('Dati delle schede non validi');
  const presenti = new Set(templates.map(t => t.id.slice(5)));
  if (Object.keys(ui).some(id => !presenti.has(id) || !Object.prototype.hasOwnProperty.call(cerca, id))) throw new Error('Schede incomplete');
  // Prima prepara tutto: un errore non deve far risultare pronte solo alcune schede.
  const nuovi = templates.map(t => [t.id.slice(5), importa(t.content)]);
  const voci = Object.entries(cerca).map(([id, x]) => [id, { ...(ui[id] ?? {}), ...x }]);
  for (const [id, content] of nuovi) modelli.set(id, content);
  for (const [id, x] of voci) ui[id] = x;
}
