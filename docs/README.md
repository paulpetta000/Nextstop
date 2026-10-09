# Documentazione · scegliere cosa leggere

Per iniziare: istruzioni del proprio assistente (`AGENTS.md` o `CLAUDE.md`), [regole comuni](REGOLE.md) e [stato corrente](../PROGRESS.md). Poi scegli solo la riga del compito, senza aprire tutti i rimandi.

## Fonti per argomento

| Compito | Dove entrare | Approfondimento solo se necessario |
|---|---|---|
| Avvio, comandi e struttura | [README del progetto](../README.md#comandi), `package.json` | [Ambiente locale](AMBIENTE-LOCALE.md) per questo computer |
| Test e CI | [README · Test](../README.md#test), [GitHub Actions](../README.md#github-actions--controlli-delle-pull-request), `test/`, `.github/workflows/ci.yml` | Solo i test del modulo; la prima esecuzione Ubuntu resta da verificare in PR |
| Compositore: stato e interazioni | `src/scripts/itinerari/app.ts`, `memoria.ts`, `trascina.ts` | `src/pages/napoli/itinerari/index.astro`, [specifica](../specifiche/compositore.md) nella parte pertinente |
| Calcoli, spostamenti e link | `src/lib/itinerari/calcolo.ts`, `spostamenti.ts`, `link.ts`, `date.ts`, `tipi.ts` | Test corrispondenti in `test/`; `napoli.ts` fornisce i dati della città |
| Mappa e percorsi | `src/scripts/itinerari/mappa.ts`, `scripts/mappa/` | [README · Itinerari](../README.md#itinerari); JSON solo per il caso riprodotto |
| Bus e rinnovo dati | [Aggiornamenti](../aggiornamenti/README.md), `scripts/itinerari/` | [Specifica bus](../specifiche/bus-orari-veri.md); `src/lib/itinerari/firma-posizioni.mjs` condivisa con la build; dati/fonti del caso |
| Dati, fonti, testi e firme | [README · Informazioni](../README.md#dove-sono-le-informazioni), `src/lib/regole.mjs`, `test/dati.test.mjs`, `test/testi.test.mjs` | [Guida dei testi](../specifiche/stile-testi.md), solo schede e YAML coinvolti |
| Build e uso offline | `astro.config.mjs`, `integrations/`, `scripts/check-links.mjs` | `src/scripts/sito.ts`, `public/manifest.webmanifest`; preservare il service worker |
| Interfaccia e bozzetti, come attività approvata | [DESIGN](../DESIGN.md), [indice specifiche](../specifiche/README.md) | Solo il README del pezzo di `design/` e la skill pertinente |
| Lavori futuri | [ROADMAP](../ROADMAP.md) | Non è una lista di attività autorizzate per la sessione |
| Decisioni precedenti | [Istruzioni precedenti](storico/2026-10-09-CLAUDE.md), [stato precedente](storico/2026-10-09-PROGRESS.md) | Snapshot integrali prima del Blocco 2, non istruzioni correnti |

Il README contiene già la mappa del codice e dei dati: non duplicarla in una nuova guida di architettura. Trovati modulo e specifica, fermati con le letture generali.

## Rami e proposte grafiche

- La manutenzione nasce da `main`. Lo storico conserva note del 06–08/10 superate (per esempio home/logo «provvisori»): sono registrazioni dell'epoca, non lo stato corrente.
- Le proposte recenti e le scelte intermedie sono nel ramo `compositore-pagina`, non nella versione pubblicata. Enrico le valuta con Claude: non ricopiarle nella manutenzione né trattarle come funzionalità implementate o consenso a pubblicare.
- Per quei bozzetti usa il loro ramo e la sezione pertinente di `design/compositore/README.md`; qui il file non è presente. In sola lettura: `git show compositore-pagina:PROGRESS.md` o `git show compositore-pagina:design/compositore/README.md`. Confronto dei vincoli: `git diff main compositore-pagina -- specifiche/compositore.md`.
- Le aggiunte alla specifica nel ramo dei bozzetti non sostituiscono automaticamente quella di questo ramo. Specifiche e ricerche restano nei loro percorsi; Git integra questi documenti senza sostituirli.

## Skill e plugin · inventario da consultare quando serve

| Risorsa | Dove | Attività pertinente |
|---|---|---|
| frontend-design, modern-web-guidance, design-sito, stile-testi | Sorgenti `.claude/skills/`, copie Codex `.agents/skills/` | Grafica, codice delle pagine, testi; conserva materiali e licenze |
| VectorLab UI/UX Skills, consistent-ui | Sull'account di Enrico, non nel repository (decisione 06/10/2026) | Coerenza dell'interfaccia; verifica disponibilità nella sessione |
| claude-seo | Da valutare solo quando serve, previa revisione e OK per installare | SEO, fuori dalla manutenzione corrente |

L'inventario non impone di caricare queste risorse. Per documentazione e test esistenti non serve installare skill/plugin. Gli agenti Claude restano in `.claude/agents/`.
