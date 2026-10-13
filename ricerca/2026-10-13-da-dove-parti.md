# «Da dove parti?»: come fanno gli altri, dove trovare l'alloggio, quanti alloggi ci sono in OSM, quanto è più lungo il percorso a piedi

Domanda: per il pezzo nuovo «Da dove parti?» del compositore (alloggio / «Dove sono» / una tappa dell'elenco come punto di partenza) servono: (1) come lo fanno altre app, (2) le regole per trovare un indirizzo senza servizi nostri, (3) quanti alloggi di Napoli ci sono su OpenStreetMap, (4) di quanto il percorso a piedi vero supera la linea d'aria.
Data: 13/10/2026. Chi: agente ricercatore, Sonnet.
Come leggere le etichette: **[V]** = visto da me nella pagina (indirizzo accanto); **[R]** = riassunto di una ricerca web, non letto da me nella pagina; **[D]** = deduzione mia (sempre nella sezione finale o segnata). Tutto è di fonte primaria (aiuto/documentazione/regole del servizio) salvo dove scritto. Non ho usato account, non ho installato nulla, non ho toccato file fuori da `ricerca/`.
Strumenti: ricerca web e lettura pagine; per le pagine che la lettura web rifiutava (403) o che servono dati grezzi ho usato `curl` in lettura (con un normale User-Agent da browser) e per i conteggi Overpass uno script Node già presente sul computer. Nominatim e Photon: una sola richiesta di prova a testa (sezione 2); Overpass: i tentativi sono elencati nella sezione 3. Nelle ricerche con `curl` ho cancellato nella cartella temporanea di sessione due file `alloggi.json` e `alloggi2.json` (695 byte, già presenti, che erano pagine di errore 504 come le mie): niente nel progetto.

---

## 1. Come fanno le altre app (solo aiuto/documentazione e pagine pubbliche)

### Wanderlog
- **Alloggio**: nelle pagine viste **non c'è un campo «dove dormi» per tutto il viaggio**. La FAQ dice, per vedere la distanza tra l'hotel e la prima/ultima tappa del giorno: «aggiungi l'alloggio come prima e ultima tappa del giorno», cioè **a mano, giorno per giorno**; l'aggiunta automatica era «coming soon». [V] https://wanderlog.com/blog/faq/ (pagina senza data visibile: può essere superata).
- Le prenotazioni di hotel si importano inoltrando l'email di conferma o collegando Gmail. [V] stessa FAQ. Il pulsante «hotel» sulla mappa serve a **cercare e prenotare** (prezzi aggregati), non a fissare la partenza. [V] https://help.wanderlog.com/hc/en-us/articles/13355633360155-Find-hotels-to-book (03/03/2023).
- **Come si cerca l'alloggio** (nome/indirizzo/mappa): NON TROVATO nelle pagine di aiuto lette.
- **Ottimizza l'ordine**: «Optimize route», **solo per membri Pro**, **un giorno alla volta**, «fino a 15 posti» (FAQ). Si apre dal pulsante sotto/accanto alla data. Passo 4 dell'aiuto: *«Select the preferred beginning and end points for your day. Select "Auto-suggest" if you don't have a preference.»* (cioè **inizio e fine si scelgono e restano fermi**; se non scegli, decide lui). Fatta l'ottimizzazione: *«See what's changed or revert back by clicking the banner»* (c'è un **annulla** nel banner). [V] https://help.wanderlog.com/hc/en-us/articles/13545624787867-Optimize-route (10/03/2023, letta con curl perché WebFetch dava 403).
- **Il giorno finisce all'alloggio?** Solo se tu lo metti come ultima tappa o come punto finale (vedi sopra). Non c'è un interruttore «torna all'hotel» (nelle pagine viste).
- **Tempi**: tra due posti consecutivi *«we calculated for you the time it would take to go from one place to the next. You can choose between driving, walking, or public transit»*; si cambia modo toccando il tempo/distanza. [V] https://help.wanderlog.com/hc/en-us/articles/5159565134875-See-time-and-distance-between-places (04/03/2023). Il tempo totale del giorno sta «sotto l'intestazione del giorno»; sulla mappa ci sono «linee tra i posti», mentre «Directions» apre Google Maps dove si vedono i percorsi veri. [V] FAQ.
- **Stimato contro vero**: non c'è un segno speciale nelle pagine viste; c'è solo l'ammissione *«We're sorry about some travel time estimates being extremely wrong»* e il fatto che in Giappone i tempi non ci sono. [V] https://help.wanderlog.com/hc/en-us/articles/13301772286491-Travel-time-estimates-not-accurate-or-not-available (01/03/2023).

### Google Maps (indicazioni con più tappe; liste)
- **Partenza**: di base «La tua posizione»; si clicca su «Your location» in cima al pannello per modificarla. **Tappe**: «Add destination» sotto le destinazioni; **massimo 9 tappe, compresa la destinazione finale**; vale per tutti i modi **tranne mezzi pubblici e aereo**; si **riordina trascinando**. Ogni percorso mostra «un tempo di viaggio stimato» sulla mappa. La pagina **non dice** se riordina da sola le tappe. [V] https://support.google.com/maps/answer/144339 (versione computer).
- **«Ottimizza ordine»**: nell'aiuto per utenti **non l'ho trovato** (NON TROVATO). Esiste invece nella documentazione per sviluppatori: con `waypoints=optimize:true|…` il servizio *«rearranging the waypoints in a more efficient order»* (problema del commesso viaggiatore), «Travel time is the primary factor»; **`origin` e `destination` restano dove sono** (l'esempio ha `origin=Adelaide` e `destination=Adelaide`, cioè un giro chiuso con partenza e arrivo uguali); l'ordine nuovo torna in `waypoint_order`; «All waypoints must be stopovers»; costa di più. [V] https://developers.google.com/maps/documentation/directions/get-directions (Directions API «Legacy»).
- **Segnalazione sui tratti a piedi**: *«Both walking and bicycling directions may sometimes not include clear pedestrian or bicycling paths, so these directions will return warnings … which you must display to the user.»* (obbligo di mostrare l'avviso). [V] stessa pagina.
- **Liste («I tuoi luoghi» / «Saved»)**: liste private o condivise, **fino a 3.000 voci**. [R] https://support.google.com/maps/answer/7280933 (sunto della ricerca; non ho trovato scritto che da una lista si ricavi un percorso a più tappe: NON TROVATO).
- **Simboli del tratteggio**: non ho trovato nell'aiuto la legenda delle linee del percorso a piedi (NON TROVATO; la pagina «Use layers…» https://support.google.com/maps/answer/3092439 spiega, secondo il sunto della ricerca [R], solo bici, sentieri e chiusure stradali).

### Visit A City
- **Pagine d'aiuto/documentazione primarie: NON TROVATO.** Il sito è un'app che si disegna col JavaScript: `/en/faq`, `/en/help` danno 404, le pagine degli itinerari (es. https://www.visitacity.com/en/barcelona/itinerary-by-day/1) restituiscono il guscio senza testo, e la lettura web ha dato «having some trouble loading». Un'indicazione nel titolo della pagina di Barcellona: «Create Your Itinerary From Scratch With Optimized Daily Routes». [R]
- La scheda dell'App Store non parla di hotel né di ottimizzazione (solo «Create a customized itinerary…»). [V] https://apps.apple.com/us/app/visit-a-city/id985996026
- Solo fonti **non primarie** (recensioni/blog, anche del 2017-2019): l'hotel si inserisce con le date; il sito ordina le visite per vicinanza e orari; un utente ha scritto di aver sostituito l'hotel con l'indirizzo del porto e di **non aver potuto mettere hotel diversi in giorni diversi**. [R] https://yourmileagemayvary.com/2019/07/27/know-where-youre-going-but-need-help-with-an-itinerary-try-visitacity ; recensione App Store. Da non citare come fatto.

### Sygic Travel / Tripomatic
- **Alloggio**: si apre la scheda dell'hotel, «Add to trip» e **si scelgono le notti**: l'alloggio è quindi assegnato **notte per notte** (un hotel diverso per notti diverse è possibile). [V] https://support.tripomatic.com/hotels-and-tours/working-with-hotels.html (la pagina non parla di partenza né di percorso).
- **Ottimizza ordine**: nella pagina «Working with the itinerary» **non c'è** nessun «Optimize»: si riordina **trascinando** (tenere premuto e trascinare) e si sposta un'attività in un altro giorno con «Reschedule». [V] https://support.tripomatic.com/editing-your-trip/working-with-the-itinerary.html
- **Inizio del giorno**: non descritto. **Tempi**: toccando l'icona tra due attività si cambia il modo (a piedi, auto, bici, scooter, taxi, mezzi); *«The app automatically calculates travel times based on your chosen transport mode»*; c'è un modo predefinito per il giorno; il totale stimato del giorno somma visita + trasferimenti, e i trasferimenti di durata ignota (voli) sono **esclusi** dal totale. [V] stessa pagina.
- **Mappa del giorno**: «Route lines … show the path between activities», icone del modo per ogni tratto; la pagina **non dice** stile della linea né minuti sulla mappa. [V] https://support.tripomatic.com/on-the-road/how-to-see-my-itinerary-for-the-day-on-the-map.html
- Blog e App Store dicono che «ottimizza da solo il percorso» e che l'hotel «compare in ogni giorno»: **non confermato dall'aiuto ufficiale** (fonte secondaria). [R]

### Roadtrippers
- **Partenza**: si sceglie all'inizio (campi partenza/destinazione); si consiglia di **salvare l'indirizzo di casa nel profilo** perché ogni viaggio nuovo parta da lì. Per cambiarla: si aggiunge la tappa giusta con «Add to Trip» (si cercano «città, indirizzi o punti di interesse»), si toglie la vecchia, si **trascina in cima**. [V] https://support.roadtrippers.com/hc/en-us/articles/200632079-Planning-a-Trip-on-Our-Website (10/07/2026; letta con curl perché WebFetch dava 403).
- **Alloggio ogni notte**: *«add that location to each day you'll be there. This helps Roadtrippers correctly route your trip from that overnight stop each morning»* (le date indicano l'arrivo, non la durata): **si aggiunge il posto a ogni giorno, a mano**. [V] https://support.roadtrippers.com/hc/en-us/articles/37139075548564-Staying-at-the-same-place-for-multiple-days (11/09/2026).
- **Il giorno finisce dove è partito?** C'è «Make Round Trip» (Opzioni di percorso > Alter route): *«adds your starting point as the final destination, turning your one-way trip into a loop»*. È un **bottone esplicito**, non attivo di base. [V] https://support.roadtrippers.com/hc/en-us/articles/360028788191-Round-Trip (06/03/2026).
- **Ottimizza ordine**: nelle pagine d'aiuto lette **non c'è** un tasto: le tappe si riordinano **trascinando**; «per impostazione predefinita traccia il percorso più efficiente» riguarda la strada, non l'ordine delle tappe. [V] pagina sopra. (La ricerca web riporta che «pianifica l'ordine più efficiente» ma non l'ho trovato scritto nell'aiuto: non verificato.)
- **Tempi**: strumento «Measure» (quanto vuoi guidare da una tappa → mostra il punto sul percorso). [V] https://support.roadtrippers.com/hc/en-us/articles/34399213711124-Measure-Drive-Time-From-Waypoints (27/07/2026). Niente sui segni stimato/vero.

### TripIt
- **Alloggio**: è un «piano» di tipo *lodging* aggiunto al viaggio («Add a Plan») o importato dalla email; il viaggio ha **una sola destinazione principale** («You can only specify one primary destination»). [V] https://help.tripit.com/en/support/solutions/articles/103000063431-add-a-new-trip-on-the-tripit-website
- **Punto di partenza/arrivo**: lo «Navigator» (nell'app) lascia scegliere partenza e/o arrivo tra **gli indirizzi dell'itinerario (hotel compreso) o la tua posizione attuale**; poi «Find Transportation Options» mostra *«estimated costs and travel times for each option (when available)»* e apre l'app di mappe. Posti personalizzati: dice che prima non c'erano (li dà Google/Apple Maps). [V] https://help.tripit.com/en/support/solutions/articles/103000063354-navigator
- **Ottimizza ordine**: NON TROVATO (TripIt non ordina le tappe). «Map View» con un segnaposto per piano: [R] solo dal sunto della ricerca, non letto.

### Komoot (punto di partenza)
- **Partenza/arrivo**: clic sulla mappa → «Start Here», oppure si cerca un luogo o **un indirizzo**, oppure si scrivono **le coordinate** (es. `52.520817, 13.409450`). [V] https://www.komoot.com/help/routeplanner e https://support.komoot.com/hc/en-us/articles/10268757747738-Advanced-route-planning (letta con curl)
- **Ordine**: i punti intermedi si **trascinano su/giù nella lista**; «Add to Route» sulla mappa *«will automatically add and sort the new waypoint at the best possible spot»* (inserimento al posto migliore, non un riordino totale). **Round Trip** = *«bring you back to your starting point using the fastest route»*; con solo partenza e arrivo «spesso è andata e ritorno». C'è «inverti l'ordine». [V] https://support.komoot.com/hc/en-us/articles/10194270667034-Plan-routes-on-the-website e https://support.komoot.com/hc/en-us/articles/10207909543066-Change-the-route-direction-and-type (aggiornata 26/02/2026)
- **Quando non sa la strada**: i tratti «off-grid» *«Appear as straight, dotted lines between waypoints»* (**linea dritta a puntini**) e la navigazione dice di seguire la mappa. [V] pagina «Advanced route planning». Il profilo mostra «distance, estimated duration, difficulty». [V] pagina «Plan routes on the website»
- Alloggio: nessuna idea di «alloggio» nel piano (è solo un «luogo di interesse» da mettere sulla mappa).

### Citymapper
- Non è un compositore di itinerari a più tappe: **NON TROVATO** nulla su alloggio, più tappe o «ottimizza» nell'aiuto (solo notizie e SDK).
- **Tempo vero contro tempo da orario**: i tempi in tempo reale hanno un **simbolo giallo ondulato che lampeggia** («travel time is real»); prima i tempi erano presi dagli orari. [V] https://citymapper.com/news/1151/realtime-travel-times
- I tempi di coincidenza usano «una velocità media a piedi» e c'è una etichetta «tight transfer». [R] sunto di notizie di Citymapper.
- Per i percorsi a piedi in tutto il mondo dice di usare «viaggi reali dell'app» per prevedere meglio i tempi; non spiega come li mostra. [V] https://citymapper.com/news/2521/our-global-walk-routing

### Tabella di confronto (cosa ho visto, no deduzioni)
| App | Alloggio | Una volta o per giorno | Torna all'alloggio | «Ottimizza» e inizio/fine fermi | Stimato contro vero |
|---|---|---|---|---|---|
| Wanderlog | tappa del giorno (a mano) | per giorno | solo se lo metti come ultima tappa/fine | sì, Pro, 1 giorno, ≤15 posti; scegli inizio e fine; banner con «annulla» | nessun segno; ammette stime «molto sbagliate» |
| Google Maps | nessun campo alloggio nell'aiuto letto | — | solo se la destinazione è il punto di partenza | UI: non trovato; API: sì, origine e destinazione ferme | «tempo stimato»; avvisi obbligatori sui tratti a piedi (API) |
| Visit A City | non verificabile | — | — | non verificabile | non verificabile |
| Tripomatic | scheda hotel, «Add to trip» con le notti | per notte | — | no (trascini) | totale «stimato»; esclude i tratti ignoti |
| Roadtrippers | posto aggiunto a ogni giorno | per giorno, a mano | bottone «Make Round Trip» | no (trascini) | niente |
| TripIt | piano «lodging» | per viaggio | — | no | «travel times (when available)» |
| Komoot | nessun campo alloggio (solo «luogo di interesse») | — | «Round Trip» | inserimento nel posto migliore, non riordino | linea **dritta a puntini** quando non conosce la strada |
| Citymapper | non trovato | — | — | non trovato | simbolo giallo lampeggiante = tempo reale |

---

## 2. Trovare un indirizzo/hotel senza servizi nostri: regole di Nominatim e Photon

### Nominatim (server pubblico di OpenStreetMap)
Fonte: pagina ufficiale «Nominatim Usage Policy (aka Geocoding Policy)» https://operations.osmfoundation.org/policies/nominatim/ (letta il 13/10/2026 con curl e riletta parola per parola).
- **Limite**: «No heavy uses (an absolute maximum of **1 request per second**)». [V]
- **Identificazione**: «Provide a valid HTTP **Referer or User-Agent** identifying the application (stock User-Agents as set by http libraries will not do).» [V]
- **Attribuzione**: «Clearly display attribution as suitable for your medium.» I dati sono ODbL, con «share alike» (le piccole estrazioni «likely» rientrano nell'uso corretto). [V]
- **Siti e app**: l'uso «directly triggered by the end-user (for example, user searches for something) is ok, provided that your number of users is moderate»; i limiti valgono **per sito**, sommando tutti gli utenti; le app «must make sure that they can switch the service at our request at any time … without requiring a software update»; se possibile «set up a proxy and also enable caching»; le richieste periodiche delle app sono «bulk geocoding … strongly discouraged». [V]
- **Autocompletamento: vietato.** Tra gli usi «strictly forbidden and will get you banned»: «**Auto-complete search** … is not yet supported by Nominatim and you must not implement such a service on the client side using the API.» [V]
- Vietati anche: richieste sistematiche («downloading all POIs in an area»), lo scaricamento automatico della pagina dei dettagli, la rivendita di risultati di geocodifica. [V]
- **Privacy**: «Please do not submit personal data or other confidential material to any of our services.» [V]
- **Cambiamenti**: la regola «may change without notice», l'accesso può essere ritirato. Clausola sugli LLM: il codice generato deve rispettare la regola; le piattaforme no-code/vibe-coding non devono includere l'API pubblica come servizio generico. [V]
- **Prova mia (1 richiesta, 13/10/2026 17:59 UTC, User-Agent identificato)**: `search?q=Grand+Hotel+Excelsior+Napoli&format=jsonv2&limit=2&addressdetails=1` → 200; header `access-control-allow-origin: *` (si può chiamare dal browser); risposta con `licence: Data © OpenStreetMap contributors, ODbL 1.0` e il Grand Hotel Excelsior (tourism=hotel, 40.83005, 14.24990, via Nazario Sauro). [V]
- **Il nostro `vercel.json`** manda già `Referrer-Policy: strict-origin-when-cross-origin` (anche sulle pagine degli itinerari): una richiesta del browser a un altro sito porta come Referer l'origine del nostro sito, quindi il requisito «valid Referer» è soddisfatto. [V] `vercel.json` del progetto.

### Photon (komoot)
Fonti: https://github.com/komoot/photon (README) e https://photon.komoot.io/ (13/10/2026). Non c'è una pagina di condizioni d'uso separata.
- Testo, sezione «Demo server»: «You are welcome to use the API for your project as long as the number of requests stay in a reasonable limit. **Extensive usage will be throttled or completely banned.** We do not give guarantees for availability and reserve the right to implement changes without notice.» Per molte richieste consigliano un'istanza propria. [V]
- **Nessun numero** di richieste; **nessuna riga su attribuzione**, uso commerciale o autocompletamento per il server pubblico. La licenza Apache 2.0 riguarda il programma, non i dati del servizio. «search-as-you-type» compare solo tra le funzioni del programma. [V]
- Il programma sa filtrare per etichetta OSM e per rettangolo, e spingere i risultati verso un punto (utile per «solo hotel a Napoli»). [V] README, «Features».
- **Prova mia (1 richiesta)**: `https://photon.komoot.io/api/?q=Grand+Hotel+Excelsior+Napoli&limit=2` → 200, `Access-Control-Allow-Origin: *`, `Cache-Control: max-age=3600`; primo risultato lo stesso Excelsior (osm_key tourism / osm_value hotel). [V]

---

## 3. Alloggi di Napoli su OpenStreetMap

### Come ho fatto
- Query esatta (con rettangolo come richiesto): `[out:json][timeout:90];nwr["tourism"~"^(hotel|guest_house|hostel|apartment)$"](40.79,14.13,40.92,14.36);out tags center;`
- Server: `https://overpass-api.de/api/interpreter` (POST). Per contare ho usato `curl` e uno script Node invece di WebFetch, perché WebFetch riassume il testo e non è affidabile per contare.
- **Tentativi**: WebFetch GET su overpass-api.de → 504; curl POST → 504 (due volte); una query solo «conteggio» → «runtime error … Dispatcher_Client::request_read_and_idx … timeout»; overpass.private.coffee → nessuna risposta in 60 s e in 100 s; overpass.kumi.systems → nessuna risposta in 100 s; overpass.openstreetmap.fr → 403. Un ciclo automatico (4 server × 4 giri, 45 s di pausa) è riuscito **al secondo giro su overpass-api.de**: HTTP 200, 133.786 byte, `timestamp_osm_base` **2026-10-13T17:57:56Z**, Overpass 0.7.62.
- Il rettangolo prende anche pezzi fuori dal Comune (Pozzuoli, Portici, Ercolano…). Ho quindi rifatto la stessa ricerca **limitata ai confini del Comune** (area amministrativa con `ref:ISTAT=063049`, HTTP 200, 121.559 byte, `timestamp_areas_base` 2026-10-12T15:16:01Z). Le due colonne sotto.

### Numeri
| | Rettangolo (come chiesto) | Solo Comune di Napoli |
|---|---|---|
| **Totale** | **481** | **441** |
| hotel | 212 | 188 |
| guest_house (B&B, affittacamere…) | 227 | 213 |
| hostel | 19 | 17 |
| apartment | 23 | 23 |
| con nome (`name`) | 464 (96,5 %) | 428 (97,1 %) |
| senza nome | 17 | 13 |
| con via (`addr:street`) | 193 (40 %) | 174 (39 %) |
| con via + numero civico | 189 | 171 |
| con sito web | 127 | 115 |
| con telefono | 110 | 97 |
| con stelle (`stars`) | 37 | 29 |
| punti / aree / relazioni | 418 / 57 / 6 | 394 / 42 / 5 |
Altro (solo rettangolo): `addr:city` presente solo su 126 voci (Napoli 109, Pozzuoli 10, Ercolano 4, Portici 1, Cercola 1, Casoria 1); solo 3 nomi si ripetono; 80 voci (nel Comune) hanno una `check_date` tra il 30/06/2022 e il 03/10/2026, cioè qualcuno le controlla; tra i `guest_house` del Comune 132 su 213 hanno «B&B/bed/breakfast/BB» nel nome. [V] calcoli miei sul risultato dell'API.
Indicativo (riquadro mio, Chiaia–Centro storico–Stazione, lat 40,835–40,862 e lon 14,235–14,285): 361 delle 441 voci del Comune (82 %) stanno lì dentro.

### Peso di un elenco «nome + coordinate»
Misurato sul risultato vero (JSON a righe `[nome, lat, lon]`, 5 decimali):
| Contenuto | Righe | Peso grezzo | Per voce | gzip | brotli |
|---|---|---|---|---|---|
| Rettangolo, nome + coordinate | 464 | 18,2 KB | 39 byte | 6,8 KB | 5,7 KB |
| Rettangolo, + via e civico | 464 | 23,8 KB | 51 byte | 8,5 KB | 7,3 KB |
| Solo Comune, nome + coordinate | 428 | 16,9 KB | 39 byte | 6,2 KB | 5,3 KB |
| Solo Comune, + via e civico | 428 | 21,8 KB | 51 byte | 7,8 KB | 6,7 KB |
Con 4 decimali (11 m di precisione) il peso scende di circa il 5 %. La tua stima di 60 byte a voce era prudente: **il vero è 39 byte senza indirizzo, 51 con**. Per confronto, 481 × 60 = 28,9 KB. [V] calcoli miei.

### Quanta parte del mercato copre OSM
- **Fonte ufficiale**: «Secondo i dati forniti dal **Comune di Napoli**, nel **2024** risultano censite **6.168 strutture ricettive extralberghiere** (tra cui bed and breakfast, affittacamere e case vacanze)». È scritto in una nota della **Regione Campania** (Direzione Generale Governo del Territorio, PG/2025/0249585 del 19/05/2025, risposta all'interrogazione R.G. 1048 della consigliera Muscarà sull'ex ostello di Mergellina) in https://www.cr.campania.it/crccmsintegrationservices/rest/services/documentale/prendiAllegatoDocumento?id=359798 . **[R]**: la frase mi è stata riportata due volte dallo strumento di ricerca che ha letto il PDF; io ho provato a leggerlo ma il mio estrattore non è riuscito a decodificare quel passaggio, quindi **conviene che Enrico o un controllo successivo riapra il PDF** prima di scriverla sul sito.
- **Confronto**: in OSM, dentro il Comune, `guest_house` + `apartment` + `hostel` = 213 + 23 + 17 = **253**, cioè circa **4 %** di 6.168 (3,8 % senza gli ostelli). Gli **alberghi** (188 in OSM): NON TROVATO il numero ufficiale dei soli alberghi di Napoli (cercato in Comune, Regione, ISTAT, Federalberghi: solo dati nazionali ISTAT 2024 e tabelle provinciali del 2012). L'ISTAT ha i dati per comune («Capacità degli esercizi ricettivi», Napoli = codice 063049, banca dati I.Stat) ma non sono riuscito ad aprire le tabelle.
- Contesto sul mercato: l'associazione AIGAB Napoli dice di rappresentare circa 1.200 strutture extralberghiere regolari [R] (fonte di categoria, non ufficiale); il Consiglio comunale ha approvato (15/09/2026, secondo La Sicilia) un tetto del 30 % di immobili ricettivi per edificio nel centro storico, non retroattivo [R]. Entrambe da non usare senza aver letto la fonte.

---

## 4. Fattore di deviazione a piedi (percorso a piedi / linea d'aria)

1. **Boeing, G. (2019), «The Morphology and Circuity of Walkable and Drivable Street Networks»** (capitolo in *The Mathematics of Urban Morphology*, Birkhäuser; versione arXiv https://arxiv.org/abs/1708.00836 , PDF letto). 40 città degli Stati Uniti, circa 4 milioni di percorsi simulati su dati OpenStreetMap, rapporto «distanza sulla rete / distanza in linea retta». Tabella 1: per i percorsi **a piedi** il valore va da **1,142** (Manhattan) a **1,487** (Salem, MA, centro storico antico); **media 1,27 e mediana 1,26 sulle 40 città** (media fatta da me sui valori della tabella); esempi: Chicago 1,178, Boston 1,191, St Augustine (FL) 1,331, Portland (ME) 1,347. I percorsi misurati sono lunghi (da 3,9 a 27,9 km, mediana 11 km): **non sono i tratti brevi di una giornata di visite**. [V]
2. **Giacomin, D. e Levinson, D. (2015), «Road network circuity in metropolitan areas»**, Environment and Planning B 42(6), 1040-1053, doi 10.1068/b130131p. Dice che **«short trips are more circuitous than long trips»** e propone una funzione di decadimento con la distanza. Sono strade per auto (51 aree urbane USA), non a piedi, e **non sono riuscito a leggere i valori** (testo completo a pagamento): NON TROVATO il numero. [R] https://experts.umn.edu/en/publications/road-network-circuity-in-metropolitan-areas/
3. **Studio sui percorsi a piedi verso un parco di Nanjing** (Int. J. Environ. Res. Public Health 2020, 17(13), 4826, doi 10.3390/ijerph17134826; testo letto da Europe PMC). Definisce il «pedestrian route directness (PRD)» come rapporto tra distanza del percorso e distanza in linea d'aria. Scrive: «In some western cities, the PRD in well-connected grid areas is generally **less than 1.3**». Misura con i percorsi a piedi di Baidu Maps: **PRD medio 1,96 entro 500 m e 1,58 entro 1.000 m** dal parco (con il metodo del cerchio in linea d'aria; con il metodo dei percorsi reali 1,57 e 1,56). **Più si è vicini, più il rapporto cresce.** [V] https://pmc.ncbi.nlm.nih.gov/articles/PMC7369879
4. **Il nostro dato** (non è una fonte esterna, ma è la misura più vicina al problema): in `ricerca/2026-10-13-stima-tempi-partenza.md`, su 7.392 coppie di punti di Napoli a più di 150 m, percorso a piedi / linea d'aria: **mediana 1,27**; sotto 1 km **1,32**, oltre 3,5 km 1,26; **19,3 minuti per km di linea d'aria** (salite e scale comprese). [V] file del progetto.
- Nessuna di queste fonti dà un fattore unico per «tratti brevi in una città storica»: NON TROVATO uno studio sul solo tratto breve a piedi (< 1 km) in un centro storico europeo.

---

## Cosa ne deduco (mie deduzioni, [D])

**1. Come lo fanno gli altri**
- Tra le app di cui ho potuto leggere l'aiuto (tutte tranne Visit A City) nessuna tratta l'alloggio come un unico punto «da dove parti» valido per tutti i giorni: lo mettono **come una tappa o come un piano** (Wanderlog: prima e ultima tappa del giorno, a mano; Roadtrippers: lo stesso posto aggiunto a ogni giorno; Tripomatic: scelta delle notti; TripIt: piano «lodging»). Chiedere «Da dove parti?» una volta sola e usarlo per tutta la giornata è **più leggero** di quello che fanno loro.
- Dove esiste «ottimizza» (Wanderlog Pro; Directions API di Google), **inizio e fine restano fermi** e il riordino è su un giorno solo; Wanderlog propone con un banner e permette di **tornare indietro**. Questo somiglia molto a «C'è un ordine più corto… Usa questo ordine / Annulla / Lascia così» già nella specifica.
- Il ritorno al punto di partenza è sempre una **scelta esplicita** (Roadtrippers «Make Round Trip», Komoot «Round Trip», Wanderlog «scegli la fine», Google: destinazione uguale all'origine). «Torno lì alla fine», spento di base, è in linea.
- Su **stimato contro vero** nelle pagine di aiuto non ho trovato il segno «≈» né «circa» in nessuna app. Quello che c'è: parola «stimato» (Google, Tripomatic), **linea dritta a puntini quando non si conosce la strada** (Komoot, off-grid), **simbolo che marca il tempo vero** (Citymapper), **avviso obbligatorio sui tratti a piedi** (Google API), ammissione di stime a volte molto sbagliate (Wanderlog). La nostra idea («circa 15 min» arrotondato + parola «stima» + linea dritta a puntini + «stima incerta» lontano dalle tappe) **ha un precedente per la linea a puntini e va oltre gli altri nelle parole**. Limite: ho letto aiuto e documentazione, non ho aperto le app: l'interfaccia può avere segni che l'aiuto non cita.
- Il punto «Dove sono» con il GPS è comune: Google Maps parte da «Your location», TripIt Navigator offre «your current location».

**2. Trovare l'alloggio**
- **Nominatim pubblico**: l'uso con un tocco (cerca quando premi un tasto, un'unica richiesta) è ammesso se gli utenti sono pochi; l'**autocompletamento mentre si scrive è vietato** (rischio di blocco). Servono: attribuzione OSM visibile, Referer valido (già garantito dal `Referrer-Policy` di `vercel.json`), un interruttore per spegnere il servizio senza rilascio nuovo, ricordare in memoria le risposte uguali. Rischio da valutare: la regola chiede di non mandare «dati personali» e l'indirizzo dell'alloggio potrebbe contare come tale; inoltre manda al servizio il testo scritto e l'indirizzo IP, quindi serve un tocco chiaro e una riga nella pagina Privacy. **Photon** non vieta l'autocompletamento per iscritto ma dice «reasonable limit», «throttled or banned», nessuna garanzia, e non indica l'attribuzione (resta comunque dovuta, i dati sono OSM): meno rischioso come regola scritta, meno solido come promessa.
- La strada più coerente con le regole del progetto («nessun servizio esterno prima di un tocco») resta **l'elenco nostro** (sezione 3): pesa circa 17-22 KB (6-8 KB compressi) per 428 strutture con nome nel Comune, si carica solo aprendo «Da dove parti?» e non chiama nessuno. È un'estrazione OSM: va data come licenza ODbL con data, come già previsto nella specifica.
- **Ma copre poco**: circa **4 %** delle strutture extralberghiere censite dal Comune (253 contro 6.168, dato 2024 da verificare nel PDF). Chi dorme in un B&B o in un appartamento **di solito non troverà il suo nome**. Quindi il percorso senza nome non è un ripiego, è il caso normale: segnaposto spostabile sulla mappa, scelta della **via** da un elenco, «Dove sono» col GPS, «una tappa vicina». Il tipo con più voci ricercabili è `guest_house` (213, di cui 132 con «B&B» o simile nel nome). Solo il 39-40 % di tutte le voci ha la via, ma quasi tutte quelle con la via hanno anche il civico (171 su 174 nel Comune).
- Per l'aggiornamento: Overpass pubblico era **sovraccarico** (504 e timeout su 4 server su 5 per diversi minuti): non va interrogato dal browser dei visitatori; va chiamato da uno script al momento della costruzione del sito, con riprova, e il risultato salvato con data (`timestamp_osm_base`).

**3. Fattore di deviazione**
- Il valore tipico che si trova per i percorsi a piedi è **1,25-1,3** su tratti lunghi (Boeing: media 1,27; «meno di 1,3» nelle griglie ben collegate), e **più alto sui tratti brevi** (Nanjing: 1,58-1,96 entro 1 km; Giacomin e Levinson: «short trips are more circuitous»). La misura del progetto per Napoli (**mediana 1,27, e 1,32 sotto 1 km**) è in linea con la letteratura. Il fattore è quindi ragionevole per «linea d'aria × circa 1,3», ma **sui tratti da hotel a tappa sotto i 500 m può salire verso 1,5 o più** (Nanjing: 1,57-1,96 entro 500 m; dato nostro sotto 1 km: 1,32, che è una mediana su punti che stanno vicino ad altre tappe): lì un errore di qualche minuto è normale, il che sostiene il «circa» arrotondato a 5 minuti.
- «Linea d'aria × 20 minuti al km» della specifica equivale a **1,27 × 4,5 km/h = 17 min/km in piano + salite e scale di Napoli**: coerente con i 19,3 min/km misurati e con la letteratura. [D]

**4. Da verificare prima di scrivere sul sito**
- Riaprire il PDF della Regione Campania e copiare la frase dei 6.168 (oggi solo [R]).
- Il numero degli alberghi di Napoli (ISTAT / Comune): NON TROVATO.
- Condizioni di uso di Overpass: non le ho lette (non erano nella richiesta); servono solo se si interroga dal sito.

## NON TROVATO (riassunto)
- Visit A City: aiuto/documentazione primaria (sito a JavaScript, 404 sulle pagine d'aiuto).
- Wanderlog: come si cerca/aggiunge l'alloggio; Google Maps: pulsante «ottimizza ordine» nell'aiuto per utenti, legenda dei tratteggi a piedi; Citymapper: tappe multiple/alloggio; TripIt: ordine/ottimizzazione.
- Numero ufficiale degli alberghi di Napoli; tabelle ISTAT comunali di Napoli.
- Valori numerici di Giacomin e Levinson (2015); studio sul tratto breve a piedi (< 1 km) in un centro storico europeo.
- Lettura diretta del passaggio dei 6.168 nel PDF della Regione Campania (solo riportato dalla ricerca).
