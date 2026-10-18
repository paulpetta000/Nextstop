// Feed GTFS piccolissimi: nessuna rete e nessuna modifica ai dati generati.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { lineeBus } from '../scripts/itinerari/gtfs.mjs';
const { zipSync, strToU8 } = createRequire(import.meta.url)('fflate');
const CONFIG = { linee: ['1'], finestre: { feriale: { giorni: [6], da: 0, a: 1800 } } };
function feed(t, cambia = {}) {
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
  fs.writeFileSync(file, zipSync(Object.fromEntries(Object.entries(dati).map(([k,v]) => [k, strToU8(v)]))));
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