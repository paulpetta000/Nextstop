# Revisione codice 6 · recupero dagli errori

18 ottobre 2026. Seguito della revisione completa del codice, punto 3 del piano unico. Tre parti collegate nello stesso blocco: messaggi di recupero nel pannello, conservazione tramite Condividi, avvio quando manca il foglio di stile. Base locale f89d9a1, ramo codex/salvataggi-coordinati-2026-10-18.

## Problemi e comportamento

1. **Pannello «I miei itinerari».** La nota prometteva che gli itinerari rimanevano anche chiudendo la pagina persino durante una scrittura pendente o dopo un errore. Ora segue lo stato reale, anche se il pannello era già aperto: invita ad aspettare la conferma, distingue il conflitto dalla memoria non disponibile, descrive il recupero e chiarisce che il link non comprende visite/timbri. Il messaggio di errore è dentro il pannello, leggibile anche quando l'avviso principale è sotto il dialogo. Modificata solo la nota, senza ridisegnare il pannello o spostare i controlli.
2. **Condividi dopo conflitto.** Provata la funzione reale con memoria fittizia: il link contiene il percorso locale, la copia esterna non viene modificata e visite/timbri rimangono nella copia locale senza essere inseriti nel link. Verificati anche rifiuto della condivisione nativa, annullamento e copia negli appunti negata; in quest'ultimo caso il link viene selezionato per la copia manuale. Nessun cambiamento al formato o al codice di condivisione era necessario.
3. **Avvio senza stile completo.** Prima l'errore finiva soltanto in console; per chi aveva itinerari salvati i contenuti iniziali erano anche nascosti. Ora compare una spiegazione con Riprova, usando lo stile iniziale e il pulsante comune già disponibili. Dopo dieci secondi senza eventi l'attesa termina; il nuovo tentativo sostituisce il link con una copia allo stesso URL, compatibile con la chiave della cache offline. Il compositore parte solo dopo il caricamento riuscito e una sola volta. Un errore applicativo resta distinto da un errore del foglio; non viene ritentato come se mancasse il CSS.

## Verifiche eseguite ora

- Quattro prove del pannello fallite prima (promessa di persistenza e nota non aggiornata), riuscite dopo.
- Sei prove del recupero dello stile fallite prima; riuscite dopo, insieme alle cinque prove esistenti del caricatore.
- Quattro prove della funzione Condividi riuscite, con archivio esterno immutato e dati personali assenti dal link.
- Gruppo pannello/salvataggi/stati: 19 prove riuscite; gruppo stile/avvio: 11; condivisione: 4.
- **npm test: 267/267 test**, zero fallimenti, salti o cancellazioni. Prima del blocco erano 253.
- **npm run build:** 12 pagine generate, telemetria disabilitata, nessun rimedio --no-liftoff necessario.
- **npm run check:links:** 13 documenti HTML e **811 link interni validi**.
- Build offline ispezionata: foglio completo incluso nella precache, **82 risorse esistenti** e script pertinente ai recuperi incluso. È un controllo dei file prodotti, non una prova offline nel browser.
- git diff --check, rilettura delle modifiche e riferimenti documentali verificati. Nessun CSS, dato editoriale, ID, URL del prodotto, formato memoria o dipendenza cambiato.

Node 24.21.0 e dipendenze già presenti. Prove con EventTarget, elementi finti e funzioni reali; nessun browser, sessione Google o condivisione reale con persone. Nessuna installazione, delega, automazione, modifica alle protezioni, push, merge o deploy.

## Limiti

La comparsa, il caricamento effettivo del nuovo link, il fuoco della tastiera, i tempi percepiti e le larghezze 320/375/390/1280 non sono stati provati in un browser. Nessun nuovo axe o Lighthouse. Il pulsante riusa .btn globale (altezza minima 48 px e anello di fuoco esistente), senza cambiare colori o fogli di stile; nessun punteggio visivo assegnato. I dati già salvati non vengono toccati dal recupero dello stile, ma una nuova scrittura continua a richiedere Web Locks e può essere rifiutata in caso di conflitto. Non aggiunta una copia persistente delle visite né una fusione fra archivi.

[cloneNode, documentazione MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode): la copia conserva attributi e gestori dichiarati negli attributi; i listener del caricatore sono registrati nuovamente. Il link vecchio viene sostituito, senza duplicarne l'ID nella pagina e senza aggiungere parametri all'URL.

## Seguito e ordine

Resta attiva la revisione del codice già autorizzata (area 3): prossimo gruppo su sicurezza/privacy degli ingressi e controlli dei generatori, evitando di ripetere i blocchi conclusi. Il piano generale mantiene le otto aree originali: istruzioni Claude; dati/fonti; codice; Google/traffico; interfaccia; manutenzione; cartelle/codice; valore rispetto all'IA. La prova reale del consumo Claude rimane separata e successiva alla pubblicazione; nessuna configurazione di Claude modificata.

Enrico ha rinviato esplicitamente anche l'analisi e la stesura della nuova idea su più città e registro degli aggiornamenti: resta in coda al lavoro precedente. Non è stata redatta una proposta né implementato il sistema. Gli strumenti locali bastano per il seguito del codice; controlli nel browser e pubblicazione restano soggetti ai vincoli esistenti.
