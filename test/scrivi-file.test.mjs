import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { scriviFile, scriviFilePreparati } from '../scripts/scrivi-file.mjs';

function ambiente(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nextstop-scrittura-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const a = path.join(dir, 'a.json'), b = path.join(dir, 'b.json');
  fs.writeFileSync(a, 'prima-a'); fs.writeFileSync(b, 'prima-b');
  const uscite = [{ file: a, contenuto: 'dopo-a' }, { file: b, contenuto: 'dopo-b' }];
  return { dir, a, b, uscite };
}
const disco = modifiche => new Proxy(fs, { get: (o, k) => modifiche[k] ?? o[k] });

test('scrittura: testo UTF-8, Buffer e URL sostituiscono soltanto file completi', t => {
  const e = ambiente(t); let sostituiti = 0;
  scriviFilePreparati([{ file: pathToFileURL(e.a), contenuto: 'città' }, { file: e.b, contenuto: Buffer.from([0,255,1]) }], disco({
    renameSync: (da, a) => { assert.match(fs.readFileSync(a, 'utf8'), /^prima-/); assert.ok(fs.statSync(da).size > 0); fs.renameSync(da, a); sostituiti++; }
  }));
  assert.equal(sostituiti, 2); assert.equal(fs.readFileSync(e.a, 'utf8'), 'città');
  assert.deepEqual(fs.readFileSync(e.b), Buffer.from([0,255,1]));
  assert.deepEqual(fs.readdirSync(e.dir).sort(), ['a.json', 'b.json']);
});

test('scrittura: disco pieno sul secondo temporaneo conserva entrambi gli originali', t => {
  const e = ambiente(t); let scritture = 0;
  const guasto = Object.assign(new Error('disco pieno fittizio'), { code: 'ENOSPC' });
  assert.throws(() => scriviFilePreparati(e.uscite, disco({ writeFileSync: (fd, testo) => {
    if (++scritture === 2) { fs.writeFileSync(fd, 'frammento'); throw guasto; } fs.writeFileSync(fd, testo);
  } })), x => x === guasto);
  assert.equal(fs.readFileSync(e.a, 'utf8'), 'prima-a'); assert.equal(fs.readFileSync(e.b, 'utf8'), 'prima-b');
  assert.deepEqual(fs.readdirSync(e.dir).sort(), ['a.json', 'b.json']);
});

test('scrittura: un errore di sincronizzazione non sostituisce il file precedente', t => {
  const e = ambiente(t);
  assert.throws(() => scriviFile(e.a, 'dopo', disco({ fsyncSync: () => { throw new Error('sync fittizio'); } })), /sync fittizio/);
  assert.equal(fs.readFileSync(e.a, 'utf8'), 'prima-a'); assert.equal(fs.readdirSync(e.dir).length, 2);
});

test('scrittura: rename rifiutato conserva quel file e pulisce i temporanei', t => {
  const e = ambiente(t);
  assert.throws(() => scriviFilePreparati(e.uscite, disco({ renameSync: (da, a) => {
    if (a === e.b) throw new Error('file occupato fittizio'); fs.renameSync(da, a);
  } })), /file occupato/);
  // Non è una transazione su più file: il primo è completo, il secondo resta vecchio.
  assert.equal(fs.readFileSync(e.a, 'utf8'), 'dopo-a'); assert.equal(fs.readFileSync(e.b, 'utf8'), 'prima-b');
  assert.deepEqual(fs.readdirSync(e.dir).sort(), ['a.json', 'b.json']);
});

test('scrittura: destinazioni duplicate e contenuti errati sono rifiutati prima del disco', t => {
  const e = ambiente(t);
  for (const uscite of [[...e.uscite, { file: path.join(e.dir, '.', 'a.json'), contenuto: 'altro' }], [...e.uscite, { file: path.join(e.dir, 'c.json'), contenuto: undefined }]]) {
    assert.throws(() => scriviFilePreparati(uscite)); assert.equal(fs.readFileSync(e.a, 'utf8'), 'prima-a');
    assert.deepEqual(fs.readdirSync(e.dir).sort(), ['a.json', 'b.json']);
  }
});

test('scrittura: errore di pulizia non nasconde l’errore del disco', t => {
  const e = ambiente(t);
  assert.throws(() => scriviFile(e.a, 'dopo', disco({ writeFileSync: () => { throw new Error('disco fittizio'); }, unlinkSync: () => { throw new Error('pulizia fittizia'); } })), e => e instanceof AggregateError && e.errors.some(x => /disco fittizio/.test(x.message)) && e.errors.some(x => /pulizia fittizia/.test(x.message)));
  assert.equal(fs.readFileSync(e.a, 'utf8'), 'prima-a');
});

test('scrittura: una destinazione assente compare solo dopo il completamento', t => {
  const e = ambiente(t), c = path.join(e.dir, 'nuovo.zip');
  scriviFile(c, Buffer.from([1,2,3]), disco({ renameSync: (da, a) => { assert.equal(fs.existsSync(a), false); fs.renameSync(da, a); } }));
  assert.deepEqual(fs.readFileSync(c), Buffer.from([1,2,3]));
});
