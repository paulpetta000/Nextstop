import type { Giornata } from '../../../lib/itinerari/pause';
import type { Punto } from '../../../lib/itinerari/strade';
import type { Scenario } from '../../../lib/itinerari/tipi';
export interface BaseMappa {
  riferimento?: string; w: number; h: number;
  mare: string; isole: string; parchi: string; strade: string[]; moli: string;
}
export interface PercorsiMappa {
  riferimento?: string; punti: string[];
  scenari: Record<Scenario, (string | number)[][]>;
}
export interface AlternativiMappa {
  riferimento?: string; senza: Partial<Record<Scenario, (string | number)[][]>>; candidati: string[];
}
export interface IndiceStrade {
  riferimento?: string; lato: number; pezzi: string[]; principali: [string, number, string][];
}
export type DatiMappa = [BaseMappa, PercorsiMappa, IndiceStrade | null];
export type LimitiMappa = { x1: number; x2: number; y1: number; y2: number };
export interface LineaMappa { modo: string; d: string; v: number; dentro?: boolean }
export type LineaInFila = LineaMappa & { tappaDopo: number };
export interface OpzioniMappa {
  tutte?: (g: Giornata | null) => boolean;
  punto?: (id: string, b: HTMLElement) => void;
  tocca?: (id: string) => void;
  cambiaTutte?: (si: boolean) => void;
  margini?: () => { t: number; r: number; b: number; l: number };
  distanza?: number;
}
export interface DisegnoMappa {
  altre?: Giornata[]; vola?: boolean; n?: number; disegna?: boolean;
  daLinea?: number | null; punti?: string[] | null;
}
export type PuntoSegno = { x: number; y: number; x0: number; y0: number; r?: number };
export type PartenzaMappa = { vb: import('../../../lib/itinerari/strade').Riquadro; dita: Map<number, Punto> };
