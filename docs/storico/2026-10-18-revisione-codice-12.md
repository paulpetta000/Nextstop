# Revisione codice 12 · coerenza dei dati differiti

18 ottobre 2026, base b18112e. Sesto checkpoint della stessa sessione continuativa.

## Problema e comportamento

Una pagina già aperta poteva applicare differenze di un'altra base dei tempi, o usare indici/candidati di un'altra pubblicazione. Dimensioni e numeri potevano essere validi, ma la combinazione delle due versioni era incoerente. Quattro prove iniziali fallite prima della correzione.

La build calcola un riferimento SHA-256 troncato a 20 caratteri sui tempi completi (incluso l'ordine dei punti) e sulla proiezione della mappa. Il riferimento passa dalla città al pacco iniziale e a scenari, partenze, mappa, percorsi/alternative, indice e pezzi. È un'identità di compatibilità, non una firma di autenticità; non usa dati personali.

Il compositore controlla il riferimento prima di applicare dati differiti. Scenari incompatibili lasciano i dati iniziali; partenze incompatibili lasciano l'attesa media o il valore già presente. Le mappe di versioni diverse vengono rifiutate prima dell'adozione; il caricamento può riprovare. Un indice opzionale incompatibile lascia la mappa di base; un pezzo o un'alternativa incompatibili non restano memorizzati come successo.

I vecchi pacchi senza riferimento rimangono decodificabili quando anche la città non lo ha. Una nuova città con riferimento rifiuta invece file differiti vecchi o privi di riferimento. I vecchi client che ignorano il campo non sono protetti: per aggiornarli occorre ricaricare la pagina. Nessun cambiamento agli URL, alla memoria v1 o ai link condivisi; aggiunto soltanto un campo nei pacchetti interni.

## Prove

- **9/9 nuove prove**, incluse identità sensibile a valori/ordine/proiezione, compatibilità precedente, rifiuto senza aggiornamenti parziali, ripetizione della mappa e recupero dei pezzi.
- **331/331 test**, senza fallimenti, salti o cancellazioni.
- Build ordinaria: **12 pagine**, telemetria disabilitata. **13 documenti e 811 link validi**; worker con **82 risorse**.
- Verificati i file prodotti: riferimento 40286825b9d07c9cece8 identico nel pacco iniziale, nei sei pacchi differiti e in tutti i **59 pezzi**. Decoder riusciti con 87 punti e 8.793 candidati.
- I sette script client non contengono node:crypto, createHash o il calcolatore del riferimento. Il calcolo resta nella build.
- git diff --check e riferimenti/NUL dei documenti verificati. Nessuna dipendenza o dato generato sorgente modificati.

Il riferimento lega pacchi costruiti dagli stessi input: non certifica la correttezza geografica, tutti i campi di ogni JSON o l'atomicità di una rigenerazione interrotta dei file sorgente. I controlli della build sulle firme delle posizioni rimangono separati. Un rifiuto può lasciare i ripieghi già previsti (tempi feriali/attesa media, mappa di base) fino a un caricamento coerente.

Nessun browser o prova reale fra pubblicazioni/cache; nessun nuovo axe/Lighthouse. Nessuna installazione, delega, sessione Google, modifica alle protezioni, push, merge o deploy. La nuova idea multi-città/registro resta rinviata anche nell'analisi.

## Seguito

Controllare salvataggio dei download incompleti e preparazione dei file da rigenerare, mantenendo separati i dati pubblici già esistenti. La revisione completa del codice resta in corso.
