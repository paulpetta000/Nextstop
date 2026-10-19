# Aggiornamenti: da dove vengono i dati e come si rinnovano

_Creato il 03/10/2026 (idea di Enrico). Serve per **ricontrollare** i dati senza ricordare niente a memoria: si apre `fonti-dati.yaml`, si segue la riga del dato, si riscarica, si aggiorna._

## Controlli periodici di orari e accesso

Registro operativo preparato il 19/10/2026, su richiesta di Enrico, per i luoghi e i servizi già scelti. Per Codex e Claude Code il punto d'ingresso è la [procedura comune](PROCEDURA.md): controllare sia i collegamenti conosciuti sia nuove pagine, PDF, avvisi e rettifiche del gestore.

- [Registro dei controlli](controlli-periodici.yaml): 60 tappe/gite, 32 locali e 14 gruppi di trasporto; fonti collegate agli ID esistenti, canali di scoperta, frequenze e pubblicazioni attuali/future.
- [Rapporto iniziale](rapporti/2026-10-19-impostazione.md) e [dettaglio strutturato](rapporti/2026-10-19-impostazione.yaml): ricerca eseguita, prove limitate e problemi di accesso; non equivalgono all'aggiornamento completo degli orari.
- [Riesame esteso, compresa tutta la vecchia lista](rapporti/2026-10-19-accessi-estesi.md): bilancio cumulativo su 54 URL, con originali, alternative e casi ancora non leggibili distinti.
- [Ritentativo delle fonti del 19/10](rapporti/2026-10-19-ritentativo-fonti.md): accessi recuperati e alternative ufficiali; [verifiche personali residue di Enrico](../da-verificare/fonti-orari.md).
- [Modello di rapporto](rapporti/MODELLO.yaml) da copiare per ogni controllo richiesto; conservare i precedenti.

Richiesta breve: **«Controlla le fonti in scadenza e fammi un rapporto»**. Se vuoi applicare le variazioni confermate: **«Controlla le fonti in scadenza e aggiorna il progetto»**. Frequenza di riferimento: una settimana per i trasporti, due per luoghi/locali, prima se scade un documento o entra in vigore un cambio. Non è attivo un controllo automatico.

## Cosa c'è qui
- `fonti-dati.yaml`: l'elenco dei **dati che arrivano da un file o da un servizio** (bus ANM, strade OpenStreetMap, quote del terreno, risultati). Per ognuno: da dove viene, che licenza ha, come si riscarica (il comando), quali file del sito cambiano, fino a quando vale, quando va ricontrollato.
- Le **pagine web** (orari e prezzi di musei, parchi, trasporti, notizie della Coppa) **non sono qui**: stanno già in `src/data/fonti.yaml` (indirizzo, data di controllo) e nelle schede di `src/data/fatti.yaml` (campo `ricontrollare`). La build avvisa da sola quando una scheda è scaduta. In fondo a `fonti-dati.yaml` c'è il riepilogo delle scadenze.

## Come si aggiorna un dato (in breve)
1. Apri `fonti-dati.yaml` e trova la riga del dato.
2. Esegui il comando di «aggiorna» (di solito: scarica, poi costruisci).
3. `npm run build` e `npm run check:links`. Se la build dice che un testo è da rileggere, rileggilo e firma con `npm run testi:firma`.
4. Cambia in `fonti-dati.yaml` le date `controllato` e `valido-fino`, e `PROGRESS.md` in poche righe.

## Regole
- **Ogni dato scaricato da un file o da un servizio ha una riga qui.** Se ne aggiungi uno nuovo (per esempio i ristoranti o le esperienze), aggiungi anche la sua riga.
- Si cita la fonte sul sito, con la licenza quando la licenza lo chiede.
- Gli orari programmati non sono tempi reali: lo dice il testo del sito.

## Controllo automatico (idea, non ancora fatta)
Un controllo settimanale che riscarica i file con indirizzo fisso (ANM, Overpass) e ci avvisa se sono cambiati. Da decidere con una specifica (vedi `PROGRESS.md`). L'aggiornamento resta a mano: prima si avvisa, poi si decide.

Il registro e la procedura aggiunti il 19/10 organizzano i controlli **su richiesta**: non attivano questa eventuale automazione e non considerano sufficiente verificare che il vecchio URL sia invariato.
