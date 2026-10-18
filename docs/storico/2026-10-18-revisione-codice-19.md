# Revisione codice 19 · riquadri XML della mappa

18 ottobre 2026, base 3f7d096. Quinto gruppo della sessione di almeno 45 minuti; il lavoro continua.

Il lettore minimale accettava documenti troncati, coordinate mancanti e geometrie discordanti fra riquadri; poteva leggere geometrie nei commenti e perdere tag arrivati in un secondo file. Riprodotti otto difetti prima della correzione. Ora il sottoinsieme XML dell'API OSM viene letto con documento completo, attributi e coordinate verificati, entità standard/numeriche decodificate, UTF-8 rigoroso e unione coerente dei duplicati. I nodi delle vie vengono verificati dopo aver unito tutti i riquadri, senza scartare riferimenti che arrivano in un file successivo.

Conservati i membri esterni delle relazioni e i riquadri vuoti validi. Fonte tecnica consultata il 18/10: [API OSM 0.6, richiesta per riquadro](https://wiki.openstreetmap.org/wiki/API_v0.6#Retrieving_map_data_by_bounding_box:_GET_/api/0.6/map). La richiesta comprende i nodi delle vie restituite, ma può omettere altri membri delle relazioni. Non introdotta una falsa garanzia di completezza delle relazioni.

- **395/395 test**, dodici aggiunte; zero fallimenti, salti o cancellazioni.
- Nei test di sviluppo è emerso un rallentamento del nuovo parser su 20.000 elementi aperti senza chiusura: processo isolato fermato al limite di due secondi. Corretto con scansione progressiva prima del checkpoint; prova finale riuscita in circa 63 ms, avvio Node incluso. Nessuna garanzia di tempo universale.
- Confronto profondo identico col lettore precedente su XML canonico sintetico: **5.000 nodi / 2.499 vie**, lettura locale 48 ms prima e 125 ms dopo. Non è una misura del browser né dei riquadri reali.
- Build ordinaria di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**, worker 38fb7f64d13c.
- Log nella cartella della chat: nextstop-xml-test-2026-10-18.log, nextstop-xml-build-2026-10-18.log, nextstop-xml-links-2026-10-18.log.

Resta un lettore del sottoinsieme API usato dal progetto, non un validatore XML generale: DTD, entità esterne, CDATA ed elementi estranei vengono rifiutati. Nessuna dipendenza aggiunta, download, rigenerazione della mappa reale, browser o pubblicazione. Si prosegue sulla preparazione/cache dei download cartografici; area 3 aperta, nuova idea rinviata anche nell'analisi.
