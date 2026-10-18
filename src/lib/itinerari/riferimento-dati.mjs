// Solo build/Node: identità della base dei tempi e della proiezione, non autenticazione.
import { createHash } from 'node:crypto';
export const riferimentoDati = (tempi, proiezione) => createHash('sha256').update(JSON.stringify([tempi, proiezione])).digest('hex').slice(0, 20);
