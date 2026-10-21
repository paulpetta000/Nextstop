import type { Tappa, Giorno } from '../../../lib/itinerari/tipi';
import type { DatiUI, DatiCerca } from '../../../lib/itinerari/ui';

export type DettagliTappa = DatiUI['tappe'][string] & Partial<DatiCerca[string]>;
// L'evento sintetico non ha indice di matrice, visita reversibile o preferenze.
export type TappaPagina = Omit<Tappa, 'foto' | 'p' | 'bambini' | 'momento' | 'reversibile'>
  & Partial<Pick<Tappa, 'p' | 'bambini' | 'momento' | 'reversibile'>>
  & DettagliTappa & { zonaId?: string; evento?: boolean };
export type InterfacciaCitta = Omit<DatiUI, 'tappe'> & { tappe: Record<string, DettagliTappa> };
export type Pronto = { id: string; nome: string; durata: string; evento?: boolean; giorni: Giorno[] };
export type ElementoDati<K extends string, E extends Element = HTMLElement> = E & {
  dataset: DOMStringMap & Record<K, string>;
};
export interface StatoPagina {
  g: number; p: 'c' | 'd'; attiva: string | null; nuova: string | null;
  tutte: boolean; cifre: Record<string, number>; fini: Record<number, number>; anima: boolean;
}
export type MomentoPasto = Parameters<typeof import('../../../lib/itinerari/pasti').preparaPasto>[2] & {
  ora: number; min: number; dopo: string | null;
  pausa?: boolean; attesa?: number; piccola?: boolean; nascosto?: boolean;
};
export interface LocaleVicino {
  id: string; min: number; arrivo: number;
  stato: 'aperto' | 'chiuso' | 'stretto' | 'ignoto'; nota: string; mezzi: boolean;
}
export type VoceMenu = import('../../../lib/itinerari/pause').VoceGiornata | { tipo: 'pasto'; m: MomentoPasto };
export interface StatoScheda {
  id: string; detent: 'meta' | 'tutto'; cima?: number; chiude?: boolean;
  animazione?: Animation; chiusura?: Promise<boolean>;
  fermaGesto?: ((ev?: Event & { pointerId?: number }) => void) | null;
}
export interface RicercaPrecedente { q: string; filtro: string }
