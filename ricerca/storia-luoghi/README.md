# Storia dei luoghi (ricerca del 07/10/2026)

Fatti con fonte sulla storia delle 15 tappe di «Due giorni a Napoli», per i racconti degli itinerari (Fase 3 di `ROADMAP.md`).
Raccolti da 4 agenti Sonnet, uno per gruppo. **Si tengono tutti**, anche quelli che non finiranno nei testi (regola di Enrico, 07/10/2026).

| File | Tappe | Fatti |
|---|---|---|
| `gruppo-1.yaml` | mann, sansevero, santa-chiara, duomo | 27 |
| `gruppo-2.yaml` | tribunali, spaccanapoli (con Gesù Nuovo e San Gregorio Armeno), san-lorenzo | 27 |
| `gruppo-3.yaml` | sant-elmo, san-martino, pedamentina, toledo (con stazione e Quartieri Spagnoli) | 37 |
| `gruppo-4.yaml` | plebiscito (con Galleria Umberto I), palazzo-reale, monte-echia, borgo-marinari (con Castel dell'Ovo) | 34 |

In tutto 125 fatti e 78 fonti nuove; 10 leggende (`leggenda: true`).

## Stato: NON ancora riletti
- Lo strumento degli agenti (WebFetch) dà un riassunto della pagina, non il testo: **35 fatti hanno un campo `nota`** perché date o nomi non erano tra le parole esatte della fonte. Vanno riaperti sulla pagina prima di usarli.
- Le **date che non coincidono** tra le fonti sono nei campi `nota` e nelle sezioni `dubbi:` (per esempio l'inizio del Duomo, 1272 o 1294; la fondazione di Neapolis; la Galleria Umberto I, 1890 o 1892). Nei testi si scrive solo quello su cui le fonti concordano.
- Quando un fatto viene usato, passa in `src/data/fatti.yaml` (id `st-…`) e la sua fonte in `src/data/fonti.yaml`.
