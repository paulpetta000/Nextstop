// Scarica i dati OpenStreetMap del riquadro della mappa a riquadri piccoli (API 0.6, dati ODbL).
// Se un riquadro ha troppi dati (centro storico), lo divide in quattro e riprova.
// Uso: node scripts/mappa/scarica.mjs <cartella>   (poi: node scripts/mappa/costruisci.mjs <cartella>)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { BOX } from './riquadro.mjs';
import { setTimeout as pausa } from 'node:timers/promises';
import { leggiXml } from './osm.mjs';
import { scriviFile } from '../scrivi-file.mjs';

const dir = process.argv[2] || 'riquadri';
fs.mkdirSync(dir, { recursive: true });
const PASSO_LAT = 0.008, PASSO_LON = 0.012;
const r3 = v => Math.round(v * 100000) / 100000;
const attesa = pausa;

async function scarica(w, s, e, n, livello = 0) {
  const f = path.join(dir, `t_${r3(w)}_${r3(s)}_${r3(e)}_${r3(n)}.xml`);
  if (fs.existsSync(f) && fs.statSync(f).size > 0) {
    leggiXml(fs.readFileSync(f),path.basename(f));
    return;
  }
  for (let prova = 1; prova <= 3; prova++) {
    let codice = '000';
    let dati;
    const temporanea=fs.mkdtempSync(path.join(path.resolve(dir),'.nextstop-'));
    const provvisorio=path.join(temporanea,'riquadro');
    try {
      codice = execFileSync('curl', ['-sS', '--compressed', '--max-time', '180', '-A', 'nextstop-itinerari/1.0 (map build)', '-o', provvisorio, '-w', '%{http_code}',
        `https://api.openstreetmap.org/api/0.6/map?bbox=${r3(w)},${r3(s)},${r3(e)},${r3(n)}`]).toString();
      if(codice==='200') { dati=fs.readFileSync(provvisorio);leggiXml(dati,path.basename(f)); }
    } catch(e) { codice = 'errore';console.log(path.basename(f),e.message); }
    finally { fs.rmSync(provvisorio,{force:true});fs.rmdirSync(temporanea); }
    if (codice === '200') {
      scriviFile(f,dati);
      console.log(path.basename(f), (dati.length / 1e6).toFixed(1), 'MB');
      await attesa(1000); return;
    }
    // 400 = troppi nodi nel riquadro: lo divido
    if (codice === '400' && livello < 4) {
      const mx = (w + e) / 2, my = (s + n) / 2;
      console.log('divido', path.basename(f));
      for (const [a, b, c, d] of [[w, s, mx, my], [mx, s, e, my], [w, my, mx, n], [mx, my, e, n]]) await scarica(a, b, c, d, livello + 1);
      return;
    }
    console.log('riprovo', path.basename(f), codice); if(prova<3)await attesa(5000);
  }
  throw new Error('Riquadro non scaricato: ' + f);
}

for (let s = BOX.s; s < BOX.n - 1e-9; s += PASSO_LAT) {
  for (let w = BOX.w; w < BOX.e - 1e-9; w += PASSO_LON) await scarica(w, s, Math.min(w + PASSO_LON, BOX.e), Math.min(s + PASSO_LAT, BOX.n));
}
console.log('FATTO');
