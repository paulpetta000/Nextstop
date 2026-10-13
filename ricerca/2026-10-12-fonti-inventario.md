# Fonti di Nextstop · inventario completo

_Rilevazione locale del 12/10/2026 sul ramo codex/fonti-specifica, base 3a68b40ea014e3a5423e6a28350b3db619696e0d._

Questo documento registra gli usi attuali, non certifica i contenuti delle fonti. Date, note e campi «letta» sono quelli già salvati: nessun documento esterno ricontrollato in questo blocco. Le decisioni sono proposte, non rimozioni approvate.

[Specifica](../specifiche/fonti-e-controlli.md) · [Resoconto e decisioni](2026-10-12-fonti-blocco-1.md) · [Inventario strutturato](2026-10-12-fonti-inventario.json).

## Metodo e limiti

Analisi YAML di fonti, fatti, tappe, locali e tutti i testi; lettura dei consumatori in pagine e librerie. Incluse fonti dirette, otto durataFonte ed extra OpenStreetMap. Il calendario è una radice separata: giorniRegate consuma date e titoli di EVENTI senza risolvere il campo fatto; salta la pausa. Un riferimento nel calendario non prova che il documento sia esposto al visitatore.

La home O4 legge la prima fonte di tp-sansevero-orari e mostra un esempio con link originale; home.yaml non è caricato dalla home attuale. La composizione dei footer è ricostruita staticamente, senza una nuova build o navigazione. Conteggi e pagina /fonti/ non sono prova di pertinenza. Hash degli input e tutti i consumatori sono nel JSON.

## Totali

| Voce | Risultato |
|---|---:|
| fonti | 204 |
| schede | 212 |
| tappe | 60 |
| locali | 32 |
| mantenereDaVerificare | 195 |
| confineEvento | 9 |
| senzaRiferimenti | 0 |
| schedeSenzaRadice | 0 |
| footerItinerari | 185 |
| footerDoveMangiare | 84 |
| unioneFooter | 199 |
| senzaRicontrollo | 46 |
| comeFatto | 19 |
| schedeDeboli | 1 |
| durateConFonte | 8 |

Nessun ID duplicato, riferimento mancante nelle catene estratte o URL identico fra fonti. Non è un controllo di raggiungibilità web, correttezza dei fatti o duplicati editoriali con URL differenti.

## Tutte le fonti

Mantenere da verificare: uso pertinente nei dati/testi, da controllare sul documento originale nel prossimo blocco. Confine evento: fonte delle 13 schede non tp-/lc- (calendario, orari, lungomare, trasporti); non è automaticamente da eliminare. Le schede indicano associazioni dichiarate nel registro.

| ID e documento originale | Editore · tipo · controllo registrato | Proposta | Schede collegate | Usi diretti | Footer attuali |
|---|---|---|---|---|---|
| ac-grazie-napoli · [Grazie Napoli](<https://www.americascup.com/news/4372_GRAZIE-NAPOLI>) | America's Cup · ufficiale · 2026-09-30 | decidere-confine-evento | cal-youth, cal-womens, cal-match |  | Nessuno |
| ac-formato-lvc · [Fleet racing AC75's to kick-start the Louis Vuitton Cup](<https://www.americascup.com/news/4148_FLEET-RACING-AC75-s-TO-KICK-START-THE-LOUIS-VUITTON-CUP>) | America's Cup · ufficiale · 2026-09-30 | decidere-confine-evento | cal-flotta, cal-rr, cal-pausa, cal-ripescaggio, cal-semifinali, cal-finale-lvc, cal-match, cal-orari |  | itinerari |
| ac-youth-date · [Youth America's Cup dates announced](<https://www.americascup.com/news/4332_YOUTH-AMERICAS-CUP-DATES-ANNOUNCED-AS-THE-AMERICAS-CUP-CELEBRATES-THE-NEXT-GENERATION-AT-PINO-DANIELE-SPORTS-CENTRE-IN-CAIVANO>) | America's Cup · ufficiale · 2026-09-30 | decidere-confine-evento | cal-youth |  | Nessuno |
| ac-38 · [The Louis Vuitton 38th America's Cup](<https://www.americascup.com/38th-americascup>) | America's Cup · ufficiale · 2026-09-30 | decidere-confine-evento | cal-orari |  | itinerari |
| ac-host-venue · [Host Venue](<https://www.americascup.com/host-venue>) | America's Cup · ufficiale · 2026-09-30 | decidere-confine-evento | vil-caracciolo |  | itinerari |
| ac-programma-pr2 · [Mark your diaries – PR2 Naples is all set](<https://www.americascup.com/news/4270_MARK-YOUR-DIARIES-PR2-NAPLES-IS-ALL-SET>) | America's Cup · ufficiale · 2026-09-30 | decidere-confine-evento | cal-orari-2026 |  | itinerari |
| ac-protocollo · [Protocollo della Louis Vuitton 38ª America's Cup (12 agosto 2025)](<https://www.americascup.com/files/m26244_FINAL-PROTOCOL-12-AUGUST-2025.pdf>) | America's Cup · ufficiale · 2026-09-30 | decidere-confine-evento | cal-semifinali |  | Nessuno |
| etnz-formato · [2027: The Louis Vuitton 38th America's Cup – May–July 2027](<https://emirates-team-new-zealand.americascup.com/en/news/813_2027-THE-LOUIS-VUITTON-38TH-AMERICA-S-CUP-MAY-JULY-2027.html>) | Emirates Team New Zealand · ufficiale · 2026-09-30 | decidere-confine-evento | cal-flotta, cal-ripescaggio, cal-match |  | Nessuno |
| comune-citta-ospitante · [Napoli Città Ospitante della 38ª edizione della Louis Vuitton America's Cup](<https://www.comune.napoli.it/articolo_tematico/napoli-citta-ospitante-della-38esima-edizione-della-americas-cup/>) | Comune di Napoli · ufficiale · 2026-09-30 | decidere-confine-evento | trasporti-2027-atteso |  | itinerari |
| osm · [OpenStreetMap](<https://www.openstreetmap.org/copyright>) | Collaboratori di OpenStreetMap (licenza ODbL) · dati · 2026-09-30 | mantenere-da-verificare | tp-spaccanapoli-orari, tp-tribunali-orari, tp-plebiscito-orari, tp-toledo-orari, tp-echia-orari, tp-lungomare-orari, tp-pedamentina-orari, tp-belvedere-orari | src/testi/itinerari.yaml#tempi; src/testi/tappe.yaml#lungomare; src/testi/tappe.yaml#pedamentina; src/testi/tappe.yaml#marechiaro; src/testi/tappe.yaml#citta-scienza; src/pages/napoli/itinerari/index.astro#FontiPagina.extra | itinerari |
| tp-italia-duomo · [Duomo di Napoli](<https://www.italia.it/it/campania/napoli/duomo>) | Ministero del Turismo (italia.it) · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-duomo-orari |  | itinerari |
| tp-tesoro-info · [Info e tariffe](<https://tesorosangennaro.it/info-e-tariffe/>) | Museo del Tesoro di San Gennaro · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-duomo-prezzi |  | itinerari |
| tp-tesoro-faq · [FAQ](<https://tesorosangennaro.it/faq/>) | Museo del Tesoro di San Gennaro · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-duomo-orari, tp-tesoro-durata |  | itinerari |
| tp-sansevero-orari · [Orari e tariffe](<https://www.museosansevero.it/organizza-la-tua-visita/orari-e-tariffe>) | Museo Cappella Sansevero · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sansevero-orari, tp-sansevero-prezzi, tp-sansevero-prenota | src/pages/index.astro#prima fonte Sansevero | itinerari |
| tp-sansevero-accesso · [Modalità di accesso](<https://www.museosansevero.it/organizza-la-tua-visita/modalita-di-accesso>) | Museo Cappella Sansevero · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sansevero-prenota, tp-sansevero-regole |  | itinerari |
| tp-sansevero-accessibilita · [Accessibilità](<https://www.museosansevero.it/organizza-la-tua-visita/accessibilita>) | Museo Cappella Sansevero · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sansevero-regole |  | itinerari |
| tp-santachiara-orari · [Orari](<https://www.monasterodisantachiara.it/orari/>) | Monastero di Santa Chiara · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-santachiara-orari, tp-santachiara-prezzi |  | itinerari |
| tp-santachiara-faq · [FAQ](<https://www.monasterodisantachiara.it/faq/>) | Monastero di Santa Chiara · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/tappe.yaml#santa-chiara; src/data/tappe.yaml#santa-chiara.durataFonte | itinerari |
| tp-napolike-gesu · [Chiesa del Gesù Nuovo](<https://www.napolike.it/chiesa-del-gesu-nuovo-napoli>) | Napolike · blog · 2026-10-02 | mantenere-da-verificare | tp-spaccanapoli-orari |  | itinerari |
| tp-napolike-sangregorio · [Chiesa di San Gregorio Armeno](<https://www.napolike.it/point/chiesa-san-gregorio-armeno-napoli>) | Napolike · blog · 2026-10-02 | mantenere-da-verificare | tp-spaccanapoli-orari |  | itinerari |
| tp-piomonte · [Info e orari](<https://piomontedellamisericordia.it/info-e-orari/>) | Pio Monte della Misericordia · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-piomonte-orari, tp-piomonte-prezzi |  | itinerari |
| tp-piomonte-caravaggio · [Caravaggio](<https://piomontedellamisericordia.it/caravaggio/>) | Pio Monte della Misericordia · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/tappe.yaml#pio-monte | itinerari |
| tp-mann-orari · [Orari e biglietti](<https://www.museoarcheologiconapoli.it/orari-e-biglietti/>) | Museo Archeologico Nazionale di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-mann-orari, tp-mann-prezzi |  | itinerari |
| tp-mic-mann · [Museo Archeologico Nazionale di Napoli](<https://cultura.gov.it/luogo/museo-archeologico-nazionale-di-napoli-1>) | Ministero della Cultura · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-mann-orari |  | itinerari |
| tp-sanlorenzo · [Info visite](<https://www.laneapolissotterrata.it/Home/InfoVisite>) | La Neapolis Sotterrata (San Lorenzo Maggiore) · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sanlorenzo-orari, tp-sanlorenzo-prezzi | src/testi/tappe.yaml#san-lorenzo | itinerari |
| tp-sotterranea-orari · [Orari](<https://www.napolisotterranea.org/orari/>) | Napoli Sotterranea · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sotterranea-orari, tp-sotterranea-prezzi |  | itinerari |
| tp-sotterranea-faq · [FAQ](<https://www.napolisotterranea.org/faq/>) | Napoli Sotterranea · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sotterranea-orari, tp-sotterranea-prezzi, tp-sotterranea-visita | src/data/tappe.yaml#napoli-sotterranea.durataFonte | itinerari |
| tp-madre · [Visita](<https://www.madrenapoli.it/visita/>) | Museo Madre · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-madre-orari, tp-madre-prezzi | src/testi/tappe.yaml#madre | itinerari |
| tp-catacombe · [Pianifica la visita](<https://catacombedinapoli.it/it/pianifica-visita-guidata-napoli/>) | Catacombe di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-catacombe-orari, tp-catacombe-prezzi, tp-catacombe-note |  | itinerari |
| tp-catacombe-sangennaro · [Catacombe di San Gennaro](<https://catacombedinapoli.it/it/luoghi/catacombe-di-san-gennaro-napoli/>) | Catacombe di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/data/tappe.yaml#catacombe.durataFonte | Nessuno |
| tp-catacombe-basilica · [Basilica di Santa Maria della Sanità](<https://catacombedinapoli.it/it/luoghi/basilica-di-santa-maria-sanita-napoli/>) | Catacombe di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sanita-orari | src/testi/tappe.yaml#sanita | itinerari |
| tp-fontanelle · [Pianifica la visita](<https://cimiterodellefontanelle.it/pianifica-visita/>) | Cimitero delle Fontanelle · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-fontanelle-orari, tp-fontanelle-prezzi | src/testi/tappe.yaml#fontanelle; src/data/tappe.yaml#fontanelle.durataFonte | itinerari |
| tp-comune-fontanelle · [Il Cimitero delle Fontanelle riapre per sempre](<https://www.comune.napoli.it/novita/il-cimitero-delle-fontanelle-riapre-per-sempre/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-fontanelle-prezzi |  | itinerari |
| tp-capodimonte-orari · [Orari](<https://capodimonte.cultura.gov.it/orari/>) | Museo e Real Bosco di Capodimonte · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-capodimonte-orari |  | itinerari |
| tp-capodimonte-biglietti · [Biglietti](<https://capodimonte.cultura.gov.it/biglietti/>) | Museo e Real Bosco di Capodimonte · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-capodimonte-prezzi |  | itinerari |
| tp-mic-sanmartino · [Certosa e Museo di San Martino](<https://cultura.gov.it/luogo/certosa-e-museo-di-san-martino>) | Ministero della Cultura · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sanmartino-orari, tp-sanmartino-prezzi |  | itinerari |
| tp-mic-santelmo · [Castel Sant'Elmo e Museo del Novecento a Napoli](<https://cultura.gov.it/luogo/castel-sant-elmo-e-museo-del-novecento-a-napoli>) | Ministero della Cultura · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-santelmo-orari, tp-santelmo-prezzi |  | itinerari |
| tp-mic-floridiana · [Museo della Ceramica Duca di Martina in Villa Floridiana](<https://cultura.gov.it/luogo/museo-della-ceramica-duca-di-martina-in-villa-floridiana>) | Ministero della Cultura · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-floridiana-orari, tp-floridiana-prezzi |  | itinerari |
| tp-comune-pedamentina · [Dalla Pedamentina a Spaccanapoli](<https://www.comune.napoli.it/articolo_tematico/vivere-la-citta/turismo/turismo-sostenibile/percorsi-a-piedi/dalla-pedamentina-a-spaccanapoli/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-pedamentina-orari |  | itinerari |
| tp-anm-ascensori · [Ascensori](<https://www2.anm.it/index.php?option=com_content&task=view&id=1339&Itemid=320>) | ANM, Azienda Napoletana Mobilità · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sanita-orari | src/testi/itinerari.yaml#tempi | itinerari |
| tp-palazzoreale-info · [Informazioni per la visita](<https://palazzorealedinapoli.org/informazioni-per-la-visita/>) | Palazzo Reale di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-palazzoreale-orari, tp-palazzoreale-prezzi | src/testi/tappe.yaml#palazzo-reale; src/data/tappe.yaml#palazzo-reale.durataFonte | itinerari |
| tp-palazzoreale-restauri · [Inizio cantiere di restauro del Salone d'Ercole e modifica del percorso di visita dell'Appartamento di Etichetta](<https://palazzorealedinapoli.org/inizio-cantiere-di-restauro-del-salone-dercole-e-modifica-del-percorso-di-visita-dellappartamento-di-etichetta-da-giovedi-1ottobre/>) | Palazzo Reale di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-palazzoreale-restauri |  | itinerari |
| tp-sancarlo-visite · [Visite guidate](<https://www.teatrosancarlo.it/visite-guidate/>) | Teatro di San Carlo · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-sancarlo-orari, tp-sancarlo-prezzi | src/data/tappe.yaml#san-carlo.durataFonte | itinerari |
| tp-comune-castelnuovo · [Maschio Angioino](<https://www.comune.napoli.it/maschioangioino>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-castelnuovo-orari, tp-castelnuovo-prezzi | src/testi/tappe.yaml#castel-nuovo | itinerari |
| tp-napoliforme-galleria · [Galleria Umberto I](<https://napoliforme.comune.napoli.it/en/pois/-/poi/Galleria-Umberto-I>) | NapoliForMe, Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-plebiscito-orari |  | itinerari |
| tp-anm-metroart-toledo · [Toledo](<https://metroart.anm.it/stazioni-arte/linea-1/toledo>) | ANM, Metroart · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-toledo-orari |  | itinerari |
| tp-borbonica-standard · [Percorso Standard](<https://www.galleriaborbonica.com/it/percorsi/standard>) | Galleria Borbonica · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-borbonica-orari, tp-borbonica-prezzi | src/data/tappe.yaml#galleria-borbonica.durataFonte | itinerari |
| tp-borbonica-memorie · [Via delle Memorie](<https://www.galleriaborbonica.com/it/percorsi/via-delle-memorie>) | Galleria Borbonica · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-borbonica-orari, tp-borbonica-prezzi |  | itinerari |
| tp-borbonica-avventura · [Percorso Avventura](<https://www.galleriaborbonica.com/it/percorsi/avventura>) | Galleria Borbonica · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-borbonica-orari, tp-borbonica-prezzi |  | itinerari |
| tp-comune-casteldellovo · [Castel dell'Ovo](<https://www.comune.napoli.it/casteldellovo>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-borgo-orari |  | itinerari |
| tp-comune-borgomarinari · [Area pedonale di Borgo Marinari](<https://www.comune.napoli.it/articolo_tematico/trasporti-mobilita/ztl-e-aree-pedonali/area-pedonale-di-borgo-marinari/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-borgo-orari |  | itinerari |
| tp-anm-echia · [Ascensore di Monte Echia](<https://www2.anm.it/index.php?option=com_content&task=view&id=4286&Itemid=314>) | ANM, Azienda Napoletana Mobilità · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-echia-orari, tp-echia-prezzi |  | itinerari |
| tp-comune-echia · [Entra in funzione l'ascensore di Monte Echia](<https://www.comune.napoli.it/novita/entra-in-funzione-lascensore-di-monte-echia/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-echia-prezzi, tp-echia-recinzione |  | itinerari |
| tp-comune-villacomunale · [Villa Comunale](<https://www.comune.napoli.it/vivere-il-comune/luoghi/villa-comunale/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-lungomare-orari |  | itinerari |
| tp-dadom-info · [Biglietteria: informazioni](<https://dadom.okticket.it/it/ticket/home/info>) | DaDoM, Stazione Zoologica Anton Dohrn · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-dadom-orari, tp-dadom-prezzi |  | itinerari |
| tp-dadom-tariffe · [Biglietto DaDoM](<https://dadom.okticket.it/it/biglietti/detail/236/biglietto-dadom>) | DaDoM, Stazione Zoologica Anton Dohrn · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-dadom-prezzi |  | itinerari |
| tp-mic-virgilio · [Parco e Tomba di Virgilio](<https://cultura.gov.it/luogo/Parco%20e%20Tomba%20di%20Virgilio>) | Ministero della Cultura · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-virgilio-orari, tp-virgilio-prezzi |  | itinerari |
| tp-musei-campania-virgilio · [Parco delle Tombe di Virgilio e Leopardi: temporanea chiusura di alcune aree del percorso di visita](<https://museicampania.cultura.gov.it/parco-delle-tombe-di-virgilio-e-leopardi-temporanea-chiusura-di-alcune-aree-del-percorso-di-visita/>) | Direzione regionale Musei nazionali Campania · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-virgilio-orari |  | itinerari |
| tp-mic-leopardi-day-2025 · [Leopardi Day: un omaggio poetico e inclusivo a Giacomo Leopardi nel giorno della sua nascita](<https://cultura.gov.it/evento/leopardi-day-un-omaggio-poetico-e-inclusivo-a-giacomo-leopardi-nel-giorno-della-sua-nascita>) | Ministero della Cultura · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-virgilio-prezzi |  | itinerari |
| tp-comune-ztl-marechiaro · [ZTL Marechiaro](<https://www.comune.napoli.it/articolo_tematico/trasporti-mobilita/ztl-e-aree-pedonali/ztl-marechiaro/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-marechiaro-orari |  | itinerari |
| tp-comune-virgiliano · [Parco Virgiliano](<https://www.comune.napoli.it/vivere-il-comune/luoghi/parco-virgiliano/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-virgiliano-orari |  | itinerari |
| tp-comune-virgiliano-riapertura · [Parco Virgiliano, dal 27 giugno riapertura parziale al pubblico](<https://www.comune.napoli.it/novita/parco-virgiliano-dal-27-giugno-riapertura-parziale-al-pubblico/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-virgiliano-orari |  | itinerari |
| tp-gaiola-accesso · [Accesso](<https://www.areamarinaprotettagaiola.it/accesso>) | Area Marina Protetta Parco Sommerso di Gaiola · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-gaiola-orari, tp-gaiola-prenota |  | itinerari |
| tp-gaiola-prenotazione · [Prenotazione estate](<https://www.areamarinaprotettagaiola.it/prenotazione-summer>) | Area Marina Protetta Parco Sommerso di Gaiola · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-gaiola-orari, tp-gaiola-prezzi, tp-gaiola-prenota |  | itinerari |
| tp-cittascienza-visita · [Organizza una visita](<https://www.cittadellascienza.it/organizza-una-visita/>) | Città della Scienza · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-cittascienza-orari, tp-cittascienza-estate |  | itinerari |
| tp-cittascienza-biglietteria · [Biglietteria](<https://www.cittadellascienza.it/biglietteria/>) | Città della Scienza · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-cittascienza-prezzi |  | itinerari |
| tp-cittascienza-faq · [Who we are: FAQ](<https://www.cittadellascienza.it/en/copia-di-copia-di-chi-siamo-en/>) | Città della Scienza · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/tappe.yaml#citta-scienza; src/data/tappe.yaml#citta-scienza.durataFonte | itinerari |
| tp-cittascienza-estate-2025 · [Estate 2025 a Città della Scienza](<https://www.cittadellascienza.it/estate-2025-a-citta-della-scienza-14-giugno-28-settembre-2025/>) | Città della Scienza · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-cittascienza-estate |  | itinerari |
| tp-pompei-orari · [Timetables and tickets](<https://pompeiisites.org/en/visiting-info/timetables-and-tickets/>) | Parco Archeologico di Pompei · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-pompei-orari, tp-pompei-prezzi, tp-pompei-biglietti |  | itinerari |
| tp-pompei-regolamento · [Regulations for visitors](<https://pompeiisites.org/en/visiting-info/regulations-for-visitors/>) | Parco Archeologico di Pompei · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-pompei-biglietti |  | itinerari |
| tp-pompei-tariffe · [Pompei si esplora con tutti i sensi: accessibilità e nuove tariffe di ingresso dal 12 gennaio](<https://pompeiisites.org/comunicati/pompei-si-esplora-con-tutti-i-sensi-accessibilita-e-nuove-tariffe-di-ingresso-dal-12-gennaio/>) | Parco Archeologico di Pompei · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-pompei-prezzi |  | itinerari |
| tp-ercolano-biglietti · [Tickets](<https://ercolano.cultura.gov.it/tickets/>) | Parco Archeologico di Ercolano · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-ercolano-orari, tp-ercolano-prezzi |  | itinerari |
| tp-vesuvio-gran-cono · [The Great Cone of Vesuvius](<https://www.parconazionaledelvesuvio.it/en/visit-the-park/the-paths/the-great-cono-of-vesuvius/>) | Parco Nazionale del Vesuvio · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-vesuvio-orari, tp-vesuvio-prezzi, tp-vesuvio-viaggio |  | itinerari |
| tp-eav-campania-express · [Orari e tariffe Campania Express (PDF)](<https://www.eavsrl.it/download/orari-e-tariffe-campania-express/>) | EAV · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-pompei-viaggio, tp-ercolano-viaggio |  | itinerari |
| tp-eav-campania-express-sospeso · [Campania Express](<https://www.eavsrl.it/campania-express/>) | EAV · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-pompei-viaggio, tp-ercolano-viaggio, tp-sorrento-viaggio |  | itinerari |
| tp-eav-808 · [Orario bus 808 Pompei–Vesuvio](<https://www.eavsrl.it/download/808-pompei-vesuvio/>) | EAV · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-vesuvio-viaggio |  | itinerari |
| tp-caremar-tariffe · [Tariffe](<https://shop.caremar.it/it/tariffe/>) | Caremar · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-capri-viaggio, tp-ischia-viaggio, tp-procida-viaggio |  | itinerari |
| tp-caremar-partenze · [Prossime partenze](<https://shop.caremar.it/it/prossime-partenze/>) | Caremar · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-capri-viaggio, tp-ischia-viaggio, tp-procida-viaggio |  | itinerari |
| tp-caremar-orari · [Orari](<https://shop.caremar.it/it/orari/>) | Caremar · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-isole-2027 |  | itinerari |
| tp-capri-regolamento · [Regolamento di visita](<https://museicapri.cultura.gov.it/it/regolamento-di-visita/>) | Musei e Parchi archeologici di Capri · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-capri-orari, tp-capri-prezzi |  | itinerari |
| tp-ischia-castello · [Castello Aragonese d'Ischia](<https://www.castelloaragoneseischia.com/>) | Castello Aragonese d'Ischia · ufficiale · 2026-10-02 | mantenere-da-verificare | tp-ischia-orari, tp-ischia-prezzi |  | itinerari |
| tp-anm-gtfs · [Orari programmati degli autobus (feed GTFS)](<https://www.anm.it/google/google-transit.zip>) | ANM, Azienda Napoletana Mobilità (dati aperti, licenza IODL 2.0) · dati · 2026-10-03 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-anm-linea1 · [Linea 1](<https://www2.anm.it/index.php?option=com_content&task=view&id=71&Itemid=98>) | ANM, Azienda Napoletana Mobilità · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-comune-linea6 · [Linea 6 della metro: nei giorni feriali corse fino alle 21:10](<https://www.comune.napoli.it/novita/linea-6-della-metro-nei-giorni-feriali-corse-fino-alle-21-10/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-rfi-linea2 · [Quadro orario Linea 2 (14 giugno–12 dicembre 2026)](<https://prm.rfi.it/qo_prm/QO_Pdf.aspx?Tipo=P&lin=it&id=530>) | RFI, Rete Ferroviaria Italiana · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-trenitalia-linea2 · [Circolazione interrotta tra Napoli Campi Flegrei e Pozzuoli Solfatara](<https://www.trenitalia.com/content/trenitalia/it/informazioni/lavori-programmati/20260621-circolazione-interrotta-tra-napoli-campi-flegrei-e-puzzuoli-solfatara.html>) | Trenitalia · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-anm-centrale · [Funicolare Centrale](<https://www2.anm.it/index.php?option=com_content&task=view&id=81&Itemid=98>) | ANM, Azienda Napoletana Mobilità · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-anm-chiaia · [Funicolare di Chiaia](<https://www2.anm.it/index.php?option=com_content&task=view&id=82&Itemid=98>) | ANM, Azienda Napoletana Mobilità · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-anm-mergellina · [Funicolare di Mergellina](<https://www2.anm.it/index.php?option=com_content&task=view&id=84&Itemid=98>) | ANM, Azienda Napoletana Mobilità · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi; src/testi/tappe.yaml#sant-antonio-posillipo | itinerari |
| tp-comune-montesanto · [15 maggio 2026: chiusura della funicolare di Montesanto per la manutenzione ventennale](<https://www.comune.napoli.it/novita/15-maggio-2026-chiusura-funicolare-montesanto-per-manutenzione-ventennale/>) | Comune di Napoli · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-eav-teleindicatori · [Orario treni: partenze e arrivi di Montesanto e Bagnoli (Cumana)](<https://orariotreni.eavsrl.it/>) | EAV · ufficiale · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-copernicus-dem · [Copernicus DEM GLO-30 (modello del terreno a 30 m)](<https://registry.opendata.aws/copernicus-dem/>) | Agenzia Spaziale Europea, programma Copernicus · dati · 2026-10-02 | mantenere-da-verificare | — | src/testi/itinerari.yaml#tempi | itinerari |
| tp-doma-info · [Info e contatti](<https://domasandomenicomaggiore.it/info-e-contatti/>) | DOMA · San Domenico Maggiore (Opera San Domenico Maggiore Onlus) · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-sandomenico-orari |  | itinerari |
| tp-doma-biglietti · [Biglietteria](<https://domasandomenicomaggiore.it/biglietteria/>) | DOMA · San Domenico Maggiore (Opera San Domenico Maggiore Onlus) · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-sandomenico-prezzi |  | itinerari |
| tp-girolamini · [Apertura e orari dei servizi](<https://girolamini.cultura.gov.it/apertura-e-orari-dei-servizi/>) | Complesso monumentale dei Girolamini (Ministero della Cultura) · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-girolamini-orari, tp-girolamini-prezzi |  | itinerari |
| tp-filangieri · [Museo Civico Gaetano Filangieri, pagina principale (orari)](<https://www.museofilangieri.it/>) | Museo Civico Gaetano Filangieri · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-filangieri-orari, tp-filangieri-prezzi |  | itinerari |
| tp-purgatorio · [Orari, visite guidate e biglietti](<https://www.purgatorioadarco.it/>) | Santa Maria delle Anime del Purgatorio ad Arco · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-purgatorio-orari, tp-purgatorio-prezzi |  | itinerari |
| tp-mudd-carbonara · [San Giovanni a Carbonara](<https://www.muddnapoli.it/en/luoghi/san-giovanni-a-carbonara/>) | MUDD · Museo Diocesano Diffuso di Napoli · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-carbonara-orari | src/testi/tappe.yaml#san-giovanni-a-carbonara | itinerari |
| tp-mudd-tetti · [Tetti della Cattedrale (Cathedral roofs)](<https://www.muddnapoli.it/en/luoghi/cathedral-roofs/>) | MUDD · Museo Diocesano Diffuso di Napoli · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-tetti-orari |  | itinerari |
| tp-tetti-italpress · [Napoli vista dai tetti del Duomo, inaugurato un nuovo percorso di visita](<https://www.italpress.com/?p=664594>) | Italpress · stampa · 2026-10-03 | mantenere-da-verificare | tp-tetti-prezzi |  | itinerari |
| tp-villa-pignatelli · [Villa Pignatelli: spazi espositivi e orari](<https://palazzorealedinapoli.org/sedi/villa-pignatelli/>) | Palazzo Reale di Napoli (Ministero della Cultura) · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-pignatelli-orari, tp-pignatelli-prezzi |  | itinerari |
| tp-mercati-municipalita2 · [I mercati di Napoli: Municipalità 2](<https://www.comune.napoli.it/articolo_tematico/commercio-e-artigianato/servizio-mercati/i-mercati-di-napoli/municipalita-2/>) | Comune di Napoli, Servizio Mercati · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-mercati-orari |  | itinerari |
| tp-fai-donn-anna · [Palazzo Donn'Anna](<https://fondoambiente.it/luoghi/palazzo-donn-anna>) | FAI · Fondo per l'Ambiente Italiano (I Luoghi del Cuore) · altro · 2026-10-03 | mantenere-da-verificare | tp-donnanna-orari |  | itinerari |
| tp-parco-camaldoli · [Parco dei Camaldoli](<https://www.comune.napoli.it/vivere-il-comune/luoghi/parco-dei-camaldoli/>) | Comune di Napoli · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-parchi-orari | src/testi/tappe.yaml#camaldoli | itinerari |
| tp-parco-poggio · [Parco del Poggio](<https://www.comune.napoli.it/vivere-il-comune/luoghi/parco-del-poggio/>) | Comune di Napoli · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-parchi-orari |  | itinerari |
| tp-parco-mascagna · [Parco Mascagna](<https://www.comune.napoli.it/vivere-il-comune/luoghi/parco-mascagna/>) | Comune di Napoli · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-parchi-orari |  | itinerari |
| tp-parco-ventaglieri · [Parco Ventaglieri](<https://www.comune.napoli.it/vivere-il-comune/luoghi/parco-ventaglieri/>) | Comune di Napoli · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-ventaglieri-orari |  | itinerari |
| tp-orto-botanico · [Giorni e orari di apertura](<https://www.ortobotaniconapoli.it/it/visitare/giorni-e-orari-di-apertura.html>) | Orto Botanico di Napoli (Università Federico II) · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-orto-orari |  | itinerari |
| tp-mostra-oltremare · [Il parco](<https://mostradoltremare.it/il-parco/>) | Mostra d'Oltremare · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-oltremare-orari, tp-oltremare-prezzi |  | itinerari |
| tp-caserta-orari · [Orari](<https://reggiadicaserta.cultura.gov.it/orari/>) | Reggia di Caserta (Ministero della Cultura) · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-caserta-orari |  | itinerari |
| tp-caserta-biglietti · [Biglietti](<https://reggiadicaserta.cultura.gov.it/biglietti/>) | Reggia di Caserta (Ministero della Cultura) · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-caserta-prezzi |  | itinerari |
| tp-caserta-arrivare · [Come raggiungerci](<https://reggiadicaserta.cultura.gov.it/come-raggiungerci/>) | Reggia di Caserta (Ministero della Cultura) · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-caserta-viaggio |  | itinerari |
| tp-pietrarsa-tariffe · [Orari, tariffe e abbonamenti](<https://www.fondazionefs.it/it/esplora-il-museo/tariffe-abbonamenti.html>) | Fondazione FS Italiane · Museo Nazionale Ferroviario di Pietrarsa · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-pietrarsa-orari, tp-pietrarsa-prezzi, tp-pietrarsa-viaggio |  | itinerari |
| tp-pietrarsa-arrivare · [Come arrivare](<https://www.fondazionefs.it/it/esplora-il-museo/come-arrivare.html>) | Fondazione FS Italiane · Museo Nazionale Ferroviario di Pietrarsa · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-pietrarsa-viaggio |  | itinerari |
| tp-eav-l1-orario · [Orario ferrovia L1 Napoli–Sorrento, valido dal 1° ottobre 2026](<https://www.eavsrl.it/download/orario-ferrovia-l1-napoli-sorrento-valido-dal-1-ottobre-2026/>) | EAV · ufficiale · 2026-10-03 · letta: false | mantenere-da-verificare | tp-sorrento-viaggio |  | itinerari |
| tp-sorrento-centro · [Il centro antico della città di Sorrento](<https://www.comune.sorrento.na.it/it/sezione/cultura-e-turismo/page/il-centro-antico-della-citta-di-sorrento>) | Comune di Sorrento · ufficiale · 2026-10-03 | mantenere-da-verificare | — | src/testi/tappe.yaml#sorrento | itinerari |
| tp-correale · [Visita il museo](<https://www.museocorreale.it/visita-il-museo/>) | Museo Correale di Terranova · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-correale-orari |  | itinerari |
| tp-campolieto · [Villa Campolieto](<https://www.villevesuviane.net/le-ville/villa-campolieto/>) | Fondazione Ente Ville Vesuviane · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-campolieto |  | itinerari |
| tp-villevesuviane-visite · [Visite e biglietti](<https://www.villevesuviane.net/visite/>) | Fondazione Ente Ville Vesuviane · ufficiale · 2026-10-03 | mantenere-da-verificare | tp-campolieto |  | itinerari |
| tp-pietrarsa-visita · [Visita Pietrarsa](<https://www.fondazionefs.it/it/esplora-il-museo/visita-pietrarsa.html>) | Fondazione FS Italiane · Museo Nazionale Ferroviario di Pietrarsa · ufficiale · 2026-10-03 | mantenere-da-verificare | — | src/testi/tappe.yaml#pietrarsa | itinerari |
| lc-da-michele · [Sede di Napoli: orari e prenotazioni](<https://www.damichele.net/sede-di-napoli/>) | L'Antica Pizzeria da Michele · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-da-michele-orari |  | itinerari, doveMangiare |
| lc-da-michele-menu · [Menu della sede di Napoli (PDF)](<https://www.damichele.net/menu/sede_napoli/menu%20Napoli.pdf>) | L'Antica Pizzeria da Michele · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-da-michele-prezzi, lc-da-michele-perche | src/testi/locali.yaml#da-michele | itinerari, doveMangiare |
| lc-port-alba · [Sito ufficiale: storia, orari, piatti](<https://www.anticapizzeriaportalba.com/>) | Antica Pizzeria Port'Alba · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-port-alba-orari, lc-port-alba-prezzi, lc-port-alba-perche | src/testi/locali.yaml#port-alba | itinerari, doveMangiare |
| lc-di-matteo · [Sito ufficiale: orari e contatti](<https://anticapizzeriadimatteo.it/>) | Antica Pizzeria Di Matteo · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-di-matteo-orari, lc-di-matteo-prezzi, lc-di-matteo-perche |  | itinerari, doveMangiare |
| lc-di-matteo-menu · [Menu (PDF, luglio 2022)](<https://anticapizzeriadimatteo.it/wp-content/uploads/2022/07/Menu-Online-20072022.pdf>) | Antica Pizzeria Di Matteo · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-di-matteo-prezzi, lc-di-matteo-perche | src/testi/locali.yaml#di-matteo | itinerari, doveMangiare |
| lc-chitarra · [Contatti e orari](<https://www.osterialachitarra.it/contatti/>) | Osteria La Chitarra · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-chitarra-orari |  | itinerari, doveMangiare |
| lc-chitarra-menu · [Menu](<https://www.osterialachitarra.it/menu/>) | Osteria La Chitarra · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-chitarra-prezzi | src/testi/locali.yaml#chitarra | itinerari, doveMangiare |
| lc-chitarra-storia · [L'osteria](<https://www.osterialachitarra.it/osteria/>) | Osteria La Chitarra · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-chitarra-perche |  | itinerari, doveMangiare |
| lc-gesu-vecchio · [I nostri contatti](<https://www.lalocandagesuvecchionapoli.it/i-nostri-contatti/>) | La Locanda Gesù Vecchio · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-gesu-vecchio-orari |  | itinerari, doveMangiare |
| lc-gesu-vecchio-home · [Sito ufficiale: prenotazione e turni](<https://www.lalocandagesuvecchionapoli.it/>) | La Locanda Gesù Vecchio · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-gesu-vecchio-orari |  | itinerari, doveMangiare |
| lc-gesu-vecchio-menu · [Menu di giugno 2026 (PDF)](<https://www.lalocandagesuvecchionapoli.it/wp-content/uploads/2026/06/MENU-LOCANDA-GIUGNO-2026-1.pdf.pdf>) | La Locanda Gesù Vecchio · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-gesu-vecchio-prezzi | src/testi/locali.yaml#gesu-vecchio | itinerari, doveMangiare |
| lc-di-costanzo · [Sito ufficiale: orari](<https://www.dicostanzopasticceria.it/>) | Pasticceria Di Costanzo · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-di-costanzo-orari | src/testi/locali.yaml#di-costanzo | itinerari, doveMangiare |
| lc-brandi · [Information: orari e prenotazioni](<https://pizzeriabrandi.com/information/>) | Pizzeria Brandi · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-brandi-orari |  | itinerari, doveMangiare |
| lc-brandi-home · [Sito ufficiale: la storia](<https://pizzeriabrandi.com/>) | Pizzeria Brandi · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-brandi-perche | src/testi/locali.yaml#brandi | itinerari, doveMangiare |
| lc-zia-esterina · [Antica Pizza Fritta da Zia Esterina Sorbillo: sedi e orari](<https://www.sorbillo.it/antica-pizza-fritta-da-zia-esterina-sorbillo/>) | Gino Sorbillo · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-zia-esterina-orari | src/testi/locali.yaml#zia-esterina | itinerari, doveMangiare |
| lc-hosteria-toledo · [Sito ufficiale: orari e contatti](<https://www.hosteriatoledo.it/>) | Hosteria Toledo · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-hosteria-toledo-orari, lc-hosteria-toledo-perche |  | itinerari, doveMangiare |
| lc-hosteria-toledo-menu · [Menu (PDF caricato a maggio 2023)](<https://www.hosteriatoledo.it/wp-content/uploads/2023/05/HOSTERIA-TOLEDO-menu-A4-print.pdf>) | Hosteria Toledo · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-hosteria-toledo-prezzi | src/testi/locali.yaml#hosteria-toledo | itinerari, doveMangiare |
| lc-gobbetto · [Contatti e orari](<https://osteria-il-gobbetto3.webnode.it/contatti/>) | Osteria Il Gobbetto · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-gobbetto-orari, lc-gobbetto-perche | src/testi/locali.yaml#gobbetto | itinerari, doveMangiare |
| lc-nennella · [Sedi e orari](<https://www.trattorianennella.it/sedi/>) | Trattoria da Nennella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-nennella-orari | src/testi/locali.yaml#nennella | itinerari, doveMangiare |
| lc-nennella-domande · [Domande frequenti: prenotazione](<https://www.trattorianennella.it/domande/>) | Trattoria da Nennella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-nennella-orari |  | itinerari, doveMangiare |
| lc-pintauro · [Contatti e orari](<https://www.pasticceriapintauro1785.it/contatti/>) | Pasticceria Pintauro · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-pintauro-orari, lc-pintauro-perche | src/testi/locali.yaml#pintauro | itinerari, doveMangiare |
| lc-cinquanta-kalo · [Info: orari e prenotazioni](<https://50kalo.it/info.php>) | 50 Kalò · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-cinquanta-kalo-orari |  | itinerari, doveMangiare |
| lc-cinquanta-kalo-menu · [Menu di Napoli (PDF, file del luglio 2026)](<https://50kalo.it/download/menu_napoli_2023.pdf>) | 50 Kalò · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-cinquanta-kalo-prezzi | src/testi/locali.yaml#cinquanta-kalo | itinerari, doveMangiare |
| lc-salvo · [Dove siamo: orari](<https://www.pizzeriasalvo.it/dove-siamo/>) | Pizzeria Salvo · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-salvo-orari |  | itinerari, doveMangiare |
| lc-salvo-menu · [Menu dell'11 maggio 2026 (PDF)](<https://www.pizzeriasalvo.it/wp-content/uploads/2026/06/Salvo_Menu_11_05_26.pdf>) | Pizzeria Salvo · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-salvo-prezzi | src/testi/locali.yaml#salvo | itinerari, doveMangiare |
| lc-pignatelli · [Sito ufficiale: orari e prenotazioni](<https://www.ostariapignatelli.com/>) | Ostaria Pignatelli · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-pignatelli-orari |  | itinerari, doveMangiare |
| lc-pignatelli-menu · [Menu digitale: i primi](<https://www.quickermenu.it/ostariapignatelli/i-primi/>) | Ostaria Pignatelli (QuickerMenu) · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-pignatelli-prezzi | src/testi/locali.yaml#pignatelli | itinerari, doveMangiare |
| lc-cantinella · [Contatti e orari](<https://lacantinella.it/contatti-ristorante-napoli/>) | La Cantinella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-cantinella-orari |  | itinerari, doveMangiare |
| lc-cantinella-home · [Sito ufficiale: la storia](<https://lacantinella.it/>) | La Cantinella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-cantinella-perche |  | itinerari, doveMangiare |
| lc-cantinella-menu · [Menu (PDF)](<https://lacantinella.it/wp-content/uploads/2025/09/Menu-tavoli.pdf>) | La Cantinella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-cantinella-prezzi | src/testi/locali.yaml#cantinella | itinerari, doveMangiare |
| lc-bersagliera · [Contatti e orari](<https://www.labersagliera.it/contatti/>) | La Bersagliera · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-bersagliera-orari |  | itinerari, doveMangiare |
| lc-bersagliera-home · [Sito ufficiale: la storia](<https://www.labersagliera.it/>) | La Bersagliera · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-bersagliera-perche | src/testi/locali.yaml#bersagliera | itinerari, doveMangiare |
| lc-scialuppa · [Sito ufficiale: orari e piatti](<https://www.lascialuppa.net/>) | La Scialuppa · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-scialuppa-orari, lc-scialuppa-perche | src/testi/locali.yaml#scialuppa | itinerari, doveMangiare |
| lc-calabritto · [Contatti e orari](<https://napoli.terrazzacalabritto.it/contatti/>) | Terrazza Calabritto · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-calabritto-orari |  | itinerari, doveMangiare |
| lc-calabritto-menu · [Menu](<https://napoli.terrazzacalabritto.it/menu/>) | Terrazza Calabritto · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-calabritto-prezzi, lc-calabritto-perche | src/testi/locali.yaml#calabritto | itinerari, doveMangiare |
| lc-chalet-ciro · [Sede di Mergellina: orari](<https://www.chaletciro1952.com/sedi/mergellina/>) | Chalet Ciro 1952 · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-chalet-ciro-orari | src/testi/locali.yaml#chalet-ciro | itinerari, doveMangiare |
| lc-chalet-ciro-storia · [La storia](<https://www.chaletciro1952.com/storia/>) | Chalet Ciro 1952 · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-chalet-ciro-perche |  | itinerari, doveMangiare |
| lc-caffettiera · [Sito ufficiale: orari e prenotazioni](<https://www.grancaffelacaffettiera.com/>) | Gran Caffè La Caffettiera · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-caffettiera-orari, lc-caffettiera-perche | src/testi/locali.yaml#caffettiera | itinerari, doveMangiare |
| lc-gorizia · [Sito ufficiale: orari e contatti](<https://www.gorizia1916.com/>) | Pizzeria Gorizia 1916 · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-gorizia-orari, lc-gorizia-perche | src/testi/locali.yaml#gorizia | itinerari, doveMangiare |
| lc-bellavia · [Contatti e orari](<https://www.bellaviavomero.it/contatti>) | Pasticceria Bellavia · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-bellavia-orari | src/testi/locali.yaml#bellavia | itinerari, doveMangiare |
| lc-bellavia-store · [Negozio online](<https://www.bellaviavomero.it/store>) | Pasticceria Bellavia · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-bellavia-prezzi |  | itinerari, doveMangiare |
| lc-bellavia-storia · [La nostra storia](<https://www.bellaviavomero.it/la-nostra-storia>) | Pasticceria Bellavia · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-bellavia-perche |  | itinerari, doveMangiare |
| lc-meatin · [Sito ufficiale: orari e menu](<https://www.meatin.it/>) | Meatin · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-meatin-orari, lc-meatin-prezzi, lc-meatin-perche | src/testi/locali.yaml#meatin | itinerari, doveMangiare |
| lc-starita · [Dove siamo: orari](<https://pizzeriestarita.it/dove-siamo/>) | Pizzerie Starita · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-starita-orari |  | itinerari, doveMangiare |
| lc-starita-menu · [Menu di Napoli (PDF, novembre 2024)](<https://pizzeriestarita.it/wp-content/uploads/2024/11/Starita_QR_Napoli_ITA.pdf>) | Pizzerie Starita · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-starita-prezzi | src/testi/locali.yaml#starita | itinerari, doveMangiare |
| lc-concettina · [Contatti e orari](<https://www.concettinaaitresanti.com/contacts/>) | Concettina ai Tre Santi · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-concettina-orari | src/testi/locali.yaml#concettina | itinerari, doveMangiare |
| lc-concettina-storia · [La storia](<https://www.concettinaaitresanti.com/concettina/>) | Concettina ai Tre Santi · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-concettina-perche |  | itinerari, doveMangiare |
| lc-poppella · [Punti vendita e orari](<https://www.pasticceriapoppella.com/punti-vendita/>) | Pasticceria Poppella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-poppella-orari | src/testi/locali.yaml#poppella | itinerari, doveMangiare |
| lc-poppella-storia · [La storia](<https://www.pasticceriapoppella.com/storia/>) | Pasticceria Poppella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-poppella-perche |  | itinerari, doveMangiare |
| lc-petrucci-posillipo · [Pizzeria Palazzo Petrucci a Posillipo](<https://palazzopetrucci.it/pizzeria-palazzo-petrucci-posillipo-napoli/>) | Palazzo Petrucci · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-petrucci-posillipo-orari, lc-petrucci-posillipo-prezzi, lc-petrucci-posillipo-perche | src/testi/locali.yaml#petrucci-posillipo | itinerari, doveMangiare |
| lc-tufo · [Informazioni: orari della trattoria e dell'asporto](<https://tufotrattoria.it/informazioni/>) | Tufò · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-tufo-orari, lc-tufo-perche | src/testi/locali.yaml#tufo | itinerari, doveMangiare |
| lc-fenestella · [Contatti e orari](<https://www.ristoranteafenestella.it/contatti/>) | Ristorante 'A Fenestella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-fenestella-orari |  | itinerari, doveMangiare |
| lc-fenestella-home · [Sito ufficiale: la storia](<https://www.ristoranteafenestella.it/>) | Ristorante 'A Fenestella · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-fenestella-perche | src/testi/locali.yaml#fenestella | itinerari, doveMangiare |
| lc-cicciotto · [Cicciotto a Marechiaro dal 1942: orari](<https://www.trattoriadacicciotto.it/trattoria-da-cicciotto-a-marechiaro-dal-1942/>) | Cicciotto a Marechiaro · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-cicciotto-orari, lc-cicciotto-perche |  | itinerari, doveMangiare |
| lc-cicciotto-menu · [Menu della trattoria (PDF)](<https://www.trattoriadacicciotto.it/menu/menutrattoria.pdf>) | Cicciotto a Marechiaro · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-cicciotto-prezzi | src/testi/locali.yaml#cicciotto | itinerari, doveMangiare |
| lc-macellegria · [Contatti e orari](<https://www.macellegria.it/contatti/>) | Macellegria · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-macellegria-orari, lc-macellegria-perche |  | itinerari, doveMangiare |
| lc-macellegria-menu · [Menu](<https://www.macellegria.it/menu/>) | Macellegria · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-macellegria-prezzi | src/testi/locali.yaml#macellegria | itinerari, doveMangiare |
| sdg-michelin-2025-pizzerie · [Quali sono le pizzerie nella Guida Michelin](<https://www.scattidigusto.it/quali-sono-le-pizzerie-nella-guida-michelin>) | Scatti di Gusto · stampa · 2026-10-04 | mantenere-da-verificare | lc-da-michele-perche, lc-cinquanta-kalo-perche, lc-salvo-perche, lc-concettina-perche |  | itinerari, doveMangiare |
| sky-50top-2026 · [Migliori pizzerie d'Italia, la classifica 50 Top Pizza 2026](<https://tg24.sky.it/lifestyle/2026/07/24/migliori-pizzerie-d-italia-classifica-2026>) | Sky TG24 · stampa · 2026-10-04 | mantenere-da-verificare | lc-cinquanta-kalo-perche, lc-salvo-perche, lc-gorizia-perche, lc-petrucci-posillipo-perche |  | itinerari, doveMangiare |
| sdg-bib-2025 · [I 16 nuovi ristoranti Bib Gourmand della Guida Michelin 2025](<https://www.scattidigusto.it/i-16-nuovi-ristoranti-bib-gourmand-della-guida-michelin-2025>) | Scatti di Gusto · stampa · 2026-10-04 | mantenere-da-verificare | lc-pignatelli-perche |  | itinerari, doveMangiare |
| sdg-pignatelli-2026 · [Ostaria Pignatelli a Napoli: menu, prezzi, recensione](<https://www.scattidigusto.it/ostaria-pignatelli-a-napoli-menu-prezzi-recensione>) | Scatti di Gusto · stampa · 2026-10-04 | mantenere-da-verificare | lc-pignatelli-rinomato |  | itinerari, doveMangiare |
| sdg-slowfood-2025 · [Osterie Slow Food 2025: le Chiocciole](<https://www.scattidigusto.it/osterie-slow-food-2025-le-chiocciole-mangi-bene-spendi-poco>) | Scatti di Gusto · stampa · 2026-10-04 | mantenere-da-verificare | lc-chitarra-perche |  | itinerari, doveMangiare |
| gri-pasta-patate-2024 · [Where to eat pasta, potatoes, and provola in Naples. The 8 best restaurants chosen by Gambero Rosso](<https://www.gamberorossointernational.com/?p=513457>) | Gambero Rosso International · stampa · 2026-10-04 | mantenere-da-verificare | lc-gesu-vecchio-perche, lc-nennella-perche |  | itinerari, doveMangiare |
| gri-cuoppo-2024 · [The best cuoppo in Naples: must-visit spots](<https://www.gamberorossointernational.com/news/the-best-cuoppo-in-naples-must-visit-spots/>) | Gambero Rosso International · stampa · 2026-10-04 | mantenere-da-verificare | lc-di-matteo-rinomato |  | itinerari, doveMangiare |
| gri-pizza-fritta-2023 · [Where to eat the best pizza fritta in Naples](<https://gamberorossointernational.com/?p=481956>) | Gambero Rosso International · stampa · 2026-10-04 | mantenere-da-verificare | lc-zia-esterina-perche |  | itinerari, doveMangiare |
| napolitan-pasticcerie-2022 · [Gambero Rosso: le migliori pasticcerie di Napoli sono sette](<https://napolitan.it/2022/05/17/119813/gambero-rosso-le-migliori-pasticcerie-napoli-sette-quali/>) | Napolitan.it · stampa · 2026-10-04 | mantenere-da-verificare | lc-di-costanzo-perche, lc-poppella-perche, lc-poppella-rinomato |  | itinerari, doveMangiare |
| sdg-pintauro-2026 · [Pintauro, il tempio delle sfogliatelle riapre a Napoli](<https://www.scattidigusto.it/pintauro-tempio-di-sfogliatelle-riapre-a-napoli-nuova-storia>) | Scatti di Gusto · stampa · 2026-10-04 | mantenere-da-verificare | lc-pintauro-perche |  | itinerari, doveMangiare |
| sdg-cono-graffa · [Napoli: il cono graffa di Chalet Ciro a Mergellina](<https://www.scattidigusto.it/napoli-gelato-cono-graffa-chalet-ciro-mergellina>) | Scatti di Gusto · stampa · 2026-10-04 | mantenere-da-verificare | lc-chalet-ciro-rinomato |  | itinerari, doveMangiare |
| stripes-tufo-2022 · [Naples ragu and genovese: Tufò](<https://www.stripes.com/living/europe_travel/after_hours/2022-12-29/naples-ragu-genovese-8416535.html>) | Stars and Stripes · stampa · 2026-10-04 | mantenere-da-verificare | lc-tufo-rinomato |  | itinerari, doveMangiare |
| lc-starita-home · [Sito ufficiale: «il rito della pizza dal 1901»](<https://pizzeriestarita.it/>) | Pizzerie Starita · ufficiale · 2026-10-04 | mantenere-da-verificare | lc-starita-perche |  | itinerari, doveMangiare |
| wiki-margherita · [Pizza Margherita](<https://it.wikipedia.org/wiki/Pizza_Margherita>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-margherita | doveMangiare |
| wiki-marinara · [Pizza alla marinara](<https://it.wikipedia.org/wiki/Pizza_marinara>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-marinara | doveMangiare |
| wiki-pizza-fritta · [Pizza fritta](<https://it.wikipedia.org/wiki/Pizza_fritta>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-pizza-fritta | doveMangiare |
| wiki-frittatina · [Frittata di pasta](<https://it.wikipedia.org/wiki/Frittatina_di_pasta>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-frittatina | doveMangiare |
| wiki-genovese · [Genovese (sugo)](<https://it.wikipedia.org/wiki/Genovese_(sugo)>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-genovese | doveMangiare |
| wiki-ragu · [Ragù napoletano](<https://it.wikipedia.org/wiki/Rag%C3%B9_napoletano>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-ragu | doveMangiare |
| wiki-pasta-patate · [Cucina napoletana](<https://it.wikipedia.org/wiki/Cucina_napoletana>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-pasta-patate | doveMangiare |
| wiki-vongole · [Spaghetti alle vongole](<https://it.wikipedia.org/wiki/Spaghetti_alle_vongole>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-vongole | doveMangiare |
| wiki-frittura · [Frittura di pesce](<https://it.wikipedia.org/wiki/Frittura_di_pesce>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-frittura | doveMangiare |
| wiki-parmigiana · [Parmigiana](<https://it.wikipedia.org/wiki/Parmigiana>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-parmigiana | doveMangiare |
| wiki-baccala · [Baccalà](<https://it.wikipedia.org/wiki/Bacc%C3%A0l%C3%A0>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-baccala | doveMangiare |
| wiki-sfogliatella · [Sfogliatella](<https://it.wikipedia.org/wiki/Sfogliatella>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-sfogliatella | doveMangiare |
| wiki-baba · [Babà](<https://it.wikipedia.org/wiki/Bab%C3%A0>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-baba | doveMangiare |
| wiki-pastiera · [Pastiera](<https://it.wikipedia.org/wiki/Pastiera>) | Wikipedia · enciclopedia · 2026-10-04 | mantenere-da-verificare | — | src/testi/dove-mangiare.yaml#piatto-pastiera | doveMangiare |

## Tutte le schede e le radici

Il JSON conserva anche testi, fonti, date e scadenze.

| Scheda | Stato · anno effettivo | Consumatori |
|---|---|---|
| cal-flotta | confermato · 2027 | src/data/eventi.ts#lvc-flotta |
| cal-rr | confermato · 2027 | src/data/eventi.ts#lvc-rr1; src/data/eventi.ts#lvc-rr2; src/data/eventi.ts#lvc-rr3 |
| cal-pausa | confermato · 2027 | src/data/eventi.ts#pausa |
| cal-ripescaggio | confermato · 2027 | src/data/eventi.ts#lvc-ripescaggio |
| cal-semifinali | confermato · 2027 | src/data/eventi.ts#lvc-semifinali |
| cal-finale-lvc | confermato · 2027 | src/data/eventi.ts#lvc-finale |
| cal-youth | confermato · 2027 | src/data/eventi.ts#youth |
| cal-womens | confermato · 2027 | src/data/eventi.ts#womens |
| cal-match | confermato · 2027 | src/data/eventi.ts#match |
| cal-orari | atteso · 2027 | src/testi/itinerari.yaml#regate |
| cal-orari-2026 | confermato · 2026 | src/testi/itinerari.yaml#regate |
| vil-caracciolo | confermato · 2027 | src/testi/tappe.yaml#lungomare |
| trasporti-2027-atteso | atteso · 2027 | src/testi/itinerari.yaml#tempi |
| tp-duomo-orari | confermato · 2027 | src/data/tappe.yaml#duomo.orari |
| tp-duomo-prezzi | confermato · 2027 | src/testi/tappe.yaml#duomo; src/data/tappe.yaml#duomo.prezzi |
| tp-tesoro-durata | confermato · 2027 | src/testi/tappe.yaml#duomo |
| tp-sansevero-orari | confermato · 2027 | src/testi/itinerari.yaml#pronto-mezza-giornata; src/testi/itinerari.yaml#pronto-un-giorno; src/testi/itinerari.yaml#pronto-due-giorni; src/data/tappe.yaml#sansevero.orari; src/pages/index.astro#getEntry e esempio metodo |
| tp-sansevero-prezzi | confermato · 2027 | src/data/tappe.yaml#sansevero.prezzi |
| tp-sansevero-prenota | confermato · 2027 | src/testi/itinerari.yaml#pronto-mezza-giornata; src/testi/tappe.yaml#sansevero |
| tp-sansevero-regole | confermato · 2027 | src/testi/tappe.yaml#sansevero |
| tp-santachiara-orari | confermato · 2027 | src/data/tappe.yaml#santa-chiara.orari |
| tp-santachiara-prezzi | confermato · 2027 | src/testi/tappe.yaml#santa-chiara; src/data/tappe.yaml#santa-chiara.prezzi |
| tp-spaccanapoli-orari | segnalato · 2027 | src/testi/tappe.yaml#spaccanapoli; src/data/tappe.yaml#spaccanapoli.orari |
| tp-tribunali-orari | confermato · 2027 | src/testi/tappe.yaml#tribunali; src/data/tappe.yaml#tribunali.orari |
| tp-piomonte-orari | confermato · 2027 | src/testi/tappe.yaml#pio-monte; src/data/tappe.yaml#pio-monte.orari |
| tp-piomonte-prezzi | confermato · 2027 | src/data/tappe.yaml#pio-monte.prezzi |
| tp-mann-orari | confermato · 2027 | src/testi/itinerari.yaml#pronto-due-giorni; src/testi/tappe.yaml#mann; src/data/tappe.yaml#mann.orari |
| tp-mann-prezzi | confermato · 2027 | src/testi/tappe.yaml#mann; src/data/tappe.yaml#mann.prezzi |
| tp-sanlorenzo-orari | confermato · 2027 | src/testi/tappe.yaml#san-lorenzo; src/data/tappe.yaml#san-lorenzo.orari |
| tp-sanlorenzo-prezzi | confermato · 2027 | src/data/tappe.yaml#san-lorenzo.prezzi |
| tp-sotterranea-orari | confermato · 2027 | src/data/tappe.yaml#napoli-sotterranea.orari |
| tp-sotterranea-prezzi | confermato · 2027 | src/testi/tappe.yaml#napoli-sotterranea; src/data/tappe.yaml#napoli-sotterranea.prezzi |
| tp-sotterranea-visita | confermato · 2027 | src/testi/tappe.yaml#napoli-sotterranea |
| tp-madre-orari | confermato · 2027 | src/testi/itinerari.yaml#pronto-tre-giorni; src/testi/tappe.yaml#madre; src/data/tappe.yaml#madre.orari |
| tp-madre-prezzi | confermato · 2027 | src/data/tappe.yaml#madre.prezzi |
| tp-plebiscito-orari | confermato · 2027 | src/testi/tappe.yaml#plebiscito; src/data/tappe.yaml#plebiscito.orari |
| tp-palazzoreale-orari | confermato · 2027 | src/testi/itinerari.yaml#pronto-due-giorni; src/testi/itinerari.yaml#pronto-regata; src/data/tappe.yaml#palazzo-reale.orari |
| tp-palazzoreale-prezzi | confermato · 2027 | src/data/tappe.yaml#palazzo-reale.prezzi |
| tp-palazzoreale-restauri | confermato · 2027 | src/testi/tappe.yaml#palazzo-reale |
| tp-sancarlo-orari | confermato · 2027 | src/testi/tappe.yaml#san-carlo; src/data/tappe.yaml#san-carlo.orari |
| tp-sancarlo-prezzi | confermato · 2027 | src/data/tappe.yaml#san-carlo.prezzi |
| tp-castelnuovo-orari | confermato · 2027 | src/testi/tappe.yaml#castel-nuovo; src/data/tappe.yaml#castel-nuovo.orari |
| tp-castelnuovo-prezzi | confermato · 2027 | src/data/tappe.yaml#castel-nuovo.prezzi |
| tp-toledo-orari | confermato · 2027 | src/testi/tappe.yaml#toledo; src/data/tappe.yaml#toledo.orari |
| tp-borbonica-orari | confermato · 2027 | src/testi/tappe.yaml#galleria-borbonica; src/data/tappe.yaml#galleria-borbonica.orari |
| tp-borbonica-prezzi | confermato · 2027 | src/testi/tappe.yaml#galleria-borbonica; src/data/tappe.yaml#galleria-borbonica.prezzi |
| tp-echia-orari | confermato · 2027 | src/testi/tappe.yaml#monte-echia; src/data/tappe.yaml#monte-echia.orari |
| tp-echia-prezzi | confermato · 2027 | src/testi/tappe.yaml#monte-echia; src/data/tappe.yaml#monte-echia.prezzi |
| tp-echia-recinzione | confermato · 2027 | src/testi/tappe.yaml#monte-echia |
| tp-borgo-orari | confermato · 2027 | src/testi/tappe.yaml#borgo-marinari; src/data/tappe.yaml#borgo-marinari.orari |
| tp-lungomare-orari | confermato · 2027 | src/testi/tappe.yaml#lungomare; src/data/tappe.yaml#lungomare.orari |
| tp-dadom-orari | confermato · 2027 | src/testi/tappe.yaml#dadom; src/data/tappe.yaml#dadom.orari |
| tp-dadom-prezzi | confermato · 2027 | src/testi/tappe.yaml#dadom; src/data/tappe.yaml#dadom.prezzi |
| tp-santelmo-orari | confermato · 2027 | src/testi/tappe.yaml#sant-elmo; src/data/tappe.yaml#sant-elmo.orari |
| tp-santelmo-prezzi | confermato · 2027 | src/data/tappe.yaml#sant-elmo.prezzi |
| tp-sanmartino-orari | confermato · 2027 | src/testi/itinerari.yaml#pronto-un-giorno; src/testi/itinerari.yaml#pronto-due-giorni; src/testi/tappe.yaml#san-martino; src/data/tappe.yaml#san-martino.orari |
| tp-sanmartino-prezzi | confermato · 2027 | src/testi/tappe.yaml#san-martino; src/data/tappe.yaml#san-martino.prezzi |
| tp-floridiana-orari | confermato · 2027 | src/testi/tappe.yaml#floridiana; src/data/tappe.yaml#floridiana.orari |
| tp-floridiana-prezzi | confermato · 2027 | src/testi/tappe.yaml#floridiana; src/data/tappe.yaml#floridiana.prezzi |
| tp-pedamentina-orari | confermato · 2027 | src/testi/tappe.yaml#pedamentina; src/data/tappe.yaml#pedamentina.orari |
| tp-catacombe-orari | confermato · 2027 | src/testi/itinerari.yaml#pronto-tre-giorni; src/testi/tappe.yaml#catacombe; src/data/tappe.yaml#catacombe.orari |
| tp-catacombe-prezzi | confermato · 2027 | src/testi/itinerari.yaml#pronto-tre-giorni; src/testi/tappe.yaml#catacombe; src/data/tappe.yaml#catacombe.prezzi |
| tp-catacombe-note | confermato · 2027 | src/testi/tappe.yaml#catacombe |
| tp-sanita-orari | confermato · 2027 | src/testi/tappe.yaml#sanita; src/data/tappe.yaml#sanita.orari |
| tp-fontanelle-orari | confermato · 2027 | src/testi/tappe.yaml#fontanelle; src/data/tappe.yaml#fontanelle.orari |
| tp-fontanelle-prezzi | confermato · 2027 | src/testi/tappe.yaml#fontanelle; src/data/tappe.yaml#fontanelle.prezzi |
| tp-capodimonte-orari | confermato · 2027 | src/testi/itinerari.yaml#pronto-tre-giorni; src/testi/tappe.yaml#capodimonte; src/data/tappe.yaml#capodimonte.orari |
| tp-capodimonte-prezzi | confermato · 2027 | src/testi/tappe.yaml#capodimonte; src/data/tappe.yaml#capodimonte.prezzi |
| tp-virgilio-orari | confermato · 2027 | src/testi/tappe.yaml#virgilio; src/data/tappe.yaml#virgilio.orari |
| tp-virgilio-prezzi | confermato · 2025 | src/testi/tappe.yaml#virgilio; src/data/tappe.yaml#virgilio.prezzi |
| tp-marechiaro-orari | confermato · 2026 | src/testi/tappe.yaml#marechiaro; src/data/tappe.yaml#marechiaro.orari |
| tp-gaiola-orari | confermato · 2027 | src/testi/tappe.yaml#gaiola; src/data/tappe.yaml#gaiola.orari |
| tp-gaiola-prezzi | confermato · 2027 | src/data/tappe.yaml#gaiola.prezzi |
| tp-gaiola-prenota | confermato · 2027 | src/testi/tappe.yaml#gaiola |
| tp-virgiliano-orari | confermato · 2027 | src/testi/tappe.yaml#parco-virgiliano; src/data/tappe.yaml#parco-virgiliano.orari |
| tp-cittascienza-orari | confermato · 2027 | src/testi/tappe.yaml#citta-scienza; src/data/tappe.yaml#citta-scienza.orari |
| tp-cittascienza-estate | atteso · 2027 | src/testi/tappe.yaml#citta-scienza |
| tp-cittascienza-prezzi | confermato · 2027 | src/data/tappe.yaml#citta-scienza.prezzi |
| tp-pompei-orari | confermato · 2027 | src/data/tappe.yaml#pompei.orari |
| tp-pompei-prezzi | confermato · 2027 | src/data/tappe.yaml#pompei.prezzi |
| tp-pompei-biglietti | confermato · 2027 | src/testi/tappe.yaml#pompei |
| tp-pompei-viaggio | confermato · 2027 | src/testi/tappe.yaml#pompei; src/data/tappe.yaml#pompei.viaggio |
| tp-ercolano-orari | confermato · 2027 | src/data/tappe.yaml#ercolano.orari |
| tp-ercolano-prezzi | confermato · 2027 | src/testi/tappe.yaml#ercolano; src/data/tappe.yaml#ercolano.prezzi |
| tp-ercolano-viaggio | confermato · 2027 | src/testi/tappe.yaml#ercolano; src/data/tappe.yaml#ercolano.viaggio |
| tp-vesuvio-orari | confermato · 2027 | src/testi/tappe.yaml#vesuvio; src/data/tappe.yaml#vesuvio.orari |
| tp-vesuvio-prezzi | confermato · 2027 | src/testi/tappe.yaml#vesuvio; src/data/tappe.yaml#vesuvio.prezzi |
| tp-vesuvio-viaggio | confermato · 2027 | src/testi/tappe.yaml#vesuvio; src/data/tappe.yaml#vesuvio.viaggio |
| tp-capri-orari | confermato · 2027 | src/testi/tappe.yaml#capri; src/data/tappe.yaml#capri.orari |
| tp-capri-prezzi | confermato · 2027 | src/data/tappe.yaml#capri.prezzi |
| tp-capri-viaggio | confermato · 2027 | src/testi/tappe.yaml#capri; src/data/tappe.yaml#capri.viaggio |
| tp-ischia-orari | confermato · 2027 | src/testi/tappe.yaml#ischia; src/data/tappe.yaml#ischia.orari |
| tp-ischia-prezzi | confermato · 2027 | src/data/tappe.yaml#ischia.prezzi |
| tp-ischia-viaggio | confermato · 2027 | src/testi/tappe.yaml#ischia; src/data/tappe.yaml#ischia.viaggio |
| tp-procida-viaggio | confermato · 2027 | src/testi/tappe.yaml#procida; src/data/tappe.yaml#procida.viaggio |
| tp-isole-2027 | atteso · 2027 | src/testi/itinerari.yaml#gite; src/testi/tappe.yaml#capri; src/testi/tappe.yaml#ischia; src/testi/tappe.yaml#procida |
| tp-sandomenico-orari | confermato · 2027 | src/testi/tappe.yaml#san-domenico; src/data/tappe.yaml#san-domenico.orari |
| tp-sandomenico-prezzi | confermato · 2027 | src/testi/tappe.yaml#san-domenico; src/data/tappe.yaml#san-domenico.prezzi |
| tp-girolamini-orari | confermato · 2027 | src/testi/tappe.yaml#girolamini; src/data/tappe.yaml#girolamini.orari |
| tp-girolamini-prezzi | confermato · 2027 | src/testi/tappe.yaml#girolamini; src/data/tappe.yaml#girolamini.prezzi |
| tp-filangieri-orari | confermato · 2027 | src/testi/tappe.yaml#filangieri; src/data/tappe.yaml#filangieri.orari |
| tp-filangieri-prezzi | confermato · 2027 | src/data/tappe.yaml#filangieri.prezzi |
| tp-purgatorio-orari | confermato · 2027 | src/testi/tappe.yaml#purgatorio-ad-arco; src/data/tappe.yaml#purgatorio-ad-arco.orari |
| tp-purgatorio-prezzi | confermato · 2027 | src/testi/tappe.yaml#purgatorio-ad-arco; src/data/tappe.yaml#purgatorio-ad-arco.prezzi |
| tp-carbonara-orari | confermato · 2027 | src/testi/tappe.yaml#san-giovanni-a-carbonara; src/data/tappe.yaml#san-giovanni-a-carbonara.orari |
| tp-tetti-orari | confermato · 2027 | src/testi/tappe.yaml#tetti-duomo; src/data/tappe.yaml#tetti-duomo.orari |
| tp-tetti-prezzi | stampa · 2026 | src/testi/tappe.yaml#tetti-duomo; src/data/tappe.yaml#tetti-duomo.prezzi |
| tp-pignatelli-orari | confermato · 2027 | src/testi/tappe.yaml#villa-pignatelli; src/data/tappe.yaml#villa-pignatelli.orari |
| tp-pignatelli-prezzi | confermato · 2027 | src/testi/tappe.yaml#villa-pignatelli; src/data/tappe.yaml#villa-pignatelli.prezzi |
| tp-mercati-orari | confermato · 2027 | src/testi/tappe.yaml#mercato-porta-nolana; src/testi/tappe.yaml#pignasecca; src/data/tappe.yaml#mercato-porta-nolana.orari; src/data/tappe.yaml#pignasecca.orari |
| tp-donnanna-orari | confermato · 2027 | src/testi/tappe.yaml#palazzo-donn-anna; src/data/tappe.yaml#palazzo-donn-anna.orari |
| tp-belvedere-orari | confermato · 2027 | src/testi/tappe.yaml#sant-antonio-posillipo; src/testi/tappe.yaml#via-petrarca; src/data/tappe.yaml#sant-antonio-posillipo.orari; src/data/tappe.yaml#via-petrarca.orari |
| tp-parchi-orari | confermato · 2027 | src/testi/tappe.yaml#parco-mascagna; src/testi/tappe.yaml#camaldoli; src/testi/tappe.yaml#parco-poggio; src/data/tappe.yaml#parco-mascagna.orari; src/data/tappe.yaml#camaldoli.orari; src/data/tappe.yaml#parco-poggio.orari |
| tp-ventaglieri-orari | confermato · 2027 | src/testi/tappe.yaml#ventaglieri; src/data/tappe.yaml#ventaglieri.orari |
| tp-orto-orari | confermato · 2027 | src/testi/tappe.yaml#orto-botanico; src/data/tappe.yaml#orto-botanico.orari |
| tp-oltremare-orari | confermato · 2027 | src/testi/tappe.yaml#mostra-oltremare; src/data/tappe.yaml#mostra-oltremare.orari |
| tp-oltremare-prezzi | confermato · 2027 | src/testi/tappe.yaml#mostra-oltremare; src/data/tappe.yaml#mostra-oltremare.prezzi |
| tp-caserta-orari | confermato · 2027 | src/testi/tappe.yaml#caserta; src/data/tappe.yaml#caserta.orari |
| tp-caserta-prezzi | confermato · 2027 | src/data/tappe.yaml#caserta.prezzi |
| tp-caserta-viaggio | confermato · 2027 | src/testi/tappe.yaml#caserta; src/data/tappe.yaml#caserta.viaggio |
| tp-pietrarsa-orari | confermato · 2027 | src/testi/tappe.yaml#pietrarsa; src/data/tappe.yaml#pietrarsa.orari |
| tp-pietrarsa-prezzi | confermato · 2027 | src/data/tappe.yaml#pietrarsa.prezzi |
| tp-pietrarsa-viaggio | confermato · 2027 | src/testi/tappe.yaml#pietrarsa; src/data/tappe.yaml#pietrarsa.viaggio |
| tp-sorrento-viaggio | confermato · 2027 | src/testi/tappe.yaml#sorrento; src/data/tappe.yaml#sorrento.viaggio |
| tp-correale-orari | confermato · 2027 | src/testi/tappe.yaml#sorrento; src/data/tappe.yaml#sorrento.orari |
| tp-campolieto | confermato · 2027 | src/testi/tappe.yaml#ercolano |
| lc-da-michele-orari | confermato · 2027 | src/data/locali.yaml#da-michele.orari |
| lc-port-alba-orari | confermato · 2027 | src/data/locali.yaml#port-alba.orari |
| lc-di-matteo-orari | confermato · 2027 | src/data/locali.yaml#di-matteo.orari |
| lc-chitarra-orari | confermato · 2027 | src/data/locali.yaml#chitarra.orari |
| lc-gesu-vecchio-orari | confermato · 2027 | src/data/locali.yaml#gesu-vecchio.orari |
| lc-di-costanzo-orari | confermato · 2027 | src/data/locali.yaml#di-costanzo.orari |
| lc-brandi-orari | confermato · 2027 | src/data/locali.yaml#brandi.orari |
| lc-zia-esterina-orari | confermato · 2027 | src/data/locali.yaml#zia-esterina.orari |
| lc-hosteria-toledo-orari | confermato · 2027 | src/data/locali.yaml#hosteria-toledo.orari |
| lc-gobbetto-orari | confermato · 2027 | src/data/locali.yaml#gobbetto.orari |
| lc-nennella-orari | confermato · 2027 | src/data/locali.yaml#nennella.orari |
| lc-pintauro-orari | confermato · 2027 | src/data/locali.yaml#pintauro.orari |
| lc-cinquanta-kalo-orari | confermato · 2027 | src/data/locali.yaml#cinquanta-kalo.orari |
| lc-salvo-orari | confermato · 2027 | src/data/locali.yaml#salvo.orari |
| lc-pignatelli-orari | confermato · 2027 | src/data/locali.yaml#pignatelli.orari |
| lc-cantinella-orari | confermato · 2027 | src/data/locali.yaml#cantinella.orari |
| lc-bersagliera-orari | confermato · 2027 | src/data/locali.yaml#bersagliera.orari |
| lc-scialuppa-orari | confermato · 2027 | src/data/locali.yaml#scialuppa.orari |
| lc-calabritto-orari | confermato · 2027 | src/data/locali.yaml#calabritto.orari |
| lc-chalet-ciro-orari | confermato · 2027 | src/data/locali.yaml#chalet-ciro.orari |
| lc-caffettiera-orari | confermato · 2027 | src/data/locali.yaml#caffettiera.orari |
| lc-gorizia-orari | confermato · 2027 | src/data/locali.yaml#gorizia.orari |
| lc-bellavia-orari | confermato · 2027 | src/data/locali.yaml#bellavia.orari |
| lc-meatin-orari | confermato · 2027 | src/data/locali.yaml#meatin.orari |
| lc-starita-orari | confermato · 2027 | src/data/locali.yaml#starita.orari |
| lc-concettina-orari | confermato · 2027 | src/data/locali.yaml#concettina.orari |
| lc-poppella-orari | confermato · 2027 | src/data/locali.yaml#poppella.orari |
| lc-petrucci-posillipo-orari | confermato · 2027 | src/data/locali.yaml#petrucci-posillipo.orari |
| lc-tufo-orari | confermato · 2027 | src/data/locali.yaml#tufo.orari |
| lc-fenestella-orari | confermato · 2027 | src/data/locali.yaml#fenestella.orari |
| lc-cicciotto-orari | confermato · 2027 | src/data/locali.yaml#cicciotto.orari |
| lc-macellegria-orari | confermato · 2027 | src/data/locali.yaml#macellegria.orari |
| lc-da-michele-prezzi | confermato · 2027 | src/data/locali.yaml#da-michele.prezzi |
| lc-port-alba-prezzi | confermato · 2027 | src/data/locali.yaml#port-alba.prezzi |
| lc-di-matteo-prezzi | confermato · 2027 | src/data/locali.yaml#di-matteo.prezzi |
| lc-chitarra-prezzi | confermato · 2027 | src/data/locali.yaml#chitarra.prezzi |
| lc-gesu-vecchio-prezzi | confermato · 2027 | src/data/locali.yaml#gesu-vecchio.prezzi |
| lc-hosteria-toledo-prezzi | confermato · 2027 | src/data/locali.yaml#hosteria-toledo.prezzi |
| lc-cinquanta-kalo-prezzi | confermato · 2027 | src/data/locali.yaml#cinquanta-kalo.prezzi |
| lc-salvo-prezzi | confermato · 2027 | src/data/locali.yaml#salvo.prezzi |
| lc-pignatelli-prezzi | confermato · 2027 | src/data/locali.yaml#pignatelli.prezzi |
| lc-cantinella-prezzi | confermato · 2027 | src/data/locali.yaml#cantinella.prezzi |
| lc-calabritto-prezzi | confermato · 2027 | src/data/locali.yaml#calabritto.prezzi |
| lc-meatin-prezzi | confermato · 2027 | src/data/locali.yaml#meatin.prezzi |
| lc-bellavia-prezzi | confermato · 2027 | src/data/locali.yaml#bellavia.prezzi |
| lc-starita-prezzi | confermato · 2027 | src/data/locali.yaml#starita.prezzi |
| lc-petrucci-posillipo-prezzi | confermato · 2027 | src/data/locali.yaml#petrucci-posillipo.prezzi |
| lc-cicciotto-prezzi | confermato · 2027 | src/data/locali.yaml#cicciotto.prezzi |
| lc-macellegria-prezzi | confermato · 2027 | src/data/locali.yaml#macellegria.prezzi |
| lc-da-michele-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#da-michele; src/data/locali.yaml#da-michele.perche |
| lc-port-alba-perche | confermato · 2027 | src/testi/locali.yaml#port-alba; src/data/locali.yaml#port-alba.perche |
| lc-di-matteo-perche | confermato · 2027 | src/testi/locali.yaml#di-matteo; src/data/locali.yaml#di-matteo.perche |
| lc-di-matteo-rinomato | stampa · 2027 · comeFatto | src/testi/locali.yaml#di-matteo; src/data/locali.yaml#di-matteo.rinomatoPer.scheda |
| lc-chitarra-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#chitarra; src/data/locali.yaml#chitarra.perche |
| lc-gesu-vecchio-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#gesu-vecchio; src/data/locali.yaml#gesu-vecchio.perche; src/data/locali.yaml#gesu-vecchio.rinomatoPer.scheda |
| lc-di-costanzo-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#di-costanzo; src/data/locali.yaml#di-costanzo.perche |
| lc-brandi-perche | confermato · 2027 | src/testi/locali.yaml#brandi; src/data/locali.yaml#brandi.perche |
| lc-zia-esterina-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#zia-esterina; src/data/locali.yaml#zia-esterina.perche |
| lc-hosteria-toledo-perche | confermato · 2027 | src/testi/locali.yaml#hosteria-toledo; src/data/locali.yaml#hosteria-toledo.perche |
| lc-gobbetto-perche | confermato · 2027 | src/testi/locali.yaml#gobbetto; src/data/locali.yaml#gobbetto.perche |
| lc-nennella-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#nennella; src/data/locali.yaml#nennella.perche; src/data/locali.yaml#nennella.rinomatoPer.scheda |
| lc-pintauro-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#pintauro; src/data/locali.yaml#pintauro.perche |
| lc-cinquanta-kalo-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#cinquanta-kalo; src/data/locali.yaml#cinquanta-kalo.perche |
| lc-salvo-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#salvo; src/data/locali.yaml#salvo.perche |
| lc-pignatelli-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#pignatelli; src/data/locali.yaml#pignatelli.perche |
| lc-pignatelli-rinomato | stampa · 2027 · comeFatto | src/testi/locali.yaml#pignatelli; src/data/locali.yaml#pignatelli.rinomatoPer.scheda |
| lc-cantinella-perche | confermato · 2027 | src/testi/locali.yaml#cantinella; src/data/locali.yaml#cantinella.perche |
| lc-bersagliera-perche | confermato · 2027 | src/testi/locali.yaml#bersagliera; src/data/locali.yaml#bersagliera.perche |
| lc-scialuppa-perche | confermato · 2027 | src/testi/locali.yaml#scialuppa; src/data/locali.yaml#scialuppa.perche |
| lc-calabritto-perche | confermato · 2027 | src/testi/locali.yaml#calabritto; src/data/locali.yaml#calabritto.perche |
| lc-chalet-ciro-perche | confermato · 2027 | src/testi/locali.yaml#chalet-ciro; src/data/locali.yaml#chalet-ciro.perche |
| lc-chalet-ciro-rinomato | stampa · 2027 · comeFatto | src/testi/locali.yaml#chalet-ciro; src/data/locali.yaml#chalet-ciro.rinomatoPer.scheda |
| lc-caffettiera-perche | confermato · 2027 | src/testi/locali.yaml#caffettiera; src/data/locali.yaml#caffettiera.perche |
| lc-gorizia-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#gorizia; src/data/locali.yaml#gorizia.perche |
| lc-bellavia-perche | confermato · 2027 | src/testi/locali.yaml#bellavia; src/data/locali.yaml#bellavia.perche |
| lc-meatin-perche | confermato · 2027 | src/testi/locali.yaml#meatin; src/data/locali.yaml#meatin.perche |
| lc-starita-perche | confermato · 2027 | src/testi/locali.yaml#starita; src/data/locali.yaml#starita.perche |
| lc-concettina-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#concettina; src/data/locali.yaml#concettina.perche |
| lc-poppella-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#poppella; src/data/locali.yaml#poppella.perche |
| lc-poppella-rinomato | stampa · 2027 · comeFatto | src/testi/locali.yaml#poppella; src/data/locali.yaml#poppella.rinomatoPer.scheda |
| lc-petrucci-posillipo-perche | stampa · 2027 · comeFatto | src/testi/locali.yaml#petrucci-posillipo; src/data/locali.yaml#petrucci-posillipo.perche |
| lc-tufo-perche | confermato · 2027 | src/testi/locali.yaml#tufo; src/data/locali.yaml#tufo.perche |
| lc-tufo-rinomato | stampa · 2027 · comeFatto | src/testi/locali.yaml#tufo; src/data/locali.yaml#tufo.rinomatoPer.scheda |
| lc-fenestella-perche | confermato · 2027 | src/testi/locali.yaml#fenestella; src/data/locali.yaml#fenestella.perche |
| lc-cicciotto-perche | confermato · 2027 | src/testi/locali.yaml#cicciotto; src/data/locali.yaml#cicciotto.perche |
| lc-macellegria-perche | confermato · 2027 | src/testi/locali.yaml#macellegria; src/data/locali.yaml#macellegria.perche |

## Copertura delle durate

| Tappa | Fonte | Nel footer itinerari attuale |
|---|---|---|
| santa-chiara | tp-santachiara-faq | Sì, tramite altri riferimenti |
| napoli-sotterranea | tp-sotterranea-faq | Sì, tramite altri riferimenti |
| palazzo-reale | tp-palazzoreale-info | Sì, tramite altri riferimenti |
| san-carlo | tp-sancarlo-visite | Sì, tramite altri riferimenti |
| galleria-borbonica | tp-borbonica-standard | Sì, tramite altri riferimenti |
| catacombe | tp-catacombe-sangennaro | No |
| fontanelle | tp-fontanelle | Sì, tramite altri riferimenti |
| citta-scienza | tp-cittascienza-faq | Sì, tramite altri riferimenti |

Il campo durataFonte non è passato esplicitamente a FontiPagina. Sette fonti sono comunque incluse tramite schede/testi; quella delle Catacombe resta fuori. Correzione da riprodurre con un test prima dell’implementazione.
