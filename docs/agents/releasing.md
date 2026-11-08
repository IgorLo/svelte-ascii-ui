# Changes and releases

## Record changes while doing the work

Work on a named task branch, not main. Commit coherent verified changes and open a PR. Main requires the `verify` check, an up-to-date branch and resolved conversations; direct pushes, force pushes and deletion are blocked, including for admins. PRs do not require a second person's approval because this repository can be maintained by one person. Do not bypass or relax branch protection to complete a task.

For each change, review the diff against the latest published tag. Add its user-visible effect to `CHANGELOG.md` under `Unreleased` in the same PR. Include component behavior, public props/types/defaults, visual and accessibility changes, installation/runtime requirements, removed behavior and required migration steps. Contributor workflow changes belong there when they affect how people build, test or release the library. Pure refactors with no observable effect need no bullet; explain that omission in the PR. Completion: every meaningful effect is represented once, and unrelated history is left intact.

## Write for readers

Write release notes in English using ordinary, concrete language. Use `Added`, `Changed`, `Fixed`, `Deprecated`, `Removed` or `Security` subsections only when needed. Each bullet names the affected component or behavior and explains what the reader can now do or what no longer goes wrong. Merge several commits addressing the same outcome into one bullet. Include an old-to-new example or upgrade instruction when a consumer must act.

Good: `FileInput removes the filename after clearing the selected file.`

Too vague: `Various fixes and improvements.`

Describe the final shipped behavior, not the investigation, agent activity, file-by-file diff or implementation plan. Keep private project names and internal research out. Use `writing-for-agents` when available for agent instructions, but the rules here remain sufficient without installing a personal skill. A validator checks structure, not truth or completeness; review the notes against the full release diff before approving publication.

## Choose a version

| Change | Version policy |
| --- | --- |
| Compatible bug fix, accessibility correction, visual polish, documentation or tooling correction | Patch, such as 0.1.0 → 0.1.1 |
| New component, public capability or compatible option | Minor, such as 0.1.1 → 0.2.0 |
| Incompatible change while still below 1.0 | Minor with explicit migration notes; never hide it in a patch |
| Incompatible change after 1.0, or declaring 1.0 stability | Propose a major and wait for explicit human approval naming the target version |

Use the highest impact in the release. A fix that requires consumer changes is incompatible regardless of whether it is called a bug fix. After 1.0, if major approval is absent, preserve compatibility or defer the incompatible change; do not relabel it as minor. A version bump does not itself authorize publication.

**Only a human may set the GitHub repository variable `APPROVED_MAJOR_VERSION` to the exact proposed version after explicitly approving it.** Agents must not set this variable, infer approval from a general release request, or weaken the gate. The release validator compares against the highest stable version on npm and requires this value for a major increase. Clear it after the major release. Administrators retain the ability to change repository settings, so this is an explicit approval gate, not proof of a person's intent.

## Prepare and publish

1. Decide the version using the table. Update package.json and package-lock.json together, plus affected fixture/install examples. Move all Unreleased notes into `## [x.y.z] - YYYY-MM-DD`, newest release first, and leave an empty Unreleased section. Completion: the version entry is dated and complete, with no placeholders or pending notes.
2. Run `npm run check:release`, relevant tests and `npm run test:package`. Open the release PR and merge after required checks pass. Completion: the intended release commit belongs to protected main.
3. Run `npm run release:notes --silent` and use its output as the GitHub Release body, without adding generated commit lists. Tag the merged commit as `v<x.y.z>`. Publish the GitHub Release only when authorized. Completion: the tag, package, lockfile, changelog and release body agree.
4. The publish workflow rejects commits outside main, prerelease version strings, reused/older npm versions, missing notes, nonempty Unreleased entries and unapproved major bumps. Registry errors stop publication. See [trusted publishing setup](maintaining.md#github-release-workflow). Completion: GitHub checks and npm publication succeed, then verify installation from npm.

Published npm versions are immutable. Never try to replace one, move its Git tag, or edit its changelog entry to describe later code. Correct the implementation or documentation in a new version. A manual publish-workflow dispatch validates the working tree and archive without publishing; it deliberately allows the current published version and Unreleased notes. It does not validate OIDC authentication or prove a new version is available.
