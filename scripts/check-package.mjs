import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const consumer = resolve(root, 'fixtures/consumer');
const npm = process.env.npm_execpath;
assert(npm, 'Run this check through npm run test:package');
function run(args, cwd = root, capture = false) {
  const result = spawnSync(process.execPath, [npm, ...args], {
    cwd, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `npm ${args.join(' ')} failed`);
  return result.stdout;
}

run(['run', 'check:release']);
run(['run', 'build:lib']);
const [archive] = JSON.parse(run(['pack', '--ignore-scripts', '--json', '--cache', '.npm-cache'], root, true));
const files = new Set(archive.files.map(file => file.path));
for (const required of ['dist/index.js', 'dist/index.d.ts', 'dist/theme.css', 'dist/fonts.css',
  'dist/fonts/Monocraft.ttf', 'dist/fonts/OFL-Monocraft.txt',
  'README.md', 'LICENSE', 'CHANGELOG.md', 'docs/composition.md', 'docs/agents/using.md', 'docs/agents/maintaining.md', 'docs/agents/feedback.md']) {
  assert(files.has(required), `Package missing ${required}`);
}
for (const file of files) {
  assert(/^(dist\/|docs\/agents\/|docs\/(components|composition|design-system)\.md$|package\.json$|README\.md$|CHANGELOG\.md$|LICENSE)/i.test(file),
    `Unexpected published file: ${file}`);
}
// README and shipped guides must not direct installed-package users to absent files.
for (const file of files) {
  if (!file.endsWith('.md')) continue;
  const markdown = readFileSync(resolve(root, file), 'utf8');
  for (const match of markdown.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^(?:[a-z]+:|\/)/i.test(target)) continue;
    const resolved = new URL(target, `https://package.invalid/${file}`).pathname.slice(1);
    assert(files.has(resolved), `Broken shipped link in ${file}: ${target}`);
  }
}
run(['install', resolve(root, archive.filename), '--no-save', '--package-lock=false', '--cache', resolve(root, '.npm-cache')], consumer);
for (const script of ['check', 'build', 'build:ssr']) run(['run', script], consumer);
const { verifySSR } = await import(pathToFileURL(resolve(consumer, 'ssr-dist/ssr.js')).href);
assert.equal(verifySSR().ok, true);
console.log(`Package verified: ${archive.filename}; ${files.size} files; installed consumer and SSR passed.`);
