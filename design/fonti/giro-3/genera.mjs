// Correzione circoscritta di D, derivata dal giro precedente che resta conservato.
import fs from 'node:fs';
const dir = new URL('.', import.meta.url);
const cases = ['d.html', 'd-lungo.html', 'd-breve.html', 'd-vuoto.html'];
for (const name of cases) {
  const previous = fs.readFileSync(new URL('../giro-2/' + name, dir), 'utf8');
  const html = previous
    .replaceAll('<p class="pending">Scopo da verificare</p>', '')
    .replaceAll('<div class="source-subject"></div>', '')
    .replace('href="prototipi.css"', 'href="../giro-2/prototipi.css"')
    .replace('src="prototipi.js"', 'src="../giro-2/prototipi.js"')
    .replaceAll('href="index.html"', 'href="../giro-2/index.html"')
    .replace(/href="([abc](?:-lungo|-breve|-vuoto)?\.html)"/g, 'href="../giro-2/$1"')
    .replace('Gli scopi non ancora verificati sono segnalati; i luoghi collegati servono a trovare la fonte, non a confermare i fatti.', 'Le descrizioni mancanti restano nel piano di lavoro interno; i luoghi collegati aiutano a trovare la fonte.')
    .replace('Secondo giro delle fonti · Prototipi locali, in attesa della scelta.', 'D · Dicitura interna rimossa · Prototipo locale, senza integrazione nel sito.');
  fs.writeFileSync(new URL(name, dir), html);
}
console.log('D aggiornata nei quattro casi; nessuna dicitura interna o nuova descrizione inventata.');
