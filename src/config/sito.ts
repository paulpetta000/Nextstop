// Impostazioni generali del sito
export const SITO = {
  // Nome provvisorio (Enrico, 06/10/2026): quello definitivo dopo l'avvocato (marchi)
  nome: 'Nextstop',
  // Identificatore breve (nomi tecnici)
  sigla: 'nextstop',
  sottotitolo: 'Itinerari in città',
  // Da aggiornare quando c'è il progetto su Vercel (indirizzo vero)
  url: 'https://nextstop.vercel.app',
  lingua: 'it',
  // Data dell'ultimo controllo generale delle informazioni
  aggiornato: '2026-10-04',
  // Titolare del sito (pagine privacy, note legali, accessibilità)
  titolare: {
    nome: 'Enrico Licenziati',
    // Da decidere con Enrico: per ora la stessa casella di Napoli a Vela
    email: 'napoliavela.guida@gmail.com'
  },
  // Data dell'ultima modifica di privacy e termini
  versionePrivacy: '2026-10-06',
  versioneTermini: '2026-10-06'
} as const;
