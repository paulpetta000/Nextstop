# Fonti e riproduzione Acton · revisione 72 · 23 ottobre 2026

Seguito della [revisione 71](2026-10-22-fonti-ripresa-71.md), sul ramo autorizzato `codex/chiusura-verificata-2026-10-21`. Solo rapporto, casi e registro: nessuna modifica a codice, dati applicativi, grafica o percorsi. **17 gruppi ancora aperti, nove con fonte/orario ordinario recuperati, 26 totali. Nessun controllo periodico completo concluso o scadenza rinviata.**

## Problema concreto da correggere con Sol alto

La [pagina ANM ascensori](https://www.anm.it/s/ascensori?language=it), letta nel browser il 23 ottobre, indica Acton e Chiaia in manutenzione; Sanità, Ventaglieri e Monte Echia regolari. Sanità resta diversa dal testo restituito dalla ricerca indicizzata. Non attribuire una data di ripristino a questi stati puntuali.

Il generatore `scripts/itinerari/costruisci.mjs` esclude alcuni ascensori nello scenario festivo tramite gli orari OSM, ma non contiene un'esclusione dei due impianti in manutenzione. Nell'ingresso OSM conservato della revisione 70 i nodi Acton 2217391295 e Chiaia 3803566239 hanno ancora accesso consentito. La presenza nella mappa non certifica il funzionamento.

**Riproduzione sul file applicativo attuale:** 31 collegamenti nelle matrici principali di `tempi-tappe.json` usano `asc:Ascensore Acton`: sei feriali, 21 del sabato pomeriggio, quattro della domenica. Esempio: via Petrarca → piazza del Plebiscito, con B151 e Acton. Il controllo che richiede zero collegamenti via Acton fallisce con `31 !== 0`, uscita 1. Non è un errore di esecuzione dello strumento: è la riproduzione del problema. Nessuna occorrenza di Chiaia nelle stringhe delle matrici principali, senza concludere che non compaia in geometrie o alternative.

Helper e risultato nella cartella superiore: `nextstop-acton72-riproduci.mjs`, `nextstop-acton72-riprodotto.json`. I candidati alternativi contengono altre occorrenze: il conteggio 31 riguarda solo le matrici principali, non ogni percorso dell'app.

**Seguito necessario:** test nel repository sul generatore; gestione esplicita e documentata delle indisponibilità senza modificare a mano i JSON né confondere ascensore Chiaia e funicolare di Chiaia; rigenerazione coordinata con ingressi conservati, confronto delle alternative e verifica che gli accessi a piedi restino disponibili; suite, build, link e CI/anteprima del solo ramo. Valutare separatamente la validità futura: uno stato attuale non prova la chiusura nel 2027. Il passaggio a Sol alto è richiesto prima di questa correzione, come concordato con Enrico per i nuovi problemi tecnici.

La [pagina scale mobili](https://www.anm.it/s/scale-mobili-intermodali) è stata letta separatamente: Vomero tutti i giorni 7–22, Ventaglieri lunedì–venerdì 7–14:42. **Non estendere a scale mobili gli orari degli ascensori o del parco.** Le durate convenzionali usate dal generatore non sono misurazioni ufficiali delle corse. V04 resta aperto.

## Comune: pagine recuperate e limiti

| Caso | Fonte effettivamente letta nel browser | Riscontro e limite |
|---|---|---|
| V05 | [Castel dell'Ovo](https://www.comune.napoli.it/vivere-il-comune/luoghi/castel-dellovo/) e [area pedonale Borgo Marinari](https://www.comune.napoli.it/articolo_tematico/trasporti-mobilita/ztl-e-aree-pedonali/area-pedonale-di-borgo-marinari/) | Castello dichiarato chiuso per lavori fino a nuova comunicazione; pagina aggiornata 12/08/2025. Area pedonale attiva tutto il giorno, pagina aggiornata 24/08/2026: è disciplina dei veicoli, non garanzia di ogni passaggio libero da cantieri. Annunci giornalistici discordanti non sostituiscono una nuova conferma comunale. |
| V08 | [Percorso Pedamentina](https://www.comune.napoli.it/articolo_tematico/vivere-la-citta/turismo/turismo-sostenibile/percorsi-a-piedi/dalla-pedamentina-a-spaccanapoli/) e [avviso cantieri del 30/09/2026](https://www.comune.napoli.it/novita/dispositivi-di-viabilita-per-cantieri-e-manifestazioni-2/) | Scheda descrittiva aggiornata 08/08/2025. L'avviso recente prevede dal 19/10 al 06/11/2026 scavi su corso Vittorio Emanuele e marciapiede fino alla cabina presso l'inizio della Pedamentina, senza interruzione del traffico veicolare. Non dichiara chiusa tutta la scalinata e non certifica la percorribilità pedonale integrale. |
| V09 | [ZTL Marechiaro](https://www.comune.napoli.it/articolo_tematico/trasporti-mobilita/ztl-e-aree-pedonali/ztl-marechiaro/) | Pagina aggiornata 24/08/2026: ripete il termine ordinario 27/09, la possibilità di attivazione in ottobre e il riferimento discordante al 2025. Il taxi collettivo descritto termina il 27/09/2026; non prolungarlo automaticamente. Non recuperata conferma dell'effettiva attivazione/disattivazione dei varchi a ottobre. |
| V10 | [Riapertura parziale dal 27 giugno](https://www.comune.napoli.it/novita/parco-virgiliano-dal-27-giugno-riapertura-parziale-al-pubblico/) | Comunicato del 25/06/2026: piazzale d'ingresso, viale nord, belvedere e piazza presso via Tito Lucrezio Caro. Altri interventi ancora previsti fino al 2027. Nessuna nuova riapertura integrale accertata; non equiparare gli orari ordinari del parco all'accesso a tutte le aree. |
| V12 | [Mercati Municipalità 2](https://www.comune.napoli.it/articolo_tematico/commercio-e-artigianato/servizio-mercati/i-mercati-di-napoli/municipalita-2/) | Tabella leggibile, aggiornata 03/06/2025: Pignasecca e Porta Nolana classificati giornalieri 7–15, rispettivamente 32 e 13 posteggi. Non è un orario unico dei negozi circostanti, né chiarisce eccezioni festive o aggiornamenti successivi. Fonte ordinaria recuperata, caso ancora aperto per queste distinzioni. |

Lo stesso avviso cantieri del 30 settembre descrive interventi sul lungomare fra ottobre e novembre 2026, anche sui marciapiedi. Serve conservarlo nel confronto V05; non dimostra la chiusura dell'intero Borgo Marinari. La ricerca interna comunale per “Pedamentina” restituisce otto risultati e “Nessun altro risultato”; aperta la notizia recente utile, senza dichiarare esaminati tutti gli atti dell'albo. Le ricerche web mirate su Pedamentina, Marechiaro, Virgiliano e castello non provano l'assenza assoluta di ulteriori provvedimenti.

## EAV: dove cercare variazioni e ripristini

Lette nuovamente le prime due pagine di [infomobilità ferroviaria](https://www.eavsrl.it/infomobilita-ferrovia/) e la ricerca interna “carburante”: il risultato più recente pertinente osservato è il comunicato del 20 ottobre già registrato in revisione 71. Non rilevato un ripristino in questo campione; **non equivale a dimostrare che non sia stato comunicato altrove**.

Letto integralmente l'[avviso alla clientela del 13/09/2026](https://www.eavsrl.it/avviso-alla-clientela/): EAV indirizza al [portale Orario Treni](https://orariotreni.eavsrl.it/) per le variazioni ferroviarie. Aperto il portale, selezionata L1 Napoli–Sorrento e Partenze: la tabella di Napoli Porta Nolana mostra anche corse di altre linee. Esempi puntuali: 4111 Poggiomarino 11:10, 11119 Torre Annunziata–Oplonti 11:20, 6111 Sarno 11:25, 1113 Sorrento 11:30. Nessuna data per ciascuna corsa o settimana certificata; righe senza note non garantiscono assenza di disservizi e non attestano ripristino dei bus sostitutivi.

Le fasi del comunicato carburante vanno lette secondo le rispettive date e la condizione sulle forniture. Nessuna sospensione generalizzata dei treni, nessuna previsione estesa al 2027. V17/V18 restano aperti; non è stato riletto oggi il vecchio URL Campania Express già 404 ieri.

Per Friggitoria Vomero e De Luca la nuova ricerca restituisce aggregatori discordanti, senza una nuova fonte del gestore verificata. Nessuna attribuzione o chiusura ufficiale dedotta da queste pagine; L04/L06 invariati. Nessun contatto o prenotazione inviati.

## Conservazione e seguito

Date dei controlli completi, scadenze, ID, fonti pubbliche e stati dei 26 casi conservati. Le prove 784 test/build/link e CI della revisione 70 restano storiche del codice invariato, non nuove verifiche di oggi. Il nuovo controllo Acton è invece fallito come atteso e va risolto: non dichiarare il modello trasporti interamente verificato.

Backup Git ancora non affidabile, causa non diagnosticata; nessuna riparazione, cancellazione o modifica a impostazioni del computer. Archivi 70/71 e originali conservati. Nessun main/produzione, nuova installazione, istruzione Claude o nuova idea multi-città. Prossimo blocco: Sol alto per Acton e unico riesame tecnico; poi ritorno ai riscontri ordinari, Luna soltanto alla fine.
