import test from 'node:test';
import assert from 'node:assert/strict';
import {luogoCercato,normalizza,equivalente} from './ricerca.mjs';
const luoghi=['La Locanda Gesù Vecchio','Trattoria da Nennella'];
test('il locale cercato prevale sulle congiunzioni della frase',()=>assert.equal(luogoCercato(luoghi,'pasta e patate nennella'),luoghi[1]));
test('accenti e nome composto identificano Gesù Vecchio',()=>assert.equal(luogoCercato(luoghi,'Gesù Vecchio'),luoghi[0]));
test('una congiunzione da sola non elegge un luogo',()=>assert.equal(luogoCercato(luoghi,'e'),null));
test('due luoghi ugualmente pertinenti conservano l’elenco senza preferenza',()=>assert.equal(luogoCercato(['Capri','Ischia'],'Capri Ischia'),null));
test('nome con apostrofo e ricerca parziale restano utilizzabili',()=>{
  assert.equal(normalizza("Castel dell’Ovo"),'castel dellovo');
  assert.equal(luogoCercato(['Castel dell’Ovo','Castel Nuovo'],'dellovo'),'Castel dell’Ovo');
});
test('i sinonimi già previsti restano coerenti',()=>assert.equal(equivalente(normalizza('Costo biglietto')),'prezzo biglietti'));
