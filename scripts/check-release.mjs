import { readFileSync, readdirSync } from 'node:fs';
import { validateRelease } from './release-policy.mjs';

try {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  const publishing = process.argv.includes('--publish');
  const event = process.env.GITHUB_EVENT_NAME === 'release'
    ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')).release : undefined;
  let published = [];
  if (publishing) {
    const pending = readdirSync('.changeset').filter(file => file.endsWith('.md') && file !== 'README.md');
    if (pending.length) throw new Error('Consume pending changesets with release:version before publishing');
    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Cannot verify npm versions (HTTP ${response.status}); publication stopped`);
    const metadata = await response.json();
    if (!metadata.versions || typeof metadata.versions !== 'object') throw new Error('Registry did not return package versions');
    published = Object.keys(metadata.versions);
  }
  const { notes } = validateRelease({
    version: pkg.version, lockVersion: lock.version, lockPackageVersion: lock.packages?.['']?.version,
    changelog: readFileSync('CHANGELOG.md', 'utf8'), publishing, published,
    tag: event?.tag_name, releaseBody: event?.body,
    approvedMajor: process.env.APPROVED_MAJOR_VERSION,
  });
  console.log(process.argv.includes('--notes') ? notes : `Release metadata and changelog valid for ${pkg.version}`);
} catch (error) {
  console.error(`Release blocked: ${error.message}`);
  process.exitCode = 1;
}
