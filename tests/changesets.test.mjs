import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateRelease } from '../scripts/release-policy.mjs';

const root = process.cwd();
function fixture(t, types) {
  const cwd = mkdtempSync(join(tmpdir(), 'ascii-changesets-test-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  mkdirSync(join(cwd, '.changeset'));
  const config = JSON.parse(readFileSync(join(root, '.changeset/config.json')));
  config.changelog = import.meta.resolve('@changesets/cli/changelog');
  writeFileSync(join(cwd, '.changeset/config.json'), JSON.stringify(config));
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ name: 'svelte-ascii-ui', version: '0.1.0' }));
  writeFileSync(join(cwd, 'package-lock.json'), JSON.stringify({ name: 'svelte-ascii-ui', version: '0.1.0', lockfileVersion: 3, packages: { '': { name: 'svelte-ascii-ui', version: '0.1.0' } } }));
  writeFileSync(join(cwd, 'CHANGELOG.md'), '# Changelog\n\n## [0.1.0] - 2026-01-01\n\n- Initial release.\n');
  types.forEach((type, i) => writeFileSync(join(cwd, '.changeset', `change-${i}.md`), `---\n"svelte-ascii-ui": ${type}\n---\n\nDescription ${i}.\n`));
  return cwd;
}
function run(cwd, command, extra = {}) {
  return spawnSync(process.execPath, [resolve(root, 'scripts/check-changesets.mjs')], {
    cwd, encoding: 'utf8', env: { ...process.env, CHANGESET_BASE: '', APPROVED_MAJOR_VERSION: '', ...extra },
  });
}
test('patch plus minor prepares one minor release, consumes notes and preserves history', t => {
  const cwd = fixture(t, ['patch', 'minor']);
  const result = spawnSync(process.execPath, [fileURLToPath(import.meta.resolve('@changesets/cli/bin.js')), 'version'], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const lockUpdate = spawnSync('npm', ['install', '--package-lock-only', '--ignore-scripts', '--offline', '--no-audit', '--no-fund'], { cwd, encoding: 'utf8', shell: process.platform === 'win32' });
  assert.equal(lockUpdate.status, 0, lockUpdate.stdout + lockUpdate.stderr);
  const pkg = JSON.parse(readFileSync(join(cwd, 'package.json')));
  const lock = JSON.parse(readFileSync(join(cwd, 'package-lock.json')));
  assert.equal(pkg.version, '0.2.0');
  assert.equal(lock.version, pkg.version);
  assert.equal(lock.packages[''].version, pkg.version);
  const notes = readFileSync(join(cwd, 'CHANGELOG.md'), 'utf8');
  assert.match(notes, /## 0\.2\.0\n/);
  assert.match(notes, /Description 0/);
  assert.match(notes, /Description 1/);
  assert.match(notes, /## \[0\.1\.0\] - 2026-01-01/);
  assert.doesNotThrow(() => validateRelease({ version: pkg.version, lockVersion: lock.version,
    lockPackageVersion: lock.packages[''].version, changelog: notes, publishing: true, published: ['0.1.0'] }));
  const check = run(cwd, 'check');
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /0 pending/);
});
test('unapproved major stops before changing files', t => {
  const cwd = fixture(t, ['major']);
  const before = readFileSync(join(cwd, 'package.json'), 'utf8');
  const result = run(cwd, 'check');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /APPROVED_MAJOR_VERSION/);
  assert.equal(readFileSync(join(cwd, 'package.json'), 'utf8'), before);
  assert.equal(run(cwd, 'check', { APPROVED_MAJOR_VERSION: '1.0.0' }).status, 0);
});
test('ordinary PR requires its own changeset; a documented empty changeset is allowed', t => {
  const cwd = fixture(t, []);
  const git = args => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd, encoding: 'utf8' });
  git(['init', '-b', 'develop']);
  git(['add', '.']); git(['commit', '-m', 'Initial']);
  const base = git(['rev-parse', 'HEAD']).trim();
  writeFileSync(join(cwd, 'README.md'), 'Contributor-only clarification.');
  git(['add', '.']); git(['commit', '-m', 'Docs']);
  const result = run(cwd, 'check', { CHANGESET_BASE: base });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Each ordinary PR needs a new changeset/);
  writeFileSync(join(cwd, '.changeset', 'docs.md'), '---\n---\n\nContributor-only clarification; no consumer change.\n');
  git(['add', '.']); git(['commit', '-m', 'Explain no release']);
  const check = run(cwd, 'check', { CHANGESET_BASE: base });
  assert.equal(check.status, 0, check.stdout + check.stderr);
});
test('publication rejects pending changesets before registry access', t => {
  const cwd = fixture(t, ['patch']);
  const result = spawnSync(process.execPath, [resolve(root, 'scripts/check-release.mjs'), '--publish'], {
    cwd, encoding: 'utf8', env: { ...process.env, GITHUB_EVENT_NAME: '' },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Consume pending changesets/);
});
