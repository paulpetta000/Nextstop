// I dati della pagina del compositore nuovo (solo durante la build): per ogni tappa, locale e gita la foto delle cartoline
// e la miniatura, la prima frase del testo, le frasi dove cerca la ricerca (con chi le ha scritte), le fonti e la data del
// controllo; il marchio. Le schede complete restano nei <template> della pagina (Scheda.astro, SchedaLocale.astro).
import { getImage } from 'astro:assets';
import { getEntry } from 'astro:content';
import type { Tappa as TappaDati } from '../tappe';
import type { Locale } from '../locali';
import { fontiDi, controlloMenoRecente, tutteLeFonti, type Fatto } from '../fatti';
import { marchio, SPILLO_O } from '../marchio.mjs';
import type { Citta } from './tipi';

const pulisci = (s?: string) => (s ?? '').trim().replace(/\{\?[^}]*\}/g, '').replace(/\*([^*]+)\*/g, '$1').replace(/\s+/g, ' ');
const frasiDi = (s?: string) => pulisci(s).split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú«"])/).filter(x => x.length > 3);
const interno = (svg: string) => svg.replace(/<svg[^>]*>/, '').replace('</svg>', '');

type Fonte = { titolo: string; editore: string; url: string; tipo: string };
export type DatiUI = {
  tappe: Record<string, { foto?: { m?: string; c?: string }; frase?: string; frasi: { t: string; da: string | null }[]; fonti: Fonte[]; controllato: string | null }>;
  marchio: { chiaro: string; scuro: string; spillo: string };
  citta: string[];
};

export async function datiUI(C: Citta, tappe: TappaDati[], locali: Locale[]): Promise<DatiUI> {
  const registro = await tutteLeFonti();
  const out: DatiUI['tappe'] = {};
  for (const t of C.tappe) {
    const x: { data: { foto?: { id: string }; orari?: { id: string } | null; durataFonte?: { id: string } }; schede: Map<string, Fatto>; testo: { nudo: string; fatti: Fatto[]; fonti: import('../fatti').Fonte[] } } | undefined = tappe.find(y => y.id === t.id) ?? locali.find(y => y.id === t.id);
    if (!x) continue;
    // la foto delle cartoline (3:2) e la miniatura quadrata (già nel pacco della città)
    let c: string | undefined;
    if (x.data.foto) {
      const f = await getEntry('foto', x.data.foto.id);
      if (f) c = (await getImage({ src: f.data.src, width: 480, height: 320, fit: 'cover', format: 'webp', quality: 55 })).src;
    }
    const fatti = [...x.schede.values(), ...x.testo.fatti];
    const durata = x.data.durataFonte?.id ? registro.get(x.data.durataFonte.id) : undefined;
    const fonti = fontiDi(fatti, [...x.testo.fonti, ...(durata ? [durata] : [])]);
    const editore = (ids: { data: { editore: string } }[]) => ids[0]?.data.editore ?? null;
    const daTesto = editore(x.testo.fonti) ?? editore(fatti.flatMap(f => f.fontiRisolte));
    const orari = x.data.orari?.id;
    const frasi = [
      ...frasiDi(x.testo.nudo).map(s => ({ t: s, da: daTesto })),
      ...[...x.schede.values()].filter(f => f.id !== orari).flatMap(f => frasiDi(f.data.testo).map(s => ({ t: s, da: editore(f.fontiRisolte) })))
    ];
    const controllato = controlloMenoRecente(fatti);
    out[t.id] = {
      ...(t.foto || c ? { foto: { ...(t.foto ? { m: t.foto } : {}), ...(c ? { c } : {}) } } : {}),
      frase: frasiDi(x.testo.nudo)[0],
      frasi,
      fonti: fonti.map(f => ({ titolo: f.data.titolo, editore: f.data.editore, url: f.data.url, tipo: f.data.tipo })),
      controllato: controllato ? controllato.toISOString().slice(0, 10) : null
    };
  }
  return {
    tappe: out,
    // il segno chiaro e quello ambra del tema scuro (come il logo scuro scelto da Enrico), il segnaposto della «o»
    marchio: { chiaro: interno(marchio('chiaro')), scuro: interno(marchio('foto')), spillo: SPILLO_O },
    // il nome della città vale solo nei nomi (specifica §3)
    citta: ['napoli', 'napoletano', 'napoletana', 'napoletani', 'napoletane']
  };
}
