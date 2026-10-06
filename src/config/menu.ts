// Le voci del menu. Per ora una sola città: Napoli.
// anche: altre sezioni che accendono la stessa voce
export const MENU: { href: string; label: string; sotto: string; anche?: string[] }[] = [
  { href: '/napoli/itinerari/', label: 'Itinerari a Napoli', sotto: 'Pronti o fatti da te, con tempi e mappa' },
  { href: '/napoli/dove-mangiare/', label: 'Dove mangiare', sotto: 'Pizzerie, trattorie, pesce, friggitorie, dolci' }
];
