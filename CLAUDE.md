# Nextstop · Claude Code

Sito statico Astro 7, Node >=22.12, in italiano. Enrico lavora anche con Codex.

- Leggi [regole comuni](docs/REGOLE.md) e [stato attuale](PROGRESS.md), poi solo i file del compito indicati nell'[indice](docs/README.md). Non caricare interi archivi, bozzetti, ricerche, skill o JSON grandi.
- Commit: `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit …`, senza cambiare la configurazione Git. Un solo assistente per ramo; commit prima del passaggio a Codex.
- Skill sorgenti in `.claude/skills/`, agenti in `.claude/agents/`; consulta solo quelli pertinenti. Le copie Codex in `.agents/skills/` restano identiche, con le licenze.
- Le regole condivise si aggiornano in `docs/REGOLE.md`; le particolarità di Claude Code restano qui. Codex usa `AGENTS.md`: non deve leggere o tradurre questa tabella di modelli.
- Comandi e struttura nel [README](README.md). Per Node portatile e controlli da telefono apri l'[ambiente locale](docs/AMBIENTE-LOCALE.md) solo quando serve; non presumere che strumenti dell'app o del cloud siano disponibili in Claude Code.

## Modelli, effort e agenti

Obiettivo: più lavoro corretto entro la quota, contando letture, deleghe, tentativi e correzioni. Nessun risparmio garantito dal nome del modello. Le istruzioni attuali di Enrico prevalgono sulle preferenze precedenti; restano valide le regole comuni su dati, controlli e autorizzazioni.

**Profilo:** Haiku, Sonnet e Opus con effort Medio, Alto o Extra, se disponibili. Non consigliare Basso o Max. Modello ed effort si scelgono separatamente: tutte le combinazioni del profilo sono ammesse, senza tre abbinamenti obbligatori, ma non sono tutte adatte a ogni compito. Le destinazioni sotto sono preferenze operative del progetto, non graduatorie universali di capacità o quota.

### Scegli per problema e fase

| Decisione | Criterio |
|---|---|
| Modello | Haiku per meccanica circoscritta con errori evidenti; Sonnet per lavoro definito e verificabile; Opus per ambiguità, diagnosi difficile o errori costosi da rilevare |
| Effort sul modello scelto | Medio per esecuzione definita; Alto per casi limite, diagnosi o revisione; Extra quando serve ragionamento più profondo, anche prima di fallimenti |
| Principale | Pianifica, integra e rilegge; mantieni la configurazione adeguata finché il lavoro o un problema concreto non giustificano una revisione |

Grafica, specifiche e struttura non impongono sempre Extra: valuta complessità, reversibilità e controlli; rispetta una configurazione prescritta per il compito corrente. L'effort è calibrato per modello, non rende equivalenti due famiglie. Non dedurre consumo Pro dal prezzo API o da un rapporto tecnico.

### Agenti e passaggi di consegna

- Ricerche ripetitive con fonti: `ricercatore`, Sonnet/Medio, incarico delimitato per gruppo indipendente. Salva risultati, fonti, date, deduzioni e limiti in `ricerca/`; mai completare a memoria una fonte assente. Il principale rilegge tutti i dati delicati, come orari e prezzi, e un campione del resto.
- Haiku può svolgere estrazioni, conteggi, copie, confronti e comandi intermedi delimitati con esito verificabile. Ricerche con fonti, testi editoriali del sito, grafica, revisione del codice e controlli finali restano affidati al principale o a Sonnet secondo il compito. Non sostituire con Haiku la delega Sonnet espressamente richiesta da Enrico.
- Controlli finali, prove ripetitive, immagini e anteprima: usa un esecutore Sonnet con obiettivo, file, comandi e criteri di successo espliciti. Alto se deve valutare anomalie o fare revisione; Medio se esegue soltanto una procedura già definita. Il principale rilegge gli esiti e le prove; non ripete controlli validi senza modifica, errore o dubbio concreto.
- **Rilascio ordinario già approvato:** affida l'esecuzione a Sonnet senza un altro OK soltanto per il modello. Medio per lavoro già concluso e verificato con procedura stabilita; Alto se restano revisione o diagnosi. Non scegliere Haiku per il rilascio finale in questo profilo. Usa un agente esecutore generale disponibile e con i permessi necessari: `revisore` non può modificare né committare e `ricercatore` scrive solo in `ricerca/`; non usarli per pubblicare.
- Il mandato di rilascio deve indicare cartella, ramo, commit approvato, destinazione, operazioni autorizzate, controlli già validi e ancora necessari. Distingui Artifact privato dei bozzetti, push del ramo, anteprima Vercel, merge su main e produzione. La delega non estende l'OK a un'altra destinazione o operazione. Non chiedere di nuovo consenso per passi già approvati e invariati; su divergenze, conflitti, nuovi cambi sostanziali o permessi mancanti affronta il problema o la decisione pertinente, senza risolvere fuori mandato. Un controllo preliminare rosso blocca i passi di rilascio che ne dipendono.
- Il resoconto del delegato è breve e verificabile: ramo/commit, operazioni realmente eseguite, controlli e relativi esiti, URL se autorizzati, anomalie e punto di arresto. Il principale lo rilegge prima di comunicare il risultato. Delega automatica non significa cambio del modello principale: coordinamento e rilettura consumano comunque quota.
- Usa solo agenti e strumenti disponibili; non creare agenti permanenti, installazioni o impostazioni per applicare questa regola. Scegli modello ed effort al lancio se il controllo lo supporta; se l'effort non è impostabile, dichiara il valore non verificato. Non affermare che il solo testo dell'incarico imposti tecnicamente l'effort.
- Un solo esecutore scrive sullo stesso ramo alla volta; niente commit concorrenti o file sovrascritti. Più agenti solo su parti indipendenti con confini espliciti. Considera il costo di avvio e contesto: per poche righe si può chiudere direttamente. Non avviare un agente o una chiamata modello per ogni comando Git; riusa procedure deterministiche già approvate.

### Problemi, cambi e arresto

Prima di ritentare identifica la causa: comando errato, permessi, rete, fonte assente, strumento interrotto oppure limite di ragionamento. Fonte assente e sito bloccato non si risolvono automaticamente salendo di modello. Correggi gli errori meccanici allo stesso livello; per un limite di ragionamento rivaluta modello o effort con contesto corretto e strategia diversa. Nessuna scala obbligatoria Haiku → Sonnet → Opus né numero fisso di fallimenti necessario per scegliere meglio.

Quando manca un dato scrivi «NON TROVATO» con tentativi e limiti. Registra i problemi irrisolti in `da-risolvere.md`, indicando cosa manca, tentativi e possibile ripresa; riassumili a fine blocco. Se impediscono l'obiettivo o coinvolgono un rischio pertinente, segnalali subito senza aspettare una soglia di casi. Concludi le attività indipendenti utili, rispettando il punto di arresto; non proseguire operazioni che dipendono da un controllo fallito.

Distingui configurazione osservata e consigliata. La prima richiesta usa il modello già selezionato. Proponi un eventuale cambio manuale sostanziale prima del lavoro pesante, attendendo la scelta; altrimenti procedi nel lavoro già autorizzato. Cambi diretti solo se autorizzati e supportati. Non chiedere cambi per una chiusura breve o per mostrare un consiglio. Un lungo tratto più semplice può giustificare meno effort; non programmare un ripristino automatico senza motivo.

Continua la chat se serve la cronologia; nuova chat per lavoro indipendente con passaggio breve sufficiente. La compattazione ha un costo iniziale e beneficio incerto: niente automatismi per percentuali, per un «continua» o per il solo suggerimento dell'app. Quote di sessione/settimana, contesto e statistiche tecniche sono indicatori distinti; misura soltanto quando cambia una decisione, senza lavoro ripetuto per benchmark.

Comunica modello/effort principale, eventuali deleghe e motivo concreto in italiano semplice, senza messaggi aggiuntivi soltanto per classificare. Segnala solo i conflitti pertinenti al prossimo passo. I consigli non riducono i controlli richiesti e non autorizzano main, merge, push, deploy o pubblicazione. Questa sezione è autosufficiente: se Enrico allega la guida quota, usala per i dettagli pertinenti senza caricare ricerche o duplicare le istruzioni a ogni turno.
