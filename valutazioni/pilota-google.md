# Preparare il primo pilota Google

**Conservato per una fase futura: attività sospesa da Enrico, prima sito, itinerari e città.** Non configurare account o avviare questa prova adesso. Nessun account, chiave o fatturazione è stato creato. La scelta grafica rimane la fascia compatta sotto la foto, da verificare con il componente reale alla ripresa.

## Prima possibilità: prova senza fatturazione

Google documenta una [Maps Demo Key](https://developers.google.com/maps/documentation/javascript/demo-key), destinata a prove, senza dati di fatturazione e con pausa automatica al limite giornaliero. Richiede un account Google e l’accettazione delle condizioni da parte del titolare. Supporta UI Kit, ma esclude contenuti degli utenti come foto e recensioni: **non dare per dimostrata la disponibilità di media e conteggio** e non considerarla una soluzione per la produzione. Non riutilizzare chiavi trovate nei sorgenti di esempi di altri.

La demo può aiutare a provare struttura e tema; non risolve automaticamente il caso dei voti. Lo [strumento ufficiale di personalizzazione](https://developers.google.com/maps/documentation/javascript/places-ui-kit/customization-tool) permette di discutere ingombri e contenuti. Il suo rendering non è stato verificato nel browser cloud: errore di autorità del certificato tramite il proxy, senza disabilitare TLS.

## Prova con account ordinario, solo dopo budget e accesso

1. Il titolare configura un progetto dedicato e conferma l’indirizzo di fatturazione/condizioni applicabili, senza condividere credenziali in chat. Annotare nel registro di lavoro solo esistenza, responsabile e stato dell’accesso, non i segreti.
2. Verificare i requisiti correnti del [UI Kit](https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview) e abilitare soltanto le API richieste dal percorso scelto. Chiave per browser limitata ai siti di prova autorizzati e alle API effettive, secondo la [guida di sicurezza](https://developers.google.com/maps/api-security-best-practices). Nessuna chiave senza restrizioni e nessun carattere jolly che autorizzi siti di altri.
3. Definire quantità e soglia di arresto prima della prova: per esempio **massimo dieci istanze di componente** in una sessione controllata. È un limite proposto, non una quota già attivata. Consultare consumo gratuito disponibile e tutti gli SKU generati prima di dedurne il costo.
4. Le [quote UI Kit](https://developers.google.com/maps/documentation/javascript/usage-and-billing#places_ui_kit_usage_limits) sono distinte: il limite pubblicato di Query è 6.000/minuto/progetto; i limiti delle API sottostanti non controllano necessariamente questo utilizzo. Una quota al minuto e un avviso di budget non sono un tetto mensile in denaro. Verificare quali limiti sono effettivamente modificabili nell’account e come bloccare nuove istanze.
5. Partire da uno o due abbinamenti verificati. Il collegamento del gestore per 50 Kalò contiene un CID: non è stato presentato come un Place ID utilizzabile nel widget. Ricavare e verificare l’ID attraverso strumenti Google consentiti; confermare sede e parte prima della richiesta.
6. Montare un solo componente standard dopo l’azione prevista. Selezionare il voto attraverso la configurazione supportata, preservando attribuzione e collegamenti. Non istanziare una seconda mappa, caricare tutte le schede nascoste, usare Advanced/beta senza valutarlo o chiamare `fetchFields()` per ricostruire una riga propria.
7. Provare su 320/390 px e nei due temi: media **e** conteggio realmente visibili, sede corretta, nome accessibile, attribuzione leggibile. Misurare richieste, istanze e SKU. Il conteggio del laboratorio fittizio non misura la fatturazione Google; annullare una vista non annulla un costo già maturato.
8. Confrontare il risultato con l’immagine di Enrico. Il componente può occupare più spazio di voto + icona: se non consente la fascia desiderata, consegnare immagine della differenza e opzioni conformi prima dell’estensione. Nessuna estrazione dei numeri dal DOM interno.

## Consegna necessaria per integrare

Breve rapporto con versione/canale del componente, ID e parte verificati, diritti applicabili, foto del risultato nei due temi, comportamento prima/dopo il tocco e offline, richieste/SKU e limiti effettivi. Nessuna risposta completa del provider o chiave in Git/log. Non esportare automaticamente dati dei fornitori verso assistenti AI: i relativi diritti sono distinti dalla visualizzazione nel sito.

Solo dopo questa prova si decide il modulo di prodotto, l’informativa e il rilascio. Tripadvisor/TheFork restano soggetti ai loro vincoli indipendenti, descritti nello [stato](stato.md).
