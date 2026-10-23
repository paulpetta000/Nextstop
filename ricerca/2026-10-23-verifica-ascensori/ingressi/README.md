# Ingressi dei percorsi · 22 ottobre 2026

Questi tre file sono gli ingressi esatti del confronto 7/10 minuti di attesa L6 e della rigenerazione 70. Non contengono itinerari personali o credenziali. Impronte e dimensioni sono nel manifesto `nextstop-ingressi70-manifest.json`, nella cartella superiore.

- `osm.json`: OpenStreetMap tramite Overpass, dati al 22/10/2026 19:12:21 UTC; © OpenStreetMap contributors, ODbL. Fonte e condizioni: https://www.openstreetmap.org/copyright . Richiesta e riquadro sono nello script versionato `scripts/itinerari/scarica.mjs`.
- `quote.json`: estratto Copernicus DEM GLO-30, © DLR e.V. 2010–2014 e © Airbus Defence and Space GmbH 2014–2018, fornito da ESA sotto il programma Copernicus; licenza d'uso gratuita con citazione. Il campo `licenza` e il collegamento al GeoTIFF originale sono conservati nel file. Fonte: https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N40_00_E014_00_DEM/Copernicus_DSM_COG_10_N40_00_E014_00_DEM.tif .
- `anm-gtfs.zip`: ANM, orari programmati, licenza IODL 2.0; https://www.anm.it/google/google-transit.zip . Feed analizzato valido dal 19/10/2026 al 31/12/2026. Non contiene gli avvisi temporanei né tempi in tempo reale.

Per ripetere il calcolo usare il codice della revisione 70 e, dalla radice del repository, `node --no-liftoff scripts/itinerari/costruisci.mjs <questa-cartella>`. Parametri di processo usati: `QUOTE_RAGGIO=2`, `QUOTE_PERCENTILE=0.25`, `QUOTE_MEDIA=50`, nessun `PERCORSI_*`. Il generatore scrive tutti e cinque i file del sito: usare una copia separata per un confronto.

Il confronto è riuscito con Node 24.19.0 già incluso in Codex; il precedente tentativo con il runtime portatile 24.21.0 è conservato come fallito, causa non dimostrata. I file generati possono riportare una data diversa se si ripete il calcolo in un altro giorno; non è una ragione per modificare a mano i JSON. Conservare questo README e i crediti quando si trasferiscono gli ingressi.
