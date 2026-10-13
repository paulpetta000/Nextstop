const sharp = require('C:/Users/Windows11/Documents/nextstop/node_modules/sharp'); const fs = require('fs'), path = require('path');
const OUT = process.argv[2], SOLO = (process.argv[3] || '1,2,3,4').split(','), TEMI = (process.argv[4] || 'light,dark').split(',');
const PEZZI = (process.argv[5] || 'giorno,scheda,sotto').split(',');
(async () => {
  for (const tema of TEMI) for (const q of SOLO) {
    const files = ['c', 'd'].flatMap(p => PEZZI.map(s => path.join(OUT, `q${q}-${p}-${s}-${tema}.png`))).filter(f => fs.existsSync(f));
    const W = 780, H = 1688, G = 36, img = [];
    for (const f of files) img.push(await sharp(fs.readFileSync(f)).resize(W, H, { fit: 'cover', position: 'top' }).toBuffer());
    const buf = await sharp({ create: { width: img.length * (W + G) + G, height: H + 2 * G, channels: 3, background: '#30353c' } }).composite(img.map((b, i) => ({ input: b, left: G + i * (W + G), top: G }))).png().toBuffer();
    await sharp(buf).resize({ width: 2600 }).jpeg({ quality: 80 }).toFile(path.join(OUT, `proposta-${q}-${tema === 'light' ? 'chiaro' : 'scuro'}.jpg`));
    console.log('foglio', q, tema);
  }
})().catch(e => console.log('ERR', e.message));
