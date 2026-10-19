// Solo laboratorio: dati inventati, nessuna API, rete, persistenza o SDK.
export const PIATTAFORME = Object.freeze({
  google: Object.freeze({ nome: 'Google Maps', scala: 5, unita: 'valutazioni' }),
  tripadvisor: Object.freeze({ nome: 'Tripadvisor', scala: 5, unita: 'recensioni' }),
  thefork: Object.freeze({ nome: 'TheFork', scala: 10, unita: 'recensioni' })
});

export function leggiDimostrazione(piattaforma, dato) {
  const fonte = PIATTAFORME[piattaforma];
  if (!fonte) throw new RangeError('Piattaforma sconosciuta');
  if (!dato || !Number.isSafeInteger(dato.conteggio) || dato.conteggio < 0) {
    return { stato: 'non_disponibile' };
  }
  if (dato.conteggio === 0) {
    return dato.media == null ? { stato: 'nessuna_valutazione' } : { stato: 'non_disponibile' };
  }
  if (!Number.isFinite(dato.media) || dato.media < 1 || dato.media > fonte.scala) {
    return { stato: 'non_disponibile' };
  }
  return { stato: 'disponibile', media: dato.media, conteggio: dato.conteggio };
}

export function testoDimostrazione(piattaforma, dato) {
  const fonte = PIATTAFORME[piattaforma];
  if (!fonte) throw new RangeError('Piattaforma sconosciuta');
  const numero = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const intero = new Intl.NumberFormat('it-IT', { useGrouping: 'always' });
  return `${numero.format(dato.media)} su ${fonte.scala} · ${intero.format(dato.conteggio)} ${fonte.unita}`;
}

// Contatore della simulazione, non un tetto di spesa garantito di un servizio reale.
export function creaLimite(massimo = 12) {
  if (!Number.isSafeInteger(massimo) || massimo < 0) throw new RangeError('Limite non valido');
  let usati = 0;
  return Object.freeze({
    prenota() { if (usati >= massimo) return false; usati += 1; return true; },
    get usati() { return usati; },
    get massimo() { return massimo; }
  });
}

export function creaSessione({ carica, aggiorna, limite = creaLimite(), online = () => true, attivo = () => true, attesaMs = 8000 }) {
  if (!Number.isFinite(attesaMs) || attesaMs <= 0) throw new RangeError('Attesa non valida');
  let scheda = null;
  let generazione = 0;
  const richieste = new Map();
  const risultati = new Map();

  function chiudi() {
    generazione += 1;
    for (const richiesta of richieste.values()) richiesta.controller.abort();
    richieste.clear();
    risultati.clear();
    scheda = null;
  }

  function apri(nuovaScheda) {
    chiudi();
    scheda = nuovaScheda;
  }

  function richiedi(piattaforma) {
    if (!PIATTAFORME[piattaforma]) throw new RangeError('Piattaforma sconosciuta');
    if (!scheda) return Promise.resolve({ stato: 'chiuso' });
    if (richieste.has(piattaforma)) return richieste.get(piattaforma).promessa;
    const emetti = valore => { aggiorna(piattaforma, valore); return Promise.resolve(valore); };
    if (!attivo(piattaforma)) return emetti({ stato: 'disattivato' });
    if (scheda.profili?.[piattaforma] !== 'verificato') return emetti({ stato: 'identita_incerta' });
    if (!online()) return emetti({ stato: 'offline' });
    // Riusa solo il risultato inventato del pannello ancora aperto.
    if (risultati.has(piattaforma)) return emetti(risultati.get(piattaforma));
    if (!limite.prenota()) return emetti({ stato: 'limite' });

    const controller = new AbortController();
    const richiesta = { controller, promessa: null };
    const versione = generazione;
    const corrente = scheda;
    const valida = () => generazione === versione && scheda === corrente;
    let timer;
    let annulla;
    const scadenza = new Promise((_, reject) => {
      timer = setTimeout(() => { reject(new Error('scadenza')); controller.abort(); }, attesaMs);
      annulla = () => reject(new Error('annullato'));
      controller.signal.addEventListener('abort', annulla, { once: true });
    });
    richieste.set(piattaforma, richiesta);
    aggiorna(piattaforma, { stato: 'caricamento' });
    richiesta.promessa = Promise.race([
      Promise.resolve().then(() => {
        if (controller.signal.aborted) throw new Error('annullato');
        return carica(piattaforma, corrente, { signal: controller.signal });
      }),
      scadenza
    ]).then(dato => {
      const risultato = leggiDimostrazione(piattaforma, dato);
      if (valida()) {
        risultati.set(piattaforma, risultato);
        aggiorna(piattaforma, risultato);
      }
      return risultato;
    }).catch(errore => {
      let stato = 'errore';
      if (errore?.message === 'scadenza') stato = 'scaduto';
      if (errore?.status === 401 || errore?.status === 403 || errore?.status === 404) stato = 'accesso_non_confermato';
      if (errore?.status === 429) stato = 'quota';
      if (valida()) aggiorna(piattaforma, { stato });
      return { stato: valida() ? stato : 'annullato' };
    }).finally(() => {
      clearTimeout(timer);
      controller.signal.removeEventListener('abort', annulla);
      if (richieste.get(piattaforma) === richiesta) richieste.delete(piattaforma);
    });
    return richiesta.promessa;
  }

  return Object.freeze({ apri, chiudi, richiedi });
}
