# PROGRESS · stato attuale

_Aggiornato il 09/10/2026. Ramo di manutenzione: `codex/manutenzione-blocco-1`, creato da `main`._

## Manutenzione approvata

- **Blocco 1 completato** (`c00723e`): conservazione di oltre 50 itinerari e blocco degli spostamenti senza spazio, con test scritti prima delle correzioni. Verifiche del Blocco 1: 36/36 test, build riuscita, 888 link validi; prova isolata di salvataggio e «Annulla». Dati già persi non recuperabili con queste correzioni.
- **Blocco 2 approvato e completato**: `AGENTS.md` specifico Codex, `CLAUDE.md` con istruzioni Claude conservate, regole comuni in `docs/REGOLE.md`, letture per compito in `docs/README.md`, strumenti locali separati. Verificati 52 riferimenti documentali, snapshot integrali, conservazione esatta della sezione modelli/agenti Claude e delle istruzioni locali, `git diff --check`. Nessuna modifica eseguibile rispetto al Blocco 1: suite/build/link del sito non ripetuti.
- **Fermarsi qui:** il prossimo è il Blocco 3, test essenziali e GitHub Actions leggero sulle PR verso `main`, con build/test/link, senza agenti AI, deploy o E2E pesanti. Non iniziare senza un nuovo OK di Enrico.
- Dopo: Blocco 4 refactoring mirato senza riscrivere il compositore; Blocco 5 codice dimostrato inutilizzato e pulizia finale. Ogni blocco richiede il proprio OK.
- `main` e `compositore-pagina` invariati; nessun push, merge, deploy o dipendenza nuova. Restano gli avvisi sulle fonti già osservati nel Blocco 1, fuori da questa manutenzione.

## Sito e proposte sono separati

- Il sito pubblicato nasce da `main`; home, marchio, menu e piè di pagina risultano pubblicati il 07/10 nello storico. Le note più vecchie che li chiamano «provvisori» descrivono il 06/10.
- Le proposte del compositore sono sul ramo `compositore-pagina`, da valutare e continuare con Claude. Il pezzo 2, giro 1, attende il parere di Enrico. Scelte intermedie e prove nei bozzetti non costituiscono consenso a implementare o pubblicare.
- Per quel lavoro leggi il `PROGRESS.md`, la specifica e la sola sezione pertinente di `design/compositore/README.md` **del ramo dei bozzetti**, come spiegato nell'[indice](docs/README.md#rami-e-proposte-grafiche). Non importarli nella manutenzione.
- Le attività di prodotto restano nella [ROADMAP](ROADMAP.md), escluse dai blocchi correnti: SEO, grafica, funzioni e città nuove. Gli orari dei cinque locali sono ancora una verifica separata di Enrico in [da-verificare/orari-locali.md](da-verificare/orari-locali.md).

## Riferimenti solo quando servono

- [Indice delle letture e inventario skill/plugin](docs/README.md): moduli e specifiche per il compito. Per proseguire la manutenzione con test/CI bastano strumenti già presenti, in locale; non installare risorse aggiuntive.
- [Ambiente locale](docs/AMBIENTE-LOCALE.md): Node portatile, strumenti e anteprime su questo computer.
- [Stato storico prima del Blocco 2](docs/storico/2026-10-09-PROGRESS.md): cronologia completa, decisioni, note e lavori rimandati. [Istruzioni precedenti](docs/storico/2026-10-09-CLAUDE.md): snapshot di riferimento, non regole operative correnti.

Mantieni questo file breve: stato, ramo e prossimo blocco. Conserva nuovi resoconti estesi in `docs/storico/` e nuove decisioni nella specifica pertinente, senza sovrascrivere la storia.
