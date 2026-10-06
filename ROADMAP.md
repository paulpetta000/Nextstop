# Roadmap di Nextstop (scritta il 06/10/2026, da rivedere con Enrico a ogni fase)

Ogni fase comincia con una **specifica corta** da approvare (regola di `CLAUDE.md`) e finisce con l'anteprima di Vercel e l'OK di Enrico.
Lo stato giorno per giorno è in `PROGRESS.md`; qui solo l'ordine delle cose.

## Fase 0 · Messa a punto (adesso, 10 minuti)
- [x] Repository `paulpetta000/Nextstop` e progetto Vercel, indirizzo `nextstop-alpha.vercel.app` (06/10/2026).
- [x] Su GitHub il ramo principale è `main` (Enrico, 06/10/2026).
- [ ] Su Vercel il ramo del sito pubblico è `main` (Enrico).
- [ ] L'email del sito (oggi è quella di Napoli a Vela).
- [ ] Google Search Console: proprietà nuova e invio di `/sitemap.xml`.

## Fase 1 · Identità e home «wow» (prossima sessione · Opus, effort extra)
L'obiettivo di Enrico: un sito che sembri da 5.000 euro.
1. **Specifica della home**: chi arriva (turista, anche italiano nella sua città), cosa deve capire e trovare nei primi 5 secondi, cosa c'è sotto.
   Fatta e approvata il 06/10/2026: `specifiche/home-e-identita.md`, con i **racconti** degli itinerari pronti (idea di Enrico: pagine da leggere, stile MUDD, che Google trova) e il compositore da rifare.
2. **Due proposte di direzione grafica**: home e pagina «Itinerari a Napoli», con i dati veri e le nostre foto, in chiaro e in scuro, viste da telefono.
   Ispirazioni: `design/ispirazioni/` (MUDD) e `.claude/skills/design-sito/references/ispirazioni.md`. Lo stile «Orario» di oggi si può cambiare.
3. **Logo**: 3 o 4 direzioni (SVG, chiaro e scuro, anche piccolo come icona del telefono).
4. **Figma**: è collegato, ma con il piano gratuito e un posto «View» si può usare al massimo circa **20 volte al mese**. Quindi le proposte si fanno in HTML con i dati veri (come nel Blocco 1 di Napoli a Vela), e in Figma va solo la proposta scelta, come file da guardare e da tenere. Per usare Figma di più serve un piano a pagamento con un posto pieno: decide Enrico.
5. Il nostro `DESIGN.md`: caratteri, colori, spazi, pulsanti, riquadri. Lo legge la skill `design-sito`.

## Fase 2 · La grafica su tutto il sito (Opus, effort alto)
- Itinerari, «Dove mangiare», Napoli, fonti e pagine legali con la grafica scelta; intestazione e piè di pagina nuovi.
- Controllo di coerenza con consistent-ui: **almeno 35 su 40** (obiettivo di Enrico; Napoli a Vela era a 24).
- Lighthouse su telefono 95 o più, axe in chiaro e scuro, 320 e 390 px.

## Fase 3 · Itinerari curati meglio a Napoli
- Più itinerari pronti, ognuno con un nome e un'idea (per esempio «Napoli sotterranea», «Il mare in un giorno», «Napoli con i bambini»), sempre ricalcolati dalla build.
- Una **pagina fissa per ogni itinerario pronto**: oggi il compositore tiene tutto dopo il «#» e Google non lo vede.
- Le correzioni del trascinamento delle tappe e le 28 righe aperte di `da-risolvere.md` (orari dei locali, premi da verificare, luoghi), in una sessione di gruppo.

## Fase 4 · Esperienze a Napoli (il vecchio «blocco D»)
- Corsi di cucina, laboratori, degustazioni: una tappa con ora d'inizio e durata fisse, e un elenco `/napoli/esperienze/` con i filtri.
- Regole e dati già pensati in `specifiche/itinerari-napoli-ampliamento.md`, sezione 5. Prima Enrico approva l'elenco e i numeri.

## Fase 5 · La seconda città
- Specifica: quale città (Roma, Milano, Torino, Venezia…), quante tappe, da dove vengono i tempi a piedi e i mezzi (OpenStreetMap, orari aperti dell'azienda dei trasporti).
- Il compositore è già scritto per più città: la città arriva come dati.
- Consiglio: Napoli perfetta più 1 o 2 città, poi si allarga. Per ogni città va deciso chi è l'«amico del posto» della guida di stile.

## Fase 6 · SEO e crescita
- claude-seo (solo i comandi di analisi, letto prima tutto il codice), Search Console, pagine fisse per tappe e locali se hanno senso.
- Parole chiave con Semrush solo con l'OK di Enrico (consuma unità del suo piano).
- Nome e dominio definitivi dopo l'avvocato.

## Fase 7 · Lingue
- Inglese per primo, con la guida di stile (niente giochi di parole che non si traducono).

## Intanto, su Napoli a Vela (repository `pol`, sessione a parte)
- Pagina ponte su `/napoli/itinerari/` e `/napoli/dove-mangiare/`, link verso Nextstop, pulizia: l'elenco è nel `PROGRESS.md` di Napoli a Vela.
- Fino ad allora tappe, locali e orari si aggiornano **solo qui**.
