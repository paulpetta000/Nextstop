// Il menu (le tre linee in alto) e i link del piè di pagina. Una voce per città: oggi solo Napoli.
// Gli itinerari pronti di ogni città vengono dai dati (src/data/itinerari-pronti.yaml), non da qui.
export type Citta = { id: string; nome: string; href: string; itinerari: string; mangiare: string };

export const CITTA: Citta[] = [
  { id: 'napoli', nome: 'Napoli', href: '/napoli/', itinerari: '/napoli/itinerari/', mangiare: '/napoli/dove-mangiare/' }
];

// Pagine sulla trasparenza: piè di pagina e menu
export const TRASPARENZA = [
  { href: '/fonti/', label: 'Fonti e controlli' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/termini/', label: "Termini d'uso" },
  { href: '/note-legali/', label: 'Note legali' },
  { href: '/accessibilita/', label: 'Accessibilità del sito' }
];

// Un itinerario pronto: apre il compositore con l'itinerario già caricato (?pronto=, src/scripts/itinerari/app.ts).
// Senza JavaScript il «#» porta alla sua scheda, con tutti gli orari, più in basso nella stessa pagina.
export const linkPronto = (c: Citta, id: string) => `${c.itinerari}?pronto=${id}#pronto-${id}`;
