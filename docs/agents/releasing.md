# Changes and releases

## Record changes while doing the work

Start ordinary task branches from up-to-date develop and target develop in their PRs. Develop accumulates verified changes; main is the release branch. Both require the `verify` check, an up-to-date branch and resolved conversations; direct pushes, force pushes and deletion are blocked, including for admins. PRs do not require a second person's approval because this repository can be maintained by one person. Do not bypass or relax branch protection.

Keep the package version unchanged during ordinary work. Run `npm run changeset` and commit a new `.changeset/<unique-name>.md` with the package bump type and a human-written description. Parallel tasks own separate files. CI requires each ordinary PR to add its own changeset; earlier pending files do not satisfy that requirement. For a change with no release impact, use `npm run changeset -- --empty` and add the reason in the file body. A merge into develop or main never publishes by itself.

Changesets collects all pending descriptions and uses the highest bump type once: patch + minor produces one minor release. `CHANGELOG.md` contains released history only; pending notes live exclusively in changeset files. Use `npm run check:changesets` to validate the batch and preview its next version without modifying files.

Only an explicit human request authorizes release preparation (including version bumps), tagging or publication. Approval to implement, review or merge changes does not authorize any of these actions. Keep collecting changesets until that request arrives.

When a release is requested, create a release branch from develop, consolidate the whole batch and bump the version once. Merge preparation back into develop through a passing PR, then open develop → main as the release PR. Use a merge commit for this promotion to preserve the shared history of the long-lived branches. After release, merge main back into develop through a passing PR before starting the next batch. If an urgent fix must start from main, include its versioned notes in the hotfix release and merge it back into develop; retain unrelated pending changesets there.

For each task, review its diff against develop; when preparing a release, review the whole batch against the latest published tag. Describe its user-visible effect in its new changeset in the same PR. Include component behavior, public props/types/defaults, visual and accessibility changes, installation/runtime requirements, removed behavior and required migration steps. Contributor workflow changes belong there when they affect how people build, test or release the library. Pure refactors with no observable effect use an empty changeset explaining why no release is needed. Completion: every meaningful effect is represented once, and unrelated history is left intact.

## Write for readers

Write changeset summaries and release notes in English using ordinary, concrete language. Use `Added`, `Changed`, `Fixed`, `Deprecated`, `Removed` or `Security` subsections only when needed. Each bullet names the affected component or behavior and explains what the reader can now do or what no longer goes wrong. Merge several commits addressing the same outcome into one bullet. Include an old-to-new example or upgrade instruction when a consumer must act.

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

**Only a human may set the GitHub repository variable `APPROVED_MAJOR_VERSION` to the exact proposed version after explicitly approving it.** Agents must not set this variable, infer approval from a general release request, or weaken the gate. CI and `release:version` also require the matching approval before accepting a major changeset or applying its version bump. For local major preparation, the human supplies the same exact-version approval through the `APPROVED_MAJOR_VERSION` environment variable; agents must not set it themselves. The release validator compares against the highest stable version on npm and requires this value for a major increase. Clear it after the major release. Administrators retain the ability to change repository settings, so this is an explicit approval gate, not proof of a person's intent.

## Prepare and publish

1. Review `npm run check:changesets` against the version policy. On the release preparation branch run `npm run release:version`. This npm script checks the major approval, runs the standard `changeset version` command, then runs `npm install --package-lock-only --ignore-scripts`. Changesets owns version/changelog generation and npm owns lockfile updates. Review and consolidate generated notes without dropping significant changes; update affected fixture/install examples. Completion: one version bump, no pending changesets, a complete standard Changesets changelog entry, and no placeholders. Use this command sequence so approval checks and lockfile updates are retained. Keep the standard changelog format; historical dated entries remain unchanged. If preparation fails after modifying files, inspect the diff and fix or restore the preparation changes before retrying.
2. Run `npm run check:release`, relevant tests and `npm run test:package`. Follow the develop → main promotion above and merge after required checks pass. Completion: the intended release commit belongs to protected main.
3. Run `npm run release:notes --silent` and use its output as the GitHub Release body, without adding generated commit lists. Tag the merged commit as `v<x.y.z>`. Publish the GitHub Release only when authorized. Completion: the tag, package, lockfile, changelog and release body agree.
4. The publish workflow rejects commits outside main, prerelease version strings, reused/older npm versions, missing notes, unconsumed changesets and unapproved major bumps. Registry errors stop publication. See [trusted publishing setup](maintaining.md#github-release-workflow). Completion: GitHub checks and npm publication succeed, then verify installation from npm.

Published npm versions are immutable. Never try to replace one, move its Git tag, or edit its changelog entry to describe later code. Correct the implementation or documentation in a new version. A manual publish-workflow dispatch validates the working tree and archive without publishing; it deliberately allows the current published version and pending changesets. It does not validate OIDC authentication or prove a new version is available.

Use Changesets only for descriptions and version preparation. Publication remains in the GitHub Release workflow; do not use `changeset publish` or an automatic publishing bot.
