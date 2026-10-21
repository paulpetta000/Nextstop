# Documentazione · scegliere cosa leggere

Per iniziare: istruzioni del proprio assistente (`AGENTS.md` o `CLAUDE.md`), [regole comuni](REGOLE.md) e [stato corrente](../PROGRESS.md). Poi scegli solo la riga del compito, senza aprire tutti i rimandi.

Stato della revisione del 21 ottobre: [risultati e attività rimaste per area](storico/2026-10-21-riepilogo-aree.md), sei nuovi gruppi, dodici complessivi, 723 test e indice delle prove. Istruzioni e consumo Claude esclusi fino a nuova richiesta; la nuova idea per altre città resta rinviata anche nell’analisi.

## Fonti per argomento

| Compito | Dove entrare | Approfondimento solo se necessario |
|---|---|---|
| Avvio, comandi e struttura | [README del progetto](../README.md#comandi), `package.json` | [Ambiente locale](AMBIENTE-LOCALE.md) per questo computer |
| Test e CI | [README · Test](../README.md#test), [GitHub Actions](../README.md#github-actions--controlli-delle-pull-request), `test/`, `.github/workflows/ci.yml` | Solo i test del modulo; procedura e limiti in [Manutenzione](MANUTENZIONE.md#github-e-commit-verificati) |
| Compositore: stato e interazioni | `src/scripts/itinerari/compositore/avvio.js`, `stato.js`, `viste.js`; `src/scripts/itinerari/memoria.ts` | `src/pages/napoli/itinerari/index.astro`, [specifica](../specifiche/compositore.md) nella parte pertinente |
| Calcoli, spostamenti e link | `src/lib/itinerari/calcolo.ts`, `spostamenti.ts`, `link.ts`, `date.ts`, `tipi.ts` | Test corrispondenti in `test/`; `napoli.ts` fornisce i dati della città |
| Mappa e percorsi | `src/scripts/itinerari/compositore/mappa.js`, `src/lib/itinerari/strade.ts`, `scripts/mappa/` | [README · Itinerari](../README.md#itinerari); JSON solo per il caso riprodotto |
| Bus e rinnovo dati | [Aggiornamenti](../aggiornamenti/README.md), `scripts/itinerari/` | [Specifica bus](../specifiche/bus-orari-veri.md); `src/lib/itinerari/firma-posizioni.mjs` condivisa con la build; dati/fonti del caso |
| Dati, fonti, testi e firme | [README · Informazioni](../README.md#dove-sono-le-informazioni), `src/lib/regole.mjs`, `test/dati.test.mjs`, `test/testi.test.mjs` | [Guida dei testi](../specifiche/stile-testi.md), solo schede e YAML coinvolti |
| Build e uso offline | `astro.config.mjs`, `integrations/`, `scripts/check-links.mjs` | `src/scripts/sito.ts`, `public/manifest.webmanifest`; preservare il service worker |
| Interfaccia e bozzetti, come attività approvata | [DESIGN](../DESIGN.md), [indice specifiche](../specifiche/README.md) | Solo il README del pezzo di `design/` e la skill pertinente |
| Dipendenze, tipi e regole GitHub | [Manutenzione](MANUTENZIONE.md) | Piano di aggiornamento; nessuna installazione implicita |
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
