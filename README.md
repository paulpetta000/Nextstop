# Nextstop · Itinerari in città

Sito statico in [Astro](https://astro.build), pubblicato su Vercel. Nato il 06/10/2026 dagli itinerari di Napoli a Vela (`specifiche/sito-itinerari-separazione.md`).

## Documentazione e assistenti

- [AGENTS.md](AGENTS.md): istruzioni Codex; [CLAUDE.md](CLAUDE.md): istruzioni Claude Code. Entrambi usano le [regole comuni](docs/REGOLE.md) e lo [stato corrente](PROGRESS.md).
- [Indice delle letture](docs/README.md): scegli moduli e documenti pertinenti; contiene inventario delle skill, rimandi allo storico e distinzione fra manutenzione e proposte grafiche.
- Qui restano comandi, struttura e procedure per sviluppatori. [ROADMAP](ROADMAP.md) per lavori futuri, [specifiche](specifiche/README.md) per vincoli approvati, [DESIGN](DESIGN.md) solo per l'interfaccia.

## Comandi

Node >=22.12. L'installazione serve alla prima preparazione autorizzata, non a ogni sessione AI; su questo computer vedi [ambiente locale](docs/AMBIENTE-LOCALE.md).

```sh
npm install
npm run dev      # sito in locale su http://localhost:4321
npm run build    # costruisce il sito in dist/
npm run check:links  # dopo la build: controlla che ogni link interno porti a una pagina o a un file
npm test         # i test (pochi secondi, vedi «Test» in fondo)
npm run testi:firma  # dopo aver riletto un testo che usa una scheda cambiata
```

## Dove sono le informazioni

| File | Cosa contiene |
|---|---|
| `src/data/fatti.yaml` | Le schede: testo, stato (`confermato` / `stampa` / `atteso`), fonti, data di controllo, data entro cui ricontrollare |
| `src/testi/*.yaml` | I testi discorsivi delle pagine, con le schede che usano (vedi sotto) |
| `src/data/fonti.yaml` | Le fonti, con indirizzo, tipo e data di controllo (tipi: vedi «Cercare una fonte») |
| `src/data/eventi.ts` | I giorni delle regate di Napoli 2027: servono solo al blocco «Regate dal lungomare» degli itinerari |
| `src/data/luoghi.yaml` | Stazioni e porti da cui partono le gite (campo `partenza` delle tappe) |
| `src/data/foto.yaml` | Foto con licenza libera: file in `src/assets/foto/`, autore, licenza, origine, descrizione |
| `src/config/sito.ts` | Nome del sito, indirizzo, titolare |
| `src/data/tappe.yaml` | Le tappe degli itinerari (51 in città e 9 gite): posizione, durata, schede di orari e prezzi, foto (vedi «Itinerari») |
| `src/data/locali.yaml` | I 32 locali di «Dove mangiare» (`/napoli/dove-mangiare/`): orari giorno per giorno, cucina, prezzo base, piatti; nel compositore sono tappe in città (vedi «Itinerari») |
| `src/data/tempi-tappe.json` | I tempi tra le tappe, calcolati da `scripts/itinerari/` (non si modifica a mano) |
| `src/data/partenze-bus.json`, `src/data/percorsi-alternativi.json` | Orari veri dei bus: partenze ANM per tipo di giorno e disegni delle strade alternative (calcolati da `scripts/itinerari/`; pagine `/napoli/itinerari/partenze.json` e `percorsi-alternativi.json`). Specifica: `specifiche/bus-orari-veri.md` |
| `src/data/linee-bus.json` | Tutte le fermate delle 13 linee bus usate, con le frequenze (dal feed ANM, calcolato da `scripts/itinerari/`; per tappe e locali futuri) |

Stati delle schede: `confermato`, `stampa` (giornali), `segnalato` (blog e siti non ufficiali), `atteso`.

Regola: **nessuna informazione senza fonte**. Se una scheda non ha fonte, stato o data, la build si ferma.
Quando una scheda supera la data `ricontrollare`, la build scrive un avviso `[da ricontrollare]`.

## Testi discorsivi delle pagine

Nessuna pagina mostra le schede una per una: tutte hanno testi normali, scritti in `src/testi/<pagina>.yaml` (un blocco per argomento) e mostrati con `<Testo b={T.b('nome')} />` dopo `const T = await getTesti('<pagina>')`. Le fonti finiscono da sole in fondo alla pagina (`<FontiPagina testi={T} />`; con più file di testi `testi={[T, P]}`).

```yaml
formato:
  usa: [cal-flotta, cal-rr]          # le schede di fatti.yaml usate dal testo
  testo: |
    ### Titoletto

    Paragrafo. **Grassetto**, *corsivo*, [link](/calendario/).

    Nel 2024 i percorsi avrebbero avuto 8 lati{?reg-percorso}.
```

Regole controllate dalla build (se non sono rispettate si ferma):
- ogni scheda in `usa` deve esistere, con la sua fonte; per un consiglio nostro senza fonte si scrive `senzaFonte: "perché"`;
- un'informazione non confermata per il 2027 (stato `stampa`, `segnalato` o `atteso`, oppure `anno` 2024 o 2026) va segnata con `{?id}` (sul sito diventa un piccolo `*`, spiegato in fondo) e la frase deve dirlo a parole: «non è ancora uscito», «lo diranno gli organizzatori più avanti», «nel 2024»…; per le notizie di stampa basta il condizionale («dovrebbe», «è previsto»). Le parole ammesse sono in `src/lib/regole.mjs` (`PAROLE`), lo stile in `specifiche/stile-testi.md`;
- ogni testo è «firmato» con le schede che usava quando è stato scritto (`src/testi/firme.json`): se una scheda cambia, la build si ferma finché qualcuno non rilegge il testo e lo firma di nuovo con `npm run testi:firma`.

Altre cose utili:
- un blocco può avere anche `fonti: [id]` (fonti senza scheda, per esempio OpenStreetMap o le fonti di una squadra) e `voci:` (elenchi di `num` e `testo`: le cifre in evidenza, le tariffe dei taxi, la tabella AC75–AC40). Le voci valgono con la prima frase del blocco: se dice «Nel 2026 funzionava così», le voci non devono ripeterlo;
- i risultati del passato hanno `storico: true` in `fatti.yaml`: la frase dice l'anno, ma non serve il `*`;
- i fatti del passato letti solo sui giornali (premi delle guide, classifiche, recensioni dei locali) hanno anche `comeFatto: true`: nel testo si scrivono come fatti, senza `*` e senza «secondo…»; la build li elenca come `[da verificare]` finché non si leggono sulla fonte originale;
- un `*` per frase al massimo: se una frase usa più schede, si scrive `{?id1,id2}` alla fine;
- dove sono i testi: un file per pagina (`home.yaml`, `napoli.yaml`, `itinerari.yaml`, `dove-mangiare.yaml`), `tappe.yaml` per i testi brevi delle tappe e `locali.yaml` per quelli dei locali (stesso id dei dati).

## Aggiornare un'informazione

1. Apri la fonte e controlla.
2. Cambia il `testo` della scheda in `fatti.yaml`, lo `stato` se serve, e la data `controllato`.
3. Se la fonte è nuova, aggiungila in `fonti.yaml`.
4. `npm run build` per controllare. Se la scheda è usata da un testo in `src/testi/`, rileggi il testo, correggilo e poi `npm run testi:firma`.

## Cercare una fonte

Ogni fonte in `fonti.yaml` ha un `tipo`. Il tipo è quello della **pagina**, non di chi la pubblica: un articolo di cronaca di Napolike è `stampa`, la sua pagina-guida su una chiesa è `blog`.

| Tipo | Cos'è | Sul sito |
|---|---|---|
| `ufficiale` | Organizzatori, squadre, Comune, ministeri, aziende dei trasporti, il sito del museo o del locale | Ufficiale |
| `dati` | Dati aperti (OpenStreetMap, Copernicus, feed GTFS) | Dati aperti |
| `stampa` | Giornali e testate (anche guide gastronomiche come Gambero Rosso) | Stampa |
| `enciclopedia` | Wikipedia | Enciclopedia |
| `blog` | Blog di viaggio e pagine-guida di siti non ufficiali | Blog e guide |
| `altro` | Il resto: copie di documenti, albi d'onore, siti di cui non si conosce il gestore | Altro |

Una scheda `confermato` che ha **solo** fonti `enciclopedia`, `blog` o `altro` fa comparire nella build l'avviso `[fonti deboli]` (la build non si ferma): aggiungi una fonte più forte o cambia lo stato (`segnalato` se viene da blog o siti non ufficiali).

**Per questo tipo di informazione cerca prima qui:**

| Informazione | Prima qui | Se non c'è |
|---|---|---|
| Date e orari di un evento in città (per Napoli: le regate del 2027) | il sito degli organizzatori | ANSA, Il Mattino (stato `stampa`) o «non ancora uscito» (`atteso`) |
| Strade chiuse, ordinanze, eventi in città | Comune di Napoli, Capitaneria di porto | Il Mattino, ANSA (`stampa`) |
| Bus, metro, funicolari, treni, traghetti | ANM (anche il feed GTFS), EAV, Trenitalia, Caremar | nessun ripiego: senza fonte ufficiale non si scrive |
| Musei, chiese, siti archeologici: orari e prezzi | il sito del luogo, il Ministero della Cultura | pagine-guida (`blog`) solo se il luogo non ha un sito; la scheda resta da ricontrollare |
| Locali: orari e prezzi | il sito del locale; la sua scheda Google (decisione di Enrico, 04/10/2026: dal cloud non si legge) | guide gastronomiche per i giudizi, non per gli orari |
| Strade, distanze, quote, mappa | OpenStreetMap, Copernicus (`dati`) | — |
| Storia, glossario, piatti tipici (cose che non cambiano) | Wikipedia (`enciclopedia`) va bene | meglio aggiungere una fonte ufficiale per le date |

## Itinerari

- **Locali** (blocco C, 04/10/2026): `src/data/locali.yaml`, controllati da `src/lib/locali.ts` (le ore di «apertura» devono comparire nella scheda `lc-<id>-orari`; la fascia di prezzo la calcola la build dal «prezzoBase»). Schede e fonti con id `lc-`, testi brevi in `src/testi/locali.yaml`, testi della pagina e due righe sui piatti in `src/testi/dove-mangiare.yaml`. I locali entrano nei tempi tra le tappe: dopo averne aggiunto o spostato uno, rifare i tempi con `scripts/itinerari/`.
- **Tappe**: `src/data/tappe.yaml`. Orari, prezzi e viaggi delle gite sono schede in `fatti.yaml` con id che cominciano con `tp-` (fonti e foto anche); i testi brevi stanno in `src/testi/tappe.yaml` (stesso id della tappa).
- **Tempi tra le tappe**: `node scripts/itinerari/scarica.mjs <cartella>` scarica strade, scale, ascensori e linee da OpenStreetMap, le quote Copernicus e gli orari degli autobus ANM (feed GTFS, letto da `scripts/itinerari/gtfs.mjs`); `node scripts/itinerari/costruisci.mjs <cartella>` scrive `src/data/tempi-tappe.json` (giorno feriale, sabato, sabato dopo le 14:50, domenica mattina, domenica pomeriggio, solo a piedi) e `src/data/percorsi-tappe.json` (il disegno dei percorsi per la mappa, compresso). Se una tappa nuova o spostata non è nei tempi, la build si ferma. Metodo e controlli: `ricerca/2026-10-02-itinerari-distanze.md`. I parametri (velocità, attese, linee chiuse come la funicolare di Montesanto, le linee bus e le fasce orarie nella tabella `BUS`) sono in testa allo script. Da dove vengono i dati e come si rinnovano: `aggiornamenti/`.
- **Bozzetti del design**: `design/itinerari/` (non fanno parte del sito). `node design/itinerari/genera.mjs <cartella>` rifà le due proposte in HTML con i dati veri; `node design/itinerari/foto.cjs <uscita> <percorso di playwright-core>` le fotografa come schermate da telefono, in chiaro e in scuro.
- **La pagina** `/napoli/itinerari/` (`src/pages/napoli/itinerari/`): il compositore. Il calcolo (orari, avvisi, ordine più corto, link) sta in `src/lib/itinerari/` e non sa niente di Napoli: la città arriva come dati da `napoli.ts` (tappe, tempi, miniature, giorni delle regate da `src/data/eventi.ts`). Lo script della pagina è in `src/scripts/itinerari/` (`app.ts`; `mappa.ts` si carica solo quando apri la mappa; `memoria.ts` salva nel browser; `trascina.ts` per riordinare). Stile in `src/styles/itinerari.css`; caratteri Barlow con `node scripts/font/barlow.mjs`.
- **Itinerari pronti**: `src/data/itinerari-pronti.yaml` (descrizioni in `src/testi/itinerari.yaml`, blocchi `pronto-<id>`). La build li ricalcola: si ferma se un giorno non ci sta negli orari, se una tappa è lontana dalle altre, se si arriva tardi alle regate o se esiste un ordine più corto di almeno 5 minuti (e lo stampa).
- **Link condivisi**: tutto dopo il «#» (`n` nome, `d` data del primo giorno, `w=1` solo a piedi, `g` un giorno: `0930-1900.duomo.sansevero`, `@pompei` per una gita). Un link vecchio con una tappa che non esiste più si apre lo stesso, senza quella tappa.

## Test

`npm test` (con `node:test`, già dentro Node: nessun pacchetto in più) controlla in pochi secondi, senza costruire il sito:
- le **regole dei testi**: parole di cautela («secondo la stampa», «non è ancora uscito», l'anno), segni `{?id}`, risultati storici (`test/regole.test.mjs`). Le regole stanno in un solo file, `src/lib/regole.mjs`, usato dalla build, da `npm run testi:firma` e dai test: se allarghi le parole ammesse, aggiungi le frasi nuove al test «tutti i modi di dirlo»;
- i **testi veri** di `src/testi/`: segni e parole di cautela come nella build, e nessuna parola della lista nera della guida di stile (`test/testi.test.mjs`, utile mentre si riscrive un testo: `node --test test/testi.test.mjs`);
- la **firma**: che `src/testi/firme.json` corrisponda alle schede di oggi;
- le **date** delle schede e delle fonti (niente nel futuro, «ricontrollare» dopo «controllato») e i tipi di fonte (`test/dati.test.mjs`);
- il **controllo dei link**, provato su un sito finto (`test/link.test.mjs`);
- le **date in italiano** di `src/lib/formato.ts`, in cinque fusi orari (`test/date.test.mjs`);
- la **memoria degli itinerari** oltre il cinquantesimo, l'itinerario attivo, storage disabilitato/pieno e archivi corrotti (`test/memoria-itinerari.test.mjs`);
- i **link degli itinerari**: andata/ritorno, gite, sanitizzazione, limiti e compatibilità dei link vecchi (`test/link-itinerari.test.mjs`);
- i **calcoli degli itinerari**: orari e totali, giornata piena, scenari di calendario, apertura dei locali, ripartenza dal vivo e bus con partenze valide/mancanti/esaurite (`test/calcolo-itinerari.test.mjs`). Casi sintetici, senza rete o dati utente;
- gli **spostamenti delle tappe**: destinazione piena, gruppi senza spazio, limiti, ordine e preparazione senza mutare l'originale (`test/spostamenti-itinerari.test.mjs`). I casi che perdevano dati sono stati riprodotti prima delle correzioni del Blocco 1.

Esecuzione durante il lavoro e a fine blocco secondo le [regole comuni](docs/REGOLE.md#verifiche-e-letture), senza ripetere la build per sole modifiche documentali. Il workflow seguente verifica le pull request, senza gestire la pubblicazione su Vercel.

## GitHub Actions · controlli delle pull request

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) è preparato sul ramo di manutenzione: solo PR verso `main`, un job Ubuntu 24.04, permessi `contents: read`, limite di 15 minuti e cancellazione delle esecuzioni superate per la stessa PR. Nessun agente AI, deploy, merge automatico o E2E pesante. Non salta i cambiamenti a documenti, YAML o dati.

Per riusare gli strumenti del runner e non introdurre Actions esterne, poche righe di Git leggono il commit di prova della PR; il token di lettura è usato solo in quel passo e non salvato nella configurazione Git. Git e Node >=22.12 sono [già presenti nel runner Ubuntu 24.04](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md) (verificato il 09/10/2026); il workflow controlla la versione disponibile, senza fissare una patch o installare un runtime aggiuntivo.

Sul runner, in ordine:

1. `npm ci --ignore-scripts --no-audit --no-fund`: installa le sole dipendenze già fissate nel lockfile; [disabilita gli script automatici di installazione](https://docs.npmjs.com/cli/v11/commands/npm-ci/#ignore-scripts), senza introdurre pacchetti nel progetto.
2. `npm test`.
3. `npm run build` (telemetria Astro disabilitata).
4. `npm run check:links`, solo dopo una build riuscita.

**Stato della verifica:** YAML, permessi, trigger, ordine e sintassi Bash controllati localmente; test/build/link eseguiti su Windows con dipendenze già presenti. Nessuna installazione locale e nessuna esecuzione GitHub dichiarata: la prima PR richiede autorizzazione al push e deve verificare su Ubuntu anche l'installazione senza script di `esbuild`/`sharp` (binari Linux presenti nel lockfile). Non abilitare script indiscriminatamente se quella verifica fallisce. Non serve creare token personali o fornire segreti Vercel.

## Altro

- Mappa: `scripts/mappa/` (dati © OpenStreetMap, ODbL). Il riquadro è in `scripts/mappa/riquadro.mjs`; per rifarla: `node scripts/mappa/scarica.mjs <cartella>` e poi `node scripts/mappa/costruisci.mjs <cartella>`.
- Font: `scripts/font/prepara.py` (licenza SIL OFL).
- Marchio (la soglia astratta): `src/lib/marchio.mjs`, nella pagina `src/components/Marchio.astro`; icone dell'app e favicon: `node scripts/icone.mjs`.
- Portico di piperno della home: `src/lib/portico.mjs` e `src/components/Campata.astro`; la pietra (`src/assets/pietra/piperno.webp`) si rifà con `node scripts/pietra.mjs`.
- Caratteri in `public/fonts/` (licenza OFL accanto a ciascuno): Archivo, Bodoni Moda (titoli con le grazie), Barlow e IBM Plex Mono (pagine non ancora rifatte).
- Statistiche (solo Vercel Web Analytics, nessun contatore nostro): partono solo sul sito pubblico (`src/scripts/sito.ts`) e mai con «Do Not Track» o «Global Privacy Control».
- **Gli id non si rinominano** (tappe, locali, schede): finiscono nei link condivisi degli itinerari e nella memoria dei telefoni; se cambiano, le tappe dei link già mandati spariscono. Per toglierne uno, cancellalo e basta (il link lo scarta e lo dice).
