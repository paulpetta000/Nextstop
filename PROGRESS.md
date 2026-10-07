# PROGRESS

_Ultimo aggiornamento: 08/10/2026 (agente «ricercatore»; ricerche su filtri dei locali e mappa; bozza della specifica del compositore)._

## Fase 1 in corso (ramo `grafica-home`, anche su GitHub dal 07/10/2026)
- Specifica `specifiche/home-e-identita.md` approvata il 06/10/2026, con le aggiunte di Enrico: il compositore si rifà tutto (restano dati e calcoli), i **racconti** degli itinerari pronti (stile MUDD, per Google), il menu con le tre linee.
- **Grafica scelta: A «Rivista»** (07/10/2026): https://claude.ai/artifact/37yToKfDMfL87fHKvGQDE3 (sorgente `design/home/a.html`; la B «La linea» è salvata accanto).
- **Marchio scelto: la soglia astratta** (07/10/2026), dopo sette giri tutti salvati in `design/logo/` (README con i link). La «o» del nome è un segnaposto; sopra le foto calde la versione ambra.
  Su Google l'icona resta ferma (Google mostra solo immagini fisse); l'animazione vive sul sito.
- **`DESIGN.md`** scritto: colori, caratteri, forme, componenti, movimento, marchio. Da decidere vedendo l'anteprima: accento del sito giallo tufo o pervinca del marchio.
- **Costruzione (07/10/2026), sul ramo `grafica-home`**: home nuova (`src/pages/index.astro`, testi in `src/testi/home.yaml` con i numeri dai dati: `riempi` in `src/lib/regole.mjs`), testata con menu a popover, piè di pagina blu notte, marchio animato (`Marchio.astro`, `src/lib/marchio.mjs`), icone e anteprime nuove, Bodoni Moda, `?pronto=` nel compositore, `?cucina=` in «Dove mangiare». Corretto un errore vecchio: su computer «Aggiungi» da «Dove mangiare» bloccava il compositore.
- **Secondo giro con Enrico (07/10/2026, «più profondità, più movimento, premium»)**: portico di piperno al posto delle foto ad arco (`Campata.astro`, `src/lib/portico.mjs`, pietra da `scripts/pietra.mjs`), con prospettiva che si muove scorrendo e nebbia color pietra intorno; rombo a tre piani con il Borgo Marinari (via il fruttivendolo) e il titolo sulla punta; «Quanto tempo hai?» come fascia con i numeri in Bodoni; la foto in alto scende più piano delle parole.
- Controlli del 07/10/2026: `npm test` 27/27, build ok, `check:links` puliti; **Lighthouse da telefono** (in locale, senza compressione): home 96, itinerari 94, dove mangiare 95, fonti 99; accessibilità, buone pratiche e SEO 100 ovunque; **axe** zero problemi in chiaro e scuro (home, menu, itinerari, dove mangiare); CLS 0; nessuno scorrimento di lato a 320 e 390 px. Strumenti in `C:UsersWindows11	oolscontrolli` (vedi `CLAUDE.md`).
- **Pubblicata su `main` il 07/10/2026** (OK di Enrico). Da decidere guardando il sito: accento giallo tufo o pervinca; pietra più chiara o più scura.

## Dove siamo
- **06/10/2026: il sito è nato** separando gli itinerari da Napoli a Vela (`specifiche/sito-itinerari-separazione.md`, approvata da Enrico).
  Dentro: il compositore `/napoli/itinerari/`, «Dove mangiare» `/napoli/dove-mangiare/`, 60 tappe (51 in città e 9 gite), 32 locali, 212 schede, 204 fonti, 54 foto, orari dei bus ANM (validi fino al 31/12/2026).
- Itinerari e «Dove mangiare» **funzionano come su Napoli a Vela** (stile «Orario»). Tolti dai testi i due link alla Coppa (collegamento a senso unico).
- **Provvisori**: la home, la pagina `/napoli/`, il logo (piastrella gialla con il segno di una fermata), i colori di intestazione e piè di pagina (ancora quelli di Napoli a Vela). Si rifanno con la grafica.
- Controlli del 06/10/2026 sul computer di Enrico: `npm test` 26/26, build ok (11 pagine), `check:links` 781 link senza errori, immagini da telefono in chiaro e scuro, nessuno scorrimento orizzontale a 390 px.
- **Online dal 06/10/2026** su https://nextstop-alpha.vercel.app (repository `paulpetta000/Nextstop`, privato). Le fasi dei lavori sono in `ROADMAP.md`.

## Cosa fa Enrico adesso
1. Verificare gli **orari dei 5 locali nuovi** (3 bracerie, 2 friggitorie: OK di Enrico, 08/10/2026) e mandarli a Claude: `da-verificare/orari-locali.md`.
2. Decidere l'email del sito (oggi è quella di Napoli a Vela, in `src/config/sito.ts`).
3. Google Search Console: proprietà nuova per `nextstop-alpha.vercel.app` e invio di `/sitemap.xml`.

## Prossimi passi (in ordine: vedi `ROADMAP.md`)
1. **Fase 2 · il compositore**: specifica **approvata l'08/10/2026** (`specifiche/compositore.md`; mappa **in sospeso**: Enrico vuole capire cosa cambia senza l'uso offline). Ricerche in `ricerca/2026-10-08-*.md`. Prossimo: **pezzo 1, pagina e barra del compositore, 4 proposte**, su un ramo nuovo da `main`. Opus, effort extra.
2. **Home**: foto del portico, «Come funziona», «Perché fidarti», testi, fonti a scomparsa, crediti delle foto in fondo (stessa lista).
3. **Fase 3 · racconti degli itinerari**: la ricerca sulla storia delle 15 tappe dei due giorni è fatta (07/10/2026, ramo `racconto-due-giorni`, `ricerca/storia-luoghi/`: 125 fatti da rileggere), poi le 4 pagine.
4. **Città nuove**, **SEO** con claude-seo, `da-risolvere.md` (28 righe aperte): vedi `ROADMAP.md`.

## Skill (06/10/2026)
| Skill | Dove | Per cosa |
|---|---|---|
| frontend-design, modern-web-guidance, design-sito, stile-testi | nel progetto (`.claude/skills/`) | grafica, codice delle pagine, testi |
| VectorLab UI/UX Skills, consistent-ui | sull'account di Enrico, **non copiate** nel progetto (scelta di Enrico, 06/10/2026); lette per intero il 06/10/2026: solo testo, nessun programma | controllo di coerenza e rifinitura |
| claude-seo | da installare come plugin quando serve (leggere prima tutto il codice) | SEO |

La guida di stile dei testi (`specifiche/stile-testi.md`) è nata per Napoli a Vela: per le città nuove va deciso chi è l'«amico del posto» del 25%.

## Note
- **Agente `ricercatore`** (08/10/2026, `.claude/agents/ricercatore.md`): Sonnet, effort medio, ricerche sul web con le fonti, salva tutto in `ricerca/`. Si vede dalle sessioni nuove.
- **Vercel Hobby è solo per uso non commerciale** (condizioni lette l'08/10/2026): con pubblicità o affiliazione servirebbe il piano Pro; le donazioni vanno bene.
- Gli **id non si rinominano** (tappe, locali, schede): stanno nei link condivisi e nei telefoni.
- Il blocco «Regate dal lungomare» resta per Napoli nei giorni di regata 2027 (`src/data/eventi.ts`, schede `cal-`): orari 2027 non ancora usciti.
- Orari e prezzi delle tappe da ricontrollare entro il 30/04/2027; feed ANM da riscaricare a gennaio 2027 (`aggiornamenti/`).
