# Revisione codice 8 · lettori ZIP e CSV degli autobus

18 ottobre 2026. Checkpoint della sessione continuativa richiesta da Enrico, base f5712de. Si prosegue dopo questo commit senza richiedere un OK intermedio.

## Problemi riprodotti e correzioni

Il lettore locale ignorava firme delle intestazioni, CRC, dimensioni dichiarate, metodi diversi da stored/deflate e nomi omonimi in cartelle diverse; una firma finta nel commento poteva nascondere la directory. Il CSV accettava virgolette malformate, colonne extra o duplicate; la decodifica sostituiva i byte UTF-8 errati con caratteri sostitutivi. Otto prove di gruppo fallite prima e riuscite dopo.

Il lettore ora verifica directory, record locali, offset, nomi, descrittori, intervalli non sovrapposti, lunghezze e CRC delle tabelle lette. Rifiuta esplicitamente cifratura, archivi multiparte e ZIP64, che non implementa. Non estrae file sul disco. Limiti locali: 256 MiB per archivio, 256 MiB per tabella e 512 MiB complessivi dichiarati; inflate ha inoltre maxOutputLength pari alla dimensione dichiarata. Questi sono limiti operativi di questo lettore, non regole GTFS. CRC rileva corruzioni, non autentica la provenienza.

Il CSV rifiuta campi in numero diverso dalle colonne, intestazioni vuote/duplicate e virgolette incoerenti. Mantiene UTF-8 valido, BOM, LF/CRLF, virgole e virgolette raddoppiate. Le righe interne a un campo non sono supportate, coerentemente con il formato GTFS. Il lettore non è un validatore universale di ogni estensione ZIP o GTFS.

## Verifiche

- 14 nuove prove; **24/24** nel gruppo GTFS complessivo, incluse le dieci precedenti.
- Stored/deflate, commenti ordinari e firma finta nel commento; descrittori con e senza firma, per entrambi i metodi. Ogni fixture con descrittore è prima confrontata con il lettore indipendente fflate già presente.
- Tabella compressa con oltre un MiB di espansione ma dimensione dichiarata di un byte: rifiuto tramite limite di uscita.
- 120 mutazioni deterministiche di intestazioni locali, directory ed EOCD: nessun arresto fuori controllo; dati ancora validi o errore GTFS esplicito.
- npm test: **302/302**, senza fallimenti, salti o cancellazioni.
- Build ordinaria: **12 pagine**, telemetria disabilitata. Link: **13 documenti, 811 link validi**. Worker: **82 risorse**.
- git diff --check e riferimenti/NUL dei documenti verificati. Nessuna dipendenza aggiunta; zlib.crc32 è incluso in Node da 22.2, sotto il requisito già previsto 22.12.

Non è stato scaricato un feed nuovo né rigenerata alcuna matrice. Le prove del lettore sono su archivi sintetici; il feed reale andrà verificato al prossimo aggiornamento autorizzato, prima di sostituire dati pubblici. Nessun browser, installazione, delega, cambio di protezioni, push, merge o deploy.

## Riferimenti e seguito

- [Formato ZIP, PKWARE APPNOTE](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT): intestazioni, directory, descrittori e CRC.
- [Node zlib](https://nodejs.org/api/zlib.html): crc32 e maxOutputLength, entrambi già disponibili nella versione locale verificata.
- [Requisiti dei file GTFS](https://gtfs.org/documentation/schedule/reference/#file-requirements): UTF-8, BOM, CSV e separatori di riga.

Il prossimo controllo riguarda coerenza fra le tabelle e corse che ripassano dalla stessa fermata. Le idee multi-città e registro aggiornamenti restano rinviate, anche nell'analisi.
