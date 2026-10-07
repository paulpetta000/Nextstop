# Fase 1 · Identità, home «wow» e racconti degli itinerari

_Specifica del 06/10/2026. **Approvata da Enrico il 06/10/2026**, con tre aggiunte sue: il compositore si può rifare tutto (restano dati e calcoli),
le pagine «racconto» degli itinerari pronti, il menu con le tre linee. Ramo di lavoro: `grafica-home`._

## Il problema di chi visita
- Chi arriva sulla home oggi vede un titolo, una foto piccola e due pulsanti: non capisce subito **perché questo sito è meglio** di una lista «cosa vedere a Napoli».
- Chi ha già in mente quanto tempo ha («ho 2 giorni») deve aprire il compositore e cercare l'itinerario pronto più in basso.
- Chi cerca su Google «itinerario 2 giorni Napoli» non ci trova: il compositore tiene l'itinerario dopo il «#», e Google non lo legge.
- Il compositore sembra un'app, non un sito di viaggio; logo e colori sono ancora quelli di Napoli a Vela: non dà fiducia.
- Migliorare la home di oggi non basta: mancano un'identità (logo, colori, caratteri), un modo veloce per entrare e pagine che Google possa leggere.

## Chi arriva
1. **Chi organizza un viaggio** a Napoli, dal telefono, spesso da Google («Napoli in 2 giorni»).
2. **Chi ci vive** e cerca un giro per la domenica, o un posto dove mangiare.
3. **Chi riceve un link** (un itinerario condiviso, Napoli a Vela).

## I primi 5 secondi della home (dal telefono, senza scorrere)
- **Cosa è**: itinerari in città, pronti o fatti da te, con i **tempi veri** a piedi e con metro, funicolari e bus.
- **Dove**: Napoli (la prima città).
- **Cosa tocco**: «Quanto tempo hai?» con 5 scelte: ½ giornata · 1 giorno · 2 giorni · 3 giorni · Fai da te.
- Una foto grande e bella, nostra, con licenza libera.

## La home, dall'alto
1. **Intestazione**: logo e menu (vedi sotto).
2. **Apertura**: foto grande, la promessa in una riga, «Quanto tempo hai?».
3. **Come funziona**, in 3 passi brevi: scegli le tappe → tempi veri tra una e l'altra → avvisi (chiuso quel giorno, dove mangiare lungo la strada). Disegno: un percorso che si traccia.
4. **Itinerari pronti**: schede con foto, nome, durata, numero di tappe, minuti a piedi (calcolati dalla build, mai scritti a mano). Portano al racconto.
5. **Dove mangiare**: le famiglie di locali, con quanti ce ne sono.
6. **Perché fidarti**: numeri veri presi dai dati (tappe, locali, fonti, data dell'ultimo controllo); niente recensioni o voti inventati.
7. **Le prossime città**: una riga, «Napoli è la prima, le altre arrivano dopo». Nessun nome e nessuna data finché non è deciso.
8. **Piè di pagina**: fonti, privacy, note legali, accessibilità.

## Il menu (le tre linee in alto)
- Su tutte le pagine. Dentro: Home · **Napoli**: gli itinerari pronti (½ giornata, 1, 2, 3 giorni), «Componi il tuo», «Dove mangiare».
- Si apre con un'animazione breve; si chiude con «Esc», con la ×, o toccando fuori. La voce della pagina in cui sei è segnata.
- Sopra il titolo di ogni pagina, il percorso («Napoli › Itinerari › 2 giorni»).

## Racconti degli itinerari (funzione nuova, idea di Enrico)
- **Problema**: chi cerca «itinerario 2 giorni Napoli» su Google oggi non trova il sito, e chi arriva non ha una pagina da leggere con calma.
  Non basta migliorare il compositore: è uno strumento, non un racconto, e Google non legge quello che c'è dopo il «#».
- **Cosa sono**: una pagina per ogni itinerario pronto (si parte con 2 o 3), scritta come una rivista di viaggio (stile MUDD):
  la giornata tappa per tappa, la storia dei luoghi, le foto, i tempi tra una tappa e l'altra, dove mangiare lungo la strada.
- **All'inizio e alla fine**: «Apri questo itinerario e cambialo come vuoi» (apre il compositore con l'itinerario caricato) e «Componi il tuo».
- Indirizzo leggibile: per esempio `/napoli/itinerari/due-giorni/`. Titolo e descrizione per Google; tutto il testo nella pagina, non dopo il «#».
- **Ogni fatto ha la sua fonte**, come nel resto del sito: la storia dei luoghi è una ricerca nuova (agenti Sonnet per gruppi di luoghi, rilettura mia),
  e i testi seguono `stile-testi`. I tempi e gli orari vengono dai dati, ricalcolati dalla build.
- Nelle proposte si disegna con «Due giorni a Napoli» e i testi che abbiamo già; la storia approfondita arriva con la ricerca.

## Il compositore: si rifà l'aspetto
- **Si può cambiare tutto il design** (Enrico, 06/10/2026). Restano i dati e i calcoli: tappe, tempi, spostamenti, avvisi, salvataggio, link condivisi.
- Deve sembrare una pagina di un sito di viaggio, non un'app.
- La ricerca che c'è già («Cerca una tappa») si rifà con il resto: più visibile, si apre con un'animazione, i risultati entrano uno dopo l'altro.

## Movimento (motion design)
- Solo dove aiuta a capire o risponde a un tocco:
  1. il **menu** che si apre;
  2. le scelte «Quanto tempo hai?» che rispondono al tocco;
  3. il **percorso che si disegna** mentre scorri (home e racconti);
  4. il **passaggio tra pagine**: la foto della scheda diventa la foto del racconto;
  5. la **ricerca** del compositore che si apre e le tappe che entrano nella giornata quando le aggiungi.
- Ricette **cercate su internet** (con la fonte scritta nella proposta), lette per intero prima di usarle; rifatte solo con CSS e le funzioni del browser, **senza pacchetti nuovi**.
- Si muovono solo posizione e trasparenza, tra 150 e 400 millesimi di secondo. Con «riduci movimento» tutto è fermo, o al massimo sfuma.
- L'animazione non deve ritardare la prima foto né spostare la pagina (Lighthouse 95 o più).

## Le due proposte grafiche
- **A · «Rivista di viaggio»**: fondo crema caldo, titoli con le grazie, foto grandi ritagliate a forma (come MUDD), schede «da sapere» un po' ruotate.
- **B · «La linea»**: l'itinerario come una linea della metro che attraversa la pagina, titoli compatti e grandi, colori decisi (mare e notte), pallini delle fermate.
- Ognuna con **tre pagine**: home, racconto «Due giorni a Napoli», compositore. Dati veri e foto nostre, in chiaro e in scuro, telefono (320 e 390 px) e computer.
- Da guardare sul telefono: pagine private su claude.ai, con le animazioni vere, più le immagini.
- Si possono mescolare: per esempio i colori di A con la linea di B.

## Figma (al massimo circa 20 usi al mese)
- Solo per la proposta scelta: il file da tenere (le tre pagine, chiaro e scuro, i colori e i caratteri).
- Il **logo animato**: il segno che si disegna, su una linea del tempo di Figma; un video corto da guardare sul telefono e, da lì, l'animazione per il sito.
- Le animazioni delle pagine si provano direttamente nelle proposte HTML: sul telefono si vedono dal vivo, meglio che in un video.
- Niente immagini fatte con l'intelligenza artificiale: le foto restano solo nostre, con licenza libera.

## Identità: il logo
- **3 o 4 direzioni**, dopo la scelta della grafica, così il logo le somiglia.
- Il nome è **provvisorio** (decide l'avvocato): il **segno** deve funzionare anche senza il nome, e il nome si cambia in un posto solo (`src/config/sito.ts`).
- SVG, chiaro e scuro, a un colore, leggibile a 16 px (icona della scheda del browser) e a 180 px (icona sul telefono).
- Niente che somigli ai segni di aziende di trasporto, di luoghi o di eventi.

## Regole (oltre a quelle di `CLAUDE.md`)
- Caratteri solo liberi (licenza OFL). Nelle proposte si possono caricare da Google Fonts per prova; sul sito si scaricano in `public/fonts/` (ti chiedo l'OK prima di scaricarli).
- I testi seguono `stile-testi`; nessun numero scritto a mano: vengono dai dati.
- Nessun «ufficiale», nessun logo di altri, nessun link alla Coppa.

## Casi limite
- **Una città sola oggi, tante domani**: home e menu funzionano con 1 città e con 6.
- **Giorni di regata 2027**: il blocco «Regate dal lungomare» può comparire solo in quei giorni, senza link alla Coppa.
- **Link condivisi** (`…/napoli/itinerari/#…`): continuano ad aprire l'itinerario.
- **Connessione lenta o senza JavaScript**: le scelte «Quanto tempo hai?» e il menu sono link normali; home e racconti si leggono tutti.
- **Un racconto e il suo itinerario non devono separarsi**: se cambia l'itinerario pronto, la build ricalcola i tempi del racconto e si ferma se una tappa del testo non c'è più.
- **Tema scuro**: le foto non devono accecare (un velo scuro leggero); i colori del logo hanno la versione scura.
- **Testi lunghi** a 320 px: nessuno scorrimento orizzontale.

## In che ordine si costruisce
1. **Fase 1 (adesso)**: home, logo, menu, intestazione e piè di pagina (sono di tutte le pagine), colori e caratteri, `DESIGN.md`, `?pronto=` nel compositore.
2. **Subito dopo**: la ricerca con le fonti per il primo racconto («Due giorni a Napoli»), poi la pagina.
3. **Fase 2**: il compositore rifatto e la grafica su tutte le altre pagine; gli altri racconti.

## Controlli prima dell'anteprima
`npm test` verde, build senza errori, `check:links` pulito, axe in chiaro e scuro, Lighthouse su telefono 95 o più,
nessuno scorrimento orizzontale a 320 e 390 px, «riduci movimento», nessun errore in console, consistent-ui e ux-audit di VectorLab.

## Compiti
- [x] Enrico approva questa specifica (06/10/2026, con le sue aggiunte).
- [ ] Ricerca delle ricette di movimento, con le fonti.
- [ ] Proposte A e B (home, racconto, compositore), chiaro e scuro, telefono e computer.
- [x] Enrico sceglie: **A «Rivista»** (07/10/2026), da completare mentre si costruisce.
- [x] Logo: sette giri; Enrico sceglie la **soglia astratta** (07/10/2026). Tutto in `design/logo/` (README).
- [x] `DESIGN.md` con il look scelto (07/10/2026).
- [ ] Figma: la proposta scelta, dopo la costruzione (il file rispecchia il sito vero). L'animazione del marchio vive nel codice.
- [ ] Costruzione: home, logo, menu, intestazione, piè di pagina, `?pronto=`.
- [ ] Controlli, anteprima di Vercel sul ramo `grafica-home`, OK di Enrico, poi `main`.
