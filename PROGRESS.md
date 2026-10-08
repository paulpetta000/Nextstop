# PROGRESS

_Ultimo aggiornamento: 08/10/2026 (compositore, pezzo 1 scelto: C e D; ramo `compositore-pagina`)._

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
3. Google Search Console (08/10/2026): proprietà verificata con il file `public/googlee54aa324270bde6d.html` (**non cancellarlo**); Vercel Analytics attivo. Da fare: inviare `sitemap.xml` e «Richiedi indicizzazione» della home, se la quota giornaliera lo permette (ritentare dal 09/10).

## Prossimi passi (in ordine: vedi `ROADMAP.md`)
1. **Fase 2 · il compositore**: specifica **approvata l'08/10/2026** (`specifiche/compositore.md`; mappa **in sospeso**: Enrico vuole capire cosa cambia senza l'uso offline). Ricerche in `ricerca/2026-10-08-*.md`.
   **Pezzo 1 (ramo `compositore-pagina`, `design/compositore/README.md`)**: giro 1 (A, B, C, D) https://claude.ai/artifact/RZjEC51fAQRN2hF3oGekdg; Enrico: B no, A sì, C e D da migliorare, due astratte in più, «Aggiungi» con tutte le tappe.
   Giro 2 (A, C, D, E, F) https://claude.ai/artifact/DM5hwnNeoTEfxcXQBR7KVp: E ed F no; via l'arco di pietra.
   Giro 3 (A, C, D, G) https://claude.ai/artifact/TakbK2ZMUwn2mZFYuQmo3w: mappa che si muove, percorso in fila, Elimina, 4 ricerche.
   Giro 4 (A, C, D, G) https://claude.ai/artifact/8Kx3ZmzRGZVk3RKmS3zVZ3: giorni da sfogliare col dito, scheda subito, 3 «Salva» e 3 loghi scuri.
   Giro 5 (A, C, D) https://claude.ai/artifact/UgWbAVT1hHeR7GCUQnVHxu: cambio di giorno senza tremolio (misurato con le pellicole), in C testata che scorre via e giorni fissi in alto, pause e margini con il tempo del giorno, chiusure solo con la data, tutte le tappe sulla mappa (piccole foto), Rinomina, salvataggio che resta; seconda versione con «Aggiungi» nella stessa schermata, orme di D nel verso giusto.
   **Pezzo 1 scelto (08/10/2026): C e D**, chi visita passa dall'una all'altra; ricerca di A; logo scuro ambra; «Salva»: ognuna il suo (C il segnaposto, D il timbro) se Enrico non dice altro. Aggiunte nella specifica §9 («per il resto va bene»). Tutto in `design/compositore/README.md`.
   **Prossimo: pezzo 2, la scheda della tappa con «visitato»** (4 proposte dentro C e D), sessione nuova, Opus, effort extra. Poi 3 ricerca, 4 salva e rileggi; la costruzione nel sito parte dopo le scelte.
   **Home da rivedere**: l'arco di pietra (portico di piperno) non piace a Enrico, nemmeno nella home (08/10/2026).
   Mappa: le strade piccole della zona dei due giorni pesano 213 KB (79 KB compressi): dato per la decisione della mappa (pezzo 5).
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
