# Nextstop · Codex

Sito statico Astro 7, Node >=22.12, in italiano. Enrico lavora anche con Claude Code.

- Leggi [regole comuni](docs/REGOLE.md) e [stato attuale](PROGRESS.md), poi solo i file pertinenti. `CLAUDE.md` contiene istruzioni specifiche di Claude Code e non va letto di default.
- Per trovare l'area giusta usa l'[indice delle letture](docs/README.md); comandi e struttura nel [README](README.md). Il compositore entra da `src/scripts/itinerari/app.ts`, calcoli e link da `src/lib/itinerari/`.
- Rispetta il blocco autorizzato: niente dipendenze nuove, merge su `main`, push o deploy senza autorizzazione. Conserva dati, ID, URL, privacy, offline, fonti e licenze.
- Commit: `git -c user.name="Codex" -c user.email="noreply@openai.com" commit …`; non cambiare la configurazione Git. Un solo assistente per ramo, con commit prima del passaggio all'altro.
- Consiglia modello e ragionamento fra quelli disponibili nel client per il compito, senza tradurre le tabelle di Claude. Li cambia Enrico: non fingere di impostarli e non proporre cambi inutili durante il lavoro.
- Fai il lavoro direttamente: gli agenti di `.claude/agents/` sono di Claude Code. Delega solo su richiesta esplicita pertinente.
- Skill in `.agents/skills/`, sorgenti in `.claude/skills/`: conserva la copia identica e le licenze; consulta solo le skill utili secondo le regole di revisione comuni.
- Leggi l'[ambiente locale](docs/AMBIENTE-LOCALE.md) solo quando serve usare gli strumenti su questo computer; non assumere Node nel PATH o la disponibilità degli strumenti cloud.
- Bug: test che riproduce il problema prima della correzione, modifica minima e verifiche proporzionate. A fine blocco riassumi file, risultati, rischi e prossimo passo, poi fermati per l'OK.

Le regole per entrambi gli assistenti si aggiornano in `docs/REGOLE.md`; qui solo le particolarità di Codex.
