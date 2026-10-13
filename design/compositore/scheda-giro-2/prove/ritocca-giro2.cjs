// Una tantum: trasforma il giro 1 (4 proposte) nel giro 2 (la scelta di Enrico: la 1, con il timbro tondo sulla foto in 3 stili,
// il consiglio dell'ordine più corto, la barra del tempo più chiara). Uso: node prove/ritocca-giro2.cjs app.js
const fs = require('fs');
const f = process.argv[2];
let s = fs.readFileSync(f, 'utf8');
const sost = (a, b) => { if (!s.includes(a)) { console.error('NON TROVATO:', a.slice(0, 110)); process.exitCode = 1; return; } s = s.split(a).join(b); };

// intestazione
sost('// Compositore, pezzo 2, giro 1: la scheda della tappa e «visitato», quattro proposte dentro C «Mappa prima» e D «Le pagine»',
  '// Compositore, pezzo 2, giro 2 (scelta di Enrico, 13/10/2026): la proposta 1 del giro 1 (il foglio, la porta con il numero, la maniglia),\n// con «visitata» nella scheda come timbro tondo sulla foto (tre stili: S.t), il consiglio dell\'ordine più corto e la barra del tempo più chiara.\n// Il codice delle proposte 2-4 resta ma non si usa (S.q è sempre 1).\n// Giro 1: la scheda della tappa e «visitato», quattro proposte dentro C «Mappa prima» e D «Le pagine»');

// stato: lo stile del timbro (1-3) e gli ordini lasciati così («Lascia così» nel consiglio)
sost("const CHIAVE = 'prova-scheda-1';", "const CHIAVE = 'prova-scheda-2';");
sost("oggi: S.oggi, quando: Date.now() }",
  "oggi: S.oggi, ordineOk: S.ordineOk, quando: Date.now() }");
sost("data: typeof x.data === 'string' ? x.data : null, oggi: !!x.oggi };",
  "data: typeof x.data === 'string' ? x.data : null, oggi: !!x.oggi, ordineOk: x.ordineOk && typeof x.ordineOk === 'object' ? x.ordineOk : {} };");
sost("modifica: false, anima: true, fini: {}, ...richiama() });",
  "modifica: false, anima: true, fini: {}, ordineOk: {}, ...richiama() });");
sost("const S = { p: 'c', q: 1, ...NUOVO() };", "const S = { p: 'c', q: 1, t: 1, ...NUOVO() };");

// ---------- il timbro sulla foto (tre stili) ----------
sost("  // le azioni della scheda: spostare in un altro giorno, togliere (con «Annulla» dopo)",
`  // «Visitata» nella scheda (giro 2, Enrico): un timbro tondo sul bordo della foto, come il sigillo della proposta 3 del giro 1.
  // Tre stili da scegliere (S.t): 1 il sigillo a trattini che diventa pieno; 2 il timbro postale con il giro di parole e la data;
  // 3 la medaglia del marchio, che si riempie di colore e chiude le soglie al centro.
  const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  const giornoSegnato = id => { const d = S.fatte[id] ? new Date(S.fatte[id]) : new Date(); return \`\${d.getDate()} \${MESI[d.getMonth()]}\`; };
  function timbro(id) {
    if (!nelViaggio(id) || !puoiSegnare()) return '';
    const vis = visitata(id), b = esc(T(id).breve);
    if (S.t === 2) return \`<button type="button" class="timbro timbro--2" data-azione="visitata" data-id="\${id}" aria-pressed="\${vis}"><svg class="timbro__giro" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs><path id="giro-\${id}" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0"/></defs><circle class="timbro__anello" cx="50" cy="50" r="46"/><circle class="timbro__anello timbro__anello--2" cx="50" cy="50" r="28"/><text><textPath href="#giro-\${id}">NAPOLI · NEXTSTOP · NAPOLI · NEXTSTOP ·</textPath></text></svg>\${soglia()}<span class="vh">\${b}: </span><span class="timbro__t">visitata</span><span class="timbro__data num" aria-hidden="true">\${giornoSegnato(id)}</span></button>\`;
    if (S.t === 3) return \`<button type="button" class="timbro timbro--3" data-azione="visitata" data-id="\${id}" aria-pressed="\${vis}"><i class="timbro__fondo" aria-hidden="true"></i>\${soglia()}<span class="vh">\${b}: </span><span class="timbro__t">visitata</span></button>\`;
    return \`<button type="button" class="timbro timbro--1" data-azione="visitata" data-id="\${id}" aria-pressed="\${vis}">\${soglia()}<span class="vh">\${b}: </span><span class="timbro__t">visitata</span></button>\`;
  }
  // le azioni della scheda: spostare in un altro giorno, togliere (con «Annulla» dopo)`);

// nella scheda (1): foto a tutta larghezza, il timbro sul bordo; sotto il nome la riga che dice quando l'hai segnata
sost("      $('.sch1__pagina', schEl).innerHTML = `<div class=\"sch1__foto\">${fotoScheda(id)}${credito(id)}</div>",
  "      $('.sch1__pagina', schEl).innerHTML = `<div class=\"sch1__foto\"><div class=\"sch1__cornice\">${fotoScheda(id)}${timbro(id)}</div>${credito(id)}</div>");
sost("        <p class=\"sch-quando\">${quandoTesto(id)}${p ? `<span>, tappa ${p.i + 1} di ${p.n}</span>` : ''}</p>\n        ${bottoneV(id)}\n",
  "        <p class=\"sch-quando\">${quandoTesto(id)}${p ? `<span>, tappa ${p.i + 1} di ${p.n}</span>` : ''}</p>\n        ${puoiSegnare() ? `<p class=\"sch-segnata\" data-sotto=\"${id}\">${visitata(id) ? quandoSegnata(id) : 'Tocca il timbro sulla foto quando ci sei stato'}</p>` : bottoneV(id)}\n");
sost("$$(`[data-sotto=\"${id}\"]`).forEach(x => { x.textContent = si ? quandoSegnata(id) : 'Tocca quando ci sei stato'; });",
  "$$(`[data-sotto=\"${id}\"]`).forEach(x => { x.textContent = si ? quandoSegnata(id) : x.classList.contains('sch-segnata') ? 'Tocca il timbro sulla foto quando ci sei stato' : 'Tocca quando ci sei stato'; });\n    $$(`.timbro[data-id=\"${id}\"] .timbro__data`).forEach(x => { x.textContent = giornoSegnato(id); });");

// l'idea della proposta 1, aggiornata
sost("'Nella giornata: il numero della tappa è una piccola porta; toccandola le soglie del marchio si chiudono e compare la spunta (visitata). A destra la maniglia: trascini per cambiare l\\'ordine.'],",
  "'Nella giornata: il numero della tappa è una piccola porta; toccandola le soglie del marchio si chiudono e compare la spunta (visitata). A destra la maniglia: trascini per cambiare l\\'ordine.',\n      'Nella scheda «visitata» è un timbro tondo sul bordo della foto: in alto scegli tra tre stili (Timbro 1, 2, 3). Se cambi l\\'ordine e c\\'è un ordine più corto, sopra le tappe compare il consiglio: «Usa questo ordine» o «Lascia così».'],");

// ---------- il consiglio dell'ordine più corto (come nel prototipo di oggi: src/scripts/itinerari/app.ts) ----------
sost("  // ---------- la strada fatta (proposta 4)",
`  // ---------- il consiglio dell'ordine più corto: compare se le tappe da fare (almeno 3) si possono mettere in un ordine con
  // almeno 5 minuti di spostamenti in meno (ordinePiuCorto del sito, la prima tappa resta la stessa). «Lascia così» lo toglie per
  // quell'ordine; se l'ordine cambia di nuovo, il consiglio torna. ----------
  const memoOrdine = new Map();
  function ordineCorto(g) {
    const l = S.giorni[g] || [], fatte = vivoOggi(g) ? fatteDi(l) : [], resto = l.filter(id => !fatte.includes(id));
    if (resto.length < 3) return null;
    const chiave = JSON.stringify([g, resto, S.data]);
    if (!memoOrdine.has(chiave)) {
      const giorni = S.giorni.map((x, k) => (k === g ? resto : x));
      memoOrdine.set(chiave, K.ordinePiuCorto(CITTA, itin(giorni), g));
    }
    const o = memoOrdine.get(chiave);
    return o && S.ordineOk[g] !== JSON.stringify(l) ? { ...o, fatte } : null;
  }
  const consiglio = (g = S.g, cl = '') => {
    const o = ordineCorto(g);
    if (!o) return '';
    return \`<div class="consiglio \${cl}" role="status"><p class="consiglio__t">\${ic('sposta', 20)}<span>C'è un ordine più corto</span></p><p class="consiglio__p">Cambiando l'ordine risparmi <b>\${durataLunga(o.risparmio)}</b> a piedi. La prima tappa resta la stessa.</p><div class="consiglio__az"><button type="button" class="consiglio__si onda" data-azione="ordina">Usa questo ordine</button><button type="button" class="consiglio__no onda" data-azione="ordine-ok">Lascia così</button></div></div>\`;
  };
  AZ.ordina = () => {
    const g = S.g, o = ordineCorto(g);
    if (!o) return;
    const prima = [...S.giorni[g]];
    aggiorna(() => { S.giorni[g] = [...o.fatte, ...o.ordine]; });
    avvisa(\`Ordine cambiato: \${durataLunga(o.risparmio)} a piedi in meno.\`, { testo: 'Annulla', fai: () => aggiorna(() => { S.giorni[g] = prima; S.ordineOk = { ...S.ordineOk, [g]: JSON.stringify(prima) }; }) });
  };
  AZ['ordine-ok'] = () => { const g = S.g; aggiorna(() => { S.ordineOk = { ...S.ordineOk, [g]: JSON.stringify(S.giorni[g]) }; }); annuncia('Ordine lasciato così'); };

  // ---------- la strada fatta (proposta 4)`);
sost("${Gx ? cammino(Gx, 'cammino--c') : ''}${modificaB}</div>",
  "${Gx ? cammino(Gx, 'cammino--c') : ''}${modificaB}${Gx && !S.modifica ? consiglio(S.g, 'consiglio--c') : ''}</div>");
sost("${qui ? cammino(Gx, 'cammino--d') : ''}${modificaB}",
  "${qui ? cammino(Gx, 'cammino--d') : ''}${modificaB}${!S.modifica ? consiglio(g, 'consiglio--d') : ''}");

// ---------- la striscia della prova: Timbro 1-3 e la vista; la proposta è sempre la 1 ----------
sost("    $$('#prova [data-q]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.q === S.q)));",
  "    $$('#prova [data-q]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.q === S.t)));");
sost("    $('#p-nome').textContent = `${S.q} · ${Q[S.q].nome}`;\n    $('#idea').innerHTML = `<h2>${S.q} · ${Q[S.q].nome}</h2>",
  "    $('#p-nome').textContent = `Timbro ${S.t}`;\n    $('#idea').innerHTML = `<h2>La scelta: il foglio, con il timbro ${S.t}</h2>");
sost("<p class=\"idea__nota\">In tutte: «visitata» con la soglia del marchio che si chiude",
  "<p class=\"idea__nota\">Timbro 1: il sigillo a trattini che diventa pieno. Timbro 2: il timbro postale, con il giro di parole e il giorno. Timbro 3: la medaglia del marchio, che si riempie di colore.</p><p class=\"idea__nota\">Come nel giro 1: «visitata» con la soglia del marchio che si chiude");
sost("$$('#prova [data-q]').forEach(b => b.addEventListener('click', () => { if (+b.dataset.q !== S.q) location.hash = `${S.p}${b.dataset.q}`; }));",
  "$$('#prova [data-q]').forEach(b => b.addEventListener('click', () => { if (+b.dataset.q !== S.t) location.hash = `${S.p}${b.dataset.q}`; }));");
sost("$$('#prova [data-p]').forEach(b => b.addEventListener('click', () => { if (b.dataset.p !== S.p) location.hash = `${b.dataset.p}${S.q}`; }));",
  "$$('#prova [data-p]').forEach(b => b.addEventListener('click', () => { if (b.dataset.p !== S.p) location.hash = `${b.dataset.p}${S.t}`; }));");
sost("const h = location.hash.slice(1), m = /^([cd])?([1-4])?$/.exec(h) || [];",
  "const h = location.hash.slice(1), m = /^([cd])?([1-3])?$/.exec(h) || [];");
sost("q = +(m[2] || S.q || 1);\n    if (!primo && p === S.p && q === S.q) return;",
  "q = 1, t = +(m[2] || S.t || 1);\n    if (!primo && p === S.p && t === S.t) return;");
sost("Object.assign(S, { ...NUOVO(), p, q, anima: primo || p !== S.p });",
  "Object.assign(S, { ...NUOVO(), p, q, t, anima: primo || p !== S.p });");
sost("const firma = (cl = '') => `<a class=\"firma ${cl}\" href=\"#${S.p}${S.q}\">", "const firma = (cl = '') => `<a class=\"firma ${cl}\" href=\"#${S.p}${S.t}\">");
sost("Object.assign(S, { ...NUOVO(), p: S.p, q: S.q });", "Object.assign(S, { ...NUOVO(), p: S.p, q: S.q, t: S.t });");
sost("localStorage.setItem('prova-scheda-vista', p);", "localStorage.setItem('prova-scheda-vista', p);");
sost("localStorage.getItem('prova-scheda-idea')", "localStorage.getItem('prova-scheda-idea-2')");
sost("localStorage.setItem('prova-scheda-idea', '1')", "localStorage.setItem('prova-scheda-idea-2', '1')");
fs.writeFileSync(f, s);
console.log('ok');
