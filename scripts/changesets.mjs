import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { getReleasePlan } from '@changesets/get-release-plan';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(import.meta.resolve('@changesets/cli/bin.js'));
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const run = args => execFileSync(process.execPath, [cli, ...args], { stdio: 'inherit' });
try {
  const plan = await getReleasePlan(process.cwd());
  assert(!plan.preState, 'Prerelease mode is not supported by this stable release flow');
  const pkg = json('package.json');
  for (const change of plan.changesets) {
    assert(change.summary.trim(), `Changeset ${change.id} needs a description, including empty changesets`);
    assert(!/\b(TODO|TBD|FIXME)\b/i.test(change.summary), 'Replace changeset placeholders');
    assert(change.releases.every(release => release.name === pkg.name), 'Unexpected package in changeset');
  }
  const release = plan.releases.find(release => release.name === pkg.name);
  if (release?.type === 'major') {
    assert.equal(process.env.APPROVED_MAJOR_VERSION, release.newVersion,
      'Major change requires human-set APPROVED_MAJOR_VERSION matching the planned version');
  }
  const base = process.env.CHANGESET_BASE;
  if (base) {
    assert(/^[a-f0-9]{40}$/i.test(base), 'CHANGESET_BASE must be a full commit SHA');
    const old = JSON.parse(execFileSync('git', ['show', `${base}:package.json`], { encoding: 'utf8' }));
    if (old.version === pkg.version) {
      const changed = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { encoding: 'utf8' }).trim();
      const added = execFileSync('git', ['diff', '--name-only', '--diff-filter=A', base, 'HEAD', '--', '.changeset'], { encoding: 'utf8' }).trim().split(/\r?\n/);
      assert(!changed || plan.changesets.some(change => added.includes(`.changeset/${change.id}.md`)),
        'Each ordinary PR needs a new changeset; use an empty changeset with a reason for changes that need no release');
    } else {
      assert.equal(plan.changesets.length, 0, 'A release PR must consume all pending changesets');
    }
  }
  if (process.argv[2] === 'version') {
    assert(release, 'No pending release changesets');
    const lock = json('package-lock.json');
    assert.equal(lock.version, pkg.version, 'Lockfile version mismatch');
    assert.equal(lock.packages[''].version, pkg.version, 'Root lockfile version mismatch');
    const previous = readFileSync('CHANGELOG.md', 'utf8').replace(/\r\n/g, '\n');
    assert(!previous.includes('## [Unreleased]'), 'Move pending notes into changesets first');
    run(['version']);
    const version = json('package.json').version;
    assert.equal(version, release.newVersion, 'Unexpected generated version');
    const generated = readFileSync('CHANGELOG.md', 'utf8').replace(/\r\n/g, '\n');
    const heading = `## ${version}\n`;
    assert(generated.includes(heading), 'Unexpected Changesets changelog format; inspect changes before committing');
    writeFileSync('CHANGELOG.md', generated.replace(heading, `## [${version}] - ${new Date().toISOString().slice(0, 10)}\n`));
    lock.version = version;
    lock.packages[''].version = version;
    writeFileSync('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
    console.log(`Prepared ${version}. Review the changelog and run check:release; nothing was published.`);
  } else {
    assert.equal(process.argv[2], 'check', 'Use check or version');
    console.log(`Changesets valid: ${plan.changesets.length} pending; next version: ${release?.newVersion ?? 'none'}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
