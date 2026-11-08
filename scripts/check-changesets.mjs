import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { getReleasePlan } from '@changesets/get-release-plan';

const json = path => JSON.parse(readFileSync(path, 'utf8'));
try {
  const plan = await getReleasePlan(process.cwd());
  assert(!plan.preState, 'Prerelease mode is not supported by this stable release flow');
  const pkg = json('package.json');
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
  console.log(`Changesets valid: ${plan.changesets.length} pending; next version: ${release?.newVersion ?? 'none'}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
