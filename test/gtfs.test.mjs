// Feed GTFS piccolissimi: nessuna rete e nessuna modifica ai dati generati.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { lineeBus } from '../scripts/itinerari/gtfs.mjs';
const { zipSync, strToU8, unzipSync } = createRequire(import.meta.url)('fflate');
const CONFIG = { linee: ['1'], finestre: { feriale: { giorni: [6], da: 0, a: 1800 } } };
function feed(t, cambia = {}, { manipola = b => b, livello = 6 } = {}) {
  const dati = {
    'routes.txt': 'route_id,route_short_name,route_type\nr,1,3\n',
    'trips.txt': 'route_id,service_id,trip_id,direction_id\nr,s,t,0\n',
    'stop_times.txt': 'trip_id,departure_time,arrival_time,stop_id,stop_sequence\nt,09:00:00,09:00:00,a,1\nt,09:10:00,09:10:00,b,2\n',
    'stops.txt': 'stop_id,stop_name,stop_lat,stop_lon\na,"CAFFÈ, MARE",40.8,14.2\nb,PORTO,40.81,14.21\n',
    'calendar_dates.txt': 'service_id,date,exception_type\ns,20261017,1\n',
    ...cambia
  };
  const cartella = fs.mkdtempSync(path.join(tmpdir(), 'nextstop-gtfs-'));
  const file = path.join(cartella, 'feed.zip');
  fs.writeFileSync(file, manipola(Buffer.from(zipSync(Object.fromEntries(Object.entries(dati).map(([k,v]) => [k, typeof v === 'string' ? strToU8(v) : v])), { level: livello }))));
  t.after(() => { fs.unlinkSync(file); fs.rmdirSync(cartella); });
  return lineeBus(file, CONFIG);
}
test('GTFS: legge il feed compresso, i campi CSV e le partenze della corsa', t => {
  const G = feed(t);
  assert.deepEqual(G.feed, { dal: '20261017', al: '20261017' });
  assert.equal(G.linee[0].direzioni[0].fermate[0].nome, 'CAFFÈ, MARE');
  assert.equal(G.linee[0].archi[0].tempi.feriale, 10);
  const P = G.partenze(new Set(['B1|a|b']));
  assert.deepEqual(P.tipi[0].salite['B1|a'], [540]);
  assert.equal(P.tipi[0].viaggi['B1|a|b'], 10);
});
test('GTFS: rifiuta minuti, secondi e ore impossibili nelle corse selezionate', t => {
  for (const ora of ['09:60:00', '09:00:60', '-1:00:00', 'abc:00:00']) {
    const righe = `trip_id,departure_time,stop_id,stop_sequence\nt,${ora},a,1\nt,10:10:00,b,2\n`;
    assert.throws(() => feed(t, { 'stop_times.txt': righe }), /GTFS.*orario/i, ora);
  }
});
test('GTFS: rifiuta tempi in discesa e sequenze ripetute senza inventare tempi minimi', t => {
  for (const [ora, sequenza] of [['08:50:00', 2], ['09:10:00', 1], ['09:10:00', 'errore']]) {
    const righe = `trip_id,departure_time,stop_id,stop_sequence\nt,09:00:00,a,1\nt,${ora},b,${sequenza}\n`;
    assert.throws(() => feed(t, { 'stop_times.txt': righe }), /GTFS.*(orari|sequenza)/i);
  }
});
test('GTFS: conserva le corse dopo mezzanotte e i secondi validi', t => {
  const G = feed(t, { 'stop_times.txt': 'trip_id,departure_time,stop_id,stop_sequence\nt,24:30:30,a,1\nt,25:00:30,b,2\n' });
  assert.equal(G.linee[0].archi[0].tempi.feriale, 30);
  assert.equal(G.partenze(new Set(['B1|a|b'])).tipi[0].viaggi['B1|a|b'], 30);
});
test('GTFS: rifiuta date impossibili ed eccezioni diverse da aggiunta o rimozione', t => {
  for (const riga of ['s,20260230,1', 's,20261301,1', 's,20261017,3']) {
    assert.throws(() => feed(t, { 'calendar_dates.txt': `service_id,date,exception_type\ns,20261017,1\n${riga}\n` }), /GTFS.*calendar_dates/i, riga);
  }
});
test('GTFS: le eccezioni valide sostituiscono il calendario settimanale', t => {
  const G = feed(t, {
    'calendar.txt': 'service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date\ns,0,0,0,0,0,1,0,20261017,20261024\n',
    'calendar_dates.txt': 'service_id,date,exception_type\ns,20261017,2\ns,20261018,1\n'
  });
  const P = G.partenze(new Set(['B1|a|b']));
  assert.deepEqual(P.tipi[P.giorni['20261017']].salite, {});
  assert.deepEqual(P.tipi[P.giorni['20261018']].salite['B1|a'], [540]);
  assert.deepEqual(P.tipi[P.giorni['20261024']].salite['B1|a'], [540]);
});
test('GTFS: ferma calendari invertiti e valori settimanali non validi', t => {
  for (const [dal, al, sabato] of [['20261024', '20261017', 1], ['20261017', '20261024', 2]]) {
    assert.throws(() => feed(t, { 'calendar.txt': `service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date\ns,0,0,0,0,0,${sabato},0,${dal},${al}\n` }), /GTFS.*calendar\.txt/i);
  }
});
test('GTFS: coordinate mancanti o fuori intervallo non diventano punti della mappa', t => {
  for (const [lat, lon] of [['', '14.2'], ['91', '14.2'], ['40.8', '181'], ['NaN', '14.2']]) {
    assert.throws(() => feed(t, { 'stops.txt': `stop_id,stop_name,stop_lat,stop_lon\na,A,${lat},${lon}\nb,B,40.81,14.21\n` }), /GTFS.*stops/i);
  }
});
test('GTFS: coordinate e sequenze errate nelle shape non entrano nel disegno del percorso', t => {
  for (const [lat, lon, n] of [['NaN', '14.205', 2], ['40.805', '181', 2], ['40.805', '14.205', 'errore']]) {
    assert.throws(() => feed(t, {
      'trips.txt': 'route_id,service_id,trip_id,direction_id,shape_id\nr,s,t,0,sh\n',
      'shapes.txt': `shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence\nsh,40.8,14.2,1\nsh,${lat},${lon},${n}\nsh,40.81,14.21,3\n`
    }), /GTFS.*shapes/i);
  }
});
test('GTFS: una shape valida resta leggibile con coordinate zero', t => {
  const G = feed(t, {
    'trips.txt': 'route_id,service_id,trip_id,direction_id,shape_id\nr,s,t,0,sh\n',
    'stops.txt': 'stop_id,stop_name,stop_lat,stop_lon\na,A,0,0\nb,B,0,0.002\n',
    'shapes.txt': 'shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence\nsh,0,0,1\nsh,0,0.001,2\nsh,0,0.002,3\n'
  });
  assert.deepEqual(G.linee[0].archi[0].punti, [[0, 0.001]]);
});

const directory = b => b.readUInt32LE(b.length - 6);
test('GTFS ZIP: rifiuta firme e offset incoerenti nella directory e nelle intestazioni locali', t => {
  for (const cambia of [
    b => b.writeUInt32LE(0, directory(b)),
    b => b.writeUInt32LE(0, 0),
    b => b.writeUInt32LE(0xffffffff, directory(b) + 42),
    b => b.writeUInt32LE(0xffffffff, directory(b) + 20)
  ]) assert.throws(() => feed(t, {}, { manipola: b => { cambia(b); return b; } }), /ZIP/i);
});
test('GTFS ZIP: rifiuta metodi non supportati, cifratura e dimensioni eccessive prima di decomprimere', t => {
  for (const cambia of [
    b => b.writeUInt16LE(99, directory(b) + 10),
    b => { b.writeUInt16LE(1, directory(b) + 8); b.writeUInt16LE(1, 6); },
    b => b.writeUInt32LE(256 * 1024 * 1024 + 1, directory(b) + 24)
  ]) assert.throws(() => feed(t, {}, { manipola: b => { cambia(b); return b; } }), /ZIP/i);
});
test('GTFS ZIP: verifica CRC e lunghezza anche per tabelle non compresse', t => {
  for (const cambia of [
    b => b.writeUInt32LE(0, directory(b) + 16),
    b => b.writeUInt32LE(1, directory(b) + 24),
    b => { const i = b.indexOf(Buffer.from('r,1,3')); assert.ok(i >= 0); b[i + 4] = 52; }
  ]) assert.throws(() => feed(t, {}, { livello: 0, manipola: b => { cambia(b); return b; } }), /ZIP/i);
});
test('GTFS ZIP: tabelle omonime in cartelle diverse non si sovrascrivono', t => {
  assert.throws(() => feed(t, { 'copia/routes.txt': 'route_id,route_short_name,route_type\nr,1,3\n' }), /ZIP.*(duplicat|omonim)/i);
});
test('GTFS ZIP: una firma finta nel commento non nasconde la directory valida', t => {
  const G = feed(t, {}, { manipola: b => {
    b.writeUInt16LE(22, b.length - 2);
    const finta = Buffer.alloc(22); finta.writeUInt32LE(0x06054b50, 0);
    return Buffer.concat([b, finta]);
  } });
  assert.equal(G.linee[0].archi[0].tempi.feriale, 10);
});
test('GTFS ZIP: tabelle conservate senza compressione e commenti ordinari restano validi', t => {
  const G = feed(t, {}, { livello: 0, manipola: b => {
    const commento = Buffer.from('Orari di prova'); b.writeUInt16LE(commento.length, b.length - 2);
    return Buffer.concat([b, commento]);
  } });
  assert.equal(G.linee[0].archi[0].tempi.feriale, 10);
});
test('GTFS CSV: virgolette non chiuse e campi extra non vengono ignorati', t => {
  for (const riga of ['r,1,3,extra', 'r,1,"3', 'r,1,"3"extra', 'r,1,3"']) {
    assert.throws(() => feed(t, { 'routes.txt': 'route_id,route_short_name,route_type\n' + riga + '\n' }), /GTFS.*CSV.*routes/i);
  }
});
test('GTFS CSV: intestazioni vuote o duplicate non sovrascrivono le colonne', t => {
  for (const header of ['route_id,route_short_name,route_type,route_id', 'route_id,route_short_name,route_type,']) {
    assert.throws(() => feed(t, { 'routes.txt': header + '\nr,1,3,r\n' }), /GTFS.*CSV.*routes/i);
  }
});
test('GTFS CSV: BOM, CRLF, virgole e virgolette raddoppiate restano compatibili', t => {
  const G = feed(t, { 'stops.txt': '\uFEFFstop_id,stop_name,stop_lat,stop_lon\r\na,"MARE, ""CAFFÈ""",40.8,14.2\r\nb,PORTO,40.81,14.21\r\n' });
  assert.equal(G.linee[0].direzioni[0].fermate[0].nome, 'MARE, "CAFFÈ"');
});


function conDescrittore(b, firma = true) {
  const c = directory(b), e = b.length - 22, n = b.readUInt16LE(e + 10);
  const dimensione = b.readUInt32LE(c + 24), compresso = b.readUInt32LE(c + 20), crc = b.readUInt32LE(c + 16);
  const fine = 30 + b.readUInt16LE(26) + b.readUInt16LE(28) + compresso;
  const d = Buffer.alloc(firma ? 16 : 12); let offset = 0;
  if (firma) { d.writeUInt32LE(0x08074b50, 0); offset = 4; }
  d.writeUInt32LE(crc, offset); d.writeUInt32LE(compresso, offset + 4); d.writeUInt32LE(dimensione, offset + 8);
  const out = Buffer.concat([b.subarray(0, fine), d, b.subarray(fine)]);
  out.writeUInt16LE(out.readUInt16LE(6) | 8, 6);
  for (const p of [14,18,22]) out.writeUInt32LE(0, p);
  let p = c + d.length;
  for (let i = 0; i < n; i++) {
    if (!i) out.writeUInt16LE(out.readUInt16LE(p + 8) | 8, p + 8);
    const locale = out.readUInt32LE(p + 42);
    if (locale >= fine) out.writeUInt32LE(locale + d.length, p + 42);
    p += 46 + out.readUInt16LE(p + 28) + out.readUInt16LE(p + 30) + out.readUInt16LE(p + 32);
  }
  out.writeUInt32LE(c + d.length, e + d.length + 16);
  assert.deepEqual(unzipSync(out), unzipSync(b), 'Il feed di prova deve essere uno ZIP valido anche per il lettore indipendente');
  return out;
}
test('GTFS ZIP: legge descrittori con e senza firma, con dati compressi o conservati', t => {
  for (const firma of [true, false]) for (const livello of [0, 6]) {
    const G = feed(t, {}, { livello, manipola: b => conDescrittore(b, firma) });
    assert.equal(G.linee[0].archi[0].tempi.feriale, 10);
  }
});
test('GTFS ZIP: rifiuta il descrittore alterato senza leggere altre tabelle', t => {
  assert.throws(() => feed(t, {}, { manipola: b => {
    const out = conDescrittore(b), fine = 30 + out.readUInt16LE(26) + out.readUInt16LE(28) + b.readUInt32LE(directory(b) + 20);
    out.writeUInt32LE(0, fine + 4); return out;
  } }), /ZIP.*descrittore/i);
});
test('GTFS ZIP: il limite di uscita ferma una tabella che si espande oltre la lunghezza dichiarata', t => {
  assert.throws(() => feed(t, { 'routes.txt': 'route_id,route_short_name,route_type\nr,1,3\n' + 'x'.repeat(1024 * 1024) }, { manipola: b => {
    b.writeUInt32LE(1, 22); b.writeUInt32LE(1, directory(b) + 24); return b;
  } }), /ZIP.*compresso/i);
});
test('GTFS CSV: byte UTF-8 non validi non diventano nomi con caratteri sostitutivi', t => {
  const dati = Buffer.from('stop_id,stop_name,stop_lat,stop_lon\na,A,40.8,14.2\nb,B,40.81,14.21\n');
  dati[dati.indexOf(Buffer.from('a,A')) + 2] = 255;
  assert.throws(() => feed(t, { 'stops.txt': dati }), /GTFS.*UTF-8/i);
});


test('GTFS ZIP: mutazioni deterministiche delle intestazioni terminano con dati validi o un rifiuto controllato', t => {
  const campi = [0,4,6,8,14,18,22,26,28];
  let stato = 123456789;
  const casuale = () => { stato ^= stato << 13; stato ^= stato >>> 17; stato ^= stato << 5; return stato >>> 0; };
  for (let i = 0; i < 120; i++) {
    try {
      const G = feed(t, {}, { manipola: b => {
        const c = directory(b), e = b.length - 22;
        const offset = i % 3 === 0 ? campi[casuale() % campi.length] : i % 3 === 1 ? c + casuale() % 46 : e + casuale() % 22;
        b[offset] ^= 1 << (casuale() % 8); return b;
      } });
      assert.equal(G.linee[0].archi[0].tempi.feriale, 10);
    } catch (errore) { assert.match(errore.message, /^GTFS(?: ZIP|:| CSV)/, 'Nessun RangeError o arresto fuori controllo: mutazione ' + i); }
  }
});
