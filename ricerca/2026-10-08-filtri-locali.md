# Come i siti seri separano tipo di locale, cucina e piatti nei filtri dei ristoranti

Domanda: come fanno TheFork, TripAdvisor, Google Maps, Yelp, Michelin, Gambero Rosso, OpenTable, OpenStreetMap, schema.org a separare tipo di locale / cucina / piatti; chi decide la categoria; vocabolario italiano; filtri su telefono; diete; aperto adesso, distanza, prezzo.
Data: 2026-10-08. Fatta da: agente ricercatore (Sonnet). Metodo: WebFetch e WebSearch. Le pagine di TheFork e Gambero Rosso e la lista Michelin non si sono lette (404/403); i fatti su di loro vengono da altre pagine e sono segnati.
Legenda: VISTO = letto su pagina aperta; RIPORTATO = riassunto della ricerca web, fonte secondaria o non verificata sulla pagina originale.

## 1. Tipo di locale, cucina, piatti: categoria principale e secondarie

**Google Maps / Places API** (VISTO)
- Un luogo ha una sola `primaryType`, che compare sempre anche in `types` (che può avere più voci). Può mancare se il tipo principale non è tra quelli supportati. Fonte: https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places
- Tipi ristorante (elenco Table A): `restaurant`, `fine_dining_restaurant`, `family_restaurant`, `fast_food_restaurant`, `italian_restaurant`, `steak_house`, `pizza_restaurant`, `seafood_restaurant`, `barbecue_restaurant`, `hamburger_restaurant`, `vegan_restaurant`, `vegetarian_restaurant`, `halal_restaurant`, `breakfast_restaurant`, `brunch_restaurant`, `dessert_restaurant`, `sandwich_shop`, `bar`, `wine_bar`, `pub`, `cafeteria`, `food_court`... Fonte: https://developers.google.com/maps/documentation/places/web-service/place-types
  - Nota: il vocabolario mescola in un solo elenco "che tipo di locale è" (fine_dining, fast_food, bar), "cosa cucina" (italian, seafood) e "piatto/stile" (pizza, steak_house), e anche dieta (vegan).
- Per i gestori (Google Business Profile): una categoria principale, scelta "specifica"; la prima nel campo è la principale; le categorie in più servono per "reparti o servizi speciali", non per ogni prodotto; regola: la categoria deve completare "questa attività È un..." e non "HA un...". Non si possono creare categorie proprie. Fonte: https://support.google.com/business/answer/7249669?hl=en (VISTO tramite estratto di ricerca).
  _Correzione del modello principale (08/10/2026): la regola «IS a / HAS a» non è nella pagina 7249669, ma nelle linee guida https://support.google.com/business/answer/3038177?hl=en, sezione «Select your category» (letta l'08/10/2026). Il resto della riga (categoria principale, categorie in più per i reparti, niente categorie proprie) è nella 7249669._
- Fino a 9 categorie secondarie e circa 4.000 categorie in totale: RIPORTATO da blog SEO (BrightLocal), non dalla documentazione Google. Fonte: https://www.brightlocal.com/learn/google-business-profile/categories/ . Gli stessi blog avvertono che riempire tutte le caselle con categorie non vere peggiora il posizionamento.

**OpenStreetMap** (VISTO)
- `amenity=restaurant` (o `fast_food`, `cafe`) dice il **tipo di locale**; `cuisine=*` dice **cosa si serve**. Più valori con punto e virgola, es. `cuisine=italian;pizza`. La pagina dice che l'ordine non conta (segnato come contestato nella pagina di discussione), quindi NON esiste un "valore principale per primo" nella wiki: la tua ipotesi di partenza non è confermata. Valori in minuscolo, singolare; usare il valore più specifico (es. `pizza` e non uno generico). Fonte: https://wiki.openstreetmap.org/wiki/Key:cuisine
- Esempi di valori: nazionalità/regioni (`italian`, `mediterranean`, `basque`) e cibi (`pizza`, `burger`, `seafood`, `kebab`, `pasta`, `ice_cream`, `coffee_shop`). Non ho potuto verificare `steak_house` (parte finale della pagina non letta).
- Diete a parte dalla cucina: `diet:vegetarian=only` per un locale solo vegetariano. Stessa fonte.

**schema.org** (VISTO)
- `servesCuisine`, tipo Text, su `FoodEstablishment`: definizione "The cuisine of the restaurant." Non dice se i valori possono essere più d'uno. Il tipo di locale è un altro campo (sottotipi: Restaurant, CafeOrCoffeeShop, Bakery, IceCreamShop, BarOrPub...). Fonte: https://schema.org/servesCuisine (i sottotipi sono sapere generale, non letti in questa sessione).

**TripAdvisor Italia** (VISTO, lista Napoli)
- Filtri a gruppi separati: **Categoria** (Ristoranti, Caffè e tè, Pasticcerie e gelaterie, Bar e pub), **Tipo di pasto** (Colazione, Brunch, Pranzo, Cena), **Tipi di cucina** (Italiana, Italiana – Sud, Mediterranea, Campana, + «Mostra tutto»), **Piatti** (Antipasti, Cecina, Pasta fresca, Pesto), **Prezzo**, **Restrizioni alimentari**, **Caratteristiche** (Posti a sedere, Servizio al tavolo, Prenotazioni, Serve alcolici). Dalla ricerca web risultano anche **Punteggio dei viaggiatori**, **Aperti ora**, **Ideale per**. Fonte: https://www.tripadvisor.it/Restaurants-g187785-Naples_Province_of_Naples_Campania.html (le opzioni dietro «Mostra tutto» non si sono lette).
- Cioè: tre livelli distinti: tipo di locale (Categoria) -> cucina (geografica o di stile) -> piatti (cose specifiche). «Pizza» e «Carne» non sono nei primi quattro valori della cucina mostrati per Napoli.
- Chi decide: i proprietari che rivendicano la scheda possono aggiornare "tipi di cucina", orari, contatti, caratteristiche; le modifiche possono impiegare fino a 5 giorni lavorativi (RIPORTATO, articolo di stampa del settore). Fonte: https://www.travolution.com/news/travel-sectors/accommodation/tripadvisor-releases-new-features-for-restaurants-to-boost-listings/ . Se gli algoritmi/gli utenti influenzano anche la cucina: NON TROVATO.

**Guida Michelin** (VISTO, scheda di un locale di Napoli)
- Ogni scheda ha prezzo e cucina in una riga: es. «€ · Campana, Mediterranea» (Ostaria Pignatelli) e «€€ · Moderna». Cioè **fino a due-tre etichette di cucina**, non decine. Più un campo «Ideale per» (es. «Cucina locale») e i Servizi (Terrazza, Aria condizionata, Carte di credito accettate). Fonte: https://guide.michelin.com/it/it/campania/napoli/ristorante/ostaria-pignatelli
- Altre schede lette tramite ricerca: Caruso Roof Garden «Campana, Italiana contemporanea»; George «Contemporanea, Campana» (RIPORTATO). In quanto a chi decide: la guida è editoriale (ispettori); dettaglio ufficiale NON TROVATO.
- La lista di Napoli (https://guide.michelin.com/it/it/campania/napoli/restaurants) ha dato 404: non so le voci esatte del filtro cucina.

**Gambero Rosso** (RIPORTATO)
- La guida distingue il **tipo di locale** con simboli: ristoranti (forchette), trattorie (gamberi), wine bar, birrerie, etnici, bistrot; nella guida Roma 2020 ogni locale ha la sua tipologia (trattoria, ristorante, pizzeria). Fonti: https://www.gamberorosso.it/notizie/guida-roma-2020-del-gambero-rosso-tutti-i-premi e https://www.scattidigusto.it/gambero-rosso-2015-ristoranti-ditalia (citate dal motore di ricerca, non lette per intero).
- Un risultato di ricerca riporta per «Mimì alla Ferrovia» «tipo di cucina: tipico regionale» e prezzo medio 55 euro (dato Gambero Rosso). La pagina https://www.gamberorosso.it/luoghi/locali/ristorante/mimi-alla-ferrovia ha dato 403: non verificato.
- Quindi: è un campo unico "tipologia" (ristorante/trattoria/pizzeria) più un campo "tipo di cucina" con valori larghi (tipico regionale). Redazionale.

**Yelp** (RIPORTATO)
- Un'attività può avere fino a 3 categorie, da scegliere "il più specifico possibile" e che descrivano "le attività principali". Fonte: https://www.reviewtrackers.com/blog/yelp-categories/ (articolo di terzi). Se esiste una categoria principale: NON TROVATO. Elenco categorie ufficiale (Steakhouses, Pizza, Seafood): NON TROVATO.

**OpenTable** (RIPORTATO, fonte debole)
- Gli scraper di terzi elencano `primaryCuisine` (una cucina principale, es. steakhouse o italiana) e un'etichetta di stile ("Casual Elegant", "Fine Dining"). Fonte: https://apify.com/khadinakbar/opentable-scraper/output-schema . Documentazione ufficiale NON TROVATA.

**TheFork** (NON TROVATO sul sito)
- https://www.thefork.it/ristoranti/napoli-c11186 -> 404. Ricerche: filtri TheFork Italia, aiuto per i ristoratori sulle categorie di cucina: nessuna pagina ufficiale. Una scheda di prodotto dice solo che l'utente seleziona per "località, tipo di cucina, tipo di ristorante e prezzo medio" (RIPORTATO, https://www.capterra.es/software/1085063/TheFork-Manager). Quindi TheFork separa almeno **cucina** e **tipo di ristorante** come due filtri, ma le voci esatte e il numero massimo di cucine per locale non li ho trovati.

## 2. Chi decide la categoria

- Google: il gestore sceglie da una lista chiusa; Google guida con la regola «È / HA» (VISTO, vedi sopra). Come evitano che una pizzeria risulti steakhouse: la regola «È un...» e il divieto di mettere categorie per ogni prodotto; per le categorie false Google avvisa che il profilo può essere riverificato dopo modifiche (VISTO). Un controllo algoritmico a monte: NON TROVATO.
- TripAdvisor: il proprietario dopo aver rivendicato la scheda (RIPORTATO).
- Michelin e Gambero Rosso: redazione/ispettori (deduzione dal tipo di guida; fonte diretta NON TROVATA).
- OpenStreetMap: i mappatori volontari, con convenzione «usa il valore più specifico» (VISTO).

## 3. Vocabolario italiano (parole esatte lette)

- TripAdvisor.it, Categoria: «Ristoranti», «Caffè e tè», «Pasticcerie e gelaterie», «Bar e pub». Cucina: «Italiana», «Italiana – Sud», «Mediterranea», «Campana». Piatti: «Antipasti», «Cecina», «Pasta fresca», «Pesto». Prezzo: «Cibo economico», «Fascia media», «Cucina raffinata». Diete: «Opzioni vegetariane», «Opzioni vegane», «Opzioni senza glutine», «Halal». Fonte: pagina TripAdvisor Napoli sopra. Pasto: «Colazione», «Brunch», «Pranzo», «Cena».
- Michelin Italia: cucina «Campana», «Mediterranea», «Moderna», «Contemporanea», «Italiana contemporanea»; «Cucina locale»; (schede lette sopra).
- Gambero Rosso: «ristorante», «trattoria», «pizzeria», «wine bar», «birrerie», «etnici», «bistrot» (RIPORTATO).
- Google Maps in italiano (nomi dei tipi): NON TROVATO. Ho solo i nomi inglesi dell'API; la traduzione italiana («Pizzeria», «Ristorante di pesce», «Steakhouse») non l'ho vista su una pagina. Provato: documentazione Places (solo inglese). Si può controllare in `primaryTypeDisplayName` con `languageCode=it` (il campo esiste, VISTO), ma non l'ho eseguito.
- TheFork Italia, parole esatte dei filtri: NON TROVATO (404).
- Parole come «braceria», «friggitoria», «street food», «pasticceria», «gelateria»: tra le fonti lette appaiono solo «Pasticcerie e gelaterie» (TripAdvisor); «braceria» e «friggitoria» NON TROVATE nei filtri di nessun sito.

## 4. Filtri sul telefono

- Baymard: valori nello stesso gruppo in **O**, gruppi diversi in **E**; mostrare il **numero di risultati accanto a ogni opzione** («Blu (34)»); dopo la selezione multipla, su mobile cambiare il filtro per ogni opzione è «tedioso». Fonti: https://baymard.com/learn/ecommerce-filter-ui e https://baymard.com/research-articles/allow-applying-of-multiple-filter-values (RIPORTATO, via riassunto di ricerca; pagine non lette direttamente). Secondo la stessa fonte il 14-15% dei siti nel loro test non permette scelte multiple.
- Nielsen Norman Group: su telefono, filtri a lotto con pulsante **Applica** (consigliato su mobile, svantaggioso per chi esplora); con filtri in tempo reale, oscurare i risultati e mostrare un indicatore di avanzamento; il **totale dei risultati sempre visibile** anche scorrendo la lista dei filtri; etichetta di testo («Filtra»/«Raffina») meglio di un'icona sola; i filtri a «tray» (pannello che copre parte dei risultati). Fonti: https://www.nngroup.com/articles/applying-filters/ e https://www.nngroup.com/articles/mobile-faceted-search/ (RIPORTATO via ricerca; la seconda è del 2015).
- NN/g sulle categorie: evitare gruppi di filtri che «non sono mutuamente esclusivi» (esempio: «Stile» e «Tipo di articolo» insieme confondono); meglio una gerarchia generale -> specifica; etichette concrete, senza gergo; categorie generali in alto e specifiche in basso. Fonte: https://www.nngroup.com/articles/filter-categories-values/ (VISTO).
- Come sono fatti davvero le app di TheFork/TripAdvisor/Google (pillole in fila, foglio dal basso, «Tutti i filtri», «Applica», contatore): NON VISTO: non ho potuto aprire le app né le pagine mobili. Cosa ho provato: pagine web desktop (solo elenchi di etichette), ricerche per recensioni dell'app (nessuna descrizione utile). Zero risultati e ordinamento: NON TROVATO nelle fonti lette. Su TheFork un articolo di stampa cita il tasto «FILTRA» in alto e l'ordinamento per prezzo (RIPORTATO, https://www.money.it/The-Fork-guida-Tripadvisor-ristoranti).

## 5. Diete

- TripAdvisor.it: gruppo separato «Restrizioni alimentari» con quattro valori (vedi sopra); si basa sulle informazioni inserite dai locali e dalle recensioni (RIPORTATO: nessuna verifica trovata). Esistono pagine automatiche tipo «I migliori ristoranti di cucina senza glutine» (https://www.tripadvisor.it/Restaurants-g52048-zfz10992-Rufus_Oregon.html, esempio di URL).
- Google Places: campi booleani come `servesVegetarianFood` (VISTO, https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places) e tipi `vegan_restaurant`, `vegetarian_restaurant`; i gestori inseriscono gli attributi a mano (RIPORTATO, https://www.dacgroup.com/?p=133980, fonte debole).
- OpenStreetMap: `diet:vegetarian=only` (cioè «solo vegetariano») distinto da altre opzioni (VISTO).
- Yelp: dal 2019 l'utente imposta preferenze (senza glutine, halal, keto, kosher, pescetariano, vegano, vegetariano) e i risultati si adattano (RIPORTATO, https://thenextweb.com/apps/2019/08/27/yelp-now-lets-you-personalize-its-app-based-on-lifestyle-and-diet/). Come le verifica il locale: NON TROVATO.
- Senza glutine: AIC (Associazione Italiana Celiachia), programma «Alimentazione Fuori Casa» (AFC): percorso in quattro passi (controllo, corso di formazione, aggiornamento continuo, consulenza), protocollo di collaborazione, controlli periodici; più di 4.500 esercizi nel documento 2026 (più di 4.000 nei comunicati 2023-2024); la guida è online e nell'app AIC. Per le pizzerie serve un forno dedicato (regola dell'AIC Lombardia). Fonti: https://static.celiachia.it/assets/uploads/2026/04/Linee-Guida-Programma-AFC_08_04_2026.pdf.pdf , https://static.celiachia.it/assets/uploads/2024/06/cs_AIC_vacanze-senza-glutine_giu24.pdf (RIPORTATO: i PDF non sono stati aperti, i dati vengono dal riassunto di ricerca). Un'indagine FIPE-AIC segnala differenza di competenza tra locali dentro e fuori dal programma: https://www.fipe.it/wp-content/uploads/2024/04/Indagine-ristorazione-e-celiachia-Italia_2023.pdf (RIPORTATO).
- Vegetariano/vegano: nessuna associazione di verifica trovata. NON TROVATO.

## 6. Aperto adesso, distanza, prezzo

- Google: `currentOpeningHours.openNow` = «il periodo di orari è attivo» (VISTO). `priceLevel`: INEXPENSIVE, MODERATE, EXPENSIVE, VERY_EXPENSIVE (+ FREE, UNSPECIFIED) e `priceRange` con `startPrice` (incluso) ed `endPrice` (escluso, può mancare = «più di 100 €»), in valuta (VISTO). Fonte: https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places . Come la fascia viene calcolata: NON TROVATO.
- Michelin: 1-4 simboli; per la zona euro: € sotto 35 €; €€ 35-60 €; €€€ 60-100 €; €€€€ oltre 100 €; è il costo medio di un pasto completo, **bevande escluse**, per menu fissi e alla carta; descrizioni «con poco budget», «spesa moderata», «occasione speciale», «senza badare a spese». Fonte: https://intercom.help/michelin-guide-contact-us/en/articles/7232781-what-do-the-restaurant-price-symbols-mean (VISTO; la tabella è «Euro-Zone», l'Italia non è citata per nome).
- TripAdvisor.it: tre fasce con **parole**, non simboli: «Cibo economico», «Fascia media», «Cucina raffinata» (VISTO). Soglie in euro: NON TROVATO (pagina di aiuto non trovata; un post di forum, non attendibile, dice che usa il simbolo della valuta locale).
- TheFork: «prezzo medio» sulla scheda, stima di spesa per persona; usato anche per gli sconti (RIPORTATO, https://www.money.it/The-Fork-guida-Tripadvisor-ristoranti). Come lo calcola: NON TROVATO.
- OpenTable: fasce $-$$$$ con soglie citate solo da terzi (da meno di 30 $ a oltre 75 $): fonte debole, non usare.
- Aperto adesso su TripAdvisor: esiste un filtro «Aperti ora» (RIPORTATO). Distanza: NON TROVATO come funziona per nessun sito.

## NON TROVATO (cosa manca e cosa ho provato)
- TheFork: filtri, vocabolario, numero massimo di cucine, calcolo del prezzo medio. Provato: pagina Napoli (404), 3 ricerche web.
- Gambero Rosso: scheda dettagliata (403) e filtri online.
- Michelin: lista Napoli con filtri (404); chi assegna le etichette di cucina e quante al massimo (ho visto al massimo 2 per scheda).
- Yelp: categoria principale, lista ufficiale, calcolo di «$$»; Open Now.
- OpenTable: documentazione ufficiale.
- Google Maps in italiano: nomi italiani dei tipi.
- Aspetto delle app su telefono (pillole, foglio dal basso, «Tutti i filtri»); comportamento con zero risultati; ordinamento.
- Vegetariano/vegano: chi verifica.
- Come gli algoritmi impediscono l'etichetta sbagliata (pizzeria = steakhouse): nessuna fonte.

## Da verificare
- OSM: «valore principale per primo»: la wiki dice l'opposto (ordine non importante).
- Numero 9 categorie secondarie di Google e 3 di Yelp: da fonti di terzi.
- Baymard e NN/g: lette tramite riassunto di ricerca, non pagine intere.
- AIC: cifre diverse (4.000 / 4.500) per anni diversi.

## Cosa si può imparare per Nextstop (deduzioni mie, non fatti)
1. I siti seri tengono **separati tre livelli**: tipo di locale (pizzeria, trattoria, bar), cucina e piatti. Il nostro `cucina` mescola tutto: quello che oggi si chiama «carne» corrisponde a un piatto, non a un tipo di locale.
2. Quasi tutti hanno **una sola categoria principale**: Google lo dice chiaramente (`primaryType`), Michelin ne mostra 1-3 per scheda, Yelp massimo 3. Per Nextstop: un campo `tipo` (una sola voce: pizzeria, braceria, ristorante di pesce, friggitoria...) e `piatti` come elenco libero, con il filtro principale che guarda solo `tipo`.
3. La regola di Google «È un... non HA un...» è proprio il test per «una braceria è carne, una pizzeria con la bistecca no»: si può scrivere così nelle regole dei dati.
4. Ai piatti conviene una voce a parte (come «Piatti» di TripAdvisor, con «Pasta fresca», «Pesto»): chi cerca «genovese» o «babà» li trova senza che il locale diventi di «carne» o «dolci».
5. Sul telefono: scelte nello stesso gruppo in O, gruppi diversi in E (Baymard); numero di risultati accanto a ogni voce e totale sempre visibile (Baymard, NN/g); tasto «Applica» se il filtro è lento, filtri in tempo reale se la pagina è statica e veloce come la nostra (NN/g dice che a lotto serve soprattutto quando il sito può essere lento).
6. Con pochi locali (32) un filtro con zero risultati è probabile: conviene disattivare le voci con 0 risultati o mostrare il numero, e non lasciare mai una pagina vuota (nelle fonti lette non ho visto cosa fanno gli altri: da progettare).
7. Prezzo: Michelin chiarisce cosa copre (pasto completo, bevande escluse) e dà le soglie in euro; TripAdvisor usa parole. Per Nextstop: dire in una riga cosa significano €, €€, €€€ in euro, e che cosa include.
8. Senza glutine: l'unico marchio verificato che ho trovato è l'AFC dell'AIC; per le diete, senza una fonte come quella, meglio «dichiarato dal locale» con stato e data (coerente con «niente senza fonte»), non un filtro che promette sicurezza.
