// Precondizioni dei dati locali di costruisci.mjs. Nessuna rete o modifica dei file.
const record = x => !!x && typeof x === 'object' && !Array.isArray(x);
const idValido = x => Number.isSafeInteger(x) && x > 0;
const coordinata = (x, limite) => Number.isFinite(x) && Math.abs(x) <= limite;
export function validaQuote(dem, { raggio, percentile, media }) {
  const errore = dettaglio => { throw new Error('Quote: ' + dettaglio); };
  if (!record(dem) || !Number.isSafeInteger(dem.w) || dem.w < 1 || !Number.isSafeInteger(dem.h) || dem.h < 1 || !Number.isSafeInteger(dem.w * dem.h)) errore('dimensioni della griglia non valide');
  if (!Array.isArray(dem.quote) || dem.quote.length !== dem.w * dem.h || !dem.quote.every(Number.isFinite)) errore('campioni mancanti o non numerici');
  if (!coordinata(dem.lon0, 180) || !coordinata(dem.lat0, 90) || !Number.isFinite(dem.dlon) || !dem.dlon || !Number.isFinite(dem.dlat) || !dem.dlat) errore('origine o passo non validi');
  if (!coordinata(dem.lon0 + (dem.w - 1) * dem.dlon, 180) || !coordinata(dem.lat0 + (dem.h - 1) * dem.dlat, 90)) errore('estensione della griglia non valida');
  if (!Number.isSafeInteger(raggio) || raggio < 0 || !Number.isFinite(percentile) || percentile < 0 || percentile > 1 || !Number.isFinite(media) || media < 0) errore('parametri del filtro non validi');
}
export function validaOsm(osm) {
  const errore = dettaglio => { throw new Error('OSM: ' + dettaglio); };
  if (!record(osm) || !Array.isArray(osm.elements) || !osm.elements.length || osm.remark) errore('risposta vuota, parziale o non valida');
  const nodi = new Map();
  for (const e of osm.elements) {
    if (!record(e) || !idValido(e.id) || !['node', 'way', 'relation'].includes(e.type)) errore('elemento o identificativo non valido');
    if (e.tags !== undefined && (!record(e.tags) || !Object.values(e.tags).every(x => typeof x === 'string'))) errore('tag non validi per ' + e.id);
    if (e.type === 'node') {
      if (!coordinata(e.lat, 90) || !coordinata(e.lon, 180)) errore('coordinate non valide per il nodo ' + e.id);
      const prima = nodi.get(e.id);
      if (prima && (prima.lat !== e.lat || prima.lon !== e.lon)) errore('coordinate discordanti per il nodo ripetuto ' + e.id);
      nodi.set(e.id, e);
    } else if (e.type === 'way' && (!Array.isArray(e.nodes) || e.nodes.length < 2 || !e.nodes.every(idValido))) errore('nodi della via non validi: ' + e.id);
    else if (e.type === 'relation' && !Array.isArray(e.members)) errore('membri della relazione non validi: ' + e.id);
  }
  for (const e of osm.elements) if (e.type === 'way') for (const id of e.nodes) if (!nodi.has(id)) errore('nodo ' + id + ' assente dalla via ' + e.id);
}