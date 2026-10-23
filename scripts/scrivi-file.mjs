// Prepara tutti i file prima di sostituirne uno. Il rename è atomico per singolo file,
// non per il gruppo: la build deve rifiutare eventuali generazioni miste.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

export function scriviFilePreparati(uscite, io = fs) {
  const visti = new Set();
  const file = uscite.map(({ file, contenuto }) => {
    const destinazione = path.resolve(file instanceof URL ? fileURLToPath(file) : file);
    const chiave = process.platform === 'win32' ? destinazione.toLowerCase() : destinazione;
    if (visti.has(chiave)) throw new Error('Destinazione ripetuta: ' + destinazione);
    if (typeof contenuto !== 'string' && !Buffer.isBuffer(contenuto)) throw new Error('Contenuto non valido: ' + destinazione);
    visti.add(chiave);
    return { destinazione, contenuto, temporaneo: destinazione + '.' + randomUUID() + '.tmp' };
  });
  const creati = [];
  let errore;
  try {
    for (const f of file) {
      // wx impedisce di troncare un temporaneo già presente. Conserviamo il nome
      // anche se il disco si riempie dopo l'apertura, per rimuovere il frammento.
      const fd = io.openSync(f.temporaneo, 'wx');
      creati.push(f.temporaneo);
      try { io.writeFileSync(fd, f.contenuto); io.fsyncSync(fd); }
      finally { io.closeSync(fd); }
    }
    for (const f of file) io.renameSync(f.temporaneo, f.destinazione);
  } catch (e) { errore = e; }
  const errori = errore ? [errore] : [];
  for (const f of creati) {
    try { io.unlinkSync(f); }
    catch (e) { if (e.code !== 'ENOENT') errori.push(e); }
  }
  if (errori.length === 1) throw errori[0];
  if (errori.length) throw new AggregateError(errori, 'Scrittura o pulizia dei file non riuscita');
}

export const scriviFile = (file, contenuto, io = fs) => scriviFilePreparati([{ file, contenuto }], io);
