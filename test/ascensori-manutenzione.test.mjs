import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../scripts/itinerari/costruisci.mjs', import.meta.url), 'utf8');
const config = source.slice(source.indexOf('// Ascensori pubblici gratuiti'), source.indexOf('// ---------- Dati ----------'));
const search = source.slice(source.indexOf('class Heap'), source.indexOf('function percorso('));
assert.ok(config.includes('ASCENSORI_FERIALI') && search.includes('function rete('));

function grafo(id, { chiudeDomenica = false, ascensore = true } = {}) {
  // Due accessi collegati dall'ascensore (2 min) e una strada normale più lunga (12 min).
  // La strada è la stessa nei due versi e non va tolta insieme all'impianto chiuso.
  const adj = new Map([
    [1, [{a:id,t:0,tipo:'piedi'}, {a:2,t:12,tipo:'piedi'}]],
    [id, [{a:1,t:0,tipo:'piedi'}, {a:2,t:0,tipo:'piedi'}]],
    [2, [{a:id,t:0,tipo:'piedi'}, {a:1,t:12,tipo:'piedi'}]],
  ]);
  return new Function('adj','ascensori', config + `
    const MEZZI=new Map(),fermate=[],corse=[],PIEDI={ascensore:1},BUS={preferenza:5};
    ${search};return {rete,dijkstra};`)(adj, new Map(ascensore ? [[id,{nome:'Impianto fittizio',chiudeDomenica}]] : []));
}

for (const [nome,id] of [['Acton',2217391295],['Chiaia',3803566239]]) {
  test(`${nome}: manutenzione esclude il passaggio in entrambi i versi e nei candidati bus`, () => {
    const api=grafo(id);
    for(const scenario of ['feriale','sabato','sabato-pomeriggio','domenica','festivo','piedi']) {
      for(const modo of ['media','senza','subito']) {
        const rete=api.rete({nome:scenario,mezzi:scenario!=='piedi'},modo);
        for(const [da,a] of [[1,2],[2,1]]) {
          const r=api.dijkstra(da,rete);
          assert.equal(r.tempo.get(a),12,`${scenario}/${modo}/${da}: resta la strada ordinaria`);
          assert.equal(r.tempo.has(id),false,'nessun ingresso nel nodo chiuso');
        }
        assert.deepEqual(rete(id),[],'nessuna uscita dal nodo chiuso');
      }
    }
  });
}

test('ascensori in servizio: Sanità e Monte Echia conservano attesa/corsa e accessi', () => {
  for(const id of [4843875295,11846913533]) {
    const api=grafo(id);
    for(const scenario of ['feriale','festivo','piedi']) {
      const rete=api.rete({nome:scenario,mezzi:scenario!=='piedi'});
      for(const [da,a] of [[1,2],[2,1]]) assert.equal(api.dijkstra(da,rete).tempo.get(a),2);
    }
  }
});

test('chiusura festiva già prevista: conserva il percorso normale senza usare l’ascensore', () => {
  const api=grafo(4843875295,{chiudeDomenica:true});
  assert.equal(api.dijkstra(1,api.rete({nome:'feriale',mezzi:true})).tempo.get(2),2);
  assert.equal(api.dijkstra(1,api.rete({nome:'festivo',mezzi:true})).tempo.get(2),12);
});

test('un nodo ordinario con lo stesso ID non viene trattato come un impianto chiuso', () => {
  const api=grafo(2217391295,{ascensore:false});
  assert.equal(api.dijkstra(1,api.rete({nome:'feriale',mezzi:true})).tempo.get(2),0);
});
