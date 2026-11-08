import assert from 'node:assert/strict';

const stable = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const normalize = text => text.replace(/\r\n/g, '\n').trim();
const compare = (a, b) => {
  const left = a.split('.').map(Number), right = b.split('.').map(Number);
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
};

export function validateRelease({ version, lockVersion, lockPackageVersion, changelog,
  tag, publishing = false, published = [], approvedMajor, releaseBody,
  today = new Date().toISOString().slice(0, 10) }) {
  assert(stable.test(version), 'Only stable x.y.z versions can use this release flow');
  assert.equal(lockVersion, version, 'package-lock version must match package.json');
  assert.equal(lockPackageVersion, version, 'package-lock root package version must match');
  if (tag !== undefined) assert.equal(tag, `v${version}`, 'Release tag must match package.json');

  const text = normalize(changelog);
  const headings = [...text.matchAll(/^## (.+)$/gm)];
  const entries = new Map();
  for (let i = 0; i < headings.length; i++) {
    const [, heading] = headings[i];
    const match = /^\[(Unreleased|\d+\.\d+\.\d+)\](?: - (\d{4}-\d{2}-\d{2}))?$/.exec(heading);
    assert(match, `Invalid changelog heading: ${heading}`);
    const [, key, date] = match;
    assert(!entries.has(key), `Duplicate changelog entry: ${key}`);
    if (key !== 'Unreleased') {
      assert(stable.test(key), `Invalid changelog version: ${key}`);
      assert(date && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date && date <= today,
        `Invalid or future release date: ${date}`);
    }
    entries.set(key, normalize(text.slice(headings[i].index + headings[i][0].length, headings[i + 1]?.index)));
  }
  const notes = entries.get(version);
  assert(notes && /^- \S.+/m.test(notes), `Missing or empty changelog entry for ${version}`);
  assert(!/\b(TODO|TBD|FIXME)\b|coming soon|no changes yet/i.test(notes), 'Replace changelog placeholders with release notes');
  const versions = [...entries.keys()].filter(key => key !== 'Unreleased');
  assert.equal(versions[0], version, 'Current version must be the first version in CHANGELOG.md');
  for (let i = 1; i < versions.length; i++) assert(compare(versions[i - 1], versions[i]) > 0, 'Changelog versions must be newest first');
  if (releaseBody !== undefined) assert.equal(normalize(releaseBody), notes, 'GitHub Release body must match release:notes');

  if (publishing) {
    assert(!entries.get('Unreleased'), 'Move Unreleased notes into the versioned release before publishing');
    assert(Array.isArray(published) && published.every(item => typeof item === 'string'), 'Invalid registry versions response');
    assert(!published.includes(version), `Version ${version} is already published; choose a new version`);
    const previous = published.filter(item => stable.test(item)).sort(compare).at(-1);
    if (previous) {
      assert(compare(version, previous) > 0, `Version must be newer than ${previous}`);
      if (Number(version.split('.')[0]) > Number(previous.split('.')[0])) {
        assert.equal(approvedMajor, version, 'Major release requires human-set APPROVED_MAJOR_VERSION matching the exact version');
      }
    }
  }
  return { notes };
}
