# Revisione codice 15 · matrici e riferimenti degli output

18 ottobre 2026, base 55dcad0. Primo gruppo della sessione continuativa di almeno 45 minuti richiesta da Enrico; la sessione prosegue oltre questo checkpoint.

## Risultato e prove

Il riferimento di generazione distingueva gruppi diversi, ma poteva certificare un gruppo contenente matrici incomplete. Riprodotti cinque casi di mancato rifiuto nel modulo reale della build, prima della correzione. Ora struttura-dati.mjs controlla le uscite prima della marcatura/scrittura e prima del riferimento pubblico, anche per i dati storici senza marcatura.

Controllati i sei scenari, righe/colonne, valori numerici finiti e non negativi, diagonali nulle, mezzi, unicità e ordine dei punti, firme, dimensioni dei disegni alternativi, indici dei candidati e presenza delle corse effettivamente usate, con fermate e salite. Anche array con buchi e file delle linee assente vengono rifiutati. Conservati giorni senza corse e candidati presenti ma non scelti dalle matrici.

- **364/364 test**, otto prove aggiunte; zero fallimenti, salti o cancellazioni.
- Dati reali verificati solo in memoria: 87 punti, sei scenari, 8.793 candidati. Nessun JSON sorgente cambiato.
- Build ordinaria di **12 pagine**, **13 documenti / 811 link validi**, **82 risorse offline**; worker invariato 8f1b1aab606e.
- Log nella cartella della chat: nextstop-struttura-test-2026-10-18.log, nextstop-struttura-build-2026-10-18.log, nextstop-struttura-links-2026-10-18.log.

## Limiti e seguito

Sono controlli di struttura e collegamento, non una nuova verifica delle fonti o dei minuti sul posto. Le stringhe dei disegni hanno ancora il controllo del decoder al caricamento; il calendario e l'insieme delle partenze richiedono ulteriori controlli. La marcatura non sostituisce questa validazione e non diventa autenticazione.

Si prosegue su calendari, partenze e casi limite collegati; area 3 ancora aperta. Nessun browser, installazione, rigenerazione reale o pubblicazione. La nuova idea multi-città e registro aggiornamenti resta rinviata anche nell'analisi.
