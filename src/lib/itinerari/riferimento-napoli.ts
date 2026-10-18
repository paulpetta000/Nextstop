// Solo durante la build. Nessuna dipendenza Node nel decoder del browser.
import T from '../../data/tempi-tappe.json';
import M from '../../data/mappa.json';
import P from '../../data/partenze-bus.json';
import L from '../../data/linee-bus.json';
import D from '../../data/percorsi-tappe.json';
import A from '../../data/percorsi-alternativi.json';
import { verificaGenerazione } from './generazione-dati.mjs';
import { riferimentoDati } from './riferimento-dati.mjs';
verificaGenerazione({ 'tempi-tappe.json': T, 'partenze-bus.json': P, 'linee-bus.json': L, 'percorsi-tappe.json': D, 'percorsi-alternativi.json': A }, { w: M.w, h: M.h, box: M.box });
export const RIFERIMENTO = riferimentoDati(T, { w: M.w, h: M.h, box: M.box });
