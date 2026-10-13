import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('il manifest locale conserva le credenziali nell’anteprima protetta',()=>{
 const layout=fs.readFileSync(new URL('../src/layouts/Base.astro',import.meta.url),'utf8');
 const tag=layout.match(/<link\b[^>]*rel="manifest"[^>]*>/)?.[0];
 assert.ok(tag,'Manifest presente');
 assert.match(tag,/href="\/manifest\.webmanifest"/,'Manifest sullo stesso dominio');
 assert.match(tag,/crossorigin="use-credentials"/,'Il browser deve inviare il cookie di accesso anche per il manifest protetto');
});
