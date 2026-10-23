# Ingressi conservati per la verifica degli ascensori

`ingressi/` conserva esclusivamente i tre ingressi pubblici esatti della generazione 70 del 22 ottobre 2026 e il loro README con fonti e licenze: OSM/ODbL, Copernicus GLO-30 e ANM GTFS/IODL 2.0. Non contiene dati personali, credenziali, dipendenze o codice da installare. `manifest.json` conserva SHA-256 e dimensioni di ogni ingresso.

Il primo tentativo tramite ZIP è stato rifiutato su Ubuntu per CRC errato di osm.json prima del calcolo. Il tentativo rimane nel commit bc6479c e in una copia separata locale verificata; l'impronta è conservata nel manifesto come `zipTentativoNonValidoSHA256`. Non considerarlo un archivio valido. I tre originali sono stati riletti e confrontati con le impronte 70 prima della copia diretta: nessun dato sostituito o corretto a mano per aggirare il fallimento.

Il workflow CI dispone di un'opzione manuale, disattivata per impostazione iniziale, per ricostruire i percorsi nell'ambiente Ubuntu già usato dal progetto. Serve a completare la verifica di Acton e Chiaia dopo le interruzioni native osservate sul computer, senza attribuirle a una causa non dimostrata e senza intervenire sul backup Git. Le esecuzioni ordinarie di test/build non rigenerano i dati.

Solo se richiesto esplicitamente nel workflow, `scripts/itinerari/rigenera-ci.mjs` verifica direttamente impronte e dimensioni dei tre file e usa il generatore del commit del controllo. Dopo test/build/link riusciti, esporta i cinque file pubblici generati nel log, compressi e suddivisi in blocchi con impronta complessiva. Non usa Action o pacchetti ulteriori, non pubblica un sito e non scrive sul repository remoto. Il recupero deve verificare commit, numero dei blocchi, SHA-256 e generazione coordinata prima di integrare i risultati.

Questi ingressi non attestano il servizio in tempo reale o nel 2027: GTFS valido 19 ottobre–31 dicembre 2026, OSM del 22 ottobre. I vincoli ANM sugli ascensori sono documentati nel generatore e nel registro; aggiornarli dopo un nuovo riscontro ufficiale, conservando i precedenti. Nessun JSON generato va modificato a mano.
