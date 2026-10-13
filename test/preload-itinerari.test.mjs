import {test} from 'node:test';
import assert from 'node:assert/strict';
import {precaricaDipendenze} from '../integrations/preload-itinerari.mjs';
const html='<head></head><body><script type="module" src="/_astro/app.js"></script></body>';
test('preload: scopre le dipendenze statiche senza anticipare mappa o rete esterna',()=>{
 const files={'/_astro/app.js':'import{ora}from"./date.js";import("./mappa.js");import "https://esempio.invalid/esterno.js";','/_astro/date.js':'export const ora=()=>0;'};
 const reads=[];
 const out=precaricaDipendenze(html,url=>{reads.push(url);assert.ok(files[url],url);return files[url];});
 assert.ok(out.includes('<link rel="modulepreload" href="/_astro/date.js">'));
 assert.ok(!out.includes('href="/_astro/mappa.js"'));
 assert.deepEqual(reads,['/_astro/app.js','/_astro/date.js']);
 assert.equal(precaricaDipendenze(out,url=>files[url]),out);
});
test('preload: dipendenze condivise e cicli producono un solo collegamento',()=>{
 const files={'/_astro/app.js':'import "./a.js";import "./b.js";','/_astro/a.js':'import "./date.js";','/_astro/b.js':'import "./date.js";','/_astro/date.js':'import "./app.js";'};
 const out=precaricaDipendenze(html,url=>files[url]);
 assert.equal([...out.matchAll(/href="\/_astro\/date.js"/g)].length,1);
 assert.ok(!out.includes('href="/_astro/app.js"'));
});
test('preload: una pagina senza moduli rimane identica',()=>{
 assert.equal(precaricaDipendenze('<head></head><p>Prova</p>',()=>assert.fail()),'<head></head><p>Prova</p>');
});
