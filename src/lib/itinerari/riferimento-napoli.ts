// Solo durante la build. Nessuna dipendenza Node nel decoder del browser.
import T from '../../data/tempi-tappe.json';
import M from '../../data/mappa.json';
import { riferimentoDati } from './riferimento-dati.mjs';
export const RIFERIMENTO = riferimentoDati(T, { w: M.w, h: M.h, box: M.box });
