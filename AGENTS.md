# Nextstop · istruzioni per Codex

Enrico lavora a questo progetto con Claude Code e con Codex. Le regole sono **una sola volta**, in `CLAUDE.md`:
**prima di tutto leggi `CLAUDE.md` per intero e seguilo come se fosse scritto qui**. Poi `PROGRESS.md` (dove siamo) e,
se il lavoro riguarda il compositore, `design/compositore/README.md`.

Le poche differenze per Codex:
- **Commit**: si firmano `Codex <noreply@openai.com>`, sempre con `git -c user.name=… -c user.email=…`, senza cambiare le
  impostazioni di git (sul computer di Enrico git non ha un nome impostato).
- **Modelli, effort e agenti**: dove `CLAUDE.md` parla di Opus, Sonnet, Haiku e degli agenti in `.claude/agents/`, vale il senso
  della regola (si parte dal livello più leggero che basta; grafica e scelte difficili al livello più alto). Di' a Enrico quale
  modello e quale ragionamento impostare in Codex. Gli agenti di `.claude/agents/` qui non ci sono: il lavoro lo fai tu.
- **Skill**: sono in `.agents/skills/`, copia identica di `.claude/skills/`. Le skill si cambiano in `.claude/skills/` e poi si
  ricopiano qui.
- **Un solo assistente alla volta** sullo stesso ramo: prima di passare da Codex a Claude Code (o il contrario) fai il commit.
- Se una regola nuova vale per tutti e due, scrivila in `CLAUDE.md`, non qui.
