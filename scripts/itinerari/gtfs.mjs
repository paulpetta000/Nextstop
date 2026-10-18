// Lettura del feed GTFS degli autobus ANM (https://www.anm.it/google/google-transit.zip, licenza IODL 2.0)
// e costruzione delle linee scelte per i tempi tra le tappe (scripts/itinerari/costruisci.mjs).
// GTFS è il formato aperto degli orari: un file zip con tabelle di testo (linee, corse, fermate, orari, percorsi).
// Per ogni linea e per ogni scenario (giorno e fascia oraria) calcola:
// - i passaggi a ogni fermata nella fascia, da cui la frequenza e quindi l'attesa media (metà della frequenza);
// - il tempo tra una fermata e la successiva, dall'orario programmato (mediana delle corse della fascia);
// - il disegno del percorso tra due fermate (shapes del feed), per la mappa.
// Sono orari programmati: traffico, lavori e deviazioni non ci sono (lo dice la pagina «Come calcoliamo i tempi»).
import fs from 'node:fs';
import zlib from 'node:zlib';

// ---------- Zip ordinario (stored/deflate, senza estrarre file su disco) ----------
// Limiti del lettore locale, non limiti dello standard GTFS: impediscono allocazioni senza controllo.
const MAX_ARCHIVIO = 256 * 1024 * 1024, MAX_TABELLA = 256 * 1024 * 1024, MAX_TOTALE = 512 * 1024 * 1024;
function leggiZip(file) {
  const errore = dettaglio => { throw new Error('GTFS ZIP: ' + dettaglio); };
  if (fs.statSync(file).size > MAX_ARCHIVIO) errore('archivio oltre il limite di 256 MiB');
  const b = fs.readFileSync(file);
  const dentro = (p, n, limite = b.length) => Number.isSafeInteger(p) && p >= 0 && n >= 0 && p + n <= limite;
  let e = b.length - 22;
  // Una firma dentro il commento non basta: commento e posizione della directory devono combaciare.
  for (; e >= Math.max(0, b.length - 22 - 65535); e--) {
    if (b.readUInt32LE(e) === 0x06054b50 && e + 22 + b.readUInt16LE(e + 20) === b.length && b.readUInt32LE(e + 16) + b.readUInt32LE(e + 12) === e) break;
  }
  if (e < Math.max(0, b.length - 22 - 65535)) errore('directory finale mancante o non valida');
  const n = b.readUInt16LE(e + 10), inizioDir = b.readUInt32LE(e + 16);
  if (b.readUInt16LE(e + 4) || b.readUInt16LE(e + 6) || b.readUInt16LE(e + 8) !== n || n === 0xffff || inizioDir === 0xffffffff) errore('archivi multiparte o ZIP64 non supportati');
  let p = inizioDir, totale = 0;
  const out = new Map(), intervalli = [];
  for (let i = 0; i < n; i++) {
    if (!dentro(p, 46, e) || b.readUInt32LE(p) !== 0x02014b50) errore('intestazione della directory non valida');
    const flag = b.readUInt16LE(p + 8), metodo = b.readUInt16LE(p + 10), crc = b.readUInt32LE(p + 16);
    const compresso = b.readUInt32LE(p + 20), dimensione = b.readUInt32LE(p + 24);
    const lNome = b.readUInt16LE(p + 28), lExtra = b.readUInt16LE(p + 30), lCommento = b.readUInt16LE(p + 32), locale = b.readUInt32LE(p + 42);
    if (!dentro(p, 46 + lNome + lExtra + lCommento, e) || !lNome || !dentro(locale, 30, inizioDir)) errore('offset o lunghezze non validi');
    if (flag & 0x2041 || ![0, 8].includes(metodo) || b.readUInt16LE(p + 34)) errore('cifratura, disco o metodo non supportati');
    totale += dimensione;
    if (dimensione > MAX_TABELLA || totale > MAX_TOTALE) errore('dimensioni delle tabelle oltre il limite');
    if (b.readUInt32LE(locale) !== 0x04034b50 || b.readUInt16LE(locale + 6) !== flag || b.readUInt16LE(locale + 8) !== metodo) errore('intestazione locale incoerente');
    const nomeBytes = b.subarray(p + 46, p + 46 + lNome), nome = nomeBytes.toString('utf8');
    const nomeLocale = b.readUInt16LE(locale + 26), extraLocale = b.readUInt16LE(locale + 28);
    const inizio = locale + 30 + nomeLocale + extraLocale, fine = inizio + compresso;
    if (!dentro(locale, 30 + nomeLocale + extraLocale + compresso, inizioDir) || !nomeBytes.equals(b.subarray(locale + 30, locale + 30 + nomeLocale))) errore('nome o contenuto locale non valido');
    let fineRecord = fine;
    if (flag & 8) {
      const descrittore = d => dentro(d, 12, inizioDir) && b.readUInt32LE(d) === crc && b.readUInt32LE(d + 4) === compresso && b.readUInt32LE(d + 8) === dimensione;
      if (descrittore(fine)) fineRecord += 12;
      else if (dentro(fine, 4, inizioDir) && b.readUInt32LE(fine) === 0x08074b50 && descrittore(fine + 4)) fineRecord += 16;
      else errore('descrittore del contenuto non valido');
    } else if (b.readUInt32LE(locale + 14) !== crc || b.readUInt32LE(locale + 18) !== compresso || b.readUInt32LE(locale + 22) !== dimensione) errore('dimensioni o CRC locali incoerenti');
    intervalli.push([locale, fineRecord]);
    if (!nome.endsWith('/')) {
      const chiave = nome.split('/').pop();
      if (out.has(chiave)) errore('tabella duplicata o omonima: ' + chiave);
      out.set(chiave, () => {
        let dati;
        try { dati = metodo === 0 ? b.subarray(inizio, fine) : zlib.inflateRawSync(b.subarray(inizio, fine), { maxOutputLength: Math.max(1, dimensione) }); }
        catch { errore('contenuto compresso non valido: ' + nome); }
        if (dati.length !== dimensione || zlib.crc32(dati) !== crc) errore('lunghezza o CRC errati: ' + nome);
        try { return new TextDecoder('utf-8', { fatal: true }).decode(dati); }
        catch { errore('testo UTF-8 non valido: ' + nome); }
      });
    }
    p += 46 + lNome + lExtra + lCommento;
  }
  if (p !== e) errore('dimensione della directory incoerente');
  intervalli.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervalli.length; i++) if (intervalli[i][0] < intervalli[i - 1][1]) errore('contenuti sovrapposti');
  return out;
}

// ---------- CSV GTFS: campi tra virgolette, virgole e "" dentro; niente righe interne ----------
function campi(l, errore) {
  const o = []; let c = '', q = false, chiusa = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (q) {
      if (ch === '"') { if (l[i + 1] === '"') { c += '"'; i++; } else { q = false; chiusa = true; } }
      else c += ch;
    } else if (ch === ',') { o.push(c); c = ''; chiusa = false; }
    else if (chiusa || (ch === '"' && c)) errore('virgolette non valide');
    else if (ch === '"') q = true;
    else c += ch;
  }
  if (q) errore('virgolette non chiuse');
  o.push(c); return o;
}
function tabella(zip, nome, { obbligatoria = true } = {}) {
  const f = zip.get(nome + '.txt');
  if (!f) { if (obbligatoria) throw new Error('GTFS: manca ' + nome + '.txt'); return []; }
  const errore = dettaglio => { throw new Error('GTFS CSV ' + nome + '.txt: ' + dettaglio); };
  const righe = f().replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!righe.length) errore('intestazione mancante');
  const h = campi(righe[0], errore).map(s => s.trim());
  if (h.some(s => !s) || new Set(h).size !== h.length) errore('colonne vuote o duplicate');
  const chiavi = { routes: ['route_id'], trips: ['trip_id'], stops: ['stop_id'], stop_times: ['trip_id', 'stop_sequence'], calendar: ['service_id'], calendar_dates: ['service_id', 'date'], shapes: ['shape_id', 'shape_pt_sequence'] }[nome] ?? [];
  if (chiavi.some(k => !h.includes(k))) errore('colonna identificativa mancante: ' + chiavi.join(', '));
  const viste = new Set();
  return righe.slice(1).map((r, numero) => {
    const v = campi(r, errore);
    if (v.length !== h.length) errore('numero di campi diverso dalle colonne alla riga ' + (numero + 2));
    const riga = Object.fromEntries(h.map((k, i) => [k, v[i]]));
    if (chiavi.some(k => !riga[k])) errore('identificativo mancante alla riga ' + (numero + 2));
    const chiave = JSON.stringify(chiavi.map(k => riga[k]));
    if (chiavi.length && viste.has(chiave)) errore((nome === 'stop_times' ? 'sequenza ripetuta' : 'chiave duplicata') + ' alla riga ' + (numero + 2));
    viste.add(chiave); return riga;
  });
}

const minuti = s => {
  const m = typeof s === 'string' && /^(\d+):([0-5]\d):([0-5]\d)$/.exec(s);
  if (!m || !Number.isSafeInteger(+m[1])) throw new Error('GTFS: orario non valido in stop_times.txt: ' + s);
  return +m[1] * 60 + +m[2] + +m[3] / 60;
};
const dataGtfs = (s, tabella) => {
  if (typeof s !== 'string' || !/^\d{8}$/.test(s)) throw new Error('GTFS: data non valida in ' + tabella);
  const t = Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6));
  if (new Date(t).toISOString().slice(0, 10).replace(/-/g, '') !== s) throw new Error('GTFS: data non valida in ' + tabella + ': ' + s);
  return t;
};
const sequenza = (s, tabella) => {
  if (typeof s !== 'string' || !/^\d+$/.test(s) || !Number.isSafeInteger(+s)) throw new Error('GTFS: sequenza non valida in ' + tabella);
  return +s;
};
const coordinata = (s, limite, tabella) => {
  if (typeof s !== 'string' || !s.trim() || !Number.isFinite(+s) || Math.abs(+s) > limite) throw new Error('GTFS: coordinata non valida in ' + tabella);
  return +s;
};
const giornoDi = d => new Date(Date.UTC(+d.slice(0, 4), +d.slice(4, 6) - 1, +d.slice(6, 8))).getUTCDay();
const dist = (a, b) => {
  const k = Math.cos(((a.lat + b.lat) / 2) * Math.PI / 180);
  return Math.hypot((a.lat - b.lat) * 111195, (a.lon - b.lon) * 111195 * k);
};
const mediana = v => { const s = [...v].sort((a, b) => a - b); const k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };

// I servizi attivi in ogni data (calendar.txt e calendar_dates.txt: il feed ANM usa solo il secondo)
function calendario(zip) {
  const date = new Map(), servizi = new Set();
  const add = (d, s) => { if (!date.has(d)) date.set(d, new Set()); date.get(d).add(s); };
  const GIORNI = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (const c of tabella(zip, 'calendar', { obbligatoria: false })) {
    servizi.add(c.service_id);
    const dal = dataGtfs(c.start_date, 'calendar.txt'), al = dataGtfs(c.end_date, 'calendar.txt');
    if (dal > al || !GIORNI.every(g => c[g] === '0' || c[g] === '1')) throw new Error('GTFS: intervallo o giorni non validi in calendar.txt');
    for (let t = dal; t <= al; t += 864e5) {
      const d = new Date(t).toISOString().slice(0, 10).replace(/-/g, '');
      if (c[GIORNI[giornoDi(d)]] === '1') add(d, c.service_id);
    }
  }
  for (const c of tabella(zip, 'calendar_dates', { obbligatoria: false })) {
    servizi.add(c.service_id);
    dataGtfs(c.date, 'calendar_dates.txt');
    if (c.exception_type !== '1' && c.exception_type !== '2') throw new Error('GTFS: eccezione non valida in calendar_dates.txt');
    if (c.exception_type === '1') add(c.date, c.service_id);
    else date.get(c.date)?.delete(c.service_id);
  }
  return { date, servizi };
}

// La data tipica di un gruppo di giorni: quella con l'insieme di servizi più frequente (salta feste e ponti)
function dataTipica(date, giorni) {
  const conta = new Map();
  for (const [d, s] of date) {
    if (!giorni.includes(giornoDi(d))) continue;
    const k = [...s].sort().join(',');
    if (!conta.has(k)) conta.set(k, []);
    conta.get(k).push(d);
  }
  const [, lista] = [...conta].sort((a, b) => b[1].length - a[1].length || a[1][0].localeCompare(b[1][0]))[0] || [];
  if (!lista) throw new Error('GTFS: nessuna data per i giorni ' + giorni.join(','));
  return lista.sort()[0];
}

// ---------- Le linee scelte ----------
// finestre: { scenario: { giorni: [0..6], da: minuti, a: minuti } }
export function lineeBus(file, { linee, finestre }) {
  const zip = leggiZip(file);
  const routes = tabella(zip, 'routes');
  const scelte = new Map();
  for (const nome of linee) {
    const r = routes.filter(x => x.route_short_name === nome);
    if (r.length !== 1) throw new Error(`GTFS: la linea ${nome} c'è ${r.length} volte nel feed (attesa una)`);
    scelte.set(r[0].route_id, r[0]);
  }
  const { date, servizi } = calendario(zip);
  const tutte = [...date.keys()].sort();
  const tipiche = {};
  for (const [sc, f] of Object.entries(finestre)) tipiche[sc] = dataTipica(date, f.giorni);

  const tutteCorse = tabella(zip, 'trips'), routeId = new Set(routes.map(r => r.route_id)), tripId = new Set(tutteCorse.map(t => t.trip_id));
  for (const t of tutteCorse) if (!routeId.has(t.route_id) || !servizi.has(t.service_id)) throw new Error('GTFS: riferimento a linea o servizio assente in trips.txt, corsa ' + t.trip_id);
  const trips = tutteCorse.filter(t => scelte.has(t.route_id));
  const perTrip = new Map(trips.map(t => [t.trip_id, { ...t, fermate: [] }]));
  for (const r of tabella(zip, 'stop_times')) {
    if (!tripId.has(r.trip_id)) throw new Error('GTFS: riferimento a corsa assente in stop_times.txt: ' + r.trip_id);
    const t = perTrip.get(r.trip_id);
    if (t) t.fermate.push({ s: r.stop_id, n: sequenza(r.stop_sequence, 'stop_times.txt'), t: minuti(r.departure_time || r.arrival_time) });
  }
  for (const t of perTrip.values()) {
    t.fermate.sort((a, b) => a.n - b.n);
    for (let i = 1; i < t.fermate.length; i++) {
      if (t.fermate[i].n === t.fermate[i - 1].n) throw new Error('GTFS: sequenza ripetuta in stop_times.txt, corsa ' + t.trip_id);
      if (t.fermate[i].t < t.fermate[i - 1].t) throw new Error('GTFS: orari in discesa in stop_times.txt, corsa ' + t.trip_id);
    }
  }
  const usateNelFeed = new Set([...perTrip.values()].flatMap(t => t.fermate.map(f => f.s)));
  const stops = new Map(tabella(zip, 'stops').map(s => [s.stop_id, {
    id: s.stop_id, nome: s.stop_name.trim(),
    lat: usateNelFeed.has(s.stop_id) ? coordinata(s.stop_lat, 90, 'stops.txt') : +s.stop_lat,
    lon: usateNelFeed.has(s.stop_id) ? coordinata(s.stop_lon, 180, 'stops.txt') : +s.stop_lon
  }]));
  for (const id of usateNelFeed) if (!stops.has(id)) throw new Error('GTFS: fermata assente da stops.txt: ' + id);
  const shapes = new Map();
  for (const p of tabella(zip, 'shapes', { obbligatoria: false })) {
    if (!shapes.has(p.shape_id)) shapes.set(p.shape_id, []);
    shapes.get(p.shape_id).push({ n: sequenza(p.shape_pt_sequence, 'shapes.txt'), lat: coordinata(p.shape_pt_lat, 90, 'shapes.txt'), lon: coordinata(p.shape_pt_lon, 180, 'shapes.txt') });
  }
  for (const s of shapes.values()) s.sort((a, b) => a.n - b.n);

  // il disegno tra le fermate di una sequenza: ogni fermata sul punto più vicino della shape, andando avanti
  function disegno(shapeId, seq) {
    const sh = shapes.get(shapeId);
    if (!sh || sh.length < 2) return null;
    const lung = [0];
    for (let i = 1; i < sh.length; i++) lung.push(lung[i - 1] + dist(sh[i - 1], sh[i]));
    const idx = [];
    let j0 = 0;
    for (let k = 0; k < seq.length; k++) {
      const s = stops.get(seq[k]);
      const limite = k ? lung[j0] + 3 * dist(stops.get(seq[k - 1]), s) + 300 : Infinity;
      let best = j0, bd = Infinity;
      for (let j = j0; j < sh.length && lung[j] <= limite; j++) { const d = dist(sh[j], s); if (d < bd) { bd = d; best = j; } }
      idx.push(best); j0 = best;
    }
    return seq.slice(1).map((_, k) => sh.slice(idx[k] + 1, idx[k + 1]).map(p => [+p.lat.toFixed(6), +p.lon.toFixed(6)]));
  }

  const out = [];
  for (const [rid, r] of scelte) {
    const id = 'B' + r.route_short_name;
    const nome = `${r.route_type === '11' ? 'Filobus' : 'Bus'} ${r.route_short_name}`;
    const corse = [...perTrip.values()].filter(t => t.route_id === rid && t.fermate.length > 1);
    // fermate e tratti si tengono separati per direzione: al capolinea non si «passa» da una direzione all'altra
    // restando sul bus (nel feed nessuna corsa lo fa), si scende e si riprende il bus con la sua attesa
    const passaggi = {};        // scenario -> «direzione|stop» -> numero di corse che ripartono da lì nella fascia
    const archi = new Map();    // "da>a" -> { da, a, tempi: { scenario: min }, peso: { scenario: corse }, punti }
    const usate = new Map();    // stop -> nome (tutte le fermate delle corse della linea)
    for (const [sc, f] of Object.entries(finestre)) {
      const attivi = date.get(tipiche[sc]) || new Set();
      const delGiorno = corse.filter(t => attivi.has(t.service_id));
      const p = passaggi[sc] = {};
      const schemi = new Map();   // sequenza di fermate -> corse
      for (const t of delGiorno) {
        const dir = t.direction_id || '0';
        t.fermate.forEach((x, i) => { if (i < t.fermate.length - 1 && x.t >= f.da && x.t < f.a) p[`${dir}|${x.s}`] = (p[`${dir}|${x.s}`] || 0) + 1; });
        // per i tempi: le corse che attraversano la fascia
        if (t.fermate[t.fermate.length - 1].t < f.da || t.fermate[0].t >= f.a) continue;
        const k = `${t.direction_id || '0'} ` + t.fermate.map(x => x.s).join(' ');
        if (!schemi.has(k)) schemi.set(k, []);
        schemi.get(k).push(t);
      }
      for (const [k, ts] of [...schemi].sort((a, b) => b[1].length - a[1].length)) {
        const [dir, ...seq] = k.split(' ');
        // tempo cumulato dalla prima fermata: mediana sulle corse (resta in ordine crescente)
        const cum = seq.map((_, i) => mediana(ts.map(t => t.fermate[i].t - t.fermate[0].t)));
        const quante = new Map(); for (const t of ts) quante.set(t.shape_id, (quante.get(t.shape_id) || 0) + 1);
        const shapeId = [...quante].sort((a, b) => b[1] - a[1])[0][0];
        let pezzi = null;
        for (let i = 1; i < seq.length; i++) {
          const ka = `${dir}|${seq[i - 1]}>${seq[i]}`;
          if (seq[i - 1] === seq[i]) continue;
          if (!archi.has(ka)) archi.set(ka, { dir, da: seq[i - 1], a: seq[i], tempi: {}, peso: {}, punti: null });
          const a = archi.get(ka);
          if ((a.peso[sc] || 0) < ts.length) { a.tempi[sc] = Math.max(0.25, cum[i] - cum[i - 1]); a.peso[sc] = ts.length; }
          if (!a.punti) { pezzi ??= disegno(shapeId, seq) || []; a.punti = pezzi[i - 1] || []; }
        }
      }
    }
    for (const t of corse) for (const x of t.fermate) usate.set(x.s, stops.get(x.s)?.nome);
    // le fermate di ogni direzione, nell'ordine della corsa più frequente nei feriali
    const direzioni = [];
    for (const dir of [...new Set(corse.map(t => t.direction_id || '0'))].sort()) {
      const conta = new Map();
      for (const t of corse.filter(t => (t.direction_id || '0') === dir)) { const k = t.fermate.map(x => x.s).join(' '); conta.set(k, (conta.get(k) || 0) + 1); }
      const principale = [...conta].sort((a, b) => b[1] - a[1])[0][0].split(' ');
      const altre = [...new Set([...conta.keys()].flatMap(k => k.split(' ')))].filter(s => !principale.includes(s));
      const f = s => ({ id: s, nome: stops.get(s).nome, lat: stops.get(s).lat, lon: stops.get(s).lon });
      direzioni.push({ verso: dir, capolinea: stops.get(principale[principale.length - 1]).nome, fermate: principale.map(f), ...(altre.length ? { altre: altre.map(f) } : {}) });
    }
    out.push({ id, nome, breve: r.route_short_name, tipo: r.route_type === '11' ? 'filobus' : 'bus', passaggi, archi: [...archi.values()], fermate: stops, usate, direzioni });
  }
  // Le partenze vere di alcune corse («linea|fermata di salita|fermata di discesa»), per ogni data del feed.
  // Le date con le stesse partenze diventano un «tipo di giorno». Per ogni tipo:
  // - salite["linea|salita"]: le partenze da quella fermata (prima partenza, poi le differenze dalla prima),
  //   in minuti dalla mezzanotte: tutte le corse che portano ad almeno una delle discese usate;
  // - viaggi["linea|salita|discesa"]: i minuti di viaggio (mediana), oppure [minuti, partenze…] se verso quella
  //   discesa vanno solo alcune corse (le linee con le diramazioni).
  function partenze(chiavi) {
    const idLinea = new Map(out.map(l => [l.id, [...scelte].find(([, r]) => 'B' + r.route_short_name === l.id)[0]]));
    const perServizio = new Map();   // route_id -> service_id -> corse, con l'indice di ogni fermata
    for (const t of perTrip.values()) {
      if (!perServizio.has(t.route_id)) perServizio.set(t.route_id, new Map());
      const m = perServizio.get(t.route_id);
      if (!m.has(t.service_id)) m.set(t.service_id, []);
      const dove = new Map();
      t.fermate.forEach((x, i) => { if (!dove.has(x.s)) dove.set(x.s, []); dove.get(x.s).push(i); });
      m.get(t.service_id).push({ t: t.fermate.map(x => x.t), dove });
    }
    const tipi = [], firme = new Map(), giorni = {};
    const lista = v => v.map((x, i) => (i ? x - v[i - 1] : x));
    for (const d of tutte) {
      const attivi = date.get(d);
      const perChiave = {};
      for (const k of [...chiavi].sort()) {
        const [lid, a, b] = k.split('|');
        const coppie = [];
        for (const [sv, corse] of perServizio.get(idLinea.get(lid)) || []) {
          if (!attivi.has(sv)) continue;
          for (const c of corse) {
            // Una corsa circolare può passare dalla stessa fermata più volte: ogni salita utile conta.
            for (const ia of c.dove.get(a) ?? []) {
              const ib = c.dove.get(b)?.find(i => i > ia);
              if (ib != null) coppie.push([Math.round(c.t[ia]), c.t[ib] - c.t[ia]]);
            }
          }
        }
        if (!coppie.length) continue;
        coppie.sort((x, y) => x[0] - y[0]);
        perChiave[k] = { viaggio: Math.round(mediana(coppie.map(x => x[1])) * 2) / 2, partenze: [...new Set(coppie.map(x => x[0]))] };
      }
      const salite = {}, viaggi = {};
      for (const [k, v] of Object.entries(perChiave)) {
        const la = k.split('|').slice(0, 2).join('|');
        salite[la] = [...new Set([...(salite[la] || []), ...v.partenze])].sort((x, y) => x - y);
      }
      for (const [k, v] of Object.entries(perChiave)) {
        const la = k.split('|').slice(0, 2).join('|');
        viaggi[k] = v.partenze.length === salite[la].length ? v.viaggio : [v.viaggio, ...lista(v.partenze)];
      }
      for (const la of Object.keys(salite)) salite[la] = lista(salite[la]);
      const tipo = { salite, viaggi };
      const f = JSON.stringify(tipo);
      if (!firme.has(f)) { firme.set(f, tipi.length); tipi.push(tipo); }
      giorni[d] = firme.get(f);
    }
    // i nomi delle fermate usate, scritti per bene («ACTON - PLEBISCITO» → «Acton - Plebiscito»)
    const PICCOLE = new Set(['di', 'dei', 'del', 'della', 'delle', 'degli', 'a', 'al', 'alla', 'e', 'da', 'in']);
    const bello = s => s.toLowerCase().replace(/\s+/g, ' ').trim().split(' ').map((w, i) => (i && PICCOLE.has(w) ? w : w.replace(/(^|['(.-])(\p{L})/gu, (_, x, y) => x + y.toUpperCase()))).join(' ');
    const fermate = Object.create(null);
    for (const k of chiavi) for (const sid of k.split('|').slice(1)) fermate[sid] = bello(stops.get(sid).nome);
    return { dal: tutte[0], al: tutte[tutte.length - 1], giorni, tipi, fermate };
  }

  return { linee: out, feed: { dal: tutte[0], al: tutte[tutte.length - 1] }, date: tipiche, partenze };
}
