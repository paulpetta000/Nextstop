import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PAGINE} from '../src/data/pagine.ts';
import {SITO} from '../src/config/sito.ts';
const file=fs.readFileSync(new URL('../src/pages/sitemap.xml.ts',import.meta.url),'utf8').replace(/^import .*$/gm,'').replace('export const GET: APIRoute =','const GET =');
async function genera(data){
 class DataBuild extends Date{constructor(...args){super(...(args.length?args:[data]));}}
 const get=new Function('PAGINE','SITO','Date',file+';return GET;')(PAGINE,SITO,DataBuild);const r=await get();return {xml:await r.text(),tipo:r.headers.get('content-type')};
}
test('sitemap: ricostruire pagine immutate in un altro giorno non inventa aggiornamenti',async()=>{
 const prima=await genera('2026-10-20T10:00:00Z'),dopo=await genera('2026-11-21T18:00:00Z');assert.equal(prima.xml,dopo.xml);assert.doesNotMatch(prima.xml,/<lastmod>/);
});
test('sitemap: conserva tutte le nove URL canoniche e le alternative italiane',async()=>{
 const {xml,tipo}=await genera('2026-10-20T10:00:00Z');const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.deepEqual(urls,PAGINE.map(p=>SITO.url+p.path));assert.equal(new Set(urls).size,urls.length);assert.equal((xml.match(/hreflang="it"/g)||[]).length,PAGINE.length);assert.equal(tipo,'application/xml; charset=utf-8');
});
