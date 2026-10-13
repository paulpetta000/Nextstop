# Mappa, pezzo 6: peso delle strade piccole su tutta la mappa (14/10/2026)

Specifica: `specifiche/compositore.md` §6 (strada A). Script: `design/compositore/mappa-giro-1/pezzi.mjs`; numeri completi in
`design/compositore/mappa-giro-1/misure-256.json` (pezzi da 1,28 km), `misure-128.json` (640 m), `misure-512.json` (2,56 km).

## Dati
- Fonte: Overpass API, `way[highway]` nel riquadro di `src/data/mappa.json` (lat 40.786–40.874, lon 14.135–14.290), `out tags geom`;
  OpenStreetMap (ODbL), dati del 13/10/2026 23:02 UTC. Risposta grezza 14 MB (non salvata nel repository).
- Tenute: 13 595 vie. Classi come la prova di prima (`strade.mjs`): grandi (primary, secondary, tertiary, trunk), medie
  (residential, unclassified, living_street), pedonali (pedestrian), vicoli e passaggi (footway, path, track, cycleway, service), scale (steps).
- Scartate 10 729: gallerie, sotto terra, al chiuso, marciapiedi e attraversamenti (`footway=sidewalk/crossing`), parcheggi e passi carrabili.
- Punti: 92 125 di OpenStreetMap, 47 081 dopo la semplificazione (Douglas-Peucker, 1,75 m, come la prova di prima).
- Lunghezze: grandi 235 km, medie 429 km, pedonali 39 km, vicoli 533 km, scale 22 km.

## Pesi (KB; «compresso» = brotli, quello che usa Vercel; gzip un po' di più)
| | grezzo | gzip | compresso |
|---|---|---|---|
| Mappa di oggi (`mappa.json`) | 121 | 48 | 34 |
| Tutte le strade, scritte come la prova di prima | 569 | 223 | 175 |
| Tutte le strade, numeri corti e relativi | 408 | 165 | 148 |
| Nomi delle 332 vie principali (grandi e pedonali con il nome) | 32 | 14 | 12 |
| Tutto a pezzi da 1,28 km, con i nomi (59 pezzi) | 617 | 252 | 224 |

Per classe (numeri corti, compresso): grandi 20, medie 38, pedonali 7, vicoli 75, scale 9. I nomi di tutte le 2 556 vie con
il nome, dentro i pezzi, valgono 62 KB compressi.

## Divisioni in pezzi
| Lato | Pezzi con strade | Totale compresso | Un pezzo (mediana / massimo) | Telefono sul centro storico, quando si vedono i vicoli |
|---|---|---|---|---|
| 640 m | 216 | 258 KB | 1 / 4,8 KB | 9 pezzi, 28 KB |
| **1,28 km** | **59** | **224 KB** | **3 / 15 KB** | **4 pezzi, 44 KB** |
| 2,56 km | 19 | 210 KB | 8 / 37 KB | 4 pezzi, 97 KB |

Con 1,28 km, telefono (390 × 420 px, vicoli visibili): Plebiscito 6 pezzi 47 KB, Chiaia 4 / 38, Vomero 4 / 38, Posillipo 3 / 8.
Pezzo più pesante: centro storico (7_2), 15 KB compressi, 251 nomi.
Due livelli (strade grandi, medie e pedonali con i loro nomi in un file; vicoli e scale a pezzi): 109 KB + 106 KB a pezzi
(mediana 1,4 KB); sul centro storico 4 pezzi, 22 KB.

## Prova nel bozzetto (C e D, 14/10/2026)
- Giorno 1 di «Due giorni» al primo sguardo: C 6 pezzi (52 KB), D 4 pezzi (44 KB); dopo due spostamenti 11 pezzi in tutto.
- Nomi del percorso: punti ogni 10 m sulla linea, via con il nome entro 15 m, tratti di almeno 120 m. Sul giorno 1 trova:
  via dei Tribunali, via San Gregorio Armeno, via Benedetto Croce, vico Pallonetto Santa Chiara, via Francesco del Giudice, vico Luigi De Crecchio.
- Limiti: niente prova su telefono vero; il browser dell'app ferma le animazioni (rAF), quindi i pezzi partono con un timer; le pagine
  pubblicate non sono state riaperte da me su claude.ai (serve l'accesso).
