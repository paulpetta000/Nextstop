import type { Scenario } from './tipi';

// Formato dei file del generatore, distinto dal pacco compatto del browser.
// I controlli a esecuzione restano necessari quando i dati vengono letti dal JSON.
export interface Proiezione {
  w: number; h: number;
  box: { w: number; e: number; n: number; s: number };
}
interface BaseGenerata { firma: string; generazione?: string }
export interface CalendarioBus {
  dal: string; al: string; giorni: Record<string, number>;
  tipi: { salite: Record<string, number[] | undefined>; viaggi: Record<string, number | number[] | undefined> }[];
  fermate: Record<string, string>;
}
interface ScenarioGenerato {
  min: number[][]; piedi: number[][]; salita: number[][]; mezzi?: string[][];
  senza?: { min: number[][]; piedi: number[][]; mezzi: string[][] };
  bus?: (number | number[])[][];
}
export interface DatiGenerati {
  'tempi-tappe.json': BaseGenerata & {
    punti: string[]; linee: { id: string; nome: string }[];
    candidati: { seg: (number | string)[]; m: number; mezzi: string }[];
    scenari: Record<Scenario, ScenarioGenerato>;
  };
  'partenze-bus.json': BaseGenerata & CalendarioBus;
  'percorsi-tappe.json': BaseGenerata & { punti: string[]; scenari: Record<Scenario, (string | number)[][]> };
  'percorsi-alternativi.json': BaseGenerata & { candidati: string[]; senza: Record<Exclude<Scenario, 'piedi'>, (string | number)[][]> };
  'linee-bus.json': { generazione?: string; [campo: string]: unknown };
}
