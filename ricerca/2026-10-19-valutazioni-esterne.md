# Valutazioni esterne · ricerca di fattibilità del 19/10/2026

Scopo: media, conteggio e link per luoghi/ristoranti di Nextstop; nessun testo delle recensioni. Ricerca solo documentale e di codice esistente: nessun account usato o attivato, nessuna richiesta a API fatturate, nessun voto reale raccolto. La [proposta](../specifiche/valutazioni-esterne.md) traduce i risultati in un piano da approvare.

## Google Maps

Fonti primarie aperte e lette nei passaggi pertinenti:

- [Places API: regole SEE](https://developers.google.com/maps/comms/eea/places). Dal luglio 2025 l’account con indirizzo di fatturazione SEE ha regole specifiche. “With any Map” comprende associazioni visive o funzionali, non soltanto dati disegnati sopra la mappa. Le restrizioni indicate sulla pagina non si applicano al Places UI Kit; il solo spostamento in un pannello non è una soluzione dimostrata per l’API tradizionale.
- [Usi consentiti SEE](https://cloud.google.com/terms/maps-platform/eea-places-api-permitted-uses). Non assumere che ogni uso di dati Places sia consentito. Verificare caso concreto e contratto all’avvio.
- [Place Details Elements web](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-details). Componente standard e compatto; configurazione dei contenuti, incluso blocco del voto. Riletta durante la revisione: ordine dei contenuti predefinito, larghezza raccomandata 250–400 px; componente Advanced distinto e indicato preview. Da verificare nel pilota conteggio, configurazione dei soli contenuti richiesti, versione/canale, copie da template e utilizzo senza una seconda mappa. L’esempio con `gmp-map` non dimostra da solo l’esito su Nextstop.
- [Regole e attribuzioni](https://developers.google.com/maps/documentation/places/web-service/policies). Restrizioni su prefetch/cache/conservazione, eccezione per Place ID; attribuzione Google Maps e identificazione del contenuto. Non confondere logo della piattaforma e icona generica Google. La regola generale va letta con le condizioni SEE applicabili.
- [Place Details New](https://developers.google.com/maps/documentation/places/web-service/place-details). `rating` e `userRatingCount` sono campi della categoria Enterprise; la richiesta dei testi `reviews` è distinta e non necessaria all’obiettivo. `userRatingCount` conta valutazioni, non necessariamente recensioni testuali.
- [Listino globale](https://developers.google.com/maps/billing-and-pricing/pricing) e [definizione SKU](https://developers.google.com/maps/billing-and-pricing/sku-details). UI Kit Query: 10.000 gratuiti/mese, $1/1.000 nella prima fascia; il componente standard è fatturato per richiesta UI Kit, indipendentemente dai campi mostrati. Elementi Pro o chiamate Places aggiuntive possono introdurre altri SKU. Place Details Enterprise: 1.000 gratuiti/mese, $20/1.000 nella prima fascia. Prezzi in USD, quota gratuita condivisa secondo le regole dell’account.

Esito: fattibile in linea di principio con UI Kit web, non ancora provato su Nextstop. Nessuna promessa di riga personalizzata pienamente equivalente al componente ufficiale, di API gratuita o di cache settimanale permessa.

## Tripadvisor: usare Terra, non progettare sulla API legacy

- [Avviso di deprecazione Content API](https://tripadvisor-content-api.readme.io/reference/overview): la pagina dichiara che l’API precedente non è più aggiornata e rimanda a Terra. Questo ha cambiato la scelta della proposta.
- [Panoramica Terra](https://docs.terra.tripadvisor.com/docs/overview): piattaforma attuale per luoghi, ristoranti e altri contenuti, con diritti e disponibilità dipendenti dal pacchetto. La pagina è stata aperta e letta.
- [Multiple Locations Details](https://docs.terra.tripadvisor.com/reference/locationsget): endpoint di dettagli per più località; restituisce il medesimo tipo di dati ricchi della scheda singola, omettendo ID non esistenti o non autorizzati. Non confondere dati assenti con zero recensioni.
- [Location Details](https://docs.terra.tripadvisor.com/reference/locationget) e [changelog versione 1](https://docs.terra.tripadvisor.com/changelog/version-1-in-beta): recuperati nella revisione come testo indicizzato della documentazione ufficiale; l’apertura diretta continua a fallire/interrompersi. La prima pagina documenta `traveler_ratings.overall`, campi omessi se privi di dati e `404` anche per località fuori licenza. L’esempio del changelog espone `overall.rating`, `overall.count` e `overall.icon_url`, distinguendoli dai sotto-voti. Evidenza documentale più precisa della prima lettura; non è una risposta API autenticata né prova dei diritti del futuro account. Verificare versione corrente, scala, link e schema completo nel pilota; non assumere i vecchi nomi `num_reviews`.
- [Discover, prezzi per utilizzo](https://docs.terra.tripadvisor.com/docs/usage-based-pricing): 1.000 entità gratuite una tantum, non rinnovate mensilmente. Dopo l’esaurimento, prima fascia pubblicata $0,015 per entità; fasce successive $0,01350 / $0,01215 / $0,01094 / $0,00984 / $0,00900. Multi-GET non converte dieci luoghi in un solo elemento fatturabile. Il totale effettivo segue le regole di fatturazione e il pacchetto del cliente.
- [Caching Policy Terra](https://docs.terra.tripadvisor.com/docs/caching-policy): salvo contratto esplicito, non è permesso copiare, scaricare, conservare o indicizzare contenuti; eccezione per Location ID ai fini della velocità dell’applicazione. Questa pagina prevale su una deduzione generica dai suggerimenti di ottimizzazione. Nessuna autorizzazione a salvare i voti nei JSON statici di Nextstop.
- [Accesso e limiti](https://docs.terra.tripadvisor.com/docs/rate-limits): descrive quote, `429`, backoff e autorizzazioni. La pagina suggerisce caching secondo la policy, non una deroga ai divieti della policy.

Da chiudere prima dell’implementazione: requisiti correnti di branding, link, eventuali pulsanti ulteriori e contratto Terra applicabile al sito indipendente. La Linking Policy corrente non è stata letta con successo; lo schema singolo è stato recuperato solo dal testo indicizzato ufficiale, non dall’apertura diretta. L’indice `llms.txt` è risultato inaccessibile allo strumento. Non sostituire questi documenti con forum o intermediari. Le condizioni non verificate restano un criterio di arresto per l’integrazione dei numeri, non una nota da ignorare.

Consultate come **precedenti legacy**, non come condizioni Terra automaticamente applicabili: [Display Requirements](https://tripadvisor-content-api.readme.io/reference/display-requirements), con marchio e bolle ufficiali; [API Master Terms legacy](https://tripadvisor-content-api.readme.io/reference/api-master-terms-new), con vincoli su immagini remote e indicizzazione. Nessuna icona o immagine scaricata, nessun materiale grafico incorporato.

Esito: integrazione plausibile, subordinata a pacchetto, diritti e schema corrente. Non basare stime o sviluppo sulla vecchia Content API né sul vecchio prezzo suggerito da articoli esterni.

## TheFork

- [Introduzione B2B](https://docs.thefork.io/B2B-API/introduction), [avvio](https://docs.thefork.io/getting-started) e [autenticazione](https://docs.thefork.io/B2B-API/authentication): servizi per partnership e gestione ristoranti, credenziali rilasciate nel rapporto con il partner. Nessun accesso pubblico universale ai voti dimostrato dalla sola presenza della documentazione.
- [Elenco review](https://docs.thefork.io/B2B-API/API%20specifications/get-v-1-reviews): documenta un flusso autenticato. Non equivale alla concessione di un catalogo di medie/conteggi pubblicabili per tutti i ristoranti selezionati.
- [Condizioni della piattaforma](https://www.thefork.com/legal): individuate nella ricerca ufficiale; metodo e finestra delle valutazioni possono differire dalle altre piattaforme. Gli esempi pubblici TheFork usano una scala su dieci; non normalizzarla senza dichiararlo. La pagina legale completa non è stata usata come autorizzazione a ripubblicare dati.

Esito: collegamenti alle schede verificabili; numeri soltanto se un accordo/accesso consente questo specifico utilizzo. Prezzo applicabile a Nextstop e permesso del marchio non accertati. Nessuna richiesta inviata a TheFork o ai ristoranti.

## Riscontro nel repository

Base analizzata: commit `58cf855c730f499909b0177b8704d38931b1eb4e` del ramo delle fonti. `src/components/itinerari/Scheda.astro` e `SchedaLocale.astro` sono usati anche in template copiati nei pannelli; `src/content.config.ts` governa schede e dati. `src/scripts/itinerari/compositore/mappa.js` contiene attribuzione e collegamento OpenStreetMap. `src/pages/privacy.astro` descrive assenza di cookie e uso locale degli itinerari.

Conseguenze: non caricare SDK/rating per tutte le schede nascoste; verificare la compatibilità con la mappa; preservare il comportamento locale/offline; prevedere aggiornamento dell’informativa per servizi esterni realmente attivati. Modello dei dati, chiavi, componenti e schema delle pagine non sono stati modificati.
