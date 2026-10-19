import { PIATTAFORME, creaLimite, creaSessione, testoDimostrazione } from './modello.mjs';

const ESEMPI = Object.freeze({
  locale: { nome:'Trattoria del Vicolo', testo:'Un ristorante inventato, usato soltanto per provare tre piattaforme.', profili:{ google:'verificato', tripadvisor:'verificato', thefork:'verificato' } },
  museo: { nome:'Museo delle Arcate', testo:'Un luogo inventato: due fonti di valutazioni, senza TheFork.', profili:{ google:'verificato', tripadvisor:'verificato' } },
  composto: { nome:'Museo e giardino', testo:'Queste valutazioni si riferiscono soltanto al museo, non al giardino né all’intero percorso.', profili:{ google:'verificato', tripadvisor:'verificato' } },
  incerto: { nome:'Passeggiata dei Portici', testo:'Percorso inventato senza un profilo verificato per l’intera passeggiata.', profili:{ google:'incerto', tripadvisor:'incerto' } }
});
const VALORI = Object.freeze({ google:{media:4.6,conteggio:1234}, tripadvisor:{media:4.5,conteggio:876}, thefork:{media:9.1,conteggio:210} });
const MESSAGGI = Object.freeze({
  caricamento:'Caricamento della dimostrazione…', nessuna_valutazione:'Nessuna valutazione disponibile per questo esempio.',
  non_disponibile:'Media o conteggio non disponibili.', errore:'Servizio momentaneamente non disponibile.',
  offline:'Sei senza rete. Puoi consultare il collegamento quando torni online.',
  identita_incerta:'Profilo non verificato: nessun voto viene mostrato.',
  accesso_non_confermato:'Accesso ai dati non confermato. Il collegamento resta disponibile.',
  quota:'Limite del servizio raggiunto. Il collegamento resta disponibile.',
  limite:'Richieste della prova esaurite. Il collegamento resta disponibile.',
  disattivato:'Valutazioni di questa piattaforma temporaneamente sospese.',
  scaduto:'Il servizio sta impiegando troppo tempo. Puoi riprovare.'
});
const pannello = document.querySelector('#scheda');
const righe = document.querySelector('#righe');
const scenario = document.querySelector('#scenario');
const limite = creaLimite(12);
let caso = 'normale';
let origine = null;
const vista = new Map();
const contatore = () => { document.querySelector('#contatore').textContent = `Richieste simulate: ${limite.usati} di ${limite.massimo}`; };

const sessione = creaSessione({
  limite, attesaMs:1800,
  online:() => caso !== 'offline' && navigator.onLine,
  attivo:piattaforma => !(caso === 'disattivato' && piattaforma === 'tripadvisor'),
  async carica(piattaforma, scheda, { signal }) {
    contatore();
    await new Promise((resolve,reject) => {
      const annulla = () => { clearTimeout(timer); reject(new Error('annullato')); };
      const timer = setTimeout(() => { signal.removeEventListener('abort',annulla); resolve(); }, caso === 'timeout' ? 4000 : caso === 'lento' ? 1200 : 400);
      if (signal.aborted) annulla(); else signal.addEventListener('abort',annulla,{once:true});
    });
    if (piattaforma === 'tripadvisor') {
      if (caso === 'errore') throw new Error('simulazione');
      if (caso === 'quota' || caso === 'vietato') throw Object.assign(new Error('simulazione'),{status:caso === 'quota' ? 429 : 404});
    }
    if (caso === 'vuoto') return { conteggio:0 };
    if (caso === 'mancante') return { media:4.5 };
    return VALORI[piattaforma];
  },
  aggiorna(piattaforma, risultato) {
    const riga = vista.get(piattaforma);
    if (!riga) return;
    riga.dataset.stato = risultato.stato;
    riga.setAttribute('aria-busy',String(risultato.stato === 'caricamento'));
    const testo = riga.querySelector('.risultato');
    testo.replaceChildren();
    if (risultato.stato === 'disponibile') {
      const link = document.createElement('a');
      link.href = '#nota-dimostrazione';
      link.className = 'voto';
      link.setAttribute('aria-label',`${PIATTAFORME[piattaforma].nome}: ${testoDimostrazione(piattaforma,risultato)}. Collegamento dimostrativo.`);
      const media = document.createElement('strong');
      media.textContent = `${new Intl.NumberFormat('it-IT',{maximumFractionDigits:1,minimumFractionDigits:1}).format(risultato.media)}/${PIATTAFORME[piattaforma].scala}`;
      const conteggio = document.createElement('span');
      conteggio.className = 'conteggio';
      conteggio.textContent = `(${new Intl.NumberFormat('it-IT',{useGrouping:'always'}).format(risultato.conteggio)})`;
      const fonte = document.createElement('span');
      fonte.className = 'fonte';fonte.textContent = PIATTAFORME[piattaforma].nome;
      link.append(media,conteggio,fonte);testo.append(link);
    } else testo.textContent = MESSAGGI[risultato.stato];
    const bottone = riga.querySelector('button');
    // aria-disabled mantiene il focus mentre il messaggio cambia; il gestore
    // impedisce nuove azioni. Disabilitare nativamente qui lo spostava sul body.
    bottone.setAttribute('aria-disabled',String(!['errore','scaduto'].includes(risultato.stato)));
    bottone.textContent = risultato.stato === 'caricamento' ? 'Caricamento…' : risultato.stato === 'disponibile' ? 'Mostrata' : ['errore','scaduto'].includes(risultato.stato) ? 'Riprova' : 'Non disponibile';
    bottone.setAttribute('aria-label',`${bottone.textContent}: valutazione dimostrativa di ${PIATTAFORME[piattaforma].nome}`);
    if (risultato.stato === 'disponibile') {
      if (document.activeElement === bottone) testo.querySelector('a').focus({preventScroll:true});
      riga.querySelector('.riga__azioni').hidden = true;
    }
    contatore();
  }
});

document.querySelectorAll('[data-apri]').forEach(bottone => bottone.addEventListener('click',() => {
  const esempio = ESEMPI[bottone.dataset.apri];
  caso = scenario.value;
  sessione.apri(esempio);
  origine = bottone;
  vista.clear();
  righe.replaceChildren();
  document.querySelector('#titolo-scheda').textContent = esempio.nome;
  document.querySelector('#descrizione-scheda').textContent = esempio.testo;
  for (const piattaforma of Object.keys(esempio.profili)) {
    const riga = document.querySelector('#riga').content.firstElementChild.cloneNode(true);
    riga.dataset.piattaforma = piattaforma;
    riga.querySelector('h4').textContent = PIATTAFORME[piattaforma].nome;
    riga.querySelector('button').textContent = `Mostra ${PIATTAFORME[piattaforma].nome}`;
    riga.querySelector('button').setAttribute('aria-label',`Mostra la valutazione dimostrativa di ${PIATTAFORME[piattaforma].nome}`);
    riga.querySelector('a').textContent = `Apri su ${PIATTAFORME[piattaforma].nome} · esempio`;
    riga.querySelector('button').addEventListener('click',event => {
      if (event.currentTarget.getAttribute('aria-disabled') === 'true') return;
      sessione.richiedi(piattaforma);
    });
    vista.set(piattaforma,riga);
    righe.append(riga);
  }
  pannello.hidden = false;
  document.querySelector('#titolo-scheda').focus();
}));

document.querySelector('#chiudi').addEventListener('click',() => {
  sessione.chiudi();
  vista.clear();
  righe.replaceChildren();
  pannello.hidden = true;
  origine?.focus({preventScroll:true});
});
document.querySelector('#aspetto').addEventListener('change',event => {
  const tema = event.target.value;
  if (tema === 'sistema') delete document.documentElement.dataset.tema;
  else document.documentElement.dataset.tema = tema;
});
window.addEventListener('pagehide',() => sessione.chiudi());
