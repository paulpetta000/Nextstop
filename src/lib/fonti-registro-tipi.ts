import type { CollectionEntry } from 'astro:content';

export type DatiFonte = Omit<CollectionEntry<'fonti'>['data'], 'controllato' | 'pubblicato'> & {
  controllato: string | Date;
  pubblicato?: string | Date;
};
export type FonteInput = { id: string; data: DatiFonte } | (DatiFonte & { id: string; data?: undefined });
export interface MetadatiFonte {
  categoria: string;
  luoghi: string[];
  descrizione: string;
  avviso?: string;
  nota?: string;
  formato?: string;
  parole: string[];
  priorita: number;
  lingua?: string;
  lettura?: { label: string; data: string } | null;
  prova?: string;
  schede?: string[];
  durate?: string[];
  testi?: string[];
  titoloBreve?: string;
  urlDocumento?: string;
}
export type FonteRegistro = MetadatiFonte & {
  id: string;
  titolo: string;
  titoloOriginale: string;
  url: string;
  editore: string;
  tipo: DatiFonte['tipo'];
  data: string;
  dataLabel: string;
  pubblicato: string;
  avviso: string;
  nota: string;
  formato: string;
};
