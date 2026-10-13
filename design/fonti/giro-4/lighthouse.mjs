// Lighthouse mobile con il comando già autorizzato; segnalazione errori disattivata.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const demo = path.dirname(fileURLToPath(import.meta.url));
const summary = [];
let failed = false;
const keys = process.argv[2] ? [process.argv[2]] : ['d', 'd-lungo'];
const themes = process.argv[3] ? [process.argv[3]] : ['light', 'dark'];
if (keys.some(key => !['d', 'd-lungo'].includes(key)) || themes.some(theme => !['light', 'dark'].includes(theme))) throw new Error('Caso o tema non previsto.');
for (const key of keys) for (const theme of themes) {
  const output = path.join(demo, `verifiche/lighthouse-${key}-${theme}.json`);
  const result = spawnSync(process.execPath, [
    'C:/Users/Windows11/tools/controlli/node_modules/lighthouse/cli/index.js',
    `http://127.0.0.1:4346/design/fonti/giro-4/${key}.html`,
    '--no-enable-error-reporting', '--quiet', '--only-categories=performance,accessibility,best-practices',
    '--form-factor=mobile',
    `--chrome-flags=--headless=new --disable-background-networking --disable-component-update --no-first-run${theme === 'dark' ? ' --force-dark-mode' : ''}`,
    '--output=json', `--output-path=${output}`
  ], { encoding: 'utf8', env: { ...process.env, CHROME_PATH: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } });
  if (result.status !== 0) { console.error(JSON.stringify({ status: result.status, signal: result.signal, error: result.error?.message, stderr: result.stderr, stdout: result.stdout.slice(0, 1000) })); failed = true; continue; }
  const report = JSON.parse(fs.readFileSync(output, 'utf8'));
  const row = { key, theme, performance: report.categories.performance.score * 100, accessibility: report.categories.accessibility.score * 100, bestPractices: report.categories['best-practices'].score * 100, lcp: report.audits['largest-contentful-paint'].numericValue, cls: report.audits['cumulative-layout-shift'].numericValue, warnings: report.runWarnings };
  summary.push(row);
  if (row.performance < 95 || row.accessibility < 100) failed = true;
  console.log(`${key.toUpperCase()} ${theme}: performance ${row.performance}, accessibilità ${row.accessibility}, buone pratiche ${row.bestPractices}`);
}
const summaryPath = path.join(demo, 'verifiche/lighthouse-riepilogo.json');
const previous = process.argv[2] && fs.existsSync(summaryPath) ? JSON.parse(fs.readFileSync(summaryPath, 'utf8')).filter(row => !summary.some(next => next.key === row.key && next.theme === row.theme)) : [];
fs.writeFileSync(summaryPath, JSON.stringify([...previous, ...summary], null, 2) + '\n');
if (failed) process.exitCode = 1;
