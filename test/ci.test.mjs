import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import yaml from 'js-yaml';

const workflow = yaml.load(readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8'));
const checkout = workflow.jobs.verifica.steps[0].run;
const bash = process.platform === 'win32' ? path.join(process.env.ProgramFiles, 'Git/bin/bash.exe') : 'bash';

// Nessuna rete: il repository remoto è una cartella temporanea con due commit fittizi.
function scenario(t, ref) {
  const root = mkdtempSync(path.join(tmpdir(), 'nextstop-ci-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(tmpdir()));
    assert.ok(path.basename(root).startsWith('nextstop-ci-'));
    rmSync(root, { recursive: true, force: true });
  });
  const source = path.join(root, 'source');
  const runner = path.join(root, 'runner');
  const remote = path.join(root, 'repo.git');
  mkdirSync(source); mkdirSync(runner);
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: path.join(root, 'no-config'),
    GIT_TERMINAL_PROMPT: '0', GIT_AUTHOR_NAME: 'Test', GIT_AUTHOR_EMAIL: 'test@example.invalid',
    GIT_COMMITTER_NAME: 'Test', GIT_COMMITTER_EMAIL: 'test@example.invalid' };
  const git = (cwd, ...args) => {
    const r = spawnSync('git', args, { cwd, env, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr || String(r.error));
    return r.stdout.trim();
  };
  git(root, 'init', '--bare', '--quiet', remote);
  git(source, 'init', '--quiet');
  writeFileSync(path.join(source, 'example.txt'), 'evento\n');
  git(source, 'add', '.'); git(source, 'commit', '--quiet', '-m', 'Evento');
  const expected = git(source, 'rev-parse', 'HEAD');
  git(source, 'push', '--quiet', remote, `HEAD:${ref}`);
  writeFileSync(path.join(source, 'example.txt'), 'successivo\n');
  git(source, 'commit', '--quiet', '-am', 'Successivo');
  const newer = git(source, 'rev-parse', 'HEAD');
  git(source, 'push', '--quiet', remote, `HEAD:${ref}`);
  return { expected, newer, git, runner, removeRef: () => git(source, 'push', '--quiet', remote, `:${ref}`),
    run: (sha = expected) => spawnSync(bash, ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', checkout], {
      cwd: runner, env: { ...env, GITHUB_SERVER_URL: root.replaceAll('\\', '/'), GITHUB_REPOSITORY: 'repo',
        GITHUB_REF: ref, GITHUB_SHA: sha, GH_TOKEN: 'synthetic-test-token' }, encoding: 'utf8'
    }) };
}

test('CI copre PR, main e avvio manuale mantenendo permessi minimi', () => {
  assert.deepEqual(workflow.on.pull_request.branches, ['main']);
  assert.deepEqual(workflow.on.push?.branches, ['main']);
  assert.ok(Object.hasOwn(workflow.on, 'workflow_dispatch'));
  assert.deepEqual(workflow.permissions, { contents: 'read' });
});

for (const [name, ref] of [['PR avanzata', 'refs/pull/4/merge'], ['main avanzato', 'refs/heads/main']]) {
  test(`CI verifica il commit dell'evento anche con ${name}`, t => {
    const s = scenario(t, ref);
    const r = s.run();
    assert.equal(r.status, 0, r.stderr || String(r.error));
    assert.equal(s.git(s.runner, 'rev-parse', 'HEAD'), s.expected);
    assert.notEqual(s.expected, s.newer);
    assert.equal(s.git(s.runner, 'config', '--local', '--get-regexp', '^remote\\.origin\\.url$').includes('synthetic-test-token'), false);
    const config = readFileSync(path.join(s.runner, '.git/config'), 'utf8');
    assert.doesNotMatch(config, /extraheader|synthetic-test-token/i);
  });
}

test('CI recupera il commit ancora disponibile quando la ref della PR non esiste più', t => {
  const s = scenario(t, 'refs/pull/4/merge');
  s.removeRef();
  const r = s.run();
  assert.equal(r.status, 0, r.stderr || String(r.error));
  assert.equal(s.git(s.runner, 'rev-parse', 'HEAD'), s.expected);
});

test('CI fallisce senza sostituire il commit richiesto se non è disponibile', t => {
  const s = scenario(t, 'refs/heads/main');
  const r = s.run('a'.repeat(40));
  assert.notEqual(r.status, 0);
  const head = spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: s.runner, encoding: 'utf8' });
  assert.notEqual(head.status, 0);
});

test('CI rifiuta un identificativo di commit malformato', t => {
  const s = scenario(t, 'refs/heads/main');
  const r = s.run('main');
  assert.notEqual(r.status, 0);
});
