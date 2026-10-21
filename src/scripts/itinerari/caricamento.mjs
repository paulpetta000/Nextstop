// Caricamenti del compositore: funzioni provabili senza avviare una pagina o leggere dati personali.
/**
 * @template T
 * @param {string} url
 * @param {typeof globalThis.fetch} [richiedi]
 * @param {(p:T)=>void} [valida]
 * @returns {()=>Promise<T | null>}
 */
export function creaCaricaJson(url, richiedi = globalThis.fetch, valida = () => {}) {
  /** @type {Promise<T | null> | null} */
  let promessa = null;
  return () => (promessa ??= richiedi(url).then(r => {
    if (!r.ok) throw new Error('Dati non disponibili');
    return r.json();
  }).then(p => { valida(p); return p; }).catch(() => { promessa = null; return null; }));
}

/**
 * @param {Document} doc
 * @param {Map<string,DocumentFragment>} modelli
 * @param {import('./compositore/tipi').InterfacciaCitta['tappe']} ui
 * @param {(content:DocumentFragment)=>DocumentFragment} importa
 */
export function applicaSchede(doc, modelli, ui, importa) {
  const dati = doc.getElementById('it-cerca');
  const templates = [.../** @type {NodeListOf<HTMLTemplateElement>} */ (doc.querySelectorAll('template[id^="it-t-"]'))];
  if (!dati || !templates.length) throw new Error('Schede incomplete');
  const cerca = /** @type {import('../../lib/itinerari/ui').DatiCerca} */ (JSON.parse(dati.textContent ?? 'null'));
  if (!cerca || typeof cerca !== 'object' || Array.isArray(cerca)) throw new Error('Dati delle schede non validi');
  const presenti = new Set(templates.map(t => t.id.slice(5)));
  if (Object.keys(ui).some(id => !presenti.has(id) || !Object.prototype.hasOwnProperty.call(cerca, id))) throw new Error('Schede incomplete');
  // Prima prepara tutto: un errore non deve far risultare pronte solo alcune schede.
  const nuovi = templates.map(t => /** @type {const} */ ([t.id.slice(5), importa(t.content)]));
  const voci = Object.entries(cerca).map(([id, x]) => /** @type {const} */ ([id, { ...(ui[id] ?? {}), ...x }]));
  for (const [id, content] of nuovi) modelli.set(id, content);
  for (const [id, x] of voci) ui[id] = x;
}
