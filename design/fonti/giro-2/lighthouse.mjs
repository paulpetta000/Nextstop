// Lighthouse mobile con il comando già autorizzato; segnalazione errori disattivata.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const demo = path.dirname(fileURLToPath(import.meta.url));
const summary = [];
let failed = false;
for (const key of ['a', 'b', 'c', 'd']) for (const theme of ['light', 'dark']) {
  const output = path.join(demo, `verifiche/lighthouse-${key}-${theme}.json`);
  const result = spawnSync(process.execPath, [
    'C:/Users/Windows11/tools/controlli/node_modules/lighthouse/cli/index.js',
    `http://127.0.0.1:4344/design/fonti/giro-2/${key}.html`,
    '--no-enable-error-reporting', '--quiet', '--only-categories=performance,accessibility,best-practices',
    '--form-factor=mobile',
    `--chrome-flags=--headless=new --disable-background-networking --disable-component-update --no-first-run${theme === 'dark' ? ' --force-dark-mode' : ''}`,
    '--output=json', `--output-path=${output}`
  ], { encoding: 'utf8', env: { ...process.env, CHROME_PATH: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } });
  if (result.status !== 0) { console.error(result.stderr); failed = true; continue; }
  const report = JSON.parse(fs.readFileSync(output, 'utf8'));
  const row = { key, theme, performance: report.categories.performance.score * 100, accessibility: report.categories.accessibility.score * 100, bestPractices: report.categories['best-practices'].score * 100, lcp: report.audits['largest-contentful-paint'].numericValue, cls: report.audits['cumulative-layout-shift'].numericValue, warnings: report.runWarnings };
  summary.push(row);
  if (row.performance < 95 || row.accessibility < 100) failed = true;
  console.log(`${key.toUpperCase()} ${theme}: performance ${row.performance}, accessibilità ${row.accessibility}, buone pratiche ${row.bestPractices}`);
}
fs.writeFileSync(path.join(demo, 'verifiche/lighthouse-riepilogo.json'), JSON.stringify(summary, null, 2) + '\n');
if (failed) process.exitCode = 1;
