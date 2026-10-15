// Il calendario «Tutti i mesi» del compositore (specifiche/compositore-rifiniture-2.md): le settimane di un mese, le tappe chiuse
// partendo da un giorno e i mesi da mostrare. Senza pagina, così si prova con node:test.
import { giornoSettimana, piuGiorni, type GiornoSettimana } from './date.ts';

export const DATA_MIN = '2026-01-01';
export const DATA_MAX = '2030-12-31';

const giorniNelMese = (mese: string) => new Date(Date.UTC(+mese.slice(0, 4), +mese.slice(5, 7), 0)).getUTCDate();
export const meseDopo = (mese: string, n: number) => { const d = new Date(Date.UTC(+mese.slice(0, 4), +mese.slice(5, 7) - 1 + n, 1)); return d.toISOString().slice(0, 7); };

// righe di sette giorni, dal lunedì; null dove il giorno è di un altro mese
export function settimaneDelMese(mese: string): (string | null)[][] {
  const vuoti = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'].indexOf(giornoSettimana(`${mese}-01`));
  const celle: (string | null)[] = [...Array(vuoti).fill(null), ...Array.from({ length: giorniNelMese(mese) }, (_, i) => `${mese}-${String(i + 1).padStart(2, '0')}`)];
  while (celle.length % 7) celle.push(null);
  return Array.from({ length: celle.length / 7 }, (_, i) => celle.slice(i * 7, i * 7 + 7));
}

type Giorno = { tappe?: string[]; gita?: string };
// se il viaggio comincia il giorno «primo»: per ogni giorno la data e le tappe chiuse quel giorno della settimana (campo «chiuso»
// di tappe.yaml); un giorno di gita non ha chiusure da mostrare qui
export function chiuseDa(giorni: Giorno[], primo: string, chiusoDi: (id: string) => GiornoSettimana[] | string[] | undefined) {
  return giorni.map((D, giorno) => {
    const data = piuGiorni(primo, giorno), s = giornoSettimana(data);
    return { giorno, data, chiuse: D.gita ? [] : (D.tappe ?? []).filter(id => (chiusoDi(id) as string[] | undefined)?.includes(s)) };
  });
}

// da questo mese (o da quello della data scelta, se è prima) per 15 mesi; una data scelta più avanti resta visibile; sempre dentro i
// limiti del compositore
export function mesiDaMostrare(oggi: string, data?: string, quanti = 15) {
  const min = DATA_MIN.slice(0, 7), max = DATA_MAX.slice(0, 7);
  let da = oggi.slice(0, 7);
  if (data && data.slice(0, 7) < da) da = data.slice(0, 7);
  if (da < min) da = min;
  let a = meseDopo(da, quanti - 1);
  if (data && data.slice(0, 7) > a) a = data.slice(0, 7);
  if (a > max) a = max;
  const mesi: string[] = [];
  for (let m = da; m <= a; m = meseDopo(m, 1)) mesi.push(m);
  return mesi;
}
