# Documentazione · scegliere cosa leggere

Stato corrente: [Sansevero 79](../aggiornamenti/rapporti/2026-10-23-sansevero-79.md), correzione prenotazione e confronto periodico concluso; build locale bloccata da errore sintattico del file Vite installato, senza diagnosi della causa o riparazione. Riscontro remoto da completare.

Seguito documentale corrente: [Capri, Caremar e L6 78](../aggiornamenti/rapporti/2026-10-23-collegamenti-capri-78.md), programmi distinti dal servizio effettivo, applicazione invariata.

Seguito documentale: [mercati 77](../aggiornamenti/rapporti/2026-10-23-mercati-77.md), proposta storica distinta dal nuovo calendario; nessuna modifica applicativa.

Seguito corrente: [San Lorenzo 76](../aggiornamenti/rapporti/2026-10-23-san-lorenzo-76.md), correzione mirata della guida obbligatoria; 209 fonti, 792 prove. Controllo completo ancora aperto; avvisi e locali nel rapporto 75.

Seguito corrente: [fonti, locali e avvisi 75](../aggiornamenti/rapporti/2026-10-23-fonti-ripresa-75.md), 16 gruppi aperti e dieci con fonte/orario ordinario recuperati. Dati applicativi invariati; avvisi temporanei registrati con i loro limiti.

Per iniziare: istruzioni del proprio assistente (`AGENTS.md` o `CLAUDE.md`), [regole comuni](REGOLE.md) e la prima sezione dello [stato corrente](../PROGRESS.md), approfondendo i blocchi precedenti solo se pertinenti. Poi scegli solo la riga del compito, senza aprire tutti i rimandi.

Stato corrente: [revisione 73, correzione Acton e verifiche](storico/2026-10-23-revisione-73.md), codice 5fce2d7, 792 test e dati rigenerati su Ubuntu: collegamenti con Acton 31 → 0. Seguito ordinario con Sol medio dopo la consegna tecnica; restano 17 gruppi aperti e nove recuperati, backup Git non affidabile lasciato da parte.

Riscontro precedente: [fonti e riproduzione Acton, revisione 72](../aggiornamenti/rapporti/2026-10-23-fonti-ripresa-72.md); descrive il problema prima della correzione.

Seguito corrente: [fonti, revisione 74](../aggiornamenti/rapporti/2026-10-23-fonti-ripresa-74.md), confronto Capri e limiti ufficiali; 17 gruppi ancora aperti, nessun controllo completo rinnovato. Sol medio per proseguire.

Seguito precedente: [fonti, revisione 71](../aggiornamenti/rapporti/2026-10-22-fonti-ripresa-71.md), 17 gruppi aperti e nove con fonte/orario ordinario recuperati. Solo rapporto e registro; codice e limiti tecnici restano quelli sotto.

Stato corrente: [revisione 70, L6 e dati coordinati](storico/2026-10-22-revisione-70.md), codice a9c4403, 784 test, CI Ubuntu e preview riuscite. **La copia Git indipendente fallisce il controllo finale**, dopo un primo successo: leggere il [rapporto integrità](storico/2026-10-22-integrita-70.md) e usare anche gli archivi separati. Seguito ordinario con Sol medio, limiti e stime nel rapporto.

Stato precedente: [revisione 69, fuoco e nuove fonti](storico/2026-10-22-revisione-69.md), codice fe45e9d, 780 test e CI Ubuntu riuscita; dati/fonti ancora parziali e stime nel rapporto.

Stato precedente: [revisione 68, verifiche e limiti](storico/2026-10-22-revisione-68.md), codice 51c5dfb, 777 test, tipi rigorosi e CI Ubuntu riusciti; ramo e anteprima pubblicati con consenso, main invariato. Worker provato offline e in aggiornamento su origine isolata; Lighthouse 97 home/compositore e axe esteso.

## Fonti per argomento

| Compito | Dove entrare | Approfondimento solo se necessario |
|---|---|---|
| Avvio, comandi e struttura | [README del progetto](../README.md#comandi), `package.json` | [Ambiente locale](AMBIENTE-LOCALE.md) per questo computer |
| Test e CI | [README · Test](../README.md#test), [GitHub Actions](../README.md#github-actions--controlli-delle-pull-request), `test/`, `.github/workflows/ci.yml` | Solo i test del modulo; procedura e limiti in [Manutenzione](MANUTENZIONE.md#github-e-commit-verificati) |
| Compositore: stato e interazioni | `src/scripts/itinerari/compositore/avvio.js`, `stato.js`, `viste.js`; `src/scripts/itinerari/memoria.ts` | `src/pages/napoli/itinerari/index.astro`, [specifica](../specifiche/compositore.md) nella parte pertinente |
| Calcoli, spostamenti e link | `src/lib/itinerari/calcolo.ts`, `spostamenti.ts`, `link.ts`, `date.ts`, `tipi.ts` | Test corrispondenti in `test/`; `napoli.ts` fornisce i dati della città |
| Mappa e percorsi | `src/scripts/itinerari/compositore/mappa.js`, `src/lib/itinerari/strade.ts`, `scripts/mappa/` | [README · Itinerari](../README.md#itinerari); JSON solo per il caso riprodotto |
| Bus e rinnovo dati | [Aggiornamenti](../aggiornamenti/README.md), `scripts/itinerari/` | [Specifica bus](../specifiche/bus-orari-veri.md); `src/lib/itinerari/firma-posizioni.mjs` condivisa con la build; dati/fonti del caso |
| Controllo periodico di orari, accessi e nuove pubblicazioni | [Procedura breve](../aggiornamenti/PROCEDURA.md), `node aggiornamenti/leggi.mjs cerca "nome"` | Singola scheda e soli canali/casi pertinenti; [rapporti](../aggiornamenti/rapporti/README.md) solo per evidenze storiche. Cercare nuove pagine oltre ai vecchi URL |
| Dati, fonti, testi e firme | [README · Informazioni](../README.md#dove-sono-le-informazioni), `src/lib/regole.mjs`, `test/dati.test.mjs`, `test/testi.test.mjs` | [Guida dei testi](../specifiche/stile-testi.md), solo schede e YAML coinvolti |
| Ricerca fotografie e condizioni di riuso | [Entrata breve](../ricerca/fotografie/README.md), [indice per luogo/locale](../ricerca/fotografie/indice.md) | Solo la scheda pertinente e la [cartella delle foto](../ricerca/fotografie/foto/README.md); [diritti](../ricerca/fotografie/LICENZE.md). La vecchia coda di richieste è sospesa: nessun contatto. Non leggere tutto il catalogo né caricare tutte le immagini nella conversazione |
| Build e uso offline | `astro.config.mjs`, `integrations/`, `scripts/check-links.mjs` | `src/scripts/sito.ts`, `public/manifest.webmanifest`; preservare il service worker |
| Interfaccia e bozzetti, come attività approvata | [DESIGN](../DESIGN.md), [indice specifiche](../specifiche/README.md) | Solo il README del pezzo di `design/` e la skill pertinente |
| Dipendenze, tipi e regole GitHub | [Manutenzione](MANUTENZIONE.md) | Piano di aggiornamento; nessuna installazione implicita |
| Valutazioni Google/Tripadvisor/TheFork · solo proposta | [Piano di fattibilità](../specifiche/valutazioni-esterne.md) | [Ricerca ufficiale](../ricerca/2026-10-19-valutazioni-esterne.md); nessuna implementazione autorizzata |
| Lavori futuri | [ROADMAP](../ROADMAP.md) | Non è una lista di attività autorizzate per la sessione |
| Decisioni precedenti | [Istruzioni precedenti](storico/2026-10-09-CLAUDE.md), [stato precedente](storico/2026-10-09-PROGRESS.md) | Snapshot integrali prima del Blocco 2, non istruzioni correnti |

Il README contiene già la mappa del codice e dei dati: non duplicarla in una nuova guida di architettura. Trovati modulo e specifica, fermati con le letture generali.

## Rami e proposte grafiche

- Il compositore con viste C «Mappa prima» e D «Le pagine», mappa a pezzi e menu dei pasti è già nella base main analizzata (`75d25e6`, 16/10/2026). Home O4, calendario e selettore dell'ora risultano pubblicati nello stato conservato. Le vecchie note «da costruire» descrivono il passato.
- Le proposte e le decisioni restano in [design/compositore/README.md](../design/compositore/README.md) e nelle specifiche pertinenti. La presenza di una bozza in Git non autorizza a implementarla; per le scelte pendenti usa [PROGRESS](../PROGRESS.md) e la specifica del pezzo.
- Per continuare un lavoro usa il suo ramo autorizzato e verifica lo stato. I blocchi di manutenzione dell'audit si accumulano sopra la stessa base main, con commit prima di ogni passaggio. Non ricopiare bozze da altri rami.
- Stato precedente e decisioni complete: [snapshot del 16/10](storico/2026-10-16-PROGRESS-prima-manutenzione.md). Le specifiche approvate restano la fonte dei vincoli; lo storico non è una lista di attività correnti.

## Skill e plugin · inventario da consultare quando serve

| Risorsa | Dove | Attività pertinente |
|---|---|---|
| frontend-design, modern-web-guidance, design-sito, stile-testi | Sorgenti `.claude/skills/`, copie Codex `.agents/skills/` | Grafica, codice delle pagine, testi; conserva materiali e licenze |
| VectorLab UI/UX Skills, consistent-ui | Sull'account di Enrico, non nel repository (decisione 06/10/2026) | Coerenza dell'interfaccia; verifica disponibilità nella sessione |
| claude-seo | Da valutare solo quando serve, previa revisione e OK per installare | SEO, fuori dalla manutenzione corrente |

L'inventario non impone di caricare queste risorse. Per documentazione e test esistenti non serve installare skill/plugin. Gli agenti Claude restano in `.claude/agents/`.
