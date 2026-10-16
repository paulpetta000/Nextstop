# Manutenzione · controlli e decisioni

Guida operativa del 16/10/2026, dopo l'audit di main `75d25e6` e le correzioni locali dei primi due blocchi. Stato corrente in [PROGRESS](../PROGRESS.md), struttura e comandi nel [README](../README.md). Non sostituisce l'autorizzazione a installare, pubblicare o cambiare le impostazioni remote.

## GitHub e commit verificati

Ricontrollato via API il 16/10/2026: [main](https://api.github.com/repos/paulpetta000/Nextstop/branches/main) è ancora `75d25e67bd413b724a5cfc4afb05612d1cfac165`, `protected:false`; [ruleset](https://api.github.com/repos/paulpetta000/Nextstop/rulesets) vuoti. Nessuna impostazione remota modificata. Un controllo riuscito non è oggi un requisito imposto al merge.

Il workflow locale verifica il commit esatto dell'evento, sulle PR verso main, dopo i push su main e su richiesta manuale. Il push su main è un controllo successivo: non impedisce un deploy Vercel già avviato. L'avvio manuale deve usare un ramo che contiene il workflow aggiornato; il pulsante dipende dalla presenza del workflow nel ramo predefinito. [Eventi e identificativi di GitHub](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

Procedura per il futuro blocco di integrazione, dopo l'autorizzazione a push/PR:

1. Pubblicare il ramo che comprende i tre blocchi, creare la PR verso il main corrente e annotare gli identificativi di entrambi. Se main è cambiato, integrare le modifiche nel ramo di lavoro e ripetere i controlli sui conflitti risolti.
2. Attendere `verifica` sul merge di prova dell'ultima versione della PR. Il log stampa `Commit verificato`; confrontarlo con il commit di merge di prova attuale della PR. Un verde su un tentativo precedente, sul solo ramo o un avvio manuale non certifica quel merge.
3. Se cambia la PR o main, verificare nuovamente il risultato integrabile. Se il commit dell'evento non è recuperabile, il job deve fallire: nuova esecuzione sull'evento corrente, senza ripiegare su un altro commit.
4. Eseguire i controlli dell'anteprima Vercel previsti dalle regole, inclusa la soglia mobile 95, poi ottenere l'OK al merge e alla pubblicazione. Il punteggio locale 94 del secondo blocco resta un limite aperto.
5. Dopo il merge, controllare anche il run di main e la corrispondenza fra commit e deployment. Un job verde non è un'autorizzazione al rilascio.

**Regola remota consigliata, da attivare nel blocco di integrazione:** sul solo `main`, richiedere una PR e il controllo `verifica` proveniente da GitHub Actions, con ramo aggiornato prima del merge; bloccare cancellazioni e push forzati. Verificare il nome del controllo dalla prima esecuzione reale del workflow aggiornato. Per il lavoro individuale non richiedere un'approvazione esterna che Enrico non può dare alla propria PR. Qualunque eventuale eccezione amministrativa va esplicitata. GitHub permette queste protezioni, ma la loro disponibilità dipende dal repository e dal piano: [documentazione ufficiale](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

Non sono stati attivati ruleset, merge queue, bot, dipendenze o Actions di terzi. Il checkout locale è provato con veri repository temporanei e senza rete, non con un GitHub simulato: la conservazione e l'accessibilità dei vecchi oggetti sul server restano proprietà di GitHub, non garantite dal test.

## Dipendenze e ordine di aggiornamento

Il lockfile dell’audit iniziale segnalava cinque pacchetti: tre high e due moderate. Dopo il [blocco Sharp](storico/2026-10-16-sharp.md) autorizzato da Enrico, Sharp è aggiornato a 0.35.5 e non è più segnalato: restano quattro pacchetti (due high, due moderate). Gli altri aggiornamenti non sono stati applicati. Questa è una valutazione dei punti di ingresso nel progetto; non è una prova di sfruttamento né una certificazione di assenza di rischi.

| Pacchetto nel lockfile | Uso e valutazione nel progetto | Intervento da preparare |
|---|---|---|
| `sharp` diretto 0.35.5 (prima 0.33.5) | Genera PNG Open Graph durante la build e immagini negli script. I dati esaminati sono SVG, font e immagini del repository; nessun upload pubblico. Il lockfile ora deduplica la copia usata da Astro sulla stessa 0.35.5. | Completato localmente: catena Windows installata senza script, 159 test, build e immagini verificate. Esecuzione Linux reale ancora da verificare in CI; avvisi Sharp rimossi dall’audit. |
| `http-cache-semantics` 4.2.0, via Astro | Il modulo installato è usato in `astro/dist/assets/build/remote.js`, per immagini remote. Configurazione esaminata senza domini remoti; sito statico senza cache privata multiutente. | Aggiornamento transitivo compatibile del lockfile o della versione Astro; verificare il percorso immagini. Nessuna necessità dimostrata di cambiare framework. |
| `source-map-js` 1.2.1 | Dipendenza degli strumenti CSS e di configurazione (`postcss`, `css-tree`, `magicast`). Nessun endpoint pubblico per caricare sourcemap. | Verificare tutte le copie nel lockfile e aggiornare entro gli intervalli compatibili; controllare build e mappe generate. |
| `fflate` 0.7.3; `satori` 0.33.5 segnalato per propagazione | Satori fissa fflate 0.7.3; anche opentype lo usa. Open Graph nasce da testi e font locali. Non dimostrato l'ingresso di ZIP ostili nel percorso ordinario. | Preferire una versione di Satori che includa la correzione; un override richiede verifica di compatibilità. Il suggerimento automatico dell'audit propone anche un cambio incompatibile: non applicarlo alla cieca. |

Fonti degli avvisi: [sharp/libvips](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [libheif](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [librsvg](https://github.com/advisories/GHSA-wq5f-xc86-pv6w), [cache HTTP](https://github.com/advisories/GHSA-ch52-4w7c-c8xp), [sourcemap](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), [fflate ZIP64](https://github.com/advisories/GHSA-px8p-9vwx-vf98). La funzione citata dall'ultimo avviso è `unzipSync`: non tutti gli usi di compressione di fflate sono automaticamente quel percorso.

Sharp è concluso localmente. Per il seguito: transitive correggibili senza salto di versione, poi Satori e fflate, con confronto delle immagini. Per ogni gruppo: scegliere e motivare le versioni, leggere tutti i file dei pacchetti secondo le regole di Enrico prima di copiarli/installarli, ottenere l'OK all'aggiornamento, conservare lockfile e resoconto. Non usare `npm audit fix --force`.

Verifica richiesta dopo ogni gruppo: installazione pulita autorizzata con `npm ci --ignore-scripts`, audit del lockfile, test/build/link su Windows e CI Ubuntu; confronto visivo delle immagini prodotte e prova offline/aggiornamento se cambiano gli output. Un audit senza avvisi non sostituisce queste prove. Nessuna versione candidata viene qui presentata come già testata.

## Controllo dei tipi

`tsconfig.json` estende la configurazione strict di Astro, ma la build non esegue il controllo completo dei tipi. `node --experimental-strip-types` esegue i test rimuovendo le annotazioni: non è un compilatore che verifica la correttezza dei tipi. TypeScript e `@astrojs/check` non sono attualmente installati né dichiarati direttamente. [Astro: controllo dei tipi](https://docs.astro.build/en/guides/typescript/#type-checking).

Piano da autorizzare prima dell'installazione:

1. Rivedere versioni compatibili e tutti i file di `typescript` e `@astrojs/check`, con le loro dipendenze necessarie. Motivare l'aggiunta: trovare contratti errati fra dati, motore e pagine prima della pubblicazione.
2. Definire una configurazione applicativa che includa sorgenti Astro/TS, tipi generati e configurazione del sito; escludere `dist`, `node_modules`, bozze e prove storiche. L'attuale `include: ["**/*"]` è troppo ampio per considerarlo già un perimetro pulito.
3. Eseguire un primo controllo esplicito e registrare gli errori reali per modulo. Correggere prima motore e memoria; poi contratti DOM e componenti. Non nascondere errori in massa con `any` o disabilitazioni globali.
4. I moduli JavaScript del compositore richiedono un passo distinto: JSDoc e controllo graduale dei file, oppure conversione mirata a TS. Il solo `astro check` non va descritto come verifica completa dei file JS senza `checkJs`/annotazioni adeguate.
5. Aggiungere `npm run check` e renderlo obbligatorio in CI solo quando il perimetro scelto passa senza eccezioni opache. Non introdurre nel frattempo un comando che scarica strumenti automaticamente o produce un verde ignorando gli errori.

Questo blocco non ha eseguito un compilatore assente né modificato tsconfig. La suite e la build restano i controlli realmente disponibili.

## Cartelle e materiali da conservare

La mappa delle cartelle è nel README. L'audit sul commit main ha contato 2.143 file tracciati per 231,69 MiB; `design/` e `docs/` raccolgono circa l'88% del peso. È soprattutto materiale di progetto e verifica, distinto dalle risorse inviate al browser. Spostarlo sotto `archivio/` non ridurrebbe il peso o la storia Git.

In questo blocco si accorcia soltanto PROGRESS e si conserva la sua versione precedente nello storico. Nessuna proposta, immagine, ricerca, fonte, licenza o agente viene cancellato, spostato in massa o ignorato retroattivamente.

Per il successivo blocco di organizzazione:

1. Inventariare i risultati pesanti e distinguere sorgenti rigenerabili, prove decisive, confronti e copie ridondanti dimostrate.
2. Conservare in Git una sintesi con commit, versioni strumenti, comandi, esiti e limiti. Scegliere con Enrico una destinazione durevole per i risultati grezzi, con indice e hash; niente unica copia in artifact che scadono.
3. Verificare che i file siano recuperabili prima di rimuovere qualsiasi copia. Conservare tutte le decisioni e le licenze; nessuna riscrittura della storia Git implicita.
4. Poi uniformare gradualmente i percorsi degli script di verifica. Non rinominare insieme dati, moduli, URL e ID degli itinerari.

La rigenerazione dei dati esterni è distinta dalla build: alcuni generatori richiedono `curl`, `sleep`, Python/fontTools, feed ANM e servizi OSM/Copernicus. Le istruzioni dei dati sono in [aggiornamenti](../aggiornamenti/README.md); la build ordinaria usa gli output già presenti. La ricostruzione integrale da zero non è stata verificata.
