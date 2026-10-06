# PROGRESS

_Ultimo aggiornamento: 07/10/2026 (Fase 1: due proposte grafiche)._

## Fase 1 in corso (ramo `grafica-home`)
- Specifica `specifiche/home-e-identita.md` **approvata da Enrico il 06/10/2026**, con le sue aggiunte: il compositore si rifà tutto (restano dati e calcoli), le pagine «racconto» degli itinerari pronti (stile MUDD, per Google), il menu con le tre linee.
- **Due proposte** con dati e foto veri, home + racconto «Due giorni» + compositore, chiaro e scuro: A «Rivista» https://claude.ai/artifact/37yToKfDMfL87fHKvGQDE3 · B «La linea» https://claude.ai/artifact/6DswrzVy5fXuW3rA5iZDDq.
  Sorgenti in `design/home/` (`a.html`, `b.html`; `node design/home/dati.mjs` dopo la build, poi `node design/home/genera.mjs`), immagini di confronto in `design/home/immagini/`.
- **07/10/2026: Enrico sceglie la A «Rivista»** (stile MUDD), da completare mentre si costruisce. Loghi: 4 direzioni (arco, prossima tappa, mappa in tasca, lancetta) su https://claude.ai/artifact/Gg8XpkSJ7ZjsjjMSwDjPSj, sorgente `design/logo/`. Enrico: nessuno gli piace, il più interessante è l'arco; animazioni troppo scattose. Secondo giro (07/10/2026): quattro archi pieni e colorati, provati nei risultati di ricerca: https://claude.ai/artifact/AcbQFDMsYotY1GBRjAZCVE (`design/logo/loghi-2.html`). Enrico preferisce gli ultimi due (portici, soglia): terzo giro rifinito, https://claude.ai/artifact/YEBpvDUCeAT5Z2cDokuN5G (`design/logo/loghi-3.html`, poi `node design/logo/genera.mjs loghi-3.html loghi-3-pagina.html`). Enrico: il tufo «non è un granché», vuole un marchio «da decine di migliaia di euro». Quarto giro: archi a curvatura continua, tre colori (blu maiolica, rosso pompeiano, verde rame), nome più leggero, animazione di circa 2 secondi: https://claude.ai/artifact/8335qp4CHA5WFtHNPWnheu (`design/logo/loghi-4.html`). Enrico: meglio, ma il colore unico non convince, soprattutto su Google; vuole più colori e una costruzione più ricca. Quinto giro: la veduta (Napoli nella finestra, stile manifesto di viaggio) e i conci (arco a pietre colorate con la chiave di volta): https://claude.ai/artifact/EBAMDnbUkPycixVRc6Zv1j (`design/logo/loghi-5.html`). Prossimo: logo in 3 o 4 direzioni da scegliere → Figma (proposta scelta e logo animato) → `DESIGN.md` → costruzione della home.

## Dove siamo
- **06/10/2026: il sito è nato** separando gli itinerari da Napoli a Vela (`specifiche/sito-itinerari-separazione.md`, approvata da Enrico).
  Dentro: il compositore `/napoli/itinerari/`, «Dove mangiare» `/napoli/dove-mangiare/`, 60 tappe (51 in città e 9 gite), 32 locali, 212 schede, 204 fonti, 54 foto, orari dei bus ANM (validi fino al 31/12/2026).
- Itinerari e «Dove mangiare» **funzionano come su Napoli a Vela** (stile «Orario»). Tolti dai testi i due link alla Coppa (collegamento a senso unico).
- **Provvisori**: la home, la pagina `/napoli/`, il logo (piastrella gialla con il segno di una fermata), i colori di intestazione e piè di pagina (ancora quelli di Napoli a Vela). Si rifanno con la grafica.
- Controlli del 06/10/2026 sul computer di Enrico: `npm test` 26/26, build ok (11 pagine), `check:links` 781 link senza errori, immagini da telefono in chiaro e scuro, nessuno scorrimento orizzontale a 390 px.
- **Online dal 06/10/2026** su https://nextstop-alpha.vercel.app (repository `paulpetta000/Nextstop`, privato). Le fasi dei lavori sono in `ROADMAP.md`.

## Cosa fa Enrico adesso
1. Su Vercel: il ramo del sito pubblico deve essere `main` (Settings › Environments › Production).
2. Decidere l'email del sito (oggi è quella di Napoli a Vela, in `src/config/sito.ts`).
3. Google Search Console: proprietà nuova per `nextstop-alpha.vercel.app` e invio di `/sitemap.xml`.

## Prossimi passi (in ordine: vedi `ROADMAP.md`)
1. **Grafica e home «wow»**: vedi «Fase 1 in corso» qui sopra. Modello Opus, effort extra.
2. **Curare meglio gli itinerari di Napoli**: più itinerari pronti, con nomi, e le correzioni del trascinamento (`da-risolvere.md`).
3. **Città nuove**: una specifica per città (tappe con fonti, tempi da OpenStreetMap, mezzi pubblici). Consiglio: Napoli perfetta più 1 o 2 città, poi si allarga.
4. **SEO** con claude-seo (deciso per Napoli a Vela il 06/10/2026), quando la struttura è finita; pagine fisse per gli itinerari pronti (il compositore ha il contenuto dopo il «#», Google non lo vede).
5. `da-risolvere.md`: 28 righe aperte (orari dei locali, premi da verificare, luoghi): una sessione di gruppo.

## Skill (06/10/2026)
| Skill | Dove | Per cosa |
|---|---|---|
| frontend-design, modern-web-guidance, design-sito, stile-testi | nel progetto (`.claude/skills/`) | grafica, codice delle pagine, testi |
| VectorLab UI/UX Skills, consistent-ui | sull'account di Enrico, **non copiate** nel progetto (scelta di Enrico, 06/10/2026); lette per intero il 06/10/2026: solo testo, nessun programma | controllo di coerenza e rifinitura |
| claude-seo | da installare come plugin quando serve (leggere prima tutto il codice) | SEO |

La guida di stile dei testi (`specifiche/stile-testi.md`) è nata per Napoli a Vela: per le città nuove va deciso chi è l'«amico del posto» del 25%.

## Note
- Gli **id non si rinominano** (tappe, locali, schede): stanno nei link condivisi e nei telefoni.
- Il blocco «Regate dal lungomare» resta per Napoli nei giorni di regata 2027 (`src/data/eventi.ts`, schede `cal-`): orari 2027 non ancora usciti.
- Orari e prezzi delle tappe da ricontrollare entro il 30/04/2027; feed ANM da riscaricare a gennaio 2027 (`aggiornamenti/`).
