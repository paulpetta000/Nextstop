# Stima dei tempi da un punto qualsiasi (hotel, «Dove sono»)

Domanda: quanto si sbaglia stimando i minuti da un punto che non è una tappa (l'hotel) alle tappe, con i soli dati che il
compositore ha già nel telefono (posizioni e tempi veri tra le tappe)? Data: 13/10/2026. Chi: Claude (Opus), sui dati del sito.

Dati: `src/data/tempi-tappe.json` (87 punti: tappe in città, locali e fine dei percorsi a piedi; tempi calcolati da
`scripts/itinerari/costruisci.mjs` su OpenStreetMap e quote Copernicus, con metro, funicolari e bus ANM), posizioni da
`src/data/tappe.yaml` e `src/data/locali.yaml`. Nessuna fonte esterna: sono misure sui nostri percorsi.

## 1. Quanto è più lungo il percorso a piedi della linea d'aria
Scenario «solo a piedi», 7392 coppie di punti a più di 150 m:
- metri a piedi / metri in linea d'aria: **mediana 1,27** (un quarto sotto 1,21, tre quarti sotto 1,38, nove su dieci sotto 1,57);
- minuti a piedi per ogni km di linea d'aria (con salite e scale): **mediana 19,3** (75° percentile 22,0; 90° 27,7);
- la stima «in piano» (linea d'aria × 1,27 a 4,5 km/h, cioè 75 m al minuto) sta sotto il vero del 14% (mediana): le salite di Napoli
  pesano; con 20 minuti al km la mediana torna giusta.
| Distanza in linea d'aria | Coppie | Deviazione mediana | Minuti per km (mediana) |
|---|---|---|---|
| meno di 1 km | 1274 | 1,32 | 20,2 |
| 1–2 km | 1898 | 1,28 | 19,7 |
| 2–3,5 km | 2034 | 1,27 | 19,4 |
| oltre 3,5 km | 2186 | 1,26 | 19,0 |

## 2. Due modi di stimare, provati «alla cieca»
Prova: ogni punto fa finta di essere l'hotel (lo si toglie dai dati, con la sua fine se ce l'ha) e si stimano i minuti verso tutti gli
altri; poi si confronta con il tempo vero (solo tratti veri di almeno 3 minuti).
- **A · linea d'aria × 20 minuti al km**.
- **B · aggancio alle tappe vicine**: per ogni tappa di arrivo si prende il migliore tra la linea d'aria × 20 min/km e, per ogni punto
  entro 800 m dall'hotel, (linea d'aria fino a quel punto × 20 min/km) + (tempo vero da quel punto alla tappa, con i mezzi).

| Scenario | Modo | Errore mediano | Metà dei casi entro | 9 su 10 entro |
|---|---|---|---|---|
| solo a piedi | A | +3% | 4,8 min | 18,9 min |
| solo a piedi | B | −1% | 1,8 min | 16,8 min |
| giorno feriale (con i mezzi) | A | +24% | 10,8 min | 63,1 min |
| giorno feriale (con i mezzi) | B | +1% | 1,7 min | 11,9 min |

**B è molto meglio**, soprattutto con i mezzi: A non sa che c'è la funicolare.

## 3. Quanto conta la tappa più vicina (modo B, giorno feriale)
| La tappa più vicina all'«hotel» è | Punti | Metà dei casi entro | 9 su 10 entro | Errore mediano |
|---|---|---|---|---|
| entro 250 m | 57 | 1,1 min | 6,7 min | 0% |
| tra 250 e 500 m | 18 | 3,3 min | 11,2 min | +6% |
| tra 500 e 800 m | 6 | 8,2 min | 22,7 min | +12% |
| oltre 800 m | 2 | 20,8 min | 33,7 min | +25% |

Deduzione (mia): fino a 500 m da una tappa la stima è buona per decidere l'ordine e per un «circa» arrotondato a 5 minuti; tra 500 e
800 m va detta «incerta»; oltre 800 m non va data in minuti. I casi peggiori sono i punti isolati (Posillipo, Capodimonte): proprio dove
un hotel lontano dal centro rende la stima meno utile.
Limiti: la prova usa come «hotel» i nostri punti, che stanno dove ci sono altre tappe; un hotel vero può stare in una zona senza tappe.
Le coppie non sono indipendenti (lo stesso punto conta molte volte). Il tratto stimato non sa di salite, scale e ascensori tra l'hotel
e la tappa agganciata.
