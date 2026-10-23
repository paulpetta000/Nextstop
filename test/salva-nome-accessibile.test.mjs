import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const file=fs.readFileSync(new URL('../src/scripts/itinerari/compositore/fogli.js',import.meta.url),'utf8');
const actual=file.slice(file.indexOf('const spilloSalva ='),file.indexOf('export const stato =')).replace(/^export /gm,'');
for(const vista of ['c','d'])for(const [nome,fatto,pendente,label] of [
  ['bozza',false,false,'Salva itinerario'],
  ['salvato',true,false,'Salvato: apri i miei itinerari'],
  ['in corso',false,true,'Salvataggio in corso']
])test('nome accessibile del salvataggio: vista '+vista+', '+nome,()=>{
  const ctx=vm.createContext({S:{p:vista},statoSalvataggio:()=>({fatto}),salvataggioInCorso:()=>pendente});
  vm.runInContext(actual+'; globalThis.render=bottoneSalva;',ctx);
  const html=ctx.render('prova');
  assert.ok(html.includes('aria-label="'+label+'"'));
  assert.match(html,/<span class="salva__t" aria-hidden="true">/);
  assert.equal(/ disabled(?:>| )/.test(html),pendente);
});
