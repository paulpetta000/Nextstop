// Elenco delle pagine per la mappa del sito (sitemap.xml) e le immagini di anteprima
export type Pagina = { path: string; titolo: string; kicker: string };

export const PAGINE: Pagina[] = [
  { path: '/', titolo: 'Itinerari in città', kicker: 'Nextstop' },
  { path: '/napoli/', titolo: 'Napoli', kicker: 'Napoli' },
  { path: '/napoli/itinerari/', titolo: 'Itinerari a Napoli', kicker: 'Napoli' },
  { path: '/napoli/dove-mangiare/', titolo: 'Dove mangiare a Napoli', kicker: 'Napoli' },
  { path: '/fonti/', titolo: 'Fonti e controlli', kicker: 'Trasparenza' },
  { path: '/privacy/', titolo: 'Privacy', kicker: 'Trasparenza' },
  { path: '/termini/', titolo: "Termini d'uso", kicker: 'Trasparenza' },
  { path: '/note-legali/', titolo: 'Note legali', kicker: 'Trasparenza' },
  { path: '/accessibilita/', titolo: 'Accessibilità del sito', kicker: 'Trasparenza' }
];

export const slugOg = (path: string) => (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '--'));
