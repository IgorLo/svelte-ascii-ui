import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRelease } from '../scripts/release-policy.mjs';

const entry = '### Fixed\n- FileInput clears the selected filename when selection is removed.';
const input = (version = '0.1.1') => ({
  version, lockVersion: version, lockPackageVersion: version,
  changelog: `# Changelog\n\n## [Unreleased]\n\n## [${version}] - 2026-11-08\n\n${entry}\n`,
  today: '2026-11-08',
});

test('a documented stable version supplies the human release notes', () => {
  assert.equal(validateRelease(input()).notes, entry);
});

test('release refuses a missing, empty or placeholder changelog entry', () => {
  for (const changelog of ['# Changelog', '## [0.1.1] - 2026-11-08\n', '## [0.1.1] - 2026-11-08\n### Fixed\n- TODO']) {
    assert.throws(() => validateRelease({ ...input(), changelog }));
  }
});

test('release refuses dev versions, a mismatching tag or lockfile', () => {
  assert.throws(() => validateRelease(input('0.2.0-dev.1')), /stable/);
  assert.throws(() => validateRelease({ ...input(), tag: 'v0.1.2' }), /tag/);
  assert.throws(() => validateRelease({ ...input(), lockVersion: '0.1.0' }), /lock/);
});

test('ordinary checks allow Unreleased notes, publication requires moving them into the release', () => {
  const value = { ...input(), changelog: input().changelog.replace('## [Unreleased]', '## [Unreleased]\n### Added\n- A new component.') };
  validateRelease(value);
  assert.throws(() => validateRelease({ ...value, publishing: true, published: ['0.1.0'] }), /Unreleased/);
});

test('release refuses reused or older versions and compares numeric segments', () => {
  for (const published of [['0.1.1'], ['0.2.0'], ['0.10.0']]) {
    assert.throws(() => validateRelease({ ...input(), publishing: true, published }), /published|newer/);
  }
  validateRelease({ ...input('0.10.0'), publishing: true, published: ['0.9.0', '0.0.0-stage'] });
});

test('major release requires an explicit approval matching that exact version', () => {
  const value = { ...input('1.0.0'), publishing: true, published: ['0.9.0'] };
  assert.throws(() => validateRelease(value), /APPROVED_MAJOR_VERSION/);
  assert.throws(() => validateRelease({ ...value, approvedMajor: '2.0.0' }), /APPROVED_MAJOR_VERSION/);
  validateRelease({ ...value, approvedMajor: '1.0.0' });
});

test('release refuses duplicate versions, invalid dates and a missing release body', () => {
  assert.throws(() => validateRelease({ ...input(), changelog: input().changelog + '\n## [0.1.1] - 2026-11-08\n' }), /Duplicate/);
  assert.throws(() => validateRelease({ ...input(), changelog: input().changelog.replace('2026-11-08', '2026-02-30') }), /date/);
  assert.throws(() => validateRelease({ ...input(), releaseBody: '' }), /body/);
  assert.throws(() => validateRelease({ ...input(), releaseBody: 'Various improvements' }), /body/);
  validateRelease({ ...input(), releaseBody: entry });
});
